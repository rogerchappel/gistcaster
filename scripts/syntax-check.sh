#!/usr/bin/env bash
# Syntax-check every source file individually.
#
# Node's --check inspects only its first script argument, so a shell glob
# such as `node --check src/*.js` silently skips every file after the
# first. This gate iterates the files explicitly and fails on the first
# (and any subsequent) syntax error. Without arguments it checks the
# repository's src/*.js; explicit arguments are checked as given, which
# lets tests point the gate at fixture directories.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ "$#" -gt 0 ]; then
  files=("$@")
else
  files=("$repo_root"/src/*.js)
fi

failed=0
count=0
for file in "${files[@]}"; do
  count=$((count + 1))
  if ! node --check "$file"; then
    printf 'syntax error: %s\n' "$file" >&2
    failed=1
  fi
done

if [ "$failed" -ne 0 ]; then
  exit 1
fi

printf 'syntax ok: %d file(s)\n' "$count"