# SeaSmart

Rules of the Road training platform for U.S. Navy bridge watchstanders.
React + Tailwind CSS (no component libraries), Supabase auth + database.

## Status

**Phase 1 — Quiz Engine: complete.**

- Customizable quiz: 5–50 question slider, six category filters
- USCG-style question bank incl. SVG image-based questions (lights, shapes, distress, towing)
- Answer choices re-randomized on every presentation
- Green/red feedback; incorrect answers show verbatim rule text with critical words yellow-highlighted
- Adaptive mode weighted by per-question and per-category miss rates
- Bookmarks + bookmark-only quizzes
- Progress dashboard: daily/weekly/monthly trend chart, category breakdown (custom SVG, no chart libs)
- Retention: daily streak, session-end summary card, micro-celebrations, next-challenge prompt, personal bests

Phase 2 (Rules Index, Board Mode, Mnemonics) and Phase 3 (Lights Lab) are not started — pending confirmation.

## Running locally

```bash
npm install
npm run dev
```

Without Supabase credentials the app runs in **local training mode** (progress on-device only) so the full quiz experience can be exercised immediately.

## Connecting Supabase

1. Create a Supabase project (or use the existing one).
2. Run `supabase/migrations/0001_phase1.sql` in the SQL editor.
3. Deploy the Edge Function: `supabase functions deploy log-aggregate`.
4. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (anon key only — the service role key is used exclusively inside the Edge Function environment).
5. `npm run dev` / `npm run build`.

## Security model

- **RLS everywhere** — every user table is policy-restricted to `auth.uid()`.
- **No service key on the client** — sensitive writes (anonymous aggregates) go through the `log-aggregate` Edge Function.
- **No localStorage tokens** — Supabase Auth uses a sessionStorage adapter; tokens are scoped to the tab.
- **Input validation** — all form input validated client-side; DB enforces check constraints.
- **Rate limiting** — server-side insert policy caps quiz session writes per user per minute; the Edge Function rate-limits per IP; the client throttles submissions.
- **Blind aggregates** — `aggregate_question_stats` has no user column, no joins to user data, and no client access at the schema level.

## Privacy

Accounts are email + password only. No name, rank, rate, or unit is collected. Aggregate analytics are counter-only and cannot re-identify a user. The data layer (`src/lib/store.js`) is the single integration point for a future privacy policy and Google Analytics — no rebuild required.

## Extending the question bank

`src/data/questions.js` documents the question schema. The full official USCG bank can be appended there or migrated to a Supabase table behind the same store interface.
