import type {
  PortfolioComponentDefinition,
  PortfolioDocument,
  PortfolioPropField,
  PortfolioSection,
  PortfolioSectionStyle,
  PortfolioTheme,
} from '../../core/models/portfolio.model';

/** Structured clone that also works in older Android WebViews. */
export function cloneDocument(document: PortfolioDocument): PortfolioDocument {
  return JSON.parse(JSON.stringify(document)) as PortfolioDocument;
}

export function editorId(prefix: string): string {
  const random =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

/** Mirrors the API registry's `defaultFieldValue` helper. */
export function emptyValueForField(field: PortfolioPropField, locale: string): unknown {
  if (field.kind === 'localizedText' || field.kind === 'localizedTextarea') {
    return { [locale]: field.defaultValue ?? '' };
  }
  if (field.kind === 'toggle') {
    return field.defaultValue === 'true';
  }
  if (field.kind === 'number') {
    return field.defaultValue ?? String(field.min ?? 0);
  }
  if (field.kind === 'textList' || field.kind === 'objectList') {
    return [];
  }
  return field.defaultValue ?? '';
}

export function defaultPropsFor(fields: PortfolioPropField[], locale: string): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  for (const field of fields) {
    props[field.key] = emptyValueForField(field, locale);
  }
  return props;
}

export function createSection(definition: PortfolioComponentDefinition, locale: string): PortfolioSection {
  return {
    id: editorId(definition.type),
    type: definition.type,
    variant: definition.defaultVariant || definition.variants[0] || 'default',
    hidden: false,
    props: defaultPropsFor(definition.fields, locale),
  };
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to > items.length) {
    return items;
  }
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(Math.min(to, next.length), 0, moved);
  return next;
}

export function updateSection(
  document: PortfolioDocument,
  sectionId: string,
  update: (section: PortfolioSection) => PortfolioSection,
): PortfolioDocument {
  const next = cloneDocument(document);
  const sections = next.pages[0]?.sections ?? [];
  const index = sections.findIndex((section) => section.id === sectionId);
  if (index < 0) return next;
  sections[index] = update(sections[index]);
  return next;
}

export function setSectionProp(section: PortfolioSection, key: string, value: unknown): PortfolioSection {
  return { ...section, props: { ...section.props, [key]: value } };
}

export function setSectionStyle(section: PortfolioSection, style: PortfolioSectionStyle): PortfolioSection {
  return { ...section, style: { ...section.style, ...style } };
}

export function setLocalizedValue(value: unknown, locale: string, text: string): Record<string, string> {
  const map: Record<string, string> =
    value && typeof value === 'object' && !Array.isArray(value) ? { ...(value as Record<string, string>) } : {};
  map[locale] = text;
  return map;
}

export function localizedForEdit(value: unknown, locale: string): string {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  const map = value as Record<string, unknown>;
  const direct = map[locale];
  if (typeof direct === 'string') return direct;
  const fallback = map['en-IN'];
  return typeof fallback === 'string' ? fallback : '';
}

export function updateListItem(
  section: PortfolioSection,
  fieldKey: string,
  index: number,
  value: unknown,
): PortfolioSection {
  const list = Array.isArray(section.props[fieldKey]) ? [...(section.props[fieldKey] as unknown[])] : [];
  if (index < 0 || index >= list.length) return section;
  list[index] = value;
  return setSectionProp(section, fieldKey, list);
}

export function updateRowProp(
  section: PortfolioSection,
  fieldKey: string,
  rowIndex: number,
  propKey: string,
  value: unknown,
): PortfolioSection {
  const rows = Array.isArray(section.props[fieldKey])
    ? [...(section.props[fieldKey] as Record<string, unknown>[])]
    : [];
  const row = rows[rowIndex];
  if (!row) return section;
  rows[rowIndex] = { ...row, [propKey]: value };
  return setSectionProp(section, fieldKey, rows);
}

export function themeWithToken(
  theme: PortfolioTheme,
  token: keyof PortfolioTheme['tokens'],
  value: string,
): PortfolioTheme {
  return { ...theme, tokens: { ...theme.tokens, [token]: value } };
}

export function sectionIssueMap(
  issues: { severity: string; sectionId?: string }[],
): Record<string, { errors: number; warnings: number }> {
  const map: Record<string, { errors: number; warnings: number }> = {};
  for (const issue of issues) {
    if (!issue.sectionId) continue;
    const entry = map[issue.sectionId] ?? { errors: 0, warnings: 0 };
    if (issue.severity === 'error') entry.errors += 1;
    if (issue.severity === 'warning') entry.warnings += 1;
    map[issue.sectionId] = entry;
  }
  return map;
}
