import { Component, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular';

import type { PortfolioComponentDefinition } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-portfolio-section-picker',
  imports: [IonButton, IonIcon],
  templateUrl: './portfolio-section-picker.component.html',
  styleUrl: './portfolio-section-picker.component.scss',
})
export class PortfolioSectionPickerComponent {
  readonly components = input<PortfolioComponentDefinition[]>([]);
  readonly selectSection = output<string>();
  readonly dismiss = output<void>();
}
