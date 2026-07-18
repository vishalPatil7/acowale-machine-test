import { Router } from 'express';
import { getSummary } from '../controllers/analytics.controller.js';

export const analyticsRouter = Router();

analyticsRouter.get('/summary', getSummary);
