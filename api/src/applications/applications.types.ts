/** Formal job application (ATS) — separate from seeker contact markers. */

import type { ApplyProfileSnapshot } from '../apply-profiles/apply-profiles.types';

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'interview'
  | 'offered'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export type ApplicationActorRole = 'seeker' | 'employer' | 'admin' | 'system';

export type ApplicationEventType =
  | 'applied'
  | 'status_changed'
  | 'viewed_by_employer'
  | 'note_added'
  | 'offer_issued'
  | 'withdrawn'
  | 'chat_message';

export interface JobApplication {
  id: string;
  jobId: string;
  employerId: string;
  seekerUserId: string;
  ownerUserId: string;
  status: ApplicationStatus;
  coverNote?: string;
  /** @deprecated unused for new applies — prefer applyProfileSnapshot */
  resumeUrl?: string;
  applyProfileId?: string;
  applyProfileSnapshot?: ApplyProfileSnapshot;
  seekerName?: string;
  seekerPhone?: string;
  seekerEmail?: string;
  /** Answer to the job's screeningQuestion when required. */
  screeningAnswer?: string;
  /** Snapshot at apply — employer “Likely spam” badge (not auto-reject). */
  likelySpam?: boolean;
  /** Machine codes e.g. high_velocity_1h / high_velocity_day. */
  spamReasons?: string[];
  /** Free-text offer / appointment letter summary when status is offered+. */
  offerLetterText?: string;
  /** First time an employer opened the application. */
  viewedAt?: string;
  /** Skills/experience fit % vs job at apply (0–100). */
  matchPercent?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  type: ApplicationEventType;
  fromStatus?: ApplicationStatus;
  toStatus?: ApplicationStatus;
  actorUserId?: string;
  actorRole: ApplicationActorRole;
  note?: string;
  meta?: Record<string, string | number | boolean | null>;
  /** ISO-8601 with hour precision (full datetime). */
  at: string;
}

export interface ApplicationMessage {
  id: string;
  applicationId: string;
  senderUserId: string;
  senderRole: 'seeker' | 'employer' | 'admin';
  body: string;
  createdAt: string;
}

/** Employer-driven transitions (seeker may only withdraw). */
export const EMPLOYER_TRANSITIONS: Record<
  ApplicationStatus,
  ApplicationStatus[]
> = {
  applied: ['under_review', 'shortlisted', 'interview', 'rejected'],
  under_review: ['shortlisted', 'interview', 'rejected', 'applied'],
  shortlisted: ['interview', 'offered', 'rejected', 'under_review'],
  interview: ['offered', 'shortlisted', 'rejected'],
  offered: ['hired', 'rejected'],
  hired: [],
  rejected: ['under_review', 'shortlisted'],
  withdrawn: [],
};

export const SEEKER_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> =
  {
    applied: ['withdrawn'],
    under_review: ['withdrawn'],
    shortlisted: ['withdrawn'],
    interview: ['withdrawn'],
    offered: ['withdrawn'],
    hired: [],
    rejected: [],
    withdrawn: [],
  };

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  under_review: 'Under review',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  offered: 'Offer / job letter',
  hired: 'Hired',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

/** Employer-facing labels for spamReasons codes. */
export const APPLICATION_SPAM_REASON_LABELS: Record<string, string> = {
  high_velocity_1h: 'High apply rate (1 hour)',
  high_velocity_day: 'High apply rate (today)',
};
