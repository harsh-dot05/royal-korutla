import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken, TokenPayload } from '../utils/auth';
import { sendError } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token: string | undefined;

  if (req.cookies && req.cookies.rk_session_token) {
    token = req.cookies.rk_session_token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7);
  }

  if (!token) {
    return sendError(res, 'UNAUTHORIZED', 'Authentication token required. Please login as Admin.', 401);
  }

  const payload = verifyJwtToken(token);
  if (!payload) {
    return sendError(res, 'UNAUTHORIZED', 'Invalid or expired session token.', 401);
  }

  req.user = payload;
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  authenticateToken(req, res, () => {
    if (!req.user || req.user.role !== 'ADMIN') {
      return sendError(res, 'FORBIDDEN', 'Access denied. You do not have ADMIN permissions.', 403);
    }
    next();
  });
}
