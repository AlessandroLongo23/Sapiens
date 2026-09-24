import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * The WYSIWYG is ~450 KB of ProseMirror behind a dynamic import, and it only
 * stays there while nothing outside the editor reaches for it. One stray import
 * from a shared module folds it into what every page loads, and nothing else in
 * the build says a word.
 *
 * This is checked in the source rather than in the bundle: the App Router build
 * manifest under Turbopack lists framework chunks only, so there is nothing
 * there to tell a page's own JS from the shared entry. The import graph is the
 * invariant anyway, and it is the thing a reviewer can act on.
 */

/** Only these may pull the editor in; everything else goes through the dynamic import in NoteEditor. */
const ALLOWED = new Set([
	'src/components/zaino/SimpleEditor.tsx',
	'src/components/zaino/MathPopover.tsx',
	'src/lib/zaino/extensions.ts',
	'src/lib/zaino/math.ts',
	'src/lib/zaino/raw-block.ts'
]);

const HEAVY = /from\s+['"](@tiptap\/[^'"]+|@\/lib\/zaino\/(extensions|math|raw-block))['"]/;

function walk(dir) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return walk(path);
		return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
	});
}

const offenders = walk('src')
	.map((path) => ({ path: relative('.', path), source: readFileSync(path, 'utf8') }))
	.filter(({ path, source }) => !ALLOWED.has(path) && HEAVY.test(source))
	.map(({ path, source }) => `${path} → ${source.match(HEAVY)?.[1]}`);

if (offenders.length > 0) {
	console.error('check-bundle: the editor is imported outside its dynamic boundary:');
	for (const line of offenders) console.error(`  ${line}`);
	console.error('These land in the shared bundle. Import them from SimpleEditor.tsx, which NoteEditor loads with next/dynamic.');
	process.exit(1);
}

// Second signal: the compiled editor must not be one of the chunks the app boots with.
const CHUNKS = '.next/static/chunks';
if (existsSync(CHUNKS) && existsSync('.next/build-manifest.json')) {
	const files = readdirSync(CHUNKS, { recursive: true }).filter((f) => String(f).endsWith('.js'));
	const heavy = files.filter((f) => readFileSync(join(CHUNKS, String(f)), 'utf8').includes('prosemirror'));
	if (heavy.length === 0) {
		console.error('check-bundle: no chunk contains ProseMirror — has the editor stopped shipping?');
		process.exit(1);
	}
	const boot = new Set(
		(JSON.parse(readFileSync('.next/build-manifest.json', 'utf8')).rootMainFiles ?? []).map((f) => String(f).split('/').pop())
	);
	const inBoot = heavy.map((f) => String(f).split('/').pop()).filter((name) => boot.has(name));
	if (inBoot.length > 0) {
		console.error(`check-bundle: ProseMirror is in the boot chunks (${inBoot.join(', ')}).`);
		process.exit(1);
	}
	const kb = Math.round(heavy.reduce((total, f) => total + readFileSync(join(CHUNKS, String(f))).length, 0) / 1024);
	console.log(`check-bundle: no import outside the editor; ProseMirror stays in ${heavy.length} lazy chunk(s), ${kb}KB`);
} else {
	console.log('check-bundle: no import outside the editor (no build output to cross-check)');
}
