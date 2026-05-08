import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBrief } from '../src/brief.js';
import { renderBrief } from '../src/exporters.js';

test('builds source-linked briefs with summary and quotes', () => {
  const brief = buildBrief([{ source: { id: 'source-1', title: 'One', locator: 'fixture.md', type: 'file', fetched: true, metadata: {} }, content: '# One\n\n> quote\n\nSummary sentence.' }]);
  assert.equal(brief.sources[0].id, 'source-1');
  assert.equal(brief.sections[0].quotes[0], 'quote');
  assert.match(renderBrief(brief), /## Direct Quotes/);
});

test('renders oss-ideas qualification format', () => {
  const brief = buildBrief([{ source: { id: 'source-1', title: 'One', locator: 'fixture.md', type: 'file', fetched: true, metadata: {} }, content: 'Useful evidence.' }], { title: 'Idea' });
  assert.match(renderBrief(brief, 'oss-ideas'), /# Qualification: Idea/);
  assert.match(renderBrief(brief, 'oss-ideas'), /Generated locally/);
});
