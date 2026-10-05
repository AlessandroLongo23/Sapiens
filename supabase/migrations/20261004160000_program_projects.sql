-- A saved program can be a project of more files (src/lib/codice/progetto.ts): `language` is then `project` and
-- `files` holds each file under its path, a picture as the data URL of its bytes. Pictures weigh, so the ceiling of
-- the column goes up; the server still holds a program of one file to the old one (src/lib/codice/salvati.ts).

alter table public.programs drop constraint if exists programs_language_check;
alter table public.programs add constraint programs_language_check check (language in ('python', 'c', 'cpp', 'javascript', 'web', 'project'));

alter table public.programs drop constraint if exists programs_files_check;
alter table public.programs add constraint programs_files_check check (jsonb_typeof(files) = 'object' and char_length(files::text) <= 2000000);
