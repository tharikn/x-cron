import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import {
  ThemePreference,
  ThemeService,
} from '../../core/services/theme.service';

@Component({
  selector: 'app-theme',
  imports: [TranslatePipe],
  templateUrl: './theme.page.html',
  styleUrl: './theme.page.scss',
})
export class ThemePage implements OnInit {
  private readonly theme = inject(ThemeService);
  private readonly auth = inject(AuthService);
  private readonly locale = inject(LocaleService);
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);

  readonly preference = this.theme.preference;
  readonly options: ThemePreference[] = ['system', 'light', 'dark', 'warm'];

  async ngOnInit(): Promise<void> {
    if (!this.auth.isSignedIn()) {
      await this.router.navigate(['/sign-in'], {
        queryParams: { returnUrl: '/settings/theme' },
        replaceUrl: true,
      });
      return;
    }
    this.seo.setPage({
      title: 'Theme',
      description: 'Choose light, dark, warm, or system theme on X Cron Jobs.',
      path: '/settings/theme',
      robots: 'noindex,follow',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
  }

  async select(pref: ThemePreference): Promise<void> {
    await this.theme.setPreference(pref);
  }

  labelKey(pref: ThemePreference): string {
    return this.theme.labelKey(pref);
  }

  hintKey(pref: ThemePreference): string {
    return this.theme.hintKey(pref);
  }
}
