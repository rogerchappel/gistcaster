function line(value = '') {
  return `${value}\n`;
}

export function renderMarkdownBrief(brief) {
  let output = '';
  output += line(`# ${brief.title}`);
  output += line();
  output += line(`Captured: ${brief.createdAt}`);
  output += line();
  output += line('> Safety: local-first by default. URL content appears only when explicitly fetched.');
  output += line();
  output += line('## Sources');
  output += line();
  for (const source of brief.sources) {
    output += line(`- [${source.id}] **${escapeMd(source.title)}** — ${source.type}: ${source.locator}`);
    output += line(`  - fetched: ${source.fetched ? 'yes' : 'no'}`);
    if (source.hash) output += line(`  - sha256: ${source.hash}`);
    for (const [key, value] of Object.entries(source.metadata || {})) {
      output += line(`  - ${key}: ${String(value)}`);
    }
  }
  output += line();
  output += line('## Summaries');
  output += line();
  for (const section of brief.sections) {
    output += line(`### ${escapeMd(section.title)}`);
    output += line();
    output += line(`Source: ${section.sourceId}`);
    output += line();
    output += line(section.summary || 'No summary available.');
    output += line();
  }
  output += line('## Direct Quotes');
  output += line();
  for (const section of brief.sections) {
    output += line(`### ${escapeMd(section.title)}`);
    if (!section.quotes.length) {
      output += line('- No direct quotes captured.');
    } else {
      for (const quote of section.quotes) output += line(`> ${quote}`);
    }
    output += line();
  }
  output += line('## Structure Notes');
  output += line();
  for (const section of brief.sections) {
    output += line(`### ${escapeMd(section.title)}`);
    if (!section.headings.length) output += line('- No headings detected.');
    for (const heading of section.headings) output += line(`${'  '.repeat(Math.max(0, heading.depth - 1))}- ${heading.text}`);
    output += line();
  }
  return output;
}

export function escapeMd(value) {
  return String(value).replace(/[<>]/g, '');
}
