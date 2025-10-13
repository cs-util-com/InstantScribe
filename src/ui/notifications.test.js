import {
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
});
