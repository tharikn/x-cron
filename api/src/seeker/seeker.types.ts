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
  skills?: string;
  verifiedEmployer?: boolean | null;
  fresher?: boolean | null;
  easyApply?: boolean | null;
  sort?: string;
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

export type ProfileCompletionItemId =
  | 'personal'
  | 'location'
  | 'career'
  | 'skills'
  | 'applyReady';

export interface ProfileCompletionItem {
  id: ProfileCompletionItemId;
  done: boolean;
  /** Value-forward hint for Account /me callouts (not a hard gate). */
  hint: string;
}

/** Progressive profile checklist returned on GET/PATCH /v1/me/profile. */
export interface ProfileCompletion {
  percent: number;
  complete: boolean;
  items: ProfileCompletionItem[];
}

export type SeekerProfileResponse = SeekerProfile & {
  completion: ProfileCompletion;
};

export function buildProfileCompletion(
  profile: SeekerProfile,
  applyReady: boolean,
): ProfileCompletion {
  const personal = Boolean(
    profile.displayName?.trim() &&
      (profile.mobile?.trim() || profile.email?.trim()),
  );
  const location = Boolean(profile.address?.trim() || profile.pincode?.trim());
  const career = Boolean(profile.experienceBand || profile.careerStage);
  const skills = Boolean(
    (profile.skills?.length ?? 0) > 0 &&
      (profile.preferredCities?.length ?? 0) > 0,
  );

  const items: ProfileCompletionItem[] = [
    {
      id: 'personal',
      done: personal,
      hint: 'Add your name and a phone or email so employers can reach you.',
    },
    {
      id: 'location',
      done: location,
      hint: 'Add where you are based to improve local matching.',
    },
    {
      id: 'career',
      done: career,
      hint: 'Add experience to improve matching.',
    },
    {
      id: 'skills',
      done: skills,
      hint: 'Add skills and preferred cities to improve matching.',
    },
    {
      id: 'applyReady',
      done: applyReady,
      hint: 'Finish an Apply version to unlock Easy apply.',
    },
  ];

  const doneCount = items.filter((item) => item.done).length;
  const percent = Math.round((doneCount / items.length) * 100);
  return {
    percent,
    complete: doneCount === items.length,
    items,
  };
}
