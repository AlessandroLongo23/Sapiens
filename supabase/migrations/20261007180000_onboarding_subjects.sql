-- The onboarding asks which subjects a student studies with Sapiens and, for each, what the class is doing
-- (vault/Decisioni/2026-10-07 L'onboarding chiede le materie e un argomento per materia.md). `subjects` are the
-- database slugs of the subjects chosen (`math`, `physics`, `chemistry`, `computer-science`), also those that
-- have no lessons yet for the student's year; `topics` maps a subject to the database path of its lesson.
-- `topic`, already there, stays the lesson the student chose to start from.
alter table public.profiles
	add column if not exists subjects text[] not null default '{}',
	add column if not exists topics jsonb not null default '{}'::jsonb;
