// Auto-generated template seeds — Startup Bold (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_STARTUP: SeedTemplate[] = [
  {
    id: 'startup-01',
    name: 'Launchpad',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Obsidian Emerald dark theme for founder & ceos — Outfit headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
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
          eyebrow: l('Founder & CEO'),
          headline: l('Zero to one, then scale.'),
          subheadline: l('Two-time founder building infrastructure for automated developer workflows. Backed by top seed funds.'),
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
          title: l('About'),
          body: l('Two-time founder building infrastructure for automated developer workflows. Backed by top seed funds. Based in Mysuru, working with teams worldwide.'),
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
          title: l('Kind Words'),
          items: [
            {
              quote: l('Turns chaotic early-stage hypotheses into clear metrics and shipped product every single week.'),
              author: l('Deepak Malhotra'),
              role: l('General Partner, Peak Ventures'),
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
    id: 'startup-02',
    name: 'Series A',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Alabaster Cobalt light theme for technical co-founders — System headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fafbfe 0%, #dae2fd 55%, #2457f5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1320',
        accent: '#2457f5',
        surface: '#fafbfe',
        text: '#1c2436',
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
          eyebrow: l('Technical Co-Founder'),
          headline: l('Building category-defining software.'),
          subheadline: l('Helping technical founders find their first 50 enterprise customers and nail repeatable GTM.'),
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
          title: l('Profile'),
          body: l('Helping technical founders find their first 50 enterprise customers and nail repeatable GTM. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Product Strategy', 'Pricing & Packaging', 'Customer Discovery', 'Hiring'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Enterprise Design Partner Program'),
              description: l('Closed 14 Fortune-500 design partners in 90 days from cold founder-led outreach.'),
              url: '',
              imageUrl: '',
              tags: ['GTM', 'B2B'],
            },
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: '',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
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
          location: l('Chennai, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'startup-03',
    name: 'Velocity',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Lavender Fog light theme for vp of products — Outfit headings with centered hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f3f0fc 0%, #dfd2f7 55%, #6d28d9 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#18142c',
        accent: '#6d28d9',
        surface: '#f3f0fc',
        text: '#272142',
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
          eyebrow: l('VP of Product'),
          headline: l('Shipping fast with obsessive user focus.'),
          subheadline: l('Passionate about high-agency teams, crisp product taste and compounding execution.'),
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
          title: l('Practice'),
          body: l('Passionate about high-agency teams, crisp product taste and compounding execution. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
            },
            {
              title: l('CronFlow Automation (Acquired)'),
              description: l('Co-founded and scaled workflow orchestration SaaS to $2.8M ARR and 1,400 paying teams before acquisition.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Founder', 'Exit'],
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
              quote: l('Turns chaotic early-stage hypotheses into clear metrics and shipped product every single week.'),
              author: l('Deepak Malhotra'),
              role: l('General Partner, Peak Ventures'),
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
    id: 'startup-04',
    name: 'Runway One',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Midnight Cobalt dark theme for founding engineers — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eff6ff',
        accent: '#60a5fa',
        surface: '#070b16',
        text: '#d8e4f8',
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
          eyebrow: l('Founding Engineer'),
          headline: l('Your Name'),
          subheadline: l('Two-time founder building infrastructure for automated developer workflows. Backed by top seed funds.'),
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
              title: l('CronFlow Automation (Acquired)'),
              description: l('Co-founded and scaled workflow orchestration SaaS to $2.8M ARR and 1,400 paying teams before acquisition.'),
              url: '',
              imageUrl: '',
              tags: ['Founder', 'Exit'],
            },
            {
              title: l('Enterprise Design Partner Program'),
              description: l('Closed 14 Fortune-500 design partners in 90 days from cold founder-led outreach.'),
              url: '',
              imageUrl: '',
              tags: ['GTM', 'B2B'],
            },
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: '',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['0-to-1 Product', 'Fundraising', 'Enterprise GTM', 'Team Building'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Turns chaotic early-stage hypotheses into clear metrics and shipped product every single week.'),
              author: l('Deepak Malhotra'),
              role: l('General Partner, Peak Ventures'),
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
          location: l('Ahmedabad, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'startup-05',
    name: 'Traction',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Porcelain Emerald light theme for chief of staffs — System headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d1f18',
        accent: '#0a8754',
        surface: '#f9fcfa',
        text: '#192a22',
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
          eyebrow: l('Chief of Staff'),
          headline: l('Turning hard technical wedges into enduring companies.'),
          subheadline: l('Helping technical founders find their first 50 enterprise customers and nail repeatable GTM.'),
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
          title: l('Approach'),
          body: l('Helping technical founders find their first 50 enterprise customers and nail repeatable GTM. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Focus Areas'),
          items: ['Product Strategy', 'Pricing & Packaging', 'Customer Discovery', 'Hiring'],
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
              title: l('Enterprise Design Partner Program'),
              description: l('Closed 14 Fortune-500 design partners in 90 days from cold founder-led outreach.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['GTM', 'B2B'],
            },
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
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
          location: l('Mysuru, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'startup-06',
    name: 'Flywheel',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Sage Mist light theme for head of operationss — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #eff7f2 0%, #cee5d7 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#122118',
        accent: '#15803d',
        surface: '#eff7f2',
        text: '#1d3025',
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
          eyebrow: l('Head of Operations'),
          headline: l('Operator, builder, early-stage advisor.'),
          subheadline: l('Passionate about high-agency teams, crisp product taste and compounding execution.'),
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
          title: l('Capabilities'),
          items: ['Technical Architecture', 'Board Comms', 'Unit Economics', 'Partnerships'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: '',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
            },
            {
              title: l('CronFlow Automation (Acquired)'),
              description: l('Co-founded and scaled workflow orchestration SaaS to $2.8M ARR and 1,400 paying teams before acquisition.'),
              url: '',
              imageUrl: '',
              tags: ['Founder', 'Exit'],
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
              role: l('Co-Founder & CEO'),
              company: l('OrbitOps'),
              period: l('2023 — Present'),
              description: l('Building autonomous incident triage for cloud-native engineering teams.'),
            },
            {
              role: l('VP Product'),
              company: l('StackPulse'),
              period: l('2020 — 2023'),
              description: l('Grew product org from 3 to 24 and launched 3 revenue-generating product lines.'),
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
              quote: l('Turns chaotic early-stage hypotheses into clear metrics and shipped product every single week.'),
              author: l('Deepak Malhotra'),
              role: l('General Partner, Peak Ventures'),
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
          location: l('Chennai, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'startup-07',
    name: 'Zero to One',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Abyssal Violet dark theme for startup advisor & angels — Outfit headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
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
          eyebrow: l('Startup Advisor & Angel'),
          headline: l('Zero to one, then scale.'),
          subheadline: l('Two-time founder building infrastructure for automated developer workflows. Backed by top seed funds.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Profile'),
          body: l('Two-time founder building infrastructure for automated developer workflows. Backed by top seed funds. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Co-Founder & CEO'),
              company: l('OrbitOps'),
              period: l('2023 — Present'),
              description: l('Building autonomous incident triage for cloud-native engineering teams.'),
            },
            {
              role: l('VP Product'),
              company: l('StackPulse'),
              period: l('2020 — 2023'),
              description: l('Grew product org from 3 to 24 and launched 3 revenue-generating product lines.'),
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
              degree: l('B.E. Electronics & Computing'),
              school: l('BITS Pilani'),
              period: l('2013 — 2017'),
              description: l('Co-founded campus entrepreneurship incubator.'),
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
              title: l('CronFlow Automation (Acquired)'),
              description: l('Co-founded and scaled workflow orchestration SaaS to $2.8M ARR and 1,400 paying teams before acquisition.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Founder', 'Exit'],
            },
            {
              title: l('Enterprise Design Partner Program'),
              description: l('Closed 14 Fortune-500 design partners in 90 days from cold founder-led outreach.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['GTM', 'B2B'],
            },
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
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
          location: l('Kolkata, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'startup-08',
    name: 'Shipyard',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Chalk Vermilion light theme for vp of engineerings — System headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #fcfbfa 0%, #f7ded9 55%, #d9381e 140%)',
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
          eyebrow: l('VP of Engineering'),
          headline: l('Building category-defining software.'),
          subheadline: l('Helping technical founders find their first 50 enterprise customers and nail repeatable GTM.'),
          primaryCtaLabel: l('Connect'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Product Strategy', 'Pricing & Packaging', 'Customer Discovery', 'Hiring'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Co-Founder & CEO'),
              company: l('OrbitOps'),
              period: l('2023 — Present'),
              description: l('Building autonomous incident triage for cloud-native engineering teams.'),
            },
            {
              role: l('VP Product'),
              company: l('StackPulse'),
              period: l('2020 — 2023'),
              description: l('Grew product org from 3 to 24 and launched 3 revenue-generating product lines.'),
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
              title: l('Enterprise Design Partner Program'),
              description: l('Closed 14 Fortune-500 design partners in 90 days from cold founder-led outreach.'),
              url: '',
              imageUrl: '',
              tags: ['GTM', 'B2B'],
            },
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: '',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
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
    id: 'startup-09',
    name: 'Foundry Bolt',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Blush Stone light theme for founding designers — Outfit headings with centered hero and compact spacing.',
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
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Founding Designer'),
          headline: l('Shipping fast with obsessive user focus.'),
          subheadline: l('Passionate about high-agency teams, crisp product taste and compounding execution.'),
          primaryCtaLabel: l('Get in touch'),
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
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
            },
            {
              title: l('CronFlow Automation (Acquired)'),
              description: l('Co-founded and scaled workflow orchestration SaaS to $2.8M ARR and 1,400 paying teams before acquisition.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Founder', 'Exit'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Passionate about high-agency teams, crisp product taste and compounding execution. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Co-Founder & CEO'),
              company: l('OrbitOps'),
              period: l('2023 — Present'),
              description: l('Building autonomous incident triage for cloud-native engineering teams.'),
            },
            {
              role: l('VP Product'),
              company: l('StackPulse'),
              period: l('2020 — 2023'),
              description: l('Grew product org from 3 to 24 and launched 3 revenue-generating product lines.'),
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
    id: 'startup-10',
    name: 'Scale Factor',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Charcoal Amber dark theme for revenue & gtm leads — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fffbeb',
        accent: '#fbbf24',
        surface: '#100e0a',
        text: '#ede5ce',
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
          eyebrow: l('Revenue & GTM Lead'),
          headline: l('Your Name'),
          subheadline: l('Two-time founder building infrastructure for automated developer workflows. Backed by top seed funds.'),
          primaryCtaLabel: l('View work'),
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
          title: l('Approach'),
          body: l('Two-time founder building infrastructure for automated developer workflows. Backed by top seed funds. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('CronFlow Automation (Acquired)'),
              description: l('Co-founded and scaled workflow orchestration SaaS to $2.8M ARR and 1,400 paying teams before acquisition.'),
              url: '',
              imageUrl: '',
              tags: ['Founder', 'Exit'],
            },
            {
              title: l('Enterprise Design Partner Program'),
              description: l('Closed 14 Fortune-500 design partners in 90 days from cold founder-led outreach.'),
              url: '',
              imageUrl: '',
              tags: ['GTM', 'B2B'],
            },
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: '',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
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
          location: l('Chennai, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'startup-11',
    name: 'Pivot Point',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Ice Indigo light theme for product executives — System headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f5f7ff 0%, #dcdcfb 55%, #4f46e5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#11132b',
        accent: '#4f46e5',
        surface: '#f5f7ff',
        text: '#1e2240',
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
          eyebrow: l('Product Executive'),
          headline: l('Turning hard technical wedges into enduring companies.'),
          subheadline: l('Helping technical founders find their first 50 enterprise customers and nail repeatable GTM.'),
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
          title: l('About'),
          body: l('Helping technical founders find their first 50 enterprise customers and nail repeatable GTM. Based in Kolkata, working with teams worldwide.'),
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
          title: l('Endorsements'),
          items: [
            {
              quote: l('Turns chaotic early-stage hypotheses into clear metrics and shipped product every single week.'),
              author: l('Deepak Malhotra'),
              role: l('General Partner, Peak Ventures'),
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
    id: 'startup-12',
    name: 'Northstar Pitch',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Glacier Blue light theme for eir (entrepreneur in residence)s — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #eff7fd 0%, #cce2ef 55%, #0369a1 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1c2b',
        accent: '#0369a1',
        surface: '#eff7fd',
        text: '#1a2c3d',
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
          eyebrow: l('EIR (Entrepreneur in Residence)'),
          headline: l('Operator, builder, early-stage advisor.'),
          subheadline: l('Passionate about high-agency teams, crisp product taste and compounding execution.'),
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
          title: l('Profile'),
          body: l('Passionate about high-agency teams, crisp product taste and compounding execution. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Technical Architecture', 'Board Comms', 'Unit Economics', 'Partnerships'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: '',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
            },
            {
              title: l('CronFlow Automation (Acquired)'),
              description: l('Co-founded and scaled workflow orchestration SaaS to $2.8M ARR and 1,400 paying teams before acquisition.'),
              url: '',
              imageUrl: '',
              tags: ['Founder', 'Exit'],
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
          location: l('Ahmedabad, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'startup-13',
    name: 'Rocket Fuel',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Velvet Rose dark theme for deep-tech founders — Outfit headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
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
          eyebrow: l('Deep-Tech Founder'),
          headline: l('Zero to one, then scale.'),
          subheadline: l('Two-time founder building infrastructure for automated developer workflows. Backed by top seed funds.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Two-time founder building infrastructure for automated developer workflows. Backed by top seed funds. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('CronFlow Automation (Acquired)'),
              description: l('Co-founded and scaled workflow orchestration SaaS to $2.8M ARR and 1,400 paying teams before acquisition.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Founder', 'Exit'],
            },
            {
              title: l('Enterprise Design Partner Program'),
              description: l('Closed 14 Fortune-500 design partners in 90 days from cold founder-led outreach.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['GTM', 'B2B'],
            },
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
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
              quote: l('Turns chaotic early-stage hypotheses into clear metrics and shipped product every single week.'),
              author: l('Deepak Malhotra'),
              role: l('General Partner, Peak Ventures'),
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
    id: 'startup-14',
    name: 'Momentum',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Linen Terracotta light theme for ai startup builders — System headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fdf8f3 0%, #f4dfd5 55%, #c2512b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261710',
        accent: '#c2512b',
        surface: '#fdf8f3',
        text: '#332219',
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
          eyebrow: l('AI Startup Builder'),
          headline: l('Building category-defining software.'),
          subheadline: l('Helping technical founders find their first 50 enterprise customers and nail repeatable GTM.'),
          primaryCtaLabel: l('Start a project'),
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
              title: l('Enterprise Design Partner Program'),
              description: l('Closed 14 Fortune-500 design partners in 90 days from cold founder-led outreach.'),
              url: '',
              imageUrl: '',
              tags: ['GTM', 'B2B'],
            },
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: '',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Product Strategy', 'Pricing & Packaging', 'Customer Discovery', 'Hiring'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Turns chaotic early-stage hypotheses into clear metrics and shipped product every single week.'),
              author: l('Deepak Malhotra'),
              role: l('General Partner, Peak Ventures'),
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
          location: l('Chennai, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'startup-15',
    name: 'Venture Grid',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Apricot Cream light theme for b2b saas operators — Outfit headings with centered hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fff4ec 0%, #f6d9ca 55%, #c2410c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#26160e',
        accent: '#c2410c',
        surface: '#fff4ec',
        text: '#362218',
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
          eyebrow: l('B2B SaaS Operator'),
          headline: l('Shipping fast with obsessive user focus.'),
          subheadline: l('Passionate about high-agency teams, crisp product taste and compounding execution.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Passionate about high-agency teams, crisp product taste and compounding execution. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Focus Areas'),
          items: ['Technical Architecture', 'Board Comms', 'Unit Economics', 'Partnerships'],
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
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
            },
            {
              title: l('CronFlow Automation (Acquired)'),
              description: l('Co-founded and scaled workflow orchestration SaaS to $2.8M ARR and 1,400 paying teams before acquisition.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Founder', 'Exit'],
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
          location: l('Kolkata, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'startup-16',
    name: 'Catalyst',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Deep Teal dark theme for marketplace builders — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f0fdfa',
        accent: '#2dd4bf',
        surface: '#071112',
        text: '#cce8e4',
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
          eyebrow: l('Marketplace Builder'),
          headline: l('Your Name'),
          subheadline: l('Two-time founder building infrastructure for automated developer workflows. Backed by top seed funds.'),
          primaryCtaLabel: l('Connect'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['0-to-1 Product', 'Fundraising', 'Enterprise GTM', 'Team Building'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('CronFlow Automation (Acquired)'),
              description: l('Co-founded and scaled workflow orchestration SaaS to $2.8M ARR and 1,400 paying teams before acquisition.'),
              url: '',
              imageUrl: '',
              tags: ['Founder', 'Exit'],
            },
            {
              title: l('Enterprise Design Partner Program'),
              description: l('Closed 14 Fortune-500 design partners in 90 days from cold founder-led outreach.'),
              url: '',
              imageUrl: '',
              tags: ['GTM', 'B2B'],
            },
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: '',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
            }
          ],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Co-Founder & CEO'),
              company: l('OrbitOps'),
              period: l('2023 — Present'),
              description: l('Building autonomous incident triage for cloud-native engineering teams.'),
            },
            {
              role: l('VP Product'),
              company: l('StackPulse'),
              period: l('2020 — 2023'),
              description: l('Grew product org from 3 to 24 and launched 3 revenue-generating product lines.'),
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
              quote: l('Turns chaotic early-stage hypotheses into clear metrics and shipped product every single week.'),
              author: l('Deepak Malhotra'),
              role: l('General Partner, Peak Ventures'),
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
          location: l('Ahmedabad, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'startup-17',
    name: 'Ignition',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Nordic Spruce light theme for fintech founders — System headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f4fafa 0%, #d2e7e7 55%, #0e7c7b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0c1c1c',
        accent: '#0e7c7b',
        surface: '#f4fafa',
        text: '#172b2b',
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
          eyebrow: l('Fintech Founder'),
          headline: l('Turning hard technical wedges into enduring companies.'),
          subheadline: l('Helping technical founders find their first 50 enterprise customers and nail repeatable GTM.'),
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
          title: l('Profile'),
          body: l('Helping technical founders find their first 50 enterprise customers and nail repeatable GTM. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Co-Founder & CEO'),
              company: l('OrbitOps'),
              period: l('2023 — Present'),
              description: l('Building autonomous incident triage for cloud-native engineering teams.'),
            },
            {
              role: l('VP Product'),
              company: l('StackPulse'),
              period: l('2020 — 2023'),
              description: l('Grew product org from 3 to 24 and launched 3 revenue-generating product lines.'),
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
              degree: l('B.E. Electronics & Computing'),
              school: l('BITS Pilani'),
              period: l('2013 — 2017'),
              description: l('Co-founded campus entrepreneurship incubator.'),
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
              title: l('Enterprise Design Partner Program'),
              description: l('Closed 14 Fortune-500 design partners in 90 days from cold founder-led outreach.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['GTM', 'B2B'],
            },
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
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
          location: l('Mysuru, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'startup-18',
    name: 'Hyperfocus',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Mint Frost light theme for climate tech operators — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #eefaf7 0%, #cde6e2 55%, #0f766e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e221e',
        accent: '#0f766e',
        surface: '#eefaf7',
        text: '#1a322d',
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
          eyebrow: l('Climate Tech Operator'),
          headline: l('Operator, builder, early-stage advisor.'),
          subheadline: l('Passionate about high-agency teams, crisp product taste and compounding execution.'),
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
          title: l('Specialties'),
          items: ['Technical Architecture', 'Board Comms', 'Unit Economics', 'Partnerships'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Co-Founder & CEO'),
              company: l('OrbitOps'),
              period: l('2023 — Present'),
              description: l('Building autonomous incident triage for cloud-native engineering teams.'),
            },
            {
              role: l('VP Product'),
              company: l('StackPulse'),
              period: l('2020 — 2023'),
              description: l('Grew product org from 3 to 24 and launched 3 revenue-generating product lines.'),
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
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: '',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
            },
            {
              title: l('CronFlow Automation (Acquired)'),
              description: l('Co-founded and scaled workflow orchestration SaaS to $2.8M ARR and 1,400 paying teams before acquisition.'),
              url: '',
              imageUrl: '',
              tags: ['Founder', 'Exit'],
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
    id: 'startup-19',
    name: 'Apex Venture',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Smoked Tangerine dark theme for developer tools founders — Outfit headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #120c08 0%, #452913 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff7ed',
        accent: '#fb923c',
        surface: '#120c08',
        text: '#f0dfd1',
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
          eyebrow: l('Developer Tools Founder'),
          headline: l('Zero to one, then scale.'),
          subheadline: l('Two-time founder building infrastructure for automated developer workflows. Backed by top seed funds.'),
          primaryCtaLabel: l('See projects'),
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
              title: l('CronFlow Automation (Acquired)'),
              description: l('Co-founded and scaled workflow orchestration SaaS to $2.8M ARR and 1,400 paying teams before acquisition.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Founder', 'Exit'],
            },
            {
              title: l('Enterprise Design Partner Program'),
              description: l('Closed 14 Fortune-500 design partners in 90 days from cold founder-led outreach.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['GTM', 'B2B'],
            },
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Two-time founder building infrastructure for automated developer workflows. Backed by top seed funds. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Co-Founder & CEO'),
              company: l('OrbitOps'),
              period: l('2023 — Present'),
              description: l('Building autonomous incident triage for cloud-native engineering teams.'),
            },
            {
              role: l('VP Product'),
              company: l('StackPulse'),
              period: l('2020 — 2023'),
              description: l('Grew product org from 3 to 24 and launched 3 revenue-generating product lines.'),
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
    id: 'startup-20',
    name: 'Seed Stage',
    category: 'startup',
    family: 'Startup Bold',
    audience: ['founder', 'product manager', 'executive'],
    description: 'Cloud Plum light theme for seed investors — System headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #fbf8fe 0%, #e8d8f7 55%, #7e22ce 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1e1024',
        accent: '#7e22ce',
        surface: '#fbf8fe',
        text: '#2b1b33',
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
          eyebrow: l('Seed Investor'),
          headline: l('Building category-defining software.'),
          subheadline: l('Helping technical founders find their first 50 enterprise customers and nail repeatable GTM.'),
          primaryCtaLabel: l('Book a call'),
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
          title: l('Approach'),
          body: l('Helping technical founders find their first 50 enterprise customers and nail repeatable GTM. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Enterprise Design Partner Program'),
              description: l('Closed 14 Fortune-500 design partners in 90 days from cold founder-led outreach.'),
              url: '',
              imageUrl: '',
              tags: ['GTM', 'B2B'],
            },
            {
              title: l('Angel & Syndicate Portfolio'),
              description: l('Early angel check and hands-on product advisor to 11 developer-tool and AI startups.'),
              url: '',
              imageUrl: '',
              tags: ['Advisory', 'Seed'],
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
          location: l('Ahmedabad, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
];
