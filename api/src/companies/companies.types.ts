/** Company = Employer workspace (legacy clients still call it employer). */

export type CompanyVerificationStatus =
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'suspended'
  | 'reverify_required';

export type CompanyMemberRole =
  | 'owner'
  | 'admin'
  | 'recruiter'
  | 'hiring_manager'
  | 'viewer';

export type CompanyMemberStatus = 'invited' | 'active' | 'revoked';

export type CompanyInviteRole = Exclude<CompanyMemberRole, 'owner'>;

export type CompanyTrustTier = 'standard' | 'elevated' | 'restricted';

export interface CompanyWorkspaceSettings {
  notifyOnNewApplication?: boolean;
  notifyOnUnreviewedReminder?: boolean;
  defaultPipelineFilter?: string;
  [key: string]: unknown;
}

export interface CompanyProfile {
  id: string;
  name: string;
  legalName?: string;
  slug?: string;
  about?: string;
  logoUrl?: string;
  website?: string;
  verifiedEmailDomain?: string;
  industry?: string;
  sizeBand?: string;
  headquarters?: string;
  hiringLocations: string[];
  verificationStatus: CompanyVerificationStatus;
  verificationNotes?: string;
  trustTier: CompanyTrustTier;
  riskFlags: string[];
  workspaceSettings: CompanyWorkspaceSettings;
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
}

/** Public DTO — never includes trustTier, riskFlags, verificationNotes, evidence. */
export interface PublicCompanyDto {
  id: string;
  name: string;
  slug?: string;
  about?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  sizeBand?: string;
  headquarters?: string;
  hiringLocations: string[];
  verified: boolean;
  verificationStatus: CompanyVerificationStatus;
}

export interface CompanyMember {
  id: string;
  employerId: string;
  userId: string;
  role: CompanyMemberRole;
  status: CompanyMemberStatus;
  invitedByUserId?: string;
  joinedAt?: string;
  revokedAt?: string;
  savedFilters: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyMemberDto extends CompanyMember {
  displayName?: string;
  username?: string;
  email?: string;
}

export interface CompanyInvitation {
  id: string;
  employerId: string;
  email: string;
  role: CompanyInviteRole;
  token: string;
  invitedByUserId: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  expiresAt: string;
  acceptedAt?: string;
  revokedAt?: string;
  createdAt: string;
}

export interface VerificationEvidence {
  id: string;
  employerId: string;
  kind: 'domain_email' | 'business_registration' | 'website' | 'other';
  label: string;
  reference: string;
  submittedBy: string;
  createdAt: string;
}

export interface VerificationAudit {
  id: string;
  employerId: string;
  actorUserId: string;
  action: string;
  detail: string;
  createdAt: string;
}

export interface CompanyInternalNote {
  id: string;
  employerId: string;
  applicationId?: string;
  body: string;
  authorUserId: string;
  createdAt: string;
}

export interface CompanyInterview {
  id: string;
  employerId: string;
  applicationId: string;
  scheduledAt: string;
  mode: 'video' | 'phone' | 'in_person';
  locationOrLink: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecruiterDashboard {
  company: PublicCompanyDto & {
    verificationStatus: CompanyVerificationStatus;
    memberRole: CompanyMemberRole | 'admin_bypass';
  };
  jobs: {
    total: number;
    byStatus: Record<string, number>;
  };
  applicants: {
    total: number;
    unreviewed: number;
    byStatus: Record<string, number>;
  };
  responseQuality: {
    /** Median hours to first employer view (null when n < 3). */
    medianFirstViewHours: number | null;
    /** Share of applications viewed within 48h. */
    viewedWithin48hPct: number | null;
    /** Soft indicator — never a guaranteed SLA. */
    indicator: 'usually_responds' | 'actively_reviewing' | 'building' | null;
    unreviewedReminderCount: number;
  };
  upcomingInterviews: CompanyInterview[];
  membersActive: number;
}

export const MEMBER_ROLE_RANK: Record<CompanyMemberRole, number> = {
  owner: 50,
  admin: 40,
  recruiter: 30,
  hiring_manager: 20,
  viewer: 10,
};

/** Capabilities gated by active membership role. */
export function roleCan(
  role: CompanyMemberRole | 'admin_bypass',
  action:
    | 'read'
    | 'manage_jobs'
    | 'review_applicants'
    | 'internal_notes'
    | 'schedule_interview'
    | 'manage_team'
    | 'manage_company'
    | 'submit_verification'
    | 'transfer_ownership',
): boolean {
  if (role === 'admin_bypass') return true;
  switch (action) {
    case 'read':
      return true;
    case 'review_applicants':
    case 'internal_notes':
    case 'schedule_interview':
      return (
        role === 'owner' ||
        role === 'admin' ||
        role === 'recruiter' ||
        role === 'hiring_manager'
      );
    case 'manage_jobs':
      return role === 'owner' || role === 'admin' || role === 'recruiter';
    case 'manage_team':
    case 'manage_company':
    case 'submit_verification':
      return role === 'owner' || role === 'admin';
    case 'transfer_ownership':
      return role === 'owner';
    default:
      return false;
  }
}
