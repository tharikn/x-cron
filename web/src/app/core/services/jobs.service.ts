import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly http = inject(HttpClient);

  search(input: {
    keyword?: string;
    location?: string;
    jobType?: string;
    category?: string;
    language?: string;
    sort?: string;
  }): Promise<Job[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(input)) {
      if (value) params = params.set(key, value);
    }
    return firstValueFrom(
      this.http.get<{ items: Job[] }>(`${environment.apiUrl}/jobs`, { params }),
    ).then((res) => res.items);
  }

  getById(id: string): Promise<Job> {
    return firstValueFrom(this.http.get<Job>(`${environment.apiUrl}/jobs/${id}`));
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
}
