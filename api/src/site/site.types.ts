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

/** How payment is offered on the post-job flow. */
export type PostJobPaymentMode = 'mandatory' | 'optional' | 'none';

/** Global commerce settings (SiteConfig key `commerce`). */
export interface SiteCommerceConfig {
  /** Contact unlock price in paise (₹1 = 100). */
  unlockPricePaise: number;
  /** Master switch — when false, no unlock/post payments are collected. */
  paymentsEnabled: boolean;
  /** Post-job checkout behavior when paymentsEnabled is true. */
  postJobPaymentMode: PostJobPaymentMode;
  /** Fee for posting a job (paise). Used when postJobPaymentMode is mandatory/optional. */
  postJobPricePaise: number;
  updatedAt: string;
}

/** Auth TTL settings (SiteConfig key `auth`). */
export interface SiteAuthConfig {
  /** Signed-in session lifetime in whole days. */
  sessionTtlDays: number;
  /** OTP challenge lifetime in whole minutes. */
  otpTtlMinutes: number;
  updatedAt: string;
}
