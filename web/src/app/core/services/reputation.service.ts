import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export type ReputationRole = 'seeker' | 'employer';
export type ReputationBand = 'rising' | 'steady' | 'needs_care';

export interface ReputationSummary {
  userId: string;
  role: ReputationRole;
  score: number;
  band: ReputationBand;
  bandLabel: string;
}

export interface ReputationEventRow {
  id: string;
  type: string;
  typeLabel: string;
  delta: number;
  scoreAfter: number;
  applicationId: string | null;
  jobId: string | null;
  matchPercent: number | null;
  note: string | null;
  createdAt: string;
}

export interface ReputationMe extends ReputationSummary {
  tips: string[];
  howItWorks: string[];
  events: ReputationEventRow[];
}

@Injectable({ providedIn: 'root' })
export class ReputationService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  readonly mine = signal<ReputationMe[]>([]);

  async loadMine(role?: ReputationRole): Promise<ReputationMe[]> {
    const q = role ? `?role=${role}` : '';
    const res = await firstValueFrom(
      this.http.get<{ items: ReputationMe[] }>(
        `${environment.apiUrl}/reputation/me${q}`,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.mine.set(res.items ?? []);
    return res.items ?? [];
  }
}
