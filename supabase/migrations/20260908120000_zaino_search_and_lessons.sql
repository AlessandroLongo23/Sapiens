-- Zaino, second pass: find a note, and tie one to the lesson it was taken from.

-- The public path of the lesson a note belongs to (`/materiale/...`), and its
-- title at the time. The public path is stored rather than the database slug
-- path because a link is what this is for, and a renamed lesson already
-- redirects (see PATH_ALIASES and the proxy). The title is kept alongside so
-- the back-link can name the lesson without loading the content tree.
alter table public.notes add column if not exists lesson_path text;
alter table public.notes add column if not exists lesson_title text;

-- "The notes I took on this lesson", and the badge on the lesson page.
create index if not exists notes_user_lesson_idx on public.notes (user_id, lesson_path)
  where lesson_path is not null;

-- Search across a student's own notes, as a type-ahead. Generated rather than
-- maintained by the app so it can never drift from the row.
--
-- `simple`, not `italian`, on purpose. The Italian stemmer cuts "derivate" to
-- 'der' but "derivata" to 'deriv', so a prefix query built from what is being
-- typed can never match backwards into a shorter stem. Without stemming the
-- lexeme is the word itself and the prefix does the work instead: "deriv:*"
-- matches "derivate", "derivata" and "derivazione" alike.
alter table public.notes drop column if exists search;
alter table public.notes
  add column search tsvector
  generated always as (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(content, ''))
  ) stored;

create index if not exists notes_search_idx on public.notes using gin (search);
