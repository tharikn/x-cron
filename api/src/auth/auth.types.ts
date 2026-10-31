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
  token: string;
  userId: string;
  createdAt: string;
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
