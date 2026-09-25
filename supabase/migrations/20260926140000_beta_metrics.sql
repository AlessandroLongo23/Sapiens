-- The beta's metrics (vault/Piano/Metriche.md, vault/Piano/Progressi dello studente.md), by weekly cohort of
-- sign-ups: counts only, never a student. Staff accounts and test accounts (@example.com) are left out.
--   activated     finished a run within 7 days of signing up
--   trial_ended   signed up at least 7 days ago: the free week of Studio is over
--   paid          paid at least once (app_metadata.firstPaidAt, written by the Stripe webhook)
--   w4_eligible   signed up at least 28 days ago: the fourth week is over
--   w4_returned   of those, answered at least one question on days 21-27 after signing up
-- Days and weeks are Rome's. Only the server may call it: it reads auth.users.
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
      u.raw_app_meta_data ? 'firstPaidAt' as has_paid
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
    count(*) filter (where s.created_at <= now() - interval '7 days')::integer as trial_ended,
    count(*) filter (where s.created_at <= now() - interval '7 days' and s.has_paid)::integer as paid,
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
