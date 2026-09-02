import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const runTagCheck = (tag) => spawnSync(process.execPath, ['scripts/validate-release-tag.js', ...(tag === undefined ? [] : [tag])], {
  cwd: new URL('..', import.meta.url),
  encoding: 'utf8',
  env: { ...process.env, GITHUB_REF_NAME: '' }
});

test('release tag gate accepts only the package version tag', () => {
  const accepted = runTagCheck('v0.1.0');
  assert.equal(accepted.status, 0, accepted.stderr);
  assert.match(accepted.stdout, /matches package version 0\.1\.0/);

  for (const tag of [undefined, '0.1.0', 'v1', 'v0.2.0']) {
    const rejected = runTagCheck(tag);
    assert.notEqual(rejected.status, 0, `unexpectedly accepted ${tag}`);
    assert.match(rejected.stderr, /expected v0\.1\.0/);
  }
});

test('release workflows gate the tag and generate final notes before packing', async () => {
  for (const workflow of ['release.yml', 'release-dry-run.yml']) {
    const source = await readFile(new URL(`../.github/workflows/${workflow}`, import.meta.url), 'utf8');
    const gate = source.indexOf('npm run release:tag-check');
    const notes = source.indexOf('notes . > RELEASE_NOTES.md');
    const pack = source.indexOf('npm pack');
    assert.ok(gate >= 0, `${workflow} must run the tag gate`);
    assert.ok(notes > gate, `${workflow} must generate notes after the tag gate`);
    assert.ok(pack > notes, `${workflow} must pack after generating final notes`);
  }
});
