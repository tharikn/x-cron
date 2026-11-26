import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonButton, IonIcon, IonInput, IonItem, IonLabel, IonTextarea, IonToggle } from '@ionic/angular';

import { useImageUpload } from '../../core/hooks/use-image-upload';
import type { PortfolioPropField } from '../../core/models/portfolio.model';

import { emptyValueForField, localizedForEdit, moveItem, setLocalizedValue } from './portfolio-editor.utils';

/** One registry-driven field. Recurses for objectList row fields. */
@Component({
  selector: 'app-portfolio-field',
  imports: [FormsModule, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonTextarea, IonToggle],
  templateUrl: './portfolio-field.component.html',
  styleUrl: './portfolio-field.component.scss',
})
export class PortfolioFieldComponent {
  readonly field = input.required<PortfolioPropField>();
  readonly value = model<unknown>();
  readonly locale = input('en-IN');

  private readonly imageUpload = useImageUpload();
  readonly uploading = this.imageUpload.pending;
  readonly uploadError = this.imageUpload.error;

  get localized(): string {
    return localizedForEdit(this.value(), this.locale());
  }

  set localized(next: string) {
    this.value.set(setLocalizedValue(this.value(), this.locale(), next));
  }

  get text(): string {
    return typeof this.value() === 'string' ? (this.value() as string) : '';
  }

  set text(next: string) {
    this.value.set(next);
  }

  get checked(): boolean {
    return this.value() === true;
  }

  set checked(next: boolean) {
    this.value.set(next);
  }

  get numeric(): number | null {
    const current = this.value();
    if (current === '' || current === null || current === undefined) return null;
    const parsed = Number(current);
    return Number.isFinite(parsed) ? parsed : null;
  }

  set numeric(next: number | null) {
    this.value.set(next === null ? '' : String(next));
  }

  get list(): unknown[] {
    return Array.isArray(this.value()) ? [...(this.value() as unknown[])] : [];
  }

  get rows(): Record<string, unknown>[] {
    return this.list.filter(
      (row): row is Record<string, unknown> => Boolean(row) && typeof row === 'object' && !Array.isArray(row),
    );
  }

  rowValue(row: Record<string, unknown>, key: string): unknown {
    return row[key];
  }

  localizedRowValue(row: Record<string, unknown>, key: string): string {
    return localizedForEdit(row[key], this.locale());
  }

  setRowValue(row: Record<string, unknown>, key: string, next: unknown): void {
    this.replaceRow(row, { ...row, [key]: next });
  }

  setRowLocalized(row: Record<string, unknown>, key: string, next: string): void {
    this.setRowValue(row, key, setLocalizedValue(row[key], this.locale(), next));
  }

  private replaceRow(row: Record<string, unknown>, next: Record<string, unknown>): void {
    const rows = this.rows;
    const index = rows.indexOf(row);
    if (index < 0) return;
    rows[index] = next;
    this.value.set(rows);
  }

  addListItem(): void {
    this.value.set([...this.list, '']);
  }

  updateListItem(index: number, next: string): void {
    const items = this.list;
    if (index < 0 || index >= items.length) return;
    items[index] = next;
    this.value.set(items);
  }

  removeListItem(index: number): void {
    this.value.set(this.list.filter((_item, i) => i !== index));
  }

  addRow(): void {
    const nested = this.field().itemFields ?? [];
    const row: Record<string, unknown> = {};
    for (const itemField of nested) {
      row[itemField.key] = emptyValueForField(itemField, this.locale());
    }
    this.value.set([...this.rows, row]);
  }

  removeRow(index: number): void {
    this.value.set(this.rows.filter((_row, i) => i !== index));
  }

  moveRow(index: number, offset: number): void {
    const target = index + offset;
    if (target < 0 || target >= this.rows.length) return;
    this.value.set(moveItem(this.rows, index, target));
  }

  async onImageFilePicked(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const asset = await this.imageUpload.upload(file, 'portfolio');
    if (asset) this.text = asset.url;
  }

  async pickFromCamera(): Promise<void> {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
      });
      const response = await fetch(photo.webPath || photo.path || '');
      const blob = await response.blob();
      const asset = await this.imageUpload.upload(
        new File([blob], `capture-${Date.now()}.jpg`, {
          type: blob.type || 'image/jpeg',
        }),
        'portfolio',
      );
      if (asset) this.text = asset.url;
    } catch {
      this.imageUpload.clearError();
    }
  }
}
