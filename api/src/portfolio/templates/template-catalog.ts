import { defaultVariantFor } from '../component-registry';
import { DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME, themeTokens } from '../design-tokens';
import type {
  PortfolioDocument,
  PortfolioLocalizedText,
  PortfolioSection,
  PortfolioSectionType,
  PortfolioTemplateDefinition,
} from '../portfolio.types';

/**
 * Starter template catalog (MVP).
 *
 * Templates are immutable design packages: presentation defaults + sample
 * section content. User content lives in the site document only. The catalog is
 * deliberately explicit rather than procedural so every template is reviewable
 * and every published site keeps the exact template version it used.
 *
 * The 100+ catalog expansion (DP-009) adds more entries here — never mutate an
 * existing template version used by a published site.
 */

const VERSION = '1.0.0';

const l = (en: string, ta?: string): PortfolioLocalizedText =>
  ta ? { 'en-IN': en, 'ta-IN': ta } : { 'en-IN': en };

interface SeedSection {
  type: PortfolioSectionType;
  variant?: string;
  props: Record<string, unknown>;
}

interface SeedTemplate {
  id: string;
  name: string;
  category: string;
  family: string;
  audience: string[];
  description: string;
  supportsDark: boolean;
  previewGradient: string;
  theme: PortfolioTemplateDefinition['theme'];
  sections: SeedSection[];
}

const LIGHT_PAPER = themeTokens({
  primary: '#0f0f10',
  accent: '#2f6fed',
  surface: '#ffffff',
  text: '#141416',
  fontHeading: 'Georgia',
  fontBody: 'Manrope',
  radius: 'sm',
  density: 'comfortable',
});

const SEEDS: SeedTemplate[] = [
  {
    id: 'minimal-swiss-01',
    name: 'Swiss Minimal',
    category: 'minimal',
    family: 'Minimal Swiss',
    audience: ['developer', 'product manager', 'general professional'],
    description:
      'Quiet typographic layout with strong hierarchy, generous whitespace and a single accent.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #ffffff 0%, #f1f1ef 60%, #2f6fed 140%)',
    theme: { mode: 'light', tokens: LIGHT_PAPER },
    sections: [
      {
        type: 'hero',
        variant: 'centered',
        props: {
          eyebrow: l('Product designer'),
          headline: l('Your Name'),
          subheadline: l(
            'I design calm, useful interfaces for teams that care about craft.',
          ),
          primaryCtaLabel: l('Get in touch'),
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
          body: l(
            'Short introduction: what you do, who you help and the kind of work you want next. Keep it to two or three sentences.',
          ),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Skills'),
          items: ['Product design', 'Design systems', 'Prototyping', 'Research'],
        },
      },
      {
        type: 'projects',
        variant: 'grid',
        props: {
          title: l('Selected work'),
          items: [
            {
              title: l('Project one'),
              description: l('What the project was, your role and the outcome.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['UX', 'Web'],
            },
            {
              title: l('Project two'),
              description: l('A second case study with a clear, measurable result.'),
              url: '',
              imageUrl: '',
              tags: ['Design system'],
            },
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Contact'),
          body: l('Open to freelance work and full-time roles.'),
          email: 'you@example.com',
          phone: '',
          location: l('Chennai, India'),
          links: [
            { label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' },
            { label: l('GitHub'), url: 'https://github.com/your-name' },
          ],
        },
      },
    ],
  },
  {
    id: 'editorial-01',
    name: 'Editorial',
    category: 'editorial',
    family: 'Editorial / magazine',
    audience: ['writer', 'designer', 'content creator'],
    description:
      'Magazine-style split hero, serif display type and a narrative project list.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f7f1e7 0%, #e9d8c2 55%, #4a3b2a 130%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#2a2118',
        accent: '#b4582a',
        surface: '#fbf7f0',
        text: '#241c14',
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
          eyebrow: l('Writer · Editor'),
          headline: l('Stories that make complex ideas feel human.'),
          subheadline: l(
            'Long-form essays, interviews and editorial strategy for culture and technology.',
          ),
          primaryCtaLabel: l('Read selected work'),
          primaryCtaHref: '#work',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('A little about me'),
          body: l(
            'I write about the people building the future and the places technology touches. Replace this with your own voice and beat.',
          ),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected writing'),
          items: [
            {
              title: l('The quiet infrastructure of care'),
              description: l('Feature essay · 2,400 words · Published 2026'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Essay'],
            },
            {
              title: l('Interview: building for the next billion'),
              description: l('Interview series · 5 parts'),
              url: '',
              imageUrl: '',
              tags: ['Interview'],
            },
          ],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind words'),
          items: [
            {
              quote: l('Clear thinking, sharp edits and always on deadline.'),
              author: l('Editor name'),
              role: l('Publication'),
            },
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Work with me'),
          body: l('Available for features, interviews and editorial consulting.'),
          email: 'you@example.com',
          phone: '',
          location: l('Bengaluru, India'),
          links: [{ label: l('Mastodon'), url: 'https://mastodon.social/@yourname' }],
        },
      },
    ],
  },
  {
    id: 'bento-01',
    name: 'Bento Grid',
    category: 'bento',
    family: 'Bento grid',
    audience: ['product manager', 'founder', 'consultant'],
    description:
      'Modular card grid that shows skills, work and proof points at a glance.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #101321 0%, #1c2340 55%, #7c5cff 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f5f7ff',
        accent: '#9b8cff',
        surface: '#121421',
        text: '#f2f4ff',
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
          eyebrow: l('Product · Strategy'),
          headline: l('Your Name'),
          subheadline: l(
            'I turn ambiguous problems into shipped products. Currently exploring AI-native workflows.',
          ),
          primaryCtaLabel: l('See my work'),
          primaryCtaHref: '#work',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('What I do'),
          items: ['Product strategy', 'Discovery', 'Roadmapping', 'Analytics', 'Team coaching'],
        },
      },
      {
        type: 'projects',
        variant: 'grid',
        props: {
          title: l('Selected outcomes'),
          items: [
            {
              title: l('Onboarding rebuild'),
              description: l('Reduced time-to-value from 9 days to 2 days.'),
              url: '',
              imageUrl: '',
              tags: ['Activation'],
            },
            {
              title: l('Pricing experiment'),
              description: l('Improved trial conversion by 18%.'),
              url: '',
              imageUrl: '',
              tags: ['Growth'],
            },
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
              role: l('Senior Product Manager'),
              company: l('Company name'),
              period: l('2023 — now'),
              description: l('Own the core product area and a team of five.'),
            },
            {
              role: l('Product Manager'),
              company: l('Previous company'),
              period: l('2020 — 2023'),
              description: l('Shipped the first mobile release and built the research practice.'),
            },
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Say hello'),
          body: l('Happy to compare notes on product, hiring or collaborations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Remote · India'),
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      },
    ],
  },
  {
    id: 'dev-dark-01',
    name: 'Dark Developer',
    category: 'developer',
    family: 'Dark developer',
    audience: ['developer', 'engineer', 'student'],
    description:
      'Terminal-inspired dark theme with stack chips, project list and a hiring CTA.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #060a12 0%, #0d1b2a 55%, #22c55e 145%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#e6edf3',
        accent: '#3fb950',
        surface: '#0b1220',
        text: '#e6edf3',
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
          eyebrow: l('Software engineer'),
          headline: l('Your Name'),
          subheadline: l(
            'Backend-leaning full-stack engineer. I like boring infrastructure, fast APIs and clear docs.',
          ),
          primaryCtaLabel: l('View projects'),
          primaryCtaHref: '#work',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Stack'),
          items: ['TypeScript', 'NestJS', 'Angular', 'PostgreSQL', 'Redis', 'AWS'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Projects'),
          items: [
            {
              title: l('Project name'),
              description: l('One line on the problem, one line on the architecture, one on impact.'),
              url: 'https://github.com/your-name',
              imageUrl: '',
              tags: ['TypeScript', 'Postgres'],
            },
            {
              title: l('Open source contribution'),
              description: l('What you changed and why it mattered.'),
              url: '',
              imageUrl: '',
              tags: ['Open source'],
            },
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
              role: l('Software Engineer'),
              company: l('Company name'),
              period: l('2024 — now'),
              description: l('Build and operate the platform API and background workers.'),
            },
          ],
        },
      },
      {
        type: 'cta',
        variant: 'band',
        props: {
          headline: l('Open to backend and platform roles.'),
          body: l('Send a short note with the problem your team is solving.'),
          buttonLabel: l('Email me'),
          buttonHref: 'mailto:you@example.com',
        },
      },
    ],
  },
  {
    id: 'brutalist-01',
    name: 'Neo-Brutalist',
    category: 'brutalist',
    family: 'Neo-brutalist',
    audience: ['artist', 'designer', 'creator'],
    description:
      'High-contrast blocks, hard borders and an unapologetically bold accent.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f6f2e8 0%, #ffe066 55%, #121212 135%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#111111',
        accent: '#ffd400',
        surface: '#f6f2e8',
        text: '#111111',
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
          eyebrow: l('Artist / maker'),
          headline: l('MAKE IT LOUD.'),
          subheadline: l('Identity, posters and interactive work for people who dislike beige.'),
          primaryCtaLabel: l('See the work'),
          primaryCtaHref: '#work',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Who'),
          body: l(
            'Replace this with a short, direct introduction. No jargon, no filler — just what you make and who it is for.',
          ),
        },
      },
      {
        type: 'projects',
        variant: 'grid',
        props: {
          title: l('Work'),
          items: [
            {
              title: l('Campaign identity'),
              description: l('Visual system, posters and motion for a launch.'),
              url: '',
              imageUrl: '',
              tags: ['Identity'],
            },
            {
              title: l('Gallery show'),
              description: l('Curated group show and printed catalogue.'),
              url: '',
              imageUrl: '',
              tags: ['Exhibition'],
            },
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Commission me'),
          body: l('Open for select projects and collaborations.'),
          email: 'you@example.com',
          phone: '',
          location: l('Mumbai, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }],
        },
      },
    ],
  },
  {
    id: 'glass-01',
    name: 'Glass Accent',
    category: 'glass',
    family: 'Glass accent',
    audience: ['designer', 'creator', 'agency'],
    description:
      'Soft translucent panels over a deep gradient, with restrained motion.',
    supportsDark: true,
    previewGradient:
      'linear-gradient(135deg, #0b1020 0%, #243b6b 50%, rgba(255,255,255,0.35) 120%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f7f9ff',
        accent: '#7dd3fc',
        surface: '#0f1628',
        text: '#eef4ff',
        fontHeading: 'Outfit',
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
          eyebrow: l('Design studio'),
          headline: l('Interfaces with a little atmosphere.'),
          subheadline: l('Product design and brand systems for early teams.'),
          primaryCtaLabel: l('Start a project'),
          primaryCtaHref: 'mailto:hello@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Studio'),
          body: l(
            'We help small teams turn rough ideas into clear, buildable products. Replace this with your studio story.',
          ),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Capabilities'),
          items: ['Product design', 'Brand', 'Design engineering', 'Motion'],
        },
      },
      {
        type: 'gallery',
        variant: 'grid',
        props: {
          title: l('Selected visuals'),
          items: [
            { url: '', alt: l('Project visual'), caption: l('Campaign 2026') },
            { url: '', alt: l('Interface detail'), caption: l('Product UI') },
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Let’s talk'),
          body: l('Tell us what you are building and where you are stuck.'),
          email: 'hello@example.com',
          phone: '',
          location: l('Remote'),
          links: [{ label: l('Dribbble'), url: 'https://dribbble.com/yourname' }],
        },
      },
    ],
  },
  {
    id: 'photography-01',
    name: 'Photography',
    category: 'photography',
    family: 'Photography',
    audience: ['photographer'],
    description:
      'Image-first page with a dark canvas, masonry gallery and minimal chrome.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #0a0a0a 0%, #2b2b2b 55%, #d8c3a5 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f4f1ea',
        accent: '#d8c3a5',
        surface: '#0d0d0d',
        text: '#f4f1ea',
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
          eyebrow: l('Photographer'),
          headline: l('Your Name'),
          subheadline: l('Portraits, editorial and quiet observations of everyday light.'),
          primaryCtaLabel: l('View gallery'),
          primaryCtaHref: '#gallery',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'gallery',
        variant: 'masonry',
        props: {
          title: l('Gallery'),
          items: [
            { url: '', alt: l('Portrait series'), caption: l('Portraits') },
            { url: '', alt: l('Street photograph'), caption: l('Street') },
            { url: '', alt: l('Landscape photograph'), caption: l('Landscape') },
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('About'),
          body: l('A short statement about your approach, clients and available formats.'),
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Bookings'),
          body: l('Available for editorial and portrait commissions.'),
          email: 'you@example.com',
          phone: '',
          location: l('Chennai, India'),
          links: [{ label: l('Instagram'), url: 'https://instagram.com/yourname' }],
        },
      },
    ],
  },
  {
    id: 'designer-case-study-01',
    name: 'Case Study',
    category: 'designer',
    family: 'Designer case study',
    audience: ['designer', 'researcher'],
    description:
      'Long-form case study layout with outcomes up front and a narrative list.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f5f7fb 0%, #dbe4ff 55%, #4b5bd6 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#161826',
        accent: '#4b5bd6',
        surface: '#ffffff',
        text: '#161826',
        fontHeading: 'Outfit',
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
          eyebrow: l('UX designer'),
          headline: l('Designing decisions, not just screens.'),
          subheadline: l('Case studies from complex B2B and civic products.'),
          primaryCtaLabel: l('Read case studies'),
          primaryCtaHref: '#work',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case studies'),
          items: [
            {
              title: l('Permissions redesign'),
              description: l('Problem → research → options → shipped outcome.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Research', 'Systems'],
            },
            {
              title: l('Checkout rebuild'),
              description: l('Reduced drop-off by clarifying pricing and recovery.'),
              url: '',
              imageUrl: '',
              tags: ['E-commerce'],
            },
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('How I work'),
          body: l(
            'I start with the decision the team needs to make, then design the smallest useful artefact to make it.',
          ),
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Collaborators say'),
          items: [
            {
              quote: l('Made the complex feel obvious without dumbing it down.'),
              author: l('Product lead'),
              role: l('Company'),
            },
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Available for projects'),
          body: l('Two slots open this quarter.'),
          email: 'you@example.com',
          phone: '',
          location: l('Remote'),
          links: [{ label: l('Read CV'), url: 'https://example.com' }],
        },
      },
    ],
  },
  {
    id: 'writer-01',
    name: 'Writer',
    category: 'writer',
    family: 'Writer / editorial',
    audience: ['writer', 'poet', 'content creator'],
    description:
      'Text-first single column with a reading-list feel and warm paper tones.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fffdf7 0%, #f0e7d6 60%, #7a5c3e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1d1a16',
        accent: '#7a5c3e',
        surface: '#fffdf7',
        text: '#1d1a16',
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
          eyebrow: l('Poet · Essayist'),
          headline: l('Your Name'),
          subheadline: l('Notes on language, memory and the spaces between.'),
          primaryCtaLabel: l('Read'),
          primaryCtaHref: '#work',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('About'),
          body: l('A short biographical note. Mention your published work and current projects.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected publications'),
          items: [
            {
              title: l('Title of essay or book'),
              description: l('Publication · Year'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Essay'],
            },
            {
              title: l('Title of poem or story'),
              description: l('Magazine · Year'),
              url: '',
              imageUrl: '',
              tags: ['Poetry'],
            },
          ],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Praise'),
          items: [
            {
              quote: l('A distinctive voice, precise and generous.'),
              author: l('Reviewer'),
              role: l('Publication'),
            },
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Contact'),
          body: l('For readings, commissions and editorial enquiries.'),
          email: 'you@example.com',
          phone: '',
          location: l('Kochi, India'),
          links: [],
        },
      },
    ],
  },
  {
    id: 'academic-01',
    name: 'Academic',
    category: 'academic',
    family: 'Academic / researcher',
    audience: ['researcher', 'student', 'academic'],
    description:
      'Structured academic profile with education, publications and research interests.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f7f9fc 0%, #dfe8f5 55%, #1f4e79 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#122033',
        accent: '#1f4e79',
        surface: '#f7f9fc',
        text: '#122033',
        fontHeading: 'Georgia',
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
          eyebrow: l('Researcher'),
          headline: l('Your Name'),
          subheadline: l('Computational social science · mixed methods · open data.'),
          primaryCtaLabel: l('Publications'),
          primaryCtaHref: '#work',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Research statement'),
          body: l(
            'Two or three sentences on your research question, method and why it matters.',
          ),
        },
      },
      {
        type: 'education',
        variant: 'list',
        props: {
          title: l('Education'),
          items: [
            {
              degree: l('PhD, Discipline'),
              school: l('University'),
              period: l('2021 — 2026'),
              description: l('Thesis title and advisor.'),
            },
            {
              degree: l('MSc, Discipline'),
              school: l('University'),
              period: l('2019 — 2021'),
              description: l(''),
            },
          ],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Publications'),
          items: [
            {
              title: l('Paper title'),
              description: l('Authors · Venue · Year'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Peer reviewed'],
            },
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Contact'),
          body: l('Open to collaboration and speaking invitations.'),
          email: 'you@university.edu',
          phone: '',
          location: l('Institution, city'),
          links: [{ label: l('Google Scholar'), url: 'https://scholar.google.com' }],
        },
      },
    ],
  },
  {
    id: 'student-01',
    name: 'Graduate',
    category: 'student',
    family: 'Student / graduate',
    audience: ['student', 'graduate'],
    description:
      'Friendly first-portfolio layout that highlights projects, coursework and availability.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f4f7ff 0%, #d9e6ff 55%, #6d5efc 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#141a2e',
        accent: '#6d5efc',
        surface: '#ffffff',
        text: '#141a2e',
        fontHeading: 'Outfit',
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
          eyebrow: l('Graduate · 2026'),
          headline: l('Your Name'),
          subheadline: l('Final-year computer science student looking for a first backend role.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#work',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Hello'),
          body: l('What you study, what you enjoy building and what you are looking for next.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Skills'),
          items: ['Java', 'Spring Boot', 'SQL', 'Git', 'DSA'],
        },
      },
      {
        type: 'projects',
        variant: 'grid',
        props: {
          title: l('Projects'),
          items: [
            {
              title: l('Final-year project'),
              description: l('Problem, stack and what you learned.'),
              url: 'https://github.com/your-name',
              imageUrl: '',
              tags: ['Team of 4'],
            },
            {
              title: l('Side project'),
              description: l('A small tool you built for fun.'),
              url: '',
              imageUrl: '',
              tags: ['Side project'],
            },
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
              degree: l('BSc Computer Science'),
              school: l('College name'),
              period: l('2022 — 2026'),
              description: l('Relevant coursework and CGPA.'),
            },
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Get in touch'),
          body: l('Looking for internships and graduate roles.'),
          email: 'you@example.com',
          phone: '',
          location: l('India'),
          links: [{ label: l('GitHub'), url: 'https://github.com/your-name' }],
        },
      },
    ],
  },
  {
    id: 'premium-onepage-01',
    name: 'Premium One-Page',
    category: 'premium',
    family: 'Premium one-page',
    audience: ['consultant', 'founder', 'general professional'],
    description:
      'Luxury dark one-pager with a single accent, large type and confident spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #0b0b0d 0%, #1a1712 55%, #c9a227 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f4f0e6',
        accent: '#c9a227',
        surface: '#0b0b0d',
        text: '#f4f0e6',
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
          eyebrow: l('Independent consultant'),
          headline: l('Clarity for teams at an inflection point.'),
          subheadline: l('Strategy, positioning and go-to-market for technical products.'),
          primaryCtaLabel: l('Book an intro call'),
          primaryCtaHref: 'mailto:you@example.com',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('How I help'),
          body: l(
            'A tight positioning statement: the problem you solve, for whom, and the outcome they get.',
          ),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Selected clients'),
          items: [
            {
              role: l('Advisor'),
              company: l('Client name'),
              period: l('2025 — now'),
              description: l('Positioning and pricing for a Series A developer tool.'),
            },
          ],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('What clients say'),
          items: [
            {
              quote: l('Sharp, fast and unusually good at getting to the real question.'),
              author: l('Founder'),
              role: l('Client'),
            },
          ],
        },
      },
      {
        type: 'cta',
        variant: 'band',
        props: {
          headline: l('Two engagements open this quarter.'),
          body: l('Tell me what you are working on.'),
          buttonLabel: l('Get in touch'),
          buttonHref: 'mailto:you@example.com',
        },
      },
    ],
  },
  {
    id: 'freelancer-01',
    name: 'Freelancer',
    category: 'freelancer',
    family: 'Freelancer',
    audience: ['freelancer', 'consultant', 'designer'],
    description:
      'Service-led layout with clear offers, proof and a single contact call to action.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fff8f0 0%, #ffe3c2 55%, #e2703a 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#20140c',
        accent: '#e2703a',
        surface: '#fff8f0',
        text: '#20140c',
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
          eyebrow: l('Freelance designer'),
          headline: l('Your Name'),
          subheadline: l('Websites and product UI for small teams — fixed scope, clear timelines.'),
          primaryCtaLabel: l('Start a project'),
          primaryCtaHref: '#contact',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('What you get'),
          items: [
            'Website design',
            'Landing pages',
            'Product UI',
            'Design handoff',
          ],
        },
      },
      {
        type: 'projects',
        variant: 'grid',
        props: {
          title: l('Recent work'),
          items: [
            {
              title: l('Client website'),
              description: l('Scope, timeline and result.'),
              url: '',
              imageUrl: '',
              tags: ['Website'],
            },
          ],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Client feedback'),
          items: [
            {
              quote: l('Easy to work with and shipped ahead of schedule.'),
              author: l('Client name'),
              role: l('Company'),
            },
          ],
        },
      },
      {
        type: 'contact',
        variant: 'panel',
        props: {
          title: l('Start a project'),
          body: l('Share your timeline and budget range.'),
          email: 'you@example.com',
          phone: '',
          location: l('Remote'),
          links: [],
        },
      },
    ],
  },
];

function toDefinition(seed: SeedTemplate): PortfolioTemplateDefinition {
  return {
    id: seed.id,
    version: VERSION,
    name: seed.name,
    category: seed.category,
    family: seed.family,
    audience: seed.audience,
    description: seed.description,
    supportsDark: seed.supportsDark,
    contentDensity: seed.theme.tokens.density,
    previewGradient: seed.previewGradient,
    theme: seed.theme,
    sections: seed.sections.map((section) => ({
      type: section.type,
      variant: section.variant ?? defaultVariantFor(section.type),
      props: section.props,
    })),
  };
}

export const PORTFOLIO_TEMPLATES: PortfolioTemplateDefinition[] =
  SEEDS.map(toDefinition);

const TEMPLATE_BY_ID = new Map(
  PORTFOLIO_TEMPLATES.map((template) => [template.id, template]),
);

export function findTemplate(
  templateId: string,
): PortfolioTemplateDefinition | undefined {
  return TEMPLATE_BY_ID.get(templateId);
}

export function listTemplates(): PortfolioTemplateDefinition[] {
  return PORTFOLIO_TEMPLATES;
}

export interface BuildSiteDocumentInput {
  siteId: string;
  name: string;
  slug: string;
  defaultLocale: string;
  locales: string[];
}

/** Seed a new draft document from an immutable template package. */
export function buildSiteDocument(
  template: PortfolioTemplateDefinition,
  input: BuildSiteDocumentInput,
): PortfolioDocument {
  const locale = input.defaultLocale;
  const sections: PortfolioSection[] = template.sections.map((section, index) => ({
    id: `${section.type}-${index + 1}`,
    type: section.type,
    variant: section.variant,
    hidden: false,
    props: JSON.parse(JSON.stringify(section.props)) as Record<string, unknown>,
  }));

  const hero = sections.find((section) => section.type === 'hero');
  const heroProps = (hero?.props ?? {}) as Record<string, unknown>;
  const roleText =
    (heroProps['subheadline'] as PortfolioLocalizedText | undefined)?.[locale] ??
    template.description;

  const navLabels: Record<PortfolioSectionType, string> = {
    hero: 'Home',
    about: 'About',
    skills: 'Skills',
    projects: 'Work',
    experience: 'Experience',
    education: 'Education',
    gallery: 'Gallery',
    testimonials: 'Testimonials',
    contact: 'Contact',
    cta: 'Contact',
    'custom-code': 'Interactive',
  };
  const navigation = [
    { id: 'nav-home', label: { [locale]: 'Home' }, target: '/' },
  ];
  const seenTargets = new Set<string>(['/']);
  for (const section of sections) {
    const target = `#${section.id}`;
    if (seenTargets.has(target)) continue;
    seenTargets.add(target);
    navigation.push({
      id: `nav-${section.id}`,
      label: { [locale]: navLabels[section.type] },
      target,
    });
  }

  return {
    schemaVersion: '1.0',
    site: {
      id: input.siteId,
      name: input.name,
      slug: input.slug,
      defaultLocale: locale,
      locales: input.locales.length > 0 ? input.locales : [locale],
      template: { id: template.id, version: template.version },
    },
    theme: JSON.parse(JSON.stringify(template.theme)) as PortfolioDocument['theme'],
    navigation,
    pages: [
      {
        id: 'home',
        path: '/',
        seo: {
          title: { [locale]: `${input.name} · Portfolio` },
          description: { [locale]: roleText.slice(0, 160) },
        },
        sections,
      },
    ],
  };
}

/** Built-in fallback when a template id is missing from the catalog. */
export function fallbackTemplate(): PortfolioTemplateDefinition {
  return (
    TEMPLATE_BY_ID.get('minimal-swiss-01') ??
    toDefinition(SEEDS[0] as SeedTemplate)
  );
}

export { DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME };
