-- A lesson has its own subject: one student can ask the same tutor for more than one, so the subject on the
-- link (tutor_students.subject) is only the one proposed for a new lesson. The level is copied from the link
-- when the lesson is created and never typed: a student who moves from school to university keeps the old
-- lessons at the level they had (vault/Prodotti/Tutor/Agenda tutor.md).
alter table public.tutor_lessons
  add column if not exists subject text check (subject is null or subject ~ '^[a-z0-9-]{2,40}$'),
  add column if not exists level text check (level is null or level in ('middle_school', 'high_school', 'university'));

-- The ledger: what is still to be paid, by tutor.
create index if not exists tutor_lessons_unpaid_idx on public.tutor_lessons (tutor_id, starts_at) where paid is not true and status = 'confirmed';
