import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import {
  LocationsService,
  type LocationSuggestion,
} from '../../services/locations.service';

@Component({
  selector: 'app-location-typeahead',
  templateUrl: './location-typeahead.component.html',
  styleUrl: './location-typeahead.component.scss',
})
export class LocationTypeaheadComponent {
  private readonly locations = inject(LocationsService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly placeholder = input('City or district');
  readonly name = input('location');
  readonly value = model('');

  readonly suggestions = signal<LocationSuggestion[]>([]);
  readonly open = signal(false);

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  onFocus(): void {
    if (this.suggestions().length) this.open.set(true);
  }

  onInput(raw: string): void {
    this.value.set(raw);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => void this.lookup(raw), 280);
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
