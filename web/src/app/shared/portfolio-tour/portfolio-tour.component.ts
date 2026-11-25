import {
  inject,
  output,
  Component,
  AfterViewInit,
} from '@angular/core';
import { PortfolioTourService, type TourStep } from '../../core/services/portfolio-tour.service';
import { ToastService } from '../../core/services/toast.service';

/**
 * Portfolio editor tour overlay.
 *
 * Shows a step-by-step walkthrough the first time a user opens the editor,
 * highlighting the sections panel, content/design/theme tabs, publish area,
 * versions list and the live link. Can be re-opened from the Help button.
 */
@Component({
  selector: 'app-portfolio-tour',
  imports: [],
  templateUrl: './portfolio-tour.component.html',
  styleUrl: './portfolio-tour.component.scss',
})
export class PortfolioTourComponent implements AfterViewInit {
  private readonly tour = inject(PortfolioTourService);
  private readonly toast = inject(ToastService);

  /** Emitted whenever the active step changes so the host can reveal its target. */
  readonly stepChange = output<TourStep | null>();

  readonly isActive = this.tour.isActive;
  readonly current = this.tour.current;
  readonly currentNumber = this.tour.currentNumber;
  readonly total = this.tour.total;
  readonly isLast = this.tour.isLast;
  readonly highlightRect = this.tour.highlightRect;

  ngAfterViewInit(): void {
    // Align the highlight box once the editor view has rendered.
    this.tour.measure();
  }

  next(): void {
    this.tour.next();
    this.stepChange.emit(this.tour.current());
  }

  prev(): void {
    this.tour.prev();
    this.stepChange.emit(this.tour.current());
  }

  finish(): void {
    this.tour.finish();
    this.toast.success('Tour finished. Reopen it anytime from Help in the top bar.');
  }

  skip(): void {
    this.tour.skip();
  }

  reset(): void {
    this.tour.reset();
  }

  /** Extra hint text shown for the current step. */
  stepHint(step: TourStep | null | undefined): string {
    return step?.hint ?? '';
  }
}
