/**
 * Il piano cartesiano: distanza e punto medio. Spec: specs/exercises/il-piano-cartesiano.md
 *
 * Seven levels in the order of lesson 80 (docs/lezioni/riscritte/80-il-piano-cartesiano.md): where a point
 * lies, the length of a horizontal or vertical segment, the distance formula, the points of an axis at a
 * given distance, midpoint and endpoint, symmetric points and centroid, triangles and parallelograms. No
 * figures: every exercise stands on its coordinates. Points and sets of points are multiple choice (no answer
 * type has two fields); a horizontal distance and an area are a `number`, a distance with a radical an
 * `expression` in simplified form. Distractors are the mistakes of the lesson's warnings.
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { Surd } from '../surd';
import { paren } from '../latex';
import { buildChoice, ratOption, shuffle, weighted } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'il-piano-cartesiano';

const t = (s: string) => `\\text{${s}}`;
const R = (s: string) => Rational.parse(s);

// ---------------------------------------------------------------------------
// Points and numbers

type P = [Rational, Rational];
const pt = (x: number | Rational, y: number | Rational): P => [typeof x === 'number' ? q(x) : x, typeof y === 'number' ? q(y) : y];
const padd = (a: P, b: P): P => [a[0].add(b[0]), a[1].add(b[1])];
const psub = (a: P, b: P): P => [a[0].sub(b[0]), a[1].sub(b[1])];
const pscale = (a: P, k: Rational): P => [a[0].mul(k), a[1].mul(k)];
const peq = (a: P, b: P) => a[0].equals(b[0]) && a[1].equals(b[1]);
const pswap = (a: P): P => [a[1], a[0]];

/** (3, -2), or \left(\frac{3}{2}, -1\right) when a coordinate is a fraction. */
function pairTex([x, y]: P): string {
	const inner = `${x.toLatex()}, ${y.toLatex()}`;
	return x.isInteger() && y.isInteger() ? `(${inner})` : `\\left(${inner}\\right)`;
}
const named = (name: string, p: P) => `${name}${pairTex(p)}`;
const pVals = (p: P) => [p[0].toString(), p[1].toString()];
const pointOption = (p: P): ChoiceOption => ({ latex: pairTex(p), values: pVals(p) });
/** Fallback options for a point: the point moved by one unit. */
const NEAR: [number, number][] = [
	[1, 0],
	[0, -1],
	[-1, 0],
	[0, 1],
	[1, 1],
	[-1, -1],
];
const near = (p: P) => (i: number) => pointOption(padd(p, pt(...NEAR[i % NEAR.length])));
const inRange = (p: P, m: number) => p.every((c) => c.abs().compare(q(m)) <= 0);
/** Twice the signed area of ABC: zero when the points are on a line. */
const cross = (A: P, B: P, C: P) => B[0].sub(A[0]).mul(C[1].sub(A[1])).sub(B[1].sub(A[1]).mul(C[0].sub(A[0])));

/** 6^2, (-6)^2, \left(\frac{2}{3}\right)^2. */
function sq(r: Rational): string {
	if (r.isInteger() && r.sign() >= 0) return `${r.num}^2`;
	return r.isInteger() ? `(${r.toLatex()})^2` : `\\left(${r.toLatex()}\\right)^2`;
}

/** b - a with the parentheses of the lesson: 4 - (-3). */
const minus = (b: Rational, a: Rational) => `${b.toLatex()} - ${paren(a)}`;

/** Square root of a non-negative rational, simplified: sqrt(97/36) = sqrt(97)/6. */
const sqrtOf = (r: Rational): Surd => Surd.of(0, 1, r.num * r.den, r.den);

const sqrtTex = (r: Rational) => `\\sqrt{${r.toLatex()}}`;

interface Opt {
	latex: string;
	value: string;
}
const surdOpt = (s: Surd): Opt => ({ latex: s.toLatex(), value: s.toString() });

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Answer;
	/** Distractors for a number or expression answer. */
	wrong?: Opt[];
	params: Record<string, unknown>;
}

const nz = (rng: Rng, a: number, b: number): number => {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
};

// ---------------------------------------------------------------------------
// Level 1: quadrant or axis

type Region = 'I' | 'II' | 'III' | 'IV' | 'x' | 'y';
const REGION_TEX: Record<Region, string> = {
	I: t('primo quadrante'),
	II: t('secondo quadrante'),
	III: t('terzo quadrante'),
	IV: t('quarto quadrante'),
	x: `${t('asse ')}x`,
	y: `${t('asse ')}y`,
};
const REGION_SENTENCE: Record<Region, string> = {
	I: ' sta nel primo quadrante',
	II: ' sta nel secondo quadrante',
	III: ' sta nel terzo quadrante',
	IV: ' sta nel quarto quadrante',
	x: " sta sull'asse ",
	y: " sta sull'asse ",
};

function region(sx: number, sy: number): Region {
	if (sx === 0) return 'y';
	if (sy === 0) return 'x';
	if (sx > 0) return sy > 0 ? 'I' : 'IV';
	return sy > 0 ? 'II' : 'III';
}

interface Coord {
	tex: string;
	value: string;
	sign: number;
}

const RADICANDS = [2, 3, 5, 6, 7];

function coord(rng: Rng, sign: number): Coord {
	if (sign === 0) return { tex: '0', value: '0', sign: 0 };
	const kind = weighted(rng, [
		['int', 5],
		['frac', 3],
		['rad', 2],
	] as [string, number][]);
	if (kind === 'rad') {
		const n = rng.pick(RADICANDS);
		const k = rng.pick([1, 1, 1, 2, 3]);
		const s = Surd.of(0, sign * k, n, 1);
		return { tex: s.toLatex(), value: s.toString(), sign };
	}
	if (kind === 'frac') {
		for (;;) {
			const den = rng.int(2, 5);
			const num = rng.int(1, 3 * den);
			if (num % den === 0 || gcd(num, den) !== 1) continue;
			const r = q(sign * num, den);
			return { tex: r.toLatex(), value: r.toString(), sign };
		}
	}
	const n = rng.int(1, 9) * sign;
	return { tex: String(n), value: String(n), sign };
}

function level1(rng: Rng): Built {
	const c = weighted(rng, [
		['quadrante', 7],
		['asse', 3],
	] as [string, number][]);
	let sx: number;
	let sy: number;
	if (c === 'quadrante') {
		sx = rng.pick([-1, 1]);
		sy = rng.pick([-1, 1]);
	} else if (rng.next() < 0.5) {
		sx = 0;
		sy = rng.pick([-1, 1]);
	} else {
		sx = rng.pick([-1, 1]);
		sy = 0;
	}
	const X = coord(rng, sx);
	const Y = coord(rng, sy);
	const reg = region(sx, sy);
	const plain = [X, Y].every((z) => /^-?\d+$/.test(z.tex));
	const point = plain ? `P(${X.tex}, ${Y.tex})` : `P\\left(${X.tex}, ${Y.tex}\\right)`;
	const cands: Region[] =
		reg === 'x' ? ['y', region(sx, 1), region(sx, -1)] : reg === 'y' ? ['x', region(1, sy), region(-1, sy)] : [region(sy, sx), region(-sx, sy), region(sx, -sy), region(-sx, -sy)];
	const opt = (r: Region): ChoiceOption => ({ latex: REGION_TEX[r], values: [r] });
	const choice = buildChoice(rng, opt(reg), shuffle(rng, cands).map(opt), (i) => opt((['I', 'II', 'III', 'IV', 'x', 'y'] as Region[])[i % 6]));
	const word = (s: number) => (s > 0 ? 'positiva' : 'negativa');
	const cmp = (z: Coord, v: string) => `${v} = ${z.tex}${z.sign === 0 ? '' : z.sign > 0 ? ' > 0' : ' < 0'}`;
	const steps = [`${cmp(X, 'x_P')} \\qquad ${cmp(Y, 'y_P')}`];
	if (reg === 'x') steps.push(t("L'ordinata è zero: il punto sta sull'asse ") + 'x');
	else if (reg === 'y') steps.push(t("L'ascissa è zero: il punto sta sull'asse ") + 'y');
	else steps.push(t(`Ascissa ${word(sx)} e ordinata ${word(sy)}:${REGION_SENTENCE[reg].replace(' sta nel', '')}`));
	const solution = `P${t(REGION_SENTENCE[reg])}${reg === 'x' || reg === 'y' ? reg : ''}`;
	return {
		case: c,
		prompt: 'Dove sta il punto P?',
		problem: point,
		solution,
		steps,
		answer: choice,
		params: { x: X.value, y: Y.value, region: reg },
	};
}

// ---------------------------------------------------------------------------
// Level 2: horizontal or vertical segment

function level2(rng: Rng): Built {
	const horizontal = rng.next() < 0.5;
	const opposite = rng.next() < 0.6;
	let a: number;
	let b: number;
	if (opposite) {
		a = -rng.int(1, 9);
		b = rng.int(1, 9);
		if (rng.next() < 0.5) [a, b] = [b, a];
	} else {
		const s = rng.pick([-1, 1]);
		a = s * rng.int(1, 9);
		b = s * rng.int(1, 9);
		if (a === b) return level2(rng);
	}
	const c = rng.int(-9, 9);
	const A = horizontal ? pt(a, c) : pt(c, a);
	const B = horizontal ? pt(b, c) : pt(c, b);
	const d = Math.abs(b - a);
	const v = horizontal ? 'x' : 'y';
	const wrong = [q(-d), q(opposite ? Math.abs(Math.abs(b) - Math.abs(a)) : Math.abs(a) + Math.abs(b))];
	const same = horizontal ? "stessa ordinata: il segmento è orizzontale" : "stessa ascissa: il segmento è verticale";
	return {
		case: opposite ? 'segni opposti' : 'stesso segno',
		prompt: 'Calcola la distanza tra i punti A e B.',
		problem: `${named('A', A)} \\quad ${named('B', B)}`,
		solution: `\\overline{AB} = ${d}`,
		steps: [t(`I due punti hanno la ${same}`), `\\overline{AB} = |${v}_B - ${v}_A| = |${minus(q(b), q(a))}| = |${b - a}| = ${d}`],
		answer: { kind: 'number', value: String(d) },
		wrong: wrong.map((w) => ({ latex: w.toLatex(), value: w.toString() })),
		params: { A: pVals(A), B: pVals(B), direction: horizontal ? 'orizzontale' : 'verticale' },
	};
}

// ---------------------------------------------------------------------------
// Level 3: distance between two points

const TRIPLES: [number, number][] = [
	[3, 4],
	[4, 3],
	[6, 8],
	[8, 6],
	[5, 12],
	[12, 5],
];
const FRACS = [q(1, 2), q(3, 2), q(5, 2), q(1, 3), q(2, 3), q(4, 3), q(5, 3), q(1, 4), q(3, 4)];

function distanceSteps(A: P, B: P, nameA = 'A', nameB = 'B'): { steps: string[]; dist: Surd; d2: Rational } {
	const [dx, dy] = psub(B, A);
	const d2 = dx.mul(dx).add(dy.mul(dy));
	const dist = sqrtOf(d2);
	const steps = [
		`x_${nameB} - x_${nameA} = ${minus(B[0], A[0])} = ${dx.toLatex()}`,
		`y_${nameB} - y_${nameA} = ${minus(B[1], A[1])} = ${dy.toLatex()}`,
		`\\overline{${nameA}${nameB}} = \\sqrt{${sq(dx)} + ${sq(dy)}} = \\sqrt{${dx.mul(dx).toLatex()} + ${dy.mul(dy).toLatex()}}`,
	];
	if (d2.isInteger()) {
		const last = `\\overline{${nameA}${nameB}} = ${sqrtTex(d2)}`;
		steps.push(dist.toLatex() === sqrtTex(d2) ? last : `${last} = ${dist.toLatex()}`);
	} else {
		// Over the common denominator, a square, as in example 3: sqrt(97/36) = sqrt(97)/6.
		const den = lcm(dx.mul(dx).den, dy.mul(dy).den);
		const n = d2.mul(q(den)).num;
		const root = Math.round(Math.sqrt(den));
		const split = `\\frac{\\sqrt{${n}}}{${root}}`;
		const last = `\\overline{${nameA}${nameB}} = \\sqrt{\\frac{${n}}{${den}}} = ${split}`;
		steps.push(dist.toLatex() === split ? last : `${last} = ${dist.toLatex()}`);
	}
	return { steps, dist, d2 };
}

function level3(rng: Rng, c: string): Built | null {
	let A: P;
	let B: P;
	if (c === 'frazionarie') {
		const fx = rng.next() < 0.7;
		const fy = !fx || rng.next() < 0.5;
		const f = (on: boolean) => (on ? rng.pick(FRACS).mul(q(rng.pick([-1, 1]))) : q(rng.int(-4, 4)));
		A = [f(fx), f(fy)];
		B = pt(rng.int(-4, 4), rng.int(-4, 4));
	} else {
		let dx: number;
		let dy: number;
		if (c === 'intera') [dx, dy] = rng.pick(TRIPLES);
		else {
			dx = rng.int(1, 8);
			dy = rng.int(1, 8);
			if (Number.isInteger(Math.sqrt(dx * dx + dy * dy))) return null;
		}
		dx *= rng.pick([-1, 1]);
		dy *= rng.pick([-1, 1]);
		const xa = rng.int(Math.max(-9, -9 - dx), Math.min(9, 9 - dx));
		const ya = rng.int(Math.max(-9, -9 - dy), Math.min(9, 9 - dy));
		A = pt(xa, ya);
		B = pt(xa + dx, ya + dy);
	}
	const [dx, dy] = psub(B, A);
	if (dx.isZero() || dy.isZero()) return null;
	const { steps, dist, d2 } = distanceSteps(A, B);
	if (dist.d > 12 || dist.r > 300) return null;
	// Mistakes: the root of a sum split, no root at all, the square taken out of the root,
	// -6^2 = -36, the minus sign of a negative coordinate lost (4 - 3 instead of 4 - (-3)).
	const wrong: Surd[] = [Surd.rational(dx.abs().add(dy.abs())), Surd.rational(d2)];
	if (dist.b > 1 && dist.d === 1 && !dist.isRational()) wrong.push(Surd.of(0, dist.b * dist.b, dist.r, 1));
	const dx2 = dx.mul(dx);
	const dy2 = dy.mul(dy);
	if (dy.sign() < 0 && dx2.compare(dy2) > 0) wrong.push(sqrtOf(dx2.sub(dy2)));
	if (dx.sign() < 0 && dy2.compare(dx2) > 0) wrong.push(sqrtOf(dy2.sub(dx2)));
	if (A[0].sign() < 0 || A[1].sign() < 0) {
		const lx = A[0].sign() < 0 ? B[0].add(A[0]) : dx;
		const ly = A[1].sign() < 0 ? B[1].add(A[1]) : dy;
		if (!lx.isZero() && !ly.isZero()) wrong.push(sqrtOf(lx.mul(lx).add(ly.mul(ly))));
	}
	return {
		case: c,
		prompt: 'Calcola la distanza tra i punti A e B.',
		problem: `${named('A', A)} \\quad ${named('B', B)}`,
		solution: `\\overline{AB} = ${dist.toLatex()}`,
		steps,
		answer: { kind: 'expression', value: dist.toString(), latex: dist.toLatex(), form: 'simplified' },
		wrong: wrong.filter((w) => !w.equals(dist)).map(surdOpt),
		params: { A: pVals(A), B: pVals(B), surd: [dist.a, dist.b, dist.r, dist.d] },
	};
}

// ---------------------------------------------------------------------------
// Level 4: points of an axis at a given distance

type PSet = P[] | 'none';

function psetOption(s: PSet): ChoiceOption {
	if (s === 'none') return { latex: t('nessun punto'), values: ['none'] };
	const sorted = [...s].sort((a, b) => a[0].compare(b[0]) || a[1].compare(b[1]));
	if (sorted.length === 1) return { latex: named('P', sorted[0]), values: [pVals(sorted[0]).join(',')] };
	return { latex: `${named('P_1', sorted[0])},\\ ${named('P_2', sorted[1])}`, values: sorted.map((p) => pVals(p).join(',')) };
}

/** (x - 1)^2, (x + 3)^2, x^2. */
function shiftSq(v: string, c: number): string {
	if (c === 0) return `${v}^2`;
	return c > 0 ? `(${v} - ${c})^2` : `(${v} + ${-c})^2`;
}

function level4(rng: Rng): Built | null {
	const c = weighted(rng, [
		['due punti', 7],
		['un punto', 1.5],
		['nessun punto', 1.5],
	] as [string, number][]);
	const axis = rng.next() < 0.6 ? 'x' : 'y';
	const center = rng.int(-6, 6);
	let off: number;
	let half = 0;
	let d2: number;
	if (c === 'due punti') {
		if (rng.next() < 0.5) {
			const [a, b] = rng.pick(TRIPLES.slice(0, 4));
			half = a;
			off = b;
		} else {
			half = rng.int(1, 8);
			off = rng.int(1, 7);
		}
		d2 = half * half + off * off;
	} else if (c === 'un punto') {
		off = rng.int(1, 7);
		d2 = off * off;
	} else {
		off = rng.int(2, 7);
		if (rng.next() < 0.6) {
			const d = rng.int(1, off - 1);
			d2 = d * d;
		} else d2 = rng.int(2, off * off - 1);
	}
	off *= rng.pick([-1, 1]);
	const A: P = axis === 'x' ? pt(center, off) : pt(off, center);
	const onAxis = (v: number | Rational): P => (axis === 'x' ? pt(v, 0) : pt(0, v));
	const dist = Surd.of(0, 1, d2, 1);
	const truth: PSet = c === 'due punti' ? [onAxis(center - half), onAxis(center + half)] : c === 'un punto' ? [onAxis(center)] : 'none';

	// Mistakes: the point on the other axis, the other coordinate of A forgotten ((x - a)^2 = d^2), the sign of
	// the centre ((x + 1)^2 for (x - 1)^2), one solution only, no point at all, the difference taken the wrong way.
	const cands: PSet[] = [];
	if (truth !== 'none') cands.push(truth.map(pswap));
	if (dist.isRational()) {
		const d = dist.a;
		cands.push([onAxis(center - d), onAxis(center + d)]);
	}
	if (c === 'due punti') {
		if (center !== 0) cands.push([onAxis(-center - half), onAxis(-center + half)]);
		cands.push([onAxis(center + half)]);
		cands.push('none');
	} else if (c === 'un punto') {
		if (center !== 0) cands.push([onAxis(-center)]);
		cands.push('none');
	} else {
		const back = Math.sqrt(off * off - d2);
		if (Number.isInteger(back)) cands.push([onAxis(center - back), onAxis(center + back)]);
		cands.push([onAxis(center)]);
		if (center !== 0) cands.push([onAxis(-center)]);
	}
	const fallback = (i: number): ChoiceOption => {
		const k = half + 1 + i;
		return psetOption([onAxis(center - k), onAxis(center + k)]);
	};
	const choice = buildChoice(rng, psetOption(truth), shuffle(rng, cands).map(psetOption), fallback);

	const v = axis;
	const other = axis === 'x' ? 'ordinata' : 'ascissa';
	const P = axis === 'x' ? 'P(x, 0)' : 'P(0, y)';
	const offSq = `(0 - ${paren(q(off))})^2`;
	const lhs = axis === 'x' ? `${shiftSq(v, center)} + ${offSq}` : `${offSq} + ${shiftSq(v, center)}`;
	const rest = d2 - off * off;
	const steps = [
		t(`Un punto dell'asse `) + v + t(` ha ${other} zero: `) + P,
		`${lhs} = ${d2}`,
		`${shiftSq(v, center)} = ${d2} - ${off * off} = ${rest}`,
	];
	let solution: string;
	if (c === 'due punti') {
		const lin = center === 0 ? v : center > 0 ? `${v} - ${center}` : `${v} + ${-center}`;
		steps.push(`${lin} = \\pm ${half}`);
		const [p1, p2] = truth as P[];
		const c1 = axis === 'x' ? p1[0] : p1[1];
		const c2 = axis === 'x' ? p2[0] : p2[1];
		steps.push(`${v} = ${c1.toLatex()}${t(' oppure ')}${v} = ${c2.toLatex()}`);
		solution = `${named('P_1', p1)},\\ ${named('P_2', p2)}`;
	} else if (c === 'un punto') {
		steps.push(`${v} = ${center}${t(': un solo punto')}`);
		solution = named('P', (truth as P[])[0]);
	} else {
		steps.push(t('Un quadrato non è mai negativo: nessun punto'));
		solution = t('nessun punto');
	}
	return {
		case: c,
		prompt: 'Risolvi il problema.',
		problem: textBlock(`Trova i punti dell'asse $${v}$ che distano $${dist.toLatex()}$ da $${named('A', A)}$.`),
		solution,
		steps,
		answer: choice,
		params: { A: pVals(A), axis, d2: String(d2) },
	};
}

// ---------------------------------------------------------------------------
// Level 5: midpoint, and an endpoint from the midpoint

function randomPoint(rng: Rng, m: number): P {
	return pt(rng.int(-m, m), rng.int(-m, m));
}

function level5(rng: Rng, c: string): Built | null {
	const A = randomPoint(rng, 9);
	const B = randomPoint(rng, 9);
	if (A[0].equals(B[0]) || A[1].equals(B[1])) return null;
	if ([...A, ...B].every((z) => z.sign() >= 0)) return null;
	const half = q(1, 2);
	const M = pscale(padd(A, B), half);
	if (c === 'punto medio') {
		// Mistakes: the difference over 2, the sum not halved, the coordinates swapped.
		const cands = [pscale(psub(B, A), half), padd(A, B), pswap(M)].filter((p) => !peq(p, M));
		const choice = buildChoice(rng, pointOption(M), cands.map(pointOption), (i) => pointOption(padd(M, i % 2 ? pt(0, q(i + 1, 2)) : pt(q(-i - 1, 2), 0))));
		return {
			case: c,
			prompt: 'Trova il punto medio M del segmento AB.',
			problem: `${named('A', A)} \\quad ${named('B', B)}`,
			solution: named('M', M),
			steps: [
				`x_M = \\frac{${A[0].toLatex()} + ${paren(B[0])}}{2} = ${M[0].toLatex()}`,
				`y_M = \\frac{${A[1].toLatex()} + ${paren(B[1])}}{2} = ${M[1].toLatex()}`,
			],
			answer: choice,
			params: { A: pVals(A), B: pVals(B) },
		};
	}
	if (!inRange(B, 9)) return null;
	// Mistakes: the midpoint of AM, 2A - M (the roles swapped), 2M + A (the sign), the coordinates swapped.
	const two = q(2);
	const cands = shuffle(rng, [pscale(padd(A, M), half), psub(pscale(A, two), M), padd(pscale(M, two), A), pswap(B)]).filter((p) => !peq(p, B));
	const choice = buildChoice(rng, pointOption(B), cands.map(pointOption), (i) => pointOption(padd(B, i % 2 ? pt(0, i + 1) : pt(-i - 1, 0))));
	return {
		case: c,
		prompt: 'M è il punto medio del segmento AB. Trova B.',
		problem: `${named('A', A)} \\quad ${named('M', M)}`,
		solution: named('B', B),
		steps: [
			t('Da ') + 'x_M = \\frac{x_A + x_B}{2}' + t(' si ricava ') + 'x_B = 2x_M - x_A',
			`x_B = 2 \\cdot ${paren(M[0])} - ${paren(A[0])} = ${B[0].toLatex()}`,
			`y_B = 2 \\cdot ${paren(M[1])} - ${paren(A[1])} = ${B[1].toLatex()}`,
		],
		answer: choice,
		params: { A: pVals(A), M: pVals(M) },
	};
}

// ---------------------------------------------------------------------------
// Level 6: symmetric points and centroid

function level6(rng: Rng, c: string): Built | null {
	if (c === 'asse x' || c === 'asse y' || c === 'origine') {
		const frac = rng.next() < 0.2;
		let x: Rational = q(nz(rng, -9, 9));
		const y: Rational = q(nz(rng, -9, 9));
		if (frac) x = q(2 * nz(rng, -5, 4) + 1, 2);
		if (x.abs().equals(y.abs())) return null;
		const P: P = [x, y];
		const sx: P = [x, y.neg()];
		const sy: P = [x.neg(), y];
		const so: P = [x.neg(), y.neg()];
		const [truth, cands, rule, why] =
			c === 'asse x'
				? [sx, [sy, so, pswap(P)], '(x, y) \\to (x, -y)', t("Rispetto all'asse ") + 'x' + t(" resta l'ascissa e cambia segno l'ordinata")]
				: c === 'asse y'
					? [sy, [sx, so, pswap(P)], '(x, y) \\to (-x, y)', t("Rispetto all'asse ") + 'y' + t(" resta l'ordinata e cambia segno l'ascissa")]
					: [so, [sx, sy, pswap(P)], '(x, y) \\to (-x, -y)', t("Rispetto all'origine cambiano segno tutte e due le coordinate")];
		const choice = buildChoice(rng, pointOption(truth), shuffle(rng, cands).map(pointOption), near(truth));
		const where = c === 'origine' ? "all'origine" : `all'${c}`;
		return {
			case: c,
			prompt: `Trova il simmetrico P' di P rispetto ${where}.`,
			problem: named('P', P),
			solution: named("P'", truth),
			steps: [why, rule, `${named('P', P)} \\to ${named("P'", truth)}`],
			answer: choice,
			params: { P: pVals(P) },
		};
	}
	if (c === 'punto') {
		const A = randomPoint(rng, 8);
		const C = randomPoint(rng, 6);
		if (peq(A, C) || A[0].equals(C[0]) || A[1].equals(C[1])) return null;
		const two = q(2);
		const S = psub(pscale(C, two), A);
		if (!inRange(S, 12)) return null;
		// Mistakes: the midpoint of AC, 2A - C (the roles swapped), 2C + A (the sign), the symmetric of A about O.
		const cands = shuffle(rng, [pscale(padd(A, C), q(1, 2)), psub(pscale(A, two), C), padd(pscale(C, two), A), pscale(A, q(-1))]).filter((p) => !peq(p, S));
		const choice = buildChoice(rng, pointOption(S), cands.map(pointOption), near(S));
		return {
			case: c,
			prompt: "Trova il simmetrico A' di A rispetto al punto C.",
			problem: `${named('A', A)} \\quad ${named('C', C)}`,
			solution: named("A'", S),
			steps: [
				'C' + t(' è il punto medio del segmento ') + "AA'" + t(', quindi ') + "x_{A'} = 2x_C - x_A",
				`x_{A'} = 2 \\cdot ${paren(C[0])} - ${paren(A[0])} = ${S[0].toLatex()}`,
				`y_{A'} = 2 \\cdot ${paren(C[1])} - ${paren(A[1])} = ${S[1].toLatex()}`,
			],
			answer: choice,
			params: { A: pVals(A), C: pVals(C) },
		};
	}
	// Centroid: six times in ten with integer coordinates.
	const A = randomPoint(rng, 6);
	const B = randomPoint(rng, 6);
	let C = randomPoint(rng, 6);
	if (rng.next() < 0.6) {
		const G0 = randomPoint(rng, 3);
		C = psub(pscale(G0, q(3)), padd(A, B));
		if (!inRange(C, 8)) return null;
	}
	if (cross(A, B, C).isZero()) return null;
	const sum = padd(padd(A, B), C);
	const G = pscale(sum, q(1, 3));
	// Mistakes: the sum over 2, the sum not divided, the midpoint of AB only, the coordinates swapped.
	const cands = shuffle(rng, [pscale(sum, q(1, 2)), sum, pscale(padd(A, B), q(1, 2)), pswap(G)]).filter((p) => !peq(p, G));
	const choice = buildChoice(rng, pointOption(G), cands.map(pointOption), near(G));
	const plus = (a: Rational, b: Rational, cc: Rational) => `${a.toLatex()} + ${paren(b)} + ${paren(cc)}`;
	return {
		case: c,
		prompt: 'Trova il baricentro G del triangolo ABC.',
		problem: `${named('A', A)} \\quad ${named('B', B)} \\quad ${named('C', C)}`,
		solution: named('G', G),
		steps: [
			t('Le coordinate del baricentro sono la media delle coordinate dei vertici'),
			`x_G = \\frac{${plus(A[0], B[0], C[0])}}{3} = ${G[0].toLatex()}`,
			`y_G = \\frac{${plus(A[1], B[1], C[1])}}{3} = ${G[1].toLatex()}`,
		],
		answer: choice,
		params: { A: pVals(A), B: pVals(B), C: pVals(C) },
	};
}

// ---------------------------------------------------------------------------
// Level 7: triangles and parallelograms

type Tri = 'isoscele' | 'rettangolo' | 'rettangolo isoscele' | 'scaleno';
const TRI_TEX: Record<Tri, string> = {
	isoscele: t('isoscele, non rettangolo'),
	rettangolo: t('rettangolo, non isoscele'),
	'rettangolo isoscele': t('rettangolo e isoscele'),
	scaleno: t('scaleno, non rettangolo'),
};
const TRIS: Tri[] = ['isoscele', 'rettangolo', 'rettangolo isoscele', 'scaleno'];

const d2Of = (a: P, b: P) => {
	const [dx, dy] = psub(b, a);
	return dx.mul(dx).add(dy.mul(dy));
};

function classify(V: P[]): Tri | null {
	if (cross(V[0], V[1], V[2]).isZero()) return null;
	const s = [d2Of(V[1], V[2]), d2Of(V[0], V[2]), d2Of(V[0], V[1])].map((r) => r.num);
	if (s.some((x) => x === 0)) return null;
	const [a, b, c] = [...s].sort((x, y) => x - y);
	const iso = a === b || b === c;
	const right = a + b === c;
	if (a === b && b === c) return null;
	return right ? (iso ? 'rettangolo isoscele' : 'rettangolo') : iso ? 'isoscele' : 'scaleno';
}

function unitPerp(p: number, q0: number): [number, number] {
	const g = gcd(p, q0);
	return [-q0 / g, p / g];
}

function sideSteps(V: P[], names: string[]): string[] {
	const pairs: [number, number][] = [
		[0, 1],
		[1, 2],
		[0, 2],
	];
	return pairs.map(([i, j]) => {
		const [dx, dy] = psub(V[j], V[i]);
		return `\\overline{${names[i]}${names[j]}}^{\\,2} = ${sq(dx)} + ${sq(dy)} = ${d2Of(V[i], V[j]).toLatex()}`;
	});
}

function level7Type(rng: Rng): Built | null {
	const kind = weighted(rng, [
		['isoscele', 3],
		['rettangolo', 3],
		['rettangolo isoscele', 1.5],
		['scaleno', 2.5],
	] as [Tri, number][]);
	let V: P[];
	if (kind === 'isoscele') {
		const p = rng.int(-3, 3);
		const q0 = rng.int(-3, 3);
		if (p === 0 && q0 === 0) return null;
		const A = randomPoint(rng, 6);
		const H = padd(A, pt(p, q0));
		const B = padd(H, pt(p, q0));
		const [ux, uy] = unitPerp(p, q0);
		const k = rng.pick([-3, -2, 2, 3]) * (rng.next() < 0.5 ? gcd(p, q0) : 1);
		const C = padd(H, pt(ux * k, uy * k));
		V = [A, B, C];
	} else if (kind === 'rettangolo' || kind === 'rettangolo isoscele') {
		const p = rng.int(-4, 4);
		const q0 = rng.int(-4, 4);
		if (p === 0 && q0 === 0) return null;
		const g = gcd(p, q0);
		const [ux, uy] = unitPerp(p, q0);
		let s: number;
		if (kind === 'rettangolo isoscele') s = g * rng.pick([-1, 1]);
		else {
			s = nz(rng, -4, 4);
			if (Math.abs(s) === g) return null;
		}
		const B = randomPoint(rng, 6);
		V = [padd(B, pt(p, q0)), B, padd(B, pt(ux * s, uy * s))];
	} else V = [randomPoint(rng, 7), randomPoint(rng, 7), randomPoint(rng, 7)];
	if (!V.every((v) => inRange(v, 8))) return null;
	const truth = classify(V);
	if (truth !== kind) return null;
	V = shuffle(rng, V);
	const names = ['A', 'B', 'C'];
	const s = [d2Of(V[0], V[1]), d2Of(V[1], V[2]), d2Of(V[0], V[2])].map((r) => r.num);
	const sideName = ['AB', 'BC', 'AC'];
	const order = [0, 1, 2].sort((i, j) => s[i] - s[j]);
	const [i0, i1, i2] = order;
	const steps = sideSteps(V, names);
	const eqs: string[] = [];
	for (const [i, j] of [
		[0, 1],
		[1, 2],
		[0, 2],
	])
		if (s[i] === s[j]) eqs.push(`\\overline{${sideName[i]}} = \\overline{${sideName[j]}}`);
	if (eqs.length) steps.push(`${eqs[0]}${t(': il triangolo è isoscele')}`);
	else steps.push(t('I tre lati sono diversi: il triangolo non è isoscele'));
	const opp = (k: number) => names.find((n) => !sideName[k].includes(n)) as string;
	if (s[i0] + s[i1] === s[i2])
		steps.push(t('Il lato più lungo è ') + sideName[i2] + t(' e ') + `${s[i0]} + ${s[i1]} = ${s[i2]}` + t(': rettangolo in ') + opp(i2));
	else steps.push(t('Il lato più lungo è ') + sideName[i2] + t(' e ') + `${s[i0]} + ${s[i1]} = ${s[i0] + s[i1]} \\neq ${s[i2]}` + t(': non è rettangolo'));
	const opt = (x: Tri): ChoiceOption => ({ latex: TRI_TEX[x], values: [x] });
	const choice = buildChoice(rng, opt(truth), TRIS.filter((x) => x !== truth).map(opt));
	return {
		case: 'tipo',
		prompt: 'Che triangolo è ABC?',
		problem: V.map((v, i) => named(names[i], v)).join(' \\quad '),
		solution: t(`È un triangolo ${TRI_TEX[truth].slice(6, -1)}`),
		steps,
		answer: choice,
		params: { A: pVals(V[0]), B: pVals(V[1]), C: pVals(V[2]), type: truth },
	};
}

function level7Vertex(rng: Rng): Built | null {
	const A = randomPoint(rng, 6);
	const B = randomPoint(rng, 6);
	const C = randomPoint(rng, 6);
	if (cross(A, B, C).isZero()) return null;
	const D = psub(padd(A, C), B);
	if (!inRange(D, 9)) return null;
	const M = pscale(padd(A, C), q(1, 2));
	// Mistakes: AB taken as a diagonal (the lesson's warning), BD as the diagonal from A, M itself, D swapped.
	const cands = shuffle(rng, [psub(padd(A, B), C), psub(padd(B, C), A), M, pswap(D)]).filter((p) => !peq(p, D));
	const choice = buildChoice(rng, pointOption(D), cands.map(pointOption), near(D));
	return {
		case: 'quarto vertice',
		prompt: 'A, B e C sono tre vertici del parallelogramma ABCD. Trova D.',
		problem: `${named('A', A)} \\quad ${named('B', B)} \\quad ${named('C', C)}`,
		solution: named('D', D),
		steps: [
			t('Le diagonali ') + 'AC' + t(' e ') + 'BD' + t(' hanno lo stesso punto medio ') + 'M',
			`M\\left(\\frac{${A[0].toLatex()} + ${paren(C[0])}}{2}, \\frac{${A[1].toLatex()} + ${paren(C[1])}}{2}\\right) = ${named('M', M)}`,
			`x_D = 2x_M - x_B = 2 \\cdot ${paren(M[0])} - ${paren(B[0])} = ${D[0].toLatex()}`,
			`y_D = 2y_M - y_B = 2 \\cdot ${paren(M[1])} - ${paren(B[1])} = ${D[1].toLatex()}`,
		],
		answer: choice,
		params: { A: pVals(A), B: pVals(B), C: pVals(C) },
	};
}

function level7Area(rng: Rng): Built | null {
	if (rng.next() < 0.5) {
		// Right triangle with the right angle at a vertex to be found.
		const p = rng.int(-4, 4);
		const q0 = rng.int(-4, 4);
		if (p === 0 || q0 === 0) return null;
		const [ux, uy] = unitPerp(p, q0);
		const s = nz(rng, -3, 3);
		const B = randomPoint(rng, 6);
		let V: P[] = [padd(B, pt(p, q0)), B, padd(B, pt(ux * s, uy * s))];
		if (!V.every((v) => inRange(v, 8))) return null;
		V = shuffle(rng, V);
		const names = ['A', 'B', 'C'];
		const s2 = [d2Of(V[0], V[1]), d2Of(V[1], V[2]), d2Of(V[0], V[2])].map((r) => r.num);
		const sideName = ['AB', 'BC', 'AC'];
		const order = [0, 1, 2].sort((i, j) => s2[i] - s2[j]);
		const [l1, l2, hyp] = order;
		if (s2[l1] + s2[l2] !== s2[hyp]) return null;
		const legs = Math.sqrt(s2[l1] * s2[l2]);
		const area = q(legs, 2);
		const opp = names.find((n) => !sideName[hyp].includes(n)) as string;
		const wrong = [area.mul(q(2)), q(s2[l1] * s2[l2], 2), q(s2[l1] + s2[l2], 2)];
		return {
			case: 'area',
			prompt: "Il triangolo ABC è rettangolo. Calcola l'area.",
			problem: V.map((v, i) => named(names[i], v)).join(' \\quad '),
			solution: `${t("L'area è ")}${area.toLatex()}`,
			steps: [
				...sideSteps(V, names),
				t('Il lato più lungo è ') + sideName[hyp] + t(' e ') + `${s2[l1]} + ${s2[l2]} = ${s2[hyp]}` + t(': i cateti sono ') + sideName[l1] + t(' e ') + sideName[l2] + t(', angolo retto in ') + opp,
				`${t('area')} = \\frac{\\sqrt{${s2[l1]}} \\cdot \\sqrt{${s2[l2]}}}{2} = \\frac{\\sqrt{${s2[l1] * s2[l2]}}}{2} = ${area.toLatex()}`,
			],
			answer: { kind: 'number', value: area.toString() },
			wrong: wrong.map((w) => ({ latex: w.toLatex(), value: w.toString() })),
			params: { A: pVals(V[0]), B: pVals(V[1]), C: pVals(V[2]), shape: 'rettangolo' },
		};
	}
	// Isosceles on a horizontal or vertical base AB, as in example 7.
	const p = rng.int(1, 4) * rng.pick([-1, 1]);
	const h = nz(rng, -7, 7);
	const A0 = randomPoint(rng, 6);
	const horizontal = rng.next() < 0.6;
	const B0 = padd(A0, horizontal ? pt(2 * p, 0) : pt(0, 2 * p));
	const H = padd(A0, horizontal ? pt(p, 0) : pt(0, p));
	const C0 = padd(H, horizontal ? pt(0, h) : pt(h, 0));
	if (![B0, C0].every((v) => inRange(v, 8))) return null;
	const base = Math.abs(2 * p);
	const height = Math.abs(h);
	const area = q(base * height, 2);
	const v = horizontal ? 'x' : 'y';
	const w = horizontal ? 'y' : 'x';
	const idx = horizontal ? 0 : 1;
	const jdx = 1 - idx;
	const wrong = [area.mul(q(2)), area.mul(q(1, 2)), q(base + height)];
	return {
		case: 'area',
		prompt: "Il triangolo ABC è isoscele sulla base AB. Calcola l'area.",
		problem: `${named('A', A0)} \\quad ${named('B', B0)} \\quad ${named('C', C0)}`,
		solution: `${t("L'area è ")}${area.toLatex()}`,
		steps: [
			`\\overline{AB} = |${v}_B - ${v}_A| = |${minus(B0[idx], A0[idx])}| = ${base}`,
			t("L'altezza cade nel punto medio della base, ") + named('H', H),
			`\\overline{HC} = |${w}_C - ${w}_H| = |${minus(C0[jdx], H[jdx])}| = ${height}`,
			`${t('area')} = \\frac{${base} \\cdot ${height}}{2} = ${area.toLatex()}`,
		],
		answer: { kind: 'number', value: area.toString() },
		wrong: wrong.map((x) => ({ latex: x.toLatex(), value: x.toString() })),
		params: { A: pVals(A0), B: pVals(B0), C: pVals(C0), shape: 'isoscele' },
	};
}

function level7(rng: Rng, c: string): Built | null {
	return c === 'tipo' ? level7Type(rng) : c === 'quarto vertice' ? level7Vertex(rng) : level7Area(rng);
}

// ---------------------------------------------------------------------------

/** The case of a level is drawn once, and only the numbers are drawn again when they do not fit. */
const CASES: Record<number, [string, number][]> = {
	3: [
		['intera', 3],
		['radicale', 5],
		['frazionarie', 2],
	],
	5: [
		['punto medio', 1],
		['estremo', 1],
	],
	6: [
		['asse x', 2],
		['asse y', 2],
		['origine', 1.5],
		['punto', 2.5],
		['baricentro', 2],
	],
	7: [
		['tipo', 4],
		['quarto vertice', 3],
		['area', 3],
	],
};

const BY_CASE: Record<number, (rng: Rng, c: string) => Built | null> = { 3: level3, 5: level5, 6: level6, 7: level7 };

function build(rng: Rng, level: number): Built | null {
	if (level === 1) return level1(rng);
	if (level === 2) return level2(rng);
	if (level === 4) return level4(rng);
	const fn = BY_CASE[level];
	if (!fn) throw new Error(`${ID}: unknown level ${level}`);
	const c = weighted(rng, CASES[level]);
	for (let i = 0; i < 500; i++) {
		const b = fn(rng, c);
		if (b) return b;
	}
	return null;
}

const FORBIDDEN: [string, RegExp][] = [
	['+ -', /\+\s*-/],
	['- -', /-\s*-/],
	['1\\sqrt', /(?<!\d)1\\sqrt/],
];

const ANSWER_KIND: Record<number, string[]> = { 1: ['choice'], 2: ['number'], 3: ['expression'], 4: ['choice'], 5: ['choice'], 6: ['choice'], 7: ['choice', 'number'] };

function check(sample: Sample): string[] {
	const v: string[] = [];
	for (const [name, rx] of FORBIDDEN) if (rx.test(sample.problem)) v.push(`testo con '${name}'`);
	if (!sample.steps.length || !sample.solution) v.push('passaggi o soluzione mancanti');
	const a = sample.answer;
	if (!ANSWER_KIND[sample.level]?.includes(a.kind)) v.push(`risposta ${a.kind} al livello ${sample.level}`);
	if (a.kind === 'choice') {
		if (a.options.length !== 4) v.push('servono quattro opzioni');
		if (new Set(a.options.map((o) => o.values.join('|'))).size !== a.options.length) v.push('opzioni ripetute');
	}
	if (a.kind === 'number' && sample.level === 2 && R(a.value).sign() <= 0) v.push('distanza non positiva');
	if (a.kind === 'expression' && a.form !== 'simplified') v.push('forma richiesta mancante');
	const c = sample.choice;
	if (c && c.options.length !== 4) v.push('servono quattro opzioni');
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const a = sample.answer;
	if (a.kind === 'choice') return a;
	const wrong = (sample.params.wrong as Opt[]) ?? [];
	const opt = (o: Opt): ChoiceOption => ({ latex: o.latex, values: [o.value] });
	if (a.kind === 'number') {
		const value = R(a.value);
		const step = value.isInteger() ? q(1) : q(1, 2);
		const fallback = (i: number) => {
			const k = Math.floor(i / 2) + 1;
			const w = value.add(step.mul(q(i % 2 ? -k : k)));
			return w.sign() > 0 ? ratOption(w) : null;
		};
		return buildChoice(rng, ratOption(value), wrong.map(opt), fallback);
	}
	if (a.kind === 'expression') {
		const [sa, sb, sr, sd] = sample.params.surd as number[];
		const fallback = (i: number) => {
			const k = Math.floor(i / 2) + 1;
			const s = sb === 0 ? Surd.of(sa + (i % 2 ? -k : k) * sd, 0, 1, sd) : Surd.of(0, sb + (i % 2 ? -k : k), sr, sd);
			return s.value() > 0 ? opt(surdOpt(s)) : null;
		};
		return buildChoice(rng, { latex: a.latex, values: [a.value] }, wrong.map(opt), fallback);
	}
	throw new Error(`${ID}: no choice for ${a.kind}`);
}

export const ilPianoCartesiano: Generator = {
	id: ID,
	title: 'Il piano cartesiano: distanza e punto medio',
	levels: {
		1: { label: 'Quadranti e assi', constraints: ['7 su 10 in un quadrante, 3 su 10 su un asse', 'coordinate intere, frazioni o radicali'] },
		2: { label: 'Segmenti orizzontali e verticali', constraints: ['coordinate intere tra -9 e 9', '6 su 10 con le coordinate che cambiano di segno opposto'] },
		3: { label: 'Distanza tra due punti', constraints: ['3 su 10 con distanza intera, 5 su 10 con un radicale, 2 su 10 con coordinate frazionarie', 'risposta con il radicale ridotto'] },
		4: { label: "Punti di un asse a distanza data", constraints: ['7 su 10 due punti, 1,5 su 10 uno, 1,5 su 10 nessuno', 'asse x 6 su 10'] },
		5: { label: 'Punto medio ed estremo', constraints: ['metà punto medio, metà estremo dal punto medio', 'coordinate intere tra -9 e 9, risultati anche frazionari'] },
		6: { label: 'Simmetrici e baricentro', constraints: ['simmetrico rispetto agli assi, all’origine, a un punto; baricentro'] },
		7: { label: 'Triangoli e parallelogrammi', constraints: ['che triangolo è (4 su 10), quarto vertice (3 su 10), area (3 su 10)', 'coordinate intere tra -8 e 8'] },
	},
	generate(rng: Rng, level: number): Sample {
		// With consecutive seeds the first draws of rng.ts are not uniform: skip two before the case.
		rng.next();
		rng.next();
		for (let attempt = 0; attempt < 2000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer: b.answer,
				params: { case: b.case, ...b.params },
			};
			if (b.wrong) sample.params.wrong = b.wrong;
			if (check(sample).length) continue;
			try {
				toChoice(sample, rng);
			} catch {
				continue;
			}
			return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default ilPianoCartesiano;
