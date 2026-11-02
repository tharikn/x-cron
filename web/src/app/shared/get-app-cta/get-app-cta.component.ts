import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { ApkReleasesService } from '../../core/services/apk-releases.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-get-app-cta',
  imports: [TranslatePipe],
  templateUrl: './get-app-cta.component.html',
  styleUrl: './get-app-cta.component.scss',
  providers: [DatePipe],
})
export class GetAppCtaComponent implements OnInit {
  /** `panel` = home highlighter · `band` = footer strip · `link` = drawer row */
  readonly variant = input<'panel' | 'band' | 'link'>('panel');

  private readonly apkReleases = inject(ApkReleasesService);
  private readonly datePipe = inject(DatePipe);

  /** Fallback until GitHub Releases load (or if none published yet). */
  readonly fallbackApkUrl = environment.androidApkUrl;
  readonly fallbackVersion = environment.androidApkVersion;
  readonly fallbackSizeLabel = environment.androidApkSizeLabel;

  readonly latest = this.apkReleases.latest;
  readonly loading = this.apkReleases.loading;
  readonly error = this.apkReleases.error;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;
    void this.apkReleases.loadLatest();
  }

  apkUrl(): string {
    return this.latest()?.apkUrl || this.fallbackApkUrl;
  }

  versionLabel(): string {
    return this.latest()?.versionName || this.fallbackVersion;
  }

  sizeLabel(): string {
    return this.latest()?.sizeLabel || this.fallbackSizeLabel;
  }

  /** Date + time of the latest GitHub Release publish. */
  publishedLabel(): string | null {
    const iso = this.latest()?.publishedAt;
    if (!iso) return null;
    return this.datePipe.transform(iso, 'medium') || null;
  }
}
