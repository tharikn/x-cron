/** Feedback hub: FAQ catalog + Contact Admin messenger (seeker/employer ↔ admin). */

export type FeedbackAudience = 'seeker' | 'employer';

export type FeedbackCategory =
  | 'question'
  | 'bug'
  | 'suggestion'
  | 'account'
  | 'other';

export type FeedbackThreadStatus =
  | 'open'
  | 'awaiting_admin'
  | 'awaiting_user'
  | 'closed';

export type FeedbackSenderRole = 'seeker' | 'employer' | 'admin';

export interface FaqItem {
  id: string;
  category: FeedbackCategory | 'general' | 'recruiter' | 'seeker';
  question: string;
  answer: string;
  sortOrder: number;
  /** Optional locale overrides — clients fall back to `question`/`answer`. */
  locales?: Partial<
    Record<'en' | 'ta' | 'hi', { question: string; answer: string }>
  >;
}

export interface FeedbackThread {
  id: string;
  userId: string;
  audience: FeedbackAudience;
  category: FeedbackCategory;
  subject: string;
  status: FeedbackThreadStatus;
  lastMessageAt: string;
  lastSenderRole: FeedbackSenderRole;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface FeedbackMessage {
  id: string;
  threadId: string;
  senderUserId: string;
  senderRole: FeedbackSenderRole;
  body: string;
  createdAt: string;
}

export const FEEDBACK_CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  question: 'Question',
  bug: 'Bug report',
  suggestion: 'Suggestion',
  account: 'Account',
  other: 'Other',
};

export const FEEDBACK_STATUS_LABELS: Record<FeedbackThreadStatus, string> = {
  open: 'Open',
  awaiting_admin: 'Waiting for admin',
  awaiting_user: 'Waiting for you',
  closed: 'Closed',
};
