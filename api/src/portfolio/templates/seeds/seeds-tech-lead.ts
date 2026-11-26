// Auto-generated template seeds — Tech Leadership (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_TECH_LEAD: SeedTemplate[] = [
  {
    id: 'tech-lead-01',
    name: 'Tech Radar',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Alabaster Cobalt light theme for vp of engineerings — Outfit headings with editorial hero and comfortable spacing.',
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
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('VP of Engineering'),
          headline: l('Your Name'),
          subheadline: l('Engineering leader who has scaled teams from 8 to 95 engineers while keeping architecture clean and attrition low.'),
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
          body: l('Engineering leader who has scaled teams from 8 to 95 engineers while keeping architecture clean and attrition low. Based in Visakhapatnam, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Engineering Leadership', 'Org Design', 'RFC & Architecture', 'Hiring & Mentoring'],
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Gallery'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Interface system exploration'),
              caption: l('System UI'),
            },
            {
              url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
              alt: l('Brand identity and typography specimen'),
              caption: l('Brand identity'),
            },
            {
              url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop&q=80',
              alt: l('Interactive product screen study'),
              caption: l('Product UI'),
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
              title: l('Monolith to Modular Services'),
              description: l('Led 40-engineer architecture evolution over 4 quarters with zero customer-facing downtime.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Scale'],
            },
            {
              title: l('Cloud Cost Optimization'),
              description: l('Instituted FinOps telemetry and spot-compute migration, saving $1.9M annually.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['FinOps', 'Cloud'],
            },
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
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
          location: l('Visakhapatnam, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'tech-lead-02',
    name: 'RFC Draft',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Obsidian Emerald dark theme for engineering managers — System headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Engineering Manager'),
          headline: l('Scaling high-trust engineering teams and durable systems.'),
          subheadline: l('Focusing on clear RFC culture, blameless incident learning and career ladders that reward deep craft.'),
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
          items: ['Distributed Systems', 'SLO Governance', 'Cloud FinOps', 'Incident Culture'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Cloud Cost Optimization'),
              description: l('Instituted FinOps telemetry and spot-compute migration, saving $1.9M annually.'),
              url: '',
              imageUrl: '',
              tags: ['FinOps', 'Cloud'],
            },
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: '',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
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
              role: l('Director of Engineering'),
              company: l('LedgerScale'),
              period: l('2022 — Present'),
              description: l('Lead 6 product & platform squads powering real-time financial settlement.'),
            },
            {
              role: l('Engineering Manager'),
              company: l('CloudCart'),
              period: l('2019 — 2022'),
              description: l('Grew core checkout engineering from 6 to 28 engineers.'),
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
              quote: l('Built the highest-retention engineering org in the company while hitting every platform milestone.'),
              author: l('Maya Subramanian'),
              role: l('Chief Product Officer'),
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
          location: l('Mumbai, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'tech-lead-03',
    name: 'Sprint Cadence',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Lavender Fog light theme for principal architects — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f3f0fc 0%, #dfd2f7 55%, #6d28d9 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#18142c',
        accent: '#6d28d9',
        surface: '#f3f0fc',
        text: '#272142',
        fontHeading: 'Fraunces',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Principal Architect'),
          headline: l('Calm leadership from RFC to production.'),
          subheadline: l('Bridging executive product strategy with pragmatic technical trade-offs.'),
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
          body: l('Bridging executive product strategy with pragmatic technical trade-offs. Based in Pune, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Director of Engineering'),
              company: l('LedgerScale'),
              period: l('2022 — Present'),
              description: l('Lead 6 product & platform squads powering real-time financial settlement.'),
            },
            {
              role: l('Engineering Manager'),
              company: l('CloudCart'),
              period: l('2019 — 2022'),
              description: l('Grew core checkout engineering from 6 to 28 engineers.'),
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
              degree: l('M.Tech. Software Systems'),
              school: l('IIIT Bangalore'),
              period: l('2013 — 2015'),
              description: l('Software architecture and distributed computing.'),
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
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
            },
            {
              title: l('Monolith to Modular Services'),
              description: l('Led 40-engineer architecture evolution over 4 quarters with zero customer-facing downtime.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Scale'],
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
          location: l('Pune, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'tech-lead-04',
    name: 'Staff Path',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Porcelain Emerald light theme for director of platforms — Outfit headings with editorial hero and compact spacing.',
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
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Director of Platform'),
          headline: l('Your Name'),
          subheadline: l('Engineering leader who has scaled teams from 8 to 95 engineers while keeping architecture clean and attrition low.'),
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
          items: ['Engineering Leadership', 'Org Design', 'RFC & Architecture', 'Hiring & Mentoring'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Director of Engineering'),
              company: l('LedgerScale'),
              period: l('2022 — Present'),
              description: l('Lead 6 product & platform squads powering real-time financial settlement.'),
            },
            {
              role: l('Engineering Manager'),
              company: l('CloudCart'),
              period: l('2019 — 2022'),
              description: l('Grew core checkout engineering from 6 to 28 engineers.'),
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
              title: l('Monolith to Modular Services'),
              description: l('Led 40-engineer architecture evolution over 4 quarters with zero customer-facing downtime.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Scale'],
            },
            {
              title: l('Cloud Cost Optimization'),
              description: l('Instituted FinOps telemetry and spot-compute migration, saving $1.9M annually.'),
              url: '',
              imageUrl: '',
              tags: ['FinOps', 'Cloud'],
            },
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: '',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
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
    id: 'tech-lead-05',
    name: 'Org Topology',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Midnight Cobalt dark theme for cto & co-founders — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
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
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('CTO & Co-Founder'),
          headline: l('Where engineering velocity meets operational rigor.'),
          subheadline: l('Focusing on clear RFC culture, blameless incident learning and career ladders that reward deep craft.'),
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
              title: l('Cloud Cost Optimization'),
              description: l('Instituted FinOps telemetry and spot-compute migration, saving $1.9M annually.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['FinOps', 'Cloud'],
            },
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Focusing on clear RFC culture, blameless incident learning and career ladders that reward deep craft. Based in Visakhapatnam, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Director of Engineering'),
              company: l('LedgerScale'),
              period: l('2022 — Present'),
              description: l('Lead 6 product & platform squads powering real-time financial settlement.'),
            },
            {
              role: l('Engineering Manager'),
              company: l('CloudCart'),
              period: l('2019 — 2022'),
              description: l('Grew core checkout engineering from 6 to 28 engineers.'),
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
    id: 'tech-lead-06',
    name: 'System View',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Sage Mist light theme for staff security leads — Fraunces headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #eff7f2 0%, #cee5d7 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#122118',
        accent: '#15803d',
        surface: '#eff7f2',
        text: '#1d3025',
        fontHeading: 'Fraunces',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Staff Security Lead'),
          headline: l('Building orgs that ship with pride.'),
          subheadline: l('Bridging executive product strategy with pragmatic technical trade-offs.'),
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
              url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
              alt: l('Brand identity and typography specimen'),
              caption: l('Brand identity'),
            },
            {
              url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop&q=80',
              alt: l('Interactive product screen study'),
              caption: l('Product UI'),
            },
            {
              url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
              alt: l('Responsive layout composition'),
              caption: l('Web craft'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('About'),
          body: l('Bridging executive product strategy with pragmatic technical trade-offs. Based in Mumbai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: '',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
            },
            {
              title: l('Monolith to Modular Services'),
              description: l('Led 40-engineer architecture evolution over 4 quarters with zero customer-facing downtime.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Scale'],
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
          location: l('Mumbai, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'tech-lead-07',
    name: 'Platform Pulse',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Chalk Vermilion light theme for head of data & ais — Outfit headings with editorial hero and comfortable spacing.',
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
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Head of Data & AI'),
          headline: l('Your Name'),
          subheadline: l('Engineering leader who has scaled teams from 8 to 95 engineers while keeping architecture clean and attrition low.'),
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
          body: l('Engineering leader who has scaled teams from 8 to 95 engineers while keeping architecture clean and attrition low. Based in Pune, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Selected Frames'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop&q=80',
              alt: l('Interactive product screen study'),
              caption: l('Product UI'),
            },
            {
              url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
              alt: l('Responsive layout composition'),
              caption: l('Web craft'),
            },
            {
              url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Interface system exploration'),
              caption: l('System UI'),
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
              quote: l('Built the highest-retention engineering org in the company while hitting every platform milestone.'),
              author: l('Maya Subramanian'),
              role: l('Chief Product Officer'),
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
    id: 'tech-lead-08',
    name: 'Principal Desk',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Abyssal Violet dark theme for director of developer experiences — System headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Director of Developer Experience'),
          headline: l('Scaling high-trust engineering teams and durable systems.'),
          subheadline: l('Focusing on clear RFC culture, blameless incident learning and career ladders that reward deep craft.'),
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
          body: l('Focusing on clear RFC culture, blameless incident learning and career ladders that reward deep craft. Based in Chandigarh, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Distributed Systems', 'SLO Governance', 'Cloud FinOps', 'Incident Culture'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Cloud Cost Optimization'),
              description: l('Instituted FinOps telemetry and spot-compute migration, saving $1.9M annually.'),
              url: '',
              imageUrl: '',
              tags: ['FinOps', 'Cloud'],
            },
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: '',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
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
          location: l('Chandigarh, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'tech-lead-09',
    name: 'Engineering VP',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Blush Stone light theme for distinguished engineers — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fcf1f3 0%, #f3d0d8 55%, #be123c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261418',
        accent: '#be123c',
        surface: '#fcf1f3',
        text: '#362025',
        fontHeading: 'Fraunces',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Distinguished Engineer'),
          headline: l('Calm leadership from RFC to production.'),
          subheadline: l('Bridging executive product strategy with pragmatic technical trade-offs.'),
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
          body: l('Bridging executive product strategy with pragmatic technical trade-offs. Based in Visakhapatnam, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
            },
            {
              title: l('Monolith to Modular Services'),
              description: l('Led 40-engineer architecture evolution over 4 quarters with zero customer-facing downtime.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Scale'],
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
              quote: l('Built the highest-retention engineering org in the company while hitting every platform milestone.'),
              author: l('Maya Subramanian'),
              role: l('Chief Product Officer'),
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
    id: 'tech-lead-10',
    name: 'Architecture Log',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Ice Indigo light theme for mobile engineering heads — Outfit headings with editorial hero and compact spacing.',
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
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Mobile Engineering Head'),
          headline: l('Your Name'),
          subheadline: l('Engineering leader who has scaled teams from 8 to 95 engineers while keeping architecture clean and attrition low.'),
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
              title: l('Monolith to Modular Services'),
              description: l('Led 40-engineer architecture evolution over 4 quarters with zero customer-facing downtime.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Scale'],
            },
            {
              title: l('Cloud Cost Optimization'),
              description: l('Instituted FinOps telemetry and spot-compute migration, saving $1.9M annually.'),
              url: '',
              imageUrl: '',
              tags: ['FinOps', 'Cloud'],
            },
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: '',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Engineering Leadership', 'Org Design', 'RFC & Architecture', 'Hiring & Mentoring'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Built the highest-retention engineering org in the company while hitting every platform milestone.'),
              author: l('Maya Subramanian'),
              role: l('Chief Product Officer'),
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
          location: l('Mumbai, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'tech-lead-11',
    name: 'Reliability',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Charcoal Amber dark theme for site reliability directors — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
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
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Site Reliability Director'),
          headline: l('Where engineering velocity meets operational rigor.'),
          subheadline: l('Focusing on clear RFC culture, blameless incident learning and career ladders that reward deep craft.'),
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
          body: l('Focusing on clear RFC culture, blameless incident learning and career ladders that reward deep craft. Based in Pune, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Distributed Systems', 'SLO Governance', 'Cloud FinOps', 'Incident Culture'],
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Selected Frames'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop&q=80',
              alt: l('Interactive product screen study'),
              caption: l('Product UI'),
            },
            {
              url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
              alt: l('Responsive layout composition'),
              caption: l('Web craft'),
            },
            {
              url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Interface system exploration'),
              caption: l('System UI'),
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
              title: l('Cloud Cost Optimization'),
              description: l('Instituted FinOps telemetry and spot-compute migration, saving $1.9M annually.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['FinOps', 'Cloud'],
            },
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
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
          location: l('Pune, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'tech-lead-12',
    name: 'Capacity',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Glacier Blue light theme for frontend platform leads — Fraunces headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #eff7fd 0%, #cce2ef 55%, #0369a1 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1c2b',
        accent: '#0369a1',
        surface: '#eff7fd',
        text: '#1a2c3d',
        fontHeading: 'Fraunces',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Frontend Platform Lead'),
          headline: l('Building orgs that ship with pride.'),
          subheadline: l('Bridging executive product strategy with pragmatic technical trade-offs.'),
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
          items: ['Cross-Functional Alignment', 'Technical Strategy', 'Platform DX', 'OKRs'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: '',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
            },
            {
              title: l('Monolith to Modular Services'),
              description: l('Led 40-engineer architecture evolution over 4 quarters with zero customer-facing downtime.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Scale'],
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
              role: l('Director of Engineering'),
              company: l('LedgerScale'),
              period: l('2022 — Present'),
              description: l('Lead 6 product & platform squads powering real-time financial settlement.'),
            },
            {
              role: l('Engineering Manager'),
              company: l('CloudCart'),
              period: l('2019 — 2022'),
              description: l('Grew core checkout engineering from 6 to 28 engineers.'),
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
              quote: l('Built the highest-retention engineering org in the company while hitting every platform milestone.'),
              author: l('Maya Subramanian'),
              role: l('Chief Product Officer'),
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
          location: l('Chandigarh, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'tech-lead-13',
    name: 'Hiring Bar',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Linen Terracotta light theme for ml engineering managers — Outfit headings with editorial hero and comfortable spacing.',
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
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('ML Engineering Manager'),
          headline: l('Your Name'),
          subheadline: l('Engineering leader who has scaled teams from 8 to 95 engineers while keeping architecture clean and attrition low.'),
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
          body: l('Engineering leader who has scaled teams from 8 to 95 engineers while keeping architecture clean and attrition low. Based in Visakhapatnam, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Director of Engineering'),
              company: l('LedgerScale'),
              period: l('2022 — Present'),
              description: l('Lead 6 product & platform squads powering real-time financial settlement.'),
            },
            {
              role: l('Engineering Manager'),
              company: l('CloudCart'),
              period: l('2019 — 2022'),
              description: l('Grew core checkout engineering from 6 to 28 engineers.'),
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
              degree: l('M.Tech. Software Systems'),
              school: l('IIIT Bangalore'),
              period: l('2013 — 2015'),
              description: l('Software architecture and distributed computing.'),
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
              title: l('Monolith to Modular Services'),
              description: l('Led 40-engineer architecture evolution over 4 quarters with zero customer-facing downtime.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Scale'],
            },
            {
              title: l('Cloud Cost Optimization'),
              description: l('Instituted FinOps telemetry and spot-compute migration, saving $1.9M annually.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['FinOps', 'Cloud'],
            },
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
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
          location: l('Visakhapatnam, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'tech-lead-14',
    name: 'Delivery Loop',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Velvet Rose dark theme for qa & release directors — System headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #12090c 0%, #452027 55%, #fb7185 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('QA & Release Director'),
          headline: l('Scaling high-trust engineering teams and durable systems.'),
          subheadline: l('Focusing on clear RFC culture, blameless incident learning and career ladders that reward deep craft.'),
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
          items: ['Distributed Systems', 'SLO Governance', 'Cloud FinOps', 'Incident Culture'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Director of Engineering'),
              company: l('LedgerScale'),
              period: l('2022 — Present'),
              description: l('Lead 6 product & platform squads powering real-time financial settlement.'),
            },
            {
              role: l('Engineering Manager'),
              company: l('CloudCart'),
              period: l('2019 — 2022'),
              description: l('Grew core checkout engineering from 6 to 28 engineers.'),
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
              title: l('Cloud Cost Optimization'),
              description: l('Instituted FinOps telemetry and spot-compute migration, saving $1.9M annually.'),
              url: '',
              imageUrl: '',
              tags: ['FinOps', 'Cloud'],
            },
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: '',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
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
    id: 'tech-lead-15',
    name: 'Postmortem',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Apricot Cream light theme for enterprise architecture leads — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fff4ec 0%, #f6d9ca 55%, #c2410c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#26160e',
        accent: '#c2410c',
        surface: '#fff4ec',
        text: '#362218',
        fontHeading: 'Fraunces',
        fontBody: 'Manrope',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Enterprise Architecture Lead'),
          headline: l('Calm leadership from RFC to production.'),
          subheadline: l('Bridging executive product strategy with pragmatic technical trade-offs.'),
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
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
            },
            {
              title: l('Monolith to Modular Services'),
              description: l('Led 40-engineer architecture evolution over 4 quarters with zero customer-facing downtime.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Scale'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Bridging executive product strategy with pragmatic technical trade-offs. Based in Pune, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Director of Engineering'),
              company: l('LedgerScale'),
              period: l('2022 — Present'),
              description: l('Lead 6 product & platform squads powering real-time financial settlement.'),
            },
            {
              role: l('Engineering Manager'),
              company: l('CloudCart'),
              period: l('2019 — 2022'),
              description: l('Grew core checkout engineering from 6 to 28 engineers.'),
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
    id: 'tech-lead-16',
    name: 'Domain Model',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Nordic Spruce light theme for cloud migration directors — Outfit headings with editorial hero and compact spacing.',
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
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Cloud Migration Director'),
          headline: l('Your Name'),
          subheadline: l('Engineering leader who has scaled teams from 8 to 95 engineers while keeping architecture clean and attrition low.'),
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
              url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
              alt: l('Responsive layout composition'),
              caption: l('Web craft'),
            },
            {
              url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Interface system exploration'),
              caption: l('System UI'),
            },
            {
              url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
              alt: l('Brand identity and typography specimen'),
              caption: l('Brand identity'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('About'),
          body: l('Engineering leader who has scaled teams from 8 to 95 engineers while keeping architecture clean and attrition low. Based in Chandigarh, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Monolith to Modular Services'),
              description: l('Led 40-engineer architecture evolution over 4 quarters with zero customer-facing downtime.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Scale'],
            },
            {
              title: l('Cloud Cost Optimization'),
              description: l('Instituted FinOps telemetry and spot-compute migration, saving $1.9M annually.'),
              url: '',
              imageUrl: '',
              tags: ['FinOps', 'Cloud'],
            },
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: '',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
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
          location: l('Chandigarh, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'tech-lead-17',
    name: 'Northstar Eng',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Deep Teal dark theme for core infrastructure leads — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
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
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Core Infrastructure Lead'),
          headline: l('Where engineering velocity meets operational rigor.'),
          subheadline: l('Focusing on clear RFC culture, blameless incident learning and career ladders that reward deep craft.'),
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
          body: l('Focusing on clear RFC culture, blameless incident learning and career ladders that reward deep craft. Based in Visakhapatnam, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Gallery'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Interface system exploration'),
              caption: l('System UI'),
            },
            {
              url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
              alt: l('Brand identity and typography specimen'),
              caption: l('Brand identity'),
            },
            {
              url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop&q=80',
              alt: l('Interactive product screen study'),
              caption: l('Product UI'),
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
              quote: l('Built the highest-retention engineering org in the company while hitting every platform milestone.'),
              author: l('Maya Subramanian'),
              role: l('Chief Product Officer'),
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
    id: 'tech-lead-18',
    name: 'Guild Lead',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Mint Frost light theme for product engineering leads — Fraunces headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #eefaf7 0%, #cde6e2 55%, #0f766e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e221e',
        accent: '#0f766e',
        surface: '#eefaf7',
        text: '#1a322d',
        fontHeading: 'Fraunces',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Product Engineering Lead'),
          headline: l('Building orgs that ship with pride.'),
          subheadline: l('Bridging executive product strategy with pragmatic technical trade-offs.'),
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
          body: l('Bridging executive product strategy with pragmatic technical trade-offs. Based in Mumbai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Cross-Functional Alignment', 'Technical Strategy', 'Platform DX', 'OKRs'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: '',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
            },
            {
              title: l('Monolith to Modular Services'),
              description: l('Led 40-engineer architecture evolution over 4 quarters with zero customer-facing downtime.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Scale'],
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
          location: l('Mumbai, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'tech-lead-19',
    name: 'Cloud Matrix',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Cloud Plum light theme for fintech tech leads — Outfit headings with editorial hero and comfortable spacing.',
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
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Fintech Tech Lead'),
          headline: l('Your Name'),
          subheadline: l('Engineering leader who has scaled teams from 8 to 95 engineers while keeping architecture clean and attrition low.'),
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
          body: l('Engineering leader who has scaled teams from 8 to 95 engineers while keeping architecture clean and attrition low. Based in Pune, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Monolith to Modular Services'),
              description: l('Led 40-engineer architecture evolution over 4 quarters with zero customer-facing downtime.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Scale'],
            },
            {
              title: l('Cloud Cost Optimization'),
              description: l('Instituted FinOps telemetry and spot-compute migration, saving $1.9M annually.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['FinOps', 'Cloud'],
            },
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
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
              quote: l('Built the highest-retention engineering org in the company while hitting every platform milestone.'),
              author: l('Maya Subramanian'),
              role: l('Chief Product Officer'),
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
    id: 'tech-lead-20',
    name: 'Scale Org',
    category: 'tech-lead',
    family: 'Tech Leadership',
    audience: ['engineering manager', 'tech lead', 'cto'],
    description: 'Smoked Tangerine dark theme for technical program directors — System headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #120c08 0%, #452913 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff7ed',
        accent: '#fb923c',
        surface: '#120c08',
        text: '#f0dfd1',
        fontHeading: 'System',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Technical Program Director'),
          headline: l('Scaling high-trust engineering teams and durable systems.'),
          subheadline: l('Focusing on clear RFC culture, blameless incident learning and career ladders that reward deep craft.'),
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
              title: l('Cloud Cost Optimization'),
              description: l('Instituted FinOps telemetry and spot-compute migration, saving $1.9M annually.'),
              url: '',
              imageUrl: '',
              tags: ['FinOps', 'Cloud'],
            },
            {
              title: l('Engineering Career Framework'),
              description: l('Authored IC & EM growth rubrics adopted across 110 engineers in 3 time zones.'),
              url: '',
              imageUrl: '',
              tags: ['Leadership', 'Culture'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Distributed Systems', 'SLO Governance', 'Cloud FinOps', 'Incident Culture'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Built the highest-retention engineering org in the company while hitting every platform milestone.'),
              author: l('Maya Subramanian'),
              role: l('Chief Product Officer'),
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
          location: l('Chandigarh, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
];
