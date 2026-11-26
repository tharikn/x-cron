// Auto-generated template seeds — Nonprofit Mission (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_NONPROFIT: SeedTemplate[] = [
  {
    id: 'nonprofit-01',
    name: 'Civic Commons',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Lavender Fog light theme for nonprofit executive directors — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f3f0fc 0%, #dfd2f7 55%, #6d28d9 140%)',
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
          eyebrow: l('Nonprofit Executive Director'),
          headline: l('Change starts with listening locally.'),
          subheadline: l('Nonprofit leader with 10+ years designing participatory programs across clean water, climate adaptation and youth education.'),
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
          body: l('Nonprofit leader with 10+ years designing participatory programs across clean water, climate adaptation and youth education. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Program Design', 'Grant Writing', 'Impact Evaluation', 'Community Organizing'],
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
              title: l('Watershed Restoration Initiative'),
              description: l('Partnered with 24 village councils to revive check dams, restoring irrigation for 4,800 farms.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Climate', 'Community'],
            },
            {
              title: l('Digital Literacy Hubs'),
              description: l('Established 18 solar-powered community learning centers serving 3,100 young women.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Education', 'Equity'],
            },
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
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
          location: l('Ahmedabad, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'nonprofit-02',
    name: 'Root & Canopy',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Vellum Rust light theme for climate program managers — Georgia headings with centered hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Climate Program Manager'),
          headline: l('Your Name'),
          subheadline: l('Secured $6.5M in institutional grants and partnered with 35 grassroots cooperatives across 7 states.'),
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
          items: ['Policy Advocacy', 'Coalition Building', 'Board Governance', 'Fundraising'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Digital Literacy Hubs'),
              description: l('Established 18 solar-powered community learning centers serving 3,100 young women.'),
              url: '',
              imageUrl: '',
              tags: ['Education', 'Equity'],
            },
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: '',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
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
              role: l('Executive Director'),
              company: l('Canopy Civic Trust'),
              period: l('2021 — Present'),
              description: l('Lead a 26-person team and $2.4M annual program budget.'),
            },
            {
              role: l('Senior Program Lead'),
              company: l('Janata Development Fund'),
              period: l('2017 — 2021'),
              description: l('Managed multi-state rural livelihoods portfolio.'),
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
              quote: l('Listens with genuine humility and translates grassroots realities into policy people act on.'),
              author: l('Dr. Kavita Rao'),
              role: l('Board Chair, Canopy Trust'),
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
          location: l('Mysuru, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'nonprofit-03',
    name: 'Public Good',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Alabaster Cobalt light theme for public policy researchers — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Public Policy Researcher'),
          headline: l('Turning community solidarity into measurable policy.'),
          subheadline: l('Committed to transparent impact reporting and community-owned governance.'),
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
          body: l('Committed to transparent impact reporting and community-owned governance. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Executive Director'),
              company: l('Canopy Civic Trust'),
              period: l('2021 — Present'),
              description: l('Lead a 26-person team and $2.4M annual program budget.'),
            },
            {
              role: l('Senior Program Lead'),
              company: l('Janata Development Fund'),
              period: l('2017 — 2021'),
              description: l('Managed multi-state rural livelihoods portfolio.'),
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
              degree: l('M.A. Public Policy & Development'),
              school: l('Azim Premji University'),
              period: l('2015 — 2017'),
              description: l('Fieldwork in community forestry and civic governance.'),
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
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
            },
            {
              title: l('Watershed Restoration Initiative'),
              description: l('Partnered with 24 village councils to revive check dams, restoring irrigation for 4,800 farms.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Climate', 'Community'],
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
          location: l('Chennai, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'nonprofit-04',
    name: 'Field Impact',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Sage Mist light theme for community organizers — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #eff7f2 0%, #cee5d7 55%, #15803d 140%)',
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
          eyebrow: l('Community Organizer'),
          headline: l('Advancing climate resilience and equitable access.'),
          subheadline: l('Nonprofit leader with 10+ years designing participatory programs across clean water, climate adaptation and youth education.'),
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
          items: ['Program Design', 'Grant Writing', 'Impact Evaluation', 'Community Organizing'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Executive Director'),
              company: l('Canopy Civic Trust'),
              period: l('2021 — Present'),
              description: l('Lead a 26-person team and $2.4M annual program budget.'),
            },
            {
              role: l('Senior Program Lead'),
              company: l('Janata Development Fund'),
              period: l('2017 — 2021'),
              description: l('Managed multi-state rural livelihoods portfolio.'),
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
              title: l('Watershed Restoration Initiative'),
              description: l('Partnered with 24 village councils to revive check dams, restoring irrigation for 4,800 farms.'),
              url: '',
              imageUrl: '',
              tags: ['Climate', 'Community'],
            },
            {
              title: l('Digital Literacy Hubs'),
              description: l('Established 18 solar-powered community learning centers serving 3,100 young women.'),
              url: '',
              imageUrl: '',
              tags: ['Education', 'Equity'],
            },
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: '',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
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
    id: 'nonprofit-05',
    name: 'Watershed',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Newsprint Navy light theme for philanthropy & grant leads — Georgia headings with centered hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Philanthropy & Grant Lead'),
          headline: l('Your Name'),
          subheadline: l('Secured $6.5M in institutional grants and partnered with 35 grassroots cooperatives across 7 states.'),
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
              title: l('Digital Literacy Hubs'),
              description: l('Established 18 solar-powered community learning centers serving 3,100 young women.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Education', 'Equity'],
            },
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Secured $6.5M in institutional grants and partnered with 35 grassroots cooperatives across 7 states. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Executive Director'),
              company: l('Canopy Civic Trust'),
              period: l('2021 — Present'),
              description: l('Lead a 26-person team and $2.4M annual program budget.'),
            },
            {
              role: l('Senior Program Lead'),
              company: l('Janata Development Fund'),
              period: l('2017 — 2021'),
              description: l('Managed multi-state rural livelihoods portfolio.'),
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
    id: 'nonprofit-06',
    name: 'Coalition',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Porcelain Emerald light theme for rural education directors — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Rural Education Director'),
          headline: l('Programs built with—not just for—communities.'),
          subheadline: l('Committed to transparent impact reporting and community-owned governance.'),
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
          title: l('About'),
          body: l('Committed to transparent impact reporting and community-owned governance. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: '',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
            },
            {
              title: l('Watershed Restoration Initiative'),
              description: l('Partnered with 24 village councils to revive check dams, restoring irrigation for 4,800 farms.'),
              url: '',
              imageUrl: '',
              tags: ['Climate', 'Community'],
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
          location: l('Mysuru, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'nonprofit-07',
    name: 'Steward',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Blush Stone light theme for urban resilience planners — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fcf1f3 0%, #f3d0d8 55%, #be123c 140%)',
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
          eyebrow: l('Urban Resilience Planner'),
          headline: l('Change starts with listening locally.'),
          subheadline: l('Nonprofit leader with 10+ years designing participatory programs across clean water, climate adaptation and youth education.'),
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
          body: l('Nonprofit leader with 10+ years designing participatory programs across clean water, climate adaptation and youth education. Based in Chennai, working with teams worldwide.'),
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
          title: l('Kind Words'),
          items: [
            {
              quote: l('Listens with genuine humility and translates grassroots realities into policy people act on.'),
              author: l('Dr. Kavita Rao'),
              role: l('Board Chair, Canopy Trust'),
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
    id: 'nonprofit-08',
    name: 'Greenbelt',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Parchment Olive light theme for social impact evaluators — Georgia headings with centered hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Social Impact Evaluator'),
          headline: l('Your Name'),
          subheadline: l('Secured $6.5M in institutional grants and partnered with 35 grassroots cooperatives across 7 states.'),
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
          body: l('Secured $6.5M in institutional grants and partnered with 35 grassroots cooperatives across 7 states. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Policy Advocacy', 'Coalition Building', 'Board Governance', 'Fundraising'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Digital Literacy Hubs'),
              description: l('Established 18 solar-powered community learning centers serving 3,100 young women.'),
              url: '',
              imageUrl: '',
              tags: ['Education', 'Equity'],
            },
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: '',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
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
          location: l('Kolkata, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'nonprofit-09',
    name: 'Grassroots',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Chalk Vermilion light theme for human rights advocates — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Human Rights Advocate'),
          headline: l('Turning community solidarity into measurable policy.'),
          subheadline: l('Committed to transparent impact reporting and community-owned governance.'),
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
          body: l('Committed to transparent impact reporting and community-owned governance. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
            },
            {
              title: l('Watershed Restoration Initiative'),
              description: l('Partnered with 24 village councils to revive check dams, restoring irrigation for 4,800 farms.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Climate', 'Community'],
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
              quote: l('Listens with genuine humility and translates grassroots realities into policy people act on.'),
              author: l('Dr. Kavita Rao'),
              role: l('Board Chair, Canopy Trust'),
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
    id: 'nonprofit-10',
    name: 'Grant Folio',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Glacier Blue light theme for clean water program leads — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #eff7fd 0%, #cce2ef 55%, #0369a1 140%)',
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
          eyebrow: l('Clean Water Program Lead'),
          headline: l('Advancing climate resilience and equitable access.'),
          subheadline: l('Nonprofit leader with 10+ years designing participatory programs across clean water, climate adaptation and youth education.'),
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
              title: l('Watershed Restoration Initiative'),
              description: l('Partnered with 24 village councils to revive check dams, restoring irrigation for 4,800 farms.'),
              url: '',
              imageUrl: '',
              tags: ['Climate', 'Community'],
            },
            {
              title: l('Digital Literacy Hubs'),
              description: l('Established 18 solar-powered community learning centers serving 3,100 young women.'),
              url: '',
              imageUrl: '',
              tags: ['Education', 'Equity'],
            },
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: '',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Program Design', 'Grant Writing', 'Impact Evaluation', 'Community Organizing'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Listens with genuine humility and translates grassroots realities into policy people act on.'),
              author: l('Dr. Kavita Rao'),
              role: l('Board Chair, Canopy Trust'),
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
          location: l('Mysuru, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'nonprofit-11',
    name: 'Harvest Trust',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Cream Burgundy light theme for youth mentorship directors — Georgia headings with centered hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Youth Mentorship Director'),
          headline: l('Your Name'),
          subheadline: l('Secured $6.5M in institutional grants and partnered with 35 grassroots cooperatives across 7 states.'),
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
          body: l('Secured $6.5M in institutional grants and partnered with 35 grassroots cooperatives across 7 states. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Policy Advocacy', 'Coalition Building', 'Board Governance', 'Fundraising'],
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
              title: l('Digital Literacy Hubs'),
              description: l('Established 18 solar-powered community learning centers serving 3,100 young women.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Education', 'Equity'],
            },
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
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
          location: l('Chennai, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'nonprofit-12',
    name: 'Open Forum',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Ice Indigo light theme for civic tech fellows — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Civic Tech Fellow'),
          headline: l('Programs built with—not just for—communities.'),
          subheadline: l('Committed to transparent impact reporting and community-owned governance.'),
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
          items: ['Participatory Research', 'Public Speaking', 'Budget Stewardship', 'Field Ops'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: '',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
            },
            {
              title: l('Watershed Restoration Initiative'),
              description: l('Partnered with 24 village councils to revive check dams, restoring irrigation for 4,800 farms.'),
              url: '',
              imageUrl: '',
              tags: ['Climate', 'Community'],
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
              role: l('Executive Director'),
              company: l('Canopy Civic Trust'),
              period: l('2021 — Present'),
              description: l('Lead a 26-person team and $2.4M annual program budget.'),
            },
            {
              role: l('Senior Program Lead'),
              company: l('Janata Development Fund'),
              period: l('2017 — 2021'),
              description: l('Managed multi-state rural livelihoods portfolio.'),
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
              quote: l('Listens with genuine humility and translates grassroots realities into policy people act on.'),
              author: l('Dr. Kavita Rao'),
              role: l('Board Chair, Canopy Trust'),
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
          location: l('Kolkata, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'nonprofit-13',
    name: 'Safe Harbor',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Apricot Cream light theme for food security coordinators — Fraunces headings with editorial hero and comfortable spacing.',
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
        variant: 'editorial',
        props: {
          eyebrow: l('Food Security Coordinator'),
          headline: l('Change starts with listening locally.'),
          subheadline: l('Nonprofit leader with 10+ years designing participatory programs across clean water, climate adaptation and youth education.'),
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
          body: l('Nonprofit leader with 10+ years designing participatory programs across clean water, climate adaptation and youth education. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Executive Director'),
              company: l('Canopy Civic Trust'),
              period: l('2021 — Present'),
              description: l('Lead a 26-person team and $2.4M annual program budget.'),
            },
            {
              role: l('Senior Program Lead'),
              company: l('Janata Development Fund'),
              period: l('2017 — 2021'),
              description: l('Managed multi-state rural livelihoods portfolio.'),
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
              degree: l('M.A. Public Policy & Development'),
              school: l('Azim Premji University'),
              period: l('2015 — 2017'),
              description: l('Fieldwork in community forestry and civic governance.'),
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
              title: l('Watershed Restoration Initiative'),
              description: l('Partnered with 24 village councils to revive check dams, restoring irrigation for 4,800 farms.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Climate', 'Community'],
            },
            {
              title: l('Digital Literacy Hubs'),
              description: l('Established 18 solar-powered community learning centers serving 3,100 young women.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Education', 'Equity'],
            },
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
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
          location: l('Ahmedabad, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'nonprofit-14',
    name: 'Soil & Seed',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Oatmeal Forest light theme for arts & culture organizers — Georgia headings with centered hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Arts & Culture Organizer'),
          headline: l('Your Name'),
          subheadline: l('Secured $6.5M in institutional grants and partnered with 35 grassroots cooperatives across 7 states.'),
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
          items: ['Policy Advocacy', 'Coalition Building', 'Board Governance', 'Fundraising'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Executive Director'),
              company: l('Canopy Civic Trust'),
              period: l('2021 — Present'),
              description: l('Lead a 26-person team and $2.4M annual program budget.'),
            },
            {
              role: l('Senior Program Lead'),
              company: l('Janata Development Fund'),
              period: l('2017 — 2021'),
              description: l('Managed multi-state rural livelihoods portfolio.'),
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
              title: l('Digital Literacy Hubs'),
              description: l('Established 18 solar-powered community learning centers serving 3,100 young women.'),
              url: '',
              imageUrl: '',
              tags: ['Education', 'Equity'],
            },
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: '',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
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
    id: 'nonprofit-15',
    name: 'Bridge Builders',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Linen Terracotta light theme for gender equity strategists — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Gender Equity Strategist'),
          headline: l('Turning community solidarity into measurable policy.'),
          subheadline: l('Committed to transparent impact reporting and community-owned governance.'),
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
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
            },
            {
              title: l('Watershed Restoration Initiative'),
              description: l('Partnered with 24 village councils to revive check dams, restoring irrigation for 4,800 farms.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Climate', 'Community'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Committed to transparent impact reporting and community-owned governance. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Executive Director'),
              company: l('Canopy Civic Trust'),
              period: l('2021 — Present'),
              description: l('Lead a 26-person team and $2.4M annual program budget.'),
            },
            {
              role: l('Senior Program Lead'),
              company: l('Janata Development Fund'),
              period: l('2017 — 2021'),
              description: l('Managed multi-state rural livelihoods portfolio.'),
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
    id: 'nonprofit-16',
    name: 'Impact Report',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Mint Frost light theme for biodiversity conservationists — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #eefaf7 0%, #cde6e2 55%, #0f766e 140%)',
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
          eyebrow: l('Biodiversity Conservationist'),
          headline: l('Advancing climate resilience and equitable access.'),
          subheadline: l('Nonprofit leader with 10+ years designing participatory programs across clean water, climate adaptation and youth education.'),
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
        type: 'about',
        variant: 'prose',
        props: {
          title: l('About'),
          body: l('Nonprofit leader with 10+ years designing participatory programs across clean water, climate adaptation and youth education. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Watershed Restoration Initiative'),
              description: l('Partnered with 24 village councils to revive check dams, restoring irrigation for 4,800 farms.'),
              url: '',
              imageUrl: '',
              tags: ['Climate', 'Community'],
            },
            {
              title: l('Digital Literacy Hubs'),
              description: l('Established 18 solar-powered community learning centers serving 3,100 young women.'),
              url: '',
              imageUrl: '',
              tags: ['Education', 'Equity'],
            },
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: '',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
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
          location: l('Kolkata, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'nonprofit-17',
    name: 'Community First',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Saffron Ink light theme for refugee support directors — Georgia headings with centered hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Refugee Support Director'),
          headline: l('Your Name'),
          subheadline: l('Secured $6.5M in institutional grants and partnered with 35 grassroots cooperatives across 7 states.'),
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
          body: l('Secured $6.5M in institutional grants and partnered with 35 grassroots cooperatives across 7 states. Based in Ahmedabad, working with teams worldwide.'),
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
              quote: l('Listens with genuine humility and translates grassroots realities into policy people act on.'),
              author: l('Dr. Kavita Rao'),
              role: l('Board Chair, Canopy Trust'),
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
    id: 'nonprofit-18',
    name: 'Earthline',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Nordic Spruce light theme for health access leads — Outfit headings with split-media hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Health Access Lead'),
          headline: l('Programs built with—not just for—communities.'),
          subheadline: l('Committed to transparent impact reporting and community-owned governance.'),
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
          body: l('Committed to transparent impact reporting and community-owned governance. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Participatory Research', 'Public Speaking', 'Budget Stewardship', 'Field Ops'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: '',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
            },
            {
              title: l('Watershed Restoration Initiative'),
              description: l('Partnered with 24 village councils to revive check dams, restoring irrigation for 4,800 farms.'),
              url: '',
              imageUrl: '',
              tags: ['Climate', 'Community'],
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
          location: l('Mysuru, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'nonprofit-19',
    name: 'Horizon Aid',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Periwinkle Air light theme for impact communications heads — Fraunces headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f1f3fd 0%, #d7d7f5 55%, #4338ca 140%)',
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
          eyebrow: l('Impact Communications Head'),
          headline: l('Change starts with listening locally.'),
          subheadline: l('Nonprofit leader with 10+ years designing participatory programs across clean water, climate adaptation and youth education.'),
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
          body: l('Nonprofit leader with 10+ years designing participatory programs across clean water, climate adaptation and youth education. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Watershed Restoration Initiative'),
              description: l('Partnered with 24 village councils to revive check dams, restoring irrigation for 4,800 farms.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Climate', 'Community'],
            },
            {
              title: l('Digital Literacy Hubs'),
              description: l('Established 18 solar-powered community learning centers serving 3,100 young women.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Education', 'Equity'],
            },
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
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
              quote: l('Listens with genuine humility and translates grassroots realities into policy people act on.'),
              author: l('Dr. Kavita Rao'),
              role: l('Board Chair, Canopy Trust'),
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
    id: 'nonprofit-20',
    name: 'Collective',
    category: 'nonprofit',
    family: 'Nonprofit Mission',
    audience: ['nonprofit', 'director', 'organizer'],
    description: 'Sepia Slate light theme for cooperative advisors — Georgia headings with centered hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Cooperative Advisor'),
          headline: l('Your Name'),
          subheadline: l('Secured $6.5M in institutional grants and partnered with 35 grassroots cooperatives across 7 states.'),
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
              title: l('Digital Literacy Hubs'),
              description: l('Established 18 solar-powered community learning centers serving 3,100 young women.'),
              url: '',
              imageUrl: '',
              tags: ['Education', 'Equity'],
            },
            {
              title: l('State Clean-Air Coalition'),
              description: l('Co-authored policy brief adopted into municipal transit electrification targets.'),
              url: '',
              imageUrl: '',
              tags: ['Policy', 'Advocacy'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Policy Advocacy', 'Coalition Building', 'Board Governance', 'Fundraising'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Listens with genuine humility and translates grassroots realities into policy people act on.'),
              author: l('Dr. Kavita Rao'),
              role: l('Board Chair, Canopy Trust'),
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
          location: l('Kolkata, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
];
