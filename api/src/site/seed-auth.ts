import type { SiteAuthConfig } from './site.types';

/**
 * First-boot defaults only — used when Prisma `SiteConfig` key `auth` is missing.
 * Runtime TTLs come from DB (Settings UI → PUT /v1/admin/site/auth).
 */
export const SEED_AUTH: Omit<SiteAuthConfig, 'updatedAt'> = {
  /** Refresh TTL — sliding on each /auth/refresh (long-lived mobile alerts). */
  sessionTtlDays: 90,
  otpTtlMinutes: 10,
};
