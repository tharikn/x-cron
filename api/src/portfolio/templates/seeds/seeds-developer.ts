// Auto-generated template seeds — Developer Terminal (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_DEVELOPER: SeedTemplate[] = [
  {
    id: 'developer-01',
    name: 'TTY Prompt',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Matrix Lime dark theme for full-stack developers — Mono headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #050a07 0%, #143922 55%, #4ade80 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ebffef',
        accent: '#4ade80',
        surface: '#050a07',
        text: '#c9f2d2',
        fontHeading: 'Mono',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Full-Stack Developer'),
          headline: l('Your Name'),
          subheadline: l('Full-stack engineer building type-safe web apps, background job runners and clean developer APIs.'),
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
          body: l('Full-stack engineer building type-safe web apps, background job runners and clean developer APIs. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['TypeScript', 'Angular', 'React', 'NestJS', 'PostgreSQL', 'Redis'],
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
              title: l('cron-guard CLI'),
              description: l('Lightweight cronjob monitor & dead-man switch written in Go with Slack/webhook alerts.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Go', 'CLI', 'Open Source'],
            },
            {
              title: l('Schema-First Form Engine'),
              description: l('Zero-dependency JSON schema form generator with full keyboard nav and i18n.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['TypeScript', 'Angular'],
            },
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
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
          location: l('Chennai, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'developer-02',
    name: 'Vim Buffer',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Obsidian Emerald dark theme for frontend engineers — Mono headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
        fontHeading: 'Mono',
        fontBody: 'Outfit',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Frontend Engineer'),
          headline: l('Clean APIs, fast UIs, zero magic.'),
          subheadline: l('Obsessed with fast CI builds, zero-flaky-test suites and responsive accessible frontends.'),
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
          items: ['Node.js', 'Docker', 'GitHub Actions', 'Playwright', 'Prisma', 'AWS'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Schema-First Form Engine'),
              description: l('Zero-dependency JSON schema form generator with full keyboard nav and i18n.'),
              url: '',
              imageUrl: '',
              tags: ['TypeScript', 'Angular'],
            },
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: '',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
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
              role: l('Senior Full-Stack Engineer'),
              company: l('MetricFlow'),
              period: l('2022 — Present'),
              description: l('Build core scheduling APIs, real-time dashboards and worker infrastructure.'),
            },
            {
              role: l('Software Engineer'),
              company: l('CloudForge'),
              period: l('2020 — 2022'),
              description: l('Developed customer portal and automated billing pipelines.'),
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
              quote: l('Writes pull requests that read like documentation and catches edge cases before anyone else.'),
              author: l('Karthik Rajan'),
              role: l('Engineering Manager'),
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
          location: l('Kolkata, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'developer-03',
    name: 'Git Branch',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Alabaster Cobalt light theme for backend & api developers — Outfit headings with centered hero and compact spacing.',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Backend & API Developer'),
          headline: l('I build reliable web apps and developer tools.'),
          subheadline: l('Creator of open-source CLI utilities with 12k+ GitHub stars and contributors worldwide.'),
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
          body: l('Creator of open-source CLI utilities with 12k+ GitHub stars and contributors worldwide. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Senior Full-Stack Engineer'),
              company: l('MetricFlow'),
              period: l('2022 — Present'),
              description: l('Build core scheduling APIs, real-time dashboards and worker infrastructure.'),
            },
            {
              role: l('Software Engineer'),
              company: l('CloudForge'),
              period: l('2020 — 2022'),
              description: l('Developed customer portal and automated billing pipelines.'),
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
              degree: l('B.E. Computer Science'),
              school: l('Anna University'),
              period: l('2016 — 2020'),
              description: l('Graduated with distinction; active Linux user group organizer.'),
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
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
            },
            {
              title: l('cron-guard CLI'),
              description: l('Lightweight cronjob monitor & dead-man switch written in Go with Slack/webhook alerts.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Go', 'CLI', 'Open Source'],
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
          location: l('Ahmedabad, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'developer-04',
    name: 'Kernel Panic',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Synthwave Pink dark theme for mobile app developers — Mono headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #0c0512 0%, #3f1d36 55%, #f472b6 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ffeef8',
        accent: '#f472b6',
        surface: '#0c0512',
        text: '#f0cfe3',
        fontHeading: 'Mono',
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
          eyebrow: l('Mobile App Developer'),
          headline: l('Your Name'),
          subheadline: l('Full-stack engineer building type-safe web apps, background job runners and clean developer APIs.'),
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
          items: ['TypeScript', 'Angular', 'React', 'NestJS', 'PostgreSQL', 'Redis'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Senior Full-Stack Engineer'),
              company: l('MetricFlow'),
              period: l('2022 — Present'),
              description: l('Build core scheduling APIs, real-time dashboards and worker infrastructure.'),
            },
            {
              role: l('Software Engineer'),
              company: l('CloudForge'),
              period: l('2020 — 2022'),
              description: l('Developed customer portal and automated billing pipelines.'),
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
              title: l('cron-guard CLI'),
              description: l('Lightweight cronjob monitor & dead-man switch written in Go with Slack/webhook alerts.'),
              url: '',
              imageUrl: '',
              tags: ['Go', 'CLI', 'Open Source'],
            },
            {
              title: l('Schema-First Form Engine'),
              description: l('Zero-dependency JSON schema form generator with full keyboard nav and i18n.'),
              url: '',
              imageUrl: '',
              tags: ['TypeScript', 'Angular'],
            },
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: '',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
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
    id: 'developer-05',
    name: 'Shell Script',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Midnight Cobalt dark theme for devops & cloud engineers — Mono headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eff6ff',
        accent: '#60a5fa',
        surface: '#070b16',
        text: '#d8e4f8',
        fontHeading: 'Mono',
        fontBody: 'Outfit',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('DevOps & Cloud Engineer'),
          headline: l('Shipping maintainable code every day.'),
          subheadline: l('Obsessed with fast CI builds, zero-flaky-test suites and responsive accessible frontends.'),
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
              title: l('Schema-First Form Engine'),
              description: l('Zero-dependency JSON schema form generator with full keyboard nav and i18n.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['TypeScript', 'Angular'],
            },
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Obsessed with fast CI builds, zero-flaky-test suites and responsive accessible frontends. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Senior Full-Stack Engineer'),
              company: l('MetricFlow'),
              period: l('2022 — Present'),
              description: l('Build core scheduling APIs, real-time dashboards and worker infrastructure.'),
            },
            {
              role: l('Software Engineer'),
              company: l('CloudForge'),
              period: l('2020 — 2022'),
              description: l('Developed customer portal and automated billing pipelines.'),
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
    id: 'developer-06',
    name: 'Compile Clean',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Porcelain Emerald light theme for open source maintainers — Outfit headings with centered hero and comfortable spacing.',
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
          eyebrow: l('Open Source Maintainer'),
          headline: l('Full-stack TypeScript & cloud automation.'),
          subheadline: l('Creator of open-source CLI utilities with 12k+ GitHub stars and contributors worldwide.'),
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
          title: l('About'),
          body: l('Creator of open-source CLI utilities with 12k+ GitHub stars and contributors worldwide. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: '',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
            },
            {
              title: l('cron-guard CLI'),
              description: l('Lightweight cronjob monitor & dead-man switch written in Go with Slack/webhook alerts.'),
              url: '',
              imageUrl: '',
              tags: ['Go', 'CLI', 'Open Source'],
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
          location: l('Kolkata, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'developer-07',
    name: 'Daemon Port',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Cyber Cyan dark theme for typescript specialists — Mono headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #050c10 0%, #0b3841 55%, #22d3ee 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#e8feff',
        accent: '#22d3ee',
        surface: '#050c10',
        text: '#c7ecf0',
        fontHeading: 'Mono',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('TypeScript Specialist'),
          headline: l('Your Name'),
          subheadline: l('Full-stack engineer building type-safe web apps, background job runners and clean developer APIs.'),
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
          body: l('Full-stack engineer building type-safe web apps, background job runners and clean developer APIs. Based in Ahmedabad, working with teams worldwide.'),
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
          title: l('Kind Words'),
          items: [
            {
              quote: l('Writes pull requests that read like documentation and catches edge cases before anyone else.'),
              author: l('Karthik Rajan'),
              role: l('Engineering Manager'),
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
    id: 'developer-08',
    name: 'Root Access',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Abyssal Violet dark theme for cli & tooling authors — Mono headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f5f3ff',
        accent: '#a78bfa',
        surface: '#0b0917',
        text: '#e0daf8',
        fontHeading: 'Mono',
        fontBody: 'Outfit',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('CLI & Tooling Author'),
          headline: l('From schema design to pixel polish.'),
          subheadline: l('Obsessed with fast CI builds, zero-flaky-test suites and responsive accessible frontends.'),
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
          body: l('Obsessed with fast CI builds, zero-flaky-test suites and responsive accessible frontends. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Node.js', 'Docker', 'GitHub Actions', 'Playwright', 'Prisma', 'AWS'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Schema-First Form Engine'),
              description: l('Zero-dependency JSON schema form generator with full keyboard nav and i18n.'),
              url: '',
              imageUrl: '',
              tags: ['TypeScript', 'Angular'],
            },
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: '',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
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
          location: l('Mysuru, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'developer-09',
    name: 'Makefile',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Chalk Vermilion light theme for web performance engineers — Outfit headings with centered hero and compact spacing.',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Web Performance Engineer'),
          headline: l('Your Name'),
          subheadline: l('Creator of open-source CLI utilities with 12k+ GitHub stars and contributors worldwide.'),
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
          body: l('Creator of open-source CLI utilities with 12k+ GitHub stars and contributors worldwide. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
            },
            {
              title: l('cron-guard CLI'),
              description: l('Lightweight cronjob monitor & dead-man switch written in Go with Slack/webhook alerts.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Go', 'CLI', 'Open Source'],
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
              quote: l('Writes pull requests that read like documentation and catches edge cases before anyone else.'),
              author: l('Karthik Rajan'),
              role: l('Engineering Manager'),
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
    id: 'developer-10',
    name: 'Stack Frame',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Laser Violet dark theme for database engineers — Mono headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #080512 0%, #302145 55%, #c084fc 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f4ebff',
        accent: '#c084fc',
        surface: '#080512',
        text: '#dfd0f5',
        fontHeading: 'Mono',
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
          eyebrow: l('Database Engineer'),
          headline: l('Clean APIs, fast UIs, zero magic.'),
          subheadline: l('Full-stack engineer building type-safe web apps, background job runners and clean developer APIs.'),
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
              title: l('cron-guard CLI'),
              description: l('Lightweight cronjob monitor & dead-man switch written in Go with Slack/webhook alerts.'),
              url: '',
              imageUrl: '',
              tags: ['Go', 'CLI', 'Open Source'],
            },
            {
              title: l('Schema-First Form Engine'),
              description: l('Zero-dependency JSON schema form generator with full keyboard nav and i18n.'),
              url: '',
              imageUrl: '',
              tags: ['TypeScript', 'Angular'],
            },
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: '',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['TypeScript', 'Angular', 'React', 'NestJS', 'PostgreSQL', 'Redis'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Writes pull requests that read like documentation and catches edge cases before anyone else.'),
              author: l('Karthik Rajan'),
              role: l('Engineering Manager'),
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
          location: l('Kolkata, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'developer-11',
    name: 'SSH Tunnel',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Charcoal Amber dark theme for graphql / trpc architects — Mono headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fffbeb',
        accent: '#fbbf24',
        surface: '#100e0a',
        text: '#ede5ce',
        fontHeading: 'Mono',
        fontBody: 'Outfit',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('GraphQL / tRPC Architect'),
          headline: l('I build reliable web apps and developer tools.'),
          subheadline: l('Obsessed with fast CI builds, zero-flaky-test suites and responsive accessible frontends.'),
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
          body: l('Obsessed with fast CI builds, zero-flaky-test suites and responsive accessible frontends. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Node.js', 'Docker', 'GitHub Actions', 'Playwright', 'Prisma', 'AWS'],
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
              title: l('Schema-First Form Engine'),
              description: l('Zero-dependency JSON schema form generator with full keyboard nav and i18n.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['TypeScript', 'Angular'],
            },
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
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
          location: l('Ahmedabad, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'developer-12',
    name: 'Stdout',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Ice Indigo light theme for qa & test automation leads — Outfit headings with centered hero and comfortable spacing.',
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
          eyebrow: l('QA & Test Automation Lead'),
          headline: l('Your Name'),
          subheadline: l('Creator of open-source CLI utilities with 12k+ GitHub stars and contributors worldwide.'),
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
          items: ['Go', 'CLI Tooling', 'SQLite', 'WebSockets', 'Linux', 'Terraform'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: '',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
            },
            {
              title: l('cron-guard CLI'),
              description: l('Lightweight cronjob monitor & dead-man switch written in Go with Slack/webhook alerts.'),
              url: '',
              imageUrl: '',
              tags: ['Go', 'CLI', 'Open Source'],
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
              role: l('Senior Full-Stack Engineer'),
              company: l('MetricFlow'),
              period: l('2022 — Present'),
              description: l('Build core scheduling APIs, real-time dashboards and worker infrastructure.'),
            },
            {
              role: l('Software Engineer'),
              company: l('CloudForge'),
              period: l('2020 — 2022'),
              description: l('Developed customer portal and automated billing pipelines.'),
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
              quote: l('Writes pull requests that read like documentation and catches edge cases before anyone else.'),
              author: l('Karthik Rajan'),
              role: l('Engineering Manager'),
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
          location: l('Mysuru, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'developer-13',
    name: 'Lint Zero',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Plasma Orange dark theme for flutter / react native devs — Mono headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0f0704 0%, #432610 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1e6',
        accent: '#fb923c',
        surface: '#0f0704',
        text: '#f2d9c7',
        fontHeading: 'Mono',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Flutter / React Native Dev'),
          headline: l('Shipping maintainable code every day.'),
          subheadline: l('Full-stack engineer building type-safe web apps, background job runners and clean developer APIs.'),
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
          body: l('Full-stack engineer building type-safe web apps, background job runners and clean developer APIs. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Senior Full-Stack Engineer'),
              company: l('MetricFlow'),
              period: l('2022 — Present'),
              description: l('Build core scheduling APIs, real-time dashboards and worker infrastructure.'),
            },
            {
              role: l('Software Engineer'),
              company: l('CloudForge'),
              period: l('2020 — 2022'),
              description: l('Developed customer portal and automated billing pipelines.'),
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
              degree: l('B.E. Computer Science'),
              school: l('Anna University'),
              period: l('2016 — 2020'),
              description: l('Graduated with distinction; active Linux user group organizer.'),
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
              title: l('cron-guard CLI'),
              description: l('Lightweight cronjob monitor & dead-man switch written in Go with Slack/webhook alerts.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Go', 'CLI', 'Open Source'],
            },
            {
              title: l('Schema-First Form Engine'),
              description: l('Zero-dependency JSON schema form generator with full keyboard nav and i18n.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['TypeScript', 'Angular'],
            },
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
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
          location: l('Chennai, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'developer-14',
    name: 'Binary Tree',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Velvet Rose dark theme for accessibility engineers — Mono headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
        fontHeading: 'Mono',
        fontBody: 'Outfit',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Accessibility Engineer'),
          headline: l('Full-stack TypeScript & cloud automation.'),
          subheadline: l('Obsessed with fast CI builds, zero-flaky-test suites and responsive accessible frontends.'),
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
          items: ['Node.js', 'Docker', 'GitHub Actions', 'Playwright', 'Prisma', 'AWS'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Senior Full-Stack Engineer'),
              company: l('MetricFlow'),
              period: l('2022 — Present'),
              description: l('Build core scheduling APIs, real-time dashboards and worker infrastructure.'),
            },
            {
              role: l('Software Engineer'),
              company: l('CloudForge'),
              period: l('2020 — 2022'),
              description: l('Developed customer portal and automated billing pipelines.'),
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
              title: l('Schema-First Form Engine'),
              description: l('Zero-dependency JSON schema form generator with full keyboard nav and i18n.'),
              url: '',
              imageUrl: '',
              tags: ['TypeScript', 'Angular'],
            },
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: '',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
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
    id: 'developer-15',
    name: 'Docker Layer',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Linen Terracotta light theme for game engine developers — Outfit headings with centered hero and compact spacing.',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Game Engine Developer'),
          headline: l('Your Name'),
          subheadline: l('Creator of open-source CLI utilities with 12k+ GitHub stars and contributors worldwide.'),
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
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
            },
            {
              title: l('cron-guard CLI'),
              description: l('Lightweight cronjob monitor & dead-man switch written in Go with Slack/webhook alerts.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Go', 'CLI', 'Open Source'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Creator of open-source CLI utilities with 12k+ GitHub stars and contributors worldwide. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Senior Full-Stack Engineer'),
              company: l('MetricFlow'),
              period: l('2022 — Present'),
              description: l('Build core scheduling APIs, real-time dashboards and worker infrastructure.'),
            },
            {
              role: l('Software Engineer'),
              company: l('CloudForge'),
              period: l('2020 — 2022'),
              description: l('Developed customer portal and automated billing pipelines.'),
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
    id: 'developer-16',
    name: 'Async Await',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Volt Gold dark theme for webassembly tinkerers — Mono headings with split-media hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #0c0b04 0%, #403508 55%, #facc15 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fefce8',
        accent: '#facc15',
        surface: '#0c0b04',
        text: '#ebe5ba',
        fontHeading: 'Mono',
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
          eyebrow: l('WebAssembly Tinkerer'),
          headline: l('From schema design to pixel polish.'),
          subheadline: l('Full-stack engineer building type-safe web apps, background job runners and clean developer APIs.'),
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
          title: l('About'),
          body: l('Full-stack engineer building type-safe web apps, background job runners and clean developer APIs. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('cron-guard CLI'),
              description: l('Lightweight cronjob monitor & dead-man switch written in Go with Slack/webhook alerts.'),
              url: '',
              imageUrl: '',
              tags: ['Go', 'CLI', 'Open Source'],
            },
            {
              title: l('Schema-First Form Engine'),
              description: l('Zero-dependency JSON schema form generator with full keyboard nav and i18n.'),
              url: '',
              imageUrl: '',
              tags: ['TypeScript', 'Angular'],
            },
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: '',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
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
          location: l('Mysuru, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'developer-17',
    name: 'Pipe Stream',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Deep Teal dark theme for kubernetes operator devs — Mono headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f0fdfa',
        accent: '#2dd4bf',
        surface: '#071112',
        text: '#cce8e4',
        fontHeading: 'Mono',
        fontBody: 'Outfit',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Kubernetes Operator Dev'),
          headline: l('Your Name'),
          subheadline: l('Obsessed with fast CI builds, zero-flaky-test suites and responsive accessible frontends.'),
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
          body: l('Obsessed with fast CI builds, zero-flaky-test suites and responsive accessible frontends. Based in Chennai, working with teams worldwide.'),
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
              quote: l('Writes pull requests that read like documentation and catches edge cases before anyone else.'),
              author: l('Karthik Rajan'),
              role: l('Engineering Manager'),
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
    id: 'developer-18',
    name: 'Diff Patch',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Nordic Spruce light theme for sdk & docs engineers — Outfit headings with centered hero and comfortable spacing.',
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
          eyebrow: l('SDK & Docs Engineer'),
          headline: l('Clean APIs, fast UIs, zero magic.'),
          subheadline: l('Creator of open-source CLI utilities with 12k+ GitHub stars and contributors worldwide.'),
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
          body: l('Creator of open-source CLI utilities with 12k+ GitHub stars and contributors worldwide. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Go', 'CLI Tooling', 'SQLite', 'WebSockets', 'Linux', 'Terraform'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: '',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
            },
            {
              title: l('cron-guard CLI'),
              description: l('Lightweight cronjob monitor & dead-man switch written in Go with Slack/webhook alerts.'),
              url: '',
              imageUrl: '',
              tags: ['Go', 'CLI', 'Open Source'],
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
          location: l('Kolkata, India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'developer-19',
    name: 'Grep Match',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Hyper Blue dark theme for build systems engineers — Mono headings with split-media hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #040814 0%, #182b47 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ebf3ff',
        accent: '#60a5fa',
        surface: '#040814',
        text: '#cde0f8',
        fontHeading: 'Mono',
        fontBody: 'Manrope',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Build Systems Engineer'),
          headline: l('I build reliable web apps and developer tools.'),
          subheadline: l('Full-stack engineer building type-safe web apps, background job runners and clean developer APIs.'),
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
          body: l('Full-stack engineer building type-safe web apps, background job runners and clean developer APIs. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('cron-guard CLI'),
              description: l('Lightweight cronjob monitor & dead-man switch written in Go with Slack/webhook alerts.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Go', 'CLI', 'Open Source'],
            },
            {
              title: l('Schema-First Form Engine'),
              description: l('Zero-dependency JSON schema form generator with full keyboard nav and i18n.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['TypeScript', 'Angular'],
            },
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
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
              quote: l('Writes pull requests that read like documentation and catches edge cases before anyone else.'),
              author: l('Karthik Rajan'),
              role: l('Engineering Manager'),
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
    id: 'developer-20',
    name: 'Crontab',
    category: 'developer',
    family: 'Developer Terminal',
    audience: ['developer', 'engineer', 'student'],
    description: 'Smoked Tangerine dark theme for indie saas makers — Mono headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #120c08 0%, #452913 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff7ed',
        accent: '#fb923c',
        surface: '#120c08',
        text: '#f0dfd1',
        fontHeading: 'Mono',
        fontBody: 'Outfit',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Indie SaaS Maker'),
          headline: l('Your Name'),
          subheadline: l('Obsessed with fast CI builds, zero-flaky-test suites and responsive accessible frontends.'),
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
              title: l('Schema-First Form Engine'),
              description: l('Zero-dependency JSON schema form generator with full keyboard nav and i18n.'),
              url: '',
              imageUrl: '',
              tags: ['TypeScript', 'Angular'],
            },
            {
              title: l('Distributed Job Queue'),
              description: l('Redis-backed worker queue with exponential backoff, idempotency keys and live metrics.'),
              url: '',
              imageUrl: '',
              tags: ['NestJS', 'Redis'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Node.js', 'Docker', 'GitHub Actions', 'Playwright', 'Prisma', 'AWS'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Writes pull requests that read like documentation and catches edge cases before anyone else.'),
              author: l('Karthik Rajan'),
              role: l('Engineering Manager'),
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
          location: l('Mysuru, India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
];
