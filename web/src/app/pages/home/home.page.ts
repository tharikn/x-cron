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
import { RouterLink } from '@angular/router';
import { LocationTypeaheadComponent } from '../../core/components/location-typeahead/location-typeahead.component';
import type { Job } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { SeoService } from '../../core/services/seo.service';
import {
  formatJobType,
  formatLocation,
  formatPostedDate,
  formatSalary,
  jobPath,
} from '../../core/utils/format';
import { GetAppCtaComponent } from '../../shared/get-app-cta/get-app-cta.component';

const PAGE_SIZE = 8;

const SORT_OPTIONS = [
  { value: 'newest', labelKey: 'sort.newest' },
  { value: 'oldest', labelKey: 'sort.oldest' },
  { value: 'salary-desc', labelKey: 'sort.salaryDesc' },
  { value: 'salary-asc', labelKey: 'sort.salaryAsc' },
  { value: 'relevance', labelKey: 'sort.relevance' },
] as const;

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    RouterLink,
    TranslatePipe,
    LocationTypeaheadComponent,
    GetAppCtaComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit, OnDestroy {
  private readonly jobsService = inject(JobsService);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);
  private readonly preferences = inject(PreferencesService);

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

  keyword = '';
  location = '';
  salaryMin: number | null = null;
  remote = false;
  postedWithin: '' | '1d' | '7d' | '30d' = '';
  walkInOnly = false;
  sort: (typeof SORT_OPTIONS)[number]['value'] = 'newest';

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
    const savedLocation = this.preferences.prefs().locations[0]?.trim();
    if (savedLocation) {
      this.location = savedLocation;
    }
    await this.search();
  }

  async clearPreferences(): Promise<void> {
    this.keyword = '';
    this.location = '';
    this.salaryMin = null;
    this.remote = false;
    this.postedWithin = '';
    this.walkInOnly = false;
    this.sort = 'newest';
    this.preferences.clear();
    await this.search();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  async search(): Promise<void> {
    this.loading.set(true);
    this.loadingMore.set(false);
    this.error.set(null);
    this.nextCursor.set(undefined);
    this.total.set(0);
    try {
      const res = await this.jobsService.search({
        keyword: this.keyword.trim() || undefined,
        location: this.location.trim() || undefined,
        salaryMin: this.salaryMin,
        remote: this.remote || null,
        postedWithin: this.postedWithin || null,
        walkInOnly: this.walkInOnly || null,
        sort: this.sort,
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
        keyword: this.keyword.trim() || undefined,
        location: this.location.trim() || undefined,
        salaryMin: this.salaryMin,
        remote: this.remote || null,
        postedWithin: this.postedWithin || null,
        walkInOnly: this.walkInOnly || null,
        sort: this.sort,
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
}
