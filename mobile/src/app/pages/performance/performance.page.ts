import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
  ViewWillEnter,
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import {
  ReputationMe,
  ReputationRole,
  ReputationService,
} from '../../core/services/reputation.service';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.page.html',
  styleUrls: ['./performance.page.scss'],
  imports: [
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonContent,
  ],
})
export class PerformancePage implements OnInit, ViewWillEnter {
  private readonly auth = inject(AuthService);
  private readonly reputation = inject(ReputationService);
  private readonly toastController = inject(ToastController);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isEmployer = this.auth.isEmployer;
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly items = this.reputation.mine;
  readonly activeRole = signal<ReputationRole>('seeker');

  readonly active = computed(() => {
    const role = this.activeRole();
    return this.items().find((i) => i.role === role) ?? this.items()[0] ?? null;
  });

  async ngOnInit(): Promise<void> {
    if (this.auth.isEmployer()) this.activeRole.set('employer');
    await this.reload();
  }

  async ionViewWillEnter(): Promise<void> {
    if (this.auth.isSignedIn()) await this.reload();
  }

  selectRole(role: ReputationRole): void {
    this.activeRole.set(role);
  }

  async reload(): Promise<void> {
    if (!this.auth.isSignedIn()) {
      this.reputation.mine.set([]);
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.reputation.loadMine();
    } catch {
      this.error.set('Could not load Performance Score.');
      const toast = await this.toastController.create({
        message: 'Could not load Performance Score',
        duration: 2200,
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.busy.set(false);
    }
  }

  deltaClass(delta: number): string {
    if (delta > 0) return 'up';
    if (delta < 0) return 'down';
    return '';
  }

  bandClass(item: ReputationMe | null): string {
    return item?.band ?? 'steady';
  }
}
