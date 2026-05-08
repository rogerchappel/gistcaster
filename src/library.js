import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { slugify } from './slug.js';

export async function writeBrief({ brief, rendered, output, library = '.gistcaster' }) {
  const path = output ? resolve(output) : resolve(library, `${datePrefix(brief.createdAt)}-${slugify(brief.title)}.md`);
  await mkdir(resolve(path, '..'), { recursive: true });
  await writeFile(path, rendered, 'utf8');
  return path;
}

export function datePrefix(isoDate) {
  return String(isoDate).slice(0, 10);
}

export function defaultLibraryPath(cwd = process.cwd()) {
  return join(cwd, '.gistcaster');
}
