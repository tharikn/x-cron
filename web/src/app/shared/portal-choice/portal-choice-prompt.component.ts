import { Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ResumeLaunchService } from '../../core/services/resume-launch.service';

export type PortalChoice = 'jobs' | 'resume';

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
        // Already signed in, go directly to home/jobs
        await this.router.navigateByUrl('/');
      } else {
        // Needs sign in / sign up for jobs
        await this.router.navigate(['/sign-in'], {
          queryParams: { returnUrl: '/' },
        });
      }
      return;
    }

    if (choice === 'resume') {
      if (this.auth.isSignedIn()) {
        // Already signed in, launch the resume builder handoff directly
        void this.resumeLaunch.launch();
      } else {
        // Needs sign in / sign up, then will trigger resume handoff
        await this.router.navigate(['/sign-in'], {
          queryParams: { intent: 'resume' },
        });
      }
      return;
    }
  }

  skip(): void {
    this.closed.emit();
  }
}
