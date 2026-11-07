import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuthTokens,
  AuthUser,
  EmployerProfile,
  IssueSessionOptions,
  PublicSession,
  SessionRecord,
  UserRole,
} from './auth.types';

interface RevokedRefreshRecord {
  userId: string;
  familyId: string;
  expiresAt: string;
}

export interface SignInEvent {
  userId: string;
  at: string;
}

function resolveAuthStoreMode(): 'prisma' | 'memory' {
  const dedicated = (process.env.AUTH_STORE ?? '').trim().toLowerCase();
  if (dedicated === 'prisma' || dedicated === 'memory') return dedicated;
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma'
    ? 'prisma'
    : 'memory';
}

@Injectable()
export class AuthStore implements OnModuleInit {
  private readonly users = new Map<string, AuthUser>();
  private readonly sessions = new Map<string, SessionRecord>();
  /** refreshToken → accessToken */
  private readonly refreshIndex = new Map<string, string>();
  /** Retired refresh tokens → family (reuse detection). */
  private readonly revokedRefresh = new Map<string, RevokedRefreshRecord>();
  private readonly employers = new Map<string, EmployerProfile>();
  /** username:x / phone:x / email:x -> userId */
  private readonly identityIndex = new Map<string, string>();
  private readonly signInEvents: SignInEvent[] = [];
  private readonly adminLoginAttempts = new Map<
    string,
    { count: number; lockedUntil?: number }
  >();
  private readonly passwordLoginAttempts = new Map<
    string,
    { count: number; lockedUntil?: number }
  >();
  private passwordSalt: Buffer | null = null;
  private passwordHash: Buffer | null = null;
  private superAdminEmail: string | null = null;
  /** Access token TTL (Bearer). Env AUTH_ACCESS_TTL_MINUTES, default 15. */
  private accessTtlMs = this.resolveAccessTtlMs();
  /** Refresh token TTL — synced from SiteConfig `auth` (defaults match seed). */
  private sessionTtlMs = 90 * 24 * 60 * 60 * 1000;
  /** Kept for SiteConfig auth TTL sync (OTP removed; value unused). */
  private otpTtlMs = 10 * 60 * 1000;
  private readonly persistenceEnabled = resolveAuthStoreMode() === 'prisma';

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
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

    if (this.persistenceEnabled) {
      await this.hydrateFromDb();
    }

    const admin = this.upsertUser({
      email,
      displayName: 'X Cron Super Admin',
      roles: ['admin', 'employer', 'seeker'],
    });
    this.createEmployer(admin.id, 'X Cron Moderation Desk');
    await this.flushPending();
  }

  signInSuperAdmin(
    email: string,
    password: string,
    options?: IssueSessionOptions,
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
      void this.persistUser(user);
    }
    if (!this.getEmployerByOwner(user.id)) {
      this.createEmployer(user.id, 'X Cron Moderation Desk');
    }
    const tokens = this.createSession(user.id, options);
    return { user, ...tokens };
  }

  registerWithPassword(
    input: {
      username: string;
      password: string;
      intendedRole?: UserRole;
    },
    options?: IssueSessionOptions,
  ): { user: AuthUser } & AuthTokens {
    const username = this.normalizeUsername(input.username);
    if (!username) {
      throw new Error('invalid_username');
    }
    if (input.password.length < 8) {
      throw new Error('weak_password');
    }
    const key = `username:${username}`;
    if (this.identityIndex.has(key)) {
      throw new Error('username_taken');
    }
    const { saltHex, hashHex } = this.hashPassword(input.password);
    const intended =
      input.intendedRole === 'employer' ? 'employer' : 'seeker';
    const user = this.upsertUser({
      username,
      displayName: username,
      passwordHash: hashHex,
      passwordSalt: saltHex,
      roles: this.mergePublicRoles(undefined, intended),
    });
    const tokens = this.createSession(user.id, options);
    return { user, ...tokens };
  }

  loginWithPassword(
    input: {
      username: string;
      password: string;
      intendedRole?: UserRole;
    },
    options?: IssueSessionOptions,
  ): { user: AuthUser } & AuthTokens {
    const username = this.normalizeUsername(input.username);
    if (!username) {
      throw new Error('invalid_credentials');
    }
    this.assertPasswordLoginAllowed(username);

    const userId = this.identityIndex.get(`username:${username}`);
    const user = userId ? this.users.get(userId) : undefined;
    if (
      !user ||
      user.status !== 'active' ||
      !user.passwordHash ||
      !user.passwordSalt
    ) {
      this.recordPasswordLoginFailure(username);
      throw new Error('invalid_credentials');
    }
    if (!this.verifyPassword(input.password, user.passwordSalt, user.passwordHash)) {
      this.recordPasswordLoginFailure(username);
      throw new Error('invalid_credentials');
    }

    this.passwordLoginAttempts.delete(username);
    const intended =
      input.intendedRole === 'employer' ? 'employer' : 'seeker';
    user.roles = this.mergePublicRoles(user.roles, intended);
    this.users.set(user.id, user);
    void this.persistUser(user);

    const tokens = this.createSession(user.id, options);
    return { user, ...tokens };
  }

  signInWithGoogle(
    input: {
      email: string;
      displayName?: string;
      intendedRole?: UserRole;
    },
    options?: IssueSessionOptions,
  ): { user: AuthUser; isNewUser: boolean } & AuthTokens {
    const email = this.normalizeDestination('email', input.email);
    if (!email.includes('@')) {
      throw new Error('invalid_email');
    }
    const key = `email:${email}`;
    let userId = this.identityIndex.get(key);
    let user = userId ? this.users.get(userId) : undefined;
    const intended =
      input.intendedRole === 'employer' ? 'employer' : 'seeker';
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = this.upsertUser({
        email,
        displayName: input.displayName || email.split('@')[0],
        roles: this.mergePublicRoles(undefined, intended),
      });
    } else {
      if (user.status !== 'active') {
        throw new Error('invalid_credentials');
      }
      // Google never grants admin — password login only. Keep employer if already held.
      user.roles = this.mergePublicRoles(user.roles, intended);
      if (input.displayName) user.displayName = input.displayName;
      this.users.set(user.id, user);
      void this.persistUser(user);
    }

    const tokens = this.createSession(user.id, options);
    return { user, isNewUser, ...tokens };
  }

  getUserByToken(
    token?: string,
    options?: { tabId?: string; enforceTab?: boolean },
  ): AuthUser | undefined {
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
    if (options?.enforceTab) {
      this.assertTabBinding(session, options.tabId);
    }
    const user = this.users.get(session.userId);
    if (!user || user.status !== 'active') {
      this.revokeSession(session);
      return undefined;
    }
    return this.applyModeratorAllowlist(user);
  }

  getAccessTtlSeconds(): number {
    return Math.floor(this.accessTtlMs / 1000);
  }

  getRefreshTtlSeconds(): number {
    return Math.floor(this.sessionTtlMs / 1000);
  }

  /**
   * Rotate tokens; old refresh is retired (not merely deleted).
   * Presenting a retired refresh revokes the entire token family.
   */
  refreshSession(
    refreshToken: string,
    options?: IssueSessionOptions,
  ): AuthTokens {
    const retired = this.revokedRefresh.get(refreshToken);
    if (retired) {
      if (new Date(retired.expiresAt).getTime() < Date.now()) {
        this.revokedRefresh.delete(refreshToken);
        throw new Error('invalid_refresh_token');
      }
      this.revokeFamily(retired.familyId);
      throw new Error('refresh_token_reuse');
    }

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
    const tabId = options?.tabId?.trim() || session.tabId;
    const familyId = session.familyId;
    this.retireRefreshToken(session);
    this.revokeSession(session);
    return this.issueTokens(user.id, {
      recordSignIn: false,
      tabId,
      familyId,
      revokeOtherSessions: false,
      ip: options?.ip ?? session.ip,
      userAgent: options?.userAgent ?? session.userAgent,
    });
  }

  /** Disable or re-enable an account (revokes sessions when disabling). */
  setUserStatus(userId: string, status: 'active' | 'disabled'): AuthUser | undefined {
    const user = this.users.get(userId);
    if (!user) return undefined;
    user.status = status;
    this.users.set(userId, user);
    void this.persistUser(user);
    if (status === 'disabled') {
      this.revokeAllSessionsForUser(userId);
    }
    return user;
  }

  /**
   * Grant or revoke staff roles. Only `admin` / `moderator` may be toggled here —
   * never via register/Google. `admin` still requires SUPER_ADMIN password path
   * for bootstrap; this is for assigning `moderator` (or stripping it).
   */
  setStaffRoles(
    userId: string,
    patch: { moderator?: boolean; admin?: boolean },
  ): AuthUser | undefined {
    const user = this.users.get(userId);
    if (!user) return undefined;
    const roles = new Set<UserRole>(user.roles.filter((r) => r !== 'admin' && r !== 'moderator'));
    roles.add('seeker');
    const keepAdmin =
      patch.admin === true || (patch.admin !== false && user.roles.includes('admin'));
    const keepModerator =
      patch.moderator === true ||
      (patch.moderator !== false && user.roles.includes('moderator'));
    if (keepAdmin) roles.add('admin');
    if (keepModerator) roles.add('moderator');
    user.roles = [...roles];
    this.users.set(userId, user);
    void this.persistUser(user);
    return user;
  }

  /** Apply MODERATOR_EMAILS allowlist when the user has a matching email. */
  applyModeratorAllowlist(user: AuthUser): AuthUser {
    const email = user.email?.trim().toLowerCase();
    if (!email || user.roles.includes('moderator') || user.roles.includes('admin')) {
      return user;
    }
    if (!this.moderatorEmails().includes(email)) return user;
    return this.setStaffRoles(user.id, { moderator: true }) ?? user;
  }

  findUsersByQuery(q: string, limit = 20): AuthUser[] {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return this.listUsers()
      .filter((u) => {
        const hay = [u.id, u.username, u.email, u.displayName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(needle);
      })
      .slice(0, limit);
  }

  /** Active sessions for the principal (no token secrets). */
  listSessionsForUser(
    userId: string,
    currentAccessToken?: string,
  ): PublicSession[] {
    const now = Date.now();
    const rows: PublicSession[] = [];
    for (const session of this.sessions.values()) {
      if (session.userId !== userId) continue;
      if (new Date(session.refreshExpiresAt).getTime() < now) {
        this.revokeSession(session);
        continue;
      }
      rows.push({
        id: session.id,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        refreshExpiresAt: session.refreshExpiresAt,
        current: !!currentAccessToken && session.token === currentAccessToken,
        ip: session.ip,
        userAgent: session.userAgent,
        lastSeenAt: session.lastSeenAt,
      });
    }
    return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /** Distinct IPs from active sessions (admin tracking). */
  listSessionIpsForUser(userId: string): string[] {
    const ips: string[] = [];
    const now = Date.now();
    for (const session of this.sessions.values()) {
      if (session.userId !== userId) continue;
      if (new Date(session.refreshExpiresAt).getTime() < now) continue;
      if (session.ip && !ips.includes(session.ip)) ips.push(session.ip);
    }
    return ips;
  }

  /** Revoke one of the caller's sessions by public session id. */
  revokeSessionForUser(userId: string, sessionId: string): boolean {
    for (const session of this.sessions.values()) {
      if (session.id === sessionId && session.userId === userId) {
        this.revokeSession(session);
        return true;
      }
    }
    return false;
  }

  /** Logout everywhere — revoke every refresh/access pair for the user. */
  revokeAllSessionsForUser(userId: string): number {
    let count = 0;
    for (const session of [...this.sessions.values()]) {
      if (session.userId === userId) {
        this.revokeSession(session);
        count += 1;
      }
    }
    return count;
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

  /** True while the user still has a non-expired refresh session (stay signed-in). */
  hasActiveRefreshSession(userId: string): boolean {
    const now = Date.now();
    for (const session of this.sessions.values()) {
      if (
        session.userId === userId &&
        new Date(session.refreshExpiresAt).getTime() >= now
      ) {
        return true;
      }
    }
    return false;
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
    for (const [token, record] of [...this.revokedRefresh.entries()]) {
      if (record.userId === userId) this.revokedRefresh.delete(token);
    }
    for (const [key, id] of this.identityIndex) {
      if (id === userId) this.identityIndex.delete(key);
    }
    for (const [id, employer] of this.employers) {
      if (employer.ownerUserId === userId) this.employers.delete(id);
    }
    this.users.delete(userId);
    void this.deleteUserPersisted(userId);
    return true;
  }

  createEmployer(
    ownerUserId: string,
    name: string,
    extras?: Partial<
      Pick<
        EmployerProfile,
        | 'legalName'
        | 'about'
        | 'website'
        | 'industry'
        | 'sizeBand'
        | 'headquarters'
        | 'hiringLocations'
        | 'logoUrl'
      >
    >,
  ): EmployerProfile {
    const existing = [...this.employers.values()].find((e) => e.ownerUserId === ownerUserId);
    if (existing) {
      existing.name = name.trim() || existing.name;
      if (extras) Object.assign(existing, this.pickEmployerExtras(extras));
      existing.updatedAt = new Date().toISOString();
      this.employers.set(existing.id, existing);
      const owner = this.users.get(ownerUserId);
      if (owner && !owner.roles.includes('employer')) {
        owner.roles = [...owner.roles, 'employer'];
        this.users.set(owner.id, owner);
        void this.persistUser(owner);
      }
      void this.persistEmployer(existing);
      return existing;
    }

    const id = `emp_${randomUUID().slice(0, 8)}`;
    const safeName = name.trim() || 'Employer';
    const now = new Date().toISOString();
    const profile: EmployerProfile = {
      id,
      name: safeName,
      slug: `${safeName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 48)}-${id.slice(-4)}`,
      about: extras?.about ?? '',
      legalName: extras?.legalName,
      website: extras?.website,
      industry: extras?.industry,
      sizeBand: extras?.sizeBand,
      headquarters: extras?.headquarters,
      hiringLocations: extras?.hiringLocations ?? [],
      logoUrl: extras?.logoUrl,
      verificationStatus: 'unverified',
      trustTier: 'standard',
      riskFlags: [],
      workspaceSettings: {},
      ownerUserId,
      createdAt: now,
      updatedAt: now,
    };
    this.employers.set(profile.id, profile);
    const owner = this.users.get(ownerUserId);
    if (owner && !owner.roles.includes('employer')) {
      owner.roles = [...owner.roles, 'employer'];
      this.users.set(owner.id, owner);
      void this.persistUser(owner);
    }
    void this.persistEmployer(profile);
    return profile;
  }

  updateEmployer(
    id: string,
    patch: Partial<
      Omit<EmployerProfile, 'id' | 'createdAt'>
    >,
  ): EmployerProfile {
    const existing = this.employers.get(id);
    if (!existing) {
      throw new Error(`Employer ${id} not found`);
    }
    const next: EmployerProfile = {
      ...existing,
      ...this.pickEmployerExtras(patch),
      name: patch.name?.trim() || existing.name,
      ownerUserId: patch.ownerUserId ?? existing.ownerUserId,
      verificationStatus:
        patch.verificationStatus ?? existing.verificationStatus,
      updatedAt: new Date().toISOString(),
    };
    this.employers.set(id, next);
    void this.persistEmployer(next);
    return next;
  }

  listEmployers(): EmployerProfile[] {
    return [...this.employers.values()];
  }

  /** Persist an in-memory user mutation (roles etc.). */
  saveUser(user: AuthUser): void {
    this.users.set(user.id, user);
    void this.persistUser(user);
  }

  getEmployerByOwner(userId: string): EmployerProfile | undefined {
    return [...this.employers.values()].find((e) => e.ownerUserId === userId);
  }

  getEmployer(id: string): EmployerProfile | undefined {
    return this.employers.get(id);
  }

  private pickEmployerExtras(
    patch: Partial<EmployerProfile>,
  ): Partial<EmployerProfile> {
    const out: Partial<EmployerProfile> = {};
    const keys: (keyof EmployerProfile)[] = [
      'legalName',
      'slug',
      'about',
      'logoUrl',
      'website',
      'verifiedEmailDomain',
      'industry',
      'sizeBand',
      'headquarters',
      'hiringLocations',
      'verificationNotes',
      'trustTier',
      'riskFlags',
      'workspaceSettings',
    ];
    for (const key of keys) {
      if (patch[key] !== undefined) {
        (out as Record<string, unknown>)[key] = patch[key];
      }
    }
    return out;
  }

  toPublicUser(user: AuthUser) {
    return {
      id: user.id,
      status: user.status,
      preferredLocale: user.preferredLocale,
      roles: user.roles,
      username: user.username,
      phone: user.phone ? this.maskPhone(user.phone) : undefined,
      email: user.email ? this.maskEmail(user.email) : undefined,
      displayName: user.displayName,
      createdAt: user.createdAt,
    };
  }

  private upsertUser(input: {
    username?: string;
    phone?: string;
    email?: string;
    displayName?: string;
    passwordHash?: string;
    passwordSalt?: string;
    roles: UserRole[];
  }): AuthUser {
    if (input.username) {
      const existingId = this.identityIndex.get(`username:${input.username}`);
      const existing = existingId ? this.users.get(existingId) : undefined;
      if (existing) {
        existing.roles = [...new Set([...existing.roles, ...input.roles])];
        if (input.displayName) existing.displayName = input.displayName;
        if (input.passwordHash) existing.passwordHash = input.passwordHash;
        if (input.passwordSalt) existing.passwordSalt = input.passwordSalt;
        this.users.set(existing.id, existing);
        void this.persistUser(existing);
        return existing;
      }
    }
    if (input.email) {
      const existingId = this.identityIndex.get(`email:${input.email}`);
      const existing = existingId ? this.users.get(existingId) : undefined;
      if (existing) {
        existing.roles = [...new Set([...existing.roles, ...input.roles])];
        if (input.displayName) existing.displayName = input.displayName;
        if (input.phone && !existing.phone) existing.phone = input.phone;
        this.users.set(existing.id, existing);
        void this.persistUser(existing);
        return existing;
      }
    }
    if (input.phone) {
      const existingId = this.identityIndex.get(`phone:${input.phone}`);
      const existing = existingId ? this.users.get(existingId) : undefined;
      if (existing) {
        existing.roles = [...new Set([...existing.roles, ...input.roles])];
        if (input.displayName) existing.displayName = input.displayName;
        if (input.email && !existing.email) {
          existing.email = input.email;
          this.identityIndex.set(`email:${input.email}`, existing.id);
        }
        this.users.set(existing.id, existing);
        void this.persistUser(existing);
        return existing;
      }
    }

    const user: AuthUser = {
      id: `usr_${randomUUID().slice(0, 8)}`,
      status: 'active',
      preferredLocale: 'en',
      roles: [...new Set(input.roles)],
      username: input.username,
      passwordHash: input.passwordHash,
      passwordSalt: input.passwordSalt,
      phone: input.phone,
      email: input.email,
      displayName: input.displayName,
      createdAt: new Date().toISOString(),
    };
    this.users.set(user.id, user);
    if (input.username) this.identityIndex.set(`username:${input.username}`, user.id);
    if (input.phone) this.identityIndex.set(`phone:${input.phone}`, user.id);
    if (input.email) this.identityIndex.set(`email:${input.email}`, user.id);
    void this.persistUser(user);
    return user;
  }

  /** Apply SiteConfig `auth` TTLs (new refresh / OTP challenges only). */
  setAuthTtls(input: { sessionTtlDays: number; otpTtlMinutes: number }) {
    this.sessionTtlMs = input.sessionTtlDays * 24 * 60 * 60 * 1000;
    this.otpTtlMs = input.otpTtlMinutes * 60 * 1000;
  }

  private createSession(
    userId: string,
    options?: IssueSessionOptions,
  ): AuthTokens {
    return this.issueTokens(userId, {
      recordSignIn: true,
      tabId: options?.tabId,
      familyId: options?.familyId,
      revokeOtherSessions: options?.revokeOtherSessions,
      ip: options?.ip,
      userAgent: options?.userAgent,
    });
  }

  private singleSessionEnabled(): boolean {
    return (process.env.AUTH_SINGLE_SESSION ?? '1') !== '0';
  }

  private singleTabEnabled(): boolean {
    return (process.env.AUTH_SINGLE_TAB ?? '1') !== '0';
  }

  private assertTabBinding(session: SessionRecord, tabId?: string): void {
    if (!this.singleTabEnabled()) return;
    // Native / automation may omit tab id when session was issued without one.
    if (!session.tabId) {
      if (tabId?.trim()) {
        session.tabId = tabId.trim();
      }
      return;
    }
    if (!tabId?.trim() || tabId.trim() !== session.tabId) {
      throw new Error('session_tab_mismatch');
    }
  }

  private revokeOtherSessions(userId: string, keepToken?: string): void {
    if (!this.singleSessionEnabled()) return;
    for (const session of [...this.sessions.values()]) {
      if (session.userId === userId && session.token !== keepToken) {
        this.revokeSession(session);
      }
    }
  }

  private issueTokens(
    userId: string,
    options: {
      recordSignIn: boolean;
      tabId?: string;
      familyId?: string;
      revokeOtherSessions?: boolean;
      ip?: string;
      userAgent?: string;
    },
  ): AuthTokens {
    const shouldRevoke =
      options.revokeOtherSessions !== false && this.singleSessionEnabled();
    if (shouldRevoke) {
      this.revokeOtherSessions(userId);
    }

    const id = randomUUID();
    const token = randomUUID();
    const refreshToken = randomUUID();
    const familyId = options.familyId?.trim() || randomUUID();
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + this.accessTtlMs).toISOString();
    const refreshExpiresAt = new Date(
      Date.now() + this.sessionTtlMs,
    ).toISOString();
    const tabId = options.tabId?.trim() || undefined;
    const ip = options.ip?.trim() || undefined;
    const userAgent = options.userAgent?.trim()?.slice(0, 512) || undefined;
    const session: SessionRecord = {
      id,
      token,
      refreshToken,
      userId,
      familyId,
      createdAt,
      expiresAt,
      refreshExpiresAt,
      tabId,
      ip,
      userAgent,
      lastSeenAt: createdAt,
    };
    this.sessions.set(token, session);
    this.refreshIndex.set(refreshToken, token);
    if (options.recordSignIn) {
      this.signInEvents.push({ userId, at: createdAt });
    }
    void this.persistSession(session);
    return { token, refreshToken, expiresAt };
  }

  private revokeSession(session: SessionRecord) {
    this.sessions.delete(session.token);
    this.refreshIndex.delete(session.refreshToken);
    void this.deleteSessionPersisted(session);
  }

  private retireRefreshToken(session: SessionRecord) {
    const record: RevokedRefreshRecord = {
      userId: session.userId,
      familyId: session.familyId,
      expiresAt: session.refreshExpiresAt,
    };
    this.revokedRefresh.set(session.refreshToken, record);
    void this.persistRevokedRefresh(session.refreshToken, record);
  }

  /** Suspected theft: drop every live session in the family + clear retired peers. */
  private revokeFamily(familyId: string) {
    for (const session of [...this.sessions.values()]) {
      if (session.familyId === familyId) {
        this.revokeSession(session);
      }
    }
    for (const [token, record] of [...this.revokedRefresh.entries()]) {
      if (record.familyId === familyId) {
        this.revokedRefresh.delete(token);
        void this.deleteRevokedRefreshPersisted(token);
      }
    }
  }

  private mergePublicRoles(
    existing: UserRole[] | undefined,
    intended: UserRole,
  ): UserRole[] {
    const roles = new Set<UserRole>(['seeker']);
    if (existing?.includes('employer')) roles.add('employer');
    if (intended === 'employer') roles.add('employer');
    // Preserve staff roles; never grant admin/moderator via register/login/Google.
    if (existing?.includes('admin')) roles.add('admin');
    if (existing?.includes('moderator')) roles.add('moderator');
    return [...roles];
  }

  private moderatorEmails(): string[] {
    return (process.env.MODERATOR_EMAILS ?? '')
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);
  }

  private hashPassword(password: string): { saltHex: string; hashHex: string } {
    const salt = randomBytes(16);
    const hash = scryptSync(password, salt, 64);
    return { saltHex: salt.toString('hex'), hashHex: hash.toString('hex') };
  }

  private verifyPassword(
    password: string,
    saltHex: string,
    hashHex: string,
  ): boolean {
    try {
      const salt = Buffer.from(saltHex, 'hex');
      const expected = Buffer.from(hashHex, 'hex');
      const candidate = scryptSync(password, salt, expected.length);
      if (candidate.length !== expected.length) return false;
      return timingSafeEqual(candidate, expected);
    } catch {
      return false;
    }
  }

  private normalizeUsername(value: string): string | null {
    const normalized = value.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,32}$/.test(normalized)) return null;
    return normalized;
  }

  private assertPasswordLoginAllowed(username: string) {
    const state = this.passwordLoginAttempts.get(username);
    if (state?.lockedUntil && state.lockedUntil > Date.now()) {
      throw new Error('too_many_attempts');
    }
  }

  private recordPasswordLoginFailure(username: string) {
    const state = this.passwordLoginAttempts.get(username) ?? { count: 0 };
    state.count += 1;
    if (state.count >= 5) {
      state.lockedUntil = Date.now() + 15 * 60 * 1000;
      state.count = 0;
    }
    this.passwordLoginAttempts.set(username, state);
  }

  private resolveAccessTtlMs(): number {
    const raw = Number(process.env.AUTH_ACCESS_TTL_MINUTES ?? '15');
    const minutes =
      Number.isFinite(raw) && raw >= 1 && raw <= 24 * 60 ? raw : 15;
    return minutes * 60 * 1000;
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

  private isProd(): boolean {
    return (process.env.NODE_ENV ?? 'development') === 'production';
  }

  private parseRoles(value: Prisma.JsonValue | null | undefined): UserRole[] {
    if (!Array.isArray(value)) return ['seeker'];
    const out = new Set<UserRole>();
    for (const item of value) {
      if (
        item === 'seeker' ||
        item === 'employer' ||
        item === 'admin' ||
        item === 'moderator'
      ) {
        out.add(item);
      }
    }
    if (!out.size) out.add('seeker');
    return [...out];
  }

  private async hydrateFromDb(): Promise<void> {
    try {
      const now = new Date();
      const [dbUsers, dbEmployers, dbSessions] = await Promise.all([
        this.prisma.user.findMany({
          include: { identities: true },
        }),
        this.prisma.employer.findMany(),
        this.prisma.authSession.findMany({
          where: { refreshExpiresAt: { gt: now } },
        }),
      ]);

      for (const row of dbUsers) {
        const user: AuthUser = {
          id: row.id,
          status: row.status === 'DISABLED' ? 'disabled' : 'active',
          preferredLocale: row.preferredLocale || 'en',
          roles: this.parseRoles(row.rolesJson),
          username: row.username ?? undefined,
          passwordHash: row.passwordHash ?? undefined,
          passwordSalt: row.passwordSalt ?? undefined,
          phone: row.phone ?? undefined,
          email: row.email ?? undefined,
          displayName: row.displayName ?? undefined,
          createdAt: row.createdAt.toISOString(),
        };
        this.users.set(user.id, user);
        if (user.username) {
          this.identityIndex.set(`username:${user.username}`, user.id);
        }
        if (user.phone) this.identityIndex.set(`phone:${user.phone}`, user.id);
        if (user.email) this.identityIndex.set(`email:${user.email}`, user.id);
        for (const identity of row.identities) {
          if (
            identity.provider === 'phone' ||
            identity.provider === 'email' ||
            identity.provider === 'username'
          ) {
            this.identityIndex.set(
              `${identity.provider}:${identity.providerSubject}`,
              user.id,
            );
          } else if (identity.provider === 'google') {
            this.identityIndex.set(`email:${identity.providerSubject}`, user.id);
          }
        }
      }

      for (const row of dbEmployers) {
        const profile: EmployerProfile = {
          id: row.id,
          name: row.name,
          legalName: row.legalName ?? undefined,
          slug: row.slug ?? undefined,
          about: row.about ?? undefined,
          logoUrl: row.logoUrl ?? undefined,
          website: row.website ?? undefined,
          verifiedEmailDomain: row.verifiedEmailDomain ?? undefined,
          industry: row.industry ?? undefined,
          sizeBand: row.sizeBand ?? undefined,
          headquarters: row.headquarters ?? undefined,
          hiringLocations: this.parseJsonStringArray(row.hiringLocationsJson),
          verificationStatus: (row.verificationStatus as EmployerProfile['verificationStatus']) ||
            'unverified',
          verificationNotes: row.verificationNotes ?? undefined,
          trustTier: (row.trustTier as EmployerProfile['trustTier']) || 'standard',
          riskFlags: this.parseJsonStringArray(row.riskFlagsJson),
          workspaceSettings: this.parseJsonObject(row.workspaceSettingsJson),
          ownerUserId: row.ownerUserId,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        };
        this.employers.set(profile.id, profile);
      }

      for (const row of dbSessions) {
        const session: SessionRecord = {
          id: row.id,
          token: row.accessToken,
          refreshToken: row.refreshToken,
          userId: row.userId,
          familyId: row.familyId || row.id,
          createdAt: row.createdAt.toISOString(),
          expiresAt: row.expiresAt.toISOString(),
          refreshExpiresAt: row.refreshExpiresAt.toISOString(),
          ip: row.ip ?? undefined,
          userAgent: row.userAgent ?? undefined,
          lastSeenAt: row.lastSeenAt?.toISOString(),
        };
        this.sessions.set(session.token, session);
        this.refreshIndex.set(session.refreshToken, session.token);
      }

      const dbRevoked = await this.prisma.revokedRefreshToken.findMany({
        where: { expiresAt: { gt: now } },
      });
      for (const row of dbRevoked) {
        this.revokedRefresh.set(row.refreshToken, {
          userId: row.userId,
          familyId: row.familyId,
          expiresAt: row.expiresAt.toISOString(),
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[auth] hydrateFromDb failed — continuing with memory seed only',
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async flushPending(): Promise<void> {
    if (!this.persistenceEnabled) return;
    for (const user of this.users.values()) {
      await this.persistUser(user);
    }
    for (const employer of this.employers.values()) {
      await this.persistEmployer(employer);
    }
  }

  private async persistUser(user: AuthUser): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      await this.prisma.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          status: user.status === 'disabled' ? 'DISABLED' : 'ACTIVE',
          preferredLocale: user.preferredLocale,
          displayName: user.displayName,
          username: user.username,
          passwordHash: user.passwordHash,
          passwordSalt: user.passwordSalt,
          phone: user.phone,
          email: user.email,
          rolesJson: user.roles,
          createdAt: new Date(user.createdAt),
        },
        update: {
          status: user.status === 'disabled' ? 'DISABLED' : 'ACTIVE',
          preferredLocale: user.preferredLocale,
          displayName: user.displayName,
          username: user.username,
          passwordHash: user.passwordHash,
          passwordSalt: user.passwordSalt,
          phone: user.phone,
          email: user.email,
          rolesJson: user.roles,
        },
      });
      if (user.username) {
        await this.prisma.userIdentity.upsert({
          where: {
            provider_providerSubject: {
              provider: 'username',
              providerSubject: user.username,
            },
          },
          create: {
            id: randomUUID(),
            userId: user.id,
            provider: 'username',
            providerSubject: user.username,
            verifiedAt: new Date(),
          },
          update: { userId: user.id, verifiedAt: new Date() },
        });
      }
      if (user.email) {
        await this.prisma.userIdentity.upsert({
          where: {
            provider_providerSubject: {
              provider: 'email',
              providerSubject: user.email,
            },
          },
          create: {
            id: randomUUID(),
            userId: user.id,
            provider: 'email',
            providerSubject: user.email,
            verifiedAt: new Date(),
          },
          update: { userId: user.id, verifiedAt: new Date() },
        });
      }
      if (user.phone) {
        await this.prisma.userIdentity.upsert({
          where: {
            provider_providerSubject: {
              provider: 'phone',
              providerSubject: user.phone,
            },
          },
          create: {
            id: randomUUID(),
            userId: user.id,
            provider: 'phone',
            providerSubject: user.phone,
            verifiedAt: new Date(),
          },
          update: { userId: user.id, verifiedAt: new Date() },
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[auth] persistUser failed',
        user.id,
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async persistEmployer(profile: EmployerProfile): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      await this.ensureUserRow(profile.ownerUserId);
      const workspacePayload = {
        legalName: profile.legalName,
        website: profile.website,
        verifiedEmailDomain: profile.verifiedEmailDomain,
        industry: profile.industry,
        sizeBand: profile.sizeBand,
        headquarters: profile.headquarters,
        hiringLocationsJson: JSON.stringify(profile.hiringLocations ?? []),
        verificationNotes: profile.verificationNotes,
        trustTier: profile.trustTier ?? 'standard',
        riskFlagsJson: JSON.stringify(profile.riskFlags ?? []),
        workspaceSettingsJson: JSON.stringify(profile.workspaceSettings ?? {}),
      };
      await this.prisma.employer.upsert({
        where: { id: profile.id },
        create: {
          id: profile.id,
          name: profile.name,
          slug: profile.slug,
          about: profile.about ?? '',
          logoUrl: profile.logoUrl,
          verificationStatus: profile.verificationStatus,
          ownerUserId: profile.ownerUserId,
          createdAt: new Date(profile.createdAt),
          ...workspacePayload,
        },
        update: {
          name: profile.name,
          slug: profile.slug,
          about: profile.about ?? '',
          logoUrl: profile.logoUrl,
          verificationStatus: profile.verificationStatus,
          ownerUserId: profile.ownerUserId,
          ...workspacePayload,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[auth] persistEmployer failed',
        profile.id,
        error instanceof Error ? error.message : error,
      );
    }
  }

  private parseJsonStringArray(raw: string | null | undefined): string[] {
    if (!raw) return [];
    try {
      const v = JSON.parse(raw) as unknown;
      return Array.isArray(v)
        ? v.filter((x): x is string => typeof x === 'string')
        : [];
    } catch {
      return [];
    }
  }

  private parseJsonObject(raw: string | null | undefined): Record<string, unknown> {
    if (!raw) return {};
    try {
      const v = JSON.parse(raw) as unknown;
      return v && typeof v === 'object' && !Array.isArray(v)
        ? (v as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }

  private async persistSession(session: SessionRecord): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      // Fire-and-forget persistUser may create the same id concurrently.
      await this.ensureUserRow(session.userId);
      await this.prisma.authSession.create({
        data: {
          id: session.id,
          userId: session.userId,
          accessToken: session.token,
          refreshToken: session.refreshToken,
          familyId: session.familyId,
          createdAt: new Date(session.createdAt),
          expiresAt: new Date(session.expiresAt),
          refreshExpiresAt: new Date(session.refreshExpiresAt),
          ip: session.ip ?? null,
          userAgent: session.userAgent ?? null,
          lastSeenAt: session.lastSeenAt
            ? new Date(session.lastSeenAt)
            : null,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[auth] persistSession failed',
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async persistRevokedRefresh(
    refreshToken: string,
    record: RevokedRefreshRecord,
  ): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      await this.prisma.revokedRefreshToken.upsert({
        where: { refreshToken },
        create: {
          refreshToken,
          userId: record.userId,
          familyId: record.familyId,
          expiresAt: new Date(record.expiresAt),
        },
        update: {
          userId: record.userId,
          familyId: record.familyId,
          expiresAt: new Date(record.expiresAt),
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[auth] persistRevokedRefresh failed',
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async deleteRevokedRefreshPersisted(
    refreshToken: string,
  ): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      await this.prisma.revokedRefreshToken
        .delete({ where: { refreshToken } })
        .catch(() => undefined);
    } catch {
      // ignore
    }
  }

  /** Upsert a bare User row; ignore P2002 when a concurrent persist already inserted it. */
  private async ensureUserRow(userId: string): Promise<void> {
    try {
      await this.prisma.user.upsert({
        where: { id: userId },
        create: { id: userId },
        update: {},
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return;
      }
      throw error;
    }
  }

  private async deleteSessionPersisted(session: SessionRecord): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      await this.prisma.authSession.deleteMany({
        where: {
          OR: [
            { accessToken: session.token },
            { refreshToken: session.refreshToken },
          ],
        },
      });
    } catch {
      // ignore missing rows
    }
  }

  private async deleteUserPersisted(userId: string): Promise<void> {
    if (!this.persistenceEnabled) return;
    try {
      await this.prisma.authSession.deleteMany({ where: { userId } });
      await this.prisma.revokedRefreshToken.deleteMany({ where: { userId } });
      await this.prisma.employer.deleteMany({ where: { ownerUserId: userId } });
      await this.prisma.userIdentity.deleteMany({ where: { userId } });
      await this.prisma.user.delete({ where: { id: userId } }).catch(() => undefined);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        '[auth] deleteUserPersisted failed',
        userId,
        error instanceof Error ? error.message : error,
      );
    }
  }
}
