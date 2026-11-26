/** Email category — drives templates, rate limits and compliance. */
export type EmailCategory =
  | 'otp'
  | 'verification'
  | 'recovery'
  | 'job_alert'
  | 'weekly_digest'
  | 'welcome'
  | 'application_update'
  | 'system';

/** Provider id — swap via EMAIL_PROVIDER env. */
export type EmailProviderId = 'stub' | 'console' | 'resend' | 'smtp';

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailMessage {
  to: EmailAddress | string;
  toName?: string;
  from?: EmailAddress;
  fromName?: string;
  replyTo?: EmailAddress;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  templateData?: Record<string, unknown>;
  tenantId?: string;
  category: EmailCategory;
  dedupeKey?: string;
  metadata?: Record<string, string>;
}

export interface EmailSendResult {
  ok: boolean;
  provider?: string;
  providerMessageId?: string;
  error?: string;
}

export interface EmailSenderConfig {
  tenantId: string;
  from: string;
  fromName: string;
  replyTo?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailRateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

export type OtpPurpose = 'signup' | 'login' | 'recovery' | 'verification';

export interface OtpRecord {
  id: string;
  email: string;
  code: string;
  purpose: OtpPurpose;
  expiresAt: string;
  attempts: number;
  verified: boolean;
  createdAt: string;
}

export interface EmailDeliveryLogEntry {
  id: string;
  to: string;
  subject: string;
  category: EmailCategory;
  provider: string;
  providerMessageId?: string;
  status: 'sent' | 'failed' | 'rejected' | 'suppressed';
  error?: string;
  tenantId?: string;
  createdAt: string;
}

/** Validation error thrown when an email is empty/invalid. */
export class EmptyEmailError extends Error {
  constructor(field: string) {
    super(`email_rejected_empty_${field}`);
    this.name = 'EmptyEmailError';
  }
}

export class InvalidEmailError extends Error {
  constructor(reason: string) {
    super(`email_rejected_invalid_${reason}`);
    this.name = 'InvalidEmailError';
  }
}

/**
 * Minimal queue contract used by EmailService so it never imports @nestjs/bullmq
 * directly (keeps the service unit-testable). NotificationQueueService satisfies
 * this structurally.
 */
export interface EmailQueue {
  readonly queuesActive: boolean;
  enqueueEmail(payload: {
    userId: string;
    title: string;
    body: string;
    data: Record<string, string>;
    jobId: string;
    baseDedupe: string;
    dispatchId?: string;
  }): Promise<boolean>;
}
