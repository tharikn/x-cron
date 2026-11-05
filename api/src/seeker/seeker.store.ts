import {
  SavedSearch,
  SavedSearchQuery,
  SeekerApplication,
  SeekerProfile,
} from './seeker.types';

export abstract class SeekerStore {
  abstract listSaved(userId: string): Promise<string[]>;

  abstract isSaved(userId: string, jobId: string): Promise<boolean>;

  abstract save(userId: string, jobId: string): Promise<void>;

  abstract unsave(userId: string, jobId: string): Promise<void>;

  abstract listHiddenJobs(userId: string): Promise<string[]>;

  abstract listHiddenEmployers(userId: string): Promise<string[]>;

  abstract hideJob(userId: string, jobId: string): Promise<void>;

  abstract unhideJob(userId: string, jobId: string): Promise<void>;

  abstract hideEmployer(userId: string, employerId: string): Promise<void>;

  abstract getProfile(userId: string): Promise<SeekerProfile>;

  abstract upsertProfile(
    userId: string,
    patch: Partial<Omit<SeekerProfile, 'updatedAt'>>,
  ): Promise<SeekerProfile>;

  abstract listApplications(userId: string): Promise<SeekerApplication[]>;

  /** Contact markers for the given job ids (any seeker) — recruiter analytics. */
  abstract listApplicationsForJobIds(
    jobIds: string[],
  ): Promise<SeekerApplication[]>;

  abstract markApplication(
    userId: string,
    jobId: string,
    input: {
      status?: SeekerApplication['status'];
      channel?: SeekerApplication['channel'];
    },
  ): Promise<SeekerApplication>;

  abstract listSavedSearches(userId: string): Promise<SavedSearch[]>;

  abstract createSavedSearch(
    userId: string,
    input: { name: string; query: SavedSearchQuery; alertEnabled?: boolean },
  ): Promise<SavedSearch>;

  abstract updateSavedSearch(
    userId: string,
    id: string,
    patch: Partial<{
      name: string;
      query: SavedSearchQuery;
      alertEnabled: boolean;
    }>,
  ): Promise<SavedSearch | undefined>;

  abstract deleteSavedSearch(userId: string, id: string): Promise<boolean>;

  /** All users with at least one alert-enabled saved search (for publish fan-out). */
  abstract listAlertSavedSearches(): Promise<
    Array<{ userId: string; search: SavedSearch }>
  >;

  abstract clearUser(userId: string): Promise<void>;
}
