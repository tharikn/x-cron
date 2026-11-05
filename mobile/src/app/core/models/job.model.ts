export type JobType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'temporary'
  | 'internship'
  | 'apprenticeship'
  | 'daily-wage';

export type JobStatus = 'published' | 'draft' | 'expired' | 'needs-review';

export interface JobSalary {
  min?: number;
  max?: number;
  currency: 'INR';
  period: 'monthly' | 'daily' | 'hourly';
  negotiable?: boolean;
}

export interface JobLocation {
  country: string;
  state: string;
  district: string;
  city: string;
  locality?: string;
  remote?: boolean;
}

export interface JobContactMask {
  hasPhone: boolean;
  hasEmail: boolean;
  hasWhatsapp: boolean;
  hasWebsite: boolean;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  unlockPricePaise?: number;
}

/** Recruiter listing funnel totals (GET /employers/jobs or analytics). */
export interface JobAnalyticsTotals {
  views: number;
  applied: number;
  appliedActive: number;
  contacted: number;
  daysLive: number;
  reportCount: number;
  applyRatePct: number | null;
  contactRatePct: number | null;
}

export interface JobAnalyticsSeriesPoint {
  date: string;
  views: number;
  applied: number;
  contacted: number;
}

export interface JobAnalyticsDashboard {
  jobId: string;
  from: string;
  to: string;
  totals: JobAnalyticsTotals;
  series: JobAnalyticsSeriesPoint[];
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  employerName: string;
  verifiedEmployer: boolean;
  location: JobLocation;
  jobType: JobType;
  salary?: JobSalary;
  contentLanguage: string;
  description: {
    about: string;
    responsibilities?: string[];
    requirements?: string[];
    benefits?: string[];
  };
  experienceLabel?: string;
  vacancies?: number;
  workSchedule?: string;
  skills?: string[];
  category: string;
  publishedAt: string;
  expiresAt: string;
  status: JobStatus;
  contact: JobContactMask;
  promoted?: boolean;
  promotionBadge?: string | null;
  promotionEndsAt?: string | null;
  /** Earned recruiter signal: high | medium only — never a public “low”. */
  hiringActivity?: 'high' | 'medium' | null;
  hiringActivityBadge?: string | null;
  employerId?: string | null;
  walkInAt?: string | null;
  applyBy?: string | null;
  distanceKm?: number;
  /** Present on GET /employers/jobs (owner list). */
  analytics?: JobAnalyticsTotals;
}

export interface JobSearchQuery {
  keyword?: string;
  locationText?: string;
  jobType?: JobType | '';
  category?: string;
  language?: string;
  salaryMin?: number | null;
  remote?: boolean | null;
  postedWithin?: '1d' | '7d' | '30d' | '' | null;
  nearLat?: number | null;
  nearLng?: number | null;
  radiusKm?: number | null;
  walkInOnly?: boolean | null;
  sort:
    | 'relevance'
    | 'newest'
    | 'oldest'
    | 'salary-desc'
    | 'salary-asc'
    | 'distance';
  cursor?: string;
  limit?: number;
}

export interface JobSearchResult {
  items: Job[];
  nextCursor?: string;
  total: number;
}

export type ThemePreference = 'system' | 'light' | 'dark' | 'warm';

export interface UserPreferences {
  locations: string[];
  jobTypes: JobType[];
  categories: string[];
  languages: string[];
  salaryMin?: number | null;
  remotePreferred: boolean;
  interfaceLocale: string;
  sort?: JobSearchQuery['sort'];
  theme?: ThemePreference;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  locations: [],
  jobTypes: [],
  categories: [],
  languages: ['en', 'ta'],
  salaryMin: null,
  remotePreferred: false,
  interfaceLocale: 'en',
  sort: 'newest',
  theme: 'system',
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  temporary: 'Temporary',
  internship: 'Internship',
  apprenticeship: 'Apprenticeship',
  'daily-wage': 'Daily wage',
};
