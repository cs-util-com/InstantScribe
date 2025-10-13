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
    const originalMediaRecorder = window.MediaRecorder;
    const originalSpeech = window.SpeechRecognition;
    window.MediaRecorder = undefined;
    window.SpeechRecognition = function MockSpeech() {};
    expect(checkRecorderSupport()).toBe(false);

    window.MediaRecorder = function MockRecorder() {};
    expect(checkRecorderSupport()).toBe(true);

    window.MediaRecorder = originalMediaRecorder;
    window.SpeechRecognition = originalSpeech;
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
});
