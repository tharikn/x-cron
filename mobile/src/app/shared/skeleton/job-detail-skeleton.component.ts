import { Component, input } from '@angular/core';

/** Job / application detail skeleton matching page panels. */
@Component({
  selector: 'app-job-detail-skeleton',
  templateUrl: './job-detail-skeleton.component.html',
  styleUrl: './job-detail-skeleton.component.scss',
})
export class JobDetailSkeletonComponent {
  readonly label = input('Loading job');
}
