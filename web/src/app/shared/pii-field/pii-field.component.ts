import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Masked text input with eye toggle — for seeker profile PII only. */
@Component({
  selector: 'app-pii-field',
  templateUrl: './pii-field.component.html',
  styleUrl: './pii-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PiiFieldComponent),
      multi: true,
    },
  ],
})
export class PiiFieldComponent implements ControlValueAccessor {
  readonly name = input('');
  readonly autocomplete = input('');
  readonly placeholder = input('');
  readonly inputmode = input<string | null>(null);
  readonly maxlength = input<number | null>(null);
  /** Underlying input type when revealed (tel, email, text). */
  readonly revealType = input<'text' | 'tel' | 'email'>('text');

  readonly revealed = signal(false);
  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  markTouched(): void {
    this.onTouched();
  }

  toggleReveal(): void {
    this.revealed.update((v) => !v);
  }

  inputType(): string {
    return this.revealed() ? this.revealType() : 'password';
  }
}
