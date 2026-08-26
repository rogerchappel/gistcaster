import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  parseArgs,
  usage,
  buildBrief,
  renderBrief,
  captureInputs,
  writeBrief,
  isUrl,
  assertExplicitUrlFetch,
  GistcasterError,
  invariant
} from '../src/index.js';

test('exposes the CLI argument helpers from the entry', () => {
  assert.equal(typeof parseArgs, 'function');
  assert.equal(typeof usage, 'function');
  const parsed = parseArgs(['brief', 'note.md', '--format', 'json']);
  assert.equal(parsed.command, 'brief');
  assert.deepEqual(parsed.inputs, ['note.md']);
  assert.equal(parsed.options.format, 'json');
  assert.match(usage(), /gistcaster/);
});

test('exposes brief building and rendering from the entry', () => {
  const brief = buildBrief(
    [{
      source: { id: 'source-1', title: 'One', locator: 'entry.md', type: 'file', fetched: true, metadata: {} },
      content: '# One\n\n> quote\n\nSummary sentence.'
    }],
    { title: 'Entry surface' }
  );
  assert.equal(brief.sources[0].id, 'source-1');
  assert.match(renderBrief(brief), /## Direct Quotes/);
  assert.match(renderBrief(brief, 'oss-ideas'), /# Qualification: Entry surface/);
});

test('exposes URL safety helpers from the entry', () => {
  assert.equal(isUrl('https://example.test'), true);
  assert.equal(isUrl('note.md'), false);
  assert.deepEqual(assertExplicitUrlFetch('https://example.test'), {
    allowed: false,
    reason: 'URL content is not fetched unless --fetch-url is set.'
  });
  assert.deepEqual(assertExplicitUrlFetch('https://example.test', { fetchUrl: true }), { allowed: true });
});

test('captures local files through the entry without network', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gistcaster-entry-'));
  const note = join(dir, 'note.md');
  await writeFile(note, '# Local note\n\nPlain evidence text.');
  const captures = await captureInputs([note]);
  assert.equal(captures.length, 1);
  assert.equal(captures[0].source.type, 'file');
  assert.match(captures[0].content, /Plain evidence text/);
});

test('writes rendered briefs through the entry to an explicit path', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gistcaster-entry-'));
  const brief = buildBrief(
    [{
      source: { id: 'source-1', title: 'One', locator: 'entry.md', type: 'file', fetched: true, metadata: {} },
      content: 'Written evidence.'
    }],
    { title: 'Written brief' }
  );
  const output = join(dir, 'out.md');
  const path = await writeBrief({ brief, rendered: renderBrief(brief), output });
  assert.equal(path, output);
  assert.match(await readFile(path, 'utf8'), /Written brief/);
});

test('exposes the typed error helpers from the entry', () => {
  assert.equal(typeof GistcasterError, 'function');
  const error = new GistcasterError('boom', 'GISTCASTER_BOOM');
  assert.equal(error.name, 'GistcasterError');
  assert.equal(error.code, 'GISTCASTER_BOOM');
  assert.equal(error.message, 'boom');
  assert.throws(
    () => invariant(false, 'nope', 'GISTCASTER_NOPE'),
    (caught) => caught instanceof GistcasterError && caught.code === 'GISTCASTER_NOPE'
  );
  assert.doesNotThrow(() => invariant(true, 'nope'));
});