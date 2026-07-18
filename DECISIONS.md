# DECISIONS

My answers to the 11 questions.

### 1. Why did you choose this technology stack?

React + Vite + Express + Postgres. It's a boring stack, and that's deliberate.
Anyone reviewing this can clone it and run it without learning anything new.
Vite gives me fast reloads, Express doesn't force a structure on me so I could
lay out the backend the way I wanted, and React is where I'm quickest. For a
take-home, I'd rather the interesting part be my decisions than my tooling.

### 2. Why did you choose this database?

Postgres, hosted on Supabase.

Feedback data is relational, and the dashboard is really just a handful of SQL
questions: count by category, average rating, search the comments, show a daily
trend. Postgres does all of that in plain SQL. A document database would've
made the analytics harder for nothing at this size.

Supabase is only the hosting choice — free tier, nothing to install, SSL out of
the box. The schema is plain Postgres, nothing Supabase-specific. Swap the
connection string and it runs anywhere.

### 3. Why did you structure your application this way?

Four backend layers, each with one job. Routes define endpoints. Controllers
only touch the request and response. Services hold the business logic — those
are the parts with unit tests, run against a fake repository so no database is
needed. Repositories are the only place SQL lives (apart from the health
check's `SELECT 1` and the schema/seed scripts). Middlewares handle the shared
stuff: validation, errors, rate limiting, logging.

The frontend follows the same idea. Small components, all API calls in one
`src/api` module, shared constants and formatters in `src/lib`.

Is this much structure needed for a prototype? It's close to the line,
honestly. But it made testing easy, and the brief says to assume the team keeps
building this after launch — so I wrote it like code someone else will inherit.

### 4. What trade-offs did you make due to time constraints?

- **Auth is fake.** Any credentials log you in. Real sessions and password
  hashing didn't fit the time box, and the dashboard is read-only anyway.
- **No integration tests against a live DB.** I have unit tests on the service
  layer, and I covered the rest manually — curl on every endpoint and a
  headless-browser run of the full submit flow.
- **I built date filtering, then deleted it.** The API took `from`/`to` params
  at one point. No UI ever used them and the brief only asks for basic
  filtering and search, so during a scope review I cut them rather than keep
  dead code around to look thorough.
- **CSS bar charts instead of a chart library.** No tooltips or animations, but
  also no extra bundle weight.

### 5. What would you improve with one more week?

Real auth with roles. A detail view per feedback item with status and tags.
Date and rating filters in the UI — bringing back what I cut, this time with
actual controls. Integration tests against a throwaway Postgres in CI. Cursor
pagination. CSV export. And moving rate limiting into Redis so it survives
running more than one server.

### 6. What was the most difficult technical challenge you faced?

Connecting to managed Postgres, weirdly enough. Supabase requires SSL, so the
`pg` pool needs an explicit `ssl` option or the connection just gets refused.
And Supabase gives you two different endpoints: a direct connection on 5432 and
a transaction pooler on 6543. They behave differently. Migrations and an
always-on Express server want the direct one; the pooler is meant for
serverless. Pick wrong and you get intermittent failures that look like
anything but a connection-string problem. I made SSL configurable through
`PGSSL` and wrote the endpoint choice into `.env.example` so nobody has to
rediscover this.

### 7. Which AI tools did you use?

Claude, in three places. Claude Code did the heavy lifting — scaffolding the
backend layers, building components, running migrations and checks. Claude
Design helped me iterate on my own UI before I wrote any frontend code. And I
kept a separate Claude chat open as a planning partner, mostly for scoping and
for deciding what *not* to build. I read and directed every step. Nothing is in
this repo that I can't explain.

### 8. Share one instance where AI helped you.

Late in the project I asked the AI to audit its own earlier work for
over-engineering — I'd asked it to "performance optimize" early on, which was a
mistake for something this small. The audit found `React.memo` wrapped around
six tiny components, `useMemo` caching five-element arrays, lazy loading on an
app that builds to one ~60 KB bundle, and a dead error-factory method. It
checked each removal was safe before I approved it. The code got simpler and
nothing got slower. Having the AI critique its own output turned out to be more
useful than having it write more code. This isn't me being anti-performance —
the day real usage or a profiler points at a slow render or an oversized bundle,
I'll put these back, and I'll have a number to justify each one.

### 9. Share one instance where you disagreed with AI and why.

Same audit. It recommended deleting the daily-trend query because the UI never
displayed it — technically true, it was unused. But the brief's whole point is
that the team wants to "analyse trends through a dashboard," so the trend
wasn't speculative, it was unfinished. I kept it and wired it into the admin
overview as a 14-day chart instead. In the same pass I *did* take its advice to
delete the date filter, which genuinely had no reason to exist. Same kind of
finding, opposite calls. The difference was whether the brief actually asked
for it.

### 10. What would break first at 100,000 users?

The list query. `OFFSET` pagination makes Postgres scan and throw away rows on
deep pages, and `ILIKE '%search%'` with a leading wildcard can't use a normal
index. Both get slower as the table grows. The fix is cursor pagination plus a
`pg_trgm` index (or proper full-text search) on comments.

Right behind that: the rate limiter lives in memory, so it stops working the
moment there's a second server instance — that moves to Redis. And free-tier
connection limits, which is when the API goes behind Supabase's pooler or
PgBouncer.

### 11. One thing you'd improve, change, or challenge about the assignment.

I'd challenge the idea that "admin login" is where the security effort belongs.
For a feedback tool, the risky surface is the public form — that's what the
internet can hit with spam and abuse. The dashboard behind it is read-only.
So I put the effort into the write path: validation, rate limiting, content
limits. The admin gate stayed a clearly-labelled prototype, and I think that's
the right call even outside a time box.