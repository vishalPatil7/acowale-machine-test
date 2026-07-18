import { describe, it, expect, vi } from 'vitest';
import { createFeedbackService } from '../src/services/feedback.service.js';

describe('feedbackService.submit', () => {
  it('lowercases the email and trims the comment before persisting', async () => {
    const insertFeedback = vi.fn(async (row) => ({ id: 1, ...row }));
    const service = createFeedbackService({ insertFeedback });

    await service.submit({
      email: 'User@Example.COM',
      category: 'Bug',
      rating: 3,
      comment: '  needs fixing  ',
    });

    expect(insertFeedback).toHaveBeenCalledWith({
      email: 'user@example.com',
      category: 'Bug',
      rating: 3,
      comment: 'needs fixing',
    });
  });

  it('stores null when no email is provided', async () => {
    const insertFeedback = vi.fn(async (row) => row);
    const service = createFeedbackService({ insertFeedback });

    await service.submit({ category: 'Praise', rating: 5, comment: 'great' });

    expect(insertFeedback).toHaveBeenCalledWith(
      expect.objectContaining({ email: null }),
    );
  });
});

describe('feedbackService.list', () => {
  it('computes pagination metadata correctly', async () => {
    const listFeedback = vi.fn(async () => ({ rows: [{ id: 1 }], total: 25 }));
    const service = createFeedbackService({ listFeedback });

    const result = await service.list({ page: 2, limit: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.pagination).toEqual({
      page: 2,
      limit: 10,
      total: 25,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    });
  });

  it('reports a single page when there are no results', async () => {
    const listFeedback = vi.fn(async () => ({ rows: [], total: 0 }));
    const service = createFeedbackService({ listFeedback });

    const result = await service.list({ page: 1, limit: 10 });

    expect(result.pagination.totalPages).toBe(1);
    expect(result.pagination.hasNext).toBe(false);
    expect(result.pagination.hasPrev).toBe(false);
  });
});
