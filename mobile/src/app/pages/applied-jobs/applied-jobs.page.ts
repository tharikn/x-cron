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
import { Router } from '@angular/router';
import { ApplicationsService } from '../../core/services/applications.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-applied-jobs',
  imports: [
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonButton,
  ],
  templateUrl: './applied-jobs.page.html',
  styleUrls: ['./applied-jobs.page.scss'],
})
export class AppliedJobsPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly applications = inject(ApplicationsService);
  private readonly router = inject(Router);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isEmployer = this.auth.isEmployer;
  readonly items = this.applications.mine;
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.auth.ensureSession();
    if (!this.auth.isSignedIn()) return;
    if (this.auth.isEmployer()) {
      await this.router.navigate(['/tabs/employer-applications'], { replaceUrl: true });
      return;
    }
    await this.reload();
  }

  async reload(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.applications.listMine();
    } catch {
      this.error.set('Could not load applied jobs.');
    } finally {
      this.busy.set(false);
    }
  }
}
