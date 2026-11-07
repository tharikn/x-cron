import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { TrackingService } from '../../core/services/tracking.service';
import { LocaleService } from '../../core/services/locale.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { SeekerService } from '../../core/services/seeker.service';
import { ViewedJobsService } from '../../core/services/viewed-jobs.service';
import { JobCardComponent } from '../../shared/job-card/job-card.component';
import { LocationTypeaheadComponent } from '../../shared/location-typeahead/location-typeahead.component';
import { JobListSkeletonComponent } from '../../shared/skeleton/job-list-skeleton.component';

const PAGE_SIZE = 8;

export interface FilterChip {
  key: string;
  label: string;
}

const EMPTY_QUERY: JobSearchQuery = {
  keyword: '',
  locationText: '',
  jobType: '',
  category: '',
  language: '',
  skills: '',
  salaryMin: null,
  remote: null,
  postedWithin: '',
  nearLat: null,
  nearLng: null,
  radiusKm: null,
  walkInOnly: null,
  verifiedEmployer: null,
  fresher: null,
  easyApply: null,
  sort: 'newest',
};

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
    IonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    JobCardComponent,
    LocationTypeaheadComponent,
    TranslatePipe,
    JobListSkeletonComponent,
  ],
})
export class DiscoverPage implements OnInit {
  private readonly jobsService = inject(JobsService);
  private readonly tracking = inject(TrackingService);
  private readonly preferencesService = inject(PreferencesService);
  private readonly toastController = inject(ToastController);
  private readonly locale = inject(LocaleService);
  private readonly auth = inject(AuthService);
  private readonly seeker = inject(SeekerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly viewed = inject(ViewedJobsService);

  readonly languages = this.locale.languages;
  readonly isSignedIn = this.auth.isSignedIn;

  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<
    [JobType, string]
  >;
  readonly categories = signal<string[]>([]);
  readonly results = signal<Job[]>([]);
  readonly feedJobs = signal<Job[]>([]);
  readonly total = signal(0);
  readonly nextCursor = signal<string | undefined>(undefined);
  readonly loadingMore = signal(false);
  readonly loading = this.jobsService.loading;
  readonly usingApi = this.jobsService.usingApi;
  readonly lastError = this.jobsService.lastError;
  readonly filterChips = signal<FilterChip[]>([]);

  readonly query = signal<JobSearchQuery>({ ...EMPTY_QUERY });
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
  private syncingFromUrl = false;
  private skipNextUrlWrite = false;

  constructor() {
    addIcons({ locationOutline, navigateOutline });

    effect(() => {
      const current = this.query();
      this.refreshChips(current);
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
      }
      this.refreshTimer = setTimeout(() => {
        void this.refresh(current);
        if (!this.skipNextUrlWrite) {
          void this.writeUrl(current);
        }
        this.skipNextUrlWrite = false;
      }, 200);
    });
  }

  async ngOnInit(): Promise<void> {
    this.categories.set(await this.jobsService.categories());

    const params = this.route.snapshot.queryParamMap;
    const hasFilterParams = this.hasDiscoveryParams(params);
    if (hasFilterParams) {
      this.skipNextUrlWrite = true;
      this.query.set(this.queryFromParams(params));
    } else {
      const prefs = this.preferencesService.preferences();
      this.query.update((q) => ({
        ...q,
        locationText: prefs.locations[0] || q.locationText,
        salaryMin: prefs.salaryMin ?? q.salaryMin,
        remote: prefs.remotePreferred ? true : q.remote,
        sort: prefs.sort || q.sort,
      }));
    }

    if (this.auth.isSignedIn()) {
      void this.loadFeed();
    }

    this.route.queryParamMap.subscribe((map) => {
      if (this.syncingFromUrl) return;
      if (!this.hasDiscoveryParams(map)) return;
      this.skipNextUrlWrite = true;
      this.query.set(this.queryFromParams(map));
    });
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

  onSkills(value: string | null | undefined): void {
    this.query.update((q) => ({ ...q, skills: value ?? '' }));
  }

  onSalaryMin(value: string | number | null | undefined): void {
    const n = value === '' || value == null ? null : Number(value);
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

  onVerified(enabled: boolean): void {
    this.query.update((q) => ({
      ...q,
      verifiedEmployer: enabled ? true : null,
    }));
  }

  onFresher(enabled: boolean): void {
    this.query.update((q) => ({ ...q, fresher: enabled ? true : null }));
  }

  onEasyApply(enabled: boolean): void {
    this.query.update((q) => ({ ...q, easyApply: enabled ? true : null }));
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

  dismissChip(key: string): void {
    this.query.update((q) => {
      const next = { ...q };
      switch (key) {
        case 'keyword':
          next.keyword = '';
          break;
        case 'location':
          next.locationText = '';
          break;
        case 'jobType':
          next.jobType = '';
          break;
        case 'category':
          next.category = '';
          break;
        case 'language':
          next.language = '';
          break;
        case 'skills':
          next.skills = '';
          break;
        case 'salaryMin':
          next.salaryMin = null;
          break;
        case 'remote':
          next.remote = null;
          break;
        case 'postedWithin':
          next.postedWithin = '';
          break;
        case 'walkInOnly':
          next.walkInOnly = null;
          break;
        case 'verifiedEmployer':
          next.verifiedEmployer = null;
          break;
        case 'fresher':
          next.fresher = null;
          break;
        case 'easyApply':
          next.easyApply = null;
          break;
        case 'nearby':
          next.nearLat = null;
          next.nearLng = null;
          next.radiusKm = null;
          if (next.sort === 'distance') next.sort = 'newest';
          break;
        case 'sort':
          next.sort = 'newest';
          break;
        default:
          break;
      }
      return next;
    });
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
          skills: q.skills || undefined,
          salaryMin: q.salaryMin ?? null,
          remote: q.remote ?? null,
          radiusKm: q.radiusKm ?? null,
          nearLat: q.nearLat ?? null,
          nearLng: q.nearLng ?? null,
          walkInOnly: q.walkInOnly ?? null,
          postedWithin: q.postedWithin || null,
          verifiedEmployer: q.verifiedEmployer ?? null,
          fresher: q.fresher ?? null,
          easyApply: q.easyApply ?? null,
          sort: q.sort,
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

  /** Clear filters only — does not wipe PreferencesService. */
  async clearFilters(): Promise<void> {
    this.query.set({ ...EMPTY_QUERY });
    await this.showToast('Filters cleared.');
  }

  async clearPreferences(): Promise<void> {
    await this.preferencesService.clear();
    this.query.set({ ...EMPTY_QUERY });
    await this.showToast('Preferences cleared.');
  }

  private async loadFeed(): Promise<void> {
    try {
      const items = await this.seeker.loadFeed();
      this.feedJobs.set(items.slice(0, 6));
    } catch {
      this.feedJobs.set([]);
    }
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
    this.tracking.trackSearch({
      keyword: query.keyword,
      location: query.locationText,
    });
    const res = await this.jobsService.search({ ...query, limit: PAGE_SIZE });
    if (token !== this.refreshToken) return;
    this.results.set(res.items);
    this.total.set(res.total);
    this.nextCursor.set(res.nextCursor);
  }

  private refreshChips(q: JobSearchQuery): void {
    const chips: FilterChip[] = [];
    if (q.keyword?.trim()) {
      chips.push({ key: 'keyword', label: `“${q.keyword.trim()}”` });
    }
    if (q.locationText?.trim()) {
      chips.push({ key: 'location', label: q.locationText.trim() });
    }
    if (q.jobType) {
      chips.push({
        key: 'jobType',
        label: JOB_TYPE_LABELS[q.jobType as JobType] || q.jobType,
      });
    }
    if (q.category?.trim()) {
      chips.push({ key: 'category', label: q.category.trim() });
    }
    if (q.language?.trim()) {
      chips.push({
        key: 'language',
        label: this.locale.label(q.language.trim()),
      });
    }
    if (q.skills?.trim()) {
      chips.push({ key: 'skills', label: `Skills: ${q.skills.trim()}` });
    }
    if (q.salaryMin != null) {
      chips.push({
        key: 'salaryMin',
        label: `Min ₹${q.salaryMin.toLocaleString('en-IN')}`,
      });
    }
    if (q.remote) chips.push({ key: 'remote', label: 'Remote' });
    if (q.postedWithin) {
      chips.push({
        key: 'postedWithin',
        label:
          q.postedWithin === '1d'
            ? 'Last 24h'
            : q.postedWithin === '7d'
              ? 'Last 7 days'
              : 'Last 30 days',
      });
    }
    if (q.walkInOnly) chips.push({ key: 'walkInOnly', label: 'Walk-in' });
    if (q.verifiedEmployer) {
      chips.push({ key: 'verifiedEmployer', label: 'Verified' });
    }
    if (q.fresher) chips.push({ key: 'fresher', label: 'Fresher' });
    if (q.easyApply) chips.push({ key: 'easyApply', label: 'Easy apply' });
    if (q.nearLat != null) chips.push({ key: 'nearby', label: 'Near me' });
    if (q.sort && q.sort !== 'newest') {
      chips.push({ key: 'sort', label: q.sort });
    }
    this.filterChips.set(chips);
  }

  private hasDiscoveryParams(params: {
    has(name: string): boolean;
  }): boolean {
    return [
      'q',
      'keyword',
      'location',
      'jobType',
      'category',
      'language',
      'skills',
      'salaryMin',
      'remote',
      'postedWithin',
      'walkInOnly',
      'verifiedEmployer',
      'fresher',
      'easyApply',
      'sort',
      'nearLat',
      'nearLng',
      'radiusKm',
    ].some((k) => params.has(k));
  }

  private queryFromParams(params: {
    get(name: string): string | null;
  }): JobSearchQuery {
    const sort = params.get('sort');
    const posted = params.get('postedWithin');
    const salaryRaw = params.get('salaryMin');
    const nearLat = params.get('nearLat');
    const nearLng = params.get('nearLng');
    const radiusKm = params.get('radiusKm');
    return {
      ...EMPTY_QUERY,
      keyword: params.get('q')?.trim() || params.get('keyword')?.trim() || '',
      locationText: params.get('location')?.trim() || '',
      jobType: (params.get('jobType')?.trim() || '') as JobType | '',
      category: params.get('category')?.trim() || '',
      language: params.get('language')?.trim() || '',
      skills: params.get('skills')?.trim() || '',
      salaryMin:
        salaryRaw != null && salaryRaw !== '' && Number.isFinite(Number(salaryRaw))
          ? Number(salaryRaw)
          : null,
      remote:
        params.get('remote') === 'true' || params.get('remote') === '1'
          ? true
          : null,
      postedWithin:
        posted === '1d' || posted === '7d' || posted === '30d' ? posted : '',
      walkInOnly:
        params.get('walkInOnly') === 'true' || params.get('walkInOnly') === '1'
          ? true
          : null,
      verifiedEmployer:
        params.get('verifiedEmployer') === 'true' ||
        params.get('verifiedEmployer') === '1'
          ? true
          : null,
      fresher:
        params.get('fresher') === 'true' || params.get('fresher') === '1'
          ? true
          : null,
      easyApply:
        params.get('easyApply') === 'true' || params.get('easyApply') === '1'
          ? true
          : null,
      nearLat:
        nearLat != null && Number.isFinite(Number(nearLat))
          ? Number(nearLat)
          : null,
      nearLng:
        nearLng != null && Number.isFinite(Number(nearLng))
          ? Number(nearLng)
          : null,
      radiusKm:
        radiusKm != null && Number.isFinite(Number(radiusKm))
          ? Number(radiusKm)
          : null,
      sort:
        sort === 'newest' ||
        sort === 'oldest' ||
        sort === 'salary-desc' ||
        sort === 'salary-asc' ||
        sort === 'relevance' ||
        sort === 'distance'
          ? sort
          : 'newest',
    };
  }

  private async writeUrl(q: JobSearchQuery): Promise<void> {
    const queryParams: Record<string, string | null> = {
      q: q.keyword?.trim() || null,
      keyword: null,
      location: q.locationText?.trim() || null,
      jobType: q.jobType || null,
      category: q.category?.trim() || null,
      language: q.language?.trim() || null,
      skills: q.skills?.trim() || null,
      salaryMin: q.salaryMin != null ? String(q.salaryMin) : null,
      remote: q.remote ? 'true' : null,
      postedWithin: q.postedWithin || null,
      walkInOnly: q.walkInOnly ? 'true' : null,
      verifiedEmployer: q.verifiedEmployer ? 'true' : null,
      fresher: q.fresher ? 'true' : null,
      easyApply: q.easyApply ? 'true' : null,
      nearLat: q.nearLat != null ? String(q.nearLat) : null,
      nearLng: q.nearLng != null ? String(q.nearLng) : null,
      radiusKm: q.radiusKm != null ? String(q.radiusKm) : null,
      sort: q.sort !== 'newest' ? q.sort : null,
    };
    this.syncingFromUrl = true;
    try {
      await this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    } finally {
      this.syncingFromUrl = false;
    }
  }
}
