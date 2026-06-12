-- SeaSmart 0003: explicit table-level grants for the API roles.
--
-- RLS policies (0001/0002) filter rows, but Postgres separately requires
-- table privileges. Projects without default grants for the Supabase API
-- roles fail with 42501 "permission denied for table ...". Grants are
-- intentionally minimal: anon gets nothing beyond schema usage (the app
-- makes no data queries before sign-in), and the blind aggregate table
-- stays closed to both client roles.
-- Idempotent: safe to run repeatedly.

grant usage on schema public to anon, authenticated;

grant select, insert on public.quiz_sessions to authenticated;
grant select, insert on public.quiz_attempts to authenticated;
grant select on public.question_stats to authenticated;
grant select on public.category_stats to authenticated;
grant select, insert, update, delete on public.bookmarks to authenticated;
grant select, insert, update on public.user_stats to authenticated;
grant select, insert, update, delete on public.annotations to authenticated;
grant select, insert, update, delete on public.mnemonic_favorites to authenticated;

-- quiz_attempts uses an identity column; inserts touch its sequence.
grant usage, select on all sequences in schema public to authenticated;

grant execute on function public.apply_attempt_rollups(jsonb) to authenticated;
grant execute on function public.under_session_rate_limit() to authenticated;

-- Blind aggregate pipeline: no client access, ever (Edge Function only).
revoke all on public.aggregate_question_stats from anon, authenticated;
