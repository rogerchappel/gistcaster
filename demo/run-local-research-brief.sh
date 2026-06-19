#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

out_dir="${TMPDIR:-/tmp}/gistcaster-local-research"
rm -rf "$out_dir"
mkdir -p "$out_dir"

node src/cli.js brief examples/local-brief.md --out "$out_dir/local-brief.md"
node src/cli.js brief examples/oss-ideas-qualification.md --format oss-ideas --out "$out_dir/qualification.md"

test -s "$out_dir/local-brief.md"
test -s "$out_dir/qualification.md"
grep -q "Source" "$out_dir/local-brief.md"
grep -q "Qualification" "$out_dir/qualification.md"

echo "Generated briefs: $out_dir"
