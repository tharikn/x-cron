export type UserRole = 'seeker' | 'employer' | 'admin' | 'moderator';

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
  /** Legal / registered name when distinct from display name. */
  legalName?: string;
  slug?: string;
  about?: string;
  logoUrl?: string;
  website?: string;
  verifiedEmailDomain?: string;
  industry?: string;
  sizeBand?: string;
  headquarters?: string;
  hiringLocations?: string[];
  verificationStatus:
    | 'unverified'
    | 'pending'
    | 'verified'
    | 'rejected'
    | 'suspended'
    | 'reverify_required';
  verificationNotes?: string;
  trustTier?: 'standard' | 'elevated' | 'restricted';
  riskFlags?: string[];
  workspaceSettings?: Record<string, unknown>;
  ownerUserId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SessionRecord {
  /** Stable session id for list / revoke APIs (never a raw token). */
  id: string;
  /** Short-lived access token (cookie / Bearer). */
  token: string;
  /** Long-lived refresh token (cookie or POST /v1/auth/refresh body). */
  refreshToken: string;
  userId: string;
  /**
   * Refresh-token family. Rotation keeps the same family; reuse of a retired
   * refresh revokes every session in the family.
   */
  familyId: string;
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
  /** Client IP at issue / last refresh (forensics + admin tracking). */
  ip?: string;
  /** User-Agent at issue / last refresh. */
  userAgent?: string;
  /** Last authenticated activity (ISO). */
  lastSeenAt?: string;
}

/** Client-safe session row — never includes access/refresh secrets. */
export interface PublicSession {
  id: string;
  createdAt: string;
  expiresAt: string;
  refreshExpiresAt: string;
  /** True when this row matches the caller's current access token. */
  current: boolean;
  ip?: string;
  userAgent?: string;
  lastSeenAt?: string;
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
  /** Preserve family across refresh rotation. */
  familyId?: string;
  ip?: string;
  userAgent?: string;
}
