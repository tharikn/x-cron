import type {
  PortfolioDocument,
  PortfolioLocalizedText,
} from './portfolio.types';

export interface PortfolioPublicSeo {
  title: string;
  description: string;
  canonicalPath: string;
  robots: string;
  ogImage: string;
  jsonLd: Record<string, unknown>;
}

function localized(
  value: unknown,
  locale: string,
  fallbackLocale: string,
): string {
  if (!value || typeof value !== 'object') return '';
  const map = value as PortfolioLocalizedText;
  return (map[locale] ?? map[fallbackLocale] ?? '').trim();
}

/** Canonical public path for a portfolio slug. */
export function portfolioPublicPath(slug: string): string {
  return `/p/${slug}`;
}

/**
 * Build SEO + JSON-LD from trusted structured fields only. No raw JSON-LD
 * injection is possible: the payload is constructed here, never authored by the
 * user. `canonicalPath` defaults to the platform public path and can be
 * overridden for host-bound sites (verified custom domain → site root).
 */
export function buildPortfolioSeo(
  document: PortfolioDocument,
  locale?: string,
  canonicalPath: string = portfolioPublicPath(document.site.slug),
): PortfolioPublicSeo {
  const defaultLocale = document.site.defaultLocale;
  const activeLocale = locale ?? defaultLocale;
  const page = document.pages[0];
  const title =
    localized(page?.seo.title, activeLocale, defaultLocale) ||
    `${document.site.name} · Portfolio`;
  const hero = page?.sections.find((section) => section.type === 'hero' && !section.hidden);
  const description =
    localized(page?.seo.description, activeLocale, defaultLocale) ||
    localized(hero?.props['subheadline'], activeLocale, defaultLocale) ||
    `Portfolio of ${document.site.name}.`;

  let ogImage = page?.seo.imageUrl ?? '';
  if (!ogImage) {
    for (const section of page?.sections ?? []) {
      if (section.type === 'hero' && section.props['imageUrl']) {
        ogImage = String(section.props['imageUrl']);
        break;
      }
      if (section.type === 'gallery') {
        const items = Array.isArray(section.props['items'])
          ? (section.props['items'] as Array<Record<string, unknown>>)
          : [];
        const first = items.find((item) => item['url']);
        if (first) {
          ogImage = String(first['url']);
          break;
        }
      }
    }
  }

  const contact = page?.sections.find((section) => section.type === 'contact');
  const location = localized(contact?.props['location'], activeLocale, defaultLocale);
  const contactLinks = Array.isArray(contact?.props['links'])
    ? (contact?.props['links'] as Array<Record<string, unknown>>)
    : [];
  const sameAs = contactLinks
    .map((link) => String(link['url'] ?? ''))
    .filter((url) => /^https:\/\//i.test(url));

  const skills = page?.sections.find((section) => section.type === 'skills');
  const skillItems = Array.isArray(skills?.props['items'])
    ? (skills?.props['items'] as string[]).slice(0, 30)
    : [];

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: document.site.name,
      description,
      ...(location ? { address: { '@type': 'PostalAddress', addressLocality: location } } : {}),
      ...(sameAs.length > 0 ? { sameAs } : {}),
      ...(skillItems.length > 0 ? { knowsAbout: skillItems } : {}),
    },
  };

  if (page) {
    const projectSection = page.sections.find(
      (section) => section.type === 'projects' && !section.hidden,
    );
    const items = Array.isArray(projectSection?.props['items'])
      ? (projectSection?.props['items'] as Array<Record<string, unknown>>)
      : [];
    if (items.length > 0) {
      jsonLd['hasPart'] = items.slice(0, 20).map((item) => ({
        '@type': 'CreativeWork',
        name: localized(item['title'], activeLocale, defaultLocale),
        description: localized(item['description'], activeLocale, defaultLocale),
        ...(String(item['url'] ?? '')
          ? { url: String(item['url']) }
          : {}),
      }));
    }
  }

  return {
    title,
    description: description.slice(0, 300),
    canonicalPath,
    robots: 'index,follow',
    ogImage,
    jsonLd,
  };
}
