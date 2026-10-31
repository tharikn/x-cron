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

  async loadSaved(): Promise<Job[]> {
    const response = await firstValueFrom(
      this.http.get<{ items: Job[] }>(`${environment.apiUrl}/me/saved-jobs`, {
        headers: this.auth.authHeaders(),
      }),
    );
    this.saved.set(response.items);
    return response.items;
  }

  async save(jobId: string): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/me/saved-jobs/${jobId}`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  async unsave(jobId: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/me/saved-jobs/${jobId}`, {
        headers: this.auth.authHeaders(),
      }),
    );
  }
}
