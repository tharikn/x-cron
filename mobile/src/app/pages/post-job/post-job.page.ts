import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import type { JobType } from '../../core/models/job.model';
import { JOB_TYPE_LABELS } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AdsService } from '../../core/services/ads.service';
import { AiService } from '../../core/services/ai.service';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { LocationTypeaheadComponent } from '../../shared/location-typeahead/location-typeahead.component';
import { formatPostedDate } from '../../core/utils/format';
import {
  type FieldErrors,
  parseVacancies,
  validateQuickPostFields,
} from '../../core/utils/job-form.validation';

type PostMode = 'quick' | 'paste';
type DeskPanel = 'compose' | 'review' | 'preview';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.page.html',
  styleUrls: ['./post-job.page.scss'],
  imports: [
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    LocationTypeaheadComponent,
    TranslatePipe,
  ],
})
export class PostJobPage implements OnInit {
  private readonly jobsService = inject(JobsService);
  private readonly ads = inject(AdsService);
  private readonly auth = inject(AuthService);
  private readonly ai = inject(AiService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);
  private readonly alertController = inject(AlertController);
  private readonly locale = inject(LocaleService);

  readonly mode = signal<PostMode>('quick');
  readonly panel = signal<DeskPanel>('compose');
  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly employer = this.auth.employer;
  readonly packages = this.ads.packages;
  readonly languages = this.locale.languages;
  readonly jobTypeEntries = Object.entries(JOB_TYPE_LABELS) as Array<[JobType, string]>;
  readonly aiEnabled = signal(false);
  readonly aiBusy = signal(false);
  readonly postBusy = signal(false);
  readonly didPreview = signal(false);
  readonly chatInput = signal('');
  readonly chat = signal<ChatMessage[]>([]);
  readonly fieldErrors = signal<FieldErrors>({});

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
  promoteJobId = 'job_001';
  promotePackageId = 'featured_7d';
  readonly nowIso = new Date().toISOString();

  async ngOnInit(): Promise<void> {
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
    try {
      await this.ads.loadPackages();
    } catch {
      // packages optional offline
    }
    try {
      const status = await this.ai.status();
      this.aiEnabled.set(!!status.enabled);
    } catch {
      this.aiEnabled.set(false);
    }
  }

  setMode(value: string | number | undefined): void {
    if (value === 'quick' || value === 'paste') {
      this.mode.set(value);
    }
  }

  setPanel(value: string | number | undefined): void {
    if (value === 'compose' || value === 'review' || value === 'preview') {
      if (value !== 'compose' && !this.canLeaveCompose()) {
        void this.showToast('Fill required fields before Review / Preview.');
        this.panel.set('compose');
        return;
      }
      this.panel.set(value);
      if (value === 'preview') {
        this.didPreview.set(true);
      }
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
    if (!(await this.ensureEmployerReady())) return;
    if (!this.pasteText.trim()) {
      await this.showToast('Paste a WhatsApp/Telegram job message first.');
      return;
    }

    this.aiBusy.set(true);
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
      await this.showToast('Ready to review — then Preview before posting.');
    } catch {
      await this.showToast('Extract failed. Check AI settings or edit manually.');
    } finally {
      this.aiBusy.set(false);
    }
  }

  async improveWithAi(instruction?: string): Promise<void> {
    if (!this.aiEnabled()) {
      await this.showToast('AI enrich is off. Set AI_ENRICH_ENABLED=1 on the API.');
      return;
    }
    const prompt = (instruction ?? '').trim();
    if (prompt) {
      this.chat.update((messages) => [...messages, { role: 'user', text: prompt }]);
      this.chatInput.set('');
    }

    this.aiBusy.set(true);
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
      await this.showToast(
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
      await this.showToast('AI cleanup failed.');
    } finally {
      this.aiBusy.set(false);
    }
  }

  async sendChat(): Promise<void> {
    const text = this.chatInput().trim();
    if (!text || this.aiBusy()) return;
    await this.improveWithAi(text);
  }

  async requestPost(): Promise<void> {
    if (!(await this.ensureEmployerReady())) return;
    if (!this.validateCompose()) {
      this.panel.set('compose');
      return;
    }

    const previewed = this.didPreview();
    const alert = await this.alertController.create({
      header: 'Post this job live?',
      message: previewed
        ? 'You opened Preview. Recruiters publish directly — seekers will see this immediately. It will not wait in Blog Approval. Did you check the preview? Confirm to post.'
        : 'Did you preview how seekers will see this? Open Preview first if you have not. Recruiters publish live — this skips Blog Approval (admin import queue is separate).',
      buttons: previewed
        ? [
            { text: 'Not yet', role: 'cancel' },
            {
              text: 'Yes, I previewed — post',
              handler: () => {
                void this.publishLive();
              },
            },
          ]
        : [
            { text: 'Not yet', role: 'cancel' },
            {
              text: 'Open Preview',
              handler: () => {
                this.didPreview.set(true);
                this.panel.set('preview');
              },
            },
            {
              text: 'I previewed — post live',
              handler: () => {
                void this.publishLive();
              },
            },
          ],
    });
    await alert.present();
  }

  private async publishLive(): Promise<void> {
    if (this.postBusy()) return;
    this.postBusy.set(true);
    try {
      await this.jobsService.createQuickPost({
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
        directPublish: true,
      });
      this.fieldErrors.set({});
      this.resetForm();
      await this.showToast('Posted live. Seekers can find it in search now.');
      await this.router.navigate(['/tabs/account']);
    } catch {
      await this.showToast('Post failed. Sign in as recruiter and ensure API is running.');
    } finally {
      this.postBusy.set(false);
    }
  }

  async purchasePromotion(): Promise<void> {
    if (!(await this.ensureEmployerReady())) return;
    if (!this.promoteJobId.trim() || !this.promotePackageId) {
      await this.showToast('Pick a job id and package.');
      return;
    }
    try {
      const result = await this.ads.purchase(
        this.promoteJobId.trim(),
        this.promotePackageId,
      );
      await this.showToast(
        `${result.promotion.badge} until ${new Date(result.promotion.endsAt).toLocaleDateString('en-IN')} (stub checkout).`,
      );
    } catch {
      await this.showToast('Promotion failed. Job must be yours and published/pending.');
    }
  }

  private canLeaveCompose(): boolean {
    if (this.mode() === 'paste' && this.pasteText.trim() && !this.title.trim()) {
      return false;
    }
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
      void this.showToast(Object.values(errors)[0] ?? 'Fix the highlighted fields.');
      return false;
    }
    return true;
  }

  private resetForm(): void {
    this.title = '';
    this.description = '';
    this.salaryText = '';
    this.vacancies = '';
    this.contactPhone = '';
    this.contactEmail = '';
    this.contactWebsite = '';
    this.pasteText = '';
    this.chat.set([]);
    this.chatInput.set('');
    this.didPreview.set(false);
    this.panel.set('compose');
    this.mode.set('quick');
  }

  private async ensureEmployerReady(): Promise<boolean> {
    if (!this.auth.isSignedIn()) {
      await this.showToast('Recruiters must sign in before posting.');
      await this.router.navigate(['/tabs/account'], {
        queryParams: { mode: 'employer' },
      });
      return false;
    }
    if (!this.auth.employer()) {
      try {
        await this.auth.createEmployer(this.employerName || 'My Business');
      } catch {
        await this.showToast('Create a recruiter profile in Account first.');
        await this.router.navigate(['/tabs/account'], {
          queryParams: { mode: 'employer' },
        });
        return false;
      }
    }
    return true;
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2400,
      color: 'dark',
    });
    await toast.present();
  }
}
