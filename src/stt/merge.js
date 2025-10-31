import { STT_CONFIG } from './config.js';

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function cosineSimilarity(aTokens, bTokens) {
  if (!aTokens.length || !bTokens.length) return 0;
  const freqA = new Map();
  const freqB = new Map();

  for (const token of aTokens) {
    freqA.set(token, (freqA.get(token) || 0) + 1);
  }
  for (const token of bTokens) {
    freqB.set(token, (freqB.get(token) || 0) + 1);
  }

  let dot = 0;
  for (const [token, countA] of freqA.entries()) {
    const countB = freqB.get(token) || 0;
    dot += countA * countB;
  }

  const norm = (freq) =>
    Math.sqrt([...freq.values()].reduce((sum, c) => sum + c * c, 0));
  const denom = norm(freqA) * norm(freqB);
  return denom === 0 ? 0 : dot / denom;
}

function removeDuplicateSentence(previousText, currentText) {
  if (!previousText || !currentText) return currentText;

  const sentences = currentText.split(/(?<=[.!?])\s+/);
  if (sentences.length === 0) {
    return currentText;
  }

  const firstSentence = sentences[0];
  const prevTail = previousText.slice(
    -Math.max(firstSentence.length + 20, 200)
  );
  const normalizedTail = prevTail.toLowerCase();
  const normalizedSentence = firstSentence.toLowerCase();
  const similarity = cosineSimilarity(
    tokenize(prevTail),
    tokenize(firstSentence)
  );

  if (normalizedTail.includes(normalizedSentence) || similarity >= 0.75) {
    return currentText.slice(firstSentence.length).trimStart();
  }

  return currentText;
}

export function mergeChunkResults(chunks) {
  const ordered = [...chunks].sort((a, b) => a.index - b.index);
  let merged = '';

  for (const chunk of ordered) {
    const cleanText = removeDuplicateSentence(merged, chunk.text || '');
    merged = merged ? `${merged}\n${cleanText}` : cleanText;
  }

  return merged.trim();
}

export function buildPromptFromTail(text) {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';
  return trimmed.slice(-STT_CONFIG.promptTailChars);
}
