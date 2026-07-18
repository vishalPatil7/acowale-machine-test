import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { apiRouter } from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

export function createApp() {
  const app = express();

  // Trust proxy so express-rate-limit sees real client IPs behind a load balancer.
  app.set('trust proxy', 1);

  app.use(pinoHttp({ logger }));
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: '64kb' }));

  app.use('/api', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
