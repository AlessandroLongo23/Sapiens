-- Repetitions of a level (vault/Decisioni/2026-09-30 Ogni livello è una tappa con più tipi di esercizio, e si
-- supera a risposta aperta.md). A run at a level is its n-th repetition: 8 questions, multiple choice first and
-- open answers after, more of them at each step; 7 right make it count, and the last one passes the level.
-- `step` says which repetition a run is, so the kind of each question can be worked out again from it. Null for
-- jump tests, daily practice, reviews, and the runs of 10 questions made before the repetitions.
-- Each attempt already records its kind in exercise_attempts.mode ('choice' or 'open').
alter table public.exercise_sessions add column if not exists step smallint check (step is null or step > 0);
