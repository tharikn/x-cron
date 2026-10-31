export type SocialNetwork =
  | 'x'
  | 'instagram'
  | 'youtube'
  | 'linkedin'
  | 'facebook'
  | 'whatsapp'
  | 'other';

export interface FooterBrand {
  name: string;
  productLabel: string;
  /** Short public blurb; no private contact details. */
  blurb: string;
}

export interface FooterAddress {
  id: string;
  label: string;
  /** Public office lines only — never phone/email/WhatsApp. */
  lines: string[];
  mapUrl?: string;
  sortOrder: number;
}

export interface FooterSocialLink {
  id: string;
  network: SocialNetwork;
  label: string;
  url: string;
  sortOrder: number;
}

export interface FooterQuickLink {
  id: string;
  label: string;
  /** App path (`/post`) or absolute https URL. */
  href: string;
  sortOrder: number;
}

export interface FooterLegalLink {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
}

export interface FooterHeadings {
  quickLinks: string;
  address: string;
  social: string;
}

/** Public site footer document (DB/store). */
export interface SiteFooterConfig {
  brand: FooterBrand;
  headings: FooterHeadings;
  addresses: FooterAddress[];
  socialLinks: FooterSocialLink[];
  quickLinks: FooterQuickLink[];
  legalLinks: FooterLegalLink[];
  copyright: string;
  updatedAt: string;
}

/** Global commerce settings (SiteConfig key `commerce`). */
export interface SiteCommerceConfig {
  /** Contact unlock price in paise (₹1 = 100). */
  unlockPricePaise: number;
  updatedAt: string;
}
