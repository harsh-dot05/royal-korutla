import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/royalkorutla?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'rk_super_secret_jwt_key_korutla_2026',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'rk_cookie_secret_key_2026',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@royalkorutla.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'RoyalKorutla@Owner2026!',
};
