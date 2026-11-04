import { Component, OnInit, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LocaleService } from '../../core/services/locale.service';
import { PreferencesService } from '../../core/services/preferences.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
  imports: [TranslatePipe],
})
export class LanguagePage implements OnInit {
  private readonly locale = inject(LocaleService);
  private readonly preferences = inject(PreferencesService);
  private readonly toastController = inject(ToastController);

  readonly language = this.locale.language;
  readonly languages = this.locale.languages;

  async ngOnInit(): Promise<void> {
    await this.preferences.hydrate();
    if (!this.locale.ready()) {
      await this.locale.hydrate(this.preferences.preferences().interfaceLocale);
    }
  }

  async select(code: string): Promise<void> {
    this.locale.setLanguage(code);
    try {
      const current = this.preferences.preferences();
      await this.preferences.save({
        ...current,
        interfaceLocale: code,
      });
      await this.showToast('App language updated.');
    } catch {
      await this.showToast('Language applied on this device.');
    }
  }

  label(code: string): string {
    return this.locale.label(code);
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
      color: 'dark',
    });
    await toast.present();
  }
}
