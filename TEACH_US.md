# TEACH_US

**Don't trust AI code. Make it prove itself.**

The thing I'd bring to Acowale isn't a tool, it's a habit I forced on myself
during this project: never accept AI-generated code because it *reads* correct.
Make it pass a check against something real before moving on.

AI doesn't usually write bad code. It writes convincing code. That's worse,
because bad code gets caught in review and convincing code doesn't. So my rule
for every piece it built was simple — run it against the real thing. Real
database, real HTTP request, real browser. If I couldn't check it for real, I
didn't consider it done.

This saved me once in a big way. When I set up the Supabase database, the AI
wrote the `pg` connection pool and honestly it looked perfect. I ran the actual
migration against the actual database anyway. Refused instantly. Turns out
Supabase won't accept connections without SSL, so the pool needs an explicit
`ssl` option — and there's a second trap right behind it: Supabase gives you
two connection endpoints, direct (5432) and a transaction pooler (6543), and a
long-running server needs the direct one. If I'd only found this at deploy
time, the pooler version fails intermittently and looks like anything except a
connection problem. Would've eaten my evening. Instead it took five minutes,
because the failure happened on my machine, on my terms.

The other half of the habit is reading every diff, even boring ones. During a
cleanup refactor the AI removed a `React.memo` wrapper but left the old
`export default memo(...)` line sitting there. Two default exports, dead build.
A grep before running caught it. No amount of "the refactor is complete ✓"
messages would have.

Why I think this matters for Acowale: AI makes everyone faster at *writing*
code, which quietly moves the bottleneck to *checking* code. A team that only
speeds up generation just reaches broken faster. The cheap fix is making
verification as fast as generation — a seeded database anyone can spin up, a
curl script that hits every endpoint, a headless browser check for the main
user flow. None of that is fancy. But it means when the AI (or a tired human)
ships something plausible-but-wrong, you find out in seconds instead of in
production.

Speed you can't verify isn't speed. It's just risk with good marketing.