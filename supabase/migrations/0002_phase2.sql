-- SeaSmart Phase 2: Rules Index annotations, mnemonic favorites, Board Mode timing.

-- Board Mode: completion time per session, fastest qualifying run per user.
alter table public.quiz_sessions
  add column if not exists duration_seconds int check (duration_seconds is null or duration_seconds between 1 and 7200);

alter table public.user_stats
  add column if not exists best_board_seconds int;

-- Kindle-style highlights + margin notes, anchored to a rule paragraph by
-- character offsets. Synced across devices (per PRD open question, resolved
-- in favor of sync since they live in Supabase anyway).
create table if not exists public.annotations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  rule_id text not null,
  paragraph_id text not null,
  start_offset int not null check (start_offset >= 0),
  end_offset int not null check (end_offset > start_offset),
  selected_text text not null check (char_length(selected_text) <= 2000),
  note text check (note is null or char_length(note) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists annotations_user_rule_idx
  on public.annotations (user_id, rule_id);

alter table public.annotations enable row level security;

create policy "own annotations all" on public.annotations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Favorited mnemonics.
create table if not exists public.mnemonic_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  mnemonic_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, mnemonic_id)
);

alter table public.mnemonic_favorites enable row level security;

create policy "own mnemonic favorites all" on public.mnemonic_favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
