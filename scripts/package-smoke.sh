#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

pack_json="$tmp_dir/pack.json"
package_dir="$tmp_dir/package"
install_prefix="$tmp_dir/prefix"
outside_dir="$tmp_dir/outside"
mkdir -p "$package_dir" "$outside_dir"

npm pack --json --pack-destination "$package_dir" >"$pack_json"

node - "$pack_json" <<'NODE'
const fs = require('node:fs');
const payload = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))[0];
const packed = new Set(payload.files.map((file) => file.path));
const required = [
  'src/cli.js',
  'src/index.js',
  'examples/local-brief.md',
  'demo/run-local-research-brief.sh',
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'SUPPORT.md',
  'RELEASE_NOTES.md'
];
const missing = required.filter((file) => !packed.has(file));
if (missing.length) {
  console.error(`Missing package files: ${missing.join(', ')}`);
  process.exit(1);
}
NODE

tarball="$(node -e "const p = require(process.argv[1]); process.stdout.write(p[0].filename)" "$pack_json")"
npm install --global --prefix "$install_prefix" "$package_dir/$tarball"

fixture="$outside_dir/local-note.md"
output="$outside_dir/brief.md"
printf '# Package smoke\n\nInstalled CLI input.\n' >"$fixture"

cd "$outside_dir"
"$install_prefix/bin/gistcaster" brief "$fixture" --out "$output"
test -s "$output"
grep -q 'Installed CLI input' "$output"
