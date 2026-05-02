import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { captureSource } from '../src/capture.js';
import { readLibrary, saveRecord } from '../src/library.js';

test('saves record, index, and brief', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'gistcaster-'));
  const record = await captureSource('fixtures/files/research-note.md', { capturedAt: '2026-01-01T00:00:00.000Z' });
  const saved = await saveRecord(dir, record);
  const library = await readLibrary(dir);
  assert.equal(library.records.length, 1);
  assert.equal(library.records[0].id, record.id);
  assert.match(await fs.readFile(saved.briefPath, 'utf8'), /Local Research Capture/);
});
