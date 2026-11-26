// Auto-generated template seeds — Glassmorphism (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_GLASS: SeedTemplate[] = [
  {
    id: 'glass-02',
    name: 'Frost Pane',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Obsidian Emerald dark theme for design studios — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Design Studio'),
          headline: l('Interfaces with atmosphere.'),
          subheadline: l('A focused product and brand design studio crafting luminous web experiences for modern software teams.'),
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
          body: l('A focused product and brand design studio crafting luminous web experiences for modern software teams. Based in Delhi, working with teams worldwide.'),
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
              company: l('Atelier Lumen'),
              period: l('2022 — Present'),
              description: l('Leading a 4-person design practice partnering with AI and developer-tool startups.'),
            },
            {
              role: l('Staff Product Designer'),
              company: l('Horizon Labs'),
              period: l('2019 — 2022'),
              description: l('Defined visual language and core interaction patterns.'),
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
              degree: l('M.Des. Digital Product Design'),
              school: l('IDC School of Design, IIT Bombay'),
              period: l('2017 — 2019'),
              description: l('Research on spatial depth cues and visual hierarchy.'),
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
              title: l('Spatial OS Concept'),
              description: l('Glass-layered windowing and gesture language for a next-gen productivity workspace.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Spatial UI', 'System'],
            },
            {
              title: l('Lumina AI Flagship'),
              description: l('Redesigned brand identity, interactive product demo and pricing funnel; 2.4x demo signups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Web'],
            },
            {
              title: l('Audio Synth Companion'),
              description: l('Tactile dark-glass desktop controller UI for hardware synthesizer musicians.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Desktop UI', 'Audio'],
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
          location: l('Delhi, India'),
          links: [{ label: l('Dribbble'), url: 'https://dribbble.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'glass-03',
    name: 'Aurora Veil',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Lavender Fog light theme for product & brand partners — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f3f0fc 0%, #dfd2f7 55%, #6d28d9 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#18142c',
        accent: '#6d28d9',
        surface: '#f3f0fc',
        text: '#272142',
        fontHeading: 'Fraunces',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Product & Brand Partner'),
          headline: l('Depth, light and effortless clarity.'),
          subheadline: l('Blending tactile surfaces, fluid motion and rock-solid component engineering.'),
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
          items: ['Brand Identity', '3D Art Direction', 'Interactive Web', 'Prototyping'],
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
              company: l('Atelier Lumen'),
              period: l('2022 — Present'),
              description: l('Leading a 4-person design practice partnering with AI and developer-tool startups.'),
            },
            {
              role: l('Staff Product Designer'),
              company: l('Horizon Labs'),
              period: l('2019 — 2022'),
              description: l('Defined visual language and core interaction patterns.'),
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
              title: l('Lumina AI Flagship'),
              description: l('Redesigned brand identity, interactive product demo and pricing funnel; 2.4x demo signups.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Web'],
            },
            {
              title: l('Audio Synth Companion'),
              description: l('Tactile dark-glass desktop controller UI for hardware synthesizer musicians.'),
              url: '',
              imageUrl: '',
              tags: ['Desktop UI', 'Audio'],
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
    id: 'glass-04',
    name: 'Crystal Layer',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Matrix Lime dark theme for interactive art directors — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #050a07 0%, #143922 55%, #4ade80 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ebffef',
        accent: '#4ade80',
        surface: '#050a07',
        text: '#c9f2d2',
        fontHeading: 'System',
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
          eyebrow: l('Interactive Art Director'),
          headline: l('Where brand meets spatial UI.'),
          subheadline: l('We partner with seed-to-Series B founders to launch memorable products and marketing sites.'),
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
              title: l('Audio Synth Companion'),
              description: l('Tactile dark-glass desktop controller UI for hardware synthesizer musicians.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Desktop UI', 'Audio'],
            },
            {
              title: l('Fintech Wealth App'),
              description: l('Calm portfolio analytics and goal cards with subtle depth hierarchy.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mobile', 'Fintech'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('We partner with seed-to-Series B founders to launch memorable products and marketing sites. Based in Indore, working with teams worldwide.'),
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
              company: l('Atelier Lumen'),
              period: l('2022 — Present'),
              description: l('Leading a 4-person design practice partnering with AI and developer-tool startups.'),
            },
            {
              role: l('Staff Product Designer'),
              company: l('Horizon Labs'),
              period: l('2019 — 2022'),
              description: l('Defined visual language and core interaction patterns.'),
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
    id: 'glass-05',
    name: 'Vapor Prism',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Midnight Cobalt dark theme for spatial ui designers — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Spatial UI Designer'),
          headline: l('Your Name'),
          subheadline: l('A focused product and brand design studio crafting luminous web experiences for modern software teams.'),
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
              url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
              alt: l('Responsive layout composition'),
              caption: l('Web craft'),
            },
            {
              url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Interface system exploration'),
              caption: l('System UI'),
            },
            {
              url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
              alt: l('Brand identity and typography specimen'),
              caption: l('Brand identity'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Overview'),
          body: l('A focused product and brand design studio crafting luminous web experiences for modern software teams. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Fintech Wealth App'),
              description: l('Calm portfolio analytics and goal cards with subtle depth hierarchy.'),
              url: '',
              imageUrl: '',
              tags: ['Mobile', 'Fintech'],
            },
            {
              title: l('Spatial OS Concept'),
              description: l('Glass-layered windowing and gesture language for a next-gen productivity workspace.'),
              url: '',
              imageUrl: '',
              tags: ['Spatial UI', 'System'],
            },
            {
              title: l('Lumina AI Flagship'),
              description: l('Redesigned brand identity, interactive product demo and pricing funnel; 2.4x demo signups.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Web'],
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
          location: l('Remote · India'),
          links: [{ label: l('Dribbble'), url: 'https://dribbble.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'glass-06',
    name: 'Opal Mist',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Sage Mist light theme for creative agencys — Fraunces headings with editorial hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Creative Agency'),
          headline: l('Digital flagships for ambitious teams.'),
          subheadline: l('Blending tactile surfaces, fluid motion and rock-solid component engineering.'),
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
          body: l('Blending tactile surfaces, fluid motion and rock-solid component engineering. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Gallery'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Interface system exploration'),
              caption: l('System UI'),
            },
            {
              url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
              alt: l('Brand identity and typography specimen'),
              caption: l('Brand identity'),
            },
            {
              url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop&q=80',
              alt: l('Interactive product screen study'),
              caption: l('Product UI'),
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
              quote: l('Elevated our product from looking like a prototype to feeling category-defining.'),
              author: l('Ananya Verma'),
              role: l('Co-founder, Lumina'),
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
    id: 'glass-07',
    name: 'Dew Refraction',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Synthwave Pink dark theme for motion & brand leads — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #0c0512 0%, #3f1d36 55%, #f472b6 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ffeef8',
        accent: '#f472b6',
        surface: '#0c0512',
        text: '#f0cfe3',
        fontHeading: 'System',
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
          eyebrow: l('Motion & Brand Lead'),
          headline: l('Translucent craft, solid engineering.'),
          subheadline: l('We partner with seed-to-Series B founders to launch memorable products and marketing sites.'),
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
          body: l('We partner with seed-to-Series B founders to launch memorable products and marketing sites. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Design Engineering', 'Tokens', 'Micro-interactions', 'Launch Campaigns'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Lumina AI Flagship'),
              description: l('Redesigned brand identity, interactive product demo and pricing funnel; 2.4x demo signups.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Web'],
            },
            {
              title: l('Audio Synth Companion'),
              description: l('Tactile dark-glass desktop controller UI for hardware synthesizer musicians.'),
              url: '',
              imageUrl: '',
              tags: ['Desktop UI', 'Audio'],
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
          location: l('Kochi, India'),
          links: [{ label: l('Figma'), url: 'https://www.figma.com/@yourname' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'glass-08',
    name: 'Lucid Depth',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Abyssal Violet dark theme for design engineers — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Design Engineer'),
          headline: l('Interfaces with atmosphere.'),
          subheadline: l('A focused product and brand design studio crafting luminous web experiences for modern software teams.'),
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
          body: l('A focused product and brand design studio crafting luminous web experiences for modern software teams. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Audio Synth Companion'),
              description: l('Tactile dark-glass desktop controller UI for hardware synthesizer musicians.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Desktop UI', 'Audio'],
            },
            {
              title: l('Fintech Wealth App'),
              description: l('Calm portfolio analytics and goal cards with subtle depth hierarchy.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mobile', 'Fintech'],
            },
            {
              title: l('Spatial OS Concept'),
              description: l('Glass-layered windowing and gesture language for a next-gen productivity workspace.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Spatial UI', 'System'],
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
              quote: l('Elevated our product from looking like a prototype to feeling category-defining.'),
              author: l('Ananya Verma'),
              role: l('Co-founder, Lumina'),
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
    id: 'glass-09',
    name: 'Translucent',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Blush Stone light theme for visual systems studios — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #fcf1f3 0%, #f3d0d8 55%, #be123c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261418',
        accent: '#be123c',
        surface: '#fcf1f3',
        text: '#362025',
        fontHeading: 'Fraunces',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Visual Systems Studio'),
          headline: l('Depth, light and effortless clarity.'),
          subheadline: l('Blending tactile surfaces, fluid motion and rock-solid component engineering.'),
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
              title: l('Fintech Wealth App'),
              description: l('Calm portfolio analytics and goal cards with subtle depth hierarchy.'),
              url: '',
              imageUrl: '',
              tags: ['Mobile', 'Fintech'],
            },
            {
              title: l('Spatial OS Concept'),
              description: l('Glass-layered windowing and gesture language for a next-gen productivity workspace.'),
              url: '',
              imageUrl: '',
              tags: ['Spatial UI', 'System'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Brand Identity', '3D Art Direction', 'Interactive Web', 'Prototyping'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Elevated our product from looking like a prototype to feeling category-defining.'),
              author: l('Ananya Verma'),
              role: l('Co-founder, Lumina'),
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
          location: l('Remote · India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'glass-10',
    name: 'Ice Bloom',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Cyber Cyan dark theme for digital flagship designers — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #050c10 0%, #0b3841 55%, #22d3ee 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#e8feff',
        accent: '#22d3ee',
        surface: '#050c10',
        text: '#c7ecf0',
        fontHeading: 'System',
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
          eyebrow: l('Digital Flagship Designer'),
          headline: l('Where brand meets spatial UI.'),
          subheadline: l('We partner with seed-to-Series B founders to launch memorable products and marketing sites.'),
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
          body: l('We partner with seed-to-Series B founders to launch memorable products and marketing sites. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Toolkit'),
          items: ['Design Engineering', 'Tokens', 'Micro-interactions', 'Launch Campaigns'],
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Gallery'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Interface system exploration'),
              caption: l('System UI'),
            },
            {
              url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
              alt: l('Brand identity and typography specimen'),
              caption: l('Brand identity'),
            },
            {
              url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop&q=80',
              alt: l('Interactive product screen study'),
              caption: l('Product UI'),
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
              title: l('Spatial OS Concept'),
              description: l('Glass-layered windowing and gesture language for a next-gen productivity workspace.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Spatial UI', 'System'],
            },
            {
              title: l('Lumina AI Flagship'),
              description: l('Redesigned brand identity, interactive product demo and pricing funnel; 2.4x demo signups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Web'],
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
          location: l('Delhi, India'),
          links: [{ label: l('Figma'), url: 'https://www.figma.com/@yourname' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'glass-11',
    name: 'Glaze Studio',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Charcoal Amber dark theme for ai product designers — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('AI Product Designer'),
          headline: l('Your Name'),
          subheadline: l('A focused product and brand design studio crafting luminous web experiences for modern software teams.'),
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
          items: ['Product UI', 'Spatial Interfaces', 'Design Systems', 'Motion Design'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Lumina AI Flagship'),
              description: l('Redesigned brand identity, interactive product demo and pricing funnel; 2.4x demo signups.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Web'],
            },
            {
              title: l('Audio Synth Companion'),
              description: l('Tactile dark-glass desktop controller UI for hardware synthesizer musicians.'),
              url: '',
              imageUrl: '',
              tags: ['Desktop UI', 'Audio'],
            },
            {
              title: l('Fintech Wealth App'),
              description: l('Calm portfolio analytics and goal cards with subtle depth hierarchy.'),
              url: '',
              imageUrl: '',
              tags: ['Mobile', 'Fintech'],
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
              company: l('Atelier Lumen'),
              period: l('2022 — Present'),
              description: l('Leading a 4-person design practice partnering with AI and developer-tool startups.'),
            },
            {
              role: l('Staff Product Designer'),
              company: l('Horizon Labs'),
              period: l('2019 — 2022'),
              description: l('Defined visual language and core interaction patterns.'),
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
              quote: l('Elevated our product from looking like a prototype to feeling category-defining.'),
              author: l('Ananya Verma'),
              role: l('Co-founder, Lumina'),
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
          location: l('Kochi, India'),
          links: [{ label: l('Dribbble'), url: 'https://dribbble.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'glass-12',
    name: 'Aero Glass',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Glacier Blue light theme for 3d & interface designers — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #eff7fd 0%, #cce2ef 55%, #0369a1 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1c2b',
        accent: '#0369a1',
        surface: '#eff7fd',
        text: '#1a2c3d',
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
          eyebrow: l('3D & Interface Designer'),
          headline: l('Digital flagships for ambitious teams.'),
          subheadline: l('Blending tactile surfaces, fluid motion and rock-solid component engineering.'),
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
          body: l('Blending tactile surfaces, fluid motion and rock-solid component engineering. Based in Indore, working with teams worldwide.'),
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
              company: l('Atelier Lumen'),
              period: l('2022 — Present'),
              description: l('Leading a 4-person design practice partnering with AI and developer-tool startups.'),
            },
            {
              role: l('Staff Product Designer'),
              company: l('Horizon Labs'),
              period: l('2019 — 2022'),
              description: l('Defined visual language and core interaction patterns.'),
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
              degree: l('M.Des. Digital Product Design'),
              school: l('IDC School of Design, IIT Bombay'),
              period: l('2017 — 2019'),
              description: l('Research on spatial depth cues and visual hierarchy.'),
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
              title: l('Audio Synth Companion'),
              description: l('Tactile dark-glass desktop controller UI for hardware synthesizer musicians.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Desktop UI', 'Audio'],
            },
            {
              title: l('Fintech Wealth App'),
              description: l('Calm portfolio analytics and goal cards with subtle depth hierarchy.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mobile', 'Fintech'],
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
          location: l('Indore, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'glass-13',
    name: 'Cloud Lens',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Laser Violet dark theme for founding design partners — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #080512 0%, #302145 55%, #c084fc 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f4ebff',
        accent: '#c084fc',
        surface: '#080512',
        text: '#dfd0f5',
        fontHeading: 'System',
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
          eyebrow: l('Founding Design Partner'),
          headline: l('Translucent craft, solid engineering.'),
          subheadline: l('We partner with seed-to-Series B founders to launch memorable products and marketing sites.'),
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
          items: ['Design Engineering', 'Tokens', 'Micro-interactions', 'Launch Campaigns'],
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
              company: l('Atelier Lumen'),
              period: l('2022 — Present'),
              description: l('Leading a 4-person design practice partnering with AI and developer-tool startups.'),
            },
            {
              role: l('Staff Product Designer'),
              company: l('Horizon Labs'),
              period: l('2019 — 2022'),
              description: l('Defined visual language and core interaction patterns.'),
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
              title: l('Fintech Wealth App'),
              description: l('Calm portfolio analytics and goal cards with subtle depth hierarchy.'),
              url: '',
              imageUrl: '',
              tags: ['Mobile', 'Fintech'],
            },
            {
              title: l('Spatial OS Concept'),
              description: l('Glass-layered windowing and gesture language for a next-gen productivity workspace.'),
              url: '',
              imageUrl: '',
              tags: ['Spatial UI', 'System'],
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
    id: 'glass-14',
    name: 'Halo Surface',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Velvet Rose dark theme for brand experience leads — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Brand Experience Lead'),
          headline: l('Interfaces with atmosphere.'),
          subheadline: l('A focused product and brand design studio crafting luminous web experiences for modern software teams.'),
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
              title: l('Spatial OS Concept'),
              description: l('Glass-layered windowing and gesture language for a next-gen productivity workspace.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Spatial UI', 'System'],
            },
            {
              title: l('Lumina AI Flagship'),
              description: l('Redesigned brand identity, interactive product demo and pricing funnel; 2.4x demo signups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Web'],
            },
            {
              title: l('Audio Synth Companion'),
              description: l('Tactile dark-glass desktop controller UI for hardware synthesizer musicians.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Desktop UI', 'Audio'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('A focused product and brand design studio crafting luminous web experiences for modern software teams. Based in Delhi, working with teams worldwide.'),
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
              company: l('Atelier Lumen'),
              period: l('2022 — Present'),
              description: l('Leading a 4-person design practice partnering with AI and developer-tool startups.'),
            },
            {
              role: l('Staff Product Designer'),
              company: l('Horizon Labs'),
              period: l('2019 — 2022'),
              description: l('Defined visual language and core interaction patterns.'),
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
    id: 'glass-15',
    name: 'Quartz Film',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Apricot Cream light theme for design consultancys — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fff4ec 0%, #f6d9ca 55%, #c2410c 140%)',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Design Consultancy'),
          headline: l('Depth, light and effortless clarity.'),
          subheadline: l('Blending tactile surfaces, fluid motion and rock-solid component engineering.'),
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
              url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
              alt: l('Brand identity and typography specimen'),
              caption: l('Brand identity'),
            },
            {
              url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop&q=80',
              alt: l('Interactive product screen study'),
              caption: l('Product UI'),
            },
            {
              url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
              alt: l('Responsive layout composition'),
              caption: l('Web craft'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Overview'),
          body: l('Blending tactile surfaces, fluid motion and rock-solid component engineering. Based in Kochi, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Lumina AI Flagship'),
              description: l('Redesigned brand identity, interactive product demo and pricing funnel; 2.4x demo signups.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Web'],
            },
            {
              title: l('Audio Synth Companion'),
              description: l('Tactile dark-glass desktop controller UI for hardware synthesizer musicians.'),
              url: '',
              imageUrl: '',
              tags: ['Desktop UI', 'Audio'],
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
          location: l('Kochi, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'glass-16',
    name: 'Lumen Frost',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Plasma Orange dark theme for web craft studios — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #0f0704 0%, #432610 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1e6',
        accent: '#fb923c',
        surface: '#0f0704',
        text: '#f2d9c7',
        fontHeading: 'System',
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
          eyebrow: l('Web Craft Studio'),
          headline: l('Where brand meets spatial UI.'),
          subheadline: l('We partner with seed-to-Series B founders to launch memorable products and marketing sites.'),
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
          body: l('We partner with seed-to-Series B founders to launch memorable products and marketing sites. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Selected Frames'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop&q=80',
              alt: l('Interactive product screen study'),
              caption: l('Product UI'),
            },
            {
              url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
              alt: l('Responsive layout composition'),
              caption: l('Web craft'),
            },
            {
              url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Interface system exploration'),
              caption: l('System UI'),
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
              quote: l('Elevated our product from looking like a prototype to feeling category-defining.'),
              author: l('Ananya Verma'),
              role: l('Co-founder, Lumina'),
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
    id: 'glass-17',
    name: 'Sheer Horizon',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Deep Teal dark theme for app experience designers — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('App Experience Designer'),
          headline: l('Your Name'),
          subheadline: l('A focused product and brand design studio crafting luminous web experiences for modern software teams.'),
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
          body: l('A focused product and brand design studio crafting luminous web experiences for modern software teams. Based in Remote · India, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Product UI', 'Spatial Interfaces', 'Design Systems', 'Motion Design'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Fintech Wealth App'),
              description: l('Calm portfolio analytics and goal cards with subtle depth hierarchy.'),
              url: '',
              imageUrl: '',
              tags: ['Mobile', 'Fintech'],
            },
            {
              title: l('Spatial OS Concept'),
              description: l('Glass-layered windowing and gesture language for a next-gen productivity workspace.'),
              url: '',
              imageUrl: '',
              tags: ['Spatial UI', 'System'],
            },
            {
              title: l('Lumina AI Flagship'),
              description: l('Redesigned brand identity, interactive product demo and pricing funnel; 2.4x demo signups.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Web'],
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
          location: l('Remote · India'),
          links: [{ label: l('Dribbble'), url: 'https://dribbble.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'glass-18',
    name: 'Mirage Pane',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Mint Frost light theme for launch campaign studios — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #eefaf7 0%, #cde6e2 55%, #0f766e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e221e',
        accent: '#0f766e',
        surface: '#eefaf7',
        text: '#1a322d',
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
          eyebrow: l('Launch Campaign Studio'),
          headline: l('Digital flagships for ambitious teams.'),
          subheadline: l('Blending tactile surfaces, fluid motion and rock-solid component engineering.'),
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
          body: l('Blending tactile surfaces, fluid motion and rock-solid component engineering. Based in Delhi, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Spatial OS Concept'),
              description: l('Glass-layered windowing and gesture language for a next-gen productivity workspace.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Spatial UI', 'System'],
            },
            {
              title: l('Lumina AI Flagship'),
              description: l('Redesigned brand identity, interactive product demo and pricing funnel; 2.4x demo signups.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Brand', 'Web'],
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
              quote: l('Elevated our product from looking like a prototype to feeling category-defining.'),
              author: l('Ananya Verma'),
              role: l('Co-founder, Lumina'),
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
    id: 'glass-19',
    name: 'Polar Glow',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Volt Gold dark theme for prototype partners — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #0c0b04 0%, #403508 55%, #facc15 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fefce8',
        accent: '#facc15',
        surface: '#0c0b04',
        text: '#ebe5ba',
        fontHeading: 'System',
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
          eyebrow: l('Prototype Partner'),
          headline: l('Translucent craft, solid engineering.'),
          subheadline: l('We partner with seed-to-Series B founders to launch memorable products and marketing sites.'),
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
              title: l('Lumina AI Flagship'),
              description: l('Redesigned brand identity, interactive product demo and pricing funnel; 2.4x demo signups.'),
              url: '',
              imageUrl: '',
              tags: ['Brand', 'Web'],
            },
            {
              title: l('Audio Synth Companion'),
              description: l('Tactile dark-glass desktop controller UI for hardware synthesizer musicians.'),
              url: '',
              imageUrl: '',
              tags: ['Desktop UI', 'Audio'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Design Engineering', 'Tokens', 'Micro-interactions', 'Launch Campaigns'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Elevated our product from looking like a prototype to feeling category-defining.'),
              author: l('Ananya Verma'),
              role: l('Co-founder, Lumina'),
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
          location: l('Kochi, India'),
          links: [{ label: l('Figma'), url: 'https://www.figma.com/@yourname' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'glass-20',
    name: 'Silk Blur',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Smoked Tangerine dark theme for product craft leads — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Product Craft Lead'),
          headline: l('Interfaces with atmosphere.'),
          subheadline: l('A focused product and brand design studio crafting luminous web experiences for modern software teams.'),
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
          body: l('A focused product and brand design studio crafting luminous web experiences for modern software teams. Based in Indore, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Toolkit'),
          items: ['Product UI', 'Spatial Interfaces', 'Design Systems', 'Motion Design'],
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Selected Frames'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&auto=format&fit=crop&q=80',
              alt: l('Interactive product screen study'),
              caption: l('Product UI'),
            },
            {
              url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
              alt: l('Responsive layout composition'),
              caption: l('Web craft'),
            },
            {
              url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=80',
              alt: l('Interface system exploration'),
              caption: l('System UI'),
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
              title: l('Audio Synth Companion'),
              description: l('Tactile dark-glass desktop controller UI for hardware synthesizer musicians.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Desktop UI', 'Audio'],
            },
            {
              title: l('Fintech Wealth App'),
              description: l('Calm portfolio analytics and goal cards with subtle depth hierarchy.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Mobile', 'Fintech'],
            },
            {
              title: l('Spatial OS Concept'),
              description: l('Glass-layered windowing and gesture language for a next-gen productivity workspace.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Spatial UI', 'System'],
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
          location: l('Indore, India'),
          links: [{ label: l('Dribbble'), url: 'https://dribbble.com/yourname' }, { label: l('Behance'), url: 'https://www.behance.net/yourname' }],
        },
      }
    ],
  },
  {
    id: 'glass-21',
    name: 'Vitro',
    category: 'glass',
    family: 'Glassmorphism',
    audience: ['designer', 'agency', 'founder'],
    description: 'Periwinkle Air light theme for creative directions — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f1f3fd 0%, #d7d7f5 55%, #4338ca 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#14182e',
        accent: '#4338ca',
        surface: '#f1f3fd',
        text: '#212642',
        fontHeading: 'Fraunces',
        fontBody: 'Manrope',
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Creative Direction'),
          headline: l('Depth, light and effortless clarity.'),
          subheadline: l('Blending tactile surfaces, fluid motion and rock-solid component engineering.'),
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
          items: ['Brand Identity', '3D Art Direction', 'Interactive Web', 'Prototyping'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Fintech Wealth App'),
              description: l('Calm portfolio analytics and goal cards with subtle depth hierarchy.'),
              url: '',
              imageUrl: '',
              tags: ['Mobile', 'Fintech'],
            },
            {
              title: l('Spatial OS Concept'),
              description: l('Glass-layered windowing and gesture language for a next-gen productivity workspace.'),
              url: '',
              imageUrl: '',
              tags: ['Spatial UI', 'System'],
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
              role: l('Creative Director'),
              company: l('Atelier Lumen'),
              period: l('2022 — Present'),
              description: l('Leading a 4-person design practice partnering with AI and developer-tool startups.'),
            },
            {
              role: l('Staff Product Designer'),
              company: l('Horizon Labs'),
              period: l('2019 — 2022'),
              description: l('Defined visual language and core interaction patterns.'),
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
              quote: l('Elevated our product from looking like a prototype to feeling category-defining.'),
              author: l('Ananya Verma'),
              role: l('Co-founder, Lumina'),
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
          location: l('Remote · India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
];
