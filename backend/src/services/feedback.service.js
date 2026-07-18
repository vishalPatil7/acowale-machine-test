import * as defaultRepo from '../repositories/feedback.repository.js';

// Factory lets tests inject a fake repository (no DB needed).
export function createFeedbackService(repo = defaultRepo) {
  return {
    async submit(input) {
      // Normalize before persisting. Validation already happened at the boundary.
      const clean = {
        email: input.email ? input.email.toLowerCase() : null,
        category: input.category,
        rating: input.rating,
        comment: input.comment.trim(),
      };
      return repo.insertFeedback(clean);
    },

    async list({ page = 1, limit = 10, category, search }) {
      const { rows, total } = await repo.listFeedback({ page, limit, category, search });
      const totalPages = Math.max(1, Math.ceil(total / limit));
      return {
        data: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    },
  };
}

export const feedbackService = createFeedbackService();
