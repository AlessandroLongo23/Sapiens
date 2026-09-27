/**
 * Rette parallele e perpendicolari (lesson slug rette-parallele-tra-loro). Spec: specs/exercises/rette-parallele-tra-loro.md
 *
 * Seven levels in the order of the lesson: the position of two lines (explicit, implicit, parallel to an
 * axis); the slope of the perpendiculars (the antireciprocal); the parameter k that makes a line parallel or
 * perpendicular to another; the line through a point parallel or perpendicular to a line in explicit form;
 * the same with the line in implicit form and the answer in implicit form, or with the line parallel to an
 * axis; the perpendicular bisector of a segment; the projection of a point on a line. Every exercise starts
 * from the answer (the slopes, the point H, the midpoint) and builds the data from it, so all numbers are
 * exact rationals with small denominators.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { buildChoice, weighted } from '../razionali';

export const ID = 'rette-parallele-tra-loro';

const t = (s: string) => `\\text{${s}}`;
const ZERO = q(0);
const ONE = q(1);

// ---------------------------------------------------------------------------
// Numbers and terms

/** A rational as LaTeX: \frac in the problem and in the options, \dfrac in the steps (inline). */
function fr(r: Rational, d = false): string {
	if (r.isInteger()) return String(r.num);
	return `${r.sign() < 0 ? '-' : ''}${d ? '\\dfrac' : '\\frac'}{${Math.abs(r.num)}}{${r.den}}`;
}

/** Negative numbers in brackets, for products and substitutions. */
function par(r: Rational, d = false): string {
	if (r.sign() >= 0) return fr(r, d);
	return r.isInteger() ? `(${fr(r, d)})` : `\\left(${fr(r, d)}\\right)`;
}

/** m·v: "x", "-x", "2x", "\frac{1}{2}x". */
function coefX(m: Rational, v: string, d = false): string {
	if (m.isOne()) return v;
	if (m.equals(q(-1))) return `-${v}`;
	return `${fr(m, d)}${v}`;
}

/** m x + c, by decreasing powers. */
function lin(m: Rational, c: Rational, d = false): string {
	if (m.isZero()) return fr(c, d);
	const head = coefX(m, 'x', d);
	if (c.isZero()) return head;
	return `${head} ${c.sign() < 0 ? '-' : '+'} ${fr(c.abs(), d)}`;
}

/** "v - c" / "v + c" / "v". */
function shift(v: string, c: Rational, d = false): string {
	if (c.isZero()) return v;
	return `${v} ${c.sign() > 0 ? '-' : '+'} ${fr(c.abs(), d)}`;
}

/** Integer terms with their letters: [[3, 'x'], [-4, 'y'], [2, '']] -> "3x - 4y + 2". Zero terms are left out. */
function terms(cs: [number, string][]): string {
	let out = '';
	for (const [c, v] of cs) {
		if (c === 0) continue;
		const a = Math.abs(c);
		const body = v === '' ? String(a) : a === 1 ? v : `${a}${v}`;
		if (out === '') out = (c < 0 ? '-' : '') + body;
		else out += `${c < 0 ? ' - ' : ' + '}${body}`;
	}
	return out === '' ? '0' : out;
}

const sym = (r: Rational) => (r.isInteger() ? String(r.num) : `(${r.num}/${r.den})`);

// ---------------------------------------------------------------------------
// Lines: ax + by + c = 0 with integer coefficients, reduced, a > 0 (or a = 0 and b > 0)

type Tri = [number, number, number];

function normTri(a: Rational, b: Rational, c: Rational): Tri {
	const L = lcm(lcm(a.den, b.den), c.den);
	let A = (a.num * L) / a.den;
	let B = (b.num * L) / b.den;
	let C = (c.num * L) / c.den;
	const g = gcd(gcd(A, B), C);
	if (g === 0) throw new Error(`${ID}: null line`);
	A /= g;
	B /= g;
	C /= g;
	if (A < 0 || (A === 0 && B < 0)) {
		A = -A;
		B = -B;
		C = -C;
	}
	return [A + 0, B + 0, C + 0];
}

/** The line y = m x + c. */
const explicitLine = (m: Rational, c: Rational): Tri => normTri(m, q(-1), c);
/** The line through (x0, y0) with slope m. */
const slopePoint = (m: Rational, x0: Rational, y0: Rational): Tri => explicitLine(m, y0.sub(m.mul(x0)));
const vertical = (h: Rational): Tri => normTri(ONE, ZERO, h.neg());
const horizontal = (k: Rational): Tri => normTri(ZERO, ONE, k.neg());

const isVertical = (l: Tri) => l[1] === 0;
const isHorizontal = (l: Tri) => l[0] === 0;
const slope = (l: Tri): Rational => q(-l[0], l[1]);
const intercept = (l: Tri): Rational => q(-l[2], l[1]);
const xOfVertical = (l: Tri): Rational => q(-l[2], l[0]);
const sameLine = (u: Tri, v: Tri) => u.join(',') === v.join(',');
const onLine = (l: Tri, x: Rational, y: Rational) => q(l[0]).mul(x).add(q(l[1]).mul(y)).add(q(l[2])).isZero();

/** y = m x + q, or x = h for a vertical line. */
function lineTex(l: Tri, d = false): string {
	if (isVertical(l)) return `x = ${fr(xOfVertical(l), d)}`;
	return `y = ${lin(slope(l), intercept(l), d)}`;
}

const implicitTex = (l: Tri, k = 1): string => `${terms([[l[0] * k, 'x'], [l[1] * k, 'y'], [l[2] * k, '']])} = 0`;

/** SymPy right-hand side of the explicit form. */
function sympyRhs(l: Tri): string {
	const m = slope(l);
	const c = intercept(l);
	if (m.isZero()) return sym(c);
	const head = m.isOne() ? 'x' : m.equals(q(-1)) ? '-x' : `${sym(m)}*x`;
	return c.isZero() ? head : `${head} ${c.sign() < 0 ? '-' : '+'} ${sym(c.abs())}`;
}

function intersect(u: Tri, v: Tri): [Rational, Rational] {
	const D = u[0] * v[1] - v[0] * u[1];
	if (D === 0) throw new Error(`${ID}: parallel lines have no intersection`);
	return [q(u[1] * v[2] - v[1] * u[2], D), q(v[0] * u[2] - u[0] * v[2], D)];
}

const lineOption = (l: Tri, tex: string): ChoiceOption => ({ latex: tex, values: l.map(String) });
const explicitOption = (l: Tri) => lineOption(l, lineTex(l));
/** Level 5: implicit form, but x = h and y = k for the lines parallel to an axis, as in example 5. */
const implicitOption = (l: Tri) => lineOption(l, isVertical(l) || isHorizontal(l) ? lineTex(l) : implicitTex(l));

function pointTex(name: string, x: Rational, y: Rational, d = false): string {
	if (x.isInteger() && y.isInteger()) return `${name}(${x.num}, ${y.num})`;
	return `${name}\\left(${fr(x, d)}, ${fr(y, d)}\\right)`;
}

const pointOption = (x: Rational, y: Rational): ChoiceOption => ({ latex: pointTex('H', x, y), values: [x.toString(), y.toString()] });
const numberOption = (r: Rational): ChoiceOption => ({ latex: fr(r), values: [r.toString()] });

/** Neighbours of a number, for the fallback of a choice. */
const near = (r: Rational) => (i: number) => numberOption(r.add(q(i % 2 === 0 ? i / 2 + 1 : -(i + 1) / 2)));

/** Fallback distractors: the same direction, the constant term moved by 1, -1, 2, -2, … */
const shifted = (l: Tri, i: number): Tri => normTri(q(l[0]), q(l[1]), q(l[2] + (i % 2 === 0 ? i / 2 + 1 : -(i + 1) / 2)));

/** The point-slope formula filled in: "y - 4 = 2(x - 1)". */
function pointSlopeTex(m: Rational, x0: Rational, y0: Rational): string {
	const rhs = x0.isZero() ? coefX(m, 'x', true) : m.isOne() ? shift('x', x0, true) : `${m.equals(q(-1)) ? '-' : fr(m, true)}(${shift('x', x0, true)})`;
	return `${shift('y', y0, true)} = ${rhs}`;
}

/** m·x0 + c written out, for the check that the point lies on the line: "2 \cdot 1 + 2". */
function valueTex(m: Rational, c: Rational, x0: number): string {
	const head = m.isOne() ? String(x0) : m.equals(q(-1)) ? `-${par(q(x0))}` : `${fr(m, true)} \\cdot ${par(q(x0))}`;
	if (c.isZero()) return head;
	return `${head} ${c.sign() < 0 ? '-' : '+'} ${fr(c.abs(), true)}`;
}

// ---------------------------------------------------------------------------
// Pools

const fracs = (xs: [number, number][]) => xs.flatMap(([n, d]) => [q(n, d), q(-n, d)]);
const ints = (xs: number[]) => xs.flatMap((n) => [q(n), q(-n)]);

/** Slopes of level 1: integers and the fractions of the lesson. */
const M1 = [...ints([1, 2, 3, 4]), ...fracs([[1, 2], [1, 3], [2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2]])];
/** Level 2: slopes without ±1, whose antireciprocal would coincide with the opposite. */
const M2 = [...ints([2, 3, 4, 5, 6]), ...fracs([[1, 2], [1, 3], [1, 4], [2, 3], [3, 2], [3, 4], [4, 3], [2, 5], [5, 2], [3, 5], [5, 3], [4, 5]])];
const M_INT = ints([1, 2, 3, 4]);
const M_SMALL = [...ints([1, 2, 3, 4]), ...fracs([[1, 2], [1, 3], [2, 3], [3, 2]])];

/** Integer in [a, b], not zero. */
function nz(rng: Rng, a: number, b: number): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
}

interface Built {
	prompt: string;
	problem: string;
	steps: string[];
	solution: string;
	answer: Sample['answer'];
	choice: ChoiceAnswer;
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Level 1: position of two lines

type Pos = 'parallele' | 'coincidenti' | 'perpendicolari' | 'incidenti';
const POS_TEXT: Record<Pos, string> = {
	parallele: 'parallele e distinte',
	coincidenti: 'coincidenti',
	perpendicolari: 'perpendicolari',
	incidenti: 'incidenti, non perpendicolari',
};
const POS_ORDER: Pos[] = ['parallele', 'coincidenti', 'perpendicolari', 'incidenti'];
export const POS_OPTIONS: ChoiceOption[] = POS_ORDER.map((p) => ({ latex: t(POS_TEXT[p]), values: [p] }));

type Form = 'esplicita' | 'implicita' | 'multipla';

/** How a line is written in the problem: explicit (or x = h), implicit times k, or "b y = …" with b ≥ 2. */
function formTex(l: Tri, form: Form, k: number): string {
	if (form === 'esplicita') return lineTex(l);
	if (form === 'implicita') return implicitTex(l, k);
	// b y = -a x - c, with b > 0 and at least 2.
	const s = l[1] > 0 ? k : -k;
	const B = l[1] * s;
	if (B < 2) throw new Error(`${ID}: form multipla with b = ${B}`);
	return `${B}y = ${terms([[-l[0] * s, 'x'], [-l[2] * s, '']])}`;
}

function formCoefs(l: Tri, form: Form, k: number): number[] {
	if (form === 'esplicita') return [];
	return l.map((c) => c * k);
}

function describe(name: string, l: Tri): string {
	if (isVertical(l)) return `${name}\\colon\\ ${lineTex(l, true)}${t(', verticale')}`;
	if (isHorizontal(l)) return `${name}\\colon\\ ${lineTex(l, true)}${t(', orizzontale')}`;
	return `${name}\\colon\\ ${lineTex(l, true)}`;
}

function level1(rng: Rng): Built {
	const pos = weighted<Pos>(rng, [
		['parallele', 30],
		['perpendicolari', 35],
		['incidenti', 20],
		['coincidenti', 15],
	]);
	for (let attempt = 0; attempt < 1000; attempt++) {
		const axis = rng.next() < 0.25;
		let r: Tri;
		let s: Tri;
		let trap = '';
		if (axis) {
			const k1 = q(nz(rng, -6, 6));
			const k2 = q(nz(rng, -6, 6));
			const vert = rng.next() < 0.5;
			const mk = vert ? vertical : horizontal;
			if (pos === 'parallele') {
				if (k1.equals(k2)) continue;
				[r, s] = [mk(k1), mk(k2)];
			} else if (pos === 'coincidenti') [r, s] = [mk(k1), mk(k1)];
			else if (pos === 'perpendicolari') [r, s] = rng.next() < 0.5 ? [horizontal(k1), vertical(k2)] : [vertical(k1), horizontal(k2)];
			else [r, s] = [mk(k1), explicitLine(rng.pick(M1), q(nz(rng, -6, 6)))];
			trap = 'assi';
		} else {
			const m1 = rng.pick(M1);
			const q1 = rng.next() < 0.8 ? q(rng.int(-6, 6)) : q(nz(rng, -7, 7), 2);
			let m2: Rational;
			let q2 = rng.next() < 0.8 ? q(rng.int(-6, 6)) : q(nz(rng, -7, 7), 2);
			if (pos === 'parallele' || pos === 'coincidenti') {
				m2 = m1;
				if (pos === 'coincidenti') q2 = q1;
				else if (q2.equals(q1)) continue;
			} else if (pos === 'perpendicolari') m2 = ONE.neg().div(m1);
			else {
				const sq = m1.mul(m1).isOne();
				const u = rng.next();
				if (!sq && u < 0.4) [m2, trap] = [m1.neg(), 'opposto'];
				else if (!sq && u < 0.75) [m2, trap] = [ONE.div(m1), 'reciproco'];
				else {
					m2 = rng.pick(M1);
					trap = 'altro';
					if (m2.equals(m1) || m2.mul(m1).equals(q(-1))) continue;
				}
			}
			r = explicitLine(m1, q1);
			s = explicitLine(m2, q2);
		}
		// Forms: r explicit (or implicit), s never explicit, so its slope has to be read.
		const rForm: Form = rng.next() < 0.7 ? 'esplicita' : 'implicita';
		let sForm: Form = isVertical(s) || rng.next() < 0.55 ? 'implicita' : 'multipla';
		let sk = 1;
		if (sForm === 'multipla') {
			if (Math.abs(s[1]) < 2 || pos === 'coincidenti') sk = rng.int(2, 3);
		} else if (pos === 'coincidenti' || rng.next() < 0.25) sk = rng.int(2, 3);
		if (pos === 'coincidenti' && rForm === 'implicita' && sForm === 'implicita' && sk === 1) sForm = 'multipla';
		const rTex = formTex(r, rForm, 1);
		const sTex = formTex(s, sForm, sk);
		const coefs = [...formCoefs(r, rForm, 1), ...formCoefs(s, sForm, sk)];
		if (coefs.some((c) => Math.abs(c) > 30)) continue;
		if (rTex === sTex) continue;

		const steps: string[] = [];
		if (rForm !== 'esplicita') steps.push(`${t('In forma esplicita ')} ${describe('r', r)}`);
		else if (isVertical(r) || isHorizontal(r)) steps.push(describe('r', r));
		steps.push(`${t('In forma esplicita ')} ${describe('s', s)}`);
		if (isVertical(r) || isVertical(s) || (isHorizontal(r) && isHorizontal(s))) {
			if (pos === 'coincidenti') steps.push(t('Le due equazioni descrivono la stessa retta: le rette coincidono.'));
			else if (pos === 'parallele') steps.push(t(`Tutte e due ${isVertical(r) ? 'verticali' : 'orizzontali'}, con equazioni diverse: parallele e distinte.`));
			else if (pos === 'perpendicolari') steps.push(t('Una retta orizzontale e una verticale sono sempre perpendicolari.'));
			else steps.push(t("Una retta è verticale e l'altra no: si incontrano, e non sono perpendicolari perché l'altra non è orizzontale."));
		} else {
			const mr = slope(r);
			const ms = slope(s);
			steps.push(`m_r = ${fr(mr, true)} ${t(' e ')} m_s = ${fr(ms, true)}`);
			if (pos === 'coincidenti') steps.push(t("Stesso coefficiente angolare e stessa ordinata all'origine: le rette coincidono."));
			else if (pos === 'parallele') steps.push(t("Stesso coefficiente angolare e ordinata all'origine diversa: parallele e distinte."));
			else if (pos === 'perpendicolari') steps.push(`${par(mr, true)} \\cdot ${par(ms, true)} = -1 ${t(': le rette sono perpendicolari.')}`);
			else steps.push(`${t('I coefficienti sono diversi e ')} ${par(mr, true)} \\cdot ${par(ms, true)} = ${fr(mr.mul(ms), true)} ${t(', diverso da ')} -1${t(': incidenti, non perpendicolari.')}`);
		}
		const answer: ChoiceAnswer = { kind: 'choice', options: POS_OPTIONS.map((o) => ({ ...o, values: [...o.values] })), correct: POS_ORDER.indexOf(pos) };
		return {
			prompt: 'Stabilisci la posizione reciproca delle rette r e s.',
			problem: `r\\colon\\ ${rTex} \\quad s\\colon\\ ${sTex}`,
			steps,
			solution: t(`Le rette sono ${POS_TEXT[pos]}.`),
			answer,
			choice: answer,
			params: { case: pos, trap, r, s, rForm, sForm, sk },
		};
	}
	throw new Error(`${ID}: level 1 found nothing`);
}

// ---------------------------------------------------------------------------
// Level 2: the slope of the perpendiculars

function level2(rng: Rng): Built {
	for (let attempt = 0; attempt < 1000; attempt++) {
		const m = rng.pick(M2);
		const form: Form = rng.next() < 0.5 ? 'esplicita' : 'implicita';
		const c = form === 'esplicita' && rng.next() < 0.2 ? q(nz(rng, -7, 7), 2) : q(rng.int(-9, 9));
		const r = explicitLine(m, c);
		if (form === 'implicita' && (r[2] === 0 || r.some((x) => Math.abs(x) > 30))) continue;
		const ans = ONE.neg().div(m);
		const steps: string[] = [];
		if (form === 'implicita') {
			const raw = `-\\dfrac{${r[0]}}{${r[1]}}`;
			const shown = raw === fr(m, true) || r[1] === 1 ? '' : `${raw} = `;
			steps.push(`${t('Il coefficiente angolare di ')} r ${t(' è ')} m = -\\dfrac{a}{b} = ${shown}${fr(m, true)}`);
		} else steps.push(`${t('Il coefficiente angolare di ')} r ${t(' è ')} m = ${fr(m, true)}`);
		steps.push(`${t("Le perpendicolari hanno per coefficiente angolare l'antireciproco, il reciproco cambiato di segno: ")} -\\dfrac{1}{m} = ${fr(ans, true)}`);
		steps.push(`${t('Controllo: ')} ${par(m, true)} \\cdot ${par(ans, true)} = -1`);
		const mistakes = [m.neg(), ONE.div(m), m];
		if (form === 'implicita') mistakes.push(q(-1, r[0]), q(r[1], r[0]).neg());
		return {
			prompt: 'Trova il coefficiente angolare delle rette perpendicolari a r.',
			problem: `r\\colon\\ ${formTex(r, form, 1)}`,
			steps,
			solution: `m = ${fr(ans, true)}`,
			answer: { kind: 'number', value: ans.toString() },
			choice: buildChoice(rng, numberOption(ans), mistakes.map(numberOption), near(ans)),
			params: { case: form, r, m: m.toString() },
		};
	}
	throw new Error(`${ID}: level 2 found nothing`);
}

// ---------------------------------------------------------------------------
// Level 3: the parameter k

function kCoefTex(a: number, b: number): string {
	return `(${a === 1 ? '' : a}k ${b < 0 ? '-' : '+'} ${Math.abs(b)})`;
}

function level3(rng: Rng): Built {
	const rel = rng.next() < 0.5 ? 'parallela' : 'perpendicolare';
	for (let attempt = 0; attempt < 1000; attempt++) {
		const a = weighted(rng, [
			[1, 2],
			[2, 4],
			[3, 3],
			[4, 1],
		]);
		const b = nz(rng, -6, 6);
		const c = nz(rng, -9, 9);
		const m = rel === 'parallela' ? rng.pick(M_SMALL) : rng.pick(M2.filter((x) => x.den <= 3));
		const q2 = nz(rng, -9, 9);
		const target = rel === 'parallela' ? m : ONE.neg().div(m);
		const k = target.sub(q(b)).div(q(a));
		if (k.isZero() || k.den > 15 || Math.abs(k.num) > 30) continue;
		if (rel === 'parallela' && c === q2) continue;
		const lhs = `${a === 1 ? '' : a}k ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
		const steps: string[] = [`${t('Il coefficiente angolare di ')} r ${t(' è ')} ${lhs}${t(', quello di ')} s ${t(' è ')} ${fr(m, true)}`];
		if (rel === 'parallela') steps.push(`${t('Per il parallelismo devono essere uguali: ')} ${lhs} = ${fr(m, true)}`);
		else steps.push(`${t("Per la perpendicolarità deve essere l'antireciproco di ")} ${fr(m, true)}${t(', cioè ')} ${fr(target, true)}${t(': ')} ${lhs} = ${fr(target, true)}`);
		if (a !== 1) steps.push(`${a}k = ${fr(target.sub(q(b)), true)}`);
		steps.push(`k = ${fr(k, true)}`);
		const div = (r: Rational) => r.div(q(a));
		const mistakes =
			rel === 'parallela'
				? [div(ONE.neg().div(m).sub(q(b))), div(m.add(q(b))), m.sub(q(b)), div(m.neg().sub(q(b)))]
				: [div(m.neg().sub(q(b))), div(ONE.div(m).sub(q(b))), div(m.sub(q(b))), div(target.add(q(b)))];
		return {
			prompt: `Trova il valore di k per cui la retta r è ${rel} alla retta s.`,
			problem: `r\\colon\\ y = ${kCoefTex(a, b)}x ${c < 0 ? '-' : '+'} ${Math.abs(c)} \\quad s\\colon\\ y = ${lin(m, q(q2))}`,
			steps,
			solution: `k = ${fr(k, true)}`,
			answer: { kind: 'number', value: k.toString() },
			choice: buildChoice(rng, numberOption(k), mistakes.map(numberOption), near(k)),
			params: { case: rel, a, b, c, m: m.toString(), q: q2 },
		};
	}
	throw new Error(`${ID}: level 3 found nothing`);
}

// ---------------------------------------------------------------------------
// Level 4: line through a point, the given line in explicit form

function level4(rng: Rng): Built {
	const rel = rng.next() < 0.4 ? 'parallela' : 'perpendicolare';
	for (let attempt = 0; attempt < 1000; attempt++) {
		const m = rng.pick(M_SMALL);
		const qr = q(rng.int(-6, 6));
		const x0 = q(rng.int(1, 6));
		const y0 = q(rng.int(0, 6));
		const r = explicitLine(m, qr);
		if (onLine(r, x0, y0)) continue;
		const m2 = rel === 'parallela' ? m : ONE.neg().div(m);
		const ans = slopePoint(m2, x0, y0);
		const q2 = intercept(ans);
		if (Math.abs(q2.num) > 40) continue;
		const steps: string[] = [`${t('La retta ')} r ${t(' ha ')} m = ${fr(m, true)}`];
		if (rel === 'parallela') steps.push(t('La parallela ha lo stesso coefficiente angolare.'));
		else steps.push(`${t("La perpendicolare ha l'antireciproco: ")} m = ${fr(m2, true)}`);
		steps.push(pointSlopeTex(m2, x0, y0));
		steps.push(lineTex(ans, true));
		steps.push(`${t('Controllo con ')} x = ${x0.num}${t(': ')} ${valueTex(m2, q2, x0.num)} = ${y0.num}`);
		const P = [x0, y0] as const;
		const cands =
			rel === 'parallela'
				? [slopePoint(ONE.neg().div(m), ...P), slopePoint(m, x0.neg(), y0), slopePoint(m, y0, x0), slopePoint(m.neg(), ...P), explicitLine(m, qr.neg())]
				: [slopePoint(m.neg(), ...P), slopePoint(ONE.div(m), ...P), slopePoint(m, ...P), slopePoint(m2, x0.neg(), y0), slopePoint(m2, y0, x0), explicitLine(m2, qr)];
		return {
			prompt: `Scrivi l'equazione della retta per P ${rel} a r.`,
			problem: `P(${x0.num}, ${y0.num}) \\quad r\\colon\\ ${lineTex(r)}`,
			steps,
			solution: lineTex(ans, true),
			answer: { kind: 'expression', value: sympyRhs(ans), latex: lineTex(ans) },
			choice: buildChoice(rng, explicitOption(ans), cands.map(explicitOption), (i) => explicitOption(explicitLine(m2, q2.add(q(i % 2 === 0 ? i / 2 + 1 : -(i + 1) / 2))))),
			params: { case: rel, r, P: [x0.num, y0.num], line: ans },
		};
	}
	throw new Error(`${ID}: level 4 found nothing`);
}

// ---------------------------------------------------------------------------
// Level 5: the given line in implicit form (answer in implicit form), or parallel to an axis

function substTex(A: number, B: number, x0: number, y0: number): string {
	const first = A === 1 ? String(x0) : `${A} \\cdot ${par(q(x0), true)}`;
	const second = `${Math.abs(B) === 1 ? '' : `${Math.abs(B)} \\cdot `}${par(q(y0), true)}`;
	return `${first} ${B < 0 ? '-' : '+'} ${second} + c' = 0`;
}

function level5(rng: Rng): Built {
	const rel = rng.next() < 0.5 ? 'parallela' : 'perpendicolare';
	const axis = rng.next() < 0.3;
	for (let attempt = 0; attempt < 1000; attempt++) {
		const x0 = rng.int(-6, 6);
		const y0 = rng.int(-6, 6);
		if (x0 >= 0 && y0 >= 0) continue;
		const X0 = q(x0);
		const Y0 = q(y0);
		if (axis) {
			const k = nz(rng, -6, 6);
			const vert = rng.next() < 0.5;
			const r = vert ? vertical(q(k)) : horizontal(q(k));
			if (onLine(r, X0, Y0) || x0 === y0) continue;
			const rk = rng.next() < 0.3 ? 1 : rng.int(2, 3);
			const rTex = rk === 1 ? lineTex(r) : implicitTex(r, rk);
			// Parallel to a horizontal line, or perpendicular to a vertical one: horizontal.
			const horiz = vert === (rel === 'perpendicolare');
			const ans = horiz ? horizontal(Y0) : vertical(X0);
			const other = horiz ? vertical(X0) : horizontal(Y0);
			const cands = [horiz ? vertical(Y0) : horizontal(X0), other, horiz ? horizontal(X0) : vertical(Y0), r, vert ? horizontal(q(k)) : vertical(q(k))];
			const steps = [
				`${rk === 1 ? '' : t('Dividendo per ') + rk + t(': ')}r\\colon\\ ${lineTex(r, true)}${t(vert ? ', una retta verticale.' : ', una retta orizzontale.')}`,
				horiz
					? `${t(`La ${rel} per A è orizzontale e passa per i punti con la stessa ordinata di A: `)} y = ${y0}`
					: `${t(`La ${rel} per A è verticale e passa per i punti con la stessa ascissa di A: `)} x = ${x0}`,
			];
			return {
				prompt: `Scrivi l'equazione della retta per A ${rel} a r.`,
				problem: `A(${x0}, ${y0}) \\quad r\\colon\\ ${rTex}`,
				steps,
				solution: lineTex(ans, true),
				answer: { kind: 'choice', options: [], correct: 0 },
				choice: buildChoice(rng, implicitOption(ans), cands.map(implicitOption), (i) => implicitOption(shifted(ans, i))),
				params: { case: 'assi', rel, r, A: [x0, y0], line: ans },
			};
		}
		const a = rng.int(1, 6);
		const b = nz(rng, -6, 6);
		const c = nz(rng, -15, 15);
		if (gcd(a, b) !== 1) continue;
		const r: Tri = [a, b, c];
		if (onLine(r, X0, Y0)) continue;
		// The parallel keeps a and b; the perpendicular swaps them and changes one sign.
		const [A, B] = rel === 'parallela' ? [a, b] : b > 0 ? [b, -a] : [-b, a];
		const cp = -(A * x0 + B * y0);
		if (Math.abs(cp) > 40) continue;
		const ans: Tri = [A, B, cp];
		const through = (u: number, v: number, x: number, y: number) => normTri(q(u), q(v), q(-(u * x + v * y)));
		const [Ap, Bp] = rel === 'parallela' ? (b > 0 ? [b, -a] : [-b, a]) : [a, b];
		const cands = [
			through(Ap, Bp, x0, y0),
			through(b, a, x0, y0),
			through(a, -b, x0, y0),
			through(A, B, -x0, -y0),
			through(A, B, y0, x0),
			normTri(q(A), q(B), q(c)),
		];
		const m = q(-a, b);
		const steps = [
			`${t('Il coefficiente angolare di ')} r ${t(' è ')} m = -\\dfrac{a}{b} = ${b === 1 || `-\\dfrac{${a}}{${b}}` === fr(m, true) ? '' : `-\\dfrac{${a}}{${b}} = `}${fr(m, true)}`,
			rel === 'parallela'
				? `${t('La parallela ha lo stesso coefficiente angolare, quindi gli stessi ')} a ${t(' e ')} b${t(': ')} ${terms([
						[A, 'x'],
						[B, 'y'],
					])} + c' = 0`
				: `${t("La perpendicolare ha coefficiente angolare l'antireciproco ")} ${fr(ONE.neg().div(m), true)}${t(': coefficienti scambiati, uno cambiato di segno. ')} ${terms([
						[A, 'x'],
						[B, 'y'],
					])} + c' = 0`,
			`${t('Con le coordinate di ')} A${t(': ')} ${substTex(A, B, x0, y0)}${t(', quindi ')} c' = ${cp}`,
			implicitTex(ans),
		];
		return {
			prompt: `Scrivi in forma implicita la retta per A ${rel} a r.`,
			problem: `A(${x0}, ${y0}) \\quad r\\colon\\ ${implicitTex(r)}`,
			steps,
			solution: implicitTex(ans),
			answer: { kind: 'choice', options: [], correct: 0 },
			choice: buildChoice(rng, implicitOption(ans), cands.map(implicitOption), (i) => implicitOption(shifted(ans, i))),
			params: { case: 'implicita', rel, r, A: [x0, y0], line: ans },
		};
	}
	throw new Error(`${ID}: level 5 found nothing`);
}

// ---------------------------------------------------------------------------
// Level 6: perpendicular bisector of a segment

function midTex(a: number, b: number): string {
	return `\\dfrac{${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}}{2}`;
}

function diffTex(a: number, b: number): string {
	return `${a} - ${par(q(b), true)}`;
}

function level6(rng: Rng): Built {
	const kind = weighted(rng, [
		['positivi', 35],
		['negativi', 35],
		['assi', 30],
	] as [string, number][]);
	for (let attempt = 0; attempt < 5000; attempt++) {
		const lo = kind === 'positivi' ? 0 : -7;
		const hi = kind === 'positivi' ? 8 : 7;
		const xa = rng.int(lo, hi);
		const ya = rng.int(lo, hi);
		let xb = rng.int(lo, hi);
		let yb = rng.int(lo, hi);
		if (kind === 'assi') {
			if (rng.next() < 0.5) yb = ya;
			else xb = xa;
		}
		if ((xa + xb) % 2 !== 0 || (ya + yb) % 2 !== 0 || (xa === xb && ya === yb)) continue;
		if (kind !== 'assi' && (xa === xb || ya === yb)) continue;
		if (kind === 'negativi' && Math.min(xa, ya, xb, yb) >= 0) continue;
		const xm = q(xa + xb, 2);
		const ym = q(ya + yb, 2);
		const steps = [`M\\left(${midTex(xa, xb)}, ${midTex(ya, yb)}\\right) = ${pointTex('M', xm, ym)}`];
		const problem = `A(${xa}, ${ya}) \\quad B(${xb}, ${yb})`;
		const params = { case: kind, A: [xa, ya], B: [xb, yb] };
		if (ya === yb || xa === xb) {
			const horizSeg = ya === yb;
			const ans = horizSeg ? vertical(xm) : horizontal(ym);
			if (horizSeg) steps.push(`${t('Il segmento è orizzontale, ')} m_{AB} = 0${t(": l'asse è la retta verticale per ")} M`);
			else steps.push(t("Il segmento è verticale: l'asse è la retta orizzontale per M."));
			steps.push(lineTex(ans, true));
			const halfX = q(xb - xa, 2).abs();
			const halfY = q(yb - ya, 2).abs();
			const cands = horizSeg ? [horizontal(ym), horizontal(xm), vertical(halfX), vertical(q(xa)), vertical(q(xb))] : [vertical(xm), vertical(ym), horizontal(halfY), horizontal(q(ya)), horizontal(q(yb))];
			const choice = buildChoice(rng, explicitOption(ans), cands.map(explicitOption), (i) => explicitOption(shifted(ans, i)));
			return {
				prompt: "Trova l'equazione dell'asse del segmento AB.",
				problem,
				steps,
				solution: lineTex(ans, true),
				answer: horizSeg ? { kind: 'choice', options: [], correct: 0 } : { kind: 'expression', value: sympyRhs(ans), latex: lineTex(ans) },
				choice,
				params: { ...params, case: horizSeg ? 'orizzontale' : 'verticale', line: ans },
			};
		}
		const mAB = q(yb - ya, xb - xa);
		const m2 = ONE.neg().div(mAB);
		const ans = slopePoint(m2, xm, ym);
		if (Math.abs(intercept(ans).num) > 40) continue;
		steps.push(`m_{AB} = \\dfrac{${diffTex(yb, ya)}}{${diffTex(xb, xa)}} = ${fr(mAB, true)}`);
		steps.push(`${t("L'asse è perpendicolare ad ")} AB ${t(' e ha coefficiente angolare ')} ${fr(m2, true)}${t(', passando per ')} M${t(':')}`);
		if (pointSlopeTex(m2, xm, ym) !== lineTex(ans, true)) steps.push(pointSlopeTex(m2, xm, ym));
		steps.push(lineTex(ans, true));
		const cands = [slopePoint(mAB, xm, ym), slopePoint(mAB.neg(), xm, ym), slopePoint(ONE.div(mAB), xm, ym), slopePoint(m2, q(xa), q(ya)), slopePoint(m2, q(xb - xa, 2), q(yb - ya, 2)), slopePoint(m2, q(xb), q(yb))];
		return {
			prompt: "Trova l'equazione dell'asse del segmento AB.",
			problem,
			steps,
			solution: lineTex(ans, true),
			answer: { kind: 'expression', value: sympyRhs(ans), latex: lineTex(ans) },
			choice: buildChoice(rng, explicitOption(ans), cands.map(explicitOption), (i) => explicitOption(shifted(ans, i))),
			params: { ...params, line: ans },
		};
	}
	throw new Error(`${ID}: level 6 found nothing`);
}

// ---------------------------------------------------------------------------
// Level 7: projection of a point on a line

function level7(rng: Rng): Built {
	const kind = weighted(rng, [
		['intera', 40],
		['frazionaria', 40],
		['assi', 20],
	] as [string, number][]);
	for (let attempt = 0; attempt < 5000; attempt++) {
		let r: Tri;
		let x0: number;
		let y0: number;
		let rTex: string;
		if (kind === 'intera') {
			const m = rng.pick([...M_INT, q(1, 2), q(-1, 2)]);
			const xh = rng.int(-4, 6);
			const yh = rng.int(-4, 6);
			const k = nz(rng, -2, 2);
			x0 = xh - k * m.num;
			y0 = yh + k * m.den;
			r = slopePoint(m, q(xh), q(yh));
			if (!intercept(r).isInteger() || Math.abs(intercept(r).num) > 10) continue;
			rTex = lineTex(r);
		} else if (kind === 'frazionaria') {
			const a = rng.int(1, 3);
			const b = nz(rng, -3, 3);
			const c = nz(rng, -9, 9);
			if (gcd(a, b) !== 1 || a * a + b * b > 10) continue;
			r = [a, b, c];
			x0 = rng.int(-5, 5);
			y0 = rng.int(-5, 5);
			rTex = implicitTex(r);
		} else {
			const k = nz(rng, -6, 6);
			r = rng.next() < 0.5 ? vertical(q(k)) : horizontal(q(k));
			x0 = nz(rng, -6, 6);
			y0 = nz(rng, -6, 6);
			const rk = rng.next() < 0.5 ? 1 : rng.int(2, 3);
			rTex = rk === 1 ? lineTex(r) : implicitTex(r, rk);
		}
		if (Math.abs(x0) > 9 || Math.abs(y0) > 9) continue;
		const X0 = q(x0);
		const Y0 = q(y0);
		if (onLine(r, X0, Y0)) continue;
		// The perpendicular through P: direction of the normal (a, b).
		const s = normTri(q(r[1]), q(-r[0]), q(-(r[1] * x0 - r[0] * y0)));
		const [xh, yh] = intersect(r, s);
		if (kind === 'frazionaria' && xh.isInteger() && yh.isInteger()) continue;
		if (kind === 'intera' && !(xh.isInteger() && yh.isInteger())) continue;
		const steps: string[] = [];
		if (kind === 'assi') {
			if (isHorizontal(r)) steps.push(`${t('La retta ')} r ${t(' è orizzontale, ')} ${lineTex(r, true)}${t(': la proiezione ha la stessa ascissa di ')} P ${t(' e ordinata ')} ${fr(intercept(r), true)}`);
			else steps.push(`${t('La retta ')} r ${t(' è verticale, ')} ${lineTex(r, true)}${t(': la proiezione ha la stessa ordinata di ')} P ${t(' e ascissa ')} ${fr(xOfVertical(r), true)}`);
		} else {
			const m = slope(r);
			const ms = slope(s);
			if (kind === 'frazionaria') steps.push(`${t('Il coefficiente angolare di ')} r ${t(' è ')} -\\dfrac{a}{b} = ${fr(m, true)}`);
			steps.push(`${t('La perpendicolare ')} s ${t(' per ')} P ${t(' ha ')} m = ${fr(ms, true)}${t(': ')} ${pointSlopeTex(ms, X0, Y0)}`);
			steps.push(`s\\colon\\ ${lineTex(s, true)}`);
			if (kind === 'intera') steps.push(`${t('Confronto: ')} ${lin(m, intercept(r), true)} = ${lin(ms, intercept(s), true)}${t(', quindi ')} x = ${fr(xh, true)}`);
			else steps.push(`${t('Sostituisci ')} y ${t(' nell\'equazione di ')} r${t(': ')} ${terms([[r[0], 'x']])} ${r[1] < 0 ? '-' : '+'} ${Math.abs(r[1]) === 1 ? '' : Math.abs(r[1])}\\left(${lin(ms, intercept(s), true)}\\right) ${r[2] < 0 ? '-' : '+'} ${Math.abs(r[2])} = 0${t(', quindi ')} x = ${fr(xh, true)}`);
			steps.push(`y = ${fr(yh, true)}`);
		}
		steps.push(`${t('La proiezione è ')} ${pointTex('H', xh, yh, true)}`);
		const cands: [Rational, Rational][] = [[yh, xh]];
		if (!isVertical(r)) cands.push([X0, slope(r).mul(X0).add(intercept(r))]);
		if (!isHorizontal(r)) cands.push([q(-(r[1] * y0 + r[2]), r[0]), Y0]);
		cands.push([xh.mul(q(2)).sub(X0), yh.mul(q(2)).sub(Y0)]);
		if (isHorizontal(r)) cands.push([intercept(r), Y0], [intercept(r), X0]);
		if (isVertical(r)) cands.push([X0, xOfVertical(r)], [Y0, xOfVertical(r)]);
		if (!isVertical(r) && !isHorizontal(r) && !slope(r).mul(slope(r)).isOne()) {
			const wrong = slopePoint(slope(r).neg(), X0, Y0);
			cands.push(intersect(r, wrong));
		}
		const choice = buildChoice(
			rng,
			pointOption(xh, yh),
			cands.map(([x, y]) => pointOption(x, y)),
			(i) => pointOption(xh.add(q(i + 1)), yh),
		);
		return {
			prompt: 'Trova la proiezione H del punto P sulla retta r.',
			problem: `P(${x0}, ${y0}) \\quad r\\colon\\ ${rTex}`,
			steps,
			solution: pointTex('H', xh, yh, true),
			answer: { kind: 'choice', options: [], correct: 0 },
			choice,
			params: { case: kind, r, P: [x0, y0], H: [xh.toString(), yh.toString()] },
		};
	}
	throw new Error(`${ID}: level 7 found nothing`);
}

// ---------------------------------------------------------------------------
// Assembly

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	const b = make(rng);
	const answer = b.answer.kind === 'choice' ? b.choice : b.answer;
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: b.prompt,
		problem: b.problem,
		solution: b.solution,
		steps: b.steps,
		answer,
		choice: b.choice,
		params: b.params,
	};
}

function toChoice(s: Sample): ChoiceAnswer {
	if (s.answer.kind === 'choice') return s.answer;
	if (s.choice) return s.choice;
	throw new Error(`${ID}: no choice for level ${s.level}`);
}

// ---------------------------------------------------------------------------
// Checks

function check(s: Sample): string[] {
	const v: string[] = [];
	const p = s.params as Record<string, unknown>;
	if (!s.steps.length) v.push('passaggi mancanti');
	if (/—|piuttosto che|\+\s*-|-\s*-|\+\s*\+/.test(s.problem)) v.push('segni o parole vietate nel testo');
	if (/(?<![\d}])1\s*[xyk(]|(?<![\d}])0\s*[xyk]/.test(s.problem)) v.push('1x o 0x nel testo');
	const ch = s.answer.kind === 'choice' ? s.answer : s.choice;
	if (!ch) v.push('manca la scelta multipla');
	else {
		if (ch.options.length !== 4) v.push('non quattro opzioni');
		if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
		if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni con lo stesso testo');
	}
	const right = ch?.options[ch.correct];
	if (!right) return [...v, 'opzione giusta mancante'];
	const tri = (x: unknown) => x as Tri;
	switch (s.level) {
		case 1: {
			const r = tri(p.r);
			const sl = tri(p.s);
			const par1 = r[0] * sl[1] - sl[0] * r[1] === 0;
			const pos = par1 ? (sameLine(r, sl) ? 'coincidenti' : 'parallele') : r[0] * sl[0] + r[1] * sl[1] === 0 ? 'perpendicolari' : 'incidenti';
			if (pos !== p.case || right.values[0] !== pos) v.push(`posizione ${pos}, attesa ${String(p.case)}`);
			break;
		}
		case 2: {
			const r = tri(p.r);
			const want = q(r[1], r[0]);
			if (s.answer.kind !== 'number' || s.answer.value !== want.toString() || right.values[0] !== want.toString()) v.push('antireciproco sbagliato');
			break;
		}
		case 3: {
			const a = Number(p.a);
			const b = Number(p.b);
			const m = Rational.parse(String(p.m));
			const want = (p.case === 'parallela' ? m : ONE.neg().div(m)).sub(q(b)).div(q(a));
			if (s.answer.kind !== 'number' || s.answer.value !== want.toString() || right.values[0] !== want.toString()) v.push('k sbagliato');
			break;
		}
		case 4:
		case 5: {
			const r = tri(p.r);
			const P = (s.level === 4 ? p.P : p.A) as number[];
			const l = tri(p.line);
			if (!onLine(l, q(P[0]), q(P[1]))) v.push('la retta non passa per il punto');
			const ok = p.rel === 'parallela' || p.case === 'parallela' ? r[0] * l[1] - l[0] * r[1] === 0 : r[0] * l[0] + r[1] * l[1] === 0;
			if (!ok) v.push('relazione sbagliata');
			if (right.values.join(',') !== l.join(',')) v.push('opzione giusta sbagliata');
			if (s.level === 5 && P[0] >= 0 && P[1] >= 0) v.push('punto senza coordinate negative');
			break;
		}
		case 6: {
			const [xa, ya] = p.A as number[];
			const [xb, yb] = p.B as number[];
			const l = tri(p.line);
			const d2 = (x: Rational, y: Rational, u: number, w: number) => x.sub(q(u)).mul(x.sub(q(u))).add(y.sub(q(w)).mul(y.sub(q(w))));
			// Two points of the line, both equidistant from A and B.
			const pts: [Rational, Rational][] = isVertical(l) ? [[xOfVertical(l), ZERO], [xOfVertical(l), ONE]] : [[ZERO, intercept(l)], [ONE, slope(l).add(intercept(l))]];
			if (!pts.every(([x, y]) => d2(x, y, xa, ya).equals(d2(x, y, xb, yb)))) v.push("la retta non è l'asse");
			if (right.values.join(',') !== l.join(',')) v.push('opzione giusta sbagliata');
			break;
		}
		case 7: {
			const r = tri(p.r);
			const [x0, y0] = p.P as number[];
			const [xh, yh] = (p.H as string[]).map((x) => Rational.parse(x));
			if (!onLine(r, xh, yh)) v.push('H non sta su r');
			// PH parallel to the normal (a, b).
			if (!xh.sub(q(x0)).mul(q(r[1])).equals(yh.sub(q(y0)).mul(q(r[0])))) v.push('PH non perpendicolare a r');
			if (right.values[0] !== xh.toString() || right.values[1] !== yh.toString()) v.push('opzione giusta sbagliata');
			break;
		}
	}
	return v;
}

export const rettePerpendicolari: Generator = {
	id: ID,
	title: 'Rette parallele e perpendicolari',
	levels: {
		1: { label: 'La posizione di due rette', constraints: ['parallele 30 %, perpendicolari 35 %, incidenti 20 %, coincidenti 15 %', 'un quarto con rette parallele agli assi', 's mai in forma esplicita'] },
		2: { label: "L'antireciproco", constraints: ['r in forma esplicita o implicita, metà e metà', 'm diverso da 0 e da ±1'] },
		3: { label: 'Il parametro k', constraints: ['metà parallela, metà perpendicolare', 'k non nullo, denominatore fino a 15'] },
		4: { label: 'Retta per un punto, r in forma esplicita', constraints: ['P a coordinate intere non negative, fuori da r', 'parallela 40 %, perpendicolare 60 %', 'risposta in forma esplicita'] },
		5: { label: 'Retta per un punto, r in forma implicita o parallela a un asse', constraints: ['A con almeno una coordinata negativa', 'risposta in forma implicita ridotta', 'r parallela a un asse 30 %'] },
		6: { label: "L'asse di un segmento", constraints: ['punto medio intero', 'coordinate positive 35 %, negative 35 %, segmento orizzontale o verticale 30 %'] },
		7: { label: 'La proiezione di un punto su una retta', constraints: ['H intero 40 %, H frazionario 40 %, retta parallela a un asse 20 %', 'P fuori da r'] },
	},
	generate,
	check,
	toChoice,
};

export default rettePerpendicolari;
