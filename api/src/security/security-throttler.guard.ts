import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import { extractAccessToken, extractTabId } from './token.util';

/**
 * Rate-limit tracker keyed by IP + optional access token + tab id so
 * authenticated abuse cannot hide behind a shared NAT alone.
 */
@Injectable()
export class SecurityThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, unknown>): Promise<string> {
    const request = req as unknown as Request;
    const forwarded = request.headers['x-forwarded-for'];
    const ip =
      (typeof forwarded === 'string'
        ? forwarded.split(',')[0]?.trim()
        : undefined) ||
      request.ip ||
      request.socket?.remoteAddress ||
      'unknown';
    const token = extractAccessToken(request);
    const tab = extractTabId(request);
    const tokenPart = token ? token.slice(0, 12) : 'anon';
    const tabPart = tab ? tab.slice(0, 12) : 'notab';
    return `${ip}:${tokenPart}:${tabPart}`;
  }

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    return super.shouldSkip(context);
  }
}
