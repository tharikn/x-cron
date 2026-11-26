// Auto-generated template seeds — Art Portfolio (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_ART_PORTFOLIO: SeedTemplate[] = [
  {
    id: 'art-portfolio-01',
    name: 'White Cube',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Alabaster Cobalt light theme for contemporary painters — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fafbfe 0%, #dae2fd 55%, #2457f5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1320',
        accent: '#2457f5',
        surface: '#fafbfe',
        text: '#1c2436',
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
          eyebrow: l('Contemporary Painter'),
          headline: l('Your Name'),
          subheadline: l('Visual artist working between natural mineral pigments, raw linen and architectural scale installations.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#cta-6',
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Visual artist working between natural mineral pigments, raw linen and architectural scale installations. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Tidal Sediments (Solo Show)'),
              description: l('Fourteen large-format earth-pigment canvases exhibited at Gallery Heritage, Mumbai (2025).'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Solo Exhibition', 'Painting'],
            },
            {
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
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
              quote: l('Commands physical space with quiet authority and an extraordinary sensitivity to raw material.'),
              author: l('Lakshmi Menon'),
              role: l('Independent Curator'),
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
    id: 'art-portfolio-02',
    name: 'Atelier Wall',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Vellum Rust light theme for sculptor & spatial artists — Georgia headings with editorial hero and comfortable spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Sculptor & Spatial Artist'),
          headline: l('Material studies in earth, pigment and space.'),
          subheadline: l('Exhibited across Kochi-Muziris, Mumbai and London; works held in private and institutional collections.'),
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: '',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: '',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Wheel & Handbuilt Ceramics', 'Natural Glazes', 'Wood-Fired Kiln', 'Sculpture'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Commands physical space with quiet authority and an extraordinary sensitivity to raw material.'),
              author: l('Lakshmi Menon'),
              role: l('Independent Curator'),
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
          location: l('Bengaluru, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'art-portfolio-03',
    name: 'Vernissage',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Obsidian Emerald dark theme for ceramicists — Georgia headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
        fontHeading: 'Georgia',
        fontBody: 'Georgia',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Ceramicist'),
          headline: l('Works on canvas, clay and cast bronze.'),
          subheadline: l('Open to museum commissions, architectural collaborations and private studio visits.'),
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
          body: l('Open to museum commissions, architectural collaborations and private studio visits. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Specialties'),
          items: ['Etching & Lithography', 'Archival Framing', 'Public Commissions', 'Artist Books'],
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
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
            },
            {
              title: l('Tidal Sediments (Solo Show)'),
              description: l('Fourteen large-format earth-pigment canvases exhibited at Gallery Heritage, Mumbai (2025).'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Solo Exhibition', 'Painting'],
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
          location: l('Jaipur, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'art-portfolio-04',
    name: 'Catalogue Raisonné',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Porcelain Emerald light theme for printmakers — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d1f18',
        accent: '#0a8754',
        surface: '#f9fcfa',
        text: '#192a22',
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
          eyebrow: l('Printmaker'),
          headline: l('Your Name'),
          subheadline: l('Visual artist working between natural mineral pigments, raw linen and architectural scale installations.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Oil & Mineral Pigment', 'Large-Scale Canvas', 'Site Installation', 'Curatorial Writing'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Tidal Sediments (Solo Show)'),
              description: l('Fourteen large-format earth-pigment canvases exhibited at Gallery Heritage, Mumbai (2025).'),
              url: '',
              imageUrl: '',
              tags: ['Solo Exhibition', 'Painting'],
            },
            {
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: '',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: '',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
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
              role: l('Artist in Residence'),
              company: l('Baroda Print & Clay Collective'),
              period: l('2023 — 2024'),
              description: l('Developed mineral glaze formulations and large-scale relief works.'),
            },
            {
              role: l('Exhibiting Artist'),
              company: l('Independent Studio'),
              period: l('2018 — Present'),
              description: l('6 solo exhibitions and 19 group shows internationally.'),
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
              quote: l('Commands physical space with quiet authority and an extraordinary sensitivity to raw material.'),
              author: l('Lakshmi Menon'),
              role: l('Independent Curator'),
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
          location: l('Goa, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'art-portfolio-05',
    name: 'Chiaroscuro · Art',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Newsprint Navy light theme for installation artists — Georgia headings with editorial hero and comfortable spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Installation Artist'),
          headline: l('Exploring memory through tactile form.'),
          subheadline: l('Exhibited across Kochi-Muziris, Mumbai and London; works held in private and institutional collections.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#contact-7',
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Exhibited across Kochi-Muziris, Mumbai and London; works held in private and institutional collections. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Artist in Residence'),
              company: l('Baroda Print & Clay Collective'),
              period: l('2023 — 2024'),
              description: l('Developed mineral glaze formulations and large-scale relief works.'),
            },
            {
              role: l('Exhibiting Artist'),
              company: l('Independent Studio'),
              period: l('2018 — Present'),
              description: l('6 solo exhibitions and 19 group shows internationally.'),
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
              degree: l('M.V.A. Painting & Sculpture'),
              school: l('MS University, Baroda'),
              period: l('2016 — 2018'),
              description: l('Faculty of Fine Arts gold medalist.'),
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
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
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
          location: l('Madurai, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'art-portfolio-06',
    name: 'Triptych',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Midnight Cobalt dark theme for textile & fiber artists — Georgia headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eff6ff',
        accent: '#60a5fa',
        surface: '#070b16',
        text: '#d8e4f8',
        fontHeading: 'Georgia',
        fontBody: 'Georgia',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Textile & Fiber Artist'),
          headline: l('Exhibitions, commissions and studio editions.'),
          subheadline: l('Open to museum commissions, architectural collaborations and private studio visits.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Etching & Lithography', 'Archival Framing', 'Public Commissions', 'Artist Books'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Artist in Residence'),
              company: l('Baroda Print & Clay Collective'),
              period: l('2023 — 2024'),
              description: l('Developed mineral glaze formulations and large-scale relief works.'),
            },
            {
              role: l('Exhibiting Artist'),
              company: l('Independent Studio'),
              period: l('2018 — Present'),
              description: l('6 solo exhibitions and 19 group shows internationally.'),
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
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: '',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
            },
            {
              title: l('Tidal Sediments (Solo Show)'),
              description: l('Fourteen large-format earth-pigment canvases exhibited at Gallery Heritage, Mumbai (2025).'),
              url: '',
              imageUrl: '',
              tags: ['Solo Exhibition', 'Painting'],
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
    id: 'art-portfolio-07',
    name: 'Stoneware',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Chalk Vermilion light theme for mixed-media artists — Fraunces headings with split-media hero and comfortable spacing.',
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
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Mixed-Media Artist'),
          headline: l('Your Name'),
          subheadline: l('Visual artist working between natural mineral pigments, raw linen and architectural scale installations.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#cta-6',
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
              title: l('Tidal Sediments (Solo Show)'),
              description: l('Fourteen large-format earth-pigment canvases exhibited at Gallery Heritage, Mumbai (2025).'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Solo Exhibition', 'Painting'],
            },
            {
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Profile'),
          body: l('Visual artist working between natural mineral pigments, raw linen and architectural scale installations. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Artist in Residence'),
              company: l('Baroda Print & Clay Collective'),
              period: l('2023 — 2024'),
              description: l('Developed mineral glaze formulations and large-scale relief works.'),
            },
            {
              role: l('Exhibiting Artist'),
              company: l('Independent Studio'),
              period: l('2018 — Present'),
              description: l('6 solo exhibitions and 19 group shows internationally.'),
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
    id: 'art-portfolio-08',
    name: 'Impasto',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Parchment Olive light theme for public art creators — Georgia headings with editorial hero and comfortable spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Public Art Creator'),
          headline: l('Material studies in earth, pigment and space.'),
          subheadline: l('Exhibited across Kochi-Muziris, Mumbai and London; works held in private and institutional collections.'),
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
          title: l('Practice'),
          body: l('Exhibited across Kochi-Muziris, Mumbai and London; works held in private and institutional collections. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: '',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: '',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
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
          location: l('Goa, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'art-portfolio-09',
    name: 'Gallery Plinth',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Abyssal Violet dark theme for wood & joinery artists — Georgia headings with centered hero and comfortable spacing.',
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
        fontBody: 'Georgia',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Wood & Joinery Artist'),
          headline: l('Works on canvas, clay and cast bronze.'),
          subheadline: l('Open to museum commissions, architectural collaborations and private studio visits.'),
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
          body: l('Open to museum commissions, architectural collaborations and private studio visits. Based in Madurai, working with teams worldwide.'),
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
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Commands physical space with quiet authority and an extraordinary sensitivity to raw material.'),
              author: l('Lakshmi Menon'),
              role: l('Independent Curator'),
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
    id: 'art-portfolio-10',
    name: 'Archival Linen',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Ice Indigo light theme for glass sculptors — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f5f7ff 0%, #dcdcfb 55%, #4f46e5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#11132b',
        accent: '#4f46e5',
        surface: '#f5f7ff',
        text: '#1e2240',
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
          eyebrow: l('Glass Sculptor'),
          headline: l('Your Name'),
          subheadline: l('Visual artist working between natural mineral pigments, raw linen and architectural scale installations.'),
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
          title: l('Approach'),
          body: l('Visual artist working between natural mineral pigments, raw linen and architectural scale installations. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Oil & Mineral Pigment', 'Large-Scale Canvas', 'Site Installation', 'Curatorial Writing'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Tidal Sediments (Solo Show)'),
              description: l('Fourteen large-format earth-pigment canvases exhibited at Gallery Heritage, Mumbai (2025).'),
              url: '',
              imageUrl: '',
              tags: ['Solo Exhibition', 'Painting'],
            },
            {
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: '',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: '',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
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
          location: l('Bengaluru, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'art-portfolio-11',
    name: 'Bronze Cast',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Cream Burgundy light theme for fine art jewelers — Georgia headings with editorial hero and comfortable spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Fine Art Jeweler'),
          headline: l('Exploring memory through tactile form.'),
          subheadline: l('Exhibited across Kochi-Muziris, Mumbai and London; works held in private and institutional collections.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#cta-6',
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Exhibited across Kochi-Muziris, Mumbai and London; works held in private and institutional collections. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
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
              quote: l('Commands physical space with quiet authority and an extraordinary sensitivity to raw material.'),
              author: l('Lakshmi Menon'),
              role: l('Independent Curator'),
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
    id: 'art-portfolio-12',
    name: 'Paper & Ash',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Charcoal Amber dark theme for site-specific artists — Georgia headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fffbeb',
        accent: '#fbbf24',
        surface: '#100e0a',
        text: '#ede5ce',
        fontHeading: 'Georgia',
        fontBody: 'Georgia',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Site-Specific Artist'),
          headline: l('Exhibitions, commissions and studio editions.'),
          subheadline: l('Open to museum commissions, architectural collaborations and private studio visits.'),
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: '',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
            },
            {
              title: l('Tidal Sediments (Solo Show)'),
              description: l('Fourteen large-format earth-pigment canvases exhibited at Gallery Heritage, Mumbai (2025).'),
              url: '',
              imageUrl: '',
              tags: ['Solo Exhibition', 'Painting'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Etching & Lithography', 'Archival Framing', 'Public Commissions', 'Artist Books'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Commands physical space with quiet authority and an extraordinary sensitivity to raw material.'),
              author: l('Lakshmi Menon'),
              role: l('Independent Curator'),
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
          location: l('Goa, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'art-portfolio-13',
    name: 'Still Life',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Linen Terracotta light theme for land & eco artists — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fdf8f3 0%, #f4dfd5 55%, #c2512b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261710',
        accent: '#c2512b',
        surface: '#fdf8f3',
        text: '#332219',
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
          eyebrow: l('Land & Eco Artist'),
          headline: l('Your Name'),
          subheadline: l('Visual artist working between natural mineral pigments, raw linen and architectural scale installations.'),
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
          body: l('Visual artist working between natural mineral pigments, raw linen and architectural scale installations. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Specialties'),
          items: ['Oil & Mineral Pigment', 'Large-Scale Canvas', 'Site Installation', 'Curatorial Writing'],
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
              title: l('Tidal Sediments (Solo Show)'),
              description: l('Fourteen large-format earth-pigment canvases exhibited at Gallery Heritage, Mumbai (2025).'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Solo Exhibition', 'Painting'],
            },
            {
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
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
          location: l('Madurai, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'art-portfolio-14',
    name: 'Edition Print',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Oatmeal Forest light theme for sound & light sculptors — Georgia headings with editorial hero and comfortable spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Sound & Light Sculptor'),
          headline: l('Material studies in earth, pigment and space.'),
          subheadline: l('Exhibited across Kochi-Muziris, Mumbai and London; works held in private and institutional collections.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Wheel & Handbuilt Ceramics', 'Natural Glazes', 'Wood-Fired Kiln', 'Sculpture'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: '',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: '',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
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
              role: l('Artist in Residence'),
              company: l('Baroda Print & Clay Collective'),
              period: l('2023 — 2024'),
              description: l('Developed mineral glaze formulations and large-scale relief works.'),
            },
            {
              role: l('Exhibiting Artist'),
              company: l('Independent Studio'),
              period: l('2018 — Present'),
              description: l('6 solo exhibitions and 19 group shows internationally.'),
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
              quote: l('Commands physical space with quiet authority and an extraordinary sensitivity to raw material.'),
              author: l('Lakshmi Menon'),
              role: l('Independent Curator'),
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
          location: l('Bengaluru, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'art-portfolio-15',
    name: 'Monolith',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Velvet Rose dark theme for figurative artists — Georgia headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
        fontHeading: 'Georgia',
        fontBody: 'Georgia',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Figurative Artist'),
          headline: l('Works on canvas, clay and cast bronze.'),
          subheadline: l('Open to museum commissions, architectural collaborations and private studio visits.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#contact-7',
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Open to museum commissions, architectural collaborations and private studio visits. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Artist in Residence'),
              company: l('Baroda Print & Clay Collective'),
              period: l('2023 — 2024'),
              description: l('Developed mineral glaze formulations and large-scale relief works.'),
            },
            {
              role: l('Exhibiting Artist'),
              company: l('Independent Studio'),
              period: l('2018 — Present'),
              description: l('6 solo exhibitions and 19 group shows internationally.'),
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
              degree: l('M.V.A. Painting & Sculpture'),
              school: l('MS University, Baroda'),
              period: l('2016 — 2018'),
              description: l('Faculty of Fine Arts gold medalist.'),
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
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
            },
            {
              title: l('Tidal Sediments (Solo Show)'),
              description: l('Fourteen large-format earth-pigment canvases exhibited at Gallery Heritage, Mumbai (2025).'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Solo Exhibition', 'Painting'],
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
          location: l('Jaipur, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'art-portfolio-16',
    name: 'Diptych',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Nordic Spruce light theme for abstract expressionists — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f4fafa 0%, #d2e7e7 55%, #0e7c7b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0c1c1c',
        accent: '#0e7c7b',
        surface: '#f4fafa',
        text: '#172b2b',
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
          eyebrow: l('Abstract Expressionist'),
          headline: l('Your Name'),
          subheadline: l('Visual artist working between natural mineral pigments, raw linen and architectural scale installations.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Oil & Mineral Pigment', 'Large-Scale Canvas', 'Site Installation', 'Curatorial Writing'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Artist in Residence'),
              company: l('Baroda Print & Clay Collective'),
              period: l('2023 — 2024'),
              description: l('Developed mineral glaze formulations and large-scale relief works.'),
            },
            {
              role: l('Exhibiting Artist'),
              company: l('Independent Studio'),
              period: l('2018 — Present'),
              description: l('6 solo exhibitions and 19 group shows internationally.'),
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
              title: l('Tidal Sediments (Solo Show)'),
              description: l('Fourteen large-format earth-pigment canvases exhibited at Gallery Heritage, Mumbai (2025).'),
              url: '',
              imageUrl: '',
              tags: ['Solo Exhibition', 'Painting'],
            },
            {
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: '',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: '',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
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
    id: 'art-portfolio-17',
    name: 'Raw Canvas',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Saffron Ink light theme for paper & book artists — Georgia headings with editorial hero and comfortable spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Paper & Book Artist'),
          headline: l('Exploring memory through tactile form.'),
          subheadline: l('Exhibited across Kochi-Muziris, Mumbai and London; works held in private and institutional collections.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#cta-6',
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
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Profile'),
          body: l('Exhibited across Kochi-Muziris, Mumbai and London; works held in private and institutional collections. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Artist in Residence'),
              company: l('Baroda Print & Clay Collective'),
              period: l('2023 — 2024'),
              description: l('Developed mineral glaze formulations and large-scale relief works.'),
            },
            {
              role: l('Exhibiting Artist'),
              company: l('Independent Studio'),
              period: l('2018 — Present'),
              description: l('6 solo exhibitions and 19 group shows internationally.'),
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
    id: 'art-portfolio-18',
    name: 'Kiln Fired',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Deep Teal dark theme for metalwork sculptors — Georgia headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f0fdfa',
        accent: '#2dd4bf',
        surface: '#071112',
        text: '#cce8e4',
        fontHeading: 'Georgia',
        fontBody: 'Georgia',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Metalwork Sculptor'),
          headline: l('Exhibitions, commissions and studio editions.'),
          subheadline: l('Open to museum commissions, architectural collaborations and private studio visits.'),
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
          title: l('Practice'),
          body: l('Open to museum commissions, architectural collaborations and private studio visits. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: '',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
            },
            {
              title: l('Tidal Sediments (Solo Show)'),
              description: l('Fourteen large-format earth-pigment canvases exhibited at Gallery Heritage, Mumbai (2025).'),
              url: '',
              imageUrl: '',
              tags: ['Solo Exhibition', 'Painting'],
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
          location: l('Bengaluru, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'art-portfolio-19',
    name: 'Studio North',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Cloud Plum light theme for curator & artists — Fraunces headings with split-media hero and comfortable spacing.',
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
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Curator & Artist'),
          headline: l('Your Name'),
          subheadline: l('Visual artist working between natural mineral pigments, raw linen and architectural scale installations.'),
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
          body: l('Visual artist working between natural mineral pigments, raw linen and architectural scale installations. Based in Jaipur, working with teams worldwide.'),
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
              quote: l('Commands physical space with quiet authority and an extraordinary sensitivity to raw material.'),
              author: l('Lakshmi Menon'),
              role: l('Independent Curator'),
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
    id: 'art-portfolio-20',
    name: 'Biennale',
    category: 'art-portfolio',
    family: 'Art Portfolio',
    audience: ['artist', 'sculptor', 'creative'],
    description: 'Sepia Slate light theme for residency fellows — Georgia headings with editorial hero and comfortable spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Residency Fellow'),
          headline: l('Material studies in earth, pigment and space.'),
          subheadline: l('Exhibited across Kochi-Muziris, Mumbai and London; works held in private and institutional collections.'),
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
          title: l('Approach'),
          body: l('Exhibited across Kochi-Muziris, Mumbai and London; works held in private and institutional collections. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Wheel & Handbuilt Ceramics', 'Natural Glazes', 'Wood-Fired Kiln', 'Sculpture'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Courtyard Vessels'),
              description: l('Commissioned series of 18 monumental stoneware forms for a civic botanical pavilion.'),
              url: '',
              imageUrl: '',
              tags: ['Commission', 'Ceramics'],
            },
            {
              title: l('Monsoon Archive (Edition)'),
              description: l('Hand-bound artist monograph with 12 tipped-in archival giclée plates, edition of 150.'),
              url: '',
              imageUrl: '',
              tags: ['Artist Book', 'Print'],
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
          location: l('Goa, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
];
