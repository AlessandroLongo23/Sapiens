import { Rational, ZERO, exactSqrt, q } from '@/lib/exercises/v2/rational';
import type { Plot, PlotPoint } from './cartesiano';
import { parseConstant } from './equazione';
import { shown, sqrt, val } from './geometria';
import { decimal } from './numbers';
import { fail, type Outcome, type Step } from './types';

/**
 * The circle in the Cartesian plane (lesson coniche/circonferenza-equazione): from the centre and the radius, or the
 * centre and a point, to the equation x² + y² + ax + by + c = 0; and back, from an equation to the centre and the
 * radius, or to the reason it is not a circle (different coefficients of x² and y², a term in xy, r² negative or
 * zero).
 *
 * Coordinates and coefficients are exact rationals, typed as integers, decimals with a comma or fractions; they are
 * written back as fractions, or as decimals when the student typed decimals (the same convention as cartesiano.ts,
 * whose small helpers are repeated here because they are not exported). The radius is a simplified radical with its
 * decimal. Each result carries a plot for CartesianSketch: the circle is drawn as a closed chain of short segments.
 *
 * `coordFmt`, `readCoord` and `approxText` are shared with area-poligono.ts.
 */

export interface CircleResult {
	outcome: Outcome;
	plot: Plot | null;
	/** The values found, as numbers, for the tests. */
	check?: { a?: number; b?: number; c?: number; xc?: number; yc?: number; r2?: number; r?: number; circle: boolean };
}

const failed = (error: string): CircleResult => ({ outcome: fail(error), plot: null });
export const TOO_BIG = 'I numeri sono troppo grandi per un calcolo esatto. Prova con numeri più piccoli.';

const num = (r: Rational) => r.num / r.den;

// ---------------------------------------------------------------------------------------------------------------
// Reading and writing numbers.

/** Coordinates and coefficients are at most this large in absolute value, with at most this denominator. */
export const LIMIT = 10_000;
export const MAX_DEN = 1000;
export const NUMBER_HINT = 'scrivi un intero (-2), un decimale (1,5) o una frazione (2/3)';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** A number typed in a field; `what` names it in the error ("l'ascissa del centro"). */
export function readCoord(input: string, what: string, example: string): Rational | string {
	const v = parseConstant(input ?? '');
	if (v === null) return `Scrivi ${what}, per esempio ${example}.`;
	if (v === 'error') return `${cap(what)} non è un numero: ${NUMBER_HINT}.`;
	if (Math.abs(v.num) > LIMIT * v.den || v.den > MAX_DEN) return `${cap(what)} è troppo grande: usa numeri tra -10 000 e 10 000.`;
	return v;
}

export interface Fmt {
	/** A number in LaTeX. */
	n: (r: Rational) => string;
	/** The same in brackets when negative, for a substitution. */
	p: (r: Rational) => string;
	/** A number as plain text, for the copy button. */
	t: (r: Rational) => string;
	/** Whether a number is written as a fraction. */
	tall: (r: Rational) => boolean;
	/** "C(1, 2)", "C(1{,}5;\ 2)", "C\left(\frac{1}{2}, 3\right)". */
	pt: (name: string, x: Rational, y: Rational) => string;
	ptText: (name: string, x: Rational, y: Rational) => string;
}

/** Fractions, or decimals when the student typed decimals; then points separate the coordinates with a semicolon. */
export function coordFmt(inputs: string[]): Fmt {
	const decimals = inputs.some((s) => /\d[.,]\d/.test(s ?? ''));
	const asDecimal = (r: Rational) => decimals && !r.isInteger() && decimal(r, 4).exact;
	const n = (r: Rational) => (asDecimal(r) ? decimal(r, 4).tex : r.toLatex());
	const t = (r: Rational) => (asDecimal(r) || r.isInteger() ? decimal(r, 4).text : r.toString());
	const tall = (r: Rational) => !r.isInteger() && !asDecimal(r);
	const sep = decimals ? ';\\ ' : ', ';
	const sepText = decimals ? '; ' : ', ';
	return {
		n,
		t,
		tall,
		p: (r) => (r.sign() >= 0 ? n(r) : tall(r) ? `\\left(${n(r)}\\right)` : `(${n(r)})`),
		pt: (name, x, y) => `${name}${tall(x) || tall(y) ? `\\left(${n(x)}${sep}${n(y)}\\right)` : `(${n(x)}${sep}${n(y)})`}`,
		ptText: (name, x, y) => `${name}(${t(x)}${sepText}${t(y)})`
	};
}

/** A number squared, in brackets when negative or a fraction: "(-3)^2", "\left(\frac{1}{2}\right)^2". */
export function squareTex(f: Fmt, r: Rational): string {
	if (f.tall(r)) return `\\left(${f.n(r)}\\right)^2`;
	return r.sign() < 0 || !r.isInteger() ? `(${f.n(r)})^2` : `${f.n(r)}^2`;
}

/** A sum of terms with their signs folded in, zeros dropped: [[2, 'x'], [-3, 'y'], [1, '']] → "2x - 3y + 1". */
export function sumTex(f: Fmt, terms: [Rational, string][], text = false): string {
	let out = '';
	for (const [c, v] of terms) {
		if (c.isZero()) continue;
		const a = c.abs();
		const body = v && a.isOne() ? v : `${text ? f.t(a) : f.n(a)}${v}`;
		out += out === '' ? `${c.sign() < 0 ? '-' : ''}${body}` : ` ${c.sign() < 0 ? '-' : '+'} ${body}`;
	}
	return out || '0';
}

/** A decimal rounded as at school, for a value that is not exact: "3{,}16", "3,16". */
export function approxText(x: number): { tex: string; text: string } {
	return shown({ c: null, r: 1, pi: 0, x }).approx!;
}

/** Joins lines into a chain: the first after "head = ", the others after "=", repeated lines dropped. */
function chain(head: string, lines: string[]): string[] {
	const out: string[] = [];
	let prev = '';
	for (const line of lines) {
		const plain = line.replace(/^\\hl\{(.*)\}$/, '$1').replace(/\\dfrac/g, '\\frac');
		if (plain === prev) {
			if (line.startsWith('\\hl{') && out.length) out[out.length - 1] = out[out.length - 1].replace(/^(= |.* = )(.*)$/, '$1\\hl{$2}');
			continue;
		}
		out.push(out.length === 0 ? `${head} = ${line}` : `= ${line}`);
		prev = plain;
	}
	return out;
}

// ---------------------------------------------------------------------------------------------------------------
// The radius: √(r²), simplified.

interface Radius {
	/** The lines from √(r²) to the radius, the last highlighted. */
	lines: string[];
	tex: string;
	text: string;
	/** The decimal, when the radius is not a terminating decimal. */
	approx: { tex: string; text: string } | null;
	value: number;
}

function radius(f: Fmt, R: Rational): Radius {
	const first = `\\sqrt{${f.n(R)}}`;
	const exact = exactSqrt(R);
	if (exact) {
		const terminating = exact.isInteger() || decimal(exact, 4).exact;
		return { lines: [first, `\\hl{${f.n(exact)}}`], tex: f.n(exact), text: f.t(exact), approx: terminating ? null : approxText(num(exact)), value: num(exact) };
	}
	const v = sqrt(val(R));
	const s = shown(v);
	// A value too large to simplify is only a decimal.
	if (!s.exact) return { lines: [first, `\\approx \\hl{${s.approx!.tex}}`], tex: first, text: `√${f.t(R)}`, approx: s.approx, value: v.x };
	const lines = [first];
	if (R.isInteger() && v.c && v.c.isInteger() && v.c.num > 1) lines.push(`\\sqrt{${v.c.num}^2 \\cdot ${v.r}}`);
	lines.push(`\\hl{${s.exact.tex}}`);
	return { lines, tex: s.exact.tex, text: s.exact.text, approx: s.approx, value: v.x };
}

// ---------------------------------------------------------------------------------------------------------------
// The plot.

/** Short segments around the circle: enough that it looks round at the size of the sketch. */
const ARCS = 120;

function circlePlot(xc: number, yc: number, r: number, points: PlotPoint[], radiusTo: [number, number]): Plot {
	const segments: Plot['segments'] = [];
	for (let i = 0; i < ARCS; i++) {
		const [t0, t1] = [(2 * Math.PI * i) / ARCS, (2 * Math.PI * (i + 1)) / ARCS];
		segments.push({ from: [xc + r * Math.cos(t0), yc + r * Math.sin(t0)], to: [xc + r * Math.cos(t1), yc + r * Math.sin(t1)], main: true });
	}
	segments.push({ from: [xc, yc], to: radiusTo });
	return { points, segments, lines: [], equal: true };
}

// ---------------------------------------------------------------------------------------------------------------
// From the centre and the radius (or a point) to the equation.

export type CircleMode = 'centro-raggio' | 'centro-punto' | 'equazione';

export interface CircleInput {
	mode: CircleMode;
	xc: string;
	yc: string;
	/** The radius, in the mode 'centro-raggio'. */
	r: string;
	/** The point on the circle, in the mode 'centro-punto'. */
	xp: string;
	yp: string;
	/** The equation, in the mode 'equazione'. */
	eq: string;
}

/** "(x - 2)^2", "(y + 3)^2", "x^2", "\left(x - \frac{1}{2}\right)^2". */
function binomial(f: Fmt, v: 'x' | 'y', c: Rational): string {
	if (c.isZero()) return `${v}^2`;
	const inner = `${v} ${c.sign() > 0 ? '-' : '+'} ${f.n(c.abs())}`;
	return f.tall(c) ? `\\left(${inner}\\right)^2` : `(${inner})^2`;
}

/** The expansion of (v - c)²: "x^2 - 4x + 4". */
function expansion(f: Fmt, v: 'x' | 'y', c: Rational): string {
	return sumTex(f, [
		[q(1), `${v}^2`],
		[c.mul(q(-2)), v],
		[c.mul(c), '']
	]);
}

/** The steps from the centre and r² to the equation; the coefficients and the equation. */
function toEquation(f: Fmt, xc: Rational, yc: Rational, r2: Rational, r2Tex: string): { steps: Step[]; a: Rational; b: Rational; c: Rational; tex: string; text: string; centred: string } {
	const a = xc.mul(q(-2));
	const b = yc.mul(q(-2));
	const k = xc.mul(xc).add(yc.mul(yc));
	const c = k.sub(r2);
	const centred = `${binomial(f, 'x', xc)} + ${binomial(f, 'y', yc)} = ${f.n(r2)}`;
	const terms: [Rational, string][] = [
		[q(1), 'x^2'],
		[q(1), 'y^2'],
		[a, 'x'],
		[b, 'y'],
		[c, '']
	];
	const tex = `${sumTex(f, terms)} = 0`;
	const text = `${sumTex(f, terms, true).replace(/\^2/g, '²')} = 0`;
	const steps: Step[] = [
		{
			say: "Scrivi l'equazione con il centro e il raggio.",
			math: ['(x - x_C)^2 + (y - y_C)^2 = r^2', `\\left(x - ${f.p(xc)}\\right)^2 + \\left(y - ${f.p(yc)}\\right)^2 = ${r2Tex}`, `${binomial(f, 'x', xc)} + ${binomial(f, 'y', yc)} = \\hl{${f.n(r2)}}`]
		}
	];
	if (!xc.isZero() || !yc.isZero())
		steps.push({
			say: 'Sviluppa i quadrati dei binomi.',
			math: [`${xc.isZero() ? 'x^2' : `\\hl{${expansion(f, 'x', xc)}}`} + ${yc.isZero() ? 'y^2' : `\\hl{${expansion(f, 'y', yc)}}`} = ${f.n(r2)}`]
		});
	// Everything on the left: the squares, the terms of first degree, then the numbers, still separate.
	const numbers: [Rational, string][] = [
		[xc.mul(xc), ''],
		[yc.mul(yc), ''],
		[r2.neg(), '']
	];
	const spread = `${sumTex(f, [
		[q(1), 'x^2'],
		[q(1), 'y^2'],
		[a, 'x'],
		[b, 'y']
	])}${numbers
		.filter(([n]) => !n.isZero())
		.map(([n]) => ` ${n.sign() < 0 ? '-' : '+'} ${f.n(n.abs())}`)
		.join('')} = 0`;
	const firstDegree = sumTex(f, [
		[q(1), 'x^2'],
		[q(1), 'y^2'],
		[a, 'x'],
		[b, 'y']
	]);
	const known = c.isZero() ? '' : `${c.sign() < 0 ? '-' : '+'} ${f.n(c.abs())}`;
	const final = `${firstDegree}${known ? ` \\hl{${known}}` : ''} = 0`;
	steps.push({
		say: 'Porta tutto a sinistra, ordina i termini e somma i numeri.',
		math: spread === `${firstDegree}${known ? ` ${known}` : ''} = 0` ? [final] : [spread, final],
		then: c.isZero() ? 'Il termine noto è $0$: la circonferenza passa per l’origine.' : undefined
	});
	return { steps, a, b, c, tex, text, centred };
}

function fromCentre(i: CircleInput): CircleResult {
	const xc = readCoord(i.xc, "l'ascissa del centro", '2');
	if (typeof xc === 'string') return failed(xc);
	const yc = readCoord(i.yc, "l'ordinata del centro", '-3');
	if (typeof yc === 'string') return failed(yc);
	const withPoint = i.mode === 'centro-punto';
	const inputs = withPoint ? [i.xc, i.yc, i.xp, i.yp] : [i.xc, i.yc, i.r];
	const f = coordFmt(inputs);
	const steps: Step[] = [];
	let r2: Rational;
	let r2Tex: string;
	let P: [Rational, Rational] | null = null;
	let rGiven: Rational | null = null;
	if (withPoint) {
		const xp = readCoord(i.xp, "l'ascissa del punto P", '5');
		if (typeof xp === 'string') return failed(xp);
		const yp = readCoord(i.yp, "l'ordinata del punto P", '1');
		if (typeof yp === 'string') return failed(yp);
		if (xp.equals(xc) && yp.equals(yc)) return failed('Il punto P coincide con il centro: scrivi un punto diverso da C, che stia sulla circonferenza.');
		P = [xp, yp];
		const [dx, dy] = [xp.sub(xc), yp.sub(yc)];
		r2 = dx.mul(dx).add(dy.mul(dy));
		r2Tex = f.n(r2);
		steps.push({
			say: 'Il raggio è la distanza tra $C$ e $P$: calcola $r^2$.',
			math: chain('r^2', [
				'(x_P - x_C)^2 + (y_P - y_C)^2',
				`\\left(${f.n(xp)} - ${f.p(xc)}\\right)^2 + \\left(${f.n(yp)} - ${f.p(yc)}\\right)^2`,
				`${squareTex(f, dx)} + ${squareTex(f, dy)}`,
				`${f.n(dx.mul(dx))} + ${f.n(dy.mul(dy))}`,
				`\\hl{${f.n(r2)}}`
			]),
			then: 'Non serve la radice: nell’equazione c’è $r^2$.'
		});
	} else {
		const r = readCoord(i.r, 'il raggio', '5');
		if (typeof r === 'string') return failed(r);
		if (r.sign() <= 0) return failed('Il raggio deve essere maggiore di zero: scrivi per esempio 5.');
		rGiven = r;
		r2 = r.mul(r);
		r2Tex = squareTex(f, r);
	}
	const eq = toEquation(f, xc, yc, r2, r2Tex);
	steps.push(...eq.steps);
	const rows = [
		{ label: 'Equazione della circonferenza', value: `$${eq.tex}$` },
		{ label: 'Scritta con il centro e il raggio', value: `$${eq.centred}$` }
	];
	let rValue = rGiven ? num(rGiven) : 0;
	if (!rGiven) {
		const rad = radius(f, r2);
		rValue = rad.value;
		steps.push({ say: 'Se ti serve il raggio, estrai la radice di $r^2$.', math: [...chain('r', rad.lines), ...(rad.approx ? [`\\approx ${rad.approx.tex}`] : [])] });
		rows.push({ label: 'Raggio', value: `$r = ${rad.tex}$${rad.approx ? ` $\\approx ${rad.approx.tex}$` : ''}` });
	}
	const [x, y] = [num(xc), num(yc)];
	const points: PlotPoint[] = [{ name: 'C', x, y }];
	if (P) points.push({ name: 'P', x: num(P[0]), y: num(P[1]) });
	return {
		outcome: { ok: true, rows, copy: eq.text, steps },
		plot: circlePlot(x, y, rValue, points, P ? [num(P[0]), num(P[1])] : [x + rValue, y]),
		check: { a: num(eq.a), b: num(eq.b), c: num(eq.c), xc: x, yc: y, r2: num(r2), r: rValue, circle: true }
	};
}

// ---------------------------------------------------------------------------------------------------------------
// From the equation to the centre and the radius.

type Kind = 'x2' | 'y2' | 'xy' | 'x' | 'y' | '1';
const ORDER: Kind[] = ['x2', 'y2', 'xy', 'x', 'y', '1'];
const KIND_TEX: Record<Kind, string> = { x2: 'x^2', y2: 'y^2', xy: 'xy', x: 'x', y: 'y', '1': '' };

export const EQUATION_HINT = "Scrivi un'equazione in x e y, per esempio x^2 + y^2 - 4x + 6y - 12 = 0.";

/** A coefficient: "3", "1,5", "2/3", "" (one). */
function coefficient(s: string): Rational | null {
	if (!s) return q(1);
	const [n, d] = s.split('/');
	const a = n ? parseCoef(n) : null;
	if (!a) return null;
	if (d === undefined) return a;
	const b = parseCoef(d);
	if (!b || b.isZero()) return null;
	return a.div(b);
}

function parseCoef(s: string): Rational | null {
	if (!/^\d+([.,]\d+)?$/.test(s) || s.length > 12) return null;
	const [w, frac = ''] = s.split(/[.,]/);
	return q(Number(w) * 10 ** frac.length + Number(frac || '0'), 10 ** frac.length);
}

const TERM = /^([+-])?(?:\(([xy])([+-])(\d+(?:[.,]\d+)?(?:\/\d+(?:[.,]\d+)?)?)\)\^2|(\d+(?:[.,]\d+)?(?:\/\d+(?:[.,]\d+)?)?)?(x\^2|y\^2|xy|yx|x|y)?)/;

interface Parsed {
	/** Coefficients with everything on the left. */
	coef: Record<Kind, Rational>;
	/** Whether the input was already "…= 0" with the terms in order, each once. */
	normal: boolean;
	/** Whether the input had squares of binomials, "(x - 2)^2". */
	binomials: boolean;
}

/** An equation in x and y of degree at most two, as the student types it; null when it cannot be read. */
export function parseCircleEquation(input: string): Parsed | null {
	const s = input
		.toLowerCase()
		.replace(/²/g, '^2')
		.replace(/[−–]/g, '-')
		.replace(/[·*\s]/g, '');
	if (!s || s.length > 120) return null;
	const sides = s.split('=');
	if (sides.length > 2 || sides.some((x) => !x)) return null;
	if (sides.length === 1) sides.push('0');
	const coef = Object.fromEntries(ORDER.map((k) => [k, ZERO])) as Record<Kind, Rational>;
	let binomials = false;
	const seen: Kind[][] = [[], []];
	let rightZero = true;
	for (const [side, text] of sides.entries()) {
		let rest = text;
		let first = true;
		while (rest) {
			const m = TERM.exec(rest);
			if (!m || !m[0] || m[0] === '+' || m[0] === '-') return null;
			if (!first && !m[1]) return null;
			const sign = (m[1] === '-' ? -1 : 1) * (side === 0 ? 1 : -1);
			if (m[2]) {
				// (v ± k)² = v² ± 2k·v + k²
				const k = coefficient(m[4]);
				if (!k) return null;
				const kk = m[3] === '-' ? k.neg() : k;
				const v = m[2] as 'x' | 'y';
				coef[v === 'x' ? 'x2' : 'y2'] = coef[v === 'x' ? 'x2' : 'y2'].add(q(sign));
				coef[v] = coef[v].add(kk.mul(q(2 * sign)));
				coef['1'] = coef['1'].add(kk.mul(kk).mul(q(sign)));
				binomials = true;
				seen[side].push(v === 'x' ? 'x2' : 'y2', v, '1');
				if (side === 1) rightZero = false;
			} else {
				if (!m[5] && !m[6]) return null;
				const c = coefficient(m[5] ?? '');
				if (!c) return null;
				const kind: Kind = !m[6] ? '1' : m[6] === 'x^2' ? 'x2' : m[6] === 'y^2' ? 'y2' : m[6] === 'x' ? 'x' : m[6] === 'y' ? 'y' : 'xy';
				coef[kind] = coef[kind].add(c.mul(q(sign)));
				seen[side].push(kind);
				if (side === 1 && !(kind === '1' && c.isZero())) rightZero = false;
			}
			rest = rest.slice(m[0].length);
			first = false;
		}
	}
	for (const k of ORDER) if (Math.abs(coef[k].num) > LIMIT * 100 * coef[k].den || coef[k].den > MAX_DEN) throw new Error('too big');
	const left = seen[0];
	const ordered = left.every((k, j) => j === 0 || ORDER.indexOf(left[j - 1]) < ORDER.indexOf(k));
	return { coef, normal: rightZero && !binomials && ordered, binomials };
}

const equationTex = (f: Fmt, c: Record<Kind, Rational>) => `${sumTex(
	f,
	ORDER.map((k): [Rational, string] => [c[k], KIND_TEX[k]])
)} = 0`;

type PartStep = Step & { part?: string };

function grouped(steps: PartStep[]): Step[] {
	const group = steps.length > 5;
	return steps.map(({ part, ...step }, i) => (group && part && (i === 0 || steps[i - 1].part !== part) ? { group: part, ...step } : step));
}

function notCircle(steps: PartStep[], reason: string, copy: string, plot: Plot | null = null, check: Partial<CircleResult['check']> = {}): CircleResult {
	return {
		outcome: { ok: true, rows: [{ label: 'Che cosa rappresenta', value: reason }], copy, steps: grouped(steps) },
		plot,
		check: { ...check, circle: false }
	};
}

function fromEquation(i: CircleInput): CircleResult {
	let parsed: Parsed | null;
	try {
		parsed = parseCircleEquation(i.eq ?? '');
	} catch {
		return failed(TOO_BIG);
	}
	if (!parsed) return failed(`Non riesco a leggere l'equazione. ${EQUATION_HINT}`);
	const { coef } = parsed;
	if (coef.x2.isZero() && coef.y2.isZero() && coef.xy.isZero()) return failed(`Nell'equazione mancano x² e y²: non è una circonferenza. ${EQUATION_HINT}`);
	const f = coordFmt([i.eq ?? '']);
	const steps: PartStep[] = [];
	if (!parsed.normal)
		steps.push({
			part: 'Il controllo',
			say: parsed.binomials ? 'Sviluppa i quadrati, porta tutto a sinistra e ordina i termini.' : 'Porta tutto a sinistra e ordina i termini.',
			math: [`\\hl{${equationTex(f, coef)}}`]
		});
	const same = coef.x2.equals(coef.y2);
	const noXy = coef.xy.isZero();
	const table = {
		head: ['Termine', 'Coefficiente'],
		rows: [
			['$x^2$', `$${f.n(coef.x2)}$`],
			['$y^2$', `$${f.n(coef.y2)}$`],
			...(noXy ? [] : [['$xy$', `$${f.n(coef.xy)}$`]])
		]
	};
	if (!same || !noXy) {
		steps.push({
			part: 'Il controllo',
			say: 'Controlla i termini di secondo grado.',
			table,
			then: !noXy ? 'C’è il termine in $xy$: l’equazione non è quella di una circonferenza.' : 'I coefficienti di $x^2$ e $y^2$ sono diversi: non è una circonferenza.'
		});
		return notCircle(steps, 'Non è una circonferenza', 'Non è una circonferenza');
	}
	steps.push({ part: 'Il controllo', say: 'Controlla i termini di secondo grado.', table, then: 'Hanno lo stesso coefficiente e manca il termine in $xy$: si può andare avanti.' });
	const alpha = coef.x2;
	return (() => {
		try {
			const [a, b, c] = [coef.x.div(alpha), coef.y.div(alpha), coef['1'].div(alpha)];
			const norm: Record<Kind, Rational> = { x2: q(1), y2: q(1), xy: ZERO, x: a, y: b, '1': c };
			if (!alpha.isOne()) steps.push({ part: 'Il controllo', say: `Dividi tutti i termini per $${f.n(alpha)}$.`, math: [`\\hl{${equationTex(f, norm)}}`] });
			steps.push({ part: 'Il centro', say: 'Leggi i coefficienti $a$, $b$ e $c$.', math: [`a = ${f.n(a)}`, `b = ${f.n(b)}`, `c = ${f.n(c)}`] });
			const [xc, yc] = [a.div(q(-2)), b.div(q(-2))];
			const half = (v: 'a' | 'b', k: Rational, res: Rational, head: string) =>
				chain(head, [`-\\dfrac{${v}}{2}`, `-\\dfrac{${f.n(k)}}{2}`, `\\hl{${f.n(res)}}`]);
			steps.push({
				part: 'Il centro',
				say: 'Calcola le coordinate del centro.',
				math: [...half('a', a, xc, 'x_C'), ...half('b', b, yc, 'y_C')],
				then: `Il centro è $${f.pt('C', xc, yc)}$.`
			});
			const r2 = xc.mul(xc).add(yc.mul(yc)).sub(c);
			const r2Lines = chain('r^2', ['x_C^2 + y_C^2 - c', `${squareTex(f, xc)} + ${squareTex(f, yc)} - ${f.p(c)}`, `${f.n(xc.mul(xc))} + ${f.n(yc.mul(yc))}${c.isZero() ? '' : ` ${c.sign() > 0 ? '-' : '+'} ${f.n(c.abs())}`}`, `\\hl{${f.n(r2)}}`]);
			const check = { a: num(a), b: num(b), c: num(c), xc: num(xc), yc: num(yc), r2: num(r2) };
			if (r2.sign() < 0) {
				steps.push({ part: 'Il raggio', say: 'Calcola $r^2$ con il centro e il termine noto.', math: r2Lines, then: 'Il numero è negativo: nessun punto del piano soddisfa l’equazione, che quindi non è una circonferenza.' });
				return notCircle(steps, 'Non è una circonferenza: nessun punto', 'Non è una circonferenza', null, check);
			}
			if (r2.isZero()) {
				steps.push({ part: 'Il raggio', say: 'Calcola $r^2$ con il centro e il termine noto.', math: r2Lines, then: `È zero: l’equazione rappresenta solo il punto $${f.pt('C', xc, yc)}$, una circonferenza di raggio $0$.` });
				return notCircle(steps, `Solo il punto $${f.pt('C', xc, yc)}$`, `Solo il punto ${f.ptText('C', xc, yc)}`, { points: [{ name: 'C', x: num(xc), y: num(yc), main: true }], segments: [], lines: [], equal: true }, { ...check, r: 0 });
			}
			steps.push({ part: 'Il raggio', say: 'Calcola $r^2$ con il centro e il termine noto.', math: r2Lines, then: 'Il numero è positivo: è una circonferenza.' });
			const rad = radius(f, r2);
			steps.push({ part: 'Il raggio', say: 'Estrai la radice quadrata.', math: [...chain('r', rad.lines), ...(rad.approx ? [`\\approx ${rad.approx.tex}`] : [])] });
			const rows = [
				{ label: 'Centro', value: `$${f.pt('C', xc, yc)}$` },
				{ label: 'Raggio', value: `$r = ${rad.tex}$${rad.approx ? ` $\\approx ${rad.approx.tex}$` : ''}` }
			];
			const [x, y] = [num(xc), num(yc)];
			return {
				outcome: { ok: true, rows, copy: `${f.ptText('C', xc, yc)}; r = ${rad.text}${rad.approx ? ` ≈ ${rad.approx.text}` : ''}`, steps: grouped(steps) },
				plot: circlePlot(x, y, rad.value, [{ name: 'C', x, y, main: true }], [x + rad.value, y]),
				check: { ...check, r: rad.value, circle: true }
			};
		} catch {
			return failed(TOO_BIG);
		}
	})();
}

/** The circle: its equation from the centre and the radius (or a point), or its centre and radius from the equation. */
export function circonferenza(i: CircleInput): CircleResult {
	try {
		return i.mode === 'equazione' ? fromEquation(i) : fromCentre(i);
	} catch {
		return failed(TOO_BIG);
	}
}
