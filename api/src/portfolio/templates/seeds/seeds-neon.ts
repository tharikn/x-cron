// Auto-generated template seeds — Neon Cyber (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_NEON: SeedTemplate[] = [
  {
    id: 'neon-01',
    name: 'Neon Grid',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Matrix Lime dark theme for game engine & graphics devs — Mono headings with editorial hero and compact spacing.',
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
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Game Engine & Graphics Dev'),
          headline: l('Hack the frontier.'),
          subheadline: l('Graphics programmer and AI systems researcher building real-time 3D renderers, autonomous agents and security tooling.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#contact-5',
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Graphics programmer and AI systems researcher building real-time 3D renderers, autonomous agents and security tooling. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('WebGPU Fluid & Raymarcher'),
              description: l('60fps real-time volumetric lighting renderer running entirely in browser compute shaders.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['WebGPU', 'Graphics'],
            },
            {
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
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
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'neon-02',
    name: 'Synth Matrix',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Obsidian Emerald dark theme for ai & agentic systems researchers — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('AI & Agentic Systems Researcher'),
          headline: l('Your Name'),
          subheadline: l('Focusing on Vulkan/WebGPU compute shaders, exploit mitigation and deterministic simulation.'),
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
          title: l('Profile'),
          body: l('Focusing on Vulkan/WebGPU compute shaders, exploit mitigation and deterministic simulation. Based in Mysuru, working with teams worldwide.'),
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
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Solved a GPU memory bottleneck in 48 hours that had stumped our team for two months.'),
              author: l('Marcus Chen'),
              role: l('Studio Technical Director'),
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
    id: 'neon-03',
    name: 'Cyber Glitch',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Signal Yellow light theme for offensive security researchers — Mono headings with split-media hero and compact spacing.',
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
        fontBody: 'Outfit',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Offensive Security Researcher'),
          headline: l('Real-time shaders, agents and adversarial defense.'),
          subheadline: l('Open-source contributor, CTF competitor and speaker at technical security conferences.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#contact-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Open-source contributor, CTF competitor and speaker at technical security conferences. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['Reverse Engineering', 'Ghidra', 'Fuzzing', 'Zero-Knowledge Proofs'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
            },
            {
              title: l('WebGPU Fluid & Raymarcher'),
              description: l('60fps real-time volumetric lighting renderer running entirely in browser compute shaders.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['WebGPU', 'Graphics'],
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'neon-04',
    name: 'Shader Core',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Synthwave Pink dark theme for vr / spatial computing devs — Mono headings with editorial hero and compact spacing.',
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
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('VR / Spatial Computing Dev'),
          headline: l('Building tomorrow’s interactive worlds.'),
          subheadline: l('Graphics programmer and AI systems researcher building real-time 3D renderers, autonomous agents and security tooling.'),
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
          body: l('Graphics programmer and AI systems researcher building real-time 3D renderers, autonomous agents and security tooling. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('WebGPU Fluid & Raymarcher'),
              description: l('60fps real-time volumetric lighting renderer running entirely in browser compute shaders.'),
              url: '',
              imageUrl: '',
              tags: ['WebGPU', 'Graphics'],
            },
            {
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: '',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: '',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
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
              quote: l('Solved a GPU memory bottleneck in 48 hours that had stumped our team for two months.'),
              author: l('Marcus Chen'),
              role: l('Studio Technical Director'),
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
    id: 'neon-05',
    name: 'Hex Vector',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Midnight Cobalt dark theme for web3 & cryptography engineers — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Web3 & Cryptography Engineer'),
          headline: l('Your Name'),
          subheadline: l('Focusing on Vulkan/WebGPU compute shaders, exploit mitigation and deterministic simulation.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#contact-5',
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
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['PyTorch', 'LLM Agents', 'RLHF', 'CUDA Kernels'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Solved a GPU memory bottleneck in 48 hours that had stumped our team for two months.'),
              author: l('Marcus Chen'),
              role: l('Studio Technical Director'),
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
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'neon-06',
    name: 'Neural Pulse',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Poster Crimson light theme for robotics & autonomy engineers — Mono headings with split-media hero and compact spacing.',
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
        fontBody: 'Outfit',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Robotics & Autonomy Engineer'),
          headline: l('Low-level craft for high-compute problems.'),
          subheadline: l('Open-source contributor, CTF competitor and speaker at technical security conferences.'),
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
          body: l('Open-source contributor, CTF competitor and speaker at technical security conferences. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['Reverse Engineering', 'Ghidra', 'Fuzzing', 'Zero-Knowledge Proofs'],
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: '',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
            },
            {
              title: l('WebGPU Fluid & Raymarcher'),
              description: l('60fps real-time volumetric lighting renderer running entirely in browser compute shaders.'),
              url: '',
              imageUrl: '',
              tags: ['WebGPU', 'Graphics'],
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'neon-07',
    name: 'Quantum Gate',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Cyber Cyan dark theme for generative shader artists — Mono headings with editorial hero and compact spacing.',
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
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Generative Shader Artist'),
          headline: l('Hack the frontier.'),
          subheadline: l('Graphics programmer and AI systems researcher building real-time 3D renderers, autonomous agents and security tooling.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['C++ / Rust', 'WebGPU / GLSL', 'Unreal / Unity', 'Vulkan'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('WebGPU Fluid & Raymarcher'),
              description: l('60fps real-time volumetric lighting renderer running entirely in browser compute shaders.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['WebGPU', 'Graphics'],
            },
            {
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
            }
          ],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Principal Graphics & AI Engineer'),
              company: l('Hyperion Sim'),
              period: l('2022 — Present'),
              description: l('Architecting neural rendering pipelines and GPU physics simulations.'),
            },
            {
              role: l('Security Researcher'),
              company: l('RedLine Labs'),
              period: l('2019 — 2022'),
              description: l('Vulnerability discovery, exploit mitigation and red-team engagements.'),
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
              quote: l('Solved a GPU memory bottleneck in 48 hours that had stumped our team for two months.'),
              author: l('Marcus Chen'),
              role: l('Studio Technical Director'),
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
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'neon-08',
    name: 'Firewall Zero',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Abyssal Violet dark theme for reverse engineers — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Reverse Engineer'),
          headline: l('Your Name'),
          subheadline: l('Focusing on Vulkan/WebGPU compute shaders, exploit mitigation and deterministic simulation.'),
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
          body: l('Focusing on Vulkan/WebGPU compute shaders, exploit mitigation and deterministic simulation. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Principal Graphics & AI Engineer'),
              company: l('Hyperion Sim'),
              period: l('2022 — Present'),
              description: l('Architecting neural rendering pipelines and GPU physics simulations.'),
            },
            {
              role: l('Security Researcher'),
              company: l('RedLine Labs'),
              period: l('2019 — 2022'),
              description: l('Vulnerability discovery, exploit mitigation and red-team engagements.'),
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
              degree: l('B.Tech. Computer Engineering'),
              school: l('NIT Surathkal'),
              period: l('2015 — 2019'),
              description: l('Computer graphics and systems security lab.'),
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
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: '',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: '',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
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
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'neon-09',
    name: 'Pixel Arcade',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Acid Lime light theme for bug bounty hunters — Mono headings with split-media hero and compact spacing.',
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
        fontBody: 'Outfit',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Bug Bounty Hunter'),
          headline: l('Real-time shaders, agents and adversarial defense.'),
          subheadline: l('Open-source contributor, CTF competitor and speaker at technical security conferences.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Reverse Engineering', 'Ghidra', 'Fuzzing', 'Zero-Knowledge Proofs'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Principal Graphics & AI Engineer'),
              company: l('Hyperion Sim'),
              period: l('2022 — Present'),
              description: l('Architecting neural rendering pipelines and GPU physics simulations.'),
            },
            {
              role: l('Security Researcher'),
              company: l('RedLine Labs'),
              period: l('2019 — 2022'),
              description: l('Vulnerability discovery, exploit mitigation and red-team engagements.'),
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
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
            },
            {
              title: l('WebGPU Fluid & Raymarcher'),
              description: l('60fps real-time volumetric lighting renderer running entirely in browser compute shaders.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['WebGPU', 'Graphics'],
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
    id: 'neon-10',
    name: 'Holo Frame',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Laser Violet dark theme for simulation architects — Mono headings with editorial hero and compact spacing.',
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
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Simulation Architect'),
          headline: l('Building tomorrow’s interactive worlds.'),
          subheadline: l('Graphics programmer and AI systems researcher building real-time 3D renderers, autonomous agents and security tooling.'),
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
              title: l('WebGPU Fluid & Raymarcher'),
              description: l('60fps real-time volumetric lighting renderer running entirely in browser compute shaders.'),
              url: '',
              imageUrl: '',
              tags: ['WebGPU', 'Graphics'],
            },
            {
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: '',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: '',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Approach'),
          body: l('Graphics programmer and AI systems researcher building real-time 3D renderers, autonomous agents and security tooling. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Principal Graphics & AI Engineer'),
              company: l('Hyperion Sim'),
              period: l('2022 — Present'),
              description: l('Architecting neural rendering pipelines and GPU physics simulations.'),
            },
            {
              role: l('Security Researcher'),
              company: l('RedLine Labs'),
              period: l('2019 — 2022'),
              description: l('Vulnerability discovery, exploit mitigation and red-team engagements.'),
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
    id: 'neon-11',
    name: 'Circuit Trace',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Charcoal Amber dark theme for real-time multiplayer devs — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Real-Time Multiplayer Dev'),
          headline: l('Your Name'),
          subheadline: l('Focusing on Vulkan/WebGPU compute shaders, exploit mitigation and deterministic simulation.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#contact-5',
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Focusing on Vulkan/WebGPU compute shaders, exploit mitigation and deterministic simulation. Based in Chennai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
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
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'neon-12',
    name: 'Laser Loop',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Cobalt Slab light theme for embedded & hardware hackers — Mono headings with split-media hero and compact spacing.',
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
        fontBody: 'Outfit',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Embedded & Hardware Hacker'),
          headline: l('Low-level craft for high-compute problems.'),
          subheadline: l('Open-source contributor, CTF competitor and speaker at technical security conferences.'),
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
          title: l('Profile'),
          body: l('Open-source contributor, CTF competitor and speaker at technical security conferences. Based in Kolkata, working with teams worldwide.'),
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
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Solved a GPU memory bottleneck in 48 hours that had stumped our team for two months.'),
              author: l('Marcus Chen'),
              role: l('Studio Technical Director'),
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
    id: 'neon-13',
    name: 'Bit Shift',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Plasma Orange dark theme for digital forensics leads — Mono headings with editorial hero and compact spacing.',
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
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Digital Forensics Lead'),
          headline: l('Hack the frontier.'),
          subheadline: l('Graphics programmer and AI systems researcher building real-time 3D renderers, autonomous agents and security tooling.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#contact-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Graphics programmer and AI systems researcher building real-time 3D renderers, autonomous agents and security tooling. Based in Ahmedabad, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Specialties'),
          items: ['C++ / Rust', 'WebGPU / GLSL', 'Unreal / Unity', 'Vulkan'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('WebGPU Fluid & Raymarcher'),
              description: l('60fps real-time volumetric lighting renderer running entirely in browser compute shaders.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['WebGPU', 'Graphics'],
            },
            {
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
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
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'neon-14',
    name: 'Crypto Vault',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Velvet Rose dark theme for quantum algorithm researchers — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #12090c 0%, #452027 55%, #fb7185 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Quantum Algorithm Researcher'),
          headline: l('Your Name'),
          subheadline: l('Focusing on Vulkan/WebGPU compute shaders, exploit mitigation and deterministic simulation.'),
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
          body: l('Focusing on Vulkan/WebGPU compute shaders, exploit mitigation and deterministic simulation. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: '',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: '',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
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
              quote: l('Solved a GPU memory bottleneck in 48 hours that had stumped our team for two months.'),
              author: l('Marcus Chen'),
              role: l('Studio Technical Director'),
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
    id: 'neon-15',
    name: 'Overclock',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Cyber Magenta light theme for ai red-teaming leads — Mono headings with split-media hero and compact spacing.',
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
        fontBody: 'Outfit',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('AI Red-Teaming Lead'),
          headline: l('Real-time shaders, agents and adversarial defense.'),
          subheadline: l('Open-source contributor, CTF competitor and speaker at technical security conferences.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#contact-5',
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
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
            },
            {
              title: l('WebGPU Fluid & Raymarcher'),
              description: l('60fps real-time volumetric lighting renderer running entirely in browser compute shaders.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['WebGPU', 'Graphics'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Reverse Engineering', 'Ghidra', 'Fuzzing', 'Zero-Knowledge Proofs'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client Feedback'),
          items: [
            {
              quote: l('Solved a GPU memory bottleneck in 48 hours that had stumped our team for two months.'),
              author: l('Marcus Chen'),
              role: l('Studio Technical Director'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'neon-16',
    name: 'Data Stream',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Volt Gold dark theme for audio-visual live coders — Mono headings with editorial hero and compact spacing.',
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
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Audio-Visual Live Coder'),
          headline: l('Building tomorrow’s interactive worlds.'),
          subheadline: l('Graphics programmer and AI systems researcher building real-time 3D renderers, autonomous agents and security tooling.'),
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
          body: l('Graphics programmer and AI systems researcher building real-time 3D renderers, autonomous agents and security tooling. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Capabilities'),
          items: ['C++ / Rust', 'WebGPU / GLSL', 'Unreal / Unity', 'Vulkan'],
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('WebGPU Fluid & Raymarcher'),
              description: l('60fps real-time volumetric lighting renderer running entirely in browser compute shaders.'),
              url: '',
              imageUrl: '',
              tags: ['WebGPU', 'Graphics'],
            },
            {
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: '',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: '',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
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
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'neon-17',
    name: 'Voxel Engine',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Deep Teal dark theme for compiler & vm hackers — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Compiler & VM Hacker'),
          headline: l('Your Name'),
          subheadline: l('Focusing on Vulkan/WebGPU compute shaders, exploit mitigation and deterministic simulation.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['PyTorch', 'LLM Agents', 'RLHF', 'CUDA Kernels'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
            }
          ],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Principal Graphics & AI Engineer'),
              company: l('Hyperion Sim'),
              period: l('2022 — Present'),
              description: l('Architecting neural rendering pipelines and GPU physics simulations.'),
            },
            {
              role: l('Security Researcher'),
              company: l('RedLine Labs'),
              period: l('2019 — 2022'),
              description: l('Vulnerability discovery, exploit mitigation and red-team engagements.'),
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
              quote: l('Solved a GPU memory bottleneck in 48 hours that had stumped our team for two months.'),
              author: l('Marcus Chen'),
              role: l('Studio Technical Director'),
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
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'neon-18',
    name: 'Cyber Deck',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Tangerine Concrete light theme for autonomous drone engineers — Mono headings with split-media hero and compact spacing.',
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
        fontBody: 'Outfit',
        radius: 'md',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Autonomous Drone Engineer'),
          headline: l('Low-level craft for high-compute problems.'),
          subheadline: l('Open-source contributor, CTF competitor and speaker at technical security conferences.'),
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
          body: l('Open-source contributor, CTF competitor and speaker at technical security conferences. Based in Mysuru, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Principal Graphics & AI Engineer'),
              company: l('Hyperion Sim'),
              period: l('2022 — Present'),
              description: l('Architecting neural rendering pipelines and GPU physics simulations.'),
            },
            {
              role: l('Security Researcher'),
              company: l('RedLine Labs'),
              period: l('2019 — 2022'),
              description: l('Vulnerability discovery, exploit mitigation and red-team engagements.'),
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
              degree: l('B.Tech. Computer Engineering'),
              school: l('NIT Surathkal'),
              period: l('2015 — 2019'),
              description: l('Computer graphics and systems security lab.'),
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
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: '',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
            },
            {
              title: l('WebGPU Fluid & Raymarcher'),
              description: l('60fps real-time volumetric lighting renderer running entirely in browser compute shaders.'),
              url: '',
              imageUrl: '',
              tags: ['WebGPU', 'Graphics'],
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('Read.cv'), url: 'https://read.cv/yourname' }],
        },
      }
    ],
  },
  {
    id: 'neon-19',
    name: 'Zero Day',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Hyper Blue dark theme for procedural world builders — Mono headings with editorial hero and compact spacing.',
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
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Procedural World Builder'),
          headline: l('Hack the frontier.'),
          subheadline: l('Graphics programmer and AI systems researcher building real-time 3D renderers, autonomous agents and security tooling.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#cta-5',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['C++ / Rust', 'WebGPU / GLSL', 'Unreal / Unity', 'Vulkan'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Principal Graphics & AI Engineer'),
              company: l('Hyperion Sim'),
              period: l('2022 — Present'),
              description: l('Architecting neural rendering pipelines and GPU physics simulations.'),
            },
            {
              role: l('Security Researcher'),
              company: l('RedLine Labs'),
              period: l('2019 — 2022'),
              description: l('Vulnerability discovery, exploit mitigation and red-team engagements.'),
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
              title: l('WebGPU Fluid & Raymarcher'),
              description: l('60fps real-time volumetric lighting renderer running entirely in browser compute shaders.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['WebGPU', 'Graphics'],
            },
            {
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
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
    id: 'neon-20',
    name: 'Phantom Hex',
    category: 'neon',
    family: 'Neon Cyber',
    audience: ['developer', 'ai researcher', 'game developer'],
    description: 'Smoked Tangerine dark theme for protocol designers — Outfit headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #120c08 0%, #452913 55%, #fb923c 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Protocol Designer'),
          headline: l('Your Name'),
          subheadline: l('Focusing on Vulkan/WebGPU compute shaders, exploit mitigation and deterministic simulation.'),
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
              title: l('Autonomous Sandbox Fuzzer'),
              description: l('Coverage-guided Rust fuzzer that uncovered 11 CVEs in open-source media parsers.'),
              url: '',
              imageUrl: '',
              tags: ['Security', 'Rust'],
            },
            {
              title: l('Multi-Agent Sim Benchmark'),
              description: l('Deterministic simulation environment evaluating tool-using AI agents across 200 tasks.'),
              url: '',
              imageUrl: '',
              tags: ['AI Agents', 'Eval'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Approach'),
          body: l('Focusing on Vulkan/WebGPU compute shaders, exploit mitigation and deterministic simulation. Based in Kolkata, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Principal Graphics & AI Engineer'),
              company: l('Hyperion Sim'),
              period: l('2022 — Present'),
              description: l('Architecting neural rendering pipelines and GPU physics simulations.'),
            },
            {
              role: l('Security Researcher'),
              company: l('RedLine Labs'),
              period: l('2019 — 2022'),
              description: l('Vulnerability discovery, exploit mitigation and red-team engagements.'),
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
