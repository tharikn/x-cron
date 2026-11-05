import { expect, test } from '@playwright/test';

/**
 * Package-local smoke kept for `cd mobile && npm run test:e2e`.
 * Full journeys live in repo-root `e2e/` — run `npm run test:e2e` from monorepo root.
 */
test('Discover shows X Cron brand', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('X Cron').first()).toBeVisible({ timeout: 30_000 });
});
