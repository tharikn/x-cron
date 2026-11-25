import type {
  PortfolioLocalizedText,
  PortfolioSectionType,
} from './portfolio.types';

/**
 * Allow-listed component registry.
 *
 * Only components present here can be rendered or saved. The same descriptors
 * drive (a) API prop validation and (b) schema-driven editor forms on web and
 * Android. Unknown component types never render.
 */

export type PortfolioPropFieldKind =
  | 'localizedText'
  | 'localizedTextarea'
  | 'url'
  | 'image'
  | 'text'
  | 'textList'
  | 'objectList'
  /** Opaque source text (HTML/CSS/JS). Preserved byte-for-byte except control chars. */
  | 'code'
  /** Boolean switch. */
  | 'toggle'
  /** Whole number stored as a string, clamped to `min`/`max`. */
  | 'number';

export interface PortfolioPropField {
  key: string;
  label: string;
  kind: PortfolioPropFieldKind;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  /** `textList` / `objectList` item label. */
  itemLabel?: string;
  /** Nested fields for `objectList` rows. */
  itemFields?: PortfolioPropField[];
  /** `number` bounds (inclusive). */
  min?: number;
  max?: number;
  /** Seed value for new sections and for invalid `number` input. */
  defaultValue?: string;
}

export interface PortfolioComponentDefinition {
  type: PortfolioSectionType;
  label: string;
  description: string;
  variants: string[];
  defaultVariant: string;
  fields: PortfolioPropField[];
  /** Short accessibility contract shown in the editor. */
  accessibility: string[];
  supportsLocale: boolean;
  /** MVP components are leaf sections — no arbitrary child composition. */
  allowedChildren: PortfolioSectionType[];
}

const localized = (
  key: string,
  label: string,
  overrides: Partial<PortfolioPropField> = {},
): PortfolioPropField => ({ key, label, kind: 'localizedText', ...overrides });

const localizedArea = (
  key: string,
  label: string,
  overrides: Partial<PortfolioPropField> = {},
): PortfolioPropField => ({ key, label, kind: 'localizedTextarea', ...overrides });

const textList = (
  key: string,
  label: string,
  overrides: Partial<PortfolioPropField> = {},
): PortfolioPropField => ({ key, label, kind: 'textList', ...overrides });

const objectList = (
  key: string,
  label: string,
  itemLabel: string,
  itemFields: PortfolioPropField[],
  overrides: Partial<PortfolioPropField> = {},
): PortfolioPropField => ({
  key,
  label,
  kind: 'objectList',
  itemLabel,
  itemFields,
  ...overrides,
});

export const PORTFOLIO_COMPONENTS: PortfolioComponentDefinition[] = [
  {
    type: 'hero',
    label: 'Hero',
    description: 'Above-the-fold introduction with name, role and call to action.',
    variants: ['centered', 'split-media', 'editorial'],
    defaultVariant: 'centered',
    supportsLocale: true,
    allowedChildren: [],
    accessibility: [
      'Renders exactly one h1',
      'Decorative image needs empty alt; meaningful image needs alt text',
      'CTA contrast is checked against the theme',
    ],
    fields: [
      localized('eyebrow', 'Eyebrow', { maxLength: 60 }),
      localized('headline', 'Headline', { required: true, maxLength: 120 }),
      localizedArea('subheadline', 'Subheadline', { maxLength: 300 }),
      localized('primaryCtaLabel', 'Button label', { maxLength: 40 }),
      {
        key: 'primaryCtaHref',
        label: 'Button link',
        kind: 'url',
        placeholder: 'https://, mailto: or #anchor',
      },
      { key: 'imageUrl', label: 'Image', kind: 'image' },
      localized('imageAlt', 'Image alt text', { maxLength: 160 }),
    ],
  },
  {
    type: 'about',
    label: 'About',
    description: 'Short professional summary.',
    variants: ['prose', 'split'],
    defaultVariant: 'prose',
    supportsLocale: true,
    allowedChildren: [],
    accessibility: ['Body copy is plain text and wraps without horizontal scroll'],
    fields: [
      localized('title', 'Title', { maxLength: 80 }),
      localizedArea('body', 'Body', { required: true, maxLength: 2000 }),
    ],
  },
  {
    type: 'skills',
    label: 'Skills',
    description: 'Skill or tool list.',
    variants: ['chips', 'columns'],
    defaultVariant: 'chips',
    supportsLocale: true,
    allowedChildren: [],
    accessibility: ['Skills render as a semantic list'],
    fields: [
      localized('title', 'Title', { maxLength: 80 }),
      textList('items', 'Skills', { required: true }),
    ],
  },
  {
    type: 'projects',
    label: 'Projects',
    description: 'Selected work, case studies or side projects.',
    variants: ['grid', 'list'],
    defaultVariant: 'grid',
    supportsLocale: true,
    allowedChildren: [],
    accessibility: [
      'Each project is an article with a heading',
      'Project links must use approved protocols',
    ],
    fields: [
      localized('title', 'Title', { maxLength: 80 }),
      objectList('items', 'Projects', 'Project', [
        localized('title', 'Project name', { required: true, maxLength: 120 }),
        localizedArea('description', 'Description', { maxLength: 600 }),
        { key: 'url', label: 'Link', kind: 'url' },
        { key: 'imageUrl', label: 'Image', kind: 'image' },
        textList('tags', 'Tags'),
      ]),
    ],
  },
  {
    type: 'experience',
    label: 'Experience',
    description: 'Roles and work history.',
    variants: ['timeline', 'list'],
    defaultVariant: 'timeline',
    supportsLocale: true,
    allowedChildren: [],
    accessibility: ['Rendered as an ordered list with role and employer headings'],
    fields: [
      localized('title', 'Title', { maxLength: 80 }),
      objectList('items', 'Roles', 'Role', [
        localized('role', 'Role', { required: true, maxLength: 120 }),
        localized('company', 'Company', { maxLength: 120 }),
        localized('period', 'Period', { maxLength: 60 }),
        localizedArea('description', 'Description', { maxLength: 600 }),
      ]),
    ],
  },
  {
    type: 'education',
    label: 'Education',
    description: 'Degrees, courses and certifications.',
    variants: ['list'],
    defaultVariant: 'list',
    supportsLocale: true,
    allowedChildren: [],
    accessibility: ['Rendered as a list with degree and institution'],
    fields: [
      localized('title', 'Title', { maxLength: 80 }),
      objectList('items', 'Education', 'Qualification', [
        localized('degree', 'Degree', { required: true, maxLength: 120 }),
        localized('school', 'Institution', { maxLength: 120 }),
        localized('period', 'Period', { maxLength: 60 }),
        localizedArea('description', 'Description', { maxLength: 400 }),
      ]),
    ],
  },
  {
    type: 'gallery',
    label: 'Gallery',
    description: 'Image-led work such as photography or design.',
    variants: ['grid', 'masonry'],
    defaultVariant: 'grid',
    supportsLocale: true,
    allowedChildren: [],
    accessibility: [
      'Every image needs descriptive alt text or an explicit decorative flag',
      'Images load lazily below the fold',
    ],
    fields: [
      localized('title', 'Title', { maxLength: 80 }),
      objectList('items', 'Images', 'Image', [
        { key: 'url', label: 'Image', kind: 'image', required: true },
        localized('alt', 'Alt text', { maxLength: 160 }),
        localized('caption', 'Caption', { maxLength: 160 }),
      ]),
    ],
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    description: 'Client or colleague quotes.',
    variants: ['cards'],
    defaultVariant: 'cards',
    supportsLocale: true,
    allowedChildren: [],
    accessibility: ['Quotes use blockquote + citation semantics'],
    fields: [
      localized('title', 'Title', { maxLength: 80 }),
      objectList('items', 'Quotes', 'Quote', [
        localizedArea('quote', 'Quote', { required: true, maxLength: 600 }),
        localized('author', 'Author', { maxLength: 120 }),
        localized('role', 'Role / company', { maxLength: 120 }),
      ]),
    ],
  },
  {
    type: 'contact',
    label: 'Contact',
    description: 'Contact details and social links.',
    variants: ['panel'],
    defaultVariant: 'panel',
    supportsLocale: true,
    allowedChildren: [],
    accessibility: [
      'Email uses mailto:, phone uses tel:',
      'Links have discernible labels',
    ],
    fields: [
      localized('title', 'Title', { maxLength: 80 }),
      localizedArea('body', 'Body', { maxLength: 600 }),
      { key: 'email', label: 'Email', kind: 'text', maxLength: 160 },
      { key: 'phone', label: 'Phone', kind: 'text', maxLength: 40 },
      localized('location', 'Location', { maxLength: 160 }),
      objectList('links', 'Links', 'Link', [
        localized('label', 'Label', { required: true, maxLength: 60 }),
        { key: 'url', label: 'URL', kind: 'url', required: true },
      ]),
    ],
  },
  {
    type: 'cta',
    label: 'Call to action',
    description: 'Closing invitation to get in touch or hire.',
    variants: ['band'],
    defaultVariant: 'band',
    supportsLocale: true,
    allowedChildren: [],
    accessibility: ['Renders one button and one heading'],
    fields: [
      localized('headline', 'Headline', { required: true, maxLength: 120 }),
      localizedArea('body', 'Body', { maxLength: 300 }),
      localized('buttonLabel', 'Button label', { maxLength: 40 }),
      { key: 'buttonHref', label: 'Button link', kind: 'url', placeholder: 'https://, mailto: or #anchor' },
    ],
  },
  {
    type: 'custom-code',
    label: 'Custom code',
    description:
      'Paste or import HTML, CSS and JavaScript. It runs only inside a sandboxed frame with no access to this site, your account or your visitors’ cookies.',
    variants: ['sandbox'],
    defaultVariant: 'sandbox',
    supportsLocale: false,
    allowedChildren: [],
    accessibility: [
      'The frame has a required title so screen readers can announce it',
      'Authors must keep motion, flashing and audio under their own control',
      'Provide readable text outside the block for visitors who block frames',
    ],
    fields: [
      {
        key: 'title',
        label: 'Frame title',
        kind: 'text',
        required: true,
        maxLength: 120,
        placeholder: 'Interactive résumé timeline',
      },
      {
        key: 'html',
        label: 'HTML',
        kind: 'code',
        maxLength: 200_000,
        placeholder: '<div class="card">Hello from custom code</div>',
      },
      {
        key: 'css',
        label: 'CSS',
        kind: 'code',
        maxLength: 120_000,
        placeholder: '.card { padding: 24px; border-radius: 16px; }',
      },
      {
        key: 'js',
        label: 'JavaScript',
        kind: 'code',
        maxLength: 200_000,
        placeholder: "document.querySelector('.card')?.addEventListener('click', () => {})",
      },
      {
        key: 'height',
        label: 'Minimum height (px)',
        kind: 'number',
        min: 120,
        max: 3000,
        defaultValue: '520',
        maxLength: 6,
      },
      {
        key: 'allowForms',
        label: 'Allow forms',
        kind: 'toggle',
        defaultValue: 'false',
      },
      {
        key: 'allowPopups',
        label: 'Allow popups',
        kind: 'toggle',
        defaultValue: 'false',
      },
      {
        key: 'allowExternal',
        label: 'Allow external scripts, styles and requests',
        kind: 'toggle',
        defaultValue: 'false',
      },
      {
        key: 'acknowledged',
        label: 'I understand this code runs in visitors’ browsers',
        kind: 'toggle',
        defaultValue: 'false',
      },
    ],
  },
];

const BY_TYPE = new Map(PORTFOLIO_COMPONENTS.map((c) => [c.type, c]));

export function getComponentDefinition(
  type: string,
): PortfolioComponentDefinition | undefined {
  return BY_TYPE.get(type as PortfolioSectionType);
}

export function isKnownSectionType(type: string): type is PortfolioSectionType {
  return BY_TYPE.has(type as PortfolioSectionType);
}

/** Localized empty value map for a locale. */
export function emptyLocalized(locale: string): PortfolioLocalizedText {
  return { [locale]: '' };
}

function defaultFieldValue(
  field: PortfolioPropField,
  locale: string,
): unknown {
  switch (field.kind) {
    case 'localizedText':
    case 'localizedTextarea':
      return emptyLocalized(locale);
    case 'url':
    case 'image':
    case 'text':
    case 'code':
      return '';
    case 'toggle':
      return field.defaultValue === 'true';
    case 'number':
      return field.defaultValue ?? String(field.min ?? 0);
    case 'textList':
      return [];
    case 'objectList':
      return [];
    default:
      return '';
  }
}

/**
 * New section with empty, schema-valid props. Used by the editor
 * "add section" action and by template seeding.
 */
export function defaultPropsFor(
  type: PortfolioSectionType,
  locale: string,
): Record<string, unknown> {
  const def = getComponentDefinition(type);
  if (!def) return {};
  const props: Record<string, unknown> = {};
  for (const field of def.fields) {
    props[field.key] = defaultFieldValue(field, locale);
  }
  return props;
}

export function defaultVariantFor(type: PortfolioSectionType): string {
  return getComponentDefinition(type)?.defaultVariant ?? 'default';
}
