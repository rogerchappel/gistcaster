import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, symlink } from 'node:fs/promises';
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

test('CLI runs when invoked through an installed-package symlink', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gistcaster-link-test-'));
  const executable = join(dir, 'gistcaster');
  await symlink(join(process.cwd(), 'src/cli.js'), executable);

  const result = spawnSync(executable, ['help'], { encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Usage:\n  gistcaster brief/);
  await rm(dir, { recursive: true, force: true });
});

function runCli(...args) {
  return spawnSync(process.execPath, ['src/cli.js', ...args], { encoding: 'utf8' });
}

test('CLI rejects unknown options directly', () => {
  const result = runCli('brief', 'tests/fixtures/local-note.md', '--bogus');
  assert.equal(result.status, 1);
  assert.equal(result.stderr, 'Unknown option: --bogus\n');
});

for (const option of ['--out', '--library', '--title', '--format']) {
  test(`CLI requires a value for ${option} at the end of argv`, () => {
    const result = runCli('brief', 'tests/fixtures/local-note.md', option);
    assert.equal(result.status, 1);
    assert.equal(result.stderr, `Option requires a value: ${option}\n`);
  });

  test(`CLI does not consume a following option as the value for ${option}`, () => {
    const result = runCli('brief', 'tests/fixtures/local-note.md', option, '--stdout');
    assert.equal(result.status, 1);
    assert.equal(result.stderr, `Option requires a value: ${option}\n`);
  });
}

test('CLI rejects duplicate options and the format alias combination', () => {
  const duplicate = runCli('brief', 'tests/fixtures/local-note.md', '--title', 'one', '--title', 'two');
  assert.equal(duplicate.status, 1);
  assert.equal(duplicate.stderr, 'Option may only be specified once: --title\n');

  const alias = runCli('brief', 'tests/fixtures/local-note.md', '--json', '--format', 'json');
  assert.equal(alias.status, 1);
  assert.equal(alias.stderr, 'Option may only be specified once: --format\n');
});

test('CLI supports value options, boolean options, and the json alias', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gistcaster-options-test-'));
  const out = join(dir, 'brief.json');
  const result = runCli('brief', 'tests/fixtures/local-note.md', '--title', 'Custom title', '--out', out, '--json', '--stdout');

  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).title, 'Custom title');
  assert.match(await readFile(out, 'utf8'), /"title": "Custom title"/);
  await rm(dir, { recursive: true, force: true });
});
