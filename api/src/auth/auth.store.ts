import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomBytes, randomInt, randomUUID, scryptSync, timingSafeEqual } from 'crypto';
import {
  AuthTokens,
  AuthUser,
  EmployerProfile,
  OtpChallenge,
  SessionRecord,
  UserRole,
} from './auth.types';

export interface SignInEvent {
  userId: string;
  at: string;
}

@Injectable()
export class AuthStore implements OnModuleInit {
  private readonly users = new Map<string, AuthUser>();
  private readonly sessions = new Map<string, SessionRecord>();
  /** refreshToken → accessToken */
  private readonly refreshIndex = new Map<string, string>();
  private readonly otps = new Map<string, OtpChallenge>();
  private readonly employers = new Map<string, EmployerProfile>();
  private readonly identityIndex = new Map<string, string>(); // phone:x / email:x -> userId
  private readonly signInEvents: SignInEvent[] = [];
  private readonly adminLoginAttempts = new Map<
    string,
    { count: number; lockedUntil?: number }
  >();
  private passwordSalt: Buffer | null = null;
  private passwordHash: Buffer | null = null;
  private superAdminEmail: string | null = null;
  /** Access token TTL (Bearer). Env AUTH_ACCESS_TTL_MINUTES, default 15. */
  private accessTtlMs = this.resolveAccessTtlMs();
  /** Refresh token TTL — synced from SiteConfig `auth` (defaults match seed). */
  private sessionTtlMs = 30 * 24 * 60 * 60 * 1000;
  private otpTtlMs = 10 * 60 * 1000;

  onModuleInit() {
    const email = this.resolveSuperAdminEmail();
    const password = process.env.SUPER_ADMIN_PASSWORD?.trim();
    this.superAdminEmail = email;

    if (password) {
      this.passwordSalt = randomBytes(16);
      this.passwordHash = scryptSync(password, this.passwordSalt, 64);
    } else if (this.isProd()) {
      // eslint-disable-next-line no-console
      console.warn(
        '[auth] SUPER_ADMIN_PASSWORD is not set — password admin login is disabled in production.',
      );
    }

    const admin = this.upsertUser({
      email,
      displayName: 'X Cron Super Admin',
      roles: ['admin', 'employer', 'seeker'],
    });
    this.createEmployer(admin.id, 'X Cron Moderation Desk');
  }

  signInSuperAdmin(
    email: string,
    password: string,
  ): { user: AuthUser } & AuthTokens {
    const normalized = this.normalizeDestination('email', email);
    this.assertAdminLoginAllowed(normalized);

    if (!this.superAdminEmail || !this.passwordHash || !this.passwordSalt) {
      this.recordAdminLoginFailure(normalized);
      throw new Error('admin_login_disabled');
    }
    if (normalized !== this.superAdminEmail) {
      this.recordAdminLoginFailure(normalized);
      throw new Error('invalid_credentials');
    }

    const candidate = scryptSync(password, this.passwordSalt, 64);
    if (!timingSafeEqual(candidate, this.passwordHash)) {
      this.recordAdminLoginFailure(normalized);
      throw new Error('invalid_credentials');
    }

    this.adminLoginAttempts.delete(normalized);
    const key = `email:${normalized}`;
    let userId = this.identityIndex.get(key);
    let user = userId ? this.users.get(userId) : undefined;
    if (!user) {
      user = this.upsertUser({
        email: normalized,
        displayName: 'X Cron Super Admin',
        roles: ['admin', 'employer', 'seeker'],
      });
    } else {
      const roles = new Set<UserRole>(user.roles);
      roles.add('admin');
      roles.add('employer');
      roles.add('seeker');
      user.roles = [...roles];
      this.users.set(user.id, user);
    }
    if (!this.getEmployerByOwner(user.id)) {
      this.createEmployer(user.id, 'X Cron Moderation Desk');
    }
    const tokens = this.createSession(user.id);
    return { user, ...tokens };
  }

  startOtp(input: {
    channel: 'phone' | 'email';
    destination: string;
    intendedRole: UserRole;
  }): { challengeId: string; expiresAt: string; devCode?: string } {
    const destination = this.normalizeDestination(input.channel, input.destination);
    const code = this.isDev() ? '123456' : String(randomInt(100000, 999999));
    const challenge: OtpChallenge = {
      id: randomUUID(),
      channel: input.channel,
      destination,
      code,
      intendedRole: input.intendedRole === 'admin' ? 'seeker' : input.intendedRole,
      expiresAt: new Date(Date.now() + this.otpTtlMs).toISOString(),
      attempts: 0,
    };
    this.otps.set(challenge.id, challenge);
    return {
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt,
      ...(this.isDev() ? { devCode: code } : {}),
    };
  }

  signInWithGoogle(input: {
    email: string;
    displayName?: string;
  }): { user: AuthUser } & AuthTokens {
    const email = this.normalizeDestination('email', input.email);
    if (!email.includes('@')) {
      throw new Error('invalid_email');
    }
    const key = `email:${email}`;
    let userId = this.identityIndex.get(key);
    let user = userId ? this.users.get(userId) : undefined;
    const roles = this.resolveRoles(email, 'seeker');

    if (!user) {
      user = this.upsertUser({
        email,
        displayName: input.displayName || email.split('@')[0],
        roles,
      });
    } else {
      // Google never grants admin — password login only for Dashboard / History.
      user.roles = roles;
      if (input.displayName) user.displayName = input.displayName;
      this.users.set(user.id, user);
    }

    const tokens = this.createSession(user.id);
    return { user, ...tokens };
  }

  verifyOtp(
    challengeId: string,
    code: string,
  ): { user: AuthUser } & AuthTokens {
    const challenge = this.otps.get(challengeId);
    if (!challenge) {
      throw new Error('invalid_challenge');
    }
    if (new Date(challenge.expiresAt).getTime() < Date.now()) {
      this.otps.delete(challengeId);
      throw new Error('expired_challenge');
    }
    challenge.attempts += 1;
    if (challenge.attempts > 5) {
      this.otps.delete(challengeId);
      throw new Error('too_many_attempts');
    }
    if (challenge.code !== code.trim()) {
      throw new Error('invalid_code');
    }

    this.otps.delete(challengeId);
    const key = `${challenge.channel}:${challenge.destination}`;
    let userId = this.identityIndex.get(key);
    let user = userId ? this.users.get(userId) : undefined;

    if (!user) {
      user = this.upsertUser({
        phone: challenge.channel === 'phone' ? challenge.destination : undefined,
        email: challenge.channel === 'email' ? challenge.destination : undefined,
        roles: this.resolveRoles(challenge.destination, challenge.intendedRole),
      });
    } else {
      // OTP never grants admin — password login only for Dashboard / History.
      user.roles = this.resolveRoles(challenge.destination, challenge.intendedRole);
      this.users.set(user.id, user);
    }

    const tokens = this.createSession(user.id);
    return { user, ...tokens };
  }

  getUserByToken(token?: string): AuthUser | undefined {
    if (!token) return undefined;
    const session = this.sessions.get(token);
    if (!session) return undefined;
    const now = Date.now();
    // Refresh still valid → keep the pair so /auth/refresh can rotate.
    if (new Date(session.refreshExpiresAt).getTime() < now) {
      this.revokeSession(session);
      return undefined;
    }
    if (new Date(session.expiresAt).getTime() < now) {
      return undefined;
    }
    return this.users.get(session.userId);
  }

  /** Rotate tokens; old refresh is invalidated. */
  refreshSession(refreshToken: string): AuthTokens {
    const accessToken = this.refreshIndex.get(refreshToken);
    if (!accessToken) {
      throw new Error('invalid_refresh_token');
    }
    const session = this.sessions.get(accessToken);
    if (!session || session.refreshToken !== refreshToken) {
      this.refreshIndex.delete(refreshToken);
      throw new Error('invalid_refresh_token');
    }
    if (new Date(session.refreshExpiresAt).getTime() < Date.now()) {
      this.revokeSession(session);
      throw new Error('expired_refresh_token');
    }
    const user = this.users.get(session.userId);
    if (!user || user.status !== 'active') {
      this.revokeSession(session);
      throw new Error('invalid_refresh_token');
    }
    this.revokeSession(session);
    return this.issueTokens(user.id, { recordSignIn: false });
  }

  getUser(id: string): AuthUser | undefined {
    return this.users.get(id);
  }

  listUsers(): AuthUser[] {
    return [...this.users.values()];
  }

  listSignInEvents(): SignInEvent[] {
    return [...this.signInEvents];
  }

  activeSessionCount(): number {
    const now = Date.now();
    let count = 0;
    for (const session of this.sessions.values()) {
      if (new Date(session.refreshExpiresAt).getTime() >= now) count += 1;
    }
    return count;
  }

  logout(token: string) {
    const session = this.sessions.get(token);
    if (session) this.revokeSession(session);
  }

  /** Soft-delete account: remove sessions, identities, employer profile, user. */
  deleteUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    for (const session of [...this.sessions.values()]) {
      if (session.userId === userId) this.revokeSession(session);
    }
    for (const [key, id] of this.identityIndex) {
      if (id === userId) this.identityIndex.delete(key);
    }
    for (const [id, employer] of this.employers) {
      if (employer.ownerUserId === userId) this.employers.delete(id);
    }
    this.users.delete(userId);
    return true;
  }

  createEmployer(ownerUserId: string, name: string): EmployerProfile {
    const existing = [...this.employers.values()].find((e) => e.ownerUserId === ownerUserId);
    if (existing) {
      existing.name = name.trim() || existing.name;
      this.employers.set(existing.id, existing);
      const owner = this.users.get(ownerUserId);
      if (owner && !owner.roles.includes('employer')) {
        owner.roles = [...owner.roles, 'employer'];
        this.users.set(owner.id, owner);
      }
      return existing;
    }

    const profile: EmployerProfile = {
      id: `emp_${randomUUID().slice(0, 8)}`,
      name: name.trim() || 'Employer',
      verificationStatus: 'unverified',
      ownerUserId,
      createdAt: new Date().toISOString(),
    };
    this.employers.set(profile.id, profile);
    const owner = this.users.get(ownerUserId);
    if (owner && !owner.roles.includes('employer')) {
      owner.roles = [...owner.roles, 'employer'];
      this.users.set(owner.id, owner);
    }
    return profile;
  }

  getEmployerByOwner(userId: string): EmployerProfile | undefined {
    return [...this.employers.values()].find((e) => e.ownerUserId === userId);
  }

  getEmployer(id: string): EmployerProfile | undefined {
    return this.employers.get(id);
  }

  toPublicUser(user: AuthUser) {
    return {
      id: user.id,
      status: user.status,
      preferredLocale: user.preferredLocale,
      roles: user.roles,
      phone: user.phone ? this.maskPhone(user.phone) : undefined,
      email: user.email ? this.maskEmail(user.email) : undefined,
      displayName: user.displayName,
      createdAt: user.createdAt,
    };
  }

  private upsertUser(input: {
    phone?: string;
    email?: string;
    displayName?: string;
    roles: UserRole[];
  }): AuthUser {
    const user: AuthUser = {
      id: `usr_${randomUUID().slice(0, 8)}`,
      status: 'active',
      preferredLocale: 'en',
      roles: [...new Set(input.roles)],
      phone: input.phone,
      email: input.email,
      displayName: input.displayName,
      createdAt: new Date().toISOString(),
    };
    this.users.set(user.id, user);
    if (input.phone) this.identityIndex.set(`phone:${input.phone}`, user.id);
    if (input.email) this.identityIndex.set(`email:${input.email}`, user.id);
    return user;
  }

  /** Apply SiteConfig `auth` TTLs (new refresh / OTP challenges only). */
  setAuthTtls(input: { sessionTtlDays: number; otpTtlMinutes: number }) {
    this.sessionTtlMs = input.sessionTtlDays * 24 * 60 * 60 * 1000;
    this.otpTtlMs = input.otpTtlMinutes * 60 * 1000;
  }

  private createSession(userId: string): AuthTokens {
    return this.issueTokens(userId, { recordSignIn: true });
  }

  private issueTokens(
    userId: string,
    options: { recordSignIn: boolean },
  ): AuthTokens {
    const token = randomUUID();
    const refreshToken = randomUUID();
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + this.accessTtlMs).toISOString();
    const refreshExpiresAt = new Date(
      Date.now() + this.sessionTtlMs,
    ).toISOString();
    const session: SessionRecord = {
      token,
      refreshToken,
      userId,
      createdAt,
      expiresAt,
      refreshExpiresAt,
    };
    this.sessions.set(token, session);
    this.refreshIndex.set(refreshToken, token);
    if (options.recordSignIn) {
      this.signInEvents.push({ userId, at: createdAt });
    }
    return { token, refreshToken, expiresAt };
  }

  private revokeSession(session: SessionRecord) {
    this.sessions.delete(session.token);
    this.refreshIndex.delete(session.refreshToken);
  }

  private resolveAccessTtlMs(): number {
    const raw = Number(process.env.AUTH_ACCESS_TTL_MINUTES ?? '15');
    const minutes =
      Number.isFinite(raw) && raw >= 1 && raw <= 24 * 60 ? raw : 15;
    return minutes * 60 * 1000;
  }

  private resolveRoles(_destination: string, intended: UserRole): UserRole[] {
    const roles = new Set<UserRole>(['seeker']);
    if (intended === 'employer') roles.add('employer');
    // Admin role is only via SUPER_ADMIN email/password login.
    return [...roles];
  }

  private resolveSuperAdminEmail(): string {
    const fromEnv = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    if (fromEnv) return fromEnv;
    const firstAdmin = this.adminIdentities()[0];
    return firstAdmin || 'admin@xcron.local';
  }

  private adminIdentities(): string[] {
    const configured = (process.env.ADMIN_IDENTITIES ?? 'admin@xcron.local')
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);
    const superEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    if (superEmail && !configured.includes(superEmail)) {
      configured.push(superEmail);
    }
    return configured;
  }

  private assertAdminLoginAllowed(email: string) {
    const state = this.adminLoginAttempts.get(email);
    if (state?.lockedUntil && state.lockedUntil > Date.now()) {
      throw new Error('too_many_attempts');
    }
  }

  private recordAdminLoginFailure(email: string) {
    const state = this.adminLoginAttempts.get(email) ?? { count: 0 };
    state.count += 1;
    if (state.count >= 5) {
      state.lockedUntil = Date.now() + 15 * 60 * 1000;
      state.count = 0;
    }
    this.adminLoginAttempts.set(email, state);
  }

  private normalizeDestination(channel: 'phone' | 'email', value: string): string {
    const trimmed = value.trim();
    if (channel === 'email') return trimmed.toLowerCase();
    return trimmed.replace(/[^\d+]/g, '');
  }

  private maskPhone(phone: string): string {
    return phone.replace(/(\d{2})\d+(\d{2})/, '$1******$2');
  }

  private maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    return `${name.slice(0, 1)}***@${domain}`;
  }

  private isDev(): boolean {
    return !this.isProd();
  }

  private isProd(): boolean {
    return (process.env.NODE_ENV ?? 'development') === 'production';
  }
}
