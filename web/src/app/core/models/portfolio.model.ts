/**
 * Dynamic Portfolios — client contracts mirrored from `api/src/portfolio`.
 * Keep in sync with the API schema (schemaVersion 1.0).
 */

import type { UploadedAsset } from './upload.model';

export type PortfolioLocalizedText = Record<string, string>;

export type PortfolioSectionType =
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'gallery'
  | 'testimonials'
  | 'contact'
  | 'cta'
  | 'custom-code';

export interface PortfolioSectionStyle {
  backgroundColor?: string;
  textColor?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textAlign?: 'left' | 'center' | 'right';
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
  borderTop?: string;
  borderBottom?: string;
  opacity?: string;
  maxWidth?: string;
}

export interface PortfolioSection {
  id: string;
  type: PortfolioSectionType;
  variant: string;
  hidden?: boolean;
  props: Record<string, unknown>;
  style?: PortfolioSectionStyle;
}

export interface PortfolioPage {
  id: string;
  path: string;
  seo: {
    title?: PortfolioLocalizedText;
    description?: PortfolioLocalizedText;
    imageUrl?: string;
  };
  sections: PortfolioSection[];
}

export type PortfolioThemeMode = 'light' | 'dark' | 'system';

export interface PortfolioTheme {
  mode: PortfolioThemeMode;
  tokens: {
    primary: string;
    accent: string;
    surface: string;
    text: string;
    fontHeading: string;
    fontBody: string;
    radius: 'sm' | 'md' | 'lg';
    density: 'compact' | 'comfortable';
  };
}

export interface PortfolioNavItem {
  id: string;
  label: PortfolioLocalizedText;
  target: string;
}

export interface PortfolioDocument {
  schemaVersion: '1.0';
  site: {
    id: string;
    name: string;
    slug: string;
    defaultLocale: string;
    locales: string[];
    template: { id: string; version: string };
  };
  theme: PortfolioTheme;
  navigation: PortfolioNavItem[];
  pages: PortfolioPage[];
}

export type PortfolioSiteStatus = 'draft' | 'published' | 'unpublished';

export interface PortfolioSiteSummary {
  id: string;
  name: string;
  slug: string;
  status: PortfolioSiteStatus;
  defaultLocale: string;
  locales: string[];
  template: { id: string; version: string };
  revision: number;
  publishedVersionId: string | null;
  publishedAt: string | null;
  publicPath: string;
  sectionCount: number;
  themeMode: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioTemplateSummary {
  id: string;
  version: string;
  name: string;
  category: string;
  family: string;
  audience: string[];
  description: string;
  supportsDark: boolean;
  contentDensity: 'compact' | 'comfortable';
  previewGradient: string;
  theme: PortfolioTheme;
  sections: Array<{
    type: PortfolioSectionType;
    variant: string;
    props: Record<string, unknown>;
  }>;
}

export type PortfolioPropFieldKind =
  | 'localizedText'
  | 'localizedTextarea'
  | 'url'
  | 'image'
  | 'text'
  | 'textList'
  | 'objectList'
  | 'code'
  | 'toggle'
  | 'number';

export interface PortfolioPropField {
  key: string;
  label: string;
  kind: PortfolioPropFieldKind;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  itemLabel?: string;
  itemFields?: PortfolioPropField[];
  min?: number;
  max?: number;
  defaultValue?: string;
}

export interface PortfolioComponentDefinition {
  type: PortfolioSectionType;
  label: string;
  description: string;
  variants: string[];
  defaultVariant: string;
  fields: PortfolioPropField[];
  accessibility: string[];
  supportsLocale: boolean;
  allowedChildren: PortfolioSectionType[];
}

export type PortfolioIssueSeverity = 'error' | 'warning' | 'suggestion';

export interface PortfolioValidationIssue {
  severity: PortfolioIssueSeverity;
  code: string;
  message: string;
  path?: string;
  sectionId?: string;
}

export interface PortfolioValidationResult {
  ok: boolean;
  errors: PortfolioValidationIssue[];
  warnings: PortfolioValidationIssue[];
  suggestions: PortfolioValidationIssue[];
}

export interface PortfolioVersionSummary {
  id: string;
  siteId: string;
  versionNumber: number;
  templateId: string;
  templateVersion: string;
  schemaVersion: string;
  checksum: string;
  createdAt: string;
  actorUserId: string;
  sourceVersionId: string | null;
  isLive: boolean;
}

export interface PortfolioDraftResponse {
  site: PortfolioSiteSummary;
  document: PortfolioDocument;
}

export interface PublicPortfolioResponse {
  site: PortfolioDocument['site'];
  theme: PortfolioTheme;
  navigation: PortfolioNavItem[];
  pages: PortfolioPage[];
  versionId: string;
  publishedAt: string;
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
    robots: string;
    ogImage: string;
    jsonLd: Record<string, unknown>;
  };
}

export interface PortfolioAnalyticsSummary {
  siteId: string;
  views: number;
  uniqueVisitors: number;
  contactClicks: number;
  outboundClicks: number;
  byPath: Array<{ path: string; views: number }>;
  byLocale: Array<{ locale: string; views: number }>;
  byReferrer: Array<{ referrer: string; views: number }>;
  updatedAt: string;
}

// ── Custom domain bindings (mirrors api/src/portfolio) ──────────────────────

export type PortfolioDomainStatus = 'pending' | 'verified' | 'rejected';

export type PortfolioDomainVerificationMethod = 'TXT' | 'CNAME';

export type PortfolioDomainTlsState = 'none' | 'provisioning' | 'active' | 'failed';

export interface PortfolioDomainChallenge {
  type: 'TXT' | 'CNAME';
  name: string;
  value?: string;
  target?: string;
}

export interface PortfolioDomainBinding {
  id: string;
  siteId: string;
  workspaceId: string;
  hostname: string;
  verificationMethod: PortfolioDomainVerificationMethod;
  status: PortfolioDomainStatus;
  challenge: PortfolioDomainChallenge | null;
  tlsState: PortfolioDomainTlsState;
  createdAt: string;
  updatedAt: string;
  verifiedAt: string | null;
}

export interface PortfolioDomainListResponse {
  items: PortfolioDomainBinding[];
}

export interface PortfolioAiGenerateInput {
  role: string;
  experience?: string;
  skills?: string[];
  tone?: 'professional' | 'creative' | 'minimal';
  locale?: string;
}

export interface PortfolioAiGenerateResult {
  headline: string;
  subheadline: string;
  bio: string;
  suggestedSkills: string[];
  aiGenerated: boolean;
}

export interface PortfolioMediaAsset {
  id: string;
  ownerUserId: string;
  url: string;
  kind: 'image';
  createdAt: string;
  storageAssetId?: string;
  upload?: UploadedAsset;
}

export function emptyLocalized(locale: string): PortfolioLocalizedText {
  return { [locale]: '' };
}

export function localizedValue(
  value: unknown,
  locale: string,
  fallbackLocale: string,
): string {
  if (!value || typeof value !== 'object') return '';
  const map = value as PortfolioLocalizedText;
  return (map[locale] ?? map[fallbackLocale] ?? '').trim();
}

export function sectionLabel(type: PortfolioSectionType): string {
  switch (type) {
    case 'hero':
      return 'Hero';
    case 'about':
      return 'About';
    case 'skills':
      return 'Skills';
    case 'projects':
      return 'Projects';
    case 'experience':
      return 'Experience';
    case 'education':
      return 'Education';
    case 'gallery':
      return 'Gallery';
    case 'testimonials':
      return 'Testimonials';
    case 'contact':
      return 'Contact';
    case 'cta':
      return 'Call to action';
    case 'custom-code':
      return 'Custom code';
    default:
      return type;
  }
}
