/**
 * Dynamic Portfolios — canonical JSON domain model (schema v1).
 *
 * JSON is the source of truth. HTML is always derived at render time.
 * The single exception is the allow-listed `custom-code` section, whose HTML,
 * CSS and JS are stored as opaque strings and are NEVER executed on the app
 * origin — they only ever render inside a sandboxed, opaque-origin frame.
 * See docs/dynamic-portfolios/26-CUSTOM-CODE-SANDBOX.md.
 */

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

export interface PortfolioPageSeo {
  title?: PortfolioLocalizedText;
  description?: PortfolioLocalizedText;
  imageUrl?: string;
}

export interface PortfolioPage {
  id: string;
  path: string;
  seo: PortfolioPageSeo;
  sections: PortfolioSection[];
}

export type PortfolioThemeMode = 'light' | 'dark' | 'system';
export type PortfolioRadius = 'sm' | 'md' | 'lg';
export type PortfolioDensity = 'compact' | 'comfortable';

export interface PortfolioThemeTokens {
  primary: string;
  accent: string;
  surface: string;
  text: string;
  fontHeading: string;
  fontBody: string;
  radius: PortfolioRadius;
  density: PortfolioDensity;
}

export interface PortfolioTheme {
  mode: PortfolioThemeMode;
  tokens: PortfolioThemeTokens;
}

export interface PortfolioNavItem {
  id: string;
  label: PortfolioLocalizedText;
  target: string;
}

export interface PortfolioSiteMeta {
  id: string;
  name: string;
  slug: string;
  defaultLocale: string;
  locales: string[];
  template: {
    id: string;
    version: string;
  };
}

export interface PortfolioDocument {
  schemaVersion: '1.0';
  site: PortfolioSiteMeta;
  theme: PortfolioTheme;
  navigation: PortfolioNavItem[];
  pages: PortfolioPage[];
}

export type PortfolioSiteStatus = 'draft' | 'published' | 'unpublished';

export interface PortfolioSiteRecord {
  id: string;
  ownerUserId: string;
  workspaceId: string;
  name: string;
  slug: string;
  status: PortfolioSiteStatus;
  document: PortfolioDocument;
  draftRevision: number;
  publishedVersionId: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioVersionRecord {
  id: string;
  siteId: string;
  workspaceId: string;
  versionNumber: number;
  document: PortfolioDocument;
  templateId: string;
  templateVersion: string;
  schemaVersion: string;
  checksum: string;
  createdAt: string;
  actorUserId: string;
  /** Set when the version was created by rolling back to an older snapshot. */
  sourceVersionId: string | null;
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

export interface PortfolioTemplateMeta {
  id: string;
  version: string;
  name: string;
  category: string;
  family: string;
  audience: string[];
  description: string;
  supportsDark: boolean;
  contentDensity: PortfolioDensity;
  previewGradient: string;
}

export interface PortfolioTemplateDefinition extends PortfolioTemplateMeta {
  theme: PortfolioTheme;
  /** Section blueprints used to seed a new site document. */
  sections: Array<{
    type: PortfolioSectionType;
    variant: string;
    props: Record<string, unknown>;
  }>;
}

export interface PortfolioMediaAsset {
  id: string;
  ownerUserId: string;
  url: string;
  kind: 'image';
  createdAt: string;
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
