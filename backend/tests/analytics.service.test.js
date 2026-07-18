import { describe, it, expect, vi } from 'vitest';
import { createAnalyticsService } from '../src/services/analytics.service.js';

function makeRepo(overrides = {}) {
  return {
    countAll: vi.fn(async () => 10),
    countSince: vi.fn(async () => 4),
    averageRating: vi.fn(async () => 3.6667),
    categoryDistribution: vi.fn(async () => [
      { category: 'Bug', count: 6 },
      { category: 'Praise', count: 4 },
    ]),
    dailyTrend: vi.fn(async () => [{ date: '2026-07-01', count: 2 }]),
    ...overrides,
  };
}

describe('analyticsService.summary', () => {
  it('rounds the average and fills in every known category (zeros included)', async () => {
    const service = createAnalyticsService(makeRepo());
    const summary = await service.summary();

    expect(summary.total).toBe(10);
    expect(summary.thisWeek).toBe(4);
    expect(summary.averageRating).toBe(3.67);
    expect(summary.topCategory).toBe('Bug');

    // All 5 categories present, sorted by count desc.
    expect(summary.distribution).toHaveLength(5);
    expect(summary.distribution[0]).toEqual({ category: 'Bug', count: 6, percentage: 60 });
    const complaint = summary.distribution.find((d) => d.category === 'Complaint');
    expect(complaint).toEqual({ category: 'Complaint', count: 0, percentage: 0 });
  });

  it('handles an empty dataset without dividing by zero', async () => {
    const repo = makeRepo({
      countAll: vi.fn(async () => 0),
      averageRating: vi.fn(async () => 0),
      categoryDistribution: vi.fn(async () => []),
    });
    const service = createAnalyticsService(repo);
    const summary = await service.summary();

    expect(summary.total).toBe(0);
    expect(summary.topCategory).toBeNull();
    expect(summary.distribution.every((d) => d.percentage === 0)).toBe(true);
  });
});
