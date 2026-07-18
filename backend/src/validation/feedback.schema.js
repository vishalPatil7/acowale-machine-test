import { z } from 'zod';

export const CATEGORIES = ['Bug', 'Feature request', 'Complaint', 'Praise', 'Other'];

// --- POST /api/feedback body ---
export const createFeedbackSchema = z.object({
  // Optional email; empty string is treated as "not provided".
  email: z
    .string()
    .trim()
    .email('Must be a valid email address')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${CATEGORIES.join(', ')}` }),
  }),
  rating: z.coerce.number().int().min(1, 'Rating is required').max(5),
  comment: z.string().trim().min(1, 'Comment is required').max(2000),
});

// --- GET /api/feedback query params ---
export const listFeedbackSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  category: z.enum(CATEGORIES).optional(),
  search: z.string().trim().max(200).optional(),
});
