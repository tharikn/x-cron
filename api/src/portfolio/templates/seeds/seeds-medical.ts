// Auto-generated template seeds — Healthcare Professional (20 templates)
// Regenerate with: node api/src/portfolio/templates/generate-seeds.mjs

import { themeTokens } from '../../design-tokens';
import type { PortfolioLocalizedText } from '../../portfolio.types';
import type { SeedTemplate } from '../template-catalog';

const l = (en: string): PortfolioLocalizedText => ({ 'en-IN': en });

export const SEEDS_MEDICAL: SeedTemplate[] = [
  {
    id: 'medical-01',
    name: 'Clinical Care',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Alabaster Cobalt light theme for consultant cardiologists — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fafbfe 0%, #dae2fd 55%, #2457f5 140%)',
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
          eyebrow: l('Consultant Cardiologist'),
          headline: l('Your Name'),
          subheadline: l('Board-certified specialist with 11+ years of hospital and outpatient practice combining modern diagnostics with unhurried patient education.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#cta-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Board-certified specialist with 11+ years of hospital and outpatient practice combining modern diagnostics with unhurried patient education. Based in Coimbatore, working with teams worldwide.'),
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
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Explains every option patiently and never makes you feel rushed during difficult decisions.'),
              author: l('Suresh Babu'),
              role: l('Patient'),
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
    id: 'medical-02',
    name: 'Vital Pulse',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Lavender Fog light theme for clinical psychologists — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f3f0fc 0%, #dfd2f7 55%, #6d28d9 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#18142c',
        accent: '#6d28d9',
        surface: '#f3f0fc',
        text: '#272142',
        fontHeading: 'Georgia',
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
          eyebrow: l('Clinical Psychologist'),
          headline: l('Evidence-based care centered on the person.'),
          subheadline: l('Offering in-clinic consultations, second opinions and structured preventive care programs.'),
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
          body: l('Offering in-clinic consultations, second opinions and structured preventive care programs. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Evidence-Based Protocols', 'Multidisciplinary Care', 'Clinical Research', 'Chronic Care'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Patient Recovery Handbook'),
              description: l('Authored plain-language bilingual post-operative recovery guides used by 3 hospitals.'),
              url: '',
              imageUrl: '',
              tags: ['Patient Ed', 'Clinical'],
            },
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: '',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'medical-03',
    name: 'Sanctuary Med',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Obsidian Emerald dark theme for pediatric specialists — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #090d0b 0%, #12392a 55%, #34d399 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eefbf4',
        accent: '#34d399',
        surface: '#090d0b',
        text: '#d1e7db',
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
          eyebrow: l('Pediatric Specialist'),
          headline: l('Compassionate medicine, clear communication.'),
          subheadline: l('Published clinical researcher dedicated to accessible, jargon-free healthcare guidance.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#cta-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Published clinical researcher dedicated to accessible, jargon-free healthcare guidance. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
            },
            {
              title: l('Community Hypertension Screening'),
              description: l('Led rural & urban preventive screening camp reaching 6,200 adults with early lifestyle follow-up.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Public Health', 'Outreach'],
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
              quote: l('Explains every option patiently and never makes you feel rushed during difficult decisions.'),
              author: l('Suresh Babu'),
              role: l('Patient'),
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
    id: 'medical-04',
    name: 'Clear Chart',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Porcelain Emerald light theme for orthopedic surgeons — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f9fcfa 0%, #d5eae1 55%, #0a8754 140%)',
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
          eyebrow: l('Orthopedic Surgeon'),
          headline: l('Your Name'),
          subheadline: l('Board-certified specialist with 11+ years of hospital and outpatient practice combining modern diagnostics with unhurried patient education.'),
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
              title: l('Community Hypertension Screening'),
              description: l('Led rural & urban preventive screening camp reaching 6,200 adults with early lifestyle follow-up.'),
              url: '',
              imageUrl: '',
              tags: ['Public Health', 'Outreach'],
            },
            {
              title: l('Patient Recovery Handbook'),
              description: l('Authored plain-language bilingual post-operative recovery guides used by 3 hospitals.'),
              url: '',
              imageUrl: '',
              tags: ['Patient Ed', 'Clinical'],
            },
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: '',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Clinical Diagnostics', 'Preventive Medicine', 'Patient Education', 'Teleconsultation'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Kind Words'),
          items: [
            {
              quote: l('Explains every option patiently and never makes you feel rushed during difficult decisions.'),
              author: l('Suresh Babu'),
              role: l('Patient'),
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'medical-05',
    name: 'Wellness Harbor',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Sage Mist light theme for internal medicine physicians — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #eff7f2 0%, #cee5d7 55%, #15803d 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#122118',
        accent: '#15803d',
        surface: '#eff7f2',
        text: '#1d3025',
        fontHeading: 'Georgia',
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
          eyebrow: l('Internal Medicine Physician'),
          headline: l('Preventive health and clinical excellence.'),
          subheadline: l('Offering in-clinic consultations, second opinions and structured preventive care programs.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#contact-7',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Offering in-clinic consultations, second opinions and structured preventive care programs. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Focus Areas'),
          items: ['Evidence-Based Protocols', 'Multidisciplinary Care', 'Clinical Research', 'Chronic Care'],
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Patient Recovery Handbook'),
              description: l('Authored plain-language bilingual post-operative recovery guides used by 3 hospitals.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Patient Ed', 'Clinical'],
            },
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'medical-06',
    name: 'Pediatric Calm',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Midnight Cobalt dark theme for dermatology specialists — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #070b16 0%, #1b2d48 55%, #60a5fa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#eff6ff',
        accent: '#60a5fa',
        surface: '#070b16',
        text: '#d8e4f8',
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
          eyebrow: l('Dermatology Specialist'),
          headline: l('Helping patients feel heard, informed and supported.'),
          subheadline: l('Published clinical researcher dedicated to accessible, jargon-free healthcare guidance.'),
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
          title: l('Capabilities'),
          items: ['Minimally Invasive Procedures', 'Rehabilitation Planning', 'Medical Ethics', 'Teaching'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: '',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
            },
            {
              title: l('Community Hypertension Screening'),
              description: l('Led rural & urban preventive screening camp reaching 6,200 adults with early lifestyle follow-up.'),
              url: '',
              imageUrl: '',
              tags: ['Public Health', 'Outreach'],
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
              role: l('Senior Consultant Physician'),
              company: l('Apollo Specialty Care'),
              period: l('2021 — Present'),
              description: l('Lead outpatient clinic, complex case reviews and resident teaching rounds.'),
            },
            {
              role: l('Clinical Fellow'),
              company: l('CMC Vellore'),
              period: l('2018 — 2021'),
              description: l('Specialized training and clinical trials research.'),
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
              quote: l('Explains every option patiently and never makes you feel rushed during difficult decisions.'),
              author: l('Suresh Babu'),
              role: l('Patient'),
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'medical-07',
    name: 'Mindful Clinic',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Chalk Vermilion light theme for neurologists — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fcfbfa 0%, #f7ded9 55%, #d9381e 140%)',
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
          eyebrow: l('Neurologist'),
          headline: l('Your Name'),
          subheadline: l('Board-certified specialist with 11+ years of hospital and outpatient practice combining modern diagnostics with unhurried patient education.'),
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
          body: l('Board-certified specialist with 11+ years of hospital and outpatient practice combining modern diagnostics with unhurried patient education. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Senior Consultant Physician'),
              company: l('Apollo Specialty Care'),
              period: l('2021 — Present'),
              description: l('Lead outpatient clinic, complex case reviews and resident teaching rounds.'),
            },
            {
              role: l('Clinical Fellow'),
              company: l('CMC Vellore'),
              period: l('2018 — 2021'),
              description: l('Specialized training and clinical trials research.'),
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
              title: l('Community Hypertension Screening'),
              description: l('Led rural & urban preventive screening camp reaching 6,200 adults with early lifestyle follow-up.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Public Health', 'Outreach'],
            },
            {
              title: l('Patient Recovery Handbook'),
              description: l('Authored plain-language bilingual post-operative recovery guides used by 3 hospitals.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Patient Ed', 'Clinical'],
            },
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'medical-08',
    name: 'Precision MD',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Blush Stone light theme for physical therapists — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #fcf1f3 0%, #f3d0d8 55%, #be123c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#261418',
        accent: '#be123c',
        surface: '#fcf1f3',
        text: '#362025',
        fontHeading: 'Georgia',
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
          eyebrow: l('Physical Therapist'),
          headline: l('Evidence-based care centered on the person.'),
          subheadline: l('Offering in-clinic consultations, second opinions and structured preventive care programs.'),
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
          items: ['Evidence-Based Protocols', 'Multidisciplinary Care', 'Clinical Research', 'Chronic Care'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Senior Consultant Physician'),
              company: l('Apollo Specialty Care'),
              period: l('2021 — Present'),
              description: l('Lead outpatient clinic, complex case reviews and resident teaching rounds.'),
            },
            {
              role: l('Clinical Fellow'),
              company: l('CMC Vellore'),
              period: l('2018 — 2021'),
              description: l('Specialized training and clinical trials research.'),
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
              title: l('Patient Recovery Handbook'),
              description: l('Authored plain-language bilingual post-operative recovery guides used by 3 hospitals.'),
              url: '',
              imageUrl: '',
              tags: ['Patient Ed', 'Clinical'],
            },
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: '',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
    id: 'medical-09',
    name: 'Care Pathway',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Abyssal Violet dark theme for public health physicians — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(125deg, #0b0917 0%, #2d2649 55%, #a78bfa 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f5f3ff',
        accent: '#a78bfa',
        surface: '#0b0917',
        text: '#e0daf8',
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
          eyebrow: l('Public Health Physician'),
          headline: l('Compassionate medicine, clear communication.'),
          subheadline: l('Published clinical researcher dedicated to accessible, jargon-free healthcare guidance.'),
          primaryCtaLabel: l('Get in touch'),
          primaryCtaHref: '#cta-6',
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
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
            },
            {
              title: l('Community Hypertension Screening'),
              description: l('Led rural & urban preventive screening camp reaching 6,200 adults with early lifestyle follow-up.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Public Health', 'Outreach'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Published clinical researcher dedicated to accessible, jargon-free healthcare guidance. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Senior Consultant Physician'),
              company: l('Apollo Specialty Care'),
              period: l('2021 — Present'),
              description: l('Lead outpatient clinic, complex case reviews and resident teaching rounds.'),
            },
            {
              role: l('Clinical Fellow'),
              company: l('CMC Vellore'),
              period: l('2018 — 2021'),
              description: l('Specialized training and clinical trials research.'),
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
    id: 'medical-10',
    name: 'Healing Harbor',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Ice Indigo light theme for integrative nutrition mds — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #f5f7ff 0%, #dcdcfb 55%, #4f46e5 140%)',
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
          eyebrow: l('Integrative Nutrition MD'),
          headline: l('Your Name'),
          subheadline: l('Board-certified specialist with 11+ years of hospital and outpatient practice combining modern diagnostics with unhurried patient education.'),
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
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Approach'),
          body: l('Board-certified specialist with 11+ years of hospital and outpatient practice combining modern diagnostics with unhurried patient education. Based in Thiruvananthapuram, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Featured Projects'),
          items: [
            {
              title: l('Community Hypertension Screening'),
              description: l('Led rural & urban preventive screening camp reaching 6,200 adults with early lifestyle follow-up.'),
              url: '',
              imageUrl: '',
              tags: ['Public Health', 'Outreach'],
            },
            {
              title: l('Patient Recovery Handbook'),
              description: l('Authored plain-language bilingual post-operative recovery guides used by 3 hospitals.'),
              url: '',
              imageUrl: '',
              tags: ['Patient Ed', 'Clinical'],
            },
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: '',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'medical-11',
    name: 'Practice Folio',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Glacier Blue light theme for psychiatrists — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #eff7fd 0%, #cce2ef 55%, #0369a1 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e1c2b',
        accent: '#0369a1',
        surface: '#eff7fd',
        text: '#1a2c3d',
        fontHeading: 'Georgia',
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
          eyebrow: l('Psychiatrist'),
          headline: l('Preventive health and clinical excellence.'),
          subheadline: l('Offering in-clinic consultations, second opinions and structured preventive care programs.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#cta-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('About'),
          body: l('Offering in-clinic consultations, second opinions and structured preventive care programs. Based in Remote, working with teams worldwide.'),
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
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Explains every option patiently and never makes you feel rushed during difficult decisions.'),
              author: l('Suresh Babu'),
              role: l('Patient'),
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
    id: 'medical-12',
    name: 'Diagnostic',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Charcoal Amber dark theme for dental & prosthodontic specialists — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(155deg, #100e0a 0%, #443510 55%, #fbbf24 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fffbeb',
        accent: '#fbbf24',
        surface: '#100e0a',
        text: '#ede5ce',
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
          eyebrow: l('Dental & Prosthodontic Specialist'),
          headline: l('Helping patients feel heard, informed and supported.'),
          subheadline: l('Published clinical researcher dedicated to accessible, jargon-free healthcare guidance.'),
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
          body: l('Published clinical researcher dedicated to accessible, jargon-free healthcare guidance. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Core Stack'),
          items: ['Minimally Invasive Procedures', 'Rehabilitation Planning', 'Medical Ethics', 'Teaching'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: '',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
            },
            {
              title: l('Community Hypertension Screening'),
              description: l('Led rural & urban preventive screening camp reaching 6,200 adults with early lifestyle follow-up.'),
              url: '',
              imageUrl: '',
              tags: ['Public Health', 'Outreach'],
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'medical-13',
    name: 'Patient First',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Linen Terracotta light theme for ophthalmic surgeons — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #fdf8f3 0%, #f4dfd5 55%, #c2512b 140%)',
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
          eyebrow: l('Ophthalmic Surgeon'),
          headline: l('Your Name'),
          subheadline: l('Board-certified specialist with 11+ years of hospital and outpatient practice combining modern diagnostics with unhurried patient education.'),
          primaryCtaLabel: l('Explore portfolio'),
          primaryCtaHref: '#cta-6',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Practice'),
          body: l('Board-certified specialist with 11+ years of hospital and outpatient practice combining modern diagnostics with unhurried patient education. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Selected Work'),
          items: [
            {
              title: l('Community Hypertension Screening'),
              description: l('Led rural & urban preventive screening camp reaching 6,200 adults with early lifestyle follow-up.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Public Health', 'Outreach'],
            },
            {
              title: l('Patient Recovery Handbook'),
              description: l('Authored plain-language bilingual post-operative recovery guides used by 3 hospitals.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Patient Ed', 'Clinical'],
            },
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
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
              quote: l('Explains every option patiently and never makes you feel rushed during difficult decisions.'),
              author: l('Suresh Babu'),
              role: l('Patient'),
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
    id: 'medical-14',
    name: 'MedBridge',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Apricot Cream light theme for oncology researchers — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(135deg, #fff4ec 0%, #f6d9ca 55%, #c2410c 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#26160e',
        accent: '#c2410c',
        surface: '#fff4ec',
        text: '#362218',
        fontHeading: 'Georgia',
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
          eyebrow: l('Oncology Researcher'),
          headline: l('Evidence-based care centered on the person.'),
          subheadline: l('Offering in-clinic consultations, second opinions and structured preventive care programs.'),
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
              title: l('Patient Recovery Handbook'),
              description: l('Authored plain-language bilingual post-operative recovery guides used by 3 hospitals.'),
              url: '',
              imageUrl: '',
              tags: ['Patient Ed', 'Clinical'],
            },
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: '',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
            }
          ],
        },
      },
      {
        type: 'skills',
        variant: 'chips',
        props: {
          title: l('Toolkit'),
          items: ['Evidence-Based Protocols', 'Multidisciplinary Care', 'Clinical Research', 'Chronic Care'],
        },
      },
      {
        type: 'testimonials',
        variant: 'cards',
        props: {
          title: l('Endorsements'),
          items: [
            {
              quote: l('Explains every option patiently and never makes you feel rushed during difficult decisions.'),
              author: l('Suresh Babu'),
              role: l('Patient'),
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'medical-15',
    name: 'Serene Ward',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Velvet Rose dark theme for sports medicine doctors — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(145deg, #12090c 0%, #452027 55%, #fb7185 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#fff1f2',
        accent: '#fb7185',
        surface: '#12090c',
        text: '#f0d8dc',
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
          eyebrow: l('Sports Medicine Doctor'),
          headline: l('Compassionate medicine, clear communication.'),
          subheadline: l('Published clinical researcher dedicated to accessible, jargon-free healthcare guidance.'),
          primaryCtaLabel: l('Read more'),
          primaryCtaHref: '#contact-7',
          imageUrl: '',
          imageAlt: l(''),
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Approach'),
          body: l('Published clinical researcher dedicated to accessible, jargon-free healthcare guidance. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'skills',
        variant: 'columns',
        props: {
          title: l('Focus Areas'),
          items: ['Minimally Invasive Procedures', 'Rehabilitation Planning', 'Medical Ethics', 'Teaching'],
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
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Case Studies'),
          items: [
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
            },
            {
              title: l('Community Hypertension Screening'),
              description: l('Led rural & urban preventive screening camp reaching 6,200 adults with early lifestyle follow-up.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Public Health', 'Outreach'],
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'medical-16',
    name: 'Telehealth Pro',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Nordic Spruce light theme for speech-language pathologists — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f4fafa 0%, #d2e7e7 55%, #0e7c7b 140%)',
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
          eyebrow: l('Speech-Language Pathologist'),
          headline: l('Your Name'),
          subheadline: l('Board-certified specialist with 11+ years of hospital and outpatient practice combining modern diagnostics with unhurried patient education.'),
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
          title: l('Capabilities'),
          items: ['Clinical Diagnostics', 'Preventive Medicine', 'Patient Education', 'Teleconsultation'],
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Community Hypertension Screening'),
              description: l('Led rural & urban preventive screening camp reaching 6,200 adults with early lifestyle follow-up.'),
              url: '',
              imageUrl: '',
              tags: ['Public Health', 'Outreach'],
            },
            {
              title: l('Patient Recovery Handbook'),
              description: l('Authored plain-language bilingual post-operative recovery guides used by 3 hospitals.'),
              url: '',
              imageUrl: '',
              tags: ['Patient Ed', 'Clinical'],
            },
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: '',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
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
              role: l('Senior Consultant Physician'),
              company: l('Apollo Specialty Care'),
              period: l('2021 — Present'),
              description: l('Lead outpatient clinic, complex case reviews and resident teaching rounds.'),
            },
            {
              role: l('Clinical Fellow'),
              company: l('CMC Vellore'),
              period: l('2018 — 2021'),
              description: l('Specialized training and clinical trials research.'),
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
              quote: l('Explains every option patiently and never makes you feel rushed during difficult decisions.'),
              author: l('Suresh Babu'),
              role: l('Patient'),
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
  {
    id: 'medical-17',
    name: 'Preventive',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Mint Frost light theme for preventive health directors — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(125deg, #eefaf7 0%, #cde6e2 55%, #0f766e 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#0e221e',
        accent: '#0f766e',
        surface: '#eefaf7',
        text: '#1a322d',
        fontHeading: 'Georgia',
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
          eyebrow: l('Preventive Health Director'),
          headline: l('Preventive health and clinical excellence.'),
          subheadline: l('Offering in-clinic consultations, second opinions and structured preventive care programs.'),
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
          body: l('Offering in-clinic consultations, second opinions and structured preventive care programs. Based in Coimbatore, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Career History'),
          items: [
            {
              role: l('Senior Consultant Physician'),
              company: l('Apollo Specialty Care'),
              period: l('2021 — Present'),
              description: l('Lead outpatient clinic, complex case reviews and resident teaching rounds.'),
            },
            {
              role: l('Clinical Fellow'),
              company: l('CMC Vellore'),
              period: l('2018 — 2021'),
              description: l('Specialized training and clinical trials research.'),
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
              title: l('Patient Recovery Handbook'),
              description: l('Authored plain-language bilingual post-operative recovery guides used by 3 hospitals.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Patient Ed', 'Clinical'],
            },
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }],
        },
      }
    ],
  },
  {
    id: 'medical-18',
    name: 'Cardio Slate',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Deep Teal dark theme for family medicine physicians — System headings with centered hero and comfortable spacing.',
    supportsDark: true,
    previewGradient: 'linear-gradient(135deg, #071112 0%, #0f3c38 55%, #2dd4bf 140%)',
    theme: {
      mode: 'dark',
      tokens: themeTokens({
        primary: '#f0fdfa',
        accent: '#2dd4bf',
        surface: '#071112',
        text: '#cce8e4',
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
          eyebrow: l('Family Medicine Physician'),
          headline: l('Helping patients feel heard, informed and supported.'),
          subheadline: l('Published clinical researcher dedicated to accessible, jargon-free healthcare guidance.'),
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
          items: ['Minimally Invasive Procedures', 'Rehabilitation Planning', 'Medical Ethics', 'Teaching'],
        },
      },
      {
        type: 'experience',
        variant: 'list',
        props: {
          title: l('Background'),
          items: [
            {
              role: l('Senior Consultant Physician'),
              company: l('Apollo Specialty Care'),
              period: l('2021 — Present'),
              description: l('Lead outpatient clinic, complex case reviews and resident teaching rounds.'),
            },
            {
              role: l('Clinical Fellow'),
              company: l('CMC Vellore'),
              period: l('2018 — 2021'),
              description: l('Specialized training and clinical trials research.'),
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
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: '',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
            },
            {
              title: l('Community Hypertension Screening'),
              description: l('Led rural & urban preventive screening camp reaching 6,200 adults with early lifestyle follow-up.'),
              url: '',
              imageUrl: '',
              tags: ['Public Health', 'Outreach'],
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
    id: 'medical-19',
    name: 'Botanical Health',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Cloud Plum light theme for telehealth medical leads — Outfit headings with split-media hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(145deg, #fbf8fe 0%, #e8d8f7 55%, #7e22ce 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#1e1024',
        accent: '#7e22ce',
        surface: '#fbf8fe',
        text: '#2b1b33',
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
          eyebrow: l('Telehealth Medical Lead'),
          headline: l('Your Name'),
          subheadline: l('Board-certified specialist with 11+ years of hospital and outpatient practice combining modern diagnostics with unhurried patient education.'),
          primaryCtaLabel: l('See projects'),
          primaryCtaHref: '#cta-6',
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
              title: l('Community Hypertension Screening'),
              description: l('Led rural & urban preventive screening camp reaching 6,200 adults with early lifestyle follow-up.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Public Health', 'Outreach'],
            },
            {
              title: l('Patient Recovery Handbook'),
              description: l('Authored plain-language bilingual post-operative recovery guides used by 3 hospitals.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Patient Ed', 'Clinical'],
            },
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: 'https://example.com',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
            }
          ],
        },
      },
      {
        type: 'about',
        variant: 'split',
        props: {
          title: l('Overview'),
          body: l('Board-certified specialist with 11+ years of hospital and outpatient practice combining modern diagnostics with unhurried patient education. Based in Remote, working with teams worldwide.'),
        },
      },
      {
        type: 'experience',
        variant: 'timeline',
        props: {
          title: l('Experience'),
          items: [
            {
              role: l('Senior Consultant Physician'),
              company: l('Apollo Specialty Care'),
              period: l('2021 — Present'),
              description: l('Lead outpatient clinic, complex case reviews and resident teaching rounds.'),
            },
            {
              role: l('Clinical Fellow'),
              company: l('CMC Vellore'),
              period: l('2018 — 2021'),
              description: l('Specialized training and clinical trials research.'),
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
    id: 'medical-20',
    name: 'Horizon Clinic',
    category: 'medical',
    family: 'Healthcare Professional',
    audience: ['doctor', 'therapist', 'healthcare'],
    description: 'Periwinkle Air light theme for surgical educators — Georgia headings with editorial hero and comfortable spacing.',
    supportsDark: false,
    previewGradient: 'linear-gradient(155deg, #f1f3fd 0%, #d7d7f5 55%, #4338ca 140%)',
    theme: {
      mode: 'light',
      tokens: themeTokens({
        primary: '#14182e',
        accent: '#4338ca',
        surface: '#f1f3fd',
        text: '#212642',
        fontHeading: 'Georgia',
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
          eyebrow: l('Surgical Educator'),
          headline: l('Evidence-based care centered on the person.'),
          subheadline: l('Offering in-clinic consultations, second opinions and structured preventive care programs.'),
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
        type: 'about',
        variant: 'prose',
        props: {
          title: l('Approach'),
          body: l('Offering in-clinic consultations, second opinions and structured preventive care programs. Based in Hyderabad, working with teams worldwide.'),
        },
      },
      {
        type: 'projects',
        variant: 'list',
        props: {
          title: l('Recent Outcomes'),
          items: [
            {
              title: l('Patient Recovery Handbook'),
              description: l('Authored plain-language bilingual post-operative recovery guides used by 3 hospitals.'),
              url: '',
              imageUrl: '',
              tags: ['Patient Ed', 'Clinical'],
            },
            {
              title: l('Tele-Followup Protocol'),
              description: l('Designed structured 90-day remote check-in workflow reducing readmissions by 24%.'),
              url: '',
              imageUrl: '',
              tags: ['Telehealth', 'Outcomes'],
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
              degree: l('M.D. Internal Medicine'),
              school: l('Madras Medical College'),
              period: l('2014 — 2017'),
              description: l('University topper in clinical medicine.'),
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
          links: [{ label: l('LinkedIn'), url: 'https://www.linkedin.com/in/your-name' }, { label: l('X / Twitter'), url: 'https://x.com/yourname' }],
        },
      }
    ],
  },
];
