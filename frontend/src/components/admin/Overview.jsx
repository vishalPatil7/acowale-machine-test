import StatCard from './StatCard.jsx';
import CategoryBars from './CategoryBars.jsx';
import TrendChart from './TrendChart.jsx';
import RecentSubmissions from './RecentSubmissions.jsx';

export default function Overview({ analytics, recent, onViewAll }) {
  const top = analytics.distribution[0];
  const topLabel = top?.category === 'Feature request' ? 'Features' : top?.category ?? '—';
  const stats = [
    { label: 'Total feedback', value: String(analytics.total), sub: 'across all time', subColor: 'rgba(235,236,240,0.4)' },
    { label: 'This week', value: String(analytics.thisWeek), sub: 'last 7 days', subColor: '#34D399' },
    { label: 'Avg. rating', value: `${analytics.averageRating} / 5`, sub: 'across all entries', subColor: 'rgba(235,236,240,0.4)' },
    { label: 'Top category', value: topLabel, sub: `${top?.count ?? 0} entries`, subColor: 'rgba(235,236,240,0.4)' },
  ];

  return (
    <div className="animate-fade-up">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
        <h1 className="m-0 text-[24px] font-bold tracking-[-0.3px]">Overview</h1>
        <span className="text-[13px] text-[rgba(235,236,240,0.4)]">Last 30 days</span>
      </div>

      <div className="grid gap-[14px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div
        className="grid gap-[14px] mt-[14px]"
        style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}
      >
        <CategoryBars distribution={analytics.distribution} />
        <TrendChart trend={analytics.trend} />
      </div>

      <div className="mt-[14px]">
        <RecentSubmissions items={recent} onViewAll={onViewAll} />
      </div>
    </div>
  );
}
