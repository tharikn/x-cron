// Auto-generated template seeds — Corporate Professional (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_CORPORATE: SeedTemplate[] = [
  {
    id: 'corporate-01',
    name: 'Executive Brief',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Alabaster Cobalt light theme for management consultants — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fafbfe 0%, #dae2fd 55%, #2457f5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1320',
        accent: '#2457f5',
        surface: '#fafbfe',
        text: '#1c2436',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Management Consultant'),
          headline: l('Your Name'),
          subheadline: l('Twelve years leading enterprise transformations, cross-border integrations and high-stakes operational turnarounds.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Twelve years leading enterprise transformations, cross-border integrations and high-stakes operational turnarounds. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Corporate Strategy', 'Financial Modeling', 'P&L Ownership', 'M&A Integration'],
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Gallery'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
              alt: l('Modern residential pavilion exterior'),
              caption: l('Courtyard house'),
            },
            {
              url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
              alt: l('Daylit minimalist living space'),
              caption: l('Interior study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
              alt: l('Contemporary glass facade geometry'),
              caption: l('Commercial tower'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Post-Merger Integration'),
              description: l('Unified operations, ERP billing and 420 staff across 3 regional business units in 6 months.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['M&A', 'Operations'],
            },
            {
              title: l('Working Capital Turnaround'),
              description: l('Redesigned procurement and inventory forecasting, unlocking $18M in free cash flow.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Finance', 'Strategy'],
            },
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Get in touch'),
          body: l('Available for select collaborations, advisory and full-time conversations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Remote'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'corporate-02',
    name: 'Boardroom',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Vellum Rust light theme for senior business analysts — Georgia headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #faf4ea 0%, #eed9cb 55%, #a8431a 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261a12',
        accent: '#a8431a',
        surface: '#faf4ea',
        text: '#33241b',
        fontHeading: 'Georgia',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Senior Business Analyst'),
          headline: l('Operational clarity for scaling organizations.'),
          subheadline: l('Partnering with C-suite leaders on capital allocation, org design and measurable KPI governance.'),
          primaryCtaLabel: l('View work'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Program Governance', 'Risk Management', 'OKR Frameworks', 'Board Reporting'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Working Capital Turnaround'),
              description: l('Redesigned procurement and inventory forecasting, unlocking $18M in free cash flow.'),
              url: '',
              imageUrl: '',
              tags: ['Finance', 'Strategy'],
            },
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: '',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Director of Strategy & Ops'),
              company: l('Apex Industrial Group'),
              period: l('2021 — Present'),
              description: l('Lead strategic planning, annual operating budgets and cross-unit initiatives.'),
            },
            {
              role: l('Engagement Manager'),
              company: l('Bridgewater Advisory'),
              period: l('2017 — 2021'),
              description: l('Advised enterprise clients across manufacturing, banking and logistics.'),
            }
          ],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Brings instant executive calm to the boardroom and follows through on every operational detail.'),
              author: l('Rajeshwari Iyer'),
              role: l('Chief Operating Officer'),
            }
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Contact'),
          body: l('Available for select collaborations, advisory and full-time conversations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Hyderabad, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'corporate-03',
    name: 'Blue Chip',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Obsidian Emerald dark theme for vp of operationss — System headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
        fontHeading: 'System',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('VP of Operations'),
          headline: l('Strategy backed by execution discipline.'),
          subheadline: l('Delivering complex multi-million-dollar programs on schedule, under budget and with full stakeholder buy-in.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Delivering complex multi-million-dollar programs on schedule, under budget and with full stakeholder buy-in. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Director of Strategy & Ops'),
              company: l('Apex Industrial Group'),
              period: l('2021 — Present'),
              description: l('Lead strategic planning, annual operating budgets and cross-unit initiatives.'),
            },
            {
              role: l('Engagement Manager'),
              company: l('Bridgewater Advisory'),
              period: l('2017 — 2021'),
              description: l('Advised enterprise clients across manufacturing, banking and logistics.'),
            }
          ],
        },
      },
      {
        type: 'education',
        variant: 'list',
        props: {
          title: l('Education'),
          items: [
            {
              degree: l('PGDM / MBA'),
              school: l('IIM Kozhikode'),
              period: l('2015 — 2017'),
              description: l('Strategy, corporate finance and operations research.'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            },
            {
              title: l('Post-Merger Integration'),
              description: l('Unified operations, ERP billing and 420 staff across 3 regional business units in 6 months.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['M&A', 'Operations'],
            }
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Work together'),
          body: l('Available for select collaborations, advisory and full-time conversations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Coimbatore, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'corporate-04',
    name: 'Quarterly',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Porcelain Emerald light theme for corporate strategy directors — Outfit headings with centered hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d1f18',
        accent: '#0a8754',
        surface: '#f9fcfa',
        text: '#192a22',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Corporate Strategy Director'),
          headline: l('Your Name'),
          subheadline: l('Twelve years leading enterprise transformations, cross-border integrations and high-stakes operational turnarounds.'),
          primaryCtaLabel: l('Book a call'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Corporate Strategy', 'Financial Modeling', 'P&L Ownership', 'M&A Integration'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Director of Strategy & Ops'),
              company: l('Apex Industrial Group'),
              period: l('2021 — Present'),
              description: l('Lead strategic planning, annual operating budgets and cross-unit initiatives.'),
            },
            {
              role: l('Engagement Manager'),
              company: l('Bridgewater Advisory'),
              period: l('2017 — 2021'),
              description: l('Advised enterprise clients across manufacturing, banking and logistics.'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Post-Merger Integration'),
              description: l('Unified operations, ERP billing and 420 staff across 3 regional business units in 6 months.'),
              url: '',
              imageUrl: '',
              tags: ['M&A', 'Operations'],
            },
            {
              title: l('Working Capital Turnaround'),
              description: l('Redesigned procurement and inventory forecasting, unlocking $18M in free cash flow.'),
              url: '',
              imageUrl: '',
              tags: ['Finance', 'Strategy'],
            },
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: '',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'cta',
        variant: 'band',
        props: {
          headline: l('Open to select work this quarter.'),
          body: l('Send a short note with context, goals and timeline.'),
          buttonLabel: l('Email me'),
          buttonHref: 'mailto:you@example.com',
        },
      }
    ],
  },
  {
    id: 'corporate-05',
    name: 'Benchmark',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Newsprint Navy light theme for financial planning leads — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f7f4ec 0%, #d6d9e3 55%, #1e40af 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#161b26',
        accent: '#1e40af',
        surface: '#f7f4ec',
        text: '#232936',
        fontHeading: 'Georgia',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Financial Planning Lead'),
          headline: l('Turning financial and operational complexity into growth.'),
          subheadline: l('Partnering with C-suite leaders on capital allocation, org design and measurable KPI governance.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Working Capital Turnaround'),
              description: l('Redesigned procurement and inventory forecasting, unlocking $18M in free cash flow.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Finance', 'Strategy'],
            },
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Partnering with C-suite leaders on capital allocation, org design and measurable KPI governance. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Director of Strategy & Ops'),
              company: l('Apex Industrial Group'),
              period: l('2021 — Present'),
              description: l('Lead strategic planning, annual operating budgets and cross-unit initiatives.'),
            },
            {
              role: l('Engagement Manager'),
              company: l('Bridgewater Advisory'),
              period: l('2017 — 2021'),
              description: l('Advised enterprise clients across manufacturing, banking and logistics.'),
            }
          ],
        },
      },
      {
        type: 'cta',
        variant: 'band',
        props: {
          headline: l('Let’s build something meaningful.'),
          body: l('Send a short note with context, goals and timeline.'),
          buttonLabel: l('Say hello'),
          buttonHref: 'mailto:you@example.com',
        },
      }
    ],
  },
  {
    id: 'corporate-06',
    name: 'Governance',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Midnight Cobalt dark theme for enterprise program managers — System headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eff6ff',
        accent: '#60a5fa',
        surface: '#070b16',
        text: '#d8e4f8',
        fontHeading: 'System',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Enterprise Program Manager'),
          headline: l('Trusted advisor to leadership teams.'),
          subheadline: l('Delivering complex multi-million-dollar programs on schedule, under budget and with full stakeholder buy-in.'),
          primaryCtaLabel: l('Start a project'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'gallery',
        variant: 'masonry',
        props: {
          title: l('Visual Archive'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
              alt: l('Daylit minimalist living space'),
              caption: l('Interior study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
              alt: l('Contemporary glass facade geometry'),
              caption: l('Commercial tower'),
            },
            {
              url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
              alt: l('Sculptural concrete stairwell'),
              caption: l('Public atrium'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('About'),
          body: l('Delivering complex multi-million-dollar programs on schedule, under budget and with full stakeholder buy-in. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: '',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            },
            {
              title: l('Post-Merger Integration'),
              description: l('Unified operations, ERP billing and 420 staff across 3 regional business units in 6 months.'),
              url: '',
              imageUrl: '',
              tags: ['M&A', 'Operations'],
            }
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Contact'),
          body: l('Available for select collaborations, advisory and full-time conversations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Hyderabad, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'corporate-07',
    name: 'Mandate',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Chalk Vermilion light theme for chief people officers — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fcfbfa 0%, #f7ded9 55%, #d9381e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#191414',
        accent: '#d9381e',
        surface: '#fcfbfa',
        text: '#241e1d',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Chief People Officer'),
          headline: l('Your Name'),
          subheadline: l('Twelve years leading enterprise transformations, cross-border integrations and high-stakes operational turnarounds.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Profile'),
          body: l('Twelve years leading enterprise transformations, cross-border integrations and high-stakes operational turnarounds. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Selected Frames'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
              alt: l('Contemporary glass facade geometry'),
              caption: l('Commercial tower'),
            },
            {
              url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
              alt: l('Sculptural concrete stairwell'),
              caption: l('Public atrium'),
            },
            {
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
              alt: l('Modern residential pavilion exterior'),
              caption: l('Courtyard house'),
            }
          ],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Brings instant executive calm to the boardroom and follows through on every operational detail.'),
              author: l('Rajeshwari Iyer'),
              role: l('Chief Operating Officer'),
            }
          ],
        },
      },
      {
        type: 'cta',
        variant: 'band',
        props: {
          headline: l('Open to select work this quarter.'),
          body: l('Send a short note with context, goals and timeline.'),
          buttonLabel: l('Email me'),
          buttonHref: 'mailto:you@example.com',
        },
      }
    ],
  },
  {
    id: 'corporate-08',
    name: 'Prospectus',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Parchment Olive light theme for risk & compliance directors — Georgia headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f8f5ea 0%, #e1e0cc 55%, #5c6b24 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1f2314',
        accent: '#5c6b24',
        surface: '#f8f5ea',
        text: '#2c301e',
        fontHeading: 'Georgia',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Risk & Compliance Director'),
          headline: l('Operational clarity for scaling organizations.'),
          subheadline: l('Partnering with C-suite leaders on capital allocation, org design and measurable KPI governance.'),
          primaryCtaLabel: l('Connect'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Practice'),
          body: l('Partnering with C-suite leaders on capital allocation, org design and measurable KPI governance. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Program Governance', 'Risk Management', 'OKR Frameworks', 'Board Reporting'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Working Capital Turnaround'),
              description: l('Redesigned procurement and inventory forecasting, unlocking $18M in free cash flow.'),
              url: '',
              imageUrl: '',
              tags: ['Finance', 'Strategy'],
            },
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: '',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Inquiries'),
          body: l('Available for select collaborations, advisory and full-time conversations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'corporate-09',
    name: 'Ledger Pro',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Abyssal Violet dark theme for supply chain strategists — System headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f5f3ff',
        accent: '#a78bfa',
        surface: '#0b0917',
        text: '#e0daf8',
        fontHeading: 'System',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Supply Chain Strategist'),
          headline: l('Strategy backed by execution discipline.'),
          subheadline: l('Delivering complex multi-million-dollar programs on schedule, under budget and with full stakeholder buy-in.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Delivering complex multi-million-dollar programs on schedule, under budget and with full stakeholder buy-in. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            },
            {
              title: l('Post-Merger Integration'),
              description: l('Unified operations, ERP billing and 420 staff across 3 regional business units in 6 months.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['M&A', 'Operations'],
            }
          ],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Brings instant executive calm to the boardroom and follows through on every operational detail.'),
              author: l('Rajeshwari Iyer'),
              role: l('Chief Operating Officer'),
            }
          ],
        },
      },
      {
        type: 'cta',
        variant: 'band',
        props: {
          headline: l('Start a conversation.'),
          body: l('Send a short note with context, goals and timeline.'),
          buttonLabel: l('Book an intro'),
          buttonHref: 'mailto:you@example.com',
        },
      }
    ],
  },
  {
    id: 'corporate-10',
    name: 'Summit',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Ice Indigo light theme for enterprise account directors — Outfit headings with centered hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f5f7ff 0%, #dcdcfb 55%, #4f46e5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#11132b',
        accent: '#4f46e5',
        surface: '#f5f7ff',
        text: '#1e2240',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Enterprise Account Director'),
          headline: l('Your Name'),
          subheadline: l('Twelve years leading enterprise transformations, cross-border integrations and high-stakes operational turnarounds.'),
          primaryCtaLabel: l('View work'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Post-Merger Integration'),
              description: l('Unified operations, ERP billing and 420 staff across 3 regional business units in 6 months.'),
              url: '',
              imageUrl: '',
              tags: ['M&A', 'Operations'],
            },
            {
              title: l('Working Capital Turnaround'),
              description: l('Redesigned procurement and inventory forecasting, unlocking $18M in free cash flow.'),
              url: '',
              imageUrl: '',
              tags: ['Finance', 'Strategy'],
            },
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: '',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Corporate Strategy', 'Financial Modeling', 'P&L Ownership', 'M&A Integration'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Brings instant executive calm to the boardroom and follows through on every operational detail.'),
              author: l('Rajeshwari Iyer'),
              role: l('Chief Operating Officer'),
            }
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Contact'),
          body: l('Available for select collaborations, advisory and full-time conversations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Hyderabad, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'corporate-11',
    name: 'Meridian',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Cream Burgundy light theme for m&a integration leads — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fcf8f2 0%, #eed5d6 55%, #9f1239 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#281217',
        accent: '#9f1239',
        surface: '#fcf8f2',
        text: '#381d23',
        fontHeading: 'Georgia',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('M&A Integration Lead'),
          headline: l('Turning financial and operational complexity into growth.'),
          subheadline: l('Partnering with C-suite leaders on capital allocation, org design and measurable KPI governance.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Partnering with C-suite leaders on capital allocation, org design and measurable KPI governance. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Program Governance', 'Risk Management', 'OKR Frameworks', 'Board Reporting'],
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Selected Frames'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
              alt: l('Contemporary glass facade geometry'),
              caption: l('Commercial tower'),
            },
            {
              url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
              alt: l('Sculptural concrete stairwell'),
              caption: l('Public atrium'),
            },
            {
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
              alt: l('Modern residential pavilion exterior'),
              caption: l('Courtyard house'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Working Capital Turnaround'),
              description: l('Redesigned procurement and inventory forecasting, unlocking $18M in free cash flow.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Finance', 'Strategy'],
            },
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Work together'),
          body: l('Available for select collaborations, advisory and full-time conversations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Coimbatore, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'corporate-12',
    name: 'Capital Grid',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Charcoal Amber dark theme for internal audit heads — System headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fffbeb',
        accent: '#fbbf24',
        surface: '#100e0a',
        text: '#ede5ce',
        fontHeading: 'System',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Internal Audit Head'),
          headline: l('Trusted advisor to leadership teams.'),
          subheadline: l('Delivering complex multi-million-dollar programs on schedule, under budget and with full stakeholder buy-in.'),
          primaryCtaLabel: l('Book a call'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Supply Chain Optimization', 'Change Management', 'Vendor Negotiation', 'ERP Rollout'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: '',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            },
            {
              title: l('Post-Merger Integration'),
              description: l('Unified operations, ERP billing and 420 staff across 3 regional business units in 6 months.'),
              url: '',
              imageUrl: '',
              tags: ['M&A', 'Operations'],
            }
          ],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Director of Strategy & Ops'),
              company: l('Apex Industrial Group'),
              period: l('2021 — Present'),
              description: l('Lead strategic planning, annual operating budgets and cross-unit initiatives.'),
            },
            {
              role: l('Engagement Manager'),
              company: l('Bridgewater Advisory'),
              period: l('2017 — 2021'),
              description: l('Advised enterprise clients across manufacturing, banking and logistics.'),
            }
          ],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Brings instant executive calm to the boardroom and follows through on every operational detail.'),
              author: l('Rajeshwari Iyer'),
              role: l('Chief Operating Officer'),
            }
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Inquiries'),
          body: l('Available for select collaborations, advisory and full-time conversations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'corporate-13',
    name: 'Charter',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Linen Terracotta light theme for change management partners — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fdf8f3 0%, #f4dfd5 55%, #c2512b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261710',
        accent: '#c2512b',
        surface: '#fdf8f3',
        text: '#332219',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Change Management Partner'),
          headline: l('Your Name'),
          subheadline: l('Twelve years leading enterprise transformations, cross-border integrations and high-stakes operational turnarounds.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Twelve years leading enterprise transformations, cross-border integrations and high-stakes operational turnarounds. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Director of Strategy & Ops'),
              company: l('Apex Industrial Group'),
              period: l('2021 — Present'),
              description: l('Lead strategic planning, annual operating budgets and cross-unit initiatives.'),
            },
            {
              role: l('Engagement Manager'),
              company: l('Bridgewater Advisory'),
              period: l('2017 — 2021'),
              description: l('Advised enterprise clients across manufacturing, banking and logistics.'),
            }
          ],
        },
      },
      {
        type: 'education',
        variant: 'list',
        props: {
          title: l('Education'),
          items: [
            {
              degree: l('PGDM / MBA'),
              school: l('IIM Kozhikode'),
              period: l('2015 — 2017'),
              description: l('Strategy, corporate finance and operations research.'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Post-Merger Integration'),
              description: l('Unified operations, ERP billing and 420 staff across 3 regional business units in 6 months.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['M&A', 'Operations'],
            },
            {
              title: l('Working Capital Turnaround'),
              description: l('Redesigned procurement and inventory forecasting, unlocking $18M in free cash flow.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Finance', 'Strategy'],
            },
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Get in touch'),
          body: l('Available for select collaborations, advisory and full-time conversations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Remote'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'corporate-14',
    name: 'Enterprise',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Oatmeal Forest light theme for pmo directors — Georgia headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f9f5ec 0%, #d7e3d2 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#142219',
        accent: '#15803d',
        surface: '#f9f5ec',
        text: '#213026',
        fontHeading: 'Georgia',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('PMO Director'),
          headline: l('Operational clarity for scaling organizations.'),
          subheadline: l('Partnering with C-suite leaders on capital allocation, org design and measurable KPI governance.'),
          primaryCtaLabel: l('Start a project'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Program Governance', 'Risk Management', 'OKR Frameworks', 'Board Reporting'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Director of Strategy & Ops'),
              company: l('Apex Industrial Group'),
              period: l('2021 — Present'),
              description: l('Lead strategic planning, annual operating budgets and cross-unit initiatives.'),
            },
            {
              role: l('Engagement Manager'),
              company: l('Bridgewater Advisory'),
              period: l('2017 — 2021'),
              description: l('Advised enterprise clients across manufacturing, banking and logistics.'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Working Capital Turnaround'),
              description: l('Redesigned procurement and inventory forecasting, unlocking $18M in free cash flow.'),
              url: '',
              imageUrl: '',
              tags: ['Finance', 'Strategy'],
            },
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: '',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'cta',
        variant: 'band',
        props: {
          headline: l('Let’s build something meaningful.'),
          body: l('Send a short note with context, goals and timeline.'),
          buttonLabel: l('Say hello'),
          buttonHref: 'mailto:you@example.com',
        },
      }
    ],
  },
  {
    id: 'corporate-15',
    name: 'Advisory',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Velvet Rose dark theme for investor relations leads — System headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
        fontHeading: 'System',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Investor Relations Lead'),
          headline: l('Strategy backed by execution discipline.'),
          subheadline: l('Delivering complex multi-million-dollar programs on schedule, under budget and with full stakeholder buy-in.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            },
            {
              title: l('Post-Merger Integration'),
              description: l('Unified operations, ERP billing and 420 staff across 3 regional business units in 6 months.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['M&A', 'Operations'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Delivering complex multi-million-dollar programs on schedule, under budget and with full stakeholder buy-in. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Director of Strategy & Ops'),
              company: l('Apex Industrial Group'),
              period: l('2021 — Present'),
              description: l('Lead strategic planning, annual operating budgets and cross-unit initiatives.'),
            },
            {
              role: l('Engagement Manager'),
              company: l('Bridgewater Advisory'),
              period: l('2017 — 2021'),
              description: l('Advised enterprise clients across manufacturing, banking and logistics.'),
            }
          ],
        },
      },
      {
        type: 'cta',
        variant: 'band',
        props: {
          headline: l('Start a conversation.'),
          body: l('Send a short note with context, goals and timeline.'),
          buttonLabel: l('Book an intro'),
          buttonHref: 'mailto:you@example.com',
        },
      }
    ],
  },
  {
    id: 'corporate-16',
    name: 'Anchor',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Nordic Spruce light theme for procurement directors — Outfit headings with centered hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f4fafa 0%, #d2e7e7 55%, #0e7c7b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0c1c1c',
        accent: '#0e7c7b',
        surface: '#f4fafa',
        text: '#172b2b',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Procurement Director'),
          headline: l('Your Name'),
          subheadline: l('Twelve years leading enterprise transformations, cross-border integrations and high-stakes operational turnarounds.'),
          primaryCtaLabel: l('Connect'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'gallery',
        variant: 'masonry',
        props: {
          title: l('Studio Highlights'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
              alt: l('Sculptural concrete stairwell'),
              caption: l('Public atrium'),
            },
            {
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
              alt: l('Modern residential pavilion exterior'),
              caption: l('Courtyard house'),
            },
            {
              url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
              alt: l('Daylit minimalist living space'),
              caption: l('Interior study'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('About'),
          body: l('Twelve years leading enterprise transformations, cross-border integrations and high-stakes operational turnarounds. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Post-Merger Integration'),
              description: l('Unified operations, ERP billing and 420 staff across 3 regional business units in 6 months.'),
              url: '',
              imageUrl: '',
              tags: ['M&A', 'Operations'],
            },
            {
              title: l('Working Capital Turnaround'),
              description: l('Redesigned procurement and inventory forecasting, unlocking $18M in free cash flow.'),
              url: '',
              imageUrl: '',
              tags: ['Finance', 'Strategy'],
            },
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: '',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Inquiries'),
          body: l('Available for select collaborations, advisory and full-time conversations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'corporate-17',
    name: 'Fiduciary',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Saffron Ink light theme for commercial operations leads — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fdf9ef 0%, #f2e0cd 55%, #b45309 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#23190c',
        accent: '#b45309',
        surface: '#fdf9ef',
        text: '#332514',
        fontHeading: 'Georgia',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Commercial Operations Lead'),
          headline: l('Turning financial and operational complexity into growth.'),
          subheadline: l('Partnering with C-suite leaders on capital allocation, org design and measurable KPI governance.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Profile'),
          body: l('Partnering with C-suite leaders on capital allocation, org design and measurable KPI governance. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Gallery'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
              alt: l('Modern residential pavilion exterior'),
              caption: l('Courtyard house'),
            },
            {
              url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
              alt: l('Daylit minimalist living space'),
              caption: l('Interior study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
              alt: l('Contemporary glass facade geometry'),
              caption: l('Commercial tower'),
            }
          ],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Brings instant executive calm to the boardroom and follows through on every operational detail.'),
              author: l('Rajeshwari Iyer'),
              role: l('Chief Operating Officer'),
            }
          ],
        },
      },
      {
        type: 'cta',
        variant: 'band',
        props: {
          headline: l('Let’s build something meaningful.'),
          body: l('Send a short note with context, goals and timeline.'),
          buttonLabel: l('Say hello'),
          buttonHref: 'mailto:you@example.com',
        },
      }
    ],
  },
  {
    id: 'corporate-18',
    name: 'Compass',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Deep Teal dark theme for transformation advisors — System headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f0fdfa',
        accent: '#2dd4bf',
        surface: '#071112',
        text: '#cce8e4',
        fontHeading: 'System',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Transformation Advisor'),
          headline: l('Trusted advisor to leadership teams.'),
          subheadline: l('Delivering complex multi-million-dollar programs on schedule, under budget and with full stakeholder buy-in.'),
          primaryCtaLabel: l('View work'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Practice'),
          body: l('Delivering complex multi-million-dollar programs on schedule, under budget and with full stakeholder buy-in. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Supply Chain Optimization', 'Change Management', 'Vendor Negotiation', 'ERP Rollout'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: '',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            },
            {
              title: l('Post-Merger Integration'),
              description: l('Unified operations, ERP billing and 420 staff across 3 regional business units in 6 months.'),
              url: '',
              imageUrl: '',
              tags: ['M&A', 'Operations'],
            }
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Contact'),
          body: l('Available for select collaborations, advisory and full-time conversations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Hyderabad, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'corporate-19',
    name: 'Keystone',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Cloud Plum light theme for customer success vps — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fbf8fe 0%, #e8d8f7 55%, #7e22ce 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1e1024',
        accent: '#7e22ce',
        surface: '#fbf8fe',
        text: '#2b1b33',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Customer Success VP'),
          headline: l('Your Name'),
          subheadline: l('Twelve years leading enterprise transformations, cross-border integrations and high-stakes operational turnarounds.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Twelve years leading enterprise transformations, cross-border integrations and high-stakes operational turnarounds. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Post-Merger Integration'),
              description: l('Unified operations, ERP billing and 420 staff across 3 regional business units in 6 months.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['M&A', 'Operations'],
            },
            {
              title: l('Working Capital Turnaround'),
              description: l('Redesigned procurement and inventory forecasting, unlocking $18M in free cash flow.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Finance', 'Strategy'],
            },
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Brings instant executive calm to the boardroom and follows through on every operational detail.'),
              author: l('Rajeshwari Iyer'),
              role: l('Chief Operating Officer'),
            }
          ],
        },
      },
      {
        type: 'cta',
        variant: 'band',
        props: {
          headline: l('Open to select work this quarter.'),
          body: l('Send a short note with context, goals and timeline.'),
          buttonLabel: l('Email me'),
          buttonHref: 'mailto:you@example.com',
        },
      }
    ],
  },
  {
    id: 'corporate-20',
    name: 'Vanguard',
    category: 'corporate',
    family: 'Corporate Professional',
    audience: ['general professional', 'consultant', 'manager'],
    description: 'Sepia Slate light theme for portfolio operations leads — Georgia headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f5f0e6 0%, #e0d8cb 55%, #6b4f35 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1d1c1a',
        accent: '#6b4f35',
        surface: '#f5f0e6',
        text: '#2c2a26',
        fontHeading: 'Georgia',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Portfolio Operations Lead'),
          headline: l('Operational clarity for scaling organizations.'),
          subheadline: l('Partnering with C-suite leaders on capital allocation, org design and measurable KPI governance.'),
          primaryCtaLabel: l('Book a call'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Working Capital Turnaround'),
              description: l('Redesigned procurement and inventory forecasting, unlocking $18M in free cash flow.'),
              url: '',
              imageUrl: '',
              tags: ['Finance', 'Strategy'],
            },
            {
              title: l('Global PMO Modernization'),
              description: l('Standardized delivery governance across 22 engineering and business transformation programs.'),
              url: '',
              imageUrl: '',
              tags: ['PMO', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Program Governance', 'Risk Management', 'OKR Frameworks', 'Board Reporting'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Brings instant executive calm to the boardroom and follows through on every operational detail.'),
              author: l('Rajeshwari Iyer'),
              role: l('Chief Operating Officer'),
            }
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Inquiries'),
          body: l('Available for select collaborations, advisory and full-time conversations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
];
