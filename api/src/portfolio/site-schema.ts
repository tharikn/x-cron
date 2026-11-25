import {
  getComponentDefinition,
  isKnownSectionType,
  type PortfolioPropField,
} from './component-registry';
import {
  isHexColor,
  PORTFOLIO_DENSITIES,
  PORTFOLIO_FONT_IDS,
  PORTFOLIO_RADII,
  PORTFOLIO_THEME_MODES,
} from './design-tokens';
import { findTemplate } from './templates/template-catalog';
import type {
  PortfolioDocument,
  PortfolioLocalizedText,
  PortfolioNavItem,
  PortfolioPage,
  PortfolioSection,
  PortfolioSectionStyle,
  PortfolioTheme,
  PortfolioThemeTokens,
  PortfolioValidationIssue,
} from './portfolio.types';

/** Slugs that would collide with platform routes or impersonate X Cron. */
const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'app',
  'portfolio',
  'p',
  'www',
  'mail',
  'support',
  'help',
  'login',
  'signin',
  'signup',
  'static',
  'assets',
  'jobs',
  'auth',
  'account',
  'settings',
  'me',
  'public',
  'status',
  'docs',
  'blog',
  'xcron',
  'x-cron',
]);

const LOCALE_RE = /^[a-z]{2,3}(-[a-z0-9]{2,8})?$/i;
const MAX_LOCALES = 10;
const MAX_PAGES = 10;
const MAX_SECTIONS_PER_PAGE = 40;
const MAX_LIST_ITEMS = 30;
const MAX_NAV_ITEMS = 12;

export function normalizeLocaleCode(value: string): string {
  const trimmed = value.trim().replace(/_/g, '-');
  const [language, ...rest] = trimmed.split('-');
  const region = rest.join('-');
  if (!language) return 'en-IN';
  const lang = language.toLowerCase();
  return region ? `${lang}-${region.toUpperCase()}` : lang;
}

export function isValidLocaleCode(value: unknown): value is string {
  return typeof value === 'string' && LOCALE_RE.test(value.trim());
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function isValidSlug(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (!/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/.test(value)) return false;
  return !RESERVED_SLUGS.has(value);
}

export function isReservedSlug(value: string): boolean {
  return RESERVED_SLUGS.has(value.trim().toLowerCase());
}

/** Strip control characters, collapse ragged whitespace, cap length. */
export function cleanText(value: string, maxLength: number): string {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trimEnd())
    .join('\n')
    .trim()
    .slice(0, maxLength);
}

/**
 * Source code keeps its own formatting. Only control characters are removed
 * (CRLF is normalised) — indentation, blank lines and tabs are preserved.
 */
export function cleanCode(value: string): string {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
}

const ALLOWED_PROTOCOLS = new Set(['https:', 'http:', 'mailto:', 'tel:']);

export type PortfolioUrlKind = 'link' | 'image';

/**
 * Approved URL protocols only. Rejects javascript:, data:, file:, vbscript:,
 * protocol-relative URLs and anything that is not absolute.
 * Same-page hash anchors (`#section-id`) are allowed for in-page navigation.
 */
export function sanitizeUrl(
  value: unknown,
  kind: PortfolioUrlKind = 'link',
): string | null {
  if (value == null || value === '') return '';
  if (typeof value !== 'string') return null;
  const raw = value.trim();
  if (!raw) return '';
  if (raw.startsWith('//')) return null;
  if (kind === 'link' && raw.startsWith('#')) return raw;
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw) === false) return null;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  const protocol = parsed.protocol.toLowerCase();
  if (!ALLOWED_PROTOCOLS.has(protocol)) return null;
  if (kind === 'image' && protocol !== 'https:' && protocol !== 'http:') {
    return null;
  }
  if (kind === 'link' && (protocol === 'https:' || protocol === 'http:')) {
    return parsed.toString();
  }
  if (protocol === 'mailto:' || protocol === 'tel:') {
    return raw;
  }
  return parsed.toString();
}

interface Validator {
  issues: PortfolioValidationIssue[];
  error: (
    code: string,
    message: string,
    path?: string,
    sectionId?: string,
  ) => void;
  warn: (
    code: string,
    message: string,
    path?: string,
    sectionId?: string,
  ) => void;
}

function sanitizeLocalized(
  input: unknown,
  maxLength: number,
  path: string,
  validator: Validator,
  required: boolean,
): PortfolioLocalizedText | undefined {
  if (input == null) {
    if (required) {
      validator.error('PORTFOLIO_TEXT_REQUIRED', 'Text is required', path);
    }
    return required ? undefined : {};
  }
  if (typeof input !== 'object' || Array.isArray(input)) {
    validator.error(
      'PORTFOLIO_TEXT_INVALID',
      'Localized text must be a locale map',
      path,
    );
    return undefined;
  }
  const out: PortfolioLocalizedText = {};
  let hasContent = false;
  for (const [locale, value] of Object.entries(input as Record<string, unknown>)) {
    if (!isValidLocaleCode(locale)) {
      validator.error(
        'PORTFOLIO_LOCALE_INVALID',
        `Invalid locale code "${locale}"`,
        `${path}.${locale}`,
      );
      continue;
    }
    if (typeof value !== 'string') {
      validator.error(
        'PORTFOLIO_TEXT_INVALID',
        'Localized text value must be a string',
        `${path}.${locale}`,
      );
      continue;
    }
    const cleaned = cleanText(value, maxLength);
    if (cleaned) hasContent = true;
    out[normalizeLocaleCode(locale)] = cleaned;
  }
  if (required && !hasContent) {
    validator.error('PORTFOLIO_TEXT_REQUIRED', 'Text is required', path);
    return undefined;
  }
  return out;
}

function sanitizeField(
  field: PortfolioPropField,
  value: unknown,
  path: string,
  validator: Validator,
): unknown {
  switch (field.kind) {
    case 'localizedText':
    case 'localizedTextarea': {
      return sanitizeLocalized(
        value,
        field.maxLength ?? (field.kind === 'localizedText' ? 200 : 2000),
        path,
        validator,
        Boolean(field.required),
      );
    }
    case 'text': {
      if (value == null || value === '') {
        if (field.required) {
          validator.error('PORTFOLIO_TEXT_REQUIRED', 'Value is required', path);
        }
        return '';
      }
      if (typeof value !== 'string') {
        validator.error('PORTFOLIO_TEXT_INVALID', 'Value must be a string', path);
        return '';
      }
      const cleaned = cleanText(value, field.maxLength ?? 200);
      if (field.required && !cleaned) {
        validator.error('PORTFOLIO_TEXT_REQUIRED', 'Value is required', path);
      }
      return cleaned;
    }
    case 'url':
    case 'image': {
      const safe = sanitizeUrl(value, field.kind === 'image' ? 'image' : 'link');
      if (safe === null) {
        validator.error(
          'PORTFOLIO_URL_INVALID',
          field.kind === 'image'
            ? 'Image must be an absolute https URL'
            : 'Link must use https, http, mailto or tel',
          path,
        );
        return '';
      }
      if (field.required && !safe) {
        validator.error('PORTFOLIO_URL_REQUIRED', 'Link is required', path);
      }
      return safe;
    }
    case 'textList': {
      if (value == null || value === '') {
        if (field.required) {
          validator.error('PORTFOLIO_LIST_REQUIRED', 'At least one item is required', path);
        }
        return [];
      }
      if (!Array.isArray(value)) {
        validator.error('PORTFOLIO_LIST_INVALID', 'Expected a list of text values', path);
        return [];
      }
      const items = value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => cleanText(item, 80))
        .filter(Boolean)
        .slice(0, MAX_LIST_ITEMS);
      if (field.required && items.length === 0) {
        validator.error('PORTFOLIO_LIST_REQUIRED', 'At least one item is required', path);
      }
      return items;
    }
    case 'objectList': {
      if (value == null || value === '') return [];
      if (!Array.isArray(value)) {
        validator.error('PORTFOLIO_LIST_INVALID', 'Expected a list of items', path);
        return [];
      }
      const itemFields = field.itemFields ?? [];
      const rows = value.slice(0, MAX_LIST_ITEMS).map((row, index) => {
        if (!row || typeof row !== 'object' || Array.isArray(row)) {
          validator.error(
            'PORTFOLIO_LIST_ITEM_INVALID',
            'List item must be an object',
            `${path}[${index}]`,
          );
          return null;
        }
        const record = row as Record<string, unknown>;
        const out: Record<string, unknown> = {};
        for (const key of Object.keys(record)) {
          if (!itemFields.some((f) => f.key === key)) {
            validator.error(
              'PORTFOLIO_PROP_UNKNOWN',
              `Unknown list field "${key}"`,
              `${path}[${index}].${key}`,
            );
          }
        }
        for (const itemField of itemFields) {
          const nested = sanitizeField(
            itemField,
            record[itemField.key],
            `${path}[${index}].${itemField.key}`,
            validator,
          );
          if (nested !== undefined) out[itemField.key] = nested;
        }
        return out;
      });
      return rows.filter((row): row is Record<string, unknown> => row !== null);
    }
    case 'code': {
      if (value == null || value === '') return '';
      if (typeof value !== 'string') {
        validator.error('PORTFOLIO_CODE_INVALID', 'Code must be text', path);
        return '';
      }
      const max = field.maxLength ?? 200_000;
      const cleaned = cleanCode(value);
      if (cleaned.length > max) {
        validator.error(
          'PORTFOLIO_CODE_TOO_LARGE',
          `${field.label} is ${cleaned.length.toLocaleString()} characters; the limit is ${max.toLocaleString()}.`,
          path,
        );
        return cleaned.slice(0, max);
      }
      return cleaned;
    }
    case 'toggle': {
      if (value != null && value !== '' && typeof value !== 'boolean') {
        validator.error('PORTFOLIO_TOGGLE_INVALID', `${field.label} must be true or false`, path);
        return false;
      }
      const enabled = value === true;
      if (field.required && !enabled) {
        validator.error('PORTFOLIO_TOGGLE_REQUIRED', `${field.label} must be enabled`, path);
      }
      return enabled;
    }
    case 'number': {
      const min = field.min ?? 0;
      const max = field.max ?? Number.MAX_SAFE_INTEGER;
      const fallback = field.defaultValue ?? String(min);
      if (value == null || value === '') return fallback;
      const parsed = typeof value === 'number' ? value : Number(String(value).trim());
      if (!Number.isFinite(parsed)) {
        validator.error('PORTFOLIO_NUMBER_INVALID', `${field.label} must be a number`, path);
        return fallback;
      }
      const clamped = Math.min(max, Math.max(min, Math.round(parsed)));
      return String(clamped);
    }
    default:
      return '';
  }
}

function sanitizeSection(
  input: unknown,
  path: string,
  validator: Validator,
): PortfolioSection | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    validator.error('PORTFOLIO_SECTION_INVALID', 'Section must be an object', path);
    return null;
  }
  const raw = input as Record<string, unknown>;
  const id = typeof raw['id'] === 'string' ? cleanText(raw['id'], 64) : '';
  if (!id) {
    validator.error('PORTFOLIO_SECTION_ID_REQUIRED', 'Section id is required', path);
    return null;
  }
  const type = raw['type'];
  if (typeof type !== 'string' || !isKnownSectionType(type)) {
    validator.error(
      'PORTFOLIO_COMPONENT_UNKNOWN',
      `Component "${String(type)}" is not registered`,
      path,
      id,
    );
    return null;
  }
  const def = getComponentDefinition(type);
  if (!def) {
    validator.error('PORTFOLIO_COMPONENT_UNKNOWN', 'Component is not registered', path, id);
    return null;
  }
  const variant =
    typeof raw['variant'] === 'string' && raw['variant'].trim()
      ? raw['variant'].trim()
      : def.defaultVariant;
  if (!def.variants.includes(variant)) {
    validator.error(
      'PORTFOLIO_VARIANT_UNKNOWN',
      `Variant "${variant}" is not supported by ${type}`,
      path,
      id,
    );
  }
  if (raw['props'] != null && (typeof raw['props'] !== 'object' || Array.isArray(raw['props']))) {
    validator.error('PORTFOLIO_PROPS_INVALID', 'Props must be an object', path, id);
    return null;
  }
  const rawProps = (raw['props'] ?? {}) as Record<string, unknown>;
  for (const key of Object.keys(rawProps)) {
    if (!def.fields.some((field) => field.key === key)) {
      validator.error(
        'PORTFOLIO_PROP_UNKNOWN',
        `Unknown prop "${key}" on ${type}`,
        path,
        id,
      );
    }
  }
  const props: Record<string, unknown> = {};
  for (const field of def.fields) {
    const value = sanitizeField(
      field,
      rawProps[field.key],
      `${path}.props.${field.key}`,
      validator,
    );
    if (value !== undefined) props[field.key] = value;
  }
  const style = sanitizeSectionStyle(raw['style'], `${path}.style`, validator);
  return {
    id,
    type,
    variant,
    hidden: raw['hidden'] === true,
    props,
    ...(style ? { style } : {}),
  };
}

function sanitizeSectionStyle(
  input: unknown,
  path: string,
  validator: Validator,
): PortfolioSectionStyle | undefined {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined;
  const raw = input as Record<string, unknown>;
  const style: PortfolioSectionStyle = {};
  if (typeof raw['backgroundColor'] === 'string' && raw['backgroundColor'].trim()) {
    style.backgroundColor = cleanText(raw['backgroundColor'].trim(), 32);
  }
  if (typeof raw['textColor'] === 'string' && raw['textColor'].trim()) {
    style.textColor = cleanText(raw['textColor'].trim(), 32);
  }
  if (typeof raw['paddingTop'] === 'string' && raw['paddingTop'].trim()) {
    style.paddingTop = cleanText(raw['paddingTop'].trim(), 32);
  }
  if (typeof raw['paddingBottom'] === 'string' && raw['paddingBottom'].trim()) {
    style.paddingBottom = cleanText(raw['paddingBottom'].trim(), 32);
  }
  if (raw['textAlign'] === 'left' || raw['textAlign'] === 'center' || raw['textAlign'] === 'right') {
    style.textAlign = raw['textAlign'];
  }
  if (typeof raw['backgroundImage'] === 'string' && raw['backgroundImage'].trim()) {
    const safe = sanitizeUrl(raw['backgroundImage'], 'image');
    if (safe) style.backgroundImage = safe;
  }
  if (raw['backgroundSize'] === 'cover' || raw['backgroundSize'] === 'contain' || raw['backgroundSize'] === 'auto') {
    style.backgroundSize = raw['backgroundSize'];
  }
  if (typeof raw['backgroundPosition'] === 'string' && raw['backgroundPosition'].trim()) {
    style.backgroundPosition = cleanText(raw['backgroundPosition'].trim(), 32);
  }
  if (typeof raw['borderTop'] === 'string' && raw['borderTop'].trim()) {
    style.borderTop = cleanText(raw['borderTop'].trim(), 64);
  }
  if (typeof raw['borderBottom'] === 'string' && raw['borderBottom'].trim()) {
    style.borderBottom = cleanText(raw['borderBottom'].trim(), 64);
  }
  if (typeof raw['opacity'] === 'string' && raw['opacity'].trim()) {
    style.opacity = cleanText(raw['opacity'].trim(), 16);
  }
  if (typeof raw['maxWidth'] === 'string' && raw['maxWidth'].trim()) {
    style.maxWidth = cleanText(raw['maxWidth'].trim(), 32);
  }
  return Object.keys(style).length > 0 ? style : undefined;
}

function sanitizeTheme(
  input: unknown,
  path: string,
  validator: Validator,
): PortfolioTheme {
  const fallback: PortfolioTheme = {
    mode: 'light',
    tokens: {
      primary: '#111111',
      accent: '#6c5ce7',
      surface: '#ffffff',
      text: '#111111',
      fontHeading: 'Manrope',
      fontBody: 'Manrope',
      radius: 'md',
      density: 'comfortable',
    },
  };
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    validator.error('PORTFOLIO_THEME_INVALID', 'Theme must be an object', path);
    return fallback;
  }
  const raw = input as Record<string, unknown>;
  const mode =
    typeof raw['mode'] === 'string' &&
    (PORTFOLIO_THEME_MODES as readonly string[]).includes(raw['mode'])
      ? (raw['mode'] as PortfolioTheme['mode'])
      : 'light';
  if (mode !== raw['mode']) {
    validator.error('PORTFOLIO_THEME_MODE_INVALID', 'Unknown theme mode', `${path}.mode`);
  }
  const rawTokens =
    raw['tokens'] && typeof raw['tokens'] === 'object' && !Array.isArray(raw['tokens'])
      ? (raw['tokens'] as Record<string, unknown>)
      : {};
  const tokens: PortfolioThemeTokens = { ...fallback.tokens };
  for (const colorKey of ['primary', 'accent', 'surface', 'text'] as const) {
    const value = rawTokens[colorKey];
    if (isHexColor(value)) {
      tokens[colorKey] = value.toLowerCase();
    } else if (value != null && value !== '') {
      validator.error(
        'PORTFOLIO_THEME_COLOR_INVALID',
        `${colorKey} must be a hex colour`,
        `${path}.tokens.${colorKey}`,
      );
    }
  }
  for (const fontKey of ['fontHeading', 'fontBody'] as const) {
    const value = rawTokens[fontKey];
    if (typeof value === 'string' && PORTFOLIO_FONT_IDS.includes(value)) {
      tokens[fontKey] = value;
    } else if (value != null && value !== '') {
      validator.error(
        'PORTFOLIO_THEME_FONT_INVALID',
        `${fontKey} must be an approved font`,
        `${path}.tokens.${fontKey}`,
      );
    }
  }
  if (
    typeof rawTokens['radius'] === 'string' &&
    (PORTFOLIO_RADII as readonly string[]).includes(rawTokens['radius'])
  ) {
    tokens.radius = rawTokens['radius'] as PortfolioThemeTokens['radius'];
  } else if (rawTokens['radius'] != null && rawTokens['radius'] !== '') {
    validator.error('PORTFOLIO_THEME_RADIUS_INVALID', 'Invalid radius', `${path}.tokens.radius`);
  }
  if (
    typeof rawTokens['density'] === 'string' &&
    (PORTFOLIO_DENSITIES as readonly string[]).includes(rawTokens['density'])
  ) {
    tokens.density = rawTokens['density'] as PortfolioThemeTokens['density'];
  } else if (rawTokens['density'] != null && rawTokens['density'] !== '') {
    validator.error(
      'PORTFOLIO_THEME_DENSITY_INVALID',
      'Invalid density',
      `${path}.tokens.density`,
    );
  }
  return { mode, tokens };
}

function sanitizeNavigation(
  input: unknown,
  path: string,
  validator: Validator,
): PortfolioNavItem[] {
  if (input == null) return [];
  if (!Array.isArray(input)) {
    validator.error('PORTFOLIO_NAV_INVALID', 'Navigation must be a list', path);
    return [];
  }
  const seen = new Set<string>();
  const items: PortfolioNavItem[] = [];
  input.slice(0, MAX_NAV_ITEMS).forEach((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      validator.error('PORTFOLIO_NAV_INVALID', 'Navigation item must be an object', `${path}[${index}]`);
      return;
    }
    const raw = entry as Record<string, unknown>;
    const id = typeof raw['id'] === 'string' ? cleanText(raw['id'], 64) : '';
    if (!id || seen.has(id)) {
      validator.error('PORTFOLIO_NAV_ID_INVALID', 'Navigation id must be unique', `${path}[${index}]`);
      return;
    }
    seen.add(id);
    const target = typeof raw['target'] === 'string' ? raw['target'].trim() : '';
    if (!target.startsWith('/') && !target.startsWith('#')) {
      validator.error(
        'PORTFOLIO_NAV_TARGET_INVALID',
        'Navigation target must start with / or #',
        `${path}[${index}].target`,
      );
      return;
    }
    const label = sanitizeLocalized(
      raw['label'],
      60,
      `${path}[${index}].label`,
      validator,
      true,
    );
    if (!label) return;
    items.push({ id, label, target });
  });
  return items;
}

function sanitizePage(
  input: unknown,
  path: string,
  validator: Validator,
): PortfolioPage | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    validator.error('PORTFOLIO_PAGE_INVALID', 'Page must be an object', path);
    return null;
  }
  const raw = input as Record<string, unknown>;
  const id = typeof raw['id'] === 'string' ? cleanText(raw['id'], 64) : '';
  if (!id) {
    validator.error('PORTFOLIO_PAGE_ID_REQUIRED', 'Page id is required', path);
    return null;
  }
  const pagePath = typeof raw['path'] === 'string' ? raw['path'].trim() : '';
  if (!pagePath.startsWith('/') || pagePath.length > 120) {
    validator.error('PORTFOLIO_PAGE_PATH_INVALID', 'Page path must start with /', `${path}.path`);
    return null;
  }
  const rawSeo =
    raw['seo'] && typeof raw['seo'] === 'object' && !Array.isArray(raw['seo'])
      ? (raw['seo'] as Record<string, unknown>)
      : {};
  const seo: PortfolioPage['seo'] = {};
  if (rawSeo['title'] != null) {
    const title = sanitizeLocalized(rawSeo['title'], 120, `${path}.seo.title`, validator, false);
    if (title) seo.title = title;
  }
  if (rawSeo['description'] != null) {
    const description = sanitizeLocalized(
      rawSeo['description'],
      300,
      `${path}.seo.description`,
      validator,
      false,
    );
    if (description) seo.description = description;
  }
  if (rawSeo['imageUrl'] != null && rawSeo['imageUrl'] !== '') {
    const imageUrl = sanitizeUrl(rawSeo['imageUrl'], 'image');
    if (imageUrl === null) {
      validator.error(
        'PORTFOLIO_URL_INVALID',
        'SEO image must be an absolute https URL',
        `${path}.seo.imageUrl`,
      );
    } else if (imageUrl) {
      seo.imageUrl = imageUrl;
    }
  }
  const rawSections = raw['sections'];
  if (!Array.isArray(rawSections)) {
    validator.error('PORTFOLIO_SECTIONS_INVALID', 'Sections must be a list', `${path}.sections`);
    return null;
  }
  if (rawSections.length > MAX_SECTIONS_PER_PAGE) {
    validator.error(
      'PORTFOLIO_SECTIONS_LIMIT',
      `A page supports at most ${MAX_SECTIONS_PER_PAGE} sections`,
      `${path}.sections`,
    );
  }
  const sectionIds = new Set<string>();
  const sections: PortfolioSection[] = [];
  rawSections.slice(0, MAX_SECTIONS_PER_PAGE).forEach((section, index) => {
    const parsed = sanitizeSection(
      section,
      `${path}.sections[${index}]`,
      validator,
    );
    if (!parsed) return;
    if (sectionIds.has(parsed.id)) {
      validator.error(
        'PORTFOLIO_SECTION_ID_DUPLICATE',
        'Section id must be unique within a page',
        `${path}.sections[${index}].id`,
        parsed.id,
      );
      return;
    }
    sectionIds.add(parsed.id);
    sections.push(parsed);
  });
  return { id, path: pagePath, seo, sections };
}

const EXTERNAL_REF_RE = /(?:src|href)\s*=\s*["']?\s*(?:https?:)?\/\//i;

/**
 * Custom code is isolated, not sanitised. These checks are advisory: they tell
 * the author what the sandbox will block or what publishing requires, without
 * ever rewriting their source.
 */
function auditCustomCode(
  section: PortfolioSection,
  issues: PortfolioValidationIssue[],
): void {
  if (section.type !== 'custom-code') return;
  const html = typeof section.props['html'] === 'string' ? section.props['html'] : '';
  const css = typeof section.props['css'] === 'string' ? section.props['css'] : '';
  const js = typeof section.props['js'] === 'string' ? section.props['js'] : '';
  const warn = (code: string, message: string): void => {
    issues.push({ severity: 'warning', code, message, sectionId: section.id });
  };

  if (section.props['acknowledged'] !== true) {
    warn(
      'PORTFOLIO_CUSTOM_CODE_UNACKNOWLEDGED',
      'Confirm that you understand this code runs in visitors’ browsers before publishing.',
    );
  }
  if (!String(section.props['title'] ?? '').trim()) {
    warn(
      'PORTFOLIO_CUSTOM_CODE_TITLE_MISSING',
      'Add a frame title so screen readers can announce the embedded block.',
    );
  }
  if (/<base[\s>/]/i.test(html)) {
    warn(
      'PORTFOLIO_CUSTOM_CODE_BASE_TAG',
      'A <base> tag is ignored inside the sandbox; relative URLs resolve against the block itself.',
    );
  }
  const referencesExternalHost =
    EXTERNAL_REF_RE.test(html) ||
    /@import\s+(?:url\(\s*)?["']?\s*(?:https?:)?\/\//i.test(css) ||
    /\b(?:fetch|XMLHttpRequest|importScripts)\s*\(/.test(js);
  if (referencesExternalHost && section.props['allowExternal'] !== true) {
    warn(
      'PORTFOLIO_CUSTOM_CODE_EXTERNAL_BLOCKED',
      'This block references an external host, but external requests are off. Inline the asset or enable external requests.',
    );
  }
}

export interface PortfolioDocumentValidation {
  ok: boolean;
  document: PortfolioDocument | null;
  issues: PortfolioValidationIssue[];
}

/**
 * Validate + sanitize a raw site document. Returns `document: null` when any
 * error is found — the caller must reject the write.
 */
export function validatePortfolioDocument(
  input: unknown,
): PortfolioDocumentValidation {
  const issues: PortfolioValidationIssue[] = [];
  const validator: Validator = {
    issues,
    error: (code, message, path, sectionId) =>
      issues.push({ severity: 'error', code, message, path, sectionId }),
    warn: (code, message, path, sectionId) =>
      issues.push({ severity: 'warning', code, message, path, sectionId }),
  };

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    validator.error('PORTFOLIO_DOCUMENT_INVALID', 'Site document must be an object');
    return { ok: false, document: null, issues };
  }
  const raw = input as Record<string, unknown>;
  if (raw['schemaVersion'] !== '1.0') {
    validator.error(
      'PORTFOLIO_SCHEMA_VERSION_UNSUPPORTED',
      'Only schemaVersion 1.0 is supported',
      'schemaVersion',
    );
  }

  const rawSite =
    raw['site'] && typeof raw['site'] === 'object' && !Array.isArray(raw['site'])
      ? (raw['site'] as Record<string, unknown>)
      : {};
  const siteId = typeof rawSite['id'] === 'string' ? cleanText(rawSite['id'], 64) : '';
  if (!siteId) {
    validator.error('PORTFOLIO_SITE_ID_REQUIRED', 'Site id is required', 'site.id');
  }
  const name = typeof rawSite['name'] === 'string' ? cleanText(rawSite['name'], 80) : '';
  if (!name) {
    validator.error('PORTFOLIO_SITE_NAME_REQUIRED', 'Site name is required', 'site.name');
  }
  const slug = typeof rawSite['slug'] === 'string' ? rawSite['slug'].trim().toLowerCase() : '';
  if (!isValidSlug(slug)) {
    validator.error(
      'PORTFOLIO_SLUG_INVALID',
      'Slug must be 3–40 lowercase letters, numbers or dashes and not reserved',
      'site.slug',
    );
  }
  const rawLocales = Array.isArray(rawSite['locales']) ? rawSite['locales'] : [];
  const locales: string[] = [];
  for (const locale of rawLocales) {
    if (!isValidLocaleCode(locale)) {
      validator.error('PORTFOLIO_LOCALE_INVALID', `Invalid locale "${String(locale)}"`, 'site.locales');
      continue;
    }
    const normalized = normalizeLocaleCode(locale);
    if (!locales.includes(normalized)) locales.push(normalized);
  }
  if (locales.length === 0) {
    validator.error('PORTFOLIO_LOCALES_REQUIRED', 'At least one locale is required', 'site.locales');
  }
  if (locales.length > MAX_LOCALES) {
    validator.error('PORTFOLIO_LOCALES_LIMIT', `At most ${MAX_LOCALES} locales are supported`, 'site.locales');
  }
  const defaultLocale = isValidLocaleCode(rawSite['defaultLocale'])
    ? normalizeLocaleCode(rawSite['defaultLocale'])
    : '';
  if (!defaultLocale) {
    validator.error(
      'PORTFOLIO_DEFAULT_LOCALE_REQUIRED',
      'A default locale is required',
      'site.defaultLocale',
    );
  } else if (locales.length > 0 && !locales.includes(defaultLocale)) {
    validator.error(
      'PORTFOLIO_DEFAULT_LOCALE_MISSING',
      'Default locale must be one of the enabled locales',
      'site.defaultLocale',
    );
  }

  const rawTemplate =
    rawSite['template'] && typeof rawSite['template'] === 'object'
      ? (rawSite['template'] as Record<string, unknown>)
      : {};
  const templateId = typeof rawTemplate['id'] === 'string' ? rawTemplate['id'].trim() : '';
  const templateVersion =
    typeof rawTemplate['version'] === 'string' ? rawTemplate['version'].trim() : '';
  const template = findTemplate(templateId);
  if (!template) {
    validator.error(
      'PORTFOLIO_TEMPLATE_UNKNOWN',
      `Template "${templateId}" is not registered`,
      'site.template.id',
    );
  } else if (templateVersion !== template.version) {
    validator.error(
      'PORTFOLIO_TEMPLATE_VERSION_MISMATCH',
      `Template version must be ${template.version}`,
      'site.template.version',
    );
  }

  const theme = sanitizeTheme(raw['theme'], 'theme', validator);
  const navigation = sanitizeNavigation(raw['navigation'], 'navigation', validator);

  const rawPages = Array.isArray(raw['pages']) ? raw['pages'] : [];
  if (rawPages.length === 0) {
    validator.error('PORTFOLIO_PAGE_REQUIRED', 'At least one page is required', 'pages');
  }
  if (rawPages.length > MAX_PAGES) {
    validator.error('PORTFOLIO_PAGES_LIMIT', `At most ${MAX_PAGES} pages are supported`, 'pages');
  }
  const pages: PortfolioPage[] = [];
  const pageIds = new Set<string>();
  const pagePaths = new Set<string>();
  rawPages.slice(0, MAX_PAGES).forEach((page, index) => {
    const parsed = sanitizePage(page, `pages[${index}]`, validator);
    if (!parsed) return;
    if (pageIds.has(parsed.id)) {
      validator.error('PORTFOLIO_PAGE_ID_DUPLICATE', 'Page id must be unique', `pages[${index}].id`);
      return;
    }
    if (pagePaths.has(parsed.path)) {
      validator.error(
        'PORTFOLIO_PAGE_PATH_DUPLICATE',
        'Page paths must be unique',
        `pages[${index}].path`,
      );
      return;
    }
    pageIds.add(parsed.id);
    pagePaths.add(parsed.path);
    pages.push(parsed);
  });

  for (const page of pages) {
    for (const section of page.sections) auditCustomCode(section, issues);
  }

  const ok = !issues.some((issue) => issue.severity === 'error');
  if (!ok) {
    return { ok: false, document: null, issues };
  }

  return {
    ok: true,
    issues,
    document: {
      schemaVersion: '1.0',
      site: {
        id: siteId,
        name,
        slug,
        defaultLocale,
        locales,
        template: { id: templateId, version: templateVersion },
      },
      theme,
      navigation,
      pages,
    },
  };
}

/** Migration hook for older documents (none shipped yet beyond v1.0). */
export function migratePortfolioDocument(input: unknown): unknown {
  if (!input || typeof input !== 'object') return input;
  const doc = input as Record<string, unknown>;
  const version = typeof doc['schemaVersion'] === 'string' ? doc['schemaVersion'] : '';
  if (!version) {
    return { ...doc, schemaVersion: '1.0' };
  }
  return doc;
}
