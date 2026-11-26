import type { OnInit } from '@angular/core';
import { Component, input, output, signal } from '@angular/core';
import { IonButton, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular';

import type { PortfolioTheme } from '../../core/models/portfolio.model';

interface ThemePreset {
  label: string;
  mode: PortfolioTheme['mode'];
  primary: string;
  accent: string;
  surface: string;
  text: string;
}

const PRESETS: ThemePreset[] = [
  {
    label: 'Violet',
    mode: 'dark',
    primary: '#ffffff',
    accent: '#7c5cff',
    surface: '#14101f',
    text: '#ffffff',
  },
  {
    label: 'Midnight',
    mode: 'dark',
    primary: '#e8f1ff',
    accent: '#38bdf8',
    surface: '#0b1220',
    text: '#e8f1ff',
  },
  {
    label: 'Paper',
    mode: 'light',
    primary: '#1a1430',
    accent: '#7c5cff',
    surface: '#ffffff',
    text: '#1a1430',
  },
  {
    label: 'Editorial',
    mode: 'light',
    primary: '#1f1812',
    accent: '#c2410c',
    surface: '#fffaf3',
    text: '#1f1812',
  },
];

const FONTS = ['Outfit', 'Manrope', 'Fraunces', 'Noto Sans Tamil', 'Georgia', 'System', 'Mono'];

@Component({
  selector: 'app-portfolio-theme-sheet',
  imports: [IonButton, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption],
  templateUrl: './portfolio-theme-sheet.component.html',
  styleUrl: './portfolio-theme-sheet.component.scss',
})
export class PortfolioThemeSheetComponent implements OnInit {
  readonly theme = input.required<PortfolioTheme>();
  readonly applyTheme = output<PortfolioTheme>();
  readonly dismiss = output<void>();

  readonly presets = PRESETS;
  readonly fonts = FONTS;
  readonly draft = signal<PortfolioTheme | null>(null);

  ngOnInit(): void {
    this.draft.set(JSON.parse(JSON.stringify(this.theme())) as PortfolioTheme);
  }

  setToken(token: keyof PortfolioTheme['tokens'], value: string): void {
    const current = this.draft();
    if (!current) return;
    this.draft.set({ ...current, tokens: { ...current.tokens, [token]: value } });
  }

  setMode(mode: PortfolioTheme['mode']): void {
    const current = this.draft();
    if (!current) return;
    this.draft.set({ ...current, mode });
  }

  usePreset(preset: ThemePreset): void {
    const current = this.draft();
    if (!current) return;
    this.draft.set({
      ...current,
      mode: preset.mode,
      tokens: {
        ...current.tokens,
        primary: preset.primary,
        accent: preset.accent,
        surface: preset.surface,
        text: preset.text,
      },
    });
  }

  submit(): void {
    const current = this.draft();
    if (current) this.applyTheme.emit(current);
  }
}
