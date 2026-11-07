import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import type { Job } from '../../core/models/job.model';
import { ApplicationsService } from '../../core/services/applications.service';
import { ApplyProfilesService } from '../../core/services/apply-profiles.service';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LocaleService } from '../../core/services/locale.service';
import { SeekerService } from '../../core/services/seeker.service';
import { ViewedJobsService } from '../../core/services/viewed-jobs.service';
import {
  formatJobType,
  formatLocation,
  formatPostedDate,
  formatSalary,
} from '../../core/utils/format';
import { JobCardComponent } from '../../shared/job-card/job-card.component';
import {
  GoogleSignInSheetComponent,
  type GoogleSignInReason,
} from '../../shared/google-sign-in-sheet/google-sign-in-sheet.component';
import { JobDetailSkeletonComponent } from '../../shared/skeleton/job-detail-skeleton.component';
import {
  IonSelect,
  IonSelectOption,
} from '@ionic/angular';

type PendingAction = 'save' | 'share' | 'apply';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.page.html',
  styleUrls: ['./job-detail.page.scss'],
  imports: [
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonBadge,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonSelect,
    IonSelectOption,
    JobCardComponent,
    GoogleSignInSheetComponent,
    JobDetailSkeletonComponent,
  ],
})
export class JobDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobsService = inject(JobsService);
  private readonly seeker = inject(SeekerService);
  private readonly applications = inject(ApplicationsService);
  private readonly applyProfiles = inject(ApplyProfilesService);
  readonly auth = inject(AuthService);
  private readonly toastController = inject(ToastController);
  private readonly locale = inject(LocaleService);
  private readonly viewed = inject(ViewedJobsService);

  readonly job = signal<Job | undefined>(undefined);
  readonly loading = signal(true);
  readonly related = signal<Job[]>([]);
  readonly saved = signal(false);
  readonly appliedId = signal<string | null>(null);
  readonly applyBusy = signal(false);
  readonly applyProfilesList = this.applyProfiles.items;
  readonly signInOpen = signal(false);
  readonly signInReason = signal<GoogleSignInReason>('generic');
  selectedProfileId = '';

  private pendingAction: PendingAction | null = null;

  readonly formatLocation = formatLocation;
  readonly formatSalary = formatSalary;
  readonly formatJobType = formatJobType;
  readonly formatPostedDate = formatPostedDate;
  readonly languageLabel = (code: string) => this.locale.label(code);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const id = this.route.snapshot.paramMap.get('id') ?? '';
      const job = await this.jobsService.getById(id);
      this.job.set(job);
      if (job) {
        this.viewed.track(job);
        this.jobsService.recordJobView(job.id);
        this.related.set(await this.jobsService.related(job.id));
        if (this.auth.isSignedIn()) {
          try {
            const saved = await this.seeker.loadSaved();
            this.saved.set(saved.some((item) => item.id === job.id));
          } catch {
            this.saved.set(false);
          }
          try {
            const apps = await this.applications.listMine();
            const mine = apps.find((a) => a.jobId === job.id && a.status !== 'withdrawn');
            this.appliedId.set(mine?.id ?? null);
          } catch {
            this.appliedId.set(null);
          }
          await this.loadApplyProfiles();
        }
      }
    } finally {
      this.loading.set(false);
    }
  }

  private async loadApplyProfiles(): Promise<void> {
    try {
      let list = await this.applyProfiles.list();
      if (!list.length && !this.auth.isEmployer()) {
        try {
          const profile = await this.seeker.loadProfile();
          const seeded = await this.applyProfiles.ensureDefaultFromSkills({
            skills: profile.skills ?? [],
            experienceBand: profile.experienceBand,
          });
          if (seeded) list = this.applyProfiles.items();
        } catch {
          // leave empty — Easy apply will prompt
        }
      }
      const preferred =
        list.find((p) => p.id === this.selectedProfileId) ??
        list.find((p) => p.isDefault) ??
        list[0];
      this.selectedProfileId = preferred?.id ?? '';
    } catch {
      this.selectedProfileId = '';
    }
  }

  async applyToJob(): Promise<void> {
    const job = this.job();
    if (!job) return;
    if (!this.auth.isSignedIn()) {
      this.openSignIn('apply');
      return;
    }
    if (!this.selectedProfileId) {
      await this.showToast(
        'Create an apply profile version in Account first (no CV — skills & portfolio).',
      );
      return;
    }
    this.applyBusy.set(true);
    try {
      const app = await this.applications.apply(job.id, {
        applyProfileId: this.selectedProfileId,
      });
      this.appliedId.set(app.id);
      await this.showToast('Application submitted with your selected profile version.');
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === 'object' &&
        'error' in err &&
        err.error &&
        typeof err.error === 'object' &&
        'message' in err.error
          ? String((err.error as { message: unknown }).message)
          : 'Could not apply. Check limits or if you already applied.';
      await this.showToast(msg);
    } finally {
      this.applyBusy.set(false);
    }
  }

  async markContacted(channel: 'phone' | 'whatsapp' | 'email' | 'website'): Promise<void> {
    const job = this.job();
    if (!job) return;
    if (!this.auth.isSignedIn()) {
      this.openSignIn('save');
      return;
    }
    try {
      await this.seeker.markApplication(job.id, { status: 'contacted', channel });
      await this.showToast('Marked as contacted.');
    } catch {
      await this.showToast('Could not save contact marker.');
    }
  }

  async hideJob(): Promise<void> {
    const job = this.job();
    if (!job) return;
    if (!this.auth.isSignedIn()) {
      this.openSignIn('save');
      return;
    }
    try {
      await this.seeker.hideJob(job.id);
      await this.showToast('Job hidden from your feed.');
    } catch {
      await this.showToast('Could not hide job.');
    }
  }

  onSignInOpenChange(open: boolean): void {
    this.signInOpen.set(open);
    if (!open) this.pendingAction = null;
  }

  async onSignedIn(): Promise<void> {
    const action = this.pendingAction;
    this.pendingAction = null;
    const job = this.job();
    if (job) {
      try {
        const saved = await this.seeker.loadSaved();
        this.saved.set(saved.some((item) => item.id === job.id));
      } catch {
        /* ignore */
      }
      await this.loadApplyProfiles();
    }
    if (action === 'save') await this.toggleSave();
    else if (action === 'share') await this.shareJob();
    else if (action === 'apply') await this.applyToJob();
  }

  async toggleSave(): Promise<void> {
    const job = this.job();
    if (!job) return;
    if (!this.auth.isSignedIn()) {
      this.openSignIn('save');
      return;
    }
    try {
      if (this.saved()) {
        await this.seeker.unsave(job.id);
        this.saved.set(false);
        await this.showToast('Removed from saved jobs.');
      } else {
        await this.seeker.save(job.id, job);
        this.saved.set(true);
        await this.showToast('Job saved.');
      }
    } catch {
      await this.showToast('Could not update saved jobs.');
    }
  }

  async shareJob(): Promise<void> {
    const job = this.job();
    if (!job) {
      return;
    }
    if (!this.auth.isSignedIn()) {
      this.openSignIn('share');
      return;
    }
    const url = `https://xcron.jobs/jobs/${job.slug}`;
    if (navigator.share) {
      await navigator.share({ title: job.title, text: `${job.title} at ${job.employerName}`, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    await this.showToast('Share link copied.');
  }

  async reportJob(): Promise<void> {
    const job = this.job();
    if (!job) return;
    try {
      await this.jobsService.reportJob(job.id, 'Reported as suspicious or incorrect from mobile app');
      await this.showToast('Report submitted for moderation.');
    } catch {
      await this.showToast('Could not submit report.');
    }
  }

  private openSignIn(action: PendingAction): void {
    this.pendingAction = action;
    this.signInReason.set(action);
    this.signInOpen.set(true);
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color: 'dark',
    });
    await toast.present();
  }
}
