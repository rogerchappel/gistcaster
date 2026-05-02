const SENTENCE_RE = /(?<=[.!?])\s+/;

export function summarizeText(text, options = {}) {
  const maxSentences = options.maxSentences ?? 5;
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  return clean.split(SENTENCE_RE).filter(Boolean).slice(0, maxSentences);
}

export function extractQuotes(text, options = {}) {
  const maxQuotes = options.maxQuotes ?? 5;
  const lines = String(text || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const candidates = lines.filter((line) => line.length >= 48 && line.length <= 240);
  return candidates.slice(0, maxQuotes);
}

export function keywords(text, options = {}) {
  const max = options.max ?? 12;
  const stop = new Set(['the','and','for','with','that','this','from','into','your','you','are','was','were','will','can','has','have','not','but','about','local','first']);
  const counts = new Map();
  for (const word of String(text || '').toLowerCase().match(/[a-z][a-z0-9-]{2,}/g) || []) {
    if (stop.has(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, max).map(([word]) => word);
}
