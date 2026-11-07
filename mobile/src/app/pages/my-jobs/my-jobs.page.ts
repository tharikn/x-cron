import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import type { Job } from '../../core/models/job.model';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { ListSkeletonComponent } from '../../shared/skeleton/list-skeleton.component';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.page.html',
  styleUrls: ['./my-jobs.page.scss'],
  imports: [
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    ListSkeletonComponent,
  ],
})
export class MyJobsPage implements OnInit {
  private readonly jobsService = inject(JobsService);
  private readonly auth = inject(AuthService);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isEmployer = this.auth.isEmployer;
  readonly jobs = signal<Job[]>([]);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly total = signal(0);

  async ngOnInit(): Promise<void> {
    if (this.auth.isSignedIn() && this.auth.isEmployer()) {
      await this.reload();
    }
  }

  async reload(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      const res = await this.jobsService.listMyJobs({ page: 1, limit: 50 });
      this.jobs.set(res.items);
      this.total.set(res.total);
    } catch {
      this.error.set('Could not load posted jobs.');
      this.jobs.set([]);
    } finally {
      this.busy.set(false);
    }
  }
}
