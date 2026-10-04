"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.env = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/royalkorutla?schema=public',
    JWT_SECRET: process.env.JWT_SECRET || 'rk_super_secret_jwt_key_korutla_2026',
    COOKIE_SECRET: process.env.COOKIE_SECRET || 'rk_cookie_secret_key_2026',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@royalkorutla.com',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'RoyalKorutla@Owner2026!',
};
