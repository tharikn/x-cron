import type {
  PortfolioSection,
  PortfolioValidationIssue,
} from '../../core/models/portfolio.model';
import { locateIssue } from './portfolio-editor.page';

const sections = [
  { id: 'hero-1', type: 'hero', variant: 'split', props: {} },
  { id: 'about-1', type: 'about', variant: 'stacked', props: {} },
  { id: 'projects-1', type: 'projects', variant: 'grid', props: {} },
] as PortfolioSection[];

function issue(code: string, path?: string, sectionId?: string): PortfolioValidationIssue {
  return { severity: 'error', code, message: 'Invalid', ...(path ? { path } : {}), ...(sectionId ? { sectionId } : {}) };
}

describe('portfolio editor validation targeting', () => {
  it('maps a schema field path to its section and field key', () => {
    expect(
      locateIssue(issue('PORTFOLIO_TEXT_REQUIRED', 'pages[0].sections[1].props.headline'), sections),
    ).toEqual({ sectionId: 'about-1', fieldKey: 'headline' });
  });

  it('maps an objectList row path to the nested field', () => {
    expect(
      locateIssue(issue('PORTFOLIO_URL_INVALID', 'pages[0].sections[2].props.items[1].url'), sections),
    ).toEqual({ sectionId: 'projects-1', fieldKey: 'items', rowIndex: 1, nestedKey: 'url' });
  });

  it('maps a variant error to the Layout control', () => {
    expect(
      locateIssue(issue('PORTFOLIO_VARIANT_UNKNOWN', 'pages[0].sections[0]', 'hero-1'), sections),
    ).toEqual({ sectionId: 'hero-1', fieldKey: 'variant' });
  });

  it('maps SEO paths to the matching form control', () => {
    expect(
      locateIssue(issue('PORTFOLIO_SEO_DESCRIPTION_LONG', 'pages[0].seo.description'), sections),
    ).toEqual({ seoKey: 'description' });
  });

  it('uses sectionId when publish rules do not include a field path', () => {
    expect(
      locateIssue(issue('PORTFOLIO_CONTACT_EMAIL_INVALID', undefined, 'about-1'), sections),
    ).toEqual({ sectionId: 'about-1', fieldKey: 'email' });
  });

  it('leaves document-wide issues untargeted', () => {
    expect(locateIssue(issue('PORTFOLIO_NO_VISIBLE_SECTIONS', 'pages[0].sections'), sections)).toEqual({});
  });
});
