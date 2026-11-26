import {
  buildSiteDocument,
  findTemplate,
  listTemplates,
} from './templates/template-catalog';
import { validatePortfolioDocument } from './site-schema';
import { validateForPublish } from './portfolio.validation';

const PRESERVED_STARTER_IDS = [
  'minimal-swiss-01',
  'editorial-01',
  'bento-01',
  'dev-dark-01',
  'brutalist-01',
  'glass-01',
  'photography-01',
  'designer-case-study-01',
  'writer-01',
  'academic-01',
  'student-01',
  'premium-onepage-01',
  'freelancer-01',
] as const;

describe('portfolio template catalog', () => {
  const templates = listTemplates();

  it('preserves all 13 starter templates and includes 500 expanded templates', () => {
    expect(templates.length).toBe(513);

    for (const id of PRESERVED_STARTER_IDS) {
      expect(findTemplate(id)).toBeDefined();
    }
  });

  it('has unique template ids and names across the entire catalog', () => {
    const ids = new Set<string>();
    const names = new Set<string>();
    for (const template of templates) {
      expect(ids.has(template.id)).toBe(false);
      expect(names.has(template.name)).toBe(false);
      ids.add(template.id);
      names.add(template.name);
    }
  });

  it('produces schema-valid and publishable documents for all 500 generated templates', () => {
    const starterSet = new Set<string>(PRESERVED_STARTER_IDS);
    const expanded = templates.filter((t) => !starterSet.has(t.id));
    expect(expanded.length).toBe(500);

    for (const template of expanded) {
      const doc = buildSiteDocument(template, {
        siteId: `site_${template.id}`,
        name: 'Test Creator',
        slug: `test-${template.id}`.slice(0, 40),
        defaultLocale: 'en-IN',
        locales: ['en-IN'],
      });
      const schemaResult = validatePortfolioDocument(doc);
      if (!schemaResult.ok) {
        throw new Error(
          `Schema validation failed for ${template.id}: ${JSON.stringify(schemaResult.issues)}`,
        );
      }
      const publishResult = validateForPublish(schemaResult.document!);
      if (!publishResult.ok) {
        throw new Error(
          `Publish validation failed for ${template.id}: ${JSON.stringify(publishResult.errors)}`,
        );
      }
    }
  });
});
