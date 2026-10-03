-- The graphs a student saves from the plotter (vault/Prodotti/Studenti/Grafico di funzioni.md): "Salva",
-- "Salva con nome" and the list they are loaded from. Private to their owner, like the Zaino's rows.
--
-- `state` is the graph as the plotter writes it in a link (encodeState in src/lib/grafico/documento.ts): the rows,
-- what is built on them, the sliders, the settings and the window. The server reads it back before it stores it.
-- The free-plan ceiling is not a constraint here, for the same reason as the Zaino's: see src/lib/server/grafici.ts.

create table if not exists public.plots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  state text not null check (char_length(state) between 1 and 60000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The one list query: the owner's graphs, the last saved first.
create index if not exists plots_user_updated_idx on public.plots (user_id, updated_at desc);
-- Two graphs with one name cannot be told apart in the list: "Salva con nome" asks for another.
create unique index if not exists plots_user_title_key on public.plots (user_id, lower(title));

alter table public.plots enable row level security;

drop policy if exists "plots: owner reads own" on public.plots;
create policy "plots: owner reads own"
  on public.plots for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "plots: owner creates own" on public.plots;
create policy "plots: owner creates own"
  on public.plots for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "plots: owner updates own" on public.plots;
create policy "plots: owner updates own"
  on public.plots for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "plots: owner deletes own" on public.plots;
create policy "plots: owner deletes own"
  on public.plots for delete to authenticated
  using (user_id = auth.uid());
