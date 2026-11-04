import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Job } from '../models/job.model';
import { AuthService } from './auth.service';

export interface SeekerProfile {
  displayName?: string;
  experienceBand?: 'fresher' | '0-1' | '1-3' | '3-5' | '5+';
  skills: string[];
  preferredCities: string[];
  openToWork: boolean;
  updatedAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: Record<string, unknown>;
  alertEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SeekerApplication {
  jobId: string;
  status: 'contacted' | 'applied';
  channel?: string;
  createdAt: string;
  updatedAt: string;
  job?: Job;
}

@Injectable({ providedIn: 'root' })
export class SeekerService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  readonly saved = signal<Job[]>([]);
  readonly feed = signal<Job[]>([]);
  readonly profile = signal<SeekerProfile | null>(null);
  readonly applications = signal<SeekerApplication[]>([]);
  readonly savedSearches = signal<SavedSearch[]>([]);
  readonly hiddenJobIds = signal<string[]>([]);

  async loadSaved(): Promise<Job[]> {
    const response = await firstValueFrom(
      this.http.get<{ items: Job[] }>(`${environment.apiUrl}/me/saved-jobs`, {
        headers: this.auth.authHeaders(),
      }),
    );
    this.saved.set(response.items);
    return response.items;
  }

  async loadFeed(): Promise<Job[]> {
    const response = await firstValueFrom(
      this.http.get<{ items: Job[] }>(`${environment.apiUrl}/feed`, {
        headers: this.auth.authHeaders(),
      }),
    );
    this.feed.set(response.items);
    return response.items;
  }

  async save(jobId: string, job?: Job): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/me/saved-jobs/${jobId}`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
    if (job) {
      this.saved.update((list) =>
        list.some((item) => item.id === jobId) ? list : [job, ...list],
      );
    }
  }

  async unsave(jobId: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/me/saved-jobs/${jobId}`, {
        headers: this.auth.authHeaders(),
      }),
    );
    this.saved.update((list) => list.filter((item) => item.id !== jobId));
  }

  async loadProfile(): Promise<SeekerProfile> {
    const profile = await firstValueFrom(
      this.http.get<SeekerProfile>(`${environment.apiUrl}/me/profile`, {
        headers: this.auth.authHeaders(),
      }),
    );
    this.profile.set(profile);
    return profile;
  }

  async saveProfile(patch: Partial<SeekerProfile>): Promise<SeekerProfile> {
    const profile = await firstValueFrom(
      this.http.patch<SeekerProfile>(`${environment.apiUrl}/me/profile`, patch, {
        headers: this.auth.authHeaders(),
      }),
    );
    this.profile.set(profile);
    return profile;
  }

  async loadApplications(): Promise<SeekerApplication[]> {
    const response = await firstValueFrom(
      this.http.get<{ items: SeekerApplication[] }>(
        `${environment.apiUrl}/me/applications`,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.applications.set(response.items);
    return response.items;
  }

  async markApplication(
    jobId: string,
    input: { status?: 'contacted' | 'applied'; channel?: string } = {},
  ): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/me/applications/${jobId}`,
        input,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  async hideJob(jobId: string, hideEmployer = false): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/me/hidden-jobs/${jobId}`,
        { hideEmployer },
        { headers: this.auth.authHeaders() },
      ),
    );
    this.hiddenJobIds.update((ids) =>
      ids.includes(jobId) ? ids : [...ids, jobId],
    );
  }

  async loadHidden(): Promise<string[]> {
    const response = await firstValueFrom(
      this.http.get<{ jobIds: string[] }>(
        `${environment.apiUrl}/me/hidden-jobs`,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.hiddenJobIds.set(response.jobIds);
    return response.jobIds;
  }

  async loadSavedSearches(): Promise<SavedSearch[]> {
    const response = await firstValueFrom(
      this.http.get<{ items: SavedSearch[] }>(
        `${environment.apiUrl}/me/saved-searches`,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.savedSearches.set(response.items);
    return response.items;
  }

  async createSavedSearch(input: {
    name: string;
    query: Record<string, unknown>;
    alertEnabled?: boolean;
  }): Promise<SavedSearch> {
    const row = await firstValueFrom(
      this.http.post<SavedSearch>(
        `${environment.apiUrl}/me/saved-searches`,
        input,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.savedSearches.update((list) => [row, ...list]);
    return row;
  }

  async deleteSavedSearch(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/me/saved-searches/${id}`, {
        headers: this.auth.authHeaders(),
      }),
    );
    this.savedSearches.update((list) => list.filter((s) => s.id !== id));
  }

  async deleteAccount(): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/me`, {
        headers: this.auth.authHeaders(),
      }),
    );
  }
}
