import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export type ExperienceBand = 'fresher' | '0-1' | '1-3' | '3-5' | '5+';

export interface ApplyProfileProject {
  title: string;
  description?: string;
  url?: string;
  tech?: string[];
}

export interface ApplyProfileLink {
  label: string;
  url: string;
}

export interface ApplyProfile {
  id: string;
  userId: string;
  name: string;
  headline?: string;
  summary?: string;
  experienceBand?: ExperienceBand;
  skills: string[];
  projects: ApplyProfileProject[];
  portfolioLinks: ApplyProfileLink[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ApplyProfileInput = {
  name: string;
  headline?: string;
  summary?: string;
  experienceBand?: ExperienceBand;
  skills?: string[];
  projects?: ApplyProfileProject[];
  portfolioLinks?: ApplyProfileLink[];
  isDefault?: boolean;
};

@Injectable({ providedIn: 'root' })
export class ApplyProfilesService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  readonly items = signal<ApplyProfile[]>([]);

  async list(): Promise<ApplyProfile[]> {
    const res = await firstValueFrom(
      this.http.get<{ items: ApplyProfile[] }>(
        `${environment.apiUrl}/me/apply-profiles`,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.items.set(res.items);
    return res.items;
  }

  create(input: ApplyProfileInput) {
    return firstValueFrom(
      this.http.post<ApplyProfile>(
        `${environment.apiUrl}/me/apply-profiles`,
        input,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  update(id: string, input: Partial<ApplyProfileInput>) {
    return firstValueFrom(
      this.http.patch<ApplyProfile>(
        `${environment.apiUrl}/me/apply-profiles/${id}`,
        input,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  remove(id: string) {
    return firstValueFrom(
      this.http.delete<{ ok: boolean }>(
        `${environment.apiUrl}/me/apply-profiles/${id}`,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  setDefault(id: string) {
    return this.update(id, { isDefault: true });
  }

  defaultOrFirst(): ApplyProfile | undefined {
    const list = this.items();
    return list.find((p) => p.isDefault) ?? list[0];
  }
}
