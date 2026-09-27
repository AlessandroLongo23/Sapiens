import { Rational, ZERO, q } from '@/lib/exercises/v2/rational';
import type { Plot } from './cartesiano';
import { TOO_BIG, approxText, coordFmt, readCoord, squareTex, type Fmt } from './circonferenza';
import { shown, sqrt, val, type Val } from './geometria';
import { fail, type Outcome, type Step } from './types';

/**
 * The area of a polygon from the coordinates of its vertices, with the shoelace formula (formula dell'area di Gauss,
 * "del laccio"): the cross products x_i·y_{i+1} − x_{i+1}·y_i of each side, added, halved and taken without sign. The
 * perimeter is the sum of the sides, each from the distance formula, kept exact as a sum of radicals.
 *
 * The vertices must be in order around the polygon, clockwise or not; sides that cross are refused, because there the
 * formula gives a number that is not the area. Coordinates are exact rationals, written as in circonferenza.ts.
 */

export interface Vertex {
	x: string;
	y: string;
}

export interface PolygonResult {
	outcome: Outcome;
	plot: Plot | null;
	check?: { area: number; perimeter: number; sum: number };
}

const failed = (error: string): PolygonResult => ({ outcome: fail(error), plot: null });

export const MAX_VERTICES = 12;
const NAMES = 'ABCDEFGHIJKL';
const num = (r: Rational) => r.num / r.den;

type Pt = [Rational, Rational];

/** Whether the segments pq and rs meet (touching counts), in floating point: only to refuse crossing sides. */
function meet(p: number[], p2: number[], r: number[], r2: number[]): boolean {
	const scale = Math.max(1, ...[p, p2, r, r2].flat().map(Math.abs));
	const eps = 1e-12 * scale * scale;
	const orient = (a: number[], b: number[], c: number[]) => {
		const v = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
		return Math.abs(v) <= eps ? 0 : Math.sign(v);
	};
	const on = (a: number[], b: number[], c: number[]) => Math.min(a[0], b[0]) - 1e-12 * scale <= c[0] && c[0] <= Math.max(a[0], b[0]) + 1e-12 * scale && Math.min(a[1], b[1]) - 1e-12 * scale <= c[1] && c[1] <= Math.max(a[1], b[1]) + 1e-12 * scale;
	const [o1, o2, o3, o4] = [orient(p, p2, r), orient(p, p2, r2), orient(r, r2, p), orient(r, r2, p2)];
	if (o1 * o2 < 0 && o3 * o4 < 0) return true;
	if (o1 === 0 && on(p, p2, r)) return true;
	if (o2 === 0 && on(p, p2, r2)) return true;
	if (o3 === 0 && on(r, r2, p)) return true;
	if (o4 === 0 && on(r, r2, p2)) return true;
	return false;
}

/** "a \cdot b", with a negative second factor in brackets. */
const times = (f: Fmt, a: Rational, b: Rational) => `${f.n(a)} \\cdot ${f.p(b)}`;

/** A sum of signed terms: "-5 + 16 - 3". */
function signedSum(f: Fmt, terms: Rational[]): string {
	return terms.map((t, i) => (i === 0 ? f.n(t) : ` ${t.sign() < 0 ? '-' : '+'} ${f.n(t.abs())}`)).join('');
}

export function areaPoligono(input: Vertex[]): PolygonResult {
	const rows = input.filter((v) => (v.x ?? '').trim() || (v.y ?? '').trim());
	if (rows.length < 3) return failed('Servono almeno tre vertici, per esempio A(0, 0), B(4, 0) e C(0, 3).');
	if (rows.length > MAX_VERTICES) return failed(`Usa al massimo ${MAX_VERTICES} vertici.`);
	const pts: Pt[] = [];
	for (const [i, v] of rows.entries()) {
		const name = NAMES[i];
		const x = readCoord(v.x, `l'ascissa di ${name}`, '2');
		if (typeof x === 'string') return failed(x);
		const y = readCoord(v.y, `l'ordinata di ${name}`, '3');
		if (typeof y === 'string') return failed(y);
		pts.push([x, y]);
	}
	const n = pts.length;
	for (let i = 0; i < n; i++) {
		const [a, b] = [pts[i], pts[(i + 1) % n]];
		if (a[0].equals(b[0]) && a[1].equals(b[1])) return failed(`I vertici ${NAMES[i]} e ${NAMES[(i + 1) % n]} coincidono: togli il doppione.`);
	}
	const fl = pts.map(([x, y]) => [num(x), num(y)]);
	const [x0, y0] = fl[0];
	const far = fl.reduce((b, p) => (Math.hypot(p[0] - x0, p[1] - y0) > Math.hypot(b[0] - x0, b[1] - y0) ? p : b), fl[0]);
	const scale = Math.max(1, ...fl.flat().map(Math.abs));
	if (fl.every((p) => Math.abs((far[0] - x0) * (p[1] - y0) - (far[1] - y0) * (p[0] - x0)) <= 1e-12 * scale * scale))
		return failed('I vertici stanno tutti su una retta: non formano un poligono. Controlla le coordinate.');
	for (let i = 0; i < n; i++)
		for (let j = i + 1; j < n; j++) {
			// Neighbouring sides share a vertex; they may still overlap when they fold back on each other.
			const adjacent = j === i + 1 || (i === 0 && j === n - 1);
			const [p, p2, r, r2] = [fl[i], fl[(i + 1) % n], fl[j], fl[(j + 1) % n]];
			if (adjacent) {
				const [s, o, t] = j === i + 1 ? [p, p2, r2] : [r, p, p2];
				// s-o-t: the side back from o must not run along the side forward from o.
				const cross = (o[0] - s[0]) * (t[1] - o[1]) - (o[1] - s[1]) * (t[0] - o[0]);
				const dot = (o[0] - s[0]) * (t[0] - o[0]) + (o[1] - s[1]) * (t[1] - o[1]);
				if (Math.abs(cross) <= 1e-12 * Math.max(1, Math.abs(dot)) && dot < 0) return failed('Due lati vicini tornano indietro uno sull’altro: controlla l’ordine dei vertici.');
				continue;
			}
			if (meet(p, p2, r, r2)) return failed(`I lati ${NAMES[i]}${NAMES[(i + 1) % n]} e ${NAMES[j]}${NAMES[(j + 1) % n]} si incrociano. Scrivi i vertici nell'ordine in cui li incontri girando intorno al poligono.`);
		}
	const f = coordFmt(rows.flatMap((v) => [v.x, v.y]));
	try {
		return solve(pts, f);
	} catch {
		return failed(TOO_BIG);
	}
}

function solve(pts: Pt[], f: Fmt): PolygonResult {
	const n = pts.length;
	const name = (i: number) => NAMES[i % n];
	const side = (i: number) => `${name(i)}${name(i + 1)}`;
	const steps: Step[] = [];

	// The area.
	steps.push({
		group: "L'area con la formula di Gauss",
		say: 'Scrivi i vertici in ordine e ripeti il primo in fondo.',
		table: { head: ['Vertice', '$x$', '$y$'], rows: [...pts, pts[0]].map(([x, y], i) => [name(i), `$${f.n(x)}$`, `$${f.n(y)}$`]) }
	});
	const diffs: Rational[] = [];
	const crossRows: string[][] = [];
	for (let i = 0; i < n; i++) {
		const [[x1, y1], [x2, y2]] = [pts[i], pts[(i + 1) % n]];
		const [p1, p2] = [x1.mul(y2), x2.mul(y1)];
		const d = p1.sub(p2);
		diffs.push(d);
		crossRows.push([side(i), `$${times(f, x1, y2)} = ${f.n(p1)}$`, `$${times(f, x2, y1)} = ${f.n(p2)}$`, `$${f.n(p1)} - ${f.p(p2)} = \\hl{${f.n(d)}}$`]);
	}
	steps.push({
		say: 'Per ogni lato moltiplica in croce le coordinate dei due vertici.',
		table: { head: ['Lato', '$x_1 \\cdot y_2$', '$x_2 \\cdot y_1$', 'Differenza'], rows: crossRows },
		then: 'Il pedice $1$ indica il primo vertice del lato, il pedice $2$ il secondo.'
	});
	const S = diffs.reduce((s, d) => s.add(d), ZERO);
	steps.push({ say: 'Somma le differenze.', math: [`S = ${signedSum(f, diffs)}`, `= \\hl{${f.n(S)}}`] });
	if (S.isZero()) return failed('La somma viene zero: controlla le coordinate e l’ordine dei vertici.');
	const area = S.abs().div(q(2));
	const areaLines = ['A = \\dfrac{|S|}{2}', `= \\dfrac{|${f.n(S)}|}{2}`];
	if (S.sign() < 0) areaLines.push(`= \\dfrac{${f.n(S.abs())}}{2}`);
	areaLines.push(`= \\hl{${f.n(area)}}`);
	if (f.tall(area)) {
		const e = shown(val(area));
		areaLines.push(e.approx ? `\\approx ${e.approx.tex}` : `= ${e.exact!.tex}`);
	}
	steps.push({
		say: "L'area è la metà della somma, presa senza segno.",
		math: areaLines,
		then: S.sign() > 0 ? 'La somma è positiva: hai scritto i vertici in senso antiorario.' : 'La somma è negativa: hai scritto i vertici in senso orario. Il valore assoluto toglie il segno.'
	});

	// The perimeter: each side exact, then the sum grouped by radical.
	const lengths: Val[] = [];
	const sideRows: string[][] = [];
	for (let i = 0; i < n; i++) {
		const [[x1, y1], [x2, y2]] = [pts[i], pts[(i + 1) % n]];
		const [dx, dy] = [x2.sub(x1), y2.sub(y1)];
		const R = dx.mul(dx).add(dy.mul(dy));
		const L = sqrt(val(R));
		lengths.push(L);
		const s = shown(L);
		const value = s.exact ? `${s.exact.tex}${s.approx ? ` \\approx ${s.approx.tex}` : ''}` : `\\approx ${s.approx!.tex}`;
		sideRows.push([side(i), `$\\sqrt{${squareTex(f, dx)} + ${squareTex(f, dy)}} = \\sqrt{${f.n(R)}}$`, `$${value}$`]);
	}
	steps.push({
		group: 'Il perimetro',
		say: 'Calcola ogni lato con la formula della distanza tra due punti.',
		table: { head: ['Lato', 'Calcolo', 'Lunghezza'], rows: sideRows }
	});
	const per = perimeter(lengths);
	steps.push({ say: 'Somma le lunghezze dei lati.', math: per.lines });

	// A fraction gets its decimal beside it: 57/2 = 28,5, or 7/3 ≈ 2,33.
	const areaShown = shown(val(area));
	const areaTail = !f.tall(area) ? null : areaShown.approx ? { rel: '\\approx', ...areaShown.approx } : { rel: '=', ...areaShown.exact! };
	const plot: Plot = {
		points: pts.map(([x, y], i) => ({ name: name(i), x: num(x), y: num(y) })),
		segments: pts.map(([x, y], i) => ({ from: [num(x), num(y)] as [number, number], to: [num(pts[(i + 1) % n][0]), num(pts[(i + 1) % n][1])] as [number, number], main: true })),
		lines: [],
		equal: true
	};
	return {
		outcome: {
			ok: true,
			rows: [
				{ label: 'Area del poligono', value: `$A = ${f.n(area)}$${areaTail ? ` $${areaTail.rel} ${areaTail.tex}$` : ''}` },
				{ label: 'Perimetro', value: per.row }
			],
			copy: `A = ${f.t(area)}${areaTail ? ` ${areaTail.rel === '=' ? '=' : '≈'} ${areaTail.text}` : ''}; 2p ${per.copy}`,
			steps
		},
		plot,
		check: { area: num(area), perimeter: per.x, sum: num(S) }
	};
}

/** The sum of the sides: like radicals added (3√2 + √2 = 4√2), whole numbers first, then the radicals by radicand. */
function perimeter(lengths: Val[]): { lines: string[]; row: string; copy: string; x: number } {
	const x = lengths.reduce((s, l) => s + l.x, 0);
	const ap = approxText(x);
	const first = `2p = ${lengths.map((l) => shown(l).exact?.tex ?? shown(l).approx!.tex).join(' + ')}`;
	if (lengths.some((l) => !l.c)) return { lines: [first, `\\approx \\hl{${ap.tex}}`], row: `$2p \\approx ${ap.tex}$`, copy: `≈ ${ap.text}`, x };
	const byRoot = new Map<number, Rational>();
	for (const l of lengths) byRoot.set(l.r, (byRoot.get(l.r) ?? ZERO).add(l.c!));
	const terms = [...byRoot.entries()].sort((a, b) => a[0] - b[0]).map(([r, c]): Val => ({ c, r, pi: 0, x: (c.num / c.den) * Math.sqrt(r) }));
	const exact = terms.map((t) => shown(t).exact!);
	const tex = exact.map((e) => e.tex).join(' + ');
	const text = exact.map((e) => e.text).join(' + ');
	// A single whole or terminating value needs no decimal beside it.
	const plain = terms.length === 1 && terms[0].r === 1 && !shown(terms[0]).approx;
	const lines = [first];
	if (tex !== first.slice(5)) lines.push(`= \\hl{${tex}}`);
	else lines[0] = `2p = \\hl{${tex}}`;
	if (!plain) lines.push(`\\approx ${ap.tex}`);
	return { lines, row: `$2p = ${tex}$${plain ? '' : ` $\\approx ${ap.tex}$`}`, copy: plain ? `= ${text}` : `= ${text} ≈ ${ap.text}`, x };
}
