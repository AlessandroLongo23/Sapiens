import OpenAI from 'openai';
import { supabase } from '@/lib/server/supabase';
import { EMBEDDING_MODEL } from '@/lib/search/sections';
import type { SemanticHit } from '@/lib/search/rank';

/**
 * The lesson sections nearest in meaning to a question, for the site search:
 * the question is embedded with the model the sections were embedded with
 * (scripts/search/embed.mts) and matched in search_sections. The overlay
 * calls it after a pause in typing, only for questions and for searches the
 * words alone answer poorly. Any failure answers an empty list, so the search
 * falls back to its own ranking.
 */

const MIN_LENGTH = 4;
const MAX_LENGTH = 200;
const recent = new Map<string, SemanticHit[]>();

async function nearest(q: string): Promise<SemanticHit[]> {
	const cached = recent.get(q);
	if (cached) return cached;
	const openai = new OpenAI();
	const res = await openai.embeddings.create({ model: EMBEDDING_MODEL, input: q });
	const { data, error } = await supabase.rpc('match_search_sections', { query_embedding: JSON.stringify(res.data[0].embedding), match_count: 8 });
	if (error) throw error;
	const hits = (data ?? []).map((r: { topic_id: string; section_id: string; similarity: number }) => ({ topic: r.topic_id, id: r.section_id, similarity: Math.round(r.similarity * 1000) / 1000 }));
	// A few hundred questions a day repeat a lot ("equazioni di secondo grado"); keep the last ones.
	if (recent.size >= 500) recent.delete(recent.keys().next().value!);
	recent.set(q, hits);
	return hits;
}

export async function GET(request: Request) {
	const q = (new URL(request.url).searchParams.get('q') ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
	if (q.length < MIN_LENGTH || q.length > MAX_LENGTH || !process.env.OPENAI_API_KEY) return Response.json([]);
	try {
		return Response.json(await nearest(q), { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
	} catch (e) {
		console.error('semantic search failed:', e instanceof Error ? e.message : e);
		return Response.json([]);
	}
}
