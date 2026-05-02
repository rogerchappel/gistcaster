import fs from 'node:fs/promises';
import path from 'node:path';
import { fail } from './errors.js';
import { resolvePath } from './path-utils.js';

const TEXT_EXTENSIONS = new Set(['.txt', '.md', '.markdown', '.csv', '.json', '.jsonl', '.html', '.htm', '.xml', '.yaml', '.yml', '.log']);

export async function captureFile(input, options = {}) {
  const filePath = resolvePath(input, options.cwd);
  const stat = await fs.stat(filePath).catch(() => null);
  if (!stat || !stat.isFile()) fail(`File not found: ${input}`, 'FILE_NOT_FOUND', { input });
  const ext = path.extname(filePath).toLowerCase();
  if (!TEXT_EXTENSIONS.has(ext)) fail(`Unsupported file type: ${ext || 'unknown'}`, 'UNSUPPORTED_FILE_TYPE', { input, ext });
  const text = await fs.readFile(filePath, 'utf8');
  const title = inferTitle(text) || path.basename(filePath);
  return {
    kind: 'file',
    uri: `file://${filePath}`,
    path: filePath,
    title,
    mediaType: mediaTypeFor(ext),
    bytes: stat.size,
    modifiedAt: stat.mtime.toISOString(),
    text
  };
}

function inferTitle(text) {
  const firstHeading = text.split(/\r?\n/).find((line) => /^#\s+\S/.test(line));
  return firstHeading ? firstHeading.replace(/^#\s+/, '').trim() : null;
}

function mediaTypeFor(ext) {
  if (ext === '.md' || ext === '.markdown') return 'text/markdown';
  if (ext === '.html' || ext === '.htm') return 'text/html';
  if (ext === '.json' || ext === '.jsonl') return 'application/json';
  if (ext === '.csv') return 'text/csv';
  if (ext === '.xml') return 'application/xml';
  if (ext === '.yaml' || ext === '.yml') return 'application/yaml';
  return 'text/plain';
}
