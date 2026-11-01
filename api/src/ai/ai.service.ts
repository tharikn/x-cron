import { Injectable, Logger } from '@nestjs/common';
import {
  AiEnrichProvider,
  AiEnrichProviderId,
  JobEnrichInput,
  JobEnrichResult,
  JobSplitInput,
  JobSplitResult,
} from './ai.types';
import { OpenAiCompatibleEnrichProvider } from './providers/openai-compatible.provider';
import { StubEnrichProvider } from './providers/stub.provider';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly provider: AiEnrichProvider;
  private callsThisMonth = 0;

  constructor() {
    this.provider = this.resolveProvider();
    this.logger.log(
      `AI enrich: enabled=${this.isEnabled()} provider=${this.provider.id}`,
    );
  }

  isEnabled(): boolean {
    const flag = (process.env.AI_ENRICH_ENABLED ?? '0').trim().toLowerCase();
    return flag === '1' || flag === 'true' || flag === 'yes' || flag === 'on';
  }

  status() {
    return {
      enabled: this.isEnabled(),
      provider: this.provider.id,
      model: process.env.AI_ENRICH_MODEL?.trim() || null,
      monthlyCap: Number(process.env.AI_ENRICH_MONTHLY_CAP ?? 2000),
      callsThisProcess: this.callsThisMonth,
    };
  }

  async enrichJob(input: JobEnrichInput): Promise<JobEnrichResult> {
    if (!this.isEnabled()) {
      return new StubEnrichProvider().enrichJob(input);
    }

    const cap = Number(process.env.AI_ENRICH_MONTHLY_CAP ?? 2000);
    if (cap > 0 && this.callsThisMonth >= cap) {
      const stub = await new StubEnrichProvider().enrichJob(input);
      return {
        ...stub,
        notes: [
          ...(stub.notes ?? []),
          `AI enrich monthly cap (${cap}) reached — original text kept.`,
        ],
      };
    }

    const result = await this.provider.enrichJob(input);
    this.callsThisMonth += 1;
    return result;
  }

  /**
   * Split a multi-recruitment Telegram/WhatsApp digest into separate jobs.
   * One LLM call when AI is on; dash/blank-line heuristic when off or on failure.
   */
  async splitJobs(input: JobSplitInput): Promise<JobSplitResult> {
    if (!this.isEnabled()) {
      return new StubEnrichProvider().splitJobs(input);
    }

    const cap = Number(process.env.AI_ENRICH_MONTHLY_CAP ?? 2000);
    if (cap > 0 && this.callsThisMonth >= cap) {
      const stub = await new StubEnrichProvider().splitJobs(input);
      return {
        ...stub,
        notes: [
          ...(stub.notes ?? []),
          `AI enrich monthly cap (${cap}) reached — heuristic split used.`,
        ],
      };
    }

    const result = await this.provider.splitJobs(input);
    this.callsThisMonth += 1;
    return result;
  }

  /** Enrich a list of drafts (bulk import / OCR). Failures fall back per item. */
  async enrichDrafts<T extends JobEnrichInput>(
    drafts: T[],
  ): Promise<Array<T & { aiCleaned?: boolean; aiNotes?: string[] }>> {
    if (!this.isEnabled() || !drafts.length) {
      return drafts.map((d) => ({ ...d, aiCleaned: false }));
    }

    const out: Array<T & { aiCleaned?: boolean; aiNotes?: string[] }> = [];
    for (const draft of drafts) {
      const enriched = await this.enrichJob({
        title: draft.title,
        employerName: draft.employerName,
        locationCity: draft.locationCity,
        jobType: draft.jobType,
        salaryText: draft.salaryText,
        vacancies: draft.vacancies,
        contactWebsite: draft.contactWebsite,
        description: draft.description,
        contentLanguage: draft.contentLanguage,
        rawText: draft.description || draft.rawText,
      });

      out.push({
        ...draft,
        title: enriched.title ?? draft.title,
        employerName: enriched.employerName ?? draft.employerName,
        locationCity: enriched.locationCity ?? draft.locationCity,
        jobType: enriched.jobType ?? draft.jobType,
        salaryText: enriched.salaryText ?? draft.salaryText,
        vacancies: enriched.vacancies ?? draft.vacancies,
        contactWebsite: enriched.contactWebsite ?? draft.contactWebsite,
        description: enriched.description || draft.description,
        contentLanguage: enriched.contentLanguage ?? draft.contentLanguage,
        aiCleaned: enriched.cleaned,
        aiNotes: enriched.notes,
      });
    }
    return out;
  }

  private resolveProvider(): AiEnrichProvider {
    if (!this.isEnabled()) return new StubEnrichProvider();

    const raw = (process.env.AI_ENRICH_PROVIDER ?? 'stub')
      .trim()
      .toLowerCase() as AiEnrichProviderId;

    if (raw === 'stub') return new StubEnrichProvider();
    if (raw === 'groq' || raw === 'ollama' || raw === 'openai') {
      return new OpenAiCompatibleEnrichProvider(raw);
    }

    this.logger.warn(`Unknown AI_ENRICH_PROVIDER=${raw}; using stub`);
    return new StubEnrichProvider();
  }
}
