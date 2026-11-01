import type { SiteAuthConfig } from './site.types';

/**
 * First-boot defaults only — used when Prisma `SiteConfig` key `auth` is missing.
 * Runtime TTLs come from DB (Settings UI → PUT /v1/admin/site/auth).
 */
export const SEED_AUTH: Omit<SiteAuthConfig, 'updatedAt'> = {
  sessionTtlDays: 30,
  otpTtlMinutes: 10,
};
