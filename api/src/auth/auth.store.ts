import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomInt, randomUUID } from 'crypto';
import {
  AuthUser,
  EmployerProfile,
  OtpChallenge,
  SessionRecord,
  UserRole,
} from './auth.types';

@Injectable()
export class AuthStore implements OnModuleInit {
  private readonly users = new Map<string, AuthUser>();
  private readonly sessions = new Map<string, SessionRecord>();
  private readonly otps = new Map<string, OtpChallenge>();
  private readonly employers = new Map<string, EmployerProfile>();
  private readonly identityIndex = new Map<string, string>(); // phone:x / email:x -> userId

  onModuleInit() {
    const admin = this.upsertUser({
      email: 'admin@xcron.local',
      displayName: 'X Cron Admin',
      roles: ['admin', 'employer', 'seeker'],
    });
    this.createEmployer(admin.id, 'X Cron Moderation Desk');
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
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      attempts: 0,
    };
    this.otps.set(challenge.id, challenge);
    return {
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt,
      ...(this.isDev() ? { devCode: code } : {}),
    };
  }

  verifyOtp(challengeId: string, code: string): { user: AuthUser; token: string } {
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
      const roles = new Set(user.roles);
      for (const role of this.resolveRoles(challenge.destination, challenge.intendedRole)) {
        roles.add(role);
      }
      user.roles = [...roles];
      this.users.set(user.id, user);
    }

    const token = this.createSession(user.id);
    return { user, token };
  }

  getUserByToken(token?: string): AuthUser | undefined {
    if (!token) return undefined;
    const session = this.sessions.get(token);
    if (!session) return undefined;
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      this.sessions.delete(token);
      return undefined;
    }
    return this.users.get(session.userId);
  }

  getUser(id: string): AuthUser | undefined {
    return this.users.get(id);
  }

  logout(token: string) {
    this.sessions.delete(token);
  }

  /** Soft-delete account: remove sessions, identities, employer profile, user. */
  deleteUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    for (const [token, session] of this.sessions) {
      if (session.userId === userId) this.sessions.delete(token);
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

  private createSession(userId: string): string {
    const token = randomUUID();
    this.sessions.set(token, {
      token,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
    return token;
  }

  private resolveRoles(destination: string, intended: UserRole): UserRole[] {
    const adminIds = (process.env.ADMIN_IDENTITIES ?? 'admin@xcron.local')
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);
    const roles = new Set<UserRole>(['seeker']);
    if (intended === 'employer') roles.add('employer');
    if (adminIds.includes(destination.toLowerCase())) {
      roles.add('admin');
      roles.add('employer');
    }
    return [...roles];
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
    return (process.env.NODE_ENV ?? 'development') !== 'production';
  }
}
