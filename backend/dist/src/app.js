"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = __importDefault(require("./routes"));
const error_1 = require("./middleware/error");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
// Security headers with Helmet
app.use((0, helmet_1.default)());
// Dynamic CORS settings for multi-device access
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman) or matching origins
        if (!origin ||
            origin === env_1.env.FRONTEND_URL ||
            origin.startsWith('http://localhost') ||
            origin.startsWith('http://127.0.0.1') ||
            origin.startsWith('http://192.168.') ||
            origin.startsWith('https://')) {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    credentials: true,
}));
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests from this IP, please try again later.',
        },
    },
});
app.use(limiter);
// Parse JSON & Cookies
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)(env_1.env.COOKIE_SECRET));
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'UP',
        message: 'Royal Korutla Express Backend operational 👑',
        timestamp: new Date().toISOString(),
    });
});
// Register API Routes
app.use(routes_1.default);
// Centralized Error Handling Middleware
app.use(error_1.errorHandler);
exports.default = app;
