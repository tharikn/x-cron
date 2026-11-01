import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { AuthStore } from '../auth/auth.store';
import { PrismaService } from '../prisma/prisma.service';
import { SEED_AUTH } from './seed-auth';
import { SEED_COMMERCE } from './seed-commerce';
import { SEED_FOOTER } from './seed-footer';
import type {
  SiteAuthConfig,
  SiteCommerceConfig,
  SiteFooterConfig,
} from './site.types';

const KEY_FOOTER = 'footer';
const KEY_COMMERCE = 'commerce';
const KEY_AUTH = 'auth';

/**
 * Site config backed by Prisma `SiteConfig` (keys: footer / commerce / auth).
 * In-memory cache for sync reads; Settings UI writes persist across restarts.
 */
@Injectable()
export class SiteStore implements OnModuleInit {
  private readonly logger = new Logger(SiteStore.name);
  private footer!: SiteFooterConfig;
  private commerce!: SiteCommerceConfig;
  private auth!: SiteAuthConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly authStore: AuthStore,
  ) {}

  async onModuleInit() {
    this.footer = await this.loadOrSeedFooter();
    this.commerce = await this.loadOrSeedCommerce();
    this.auth = await this.loadOrSeedAuth();
    this.syncAuthTtls();
    this.logger.log(
      `SiteConfig loaded (commerce ₹${Math.round(this.commerce.unlockPricePaise / 100)})`,
    );
  }

  getFooter(): SiteFooterConfig {
    return structuredClone(this.footer);
  }

  async putFooter(
    next: Omit<SiteFooterConfig, 'updatedAt'>,
  ): Promise<SiteFooterConfig> {
    const value = structuredClone(next);
    const json = value as unknown as Prisma.InputJsonValue;
    const row = await this.prisma.siteConfig.upsert({
      where: { key: KEY_FOOTER },
      create: { key: KEY_FOOTER, value: json },
      update: { value: json },
    });
    this.footer = {
      ...value,
      updatedAt: row.updatedAt.toISOString(),
    };
    return this.getFooter();
  }

  getCommerce(): SiteCommerceConfig {
    return structuredClone(this.commerce);
  }

  async putCommerce(
    next: Omit<SiteCommerceConfig, 'updatedAt'>,
  ): Promise<SiteCommerceConfig> {
    const value = {
      unlockPricePaise: next.unlockPricePaise,
      paymentsEnabled: next.paymentsEnabled,
      postJobPaymentMode: next.postJobPaymentMode,
      postJobPricePaise: next.postJobPricePaise,
    };
    const row = await this.prisma.siteConfig.upsert({
      where: { key: KEY_COMMERCE },
      create: { key: KEY_COMMERCE, value },
      update: { value },
    });
    this.commerce = {
      ...value,
      updatedAt: row.updatedAt.toISOString(),
    };
    return this.getCommerce();
  }

  getUnlockPricePaise(): number {
    return this.commerce.unlockPricePaise;
  }

  paymentsEnabled(): boolean {
    return this.commerce.paymentsEnabled;
  }

  getAuth(): SiteAuthConfig {
    return structuredClone(this.auth);
  }

  async putAuth(
    next: Omit<SiteAuthConfig, 'updatedAt'>,
  ): Promise<SiteAuthConfig> {
    const value = {
      sessionTtlDays: next.sessionTtlDays,
      otpTtlMinutes: next.otpTtlMinutes,
    };
    const row = await this.prisma.siteConfig.upsert({
      where: { key: KEY_AUTH },
      create: { key: KEY_AUTH, value },
      update: { value },
    });
    this.auth = {
      ...value,
      updatedAt: row.updatedAt.toISOString(),
    };
    this.syncAuthTtls();
    return this.getAuth();
  }

  private async loadOrSeedFooter(): Promise<SiteFooterConfig> {
    const row = await this.prisma.siteConfig.findUnique({
      where: { key: KEY_FOOTER },
    });
    if (row) {
      const parsed = this.parseFooter(row.value);
      if (parsed) {
        return { ...parsed, updatedAt: row.updatedAt.toISOString() };
      }
    }
    const seed = structuredClone(SEED_FOOTER);
    const json = seed as unknown as Prisma.InputJsonValue;
    const created = await this.prisma.siteConfig.upsert({
      where: { key: KEY_FOOTER },
      create: { key: KEY_FOOTER, value: json },
      update: { value: json },
    });
    return { ...seed, updatedAt: created.updatedAt.toISOString() };
  }

  private async loadOrSeedCommerce(): Promise<SiteCommerceConfig> {
    const row = await this.prisma.siteConfig.findUnique({
      where: { key: KEY_COMMERCE },
    });
    if (row) {
      const parsed = this.parseCommerce(row.value);
      if (parsed) {
        return { ...parsed, updatedAt: row.updatedAt.toISOString() };
      }
    }
    const seed = { ...SEED_COMMERCE };
    const created = await this.prisma.siteConfig.upsert({
      where: { key: KEY_COMMERCE },
      create: { key: KEY_COMMERCE, value: seed },
      update: { value: seed },
    });
    return {
      ...seed,
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  private async loadOrSeedAuth(): Promise<SiteAuthConfig> {
    const row = await this.prisma.siteConfig.findUnique({
      where: { key: KEY_AUTH },
    });
    if (row) {
      const parsed = this.parseAuth(row.value);
      if (parsed) {
        return { ...parsed, updatedAt: row.updatedAt.toISOString() };
      }
    }
    const seed = {
      sessionTtlDays: SEED_AUTH.sessionTtlDays,
      otpTtlMinutes: SEED_AUTH.otpTtlMinutes,
    };
    const created = await this.prisma.siteConfig.upsert({
      where: { key: KEY_AUTH },
      create: { key: KEY_AUTH, value: seed },
      update: { value: seed },
    });
    return { ...seed, updatedAt: created.updatedAt.toISOString() };
  }

  private parseCommerce(
    value: Prisma.JsonValue,
  ): Omit<SiteCommerceConfig, 'updatedAt'> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const obj = value as Record<string, unknown>;
    const unlock = Number(obj.unlockPricePaise);
    if (!Number.isFinite(unlock) || unlock < 100) return null;
    const postFee = Number(obj.postJobPricePaise ?? SEED_COMMERCE.postJobPricePaise);
    const modeRaw = String(
      obj.postJobPaymentMode ?? SEED_COMMERCE.postJobPaymentMode,
    );
    const postJobPaymentMode =
      modeRaw === 'mandatory' || modeRaw === 'optional' || modeRaw === 'none'
        ? modeRaw
        : SEED_COMMERCE.postJobPaymentMode;
    return {
      unlockPricePaise: Math.round(unlock),
      paymentsEnabled:
        typeof obj.paymentsEnabled === 'boolean'
          ? obj.paymentsEnabled
          : SEED_COMMERCE.paymentsEnabled,
      postJobPaymentMode,
      postJobPricePaise:
        Number.isFinite(postFee) && postFee >= 0
          ? Math.round(postFee)
          : SEED_COMMERCE.postJobPricePaise,
    };
  }

  private parseAuth(
    value: Prisma.JsonValue,
  ): Omit<SiteAuthConfig, 'updatedAt'> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const obj = value as Record<string, unknown>;
    const sessionTtlDays = Number(obj.sessionTtlDays);
    const otpTtlMinutes = Number(obj.otpTtlMinutes);
    if (
      !Number.isFinite(sessionTtlDays) ||
      !Number.isFinite(otpTtlMinutes) ||
      sessionTtlDays < 1 ||
      sessionTtlDays > 365 ||
      otpTtlMinutes < 1 ||
      otpTtlMinutes > 60
    ) {
      return null;
    }
    return {
      sessionTtlDays: Math.round(sessionTtlDays),
      otpTtlMinutes: Math.round(otpTtlMinutes),
    };
  }

  private parseFooter(
    value: Prisma.JsonValue,
  ): Omit<SiteFooterConfig, 'updatedAt'> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const obj = value as Record<string, unknown>;
    if (!obj.brand || !obj.headings || !Array.isArray(obj.addresses)) {
      return null;
    }
    return structuredClone(obj) as Omit<SiteFooterConfig, 'updatedAt'>;
  }

  private syncAuthTtls() {
    this.authStore.setAuthTtls({
      sessionTtlDays: this.auth.sessionTtlDays,
      otpTtlMinutes: this.auth.otpTtlMinutes,
    });
  }
}
