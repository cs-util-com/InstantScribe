jest.mock(
  'https://esm.sh/openai@~4.86.2?target=es2020',
  () => ({
    __esModule: true,
    default: function MockOpenAI() {
      return {};
    },
  }),
  { virtual: true }
);

import {
  summarizeText,
  transcribeFile,
  __setClientForTesting,
  __resetClientForTesting,
} from './openai.js';

function createMockClient() {
  return {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
    audio: {
      transcriptions: {
        create: jest.fn(),
      },
    },
  };
}

describe('openai helpers', () => {
  afterEach(() => {
    __resetClientForTesting();
    delete process.env.TRANSCRIBE_MODEL;
    jest.restoreAllMocks();
  });

  test('transcribeFile uses gpt-4o-transcribe model by default', async () => {
    const mockClient = createMockClient();
    mockClient.audio.transcriptions.create.mockResolvedValue({
      text: 'hello world',
    });
    __setClientForTesting(mockClient);

    const file = { name: 'audio.mp3' };
    const result = await transcribeFile({ file, language: 'en' });

    expect(result).toBe('hello world');
    expect(mockClient.audio.transcriptions.create).toHaveBeenCalledWith({
      file,
      model: 'gpt-4o-transcribe',
      language: 'en',
    });
  });

  test('transcribeFile forwards prompt when provided', async () => {
    const mockClient = createMockClient();
    mockClient.audio.transcriptions.create.mockResolvedValue({ text: 'ok' });
    __setClientForTesting(mockClient);

    const file = { name: 'chunk.wav' };
    await transcribeFile({ file, language: 'en', prompt: 'context' });

    expect(mockClient.audio.transcriptions.create).toHaveBeenCalledWith({
      file,
      model: 'gpt-4o-transcribe',
      language: 'en',
      prompt: 'context',
    });
  });

  test('transcribeFile honors TRANSCRIBE_MODEL override', async () => {
    process.env.TRANSCRIBE_MODEL = 'custom-model';
    const mockClient = createMockClient();
    mockClient.audio.transcriptions.create.mockResolvedValue({ text: 'ok' });
    __setClientForTesting(mockClient);

    const file = { name: 'audio.wav' };
    await transcribeFile({ file, language: 'de' });

    expect(mockClient.audio.transcriptions.create).toHaveBeenCalledWith({
      file,
      model: 'custom-model',
      language: 'de',
    });
  });

  test('transcribeFile logs model and status information on failure', async () => {
    const mockClient = createMockClient();
    const error = new Error('Service unavailable');
    error.status = 503;
    error.response = {
      headers: new Map([['x-request-id', 'req_123']]),
    };
    mockClient.audio.transcriptions.create.mockRejectedValue(error);
    __setClientForTesting(mockClient);

    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await expect(
      transcribeFile({ file: { name: 'audio.mp3' }, language: 'fr' })
    ).rejects.toThrow(/Service unavailable/);

    expect(consoleError).toHaveBeenCalled();
    const [, details] = consoleError.mock.calls[0];
    expect(details).toMatchObject({
      model: 'gpt-4o-transcribe',
      status: 503,
      requestId: 'req_123',
    });
  });

  test('summarizeText builds same-language system prompt for English transcripts', async () => {
    const mockClient = createMockClient();
    mockClient.chat.completions.create.mockImplementation(({ messages }) => {
      expect(messages[0]).toMatchObject({ role: 'system' });
      expect(messages[0].content).toContain(
        'Write the summary in the same language as the input text.'
      );
      expect(messages[1].content).toContain('Transcription');
      expect(messages[1].content).toContain('Hello everyone');
      return Promise.resolve({
        choices: [
          {
            message: {
              content: 'Summary: This is an English summary.',
            },
          },
        ],
      });
    });
    __setClientForTesting(mockClient);

    const result = await summarizeText({
      lowQuality: 'Hello everyone, welcome to the meeting.',
      highQuality: '',
    });

    expect(result.startsWith('Summary:')).toBe(true);
    expect(result).toContain('English');
  });

  test('summarizeText builds same-language system prompt for German transcripts', async () => {
    const mockClient = createMockClient();
    mockClient.chat.completions.create.mockImplementation(({ messages }) => {
      expect(messages[0].content).toContain(
        'Write the summary in the same language as the input text.'
      );
      expect(messages[1].content).toContain('High Quality Transcription');
      expect(messages[1].content).toContain('Guten Tag');
      return Promise.resolve({
        choices: [
          {
            message: {
              content:
                'Zusammenfassung: Dies ist eine deutsche Zusammenfassung.',
            },
          },
        ],
      });
    });
    __setClientForTesting(mockClient);

    const result = await summarizeText({
      lowQuality: 'Guten Tag, dies ist die rohe Aufnahme.',
      highQuality: 'Guten Tag zusammen, wir beginnen das Teammeeting.',
    });

    expect(result.startsWith('Zusammenfassung')).toBe(true);
    expect(result).toContain('deutsche');
  });
});
