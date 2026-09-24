-- Stickers on a note (vault/Prodotti/Studenti/Adesivi.md). One row per note with
-- the whole sheet as JSON: the editor rewrites the set in one write, so there is
-- no half-saved state and no ordering to keep. A separate table, not a column on
-- `notes`, so moving a sticker never bumps the note's version and never collides
-- with the text autosave of another tab.
create table if not exists public.note_stickers (
  note_id uuid primary key references public.notes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  -- [{ id, sticker, x, y, r }]: centre on the 792px sheet and rotation in degrees.
  -- Validated by parseStickers in src/lib/zaino/stickers.ts; the check only caps it.
  stickers jsonb not null default '[]'::jsonb
    check (jsonb_typeof(stickers) = 'array' and jsonb_array_length(stickers) <= 60),
  updated_at timestamptz not null default now()
);

alter table public.note_stickers enable row level security;

drop policy if exists "note_stickers: owner reads own" on public.note_stickers;
create policy "note_stickers: owner reads own"
  on public.note_stickers for select to authenticated
  using (user_id = auth.uid());

-- The note must be the writer's too: user_id alone would let a row point at somebody else's note.
drop policy if exists "note_stickers: owner creates own" on public.note_stickers;
create policy "note_stickers: owner creates own"
  on public.note_stickers for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.notes n where n.id = note_id and n.user_id = auth.uid()));

drop policy if exists "note_stickers: owner updates own" on public.note_stickers;
create policy "note_stickers: owner updates own"
  on public.note_stickers for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and exists (select 1 from public.notes n where n.id = note_id and n.user_id = auth.uid()));

drop policy if exists "note_stickers: owner deletes own" on public.note_stickers;
create policy "note_stickers: owner deletes own"
  on public.note_stickers for delete to authenticated
  using (user_id = auth.uid());
