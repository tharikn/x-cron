import { expect, test } from '../fixtures/test';
import { healthCheck, searchJobs } from '../helpers/api-client';

test.describe('@smoke @guest Guest discover / home', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API /v1/health not reachable on :3000');
  });

  test('shows brand and guest can open home', async ({ discover }) => {
    await discover.goto();
    await expect(discover.brand()).toBeVisible();
  });

  test('job list loads from API or shows empty state', async ({ page, discover }) => {
    await discover.goto();
    const { total } = await searchJobs();
    if (total > 0) {
      await expect
        .poll(async () => discover.jobCards().count(), { timeout: 20_000 })
        .toBeGreaterThan(0);
    } else {
      await expect(
        page.getByText(/No jobs|Open roles|nothing|empty|Try/i).first(),
      ).toBeVisible({ timeout: 20_000 });
    }
  });

  test('search input accepts query', async ({ discover }) => {
    await discover.goto();
    await discover.search('developer');
    await expect(discover.brand()).toBeVisible();
  });
});
