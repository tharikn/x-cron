import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export type ModerationQueue =
  | 'employer_verification'
  | 'new_job_review'
  | 'reported_target'
  | 'suspected_duplicate'
  | 'suspicious_account'
  | 'appeal';

export type ReportCategory =
  | 'spam'
  | 'scam'
  | 'misleading'
  | 'offensive'
  | 'duplicate'
  | 'payment_request'
  | 'impersonation'
  | 'other';

export interface ModerationCase {
  id: string;
  queue: ModerationQueue;
  status: string;
  priority: string;
  targetType: string;
  targetId: string;
  category?: string;
  details?: string;
  riskFlags: string[];
  riskScore: number;
  dismissedRiskFlags: string[];
  assigneeUserId?: string;
  slaAt?: string;
  decision?: string;
  reason?: string;
  reasonCode?: string;
  decidedAt?: string;
  feedbackThreadId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModerationReport {
  id: string;
  caseId: string;
  category: string;
  details: string;
  reporterUserId?: string;
  createdAt: string;
}

export interface TrustAuditEvent {
  id: string;
  actorId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  reason?: string;
  createdAt: string;
}

export const REPORT_CATEGORY_OPTIONS: { value: ReportCategory; label: string }[] =
  [
    { value: 'spam', label: 'Spam' },
    { value: 'scam', label: 'Scam / fraud' },
    { value: 'misleading', label: 'Misleading' },
    { value: 'offensive', label: 'Offensive' },
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'payment_request', label: 'Asks for payment' },
    { value: 'impersonation', label: 'Impersonation' },
    { value: 'other', label: 'Other' },
  ];

export const QUEUE_LABELS: Record<ModerationQueue, string> = {
  employer_verification: 'Employer verification',
  new_job_review: 'New job review',
  reported_target: 'Reported',
  suspected_duplicate: 'Suspected duplicate',
  suspicious_account: 'Suspicious account',
  appeal: 'Appeal',
};

@Injectable({ providedIn: 'root' })
export class ModerationService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  dashboard() {
    return firstValueFrom(
      this.http.get<{
        queues: Record<ModerationQueue, number>;
        overdue: number;
        openTotal: number;
      }>(`${environment.apiUrl}/moderation/dashboard`, {
        headers: this.auth.authHeaders(),
      }),
    );
  }

  listCases(params: { queue?: string; status?: string }) {
    const q = new URLSearchParams();
    if (params.queue) q.set('queue', params.queue);
    if (params.status) q.set('status', params.status);
    const qs = q.toString();
    return firstValueFrom(
      this.http.get<{ items: ModerationCase[] }>(
        `${environment.apiUrl}/moderation/cases${qs ? `?${qs}` : ''}`,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  getCase(id: string) {
    return firstValueFrom(
      this.http.get<{
        case: ModerationCase;
        reports: ModerationReport[];
        audit: TrustAuditEvent[];
      }>(`${environment.apiUrl}/moderation/cases/${id}`, {
        headers: this.auth.authHeaders(),
      }),
    );
  }

  decide(
    id: string,
    body: {
      decision: string;
      reason: string;
      reasonCode?: string;
      dismissRiskFlags?: string[];
    },
  ) {
    return firstValueFrom(
      this.http.post(`${environment.apiUrl}/moderation/cases/${id}/decide`, body, {
        headers: this.auth.authHeaders(),
      }),
    );
  }

  assign(id: string, assigneeUserId?: string | null) {
    return firstValueFrom(
      this.http.patch(
        `${environment.apiUrl}/moderation/cases/${id}/assign`,
        { assigneeUserId },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  search(q: string) {
    return firstValueFrom(
      this.http.get<{
        users: Array<Record<string, unknown>>;
        employers: Array<Record<string, unknown>>;
        jobs: Array<Record<string, unknown>>;
      }>(`${environment.apiUrl}/moderation/search?q=${encodeURIComponent(q)}`, {
        headers: this.auth.authHeaders(),
      }),
    );
  }

  suspendUser(
    userId: string,
    body: { reasonCode: string; reason: string; durationHours?: number },
  ) {
    return firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/moderation/users/${userId}/suspend`,
        body,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  reactivateUser(userId: string, reason: string) {
    return firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/moderation/users/${userId}/reactivate`,
        { reason },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  reportJob(
    jobId: string,
    body: { category: ReportCategory; details: string },
  ) {
    return firstValueFrom(
      this.http.post(`${environment.apiUrl}/jobs/${jobId}/report`, body, {
        headers: this.auth.authHeaders(),
      }),
    );
  }

  createAppeal(body: {
    targetType: 'job' | 'employer' | 'user';
    targetId: string;
    reason: string;
    relatedCaseId?: string;
    feedbackThreadId?: string;
  }) {
    return firstValueFrom(
      this.http.post(`${environment.apiUrl}/moderation/appeals`, body, {
        headers: this.auth.authHeaders(),
      }),
    );
  }
}
