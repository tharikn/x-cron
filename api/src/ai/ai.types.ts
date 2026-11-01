export type AiEnrichProviderId = 'stub' | 'groq' | 'ollama' | 'openai';

export interface JobEnrichInput {
  title?: string;
  employerName?: string;
  locationCity?: string;
  jobType?: string;
  salaryText?: string;
  /** Open headcount when present in the source. */
  vacancies?: number;
  contactWebsite?: string;
  description?: string;
  contentLanguage?: string;
  /** Raw OCR / WhatsApp / Telegram / newspaper paste when fields are incomplete. */
  rawText?: string;
  /** Moderator chat instruction for iterative cleanup / rewrite. */
  instruction?: string;
}

export interface JobEnrichResult {
  title?: string;
  employerName?: string;
  locationCity?: string;
  jobType?: string;
  salaryText?: string;
  vacancies?: number;
  contactWebsite?: string;
  description: string;
  contentLanguage?: string;
  cleaned: boolean;
  provider: string;
  notes?: string[];
}

export interface JobSplitInput {
  rawText: string;
}

export interface JobSplitResult {
  jobs: JobEnrichResult[];
  /** True when LLM (or deterministic multi-block split) produced the list. */
  split: boolean;
  provider: string;
  notes?: string[];
}

export interface AiEnrichProvider {
  readonly id: string;
  enrichJob(input: JobEnrichInput): Promise<JobEnrichResult>;
  /** Split a multi-job Telegram/WhatsApp digest into separate cleaned jobs. */
  splitJobs(input: JobSplitInput): Promise<JobSplitResult>;
}
