import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  DEFAULT_SEEKER_PROFILE,
  SavedSearch,
  SavedSearchQuery,
  SeekerApplication,
  SeekerProfile,
} from './seeker.types';

@Injectable()
export class SeekerStore {
  /** userId -> set of jobIds */
  private readonly saved = new Map<string, Set<string>>();
  private readonly hiddenJobs = new Map<string, Set<string>>();
  private readonly hiddenEmployers = new Map<string, Set<string>>();
  private readonly profiles = new Map<string, SeekerProfile>();
  private readonly applications = new Map<string, Map<string, SeekerApplication>>();
  private readonly savedSearches = new Map<string, SavedSearch[]>();

  listSaved(userId: string): string[] {
    return [...(this.saved.get(userId) ?? new Set())];
  }

  isSaved(userId: string, jobId: string): boolean {
    return this.saved.get(userId)?.has(jobId) ?? false;
  }

  save(userId: string, jobId: string): void {
    if (!this.saved.has(userId)) this.saved.set(userId, new Set());
    this.saved.get(userId)!.add(jobId);
  }

  unsave(userId: string, jobId: string): void {
    this.saved.get(userId)?.delete(jobId);
  }

  listHiddenJobs(userId: string): string[] {
    return [...(this.hiddenJobs.get(userId) ?? new Set())];
  }

  listHiddenEmployers(userId: string): string[] {
    return [...(this.hiddenEmployers.get(userId) ?? new Set())];
  }

  hideJob(userId: string, jobId: string): void {
    if (!this.hiddenJobs.has(userId)) this.hiddenJobs.set(userId, new Set());
    this.hiddenJobs.get(userId)!.add(jobId);
  }

  unhideJob(userId: string, jobId: string): void {
    this.hiddenJobs.get(userId)?.delete(jobId);
  }

  hideEmployer(userId: string, employerId: string): void {
    if (!this.hiddenEmployers.has(userId)) {
      this.hiddenEmployers.set(userId, new Set());
    }
    this.hiddenEmployers.get(userId)!.add(employerId);
  }

  getProfile(userId: string): SeekerProfile {
    return (
      this.profiles.get(userId) ?? {
        ...DEFAULT_SEEKER_PROFILE,
        updatedAt: new Date().toISOString(),
      }
    );
  }

  upsertProfile(
    userId: string,
    patch: Partial<Omit<SeekerProfile, 'updatedAt'>>,
  ): SeekerProfile {
    const current = this.getProfile(userId);
    const next: SeekerProfile = {
      displayName: patch.displayName ?? current.displayName,
      mobile: patch.mobile ?? current.mobile,
      email: patch.email ?? current.email,
      showContact: patch.showContact ?? current.showContact,
      address: patch.address ?? current.address,
      pincode: patch.pincode ?? current.pincode,
      careerStage: patch.careerStage ?? current.careerStage,
      educationStatus: patch.educationStatus ?? current.educationStatus,
      openToInternship: patch.openToInternship ?? current.openToInternship,
      courseDetails: patch.courseDetails ?? current.courseDetails,
      branchStudied: patch.branchStudied ?? current.branchStudied,
      academicScore: patch.academicScore ?? current.academicScore,
      experienceYears: patch.experienceYears ?? current.experienceYears,
      experienceMonths: patch.experienceMonths ?? current.experienceMonths,
      companyName: patch.companyName ?? current.companyName,
      companyArea: patch.companyArea ?? current.companyArea,
      currentSalary: patch.currentSalary ?? current.currentSalary,
      expectedSalary: patch.expectedSalary ?? current.expectedSalary,
      noticePeriod: patch.noticePeriod ?? current.noticePeriod,
      experienceBand: patch.experienceBand ?? current.experienceBand,
      skills: patch.skills ?? current.skills,
      preferredCities: patch.preferredCities ?? current.preferredCities,
      openToWork: patch.openToWork ?? current.openToWork,
      updatedAt: new Date().toISOString(),
    };
    this.profiles.set(userId, next);
    return next;
  }

  listApplications(userId: string): SeekerApplication[] {
    return [...(this.applications.get(userId)?.values() ?? [])].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  }

  markApplication(
    userId: string,
    jobId: string,
    input: {
      status?: SeekerApplication['status'];
      channel?: SeekerApplication['channel'];
    },
  ): SeekerApplication {
    if (!this.applications.has(userId)) {
      this.applications.set(userId, new Map());
    }
    const map = this.applications.get(userId)!;
    const now = new Date().toISOString();
    const existing = map.get(jobId);
    const next: SeekerApplication = {
      jobId,
      status: input.status ?? existing?.status ?? 'contacted',
      channel: input.channel ?? existing?.channel,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    map.set(jobId, next);
    return next;
  }

  listSavedSearches(userId: string): SavedSearch[] {
    return [...(this.savedSearches.get(userId) ?? [])].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  }

  createSavedSearch(
    userId: string,
    input: { name: string; query: SavedSearchQuery; alertEnabled?: boolean },
  ): SavedSearch {
    const now = new Date().toISOString();
    const row: SavedSearch = {
      id: `ss_${randomUUID().slice(0, 8)}`,
      name: input.name.trim() || 'Saved search',
      query: input.query,
      alertEnabled: !!input.alertEnabled,
      createdAt: now,
      updatedAt: now,
    };
    const list = this.savedSearches.get(userId) ?? [];
    list.unshift(row);
    this.savedSearches.set(userId, list);
    return row;
  }

  updateSavedSearch(
    userId: string,
    id: string,
    patch: Partial<{
      name: string;
      query: SavedSearchQuery;
      alertEnabled: boolean;
    }>,
  ): SavedSearch | undefined {
    const list = this.savedSearches.get(userId) ?? [];
    const idx = list.findIndex((s) => s.id === id);
    if (idx < 0) return undefined;
    const current = list[idx];
    const next: SavedSearch = {
      ...current,
      name: patch.name?.trim() || current.name,
      query: patch.query ?? current.query,
      alertEnabled:
        patch.alertEnabled != null ? patch.alertEnabled : current.alertEnabled,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = next;
    this.savedSearches.set(userId, list);
    return next;
  }

  deleteSavedSearch(userId: string, id: string): boolean {
    const list = this.savedSearches.get(userId) ?? [];
    const next = list.filter((s) => s.id !== id);
    this.savedSearches.set(userId, next);
    return next.length !== list.length;
  }

  /** All users with at least one alert-enabled saved search (for publish fan-out). */
  listAlertSavedSearches(): Array<{ userId: string; search: SavedSearch }> {
    const out: Array<{ userId: string; search: SavedSearch }> = [];
    for (const [userId, list] of this.savedSearches.entries()) {
      for (const search of list) {
        if (search.alertEnabled) out.push({ userId, search });
      }
    }
    return out;
  }

  clearUser(userId: string): void {
    this.saved.delete(userId);
    this.hiddenJobs.delete(userId);
    this.hiddenEmployers.delete(userId);
    this.profiles.delete(userId);
    this.applications.delete(userId);
    this.savedSearches.delete(userId);
  }
}
