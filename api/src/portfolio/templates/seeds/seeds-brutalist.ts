// Auto-generated template seeds — Neo-Brutalist (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_BRUTALIST: SeedTemplate[] = [
  {
    id: 'brutalist-02',
    name: 'Raw Slab',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Signal Yellow light theme for visual provocateurs — Outfit headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f7f3e3 0%, #eddbc2 55%, #b45309 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#b45309',
        surface: '#f7f3e3',
        text: '#141414',
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
          eyebrow: l('Visual Provocateur'),
          headline: l('MAKE IT LOUD.'),
          subheadline: l('High-contrast identities, print posters and interactive web experiments for cultural brands.'),
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
          body: l('High-contrast identities, print posters and interactive web experiments for cultural brands. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Poster Design', 'Kinetic Type', 'Risograph Print', 'Art Direction'],
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Gallery'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80',
              alt: l('Textured abstract brushwork study'),
              caption: l('Canvas series I'),
            },
            {
              url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&auto=format&fit=crop&q=80',
              alt: l('Gallery exhibition installation'),
              caption: l('Exhibition view'),
            },
            {
              url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
              alt: l('Studio pigments and works in progress'),
              caption: l('Atelier notes'),
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
              title: l('Sonic Underground Festival'),
              description: l('Complete visual identity, 40-foot stage banners and variable-type motion posters.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Identity', 'Festival'],
            },
            {
              title: l('100 Posters in 100 Days'),
              description: l('Two-color risograph poster archive printed in editions of 50 and exhibited in Mumbai.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Print', 'Exhibition'],
            },
            {
              title: l('Mono Foundry Specimen'),
              description: l('Interactive brutalist type specimen website with live variable axis controls.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Typography', 'Web'],
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
          location: l('Remote · India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'brutalist-03',
    name: 'Hard Edge',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Matrix Lime dark theme for poster & type designers — Mono headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #050a07 0%, #143922 55%, #4ade80 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ebffef',
        accent: '#4ade80',
        surface: '#050a07',
        text: '#c9f2d2',
        fontHeading: 'Mono',
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
          eyebrow: l('Poster & Type Designer'),
          headline: l('NO DECORATION. ONLY SIGNAL.'),
          subheadline: l('Stripping away polite templates in favor of direct typography, bold color and honest grids.'),
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
          items: ['Creative Coding', 'WebGL', 'Variable Fonts', 'Experimental UI'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('100 Posters in 100 Days'),
              description: l('Two-color risograph poster archive printed in editions of 50 and exhibited in Mumbai.'),
              url: '',
              imageUrl: '',
              tags: ['Print', 'Exhibition'],
            },
            {
              title: l('Mono Foundry Specimen'),
              description: l('Interactive brutalist type specimen website with live variable axis controls.'),
              url: '',
              imageUrl: '',
              tags: ['Typography', 'Web'],
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
              role: l('Founder & Art Director'),
              company: l('Studio Slab'),
              period: l('2021 — Present'),
              description: l('Directing bold visual identities for record labels, galleries and indie tech.'),
            },
            {
              role: l('Senior Graphic Designer'),
              company: l('Format Collective'),
              period: l('2018 — 2021'),
              description: l('Led print and campaign systems across 30+ cultural commissions.'),
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
              quote: l('Gave our festival an unmistakable visual voice you could spot from three blocks away.'),
              author: l('Kabir Sen'),
              role: l('Program Director'),
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
          location: l('Delhi, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'brutalist-04',
    name: 'Loud Signal',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Alabaster Cobalt light theme for experimental web artists — System headings with split-media hero and compact spacing.',
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
        fontBody: 'System',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Experimental Web Artist'),
          headline: l('AGAINST BEIGE.'),
          subheadline: l('Independent art direction for music festivals, art books and fearless startups.'),
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
          body: l('Independent art direction for music festivals, art books and fearless startups. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Founder & Art Director'),
              company: l('Studio Slab'),
              period: l('2021 — Present'),
              description: l('Directing bold visual identities for record labels, galleries and indie tech.'),
            },
            {
              role: l('Senior Graphic Designer'),
              company: l('Format Collective'),
              period: l('2018 — 2021'),
              description: l('Led print and campaign systems across 30+ cultural commissions.'),
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
              degree: l('B.F.A. Visual Communication'),
              school: l('Sir J.J. Institute of Applied Art'),
              period: l('2014 — 2018'),
              description: l('Typography, printmaking and experimental media.'),
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
              title: l('Mono Foundry Specimen'),
              description: l('Interactive brutalist type specimen website with live variable axis controls.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Typography', 'Web'],
            },
            {
              title: l('Counterculture Press'),
              description: l('Art-directed a 220-page hardcover anthology on South Asian graphic ephemera.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Book', 'Editorial'],
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
          location: l('Kochi, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'brutalist-05',
    name: 'Anti-Beige',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Poster Crimson light theme for risograph publishers — Outfit headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #ffffff 0%, #fadede 55%, #dc2626 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#dc2626',
        surface: '#ffffff',
        text: '#141414',
        fontHeading: 'Outfit',
        fontBody: 'Outfit',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Risograph Publisher'),
          headline: l('RAW OUTPUT. CLEAR INTENT.'),
          subheadline: l('High-contrast identities, print posters and interactive web experiments for cultural brands.'),
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
          items: ['Poster Design', 'Kinetic Type', 'Risograph Print', 'Art Direction'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Founder & Art Director'),
              company: l('Studio Slab'),
              period: l('2021 — Present'),
              description: l('Directing bold visual identities for record labels, galleries and indie tech.'),
            },
            {
              role: l('Senior Graphic Designer'),
              company: l('Format Collective'),
              period: l('2018 — 2021'),
              description: l('Led print and campaign systems across 30+ cultural commissions.'),
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
              title: l('Counterculture Press'),
              description: l('Art-directed a 220-page hardcover anthology on South Asian graphic ephemera.'),
              url: '',
              imageUrl: '',
              tags: ['Book', 'Editorial'],
            },
            {
              title: l('Sonic Underground Festival'),
              description: l('Complete visual identity, 40-foot stage banners and variable-type motion posters.'),
              url: '',
              imageUrl: '',
              tags: ['Identity', 'Festival'],
            },
            {
              title: l('100 Posters in 100 Days'),
              description: l('Two-color risograph poster archive printed in editions of 50 and exhibited in Mumbai.'),
              url: '',
              imageUrl: '',
              tags: ['Print', 'Exhibition'],
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
    id: 'brutalist-06',
    name: 'Black Frame',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Synthwave Pink dark theme for brand rebels — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0c0512 0%, #3f1d36 55%, #f472b6 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ffeef8',
        accent: '#f472b6',
        surface: '#0c0512',
        text: '#f0cfe3',
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
          eyebrow: l('Brand Rebel'),
          headline: l('TYPE FIRST. EVERYTHING ELSE SECOND.'),
          subheadline: l('Stripping away polite templates in favor of direct typography, bold color and honest grids.'),
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
              title: l('Sonic Underground Festival'),
              description: l('Complete visual identity, 40-foot stage banners and variable-type motion posters.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Identity', 'Festival'],
            },
            {
              title: l('100 Posters in 100 Days'),
              description: l('Two-color risograph poster archive printed in editions of 50 and exhibited in Mumbai.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Print', 'Exhibition'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Stripping away polite templates in favor of direct typography, bold color and honest grids. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Founder & Art Director'),
              company: l('Studio Slab'),
              period: l('2021 — Present'),
              description: l('Directing bold visual identities for record labels, galleries and indie tech.'),
            },
            {
              role: l('Senior Graphic Designer'),
              company: l('Format Collective'),
              period: l('2018 — 2021'),
              description: l('Led print and campaign systems across 30+ cultural commissions.'),
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
    id: 'brutalist-07',
    name: 'Punch Card',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Porcelain Emerald light theme for creative coders — Mono headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d1f18',
        accent: '#0a8754',
        surface: '#f9fcfa',
        text: '#192a22',
        fontHeading: 'Mono',
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
          eyebrow: l('Creative Coder'),
          headline: l('BUILT TO BE NOTICED.'),
          subheadline: l('Independent art direction for music festivals, art books and fearless startups.'),
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
              url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&auto=format&fit=crop&q=80',
              alt: l('Gallery exhibition installation'),
              caption: l('Exhibition view'),
            },
            {
              url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
              alt: l('Studio pigments and works in progress'),
              caption: l('Atelier notes'),
            },
            {
              url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
              alt: l('Hand-thrown stoneware vessels'),
              caption: l('Ceramic study'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('About'),
          body: l('Independent art direction for music festivals, art books and fearless startups. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('100 Posters in 100 Days'),
              description: l('Two-color risograph poster archive printed in editions of 50 and exhibited in Mumbai.'),
              url: '',
              imageUrl: '',
              tags: ['Print', 'Exhibition'],
            },
            {
              title: l('Mono Foundry Specimen'),
              description: l('Interactive brutalist type specimen website with live variable axis controls.'),
              url: '',
              imageUrl: '',
              tags: ['Typography', 'Web'],
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
          location: l('Delhi, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'brutalist-08',
    name: 'Concrete Grid',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Acid Lime light theme for editorial illustrators — System headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f3f7ec 0%, #d2e5d2 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#15803d',
        surface: '#f3f7ec',
        text: '#141414',
        fontHeading: 'System',
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
          eyebrow: l('Editorial Illustrator'),
          headline: l('UNAPOLOGETIC VISUAL SYSTEMS.'),
          subheadline: l('High-contrast identities, print posters and interactive web experiments for cultural brands.'),
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
          body: l('High-contrast identities, print posters and interactive web experiments for cultural brands. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Selected Frames'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
              alt: l('Studio pigments and works in progress'),
              caption: l('Atelier notes'),
            },
            {
              url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
              alt: l('Hand-thrown stoneware vessels'),
              caption: l('Ceramic study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80',
              alt: l('Textured abstract brushwork study'),
              caption: l('Canvas series I'),
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
              quote: l('Gave our festival an unmistakable visual voice you could spot from three blocks away.'),
              author: l('Kabir Sen'),
              role: l('Program Director'),
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
    id: 'brutalist-09',
    name: 'Cut & Paste',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Cyber Cyan dark theme for exhibition designers — Outfit headings with centered hero and compact spacing.',
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
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Exhibition Designer'),
          headline: l('MAKE IT LOUD.'),
          subheadline: l('Stripping away polite templates in favor of direct typography, bold color and honest grids.'),
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
          body: l('Stripping away polite templates in favor of direct typography, bold color and honest grids. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Creative Coding', 'WebGL', 'Variable Fonts', 'Experimental UI'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Counterculture Press'),
              description: l('Art-directed a 220-page hardcover anthology on South Asian graphic ephemera.'),
              url: '',
              imageUrl: '',
              tags: ['Book', 'Editorial'],
            },
            {
              title: l('Sonic Underground Festival'),
              description: l('Complete visual identity, 40-foot stage banners and variable-type motion posters.'),
              url: '',
              imageUrl: '',
              tags: ['Identity', 'Festival'],
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
          location: l('Indore, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'brutalist-10',
    name: 'Zero Ornament',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Chalk Vermilion light theme for zine makers — Outfit headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fcfbfa 0%, #f7ded9 55%, #d9381e 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Zine Maker'),
          headline: l('NO DECORATION. ONLY SIGNAL.'),
          subheadline: l('Independent art direction for music festivals, art books and fearless startups.'),
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
          body: l('Independent art direction for music festivals, art books and fearless startups. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Sonic Underground Festival'),
              description: l('Complete visual identity, 40-foot stage banners and variable-type motion posters.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Identity', 'Festival'],
            },
            {
              title: l('100 Posters in 100 Days'),
              description: l('Two-color risograph poster archive printed in editions of 50 and exhibited in Mumbai.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Print', 'Exhibition'],
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
              quote: l('Gave our festival an unmistakable visual voice you could spot from three blocks away.'),
              author: l('Kabir Sen'),
              role: l('Program Director'),
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
    id: 'brutalist-11',
    name: 'Volt Block',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Cobalt Slab light theme for kinetic typographers — Mono headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f4f4f5 0%, #d5def4 55%, #2563eb 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#09090b',
        accent: '#2563eb',
        surface: '#f4f4f5',
        text: '#18181b',
        fontHeading: 'Mono',
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
          eyebrow: l('Kinetic Typographer'),
          headline: l('AGAINST BEIGE.'),
          subheadline: l('High-contrast identities, print posters and interactive web experiments for cultural brands.'),
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
              title: l('100 Posters in 100 Days'),
              description: l('Two-color risograph poster archive printed in editions of 50 and exhibited in Mumbai.'),
              url: '',
              imageUrl: '',
              tags: ['Print', 'Exhibition'],
            },
            {
              title: l('Mono Foundry Specimen'),
              description: l('Interactive brutalist type specimen website with live variable axis controls.'),
              url: '',
              imageUrl: '',
              tags: ['Typography', 'Web'],
            },
            {
              title: l('Counterculture Press'),
              description: l('Art-directed a 220-page hardcover anthology on South Asian graphic ephemera.'),
              url: '',
              imageUrl: '',
              tags: ['Book', 'Editorial'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Poster Design', 'Kinetic Type', 'Risograph Print', 'Art Direction'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Gave our festival an unmistakable visual voice you could spot from three blocks away.'),
              author: l('Kabir Sen'),
              role: l('Program Director'),
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
          location: l('Delhi, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'brutalist-12',
    name: 'Mono Blast',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Laser Violet dark theme for album art directors — System headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #080512 0%, #302145 55%, #c084fc 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f4ebff',
        accent: '#c084fc',
        surface: '#080512',
        text: '#dfd0f5',
        fontHeading: 'System',
        fontBody: 'System',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Album Art Director'),
          headline: l('RAW OUTPUT. CLEAR INTENT.'),
          subheadline: l('Stripping away polite templates in favor of direct typography, bold color and honest grids.'),
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
          body: l('Stripping away polite templates in favor of direct typography, bold color and honest grids. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Creative Coding', 'WebGL', 'Variable Fonts', 'Experimental UI'],
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Selected Frames'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
              alt: l('Studio pigments and works in progress'),
              caption: l('Atelier notes'),
            },
            {
              url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
              alt: l('Hand-thrown stoneware vessels'),
              caption: l('Ceramic study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80',
              alt: l('Textured abstract brushwork study'),
              caption: l('Canvas series I'),
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
              title: l('Mono Foundry Specimen'),
              description: l('Interactive brutalist type specimen website with live variable axis controls.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Typography', 'Web'],
            },
            {
              title: l('Counterculture Press'),
              description: l('Art-directed a 220-page hardcover anthology on South Asian graphic ephemera.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Book', 'Editorial'],
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
          location: l('Kochi, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'brutalist-13',
    name: 'Riso Print',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Ice Indigo light theme for street & mural artists — Outfit headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f5f7ff 0%, #dcdcfb 55%, #4f46e5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#11132b',
        accent: '#4f46e5',
        surface: '#f5f7ff',
        text: '#1e2240',
        fontHeading: 'Outfit',
        fontBody: 'Outfit',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Street & Mural Artist'),
          headline: l('TYPE FIRST. EVERYTHING ELSE SECOND.'),
          subheadline: l('Independent art direction for music festivals, art books and fearless startups.'),
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
          items: ['Brand Identity', 'Zine Publishing', 'Packaging', 'Exhibition Graphics'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Counterculture Press'),
              description: l('Art-directed a 220-page hardcover anthology on South Asian graphic ephemera.'),
              url: '',
              imageUrl: '',
              tags: ['Book', 'Editorial'],
            },
            {
              title: l('Sonic Underground Festival'),
              description: l('Complete visual identity, 40-foot stage banners and variable-type motion posters.'),
              url: '',
              imageUrl: '',
              tags: ['Identity', 'Festival'],
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
              role: l('Founder & Art Director'),
              company: l('Studio Slab'),
              period: l('2021 — Present'),
              description: l('Directing bold visual identities for record labels, galleries and indie tech.'),
            },
            {
              role: l('Senior Graphic Designer'),
              company: l('Format Collective'),
              period: l('2018 — 2021'),
              description: l('Led print and campaign systems across 30+ cultural commissions.'),
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
              quote: l('Gave our festival an unmistakable visual voice you could spot from three blocks away.'),
              author: l('Kabir Sen'),
              role: l('Program Director'),
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
          location: l('Indore, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'brutalist-14',
    name: 'Noise Floor',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Cyber Magenta light theme for independent art directors — Outfit headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #faf5ff 0%, #f1d6f8 55%, #c026d3 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0c',
        accent: '#c026d3',
        surface: '#faf5ff',
        text: '#16121a',
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
          eyebrow: l('Independent Art Director'),
          headline: l('BUILT TO BE NOTICED.'),
          subheadline: l('High-contrast identities, print posters and interactive web experiments for cultural brands.'),
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
          body: l('High-contrast identities, print posters and interactive web experiments for cultural brands. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Founder & Art Director'),
              company: l('Studio Slab'),
              period: l('2021 — Present'),
              description: l('Directing bold visual identities for record labels, galleries and indie tech.'),
            },
            {
              role: l('Senior Graphic Designer'),
              company: l('Format Collective'),
              period: l('2018 — 2021'),
              description: l('Led print and campaign systems across 30+ cultural commissions.'),
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
              degree: l('B.F.A. Visual Communication'),
              school: l('Sir J.J. Institute of Applied Art'),
              period: l('2014 — 2018'),
              description: l('Typography, printmaking and experimental media.'),
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
              title: l('Sonic Underground Festival'),
              description: l('Complete visual identity, 40-foot stage banners and variable-type motion posters.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Identity', 'Festival'],
            },
            {
              title: l('100 Posters in 100 Days'),
              description: l('Two-color risograph poster archive printed in editions of 50 and exhibited in Mumbai.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Print', 'Exhibition'],
            },
            {
              title: l('Mono Foundry Specimen'),
              description: l('Interactive brutalist type specimen website with live variable axis controls.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Typography', 'Web'],
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
          location: l('Remote · India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'brutalist-15',
    name: 'Flat Metal',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Plasma Orange dark theme for interactive sculptors — Mono headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #0f0704 0%, #432610 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1e6',
        accent: '#fb923c',
        surface: '#0f0704',
        text: '#f2d9c7',
        fontHeading: 'Mono',
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
          eyebrow: l('Interactive Sculptor'),
          headline: l('UNAPOLOGETIC VISUAL SYSTEMS.'),
          subheadline: l('Stripping away polite templates in favor of direct typography, bold color and honest grids.'),
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
          items: ['Creative Coding', 'WebGL', 'Variable Fonts', 'Experimental UI'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Founder & Art Director'),
              company: l('Studio Slab'),
              period: l('2021 — Present'),
              description: l('Directing bold visual identities for record labels, galleries and indie tech.'),
            },
            {
              role: l('Senior Graphic Designer'),
              company: l('Format Collective'),
              period: l('2018 — 2021'),
              description: l('Led print and campaign systems across 30+ cultural commissions.'),
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
              title: l('100 Posters in 100 Days'),
              description: l('Two-color risograph poster archive printed in editions of 50 and exhibited in Mumbai.'),
              url: '',
              imageUrl: '',
              tags: ['Print', 'Exhibition'],
            },
            {
              title: l('Mono Foundry Specimen'),
              description: l('Interactive brutalist type specimen website with live variable axis controls.'),
              url: '',
              imageUrl: '',
              tags: ['Typography', 'Web'],
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
    id: 'brutalist-16',
    name: 'Acid Poster',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Linen Terracotta light theme for printmakers — System headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fdf8f3 0%, #f4dfd5 55%, #c2512b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261710',
        accent: '#c2512b',
        surface: '#fdf8f3',
        text: '#332219',
        fontHeading: 'System',
        fontBody: 'System',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Printmaker'),
          headline: l('MAKE IT LOUD.'),
          subheadline: l('Independent art direction for music festivals, art books and fearless startups.'),
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
              title: l('Mono Foundry Specimen'),
              description: l('Interactive brutalist type specimen website with live variable axis controls.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Typography', 'Web'],
            },
            {
              title: l('Counterculture Press'),
              description: l('Art-directed a 220-page hardcover anthology on South Asian graphic ephemera.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Book', 'Editorial'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Independent art direction for music festivals, art books and fearless startups. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Founder & Art Director'),
              company: l('Studio Slab'),
              period: l('2021 — Present'),
              description: l('Directing bold visual identities for record labels, galleries and indie tech.'),
            },
            {
              role: l('Senior Graphic Designer'),
              company: l('Format Collective'),
              period: l('2018 — 2021'),
              description: l('Led print and campaign systems across 30+ cultural commissions.'),
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
    id: 'brutalist-17',
    name: 'Hard Copy',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Tangerine Concrete light theme for culture jammers — Outfit headings with editorial hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f5f5f4 0%, #f3ddd1 55%, #ea580c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d0d0d',
        accent: '#ea580c',
        surface: '#f5f5f4',
        text: '#1c1917',
        fontHeading: 'Outfit',
        fontBody: 'Outfit',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Culture Jammer'),
          headline: l('NO DECORATION. ONLY SIGNAL.'),
          subheadline: l('High-contrast identities, print posters and interactive web experiments for cultural brands.'),
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
              url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
              alt: l('Hand-thrown stoneware vessels'),
              caption: l('Ceramic study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80',
              alt: l('Textured abstract brushwork study'),
              caption: l('Canvas series I'),
            },
            {
              url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&auto=format&fit=crop&q=80',
              alt: l('Gallery exhibition installation'),
              caption: l('Exhibition view'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('About'),
          body: l('High-contrast identities, print posters and interactive web experiments for cultural brands. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Counterculture Press'),
              description: l('Art-directed a 220-page hardcover anthology on South Asian graphic ephemera.'),
              url: '',
              imageUrl: '',
              tags: ['Book', 'Editorial'],
            },
            {
              title: l('Sonic Underground Festival'),
              description: l('Complete visual identity, 40-foot stage banners and variable-type motion posters.'),
              url: '',
              imageUrl: '',
              tags: ['Identity', 'Festival'],
            },
            {
              title: l('100 Posters in 100 Days'),
              description: l('Two-color risograph poster archive printed in editions of 50 and exhibited in Mumbai.'),
              url: '',
              imageUrl: '',
              tags: ['Print', 'Exhibition'],
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
          location: l('Indore, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'brutalist-18',
    name: 'Wire Clash',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Volt Gold dark theme for motion artists — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0c0b04 0%, #403508 55%, #facc15 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fefce8',
        accent: '#facc15',
        surface: '#0c0b04',
        text: '#ebe5ba',
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
          eyebrow: l('Motion Artist'),
          headline: l('AGAINST BEIGE.'),
          subheadline: l('Stripping away polite templates in favor of direct typography, bold color and honest grids.'),
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
          body: l('Stripping away polite templates in favor of direct typography, bold color and honest grids. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Gallery'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80',
              alt: l('Textured abstract brushwork study'),
              caption: l('Canvas series I'),
            },
            {
              url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&auto=format&fit=crop&q=80',
              alt: l('Gallery exhibition installation'),
              caption: l('Exhibition view'),
            },
            {
              url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
              alt: l('Studio pigments and works in progress'),
              caption: l('Atelier notes'),
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
              quote: l('Gave our festival an unmistakable visual voice you could spot from three blocks away.'),
              author: l('Kabir Sen'),
              role: l('Program Director'),
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
    id: 'brutalist-19',
    name: 'Stark Type',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Nordic Spruce light theme for graphic activists — Mono headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f4fafa 0%, #d2e7e7 55%, #0e7c7b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0c1c1c',
        accent: '#0e7c7b',
        surface: '#f4fafa',
        text: '#172b2b',
        fontHeading: 'Mono',
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
          eyebrow: l('Graphic Activist'),
          headline: l('RAW OUTPUT. CLEAR INTENT.'),
          subheadline: l('Independent art direction for music festivals, art books and fearless startups.'),
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
          body: l('Independent art direction for music festivals, art books and fearless startups. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Brand Identity', 'Zine Publishing', 'Packaging', 'Exhibition Graphics'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('100 Posters in 100 Days'),
              description: l('Two-color risograph poster archive printed in editions of 50 and exhibited in Mumbai.'),
              url: '',
              imageUrl: '',
              tags: ['Print', 'Exhibition'],
            },
            {
              title: l('Mono Foundry Specimen'),
              description: l('Interactive brutalist type specimen website with live variable axis controls.'),
              url: '',
              imageUrl: '',
              tags: ['Typography', 'Web'],
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
          location: l('Delhi, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'brutalist-20',
    name: 'Brick Work',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Midnight Volt dark theme for type foundry founders — System headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #09090b 0%, #3e340d 55%, #facc15 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f4f4f5',
        accent: '#facc15',
        surface: '#09090b',
        text: '#e4e4e7',
        fontHeading: 'System',
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
          eyebrow: l('Type Foundry Founder'),
          headline: l('TYPE FIRST. EVERYTHING ELSE SECOND.'),
          subheadline: l('High-contrast identities, print posters and interactive web experiments for cultural brands.'),
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
          body: l('High-contrast identities, print posters and interactive web experiments for cultural brands. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Mono Foundry Specimen'),
              description: l('Interactive brutalist type specimen website with live variable axis controls.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Typography', 'Web'],
            },
            {
              title: l('Counterculture Press'),
              description: l('Art-directed a 220-page hardcover anthology on South Asian graphic ephemera.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Book', 'Editorial'],
            },
            {
              title: l('Sonic Underground Festival'),
              description: l('Complete visual identity, 40-foot stage banners and variable-type motion posters.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Identity', 'Festival'],
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
              quote: l('Gave our festival an unmistakable visual voice you could spot from three blocks away.'),
              author: l('Kabir Sen'),
              role: l('Program Director'),
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
    id: 'brutalist-21',
    name: 'Shock Ink',
    category: 'brutalist',
    family: 'Neo-Brutalist',
    audience: ['artist', 'designer', 'creator'],
    description: 'Hyper Blue dark theme for visual essayists — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #040814 0%, #182b47 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ebf3ff',
        accent: '#60a5fa',
        surface: '#040814',
        text: '#cde0f8',
        fontHeading: 'Outfit',
        fontBody: 'Outfit',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Visual Essayist'),
          headline: l('BUILT TO BE NOTICED.'),
          subheadline: l('Stripping away polite templates in favor of direct typography, bold color and honest grids.'),
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
              title: l('Counterculture Press'),
              description: l('Art-directed a 220-page hardcover anthology on South Asian graphic ephemera.'),
              url: '',
              imageUrl: '',
              tags: ['Book', 'Editorial'],
            },
            {
              title: l('Sonic Underground Festival'),
              description: l('Complete visual identity, 40-foot stage banners and variable-type motion posters.'),
              url: '',
              imageUrl: '',
              tags: ['Identity', 'Festival'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Creative Coding', 'WebGL', 'Variable Fonts', 'Experimental UI'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Gave our festival an unmistakable visual voice you could spot from three blocks away.'),
              author: l('Kabir Sen'),
              role: l('Program Director'),
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
          location: l('Indore, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
];
