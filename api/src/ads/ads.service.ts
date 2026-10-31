import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { AuthStore } from '../auth/auth.store';
import { AuthUser } from '../auth/auth.types';
import { JobsMemoryStore } from '../jobs/jobs.memory-store';
import { OpsService } from '../ops/ops.service';
import { AdsStore } from './ads.store';
import {
  AdEventDto,
  PurchasePromotionDto,
  UpsertCreativeDto,
  UpsertPlacementDto,
} from './dto/ads.dto';
import { AdSlot, PromoPackageId } from './ads.types';

@Injectable()
export class AdsService {
  constructor(
    private readonly store: AdsStore,
    private readonly jobs: JobsMemoryStore,
    private readonly authStore: AuthStore,
    @Optional() private readonly ops?: OpsService,
  ) {}

  getSlot(slot: AdSlot, deviceId = 'anonymous', limit = 1) {
    this.store.expireDue();
    const placement = this.store.getPlacement(slot);
    if (!placement || !placement.enabled) {
      return {
        slot,
        label: 'Advertisement',
        items: [] as ReturnType<AdsService['toCreativeDto']>[],
      };
    }

    const creatives = this.store
      .listCreatives(slot)
      .filter((c) => c.active)
      .filter(
        (c) =>
          this.store.impressionCountToday(deviceId, c.id) <
          placement.frequencyCapPerDay,
      )
      .slice(0, Math.min(limit, placement.maxPerSession));

    return {
      slot,
      label: placement.label,
      items: creatives.map((c) => this.toCreativeDto(c, placement.label)),
    };
  }

  recordEvent(dto: AdEventDto) {
    const creative = this.store.getCreative(dto.creativeId);
    if (!creative || creative.slot !== dto.slot) {
      throw new NotFoundException('Creative not found for slot');
    }
    const event = this.store.addEvent({
      creativeId: dto.creativeId,
      slot: dto.slot,
      type: dto.type,
      deviceId: dto.deviceId,
    });
    this.ops?.recordAd(dto.type);
    return { ok: true, id: event.id, type: event.type };
  }

  listPackages() {
    return { items: this.store.listPackages() };
  }

  purchasePromotion(user: AuthUser, dto: PurchasePromotionDto) {
    const pkg = this.store.getPackage(dto.packageId as PromoPackageId);
    if (!pkg) throw new NotFoundException('Package not found');

    const job = this.jobs.findById(dto.jobId);
    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== 'published' && job.status !== 'needs-review') {
      throw new BadRequestException('Only active or pending jobs can be promoted');
    }
    if (
      job.ownerUserId &&
      job.ownerUserId !== user.id &&
      !user.roles.includes('admin')
    ) {
      throw new ForbiddenException('You can only promote your own jobs');
    }

    const employer = this.authStore.getEmployerByOwner(user.id);
    const startsAt = new Date();
    const endsAt = new Date(
      startsAt.getTime() + pkg.durationDays * 24 * 60 * 60 * 1000,
    );
    const promo = this.store.createPromotion({
      jobId: job.id,
      employerId: employer?.id ?? job.employerId,
      ownerUserId: user.id,
      packageId: pkg.id,
      status: 'active',
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      amountPaise: pkg.pricePaise,
    });
    this.ops?.recordPromotion();

    return {
      promotion: this.toPromoDto(promo, pkg.badge),
      checkout: {
        mode: 'stub' as const,
        amountPaise: pkg.pricePaise,
        currency: 'INR' as const,
        message: 'Promotion activated in stub mode (no live charge).',
      },
    };
  }

  myPromotions(user: AuthUser) {
    this.store.expireDue();
    return {
      items: this.store.listPromotionsForUser(user.id).map((p) => {
        const pkg = this.store.getPackage(p.packageId);
        return this.toPromoDto(p, pkg?.badge ?? 'Promoted');
      }),
    };
  }

  /** Active boost map for search ranking / badges. */
  activeBoosts(): Map<string, { badge: string; endsAt: string }> {
    this.store.expireDue();
    const map = new Map<string, { badge: string; endsAt: string }>();
    for (const promo of this.store.activePromotions()) {
      const pkg = this.store.getPackage(promo.packageId);
      const existing = map.get(promo.jobId);
      if (!existing || new Date(promo.endsAt) > new Date(existing.endsAt)) {
        map.set(promo.jobId, {
          badge: pkg?.badge ?? 'Promoted',
          endsAt: promo.endsAt,
        });
      }
    }
    return map;
  }

  adminListPlacements() {
    return { items: this.store.listPlacements() };
  }

  adminUpsertPlacement(slot: AdSlot, dto: UpsertPlacementDto) {
    return this.store.upsertPlacement({ slot, ...dto });
  }

  adminListCreatives() {
    return { items: this.store.listCreatives() };
  }

  adminUpsertCreative(dto: UpsertCreativeDto) {
    return this.store.saveCreative(dto);
  }

  stats() {
    return {
      ...this.store.eventStats(),
      activePromotions: this.store.activePromotions().length,
      packages: this.store.listPackages().length,
    };
  }

  private toCreativeDto(
    c: {
      id: string;
      slot: AdSlot;
      kind: string;
      advertiser: string;
      headline: string;
      body: string;
      ctaLabel: string;
      targetUrl: string;
      priority: number;
    },
    label: string,
  ) {
    return {
      id: c.id,
      slot: c.slot,
      kind: c.kind,
      advertiser: c.advertiser,
      headline: c.headline,
      body: c.body,
      ctaLabel: c.ctaLabel,
      targetUrl: c.targetUrl,
      priority: c.priority,
      label,
      labeled: true,
    };
  }

  private toPromoDto(
    p: {
      id: string;
      jobId: string;
      packageId: string;
      status: string;
      startsAt: string;
      endsAt: string;
      amountPaise: number;
      createdAt: string;
    },
    badge: string,
  ) {
    return {
      id: p.id,
      jobId: p.jobId,
      packageId: p.packageId,
      status: p.status,
      badge,
      startsAt: p.startsAt,
      endsAt: p.endsAt,
      amountPaise: p.amountPaise,
      createdAt: p.createdAt,
    };
  }
}
