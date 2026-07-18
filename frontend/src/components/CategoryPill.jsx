import { CATEGORY_PILL } from '../lib/constants.js';

export default function CategoryPill({ category }) {
  const [bg, color] = CATEGORY_PILL[category] ?? CATEGORY_PILL.Other;
  return (
    <span
      className="text-[11px] font-semibold px-[9px] py-[3px] rounded-full"
      style={{ background: bg, color }}
    >
      {category}
    </span>
  );
}
