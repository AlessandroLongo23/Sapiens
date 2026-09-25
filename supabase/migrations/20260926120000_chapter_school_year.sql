-- The school year a chapter is usually taught in, 1 to 5. Subject pages group
-- their chapters by it. The Indicazioni nazionali split only into first two
-- years, second two years and fifth year, so the year follows the common
-- textbooks (docs/lezioni/albero.md). Null where no year applies (university,
-- or subjects not yet placed): the page then shows one flat list.
alter table public.content_nodes
	add column if not exists school_year smallint check (school_year between 1 and 5);

update public.content_nodes c
set school_year = v.year
from (values
	('insiemi-e-logica', 1), ('numeri-naturali', 1), ('numeri-interi', 1), ('numeri-razionali', 1),
	('funzioni', 1), ('monomi-polinomi', 1), ('scomposizione', 1), ('frazioni-algebriche', 1),
	('equazioni-sistemi', 1), ('disequazioni-lineari', 1), ('statistica', 1), ('geometria-piano-triangoli', 1),
	('sistemi-lineari', 2), ('numeri-reali', 2), ('geometria-analitica', 2), ('equazioni-di-secondo-grado', 2),
	('parabola-disequazioni', 2), ('grado-superiore', 2), ('probabilita', 2), ('geometria-piano-circonferenza', 2),
	('funzioni-proprieta', 3), ('successioni', 3), ('coniche', 3), ('esponenziali-logaritmi', 3), ('statistica-bivariata', 3),
	('goniometria', 4), ('trigonometria', 4), ('numeri-complessi', 4), ('calcolo-combinatorio', 4),
	('probabilita-avanzata', 4), ('geometria-solida', 4),
	('limiti', 5), ('continuita', 5), ('derivate', 5), ('studio-funzione', 5), ('integrali', 5),
	('equazioni-differenziali-superiori', 5), ('distribuzioni-probabilita', 5), ('geometria-analitica-spazio', 5)
) as v(slug, year),
	public.content_nodes s,
	public.content_nodes l
where c.slug = v.slug
	and c.type = 'chapter'
	and c.parent_id = s.id and s.slug = 'math'
	and s.parent_id = l.id and l.slug = 'high_school';
