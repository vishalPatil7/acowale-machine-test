import { Router } from 'express';
import { feedbackRouter } from './feedback.routes.js';
import { analyticsRouter } from './analytics.routes.js';
import { healthRouter } from './health.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/feedback', feedbackRouter);
apiRouter.use('/analytics', analyticsRouter);
