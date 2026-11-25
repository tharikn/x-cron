import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

export interface RequestWithLogging extends Request {
  correlationId?: string;
  user?: { id?: string; userId?: string; sub?: string } | null;
}

/**
 * Terminal access log — emits exactly one log line per HTTP request through
 * the Nest logger once the response finishes (status + duration). Correlation
 * id + principal ride along so support / debugging can grep a single request.
 *
 * Why this exists: NestJS + Express never log HTTP traffic on their own, and
 * this API had no global request logging wired up — so the API terminal only
 * ever showed service/scheduler logs, never what the API itself was doing.
 */
@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggingMiddleware.name);

  use(req: RequestWithLogging, res: Response, next: NextFunction): void {
    const startedAt = Date.now();

    res.on('finish', () => {
      const durationMs = Date.now() - startedAt;
      const status = res.statusCode;
      const correlationId = req.correlationId;
      const userId = req.user?.userId ?? req.user?.id ?? req.user?.sub;
      const message = `HTTP ${req.method} ${req.originalUrl ?? req.url} status=${status} durationMs=${durationMs} correlationId=${correlationId ?? '-'} userId=${userId ?? '-'}`;

      if (status >= 500) {
        this.logger.error(message);
      } else if (status >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
