/**
 * Writes the lists the physics lessons are written against, from the physics tree in the database:
 *
 *   JITI_ALIAS='{"@/": "<radice del repo>/src/"}' node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/fisica/indice.mts
 *
 * - docs/lezioni/fisica/url.md: every physics chapter and lesson with its public URL, for the links between
 *   lessons (scripts/lezioni/check.mts reads it next to docs/lezioni/url.md);
 * - docs/lezioni/fisica/originali/index.json: the lessons in the order of the tree, for
 *   `scripts/lezioni/publish.mts --dir docs/lezioni/fisica`. The files of lesson i are NN-slug.md with NN = i + 1.
 */
import { writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { nodePath } from '../../src/lib/seo/slug';

const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
const db = createClient(process.env.PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false } });

type Row = { id: string; parent_id: string | null; slug: string; title: string; type: string; position: number; school_year: number | null };
const one = async (q: PromiseLike<{ data: Row[] | null; error: { message: string } | null }>) => {
	const { data, error } = await q;
	if (error) throw new Error(error.message);
	return data ?? [];
};
const cols = 'id,parent_id,slug,title,type,position,school_year';
const [level] = await one(db.from('content_nodes').select(cols).eq('slug', 'high_school').is('parent_id', null));
const [subject] = await one(db.from('content_nodes').select(cols).eq('slug', 'physics').eq('parent_id', level.id));
const chapters = (await one(db.from('content_nodes').select(cols).eq('parent_id', subject.id))).sort((a, b) => (a.school_year ?? 9) - (b.school_year ?? 9) || a.position - b.position);
const lessons = await one(db.from('content_nodes').select(cols).in('parent_id', chapters.map((c) => c.id)));

const url: string[] = ['# Lezioni di fisica e il loro indirizzo', '', 'Generato da `scripts/fisica/indice.mts`: non modificarlo a mano.', ''];
const index: { id: string; parent_id: string; title: string; slug: string; path: string; chapter: string }[] = [];
let year = 0;
for (const c of chapters) {
	if (c.school_year !== year) {
		year = c.school_year ?? 0;
		url.push(`# ${['', 'Primo', 'Secondo', 'Terzo', 'Quarto', 'Quinto'][year] ?? ''} anno`, '');
	}
	url.push(`## ${c.title}  ${nodePath([level, subject, c] as never)}`);
	for (const l of lessons.filter((x) => x.parent_id === c.id).sort((a, b) => a.position - b.position)) {
		url.push(`- ${l.title}: ${nodePath([level, subject, c, l] as never)}`);
		index.push({ id: l.id, parent_id: c.id, title: l.title, slug: l.slug, path: `high_school/physics/${c.slug}/${l.slug}`, chapter: c.title });
	}
	url.push('');
}
writeFileSync('docs/lezioni/fisica/url.md', url.join('\n'));
writeFileSync('docs/lezioni/fisica/originali/index.json', JSON.stringify(index, null, 2) + '\n');
console.log(`${chapters.length} capitoli, ${index.length} lezioni`);
