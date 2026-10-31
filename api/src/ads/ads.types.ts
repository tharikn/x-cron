export type AdSlot =
  | 'discover_feed'
  | 'job_detail_footer'
  | 'web_home_rail';

export type AdKind = 'house' | 'third_party' | 'employer_promo';

export interface AdPlacement {
  slot: AdSlot;
  enabled: boolean;
  maxPerSession: number;
  frequencyCapPerDay: number;
  label: string;
}

export interface AdCreative {
  id: string;
  slot: AdSlot;
  kind: AdKind;
  advertiser: string;
  headline: string;
  body: string;
  ctaLabel: string;
  targetUrl: string;
  active: boolean;
  priority: number;
  createdAt: string;
}

export interface AdEvent {
  id: string;
  creativeId: string;
  slot: AdSlot;
  type: 'impression' | 'click';
  deviceId: string;
  createdAt: string;
}

export type PromoPackageId = 'featured_3d' | 'featured_7d' | 'featured_30d';

export interface PromoPackage {
  id: PromoPackageId;
  name: string;
  description: string;
  durationDays: number;
  pricePaise: number;
  badge: 'Featured' | 'Promoted';
}

export interface JobPromotion {
  id: string;
  jobId: string;
  employerId?: string;
  ownerUserId: string;
  packageId: PromoPackageId;
  status: 'active' | 'expired' | 'cancelled';
  startsAt: string;
  endsAt: string;
  createdAt: string;
  amountPaise: number;
}
