import { PrismaService } from '../prisma/prisma.service';
import { AuthStore } from '../auth/auth.store';
import { JobsMemoryStore } from '../jobs/jobs.memory-store';
import { JobsStore } from '../jobs/jobs.store';
import { PreferencesService } from '../preferences/preferences.service';
import { EmailMemoryStore } from './stores/email.memory-store';
import { EmailStore } from './stores/email.store';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let store: EmailStore;
  let authStore: AuthStore;

  beforeEach(() => {
    process.env.AUTH_STORE = 'memory';
    process.env.JOBS_STORE = 'memory';
    process.env.AUTH_SINGLE_SESSION = '0';
    authStore = new AuthStore({} as PrismaService);
    const jobsStore = new JobsMemoryStore();
    jobsStore.onModuleInit();
    const prefs = new PreferencesService();
    store = new EmailMemoryStore();
    service = new EmailService(authStore, jobsStore as unknown as JobsStore, prefs, store);
  });

  it('rejects empty subject', async () => {
    await expect(
      service.send({ to: 'a@b.com', subject: '   ', text: 'hello', category: 'system' }),
    ).rejects.toThrow();
  });

  it('rejects empty body', async () => {
    await expect(
      service.send({ to: 'a@b.com', subject: 'hi', text: '   ', html: '   ', category: 'system' }),
    ).rejects.toThrow();
  });

  it('rejects missing recipient', async () => {
    await expect(
      service.send({ to: '', subject: 'hi', text: 'hello', category: 'system' }),
    ).rejects.toThrow();
  });

  it('rejects empty weekly digest', async () => {
    const result = await service.sendWeeklyDigest({ to: 'a@b.com', jobs: [] });
    expect(result.ok).toBe(false);
    expect(result.error).toBe('empty_digest_rejected');
  });

  it('sends otp and verifies wrong code fails', async () => {
    const send = await service.sendOtp({ email: 'user@example.com', purpose: 'signup' });
    expect(send.ok).toBe(true);
    expect(send.expiresAt).toBeTruthy();

    const wrong = await service.verifyOtp({ email: 'user@example.com', code: '000000', purpose: 'signup' });
    expect(wrong.ok).toBe(false);
  });

  it('rate limits otp', async () => {
    for (let i = 0; i < 3; i++) {
      await service.sendOtp({ email: 'rate@example.com', purpose: 'signup' });
    }
    const fourth = await service.sendOtp({ email: 'rate@example.com', purpose: 'signup' });
    expect(fourth.ok).toBe(false);
    expect(fourth.error).toContain('rate_limited');
  });

  it('verifies correct otp code', async () => {
    const rec = await store.createOtp('verify@example.com', 'signup', 10);
    const ok = await service.verifyOtp({ email: 'verify@example.com', code: rec.code, purpose: 'signup' });
    expect(ok.ok).toBe(true);
  });

  it('rejects unknown otp', async () => {
    const res = await service.verifyOtp({ email: 'exp@example.com', code: '123456', purpose: 'signup' });
    expect(res.ok).toBe(false);
    expect(res.reason).toBe('otp_not_found');
  });

  it('sends welcome email', async () => {
    const res = await service.sendWelcomeEmail({ to: 'a@b.com', recipientName: 'Alice' });
    expect(res.ok).toBe(true);
  });

  it('sends job alert email', async () => {
    const res = await service.sendJobAlertEmail({
      to: 'a@b.com',
      jobTitle: 'Engineer',
      employerName: 'Acme',
      city: 'Chennai',
      jobUrl: 'https://xcron.jobs/jobs/1',
    });
    expect(res.ok).toBe(true);
  });

  it('sends recovery email', async () => {
    const res = await service.sendRecoveryEmail({ email: 'a@b.com' });
    expect(res.ok).toBe(true);
  });

  it('sends verification email', async () => {
    const res = await service.sendVerificationEmail({ email: 'a@b.com' });
    expect(res.ok).toBe(true);
  });
});
