import { Injectable } from '@nestjs/common';
import type { UpdateAuthDto } from './dto/update-auth.dto';
import type { UpdateCommerceDto } from './dto/update-commerce.dto';
import type { UpdateFooterDto } from './dto/update-footer.dto';
import { SiteStore } from './site.store';
import type {
  SiteAuthConfig,
  SiteCommerceConfig,
  SiteFooterConfig,
} from './site.types';

@Injectable()
export class SiteService {
  constructor(private readonly store: SiteStore) {}

  getFooter(): SiteFooterConfig {
    return this.store.getFooter();
  }

  async updateFooter(dto: UpdateFooterDto): Promise<SiteFooterConfig> {
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

  getCommerce(): SiteCommerceConfig & {
    unlockPriceInr: number;
    postJobPriceInr: number;
  } {
    const doc = this.store.getCommerce();
    return {
      ...doc,
      unlockPriceInr: Math.round(doc.unlockPricePaise / 100),
      postJobPriceInr: Math.round(doc.postJobPricePaise / 100),
    };
  }

  async updateCommerce(dto: UpdateCommerceDto): Promise<
    SiteCommerceConfig & {
      unlockPriceInr: number;
      postJobPriceInr: number;
    }
  > {
    const postJobPriceInr =
      dto.postJobPriceInr === undefined
        ? Math.round(this.store.getCommerce().postJobPricePaise / 100)
        : dto.postJobPriceInr;
    const doc = await this.store.putCommerce({
      unlockPricePaise: dto.unlockPriceInr * 100,
      paymentsEnabled: dto.paymentsEnabled,
      postJobPaymentMode: dto.postJobPaymentMode,
      postJobPricePaise: postJobPriceInr * 100,
    });
    return {
      ...doc,
      unlockPriceInr: dto.unlockPriceInr,
      postJobPriceInr,
    };
  }

  getUnlockPricePaise(): number {
    return this.store.getUnlockPricePaise();
  }

  paymentsEnabled(): boolean {
    return this.store.paymentsEnabled();
  }

  getAuth(): SiteAuthConfig {
    return this.store.getAuth();
  }

  async updateAuth(dto: UpdateAuthDto): Promise<SiteAuthConfig> {
    return this.store.putAuth({
      sessionTtlDays: dto.sessionTtlDays,
      otpTtlMinutes: dto.otpTtlMinutes,
    });
  }
}
