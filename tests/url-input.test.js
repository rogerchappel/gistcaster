import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';

import { captureUrl } from '../src/url-input.js';

async function withFixtureServer(routes, run) {
  const server = createServer((request, response) => {
    const fixture = routes[request.url];
    const headers = fixture.contentType ? { 'content-type': fixture.contentType } : {};
    response.writeHead(fixture.status || 200, headers);
    response.end(fixture.body);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('captures textual response bodies according to normalized Content-Type', async () => {
  await withFixtureServer({
    '/plain': { contentType: 'Text/Plain; charset=utf-8', body: 'score < 10 and value > 2' },
    '/json': { contentType: 'application/json; charset=utf-8', body: '{"comparison":"score < 10"}' },
    '/html': { contentType: 'text/html; charset=UTF-8', body: '<title>Fixture page</title><p>Readable <strong>evidence</strong>.</p>' }
  }, async (baseUrl) => {
    const plain = await captureUrl(`${baseUrl}/plain`, { fetchUrl: true });
    assert.equal(plain.content, 'score < 10 and value > 2');
    assert.equal(plain.source.metadata.contentType, 'Text/Plain; charset=utf-8');
    assert.equal(plain.source.metadata.finalUrl, `${baseUrl}/plain`);

    const json = await captureUrl(`${baseUrl}/json`, { fetchUrl: true });
    assert.equal(json.content, '{"comparison":"score < 10"}');

    const html = await captureUrl(`${baseUrl}/html`, { fetchUrl: true });
    assert.equal(html.source.title, 'Fixture page');
    assert.equal(html.content, 'Fixture page Readable evidence .');
    assert.doesNotMatch(html.content, /<[^>]+>/);
  });
});

test('rejects unsupported and missing response Content-Types explicitly', async () => {
  await withFixtureServer({
    '/binary': { contentType: 'application/octet-stream', body: Buffer.from([0, 1, 2]) },
    '/missing': { contentType: undefined, body: 'ambiguous bytes' }
  }, async (baseUrl) => {
    await assert.rejects(
      captureUrl(`${baseUrl}/binary`, { fetchUrl: true }),
      /Unsupported Content-Type.*application\/octet-stream/
    );
    await assert.rejects(
      captureUrl(`${baseUrl}/missing`, { fetchUrl: true }),
      /Unsupported Content-Type.*\(missing\)/
    );
  });
});
