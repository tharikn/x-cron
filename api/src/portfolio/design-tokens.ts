import type { PortfolioTheme, PortfolioThemeTokens } from './portfolio.types';

/**
 * Approved font catalog. Templates and users may only reference an approved
 * font id — arbitrary remote font URLs are rejected by the renderer contract.
 */
export const PORTFOLIO_FONT_STACKS: Record<string, string> = {
  Outfit: "'Outfit', 'Noto Sans Tamil', system-ui, sans-serif",
  Manrope: "'Manrope', 'Noto Sans Tamil', system-ui, sans-serif",
  Fraunces: "'Fraunces', Georgia, 'Noto Sans Tamil', serif",
  'Noto Sans Tamil': "'Noto Sans Tamil', 'Manrope', system-ui, sans-serif",
  Georgia: "Georgia, 'Times New Roman', serif",
  System: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  Mono: "'SFMono-Regular', ui-monospace, 'Cascadia Code', monospace",
};

export const PORTFOLIO_FONT_IDS = Object.keys(PORTFOLIO_FONT_STACKS);

export const PORTFOLIO_RADII = ['sm', 'md', 'lg'] as const;
export const PORTFOLIO_DENSITIES = ['compact', 'comfortable'] as const;
export const PORTFOLIO_THEME_MODES = ['light', 'dark', 'system'] as const;

export function fontStack(id: string): string {
  return PORTFOLIO_FONT_STACKS[id] ?? PORTFOLIO_FONT_STACKS['Manrope'];
}

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
}

export const DEFAULT_LIGHT_THEME: PortfolioTheme = {
  mode: 'light',
  tokens: {
    primary: '#111111',
    accent: '#6c5ce7',
    surface: '#ffffff',
    text: '#111111',
    fontHeading: 'Georgia',
    fontBody: 'Manrope',
    radius: 'md',
    density: 'comfortable',
  },
};

export const DEFAULT_DARK_THEME: PortfolioTheme = {
  mode: 'dark',
  tokens: {
    primary: '#f5f7ff',
    accent: '#8f7bff',
    surface: '#12121a',
    text: '#f5f7ff',
    fontHeading: 'Outfit',
    fontBody: 'Manrope',
    radius: 'md',
    density: 'comfortable',
  },
};

export function themeTokens(
  overrides: Partial<PortfolioThemeTokens> = {},
): PortfolioThemeTokens {
  return { ...DEFAULT_LIGHT_THEME.tokens, ...overrides };
}
