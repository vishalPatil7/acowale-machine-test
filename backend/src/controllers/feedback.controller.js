import { feedbackService } from '../services/feedback.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Controllers do request/response plumbing only. `req.validated` is set by the
// validate() middleware, so parsing/coercion already happened.

export const createFeedback = asyncHandler(async (req, res) => {
  const created = await feedbackService.submit(req.validated.body);
  res.status(201).json({ data: created });
});

export const getFeedback = asyncHandler(async (req, res) => {
  const result = await feedbackService.list(req.validated.query);
  res.json(result);
});
