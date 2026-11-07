import { expect, test } from '@playwright/test';
import {
  healthCheck,
  loginUser,
  newTabId,
  registerUser,
  request,
} from '../helpers/api-client';
import { DEFAULT_PASSWORD } from '../helpers/env';
import { uniqueUsername } from '../helpers/unique';

type Me = { user: { id: string; roles: string[]; username?: string } };
type SessionRow = { id: string; current?: boolean } & Record<string, unknown>;

/** docs/AUTHENTICATION.md — sessions, refresh rotation/reuse, RBAC, CSRF. */
test.describe('@api @auth Auth + sessions', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
  });

  test('@smoke seeker + recruiter register and /auth/me reflects intended role', async () => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    const me = await request<Me>('GET', '/auth/me', { token: seeker.token, tabId: seeker.tabId });
    expect(me.data.user.roles).toContain('seeker');
    expect(me.data.user.username).toBe(seeker.username);
    expect(JSON.stringify(me.data)).not.toMatch(/passwordHash|passwordSalt/);

    const rec = await registerUser({ intendedRole: 'employer' });
    const recMe = await request<Me>('GET', '/auth/me', { token: rec.token, tabId: rec.tabId });
    expect(recMe.data.user.roles).toContain('employer');
  });

  test('rejects wrong password and duplicate usernames', async () => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    const bad = await request('POST', '/auth/login', {
      body: { username: seeker.username, password: 'WrongPass9!' },
      expectOk: false,
    });
    expect(bad.status).toBe(401);

    const dup = await request('POST', '/auth/register', {
      body: {
        username: seeker.username,
        password: DEFAULT_PASSWORD,
        confirmPassword: DEFAULT_PASSWORD,
      },
      expectOk: false,
    });
    expect([400, 409]).toContain(dup.status);
  });

  test('refresh rotates tokens; replaying a retired refresh revokes the whole family', async () => {
    const s = await registerUser({ intendedRole: 'seeker' });
    expect(s.refreshToken).toBeTruthy();

    const rotated = await request<{ token: string; refreshToken: string }>('POST', '/auth/refresh', {
      body: { refreshToken: s.refreshToken },
      tabId: s.tabId,
    });
    expect(rotated.data.token).not.toBe(s.token);
    expect(rotated.data.refreshToken).not.toBe(s.refreshToken);

    const replay = await request<{ message?: string }>('POST', '/auth/refresh', {
      body: { refreshToken: s.refreshToken },
      tabId: s.tabId,
      expectOk: false,
    });
    expect(replay.status).toBe(401);
    expect(replay.data.message).toBe('refresh_token_reuse');

    const sibling = await request('POST', '/auth/refresh', {
      body: { refreshToken: rotated.data.refreshToken },
      tabId: s.tabId,
      expectOk: false,
    });
    expect(sibling.status).toBe(401);
    const me = await request('GET', '/auth/me', {
      token: rotated.data.token,
      tabId: s.tabId,
      expectOk: false,
    });
    expect(me.status).toBe(401);
  });

  test('lists sessions without secrets and revoking the current one signs out', async () => {
    const s = await registerUser({ intendedRole: 'seeker' });
    const { data } = await request<{ sessions: SessionRow[] }>('GET', '/auth/sessions', {
      token: s.token,
      tabId: s.tabId,
    });
    expect(data.sessions.length).toBeGreaterThanOrEqual(1);
    const current = data.sessions.find((row) => row.current);
    expect(current).toBeTruthy();
    for (const row of data.sessions) {
      expect(row).not.toHaveProperty('token');
      expect(row).not.toHaveProperty('refreshToken');
    }

    await request('DELETE', `/auth/sessions/${current!.id}`, { token: s.token, tabId: s.tabId });
    const after = await request('GET', '/auth/me', { token: s.token, tabId: s.tabId, expectOk: false });
    expect(after.status).toBe(401);
  });

  test('logout-all kills access + refresh', async () => {
    const s = await registerUser({ intendedRole: 'seeker' });
    await request('POST', '/auth/logout-all', { token: s.token, tabId: s.tabId, body: {} });
    const me = await request('GET', '/auth/me', { token: s.token, tabId: s.tabId, expectOk: false });
    expect(me.status).toBe(401);
    const refresh = await request('POST', '/auth/refresh', {
      body: { refreshToken: s.refreshToken },
      tabId: s.tabId,
      expectOk: false,
    });
    expect(refresh.status).toBe(401);

    // Can sign in again afterwards.
    const again = await loginUser({ username: s.username, password: s.password });
    expect(again.token).toBeTruthy();
  });

  test('cookie-only mutations require the CSRF double-submit header', async () => {
    const username = uniqueUsername('csrf');
    const tabId = newTabId();
    const reg = await request('POST', '/auth/register', {
      tabId,
      body: { username, password: DEFAULT_PASSWORD, confirmPassword: DEFAULT_PASSWORD },
    });
    const cookies = reg.headers.getSetCookie().map((c) => c.split(';')[0]);
    const cookieHeader = cookies.join('; ');
    const csrf = cookies.find((c) => c.startsWith('xcron_csrf='))?.split('=')[1];
    expect(cookieHeader).toContain('xcron_access=');
    expect(csrf).toBeTruthy();

    const blocked = await request('PUT', '/notifications/preferences', {
      tabId,
      headers: { Cookie: cookieHeader },
      body: { inAppEnabled: true },
      expectOk: false,
    });
    expect(blocked.status).toBe(403);

    const allowed = await request('PUT', '/notifications/preferences', {
      tabId,
      headers: { Cookie: cookieHeader, 'X-CSRF-Token': decodeURIComponent(csrf!) },
      body: { inAppEnabled: true },
      expectOk: false,
    });
    expect(allowed.status).toBeLessThan(300);
  });

  test('RBAC: 401 without a session, 403 for the wrong role', async () => {
    const anon = await request('GET', '/me/profile', { expectOk: false });
    expect(anon.status).toBe(401);

    const seeker = await registerUser({ intendedRole: 'seeker' });
    const auth = { token: seeker.token, tabId: seeker.tabId, expectOk: false } as const;
    for (const [method, path] of [
      ['GET', '/employers/jobs'],
      ['GET', '/recruiter/dashboard'],
      ['GET', '/admin/tracking/summary'],
      ['GET', '/moderation/dashboard'],
      ['GET', '/channels/workflow'],
      ['GET', '/admin/notification-dispatches'],
    ] as const) {
      const res = await request(method, path, auth);
      expect(res.status, `${method} ${path}`).toBe(403);
    }
  });
});
