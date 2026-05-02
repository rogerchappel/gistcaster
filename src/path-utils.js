import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const cwd = () => process.cwd();

export function resolvePath(input, base = cwd()) {
  if (!input) return path.resolve(base);
  return path.resolve(base, input.replace(/^file:\/\//, ''));
}

export function slugify(value, fallback = 'source') {
  const slug = String(value || '')
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
  return slug || fallback;
}

export function moduleRoot(importMetaUrl = import.meta.url) {
  return path.dirname(path.dirname(fileURLToPath(importMetaUrl)));
}
