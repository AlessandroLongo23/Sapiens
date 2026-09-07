-- Tutor side of the marketplace: contact phone and terms acceptance on the
-- profile, and an explicit expiry on requests (48 hours to answer).

alter table public.tutors add column if not exists contact_phone text;
alter table public.tutors add column if not exists terms_accepted_at timestamptz;

alter table public.tutor_requests
  add column if not exists expires_at timestamptz not null default (now() + interval '48 hours');

create index if not exists tutor_requests_expires_idx
  on public.tutor_requests (expires_at) where status = 'pending';
