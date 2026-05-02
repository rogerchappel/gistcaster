import assert from 'node:assert/strict';
import test from 'node:test';
import { briefMarkdown } from '../src/brief.js';
import { qualificationMarkdown } from '../src/qualification.js';

const record = {
  version: 1,
  id: 'abc123',
  kind: 'file',
  uri: 'file:///tmp/source.md',
  path: '/tmp/source.md',
  title: 'Source title',
  capturedAt: '2026-01-01T00:00:00.000Z',
  text: 'This is a useful source sentence. This second sentence contains enough detail for a quote candidate in the generated brief output.'
};

test('brief includes source, summary, quote and safety note', () => {
  const markdown = briefMarkdown(record);
  assert.match(markdown, /# Source title/);
  assert.match(markdown, /URI: file:\/\/\/tmp\/source.md/);
  assert.match(markdown, /## Source-linked quotes/);
  assert.match(markdown, /verify source context/);
});

test('qualification export contains evidence and decision', () => {
  const markdown = qualificationMarkdown([record], { title: 'Idea X', decision: 'build now' });
  assert.match(markdown, /# Idea X/);
  assert.match(markdown, /## Evidence/);
  assert.match(markdown, /build now/);
});
