import 'server-only';
import { supabase } from './supabase';
import { lessonSections } from '@/lib/search/sections';
import type { SearchSection } from '@/lib/search/rank';

/** The sections of every written lesson, for the site search. The lesson text itself never leaves the server. */

const TTL_MS = 5 * 60_000;

let cached: { at: number; sections: SearchSection[] } | null = null;

export async function getSearchSections(): Promise<SearchSection[]> {
	if (cached && Date.now() - cached.at < TTL_MS) return cached.sections;
	const { data, error } = await supabase.from('content_nodes').select('id,theory').eq('type', 'topic').not('theory', 'is', null).neq('theory', '');
	if (error) {
		console.error('search index query failed:', error.message);
		return cached?.sections ?? [];
	}
	const sections = (data ?? []).flatMap((row) => lessonSections(row.id as string, row.theory as string));
	cached = { at: Date.now(), sections };
	return sections;
}
