import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../scripts/syntax-check.sh', import.meta.url));

function runSyntaxCheck(files) {
  return spawnSync('bash', [script, ...files], { encoding: 'utf8' });
}

async function fixtureDir() {
  const dir = await mkdtemp(join(tmpdir(), 'gistcaster-syntax-'));
  await writeFile(join(dir, 'package.json'), '{"type":"module"}\n');
  return dir;
}

test('rejects a syntax error in any checked file, not just the first', async () => {
  const dir = await fixtureDir();
  const ok = join(dir, 'ok.js');
  const broken = join(dir, 'broken.js');
  await writeFile(ok, 'export const fine = 1;\n');
  await writeFile(broken, 'export const broken = ;\n');

  // Node's --check inspects only its first script argument, so the broken
  // file must not be first: the old `node --check <glob>` form passed here.
  const result = runSyntaxCheck([ok, broken]);

  assert.notEqual(result.status, 0, `gate must fail; stdout=${result.stdout} stderr=${result.stderr}`);
  assert.match(result.stderr, /syntax error: .*broken\.js/);
});

test('accepts files that all parse cleanly', async () => {
  const dir = await fixtureDir();
  const first = join(dir, 'first.js');
  const second = join(dir, 'second.js');
  await writeFile(first, 'export const fine = 1;\n');
  await writeFile(second, 'export const alsoFine = 2;\n');

  const result = runSyntaxCheck([first, second]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /syntax ok: 2 file\(s\)/);
});