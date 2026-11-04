import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import {
  ApplicationsService,
  type JobApplication,
} from '../../core/services/applications.service';
import type { Job } from '../../core/models/job.model';

@Component({
  selector: 'app-employer-applications',
  templateUrl: './employer-applications.page.html',
  styleUrls: ['./employer-applications.page.scss'],
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
  ],
})
export class EmployerApplicationsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly applications = inject(ApplicationsService);

  readonly items = signal<JobApplication[]>([]);
  readonly job = signal<Job | null>(null);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    const jobId = this.route.snapshot.queryParamMap.get('jobId');
    this.busy.set(true);
    this.error.set(null);
    try {
      if (jobId) {
        const res = await this.applications.listForJob(jobId);
        this.job.set(res.job);
        this.items.set(res.items);
      } else {
        this.job.set(null);
        this.items.set(await this.applications.listEmployer());
      }
    } catch {
      this.error.set('Could not load applications.');
      this.items.set([]);
    } finally {
      this.busy.set(false);
    }
  }
}
