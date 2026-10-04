import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import { sendError } from '../utils/response';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[API ERROR]', err);

  if (err instanceof ApiError) {
    return sendError(res, err.code, err.message, err.statusCode, err.details);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'SERVER_ERROR';

  return sendError(res, code, message, statusCode);
}
