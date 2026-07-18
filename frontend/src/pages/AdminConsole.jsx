import { useEffect, useState } from 'react';
import Sidebar from '../components/admin/Sidebar.jsx';
import Overview from '../components/admin/Overview.jsx';
import FeedbackList from '../components/admin/FeedbackList.jsx';
import { fetchAnalytics, fetchFeedback } from '../api/feedback.js';

export default function AdminConsole() {
  const [tab, setTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [recent, setRecent] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: '' });

  // Overview data: analytics summary + the 5 most recent submissions.
  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchAnalytics(), fetchFeedback({ page: 1, limit: 5 })])
      .then(([a, r]) => {
        if (cancelled) return;
        setAnalytics(a.data);
        setRecent(r.data);
        setStatus({ loading: false, error: '' });
      })
      .catch((err) => {
        if (!cancelled) setStatus({ loading: false, error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const goFeedback = () => setTab('feedback');

  return (
    <div className="min-h-screen flex flex-wrap items-stretch">
      <Sidebar tab={tab} onTab={setTab} total={analytics?.total} />

      <main className="flex-[100_1_560px] min-w-0 px-8 pt-7 pb-28 box-border">
        {tab === 'overview' ? (
          status.loading ? (
            <div className="text-[rgba(235,236,240,0.4)] text-sm py-10">Loading analytics…</div>
          ) : status.error ? (
            <div className="text-[#FB7185] text-sm py-10">
              Could not load analytics: {status.error}
            </div>
          ) : (
            <Overview analytics={analytics} recent={recent} onViewAll={goFeedback} />
          )
        ) : (
          <FeedbackList />
        )}
      </main>
    </div>
  );
}
