import { Component, computed, input } from '@angular/core';

/** Home / Discover job-card shaped placeholders (same card stack layout). */
@Component({
  selector: 'app-job-list-skeleton',
  templateUrl: './job-list-skeleton.component.html',
  styleUrl: './job-list-skeleton.component.scss',
})
export class JobListSkeletonComponent {
  readonly count = input(5);
  readonly label = input('Loading jobs');
  readonly cards = computed(() =>
    Array.from({ length: Math.max(1, Math.min(12, this.count())) }, (_, i) => i),
  );
}
