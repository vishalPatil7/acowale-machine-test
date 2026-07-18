import CategoryPill from '../CategoryPill.jsx';
import { initialOf, starsText } from '../../lib/constants.js';
import { timeAgo } from '../../lib/timeAgo.js';

export default function FeedbackRow({ item }) {
  return (
    <div className="bg-[#17181d] border border-[rgba(255,255,255,0.07)] rounded-[12px] px-[18px] py-4 flex gap-[14px] items-start box-border transition-colors hover:border-[rgba(255,255,255,0.16)]">
      <div className="w-[34px] h-[34px] rounded-full bg-[#22242b] flex items-center justify-center text-[12px] font-semibold text-[rgba(235,236,240,0.75)] flex-none">
        {initialOf(item.email)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[13.5px] font-semibold">{item.email ?? 'anonymous'}</span>
          <CategoryPill category={item.category} />
          <span className="text-[13px] text-[#FBBF24] tracking-[1px]">{starsText(item.rating)}</span>
          <span className="ml-auto text-[12px] text-[rgba(235,236,240,0.35)]">
            {timeAgo(item.created_at)}
          </span>
        </div>
        <p className="mt-2 text-[14px] leading-[1.5] text-[rgba(235,236,240,0.75)]">{item.comment}</p>
      </div>
    </div>
  );
}
