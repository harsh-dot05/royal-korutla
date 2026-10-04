"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        data,
        message,
    });
}
function sendError(res, code, message, statusCode = 400, details = {}) {
    return res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            details,
        },
    });
}
