import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { LanguagePage } from '../language/language.page';
import { PreferencesPage } from '../preferences/preferences.page';
import { SavedJobsPage } from '../saved-jobs/saved-jobs.page';
import { ThemePage } from '../theme/theme.page';

export type SettingsTab = 'language' | 'theme' | 'preferences' | 'saved';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButton,
    RouterLink,
    TranslatePipe,
    LanguagePage,
    ThemePage,
    PreferencesPage,
    SavedJobsPage,
  ],
})
export class SettingsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isEmployer = this.auth.isEmployer;
  readonly tab = signal<SettingsTab>('language');

  constructor() {
    effect(() => {
      if (!this.auth.isSignedIn() && this.tab() !== 'language') {
        this.tab.set('language');
        void this.router.navigate(['/tabs/settings'], {
          queryParams: { tab: 'language' },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }
    });
  }

  ngOnInit(): void {
    const initial = this.readTab(this.route.snapshot.queryParamMap.get('tab'));
    this.tab.set(initial);
    this.route.queryParamMap.subscribe((params) => {
      this.tab.set(this.readTab(params.get('tab')));
    });
  }

  async onTabChange(value: string | number | undefined): Promise<void> {
    const next = this.readTab(value == null ? null : String(value));
    this.tab.set(next);
    await this.router.navigate(['/tabs/settings'], {
      queryParams: { tab: next },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private readTab(raw: string | null): SettingsTab {
    if (raw === 'account') {
      void this.router.navigate(['/tabs/account'], {
        queryParamsHandling: 'preserve',
        replaceUrl: true,
      });
      return this.auth.isSignedIn() ? 'preferences' : 'language';
    }
    if (raw === 'theme' || raw === 'preferences' || raw === 'saved') {
      if (!this.auth.isSignedIn()) {
        void this.router.navigate(['/tabs/account'], {
          queryParams: {
            returnUrl: `/tabs/settings?tab=${raw}`,
          },
          replaceUrl: true,
        });
        return 'language';
      }
      // Saved jobs are seeker-only — recruiters use Account → Activity.
      if (raw === 'saved' && this.auth.isEmployer()) return 'preferences';
      return raw;
    }
    if (raw === 'language') return 'language';
    return this.auth.isSignedIn() ? 'preferences' : 'language';
  }
}
