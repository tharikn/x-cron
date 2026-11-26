import { Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ResumeLaunchService } from '../../core/services/resume-launch.service';

export type PortalChoice = 'jobs' | 'resume' | 'portfolio';

@Component({
  selector: 'app-portal-choice-prompt',
  imports: [],
  templateUrl: './portal-choice-prompt.component.html',
  styleUrl: './portal-choice-prompt.component.scss',
})
export class PortalChoicePromptComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly resumeLaunch = inject(ResumeLaunchService);

  readonly closed = output<void>();

  async choose(choice: PortalChoice): Promise<void> {
    this.closed.emit();

    if (choice === 'jobs') {
      if (this.auth.isSignedIn()) {
        await this.router.navigateByUrl('/');
      } else {
        await this.router.navigate(['/sign-in'], {
          queryParams: { returnUrl: '/' },
        });
      }
      return;
    }

    if (choice === 'resume') {
      if (this.auth.isSignedIn()) {
        void this.resumeLaunch.launch();
      } else {
        await this.router.navigate(['/sign-in'], {
          queryParams: { intent: 'resume' },
        });
      }
      return;
    }

    if (choice === 'portfolio') {
      if (this.auth.isSignedIn()) {
        await this.router.navigateByUrl('/portfolio');
      } else {
        await this.router.navigate(['/sign-in'], {
          queryParams: { returnUrl: '/portfolio' },
        });
      }
      return;
    }
  }

  skip(): void {
    this.closed.emit();
  }
}
