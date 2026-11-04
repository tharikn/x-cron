import { Component, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LocaleService } from '../../core/services/locale.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-language',
  imports: [TranslatePipe],
  templateUrl: './language.page.html',
  styleUrl: './language.page.scss',
})
export class LanguagePage implements OnInit {
  private readonly locale = inject(LocaleService);
  private readonly seo = inject(SeoService);

  readonly language = this.locale.language;
  readonly languages = this.locale.languages;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Language',
      description: 'Choose your interface language on X Cron Jobs.',
      path: '/settings/language',
    });
    if (!this.locale.ready()) {
      await this.locale.hydrate();
    }
  }

  select(code: string): void {
    this.locale.setLanguage(code);
  }

  label(code: string): string {
    return this.locale.label(code);
  }
}
