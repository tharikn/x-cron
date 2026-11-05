import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MOCK_JOBS } from '../data/mock-jobs';
import type {
  Job,
  JobAnalyticsDashboard,
  JobSearchQuery,
  JobSearchResult,
  JobType,
} from '../models/job.model';
import { AuthService } from './auth.service';

const SEARCH_COUNT_KEY = 'xcron.searchCount';
const VIEWER_KEY = 'xcron.jobViewerKey';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly cache = signal<Job[]>([...MOCK_JOBS]);
  readonly searchCount = signal(this.readSearchCount());
  readonly loading = signal(false);
  readonly usingApi = signal(false);
  readonly lastError = signal<string | null>(null);

  private viewerKey(): string {
    if (typeof localStorage === 'undefined') return `anon_${Date.now()}`;
    let key = localStorage.getItem(VIEWER_KEY);
    if (!key) {
      key =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(VIEWER_KEY, key);
    }
    return key;
  }

  async search(
    query: JobSearchQuery,
    options: { silent?: boolean } = {},
  ): Promise<JobSearchResult> {
    if (!options.silent) this.loading.set(true);
    this.lastError.set(null);
    try {
      let params = new HttpParams();
      if (query.keyword) params = params.set('keyword', query.keyword);
      if (query.locationText) params = params.set('location', query.locationText);
      if (query.jobType) params = params.set('jobType', query.jobType);
      if (query.category) params = params.set('category', query.category);
      if (query.language) params = params.set('language', query.language);
      if (query.salaryMin != null) {
        params = params.set('salaryMin', String(query.salaryMin));
      }
      if (query.remote) params = params.set('remote', 'true');
      if (query.postedWithin) {
        params = params.set('postedWithin', query.postedWithin);
      }
      if (query.nearLat != null) {
        params = params.set('nearLat', String(query.nearLat));
      }
      if (query.nearLng != null) {
        params = params.set('nearLng', String(query.nearLng));
      }
      if (query.radiusKm != null) {
        params = params.set('radiusKm', String(query.radiusKm));
      }
      if (query.walkInOnly) params = params.set('walkInOnly', 'true');
      params = params.set('sort', query.sort || 'newest');
      if (query.cursor) params = params.set('cursor', query.cursor);
      if (query.limit != null) params = params.set('limit', String(query.limit));

      const response = await firstValueFrom(
        this.http.get<JobSearchResult>(`${environment.apiUrl}/jobs`, { params }),
      );
      this.usingApi.set(true);
      this.cache.update((current) => {
        const byId = new Map(current.map((job) => [job.id, job]));
        for (const job of response.items) byId.set(job.id, job);
        return [...byId.values()];
      });
      if (!query.cursor) this.bumpSearchCount(query);
      return response;
    } catch {
      this.usingApi.set(false);
      this.lastError.set('Server maintenance — please try again shortly.');
      const fallback = this.localSearch(query);
      this.cache.update((current) => {
        const byId = new Map(current.map((job) => [job.id, job]));
        for (const job of fallback.items) byId.set(job.id, job);
        return [...byId.values()];
      });
      if (!query.cursor) this.bumpSearchCount(query);
      return fallback;
    } finally {
      if (!options.silent) this.loading.set(false);
    }
  }

  async getById(id: string): Promise<Job | undefined> {
    try {
      const job = await firstValueFrom(
        this.http.get<Job>(`${environment.apiUrl}/jobs/${id}`),
      );
      this.usingApi.set(true);
      return job;
    } catch {
      return this.cache().find((job) => job.id === id) ?? MOCK_JOBS.find((j) => j.id === id);
    }
  }

  async getPublicEmployer(id: string): Promise<{
    id: string;
    name: string;
    about: string | null;
    verified: boolean;
    jobs: Job[];
  }> {
    return firstValueFrom(
      this.http.get<{
        id: string;
        name: string;
        about: string | null;
        verified: boolean;
        jobs: Job[];
      }>(`${environment.apiUrl}/employers/${id}/public`),
    );
  }

  async related(jobId: string): Promise<Job[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ items: Job[] }>(`${environment.apiUrl}/jobs/${jobId}/related`),
      );
      return response.items;
    } catch {
      const job = await this.getById(jobId);
      if (!job) return [];
      return this.cache()
        .filter((candidate) => candidate.id !== job.id)
        .filter(
          (candidate) =>
            candidate.location.city === job.location.city ||
            candidate.category === job.category,
        )
        .slice(0, 3);
    }
  }

  async categories(): Promise<string[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ items: string[] }>(`${environment.apiUrl}/jobs/meta/categories`),
      );
      return response.items;
    } catch {
      return [...new Set(MOCK_JOBS.map((job) => job.category))].sort();
    }
  }

  async createQuickPost(input: {
    title: string;
    employerName: string;
    locationCity: string;
    jobType: JobType;
    salaryText?: string;
    vacancies?: number;
    description: string;
    contentLanguage: string;
    contactPhone?: string;
    contactEmail?: string;
    contactWebsite?: string;
    /** Recruiter live publish — skips Blog Approval. */
    directPublish?: boolean;
  }): Promise<Job> {
    const job = await firstValueFrom(
      this.http.post<Job>(`${environment.apiUrl}/employers/jobs`, input, {
        headers: this.auth.authHeaders(),
      }),
    );
    this.usingApi.set(true);
    return job;
  }

  async createFromPaste(
    rawText: string,
    contentLanguage: string,
    options?: { directPublish?: boolean },
  ): Promise<Job> {
    const job = await firstValueFrom(
      this.http.post<Job>(
        `${environment.apiUrl}/employers/jobs/paste`,
        {
          text: rawText,
          contentLanguage,
          directPublish: options?.directPublish,
        },
        { headers: this.auth.authHeaders() },
      ),
    );
    this.usingApi.set(true);
    return job;
  }

  async moderationQueue(status = 'needs-review'): Promise<Job[]> {
    const response = await firstValueFrom(
      this.http.get<{ items: Job[] }>(`${environment.apiUrl}/admin/jobs`, {
        params: { status },
        headers: this.auth.authHeaders(),
      }),
    );
    return response.items;
  }

  async approveJob(id: string, note?: string): Promise<Job> {
    return firstValueFrom(
      this.http.post<Job>(
        `${environment.apiUrl}/admin/jobs/${id}/approve`,
        { note },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  async rejectJob(id: string, note?: string): Promise<Job> {
    return firstValueFrom(
      this.http.post<Job>(
        `${environment.apiUrl}/admin/jobs/${id}/reject`,
        { note },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  async reportJob(id: string, reason: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/jobs/${id}/report`, { reason }),
    );
  }

  async listMyJobs(input: { page?: number; limit?: number } = {}): Promise<{
    items: Job[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let params = new HttpParams();
    if (input.page) params = params.set('page', String(input.page));
    if (input.limit) params = params.set('limit', String(input.limit));
    return firstValueFrom(
      this.http.get<{
        items: Job[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>(`${environment.apiUrl}/employers/jobs`, {
        params,
        headers: this.auth.authHeaders(),
      }),
    );
  }

  recordJobView(jobId: string): void {
    void firstValueFrom(
      this.http.post<{ ok: boolean; counted: boolean }>(
        `${environment.apiUrl}/jobs/${jobId}/events`,
        { type: 'view', viewerKey: this.viewerKey() },
      ),
    ).catch(() => undefined);
  }

  getJobAnalytics(jobId: string, days = 30): Promise<JobAnalyticsDashboard> {
    return firstValueFrom(
      this.http.get<JobAnalyticsDashboard>(
        `${environment.apiUrl}/employers/jobs/${jobId}/analytics`,
        {
          params: { days: String(days) },
          headers: this.auth.authHeaders(),
        },
      ),
    );
  }

  private localSearch(query: JobSearchQuery): JobSearchResult {
    const keyword = query.keyword?.trim().toLowerCase() ?? '';
    const locationText = query.locationText?.trim().toLowerCase() ?? '';
    const limit = Math.min(Math.max(query.limit ?? 8, 1), 50);
    let results = MOCK_JOBS.filter((job) => {
      const haystack = [job.title, job.employerName, job.category, job.description.about]
        .join(' ')
        .toLowerCase();
      const locationHaystack = [job.location.city, job.location.district, job.location.state]
        .join(' ')
        .toLowerCase();
      return (
        (!keyword || haystack.includes(keyword)) &&
        (!locationText || locationHaystack.includes(locationText)) &&
        (!query.jobType || job.jobType === query.jobType) &&
        (!query.category || job.category === query.category) &&
        (!query.language || job.contentLanguage === query.language)
      );
    });

    if (query.cursor) {
      const index = results.findIndex((job) => job.id === query.cursor);
      if (index >= 0) results = results.slice(index + 1);
    }

    const total = results.length;
    const page = results.slice(0, limit);
    const nextCursor =
      results.length > limit ? page[page.length - 1]?.id : undefined;
    return { items: page, nextCursor, total };
  }

  private createLocalDraft(input: {
    title: string;
    employerName: string;
    locationCity: string;
    jobType: JobType;
    salaryText?: string;
    description: string;
    contentLanguage: string;
    contactPhone?: string;
    contactEmail?: string;
    contactWebsite?: string;
  }): Job {
    const id = `local_${Date.now()}`;
    return {
      id,
      slug: `local/${input.locationCity.toLowerCase()}/${id}`,
      title: input.title,
      employerName: input.employerName,
      verifiedEmployer: false,
      location: {
        country: 'India',
        state: 'Tamil Nadu',
        district: input.locationCity,
        city: input.locationCity,
      },
      jobType: input.jobType,
      contentLanguage: input.contentLanguage,
      description: { about: input.description },
      category: 'General',
      publishedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'published',
      contact: {
        hasPhone: !!input.contactPhone,
        hasEmail: !!input.contactEmail,
        hasWhatsapp: !!input.contactPhone,
        hasWebsite: !!input.contactWebsite,
        unlockPricePaise: 500,
      },
    };
  }

  private bumpSearchCount(query: JobSearchQuery): void {
    if (
      query.keyword ||
      query.locationText ||
      query.jobType ||
      query.category ||
      query.language
    ) {
      const next = this.searchCount() + 1;
      this.searchCount.set(next);
      localStorage.setItem(SEARCH_COUNT_KEY, String(next));
    }
  }

  private readSearchCount(): number {
    const raw = localStorage.getItem(SEARCH_COUNT_KEY);
    return raw ? Number(raw) || 0 : 0;
  }
}
