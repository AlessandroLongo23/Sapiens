-- The onboarding asks which school a student goes to before anything else about it
-- (vault/Prodotti/Studenti/Onboarding.md): the slug of the level in `content_nodes`. The year, the subjects and
-- the lessons that follow are asked only of high school, the one level with exercises today.
alter table public.profiles
	add column if not exists school_level text check (school_level in ('middle_school', 'high_school', 'university'));
