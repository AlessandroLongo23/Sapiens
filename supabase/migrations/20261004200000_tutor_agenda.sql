-- The tutor's agenda (vault/Prodotti/Tutor/Agenda tutor.md): what happens after the contact. A tutor follows
-- students, plans lessons with them, assigns exercises from the library, reads their progress when they allow
-- it, and the two write to each other. Modelled on AleRipetizioni (students, lectures, reviews), with a tutor
-- owning every row and the student being a real account.
--
-- Every table is closed (row level security on, no policy): the server reads and writes with the service role
-- and checks who is asking (src/lib/server/tutor-agenda.ts). A row holds things only one side may see (the
-- tutor's notes), which a row policy cannot hide.

-- A tutor and one student. Born from an invite the tutor sends (student_id empty until it is accepted) or from
-- an accepted request of the marketplace. `progress_shared` is the student's consent to show their exercises.
create table if not exists public.tutor_students (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.tutors (id) on delete cascade,
  student_id uuid references auth.users (id) on delete set null,
  -- How the tutor calls the student.
  name text not null check (length(name) between 1 and 80),
  subject text check (subject ~ '^[a-z0-9-]{2,40}$'),
  level text check (level in ('middle_school', 'high_school', 'university')),
  -- The tutor's own notes: never sent to the student.
  notes text not null default '' check (length(notes) <= 4000),
  status text not null default 'invited' check (status in ('invited', 'active', 'ended')),
  origin text not null default 'invite' check (origin in ('invite', 'request')),
  request_id uuid references public.tutor_requests (id) on delete set null,
  invite_code text unique check (invite_code ~ '^[a-z0-9]{12,40}$'),
  progress_shared boolean not null default false,
  created_at timestamptz not null default now(),
  joined_at timestamptz,
  ended_at timestamptz
);
create index if not exists tutor_students_tutor_idx on public.tutor_students (tutor_id, status);
create index if not exists tutor_students_student_idx on public.tutor_students (student_id, status);
-- One open link per tutor and student.
create unique index if not exists tutor_students_one_open_per_pair
  on public.tutor_students (tutor_id, student_id) where student_id is not null and status <> 'ended';
alter table public.tutor_students enable row level security;

-- The hours of the week a tutor is free, shown on the public profile. Monday is 0.
create table if not exists public.tutor_availability (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.tutors (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  check (end_time > start_time)
);
create index if not exists tutor_availability_tutor_idx on public.tutor_availability (tutor_id, weekday, start_time);
alter table public.tutor_availability enable row level security;

-- A lesson. The tutor's are confirmed at once; a student's is a proposal the tutor accepts or declines.
-- `series_id` ties the lessons of one weekly repetition. `paid` and `hourly_rate` are kept for the ledger the
-- old tool had and no page reads or writes them: recording prices is the open DAC7 question in
-- vault/Prodotti/Tutor/Pay-per-lead.md.
create table if not exists public.tutor_lessons (
  id uuid primary key default gen_random_uuid(),
  tutor_student_id uuid not null references public.tutor_students (id) on delete cascade,
  tutor_id uuid not null references public.tutors (id) on delete cascade,
  starts_at timestamptz not null,
  duration_min smallint not null default 60 check (duration_min between 15 and 480),
  mode text not null default 'online' check (mode in ('online', 'in_person')),
  -- A link for an online lesson, an address otherwise.
  place text not null default '' check (length(place) <= 300),
  -- What the lesson is about: both sides read it.
  note text not null default '' check (length(note) <= 500),
  status text not null default 'confirmed' check (status in ('proposed', 'confirmed', 'declined', 'cancelled')),
  proposed_by text not null default 'tutor' check (proposed_by in ('tutor', 'student')),
  series_id uuid,
  diary_entry_id uuid references public.diary_entries (id) on delete set null,
  paid boolean,
  hourly_rate numeric(6,2) check (hourly_rate is null or hourly_rate >= 0),
  created_at timestamptz not null default now()
);
create index if not exists tutor_lessons_tutor_idx on public.tutor_lessons (tutor_id, starts_at);
create index if not exists tutor_lessons_link_idx on public.tutor_lessons (tutor_student_id, starts_at);
alter table public.tutor_lessons enable row level security;

-- Exercises to do by a day: a lesson of the library, at one level or the whole path. Whether it is done is read
-- from the student's runs, never stored here. `assigned_by` is the account that gave it, so a teacher's
-- assignments can use the same table.
create table if not exists public.tutor_assignments (
  id uuid primary key default gen_random_uuid(),
  tutor_student_id uuid not null references public.tutor_students (id) on delete cascade,
  tutor_id uuid not null references public.tutors (id) on delete cascade,
  student_id uuid not null references auth.users (id) on delete cascade,
  assigned_by uuid references auth.users (id) on delete set null,
  lesson_path text not null check (lesson_path ~ '^[a-z0-9_-]+(/[a-z0-9_-]+){0,5}$' and length(lesson_path) <= 200),
  level smallint check (level is null or level > 0),
  due date not null,
  note text not null default '' check (length(note) <= 300),
  status text not null default 'open' check (status in ('open', 'cancelled')),
  diary_entry_id uuid references public.diary_entries (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists tutor_assignments_link_idx on public.tutor_assignments (tutor_student_id, due);
create index if not exists tutor_assignments_student_idx on public.tutor_assignments (student_id, status);
alter table public.tutor_assignments enable row level security;

create table if not exists public.tutor_messages (
  id uuid primary key default gen_random_uuid(),
  tutor_student_id uuid not null references public.tutor_students (id) on delete cascade,
  sender text not null check (sender in ('tutor', 'student')),
  body text not null check (length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists tutor_messages_link_idx on public.tutor_messages (tutor_student_id, created_at);
alter table public.tutor_messages enable row level security;

-- One review per link, by the student. `hidden` is for staff.
create table if not exists public.tutor_reviews (
  id uuid primary key default gen_random_uuid(),
  tutor_student_id uuid not null unique references public.tutor_students (id) on delete cascade,
  tutor_id uuid not null references public.tutors (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text not null default '' check (length(body) <= 1000),
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tutor_reviews_tutor_idx on public.tutor_reviews (tutor_id, created_at desc);
alter table public.tutor_reviews enable row level security;

-- The diary takes entries from a tutor too: an assignment, a lesson. Like a teacher's, the student can tick or
-- hide them and nothing else. The server replaces them (delete and insert) when the tutor changes something.
alter table public.diary_entries drop constraint if exists diary_entries_source_check;
alter table public.diary_entries add constraint diary_entries_source_check check (source in ('studente', 'docente', 'tutor'));

create or replace function public.diary_entry_guard() returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.source in ('docente', 'tutor') and (new.day, new.kind, new.subject, new.text, new.topic, new.source)
      is distinct from (old.day, old.kind, old.subject, old.text, old.topic, old.source) then
    raise exception 'teacher and tutor entries can only be ticked or hidden' using errcode = '42501';
  end if;
  if new.source <> old.source then
    raise exception 'the source of an entry does not change' using errcode = '42501';
  end if;
  return new;
end;
$$;
