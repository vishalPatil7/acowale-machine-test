import { ACCENT } from '../../lib/constants.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Format a 'YYYY-MM-DD' string as 'Jul 4' without going through Date (avoids
// timezone shifts on the date-only string).
function label(dateStr) {
  const [, m, d] = dateStr.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

// Daily submission counts for the last 14 days, as plain CSS bars (same
// approach as CategoryBars - no charting library). Data comes straight from
// /api/analytics/summary's `trend`.
export default function TrendChart({ trend = [] }) {
  const hasData = trend.length > 0 && trend.some((d) => d.count > 0);
  const max = Math.max(1, ...trend.map((d) => d.count));
  const mid = Math.floor(trend.length / 2);
  const last = trend.length - 1;

  return (
    <div className="bg-[#17181d] border border-[rgba(255,255,255,0.07)] rounded-[14px] p-[22px] box-border">
      <div className="flex justify-between items-baseline mb-[18px]">
        <div className="text-[15px] font-semibold">Feedback trend</div>
        <span className="text-[12px] text-[rgba(235,236,240,0.4)]">Last 14 days</span>
      </div>

      {hasData ? (
        <>
          <div className="flex items-end gap-[4px] h-[120px]" role="img" aria-label="Daily feedback counts, last 14 days">
            {trend.map((d) => (
              <div
                key={d.date}
                title={`${label(d.date)}: ${d.count}`}
                className="flex-1 h-full flex items-end"
              >
                <div
                  className="w-full rounded-t-[3px] transition-[height] duration-500"
                  style={{
                    height: d.count === 0 ? '4%' : `${Math.max(8, (d.count / max) * 100)}%`,
                    background: d.count === 0 ? 'rgba(255,255,255,0.08)' : ACCENT,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-[10px] text-[11px] text-[rgba(235,236,240,0.4)]">
            <span>{label(trend[0].date)}</span>
            <span>{label(trend[mid].date)}</span>
            <span>{label(trend[last].date)}</span>
          </div>
        </>
      ) : (
        <div className="h-[120px] flex items-center justify-center text-[13px] text-[rgba(235,236,240,0.4)] text-center">
          No feedback in the last 14 days yet.
        </div>
      )}
    </div>
  );
}
