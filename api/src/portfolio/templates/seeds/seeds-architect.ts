// Auto-generated template seeds — Architecture Spatial (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_ARCHITECT: SeedTemplate[] = [
  {
    id: 'architect-01',
    name: 'Blueprint Line',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Alabaster Cobalt light theme for principal architects — Outfit headings with split-media hero and comfortable spacing.',
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
        variant: 'split-media',
        props: {
          eyebrow: l('Principal Architect'),
          headline: l('Space, light, quiet permanence.'),
          subheadline: l('Architectural and interior practice grounded in passive cooling, local materials and honest structural expression.'),
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
          body: l('Architectural and interior practice grounded in passive cooling, local materials and honest structural expression. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Architectural Design', 'Passive Climate Strategy', 'Revit / Rhino', 'Site Supervision'],
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
              title: l('Laterite Courtyard House'),
              description: l('Zero-AC coastal residence using cross-ventilated verandas and hand-dressed laterite.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Residential', 'Passive'],
            },
            {
              title: l('Bamboo & Timber Library'),
              description: l('Community reading pavilion spanning 18m with prefabricated engineered bamboo trusses.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Cultural', 'Timber'],
            },
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
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
    id: 'architect-02',
    name: 'Concrete Plinth',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Vellum Rust light theme for interior architects — Georgia headings with editorial hero and compact spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Interior Architect'),
          headline: l('Your Name'),
          subheadline: l('Completed 28 residential, cultural and boutique hospitality projects across coastal and urban India.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Material Specification', 'Bespoke Joinery', 'Daylight Modeling', 'Conservation'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Bamboo & Timber Library'),
              description: l('Community reading pavilion spanning 18m with prefabricated engineered bamboo trusses.'),
              url: '',
              imageUrl: '',
              tags: ['Cultural', 'Timber'],
            },
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: '',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
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
              role: l('Founding Partner'),
              company: l('Axis & Earth Architects'),
              period: l('2020 — Present'),
              description: l('Leading residential, civic and hospitality commissions from concept to handover.'),
            },
            {
              role: l('Project Architect'),
              company: l('Studio Vastu'),
              period: l('2016 — 2020'),
              description: l('Managed detailing and construction administration for institutional campuses.'),
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
              quote: l('Transformed a tight urban plot into a serene sanctuary filled with natural breeze and light.'),
              author: l('Kavita & Dev Malhotra'),
              role: l('Homeowners'),
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
    id: 'architect-03',
    name: 'Daylight Atrium',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Obsidian Emerald dark theme for sustainable building leads — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
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
          eyebrow: l('Sustainable Building Lead'),
          headline: l('Architecture shaped by climate and craft.'),
          subheadline: l('Every project begins with sun paths, wind orientation and how daily life unfolds inside the room.'),
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Every project begins with sun paths, wind orientation and how daily life unfolds inside the room. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Founding Partner'),
              company: l('Axis & Earth Architects'),
              period: l('2020 — Present'),
              description: l('Leading residential, civic and hospitality commissions from concept to handover.'),
            },
            {
              role: l('Project Architect'),
              company: l('Studio Vastu'),
              period: l('2016 — 2020'),
              description: l('Managed detailing and construction administration for institutional campuses.'),
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
              degree: l('B.Arch. Architecture'),
              school: l('SPA New Delhi'),
              period: l('2011 — 2016'),
              description: l('Thesis medal in climate-responsive public architecture.'),
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
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
            },
            {
              title: l('Laterite Courtyard House'),
              description: l('Zero-AC coastal residence using cross-ventilated verandas and hand-dressed laterite.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Residential', 'Passive'],
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
    id: 'architect-04',
    name: 'Timber Span',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Porcelain Emerald light theme for urban designers — Outfit headings with split-media hero and compact spacing.',
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
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Urban Designer'),
          headline: l('Designing places people want to linger in.'),
          subheadline: l('Architectural and interior practice grounded in passive cooling, local materials and honest structural expression.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Architectural Design', 'Passive Climate Strategy', 'Revit / Rhino', 'Site Supervision'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Founding Partner'),
              company: l('Axis & Earth Architects'),
              period: l('2020 — Present'),
              description: l('Leading residential, civic and hospitality commissions from concept to handover.'),
            },
            {
              role: l('Project Architect'),
              company: l('Studio Vastu'),
              period: l('2016 — 2020'),
              description: l('Managed detailing and construction administration for institutional campuses.'),
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
              title: l('Laterite Courtyard House'),
              description: l('Zero-AC coastal residence using cross-ventilated verandas and hand-dressed laterite.'),
              url: '',
              imageUrl: '',
              tags: ['Residential', 'Passive'],
            },
            {
              title: l('Bamboo & Timber Library'),
              description: l('Community reading pavilion spanning 18m with prefabricated engineered bamboo trusses.'),
              url: '',
              imageUrl: '',
              tags: ['Cultural', 'Timber'],
            },
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: '',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
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
    id: 'architect-05',
    name: 'Raw Elevation',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Newsprint Navy light theme for landscape architects — Georgia headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Landscape Architect'),
          headline: l('Your Name'),
          subheadline: l('Completed 28 residential, cultural and boutique hospitality projects across coastal and urban India.'),
          primaryCtaLabel: l('Explore portfolio'),
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
              title: l('Bamboo & Timber Library'),
              description: l('Community reading pavilion spanning 18m with prefabricated engineered bamboo trusses.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Cultural', 'Timber'],
            },
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Completed 28 residential, cultural and boutique hospitality projects across coastal and urban India. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Founding Partner'),
              company: l('Axis & Earth Architects'),
              period: l('2020 — Present'),
              description: l('Leading residential, civic and hospitality commissions from concept to handover.'),
            },
            {
              role: l('Project Architect'),
              company: l('Studio Vastu'),
              period: l('2016 — 2020'),
              description: l('Managed detailing and construction administration for institutional campuses.'),
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
    id: 'architect-06',
    name: 'Section Cut',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Midnight Cobalt dark theme for industrial & furniture designers — System headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Industrial & Furniture Designer'),
          headline: l('Climate-responsive spaces in stone, timber and light.'),
          subheadline: l('Every project begins with sun paths, wind orientation and how daily life unfolds inside the room.'),
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
          title: l('About'),
          body: l('Every project begins with sun paths, wind orientation and how daily life unfolds inside the room. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: '',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
            },
            {
              title: l('Laterite Courtyard House'),
              description: l('Zero-AC coastal residence using cross-ventilated verandas and hand-dressed laterite.'),
              url: '',
              imageUrl: '',
              tags: ['Residential', 'Passive'],
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
    id: 'architect-07',
    name: 'Courtyard Grid',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Chalk Vermilion light theme for heritage conservation architects — Outfit headings with split-media hero and comfortable spacing.',
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
        variant: 'split-media',
        props: {
          eyebrow: l('Heritage Conservation Architect'),
          headline: l('Space, light, quiet permanence.'),
          subheadline: l('Architectural and interior practice grounded in passive cooling, local materials and honest structural expression.'),
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
          body: l('Architectural and interior practice grounded in passive cooling, local materials and honest structural expression. Based in Jaipur, working with teams worldwide.'),
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
          title: l('Kind Words'),
          items: [
            {
              quote: l('Transformed a tight urban plot into a serene sanctuary filled with natural breeze and light.'),
              author: l('Kavita & Dev Malhotra'),
              role: l('Homeowners'),
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
    id: 'architect-08',
    name: 'Travertine',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Parchment Olive light theme for hospitality spatial designers — Georgia headings with editorial hero and compact spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Hospitality Spatial Designer'),
          headline: l('Your Name'),
          subheadline: l('Completed 28 residential, cultural and boutique hospitality projects across coastal and urban India.'),
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
          title: l('Practice'),
          body: l('Completed 28 residential, cultural and boutique hospitality projects across coastal and urban India. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Material Specification', 'Bespoke Joinery', 'Daylight Modeling', 'Conservation'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Bamboo & Timber Library'),
              description: l('Community reading pavilion spanning 18m with prefabricated engineered bamboo trusses.'),
              url: '',
              imageUrl: '',
              tags: ['Cultural', 'Timber'],
            },
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: '',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
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
    id: 'architect-09',
    name: 'Cantilever',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Abyssal Violet dark theme for computational designers — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f5f3ff',
        accent: '#a78bfa',
        surface: '#0b0917',
        text: '#e0daf8',
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
          eyebrow: l('Computational Designer'),
          headline: l('Architecture shaped by climate and craft.'),
          subheadline: l('Every project begins with sun paths, wind orientation and how daily life unfolds inside the room.'),
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Every project begins with sun paths, wind orientation and how daily life unfolds inside the room. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
            },
            {
              title: l('Laterite Courtyard House'),
              description: l('Zero-AC coastal residence using cross-ventilated verandas and hand-dressed laterite.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Residential', 'Passive'],
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
              quote: l('Transformed a tight urban plot into a serene sanctuary filled with natural breeze and light.'),
              author: l('Kavita & Dev Malhotra'),
              role: l('Homeowners'),
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
    id: 'architect-10',
    name: 'Scale 1:100',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Ice Indigo light theme for residential studios — Outfit headings with split-media hero and compact spacing.',
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
          eyebrow: l('Residential Studio'),
          headline: l('Designing places people want to linger in.'),
          subheadline: l('Architectural and interior practice grounded in passive cooling, local materials and honest structural expression.'),
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Laterite Courtyard House'),
              description: l('Zero-AC coastal residence using cross-ventilated verandas and hand-dressed laterite.'),
              url: '',
              imageUrl: '',
              tags: ['Residential', 'Passive'],
            },
            {
              title: l('Bamboo & Timber Library'),
              description: l('Community reading pavilion spanning 18m with prefabricated engineered bamboo trusses.'),
              url: '',
              imageUrl: '',
              tags: ['Cultural', 'Timber'],
            },
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: '',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Architectural Design', 'Passive Climate Strategy', 'Revit / Rhino', 'Site Supervision'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Transformed a tight urban plot into a serene sanctuary filled with natural breeze and light.'),
              author: l('Kavita & Dev Malhotra'),
              role: l('Homeowners'),
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
    id: 'architect-11',
    name: 'Passive House',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Cream Burgundy light theme for workplace strategists — Georgia headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Workplace Strategist'),
          headline: l('Your Name'),
          subheadline: l('Completed 28 residential, cultural and boutique hospitality projects across coastal and urban India.'),
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
          body: l('Completed 28 residential, cultural and boutique hospitality projects across coastal and urban India. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Material Specification', 'Bespoke Joinery', 'Daylight Modeling', 'Conservation'],
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
              title: l('Bamboo & Timber Library'),
              description: l('Community reading pavilion spanning 18m with prefabricated engineered bamboo trusses.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Cultural', 'Timber'],
            },
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
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
    id: 'architect-12',
    name: 'Steel Datum',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Charcoal Amber dark theme for lighting designers — System headings with centered hero and compact spacing.',
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
          eyebrow: l('Lighting Designer'),
          headline: l('Climate-responsive spaces in stone, timber and light.'),
          subheadline: l('Every project begins with sun paths, wind orientation and how daily life unfolds inside the room.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Urban Masterplanning', 'BIM Coordination', 'Interior Architecture', 'Landscape'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: '',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
            },
            {
              title: l('Laterite Courtyard House'),
              description: l('Zero-AC coastal residence using cross-ventilated verandas and hand-dressed laterite.'),
              url: '',
              imageUrl: '',
              tags: ['Residential', 'Passive'],
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
              role: l('Founding Partner'),
              company: l('Axis & Earth Architects'),
              period: l('2020 — Present'),
              description: l('Leading residential, civic and hospitality commissions from concept to handover.'),
            },
            {
              role: l('Project Architect'),
              company: l('Studio Vastu'),
              period: l('2016 — 2020'),
              description: l('Managed detailing and construction administration for institutional campuses.'),
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
              quote: l('Transformed a tight urban plot into a serene sanctuary filled with natural breeze and light.'),
              author: l('Kavita & Dev Malhotra'),
              role: l('Homeowners'),
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
    id: 'architect-13',
    name: 'Site Plan',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Linen Terracotta light theme for exhibition architects — Outfit headings with split-media hero and comfortable spacing.',
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
        variant: 'split-media',
        props: {
          eyebrow: l('Exhibition Architect'),
          headline: l('Space, light, quiet permanence.'),
          subheadline: l('Architectural and interior practice grounded in passive cooling, local materials and honest structural expression.'),
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Architectural and interior practice grounded in passive cooling, local materials and honest structural expression. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Founding Partner'),
              company: l('Axis & Earth Architects'),
              period: l('2020 — Present'),
              description: l('Leading residential, civic and hospitality commissions from concept to handover.'),
            },
            {
              role: l('Project Architect'),
              company: l('Studio Vastu'),
              period: l('2016 — 2020'),
              description: l('Managed detailing and construction administration for institutional campuses.'),
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
              degree: l('B.Arch. Architecture'),
              school: l('SPA New Delhi'),
              period: l('2011 — 2016'),
              description: l('Thesis medal in climate-responsive public architecture.'),
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
              title: l('Laterite Courtyard House'),
              description: l('Zero-AC coastal residence using cross-ventilated verandas and hand-dressed laterite.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Residential', 'Passive'],
            },
            {
              title: l('Bamboo & Timber Library'),
              description: l('Community reading pavilion spanning 18m with prefabricated engineered bamboo trusses.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Cultural', 'Timber'],
            },
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
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
    id: 'architect-14',
    name: 'Studio Module',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Oatmeal Forest light theme for timber & earth builders — Georgia headings with editorial hero and compact spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Timber & Earth Builder'),
          headline: l('Your Name'),
          subheadline: l('Completed 28 residential, cultural and boutique hospitality projects across coastal and urban India.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Material Specification', 'Bespoke Joinery', 'Daylight Modeling', 'Conservation'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Founding Partner'),
              company: l('Axis & Earth Architects'),
              period: l('2020 — Present'),
              description: l('Leading residential, civic and hospitality commissions from concept to handover.'),
            },
            {
              role: l('Project Architect'),
              company: l('Studio Vastu'),
              period: l('2016 — 2020'),
              description: l('Managed detailing and construction administration for institutional campuses.'),
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
              title: l('Bamboo & Timber Library'),
              description: l('Community reading pavilion spanning 18m with prefabricated engineered bamboo trusses.'),
              url: '',
              imageUrl: '',
              tags: ['Cultural', 'Timber'],
            },
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: '',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
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
    id: 'architect-15',
    name: 'Stone & Glass',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Velvet Rose dark theme for retail environment designers — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
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
          eyebrow: l('Retail Environment Designer'),
          headline: l('Architecture shaped by climate and craft.'),
          subheadline: l('Every project begins with sun paths, wind orientation and how daily life unfolds inside the room.'),
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
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
            },
            {
              title: l('Laterite Courtyard House'),
              description: l('Zero-AC coastal residence using cross-ventilated verandas and hand-dressed laterite.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Residential', 'Passive'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Every project begins with sun paths, wind orientation and how daily life unfolds inside the room. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Founding Partner'),
              company: l('Axis & Earth Architects'),
              period: l('2020 — Present'),
              description: l('Leading residential, civic and hospitality commissions from concept to handover.'),
            },
            {
              role: l('Project Architect'),
              company: l('Studio Vastu'),
              period: l('2016 — 2020'),
              description: l('Managed detailing and construction administration for institutional campuses.'),
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
    id: 'architect-16',
    name: 'Soffit',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Nordic Spruce light theme for facade engineers — Outfit headings with split-media hero and compact spacing.',
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
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Facade Engineer'),
          headline: l('Designing places people want to linger in.'),
          subheadline: l('Architectural and interior practice grounded in passive cooling, local materials and honest structural expression.'),
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
          title: l('About'),
          body: l('Architectural and interior practice grounded in passive cooling, local materials and honest structural expression. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Laterite Courtyard House'),
              description: l('Zero-AC coastal residence using cross-ventilated verandas and hand-dressed laterite.'),
              url: '',
              imageUrl: '',
              tags: ['Residential', 'Passive'],
            },
            {
              title: l('Bamboo & Timber Library'),
              description: l('Community reading pavilion spanning 18m with prefabricated engineered bamboo trusses.'),
              url: '',
              imageUrl: '',
              tags: ['Cultural', 'Timber'],
            },
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: '',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
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
    id: 'architect-17',
    name: 'Urban Grain',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Saffron Ink light theme for civic infrastructure planners — Georgia headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Civic Infrastructure Planner'),
          headline: l('Your Name'),
          subheadline: l('Completed 28 residential, cultural and boutique hospitality projects across coastal and urban India.'),
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
          body: l('Completed 28 residential, cultural and boutique hospitality projects across coastal and urban India. Based in Madurai, working with teams worldwide.'),
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
              quote: l('Transformed a tight urban plot into a serene sanctuary filled with natural breeze and light.'),
              author: l('Kavita & Dev Malhotra'),
              role: l('Homeowners'),
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
    id: 'architect-18',
    name: 'Horizon Axis',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Deep Teal dark theme for acoustic spatial designers — System headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Acoustic Spatial Designer'),
          headline: l('Climate-responsive spaces in stone, timber and light.'),
          subheadline: l('Every project begins with sun paths, wind orientation and how daily life unfolds inside the room.'),
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
          title: l('Practice'),
          body: l('Every project begins with sun paths, wind orientation and how daily life unfolds inside the room. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Urban Masterplanning', 'BIM Coordination', 'Interior Architecture', 'Landscape'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: '',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
            },
            {
              title: l('Laterite Courtyard House'),
              description: l('Zero-AC coastal residence using cross-ventilated verandas and hand-dressed laterite.'),
              url: '',
              imageUrl: '',
              tags: ['Residential', 'Passive'],
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
    id: 'architect-19',
    name: 'Limestone',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Cloud Plum light theme for modular housing architects — Outfit headings with split-media hero and comfortable spacing.',
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
        variant: 'split-media',
        props: {
          eyebrow: l('Modular Housing Architect'),
          headline: l('Space, light, quiet permanence.'),
          subheadline: l('Architectural and interior practice grounded in passive cooling, local materials and honest structural expression.'),
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Architectural and interior practice grounded in passive cooling, local materials and honest structural expression. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Laterite Courtyard House'),
              description: l('Zero-AC coastal residence using cross-ventilated verandas and hand-dressed laterite.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Residential', 'Passive'],
            },
            {
              title: l('Bamboo & Timber Library'),
              description: l('Community reading pavilion spanning 18m with prefabricated engineered bamboo trusses.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Cultural', 'Timber'],
            },
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
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
              quote: l('Transformed a tight urban plot into a serene sanctuary filled with natural breeze and light.'),
              author: l('Kavita & Dev Malhotra'),
              role: l('Homeowners'),
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
    id: 'architect-20',
    name: 'Drafting Table',
    category: 'architect',
    family: 'Architecture Spatial',
    audience: ['architect', 'designer', 'planner'],
    description: 'Sepia Slate light theme for design-build partners — Georgia headings with editorial hero and compact spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Design-Build Partner'),
          headline: l('Your Name'),
          subheadline: l('Completed 28 residential, cultural and boutique hospitality projects across coastal and urban India.'),
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Bamboo & Timber Library'),
              description: l('Community reading pavilion spanning 18m with prefabricated engineered bamboo trusses.'),
              url: '',
              imageUrl: '',
              tags: ['Cultural', 'Timber'],
            },
            {
              title: l('Heritage Mill Adaptive Reuse'),
              description: l('Converted a 1920s textile warehouse into light-filled studios and public courtyard.'),
              url: '',
              imageUrl: '',
              tags: ['Adaptive Reuse', 'Urban'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Material Specification', 'Bespoke Joinery', 'Daylight Modeling', 'Conservation'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Transformed a tight urban plot into a serene sanctuary filled with natural breeze and light.'),
              author: l('Kavita & Dev Malhotra'),
              role: l('Homeowners'),
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
