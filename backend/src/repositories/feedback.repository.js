import { query } from '../config/db.js';

// Data access only. No business logic, no HTTP concerns.

export async function insertFeedback({ email, category, rating, comment }) {
  const { rows } = await query(
    `INSERT INTO feedback (email, category, rating, comment)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, category, rating, comment, created_at`,
    [email ?? null, category, rating, comment],
  );
  return rows[0];
}

// Builds a WHERE clause + params shared by list and count.
function buildFilters({ category, search }) {
  const clauses = [];
  const params = [];
  if (category) {
    params.push(category);
    clauses.push(`category = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    clauses.push(`(email ILIKE $${params.length} OR comment ILIKE $${params.length})`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  return { where, params };
}

export async function listFeedback({ page, limit, ...filters }) {
  const { where, params } = buildFilters(filters);

  const countResult = await query(`SELECT COUNT(*)::int AS total FROM feedback ${where}`, params);
  const total = countResult.rows[0].total;

  const offset = (page - 1) * limit;
  const pageParams = [...params, limit, offset];
  const { rows } = await query(
    `SELECT id, email, category, rating, comment, created_at
     FROM feedback ${where}
     ORDER BY created_at DESC
     LIMIT $${pageParams.length - 1} OFFSET $${pageParams.length}`,
    pageParams,
  );

  return { rows, total };
}

export async function countAll() {
  const { rows } = await query('SELECT COUNT(*)::int AS total FROM feedback');
  return rows[0].total;
}

export async function countSince(interval) {
  const { rows } = await query(
    `SELECT COUNT(*)::int AS total FROM feedback WHERE created_at >= now() - $1::interval`,
    [interval],
  );
  return rows[0].total;
}

export async function averageRating() {
  const { rows } = await query('SELECT COALESCE(AVG(rating), 0)::float AS avg FROM feedback');
  return rows[0].avg;
}

export async function categoryDistribution() {
  const { rows } = await query(
    `SELECT category, COUNT(*)::int AS count
     FROM feedback
     GROUP BY category
     ORDER BY count DESC`,
  );
  return rows;
}

// Daily counts for the last N days (for the trend line).
export async function dailyTrend(days) {
  const { rows } = await query(
    `SELECT to_char(d.day, 'YYYY-MM-DD') AS date,
            COALESCE(f.count, 0)::int AS count
     FROM generate_series(
            (current_date - ($1::int - 1)),
            current_date,
            interval '1 day'
          ) AS d(day)
     LEFT JOIN (
       SELECT date_trunc('day', created_at)::date AS day, COUNT(*) AS count
       FROM feedback
       WHERE created_at >= current_date - ($1::int - 1)
       GROUP BY 1
     ) f ON f.day = d.day
     ORDER BY d.day`,
    [days],
  );
  return rows;
}
