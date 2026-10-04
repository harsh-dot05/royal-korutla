"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAdmin = exports.getAdminMe = exports.loginAdmin = void 0;
const env_1 = require("../config/env");
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const loginAdmin = (req, res) => {
    const { email, password } = req.body;
    const targetEmail = env_1.env.ADMIN_EMAIL.trim().toLowerCase();
    const cleanEmail = (email || '').trim().toLowerCase();
    if (cleanEmail === targetEmail && password === env_1.env.ADMIN_PASSWORD) {
        const adminUser = {
            id: 'admin-owner-001',
            name: 'Royal Korutla Owner (Admin)',
            email: env_1.env.ADMIN_EMAIL,
            role: 'ADMIN',
        };
        const token = (0, auth_1.generateJwtToken)(adminUser);
        res.cookie('rk_session_token', token, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });
        return (0, response_1.sendSuccess)(res, {
            user: adminUser,
            token,
        }, 'Admin login successful');
    }
    return (0, response_1.sendError)(res, 'UNAUTHORIZED', 'Invalid admin credentials.', 401);
};
exports.loginAdmin = loginAdmin;
const getAdminMe = (req, res) => {
    return (0, response_1.sendSuccess)(res, { user: req.user }, 'Admin session verified');
};
exports.getAdminMe = getAdminMe;
const logoutAdmin = (req, res) => {
    res.clearCookie('rk_session_token', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: env_1.env.NODE_ENV === 'production',
    });
    return (0, response_1.sendSuccess)(res, null, 'Logged out successfully');
};
exports.logoutAdmin = logoutAdmin;
