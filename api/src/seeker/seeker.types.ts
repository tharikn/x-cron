export type CareerStage = 'fresher' | 'experienced';
export type EducationStatus = 'pursuing' | 'completed';
export type NoticePeriod = 'serving' | '1' | '2' | '3' | 'immediate';

export interface SeekerProfile {
  displayName?: string;
  mobile?: string;
  email?: string;
  showContact: boolean;
  address?: string;
  pincode?: string;
  careerStage?: CareerStage;
  educationStatus?: EducationStatus;
  /** Fresher */
  openToInternship?: boolean;
  courseDetails?: string;
  branchStudied?: string;
  academicScore?: string;
  /** Experienced */
  experienceYears?: number;
  experienceMonths?: number;
  companyName?: string;
  companyArea?: string;
  currentSalary?: string;
  expectedSalary?: string;
  noticePeriod?: NoticePeriod;
  /** Feed ranking (derived / legacy) */
  experienceBand?: 'fresher' | '0-1' | '1-3' | '3-5' | '5+';
  skills: string[];
  preferredCities: string[];
  openToWork: boolean;
  updatedAt: string;
}

export interface SeekerApplication {
  jobId: string;
  status: 'contacted' | 'applied';
  channel?: 'phone' | 'whatsapp' | 'email' | 'website' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearchQuery {
  keyword?: string;
  location?: string;
  jobType?: string;
  category?: string;
  language?: string;
  salaryMin?: number | null;
  remote?: boolean | null;
  radiusKm?: number | null;
  nearLat?: number | null;
  nearLng?: number | null;
  walkInOnly?: boolean | null;
  postedWithin?: '1d' | '7d' | '30d' | null;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: SavedSearchQuery;
  alertEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_SEEKER_PROFILE: SeekerProfile = {
  showContact: false,
  skills: [],
  preferredCities: [],
  openToWork: true,
  updatedAt: new Date(0).toISOString(),
};
