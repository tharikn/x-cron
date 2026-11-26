// Auto-generated template seeds — Educator Warm (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_EDUCATOR: SeedTemplate[] = [
  {
    id: 'educator-01',
    name: 'Sage Classroom',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Lavender Fog light theme for curriculum designers — Fraunces headings with editorial hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Curriculum Designer'),
          headline: l('Your Name'),
          subheadline: l('Educator and instructional designer crafting hands-on workshops, cohort courses and open curricula.'),
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
          items: ['Curriculum Design', 'Workshop Facilitation', 'Project-Based Learning', 'Assessment'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Director of Learning Design'),
              company: l('CraftSchool'),
              period: l('2022 — Present'),
              description: l('Lead curriculum architecture and mentor training across 12 live programs.'),
            },
            {
              role: l('Senior Lecturer'),
              company: l('St. Xavier’s College'),
              period: l('2017 — 2022'),
              description: l('Taught undergraduate courses and redesigned lab practicums.'),
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
              title: l('Interactive Systems Bootcamp'),
              description: l('Designed an 8-week cohort curriculum with 94% completion rate across 600+ learners.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Curriculum', 'Cohort'],
            },
            {
              title: l('Open Visual Math Workbook'),
              description: l('Free illustrated geometry and probability workbook downloaded by 18,000 students.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Open Ed', 'Print'],
            },
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
    id: 'educator-02',
    name: 'Office Hours',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Vellum Rust light theme for university lecturers — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #faf4ea 0%, #eed9cb 55%, #a8431a 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261a12',
        accent: '#a8431a',
        surface: '#faf4ea',
        text: '#33241b',
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
          eyebrow: l('University Lecturer'),
          headline: l('Teaching complex ideas until they click.'),
          subheadline: l('Twelve years mentoring students, career switchers and engineering teams across classrooms and remote cohorts.'),
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
              title: l('Open Visual Math Workbook'),
              description: l('Free illustrated geometry and probability workbook downloaded by 18,000 students.'),
              url: '',
              imageUrl: '',
              tags: ['Open Ed', 'Print'],
            },
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: '',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Profile'),
          body: l('Twelve years mentoring students, career switchers and engineering teams across classrooms and remote cohorts. Based in Pune, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Director of Learning Design'),
              company: l('CraftSchool'),
              period: l('2022 — Present'),
              description: l('Lead curriculum architecture and mentor training across 12 live programs.'),
            },
            {
              role: l('Senior Lecturer'),
              company: l('St. Xavier’s College'),
              period: l('2017 — 2022'),
              description: l('Taught undergraduate courses and redesigned lab practicums.'),
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
    id: 'educator-03',
    name: 'Syllabus',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Alabaster Cobalt light theme for corporate learning leads — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fafbfe 0%, #dae2fd 55%, #2457f5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1320',
        accent: '#2457f5',
        surface: '#fafbfe',
        text: '#1c2436',
        fontHeading: 'Georgia',
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
          eyebrow: l('Corporate Learning Lead'),
          headline: l('Designing learning experiences that stick.'),
          subheadline: l('Focused on active learning, clear mental models and supportive feedback loops.'),
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Focused on active learning, clear mental models and supportive feedback loops. Based in Chandigarh, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
            },
            {
              title: l('Interactive Systems Bootcamp'),
              description: l('Designed an 8-week cohort curriculum with 94% completion rate across 600+ learners.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Curriculum', 'Cohort'],
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'educator-04',
    name: 'Warm Chalk',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Sage Mist light theme for stem & coding educators — Fraunces headings with editorial hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('STEM & Coding Educator'),
          headline: l('Your Name'),
          subheadline: l('Educator and instructional designer crafting hands-on workshops, cohort courses and open curricula.'),
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
          body: l('Educator and instructional designer crafting hands-on workshops, cohort courses and open curricula. Based in Visakhapatnam, working with teams worldwide.'),
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
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Has an uncanny ability to break down intimidating concepts into joyful aha moments.'),
              author: l('Aarav Patel'),
              role: l('Former Student & Engineer'),
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
    id: 'educator-05',
    name: 'Seminar Table',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Newsprint Navy light theme for design thinking facilitators — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #f7f4ec 0%, #d6d9e3 55%, #1e40af 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#161b26',
        accent: '#1e40af',
        surface: '#f7f4ec',
        text: '#232936',
        fontHeading: 'Outfit',
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
          eyebrow: l('Design Thinking Facilitator'),
          headline: l('Curiosity, structure and patient mentorship.'),
          subheadline: l('Twelve years mentoring students, career switchers and engineering teams across classrooms and remote cohorts.'),
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
          body: l('Twelve years mentoring students, career switchers and engineering teams across classrooms and remote cohorts. Based in Mumbai, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Cohort Mentoring', 'Public Speaking', 'Instructional Video', 'EdTech Tools'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Open Visual Math Workbook'),
              description: l('Free illustrated geometry and probability workbook downloaded by 18,000 students.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Open Ed', 'Print'],
            },
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'educator-06',
    name: 'Study Commons',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Porcelain Emerald light theme for language & rhetoric coachs — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0d1f18',
        accent: '#0a8754',
        surface: '#f9fcfa',
        text: '#192a22',
        fontHeading: 'Georgia',
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
          eyebrow: l('Language & Rhetoric Coach'),
          headline: l('Helping learners move from theory to mastery.'),
          subheadline: l('Focused on active learning, clear mental models and supportive feedback loops.'),
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
          body: l('Focused on active learning, clear mental models and supportive feedback loops. Based in Pune, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: '',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
            },
            {
              title: l('Interactive Systems Bootcamp'),
              description: l('Designed an 8-week cohort curriculum with 94% completion rate across 600+ learners.'),
              url: '',
              imageUrl: '',
              tags: ['Curriculum', 'Cohort'],
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
              quote: l('Has an uncanny ability to break down intimidating concepts into joyful aha moments.'),
              author: l('Aarav Patel'),
              role: l('Former Student & Engineer'),
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
    id: 'educator-07',
    name: 'Mentor Desk',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Blush Stone light theme for edtech learning architects — Fraunces headings with editorial hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('EdTech Learning Architect'),
          headline: l('Your Name'),
          subheadline: l('Educator and instructional designer crafting hands-on workshops, cohort courses and open curricula.'),
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
          title: l('Case Studies'),
          items: [
            {
              title: l('Interactive Systems Bootcamp'),
              description: l('Designed an 8-week cohort curriculum with 94% completion rate across 600+ learners.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Curriculum', 'Cohort'],
            },
            {
              title: l('Open Visual Math Workbook'),
              description: l('Free illustrated geometry and probability workbook downloaded by 18,000 students.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Open Ed', 'Print'],
            },
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Curriculum Design', 'Workshop Facilitation', 'Project-Based Learning', 'Assessment'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Has an uncanny ability to break down intimidating concepts into joyful aha moments.'),
              author: l('Aarav Patel'),
              role: l('Former Student & Engineer'),
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'educator-08',
    name: 'Reading List',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Parchment Olive light theme for executive coachs — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f8f5ea 0%, #e1e0cc 55%, #5c6b24 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1f2314',
        accent: '#5c6b24',
        surface: '#f8f5ea',
        text: '#2c301e',
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
          eyebrow: l('Executive Coach'),
          headline: l('Teaching complex ideas until they click.'),
          subheadline: l('Twelve years mentoring students, career switchers and engineering teams across classrooms and remote cohorts.'),
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
          body: l('Twelve years mentoring students, career switchers and engineering teams across classrooms and remote cohorts. Based in Visakhapatnam, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Specialties'),
          items: ['Cohort Mentoring', 'Public Speaking', 'Instructional Video', 'EdTech Tools'],
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Open Visual Math Workbook'),
              description: l('Free illustrated geometry and probability workbook downloaded by 18,000 students.'),
              url: '',
              imageUrl: '',
              tags: ['Open Ed', 'Print'],
            },
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: '',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'educator-09',
    name: 'Atelier Learn',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Chalk Vermilion light theme for math & olympiad mentors — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fcfbfa 0%, #f7ded9 55%, #d9381e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#191414',
        accent: '#d9381e',
        surface: '#fcfbfa',
        text: '#241e1d',
        fontHeading: 'Georgia',
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
          eyebrow: l('Math & Olympiad Mentor'),
          headline: l('Designing learning experiences that stick.'),
          subheadline: l('Focused on active learning, clear mental models and supportive feedback loops.'),
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
          items: ['Backward Design', 'Inclusive Pedagogy', 'Technical Coaching', 'Writing'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
            },
            {
              title: l('Interactive Systems Bootcamp'),
              description: l('Designed an 8-week cohort curriculum with 94% completion rate across 600+ learners.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Curriculum', 'Cohort'],
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
              role: l('Director of Learning Design'),
              company: l('CraftSchool'),
              period: l('2022 — Present'),
              description: l('Lead curriculum architecture and mentor training across 12 live programs.'),
            },
            {
              role: l('Senior Lecturer'),
              company: l('St. Xavier’s College'),
              period: l('2017 — 2022'),
              description: l('Taught undergraduate courses and redesigned lab practicums.'),
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
              quote: l('Has an uncanny ability to break down intimidating concepts into joyful aha moments.'),
              author: l('Aarav Patel'),
              role: l('Former Student & Engineer'),
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'educator-10',
    name: 'Workshop',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Glacier Blue light theme for music & arts instructors — Fraunces headings with editorial hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Music & Arts Instructor'),
          headline: l('Your Name'),
          subheadline: l('Educator and instructional designer crafting hands-on workshops, cohort courses and open curricula.'),
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
          body: l('Educator and instructional designer crafting hands-on workshops, cohort courses and open curricula. Based in Pune, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Director of Learning Design'),
              company: l('CraftSchool'),
              period: l('2022 — Present'),
              description: l('Lead curriculum architecture and mentor training across 12 live programs.'),
            },
            {
              role: l('Senior Lecturer'),
              company: l('St. Xavier’s College'),
              period: l('2017 — 2022'),
              description: l('Taught undergraduate courses and redesigned lab practicums.'),
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
              title: l('Interactive Systems Bootcamp'),
              description: l('Designed an 8-week cohort curriculum with 94% completion rate across 600+ learners.'),
              url: '',
              imageUrl: '',
              tags: ['Curriculum', 'Cohort'],
            },
            {
              title: l('Open Visual Math Workbook'),
              description: l('Free illustrated geometry and probability workbook downloaded by 18,000 students.'),
              url: '',
              imageUrl: '',
              tags: ['Open Ed', 'Print'],
            },
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: '',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'educator-11',
    name: 'Spark Lab',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Cream Burgundy light theme for workshop facilitators — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fcf8f2 0%, #eed5d6 55%, #9f1239 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#281217',
        accent: '#9f1239',
        surface: '#fcf8f2',
        text: '#381d23',
        fontHeading: 'Outfit',
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
          eyebrow: l('Workshop Facilitator'),
          headline: l('Curiosity, structure and patient mentorship.'),
          subheadline: l('Twelve years mentoring students, career switchers and engineering teams across classrooms and remote cohorts.'),
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
          items: ['Cohort Mentoring', 'Public Speaking', 'Instructional Video', 'EdTech Tools'],
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Director of Learning Design'),
              company: l('CraftSchool'),
              period: l('2022 — Present'),
              description: l('Lead curriculum architecture and mentor training across 12 live programs.'),
            },
            {
              role: l('Senior Lecturer'),
              company: l('St. Xavier’s College'),
              period: l('2017 — 2022'),
              description: l('Taught undergraduate courses and redesigned lab practicums.'),
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
              title: l('Open Visual Math Workbook'),
              description: l('Free illustrated geometry and probability workbook downloaded by 18,000 students.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Open Ed', 'Print'],
            },
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
    id: 'educator-12',
    name: 'Open Lecture',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Ice Indigo light theme for special education specialists — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f5f7ff 0%, #dcdcfb 55%, #4f46e5 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#11132b',
        accent: '#4f46e5',
        surface: '#f5f7ff',
        text: '#1e2240',
        fontHeading: 'Georgia',
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
          eyebrow: l('Special Education Specialist'),
          headline: l('Helping learners move from theory to mastery.'),
          subheadline: l('Focused on active learning, clear mental models and supportive feedback loops.'),
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
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: '',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
            },
            {
              title: l('Interactive Systems Bootcamp'),
              description: l('Designed an 8-week cohort curriculum with 94% completion rate across 600+ learners.'),
              url: '',
              imageUrl: '',
              tags: ['Curriculum', 'Cohort'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Profile'),
          body: l('Focused on active learning, clear mental models and supportive feedback loops. Based in Visakhapatnam, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Director of Learning Design'),
              company: l('CraftSchool'),
              period: l('2022 — Present'),
              description: l('Lead curriculum architecture and mentor training across 12 live programs.'),
            },
            {
              role: l('Senior Lecturer'),
              company: l('St. Xavier’s College'),
              period: l('2017 — 2022'),
              description: l('Taught undergraduate courses and redesigned lab practicums.'),
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
    id: 'educator-13',
    name: 'Curricula',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Apricot Cream light theme for bootcamp lead instructors — Fraunces headings with editorial hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Bootcamp Lead Instructor'),
          headline: l('Your Name'),
          subheadline: l('Educator and instructional designer crafting hands-on workshops, cohort courses and open curricula.'),
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
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Educator and instructional designer crafting hands-on workshops, cohort courses and open curricula. Based in Mumbai, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Interactive Systems Bootcamp'),
              description: l('Designed an 8-week cohort curriculum with 94% completion rate across 600+ learners.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Curriculum', 'Cohort'],
            },
            {
              title: l('Open Visual Math Workbook'),
              description: l('Free illustrated geometry and probability workbook downloaded by 18,000 students.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Open Ed', 'Print'],
            },
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'educator-14',
    name: 'Bright Hall',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Oatmeal Forest light theme for academic deans — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f9f5ec 0%, #d7e3d2 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#142219',
        accent: '#15803d',
        surface: '#f9f5ec',
        text: '#213026',
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
          eyebrow: l('Academic Dean'),
          headline: l('Teaching complex ideas until they click.'),
          subheadline: l('Twelve years mentoring students, career switchers and engineering teams across classrooms and remote cohorts.'),
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
          body: l('Twelve years mentoring students, career switchers and engineering teams across classrooms and remote cohorts. Based in Pune, working with teams worldwide.'),
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
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Has an uncanny ability to break down intimidating concepts into joyful aha moments.'),
              author: l('Aarav Patel'),
              role: l('Former Student & Engineer'),
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
    id: 'educator-15',
    name: 'Field Guide',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Linen Terracotta light theme for instructional designers — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fdf8f3 0%, #f4dfd5 55%, #c2512b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261710',
        accent: '#c2512b',
        surface: '#fdf8f3',
        text: '#332219',
        fontHeading: 'Georgia',
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
          eyebrow: l('Instructional Designer'),
          headline: l('Designing learning experiences that stick.'),
          subheadline: l('Focused on active learning, clear mental models and supportive feedback loops.'),
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
          body: l('Focused on active learning, clear mental models and supportive feedback loops. Based in Chandigarh, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Focus Areas'),
          items: ['Backward Design', 'Inclusive Pedagogy', 'Technical Coaching', 'Writing'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
            },
            {
              title: l('Interactive Systems Bootcamp'),
              description: l('Designed an 8-week cohort curriculum with 94% completion rate across 600+ learners.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Curriculum', 'Cohort'],
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'educator-16',
    name: 'Foundations',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Mint Frost light theme for career & portfolio mentors — Fraunces headings with editorial hero and comfortable spacing.',
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
        radius: 'lg',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Career & Portfolio Mentor'),
          headline: l('Your Name'),
          subheadline: l('Educator and instructional designer crafting hands-on workshops, cohort courses and open curricula.'),
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
          body: l('Educator and instructional designer crafting hands-on workshops, cohort courses and open curricula. Based in Visakhapatnam, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Interactive Systems Bootcamp'),
              description: l('Designed an 8-week cohort curriculum with 94% completion rate across 600+ learners.'),
              url: '',
              imageUrl: '',
              tags: ['Curriculum', 'Cohort'],
            },
            {
              title: l('Open Visual Math Workbook'),
              description: l('Free illustrated geometry and probability workbook downloaded by 18,000 students.'),
              url: '',
              imageUrl: '',
              tags: ['Open Ed', 'Print'],
            },
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: '',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
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
              quote: l('Has an uncanny ability to break down intimidating concepts into joyful aha moments.'),
              author: l('Aarav Patel'),
              role: l('Former Student & Engineer'),
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
    id: 'educator-17',
    name: 'Pedagogy',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Saffron Ink light theme for science outreach directors — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fdf9ef 0%, #f2e0cd 55%, #b45309 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#23190c',
        accent: '#b45309',
        surface: '#fdf9ef',
        text: '#332514',
        fontHeading: 'Outfit',
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
          eyebrow: l('Science Outreach Director'),
          headline: l('Curiosity, structure and patient mentorship.'),
          subheadline: l('Twelve years mentoring students, career switchers and engineering teams across classrooms and remote cohorts.'),
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
          title: l('Selected Work'),
          items: [
            {
              title: l('Open Visual Math Workbook'),
              description: l('Free illustrated geometry and probability workbook downloaded by 18,000 students.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Open Ed', 'Print'],
            },
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Cohort Mentoring', 'Public Speaking', 'Instructional Video', 'EdTech Tools'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Has an uncanny ability to break down intimidating concepts into joyful aha moments.'),
              author: l('Aarav Patel'),
              role: l('Former Student & Engineer'),
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'educator-18',
    name: 'Library Lamp',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Nordic Spruce light theme for literacy coachs — Georgia headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f4fafa 0%, #d2e7e7 55%, #0e7c7b 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0c1c1c',
        accent: '#0e7c7b',
        surface: '#f4fafa',
        text: '#172b2b',
        fontHeading: 'Georgia',
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
          eyebrow: l('Literacy Coach'),
          headline: l('Helping learners move from theory to mastery.'),
          subheadline: l('Focused on active learning, clear mental models and supportive feedback loops.'),
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
          body: l('Focused on active learning, clear mental models and supportive feedback loops. Based in Pune, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Specialties'),
          items: ['Backward Design', 'Inclusive Pedagogy', 'Technical Coaching', 'Writing'],
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: '',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
            },
            {
              title: l('Interactive Systems Bootcamp'),
              description: l('Designed an 8-week cohort curriculum with 94% completion rate across 600+ learners.'),
              url: '',
              imageUrl: '',
              tags: ['Curriculum', 'Cohort'],
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'educator-19',
    name: 'Bridge Course',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Periwinkle Air light theme for montessori educators — Fraunces headings with editorial hero and comfortable spacing.',
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
        radius: 'md',
        density: 'comfortable',
      }),
    },
    sections: [
      {
        type: 'hero',
        variant: 'editorial',
        props: {
          eyebrow: l('Montessori Educator'),
          headline: l('Your Name'),
          subheadline: l('Educator and instructional designer crafting hands-on workshops, cohort courses and open curricula.'),
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
          items: ['Curriculum Design', 'Workshop Facilitation', 'Project-Based Learning', 'Assessment'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Interactive Systems Bootcamp'),
              description: l('Designed an 8-week cohort curriculum with 94% completion rate across 600+ learners.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Curriculum', 'Cohort'],
            },
            {
              title: l('Open Visual Math Workbook'),
              description: l('Free illustrated geometry and probability workbook downloaded by 18,000 students.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Open Ed', 'Print'],
            },
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
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
              role: l('Director of Learning Design'),
              company: l('CraftSchool'),
              period: l('2022 — Present'),
              description: l('Lead curriculum architecture and mentor training across 12 live programs.'),
            },
            {
              role: l('Senior Lecturer'),
              company: l('St. Xavier’s College'),
              period: l('2017 — 2022'),
              description: l('Taught undergraduate courses and redesigned lab practicums.'),
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
              quote: l('Has an uncanny ability to break down intimidating concepts into joyful aha moments.'),
              author: l('Aarav Patel'),
              role: l('Former Student & Engineer'),
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'educator-20',
    name: 'Cohort',
    category: 'educator',
    family: 'Educator Warm',
    audience: ['educator', 'teacher', 'trainer'],
    description: 'Sepia Slate light theme for online course creators — Outfit headings with centered hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f5f0e6 0%, #e0d8cb 55%, #6b4f35 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1d1c1a',
        accent: '#6b4f35',
        surface: '#f5f0e6',
        text: '#2c2a26',
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
          eyebrow: l('Online Course Creator'),
          headline: l('Teaching complex ideas until they click.'),
          subheadline: l('Twelve years mentoring students, career switchers and engineering teams across classrooms and remote cohorts.'),
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
          body: l('Twelve years mentoring students, career switchers and engineering teams across classrooms and remote cohorts. Based in Visakhapatnam, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Director of Learning Design'),
              company: l('CraftSchool'),
              period: l('2022 — Present'),
              description: l('Lead curriculum architecture and mentor training across 12 live programs.'),
            },
            {
              role: l('Senior Lecturer'),
              company: l('St. Xavier’s College'),
              period: l('2017 — 2022'),
              description: l('Taught undergraduate courses and redesigned lab practicums.'),
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
              degree: l('M.Ed. Learning Design & Technology'),
              school: l('Tata Institute of Social Sciences'),
              period: l('2015 — 2017'),
              description: l('Focus on experiential learning and assessment.'),
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
              title: l('Open Visual Math Workbook'),
              description: l('Free illustrated geometry and probability workbook downloaded by 18,000 students.'),
              url: '',
              imageUrl: '',
              tags: ['Open Ed', 'Print'],
            },
            {
              title: l('Faculty Teaching Playbook'),
              description: l('Trained 85 instructors on active discussion techniques and formative feedback.'),
              url: '',
              imageUrl: '',
              tags: ['Training', 'Facilitation'],
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
];
