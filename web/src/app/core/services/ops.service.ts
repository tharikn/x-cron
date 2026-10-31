import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export type DashboardGranularity = 'day' | 'month' | 'year';

export interface DashboardSummary {
  usersTotal: number;
  usersSignedUpInPeriod: number;
  signInsInPeriod: number;
  activeSessions: number;
  postsUploadedInPeriod: number;
  postsTotal: number;
  publishedJobs: number;
  needsReview: number;
  draftJobs: number;
  removedJobs: number;
  rejectedJobs: number;
  expiredJobs: number;
  importBatches: number;
  contactUnlocks: number;
  searches: number;
}

export interface DashboardSeriesPoint {
  bucket: string;
  posts: number;
  signIns: number;
}

export interface DashboardResponse {
  granularity: DashboardGranularity;
  from: string;
  to: string;
  summary: DashboardSummary;
  series: DashboardSeriesPoint[];
  time: string;
}

@Injectable({ providedIn: 'root' })
export class OpsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  dashboard(input: {
    granularity?: DashboardGranularity;
    from?: string;
    to?: string;
  } = {}): Promise<DashboardResponse> {
    let params = new HttpParams();
    if (input.granularity) params = params.set('granularity', input.granularity);
    if (input.from) params = params.set('from', input.from);
    if (input.to) params = params.set('to', input.to);
    return firstValueFrom(
      this.http.get<DashboardResponse>(`${environment.apiUrl}/ops/dashboard`, {
        params,
        headers: this.auth.authHeaders(),
      }),
    );
  }
}
