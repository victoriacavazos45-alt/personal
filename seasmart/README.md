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

**Phase 2 — Rules Index, Board Mode, Mnemonic Library: complete** (rule text pending, see below).

- Rules Index: searchable, Kindle-style reader — select text to highlight, tap a highlight for margin notes; annotations persist and sync. Rules link to the quiz questions that cite them ("Drill these questions").
- Board Mode: 12-question timed qual-board simulation mixing multiple choice (20s) and fill-in-the-blank (30s). No hints; a miss flashes the answer briefly and moves on. Fastest run at ≥80% is tracked as a personal best.
- Mnemonic Library: 24 curated Navy/USCG mnemonics by category, with favorites.

### Rule text provenance

`src/data/colregs.json` contains the complete International Regulations (COLREGs 1972 as amended — Rules 1–41 including Part F, plus Annexes I–IV; ~12,000 words, 464 paragraphs). The text is the public-domain treaty text as published by the USCG. Because navcen.uscg.gov blocks automated retrieval, it was imported from a community transcription and then:

- cross-validated against the 72 independently-written verbatim rule excerpts in the quiz bank (all match);
- spot-checked on key figures (22.5°, 112.5°, 135°, 225°, 4.5 m, 6 miles, 110 dB, 300 mm, 70–200 Hz…);
- patched for 26 identified transcription typos (all in the annexes; list in the git history).

**Recommended before relying on it for qualification: a human spot-check against navcen.uscg.gov.** To re-import or correct text, edit `src/data/colregs.json` directly — `docs/colregs-template.json` documents the schema. Paragraph ids anchor user annotations: never change them after launch (editing a paragraph's text shifts highlight offsets for that paragraph).

Fill-in-the-blank answers in Board Mode are matched after normalization (case, punctuation, whitespace) against an explicit list of accepted variants per item (`src/data/boardItems.js`).

Phase 3 (Lights Lab) is not started — pending confirmation.

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
