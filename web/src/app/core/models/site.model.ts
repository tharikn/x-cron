export type SocialNetwork =
  | 'x'
  | 'instagram'
  | 'youtube'
  | 'linkedin'
  | 'facebook'
  | 'whatsapp'
  | 'other';

export interface SiteFooterConfig {
  brand: {
    name: string;
    productLabel: string;
    blurb: string;
  };
  headings: {
    quickLinks: string;
    address: string;
    social: string;
  };
  addresses: Array<{
    id: string;
    label: string;
    lines: string[];
    mapUrl?: string;
    sortOrder: number;
  }>;
  socialLinks: Array<{
    id: string;
    network: SocialNetwork;
    label: string;
    url: string;
    sortOrder: number;
  }>;
  quickLinks: Array<{
    id: string;
    label: string;
    href: string;
    sortOrder: number;
  }>;
  legalLinks: Array<{
    id: string;
    label: string;
    href: string;
    sortOrder: number;
  }>;
  copyright: string;
  updatedAt: string;
}

export type PostJobPaymentMode = 'mandatory' | 'optional' | 'none';

/** Global commerce settings from SiteConfig key `commerce`. */
export interface SiteCommerceConfig {
  unlockPricePaise: number;
  unlockPriceInr: number;
  paymentsEnabled: boolean;
  postJobPaymentMode: PostJobPaymentMode;
  postJobPricePaise: number;
  postJobPriceInr: number;
  updatedAt: string;
}

/** Auth TTL settings from SiteConfig key `auth`. */
export interface SiteAuthConfig {
  sessionTtlDays: number;
  otpTtlMinutes: number;
  updatedAt: string;
}
