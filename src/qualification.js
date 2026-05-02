import { keywords, summarizeText } from './text-analysis.js';

export function qualificationMarkdown(records, options = {}) {
  const title = options.title || 'gistcaster qualification';
  const lines = [`# ${title}`, '', '## Qualification', ''];
  lines.push(`Captured sources: ${records.length}`);
  lines.push('');
  lines.push('## Evidence');
  for (const record of records) {
    const summary = summarizeText(record.text, { maxSentences: 2 }).join(' ');
    lines.push(`- **${record.title}** (${record.kind}) — ${record.uri}`);
    if (summary) lines.push(`  - Summary: ${summary}`);
    lines.push(`  - Source ID: ${record.id}`);
  }
  lines.push('');
  lines.push('## Signals');
  const allKeywords = keywords(records.map((record) => record.text).join('\n'), { max: 16 });
  if (allKeywords.length) allKeywords.forEach((tag) => lines.push(`- ${tag}`));
  else lines.push('- No keyword signals extracted.');
  lines.push('');
  lines.push('## Decision');
  lines.push(options.decision || 'needs review');
  lines.push('');
  lines.push('## Safety');
  lines.push('- Generated from local source records; URL network access is explicit only.');
  return lines.join('\n') + '\n';
}
