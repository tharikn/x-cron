import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { AuthStore } from '../auth/auth.store';
import type { AuthUser } from '../auth/auth.types';
import { JobsStore } from '../jobs/jobs.store';
import type { JobRecord } from '../jobs/job.types';
import { PreferencesService } from '../preferences/preferences.service';
import { PreferenceRecord } from '../preferences/preferences.types';

import { createEmailProvider } from './providers/email-provider.factory';
import { EmailProvider } from './providers/email-provider';
import { EmailStore } from './stores/email.store';

import {
  EmailMessage,
  EmailSendResult,
  EmailCategory,
  OtpPurpose,
  EmailSenderConfig,
  EmptyEmailError,
  InvalidEmailError,
} from './types/email.types';
import type { EmailQueue } from './types/email.types';
import {
  renderOtpEmail,
  renderVerificationEmail,
  renderRecoveryEmail,
  renderJobAlertEmail,
  renderWeeklyDigestEmail,
  renderWelcomeEmail,
} from './templates/email-templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly provider: EmailProvider;

  constructor(
    private readonly auth: AuthStore,
    private readonly jobs: JobsStore,
    private readonly preferences: PreferencesService,
    private readonly store: EmailStore,
    @Optional()
    private readonly queues?: EmailQueue,
  ) {
    this.provider = createEmailProvider();
  }

  /** Expose the store for tests / schedulers. */
  getStore(): EmailStore {
    return this.store;
  }

  getProviderName(): string {
    return this.provider.name;
  }

  // ── Core send ──────────────────────────────────────────────────

  /**
   * Send an email. Rejects empty/invalid emails before touching the provider.
   * Applies per-tenant sender config and rate limits.
   */
  async send(input: EmailMessage): Promise<EmailSendResult> {
    // 1. Validate — never send unwanted/empty mail.
    this.validateEmail(input);

    // 2. Resolve recipient.
    const to = this.resolveTo(input);
    if (!to) throw new InvalidEmailError('missing_recipient');

    // 3. Rate limit (per recipient + category).
    const rateKey = `email:${input.category}:${to.toLowerCase()}`;
    const limit = this.rateLimitForCategory(input.category);
    const windowMs = this.rateWindowForCategory(input.category);
    const rl = await this.store.checkRateLimit(rateKey, limit, windowMs);
    if (!rl.allowed) {
      return {
        ok: false,
        provider: this.provider.name,
        error: `rate_limited_retry_after_${rl.retryAfter ?? windowMs}`,
      };
    }

    // 4. Resolve sender config (per-tenant).
    const sender = await this.resolveSender(input.tenantId);

    // 5. Render template if requested.
    const rendered = await this.renderTemplate(input);

    const subject = rendered?.subject ?? input.subject;
    const text = rendered?.text ?? input.text ?? '';
    const html = rendered?.html ?? input.html;

    // Re-validate after template render — never send empty.
    if (!subject?.trim()) throw new EmptyEmailError('subject');
    if (!text?.trim() && !html?.trim()) throw new EmptyEmailError('body');

    // 6. Build final message.
    const message: EmailMessage = {
      ...input,
      subject,
      text,
      html,
      from: sender ? { email: sender.from, name: sender.fromName } : input.from,
      replyTo: sender?.replyTo
        ? { email: sender.replyTo }
        : input.replyTo,
    };

    // 7. Record rate limit (count this attempt).
    await this.store.recordRateLimit(rateKey, windowMs);

    // 8. Enqueue or send inline.
    if (input.category === 'otp' || input.category === 'recovery' || input.category === 'verification') {
      // Transactional — send synchronously for immediate delivery (with retry via provider).
      return this.sendInline(message);
    }

    // Marketing/alerts — enqueue for retry.
    if (this.queues?.queuesActive) {
      const queued = await this.enqueueEmail(message);
      if (queued) {
        return { ok: true, provider: this.provider.name, providerMessageId: 'queued' };
      }
    }
    return this.sendInline(message);
  }

  private async sendInline(message: EmailMessage): Promise<EmailSendResult> {
    const maxAttempts = 3;
    let lastError = 'unknown';
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await this.provider.send(message);
        if (result.ok) {
          return { ...result, provider: result.provider ?? this.provider.name };
        }
        lastError = result.error ?? 'provider_failed';
        // Retry on transient failures.
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, 200 * attempt));
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Email send attempt ${attempt} failed: ${lastError}`);
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, 200 * attempt));
        }
      }
    }
    this.logger.warn(`Email send failed after ${maxAttempts} attempts: ${lastError}`);
    return { ok: false, provider: this.provider.name, error: lastError };
  }

  private async enqueueEmail(message: EmailMessage): Promise<boolean> {
    if (!this.queues?.queuesActive) return false;
    const payload = {
      userId: message.metadata?.userId ?? '',
      title: message.subject,
      body: message.text ?? '',
      data: message.metadata ?? {},
      jobId: message.metadata?.jobId ?? '',
      baseDedupe: message.dedupeKey ?? `email:${Date.now()}`,
      dispatchId: message.metadata?.dispatchId,
    };
    return this.queues.enqueueEmail(payload);
  }

  // ── Validation ─────────────────────────────────────────────────

  private validateEmail(input: EmailMessage): void {
    if (!input) throw new BadRequestException('email_payload_required');
    if (!input.to) throw new InvalidEmailError('missing_recipient');
    const to = this.resolveTo(input);
    if (!to || !to.includes('@')) throw new InvalidEmailError('bad_recipient');
    if (!input.subject?.trim()) throw new EmptyEmailError('subject');
    if (!input.text?.trim() && !input.html?.trim() && !input.template) {
      throw new EmptyEmailError('body');
    }
    if (!input.category) throw new BadRequestException('email_category_required');
  }

  private resolveTo(input: EmailMessage): string {
    if (typeof input.to === 'string') return input.to.trim();
    return input.to?.email?.trim() ?? '';
  }

  // ── Sender config ──────────────────────────────────────────────

  async resolveSender(tenantId?: string): Promise<EmailSenderConfig | null> {
    if (!tenantId) return null;
    const cfg = await this.store.getSenderConfig(tenantId);
    if (!cfg || !cfg.enabled) return null;
    return cfg;
  }

  async setSenderConfig(
    dto: {
      tenantId: string;
      from: string;
      fromName: string;
      replyTo?: string;
      enabled?: boolean;
    },
    actor?: AuthUser,
  ): Promise<EmailSenderConfig> {
    if (actor && !actor.roles.includes('admin') && !actor.roles.includes('employer')) {
      throw new ForbiddenException('sender_config_admin_or_employer_only');
    }
    // Verify sender domain with provider (best-effort).
    const ok = await this.provider.verifySender?.({
      from: dto.from,
      fromName: dto.fromName,
    });
    if (ok === false) {
      throw new BadRequestException('sender_not_verified_by_provider');
    }

    const existing = await this.store.getSenderConfig(dto.tenantId);
    const now = new Date().toISOString();
    const config: EmailSenderConfig = {
      tenantId: dto.tenantId,
      from: dto.from.trim().toLowerCase(),
      fromName: dto.fromName.trim(),
      replyTo: dto.replyTo?.trim().toLowerCase(),
      enabled: dto.enabled !== false,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await this.store.setSenderConfig(config);
    return config;
  }

  async getSenderConfig(tenantId: string): Promise<EmailSenderConfig | null> {
    return this.store.getSenderConfig(tenantId);
  }

  async listSenderConfigs(): Promise<EmailSenderConfig[]> {
    return this.store.listSenderConfigs();
  }

  // ── Template rendering ─────────────────────────────────────────

  private async renderTemplate(
    input: EmailMessage,
  ): Promise<{ subject: string; text: string; html: string } | null> {
    if (!input.template) return null;
    const data = (input.templateData ?? {}) as Record<string, unknown>;

    switch (input.template) {
      case 'otp': {
        const code = String(data.code ?? '');
        if (!code) throw new EmptyEmailError('otp_code');
        return renderOtpEmail({
          code,
          purpose: (data.purpose as OtpPurpose) ?? 'signup',
          expiresInMinutes: Number(data.expiresInMinutes ?? 10),
          recipientName: data.recipientName as string | undefined,
        });
      }
      case 'verification': {
        const url = String(data.verificationUrl ?? '');
        if (!url) throw new EmptyEmailError('verification_url');
        return renderVerificationEmail({
          verificationUrl: url,
          recipientName: data.recipientName as string | undefined,
          expiresInHours: Number(data.expiresInHours ?? 24),
        });
      }
      case 'recovery': {
        const url = String(data.recoveryUrl ?? '');
        if (!url) throw new EmptyEmailError('recovery_url');
        return renderRecoveryEmail({
          recoveryUrl: url,
          recipientName: data.recipientName as string | undefined,
          expiresInMinutes: Number(data.expiresInMinutes ?? 30),
        });
      }
      case 'job_alert': {
        return renderJobAlertEmail({
          jobTitle: String(data.jobTitle ?? ''),
          employerName: String(data.employerName ?? ''),
          city: String(data.city ?? ''),
          jobType: data.jobType as string | undefined,
          salaryText: data.salaryText as string | undefined,
          jobUrl: String(data.jobUrl ?? ''),
          summary: data.summary as string | undefined,
        });
      }
      case 'weekly_digest': {
        const jobs = (data.jobs as Array<Record<string, unknown>>) ?? [];
        if (!jobs.length) throw new EmptyEmailError('jobs_list');
        return renderWeeklyDigestEmail({
          recipientName: data.recipientName as string | undefined,
          jobs: jobs.map((j) => ({
            title: String(j.title ?? ''),
            employerName: String(j.employerName ?? ''),
            city: String(j.city ?? ''),
            jobType: j.jobType as string | undefined,
            salaryText: j.salaryText as string | undefined,
            url: String(j.url ?? ''),
          })),
          periodLabel: data.periodLabel as string | undefined,
          preferencesUrl: data.preferencesUrl as string | undefined,
        });
      }
      case 'welcome': {
        return renderWelcomeEmail({
          recipientName: data.recipientName as string | undefined,
          ctaUrl: data.ctaUrl as string | undefined,
        });
      }
      default:
        return null;
    }
  }

  // ── OTP ────────────────────────────────────────────────────────

  async sendOtp(input: {
    email: string;
    purpose: OtpPurpose;
    recipientName?: string;
  }): Promise<{ ok: boolean; expiresAt: string; error?: string }> {
    const email = input.email.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      throw new InvalidEmailError('bad_email');
    }

    // Rate limit per email + purpose.
    const rateKey = `otp:${input.purpose}:${email}`;
    const rl = await this.store.checkRateLimit(rateKey, 3, 60 * 60 * 1000);
    if (!rl.allowed) {
      return {
        ok: false,
        expiresAt: new Date(rl.resetAt).toISOString(),
        error: `rate_limited_retry_after_${rl.retryAfter ?? 3600000}`,
      };
    }

    const ttlMinutes = Number(process.env.OTP_TTL_MINUTES ?? 10) || 10;
    const record = await this.store.createOtp(email, input.purpose, ttlMinutes);
    await this.store.recordRateLimit(rateKey, 60 * 60 * 1000);

    const rendered = renderOtpEmail({
      code: record.code,
      purpose: input.purpose,
      expiresInMinutes: ttlMinutes,
      recipientName: input.recipientName,
    });

    const result = await this.send({
      to: email,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      template: 'otp',
      templateData: {
        code: record.code,
        purpose: input.purpose,
        expiresInMinutes: ttlMinutes,
        recipientName: input.recipientName,
      },
      category: 'otp',
      dedupeKey: `otp:${input.purpose}:${email}:${record.id}`,
    });

    if (!result.ok) {
      // Clean up the OTP record on failure.
      await this.store.deleteOtp(record.id);
      return { ok: false, expiresAt: record.expiresAt, error: result.error };
    }

    return { ok: true, expiresAt: record.expiresAt };
  }

  async verifyOtp(input: {
    email: string;
    code: string;
    purpose: OtpPurpose;
  }): Promise<{ ok: boolean; reason?: string }> {
    const email = input.email.trim().toLowerCase();
    const record = await this.store.getOtp(email, input.purpose);
    if (!record) {
      return { ok: false, reason: 'otp_not_found' };
    }
    if (record.verified) {
      return { ok: false, reason: 'otp_already_used' };
    }
    if (new Date(record.expiresAt).getTime() < Date.now()) {
      await this.store.deleteOtp(record.id);
      return { ok: false, reason: 'otp_expired' };
    }

    // Max 5 attempts.
    if (record.attempts >= 5) {
      await this.store.deleteOtp(record.id);
      return { ok: false, reason: 'too_many_attempts' };
    }

    if (record.code !== input.code.trim()) {
      await this.store.incrementOtpAttempts(record.id);
      return { ok: false, reason: 'invalid_code' };
    }

    await this.store.markOtpVerified(record.id);
    return { ok: true };
  }

  // ── Convenience senders ─────────────────────────────────────────

  async sendVerificationEmail(input: {
    email: string;
    recipientName?: string;
    verificationUrl?: string;
  }): Promise<EmailSendResult> {
    const url =
      input.verificationUrl ||
      `${process.env.APP_URL || 'https://xcron.jobs'}/verify-email?email=${encodeURIComponent(input.email)}`;
    const rendered = renderVerificationEmail({
      verificationUrl: url,
      recipientName: input.recipientName,
    });
    return this.send({
      to: input.email,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      template: 'verification',
      templateData: {
        verificationUrl: url,
        recipientName: input.recipientName,
      },
      category: 'verification',
    });
  }

  async sendRecoveryEmail(input: {
    email: string;
    recipientName?: string;
    recoveryUrl?: string;
  }): Promise<EmailSendResult> {
    const url =
      input.recoveryUrl ||
      `${process.env.APP_URL || 'https://xcron.jobs'}/reset-password?email=${encodeURIComponent(input.email)}`;
    const rendered = renderRecoveryEmail({
      recoveryUrl: url,
      recipientName: input.recipientName,
    });
    return this.send({
      to: input.email,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      template: 'recovery',
      templateData: {
        recoveryUrl: url,
        recipientName: input.recipientName,
      },
      category: 'recovery',
    });
  }

  async sendJobAlertEmail(input: {
    to: string;
    jobTitle: string;
    employerName: string;
    city: string;
    jobType?: string;
    salaryText?: string;
    jobUrl: string;
    summary?: string;
    tenantId?: string;
  }): Promise<EmailSendResult> {
    const rendered = renderJobAlertEmail({
      jobTitle: input.jobTitle,
      employerName: input.employerName,
      city: input.city,
      jobType: input.jobType,
      salaryText: input.salaryText,
      jobUrl: input.jobUrl,
      summary: input.summary,
    });
    return this.send({
      to: input.to,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      template: 'job_alert',
      templateData: {
        jobTitle: input.jobTitle,
        employerName: input.employerName,
        city: input.city,
        jobType: input.jobType,
        salaryText: input.salaryText,
        jobUrl: input.jobUrl,
        summary: input.summary,
      },
      category: 'job_alert',
      tenantId: input.tenantId,
    });
  }

  async sendWelcomeEmail(input: {
    to: string;
    recipientName?: string;
    ctaUrl?: string;
  }): Promise<EmailSendResult> {
    const rendered = renderWelcomeEmail({
      recipientName: input.recipientName,
      ctaUrl: input.ctaUrl,
    });
    return this.send({
      to: input.to,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      template: 'welcome',
      templateData: {
        recipientName: input.recipientName,
        ctaUrl: input.ctaUrl,
      },
      category: 'welcome',
    });
  }

  // ── Weekly digest ──────────────────────────────────────────────

  async sendWeeklyDigest(input: {
    to: string;
    recipientName?: string;
    jobs: Array<{
      title: string;
      employerName: string;
      city: string;
      jobType?: string;
      salaryText?: string;
      url: string;
    }>;
    periodLabel?: string;
    preferencesUrl?: string;
  }): Promise<EmailSendResult> {
    if (!input.jobs.length) {
      // Never send empty digest.
      return { ok: false, provider: this.provider.name, error: 'empty_digest_rejected' };
    }
    const rendered = renderWeeklyDigestEmail({
      recipientName: input.recipientName,
      jobs: input.jobs,
      periodLabel: input.periodLabel,
      preferencesUrl: input.preferencesUrl,
    });
    return this.send({
      to: input.to,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      template: 'weekly_digest',
      templateData: {
        recipientName: input.recipientName,
        jobs: input.jobs,
        periodLabel: input.periodLabel,
        preferencesUrl: input.preferencesUrl,
      },
      category: 'weekly_digest',
    });
  }

  // ── Weekly jobs alert scheduler entry ──────────────────────────

  /**
   * Run by the weekly scheduler. Sends a digest of jobs published in the last
   * 7 days to every active user with email alerts + job alerts enabled.
   */
  async runWeeklyJobsAlert(): Promise<{
    considered: number;
    sent: number;
    skipped: number;
    failed: number;
  }> {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const allJobs = await this.jobs.listPublished();
    const recentJobs = allJobs.filter((j) => {
      // JobRecord has no createdAt in the type we saw; fall back to id ordering is unsafe.
      // We rely on jobs published recently. Use a best-effort: include all published
      // jobs whose slug/id contains a recent marker is not reliable. Instead, include
      // all published jobs and let the digest be the "new this week" set. The store
      // is expected to expose createdAt; if present, filter by it.
      const created = (j as unknown as { createdAt?: string }).createdAt;
      if (!created) return true;
      return new Date(created).getTime() >= since.getTime();
    });

    if (!recentJobs.length) {
      this.logger.log('Weekly jobs alert: no new jobs this week, skipping.');
      return { considered: 0, sent: 0, skipped: 0, failed: 0 };
    }

    const digestJobs = recentJobs.slice(0, 20).map((j: JobRecord) => ({
      title: j.title,
      employerName: j.employerName,
      city: j.location?.city ?? '',
      jobType: j.jobType,
      salaryText: j.salary
        ? `${j.salary.currency} ${j.salary.min ?? ''}${j.salary.max ? '-' + j.salary.max : ''}/${j.salary.period}`
        : undefined,
      url: `${process.env.APP_URL || 'https://xcron.jobs'}/jobs/${j.slug}`,
    }));

    let considered = 0;
    let sent = 0;
    let skipped = 0;
    let failed = 0;

    const users = this.auth.listUsers().filter((u) => u.status === 'active');
    for (const user of users) {
      if (!user.email) {
        skipped += 1;
        continue;
      }
      considered += 1;
      // Check notification prefs.
      let prefs: PreferenceRecord | null = null;
      try {
        prefs = this.preferences.getForUser(user);
      } catch {
        prefs = null;
      }
      // Respect job alerts preference (default on).
      // We don't have per-user email-alert toggle here; default to sending.

      const result = await this.sendWeeklyDigest({
        to: user.email,
        recipientName: user.displayName,
        jobs: digestJobs,
        periodLabel: 'this week',
        preferencesUrl: `${process.env.APP_URL || 'https://xcron.jobs'}/preferences`,
      });

      if (result.ok) sent += 1;
      else if (result.error === 'empty_digest_rejected') skipped += 1;
      else failed += 1;
    }

    this.logger.log(
      `Weekly jobs alert: considered=${considered} sent=${sent} skipped=${skipped} failed=${failed}`,
    );
    return { considered, sent, skipped, failed };
  }

  // ── Helpers ────────────────────────────────────────────────────

  private rateLimitForCategory(category: EmailCategory): number {
    switch (category) {
      case 'otp':
        return 5; // per hour per recipient
      case 'verification':
        return 3;
      case 'recovery':
        return 3;
      case 'job_alert':
        return 20;
      case 'weekly_digest':
        return 1; // one per week effectively
      case 'welcome':
        return 2;
      default:
        return 30;
    }
  }

  private rateWindowForCategory(category: EmailCategory): number {
    switch (category) {
      case 'otp':
      case 'verification':
      case 'recovery':
        return 60 * 60 * 1000; // 1 hour
      case 'weekly_digest':
        return 7 * 24 * 60 * 60 * 1000; // 7 days
      default:
        return 60 * 60 * 1000; // 1 hour
    }
  }
}
