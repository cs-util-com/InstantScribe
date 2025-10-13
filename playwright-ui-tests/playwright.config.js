// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration focused on a single smoke test that assures the
 * static `index.html` page renders without console errors.
 */
const captureArtifacts = process.env.PLAYWRIGHT_CAPTURE === '1';

module.exports = defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: process.env.CI
    ? [
        ['github'],
        ['json', { outputFile: '../test-results.json' }],
        ['junit', { outputFile: '../junit.xml' }],
      ]
    : [
        ['list'],
        ['html', { open: 'never' }],
      ],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: captureArtifacts ? 'on' : 'on-first-retry',
    screenshot: captureArtifacts ? 'on' : 'only-on-failure',
    video: captureArtifacts ? 'on' : 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run serve:static',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
