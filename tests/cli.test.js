import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, symlink } from 'node:fs/promises';
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

test('CLI uses a JSON extension for implicit JSON output', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gistcaster-json-library-test-'));
  const library = join(dir, 'library');
  const result = runCli('brief', 'tests/fixtures/local-note.md', '--library', library, '--json');

  assert.equal(result.status, 0, result.stderr);
  const output = result.stdout.trim();
  assert.equal(output.endsWith('.json'), true);
  assert.equal(JSON.parse(await readFile(output, 'utf8')).title, 'Compiler Flag Research');
  await rm(dir, { recursive: true, force: true });
});

test('CLI preserves repeated implicit captures with deterministic suffixes', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gistcaster-collision-test-'));
  const library = join(dir, 'library');
  const args = ['brief', 'tests/fixtures/local-note.md', '--library', library];
  const first = runCli(...args);
  const second = runCli(...args);

  assert.equal(first.status, 0, first.stderr);
  assert.equal(second.status, 0, second.stderr);
  assert.notEqual(first.stdout, second.stdout);
  assert.match(second.stdout.trim(), /-2\.md$/);
  assert.deepEqual((await readdir(library)).sort(), [
    first.stdout.trim().split('/').at(-1),
    second.stdout.trim().split('/').at(-1)
  ].sort());
  await rm(dir, { recursive: true, force: true });
});

test('CLI keeps exact --out behavior, including replacing an existing file', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gistcaster-explicit-output-test-'));
  const out = join(dir, 'chosen.extension');
  const first = runCli('brief', 'tests/fixtures/local-note.md', '--out', out);
  const second = runCli('brief', 'tests/fixtures/local-note.md', '--title', 'Replacement', '--out', out);

  assert.equal(first.status, 0, first.stderr);
  assert.equal(second.status, 0, second.stderr);
  assert.equal(second.stdout.trim(), out);
  assert.match(await readFile(out, 'utf8'), /# Replacement/);
  assert.deepEqual(await readdir(dir), ['chosen.extension']);
  await rm(dir, { recursive: true, force: true });
});
