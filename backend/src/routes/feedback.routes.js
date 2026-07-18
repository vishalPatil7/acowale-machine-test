import { Router } from 'express';
import { createFeedback, getFeedback } from '../controllers/feedback.controller.js';
import { validate } from '../middlewares/validate.js';
import { submitRateLimiter } from '../middlewares/rateLimiter.js';
import { createFeedbackSchema, listFeedbackSchema } from '../validation/feedback.schema.js';

export const feedbackRouter = Router();

feedbackRouter.post(
  '/',
  submitRateLimiter,
  validate(createFeedbackSchema, 'body'),
  createFeedback,
);

feedbackRouter.get('/', validate(listFeedbackSchema, 'query'), getFeedback);
