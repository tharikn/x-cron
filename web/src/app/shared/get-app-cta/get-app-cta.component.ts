import { Component, input } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-get-app-cta',
  imports: [TranslatePipe],
  templateUrl: './get-app-cta.component.html',
  styleUrl: './get-app-cta.component.scss',
})
export class GetAppCtaComponent {
  /** `panel` = home highlighter · `band` = footer strip · `link` = drawer row */
  readonly variant = input<'panel' | 'band' | 'link'>('panel');

  readonly apkUrl = environment.androidApkUrl;
  readonly version = environment.androidApkVersion;
  readonly sizeLabel = environment.androidApkSizeLabel;
  readonly fileName = 'xcron-jobs.apk';
}
