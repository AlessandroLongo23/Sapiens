-- Zaino: the student's own quaderni (notebooks) and note (markdown documents).
-- Everything here is private to its owner: no public view, no slug column, and
-- the pages address rows by id (see src/app/(site)/zaino).
--
-- The free-plan ceiling (1 quaderno, 5 note) is deliberately not a constraint
-- here: it depends on the Stripe claim in app_metadata, which only the app can
-- read, and it must produce a paywall rather than an outage. It lives next to
-- hasFeature, in src/lib/server/zaino.ts.

create extension if not exists pgcrypto;

-- One folder of note. `position` orders the shelf: monotonic, not unique, so a
-- reorder can rewrite the whole column without shuffling through a free slot.
create table if not exists public.notebooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  -- Spine colour, from the semantic tokens in src/app/globals.css.
  color text not null default 'zinc' check (color in ('zinc', 'crimson', 'amber', 'teal', 'sky', 'indigo')),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The one list query: the owner's quaderni, in order.
create index if not exists notebooks_user_position_idx on public.notebooks (user_id, position);

-- Two quaderni with the same name make the shelf unreadable, and the shelf is
-- the navigation. `createNotebook` suffixes the default title until this passes.
-- Note titles get no such index: duplicates inside one quaderno are normal, and
-- every new note starts life called "Nuova nota".
create unique index if not exists notebooks_user_title_key on public.notebooks (user_id, lower(title));

-- Target of the composite foreign key on `notes`, which is what makes filing a
-- note into somebody else's quaderno impossible rather than merely unlikely.
create unique index if not exists notebooks_id_user_key on public.notebooks (id, user_id);

alter table public.notebooks enable row level security;

drop policy if exists "notebooks: owner reads own" on public.notebooks;
create policy "notebooks: owner reads own"
  on public.notebooks for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "notebooks: owner creates own" on public.notebooks;
create policy "notebooks: owner creates own"
  on public.notebooks for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "notebooks: owner updates own" on public.notebooks;
create policy "notebooks: owner updates own"
  on public.notebooks for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "notebooks: owner deletes own" on public.notebooks;
create policy "notebooks: owner deletes own"
  on public.notebooks for delete to authenticated
  using (user_id = auth.uid());

-- One markdown document. `user_id` is denormalised so the quota count and the
-- policies below stay single-table predicates; the composite foreign key keeps
-- it honest and takes the note with the quaderno when one is deleted.
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  notebook_id uuid not null,
  title text not null check (char_length(title) between 1 and 120),
  -- Markdown, not HTML: rendered on read, with html: false (see note-markdown.ts).
  -- The ceiling stops a runaway autosave growing one row without bound.
  content text not null default '' check (char_length(content) <= 200000),
  -- First plain line of `content`, rewritten on every save, so the list page
  -- shows a preview without pulling every document (see NOTE_LIST_COLUMNS).
  excerpt text not null default '' check (char_length(excerpt) <= 200),
  position integer not null default 0,
  -- Optimistic lock: a stale save from a second tab matches zero rows.
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (notebook_id, user_id) references public.notebooks (id, user_id) on delete cascade
);

-- The notes of one quaderno, in order.
create index if not exists notes_notebook_position_idx on public.notes (notebook_id, position);
-- The quota count.
create index if not exists notes_user_updated_idx on public.notes (user_id, updated_at desc);

alter table public.notes enable row level security;

-- The quaderno is not re-checked here: the composite foreign key above already
-- refuses a notebook_id belonging to another user.
drop policy if exists "notes: owner reads own" on public.notes;
create policy "notes: owner reads own"
  on public.notes for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "notes: owner creates own" on public.notes;
create policy "notes: owner creates own"
  on public.notes for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "notes: owner updates own" on public.notes;
create policy "notes: owner updates own"
  on public.notes for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "notes: owner deletes own" on public.notes;
create policy "notes: owner deletes own"
  on public.notes for delete to authenticated
  using (user_id = auth.uid());
