export function parseArgs(argv) {
  const result = { command: argv[0] || 'help', inputs: [], options: {} };
  for (let index = 1; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--fetch-url') result.options.fetchUrl = true;
    else if (token === '--stdout') result.options.stdout = true;
    else if (token === '--out') result.options.output = argv[++index];
    else if (token === '--library') result.options.library = argv[++index];
    else if (token === '--title') result.options.title = argv[++index];
    else if (token === '--format') result.options.format = argv[++index];
    else if (token === '--json') result.options.format = 'json';
    else if (token === '-h' || token === '--help') result.command = 'help';
    else result.inputs.push(token);
  }
  return result;
}

export function usage() {
  return `gistcaster — local-first research briefs for agents\n\nUsage:\n  gistcaster brief <file-or-url...> [--out brief.md] [--format markdown|oss-ideas|json]\n  gistcaster brief https://example.test --fetch-url --stdout\n\nOptions:\n  --fetch-url        Explicitly fetch URL content (never implicit)\n  --out <path>       Write to a specific file\n  --library <dir>    Library directory when --out is omitted (default .gistcaster)\n  --title <text>     Override brief title\n  --format <format>  markdown, oss-ideas, or json\n  --stdout           Print rendered brief instead of only path\n`;
}
