import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CompaniesService } from '../../core/services/companies.service';
import { ToastService } from '../../core/services/toast.service';
import { friendlyHttpMessage } from '../../core/utils/friendly-http-message';

@Component({
  selector: 'app-company-invite',
  imports: [RouterLink],
  template: `
    <section class="invite">
      <h1>Company invitation</h1>
      @if (!auth.isSignedIn()) {
        <p>Sign in with the invited email to join this company.</p>
        <a routerLink="/sign-in" [queryParams]="{ returnUrl: returnUrl }">Sign in</a>
      } @else if (done()) {
        <p>You’re on the team. Open your company workspace to continue.</p>
        <a routerLink="/company">Open company workspace</a>
      } @else if (error()) {
        <p class="err">{{ error() }}</p>
        <a routerLink="/sign-in">Back to sign in</a>
      } @else {
        <p>Accepting invitation…</p>
      }
    </section>
  `,
  styles: [
    `
      .invite {
        width: min(560px, calc(100% - 2rem));
        margin: 2rem auto;
        padding: 1.25rem;
        border-radius: var(--xcron-radius-lg, 14px);
        background: var(--xcron-bg-elevated);
        border: 1px solid var(--xcron-line);
        color: var(--xcron-ink);
      }
      .err {
        color: #f43f5e;
      }
      a {
        color: var(--xcron-primary-hover);
      }
    `,
  ],
})
export class CompanyInvitePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly companies = inject(CompaniesService);
  private readonly toast = inject(ToastService);
  readonly auth = inject(AuthService);

  readonly done = signal(false);
  readonly error = signal<string | null>(null);
  returnUrl = '/company-invitations/accept';

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.paramMap.get('token') ?? '';
    this.returnUrl = `/company-invitations/${token}/accept`;
    if (!token) {
      this.error.set('Missing invitation token');
      return;
    }
    if (!this.auth.isSignedIn()) return;
    try {
      await this.companies.acceptInvitation(token);
      this.done.set(true);
      this.toast.success('Joined company');
      await this.router.navigateByUrl('/company');
    } catch (err) {
      this.error.set(friendlyHttpMessage(err, 'Could not accept invitation'));
    }
  }
}
