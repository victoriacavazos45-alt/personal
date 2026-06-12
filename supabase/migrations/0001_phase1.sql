-- SeaSmart Phase 1 schema
-- All user tables are RLS-protected: a user can only read and write rows
-- keyed to auth.uid(). The anonymous aggregate table lives in a separate
-- schema area with NO user_id column and NO client access — it is written
-- only by the log-aggregate Edge Function using the service role.

-- ── User data ────────────────────────────────────────────────────────

create table if not exists public.quiz_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  mode text not null check (mode in ('standard', 'adaptive', 'bookmarks', 'board')),
  categories text[] not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  question_count int not null check (question_count between 1 and 50),
  correct_count int not null check (correct_count >= 0 and correct_count <= question_count),
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  session_id uuid not null references public.quiz_sessions (id) on delete cascade,
  question_id text not null,
  category text not null,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists public.question_stats (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null,
  attempts int not null default 0,
  misses int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create table if not exists public.category_stats (
  user_id uuid not null references auth.users (id) on delete cascade,
  category text not null,
  attempts int not null default 0,
  misses int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, category)
);

create table if not exists public.bookmarks (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create table if not exists public.user_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_active_date date,
  best_score_pct int,
  best_score_date date,
  updated_at timestamptz not null default now()
);

create index if not exists quiz_sessions_user_completed_idx
  on public.quiz_sessions (user_id, completed_at);
create index if not exists quiz_attempts_user_idx
  on public.quiz_attempts (user_id, question_id);

-- ── Row Level Security ───────────────────────────────────────────────

alter table public.quiz_sessions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.question_stats enable row level security;
alter table public.category_stats enable row level security;
alter table public.bookmarks enable row level security;
alter table public.user_stats enable row level security;

-- Server-side rate limit: reject quiz session inserts beyond 12 per minute
-- per user (data-stuffing guard; legitimate use is far below this).
create or replace function public.under_session_rate_limit()
returns boolean
language sql
security definer
set search_path = public
as $$
  select count(*) < 12
  from public.quiz_sessions
  where user_id = auth.uid()
    and created_at > now() - interval '1 minute';
$$;

drop policy if exists "own sessions select" on public.quiz_sessions;
create policy "own sessions select" on public.quiz_sessions
  for select using (auth.uid() = user_id);
drop policy if exists "own sessions insert" on public.quiz_sessions;
create policy "own sessions insert" on public.quiz_sessions
  for insert with check (auth.uid() = user_id and public.under_session_rate_limit());

drop policy if exists "own attempts select" on public.quiz_attempts;
create policy "own attempts select" on public.quiz_attempts
  for select using (auth.uid() = user_id);
drop policy if exists "own attempts insert" on public.quiz_attempts;
create policy "own attempts insert" on public.quiz_attempts
  for insert with check (auth.uid() = user_id);

drop policy if exists "own qstats select" on public.question_stats;
create policy "own qstats select" on public.question_stats
  for select using (auth.uid() = user_id);
drop policy if exists "own cstats select" on public.category_stats;
create policy "own cstats select" on public.category_stats
  for select using (auth.uid() = user_id);

drop policy if exists "own bookmarks all" on public.bookmarks;
create policy "own bookmarks all" on public.bookmarks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own user_stats select" on public.user_stats;
create policy "own user_stats select" on public.user_stats
  for select using (auth.uid() = user_id);
drop policy if exists "own user_stats insert" on public.user_stats;
create policy "own user_stats insert" on public.user_stats
  for insert with check (auth.uid() = user_id);
drop policy if exists "own user_stats update" on public.user_stats;
create policy "own user_stats update" on public.user_stats
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Rollup RPC ───────────────────────────────────────────────────────
-- Applies per-question and per-category counters atomically for the
-- calling user. SECURITY DEFINER so the stats tables stay insert/update
-- closed to direct client writes (select-only policies above).

create or replace function public.apply_attempt_rollups(p_attempts jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  a record;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if jsonb_array_length(p_attempts) > 50 then
    raise exception 'too many attempts in one call';
  end if;

  for a in
    select
      x ->> 'question_id' as question_id,
      x ->> 'category' as category,
      (x ->> 'is_correct')::boolean as is_correct
    from jsonb_array_elements(p_attempts) as x
  loop
    insert into public.question_stats (user_id, question_id, attempts, misses, updated_at)
    values (auth.uid(), a.question_id, 1, case when a.is_correct then 0 else 1 end, now())
    on conflict (user_id, question_id) do update
      set attempts = question_stats.attempts + 1,
          misses = question_stats.misses + case when a.is_correct then 0 else 1 end,
          updated_at = now();

    insert into public.category_stats (user_id, category, attempts, misses, updated_at)
    values (auth.uid(), a.category, 1, case when a.is_correct then 0 else 1 end, now())
    on conflict (user_id, category) do update
      set attempts = category_stats.attempts + 1,
          misses = category_stats.misses + case when a.is_correct then 0 else 1 end,
          updated_at = now();
  end loop;
end;
$$;

-- ── Anonymous aggregate pipeline ─────────────────────────────────────
-- Schema-level separation from user data: no user_id column exists here,
-- no foreign keys into user tables, and no RLS policy grants any client
-- role access. Only the service role (Edge Function) can write; analytics
-- reads happen server-side. Nothing in this table can re-identify a user.

create table if not exists public.aggregate_question_stats (
  question_id text primary key,
  category text not null,
  times_served bigint not null default 0,
  times_missed bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.aggregate_question_stats enable row level security;
-- Intentionally no policies: anon/authenticated roles get nothing.

revoke all on public.aggregate_question_stats from anon, authenticated;
