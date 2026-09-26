/**
 * Measures the site search on the questions in domande.json, each written as a student
 * would ask it and paired with the section(s) that answer it: how often an answer comes
 * first and how often it is among the first three, by words alone (lib/search/rank.ts),
 * by meaning alone (search_sections) and fused as the overlay shows them. Run it after
 * changing the ranking or the embeddings.
 *
 *   JITI_ALIAS='{"@/": "'$PWD'/src/"}' node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/search/eval.mts
 *   … eval.mts --verbose      every question with its first three results
 *
 * Without a working OPENAI_API_KEY only the ranking by words is measured.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { reconstructTree } from '../../src/lib/utils/tree';
import { buildIndex, fuse, search, SEMANTIC_FLOOR, type SectionHit, type SemanticHit } from '../../src/lib/search/rank';
import { EMBEDDING_MODEL, lessonSections } from '../../src/lib/search/sections';

const verbose = process.argv.includes('--verbose');
const db = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
const questions: { q: string; expect: string[] }[] = JSON.parse(readFileSync(new URL('./domande.json', import.meta.url), 'utf8'));

const nodes = await db.from('content_nodes').select('id,parent_id,type,title,slug,position').order('position');
if (nodes.error) throw nodes.error;
const topics = await db.from('content_nodes').select('id,theory').eq('type', 'topic').not('theory', 'is', null).neq('theory', '');
if (topics.error) throw topics.error;
const index = buildIndex(reconstructTree(nodes.data as never), topics.data.flatMap((t) => lessonSections(t.id as string, t.theory as string)));
const titleById = new Map(nodes.data.map((n) => [n.id as string, n.title as string]));

let openai: OpenAI | null = new OpenAI();
async function meaning(q: string): Promise<SemanticHit[]> {
	if (!openai) return [];
	try {
		const res = await openai.embeddings.create({ model: EMBEDDING_MODEL, input: q.trim().toLowerCase() });
		const { data, error } = await db.rpc('match_search_sections', { query_embedding: JSON.stringify(res.data[0].embedding), match_count: 8 });
		if (error) throw error;
		return (data ?? []).map((r: { topic_id: string; section_id: string; similarity: number }) => ({ topic: r.topic_id, id: r.section_id, similarity: r.similarity }));
	} catch (e) {
		console.log(`Ricerca per significato non disponibile: ${e instanceof Error ? e.message : e}\n`);
		openai = null;
		return [];
	}
}

const label = (topic: string, id: string) => `${titleById.get(topic)}#${id}`;
const score = { words: [0, 0], meaning: [0, 0], fused: [0, 0] };
const tally = (key: keyof typeof score, found: string[], expect: string[]) => {
	const at = found.findIndex((f) => expect.includes(f));
	if (at === 0) score[key][0]++;
	if (at >= 0 && at < 3) score[key][1]++;
	return at;
};
const labels = (hits: SectionHit[]) => hits.map((h) => label(h.section.topic, h.section.id));

for (const { q, expect } of questions) {
	const words = search(index, q);
	const near = await meaning(q);
	const fused = fuse(index, words, near);
	const w = tally('words', labels(words.sections), expect);
	const m = tally('meaning', near.filter((h) => h.similarity >= SEMANTIC_FLOOR).map((h) => label(h.topic, h.id)), expect);
	const f = tally('fused', labels(fused.sections), expect);
	const mark = (at: number) => (at === 0 ? '1°' : at > 0 && at < 3 ? `${at + 1}°` : at >= 3 ? `${at + 1}°` : '--');
	console.log(`${mark(w).padStart(3)} ${openai ? mark(m).padStart(3) : ''} ${openai ? mark(f).padStart(3) : ''}  ${q}`);
	if (verbose) {
		for (const h of fused.sections.slice(0, 3)) console.log(`        ${h.semantic ? '~' : ' '} ${label(h.section.topic, h.section.id)}`);
		if (openai) console.log(`        similarità: ${near.slice(0, 3).map((h) => h.similarity.toFixed(2)).join(', ')}`);
	}
}

const n = questions.length;
const line = (name: string, [first, top3]: number[]) => console.log(`${name.padEnd(14)} primo ${first}/${n} (${Math.round((100 * first) / n)}%)   tra i primi tre ${top3}/${n} (${Math.round((100 * top3) / n)}%)`);
console.log('');
line('Parole', score.words);
if (openai) {
	line('Significato', score.meaning);
	line('Insieme', score.fused);
}
