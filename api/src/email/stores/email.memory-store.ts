import { randomUUID } from 'crypto';
import type {
  EmailRateLimitResult,
  EmailSenderConfig,
  OtpPurpose,
  OtpRecord,
} from '../types/email.types';
import { EmailStore } from './email.store';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export class EmailMemoryStore extends EmailStore {
  private readonly senderConfigs = new Map<string, EmailSenderConfig>();
  private readonly otps = new Map<string, OtpRecord>(); // key: email:purpose
  private readonly rateLimits = new Map<string, RateLimitBucket>();

  // ── Sender config ──────────────────────────────────────────────
  async getSenderConfig(tenantId: string): Promise<EmailSenderConfig | null> {
    return this.senderConfigs.get(tenantId) ?? null;
  }

  async setSenderConfig(config: EmailSenderConfig): Promise<void> {
    this.senderConfigs.set(config.tenantId, { ...config });
  }

  async listSenderConfigs(): Promise<EmailSenderConfig[]> {
    return [...this.senderConfigs.values()];
  }

  // ── OTP ─────────────────────────────────────────────────────────
  private otpKey(email: string, purpose: OtpPurpose): string {
    return `${email.trim().toLowerCase()}:${purpose}`;
  }

  async createOtp(email: string, purpose: OtpPurpose, ttlMinutes: number): Promise<OtpRecord> {
    const now = new Date();
    const record: OtpRecord = {
      id: `otp_${randomUUID().slice(0, 8)}`,
      email: email.trim().toLowerCase(),
      code: generateOtpCode(),
      purpose,
      expiresAt: new Date(now.getTime() + ttlMinutes * 60 * 1000).toISOString(),
      attempts: 0,
      verified: false,
      createdAt: now.toISOString(),
    };
    this.otps.set(this.otpKey(email, purpose), record);
    return { ...record };
  }

  async getOtp(email: string, purpose: OtpPurpose): Promise<OtpRecord | null> {
    const r = this.otps.get(this.otpKey(email, purpose));
    return r ? { ...r } : null;
  }

  async markOtpVerified(id: string): Promise<void> {
    for (const [key, rec] of this.otps) {
      if (rec.id === id) {
        this.otps.set(key, { ...rec, verified: true });
      }
    }
  }

  async incrementOtpAttempts(id: string): Promise<number> {
    for (const [key, rec] of this.otps) {
      if (rec.id === id) {
        const next = rec.attempts + 1;
        this.otps.set(key, { ...rec, attempts: next });
        return next;
      }
    }
    return 0;
  }

  async deleteOtp(id: string): Promise<void> {
    for (const [key, rec] of this.otps) {
      if (rec.id === id) this.otps.delete(key);
    }
  }

  // ── Rate limits ────────────────────────────────────────────────
  async checkRateLimit(key: string, limit: number, windowMs: number): Promise<EmailRateLimitResult> {
    const bucket = this.rateLimits.get(key);
    const now = Date.now();
    if (!bucket || bucket.resetAt <= now) {
      return { allowed: true, remaining: limit, resetAt: now + windowMs };
    }
    const remaining = Math.max(0, limit - bucket.count);
    return {
      allowed: bucket.count < limit,
      remaining,
      resetAt: bucket.resetAt,
      retryAfter: bucket.count >= limit ? bucket.resetAt - now : undefined,
    };
  }

  async recordRateLimit(key: string, windowMs: number): Promise<void> {
    const now = Date.now();
    const bucket = this.rateLimits.get(key);
    if (!bucket || bucket.resetAt <= now) {
      this.rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      bucket.count += 1;
    }
  }
}

function generateOtpCode(): string {
  // 6-digit numeric code
  const n = Math.floor(100000 + Math.random() * 900000);
  return String(n);
}
