import { defineConfig, devices } from '@playwright/test';
import { MOBILE_BASE, WEB_BASE } from './helpers/env';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './journeys',
  fullyParallel: false,
  workers: 1,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['./reporters/issues-reporter.ts'],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 45_000,
  },
  projects: [
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        baseURL: MOBILE_BASE,
      },
    },
    {
      name: 'web',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: WEB_BASE,
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
  /* Clients are started by scripts/run-e2e.mjs (reuseExistingServer). */
});
