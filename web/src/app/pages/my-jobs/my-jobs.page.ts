import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocationTypeaheadComponent } from '../../core/components/location-typeahead/location-typeahead.component';
import { JOB_TYPE_LABELS, type Job, type JobType } from '../../core/models/job.model';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { DatetimePickerComponent } from '../../shared/datetime-picker/datetime-picker.component';

@Component({
  selector: 'app-my-jobs',
  imports: [FormsModule, RouterLink, DatePipe, LocationTypeaheadComponent, DatetimePickerComponent],
  templateUrl: './my-jobs.page.html',
  styleUrl: './my-jobs.page.scss',
})
export class MyJobsPage implements OnInit {
  private readonly jobsService = inject(JobsService);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LocaleService);

  readonly languages = this.locale.languages;
  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly isEmployer = this.auth.isEmployer;
  readonly jobs = signal<Job[]>([]);
  readonly busy = signal(false);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly editingId = signal<string | null>(null);
  readonly optionsOpenId = signal<string | null>(null);
  readonly page = signal(1);
  readonly limit = signal(10);
  readonly total = signal(0);
  readonly totalPages = signal(1);
  readonly pageSizeOptions = [5, 10, 25, 50];
  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<[JobType, string]>;

  title = '';
  employerName = '';
  locationCity = '';
  jobType: JobType = 'full-time';
  salaryText = '';
  description = '';
  contentLanguage = 'en';
  priority = 0;
  effectiveFromLocal = '';
  expiresAtLocal = '';

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Posted jobs',
      description: 'Review, edit, prioritize, and schedule your posted jobs.',
      path: '/my-jobs',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    if (this.auth.isSignedIn() && this.auth.isEmployer()) {
      await this.reload();
    }
  }

  async reload(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      const res = await this.jobsService.listMyJobs({
        page: this.page(),
        limit: this.limit(),
      });
      this.jobs.set(res.items);
      this.total.set(res.total);
      this.page.set(res.page);
      this.limit.set(res.limit);
      this.totalPages.set(res.totalPages);
      if (this.optionsOpenId() && !res.items.some((j) => j.id === this.optionsOpenId())) {
        this.optionsOpenId.set(null);
      }
    } catch {
      this.error.set('Could not load posted jobs. Sign in as admin and ensure the API is running.');
    } finally {
      this.busy.set(false);
    }
  }

  async onPageSizeChange(raw: number | string): Promise<void> {
    const next = Number(raw) || 10;
    this.limit.set(next);
    this.page.set(1);
    await this.reload();
  }

  async goToPage(next: number): Promise<void> {
    const page = Math.min(this.totalPages(), Math.max(1, next));
    if (page === this.page()) return;
    this.page.set(page);
    this.optionsOpenId.set(null);
    await this.reload();
  }

  toggleOptions(jobId: string, event: Event): void {
    event.stopPropagation();
    this.optionsOpenId.update((open) => (open === jobId ? null : jobId));
  }

  closeOptions(): void {
    this.optionsOpenId.set(null);
  }

  startEdit(job: Job): void {
    this.closeOptions();
    this.editingId.set(job.id);
    this.title = job.title;
    this.employerName = job.employerName;
    this.locationCity = job.location.city;
    this.jobType = (job.jobType as JobType) || 'full-time';
    this.salaryText = job.salary
      ? `${job.salary.min ?? ''}${job.salary.max && job.salary.min !== job.salary.max ? `-${job.salary.max}` : ''}`.replace(
          /^-|-$/g,
          '',
        )
      : '';
    this.description = job.description?.about ?? '';
    this.contentLanguage = job.contentLanguage || 'en';
    this.priority = job.priority ?? 0;
    this.effectiveFromLocal = this.toLocalInput(job.effectiveFrom || job.publishedAt);
    this.expiresAtLocal = this.toLocalInput(job.expiresAt);
    this.message.set(null);
    this.error.set(null);
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  async saveEdit(): Promise<void> {
    const id = this.editingId();
    if (!id) return;
    if (!this.title.trim() || !this.employerName.trim() || !this.description.trim()) {
      this.error.set('Title, employer and description are required.');
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.message.set(null);
    try {
      await this.jobsService.updateMyJob(id, {
        title: this.title.trim(),
        employerName: this.employerName.trim(),
        locationCity: this.locationCity.trim() || 'Palani',
        jobType: this.jobType,
        salaryText: this.salaryText.trim() || undefined,
        description: this.description.trim(),
        contentLanguage: this.contentLanguage,
        priority: Number(this.priority) || 0,
        effectiveFrom: this.fromLocalInput(this.effectiveFromLocal),
        expiresAt: this.fromLocalInput(this.expiresAtLocal),
      });
      this.editingId.set(null);
      this.message.set('Job updated.');
      await this.reload();
    } catch {
      this.error.set('Update failed.');
    } finally {
      this.busy.set(false);
    }
  }

  async activate(job: Job): Promise<void> {
    this.closeOptions();
    this.busy.set(true);
    this.error.set(null);
    this.message.set(null);
    try {
      await this.jobsService.activateMyJob(job.id);
      this.message.set(`“${job.title}” activated.`);
      await this.reload();
    } catch {
      this.error.set('Activate failed.');
    } finally {
      this.busy.set(false);
    }
  }

  async deactivate(job: Job): Promise<void> {
    this.closeOptions();
    this.busy.set(true);
    this.error.set(null);
    this.message.set(null);
    try {
      await this.jobsService.deactivateMyJob(job.id);
      this.message.set(`“${job.title}” deactivated.`);
      await this.reload();
    } catch {
      this.error.set('Deactivate failed.');
    } finally {
      this.busy.set(false);
    }
  }

  async renew(job: Job): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    this.optionsOpenId.set(null);
    try {
      await this.jobsService.renewMyJob(job.id);
      this.message.set(`“${job.title}” renewed for 30 days.`);
      await this.reload();
    } catch {
      this.error.set('Renew failed.');
    } finally {
      this.busy.set(false);
    }
  }

  async hide(job: Job): Promise<void> {
    this.closeOptions();
    if (!confirm(`Hide “${job.title}”? It will leave public search.`)) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.message.set(null);
    try {
      await this.jobsService.hideMyJob(job.id);
      if (this.editingId() === job.id) this.editingId.set(null);
      this.message.set('Job hidden.');
      await this.reload();
    } catch {
      this.error.set('Hide failed.');
    } finally {
      this.busy.set(false);
    }
  }

  isActive(job: Job): boolean {
    return job.status === 'published';
  }

  private toLocalInput(iso?: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  private fromLocalInput(local: string): string | undefined {
    if (!local?.trim()) return undefined;
    const d = new Date(local);
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toISOString();
  }
}
