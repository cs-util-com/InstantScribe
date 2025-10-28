/* istanbul ignore file -- depends on live OpenAI SDK calls not executed in Jest */

import OpenAI from 'https://esm.sh/openai@~4.86.2?target=es2020';

const DEFAULT_TRANSCRIPTION_MODEL = 'gpt-4o-transcribe';

function resolveTranscriptionModel() {
  const candidates = [];

  if (typeof process !== 'undefined') {
    candidates.push(process?.env?.TRANSCRIBE_MODEL);
  }

  if (typeof window !== 'undefined') {
    candidates.push(window?.TRANSCRIBE_MODEL, window?.ENV?.TRANSCRIBE_MODEL);
  }

  const chosen = candidates.find(
    (value) => typeof value === 'string' && value.trim().length > 0
  );

  return chosen ? chosen.trim() : DEFAULT_TRANSCRIPTION_MODEL;
}

function extractStatus(error) {
  if (!error) return null;
  if (typeof error.status !== 'undefined') return error.status;

  const { response } = error;
  if (!response) return null;
  if (typeof response.status !== 'undefined') return response.status;
  if (typeof response.statusCode !== 'undefined') return response.statusCode;
  if (typeof response.statusText !== 'undefined') return response.statusText;
  return null;
}

function readHeader(headers, key) {
  if (!headers) return null;
  if (typeof headers.get === 'function') {
    const viaGet = headers.get(key);
    if (viaGet) return viaGet;
  }
  const value = headers[key];
  return typeof value === 'string' && value ? value : null;
}

function extractRequestId(error) {
  if (!error) return null;
  if (error.requestId) return error.requestId;
  if (error.response?.requestId) return error.response.requestId;

  const headerSources = [error.headers, error.response?.headers];
  for (const headers of headerSources) {
    const id = readHeader(headers, 'x-request-id');
    if (id) return id;
  }
  return null;
}

function logTranscriptionFailure(error, context) {
  console.error('Transcription request failed', {
    message: error?.message,
    ...context,
    error,
  });
}

function createTranscriptionError(error, context) {
  const info = [`model: ${context.model}`];
  if (context.status) info.push(`status: ${context.status}`);
  if (context.requestId) info.push(`requestId: ${context.requestId}`);

  const suffix = info.length ? ` (${info.join(', ')})` : '';
  const enriched = new Error(
    (error?.message || 'Transcription failed') + suffix
  );
  enriched.cause = error;
  if (context.status) enriched.status = context.status;
  if (context.requestId) enriched.requestId = context.requestId;
  return enriched;
}

let client = null;
let cachedKey = '';

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
    'You are an expert summarizer for field recordings.\n' +
    'Write the summary in the same language as the input text.\n' +
    'As a professional transcriber and summarizer, analyze the provided audio transcriptions and produce both a clear, concise summary that captures the key topics, main points, and any critical details.\n' +
    'First, identify the main ideas and list the top 3-5 key takeaways. Then, compose a structured paragraph that integrates these points in a logical, easy-to-read format.\n' +
    'After these sections also write down an accurate, high-quality transcription (that still lists the timestamps if available) and NEVER truncate it but always provide it in its full extent even if it is very long!';

  let userContent = '';

  if (trimmedHigh) {
    userContent +=
      'Two transcription versions are provided, prioritize the high-quality version for summarization while cross-checking the low-quality version for error correction etc.\n' +
      `Low Quality Transcription: \n\n${trimmedLow}\n` +
      `High Quality Transcription: \n\n${trimmedHigh}`;
  } else {
    userContent += `Transcription: \n\n${trimmedLow}`;
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
        content: userContent,
      },
    ],
    max_tokens: 16384,
  });

  return response.choices?.[0]?.message?.content || '';
}

export async function transcribeFile({ file, language }) {
  if (!file) throw new Error('File is required for transcription');
  const model = resolveTranscriptionModel();

  try {
    const response = await ensureClient().audio.transcriptions.create({
      file,
      model,
      language,
    });
    return response.text;
  } catch (error) {
    const context = {
      model,
      status: extractStatus(error),
      requestId: extractRequestId(error),
    };

    logTranscriptionFailure(error, context);
    throw createTranscriptionError(error, context);
  }
}

export function __setClientForTesting(mockClient) {
  client = mockClient;
  cachedKey = 'test';
}

export function __resetClientForTesting() {
  client = null;
  cachedKey = '';
}
