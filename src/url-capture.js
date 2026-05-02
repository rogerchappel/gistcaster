import fs from 'node:fs/promises';
import { URL } from 'node:url';
import { fail } from './errors.js';
import { resolvePath } from './path-utils.js';

export function parseUrl(input) {
  let url;
  try { url = new URL(input); } catch { fail(`Invalid URL: ${input}`, 'INVALID_URL', { input }); }
  if (!['http:', 'https:'].includes(url.protocol)) fail('Only http(s) URLs are supported', 'UNSUPPORTED_URL_PROTOCOL', { input });
  return url;
}

export async function captureUrl(input, options = {}) {
  const url = parseUrl(input);
  if (options.fixture) return captureFixtureUrl(url, options.fixture);
  if (options.fetch === true) return fetchLiveUrl(url, options);
  fail('URL capture requires an explicit --fixture or --fetch flag; gistcaster never performs hidden network requests.', 'NETWORK_NOT_EXPLICIT', { url: url.href });
}

async function captureFixtureUrl(url, fixturePath) {
  const resolved = resolvePath(fixturePath);
  const html = await fs.readFile(resolved, 'utf8').catch((error) => fail(`Fixture not readable: ${fixturePath}`, 'FIXTURE_NOT_FOUND', { error: error.message }));
  return normalizeUrlRecord(url, html, { fixturePath: resolved, fetched: false });
}

async function fetchLiveUrl(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 10000);
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: 'follow' });
    const contentType = response.headers.get('content-type') || 'text/plain';
    if (!response.ok) fail(`Fetch failed with status ${response.status}`, 'FETCH_FAILED', { status: response.status, url: url.href });
    if (!/text|html|json|xml|markdown/.test(contentType)) fail(`Unsupported URL content type: ${contentType}`, 'UNSUPPORTED_URL_CONTENT', { contentType });
    const text = await response.text();
    return normalizeUrlRecord(url, text, { contentType, fetched: true, status: response.status });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeUrlRecord(url, raw, meta) {
  const title = extractTitle(raw) || url.hostname + url.pathname;
  const text = htmlToText(raw);
  return {
    kind: 'url',
    uri: url.href,
    title,
    mediaType: meta.contentType || 'text/html',
    fetched: Boolean(meta.fetched),
    fixturePath: meta.fixturePath,
    status: meta.status,
    text
  };
}

export function extractTitle(raw) {
  const h1 = raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const title = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return cleanInline(h1 || title || '');
}

export function htmlToText(raw) {
  return String(raw)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanInline(value) {
  return htmlToText(value).replace(/\s+/g, ' ').trim();
}
