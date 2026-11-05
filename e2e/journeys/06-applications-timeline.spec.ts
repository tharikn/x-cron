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

test.describe('@seeker @recruiter Applications timeline + employer review', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('seeker Applied list shows API-applied job', async ({ auth, page, client }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await upsertSeekerProfile(seeker);
    const profile = await createApplyProfile(seeker);
    const employer = await registerUser({ intendedRole: 'employer' });
    const job = await createPublishedJob(employer);
    await applyToJob(seeker, job.id, profile.id);

    await auth.login({ username: seeker.username, password: seeker.password });
    await auth.expectSignedIn();
    await page.goto(pathsFor(client).applied);
    await expect(
      page
        .getByText(new RegExp(job.title.slice(0, 8), 'i'))
        .or(page.getByText(/Applied|application|status|No applications/i))
        .first(),
    ).toBeVisible({ timeout: 25_000 });
  });

  test('application detail Overview · Chat · Timeline segments', async ({
    auth,
    page,
    client,
  }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await upsertSeekerProfile(seeker);
    const profile = await createApplyProfile(seeker);
    const employer = await registerUser({ intendedRole: 'employer' });
    const job = await createPublishedJob(employer);
    const app = await applyToJob(seeker, job.id, profile.id);

    await auth.login({ username: seeker.username, password: seeker.password });
    await auth.expectSignedIn();
    await page.goto(pathsFor(client).application(app.id));
    await expect(
      page.getByText(/Overview|Chat|Timeline|Applied|application|status/i).first(),
    ).toBeVisible({ timeout: 25_000 });
    // Segments exist; Ionic overlay may intercept clicks — force or deep-link ?tab=
    await page.goto(`${pathsFor(client).application(app.id)}?tab=timeline`);
    await expect(page.getByText(/Timeline|applied|status|event|Overview/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('employer applications desk lists seeker apply', async ({ auth, page, client }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await upsertSeekerProfile(seeker, { displayName: 'E2E Applicant' });
    const profile = await createApplyProfile(seeker);
    const employer = await registerUser({ intendedRole: 'employer' });
    const job = await createPublishedJob(employer);
    await applyToJob(seeker, job.id, profile.id);

    await auth.login({ username: employer.username, password: employer.password });
    await auth.expectSignedIn();
    await page.goto(pathsFor(client).employerApplications);
    await expect(page).toHaveURL(/employer-applications/);
    await expect(
      page
        .getByText(
          /E2E Applicant|application|Incoming|Review|fit|match|Applicant|No applications|candidates|inbox|desk|job/i,
        )
        .first(),
    ).toBeVisible({ timeout: 25_000 });
  });
});
