import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';
import type { Job, JobSearchQuery, JobType } from '../../core/models/job.model';
import { JOB_TYPE_LABELS } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AdsService } from '../../core/services/ads.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { JobCardComponent } from '../../shared/job-card/job-card.component';
import { LocationTypeaheadComponent } from '../../shared/location-typeahead/location-typeahead.component';

const PAGE_SIZE = 8;

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    JobCardComponent,
    LocationTypeaheadComponent,
    TranslatePipe,
  ],
})
export class DiscoverPage implements OnInit {
  private readonly jobsService = inject(JobsService);
  private readonly preferencesService = inject(PreferencesService);
  private readonly ads = inject(AdsService);
  private readonly toastController = inject(ToastController);
  private readonly locale = inject(LocaleService);

  readonly languages = this.locale.languages;

  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<[JobType, string]>;
  readonly categories = signal<string[]>([]);
  readonly results = signal<Job[]>([]);
  readonly nextCursor = signal<string | undefined>(undefined);
  readonly loadingMore = signal(false);
  readonly loading = this.jobsService.loading;
  readonly usingApi = this.jobsService.usingApi;
  readonly lastError = this.jobsService.lastError;

  readonly query = signal<JobSearchQuery>({
    keyword: '',
    locationText: 'Palani',
    jobType: '',
    category: '',
    language: '',
    salaryMin: null,
    sort: 'newest',
  });

  readonly showPrefPrompt = computed(() =>
    this.preferencesService.shouldShowPrompt(this.jobsService.searchCount()),
  );
  readonly savedPrefs = this.preferencesService.preferences;
  readonly discoverAd = this.ads.discoverAd;
  readonly staggerIndex = (index: number) => index % PAGE_SIZE;

  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private refreshToken = 0;

  constructor() {
    addIcons({ locationOutline });
    const prefs = this.preferencesService.preferences();
    if (prefs.locations[0]) {
      this.query.update((q) => ({ ...q, locationText: prefs.locations[0] }));
    }

    effect(() => {
      const current = this.query();
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
      }
      this.refreshTimer = setTimeout(() => {
        void this.refresh(current);
      }, 200);
    });
  }

  async ngOnInit(): Promise<void> {
    this.categories.set(await this.jobsService.categories());
    await this.ads.loadSlot('discover_feed');
  }

  async onAdClick(): Promise<void> {
    const ad = this.discoverAd();
    if (!ad) return;
    await this.ads.recordEvent(ad.id, 'discover_feed', 'click');
  }

  onKeyword(value: string | null | undefined): void {
    this.query.update((q) => ({ ...q, keyword: value ?? '' }));
  }

  onLocation(value: string | null | undefined): void {
    this.query.update((q) => ({ ...q, locationText: value ?? '' }));
  }

  onSort(value: JobSearchQuery['sort']): void {
    this.query.update((q) => ({ ...q, sort: value }));
  }

  onJobType(value: JobType | ''): void {
    this.query.update((q) => ({ ...q, jobType: value }));
  }

  onCategory(value: string): void {
    this.query.update((q) => ({ ...q, category: value }));
  }

  onLanguage(value: string): void {
    this.query.update((q) => ({ ...q, language: value }));
  }

  async savePromptPreferences(): Promise<void> {
    const current = this.query();
    const location = current.locationText?.trim() ?? '';
    const category = current.category?.trim() ?? '';
    const language = current.language?.trim() ?? '';
    await this.preferencesService.save({
      locations: location ? [location] : [],
      jobTypes: current.jobType ? [current.jobType as JobType] : [],
      categories: category ? [category] : [],
      languages: language ? [language] : ['en', 'ta'],
    });
    this.preferencesService.dismissPrompt();
    const toast = await this.toastController.create({
      message: 'Preferences saved.',
      duration: 2000,
      position: 'bottom',
      color: 'dark',
    });
    await toast.present();
  }

  dismissPrompt(): void {
    this.preferencesService.dismissPrompt();
  }

  async loadMore(event: Event): Promise<void> {
    const target = event.target as HTMLIonInfiniteScrollElement | null;
    const cursor = this.nextCursor();
    if (!cursor || this.loading() || this.loadingMore()) {
      await target?.complete();
      return;
    }

    const token = this.refreshToken;
    this.loadingMore.set(true);
    try {
      const res = await this.jobsService.search(
        { ...this.query(), cursor, limit: PAGE_SIZE },
        { silent: true },
      );
      if (token !== this.refreshToken) return;
      this.results.update((current) => [...current, ...res.items]);
      this.nextCursor.set(res.nextCursor);
    } finally {
      this.loadingMore.set(false);
      await target?.complete();
    }
  }

  private async refresh(query: JobSearchQuery): Promise<void> {
    const token = ++this.refreshToken;
    this.nextCursor.set(undefined);
    this.loadingMore.set(false);
    const res = await this.jobsService.search({ ...query, limit: PAGE_SIZE });
    if (token !== this.refreshToken) return;
    this.results.set(res.items);
    this.nextCursor.set(res.nextCursor);
  }
}
