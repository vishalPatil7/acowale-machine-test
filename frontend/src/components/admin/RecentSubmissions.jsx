import CategoryPill from '../CategoryPill.jsx';
import { initialOf } from '../../lib/constants.js';
import { timeAgo } from '../../lib/timeAgo.js';

export default function RecentSubmissions({ items, onViewAll }) {
  return (
    <div className="bg-[#17181d] border border-[rgba(255,255,255,0.07)] rounded-[14px] p-[22px] box-border">
      <div className="flex justify-between items-baseline mb-[14px]">
        <div className="text-[15px] font-semibold">Recent submissions</div>
        <button
          onClick={onViewAll}
          className="border-0 bg-transparent text-[#FF6B2C] text-[13px] font-medium font-[inherit] cursor-pointer p-0 hover:underline"
        >
          View all →
        </button>
      </div>
      <div className="flex flex-col">
        {items.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-3 py-[11px] border-b border-[rgba(255,255,255,0.05)] last:border-b-0"
          >
            <div className="w-8 h-8 rounded-full bg-[#22242b] flex items-center justify-center text-[12px] font-semibold text-[rgba(235,236,240,0.75)] flex-none">
              {initialOf(r.email)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                {r.comment}
              </div>
              <div className="text-[11.5px] text-[rgba(235,236,240,0.4)] mt-[2px]">
                {r.email ?? 'anonymous'} · {timeAgo(r.created_at)}
              </div>
            </div>
            <CategoryPill category={r.category} />
          </div>
        ))}
      </div>
    </div>
  );
}
