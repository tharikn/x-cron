import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { ApkReleasesService } from '../../core/services/apk-releases.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-get-app-cta',
  imports: [TranslatePipe, DatePipe],
  templateUrl: './get-app-cta.component.html',
  styleUrl: './get-app-cta.component.scss',
})
export class GetAppCtaComponent implements OnInit {
  /** `panel` = home highlighter · `band` = footer strip · `link` = drawer row */
  readonly variant = input<'panel' | 'band' | 'link'>('panel');

  private readonly apkReleases = inject(ApkReleasesService);

  /** Fallback until GitHub Releases load (or if none published yet). */
  readonly fallbackApkUrl = environment.androidApkUrl;
  readonly fallbackVersion = environment.androidApkVersion;
  readonly fallbackSizeLabel = environment.androidApkSizeLabel;
  readonly releasesUrl = `https://github.com/${environment.githubRepo}/releases`;

  readonly latest = this.apkReleases.latest;
  readonly releases = this.apkReleases.releases;
  readonly loading = this.apkReleases.loading;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;
    void this.apkReleases.load();
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
}
