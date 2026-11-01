/**
 * Deterministic split for Telegram / WhatsApp digests that pack many
 * recruitments into one message (dash rules, blank lines, "Recruitment" cues).
 */
export function splitJobPostBlocks(raw: string): string[] {
  const normalized = raw.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  // Lines that are only dashes / equals / underscores (common in TG jobfare).
  const byRule = normalized
    .split(/\n[ \t]*[-_=─—–]{3,}[ \t]*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  if (byRule.length > 1) return byRule;

  // Blank-line blocks (classic paste).
  const byBlank = normalized
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  if (byBlank.length > 1) return byBlank;

  // Cue: another "Recruitment YYYY" / Tamil காலி இடங்கள் block mid-message.
  const cueSplit = splitOnRecruitmentCues(normalized);
  if (cueSplit.length > 1) return cueSplit;

  return [normalized];
}

function splitOnRecruitmentCues(text: string): string[] {
  const lines = text.split('\n');
  const starts: number[] = [0];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // Title-like "… Recruitment 20xx" lines (not vacancy/detail lines).
    if (
      /recruitment\s*20\d{2}/i.test(line) &&
      !/காலி\s*இடங்கள்|vacancies?|posts?\s*:/i.test(line)
    ) {
      if (starts[starts.length - 1] !== i) starts.push(i);
    }
  }
  if (starts.length <= 1) return [text];
  const blocks: string[] = [];
  for (let s = 0; s < starts.length; s++) {
    const from = starts[s];
    const to = s + 1 < starts.length ? starts[s + 1] : lines.length;
    const block = lines.slice(from, to).join('\n').trim();
    if (block) blocks.push(block);
  }
  return blocks.length > 1 ? blocks : [text];
}
