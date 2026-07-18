import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

// Applied only to the public submit endpoint to blunt spam/abuse.
export const submitRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: { message: 'Too many submissions. Please try again in a moment.' },
  },
});
