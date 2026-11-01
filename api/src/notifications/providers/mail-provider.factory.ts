import { MailStubProvider } from './mail.stub';
import { MailProvider } from './mail-provider';

export type MailProviderId = 'stub' | 'console' | 'smtp';

/**
 * Resolve mail adapter. Free-first: stub/console log only. `smtp` reserved for nodemailer.
 */
export function resolveMailProviderId(): MailProviderId {
  const raw = (process.env.MAIL_PROVIDER || 'stub').toLowerCase();
  if (raw === 'console') return 'console';
  if (raw === 'smtp') return 'smtp';
  return 'stub';
}

export function createMailProvider(
  id: MailProviderId = resolveMailProviderId(),
): MailProvider {
  switch (id) {
    case 'console':
      return new MailStubProvider('mail-console');
    case 'smtp':
      // Real SMTP adapter later (MAIL_SMTP_URL). Until then log-only stub.
      return new MailStubProvider('mail-smtp-stub');
    case 'stub':
    default:
      return new MailStubProvider('mail-stub');
  }
}
