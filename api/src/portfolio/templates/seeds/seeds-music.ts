// Auto-generated template seeds — Music Artist (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_MUSIC: SeedTemplate[] = [
  {
    id: 'music-01',
    name: 'Sub Bass',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Obsidian Emerald dark theme for music producers — Outfit headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
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
          eyebrow: l('Music Producer'),
          headline: l('Your Name'),
          subheadline: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases.'),
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
          body: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Composer & Producer'),
              company: l('EchoRoom Studio'),
              period: l('2020 — Present'),
              description: l('Produced 14 EPs, 3 feature film scores and commercial sonic branding.'),
            },
            {
              role: l('Mix Engineer'),
              company: l('Soundcraft House'),
              period: l('2017 — 2020'),
              description: l('Tracking, vocal editing and stereo/surround mixing.'),
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
              degree: l('Diploma in Audio Engineering'),
              school: l('KM Music Conservatory'),
              period: l('2015 — 2017'),
              description: l('Electro-acoustic composition and studio production.'),
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
              title: l('Monsoon Signals (LP)'),
              description: l('10-track debut album combining Indian classical strings with analog tape synths; 1.8M streams.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Album', 'Electronic'],
            },
            {
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
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
          location: l('Coimbatore, India'),
          links: [{ label: l('Spotify'), url: 'https://open.spotify.com' }, { label: l('SoundCloud'), url: 'https://soundcloud.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'music-02',
    name: 'Synth Reverb',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Matrix Lime dark theme for film & game composers — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #050a07 0%, #143922 55%, #4ade80 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ebffef',
        accent: '#4ade80',
        surface: '#050a07',
        text: '#c9f2d2',
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
          eyebrow: l('Film & Game Composer'),
          headline: l('Soundscapes between analog warmth and modern pulse.'),
          subheadline: l('Blending acoustic instrumentation, modular synthesis and spatial audio from my studio in Mumbai.'),
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
          items: ['Mixing & Mastering', 'Dolby Atmos', 'Vocal Production', 'Live Looping'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Composer & Producer'),
              company: l('EchoRoom Studio'),
              period: l('2020 — Present'),
              description: l('Produced 14 EPs, 3 feature film scores and commercial sonic branding.'),
            },
            {
              role: l('Mix Engineer'),
              company: l('Soundcraft House'),
              period: l('2017 — 2020'),
              description: l('Tracking, vocal editing and stereo/surround mixing.'),
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
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: '',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: '',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
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
    id: 'music-03',
    name: 'Analog Tape',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Signal Yellow light theme for electronic live acts — Mono headings with centered hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f7f3e3 0%, #eddbc2 55%, #b45309 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#b45309',
        surface: '#f7f3e3',
        text: '#141414',
        fontHeading: 'Mono',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Electronic Live Act'),
          headline: l('Original scores, production and live sets.'),
          subheadline: l('Available for film scoring, album production, mixing and international festival bookings.'),
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
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
            },
            {
              title: l('Monsoon Signals (LP)'),
              description: l('10-track debut album combining Indian classical strings with analog tape synths; 1.8M streams.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Album', 'Electronic'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Available for film scoring, album production, mixing and international festival bookings. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Composer & Producer'),
              company: l('EchoRoom Studio'),
              period: l('2020 — Present'),
              description: l('Produced 14 EPs, 3 feature film scores and commercial sonic branding.'),
            },
            {
              role: l('Mix Engineer'),
              company: l('Soundcraft House'),
              period: l('2017 — 2020'),
              description: l('Tracking, vocal editing and stereo/surround mixing.'),
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
    id: 'music-04',
    name: 'Midnight Tempo',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Midnight Cobalt dark theme for singer-songwriters — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eff6ff',
        accent: '#60a5fa',
        surface: '#070b16',
        text: '#d8e4f8',
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
          eyebrow: l('Singer-Songwriter'),
          headline: l('Your Name'),
          subheadline: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases.'),
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
          title: l('Overview'),
          body: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Monsoon Signals (LP)'),
              description: l('10-track debut album combining Indian classical strings with analog tape synths; 1.8M streams.'),
              url: '',
              imageUrl: '',
              tags: ['Album', 'Electronic'],
            },
            {
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: '',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: '',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
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
          location: l('Hyderabad, India'),
          links: [{ label: l('YouTube'), url: 'https://youtube.com/@yourname' }, { label: l('Instagram'), url: 'https://instagram.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'music-05',
    name: 'Crescendo',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Synthwave Pink dark theme for mastering & mix engineers — Fraunces headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0c0512 0%, #3f1d36 55%, #f472b6 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ffeef8',
        accent: '#f472b6',
        surface: '#0c0512',
        text: '#f0cfe3',
        fontHeading: 'Fraunces',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Mastering & Mix Engineer'),
          headline: l('Crafting sonic identity for film, games and records.'),
          subheadline: l('Blending acoustic instrumentation, modular synthesis and spatial audio from my studio in Mumbai.'),
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
          body: l('Blending acoustic instrumentation, modular synthesis and spatial audio from my studio in Mumbai. Based in Coimbatore, working with teams worldwide.'),
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
              quote: l('Found the exact emotional temperature of our film in the very first rough sketch.'),
              author: l('Zoya Akhtar-Mirza'),
              role: l('Film Director'),
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
    id: 'music-06',
    name: 'Soundstage',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Poster Crimson light theme for sound designers — Mono headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #ffffff 0%, #fadede 55%, #dc2626 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#dc2626',
        surface: '#ffffff',
        text: '#141414',
        fontHeading: 'Mono',
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
          eyebrow: l('Sound Designer'),
          headline: l('Music built for deep listening and loud rooms.'),
          subheadline: l('Available for film scoring, album production, mixing and international festival bookings.'),
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
          body: l('Available for film scoring, album production, mixing and international festival bookings. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Sound Design', 'Orchestration', 'Foley', 'Touring Rig Setup'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: '',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
            },
            {
              title: l('Monsoon Signals (LP)'),
              description: l('10-track debut album combining Indian classical strings with analog tape synths; 1.8M streams.'),
              url: '',
              imageUrl: '',
              tags: ['Album', 'Electronic'],
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
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('YouTube'), url: 'https://youtube.com/@yourname' }, { label: l('Instagram'), url: 'https://instagram.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'music-07',
    name: 'Modular Patch',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Abyssal Violet dark theme for session guitarists — Outfit headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f5f3ff',
        accent: '#a78bfa',
        surface: '#0b0917',
        text: '#e0daf8',
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
          eyebrow: l('Session Guitarist'),
          headline: l('Your Name'),
          subheadline: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases.'),
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
          body: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Monsoon Signals (LP)'),
              description: l('10-track debut album combining Indian classical strings with analog tape synths; 1.8M streams.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Album', 'Electronic'],
            },
            {
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
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
              quote: l('Found the exact emotional temperature of our film in the very first rough sketch.'),
              author: l('Zoya Akhtar-Mirza'),
              role: l('Film Director'),
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
    id: 'music-08',
    name: 'Vinyl Cut',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Cyber Cyan dark theme for dj & curators — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #050c10 0%, #0b3841 55%, #22d3ee 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#e8feff',
        accent: '#22d3ee',
        surface: '#050c10',
        text: '#c7ecf0',
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
          eyebrow: l('DJ & Curator'),
          headline: l('Soundscapes between analog warmth and modern pulse.'),
          subheadline: l('Blending acoustic instrumentation, modular synthesis and spatial audio from my studio in Mumbai.'),
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
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: '',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: '',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Mixing & Mastering', 'Dolby Atmos', 'Vocal Production', 'Live Looping'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Found the exact emotional temperature of our film in the very first rough sketch.'),
              author: l('Zoya Akhtar-Mirza'),
              role: l('Film Director'),
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
          location: l('Hyderabad, India'),
          links: [{ label: l('YouTube'), url: 'https://youtube.com/@yourname' }, { label: l('Instagram'), url: 'https://instagram.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'music-09',
    name: 'Nocturne',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Acid Lime light theme for orchestral arrangers — Mono headings with centered hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f3f7ec 0%, #d2e5d2 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#15803d',
        surface: '#f3f7ec',
        text: '#141414',
        fontHeading: 'Mono',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Orchestral Arranger'),
          headline: l('Original scores, production and live sets.'),
          subheadline: l('Available for film scoring, album production, mixing and international festival bookings.'),
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
          body: l('Available for film scoring, album production, mixing and international festival bookings. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Toolkit'),
          items: ['Sound Design', 'Orchestration', 'Foley', 'Touring Rig Setup'],
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
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
            },
            {
              title: l('Monsoon Signals (LP)'),
              description: l('10-track debut album combining Indian classical strings with analog tape synths; 1.8M streams.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Album', 'Electronic'],
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
          location: l('Coimbatore, India'),
          links: [{ label: l('Spotify'), url: 'https://open.spotify.com' }, { label: l('SoundCloud'), url: 'https://soundcloud.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'music-10',
    name: 'Echo Chamber',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Charcoal Amber dark theme for podcast & audio directors — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fffbeb',
        accent: '#fbbf24',
        surface: '#100e0a',
        text: '#ede5ce',
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
          eyebrow: l('Podcast & Audio Director'),
          headline: l('Your Name'),
          subheadline: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases.'),
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
          items: ['Ableton Live', 'Logic Pro', 'Film Scoring', 'Modular Synthesis'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Monsoon Signals (LP)'),
              description: l('10-track debut album combining Indian classical strings with analog tape synths; 1.8M streams.'),
              url: '',
              imageUrl: '',
              tags: ['Album', 'Electronic'],
            },
            {
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: '',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: '',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
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
              role: l('Composer & Producer'),
              company: l('EchoRoom Studio'),
              period: l('2020 — Present'),
              description: l('Produced 14 EPs, 3 feature film scores and commercial sonic branding.'),
            },
            {
              role: l('Mix Engineer'),
              company: l('Soundcraft House'),
              period: l('2017 — 2020'),
              description: l('Tracking, vocal editing and stereo/surround mixing.'),
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
              quote: l('Found the exact emotional temperature of our film in the very first rough sketch.'),
              author: l('Zoya Akhtar-Mirza'),
              role: l('Film Director'),
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
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('YouTube'), url: 'https://youtube.com/@yourname' }, { label: l('Instagram'), url: 'https://instagram.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'music-11',
    name: 'Staccato',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Laser Violet dark theme for indie band leaders — Fraunces headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #080512 0%, #302145 55%, #c084fc 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f4ebff',
        accent: '#c084fc',
        surface: '#080512',
        text: '#dfd0f5',
        fontHeading: 'Fraunces',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Indie Band Leader'),
          headline: l('Crafting sonic identity for film, games and records.'),
          subheadline: l('Blending acoustic instrumentation, modular synthesis and spatial audio from my studio in Mumbai.'),
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
          body: l('Blending acoustic instrumentation, modular synthesis and spatial audio from my studio in Mumbai. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Composer & Producer'),
              company: l('EchoRoom Studio'),
              period: l('2020 — Present'),
              description: l('Produced 14 EPs, 3 feature film scores and commercial sonic branding.'),
            },
            {
              role: l('Mix Engineer'),
              company: l('Soundcraft House'),
              period: l('2017 — 2020'),
              description: l('Tracking, vocal editing and stereo/surround mixing.'),
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
              degree: l('Diploma in Audio Engineering'),
              school: l('KM Music Conservatory'),
              period: l('2015 — 2017'),
              description: l('Electro-acoustic composition and studio production.'),
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
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
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
          location: l('Remote'),
          links: [{ label: l('Spotify'), url: 'https://open.spotify.com' }, { label: l('SoundCloud'), url: 'https://soundcloud.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'music-12',
    name: 'Pulse 128',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Cobalt Slab light theme for modular synth artists — Mono headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f4f4f5 0%, #d5def4 55%, #2563eb 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#09090b',
        accent: '#2563eb',
        surface: '#f4f4f5',
        text: '#18181b',
        fontHeading: 'Mono',
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
          eyebrow: l('Modular Synth Artist'),
          headline: l('Music built for deep listening and loud rooms.'),
          subheadline: l('Available for film scoring, album production, mixing and international festival bookings.'),
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
          items: ['Sound Design', 'Orchestration', 'Foley', 'Touring Rig Setup'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Composer & Producer'),
              company: l('EchoRoom Studio'),
              period: l('2020 — Present'),
              description: l('Produced 14 EPs, 3 feature film scores and commercial sonic branding.'),
            },
            {
              role: l('Mix Engineer'),
              company: l('Soundcraft House'),
              period: l('2017 — 2020'),
              description: l('Tracking, vocal editing and stereo/surround mixing.'),
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
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: '',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
            },
            {
              title: l('Monsoon Signals (LP)'),
              description: l('10-track debut album combining Indian classical strings with analog tape synths; 1.8M streams.'),
              url: '',
              imageUrl: '',
              tags: ['Album', 'Electronic'],
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
    id: 'music-13',
    name: 'Velvet Chord',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Velvet Rose dark theme for acoustic performers — Outfit headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
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
          eyebrow: l('Acoustic Performer'),
          headline: l('Your Name'),
          subheadline: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases.'),
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
              title: l('Monsoon Signals (LP)'),
              description: l('10-track debut album combining Indian classical strings with analog tape synths; 1.8M streams.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Album', 'Electronic'],
            },
            {
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Composer & Producer'),
              company: l('EchoRoom Studio'),
              period: l('2020 — Present'),
              description: l('Produced 14 EPs, 3 feature film scores and commercial sonic branding.'),
            },
            {
              role: l('Mix Engineer'),
              company: l('Soundcraft House'),
              period: l('2017 — 2020'),
              description: l('Tracking, vocal editing and stereo/surround mixing.'),
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
    id: 'music-14',
    name: 'Foley Room',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Plasma Orange dark theme for playback & studio vocalists — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #0f0704 0%, #432610 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1e6',
        accent: '#fb923c',
        surface: '#0f0704',
        text: '#f2d9c7',
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
          eyebrow: l('Playback & Studio Vocalist'),
          headline: l('Soundscapes between analog warmth and modern pulse.'),
          subheadline: l('Blending acoustic instrumentation, modular synthesis and spatial audio from my studio in Mumbai.'),
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
          title: l('Overview'),
          body: l('Blending acoustic instrumentation, modular synthesis and spatial audio from my studio in Mumbai. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: '',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: '',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
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
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('YouTube'), url: 'https://youtube.com/@yourname' }, { label: l('Instagram'), url: 'https://instagram.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'music-15',
    name: 'Score Sheet',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Cyber Magenta light theme for beatmaker & arrangers — Mono headings with centered hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #faf5ff 0%, #f1d6f8 55%, #c026d3 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0c',
        accent: '#c026d3',
        surface: '#faf5ff',
        text: '#16121a',
        fontHeading: 'Mono',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Beatmaker & Arranger'),
          headline: l('Original scores, production and live sets.'),
          subheadline: l('Available for film scoring, album production, mixing and international festival bookings.'),
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
          body: l('Available for film scoring, album production, mixing and international festival bookings. Based in Remote, working with teams worldwide.'),
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
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Found the exact emotional temperature of our film in the very first rough sketch.'),
              author: l('Zoya Akhtar-Mirza'),
              role: l('Film Director'),
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
    id: 'music-16',
    name: 'Live Set',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Deep Teal dark theme for spatial audio engineers — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f0fdfa',
        accent: '#2dd4bf',
        surface: '#071112',
        text: '#cce8e4',
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
          eyebrow: l('Spatial Audio Engineer'),
          headline: l('Your Name'),
          subheadline: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases.'),
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
          body: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Ableton Live', 'Logic Pro', 'Film Scoring', 'Modular Synthesis'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Monsoon Signals (LP)'),
              description: l('10-track debut album combining Indian classical strings with analog tape synths; 1.8M streams.'),
              url: '',
              imageUrl: '',
              tags: ['Album', 'Electronic'],
            },
            {
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: '',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: '',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
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
          location: l('Hyderabad, India'),
          links: [{ label: l('YouTube'), url: 'https://youtube.com/@yourname' }, { label: l('Instagram'), url: 'https://instagram.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'music-17',
    name: 'Harmonic',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Volt Gold dark theme for music directors — Fraunces headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0c0b04 0%, #403508 55%, #facc15 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fefce8',
        accent: '#facc15',
        surface: '#0c0b04',
        text: '#ebe5ba',
        fontHeading: 'Fraunces',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Music Director'),
          headline: l('Crafting sonic identity for film, games and records.'),
          subheadline: l('Blending acoustic instrumentation, modular synthesis and spatial audio from my studio in Mumbai.'),
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
          body: l('Blending acoustic instrumentation, modular synthesis and spatial audio from my studio in Mumbai. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
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
              quote: l('Found the exact emotional temperature of our film in the very first rough sketch.'),
              author: l('Zoya Akhtar-Mirza'),
              role: l('Film Director'),
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
    id: 'music-18',
    name: 'Breakbeat',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Tangerine Concrete light theme for classical crossover artists — Mono headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f5f5f4 0%, #f3ddd1 55%, #ea580c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d0d0d',
        accent: '#ea580c',
        surface: '#f5f5f4',
        text: '#1c1917',
        fontHeading: 'Mono',
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
          eyebrow: l('Classical Crossover Artist'),
          headline: l('Music built for deep listening and loud rooms.'),
          subheadline: l('Available for film scoring, album production, mixing and international festival bookings.'),
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
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: '',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
            },
            {
              title: l('Monsoon Signals (LP)'),
              description: l('10-track debut album combining Indian classical strings with analog tape synths; 1.8M streams.'),
              url: '',
              imageUrl: '',
              tags: ['Album', 'Electronic'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Sound Design', 'Orchestration', 'Foley', 'Touring Rig Setup'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Found the exact emotional temperature of our film in the very first rough sketch.'),
              author: l('Zoya Akhtar-Mirza'),
              role: l('Film Director'),
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
          location: l('Thiruvananthapuram, India'),
          links: [{ label: l('YouTube'), url: 'https://youtube.com/@yourname' }, { label: l('Instagram'), url: 'https://instagram.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'music-19',
    name: 'Resonance',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Smoked Tangerine dark theme for foley & post engineers — Outfit headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #120c08 0%, #452913 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff7ed',
        accent: '#fb923c',
        surface: '#120c08',
        text: '#f0dfd1',
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
          eyebrow: l('Foley & Post Engineer'),
          headline: l('Your Name'),
          subheadline: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases.'),
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
          body: l('Producer, composer and mixing engineer scoring independent cinema, interactive games and electronic releases. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Toolkit'),
          items: ['Ableton Live', 'Logic Pro', 'Film Scoring', 'Modular Synthesis'],
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
              title: l('Monsoon Signals (LP)'),
              description: l('10-track debut album combining Indian classical strings with analog tape synths; 1.8M streams.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Album', 'Electronic'],
            },
            {
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
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
          location: l('Remote'),
          links: [{ label: l('Spotify'), url: 'https://open.spotify.com' }, { label: l('SoundCloud'), url: 'https://soundcloud.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'music-20',
    name: 'Encore',
    category: 'music',
    family: 'Music Artist',
    audience: ['musician', 'producer', 'composer'],
    description: 'Hyper Blue dark theme for touring percussionists — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #040814 0%, #182b47 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ebf3ff',
        accent: '#60a5fa',
        surface: '#040814',
        text: '#cde0f8',
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
          eyebrow: l('Touring Percussionist'),
          headline: l('Soundscapes between analog warmth and modern pulse.'),
          subheadline: l('Blending acoustic instrumentation, modular synthesis and spatial audio from my studio in Mumbai.'),
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
          items: ['Mixing & Mastering', 'Dolby Atmos', 'Vocal Production', 'Live Looping'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('The Last Ferry (Film Score)'),
              description: l('Original chamber and synth score premiered at MAMI Film Festival.'),
              url: '',
              imageUrl: '',
              tags: ['Film Score', 'Cinema'],
            },
            {
              title: l('Driftwood Interactive Audio'),
              description: l('Adaptive dynamic soundtrack and 400+ foley assets for an indie adventure game.'),
              url: '',
              imageUrl: '',
              tags: ['Game Audio', 'Foley'],
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
              role: l('Composer & Producer'),
              company: l('EchoRoom Studio'),
              period: l('2020 — Present'),
              description: l('Produced 14 EPs, 3 feature film scores and commercial sonic branding.'),
            },
            {
              role: l('Mix Engineer'),
              company: l('Soundcraft House'),
              period: l('2017 — 2020'),
              description: l('Tracking, vocal editing and stereo/surround mixing.'),
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
              quote: l('Found the exact emotional temperature of our film in the very first rough sketch.'),
              author: l('Zoya Akhtar-Mirza'),
              role: l('Film Director'),
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
          location: l('Hyderabad, India'),
          links: [{ label: l('YouTube'), url: 'https://youtube.com/@yourname' }, { label: l('Instagram'), url: 'https://instagram.com/yourname' }],
        },
      }
    ],
  },
];
