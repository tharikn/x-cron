import { Component, inject, signal } from '@angular/core';
import {
  IonButton,
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

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonButton,
  ],
})
export class AccountPage {
  private readonly toastController = inject(ToastController);
  readonly mode = signal<'guest' | 'signed-in'>('guest');

  async continueAsGuest(): Promise<void> {
    this.mode.set('guest');
    const toast = await this.toastController.create({
      message: 'Browsing as guest. Sign-in is optional.',
      duration: 1800,
      color: 'dark',
    });
    await toast.present();
  }

  async startOtpStub(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Phone/email OTP auth will connect to the NestJS API later.',
      duration: 2200,
      color: 'dark',
    });
    await toast.present();
  }

  async startGoogleStub(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Google sign-in is optional and not required for browsing.',
      duration: 2200,
      color: 'dark',
    });
    await toast.present();
  }
}
