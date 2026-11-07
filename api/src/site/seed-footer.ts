import type { SiteFooterConfig } from './site.types';

/** Default public footer — mirrors Prisma SiteConfig key `footer`. */
export const SEED_FOOTER: Omit<SiteFooterConfig, 'updatedAt'> = {
  brand: {
    name: 'X Cron',
    productLabel: 'Jobs',
    blurb:
      'Local-first job discovery for younger seekers. Browse as a guest; sign in to save, apply, and manage privacy.',
  },
  headings: {
    quickLinks: 'Quick links',
    address: 'Visit',
    social: 'Connect',
  },
  addresses: [],
  socialLinks: [
    {
      id: 'soc_x',
      network: 'x',
      label: 'X',
      url: 'https://x.com/xcronjobs',
      sortOrder: 1,
    },
    {
      id: 'soc_ig',
      network: 'instagram',
      label: 'Instagram',
      url: 'https://instagram.com/xcronjobs',
      sortOrder: 2,
    },
    {
      id: 'soc_li',
      network: 'linkedin',
      label: 'LinkedIn',
      url: 'https://linkedin.com/company/xcronjobs',
      sortOrder: 3,
    },
    {
      id: 'soc_yt',
      network: 'youtube',
      label: 'YouTube',
      url: 'https://youtube.com/@xcronjobs',
      sortOrder: 4,
    },
  ],
  quickLinks: [
    { id: 'ql_home', label: 'Home', href: '/', sortOrder: 1 },
    { id: 'ql_post', label: 'Post a job', href: '/post', sortOrder: 2 },
    { id: 'ql_prefs', label: 'Preferences', href: '/preferences', sortOrder: 3 },
    { id: 'ql_lang', label: 'Language', href: '/language', sortOrder: 4 },
    { id: 'ql_signin', label: 'Sign in', href: '/sign-in', sortOrder: 5 },
  ],
  legalLinks: [
    { id: 'leg_privacy', label: 'Privacy', href: '/privacy', sortOrder: 1 },
    { id: 'leg_terms', label: 'Terms', href: '/terms', sortOrder: 2 },
  ],
  copyright: '© X Cron Jobs. Guest browsing supported.',
};
