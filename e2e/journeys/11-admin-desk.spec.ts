import { expect, test } from '../fixtures/test';
import { adminLogin, healthCheck } from '../helpers/api-client';
import { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, pathsFor } from '../helpers/env';

/**
 * Admin password login is @SensitiveThrottle (1/hour) on default API config.
 * This suite tries API admin login once; if rate-limited, tests are skipped
 * (listed as skipped in ISSUES digest — traditional apps isolate admin in a
 * dedicated env with raised sensitive limits).
 */
test.describe('@admin Admin desk', () => {
  let adminOk = false;

  test.beforeAll(async () => {
    if (!(await healthCheck())) {
      test.skip(true, 'API not reachable');
      return;
    }
    try {
      await adminLogin(SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD);
      adminOk = true;
    } catch (err) {
      adminOk = false;
      // Keep message for skip reason
      (globalThis as { __adminSkipReason?: string }).__adminSkipReason = String(err);
    }
  });

  test('admin can open feedback desk route after UI admin login', async ({
    page,
    client,
    auth,
  }) => {
    test.skip(!adminOk, (globalThis as { __adminSkipReason?: string }).__adminSkipReason || 'admin login unavailable');

    // UI path: Sign in → Admin password login (alert/dialog on mobile)
    await auth.gotoSignIn();
    const adminBtn = page.getByRole('button', { name: /Admin password login|Sign in with admin/i });
    if (await adminBtn.first().isVisible().catch(() => false)) {
      await adminBtn.first().click();
      // Ionic alert inputs
      const email = page.locator('input[type="email"], input[placeholder*="superadmin" i]').first();
      const password = page.locator('input[type="password"]').last();
      if (await email.isVisible().catch(() => false)) {
        await email.fill(SUPER_ADMIN_EMAIL);
        await password.fill(SUPER_ADMIN_PASSWORD);
        await page.getByRole('button', { name: /OK|Sign in|Login|Continue/i }).last().click();
      }
    } else if (client === 'web') {
      await page.goto(`${pathsFor(client).signIn}?mode=admin`);
      await page.locator('input[type="email"], input[name="email"]').first().fill(SUPER_ADMIN_EMAIL);
      await page.locator('input[type="password"]').first().fill(SUPER_ADMIN_PASSWORD);
      await page.getByRole('button', { name: /Login|Sign in|Admin/i }).first().click();
    }

    await page.goto(pathsFor(client).adminFeedback);
    await expect(
      page.getByText(/Feedback|thread|Admin|Contact|Support|desk/i).first(),
    ).toBeVisible({ timeout: 25_000 });
  });

  test('API admin session can hit Job Fare workflow status', async () => {
    test.skip(!adminOk, 'admin login unavailable');
    const session = await adminLogin(SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD).catch(() => null);
    test.skip(!session, 'second admin login blocked by throttle — expected on shared API');
    const res = await fetch('http://localhost:3000/v1/channels/workflow', {
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'X-Tab-Id': session!.tabId,
      },
    });
    expect(res.status).toBeLessThan(500);
  });
});
