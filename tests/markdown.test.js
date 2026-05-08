import test from 'node:test';
import assert from 'node:assert/strict';
import { extractMarkdownTitle, extractQuotes, summarizeText } from '../src/markdown.js';

const fixture = `# Useful Finding\n\n> exact quoted evidence\n\nThis is a summary sentence. This is another sentence.\n`;

test('extracts markdown title from first h1', () => {
  assert.equal(extractMarkdownTitle(fixture, 'fallback'), 'Useful Finding');
});

test('keeps direct quotes separate from summary text', () => {
  assert.deepEqual(extractQuotes(fixture), ['exact quoted evidence']);
  assert.match(summarizeText(fixture), /This is a summary sentence/);
});
