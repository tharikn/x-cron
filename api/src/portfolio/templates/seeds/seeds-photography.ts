// Auto-generated template seeds — Photography Focus (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_PHOTOGRAPHY: SeedTemplate[] = [
  {
    id: 'photography-02',
    name: 'Darkroom Plate',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Obsidian Emerald dark theme for portrait photographers — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
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
          eyebrow: l('Portrait Photographer'),
          headline: l('Your Name'),
          subheadline: l('Commissioned editorial portraits, architectural studies and long-term documentary work across India and Southeast Asia.'),
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
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
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
              title: l('Monsoon Coastlines'),
              description: l('Three-year documentary monograph photographing fishing cooperatives from Kochi to Goa.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Documentary', 'Monograph'],
            },
            {
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Commissioned editorial portraits, architectural studies and long-term documentary work across India and Southeast Asia. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Independent Photographer'),
              company: l('Commissioned & Editorial'),
              period: l('2019 — Present'),
              description: l('Published in Monocle, Architectural Digest India and The Caravan.'),
            },
            {
              role: l('First Assistant'),
              company: l('Studio Prism'),
              period: l('2017 — 2019'),
              description: l('Lighting, medium-format capture and set production for commercial campaigns.'),
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
    id: 'photography-03',
    name: 'Aperture 1.4',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Vellum Rust light theme for documentary photographers — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #faf4ea 0%, #eed9cb 55%, #a8431a 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261a12',
        accent: '#a8431a',
        surface: '#faf4ea',
        text: '#33241b',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Documentary Photographer'),
          headline: l('Quiet observations of everyday light.'),
          subheadline: l('Working on 120 film and digital medium format for magazines, cultural institutions and design studios.'),
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
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
            },
            {
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Profile'),
          body: l('Working on 120 film and digital medium format for magazines, cultural institutions and design studios. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: '',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
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
          location: l('Madurai, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'photography-04',
    name: 'Silver Gelatin',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Alabaster Cobalt light theme for editorial & fashion photographers — Outfit headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Editorial & Fashion Photographer'),
          headline: l('Human stories on medium format.'),
          subheadline: l('Capturing unscripted human presence with natural light and minimal post-production.'),
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
          body: l('Capturing unscripted human presence with natural light and minimal post-production. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Selected Frames'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
            },
            {
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            },
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
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
              quote: l('Puts every subject at ease within five minutes and delivers frames with soul.'),
              author: l('Nandita Dasgupta'),
              role: l('Photo Editor'),
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
    id: 'photography-05',
    name: 'Golden Hour',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Midnight Cobalt dark theme for architectural photographers — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eff6ff',
        accent: '#60a5fa',
        surface: '#070b16',
        text: '#d8e4f8',
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
          eyebrow: l('Architectural Photographer'),
          headline: l('Portraits, places and honest frames.'),
          subheadline: l('Commissioned editorial portraits, architectural studies and long-term documentary work across India and Southeast Asia.'),
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
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            },
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Overview'),
          body: l('Commissioned editorial portraits, architectural studies and long-term documentary work across India and Southeast Asia. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Medium Format', 'Editorial Portraiture', 'Natural Light', 'Color Grading'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Monsoon Coastlines'),
              description: l('Three-year documentary monograph photographing fishing cooperatives from Kochi to Goa.'),
              url: '',
              imageUrl: '',
              tags: ['Documentary', 'Monograph'],
            },
            {
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: '',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
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
          location: l('Jaipur, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'photography-06',
    name: 'Viewfinder',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Newsprint Navy light theme for fine art photographers — Fraunces headings with editorial hero and comfortable spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Fine Art Photographer'),
          headline: l('Seeing the stillness inside motion.'),
          subheadline: l('Working on 120 film and digital medium format for magazines, cultural institutions and design studios.'),
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
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Working on 120 film and digital medium format for magazines, cultural institutions and design studios. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
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
              quote: l('Puts every subject at ease within five minutes and delivers frames with soul.'),
              author: l('Nandita Dasgupta'),
              role: l('Photo Editor'),
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
    id: 'photography-07',
    name: 'Focal Length',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Porcelain Emerald light theme for commercial still-life artists — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
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
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Commercial Still-Life Artist'),
          headline: l('Light, shadow and patient framing.'),
          subheadline: l('Capturing unscripted human presence with natural light and minimal post-production.'),
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
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
            },
            {
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
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
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
            },
            {
              title: l('Monsoon Coastlines'),
              description: l('Three-year documentary monograph photographing fishing cooperatives from Kochi to Goa.'),
              url: '',
              imageUrl: '',
              tags: ['Documentary', 'Monograph'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Documentary Storytelling', 'Studio Strobe', 'Tethered Capture', 'Archival Framing'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Puts every subject at ease within five minutes and delivers frames with soul.'),
              author: l('Nandita Dasgupta'),
              role: l('Photo Editor'),
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
          location: l('Madurai, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'photography-08',
    name: 'Light Leak',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Abyssal Violet dark theme for travel & culture photographers — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
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
        variant: 'split-media',
        props: {
          eyebrow: l('Travel & Culture Photographer'),
          headline: l('Your Name'),
          subheadline: l('Commissioned editorial portraits, architectural studies and long-term documentary work across India and Southeast Asia.'),
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
          body: l('Commissioned editorial portraits, architectural studies and long-term documentary work across India and Southeast Asia. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Core Stack'),
          items: ['Medium Format', 'Editorial Portraiture', 'Natural Light', 'Color Grading'],
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Selected Frames'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
            },
            {
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            },
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
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
              title: l('Monsoon Coastlines'),
              description: l('Three-year documentary monograph photographing fishing cooperatives from Kochi to Goa.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Documentary', 'Monograph'],
            },
            {
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
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
          location: l('Bengaluru, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'photography-09',
    name: 'Medium Format',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Parchment Olive light theme for director of photographys — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f8f5ea 0%, #e1e0cc 55%, #5c6b24 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1f2314',
        accent: '#5c6b24',
        surface: '#f8f5ea',
        text: '#2c301e',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Director of Photography'),
          headline: l('Quiet observations of everyday light.'),
          subheadline: l('Working on 120 film and digital medium format for magazines, cultural institutions and design studios.'),
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
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            },
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Architectural Framing', 'Darkroom Printing', 'Art Direction', 'Location Scouting'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: '',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
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
              role: l('Independent Photographer'),
              company: l('Commissioned & Editorial'),
              period: l('2019 — Present'),
              description: l('Published in Monocle, Architectural Digest India and The Caravan.'),
            },
            {
              role: l('First Assistant'),
              company: l('Studio Prism'),
              period: l('2017 — 2019'),
              description: l('Lighting, medium-format capture and set production for commercial campaigns.'),
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
              quote: l('Puts every subject at ease within five minutes and delivers frames with soul.'),
              author: l('Nandita Dasgupta'),
              role: l('Photo Editor'),
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
          location: l('Jaipur, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'photography-10',
    name: 'Grain & Shadow',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Chalk Vermilion light theme for photojournalists — Outfit headings with centered hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Photojournalist'),
          headline: l('Human stories on medium format.'),
          subheadline: l('Capturing unscripted human presence with natural light and minimal post-production.'),
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
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Capturing unscripted human presence with natural light and minimal post-production. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Independent Photographer'),
              company: l('Commissioned & Editorial'),
              period: l('2019 — Present'),
              description: l('Published in Monocle, Architectural Digest India and The Caravan.'),
            },
            {
              role: l('First Assistant'),
              company: l('Studio Prism'),
              period: l('2017 — 2019'),
              description: l('Lighting, medium-format capture and set production for commercial campaigns.'),
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
              degree: l('Diploma in Documentary Photography'),
              school: l('Light & Life Academy'),
              period: l('2016 — 2017'),
              description: l('Fine art printing and visual narrative.'),
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
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
            },
            {
              title: l('Monsoon Coastlines'),
              description: l('Three-year documentary monograph photographing fishing cooperatives from Kochi to Goa.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Documentary', 'Monograph'],
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
          location: l('Goa, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'photography-11',
    name: 'Safelight',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Charcoal Amber dark theme for analog film photographers — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fffbeb',
        accent: '#fbbf24',
        surface: '#100e0a',
        text: '#ede5ce',
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
          eyebrow: l('Analog Film Photographer'),
          headline: l('Portraits, places and honest frames.'),
          subheadline: l('Commissioned editorial portraits, architectural studies and long-term documentary work across India and Southeast Asia.'),
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
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
            },
            {
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Medium Format', 'Editorial Portraiture', 'Natural Light', 'Color Grading'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Independent Photographer'),
              company: l('Commissioned & Editorial'),
              period: l('2019 — Present'),
              description: l('Published in Monocle, Architectural Digest India and The Caravan.'),
            },
            {
              role: l('First Assistant'),
              company: l('Studio Prism'),
              period: l('2017 — 2019'),
              description: l('Lighting, medium-format capture and set production for commercial campaigns.'),
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
              title: l('Monsoon Coastlines'),
              description: l('Three-year documentary monograph photographing fishing cooperatives from Kochi to Goa.'),
              url: '',
              imageUrl: '',
              tags: ['Documentary', 'Monograph'],
            },
            {
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: '',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
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
    id: 'photography-12',
    name: 'Cyanotype',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Cream Burgundy light theme for wedding & intimate documentarys — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fcf8f2 0%, #eed5d6 55%, #9f1239 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#281217',
        accent: '#9f1239',
        surface: '#fcf8f2',
        text: '#381d23',
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
          eyebrow: l('Wedding & Intimate Documentary'),
          headline: l('Seeing the stillness inside motion.'),
          subheadline: l('Working on 120 film and digital medium format for magazines, cultural institutions and design studios.'),
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
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
            },
            {
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            },
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
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
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Working on 120 film and digital medium format for magazines, cultural institutions and design studios. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Independent Photographer'),
              company: l('Commissioned & Editorial'),
              period: l('2019 — Present'),
              description: l('Published in Monocle, Architectural Digest India and The Caravan.'),
            },
            {
              role: l('First Assistant'),
              company: l('Studio Prism'),
              period: l('2017 — 2019'),
              description: l('Lighting, medium-format capture and set production for commercial campaigns.'),
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
    id: 'photography-13',
    name: 'Contact Sheet',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Ice Indigo light theme for environmental portraitists — Outfit headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Environmental Portraitist'),
          headline: l('Light, shadow and patient framing.'),
          subheadline: l('Capturing unscripted human presence with natural light and minimal post-production.'),
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
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            },
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Profile'),
          body: l('Capturing unscripted human presence with natural light and minimal post-production. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
            },
            {
              title: l('Monsoon Coastlines'),
              description: l('Three-year documentary monograph photographing fishing cooperatives from Kochi to Goa.'),
              url: '',
              imageUrl: '',
              tags: ['Documentary', 'Monograph'],
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
          location: l('Jaipur, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'photography-14',
    name: 'Shutter Speed',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Velvet Rose dark theme for street photographers — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
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
          eyebrow: l('Street Photographer'),
          headline: l('Your Name'),
          subheadline: l('Commissioned editorial portraits, architectural studies and long-term documentary work across India and Southeast Asia.'),
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
          body: l('Commissioned editorial portraits, architectural studies and long-term documentary work across India and Southeast Asia. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Gallery'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
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
              quote: l('Puts every subject at ease within five minutes and delivers frames with soul.'),
              author: l('Nandita Dasgupta'),
              role: l('Photo Editor'),
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
    id: 'photography-15',
    name: 'Monochrome Lab',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Oatmeal Forest light theme for product & brand photographers — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f9f5ec 0%, #d7e3d2 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#142219',
        accent: '#15803d',
        surface: '#f9f5ec',
        text: '#213026',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Product & Brand Photographer'),
          headline: l('Quiet observations of everyday light.'),
          subheadline: l('Working on 120 film and digital medium format for magazines, cultural institutions and design studios.'),
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
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
            },
            {
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Overview'),
          body: l('Working on 120 film and digital medium format for magazines, cultural institutions and design studios. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Architectural Framing', 'Darkroom Printing', 'Art Direction', 'Location Scouting'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: '',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
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
          location: l('Madurai, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'photography-16',
    name: 'Depth of Field',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Linen Terracotta light theme for sports & motion photographers — Outfit headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Sports & Motion Photographer'),
          headline: l('Human stories on medium format.'),
          subheadline: l('Capturing unscripted human presence with natural light and minimal post-production.'),
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
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
            },
            {
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            },
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Capturing unscripted human presence with natural light and minimal post-production. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
            },
            {
              title: l('Monsoon Coastlines'),
              description: l('Three-year documentary monograph photographing fishing cooperatives from Kochi to Goa.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Documentary', 'Monograph'],
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
              quote: l('Puts every subject at ease within five minutes and delivers frames with soul.'),
              author: l('Nandita Dasgupta'),
              role: l('Photo Editor'),
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
    id: 'photography-17',
    name: 'Tungsten Still',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Deep Teal dark theme for wildlife & conservationists — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f0fdfa',
        accent: '#2dd4bf',
        surface: '#071112',
        text: '#cce8e4',
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
          eyebrow: l('Wildlife & Conservationist'),
          headline: l('Portraits, places and honest frames.'),
          subheadline: l('Commissioned editorial portraits, architectural studies and long-term documentary work across India and Southeast Asia.'),
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
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            },
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
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
              title: l('Monsoon Coastlines'),
              description: l('Three-year documentary monograph photographing fishing cooperatives from Kochi to Goa.'),
              url: '',
              imageUrl: '',
              tags: ['Documentary', 'Monograph'],
            },
            {
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: '',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Medium Format', 'Editorial Portraiture', 'Natural Light', 'Color Grading'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Puts every subject at ease within five minutes and delivers frames with soul.'),
              author: l('Nandita Dasgupta'),
              role: l('Photo Editor'),
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
          location: l('Jaipur, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'photography-18',
    name: 'Rangefinder',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Saffron Ink light theme for concert & tour photographers — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fdf9ef 0%, #f2e0cd 55%, #b45309 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#23190c',
        accent: '#b45309',
        surface: '#fdf9ef',
        text: '#332514',
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
          eyebrow: l('Concert & Tour Photographer'),
          headline: l('Seeing the stillness inside motion.'),
          subheadline: l('Working on 120 film and digital medium format for magazines, cultural institutions and design studios.'),
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
          body: l('Working on 120 film and digital medium format for magazines, cultural institutions and design studios. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Core Stack'),
          items: ['Architectural Framing', 'Darkroom Printing', 'Art Direction', 'Location Scouting'],
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Gallery'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
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
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
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
          location: l('Goa, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'photography-19',
    name: 'Chiaroscuro',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Nordic Spruce light theme for culinary & editorial photographers — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f4fafa 0%, #d2e7e7 55%, #0e7c7b 140%)',
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
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Culinary & Editorial Photographer'),
          headline: l('Light, shadow and patient framing.'),
          subheadline: l('Capturing unscripted human presence with natural light and minimal post-production.'),
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
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
            },
            {
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Documentary Storytelling', 'Studio Strobe', 'Tethered Capture', 'Archival Framing'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
            },
            {
              title: l('Monsoon Coastlines'),
              description: l('Three-year documentary monograph photographing fishing cooperatives from Kochi to Goa.'),
              url: '',
              imageUrl: '',
              tags: ['Documentary', 'Monograph'],
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
              role: l('Independent Photographer'),
              company: l('Commissioned & Editorial'),
              period: l('2019 — Present'),
              description: l('Published in Monocle, Architectural Digest India and The Caravan.'),
            },
            {
              role: l('First Assistant'),
              company: l('Studio Prism'),
              period: l('2017 — 2019'),
              description: l('Lighting, medium-format capture and set production for commercial campaigns.'),
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
              quote: l('Puts every subject at ease within five minutes and delivers frames with soul.'),
              author: l('Nandita Dasgupta'),
              role: l('Photo Editor'),
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
          location: l('Madurai, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'photography-20',
    name: 'Raw Exposure',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Smoked Tangerine dark theme for underwater visual artists — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #120c08 0%, #452913 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff7ed',
        accent: '#fb923c',
        surface: '#120c08',
        text: '#f0dfd1',
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
          eyebrow: l('Underwater Visual Artist'),
          headline: l('Your Name'),
          subheadline: l('Commissioned editorial portraits, architectural studies and long-term documentary work across India and Southeast Asia.'),
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
              url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
              alt: l('Photographer silhouette at golden hour'),
              caption: l('Field commission'),
            },
            {
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            },
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Commissioned editorial portraits, architectural studies and long-term documentary work across India and Southeast Asia. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Independent Photographer'),
              company: l('Commissioned & Editorial'),
              period: l('2019 — Present'),
              description: l('Published in Monocle, Architectural Digest India and The Caravan.'),
            },
            {
              role: l('First Assistant'),
              company: l('Studio Prism'),
              period: l('2017 — 2019'),
              description: l('Lighting, medium-format capture and set production for commercial campaigns.'),
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
              degree: l('Diploma in Documentary Photography'),
              school: l('Light & Life Academy'),
              period: l('2016 — 2017'),
              description: l('Fine art printing and visual narrative.'),
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
              title: l('Monsoon Coastlines'),
              description: l('Three-year documentary monograph photographing fishing cooperatives from Kochi to Goa.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Documentary', 'Monograph'],
            },
            {
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
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
          location: l('Bengaluru, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'photography-21',
    name: 'Daylight Studio',
    category: 'photography',
    family: 'Photography Focus',
    audience: ['photographer', 'videographer', 'visual artist'],
    description: 'Sepia Slate light theme for studio lighting directors — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f5f0e6 0%, #e0d8cb 55%, #6b4f35 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1d1c1a',
        accent: '#6b4f35',
        surface: '#f5f0e6',
        text: '#2c2a26',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Studio Lighting Director'),
          headline: l('Quiet observations of everyday light.'),
          subheadline: l('Working on 120 film and digital medium format for magazines, cultural institutions and design studios.'),
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
              url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
              alt: l('Natural light studio portrait'),
              caption: l('Studio frame'),
            },
            {
              url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Editorial portrait in soft light'),
              caption: l('Portrait study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
              alt: l('Misty mountain valley at dawn'),
              caption: l('Highland study'),
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Architectural Framing', 'Darkroom Printing', 'Art Direction', 'Location Scouting'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Independent Photographer'),
              company: l('Commissioned & Editorial'),
              period: l('2019 — Present'),
              description: l('Published in Monocle, Architectural Digest India and The Caravan.'),
            },
            {
              role: l('First Assistant'),
              company: l('Studio Prism'),
              period: l('2017 — 2019'),
              description: l('Lighting, medium-format capture and set production for commercial campaigns.'),
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
              title: l('Makers of Jaipur'),
              description: l('Editorial portrait series commissioned for an international craft exhibition.'),
              url: '',
              imageUrl: '',
              tags: ['Editorial', 'Portraits'],
            },
            {
              title: l('Concrete & Timber'),
              description: l('Architectural study of tropical modernist residences across South India.'),
              url: '',
              imageUrl: '',
              tags: ['Architecture', 'Print'],
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
