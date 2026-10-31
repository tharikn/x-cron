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

/** Global commerce settings from SiteConfig key `commerce`. */
export interface SiteCommerceConfig {
  unlockPricePaise: number;
  unlockPriceInr: number;
  updatedAt: string;
}
