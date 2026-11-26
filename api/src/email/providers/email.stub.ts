import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EmailProvider } from './email-provider';
import type { EmailMessage, EmailSendResult } from '../types/email.types';

/**
 * Zero-cost mail adapter. Logs only — no network. Swap for Resend/SMTP later.
 */
export class EmailStubProvider implements EmailProvider {
  readonly name: string;
  private readonly logger = new Logger(EmailStubProvider.name);

  constructor(name = 'email-stub') {
    this.name = name;
  }

  async send(input: EmailMessage): Promise<EmailSendResult> {
    const to = this.resolveTo(input);
    if (!to) {
      return { ok: false, error: 'missing_email' };
    }
    const providerMessageId = `${this.name}_${randomUUID().slice(0, 8)}`;
    this.logger.log(
      `Email stub → to=${to} subject="${input.subject}" category=${input.category} id=${providerMessageId}`,
    );
    return { ok: true, provider: this.name, providerMessageId };
  }

  async verifySender(): Promise<boolean> {
    return true;
  }

  private resolveTo(input: EmailMessage): string {
    if (typeof input.to === 'string') return input.to;
    return input.to?.email ?? '';
  }
}
