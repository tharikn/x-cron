import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { CompaniesService } from '../../core/services/companies.service';
import { friendlyHttpMessage } from '../../core/utils/friendly-http-message';

@Component({
  selector: 'app-company-invite',
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Invitation</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      @if (!auth.isSignedIn()) {
        <p>Sign in with the invited email to join this company.</p>
        <ion-button routerLink="/tabs/account" [queryParams]="{ returnUrl: returnUrl }">
          Sign in
        </ion-button>
      } @else if (done()) {
        <p>You’re on the team.</p>
        <ion-button routerLink="/tabs/company">Open company workspace</ion-button>
      } @else if (error()) {
        <p>{{ error() }}</p>
      } @else {
        <p>Accepting invitation…</p>
      }
    </ion-content>
  `,
})
export class CompanyInvitePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly companies = inject(CompaniesService);
  private readonly toastController = inject(ToastController);
  readonly auth = inject(AuthService);

  readonly done = signal(false);
  readonly error = signal<string | null>(null);
  returnUrl = '/tabs/company-invitations/accept';

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.paramMap.get('token') ?? '';
    this.returnUrl = `/tabs/company-invitations/${token}/accept`;
    if (!token) {
      this.error.set('Missing invitation token');
      return;
    }
    if (!this.auth.isSignedIn()) return;
    try {
      await this.companies.acceptInvitation(token);
      this.done.set(true);
      const t = await this.toastController.create({
        message: 'Joined company',
        duration: 2400,
        color: 'success',
      });
      await t.present();
      await this.router.navigateByUrl('/tabs/company');
    } catch (err) {
      this.error.set(friendlyHttpMessage(err, 'Could not accept invitation'));
    }
  }
}
