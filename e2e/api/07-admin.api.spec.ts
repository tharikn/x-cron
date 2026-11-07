import { expect, test } from '@playwright/test';
import { type AuthSession, adminLogin, healthCheck, request } from '../helpers/api-client';

/**
 * Admin-only API surfaces. Admin login is @SensitiveThrottle (1/hour on default
 * config) — the suite logs in once and skips when throttled (see e2e README).
 */
test.describe('@api @admin Admin APIs', () => {
  test.describe.configure({ mode: 'serial' });

  let admin: AuthSession | null = null;
  let skipReason = 'admin login unavailable';

  test.beforeAll(async () => {
    if (!(await healthCheck())) {
      skipReason = 'API not reachable';
      return;
    }
    try {
      admin = await adminLogin();
    } catch (err) {
      skipReason = String(err);
    }
  });

  const as = () => ({ token: admin!.token, tabId: admin!.tabId });

  test('tracking summary + user list expose engagement metrics', async () => {
    test.skip(!admin, skipReason);
    const summary = await request<Record<string, unknown>>('GET', '/admin/tracking/summary', as());
    expect(summary.data).toEqual(
      expect.objectContaining({
        usersCreated: expect.any(Number),
        accessorsTotal: expect.any(Number),
        totalHours: expect.any(Number),
        engagement: expect.objectContaining({ searchPct: expect.any(Number) }),
      }),
    );

    const users = await request<{ items: unknown[]; total: number; limit: number }>(
      'GET',
      '/admin/tracking/users?limit=5',
      as(),
    );
    expect(users.data.limit).toBe(5);
    expect(users.data.items.length).toBeLessThanOrEqual(5);
  });

  test('trust desk queues, audit and config are readable', async () => {
    test.skip(!admin, skipReason);
    for (const path of ['/moderation/dashboard', '/moderation/cases', '/moderation/audit', '/admin/moderation/config']) {
      const res = await request('GET', path, as());
      expect(res.status, path).toBe(200);
    }
    const search = await request('GET', '/moderation/search?q=e2', as());
    expect(search.status).toBe(200);
  });

  test('ops logs: notification dispatches + Job Fare workflow', async () => {
    test.skip(!admin, skipReason);
    const dispatches = await request<{ items: unknown[]; total: number }>(
      'GET',
      '/admin/notification-dispatches?limit=5',
      as(),
    );
    expect(Array.isArray(dispatches.data.items)).toBe(true);

    const workflow = await request('GET', '/channels/workflow', as());
    expect(workflow.status).toBe(200);
  });
});
