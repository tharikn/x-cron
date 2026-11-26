// Auto-generated template seeds — Fashion Editorial (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_FASHION: SeedTemplate[] = [
  {
    id: 'fashion-01',
    name: 'Atelier Noir',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Vellum Rust light theme for fashion designers — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #faf4ea 0%, #eed9cb 55%, #a8431a 140%)',
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
        variant: 'centered',
        props: {
          eyebrow: l('Fashion Designer'),
          headline: l('Your Name'),
          subheadline: l('Independent womenswear and unisex designer working directly with artisan weaver clusters in Chanderi and Kutch.'),
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
          body: l('Independent womenswear and unisex designer working directly with artisan weaver clusters in Chanderi and Kutch. Based in Bengaluru, working with teams worldwide.'),
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
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Every garment carries unmistakable structure while feeling effortless on the body.'),
              author: l('Sonia Kapur'),
              role: l('Fashion Features Editor'),
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
    id: 'fashion-02',
    name: 'Silk Drape',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Obsidian Emerald dark theme for editorial & celebrity stylists — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
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
          eyebrow: l('Editorial & Celebrity Stylist'),
          headline: l('Contemporary silhouettes rooted in handloom craft.'),
          subheadline: l('Editorial styling and costume direction for print campaigns, music films and runway presentations.'),
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
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Profile'),
          body: l('Editorial styling and costume direction for print campaigns, music films and runway presentations. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Natural Dyeing', 'Zero-Waste Cutting', 'Tailoring', 'Costume Design'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Vogue India Editorial'),
              description: l('Styled 12-page coastal monochrome fashion story shot on 120 film.'),
              url: '',
              imageUrl: '',
              tags: ['Styling', 'Print'],
            },
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: '',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'fashion-03',
    name: 'Runway Edit',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Alabaster Cobalt light theme for textile & surface designers — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Textile & Surface Designer'),
          headline: l('Editorial styling with sculptural restraint.'),
          subheadline: l('Zero-waste pattern cutting meets modern architectural draping.'),
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
          title: l('Practice'),
          body: l('Zero-waste pattern cutting meets modern architectural draping. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
            },
            {
              title: l('Autumn Handloom Capsule'),
              description: l('18-piece zero-waste collection woven in organic cotton and wild tussar silk.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Runway', 'Handloom'],
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
              quote: l('Every garment carries unmistakable structure while feeling effortless on the body.'),
              author: l('Sonia Kapur'),
              role: l('Fashion Features Editor'),
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
    id: 'fashion-04',
    name: 'Lookbook 09',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Newsprint Navy light theme for creative fashion directors — Fraunces headings with centered hero and comfortable spacing.',
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
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Creative Fashion Director'),
          headline: l('Your Name'),
          subheadline: l('Independent womenswear and unisex designer working directly with artisan weaver clusters in Chanderi and Kutch.'),
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
              title: l('Autumn Handloom Capsule'),
              description: l('18-piece zero-waste collection woven in organic cotton and wild tussar silk.'),
              url: '',
              imageUrl: '',
              tags: ['Runway', 'Handloom'],
            },
            {
              title: l('Vogue India Editorial'),
              description: l('Styled 12-page coastal monochrome fashion story shot on 120 film.'),
              url: '',
              imageUrl: '',
              tags: ['Styling', 'Print'],
            },
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: '',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Draping & Patterning', 'Handloom Development', 'Editorial Styling', 'Lookbook Direction'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Every garment carries unmistakable structure while feeling effortless on the body.'),
              author: l('Sonia Kapur'),
              role: l('Fashion Features Editor'),
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'fashion-05',
    name: 'Haute Linen',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Midnight Cobalt dark theme for sustainable apparel leads — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
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
          eyebrow: l('Sustainable Apparel Lead'),
          headline: l('Slow textiles, sharp tailoring.'),
          subheadline: l('Editorial styling and costume direction for print campaigns, music films and runway presentations.'),
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
          body: l('Editorial styling and costume direction for print campaigns, music films and runway presentations. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Focus Areas'),
          items: ['Natural Dyeing', 'Zero-Waste Cutting', 'Tailoring', 'Costume Design'],
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Vogue India Editorial'),
              description: l('Styled 12-page coastal monochrome fashion story shot on 120 film.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Styling', 'Print'],
            },
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'fashion-06',
    name: 'Couture Fold',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Porcelain Emerald light theme for menswear tailors — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Menswear Tailor'),
          headline: l('Collections, lookbooks and costume direction.'),
          subheadline: l('Zero-waste pattern cutting meets modern architectural draping.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Collection Planning', 'Showroom Curation', 'Textile Sourcing', 'Trend Direction'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: '',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
            },
            {
              title: l('Autumn Handloom Capsule'),
              description: l('18-piece zero-waste collection woven in organic cotton and wild tussar silk.'),
              url: '',
              imageUrl: '',
              tags: ['Runway', 'Handloom'],
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
              role: l('Creative Director'),
              company: l('Maison Vana'),
              period: l('2021 — Present'),
              description: l('Showcased at Lakmé Fashion Week; stocked in Mumbai, Delhi and Tokyo.'),
            },
            {
              role: l('Senior Stylist'),
              company: l('Studio Editorial'),
              period: l('2018 — 2021'),
              description: l('Campaign styling for luxury jewelry, beauty and apparel houses.'),
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
              quote: l('Every garment carries unmistakable structure while feeling effortless on the body.'),
              author: l('Sonia Kapur'),
              role: l('Fashion Features Editor'),
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'fashion-07',
    name: 'Bespoke Loom',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Parchment Olive light theme for bridal & couture designers — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f8f5ea 0%, #e1e0cc 55%, #5c6b24 140%)',
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
        variant: 'centered',
        props: {
          eyebrow: l('Bridal & Couture Designer'),
          headline: l('Your Name'),
          subheadline: l('Independent womenswear and unisex designer working directly with artisan weaver clusters in Chanderi and Kutch.'),
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
          body: l('Independent womenswear and unisex designer working directly with artisan weaver clusters in Chanderi and Kutch. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Creative Director'),
              company: l('Maison Vana'),
              period: l('2021 — Present'),
              description: l('Showcased at Lakmé Fashion Week; stocked in Mumbai, Delhi and Tokyo.'),
            },
            {
              role: l('Senior Stylist'),
              company: l('Studio Editorial'),
              period: l('2018 — 2021'),
              description: l('Campaign styling for luxury jewelry, beauty and apparel houses.'),
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
              degree: l('B.Des. Fashion Design'),
              school: l('NIFT New Delhi'),
              period: l('2014 — 2018'),
              description: l('Awarded Best Textile Innovation Collection.'),
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
              title: l('Autumn Handloom Capsule'),
              description: l('18-piece zero-waste collection woven in organic cotton and wild tussar silk.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Runway', 'Handloom'],
            },
            {
              title: l('Vogue India Editorial'),
              description: l('Styled 12-page coastal monochrome fashion story shot on 120 film.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Styling', 'Print'],
            },
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'fashion-08',
    name: 'Velvet Seam',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Abyssal Violet dark theme for costume designers — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f5f3ff',
        accent: '#a78bfa',
        surface: '#0b0917',
        text: '#e0daf8',
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
          eyebrow: l('Costume Designer'),
          headline: l('Contemporary silhouettes rooted in handloom craft.'),
          subheadline: l('Editorial styling and costume direction for print campaigns, music films and runway presentations.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Natural Dyeing', 'Zero-Waste Cutting', 'Tailoring', 'Costume Design'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Creative Director'),
              company: l('Maison Vana'),
              period: l('2021 — Present'),
              description: l('Showcased at Lakmé Fashion Week; stocked in Mumbai, Delhi and Tokyo.'),
            },
            {
              role: l('Senior Stylist'),
              company: l('Studio Editorial'),
              period: l('2018 — 2021'),
              description: l('Campaign styling for luxury jewelry, beauty and apparel houses.'),
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
              title: l('Vogue India Editorial'),
              description: l('Styled 12-page coastal monochrome fashion story shot on 120 film.'),
              url: '',
              imageUrl: '',
              tags: ['Styling', 'Print'],
            },
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: '',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
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
    id: 'fashion-09',
    name: 'Resort Capsule',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Chalk Vermilion light theme for accessory & leather designers — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Accessory & Leather Designer'),
          headline: l('Editorial styling with sculptural restraint.'),
          subheadline: l('Zero-waste pattern cutting meets modern architectural draping.'),
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
            },
            {
              title: l('Autumn Handloom Capsule'),
              description: l('18-piece zero-waste collection woven in organic cotton and wild tussar silk.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Runway', 'Handloom'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Zero-waste pattern cutting meets modern architectural draping. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Creative Director'),
              company: l('Maison Vana'),
              period: l('2021 — Present'),
              description: l('Showcased at Lakmé Fashion Week; stocked in Mumbai, Delhi and Tokyo.'),
            },
            {
              role: l('Senior Stylist'),
              company: l('Studio Editorial'),
              period: l('2018 — 2021'),
              description: l('Campaign styling for luxury jewelry, beauty and apparel houses.'),
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
    id: 'fashion-10',
    name: 'Pattern Cut',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Cream Burgundy light theme for knitwear specialists — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fcf8f2 0%, #eed5d6 55%, #9f1239 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#281217',
        accent: '#9f1239',
        surface: '#fcf8f2',
        text: '#381d23',
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
          eyebrow: l('Knitwear Specialist'),
          headline: l('Your Name'),
          subheadline: l('Independent womenswear and unisex designer working directly with artisan weaver clusters in Chanderi and Kutch.'),
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
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Approach'),
          body: l('Independent womenswear and unisex designer working directly with artisan weaver clusters in Chanderi and Kutch. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Autumn Handloom Capsule'),
              description: l('18-piece zero-waste collection woven in organic cotton and wild tussar silk.'),
              url: '',
              imageUrl: '',
              tags: ['Runway', 'Handloom'],
            },
            {
              title: l('Vogue India Editorial'),
              description: l('Styled 12-page coastal monochrome fashion story shot on 120 film.'),
              url: '',
              imageUrl: '',
              tags: ['Styling', 'Print'],
            },
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: '',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'fashion-11',
    name: 'Monochrome Vogue',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Charcoal Amber dark theme for fashion illustrators — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
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
          eyebrow: l('Fashion Illustrator'),
          headline: l('Slow textiles, sharp tailoring.'),
          subheadline: l('Editorial styling and costume direction for print campaigns, music films and runway presentations.'),
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
          body: l('Editorial styling and costume direction for print campaigns, music films and runway presentations. Based in Goa, working with teams worldwide.'),
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
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Every garment carries unmistakable structure while feeling effortless on the body.'),
              author: l('Sonia Kapur'),
              role: l('Fashion Features Editor'),
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
    id: 'fashion-12',
    name: 'Cashmere',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Ice Indigo light theme for lookbook art directors — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Lookbook Art Director'),
          headline: l('Collections, lookbooks and costume direction.'),
          subheadline: l('Zero-waste pattern cutting meets modern architectural draping.'),
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
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Profile'),
          body: l('Zero-waste pattern cutting meets modern architectural draping. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Collection Planning', 'Showroom Curation', 'Textile Sourcing', 'Trend Direction'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: '',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
            },
            {
              title: l('Autumn Handloom Capsule'),
              description: l('18-piece zero-waste collection woven in organic cotton and wild tussar silk.'),
              url: '',
              imageUrl: '',
              tags: ['Runway', 'Handloom'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'fashion-13',
    name: 'Satin Stitch',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Oatmeal Forest light theme for trend & color forecasters — Fraunces headings with centered hero and comfortable spacing.',
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
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Trend & Color Forecaster'),
          headline: l('Your Name'),
          subheadline: l('Independent womenswear and unisex designer working directly with artisan weaver clusters in Chanderi and Kutch.'),
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
          title: l('Practice'),
          body: l('Independent womenswear and unisex designer working directly with artisan weaver clusters in Chanderi and Kutch. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Autumn Handloom Capsule'),
              description: l('18-piece zero-waste collection woven in organic cotton and wild tussar silk.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Runway', 'Handloom'],
            },
            {
              title: l('Vogue India Editorial'),
              description: l('Styled 12-page coastal monochrome fashion story shot on 120 film.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Styling', 'Print'],
            },
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
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
              quote: l('Every garment carries unmistakable structure while feeling effortless on the body.'),
              author: l('Sonia Kapur'),
              role: l('Fashion Features Editor'),
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
    id: 'fashion-14',
    name: 'Muse Editorial',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Velvet Rose dark theme for visual merchandising leads — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
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
          eyebrow: l('Visual Merchandising Lead'),
          headline: l('Contemporary silhouettes rooted in handloom craft.'),
          subheadline: l('Editorial styling and costume direction for print campaigns, music films and runway presentations.'),
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
              title: l('Vogue India Editorial'),
              description: l('Styled 12-page coastal monochrome fashion story shot on 120 film.'),
              url: '',
              imageUrl: '',
              tags: ['Styling', 'Print'],
            },
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: '',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Natural Dyeing', 'Zero-Waste Cutting', 'Tailoring', 'Costume Design'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Every garment carries unmistakable structure while feeling effortless on the body.'),
              author: l('Sonia Kapur'),
              role: l('Fashion Features Editor'),
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'fashion-15',
    name: 'Maison Archive',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Linen Terracotta light theme for footwear designers — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Footwear Designer'),
          headline: l('Editorial styling with sculptural restraint.'),
          subheadline: l('Zero-waste pattern cutting meets modern architectural draping.'),
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
          body: l('Zero-waste pattern cutting meets modern architectural draping. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Focus Areas'),
          items: ['Collection Planning', 'Showroom Curation', 'Textile Sourcing', 'Trend Direction'],
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
            },
            {
              title: l('Autumn Handloom Capsule'),
              description: l('18-piece zero-waste collection woven in organic cotton and wild tussar silk.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Runway', 'Handloom'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'fashion-16',
    name: 'Tailored',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Saffron Ink light theme for pattern & draping masters — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #fdf9ef 0%, #f2e0cd 55%, #b45309 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#23190c',
        accent: '#b45309',
        surface: '#fdf9ef',
        text: '#332514',
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
          eyebrow: l('Pattern & Draping Master'),
          headline: l('Your Name'),
          subheadline: l('Independent womenswear and unisex designer working directly with artisan weaver clusters in Chanderi and Kutch.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Draping & Patterning', 'Handloom Development', 'Editorial Styling', 'Lookbook Direction'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Autumn Handloom Capsule'),
              description: l('18-piece zero-waste collection woven in organic cotton and wild tussar silk.'),
              url: '',
              imageUrl: '',
              tags: ['Runway', 'Handloom'],
            },
            {
              title: l('Vogue India Editorial'),
              description: l('Styled 12-page coastal monochrome fashion story shot on 120 film.'),
              url: '',
              imageUrl: '',
              tags: ['Styling', 'Print'],
            },
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: '',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
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
              role: l('Creative Director'),
              company: l('Maison Vana'),
              period: l('2021 — Present'),
              description: l('Showcased at Lakmé Fashion Week; stocked in Mumbai, Delhi and Tokyo.'),
            },
            {
              role: l('Senior Stylist'),
              company: l('Studio Editorial'),
              period: l('2018 — 2021'),
              description: l('Campaign styling for luxury jewelry, beauty and apparel houses.'),
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
              quote: l('Every garment carries unmistakable structure while feeling effortless on the body.'),
              author: l('Sonia Kapur'),
              role: l('Fashion Features Editor'),
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'fashion-17',
    name: 'Sartorial',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Deep Teal dark theme for fashion editors — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
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
          eyebrow: l('Fashion Editor'),
          headline: l('Slow textiles, sharp tailoring.'),
          subheadline: l('Editorial styling and costume direction for print campaigns, music films and runway presentations.'),
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
          body: l('Editorial styling and costume direction for print campaigns, music films and runway presentations. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Creative Director'),
              company: l('Maison Vana'),
              period: l('2021 — Present'),
              description: l('Showcased at Lakmé Fashion Week; stocked in Mumbai, Delhi and Tokyo.'),
            },
            {
              role: l('Senior Stylist'),
              company: l('Studio Editorial'),
              period: l('2018 — 2021'),
              description: l('Campaign styling for luxury jewelry, beauty and apparel houses.'),
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
              degree: l('B.Des. Fashion Design'),
              school: l('NIFT New Delhi'),
              period: l('2014 — 2018'),
              description: l('Awarded Best Textile Innovation Collection.'),
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
              title: l('Vogue India Editorial'),
              description: l('Styled 12-page coastal monochrome fashion story shot on 120 film.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Styling', 'Print'],
            },
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'fashion-18',
    name: 'Thread & Bone',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Nordic Spruce light theme for showroom curators — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Showroom Curator'),
          headline: l('Collections, lookbooks and costume direction.'),
          subheadline: l('Zero-waste pattern cutting meets modern architectural draping.'),
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
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Collection Planning', 'Showroom Curation', 'Textile Sourcing', 'Trend Direction'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Creative Director'),
              company: l('Maison Vana'),
              period: l('2021 — Present'),
              description: l('Showcased at Lakmé Fashion Week; stocked in Mumbai, Delhi and Tokyo.'),
            },
            {
              role: l('Senior Stylist'),
              company: l('Studio Editorial'),
              period: l('2018 — 2021'),
              description: l('Campaign styling for luxury jewelry, beauty and apparel houses.'),
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
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: '',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
            },
            {
              title: l('Autumn Handloom Capsule'),
              description: l('18-piece zero-waste collection woven in organic cotton and wild tussar silk.'),
              url: '',
              imageUrl: '',
              tags: ['Runway', 'Handloom'],
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
    id: 'fashion-19',
    name: 'Poplin',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Sepia Slate light theme for handloom collaborators — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f5f0e6 0%, #e0d8cb 55%, #6b4f35 140%)',
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
        variant: 'centered',
        props: {
          eyebrow: l('Handloom Collaborator'),
          headline: l('Your Name'),
          subheadline: l('Independent womenswear and unisex designer working directly with artisan weaver clusters in Chanderi and Kutch.'),
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Autumn Handloom Capsule'),
              description: l('18-piece zero-waste collection woven in organic cotton and wild tussar silk.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Runway', 'Handloom'],
            },
            {
              title: l('Vogue India Editorial'),
              description: l('Styled 12-page coastal monochrome fashion story shot on 120 film.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Styling', 'Print'],
            },
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Independent womenswear and unisex designer working directly with artisan weaver clusters in Chanderi and Kutch. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Creative Director'),
              company: l('Maison Vana'),
              period: l('2021 — Present'),
              description: l('Showcased at Lakmé Fashion Week; stocked in Mumbai, Delhi and Tokyo.'),
            },
            {
              role: l('Senior Stylist'),
              company: l('Studio Editorial'),
              period: l('2018 — 2021'),
              description: l('Campaign styling for luxury jewelry, beauty and apparel houses.'),
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
    id: 'fashion-20',
    name: 'Showroom',
    category: 'fashion',
    family: 'Fashion Editorial',
    audience: ['fashion', 'stylist', 'designer'],
    description: 'Smoked Tangerine dark theme for circular fashion strategists — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #120c08 0%, #452913 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff7ed',
        accent: '#fb923c',
        surface: '#120c08',
        text: '#f0dfd1',
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
          eyebrow: l('Circular Fashion Strategist'),
          headline: l('Contemporary silhouettes rooted in handloom craft.'),
          subheadline: l('Editorial styling and costume direction for print campaigns, music films and runway presentations.'),
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
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Approach'),
          body: l('Editorial styling and costume direction for print campaigns, music films and runway presentations. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Vogue India Editorial'),
              description: l('Styled 12-page coastal monochrome fashion story shot on 120 film.'),
              url: '',
              imageUrl: '',
              tags: ['Styling', 'Print'],
            },
            {
              title: l('Feature Film Costumes'),
              description: l('Designed and sourced 90 period-authentic costumes across 4 decades.'),
              url: '',
              imageUrl: '',
              tags: ['Costume', 'Cinema'],
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
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('Vimeo'), url: 'https://vimeo.com/yourname' }],
        },
      }
    ],
  },
];
