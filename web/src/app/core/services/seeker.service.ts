import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Job } from '../models/job.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SeekerService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  readonly saved = signal<Job[]>([]);
  readonly feed = signal<Job[]>([]);

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

  async hideJob(jobId: string): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/me/hidden-jobs/${jobId}`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  async report(jobId: string, reason: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/jobs/${jobId}/report`, { reason }),
    );
  }
}
