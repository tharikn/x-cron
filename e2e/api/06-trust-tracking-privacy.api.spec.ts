import { expect, test } from '@playwright/test';
import {
  type AuthSession,
  type PublishedJob,
  createPublishedJob,
  healthCheck,
  loginUser,
  registerUser,
  request,
  upsertSeekerProfile,
} from '../helpers/api-client';

const as = (s: AuthSession) => ({ token: s.token, tabId: s.tabId });

/** docs/TRACKING.md — client events are public + validated; admin views are admin-only. */
test.describe('@api @tracking User tracking', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('@smoke guests and signed-in users can post events', async () => {
    const guest = await request<{ ok: boolean; id: string }>('POST', '/tracking/events', {
      body: { type: 'access', path: '/' },
    });
    expect(guest.data).toMatchObject({ ok: true, id: expect.any(String) });

    const seeker = await registerUser({ intendedRole: 'seeker' });
    for (const body of [
      { type: 'page_view', path: '/jobs' },
      { type: 'heartbeat', durationMs: 60_000 },
      { type: 'share', jobId: 'job-e2e' },
    ]) {
      const res = await request('POST', '/tracking/events', { ...as(seeker), body });
      expect(res.status, body.type).toBeLessThan(300);
    }
  });

  test('rejects unknown types and oversized heartbeats', async () => {
    const badType = await request<{ errors?: Record<string, string> }>('POST', '/tracking/events', {
      body: { type: 'keystroke' },
      expectOk: false,
    });
    expect(badType.status).toBe(400);
    expect(Object.keys(badType.data.errors ?? {})).toContain('type');

    const tooLong = await request('POST', '/tracking/events', {
      body: { type: 'heartbeat', durationMs: 16 * 60 * 1000 },
      expectOk: false,
    });
    expect(tooLong.status).toBe(400);
  });

  test('admin tracking views are 401 for guests', async () => {
    for (const path of ['/admin/tracking/summary', '/admin/tracking/users']) {
      const res = await request('GET', path, { expectOk: false });
      expect(res.status, path).toBe(401);
    }
  });
});

/** docs/ADMIN_TRUST_MODERATION.md — reports, appeals, staff-only queues. */
test.describe('@api @trust Trust + moderation (non-staff paths)', () => {
  test.describe.configure({ mode: 'serial' });

  let recruiter: AuthSession;
  let seeker: AuthSession;
  let job: PublishedJob;

  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
    recruiter = await registerUser({ intendedRole: 'employer' });
    seeker = await registerUser({ intendedRole: 'seeker' });
    job = await createPublishedJob(recruiter);
  });

  test('guest + signed-in reports are accepted; bad categories rejected', async () => {
    const legacy = await request('POST', `/jobs/${job.id}/report`, {
      body: { category: 'scam', details: 'Asked for a registration fee.' },
    });
    expect(legacy.status).toBeLessThan(300);

    const guest = await request('POST', '/reports/public', {
      body: { targetType: 'job', targetId: job.id, category: 'misleading', details: 'Salary not real.' },
    });
    expect(guest.status).toBeLessThan(300);

    const signedIn = await request('POST', '/reports', {
      ...as(seeker),
      body: { targetType: 'job', targetId: job.id, category: 'spam', details: 'Duplicate post.' },
    });
    expect(signedIn.status).toBeLessThan(300);
    expect(JSON.stringify(signedIn.data)).not.toContain(seeker.user.id);

    const bad = await request('POST', '/reports/public', {
      body: { targetType: 'job', targetId: job.id, category: 'not-a-category' },
      expectOk: false,
    });
    expect(bad.status).toBe(400);
  });

  test('appeals are accepted for signed-in users only', async () => {
    const ok = await request('POST', '/moderation/appeals', {
      ...as(recruiter),
      body: {
        targetType: 'job',
        targetId: job.id,
        reason: 'This job is genuine; please review the report again.',
      },
    });
    expect(ok.status).toBeLessThan(300);

    const anon = await request('POST', '/moderation/appeals', {
      body: { targetType: 'job', targetId: job.id, reason: 'Anonymous appeal attempt.' },
      expectOk: false,
    });
    expect(anon.status).toBe(401);
  });

  test('moderation queues + config are staff-only', async () => {
    for (const path of ['/moderation/dashboard', '/moderation/cases', '/moderation/audit', '/admin/moderation/config']) {
      const res = await request('GET', path, { ...as(seeker), expectOk: false });
      expect(res.status, path).toBe(403);
    }
  });
});

/** docs/SECURITY_PRIVACY.md + notifications categories. */
test.describe('@api @privacy Notifications prefs, export, delete', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('notification category + channel preferences round-trip', async () => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    const before = await request<Record<string, unknown>>('GET', '/notifications/preferences', as(seeker));
    expect(before.data).toEqual(
      expect.objectContaining({
        jobAlertsEnabled: expect.any(Boolean),
        applicationUpdatesEnabled: expect.any(Boolean),
        recruiterMessagesEnabled: expect.any(Boolean),
      }),
    );

    await request('PUT', '/notifications/preferences', {
      ...as(seeker),
      body: { recruiterMessagesEnabled: false, productAnnouncementsEnabled: true, quietHoursStart: 22, quietHoursEnd: 7 },
    });
    const after = await request<Record<string, unknown>>('GET', '/notifications/preferences', as(seeker));
    expect(after.data).toMatchObject({
      recruiterMessagesEnabled: false,
      productAnnouncementsEnabled: true,
      quietHoursStart: 22,
      quietHoursEnd: 7,
    });

    const invalid = await request('PUT', '/notifications/preferences', {
      ...as(seeker),
      body: { quietHoursStart: 25 },
      expectOk: false,
    });
    expect(invalid.status).toBe(400);

    const inbox = await request('GET', '/notifications', as(seeker));
    expect(inbox.status).toBe(200);
  });

  test('@smoke data export is a no-store attachment without secrets', async () => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    await upsertSeekerProfile(seeker, { displayName: 'Export Me' });
    const res = await request<Record<string, unknown>>('GET', '/me/export', as(seeker));
    expect(res.headers.get('cache-control')).toContain('no-store');
    expect(res.headers.get('content-disposition')).toMatch(/attachment; filename="xcron-data-export-/);
    expect(res.data.exportedAt).toBeTruthy();
    const text = JSON.stringify(res.data);
    expect(text).toContain('Export Me');
    expect(text).not.toMatch(/passwordHash|passwordSalt|refreshToken/);
  });

  test('account delete wipes the user (SensitiveThrottle tolerated)', async () => {
    const doomed = await registerUser({ intendedRole: 'seeker' });
    const res = await request('DELETE', '/me', { ...as(doomed), expectOk: false, retries429: 0 });
    test.skip(res.status === 429, 'DELETE /me is SensitiveThrottle (1/hour) on this API');
    expect(res.status).toBeLessThan(300);

    const me = await request('GET', '/auth/me', { ...as(doomed), expectOk: false });
    expect(me.status).toBe(401);
    await expect(loginUser({ username: doomed.username, password: doomed.password })).rejects.toThrow(
      /401/,
    );
  });
});
