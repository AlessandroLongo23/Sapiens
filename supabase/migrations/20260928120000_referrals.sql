-- Invites and creator codes (vault/Prodotti/Studenti/Inviti e codici.md):
--   vault/Decisioni/2026-09-28 Porta un amico premia l'attivazione con 30 giorni di Studio.md
--   vault/Decisioni/2026-09-28 Porta un amico solo per i maggiorenni.md
--   vault/Decisioni/2026-09-28 I creator si pagano a contenuto, non a provvigione.md
-- A code comes in with the sign-up link (`?invito=CODE`, kept for a few hours once the visitor chooses to use it)
-- and is stored with the account. A friend's code, once the friend finishes a first run, gives the person who
-- shared it 30 days of Studio (or a month's credit on a subscription), at most 3 a school year; only an adult can
-- have one. A creator's code gives the same longer trial and counts what the creator brought: creators are paid
-- per content, by hand, never per sign-up or payment. The numbers are repeated in src/lib/referrals/config.ts.
-- Every table is for the server only: row level security on, no policies.

-- A person's own code (`amico`, one each, made when they declare they are at least 18 on the invite page) or a
-- creator's (`creator`, made by an admin, with the creator's name as the label).
create table if not exists public.referral_codes (
  code text primary key check (code ~ '^[A-Z0-9]{4,20}$'),
  kind text not null check (kind in ('amico', 'creator')),
  owner_id uuid references auth.users (id) on delete cascade,
  label text check (length(label) <= 100),
  active boolean not null default true,
  declared_adult_at timestamptz,
  created_at timestamptz not null default now(),
  check ((kind = 'amico') = (owner_id is not null)),
  constraint referral_codes_adult check (kind <> 'amico' or declared_adult_at is not null)
);
create unique index if not exists referral_codes_one_per_student on public.referral_codes (owner_id) where kind = 'amico';
alter table public.referral_codes enable row level security;

-- The code an account came with: one per account, the first. `activated_at` is when it finished its first run.
create table if not exists public.referrals (
  user_id uuid primary key references auth.users (id) on delete cascade,
  code text references public.referral_codes (code) on delete set null,
  created_at timestamptz not null default now(),
  activated_at timestamptz
);
create index if not exists referrals_code on public.referrals (code);
alter table public.referrals enable row level security;

-- What a student got for a friend: days of Studio (applied at once, `until` is the new last day) or a credit on
-- the subscription (applied by the Stripe webhook when the next invoice is drafted: `applied_at`, `stripe_ref`).
-- One reward per friend.
create table if not exists public.referral_rewards (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users (id) on delete cascade,
  referred_id uuid unique references auth.users (id) on delete set null,
  kind text not null check (kind in ('giorni', 'credito')),
  until date,
  credit_cents integer check (credit_cents > 0),
  applied_at timestamptz,
  stripe_ref text,
  created_at timestamptz not null default now(),
  check ((kind = 'giorni') = (until is not null)),
  check ((kind = 'credito') = (credit_cents is not null))
);
create index if not exists referral_rewards_referrer on public.referral_rewards (referrer_id, created_at);
create index if not exists referral_rewards_pending on public.referral_rewards (referrer_id) where kind = 'credito' and applied_at is null;
alter table public.referral_rewards enable row level security;

-- A new account with a code in its sign-up data (`invito`, sent by the sign-up form): a longer trial, in
-- app_metadata where only the service role can write, before the row is stored. A code that does not exist or
-- is switched off is ignored. Nothing here may stop a sign-up: any error leaves the account as it would be.
create or replace function public.referral_signup_trial() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.referral_codes c
    where c.code = upper(btrim(coalesce(new.raw_user_meta_data ->> 'invito', ''))) and c.active
  ) then
    new.raw_app_meta_data := coalesce(new.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('trialDays', 14);
  end if;
  return new;
exception when others then
  return new;
end;
$$;
revoke all on function public.referral_signup_trial() from public, anon, authenticated;

create or replace function public.referral_signup() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.referrals (user_id, code)
    select new.id, c.code from public.referral_codes c
    where c.code = upper(btrim(coalesce(new.raw_user_meta_data ->> 'invito', ''))) and c.active
    on conflict (user_id) do nothing;
  return new;
exception when others then
  return new;
end;
$$;
revoke all on function public.referral_signup() from public, anon, authenticated;

drop trigger if exists referral_signup_trial on auth.users;
create trigger referral_signup_trial
  before insert on auth.users
  for each row
  when (new.raw_user_meta_data ? 'invito')
  execute function public.referral_signup_trial();

drop trigger if exists referral_signup on auth.users;
create trigger referral_signup
  after insert on auth.users
  for each row
  when (new.raw_user_meta_data ? 'invito')
  execute function public.referral_signup();

-- Auth rewrites the whole app_metadata from its own copy of the account: right after creating it (when the account
-- is made with app_metadata of its own) and on admin updates. A copy read before the database added the longer trial
-- or the days earned with invites would drop them, so an update that leaves them out keeps them. To take one away,
-- set it to a JSON null in SQL (`jsonb_set(raw_app_meta_data, '{bonus}', 'null')`): Auth drops keys set to null
-- through its API, and a dropped key comes back.
create or replace function public.referral_keep_meta() returns trigger
language plpgsql
set search_path = public
as $$
declare
  k text;
begin
  foreach k in array array['trialDays', 'bonus'] loop
    if old.raw_app_meta_data ? k and not coalesce(new.raw_app_meta_data ? k, false) then
      new.raw_app_meta_data := coalesce(new.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object(k, old.raw_app_meta_data -> k);
    end if;
  end loop;
  return new;
exception when others then
  return new;
end;
$$;
revoke all on function public.referral_keep_meta() from public, anon, authenticated;

drop trigger if exists referral_keep_meta on auth.users;
create trigger referral_keep_meta
  before update of raw_app_meta_data on auth.users
  for each row
  when (old.raw_app_meta_data is distinct from new.raw_app_meta_data)
  execute function public.referral_keep_meta();

-- An account finished a run: if it came with a friend's code and is not yet activated, it is now, and the friend
-- who shared the code gets the reward. Days of Studio start after whatever Studio they already have (the trial,
-- the pass, earlier rewards); on an active subscription the reward is a credit instead. Called by the trigger
-- below and by the server when a code is entered by hand after the first run.
create or replace function public.referral_activate(p_user uuid) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  used_code text;
  referrer uuid;
  meta jsonb;
  signed_up timestamptz;
  today date := (now() at time zone 'Europe/Rome')::date;
  year_start date;
  given integer;
  new_until date;
begin
  update public.referrals set activated_at = now()
    where user_id = p_user and activated_at is null
    returning code into used_code;
  if used_code is null then return; end if;

  select owner_id into referrer from public.referral_codes where code = used_code and kind = 'amico';
  if referrer is null or referrer = p_user then return; end if;

  -- One reward at a time per student: the lock keeps the yearly cap when two friends finish together.
  select raw_app_meta_data, created_at into meta, signed_up from auth.users where id = referrer for update;
  if not found then return; end if;
  meta := coalesce(meta, '{}'::jsonb);

  -- The school year starts on 1 September.
  year_start := make_date(extract(year from today)::int - case when extract(month from today) < 9 then 1 else 0 end, 9, 1);
  select count(*) into given from public.referral_rewards
    where referrer_id = referrer and created_at >= (year_start::timestamp at time zone 'Europe/Rome');
  if given >= 3 then return; end if;

  if coalesce(meta #>> '{subscription,plan}', 'free') <> 'free' and meta #>> '{subscription,status}' in ('active', 'trialing') then
    insert into public.referral_rewards (referrer_id, referred_id, kind, credit_cents) values (referrer, p_user, 'credito', 999);
    return;
  end if;

  new_until := greatest(
    today - 1,
    coalesce((meta #>> '{bonus,until}')::date, today - 1),
    coalesce((meta #>> '{pass,until}')::date, today - 1),
    ((signed_up + make_interval(days => coalesce((meta ->> 'trialDays')::int, 7))) at time zone 'Europe/Rome')::date
  ) + 30;
  update auth.users
    set raw_app_meta_data = meta || jsonb_build_object('bonus', jsonb_build_object('plan', 'studio', 'until', new_until))
    where id = referrer;
  insert into public.referral_rewards (referrer_id, referred_id, kind, until, applied_at) values (referrer, p_user, 'giorni', new_until, now());
end;
$$;
revoke all on function public.referral_activate(uuid) from public, anon, authenticated;
grant execute on function public.referral_activate(uuid) to service_role;

create or replace function public.referral_run_finished() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.referral_activate(new.user_id);
  return new;
-- The answer that finished the run is saved whatever happens to the reward.
exception when others then
  raise warning 'referral_activate(%): %', new.user_id, sqlerrm;
  return new;
end;
$$;
revoke all on function public.referral_run_finished() from public, anon, authenticated;

drop trigger if exists referral_run_finished on public.exercise_sessions;
create trigger referral_run_finished
  after update of finished_at on public.exercise_sessions
  for each row
  when (old.finished_at is null and new.finished_at is not null)
  execute function public.referral_run_finished();

-- What each creator's code brought, in counts: sign-ups, those who finished a first run, those who ever paid
-- (app_metadata.firstPaidAt, written by the Stripe webhook). Only the server may call it: it reads auth.users.
create or replace function public.creator_code_stats()
returns table (code text, signups integer, activated integer, paying integer)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    c.code,
    count(r.user_id)::integer,
    count(r.activated_at)::integer,
    count(*) filter (where u.raw_app_meta_data ? 'firstPaidAt')::integer
  from public.referral_codes c
  left join public.referrals r on r.code = c.code
  left join auth.users u on u.id = r.user_id
  where c.kind = 'creator'
  group by c.code;
$$;
revoke all on function public.creator_code_stats() from public, anon, authenticated;
grant execute on function public.creator_code_stats() to service_role;

-- The beta's metrics count the end of the trial per account: 14 days for those who came with a code.
create or replace function public.beta_metrics()
returns table (
  week date,
  signups integer,
  activated integer,
  trial_ended integer,
  paid integer,
  w4_eligible integer,
  w4_returned integer
)
language sql
stable
security definer
set search_path = public, auth
as $$
  with students as (
    select
      u.id,
      u.created_at,
      (u.created_at at time zone 'Europe/Rome')::date as signed_up,
      u.raw_app_meta_data ? 'firstPaidAt' as has_paid,
      u.created_at + make_interval(days => coalesce((u.raw_app_meta_data ->> 'trialDays')::int, 7)) as trial_end
    from auth.users u
    where coalesce(u.raw_app_meta_data ->> 'role', '') <> 'admin'
      and coalesce(u.email, '') not ilike '%@example.com'
  )
  select
    date_trunc('week', s.signed_up)::date as week,
    count(*)::integer as signups,
    count(*) filter (where exists (
      select 1 from public.exercise_sessions r
      where r.user_id = s.id and r.finished_at is not null and r.finished_at < s.created_at + interval '7 days'
    ))::integer as activated,
    count(*) filter (where s.trial_end <= now())::integer as trial_ended,
    count(*) filter (where s.trial_end <= now() and s.has_paid)::integer as paid,
    count(*) filter (where s.created_at <= now() - interval '28 days')::integer as w4_eligible,
    count(*) filter (where s.created_at <= now() - interval '28 days' and exists (
      select 1 from public.exercise_days d
      where d.user_id = s.id and d.answered > 0 and d.day between s.signed_up + 21 and s.signed_up + 27
    ))::integer as w4_returned
  from students s
  group by 1
  order by 1 desc;
$$;

revoke all on function public.beta_metrics() from public, anon, authenticated;
grant execute on function public.beta_metrics() to service_role;
