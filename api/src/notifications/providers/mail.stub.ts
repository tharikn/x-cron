import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MailProvider, MailSendResult } from './mail-provider';

/**
 * Zero-cost mail adapter. Logs only — no network. Swap for SMTP/Resend later.
 */
export class MailStubProvider implements MailProvider {
  readonly name: string;
  private readonly logger = new Logger(MailStubProvider.name);

  constructor(name = 'mail-stub') {
    this.name = name;
  }

  async send(input: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    data?: Record<string, string>;
  }): Promise<MailSendResult> {
    if (!input.to?.includes('@')) {
      return { ok: false, error: 'missing_email' };
    }
    const providerMessageId = `${this.name}_${uuidv4().slice(0, 8)}`;
    this.logger.log(
      `Mail stub → to=${input.to} subject="${input.subject}" id=${providerMessageId}`,
    );
    return { ok: true, providerMessageId };
  }
}
