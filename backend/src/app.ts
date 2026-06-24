import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import mongoose from 'mongoose';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

app.use('/api/', rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '500'),
  message: { success: false, message: 'Too many requests, please try again later.' },
}));

// CORS — restrict origins in production, permissive in dev
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : null;

app.use(cors({
  origin: (origin, cb) => {
    // In production, only allow configured origins
    if (process.env.NODE_ENV === 'production' && allowedOrigins) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    }
    // In development, allow all origins
    cb(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Health check
app.get('/api/health', (_req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'ok' : 'degraded',
    database: dbOk ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// DB guard — if DB is down, return helpful error for all API calls
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is not connected. The server is starting up — please wait a moment and try again.',
    });
  }
  next();
});

app.use('/api', routes);
app.use(errorHandler);

export default app;
