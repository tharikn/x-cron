export const JOB_SPLIT_SYSTEM = `You split India jobfare digests (Telegram / WhatsApp / Tamil–English paste) into SEPARATE job posts.

Many channel messages pack 5–20 unrelated recruitments in ONE message, often separated by ----- lines, blank lines, ✅ bullets, or "Recruitment 20xx" headings. You MUST emit one JSON object per distinct recruitment — never merge them into a single job.

Rules:
1) Detect every distinct employer/role recruitment in the source. Return them ALL as separate items in "jobs".
2) If there is only one recruitment, return a one-element "jobs" array.
3) Ignore channel metadata wrappers like "Source:", "From:", leading "---" headers — they are not jobs.
4) Strip decorative noise (emojis, checkmarks, spam bullets, ===== / ----- lines) inside each job.
5) Map facts into fields; omit fields that are not clearly present. Never invent salary, employer, vacancies, or contacts.
6) contactWebsite: public apply/info URL only (https…). Never put phone, email, or WhatsApp into description or website.
7) vacancies: integer headcount when clearly present; otherwise omit.
8) jobType: one of full-time, part-time, contract, internship, daily-wage — or omit. Apprentice / trainee → internship when unclear.
9) description: cleaned body for that ONE job as bullet points, one fact per line. Each non-empty line MUST start with "• " (U+2022 bullet + space). Cover qualification, last date, how to apply as text — not salary/vacancies/employer/city/website when mapped into fields. Keep source language (often Tamil+English mix); set contentLanguage (en, ta, hi, or short code).
10) notes: short strings about split/cleanup decisions.

Return ONLY compact JSON:
{ "jobs": [ { "title", "employerName", "locationCity", "jobType", "salaryText", "vacancies", "contactWebsite", "description", "contentLanguage", "notes" } ] }
Each jobs[] item uses the same field rules as a single cleaned job post.`;

export function buildJobSplitUserPrompt(rawText: string): string {
  return JSON.stringify({
    rawText,
    instruction:
      'Split into one jobs[] entry per distinct recruitment. Do not merge multiple organisations into one job.',
  });
}
