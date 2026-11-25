import { getComponentDefinition } from './component-registry';
import { validatePortfolioDocument } from './site-schema';
import type {
  PortfolioDocument,
  PortfolioLocalizedText,
  PortfolioValidationIssue,
  PortfolioValidationResult,
} from './portfolio.types';

function push(
  list: PortfolioValidationIssue[],
  severity: PortfolioValidationIssue['severity'],
  code: string,
  message: string,
  extra: { path?: string; sectionId?: string } = {},
): void {
  list.push({ severity, code, message, ...extra });
}

function localizedValue(
  value: unknown,
  locale: string,
  fallbackLocale: string,
): string {
  if (!value || typeof value !== 'object') return '';
  const map = value as PortfolioLocalizedText;
  return (map[locale] ?? map[fallbackLocale] ?? '').trim();
}

/**
 * Deterministic publish validation. Errors block publishing; warnings and
 * suggestions are advisory only. Same input always produces the same result.
 */
export function validateForPublish(
  document: PortfolioDocument,
): PortfolioValidationResult {
  const errors: PortfolioValidationIssue[] = [];
  const warnings: PortfolioValidationIssue[] = [];
  const suggestions: PortfolioValidationIssue[] = [];

  const schema = validatePortfolioDocument(document);
  errors.push(...schema.issues.filter((issue) => issue.severity === 'error'));
  warnings.push(...schema.issues.filter((issue) => issue.severity === 'warning'));
  if (!schema.ok || !schema.document) {
    return { ok: false, errors, warnings, suggestions };
  }

  const doc = schema.document;
  const defaultLocale = doc.site.defaultLocale;
  const page = doc.pages[0];

  if (!page) {
    push(errors, 'error', 'PORTFOLIO_PAGE_REQUIRED', 'At least one page is required');
    return { ok: false, errors, warnings, suggestions };
  }

  const visible = page.sections.filter((section) => !section.hidden);
  if (visible.length === 0) {
    push(
      errors,
      'error',
      'PORTFOLIO_NO_VISIBLE_SECTIONS',
      'Add at least one visible section before publishing',
      { path: `pages[0].sections` },
    );
  }

  const hero = visible.find((section) => section.type === 'hero');
  const contact = visible.find((section) => section.type === 'contact');
  const projects = visible.find((section) => section.type === 'projects');
  const gallery = visible.find((section) => section.type === 'gallery');

  if (!hero) {
    push(
      warnings,
      'warning',
      'PORTFOLIO_HERO_MISSING',
      'A hero section gives visitors an immediate introduction.',
      { path: 'pages[0].sections' },
    );
  }

  const seoTitle = localizedValue(page.seo.title, defaultLocale, defaultLocale);
  const seoDescription = localizedValue(
    page.seo.description,
    defaultLocale,
    defaultLocale,
  );
  if (!seoTitle) {
    push(
      warnings,
      'warning',
      'PORTFOLIO_SEO_TITLE_MISSING',
      'Add a page title for search and social previews.',
      { path: 'pages[0].seo.title' },
    );
  }
  if (!seoDescription) {
    push(
      warnings,
      'warning',
      'PORTFOLIO_SEO_DESCRIPTION_MISSING',
      'Add a short page description (under 160 characters).',
      { path: 'pages[0].seo.description' },
    );
  } else if (seoDescription.length > 170) {
    push(
      warnings,
      'warning',
      'PORTFOLIO_SEO_DESCRIPTION_LONG',
      'Search results truncate descriptions longer than ~160 characters.',
      { path: 'pages[0].seo.description' },
    );
  }

  if (!projects && !gallery) {
    push(
      suggestions,
      'suggestion',
      'PORTFOLIO_WORK_MISSING',
      'Consider showing at least one project or gallery item.',
      { path: 'pages[0].sections' },
    );
  }

  if (!contact) {
    push(
      suggestions,
      'suggestion',
      'PORTFOLIO_CONTACT_MISSING',
      'Add a contact section so visitors can reach you.',
      { path: 'pages[0].sections' },
    );
  }

  // Localized completeness for enabled secondary locales.
  const secondary = doc.site.locales.filter((locale) => locale !== defaultLocale);
  if (secondary.length > 0 && hero) {
    const headline = hero.props['headline'];
    for (const locale of secondary) {
      if (!localizedValue(headline, locale, '')) {
        push(
          warnings,
          'warning',
          'PORTFOLIO_LOCALE_CONTENT_MISSING',
          `Hero headline is empty for ${locale}. It will fall back to ${defaultLocale}.`,
          { path: 'pages[0].sections', sectionId: hero.id },
        );
      }
    }
  }

  // Accessibility heuristics.
  for (const section of visible) {
    const def = getComponentDefinition(section.type);
    if (!def) continue;
    if (section.type === 'custom-code') {
      if (section.props['acknowledged'] !== true) {
        push(
          errors,
          'error',
          'PORTFOLIO_CUSTOM_CODE_UNACKNOWLEDGED',
          'Confirm that you understand the custom code runs in visitors’ browsers before publishing.',
          { sectionId: section.id },
        );
      }
      if (!String(section.props['title'] ?? '').trim()) {
        push(
          warnings,
          'warning',
          'PORTFOLIO_CUSTOM_CODE_TITLE_MISSING',
          'Add a frame title so screen readers can announce the embedded block.',
          { sectionId: section.id },
        );
      }
      const html = String(section.props['html'] ?? '');
      if (/<h[12][\s>]/i.test(html)) {
        push(
          warnings,
          'warning',
          'PORTFOLIO_CUSTOM_CODE_HEADINGS_NOT_INDEXED',
          'Headings inside a sandboxed frame are not indexed. Keep primary headings in normal sections.',
          { sectionId: section.id },
        );
      }
    }
    if (section.type === 'hero') {
      const imageUrl = String(section.props['imageUrl'] ?? '');
      const alt = localizedValue(
        section.props['imageAlt'],
        defaultLocale,
        defaultLocale,
      );
      if (imageUrl && !alt) {
        push(
          warnings,
          'warning',
          'PORTFOLIO_IMAGE_ALT_MISSING',
          'Hero image has no alt text. Decorative images should stay empty; meaningful images need a description.',
          { sectionId: section.id },
        );
      }
    }
    if (section.type === 'gallery') {
      const items = Array.isArray(section.props['items'])
        ? (section.props['items'] as Array<Record<string, unknown>>)
        : [];
      const missing = items.filter(
        (item) =>
          String(item['url'] ?? '') &&
          !localizedValue(item['alt'], defaultLocale, defaultLocale),
      );
      if (missing.length > 0) {
        push(
          warnings,
          'warning',
          'PORTFOLIO_GALLERY_ALT_MISSING',
          `${missing.length} gallery image(s) have no alt text.`,
          { sectionId: section.id },
        );
      }
    }
  }

  const contactEmails = visible
    .filter((section) => section.type === 'contact')
    .map((section) => String(section.props['email'] ?? '').trim())
    .filter(Boolean);
  for (const email of contactEmails) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      push(
        warnings,
        'warning',
        'PORTFOLIO_CONTACT_EMAIL_INVALID',
        `"${email}" does not look like a valid email address.`,
        { sectionId: contact?.id },
      );
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}
