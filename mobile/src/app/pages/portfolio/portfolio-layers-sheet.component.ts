import { Component, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular';

import type { PortfolioSection } from '../../core/models/portfolio.model';
import { sectionLabel } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-portfolio-layers-sheet',
  imports: [IonButton, IonIcon],
  templateUrl: './portfolio-layers-sheet.component.html',
  styleUrl: './portfolio-layers-sheet.component.scss',
})
export class PortfolioLayersSheetComponent {
  readonly sections = input<PortfolioSection[]>([]);
  readonly selectedId = input<string | null>(null);
  readonly selectSection = output<string>();
  readonly toggleVisibility = output<string>();
  readonly reorder = output<{ index: number; offset: number }>();
  readonly dismiss = output<void>();

  label(section: PortfolioSection): string {
    return sectionLabel(section.type);
  }
}
