-- The student's progress (vault/Piano/Progressi dello studente.md). Runs gain two kinds that cross lessons:
-- 'practice', the daily practice, and 'review', new exercises where the student recently erred. Each run keeps
-- its own count of answers, and every day of answers is counted in exercise_days, both kept by a trigger when an
-- attempt gets its answer: the path, the streak, the free session and the progress badges read counts instead
-- of adding up attempts every time.

-- Runs that cross lessons name the lesson and generator of each question; a run on one lesson names them once.
alter table public.exercise_sessions drop constraint if exists exercise_sessions_kind_check;
alter table public.exercise_sessions add constraint exercise_sessions_kind_check check (kind in ('level', 'jump', 'practice', 'review'));
alter table public.exercise_sessions alter column lesson_path drop not null;
alter table public.exercise_sessions alter column generator_id drop not null;
alter table public.exercise_sessions add column if not exists plan_lessons text[];
alter table public.exercise_sessions add column if not exists plan_generators text[];
alter table public.exercise_sessions drop constraint if exists exercise_sessions_items_check;
alter table public.exercise_sessions add constraint exercise_sessions_items_check check (
  case when kind in ('level', 'jump')
    then lesson_path is not null and generator_id is not null and plan_lessons is null and plan_generators is null
    else lesson_path is null and generator_id is null
      and cardinality(plan_lessons) = cardinality(plan) and cardinality(plan_generators) = cardinality(plan)
  end
);

-- The run's result so far, and when its last question was answered.
alter table public.exercise_sessions add column if not exists answered smallint not null default 0;
alter table public.exercise_sessions add column if not exists correct smallint not null default 0;
alter table public.exercise_sessions add column if not exists finished_at timestamptz;
-- The day in Rome the run was started: one daily practice a day, even with two tabs open.
alter table public.exercise_sessions add column if not exists day date not null default ((now() at time zone 'Europe/Rome')::date);
update public.exercise_sessions set day = (started_at at time zone 'Europe/Rome')::date where day <> (started_at at time zone 'Europe/Rome')::date;
create unique index if not exists exercise_sessions_one_practice_a_day on public.exercise_sessions (user_id, day) where kind = 'practice';
create index if not exists exercise_sessions_user_started on public.exercise_sessions (user_id, started_at desc);

-- Answers and right answers per student and Rome day: the free session, the streak, the beta metrics.
create table if not exists public.exercise_days (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  answered integer not null default 0 check (answered >= 0),
  correct integer not null default 0 check (correct >= 0),
  primary key (user_id, day)
);
alter table public.exercise_days enable row level security;
drop policy if exists "exercise_days: owner reads own" on public.exercise_days;
create policy "exercise_days: owner reads own"
  on public.exercise_days for select to authenticated
  using (user_id = auth.uid());

-- Answered attempts by date, for the mistakes still open and the review plan.
create index if not exists exercise_attempts_user_answered on public.exercise_attempts (user_id, answered_at desc) where answered_at is not null;

-- When an attempt gets its answer (once: the server writes it only while answered_at is null), its run and its
-- day are counted. The day is the Rome date of the answer, so the nights the clocks change count right.
create or replace function public.exercise_attempt_answered() returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  right_answer integer := case when new.correct then 1 else 0 end;
begin
  if new.session_id is not null then
    update public.exercise_sessions s
      set answered = s.answered + 1,
          correct = s.correct + right_answer,
          finished_at = case when s.finished_at is null and s.answered + 1 >= cardinality(s.plan) then new.answered_at else s.finished_at end
      where s.id = new.session_id;
  end if;
  insert into public.exercise_days as d (user_id, day, answered, correct)
    values (new.user_id, (new.answered_at at time zone 'Europe/Rome')::date, 1, right_answer)
    on conflict (user_id, day) do update set answered = d.answered + 1, correct = d.correct + excluded.correct;
  return new;
end;
$$;
revoke all on function public.exercise_attempt_answered() from public, anon, authenticated;

drop trigger if exists exercise_attempt_answered on public.exercise_attempts;
create trigger exercise_attempt_answered
  after update of answered_at on public.exercise_attempts
  for each row
  when (old.answered_at is null and new.answered_at is not null)
  execute function public.exercise_attempt_answered();

-- The counts for what was answered before the trigger existed.
update public.exercise_sessions s
  set answered = c.answered, correct = c.correct,
      finished_at = case when c.answered >= cardinality(s.plan) then c.last_at end
  from (
    select session_id, count(*)::smallint as answered, count(*) filter (where correct)::smallint as correct, max(answered_at) as last_at
    from public.exercise_attempts
    where session_id is not null and answered_at is not null
    group by session_id
  ) c
  where c.session_id = s.id;

insert into public.exercise_days (user_id, day, answered, correct)
  select user_id, (answered_at at time zone 'Europe/Rome')::date, count(*), count(*) filter (where correct)
  from public.exercise_attempts
  where answered_at is not null
  group by 1, 2
  on conflict (user_id, day) do update set answered = excluded.answered, correct = excluded.correct;
