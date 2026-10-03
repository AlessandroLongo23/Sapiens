-- The picture of a saved graph, shown when the pointer is on its name in "I miei grafici": the plane as it was when
-- the graph was saved, as the SVG the plotter also gives to download. Read only with the graph itself, never with
-- the list. Null for a drawing too heavy to keep.
alter table public.plots add column if not exists preview text check (preview is null or char_length(preview) <= 300000);
