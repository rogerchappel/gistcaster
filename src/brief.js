import { extractHeadings, extractQuotes, summarizeText } from './markdown.js';

export function buildBrief(captures, options = {}) {
  const sources = captures.map((capture) => capture.source);
  const sections = captures.map((capture) => ({
    sourceId: capture.source.id,
    title: capture.source.title,
    summary: capture.content ? summarizeText(capture.content, options.sentenceLimit || 3) : 'No content fetched. Source metadata only.',
    quotes: capture.content ? extractQuotes(capture.content, options.quoteLimit || 5) : [],
    headings: capture.content ? extractHeadings(capture.content, options.headingLimit || 8) : []
  }));

  return {
    title: options.title || inferBriefTitle(sources),
    createdAt: new Date().toISOString(),
    safety: {
      localFirst: true,
      note: 'gistcaster reads local files and only fetches URLs when --fetch-url is explicitly supplied.'
    },
    sources,
    sections
  };
}

export function inferBriefTitle(sources) {
  if (sources.length === 1) return sources[0].title;
  if (sources.length > 1) return `${sources.length} source research brief`;
  return 'Untitled research brief';
}
