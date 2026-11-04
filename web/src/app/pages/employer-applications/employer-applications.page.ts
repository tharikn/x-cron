import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ApplicationsService,
  type JobApplication,
} from '../../core/services/applications.service';
import { AuthService } from '../../core/services/auth.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-employer-applications',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './employer-applications.page.html',
  styleUrl: './employer-applications.page.scss',
})
export class EmployerApplicationsPage implements OnInit {
  private readonly applications = inject(ApplicationsService);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isEmployer = this.auth.isEmployer;
  readonly items = signal<JobApplication[]>([]);
  readonly selected = signal<JobApplication | null>(null);
  readonly busy = signal(false);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  note = '';
  nextStatus: JobApplication['status'] | '' = 'under_review';
  offerLetterText = '';

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Applicant review',
      description: 'Review applications with a Naukri-style timeline.',
      path: '/employer-applications',
    });
    if (this.isSignedIn() && this.isEmployer()) {
      await this.reload();
      const focusId = this.route.snapshot.queryParamMap.get('id');
      if (focusId) await this.open(focusId);
    }
  }

  async reload(): Promise<void> {
    const jobId = this.route.snapshot.queryParamMap.get('jobId');
    this.busy.set(true);
    this.error.set(null);
    try {
      if (jobId) {
        const res = await this.applications.listForJob(jobId);
        this.items.set(res.items);
      } else {
        const res = await this.applications.listEmployer();
        this.items.set(res.items);
      }
    } catch {
      this.error.set('Could not load applications.');
    } finally {
      this.busy.set(false);
    }
  }

  async open(id: string): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      const detail = await this.applications.getEmployer(id);
      this.selected.set(detail);
      this.offerLetterText = detail.offerLetterText || '';
      this.nextStatus = this.defaultNext(detail.status);
    } catch {
      this.error.set('Could not open application.');
    } finally {
      this.busy.set(false);
    }
  }

  async transition(): Promise<void> {
    const current = this.selected();
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
          this.nextStatus === 'offered' ? this.offerLetterText.trim() : undefined,
      });
      this.selected.set(updated);
      this.note = '';
      this.message.set(`Status → ${updated.statusLabel}`);
      await this.reload();
    } catch {
      this.error.set('Status update failed.');
    } finally {
      this.busy.set(false);
    }
  }

  async addNote(): Promise<void> {
    const current = this.selected();
    if (!current || !this.note.trim()) return;
    this.busy.set(true);
    try {
      this.selected.set(
        await this.applications.addNote(current.id, this.note.trim()),
      );
      this.note = '';
      this.message.set('Note added to timeline.');
    } catch {
      this.error.set('Could not add note.');
    } finally {
      this.busy.set(false);
    }
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
