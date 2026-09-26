-- The sections of the written lessons with their embedding, for the site
-- search to find the paragraph that answers a question even when it uses none
-- of the lesson's words (vault/Prodotti/Studenti/Ricerca.md). One row per `##`
-- or `###` heading; `section_id` is the heading's anchor on the lesson page.
-- Written by scripts/search/embed.mts with the service role, only for the
-- sections whose text changed (`content_hash`). The lesson text is public, so
-- anyone may read the rows.
create table if not exists public.search_sections (
  topic_id uuid not null references public.content_nodes (id) on delete cascade,
  section_id text not null check (length(section_id) <= 200),
  -- What was embedded: lesson, chapter and heading, then the section text.
  content_hash text not null,
  -- OpenAI text-embedding-3-small.
  embedding vector(1536) not null,
  updated_at timestamptz not null default now(),
  primary key (topic_id, section_id)
);

create index if not exists search_sections_embedding_idx
  on public.search_sections using hnsw (embedding vector_cosine_ops);

alter table public.search_sections enable row level security;

drop policy if exists "search_sections: anyone reads" on public.search_sections;
create policy "search_sections: anyone reads"
  on public.search_sections for select to anon, authenticated
  using (true);

-- The sections nearest to a question, most similar first (cosine similarity, 1 = same meaning).
create or replace function public.match_search_sections(query_embedding vector(1536), match_count int default 8)
returns table (topic_id uuid, section_id text, similarity float)
language sql stable security invoker
set search_path = public
as $$
  select s.topic_id, s.section_id, 1 - (s.embedding <=> query_embedding) as similarity
  from public.search_sections s
  order by s.embedding <=> query_embedding
  limit least(greatest(match_count, 1), 30);
$$;

grant execute on function public.match_search_sections(vector, int) to anon, authenticated;
