import { readFile, stat } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { createSourceRecord } from './source.js';
import { extractMarkdownTitle } from './markdown.js';

export async function captureFile(input, index = 0) {
  const path = resolve(input);
  const info = await stat(path);
  if (!info.isFile()) throw new Error(`Input is not a file: ${input}`);
  const content = await readFile(path, 'utf8');
  const title = extractMarkdownTitle(content, basename(path));
  return {
    source: createSourceRecord({
      id: `source-${index + 1}`,
      type: 'file',
      locator: path,
      title,
      content,
      fetched: true,
      metadata: { bytes: info.size, mtime: info.mtime.toISOString() }
    }),
    content
  };
}
