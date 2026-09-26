/**
 * Applies a tree file to one subject of content_nodes: docs/lezioni/albero.md to high-school maths (the
 * default), docs/lezioni/chimica/albero.md to chemistry, docs/lezioni/medie/<materia>/albero.md to a
 * middle-school subject with `--level middle_school`. A subject that does not exist yet is created with the
 * title given by `--title`.
 *
 *   node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/tree.mts           # plan only
 *   node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/tree.mts --apply
 *   node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/tree.mts --subject chemistry --file docs/lezioni/chimica/albero.md
 *   node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/tree.mts --level middle_school --subject science --title Scienze --file docs/lezioni/medie/scienze/albero.md
 *
 * Nodes are matched by slug and reused (title, parent and position updated), so ids stay stable;
 * missing ones are created. A lesson listed with `+ old-slug` absorbs that node, which is deleted
 * only if it has no theory and no formulary; `+ old-slug` right under a chapter, before its lessons,
 * absorbs a chapter the same way (deleted once its lessons have moved). Chapters and lessons are
 * matched separately, so a chapter and a lesson may share a slug. `# Primo anno` … `# Quinto anno`
 * lines give the chapters that follow their school_year. A node of the subject that the file does
 * not mention stops the run. The plan lists the redirects needed for published lessons and chapters whose public path
 * changes (to add to PATH_ALIASES in src/lib/seo/slug.ts) and the exercise config keys that move.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { slugify } from '../../src/lib/seo/slug';

type Row = { id: string; parent_id: string | null; type: string; title: string; slug: string; position: number; theory: string | null; formulary: string | null };
type Lesson = { slug: string; title: string; absorbs: string[] };
type Chapter = { slug: string; title: string; year: number | null; absorbs: string[]; lessons: Lesson[] };

const apply = process.argv.includes('--apply');
const arg = (name: string, fallback: string) => {
	const i = process.argv.indexOf(`--${name}`);
	return i > 0 ? process.argv[i + 1] : fallback;
};
const levelSlug = arg('level', 'high_school');
const subjectSlug = arg('subject', 'math');
const subjectTitle = arg('title', '');
const file = arg('file', 'docs/lezioni/albero.md');
const YEARS: Record<string, number> = { primo: 1, secondo: 2, terzo: 3, quarto: 4, quinto: 5 };

function parse(md: string): Chapter[] {
	const chapters: Chapter[] = [];
	let year: number | null = null;
	for (const raw of md.split('\n')) {
		const line = raw.trimEnd();
		const y = line.match(/^# (\w+) anno$/i);
		if (y && YEARS[y[1].toLowerCase()]) {
			year = YEARS[y[1].toLowerCase()];
			continue;
		}
		let m = line.match(/^## ([a-z0-9-]+) \| (.+)$/);
		if (m) {
			chapters.push({ slug: m[1], title: m[2].trim(), year, absorbs: [], lessons: [] });
			continue;
		}
		m = line.match(/^- ([a-z0-9-]+) \| (.+)$/);
		if (m) {
			chapters.at(-1)!.lessons.push({ slug: m[1], title: m[2].trim(), absorbs: [] });
			continue;
		}
		m = line.match(/^\s+\+ ([a-z0-9-]+)$/);
		if (m) {
			const chapter = chapters.at(-1)!;
			(chapter.lessons.at(-1) ?? chapter).absorbs.push(m[1]);
		}
	}
	return chapters;
}

const spec = parse(readFileSync(file, 'utf8'));
const db = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
// Read in pages: a select stops at 1000 rows, and the table is larger.
const all: Row[] = [];
for (let from = 0; ; from += 1000) {
	const { data, error } = await db.from('content_nodes').select('id,parent_id,type,title,slug,position,theory,formulary').order('id').range(from, from + 999);
	if (error) throw error;
	all.push(...(data as Row[]));
	if (data.length < 1000) break;
}
const level = all.find((n) => n.slug === levelSlug && n.parent_id === null);
if (!level) throw new Error(`livello ${levelSlug} non trovato`);
const found = all.find((n) => n.slug === subjectSlug && n.parent_id === level.id);
if (!found && !subjectTitle) throw new Error(`materia ${subjectSlug} non trovata sotto ${levelSlug}: per crearla serve --title`);
// A subject still to create stands in with an id no node has, so it has no chapters.
const math: Row = found ?? { id: 'nuova', parent_id: level.id, type: 'subject', title: subjectTitle, slug: subjectSlug, position: all.filter((n) => n.parent_id === level.id).length, theory: null, formulary: null };
const oldChapters = all.filter((n) => n.parent_id === math.id);
const oldLessons = all.filter((n) => oldChapters.some((c) => c.id === n.parent_id));
const byId = new Map(all.map((n) => [n.id, n]));
const base = `/materiale/${slugify(level.title)}/${slugify(math.title)}`;
const has = (s: string | null) => !!s && s.trim() !== '';

// Checks: every node of the subject is accounted for, no slug twice among chapters or among lessons, new slugs
// free across the whole table.
const errors: string[] = [];
const chapterSlugs = spec.flatMap((c) => [c.slug, ...c.absorbs]);
const lessonSlugs = spec.flatMap((c) => c.lessons.flatMap((l) => [l.slug, ...l.absorbs]));
const specSlugs = [...chapterSlugs, ...lessonSlugs];
for (const [kind, slugs] of [['capitoli', chapterSlugs], ['lezioni', lessonSlugs]] as const) {
	const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
	if (dupes.length) errors.push(`slug ripetuti tra i ${kind} del file: ${[...new Set(dupes)].join(', ')}`);
}
for (const n of oldChapters) if (!chapterSlugs.includes(n.slug)) errors.push(`capitolo non citato nel file: ${n.slug}`);
for (const n of oldLessons) if (!lessonSlugs.includes(n.slug)) errors.push(`lezione non citata nel file: ${n.slug}`);
const mathIds = new Set([math.id, ...oldChapters.map((c) => c.id), ...oldLessons.map((l) => l.id)]);
for (const s of specSlugs) {
	const elsewhere = all.filter((n) => n.slug === s && !mathIds.has(n.id));
	if (elsewhere.length && ![...oldChapters, ...oldLessons].some((n) => n.slug === s)) errors.push(`slug già usato fuori dalla materia: ${s}`);
}
for (const c of spec) for (const l of c.lessons) for (const a of l.absorbs) {
	// Already absorbed by an earlier run: nothing left to do.
	const n = oldLessons.find((x) => x.slug === a);
	if (n && (has(n.theory) || has(n.formulary))) errors.push(`lezione da assorbire non vuota: ${a}`);
}
for (const c of spec) for (const a of c.absorbs) {
	const n = oldChapters.find((x) => x.slug === a);
	if (!n) continue;
	for (const child of oldLessons.filter((l) => l.parent_id === n.id))
		if (!lessonSlugs.includes(child.slug)) errors.push(`il capitolo assorbito ${a} ha una lezione che non va da nessuna parte: ${child.slug}`);
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
	for (const a of c.absorbs.filter((a) => oldChapters.some((x) => x.slug === a))) {
		deletes++;
		plan.push(`- capitolo ${a} (assorbito da ${c.slug})`);
	}
	for (const [li, l] of c.lessons.entries()) {
		const ol = oldLessons.find((x) => x.slug === l.slug);
		for (const a of l.absorbs.filter((a) => oldLessons.some((x) => x.slug === a))) {
			deletes++;
			plan.push(`- lezione ${a} (assorbita da ${l.slug})`);
		}
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
		if (moved) configMoves.push([`${levelSlug}/${subjectSlug}/${oldParent.slug}/${l.slug}`, `${levelSlug}/${subjectSlug}/${c.slug}/${l.slug}`]);
	}
}

if (!found) plan.unshift(`+ materia ${levelSlug}/${subjectSlug} "${subjectTitle}"`);
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

// Apply: the subject if new, chapters, then lessons, then deletions (children have moved by then).
if (!found) {
	const { data: row, error } = await db.from('content_nodes').insert({ parent_id: level.id, type: 'subject', title: math.title, slug: math.slug, position: math.position }).select('id').single();
	if (error) throw new Error(`materia ${subjectSlug}: ${error.message}`);
	math.id = row.id;
}
const chapterId = new Map<string, string>();
for (const [ci, c] of spec.entries()) {
	const oc = oldChapters.find((x) => x.slug === c.slug);
	// The year only when the file gives one, so a file without year headings leaves school_year as it is.
	const year = c.year === null ? {} : { school_year: c.year };
	if (oc) {
		const { error } = await db.from('content_nodes').update({ title: c.title, position: ci, ...year }).eq('id', oc.id);
		if (error) throw new Error(`capitolo ${c.slug}: ${error.message}`);
		chapterId.set(c.slug, oc.id);
	} else {
		const { data: row, error } = await db.from('content_nodes').insert({ parent_id: math.id, type: 'chapter', title: c.title, slug: c.slug, position: ci, ...year }).select('id').single();
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
for (const c of spec) for (const a of c.absorbs) {
	const n = oldChapters.find((x) => x.slug === a);
	if (!n) continue;
	const { count } = await db.from('content_nodes').select('id', { count: 'exact', head: true }).eq('parent_id', n.id);
	if (count) throw new Error(`il capitolo assorbito ${a} ha ancora ${count} lezioni`);
	const { error } = await db.from('content_nodes').delete().eq('id', n.id);
	if (error) throw new Error(`cancellazione del capitolo ${a}: ${error.message}`);
}
console.log('\nAlbero applicato.');
