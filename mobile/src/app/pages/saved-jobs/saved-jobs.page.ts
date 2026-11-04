import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, ToastController } from '@ionic/angular';
import type { Job } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { SeekerService } from '../../core/services/seeker.service';

@Component({
  selector: 'app-saved-jobs',
  templateUrl: './saved-jobs.page.html',
  styleUrls: ['./saved-jobs.page.scss'],
  imports: [RouterLink, TranslatePipe, IonButton],
})
export class SavedJobsPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly seeker = inject(SeekerService);
  private readonly toastController = inject(ToastController);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly savedJobs = this.seeker.saved;
  readonly busy = signal(false);
  readonly removingId = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    if (!this.auth.isSignedIn()) {
      this.seeker.saved.set([]);
      return;
    }
    this.busy.set(true);
    try {
      await this.seeker.loadSaved();
    } catch {
      await this.showToast('Could not load saved jobs.');
    } finally {
      this.busy.set(false);
    }
  }

  async remove(job: Job): Promise<void> {
    if (this.removingId()) return;
    this.removingId.set(job.id);
    try {
      await this.seeker.unsave(job.id);
      await this.showToast('Removed from saved jobs.');
    } catch {
      await this.showToast('Could not remove saved job.');
    } finally {
      this.removingId.set(null);
    }
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      color: 'dark',
    });
    await toast.present();
  }
}
