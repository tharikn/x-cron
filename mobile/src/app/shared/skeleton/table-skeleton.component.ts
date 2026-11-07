import { Component, computed, input } from '@angular/core';

/** Full table skeleton — header + body rows matching admin/my-jobs tables. */
@Component({
  selector: 'app-table-skeleton',
  templateUrl: './table-skeleton.component.html',
  styleUrl: './table-skeleton.component.scss',
})
export class TableSkeletonComponent {
  readonly rows = input(6);
  readonly columns = input(7);
  readonly labels = input<string[]>([]);
  readonly label = input('Loading table');

  readonly rowIndexes = computed(() =>
    Array.from({ length: Math.max(1, Math.min(20, this.rows())) }, (_, i) => i),
  );
  readonly colIndexes = computed(() =>
    Array.from({ length: Math.max(1, Math.min(12, this.columns())) }, (_, i) => i),
  );
  readonly headerLabels = computed(() => {
    const custom = this.labels();
    const cols = this.colIndexes();
    return cols.map((i) => custom[i] ?? '');
  });
}
