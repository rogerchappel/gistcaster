#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME ?? '';
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const expected = `v${packageJson.version}`;
const semverTag = /^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

if (!semverTag.test(tag)) {
  console.error(`Release tag is missing or malformed: expected ${expected}, received ${tag || '(empty)'}.`);
  process.exit(1);
}

if (tag !== expected) {
  console.error(`Release tag ${tag} does not match package version ${packageJson.version}; expected ${expected}.`);
  process.exit(1);
}

console.log(`Release tag ${tag} matches package version ${packageJson.version}.`);
