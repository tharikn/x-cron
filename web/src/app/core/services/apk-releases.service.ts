import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApkReleaseRow {
  tag: string;
  versionName: string;
  versionCode: number | null;
  apkUrl: string;
  sizeLabel: string;
  notes: string;
  publishedAt: string;
}

interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface GitHubRelease {
  tag_name: string;
  name: string | null;
  body: string | null;
  published_at: string;
  draft: boolean;
  prerelease: boolean;
  assets: GitHubReleaseAsset[];
}

const MANIFEST_FENCE = /```xcron-manifest\s*([\s\S]*?)```/;

@Injectable({ providedIn: 'root' })
export class ApkReleasesService {
  private readonly http = inject(HttpClient);

  readonly releases = signal<ApkReleaseRow[]>([]);
  readonly latest = signal<ApkReleaseRow | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /** Home / CTA: latest release only (no version history fetch). */
  async loadLatest(): Promise<void> {
    if (!environment.androidReleasesApiUrl) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const url = `${environment.androidReleasesApiUrl}/latest?t=${Date.now()}`;
      const release = await firstValueFrom(
        this.http.get<GitHubRelease>(url, {
          headers: { Accept: 'application/vnd.github+json' },
        }),
      );
      if (release?.draft || release?.prerelease) {
        this.latest.set(null);
        return;
      }
      const row = this.toRow(release);
      this.latest.set(row);
    } catch {
      this.error.set('Could not load latest release');
      this.latest.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  /** Full history — for a future versions page / accordion, not the home panel. */
  async load(limit = 12): Promise<void> {
    if (!environment.androidReleasesApiUrl) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const url = `${environment.androidReleasesApiUrl}?per_page=${limit}&t=${Date.now()}`;
      const rows = await firstValueFrom(
        this.http.get<GitHubRelease[]>(url, {
          headers: { Accept: 'application/vnd.github+json' },
        }),
      );
      const mapped = (rows ?? [])
        .filter((r) => !r.draft && !r.prerelease)
        .map((r) => this.toRow(r))
        .filter((r): r is ApkReleaseRow => !!r);
      this.releases.set(mapped);
      this.latest.set(mapped[0] ?? null);
    } catch {
      this.error.set('Could not load releases');
      this.releases.set([]);
      this.latest.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  private toRow(release: GitHubRelease): ApkReleaseRow | null {
    const apk = release.assets?.find((a) => a.name === 'xcron-jobs.apk');
    if (!apk?.browser_download_url) return null;

    let versionCode: number | null = null;
    let versionName = release.tag_name.replace(/^v/i, '');
    let notes = '';
    // Always prefer GitHub asset byte size so the UI matches the file users download.
    const sizeLabel = `~${(apk.size / (1024 * 1024)).toFixed(1)} MB`;

    const fence = MANIFEST_FENCE.exec(release.body ?? '');
    if (fence?.[1]) {
      try {
        const manifest = JSON.parse(fence[1].trim()) as {
          versionCode?: number;
          versionName?: string;
          notes?: string;
        };
        if (Number.isFinite(Number(manifest.versionCode))) {
          versionCode = Number(manifest.versionCode);
        }
        if (manifest.versionName) versionName = manifest.versionName;
        if (manifest.notes) notes = String(manifest.notes);
      } catch {
        // ignore bad fence
      }
    }

    if (!notes) {
      notes = (release.body ?? '')
        .replace(MANIFEST_FENCE, '')
        .replace(/^## Release notes\s*/m, '')
        .trim()
        .slice(0, 180);
    }

    return {
      tag: release.tag_name,
      versionName,
      versionCode,
      apkUrl: apk.browser_download_url,
      sizeLabel,
      notes,
      publishedAt: release.published_at,
    };
  }
}
