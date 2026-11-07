/** Trust & moderation domain — cases, reports, audit, suspensions. */

export type ModerationQueue =
  | 'employer_verification'
  | 'new_job_review'
  | 'reported_target'
  | 'suspected_duplicate'
  | 'suspicious_account'
  | 'appeal';

export type ModerationCaseStatus =
  | 'open'
  | 'in_review'
  | 'resolved'
  | 'dismissed';

export type ModerationTargetType = 'job' | 'employer' | 'user' | 'application';

export type ReportCategory =
  | 'spam'
  | 'scam'
  | 'misleading'
  | 'offensive'
  | 'duplicate'
  | 'payment_request'
  | 'impersonation'
  | 'other';

export type ModerationDecision =
  | 'approve'
  | 'reject'
  | 'remove'
  | 'suspend_user'
  | 'reactivate_user'
  | 'verify_company'
  | 'reject_company'
  | 'suspend_company'
  | 'uphold'
  | 'reinstate'
  | 'dismiss'
  | 'override_risk';

export type CasePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface ModerationCase {
  id: string;
  queue: ModerationQueue;
  status: ModerationCaseStatus;
  priority: CasePriority;
  targetType: ModerationTargetType;
  targetId: string;
  category?: ReportCategory | string;
  details?: string;
  evidenceJson: Record<string, unknown>;
  riskFlags: string[];
  riskScore: number;
  dismissedRiskFlags: string[];
  assigneeUserId?: string;
  slaAt?: string;
  decision?: ModerationDecision;
  reasonCode?: string;
  reason?: string;
  decidedByUserId?: string;
  decidedAt?: string;
  relatedCaseId?: string;
  feedbackThreadId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModerationReport {
  id: string;
  caseId: string;
  targetType: ModerationTargetType;
  targetId: string;
  category: ReportCategory;
  details: string;
  /** Staff-only — never expose to the reported party. */
  reporterUserId?: string;
  createdAt: string;
}

export interface TrustAuditEvent {
  id: string;
  actorId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  reason?: string;
  reasonCode?: string;
  correlationId?: string;
  beforeJson?: Record<string, unknown>;
  afterJson?: Record<string, unknown>;
  createdAt: string;
}

export interface AccountSuspension {
  id: string;
  userId: string;
  reasonCode: string;
  reason: string;
  startsAt: string;
  endsAt?: string;
  actorId: string;
  active: boolean;
  clearedAt?: string;
  clearedByUserId?: string;
  clearReason?: string;
  createdAt: string;
}

export interface ModerationConfig {
  reportAutoQueueThreshold: number;
  prohibitedPhrases: string[];
  brandImpersonationKeywords: string[];
  defaultSlaHours: Record<ModerationQueue, number>;
  rateLimitHints: {
    reportPerHour: number;
    note: string;
  };
}

export const DEFAULT_MODERATION_CONFIG: ModerationConfig = {
  reportAutoQueueThreshold: 3,
  prohibitedPhrases: [
    'pay registration fee',
    'send money',
    'whatsapp only hiring fee',
    'processing fee required',
  ],
  brandImpersonationKeywords: [
    'amazon recruiter',
    'google hr',
    'microsoft careers official',
    'flipkart hiring team',
  ],
  defaultSlaHours: {
    employer_verification: 48,
    new_job_review: 24,
    reported_target: 12,
    suspected_duplicate: 24,
    suspicious_account: 8,
    appeal: 72,
  },
  rateLimitHints: {
    reportPerHour: 10,
    note: 'Soft threshold; hard limits stay in security throttles.',
  },
};

export const REPORT_CATEGORIES: ReportCategory[] = [
  'spam',
  'scam',
  'misleading',
  'offensive',
  'duplicate',
  'payment_request',
  'impersonation',
  'other',
];

export const MODERATION_QUEUES: ModerationQueue[] = [
  'employer_verification',
  'new_job_review',
  'reported_target',
  'suspected_duplicate',
  'suspicious_account',
  'appeal',
];
