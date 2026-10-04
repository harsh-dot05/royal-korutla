import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issueMap: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join('.') || 'body';
          issueMap[path] = issue.message;
        });
        return sendError(res, 'VALIDATION_ERROR', 'Validation failed for request payload', 400, issueMap);
      }
      return sendError(res, 'INVALID_REQUEST', 'Invalid request body', 400);
    }
  };
}
