export type JobType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'temporary'
  | 'internship'
  | 'apprenticeship'
  | 'daily-wage';

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  temporary: 'Temporary',
  internship: 'Internship',
  apprenticeship: 'Apprenticeship',
  'daily-wage': 'Daily wage',
};

export interface JobLocation {
  country: string;
  state: string;
  district: string;
  city: string;
  locality?: string;
  remote?: boolean;
}

export interface JobSalary {
  min?: number;
  max?: number;
  currency: 'INR';
  period: 'monthly' | 'daily' | 'hourly';
  negotiable?: boolean;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  employerName: string;
  verifiedEmployer: boolean;
  location: JobLocation;
  jobType: string;
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
  effectiveFrom?: string;
  expiresAt: string;
  priority?: number;
  status: string;
  promoted?: boolean;
  promotionBadge?: string | null;
  contact: {
    hasPhone: boolean;
    hasEmail: boolean;
    hasWhatsapp: boolean;
    hasWebsite: boolean;
    unlockPricePaise: number;
    masked: boolean;
    unlockLabel: string;
  };
}
