import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LocationTypeaheadComponent } from '../../core/components/location-typeahead/location-typeahead.component';
import type { Job } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { SeekerService } from '../../core/services/seeker.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { TrackingService } from '../../core/services/tracking.service';
import {
  formatJobType,
  formatLocation,
  formatPostedDate,
  formatSalary,
  jobPath,
} from '../../core/utils/format';
import { GetAppCtaComponent } from '../../shared/get-app-cta/get-app-cta.component';
import { JobListSkeletonComponent } from '../../shared/skeleton/job-list-skeleton.component';

const PAGE_SIZE = 8;

const SORT_OPTIONS = [
  { value: 'newest', labelKey: 'sort.newest' },
  { value: 'oldest', labelKey: 'sort.oldest' },
  { value: 'salary-desc', labelKey: 'sort.salaryDesc' },
  { value: 'salary-asc', labelKey: 'sort.salaryAsc' },
  { value: 'relevance', labelKey: 'sort.relevance' },
] as const;

const JOB_TYPES = [
  '',
  'full-time',
  'part-time',
  'contract',
  'temporary',
  'internship',
  'apprenticeship',
  'daily-wage',
] as const;

export interface FilterChip {
  key: string;
  label: string;
}

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    RouterLink,
    TranslatePipe,
    LocationTypeaheadComponent,
    GetAppCtaComponent,
    JobListSkeletonComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit, OnDestroy {
  private readonly jobsService = inject(JobsService);
  private readonly tracking = inject(TrackingService);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);
  private readonly preferences = inject(PreferencesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly seeker = inject(SeekerService);
  private readonly toast = inject(ToastService);

  private readonly loadMoreSentinel =
    viewChild<ElementRef<HTMLElement>>('loadMoreSentinel');
  private readonly sortField =
    viewChild<ElementRef<HTMLElement>>('sortField');
  private readonly observer =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              void this.loadMore();
            }
          },
          { root: null, rootMargin: '240px 0px', threshold: 0 },
        );

  readonly jobs = signal<Job[]>([]);
  readonly total = signal(0);
  readonly nextCursor = signal<string | undefined>(undefined);
  readonly loading = signal(true);
  readonly loadingMore = signal(false);
  readonly error = signal<string | null>(null);
  readonly sortOpen = signal(false);
  readonly sortOptions = SORT_OPTIONS;
  readonly jobTypes = JOB_TYPES;
  readonly isSignedIn = this.auth.isSignedIn;
  readonly savingSearch = signal(false);
  readonly filterChips = signal<FilterChip[]>([]);

  keyword = '';
  location = '';
  jobType = '';
  category = '';
  language = '';
  skills = '';
  salaryMin: number | null = null;
  remote = false;
  postedWithin: '' | '1d' | '7d' | '30d' = '';
  walkInOnly = false;
  verifiedEmployer = false;
  fresher = false;
  easyApply = false;
  sort: (typeof SORT_OPTIONS)[number]['value'] = 'newest';

  private syncingFromUrl = false;
  private categoriesCache: string[] = [];
  readonly categories = signal<string[]>([]);

  readonly formatLocation = formatLocation;
  readonly formatSalary = formatSalary;
  readonly formatJobType = formatJobType;
  readonly formatPostedDate = formatPostedDate;
  readonly jobPath = jobPath;
  readonly languageLabel = (code: string) => this.locale.label(code);
  readonly staggerIndex = (index: number) => index % PAGE_SIZE;

  constructor() {
    effect(() => {
      const el = this.loadMoreSentinel()?.nativeElement;
      this.observer?.disconnect();
      if (el && this.nextCursor()) {
        this.observer?.observe(el);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    const root = this.sortField()?.nativeElement;
    if (root && !root.contains(event.target as Node)) {
      this.sortOpen.set(false);
    }
  }

  sortLabelKey(): string {
    return (
      this.sortOptions.find((opt) => opt.value === this.sort)?.labelKey ??
      'sort.newest'
    );
  }

  toggleSort(event: MouseEvent): void {
    event.stopPropagation();
    this.sortOpen.update((open) => !open);
  }

  pickSort(value: (typeof SORT_OPTIONS)[number]['value']): void {
    this.sort = value;
    this.sortOpen.set(false);
  }

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'X Cron',
      description:
        'X Cron Jobs — local-first, multilingual job discovery for India. Browse without signing in.',
      path: '/',
    });
    try {
      this.categoriesCache = await this.jobsService.categories();
      this.categories.set(this.categoriesCache);
    } catch {
      this.categories.set([]);
    }

    const params = this.route.snapshot.queryParamMap;
    const hasFilterParams = [
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
    ].some((k) => params.has(k));

    if (hasFilterParams) {
      this.applyParams(params);
    } else {
      const savedLocation = this.preferences.prefs().locations[0]?.trim();
      if (savedLocation) {
        this.location = savedLocation;
      }
    }
    this.refreshChips();
    await this.search({ skipUrlWrite: hasFilterParams });

    this.route.queryParamMap.subscribe((map) => {
      if (this.syncingFromUrl) return;
      const touching = [
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
      ].some((k) => map.has(k));
      if (!touching) return;
      this.applyParams(map);
      this.refreshChips();
      void this.search({ skipUrlWrite: true });
    });
  }

  /** Clear filters only — does not wipe PreferencesService. */
  async clearFilters(): Promise<void> {
    this.keyword = '';
    this.location = '';
    this.jobType = '';
    this.category = '';
    this.language = '';
    this.skills = '';
    this.salaryMin = null;
    this.remote = false;
    this.postedWithin = '';
    this.walkInOnly = false;
    this.verifiedEmployer = false;
    this.fresher = false;
    this.easyApply = false;
    this.sort = 'newest';
    this.refreshChips();
    await this.search();
  }

  async clearPreferences(): Promise<void> {
    this.preferences.clear();
    await this.clearFilters();
  }

  dismissChip(key: string): void {
    switch (key) {
      case 'keyword':
        this.keyword = '';
        break;
      case 'location':
        this.location = '';
        break;
      case 'jobType':
        this.jobType = '';
        break;
      case 'category':
        this.category = '';
        break;
      case 'language':
        this.language = '';
        break;
      case 'skills':
        this.skills = '';
        break;
      case 'salaryMin':
        this.salaryMin = null;
        break;
      case 'remote':
        this.remote = false;
        break;
      case 'postedWithin':
        this.postedWithin = '';
        break;
      case 'walkInOnly':
        this.walkInOnly = false;
        break;
      case 'verifiedEmployer':
        this.verifiedEmployer = false;
        break;
      case 'fresher':
        this.fresher = false;
        break;
      case 'easyApply':
        this.easyApply = false;
        break;
      case 'sort':
        this.sort = 'newest';
        break;
      default:
        break;
    }
    this.refreshChips();
    void this.search();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  async saveCurrentSearch(): Promise<void> {
    if (!this.isSignedIn()) return;
    this.savingSearch.set(true);
    try {
      const name =
        [this.keyword.trim(), this.location.trim(), this.jobType]
          .filter(Boolean)
          .join(' · ')
          .slice(0, 80) || 'Saved search';
      await this.seeker.createSavedSearch({
        name,
        query: this.buildSavedQuery(),
        alertEnabled: true,
      });
      this.toast.success('Search saved. Alerts are on.');
    } catch {
      this.toast.error('Could not save search.');
    } finally {
      this.savingSearch.set(false);
    }
  }

  async search(opts?: { skipUrlWrite?: boolean }): Promise<void> {
    this.loading.set(true);
    this.loadingMore.set(false);
    this.error.set(null);
    this.nextCursor.set(undefined);
    this.total.set(0);
    this.refreshChips();
    if (!opts?.skipUrlWrite) {
      await this.writeUrl();
    }
    try {
      const input = this.buildSearchInput();
      this.tracking.trackSearch({
        keyword: input.keyword,
        location: input.location,
      });
      const res = await this.jobsService.search({
        ...input,
        limit: PAGE_SIZE,
      });
      this.jobs.set(res.items);
      this.total.set(res.total);
      this.nextCursor.set(res.nextCursor);
    } catch {
      this.error.set('maintenance');
      this.jobs.set([]);
      this.total.set(0);
      this.nextCursor.set(undefined);
    } finally {
      this.loading.set(false);
    }
  }

  async loadMore(): Promise<void> {
    const cursor = this.nextCursor();
    if (!cursor || this.loading() || this.loadingMore()) return;

    this.loadingMore.set(true);
    try {
      const res = await this.jobsService.search({
        ...this.buildSearchInput(),
        cursor,
        limit: PAGE_SIZE,
      });
      this.jobs.update((current) => [...current, ...res.items]);
      this.nextCursor.set(res.nextCursor);
    } catch {
      // Keep existing items; user can scroll again to retry.
    } finally {
      this.loadingMore.set(false);
    }
  }

  private buildSearchInput() {
    return {
      keyword: this.keyword.trim() || undefined,
      location: this.location.trim() || undefined,
      jobType: this.jobType || undefined,
      category: this.category.trim() || undefined,
      language: this.language.trim() || undefined,
      skills: this.skills.trim() || undefined,
      salaryMin: this.salaryMin,
      remote: this.remote || null,
      postedWithin: this.postedWithin || null,
      walkInOnly: this.walkInOnly || null,
      verifiedEmployer: this.verifiedEmployer || null,
      fresher: this.fresher || null,
      easyApply: this.easyApply || null,
      sort: this.sort,
    };
  }

  private buildSavedQuery(): Record<string, unknown> {
    const q = this.buildSearchInput();
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(q)) {
      if (value == null || value === '') continue;
      out[key] = value;
    }
    return out;
  }

  private refreshChips(): void {
    const chips: FilterChip[] = [];
    if (this.keyword.trim()) {
      chips.push({ key: 'keyword', label: `“${this.keyword.trim()}”` });
    }
    if (this.location.trim()) {
      chips.push({ key: 'location', label: this.location.trim() });
    }
    if (this.jobType) {
      chips.push({ key: 'jobType', label: formatJobType(this.jobType) });
    }
    if (this.category.trim()) {
      chips.push({ key: 'category', label: this.category.trim() });
    }
    if (this.language.trim()) {
      chips.push({
        key: 'language',
        label: this.languageLabel(this.language.trim()),
      });
    }
    if (this.skills.trim()) {
      chips.push({ key: 'skills', label: `Skills: ${this.skills.trim()}` });
    }
    if (this.salaryMin != null && Number.isFinite(this.salaryMin)) {
      chips.push({
        key: 'salaryMin',
        label: `Min ₹${this.salaryMin.toLocaleString('en-IN')}`,
      });
    }
    if (this.remote) chips.push({ key: 'remote', label: 'Remote' });
    if (this.postedWithin) {
      chips.push({
        key: 'postedWithin',
        label:
          this.postedWithin === '1d'
            ? 'Last 24h'
            : this.postedWithin === '7d'
              ? 'Last 7 days'
              : 'Last 30 days',
      });
    }
    if (this.walkInOnly) chips.push({ key: 'walkInOnly', label: 'Walk-in' });
    if (this.verifiedEmployer) {
      chips.push({ key: 'verifiedEmployer', label: 'Verified' });
    }
    if (this.fresher) chips.push({ key: 'fresher', label: 'Fresher' });
    if (this.easyApply) chips.push({ key: 'easyApply', label: 'Easy apply' });
    if (this.sort && this.sort !== 'newest') {
      chips.push({
        key: 'sort',
        label: this.sortLabelKey().replace('sort.', ''),
      });
    }
    this.filterChips.set(chips);
  }

  private applyParams(params: {
    get(name: string): string | null;
    has(name: string): boolean;
  }): void {
    this.keyword =
      params.get('q')?.trim() || params.get('keyword')?.trim() || '';
    this.location = params.get('location')?.trim() || '';
    this.jobType = params.get('jobType')?.trim() || '';
    this.category = params.get('category')?.trim() || '';
    this.language = params.get('language')?.trim() || '';
    this.skills = params.get('skills')?.trim() || '';
    const salaryRaw = params.get('salaryMin');
    this.salaryMin =
      salaryRaw != null && salaryRaw !== '' && Number.isFinite(Number(salaryRaw))
        ? Number(salaryRaw)
        : null;
    this.remote = params.get('remote') === 'true' || params.get('remote') === '1';
    const posted = params.get('postedWithin');
    this.postedWithin =
      posted === '1d' || posted === '7d' || posted === '30d' ? posted : '';
    this.walkInOnly =
      params.get('walkInOnly') === 'true' || params.get('walkInOnly') === '1';
    this.verifiedEmployer =
      params.get('verifiedEmployer') === 'true' ||
      params.get('verifiedEmployer') === '1';
    this.fresher =
      params.get('fresher') === 'true' || params.get('fresher') === '1';
    this.easyApply =
      params.get('easyApply') === 'true' || params.get('easyApply') === '1';
    const sort = params.get('sort');
    if (
      sort === 'newest' ||
      sort === 'oldest' ||
      sort === 'salary-desc' ||
      sort === 'salary-asc' ||
      sort === 'relevance'
    ) {
      this.sort = sort;
    }
  }

  private async writeUrl(): Promise<void> {
    const queryParams: Record<string, string | null> = {
      q: this.keyword.trim() || null,
      keyword: null,
      location: this.location.trim() || null,
      jobType: this.jobType || null,
      category: this.category.trim() || null,
      language: this.language.trim() || null,
      skills: this.skills.trim() || null,
      salaryMin:
        this.salaryMin != null && Number.isFinite(this.salaryMin)
          ? String(this.salaryMin)
          : null,
      remote: this.remote ? 'true' : null,
      postedWithin: this.postedWithin || null,
      walkInOnly: this.walkInOnly ? 'true' : null,
      verifiedEmployer: this.verifiedEmployer ? 'true' : null,
      fresher: this.fresher ? 'true' : null,
      easyApply: this.easyApply ? 'true' : null,
      sort: this.sort !== 'newest' ? this.sort : null,
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
