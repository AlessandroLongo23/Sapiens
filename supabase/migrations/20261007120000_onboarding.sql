-- Onboarding (vault/Prodotti/Studenti/Onboarding.md).
--
-- `profiles` holds what the account is to Sapiens and cannot live in user_metadata, which the browser can rewrite:
-- the roles (one account can have several), the school year and the topic the student named when they came in,
-- whether the email is confirmed, and the parent's consent for a student under 14. Only the server writes it.
--
-- An account made before this table has no row: it counts as confirmed when Supabase Auth says so
-- (src/lib/server/profile.ts). The rows below give every existing account its row with that rule.

create table if not exists public.profiles (
	user_id uuid primary key references auth.users (id) on delete cascade,
	roles text[] not null default '{student}' check (roles <@ array['student', 'parent', 'tutor', 'teacher']),
	-- Asked once at signup with two options; null on accounts made before the question existed.
	age_band text check (age_band in ('under14', '14plus', 'adult')),
	-- Year of high school, 1 to 5; null for whoever is not at high school or has not answered.
	school_year smallint check (school_year between 1 and 5),
	-- Database path of the lesson the class is on (the same key the exercise runs store).
	topic text,
	-- When the two questions were answered or skipped: the welcome page is not offered again after this.
	onboarded_at timestamptz,
	-- "Come ci hai conosciuto?", asked after the first finished run.
	heard_from text,
	heard_at timestamptz,
	email_verified_at timestamptz,
	parent_email text,
	parent_consent_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists profiles_read_own on public.profiles;
create policy profiles_read_own on public.profiles for select to authenticated using (user_id = (select auth.uid()));

insert into public.profiles (user_id, roles, email_verified_at, created_at)
select u.id,
	case when exists (select 1 from public.tutors t where t.user_id = u.id) then array['student', 'tutor'] else array['student'] end,
	u.email_confirmed_at,
	u.created_at
from auth.users u
on conflict (user_id) do nothing;

-- The six-digit code that confirms an email: one per account, stored hashed, replaced when a new one is sent.
create table if not exists public.email_codes (
	user_id uuid primary key references auth.users (id) on delete cascade,
	code_hash text not null,
	attempts smallint not null default 0,
	sent_at timestamptz not null default now(),
	expires_at timestamptz not null
);
alter table public.email_codes enable row level security;

-- The link sent to the parent of a student under 14. The token travels only in the email; here is its hash.
create table if not exists public.parent_consents (
	token_hash text primary key,
	user_id uuid not null references auth.users (id) on delete cascade,
	parent_email text not null,
	created_at timestamptz not null default now(),
	expires_at timestamptz not null,
	confirmed_at timestamptz
);
create index if not exists parent_consents_user on public.parent_consents (user_id);
alter table public.parent_consents enable row level security;

-- An invite counts for whoever shared it only once the friend's email is confirmed
-- (vault/Decisioni/2026-10-07 La conferma dell'email non blocca l'ingresso.md). The run that finishes first is
-- skipped while the email is not; confirming it calls referral_activate_if_ready.
create or replace function public.referral_run_finished() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.profiles where user_id = new.user_id and email_verified_at is null) then
    return new;
  end if;
  perform public.referral_activate(new.user_id);
  return new;
-- The answer that finished the run is saved whatever happens to the reward.
exception when others then
  raise warning 'referral_activate(%): %', new.user_id, sqlerrm;
  return new;
end;
$$;
revoke all on function public.referral_run_finished() from public, anon, authenticated;

create or replace function public.referral_activate_if_ready(p_user uuid) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.profiles where user_id = p_user and email_verified_at is null) then return; end if;
  if not exists (select 1 from public.exercise_sessions where user_id = p_user and finished_at is not null) then return; end if;
  perform public.referral_activate(p_user);
end;
$$;
revoke all on function public.referral_activate_if_ready(uuid) from public, anon, authenticated;
grant execute on function public.referral_activate_if_ready(uuid) to service_role;
