"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
function validateBody(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const issueMap = {};
                error.issues.forEach((issue) => {
                    const path = issue.path.join('.') || 'body';
                    issueMap[path] = issue.message;
                });
                return (0, response_1.sendError)(res, 'VALIDATION_ERROR', 'Validation failed for request payload', 400, issueMap);
            }
            return (0, response_1.sendError)(res, 'INVALID_REQUEST', 'Invalid request body', 400);
        }
    };
}
