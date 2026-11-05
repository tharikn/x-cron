import { expect, test } from '../fixtures/test';
import { createPublishedJob, healthCheck, registerUser } from '../helpers/api-client';
import { DEFAULT_PASSWORD } from '../helpers/env';
import { uniqueUsername } from '../helpers/unique';
import { pathsFor } from '../helpers/env';

test.describe('@smoke @recruiter Recruiter register → Post → My jobs', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('create Recruiter account from Sign Up', async ({ auth, page }) => {
    const username = uniqueUsername('recui');
    await auth.register({
      username,
      password: DEFAULT_PASSWORD,
      role: 'employer',
    });
    await auth.expectSignedIn();
    await expect(page.getByText(/Recruiter|employer|hiring|Post/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('employerGuard allows /post after recruiter login', async ({ auth, page, client }) => {
    const rec = await registerUser({ intendedRole: 'employer' });
    await auth.login({ username: rec.username, password: rec.password });
    await page.goto(pathsFor(client).post);
    await expect(
      page.getByText(/Compose|Review|Preview|Job title|Post|Recruiter desk/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('recruiter can open My jobs after API-published listing', async ({
    auth,
    page,
    client,
  }) => {
    const rec = await registerUser({ intendedRole: 'employer' });
    const job = await createPublishedJob(rec);
    await auth.login({ username: rec.username, password: rec.password });
    await auth.expectSignedIn();
    await page.goto(pathsFor(client).myJobs);
    await expect(
      page
        .getByText(new RegExp(job.title.slice(0, 8), 'i'))
        .or(page.getByText(/My jobs|Posted|analytics|Views|Open Recruiter/i))
        .first(),
    ).toBeVisible({ timeout: 25_000 });
  });

  test('recruiter analytics board route loads', async ({ auth, page, client }) => {
    const rec = await registerUser({ intendedRole: 'employer' });
    const job = await createPublishedJob(rec);
    await auth.login({ username: rec.username, password: rec.password });
    await auth.expectSignedIn();
    await page.goto(pathsFor(client).myJob(job.id));
    await expect(
      page
        .getByText(/Analytics|Views|Applied|Contacted|KPI|funnel|Overview|My jobs|posted/i)
        .or(page.getByText(new RegExp(job.title.slice(0, 8), 'i')))
        .first(),
    ).toBeVisible({ timeout: 25_000 });
  });

  test('UI post compose reaches Preview panel', async ({ auth, postJob, page }) => {
    const rec = await registerUser({ intendedRole: 'employer' });
    await auth.login({ username: rec.username, password: rec.password });
    await postJob.goto();
    await postJob.fillCompose({
      title: `UI Post ${Date.now().toString(36)}`,
      employerName: 'Playwright Hiring',
      city: 'Coimbatore',
      salary: '20000-30000 / month',
      phone: '9876512345',
    });
    await postJob.goToPreview();
    await expect(page.getByText(/Preview|Publish|Post|Review/i).first()).toBeVisible();
  });
});
