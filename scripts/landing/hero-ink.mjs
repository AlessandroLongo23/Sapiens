/**
 * The handwriting of the home page sketch, as pen strokes.
 *
 * Hershey Script 1 is a single-stroke font: every glyph is a polyline, so a
 * formula can be written stroke by stroke with `stroke-dashoffset` instead of
 * fading in. This script lays out the few formulas of the sketch (superscripts,
 * subscripts, fractions, and Δ, ± and A drawn by hand where the font falls short) and writes them to
 * src/components/landing/hero-ink.ts as one path per stroke with its length.
 *
 *   cd scripts/landing && npm i && node hero-ink.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const FONT = join(dirname(require.resolve('hersheytext/package.json')), 'svg_fonts/HersheyScript1.svg');
const OUT = join(dirname(fileURLToPath(import.meta.url)), '../../src/components/landing/hero-ink.ts');

/** The formulas: id → [source, size in viewBox units]. The ids are what the sketch asks for. */
const FORMULAS = {
	'math.eq': ['x^{2} – 2x – 3 = 0', 34],
	'math.delta': ['\\D = 4 + 12 = 16', 26],
	'math.roots': ['x = \\frac{2 ± 4}{2}', 26],
	'math.x1': ['x_{1} = –1', 26],
	'math.x2': ['x_{2} = 3', 26],
	'math.ax.x': ['x', 26],
	'math.ax.y': ['y', 26],
	'phys.eq': ['y = v_{0y} t – ½ g t^{2}', 34],
	'phys.w1': ['nel punto', 26],
	'phys.w2': ['più alto', 26],
	'phys.vy': ['v_{y} = 0', 26],
	'phys.range': ['gittata = 8 m', 26],
	'phys.ax.x': ['x', 26],
	'phys.ax.y': ['y', 26],
	'chem.eq': ['[A] = [A]_{0} e^{–kt}', 34],
	'chem.half': ['t_{½} = \\frac{ln 2}{k}', 26],
	'chem.w1': ['ogni t_{½}', 26],
	'chem.w2': ['si dimezza', 26],
	'chem.ax.x': ['t', 26],
	'chem.ax.y': ['[A]', 22]
};

// ---------------------------------------------------------------------------
// Font: glyph polylines in font units (1000 per em, y up).
const ent = (s) => s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
const src = readFileSync(FONT, 'utf8');
const DEFAULT_ADV = +src.match(/<font [^>]*horiz-adv-x="([\d.]+)"/)[1];
const glyphs = new Map();
for (const m of src.matchAll(/<glyph ([^>]*)\/>/g)) {
	const a = Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map((x) => [x[1], x[2]]));
	if (a.unicode == null) continue;
	const strokes = (a.d || '')
		.split('M')
		.map((s) => s.trim())
		.filter(Boolean)
		.map((s) => s.split('L').map((p) => p.trim().split(/\s+/).map(Number)));
	glyphs.set(ent(a.unicode), { adv: +(a['horiz-adv-x'] ?? DEFAULT_ADV), strokes });
}
// Δ is not in the font: a triangle written in one stroke, slightly open at the top like a hand does.
glyphs.set('Δ', { adv: 620, strokes: [[[300, 520], [60, 0], [560, 0], [320, 540]]] });
// The font's capital A is a looped script letter that reads as a delta in [A]; a hand-printed A, slanted like the script.
glyphs.set('A', { adv: 660, strokes: [[[40, 0], [390, 580], [560, 10]], [[170, 230], [500, 250]]] });
// The font's ± reads as "+-"; a plus over a bar, as written by hand.
glyphs.set('±', { adv: 640, strokes: [[[320, 520], [320, 160]], [[120, 340], [520, 340]], [[120, 40], [520, 40]]] });

// ---------------------------------------------------------------------------
// Layout: a tiny subset of TeX. Returns strokes in em units (x right, y down, baseline at 0).
function parse(s) {
	const out = [];
	let i = 0;
	const group = () => {
		if (s[i] !== '{') return s[i++];
		let depth = 0, j = i;
		for (; j < s.length; j++) {
			if (s[j] === '{') depth++;
			if (s[j] === '}' && --depth === 0) break;
		}
		const inner = s.slice(i + 1, j);
		i = j + 1;
		return inner;
	};
	while (i < s.length) {
		const c = s[i];
		if (c === '^' || c === '_') {
			i++;
			out.push({ kind: c === '^' ? 'sup' : 'sub', body: parse(group()) });
		} else if (s.startsWith('\\frac', i)) {
			i += 5;
			const num = parse(group());
			const den = parse(group());
			out.push({ kind: 'frac', num, den });
		} else if (s.startsWith('\\D', i)) {
			i += 2;
			out.push({ kind: 'char', ch: 'Δ' });
		} else {
			out.push({ kind: 'char', ch: c });
			i++;
		}
	}
	return out;
}

/** Lays out `nodes` at scale `k` (em); returns { strokes, width }. */
function layout(nodes, k = 1) {
	const strokes = [];
	let x = 0;
	for (const n of nodes) {
		if (n.kind === 'char') {
			const g = glyphs.get(n.ch);
			if (!g) throw new Error(`glyph missing: ${n.ch}`);
			for (const st of g.strokes) strokes.push(st.map(([gx, gy]) => [x + (gx / 1000) * k, (-gy / 1000) * k]));
			x += (g.adv / 1000) * k;
		} else if (n.kind === 'sup' || n.kind === 'sub') {
			const inner = layout(n.body, k * 0.62);
			const dy = n.kind === 'sup' ? -0.36 * k : 0.14 * k;
			for (const st of inner.strokes) strokes.push(st.map(([px, py]) => [x + px, py + dy]));
			x += inner.width + 0.04 * k;
		} else if (n.kind === 'frac') {
			const num = layout(n.num, k * 0.78);
			const den = layout(n.den, k * 0.78);
			const w = Math.max(num.width, den.width) + 0.3 * k;
			const bar = -0.17 * k;
			for (const st of num.strokes) strokes.push(st.map(([px, py]) => [x + (w - num.width) / 2 + px, py + bar - 0.14 * k]));
			// The bar goes between numerator and denominator, as a hand writes it.
			strokes.push([[x, bar], [x + w, bar - 0.01 * k]]);
			for (const st of den.strokes) strokes.push(st.map(([px, py]) => [x + (w - den.width) / 2 + px, py + bar + 0.52 * k]));
			x += w + 0.06 * k;
		}
	}
	return { strokes, width: x };
}

const r1 = (v) => Math.round(v * 10) / 10;
const lengthOf = (pts) => pts.slice(1).reduce((sum, p, j) => sum + Math.hypot(p[0] - pts[j][0], p[1] - pts[j][1]), 0);

const entries = [];
for (const [id, [source, size]] of Object.entries(FORMULAS)) {
	const { strokes, width } = layout(parse(source));
	const paths = strokes
		.map((st) => st.map(([px, py]) => [r1(px * size), r1(py * size)]))
		.filter((st) => lengthOf(st) > 0)
		.map((st) => [`M${st.map((p) => p.join(' ')).join('L')}`, r1(lengthOf(st))]);
	entries.push(`\t'${id}': { w: ${r1(width * size)}, s: ${JSON.stringify(paths)} }`);
}

writeFileSync(
	OUT,
	`// Generated by scripts/landing/hero-ink.mjs from Hershey Script 1 (public domain). Do not edit by hand.

/** A formula written in pen: its width and its strokes, each a path (baseline at y = 0) and its length. */
export interface Ink {
	w: number;
	s: [d: string, length: number][];
}

export const INK: Record<string, Ink> = {
${entries.join(',\n')}
};
`
);
console.log(`wrote ${entries.length} formulas to ${OUT}`);
