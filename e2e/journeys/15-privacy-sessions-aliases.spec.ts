import { expect, test } from '../fixtures/test';
import {
  createPublishedJob,
  healthCheck,
  registerUser,
  request,
  completeSeekerProfile,
} from '../helpers/api-client';
import { pathsFor } from '../helpers/env';

/**
 * Doc 10 UX map (docs/WEBSITE_AND_ANDROID_UX.md) + docs/SECURITY_PRIVACY.md:
 * privacy page, alias/deep-link redirects, Devices & sessions, data export.
 */
test.describe('@privacy @routing Privacy, aliases, sessions', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('@smoke public Privacy page explains export / delete controls', async ({ page, client }) => {
    await page.goto('/privacy');
    if (client === 'mobile') {
      await expect(page).toHaveURL(/\/tabs\/privacy$/);
    }
    await expect(page.locator('h1', { hasText: 'Privacy' }).first()).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText(/Export my data|export a portable JSON/i).first()).toBeVisible();
  });

  test('guest alias routes resolve to the canonical sign-in screen', async ({ page, client }) => {
    const signIn = client === 'mobile' ? /\/tabs\/account/ : /\/sign-in/;
    for (const alias of ['/login', '/register']) {
      await page.goto(alias);
      await expect(page, `${alias} should redirect`).toHaveURL(signIn, { timeout: 20_000 });
    }
  });

  test('legacy /jobs/:id deep link opens the job detail', async ({ page, client }) => {
    const rec = await registerUser({ intendedRole: 'employer' });
    const job = await createPublishedJob(rec);
    await page.goto(`/jobs/${job.id}`);
    if (client === 'mobile') {
      await expect(page).toHaveURL(new RegExp(`/tabs/jobs/${job.id}$`));
    }
    await expect(page.getByText(job.title).first()).toBeVisible({ timeout: 20_000 });
  });

  test('signed-in alias routes land on Applied jobs and Notifications', async ({
    auth,
    page,
    client,
  }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await completeSeekerProfile(seeker);
    await auth.login({ username: seeker.username, password: seeker.password });
    await auth.expectSignedIn();

    const paths = pathsFor(client);
    await page.goto('/applications');
    await expect(page).toHaveURL(new RegExp(`${paths.applied}$`), { timeout: 20_000 });
    await page.goto('/alerts');
    await expect(page).toHaveURL(new RegExp(`${paths.notifications}$`), { timeout: 20_000 });
  });

  test('Devices & sessions lists this device and revokes another session', async ({
    auth,
    page,
    client,
  }) => {
    // Registration via API opens session #1; the UI login below opens session #2.
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await completeSeekerProfile(seeker);
    await auth.login({ username: seeker.username, password: seeker.password });
    await auth.expectSignedIn();

    await page.goto(`${pathsFor(client).account}?tab=account`);
    const section = page.locator('.sessions').first();
    await expect(section.getByRole('heading', { name: /Devices & sessions/i })).toBeVisible({
      timeout: 20_000,
    });
    await expect(section.getByText('This device').first()).toBeVisible({ timeout: 20_000 });

    const others = section.getByText('Other session');
    const otherCount = await others.count();
    test.skip(otherCount === 0, 'AUTH_SINGLE_SESSION=1 — login revoked the API session');

    await section.getByRole('button', { name: /^Revoke$/ }).first().click();
    await expect(others).toHaveCount(otherCount - 1, { timeout: 20_000 });
    await expect(section.getByText('This device').first()).toBeVisible();

    if (otherCount === 1) {
      const me = await request('GET', '/auth/me', {
        token: seeker.token,
        tabId: seeker.tabId,
        expectOk: false,
      });
      expect(me.status).toBe(401);
    }
  });

  test('Export my data downloads the account JSON', async ({ auth, page, client }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await completeSeekerProfile(seeker);
    await auth.login({ username: seeker.username, password: seeker.password });
    await auth.expectSignedIn();

    await page.goto(`${pathsFor(client).account}?tab=account`);
    const exportBtn = page.getByRole('button', { name: /Export my data/i }).first();
    await expect(exportBtn).toBeVisible({ timeout: 20_000 });

    const exported = page.waitForResponse(
      (res) => res.url().includes('/v1/me/export') && res.request().method() === 'GET',
    );
    await exportBtn.click();
    const res = await exported;
    expect(res.status()).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(JSON.stringify(body)).not.toMatch(/passwordHash|refreshTokenHash/);
    await expect(page.getByText('Data export downloaded.').first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
