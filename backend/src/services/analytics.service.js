import * as defaultRepo from '../repositories/feedback.repository.js';
import { CATEGORIES } from '../validation/feedback.schema.js';

export function createAnalyticsService(repo = defaultRepo) {
  return {
    async summary() {
      const [total, thisWeek, avg, distributionRaw, trend] = await Promise.all([
        repo.countAll(),
        repo.countSince('7 days'),
        repo.averageRating(),
        repo.categoryDistribution(),
        repo.dailyTrend(14),
      ]);

      // Ensure every known category appears (even with 0), ordered by count desc.
      const byCategory = new Map(distributionRaw.map((r) => [r.category, r.count]));
      const distribution = CATEGORIES.map((name) => {
        const count = byCategory.get(name) ?? 0;
        return {
          category: name,
          count,
          percentage: total ? Math.round((count / total) * 100) : 0,
        };
      }).sort((a, b) => b.count - a.count);

      return {
        total,
        thisWeek,
        averageRating: Number(avg.toFixed(2)),
        topCategory: distribution[0]?.count ? distribution[0].category : null,
        distribution,
        trend,
      };
    },
  };
}

export const analyticsService = createAnalyticsService();
