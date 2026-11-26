// Auto-generated template seeds — Creative Studio (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_CREATIVE: SeedTemplate[] = [
  {
    id: 'creative-01',
    name: 'Color Field',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Lavender Fog light theme for brand & motion designers — Outfit headings with centered hero and comfortable spacing.',
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
        variant: 'centered',
        props: {
          eyebrow: l('Brand & Motion Designer'),
          headline: l('Color, form and stories that stick.'),
          subheadline: l('Multidisciplinary creative studio crafting expressive brand identities, bespoke illustrations and motion systems.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Brand Identity', 'Editorial Illustration', 'After Effects', 'Blender 3D'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Independent Creative Director'),
              company: l('Studio Polychrome'),
              period: l('2021 — Present'),
              description: l('Collaborating with consumer brands, publishers and startups worldwide.'),
            },
            {
              role: l('Senior Brand Designer'),
              company: l('Tangerine Agency'),
              period: l('2018 — 2021'),
              description: l('Led visual identity and illustration campaigns.'),
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
              title: l('Kaveri Craft Roasters'),
              description: l('Illustrated tin packaging, custom display lettering and tactile retail unboxing system.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Packaging', 'Illustration'],
            },
            {
              title: l('Launch Film & Motion Kit'),
              description: l('90-second 3D product launch film and modular Lottie animation library.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Motion', '3D'],
            },
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
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
    id: 'creative-02',
    name: 'Palette Knife',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Signal Yellow light theme for editorial illustrators — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f7f3e3 0%, #eddbc2 55%, #b45309 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#b45309',
        surface: '#f7f3e3',
        text: '#141414',
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
          eyebrow: l('Editorial Illustrator'),
          headline: l('Making brands unmistakable.'),
          subheadline: l('Working across editorial commissions, consumer packaging and interactive product launches.'),
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
              title: l('Launch Film & Motion Kit'),
              description: l('90-second 3D product launch film and modular Lottie animation library.'),
              url: '',
              imageUrl: '',
              tags: ['Motion', '3D'],
            },
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: '',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Profile'),
          body: l('Working across editorial commissions, consumer packaging and interactive product launches. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Independent Creative Director'),
              company: l('Studio Polychrome'),
              period: l('2021 — Present'),
              description: l('Collaborating with consumer brands, publishers and startups worldwide.'),
            },
            {
              role: l('Senior Brand Designer'),
              company: l('Tangerine Agency'),
              period: l('2018 — 2021'),
              description: l('Led visual identity and illustration campaigns.'),
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
    id: 'creative-03',
    name: 'Studio Spark',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Obsidian Emerald dark theme for 3d visual artists — Outfit headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
        fontHeading: 'Outfit',
        fontBody: 'Georgia',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('3D Visual Artist'),
          headline: l('Playful rigor across print, 3D and motion.'),
          subheadline: l('Bringing warmth, wit and tactile detail to digital-first companies.'),
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
          title: l('Practice'),
          body: l('Bringing warmth, wit and tactile detail to digital-first companies. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
            },
            {
              title: l('Kaveri Craft Roasters'),
              description: l('Illustrated tin packaging, custom display lettering and tactile retail unboxing system.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Packaging', 'Illustration'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'creative-04',
    name: 'Kinetic Brush',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Vellum Rust light theme for creative directors — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #faf4ea 0%, #eed9cb 55%, #a8431a 140%)',
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
          eyebrow: l('Creative Director'),
          headline: l('Your Name'),
          subheadline: l('Multidisciplinary creative studio crafting expressive brand identities, bespoke illustrations and motion systems.'),
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
          body: l('Multidisciplinary creative studio crafting expressive brand identities, bespoke illustrations and motion systems. Based in Thiruvananthapuram, working with teams worldwide.'),
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
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Every single concept arrived with personality, polish and zero clichés.'),
              author: l('Tara Singh'),
              role: l('Founder, Kaveri Roasters'),
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
    id: 'creative-05',
    name: 'Mixed Media',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Sage Mist light theme for title & motion animators — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #eff7f2 0%, #cee5d7 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#122118',
        accent: '#15803d',
        surface: '#eff7f2',
        text: '#1d3025',
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
          eyebrow: l('Title & Motion Animator'),
          headline: l('Visual worlds built with hand and code.'),
          subheadline: l('Working across editorial commissions, consumer packaging and interactive product launches.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#contact-6',
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
          body: l('Working across editorial commissions, consumer packaging and interactive product launches. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Packaging Design', 'Custom Lettering', 'Art Direction', 'Cinema 4D'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Launch Film & Motion Kit'),
              description: l('90-second 3D product launch film and modular Lottie animation library.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Motion', '3D'],
            },
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'creative-06',
    name: 'Paper Cut',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Poster Crimson light theme for packaging designers — Outfit headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #ffffff 0%, #fadede 55%, #dc2626 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#dc2626',
        surface: '#ffffff',
        text: '#141414',
        fontHeading: 'Outfit',
        fontBody: 'Georgia',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Packaging Designer'),
          headline: l('Ideas you can feel at first glance.'),
          subheadline: l('Bringing warmth, wit and tactile detail to digital-first companies.'),
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
          body: l('Bringing warmth, wit and tactile detail to digital-first companies. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: '',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
            },
            {
              title: l('Kaveri Craft Roasters'),
              description: l('Illustrated tin packaging, custom display lettering and tactile retail unboxing system.'),
              url: '',
              imageUrl: '',
              tags: ['Packaging', 'Illustration'],
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
              quote: l('Every single concept arrived with personality, polish and zero clichés.'),
              author: l('Tara Singh'),
              role: l('Founder, Kaveri Roasters'),
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
    id: 'creative-07',
    name: 'Mural Lab',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Midnight Cobalt dark theme for character designers — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
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
        variant: 'centered',
        props: {
          eyebrow: l('Character Designer'),
          headline: l('Color, form and stories that stick.'),
          subheadline: l('Multidisciplinary creative studio crafting expressive brand identities, bespoke illustrations and motion systems.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#contact-6',
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
              title: l('Kaveri Craft Roasters'),
              description: l('Illustrated tin packaging, custom display lettering and tactile retail unboxing system.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Packaging', 'Illustration'],
            },
            {
              title: l('Launch Film & Motion Kit'),
              description: l('90-second 3D product launch film and modular Lottie animation library.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Motion', '3D'],
            },
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Brand Identity', 'Editorial Illustration', 'After Effects', 'Blender 3D'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Every single concept arrived with personality, polish and zero clichés.'),
              author: l('Tara Singh'),
              role: l('Founder, Kaveri Roasters'),
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'creative-08',
    name: 'Chroma Play',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Newsprint Navy light theme for type & lettering artists — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f7f4ec 0%, #d6d9e3 55%, #1e40af 140%)',
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
          eyebrow: l('Type & Lettering Artist'),
          headline: l('Making brands unmistakable.'),
          subheadline: l('Working across editorial commissions, consumer packaging and interactive product launches.'),
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
          body: l('Working across editorial commissions, consumer packaging and interactive product launches. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Specialties'),
          items: ['Packaging Design', 'Custom Lettering', 'Art Direction', 'Cinema 4D'],
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
              title: l('Launch Film & Motion Kit'),
              description: l('90-second 3D product launch film and modular Lottie animation library.'),
              url: '',
              imageUrl: '',
              tags: ['Motion', '3D'],
            },
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: '',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'creative-09',
    name: 'Freeform',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Blush Stone light theme for muralist & spatial artists — Outfit headings with editorial hero and comfortable spacing.',
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
        fontBody: 'Georgia',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Muralist & Spatial Artist'),
          headline: l('Playful rigor across print, 3D and motion.'),
          subheadline: l('Bringing warmth, wit and tactile detail to digital-first companies.'),
          primaryCtaLabel: l('Get in touch'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Motion Systems', 'Rive / Lottie', 'Character Design', 'Print Production'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
            },
            {
              title: l('Kaveri Craft Roasters'),
              description: l('Illustrated tin packaging, custom display lettering and tactile retail unboxing system.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Packaging', 'Illustration'],
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
              role: l('Independent Creative Director'),
              company: l('Studio Polychrome'),
              period: l('2021 — Present'),
              description: l('Collaborating with consumer brands, publishers and startups worldwide.'),
            },
            {
              role: l('Senior Brand Designer'),
              company: l('Tangerine Agency'),
              period: l('2018 — 2021'),
              description: l('Led visual identity and illustration campaigns.'),
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
              quote: l('Every single concept arrived with personality, polish and zero clichés.'),
              author: l('Tara Singh'),
              role: l('Founder, Kaveri Roasters'),
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'creative-10',
    name: 'Wild Sketch',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Acid Lime light theme for interactive experience designers — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f3f7ec 0%, #d2e5d2 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#15803d',
        surface: '#f3f7ec',
        text: '#141414',
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
          eyebrow: l('Interactive Experience Designer'),
          headline: l('Your Name'),
          subheadline: l('Multidisciplinary creative studio crafting expressive brand identities, bespoke illustrations and motion systems.'),
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
          body: l('Multidisciplinary creative studio crafting expressive brand identities, bespoke illustrations and motion systems. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Independent Creative Director'),
              company: l('Studio Polychrome'),
              period: l('2021 — Present'),
              description: l('Collaborating with consumer brands, publishers and startups worldwide.'),
            },
            {
              role: l('Senior Brand Designer'),
              company: l('Tangerine Agency'),
              period: l('2018 — 2021'),
              description: l('Led visual identity and illustration campaigns.'),
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
              degree: l('B.Des. Graphic Design'),
              school: l('MIT Institute of Design, Pune'),
              period: l('2014 — 2018'),
              description: l('Illustration, typography and motion studies.'),
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
              title: l('Kaveri Craft Roasters'),
              description: l('Illustrated tin packaging, custom display lettering and tactile retail unboxing system.'),
              url: '',
              imageUrl: '',
              tags: ['Packaging', 'Illustration'],
            },
            {
              title: l('Launch Film & Motion Kit'),
              description: l('90-second 3D product launch film and modular Lottie animation library.'),
              url: '',
              imageUrl: '',
              tags: ['Motion', '3D'],
            },
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: '',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'creative-11',
    name: 'Storycraft',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Abyssal Violet dark theme for print & book designers — Fraunces headings with split-media hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Print & Book Designer'),
          headline: l('Visual worlds built with hand and code.'),
          subheadline: l('Working across editorial commissions, consumer packaging and interactive product launches.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Packaging Design', 'Custom Lettering', 'Art Direction', 'Cinema 4D'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Independent Creative Director'),
              company: l('Studio Polychrome'),
              period: l('2021 — Present'),
              description: l('Collaborating with consumer brands, publishers and startups worldwide.'),
            },
            {
              role: l('Senior Brand Designer'),
              company: l('Tangerine Agency'),
              period: l('2018 — 2021'),
              description: l('Led visual identity and illustration campaigns.'),
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
              title: l('Launch Film & Motion Kit'),
              description: l('90-second 3D product launch film and modular Lottie animation library.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Motion', '3D'],
            },
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
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
    id: 'creative-12',
    name: 'Prism Toy',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Parchment Olive light theme for visual storytellers — Outfit headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f8f5ea 0%, #e1e0cc 55%, #5c6b24 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1f2314',
        accent: '#5c6b24',
        surface: '#f8f5ea',
        text: '#2c301e',
        fontHeading: 'Outfit',
        fontBody: 'Georgia',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Visual Storyteller'),
          headline: l('Ideas you can feel at first glance.'),
          subheadline: l('Bringing warmth, wit and tactile detail to digital-first companies.'),
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
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: '',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
            },
            {
              title: l('Kaveri Craft Roasters'),
              description: l('Illustrated tin packaging, custom display lettering and tactile retail unboxing system.'),
              url: '',
              imageUrl: '',
              tags: ['Packaging', 'Illustration'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Profile'),
          body: l('Bringing warmth, wit and tactile detail to digital-first companies. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Independent Creative Director'),
              company: l('Studio Polychrome'),
              period: l('2021 — Present'),
              description: l('Collaborating with consumer brands, publishers and startups worldwide.'),
            },
            {
              role: l('Senior Brand Designer'),
              company: l('Tangerine Agency'),
              period: l('2018 — 2021'),
              description: l('Led visual identity and illustration campaigns.'),
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
    id: 'creative-13',
    name: 'Clay & Vector',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Glacier Blue light theme for art & campaign directors — Outfit headings with centered hero and comfortable spacing.',
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
        variant: 'centered',
        props: {
          eyebrow: l('Art & Campaign Director'),
          headline: l('Color, form and stories that stick.'),
          subheadline: l('Multidisciplinary creative studio crafting expressive brand identities, bespoke illustrations and motion systems.'),
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
          title: l('Practice'),
          body: l('Multidisciplinary creative studio crafting expressive brand identities, bespoke illustrations and motion systems. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Kaveri Craft Roasters'),
              description: l('Illustrated tin packaging, custom display lettering and tactile retail unboxing system.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Packaging', 'Illustration'],
            },
            {
              title: l('Launch Film & Motion Kit'),
              description: l('90-second 3D product launch film and modular Lottie animation library.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Motion', '3D'],
            },
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'creative-14',
    name: 'Motion Loft',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Cobalt Slab light theme for iconography specialists — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f4f4f5 0%, #d5def4 55%, #2563eb 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#09090b',
        accent: '#2563eb',
        surface: '#f4f4f5',
        text: '#18181b',
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
          eyebrow: l('Iconography Specialist'),
          headline: l('Making brands unmistakable.'),
          subheadline: l('Working across editorial commissions, consumer packaging and interactive product launches.'),
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
          body: l('Working across editorial commissions, consumer packaging and interactive product launches. Based in Hyderabad, working with teams worldwide.'),
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
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Every single concept arrived with personality, polish and zero clichés.'),
              author: l('Tara Singh'),
              role: l('Founder, Kaveri Roasters'),
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
    id: 'creative-15',
    name: 'Ink Splash',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Charcoal Amber dark theme for concept artists — Outfit headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fffbeb',
        accent: '#fbbf24',
        surface: '#100e0a',
        text: '#ede5ce',
        fontHeading: 'Outfit',
        fontBody: 'Georgia',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Concept Artist'),
          headline: l('Playful rigor across print, 3D and motion.'),
          subheadline: l('Bringing warmth, wit and tactile detail to digital-first companies.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#contact-6',
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
          body: l('Bringing warmth, wit and tactile detail to digital-first companies. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Motion Systems', 'Rive / Lottie', 'Character Design', 'Print Production'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
            },
            {
              title: l('Kaveri Craft Roasters'),
              description: l('Illustrated tin packaging, custom display lettering and tactile retail unboxing system.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Packaging', 'Illustration'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'creative-16',
    name: 'Mosaic Mind',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Cream Burgundy light theme for surface pattern designers — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #fcf8f2 0%, #eed5d6 55%, #9f1239 140%)',
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
          eyebrow: l('Surface Pattern Designer'),
          headline: l('Your Name'),
          subheadline: l('Multidisciplinary creative studio crafting expressive brand identities, bespoke illustrations and motion systems.'),
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
          body: l('Multidisciplinary creative studio crafting expressive brand identities, bespoke illustrations and motion systems. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Kaveri Craft Roasters'),
              description: l('Illustrated tin packaging, custom display lettering and tactile retail unboxing system.'),
              url: '',
              imageUrl: '',
              tags: ['Packaging', 'Illustration'],
            },
            {
              title: l('Launch Film & Motion Kit'),
              description: l('90-second 3D product launch film and modular Lottie animation library.'),
              url: '',
              imageUrl: '',
              tags: ['Motion', '3D'],
            },
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: '',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
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
              quote: l('Every single concept arrived with personality, polish and zero clichés.'),
              author: l('Tara Singh'),
              role: l('Founder, Kaveri Roasters'),
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
    id: 'creative-17',
    name: 'Pattern House',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Apricot Cream light theme for experiential designers — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fff4ec 0%, #f6d9ca 55%, #c2410c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#26160e',
        accent: '#c2410c',
        surface: '#fff4ec',
        text: '#362218',
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
          eyebrow: l('Experiential Designer'),
          headline: l('Visual worlds built with hand and code.'),
          subheadline: l('Working across editorial commissions, consumer packaging and interactive product launches.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#contact-6',
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
              title: l('Launch Film & Motion Kit'),
              description: l('90-second 3D product launch film and modular Lottie animation library.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Motion', '3D'],
            },
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Packaging Design', 'Custom Lettering', 'Art Direction', 'Cinema 4D'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Every single concept arrived with personality, polish and zero clichés.'),
              author: l('Tara Singh'),
              role: l('Founder, Kaveri Roasters'),
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'creative-18',
    name: 'Daydream',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Cyber Magenta light theme for stop-motion directors — Outfit headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #faf5ff 0%, #f1d6f8 55%, #c026d3 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0c',
        accent: '#c026d3',
        surface: '#faf5ff',
        text: '#16121a',
        fontHeading: 'Outfit',
        fontBody: 'Georgia',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Stop-Motion Director'),
          headline: l('Ideas you can feel at first glance.'),
          subheadline: l('Bringing warmth, wit and tactile detail to digital-first companies.'),
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
          body: l('Bringing warmth, wit and tactile detail to digital-first companies. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Specialties'),
          items: ['Motion Systems', 'Rive / Lottie', 'Character Design', 'Print Production'],
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
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: '',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
            },
            {
              title: l('Kaveri Craft Roasters'),
              description: l('Illustrated tin packaging, custom display lettering and tactile retail unboxing system.'),
              url: '',
              imageUrl: '',
              tags: ['Packaging', 'Illustration'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'creative-19',
    name: 'Craft Bench',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Velvet Rose dark theme for brand mascot creators — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
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
          eyebrow: l('Brand Mascot Creator'),
          headline: l('Color, form and stories that stick.'),
          subheadline: l('Multidisciplinary creative studio crafting expressive brand identities, bespoke illustrations and motion systems.'),
          primaryCtaLabel: l('See projects'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Brand Identity', 'Editorial Illustration', 'After Effects', 'Blender 3D'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Kaveri Craft Roasters'),
              description: l('Illustrated tin packaging, custom display lettering and tactile retail unboxing system.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Packaging', 'Illustration'],
            },
            {
              title: l('Launch Film & Motion Kit'),
              description: l('90-second 3D product launch film and modular Lottie animation library.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Motion', '3D'],
            },
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
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
              role: l('Independent Creative Director'),
              company: l('Studio Polychrome'),
              period: l('2021 — Present'),
              description: l('Collaborating with consumer brands, publishers and startups worldwide.'),
            },
            {
              role: l('Senior Brand Designer'),
              company: l('Tangerine Agency'),
              period: l('2018 — 2021'),
              description: l('Led visual identity and illustration campaigns.'),
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
              quote: l('Every single concept arrived with personality, polish and zero clichés.'),
              author: l('Tara Singh'),
              role: l('Founder, Kaveri Roasters'),
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'creative-20',
    name: 'Playbook',
    category: 'creative',
    family: 'Creative Studio',
    audience: ['designer', 'illustrator', 'animator'],
    description: 'Oatmeal Forest light theme for multidisciplinary makers — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f9f5ec 0%, #d7e3d2 55%, #15803d 140%)',
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
          eyebrow: l('Multidisciplinary Maker'),
          headline: l('Making brands unmistakable.'),
          subheadline: l('Working across editorial commissions, consumer packaging and interactive product launches.'),
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
          body: l('Working across editorial commissions, consumer packaging and interactive product launches. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Independent Creative Director'),
              company: l('Studio Polychrome'),
              period: l('2021 — Present'),
              description: l('Collaborating with consumer brands, publishers and startups worldwide.'),
            },
            {
              role: l('Senior Brand Designer'),
              company: l('Tangerine Agency'),
              period: l('2018 — 2021'),
              description: l('Led visual identity and illustration campaigns.'),
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
              degree: l('B.Des. Graphic Design'),
              school: l('MIT Institute of Design, Pune'),
              period: l('2014 — 2018'),
              description: l('Illustration, typography and motion studies.'),
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
              title: l('Launch Film & Motion Kit'),
              description: l('90-second 3D product launch film and modular Lottie animation library.'),
              url: '',
              imageUrl: '',
              tags: ['Motion', '3D'],
            },
            {
              title: l('City Transit Wayfinding Murals'),
              description: l('Series of 6 large-scale illustrated civic murals celebrating neighborhood heritage.'),
              url: '',
              imageUrl: '',
              tags: ['Mural', 'Public Art'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
];
