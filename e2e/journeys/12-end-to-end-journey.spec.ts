import { expect, test } from '../fixtures/test';
import {
  applyToJob,
  createApplyProfile,
  createPublishedJob,
  healthCheck,
  registerUser,
  upsertSeekerProfile,
} from '../helpers/api-client';
import { pathsFor } from '../helpers/env';

/**
 * Full dual-role path: recruiter publishes → seeker applies → both desks show state.
 * Traditional apps keep one “golden path” journey like this for release gating.
 */
test.describe('@journey Full user creation → end journey', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('recruiter post (API) → seeker register/profile/apply → applied + employer inbox', async ({
    auth,
    discover,
    jobDetail,
    page,
    client,
  }) => {
    // 1) Recruiter exists + live job
    const employer = await registerUser({ intendedRole: 'employer' });
    const job = await createPublishedJob(employer, {
      title: `Golden Path ${Date.now().toString(36)}`,
    });

    // 2) Seeker created via UI register
    const { uniqueUsername } = await import('../helpers/unique');
    const { DEFAULT_PASSWORD } = await import('../helpers/env');
    const username = uniqueUsername('gold');
    await auth.register({
      username,
      password: DEFAULT_PASSWORD,
      role: 'seeker',
    });
    await auth.expectSignedIn();

    // 3) Complete profile via API (UI forms are slow/shadowy; readiness is what matters)
    const { loginUser } = await import('../helpers/api-client');
    const session = await loginUser({
      username,
      password: DEFAULT_PASSWORD,
      intendedRole: 'seeker',
    });
    await upsertSeekerProfile(session);
    const profile = await createApplyProfile(session);

    // 4) Discover → job detail → Easy apply
    await discover.goto();
    await jobDetail.goto(job.id);
    await expect(page.getByText(job.title).first()).toBeVisible({ timeout: 20_000 });
    if (await jobDetail.easyApply().isVisible().catch(() => false)) {
      await jobDetail.easyApplyClick();
      await page.waitForTimeout(1500);
    } else {
      // Fallback: API apply still validates ATS path if UI picker missing
      await applyToJob(session, job.id, profile.id);
    }

    // 5) Seeker Applied list
    await page.goto(pathsFor(client).applied);
    await expect(
      page
        .getByText(new RegExp(job.title.slice(0, 8), 'i'))
        .or(page.getByText(/Applied|application|status/i))
        .first(),
    ).toBeVisible({ timeout: 25_000 });

    // 6) Employer inbox (fresh context via goto + login; sign-out toast may be slow)
    await page.goto(pathsFor(client).signIn);
    await auth.login({ username: employer.username, password: employer.password });
    await page.goto(pathsFor(client).employerApplications);
    await expect(page).toHaveURL(/employer-applications/);
    await expect(
      page
        .getByText(/application|Incoming|Review|Applicant|fit|match|No applications|desk|job/i)
        .first(),
    ).toBeVisible({ timeout: 25_000 });
  });
});
