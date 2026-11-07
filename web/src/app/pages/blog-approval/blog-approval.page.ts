import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type { Job } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AiService } from '../../core/services/ai.service';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import {
  formatJobType,
  formatLocation,
  formatPostedDate,
  formatSalary,
} from '../../core/utils/format';

type PreviewMode = 'web' | 'mobile';

interface EditDraft {
  title: string;
  employerName: string;
  locationCity: string;
  jobType: string;
  salaryText: string;
  contentLanguage: string;
  contactWebsite: string;
  description: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-blog-approval',
  imports: [RouterLink, TranslatePipe, FormsModule],
  templateUrl: './blog-approval.page.html',
  styleUrl: './blog-approval.page.scss',
})
export class BlogApprovalPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly jobsService = inject(JobsService);
  private readonly ai = inject(AiService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly locale = inject(LocaleService);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly isModerator = this.auth.isModerator;
  readonly queueBusy = signal(false);
  readonly queue = signal<Job[]>([]);
  readonly previewJob = signal<Job | null>(null);
  readonly draft = signal<EditDraft | null>(null);
  readonly previewMode = signal<PreviewMode>('web');
  readonly aiBusy = signal(false);
  readonly saveBusy = signal(false);
  readonly aiEnabled = signal(false);
  readonly chatInput = signal('');
  readonly chat = signal<ChatMessage[]>([]);
  readonly dirty = signal(false);

  readonly formatLocation = formatLocation;
  readonly formatSalary = formatSalary;
  readonly formatJobType = formatJobType;
  readonly formatPostedDate = formatPostedDate;
  readonly languageLabel = (code: string) => this.locale.label(code);

  readonly previewAsJob = computed(() => {
    const job = this.previewJob();
    const d = this.draft();
    if (!job || !d) return null;
    return {
      ...job,
      title: d.title || job.title,
      employerName: d.employerName || job.employerName,
      jobType: d.jobType || job.jobType,
      contentLanguage: d.contentLanguage || job.contentLanguage,
      location: {
        ...job.location,
        city: d.locationCity || job.location.city,
      },
      description: {
        ...job.description,
        about: d.description || job.description.about,
      },
      contact: {
        ...job.contact,
        hasWebsite: !!(d.contactWebsite || job.contact.hasWebsite),
      },
      contactWebsite: d.contactWebsite || job.contactWebsite,
    } satisfies Job;
  });

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Blog Approval',
      description: 'Approve or reject jobs waiting for review on X Cron Jobs.',
      path: '/blog-approval',
    });
    if (this.isAdmin()) {
      void this.reloadQueue();
      void this.ai.status().then((s) => this.aiEnabled.set(!!s.enabled));
    }
  }

  openPreview(job: Job): void {
    this.previewJob.set(job);
    this.draft.set(this.jobToDraft(job));
    this.previewMode.set('web');
    this.chat.set([]);
    this.chatInput.set('');
    this.dirty.set(false);
  }

  closePreview(): void {
    this.previewJob.set(null);
    this.draft.set(null);
    this.chat.set([]);
    this.dirty.set(false);
  }

  setPreviewMode(mode: PreviewMode): void {
    this.previewMode.set(mode);
  }

  patchDraft(partial: Partial<EditDraft>): void {
    const current = this.draft();
    if (!current) return;
    this.draft.set({ ...current, ...partial });
    this.dirty.set(true);
  }

  async reloadQueue(announce = false): Promise<void> {
    if (!this.isAdmin()) {
      this.queue.set([]);
      this.closePreview();
      return;
    }
    this.queueBusy.set(true);
    try {
      const items = await this.jobsService.moderationQueue('needs-review');
      this.queue.set(items);
      const preview = this.previewJob();
      if (preview && !items.some((item) => item.id === preview.id)) {
        this.closePreview();
      } else if (preview) {
        const fresh = items.find((item) => item.id === preview.id) ?? null;
        this.previewJob.set(fresh);
        if (fresh && !this.dirty()) {
          this.draft.set(this.jobToDraft(fresh));
        }
      }
      if (announce) {
        this.toast.show(
          items.length
            ? `Queue refreshed · ${items.length} waiting`
            : 'Queue refreshed · nothing waiting',
        );
      }
    } catch {
      this.queue.set([]);
      this.closePreview();
      this.toast.error('Could not load the approval queue. Is the API running?');
    } finally {
      this.queueBusy.set(false);
    }
  }

  async improveWithAi(instruction?: string): Promise<void> {
    const job = this.previewJob();
    const draft = this.draft();
    if (!job || !draft) return;
    if (!this.aiEnabled()) {
      this.toast.error('AI enrich is off. Set AI_ENRICH_ENABLED=1 on the API.');
      return;
    }

    const prompt = (instruction ?? '').trim();
    if (prompt) {
      this.chat.update((messages) => [
        ...messages,
        { role: 'user', text: prompt },
      ]);
      this.chatInput.set('');
    }

    this.aiBusy.set(true);
    try {
      const result = await this.ai.enrichJob({
        title: draft.title,
        employerName: draft.employerName,
        locationCity: draft.locationCity,
        jobType: draft.jobType,
        salaryText: draft.salaryText,
        contactWebsite: draft.contactWebsite,
        description: draft.description,
        contentLanguage: draft.contentLanguage,
        rawText: draft.description,
        instruction:
          prompt ||
          'Clean Telegram noise, align the text, detect language, and fill title, employer, city, salary, apply link, and description boxes.',
      });

      this.draft.set({
        title: result.title || draft.title,
        employerName: result.employerName || draft.employerName,
        locationCity: result.locationCity || draft.locationCity,
        jobType: result.jobType || draft.jobType,
        salaryText: result.salaryText || draft.salaryText,
        contentLanguage: result.contentLanguage || draft.contentLanguage,
        contactWebsite: result.contactWebsite || draft.contactWebsite,
        description: result.description || draft.description,
      });
      this.dirty.set(true);

      const note =
        result.notes?.filter(Boolean).slice(0, 3).join(' · ') ||
        (result.cleaned
          ? 'Cleaned and mapped into the form boxes.'
          : 'AI ran but kept most of the original text.');
      this.chat.update((messages) => [
        ...messages,
        { role: 'assistant', text: note },
      ]);
      this.toast.show(
        result.cleaned
          ? 'AI cleaned the post into the form fields'
          : 'AI finished — review fields carefully',
      );
    } catch {
      this.chat.update((messages) => [
        ...messages,
        {
          role: 'assistant',
          text: 'AI failed. Check AI_ENRICH_* on the API and try again.',
        },
      ]);
      this.toast.error('AI cleanup failed.');
    } finally {
      this.aiBusy.set(false);
    }
  }

  async sendChat(): Promise<void> {
    const text = this.chatInput().trim();
    if (!text || this.aiBusy()) return;
    await this.improveWithAi(text);
  }

  async saveDraft(): Promise<boolean> {
    const job = this.previewJob();
    const draft = this.draft();
    if (!job || !draft) return false;
    this.saveBusy.set(true);
    try {
      const updated = await this.jobsService.updateForModeration(job.id, {
        title: draft.title.trim(),
        employerName: draft.employerName.trim(),
        locationCity: draft.locationCity.trim(),
        jobType: draft.jobType.trim(),
        salaryText: draft.salaryText.trim() || undefined,
        description: draft.description.trim(),
        contentLanguage: draft.contentLanguage.trim() || 'en',
        contactWebsite: draft.contactWebsite.trim() || undefined,
      });
      this.previewJob.set(updated);
      this.draft.set(this.jobToDraft(updated));
      this.dirty.set(false);
      this.queue.update((items) =>
        items.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
      );
      this.toast.show('Draft saved');
      return true;
    } catch {
      this.toast.error('Could not save edits.');
      return false;
    } finally {
      this.saveBusy.set(false);
    }
  }

  async approve(job: Job): Promise<void> {
    if (this.previewJob()?.id === job.id && this.dirty()) {
      const saved = await this.saveDraft();
      if (!saved) return;
    }
    this.queueBusy.set(true);
    try {
      await this.jobsService.approveJob(job.id, 'Approved');
      if (this.previewJob()?.id === job.id) {
        this.closePreview();
      }
      await this.reloadQueue();
      this.toast.show(`Approved · ${job.title}`);
    } catch {
      this.toast.error('Approve failed.');
      this.queueBusy.set(false);
    }
  }

  async reject(job: Job): Promise<void> {
    this.queueBusy.set(true);
    try {
      await this.jobsService.rejectJob(job.id, 'Rejected by moderator');
      if (this.previewJob()?.id === job.id) {
        this.closePreview();
      }
      await this.reloadQueue();
      this.toast.show(`Rejected · ${job.title}`);
    } catch {
      this.toast.error('Reject failed.');
      this.queueBusy.set(false);
    }
  }

  private jobToDraft(job: Job): EditDraft {
    const salary =
      job.salary && (job.salary.min != null || job.salary.max != null)
        ? formatSalary(job.salary)
        : '';
    return {
      title: job.title || '',
      employerName: job.employerName || '',
      locationCity: job.location?.city || '',
      jobType: job.jobType || 'full-time',
      salaryText: salary === 'Salary not provided' ? '' : salary,
      contentLanguage: job.contentLanguage || 'en',
      contactWebsite: job.contactWebsite || '',
      description: job.description?.about || '',
    };
  }
}
