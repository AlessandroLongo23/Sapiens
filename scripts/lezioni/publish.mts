/**
 * Writes rewritten lessons to content_nodes.theory, and formularies and
 * flashcards to content_nodes.formulary and content_nodes.flashcards.
 *
 *   node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/publish.mts          # dry run
 *   node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/publish.mts --apply
 *
 * For every lesson in docs/lezioni/originali/index.json it writes
 * docs/lezioni/riscritte/NN-slug.md, but only if the database still holds the
 * text we last saw there: docs/lezioni/pubblicate/NN-slug.md (the copy of the
 * last version this script wrote) or, before the first publish,
 * docs/lezioni/originali/NN-slug.md (a new lesson, with no original, must
 * still be empty in the database). A lesson edited in the meantime is
 * skipped, never overwritten. Uses the service-role key.
 *
 * Formularies (docs/lezioni/formulari/NN-slug.md) and flashcards
 * (docs/lezioni/flashcard/NN-slug.md, parsed to JSON by
 * src/lib/content/flashcards.ts) follow the same rule, with their last
 * published copy in docs/lezioni/pubblicate/formulari/ and
 * docs/lezioni/pubblicate/flashcard/; before their first publish the column
 * must be empty. A flashcard file that does not parse stops the run.
 *
 * Before that, every ```tikz block of a lesson or a formulary is compiled to SVG (scripts/figure), uploaded
 * to the `figure` bucket and its `% svg:` line written into the lesson file
 * (see src/lib/content/figures.ts). A figure without `% nome` or `% alt` stops
 * the run before any lesson is written.
 *
 * `--dir docs/lezioni/fisica` publishes another subject laid out the same way (its originali/index.json is written
 * by scripts/fisica/indice.mts). Every figure is compiled with the TikZ libraries in TIKZ_LIBRARIES.
 *
 * `--per-slug` matches the files to the lessons by the slug in their name (NN-slug.md, any NN) and not by their
 * position in index.json: the chemistry lessons were numbered as they were written. Only files that exist are
 * published. Chemistry drawings (```molecola and the like) are left as they are: scripts/chimica/ draws them.
 */
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { parseFlashcards, type Flashcard } from '../../src/lib/content/flashcards';
import { FIGURE_BUCKET, figureFile, parseFigure, publishedSvg, serializeFigure } from '../../src/lib/content/figures';
import { compileFigure } from '../figure/compile.mjs';
import { revalidateSite } from '../revalidate.mjs';

const apply = process.argv.includes('--apply');
const dirArg = process.argv.indexOf('--dir');
const dir = dirArg > 0 ? process.argv[dirArg + 1].replace(/\/$/, '') : 'docs/lezioni';
/** Loaded for every figure: arrows, springs and hatched supports of the physics figures (docs/lezioni/fisica/README.md). */
const TIKZ_LIBRARIES = 'arrows.meta,decorations.pathmorphing,decorations.markings,patterns,calc';
const index: { id: string; slug: string; title: string }[] = JSON.parse(readFileSync(`${dir}/originali/index.json`, 'utf8'));
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
const db = createClient(process.env.PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false } });

const bySlug = process.argv.includes('--per-slug');
/** The lessons to publish, each with its file name: by position in index.json, or by the slug in the file's name. */
const entries: { id: string; slug: string; name: string }[] = bySlug
	? readdirSync(`${dir}/riscritte`)
			.filter((f) => /^\d\d+-.+\.md$/.test(f))
			.sort()
			.map((name) => {
				const slug = name.replace(/^\d+-|\.md$/g, '');
				const row = index.find((r) => r.slug === slug);
				if (!row) throw new Error(`${name}: nessuna lezione con slug ${slug} in originali/index.json`);
				return { id: row.id, slug, name };
			})
	: index.map((row, i) => ({ id: row.id, slug: row.slug, name: `${String(i + 1).padStart(2, '0')}-${row.slug}.md` }));

async function prepareFigures(): Promise<number> {
	let errors = 0;
	let bucketReady = false;
	for (const { name } of entries) for (const folder of ['riscritte', 'formulari']) {
		const path = `${dir}/${folder}/${name}`;
		if (!existsSync(path)) continue;
		let md = readFileSync(path, 'utf8');
		let changed = false;
		for (const m of [...md.matchAll(/```tikz\n([\s\S]+?)```/g)]) {
			const figure = parseFigure(m[1]);
			if (!figure.name || !figure.alt) {
				errors++;
				console.log(`ERRORE ${folder}/${name}: figura senza "% nome" o "% alt"`);
				continue;
			}
			if (publishedSvg(figure)) continue;
			const file = figureFile(figure);
			if (!apply) {
				console.log(`figura ${file}: da compilare`);
				continue;
			}
			const out = await compileFigure(figure.code, { tikzLibraries: TIKZ_LIBRARIES });
			if (!bucketReady) {
				const { data: bucket } = await db.storage.getBucket(FIGURE_BUCKET);
				if (!bucket) {
					const { error } = await db.storage.createBucket(FIGURE_BUCKET, { public: true, allowedMimeTypes: ['image/svg+xml'], fileSizeLimit: '1MB' });
					if (error) throw new Error(`bucket ${FIGURE_BUCKET}: ${error.message}`);
				}
				bucketReady = true;
			}
			const { error } = await db.storage
				.from(FIGURE_BUCKET)
				.upload(file, Buffer.from(out.svg), { contentType: 'image/svg+xml', cacheControl: '31536000', upsert: true });
			if (error) {
				errors++;
				console.log(`ERRORE figura ${file}: ${error.message}`);
				continue;
			}
			md = md.replace(m[0], '```tikz\n' + serializeFigure({ ...figure, svg: { file, width: out.width, height: out.height } }) + '```');
			changed = true;
			console.log(`figura ${file} ${out.width}x${out.height}, ${(out.svg.length / 1024).toFixed(1)} KB`);
		}
		if (changed) writeFileSync(path, md);
	}
	return errors;
}

if ((await prepareFigures()) > 0) {
	console.log('\nFigure con errori: nessuna lezione scritta.');
	process.exit(1);
}

type Column = 'theory' | 'formulary' | 'flashcards';
type Value = string | Flashcard[] | null;

/** Where each column's source lives, where its last published copy goes, and how the file becomes the stored value. */
const COLUMNS: { column: Column; source: string; published: string; baseline: (name: string) => Value; value: (text: string, name: string) => Value }[] = [
	{ column: 'theory', source: 'riscritte', published: 'pubblicate', baseline: (name) => (existsSync(`${dir}/originali/${name}`) ? readFileSync(`${dir}/originali/${name}`, 'utf8') : null), value: (text) => text },
	{ column: 'formulary', source: 'formulari', published: 'pubblicate/formulari', baseline: () => null, value: (text) => text },
	{
		column: 'flashcards',
		source: 'flashcard',
		published: 'pubblicate/flashcard',
		baseline: () => null,
		value: (text, name) => {
			const { cards, errors } = parseFlashcards(text);
			if (errors.length) throw new Error(`flashcard/${name}: ${errors.join('; ')}`);
			return cards;
		}
	}
];

/** Stored values compared by content: jsonb does not keep key order. */
const same = (a: unknown, b: unknown) => {
	const norm = (v: unknown) => (Array.isArray(v) ? JSON.stringify(v.map((c) => [c.id, c.front, c.back])) : v ?? null);
	return norm(a) === norm(b);
};

// Every flashcard file must parse before anything is written.
const parseErrors = entries.flatMap(({ name }) => {
	const path = `${dir}/flashcard/${name}`;
	return existsSync(path) ? parseFlashcards(readFileSync(path, 'utf8')).errors.map((e) => `flashcard/${name}: ${e}`) : [];
});
if (parseErrors.length) {
	parseErrors.forEach((e) => console.log(`ERRORE ${e}`));
	console.log('\nFlashcard con errori: niente scritto.');
	process.exit(1);
}

let failed = 0;
let written = 0;
for (const row of entries) {
	const { name } = row;
	const { data, error } = await db.from('content_nodes').select('theory,formulary,flashcards').eq('id', row.id).single();
	if (error) {
		failed++;
		console.log(`ERRORE ${name}: ${error.message}`);
		continue;
	}
	for (const { column, source, published, baseline, value } of COLUMNS) {
		const label = `${column.padEnd(10)} ${name}`;
		const sourcePath = `${dir}/${source}/${name}`;
		if (!existsSync(sourcePath)) {
			console.log(`salto   ${label}: nessun file in ${source}/`);
			continue;
		}
		const text = readFileSync(sourcePath, 'utf8');
		const next = value(text, name);
		const last = `${dir}/${published}/${name}`;
		const saved = existsSync(last) ? value(readFileSync(last, 'utf8'), name) : baseline(name);
		const current = data[column] as Value;
		if (same(current, next)) console.log(`uguale  ${label}: già pubblicato`);
		else if (!same(current, saved)) {
			failed++;
			console.log(`SALTO   ${label}: nel database il contenuto è cambiato dopo l'ultima pubblicazione, non lo sovrascrivo`);
		} else if (!apply) console.log(`pronto  ${label}`);
		else {
			const { error: e } = await db.from('content_nodes').update({ [column]: next, updated_at: new Date().toISOString() }).eq('id', row.id);
			const { data: check } = await db.from('content_nodes').select(column).eq('id', row.id).single();
			if (e || !same((check as Record<string, unknown> | null)?.[column], next)) {
				failed++;
				console.log(`ERRORE  ${label}: ${e?.message ?? 'il contenuto riletto non coincide'}`);
			} else {
				mkdirSync(`${dir}/${published}`, { recursive: true });
				writeFileSync(last, text);
				written++;
				console.log(`scritto ${label}`);
			}
		}
	}
}
console.log(apply ? '' : '\nProva senza scrivere. Per pubblicare: --apply');
if (written) await revalidateSite();
process.exitCode = failed ? 1 : 0;
