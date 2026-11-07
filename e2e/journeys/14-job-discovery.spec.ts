import type { Page } from '@playwright/test';
import { expect, test } from '../fixtures/test';
import {
  createPublishedJob,
  healthCheck,
  registerUser,
  completeSeekerProfile,
} from '../helpers/api-client';
import { pathsFor } from '../helpers/env';

/**
 * Job discovery (docs/JOB_DISCOVERY.md): URL-synced filters, dismissible chips,
 * Save search for signed-in seekers. Runs on mobile, web and android.
 */
test.describe('@discovery Job discovery filters', () => {
  let token = '';
  let title = '';

  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
    const rec = await registerUser({ intendedRole: 'employer' });
    token = `zd${Date.now().toString(36)}`;
    title = `Discovery ${token} Analyst`;
    await createPublishedJob(rec, { title, remote: false });
  });

  function homeWith(client: 'mobile' | 'web', params: Record<string, string>): string {
    return `${pathsFor(client).home}?${new URLSearchParams(params).toString()}`;
  }

  /** Navigate and wait for the jobs search that carries our unique keyword. */
  async function gotoAndWaitForSearch(page: Page, url: string): Promise<void> {
    const searched = page.waitForResponse(
      (res) =>
        /\/v1\/jobs(\/search)?\?/.test(res.url()) &&
        res.url().includes(token) &&
        res.request().method() === 'GET',
      { timeout: 30_000 },
    );
    await page.goto(url);
    await searched;
  }

  test('@smoke deep-linked keyword shows the matching job', async ({ page, client }) => {
    await gotoAndWaitForSearch(page, homeWith(client, { q: token }));
    await expect(page.getByText(title).first()).toBeVisible({ timeout: 20_000 });
  });

  test('URL filters apply, render chips, and dismissing a chip updates URL + results', async ({
    page,
    client,
  }) => {
    await gotoAndWaitForSearch(page, homeWith(client, { q: token, remote: 'true' }));

    const remoteChip = page.locator('.filter-chip', { hasText: /^\s*Remote/ });
    await expect(remoteChip.first()).toBeVisible({ timeout: 20_000 });
    // Job is on-site, so the remote filter must exclude it.
    await expect(page.getByText(title)).toHaveCount(0);

    await remoteChip.first().click();
    await expect.poll(() => new URL(page.url()).searchParams.get('remote')).toBeNull();
    await expect(page.getByText(title).first()).toBeVisible({ timeout: 20_000 });
    expect(new URL(page.url()).searchParams.get('q')).toBe(token);
  });

  test('Clear all removes every filter from the URL', async ({ page, client }) => {
    await gotoAndWaitForSearch(
      page,
      homeWith(client, { q: token, fresher: 'true', easyApply: 'true', postedWithin: '7d' }),
    );
    await expect(page.locator('.filter-chip', { hasText: 'Fresher' }).first()).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.locator('.filter-chip', { hasText: 'Easy apply' }).first()).toBeVisible();

    await page.locator('.filter-chip--clear').first().click();
    await expect
      .poll(() => {
        const sp = new URL(page.url()).searchParams;
        return ['fresher', 'easyApply', 'postedWithin'].filter((k) => sp.has(k));
      })
      .toEqual([]);
  });

  test('guests do not see Save search', async ({ page, client }) => {
    await gotoAndWaitForSearch(page, homeWith(client, { q: token }));
    await expect(page.getByText(title).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('button', { name: /Save (this )?search/i })).toHaveCount(0);
  });

  test('signed-in seeker saves the current search with its filters', async ({
    auth,
    page,
    client,
  }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await completeSeekerProfile(seeker);
    await auth.login({ username: seeker.username, password: seeker.password });
    await auth.expectSignedIn();

    await gotoAndWaitForSearch(page, homeWith(client, { q: token, remote: 'true' }));
    const save = page.getByRole('button', { name: /Save (this )?search/i }).first();
    await expect(save).toBeVisible({ timeout: 20_000 });

    const saved = page.waitForResponse(
      (res) => res.url().includes('/v1/me/saved-searches') && res.request().method() === 'POST',
    );
    await save.click();
    const res = await saved;
    expect(res.status()).toBeLessThan(300);
    const body = res.request().postDataJSON() as { query?: { keyword?: string; remote?: boolean } };
    expect(body.query?.keyword).toBe(token);
    expect(body.query?.remote).toBe(true);
  });
});
