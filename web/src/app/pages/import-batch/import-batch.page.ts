import { DecimalPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
  afterRenderEffect,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  ImportBatch,
  ImportRecord,
  IngestionService,
} from '../../core/services/ingestion.service';
import { SeoService } from '../../core/services/seo.service';

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

type ImportTab = 'import' | 'review';

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
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly batch = signal<ImportBatch | null>(null);
  readonly records = signal<ImportRecord[]>([]);
  readonly busy = signal(false);
  readonly enrichingId = signal<string | null>(null);
  readonly publishingId = signal<string | null>(null);
  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly activeTab = signal<ImportTab>('import');

  readonly activeRecordId = signal<string | null>(null);
  readonly activePanel = signal<'edit' | 'chat' | null>(null);
  readonly draft = signal<EditDraft | null>(null);
  readonly dirty = signal(false);
  readonly saveBusy = signal(false);
  readonly chat = signal<ChatMessage[]>([]);
  readonly chatInput = signal('');

  private readonly modalRoot = viewChild<ElementRef<HTMLElement>>('modalRoot');

  readonly activeRecord = computed(() => {
    const id = this.activeRecordId();
    if (!id) return null;
    return this.records().find((item) => item.id === id) ?? null;
  });

  readonly pageTitle = computed(() =>
    this.activeTab() === 'review' ? 'Review drafts' : 'Bulk import',
  );

  pasteText = '';

  constructor() {
    afterRenderEffect(() => {
      const open = !!this.activePanel();
      const el = this.modalRoot()?.nativeElement;
      if (typeof document === 'undefined') return;
      document.body.classList.toggle('import-batch-modal-open', open);
      if (open && el && el.parentElement !== document.body) {
        document.body.appendChild(el);
      }
    });
    this.destroyRef.onDestroy(() => {
      if (typeof document === 'undefined') return;
      document.body.classList.remove('import-batch-modal-open');
      document.querySelectorAll('.import-batch-modal').forEach((node) => node.remove());
    });
  }

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Bulk import',
      description: 'Import jobs from CSV, pasted text, PDF, or image OCR.',
      path: '/import',
    });
    const batchId = this.route.snapshot.queryParamMap.get('batchId');
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (batchId && this.ensureAdminReady()) {
      this.activeTab.set('review');
      this.busy.set(true);
      try {
        const batch = await this.ingestion.getBatch(batchId);
        this.batch.set(batch);
        await this.refreshRecords();
        this.message.set(`Loaded review batch ${batchId}.`);
        this.seo.setPage({
          title: 'Review drafts',
          description: 'Edit and publish Job Fare or import drafts one by one.',
          path: '/import',
        });
      } catch {
        this.error.set('Could not load that import batch.');
      } finally {
        this.busy.set(false);
      }
    } else if (tabParam === 'review') {
      this.activeTab.set('review');
    }
  }

  setTab(tab: ImportTab): void {
    this.activeTab.set(tab);
    if (tab === 'import') {
      this.seo.setPage({
        title: 'Bulk import',
        description: 'Import jobs from CSV, pasted text, PDF, or image OCR.',
        path: '/import',
      });
    } else {
      this.seo.setPage({
        title: 'Review drafts',
        description: 'Edit and publish import drafts one by one.',
        path: '/import',
      });
    }
  }

  canPublish(record: ImportRecord): boolean {
    return (
      record.reviewStatus === 'needs_review' && record.dedupeStatus !== 'duplicate'
    );
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

    const activeId = this.activeRecordId();
    if (activeId && !items.some((item) => item.id === activeId)) {
      this.closePanel();
    } else if (activeId && !this.dirty()) {
      const fresh = items.find((item) => item.id === activeId);
      if (fresh) this.draft.set(this.recordToDraft(fresh));
    }
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
      this.activeTab.set('review');
      this.message.set(`Extracted ${this.records().length} record(s).`);
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { batchId: this.batch()?.id, tab: 'review' },
        replaceUrl: true,
      });
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
      this.activeTab.set('review');
      const ocrNote =
        sourceType === 'image' || sourceType === 'pdf'
          ? ' Local OCR created review record(s).'
          : '';
      this.message.set(
        `Processed ${file.name}: ${this.records().length} record(s).${ocrNote}`,
      );
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { batchId: this.batch()?.id, tab: 'review' },
        replaceUrl: true,
      });
    } catch {
      this.error.set('File upload failed.');
    } finally {
      this.busy.set(false);
      input.value = '';
    }
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
    this.chat.set([]);
    this.chatInput.set('');
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
  }

  async saveDraft(): Promise<void> {
    if (!this.ensureAdminReady()) return;
    const batch = this.batch();
    const record = this.activeRecord();
    const draft = this.draft();
    if (!batch || !record || !draft) return;
    this.saveBusy.set(true);
    this.error.set(null);
    try {
      const vacanciesRaw = String(draft.vacancies ?? '').trim();
      const vacancies = Number(vacanciesRaw);
      const updated = await this.ingestion.updateRecord(batch.id, record.id, {
        title: draft.title.trim(),
        employerName: draft.employerName.trim(),
        locationCity: draft.locationCity.trim(),
        jobType: draft.jobType.trim(),
        salaryText: draft.salaryText.trim() || undefined,
        vacancies:
          vacanciesRaw && Number.isFinite(vacancies) && vacancies >= 1
            ? Math.floor(vacancies)
            : undefined,
        description: draft.description.trim(),
        contentLanguage: draft.contentLanguage.trim() || 'en',
        contactWebsite: draft.contactWebsite.trim() || undefined,
      });
      this.records.update((items) =>
        items.map((item) => (item.id === record.id ? updated : item)),
      );
      this.draft.set(this.recordToDraft(updated));
      this.dirty.set(false);
      this.message.set(`Saved edits for “${updated.extraction.title || 'record'}”.`);
    } catch {
      this.error.set('Could not save record edits.');
    } finally {
      this.saveBusy.set(false);
    }
  }

  async improveWithAi(record: ImportRecord, instruction?: string): Promise<void> {
    if (!this.ensureAdminReady()) return;
    const batch = this.batch();
    if (!batch) return;
    const prompt = (instruction ?? '').trim();
    if (prompt) {
      this.chat.update((messages) => [...messages, { role: 'user', text: prompt }]);
      this.chatInput.set('');
    }
    this.enrichingId.set(record.id);
    this.error.set(null);
    this.message.set(null);
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
      this.message.set(
        result.cleaned
          ? `AI autocorrected “${result.record.extraction.title || 'record'}”. Review then publish.`
          : `AI ran but kept original text for “${result.record.extraction.title || 'record'}”.`,
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
      this.error.set(
        'AI autocorrect failed. Check AI_ENRICH_* on the API and restart it.',
      );
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

  /** Save pending edits (if any), then publish this single record. */
  async publishRecord(record: ImportRecord): Promise<void> {
    if (!this.ensureAdminReady()) return;
    const batch = this.batch();
    if (!batch || !this.canPublish(record)) return;

    this.publishingId.set(record.id);
    this.error.set(null);
    this.message.set(null);
    try {
      if (this.activeRecordId() === record.id && this.dirty()) {
        await this.saveDraft();
        if (this.dirty()) {
          throw new Error('save_failed');
        }
      }
      const result = await this.ingestion.approve(batch.id, [record.id]);
      await this.refreshRecords();
      this.batch.set(await this.ingestion.getBatch(batch.id));
      if (result.published) {
        this.message.set(
          `Published “${record.extraction.title || 'job'}”. It enters Blog Approval.`,
        );
        this.closePanel();
      } else {
        this.error.set('Publish failed for this record.');
      }
    } catch {
      this.error.set('Publish failed. Save edits and try again.');
    } finally {
      this.publishingId.set(null);
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
}
