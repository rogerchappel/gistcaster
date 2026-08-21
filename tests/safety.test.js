import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
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

test('cancels a delayed URL fetch at the configured deadline', async (t) => {
  const server = createServer((_request, response) => {
    setTimeout(() => response.end('<title>Too late</title>'), 250);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}/slow`;

  await assert.rejects(
    captureInputs([url], { fetchUrl: true, urlTimeoutMs: 30 }),
    (error) => error.message === `Timed out fetching ${url} after 30ms`
  );
});

test('captures URL content and metadata before the deadline', async (t) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end('<html><title>Local fixture</title><p>Useful content.</p></html>');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}/normal`;

  const [capture] = await captureInputs([url], { fetchUrl: true, urlTimeoutMs: 500 });

  assert.equal(capture.source.title, 'Local fixture');
  assert.equal(capture.source.fetched, true);
  assert.equal(capture.source.metadata.contentType, 'text/html; charset=utf-8');
  assert.equal(capture.source.metadata.finalUrl, url);
  assert.equal(capture.content, 'Local fixture Useful content.');
});
