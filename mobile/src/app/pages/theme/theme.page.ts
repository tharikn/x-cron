import { Component, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LocaleService } from '../../core/services/locale.service';
import {
  ThemePreference,
  ThemeService,
} from '../../core/services/theme.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.page.html',
  styleUrls: ['./theme.page.scss'],
  imports: [TranslatePipe],
})
export class ThemePage implements OnInit {
  private readonly theme = inject(ThemeService);
  private readonly locale = inject(LocaleService);

  readonly preference = this.theme.preference;
  readonly options: ThemePreference[] = ['system', 'light', 'dark', 'warm'];

  async ngOnInit(): Promise<void> {
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
  }

  async select(pref: ThemePreference): Promise<void> {
    await this.theme.setPreference(pref);
  }

  labelKey(pref: ThemePreference): string {
    return this.theme.labelKey(pref);
  }

  hintKey(pref: ThemePreference): string {
    return this.theme.hintKey(pref);
  }
}
