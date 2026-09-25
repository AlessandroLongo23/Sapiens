/**
 * Checks docs/lezioni/prerequisiti.md against docs/lezioni/albero.md and prints the floors of the
 * prerequisite DAG (a lesson's floor is the longest chain of prerequisites below it).
 *
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/prerequisiti.mts
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/prerequisiti.mts --json > grafo.json
 *
 * Errors (exit 1): unknown slug, lesson listed twice, self edge, cycle, more than 4 direct
 * prerequisites. Warnings: redundant edges (implied by another path), prerequisites that come later
 * in the tree order, lessons of a covered year with no line.
 */
import { readFileSync, readdirSync } from 'node:fs';

type Lesson = { slug: string; title: string; chapter: string; year: number; order: number };

const lessons = new Map<string, Lesson>();
let year = 0, chapter = '', order = 0;
for (const line of readFileSync('docs/lezioni/albero.md', 'utf8').split('\n')) {
	const y = line.match(/^# (Primo|Secondo|Terzo|Quarto|Quinto) anno/);
	if (y) year = ['Primo', 'Secondo', 'Terzo', 'Quarto', 'Quinto'].indexOf(y[1]) + 1;
	const c = line.match(/^## [a-z0-9-]+ \| (.+)$/);
	if (c) chapter = c[1].trim();
	const l = line.match(/^- ([a-z0-9-]+) \| (.+)$/);
	if (l) lessons.set(l[1], { slug: l[1], title: l[2].trim(), chapter, year, order: order++ });
}

const written = new Set(readdirSync('docs/lezioni/pubblicate').filter((f) => f.endsWith('.md')).map((f) => f.replace(/^\d+-/, '').replace(/\.md$/, '')));

const errors: string[] = [];
const warnings: string[] = [];
const prereqs = new Map<string, string[]>();
for (const [i, line] of readFileSync('docs/lezioni/prerequisiti.md', 'utf8').split('\n').entries()) {
	const m = line.match(/^([a-z0-9-]+) <-(.*)$/);
	if (!m) continue;
	const [, slug, rest] = m;
	const list = rest.split(',').map((s) => s.trim()).filter(Boolean);
	if (prereqs.has(slug)) errors.push(`riga ${i + 1}: ${slug} compare due volte`);
	for (const s of [slug, ...list]) if (!lessons.has(s)) errors.push(`riga ${i + 1}: lezione sconosciuta ${s}`);
	if (list.includes(slug)) errors.push(`riga ${i + 1}: ${slug} è prerequisito di sé stessa`);
	if (list.length > 4) errors.push(`riga ${i + 1}: ${slug} ha ${list.length} prerequisiti diretti (massimo 4)`);
	prereqs.set(slug, list);
}

// Cycles, by depth-first search; also gives a topological order.
const state = new Map<string, 'open' | 'done'>();
const topo: string[] = [];
function visit(s: string, path: string[]) {
	if (state.get(s) === 'done') return;
	if (state.get(s) === 'open') {
		errors.push(`ciclo: ${[...path.slice(path.indexOf(s)), s].join(' <- ')}`);
		return;
	}
	state.set(s, 'open');
	for (const p of prereqs.get(s) ?? []) visit(p, [...path, s]);
	state.set(s, 'done');
	topo.push(s);
}
for (const s of prereqs.keys()) visit(s, []);

if (errors.length) {
	console.error(errors.join('\n'));
	process.exit(1);
}

// Ancestors of every lesson, in topological order so prerequisites are ready first.
const ancestors = new Map<string, Set<string>>();
for (const s of topo) {
	const set = new Set<string>();
	for (const p of prereqs.get(s) ?? []) {
		set.add(p);
		for (const a of ancestors.get(p) ?? []) set.add(a);
	}
	ancestors.set(s, set);
}

for (const [s, list] of prereqs) {
	for (const p of list) {
		const via = list.find((q) => q !== p && ancestors.get(q)?.has(p));
		if (via) warnings.push(`arco ridondante: ${s} <- ${p} (ci si arriva da ${via})`);
		if (lessons.get(p)!.order > lessons.get(s)!.order) warnings.push(`ordine: ${s} (${lessons.get(s)!.chapter}) viene prima del suo prerequisito ${p} (${lessons.get(p)!.chapter})`);
	}
}
const years = new Set([...prereqs.keys()].map((s) => lessons.get(s)!.year));
for (const l of lessons.values()) if (years.has(l.year) && !prereqs.has(l.slug) && l.year === 1) warnings.push(`senza riga: ${l.slug}`);
const missing = new Set([...prereqs.values()].flat().filter((p) => !prereqs.has(p)));
for (const p of missing) warnings.push(`prerequisito senza riga (fuori dall'anno coperto): ${p}`);

// Floor = longest chain below the lesson.
const floor = new Map<string, number>();
for (const s of topo) floor.set(s, Math.max(-1, ...(prereqs.get(s) ?? []).map((p) => floor.get(p) ?? 0)) + 1);

if (process.argv.includes('--json')) {
	const nodes = [...new Set([...prereqs.keys(), ...missing])].map((s) => {
		const l = lessons.get(s)!;
		return { slug: s, title: l.title, chapter: l.chapter, year: l.year, written: written.has(s), floor: floor.get(s) ?? 0, prereqs: prereqs.get(s) ?? [], declared: prereqs.has(s) };
	});
	console.log(JSON.stringify(nodes, null, '\t'));
} else {
	const byFloor = new Map<number, string[]>();
	for (const [s, f] of floor) byFloor.set(f, [...(byFloor.get(f) ?? []), s]);
	for (const f of [...byFloor.keys()].sort((a, b) => a - b)) {
		console.log(`piano ${f}: ${byFloor.get(f)!.map((s) => (written.has(s) ? `${s}*` : s)).join(', ')}`);
	}
	console.log(`\n${prereqs.size} lezioni, ${[...prereqs.values()].flat().length} archi, ${Math.max(...floor.values()) + 1} piani (* = scritta)`);
	if (warnings.length) console.log(`\nAvvisi:\n${warnings.join('\n')}`);
}
