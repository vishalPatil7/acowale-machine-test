import pino from 'pino';
import { isProd } from '../config/env.js';

// Pretty logs in dev, structured JSON in production.
export const logger = pino(
  isProd
    ? { level: 'info' }
    : {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname' },
        },
      },
);
