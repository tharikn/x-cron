import { Component, input, output } from '@angular/core';

export type PortfolioWizardStep = 1 | 2 | 3;

interface PortfolioWizardStepDefinition {
  readonly id: PortfolioWizardStep;
  readonly label: string;
  readonly hint: string;
}

/**
 * Portfolio-local stepper shared by the creation wizard and the editor.
 * The editor renders it locked with step 3 active, so the create → design
 * journey stays visually continuous.
 */
@Component({
  selector: 'app-portfolio-wizard-stepper',
  templateUrl: './portfolio-wizard-stepper.component.html',
  styleUrl: './portfolio-wizard-stepper.component.scss',
})
export class PortfolioWizardStepperComponent {
  readonly active = input.required<PortfolioWizardStep>();
  readonly locked = input(false);
  readonly compact = input(false);
  readonly navigate = output<PortfolioWizardStep>();

  readonly steps: readonly PortfolioWizardStepDefinition[] = [
    { id: 1, label: 'Choose a design', hint: 'Start from a template' },
    { id: 2, label: 'Add the details', hint: 'Name, slug and languages' },
    { id: 3, label: 'Design your portfolio', hint: 'Customize sections and theme' },
  ];

  state(id: PortfolioWizardStep): 'done' | 'active' | 'upcoming' {
    if (id === this.active()) return 'active';
    return id < this.active() ? 'done' : 'upcoming';
  }

  marker(id: PortfolioWizardStep): string {
    return this.state(id) === 'done' ? '✓' : String(id);
  }

  go(id: PortfolioWizardStep): void {
    if (this.locked() || id >= this.active()) return;
    this.navigate.emit(id);
  }
}
