import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middleware/error';
import { env } from './config/env';

const app: Express = express();

// Security headers with Helmet
app.use(helmet());

// Dynamic CORS settings for multi-device access
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman) or matching origins
      if (
        !origin ||
        origin === env.FRONTEND_URL ||
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1') ||
        origin.startsWith('http://192.168.') ||
        origin.startsWith('https://')
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    message: 'Royal Korutla Express Backend operational 👑',
    timestamp: new Date().toISOString(),
  });
});

// Register API Routes
app.use(routes);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
