const MAX_OVERLAP_CHARS = 200;
const MIN_OVERLAP_CHARS = 5;

function normalizeText(text) {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

export function computeOverlapLength(previousTail, nextText) {
  if (!previousTail || !nextText) return 0;

  const maxLength = Math.min(
    MAX_OVERLAP_CHARS,
    previousTail.length,
    nextText.length
  );

  for (let length = maxLength; length >= MIN_OVERLAP_CHARS; length -= 1) {
    const suffix = previousTail.slice(-length);
    const prefix = nextText.slice(0, length);
    if (normalizeText(suffix) === normalizeText(prefix)) {
      return length;
    }
  }

  return 0;
}

export function mergeChunkTranscripts(chunks) {
  if (!Array.isArray(chunks) || chunks.length === 0) return '';

  const sorted = [...chunks].sort(
    (a, b) => (a.startMs || 0) - (b.startMs || 0)
  );
  let merged = '';
  let tail = '';

  for (const chunk of sorted) {
    const text = (chunk?.text || '').trim();
    if (!text) continue;

    const overlapLength = computeOverlapLength(tail, text);
    const addition = overlapLength
      ? text.slice(overlapLength).replace(/^\s+/, '')
      : text;

    merged = merged ? `${merged} ${addition}` : addition;
    tail = merged.slice(-MAX_OVERLAP_CHARS);
  }

  return merged.trim();
}
