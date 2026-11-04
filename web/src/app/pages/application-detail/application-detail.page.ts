import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ApplicationsService,
  type ApplicationMessage,
  type JobApplication,
} from '../../core/services/applications.service';
import { AuthService } from '../../core/services/auth.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { jobPath } from '../../core/utils/format';

@Component({
  selector: 'app-application-detail',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './application-detail.page.html',
  styleUrl: './application-detail.page.scss',
})
export class ApplicationDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly applications = inject(ApplicationsService);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  readonly app = signal<JobApplication | null>(null);
  readonly messages = signal<ApplicationMessage[]>([]);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly isSignedIn = this.auth.isSignedIn;
  readonly isEmployer = this.auth.isEmployer;
  readonly asEmployer = signal(false);
  readonly jobPath = jobPath;

  note = '';
  chatBody = '';
  nextStatus: JobApplication['status'] | '' = '';
  offerLetterText = '';

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const mode = this.route.snapshot.queryParamMap.get('as') === 'employer';
    this.asEmployer.set(mode && this.isEmployer());
    this.seo.setPage({
      title: this.asEmployer() ? 'Applicant review' : 'Application timeline',
      description: 'Track your job application status with date and hour.',
      path: this.asEmployer() ? '/employer-applications' : '/me/applications',
      robots: 'noindex,follow',
    });
    if (!this.auth.isSignedIn()) return;
    await this.reload(id);
  }

  async reload(id?: string): Promise<void> {
    const appId = id || this.app()?.id;
    if (!appId) return;
    this.busy.set(true);
    this.error.set(null);
    try {
      const detail = this.asEmployer()
        ? await this.applications.getEmployer(appId)
        : await this.applications.getMine(appId);
      this.app.set(detail);
      this.messages.set(detail.messages ?? []);
      this.offerLetterText = detail.offerLetterText || '';
      if (!this.nextStatus) {
        this.nextStatus = this.defaultNext(detail.status);
      }
    } catch {
      this.error.set('Could not load application.');
      this.app.set(null);
    } finally {
      this.busy.set(false);
    }
  }

  async withdraw(): Promise<void> {
    const current = this.app();
    if (!current) return;
    this.busy.set(true);
    try {
      const updated = await this.applications.withdraw(current.id);
      this.app.set(updated);
      this.messages.set(updated.messages ?? this.messages());
      this.toast.show('Application withdrawn.');
    } catch {
      this.error.set('Withdraw failed.');
    } finally {
      this.busy.set(false);
    }
  }

  async transition(): Promise<void> {
    const current = this.app();
    if (!current || !this.nextStatus) return;
    if (this.nextStatus === 'offered' && !this.offerLetterText.trim()) {
      this.error.set('Offer / job letter text is required.');
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      const updated = await this.applications.transition(current.id, {
        status: this.nextStatus as Exclude<JobApplication['status'], 'withdrawn'>,
        note: this.note.trim() || undefined,
        offerLetterText:
          this.nextStatus === 'offered'
            ? this.offerLetterText.trim()
            : undefined,
      });
      this.app.set(updated);
      this.messages.set(updated.messages ?? this.messages());
      this.note = '';
      this.nextStatus = this.defaultNext(updated.status);
      this.toast.show(`Status → ${updated.statusLabel}`);
    } catch {
      this.error.set('Status update failed.');
    } finally {
      this.busy.set(false);
    }
  }

  async addNote(): Promise<void> {
    const current = this.app();
    if (!current || !this.note.trim()) return;
    this.busy.set(true);
    try {
      const updated = await this.applications.addNote(current.id, this.note.trim());
      this.app.set(updated);
      this.messages.set(updated.messages ?? this.messages());
      this.note = '';
    } catch {
      this.error.set('Could not add note.');
    } finally {
      this.busy.set(false);
    }
  }

  async sendChat(): Promise<void> {
    const current = this.app();
    if (!current || !this.chatBody.trim()) return;
    this.busy.set(true);
    try {
      const msg = await this.applications.sendMessage(
        current.id,
        this.chatBody.trim(),
        this.asEmployer(),
      );
      this.messages.update((list) => [...list, msg]);
      this.chatBody = '';
    } catch {
      this.error.set('Could not send message.');
    } finally {
      this.busy.set(false);
    }
  }

  canWithdraw(status: JobApplication['status']): boolean {
    return !['hired', 'rejected', 'withdrawn'].includes(status);
  }

  canChat(status: JobApplication['status']): boolean {
    return !['hired', 'rejected', 'withdrawn'].includes(status);
  }

  eventLabel(type: string): string {
    return type.replace(/_/g, ' ');
  }

  private defaultNext(
    status: JobApplication['status'],
  ): JobApplication['status'] | '' {
    const map: Partial<Record<JobApplication['status'], JobApplication['status']>> =
      {
        applied: 'under_review',
        under_review: 'shortlisted',
        shortlisted: 'interview',
        interview: 'offered',
        offered: 'hired',
      };
    return map[status] ?? '';
  }
}
