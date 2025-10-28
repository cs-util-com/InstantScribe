function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.,!?'-]/g, '')
    .trim();
}

function findOverlapTokenCount(
  prev,
  next,
  { maxTokens = 30, minChars = 6 } = {}
) {
  const prevTokens = normalizeText(prev).split(' ').filter(Boolean);
  const nextTokens = normalizeText(next).split(' ').filter(Boolean);
  const limit = Math.min(maxTokens, prevTokens.length, nextTokens.length);

  for (let size = limit; size >= 1; size -= 1) {
    const prevSlice = prevTokens.slice(-size).join(' ');
    const nextSlice = nextTokens.slice(0, size).join(' ');
    if (
      prevSlice === nextSlice &&
      prevSlice.replace(/\s+/g, '').length >= minChars
    ) {
      return size;
    }
  }
  return 0;
}

function trimOverlap(prev, next) {
  const overlapTokens = findOverlapTokenCount(prev, next);
  if (!overlapTokens) return next;

  const wordMatches = next.match(/\S+\s*/g);
  if (!wordMatches) return next;
  const remaining = wordMatches.slice(overlapTokens).join('');
  return remaining.replace(/^\s+/, '');
}

export function mergeTranscriptions(chunks) {
  if (!Array.isArray(chunks) || chunks.length === 0) return '';
  return chunks.reduce((acc, current) => {
    const text = (current || '').trim();
    if (!text) return acc;
    if (!acc) return text;
    const deduped = trimOverlap(acc, text);
    if (!deduped) return acc;
    if (acc.endsWith(' ') || deduped.startsWith(' ')) {
      return acc + deduped;
    }
    return `${acc} ${deduped}`;
  }, '');
}
