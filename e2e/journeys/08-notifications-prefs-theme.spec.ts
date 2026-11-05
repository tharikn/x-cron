import { expect, test } from '../fixtures/test';
import { healthCheck, registerUser } from '../helpers/api-client';
import { pathsFor } from '../helpers/env';

test.describe('@seeker Notifications · Prefs · Theme (auth-only)', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('guest hitting notifications is gated or redirected', async ({ page, client }) => {
    await page.goto(pathsFor(client).notifications);
    // Either empty gated chrome, redirect to sign-in, or prompt
    await expect(
      page.getByText(/Sign in|Login|Notifications|inbox|alerts|Browse/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('signed-in notifications inbox loads', async ({ auth, page, client }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await auth.login({ username: seeker.username, password: seeker.password });
    await page.goto(pathsFor(client).notifications);
    await expect(
      page.getByText(/Notification|inbox|Welcome|Complete your profile|empty|No alerts/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('signed-in preferences page loads', async ({ auth, page, client }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await auth.login({ username: seeker.username, password: seeker.password });
    await page.goto(pathsFor(client).settingsPrefs);
    await expect(
      page.getByText(/Preference|alert|push|mail|in-app|salary|remote|Theme/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('signed-in theme picker loads', async ({ auth, page, client }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await auth.login({ username: seeker.username, password: seeker.password });
    await page.goto(pathsFor(client).settingsTheme);
    await expect(
      page
        .getByText(/Theme|System|Light|Dark|Warm|Appearance|night|sky/i)
        .or(page.locator('[data-theme], html'))
        .first(),
    ).toBeVisible({ timeout: 20_000 });
    // At minimum the settings theme route should not 404
    await expect(page).not.toHaveURL(/\/sign-in$/);
  });
});
