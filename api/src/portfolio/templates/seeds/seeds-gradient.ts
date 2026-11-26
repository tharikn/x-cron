// Auto-generated template seeds — Gradient Wave (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_GRADIENT: SeedTemplate[] = [
  {
    id: 'gradient-01',
    name: 'Spectrum Wave',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Lavender Fog light theme for head of growths — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f3f0fc 0%, #dfd2f7 55%, #6d28d9 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#18142c',
        accent: '#6d28d9',
        surface: '#f3f0fc',
        text: '#272142',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Head of Growth'),
          headline: l('Stand out, convert, compound.'),
          subheadline: l('Full-funnel growth marketing, launch storytelling and creator partnerships that drive sustainable acquisition.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Go-to-Market', 'Conversion Optimization', 'Lifecycle Email', 'Analytics'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Head of Growth Marketing'),
              company: l('PulseHQ'),
              period: l('2023 — Present'),
              description: l('Lead acquisition, lifecycle and product marketing across global self-serve funnels.'),
            },
            {
              role: l('Growth Lead'),
              company: l('Kite Consumer'),
              period: l('2020 — 2023'),
              description: l('Grew organic monthly traffic from 15k to 320k.'),
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
              title: l('Product Hunt #1 Launch'),
              description: l('Orchestrated teaser campaign, creator demos and community push driving 18k day-one signups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Launch', 'Growth'],
            },
            {
              title: l('Organic Video Engine'),
              description: l('Scaled educational short-form series to 4.2M organic views and 28% lower CAC.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Content', 'Social'],
            },
            {
              title: l('Lifecycle Retention Loop'),
              description: l('Rebuilt behavioral onboarding emails, lifting 30-day paid retention by 16 points.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Lifecycle', 'CRM'],
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
    id: 'gradient-02',
    name: 'Chroma Shift',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Obsidian Emerald dark theme for creative strategists — System headings with editorial hero and compact spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Creative Strategist'),
          headline: l('Turn attention into durable growth.'),
          subheadline: l('Combining crisp positioning, high-converting landing pages and data-backed experimentation.'),
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
              title: l('Organic Video Engine'),
              description: l('Scaled educational short-form series to 4.2M organic views and 28% lower CAC.'),
              url: '',
              imageUrl: '',
              tags: ['Content', 'Social'],
            },
            {
              title: l('Lifecycle Retention Loop'),
              description: l('Rebuilt behavioral onboarding emails, lifting 30-day paid retention by 16 points.'),
              url: '',
              imageUrl: '',
              tags: ['Lifecycle', 'CRM'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Profile'),
          body: l('Combining crisp positioning, high-converting landing pages and data-backed experimentation. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Head of Growth Marketing'),
              company: l('PulseHQ'),
              period: l('2023 — Present'),
              description: l('Lead acquisition, lifecycle and product marketing across global self-serve funnels.'),
            },
            {
              role: l('Growth Lead'),
              company: l('Kite Consumer'),
              period: l('2020 — 2023'),
              description: l('Grew organic monthly traffic from 15k to 320k.'),
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
    id: 'gradient-03',
    name: 'Prismatic Flow',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Alabaster Cobalt light theme for brand & content creators — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fafbfe 0%, #dae2fd 55%, #2457f5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1320',
        accent: '#2457f5',
        surface: '#fafbfe',
        text: '#1c2436',
        fontHeading: 'Outfit',
        fontBody: 'Outfit',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Brand & Content Creator'),
          headline: l('Your Name'),
          subheadline: l('Built communities from zero to 120k members and scaled organic channels for SaaS and consumer apps.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#contact-5',
          imageUrl: '',
          imageAlt: l(''),
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Built communities from zero to 120k members and scaled organic channels for SaaS and consumer apps. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Lifecycle Retention Loop'),
              description: l('Rebuilt behavioral onboarding emails, lifting 30-day paid retention by 16 points.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Lifecycle', 'CRM'],
            },
            {
              title: l('Partner Co-Marketing'),
              description: l('Launched 12 joint webinars and playbooks generating $1.4M in qualified pipeline.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Partnerships', 'B2B'],
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
          location: l('Indore, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'gradient-04',
    name: 'Solar Flare',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Matrix Lime dark theme for performance marketers — Outfit headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #050a07 0%, #143922 55%, #4ade80 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ebffef',
        accent: '#4ade80',
        surface: '#050a07',
        text: '#c9f2d2',
        fontHeading: 'Outfit',
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
          eyebrow: l('Performance Marketer'),
          headline: l('Campaigns people actually remember.'),
          subheadline: l('Full-funnel growth marketing, launch storytelling and creator partnerships that drive sustainable acquisition.'),
          primaryCtaLabel: l('Book a call'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Overview'),
          body: l('Full-funnel growth marketing, launch storytelling and creator partnerships that drive sustainable acquisition. Based in Remote · India, working with teams worldwide.'),
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
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Rare blend of creative taste and spreadsheet discipline—our best growth hire.'),
              author: l('Siddharth Jain'),
              role: l('CEO, PulseHQ'),
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
    id: 'gradient-05',
    name: 'Horizon Tint',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Sage Mist light theme for community architects — System headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #eff7f2 0%, #cee5d7 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#122118',
        accent: '#15803d',
        surface: '#eff7f2',
        text: '#1d3025',
        fontHeading: 'System',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Community Architect'),
          headline: l('All signal, measurable momentum.'),
          subheadline: l('Combining crisp positioning, high-converting landing pages and data-backed experimentation.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#contact-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Combining crisp positioning, high-converting landing pages and data-backed experimentation. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Content Strategy', 'Short-form Video', 'Creator Partnerships', 'Paid Social'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Product Hunt #1 Launch'),
              description: l('Orchestrated teaser campaign, creator demos and community push driving 18k day-one signups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Launch', 'Growth'],
            },
            {
              title: l('Organic Video Engine'),
              description: l('Scaled educational short-form series to 4.2M organic views and 28% lower CAC.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Content', 'Social'],
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
          location: l('Delhi, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'gradient-06',
    name: 'Vivid Burst',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Midnight Cobalt dark theme for product marketing leads — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eff6ff',
        accent: '#60a5fa',
        surface: '#070b16',
        text: '#d8e4f8',
        fontHeading: 'Outfit',
        fontBody: 'Outfit',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Product Marketing Lead'),
          headline: l('Story-led growth for modern brands.'),
          subheadline: l('Built communities from zero to 120k members and scaled organic channels for SaaS and consumer apps.'),
          primaryCtaLabel: l('Start a project'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('About'),
          body: l('Built communities from zero to 120k members and scaled organic channels for SaaS and consumer apps. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Organic Video Engine'),
              description: l('Scaled educational short-form series to 4.2M organic views and 28% lower CAC.'),
              url: '',
              imageUrl: '',
              tags: ['Content', 'Social'],
            },
            {
              title: l('Lifecycle Retention Loop'),
              description: l('Rebuilt behavioral onboarding emails, lifting 30-day paid retention by 16 points.'),
              url: '',
              imageUrl: '',
              tags: ['Lifecycle', 'CRM'],
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
              quote: l('Rare blend of creative taste and spreadsheet discipline—our best growth hire.'),
              author: l('Siddharth Jain'),
              role: l('CEO, PulseHQ'),
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
    id: 'gradient-07',
    name: 'Kaleido',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Porcelain Emerald light theme for video & social producers — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d1f18',
        accent: '#0a8754',
        surface: '#f9fcfa',
        text: '#192a22',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Video & Social Producer'),
          headline: l('Stand out, convert, compound.'),
          subheadline: l('Full-funnel growth marketing, launch storytelling and creator partnerships that drive sustainable acquisition.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#contact-5',
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
              title: l('Lifecycle Retention Loop'),
              description: l('Rebuilt behavioral onboarding emails, lifting 30-day paid retention by 16 points.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Lifecycle', 'CRM'],
            },
            {
              title: l('Partner Co-Marketing'),
              description: l('Launched 12 joint webinars and playbooks generating $1.4M in qualified pipeline.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Partnerships', 'B2B'],
            },
            {
              title: l('Product Hunt #1 Launch'),
              description: l('Orchestrated teaser campaign, creator demos and community push driving 18k day-one signups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Launch', 'Growth'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Go-to-Market', 'Conversion Optimization', 'Lifecycle Email', 'Analytics'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Rare blend of creative taste and spreadsheet discipline—our best growth hire.'),
              author: l('Siddharth Jain'),
              role: l('CEO, PulseHQ'),
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
          location: l('Indore, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'gradient-08',
    name: 'Color Drift',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Synthwave Pink dark theme for lifecycle marketers — System headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #0c0512 0%, #3f1d36 55%, #f472b6 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ffeef8',
        accent: '#f472b6',
        surface: '#0c0512',
        text: '#f0cfe3',
        fontHeading: 'System',
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
          eyebrow: l('Lifecycle Marketer'),
          headline: l('Turn attention into durable growth.'),
          subheadline: l('Combining crisp positioning, high-converting landing pages and data-backed experimentation.'),
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
          body: l('Combining crisp positioning, high-converting landing pages and data-backed experimentation. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Specialties'),
          items: ['Content Strategy', 'Short-form Video', 'Creator Partnerships', 'Paid Social'],
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Partner Co-Marketing'),
              description: l('Launched 12 joint webinars and playbooks generating $1.4M in qualified pipeline.'),
              url: '',
              imageUrl: '',
              tags: ['Partnerships', 'B2B'],
            },
            {
              title: l('Product Hunt #1 Launch'),
              description: l('Orchestrated teaser campaign, creator demos and community push driving 18k day-one signups.'),
              url: '',
              imageUrl: '',
              tags: ['Launch', 'Growth'],
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
          location: l('Remote · India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'gradient-09',
    name: 'Radiant Arc',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Blush Stone light theme for creator economy advisors — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fcf1f3 0%, #f3d0d8 55%, #be123c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261418',
        accent: '#be123c',
        surface: '#fcf1f3',
        text: '#362025',
        fontHeading: 'Outfit',
        fontBody: 'Outfit',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Creator Economy Advisor'),
          headline: l('Your Name'),
          subheadline: l('Built communities from zero to 120k members and scaled organic channels for SaaS and consumer apps.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Positioning', 'Launch Campaigns', 'SEO', 'Community Building'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Product Hunt #1 Launch'),
              description: l('Orchestrated teaser campaign, creator demos and community push driving 18k day-one signups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Launch', 'Growth'],
            },
            {
              title: l('Organic Video Engine'),
              description: l('Scaled educational short-form series to 4.2M organic views and 28% lower CAC.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Content', 'Social'],
            }
          ],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Head of Growth Marketing'),
              company: l('PulseHQ'),
              period: l('2023 — Present'),
              description: l('Lead acquisition, lifecycle and product marketing across global self-serve funnels.'),
            },
            {
              role: l('Growth Lead'),
              company: l('Kite Consumer'),
              period: l('2020 — 2023'),
              description: l('Grew organic monthly traffic from 15k to 320k.'),
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
              quote: l('Rare blend of creative taste and spreadsheet discipline—our best growth hire.'),
              author: l('Siddharth Jain'),
              role: l('CEO, PulseHQ'),
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
          location: l('Delhi, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'gradient-10',
    name: 'Aura Blend',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Abyssal Violet dark theme for demand gen leads — Outfit headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f5f3ff',
        accent: '#a78bfa',
        surface: '#0b0917',
        text: '#e0daf8',
        fontHeading: 'Outfit',
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
          eyebrow: l('Demand Gen Lead'),
          headline: l('Campaigns people actually remember.'),
          subheadline: l('Full-funnel growth marketing, launch storytelling and creator partnerships that drive sustainable acquisition.'),
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
          title: l('Approach'),
          body: l('Full-funnel growth marketing, launch storytelling and creator partnerships that drive sustainable acquisition. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Head of Growth Marketing'),
              company: l('PulseHQ'),
              period: l('2023 — Present'),
              description: l('Lead acquisition, lifecycle and product marketing across global self-serve funnels.'),
            },
            {
              role: l('Growth Lead'),
              company: l('Kite Consumer'),
              period: l('2020 — 2023'),
              description: l('Grew organic monthly traffic from 15k to 320k.'),
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
              degree: l('MBA Marketing & Strategy'),
              school: l('XIMB'),
              period: l('2018 — 2020'),
              description: l('Consumer behavior and digital analytics.'),
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
              title: l('Organic Video Engine'),
              description: l('Scaled educational short-form series to 4.2M organic views and 28% lower CAC.'),
              url: '',
              imageUrl: '',
              tags: ['Content', 'Social'],
            },
            {
              title: l('Lifecycle Retention Loop'),
              description: l('Rebuilt behavioral onboarding emails, lifting 30-day paid retention by 16 points.'),
              url: '',
              imageUrl: '',
              tags: ['Lifecycle', 'CRM'],
            },
            {
              title: l('Partner Co-Marketing'),
              description: l('Launched 12 joint webinars and playbooks generating $1.4M in qualified pipeline.'),
              url: '',
              imageUrl: '',
              tags: ['Partnerships', 'B2B'],
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
          location: l('Kochi, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'gradient-11',
    name: 'Iridescent',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Chalk Vermilion light theme for launch strategists — System headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fcfbfa 0%, #f7ded9 55%, #d9381e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#191414',
        accent: '#d9381e',
        surface: '#fcfbfa',
        text: '#241e1d',
        fontHeading: 'System',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Launch Strategist'),
          headline: l('All signal, measurable momentum.'),
          subheadline: l('Combining crisp positioning, high-converting landing pages and data-backed experimentation.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Content Strategy', 'Short-form Video', 'Creator Partnerships', 'Paid Social'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Head of Growth Marketing'),
              company: l('PulseHQ'),
              period: l('2023 — Present'),
              description: l('Lead acquisition, lifecycle and product marketing across global self-serve funnels.'),
            },
            {
              role: l('Growth Lead'),
              company: l('Kite Consumer'),
              period: l('2020 — 2023'),
              description: l('Grew organic monthly traffic from 15k to 320k.'),
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
              title: l('Lifecycle Retention Loop'),
              description: l('Rebuilt behavioral onboarding emails, lifting 30-day paid retention by 16 points.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Lifecycle', 'CRM'],
            },
            {
              title: l('Partner Co-Marketing'),
              description: l('Launched 12 joint webinars and playbooks generating $1.4M in qualified pipeline.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Partnerships', 'B2B'],
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
    id: 'gradient-12',
    name: 'Prism Pulse',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Cyber Cyan dark theme for digital campaign leads — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #050c10 0%, #0b3841 55%, #22d3ee 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#e8feff',
        accent: '#22d3ee',
        surface: '#050c10',
        text: '#c7ecf0',
        fontHeading: 'Outfit',
        fontBody: 'Outfit',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Digital Campaign Lead'),
          headline: l('Story-led growth for modern brands.'),
          subheadline: l('Built communities from zero to 120k members and scaled organic channels for SaaS and consumer apps.'),
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
              title: l('Partner Co-Marketing'),
              description: l('Launched 12 joint webinars and playbooks generating $1.4M in qualified pipeline.'),
              url: '',
              imageUrl: '',
              tags: ['Partnerships', 'B2B'],
            },
            {
              title: l('Product Hunt #1 Launch'),
              description: l('Orchestrated teaser campaign, creator demos and community push driving 18k day-one signups.'),
              url: '',
              imageUrl: '',
              tags: ['Launch', 'Growth'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Profile'),
          body: l('Built communities from zero to 120k members and scaled organic channels for SaaS and consumer apps. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Head of Growth Marketing'),
              company: l('PulseHQ'),
              period: l('2023 — Present'),
              description: l('Lead acquisition, lifecycle and product marketing across global self-serve funnels.'),
            },
            {
              role: l('Growth Lead'),
              company: l('Kite Consumer'),
              period: l('2020 — 2023'),
              description: l('Grew organic monthly traffic from 15k to 320k.'),
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
    id: 'gradient-13',
    name: 'Tropic Hue',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Glacier Blue light theme for newsletter growth leads — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #eff7fd 0%, #cce2ef 55%, #0369a1 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1c2b',
        accent: '#0369a1',
        surface: '#eff7fd',
        text: '#1a2c3d',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Newsletter Growth Lead'),
          headline: l('Stand out, convert, compound.'),
          subheadline: l('Full-funnel growth marketing, launch storytelling and creator partnerships that drive sustainable acquisition.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#contact-5',
          imageUrl: '',
          imageAlt: l(''),
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Full-funnel growth marketing, launch storytelling and creator partnerships that drive sustainable acquisition. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Product Hunt #1 Launch'),
              description: l('Orchestrated teaser campaign, creator demos and community push driving 18k day-one signups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Launch', 'Growth'],
            },
            {
              title: l('Organic Video Engine'),
              description: l('Scaled educational short-form series to 4.2M organic views and 28% lower CAC.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Content', 'Social'],
            },
            {
              title: l('Lifecycle Retention Loop'),
              description: l('Rebuilt behavioral onboarding emails, lifting 30-day paid retention by 16 points.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Lifecycle', 'CRM'],
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
          location: l('Delhi, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'gradient-14',
    name: 'Aurora Glow',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Charcoal Amber dark theme for partnership directors — System headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fffbeb',
        accent: '#fbbf24',
        surface: '#100e0a',
        text: '#ede5ce',
        fontHeading: 'System',
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
          eyebrow: l('Partnership Director'),
          headline: l('Turn attention into durable growth.'),
          subheadline: l('Combining crisp positioning, high-converting landing pages and data-backed experimentation.'),
          primaryCtaLabel: l('Start a project'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Overview'),
          body: l('Combining crisp positioning, high-converting landing pages and data-backed experimentation. Based in Kochi, working with teams worldwide.'),
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
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Rare blend of creative taste and spreadsheet discipline—our best growth hire.'),
              author: l('Siddharth Jain'),
              role: l('CEO, PulseHQ'),
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
    id: 'gradient-15',
    name: 'Electric Fade',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Ice Indigo light theme for seo & organic leads — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f5f7ff 0%, #dcdcfb 55%, #4f46e5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#11132b',
        accent: '#4f46e5',
        surface: '#f5f7ff',
        text: '#1e2240',
        fontHeading: 'Outfit',
        fontBody: 'Outfit',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('SEO & Organic Lead'),
          headline: l('Your Name'),
          subheadline: l('Built communities from zero to 120k members and scaled organic channels for SaaS and consumer apps.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#contact-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Built communities from zero to 120k members and scaled organic channels for SaaS and consumer apps. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Positioning', 'Launch Campaigns', 'SEO', 'Community Building'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Lifecycle Retention Loop'),
              description: l('Rebuilt behavioral onboarding emails, lifting 30-day paid retention by 16 points.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Lifecycle', 'CRM'],
            },
            {
              title: l('Partner Co-Marketing'),
              description: l('Launched 12 joint webinars and playbooks generating $1.4M in qualified pipeline.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Partnerships', 'B2B'],
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
          location: l('Indore, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'gradient-16',
    name: 'Sunburst',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Laser Violet dark theme for viral content producers — Outfit headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #080512 0%, #302145 55%, #c084fc 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f4ebff',
        accent: '#c084fc',
        surface: '#080512',
        text: '#dfd0f5',
        fontHeading: 'Outfit',
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
          eyebrow: l('Viral Content Producer'),
          headline: l('Campaigns people actually remember.'),
          subheadline: l('Full-funnel growth marketing, launch storytelling and creator partnerships that drive sustainable acquisition.'),
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
          title: l('About'),
          body: l('Full-funnel growth marketing, launch storytelling and creator partnerships that drive sustainable acquisition. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Partner Co-Marketing'),
              description: l('Launched 12 joint webinars and playbooks generating $1.4M in qualified pipeline.'),
              url: '',
              imageUrl: '',
              tags: ['Partnerships', 'B2B'],
            },
            {
              title: l('Product Hunt #1 Launch'),
              description: l('Orchestrated teaser campaign, creator demos and community push driving 18k day-one signups.'),
              url: '',
              imageUrl: '',
              tags: ['Launch', 'Growth'],
            },
            {
              title: l('Organic Video Engine'),
              description: l('Scaled educational short-form series to 4.2M organic views and 28% lower CAC.'),
              url: '',
              imageUrl: '',
              tags: ['Content', 'Social'],
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
              quote: l('Rare blend of creative taste and spreadsheet discipline—our best growth hire.'),
              author: l('Siddharth Jain'),
              role: l('CEO, PulseHQ'),
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
    id: 'gradient-17',
    name: 'Neon Wash',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Apricot Cream light theme for social media directors — System headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fff4ec 0%, #f6d9ca 55%, #c2410c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#26160e',
        accent: '#c2410c',
        surface: '#fff4ec',
        text: '#362218',
        fontHeading: 'System',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Social Media Director'),
          headline: l('All signal, measurable momentum.'),
          subheadline: l('Combining crisp positioning, high-converting landing pages and data-backed experimentation.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#contact-5',
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
              title: l('Product Hunt #1 Launch'),
              description: l('Orchestrated teaser campaign, creator demos and community push driving 18k day-one signups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Launch', 'Growth'],
            },
            {
              title: l('Organic Video Engine'),
              description: l('Scaled educational short-form series to 4.2M organic views and 28% lower CAC.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Content', 'Social'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Content Strategy', 'Short-form Video', 'Creator Partnerships', 'Paid Social'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Rare blend of creative taste and spreadsheet discipline—our best growth hire.'),
              author: l('Siddharth Jain'),
              role: l('CEO, PulseHQ'),
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
          location: l('Delhi, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'gradient-18',
    name: 'Velvet Hue',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Velvet Rose dark theme for audience strategists — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
        fontHeading: 'Outfit',
        fontBody: 'Outfit',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Audience Strategist'),
          headline: l('Story-led growth for modern brands.'),
          subheadline: l('Built communities from zero to 120k members and scaled organic channels for SaaS and consumer apps.'),
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
          body: l('Built communities from zero to 120k members and scaled organic channels for SaaS and consumer apps. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Specialties'),
          items: ['Positioning', 'Launch Campaigns', 'SEO', 'Community Building'],
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Organic Video Engine'),
              description: l('Scaled educational short-form series to 4.2M organic views and 28% lower CAC.'),
              url: '',
              imageUrl: '',
              tags: ['Content', 'Social'],
            },
            {
              title: l('Lifecycle Retention Loop'),
              description: l('Rebuilt behavioral onboarding emails, lifting 30-day paid retention by 16 points.'),
              url: '',
              imageUrl: '',
              tags: ['Lifecycle', 'CRM'],
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
          location: l('Kochi, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'gradient-19',
    name: 'Citrus Wave',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Linen Terracotta light theme for go-to-market advisors — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fdf8f3 0%, #f4dfd5 55%, #c2512b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261710',
        accent: '#c2512b',
        surface: '#fdf8f3',
        text: '#332219',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Go-to-Market Advisor'),
          headline: l('Stand out, convert, compound.'),
          subheadline: l('Full-funnel growth marketing, launch storytelling and creator partnerships that drive sustainable acquisition.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Go-to-Market', 'Conversion Optimization', 'Lifecycle Email', 'Analytics'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Lifecycle Retention Loop'),
              description: l('Rebuilt behavioral onboarding emails, lifting 30-day paid retention by 16 points.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Lifecycle', 'CRM'],
            },
            {
              title: l('Partner Co-Marketing'),
              description: l('Launched 12 joint webinars and playbooks generating $1.4M in qualified pipeline.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Partnerships', 'B2B'],
            },
            {
              title: l('Product Hunt #1 Launch'),
              description: l('Orchestrated teaser campaign, creator demos and community push driving 18k day-one signups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Launch', 'Growth'],
            }
          ],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Head of Growth Marketing'),
              company: l('PulseHQ'),
              period: l('2023 — Present'),
              description: l('Lead acquisition, lifecycle and product marketing across global self-serve funnels.'),
            },
            {
              role: l('Growth Lead'),
              company: l('Kite Consumer'),
              period: l('2020 — 2023'),
              description: l('Grew organic monthly traffic from 15k to 320k.'),
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
              quote: l('Rare blend of creative taste and spreadsheet discipline—our best growth hire.'),
              author: l('Siddharth Jain'),
              role: l('CEO, PulseHQ'),
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
          location: l('Indore, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'gradient-20',
    name: 'Ultravibe',
    category: 'gradient',
    family: 'Gradient Wave',
    audience: ['marketer', 'content creator', 'founder'],
    description: 'Plasma Orange dark theme for brand storytellers — System headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #0f0704 0%, #432610 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1e6',
        accent: '#fb923c',
        surface: '#0f0704',
        text: '#f2d9c7',
        fontHeading: 'System',
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
          eyebrow: l('Brand Storyteller'),
          headline: l('Turn attention into durable growth.'),
          subheadline: l('Combining crisp positioning, high-converting landing pages and data-backed experimentation.'),
          primaryCtaLabel: l('Book a call'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Approach'),
          body: l('Combining crisp positioning, high-converting landing pages and data-backed experimentation. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Head of Growth Marketing'),
              company: l('PulseHQ'),
              period: l('2023 — Present'),
              description: l('Lead acquisition, lifecycle and product marketing across global self-serve funnels.'),
            },
            {
              role: l('Growth Lead'),
              company: l('Kite Consumer'),
              period: l('2020 — 2023'),
              description: l('Grew organic monthly traffic from 15k to 320k.'),
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
              degree: l('MBA Marketing & Strategy'),
              school: l('XIMB'),
              period: l('2018 — 2020'),
              description: l('Consumer behavior and digital analytics.'),
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
              title: l('Partner Co-Marketing'),
              description: l('Launched 12 joint webinars and playbooks generating $1.4M in qualified pipeline.'),
              url: '',
              imageUrl: '',
              tags: ['Partnerships', 'B2B'],
            },
            {
              title: l('Product Hunt #1 Launch'),
              description: l('Orchestrated teaser campaign, creator demos and community push driving 18k day-one signups.'),
              url: '',
              imageUrl: '',
              tags: ['Launch', 'Growth'],
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
          location: l('Remote · India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
];
