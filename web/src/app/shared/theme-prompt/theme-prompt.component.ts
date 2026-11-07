import { Component, inject, output } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { OnboardingService } from '../../core/services/onboarding.service';
import {
  ThemePreference,
  ThemeService,
} from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-prompt',
  imports: [TranslatePipe],
  templateUrl: './theme-prompt.component.html',
  styleUrl: './theme-prompt.component.scss',
})
export class ThemePromptComponent {
  private readonly theme = inject(ThemeService);
  private readonly onboarding = inject(OnboardingService);

  readonly closed = output<void>();

  readonly preference = this.theme.preference;
  readonly options: ThemePreference[] = ['system', 'light', 'dark', 'warm'];

  async select(pref: ThemePreference): Promise<void> {
    await this.theme.setPreference(pref);
  }

  async continue(): Promise<void> {
    this.onboarding.completeThemePrompt();
    this.closed.emit();
  }

  labelKey(pref: ThemePreference): string {
    return this.theme.labelKey(pref);
  }

  hintKey(pref: ThemePreference): string {
    return this.theme.hintKey(pref);
  }
}
