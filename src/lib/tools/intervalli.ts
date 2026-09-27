import { q, type Rational } from '@/lib/exercises/v2/rational';
import { Surd } from '@/lib/exercises/v2/surd';
import type { NumberLine } from './disequazioni';

/**
 * A set of real numbers made of intervals and isolated points, as the solutions of an inequality or of an equation
 * with an absolute value, written as in the lessons: ]2, +∞[ with the square brackets turned outwards for an excluded
 * end, unions with ∪, the whole line as ℝ. The ends are exact numbers (rationals or roots of a quadratic), so the
 * membership of every point and of every stretch between two points is known exactly.
 */

/** An end of an interval: an exact number, (a + b√r)/d. */
export type Num = Surd;

export const num = (r: Rational): Num => Surd.rational(r);

/** A rational for a caption: "−4", "7/3". */
const ratText = (r: Rational) => r.toString().replace('-', '−');

/** A number for a caption or for copying: "−4", "7/3", "1 − √2", "(3 + √5)/2". */
export function numText(s: Num): string {
	if (s.isRational()) return ratText(s.toRational());
	const k = Math.abs(s.b);
	const root = `${k === 1 ? '' : k}√${s.r}`;
	const numer = s.a === 0 ? `${s.b < 0 ? '−' : ''}${root}` : `${ratText(q(s.a))} ${s.b < 0 ? '−' : '+'} ${root}`;
	if (s.d === 1) return numer;
	return s.a === 0 ? `${numer}/${s.d}` : `(${numer})/${s.d}`;
}

/** Ascending, without repetitions. */
export function sortNums(xs: Num[]): Num[] {
	const out: Num[] = [];
	for (const x of [...xs].sort((a, b) => a.compare(b))) if (!out.length || !out[out.length - 1].equals(x)) out.push(x);
	return out;
}

/**
 * The set on the line: the points in increasing order, whether each is in the set, and whether each open stretch
 * (before the first point, between two, after the last) is in the set. `stretchIn` has one more item than `points`.
 */
export interface LineSet {
	points: Num[];
	pointIn: boolean[];
	stretchIn: boolean[];
}

export interface WrittenSet {
	/** The set: "\left] -\infty, 2 \right[ \cup \{5\}", "\mathbb{R}", "\emptyset". */
	set: string;
	/** The solutions as inequalities, a formula: "x < 2 \quad \text{oppure} \quad x = 5". */
	math: string;
	/** The same for a result row, prose with formulas: "$x < 2$ oppure $x = 5$". */
	words: string;
	/** Plain text, for copying. */
	copy: string;
	/** The sketch under the inputs. */
	line: NumberLine;
	empty: boolean;
}

interface Run {
	lo: { i: number; incl: boolean } | null;
	hi: { i: number; incl: boolean } | null;
	/** A single point. */
	point?: number;
}

/** The runs of consecutive elements of the set, reading S0, P0, S1, P1, …, Sn. */
function runs(s: LineSet): Run[] {
	const n = s.points.length;
	const inSet = (e: number) => (e % 2 === 0 ? s.stretchIn[e / 2] : s.pointIn[(e - 1) / 2]);
	const out: Run[] = [];
	let e = 0;
	while (e <= 2 * n) {
		if (!inSet(e)) {
			e++;
			continue;
		}
		const start = e;
		while (e + 1 <= 2 * n && inSet(e + 1)) e++;
		const end = e;
		e++;
		if (start === end && start % 2 === 1) {
			out.push({ lo: null, hi: null, point: (start - 1) / 2 });
			continue;
		}
		const lo = start % 2 === 1 ? { i: (start - 1) / 2, incl: true } : start === 0 ? null : { i: start / 2 - 1, incl: false };
		const hi = end % 2 === 1 ? { i: (end - 1) / 2, incl: true } : end === 2 * n ? null : { i: end / 2, incl: false };
		out.push({ lo, hi });
	}
	return out;
}

export function writeSet(s: LineSet): WrittenSet {
	const tex = s.points.map((p) => p.toLatex());
	const txt = s.points.map(numText);
	const line: NumberLine = {
		points: s.points.map((p, i) => ({ label: txt[i], inSet: s.pointIn[i] })),
		stretches: s.stretchIn,
		caption: ''
	};
	const allStretches = s.stretchIn.every(Boolean);
	if (allStretches) {
		const out = s.points.map((_, i) => i).filter((i) => !s.pointIn[i]);
		if (!out.length) {
			line.caption = 'Tutta la retta: ogni numero è una soluzione.';
			return { set: '\\mathbb{R}', math: 'x \\in \\mathbb{R}', words: 'Tutti i numeri reali', copy: 'Ogni numero reale', line, empty: false };
		}
		const set = `\\mathbb{R} \\setminus \\left\\{ ${out.map((i) => tex[i]).join(',\\ ')} \\right\\}`;
		const math = out.map((i) => `x \\neq ${tex[i]}`).join(' \\quad ');
		line.caption = `Tutti i numeri tranne ${out.map((i) => txt[i]).join(' e ')}.`;
		return { set, math, words: out.map((i) => `$x \\neq ${tex[i]}$`).join(' e '), copy: out.map((i) => `x ≠ ${txt[i]}`).join(' e '), line, empty: false };
	}
	const rs = runs(s);
	if (!rs.length) {
		line.caption = 'Nessun punto: non ci sono soluzioni.';
		return { set: '\\emptyset', math: 'S = \\emptyset', words: 'Nessuna', copy: 'Nessuna soluzione', line, empty: true };
	}
	const sets: string[] = [];
	const ineq: string[] = [];
	const plain: string[] = [];
	const said: string[] = [];
	for (const r of rs) {
		if (r.point !== undefined) {
			sets.push(`\\left\\{ ${tex[r.point]} \\right\\}`);
			ineq.push(`x = ${tex[r.point]}`);
			plain.push(`x = ${txt[r.point]}`);
			said.push(`il numero ${txt[r.point]}`);
			continue;
		}
		const open = r.lo ? (r.lo.incl ? '[' : ']') : ']';
		const close = r.hi ? (r.hi.incl ? ']' : '[') : '[';
		sets.push(`\\left${open} ${r.lo ? tex[r.lo.i] : '-\\infty'}, ${r.hi ? tex[r.hi.i] : '+\\infty'} \\right${close}`);
		const le = (incl: boolean) => (incl ? '\\leq' : '<');
		const leT = (incl: boolean) => (incl ? '≤' : '<');
		const ge = (incl: boolean) => (incl ? '\\geq' : '>');
		const geT = (incl: boolean) => (incl ? '≥' : '>');
		if (r.lo && r.hi) {
			ineq.push(`${tex[r.lo.i]} ${le(r.lo.incl)} x ${le(r.hi.incl)} ${tex[r.hi.i]}`);
			plain.push(`${txt[r.lo.i]} ${leT(r.lo.incl)} x ${leT(r.hi.incl)} ${txt[r.hi.i]}`);
			said.push(`i numeri tra ${txt[r.lo.i]} e ${txt[r.hi.i]}`);
		} else if (r.lo) {
			ineq.push(`x ${ge(r.lo.incl)} ${tex[r.lo.i]}`);
			plain.push(`x ${geT(r.lo.incl)} ${txt[r.lo.i]}`);
			said.push(`i numeri ${r.lo.incl ? 'maggiori o uguali a' : 'maggiori di'} ${txt[r.lo.i]}`);
		} else if (r.hi) {
			ineq.push(`x ${le(r.hi.incl)} ${tex[r.hi.i]}`);
			plain.push(`x ${leT(r.hi.incl)} ${txt[r.hi.i]}`);
			said.push(`i numeri ${r.hi.incl ? 'minori o uguali a' : 'minori di'} ${txt[r.hi.i]}`);
		}
	}
	const cap = said.join(', ');
	line.caption = `${cap.charAt(0).toUpperCase()}${cap.slice(1)}.`;
	// Isolated points only: one set with all of them, {−1, 4}.
	const onlyPoints = rs.every((r) => r.point !== undefined);
	return {
		set: onlyPoints ? `\\left\\{ ${rs.map((r) => tex[r.point as number]).join(',\\ ')} \\right\\}` : sets.join(' \\cup '),
		math: ineq.join(' \\quad \\text{oppure} \\quad '),
		words: ineq.map((m) => `$${m}$`).join(' oppure '),
		copy: plain.join(' oppure '),
		line,
		empty: false
	};
}

/** The decimal value of an irrational end, "1{,}4142", for a row under the exact ends. */
export function approxTex(s: Num, digits = 4): string {
	const v = s.value();
	const r = Math.round(Math.abs(v) * 10 ** digits) / 10 ** digits;
	const [int, frac = ''] = r.toFixed(digits).replace(/0+$/, '').split('.');
	return `${v < 0 && r !== 0 ? '-' : ''}${int}${frac ? `{,}${frac}` : ''}`;
}
