"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
function errorHandler(err, req, res, next) {
    console.error('[API ERROR]', err);
    if (err instanceof errors_1.ApiError) {
        return (0, response_1.sendError)(res, err.code, err.message, err.statusCode, err.details);
    }
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    const code = err.code || 'SERVER_ERROR';
    return (0, response_1.sendError)(res, code, message, statusCode);
}
