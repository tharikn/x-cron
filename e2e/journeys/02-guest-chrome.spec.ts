import { expect, test } from '../fixtures/test';
import { healthCheck } from '../helpers/api-client';
import { pathsFor } from '../helpers/env';

test.describe('@smoke @guest Guest chrome (xcron-ui-auth)', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('hides Settings / Notifications / Saved until sign-in', async ({
    discover,
    chrome,
    page,
    client,
  }) => {
    await discover.goto();
    // Clear any leftover sessionStorage from prior runs
    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {
        /* ignore */
      }
    });
    await discover.goto();
    const result = await chrome.guestShouldHideAuthChrome();
    expect(result.issues, result.issues.join('; ')).toEqual([]);
  });

  test('Sign in entry is reachable for guests', async ({ page, client, auth }) => {
    await page.goto(pathsFor(client).home);
    if (client === 'mobile') {
      await page.goto(pathsFor(client).signIn);
    } else {
      await chromeOpenSignIn(page);
    }
    await expect(page.getByText(/Login|Sign in|Username|Browse jobs freely/i).first()).toBeVisible();
    await auth.gotoSignIn();
    await expect(page.getByPlaceholder(/your_name|Enter Username/i).first()).toBeVisible();
  });

  test('Feedback FAQ is OK for guests', async ({ page, client }) => {
    await page.goto(pathsFor(client).feedback);
    await expect(page.getByText(/FAQ|Feedback|Help|Contact/i).first()).toBeVisible({
      timeout: 20_000,
    });
  });
});

async function chromeOpenSignIn(page: import('@playwright/test').Page) {
  const link = page.getByRole('link', { name: /Sign in/i }).first();
  if (await link.isVisible().catch(() => false)) {
    await link.click();
    return;
  }
  await page.goto('/sign-in');
}
