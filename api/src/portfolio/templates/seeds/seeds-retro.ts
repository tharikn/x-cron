// Auto-generated template seeds — Retro Vintage (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_RETRO: SeedTemplate[] = [
  {
    id: 'retro-01',
    name: 'Sepia Chronicle',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Vellum Rust light theme for cultural historians — Fraunces headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Cultural Historian'),
          headline: l('Your Name'),
          subheadline: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film.'),
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
          body: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Lead Archivist'),
              company: l('South Asia Print Trust'),
              period: l('2020 — Present'),
              description: l('Oversee preservation, digitization and public fellowship access.'),
            },
            {
              role: l('Assistant Curator'),
              company: l('City Heritage Museum'),
              period: l('2017 — 2020'),
              description: l('Curated temporary exhibitions and catalog essays.'),
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
              degree: l('M.A. Archival Studies & History'),
              school: l('Jawaharlal Nehru University'),
              period: l('2015 — 2017'),
              description: l('Material culture and print history.'),
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
              title: l('Bombay Print Ephemera 1940–80'),
              description: l('Digitized and cataloged 3,200 vintage matchboxes, playbills and cinema handbills.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Archive', 'Print'],
            },
            {
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
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
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('Substack'), url: 'https://yourname.substack.com' }, { label: l('Mastodon'), url: 'https://mastodon.social/@yourname' }],
        },
      }
    ],
  },
  {
    id: 'retro-02',
    name: 'Typewriter 74',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Signal Yellow light theme for museum & archive curators — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f7f3e3 0%, #eddbc2 55%, #b45309 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#b45309',
        surface: '#f7f3e3',
        text: '#141414',
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
          eyebrow: l('Museum & Archive Curator'),
          headline: l('Preserving stories that outlast the moment.'),
          subheadline: l('Curating exhibitions, scholarly editions and community preservation workshops.'),
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
          items: ['Primary Source Research', 'Metadata Cataloging', 'Film Digitization', 'Rare Books'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Lead Archivist'),
              company: l('South Asia Print Trust'),
              period: l('2020 — Present'),
              description: l('Oversee preservation, digitization and public fellowship access.'),
            },
            {
              role: l('Assistant Curator'),
              company: l('City Heritage Museum'),
              period: l('2017 — 2020'),
              description: l('Curated temporary exhibitions and catalog essays.'),
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
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: '',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: '',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
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
    id: 'retro-03',
    name: 'Letterpress',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Obsidian Emerald dark theme for rare book & print dealers — Mono headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
        fontHeading: 'Mono',
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
          eyebrow: l('Rare Book & Print Dealer'),
          headline: l('Print, memory and living archives.'),
          subheadline: l('Available for museum consulting, documentary research and archival appraisals.'),
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
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
            },
            {
              title: l('Bombay Print Ephemera 1940–80'),
              description: l('Digitized and cataloged 3,200 vintage matchboxes, playbills and cinema handbills.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Archive', 'Print'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Available for museum consulting, documentary research and archival appraisals. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Lead Archivist'),
              company: l('South Asia Print Trust'),
              period: l('2020 — Present'),
              description: l('Oversee preservation, digitization and public fellowship access.'),
            },
            {
              role: l('Assistant Curator'),
              company: l('City Heritage Museum'),
              period: l('2017 — 2020'),
              description: l('Curated temporary exhibitions and catalog essays.'),
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
    id: 'retro-04',
    name: 'Newsprint',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Newsprint Navy light theme for letterpress printers — Fraunces headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Letterpress Printer'),
          headline: l('Your Name'),
          subheadline: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film.'),
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
          body: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Bombay Print Ephemera 1940–80'),
              description: l('Digitized and cataloged 3,200 vintage matchboxes, playbills and cinema handbills.'),
              url: '',
              imageUrl: '',
              tags: ['Archive', 'Print'],
            },
            {
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: '',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: '',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
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
          location: l('Coimbatore, India'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'retro-05',
    name: 'Vinyl Sleeve',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Poster Crimson light theme for analog media archivists — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #ffffff 0%, #fadede 55%, #dc2626 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#dc2626',
        surface: '#ffffff',
        text: '#141414',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Analog Media Archivist'),
          headline: l('History told through objects, letters and film.'),
          subheadline: l('Curating exhibitions, scholarly editions and community preservation workshops.'),
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
          title: l('Approach'),
          body: l('Curating exhibitions, scholarly editions and community preservation workshops. Based in Thiruvananthapuram, working with teams worldwide.'),
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
          title: l('Endorsements'),
          items: [
            {
              quote: l('Brings forgotten drawers of history back to vivid, tactile life for modern readers.'),
              author: l('Prof. Romila Sen'),
              role: l('Museum Trustee'),
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
    id: 'retro-06',
    name: 'Cassette Deck',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Midnight Cobalt dark theme for documentary filmmakers — Georgia headings with editorial hero and comfortable spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Documentary Filmmaker'),
          headline: l('Slow craft in an instant world.'),
          subheadline: l('Available for museum consulting, documentary research and archival appraisals.'),
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
          body: l('Available for museum consulting, documentary research and archival appraisals. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Object Conservation', 'Documentary Scripting', 'Public History', 'Grant Research'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: '',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
            },
            {
              title: l('Bombay Print Ephemera 1940–80'),
              description: l('Digitized and cataloged 3,200 vintage matchboxes, playbills and cinema handbills.'),
              url: '',
              imageUrl: '',
              tags: ['Archive', 'Print'],
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
          location: l('Remote'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'retro-07',
    name: 'Polaroid 600',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Parchment Olive light theme for oral historians — Mono headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f8f5ea 0%, #e1e0cc 55%, #5c6b24 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1f2314',
        accent: '#5c6b24',
        surface: '#f8f5ea',
        text: '#2c301e',
        fontHeading: 'Mono',
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
          eyebrow: l('Oral Historian'),
          headline: l('Your Name'),
          subheadline: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film.'),
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
          body: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Bombay Print Ephemera 1940–80'),
              description: l('Digitized and cataloged 3,200 vintage matchboxes, playbills and cinema handbills.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Archive', 'Print'],
            },
            {
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
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
              quote: l('Brings forgotten drawers of history back to vivid, tactile life for modern readers.'),
              author: l('Prof. Romila Sen'),
              role: l('Museum Trustee'),
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
    id: 'retro-08',
    name: 'Almanac',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Acid Lime light theme for vintage horologists — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f3f7ec 0%, #d2e5d2 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#15803d',
        surface: '#f3f7ec',
        text: '#141414',
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
          eyebrow: l('Vintage Horologist'),
          headline: l('Preserving stories that outlast the moment.'),
          subheadline: l('Curating exhibitions, scholarly editions and community preservation workshops.'),
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
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: '',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: '',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Primary Source Research', 'Metadata Cataloging', 'Film Digitization', 'Rare Books'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Brings forgotten drawers of history back to vivid, tactile life for modern readers.'),
              author: l('Prof. Romila Sen'),
              role: l('Museum Trustee'),
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
          location: l('Coimbatore, India'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'retro-09',
    name: 'Telegraph',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Abyssal Violet dark theme for heritage restorers — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Heritage Restorer'),
          headline: l('Print, memory and living archives.'),
          subheadline: l('Available for museum consulting, documentary research and archival appraisals.'),
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
          title: l('Overview'),
          body: l('Available for museum consulting, documentary research and archival appraisals. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Toolkit'),
          items: ['Object Conservation', 'Documentary Scripting', 'Public History', 'Grant Research'],
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
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
            },
            {
              title: l('Bombay Print Ephemera 1940–80'),
              description: l('Digitized and cataloged 3,200 vintage matchboxes, playbills and cinema handbills.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Archive', 'Print'],
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
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('Substack'), url: 'https://yourname.substack.com' }, { label: l('Mastodon'), url: 'https://mastodon.social/@yourname' }],
        },
      }
    ],
  },
  {
    id: 'retro-10',
    name: 'Antique Brass',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Cream Burgundy light theme for genealogy researchers — Georgia headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Genealogy Researcher'),
          headline: l('Your Name'),
          subheadline: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film.'),
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
          items: ['Archival Preservation', 'Oral History', 'Letterpress Print', 'Exhibition Curation'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Bombay Print Ephemera 1940–80'),
              description: l('Digitized and cataloged 3,200 vintage matchboxes, playbills and cinema handbills.'),
              url: '',
              imageUrl: '',
              tags: ['Archive', 'Print'],
            },
            {
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: '',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: '',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
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
              role: l('Lead Archivist'),
              company: l('South Asia Print Trust'),
              period: l('2020 — Present'),
              description: l('Oversee preservation, digitization and public fellowship access.'),
            },
            {
              role: l('Assistant Curator'),
              company: l('City Heritage Museum'),
              period: l('2017 — 2020'),
              description: l('Curated temporary exhibitions and catalog essays.'),
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
              quote: l('Brings forgotten drawers of history back to vivid, tactile life for modern readers.'),
              author: l('Prof. Romila Sen'),
              role: l('Museum Trustee'),
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
          location: l('Remote'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'retro-11',
    name: 'Old Press',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Cobalt Slab light theme for vinyl & music archivists — Mono headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f4f4f5 0%, #d5def4 55%, #2563eb 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#09090b',
        accent: '#2563eb',
        surface: '#f4f4f5',
        text: '#18181b',
        fontHeading: 'Mono',
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
          eyebrow: l('Vinyl & Music Archivist'),
          headline: l('History told through objects, letters and film.'),
          subheadline: l('Curating exhibitions, scholarly editions and community preservation workshops.'),
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
          body: l('Curating exhibitions, scholarly editions and community preservation workshops. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Lead Archivist'),
              company: l('South Asia Print Trust'),
              period: l('2020 — Present'),
              description: l('Oversee preservation, digitization and public fellowship access.'),
            },
            {
              role: l('Assistant Curator'),
              company: l('City Heritage Museum'),
              period: l('2017 — 2020'),
              description: l('Curated temporary exhibitions and catalog essays.'),
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
              degree: l('M.A. Archival Studies & History'),
              school: l('Jawaharlal Nehru University'),
              period: l('2015 — 2017'),
              description: l('Material culture and print history.'),
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
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
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
          location: l('Hyderabad, India'),
          links: [{ label: l('Substack'), url: 'https://yourname.substack.com' }, { label: l('Mastodon'), url: 'https://mastodon.social/@yourname' }],
        },
      }
    ],
  },
  {
    id: 'retro-12',
    name: 'Film Reel',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Charcoal Amber dark theme for cartography collectors — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Cartography Collector'),
          headline: l('Slow craft in an instant world.'),
          subheadline: l('Available for museum consulting, documentary research and archival appraisals.'),
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
          items: ['Object Conservation', 'Documentary Scripting', 'Public History', 'Grant Research'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Lead Archivist'),
              company: l('South Asia Print Trust'),
              period: l('2020 — Present'),
              description: l('Oversee preservation, digitization and public fellowship access.'),
            },
            {
              role: l('Assistant Curator'),
              company: l('City Heritage Museum'),
              period: l('2017 — 2020'),
              description: l('Curated temporary exhibitions and catalog essays.'),
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
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: '',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
            },
            {
              title: l('Bombay Print Ephemera 1940–80'),
              description: l('Digitized and cataloged 3,200 vintage matchboxes, playbills and cinema handbills.'),
              url: '',
              imageUrl: '',
              tags: ['Archive', 'Print'],
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
    id: 'retro-13',
    name: 'Linen Binding',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Oatmeal Forest light theme for culinary historians — Fraunces headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Culinary Historian'),
          headline: l('Your Name'),
          subheadline: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film.'),
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
              title: l('Bombay Print Ephemera 1940–80'),
              description: l('Digitized and cataloged 3,200 vintage matchboxes, playbills and cinema handbills.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Archive', 'Print'],
            },
            {
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Lead Archivist'),
              company: l('South Asia Print Trust'),
              period: l('2020 — Present'),
              description: l('Oversee preservation, digitization and public fellowship access.'),
            },
            {
              role: l('Assistant Curator'),
              company: l('City Heritage Museum'),
              period: l('2017 — 2020'),
              description: l('Curated temporary exhibitions and catalog essays.'),
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
    id: 'retro-14',
    name: 'Chronicle',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Cyber Magenta light theme for classic film programmers — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #faf5ff 0%, #f1d6f8 55%, #c026d3 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0c',
        accent: '#c026d3',
        surface: '#faf5ff',
        text: '#16121a',
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
          eyebrow: l('Classic Film Programmer'),
          headline: l('Preserving stories that outlast the moment.'),
          subheadline: l('Curating exhibitions, scholarly editions and community preservation workshops.'),
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
          body: l('Curating exhibitions, scholarly editions and community preservation workshops. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: '',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: '',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
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
          location: l('Remote'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'retro-15',
    name: 'Fountain Nib',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Velvet Rose dark theme for librarian & special collectionss — Mono headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
        fontHeading: 'Mono',
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
          eyebrow: l('Librarian & Special Collections'),
          headline: l('Print, memory and living archives.'),
          subheadline: l('Available for museum consulting, documentary research and archival appraisals.'),
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
          title: l('Approach'),
          body: l('Available for museum consulting, documentary research and archival appraisals. Based in Hyderabad, working with teams worldwide.'),
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
              quote: l('Brings forgotten drawers of history back to vivid, tactile life for modern readers.'),
              author: l('Prof. Romila Sen'),
              role: l('Museum Trustee'),
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
    id: 'retro-16',
    name: 'Radio Dial',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Saffron Ink light theme for antique textile conservators — Fraunces headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Antique Textile Conservator'),
          headline: l('Your Name'),
          subheadline: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film.'),
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
          body: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Archival Preservation', 'Oral History', 'Letterpress Print', 'Exhibition Curation'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Bombay Print Ephemera 1940–80'),
              description: l('Digitized and cataloged 3,200 vintage matchboxes, playbills and cinema handbills.'),
              url: '',
              imageUrl: '',
              tags: ['Archive', 'Print'],
            },
            {
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: '',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: '',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
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
          location: l('Coimbatore, India'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'retro-17',
    name: 'Ephemera',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Tangerine Concrete light theme for typewriter restorers — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f5f5f4 0%, #f3ddd1 55%, #ea580c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d0d0d',
        accent: '#ea580c',
        surface: '#f5f5f4',
        text: '#1c1917',
        fontHeading: 'Fraunces',
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
          eyebrow: l('Typewriter Restorer'),
          headline: l('History told through objects, letters and film.'),
          subheadline: l('Curating exhibitions, scholarly editions and community preservation workshops.'),
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
          body: l('Curating exhibitions, scholarly editions and community preservation workshops. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
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
              quote: l('Brings forgotten drawers of history back to vivid, tactile life for modern readers.'),
              author: l('Prof. Romila Sen'),
              role: l('Museum Trustee'),
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
    id: 'retro-18',
    name: 'Kodak Gold',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Deep Teal dark theme for zine & ephemera curators — Georgia headings with editorial hero and comfortable spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Zine & Ephemera Curator'),
          headline: l('Slow craft in an instant world.'),
          subheadline: l('Available for museum consulting, documentary research and archival appraisals.'),
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
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: '',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
            },
            {
              title: l('Bombay Print Ephemera 1940–80'),
              description: l('Digitized and cataloged 3,200 vintage matchboxes, playbills and cinema handbills.'),
              url: '',
              imageUrl: '',
              tags: ['Archive', 'Print'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Object Conservation', 'Documentary Scripting', 'Public History', 'Grant Research'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Brings forgotten drawers of history back to vivid, tactile life for modern readers.'),
              author: l('Prof. Romila Sen'),
              role: l('Museum Trustee'),
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
          location: l('Remote'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'retro-19',
    name: 'Archivist',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Sepia Slate light theme for broadcast archivists — Mono headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f5f0e6 0%, #e0d8cb 55%, #6b4f35 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1d1c1a',
        accent: '#6b4f35',
        surface: '#f5f0e6',
        text: '#2c2a26',
        fontHeading: 'Mono',
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
          eyebrow: l('Broadcast Archivist'),
          headline: l('Your Name'),
          subheadline: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film.'),
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
          title: l('Overview'),
          body: l('Historian, archivist and letterpress printer cataloging South Asian print ephemera, oral histories and analog film. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Toolkit'),
          items: ['Archival Preservation', 'Oral History', 'Letterpress Print', 'Exhibition Curation'],
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
              title: l('Bombay Print Ephemera 1940–80'),
              description: l('Digitized and cataloged 3,200 vintage matchboxes, playbills and cinema handbills.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Archive', 'Print'],
            },
            {
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
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
          location: l('Hyderabad, India'),
          links: [{ label: l('Substack'), url: 'https://yourname.substack.com' }, { label: l('Mastodon'), url: 'https://mastodon.social/@yourname' }],
        },
      }
    ],
  },
  {
    id: 'retro-20',
    name: 'Postmark',
    category: 'retro',
    family: 'Retro Vintage',
    audience: ['writer', 'curator', 'historian'],
    description: 'Midnight Volt dark theme for historical essayists — Fraunces headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #09090b 0%, #3e340d 55%, #facc15 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f4f4f5',
        accent: '#facc15',
        surface: '#09090b',
        text: '#e4e4e7',
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
          eyebrow: l('Historical Essayist'),
          headline: l('Preserving stories that outlast the moment.'),
          subheadline: l('Curating exhibitions, scholarly editions and community preservation workshops.'),
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
          items: ['Primary Source Research', 'Metadata Cataloging', 'Film Digitization', 'Rare Books'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Voices of the Railway'),
              description: l('Recorded 48 oral history interviews with retired stationmasters and signallers.'),
              url: '',
              imageUrl: '',
              tags: ['Oral History', 'Audio'],
            },
            {
              title: l('Letterpress Broadside Series'),
              description: l('Hand-set metal type broadsides printed on a 1958 Vandercook proof press.'),
              url: '',
              imageUrl: '',
              tags: ['Letterpress', 'Craft'],
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
              role: l('Lead Archivist'),
              company: l('South Asia Print Trust'),
              period: l('2020 — Present'),
              description: l('Oversee preservation, digitization and public fellowship access.'),
            },
            {
              role: l('Assistant Curator'),
              company: l('City Heritage Museum'),
              period: l('2017 — 2020'),
              description: l('Curated temporary exhibitions and catalog essays.'),
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
              quote: l('Brings forgotten drawers of history back to vivid, tactile life for modern readers.'),
              author: l('Prof. Romila Sen'),
              role: l('Museum Trustee'),
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
          location: l('Coimbatore, India'),
          links: [{ label: l('Medium'), url: 'https://medium.com/@yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
];
