export function parseArgs(argv) {
  const result = { command: argv[0] || 'help', inputs: [], options: {} };
  const seen = new Set();
  const valueOptions = new Map([
    ['--out', 'output'],
    ['--library', 'library'],
    ['--title', 'title'],
    ['--format', 'format'],
  ]);

  function markSeen(token, key = token) {
    if (seen.has(key)) throw new Error(`Option may only be specified once: ${token}`);
    seen.add(key);
  }

  for (let index = 1; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--fetch-url') {
      markSeen(token);
      result.options.fetchUrl = true;
    } else if (token === '--stdout') {
      markSeen(token);
      result.options.stdout = true;
    } else if (valueOptions.has(token)) {
      const key = valueOptions.get(token);
      markSeen(token, key);
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('-')) throw new Error(`Option requires a value: ${token}`);
      result.options[key] = value;
      index += 1;
    } else if (token === '--json') {
      markSeen(token, 'format');
      result.options.format = 'json';
    }
    else if (token === '-h' || token === '--help') result.command = 'help';
    else if (token.startsWith('-')) throw new Error(`Unknown option: ${token}`);
    else result.inputs.push(token);
  }
  return result;
}

export function usage() {
  return `gistcaster — local-first research briefs for agents\n\nUsage:\n  gistcaster brief <file-or-url...> [--out brief.md] [--format markdown|oss-ideas|json]\n  gistcaster brief https://example.test --fetch-url --stdout\n\nOptions:\n  --fetch-url        Explicitly fetch URL content (never implicit)\n  --out <path>       Write to a specific file\n  --library <dir>    Library directory when --out is omitted (default .gistcaster)\n  --title <text>     Override brief title\n  --format <format>  markdown, oss-ideas, or json\n  --json             Alias for --format json\n  --stdout           Print rendered brief instead of only path\n\nOptions may be specified once; --json and --format are mutually exclusive.\n`;
}
