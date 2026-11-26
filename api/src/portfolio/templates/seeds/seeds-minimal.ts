// Auto-generated template seeds — Minimal Clean (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_MINIMAL: SeedTemplate[] = [
  {
    id: 'minimal-01',
    name: 'Swiss Grid',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Alabaster Cobalt light theme for product designers — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fafbfe 0%, #dae2fd 55%, #2457f5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1320',
        accent: '#2457f5',
        surface: '#fafbfe',
        text: '#1c2436',
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
          eyebrow: l('Product Designer'),
          headline: l('Your Name'),
          subheadline: l('I design calm, useful interfaces for teams that care about craft and long-term maintainability.'),
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
          body: l('I design calm, useful interfaces for teams that care about craft and long-term maintainability. Based in Coimbatore, working with teams worldwide.'),
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
              quote: l('Brings rare calm to messy product debates and ships designs engineers love building.'),
              author: l('Priya Nair'),
              role: l('VP of Product, Northstar'),
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
    id: 'minimal-02',
    name: 'Cloud Paper',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Lavender Fog light theme for design systems leads — Outfit headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f3f0fc 0%, #dfd2f7 55%, #6d28d9 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#18142c',
        accent: '#6d28d9',
        surface: '#f3f0fc',
        text: '#272142',
        fontHeading: 'Outfit',
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
          eyebrow: l('Design Systems Lead'),
          headline: l('Designing calm, useful systems.'),
          subheadline: l('Building multi-brand design systems, accessible primitives and crisp web applications.'),
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
          body: l('Building multi-brand design systems, accessible primitives and crisp web applications. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['TypeScript', 'Angular', 'CSS Architecture', 'WCAG AA', 'Design Tokens'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Checkout Clarity Overhaul'),
              description: l('Redesigned multi-currency pricing and recovery states, raising conversion by 19% across mobile web.'),
              url: '',
              imageUrl: '',
              tags: ['E-commerce', 'UX'],
            },
            {
              title: l('Zero-Friction Onboarding'),
              description: l('Replaced a 7-step setup wizard with contextual progressive disclosure; activation rose from 41% to 68%.'),
              url: '',
              imageUrl: '',
              tags: ['Activation', 'Product'],
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
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'minimal-03',
    name: 'Quiet Margin',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Obsidian Emerald dark theme for staff ux engineers — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Staff UX Engineer'),
          headline: l('Clarity as a competitive edge.'),
          subheadline: l('Turning ambiguous enterprise workflows into intuitive, low-friction tools.'),
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
          body: l('Turning ambiguous enterprise workflows into intuitive, low-friction tools. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Zero-Friction Onboarding'),
              description: l('Replaced a 7-step setup wizard with contextual progressive disclosure; activation rose from 41% to 68%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Activation', 'Product'],
            },
            {
              title: l('Workspace Permissions UI'),
              description: l('Condensed 11 legacy admin screens into a single role-matrix editor with live preview.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Enterprise', 'IA'],
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
              quote: l('Brings rare calm to messy product debates and ships designs engineers love building.'),
              author: l('Priya Nair'),
              role: l('VP of Product, Northstar'),
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
    id: 'minimal-04',
    name: 'Still Water',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Porcelain Emerald light theme for brand strategists — System headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d1f18',
        accent: '#0a8754',
        surface: '#f9fcfa',
        text: '#192a22',
        fontHeading: 'System',
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
          eyebrow: l('Brand Strategist'),
          headline: l('Your Name'),
          subheadline: l('Helping early-stage teams establish clear visual language and product positioning.'),
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
              title: l('Workspace Permissions UI'),
              description: l('Condensed 11 legacy admin screens into a single role-matrix editor with live preview.'),
              url: '',
              imageUrl: '',
              tags: ['Enterprise', 'IA'],
            },
            {
              title: l('Design-to-Code Pipeline'),
              description: l('Automated Figma token sync into CSS custom properties across web and mobile.'),
              url: '',
              imageUrl: '',
              tags: ['Tooling', 'DX'],
            },
            {
              title: l('Accessibility Audit & Fix'),
              description: l('Brought core customer journeys to full keyboard and screen-reader compliance.'),
              url: '',
              imageUrl: '',
              tags: ['WCAG', 'Frontend'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Product Strategy', 'Roadmapping', 'Discovery', 'Analytics', 'Stakeholder Alignment'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Every screen feels inevitable in hindsight—zero decorative noise.'),
              author: l('Arjun Mehta'),
              role: l('Engineering Lead'),
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
          location: l('Hyderabad, India'),
          links: [{ label: l('Dribbble'), url: 'https://dribbble.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'minimal-05',
    name: 'Soft Ledger',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Sage Mist light theme for frontend architects — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #eff7f2 0%, #cee5d7 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#122118',
        accent: '#15803d',
        surface: '#eff7f2',
        text: '#1d3025',
        fontHeading: 'Georgia',
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
          eyebrow: l('Frontend Architect'),
          headline: l('Quiet interfaces, measurable lift.'),
          subheadline: l('Frontend engineer specializing in micro-interactions, performance and semantic HTML.'),
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
          body: l('Frontend engineer specializing in micro-interactions, performance and semantic HTML. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Focus Areas'),
          items: ['Product Design', 'Design Systems', 'Figma', 'Prototyping', 'Accessibility'],
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
              title: l('Design-to-Code Pipeline'),
              description: l('Automated Figma token sync into CSS custom properties across web and mobile.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Tooling', 'DX'],
            },
            {
              title: l('Accessibility Audit & Fix'),
              description: l('Brought core customer journeys to full keyboard and screen-reader compliance.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['WCAG', 'Frontend'],
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
          location: l('Coimbatore, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'minimal-06',
    name: 'Clean Slate',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Midnight Cobalt dark theme for product managers — Outfit headings with centered hero and compact spacing.',
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
          eyebrow: l('Product Manager'),
          headline: l('Software that gets out of the way.'),
          subheadline: l('Zero-to-one product leadership for developer tools and B2B SaaS platforms.'),
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
          items: ['TypeScript', 'Angular', 'CSS Architecture', 'WCAG AA', 'Design Tokens'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Accessibility Audit & Fix'),
              description: l('Brought core customer journeys to full keyboard and screen-reader compliance.'),
              url: '',
              imageUrl: '',
              tags: ['WCAG', 'Frontend'],
            },
            {
              title: l('Tokenized Design System'),
              description: l('Unified 9 product squads on shared spacing, typography and accessible components, cutting UI QA time by 42%.'),
              url: '',
              imageUrl: '',
              tags: ['Design System', 'Tokens'],
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
              role: l('Principal Product Designer'),
              company: l('Northstar Systems'),
              period: l('2023 — Present'),
              description: l('Lead design systems and core workflow architecture for 400k monthly users.'),
            },
            {
              role: l('Senior UX Designer'),
              company: l('Atelier Digital'),
              period: l('2020 — 2023'),
              description: l('Shipped 0-to-1 web and mobile products for fintech and healthcare teams.'),
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
              quote: l('Every screen feels inevitable in hindsight—zero decorative noise.'),
              author: l('Arjun Mehta'),
              role: l('Engineering Lead'),
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
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('Figma'), url: 'https://www.figma.com/@yourname' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'minimal-07',
    name: 'Pure Baseline',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Chalk Vermilion light theme for interaction designers — Fraunces headings with split-media hero and comfortable spacing.',
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
          eyebrow: l('Interaction Designer'),
          headline: l('Your Name'),
          subheadline: l('Prototyping complex interactions in code so teams can validate ideas in days, not months.'),
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
          body: l('Prototyping complex interactions in code so teams can validate ideas in days, not months. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Principal Product Designer'),
              company: l('Northstar Systems'),
              period: l('2023 — Present'),
              description: l('Lead design systems and core workflow architecture for 400k monthly users.'),
            },
            {
              role: l('Senior UX Designer'),
              company: l('Atelier Digital'),
              period: l('2020 — 2023'),
              description: l('Shipped 0-to-1 web and mobile products for fintech and healthcare teams.'),
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
              degree: l('B.Des. Interaction Design'),
              school: l('National Institute of Design'),
              period: l('2016 — 2020'),
              description: l('Focus on typography, human factors and digital systems.'),
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
              title: l('Tokenized Design System'),
              description: l('Unified 9 product squads on shared spacing, typography and accessible components, cutting UI QA time by 42%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Design System', 'Tokens'],
            },
            {
              title: l('Checkout Clarity Overhaul'),
              description: l('Redesigned multi-currency pricing and recovery states, raising conversion by 19% across mobile web.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['E-commerce', 'UX'],
            },
            {
              title: l('Zero-Friction Onboarding'),
              description: l('Replaced a 7-step setup wizard with contextual progressive disclosure; activation rose from 41% to 68%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Activation', 'Product'],
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
          location: l('Remote'),
          links: [{ label: l('Dribbble'), url: 'https://dribbble.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'minimal-08',
    name: 'Mist Column',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Blush Stone light theme for content designers — System headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #fcf1f3 0%, #f3d0d8 55%, #be123c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261418',
        accent: '#be123c',
        surface: '#fcf1f3',
        text: '#362025',
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
          eyebrow: l('Content Designer'),
          headline: l('Crafted with restraint.'),
          subheadline: l('Structuring product copy, onboarding flows and terminology for global audiences.'),
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
          items: ['Product Strategy', 'Roadmapping', 'Discovery', 'Analytics', 'Stakeholder Alignment'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Principal Product Designer'),
              company: l('Northstar Systems'),
              period: l('2023 — Present'),
              description: l('Lead design systems and core workflow architecture for 400k monthly users.'),
            },
            {
              role: l('Senior UX Designer'),
              company: l('Atelier Digital'),
              period: l('2020 — 2023'),
              description: l('Shipped 0-to-1 web and mobile products for fintech and healthcare teams.'),
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
              title: l('Checkout Clarity Overhaul'),
              description: l('Redesigned multi-currency pricing and recovery states, raising conversion by 19% across mobile web.'),
              url: '',
              imageUrl: '',
              tags: ['E-commerce', 'UX'],
            },
            {
              title: l('Zero-Friction Onboarding'),
              description: l('Replaced a 7-step setup wizard with contextual progressive disclosure; activation rose from 41% to 68%.'),
              url: '',
              imageUrl: '',
              tags: ['Activation', 'Product'],
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
    id: 'minimal-09',
    name: 'Thin Rule',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Abyssal Violet dark theme for principal consultants — Georgia headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f5f3ff',
        accent: '#a78bfa',
        surface: '#0b0917',
        text: '#e0daf8',
        fontHeading: 'Georgia',
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
          eyebrow: l('Principal Consultant'),
          headline: l('Your Name'),
          subheadline: l('Advising leadership teams on product strategy, design maturity and delivery cadence.'),
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
              title: l('Zero-Friction Onboarding'),
              description: l('Replaced a 7-step setup wizard with contextual progressive disclosure; activation rose from 41% to 68%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Activation', 'Product'],
            },
            {
              title: l('Workspace Permissions UI'),
              description: l('Condensed 11 legacy admin screens into a single role-matrix editor with live preview.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Enterprise', 'IA'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Advising leadership teams on product strategy, design maturity and delivery cadence. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Principal Product Designer'),
              company: l('Northstar Systems'),
              period: l('2023 — Present'),
              description: l('Lead design systems and core workflow architecture for 400k monthly users.'),
            },
            {
              role: l('Senior UX Designer'),
              company: l('Atelier Digital'),
              period: l('2020 — 2023'),
              description: l('Shipped 0-to-1 web and mobile products for fintech and healthcare teams.'),
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
    id: 'minimal-10',
    name: 'Open Margin',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Ice Indigo light theme for ux researchers — Outfit headings with split-media hero and compact spacing.',
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
        variant: 'split-media',
        props: {
          eyebrow: l('UX Researcher'),
          headline: l('Research before pixels.'),
          subheadline: l('Mixed-methods user research that directly informs roadmap and architecture decisions.'),
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
          body: l('Mixed-methods user research that directly informs roadmap and architecture decisions. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Workspace Permissions UI'),
              description: l('Condensed 11 legacy admin screens into a single role-matrix editor with live preview.'),
              url: '',
              imageUrl: '',
              tags: ['Enterprise', 'IA'],
            },
            {
              title: l('Design-to-Code Pipeline'),
              description: l('Automated Figma token sync into CSS custom properties across web and mobile.'),
              url: '',
              imageUrl: '',
              tags: ['Tooling', 'DX'],
            },
            {
              title: l('Accessibility Audit & Fix'),
              description: l('Brought core customer journeys to full keyboard and screen-reader compliance.'),
              url: '',
              imageUrl: '',
              tags: ['WCAG', 'Frontend'],
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
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('Dribbble'), url: 'https://dribbble.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'minimal-11',
    name: 'Zero Clutter',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Glacier Blue light theme for type directors — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #eff7fd 0%, #cce2ef 55%, #0369a1 140%)',
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
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Type Director'),
          headline: l('Your Name'),
          subheadline: l('I design calm, useful interfaces for teams that care about craft and long-term maintainability.'),
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
          body: l('I design calm, useful interfaces for teams that care about craft and long-term maintainability. Based in Remote, working with teams worldwide.'),
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
              quote: l('Brings rare calm to messy product debates and ships designs engineers love building.'),
              author: l('Priya Nair'),
              role: l('VP of Product, Northstar'),
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
    id: 'minimal-12',
    name: 'Bare Type',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Charcoal Amber dark theme for service designers — System headings with centered hero and compact spacing.',
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
        variant: 'centered',
        props: {
          eyebrow: l('Service Designer'),
          headline: l('Structure creates freedom.'),
          subheadline: l('Building multi-brand design systems, accessible primitives and crisp web applications.'),
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
          body: l('Building multi-brand design systems, accessible primitives and crisp web applications. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Product Strategy', 'Roadmapping', 'Discovery', 'Analytics', 'Stakeholder Alignment'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Accessibility Audit & Fix'),
              description: l('Brought core customer journeys to full keyboard and screen-reader compliance.'),
              url: '',
              imageUrl: '',
              tags: ['WCAG', 'Frontend'],
            },
            {
              title: l('Tokenized Design System'),
              description: l('Unified 9 product squads on shared spacing, typography and accessible components, cutting UI QA time by 42%.'),
              url: '',
              imageUrl: '',
              tags: ['Design System', 'Tokens'],
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
          location: l('Hyderabad, India'),
          links: [{ label: l('Figma'), url: 'https://www.figma.com/@yourname' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'minimal-13',
    name: 'Light Frame',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Linen Terracotta light theme for accessibility leads — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fdf8f3 0%, #f4dfd5 55%, #c2512b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261710',
        accent: '#c2512b',
        surface: '#fdf8f3',
        text: '#332219',
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
          eyebrow: l('Accessibility Lead'),
          headline: l('Your Name'),
          subheadline: l('Turning ambiguous enterprise workflows into intuitive, low-friction tools.'),
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
          body: l('Turning ambiguous enterprise workflows into intuitive, low-friction tools. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Tokenized Design System'),
              description: l('Unified 9 product squads on shared spacing, typography and accessible components, cutting UI QA time by 42%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Design System', 'Tokens'],
            },
            {
              title: l('Checkout Clarity Overhaul'),
              description: l('Redesigned multi-currency pricing and recovery states, raising conversion by 19% across mobile web.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['E-commerce', 'UX'],
            },
            {
              title: l('Zero-Friction Onboarding'),
              description: l('Replaced a 7-step setup wizard with contextual progressive disclosure; activation rose from 41% to 68%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Activation', 'Product'],
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
              quote: l('Brings rare calm to messy product debates and ships designs engineers love building.'),
              author: l('Priya Nair'),
              role: l('VP of Product, Northstar'),
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
    id: 'minimal-14',
    name: 'Calm Folio',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Apricot Cream light theme for mobile product designers — Outfit headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fff4ec 0%, #f6d9ca 55%, #c2410c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#26160e',
        accent: '#c2410c',
        surface: '#fff4ec',
        text: '#362218',
        fontHeading: 'Outfit',
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
          eyebrow: l('Mobile Product Designer'),
          headline: l('Accessible by default.'),
          subheadline: l('Helping early-stage teams establish clear visual language and product positioning.'),
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
              title: l('Checkout Clarity Overhaul'),
              description: l('Redesigned multi-currency pricing and recovery states, raising conversion by 19% across mobile web.'),
              url: '',
              imageUrl: '',
              tags: ['E-commerce', 'UX'],
            },
            {
              title: l('Zero-Friction Onboarding'),
              description: l('Replaced a 7-step setup wizard with contextual progressive disclosure; activation rose from 41% to 68%.'),
              url: '',
              imageUrl: '',
              tags: ['Activation', 'Product'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['TypeScript', 'Angular', 'CSS Architecture', 'WCAG AA', 'Design Tokens'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Every screen feels inevitable in hindsight—zero decorative noise.'),
              author: l('Arjun Mehta'),
              role: l('Engineering Lead'),
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
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'minimal-15',
    name: 'Silent Measure',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Velvet Rose dark theme for information architects — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Information Architect'),
          headline: l('Your Name'),
          subheadline: l('Frontend engineer specializing in micro-interactions, performance and semantic HTML.'),
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
          body: l('Frontend engineer specializing in micro-interactions, performance and semantic HTML. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Focus Areas'),
          items: ['User Research', 'Information Architecture', 'Wireframing', 'Usability Testing'],
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
              title: l('Zero-Friction Onboarding'),
              description: l('Replaced a 7-step setup wizard with contextual progressive disclosure; activation rose from 41% to 68%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Activation', 'Product'],
            },
            {
              title: l('Workspace Permissions UI'),
              description: l('Condensed 11 legacy admin screens into a single role-matrix editor with live preview.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Enterprise', 'IA'],
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
          location: l('Remote'),
          links: [{ label: l('Figma'), url: 'https://www.figma.com/@yourname' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'minimal-16',
    name: 'Whisper Mono',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Nordic Spruce light theme for design ops managers — System headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f4fafa 0%, #d2e7e7 55%, #0e7c7b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0c1c1c',
        accent: '#0e7c7b',
        surface: '#f4fafa',
        text: '#172b2b',
        fontHeading: 'System',
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
          eyebrow: l('Design Ops Manager'),
          headline: l('Simple is hard; we make it look easy.'),
          subheadline: l('Zero-to-one product leadership for developer tools and B2B SaaS platforms.'),
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
          items: ['Product Strategy', 'Roadmapping', 'Discovery', 'Analytics', 'Stakeholder Alignment'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Workspace Permissions UI'),
              description: l('Condensed 11 legacy admin screens into a single role-matrix editor with live preview.'),
              url: '',
              imageUrl: '',
              tags: ['Enterprise', 'IA'],
            },
            {
              title: l('Design-to-Code Pipeline'),
              description: l('Automated Figma token sync into CSS custom properties across web and mobile.'),
              url: '',
              imageUrl: '',
              tags: ['Tooling', 'DX'],
            },
            {
              title: l('Accessibility Audit & Fix'),
              description: l('Brought core customer journeys to full keyboard and screen-reader compliance.'),
              url: '',
              imageUrl: '',
              tags: ['WCAG', 'Frontend'],
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
              role: l('Principal Product Designer'),
              company: l('Northstar Systems'),
              period: l('2023 — Present'),
              description: l('Lead design systems and core workflow architecture for 400k monthly users.'),
            },
            {
              role: l('Senior UX Designer'),
              company: l('Atelier Digital'),
              period: l('2020 — 2023'),
              description: l('Shipped 0-to-1 web and mobile products for fintech and healthcare teams.'),
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
              quote: l('Every screen feels inevitable in hindsight—zero decorative noise.'),
              author: l('Arjun Mehta'),
              role: l('Engineering Lead'),
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
          location: l('Hyderabad, India'),
          links: [{ label: l('Dribbble'), url: 'https://dribbble.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'minimal-17',
    name: 'Blank Sheet',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Mint Frost light theme for growth product designers — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #eefaf7 0%, #cde6e2 55%, #0f766e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e221e',
        accent: '#0f766e',
        surface: '#eefaf7',
        text: '#1a322d',
        fontHeading: 'Georgia',
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
          eyebrow: l('Growth Product Designer'),
          headline: l('Your Name'),
          subheadline: l('Prototyping complex interactions in code so teams can validate ideas in days, not months.'),
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
          body: l('Prototyping complex interactions in code so teams can validate ideas in days, not months. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Principal Product Designer'),
              company: l('Northstar Systems'),
              period: l('2023 — Present'),
              description: l('Lead design systems and core workflow architecture for 400k monthly users.'),
            },
            {
              role: l('Senior UX Designer'),
              company: l('Atelier Digital'),
              period: l('2020 — 2023'),
              description: l('Shipped 0-to-1 web and mobile products for fintech and healthcare teams.'),
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
              degree: l('B.Des. Interaction Design'),
              school: l('National Institute of Design'),
              period: l('2016 — 2020'),
              description: l('Focus on typography, human factors and digital systems.'),
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
              title: l('Design-to-Code Pipeline'),
              description: l('Automated Figma token sync into CSS custom properties across web and mobile.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Tooling', 'DX'],
            },
            {
              title: l('Accessibility Audit & Fix'),
              description: l('Brought core customer journeys to full keyboard and screen-reader compliance.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['WCAG', 'Frontend'],
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
          location: l('Coimbatore, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'minimal-18',
    name: 'Graphite Ink',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Deep Teal dark theme for web engineers — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f0fdfa',
        accent: '#2dd4bf',
        surface: '#071112',
        text: '#cce8e4',
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
          eyebrow: l('Web Engineer'),
          headline: l('Function, then form.'),
          subheadline: l('Structuring product copy, onboarding flows and terminology for global audiences.'),
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
          items: ['TypeScript', 'Angular', 'CSS Architecture', 'WCAG AA', 'Design Tokens'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Principal Product Designer'),
              company: l('Northstar Systems'),
              period: l('2023 — Present'),
              description: l('Lead design systems and core workflow architecture for 400k monthly users.'),
            },
            {
              role: l('Senior UX Designer'),
              company: l('Atelier Digital'),
              period: l('2020 — 2023'),
              description: l('Shipped 0-to-1 web and mobile products for fintech and healthcare teams.'),
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
              title: l('Accessibility Audit & Fix'),
              description: l('Brought core customer journeys to full keyboard and screen-reader compliance.'),
              url: '',
              imageUrl: '',
              tags: ['WCAG', 'Frontend'],
            },
            {
              title: l('Tokenized Design System'),
              description: l('Unified 9 product squads on shared spacing, typography and accessible components, cutting UI QA time by 42%.'),
              url: '',
              imageUrl: '',
              tags: ['Design System', 'Tokens'],
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
    id: 'minimal-19',
    name: 'Moon Alabaster',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Cloud Plum light theme for creative technologists — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fbf8fe 0%, #e8d8f7 55%, #7e22ce 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1e1024',
        accent: '#7e22ce',
        surface: '#fbf8fe',
        text: '#2b1b33',
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
          eyebrow: l('Creative Technologist'),
          headline: l('Your Name'),
          subheadline: l('Advising leadership teams on product strategy, design maturity and delivery cadence.'),
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
              title: l('Tokenized Design System'),
              description: l('Unified 9 product squads on shared spacing, typography and accessible components, cutting UI QA time by 42%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Design System', 'Tokens'],
            },
            {
              title: l('Checkout Clarity Overhaul'),
              description: l('Redesigned multi-currency pricing and recovery states, raising conversion by 19% across mobile web.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['E-commerce', 'UX'],
            },
            {
              title: l('Zero-Friction Onboarding'),
              description: l('Replaced a 7-step setup wizard with contextual progressive disclosure; activation rose from 41% to 68%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Activation', 'Product'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Advising leadership teams on product strategy, design maturity and delivery cadence. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Principal Product Designer'),
              company: l('Northstar Systems'),
              period: l('2023 — Present'),
              description: l('Lead design systems and core workflow architecture for 400k monthly users.'),
            },
            {
              role: l('Senior UX Designer'),
              company: l('Atelier Digital'),
              period: l('2020 — 2023'),
              description: l('Shipped 0-to-1 web and mobile products for fintech and healthcare teams.'),
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
    id: 'minimal-20',
    name: 'Void Chalk',
    category: 'minimal',
    family: 'Minimal Clean',
    audience: ['developer', 'designer', 'product manager'],
    description: 'Periwinkle Air light theme for independent designers — System headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f1f3fd 0%, #d7d7f5 55%, #4338ca 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#14182e',
        accent: '#4338ca',
        surface: '#f1f3fd',
        text: '#212642',
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
          eyebrow: l('Independent Designer'),
          headline: l('Intentional digital craft.'),
          subheadline: l('Mixed-methods user research that directly informs roadmap and architecture decisions.'),
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
          body: l('Mixed-methods user research that directly informs roadmap and architecture decisions. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Checkout Clarity Overhaul'),
              description: l('Redesigned multi-currency pricing and recovery states, raising conversion by 19% across mobile web.'),
              url: '',
              imageUrl: '',
              tags: ['E-commerce', 'UX'],
            },
            {
              title: l('Zero-Friction Onboarding'),
              description: l('Replaced a 7-step setup wizard with contextual progressive disclosure; activation rose from 41% to 68%.'),
              url: '',
              imageUrl: '',
              tags: ['Activation', 'Product'],
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
          location: l('Hyderabad, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
];
