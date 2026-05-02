import { extractQuotes, keywords, summarizeText } from './text-analysis.js';

export function briefMarkdown(record, options = {}) {
  const summary = summarizeText(record.text, { maxSentences: options.maxSentences ?? 5 });
  const quotes = extractQuotes(record.text, { maxQuotes: options.maxQuotes ?? 5 });
  const tags = keywords(record.text, { max: 8 });
  const lines = [];
  lines.push(`# ${record.title}`);
  lines.push('');
  lines.push('## Source');
  lines.push(`- ID: ${record.id}`);
  lines.push(`- Kind: ${record.kind}`);
  lines.push(`- URI: ${record.uri}`);
  if (record.path) lines.push(`- Path: ${record.path}`);
  if (record.fixturePath) lines.push(`- Fixture: ${record.fixturePath}`);
  lines.push(`- Captured: ${record.capturedAt}`);
  lines.push(`- Network: ${record.kind === 'url' && record.fetched ? 'explicit fetch' : 'none'}`);
  lines.push('');
  lines.push('## Summary');
  if (summary.length) summary.forEach((sentence) => lines.push(`- ${sentence}`));
  else lines.push('- No extractable text found.');
  lines.push('');
  lines.push('## Source-linked quotes');
  if (quotes.length) quotes.forEach((quote) => lines.push(`> ${quote}`));
  else lines.push('_No quote-sized passages found._');
  lines.push('');
  lines.push('## Keywords');
  lines.push(tags.length ? tags.map((tag) => `\`${tag}\``).join(', ') : '_None_');
  lines.push('');
  lines.push('## Notes');
  lines.push('- Summary is extractive and local; verify source context before publishing.');
  return lines.join('\n') + '\n';
}
