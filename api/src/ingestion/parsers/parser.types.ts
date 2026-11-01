export type SourceType =
  | 'csv'
  | 'text'
  | 'whatsapp'
  | 'telegram'
  | 'image'
  | 'pdf'
  | 'docx'
  | 'unknown';

export interface ExtractedJobDraft {
  title?: string;
  employerName?: string;
  locationCity?: string;
  jobType?: string;
  salaryText?: string;
  /** Open headcount when extracted from source text. */
  vacancies?: number;
  description?: string;
  contentLanguage?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactWebsite?: string;
  confidence: number;
  sourceLocator: string;
  notes?: string[];
  /** Set when AI enrich cleaned this draft. */
  aiCleaned?: boolean;
  aiNotes?: string[];
}

export interface ParseInput {
  sourceType: SourceType;
  filename: string;
  mimeType?: string;
  text?: string;
  buffer?: Buffer;
}

export interface ParseResult {
  provider: string;
  sourceType: SourceType;
  drafts: ExtractedJobDraft[];
  warnings: string[];
  /** OCR pages counted toward OCR_MONTHLY_PAGE_CAP when present. */
  pagesProcessed?: number;
}

export interface DocumentParser {
  readonly id: string;
  supports(input: ParseInput): boolean;
  parse(input: ParseInput): Promise<ParseResult>;
}
