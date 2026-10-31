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
  description?: string;
  contentLanguage?: string;
  contactPhone?: string;
  contactEmail?: string;
  confidence: number;
  sourceLocator: string;
  notes?: string[];
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
}

export interface DocumentParser {
  readonly id: string;
  supports(input: ParseInput): boolean;
  parse(input: ParseInput): Promise<ParseResult>;
}
