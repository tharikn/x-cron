import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem,
  IonList,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { locationOutline, navigateOutline } from 'ionicons/icons';
import type { Job, JobSearchQuery, JobType } from '../../core/models/job.model';
import { JOB_TYPE_LABELS } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { SeekerService } from '../../core/services/seeker.service';
import { ViewedJobsService } from '../../core/services/viewed-jobs.service';
import { JobCardComponent } from '../../shared/job-card/job-card.component';
import { LocationTypeaheadComponent } from '../../shared/location-typeahead/location-typeahead.component';

const PAGE_SIZE = 8;

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  imports: [
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToggle,
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
  private readonly toastController = inject(ToastController);
  private readonly locale = inject(LocaleService);
  private readonly auth = inject(AuthService);
  private readonly seeker = inject(SeekerService);
  readonly viewed = inject(ViewedJobsService);

  readonly languages = this.locale.languages;

  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<[JobType, string]>;
  readonly categories = signal<string[]>([]);
  readonly results = signal<Job[]>([]);
  readonly total = signal(0);
  readonly nextCursor = signal<string | undefined>(undefined);
  readonly loadingMore = signal(false);
  readonly loading = this.jobsService.loading;
  readonly usingApi = this.jobsService.usingApi;
  readonly lastError = this.jobsService.lastError;

  readonly query = signal<JobSearchQuery>({
    keyword: '',
    locationText: '',
    jobType: '',
    category: '',
    language: '',
    salaryMin: null,
    remote: null,
    postedWithin: '',
    nearLat: null,
    nearLng: null,
    radiusKm: null,
    walkInOnly: null,
    sort: 'newest',
  });
  readonly nearbyActive = computed(
    () => this.query().nearLat != null && this.query().nearLng != null,
  );

  readonly showPrefPrompt = computed(() =>
    this.preferencesService.shouldShowPrompt(this.jobsService.searchCount()),
  );
  readonly savedPrefs = this.preferencesService.preferences;
  readonly staggerIndex = (index: number) => index % PAGE_SIZE;

  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private refreshToken = 0;

  constructor() {
    addIcons({ locationOutline, navigateOutline });
    const prefs = this.preferencesService.preferences();
    if (prefs.locations[0]) {
      this.query.update((q) => ({ ...q, locationText: prefs.locations[0] }));
    }
    if (prefs.salaryMin != null) {
      this.query.update((q) => ({ ...q, salaryMin: prefs.salaryMin ?? null }));
    }
    if (prefs.remotePreferred) {
      this.query.update((q) => ({ ...q, remote: true }));
    }
    if (prefs.sort) {
      this.query.update((q) => ({ ...q, sort: prefs.sort! }));
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

  onSalaryMin(value: string | number | null | undefined): void {
    const n =
      value === '' || value == null ? null : Number(value);
    this.query.update((q) => ({
      ...q,
      salaryMin: Number.isFinite(n as number) ? (n as number) : null,
    }));
  }

  onPostedWithin(value: JobSearchQuery['postedWithin']): void {
    this.query.update((q) => ({ ...q, postedWithin: value || '' }));
  }

  onRemote(enabled: boolean): void {
    this.query.update((q) => ({ ...q, remote: enabled ? true : null }));
  }

  onWalkInOnly(enabled: boolean): void {
    this.query.update((q) => ({ ...q, walkInOnly: enabled ? true : null }));
  }

  onRadiusKm(value: string | number | null | undefined): void {
    const n = value === '' || value == null ? null : Number(value);
    this.query.update((q) => ({
      ...q,
      radiusKm: Number.isFinite(n as number) ? (n as number) : 25,
    }));
  }

  async useNearby(): Promise<void> {
    if (!navigator.geolocation) {
      await this.showToast('Location is not available on this device.');
      return;
    }
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 12000,
        });
      });
      this.query.update((q) => ({
        ...q,
        nearLat: pos.coords.latitude,
        nearLng: pos.coords.longitude,
        radiusKm: q.radiusKm ?? 25,
        sort: 'distance',
      }));
      await this.showToast('Showing jobs near you.');
    } catch {
      await this.showToast('Could not get your location. Allow location access.');
    }
  }

  clearNearby(): void {
    this.query.update((q) => ({
      ...q,
      nearLat: null,
      nearLng: null,
      radiusKm: null,
      sort: q.sort === 'distance' ? 'newest' : q.sort,
    }));
  }

  async saveCurrentSearch(): Promise<void> {
    if (!this.auth.isSignedIn()) {
      await this.showToast('Sign in to save this search.');
      return;
    }
    const q = this.query();
    const nameParts = [
      q.keyword?.trim(),
      q.locationText?.trim(),
      q.jobType || '',
      q.category || '',
    ].filter(Boolean);
    try {
      await this.seeker.createSavedSearch({
        name: nameParts.join(' · ') || 'My search',
        alertEnabled: true,
        query: {
          keyword: q.keyword || undefined,
          location: q.locationText || undefined,
          jobType: q.jobType || undefined,
          category: q.category || undefined,
          language: q.language || undefined,
          salaryMin: q.salaryMin ?? null,
          remote: q.remote ?? null,
          radiusKm: q.radiusKm ?? null,
          nearLat: q.nearLat ?? null,
          nearLng: q.nearLng ?? null,
          walkInOnly: q.walkInOnly ?? null,
          postedWithin: q.postedWithin || null,
        },
      });
      await this.showToast('Search saved with alerts on.');
    } catch {
      await this.showToast('Could not save search.');
    }
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

  async clearPreferences(): Promise<void> {
    this.query.set({
      keyword: '',
      locationText: '',
      jobType: '',
      category: '',
      language: '',
      salaryMin: null,
      remote: null,
      postedWithin: '',
      nearLat: null,
      nearLng: null,
      radiusKm: null,
      walkInOnly: null,
      sort: 'newest',
    });
    await this.preferencesService.clear();
    await this.showToast('Preferences cleared.');
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'dark',
    });
    await toast.present();
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
    this.total.set(0);
    this.loadingMore.set(false);
    const res = await this.jobsService.search({ ...query, limit: PAGE_SIZE });
    if (token !== this.refreshToken) return;
    this.results.set(res.items);
    this.total.set(res.total);
    this.nextCursor.set(res.nextCursor);
  }
}
