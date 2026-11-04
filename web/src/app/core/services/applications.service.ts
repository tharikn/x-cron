import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Job } from '../models/job.model';
import { AuthService } from './auth.service';
import type { ApplyProfile } from './apply-profiles.service';

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'interview'
  | 'offered'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export interface ApplicationTimelineEvent {
  id: string;
  type: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus | null;
  fromStatusLabel: string | null;
  toStatusLabel: string | null;
  actorRole: string;
  note: string | null;
  meta: Record<string, string | number | boolean | null> | null;
  at: string;
}

export interface ApplicationMessage {
  id: string;
  applicationId: string;
  senderUserId: string;
  senderRole: 'seeker' | 'employer' | 'admin';
  body: string;
  createdAt: string;
}

export type ApplyProfileSnapshot = Pick<
  ApplyProfile,
  | 'id'
  | 'name'
  | 'headline'
  | 'summary'
  | 'experienceBand'
  | 'skills'
  | 'projects'
  | 'portfolioLinks'
>;

export interface ApplicationReputation {
  userId: string;
  role: 'seeker' | 'employer';
  score: number;
  band: 'rising' | 'steady' | 'needs_care';
  bandLabel: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  employerId: string;
  seekerUserId: string;
  ownerUserId?: string;
  status: ApplicationStatus;
  statusLabel: string;
  seekerName: string | null;
  seekerPhone: string | null;
  seekerEmail: string | null;
  coverNote: string | null;
  applyProfileId: string | null;
  applyProfileSnapshot: ApplyProfileSnapshot | null;
  offerLetterText: string | null;
  viewedAt: string | null;
  matchPercent?: number | null;
  reputation?: ApplicationReputation | null;
  likelySpam?: boolean;
  spamBadge?: string | null;
  createdAt: string;
  updatedAt: string;
  job?: Job | null;
  timeline?: ApplicationTimelineEvent[];
  messages?: ApplicationMessage[];
}

export interface ApplyJobInput {
  applyProfileId: string;
  coverNote?: string;
  seekerName?: string;
  seekerPhone?: string;
  seekerEmail?: string;
}

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  readonly mine = signal<JobApplication[]>([]);

  apply(jobId: string, input: ApplyJobInput) {
    return firstValueFrom(
      this.http.post<JobApplication>(
        `${environment.apiUrl}/jobs/${jobId}/apply`,
        input,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  async listMine() {
    const res = await firstValueFrom(
      this.http.get<{ items: JobApplication[] }>(
        `${environment.apiUrl}/me/job-applications`,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.mine.set(res.items);
    return res.items;
  }

  getMine(id: string) {
    return firstValueFrom(
      this.http.get<JobApplication>(
        `${environment.apiUrl}/me/job-applications/${id}`,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  withdraw(id: string, note?: string) {
    return firstValueFrom(
      this.http.post<JobApplication>(
        `${environment.apiUrl}/me/job-applications/${id}/withdraw`,
        { note },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  listMessages(id: string, asEmployer = false) {
    const path = asEmployer
      ? `${environment.apiUrl}/employers/applications/${id}/messages`
      : `${environment.apiUrl}/me/job-applications/${id}/messages`;
    return firstValueFrom(
      this.http.get<{ items: ApplicationMessage[] }>(path, {
        headers: this.auth.authHeaders(),
      }),
    ).then((res) => res.items);
  }

  sendMessage(id: string, body: string, asEmployer = false) {
    const path = asEmployer
      ? `${environment.apiUrl}/employers/applications/${id}/messages`
      : `${environment.apiUrl}/me/job-applications/${id}/messages`;
    return firstValueFrom(
      this.http.post<ApplicationMessage>(
        path,
        { body },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  listEmployer() {
    return firstValueFrom(
      this.http.get<{ items: JobApplication[] }>(
        `${environment.apiUrl}/employers/applications`,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  listForJob(jobId: string) {
    return firstValueFrom(
      this.http.get<{ job: Job; items: JobApplication[] }>(
        `${environment.apiUrl}/employers/jobs/${jobId}/applications`,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  getEmployer(id: string) {
    return firstValueFrom(
      this.http.get<JobApplication>(
        `${environment.apiUrl}/employers/applications/${id}`,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  transition(
    id: string,
    input: {
      status: Exclude<ApplicationStatus, 'withdrawn'>;
      note?: string;
      offerLetterText?: string;
    },
  ) {
    return firstValueFrom(
      this.http.post<JobApplication>(
        `${environment.apiUrl}/employers/applications/${id}/transition`,
        input,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  addNote(id: string, note: string) {
    return firstValueFrom(
      this.http.post<JobApplication>(
        `${environment.apiUrl}/employers/applications/${id}/notes`,
        { note },
        { headers: this.auth.authHeaders() },
      ),
    );
  }
}
