/**
 * Equazione della retta e casi particolari (lesson slug equazione-di-una-retta). Spec: specs/exercises/equazione-di-una-retta.md
 *
 * Seven levels in the order of the lesson (docs/lezioni/riscritte/81-equazione-di-una-retta.md): lines parallel to
 * the axes and bisectors; from the implicit to the explicit form; from the explicit form (or an equation with
 * fractions) to the implicit form with integer coefficients; a point on the line and a missing coordinate; the
 * points on the axes; equations with a = 0, b = 0 or c = 0; a line with a parameter k.
 *
 * Built backwards: the answer (the point, m and q, the value of k) is chosen first and the equation is built from
 * it. The distractors are the mistakes of the lesson's warnings: x = 3 taken for a horizontal line, only part of
 * the second member divided by b, the sign of b forgotten, coordinates swapped, x = 0 used for the point on the
 * x-axis, the wrong coefficient set to zero.
 *
 * Answer types: `expression` for the explicit form (level 2), `number` for a missing coordinate and for k when it
 * exists, `choice` for the rest (a kind of line, a line in implicit form, points, "nessun valore di k").
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { paren } from '../latex';

export const ID = 'equazione-di-una-retta';

type R = Rational;
const t = (s: string) => `\\text{${s}}`;
const ZERO = q(0);

// ---------------------------------------------------------------------------
// LaTeX

interface Term {
	neg: boolean;
	tex: string;
}

function joinTerms(ts: Term[]): string {
	if (ts.length === 0) return '0';
	return ts.map((x, i) => (i === 0 ? (x.neg ? '-' : '') + x.tex : (x.neg ? ' - ' : ' + ') + x.tex)).join('');
}

/** |c| v: "3x", "x", "\frac{3}{2}x", "5". */
function body(c: R, v: string): string {
	const a = c.abs();
	if (!v) return a.toLatex();
	return a.isOne() ? v : `${a.toLatex()}${v}`;
}

/** A sum of monomials, zero terms left out: "3x - 2y + 4". */
function lin(items: [R, string][]): string {
	return joinTerms(items.filter(([c]) => !c.isZero()).map(([c, v]) => ({ neg: c.sign() < 0, tex: body(c, v) })));
}

const implicitLatex = (a: R, b: R, c: R) => `${lin([[a, 'x'], [b, 'y'], [c, '']])} = 0`;
const explicitLatex = (m: R, k: R) => `y = ${lin([[m, 'x'], [k, '']])}`;
const hasFrac = (...rs: R[]) => rs.some((r) => !r.isInteger());
const pairLatex = (x: R, y: R) => (hasFrac(x, y) ? `\\left(${x.toLatex()}, ${y.toLatex()}\\right)` : `(${x.toLatex()}, ${y.toLatex()})`);
const sym = (r: R) => (r.isInteger() ? `${r.num}` : `(${r.num}/${r.den})`);
/** m x + q for SymPy. */
function sympyLine(m: R, k: R): string {
	const head = m.isZero() ? '' : `${sym(m)}*x`;
	if (k.isZero()) return head || '0';
	if (!head) return sym(k);
	return `${head} ${k.sign() < 0 ? '-' : '+'} ${sym(k.abs())}`;
}

/** k · val in a substitution: "3 \cdot 2", "(-1)", "2 \cdot \left(-\frac{1}{2}\right)". */
function prodTerm(k: R, val: R, first: boolean): Term {
	const a = k.abs();
	if (a.isOne()) return { neg: k.sign() < 0, tex: first && k.sign() > 0 && val.sign() >= 0 ? val.toLatex() : paren(val) };
	return { neg: k.sign() < 0, tex: `${a.toLatex()} \\cdot ${paren(val)}` };
}

/** a x0 + b y0 + c written out. */
function subLatex(a: R, b: R, c: R, x0: R, y0: R): string {
	const ts: Term[] = [];
	if (!a.isZero()) ts.push(prodTerm(a, x0, true));
	if (!b.isZero()) ts.push(prodTerm(b, y0, ts.length === 0));
	if (!c.isZero()) ts.push({ neg: c.sign() < 0, tex: c.abs().toLatex() });
	return joinTerms(ts);
}

// ---------------------------------------------------------------------------
// Lines

/** a x + b y + c = 0 */
interface Line {
	a: R;
	b: R;
	c: R;
}
const L = (a: number | R, b: number | R, c: number | R): Line => ({
	a: typeof a === 'number' ? q(a) : a,
	b: typeof b === 'number' ? q(b) : b,
	c: typeof c === 'number' ? q(c) : c,
});

/** Integer coefficients without common divisors, a > 0 (b > 0 when a = 0). */
function primitive(l: Line): Line {
	const den = lcm(lcm(l.a.den, l.b.den), l.c.den);
	const ints = [l.a, l.b, l.c].map((r) => r.mul(q(den)).num);
	const g = gcd(gcd(ints[0], ints[1]), ints[2]) || 1;
	const s = ints[0] < 0 || (ints[0] === 0 && ints[1] < 0) ? -1 : 1;
	return L(q((s * ints[0]) / g), q((s * ints[1]) / g), q((s * ints[2]) / g));
}
const sameLine = (u: Line, v: Line) => {
	const a = primitive(u);
	const b = primitive(v);
	return a.a.equals(b.a) && a.b.equals(b.b) && a.c.equals(b.c);
};
const lineKey = (l: Line) => {
	const p = primitive(l);
	return `${p.a}|${p.b}|${p.c}`;
};
const onLine = (l: Line, x: R, y: R) => l.a.mul(x).add(l.b.mul(y)).add(l.c).isZero();
const lineJSON = (l: Line) => [l.a.toString(), l.b.toString(), l.c.toString()];

function nz(rng: Rng, lo: number, hi: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(lo, hi);
		if (v !== 0 && !not.includes(v)) return v;
	}
}
const sgn = (rng: Rng) => (rng.next() < 0.5 ? -1 : 1);

function shuffleOpts(rng: Rng, opts: ChoiceOption[]): ChoiceAnswer {
	const order = opts.map((_, i) => i);
	for (let i = order.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[order[i], order[j]] = [order[j], order[i]];
	}
	return { kind: 'choice', options: order.map((i) => ({ latex: opts[i].latex, values: [...opts[i].values] })), correct: order.indexOf(0) };
}

/** The correct option first, then distinct candidates, four in all; null if fewer. */
function pick4(correct: ChoiceOption, cands: (ChoiceOption | null)[]): ChoiceOption[] | null {
	const out = [correct];
	const seen = new Set([correct.values.join('|')]);
	for (const c of cands) {
		if (!c || out.length >= 4) continue;
		const k = c.values.join('|');
		if (seen.has(k)) continue;
		seen.add(k);
		out.push(c);
	}
	return out.length === 4 ? out : null;
}

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	/** For a choice answer: the options, correct first. */
	options?: ChoiceOption[];
	number?: R;
	expression?: { value: string; latex: string };
	params: Record<string, unknown>;
}

/** A coordinate: an integer from -9 to 9, or (share `f`) a fraction with denominator 2 or 3. */
function coord(rng: Rng, f: number, not: R[] = []): R {
	for (;;) {
		const r = rng.next() < f ? q(nz(rng, -9, 9), rng.pick([2, 3])) : q(nz(rng, -9, 9));
		if (r.isInteger() && rng.next() < f) continue;
		if (!not.some((n) => n.equals(r))) return r;
	}
}

// ---------------------------------------------------------------------------
// Level 1: parallels to the axes and bisectors

type Kind1 = 'orizzontale' | 'verticale' | 'bis13' | 'bis24' | 'assex' | 'assey';
const KIND_LABEL: Record<Kind1, string> = {
	orizzontale: t('orizzontale'),
	verticale: t('verticale'),
	bis13: t('bisettrice del I e III quadrante'),
	bis24: t('bisettrice del II e IV quadrante'),
	assex: "\\text{l'asse } x",
	assey: "\\text{l'asse } y",
};
const KIND_SENTENCE: Record<Kind1, string> = {
	orizzontale: "è una retta orizzontale, parallela all'asse ",
	verticale: "è una retta verticale, parallela all'asse ",
	bis13: 'è la bisettrice del I e III quadrante',
	bis24: 'è la bisettrice del II e IV quadrante',
	assex: "è l'asse ",
	assey: "è l'asse ",
};
const KIND_OTHERS: Record<Kind1, Kind1[]> = {
	verticale: ['orizzontale', 'assey', 'assex'],
	orizzontale: ['verticale', 'assex', 'assey'],
	bis13: ['bis24', 'orizzontale', 'verticale'],
	bis24: ['bis13', 'orizzontale', 'verticale'],
	assex: ['assey', 'bis13', 'bis24'],
	assey: ['assex', 'bis13', 'bis24'],
};
const kindOpt = (k: Kind1): ChoiceOption => ({ latex: KIND_LABEL[k], values: [k] });

function level1(rng: Rng, u: number): Built {
	if (u < 0.4) {
		const w = rng.next();
		const kind: Kind1 = w < 0.3 ? 'verticale' : w < 0.6 ? 'orizzontale' : w < 0.75 ? 'bis13' : w < 0.9 ? 'bis24' : rng.pick(['assex', 'assey'] as const);
		const h = coord(rng, 0.25);
		const eq = kind === 'verticale' ? `x = ${h.toLatex()}` : kind === 'orizzontale' ? `y = ${h.toLatex()}` : kind === 'bis13' ? 'y = x' : kind === 'bis24' ? 'y = -x' : kind === 'assex' ? 'y = 0' : 'x = 0';
		const steps: string[] = [];
		if (kind === 'verticale') {
			steps.push(`${t("Nell'equazione manca la ")} y${t(": l'ascissa vale sempre ")} ${h.toLatex()} ${t(' e l\'ordinata può essere qualsiasi.')}`);
			steps.push(`${t('I punti ')} ${pairLatex(h, ZERO)}${t(', ')} ${pairLatex(h, q(1))}${t(', ')} ${pairLatex(h, q(-2))} ${t(' stanno uno sopra l\'altro: la retta è verticale.')}`);
		} else if (kind === 'orizzontale') {
			steps.push(`${t("Nell'equazione manca la ")} x${t(": l'ordinata vale sempre ")} ${h.toLatex()} ${t(" e l'ascissa può essere qualsiasi.")}`);
			steps.push(`${t('I punti ')} ${pairLatex(ZERO, h)}${t(', ')} ${pairLatex(q(1), h)}${t(', ')} ${pairLatex(q(-2), h)} ${t(' stanno alla stessa altezza: la retta è orizzontale.')}`);
		} else if (kind === 'bis13') {
			steps.push(`${t("I punti della retta hanno l'ascissa uguale all'ordinata, come ")} (2, 2) ${t(' e ')} (-3, -3)`);
		} else if (kind === 'bis24') {
			steps.push(`${t('I punti della retta hanno le coordinate opposte, come ')} (-2, 2) ${t(' e ')} (3, -3)`);
		} else if (kind === 'assex') {
			steps.push(`${t("I punti con ordinata zero, come ")} (3, 0) ${t(' e ')} (-5, 0)${t(", sono tutti e soli quelli dell'asse ")} x`);
		} else {
			steps.push(`${t("I punti con ascissa zero, come ")} (0, 3) ${t(' e ')} (0, -5)${t(", sono tutti e soli quelli dell'asse ")} y`);
		}
		const axis = kind === 'verticale' || kind === 'assey' ? 'y' : kind === 'orizzontale' || kind === 'assex' ? 'x' : '';
		const sentence = `${eq} ${t(' ' + KIND_SENTENCE[kind])}${axis ? ` ${axis}` : ''}`;
		steps.push(sentence);
		const options = pick4(kindOpt(kind), KIND_OTHERS[kind].map(kindOpt))!;
		return {
			prompt: 'Di che tipo è questa retta?',
			problem: eq,
			solution: sentence,
			steps,
			options,
			params: { case: 'tipo', kind, value: kind === 'verticale' || kind === 'orizzontale' ? h.toString() : null },
		};
	}
	const x0 = coord(rng, 0.25);
	const y0 = coord(rng, 0.25, [x0, x0.neg()]);
	const axis = rng.pick(['x', 'y'] as const);
	const eqOpt = (v: 'x' | 'y', r: R): ChoiceOption => ({ latex: `${v} = ${r.toLatex()}`, values: [v, r.toString()] });
	// parallel to the y-axis: x = x0; to the x-axis: y = y0
	const correct = axis === 'y' ? eqOpt('x', x0) : eqOpt('y', y0);
	const cands = axis === 'y' ? [eqOpt('y', x0), eqOpt('y', y0), eqOpt('x', y0)] : [eqOpt('x', y0), eqOpt('x', x0), eqOpt('y', x0)];
	const steps =
		axis === 'y'
			? [
					`${t("La parallela all'asse ")} y ${t(' è verticale: tutti i suoi punti hanno la stessa ascissa di ')} A${t(', cioè ')} ${x0.toLatex()}`,
					`${t("L'equazione è ")} x = ${x0.toLatex()}${t(', e ')} A ${t(' la rende vera perché ')} x_A = ${x0.toLatex()}`,
				]
			: [
					`${t("La parallela all'asse ")} x ${t(' è orizzontale: tutti i suoi punti hanno la stessa ordinata di ')} A${t(', cioè ')} ${y0.toLatex()}`,
					`${t("L'equazione è ")} y = ${y0.toLatex()}${t(', e ')} A ${t(' la rende vera perché ')} y_A = ${y0.toLatex()}`,
				];
	return {
		prompt: `Scegli l'equazione della retta che passa per A ed è parallela all'asse ${axis}.`,
		problem: `A${pairLatex(x0, y0)}`,
		solution: correct.latex,
		steps,
		options: pick4(correct, cands) ?? undefined,
		params: { case: 'punto', axis, point: [x0.toString(), y0.toString()] },
	};
}

// ---------------------------------------------------------------------------
// Level 2: from the implicit to the explicit form

/** Explicit form as an option: y = m x + q. */
const explicitOpt = (m: R, k: R): ChoiceOption => ({ latex: explicitLatex(m, k), values: [sympyLine(m, k)] });

/** Steps from a x + b y + c = 0 (b ≠ 0) to y = m x + q, as in example 2. */
function toExplicitSteps(l: Line): string[] {
	const { a, b, c } = l;
	const m = a.neg().div(b);
	const k = c.neg().div(b);
	const steps = [`${t('Lascia a primo membro il termine con la ')} y ${t(' e porta gli altri a secondo membro, cambiando il loro segno: ')} ${lin([[b, 'y']])} = ${lin([[a.neg(), 'x'], [c.neg(), '']])}`];
	if (b.equals(q(-1))) steps.push(`${t('Cambia il segno di tutti i termini: ')} ${explicitLatex(m, k)}`);
	else if (!b.isOne()) steps.push(`${t('Dividi per ')} ${b.toLatex()} ${t(' ogni termine del secondo membro: ')} ${explicitLatex(m, k)}`);
	return steps;
}

function level2(rng: Rng): Built | null {
	const b = rng.next() < 0.6 ? -rng.int(1, 6) : rng.int(1, 6);
	const a = rng.int(1, 7);
	const c = nz(rng, -9, 9);
	if (gcd(gcd(a, b), c) !== 1) return null;
	if (Math.abs(b) === 1 && rng.next() < 0.7) return null;
	const l = L(a, b, c);
	const m = l.a.neg().div(l.b);
	const k = l.c.neg().div(l.b);
	const B = l.b;
	// mistakes of the lesson: only the x term divided; the sign of b forgotten; then the known term's sign, both swapped
	const cands = [explicitOpt(m, l.c.neg()), explicitOpt(m.neg(), k.neg()), explicitOpt(m, k.neg()), explicitOpt(m.neg(), k), explicitOpt(l.a.neg(), k), explicitOpt(k, m)];
	const options = pick4(explicitOpt(m, k), cands);
	if (!options) return null;
	const steps = toExplicitSteps(l);
	steps.push(`${t('Il coefficiente angolare è ')} m = ${m.toLatex()} ${t(" e l'ordinata all'origine è ")} q = ${k.toLatex()}`);
	return {
		prompt: 'Scrivi la retta in forma esplicita.',
		problem: implicitLatex(l.a, l.b, l.c),
		solution: explicitLatex(m, k),
		steps,
		options,
		expression: { value: sympyLine(m, k), latex: explicitLatex(m, k) },
		params: { line: lineJSON(l), m: m.toString(), q: k.toString(), bNegative: B.sign() < 0 },
	};
}

// ---------------------------------------------------------------------------
// Level 3: to the implicit form with integer coefficients

const implicitOpt = (l: Line): ChoiceOption => {
	const p = primitive(l);
	return { latex: implicitLatex(p.a, p.b, p.c), values: lineJSON(p) };
};

/** "\frac{x}{2}", "-\frac{y}{3}" as a term. */
function overTerm(s: number, v: string, d: number): Term {
	return { neg: s < 0, tex: d === 1 ? v : `\\frac{${v}}{${d}}` };
}

function finishImplicit(raw: Line, steps: string[], move: boolean) {
	// raw: integer coefficients, as they come after the multiplication
	steps.push(move ? `${t('Porta tutto a primo membro: ')} ${implicitLatex(raw.a, raw.b, raw.c)}` : implicitLatex(raw.a, raw.b, raw.c));
	let l = raw;
	if (l.a.sign() < 0) {
		l = L(l.a.neg(), l.b.neg(), l.c.neg());
		steps.push(`${t('Moltiplica per ')} -1 ${t(' per avere ')} a ${t(' positivo: ')} ${implicitLatex(l.a, l.b, l.c)}`);
	}
	const g = gcd(gcd(l.a.num, l.b.num), l.c.num);
	if (g > 1) {
		l = L(l.a.div(q(g)), l.b.div(q(g)), l.c.div(q(g)));
		steps.push(`${t('Dividi per ')} ${g} ${t(': ')} ${implicitLatex(l.a, l.b, l.c)}`);
	} else {
		steps.push(`${t('I coefficienti non hanno divisori comuni: ')} ${implicitLatex(l.a, l.b, l.c)}`);
	}
	return l;
}

function level3(rng: Rng, u: number): Built | null {
	if (u < 0.65) {
		// y = m x + q with at least one fraction
		const m = q(nz(rng, -7, 7), rng.pick([1, 2, 3, 4, 5, 6]));
		const k = q(nz(rng, -9, 9), rng.pick([1, 2, 3, 4, 6]));
		if (!hasFrac(m, k)) return null;
		if (m.den * k.den > 24) return null;
		const D = lcm(m.den, k.den);
		const A = m.mul(q(D));
		const C = k.mul(q(D));
		const steps = [`${t('Il minimo comune multiplo dei denominatori è ')} ${D}${t(': moltiplica per ')} ${D} ${t(' tutti i termini.')}`, `${lin([[q(D), 'y']])} = ${lin([[A, 'x'], [C, '']])}`];
		const truth = finishImplicit(L(A.neg(), q(D), C.neg()), steps, true);
		// wrong: known term's sign kept; y's sign kept; y not multiplied; x not multiplied; q not multiplied
		const cands = [L(A, q(-D), C.neg()), L(A, q(D), C), L(A, q(-1), C), L(m, q(-D), C), L(A, q(-D), k), L(A, q(D), C.neg())].map((l) => (l.a.isInteger() && l.c.isInteger() && !sameLine(l, truth) ? implicitOpt(l) : null));
		const options = pick4(implicitOpt(truth), cands);
		if (!options) return null;
		return {
			prompt: 'Scrivi la retta in forma implicita, con i coefficienti interi.',
			problem: explicitLatex(m, k),
			solution: implicitLatex(truth.a, truth.b, truth.c),
			steps,
			options,
			params: { case: 'esplicita', m: m.toString(), q: k.toString(), line: lineJSON(truth) },
		};
	}
	// x/α ± y/β + γ = 0, as in example 7
	const al = rng.int(1, 6);
	const be = rng.int(1, 6);
	if (al === be) return null;
	const s1 = rng.next() < 0.8 ? 1 : -1;
	const s2 = sgn(rng);
	const g = rng.next() < 0.7 ? q(nz(rng, -6, 6)) : q(nz(rng, -5, 5), rng.pick([2, 3, 4]));
	const D = lcm(lcm(al, be), g.den);
	const raw = L(q((s1 * D) / al), q((s2 * D) / be), g.mul(q(D)));
	if (Math.abs(raw.c.num) > 24) return null;
	const problem = `${joinTerms([overTerm(s1, 'x', al), overTerm(s2, 'y', be), { neg: g.sign() < 0, tex: g.abs().toLatex() }])} = 0`;
	const steps = [`${t('Il minimo comune multiplo dei denominatori è ')} ${D}${t(': moltiplica per ')} ${D} ${t(' tutti i termini.')}`];
	const truth = finishImplicit(raw, steps, false);
	// wrong: γ not multiplied; each denominator taken as its own coefficient; y's sign changed; γ's sign changed
	const cands = [
		g.isInteger() ? L(raw.a, raw.b, g) : null,
		L(q(s1 * al), q(s2 * be), raw.c),
		L(raw.a, raw.b.neg(), raw.c),
		L(raw.a, raw.b, raw.c.neg()),
		L(raw.a, raw.b.neg(), raw.c.neg()),
	].map((l) => (l && !sameLine(l, truth) ? implicitOpt(l) : null));
	const options = pick4(implicitOpt(truth), cands);
	if (!options) return null;
	return {
		prompt: 'Scrivi la retta in forma implicita, con i coefficienti interi.',
		problem,
		solution: implicitLatex(truth.a, truth.b, truth.c),
		steps,
		options,
		params: { case: 'frazioni', line: lineJSON(truth) },
	};
}

// ---------------------------------------------------------------------------
// Level 4: a point on the line, a missing coordinate

/** A line a x + b y + c = 0 through (x0, y0), a > 0, a, b, c ≠ 0, without common divisors. */
function lineThrough(rng: Rng, x0: R, y0: R, maxAB = 6): Line | null {
	const a = rng.int(1, maxAB);
	const b = nz(rng, -maxAB, maxAB);
	const c = q(a).mul(x0).add(q(b).mul(y0)).neg();
	if (c.isZero() || !c.isInteger() || Math.abs(c.num) > 20) return null;
	if (gcd(gcd(a, b), c.num) !== 1) return null;
	return L(a, b, c);
}

function level4(rng: Rng, u: number): Built | null {
	if (u < 0.5) {
		const explicit = rng.next() < 0.35;
		let l: Line;
		let x0: R;
		let y0: R;
		if (explicit) {
			const m = q(nz(rng, -4, 4), rng.pick([1, 1, 2, 3]));
			const k = q(nz(rng, -6, 6));
			x0 = q(nz(rng, -3, 3) * m.den);
			y0 = m.mul(x0).add(k);
			if (Math.abs(y0.num) > 12) return null;
			l = L(m, q(-1), k);
		} else {
			x0 = q(rng.int(-5, 5));
			y0 = q(rng.int(-5, 5));
			const got = lineThrough(rng, x0, y0);
			if (!got) return null;
			l = got;
		}
		if (x0.equals(y0) || onLine(l, y0, x0)) return null;
		const off = (x: R, y: R) => (onLine(l, x, y) ? null : { latex: pairLatex(x, y), values: [x.toString(), y.toString()] });
		const correct = { latex: pairLatex(x0, y0), values: [x0.toString(), y0.toString()] };
		const cands = [off(y0, x0), off(x0, y0.neg()), off(x0.neg(), y0), off(x0, y0.add(q(1))), off(x0.add(q(1)), y0), off(x0, y0.sub(q(1)))];
		const options = pick4(correct, cands);
		if (!options) return null;
		const problem = explicit ? explicitLatex(l.a, l.c) : implicitLatex(l.a, l.b, l.c);
		const steps: string[] = [];
		for (const o of options) {
			const x = Rational.parse(o.values[0]);
			const y = Rational.parse(o.values[1]);
			if (explicit) {
				const v = l.a.mul(x).add(l.c);
				const ok = v.equals(y);
				steps.push(`${pairLatex(x, y)}${t(': con ')} x = ${x.toLatex()} ${t(' si ottiene ')} ${subLatex(l.a, ZERO, l.c, x, ZERO)} = ${v.toLatex()}${ok ? `${t(', che è proprio ')} y` : `${t(', diverso da ')} ${y.toLatex()}`}`);
			} else {
				const v = l.a.mul(x).add(l.b.mul(y)).add(l.c);
				steps.push(`${pairLatex(x, y)}${t(': ')} ${subLatex(l.a, l.b, l.c, x, y)} = ${v.toLatex()}${v.isZero() ? t(', uguaglianza vera') : ` \\neq 0`}`);
			}
		}
		steps.push(`${t('Appartiene alla retta solo il punto ')} ${pairLatex(x0, y0)}`);
		return {
			prompt: 'Quale di questi punti appartiene alla retta?',
			problem,
			solution: pairLatex(x0, y0),
			steps,
			options,
			params: { case: 'appartenenza', form: explicit ? 'esplicita' : 'implicita', line: lineJSON(l), point: [x0.toString(), y0.toString()] },
		};
	}
	// the missing coordinate: given x_C find y_C, or given y_C find x_C
	const given = rng.next() < 0.6 ? 'x' : 'y';
	const a = rng.int(1, 6);
	const b = nz(rng, -6, 6);
	const c = nz(rng, -12, 12);
	if (gcd(gcd(a, b), c) !== 1) return null;
	const l = L(a, b, c);
	const g = q(nz(rng, -6, 6));
	const coefU = given === 'x' ? l.b : l.a; // coefficient of the unknown
	const coefG = given === 'x' ? l.a : l.b;
	const rest = coefG.mul(g).add(l.c); // coefU · u + rest = 0
	if (rest.isZero()) return null;
	const ans = rest.neg().div(coefU);
	if (ans.den > 4 || Math.abs(ans.num) > 20) return null;
	if (!ans.isInteger() && rng.next() < 0.6) return null;
	// wrong: the given value put in the other letter; the sign of rest kept; not divided by the coefficient
	const swapped = coefU.isZero() ? null : coefU.mul(g).add(l.c).neg().div(coefG);
	const wrong = [swapped, rest.div(coefU), rest.neg(), ans.add(q(1)), ans.sub(q(1))];
	const unk = given === 'x' ? 'y' : 'x';
	const numOpt = (r: R): ChoiceOption => ({ latex: `${unk}_C = ${r.toLatex()}`, values: [r.toString()] });
	const options = pick4(
		numOpt(ans),
		wrong.map((r) => (r ? numOpt(r) : null)),
	);
	if (!options) return null;
	const [xs, ys] = given === 'x' ? [g, ans] : [ans, g];
	const subst = given === 'x' ? `${subLatex(l.a, ZERO, ZERO, g, ZERO)} ${lin([[l.b, 'y'], [l.c, '']]).replace(/^(?!-)/, '+ ').replace(/^-/, '- ')} = 0` : `${lin([[l.a, 'x']])} ${joinTerms([prodTerm(l.b, g, false), ...(l.c.isZero() ? [] : [{ neg: l.c.sign() < 0, tex: l.c.abs().toLatex() }])]).replace(/^(?!-)/, '+ ').replace(/^-/, '- ')} = 0`;
	const steps = [
		`${t('Metti ')} ${given} = ${g.toLatex()} ${t(" nell'equazione: ")} ${subst}`,
		`${lin([[coefU, unk]])} = ${rest.neg().toLatex()}`,
		...(coefU.isOne() ? [] : [`${unk} = ${ans.toLatex()}`]),
		`${t('Il punto è ')} C${pairLatex(xs, ys)}`,
	];
	return {
		prompt: given === 'x' ? "Trova l'ordinata del punto C della retta che ha l'ascissa data." : "Trova l'ascissa del punto C della retta che ha l'ordinata data.",
		problem: `${implicitLatex(l.a, l.b, l.c)} \\quad ${given}_C = ${g.toLatex()}`,
		solution: `${unk}_C = ${ans.toLatex()}`,
		steps,
		options,
		number: ans,
		params: { case: 'coordinata', line: lineJSON(l), given, value: g.toString(), answer: ans.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the points on the axes

const axesOpt = (xa: R, yb: R): ChoiceOption => ({ latex: `A${pairLatex(xa, ZERO)},\\ B${pairLatex(ZERO, yb)}`, values: [xa.toString(), yb.toString()] });

function level5(rng: Rng, u: number): Built | null {
	const explicit = rng.next() < 0.3;
	let l: Line;
	if (explicit) {
		const m = q(nz(rng, -6, 6), rng.pick([1, 1, 2, 3, 4]));
		const k = q(nz(rng, -8, 8), rng.pick([1, 1, 1, 2]));
		l = L(m, q(-1), k);
	} else {
		const a = rng.int(1, 6);
		const b = nz(rng, -6, 6);
		const c = nz(rng, -12, 12);
		if (gcd(gcd(a, b), c) !== 1) return null;
		l = L(a, b, c);
	}
	const xa = l.c.neg().div(l.a);
	const yb = l.c.neg().div(l.b);
	const frac = hasFrac(xa, yb);
	if ((u < 0.4) === frac) return null; // 4 in 10 with integer points
	if (xa.den > 6 || yb.den > 6 || Math.abs(xa.num) > 20 || Math.abs(yb.num) > 20) return null;
	// wrong: the two values swapped between the axes (x = 0 used for the x-axis); both signs; one sign
	const cands = [axesOpt(yb, xa), axesOpt(xa.neg(), yb.neg()), axesOpt(xa.neg(), yb), axesOpt(xa, yb.neg()), axesOpt(yb.neg(), xa.neg())];
	const options = pick4(axesOpt(xa, yb), cands);
	if (!options) return null;
	const steps: string[] = [];
	if (explicit) {
		steps.push(`${t("Con ")} x = 0 ${t(' si ottiene ')} y = ${yb.toLatex()}${t(", l'ordinata all'origine: ")} B${pairLatex(ZERO, yb)}`);
		steps.push(`${t('Con ')} y = 0 ${t(" l'equazione diventa ")} 0 = ${lin([[l.a, 'x'], [l.c, '']])}${t(', cioè ')} x = ${xa.toLatex()}${t(': ')} A${pairLatex(xa, ZERO)}`);
	} else {
		steps.push(`${t('Con ')} x = 0 ${t(" l'equazione diventa ")} ${implicitLatex(ZERO, l.b, l.c)}${t(', cioè ')} y = ${yb.toLatex()}${t(': ')} B${pairLatex(ZERO, yb)}`);
		steps.push(`${t('Con ')} y = 0 ${t(' diventa ')} ${implicitLatex(l.a, ZERO, l.c)}${t(', cioè ')} x = ${xa.toLatex()}${t(': ')} A${pairLatex(xa, ZERO)}`);
	}
	return {
		prompt: "Trova il punto A in cui la retta taglia l'asse x e il punto B in cui taglia l'asse y.",
		problem: explicit ? explicitLatex(l.a, l.c) : implicitLatex(l.a, l.b, l.c),
		solution: `A${pairLatex(xa, ZERO)},\\ B${pairLatex(ZERO, yb)}`,
		steps,
		options,
		params: { case: frac ? 'frazionari' : 'interi', form: explicit ? 'esplicita' : 'implicita', line: lineJSON(l) },
	};
}

// ---------------------------------------------------------------------------
// Level 6: equations with a = 0, b = 0 or c = 0

type Kind6 = 'verticale' | 'orizzontale' | 'origine';
const SPECIAL: Record<string, string> = { h: '\\text{verticale: } x = ', k: '\\text{orizzontale: } y = ', m: "\\text{per l'origine: } y = " };
function specialOpt(kind: 'h' | 'k' | 'm', r: R): ChoiceOption | null {
	if (kind === 'm' && r.isZero()) return null;
	const tail = kind === 'm' ? lin([[r, 'x']]) : r.toLatex();
	return { latex: `${SPECIAL[kind]}${tail}`, values: [kind, r.toString()] };
}

function level6(rng: Rng, u: number): Built | null {
	const kind: Kind6 = u < 1 / 3 ? 'verticale' : u < 2 / 3 ? 'orizzontale' : 'origine';
	let l: Line;
	let correct: ChoiceOption;
	let cands: (ChoiceOption | null)[];
	const steps: string[] = [];
	if (kind === 'verticale' || kind === 'orizzontale') {
		const p = kind === 'verticale' ? rng.int(2, 6) : sgn(rng) * rng.int(2, 6);
		const c = nz(rng, -12, 12);
		const v = q(-c, p);
		l = kind === 'verticale' ? L(p, 0, c) : L(0, p, c);
		const [me, other] = kind === 'verticale' ? (['h', 'k'] as const) : (['k', 'h'] as const);
		correct = specialOpt(me, v)!;
		cands = [specialOpt(other, v), specialOpt(me, v.neg()), specialOpt(me, q(p).div(q(-c))), specialOpt(other, v.neg())];
		const letter = kind === 'verticale' ? 'x' : 'y';
		const missing = kind === 'verticale' ? 'y' : 'x';
		steps.push(`${t('Manca la ')} ${missing}${t(': è il caso ')} ${missing === 'y' ? 'b' : 'a'} = 0${t(', una retta ')}${t(kind)}`);
		steps.push(`${lin([[q(p), letter]])} = ${q(-c).toLatex()}${t(', cioè ')} ${letter} = ${v.toLatex()}`);
		steps.push(
			kind === 'verticale'
				? `${t("Taglia l'asse ")} x ${t(' in ')} ${pairLatex(v, ZERO)} ${t(" e non taglia mai l'asse ")} y`
				: `${t("Taglia l'asse ")} y ${t(' in ')} ${pairLatex(ZERO, v)} ${t(" e non taglia mai l'asse ")} x`,
		);
	} else {
		const a = rng.int(1, 6);
		const b = nz(rng, -6, 6);
		if (gcd(a, b) !== 1 || a === Math.abs(b)) return null;
		l = L(a, b, 0);
		const m = q(-a, b);
		correct = specialOpt('m', m)!;
		cands = [specialOpt('m', q(-b, a)), specialOpt('m', m.neg()), specialOpt('m', q(b, a)), specialOpt('m', q(-a))];
		steps.push(`${t('Manca il termine noto: è il caso ')} c = 0${t(", una retta che passa per l'origine")}`);
		steps.push(`${lin([[q(b), 'y']])} = ${lin([[q(-a), 'x']])}${t(', cioè ')} ${explicitLatex(m, ZERO)}`);
	}
	const options = pick4(correct, cands);
	if (!options) return null;
	steps.push(correct.latex);
	return {
		prompt: 'Riconosci il caso particolare e scrivi la retta nella forma più semplice.',
		problem: implicitLatex(l.a, l.b, l.c),
		solution: correct.latex,
		steps,
		options,
		params: { case: kind, line: lineJSON(l) },
	};
}

// ---------------------------------------------------------------------------
// Level 7: a line with a parameter

type Pos = 'x' | 'y' | 'c';
type Q7 = 'orizzontale' | 'verticale' | 'origine' | 'punto';
const Q7_PROMPT: Record<Q7, string> = {
	orizzontale: 'Per quale valore di k la retta è orizzontale?',
	verticale: 'Per quale valore di k la retta è verticale?',
	origine: "Per quale valore di k la retta passa per l'origine?",
	punto: 'Per quale valore di k la retta passa per il punto A?',
};

/** "(k - 1)", "(2k + 3)" as a factor; "k - 4" in the known term. */
function kExpr(p: number, al: number): string {
	const head = `${p === 1 ? '' : p === -1 ? '-' : p}k`;
	return al === 0 ? head : `${head} ${al < 0 ? '-' : '+'} ${Math.abs(al)}`;
}

function paramLatex(pos: Pos, p: number, al: number, u: number, v: number): string {
	// the fixed coefficients: pos x → (b = u, c = v), pos y → (a = u, c = v), pos c → (a = u, b = v)
	const factor = (s: string) => `(${s})`;
	if (pos === 'x') return `${factor(kExpr(p, al))}x ${lin([[q(u), 'y'], [q(v), '']]).replace(/^-/, '- ').replace(/^(?![-])/, '+ ')} = 0`;
	if (pos === 'y') return `${lin([[q(u), 'x']])} + ${factor(kExpr(p, al))}y ${lin([[q(v), '']]).replace(/^-/, '- ').replace(/^(?![-])/, '+ ')} = 0`;
	return `${lin([[q(u), 'x'], [q(v), 'y']])} + ${kExpr(p, al)} = 0`;
}

/** The line at a value of k. */
function lineAt(pos: Pos, p: number, al: number, u: number, v: number, k: R): Line {
	const kk = q(p).mul(k).add(q(al));
	if (pos === 'x') return L(kk, q(u), q(v));
	if (pos === 'y') return L(q(u), kk, q(v));
	return L(q(u), q(v), kk);
}

function level7(rng: Rng, u: number): Built | null {
	const w = u * 4;
	const question: Q7 = w < 1 ? 'orizzontale' : w < 1.8 ? 'verticale' : w < 2.6 ? 'origine' : 'punto';
	const none = (u * 1000) % 1 < 0.25;
	const p = rng.next() < 0.75 ? 1 : 2;
	const al = nz(rng, -6, 6);
	let pos: Pos;
	let point: [R, R] | null = null;
	if (!none) pos = question === 'orizzontale' ? 'x' : question === 'verticale' ? 'y' : question === 'origine' ? 'c' : rng.pick(['x', 'y', 'c'] as const);
	else pos = question === 'orizzontale' ? rng.pick(['y', 'c'] as const) : question === 'verticale' ? rng.pick(['x', 'c'] as const) : question === 'origine' ? rng.pick(['x', 'y'] as const) : rng.pick(['x', 'y'] as const);
	let fu = nz(rng, pos === 'c' ? 1 : -6, 6);
	let fv = nz(rng, -9, 9);
	if (pos === 'y' && fu < 0) fu = -fu;
	if (question === 'punto') {
		let x0 = q(rng.int(-5, 5));
		let y0 = q(rng.int(-5, 5));
		if (none) {
			if (pos === 'x') x0 = ZERO;
			else y0 = ZERO;
		}
		if (x0.isZero() && y0.isZero()) return null;
		point = [x0, y0];
		if (!none) {
			// k0 first, then the fixed known term (or the α of the known term) so that A is on the line
			const k0 = p === 1 ? q(nz(rng, -6, 6)) : q(nz(rng, -7, 7), 2);
			const kk = q(p).mul(k0).add(q(al));
			if (pos === 'x' || pos === 'y') {
				if ((pos === 'x' ? x0 : y0).isZero()) return null;
				const cv = kk.mul(pos === 'x' ? x0 : y0).add(q(fu).mul(pos === 'x' ? y0 : x0)).neg();
				if (!cv.isInteger() || cv.isZero() || Math.abs(cv.num) > 12) return null;
				fv = cv.num;
			} else {
				const need = q(fu).mul(x0).add(q(fv).mul(y0)).neg(); // p k0 + α = need
				const a2 = need.sub(q(p).mul(k0));
				if (!a2.isInteger() || a2.isZero() || Math.abs(a2.num) > 12) return null;
				return build7(rng, question, none, pos, p, a2.num, fu, fv, point);
			}
		} else {
			// the k-free part must not vanish at A, or every k would work
			const rest = pos === 'x' ? q(fu).mul(y0).add(q(fv)) : q(fu).mul(x0).add(q(fv));
			if (rest.isZero()) return null;
		}
	}
	return build7(rng, question, none, pos, p, al, fu, fv, point);
}

/** ", cioè x + y - 2 = 0" when the line has a simpler equation (divided by a common factor, a > 0). */
function simpler(l: Line): string {
	const p = primitive(l);
	return p.a.equals(l.a) && p.b.equals(l.b) && p.c.equals(l.c) ? '' : `${t(', cioè ')} ${implicitLatex(p.a, p.b, p.c)}`;
}

function build7(rng: Rng, question: Q7, none: boolean, pos: Pos, p: number, al: number, fu: number, fv: number, point: [R, R] | null): Built | null {
	const kZero = q(-al, p); // the value that cancels the coefficient with k
	let truth: R | null = null;
	const steps: string[] = [];
	if (question === 'orizzontale' || question === 'verticale') {
		const want: Pos = question === 'orizzontale' ? 'x' : 'y';
		const letter = want;
		if (pos === want) {
			truth = kZero;
			steps.push(`\\text{La retta è ${question} quando il coefficiente della } ${letter} \\text{ è zero: } ${kExpr(p, al)} = 0${t(', cioè ')} k = ${truth.toLatex()}`);
			const l = lineAt(pos, p, al, fu, fv, truth);
			steps.push(`${t("L'equazione diventa ")} ${implicitLatex(l.a, l.b, l.c)}${simpler(l)}`);
		} else {
			const fixed = pos === 'c' ? (want === 'x' ? fu : fv) : fu;
			steps.push(`\\text{La retta è ${question} quando il coefficiente della } ${letter} \\text{ è zero, ma quel coefficiente vale sempre } ${fixed}`);
			steps.push(`${t('Nessun valore di ')} k ${t(` la rende ${question}.`)}`);
		}
	} else if (question === 'origine') {
		if (pos === 'c') {
			truth = kZero;
			steps.push(`${t("La retta passa per l'origine quando il termine noto è zero: ")} ${kExpr(p, al)} = 0${t(', cioè ')} k = ${truth.toLatex()}`);
		} else {
			steps.push(`${t('Con ')} x = 0 ${t(' e ')} y = 0 ${t(" l'equazione diventa ")} ${fv} = 0${t(', falsa qualunque sia ')} k`);
			steps.push(`${t('Nessun valore di ')} k ${t(" fa passare la retta per l'origine: il termine noto non contiene ")} k`);
		}
	} else {
		const [x0, y0] = point!;
		// (p k + α)·s + r = 0
		const s = pos === 'x' ? x0 : pos === 'y' ? y0 : q(1);
		const r = pos === 'x' ? q(fu).mul(y0).add(q(fv)) : pos === 'y' ? q(fu).mul(x0).add(q(fv)) : q(fu).mul(x0).add(q(fv).mul(y0));
		const subst = pos === 'c' ? `${subLatex(q(fu), q(fv), ZERO, x0, y0)} + ${kExpr(p, al)} = 0` : pos === 'x' ? `(${kExpr(p, al)}) \\cdot ${paren(x0)} ${joinTerms([prodTerm(q(fu), y0, false), { neg: fv < 0, tex: `${Math.abs(fv)}` }]).replace(/^-/, '- ').replace(/^(?!-)/, '+ ')} = 0` : `${subLatex(q(fu), ZERO, ZERO, x0, ZERO)} + (${kExpr(p, al)}) \\cdot ${paren(y0)} ${fv < 0 ? '-' : '+'} ${Math.abs(fv)} = 0`;
		steps.push(`${t('Metti le coordinate di ')} A ${t(" nell'equazione: ")} ${subst}`);
		// linear in k: p s k + (α s + r) = 0
		const ck = q(p).mul(s);
		const c0 = q(al).mul(s).add(r);
		if (ck.isZero()) {
			steps.push(`${t('La ')} k ${t(' sparisce e resta ')} ${c0.toLatex()} = 0${t(', falsa qualunque sia ')} k`);
			steps.push(`${t('Nessun valore di ')} k ${t(' fa passare la retta per ')} A`);
		} else {
			truth = c0.neg().div(ck);
			steps.push(`${lin([[ck, 'k'], [c0, '']])} = 0${t(', cioè ')} k = ${truth.toLatex()}`);
			const l = lineAt(pos, p, al, fu, fv, truth);
			steps.push(`${t('Con ')} k = ${truth.toLatex()} ${t(' la retta è ')} ${implicitLatex(l.a, l.b, l.c)}${simpler(l)}`);
		}
	}
	if ((truth === null) !== none) return null;
	if (truth && (truth.den > 2 || Math.abs(truth.num) > 12)) return null;
	// a genuine line for the answer
	if (truth) {
		const l = lineAt(pos, p, al, fu, fv, truth);
		if (l.a.isZero() && l.b.isZero()) return null;
	}
	const kOpt = (r: R): ChoiceOption => ({ latex: `k = ${r.toLatex()}`, values: [r.toString()] });
	const noneOpt: ChoiceOption = { latex: '\\text{nessun valore di } k', values: ['none'] };
	const cands: ChoiceOption[] = [];
	let swapped: R | null = null;
	if (point && pos !== 'c') {
		// the coordinates swapped
		const [x0, y0] = point;
		const s2 = pos === 'x' ? y0 : x0;
		const r2 = pos === 'x' ? q(fu).mul(x0).add(q(fv)) : q(fu).mul(y0).add(q(fv));
		const ck2 = q(p).mul(s2);
		if (!ck2.isZero()) swapped = q(al).mul(s2).add(r2).neg().div(ck2);
	} else if (point) {
		const [x0, y0] = point;
		swapped = q(fu).mul(y0).add(q(fv).mul(x0)).neg().sub(q(al)).div(q(p));
	}
	if (truth) {
		cands.push(noneOpt);
		if (!kZero.equals(truth)) cands.push(kOpt(kZero));
		if (swapped) cands.push(kOpt(swapped));
		cands.push(kOpt(truth.neg()), kOpt(truth.add(q(1))), kOpt(truth.sub(q(1))));
	} else {
		cands.push(kOpt(kZero));
		if (swapped) cands.push(kOpt(swapped));
		cands.push(kOpt(kZero.neg()), kOpt(kZero.add(q(1))), kOpt(kZero.sub(q(1))));
	}
	const correct = truth ? kOpt(truth) : noneOpt;
	const options = pick4(
		correct,
		cands.filter((o) => o.values[0] === 'none' || (Rational.parse(o.values[0]).den <= 2 && Math.abs(Rational.parse(o.values[0]).num) <= 20)),
	);
	if (!options) return null;
	const eq = paramLatex(pos, p, al, fu, fv);
	return {
		prompt: Q7_PROMPT[question],
		problem: point ? `${eq} \\quad A${pairLatex(point[0], point[1])}` : eq,
		solution: truth ? `k = ${truth.toLatex()}` : '\\text{nessun valore di } k',
		steps,
		options,
		...(truth ? { number: truth } : {}),
		params: {
			case: truth ? 'esiste' : 'nessuno',
			question,
			pos,
			p,
			alpha: al,
			fixed: [fu, fv],
			point: point ? [point[0].toString(), point[1].toString()] : null,
			k: truth ? truth.toString() : null,
		},
	};
}

// ---------------------------------------------------------------------------
// Sample

function build(rng: Rng, level: number, u: number): Built | null {
	switch (level) {
		case 1:
			return level1(rng, u);
		case 2:
			return level2(rng);
		case 3:
			return level3(rng, u);
		case 4:
			return level4(rng, u);
		case 5:
			return level5(rng, u);
		case 6:
			return level6(rng, u);
		case 7:
			return level7(rng, u);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

function assemble(b: Built, level: number, rng: Rng): Sample | null {
	if (!b.options) return null;
	const base = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps };
	const optionsJSON = b.options.map((o) => ({ latex: o.latex, values: [...o.values] }));
	if (b.expression) return { ...base, answer: { kind: 'expression', value: b.expression.value, latex: b.expression.latex, form: 'explicit' }, params: { ...b.params, options: optionsJSON } };
	if (b.number) return { ...base, answer: { kind: 'number', value: b.number.toString() }, params: { ...b.params, options: optionsJSON } };
	return { ...base, answer: shuffleOpts(rng, b.options), params: b.params };
}

// ---------------------------------------------------------------------------
// Check

export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito', re: /(?<![\d.{])1\s*[xyk]/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*[xyk]/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
	{ name: 'numeratore nullo', re: /\\d?frac\{0\}/ },
	{ name: 'denominatore 1', re: /\\d?frac\{[^{}]*\}\{1\}/ },
];

const lineFrom = (v: unknown): Line | null => {
	if (!Array.isArray(v) || v.length !== 3) return null;
	try {
		return L(Rational.parse(String(v[0])), Rational.parse(String(v[1])), Rational.parse(String(v[2])));
	} catch {
		return null;
	}
};

function check(sample: Sample): string[] {
	const out: string[] = [];
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) out.push(`problema contiene ${name}: ${sample.problem}`);
	const opts = sample.answer.kind === 'choice' ? sample.answer.options : ((sample.params.options as ChoiceOption[] | undefined) ?? []);
	if (opts.length !== 4) out.push('servono quattro opzioni');
	if (new Set(opts.map((o) => o.values.join('|'))).size !== opts.length) out.push('opzioni ripetute');
	for (const o of opts) for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(o.latex)) out.push(`opzione contiene ${name}: ${o.latex}`);
	const p = sample.params;
	const l = lineFrom(p.line);
	switch (sample.level) {
		case 1:
			if (sample.answer.kind !== 'choice') out.push('livello 1: scelta multipla');
			break;
		case 2: {
			if (!l || l.b.isZero() || l.a.isZero() || l.c.isZero()) {
				out.push('livello 2: a, b, c non nulli');
				break;
			}
			const m = l.a.neg().div(l.b);
			const k = l.c.neg().div(l.b);
			if (sample.answer.kind !== 'expression' || sample.answer.value !== sympyLine(m, k)) out.push('livello 2: risposta sbagliata');
			if (opts[0]?.values[0] !== sympyLine(m, k)) out.push('livello 2: la prima opzione non è la risposta');
			break;
		}
		case 3: {
			if (!l || sample.answer.kind !== 'choice') {
				out.push('livello 3: retta o risposta mancante');
				break;
			}
			const right = lineFrom(sample.answer.options[sample.answer.correct].values);
			if (!right || !sameLine(right, l)) out.push("livello 3: l'opzione giusta non è la retta");
			for (const o of sample.answer.options) {
				const ol = lineFrom(o.values);
				if (!ol || lineKey(ol) !== o.values.join('|')) out.push(`livello 3: opzione non ridotta ${o.latex}`);
				if (ol && o !== sample.answer.options[sample.answer.correct] && sameLine(ol, l)) out.push('livello 3: distrattore uguale alla retta');
			}
			break;
		}
		case 4: {
			if (!l) {
				out.push('livello 4: retta mancante');
				break;
			}
			if (p.case === 'appartenenza' && sample.answer.kind === 'choice') {
				const on = sample.answer.options.filter((o) => onLine(l, Rational.parse(o.values[0]), Rational.parse(o.values[1])));
				if (on.length !== 1 || on[0] !== sample.answer.options[sample.answer.correct]) out.push('livello 4: serve un solo punto sulla retta');
			} else if (p.case === 'coordinata' && sample.answer.kind === 'number') {
				const g = Rational.parse(String(p.value));
				const ans = Rational.parse(sample.answer.value);
				const ok = p.given === 'x' ? onLine(l, g, ans) : onLine(l, ans, g);
				if (!ok) out.push('livello 4: coordinata sbagliata');
			} else out.push('livello 4: caso sconosciuto');
			break;
		}
		case 5: {
			if (!l || sample.answer.kind !== 'choice') {
				out.push('livello 5: retta o risposta mancante');
				break;
			}
			const o = sample.answer.options[sample.answer.correct];
			if (!onLine(l, Rational.parse(o.values[0]), ZERO) || !onLine(l, ZERO, Rational.parse(o.values[1]))) out.push('livello 5: punti sugli assi sbagliati');
			break;
		}
		case 6: {
			if (!l || sample.answer.kind !== 'choice') {
				out.push('livello 6: retta o risposta mancante');
				break;
			}
			const zeros = [l.a, l.b, l.c].filter((r) => r.isZero()).length;
			if (zeros !== 1) out.push('livello 6: serve esattamente un coefficiente nullo');
			const [kind, v] = sample.answer.options[sample.answer.correct].values;
			const r = Rational.parse(v);
			const as = kind === 'h' ? L(1, 0, r.neg()) : kind === 'k' ? L(0, 1, r.neg()) : L(r, -1, 0);
			if (!sameLine(as, l)) out.push("livello 6: l'opzione giusta non è la retta");
			break;
		}
		case 7: {
			const k = p.k === null ? null : Rational.parse(String(p.k));
			if (k === null ? sample.answer.kind !== 'choice' : sample.answer.kind !== 'number' || sample.answer.value !== k.toString()) out.push('livello 7: risposta incoerente');
			if (k === null && sample.answer.kind === 'choice' && sample.answer.options[sample.answer.correct].values[0] !== 'none') out.push('livello 7: la risposta giusta è "nessun valore"');
			break;
		}
		default:
			out.push(`livello sconosciuto ${sample.level}`);
	}
	if (!sample.steps.length) out.push('nessun passaggio');
	return out;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const opts = sample.params.options as ChoiceOption[];
	return shuffleOpts(rng, opts);
}

const equazioneDiUnaRetta: Generator = {
	id: ID,
	title: 'Equazione della retta e casi particolari',
	levels: {
		1: { label: 'Parallele agli assi e bisettrici', constraints: ["4 su 10: il tipo della retta dall'equazione", "6 su 10: la parallela a un asse per un punto, con coordinate anche frazionarie"] },
		2: { label: 'Dalla forma implicita alla esplicita', constraints: ['a, b, c interi non nulli senza divisori comuni', 'b negativo 6 volte su 10'] },
		3: { label: 'Alla forma implicita con coefficienti interi', constraints: ['forma esplicita con frazioni o equazione con frazioni', 'risposta con a positivo e coefficienti senza divisori comuni'] },
		4: { label: 'Punti che appartengono alla retta', constraints: ['metà: quale punto sta sulla retta', 'metà: la coordinata mancante'] },
		5: { label: 'Intersezioni con gli assi', constraints: ['a, b, c non nulli', '6 su 10 con almeno una coordinata frazionaria'] },
		6: { label: 'Rette con a = 0, b = 0 o c = 0', constraints: ['un terzo per caso'] },
		7: { label: 'Una retta con un parametro', constraints: ['orizzontale, verticale, per l’origine, per un punto', '1 su 4 senza nessun valore di k'] },
	},
	generate(rng: Rng, level: number): Sample {
		const u = rng.next();
		for (let attempt = 0; attempt < 20_000; attempt++) {
			const b = build(rng, level, u);
			if (!b) continue;
			const sample = assemble(b, level, rng);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default equazioneDiUnaRetta;
