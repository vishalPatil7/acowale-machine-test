import { pool } from '../config/db.js';
import { logger } from '../utils/logger.js';

// Seed data mirrors the design mock, spread across ~30 days so the analytics
// trend and "this week" numbers are meaningful. `daysAgo` -> created_at offset.
const rows = [
  { email: 'nadia@brightloop.io', category: 'Praise', rating: 5, comment: 'The new dashboard loads instantly. Huge upgrade from what we used before.', daysAgo: 0 },
  { email: 'arjun.k@stackline.dev', category: 'Bug', rating: 2, comment: 'CSV export fails silently when the file has more than 10k rows.', daysAgo: 0 },
  { email: 'm.oliveira@ventia.co', category: 'Feature request', rating: 4, comment: 'Would love keyboard shortcuts for approving orders - we process dozens daily.', daysAgo: 0 },
  { email: 'sofia@kembel.studio', category: 'Complaint', rating: 2, comment: 'Support took two days to reply about a billing issue. Expected faster turnaround.', daysAgo: 0 },
  { email: 'dev.rathi@quorum.app', category: 'Bug', rating: 3, comment: 'Date filter on reports resets after page refresh.', daysAgo: 1 },
  { email: 'lena@fjordworks.no', category: 'Praise', rating: 5, comment: 'Onboarding was the smoothest I have seen in a B2B tool. Well done.', daysAgo: 1 },
  { email: 'tomas@grella.mx', category: 'Feature request', rating: 4, comment: 'A dark mode for the reports view would be great for late-night work.', daysAgo: 2 },
  { email: 'priya.s@nortal.in', category: 'Other', rating: 3, comment: 'Is there a public roadmap? Would help us plan our integration work.', daysAgo: 2 },
  { email: 'jb@caldera.finance', category: 'Complaint', rating: 1, comment: 'Pricing page does not mention the per-seat minimum. Felt misleading.', daysAgo: 3 },
  { email: 'hana@mirocorp.jp', category: 'Feature request', rating: 4, comment: 'Please add webhook support for feedback events.', daysAgo: 4 },
  { email: 'ollie@britewave.uk', category: 'Bug', rating: 2, comment: 'Notification emails arrive twice for every team mention.', daysAgo: 5 },
  { email: 'grace@tallow.co', category: 'Praise', rating: 5, comment: 'Team performance view saved our weekly review meeting an hour.', daysAgo: 6 },
  { email: 'sam@driftlane.io', category: 'Other', rating: 4, comment: 'Docs are solid but an API changelog would help.', daysAgo: 8 },
  { email: 'ines@volterra.pt', category: 'Feature request', rating: 3, comment: 'Bulk-edit for feedback tags in the admin console.', daysAgo: 14 },
  { email: 'marco@lumenpay.eu', category: 'Praise', rating: 5, comment: 'Switching plans was painless and the prorated invoice was clear.', daysAgo: 16 },
  { email: 'yuki@aoba.jp', category: 'Bug', rating: 2, comment: 'Mobile layout overflows horizontally on the analytics page.', daysAgo: 19 },
  { email: null, category: 'Other', rating: 4, comment: 'Anonymous note: love the product, keep shipping.', daysAgo: 22 },
  { email: 'ruth@northgate.co.uk', category: 'Complaint', rating: 2, comment: 'The session timeout is too aggressive for long data-entry work.', daysAgo: 25 },
  { email: 'dmitri@sever.dev', category: 'Feature request', rating: 5, comment: 'SSO via Okta would let us roll this out company-wide.', daysAgo: 27 },
  { email: 'aisha@medina.ma', category: 'Praise', rating: 4, comment: 'Customer since launch - the reliability has been excellent.', daysAgo: 29 },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE feedback RESTART IDENTITY');
    for (const r of rows) {
      await client.query(
        `INSERT INTO feedback (email, category, rating, comment, created_at)
         VALUES ($1, $2, $3, $4, now() - ($5 || ' days')::interval)`,
        [r.email, r.category, r.rating, r.comment, r.daysAgo],
      );
    }
    await client.query('COMMIT');
    logger.info(`Seeded ${rows.length} feedback rows`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

seed()
  .catch((err) => {
    logger.error({ err }, 'Seed failed');
    process.exitCode = 1;
  })
  .finally(() => pool.end());
