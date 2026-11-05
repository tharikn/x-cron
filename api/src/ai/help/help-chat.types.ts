export type HelpChatProviderId = 'stub' | 'groq' | 'ollama' | 'openai';

export type HelpChatRole = 'user' | 'assistant';

export interface HelpChatTurn {
  role: HelpChatRole;
  content: string;
}

export interface HelpChatQuotaSnapshot {
  enabled: boolean;
  provider: string;
  model: string | null;
  remainingTokens: number;
  dailyTokenBudget: number;
  usedTokens: number;
  cooldownSecondsRemaining: number;
  coolDownUntil: string | null;
  maxMessageChars: number;
  maxHistoryTurns: number;
}

export interface HelpChatResult {
  reply: string;
  provider: string;
  tokensUsed: number;
  remainingTokens: number;
  dailyTokenBudget: number;
  cooldownSecondsRemaining: number;
  coolDownUntil: string | null;
}

export interface HelpChatProvider {
  readonly id: string;
  chat(input: {
    system: string;
    history: HelpChatTurn[];
    message: string;
    maxTokens: number;
  }): Promise<{ reply: string; tokensUsed: number; provider: string }>;
}
