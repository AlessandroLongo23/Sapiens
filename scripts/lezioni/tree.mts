/**
 * Applies docs/lezioni/albero.md to the high-school maths subtree of content_nodes.
 *
 *   node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/tree.mts           # plan only
 *   node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/tree.mts --apply
 *
 * Nodes are matched by slug and reused (title, parent and position updated), so ids stay stable;
 * missing ones are created. A lesson listed with `+ old-slug` absorbs that node, which is deleted
 * only if it has no theory and no formulary. A maths node that the file does not mention stops the
 * run. The plan lists the redirects needed for published lessons and chapters whose public path
 * changes (to add to PATH_ALIASES in src/lib/seo/slug.ts) and the exercise config keys that move.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { slugify } from '../../src/lib/seo/slug';

type Row = { id: string; parent_id: string | null; type: string; title: string; slug: string; position: number; theory: string | null; formulary: string | null };
type Lesson = { slug: string; title: string; absorbs: string[] };
type Chapter = { slug: string; title: string; lessons: Lesson[] };

const apply = process.argv.includes('--apply');

function parse(md: string): Chapter[] {
	const chapters: Chapter[] = [];
	for (const raw of md.split('\n')) {
		const line = raw.trimEnd();
		let m = line.match(/^## ([a-z0-9-]+) \| (.+)$/);
		if (m) {
			chapters.push({ slug: m[1], title: m[2].trim(), lessons: [] });
			continue;
		}
		m = line.match(/^- ([a-z0-9-]+) \| (.+)$/);
		if (m) {
			chapters.at(-1)!.lessons.push({ slug: m[1], title: m[2].trim(), absorbs: [] });
			continue;
		}
		m = line.match(/^\s+\+ ([a-z0-9-]+)$/);
		if (m) chapters.at(-1)!.lessons.at(-1)!.absorbs.push(m[1]);
	}
	return chapters;
}

const spec = parse(readFileSync('docs/lezioni/albero.md', 'utf8'));
const db = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const { data, error } = await db.from('content_nodes').select('id,parent_id,type,title,slug,position,theory,formulary');
if (error) throw error;
const all = data as Row[];
const level = all.find((n) => n.slug === 'high_school')!;
const math = all.find((n) => n.slug === 'math' && n.parent_id === level.id)!;
const oldChapters = all.filter((n) => n.parent_id === math.id);
const oldLessons = all.filter((n) => oldChapters.some((c) => c.id === n.parent_id));
const byId = new Map(all.map((n) => [n.id, n]));
const base = `/materiale/${slugify(level.title)}/${slugify(math.title)}`;
const has = (s: string | null) => !!s && s.trim() !== '';

// Checks: every maths node is accounted for, no slug twice, new slugs free across the whole table.
const errors: string[] = [];
const specSlugs = spec.flatMap((c) => [c.slug, ...c.lessons.flatMap((l) => [l.slug, ...l.absorbs])]);
const dupes = specSlugs.filter((s, i) => specSlugs.indexOf(s) !== i);
if (dupes.length) errors.push(`slug ripetuti nel file: ${[...new Set(dupes)].join(', ')}`);
for (const n of [...oldChapters, ...oldLessons]) if (!specSlugs.includes(n.slug)) errors.push(`nodo non citato nel file: ${n.type} ${n.slug}`);
const mathIds = new Set([math.id, ...oldChapters.map((c) => c.id), ...oldLessons.map((l) => l.id)]);
for (const s of specSlugs) {
	const elsewhere = all.filter((n) => n.slug === s && !mathIds.has(n.id));
	if (elsewhere.length && ![...oldChapters, ...oldLessons].some((n) => n.slug === s)) errors.push(`slug già usato fuori dalla matematica: ${s}`);
}
for (const c of spec) for (const l of c.lessons) for (const a of l.absorbs) {
	// Already absorbed by an earlier run: nothing left to do.
	const n = oldLessons.find((x) => x.slug === a);
	if (n && (has(n.theory) || has(n.formulary))) errors.push(`lezione da assorbire non vuota: ${a}`);
}

// Plan.
const plan: string[] = [];
const aliases: [string, string][] = [];
const configMoves: [string, string][] = [];
let creates = 0, updates = 0, deletes = 0;
for (const [ci, c] of spec.entries()) {
	const oc = oldChapters.find((x) => x.slug === c.slug);
	if (!oc) {
		creates++;
		plan.push(`+ capitolo ${c.slug} "${c.title}"`);
	} else {
		if (oc.title !== c.title) {
			updates++;
			plan.push(`~ capitolo ${c.slug}: "${oc.title}" → "${c.title}"`);
			aliases.push([`${base}/${slugify(oc.title)}`, `${base}/${slugify(c.title)}`]);
		} else if (oc.position !== ci) updates++;
	}
	for (const [li, l] of c.lessons.entries()) {
		const ol = oldLessons.find((x) => x.slug === l.slug);
		if (!ol) {
			creates++;
			plan.push(`+ lezione ${c.slug}/${l.slug} "${l.title}"`);
			continue;
		}
		const oldParent = byId.get(ol.parent_id!)!;
		const moved = oldParent.slug !== c.slug;
		if (moved || ol.title !== l.title || ol.position !== li) updates++;
		if (moved || ol.title !== l.title) plan.push(`~ lezione ${l.slug}: ${oldParent.slug}/"${ol.title}" → ${c.slug}/"${l.title}"${has(ol.theory) ? '  [pubblicata]' : ''}`);
		const from = `${base}/${slugify(oldParent.title)}/${slugify(ol.title)}`;
		const to = `${base}/${slugify(c.title)}/${slugify(l.title)}`;
		if (has(ol.theory) && from !== to) aliases.push([from, to]);
		if (moved) configMoves.push([`high_school/math/${oldParent.slug}/${l.slug}`, `high_school/math/${c.slug}/${l.slug}`]);
		for (const a of l.absorbs.filter((a) => oldLessons.some((x) => x.slug === a))) {
			deletes++;
			plan.push(`- lezione ${a} (assorbita da ${l.slug})`);
		}
	}
}

console.log(plan.join('\n'));
console.log(`\ncapitoli ${spec.length}, lezioni ${spec.reduce((s, c) => s + c.lessons.length, 0)}; da creare ${creates}, da aggiornare ${updates}, da cancellare ${deletes}`);
// Lesson redirects first: aliasTarget() takes the first match, and a chapter alias would also match its lessons as a prefix.
aliases.sort((a, b) => b[0].split('/').length - a[0].split('/').length);
console.log('\nPATH_ALIASES:');
for (const [f, t] of aliases) console.log(`\t'${f}': '${t}',`);
console.log('\nChiavi degli esercizi che cambiano (src/lib/exercises/config.ts):');
for (const [f, t] of configMoves) console.log(`  ${f} → ${t}`);
if (errors.length) {
	console.log('\nERRORI:\n' + errors.map((e) => '  ' + e).join('\n'));
	process.exit(1);
}
if (!apply) {
	console.log('\nNiente scritto. Per applicare: --apply');
	process.exit(0);
}

// Apply: chapters, then lessons, then deletions (children have moved by then).
const chapterId = new Map<string, string>();
for (const [ci, c] of spec.entries()) {
	const oc = oldChapters.find((x) => x.slug === c.slug);
	if (oc) {
		const { error } = await db.from('content_nodes').update({ title: c.title, position: ci }).eq('id', oc.id);
		if (error) throw new Error(`capitolo ${c.slug}: ${error.message}`);
		chapterId.set(c.slug, oc.id);
	} else {
		const { data: row, error } = await db.from('content_nodes').insert({ parent_id: math.id, type: 'chapter', title: c.title, slug: c.slug, position: ci }).select('id').single();
		if (error) throw new Error(`capitolo ${c.slug}: ${error.message}`);
		chapterId.set(c.slug, row.id);
	}
}
for (const c of spec) {
	for (const [li, l] of c.lessons.entries()) {
		const ol = oldLessons.find((x) => x.slug === l.slug);
		const fields = { parent_id: chapterId.get(c.slug)!, title: l.title, position: li };
		const { error } = ol
			? await db.from('content_nodes').update(fields).eq('id', ol.id)
			: await db.from('content_nodes').insert({ ...fields, type: 'topic', slug: l.slug });
		if (error) throw new Error(`lezione ${l.slug}: ${error.message}`);
	}
}
for (const c of spec) for (const l of c.lessons) for (const a of l.absorbs) {
	const n = oldLessons.find((x) => x.slug === a);
	if (!n) continue;
	const { error } = await db.from('content_nodes').delete().eq('id', n.id);
	if (error) throw new Error(`cancellazione ${a}: ${error.message}`);
}
console.log('\nAlbero applicato.');
