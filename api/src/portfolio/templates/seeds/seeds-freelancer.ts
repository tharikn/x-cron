// Auto-generated template seeds — Freelancer Showcase (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_FREELANCER: SeedTemplate[] = [
  {
    id: 'freelancer-02',
    name: 'Solo Craft',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Vellum Rust light theme for freelance web designers — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #faf4ea 0%, #eed9cb 55%, #a8431a 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261a12',
        accent: '#a8431a',
        surface: '#faf4ea',
        text: '#33241b',
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
          eyebrow: l('Freelance Web Designer'),
          headline: l('Your Name'),
          subheadline: l('I help founders and marketing teams ship websites, product redesigns and conversion experiments on predictable weekly retainers.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#contact-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('I help founders and marketing teams ship websites, product redesigns and conversion experiments on predictable weekly retainers. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Landing Pages', 'Product UI', 'Conversion Copy', 'Rapid Prototyping'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('SaaS Marketing Relaunch'),
              description: l('2-week sprint from positioning workshop to live responsive site; demo requests doubled.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['2-Week Sprint', 'Web'],
            },
            {
              title: l('Onboarding UX Audit'),
              description: l('Identified 14 activation drop-off blockers and delivered ready-to-build Figma fixes.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX Audit', 'SaaS'],
            },
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
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
          location: l('Bengaluru, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'freelancer-03',
    name: 'Fixed Scope',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Lavender Fog light theme for independent product consultants — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f3f0fc 0%, #dfd2f7 55%, #6d28d9 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#18142c',
        accent: '#6d28d9',
        surface: '#f3f0fc',
        text: '#272142',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Independent Product Consultant'),
          headline: l('Senior craft without agency overhead.'),
          subheadline: l('Ten years of senior experience delivered directly—no account managers, no bloated timelines.'),
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
          body: l('Ten years of senior experience delivered directly—no account managers, no bloated timelines. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Onboarding UX Audit'),
              description: l('Identified 14 activation drop-off blockers and delivered ready-to-build Figma fixes.'),
              url: '',
              imageUrl: '',
              tags: ['UX Audit', 'SaaS'],
            },
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
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
              quote: l('Fastest, cleanest contractor we have ever hired—shipped ahead of schedule.'),
              author: l('Nikhil Kapoor'),
              role: l('Founder, RelayHQ'),
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
    id: 'freelancer-04',
    name: 'Studio of One',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Alabaster Cobalt light theme for contract full-stack devs — System headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fafbfe 0%, #dae2fd 55%, #2457f5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1320',
        accent: '#2457f5',
        surface: '#fafbfe',
        text: '#1c2436',
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
          eyebrow: l('Contract Full-Stack Dev'),
          headline: l('Fixed-scope sprints that ship in two weeks.'),
          subheadline: l('Available for two-week design sprints, product audits and fractional leadership engagements.'),
          primaryCtaLabel: l('See projects'),
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
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
            },
            {
              title: l('SaaS Marketing Relaunch'),
              description: l('2-week sprint from positioning workshop to live responsive site; demo requests doubled.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['2-Week Sprint', 'Web'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Fixed-Scope Sprints', 'UX Audits', 'Brand Refresh', 'Analytics'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Fastest, cleanest contractor we have ever hired—shipped ahead of schedule.'),
              author: l('Nikhil Kapoor'),
              role: l('Founder, RelayHQ'),
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
          location: l('Goa, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'freelancer-05',
    name: 'Direct Hire',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Obsidian Emerald dark theme for conversion copywriters — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Conversion Copywriter'),
          headline: l('Your Name'),
          subheadline: l('I help founders and marketing teams ship websites, product redesigns and conversion experiments on predictable weekly retainers.'),
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
          body: l('I help founders and marketing teams ship websites, product redesigns and conversion experiments on predictable weekly retainers. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Toolkit'),
          items: ['Landing Pages', 'Product UI', 'Conversion Copy', 'Rapid Prototyping'],
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
              title: l('SaaS Marketing Relaunch'),
              description: l('2-week sprint from positioning workshop to live responsive site; demo requests doubled.'),
              url: '',
              imageUrl: '',
              tags: ['2-Week Sprint', 'Web'],
            },
            {
              title: l('Onboarding UX Audit'),
              description: l('Identified 14 activation drop-off blockers and delivered ready-to-build Figma fixes.'),
              url: '',
              imageUrl: '',
              tags: ['UX Audit', 'SaaS'],
            },
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
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
          location: l('Madurai, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'freelancer-06',
    name: 'Retainer Pro',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Newsprint Navy light theme for freelance ux auditors — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f7f4ec 0%, #d6d9e3 55%, #1e40af 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#161b26',
        accent: '#1e40af',
        surface: '#f7f4ec',
        text: '#232936',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Freelance UX Auditor'),
          headline: l('Clear timelines, direct communication, real results.'),
          subheadline: l('Ten years of senior experience delivered directly—no account managers, no bloated timelines.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Webflow / Angular', 'SEO Setup', 'Design Handoff', 'User Testing'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Onboarding UX Audit'),
              description: l('Identified 14 activation drop-off blockers and delivered ready-to-build Figma fixes.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX Audit', 'SaaS'],
            },
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
            }
          ],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Independent Product & Web Partner'),
              company: l('Self-Employed'),
              period: l('2020 — Present'),
              description: l('Delivered 45+ client projects across India, Europe and North America.'),
            },
            {
              role: l('Lead Product Designer'),
              company: l('Northwave Studio'),
              period: l('2017 — 2020'),
              description: l('Led client workshops and shipped multi-platform digital products.'),
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
              quote: l('Fastest, cleanest contractor we have ever hired—shipped ahead of schedule.'),
              author: l('Nikhil Kapoor'),
              role: l('Founder, RelayHQ'),
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
          location: l('Bengaluru, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'freelancer-07',
    name: 'Launch Week',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Sage Mist light theme for brand sprint partners — System headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #eff7f2 0%, #cee5d7 55%, #15803d 140%)',
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
          eyebrow: l('Brand Sprint Partner'),
          headline: l('High-converting sites and product UI for lean teams.'),
          subheadline: l('Available for two-week design sprints, product audits and fractional leadership engagements.'),
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
          body: l('Available for two-week design sprints, product audits and fractional leadership engagements. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Independent Product & Web Partner'),
              company: l('Self-Employed'),
              period: l('2020 — Present'),
              description: l('Delivered 45+ client projects across India, Europe and North America.'),
            },
            {
              role: l('Lead Product Designer'),
              company: l('Northwave Studio'),
              period: l('2017 — 2020'),
              description: l('Led client workshops and shipped multi-platform digital products.'),
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
              degree: l('B.A. Communication & Media'),
              school: l('Symbiosis Pune'),
              period: l('2013 — 2017'),
              description: l('Visual communication and digital storytelling.'),
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
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
            },
            {
              title: l('SaaS Marketing Relaunch'),
              description: l('2-week sprint from positioning workshop to live responsive site; demo requests doubled.'),
              url: '',
              imageUrl: '',
              tags: ['2-Week Sprint', 'Web'],
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
          location: l('Jaipur, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'freelancer-08',
    name: 'Swift Sprint',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Porcelain Emerald light theme for no-code & webflow builders — Outfit headings with centered hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('No-Code & Webflow Builder'),
          headline: l('Your Name'),
          subheadline: l('I help founders and marketing teams ship websites, product redesigns and conversion experiments on predictable weekly retainers.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Landing Pages', 'Product UI', 'Conversion Copy', 'Rapid Prototyping'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Independent Product & Web Partner'),
              company: l('Self-Employed'),
              period: l('2020 — Present'),
              description: l('Delivered 45+ client projects across India, Europe and North America.'),
            },
            {
              role: l('Lead Product Designer'),
              company: l('Northwave Studio'),
              period: l('2017 — 2020'),
              description: l('Led client workshops and shipped multi-platform digital products.'),
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
              title: l('SaaS Marketing Relaunch'),
              description: l('2-week sprint from positioning workshop to live responsive site; demo requests doubled.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['2-Week Sprint', 'Web'],
            },
            {
              title: l('Onboarding UX Audit'),
              description: l('Identified 14 activation drop-off blockers and delivered ready-to-build Figma fixes.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX Audit', 'SaaS'],
            },
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
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
    id: 'freelancer-09',
    name: 'Clear Brief',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Midnight Cobalt dark theme for fractional product leads — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eff6ff',
        accent: '#60a5fa',
        surface: '#070b16',
        text: '#d8e4f8',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Fractional Product Lead'),
          headline: l('Senior craft without agency overhead.'),
          subheadline: l('Ten years of senior experience delivered directly—no account managers, no bloated timelines.'),
          primaryCtaLabel: l('Connect'),
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
              title: l('Onboarding UX Audit'),
              description: l('Identified 14 activation drop-off blockers and delivered ready-to-build Figma fixes.'),
              url: '',
              imageUrl: '',
              tags: ['UX Audit', 'SaaS'],
            },
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Practice'),
          body: l('Ten years of senior experience delivered directly—no account managers, no bloated timelines. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Independent Product & Web Partner'),
              company: l('Self-Employed'),
              period: l('2020 — Present'),
              description: l('Delivered 45+ client projects across India, Europe and North America.'),
            },
            {
              role: l('Lead Product Designer'),
              company: l('Northwave Studio'),
              period: l('2017 — 2020'),
              description: l('Led client workshops and shipped multi-platform digital products.'),
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
    id: 'freelancer-10',
    name: 'Independent',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Parchment Olive light theme for independent seo consultants — System headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f8f5ea 0%, #e1e0cc 55%, #5c6b24 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1f2314',
        accent: '#5c6b24',
        surface: '#f8f5ea',
        text: '#2c301e',
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
          eyebrow: l('Independent SEO Consultant'),
          headline: l('Fixed-scope sprints that ship in two weeks.'),
          subheadline: l('Available for two-week design sprints, product audits and fractional leadership engagements.'),
          primaryCtaLabel: l('Get in touch'),
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
          title: l('Overview'),
          body: l('Available for two-week design sprints, product audits and fractional leadership engagements. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
            },
            {
              title: l('SaaS Marketing Relaunch'),
              description: l('2-week sprint from positioning workshop to live responsive site; demo requests doubled.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['2-Week Sprint', 'Web'],
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
          location: l('Bengaluru, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'freelancer-11',
    name: 'Deliverable',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Blush Stone light theme for freelance motion designers — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fcf1f3 0%, #f3d0d8 55%, #be123c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261418',
        accent: '#be123c',
        surface: '#fcf1f3',
        text: '#362025',
        fontHeading: 'Outfit',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Freelance Motion Designer'),
          headline: l('Your Name'),
          subheadline: l('I help founders and marketing teams ship websites, product redesigns and conversion experiments on predictable weekly retainers.'),
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
          body: l('I help founders and marketing teams ship websites, product redesigns and conversion experiments on predictable weekly retainers. Based in Jaipur, working with teams worldwide.'),
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
          title: l('Kind Words'),
          items: [
            {
              quote: l('Fastest, cleanest contractor we have ever hired—shipped ahead of schedule.'),
              author: l('Nikhil Kapoor'),
              role: l('Founder, RelayHQ'),
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
    id: 'freelancer-12',
    name: 'Crafted Solo',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Chalk Vermilion light theme for email & crm specialists — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fcfbfa 0%, #f7ded9 55%, #d9381e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#191414',
        accent: '#d9381e',
        surface: '#fcfbfa',
        text: '#241e1d',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Email & CRM Specialist'),
          headline: l('Clear timelines, direct communication, real results.'),
          subheadline: l('Ten years of senior experience delivered directly—no account managers, no bloated timelines.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#contact-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Ten years of senior experience delivered directly—no account managers, no bloated timelines. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Webflow / Angular', 'SEO Setup', 'Design Handoff', 'User Testing'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Onboarding UX Audit'),
              description: l('Identified 14 activation drop-off blockers and delivered ready-to-build Figma fixes.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX Audit', 'SaaS'],
            },
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
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
          location: l('Goa, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'freelancer-13',
    name: 'Warm Desk',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Abyssal Violet dark theme for contract mobile developers — System headings with editorial hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Contract Mobile Developer'),
          headline: l('High-converting sites and product UI for lean teams.'),
          subheadline: l('Available for two-week design sprints, product audits and fractional leadership engagements.'),
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
          body: l('Available for two-week design sprints, product audits and fractional leadership engagements. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
            },
            {
              title: l('SaaS Marketing Relaunch'),
              description: l('2-week sprint from positioning workshop to live responsive site; demo requests doubled.'),
              url: '',
              imageUrl: '',
              tags: ['2-Week Sprint', 'Web'],
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
              quote: l('Fastest, cleanest contractor we have ever hired—shipped ahead of schedule.'),
              author: l('Nikhil Kapoor'),
              role: l('Founder, RelayHQ'),
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
    id: 'freelancer-14',
    name: 'Partner Slot',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Cream Burgundy light theme for shopify & storefront experts — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fcf8f2 0%, #eed5d6 55%, #9f1239 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#281217',
        accent: '#9f1239',
        surface: '#fcf8f2',
        text: '#381d23',
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
          eyebrow: l('Shopify & Storefront Expert'),
          headline: l('Your Name'),
          subheadline: l('I help founders and marketing teams ship websites, product redesigns and conversion experiments on predictable weekly retainers.'),
          primaryCtaLabel: l('Explore portfolio'),
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
              title: l('SaaS Marketing Relaunch'),
              description: l('2-week sprint from positioning workshop to live responsive site; demo requests doubled.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['2-Week Sprint', 'Web'],
            },
            {
              title: l('Onboarding UX Audit'),
              description: l('Identified 14 activation drop-off blockers and delivered ready-to-build Figma fixes.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX Audit', 'SaaS'],
            },
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Landing Pages', 'Product UI', 'Conversion Copy', 'Rapid Prototyping'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Fastest, cleanest contractor we have ever hired—shipped ahead of schedule.'),
              author: l('Nikhil Kapoor'),
              role: l('Founder, RelayHQ'),
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
          location: l('Bengaluru, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'freelancer-15',
    name: 'Open Calendar',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Glacier Blue light theme for pitch deck designers — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #eff7fd 0%, #cce2ef 55%, #0369a1 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1c2b',
        accent: '#0369a1',
        surface: '#eff7fd',
        text: '#1a2c3d',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Pitch Deck Designer'),
          headline: l('Senior craft without agency overhead.'),
          subheadline: l('Ten years of senior experience delivered directly—no account managers, no bloated timelines.'),
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
          body: l('Ten years of senior experience delivered directly—no account managers, no bloated timelines. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Toolkit'),
          items: ['Webflow / Angular', 'SEO Setup', 'Design Handoff', 'User Testing'],
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
              title: l('Onboarding UX Audit'),
              description: l('Identified 14 activation drop-off blockers and delivered ready-to-build Figma fixes.'),
              url: '',
              imageUrl: '',
              tags: ['UX Audit', 'SaaS'],
            },
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
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
          location: l('Jaipur, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'freelancer-16',
    name: 'Boutique Solo',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Ice Indigo light theme for technical content writers — System headings with editorial hero and comfortable spacing.',
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
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Technical Content Writer'),
          headline: l('Fixed-scope sprints that ship in two weeks.'),
          subheadline: l('Available for two-week design sprints, product audits and fractional leadership engagements.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Fixed-Scope Sprints', 'UX Audits', 'Brand Refresh', 'Analytics'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
            },
            {
              title: l('SaaS Marketing Relaunch'),
              description: l('2-week sprint from positioning workshop to live responsive site; demo requests doubled.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['2-Week Sprint', 'Web'],
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
              role: l('Independent Product & Web Partner'),
              company: l('Self-Employed'),
              period: l('2020 — Present'),
              description: l('Delivered 45+ client projects across India, Europe and North America.'),
            },
            {
              role: l('Lead Product Designer'),
              company: l('Northwave Studio'),
              period: l('2017 — 2020'),
              description: l('Led client workshops and shipped multi-platform digital products.'),
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
              quote: l('Fastest, cleanest contractor we have ever hired—shipped ahead of schedule.'),
              author: l('Nikhil Kapoor'),
              role: l('Founder, RelayHQ'),
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
          location: l('Goa, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'freelancer-17',
    name: 'Client Ready',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Charcoal Amber dark theme for fractional cmos — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
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
        variant: 'centered',
        props: {
          eyebrow: l('Fractional CMO'),
          headline: l('Your Name'),
          subheadline: l('I help founders and marketing teams ship websites, product redesigns and conversion experiments on predictable weekly retainers.'),
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
          body: l('I help founders and marketing teams ship websites, product redesigns and conversion experiments on predictable weekly retainers. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Independent Product & Web Partner'),
              company: l('Self-Employed'),
              period: l('2020 — Present'),
              description: l('Delivered 45+ client projects across India, Europe and North America.'),
            },
            {
              role: l('Lead Product Designer'),
              company: l('Northwave Studio'),
              period: l('2017 — 2020'),
              description: l('Led client workshops and shipped multi-platform digital products.'),
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
              degree: l('B.A. Communication & Media'),
              school: l('Symbiosis Pune'),
              period: l('2013 — 2017'),
              description: l('Visual communication and digital storytelling.'),
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
              title: l('SaaS Marketing Relaunch'),
              description: l('2-week sprint from positioning workshop to live responsive site; demo requests doubled.'),
              url: '',
              imageUrl: '',
              tags: ['2-Week Sprint', 'Web'],
            },
            {
              title: l('Onboarding UX Audit'),
              description: l('Identified 14 activation drop-off blockers and delivered ready-to-build Figma fixes.'),
              url: '',
              imageUrl: '',
              tags: ['UX Audit', 'SaaS'],
            },
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
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
          location: l('Madurai, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'freelancer-18',
    name: 'Sprint Partner',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Oatmeal Forest light theme for analytics & tracking setups — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f9f5ec 0%, #d7e3d2 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#142219',
        accent: '#15803d',
        surface: '#f9f5ec',
        text: '#213026',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Analytics & Tracking Setup'),
          headline: l('Clear timelines, direct communication, real results.'),
          subheadline: l('Ten years of senior experience delivered directly—no account managers, no bloated timelines.'),
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
          title: l('Core Stack'),
          items: ['Webflow / Angular', 'SEO Setup', 'Design Handoff', 'User Testing'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Independent Product & Web Partner'),
              company: l('Self-Employed'),
              period: l('2020 — Present'),
              description: l('Delivered 45+ client projects across India, Europe and North America.'),
            },
            {
              role: l('Lead Product Designer'),
              company: l('Northwave Studio'),
              period: l('2017 — 2020'),
              description: l('Led client workshops and shipped multi-platform digital products.'),
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
              title: l('Onboarding UX Audit'),
              description: l('Identified 14 activation drop-off blockers and delivered ready-to-build Figma fixes.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX Audit', 'SaaS'],
            },
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
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
    id: 'freelancer-19',
    name: 'Tailored Web',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Apricot Cream light theme for design system contractors — System headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fff4ec 0%, #f6d9ca 55%, #c2410c 140%)',
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
          eyebrow: l('Design System Contractor'),
          headline: l('High-converting sites and product UI for lean teams.'),
          subheadline: l('Available for two-week design sprints, product audits and fractional leadership engagements.'),
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
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
            },
            {
              title: l('SaaS Marketing Relaunch'),
              description: l('2-week sprint from positioning workshop to live responsive site; demo requests doubled.'),
              url: '',
              imageUrl: '',
              tags: ['2-Week Sprint', 'Web'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Practice'),
          body: l('Available for two-week design sprints, product audits and fractional leadership engagements. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Independent Product & Web Partner'),
              company: l('Self-Employed'),
              period: l('2020 — Present'),
              description: l('Delivered 45+ client projects across India, Europe and North America.'),
            },
            {
              role: l('Lead Product Designer'),
              company: l('Northwave Studio'),
              period: l('2017 — 2020'),
              description: l('Led client workshops and shipped multi-platform digital products.'),
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
    id: 'freelancer-20',
    name: 'Quick Turn',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Linen Terracotta light theme for landing page specialists — Outfit headings with centered hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Landing Page Specialist'),
          headline: l('Your Name'),
          subheadline: l('I help founders and marketing teams ship websites, product redesigns and conversion experiments on predictable weekly retainers.'),
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
          title: l('Overview'),
          body: l('I help founders and marketing teams ship websites, product redesigns and conversion experiments on predictable weekly retainers. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('SaaS Marketing Relaunch'),
              description: l('2-week sprint from positioning workshop to live responsive site; demo requests doubled.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['2-Week Sprint', 'Web'],
            },
            {
              title: l('Onboarding UX Audit'),
              description: l('Identified 14 activation drop-off blockers and delivered ready-to-build Figma fixes.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX Audit', 'SaaS'],
            },
            {
              title: l('Series A Pitch & Brand'),
              description: l('Crafted narrative deck and investor microsite for a climate fintech raise.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Deck'],
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
          location: l('Goa, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'freelancer-21',
    name: 'Pocket Agency',
    category: 'freelancer',
    family: 'Freelancer Showcase',
    audience: ['freelancer', 'consultant', 'designer'],
    description: 'Velvet Rose dark theme for solo software studios — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Solo Software Studio'),
          headline: l('Senior craft without agency overhead.'),
          subheadline: l('Ten years of senior experience delivered directly—no account managers, no bloated timelines.'),
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
          body: l('Ten years of senior experience delivered directly—no account managers, no bloated timelines. Based in Madurai, working with teams worldwide.'),
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
          title: l('Endorsements'),
          items: [
            {
              quote: l('Fastest, cleanest contractor we have ever hired—shipped ahead of schedule.'),
              author: l('Nikhil Kapoor'),
              role: l('Founder, RelayHQ'),
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
];
