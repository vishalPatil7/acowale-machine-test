import { CATEGORY_COLOR } from '../../lib/constants.js';

// CSS bar chart of category distribution (matches the design's bars).
export default function CategoryBars({ distribution }) {
  const max = Math.max(1, ...distribution.map((d) => d.count));

  return (
    <div className="bg-[#17181d] border border-[rgba(255,255,255,0.07)] rounded-[14px] p-[22px] box-border">
      <div className="text-[15px] font-semibold mb-[18px]">By category</div>
      <div className="flex flex-col gap-[14px]">
        {distribution.map((c) => {
          const color = CATEGORY_COLOR[c.category] ?? CATEGORY_COLOR.Other;
          return (
            <div key={c.category} className="flex flex-col gap-[6px]">
              <div className="flex justify-between text-[13px]">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-[2px]"
                    style={{ background: color }}
                  />
                  {c.category}
                </span>
                <span className="text-[rgba(235,236,240,0.5)]">
                  {c.count} · {c.percentage}%
                </span>
              </div>
              <div
                className="h-[6px] rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden"
                role="meter"
                aria-valuenow={c.count}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-label={`${c.category}: ${c.count}`}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${Math.round((c.count / max) * 100)}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
