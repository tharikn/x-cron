import { AuthStore } from './auth.store';
import type { PrismaService } from '../prisma/prisma.service';

describe('AuthStore session security', () => {
  let store: AuthStore;
  let prevAuthStore: string | undefined;
  let prevJobsStore: string | undefined;
  let prevSingleSession: string | undefined;

  beforeEach(() => {
    prevAuthStore = process.env.AUTH_STORE;
    prevJobsStore = process.env.JOBS_STORE;
    prevSingleSession = process.env.AUTH_SINGLE_SESSION;
    process.env.AUTH_STORE = 'memory';
    process.env.JOBS_STORE = 'memory';
    process.env.AUTH_SINGLE_SESSION = '0';
    store = new AuthStore({} as PrismaService);
  });

  afterEach(() => {
    if (prevAuthStore === undefined) delete process.env.AUTH_STORE;
    else process.env.AUTH_STORE = prevAuthStore;
    if (prevJobsStore === undefined) delete process.env.JOBS_STORE;
    else process.env.JOBS_STORE = prevJobsStore;
    if (prevSingleSession === undefined) delete process.env.AUTH_SINGLE_SESSION;
    else process.env.AUTH_SINGLE_SESSION = prevSingleSession;
  });

  function register(username = `u_${Date.now().toString(36)}`) {
    return store.registerWithPassword({
      username,
      password: 'password123',
      intendedRole: 'seeker',
    });
  }

  it('rotates refresh and rejects reuse by revoking the token family', () => {
    const first = register();
    const rotated = store.refreshSession(first.refreshToken);

    expect(rotated.token).not.toBe(first.token);
    expect(rotated.refreshToken).not.toBe(first.refreshToken);
    expect(store.getUserByToken(rotated.token)?.id).toBe(first.user.id);

    expect(() => store.refreshSession(first.refreshToken)).toThrow(
      'refresh_token_reuse',
    );
    // Family revoked — rotated refresh is also dead.
    expect(() => store.refreshSession(rotated.refreshToken)).toThrow(
      'invalid_refresh_token',
    );
    expect(store.getUserByToken(rotated.token)).toBeUndefined();
  });

  it('blocks disabled users on access token and refresh', () => {
    const session = register(`dis_${Date.now().toString(36)}`);
    store.setUserStatus(session.user.id, 'disabled');

    expect(store.getUserByToken(session.token)).toBeUndefined();
    expect(() => store.refreshSession(session.refreshToken)).toThrow(
      'invalid_refresh_token',
    );
    expect(() =>
      store.loginWithPassword({
        username: session.user.username!,
        password: 'password123',
      }),
    ).toThrow('invalid_credentials');
  });

  it('lists sessions without secrets and supports revoke + logout-all', () => {
    const a = register(`sess_a_${Date.now().toString(36)}`);
    const b = store.refreshSession(a.refreshToken, {
      revokeOtherSessions: false,
    });
    // Refresh retires `a` and issues one live session (`b`).
    const listed = store.listSessionsForUser(a.user.id, b.token);
    expect(listed).toHaveLength(1);
    expect(listed[0].current).toBe(true);
    expect(listed[0]).not.toHaveProperty('token');
    expect(listed[0]).not.toHaveProperty('refreshToken');

    // Second independent login (single-session off) → two live sessions.
    const other = store.loginWithPassword({
      username: a.user.username!,
      password: 'password123',
    });
    const two = store.listSessionsForUser(a.user.id, other.token);
    expect(two.length).toBeGreaterThanOrEqual(2);

    const otherSession = two.find((s) => !s.current) ?? two[0];
    expect(store.revokeSessionForUser(a.user.id, otherSession.id)).toBe(true);
    expect(
      store.listSessionsForUser(a.user.id).some((s) => s.id === otherSession.id),
    ).toBe(false);

    const revoked = store.revokeAllSessionsForUser(a.user.id);
    expect(revoked).toBeGreaterThanOrEqual(1);
    expect(store.listSessionsForUser(a.user.id)).toHaveLength(0);
    expect(store.getUserByToken(other.token)).toBeUndefined();
  });

  it('does not treat unknown refresh as family reuse', () => {
    register();
    expect(() => store.refreshSession('00000000-0000-4000-8000-000000000000')).toThrow(
      'invalid_refresh_token',
    );
  });
});
