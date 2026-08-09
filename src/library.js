import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { slugify } from './slug.js';

export async function writeBrief({ brief, rendered, output, library = '.gistcaster', format = 'markdown' }) {
  if (output) {
    const path = resolve(output);
    await mkdir(resolve(path, '..'), { recursive: true });
    await writeFile(path, rendered, 'utf8');
    return path;
  }

  const directory = resolve(library);
  const extension = format === 'json' ? '.json' : '.md';
  const basename = `${datePrefix(brief.createdAt)}-${slugify(brief.title)}`;
  await mkdir(directory, { recursive: true });

  for (let collision = 1; ; collision += 1) {
    const suffix = collision === 1 ? '' : `-${collision}`;
    const path = resolve(directory, `${basename}${suffix}${extension}`);
    try {
      await writeFile(path, rendered, { encoding: 'utf8', flag: 'wx' });
      return path;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
}

export function datePrefix(isoDate) {
  return String(isoDate).slice(0, 10);
}

export function defaultLibraryPath(cwd = process.cwd()) {
  return join(cwd, '.gistcaster');
}
