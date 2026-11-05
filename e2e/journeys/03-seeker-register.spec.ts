import { expect, test } from '../fixtures/test';
import { healthCheck } from '../helpers/api-client';
import { DEFAULT_PASSWORD } from '../helpers/env';
import { uniqueUsername } from '../helpers/unique';

test.describe('@smoke @seeker Seeker register → signed-in hub', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('create Job Seeker account from Sign Up', async ({ auth, page }) => {
    const username = uniqueUsername('skui');
    await auth.register({
      username,
      password: DEFAULT_PASSWORD,
      role: 'seeker',
    });
    await auth.expectSignedIn();
    await expect(page.getByText(new RegExp(username, 'i')).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('login with existing seeker (API-created)', async ({ auth }) => {
    const { registerUser } = await import('../helpers/api-client');
    const user = await registerUser({ intendedRole: 'seeker' });
    await auth.login({ username: user.username, password: user.password });
    await auth.expectSignedIn();
  });
});
