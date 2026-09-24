-- Exercise attempts (vault/Decisioni/2026-09-24 Ogni tentativo salva l'esercizio intero.md).
-- One row per exercise sent to a student, written by the server when it sends it and completed
-- when the student answers. The row keeps the whole exercise as shown, so a later change to a
-- generator never rewrites anybody's history; generator, level and seed only record where it
-- came from. The server checks the answer against this row, so the right answer never reaches
-- the page.
create table if not exists public.exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- The lesson's database path when the exercise was shown (it can move in the tree later).
  lesson_path text not null,
  generator_id text not null,
  level smallint not null check (level > 0),
  seed bigint not null,
  mode text not null default 'choice' check (mode in ('choice', 'open')),
  -- The generator's Sample plus `choice`, the multiple-choice variant as shown.
  exercise jsonb not null check (jsonb_typeof(exercise) = 'object'),
  shown_at timestamptz not null default now(),
  -- { "choice": index } for multiple choice; the typed text once open answers exist.
  answer jsonb,
  correct boolean,
  answered_at timestamptz,
  -- Time with the page visible between showing and answering, measured in the browser.
  active_ms integer check (active_ms >= 0),
  -- The deployed commit, to find attempts made with a generator that later turned out wrong.
  build text,
  check ((answered_at is null) = (correct is null) and (answered_at is null) = (answer is null))
);

create index if not exists exercise_attempts_user_shown on public.exercise_attempts (user_id, shown_at desc);
create index if not exists exercise_attempts_user_generator on public.exercise_attempts (user_id, generator_id, answered_at desc)
  where answered_at is not null;

-- Students read their own rows. Nobody writes from the browser: the server writes with the
-- service role, so an exercise cannot be marked right by hand.
alter table public.exercise_attempts enable row level security;

drop policy if exists "exercise_attempts: owner reads own" on public.exercise_attempts;
create policy "exercise_attempts: owner reads own"
  on public.exercise_attempts for select to authenticated
  using (user_id = auth.uid());
