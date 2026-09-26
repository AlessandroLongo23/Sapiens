/**
 * Computes the embedding of every section of the written lessons and stores it in
 * search_sections, for the site search to find the paragraph that answers a question
 * (vault/Prodotti/Studenti/Ricerca.md). Run it after publishing lessons: only the
 * sections whose text changed are sent to OpenAI, and the rows of sections that no
 * longer exist are removed.
 *
 *   JITI_ALIAS='{"@/": "'$PWD'/src/"}' node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/search/embed.mts           # plan only
 *   JITI_ALIAS='{"@/": "'$PWD'/src/"}' node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/search/embed.mts --apply
 *
 * (JITI_ALIAS resolves the `@/` imports of the site code.) Then scripts/search/eval.mts measures the result.
 *
 * OPENAI_BASE_URL, when set, points the client at another region (https://eu.api.openai.com/v1).
 */
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { EMBEDDING_MODEL, embeddingInput, lessonSectionTexts } from '../../src/lib/search/sections';

const apply = process.argv.includes('--apply');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
const db = createClient(process.env.PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false } });

const nodes = await db.from('content_nodes').select('id,parent_id,title,type');
if (nodes.error) throw nodes.error;
const byId = new Map(nodes.data.map((n) => [n.id as string, n]));
const topics = await db.from('content_nodes').select('id,parent_id,title,theory').eq('type', 'topic').not('theory', 'is', null).neq('theory', '');
if (topics.error) throw topics.error;

const wanted = new Map<string, { topic: string; id: string; input: string; hash: string }>();
for (const t of topics.data) {
	const chapter = byId.get(t.parent_id as string)?.title ?? '';
	for (const s of lessonSectionTexts(t.id as string, t.theory as string)) {
		const input = embeddingInput(s, t.title as string, chapter as string);
		// A heading can repeat inside a lesson; the page gives both the same anchor, so the first one wins.
		const k = `${s.topic}/${s.id}`;
		if (!wanted.has(k)) wanted.set(k, { topic: s.topic, id: s.id, input, hash: createHash('sha1').update(`${EMBEDDING_MODEL}\n${input}`).digest('hex') });
	}
}

const stored = new Map<string, string>();
for (let from = 0; ; from += 1000) {
	const page = await db.from('search_sections').select('topic_id,section_id,content_hash').range(from, from + 999);
	if (page.error) throw page.error;
	for (const r of page.data) stored.set(`${r.topic_id}/${r.section_id}`, r.content_hash as string);
	if (page.data.length < 1000) break;
}

const todo = [...wanted.entries()].filter(([k, s]) => stored.get(k) !== s.hash).map(([, s]) => s);
const gone = [...stored.keys()].filter((k) => !wanted.has(k));
const chars = todo.reduce((n, s) => n + s.input.length, 0);
console.log(`${wanted.size} sezioni: ${todo.length} da calcolare (circa ${Math.round(chars / 3.5 / 1000)}k token), ${gone.length} da togliere.`);
if (!apply) {
	console.log('Solo piano: aggiungi --apply per scrivere.');
	process.exit(0);
}

const openai = new OpenAI();
for (let i = 0; i < todo.length; i += 96) {
	const batch = todo.slice(i, i + 96);
	const res = await openai.embeddings.create({ model: EMBEDDING_MODEL, input: batch.map((s) => s.input) });
	const rows = batch.map((s, j) => ({ topic_id: s.topic, section_id: s.id, content_hash: s.hash, embedding: JSON.stringify(res.data[j].embedding), updated_at: new Date().toISOString() }));
	const up = await db.from('search_sections').upsert(rows);
	if (up.error) throw up.error;
	console.log(`  ${Math.min(i + 96, todo.length)}/${todo.length} (${res.usage.total_tokens} token)`);
}
for (const k of gone) {
	const [topic, id] = k.split('/');
	const del = await db.from('search_sections').delete().eq('topic_id', topic).eq('section_id', id);
	if (del.error) throw del.error;
}
console.log('Fatto.');
