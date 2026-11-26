import { EmailStubProvider } from './email.stub';
import { ResendEmailProvider } from './resend.provider';
import { EmailProvider } from './email-provider';
import type { EmailProviderId } from '../types/email.types';

export type { EmailProviderId };

/**
 * Resolve email adapter. Free-first: stub/console log only. `resend` uses the
 * Resend SDK when RESEND_API_KEY is set; otherwise falls back to stub so boot
 * never crashes. `smtp` reserved for nodemailer.
 */
export function resolveEmailProviderId(): EmailProviderId {
  const raw = (process.env.EMAIL_PROVIDER || 'stub').toLowerCase();
  if (raw === 'console') return 'console';
  if (raw === 'resend') return 'resend';
  if (raw === 'smtp') return 'smtp';
  return 'stub';
}

export function hasResendCredentials(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function createEmailProvider(
  id: EmailProviderId = resolveEmailProviderId(),
): EmailProvider {
  switch (id) {
    case 'console':
      return new EmailStubProvider('email-console');
    case 'resend':
      if (!hasResendCredentials()) {
        return new EmailStubProvider('email-resend-stub');
      }
      return new ResendEmailProvider(
        process.env.RESEND_API_KEY!.trim(),
        process.env.EMAIL_FROM?.trim(),
        process.env.EMAIL_FROM_NAME?.trim(),
      );
    case 'smtp':
      // Real SMTP adapter later (EMAIL_SMTP_URL). Until then log-only stub.
      return new EmailStubProvider('email-smtp-stub');
    case 'stub':
    default:
      return new EmailStubProvider('email-stub');
  }
}
