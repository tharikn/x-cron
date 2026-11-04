export type UserRole = 'seeker' | 'employer' | 'admin';

export interface AuthUser {
  id: string;
  status: 'active' | 'disabled';
  preferredLocale: string;
  roles: UserRole[];
  username?: string;
  /** scrypt hash hex — never expose on public DTOs. */
  passwordHash?: string;
  /** scrypt salt hex — never expose on public DTOs. */
  passwordSalt?: string;
  phone?: string;
  email?: string;
  displayName?: string;
  createdAt: string;
}

export interface EmployerProfile {
  id: string;
  name: string;
  slug?: string;
  about?: string;
  logoUrl?: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  ownerUserId: string;
  createdAt: string;
}

export interface SessionRecord {
  /** Short-lived access token (cookie / Bearer). */
  token: string;
  /** Long-lived refresh token (cookie or POST /v1/auth/refresh body). */
  refreshToken: string;
  userId: string;
  createdAt: string;
  /** Access token expiry. */
  expiresAt: string;
  /** Refresh token expiry (SiteConfig sessionTtlDays). */
  refreshExpiresAt: string;
  /**
   * Bound browser tab id (`X-Tab-Id`). When set, AuthGuard rejects other tabs.
   * Empty means pre-binding / non-browser clients until first authenticated call.
   */
  tabId?: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface IssueSessionOptions {
  tabId?: string;
  /** When false, keep other sessions (rare). Default: revoke siblings. */
  revokeOtherSessions?: boolean;
}
