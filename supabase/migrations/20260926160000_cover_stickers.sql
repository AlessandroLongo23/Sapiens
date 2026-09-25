-- Stickers on the cover of a subject's page: the band of squared paper at the
-- top of /materiale/<level>/<subject> (vault/Prodotti/Studenti/Adesivi.md).
-- Like note_stickers, one row per student and page with the whole set as
-- JSON, rewritten in one write. `page` is the subject's content path
-- (e.g. 'high_school/math/math'): content lives in the tree, not in a
-- table, so there is nothing to reference.
create table if not exists public.cover_stickers (
  user_id uuid not null references auth.users (id) on delete cascade,
  page text not null check (page ~ '^[a-z0-9_-]+(/[a-z0-9_-]+){0,4}$' and length(page) <= 200),
  -- [{ id, sticker, x, y, r }]: x from the middle of the page, y from the top
  -- of the band, rotation in degrees. Validated by parseStickers with
  -- COVER_BOUNDS in src/lib/zaino/stickers.ts; the check only caps it.
  stickers jsonb not null default '[]'::jsonb
    check (jsonb_typeof(stickers) = 'array' and jsonb_array_length(stickers) <= 60),
  updated_at timestamptz not null default now(),
  primary key (user_id, page)
);

alter table public.cover_stickers enable row level security;

drop policy if exists "cover_stickers: owner reads own" on public.cover_stickers;
create policy "cover_stickers: owner reads own"
  on public.cover_stickers for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "cover_stickers: owner creates own" on public.cover_stickers;
create policy "cover_stickers: owner creates own"
  on public.cover_stickers for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "cover_stickers: owner updates own" on public.cover_stickers;
create policy "cover_stickers: owner updates own"
  on public.cover_stickers for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "cover_stickers: owner deletes own" on public.cover_stickers;
create policy "cover_stickers: owner deletes own"
  on public.cover_stickers for delete to authenticated
  using (user_id = auth.uid());
