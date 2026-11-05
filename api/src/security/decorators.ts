import { applyDecorators } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { THROTTLE_DEFAULT } from './security.constants';

/** Skip rate limits (health probes only). */
export const NoThrottle = () => SkipThrottle({ [THROTTLE_DEFAULT]: true });

/** Auth entry endpoints — tighter than default browse (~10 / minute). */
export function AuthThrottle(
  limit = Number(process.env.RATE_LIMIT_AUTH_MAX ?? 10) || 10,
  ttlMs = Number(process.env.RATE_LIMIT_AUTH_TTL_MS ?? 60_000) || 60_000,
) {
  return applyDecorators(
    Throttle({
      [THROTTLE_DEFAULT]: { limit, ttl: ttlMs },
    }),
  );
}

/** Job apply — burst guard (~5 / minute). Pair with per-seeker daily quota in applications. */
export function ApplyThrottle(
  limit = Number(process.env.APPLY_RATE_LIMIT_MAX ?? 5) || 5,
  ttlMs = Number(process.env.APPLY_RATE_LIMIT_TTL_MS ?? 60_000) || 60_000,
) {
  return applyDecorators(
    Throttle({
      [THROTTLE_DEFAULT]: { limit, ttl: ttlMs },
    }),
  );
}

/**
 * Very sensitive APIs — **1 request per hour** per tracker (IP + token + tab).
 * Job-portal abuse surfaces: admin login, OTP start, account delete, channel pull,
 * AI enrich, payment confirm, notification dev triggers.
 */
export function SensitiveThrottle(
  limit = Number(process.env.RATE_LIMIT_SENSITIVE_MAX ?? 1) || 1,
  ttlMs =
    Number(process.env.RATE_LIMIT_SENSITIVE_TTL_MS ?? 60 * 60 * 1000) ||
    60 * 60 * 1000,
) {
  return applyDecorators(
    Throttle({
      [THROTTLE_DEFAULT]: { limit, ttl: ttlMs },
    }),
  );
}

/**
 * In-app AI help chat — tight burst (~3 / minute). Pair with per-user
 * cooldown + daily token budget in HelpChatService.
 */
export function ChatThrottle(
  limit = Number(process.env.AI_HELP_RATE_LIMIT_MAX ?? 3) || 3,
  ttlMs = Number(process.env.AI_HELP_RATE_LIMIT_TTL_MS ?? 60_000) || 60_000,
) {
  return applyDecorators(
    Throttle({
      [THROTTLE_DEFAULT]: { limit, ttl: ttlMs },
    }),
  );
}
