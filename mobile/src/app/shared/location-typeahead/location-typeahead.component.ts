import { Component, inject, input, model, signal } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
} from '@ionic/angular';
import {
  LocationsService,
  type LocationSuggestion,
} from '../../core/services/locations.service';

@Component({
  selector: 'app-location-typeahead',
  templateUrl: './location-typeahead.component.html',
  styleUrls: ['./location-typeahead.component.scss'],
  imports: [IonSearchbar, IonList, IonItem, IonLabel],
})
export class LocationTypeaheadComponent {
  private readonly locations = inject(LocationsService);

  readonly placeholder = input('Location (city / district)');
  /** Two-way bind preferred; also works as one-way + (valueChange). */
  readonly value = model('');

  readonly suggestions = signal<LocationSuggestion[]>([]);
  readonly open = signal(false);

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onInput(raw: string | null | undefined): void {
    const next = raw ?? '';
    this.value.set(next);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => void this.lookup(next), 280);
  }

  pick(item: LocationSuggestion): void {
    this.value.set(item.name);
    this.suggestions.set([]);
    this.open.set(false);
  }

  private async lookup(raw: string): Promise<void> {
    const q = raw.trim();
    if (q.length < 2) {
      this.suggestions.set([]);
      this.open.set(false);
      return;
    }
    const items = await this.locations.search(q);
    this.suggestions.set(items);
    this.open.set(items.length > 0);
  }
}
