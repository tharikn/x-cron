import { Component, input } from '@angular/core';

/** My Rating page skeleton — hero score + panels. */
@Component({
  selector: 'app-score-skeleton',
  templateUrl: './score-skeleton.component.html',
  styleUrl: './score-skeleton.component.scss',
})
export class ScoreSkeletonComponent {
  readonly label = input('Loading score');
}
