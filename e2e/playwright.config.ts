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
    /** HTTP contract specs against API :3000 — no browser, runs before UI journeys. */
    {
      name: 'api',
      testDir: './api',
      testMatch: /.*\.api\.spec\.ts$/,
    },
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
    /**
     * Real Android (emulator/device) via Playwright experimental `_android`.
     * Same Ionic journeys as `mobile`; fixture swaps Page to Chrome on device
     * after `adb reverse` for :3000 / :4200. Requires: adb + Chrome + awake device.
     */
    {
      name: 'android',
      use: {
        ...devices['Pixel 7'],
        baseURL: MOBILE_BASE,
        // Desktop Chromium still boots briefly; fixture closes it and opens Android Chrome.
        headless: true,
      },
    },
  ],
  /* Clients are started by scripts/run-e2e.mjs (reuseExistingServer). */
});
