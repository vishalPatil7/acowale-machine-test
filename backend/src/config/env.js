import dotenv from 'dotenv';

dotenv.config();

const toInt = (val, fallback) => {
  const n = Number.parseInt(val ?? '', 10);
  return Number.isFinite(n) ? n : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: toInt(process.env.PORT, 4000),
  corsOrigin: (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  db: {
    connectionString: process.env.DATABASE_URL || undefined,
    ssl: String(process.env.PGSSL).toLowerCase() === 'true',
  },
  rateLimit: {
    windowMs: toInt(process.env.SUBMIT_RATE_WINDOW_MS, 60000),
    max: toInt(process.env.SUBMIT_RATE_MAX, 10),
  },
};

export const isProd = env.nodeEnv === 'production';
