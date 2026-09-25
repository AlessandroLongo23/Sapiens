-- Exercise runs (vault/Decisioni/2026-09-25 Gli esercizi sono un percorso di livelli.md).
-- One row per run a student starts on a lesson's path: a run at one level, or a jump test that
-- opens a locked level. `plan` is the level of each question in order, so a run knows how long it
-- is and what it asks without reading the generator again. The result of a run is read from its
-- attempts: how many are answered and how many are right.
create table if not exists public.exercise_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_path text not null,
  generator_id text not null,
  kind text not null check (kind in ('level', 'jump')),
  -- 'level': the level practised; 'jump': the level the test opens.
  level smallint not null check (level > 0),
  plan smallint[] not null check (cardinality(plan) > 0),
  started_at timestamptz not null default now()
);

create index if not exists exercise_sessions_user_generator on public.exercise_sessions (user_id, generator_id, started_at desc);

-- Each attempt belongs to a run, at its place in it. The pair is unique, so a question asked twice
-- (a retried request, a prefetch fired twice) is the same row. Attempts written before runs existed
-- have neither.
alter table public.exercise_attempts add column if not exists session_id uuid references public.exercise_sessions (id) on delete cascade;
alter table public.exercise_attempts add column if not exists position smallint check (position >= 0);
create unique index if not exists exercise_attempts_session_position on public.exercise_attempts (session_id, position) where session_id is not null;

-- As for attempts: students read their own runs, only the server writes.
alter table public.exercise_sessions enable row level security;

drop policy if exists "exercise_sessions: owner reads own" on public.exercise_sessions;
create policy "exercise_sessions: owner reads own"
  on public.exercise_sessions for select to authenticated
  using (user_id = auth.uid());
