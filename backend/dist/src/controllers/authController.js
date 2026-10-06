"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAdmin = exports.getAdminMe = exports.loginAdmin = void 0;
const env_1 = require("../config/env");
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const prisma_1 = require("../utils/prisma");
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return (0, response_1.sendError)(res, 'UNAUTHORIZED', 'Email and password are required.', 401);
        }
        const cleanEmail = email.trim().toLowerCase();
        const envAdminEmail = env_1.env.ADMIN_EMAIL.trim().toLowerCase();
        // 1. Try finding user in database
        let dbUser = null;
        try {
            dbUser = await prisma_1.prisma.user.findUnique({
                where: { email: cleanEmail },
            });
        }
        catch (e) {
            // Database connection error handling
        }
        if (dbUser) {
            if (dbUser.role !== 'ADMIN') {
                return (0, response_1.sendError)(res, 'FORBIDDEN', 'Access denied. Account is not an Admin.', 403);
            }
            const isValidPassword = (0, auth_1.comparePassword)(password, dbUser.passwordHash);
            if (!isValidPassword) {
                return (0, response_1.sendError)(res, 'UNAUTHORIZED', 'Invalid admin credentials.', 401);
            }
            const adminUser = {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
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
        // 2. Fallback check against env variables & auto-seed to DB
        if (cleanEmail === envAdminEmail && password === env_1.env.ADMIN_PASSWORD) {
            const passwordHash = (0, auth_1.hashPassword)(password);
            let adminUser = {
                id: 'admin-owner-001',
                name: 'Royal Korutla Owner (Admin)',
                email: env_1.env.ADMIN_EMAIL,
                role: 'ADMIN',
            };
            try {
                const createdUser = await prisma_1.prisma.user.upsert({
                    where: { email: envAdminEmail },
                    update: { passwordHash, role: 'ADMIN' },
                    create: {
                        id: 'admin-owner-001',
                        name: 'Royal Korutla Owner (Admin)',
                        email: envAdminEmail,
                        passwordHash,
                        role: 'ADMIN',
                        phone: '+91 98480 12345',
                        status: 'ACTIVE',
                    },
                });
                adminUser = {
                    id: createdUser.id,
                    name: createdUser.name,
                    email: createdUser.email,
                    role: 'ADMIN',
                };
            }
            catch (e) {
                // If DB not reachable, proceed with adminUser
            }
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
    }
    catch (err) {
        return (0, response_1.sendError)(res, 'SERVER_ERROR', 'Failed to process Admin login', 500);
    }
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
