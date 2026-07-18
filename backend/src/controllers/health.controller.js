import { pool } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getHealth = asyncHandler(async (req, res) => {
  let db = 'up';
  try {
    await pool.query('SELECT 1');
  } catch {
    db = 'down';
  }
  const healthy = db === 'up';
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    db,
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
