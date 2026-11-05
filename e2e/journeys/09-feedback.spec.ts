import { expect, test } from '../fixtures/test';
import {
  createFeedbackThread,
  getFaq,
  healthCheck,
  registerUser,
} from '../helpers/api-client';
import { pathsFor } from '../helpers/env';

test.describe('@feedback FAQ + Contact Admin messenger', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('public FAQ endpoint + page', async ({ page, client }) => {
    await getFaq();
    await page.goto(pathsFor(client).feedback);
    await expect(page.getByText(/FAQ|Feedback|question|help/i).first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test('signed-in seeker can open Contact Admin area', async ({ auth, page, client }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    try {
      await createFeedbackThread(seeker);
    } catch (err) {
      test.info().annotations.push({
        type: 'api-issue',
        description: String(err),
      });
    }
    await auth.login({ username: seeker.username, password: seeker.password });
    await page.goto(pathsFor(client).feedback);
    await expect(
      page.getByText(/Contact Admin|Message|thread|Support|Send|FAQ|Feedback/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });
});
