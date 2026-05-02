import assert from 'node:assert/strict';
import test from 'node:test';
import { captureSource } from '../src/capture.js';

test('captures markdown file metadata and text', async () => {
  const record = await captureSource('fixtures/files/research-note.md', { capturedAt: '2026-01-01T00:00:00.000Z' });
  assert.equal(record.kind, 'file');
  assert.equal(record.title, 'Local Research Capture');
  assert.match(record.uri, /^file:\/\//);
  assert.match(record.text, /hidden network access/);
  assert.equal(record.version, 1);
  assert.equal(record.id.length, 16);
});
