/* istanbul ignore file -- depends on live OpenAI SDK calls not executed in Jest */

import OpenAI from 'https://esm.sh/openai@~4.86.2?target=es2020';

const FALLBACK_TRANSCRIBE_MODEL = 'gpt-4o-transcribe';

let client = null;
let cachedKey = '';

function resolveTranscribeModel() {
  if (typeof globalThis === 'undefined') {
    return FALLBACK_TRANSCRIBE_MODEL;
  }

  const envModel =
    globalThis.process?.env?.TRANSCRIBE_MODEL ??
    globalThis.TRANSCRIBE_MODEL ??
    '';

  const trimmed = typeof envModel === 'string' ? envModel.trim() : '';
  if (!trimmed) return FALLBACK_TRANSCRIBE_MODEL;
  return trimmed;
}

function buildTranscriptionRequest({ file, model, language }) {
  return language ? { file, model, language } : { file, model };
}

function extractStatus(error) {
  return error?.response?.status ?? error?.status ?? null;
}

function extractRequestId(error) {
  const readers = [
    (err) => err?.response?.headers?.['x-request-id'],
    (err) => err?.response?.data?.request_id,
    (err) => err?.response?.data?.id,
    (err) => err?.requestId,
  ];

  for (const read of readers) {
    const value = read(error);
    if (value != null) {
      return value;
    }
  }

  return null;
}

function logTranscriptionFailure({ error, model }) {
  console.error('Transcription request failed', {
    model,
    status: extractStatus(error),
    requestId: extractRequestId(error),
    error,
  });
}

export function initClient(apiKey) {
  const trimmedKey = (apiKey || '').trim();
  if (!trimmedKey) {
    client = null;
    cachedKey = '';
    return null;
  }

  if (client && cachedKey === trimmedKey) {
    return client;
  }

  client = new OpenAI({
    apiKey: trimmedKey,
    dangerouslyAllowBrowser: true,
  });
  cachedKey = trimmedKey;
  return client;
}

function ensureClient() {
  if (!client) throw new Error('OpenAI client not initialized');
  return client;
}

export async function summarizeText({ lowQuality = '', highQuality = '' }) {
  const trimmedLow = lowQuality.trim();
  const trimmedHigh = highQuality.trim();

  if (!trimmedLow && !trimmedHigh) {
    throw new Error('No transcription text provided');
  }

  const systemPrompt =
    'As a professional transcriber and summarizer, please analyze the following audio transcriptions and produce both a clear, concise summary that captures the key topics, main points, and any critical details.\n' +
    'Write the summary in the same language as the input text.\n' +
    'First, identify the main ideas and list the top 3-5 key takeaways. Then, compose a structured paragraph that integrates these points in a logical, easy-to-read format.\n' +
    'After these sections also write down an accurate, high-quality transcription (that still lists the timestamps if available) and NEVER truncate it but always provide it in its full extent even if it is very long!\n' +
    'For all your produced work, use the same language as the original transcription (e.g. if transcription is German, your result should be in German).';

  let userPrompt = '';

  if (trimmedHigh) {
    userPrompt +=
      'Two transcription versions are provided, prioritize the high-quality version for summarization while cross-checking the low-quality version for error correction etc.\n' +
      `Low Quality Transcription: \n\n${trimmedLow}\n` +
      `High Quality Transcription: \n\n${trimmedHigh}`;
  } else {
    userPrompt += `Transcription: \n\n${trimmedLow}`;
  }

  const response = await ensureClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    max_tokens: 16384,
  });

  return response.choices?.[0]?.message?.content || '';
}

export async function transcribeFile({ file, language }) {
  if (!file) throw new Error('File is required for transcription');
  const model = resolveTranscribeModel();

  try {
    const response = await ensureClient().audio.transcriptions.create(
      buildTranscriptionRequest({ file, model, language })
    );
    return response.text;
  } catch (error) {
    logTranscriptionFailure({ error, model });
    const message = error?.message || 'Unknown transcription error';
    throw new Error(`Transcription failed: ${message}`);
  }
}
