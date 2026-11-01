import {
  AiEnrichProvider,
  JobEnrichInput,
  JobEnrichResult,
  JobSplitInput,
  JobSplitResult,
} from '../ai.types';
import {
  JOB_ENRICH_SYSTEM,
  buildJobEnrichUserPrompt,
} from '../prompts/job-enrich.prompt';
import {
  JOB_SPLIT_SYSTEM,
  buildJobSplitUserPrompt,
} from '../prompts/job-split.prompt';
import { splitJobPostBlocks } from '../utils/split-job-blocks';
import { StubEnrichProvider } from './stub.provider';

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
};

function defaultBaseUrl(provider: string): string {
  if (provider === 'groq') return 'https://api.groq.com/openai/v1';
  if (provider === 'ollama') return 'http://127.0.0.1:11434/v1';
  return 'https://api.openai.com/v1';
}

function defaultModel(provider: string): string {
  if (provider === 'groq') return 'openai/gpt-oss-20b';
  if (provider === 'ollama') return 'llama3.2';
  return 'gpt-4o-mini';
}

/** Light deterministic strip before the model sees Telegram/OCR noise. */
export function stripDecorativeNoise(text: string): string {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/[✅☑️✔️❌⚡🔴🟢▪️•●★☆✦✧✪✨🎉🔥💯📌👉⬅️➡️⬆️⬇️]/g, '')
    .replace(/[═ー﹣_]{3,}/g, '\n')
    .replace(/[-]{3,}/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseJsonObject(content: string): Record<string, unknown> | null {
  const trimmed = content.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fence?.[1]?.trim() ?? trimmed;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(body.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((v): v is string => typeof v === 'string' && !!v.trim());
  return items.length ? items : undefined;
}

function asVacancies(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const n = Math.floor(value);
    return n >= 1 && n <= 100000 ? n : undefined;
  }
  if (typeof value === 'string' && value.trim()) {
    const n = Number(value.replace(/[^\d]/g, ''));
    if (Number.isFinite(n)) {
      const floor = Math.floor(n);
      return floor >= 1 && floor <= 100000 ? floor : undefined;
    }
  }
  return undefined;
}

/**
 * OpenAI-compatible chat completions (Groq free tier, local Ollama, or OpenAI).
 * No SDK dependency — uses fetch.
 */
export class OpenAiCompatibleEnrichProvider implements AiEnrichProvider {
  readonly id: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly timeoutMs: number;

  constructor(providerId: string) {
    this.id = providerId;
    this.baseUrl = (
      process.env.AI_ENRICH_BASE_URL?.trim() || defaultBaseUrl(providerId)
    ).replace(/\/$/, '');
    this.apiKey = process.env.AI_ENRICH_API_KEY?.trim() || '';
    this.model =
      process.env.AI_ENRICH_MODEL?.trim() || defaultModel(providerId);
    this.timeoutMs = Number(process.env.AI_ENRICH_TIMEOUT_MS ?? 45_000);
  }

  async enrichJob(input: JobEnrichInput): Promise<JobEnrichResult> {
    const prepared: JobEnrichInput = {
      ...input,
      description: input.description
        ? stripDecorativeNoise(input.description)
        : input.description,
      rawText: input.rawText
        ? stripDecorativeNoise(input.rawText)
        : input.rawText,
    };

    const fallbackDescription =
      (prepared.description || prepared.rawText || '').trim() || 'Not provided';

    if (this.id !== 'ollama' && !this.apiKey) {
      return {
        ...this.passthrough(prepared, fallbackDescription),
        notes: [`${this.id} missing AI_ENRICH_API_KEY — original text kept.`],
      };
    }

    const parsed = await this.chatJson(
      JOB_ENRICH_SYSTEM,
      buildJobEnrichUserPrompt(prepared),
    );
    if (!parsed.ok) {
      return {
        ...this.passthrough(prepared, fallbackDescription),
        notes: [parsed.error],
      };
    }

    const description =
      asString(parsed.data.description) || fallbackDescription;

    return {
      title: asString(parsed.data.title) ?? prepared.title,
      employerName: asString(parsed.data.employerName) ?? prepared.employerName,
      locationCity: asString(parsed.data.locationCity) ?? prepared.locationCity,
      jobType: asString(parsed.data.jobType) ?? prepared.jobType,
      salaryText: asString(parsed.data.salaryText) ?? prepared.salaryText,
      vacancies: asVacancies(parsed.data.vacancies) ?? prepared.vacancies,
      contactWebsite:
        asString(parsed.data.contactWebsite) ?? prepared.contactWebsite,
      description,
      contentLanguage:
        asString(parsed.data.contentLanguage) ?? prepared.contentLanguage,
      cleaned: true,
      provider: `${this.id}:${this.model}`,
      notes: [
        ...(asStringArray(parsed.data.notes) ?? []),
        prepared.instruction
          ? 'AI applied moderator instruction; confirm fields before publish.'
          : 'AI cleaned noise and mapped fields; confirm before publish.',
      ],
    };
  }

  async splitJobs(input: JobSplitInput): Promise<JobSplitResult> {
    const rawText = (input.rawText || '').trim();
    if (!rawText) {
      return { jobs: [], split: false, provider: this.id };
    }

    const prepared = stripDecorativeNoise(rawText);

    if (this.id !== 'ollama' && !this.apiKey) {
      const fallback = await new StubEnrichProvider().splitJobs({
        rawText: prepared,
      });
      return {
        ...fallback,
        notes: [
          ...(fallback.notes ?? []),
          `${this.id} missing AI_ENRICH_API_KEY — heuristic split used.`,
        ],
      };
    }

    const parsed = await this.chatJson(
      JOB_SPLIT_SYSTEM,
      buildJobSplitUserPrompt(prepared),
    );
    if (!parsed.ok) {
      const fallback = await new StubEnrichProvider().splitJobs({
        rawText: prepared,
      });
      return {
        ...fallback,
        notes: [...(fallback.notes ?? []), parsed.error],
      };
    }

    const jobsRaw = Array.isArray(parsed.data.jobs) ? parsed.data.jobs : null;
    if (!jobsRaw?.length) {
      // Model returned a single job object instead of jobs[].
      const single = this.mapJobObject(parsed.data, prepared);
      if (single) {
        return {
          jobs: [single],
          split: false,
          provider: `${this.id}:${this.model}`,
          notes: ['AI returned one job (no multi-split needed).'],
        };
      }
      const fallback = await new StubEnrichProvider().splitJobs({
        rawText: prepared,
      });
      return {
        ...fallback,
        notes: [
          ...(fallback.notes ?? []),
          `${this.id} split missing jobs[] — heuristic used.`,
        ],
      };
    }

    const jobs: JobEnrichResult[] = [];
    for (const item of jobsRaw) {
      if (!item || typeof item !== 'object') continue;
      const mapped = this.mapJobObject(
        item as Record<string, unknown>,
        prepared,
      );
      if (mapped) jobs.push(mapped);
    }

    if (!jobs.length) {
      const fallback = await new StubEnrichProvider().splitJobs({
        rawText: prepared,
      });
      return {
        ...fallback,
        notes: [
          ...(fallback.notes ?? []),
          `${this.id} split jobs[] empty — heuristic used.`,
        ],
      };
    }

    // If model collapsed multi-block text into 1 job, prefer heuristic blocks.
    const heuristicBlocks = splitJobPostBlocks(prepared);
    if (jobs.length === 1 && heuristicBlocks.length > 1) {
      const fallback = await new StubEnrichProvider().splitJobs({
        rawText: prepared,
      });
      return {
        ...fallback,
        notes: [
          ...(fallback.notes ?? []),
          'AI returned 1 job but separators suggest many — heuristic split used.',
        ],
      };
    }

    return {
      jobs,
      split: jobs.length > 1,
      provider: `${this.id}:${this.model}`,
      notes: [
        jobs.length > 1
          ? `AI split digest into ${jobs.length} job(s); confirm before publish.`
          : 'AI parsed a single job from the digest.',
      ],
    };
  }

  private mapJobObject(
    data: Record<string, unknown>,
    fallbackDescription: string,
  ): JobEnrichResult | null {
    const description =
      asString(data.description) ||
      asString(data.title) ||
      fallbackDescription.slice(0, 500);
    if (!description.trim()) return null;
    return {
      title: asString(data.title),
      employerName: asString(data.employerName),
      locationCity: asString(data.locationCity),
      jobType: asString(data.jobType),
      salaryText: asString(data.salaryText),
      vacancies: asVacancies(data.vacancies),
      contactWebsite: asString(data.contactWebsite),
      description,
      contentLanguage: asString(data.contentLanguage),
      cleaned: true,
      provider: `${this.id}:${this.model}`,
      notes: asStringArray(data.notes),
    };
  }

  private async chatJson(
    system: string,
    user: string,
  ): Promise<
    | { ok: true; data: Record<string, unknown> }
    | { ok: false; error: string }
  > {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (this.apiKey) headers.Authorization = `Bearer ${this.apiKey}`;

      const body: Record<string, unknown> = {
        model: this.model,
        temperature: 0.15,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      };
      // Ollama often rejects response_format; Groq/OpenAI prefer it for JSON.
      if (this.id !== 'ollama') {
        body.response_format = { type: 'json_object' };
      }

      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        signal: controller.signal,
        body: JSON.stringify(body),
      });

      const raw = (await res.json()) as ChatCompletionResponse;
      if (!res.ok) {
        return {
          ok: false,
          error: `${this.id} HTTP ${res.status}: ${raw.error?.message || 'request failed'} — original text kept.`,
        };
      }

      const content = raw.choices?.[0]?.message?.content ?? '';
      const parsed = parseJsonObject(content);
      if (!parsed) {
        return {
          ok: false,
          error: `${this.id} returned non-JSON — original text kept.`,
        };
      }
      return { ok: true, data: parsed };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'request_failed';
      return {
        ok: false,
        error: `${this.id} error: ${message} — original text kept.`,
      };
    } finally {
      clearTimeout(timer);
    }
  }

  private passthrough(
    input: JobEnrichInput,
    description: string,
  ): JobEnrichResult {
    return {
      title: input.title,
      employerName: input.employerName,
      locationCity: input.locationCity,
      jobType: input.jobType,
      salaryText: input.salaryText,
      vacancies: input.vacancies,
      contactWebsite: input.contactWebsite,
      description,
      contentLanguage: input.contentLanguage,
      cleaned: false,
      provider: this.id,
    };
  }
}
