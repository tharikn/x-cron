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
import type { Job } from '../../core/models/job.model';
import { JobsService } from '../../core/services/jobs.service';
import { JobCardComponent } from '../../shared/job-card/job-card.component';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.page.html',
  styleUrls: ['./employer.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    JobCardComponent,
  ],
})
export class EmployerPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly jobs = inject(JobsService);

  readonly name = signal('Employer');
  readonly about = signal<string | null>(null);
  readonly verified = signal(false);
  readonly jobsList = signal<Job[]>([]);
  readonly error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    try {
      const res = await this.jobs.getPublicEmployer(id);
      this.name.set(res.name);
      this.about.set(res.about);
      this.verified.set(res.verified);
      this.jobsList.set(res.jobs);
    } catch {
      this.error.set('Employer not found.');
    }
  }
}
