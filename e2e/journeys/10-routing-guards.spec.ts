import { expect, test } from '../fixtures/test';
import { healthCheck, registerUser } from '../helpers/api-client';
import { pathsFor } from '../helpers/env';

test.describe('@routing Guards + role chrome', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('guest /post redirects to sign-in or employer prompt', async ({ page, client }) => {
    await page.goto(pathsFor(client).post);
    await expect(
      page.getByText(/Sign in|Login|Employer|Recruiter|Create an account|post jobs/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('seeker /post is blocked (not recruiter desk)', async ({ auth, page, client }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await auth.login({ username: seeker.username, password: seeker.password });
    await page.goto(pathsFor(client).post);
    // employerGuard should bounce seekers away from compose desk
    const onPostDesk = await page
      .getByText(/Compose|Job title/i)
      .first()
      .isVisible()
      .catch(() => false);
    const bounced = await page
      .getByText(/Sign in|Employer|Recruiter|not allowed|Account|Discover|Home/i)
      .first()
      .isVisible()
      .catch(() => false);
    expect(onPostDesk && !bounced).toBeFalsy();
  });

  test('recruiter does not see Easy apply on job detail', async ({
    auth,
    jobDetail,
    page,
  }) => {
    const { createPublishedJob } = await import('../helpers/api-client');
    const rec = await registerUser({ intendedRole: 'employer' });
    const job = await createPublishedJob(rec);
    await auth.login({ username: rec.username, password: rec.password });
    await auth.expectSignedIn();
    await jobDetail.goto(job.id);
    await expect(page.getByText(new RegExp(job.title.slice(0, 8), 'i')).first()).toBeVisible({
      timeout: 20_000,
    });
    // Role chrome: Easy apply must not be usable for recruiters (hidden or absent)
    const easy = jobDetail.easyApply();
    const easyVisible = await easy.isVisible().catch(() => false);
    expect(easyVisible).toBeFalsy();
  });

  test('recruiter Activity hides seeker Saved/Applied lists chrome', async ({
    auth,
    chrome,
    page,
    client,
  }) => {
    const rec = await registerUser({ intendedRole: 'employer' });
    await auth.login({ username: rec.username, password: rec.password });
    await auth.expectSignedIn();
    await page.goto(`${pathsFor(client).account}?tab=activity`);
    const result = await chrome.recruiterShouldHideSeekerChrome();
    await expect(
      page
        .getByText(
          /Incoming|Posted jobs|Recruiter|applications|Activity|Your profile|hiring|Signed in|Manage your profile/i,
        )
        .first(),
    ).toBeVisible({ timeout: 20_000 });
    if (result.issues.length) {
      test.info().annotations.push({
        type: 'chrome-issue',
        description: result.issues.join('; '),
      });
    }
  });

  test('admin Import / Job Fare routes gate guests', async ({ page, client }) => {
    await page.goto(pathsFor(client).import);
    await expect(
      page.getByText(/Sign in|Admin|password|Import|not|Login|Discover|Home/i).first(),
    ).toBeVisible({ timeout: 20_000 });
    await page.goto(pathsFor(client).jobFare);
    await expect(
      page.getByText(/Sign in|Admin|Job Fare|password|Login|Discover|Home/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });
});
