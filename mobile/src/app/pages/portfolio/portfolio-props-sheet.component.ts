import type { OnInit } from '@angular/core';
import { Component, input, output, signal } from '@angular/core';
import { IonButton, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption, IonToggle } from '@ionic/angular';

import type { PortfolioPropField, PortfolioSection } from '../../core/models/portfolio.model';
import { sectionLabel } from '../../core/models/portfolio.model';

import { PortfolioFieldComponent } from './portfolio-field.component';

@Component({
  selector: 'app-portfolio-props-sheet',
  imports: [IonButton, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption, IonToggle, PortfolioFieldComponent],
  templateUrl: './portfolio-props-sheet.component.html',
  styleUrl: './portfolio-props-sheet.component.scss',
})
export class PortfolioPropsSheetComponent implements OnInit {
  readonly section = input.required<PortfolioSection>();
  readonly fields = input<PortfolioPropField[]>([]);
  readonly variants = input<string[]>([]);
  readonly locale = input('en-IN');
  readonly locales = input<string[]>([]);

  readonly saveSection = output<PortfolioSection>();
  readonly dismiss = output<void>();
  readonly localeChange = output<string>();

  readonly draft = signal<PortfolioSection | null>(null);

  ngOnInit(): void {
    this.draft.set(structuredCloneSafe(this.section()));
  }

  get typeLabel(): string {
    return sectionLabel(this.section().type);
  }

  setProp(key: string, value: unknown): void {
    const current = this.draft();
    if (!current) return;
    this.draft.set({ ...current, props: { ...current.props, [key]: value } });
  }

  setVariant(variant: string): void {
    const current = this.draft();
    if (!current) return;
    this.draft.set({ ...current, variant });
  }

  setHidden(hidden: boolean): void {
    const current = this.draft();
    if (!current) return;
    this.draft.set({ ...current, hidden });
  }

  submit(): void {
    const current = this.draft();
    if (current) this.saveSection.emit(current);
  }
}

function structuredCloneSafe(section: PortfolioSection): PortfolioSection {
  return JSON.parse(JSON.stringify(section)) as PortfolioSection;
}
