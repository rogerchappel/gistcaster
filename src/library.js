import fs from 'node:fs/promises';
import path from 'node:path';
import { briefMarkdown } from './brief.js';
import { validateLibrary, validateRecord } from './schema.js';
import { safeDateStamp } from './time.js';

export function defaultLibraryDir(cwd = process.cwd()) {
  return path.join(cwd, '.gistcaster');
}

export async function ensureLibrary(dir) {
  await fs.mkdir(path.join(dir, 'records'), { recursive: true });
  await fs.mkdir(path.join(dir, 'briefs'), { recursive: true });
  const indexPath = path.join(dir, 'index.json');
  try { await fs.access(indexPath); }
  catch { await fs.writeFile(indexPath, JSON.stringify({ version: 1, records: [] }, null, 2) + '\n'); }
}

export async function readLibrary(dir) {
  await ensureLibrary(dir);
  const data = JSON.parse(await fs.readFile(path.join(dir, 'index.json'), 'utf8'));
  return validateLibrary(data);
}

export async function writeLibrary(dir, library) {
  validateLibrary(library);
  await fs.writeFile(path.join(dir, 'index.json'), JSON.stringify(library, null, 2) + '\n');
}

export async function saveRecord(dir, record) {
  await ensureLibrary(dir);
  validateRecord(record);
  const library = await readLibrary(dir);
  const existing = library.records.findIndex((item) => item.id === record.id);
  if (existing >= 0) library.records[existing] = record;
  else library.records.push(record);
  library.records.sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
  await fs.writeFile(path.join(dir, 'records', `${record.id}.json`), JSON.stringify(record, null, 2) + '\n');
  const briefName = `${safeDateStamp(record.capturedAt)}-${record.id}.md`;
  const briefPath = path.join(dir, 'briefs', briefName);
  await fs.writeFile(briefPath, briefMarkdown(record));
  await writeLibrary(dir, library);
  return { record, briefPath };
}

export async function loadRecords(dir, ids = []) {
  const library = await readLibrary(dir);
  if (!ids.length) return library.records;
  return library.records.filter((record) => ids.includes(record.id));
}
