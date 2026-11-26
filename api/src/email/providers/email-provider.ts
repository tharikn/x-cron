import type { EmailMessage, EmailSendResult } from '../types/email.types';

/**
 * Email Strategy/Adapter. Swap stub → Resend → SMTP / SES without touching callers.
 */
export interface EmailProvider {
  readonly name: string;
  send(input: EmailMessage): Promise<EmailSendResult>;
  /** Optional: verify that a sender address is allowed (Resend domains). */
  verifySender?(input: { from: string; fromName?: string }): Promise<boolean>;
}
