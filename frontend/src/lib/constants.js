export const CATEGORIES = ['Bug', 'Feature request', 'Complaint', 'Praise', 'Other'];

export const ACCENT = '#FF6B2C';

// Solid color per category (used for the distribution bars + dots).
export const CATEGORY_COLOR = {
  Bug: '#FB7185',
  'Feature request': '#60A5FA',
  Complaint: '#FBBF24',
  Praise: '#34D399',
  Other: '#94A3B8',
};

// [background, text] for the small pill badges.
export const CATEGORY_PILL = {
  Bug: ['rgba(251,113,133,.13)', '#FB7185'],
  'Feature request': ['rgba(96,165,250,.13)', '#60A5FA'],
  Complaint: ['rgba(251,191,36,.13)', '#FBBF24'],
  Praise: ['rgba(52,211,153,.13)', '#34D399'],
  Other: ['rgba(148,163,184,.13)', '#94A3B8'],
};

export const RATING_LABELS = ['', 'Very poor', 'Poor', 'Okay', 'Good', 'Excellent'];

export const initialOf = (email) => (email ? email[0].toUpperCase() : '?');
export const starsText = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);
