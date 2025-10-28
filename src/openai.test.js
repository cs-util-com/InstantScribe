const mockChatCreate = jest.fn();
const mockTranscriptionCreate = jest.fn();

jest.mock(
  'https://esm.sh/openai@~4.86.2?target=es2020',
  () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: { completions: { create: mockChatCreate } },
      audio: { transcriptions: { create: mockTranscriptionCreate } },
    })),
  }),
  { virtual: true }
);

describe('openai helpers', () => {
  let initClient;
  let summarizeText;
  let transcribeFile;

  beforeAll(async () => {
    ({ initClient, summarizeText, transcribeFile } = await import(
      './openai.js'
    ));
  });

  beforeEach(() => {
    mockChatCreate.mockReset();
    mockTranscriptionCreate.mockReset();
    initClient('test-key');
  });

  describe('transcribeFile', () => {
    test('uses gpt-4o-transcribe by default', async () => {
      const file = { name: 'audio.mp3' };
      mockTranscriptionCreate.mockResolvedValue({ text: 'mock transcription' });

      const result = await transcribeFile({ file, language: 'en' });

      expect(mockTranscriptionCreate).toHaveBeenCalledWith({
        file,
        model: 'gpt-4o-transcribe',
        language: 'en',
      });
      expect(result).toBe('mock transcription');
    });

    test('logs structured details when transcription fails', async () => {
      const file = { name: 'broken.mp3' };
      const error = new Error('Service unavailable');
      error.response = {
        status: 503,
        headers: { 'x-request-id': 'req-123' },
      };

      mockTranscriptionCreate.mockRejectedValue(error);

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(transcribeFile({ file })).rejects.toThrow(
        'Transcription failed: Service unavailable'
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Transcription request failed',
        expect.objectContaining({
          model: 'gpt-4o-transcribe',
          status: 503,
          requestId: 'req-123',
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('summarizeText', () => {
    test('enforces same-language rule for English transcripts', async () => {
      mockChatCreate.mockResolvedValue({
        choices: [{ message: { content: 'Summary output' } }],
      });

      const result = await summarizeText({ lowQuality: 'Hello world' });

      expect(result).toBe('Summary output');
      const request = mockChatCreate.mock.calls[0][0];
      expect(request.messages[0]).toEqual({
        role: 'system',
        content: expect.stringContaining(
          'Write the summary in the same language as the input text.'
        ),
      });
      expect(request.messages[1].content).toContain('Transcription:');
      expect(request.messages[1].content).toContain('Hello world');
    });

    test('includes high-quality transcript context for German input', async () => {
      mockChatCreate.mockResolvedValue({
        choices: [{ message: { content: 'Zusammenfassung' } }],
      });

      await summarizeText({
        lowQuality: 'Hallo zusammen',
        highQuality: 'Guten Tag zusammen, willkommen zur Sitzung.',
      });

      const request = mockChatCreate.mock.calls[0][0];
      expect(request.messages[0].content).toContain(
        'Write the summary in the same language as the input text.'
      );
      expect(request.messages[1].content).toContain(
        'Low Quality Transcription:'
      );
      expect(request.messages[1].content).toContain(
        'High Quality Transcription:'
      );
      expect(request.messages[1].content).toContain(
        'Guten Tag zusammen, willkommen zur Sitzung.'
      );
    });
  });
});
