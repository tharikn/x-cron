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
  expiresAt: string;
  status: string;
  contact: {
    hasPhone: boolean;
    hasEmail: boolean;
    hasWhatsapp: boolean;
    unlockPricePaise: number;
    masked: boolean;
    unlockLabel: string;
  };
}
