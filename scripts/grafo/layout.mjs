/**
 * Lays out the prerequisite graph of docs/lezioni/prerequisiti.md as a skill tree, bottom-up.
 *
 *   node scripts/grafo/layout.mjs                       # writes docs/lezioni/prerequisiti-layout.json
 *   node scripts/grafo/layout.mjs --html albero.html    # also writes a preview page
 *
 * The first time: `npm install` in scripts/grafo. The graph comes from
 * scripts/lezioni/prerequisiti.mts --json, so a graph that fails its checks is not laid out.
 *
 * ELK's layered algorithm with network-simplex layering: layers are not fixed at the longest
 * prerequisite chain, so a lesson sits near the lessons that use it. Crossing minimisation depends
 * on the node order and the random seed, so several are tried and the layout with the fewest drawn
 * crossings (then the narrowest) is kept. Edges are orthogonal, on the squared-paper grid.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import ELK from 'elkjs/lib/elk.bundled.js';

const W = 132, H = 44;
const SEEDS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

// Lessons of a strand stay next to each other in the model order.
const STRANDS = [
	['Insiemi e logica'],
	['Relazioni e funzioni'],
	['Numeri naturali \\mathbb{N}', 'Numeri interi \\mathbb{Z}', 'Numeri razionali \\mathbb{Q}', 'Numeri reali e radicali'],
	['Monomi e polinomi', 'Scomposizione in fattori', 'Frazioni algebriche', 'Equazioni di primo grado', 'Disequazioni di primo grado', 'Equazioni di secondo grado'],
	['Statistica'],
	['Geometria del piano: triangoli e quadrilateri'],
];

const graph = JSON.parse(execFileSync('node', ['node_modules/jiti/lib/jiti-cli.mjs', 'scripts/lezioni/prerequisiti.mts', '--json'], { encoding: 'utf8' }));
const strand = (chapter) => { const i = STRANDS.findIndex((c) => c.includes(chapter)); return i < 0 ? STRANDS.length : i; };
const nodes = [...graph].sort((a, b) => strand(a.chapter) - strand(b.chapter) || graph.indexOf(a) - graph.indexOf(b));
const edges = nodes.flatMap((n) => n.prereqs.map((p) => ({ from: p, to: n.slug })));

const segments = (pts) => pts.slice(1).map((p, i) => [pts[i], p]);
function crosses([a, b], [c, d]) {
	const o = (p, q, r) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x));
	return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
}
function countCrossings(routes) {
	let n = 0;
	for (let i = 0; i < routes.length; i++) for (let j = i + 1; j < routes.length; j++) {
		const [e, f] = [routes[i], routes[j]];
		if (e.from === f.from || e.to === f.to) continue;
		if (segments(e.pts).some((s) => segments(f.pts).some((t) => crosses(s, t)))) n++;
	}
	return n;
}

const elk = new ELK();
let best;
for (const seed of SEEDS) for (const order of ['NONE', 'NODES_AND_EDGES']) {
	const g = await elk.layout({
		id: 'root',
		layoutOptions: {
			'elk.algorithm': 'layered', 'elk.direction': 'UP', 'elk.edgeRouting': 'ORTHOGONAL',
			'elk.spacing.nodeNode': '22', 'elk.layered.spacing.nodeNodeBetweenLayers': '66',
			'elk.spacing.edgeEdge': '8', 'elk.layered.spacing.edgeEdgeBetweenLayers': '8', 'elk.layered.spacing.edgeNodeBetweenLayers': '14',
			'elk.layered.layering.strategy': 'NETWORK_SIMPLEX', 'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
			'elk.layered.considerModelOrder.strategy': order, 'elk.layered.thoroughness': '100', 'elk.randomSeed': String(seed),
			'elk.padding': '[top=22,left=22,bottom=22,right=22]',
		},
		children: nodes.map((n) => ({ id: n.slug, width: W, height: H })),
		edges: edges.map((e, i) => ({ id: `e${i}`, sources: [e.from], targets: [e.to] })),
	});
	const routes = g.edges.map((e) => {
		const s = e.sections[0];
		return { from: e.sources[0], to: e.targets[0], pts: [s.startPoint, ...(s.bendPoints ?? []), s.endPoint] };
	});
	const crossings = countCrossings(routes);
	if (!best || crossings < best.crossings || (crossings === best.crossings && g.width < best.g.width)) best = { g, routes, crossings, seed, order };
}

const { g, routes, crossings } = best;
const round = (v) => Math.round(v * 10) / 10;
const out = {
	width: Math.round(g.width), height: Math.round(g.height), crossings, nodeWidth: W, nodeHeight: H,
	nodes: g.children.map((c) => ({ ...graph.find((n) => n.slug === c.id), x: Math.round(c.x), y: Math.round(c.y) })),
	edges: routes.map((r) => ({ from: r.from, to: r.to, pts: r.pts.map((p) => [round(p.x), round(p.y)]) })),
};
writeFileSync('docs/lezioni/prerequisiti-layout.json', JSON.stringify(out) + '\n');
console.log(`${out.nodes.length} lezioni, ${out.edges.length} archi, ${crossings} incroci, ${out.width}×${out.height} px (seme ${best.seed}, ordine ${best.order})`);

const html = process.argv.indexOf('--html');
if (html > 0) {
	const target = process.argv[html + 1];
	const page = readFileSync(new URL('./anteprima.html', import.meta.url), 'utf8').replace('__DATA__', () => JSON.stringify(out));
	writeFileSync(target, page);
	console.log(`anteprima: ${target}`);
}
