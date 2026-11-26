// Auto-generated template seeds — Dark Modern (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_DARK_MODERN: SeedTemplate[] = [
  {
    id: 'dark-modern-01',
    name: 'Midnight Core',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Obsidian Emerald dark theme for staff software engineers — Outfit headings with split-media hero and compact spacing.',
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
        radius: 'lg',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Staff Software Engineer'),
          headline: l('Your Name'),
          subheadline: l('Architecting fault-tolerant distributed backends, event pipelines and developer platforms.'),
          primaryCtaLabel: l('Get in touch'),
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
              title: l('Multi-Region Event Mesh'),
              description: l('Built an active-active Kafka + Go ingestion pipeline processing 140k events/sec with deterministic replay.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Go', 'Kafka', 'Distributed'],
            },
            {
              title: l('Zero-Downtime Postgres Sharder'),
              description: l('Automated online tenant migration across 32 shards with sub-second cutover and checksum verification.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['PostgreSQL', 'Systems'],
            },
            {
              title: l('GPU Inference Autoscaler'),
              description: l('Cut LLM serving spend by 54% using custom queue-depth autoscaling and quantized batching.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['MLOps', 'Kubernetes'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Architecting fault-tolerant distributed backends, event pipelines and developer platforms. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Staff Platform Engineer'),
              company: l('Veloce Cloud'),
              period: l('2023 — Present'),
              description: l('Own core compute orchestration, multi-region failover and internal developer tooling.'),
            },
            {
              role: l('Senior Backend Engineer'),
              company: l('FinGrid'),
              period: l('2020 — 2023'),
              description: l('Scaled payment ledger throughput 8x while cutting p99 tail latency in half.'),
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
    id: 'dark-modern-02',
    name: 'Obsidian Stack',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Matrix Lime dark theme for distributed systems engineers — Mono headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #050a07 0%, #143922 55%, #4ade80 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ebffef',
        accent: '#4ade80',
        surface: '#050a07',
        text: '#c9f2d2',
        fontHeading: 'Mono',
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
          eyebrow: l('Distributed Systems Engineer'),
          headline: l('Resilient systems at internet scale.'),
          subheadline: l('Focused on sub-10ms APIs, clean observability and predictable on-call operations.'),
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
          title: l('Profile'),
          body: l('Focused on sub-10ms APIs, clean observability and predictable on-call operations. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Zero-Downtime Postgres Sharder'),
              description: l('Automated online tenant migration across 32 shards with sub-second cutover and checksum verification.'),
              url: '',
              imageUrl: '',
              tags: ['PostgreSQL', 'Systems'],
            },
            {
              title: l('GPU Inference Autoscaler'),
              description: l('Cut LLM serving spend by 54% using custom queue-depth autoscaling and quantized batching.'),
              url: '',
              imageUrl: '',
              tags: ['MLOps', 'Kubernetes'],
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
    id: 'dark-modern-03',
    name: 'Abyssal Pulse',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Signal Yellow light theme for ml infrastructure leads — System headings with centered hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #f7f3e3 0%, #eddbc2 55%, #b45309 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#b45309',
        surface: '#f7f3e3',
        text: '#141414',
        fontHeading: 'System',
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
          eyebrow: l('ML Infrastructure Lead'),
          headline: l('Low latency, high reliability.'),
          subheadline: l('Building production ML serving infrastructure, feature stores and GPU inference clusters.'),
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
          body: l('Building production ML serving infrastructure, feature stores and GPU inference clusters. Based in Ahmedabad, working with teams worldwide.'),
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
              quote: l('The engineer you call when a critical production bottleneck refuses to budge.'),
              author: l('Vikram Rao'),
              role: l('CTO, Veloce Cloud'),
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
    id: 'dark-modern-04',
    name: 'Carbon Flux',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Midnight Cobalt dark theme for cloud security architects — Outfit headings with split-media hero and comfortable spacing.',
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
          eyebrow: l('Cloud Security Architect'),
          headline: l('Your Name'),
          subheadline: l('Zero-trust cloud networking, automated threat modeling and hardened container runtimes.'),
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
          body: l('Zero-trust cloud networking, automated threat modeling and hardened container runtimes. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['OpenTelemetry', 'Prometheus', 'eBPF', 'Linux', 'ClickHouse'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('eBPF Service Telemetry'),
              description: l('Lightweight kernel-level latency profiler with <1% CPU overhead across 600 production pods.'),
              url: '',
              imageUrl: '',
              tags: ['eBPF', 'Rust'],
            },
            {
              title: l('Rate-Limiter Edge Proxy'),
              description: l('Token-bucket distributed limiter in Rust sustaining 250k req/s per node.'),
              url: '',
              imageUrl: '',
              tags: ['Rust', 'Security'],
            },
            {
              title: l('Internal Developer Portal'),
              description: l('Self-service ephemeral environments and one-click rollbacks used daily by 180 engineers.'),
              url: '',
              imageUrl: '',
              tags: ['Platform', 'DX'],
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
    id: 'dark-modern-05',
    name: 'Velvet Terminal',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Synthwave Pink dark theme for site reliability engineers — Mono headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0c0512 0%, #3f1d36 55%, #f472b6 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Site Reliability Engineer'),
          headline: l('Infrastructure you never have to worry about.'),
          subheadline: l('Designing storage engines, query planners and high-throughput Kafka/ClickHouse pipelines.'),
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
          body: l('Designing storage engines, query planners and high-throughput Kafka/ClickHouse pipelines. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Rate-Limiter Edge Proxy'),
              description: l('Token-bucket distributed limiter in Rust sustaining 250k req/s per node.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Rust', 'Security'],
            },
            {
              title: l('Internal Developer Portal'),
              description: l('Self-service ephemeral environments and one-click rollbacks used daily by 180 engineers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Platform', 'DX'],
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
              quote: l('The engineer you call when a critical production bottleneck refuses to budge.'),
              author: l('Vikram Rao'),
              role: l('CTO, Veloce Cloud'),
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
    id: 'dark-modern-06',
    name: 'Onyx Runtime',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Poster Crimson light theme for principal backend engineers — System headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #ffffff 0%, #fadede 55%, #dc2626 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#dc2626',
        surface: '#ffffff',
        text: '#141414',
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
          eyebrow: l('Principal Backend Engineer'),
          headline: l('From raw events to real-time inference.'),
          subheadline: l('Architecting fault-tolerant distributed backends, event pipelines and developer platforms.'),
          primaryCtaLabel: l('Start a project'),
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
              title: l('Internal Developer Portal'),
              description: l('Self-service ephemeral environments and one-click rollbacks used daily by 180 engineers.'),
              url: '',
              imageUrl: '',
              tags: ['Platform', 'DX'],
            },
            {
              title: l('Multi-Region Event Mesh'),
              description: l('Built an active-active Kafka + Go ingestion pipeline processing 140k events/sec with deterministic replay.'),
              url: '',
              imageUrl: '',
              tags: ['Go', 'Kafka', 'Distributed'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['TypeScript', 'NestJS', 'Redis', 'Docker', 'Terraform', 'AWS'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Turns gnarly distributed failure modes into simple, testable invariants.'),
              author: l('Sneha Kulkarni'),
              role: l('Principal SRE'),
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
    id: 'dark-modern-07',
    name: 'Graphite Edge',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Abyssal Violet dark theme for ai systems engineers — Outfit headings with split-media hero and compact spacing.',
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
        radius: 'lg',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('AI Systems Engineer'),
          headline: l('Your Name'),
          subheadline: l('Focused on sub-10ms APIs, clean observability and predictable on-call operations.'),
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
          body: l('Focused on sub-10ms APIs, clean observability and predictable on-call operations. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Core Stack'),
          items: ['Python', 'PyTorch', 'Triton', 'Ray', 'CUDA', 'MLflow'],
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
              title: l('Multi-Region Event Mesh'),
              description: l('Built an active-active Kafka + Go ingestion pipeline processing 140k events/sec with deterministic replay.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Go', 'Kafka', 'Distributed'],
            },
            {
              title: l('Zero-Downtime Postgres Sharder'),
              description: l('Automated online tenant migration across 32 shards with sub-second cutover and checksum verification.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['PostgreSQL', 'Systems'],
            },
            {
              title: l('GPU Inference Autoscaler'),
              description: l('Cut LLM serving spend by 54% using custom queue-depth autoscaling and quantized batching.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['MLOps', 'Kubernetes'],
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
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'dark-modern-08',
    name: 'Deep Orbit',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Cyber Cyan dark theme for platform leads — Mono headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #050c10 0%, #0b3841 55%, #22d3ee 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#e8feff',
        accent: '#22d3ee',
        surface: '#050c10',
        text: '#c7ecf0',
        fontHeading: 'Mono',
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
          eyebrow: l('Platform Lead'),
          headline: l('Security baked into every commit.'),
          subheadline: l('Building production ML serving infrastructure, feature stores and GPU inference clusters.'),
          primaryCtaLabel: l('Connect'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['OpenTelemetry', 'Prometheus', 'eBPF', 'Linux', 'ClickHouse'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Zero-Downtime Postgres Sharder'),
              description: l('Automated online tenant migration across 32 shards with sub-second cutover and checksum verification.'),
              url: '',
              imageUrl: '',
              tags: ['PostgreSQL', 'Systems'],
            },
            {
              title: l('GPU Inference Autoscaler'),
              description: l('Cut LLM serving spend by 54% using custom queue-depth autoscaling and quantized batching.'),
              url: '',
              imageUrl: '',
              tags: ['MLOps', 'Kubernetes'],
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
              role: l('Staff Platform Engineer'),
              company: l('Veloce Cloud'),
              period: l('2023 — Present'),
              description: l('Own core compute orchestration, multi-region failover and internal developer tooling.'),
            },
            {
              role: l('Senior Backend Engineer'),
              company: l('FinGrid'),
              period: l('2020 — 2023'),
              description: l('Scaled payment ledger throughput 8x while cutting p99 tail latency in half.'),
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
              quote: l('Turns gnarly distributed failure modes into simple, testable invariants.'),
              author: l('Sneha Kulkarni'),
              role: l('Principal SRE'),
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
    id: 'dark-modern-09',
    name: 'Night Shift',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Acid Lime light theme for data engineering leads — System headings with centered hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f3f7ec 0%, #d2e5d2 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0a',
        accent: '#15803d',
        surface: '#f3f7ec',
        text: '#141414',
        fontHeading: 'System',
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
          eyebrow: l('Data Engineering Lead'),
          headline: l('Your Name'),
          subheadline: l('Zero-trust cloud networking, automated threat modeling and hardened container runtimes.'),
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
          body: l('Zero-trust cloud networking, automated threat modeling and hardened container runtimes. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Staff Platform Engineer'),
              company: l('Veloce Cloud'),
              period: l('2023 — Present'),
              description: l('Own core compute orchestration, multi-region failover and internal developer tooling.'),
            },
            {
              role: l('Senior Backend Engineer'),
              company: l('FinGrid'),
              period: l('2020 — 2023'),
              description: l('Scaled payment ledger throughput 8x while cutting p99 tail latency in half.'),
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
              degree: l('B.Tech. Computer Science'),
              school: l('IIT Madras'),
              period: l('2015 — 2019'),
              description: l('Distributed systems, operating systems and compiler design.'),
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
              title: l('GPU Inference Autoscaler'),
              description: l('Cut LLM serving spend by 54% using custom queue-depth autoscaling and quantized batching.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['MLOps', 'Kubernetes'],
            },
            {
              title: l('eBPF Service Telemetry'),
              description: l('Lightweight kernel-level latency profiler with <1% CPU overhead across 600 production pods.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['eBPF', 'Rust'],
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'dark-modern-10',
    name: 'Eclipse Engine',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Charcoal Amber dark theme for rust systems developers — Outfit headings with split-media hero and comfortable spacing.',
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
          eyebrow: l('Rust Systems Developer'),
          headline: l('Boring architecture, extraordinary uptime.'),
          subheadline: l('Designing storage engines, query planners and high-throughput Kafka/ClickHouse pipelines.'),
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
          items: ['TypeScript', 'NestJS', 'Redis', 'Docker', 'Terraform', 'AWS'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Staff Platform Engineer'),
              company: l('Veloce Cloud'),
              period: l('2023 — Present'),
              description: l('Own core compute orchestration, multi-region failover and internal developer tooling.'),
            },
            {
              role: l('Senior Backend Engineer'),
              company: l('FinGrid'),
              period: l('2020 — 2023'),
              description: l('Scaled payment ledger throughput 8x while cutting p99 tail latency in half.'),
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
              title: l('eBPF Service Telemetry'),
              description: l('Lightweight kernel-level latency profiler with <1% CPU overhead across 600 production pods.'),
              url: '',
              imageUrl: '',
              tags: ['eBPF', 'Rust'],
            },
            {
              title: l('Rate-Limiter Edge Proxy'),
              description: l('Token-bucket distributed limiter in Rust sustaining 250k req/s per node.'),
              url: '',
              imageUrl: '',
              tags: ['Rust', 'Security'],
            },
            {
              title: l('Internal Developer Portal'),
              description: l('Self-service ephemeral environments and one-click rollbacks used daily by 180 engineers.'),
              url: '',
              imageUrl: '',
              tags: ['Platform', 'DX'],
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
    id: 'dark-modern-11',
    name: 'Dark Matter',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Laser Violet dark theme for devops architects — Mono headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #080512 0%, #302145 55%, #c084fc 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('DevOps Architect'),
          headline: l('Your Name'),
          subheadline: l('Architecting fault-tolerant distributed backends, event pipelines and developer platforms.'),
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
              title: l('Rate-Limiter Edge Proxy'),
              description: l('Token-bucket distributed limiter in Rust sustaining 250k req/s per node.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Rust', 'Security'],
            },
            {
              title: l('Internal Developer Portal'),
              description: l('Self-service ephemeral environments and one-click rollbacks used daily by 180 engineers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Platform', 'DX'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Architecting fault-tolerant distributed backends, event pipelines and developer platforms. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Staff Platform Engineer'),
              company: l('Veloce Cloud'),
              period: l('2023 — Present'),
              description: l('Own core compute orchestration, multi-region failover and internal developer tooling.'),
            },
            {
              role: l('Senior Backend Engineer'),
              company: l('FinGrid'),
              period: l('2020 — 2023'),
              description: l('Scaled payment ledger throughput 8x while cutting p99 tail latency in half.'),
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
    id: 'dark-modern-12',
    name: 'Stealth Kernel',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Cobalt Slab light theme for api platform engineers — System headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f4f4f5 0%, #d5def4 55%, #2563eb 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#09090b',
        accent: '#2563eb',
        surface: '#f4f4f5',
        text: '#18181b',
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
          eyebrow: l('API Platform Engineer'),
          headline: l('Speed is a product feature.'),
          subheadline: l('Focused on sub-10ms APIs, clean observability and predictable on-call operations.'),
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
          title: l('Profile'),
          body: l('Focused on sub-10ms APIs, clean observability and predictable on-call operations. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Internal Developer Portal'),
              description: l('Self-service ephemeral environments and one-click rollbacks used daily by 180 engineers.'),
              url: '',
              imageUrl: '',
              tags: ['Platform', 'DX'],
            },
            {
              title: l('Multi-Region Event Mesh'),
              description: l('Built an active-active Kafka + Go ingestion pipeline processing 140k events/sec with deterministic replay.'),
              url: '',
              imageUrl: '',
              tags: ['Go', 'Kafka', 'Distributed'],
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
    id: 'dark-modern-13',
    name: 'Shadow Node',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Velvet Rose dark theme for embedded linux engineers — Outfit headings with split-media hero and compact spacing.',
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
        radius: 'lg',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Embedded Linux Engineer'),
          headline: l('Your Name'),
          subheadline: l('Building production ML serving infrastructure, feature stores and GPU inference clusters.'),
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
          body: l('Building production ML serving infrastructure, feature stores and GPU inference clusters. Based in Chennai, working with teams worldwide.'),
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
          title: l('Kind Words'),
          items: [
            {
              quote: l('The engineer you call when a critical production bottleneck refuses to budge.'),
              author: l('Vikram Rao'),
              role: l('CTO, Veloce Cloud'),
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
    id: 'dark-modern-14',
    name: 'Nebula Grid',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Plasma Orange dark theme for cryptography engineers — Mono headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #0f0704 0%, #432610 55%, #fb923c 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1e6',
        accent: '#fb923c',
        surface: '#0f0704',
        text: '#f2d9c7',
        fontHeading: 'Mono',
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
          eyebrow: l('Cryptography Engineer'),
          headline: l('Built for 99.99% availability.'),
          subheadline: l('Zero-trust cloud networking, automated threat modeling and hardened container runtimes.'),
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
          body: l('Zero-trust cloud networking, automated threat modeling and hardened container runtimes. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['TypeScript', 'NestJS', 'Redis', 'Docker', 'Terraform', 'AWS'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Zero-Downtime Postgres Sharder'),
              description: l('Automated online tenant migration across 32 shards with sub-second cutover and checksum verification.'),
              url: '',
              imageUrl: '',
              tags: ['PostgreSQL', 'Systems'],
            },
            {
              title: l('GPU Inference Autoscaler'),
              description: l('Cut LLM serving spend by 54% using custom queue-depth autoscaling and quantized batching.'),
              url: '',
              imageUrl: '',
              tags: ['MLOps', 'Kubernetes'],
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
    id: 'dark-modern-15',
    name: 'Slate Horizon',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Cyber Magenta light theme for performance engineers — System headings with centered hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #faf5ff 0%, #f1d6f8 55%, #c026d3 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0a0a0c',
        accent: '#c026d3',
        surface: '#faf5ff',
        text: '#16121a',
        fontHeading: 'System',
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
          eyebrow: l('Performance Engineer'),
          headline: l('Your Name'),
          subheadline: l('Designing storage engines, query planners and high-throughput Kafka/ClickHouse pipelines.'),
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
          body: l('Designing storage engines, query planners and high-throughput Kafka/ClickHouse pipelines. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('GPU Inference Autoscaler'),
              description: l('Cut LLM serving spend by 54% using custom queue-depth autoscaling and quantized batching.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['MLOps', 'Kubernetes'],
            },
            {
              title: l('eBPF Service Telemetry'),
              description: l('Lightweight kernel-level latency profiler with <1% CPU overhead across 600 production pods.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['eBPF', 'Rust'],
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
              quote: l('The engineer you call when a critical production bottleneck refuses to budge.'),
              author: l('Vikram Rao'),
              role: l('CTO, Veloce Cloud'),
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
    id: 'dark-modern-16',
    name: 'Cinder Mono',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Deep Teal dark theme for database internals engineers — Outfit headings with split-media hero and comfortable spacing.',
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
          eyebrow: l('Database Internals Engineer'),
          headline: l('Resilient systems at internet scale.'),
          subheadline: l('Architecting fault-tolerant distributed backends, event pipelines and developer platforms.'),
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
              title: l('eBPF Service Telemetry'),
              description: l('Lightweight kernel-level latency profiler with <1% CPU overhead across 600 production pods.'),
              url: '',
              imageUrl: '',
              tags: ['eBPF', 'Rust'],
            },
            {
              title: l('Rate-Limiter Edge Proxy'),
              description: l('Token-bucket distributed limiter in Rust sustaining 250k req/s per node.'),
              url: '',
              imageUrl: '',
              tags: ['Rust', 'Security'],
            },
            {
              title: l('Internal Developer Portal'),
              description: l('Self-service ephemeral environments and one-click rollbacks used daily by 180 engineers.'),
              url: '',
              imageUrl: '',
              tags: ['Platform', 'DX'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['OpenTelemetry', 'Prometheus', 'eBPF', 'Linux', 'ClickHouse'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Turns gnarly distributed failure modes into simple, testable invariants.'),
              author: l('Sneha Kulkarni'),
              role: l('Principal SRE'),
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
    id: 'dark-modern-17',
    name: 'Aurora Dark',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Volt Gold dark theme for observability architects — Mono headings with editorial hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0c0b04 0%, #403508 55%, #facc15 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Observability Architect'),
          headline: l('Low latency, high reliability.'),
          subheadline: l('Focused on sub-10ms APIs, clean observability and predictable on-call operations.'),
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
          body: l('Focused on sub-10ms APIs, clean observability and predictable on-call operations. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Core Stack'),
          items: ['Rust', 'Go', 'Kubernetes', 'PostgreSQL', 'gRPC', 'Kafka'],
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
              title: l('Rate-Limiter Edge Proxy'),
              description: l('Token-bucket distributed limiter in Rust sustaining 250k req/s per node.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Rust', 'Security'],
            },
            {
              title: l('Internal Developer Portal'),
              description: l('Self-service ephemeral environments and one-click rollbacks used daily by 180 engineers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Platform', 'DX'],
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
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'dark-modern-18',
    name: 'Void Signal',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Tangerine Concrete light theme for compiler engineers — System headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f5f5f4 0%, #f3ddd1 55%, #ea580c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d0d0d',
        accent: '#ea580c',
        surface: '#f5f5f4',
        text: '#1c1917',
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
          eyebrow: l('Compiler Engineer'),
          headline: l('Your Name'),
          subheadline: l('Building production ML serving infrastructure, feature stores and GPU inference clusters.'),
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
          title: l('Specialties'),
          items: ['TypeScript', 'NestJS', 'Redis', 'Docker', 'Terraform', 'AWS'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Internal Developer Portal'),
              description: l('Self-service ephemeral environments and one-click rollbacks used daily by 180 engineers.'),
              url: '',
              imageUrl: '',
              tags: ['Platform', 'DX'],
            },
            {
              title: l('Multi-Region Event Mesh'),
              description: l('Built an active-active Kafka + Go ingestion pipeline processing 140k events/sec with deterministic replay.'),
              url: '',
              imageUrl: '',
              tags: ['Go', 'Kafka', 'Distributed'],
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
              role: l('Staff Platform Engineer'),
              company: l('Veloce Cloud'),
              period: l('2023 — Present'),
              description: l('Own core compute orchestration, multi-region failover and internal developer tooling.'),
            },
            {
              role: l('Senior Backend Engineer'),
              company: l('FinGrid'),
              period: l('2020 — 2023'),
              description: l('Scaled payment ledger throughput 8x while cutting p99 tail latency in half.'),
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
              quote: l('Turns gnarly distributed failure modes into simple, testable invariants.'),
              author: l('Sneha Kulkarni'),
              role: l('Principal SRE'),
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
    id: 'dark-modern-19',
    name: 'Cobalt Night',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Smoked Tangerine dark theme for edge computing leads — Outfit headings with split-media hero and compact spacing.',
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
        radius: 'lg',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Edge Computing Lead'),
          headline: l('Infrastructure you never have to worry about.'),
          subheadline: l('Zero-trust cloud networking, automated threat modeling and hardened container runtimes.'),
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
          body: l('Zero-trust cloud networking, automated threat modeling and hardened container runtimes. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Staff Platform Engineer'),
              company: l('Veloce Cloud'),
              period: l('2023 — Present'),
              description: l('Own core compute orchestration, multi-region failover and internal developer tooling.'),
            },
            {
              role: l('Senior Backend Engineer'),
              company: l('FinGrid'),
              period: l('2020 — 2023'),
              description: l('Scaled payment ledger throughput 8x while cutting p99 tail latency in half.'),
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
              degree: l('B.Tech. Computer Science'),
              school: l('IIT Madras'),
              period: l('2015 — 2019'),
              description: l('Distributed systems, operating systems and compiler design.'),
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
              title: l('Multi-Region Event Mesh'),
              description: l('Built an active-active Kafka + Go ingestion pipeline processing 140k events/sec with deterministic replay.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Go', 'Kafka', 'Distributed'],
            },
            {
              title: l('Zero-Downtime Postgres Sharder'),
              description: l('Automated online tenant migration across 32 shards with sub-second cutover and checksum verification.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['PostgreSQL', 'Systems'],
            },
            {
              title: l('GPU Inference Autoscaler'),
              description: l('Cut LLM serving spend by 54% using custom queue-depth autoscaling and quantized batching.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['MLOps', 'Kubernetes'],
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
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'dark-modern-20',
    name: 'Smoked Quartz',
    category: 'dark-modern',
    family: 'Dark Modern',
    audience: ['developer', 'engineer', 'data scientist'],
    description: 'Hyper Blue dark theme for full-stack architects — Mono headings with editorial hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #040814 0%, #182b47 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#ebf3ff',
        accent: '#60a5fa',
        surface: '#040814',
        text: '#cde0f8',
        fontHeading: 'Mono',
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
          eyebrow: l('Full-Stack Architect'),
          headline: l('From raw events to real-time inference.'),
          subheadline: l('Designing storage engines, query planners and high-throughput Kafka/ClickHouse pipelines.'),
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
          items: ['OpenTelemetry', 'Prometheus', 'eBPF', 'Linux', 'ClickHouse'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Staff Platform Engineer'),
              company: l('Veloce Cloud'),
              period: l('2023 — Present'),
              description: l('Own core compute orchestration, multi-region failover and internal developer tooling.'),
            },
            {
              role: l('Senior Backend Engineer'),
              company: l('FinGrid'),
              period: l('2020 — 2023'),
              description: l('Scaled payment ledger throughput 8x while cutting p99 tail latency in half.'),
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
              title: l('Zero-Downtime Postgres Sharder'),
              description: l('Automated online tenant migration across 32 shards with sub-second cutover and checksum verification.'),
              url: '',
              imageUrl: '',
              tags: ['PostgreSQL', 'Systems'],
            },
            {
              title: l('GPU Inference Autoscaler'),
              description: l('Cut LLM serving spend by 54% using custom queue-depth autoscaling and quantized batching.'),
              url: '',
              imageUrl: '',
              tags: ['MLOps', 'Kubernetes'],
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
