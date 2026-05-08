import test from 'node:test';
import assert from 'node:assert/strict';
import { captureInputs } from '../src/capture.js';
import { assertExplicitUrlFetch, isUrl } from '../src/safety.js';

test('recognizes only http and https URLs', () => {
  assert.equal(isUrl('https://example.com'), true);
  assert.equal(isUrl('file:///tmp/a'), false);
});

test('does not fetch URL content unless explicitly requested', async () => {
  const safety = assertExplicitUrlFetch('https://example.com');
  assert.equal(safety.allowed, false);
  const [capture] = await captureInputs(['https://example.com'], {});
  assert.equal(capture.source.fetched, false);
  assert.equal(capture.content, '');
});
