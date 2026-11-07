import { Component, input } from '@angular/core';

/** Job analytics board skeleton — KPI strip + chart panel. */
@Component({
  selector: 'app-analytics-skeleton',
  templateUrl: './analytics-skeleton.component.html',
  styleUrl: './analytics-skeleton.component.scss',
})
export class AnalyticsSkeletonComponent {
  readonly label = input('Loading analytics');
}
