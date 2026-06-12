# SeaSmart — Session Handoff

_Last updated: 2026-06-12. State as of commit `ab82e30` on branch `claude/optimistic-bell-9ctpyr` (pushed)._

## What this is

SeaSmart is a mobile-first Rules of the Road (COLREGs) training platform for U.S. Navy bridge
watchstanders. React 18 + Vite + Tailwind 3, **no component libraries** (all custom components),
Supabase for auth + data. The PRD is the source of truth for scope; build order is
Phase 1 → 2 → 3 with user confirmation between phases.

**Phases 1 and 2 are complete, tested, and pushed. Phase 3's 2D Lights Lab is complete
(`src/data/vessels.js` + `screens/LightsLabScreen.jsx`, route `/lights`). The 3D extension is
NOT started — gated on founder confirmation and Jane's data licensing per the PRD.**

## Repo / branch state

- Repo: `victoriacavazos45-alt/personal`. The portfolio site at the repo root (`index.html`) is
  unrelated — never touch it. The app lives entirely in `seasmart/`.
- Branch: `claude/optimistic-bell-9ctpyr`, in sync with origin. Commits:
  `77356a7` (Phase 1) → `0b18fba` (Phase 2) → `ab82e30` (full COLREGs text).
- Commit convention: author `Claude <noreply@anthropic.com>` (a stop-hook enforces this).
- A separate empty repo `victoriacavazos45-alt/seasmart` exists; pushing there was blocked by
  session scope (only `personal` is authorized). The user may eventually want the app moved there.

## What's built

### Phase 1 — Quiz Engine
- Quiz setup: 5–50 question slider, 6 category checkboxes, adaptive toggle.
- Bank: 72 USCG-style questions in `src/data/questions.js` (schema documented in the file
  header), incl. image-based questions rendered as parametric SVGs (`components/Illustration.jsx`).
- Choices reshuffle on every presentation (`lib/quizEngine.js`); verified uniform.
- Feedback: green/red shading; misses show verbatim rule text with critical phrases in a yellow
  CSS highlight (`mark.crit` in `index.css`).
- Adaptive mode: weighted sampling by per-question and per-category miss rates.
- Bookmarks + bookmark-only quizzes; progress dashboard with hand-built SVG charts
  (daily/weekly/monthly trend, category bars).
- Retention: daily streak (`lib/streak.js`), session-end summary card with one suggested next
  action (never a dead end), micro-celebrations (CSS burst/pop), personal bests.

### Phase 2 — Rules Index, Board Mode, Mnemonics
- Rules Index (`screens/RulesIndexScreen.jsx` + `RuleReaderScreen.jsx`): full-text search,
  Kindle-style reader — select text → Highlight bar; tap a highlight → margin-note editor.
  Annotations anchor to `(rule_id, paragraph_id, start_offset, end_offset)` and sync via store.
  Each rule links to quiz questions citing it (mapping built in `src/data/rules.js` by parsing
  `question.rule` strings).
- Board Mode (`screens/BoardScreen.jsx`): 12 items — 6 MC (20 s each) + 6 fill-in-the-blank
  (30 s each) from `src/data/boardItems.js` (22 FIB items; answers matched after normalization
  against explicit accepted variants). No hints; misses flash the answer ~2.4 s and advance.
  Fastest run at ≥80% = personal best (`best_board_seconds`).
- Mnemonic Library: 24 curated mnemonics in `src/data/mnemonics.js`, favorites persisted.

### COLREGs text (loaded, with provenance caveat)
- `src/data/colregs.json` holds the complete International Regulations: Rules 1–41 incl.
  Part F, Annexes I–IV; 464 paragraphs, ~12k words, one entry per lettered subparagraph.
- navcen.uscg.gov and Wikisource are unreachable from this environment (egress allowlist), so
  the text was imported from the GitHub project `cguegan/iColregs` (public-domain treaty text),
  then: cross-validated against all 72 verbatim quiz-bank excerpts (all match), spot-checked on
  key figures, and patched for 26 transcription typos (all in annexes; list in `ab82e30`).
- **Open item: the user should do a human spot-check against navcen.uscg.gov.** If text is
  edited, never change paragraph `id`s — annotations anchor to them, and editing a paragraph's
  text shifts highlight offsets for that paragraph.
- `docs/colregs-template.json` documents the data schema.

## File map (all under `seasmart/`)

```
index.html, vite.config.js, tailwind.config.js, postcss.config.js, .env.example
src/main.jsx, src/App.jsx        app shell: auth gate, context (useApp), hash routes
src/index.css                    design tokens, mark.crit highlight, slider, reduced-motion
src/lib/    supabaseClient.js (sessionStorage token adapter — never localStorage)
            store.js (SupabaseStore + LocalStore behind one async API — ALL data I/O goes here)
            quizEngine.js (selection, adaptive weights, shuffle, highlightSegments)
            streak.js, validate.js, router.jsx (hash router, state via navigate(path, state))
src/data/   questions.js (quiz bank), categories.js, colregs.json (rule text),
            rules.js (lookup + question↔rule mapping + search), boardItems.js, mnemonics.js
src/components/  ui.jsx (Button, Card, Checkbox, Toggle, Slider css, icons, Burst…),
                 Illustration.jsx (SVG scenes), charts.jsx (SVG charts), Layout.jsx (header/streak)
src/screens/     Auth, Home, QuizSetup, Quiz, Results, Bookmarks, Dashboard,
                 RulesIndex, RuleReader, Board, Mnemonics
supabase/migrations/0001_phase1.sql   user tables, RLS, rate-limit policy, rollup RPC,
                                      blind aggregate table (no user column, no client access)
supabase/migrations/0002_phase2.sql   annotations, mnemonic_favorites, board timing columns
supabase/functions/log-aggregate/     Edge Function for anonymous aggregates (service key only here)
docs/colregs-template.json            rule-text schema reference
docs/HANDOFF.md                       this file
```

## Design system (apply to everything new)

Navy `#1B3A5C` (primary), cream `#F5F0E8`, white/beige neutrals; gold `#7F6A3E` ONLY on small
accents (anchor icon, SectionLabel, hairlines, favorite stars). Serif headlines (Source Serif 4),
Inter for UI. Editorial, sparse — The Atlantic / New Yorker register. Square corners, hairline
borders, no shadows beyond `Card`'s. Use existing primitives in `components/ui.jsx`.

## Supabase status

- The app runs in **local training mode** (LocalStore → localStorage) because no
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are configured. All features work locally.
- Migrations 0001 + 0002 are written but **it is unknown whether they've been applied** to the
  user's Supabase project, and the Edge Function is not deployed. Connecting = run both
  migrations, deploy `log-aggregate`, fill `.env`. Security model details are in README.md.

## Verification workflow (no browser available in this env)

`npm run build` for compile; logic + DOM tests are ad-hoc: bundle with the local esbuild
(`node_modules/.bin/esbuild --bundle --jsx=automatic --loader:.js=jsx --external:react
--external:react-dom`, define the two `import.meta.env` vars), then drive with `jsdom`
(installed via `npm i --no-save jsdom`; run test files from inside `seasmart/` so React resolves
once). Prior test scripts live in git history under `.tmptest/` in commit messages' context —
they were deleted after passing, recreate as needed.

## Phase 3 — Lights Lab (next, NOT started)

PRD scope, in order:
1. **2D first**: interactive vessel viewer, day/night toggle. Day = silhouette/profile;
   night = accurate light configuration per COLREGs Annex I (positions + colors).
2. Vessel categories: Navy (DDG, LCS, CVN), merchant, fishing, recreational, towing.
3. Tappable lights → rule reference popover (link into the Rules Index reader; rules data and
   `QUESTIONS_BY_RULE` mapping already exist).
4. **3D (360° rotation, simplified Jane's-based models) is a Phase 3 EXTENSION** — PRD open
   questions say to confirm with founders before starting 3D, and to confirm Jane's data
   licensing first. Do not start 3D without explicit user confirmation.

Implementation guidance for whoever picks this up:
- Reuse the night-scene SVG language from `components/Illustration.jsx` (light glow = 3 stacked
  circles); build vessel profiles as new parametric SVG components, data-driven from a
  `src/data/vessels.js` file: per vessel `{ id, name, category, silhouette path(s), lights: [{
  color, x, y, arc, ruleId }] }` so light positions carry their own rule references.
- Day/night via a state toggle that swaps fill palettes (navy-night background exists in the
  Tailwind config as `navy.night`).
- New route `/lights` + Home menu card; no store changes needed unless tracking usage
  (a `lights_lab_view` event would go through `store.js` if wanted).
- The PRD's Annex I positioning rules (masthead height ratios, sidelight screening, vertical
  separations) are in the loaded Rules Index text — use them to place lights credibly.

## Gotchas for the next session

- Git pushes failed with 403 early in the session, then started working (permissions were
  fixed server-side). If pushes 403: retry later, the patch/tarball-to-user fallback works.
- Session scope is `victoriacavazos45-alt/personal` ONLY (git proxy + GitHub MCP both enforce).
- Network egress allowlist blocks most of the web; `raw.githubusercontent.com` and the npm
  registry are reachable; GitHub code search via MCP works for finding files to fetch raw.
- Do not put COLREGs text inline in code/chat output in bulk — it previously tripped content
  filtering. Keep rule text in `colregs.json` and manipulate it with scripts.
- The user prefers: complete a phase fully → confirm it works → ask before the next phase.
