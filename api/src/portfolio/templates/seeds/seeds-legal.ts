// Auto-generated template seeds — Legal Professional (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_LEGAL: SeedTemplate[] = [
  {
    id: 'legal-01',
    name: 'Chambers',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Obsidian Emerald dark theme for corporate & m&a counsels — Fraunces headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Corporate & M&A Counsel'),
          headline: l('Your Name'),
          subheadline: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance.'),
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
          body: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Managing Partner'),
              company: l('Sen & Associates Chambers'),
              period: l('2020 — Present'),
              description: l('Lead corporate advisory, tech regulation and commercial dispute practice.'),
            },
            {
              role: l('Senior Associate'),
              company: l('Cyril Amarchand'),
              period: l('2015 — 2020'),
              description: l('Capital markets, private equity and technology transactions.'),
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
              title: l('Cross-Border Series B Structuring'),
              description: l('Lead counsel on $42M multi-jurisdiction equity round across India, Singapore and Delaware.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Venture', 'Cross-Border'],
            },
            {
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
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
    id: 'legal-02',
    name: 'Counsel Gold',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Vellum Rust light theme for technology & privacy lawyers — Georgia headings with split-media hero and compact spacing.',
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
          eyebrow: l('Technology & Privacy Lawyer'),
          headline: l('Pragmatic counsel for high-stakes decisions.'),
          subheadline: l('Fifteen years before High Courts and international arbitration tribunals with a focus on commercial certainty.'),
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
          items: ['IP Prosecution', 'Regulatory Strategy', 'Board Governance', 'Cross-Border Structuring'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Managing Partner'),
              company: l('Sen & Associates Chambers'),
              period: l('2020 — Present'),
              description: l('Lead corporate advisory, tech regulation and commercial dispute practice.'),
            },
            {
              role: l('Senior Associate'),
              company: l('Cyril Amarchand'),
              period: l('2015 — 2020'),
              description: l('Capital markets, private equity and technology transactions.'),
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
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: '',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: '',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-03',
    name: 'Verdict',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Alabaster Cobalt light theme for ip & patent advocates — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fafbfe 0%, #dae2fd 55%, #2457f5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1320',
        accent: '#2457f5',
        surface: '#fafbfe',
        text: '#1c2436',
        fontHeading: 'Georgia',
        fontBody: 'System',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('IP & Patent Advocate'),
          headline: l('Precision advocacy and commercial clarity.'),
          subheadline: l('Clear, business-aligned advice without unnecessary legal theater.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#cta-6',
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
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
            },
            {
              title: l('Cross-Border Series B Structuring'),
              description: l('Lead counsel on $42M multi-jurisdiction equity round across India, Singapore and Delaware.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Venture', 'Cross-Border'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Clear, business-aligned advice without unnecessary legal theater. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Managing Partner'),
              company: l('Sen & Associates Chambers'),
              period: l('2020 — Present'),
              description: l('Lead corporate advisory, tech regulation and commercial dispute practice.'),
            },
            {
              role: l('Senior Associate'),
              company: l('Cyril Amarchand'),
              period: l('2015 — 2020'),
              description: l('Capital markets, private equity and technology transactions.'),
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-04',
    name: 'Statute',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Midnight Cobalt dark theme for commercial arbitrators — Fraunces headings with centered hero and compact spacing.',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Commercial Arbitrator'),
          headline: l('Your Name'),
          subheadline: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance.'),
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
          title: l('Overview'),
          body: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Cross-Border Series B Structuring'),
              description: l('Lead counsel on $42M multi-jurisdiction equity round across India, Singapore and Delaware.'),
              url: '',
              imageUrl: '',
              tags: ['Venture', 'Cross-Border'],
            },
            {
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: '',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: '',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-05',
    name: 'Precedent',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Newsprint Navy light theme for litigation partners — Georgia headings with split-media hero and comfortable spacing.',
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
          eyebrow: l('Litigation Partner'),
          headline: l('Protecting innovation, resolving disputes.'),
          subheadline: l('Fifteen years before High Courts and international arbitration tribunals with a focus on commercial certainty.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#cta-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Fifteen years before High Courts and international arbitration tribunals with a focus on commercial certainty. Based in Kochi, working with teams worldwide.'),
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
              quote: l('Translates dense regulatory risk into crisp, actionable business choices within hours.'),
              author: l('Ritu Sharma'),
              role: l('General Counsel, FinPay'),
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-06',
    name: 'Advocate',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Porcelain Emerald light theme for startup & venture counsels — Georgia headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d1f18',
        accent: '#0a8754',
        surface: '#f9fcfa',
        text: '#192a22',
        fontHeading: 'Georgia',
        fontBody: 'System',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Startup & Venture Counsel'),
          headline: l('Decisive legal strategy for founders and boards.'),
          subheadline: l('Clear, business-aligned advice without unnecessary legal theater.'),
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
          body: l('Clear, business-aligned advice without unnecessary legal theater. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Trial Advocacy', 'Mediation', 'Shareholder Disputes', 'Licensing'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: '',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
            },
            {
              title: l('Cross-Border Series B Structuring'),
              description: l('Lead counsel on $42M multi-jurisdiction equity round across India, Singapore and Delaware.'),
              url: '',
              imageUrl: '',
              tags: ['Venture', 'Cross-Border'],
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-07',
    name: 'Tribunal',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Abyssal Violet dark theme for cross-border tax advisors — Fraunces headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Cross-Border Tax Advisor'),
          headline: l('Your Name'),
          subheadline: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#cta-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Profile'),
          body: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Cross-Border Series B Structuring'),
              description: l('Lead counsel on $42M multi-jurisdiction equity round across India, Singapore and Delaware.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Venture', 'Cross-Border'],
            },
            {
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
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
              quote: l('Translates dense regulatory risk into crisp, actionable business choices within hours.'),
              author: l('Ritu Sharma'),
              role: l('General Counsel, FinPay'),
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-08',
    name: 'Brief & Seal',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Parchment Olive light theme for employment law specialists — Georgia headings with split-media hero and compact spacing.',
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
          eyebrow: l('Employment Law Specialist'),
          headline: l('Pragmatic counsel for high-stakes decisions.'),
          subheadline: l('Fifteen years before High Courts and international arbitration tribunals with a focus on commercial certainty.'),
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
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: '',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: '',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['IP Prosecution', 'Regulatory Strategy', 'Board Governance', 'Cross-Border Structuring'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Translates dense regulatory risk into crisp, actionable business choices within hours.'),
              author: l('Ritu Sharma'),
              role: l('General Counsel, FinPay'),
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-09',
    name: 'Arbitration',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Chalk Vermilion light theme for constitutional & pil counsels — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fcfbfa 0%, #f7ded9 55%, #d9381e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#191414',
        accent: '#d9381e',
        surface: '#fcfbfa',
        text: '#241e1d',
        fontHeading: 'Georgia',
        fontBody: 'System',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Constitutional & PIL Counsel'),
          headline: l('Precision advocacy and commercial clarity.'),
          subheadline: l('Clear, business-aligned advice without unnecessary legal theater.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#contact-7',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Clear, business-aligned advice without unnecessary legal theater. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Toolkit'),
          items: ['Trial Advocacy', 'Mediation', 'Shareholder Disputes', 'Licensing'],
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
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
            },
            {
              title: l('Cross-Border Series B Structuring'),
              description: l('Lead counsel on $42M multi-jurisdiction equity round across India, Singapore and Delaware.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Venture', 'Cross-Border'],
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-10',
    name: 'Equity Chambers',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Charcoal Amber dark theme for media & entertainment lawyers — Fraunces headings with centered hero and compact spacing.',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Media & Entertainment Lawyer'),
          headline: l('Your Name'),
          subheadline: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance.'),
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
          title: l('Focus Areas'),
          items: ['M&A & Venture Deals', 'Commercial Arbitration', 'Data Privacy & DPDP', 'Contract Drafting'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Cross-Border Series B Structuring'),
              description: l('Lead counsel on $42M multi-jurisdiction equity round across India, Singapore and Delaware.'),
              url: '',
              imageUrl: '',
              tags: ['Venture', 'Cross-Border'],
            },
            {
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: '',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: '',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
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
              role: l('Managing Partner'),
              company: l('Sen & Associates Chambers'),
              period: l('2020 — Present'),
              description: l('Lead corporate advisory, tech regulation and commercial dispute practice.'),
            },
            {
              role: l('Senior Associate'),
              company: l('Cyril Amarchand'),
              period: l('2015 — 2020'),
              description: l('Capital markets, private equity and technology transactions.'),
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
              quote: l('Translates dense regulatory risk into crisp, actionable business choices within hours.'),
              author: l('Ritu Sharma'),
              role: l('General Counsel, FinPay'),
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-11',
    name: 'Charter Law',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Cream Burgundy light theme for real estate & infra counsels — Georgia headings with split-media hero and comfortable spacing.',
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
          eyebrow: l('Real Estate & Infra Counsel'),
          headline: l('Protecting innovation, resolving disputes.'),
          subheadline: l('Fifteen years before High Courts and international arbitration tribunals with a focus on commercial certainty.'),
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
          body: l('Fifteen years before High Courts and international arbitration tribunals with a focus on commercial certainty. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Managing Partner'),
              company: l('Sen & Associates Chambers'),
              period: l('2020 — Present'),
              description: l('Lead corporate advisory, tech regulation and commercial dispute practice.'),
            },
            {
              role: l('Senior Associate'),
              company: l('Cyril Amarchand'),
              period: l('2015 — 2020'),
              description: l('Capital markets, private equity and technology transactions.'),
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
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
    id: 'legal-12',
    name: 'Gavel & Ink',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Ice Indigo light theme for environmental policy lawyers — Georgia headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f5f7ff 0%, #dcdcfb 55%, #4f46e5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#11132b',
        accent: '#4f46e5',
        surface: '#f5f7ff',
        text: '#1e2240',
        fontHeading: 'Georgia',
        fontBody: 'System',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Environmental Policy Lawyer'),
          headline: l('Decisive legal strategy for founders and boards.'),
          subheadline: l('Clear, business-aligned advice without unnecessary legal theater.'),
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
          items: ['Trial Advocacy', 'Mediation', 'Shareholder Disputes', 'Licensing'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Managing Partner'),
              company: l('Sen & Associates Chambers'),
              period: l('2020 — Present'),
              description: l('Lead corporate advisory, tech regulation and commercial dispute practice.'),
            },
            {
              role: l('Senior Associate'),
              company: l('Cyril Amarchand'),
              period: l('2015 — 2020'),
              description: l('Capital markets, private equity and technology transactions.'),
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
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: '',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
            },
            {
              title: l('Cross-Border Series B Structuring'),
              description: l('Lead counsel on $42M multi-jurisdiction equity round across India, Singapore and Delaware.'),
              url: '',
              imageUrl: '',
              tags: ['Venture', 'Cross-Border'],
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-13',
    name: 'Barrister',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Velvet Rose dark theme for fintech & regulatory counsels — Fraunces headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Fintech & Regulatory Counsel'),
          headline: l('Your Name'),
          subheadline: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#cta-6',
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
              title: l('Cross-Border Series B Structuring'),
              description: l('Lead counsel on $42M multi-jurisdiction equity round across India, Singapore and Delaware.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Venture', 'Cross-Border'],
            },
            {
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Managing Partner'),
              company: l('Sen & Associates Chambers'),
              period: l('2020 — Present'),
              description: l('Lead corporate advisory, tech regulation and commercial dispute practice.'),
            },
            {
              role: l('Senior Associate'),
              company: l('Cyril Amarchand'),
              period: l('2015 — 2020'),
              description: l('Capital markets, private equity and technology transactions.'),
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-14',
    name: 'Due Process',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Oatmeal Forest light theme for dispute resolution partners — Georgia headings with split-media hero and compact spacing.',
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
          eyebrow: l('Dispute Resolution Partner'),
          headline: l('Pragmatic counsel for high-stakes decisions.'),
          subheadline: l('Fifteen years before High Courts and international arbitration tribunals with a focus on commercial certainty.'),
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
          title: l('Overview'),
          body: l('Fifteen years before High Courts and international arbitration tribunals with a focus on commercial certainty. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: '',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: '',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-15',
    name: 'Nexus Legal',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Linen Terracotta light theme for healthcare compliance counsels — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fdf8f3 0%, #f4dfd5 55%, #c2512b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261710',
        accent: '#c2512b',
        surface: '#fdf8f3',
        text: '#332219',
        fontHeading: 'Georgia',
        fontBody: 'System',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Healthcare Compliance Counsel'),
          headline: l('Precision advocacy and commercial clarity.'),
          subheadline: l('Clear, business-aligned advice without unnecessary legal theater.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#cta-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Clear, business-aligned advice without unnecessary legal theater. Based in Remote · India, working with teams worldwide.'),
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
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Translates dense regulatory risk into crisp, actionable business choices within hours.'),
              author: l('Ritu Sharma'),
              role: l('General Counsel, FinPay'),
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-16',
    name: 'High Court',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Deep Teal dark theme for competition & antitrust lawyers — Fraunces headings with centered hero and compact spacing.',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Competition & Antitrust Lawyer'),
          headline: l('Your Name'),
          subheadline: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance.'),
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
          body: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['M&A & Venture Deals', 'Commercial Arbitration', 'Data Privacy & DPDP', 'Contract Drafting'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Cross-Border Series B Structuring'),
              description: l('Lead counsel on $42M multi-jurisdiction equity round across India, Singapore and Delaware.'),
              url: '',
              imageUrl: '',
              tags: ['Venture', 'Cross-Border'],
            },
            {
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: '',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: '',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-17',
    name: 'Regulatory',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Saffron Ink light theme for banking & debt counsels — Georgia headings with split-media hero and comfortable spacing.',
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
          eyebrow: l('Banking & Debt Counsel'),
          headline: l('Protecting innovation, resolving disputes.'),
          subheadline: l('Fifteen years before High Courts and international arbitration tribunals with a focus on commercial certainty.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#cta-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Profile'),
          body: l('Fifteen years before High Courts and international arbitration tribunals with a focus on commercial certainty. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
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
              quote: l('Translates dense regulatory risk into crisp, actionable business choices within hours.'),
              author: l('Ritu Sharma'),
              role: l('General Counsel, FinPay'),
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-18',
    name: 'Lexis Noir',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Nordic Spruce light theme for ai governance advisors — Georgia headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f4fafa 0%, #d2e7e7 55%, #0e7c7b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0c1c1c',
        accent: '#0e7c7b',
        surface: '#f4fafa',
        text: '#172b2b',
        fontHeading: 'Georgia',
        fontBody: 'System',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('AI Governance Advisor'),
          headline: l('Decisive legal strategy for founders and boards.'),
          subheadline: l('Clear, business-aligned advice without unnecessary legal theater.'),
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
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: '',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
            },
            {
              title: l('Cross-Border Series B Structuring'),
              description: l('Lead counsel on $42M multi-jurisdiction equity round across India, Singapore and Delaware.'),
              url: '',
              imageUrl: '',
              tags: ['Venture', 'Cross-Border'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Trial Advocacy', 'Mediation', 'Shareholder Disputes', 'Licensing'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Translates dense regulatory risk into crisp, actionable business choices within hours.'),
              author: l('Ritu Sharma'),
              role: l('General Counsel, FinPay'),
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-19',
    name: 'Pactum',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Smoked Tangerine dark theme for maritime & trade counsels — Fraunces headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Maritime & Trade Counsel'),
          headline: l('Your Name'),
          subheadline: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#contact-7',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Advising technology companies, institutional investors and founders on cross-border transactions, IP and regulatory compliance. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Toolkit'),
          items: ['M&A & Venture Deals', 'Commercial Arbitration', 'Data Privacy & DPDP', 'Contract Drafting'],
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
              title: l('Cross-Border Series B Structuring'),
              description: l('Lead counsel on $42M multi-jurisdiction equity round across India, Singapore and Delaware.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Venture', 'Cross-Border'],
            },
            {
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
    id: 'legal-20',
    name: 'Bench & Bar',
    category: 'legal',
    family: 'Legal Professional',
    audience: ['lawyer', 'consultant', 'advisor'],
    description: 'Sepia Slate light theme for general counsel fractionals — Georgia headings with split-media hero and compact spacing.',
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
          eyebrow: l('General Counsel Fractional'),
          headline: l('Pragmatic counsel for high-stakes decisions.'),
          subheadline: l('Fifteen years before High Courts and international arbitration tribunals with a focus on commercial certainty.'),
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
          title: l('Focus Areas'),
          items: ['IP Prosecution', 'Regulatory Strategy', 'Board Governance', 'Cross-Border Structuring'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('DPDP Privacy Readiness'),
              description: l('Designed practical data governance and consent frameworks for 18 SaaS enterprises.'),
              url: '',
              imageUrl: '',
              tags: ['Privacy', 'Compliance'],
            },
            {
              title: l('Commercial Arbitration Award'),
              description: l('Secured full favorable award in a complex infrastructure joint-venture dispute.'),
              url: '',
              imageUrl: '',
              tags: ['Arbitration', 'Disputes'],
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
              role: l('Managing Partner'),
              company: l('Sen & Associates Chambers'),
              period: l('2020 — Present'),
              description: l('Lead corporate advisory, tech regulation and commercial dispute practice.'),
            },
            {
              role: l('Senior Associate'),
              company: l('Cyril Amarchand'),
              period: l('2015 — 2020'),
              description: l('Capital markets, private equity and technology transactions.'),
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
              quote: l('Translates dense regulatory risk into crisp, actionable business choices within hours.'),
              author: l('Ritu Sharma'),
              role: l('General Counsel, FinPay'),
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
              degree: l('B.A. LL.B. (Hons.)'),
              school: l('NLSIU Bengaluru'),
              period: l('2010 — 2015'),
              description: l('Editorial board, Law Review; National Moot Court finalist.'),
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
];
