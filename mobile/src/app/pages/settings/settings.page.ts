import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AccountPage } from '../account/account.page';
import { LanguagePage } from '../language/language.page';
import { PreferencesPage } from '../preferences/preferences.page';
import { SavedJobsPage } from '../saved-jobs/saved-jobs.page';

export type SettingsTab = 'language' | 'preferences' | 'account' | 'saved';

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
    TranslatePipe,
    LanguagePage,
    PreferencesPage,
    AccountPage,
    SavedJobsPage,
  ],
})
export class SettingsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly tab = signal<SettingsTab>('preferences');

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
    if (
      raw === 'language' ||
      raw === 'preferences' ||
      raw === 'account' ||
      raw === 'saved'
    ) {
      return raw;
    }
    return 'preferences';
  }
}
