import { useEffect, useState } from 'react';
import FeedbackRow from './FeedbackRow.jsx';
import { fetchFeedback } from '../../api/feedback.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { CATEGORIES, ACCENT } from '../../lib/constants.js';

const PAGE_SIZE = 8;
const FILTERS = ['All', ...CATEGORIES];

export default function FeedbackList() {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ data: [], pagination: null, loading: true, error: '' });

  const debouncedSearch = useDebounce(search, 300);

  // Reset to page 1 whenever the query (search/filter) changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterCat]);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: '' }));
    fetchFeedback({ page, limit: PAGE_SIZE, category: filterCat, search: debouncedSearch })
      .then((res) => {
        if (!cancelled) setState({ data: res.data, pagination: res.pagination, loading: false, error: '' });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: [], pagination: null, loading: false, error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [page, filterCat, debouncedSearch]);

  const clearFilters = () => {
    setSearch('');
    setFilterCat('All');
  };

  const chips = FILTERS.map((c) => ({ name: c, active: filterCat === c }));

  const { data, pagination, loading, error } = state;
  const total = pagination?.total ?? 0;
  const noResults = !loading && !error && data.length === 0;

  return (
    <div className="animate-fade-up">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-5">
        <h1 className="m-0 text-[24px] font-bold tracking-[-0.3px]">Feedback</h1>
        <span className="text-[13px] text-[rgba(235,236,240,0.4)]">
          {pagination ? `Showing ${data.length} of ${total} entries` : '…'}
        </span>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-[10px] items-center mb-[18px]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search email or comment…"
          className="flex-[1_1_220px] max-w-[340px] bg-[#17181d] border border-[rgba(255,255,255,0.1)] rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#ebecf0] font-[inherit] min-h-[44px] box-border"
        />
        <div className="flex flex-wrap gap-2">
          {chips.map((f) => (
            <button
              key={f.name}
              onClick={() => setFilterCat(f.name)}
              className="min-h-[38px] px-[14px] rounded-full text-[13px] font-medium font-[inherit] cursor-pointer transition-colors"
              style={{
                border: `1px solid ${f.active ? ACCENT : 'rgba(255,255,255,0.12)'}`,
                background: f.active ? ACCENT : '#17181d',
                color: f.active ? '#141414' : 'rgba(235,236,240,0.7)',
              }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-[10px] min-h-[200px]">
        {error && (
          <div className="text-center py-14 text-[#FB7185] text-sm">{error}</div>
        )}
        {loading && !error && (
          <div className="text-center py-14 text-[rgba(235,236,240,0.4)] text-sm">Loading feedback…</div>
        )}
        {!loading &&
          !error &&
          data.map((item) => <FeedbackRow key={item.id} item={item} />)}
        {noResults && (
          <div className="text-center py-14 px-5 text-[rgba(235,236,240,0.4)] text-sm">
            No feedback matches your filters.
            <br />
            <button
              onClick={clearFilters}
              className="mt-3 border-0 bg-transparent text-[#FF6B2C] text-[13px] font-medium font-[inherit] cursor-pointer hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev}
            className="min-h-[38px] px-4 rounded-[8px] border border-[rgba(255,255,255,0.12)] bg-transparent text-[13px] text-[#ebecf0] font-[inherit] cursor-pointer transition-colors hover:border-[rgba(255,255,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-[13px] text-[rgba(235,236,240,0.5)]">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNext}
            className="min-h-[38px] px-4 rounded-[8px] border border-[rgba(255,255,255,0.12)] bg-transparent text-[13px] text-[#ebecf0] font-[inherit] cursor-pointer transition-colors hover:border-[rgba(255,255,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
