import { Rational, ZERO, exactSqrt, gcd, lcm, q } from '@/lib/exercises/v2/rational';
import { Surd, sqrtParts } from '@/lib/exercises/v2/surd';
import { parseConstant } from './equazione';
import { quadraticRoots } from './equazioni-secondo-grado';
import { decimal } from './numbers';
import { fail, type Outcome, type Step } from './types';

/**
 * The Cartesian plane of the second year (lessons geometria-analitica and parabola-disequazioni): the distance
 * between two points, the midpoint of a segment, the line through two points (or through a point with a given
 * slope, or parallel or perpendicular to a given line) and the parabola y = ax² + bx + c with its vertex, axis,
 * focus, directrix and intersections with the axes.
 *
 * Coordinates are exact rationals, typed as integers, decimals with a comma or fractions ("2/3"); distances are
 * simplified radicals (3√5) with their decimal. When the student types decimals, results that end within four
 * decimals are written as decimals too, and points then separate the coordinates with a semicolon (A(1,5; 2)), as
 * Italian books do; otherwise fractions, and points with a comma (A(1, 2)).
 *
 * Each result carries a plot for the sketch on the page (CartesianSketch), in plain numbers.
 */

// ---------------------------------------------------------------------------------------------------------------
// The plot the page draws.

export interface PlotPoint {
	name: string;
	x: number;
	y: number;
	/** The point the tool finds (the midpoint, the vertex): in the accent colour. */
	main?: boolean;
	/** Where the name goes, when not above on the right. */
	side?: 'left' | 'right';
}

/** A line a·x + b·y + c = 0. */
export interface PlotLine {
	a: number;
	b: number;
	c: number;
	name?: string;
	main?: boolean;
}

export interface Plot {
	points: PlotPoint[];
	segments: { from: [number, number]; to: [number, number]; main?: boolean }[];
	lines: PlotLine[];
	parabola?: { a: number; b: number; c: number };
	/** The same unit on both axes, so that perpendicular lines look perpendicular. */
	equal: boolean;
}

export interface CartesianResult {
	outcome: Outcome;
	plot: Plot | null;
	/** The values found, as numbers, for the tests. */
	check?: Record<string, number>;
}

const failed = (error: string): CartesianResult => ({ outcome: fail(error), plot: null });
const TOO_BIG = 'I numeri sono troppo grandi per un calcolo esatto. Prova con coordinate più piccole.';

/** Exact arithmetic throws when a number leaves the safe integers: then the page asks for smaller numbers. */
function guard(f: () => CartesianResult): CartesianResult {
	try {
		return f();
	} catch {
		return failed(TOO_BIG);
	}
}

const val = (r: Rational) => r.num / r.den;

// ---------------------------------------------------------------------------------------------------------------
// Reading the inputs.

/** Coordinates and coefficients are at most this large in absolute value, with at most this denominator. */
const LIMIT = 10_000;
const MAX_DEN = 1000;
/** A radicand above this is not simplified (the search for square factors would be slow). */
const MAX_RADICAND = 1e12;

const NUMBER_HINT = 'scrivi un intero (-2), un decimale (1,5) o una frazione (2/3)';

/** A number typed in a field; `what` names it in the error ("l'ascissa di A"). */
function readNumber(input: string, what: string, example: string, optional = false): Rational | string {
	const v = parseConstant(input);
	if (v === null) return optional ? ZERO : `Scrivi ${what}, per esempio ${example}.`;
	if (v === 'error') return `${what[0].toUpperCase()}${what.slice(1)} non è un numero: ${NUMBER_HINT}.`;
	if (Math.abs(v.num) > LIMIT * v.den || v.den > MAX_DEN) return `${what[0].toUpperCase()}${what.slice(1)} è troppo grande: usa numeri tra -10 000 e 10 000.`;
	return v;
}

type Pt = [Rational, Rational];

function readPoint(name: string, x: string, y: string, example: [string, string]): Pt | string {
	const a = readNumber(x, `l'ascissa di ${name}`, example[0]);
	if (typeof a === 'string') return a;
	const b = readNumber(y, `l'ordinata di ${name}`, example[1]);
	if (typeof b === 'string') return b;
	return [a, b];
}

// ---------------------------------------------------------------------------------------------------------------
// Writing numbers: fractions, or decimals when the student typed decimals.

interface Fmt {
	/** A number in LaTeX. */
	n: (r: Rational) => string;
	/** The same in brackets when negative, for a substitution. */
	p: (r: Rational) => string;
	/** A number as plain text, for the copy button. */
	t: (r: Rational) => string;
	/** "A(1, 2)" or "A(1,5; 2)". */
	pt: (name: string, x: Rational, y: Rational) => string;
	ptText: (name: string, x: Rational, y: Rational) => string;
	/** Whether a number is written as a fraction (it then needs \left( \right) around it). */
	tall: (r: Rational) => boolean;
	/** The separator of the coordinates in a point: ", " or ";\ ". */
	sep: string;
}

function makeFmt(inputs: string[]): Fmt {
	const decimals = inputs.some((s) => /\d[.,]\d/.test(s));
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
		sep,
		p: (r) => (r.sign() >= 0 ? n(r) : tall(r) ? `\\left(${n(r)}\\right)` : `(${n(r)})`),
		pt: (name, x, y) => `${name}${tall(x) || tall(y) ? `\\left(${n(x)}${sep}${n(y)}\\right)` : `(${n(x)}${sep}${n(y)})`}`,
		ptText: (name, x, y) => `${name}(${t(x)}${sepText}${t(y)})`
	};
}

/** A sum of terms with their signs folded in, zeros dropped: [[2, 'x'], [-3, 'y'], [1, '']] → "2x - 3y + 1". */
function sumTex(f: Fmt, terms: [Rational, string][]): string {
	let out = '';
	for (const [c, v] of terms) {
		if (c.isZero()) continue;
		const a = c.abs();
		const body = v && a.isOne() ? v : `${f.n(a)}${v}`;
		out += out === '' ? `${c.sign() < 0 ? '-' : ''}${body}` : ` ${c.sign() < 0 ? '-' : '+'} ${body}`;
	}
	return out || '0';
}

function sumText(f: Fmt, terms: [Rational, string][]): string {
	let out = '';
	for (const [c, v] of terms) {
		if (c.isZero()) continue;
		const a = c.abs();
		const body = v && a.isOne() ? v : `${f.t(a)}${v}`;
		out += out === '' ? `${c.sign() < 0 ? '-' : ''}${body}` : ` ${c.sign() < 0 ? '-' : '+'} ${body}`;
	}
	return out || '0';
}

/** "y = mx + q" in LaTeX and in text. */
const explicitTex = (f: Fmt, m: Rational, qq: Rational) => `y = ${sumTex(f, [[m, 'x'], [qq, '']])}`;
const explicitText = (f: Fmt, m: Rational, qq: Rational) => `y = ${sumText(f, [[m, 'x'], [qq, '']])}`;

/** A number squared, in brackets when negative or a fraction: "(-3)^2", "\left(\frac{1}{2}\right)^2". */
function squareTex(f: Fmt, r: Rational): string {
	if (f.tall(r)) return `\\left(${f.n(r)}\\right)^2`;
	return r.sign() < 0 || !r.isInteger() ? `(${f.n(r)})^2` : `${f.n(r)}^2`;
}

/**
 * The lines from num/den to its value: "\dfrac{6}{4}" then "\frac{3}{2}" for whole numbers, "1,5 : 2" then "0,75"
 * otherwise. The first line has no "=" in front, the others do; the last is highlighted. `minus` puts a minus in front
 * of each.
 */
function quotientLines(f: Fmt, num: Rational, den: Rational, minus = false): string[] {
	const value = minus ? num.div(den).neg() : num.div(den);
	const s = minus ? '-' : '';
	const first = num.isInteger() && den.isInteger() ? `${s}\\dfrac{${f.n(num)}}{${f.n(den)}}` : `${s}${minus ? f.p(num) : f.n(num)} : ${f.p(den)}`;
	const last = `\\hl{${f.n(value)}}`;
	// A fraction already in lowest terms, with a positive denominator, is the value itself.
	const same = num.isInteger() && den.isInteger() && num.num > 0 && den.num > 0 && gcd(num.num, den.num) === 1 && den.num !== 1 && !minus && f.tall(value);
	return same ? [`\\hl{${first}}`] : [first, last];
}

/** Joins lines into a chain: the first as it is, the others after "=", repeated lines dropped. */
function chain(head: string, lines: string[]): string[] {
	const out: string[] = [];
	let prev = '';
	for (const line of lines) {
		// \dfrac and \frac look the same on a line of their own.
		const plain = line.replace(/\\hl\{(.*)\}$/, '$1').replace(/\\dfrac/g, '\\frac');
		if (plain === prev) {
			if (line.startsWith('\\hl{') && out.length) out[out.length - 1] = out[out.length - 1].replace(/^(= |.* = )(.*)$/, '$1\\hl{$2}');
			continue;
		}
		out.push(out.length === 0 ? `${head} = ${line}` : `= ${line}`);
		prev = plain;
	}
	return out;
}


/** A decimal approximation of a real number, two decimals as at school (four when it is below 0,01). */
function approx(v: number): { tex: string; text: string } {
	const digits = Math.abs(v) < 0.01 && v !== 0 ? 4 : 2;
	const s = Math.abs(v).toFixed(digits);
	const [int, frac] = s.split('.');
	const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int;
	const sign = v < 0 && Number(s) !== 0 ? '-' : '';
	return { tex: `${sign}${grouped.replace(/ /g, '\\,')}{,}${frac}`, text: `${sign}${grouped.replace(/ /g, ' ')},${frac}` };
}

/** A radical for the copy text: "3√5", "√97/6". */
const surdText = (s: Surd) => s.toString().replace(/\*?sqrt\((\d+)\)/g, '√$1');

// ---------------------------------------------------------------------------------------------------------------
// Steps grouped when more than five.

type PartStep = Step & { part?: string };

function grouped(steps: PartStep[]): Step[] {
	const group = steps.length > 5;
	return steps.map(({ part, ...step }, i) => (group && part && (i === 0 || steps[i - 1].part !== part) ? { group: part, ...step } : step));
}

// ---------------------------------------------------------------------------------------------------------------
// Distance and midpoint.

export interface PointsInput {
	xa: string;
	ya: string;
	xb: string;
	yb: string;
}

function readTwo(i: PointsInput): [Pt, Pt] | string {
	const A = readPoint('A', i.xa, i.ya, ['1', '2']);
	if (typeof A === 'string') return A;
	const B = readPoint('B', i.xb, i.yb, ['4', '6']);
	if (typeof B === 'string') return B;
	return [A, B];
}

/** √(n/d) simplified, with the lines that get there from "\sqrt{n/d}". */
function sqrtLines(f: Fmt, R: Rational): { lines: string[]; value: Surd; say: string } {
	const [n, d] = [R.num, R.den];
	if (n * d > MAX_RADICAND) throw new Error('radicand too large');
	const value = Surd.of(0, 1, n * d, d);
	const lines = [`\\sqrt{${f.n(R)}}`];
	const exact = exactSqrt(R);
	if (exact) return { lines: [...lines, f.n(exact)], value, say: 'Estrai la radice quadrata.' };
	let say = 'Estrai la radice quadrata.';
	if (d === 1) {
		const { k, r } = sqrtParts(n);
		if (k > 1) lines.push(`\\sqrt{${k * k} \\cdot ${r}}`);
		say = k > 1 ? 'Estrai la radice e porta fuori i fattori quadrati.' : `Il numero $${n}$ non ha fattori quadrati: la radice resta.`;
	} else {
		const root = exactSqrt(q(d));
		if (root) {
			lines.push(`\\dfrac{\\sqrt{${n}}}{${root.num}}`);
			say = 'Estrai la radice del numeratore e quella del denominatore.';
		} else {
			lines.push(`\\dfrac{\\sqrt{${n}}}{\\sqrt{${d}}}`, `\\dfrac{\\sqrt{${n}} \\cdot \\sqrt{${d}}}{${d}}`, `\\dfrac{\\sqrt{${n * d}}}{${d}}`);
			say = 'Estrai la radice e razionalizza il denominatore.';
		}
	}
	lines.push(value.toLatex());
	return { lines, value, say };
}

function pointsPlot(A: Pt, B: Pt): Plot {
	return {
		points: [
			{ name: 'A', x: val(A[0]), y: val(A[1]) },
			{ name: 'B', x: val(B[0]), y: val(B[1]) }
		],
		segments: [{ from: [val(A[0]), val(A[1])], to: [val(B[0]), val(B[1])], main: true }],
		lines: [],
		equal: true
	};
}

export function distanza(i: PointsInput): CartesianResult {
	const read = readTwo(i);
	if (typeof read === 'string') return failed(read);
	const [[xa, ya], [xb, yb]] = read;
	const f = makeFmt([i.xa, i.ya, i.xb, i.yb]);
	return guard(() => {
		const dx = xb.sub(xa);
		const dy = yb.sub(ya);
		const plot = pointsPlot([xa, ya], [xb, yb]);
		const row = (label: string, v: string) => ({ label, value: v });

		if (dx.isZero() && dy.isZero())
			return {
				outcome: { ok: true, rows: [row('Distanza tra A e B', '$\\overline{AB} = 0$')], copy: '0', steps: [{ say: 'I due punti coincidono: la loro distanza è $0$.', math: ['\\overline{AB} = 0'] }] },
				plot,
				check: { d: 0 }
			};

		if (dx.isZero() || dy.isZero()) {
			const vertical = dx.isZero();
			const [v, c1, c2, diff] = vertical ? ['y', ya, yb, dy] : ['x', xa, xb, dx];
			const d = diff.abs();
			return {
				outcome: {
					ok: true,
					rows: [row('Distanza tra A e B', `$\\overline{AB} = ${f.n(d)}$`)],
					copy: f.t(d),
					steps: [
						{
							say: vertical ? 'I due punti hanno la stessa ascissa: il segmento è verticale.' : 'I due punti hanno la stessa ordinata: il segmento è orizzontale.',
							then: vertical ? 'La distanza è la differenza delle ordinate, presa senza segno.' : 'La distanza è la differenza delle ascisse, presa senza segno.'
						},
						{
							say: vertical ? 'Sottrai le ordinate e prendi il valore assoluto.' : 'Sottrai le ascisse e prendi il valore assoluto.',
							math: chain('\\overline{AB}', [`|${v}_B - ${v}_A|`, `|${f.n(c2)} - ${f.p(c1)}|`, `|${f.n(diff)}|`, `\\hl{${f.n(d)}}`])
						}
					]
				},
				plot,
				check: { d: val(d) }
			};
		}

		const [dx2, dy2] = [dx.mul(dx), dy.mul(dy)];
		const R = dx2.add(dy2);
		const sum: string[] = [`\\sqrt{${f.n(dx2)} + ${f.n(dy2)}}`];
		// Fractions are brought to a common denominator; decimals are added as they are.
		if (f.tall(dx2) || f.tall(dy2)) {
			const L = lcm(dx2.den, dy2.den);
			sum.push(`\\sqrt{\\dfrac{${dx2.num * (L / dx2.den)} + ${dy2.num * (L / dy2.den)}}{${L}}}`);
		}
		sum.push(`\\sqrt{\\hl{${f.n(R)}}}`);
		const root = sqrtLines(f, R);
		const rootLines = root.lines.map((l, k) => (k === root.lines.length - 1 ? `\\hl{${l}}` : l));
		const d = root.value;
		const rational = d.isRational();
		const dv = d.value();
		const exactTex = rational ? f.n(d.toRational()) : d.toLatex();
		const ap = approx(dv);
		const steps: Step[] = [
			{
				say: 'Scrivi la formula della distanza e sostituisci le coordinate.',
				math: chain('\\overline{AB}', [`\\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}`, `\\sqrt{\\left(${f.n(xb)} - ${f.p(xa)}\\right)^2 + \\left(${f.n(yb)} - ${f.p(ya)}\\right)^2}`])
			},
			{ say: 'Calcola le differenze dentro le parentesi.', math: chain('\\overline{AB}', [`\\sqrt{${squareTex(f, dx)} + ${squareTex(f, dy)}}`]) },
			{ say: 'Calcola i quadrati e sommali.', math: chain('\\overline{AB}', sum) },
			{
				say: root.say,
				math: [...chain('\\overline{AB}', rootLines), ...(rational && decimal(d.toRational(), 4).exact ? [] : [`\\approx ${ap.tex}`])]
			}
		];
		return {
			outcome: {
				ok: true,
				rows: [row('Distanza tra A e B', `$\\overline{AB} = ${exactTex}$${rational && decimal(d.toRational(), 4).exact ? '' : ` $\\approx ${ap.tex}$`}`)],
				copy: rational && decimal(d.toRational(), 4).exact ? f.t(d.toRational()) : `${rational ? d.toRational().toString() : surdText(d)} ≈ ${ap.text}`,
				steps
			},
			plot: { ...plot, segments: [...plot.segments, { from: [val(xa), val(ya)], to: [val(xb), val(ya)] }, { from: [val(xb), val(ya)], to: [val(xb), val(yb)] }] },
			check: { d: dv }
		};
	});
}

/** The lines for one coordinate of the midpoint: x_M = (x_A + x_B)/2. */
function midLines(f: Fmt, v: 'x' | 'y', a: Rational, b: Rational): string[] {
	const s = a.add(b);
	const lines = [`\\dfrac{${v}_A + ${v}_B}{2}`, `\\dfrac{${f.n(a)} + ${f.p(b)}}{2}`, ...quotientLines(f, s, q(2))];
	return chain(`${v}_M`, lines);
}

export function puntoMedio(i: PointsInput): CartesianResult {
	const read = readTwo(i);
	if (typeof read === 'string') return failed(read);
	const [[xa, ya], [xb, yb]] = read;
	const f = makeFmt([i.xa, i.ya, i.xb, i.yb]);
	return guard(() => {
		const [xm, ym] = [xa.add(xb).div(q(2)), ya.add(yb).div(q(2))];
		const plot = pointsPlot([xa, ya], [xb, yb]);
		plot.points.push({ name: 'M', x: val(xm), y: val(ym), main: true });
		const same = xa.equals(xb) && ya.equals(yb);
		return {
			outcome: {
				ok: true,
				rows: [{ label: 'Punto medio del segmento AB', value: `$${f.pt('M', xm, ym)}$` }],
				copy: f.ptText('M', xm, ym),
				steps: [
					{ say: "Somma le ascisse di $A$ e $B$ e dividi per $2$.", math: midLines(f, 'x', xa, xb) },
					{ say: 'Somma le ordinate e dividi per $2$.', math: midLines(f, 'y', ya, yb), then: same ? `I due punti coincidono, quindi $M$ è lo stesso punto.` : `Il punto medio è $${f.pt('M', xm, ym)}$.` }
				]
			},
			plot,
			check: { x: val(xm), y: val(ym) }
		};
	});
}

// ---------------------------------------------------------------------------------------------------------------
// Lines.

export type RettaMode = 'punti' | 'pendenza' | 'parallela' | 'perpendicolare';

export interface RettaInput extends PointsInput {
	mode: RettaMode;
	/** The slope, in the mode 'pendenza'. */
	m: string;
	/** The given line, in the modes 'parallela' and 'perpendicolare'. */
	r: string;
}

/** Integer coefficients a, b, c of a·x + b·y + c = 0, without common factors, with a (or b) positive. */
interface Implicit {
	a: number;
	b: number;
	c: number;
}

/**
 * From y = mx + q (or x = h when `m` is null) to the implicit form with integer coefficients, as in the lesson
 * equazione-di-una-retta: multiply by the lcm of the denominators, bring everything to the left, make a positive.
 */
function implicitStep(f: Fmt, line: { m: Rational; q: Rational } | { h: Rational }): { step: Step; imp: Implicit } {
	const lines: string[] = [];
	let A: Rational, B: Rational, C: Rational;
	let L: number;
	if ('h' in line) {
		L = line.h.den;
		lines.push(`x = ${f.n(line.h)}`);
		if (L > 1) lines.push(`${L}x = ${f.n(line.h.mul(q(L)))}`);
		[A, B, C] = [q(L), ZERO, line.h.mul(q(L)).neg()];
	} else {
		L = lcm(line.m.den, line.q.den);
		lines.push(explicitTex(f, line.m, line.q));
		if (L > 1) lines.push(`${L}y = ${sumTex(f, [[line.m.mul(q(L)), 'x'], [line.q.mul(q(L)), '']])}`);
		[A, B, C] = [line.m.mul(q(L)).neg(), q(L), line.q.mul(q(L)).neg()];
	}
	const eq = (a: Rational, b: Rational, c: Rational) => `${sumTex(f, [[a, 'x'], [b, 'y'], [c, '']])} = 0`;
	lines.push(eq(A, B, C));
	let flipped = false;
	if (A.sign() < 0 || (A.isZero() && B.sign() < 0)) {
		[A, B, C] = [A.neg(), B.neg(), C.neg()];
		lines.push(eq(A, B, C));
		flipped = true;
	}
	const g = gcd(gcd(A.num, B.num), C.num);
	if (g > 1) {
		[A, B, C] = [A, B, C].map((x) => x.div(q(g)));
		lines.push(eq(A, B, C));
	}
	if (lines[lines.length - 1] === lines[lines.length - 2]) lines.pop();
	lines[lines.length - 1] = eq(A, B, C).replace(/^(.*) = 0$/, '\\hl{$1} = 0');
	const say = L > 1 ? `Moltiplica per $${L}$ e porta tutti i termini a primo membro.` : 'Porta tutti i termini a primo membro.';
	const thenParts = [];
	if (flipped) thenParts.push(A.isZero() ? 'Cambiando tutti i segni, il coefficiente di $y$ diventa positivo.' : 'Cambiando tutti i segni, il coefficiente di $x$ diventa positivo.');
	if (g > 1) thenParts.push(`I coefficienti si dividono tutti per $${g}$.`);
	return {
		step: { say, math: lines, then: thenParts.length ? thenParts.join(' ') : 'È la forma implicita, con i coefficienti interi.' },
		imp: { a: A.num, b: B.num, c: C.num }
	};
}

/** The line through P = (x0, y0) with slope m: y - y0 = m(x - x0), then y = mx + q. */
function pointSlopeSteps(f: Fmt, name: string, [x0, y0]: Pt, m: Rational): { steps: Step[]; q: Rational } {
	const qq = y0.sub(m.mul(x0));
	const lhs = sumTex(f, [[q(1), 'y'], [y0.neg(), '']]);
	const factor = x0.isZero() ? 'x' : `(${sumTex(f, [[q(1), 'x'], [x0.neg(), '']])})`;
	const mTex = m.isOne() ? '' : m.equals(q(-1)) ? '-' : f.n(m);
	const rhs = x0.isZero() ? sumTex(f, [[m, 'x']]) : `${mTex}${factor}`;
	const steps: Step[] = [
		{
			say: `Scrivi la retta per $${name}$ con coefficiente angolare $m$.`,
			math: [`y - y_${name} = m(x - x_${name})`, `${lhs} = ${rhs}`]
		}
	];
	const solve: string[] = [];
	if (!x0.isZero() && !m.isOne()) solve.push(`${lhs} = ${sumTex(f, [[m, 'x'], [m.mul(x0).neg(), '']])}`);
	if (!y0.isZero()) solve.push(`y = ${sumTex(f, [[m, 'x'], [m.mul(x0).neg(), ''], [y0, '']])}`);
	const final = `y = \\hl{${sumTex(f, [[m, 'x'], [qq, '']])}}`;
	if (solve.length || !x0.isZero()) {
		if (solve[solve.length - 1] !== final.replace(/\\hl\{(.*)\}$/, '$1')) solve.push(final);
		else solve[solve.length - 1] = final;
		steps.push({ say: 'Svolgi i calcoli e ricava $y$.', math: solve, then: 'È la forma esplicita della retta.' });
	}
	return { steps, q: qq };
}

type Term = { c: Rational; v: '' | 'x' | 'y' };

/**
 * A line typed by the student: "y = 2x + 1", "3x - 2y + 6 = 0", "x = 4", "y = -x/2 + 3". Each side is a sum of
 * terms: a number, a number times x or y (2x, 2/3x, 1,5y), or x or y over a number (x/2).
 */
export function parseLine(input: string): { lhs: Term[]; rhs: Term[] } | null {
	const text = input
		.trim()
		.replace(/^[a-zA-Z]\s*:\s*/, '')
		.replace(/\s+/g, '')
		.replace(/[−–]/g, '-')
		.replace(/[*·]/g, '')
		.toLowerCase();
	if (!text || text.length > 80) return null;
	const sides = text.split('=');
	if (sides.length !== 2 || !sides[0] || !sides[1]) return null;
	const side = (s: string): Term[] | null => {
		const out: Term[] = [];
		const re = /([+-])?(\d+(?:[.,]\d+)?)?(?:\/(\d+(?:[.,]\d+)?))?([xy])?(?:\/(\d+))?/y;
		let pos = 0;
		while (pos < s.length) {
			re.lastIndex = pos;
			const m = re.exec(s);
			if (!m || m[0] === '' || (!m[2] && !m[4]) || (m[3] && !m[2]) || (m[5] && !m[4]) || (!m[1] && out.length)) return null;
			let c = parseConstant(`${m[2] ?? '1'}${m[3] ? `/${m[3]}` : ''}`);
			if (!(c instanceof Rational)) return null;
			if (m[5]) c = c.div(q(Number(m[5])));
			if (m[1] === '-') c = c.neg();
			out.push({ c, v: (m[4] ?? '') as Term['v'] });
			pos = re.lastIndex;
		}
		return out;
	};
	const lhs = side(sides[0]);
	const rhs = side(sides[1]);
	return lhs && rhs ? { lhs, rhs } : null;
}

const termsTex = (f: Fmt, ts: Term[]) => sumTex(f, ts.map((t): [Rational, string] => [t.c, t.v]));

/** The slope of the given line r, with the steps that find it. Vertical: m null. */
function givenLine(f: Fmt, input: string): { steps: Step[]; m: Rational | null; h?: Rational; a: Rational; b: Rational; c: Rational } | string {
	const example = 'Scrivi la retta r come equazione in x e y, per esempio y = 2x + 1 oppure 3x - 2y + 6 = 0.';
	const parsed = parseLine(input);
	if (!parsed) return input.trim() ? `Non riesco a leggere la retta r. ${example}` : example;
	let [a, b, c] = [ZERO, ZERO, ZERO];
	for (const [ts, s] of [
		[parsed.lhs, 1],
		[parsed.rhs, -1]
	] as const)
		for (const t of ts) {
			const k = t.c.mul(q(s));
			if (t.v === 'x') a = a.add(k);
			else if (t.v === 'y') b = b.add(k);
			else c = c.add(k);
		}
	if (a.isZero() && b.isZero()) return `Nell'equazione di r non restano né x né y: non è una retta. ${example}`;
	if ([a, b, c].some((x) => Math.abs(x.num) > LIMIT * x.den || x.den > MAX_DEN)) return 'I coefficienti della retta r sono troppo grandi: usa numeri tra -10 000 e 10 000.';
	const typed = `r\\colon\\ ${termsTex(f, parsed.lhs)} = ${termsTex(f, parsed.rhs)}`;
	const explicit = parsed.lhs.length === 1 && parsed.lhs[0].v === 'y' && parsed.lhs[0].c.isOne() && parsed.rhs.every((t) => t.v !== 'y');
	if (b.isZero()) {
		const h = c.neg().div(a);
		const lines = [typed];
		const plain = parsed.lhs.length === 1 && parsed.lhs[0].v === 'x' && parsed.lhs[0].c.isOne() && parsed.rhs.every((t) => t.v === '');
		if (!plain) lines.push(`x = \\hl{${f.n(h)}}`);
		return { steps: [{ say: 'Nell’equazione di $r$ non c’è la $y$: la retta $r$ è verticale.', math: lines, then: 'Una retta verticale non ha coefficiente angolare.' }], m: null, h, a, b, c };
	}
	const m = a.div(b).neg();
	const qq = c.div(b).neg();
	if (explicit) return { steps: [{ say: 'La retta $r$ è in forma esplicita: $m$ è il coefficiente di $x$.', math: [typed, `m_r = \\hl{${f.n(m)}}`] }], m, a, b, c };
	const lines = [typed];
	if (!b.isOne()) lines.push(`${b.equals(q(-1)) ? '-' : f.n(b)}y = ${sumTex(f, [[a.neg(), 'x'], [c.neg(), '']])}`);
	lines.push(explicitTex(f, m, qq));
	return {
		steps: [
			{ say: 'Ricava $y$ dall’equazione di $r$.', math: lines },
			{ say: 'Il coefficiente angolare di $r$ è il coefficiente di $x$.', math: [`m_r = \\hl{${f.n(m)}}`] }
		],
		m,
		a,
		b,
		c
	};
}

const MODE_EXAMPLE: Record<RettaMode, { xa: string; ya: string; xb?: string; yb?: string }> = {
	punti: { xa: '1', ya: '1', xb: '4', yb: '3' },
	pendenza: { xa: '2', ya: '-1' },
	parallela: { xa: '1', ya: '4' },
	perpendicolare: { xa: '3', ya: '1' }
};

export function retta(i: RettaInput): CartesianResult {
	const mode = i.mode;
	const two = mode === 'punti';
	const pName = two ? 'A' : 'P';
	const ex = MODE_EXAMPLE[mode];
	const P = readPoint(pName, i.xa, i.ya, [ex.xa, ex.ya]);
	if (typeof P === 'string') return failed(P);
	let B: Pt | null = null;
	if (two) {
		const b = readPoint('B', i.xb, i.yb, ['4', '3']);
		if (typeof b === 'string') return failed(b);
		B = b;
	}
	let given: Rational | null = null;
	if (mode === 'pendenza') {
		const m = readNumber(i.m, 'il coefficiente angolare', '1/2');
		if (typeof m === 'string') return failed(m);
		given = m;
	}
	const f = makeFmt([i.xa, i.ya, ...(two ? [i.xb, i.yb] : []), ...(mode === 'pendenza' ? [i.m] : []), ...(mode === 'parallela' || mode === 'perpendicolare' ? [i.r] : [])]);

	return guard(() => {
		const [x0, y0] = P;
		const steps: PartStep[] = [];
		const plot: Plot = { points: [{ name: pName, x: val(x0), y: val(y0) }], segments: [], lines: [], equal: true };
		let m: Rational | null = null;
		let vertical: Rational | null = null;
		let onR = false;

		if (two && B) {
			const [xb, yb] = B;
			plot.points.push({ name: 'B', x: val(xb), y: val(yb) });
			if (xb.equals(x0) && yb.equals(y0)) return failed('I due punti coincidono: per un punto solo passano infinite rette. Scrivi due punti diversi.');
			const [dx, dy] = [xb.sub(x0), yb.sub(y0)];
			if (dx.isZero()) {
				vertical = x0;
				steps.push({ part: 'Il coefficiente angolare', say: 'I due punti hanno la stessa ascissa: la retta è verticale.', math: [`x = \\hl{${f.n(x0)}}`], then: 'Una retta verticale non ha coefficiente angolare.' });
			} else {
				m = dy.div(dx);
				const lines = [`\\dfrac{y_B - y_A}{x_B - x_A}`, `\\dfrac{${f.n(yb)} - ${f.p(y0)}}{${f.n(xb)} - ${f.p(x0)}}`, ...quotientLines(f, dy, dx)];
				steps.push({
					part: 'Il coefficiente angolare',
					say: 'Calcola il coefficiente angolare con le coordinate di $A$ e $B$.',
					math: chain('m', lines),
					then: m.isZero() ? 'Il coefficiente angolare è $0$: la retta è orizzontale.' : m.sign() > 0 ? 'Il coefficiente angolare è positivo: la retta sale.' : 'Il coefficiente angolare è negativo: la retta scende.'
				});
			}
		} else if (mode === 'pendenza') {
			m = given;
		} else {
			const r = givenLine(f, i.r);
			if (typeof r === 'string') return failed(r);
			for (const s of r.steps) steps.push({ part: 'La retta r', ...s });
			plot.lines.push({ a: val(r.a), b: val(r.b), c: val(r.c), name: 'r' });
			onR = r.a.mul(x0).add(r.b.mul(y0)).add(r.c).isZero();
			const parallel = mode === 'parallela';
			const itself = parallel && onR ? ' Il punto $P$ sta già su $r$: la parallela per $P$ è $r$ stessa.' : '';
			if (r.m === null) {
				// r vertical: the parallel is vertical, the perpendicular horizontal.
				if (parallel) {
					vertical = x0;
					steps.push({ part: 'La retta cercata', say: 'La parallela a una retta verticale è verticale.', math: [`x = \\hl{${f.n(x0)}}`], then: `Passa per $P$, quindi ha la stessa ascissa di $P$.${itself}` });
				} else {
					m = ZERO;
					steps.push({ part: 'La retta cercata', say: 'La perpendicolare a una retta verticale è orizzontale.', math: ['m = \\hl{0}'] });
				}
			} else if (r.m.isZero()) {
				if (parallel) {
					m = ZERO;
					steps.push({ part: 'La retta cercata', say: 'La parallela a una retta orizzontale è orizzontale.', math: ['m = m_r = \\hl{0}'], then: itself.trim() || undefined });
				} else {
					vertical = x0;
					steps.push({ part: 'La retta cercata', say: 'La perpendicolare a una retta orizzontale è verticale.', math: [`x = \\hl{${f.n(x0)}}`], then: 'Passa per $P$, quindi ha la stessa ascissa di $P$.' });
				}
			} else if (parallel) {
				m = r.m;
				steps.push({ part: 'La retta cercata', say: 'Due rette parallele hanno lo stesso coefficiente angolare.', math: [`m = m_r = \\hl{${f.n(m)}}`], then: itself.trim() || undefined });
			} else {
				m = q(-1).div(r.m);
				const lines = ['m \\cdot m_r = -1', ...chain('m', ['-\\dfrac{1}{m_r}', ...(f.tall(r.m) ? [] : [`-\\dfrac{1}{${f.n(r.m)}}`]), `\\hl{${f.n(m)}}`])];
				steps.push({ part: 'La retta cercata', say: 'La perpendicolare ha il coefficiente angolare antireciproco di $m_r$.', math: lines, then: 'Antireciproco vuol dire capovolto e con il segno cambiato.' });
			}
		}

		const rows: { label: string; value: string }[] = [];
		const copy: string[] = [];
		let imp: Implicit;
		if (vertical) {
			const s = implicitStep(f, { h: vertical });
			imp = s.imp;
			steps.push({ part: 'La forma implicita', ...s.step });
			rows.push({ label: 'Coefficiente angolare', value: 'Non esiste: la retta è verticale' });
			rows.push({ label: 'Equazione della retta', value: `$x = ${f.n(vertical)}$` });
			copy.push(`x = ${f.t(vertical)}`);
		} else {
			const slope = m ?? ZERO;
			let qq: Rational;
			if (slope.isZero()) {
				qq = y0;
				steps.push({ part: 'L’equazione', say: 'Con $m = 0$ la retta è orizzontale: $y$ è sempre l’ordinata del punto.', math: [`y = \\hl{${f.n(y0)}}`] });
			} else {
				const ps = pointSlopeSteps(f, pName, P, slope);
				qq = ps.q;
				for (const s of ps.steps) steps.push({ part: 'L’equazione', ...s });
			}
			const s = implicitStep(f, { m: slope, q: qq });
			imp = s.imp;
			steps.push({ part: 'La forma implicita', ...s.step });
			if (two && B && !slope.isZero()) {
				const [xb, yb] = B;
				const sub = `${slope.isOne() ? '' : slope.equals(q(-1)) ? '-' : `${f.n(slope)} \\cdot `}${f.p(xb)}`;
				steps.push({
					part: 'La verifica',
					say: 'Controlla: sostituisci le coordinate di $B$ nella forma esplicita.',
					math: [`${sub}${qq.isZero() ? '' : ` ${qq.sign() < 0 ? '-' : '+'} ${f.n(qq.abs())}`} = \\hl{${f.n(yb)}}`],
					then: 'Viene l’ordinata di $B$: la retta passa anche per $B$.'
				});
			}
			rows.push({ label: 'Coefficiente angolare', value: `$m = ${f.n(slope)}$` });
			rows.push({ label: 'Equazione in forma esplicita', value: `$${explicitTex(f, slope, qq)}$` });
			copy.push(explicitText(f, slope, qq));
		}
		const impTex = `${sumTex(f, [[q(imp.a), 'x'], [q(imp.b), 'y'], [q(imp.c), '']])} = 0`;
		rows.push({ label: 'Equazione in forma implicita', value: `$${impTex}$` });
		copy.push(`${sumText(f, [[q(imp.a), 'x'], [q(imp.b), 'y'], [q(imp.c), '']])} = 0`);
		plot.lines.unshift({ a: imp.a, b: imp.b, c: imp.c, name: two || mode === 'pendenza' ? undefined : 's', main: true });
		return { outcome: { ok: true, rows, copy: copy.join('; '), steps: grouped(steps) }, plot, check: { a: imp.a, b: imp.b, c: imp.c } };
	});
}

// ---------------------------------------------------------------------------------------------------------------
// The parabola y = ax² + bx + c.

export interface ParabolaInput {
	a: string;
	b: string;
	c: string;
}

export function parabola(i: ParabolaInput): CartesianResult {
	const a = readNumber(i.a, 'il coefficiente a', '1');
	if (typeof a === 'string') return failed(a);
	const b = readNumber(i.b, 'il coefficiente b', '-4', true);
	if (typeof b === 'string') return failed(b);
	const c = readNumber(i.c, 'il coefficiente c', '3', true);
	if (typeof c === 'string') return failed(c);
	if (a.isZero()) return failed('Con a = 0 l’equazione è quella di una retta, non di una parabola. Scrivi un valore di a diverso da 0.');
	const f = makeFmt([i.a, i.b, i.c]);

	return guard(() => {
		const steps: PartStep[] = [];
		const up = a.sign() > 0;
		const eqTex = `y = ${sumTex(f, [[a, 'x^2'], [b, 'x'], [c, '']])}`;

		// Concavity.
		steps.push({
			part: 'La concavità',
			say: 'Guarda il segno di $a$, il coefficiente di $x^2$.',
			math: [eqTex, `a = ${f.n(a)} ${up ? '> 0' : '< 0'}`],
			then: up ? 'Con $a$ positivo la concavità è verso l’alto: il vertice è il punto più basso.' : 'Con $a$ negativo la concavità è verso il basso: il vertice è il punto più alto.'
		});

		// Vertex and axis.
		const twoA = a.mul(q(2));
		const xv = b.div(twoA).neg();
		steps.push({
			part: 'Il vertice e l’asse',
			say: 'Calcola l’ascissa del vertice.',
			math: chain('x_V', ['-\\dfrac{b}{2a}', `-\\dfrac{${f.n(b)}}{2 \\cdot ${f.p(a)}}`, ...quotientLines(f, b, twoA, true)])
		});
		const [ta, tb] = [a.mul(xv).mul(xv), b.mul(xv)];
		const yv = ta.add(tb).add(c);
		// With a = -1 the product is written out: "-1^2" would read as (-1)².
		const aPart = a.isOne() ? squareTex(f, xv) : `${f.n(a)} \\cdot ${squareTex(f, xv)}`;
		const bPart = b.isZero() ? '' : ` ${b.sign() < 0 ? '-' : '+'} ${b.abs().isOne() ? '' : `${f.n(b.abs())} \\cdot `}${f.p(xv)}`;
		const cPart = c.isZero() ? '' : ` ${c.sign() < 0 ? '-' : '+'} ${f.n(c.abs())}`;
		const valuesLine = sumTex(f, [
			[ta, ''],
			[tb, ''],
			[c, '']
		]);
		steps.push({
			part: 'Il vertice e l’asse',
			say: 'Sostituisci $x_V$ nell’equazione per trovare $y_V$.',
			math: chain('y_V', [`${aPart}${bPart}${cPart}`, valuesLine, `\\hl{${f.n(yv)}}`]),
			then: `Il vertice è $${f.pt('V', xv, yv)}$.`
		});
		steps.push({ part: 'Il vertice e l’asse', say: 'L’asse di simmetria è la retta verticale che passa per il vertice.', math: [`x = \\hl{${f.n(xv)}}`] });

		// Focus and directrix.
		const delta = b.mul(b).sub(a.mul(c).mul(q(4)));
		const acPart = `4 \\cdot ${f.p(a)} \\cdot ${f.p(c)}`;
		steps.push({
			part: 'Fuoco e direttrice',
			say: 'Calcola il discriminante $\\Delta$.',
			math: chain('\\Delta', ['b^2 - 4ac', `${squareTex(f, b)} - ${acPart}`, sumTex(f, [[b.mul(b), ''], [a.mul(c).mul(q(-4)), '']]), `\\hl{${f.n(delta)}}`])
		});
		const fourA = a.mul(q(4));
		const yf = q(1).sub(delta).div(fourA);
		const yd = q(1).add(delta).div(fourA).neg();
		steps.push({
			part: 'Fuoco e direttrice',
			say: 'Il fuoco sta sull’asse: calcola la sua ordinata.',
			math: chain('y_F', ['\\dfrac{1 - \\Delta}{4a}', `\\dfrac{1 - ${f.p(delta)}}{4 \\cdot ${f.p(a)}}`, ...quotientLines(f, q(1).sub(delta), fourA)]),
			then: `Il fuoco è $${f.pt('F', xv, yf)}$.`
		});
		steps.push({
			part: 'Fuoco e direttrice',
			say: 'La direttrice è una retta orizzontale: calcola la sua $y$.',
			math: chain('y', ['-\\dfrac{1 + \\Delta}{4a}', `-\\dfrac{1 + ${f.p(delta)}}{4 \\cdot ${f.p(a)}}`, ...quotientLines(f, q(1).add(delta), fourA, true)]),
			then: 'Il vertice sta a metà strada tra il fuoco e la direttrice.'
		});

		// Intersections with the axes.
		const atZero = `${a.isOne() ? '' : `${f.n(a)} \\cdot `}0^2${b.isZero() ? '' : ` ${b.sign() < 0 ? '-' : '+'} ${b.abs().isOne() ? '' : `${f.n(b.abs())} \\cdot `}0`}${cPart}`;
		steps.push({ part: 'Le intersezioni con gli assi', say: 'Per l’asse $y$ poni $x = 0$.', math: [`y = ${atZero}`, `= \\hl{${f.n(c)}}`], then: `La parabola taglia l’asse $y$ in $${f.pt('', ZERO, c)}$.` });
		const L = lcm(a.den, lcm(b.den, c.den));
		const [A, B, C] = [a, b, c].map((x) => x.mul(q(L)).num);
		const zeroLines = [`${sumTex(f, [[a, 'x^2'], [b, 'x'], [c, '']])} = 0`];
		if (L > 1) zeroLines.push(`${sumTex(f, [[q(A), 'x^2'], [q(B), 'x'], [q(C), '']])} = 0`);
		const roots = quadraticRoots([q(C), q(B), q(A)]);
		const D = B * B - 4 * A * C;
		const rootTex = (s: Surd) => (s.isRational() ? f.n(s.toRational()) : s.toLatex());
		let crossText: string;
		let crossCopy: string;
		const crossPoints: [number, number][] = [];
		if (roots.length === 0) {
			zeroLines.push(`\\Delta = ${L > 1 ? `${D}` : f.n(delta)} < 0`);
			crossText = 'Nessuna: la parabola non taglia l’asse x';
			crossCopy = 'nessuna';
			steps.push({ part: 'Le intersezioni con gli assi', say: 'Per l’asse $x$ poni $y = 0$ e risolvi l’equazione.', math: zeroLines, then: 'Il discriminante è negativo: la parabola non taglia l’asse $x$.' });
		} else if (roots.length === 1) {
			zeroLines.push(`x = -\\dfrac{${B}}{${2 * A}} = \\hl{${rootTex(roots[0])}}`);
			crossText = `$${f.pt('', roots[0].toRational(), ZERO)}$, nel vertice`;
			crossCopy = f.ptText('', roots[0].toRational(), ZERO);
			crossPoints.push([roots[0].value(), 0]);
			steps.push({ part: 'Le intersezioni con gli assi', say: 'Per l’asse $x$ poni $y = 0$ e risolvi l’equazione.', math: zeroLines, then: 'Il discriminante è $0$: la parabola tocca l’asse $x$ nel vertice.' });
		} else {
			const lines = [`x = \\dfrac{${-B} \\pm \\sqrt{${D}}}{${2 * A}}`];
			const { k, r } = sqrtParts(D);
			if (r === 1) lines.push(`= \\dfrac{${-B} \\pm ${k}}{${2 * A}}`);
			else if (k > 1) lines.push(`= \\dfrac{${-B} \\pm ${k}\\sqrt{${r}}}{${2 * A}}`);
			roots.forEach((s, j) => lines.push(`x_${j + 1} = \\hl{${rootTex(s)}}${s.isRational() && decimal(s.toRational(), 4).exact ? '' : ` \\approx ${approx(s.value()).tex}`}`));
			steps.push({ part: 'Le intersezioni con gli assi', say: 'Per l’asse $x$ poni $y = 0$ e risolvi l’equazione.', math: [...zeroLines, ...lines] });
			const pt = (s: Surd) => (s.isRational() ? f.pt('', s.toRational(), ZERO) : `\\left(${s.toLatex()}${f.sep}0\\right)`);
			const ptCopy = (s: Surd) => (s.isRational() ? f.ptText('', s.toRational(), ZERO) : `(${surdText(s)}; 0)`);
			crossText = `$${pt(roots[0])}$ e $${pt(roots[1])}$`;
			crossCopy = `${ptCopy(roots[0])} e ${ptCopy(roots[1])}`;
			for (const s of roots) crossPoints.push([s.value(), 0]);
		}

		const plot: Plot = {
			points: [
				{ name: 'V', x: val(xv), y: val(yv), main: true, side: 'left' },
				{ name: 'F', x: val(xv), y: val(yf), side: 'right' },
				{ name: '', x: 0, y: val(c) },
				...crossPoints.filter(([x]) => Math.abs(x - val(xv)) > 1e-12 || Math.abs(val(yv)) > 1e-12).map(([x, y]) => ({ name: '', x, y }))
			],
			segments: [],
			lines: [
				{ a: 1, b: 0, c: -val(xv) },
				{ a: 0, b: 1, c: -val(yd), name: 'd' }
			],
			parabola: { a: val(a), b: val(b), c: val(c) },
			equal: false
		};
		return {
			outcome: {
				ok: true,
				rows: [
					{ label: 'Concavità', value: up ? 'Verso l’alto' : 'Verso il basso' },
					{ label: 'Vertice', value: `$${f.pt('V', xv, yv)}$` },
					{ label: 'Asse di simmetria', value: `$x = ${f.n(xv)}$` },
					{ label: 'Fuoco', value: `$${f.pt('F', xv, yf)}$` },
					{ label: 'Direttrice', value: `$y = ${f.n(yd)}$` },
					{ label: 'Intersezione con l’asse y', value: `$${f.pt('', ZERO, c)}$` },
					{ label: 'Intersezioni con l’asse x', value: crossText }
				],
				copy: [f.ptText('V', xv, yv), f.ptText('F', xv, yf), `direttrice y = ${f.t(yd)}`, `asse x = ${f.t(xv)}`].join('; '),
				steps: grouped(steps)
			},
			plot,
			check: { xv: val(xv), yv: val(yv), yf: val(yf), yd: val(yd), delta: val(delta), roots: roots.length, cross: crossCopy.length }
		};
	});
}
