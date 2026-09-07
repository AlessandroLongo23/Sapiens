-- Tutoring marketplace: tutor profiles and contact requests.
-- See MARKETPLACE.md for the model (introduction fee at the match, no lesson payments).

create extension if not exists pgcrypto;

-- One row per tutor. Surname and contact email never leave this table:
-- the public reads `tutors_public` below.
create table if not exists public.tutors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete set null,
  slug text not null unique,
  first_name text not null,
  last_name text not null,
  headline text not null default '',
  bio text not null default '',
  -- Ids from src/lib/tutoring/config.ts
  subjects text[] not null default '{}',
  -- middle_school | high_school | university
  levels text[] not null default '{}',
  -- online | in_person
  modes text[] not null default '{}',
  city text,
  -- Indicative price shown on the card; the platform never records what is paid.
  hourly_rate numeric(6,2) check (hourly_rate is null or hourly_rate >= 0),
  education text,
  years_experience smallint not null default 0 check (years_experience >= 0),
  avatar_url text,
  contact_email text,
  verified boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'pending', 'published', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tutors_status_idx on public.tutors (status);

alter table public.tutors enable row level security;

-- Tutors can read their own row; everything else goes through the service role
-- (admin) until the tutor editor exists.
drop policy if exists "tutors: owner reads own row" on public.tutors;
create policy "tutors: owner reads own row"
  on public.tutors for select to authenticated
  using (user_id = auth.uid());

-- Public projection of published tutors: first name and last initial only,
-- no contact data. Runs as the owner on purpose so anonymous visitors can
-- read it while the table itself stays closed.
create or replace view public.tutors_public as
  select
    id,
    slug,
    first_name,
    left(last_name, 1) as last_initial,
    headline,
    bio,
    subjects,
    levels,
    modes,
    city,
    hourly_rate,
    education,
    years_experience,
    avatar_url,
    verified,
    created_at,
    updated_at
  from public.tutors
  where status = 'published';

grant select on public.tutors_public to anon, authenticated;

-- A student's request to be put in touch with one tutor. The tutor sees the
-- request without contact details until they accept (tutor-side view to come).
create table if not exists public.tutor_requests (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.tutors (id) on delete cascade,
  student_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  level text not null check (level in ('middle_school', 'high_school', 'university')),
  mode text not null check (mode in ('online', 'in_person')),
  -- Who the contact details belong to: the parent for minors.
  requester text not null default 'student' check (requester in ('student', 'parent')),
  contact_name text not null,
  contact_phone text not null,
  contact_email text,
  message text not null check (char_length(message) between 20 and 1500),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired', 'cancelled')),
  created_at timestamptz not null default now(),
  responded_at timestamptz
);

create index if not exists tutor_requests_student_idx on public.tutor_requests (student_id, status);
create index if not exists tutor_requests_tutor_idx on public.tutor_requests (tutor_id, status);
-- One open request per student and tutor.
create unique index if not exists tutor_requests_one_pending_per_pair
  on public.tutor_requests (tutor_id, student_id) where status = 'pending';

alter table public.tutor_requests enable row level security;

drop policy if exists "requests: student creates own" on public.tutor_requests;
create policy "requests: student creates own"
  on public.tutor_requests for insert to authenticated
  with check (student_id = auth.uid() and status = 'pending');

drop policy if exists "requests: student reads own" on public.tutor_requests;
create policy "requests: student reads own"
  on public.tutor_requests for select to authenticated
  using (student_id = auth.uid());

drop policy if exists "requests: student cancels own pending" on public.tutor_requests;
create policy "requests: student cancels own pending"
  on public.tutor_requests for update to authenticated
  using (student_id = auth.uid() and status = 'pending')
  with check (student_id = auth.uid() and status in ('pending', 'cancelled'));
