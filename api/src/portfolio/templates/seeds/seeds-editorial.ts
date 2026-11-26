// Auto-generated template seeds — Editorial Magazine (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_EDITORIAL: SeedTemplate[] = [
  {
    id: 'editorial-02',
    name: 'Broadsheet',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Vellum Rust light theme for senior features writers — Fraunces headings with editorial hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Senior Features Writer'),
          headline: l('Stories that make complex ideas human.'),
          subheadline: l('Feature reporting, interviews and narrative essays on technology, urban life and the people behind systems.'),
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
          body: l('Feature reporting, interviews and narrative essays on technology, urban life and the people behind systems. Based in Mumbai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Long-form Features', 'Investigative Reporting', 'Line Editing', 'Narrative Structure'],
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
          title: l('Selected Writing'),
          items: [
            {
              title: l('The Quiet Infrastructure of Cities'),
              description: l('4,500-word cover feature examining municipal water grids and the engineers who keep them running.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Cover Story', 'Longform'],
            },
            {
              title: l('Builders of the Open Web'),
              description: l('Six-part interview anthology profiling independent software maintainers across South Asia.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Series', 'Interviews'],
            },
            {
              title: l('Field Notes on Craft'),
              description: l('Weekly reader-supported essay publication with 48% open rate and 140 archived issues.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Newsletter', 'Publishing'],
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
          location: l('Mumbai, India'),
          links: [{ label: l('Substack'), url: 'https://yourname.substack.com' }, { label: l('Mastodon'), url: 'https://mastodon.social/@yourname' }],
        },
      }
    ],
  },
  {
    id: 'editorial-03',
    name: 'Copper Folio',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Alabaster Cobalt light theme for managing editors — Georgia headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fafbfe 0%, #dae2fd 55%, #2457f5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1320',
        accent: '#2457f5',
        surface: '#fafbfe',
        text: '#1c2436',
        fontHeading: 'Georgia',
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
          eyebrow: l('Managing Editor'),
          headline: l('Reporting from the seam of culture and code.'),
          subheadline: l('Helping founders and research organizations articulate complex ideas with warmth and rigor.'),
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
          items: ['Editorial Strategy', 'Brand Voice', 'Executive Ghostwriting', 'Newsletter Growth'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Writing'),
          items: [
            {
              title: l('Builders of the Open Web'),
              description: l('Six-part interview anthology profiling independent software maintainers across South Asia.'),
              url: '',
              imageUrl: '',
              tags: ['Series', 'Interviews'],
            },
            {
              title: l('Field Notes on Craft'),
              description: l('Weekly reader-supported essay publication with 48% open rate and 140 archived issues.'),
              url: '',
              imageUrl: '',
              tags: ['Newsletter', 'Publishing'],
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
              role: l('Senior Contributing Editor'),
              company: l('The Meridian Review'),
              period: l('2022 — Present'),
              description: l('Commission and edit monthly technology and culture essays.'),
            },
            {
              role: l('Staff Feature Writer'),
              company: l('Civic Weekly'),
              period: l('2018 — 2022'),
              description: l('Reported 60+ long-form profiles and investigative pieces.'),
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
              quote: l('Has a rare gift for turning technical nuance into vivid human stakes.'),
              author: l('Rohan Deshmukh'),
              role: l('Author & Fellow'),
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
          location: l('Pune, India'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'editorial-04',
    name: 'Ink & Margin',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Obsidian Emerald dark theme for technology journalists — Fraunces headings with split-media hero and comfortable spacing.',
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
        fontBody: 'Georgia',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Technology Journalist'),
          headline: l('Your Name'),
          subheadline: l('Editor of an independent weekly publication read by 35,000 designers, engineers and thinkers.'),
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
          body: l('Editor of an independent weekly publication read by 35,000 designers, engineers and thinkers. Based in Chandigarh, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Senior Contributing Editor'),
              company: l('The Meridian Review'),
              period: l('2022 — Present'),
              description: l('Commission and edit monthly technology and culture essays.'),
            },
            {
              role: l('Staff Feature Writer'),
              company: l('Civic Weekly'),
              period: l('2018 — 2022'),
              description: l('Reported 60+ long-form profiles and investigative pieces.'),
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
              degree: l('M.A. Journalism & Literary Nonfiction'),
              school: l('Asian College of Journalism'),
              period: l('2016 — 2017'),
              description: l('Recipient of the Dean’s Prize for Feature Reporting.'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Writing'),
          items: [
            {
              title: l('Field Notes on Craft'),
              description: l('Weekly reader-supported essay publication with 48% open rate and 140 archived issues.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Newsletter', 'Publishing'],
            },
            {
              title: l('Annual Impact Monograph'),
              description: l('Authored and edited a 96-page printed report for a climate technology foundation.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Print', 'Editorial'],
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
          location: l('Chandigarh, India'),
          links: [{ label: l('Substack'), url: 'https://yourname.substack.com' }, { label: l('Mastodon'), url: 'https://mastodon.social/@yourname' }],
        },
      }
    ],
  },
  {
    id: 'editorial-05',
    name: 'Vellum Press',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Newsprint Navy light theme for narrative strategists — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f7f4ec 0%, #d6d9e3 55%, #1e40af 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#161b26',
        accent: '#1e40af',
        surface: '#f7f4ec',
        text: '#232936',
        fontHeading: 'Georgia',
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
          eyebrow: l('Narrative Strategist'),
          headline: l('Long-form essays on work, cities and craft.'),
          subheadline: l('Twelve years of magazine features, book manuscripts and deeply reported profiles.'),
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
          items: ['Long-form Features', 'Investigative Reporting', 'Line Editing', 'Narrative Structure'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Senior Contributing Editor'),
              company: l('The Meridian Review'),
              period: l('2022 — Present'),
              description: l('Commission and edit monthly technology and culture essays.'),
            },
            {
              role: l('Staff Feature Writer'),
              company: l('Civic Weekly'),
              period: l('2018 — 2022'),
              description: l('Reported 60+ long-form profiles and investigative pieces.'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Writing'),
          items: [
            {
              title: l('Annual Impact Monograph'),
              description: l('Authored and edited a 96-page printed report for a climate technology foundation.'),
              url: '',
              imageUrl: '',
              tags: ['Print', 'Editorial'],
            },
            {
              title: l('Product Voice & Style Guide'),
              description: l('Established tone principles and microcopy patterns across 140 product screens.'),
              url: '',
              imageUrl: '',
              tags: ['UX Writing', 'Systems'],
            },
            {
              title: l('The Quiet Infrastructure of Cities'),
              description: l('4,500-word cover feature examining municipal water grids and the engineers who keep them running.'),
              url: '',
              imageUrl: '',
              tags: ['Cover Story', 'Longform'],
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
    id: 'editorial-06',
    name: 'Column Rule',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Porcelain Emerald light theme for editorial directors — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d1f18',
        accent: '#0a8754',
        surface: '#f9fcfa',
        text: '#192a22',
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
          eyebrow: l('Editorial Director'),
          headline: l('Clear prose for thoughtful companies.'),
          subheadline: l('Feature reporting, interviews and narrative essays on technology, urban life and the people behind systems.'),
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
          title: l('Selected Writing'),
          items: [
            {
              title: l('Product Voice & Style Guide'),
              description: l('Established tone principles and microcopy patterns across 140 product screens.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX Writing', 'Systems'],
            },
            {
              title: l('The Quiet Infrastructure of Cities'),
              description: l('4,500-word cover feature examining municipal water grids and the engineers who keep them running.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Cover Story', 'Longform'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Feature reporting, interviews and narrative essays on technology, urban life and the people behind systems. Based in Mumbai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Senior Contributing Editor'),
              company: l('The Meridian Review'),
              period: l('2022 — Present'),
              description: l('Commission and edit monthly technology and culture essays.'),
            },
            {
              role: l('Staff Feature Writer'),
              company: l('Civic Weekly'),
              period: l('2018 — 2022'),
              description: l('Reported 60+ long-form profiles and investigative pieces.'),
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
    id: 'editorial-07',
    name: 'Longform Issue',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Midnight Cobalt dark theme for essayist & critics — Georgia headings with split-media hero and comfortable spacing.',
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
          eyebrow: l('Essayist & Critic'),
          headline: l('Your Name'),
          subheadline: l('Helping founders and research organizations articulate complex ideas with warmth and rigor.'),
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
          body: l('Helping founders and research organizations articulate complex ideas with warmth and rigor. Based in Pune, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Writing'),
          items: [
            {
              title: l('The Quiet Infrastructure of Cities'),
              description: l('4,500-word cover feature examining municipal water grids and the engineers who keep them running.'),
              url: '',
              imageUrl: '',
              tags: ['Cover Story', 'Longform'],
            },
            {
              title: l('Builders of the Open Web'),
              description: l('Six-part interview anthology profiling independent software maintainers across South Asia.'),
              url: '',
              imageUrl: '',
              tags: ['Series', 'Interviews'],
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
          location: l('Pune, India'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'editorial-08',
    name: 'Chapter Nine',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Parchment Olive light theme for book authors — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Book Author'),
          headline: l('Every sentence earns its space.'),
          subheadline: l('Editor of an independent weekly publication read by 35,000 designers, engineers and thinkers.'),
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
          body: l('Editor of an independent weekly publication read by 35,000 designers, engineers and thinkers. Based in Chandigarh, working with teams worldwide.'),
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
              quote: l('Sharp reporting, musical sentences and never once missed a closing deadline.'),
              author: l('Meera Krishnan'),
              role: l('Editor-in-Chief, Meridian'),
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
    id: 'editorial-09',
    name: 'Gazette Serif',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Chalk Vermilion light theme for investigative reporters — Georgia headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #fcfbfa 0%, #f7ded9 55%, #d9381e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#191414',
        accent: '#d9381e',
        surface: '#fcfbfa',
        text: '#241e1d',
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
          eyebrow: l('Investigative Reporter'),
          headline: l('Investigations, profiles and printed matter.'),
          subheadline: l('Twelve years of magazine features, book manuscripts and deeply reported profiles.'),
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
          body: l('Twelve years of magazine features, book manuscripts and deeply reported profiles. Based in Visakhapatnam, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Editorial Strategy', 'Brand Voice', 'Executive Ghostwriting', 'Newsletter Growth'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Writing'),
          items: [
            {
              title: l('Field Notes on Craft'),
              description: l('Weekly reader-supported essay publication with 48% open rate and 140 archived issues.'),
              url: '',
              imageUrl: '',
              tags: ['Newsletter', 'Publishing'],
            },
            {
              title: l('Annual Impact Monograph'),
              description: l('Authored and edited a 96-page printed report for a climate technology foundation.'),
              url: '',
              imageUrl: '',
              tags: ['Print', 'Editorial'],
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
          location: l('Visakhapatnam, India'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'editorial-10',
    name: 'Redline Proof',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Abyssal Violet dark theme for brand editorial leads — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f5f3ff',
        accent: '#a78bfa',
        surface: '#0b0917',
        text: '#e0daf8',
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
          eyebrow: l('Brand Editorial Lead'),
          headline: l('Stories that make complex ideas human.'),
          subheadline: l('Feature reporting, interviews and narrative essays on technology, urban life and the people behind systems.'),
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
          body: l('Feature reporting, interviews and narrative essays on technology, urban life and the people behind systems. Based in Mumbai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Writing'),
          items: [
            {
              title: l('Annual Impact Monograph'),
              description: l('Authored and edited a 96-page printed report for a climate technology foundation.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Print', 'Editorial'],
            },
            {
              title: l('Product Voice & Style Guide'),
              description: l('Established tone principles and microcopy patterns across 140 product screens.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX Writing', 'Systems'],
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
              quote: l('Sharp reporting, musical sentences and never once missed a closing deadline.'),
              author: l('Meera Krishnan'),
              role: l('Editor-in-Chief, Meridian'),
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
    id: 'editorial-11',
    name: 'Manuscript',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Cream Burgundy light theme for newsletter publishers — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fcf8f2 0%, #eed5d6 55%, #9f1239 140%)',
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
          eyebrow: l('Newsletter Publisher'),
          headline: l('Reporting from the seam of culture and code.'),
          subheadline: l('Helping founders and research organizations articulate complex ideas with warmth and rigor.'),
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
          title: l('Selected Writing'),
          items: [
            {
              title: l('Product Voice & Style Guide'),
              description: l('Established tone principles and microcopy patterns across 140 product screens.'),
              url: '',
              imageUrl: '',
              tags: ['UX Writing', 'Systems'],
            },
            {
              title: l('The Quiet Infrastructure of Cities'),
              description: l('4,500-word cover feature examining municipal water grids and the engineers who keep them running.'),
              url: '',
              imageUrl: '',
              tags: ['Cover Story', 'Longform'],
            },
            {
              title: l('Builders of the Open Web'),
              description: l('Six-part interview anthology profiling independent software maintainers across South Asia.'),
              url: '',
              imageUrl: '',
              tags: ['Series', 'Interviews'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Long-form Features', 'Investigative Reporting', 'Line Editing', 'Narrative Structure'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Has a rare gift for turning technical nuance into vivid human stakes.'),
              author: l('Rohan Deshmukh'),
              role: l('Author & Fellow'),
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
          location: l('Pune, India'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'editorial-12',
    name: 'Print Run',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Ice Indigo light theme for cultural commentators — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f5f7ff 0%, #dcdcfb 55%, #4f46e5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#11132b',
        accent: '#4f46e5',
        surface: '#f5f7ff',
        text: '#1e2240',
        fontHeading: 'Fraunces',
        fontBody: 'Georgia',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Cultural Commentator'),
          headline: l('Your Name'),
          subheadline: l('Editor of an independent weekly publication read by 35,000 designers, engineers and thinkers.'),
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
          body: l('Editor of an independent weekly publication read by 35,000 designers, engineers and thinkers. Based in Chandigarh, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Editorial Strategy', 'Brand Voice', 'Executive Ghostwriting', 'Newsletter Growth'],
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
          title: l('Selected Writing'),
          items: [
            {
              title: l('The Quiet Infrastructure of Cities'),
              description: l('4,500-word cover feature examining municipal water grids and the engineers who keep them running.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Cover Story', 'Longform'],
            },
            {
              title: l('Builders of the Open Web'),
              description: l('Six-part interview anthology profiling independent software maintainers across South Asia.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Series', 'Interviews'],
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
          location: l('Chandigarh, India'),
          links: [{ label: l('Substack'), url: 'https://yourname.substack.com' }, { label: l('Mastodon'), url: 'https://mastodon.social/@yourname' }],
        },
      }
    ],
  },
  {
    id: 'editorial-13',
    name: 'Bookend',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Charcoal Amber dark theme for speechwriters — Georgia headings with split-media hero and comfortable spacing.',
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
        variant: 'split-media',
        props: {
          eyebrow: l('Speechwriter'),
          headline: l('Long-form essays on work, cities and craft.'),
          subheadline: l('Twelve years of magazine features, book manuscripts and deeply reported profiles.'),
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
          items: ['Interviewing', 'Archival Research', 'Fact-Checking', 'Copy Desk Leadership'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Writing'),
          items: [
            {
              title: l('Builders of the Open Web'),
              description: l('Six-part interview anthology profiling independent software maintainers across South Asia.'),
              url: '',
              imageUrl: '',
              tags: ['Series', 'Interviews'],
            },
            {
              title: l('Field Notes on Craft'),
              description: l('Weekly reader-supported essay publication with 48% open rate and 140 archived issues.'),
              url: '',
              imageUrl: '',
              tags: ['Newsletter', 'Publishing'],
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
              role: l('Senior Contributing Editor'),
              company: l('The Meridian Review'),
              period: l('2022 — Present'),
              description: l('Commission and edit monthly technology and culture essays.'),
            },
            {
              role: l('Staff Feature Writer'),
              company: l('Civic Weekly'),
              period: l('2018 — 2022'),
              description: l('Reported 60+ long-form profiles and investigative pieces.'),
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
              quote: l('Has a rare gift for turning technical nuance into vivid human stakes.'),
              author: l('Rohan Deshmukh'),
              role: l('Author & Fellow'),
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
          location: l('Visakhapatnam, India'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'editorial-14',
    name: 'Essayist',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Oatmeal Forest light theme for science journalists — Fraunces headings with editorial hero and comfortable spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Science Journalist'),
          headline: l('Clear prose for thoughtful companies.'),
          subheadline: l('Feature reporting, interviews and narrative essays on technology, urban life and the people behind systems.'),
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
          body: l('Feature reporting, interviews and narrative essays on technology, urban life and the people behind systems. Based in Mumbai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Senior Contributing Editor'),
              company: l('The Meridian Review'),
              period: l('2022 — Present'),
              description: l('Commission and edit monthly technology and culture essays.'),
            },
            {
              role: l('Staff Feature Writer'),
              company: l('Civic Weekly'),
              period: l('2018 — 2022'),
              description: l('Reported 60+ long-form profiles and investigative pieces.'),
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
              degree: l('M.A. Journalism & Literary Nonfiction'),
              school: l('Asian College of Journalism'),
              period: l('2016 — 2017'),
              description: l('Recipient of the Dean’s Prize for Feature Reporting.'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Writing'),
          items: [
            {
              title: l('Field Notes on Craft'),
              description: l('Weekly reader-supported essay publication with 48% open rate and 140 archived issues.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Newsletter', 'Publishing'],
            },
            {
              title: l('Annual Impact Monograph'),
              description: l('Authored and edited a 96-page printed report for a climate technology foundation.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Print', 'Editorial'],
            },
            {
              title: l('Product Voice & Style Guide'),
              description: l('Established tone principles and microcopy patterns across 140 product screens.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX Writing', 'Systems'],
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
          location: l('Mumbai, India'),
          links: [{ label: l('Substack'), url: 'https://yourname.substack.com' }, { label: l('Mastodon'), url: 'https://mastodon.social/@yourname' }],
        },
      }
    ],
  },
  {
    id: 'editorial-15',
    name: 'Proof Sheet',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Linen Terracotta light theme for ux writing leads — Georgia headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fdf8f3 0%, #f4dfd5 55%, #c2512b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261710',
        accent: '#c2512b',
        surface: '#fdf8f3',
        text: '#332219',
        fontHeading: 'Georgia',
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
          eyebrow: l('UX Writing Lead'),
          headline: l('Your Name'),
          subheadline: l('Helping founders and research organizations articulate complex ideas with warmth and rigor.'),
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
          items: ['Editorial Strategy', 'Brand Voice', 'Executive Ghostwriting', 'Newsletter Growth'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Senior Contributing Editor'),
              company: l('The Meridian Review'),
              period: l('2022 — Present'),
              description: l('Commission and edit monthly technology and culture essays.'),
            },
            {
              role: l('Staff Feature Writer'),
              company: l('Civic Weekly'),
              period: l('2018 — 2022'),
              description: l('Reported 60+ long-form profiles and investigative pieces.'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Writing'),
          items: [
            {
              title: l('Annual Impact Monograph'),
              description: l('Authored and edited a 96-page printed report for a climate technology foundation.'),
              url: '',
              imageUrl: '',
              tags: ['Print', 'Editorial'],
            },
            {
              title: l('Product Voice & Style Guide'),
              description: l('Established tone principles and microcopy patterns across 140 product screens.'),
              url: '',
              imageUrl: '',
              tags: ['UX Writing', 'Systems'],
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
    id: 'editorial-16',
    name: 'Cutline',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Velvet Rose dark theme for documentary writers — Fraunces headings with split-media hero and comfortable spacing.',
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
        fontBody: 'Georgia',
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Documentary Writer'),
          headline: l('Every sentence earns its space.'),
          subheadline: l('Editor of an independent weekly publication read by 35,000 designers, engineers and thinkers.'),
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
          title: l('Selected Writing'),
          items: [
            {
              title: l('Product Voice & Style Guide'),
              description: l('Established tone principles and microcopy patterns across 140 product screens.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX Writing', 'Systems'],
            },
            {
              title: l('The Quiet Infrastructure of Cities'),
              description: l('4,500-word cover feature examining municipal water grids and the engineers who keep them running.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Cover Story', 'Longform'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Editor of an independent weekly publication read by 35,000 designers, engineers and thinkers. Based in Chandigarh, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Senior Contributing Editor'),
              company: l('The Meridian Review'),
              period: l('2022 — Present'),
              description: l('Commission and edit monthly technology and culture essays.'),
            },
            {
              role: l('Staff Feature Writer'),
              company: l('Civic Weekly'),
              period: l('2018 — 2022'),
              description: l('Reported 60+ long-form profiles and investigative pieces.'),
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
    id: 'editorial-17',
    name: 'Masthead',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Saffron Ink light theme for literary editors — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #fdf9ef 0%, #f2e0cd 55%, #b45309 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#23190c',
        accent: '#b45309',
        surface: '#fdf9ef',
        text: '#332514',
        fontHeading: 'Georgia',
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
          eyebrow: l('Literary Editor'),
          headline: l('Investigations, profiles and printed matter.'),
          subheadline: l('Twelve years of magazine features, book manuscripts and deeply reported profiles.'),
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
          body: l('Twelve years of magazine features, book manuscripts and deeply reported profiles. Based in Visakhapatnam, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Writing'),
          items: [
            {
              title: l('The Quiet Infrastructure of Cities'),
              description: l('4,500-word cover feature examining municipal water grids and the engineers who keep them running.'),
              url: '',
              imageUrl: '',
              tags: ['Cover Story', 'Longform'],
            },
            {
              title: l('Builders of the Open Web'),
              description: l('Six-part interview anthology profiling independent software maintainers across South Asia.'),
              url: '',
              imageUrl: '',
              tags: ['Series', 'Interviews'],
            },
            {
              title: l('Field Notes on Craft'),
              description: l('Weekly reader-supported essay publication with 48% open rate and 140 archived issues.'),
              url: '',
              imageUrl: '',
              tags: ['Newsletter', 'Publishing'],
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
          location: l('Visakhapatnam, India'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'editorial-18',
    name: 'Byline Press',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Nordic Spruce light theme for policy columnists — Fraunces headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f4fafa 0%, #d2e7e7 55%, #0e7c7b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0c1c1c',
        accent: '#0e7c7b',
        surface: '#f4fafa',
        text: '#172b2b',
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
          eyebrow: l('Policy Columnist'),
          headline: l('Stories that make complex ideas human.'),
          subheadline: l('Feature reporting, interviews and narrative essays on technology, urban life and the people behind systems.'),
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
          body: l('Feature reporting, interviews and narrative essays on technology, urban life and the people behind systems. Based in Mumbai, working with teams worldwide.'),
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
              quote: l('Sharp reporting, musical sentences and never once missed a closing deadline.'),
              author: l('Meera Krishnan'),
              role: l('Editor-in-Chief, Meridian'),
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
    id: 'editorial-19',
    name: 'Paperweight',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Deep Teal dark theme for audio storytellers — Georgia headings with split-media hero and comfortable spacing.',
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
          eyebrow: l('Audio Storyteller'),
          headline: l('Reporting from the seam of culture and code.'),
          subheadline: l('Helping founders and research organizations articulate complex ideas with warmth and rigor.'),
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
          body: l('Helping founders and research organizations articulate complex ideas with warmth and rigor. Based in Pune, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Interviewing', 'Archival Research', 'Fact-Checking', 'Copy Desk Leadership'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Writing'),
          items: [
            {
              title: l('Field Notes on Craft'),
              description: l('Weekly reader-supported essay publication with 48% open rate and 140 archived issues.'),
              url: '',
              imageUrl: '',
              tags: ['Newsletter', 'Publishing'],
            },
            {
              title: l('Annual Impact Monograph'),
              description: l('Authored and edited a 96-page printed report for a climate technology foundation.'),
              url: '',
              imageUrl: '',
              tags: ['Print', 'Editorial'],
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
          location: l('Pune, India'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'editorial-20',
    name: 'Colophon',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Sepia Slate light theme for ghostwriters — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Ghostwriter'),
          headline: l('Your Name'),
          subheadline: l('Editor of an independent weekly publication read by 35,000 designers, engineers and thinkers.'),
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
          body: l('Editor of an independent weekly publication read by 35,000 designers, engineers and thinkers. Based in Chandigarh, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Writing'),
          items: [
            {
              title: l('Annual Impact Monograph'),
              description: l('Authored and edited a 96-page printed report for a climate technology foundation.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Print', 'Editorial'],
            },
            {
              title: l('Product Voice & Style Guide'),
              description: l('Established tone principles and microcopy patterns across 140 product screens.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX Writing', 'Systems'],
            },
            {
              title: l('The Quiet Infrastructure of Cities'),
              description: l('4,500-word cover feature examining municipal water grids and the engineers who keep them running.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Cover Story', 'Longform'],
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
              quote: l('Sharp reporting, musical sentences and never once missed a closing deadline.'),
              author: l('Meera Krishnan'),
              role: l('Editor-in-Chief, Meridian'),
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
    id: 'editorial-21',
    name: 'Folio No. 4',
    category: 'editorial',
    family: 'Editorial Magazine',
    audience: ['writer', 'editor', 'journalist'],
    description: 'Cloud Plum light theme for independent publishers — Georgia headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #fbf8fe 0%, #e8d8f7 55%, #7e22ce 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1e1024',
        accent: '#7e22ce',
        surface: '#fbf8fe',
        text: '#2b1b33',
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
          eyebrow: l('Independent Publisher'),
          headline: l('Long-form essays on work, cities and craft.'),
          subheadline: l('Twelve years of magazine features, book manuscripts and deeply reported profiles.'),
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
          title: l('Selected Writing'),
          items: [
            {
              title: l('Product Voice & Style Guide'),
              description: l('Established tone principles and microcopy patterns across 140 product screens.'),
              url: '',
              imageUrl: '',
              tags: ['UX Writing', 'Systems'],
            },
            {
              title: l('The Quiet Infrastructure of Cities'),
              description: l('4,500-word cover feature examining municipal water grids and the engineers who keep them running.'),
              url: '',
              imageUrl: '',
              tags: ['Cover Story', 'Longform'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Editorial Strategy', 'Brand Voice', 'Executive Ghostwriting', 'Newsletter Growth'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Has a rare gift for turning technical nuance into vivid human stakes.'),
              author: l('Rohan Deshmukh'),
              role: l('Author & Fellow'),
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
          location: l('Visakhapatnam, India'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
];
