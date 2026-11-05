import { expect, test } from '../fixtures/test';
import {
  createPublishedJob,
  getReputation,
  healthCheck,
  registerUser,
  saveJob,
} from '../helpers/api-client';
import { pathsFor } from '../helpers/env';

test.describe('@seeker Saved jobs · Performance / My Rating', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('save job via API then open Saved / Activity', async ({ auth, page, client }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    const employer = await registerUser({ intendedRole: 'employer' });
    const job = await createPublishedJob(employer);
    await saveJob(seeker, job.id);

    await auth.login({ username: seeker.username, password: seeker.password });
    if (client === 'mobile') {
      await page.goto(pathsFor(client).settingsSaved);
    } else {
      await page.goto(pathsFor(client).me);
    }
    await expect(
      page.getByText(new RegExp(job.title.slice(0, 10), 'i')).or(page.getByText(/Saved/i)).first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('My Rating / performance route', async ({ auth, page, client }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await getReputation(seeker);
    await auth.login({ username: seeker.username, password: seeker.password });
    await page.goto(pathsFor(client).performance);
    await expect(
      page.getByText(/Rating|Rising|Steady|Needs care|score|Performance/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });
});
