import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  afterNextRender,
  computed,
  forwardRef,
  inject,
  Injector,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type DatetimePickerMode = 'date' | 'datetime';

interface CalendarCell {
  day: number;
  date: Date;
  inMonth: boolean;
  disabled: boolean;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

@Component({
  selector: 'app-xcron-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimePickerComponent),
      multi: true,
    },
  ],
  host: {
    class: 'xcron-dt',
    '[class.xcron-dt--open]': 'open()',
    '[class.xcron-dt--disabled]': 'isDisabled()',
  },
})
export class DatetimePickerComponent implements ControlValueAccessor, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  readonly mode = input<DatetimePickerMode>('datetime');
  readonly placeholder = input('Select date');
  readonly min = input<string | null>(null);
  readonly max = input<string | null>(null);
  /** When true, parent passes `[disabled]`; CVA also sets this. */
  readonly disabled = input(false);

  readonly open = signal(false);
  readonly value = signal<string>('');
  readonly cvaDisabled = signal(false);
  readonly viewYear = signal(new Date().getFullYear());
  readonly viewMonth = signal(new Date().getMonth());
  readonly hour = signal(0);
  readonly minute = signal(0);

  readonly weekdays = WEEKDAYS;
  readonly hours = HOURS;
  readonly minutes = MINUTES;

  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  readonly displayValue = computed(() => formatDisplay(this.value(), this.mode()));

  readonly monthLabel = computed(
    () => `${MONTHS[this.viewMonth()]}, ${this.viewYear()}`,
  );

  readonly cells = computed(() =>
    buildCalendarCells(
      this.viewYear(),
      this.viewMonth(),
      this.parseBound(this.min()),
      this.parseBound(this.max()),
    ),
  );

  readonly selectedYmd = computed(() => {
    const parsed = parseLocalValue(this.value());
    return parsed ? toYmd(parsed) : '';
  });

  readonly todayYmd = computed(() => toYmd(new Date()));

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  ngOnDestroy(): void {
    this.detachListeners();
  }

  writeValue(value: string | null): void {
    const next = (value ?? '').trim();
    this.value.set(next);
    this.syncViewFromValue(next);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  toggle(): void {
    if (this.isDisabled()) return;
    if (this.open()) {
      this.close();
      return;
    }
    this.syncViewFromValue(this.value());
    this.open.set(true);
    this.attachListeners();
    afterNextRender(
      () => {
        const root = this.host.nativeElement;
        const active = Array.from(
          root.querySelectorAll('.xcron-dt__time-item--active'),
        ) as HTMLElement[];
        for (const el of active) {
          el.scrollIntoView({ block: 'center', inline: 'center' });
        }
      },
      { injector: this.injector },
    );
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.detachListeners();
    this.onTouched();
  }

  prevMonth(): void {
    const m = this.viewMonth() - 1;
    if (m < 0) {
      this.viewMonth.set(11);
      this.viewYear.update((y) => y - 1);
      return;
    }
    this.viewMonth.set(m);
  }

  nextMonth(): void {
    const m = this.viewMonth() + 1;
    if (m > 11) {
      this.viewMonth.set(0);
      this.viewYear.update((y) => y + 1);
      return;
    }
    this.viewMonth.set(m);
  }

  selectDay(cell: CalendarCell): void {
    if (!cell.inMonth || cell.disabled) return;
    const next = this.composeValue(cell.date, this.hour(), this.minute());
    this.commit(next);
    if (this.mode() === 'date') {
      this.close();
    }
  }

  selectHour(h: number): void {
    this.hour.set(h);
    const base = this.selectedDateOrToday();
    this.commit(this.composeValue(base, h, this.minute()));
  }

  selectMinute(m: number): void {
    this.minute.set(m);
    const base = this.selectedDateOrToday();
    this.commit(this.composeValue(base, this.hour(), m));
  }

  clear(): void {
    this.commit('');
    this.close();
  }

  today(): void {
    const now = new Date();
    this.viewYear.set(now.getFullYear());
    this.viewMonth.set(now.getMonth());
    this.hour.set(now.getHours());
    this.minute.set(now.getMinutes());
    this.commit(this.composeValue(now, now.getHours(), now.getMinutes()));
    if (this.mode() === 'date') {
      this.close();
    }
  }

  done(): void {
    this.close();
  }

  isSelected(cell: CalendarCell): boolean {
    return cell.inMonth && toYmd(cell.date) === this.selectedYmd();
  }

  isToday(cell: CalendarCell): boolean {
    return cell.inMonth && toYmd(cell.date) === this.todayYmd();
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  @HostListener('keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open()) {
      event.preventDefault();
      this.close();
    }
  }

  private commit(next: string): void {
    this.value.set(next);
    this.onChange(next);
  }

  private composeValue(date: Date, hour: number, minute: number): string {
    const y = date.getFullYear();
    const m = this.pad(date.getMonth() + 1);
    const d = this.pad(date.getDate());
    if (this.mode() === 'date') {
      return `${y}-${m}-${d}`;
    }
    return `${y}-${m}-${d}T${this.pad(hour)}:${this.pad(minute)}`;
  }

  private selectedDateOrToday(): Date {
    return parseLocalValue(this.value()) ?? new Date();
  }

  private syncViewFromValue(raw: string): void {
    const parsed = parseLocalValue(raw) ?? new Date();
    this.viewYear.set(parsed.getFullYear());
    this.viewMonth.set(parsed.getMonth());
    this.hour.set(parsed.getHours());
    this.minute.set(parsed.getMinutes());
  }

  private parseBound(raw: string | null): Date | null {
    if (!raw?.trim()) return null;
    return parseLocalValue(raw.trim());
  }

  private readonly onDocPointer = (event: Event): void => {
    if (typeof document === 'undefined') return;
    const target = event.target as Node | null;
    if (!target) return;
    if (!this.host.nativeElement.contains(target)) {
      this.close();
    }
  };

  private attachListeners(): void {
    if (typeof document === 'undefined') return;
    document.addEventListener('pointerdown', this.onDocPointer, true);
  }

  private detachListeners(): void {
    if (typeof document === 'undefined') return;
    document.removeEventListener('pointerdown', this.onDocPointer, true);
  }
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function toYmd(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseLocalValue(raw: string): Date | null {
  const value = raw.trim();
  if (!value) return null;
  // YYYY-MM-DD or YYYY-MM-DDTHH:mm (optional seconds)
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::\d{2})?)?$/.exec(value);
  if (!match) {
    const fallback = new Date(value);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const hour = match[4] != null ? Number(match[4]) : 0;
  const minute = match[5] != null ? Number(match[5]) : 0;
  const d = new Date(year, month, day, hour, minute, 0, 0);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDisplay(raw: string, mode: DatetimePickerMode): string {
  const d = parseLocalValue(raw);
  if (!d) return '';
  const date = `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;
  if (mode === 'date') return date;
  return `${date} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function buildCalendarCells(
  year: number,
  month: number,
  min: Date | null,
  max: Date | null,
): CalendarCell[] {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let i = startPad - 1; i >= 0; i -= 1) {
    const day = prevDays - i;
    const date = new Date(year, month - 1, day);
    cells.push({ day, date, inMonth: false, disabled: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({
      day,
      date,
      inMonth: true,
      disabled: isOutOfBounds(date, min, max),
    });
  }

  while (cells.length % 7 !== 0) {
    const day = cells.length - (startPad + daysInMonth) + 1;
    const date = new Date(year, month + 1, day);
    cells.push({ day, date, inMonth: false, disabled: true });
  }

  return cells;
}

function isOutOfBounds(date: Date, min: Date | null, max: Date | null): boolean {
  const t = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  if (min) {
    const minT = new Date(min.getFullYear(), min.getMonth(), min.getDate()).getTime();
    if (t < minT) return true;
  }
  if (max) {
    const maxT = new Date(max.getFullYear(), max.getMonth(), max.getDate()).getTime();
    if (t > maxT) return true;
  }
  return false;
}
