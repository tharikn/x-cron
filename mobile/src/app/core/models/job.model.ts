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
  unlockPricePaise: number;
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
}

export interface JobSearchQuery {
  keyword?: string;
  locationText?: string;
  jobType?: JobType | '';
  category?: string;
  language?: string;
  salaryMin?: number | null;
  sort:
    | 'relevance'
    | 'newest'
    | 'oldest'
    | 'salary-desc'
    | 'salary-asc';
}

export interface UserPreferences {
  locations: string[];
  jobTypes: JobType[];
  categories: string[];
  languages: string[];
  salaryMin?: number | null;
  remotePreferred: boolean;
  interfaceLocale: 'en' | 'ta';
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  locations: [],
  jobTypes: [],
  categories: [],
  languages: ['en', 'ta'],
  salaryMin: null,
  remotePreferred: false,
  interfaceLocale: 'en',
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
