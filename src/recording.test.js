import {
  checkRecorderSupport,
  downloadBlob,
  getDateTimePrefix,
  htmlToPlainText,
  padZero,
} from './recording.js';

describe('recording helpers', () => {
  test('getDateTimePrefix formats timestamp with leading zeros', () => {
    const date = new Date('2024-03-05T07:04:09Z');
    const prefix = getDateTimePrefix(date.getTime());
    expect(prefix).toBe('2024-03-05_07-04-09');
  });

  test('padZero adds leading zeros to single digits', () => {
    expect(padZero(4)).toBe('04');
    expect(padZero(12)).toBe('12');
  });

  test('htmlToPlainText removes markup while preserving line breaks', () => {
    const html = '<div>Hello<br>world</div><p>Paragraph</p>';
    const text = htmlToPlainText(html);
    expect(text).toBe('Hello\nworld\nParagraph');
  });

  test('checkRecorderSupport reflects availability of APIs', () => {
    const unsupported = {
      MediaRecorder: undefined,
      SpeechRecognition: function MockSpeech() {},
    };
    expect(checkRecorderSupport(unsupported)).toBe(false);

    const supported = {
      MediaRecorder: function MockRecorder() {},
      SpeechRecognition: function MockSpeech() {},
    };
    expect(checkRecorderSupport(supported)).toBe(true);
  });

  test('checkRecorderSupport returns false when window-like object is missing', () => {
    expect(checkRecorderSupport(undefined)).toBe(false);
  });

  test('downloadBlob appends anchor and revokes URL', () => {
    const blob = new Blob(['test'], { type: 'text/plain' });
    const originalCreate = URL.createObjectURL;
    const originalRevoke = URL.revokeObjectURL;
    URL.createObjectURL = jest.fn(() => 'blob:url');
    URL.revokeObjectURL = jest.fn();
    const appendSpy = jest.spyOn(document.body, 'appendChild');
    const removeSpy = jest.spyOn(document.body, 'removeChild');

    downloadBlob(blob, 'file.txt');

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:url');

    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });

  test('downloadBlob exits when blob is missing', () => {
    const appendSpy = jest.spyOn(document.body, 'appendChild');
    downloadBlob(null, 'file.txt');
    expect(appendSpy).not.toHaveBeenCalled();
    appendSpy.mockRestore();
  });

  test('downloadBlob exits when DOM APIs are unavailable', () => {
    const blob = new Blob(['test'], { type: 'text/plain' });
    const env = {
      document: null,
      URL: {
        createObjectURL: jest.fn(),
        revokeObjectURL: jest.fn(),
      },
    };

    downloadBlob(blob, 'file.txt', env);

    expect(env.URL.createObjectURL).not.toHaveBeenCalled();
    expect(env.URL.revokeObjectURL).not.toHaveBeenCalled();
  });

  test('htmlToPlainText returns original value when document is unavailable', () => {
    const html = '<p>Hello</p>';
    expect(htmlToPlainText(html, { document: null })).toBe(html);
  });
});
