export function stripMarkdown(value) {
  return String(value)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/[\*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractMarkdownTitle(content, fallback) {
  const heading = String(content).match(/^#\s+(.+)$/m);
  if (heading) return heading[1].trim();
  const firstText = String(content).split(/\r?\n/).map((line) => line.trim()).find(Boolean);
  return firstText ? stripMarkdown(firstText).slice(0, 90) : fallback;
}

export function extractQuotes(content, limit = 5) {
  const lines = String(content).split(/\r?\n/);
  const quotes = [];
  for (const line of lines) {
    const match = line.match(/^>\s?(.+)/);
    if (match) quotes.push(match[1].trim());
    if (quotes.length >= limit) break;
  }
  return quotes;
}

export function extractHeadings(content, limit = 8) {
  return [...String(content).matchAll(/^(#{1,6})\s+(.+)$/gm)]
    .slice(0, limit)
    .map((match) => ({ depth: match[1].length, text: match[2].trim() }));
}

export function summarizeText(content, sentenceLimit = 3) {
  const plain = stripMarkdown(content);
  if (!plain) return '';
  const sentences = plain.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [plain];
  return sentences.slice(0, sentenceLimit).map((s) => s.trim()).filter(Boolean).join(' ');
}
