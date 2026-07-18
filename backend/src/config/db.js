import pg from 'pg';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

// A single shared connection pool for the whole process. Connects via
// DATABASE_URL; set PGSSL=true for managed Postgres like Supabase, which
// requires SSL (rejectUnauthorized:false accepts its managed certificate chain).
export const pool = new Pool({
  connectionString: env.db.connectionString,
  ssl: env.db.ssl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected error on idle Postgres client');
});

// Thin query helper so repositories never import `pool` directly.
export const query = (text, params) => pool.query(text, params);

export async function assertDbConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    logger.info('Postgres connection OK');
  } finally {
    client.release();
  }
}

export async function closePool() {
  await pool.end();
}
