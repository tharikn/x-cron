import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonNote,
  IonTitle,
  IonToolbar,
  ToastController,
  ViewWillEnter,
} from '@ionic/angular';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsService } from '../../core/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  imports: [
    DatePipe,
    RouterLink,
    TranslatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonNote,
    IonButton,
  ],
})
export class NotificationsPage implements OnInit, ViewWillEnter {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationsService);
  private readonly toastController = inject(ToastController);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly items = this.notifications.items;
  readonly unread = this.notifications.unreadCount;
  readonly busy = signal(false);

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async ionViewWillEnter(): Promise<void> {
    if (!this.auth.isSignedIn()) return;
    try {
      await this.notifications.pullNow({ announce: false });
    } catch {
      // background refresh — avoid toast spam on tab switch
    }
  }

  async reload(): Promise<void> {
    if (!this.auth.isSignedIn()) {
      this.notifications.items.set([]);
      return;
    }
    this.busy.set(true);
    try {
      await this.notifications.registerDevice();
      await this.notifications.loadPrefs();
      await this.notifications.refreshInbox({ announce: false });
    } catch {
      await this.showToast('Could not load notifications.');
    } finally {
      this.busy.set(false);
    }
  }

  async markRead(id: string): Promise<void> {
    try {
      await this.notifications.markRead(id);
    } catch {
      await this.showToast('Could not mark notification read.');
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
