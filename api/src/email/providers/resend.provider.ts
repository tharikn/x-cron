import { Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { EmailProvider } from './email-provider';
import type { EmailMessage, EmailSendResult } from '../types/email.types';

/**
 * Resend-backed email provider. Free-first: only sends when RESEND_API_KEY is set;
 * otherwise the factory falls back to the stub so boot never crashes.
 *
 * Docs: https://resend.com/docs
 */
export class ResendEmailProvider implements EmailProvider {
  readonly name = 'email-resend';
  private readonly logger = new Logger(ResendEmailProvider.name);
  private readonly client: Resend;
  private readonly defaultFrom: string;
  private readonly defaultFromName: string;

  constructor(apiKey: string, defaultFrom?: string, defaultFromName?: string) {
    this.client = new Resend(apiKey);
    this.defaultFrom = defaultFrom?.trim() || 'onboarding@resend.dev';
    this.defaultFromName = defaultFromName?.trim() || 'X Cron Jobs';
  }

  async send(input: EmailMessage): Promise<EmailSendResult> {
    const to = this.resolveTo(input);
    if (!to) {
      return { ok: false, provider: this.name, error: 'missing_email' };
    }

    const fromAddress = this.resolveFrom(input);
    const from = input.fromName || input.from?.name
      ? `${input.fromName || input.from?.name} <${fromAddress}>`
      : fromAddress;

    const payload: Record<string, unknown> = {
      from,
      to: [to],
      subject: input.subject,
    };
    if (input.text) payload.text = input.text;
    if (input.html) payload.html = input.html;
    if (input.replyTo) {
      payload.replyTo = input.replyTo.email;
    }

    try {
      const { data, error } = await this.client.emails.send(payload as never);
      if (error) {
        this.logger.warn(
          `Resend send failed to=${to} subject="${input.subject}": ${error.message}`,
        );
        return { ok: false, provider: this.name, error: error.message };
      }
      return {
        ok: true,
        provider: this.name,
        providerMessageId: data?.id,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Resend send threw to=${to}: ${message}`);
      return { ok: false, provider: this.name, error: message };
    }
  }

  async verifySender(input: { from: string; fromName?: string }): Promise<boolean> {
    // Resend verifies domains via dashboard; we just sanity-check the address shape.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.from);
  }

  private resolveTo(input: EmailMessage): string {
    if (typeof input.to === 'string') return input.to.trim();
    return input.to?.email?.trim() ?? '';
  }

  private resolveFrom(input: EmailMessage): string {
    if (input.from?.email) return input.from.email;
    if (input.fromName && input.fromName.includes('@')) return input.fromName;
    return this.defaultFrom;
  }
}
