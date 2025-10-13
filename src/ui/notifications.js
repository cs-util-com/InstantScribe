const DEFAULT_NOTIFICATION_DURATION = 3000;

export function showNotification(
  message,
  duration = DEFAULT_NOTIFICATION_DURATION
) {
  if (typeof document === 'undefined') return;
  const notification = document.createElement('div');
  notification.className =
    'fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black/70 text-white py-2.5 px-4 rounded-md z-50 text-center transition-opacity duration-500';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 500);
  }, duration);
}

export function updateSummarizeButtonVisibility({
  transcriptionEl,
  highQualityEl,
  summarizeBtn,
}) {
  if (!summarizeBtn) return;
  const hasTranscriptionText = Boolean(
    transcriptionEl && transcriptionEl.textContent.trim().length > 0
  );
  const hasHighQualityText = Boolean(
    highQualityEl && highQualityEl.textContent.trim().length > 0
  );

  summarizeBtn.classList.toggle(
    'hidden',
    !(hasTranscriptionText || hasHighQualityText)
  );
}

export function updateDownloadAiTextsButtonVisibility({
  highQualityEl,
  summaryEl,
  container,
}) {
  if (!container) return;
  const hasHighQualityText = Boolean(
    highQualityEl && highQualityEl.textContent.trim().length > 0
  );
  const hasSummaryText = Boolean(
    summaryEl && summaryEl.textContent.trim().length > 0
  );

  container.classList.toggle('hidden', !(hasHighQualityText || hasSummaryText));
}
