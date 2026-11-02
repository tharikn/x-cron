import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AppUpdateManifest {
  versionCode: number;
  versionName: string;
  apkUrl: string;
  apkPath?: string;
  sizeLabel?: string;
  minVersionCode?: number;
  notes?: string;
  releasedAt?: string;
  tag?: string;
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
  assets: GitHubReleaseAsset[];
}

const DISMISS_KEY = 'xcron.appUpdate.dismissedVersionCode';
const MANIFEST_FENCE = /```xcron-manifest\s*([\s\S]*?)```/;

@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private readonly http = inject(HttpClient);
  private readonly alerts = inject(AlertController);
  private checking = false;

  /** Native-only: compare installed build to latest GitHub Release and prompt if newer. */
  async checkForUpdate(): Promise<void> {
    if (!Capacitor.isNativePlatform() || this.checking) return;
    if (!environment.githubReleasesLatestUrl) return;

    this.checking = true;
    try {
      const manifest = await this.fetchLatestManifest();
      if (!manifest?.versionCode || !manifest.apkUrl) return;

      const info = await App.getInfo();
      const installedCode = Number.parseInt(info.build, 10);
      if (!Number.isFinite(installedCode)) return;

      const required = Number(manifest.minVersionCode ?? 1);
      const forced = installedCode < required;
      if (installedCode >= manifest.versionCode) return;
      if (!forced && this.dismissedCode() >= manifest.versionCode) return;

      await this.prompt(manifest, installedCode, forced);
    } catch {
      // optional — offline / API miss should not block app start
    } finally {
      this.checking = false;
    }
  }

  private async fetchLatestManifest(): Promise<AppUpdateManifest | null> {
    const url = `${environment.githubReleasesLatestUrl}${
      environment.githubReleasesLatestUrl.includes('?') ? '&' : '?'
    }t=${Date.now()}`;
    const release = await firstValueFrom(
      this.http.get<GitHubRelease>(url, {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      }),
    );
    return this.manifestFromRelease(release);
  }

  /** Shared parser for latest + version list UIs. */
  manifestFromRelease(release: GitHubRelease): AppUpdateManifest | null {
    const apk = release.assets?.find((a) => a.name === 'xcron-jobs.apk');
    const fromFence = this.parseFence(release.body ?? '');
    const versionName =
      fromFence?.versionName ||
      release.tag_name?.replace(/^v/i, '') ||
      release.name ||
      '';
    const versionCode = Number(fromFence?.versionCode);
    if (!Number.isFinite(versionCode) || versionCode < 1) return null;

    const apkUrl =
      fromFence?.apkUrl ||
      apk?.browser_download_url ||
      (release.tag_name
        ? `https://github.com/${environment.githubRepo}/releases/download/${release.tag_name}/xcron-jobs.apk`
        : '');
    if (!apkUrl) return null;

    const sizeLabel =
      fromFence?.sizeLabel ||
      (apk?.size ? `~${(apk.size / (1024 * 1024)).toFixed(1)} MB` : undefined);

    return {
      versionCode,
      versionName,
      apkUrl,
      sizeLabel,
      minVersionCode: fromFence?.minVersionCode ?? 1,
      notes: this.humanNotes(release.body ?? '', fromFence?.notes),
      releasedAt: fromFence?.releasedAt || release.published_at,
      tag: release.tag_name,
    };
  }

  private parseFence(body: string): AppUpdateManifest | null {
    const match = MANIFEST_FENCE.exec(body);
    if (!match?.[1]) return null;
    try {
      return JSON.parse(match[1].trim()) as AppUpdateManifest;
    } catch {
      return null;
    }
  }

  private humanNotes(body: string, fallback?: string): string | undefined {
    const stripped = body.replace(MANIFEST_FENCE, '').replace(/^## Release notes\s*/m, '').trim();
    if (stripped) return stripped.slice(0, 500);
    return fallback;
  }

  private dismissedCode(): number {
    const raw = localStorage.getItem(DISMISS_KEY);
    const n = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  }

  private async prompt(
    manifest: AppUpdateManifest,
    installedCode: number,
    forced: boolean,
  ): Promise<void> {
    const size = manifest.sizeLabel ? ` · ${manifest.sizeLabel}` : '';
    const notes = manifest.notes?.trim() ? `\n\n${manifest.notes.trim()}` : '';
    const buttons = [
      ...(forced
        ? []
        : [
            {
              text: 'Later',
              role: 'cancel',
              handler: () => {
                localStorage.setItem(DISMISS_KEY, String(manifest.versionCode));
              },
            },
          ]),
      {
        text: 'Update',
        handler: () => {
          this.openApk(manifest.apkUrl);
        },
      },
    ];

    const alert = await this.alerts.create({
      header: forced ? 'Update required' : 'Update available',
      message: `X Cron ${manifest.versionName} is ready (you have build ${installedCode})${size}.${notes}`,
      backdropDismiss: !forced,
      buttons,
    });
    await alert.present();
  }

  private openApk(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
