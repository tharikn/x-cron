import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import type { Response } from 'express';
import type { RequestWithCorrelation } from '../correlation-id.middleware';

export type FieldErrorMap = Record<string, string>;

/** Flatten nested ValidationError trees into `parent.child` → first message. */
export function flattenValidationErrors(
  errors: ValidationError[],
  prefix = '',
): FieldErrorMap {
  const out: FieldErrorMap = {};
  for (const err of errors) {
    const path = prefix ? `${prefix}.${err.property}` : err.property;
    if (err.constraints) {
      const first = Object.values(err.constraints)[0];
      if (first && !out[path]) out[path] = first;
    }
    if (err.children?.length) {
      Object.assign(out, flattenValidationErrors(err.children, path));
    }
  }
  return out;
}

export function validationFailedException(errors: ValidationError[]): BadRequestException {
  return new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Validation failed',
    errors: flattenValidationErrors(errors),
  });
}

/**
 * Ensures validation-shaped 400s always expose `errors` as a field map.
 * Primary formatting is via ValidationPipe `exceptionFactory`.
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<RequestWithCorrelation>();
    const status = exception.getStatus();
    const body = exception.getResponse();
    const correlationId = req.correlationId;

    if (typeof body === 'string') {
      res.status(status).json({
        statusCode: status,
        error: 'Bad Request',
        message: body,
        ...(correlationId ? { correlationId } : {}),
      });
      return;
    }

    const payload = body as Record<string, unknown>;
    // Already field-mapped (exceptionFactory / InputProtector)
    if (payload.errors && typeof payload.errors === 'object' && !Array.isArray(payload.errors)) {
      res.status(status).json({
        statusCode: status,
        error: 'Bad Request',
        message: typeof payload.message === 'string' ? payload.message : 'Validation failed',
        errors: payload.errors,
        ...(correlationId ? { correlationId } : {}),
      });
      return;
    }

    // Nest default: message is string[]
    if (Array.isArray(payload.message)) {
      res.status(status).json({
        statusCode: status,
        error: 'Bad Request',
        message: 'Validation failed',
        errors: { _form: (payload.message as string[]).join('; ') },
        details: payload.message,
        ...(correlationId ? { correlationId } : {}),
      });
      return;
    }

    res.status(status).json({
      statusCode: status,
      error: typeof payload.error === 'string' ? payload.error : 'Bad Request',
      message: typeof payload.message === 'string' ? payload.message : 'Bad Request',
      ...(payload.errors ? { errors: payload.errors } : {}),
      ...(correlationId ? { correlationId } : {}),
    });
  }
}
