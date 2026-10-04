-- The programs a student saves from the code editor (vault/Prodotti/Studenti/Editor di codice.md): "Salva",
-- "Salva con nome" and the list they are loaded from. Private to their owner, like the Zaino's rows and the plots.
--
-- `language` is a language of the editor or `web`, a page; `files` holds the text of each file by name: `main` for
-- a program, `html`, `css` and `js` for a page (src/lib/codice/salvati.ts). The server reads them back before it
-- stores them. The free-plan ceiling is not a constraint here, for the same reason as the Zaino's: see
-- src/lib/server/programmi.ts.

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  language text not null check (language in ('python', 'c', 'cpp', 'javascript', 'web')),
  files jsonb not null check (jsonb_typeof(files) = 'object' and char_length(files::text) <= 250000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The one list query: the owner's programs, the last saved first.
create index if not exists programs_user_updated_idx on public.programs (user_id, updated_at desc);
-- Two programs with one name cannot be told apart in the list: "Salva con nome" asks for another.
create unique index if not exists programs_user_title_key on public.programs (user_id, lower(title));

alter table public.programs enable row level security;

drop policy if exists "programs: owner reads own" on public.programs;
create policy "programs: owner reads own"
  on public.programs for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "programs: owner creates own" on public.programs;
create policy "programs: owner creates own"
  on public.programs for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "programs: owner updates own" on public.programs;
create policy "programs: owner updates own"
  on public.programs for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "programs: owner deletes own" on public.programs;
create policy "programs: owner deletes own"
  on public.programs for delete to authenticated
  using (user_id = auth.uid());
