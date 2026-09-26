/**
 * Publishes the chemistry lessons: drawings to the `figure` bucket, lesson and formulary to content_nodes.
 *
 *   scripts/chimica/.venv/bin/python scripts/chimica/pubblica_figure.py docs/lezioni/chimica/{riscritte,formulari}/*.md
 *   scripts/chimica/.venv/bin/python scripts/chimica/esporta.py
 *   node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/chimica/pubblica.mts           # dry run
 *   node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/chimica/pubblica.mts --apply
 *
 * The two Python steps draw the figures of lessons and exercises into scripts/chimica/.svg-sito/ and write the
 * `% svg:` lines into the lesson files; this script uploads the drawings the bucket does not have yet, then
 * writes each docs/lezioni/chimica/riscritte/NN-slug.md to the `theory` of the chemistry lesson with that slug
 * (and formulari/NN-slug.md to `formulary`). Same rule as scripts/lezioni/publish.mts: a column is written only
 * if the database still holds what this script last wrote (docs/lezioni/chimica/pubblicate/) or is empty, so an
 * edit made from the admin pages is never overwritten. A lesson figure whose drawing is missing stops the run.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { CHEM_BLOCKS, FIGURE_BUCKET, parseFigure, publishedChemSvg, type ChemBlock } from '../../src/lib/content/figures';

const apply = process.argv.includes('--apply');
const dir = 'docs/lezioni/chimica';
const svgDir = 'scripts/chimica/.svg-sito';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
const db = createClient(process.env.PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false } });

const fence = new RegExp('```(' + CHEM_BLOCKS.join('|') + ')\\n([\\s\\S]+?)```', 'g');
const lessons = readdirSync(`${dir}/riscritte`).filter((f) => /^\d\d-.+\.md$/.test(f)).sort();

// 1. Every figure of every lesson and formulary is compiled for its current code, and its drawing is on disk.
const needed = new Set<string>();
let errors = 0;
for (const name of lessons)
	for (const folder of ['riscritte', 'formulari']) {
		const path = `${dir}/${folder}/${name}`;
		if (!existsSync(path)) continue;
		for (const m of readFileSync(path, 'utf8').matchAll(fence)) {
			const figure = parseFigure(m[2]);
			const svg = publishedChemSvg(m[1] as ChemBlock, figure);
			if (!figure.name || !figure.alt) {
				errors++;
				console.log(`ERRORE ${folder}/${name}: figura senza "% nome" o "% alt"`);
			} else if (!svg || !existsSync(`${svgDir}/${svg.file}`)) {
				errors++;
				console.log(`ERRORE ${folder}/${name}: ${figure.name} non compilata per il codice di oggi (lancia pubblica_figure.py)`);
			} else needed.add(svg.file);
		}
	}
if (errors) {
	console.log('\nFigure da compilare: niente scritto.');
	process.exit(1);
}

// 2. Drawings: the lessons' and the exercise pools' (scripts/chimica/esporta.py), each file once.
for (const pool of readdirSync('src/lib/exercises/chimica/pools'))
	for (const m of readFileSync(`src/lib/exercises/chimica/pools/${pool}`, 'utf8').matchAll(/"file":"([^"]+\.svg)"/g)) needed.add(m[1]);
const present = new Set<string>();
for (let offset = 0; ; offset += 1000) {
	const { data, error } = await db.storage.from(FIGURE_BUCKET).list('', { limit: 1000, offset });
	if (error) throw new Error(`bucket ${FIGURE_BUCKET}: ${error.message}`);
	data.forEach((f) => present.add(f.name));
	if (data.length < 1000) break;
}
const missing = [...needed].filter((f) => !present.has(f));
const absent = missing.filter((f) => !existsSync(`${svgDir}/${f}`));
if (absent.length) {
	console.log(`ERRORE ${absent.length} disegni non sono né nel bucket né in ${svgDir} (lancia esporta.py): ${absent.slice(0, 5).join(', ')}`);
	process.exit(1);
}
console.log(`disegni: ${needed.size} usati, ${missing.length} da caricare`);
if (apply)
	for (const [i, file] of missing.entries()) {
		const { error } = await db.storage.from(FIGURE_BUCKET).upload(file, readFileSync(`${svgDir}/${file}`), { contentType: 'image/svg+xml', cacheControl: '31536000', upsert: true });
		if (error) throw new Error(`figura ${file}: ${error.message}`);
		if ((i + 1) % 200 === 0) console.log(`  caricati ${i + 1}/${missing.length}`);
	}

// 3. Lessons: the chemistry lesson with the file's slug.
// In pages: a select stops at 1000 rows, and the table is larger.
const nodes: { id: string; parent_id: string | null; slug: string; type: string }[] = [];
for (let from = 0; ; from += 1000) {
	const { data, error } = await db.from('content_nodes').select('id,parent_id,slug,type').order('id').range(from, from + 999);
	if (error) throw new Error(error.message);
	nodes.push(...data);
	if (data.length < 1000) break;
}
const byId = new Map(nodes.map((n) => [n.id, n]));
const level = nodes.find((n) => n.slug === 'high_school' && !n.parent_id)!;
const subject = nodes.find((n) => n.slug === 'chemistry' && n.parent_id === level.id)!;
const lessonNode = (slug: string) => nodes.find((n) => n.slug === slug && n.parent_id && byId.get(n.parent_id)?.parent_id === subject.id);

let failed = 0;
for (const name of lessons) {
	const slug = name.replace(/^\d\d-|\.md$/g, '');
	const node = lessonNode(slug);
	if (!node) {
		failed++;
		console.log(`ERRORE ${name}: nessuna lezione di chimica con slug ${slug} (applica prima l'albero)`);
		continue;
	}
	const { data, error: e } = await db.from('content_nodes').select('theory,formulary').eq('id', node.id).single();
	if (e) throw new Error(e.message);
	for (const [column, source, published] of [
		['theory', 'riscritte', 'pubblicate'],
		['formulary', 'formulari', 'pubblicate/formulari']
	] as const) {
		const label = `${column.padEnd(9)} ${name}`;
		const path = `${dir}/${source}/${name}`;
		if (!existsSync(path)) continue;
		const next = readFileSync(path, 'utf8');
		const last = `${dir}/${published}/${name}`;
		const saved = existsSync(last) ? readFileSync(last, 'utf8') : null;
		const current = (data[column] as string | null) || null;
		if (current === next) console.log(`uguale  ${label}`);
		else if (current !== saved) {
			failed++;
			console.log(`SALTO   ${label}: nel database il contenuto è cambiato dopo l'ultima pubblicazione, non lo sovrascrivo`);
		} else if (!apply) console.log(`pronto  ${label}`);
		else {
			const { error: w } = await db.from('content_nodes').update({ [column]: next, updated_at: new Date().toISOString() }).eq('id', node.id);
			const { data: check } = await db.from('content_nodes').select(column).eq('id', node.id).single();
			if (w || (check as Record<string, unknown> | null)?.[column] !== next) {
				failed++;
				console.log(`ERRORE  ${label}: ${w?.message ?? 'il contenuto riletto non coincide'}`);
			} else {
				mkdirSync(`${dir}/${published}`, { recursive: true });
				writeFileSync(last, next);
				console.log(`scritto ${label}`);
			}
		}
	}
}
console.log(apply ? '' : '\nProva senza scrivere. Per pubblicare: --apply');
process.exitCode = failed ? 1 : 0;
