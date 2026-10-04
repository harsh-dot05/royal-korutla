import { Request, Response } from 'express';
import { env } from '../config/env';
import { generateJwtToken } from '../utils/auth';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const loginAdmin = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const targetEmail = env.ADMIN_EMAIL.trim().toLowerCase();
  const cleanEmail = (email || '').trim().toLowerCase();

  if (cleanEmail === targetEmail && password === env.ADMIN_PASSWORD) {
    const adminUser = {
      id: 'admin-owner-001',
      name: 'Royal Korutla Owner (Admin)',
      email: env.ADMIN_EMAIL,
      role: 'ADMIN' as const,
    };

    const token = generateJwtToken(adminUser);

    res.cookie('rk_session_token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return sendSuccess(
      res,
      {
        user: adminUser,
        token,
      },
      'Admin login successful'
    );
  }

  return sendError(res, 'UNAUTHORIZED', 'Invalid admin credentials.', 401);
};

export const getAdminMe = (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, { user: req.user }, 'Admin session verified');
};

export const logoutAdmin = (req: Request, res: Response) => {
  res.clearCookie('rk_session_token', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
  });

  return sendSuccess(res, null, 'Logged out successfully');
};
