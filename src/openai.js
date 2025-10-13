/* istanbul ignore file -- depends on live OpenAI SDK calls not executed in Jest */

import OpenAI from 'https://esm.sh/openai@~4.86.2?target=es2020';

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

  let prompt =
    'As a professional transcriber and summarizer, please analyze the following audio transcriptions and produce both a clear, concise summary that captures the key topics, main points, and any critical details.\n' +
    'First, identify the main ideas and list the top 3-5 key takeaways. Then, compose a structured paragraph that integrates these points in a logical, easy-to-read format.\n' +
    'After these sections also write down an accurate, high-quality transcription (that still lists the timestamps if available) and NEVER truncate it but always provide it in its full extent even if it is very long!\n' +
    'For all your produced work, use the same language as the original transcription (e.g. if transcription is German, your result should be in German).\n\n';

  if (trimmedHigh) {
    prompt +=
      'Two transcription versions are provided, prioritize the high-quality version for summarization while cross-checking the low-quality version for error correction etc.\n' +
      `Low Quality Transcription: \n\n${trimmedLow}\n` +
      `High Quality Transcription: \n\n${trimmedHigh}`;
  } else {
    prompt += `Transcription: \n\n${trimmedLow}`;
  }

  const response = await ensureClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 16384,
  });

  return response.choices?.[0]?.message?.content || '';
}

export async function transcribeFile({ file, language }) {
  if (!file) throw new Error('File is required for transcription');
  const response = await ensureClient().audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language,
  });
  return response.text;
}
