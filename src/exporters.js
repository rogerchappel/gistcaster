import { renderMarkdownBrief } from './render.js';

export function renderOssIdeasQualification(brief) {
  const evidence = brief.sections.map((section) => {
    const source = brief.sources.find((item) => item.id === section.sourceId);
    const quoteLines = section.quotes.length
      ? section.quotes.map((quote) => `  - Quote: “${quote}”`).join('\n')
      : '  - Quote: none captured';
    return `- Source: ${source?.locator || section.sourceId}\n  - Summary: ${section.summary}\n${quoteLines}`;
  }).join('\n');

  return `# Qualification: ${brief.title}\n\n## Evidence\n\n${evidence}\n\n## Notes\n\n- Generated locally by gistcaster.\n- Summaries are separate from direct quotes.\n- Check source links before using this as decision evidence.\n`;
}

export function renderBrief(brief, format = 'markdown') {
  if (format === 'markdown' || format === 'md') return renderMarkdownBrief(brief);
  if (format === 'oss-ideas') return renderOssIdeasQualification(brief);
  if (format === 'json') return `${JSON.stringify(brief, null, 2)}\n`;
  throw new Error(`Unsupported format: ${format}`);
}
