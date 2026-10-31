import type { SiteCommerceConfig } from './site.types';

/** Default contact unlock pricing — mirrors Prisma SiteConfig key `commerce`. */
export const SEED_COMMERCE: Omit<SiteCommerceConfig, 'updatedAt'> = {
  unlockPricePaise: Number(process.env.UNLOCK_PRICE_PAISE ?? 500),
};
