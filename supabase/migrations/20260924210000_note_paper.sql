-- The paper a note is written on (vault/Prodotti/Studenti/Zaino.md): ruling,
-- colour, line spacing and text size, as { kind, color, spacing, text }.
-- Validated by parsePaper in src/lib/zaino/paper.ts; the check only caps it.
-- A column of its own, written without touching `version`, so changing the
-- paper never collides with the text autosave of another tab. An empty object
-- is the default paper, which is what every note had before.
alter table public.notes
  add column if not exists paper jsonb not null default '{}'::jsonb
    check (jsonb_typeof(paper) = 'object' and length(paper::text) <= 400);
