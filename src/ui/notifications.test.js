import {
  showNotification,
  updateSummarizeButtonVisibility,
  updateDownloadAiTextsButtonVisibility,
} from './notifications.js';

describe('notifications ui helpers', () => {
  test('updateSummarizeButtonVisibility toggles hidden class', () => {
    const transcriptionEl = document.createElement('div');
    const highQualityEl = document.createElement('div');
    const summarizeBtn = document.createElement('button');
    summarizeBtn.classList.add('hidden');

    updateSummarizeButtonVisibility({
      transcriptionEl,
      highQualityEl,
      summarizeBtn,
    });
    expect(summarizeBtn.classList.contains('hidden')).toBe(true);

    transcriptionEl.textContent = 'Hello world';
    updateSummarizeButtonVisibility({
      transcriptionEl,
      highQualityEl,
      summarizeBtn,
    });
    expect(summarizeBtn.classList.contains('hidden')).toBe(false);
  });

  test('updateDownloadAiTextsButtonVisibility requires any text content', () => {
    const highQualityEl = document.createElement('div');
    const summaryEl = document.createElement('div');
    const container = document.createElement('div');
    container.classList.add('hidden');

    updateDownloadAiTextsButtonVisibility({
      highQualityEl,
      summaryEl,
      container,
    });
    expect(container.classList.contains('hidden')).toBe(true);

    summaryEl.textContent = 'Summary';
    updateDownloadAiTextsButtonVisibility({
      highQualityEl,
      summaryEl,
      container,
    });
    expect(container.classList.contains('hidden')).toBe(false);
  });

  test('showNotification creates and removes notification element', () => {
    jest.useFakeTimers();
    showNotification('Hello world', 100);
    const notification = document.body.lastElementChild;
    expect(notification).not.toBeNull();
    expect(notification.textContent).toBe('Hello world');

    jest.advanceTimersByTime(100);
    jest.advanceTimersByTime(500);

    expect(document.body.contains(notification)).toBe(false);
    jest.useRealTimers();
  });

  test('showNotification uses default duration when not provided', () => {
    jest.useFakeTimers();
    showNotification('Default duration');
    const notification = document.body.lastElementChild;
    expect(notification).not.toBeNull();

    jest.advanceTimersByTime(3000);
    expect(notification.style.opacity).toBe('0');
    jest.advanceTimersByTime(500);
    expect(document.body.contains(notification)).toBe(false);
    jest.useRealTimers();
  });

  test('showNotification no-ops when document is unavailable', () => {
    const originalDocument = global.document;
    global.document = undefined;
    expect(() => showNotification('Fallback')).not.toThrow();
    global.document = originalDocument;
  });

  test('updateSummarizeButtonVisibility tolerates missing button', () => {
    expect(() =>
      updateSummarizeButtonVisibility({
        transcriptionEl: null,
        highQualityEl: null,
        summarizeBtn: null,
      })
    ).not.toThrow();
  });

  test('updateDownloadAiTextsButtonVisibility tolerates missing container', () => {
    expect(() =>
      updateDownloadAiTextsButtonVisibility({
        highQualityEl: null,
        summaryEl: null,
        container: null,
      })
    ).not.toThrow();
  });
});
