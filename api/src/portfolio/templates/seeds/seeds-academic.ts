// Auto-generated template seeds — Academic Scholar (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_ACADEMIC: SeedTemplate[] = [
  {
    id: 'academic-02',
    name: 'Oxbridge Folio',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Alabaster Cobalt light theme for assistant professors — Georgia headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fafbfe 0%, #dae2fd 55%, #2457f5 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Assistant Professor'),
          headline: l('Your Name'),
          subheadline: l('Faculty researcher investigating interpretable machine learning, causal inference and algorithmic fairness in public systems.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#cta-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Causal Inference', 'Bayesian Modeling', 'Python / R', 'Peer Review'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Assistant Professor of Data Science'),
              company: l('Indian Institute of Science'),
              period: l('2022 — Present'),
              description: l('Lead a 9-person research group; teach graduate courses in statistical learning.'),
            },
            {
              role: l('Postdoctoral Researcher'),
              company: l('ETH Zurich'),
              period: l('2020 — 2022'),
              description: l('Worked on robust causal representation learning.'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Interpretable Urban Heat Models'),
              description: l('Published in Nature Cities (2025). Open-source satellite + sensor pipeline adopted by 14 municipalities.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Peer Reviewed', 'Open Data'],
            },
            {
              title: l('Fairness Under Distribution Shift'),
              description: l('NeurIPS Spotlight paper introducing provable calibration bounds for clinical triage models.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NeurIPS', 'Theory'],
            },
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
    id: 'academic-03',
    name: 'Monograph',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Vellum Rust light theme for principal research scientists — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Principal Research Scientist'),
          headline: l('Researching trustworthy machine intelligence.'),
          subheadline: l('Interdisciplinary lab combining statistical modeling, field experiments and open-source scientific software.'),
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
          title: l('Selected Publications'),
          items: [
            {
              title: l('Fairness Under Distribution Shift'),
              description: l('NeurIPS Spotlight paper introducing provable calibration bounds for clinical triage models.'),
              url: '',
              imageUrl: '',
              tags: ['NeurIPS', 'Theory'],
            },
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: '',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Profile'),
          body: l('Interdisciplinary lab combining statistical modeling, field experiments and open-source scientific software. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Assistant Professor of Data Science'),
              company: l('Indian Institute of Science'),
              period: l('2022 — Present'),
              description: l('Lead a 9-person research group; teach graduate courses in statistical learning.'),
            },
            {
              role: l('Postdoctoral Researcher'),
              company: l('ETH Zurich'),
              period: l('2020 — 2022'),
              description: l('Worked on robust causal representation learning.'),
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
    id: 'academic-04',
    name: 'Peer Review',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Obsidian Emerald dark theme for postdoctoral fellows — Georgia headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
        fontHeading: 'Georgia',
        fontBody: 'System',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Postdoctoral Fellow'),
          headline: l('Bridging formal theory and societal impact.'),
          subheadline: l('Published in NeurIPS, Nature Computational Science and PNAS; open to PhD advising and research collaborations.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#contact-6',
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
              url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
              alt: l('Contemporary glass facade geometry'),
              caption: l('Commercial tower'),
            },
            {
              url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
              alt: l('Sculptural concrete stairwell'),
              caption: l('Public atrium'),
            },
            {
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
              alt: l('Modern residential pavilion exterior'),
              caption: l('Courtyard house'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Published in NeurIPS, Nature Computational Science and PNAS; open to PhD advising and research collaborations. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
            },
            {
              title: l('Interpretable Urban Heat Models'),
              description: l('Published in Nature Cities (2025). Open-source satellite + sensor pipeline adopted by 14 municipalities.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Peer Reviewed', 'Open Data'],
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
          location: l('Jaipur, India'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }, { label: l('ORCID'), url: 'https://orcid.org/0000-0000-0000-0000' }],
        },
      }
    ],
  },
  {
    id: 'academic-05',
    name: 'Faculty Chair',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Porcelain Emerald light theme for phd candidates — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d1f18',
        accent: '#0a8754',
        surface: '#f9fcfa',
        text: '#192a22',
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
          eyebrow: l('PhD Candidate'),
          headline: l('Your Name'),
          subheadline: l('Faculty researcher investigating interpretable machine learning, causal inference and algorithmic fairness in public systems.'),
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
          body: l('Faculty researcher investigating interpretable machine learning, causal inference and algorithmic fairness in public systems. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'masonry',
        props: {
          title: l('Studio Highlights'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
              alt: l('Sculptural concrete stairwell'),
              caption: l('Public atrium'),
            },
            {
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
              alt: l('Modern residential pavilion exterior'),
              caption: l('Courtyard house'),
            },
            {
              url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
              alt: l('Daylit minimalist living space'),
              caption: l('Interior study'),
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
              quote: l('Combines mathematical rigor with rare clarity when mentoring students and writing papers.'),
              author: l('Prof. S. Subramanian'),
              role: l('Department Chair'),
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
    id: 'academic-06',
    name: 'Citation Index',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Newsprint Navy light theme for computational social scientists — Fraunces headings with editorial hero and compact spacing.',
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
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Computational Social Scientist'),
          headline: l('Open data, reproducible science.'),
          subheadline: l('Interdisciplinary lab combining statistical modeling, field experiments and open-source scientific software.'),
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
          body: l('Interdisciplinary lab combining statistical modeling, field experiments and open-source scientific software. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Experimental Design', 'Grant Writing', 'Open Data', 'Statistical Computing'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Fairness Under Distribution Shift'),
              description: l('NeurIPS Spotlight paper introducing provable calibration bounds for clinical triage models.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NeurIPS', 'Theory'],
            },
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
          location: l('Madurai, India'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }, { label: l('ORCID'), url: 'https://orcid.org/0000-0000-0000-0000' }],
        },
      }
    ],
  },
  {
    id: 'academic-07',
    name: 'Seminar Room',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Midnight Cobalt dark theme for climate & earth modelers — Georgia headings with centered hero and comfortable spacing.',
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
        fontBody: 'System',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Climate & Earth Modeler'),
          headline: l('Understanding complex human and natural systems.'),
          subheadline: l('Published in NeurIPS, Nature Computational Science and PNAS; open to PhD advising and research collaborations.'),
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
          body: l('Published in NeurIPS, Nature Computational Science and PNAS; open to PhD advising and research collaborations. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: '',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
            },
            {
              title: l('Interpretable Urban Heat Models'),
              description: l('Published in Nature Cities (2025). Open-source satellite + sensor pipeline adopted by 14 municipalities.'),
              url: '',
              imageUrl: '',
              tags: ['Peer Reviewed', 'Open Data'],
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
              quote: l('Combines mathematical rigor with rare clarity when mentoring students and writing papers.'),
              author: l('Prof. S. Subramanian'),
              role: l('Department Chair'),
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
    id: 'academic-08',
    name: 'Lab Notebook',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Chalk Vermilion light theme for ai safety researchers — Georgia headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fcfbfa 0%, #f7ded9 55%, #d9381e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#191414',
        accent: '#d9381e',
        surface: '#fcfbfa',
        text: '#241e1d',
        fontHeading: 'Georgia',
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
          eyebrow: l('AI Safety Researcher'),
          headline: l('Your Name'),
          subheadline: l('Faculty researcher investigating interpretable machine learning, causal inference and algorithmic fairness in public systems.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Interpretable Urban Heat Models'),
              description: l('Published in Nature Cities (2025). Open-source satellite + sensor pipeline adopted by 14 municipalities.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Peer Reviewed', 'Open Data'],
            },
            {
              title: l('Fairness Under Distribution Shift'),
              description: l('NeurIPS Spotlight paper introducing provable calibration bounds for clinical triage models.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NeurIPS', 'Theory'],
            },
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Causal Inference', 'Bayesian Modeling', 'Python / R', 'Peer Review'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Combines mathematical rigor with rare clarity when mentoring students and writing papers.'),
              author: l('Prof. S. Subramanian'),
              role: l('Department Chair'),
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
          location: l('Jaipur, India'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }, { label: l('ORCID'), url: 'https://orcid.org/0000-0000-0000-0000' }],
        },
      }
    ],
  },
  {
    id: 'academic-09',
    name: 'Grant Abstract',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Parchment Olive light theme for bioinformatics leads — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Bioinformatics Lead'),
          headline: l('Researching trustworthy machine intelligence.'),
          subheadline: l('Interdisciplinary lab combining statistical modeling, field experiments and open-source scientific software.'),
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
          body: l('Interdisciplinary lab combining statistical modeling, field experiments and open-source scientific software. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Specialties'),
          items: ['Experimental Design', 'Grant Writing', 'Open Data', 'Statistical Computing'],
        },
      },
      {
        type: 'gallery',
        variant: 'masonry',
        props: {
          title: l('Studio Highlights'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
              alt: l('Sculptural concrete stairwell'),
              caption: l('Public atrium'),
            },
            {
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
              alt: l('Modern residential pavilion exterior'),
              caption: l('Courtyard house'),
            },
            {
              url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
              alt: l('Daylit minimalist living space'),
              caption: l('Interior study'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Fairness Under Distribution Shift'),
              description: l('NeurIPS Spotlight paper introducing provable calibration bounds for clinical triage models.'),
              url: '',
              imageUrl: '',
              tags: ['NeurIPS', 'Theory'],
            },
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: '',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
          location: l('Goa, India'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }, { label: l('GitHub'), url: 'https://github.com/your-name' }],
        },
      }
    ],
  },
  {
    id: 'academic-10',
    name: 'Tenure Track',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Abyssal Violet dark theme for behavioral economists — Georgia headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f5f3ff',
        accent: '#a78bfa',
        surface: '#0b0917',
        text: '#e0daf8',
        fontHeading: 'Georgia',
        fontBody: 'System',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Behavioral Economist'),
          headline: l('Bridging formal theory and societal impact.'),
          subheadline: l('Published in NeurIPS, Nature Computational Science and PNAS; open to PhD advising and research collaborations.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#contact-7',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Scientific Writing', 'Graduate Teaching', 'Mixed Methods', 'Reproducible Pipelines'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
            },
            {
              title: l('Interpretable Urban Heat Models'),
              description: l('Published in Nature Cities (2025). Open-source satellite + sensor pipeline adopted by 14 municipalities.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Peer Reviewed', 'Open Data'],
            }
          ],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Assistant Professor of Data Science'),
              company: l('Indian Institute of Science'),
              period: l('2022 — Present'),
              description: l('Lead a 9-person research group; teach graduate courses in statistical learning.'),
            },
            {
              role: l('Postdoctoral Researcher'),
              company: l('ETH Zurich'),
              period: l('2020 — 2022'),
              description: l('Worked on robust causal representation learning.'),
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
              quote: l('Combines mathematical rigor with rare clarity when mentoring students and writing papers.'),
              author: l('Prof. S. Subramanian'),
              role: l('Department Chair'),
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
          location: l('Madurai, India'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }, { label: l('ORCID'), url: 'https://orcid.org/0000-0000-0000-0000' }],
        },
      }
    ],
  },
  {
    id: 'academic-11',
    name: 'Colloquium',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Ice Indigo light theme for science & policy fellows — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f5f7ff 0%, #dcdcfb 55%, #4f46e5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#11132b',
        accent: '#4f46e5',
        surface: '#f5f7ff',
        text: '#1e2240',
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
          eyebrow: l('Science & Policy Fellow'),
          headline: l('Your Name'),
          subheadline: l('Faculty researcher investigating interpretable machine learning, causal inference and algorithmic fairness in public systems.'),
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
          title: l('Approach'),
          body: l('Faculty researcher investigating interpretable machine learning, causal inference and algorithmic fairness in public systems. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Assistant Professor of Data Science'),
              company: l('Indian Institute of Science'),
              period: l('2022 — Present'),
              description: l('Lead a 9-person research group; teach graduate courses in statistical learning.'),
            },
            {
              role: l('Postdoctoral Researcher'),
              company: l('ETH Zurich'),
              period: l('2020 — 2022'),
              description: l('Worked on robust causal representation learning.'),
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Interpretable Urban Heat Models'),
              description: l('Published in Nature Cities (2025). Open-source satellite + sensor pipeline adopted by 14 municipalities.'),
              url: '',
              imageUrl: '',
              tags: ['Peer Reviewed', 'Open Data'],
            },
            {
              title: l('Fairness Under Distribution Shift'),
              description: l('NeurIPS Spotlight paper introducing provable calibration bounds for clinical triage models.'),
              url: '',
              imageUrl: '',
              tags: ['NeurIPS', 'Theory'],
            },
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: '',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
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
          location: l('Bengaluru, India'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }, { label: l('GitHub'), url: 'https://github.com/your-name' }],
        },
      }
    ],
  },
  {
    id: 'academic-12',
    name: 'Proceedings',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Cream Burgundy light theme for cognitive neuroscientists — Fraunces headings with editorial hero and compact spacing.',
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
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Cognitive Neuroscientist'),
          headline: l('Open data, reproducible science.'),
          subheadline: l('Interdisciplinary lab combining statistical modeling, field experiments and open-source scientific software.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#cta-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Experimental Design', 'Grant Writing', 'Open Data', 'Statistical Computing'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Assistant Professor of Data Science'),
              company: l('Indian Institute of Science'),
              period: l('2022 — Present'),
              description: l('Lead a 9-person research group; teach graduate courses in statistical learning.'),
            },
            {
              role: l('Postdoctoral Researcher'),
              company: l('ETH Zurich'),
              period: l('2020 — 2022'),
              description: l('Worked on robust causal representation learning.'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Fairness Under Distribution Shift'),
              description: l('NeurIPS Spotlight paper introducing provable calibration bounds for clinical triage models.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NeurIPS', 'Theory'],
            },
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
    id: 'academic-13',
    name: 'Archive Scholar',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Charcoal Amber dark theme for quantum information theorists — Georgia headings with centered hero and comfortable spacing.',
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
        fontBody: 'System',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Quantum Information Theorist'),
          headline: l('Understanding complex human and natural systems.'),
          subheadline: l('Published in NeurIPS, Nature Computational Science and PNAS; open to PhD advising and research collaborations.'),
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
          title: l('Selected Publications'),
          items: [
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: '',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
            },
            {
              title: l('Interpretable Urban Heat Models'),
              description: l('Published in Nature Cities (2025). Open-source satellite + sensor pipeline adopted by 14 municipalities.'),
              url: '',
              imageUrl: '',
              tags: ['Peer Reviewed', 'Open Data'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Profile'),
          body: l('Published in NeurIPS, Nature Computational Science and PNAS; open to PhD advising and research collaborations. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Assistant Professor of Data Science'),
              company: l('Indian Institute of Science'),
              period: l('2022 — Present'),
              description: l('Lead a 9-person research group; teach graduate courses in statistical learning.'),
            },
            {
              role: l('Postdoctoral Researcher'),
              company: l('ETH Zurich'),
              period: l('2020 — 2022'),
              description: l('Worked on robust causal representation learning.'),
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
    id: 'academic-14',
    name: 'Symposium',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Linen Terracotta light theme for urban studies scholars — Georgia headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fdf8f3 0%, #f4dfd5 55%, #c2512b 140%)',
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
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'split-media',
        props: {
          eyebrow: l('Urban Studies Scholar'),
          headline: l('Your Name'),
          subheadline: l('Faculty researcher investigating interpretable machine learning, causal inference and algorithmic fairness in public systems.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#contact-6',
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
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
              alt: l('Modern residential pavilion exterior'),
              caption: l('Courtyard house'),
            },
            {
              url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
              alt: l('Daylit minimalist living space'),
              caption: l('Interior study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
              alt: l('Contemporary glass facade geometry'),
              caption: l('Commercial tower'),
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Faculty researcher investigating interpretable machine learning, causal inference and algorithmic fairness in public systems. Based in Madurai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Interpretable Urban Heat Models'),
              description: l('Published in Nature Cities (2025). Open-source satellite + sensor pipeline adopted by 14 municipalities.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Peer Reviewed', 'Open Data'],
            },
            {
              title: l('Fairness Under Distribution Shift'),
              description: l('NeurIPS Spotlight paper introducing provable calibration bounds for clinical triage models.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NeurIPS', 'Theory'],
            },
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
          location: l('Madurai, India'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }, { label: l('ORCID'), url: 'https://orcid.org/0000-0000-0000-0000' }],
        },
      }
    ],
  },
  {
    id: 'academic-15',
    name: 'Thesis Press',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Oatmeal Forest light theme for nlp research fellows — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('NLP Research Fellow'),
          headline: l('Researching trustworthy machine intelligence.'),
          subheadline: l('Interdisciplinary lab combining statistical modeling, field experiments and open-source scientific software.'),
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
          body: l('Interdisciplinary lab combining statistical modeling, field experiments and open-source scientific software. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'gallery',
        variant: 'masonry',
        props: {
          title: l('Visual Archive'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
              alt: l('Daylit minimalist living space'),
              caption: l('Interior study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
              alt: l('Contemporary glass facade geometry'),
              caption: l('Commercial tower'),
            },
            {
              url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
              alt: l('Sculptural concrete stairwell'),
              caption: l('Public atrium'),
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
              quote: l('Combines mathematical rigor with rare clarity when mentoring students and writing papers.'),
              author: l('Prof. S. Subramanian'),
              role: l('Department Chair'),
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
    id: 'academic-16',
    name: 'Deanery',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Velvet Rose dark theme for epidemiology researchers — Georgia headings with centered hero and compact spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
        fontHeading: 'Georgia',
        fontBody: 'System',
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Epidemiology Researcher'),
          headline: l('Bridging formal theory and societal impact.'),
          subheadline: l('Published in NeurIPS, Nature Computational Science and PNAS; open to PhD advising and research collaborations.'),
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
          body: l('Published in NeurIPS, Nature Computational Science and PNAS; open to PhD advising and research collaborations. Based in Jaipur, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Scientific Writing', 'Graduate Teaching', 'Mixed Methods', 'Reproducible Pipelines'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
            },
            {
              title: l('Interpretable Urban Heat Models'),
              description: l('Published in Nature Cities (2025). Open-source satellite + sensor pipeline adopted by 14 municipalities.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Peer Reviewed', 'Open Data'],
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
          location: l('Jaipur, India'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }, { label: l('ORCID'), url: 'https://orcid.org/0000-0000-0000-0000' }],
        },
      }
    ],
  },
  {
    id: 'academic-17',
    name: 'Fieldwork',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Nordic Spruce light theme for robotics lab directors — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f4fafa 0%, #d2e7e7 55%, #0e7c7b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0c1c1c',
        accent: '#0e7c7b',
        surface: '#f4fafa',
        text: '#172b2b',
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
          eyebrow: l('Robotics Lab Director'),
          headline: l('Your Name'),
          subheadline: l('Faculty researcher investigating interpretable machine learning, causal inference and algorithmic fairness in public systems.'),
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
          body: l('Faculty researcher investigating interpretable machine learning, causal inference and algorithmic fairness in public systems. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Interpretable Urban Heat Models'),
              description: l('Published in Nature Cities (2025). Open-source satellite + sensor pipeline adopted by 14 municipalities.'),
              url: '',
              imageUrl: '',
              tags: ['Peer Reviewed', 'Open Data'],
            },
            {
              title: l('Fairness Under Distribution Shift'),
              description: l('NeurIPS Spotlight paper introducing provable calibration bounds for clinical triage models.'),
              url: '',
              imageUrl: '',
              tags: ['NeurIPS', 'Theory'],
            },
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: '',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
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
              quote: l('Combines mathematical rigor with rare clarity when mentoring students and writing papers.'),
              author: l('Prof. S. Subramanian'),
              role: l('Department Chair'),
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
    id: 'academic-18',
    name: 'Open Science',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Saffron Ink light theme for materials scientists — Fraunces headings with editorial hero and compact spacing.',
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
        radius: 'sm',
        density: 'compact',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Materials Scientist'),
          headline: l('Open data, reproducible science.'),
          subheadline: l('Interdisciplinary lab combining statistical modeling, field experiments and open-source scientific software.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#contact-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Fairness Under Distribution Shift'),
              description: l('NeurIPS Spotlight paper introducing provable calibration bounds for clinical triage models.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NeurIPS', 'Theory'],
            },
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Experimental Design', 'Grant Writing', 'Open Data', 'Statistical Computing'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Combines mathematical rigor with rare clarity when mentoring students and writing papers.'),
              author: l('Prof. S. Subramanian'),
              role: l('Department Chair'),
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
          location: l('Madurai, India'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }, { label: l('ORCID'), url: 'https://orcid.org/0000-0000-0000-0000' }],
        },
      }
    ],
  },
  {
    id: 'academic-19',
    name: 'Fellowship',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Deep Teal dark theme for environmental historians — Georgia headings with centered hero and comfortable spacing.',
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
        fontBody: 'System',
        radius: 'sm',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Environmental Historian'),
          headline: l('Understanding complex human and natural systems.'),
          subheadline: l('Published in NeurIPS, Nature Computational Science and PNAS; open to PhD advising and research collaborations.'),
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
          body: l('Published in NeurIPS, Nature Computational Science and PNAS; open to PhD advising and research collaborations. Based in Bengaluru, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Specialties'),
          items: ['Scientific Writing', 'Graduate Teaching', 'Mixed Methods', 'Reproducible Pipelines'],
        },
      },
      {
        type: 'gallery',
        variant: 'masonry',
        props: {
          title: l('Visual Archive'),
          items: [
            {
              url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
              alt: l('Daylit minimalist living space'),
              caption: l('Interior study'),
            },
            {
              url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
              alt: l('Contemporary glass facade geometry'),
              caption: l('Commercial tower'),
            },
            {
              url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
              alt: l('Sculptural concrete stairwell'),
              caption: l('Public atrium'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: '',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
            },
            {
              title: l('Interpretable Urban Heat Models'),
              description: l('Published in Nature Cities (2025). Open-source satellite + sensor pipeline adopted by 14 municipalities.'),
              url: '',
              imageUrl: '',
              tags: ['Peer Reviewed', 'Open Data'],
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
          location: l('Bengaluru, India'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }, { label: l('GitHub'), url: 'https://github.com/your-name' }],
        },
      }
    ],
  },
  {
    id: 'academic-20',
    name: 'Campus Serif',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Cloud Plum light theme for digital humanities leads — Georgia headings with split-media hero and compact spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fbf8fe 0%, #e8d8f7 55%, #7e22ce 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1e1024',
        accent: '#7e22ce',
        surface: '#fbf8fe',
        text: '#2b1b33',
        fontHeading: 'Georgia',
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
          eyebrow: l('Digital Humanities Lead'),
          headline: l('Your Name'),
          subheadline: l('Faculty researcher investigating interpretable machine learning, causal inference and algorithmic fairness in public systems.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#contact-7',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Causal Inference', 'Bayesian Modeling', 'Python / R', 'Peer Review'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Interpretable Urban Heat Models'),
              description: l('Published in Nature Cities (2025). Open-source satellite + sensor pipeline adopted by 14 municipalities.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Peer Reviewed', 'Open Data'],
            },
            {
              title: l('Fairness Under Distribution Shift'),
              description: l('NeurIPS Spotlight paper introducing provable calibration bounds for clinical triage models.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['NeurIPS', 'Theory'],
            },
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
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
              role: l('Assistant Professor of Data Science'),
              company: l('Indian Institute of Science'),
              period: l('2022 — Present'),
              description: l('Lead a 9-person research group; teach graduate courses in statistical learning.'),
            },
            {
              role: l('Postdoctoral Researcher'),
              company: l('ETH Zurich'),
              period: l('2020 — 2022'),
              description: l('Worked on robust causal representation learning.'),
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
              quote: l('Combines mathematical rigor with rare clarity when mentoring students and writing papers.'),
              author: l('Prof. S. Subramanian'),
              role: l('Department Chair'),
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
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
          location: l('Jaipur, India'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }, { label: l('ORCID'), url: 'https://orcid.org/0000-0000-0000-0000' }],
        },
      }
    ],
  },
  {
    id: 'academic-21',
    name: 'Lecture Notes',
    category: 'academic',
    family: 'Academic Scholar',
    audience: ['researcher', 'academic', 'professor'],
    description: 'Sepia Slate light theme for visiting lecturers — Fraunces headings with editorial hero and comfortable spacing.',
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
          eyebrow: l('Visiting Lecturer'),
          headline: l('Researching trustworthy machine intelligence.'),
          subheadline: l('Interdisciplinary lab combining statistical modeling, field experiments and open-source scientific software.'),
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
          title: l('Approach'),
          body: l('Interdisciplinary lab combining statistical modeling, field experiments and open-source scientific software. Based in Goa, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Assistant Professor of Data Science'),
              company: l('Indian Institute of Science'),
              period: l('2022 — Present'),
              description: l('Lead a 9-person research group; teach graduate courses in statistical learning.'),
            },
            {
              role: l('Postdoctoral Researcher'),
              company: l('ETH Zurich'),
              period: l('2020 — 2022'),
              description: l('Worked on robust causal representation learning.'),
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
              degree: l('Ph.D. Computer Science'),
              school: l('IIIT Hyderabad'),
              period: l('2016 — 2020'),
              description: l('Dissertation on uncertainty quantification in structured prediction.'),
            },
            {
              degree: l('M.Sc. Applied Mathematics'),
              school: l('Chennai Mathematical Institute'),
              period: l('2014 — 2016'),
              description: l('Probability theory and statistical inference.'),
            }
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Publications'),
          items: [
            {
              title: l('Fairness Under Distribution Shift'),
              description: l('NeurIPS Spotlight paper introducing provable calibration bounds for clinical triage models.'),
              url: '',
              imageUrl: '',
              tags: ['NeurIPS', 'Theory'],
            },
            {
              title: l('Open Civic Benchmark Suite'),
              description: l('Curated 12 multilingual evaluation datasets maintained with 40+ academic contributors.'),
              url: '',
              imageUrl: '',
              tags: ['Dataset', 'Benchmark'],
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
          location: l('Goa, India'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }, { label: l('GitHub'), url: 'https://github.com/your-name' }],
        },
      }
    ],
  },
];
