# Acowale CRM Machine Test by Vishal Patil

A small customer-feedback platform: a public form where anyone can submit
feedback, and an admin dashboard where the team can read and analyse it.
Backed by a REST API.

## Submission links

- **Live app:** https://acowale-machine-test-seven.vercel.app/
- **API health:** https://acowale-machine-test.onrender.com/api/health
- **Repo:** https://github.com/vishalPatil7/acowale-machine-test
- **Notes:** [DECISIONS.md](./DECISIONS.md) · [TEACH_US.md](./TEACH_US.md)

The admin dashboard is at `/admin/login` — any credentials work, it's a prototype gate.
The API is on Render's free tier, so the first request after idle takes ~30–50s to wake.

## What it does

- **Public feedback form** — category, 1–5 star rating, comment, optional email. Validated on both client and server.
- **Admin dashboard** — totals, category distribution, a 14-day trend chart, recent submissions, and a searchable, filterable, paginated feedback list.
- **REST API** — submit feedback, list feedback (paginated/filtered/searched), analytics summary, health check.

## Stack

| Layer    | Choice                                                |
| -------- | ----------------------------------------------------- |
| Frontend | React 18 (hooks), Vite, Tailwind CSS v4, React Router |
| Backend  | Node.js + Express (ES modules)                        |
| Database | PostgreSQL on Supabase (managed, SSL)                 |
| Other    | Zod validation, pino logging, Vitest tests            |

The *why* behind each choice is in [DECISIONS.md](./DECISIONS.md).

## How I built it

1. Read the brief and pinned the scope down: 3 screens (form, admin login, dashboard), 4 endpoints, one table.
2. Sketched the data model — one `feedback` row: email, category, rating, comment, created_at.
3. Wrote the schema and a seed script (20 rows spread across 30 days, so the analytics look real from the start).
4. Built the API layer by layer — routes, controllers, services, repositories — and hit every endpoint with curl as I went.
5. Designed my own UI in Claude Design (my layout, not the brief's reference images), then built it in React.
6. Wired the frontend to the live API. Added debounced search and server-side pagination.
7. Verified end to end in a headless browser: the full submit → dashboard round-trip, including the trend bar bumping after a new submission.
8. Did a scope-review pass to strip premature optimisation, then wrote these docs.

## Architecture

```
Browser
  │  HTTP (fetch, /api/*)
  ▼
React SPA (Vite)  ──build──▶ static files (Vercel)
  │
  ▼
Express API ── routes → controllers → services → repositories
  │              (Zod validation, error handler, rate limit, pino)
  ▼
Supabase Postgres  (single `feedback` table)
```

## Quick start

The database is Supabase, so there's no local DB to install.

```bash
# 1. Create a Supabase project, copy the DIRECT connection string
#    (Settings → Database → Connection string → URI, port 5432).

# 2. Backend
cd backend
cp .env.example .env          # paste your Supabase URL into DATABASE_URL, keep PGSSL=true
npm install
npm run db:reset              # creates schema + seeds 20 rows in one command
npm start                     # http://localhost:4000

# 3. Frontend (second terminal)
cd frontend
cp .env.example .env          # leave VITE_API_URL empty locally (dev proxy → :4000)
npm install
npm run dev                   # http://localhost:5173  (admin at /admin/login — any credentials, it's a prototype gate)
```

> Use Supabase's **direct** connection (port 5432) for migrations and this
> always-on server. The transaction pooler (6543) is only for serverless.

## API reference

Base URL `/api`.

| Method | Path                 | Description                                             |
| ------ | -------------------- | ------------------------------------------------------- |
| GET    | `/health`            | Health check (`status`, `db`, `uptime`)                 |
| POST   | `/feedback`          | Submit feedback (validated, rate-limited)               |
| GET    | `/feedback`          | List feedback: `page`, `limit`, `category`, `search`    |
| GET    | `/analytics/summary` | Totals, category distribution, avg rating, 14-day trend |

```bash
curl -X POST http://localhost:4000/api/feedback \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@co.com","category":"Bug","rating":2,"comment":"CSV export fails."}'
```

Every error uses the same envelope: `{ "error": { "message": "...", "details": [...] } }`
— `details` only shows up on validation failures.

## Production readiness

| Item           | Status   | Where                                                                |
| -------------- | -------- | -------------------------------------------------------------------- |
| Env-var config | Done     | `backend/src/config/env.js`, `.env.example`                          |
| Error handling | Done     | `middlewares/errorHandler.js` (one JSON envelope)                    |
| Validation     | Done     | Zod in `validation/feedback.schema.js` via `middlewares/validate.js` |
| Logging        | Done     | pino in `utils/logger.js`, pino-http in `app.js`                     |
| Health check   | Done     | `GET /api/health` (`controllers/health.controller.js`)               |
| Rate limiting  | Done     | `middlewares/rateLimiter.js` on `POST /feedback`                     |
| Unit tests     | Done     | `backend/tests/*` (service layer, 6 tests)                           |
| Auth           | Partial  | Prototype gate only (`AdminLogin.jsx`) — see DECISIONS Q4 and Q5     |
| Monitoring     | Not done | No metrics or alerting — out of scope for a prototype                |
| CI/CD          | Not done | No pipeline — see DECISIONS Q5                                       |
| Observability  | Partial  | Structured logs only; no tracing or metrics                          |

Search is debounced (300 ms) and the feedback list is paginated server-side
(8 per page). The frontend builds to a single small bundle.

## Deployment

- **DB:** Supabase — run `npm run db:reset` once against the connection string.
- **Backend:** any Node host. `backend/render.yaml` is a ready Render blueprint — set `DATABASE_URL`, `PGSSL=true`, `CORS_ORIGIN`.
- **Frontend:** Vercel — base dir `frontend`, build `npm run build`, output `dist`, SPA rewrite (all paths → `/index.html`), set `VITE_API_URL` to the API URL.