import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { RouteEnterDirective } from '../../shared/route-enter/route-enter.directive';

@Component({
  selector: 'app-settings-hub',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    RouteEnterDirective,
  ],
  templateUrl: './settings-hub.page.html',
  styleUrl: './settings-hub.page.scss',
})
export class SettingsHubPage implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);
  private readonly auth = inject(AuthService);

  readonly languageLabel = this.locale.languageLabel;
  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Settings',
      description: 'Language, preferences, and site config on X Cron Jobs.',
      path: '/settings',
      robots: 'noindex,follow',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
  }
}
