-- Flashcards of a lesson, next to its theory and formulary: a JSON list of
-- {id, front, back}, fronts and backs in markdown with LaTeX. Written by
-- scripts/lezioni/publish.mts from docs/lezioni/flashcard/ (format in
-- src/lib/content/flashcards.ts). The card id is stable, so saved review
-- progress can attach to it later.
alter table public.content_nodes add column if not exists flashcards jsonb;
