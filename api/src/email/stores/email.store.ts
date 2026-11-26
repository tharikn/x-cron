import type { EmailRateLimitResult, EmailSenderConfig, OtpPurpose, OtpRecord } from '../types/email.types';

export abstract class EmailStore {
  // Sender config
  abstract getSenderConfig(tenantId: string): Promise<EmailSenderConfig | null>;
  abstract setSenderConfig(config: EmailSenderConfig): Promise<void>;
  abstract listSenderConfigs(): Promise<EmailSenderConfig[]>;

  // OTP
  abstract createOtp(email: string, purpose: OtpPurpose, ttlMinutes: number): Promise<OtpRecord>;
  abstract getOtp(email: string, purpose: OtpPurpose): Promise<OtpRecord | null>;
  abstract markOtpVerified(id: string): Promise<void>;
  abstract incrementOtpAttempts(id: string): Promise<number>;
  abstract deleteOtp(id: string): Promise<void>;

  // Rate limits
  abstract checkRateLimit(key: string, limit: number, windowMs: number): Promise<EmailRateLimitResult>;
  abstract recordRateLimit(key: string, windowMs: number): Promise<void>;
}
