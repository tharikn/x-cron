import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface JobAsset {
  id: string;
  ownerUserId: string;
  purpose: 'company-logo' | 'profile-photo' | 'resume';
  storageAssetId: string;
  url: string;
  originalName: string;
  createdAt: string;
}

/** Isolated job-portal asset transport for logos, photos and private CVs. */
@Injectable({ providedIn: 'root' })
export class JobAssetsApiService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = `${environment.apiUrl}/job-assets`;

  uploadImage(file: File, purpose: 'company-logo' | 'profile-photo'): Promise<JobAsset> {
    const body = new FormData();
    body.append('file', file, file.name);
    body.append('purpose', purpose);
    return firstValueFrom(
      this.http.post<JobAsset>(`${this.base}/images`, body, {
        headers: this.auth.authHeaders(),
        withCredentials: true,
      }),
    );
  }

  uploadResume(file: File): Promise<JobAsset> {
    const body = new FormData();
    body.append('file', file, file.name);
    return firstValueFrom(
      this.http.post<JobAsset>(`${this.base}/resumes`, body, {
        headers: this.auth.authHeaders(),
        withCredentials: true,
      }),
    );
  }

  list(): Promise<JobAsset[]> {
    return firstValueFrom(
      this.http.get<{ items: JobAsset[] }>(this.base, {
        headers: this.auth.authHeaders(),
        withCredentials: true,
      }),
    ).then((res) => res.items ?? []);
  }

  delete(assetId: string): Promise<{ ok: boolean }> {
    return firstValueFrom(
      this.http.delete<{ ok: boolean }>(
        `${this.base}/${encodeURIComponent(assetId)}`,
        { headers: this.auth.authHeaders(), withCredentials: true },
      ),
    );
  }
}
