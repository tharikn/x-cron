import { buildSiteDocument, fallbackTemplate, findTemplate } from './templates/template-catalog';
import {
  isValidSlug,
  sanitizeUrl,
  validatePortfolioDocument,
} from './site-schema';
import { validateForPublish } from './portfolio.validation';
import type { PortfolioDocument } from './portfolio.types';

const template = fallbackTemplate();

function document(): PortfolioDocument {
  return buildSiteDocument(template, {
    siteId: 'site_test',
    name: 'Jane Doe',
    slug: 'jane-doe',
    defaultLocale: 'en-IN',
    locales: ['en-IN'],
  });
}

describe('portfolio site schema', () => {
  it('accepts a template-seeded document', () => {
    const result = validatePortfolioDocument(document());
    expect(result.ok).toBe(true);
    expect(result.document?.site.slug).toBe('jane-doe');
  });

  it('accepts the dev-dark-01 template document (hash CTA anchor)', () => {
    const doc = buildSiteDocument(findTemplate('dev-dark-01')!, {
      siteId: 'site_test',
      name: 'Tharik - AgeX',
      slug: 'tharik-agex',
      defaultLocale: 'en-IN',
      locales: ['en-IN'],
    });
    const result = validatePortfolioDocument(doc);
    expect(result.ok).toBe(true);
    expect(
      result.document?.pages[0]?.sections[0]?.props['primaryCtaHref'],
    ).toBe('#work');
  });

  it('accepts a hash CTA anchor on a hero section', () => {
    const doc = document() as unknown as Record<string, unknown>;
    const pages = doc['pages'] as Array<Record<string, unknown>>;
    const sections = pages[0]!['sections'] as Array<Record<string, unknown>>;
    (sections[0]!.props as Record<string, unknown>)['primaryCtaHref'] = '#work';
    const result = validatePortfolioDocument(doc);
    expect(result.ok).toBe(true);
  });

  it('accepts the submitted Tharik dev-dark-01 portfolio document', () => {
    const result = validatePortfolioDocument({
      schemaVersion: '1.0',
      site: {
        id: 'site_2b2060b0-f447-49cd-bf8d-4f495195e95a',
        name: 'Tharik - AgeX',
        slug: 'tharik-agex',
        defaultLocale: 'en-IN',
        locales: ['en-IN'],
        template: { id: 'dev-dark-01', version: '1.0.0' },
      },
      theme: {
        mode: 'dark',
        tokens: {
          primary: '#e6edf3',
          accent: '#3fb950',
          surface: '#0b1220',
          text: '#e6edf3',
          fontHeading: 'Mono',
          fontBody: 'Manrope',
          radius: 'sm',
          density: 'comfortable',
        },
      },
      navigation: [
        { id: 'nav-home', label: { 'en-IN': 'Home' }, target: '/' },
        { id: 'nav-hero-1', label: { 'en-IN': 'Home' }, target: '#hero-1' },
        { id: 'nav-skills-2', label: { 'en-IN': 'Skills' }, target: '#skills-2' },
        { id: 'nav-projects-3', label: { 'en-IN': 'Work' }, target: '#projects-3' },
        { id: 'nav-experience-4', label: { 'en-IN': 'Experience' }, target: '#experience-4' },
        { id: 'nav-cta-5', label: { 'en-IN': 'Contact' }, target: '#cta-5' },
      ],
      pages: [
        {
          id: 'home',
          path: '/',
          seo: {
            title: { 'en-IN': 'Tharik - AgeX · Portfolio' },
            description: {
              'en-IN': 'Backend-leaning full-stack engineer. I like boring infrastructure, fast APIs and clear docs.',
            },
          },
          sections: [
            {
              id: 'hero-1',
              type: 'hero',
              variant: 'split-media',
              hidden: false,
              props: {
                eyebrow: { 'en-IN': 'Software engineer' },
                headline: { 'en-IN': 'Your Name' },
                subheadline: {
                  'en-IN': 'Backend-leaning full-stack engineer. I like boring infrastructure, fast APIs and clear docs.',
                },
                primaryCtaLabel: { 'en-IN': 'View projects' },
                primaryCtaHref: '#work',
                imageUrl:
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQVjoVdT3yF14zphOTLEHqpGx514xZwOwOpF6Gp9HhDg&s=10',
                imageAlt: { 'en-IN': '' },
              },
            },
            {
              id: 'skills-2',
              type: 'skills',
              variant: 'chips',
              hidden: false,
              props: {
                title: { 'en-IN': 'Stack' },
                items: ['TypeScript', 'NestJS', 'Angular', 'PostgreSQL', 'Redis', 'AWS'],
              },
            },
            {
              id: 'projects-3',
              type: 'projects',
              variant: 'list',
              hidden: false,
              props: {
                title: { 'en-IN': 'Projects' },
                items: [
                  {
                    title: { 'en-IN': 'Project name' },
                    description: { 'en-IN': 'One line on the problem, one line on the architecture, one on impact.' },
                    url: 'https://github.com/your-name',
                    imageUrl: '',
                    tags: ['TypeScript', 'Postgres'],
                  },
                  {
                    title: { 'en-IN': 'Open source contribution' },
                    description: { 'en-IN': 'What you changed and why it mattered.' },
                    url: '',
                    imageUrl: '',
                    tags: ['Open source'],
                  },
                ],
              },
            },
            {
              id: 'experience-4',
              type: 'experience',
              variant: 'timeline',
              hidden: false,
              props: {
                title: { 'en-IN': 'Experience' },
                items: [
                  {
                    role: { 'en-IN': 'Software Engineer' },
                    company: { 'en-IN': 'Company name' },
                    period: { 'en-IN': '2024 — now' },
                    description: { 'en-IN': 'Build and operate the platform API and background workers.' },
                  },
                ],
              },
            },
            {
              id: 'cta-5',
              type: 'cta',
              variant: 'band',
              hidden: false,
              props: {
                headline: { 'en-IN': 'Open to backend and platform roles.' },
                body: { 'en-IN': 'Send a short note with the problem your team is solving.' },
                buttonLabel: { 'en-IN': 'Email me' },
                buttonHref: 'mailto:you@example.com',
              },
            },
          ],
        },
      ],
    } as unknown as PortfolioDocument);
    expect(result.ok).toBe(true);
  });

  it('rejects unknown component types', () => {
    const doc = document() as unknown as Record<string, unknown>;
    const pages = doc['pages'] as Array<Record<string, unknown>>;
    const sections = pages[0]!['sections'] as Array<Record<string, unknown>>;
    sections.push({ id: 'evil-1', type: 'raw-html', props: { html: '<script>' } });
    const result = validatePortfolioDocument(doc);
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === 'PORTFOLIO_COMPONENT_UNKNOWN')).toBe(true);
  });

  it('rejects unknown props on known components', () => {
    const doc = document();
    doc.pages[0]!.sections[0]!.props['dangerouslySetInnerHTML'] = '<script>';
    const result = validatePortfolioDocument(doc);
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === 'PORTFOLIO_PROP_UNKNOWN')).toBe(true);
  });

  it('rejects javascript: URLs', () => {
    const doc = document();
    doc.pages[0]!.sections[0]!.props['primaryCtaHref'] = 'javascript:alert(1)';
    const result = validatePortfolioDocument(doc);
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === 'PORTFOLIO_URL_INVALID')).toBe(true);
  });

  it('rejects reserved or malformed slugs', () => {
    expect(isValidSlug('admin')).toBe(false);
    expect(isValidSlug('jane-doe')).toBe(true);
    const doc = document();
    doc.site.slug = 'admin';
    expect(validatePortfolioDocument(doc).ok).toBe(false);
  });

  it('rejects theme colours outside hex values', () => {
    const doc = document();
    doc.theme.tokens.primary = 'url(javascript:alert(1))';
    const result = validatePortfolioDocument(doc);
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === 'PORTFOLIO_THEME_COLOR_INVALID')).toBe(true);
  });

  it('allows mailto and tel links but blocks data: images', () => {
    expect(sanitizeUrl('mailto:you@example.com')).toBe('mailto:you@example.com');
    expect(sanitizeUrl('tel:+911234567890')).toBe('tel:+911234567890');
    expect(sanitizeUrl('data:image/svg+xml;base64,AAA', 'image')).toBeNull();
    expect(sanitizeUrl('/relative', 'link')).toBeNull();
  });

  it('allows in-page hash anchor links but blocks unsafe schemes', () => {
    expect(sanitizeUrl('#work')).toBe('#work');
    expect(sanitizeUrl('#hero-1', 'link')).toBe('#hero-1');
    expect(sanitizeUrl('  #work  ', 'link')).toBe('#work');
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeUrl('//evil.com')).toBeNull();
  });
});

describe('portfolio publish validation', () => {
  it('passes a healthy seeded document', () => {
    const result = validateForPublish(document());
    expect(result.ok).toBe(true);
  });

  it('blocks publishing when every section is hidden', () => {
    const doc = document();
    for (const section of doc.pages[0]!.sections) section.hidden = true;
    const result = validateForPublish(doc);
    expect(result.ok).toBe(false);
    expect(result.errors.some((i) => i.code === 'PORTFOLIO_NO_VISIBLE_SECTIONS')).toBe(true);
  });

  it('allows publishing with non-blocking SEO warnings', () => {
    const doc = document();
    doc.pages[0]!.seo = {};
    const result = validateForPublish(doc);
    expect(result.ok).toBe(true);
    expect(result.warnings.some((i) => i.code === 'PORTFOLIO_SEO_TITLE_MISSING')).toBe(true);
  });
});

describe('portfolio custom code sandbox', () => {
  function withCustomCode(
    overrides: Record<string, unknown> = {},
  ): PortfolioDocument {
    const doc = document();
    doc.pages[0]!.sections.push({
      id: 'custom-1',
      type: 'custom-code',
      variant: 'sandbox',
      hidden: false,
      props: {
        title: 'Demo block',
        html: '<div class="card">Hi</div>',
        css: '.card { color: red; }',
        js: 'console.log("hi")',
        height: '520',
        allowForms: false,
        allowPopups: false,
        allowExternal: false,
        acknowledged: true,
        ...overrides,
      },
    });
    return doc;
  }

  it('accepts a custom-code section and preserves source formatting', () => {
    const html = '<div class="card">\n  <span>hi</span>\n</div>';
    const result = validatePortfolioDocument(withCustomCode({ html }));
    expect(result.ok).toBe(true);
    const section = result.document!.pages[0]!.sections.find(
      (s) => s.type === 'custom-code',
    );
    expect(section?.props['html']).toBe(html);
  });

  it('clamps height and rejects unknown props', () => {
    const clamped = validatePortfolioDocument(withCustomCode({ height: '99999' }));
    expect(clamped.ok).toBe(true);
    expect(
      clamped.document!.pages[0]!.sections.find((s) => s.type === 'custom-code')!
        .props['height'],
    ).toBe('3000');

    const unknown = validatePortfolioDocument(
      withCustomCode({ dangerouslySetInnerHTML: '<script>' }),
    );
    expect(unknown.ok).toBe(false);
    expect(unknown.issues.some((i) => i.code === 'PORTFOLIO_PROP_UNKNOWN')).toBe(true);
  });

  it('rejects code beyond the size budget', () => {
    const result = validatePortfolioDocument(
      withCustomCode({ html: 'a'.repeat(200_001) }),
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === 'PORTFOLIO_CODE_TOO_LARGE')).toBe(true);
  });

  it('warns when the author has not acknowledged the sandbox', () => {
    const result = validatePortfolioDocument(
      withCustomCode({ acknowledged: false }),
    );
    expect(result.ok).toBe(true);
    expect(
      result.issues.some(
        (i) =>
          i.code === 'PORTFOLIO_CUSTOM_CODE_UNACKNOWLEDGED' &&
          i.severity === 'warning',
      ),
    ).toBe(true);
  });

  it('warns when external assets are referenced while external requests are off', () => {
    const result = validatePortfolioDocument(
      withCustomCode({ html: '<script src="https://cdn.example.com/lib.js"></script>' }),
    );
    expect(
      result.issues.some(
        (i) => i.code === 'PORTFOLIO_CUSTOM_CODE_EXTERNAL_BLOCKED',
      ),
    ).toBe(true);
  });

  it('blocks publishing until the sandbox acknowledgement is ticked', () => {
    const blocked = validateForPublish(withCustomCode({ acknowledged: false }));
    expect(blocked.ok).toBe(false);
    expect(
      blocked.errors.some(
        (i) => i.code === 'PORTFOLIO_CUSTOM_CODE_UNACKNOWLEDGED',
      ),
    ).toBe(true);

    const allowed = validateForPublish(withCustomCode());
    expect(allowed.ok).toBe(true);
  });

  it('surfaces schema warnings through publish validation', () => {
    const result = validateForPublish(
      withCustomCode({ html: '<script src="https://cdn.example.com/lib.js"></script>' }),
    );
    expect(
      result.warnings.some(
        (i) => i.code === 'PORTFOLIO_CUSTOM_CODE_EXTERNAL_BLOCKED',
      ),
    ).toBe(true);
  });
});
