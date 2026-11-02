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
}

const DISMISS_KEY = 'xcron.appUpdate.dismissedVersionCode';

@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private readonly http = inject(HttpClient);
  private readonly alerts = inject(AlertController);
  private checking = false;

  /** Native-only: compare installed build to hosted version.json and prompt if newer. */
  async checkForUpdate(): Promise<void> {
    if (!Capacitor.isNativePlatform() || this.checking) return;
    if (!environment.appUpdateManifestUrl) return;

    this.checking = true;
    try {
      const manifest = await this.fetchManifest();
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
      // optional — offline / CDN miss should not block app start
    } finally {
      this.checking = false;
    }
  }

  private async fetchManifest(): Promise<AppUpdateManifest | null> {
    const url = `${environment.appUpdateManifestUrl}${
      environment.appUpdateManifestUrl.includes('?') ? '&' : '?'
    }t=${Date.now()}`;
    return firstValueFrom(this.http.get<AppUpdateManifest>(url));
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
