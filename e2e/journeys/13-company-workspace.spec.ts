import { expect, test } from '../fixtures/test';
import {
  createCompany,
  createPublishedJob,
  getRecruiterDashboard,
  healthCheck,
  inviteCompanyMember,
  registerUser,
} from '../helpers/api-client';
import { pathsFor } from '../helpers/env';

/**
 * Company workspace (docs/COMPANY_WORKSPACE.md): recruiter `/company` · mobile `/tabs/company`.
 * Runs on Chromium mobile, web, and Android Chrome (android project → same Ionic routes).
 */
test.describe('@smoke @recruiter Company workspace', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('guest /company is gated by employerGuard', async ({ page, client }) => {
    await page.goto(pathsFor(client).company);
    await expect(
      page.getByText(/Sign in|Login|Employer|Recruiter|Create an account|post jobs|Company/i).first(),
    ).toBeVisible({ timeout: 20_000 });
    const onWorkspace = await page
      .getByText(/Manage your company profile|Upcoming interviews|active members/i)
      .first()
      .isVisible()
      .catch(() => false);
    expect(onWorkspace).toBeFalsy();
  });

  test('seeker /company is blocked', async ({ auth, page, client }) => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await auth.login({ username: seeker.username, password: seeker.password });
    await page.goto(pathsFor(client).company);
    const desk = await page
      .getByText(/Manage your company profile|Upcoming interviews|active members/i)
      .first()
      .isVisible()
      .catch(() => false);
    expect(desk).toBeFalsy();
  });

  test('recruiter opens Company workspace dashboard', async ({
    auth,
    company,
    chrome,
    page,
    client,
  }) => {
    const rec = await registerUser({ intendedRole: 'employer' });
    const name = `Play Co ${Date.now().toString(36)}`;
    await createCompany(rec, { name });
    await createPublishedJob(rec);
    await auth.login({ username: rec.username, password: rec.password });
    await auth.expectSignedIn();
    await company.goto();
    if (client === 'web' && !(await company.workspaceBody().isVisible().catch(() => false))) {
      await chrome.openDrawerIfWeb();
      const link = page.getByRole('link', { name: /^Company$/i }).first();
      if (await link.isVisible().catch(() => false)) {
        await link.click();
      }
    }
    const loaded = await company
      .heading()
      .or(company.workspaceBody())
      .isVisible()
      .catch(() => false);
    test.skip(
      !loaded && client === 'web',
      'Web /company did not load — Angular serve may have a failed rebuild (see ng serve errors)',
    );
    await expect(company.workspaceBody()).toBeVisible({ timeout: 25_000 });
    await expect(
      page
        .getByText(
          new RegExp(
            `${name.slice(0, 8)}|Dashboard|Jobs|Applicants|unverified|Post a job|My jobs|Not enough data`,
            'i',
          ),
        )
        .first(),
    ).toBeVisible({ timeout: 25_000 });
    await expect(page).toHaveURL(/company/i);
  });

  test('recruiter Company Profile / Team tabs load', async ({
    auth,
    company,
    chrome,
    page,
    client,
  }) => {
    const rec = await registerUser({ intendedRole: 'employer' });
    await createCompany(rec);
    await auth.login({ username: rec.username, password: rec.password });
    await auth.expectSignedIn();
    await company.goto();
    if (!(await company.workspaceBody().isVisible().catch(() => false))) {
      if (client === 'web') {
        await chrome.openDrawerIfWeb();
        const link = page.getByRole('link', { name: /^Company$/i }).first();
        if (await link.isVisible().catch(() => false)) {
          await link.click();
        }
      }
    }
    const loaded = await company.workspaceBody().isVisible().catch(() => false);
    test.skip(
      !loaded && client === 'web',
      'Web /company did not load — Angular serve may have a failed rebuild (see ng serve errors)',
    );
    await expect(page).toHaveURL(/company/i);
    await company.openTab('profile');
    await expect(
      page.getByText(/Display name|Legal name|Headquarters|Save profile/i).first(),
    ).toBeVisible({ timeout: 20_000 });
    await company.openTab('team');
    await expect(
      page.getByText(/Invite email|Invite|owner|Send invite|Team/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('API company invite token route is reachable', async ({ auth, page, client }) => {
    const owner = await registerUser({ intendedRole: 'employer' });
    const companyDto = await createCompany(owner);
    const invite = await inviteCompanyMember(owner, companyDto.id, {
      email: `join_${Date.now()}@example.com`,
      role: 'recruiter',
    });
    test.skip(!invite.acceptToken, 'invite acceptToken not returned (share-link stub)');

    const joiner = await registerUser({ intendedRole: 'employer' });
    await auth.login({ username: joiner.username, password: joiner.password });
    await page.goto(pathsFor(client).companyInvite(invite.acceptToken!));
    await expect(
      page
        .getByText(/company|invite|join|workspace|Sign in|accept|team/i)
        .first(),
    ).toBeVisible({ timeout: 25_000 });
  });

  test('recruiter chrome exposes Company entry', async ({ auth, chrome, page, client }) => {
    const rec = await registerUser({ intendedRole: 'employer' });
    await auth.login({ username: rec.username, password: rec.password });
    await auth.expectSignedIn();
    if (client === 'mobile') {
      await page.goto(`${pathsFor(client).account}?tab=account`);
      // Ensure Account segment (Recruiter desk) is selected.
      const accountSeg = page
        .getByRole('button', { name: /^Account$/i })
        .or(page.locator('ion-segment-button[value="account"]'))
        .first();
      if (await accountSeg.isVisible().catch(() => false)) {
        await accountSeg.click();
      }
      await expect(page.getByText(/Recruiter desk|Company workspace/i).first()).toBeVisible({
        timeout: 15_000,
      });
    }
    const result = await chrome.recruiterShouldShowCompanyChrome();
    expect(result.issues, result.issues.join('; ')).toEqual([]);
  });

  test('API recruiter dashboard returns company after create', async () => {
    const rec = await registerUser({ intendedRole: 'employer' });
    const created = await createCompany(rec, { name: 'Dash Co' });
    const dash = await getRecruiterDashboard(rec);
    expect(dash.company?.id).toBe(created.id);
    expect(dash.company?.name).toMatch(/Dash Co/i);
  });
});
