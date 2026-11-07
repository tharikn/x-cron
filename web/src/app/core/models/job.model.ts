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

/** Recruiter listing funnel totals (from GET /employers/jobs or analytics). */
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
  employerId?: string | null;
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
  walkInAt?: string | null;
  applyBy?: string | null;
  distanceKm?: number;
  /** Truthful discovery chips — never a match %. */
  matchReasons?: string[];
  promoted?: boolean;
  promotionBadge?: string | null;
  /** Earned recruiter signal: high | medium only — never a public “low”. */
  hiringActivity?: 'high' | 'medium' | null;
  hiringActivityBadge?: string | null;
  /** Present on GET /employers/jobs (owner list). */
  analytics?: JobAnalyticsTotals;
  contact: {
    hasPhone: boolean;
    hasEmail: boolean;
    hasWhatsapp: boolean;
    hasWebsite: boolean;
    phone?: string | null;
    email?: string | null;
    whatsapp?: string | null;
    website?: string | null;
    unlockPricePaise?: number;
  };
  /** Admin moderation only — apply/info URL for edit boxes. */
  contactWebsite?: string | null;
  /** Admin / Blog Approval — abuse report counter. */
  reportCount?: number;
  moderationNote?: string | null;
}
