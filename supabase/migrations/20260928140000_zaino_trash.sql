-- The Zaino's trash (cestino). A note or a quaderno that is deleted is only marked, with the time, and stays
-- recoverable for 30 days; then a nightly job deletes it for good. A quaderno in the trash takes its notes with it:
-- they keep their own `deleted_at` (null unless they were deleted one by one), are hidden with the quaderno and come
-- back with it. Deleting an account still removes everything at once, through the cascades on auth.users.

alter table public.notebooks add column if not exists deleted_at timestamptz;
alter table public.notes add column if not exists deleted_at timestamptz;

-- The trash page lists what is in it, newest first.
create index if not exists notebooks_user_trash_idx on public.notebooks (user_id, deleted_at desc) where deleted_at is not null;
create index if not exists notes_user_trash_idx on public.notes (user_id, deleted_at desc) where deleted_at is not null;

-- Two quaderni on the shelf may not share a name; one in the trash no longer blocks it. Restoring a quaderno whose
-- name has been taken meanwhile renames it (`restoreNotebook`).
drop index if exists public.notebooks_user_title_key;
create unique index if not exists notebooks_user_title_key on public.notebooks (user_id, lower(title)) where deleted_at is null;

-- After 30 days in the trash, gone for good. A quaderno's delete cascades to its notes.
create extension if not exists pg_cron;

select cron.unschedule('zaino-trash-purge') where exists (select 1 from cron.job where jobname = 'zaino-trash-purge');
select cron.schedule(
	'zaino-trash-purge',
	'17 3 * * *',
	$$
		delete from public.notes where deleted_at < now() - interval '30 days';
		delete from public.notebooks where deleted_at < now() - interval '30 days';
	$$
);
