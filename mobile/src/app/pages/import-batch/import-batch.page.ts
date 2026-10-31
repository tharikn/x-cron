import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Clipboard } from '@capacitor/clipboard';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import {
  ImportBatch,
  ImportRecord,
  IngestionService,
} from '../../core/services/ingestion.service';

@Component({
  selector: 'app-import-batch',
  templateUrl: './import-batch.page.html',
  styleUrls: ['./import-batch.page.scss'],
  imports: [
    FormsModule,
    RouterLink,
    DecimalPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonTextarea,
    IonCheckbox,
  ],
})
export class ImportBatchPage implements OnInit {
  private readonly ingestion = inject(IngestionService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly batch = signal<ImportBatch | null>(null);
  readonly records = signal<ImportRecord[]>([]);
  readonly selected = signal<Record<string, boolean>>({});
  readonly busy = signal(false);

  pasteText = '';

  async ngOnInit(): Promise<void> {
    if (!this.auth.isSignedIn()) {
      await this.showToast('Sign in as employer to import batches.');
      await this.router.navigate(['/tabs/account']);
    }
  }

  async ensureBatch(sourceType?: string): Promise<ImportBatch> {
    const existing = this.batch();
    if (existing) return existing;
    const created = await this.ingestion.createBatch(sourceType);
    this.batch.set(created);
    return created;
  }

  async refreshRecords(): Promise<void> {
    const batch = this.batch();
    if (!batch) return;
    const items = await this.ingestion.getRecords(batch.id);
    this.records.set(items);
    const next: Record<string, boolean> = {};
    for (const item of items) {
      next[item.id] =
        item.reviewStatus === 'needs_review' && item.dedupeStatus !== 'duplicate';
    }
    this.selected.set(next);
  }

  async fromClipboard(): Promise<void> {
    this.busy.set(true);
    try {
      const clip = await Clipboard.read();
      const text = clip.value?.trim();
      if (!text) {
        await this.showToast('Clipboard is empty.');
        return;
      }
      this.pasteText = text;
      const batch = await this.ensureBatch('whatsapp');
      this.batch.set(await this.ingestion.uploadText(batch.id, text, 'whatsapp'));
      await this.refreshRecords();
      await this.showToast(`Extracted ${this.records().length} record(s) from clipboard.`);
    } catch {
      await this.showToast('Clipboard read failed. Paste into the text box instead.');
    } finally {
      this.busy.set(false);
    }
  }

  async fromPasteBox(): Promise<void> {
    if (!this.pasteText.trim()) {
      await this.showToast('Paste WhatsApp/Telegram text first.');
      return;
    }
    this.busy.set(true);
    try {
      const batch = await this.ensureBatch('whatsapp');
      this.batch.set(
        await this.ingestion.uploadText(batch.id, this.pasteText, 'whatsapp'),
      );
      await this.refreshRecords();
      await this.showToast(`Extracted ${this.records().length} record(s).`);
    } catch {
      await this.showToast('Upload failed. Check API and employer sign-in.');
    } finally {
      this.busy.set(false);
    }
  }

  async fromCamera(): Promise<void> {
    this.busy.set(true);
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
      });
      const response = await fetch(photo.webPath || photo.path || '');
      const blob = await response.blob();
      const file = new File([blob], `capture-${Date.now()}.jpg`, {
        type: blob.type || 'image/jpeg',
      });
      const batch = await this.ensureBatch('image');
      this.batch.set(await this.ingestion.uploadFile(batch.id, file, 'image'));
      await this.refreshRecords();
      await this.showToast('Image uploaded. OCR stub created a review record.');
    } catch {
      await this.showToast('Camera unavailable here. Use file picker for an image.');
    } finally {
      this.busy.set(false);
    }
  }

  async onFilePicked(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.busy.set(true);
    try {
      const sourceType = file.name.toLowerCase().endsWith('.csv')
        ? 'csv'
        : file.type.startsWith('image/')
          ? 'image'
          : file.type === 'application/pdf'
            ? 'pdf'
            : 'text';
      const batch = await this.ensureBatch(sourceType);
      this.batch.set(await this.ingestion.uploadFile(batch.id, file, sourceType));
      await this.refreshRecords();
      await this.showToast(`Processed ${file.name}: ${this.records().length} record(s).`);
    } catch {
      await this.showToast('File upload failed.');
    } finally {
      this.busy.set(false);
      input.value = '';
    }
  }

  toggle(id: string, checked: boolean): void {
    this.selected.update((map) => ({ ...map, [id]: checked }));
  }

  async approveSelected(): Promise<void> {
    const batch = this.batch();
    if (!batch) return;
    const ids = Object.entries(this.selected())
      .filter(([, on]) => on)
      .map(([id]) => id);
    if (!ids.length) {
      await this.showToast('Select at least one record.');
      return;
    }
    this.busy.set(true);
    try {
      const result = await this.ingestion.approve(batch.id, ids);
      await this.refreshRecords();
      this.batch.set(await this.ingestion.getBatch(batch.id));
      await this.showToast(
        `Approved ${result.published}, failed ${result.failed}. Jobs enter moderation.`,
      );
    } catch {
      await this.showToast('Approve failed.');
    } finally {
      this.busy.set(false);
    }
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2400,
      color: 'dark',
    });
    await toast.present();
  }
}
