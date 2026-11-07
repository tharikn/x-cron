import { Component, computed, input } from '@angular/core';

export type ListSkeletonVariant = 'applied' | 'inbox' | 'rows' | 'split';

/** Layout-matched list skeletons (applied rows, inbox cards, generic rows). */
@Component({
  selector: 'app-list-skeleton',
  templateUrl: './list-skeleton.component.html',
  styleUrl: './list-skeleton.component.scss',
})
export class ListSkeletonComponent {
  readonly count = input(4);
  readonly label = input('Loading');
  readonly variant = input<ListSkeletonVariant>('rows');
  readonly items = computed(() =>
    Array.from({ length: Math.max(1, Math.min(12, this.count())) }, (_, i) => i),
  );
}
