import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Job, JobAnalyticsDashboard } from '../models/job.model';
import { AuthService } from './auth.service';

const VIEWER_KEY = 'xcron.jobViewerKey';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

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

  search(input: {
    keyword?: string;
    q?: string;
    location?: string;
    jobType?: string;
    category?: string;
    language?: string;
    salaryMin?: number | null;
    remote?: boolean | null;
    postedWithin?: string | null;
    nearLat?: number | null;
    nearLng?: number | null;
    radiusKm?: number | null;
    walkInOnly?: boolean | null;
    skills?: string;
    verifiedEmployer?: boolean | null;
    fresher?: boolean | null;
    easyApply?: boolean | null;
    sort?: string;
    cursor?: string;
    limit?: number;
  }): Promise<{ items: Job[]; nextCursor?: string; total: number }> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(input)) {
      if (value == null || value === '') continue;
      params = params.set(key, String(value));
    }
    return firstValueFrom(
      this.http.get<{ items: Job[]; nextCursor?: string; total: number }>(
        `${environment.apiUrl}/jobs`,
        { params },
      ),
    );
  }

  getById(id: string): Promise<Job> {
    return firstValueFrom(this.http.get<Job>(`${environment.apiUrl}/jobs/${id}`));
  }

  getPublicEmployer(id: string): Promise<{
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

  renewMyJob(id: string): Promise<Job> {
    return firstValueFrom(
      this.http.post<Job>(
        `${environment.apiUrl}/employers/jobs/${id}/renew`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  getBySlug(slug: string): Promise<Job> {
    return firstValueFrom(
      this.http.get<Job>(`${environment.apiUrl}/jobs/lookup`, {
        params: { slug },
      }),
    );
  }

  related(id: string): Promise<Job[]> {
    return firstValueFrom(
      this.http.get<{ items: Job[] }>(`${environment.apiUrl}/jobs/${id}/related`),
    ).then((res) => res.items);
  }

  categories(): Promise<string[]> {
    return firstValueFrom(
      this.http.get<{ items: string[] }>(`${environment.apiUrl}/jobs/meta/categories`),
    ).then((res) => res.items);
  }

  createQuickPost(input: {
    title: string;
    employerName: string;
    locationCity: string;
    jobType: string;
    salaryText?: string;
    vacancies?: number;
    description: string;
    contentLanguage: string;
    contactPhone?: string;
    contactEmail?: string;
    contactWebsite?: string;
    effectiveFrom?: string;
    expiresAt?: string;
    priority?: number;
    /** Recruiter live publish — skips Blog Approval. */
    directPublish?: boolean;
  }): Promise<Job> {
    return firstValueFrom(
      this.http.post<Job>(`${environment.apiUrl}/employers/jobs`, input, {
        headers: this.auth.authHeaders(),
      }),
    );
  }

  listMyJobs(input: { page?: number; limit?: number } = {}): Promise<{
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

  activateMyJob(id: string): Promise<Job> {
    return firstValueFrom(
      this.http.post<Job>(
        `${environment.apiUrl}/employers/jobs/${id}/activate`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  deactivateMyJob(id: string): Promise<Job> {
    return firstValueFrom(
      this.http.post<Job>(
        `${environment.apiUrl}/employers/jobs/${id}/deactivate`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  hideMyJob(id: string): Promise<Job> {
    return firstValueFrom(
      this.http.post<Job>(
        `${environment.apiUrl}/employers/jobs/${id}/hide`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  updateMyJob(
    id: string,
    input: {
      title?: string;
      employerName?: string;
      locationCity?: string;
      jobType?: string;
      salaryText?: string;
      description?: string;
      contentLanguage?: string;
      contactPhone?: string;
      contactEmail?: string;
      contactWebsite?: string;
      effectiveFrom?: string;
      expiresAt?: string;
      priority?: number;
      status?: string;
    },
  ): Promise<Job> {
    return firstValueFrom(
      this.http.patch<Job>(`${environment.apiUrl}/employers/jobs/${id}`, input, {
        headers: this.auth.authHeaders(),
      }),
    );
  }

  deleteMyJob(id: string): Promise<{ ok: boolean; id: string; status: string }> {
    return firstValueFrom(
      this.http.delete<{ ok: boolean; id: string; status: string }>(
        `${environment.apiUrl}/employers/jobs/${id}`,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  createFromPaste(
    rawText: string,
    contentLanguage: string,
    options?: { directPublish?: boolean },
  ): Promise<Job> {
    return firstValueFrom(
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
  }

  moderationQueue(status = 'needs-review'): Promise<Job[]> {
    return firstValueFrom(
      this.http.get<{ items: Job[] }>(`${environment.apiUrl}/admin/jobs`, {
        params: { status },
        headers: this.auth.authHeaders(),
      }),
    ).then((res) => res.items);
  }

  updateForModeration(
    id: string,
    input: {
      title?: string;
      employerName?: string;
      locationCity?: string;
      jobType?: string;
      salaryText?: string;
      description?: string;
      contentLanguage?: string;
      contactWebsite?: string;
    },
  ): Promise<Job> {
    return firstValueFrom(
      this.http.patch<Job>(`${environment.apiUrl}/admin/jobs/${id}`, input, {
        headers: this.auth.authHeaders(),
      }),
    );
  }

  approveJob(id: string, note?: string): Promise<Job> {
    return firstValueFrom(
      this.http.post<Job>(
        `${environment.apiUrl}/admin/jobs/${id}/approve`,
        { note },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  rejectJob(id: string, note?: string): Promise<Job> {
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

  /** Fire-and-forget listing view for recruiter analytics (deduped server-side). */
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
}
