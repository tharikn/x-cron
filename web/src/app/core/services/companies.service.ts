import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface CompanyDto {
  id: string;
  name: string;
  legalName?: string | null;
  slug?: string | null;
  about?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  sizeBand?: string | null;
  headquarters?: string | null;
  hiringLocations?: string[];
  verified: boolean;
  verificationStatus: string;
  verifiedEmailDomain?: string | null;
  workspaceSettings?: Record<string, unknown>;
  ownerUserId?: string;
  memberRole?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyMemberDto {
  id: string;
  employerId: string;
  userId: string;
  role: string;
  status: string;
  displayName?: string;
  username?: string;
  email?: string;
  joinedAt?: string;
}

export interface RecruiterDashboardDto {
  company: CompanyDto & { memberRole: string };
  jobs: { total: number; byStatus: Record<string, number> };
  applicants: {
    total: number;
    unreviewed: number;
    byStatus: Record<string, number>;
  };
  responseQuality: {
    medianFirstViewHours: number | null;
    viewedWithin48hPct: number | null;
    indicator: 'usually_responds' | 'actively_reviewing' | 'building' | null;
    unreviewedReminderCount: number;
  };
  upcomingInterviews: Array<{
    id: string;
    applicationId: string;
    scheduledAt: string;
    mode: string;
    status: string;
  }>;
  membersActive: number;
}

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private headers(): Record<string, string> {
    return this.auth.authHeaders();
  }

  create(body: {
    name: string;
    legalName?: string;
    about?: string;
    website?: string;
    industry?: string;
    sizeBand?: string;
    headquarters?: string;
    hiringLocations?: string[];
  }): Promise<CompanyDto> {
    return firstValueFrom(
      this.http.post<CompanyDto>(`${environment.apiUrl}/companies`, body, {
        withCredentials: true,
        headers: this.headers(),
      }),
    );
  }

  get(companyId: string): Promise<CompanyDto> {
    return firstValueFrom(
      this.http.get<CompanyDto>(
        `${environment.apiUrl}/companies/${companyId}`,
        { withCredentials: true, headers: this.headers() },
      ),
    );
  }

  patch(companyId: string, body: Record<string, unknown>): Promise<CompanyDto> {
    return firstValueFrom(
      this.http.patch<CompanyDto>(
        `${environment.apiUrl}/companies/${companyId}`,
        body,
        { withCredentials: true, headers: this.headers() },
      ),
    );
  }

  submitVerification(
    companyId: string,
    body: {
      kind: string;
      label: string;
      reference: string;
      claimedEmailDomain?: string;
    },
  ): Promise<CompanyDto> {
    return firstValueFrom(
      this.http.post<CompanyDto>(
        `${environment.apiUrl}/companies/${companyId}/verification`,
        body,
        { withCredentials: true, headers: this.headers() },
      ),
    );
  }

  listMembers(companyId: string): Promise<{
    items: CompanyMemberDto[];
    invitations: Array<{
      id: string;
      email: string;
      role: string;
      status: string;
      expiresAt: string;
    }>;
  }> {
    return firstValueFrom(
      this.http.get<{
        items: CompanyMemberDto[];
        invitations: Array<{
          id: string;
          email: string;
          role: string;
          status: string;
          expiresAt: string;
        }>;
      }>(`${environment.apiUrl}/companies/${companyId}/members`, {
        withCredentials: true,
        headers: this.headers(),
      }),
    );
  }

  invite(
    companyId: string,
    body: { email: string; role: string },
  ): Promise<{
    id: string;
    email: string;
    role: string;
    acceptToken: string;
    acceptPath: string;
    expiresAt: string;
  }> {
    return firstValueFrom(
      this.http.post<{
        id: string;
        email: string;
        role: string;
        acceptToken: string;
        acceptPath: string;
        expiresAt: string;
      }>(`${environment.apiUrl}/companies/${companyId}/invitations`, body, {
        withCredentials: true,
        headers: this.headers(),
      }),
    );
  }

  patchMember(
    companyId: string,
    memberId: string,
    body: { role?: string; status?: string },
  ): Promise<{ member: CompanyMemberDto }> {
    return firstValueFrom(
      this.http.patch<{ member: CompanyMemberDto }>(
        `${environment.apiUrl}/companies/${companyId}/members/${memberId}`,
        body,
        { withCredentials: true, headers: this.headers() },
      ),
    );
  }

  acceptInvitation(token: string): Promise<CompanyDto> {
    return firstValueFrom(
      this.http.post<CompanyDto>(
        `${environment.apiUrl}/company-invitations/${token}/accept`,
        {},
        { withCredentials: true, headers: this.headers() },
      ),
    );
  }

  dashboard(): Promise<RecruiterDashboardDto> {
    return firstValueFrom(
      this.http.get<RecruiterDashboardDto>(
        `${environment.apiUrl}/recruiter/dashboard`,
        { withCredentials: true, headers: this.headers() },
      ),
    );
  }

  transferOwnership(
    companyId: string,
    body: { targetMemberId: string; confirmCompanyName: string },
  ): Promise<CompanyDto> {
    return firstValueFrom(
      this.http.post<CompanyDto>(
        `${environment.apiUrl}/companies/${companyId}/transfer-ownership`,
        body,
        { withCredentials: true, headers: this.headers() },
      ),
    );
  }
}
