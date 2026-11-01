import type { SiteCommerceConfig } from './site.types';

/**
 * First-boot default only — used when Prisma `SiteConfig` key `commerce` is missing.
 * Runtime values come from DB (Settings UI → PUT /v1/admin/site/commerce).
 */
export const SEED_COMMERCE: Omit<SiteCommerceConfig, 'updatedAt'> = {
  unlockPricePaise: 500,
  paymentsEnabled: true,
  postJobPaymentMode: 'optional',
  postJobPricePaise: 500,
};
