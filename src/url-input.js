import { createSourceRecord } from './source.js';
import { assertExplicitUrlFetch } from './safety.js';
import { extractMarkdownTitle, stripMarkdown } from './markdown.js';

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

  const response = await fetch(input, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Failed to fetch ${input}: HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  const raw = await response.text();
  const text = htmlToText(raw);
  const title = extractHtmlTitle(raw) || extractMarkdownTitle(text, input);
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
