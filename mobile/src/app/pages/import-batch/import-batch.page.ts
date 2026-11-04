import { DecimalPipe } from '@angular/common';
import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  IonModal,
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
import {
  type FieldErrors,
  parseVacancies,
  validateImportDraftFields,
} from '../../core/utils/job-form.validation';

interface EditDraft {
  title: string;
  employerName: string;
  locationCity: string;
  jobType: string;
  salaryText: string;
  vacancies: string;
  contentLanguage: string;
  contactWebsite: string;
  description: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

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
    IonModal,
  ],
})
export class ImportBatchPage implements OnInit {
  private readonly ingestion = inject(IngestionService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastController = inject(ToastController);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly batch = signal<ImportBatch | null>(null);
  readonly records = signal<ImportRecord[]>([]);
  readonly selected = signal<Record<string, boolean>>({});
  readonly busy = signal(false);
  readonly enrichingId = signal<string | null>(null);

  readonly activeRecordId = signal<string | null>(null);
  readonly activePanel = signal<'edit' | 'chat' | null>(null);
  readonly draft = signal<EditDraft | null>(null);
  readonly dirty = signal(false);
  readonly saveBusy = signal(false);
  readonly fieldErrors = signal<FieldErrors>({});
  readonly chat = signal<ChatMessage[]>([]);
  readonly chatInput = signal('');

  readonly activeRecord = computed(() => {
    const id = this.activeRecordId();
    if (!id) return null;
    return this.records().find((item) => item.id === id) ?? null;
  });

  pasteText = '';

  async ngOnInit(): Promise<void> {
    if (!this.auth.isSignedIn()) {
      await this.showToast('Sign in as employer to import batches.');
      await this.router.navigate(['/tabs/account']);
      return;
    }
    const batchId = this.route.snapshot.queryParamMap.get('batchId');
    if (batchId) {
      try {
        this.batch.set(await this.ingestion.getBatch(batchId));
        await this.refreshRecords();
      } catch {
        await this.showToast('Could not open that import batch.');
      }
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

    const activeId = this.activeRecordId();
    if (activeId && !items.some((item) => item.id === activeId)) {
      this.closePanel();
    } else if (activeId && !this.dirty()) {
      const fresh = items.find((item) => item.id === activeId);
      if (fresh) this.draft.set(this.recordToDraft(fresh));
    }
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
      await this.showToast('Image uploaded. Local OCR created a review record.');
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

  openEdit(record: ImportRecord): void {
    if (this.activeRecordId() !== record.id || !this.draft()) {
      this.draft.set(this.recordToDraft(record));
      this.dirty.set(false);
      this.chat.set([]);
      this.chatInput.set('');
    }
    this.activeRecordId.set(record.id);
    this.activePanel.set('edit');
  }

  openChat(record: ImportRecord): void {
    if (this.activeRecordId() !== record.id || !this.draft()) {
      this.draft.set(this.recordToDraft(record));
      this.dirty.set(false);
      this.chat.set([]);
      this.chatInput.set('');
    }
    this.activeRecordId.set(record.id);
    this.activePanel.set('chat');
  }

  closePanel(): void {
    this.activeRecordId.set(null);
    this.activePanel.set(null);
    this.draft.set(null);
    this.dirty.set(false);
    this.fieldErrors.set({});
    this.chat.set([]);
    this.chatInput.set('');
  }

  clearFieldError(key: string): void {
    if (!this.fieldErrors()[key]) return;
    this.fieldErrors.update((errors) => {
      const next = { ...errors };
      delete next[key];
      return next;
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.activePanel()) this.closePanel();
  }

  patchDraft(partial: Partial<EditDraft>): void {
    const current = this.draft();
    if (!current) return;
    const next = { ...current, ...partial };
    if (partial.vacancies !== undefined) {
      next.vacancies = String(partial.vacancies ?? '');
    }
    this.draft.set(next);
    this.dirty.set(true);
    for (const key of Object.keys(partial)) {
      this.clearFieldError(key);
    }
  }

  async saveDraft(): Promise<void> {
    const batch = this.batch();
    const record = this.activeRecord();
    const draft = this.draft();
    if (!batch || !record || !draft) return;
    const errors = validateImportDraftFields(draft);
    this.fieldErrors.set(errors);
    if (Object.keys(errors).length) {
      await this.showToast(Object.values(errors)[0] ?? 'Fix the highlighted fields.');
      return;
    }
    this.saveBusy.set(true);
    try {
      const updated = await this.ingestion.updateRecord(batch.id, record.id, {
        title: draft.title.trim(),
        employerName: draft.employerName.trim(),
        locationCity: draft.locationCity.trim(),
        jobType: draft.jobType.trim(),
        salaryText: draft.salaryText.trim() || undefined,
        vacancies: parseVacancies(draft.vacancies),
        description: draft.description.trim(),
        contentLanguage: draft.contentLanguage.trim() || 'en',
        contactWebsite: draft.contactWebsite.trim() || undefined,
      });
      this.records.update((items) =>
        items.map((item) => (item.id === record.id ? updated : item)),
      );
      this.draft.set(this.recordToDraft(updated));
      this.dirty.set(false);
      this.fieldErrors.set({});
      await this.showToast('Saved record edits.');
    } catch {
      await this.showToast('Could not save record edits.');
    } finally {
      this.saveBusy.set(false);
    }
  }

  async improveWithAi(record: ImportRecord, instruction?: string): Promise<void> {
    const batch = this.batch();
    if (!batch) return;
    const prompt = (instruction ?? '').trim();
    if (prompt) {
      this.chat.update((messages) => [...messages, { role: 'user', text: prompt }]);
      this.chatInput.set('');
    }
    this.enrichingId.set(record.id);
    try {
      const result = await this.ingestion.enrichRecord(
        batch.id,
        record.id,
        prompt || undefined,
      );
      this.records.update((items) =>
        items.map((item) => (item.id === record.id ? result.record : item)),
      );
      if (this.activeRecordId() === record.id) {
        this.draft.set(this.recordToDraft(result.record));
        this.dirty.set(false);
      }
      const note =
        result.record.extraction.notes?.filter(Boolean).slice(0, 3).join(' · ') ||
        (result.cleaned
          ? 'Cleaned and mapped into the record fields.'
          : 'AI ran but kept most of the original text.');
      if (this.activePanel() === 'chat' || prompt) {
        this.chat.update((messages) => [
          ...messages,
          { role: 'assistant', text: note },
        ]);
      }
      await this.showToast(
        result.cleaned
          ? 'AI autocorrected this record. Review then approve.'
          : 'AI ran but kept the original text.',
      );
    } catch {
      if (this.activePanel() === 'chat' || prompt) {
        this.chat.update((messages) => [
          ...messages,
          {
            role: 'assistant',
            text: 'AI failed. Check AI_ENRICH_* on the API and try again.',
          },
        ]);
      }
      await this.showToast('AI autocorrect failed. Check AI_ENRICH_* on the API.');
    } finally {
      this.enrichingId.set(null);
    }
  }

  async sendChat(): Promise<void> {
    const record = this.activeRecord();
    const text = this.chatInput().trim();
    if (!record || !text || this.enrichingId()) return;
    await this.improveWithAi(record, text);
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

  private recordToDraft(record: ImportRecord): EditDraft {
    return {
      title: record.extraction.title || '',
      employerName: record.extraction.employerName || '',
      locationCity: record.extraction.locationCity || '',
      jobType: record.extraction.jobType || '',
      salaryText: record.extraction.salaryText || '',
      vacancies:
        typeof record.extraction.vacancies === 'number'
          ? String(record.extraction.vacancies)
          : '',
      contentLanguage: record.extraction.contentLanguage || 'en',
      contactWebsite: record.extraction.contactWebsite || '',
      description: record.extraction.description || '',
    };
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
