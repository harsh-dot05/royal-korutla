"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.requireAdmin = requireAdmin;
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
function authenticateToken(req, res, next) {
    let token;
    if (req.cookies && req.cookies.rk_session_token) {
        token = req.cookies.rk_session_token;
    }
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.substring(7);
    }
    if (!token) {
        return (0, response_1.sendError)(res, 'UNAUTHORIZED', 'Authentication token required. Please login as Admin.', 401);
    }
    const payload = (0, auth_1.verifyJwtToken)(token);
    if (!payload) {
        return (0, response_1.sendError)(res, 'UNAUTHORIZED', 'Invalid or expired session token.', 401);
    }
    req.user = payload;
    next();
}
function requireAdmin(req, res, next) {
    authenticateToken(req, res, () => {
        if (!req.user || req.user.role !== 'ADMIN') {
            return (0, response_1.sendError)(res, 'FORBIDDEN', 'Access denied. You do not have ADMIN permissions.', 403);
        }
        next();
    });
}
