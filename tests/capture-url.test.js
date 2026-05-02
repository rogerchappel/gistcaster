import assert from 'node:assert/strict';
import test from 'node:test';
import { captureSource } from '../src/capture.js';
import { GistcasterError } from '../src/errors.js';

test('refuses URL capture without fixture or fetch', async () => {
  await assert.rejects(
    () => captureSource('https://example.test/research'),
    (error) => error instanceof GistcasterError && error.code === 'NETWORK_NOT_EXPLICIT'
  );
});

test('captures URL from fixture without live fetch', async () => {
  const record = await captureSource('https://example.test/research', {
    fixture: 'fixtures/url/example.html',
    capturedAt: '2026-01-01T00:00:00.000Z'
  });
  assert.equal(record.kind, 'url');
  assert.equal(record.title, 'Fixture URL Research');
  assert.equal(record.fetched, false);
  assert.match(record.text, /without touching the network/);
});
