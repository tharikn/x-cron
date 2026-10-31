import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  ImportBatch,
  ImportRecord,
  IngestionService,
} from '../../core/services/ingestion.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-import-batch',
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './import-batch.page.html',
  styleUrl: './import-batch.page.scss',
})
export class ImportBatchPage implements OnInit {
  private readonly ingestion = inject(IngestionService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly batch = signal<ImportBatch | null>(null);
  readonly records = signal<ImportRecord[]>([]);
  readonly selected = signal<Record<string, boolean>>({});
  readonly busy = signal(false);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  pasteText = '';

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Bulk import',
      description: 'Import jobs from CSV, pasted text, PDF, or image OCR.',
      path: '/import',
    });
  }

  private ensureAdminReady(): boolean {
    if (!this.auth.isSignedIn()) {
      this.error.set('Admins must sign in before importing.');
      void this.router.navigateByUrl('/sign-in');
      return false;
    }
    if (!this.auth.isAdmin()) {
      this.error.set('Bulk import is admin-only. Use admin@xcron.local.');
      return false;
    }
    return true;
  }

  private async ensureBatch(sourceType?: string): Promise<ImportBatch> {
    const existing = this.batch();
    if (existing) return existing;
    const created = await this.ingestion.createBatch(sourceType);
    this.batch.set(created);
    return created;
  }

  private async refreshRecords(): Promise<void> {
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

  async fromPasteBox(): Promise<void> {
    if (!this.ensureAdminReady()) return;
    if (!this.pasteText.trim()) {
      this.error.set('Paste WhatsApp/Telegram text first.');
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.message.set(null);
    try {
      const batch = await this.ensureBatch('whatsapp');
      this.batch.set(
        await this.ingestion.uploadText(batch.id, this.pasteText, 'whatsapp'),
      );
      await this.refreshRecords();
      this.message.set(`Extracted ${this.records().length} record(s).`);
    } catch {
      this.error.set('Upload failed. Check API and admin sign-in.');
    } finally {
      this.busy.set(false);
    }
  }

  async onFilePicked(event: Event): Promise<void> {
    if (!this.ensureAdminReady()) return;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.busy.set(true);
    this.error.set(null);
    this.message.set(null);
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
      const ocrNote =
        sourceType === 'image' || sourceType === 'pdf'
          ? ' Local OCR created review record(s).'
          : '';
      this.message.set(
        `Processed ${file.name}: ${this.records().length} record(s).${ocrNote}`,
      );
    } catch {
      this.error.set('File upload failed.');
    } finally {
      this.busy.set(false);
      input.value = '';
    }
  }

  toggle(id: string, checked: boolean): void {
    this.selected.update((map) => ({ ...map, [id]: checked }));
  }

  async approveSelected(): Promise<void> {
    if (!this.ensureAdminReady()) return;
    const batch = this.batch();
    if (!batch) return;
    const ids = Object.entries(this.selected())
      .filter(([, on]) => on)
      .map(([id]) => id);
    if (!ids.length) {
      this.error.set('Select at least one record.');
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.message.set(null);
    try {
      const result = await this.ingestion.approve(batch.id, ids);
      await this.refreshRecords();
      this.batch.set(await this.ingestion.getBatch(batch.id));
      this.message.set(
        `Approved ${result.published}, failed ${result.failed}. Jobs enter Blog Approval.`,
      );
    } catch {
      this.error.set('Approve failed.');
    } finally {
      this.busy.set(false);
    }
  }
}
