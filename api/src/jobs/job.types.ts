export type JobType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'temporary'
  | 'internship'
  | 'apprenticeship'
  | 'daily-wage';

export type JobStatus =
  | 'published'
  | 'draft'
  | 'expired'
  | 'needs-review'
  | 'rejected'
  | 'removed';

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
  unlockPricePaise: number;
}

export interface JobRecord {
  id: string;
  slug: string;
  title: string;
  employerName: string;
  employerId?: string;
  ownerUserId?: string;
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
  /** Public listing starts at this instant (ISO). */
  effectiveFrom: string;
  expiresAt: string;
  /** Higher values sort first in public search. */
  priority: number;
  status: JobStatus;
  contact: JobContactMask;
  reportCount?: number;
  moderationNote?: string;
  /** Private — never returned by public DTOs */
  privateContact?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    /** Apply / careers website URL */
    website?: string;
  };
}

export interface JobSearchQuery {
  keyword?: string;
  locationText?: string;
  jobType?: JobType | '';
  category?: string;
  language?: string;
  salaryMin?: number | null;
  sort?:
    | 'relevance'
    | 'newest'
    | 'oldest'
    | 'salary-desc'
    | 'salary-asc';
  cursor?: string;
  limit?: number;
}

export interface CreateJobInput {
  title: string;
  employerName: string;
  locationCity: string;
  locationDistrict?: string;
  locationState?: string;
  jobType: JobType;
  salaryText?: string;
  description: string;
  contentLanguage: string;
  contactPhone?: string;
  contactEmail?: string;
  contactWebsite?: string;
  category?: string;
  experienceLabel?: string;
  vacancies?: number;
  workSchedule?: string;
  skills?: string[];
  employerId?: string;
  ownerUserId?: string;
  status?: JobStatus;
  effectiveFrom?: string;
  expiresAt?: string;
  priority?: number;
}
