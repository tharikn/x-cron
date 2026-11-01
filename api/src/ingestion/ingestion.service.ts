import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { AuthStore } from '../auth/auth.store';
import type { AuthUser } from '../auth/auth.types';
import { JobsStore } from '../jobs/jobs.store';
import { JobType } from '../jobs/job.types';
import { OpsService } from '../ops/ops.service';
import {
  ApproveRecordsDto,
  CreateImportBatchDto,
  EnrichRecordDto,
  TextUploadDto,
  UpdateImportRecordDto,
} from './dto/ingestion.dto';
import { IngestionStore } from './ingestion.store';
import { ImportBatch, ImportRecord } from './ingestion.types';
import { ParserRegistry } from './parsers/parser.registry';
import { SourceType } from './parsers/parser.types';

@Injectable()
export class IngestionService {
  constructor(
    private readonly store: IngestionStore,
    private readonly parsers: ParserRegistry,
    private readonly authStore: AuthStore,
    private readonly jobsStore: JobsStore,
    private readonly ai: AiService,
    @Optional() private readonly ops?: OpsService,
  ) {}

  async createBatch(user: AuthUser, dto: CreateImportBatchDto) {
    this.assertImportQuota();
    const employer = this.requireEmployer(user);
    const now = new Date().toISOString();
    const batch: ImportBatch = {
      id: this.store.newId('batch'),
      employerId: employer.id,
      ownerUserId: user.id,
      employerName: employer.name,
      status: 'queued',
      sourceType: dto.sourceType || 'unknown',
      filename: '',
      totalRecords: 0,
      processedRecords: 0,
      errorCount: 0,
      warnings: [],
      createdAt: now,
      updatedAt: now,
      records: [],
    };
    const created = await this.store.create(batch);
    this.ops?.recordImport(0);
    return this.toPublicBatch(created);
  }

  async listMine(user: AuthUser) {
    const items = await this.store.listByOwner(user.id);
    return { items: items.map((b) => this.toPublicBatch(b)) };
  }

  async getBatch(user: AuthUser, id: string) {
    return this.toPublicBatch(await this.requireOwnedBatch(user, id));
  }

  async getRecords(user: AuthUser, id: string) {
    const batch = await this.requireOwnedBatch(user, id);
    return {
      items: batch.records.map((record) => this.toPublicRecord(record)),
    };
  }

  /** Re-run AI cleanup on one noisy OCR/import row and persist fields. */
  async enrichRecord(
    user: AuthUser,
    batchId: string,
    recordId: string,
    dto: EnrichRecordDto = {},
  ) {
    if (!this.ai.isEnabled()) {
      throw new BadRequestException(
        'AI enrich is disabled. Set AI_ENRICH_ENABLED=1 on the API.',
      );
    }
    const batch = await this.requireOwnedBatch(user, batchId);
    const record = batch.records.find((item) => item.id === recordId);
    if (!record) throw new NotFoundException('Import record not found');
    if (record.reviewStatus === 'published' || record.reviewStatus === 'approved') {
      throw new BadRequestException('Record already approved/published');
    }

    const rawText = [
      record.extraction.title,
      record.extraction.employerName,
      record.extraction.locationCity,
      record.extraction.salaryText,
      record.extraction.contactWebsite,
      record.extraction.description,
      ...(record.extraction.notes ?? []),
    ]
      .filter(Boolean)
      .join('\n');

    const enriched = await this.ai.enrichJob({
      title: record.extraction.title,
      employerName: record.extraction.employerName,
      locationCity: record.extraction.locationCity,
      jobType: record.extraction.jobType,
      salaryText: record.extraction.salaryText,
      vacancies: record.extraction.vacancies,
      contactWebsite: record.extraction.contactWebsite,
      description: record.extraction.description,
      contentLanguage: record.extraction.contentLanguage,
      rawText,
      instruction: dto.instruction?.trim() || undefined,
    });

    const priorNotes = (record.extraction.notes ?? []).filter(
      (n) => !n.toLowerCase().includes('original text kept'),
    );
    const notes = [
      ...priorNotes,
      ...(enriched.notes ?? []),
      enriched.cleaned
        ? 'AI autocorrect applied — confirm before approve.'
        : 'AI autocorrect did not change this row.',
    ];

    record.extraction = {
      ...record.extraction,
      title: enriched.title || record.extraction.title,
      employerName:
        enriched.employerName ||
        record.extraction.employerName ||
        batch.employerName,
      locationCity: enriched.locationCity || record.extraction.locationCity,
      jobType: enriched.jobType || record.extraction.jobType,
      salaryText: enriched.salaryText || record.extraction.salaryText,
      vacancies: enriched.vacancies ?? record.extraction.vacancies,
      contactWebsite:
        enriched.contactWebsite || record.extraction.contactWebsite,
      description: enriched.description || record.extraction.description,
      contentLanguage:
        enriched.contentLanguage || record.extraction.contentLanguage,
      notes,
      aiCleaned: enriched.cleaned,
      aiNotes: enriched.notes,
    };
    if (enriched.cleaned && record.confidence < 0.7) {
      record.confidence = Math.min(0.85, Math.max(record.confidence, 0.55));
    }
    batch.updatedAt = new Date().toISOString();
    await this.store.update(batch);

    return {
      cleaned: enriched.cleaned,
      provider: enriched.provider,
      record: this.toPublicRecord(record),
    };
  }

  /** Persist manual / AI-assisted field edits before approve. */
  async updateRecord(
    user: AuthUser,
    batchId: string,
    recordId: string,
    dto: UpdateImportRecordDto,
  ) {
    const batch = await this.requireOwnedBatch(user, batchId);
    const record = batch.records.find((item) => item.id === recordId);
    if (!record) throw new NotFoundException('Import record not found');
    if (record.reviewStatus === 'published' || record.reviewStatus === 'approved') {
      throw new BadRequestException('Record already approved/published');
    }

    if (dto.title !== undefined) record.extraction.title = dto.title.trim();
    if (dto.employerName !== undefined) {
      record.extraction.employerName = dto.employerName.trim();
    }
    if (dto.locationCity !== undefined) {
      record.extraction.locationCity = dto.locationCity.trim();
    }
    if (dto.jobType !== undefined) record.extraction.jobType = dto.jobType.trim();
    if (dto.salaryText !== undefined) {
      record.extraction.salaryText = dto.salaryText.trim() || undefined;
    }
    if (dto.vacancies !== undefined) {
      record.extraction.vacancies = dto.vacancies;
    }
    if (dto.description !== undefined) {
      record.extraction.description = dto.description.trim();
    }
    if (dto.contentLanguage !== undefined) {
      record.extraction.contentLanguage = dto.contentLanguage.trim();
    }
    if (dto.contactWebsite !== undefined) {
      record.extraction.contactWebsite =
        dto.contactWebsite.trim() || undefined;
    }

    batch.updatedAt = new Date().toISOString();
    await this.store.update(batch);
    return this.toPublicRecord(record);
  }

  async uploadText(user: AuthUser, id: string, dto: TextUploadDto) {
    const batch = await this.requireOwnedBatch(user, id);
    batch.status = 'processing';
    await this.store.update(batch);

    const sourceType = dto.sourceType || 'whatsapp';
    const filename = dto.filename || 'paste.txt';
    const parsed = await this.parsers.parse({
      sourceType,
      filename,
      text: dto.text,
    });

    await this.applyParseResult(
      batch,
      sourceType,
      filename,
      parsed.drafts,
      parsed.warnings,
    );
    if (parsed.pagesProcessed) this.ops?.recordOcrPages(parsed.pagesProcessed);
    return this.toPublicBatch(batch);
  }

  /**
   * Channel / Job Fare digest path: create a batch for an admin owner and parse
   * concatenated posts without requiring a prior createBatch HTTP call.
   */
  async ingestDigestText(input: {
    ownerUserId: string;
    employerName?: string;
    text: string;
    sourceType?: SourceType;
    filename?: string;
  }) {
    this.assertImportQuota();
    const user = this.authStore.getUser(input.ownerUserId);
    if (!user) {
      throw new BadRequestException(
        'Channel pull owner user missing. Sign in as admin once, or set CHANNEL_PULL_OWNER_USER_ID.',
      );
    }
    const employer = this.requireEmployer(user);
    const now = new Date().toISOString();
    const sourceType = input.sourceType || 'telegram';
    const filename = input.filename || 'channel-digest.txt';
    const batch: ImportBatch = {
      id: this.store.newId('batch'),
      employerId: employer.id,
      ownerUserId: user.id,
      employerName: input.employerName || employer.name || 'Channel pull',
      status: 'processing',
      sourceType,
      filename,
      totalRecords: 0,
      processedRecords: 0,
      errorCount: 0,
      warnings: ['Created from channel Job Fare pull.'],
      createdAt: now,
      updatedAt: now,
      records: [],
    };
    await this.store.create(batch);
    this.ops?.recordImport(0);

    // Channel digests often pack many recruitments in one Telegram message.
    // Prefer one AI split+map call; fall back to heuristic text parser.
    if (this.ai.isEnabled()) {
      const split = await this.ai.splitJobs({ rawText: input.text });
      if (split.jobs.length > 0) {
        const drafts = split.jobs.map((job, index) => ({
          title: job.title || `Channel role ${index + 1}`,
          employerName: job.employerName || batch.employerName,
          locationCity: job.locationCity,
          jobType: job.jobType,
          salaryText: job.salaryText,
          vacancies: job.vacancies,
          contactWebsite: job.contactWebsite,
          description: job.description,
          contentLanguage: job.contentLanguage,
          confidence: job.cleaned ? 0.78 : 0.6,
          sourceLocator: `${filename}#ai-split-${index + 1}`,
          notes: [
            ...(job.notes ?? []),
            ...(split.notes ?? []),
            split.jobs.length > 1
              ? `AI multi-job split (${index + 1}/${split.jobs.length}).`
              : 'AI digest parse (single job).',
          ],
          aiCleaned: job.cleaned,
          aiNotes: job.notes,
        }));
        const warnings = [
          ...(split.notes ?? []),
          split.jobs.length > 1
            ? `AI split channel digest into ${split.jobs.length} job record(s).`
            : 'AI parsed channel digest as one job.',
        ];
        await this.applyParseResult(
          batch,
          sourceType,
          filename,
          drafts,
          warnings,
          { skipEnrich: true },
        );
        return {
          batch: this.toPublicBatch(batch),
          recordIds: batch.records.map((r) => r.id),
        };
      }
    }

    const parsed = await this.parsers.parse({
      sourceType,
      filename,
      text: input.text,
    });
    await this.applyParseResult(
      batch,
      sourceType,
      filename,
      parsed.drafts,
      parsed.warnings,
    );
    return {
      batch: this.toPublicBatch(batch),
      recordIds: batch.records.map((r) => r.id),
    };
  }

  async uploadFile(
    user: AuthUser,
    id: string,
    file?: Express.Multer.File,
    sourceTypeHint?: string,
  ) {
    if (!file) {
      throw new BadRequestException('file is required');
    }
    const batch = await this.requireOwnedBatch(user, id);
    batch.status = 'processing';
    await this.store.update(batch);

    const sourceType = this.detectSourceType(file, sourceTypeHint);
    const text =
      sourceType === 'csv' || sourceType === 'text'
        ? file.buffer.toString('utf8')
        : undefined;

    const parsed = await this.parsers.parse({
      sourceType,
      filename: file.originalname || 'upload.bin',
      mimeType: file.mimetype,
      text,
      buffer: file.buffer,
    });

    await this.applyParseResult(
      batch,
      sourceType,
      file.originalname || 'upload.bin',
      parsed.drafts,
      parsed.warnings,
    );
    if (parsed.pagesProcessed) this.ops?.recordOcrPages(parsed.pagesProcessed);
    return this.toPublicBatch(batch);
  }

  async approve(user: AuthUser, id: string, dto: ApproveRecordsDto) {
    const batch = await this.requireOwnedBatch(user, id);
    if (!dto.recordIds?.length) {
      throw new BadRequestException('recordIds required');
    }

    batch.status = 'publishing';
    await this.store.update(batch);

    let published = 0;
    let failed = 0;

    for (const recordId of dto.recordIds) {
      const record = batch.records.find((item) => item.id === recordId);
      if (!record) {
        failed += 1;
        continue;
      }
      if (record.reviewStatus === 'duplicate') {
        record.error = 'Duplicate within batch';
        failed += 1;
        continue;
      }
      if (record.confidence < 0.35 && !record.extraction.title) {
        record.reviewStatus = 'needs_review';
        record.error = 'Confidence too low';
        failed += 1;
        continue;
      }

      const title = record.extraction.title || 'Untitled role';
      const locationCity = record.extraction.locationCity || 'Palani';
      const existing = await this.jobsStore.findActiveDuplicate(
        title,
        locationCity,
      );
      if (existing) {
        record.jobId = existing.id;
        record.dedupeStatus = 'duplicate';
        record.reviewStatus = 'duplicate';
        record.error = 'Duplicate of existing job';
        failed += 1;
        continue;
      }

      try {
        const job = await this.jobsStore.createAndPublish({
          title,
          employerName:
            record.extraction.employerName || batch.employerName || 'Employer',
          locationCity,
          jobType: (record.extraction.jobType as JobType) || 'full-time',
          salaryText: record.extraction.salaryText,
          vacancies: record.extraction.vacancies,
          description: record.extraction.description || 'Not provided',
          contentLanguage: record.extraction.contentLanguage || 'en',
          contactPhone: record.extraction.contactPhone,
          contactEmail: record.extraction.contactEmail,
          contactWebsite: record.extraction.contactWebsite,
          employerId: batch.employerId,
          ownerUserId: batch.ownerUserId,
          status: 'needs-review',
        });
        record.jobId = job.id;
        record.reviewStatus = 'published';
        published += 1;
      } catch (error) {
        if (error instanceof Error && error.message === 'DUPLICATE_JOB') {
          record.dedupeStatus = 'duplicate';
          record.reviewStatus = 'duplicate';
          record.error = 'Duplicate of existing job';
        } else {
          record.error = error instanceof Error ? error.message : 'publish_failed';
        }
        failed += 1;
      }
    }

    batch.errorCount += failed;
    batch.status =
      failed && published
        ? 'partially_failed'
        : failed && !published
          ? 'failed'
          : 'completed';
    await this.store.update(batch);

    return {
      batch: this.toPublicBatch(batch),
      published,
      failed,
    };
  }

  private async applyParseResult(
    batch: ImportBatch,
    sourceType: SourceType,
    filename: string,
    drafts: ImportRecord['extraction'][],
    warnings: string[],
    opts?: { skipEnrich?: boolean },
  ) {
    batch.sourceType = sourceType;
    batch.filename = filename;
    batch.warnings = [...batch.warnings, ...warnings];

    const enrichedDrafts = opts?.skipEnrich
      ? drafts.map((d) => ({
          ...d,
          aiCleaned: d.aiCleaned ?? false,
        }))
      : await this.ai.enrichDrafts(drafts);
    if (this.ai.isEnabled() && !opts?.skipEnrich) {
      const cleaned = enrichedDrafts.filter((d) => d.aiCleaned).length;
      batch.warnings.push(
        cleaned
          ? `AI enrich cleaned ${cleaned}/${enrichedDrafts.length} draft(s).`
          : 'AI enrich enabled but no drafts were cleaned (stub/cap/error).',
      );
    }

    const records: ImportRecord[] = [];
    for (const draft of enrichedDrafts) {
      const probeBatch = { ...batch, records: [...batch.records, ...records] };
      const title = draft.title || '';
      const city = draft.locationCity;
      const duplicateInBatch = this.store.findDuplicate(probeBatch, title, city);
      const duplicateJob = await this.jobsStore.findActiveDuplicate(
        title || 'Untitled role',
        city || 'Palani',
      );
      const duplicate = duplicateInBatch || duplicateJob;
      const notes = [
        ...(draft.notes ?? []),
        ...(draft.aiNotes ?? []),
      ];
      records.push({
        id: this.store.newId('rec'),
        batchId: batch.id,
        sourceLocator: draft.sourceLocator,
        extraction: {
          ...draft,
          employerName: draft.employerName || batch.employerName,
          notes: notes.length ? notes : undefined,
        },
        confidence: draft.confidence,
        dedupeStatus: duplicate ? 'duplicate' : 'unique',
        reviewStatus: duplicate ? 'duplicate' : 'needs_review',
        jobId: duplicateJob?.id,
        createdAt: new Date().toISOString(),
        ...(duplicateJob
          ? { error: 'Duplicate of existing job' }
          : duplicateInBatch
            ? { error: 'Duplicate within batch' }
            : {}),
      });
    }

    batch.records = [...batch.records, ...records];
    batch.totalRecords = batch.records.length;
    batch.processedRecords = batch.records.length;
    batch.status = batch.records.length ? 'needs_review' : 'failed';
    if (!batch.records.length) {
      batch.warnings.push('No job records extracted');
    }
    await this.store.update(batch);
  }

  private detectSourceType(
    file: Express.Multer.File,
    hint?: string,
  ): SourceType {
    if (hint && ['csv', 'text', 'image', 'pdf', 'docx', 'whatsapp', 'telegram'].includes(hint)) {
      return hint as SourceType;
    }
    const name = (file.originalname || '').toLowerCase();
    if (name.endsWith('.csv') || file.mimetype === 'text/csv') return 'csv';
    if (name.endsWith('.txt') || file.mimetype === 'text/plain') return 'text';
    if (name.endsWith('.pdf') || file.mimetype === 'application/pdf') return 'pdf';
    if (file.mimetype?.startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(name)) {
      return 'image';
    }
    return 'unknown';
  }

  private assertImportQuota() {
    if (!this.ops) return;
    const quotas = this.ops.quotas().items;
    const imports = quotas.find((q) => q.key === 'import_batches');
    if (imports && imports.used >= imports.limit) {
      throw new ForbiddenException('Daily import batch quota reached');
    }
  }

  private requireEmployer(user: AuthUser) {
    let employer = this.authStore.getEmployerByOwner(user.id);
    if (!employer) {
      if (!user.roles.includes('employer') && !user.roles.includes('admin')) {
        throw new ForbiddenException('Employer profile required');
      }
      employer = this.authStore.createEmployer(user.id, user.displayName || 'Employer');
    }
    return employer;
  }

  private async requireOwnedBatch(
    user: AuthUser,
    id: string,
  ): Promise<ImportBatch> {
    const batch = await this.store.get(id);
    if (!batch) throw new NotFoundException('Batch not found');
    if (batch.ownerUserId !== user.id && !user.roles.includes('admin')) {
      throw new ForbiddenException('Not your import batch');
    }
    return batch;
  }

  private toPublicBatch(batch: ImportBatch) {
    return {
      id: batch.id,
      employerId: batch.employerId,
      status: batch.status,
      sourceType: batch.sourceType,
      filename: batch.filename,
      totalRecords: batch.totalRecords,
      processedRecords: batch.processedRecords,
      errorCount: batch.errorCount,
      warnings: batch.warnings,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    };
  }

  private toPublicRecord(record: ImportRecord) {
    return {
      id: record.id,
      batchId: record.batchId,
      sourceLocator: record.sourceLocator,
      confidence: record.confidence,
      dedupeStatus: record.dedupeStatus,
      reviewStatus: record.reviewStatus,
      jobId: record.jobId,
      error: record.error,
      extraction: {
        title: record.extraction.title,
        employerName: record.extraction.employerName,
        locationCity: record.extraction.locationCity,
        jobType: record.extraction.jobType,
        salaryText: record.extraction.salaryText,
        vacancies: record.extraction.vacancies,
        description: record.extraction.description,
        contentLanguage: record.extraction.contentLanguage,
        hasPhone: !!record.extraction.contactPhone,
        hasEmail: !!record.extraction.contactEmail,
        hasWebsite: !!record.extraction.contactWebsite,
        // Apply/info URL is editable for admin review (phones/emails stay private).
        contactWebsite: record.extraction.contactWebsite,
        notes: record.extraction.notes,
        aiCleaned: !!record.extraction.aiCleaned,
      },
      createdAt: record.createdAt,
    };
  }
}
