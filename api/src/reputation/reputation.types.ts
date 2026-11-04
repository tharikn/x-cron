export type ReputationRole = 'seeker' | 'employer';

export type ReputationEventType =
  | 'apply_active'
  | 'apply_good_match'
  | 'apply_poor_match'
  | 'message_reply'
  | 'application_viewed'
  | 'status_advanced';

export interface ReputationScore {
  userId: string;
  role: ReputationRole;
  score: number;
  updatedAt: string;
}

export interface ReputationEvent {
  id: string;
  userId: string;
  role: ReputationRole;
  type: ReputationEventType;
  delta: number;
  scoreAfter: number;
  applicationId?: string;
  jobId?: string;
  matchPercent?: number;
  note?: string;
  createdAt: string;
}

export const REPUTATION_BASE = 50;
export const REPUTATION_MIN = 0;
export const REPUTATION_MAX = 100;

/** Soft daily caps so spam applies cannot inflate forever. */
export const REPUTATION_DELTAS: Record<
  ReputationEventType,
  { delta: number; dailyCap?: number }
> = {
  apply_active: { delta: 1, dailyCap: 3 },
  apply_good_match: { delta: 4, dailyCap: 8 },
  apply_poor_match: { delta: -5 },
  message_reply: { delta: 2, dailyCap: 6 },
  application_viewed: { delta: 1, dailyCap: 8 },
  status_advanced: { delta: 2, dailyCap: 8 },
};

export const REPUTATION_EVENT_LABELS: Record<ReputationEventType, string> = {
  apply_active: 'Active application',
  apply_good_match: 'Good role fit (≥50%)',
  apply_poor_match: 'Low role fit (<50%)',
  message_reply: 'Timely chat reply',
  application_viewed: 'Reviewed an applicant',
  status_advanced: 'Moved application forward',
};

export type ReputationBand = 'rising' | 'steady' | 'needs_care';

export function reputationBand(score: number): ReputationBand {
  if (score >= 70) return 'rising';
  if (score >= 50) return 'steady';
  return 'needs_care';
}

export function reputationBandLabel(band: ReputationBand): string {
  switch (band) {
    case 'rising':
      return 'Rising';
    case 'steady':
      return 'Steady';
    case 'needs_care':
      return 'Needs care';
  }
}

export function clampReputation(score: number): number {
  return Math.max(REPUTATION_MIN, Math.min(REPUTATION_MAX, Math.round(score)));
}
