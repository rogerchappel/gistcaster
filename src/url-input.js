import { createSourceRecord } from './source.js';
import { assertExplicitUrlFetch } from './safety.js';
import { extractMarkdownTitle, stripMarkdown } from './markdown.js';

export const DEFAULT_URL_TIMEOUT_MS = 10_000;

export async function captureUrl(input, options = {}, index = 0) {
  const safety = assertExplicitUrlFetch(input, options);
  if (!safety.allowed) {
    return {
      source: createSourceRecord({
        id: `source-${index + 1}`,
        type: 'url',
        locator: input,
        title: input,
        fetched: false,
        metadata: { note: safety.reason }
      }),
      content: ''
    };
  }

  const timeoutMs = options.urlTimeoutMs ?? DEFAULT_URL_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  let bytes;
  try {
    response = await fetch(input, { redirect: 'follow', signal: controller.signal });
    if (!response.ok) throw new Error(`Failed to fetch ${input}: HTTP ${response.status}`);
    bytes = await response.arrayBuffer();
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`Timed out fetching ${input} after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  const contentType = response.headers.get('content-type') || '';
  const mediaType = contentType.split(';', 1)[0].trim().toLowerCase();
  const isHtml = mediaType === 'text/html' || mediaType === 'application/xhtml+xml';
  const isText = mediaType.startsWith('text/') || mediaType === 'application/json' || mediaType.endsWith('+json');
  if (!isHtml && !isText) {
    throw new Error(`Unsupported Content-Type for ${input}: ${contentType || '(missing)'}`);
  }
  const charset = declaredCharset(contentType, input);
  let raw;
  try {
    raw = new TextDecoder(charset).decode(bytes);
  } catch (error) {
    if (error instanceof RangeError) {
      throw new Error(`Unsupported charset for ${input}: ${charset}`);
    }
    throw error;
  }
  const text = isHtml ? htmlToText(raw) : raw;
  const title = (isHtml ? extractHtmlTitle(raw) : '') || extractMarkdownTitle(text, input);
  return {
    source: createSourceRecord({
      id: `source-${index + 1}`,
      type: 'url',
      locator: input,
      title,
      content: text,
      fetched: true,
      metadata: { contentType, finalUrl: response.url }
    }),
    content: text
  };
}

function declaredCharset(contentType, input) {
  const match = String(contentType).match(/(?:^|;)\s*charset\s*=\s*(?:"([^"]*)"|([^;\s]*))/i);
  if (!match) return 'utf-8';
  const charset = (match[1] ?? match[2]).trim();
  if (!charset) {
    throw new Error(`Malformed charset parameter for ${input}: ${contentType}`);
  }
  return charset;
}

export function extractHtmlTitle(html) {
  const match = String(html).match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeEntities(stripMarkdown(match[1])).trim() : '';
}

export function htmlToText(html) {
  return decodeEntities(String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h[1-6]|li|blockquote)>/gi, '\n')
    .replace(/<blockquote[^>]*>/gi, '\n> ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim());
}

function decodeEntities(value) {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
