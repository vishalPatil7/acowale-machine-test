import { api } from './client.js';

export const submitFeedback = (payload) => api.post('/feedback', payload);

export function fetchFeedback({ page = 1, limit = 10, category, search } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category && category !== 'All') params.set('category', category);
  if (search) params.set('search', search);
  return api.get(`/feedback?${params.toString()}`);
}

export const fetchAnalytics = () => api.get('/analytics/summary');
