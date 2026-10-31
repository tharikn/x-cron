import { Injectable } from '@nestjs/common';
import type { UpdateCommerceDto } from './dto/update-commerce.dto';
import type { UpdateFooterDto } from './dto/update-footer.dto';
import { SiteStore } from './site.store';
import type { SiteCommerceConfig, SiteFooterConfig } from './site.types';

@Injectable()
export class SiteService {
  constructor(private readonly store: SiteStore) {}

  getFooter(): SiteFooterConfig {
    return this.store.getFooter();
  }

  updateFooter(dto: UpdateFooterDto): SiteFooterConfig {
    return this.store.putFooter({
      brand: dto.brand,
      headings: dto.headings,
      addresses: dto.addresses,
      socialLinks: dto.socialLinks,
      quickLinks: dto.quickLinks,
      legalLinks: dto.legalLinks ?? [],
      copyright: dto.copyright,
    });
  }

  getCommerce(): SiteCommerceConfig & { unlockPriceInr: number } {
    const doc = this.store.getCommerce();
    return {
      ...doc,
      unlockPriceInr: Math.round(doc.unlockPricePaise / 100),
    };
  }

  updateCommerce(dto: UpdateCommerceDto): SiteCommerceConfig & {
    unlockPriceInr: number;
  } {
    const doc = this.store.putCommerce({
      unlockPricePaise: dto.unlockPriceInr * 100,
    });
    return {
      ...doc,
      unlockPriceInr: dto.unlockPriceInr,
    };
  }

  getUnlockPricePaise(): number {
    return this.store.getUnlockPricePaise();
  }
}
