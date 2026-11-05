import { expect, test } from '../fixtures/test';
import {
  createApplyProfile,
  createPublishedJob,
  healthCheck,
  registerUser,
  upsertSeekerProfile,
} from '../helpers/api-client';
import { pathsFor } from '../helpers/env';

test.describe('@seeker Profile + apply version + Easy apply', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('Account Profile tab shows personal fields after sign-in', async ({
    auth,
    page,
    client,
  }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await upsertSeekerProfile(seeker);
    await auth.login({ username: seeker.username, password: seeker.password });
    await auth.expectSignedIn();
    await auth.openAccountTab('profile');
    await expect(page.getByText(/Personal|Name|Your profile/i).first()).toBeVisible();
  });

  test('Apply tab is visible for seeker and hidden deep-link clamp works', async ({
    auth,
    page,
    client,
  }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await createApplyProfile(seeker);
    await auth.login({ username: seeker.username, password: seeker.password });
    await auth.expectSignedIn();
    await page.goto(`${pathsFor(client).account}?tab=apply`);
    await expect(page.getByText(/Apply|version|skills|headline/i).first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test('Easy apply on published job (API job + apply profile)', async ({
    auth,
    jobDetail,
    page,
  }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await upsertSeekerProfile(seeker);
    const profile = await createApplyProfile(seeker);
    const employer = await registerUser({ intendedRole: 'employer' });
    const job = await createPublishedJob(employer, {
      title: `E2E Apply ${Date.now().toString(36)}`,
    });

    await auth.login({ username: seeker.username, password: seeker.password });
    await jobDetail.goto(job.id);
    await expect(page.getByText(job.title).first()).toBeVisible({ timeout: 20_000 });
    const easy = jobDetail.easyApply();
    await expect(easy).toBeVisible({ timeout: 15_000 });
    await easy.click();
    // Success toast or navigation to application / applied
    await expect(
      page
        .getByText(/Applied|application|timeline|submitted|success/i)
        .or(page.locator('.xcron-toast--success, ion-toast'))
        .first(),
    ).toBeVisible({ timeout: 25_000 });
    void profile;
  });

  test('job detail shows public employer contact without unlock', async ({
    jobDetail,
    page,
  }) => {
    const employer = await registerUser({ intendedRole: 'employer' });
    const job = await createPublishedJob(employer);
    await jobDetail.goto(job.id);
    await expect(jobDetail.contactBlock()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/9876501234|hr@e2ecorp|e2ecorp\.example/i).first()).toBeVisible();
  });
});
