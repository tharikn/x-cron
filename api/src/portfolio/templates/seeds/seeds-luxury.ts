// Auto-generated template seeds — Luxury Premium (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_LUXURY: SeedTemplate[] = [
  {
    id: 'luxury-01',
    name: 'Maison Royale',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Obsidian Emerald dark theme for private wealth advisors — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Private Wealth Advisor'),
          headline: l('Your Name'),
          subheadline: l('Private advisory across wealth preservation, architectural real estate and bespoke cultural experiences.'),
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
              title: l('Heritage Palace Restoration'),
              description: l('Positioned and launched a 22-suite royal heritage estate in Udaipur to global acclaim.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Hospitality', 'Strategy'],
            },
            {
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Private Client Advisory', 'Portfolio Stewardship', 'Provenance & Valuation', 'Discretion'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Impeccable judgment, quiet discretion and access that simply cannot be replicated.'),
              author: l('Vikramaditya Singh'),
              role: l('Family Office Principal'),
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
          location: l('Kochi, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'luxury-02',
    name: 'Gold Reserve',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Vellum Rust light theme for luxury brand strategists — Georgia headings with split-media hero and comfortable spacing.',
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
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Luxury Brand Strategist'),
          headline: l('Discreet stewardship for discerning clients.'),
          subheadline: l('Serving principals, family offices and heritage hospitality brands across Mumbai, London and Dubai.'),
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
          body: l('Serving principals, family offices and heritage hospitality brands across Mumbai, London and Dubai. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Core Stack'),
          items: ['Luxury Brand Positioning', 'Hospitality Launch', 'Bespoke Curation', 'Cross-Border Estates'],
        },
      },
      {
        type: 'gallery',
        variant: 'masonry',
        props: {
          title: l('Visual Archive'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
              alt: l('Tailored silhouettes on rack'),
              caption: l('Atelier capsule'),
            },
            {
              url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
              alt: l('Minimalist textile drape study'),
              caption: l('Autumn edit'),
            },
            {
              url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop&q=80',
              alt: l('Outdoor editorial styling'),
              caption: l('Resort series'),
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
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: '',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: '',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
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
          location: l('Indore, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'luxury-03',
    name: 'Sovereign',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Alabaster Cobalt light theme for bespoke concierge directors — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fafbfe 0%, #dae2fd 55%, #2457f5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1320',
        accent: '#2457f5',
        surface: '#fafbfe',
        text: '#1c2436',
        fontHeading: 'Fraunces',
        fontBody: 'Georgia',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Bespoke Concierge Director'),
          headline: l('Quiet excellence in every detail.'),
          subheadline: l('Uncompromising attention to discretion, provenance and timeless craft.'),
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
          title: l('Specialties'),
          items: ['VIP Partnerships', 'Private Events', 'Collection Management', 'Negotiation'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
            },
            {
              title: l('Heritage Palace Restoration'),
              description: l('Positioned and launched a 22-suite royal heritage estate in Udaipur to global acclaim.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Hospitality', 'Strategy'],
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
              role: l('Managing Principal'),
              company: l('Aurelia Private Advisory'),
              period: l('2020 — Present'),
              description: l('Retained advisor to ultra-high-net-worth families and heritage maisons.'),
            },
            {
              role: l('Director of Private Clients'),
              company: l('Sotheby’s / Meridian'),
              period: l('2016 — 2020'),
              description: l('Led client strategy and private sales.'),
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
              quote: l('Impeccable judgment, quiet discretion and access that simply cannot be replicated.'),
              author: l('Vikramaditya Singh'),
              role: l('Family Office Principal'),
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
          location: l('Remote · India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'luxury-04',
    name: 'Private Folio',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Midnight Cobalt dark theme for prime real estate advisors — Fraunces headings with centered hero and comfortable spacing.',
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
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Prime Real Estate Advisor'),
          headline: l('Your Name'),
          subheadline: l('Private advisory across wealth preservation, architectural real estate and bespoke cultural experiences.'),
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
          body: l('Private advisory across wealth preservation, architectural real estate and bespoke cultural experiences. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Managing Principal'),
              company: l('Aurelia Private Advisory'),
              period: l('2020 — Present'),
              description: l('Retained advisor to ultra-high-net-worth families and heritage maisons.'),
            },
            {
              role: l('Director of Private Clients'),
              company: l('Sotheby’s / Meridian'),
              period: l('2016 — 2020'),
              description: l('Led client strategy and private sales.'),
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
              degree: l('M.Sc. Luxury & Brand Management'),
              school: l('ESSEC / IIM Exchange'),
              period: l('2014 — 2016'),
              description: l('Heritage brands and private client strategy.'),
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
              title: l('Heritage Palace Restoration'),
              description: l('Positioned and launched a 22-suite royal heritage estate in Udaipur to global acclaim.'),
              url: '',
              imageUrl: '',
              tags: ['Hospitality', 'Strategy'],
            },
            {
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: '',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: '',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
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
          location: l('Delhi, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'luxury-05',
    name: 'Champagne Noir',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Newsprint Navy light theme for fine art & collection advisors — Georgia headings with split-media hero and comfortable spacing.',
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
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Fine Art & Collection Advisor'),
          headline: l('Curating rare experiences and enduring value.'),
          subheadline: l('Serving principals, family offices and heritage hospitality brands across Mumbai, London and Dubai.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Luxury Brand Positioning', 'Hospitality Launch', 'Bespoke Curation', 'Cross-Border Estates'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Managing Principal'),
              company: l('Aurelia Private Advisory'),
              period: l('2020 — Present'),
              description: l('Retained advisor to ultra-high-net-worth families and heritage maisons.'),
            },
            {
              role: l('Director of Private Clients'),
              company: l('Sotheby’s / Meridian'),
              period: l('2016 — 2020'),
              description: l('Led client strategy and private sales.'),
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
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
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
    id: 'luxury-06',
    name: 'Heritage Estate',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Porcelain Emerald light theme for private chef & culinary directors — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d1f18',
        accent: '#0a8754',
        surface: '#f9fcfa',
        text: '#192a22',
        fontHeading: 'Fraunces',
        fontBody: 'Georgia',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Private Chef & Culinary Director'),
          headline: l('Bespoke advisory built on long-term trust.'),
          subheadline: l('Uncompromising attention to discretion, provenance and timeless craft.'),
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
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: '',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
            },
            {
              title: l('Heritage Palace Restoration'),
              description: l('Positioned and launched a 22-suite royal heritage estate in Udaipur to global acclaim.'),
              url: '',
              imageUrl: '',
              tags: ['Hospitality', 'Strategy'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('About'),
          body: l('Uncompromising attention to discretion, provenance and timeless craft. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Managing Principal'),
              company: l('Aurelia Private Advisory'),
              period: l('2020 — Present'),
              description: l('Retained advisor to ultra-high-net-worth families and heritage maisons.'),
            },
            {
              role: l('Director of Private Clients'),
              company: l('Sotheby’s / Meridian'),
              period: l('2016 — 2020'),
              description: l('Led client strategy and private sales.'),
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
    id: 'luxury-07',
    name: 'Atelier Prestige',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Abyssal Violet dark theme for hospitality brand consultants — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f5f3ff',
        accent: '#a78bfa',
        surface: '#0b0917',
        text: '#e0daf8',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Hospitality Brand Consultant'),
          headline: l('Your Name'),
          subheadline: l('Private advisory across wealth preservation, architectural real estate and bespoke cultural experiences.'),
          primaryCtaLabel: l('Read more'),
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
              url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
              alt: l('Minimalist textile drape study'),
              caption: l('Autumn edit'),
            },
            {
              url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop&q=80',
              alt: l('Outdoor editorial styling'),
              caption: l('Resort series'),
            },
            {
              url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial runway lookbook frame'),
              caption: l('Lookbook 01'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Profile'),
          body: l('Private advisory across wealth preservation, architectural real estate and bespoke cultural experiences. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Heritage Palace Restoration'),
              description: l('Positioned and launched a 22-suite royal heritage estate in Udaipur to global acclaim.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Hospitality', 'Strategy'],
            },
            {
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
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
          location: l('Remote · India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'luxury-08',
    name: 'Bespoke Crown',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Parchment Olive light theme for high jewelry designers — Georgia headings with split-media hero and comfortable spacing.',
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
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('High Jewelry Designer'),
          headline: l('Discreet stewardship for discerning clients.'),
          subheadline: l('Serving principals, family offices and heritage hospitality brands across Mumbai, London and Dubai.'),
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
          body: l('Serving principals, family offices and heritage hospitality brands across Mumbai, London and Dubai. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'masonry',
        props: {
          title: l('Studio Highlights'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop&q=80',
              alt: l('Outdoor editorial styling'),
              caption: l('Resort series'),
            },
            {
              url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial runway lookbook frame'),
              caption: l('Lookbook 01'),
            },
            {
              url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
              alt: l('Tailored silhouettes on rack'),
              caption: l('Atelier capsule'),
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
              quote: l('Impeccable judgment, quiet discretion and access that simply cannot be replicated.'),
              author: l('Vikramaditya Singh'),
              role: l('Family Office Principal'),
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
    id: 'luxury-09',
    name: 'Grand Salon',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Chalk Vermilion light theme for rare timepiece specialists — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fcfbfa 0%, #f7ded9 55%, #d9381e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#191414',
        accent: '#d9381e',
        surface: '#fcfbfa',
        text: '#241e1d',
        fontHeading: 'Fraunces',
        fontBody: 'Georgia',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Rare Timepiece Specialist'),
          headline: l('Quiet excellence in every detail.'),
          subheadline: l('Uncompromising attention to discretion, provenance and timeless craft.'),
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
          title: l('Overview'),
          body: l('Uncompromising attention to discretion, provenance and timeless craft. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['VIP Partnerships', 'Private Events', 'Collection Management', 'Negotiation'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
            },
            {
              title: l('Heritage Palace Restoration'),
              description: l('Positioned and launched a 22-suite royal heritage estate in Udaipur to global acclaim.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Hospitality', 'Strategy'],
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
          location: l('Kochi, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'luxury-10',
    name: 'Ivory Crest',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Charcoal Amber dark theme for family office principals — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fffbeb',
        accent: '#fbbf24',
        surface: '#100e0a',
        text: '#ede5ce',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Family Office Principal'),
          headline: l('Your Name'),
          subheadline: l('Private advisory across wealth preservation, architectural real estate and bespoke cultural experiences.'),
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
          body: l('Private advisory across wealth preservation, architectural real estate and bespoke cultural experiences. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Heritage Palace Restoration'),
              description: l('Positioned and launched a 22-suite royal heritage estate in Udaipur to global acclaim.'),
              url: '',
              imageUrl: '',
              tags: ['Hospitality', 'Strategy'],
            },
            {
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: '',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: '',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
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
              quote: l('Impeccable judgment, quiet discretion and access that simply cannot be replicated.'),
              author: l('Vikramaditya Singh'),
              role: l('Family Office Principal'),
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
    id: 'luxury-11',
    name: 'Monarch',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Cream Burgundy light theme for luxury travel curators — Georgia headings with split-media hero and comfortable spacing.',
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
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Luxury Travel Curator'),
          headline: l('Curating rare experiences and enduring value.'),
          subheadline: l('Serving principals, family offices and heritage hospitality brands across Mumbai, London and Dubai.'),
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
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Luxury Brand Positioning', 'Hospitality Launch', 'Bespoke Curation', 'Cross-Border Estates'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Impeccable judgment, quiet discretion and access that simply cannot be replicated.'),
              author: l('Vikramaditya Singh'),
              role: l('Family Office Principal'),
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
          location: l('Remote · India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'luxury-12',
    name: 'Noble Suite',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Ice Indigo light theme for private aviation advisors — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f5f7ff 0%, #dcdcfb 55%, #4f46e5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#11132b',
        accent: '#4f46e5',
        surface: '#f5f7ff',
        text: '#1e2240',
        fontHeading: 'Fraunces',
        fontBody: 'Georgia',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Private Aviation Advisor'),
          headline: l('Bespoke advisory built on long-term trust.'),
          subheadline: l('Uncompromising attention to discretion, provenance and timeless craft.'),
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
          body: l('Uncompromising attention to discretion, provenance and timeless craft. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Core Stack'),
          items: ['VIP Partnerships', 'Private Events', 'Collection Management', 'Negotiation'],
        },
      },
      {
        type: 'gallery',
        variant: 'masonry',
        props: {
          title: l('Studio Highlights'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop&q=80',
              alt: l('Outdoor editorial styling'),
              caption: l('Resort series'),
            },
            {
              url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial runway lookbook frame'),
              caption: l('Lookbook 01'),
            },
            {
              url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
              alt: l('Tailored silhouettes on rack'),
              caption: l('Atelier capsule'),
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
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: '',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
            },
            {
              title: l('Heritage Palace Restoration'),
              description: l('Positioned and launched a 22-suite royal heritage estate in Udaipur to global acclaim.'),
              url: '',
              imageUrl: '',
              tags: ['Hospitality', 'Strategy'],
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
          location: l('Delhi, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'luxury-13',
    name: 'Onyx Reserve',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Velvet Rose dark theme for bespoke interior stylists — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Bespoke Interior Stylist'),
          headline: l('Your Name'),
          subheadline: l('Private advisory across wealth preservation, architectural real estate and bespoke cultural experiences.'),
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
          title: l('Specialties'),
          items: ['Private Client Advisory', 'Portfolio Stewardship', 'Provenance & Valuation', 'Discretion'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Heritage Palace Restoration'),
              description: l('Positioned and launched a 22-suite royal heritage estate in Udaipur to global acclaim.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Hospitality', 'Strategy'],
            },
            {
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
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
              role: l('Managing Principal'),
              company: l('Aurelia Private Advisory'),
              period: l('2020 — Present'),
              description: l('Retained advisor to ultra-high-net-worth families and heritage maisons.'),
            },
            {
              role: l('Director of Private Clients'),
              company: l('Sotheby’s / Meridian'),
              period: l('2016 — 2020'),
              description: l('Led client strategy and private sales.'),
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
              quote: l('Impeccable judgment, quiet discretion and access that simply cannot be replicated.'),
              author: l('Vikramaditya Singh'),
              role: l('Family Office Principal'),
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
          location: l('Kochi, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'luxury-14',
    name: 'Velvet Manor',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Oatmeal Forest light theme for wine & cellar directors — Georgia headings with split-media hero and comfortable spacing.',
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
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Wine & Cellar Director'),
          headline: l('Discreet stewardship for discerning clients.'),
          subheadline: l('Serving principals, family offices and heritage hospitality brands across Mumbai, London and Dubai.'),
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
          body: l('Serving principals, family offices and heritage hospitality brands across Mumbai, London and Dubai. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Managing Principal'),
              company: l('Aurelia Private Advisory'),
              period: l('2020 — Present'),
              description: l('Retained advisor to ultra-high-net-worth families and heritage maisons.'),
            },
            {
              role: l('Director of Private Clients'),
              company: l('Sotheby’s / Meridian'),
              period: l('2016 — 2020'),
              description: l('Led client strategy and private sales.'),
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
              degree: l('M.Sc. Luxury & Brand Management'),
              school: l('ESSEC / IIM Exchange'),
              period: l('2014 — 2016'),
              description: l('Heritage brands and private client strategy.'),
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
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: '',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: '',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
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
          location: l('Indore, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'luxury-15',
    name: 'Solitaire',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Linen Terracotta light theme for auction & provenance specialists — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fdf8f3 0%, #f4dfd5 55%, #c2512b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261710',
        accent: '#c2512b',
        surface: '#fdf8f3',
        text: '#332219',
        fontHeading: 'Fraunces',
        fontBody: 'Georgia',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Auction & Provenance Specialist'),
          headline: l('Quiet excellence in every detail.'),
          subheadline: l('Uncompromising attention to discretion, provenance and timeless craft.'),
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
          title: l('Focus Areas'),
          items: ['VIP Partnerships', 'Private Events', 'Collection Management', 'Negotiation'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Managing Principal'),
              company: l('Aurelia Private Advisory'),
              period: l('2020 — Present'),
              description: l('Retained advisor to ultra-high-net-worth families and heritage maisons.'),
            },
            {
              role: l('Director of Private Clients'),
              company: l('Sotheby’s / Meridian'),
              period: l('2016 — 2020'),
              description: l('Led client strategy and private sales.'),
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
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
            },
            {
              title: l('Heritage Palace Restoration'),
              description: l('Positioned and launched a 22-suite royal heritage estate in Udaipur to global acclaim.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Hospitality', 'Strategy'],
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
    id: 'luxury-16',
    name: 'Regency',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Deep Teal dark theme for vip client experience leads — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f0fdfa',
        accent: '#2dd4bf',
        surface: '#071112',
        text: '#cce8e4',
        fontHeading: 'Fraunces',
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
          eyebrow: l('VIP Client Experience Lead'),
          headline: l('Your Name'),
          subheadline: l('Private advisory across wealth preservation, architectural real estate and bespoke cultural experiences.'),
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
              title: l('Heritage Palace Restoration'),
              description: l('Positioned and launched a 22-suite royal heritage estate in Udaipur to global acclaim.'),
              url: '',
              imageUrl: '',
              tags: ['Hospitality', 'Strategy'],
            },
            {
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: '',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: '',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('About'),
          body: l('Private advisory across wealth preservation, architectural real estate and bespoke cultural experiences. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Managing Principal'),
              company: l('Aurelia Private Advisory'),
              period: l('2020 — Present'),
              description: l('Retained advisor to ultra-high-net-worth families and heritage maisons.'),
            },
            {
              role: l('Director of Private Clients'),
              company: l('Sotheby’s / Meridian'),
              period: l('2016 — 2020'),
              description: l('Led client strategy and private sales.'),
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
    id: 'luxury-17',
    name: 'Signature Gold',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Saffron Ink light theme for heritage hoteliers — Georgia headings with split-media hero and comfortable spacing.',
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
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Heritage Hotelier'),
          headline: l('Curating rare experiences and enduring value.'),
          subheadline: l('Serving principals, family offices and heritage hospitality brands across Mumbai, London and Dubai.'),
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
              url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial runway lookbook frame'),
              caption: l('Lookbook 01'),
            },
            {
              url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
              alt: l('Tailored silhouettes on rack'),
              caption: l('Atelier capsule'),
            },
            {
              url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
              alt: l('Minimalist textile drape study'),
              caption: l('Autumn edit'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Profile'),
          body: l('Serving principals, family offices and heritage hospitality brands across Mumbai, London and Dubai. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
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
          location: l('Kochi, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'luxury-18',
    name: 'Casa Dorada',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Nordic Spruce light theme for yacht & charter advisors — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f4fafa 0%, #d2e7e7 55%, #0e7c7b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0c1c1c',
        accent: '#0e7c7b',
        surface: '#f4fafa',
        text: '#172b2b',
        fontHeading: 'Fraunces',
        fontBody: 'Georgia',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Yacht & Charter Advisor'),
          headline: l('Bespoke advisory built on long-term trust.'),
          subheadline: l('Uncompromising attention to discretion, provenance and timeless craft.'),
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
          body: l('Uncompromising attention to discretion, provenance and timeless craft. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'masonry',
        props: {
          title: l('Visual Archive'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
              alt: l('Tailored silhouettes on rack'),
              caption: l('Atelier capsule'),
            },
            {
              url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
              alt: l('Minimalist textile drape study'),
              caption: l('Autumn edit'),
            },
            {
              url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop&q=80',
              alt: l('Outdoor editorial styling'),
              caption: l('Resort series'),
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
              quote: l('Impeccable judgment, quiet discretion and access that simply cannot be replicated.'),
              author: l('Vikramaditya Singh'),
              role: l('Family Office Principal'),
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
    id: 'luxury-19',
    name: 'Veranda Luxe',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Smoked Tangerine dark theme for sartorial directors — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #120c08 0%, #452913 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff7ed',
        accent: '#fb923c',
        surface: '#120c08',
        text: '#f0dfd1',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Sartorial Director'),
          headline: l('Your Name'),
          subheadline: l('Private advisory across wealth preservation, architectural real estate and bespoke cultural experiences.'),
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
          title: l('Overview'),
          body: l('Private advisory across wealth preservation, architectural real estate and bespoke cultural experiences. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Private Client Advisory', 'Portfolio Stewardship', 'Provenance & Valuation', 'Discretion'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Heritage Palace Restoration'),
              description: l('Positioned and launched a 22-suite royal heritage estate in Udaipur to global acclaim.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Hospitality', 'Strategy'],
            },
            {
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
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
          location: l('Remote · India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'luxury-20',
    name: 'Imperial',
    category: 'luxury',
    family: 'Luxury Premium',
    audience: ['executive', 'consultant', 'advisor'],
    description: 'Sepia Slate light theme for private member club leads — Georgia headings with split-media hero and comfortable spacing.',
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
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Private Member Club Lead'),
          headline: l('Discreet stewardship for discerning clients.'),
          subheadline: l('Serving principals, family offices and heritage hospitality brands across Mumbai, London and Dubai.'),
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
          body: l('Serving principals, family offices and heritage hospitality brands across Mumbai, London and Dubai. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Private Art Collection'),
              description: l('Advised on acquisition, conservation and museum loans for 45 modern Indian masterworks.'),
              url: '',
              imageUrl: '',
              tags: ['Art Advisory', 'Curation'],
            },
            {
              title: l('Cross-Border Family Office'),
              description: l('Structured multi-generational governance and philanthropic endowment across 3 jurisdictions.'),
              url: '',
              imageUrl: '',
              tags: ['Wealth', 'Governance'],
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
              quote: l('Impeccable judgment, quiet discretion and access that simply cannot be replicated.'),
              author: l('Vikramaditya Singh'),
              role: l('Family Office Principal'),
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
