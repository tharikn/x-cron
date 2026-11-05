import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JOB_TYPE_LABELS, type Job, type JobType } from '../../core/models/job.model';
import { AiService } from '../../core/services/ai.service';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { formatPostedDate } from '../../core/utils/format';
import {
  type FieldErrors,
  parseVacancies,
  validateQuickPostFields,
} from '../../core/utils/job-form.validation';
import { DatetimePickerComponent } from '../../shared/datetime-picker/datetime-picker.component';

type PostMode = 'quick' | 'paste';
type DeskPanel = 'compose' | 'review' | 'preview';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-post-job',
  imports: [FormsModule, RouterLink, DatetimePickerComponent],
  templateUrl: './post-job.page.html',
  styleUrl: './post-job.page.scss',
})
export class PostJobPage implements OnInit {
  private readonly jobsService = inject(JobsService);
  private readonly auth = inject(AuthService);
  private readonly ai = inject(AiService);
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly locale = inject(LocaleService);

  readonly languages = this.locale.languages;
  readonly mode = signal<PostMode>('quick');
  readonly panel = signal<DeskPanel>('compose');
  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly isEmployer = this.auth.isEmployer;
  readonly busy = signal(false);
  readonly aiBusy = signal(false);
  readonly aiEnabled = signal(false);
  readonly didPreview = signal(false);
  readonly confirmOpen = signal(false);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly chatInput = signal('');
  readonly chat = signal<ChatMessage[]>([]);
  readonly fieldErrors = signal<FieldErrors>({});
  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<[JobType, string]>;
  readonly nowIso = new Date().toISOString();
  readonly formatPostedDate = formatPostedDate;
  readonly languageLabel = (code: string) => this.locale.label(code);

  readonly previewFacts = computed(() => {
    const typeLabel = JOB_TYPE_LABELS[this.jobType] ?? this.jobType;
    const pay = this.salaryText.trim() || 'Salary not provided';
    return `${typeLabel} · ${pay}`;
  });

  title = '';
  employerName = '';
  locationCity = '';
  jobType: JobType = 'full-time';
  salaryText = '';
  vacancies = '';
  description = '';
  contentLanguage = 'en';
  contactPhone = '';
  contactEmail = '';
  contactWebsite = '';
  pasteText = '';
  priority = 0;
  effectiveFromLocal = this.defaultEffectiveLocal();
  expiresAtLocal = this.defaultExpiresLocal();

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Recruiter desk',
      description: 'Post a job on X Cron Jobs. Review, preview, then publish live.',
      path: '/post',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    try {
      const status = await this.ai.status();
      this.aiEnabled.set(!!status.enabled);
    } catch {
      this.aiEnabled.set(false);
    }
  }

  setMode(value: PostMode): void {
    this.mode.set(value);
    this.message.set(null);
    this.error.set(null);
  }

  setPanel(value: DeskPanel): void {
    if (value !== 'compose' && !this.canLeaveCompose()) {
      this.error.set('Fill required fields before Review / Preview.');
      this.panel.set('compose');
      return;
    }
    this.panel.set(value);
    this.error.set(null);
    if (value === 'preview') {
      this.didPreview.set(true);
    }
  }

  clearFieldError(key: string): void {
    if (!this.fieldErrors()[key]) return;
    this.fieldErrors.update((errors) => {
      const next = { ...errors };
      delete next[key];
      return next;
    });
  }

  goReview(): void {
    if (!this.validateCompose()) return;
    this.panel.set('review');
  }

  goPreview(): void {
    if (!this.validateCompose()) return;
    this.didPreview.set(true);
    this.panel.set('preview');
  }

  async extractPasteToReview(): Promise<void> {
    if (!this.ensurePosterReady()) return;
    if (!this.pasteText.trim()) {
      this.error.set('Paste a WhatsApp/Telegram job message first.');
      return;
    }

    this.aiBusy.set(true);
    this.error.set(null);
    try {
      if (this.aiEnabled()) {
        const result = await this.ai.enrichJob({
          rawText: this.pasteText.trim(),
          description: this.pasteText.trim(),
          contentLanguage: this.contentLanguage,
          employerName: this.employerName || undefined,
          instruction:
            'Extract a clean job post: fill title, employer, city, salary, apply link, and description. Remove chat noise.',
        });
        this.title = result.title || this.title || 'Hiring';
        this.employerName = result.employerName || this.employerName;
        this.locationCity = result.locationCity || this.locationCity;
        if (result.jobType && result.jobType in JOB_TYPE_LABELS) {
          this.jobType = result.jobType as JobType;
        }
        this.salaryText = result.salaryText || this.salaryText;
        this.description = result.description || this.pasteText.trim();
        this.contentLanguage = result.contentLanguage || this.contentLanguage;
        this.contactWebsite = result.contactWebsite || this.contactWebsite;
        if (result.vacancies != null) {
          this.vacancies = String(result.vacancies);
        }
        this.chat.set([
          {
            role: 'assistant',
            text:
              result.notes?.filter(Boolean).slice(0, 2).join(' · ') ||
              'Extracted into Review. Edit fields or chat corrections.',
          },
        ]);
      } else {
        const lines = this.pasteText
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        this.title = (lines[0] || 'Hiring').slice(0, 80);
        this.description = this.pasteText.trim();
        this.chat.set([
          {
            role: 'assistant',
            text: 'AI is off on the API. Pasted text is in Description — edit manually.',
          },
        ]);
      }
      this.mode.set('quick');
      this.panel.set('review');
      this.message.set('Ready to review — then Preview before posting live.');
    } catch {
      this.error.set('Extract failed. Check AI settings or edit manually.');
    } finally {
      this.aiBusy.set(false);
    }
  }

  async improveWithAi(instruction?: string): Promise<void> {
    if (!this.aiEnabled()) {
      this.error.set('AI enrich is off. Set AI_ENRICH_ENABLED=1 on the API.');
      return;
    }
    const prompt = (instruction ?? '').trim();
    if (prompt) {
      this.chat.update((messages) => [...messages, { role: 'user', text: prompt }]);
      this.chatInput.set('');
    }

    this.aiBusy.set(true);
    this.error.set(null);
    try {
      const result = await this.ai.enrichJob({
        title: this.title,
        employerName: this.employerName,
        locationCity: this.locationCity,
        jobType: this.jobType,
        salaryText: this.salaryText,
        contactWebsite: this.contactWebsite,
        description: this.description,
        contentLanguage: this.contentLanguage,
        rawText: this.description || this.pasteText,
        instruction:
          prompt ||
          'Clean the post, detect language, and fill title, employer, city, salary, apply link, and description.',
      });
      this.title = result.title || this.title;
      this.employerName = result.employerName || this.employerName;
      this.locationCity = result.locationCity || this.locationCity;
      if (result.jobType && result.jobType in JOB_TYPE_LABELS) {
        this.jobType = result.jobType as JobType;
      }
      this.salaryText = result.salaryText || this.salaryText;
      this.description = result.description || this.description;
      this.contentLanguage = result.contentLanguage || this.contentLanguage;
      this.contactWebsite = result.contactWebsite || this.contactWebsite;
      if (result.vacancies != null) {
        this.vacancies = String(result.vacancies);
      }
      const note =
        result.notes?.filter(Boolean).slice(0, 3).join(' · ') ||
        (result.cleaned
          ? 'Cleaned and mapped into the form boxes.'
          : 'AI ran — review fields carefully.');
      this.chat.update((messages) => [...messages, { role: 'assistant', text: note }]);
      this.message.set(
        result.cleaned ? 'AI updated the review fields' : 'AI finished — review carefully',
      );
    } catch {
      this.chat.update((messages) => [
        ...messages,
        {
          role: 'assistant',
          text: 'AI failed. Check AI_ENRICH_* on the API and try again.',
        },
      ]);
      this.error.set('AI cleanup failed.');
    } finally {
      this.aiBusy.set(false);
    }
  }

  async sendChat(): Promise<void> {
    const text = this.chatInput().trim();
    if (!text || this.aiBusy()) return;
    await this.improveWithAi(text);
  }

  requestPost(): void {
    if (!this.ensurePosterReady()) return;
    if (!this.validateCompose()) {
      this.panel.set('compose');
      return;
    }
    this.confirmOpen.set(true);
  }

  closeConfirm(): void {
    this.confirmOpen.set(false);
  }

  openPreviewFromConfirm(): void {
    this.confirmOpen.set(false);
    this.didPreview.set(true);
    this.panel.set('preview');
  }

  async confirmPostLive(): Promise<void> {
    this.confirmOpen.set(false);
    await this.publishLive();
  }

  private async publishLive(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    this.message.set(null);
    try {
      const job = await this.jobsService.createQuickPost({
        title: this.title.trim(),
        employerName: this.employerName.trim(),
        locationCity: this.locationCity.trim(),
        jobType: this.jobType,
        salaryText: this.salaryText.trim() || undefined,
        vacancies: parseVacancies(this.vacancies),
        description: this.description.trim(),
        contentLanguage: this.contentLanguage,
        contactPhone: this.contactPhone.trim() || undefined,
        contactEmail: this.contactEmail.trim() || undefined,
        contactWebsite: this.contactWebsite.trim() || undefined,
        priority: Number(this.priority) || 0,
        effectiveFrom: this.fromLocalInput(this.effectiveFromLocal),
        expiresAt: this.fromLocalInput(this.expiresAtLocal),
        directPublish: true,
      });
      this.fieldErrors.set({});
      this.resetQuickForm();
      this.afterJobCreated(job);
    } catch {
      this.error.set('Post failed. Sign in as a recruiter and ensure the API is running.');
    } finally {
      this.busy.set(false);
    }
  }

  private afterJobCreated(_job: Job): void {
    this.message.set(
      'Posted live. Seekers can find it in search now — no Blog Approval queue for recruiter posts.',
    );
  }

  private resetQuickForm(): void {
    this.title = '';
    this.description = '';
    this.salaryText = '';
    this.vacancies = '';
    this.contactPhone = '';
    this.contactEmail = '';
    this.contactWebsite = '';
    this.pasteText = '';
    this.priority = 0;
    this.effectiveFromLocal = this.defaultEffectiveLocal();
    this.expiresAtLocal = this.defaultExpiresLocal();
    this.chat.set([]);
    this.chatInput.set('');
    this.didPreview.set(false);
    this.panel.set('compose');
    this.mode.set('quick');
  }

  private canLeaveCompose(): boolean {
    const errors = validateQuickPostFields({
      title: this.title,
      employerName: this.employerName,
      locationCity: this.locationCity,
      salaryText: this.salaryText,
      description: this.description,
      contactPhone: this.contactPhone,
      contactEmail: this.contactEmail,
      contactWebsite: this.contactWebsite,
      vacancies: this.vacancies,
    });
    return Object.keys(errors).length === 0;
  }

  private validateCompose(): boolean {
    const errors = validateQuickPostFields({
      title: this.title,
      employerName: this.employerName,
      locationCity: this.locationCity,
      salaryText: this.salaryText,
      description: this.description,
      contactPhone: this.contactPhone,
      contactEmail: this.contactEmail,
      contactWebsite: this.contactWebsite,
      vacancies: this.vacancies,
    });
    this.fieldErrors.set(errors);
    if (Object.keys(errors).length) {
      this.error.set(Object.values(errors)[0] ?? 'Fix the highlighted fields.');
      return false;
    }
    return true;
  }

  private ensurePosterReady(): boolean {
    if (!this.auth.isSignedIn()) {
      this.error.set('Sign in as a recruiter before posting.');
      void this.router.navigate(['/sign-in'], {
        queryParams: { mode: 'employer' },
      });
      return false;
    }
    if (!this.auth.isEmployer()) {
      this.error.set('Posting needs a recruiter account.');
      return false;
    }
    return true;
  }

  private defaultEffectiveLocal(): string {
    return this.toLocalInput(new Date().toISOString());
  }

  private defaultExpiresLocal(): string {
    return this.toLocalInput(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    );
  }

  private toLocalInput(iso: string): string {
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
