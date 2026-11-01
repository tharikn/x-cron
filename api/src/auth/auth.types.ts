export type UserRole = 'seeker' | 'employer' | 'admin';

export interface AuthUser {
  id: string;
  status: 'active' | 'disabled';
  preferredLocale: string;
  roles: UserRole[];
  phone?: string;
  email?: string;
  displayName?: string;
  createdAt: string;
}

export interface EmployerProfile {
  id: string;
  name: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  ownerUserId: string;
  createdAt: string;
}

export interface SessionRecord {
  /** Short-lived access token (Bearer). */
  token: string;
  /** Long-lived refresh token (POST /v1/auth/refresh only). */
  refreshToken: string;
  userId: string;
  createdAt: string;
  /** Access token expiry. */
  expiresAt: string;
  /** Refresh token expiry (SiteConfig sessionTtlDays). */
  refreshExpiresAt: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface OtpChallenge {
  id: string;
  channel: 'phone' | 'email';
  destination: string;
  code: string;
  intendedRole: UserRole;
  expiresAt: string;
  attempts: number;
}
