import { Injectable, OnModuleInit } from '@nestjs/common';
import { SEED_COMMERCE } from './seed-commerce';
import { SEED_FOOTER } from './seed-footer';
import type { SiteCommerceConfig, SiteFooterConfig } from './site.types';

/**
 * In-memory site config (PRD public chrome + commerce).
 * Prisma `SiteConfig` is the durable shape; runtime still defaults to memory
 * like the rest of the MVP API.
 */
@Injectable()
export class SiteStore implements OnModuleInit {
  private footer!: SiteFooterConfig;
  private commerce!: SiteCommerceConfig;

  onModuleInit() {
    this.footer = {
      ...structuredClone(SEED_FOOTER),
      updatedAt: new Date().toISOString(),
    };
    this.commerce = {
      ...structuredClone(SEED_COMMERCE),
      updatedAt: new Date().toISOString(),
    };
  }

  getFooter(): SiteFooterConfig {
    return structuredClone(this.footer);
  }

  putFooter(next: Omit<SiteFooterConfig, 'updatedAt'>): SiteFooterConfig {
    this.footer = {
      ...structuredClone(next),
      updatedAt: new Date().toISOString(),
    };
    return this.getFooter();
  }

  getCommerce(): SiteCommerceConfig {
    return structuredClone(this.commerce);
  }

  putCommerce(
    next: Omit<SiteCommerceConfig, 'updatedAt'>,
  ): SiteCommerceConfig {
    this.commerce = {
      unlockPricePaise: next.unlockPricePaise,
      updatedAt: new Date().toISOString(),
    };
    return this.getCommerce();
  }

  getUnlockPricePaise(): number {
    return this.commerce.unlockPricePaise;
  }
}
