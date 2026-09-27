-- The diary (vault/Decisioni/2026-09-26 Il diario prende il posto di Oggi.md): what the student writes down for
-- school, one row per entry, and a page of their own for each day, with its text and stickers.

-- An entry: homework, a test, an oral test or a reminder, for a day. `source` says who wrote it: today only the
-- student; from the schools' release (v4) also the teacher, whose entries the student can tick or hide but not
-- change or delete. `topic` is the database path of the chapter or lesson it is about, when the entry is about
-- the material (a maths test on a chapter): the diary suggests the review from it.
create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  kind text not null check (kind in ('compito', 'verifica', 'interrogazione', 'promemoria')),
  subject text check (subject ~ '^[a-z-]{2,20}$'),
  text text not null check (length(text) between 1 and 300),
  topic text check (topic ~ '^[a-z0-9_-]+(/[a-z0-9_-]+){0,5}$' and length(topic) <= 200),
  done boolean not null default false,
  hidden boolean not null default false,
  source text not null default 'studente' check (source in ('studente', 'docente')),
  created_at timestamptz not null default now()
);
create index if not exists diary_entries_user_day on public.diary_entries (user_id, day);

alter table public.diary_entries enable row level security;

drop policy if exists "diary_entries: owner reads own" on public.diary_entries;
create policy "diary_entries: owner reads own"
  on public.diary_entries for select to authenticated
  using (user_id = auth.uid());

-- A student writes only their own entries; the teacher's arrive from the server.
drop policy if exists "diary_entries: owner creates own" on public.diary_entries;
create policy "diary_entries: owner creates own"
  on public.diary_entries for insert to authenticated
  with check (user_id = auth.uid() and source = 'studente');

drop policy if exists "diary_entries: owner updates own" on public.diary_entries;
create policy "diary_entries: owner updates own"
  on public.diary_entries for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "diary_entries: owner deletes own" on public.diary_entries;
create policy "diary_entries: owner deletes own"
  on public.diary_entries for delete to authenticated
  using (user_id = auth.uid() and source = 'studente');

-- On a teacher's entry the student may only tick it or hide it.
create or replace function public.diary_entry_guard() returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.source = 'docente' and (new.day, new.kind, new.subject, new.text, new.topic, new.source)
      is distinct from (old.day, old.kind, old.subject, old.text, old.topic, old.source) then
    raise exception 'teacher entries can only be ticked or hidden' using errcode = '42501';
  end if;
  if new.source <> old.source then
    raise exception 'the source of an entry does not change' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists diary_entry_guard on public.diary_entries;
create trigger diary_entry_guard
  before update on public.diary_entries
  for each row execute function public.diary_entry_guard();

-- The student's own page of a day: free text and stickers. Private: no teacher or parent ever reads it.
create table if not exists public.diary_pages (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  text text not null default '' check (length(text) <= 4000),
  -- [{ id, sticker, x, y, r, s }], x on a page 480 px wide. Validated by parseStickers with DIARY_BOUNDS in
  -- src/lib/diary/page.ts; the check only caps it.
  stickers jsonb not null default '[]'::jsonb
    check (jsonb_typeof(stickers) = 'array' and jsonb_array_length(stickers) <= 60),
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

alter table public.diary_pages enable row level security;

drop policy if exists "diary_pages: owner reads own" on public.diary_pages;
create policy "diary_pages: owner reads own"
  on public.diary_pages for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "diary_pages: owner creates own" on public.diary_pages;
create policy "diary_pages: owner creates own"
  on public.diary_pages for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "diary_pages: owner updates own" on public.diary_pages;
create policy "diary_pages: owner updates own"
  on public.diary_pages for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "diary_pages: owner deletes own" on public.diary_pages;
create policy "diary_pages: owner deletes own"
  on public.diary_pages for delete to authenticated
  using (user_id = auth.uid());
