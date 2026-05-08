import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('CLI smoke renders fixture brief to disk', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gistcaster-test-'));
  const out = join(dir, 'brief.md');
  const result = spawnSync(process.execPath, ['src/cli.js', 'brief', 'tests/fixtures/local-note.md', '--out', out], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const rendered = await readFile(out, 'utf8');
  assert.match(rendered, /Compiler Flag Research/);
  assert.match(rendered, /## Direct Quotes/);
  await rm(dir, { recursive: true, force: true });
});
