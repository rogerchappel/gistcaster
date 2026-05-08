import { createHash } from 'node:crypto';

export function hashContent(content) {
  return createHash('sha256').update(content).digest('hex');
}

export function createSourceRecord({ id, type, locator, title, content = '', fetched = false, metadata = {} }) {
  return {
    id,
    type,
    locator,
    title: title || locator,
    fetched,
    hash: content ? hashContent(content) : null,
    capturedAt: new Date().toISOString(),
    metadata
  };
}

export function sourceLabel(source) {
  return `${source.title} (${source.locator})`;
}
