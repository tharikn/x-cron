import { ExtractedJobDraft, SourceType } from './parsers/parser.types';

export type BatchStatus =
  | 'queued'
  | 'processing'
  | 'needs_review'
  | 'publishing'
  | 'completed'
  | 'partially_failed'
  | 'failed';

export type RecordReviewStatus =
  | 'needs_review'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'duplicate';

export interface ImportRecord {
  id: string;
  batchId: string;
  sourceLocator: string;
  extraction: ExtractedJobDraft;
  confidence: number;
  dedupeStatus: 'pending' | 'unique' | 'duplicate';
  reviewStatus: RecordReviewStatus;
  jobId?: string;
  error?: string;
  createdAt: string;
}

export interface ImportBatch {
  id: string;
  employerId: string;
  ownerUserId: string;
  employerName: string;
  status: BatchStatus;
  sourceType: SourceType;
  filename: string;
  totalRecords: number;
  processedRecords: number;
  errorCount: number;
  warnings: string[];
  createdAt: string;
  updatedAt: string;
  records: ImportRecord[];
}
