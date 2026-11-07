import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

export type RequestWithCorrelation = Request & { correlationId?: string };

/** Assign / echo X-Request-Id for support correlation (Doc 10 §5). */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: RequestWithCorrelation, res: Response, next: NextFunction): void {
    const incoming = req.header(REQUEST_ID_HEADER)?.trim();
    const id =
      incoming && incoming.length <= 128 ? incoming : randomUUID();
    req.correlationId = id;
    res.setHeader('X-Request-Id', id);
    next();
  }
}
