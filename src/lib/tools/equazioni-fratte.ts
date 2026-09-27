import { Rational, ONE, ZERO, gcd, lcm, q } from '@/lib/exercises/v2/rational';
import { Surd } from '@/lib/exercises/v2/surd';
import { polyAdd, polyDegree, polyMul, polyScale, polySub, polyToLatex, type Poly } from '@/lib/exercises/v2/latex';
import { nodeLatex, parseEquation, unwrap, type Node } from './equazione';
import { equazionePrimoGrado } from './equazioni-primo-grado';
import { equazioneSecondoGrado, quadraticRoots } from './equazioni-secondo-grado';
import { lead, parsePolynomial, polyEq, polyText, sameLatex, trim } from './polinomi';
import { approxTex, num, numText, sortNums, type Num } from './intervalli';
import { fail, type Outcome, type ResultRow, type Step } from './types';

/**
 * Fractional equations (equazioni fratte), solved as in the lesson (equazioni-sistemi/equazioni-fratte): factor the
 * denominators, write the conditions of existence (C.E.), take the least common multiple of the denominators, reduce
 * both sides to it and drop it, solve the integer equation with the first- or second-degree tool, and compare the
 * solutions with the C.E., discarding the ones that make a denominator zero.
 *
 * The equation parser of `equazione.ts` refuses an x in a denominator, so the equation is first split into its terms
 * (at the + and − outside brackets); a term with a "/" outside brackets is a fraction, and its numerator and
 * denominator are read as polynomials. Everything after the "/" is the denominator: 1/2x is 1/(2x). Numerators and
 * denominators have degree at most 2.
 *
 * Also the factoring of a polynomial of degree at most 2 over the rationals, shared with the fractional inequalities.
 */

// ---------------------------------------------------------------------------
// Factoring, degree ≤ 2

/** A factor with integer coprime coefficients and a positive leading one: x − 2, 2x + 1, x² + 1. */
export interface Factor {
	p: Poly;
	/** Its exponent: 2 for (x − 1)². */
	m: number;
	/** Where it is zero, in increasing order: one for a first-degree factor, none or two for a second-degree one. */
	roots: Num[];
}

/** A polynomial as c · the product of its factors. */
export interface Factored {
	c: Rational;
	factors: Factor[];
}

/** p = k · f, with f of integer coprime coefficients and a positive leading coefficient. */
export function primitive(p: Poly): { k: Rational; f: Poly } {
	const t = trim(p);
	const m = t.reduce((acc, c) => lcm(acc, c.den), 1);
	const ints = t.map((c) => c.num * (m / c.den));
	const g = ints.reduce((acc, n) => gcd(acc, n), 0) || 1;
	const s = ints[ints.length - 1] < 0 ? -1 : 1;
	const f = ints.map((n) => q((s * n) / g));
	return { k: lead(t).div(lead(f)), f };
}

/** A polynomial of degree at most 2 in factors over the rationals: x² − 4 = (x + 2)(x − 2); 1 − x = −(x − 1). */
export function factorLow(p0: Poly): Factored {
	const p = trim(p0);
	const d = polyDegree(p);
	if (d <= 0) return { c: p[0] ?? ZERO, factors: [] };
	if (d === 1) {
		const { k, f } = primitive(p);
		return { c: k, factors: [{ p: f, m: 1, roots: [num(f[0].neg().div(f[1]))] }] };
	}
	const roots = quadraticRoots(p);
	if (roots.length && roots.every((r) => r.isRational())) {
		const lin = (r: Surd) => primitive([r.toRational().neg(), ONE]).f;
		if (roots.length === 1) {
			const f = lin(roots[0]);
			return { c: lead(p).div(f[1].mul(f[1])), factors: [{ p: f, m: 2, roots }] };
		}
		// x first, as a student writes x(x − 2); then the others by their zero.
		const fs = roots.map((r) => ({ p: lin(r), m: 1, roots: [r] })).sort((a, b) => (a.roots[0].isZero() ? -1 : b.roots[0].isZero() ? 1 : 0));
		return { c: lead(p).div(fs[0].p[1].mul(fs[1].p[1])), factors: fs };
	}
	const { k, f } = primitive(p);
	return { c: k, factors: [{ p: f, m: 1, roots }] };
}

const terms = (p: Poly) => trim(p).filter((c) => !c.isZero()).length;

/** A factor in a product: "x", "(x - 2)", "(x - 1)^2", "x^2". */
function factorTex(f: Factor, bare: boolean): string {
	const body = polyToLatex(f.p);
	const multi = terms(f.p) > 1;
	if (f.m === 1) return multi && !bare ? `(${body})` : body;
	return multi ? `(${body})^{${f.m}}` : `${body}^{${f.m}}`;
}

/** "(x + 2)(x - 2)", "-(x - 1)", "2x", "x^2 + 1". */
export function factoredLatex(F: Factored): string {
	if (!F.factors.length) return F.c.toLatex();
	const prefix = F.c.isOne() ? '' : F.c.equals(q(-1)) ? '-' : F.c.toLatex();
	const bare = !prefix && F.factors.length === 1;
	return prefix + F.factors.map((f) => factorTex(f, bare)).join('');
}

/** Π f^m as a polynomial. */
function productOf(factors: Factor[]): Poly {
	return factors.reduce<Poly>((acc, f) => {
		let out = acc;
		for (let i = 0; i < f.m; i++) out = polyMul(out, f.p);
		return out;
	}, [ONE]);
}

// ---------------------------------------------------------------------------
// Reading the equation

export const EXAMPLE = '3/(x - 2) = 5/x';
const MAX_LENGTH = 200;
const MAX_TERMS = 8;
const MAX_DEGREE = 2;

interface Term {
	neg: boolean;
	N: Poly;
	D: Poly;
	nNode: Node;
	/** Null for a term without a fraction line. */
	dNode: Node | null;
}

type ParsedFrac = { ok: true; left: Term[]; right: Term[]; latex: string } | { ok: false; error: string };

/** The messages of the polynomial parser, said of an equation. */
function reword(error: string): string {
	if (error.startsWith('La x non può stare in un denominatore')) return `Scrivi ogni frazione come un termine a sé, con il denominatore tra parentesi: ${EXAMPLE}.`;
	return error
		.replace('Il polinomio è incompleto: manca qualcosa alla fine.', 'Un termine è incompleto: manca qualcosa.')
		.replace('Scrivi il polinomio con la lettera x', 'Usa la x come incognita')
		.replace("in un polinomio", "in un'equazione")
		.replace('Nel polinomio', "Nell'equazione");
}

/** The characters of s outside brackets, with their index. */
function topLevel(s: string): { ch: string; i: number }[] {
	const out: { ch: string; i: number }[] = [];
	let depth = 0;
	[...s].forEach((ch, i) => {
		if ('([{'.includes(ch)) depth++;
		else if (')]}'.includes(ch)) depth--;
		else if (depth === 0) out.push({ ch, i });
	});
	return out;
}

/** "3/(x - 2) + 1 - x/2" → +3/(x - 2), +1, −x/2. A sign right after an operator belongs to the factor. */
function splitTerms(s: string): { neg: boolean; text: string }[] {
	const out: { neg: boolean; text: string }[] = [];
	let depth = 0;
	let cur = '';
	let neg = false;
	let prev = '';
	for (const ch of s) {
		if ('([{'.includes(ch)) depth++;
		else if (')]}'.includes(ch)) depth--;
		if (depth === 0 && (ch === '+' || ch === '-')) {
			if (!cur.trim()) {
				if (ch === '-') neg = !neg;
				prev = ch;
				continue;
			}
			if (!'*/:^·×'.includes(prev)) {
				out.push({ neg, text: cur });
				cur = '';
				neg = ch === '-';
				prev = ch;
				continue;
			}
		}
		cur += ch;
		if (!/\s/.test(ch)) prev = ch;
	}
	out.push({ neg, text: cur });
	return out;
}

class FracError extends Error {}

function parseTerm(t: { neg: boolean; text: string }): Term {
	const slashes = topLevel(t.text).filter((c) => c.ch === '/');
	if (!t.text.trim()) throw new FracError(`Controlla i segni: tra due segni manca un termine. Scrivi per esempio ${EXAMPLE}.`);
	if (slashes.length > 1) throw new FracError(`In un termine c'è più di una linea di frazione: metti il denominatore tra parentesi, per esempio ${EXAMPLE}.`);
	if (!slashes.length) {
		const r = parsePolynomial(t.text, EXAMPLE);
		if (!r.ok) throw new FracError(reword(r.error));
		return { neg: t.neg, N: r.p, D: [ONE], nNode: r.node, dNode: null };
	}
	const i = slashes[0].i;
	const a = t.text.slice(0, i);
	const b = t.text.slice(i + 1);
	if (!a.trim() || !b.trim()) throw new FracError(`Scrivi il numeratore prima della linea di frazione e il denominatore dopo: ${EXAMPLE}.`);
	if (topLevel(b).some((c) => '*:·×'.includes(c.ch))) throw new FracError('Metti il denominatore tra parentesi, per esempio 3/(2(x - 1)).');
	const rn = parsePolynomial(a, EXAMPLE);
	if (!rn.ok) throw new FracError(reword(rn.error));
	const rd = parsePolynomial(b, EXAMPLE);
	if (!rd.ok) throw new FracError(reword(rd.error));
	if (polyDegree(rd.p) < 0) throw new FracError('Un denominatore vale zero: una frazione con denominatore zero non ha significato.');
	return { neg: t.neg, N: rn.p, D: rd.p, nNode: rn.node, dNode: rd.node };
}

function termLatex(t: Term, first: boolean): string {
	let body = t.dNode ? `\\dfrac{${nodeLatex(unwrap(t.nNode))}}{${nodeLatex(unwrap(t.dNode))}}` : nodeLatex(t.nNode);
	if (!first && body.startsWith('-')) body = `(${body})`;
	return first ? `${t.neg ? '-' : ''}${body}` : `${t.neg ? ' - ' : ' + '}${body}`;
}

const sideLatex = (ts: Term[]) => ts.map((t, i) => termLatex(t, i === 0)).join('');

export function parseFratta(input: string): ParsedFrac {
	const text = input.replace(/[−–]/g, '-').trim();
	if (!text) return { ok: false, error: `Scrivi un'equazione con la x al denominatore, per esempio ${EXAMPLE}.` };
	if (text.length > MAX_LENGTH) return { ok: false, error: `L'equazione è troppo lunga: al massimo ${MAX_LENGTH} caratteri.` };
	if (/[<>≤≥|]/.test(text)) return { ok: false, error: `Qui si risolvono equazioni: scrivi un solo segno =, per esempio ${EXAMPLE}.` };
	const eqs = text.split('=').length - 1;
	if (eqs === 0) return { ok: false, error: `Manca il segno =: scrivi un'equazione, per esempio ${EXAMPLE}.` };
	if (eqs > 1) return { ok: false, error: `C'è più di un segno =: scrivi un solo =, per esempio ${EXAMPLE}.` };
	const [l, r] = text.split('=');
	if (!l.trim() || !r.trim()) return { ok: false, error: `Scrivi qualcosa prima e dopo il segno =, per esempio ${EXAMPLE}.` };
	try {
		const left = splitTerms(l).map(parseTerm);
		const right = splitTerms(r).map(parseTerm);
		if (left.length + right.length > MAX_TERMS) return { ok: false, error: `Ci sono troppi termini: al massimo ${MAX_TERMS}.` };
		return { ok: true, left, right, latex: `${sideLatex(left)} = ${sideLatex(right)}` };
	} catch (e) {
		if (e instanceof FracError) return { ok: false, error: e.message };
		return { ok: false, error: TOO_BIG };
	}
}

/** The LaTeX of what has been typed, for the preview, or null. */
export function previewFratta(input: string): string | null {
	const r = parseFratta(input);
	return r.ok ? r.latex : null;
}

const TOO_BIG = 'I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.';

// ---------------------------------------------------------------------------
// Conditions of existence

/** The distinct factors of some denominators, each with its highest exponent: the lcm, without its number. */
export function commonFactors(list: Factored[]): Factor[] {
	const out: Factor[] = [];
	for (const F of list)
		for (const f of F.factors) {
			const same = out.find((g) => polyEq(g.p, f.p));
			if (!same) out.push({ ...f });
			else same.m = Math.max(same.m, f.m);
		}
	// x first, as in x(x - 2).
	return out.sort((a, b) => terms(a.p) - terms(b.p));
}

/** The line of a condition: "x - 2 \neq 0 \;\Rightarrow\; x \neq 2", or the factor that is never zero. */
export function conditionLine(f: Factor, rel = '\\neq'): string {
	const body = polyToLatex(f.p);
	if (!f.roots.length) return `${body} ${rel} 0 \\;\\text{ per ogni } x`;
	if (body === 'x') return 'x \\neq 0';
	const xs = f.roots.map((r) => `x \\neq ${r.toLatex()}`).join(' \\;\\text{ e }\\; ');
	return `${body} \\neq 0 \\;\\Rightarrow\\; ${xs}`;
}

/** The excluded values, in increasing order. */
export const excludedOf = (factors: Factor[]): Num[] => sortNums(factors.flatMap((f) => f.roots));

/** "$x \neq 0$ e $x \neq 2$", for a result row. */
export function conditionsWords(ex: Num[]): string {
	if (!ex.length) return 'Nessuna: i denominatori non si annullano mai';
	return ex.map((r) => `$x \\neq ${r.toLatex()}$`).join(' e ');
}

// ---------------------------------------------------------------------------
// Solving

type Part = 'ce' | 'mcm' | 'intera' | 'soluzioni';
const PART_NAMES: Record<Part, string> = { ce: 'Le condizioni di esistenza', mcm: 'Il denominatore comune', intera: "L'equazione intera", soluzioni: 'Le soluzioni' };
type PartStep = Step & { part: Part };
const GROUP_OVER = 5;

function grouped(steps: PartStep[]): Step[] {
	const on = steps.length > GROUP_OVER;
	return steps.map(({ part, ...step }, i) => (on && (i === 0 || steps[i - 1].part !== part) ? { group: PART_NAMES[part], ...step } : step));
}

/** A rational as text for the equation parser: "3", "(-2/3)". */
const ratText = (r: Rational) => (r.isInteger() ? `${r.num}` : `(${r.num}/${r.den})`);

/** A factor as text for the equation parser: "x", "(x - 2)", "(x - 1)^2". */
function factorText(f: Factor): string {
	const body = polyText(f.p);
	const b = terms(f.p) > 1 ? `(${body})` : body;
	return f.m === 1 ? b : terms(f.p) > 1 ? `${b}^${f.m}` : `${body}^${f.m}`;
}

/** Joins the factors of a product, as the equation parser reads it: juxtaposed before a bracket or an x. */
function joinProduct(parts: string[]): string {
	return parts.reduce((acc, p) => (!acc ? p : p.startsWith('(') || (p.startsWith('x') && /[\d)]$/.test(acc)) ? `${acc}${p}` : `${acc}*${p}`), '');
}

interface Piece {
	neg: boolean;
	/** Text for the equation parser, without its sign. */
	text: string;
	/** A sum on its own, which gets brackets beside other pieces. */
	sum: boolean;
	value: Poly;
}

/**
 * One term times the lcm, simplified: its numerator times the factors missing from its denominator. The number in
 * front goes into a monomial numerator (2 · 3x → 6x); a numerator with more terms keeps its brackets: 5(x − 2).
 */
function piece(t: Term, Mc: number, M: Factor[]): Piece {
	const F = factorLow(t.D);
	const k = q(Mc).div(F.c);
	const missing: Factor[] = [];
	for (const g of M) {
		const own = F.factors.find((f) => polyEq(f.p, g.p));
		const m = g.m - (own ? own.m : 0);
		if (m > 0) missing.push({ ...g, m });
	}
	// The single-term factors (x) before the others, as in x(x + 2).
	missing.sort((a, b) => terms(a.p) - terms(b.p));
	let neg = t.neg;
	const value = polyScale(polyMul(t.N, productOf(missing)), t.neg ? k.neg() : k);
	// The front: a number or a monomial with k in it (2 · 3x → 6x), or k and a numerator with more terms.
	const front: string[] = [];
	let body: Poly | null = null;
	if (terms(t.N) <= 1) {
		// The single-term missing factors (x, x²) go into the monomial too: x · x → x².
		const into = missing.filter((f) => terms(f.p) === 1);
		missing.splice(0, into.length);
		const N = polyMul(polyScale(t.N, k), productOf(into));
		if (lead(N).sign() < 0) neg = !neg;
		const abs = polyScale(N, lead(N).sign() < 0 ? q(-1) : ONE);
		if (!(missing.length && polyDegree(abs) === 0 && abs[0].isOne())) front.push(polyText(abs));
	} else {
		if (k.sign() < 0) neg = !neg;
		if (!k.abs().isOne()) front.push(ratText(k.abs()));
		body = t.N;
	}
	// A lone sum, a numerator or a single missing factor: written without brackets, which the side adds if needed.
	if (!front.length && body && !missing.length) return { neg, text: polyText(body), sum: true, value };
	if (!front.length && !body && missing.length === 1 && missing[0].m === 1 && terms(missing[0].p) > 1) return { neg, text: polyText(missing[0].p), sum: true, value };
	const parts = [...front, ...(body ? [`(${polyText(body)})`] : []), ...missing.map(factorText)];
	return { neg, text: joinProduct(parts) || '1', sum: false, value };
}

function sideText(pieces: Piece[]): string {
	const nz = pieces.filter((p) => polyDegree(p.value) >= 0);
	if (!nz.length) return '0';
	return nz
		.map((p, i) => {
			const body = p.sum && (nz.length > 1 || p.neg) ? `(${p.text})` : p.text;
			return i === 0 ? `${p.neg ? '-' : ''}${body}` : `${p.neg ? ' - ' : ' + '}${body}`;
		})
		.join('');
}

export interface FracSolution {
	/** The values excluded by the C.E. */
	excluded: Num[];
	/** The solutions of the integer equation, each accepted or not. */
	candidates: { x: Num; ok: boolean }[];
	/** 'indeterminata' when the integer equation is true for every x. */
	kind: 'determinata' | 'impossibile' | 'indeterminata';
}

export interface FracResult {
	outcome: Outcome;
	solution: FracSolution | null;
}

export function equazioneFratta(input: string): Outcome {
	return risolviEquazioneFratta(input).outcome;
}

export function risolviEquazioneFratta(input: string): FracResult {
	const parsed = parseFratta(input);
	if (!parsed.ok) return { outcome: fail(parsed.error), solution: null };
	try {
		return solve(parsed.left, parsed.right, parsed.latex);
	} catch {
		return { outcome: fail(TOO_BIG), solution: null };
	}
}

function solve(left: Term[], right: Term[], latex: string): FracResult {
	const all = [...left, ...right];
	for (const t of all) {
		if (polyDegree(t.N) > MAX_DEGREE) return { outcome: fail(`Un numeratore ha grado ${polyDegree(t.N)}: qui numeratori e denominatori hanno al massimo grado 2.`), solution: null };
		if (polyDegree(t.D) > MAX_DEGREE) return { outcome: fail(`Un denominatore ha grado ${polyDegree(t.D)}: qui numeratori e denominatori hanno al massimo grado 2.`), solution: null };
	}
	if (all.every((t) => polyDegree(t.D) < 1))
		return { outcome: fail("La x non compare in nessun denominatore: è un'equazione intera. Risolvila con il calcolatore delle equazioni di primo o di secondo grado."), solution: null };

	const steps: PartStep[] = [];

	// The denominators in factors, and the conditions of existence.
	const dens: Poly[] = [];
	const typed: string[] = [];
	for (const t of all)
		if (t.dNode && polyDegree(t.D) >= 1 && !dens.some((d) => polyEq(d, t.D))) {
			dens.push(t.D);
			typed.push(nodeLatex(unwrap(t.dNode)));
		}
	const factored = dens.map(factorLow);
	const rowsTable = dens.map((_, i) => [`$${typed[i]}$`, `$${factoredLatex(factored[i])}$`]).filter(([a, b]) => !sameLatex(a, b));
	const opposite = factored.some((F) => F.c.sign() < 0);
	if (rowsTable.length)
		steps.push({
			say: 'Scomponi in fattori i denominatori con la $x$.',
			table: { head: ['Denominatore', 'In fattori'], rows: rowsTable },
			then: opposite ? 'Un denominatore con la $x$ negativa si scrive con il segno meno davanti: $1 - x = -(x - 1)$.' : undefined,
			part: 'ce'
		});
	const common = commonFactors(factored);
	const excluded = excludedOf(common);
	steps.push({
		say: 'Poni diverso da zero ogni fattore con la $x$.',
		math: common.map((f) => conditionLine({ ...f, m: 1 })),
		then: excluded.length ? `Sono le condizioni di esistenza (C.E.): ${conditionsWords(excluded)}.` : 'Nessun denominatore si annulla: non ci sono valori da escludere.',
		part: 'ce'
	});

	// The lcm, the two sides over it, the integer equation.
	const numbers = all.map((t) => factorLow(t.D).c.num);
	const Mc = numbers.reduce((acc, n) => lcm(acc, Math.abs(n)), 1);
	const Mlatex = factoredLatex({ c: q(Mc), factors: common });
	steps.push({
		say: 'Calcola il mcm dei denominatori.',
		math: [`\\text{mcm} = \\hl{${Mlatex}}`],
		then: 'Prendi ogni fattore una volta sola, con l’esponente più alto.',
		part: 'mcm'
	});
	const L = left.map((t) => piece(t, Mc, common));
	const R = right.map((t) => piece(t, Mc, common));
	const lText = sideText(L);
	const rText = sideText(R);
	const lp = parsePolynomial(lText);
	const rp = parsePolynomial(rText);
	if (!lp.ok || !rp.ok) return { outcome: fail(TOO_BIG), solution: null };
	const frac = (s: string, hasFrac: boolean) => (hasFrac ? `\\dfrac{${s}}{${Mlatex}}` : s);
	const denomLatex = `${frac(lp.latex, true)} = ${frac(rp.latex, !(rText === '0'))}`;
	if (!sameLatex(latex, denomLatex))
		steps.push({
			say: 'Scrivi i due membri con il mcm come denominatore.',
			math: [latex, denomLatex],
			then: 'Ogni numeratore si moltiplica per i fattori che mancano al suo denominatore.',
			part: 'mcm'
		});
	const integerLatex = `${lp.latex} = ${rp.latex}`;
	steps.push({
		say: 'Elimina il denominatore comune.',
		math: [integerLatex],
		then: excluded.length ? 'Per le C.E. il denominatore non è zero: moltiplicare per il mcm si può.' : 'Il denominatore non è mai zero: moltiplicare per il mcm si può.',
		part: 'mcm'
	});

	// Sanity: the pieces add up to the lcm times each side.
	const P = trim(polySub(lp.p, rp.p));
	const expectL = L.reduce<Poly>((acc, p) => polyAdd(acc, p.value), [ZERO]);
	const expectR = R.reduce<Poly>((acc, p) => polyAdd(acc, p.value), [ZERO]);
	if (!polyEq(polySub(expectL, expectR), P)) return { outcome: fail(TOO_BIG), solution: null };
	const deg = polyDegree(P);
	if (deg > 2) return { outcome: fail(`Tolti i denominatori resta un'equazione di grado ${deg}: qui si risolvono solo quelle che diventano di primo o di secondo grado.`), solution: null };

	// The integer equation, with the equation tools.
	let kind: FracSolution['kind'] = 'determinata';
	let roots: Num[] = [];
	const sub = parseEquation(`${lText} = ${rText}`);
	if (sub.ok) {
		const out = deg === 2 ? equazioneSecondoGrado({ mode: 'eq', eq: `${lText} = ${rText}` }) : equazionePrimoGrado(`${lText} = ${rText}`);
		if (!out.ok) return { outcome: fail(TOO_BIG), solution: null };
		out.steps.forEach((s, i) => {
			if (s.say.startsWith('Controlla')) return;
			const { group: _g, ...rest } = s;
			void _g;
			const math = i === 0 && rest.math?.length && sameLatex(rest.math[0], integerLatex) ? rest.math.slice(1) : rest.math;
			steps.push({ ...rest, math: math?.length ? math : undefined, part: 'intera' });
		});
	} else {
		steps.push({
			say: "Guarda l'uguaglianza che resta.",
			then: deg < 0 ? 'È vera qualunque sia $x$.' : "Non c'è la $x$ ed è falsa: nessun numero la rende vera.",
			part: 'intera'
		});
	}
	if (deg < 0) kind = 'indeterminata';
	else if (deg === 0) kind = 'impossibile';
	else if (deg === 1) roots = [num(P[0].neg().div(P[1]))];
	else roots = quadraticRoots(P);

	const candidates = roots.map((x) => ({ x, ok: !excluded.some((e) => e.equals(x)) }));
	const accepted = candidates.filter((c) => c.ok).map((c) => c.x);
	const setOf = (xs: Num[]) => (xs.length ? `\\left\\{ ${xs.map((x) => x.toLatex()).join(',\\ ')} \\right\\}` : '\\emptyset');

	let S: string;
	if (kind === 'indeterminata') {
		S = excluded.length ? `\\mathbb{R} \\setminus ${setOf(excluded)}` : '\\mathbb{R}';
		steps.push({
			say: 'Togli i valori esclusi dalle C.E.',
			math: [`S = ${S}`],
			then: excluded.length ? 'Ogni numero risolve l’equazione intera, ma quelli esclusi dalle C.E. non vanno bene.' : 'Ogni numero è una soluzione.',
			part: 'soluzioni'
		});
	} else if (kind === 'impossibile' || !roots.length) {
		S = '\\emptyset';
		steps.push({ say: "Scrivi l'insieme delle soluzioni.", math: ['S = \\emptyset'], then: "L'equazione intera non ha soluzioni: nemmeno la fratta ne ha.", part: 'soluzioni' });
	} else {
		S = setOf(accepted);
		const name = (i: number) => (candidates.length > 1 ? `x_${i + 1}` : 'x');
		steps.push({
			say: 'Confronta le soluzioni con le C.E.',
			table: {
				head: ['Soluzione', 'Con le C.E.'],
				rows: candidates.map((c, i) => (c.ok ? [`$${name(i)} = ${c.x.toLatex()}$`, 'Accettabile'] : [`$\\hl{${name(i)} = ${c.x.toLatex()}}$`, 'Non accettabile: annulla un denominatore']))
			},
			then: accepted.length
				? `${accepted.length < candidates.length ? 'La soluzione non accettabile si scarta. ' : ''}L'insieme delle soluzioni è $S = ${S}$.`
				: "Nessuna soluzione è accettabile: l'equazione è impossibile, $S = \\emptyset$.",
			part: 'soluzioni'
		});
	}

	const rows: ResultRow[] = [{ label: 'Condizioni di esistenza', value: conditionsWords(excluded) }];
	let copy: string;
	if (kind === 'indeterminata') {
		rows.push({ label: 'Soluzioni', value: excluded.length ? 'Tutti i numeri reali tranne quelli esclusi dalle C.E.' : 'Tutti i numeri reali' });
		copy = excluded.length ? `Ogni numero reale tranne ${excluded.map(numText).join(' e ')}` : 'Ogni numero reale';
	} else if (!accepted.length) {
		rows.push({ label: 'Soluzioni', value: roots.length ? "Nessuna: l'unica soluzione trovata non è accettabile" : "Nessuna: l'equazione è impossibile" });
		if (roots.length > 1) rows[1].value = 'Nessuna: le soluzioni trovate non sono accettabili';
		copy = 'Nessuna soluzione';
	} else {
		accepted.forEach((x, i) => {
			const label = accepted.length === 1 ? 'Soluzione' : i === 0 ? 'Prima soluzione' : 'Seconda soluzione';
			rows.push({ label, value: x.isRational() ? `$x = ${x.toLatex()}$` : `$x = ${x.toLatex()}$ $\\approx ${approxTex(x)}$` });
		});
		copy = accepted.map((x) => `x = ${numText(x).replace(/−/g, '-')}`).join('; ');
	}
	const rejected = candidates.filter((c) => !c.ok);
	if (rejected.length) rows.push({ label: rejected.length === 1 ? 'Soluzione non accettabile' : 'Soluzioni non accettabili', value: rejected.map((c) => `$x = ${c.x.toLatex()}$`).join(' e ') });
	rows.push({ label: 'Insieme delle soluzioni', value: `$S = ${S}$` });
	return { outcome: { ok: true, rows, copy, steps: grouped(steps) }, solution: { excluded, candidates, kind } };
}
