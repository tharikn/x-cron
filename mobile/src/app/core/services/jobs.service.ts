import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MOCK_JOBS } from '../data/mock-jobs';
import type { Job, JobSearchQuery, JobType } from '../models/job.model';
import { AuthService } from './auth.service';

const SEARCH_COUNT_KEY = 'xcron.searchCount';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly cache = signal<Job[]>([...MOCK_JOBS]);
  readonly searchCount = signal(this.readSearchCount());
  readonly loading = signal(false);
  readonly usingApi = signal(false);
  readonly lastError = signal<string | null>(null);

  async search(query: JobSearchQuery): Promise<Job[]> {
    this.loading.set(true);
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
      params = params.set('sort', query.sort || 'newest');

      const response = await firstValueFrom(
        this.http.get<{ items: Job[] }>(`${environment.apiUrl}/jobs`, { params }),
      );
      this.usingApi.set(true);
      this.cache.set(response.items);
      this.bumpSearchCount(query);
      return response.items;
    } catch (error) {
      this.usingApi.set(false);
      this.lastError.set('API unavailable — showing local mock jobs.');
      const fallback = this.localSearch(query);
      this.cache.set(fallback);
      this.bumpSearchCount(query);
      return fallback;
    } finally {
      this.loading.set(false);
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
    description: string;
    contentLanguage: string;
    contactPhone?: string;
  }): Promise<Job> {
    const job = await firstValueFrom(
      this.http.post<Job>(`${environment.apiUrl}/employers/jobs`, input, {
        headers: this.auth.authHeaders(),
      }),
    );
    this.usingApi.set(true);
    return job;
  }

  async createFromPaste(rawText: string, contentLanguage: string): Promise<Job> {
    const job = await firstValueFrom(
      this.http.post<Job>(
        `${environment.apiUrl}/employers/jobs/paste`,
        { text: rawText, contentLanguage },
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

  private localSearch(query: JobSearchQuery): Job[] {
    const keyword = query.keyword?.trim().toLowerCase() ?? '';
    const locationText = query.locationText?.trim().toLowerCase() ?? '';
    return MOCK_JOBS.filter((job) => {
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
        hasEmail: false,
        hasWhatsapp: !!input.contactPhone,
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
