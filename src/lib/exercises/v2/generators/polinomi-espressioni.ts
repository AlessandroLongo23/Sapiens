/**
 * Espressioni con polinomi. Spec: specs/exercises/polinomi-espressioni.md
 *
 * Seven levels in the order of lesson 31, each adding one difficulty: products and a sum with no
 * notable product; notable products in standard form with a minus or a number in front; two
 * letters or higher-degree monomials; fractional coefficients; the cube of a binomial and a power
 * inside a product; a notable product to recognise (terms out of order, opposite factors, three
 * factors, a binomial in place of a term); round, square and curly brackets with a division by a
 * monomial and the square of a trinomial.
 *
 * The expression is a tree built from the parts the lesson uses (binomials, their powers and
 * products); its value is a polynomial, a list of monomials, ordered by decreasing powers of the
 * first letter (then of the second). The answer is that polynomial, expanded and ordered.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import {
	type Mono,
	type Opt,
	buildChoice,
	div,
	factorLatex,
	forbidden,
	literalKey,
	monoFromJSON,
	monoJSON,
	monoKey,
	monoLatex,
	mono,
	mul,
	neg,
	nonZero,
	polySympy,
	shuffle,
	sumLatex,
	wrap,
} from '../monomi';

export const ID = 'polinomi-espressioni';

// ---------------------------------------------------------------------------
// Polynomials as lists of monomials

type P = Mono[];

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

/** Decreasing powers of the first letter, then of the second, ...; the constant last. */
function cmpMono(a: Mono, b: Mono): number {
	for (const v of ALPHABET) {
		const d = (b.e[v] ?? 0) - (a.e[v] ?? 0);
		if (d !== 0) return d;
	}
	return 0;
}

/**
 * Sum of similar terms. Not the shared collect(): there a pair of terms that cancels leaves the
 * zero monomial, which has no letters, and a later constant is merged into it (so 1/9 and 9
 * stay apart).
 */
function collectP(p: P): P {
	const acc = new Map<string, Mono>();
	for (const t of p) {
		if (t.c.isZero()) continue;
		const k = literalKey(t.e);
		const o = acc.get(k);
		acc.set(k, o ? mono(o.c.add(t.c), { ...t.e }) : t);
	}
	return [...acc.values()].filter((t) => !t.c.isZero());
}

const sortP = (p: P): P => collectP(p).sort(cmpMono);
const padd = (...ps: P[]): P => sortP(ps.flat());
const pneg = (p: P): P => p.map(neg);
const rawMul = (a: P, b: P): Mono[] => a.flatMap((x) => b.map((y) => mul(x, y)));
const pmul = (a: P, b: P): P => sortP(rawMul(a, b));
const ONE_P: P = [mono(1)];

function ppow(a: P, n: number): P {
	let r = ONE_P;
	for (let i = 0; i < n; i++) r = pmul(r, a);
	return r;
}

function pdiv(a: P, d: Mono): P | null {
	const out: Mono[] = [];
	for (const t of a) {
		const r = div(t, d);
		if (!r) return null;
		out.push(r);
	}
	return sortP(out);
}

const pKey = (p: P): string => sortP(p).map(monoKey).join('+') || '0';
const pl = (p: P): string => (p.length === 0 ? '0' : sumLatex(sortP(p)));
const absM = (m: Mono): Mono => mono(m.c.abs(), { ...m.e });
const hasLetters = (m: Mono): boolean => Object.keys(m.e).length > 0;

/** A polynomial between round brackets, with \left( \right) when it has a fraction. */
const paren = (s: string): string => (s.includes('\\frac') ? `\\left(${s}\\right)` : `(${s})`);

// ---------------------------------------------------------------------------
// Expression tree

/** A recognised notable product (level 6), with what the steps and the mistakes need. */
interface Trap {
	kind: 'disordine' | 'segni' | 'opposti' | 'tre' | 'blocco';
	/** disordine: the term with the same sign; blocco: the block a. */
	a?: Mono[];
	/** disordine: the term with opposite signs; blocco: the block b. */
	b?: Mono[];
	/** tre: indices of the two factors that give a sum times a difference. */
	pair?: number[];
	/** blocco: 1 for (a + b)(a - b) with a binomial a, 2 for a binomial b. */
	variant?: number;
}

interface Br {
	t: 'br';
	/** In the order in which they are written. */
	terms: Mono[];
}
interface Pw {
	t: 'pow';
	base: Br;
	n: number;
	trap?: Trap;
}
interface Prod {
	t: 'prod';
	/** Positive monomial written in front, or null. */
	coef: Mono | null;
	factors: (Br | Pw)[];
	trap?: Trap;
}
interface Dv {
	t: 'div';
	num: Br;
	d: Mono;
}
interface Leaf {
	t: 'm';
	m: Mono;
}
interface Grp {
	t: 'grp';
	inner: Sum;
}
interface Term {
	neg: boolean;
	n: Leaf | Prod | Pw | Dv | Grp;
}
interface Sum {
	t: 'sum';
	terms: Term[];
}
interface Dot {
	t: 'dot';
	left: Grp;
	m: Mono;
}
type Node = Br | Pw | Prod | Dv | Leaf | Grp | Sum | Dot;

const br = (...terms: Mono[]): Br => ({ t: 'br', terms });
const pw = (base: Br, n: number, trap?: Trap): Pw => (trap ? { t: 'pow', base, n, trap } : { t: 'pow', base, n });
const prod = (coef: Mono | null, factors: (Br | Pw)[], trap?: Trap): Prod => {
	const c = coef && coef.c.isOne() && !hasLetters(coef) ? null : coef;
	return trap ? { t: 'prod', coef: c, factors, trap } : { t: 'prod', coef: c, factors };
};
const T = (n: Term['n'], isNeg = false): Term => ({ neg: isNeg, n });
const S = (...terms: Term[]): Sum => ({ t: 'sum', terms });
const G = (inner: Sum): Grp => ({ t: 'grp', inner });
const leaf = (m: Mono): Leaf => ({ t: 'm', m });

/** (f1)(f2) with f1 = s + o and f2 = s - o, the same term first: a sum times a difference. */
function isStdSD(f: (Br | Pw)[]): boolean {
	if (f.length !== 2 || f[0].t !== 'br' || f[1].t !== 'br') return false;
	const [a, b] = [f[0].terms, f[1].terms];
	return a.length === 2 && b.length === 2 && monoKey(a[0]) === monoKey(b[0]) && monoKey(a[1]) === monoKey(neg(b[1]));
}

// ---------------------------------------------------------------------------
// Evaluation, with the students' mistakes as variants

type Mistake = 'none' | 'minusfirst' | 'mulfirst' | 'nodouble' | 'powcoef' | 'halfdouble' | 'trisign' | 'firstlast' | 'trapneg' | 'divfirst';

/** Power of a bracket written as a list of terms; squares and cubes with the lesson's mistakes. */
function powBr(terms: Mono[], n: number, mk: Mistake): P {
	if (n === 2) {
		const sq = terms.map((t) => (mk === 'powcoef' && hasLetters(t) ? mono(t.c.abs(), Object.fromEntries(Object.entries(t.e).map(([v, k]) => [v, 2 * k]))) : mul(t, t)));
		if (mk === 'nodouble') return sortP(sq);
		const dbl: Mono[] = [];
		for (let i = 0; i < terms.length; i++)
			for (let j = i + 1; j < terms.length; j++) {
				let p = mul(terms[i], terms[j]);
				if (mk === 'trisign') p = absM(p);
				dbl.push(mk === 'halfdouble' ? p : mul(mono(2), p));
			}
		return sortP([...sq, ...dbl]);
	}
	if (n === 3 && terms.length === 2 && mk === 'nodouble') return sortP(terms.map((t) => mul(mul(t, t), t)));
	return ppow(terms, n);
}

function ev(n: Node, mk: Mistake = 'none'): P {
	switch (n.t) {
		case 'm':
			return [n.m];
		case 'br':
			return sortP(n.terms);
		case 'pow':
			if (mk === 'trapneg' && n.trap) return pneg(ev(n));
			return powBr(n.base.terms, n.n, mk);
		case 'prod': {
			if (mk === 'trapneg' && n.trap) return pneg(ev(n));
			if (mk === 'nodouble' && n.trap?.kind === 'blocco') return padd(powBr(n.trap.a!, 2, mk), pneg(powBr(n.trap.b!, 2, mk)));
			const f = n.factors;
			if (mk === 'mulfirst' && n.coef && f.length === 1 && f[0].t === 'pow') return powBr(pmul([n.coef], f[0].base.terms), f[0].n, 'none');
			if (mk === 'firstlast' && !n.coef && f.length === 2 && f[0].t === 'br' && f[1].t === 'br' && f[0].terms.length === 2 && f[1].terms.length === 2 && !isStdSD(f)) {
				const [a, b] = [f[0].terms, f[1].terms];
				return sortP([mul(a[0], b[0]), mul(a[1], b[1])]);
			}
			let acc: P = n.coef ? [n.coef] : ONE_P;
			for (const x of f) acc = pmul(acc, ev(x, mk));
			return acc;
		}
		case 'div': {
			if (mk === 'divfirst') {
				const first = div(n.num.terms[0], n.d);
				return first ? sortP([first, ...n.num.terms.slice(1)]) : pdiv(n.num.terms, n.d) ?? [];
			}
			const r = pdiv(n.num.terms, n.d);
			if (!r) throw new Error(`${ID}: division that does not give a polynomial`);
			return r;
		}
		case 'grp':
			return ev(n.inner, mk);
		case 'sum': {
			const parts: P[] = n.terms.map((t) => {
				const v = sortP(ev(t.n, mk));
				if (!t.neg) return v;
				// "-(x^2 - 4)" written "-x^2 - 4": the minus reaches only the first term
				if (mk === 'minusfirst' && t.n.t !== 'm' && v.length > 1) return [neg(v[0]), ...v.slice(1)];
				return pneg(v);
			});
			return padd(...parts);
		}
		case 'dot':
			return pmul(ev(n.left, mk), [n.m]);
	}
}

// ---------------------------------------------------------------------------
// LaTeX

interface Out {
	s: string;
	lvl: number;
}

const OPEN = ['', '\\left(', '\\left[', '\\left\\{'];
const CLOSE = ['', '\\right)', '\\right]', '\\right\\}'];

function render(n: Node): Out {
	switch (n.t) {
		case 'm':
			return { s: monoLatex(n.m), lvl: 0 };
		case 'br':
			return { s: paren(sumLatex(n.terms)), lvl: 1 };
		case 'pow':
			return { s: `${render(n.base).s}^${n.n}`, lvl: 1 };
		case 'prod':
			return { s: (n.coef ? monoLatex(n.coef) : '') + n.factors.map((f) => render(f).s).join(''), lvl: 1 };
		case 'div':
			return { s: `${render(n.num).s} : ${wrap(monoLatex(n.d))}`, lvl: 1 };
		case 'dot': {
			const l = render(n.left);
			const f = factorLatex(n.m);
			return { s: `${l.s} \\cdot ${f}`, lvl: Math.max(l.lvl, f.startsWith('(') || f.startsWith('\\left(') ? 1 : 0) };
		}
		case 'sum': {
			let lvl = 0;
			const s = n.terms
				.map((t, i) => {
					let sign = t.neg ? -1 : 1;
					let body: string;
					if (t.n.t === 'm') {
						if (t.n.m.c.sign() < 0) sign = -sign;
						body = monoLatex(absM(t.n.m));
					} else {
						const o = render(t.n);
						lvl = Math.max(lvl, o.lvl);
						body = o.s;
					}
					if (i === 0) return (sign < 0 ? '-' : '') + body;
					return (sign < 0 ? ' - ' : ' + ') + body;
				})
				.join('');
			return { s, lvl };
		}
		case 'grp': {
			const inner = render(n.inner);
			const lvl = inner.lvl + 1;
			if (lvl > 3) throw new Error(`${ID}: brackets nested too deep`);
			return { s: `${OPEN[lvl]}${inner.s}${CLOSE[lvl]}`, lvl };
		}
	}
}

/**
 * Visible width of a formula, in characters, as the spec defines it: \left and \right and spaces
 * do not count, a fraction counts as its longer line, \cdot and each bracket count one.
 */
export function visibleWidth(latex: string): number {
	let s = latex.replace(/\\left|\\right/g, '');
	s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, a: string, b: string) => '#'.repeat(Math.max(a.length, b.length)));
	s = s.replace(/\\cdot/g, '*').replace(/\\\{/g, '{').replace(/\\\}/g, '}');
	s = s.replace(/\^\{([^{}]*)\}/g, '$1').replace(/\^/g, '');
	return s.replace(/\s/g, '').length;
}

// ---------------------------------------------------------------------------
// Steps

// ---------------------------------------------------------------------------
// Lines for the phone

/**
 * Estimated width in character units, for the phone: the visible width plus 0.6 for each fraction
 * (a fraction and its \left( \right) are wider than their digits). One unit is about 12 px of
 * KaTeX at 18 px; the column on a phone is 350 px.
 */
export function estWidth(latex: string): number {
	return visibleWidth(latex) + 0.6 * (latex.match(/\\frac/g) ?? []).length;
}

/** A problem wider than this goes on several lines; each line stays within it (a continuation line, after its \quad, within LINE - 2). */
export const LINE = 26;

const PLAIN_OPEN = ['', '(', '[', '\\{'];
const PLAIN_CLOSE = ['', ')', ']', '\\}'];

interface Piece {
	s: string;
	/** The line may break before this piece: it starts with a + or a - between terms. */
	brk: boolean;
}

/** The expression cut where a line may break: before the + and - between terms, also inside square and curly brackets, which are then written without \left \right. */
function pieces(n: Node): Piece[] {
	switch (n.t) {
		case 'sum': {
			const out: Piece[] = [];
			n.terms.forEach((t, i) => {
				let sign = t.neg ? -1 : 1;
				let ps: Piece[];
				if (t.n.t === 'm') {
					if (t.n.m.c.sign() < 0) sign = -sign;
					ps = [{ s: monoLatex(absM(t.n.m)), brk: false }];
				} else ps = pieces(t.n);
				const pre = i === 0 ? (sign < 0 ? '-' : '') : sign < 0 ? ' - ' : ' + ';
				ps[0] = { s: pre + ps[0].s, brk: i > 0 };
				out.push(...ps);
			});
			return out;
		}
		case 'grp': {
			const lvl = render(n).lvl;
			if (lvl < 2) return [{ s: render(n).s, brk: false }];
			const ps = pieces(n.inner);
			ps[0] = { ...ps[0], s: PLAIN_OPEN[lvl] + ps[0].s };
			ps[ps.length - 1] = { ...ps[ps.length - 1], s: ps[ps.length - 1].s + PLAIN_CLOSE[lvl] };
			return ps;
		}
		case 'dot': {
			const ps = pieces(n.left);
			ps[ps.length - 1] = { ...ps[ps.length - 1], s: `${ps[ps.length - 1].s} \\cdot ${factorLatex(n.m)}` };
			return ps;
		}
		default:
			return [{ s: render(n).s, brk: false }];
	}
}

/** The problem as the student sees it: one line if it fits, otherwise an aligned block, a new line before a + or a -. */
function problemLatex(root: Node): string {
	const one = render(root).s;
	if (estWidth(one) <= LINE) return one;
	const lines: string[] = [];
	let cur = '';
	for (const p of pieces(root)) {
		const limit = lines.length === 0 ? LINE : LINE - 2;
		if (cur && p.brk && estWidth(cur + p.s) > limit) {
			lines.push(cur);
			cur = p.s.trimStart();
		} else cur += p.s;
	}
	lines.push(cur);
	return `\\begin{aligned}&${lines.join('\\\\&\\quad ')}\\end{aligned}`;
}

/** The lines of an option written as a gathered block (one line if it is not). */
function optionLines(latex: string): string[] {
	const m = /^\\begin\{gathered\}(.*)\\end\{gathered\}$/.exec(latex);
	return m ? m[1].split(' \\\\ ') : [latex];
}

/** The lines of a problem written as an aligned block (one line if it is not). */
function problemLines(latex: string): string[] {
	const m = /^\\begin\{aligned\}&(.*)\\end\{aligned\}$/.exec(latex);
	return m ? m[1].split('\\\\&\\quad ') : [latex];
}

const BRACKET = ['', 'tonda', 'quadra', 'graffa'];

/** m^2 written as the student writes it: x^2, (2x^2)^2, (-y)^2, 3^2. */
function sqLatex(m: Mono): string {
	const s = monoLatex(m);
	if (m.c.isOne() && Object.keys(m.e).length === 1 && Object.values(m.e)[0] === 1) return `${s}^2`;
	if (!hasLetters(m) && m.c.isInteger() && m.c.sign() > 0) return `${s}^2`;
	return `${wrap(s)}^2`;
}

/** (A + B)^2 = A^2 + 2 · A · B + B^2, the middle member for a binomial with a positive first term. */
function binomialMiddle(t: Mono[]): string | null {
	const [A, B] = t;
	if (A.c.sign() < 0) return null;
	const sign = B.c.sign() < 0 ? '-' : '+';
	return `${sqLatex(A)} ${sign} 2 \\cdot ${monoLatex(A)} \\cdot ${monoLatex(absM(B))} + ${sqLatex(absM(B))}`;
}

/** The three squares, then the double products, each with its sign, as in the lesson. */
function trinomialMiddle(t: Mono[]): string {
	const sq = t.map((m) => mul(m, m));
	const dbl: Mono[] = [];
	for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) dbl.push(mul(mono(2), mul(t[i], t[j])));
	return sumLatex([...sq, ...dbl]);
}

function signedJoin(parts: string[]): string {
	return parts.map((s, i) => (i === 0 ? s : s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`)).join('');
}

function chain(members: string[]): string {
	const out: string[] = [];
	for (const m of members) if (out[out.length - 1] !== m) out.push(m);
	return out.join(' = ');
}

interface Ctx {
	label: string;
	level: number;
}

function lab(ctx: Ctx, what: string): string {
	const text = ctx.label ? `${ctx.label}, ${what.charAt(0).toLowerCase()}${what.slice(1)}` : what;
	return `\\text{${text}: } `;
}

function trapSteps(n: Prod | Pw, trap: Trap, out: string[], ctx: Ctx): P {
	const v = ev(n);
	const r = render(n).s;
	switch (trap.kind) {
		case 'disordine': {
			const s = trap.a![0];
			const o = trap.b![0];
			out.push(`\\text{Il termine con lo stesso segno è } ${monoLatex(s)}\\text{, quello con i segni opposti è } ${monoLatex(absM(o))}`);
			out.push(`${lab(ctx, 'Somma per differenza')}${r} = ${sqLatex(s)} - ${sqLatex(absM(o))} = ${pl(v)}`);
			return v;
		}
		case 'segni': {
			const p = n as Pw;
			const canon = canonical(p.base.terms);
			out.push(`${lab(ctx, 'Un binomio e il suo opposto hanno lo stesso quadrato')}${r} = ${paren(sumLatex(canon))}^2 = ${pl(v)}`);
			return v;
		}
		case 'opposti': {
			const f1 = ((n as Prod).factors[0] as Br).terms;
			const sq = ppow(f1, 2);
			out.push(`${lab(ctx, 'Il secondo fattore è l\'opposto del primo')}${r} = -${paren(sumLatex(f1))}^2 = -${paren(pl(sq))} = ${pl(v)}`);
			return v;
		}
		case 'tre': {
			const p = n as Prod;
			const [i, j] = trap.pair!;
			const sd = pmul(ev(p.factors[i]), ev(p.factors[j]));
			const rest = p.factors.filter((_, k) => k !== i && k !== j);
			out.push(`${lab(ctx, 'Prima la coppia che forma una somma per differenza')}${r} = ${paren(pl(sd))}${rest.map((f) => render(f).s).join('')} = ${pl(v)}`);
			return v;
		}
		case 'blocco': {
			const a = trap.a!;
			const b = trap.b!;
			if (trap.variant === 1) {
				out.push(`\\text{Somma per differenza con } a = ${sumLatex(a)} \\text{ e } b = ${monoLatex(absM(b[0]))}`);
				out.push(`${lab(ctx, 'Somma per differenza')}${r} = ${paren(sumLatex(a))}^2 - ${monoLatex(mul(b[0], b[0]))} = ${pl(v)}`);
			} else {
				const bl = paren(sumLatex(b));
				out.push(`${lab(ctx, 'Somma per differenza con un binomio al posto di b')}${r} = [${monoLatex(a[0])} + ${bl}][${monoLatex(a[0])} - ${bl}] = ${sqLatex(a[0])} - ${bl}^2 = ${pl(v)}`);
			}
			return v;
		}
	}
}

/** The binomial or its opposite, whichever has the first term (in the ordering) positive, ordered. */
function canonical(t: Mono[]): Mono[] {
	const u = [...t].sort(cmpMono);
	return u[0].c.sign() < 0 ? u.map(neg) : u;
}

function steps(n: Node, out: string[], ctx: Ctx): P {
	switch (n.t) {
		case 'm':
		case 'br':
			return ev(n);
		case 'pow': {
			if (n.trap) return trapSteps(n, n.trap, out, ctx);
			const v = ev(n);
			const b = n.base.terms;
			const name = n.n === 3 ? 'Cubo del binomio' : b.length === 3 ? 'Quadrato del trinomio' : 'Quadrato del binomio';
			let mid: string | null = null;
			if (n.n === 2 && b.length === 3) mid = trinomialMiddle(b);
			else if (n.n === 2 && b.length === 2 && (ctx.level === 3 || ctx.level === 4)) mid = binomialMiddle(b);
			out.push(`${lab(ctx, name)}${chain([render(n).s, ...(mid ? [mid] : []), pl(v)])}`);
			return v;
		}
		case 'prod': {
			if (n.trap) return trapSteps(n, n.trap, out, ctx);
			const v = ev(n);
			const r = render(n).s;
			const f = n.factors;
			if (!n.coef) {
				if (isStdSD(f)) out.push(`${lab(ctx, 'Somma per differenza')}${r} = ${pl(v)}`);
				else {
					const raw = rawMul(ev(f[0]), ev(f[1]));
					out.push(`${lab(ctx, 'Proprietà distributiva')}${chain([r, sumLatex(raw), pl(v)])}`);
				}
				return v;
			}
			const cl = monoLatex(n.coef);
			if (f.length === 1 && f[0].t === 'br') {
				out.push(`${lab(ctx, 'Prodotto del monomio per il polinomio')}${r} = ${pl(v)}`);
			} else if (f.length === 1 && f[0].t === 'pow') {
				const pv = ev(f[0]);
				out.push(`${lab(ctx, 'Prima la potenza, poi il prodotto')}${r} = ${cl}${paren(pl(pv))} = ${pl(v)}`);
			} else {
				const pv = pmul(ev(f[0]), ev(f[1]));
				const what = isStdSD(f) ? 'Prima la somma per differenza, poi il prodotto' : 'Prima il prodotto dei binomi, poi il resto';
				out.push(`${lab(ctx, what)}${r} = ${cl}${paren(pl(pv))} = ${pl(v)}`);
			}
			return v;
		}
		case 'div': {
			const v = ev(n);
			out.push(`${lab(ctx, 'Divisione per il monomio, termine per termine')}${render(n).s} = ${pl(v)}`);
			return v;
		}
		case 'grp': {
			const lvl = render(n).lvl;
			return steps(n.inner, out, { label: `Nella parentesi ${BRACKET[lvl]}`, level: ctx.level });
		}
		case 'sum': {
			// the brackets first, from the innermost, as in the lesson
			const vals: P[] = [];
			const order = n.terms.map((_, i) => i).sort((i, j) => (n.terms[i].n.t === 'grp' ? 0 : 1) - (n.terms[j].n.t === 'grp' ? 0 : 1));
			for (const i of order) vals[i] = steps(n.terms[i].n, out, ctx);
			const first: string[] = [];
			const flat: Mono[] = [];
			n.terms.forEach((t, i) => {
				const v = vals[i];
				const signed = t.neg ? pneg(v) : v;
				flat.push(...signed);
				if (t.neg && v.length > 1) first.push(`-${paren(pl(v))}`);
				else first.push(pl(signed));
			});
			const v = sortP(flat);
			if (n.terms.length > 1) out.push(`${lab(ctx, 'Si tolgono le parentesi e si sommano i termini simili')}${chain([signedJoin(first), sumLatex(flat), pl(v)])}`);
			return v;
		}
		case 'dot': {
			const lv = steps(n.left, out, ctx);
			const v = ev(n);
			out.push(`${lab(ctx, 'Prodotto per il monomio')}${paren(pl(lv))} \\cdot ${factorLatex(n.m)} = ${pl(v)}`);
			return v;
		}
	}
}

// ---------------------------------------------------------------------------
// Construction

const X = (c: number | Rational, v: string, e = 1): Mono => mono(c, { [v]: e });
const K = (c: number | Rational): Mono => mono(c);
const oneLetter = (rng: Rng): string => rng.pick(['x', 'x', 'x', 'a', 'y']);
const twoLetters = (rng: Rng): [string, string] => rng.pick([['x', 'y'], ['x', 'y'], ['a', 'b']] as [string, string][]);
const pm = (rng: Rng, n: number): number => (rng.next() < 0.5 ? n : -n);
const FRACS = [q(1, 2), q(1, 3), q(2, 3), q(3, 2), q(1, 4), q(3, 4)];

interface Built {
	root: Sum | Dot;
	case: string;
}

/** Signs of the terms after the first: a minus with probability `p`, at least one minus. */
function signs(rng: Rng, n: number, p: number): boolean[] {
	const s = Array.from({ length: n }, (_, i) => i > 0 && rng.next() < p);
	if (n > 1 && !s.some(Boolean)) s[rng.int(1, n - 1)] = true;
	return s;
}

/** A monomial carries its sign in its coefficient; the minus that `signs` promised goes on a bracket. */
function sumOf(items: Term['n'][], negs: boolean[]): Sum {
	const n = negs.map((x, i) => x && items[i].t !== 'm');
	const later = items.map((_, i) => i).filter((i) => i > 0 && items[i].t !== 'm');
	if (later.length > 0 && !later.some((i) => n[i])) n[later[0]] = true;
	return S(...items.map((it, i) => T(it, n[i])));
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1: {
			const v = oneLetter(rng);
			const k = rng.int(1, 5);
			const e = k === 1 ? 1 : rng.pick([0, 1, 1]);
			const mb = prod(X(k, v, e), [br(X(rng.pick([1, 1, 2, 3]), v), K(nonZero(rng, -6, 6)))]);
			const c = rng.pick([1, 1, 1, 2]);
			const p = nonZero(rng, -6, 6);
			const r = nonZero(rng, -6, 6);
			if (c === 1 && Math.abs(p) === Math.abs(r)) return null;
			const f1 = br(X(1, v), K(p));
			const f2 = br(X(c, v), K(r));
			const bb = prod(null, rng.next() < 0.5 ? [f1, f2] : [f2, f1]);
			const items: Term['n'][] = rng.next() < 0.5 ? [mb, bb] : [bb, mb];
			let kind = 'due prodotti';
			if (rng.next() < 0.35) {
				items.push(leaf(mono(nonZero(rng, -9, 9), rng.next() < 0.5 ? {} : { [v]: rng.int(1, 2) })));
				kind = 'due prodotti e un monomio';
			}
			return { root: sumOf(items, signs(rng, items.length, 0.7)), case: kind };
		}
		case 2: {
			const v = oneLetter(rng);
			const sq = (): Pw => pw(br(X(rng.pick([1, 1, 2, 3]), v), K(nonZero(rng, -5, 5))), 2);
			const sd = (): Br[] => {
				const a = rng.pick([1, 1, 2, 3]);
				const b = rng.int(1, 6);
				const [f1, f2] = [br(X(a, v), K(b)), br(X(a, v), K(-b))];
				return rng.next() < 0.5 ? [f1, f2] : [f2, f1];
			};
			const kinds = shuffle(rng, ['sq', 'sd', rng.pick(['sq', 'sd'])]).slice(0, rng.next() < 0.7 ? 3 : 2);
			if (!kinds.includes('sq')) kinds[0] = 'sq';
			const withNumber = rng.next() < 0.5 ? rng.int(0, kinds.length - 1) : -1;
			const items: Term['n'][] = kinds.map((kd, i) => {
				const coef = i === withNumber ? K(rng.pick([2, 3])) : null;
				if (kd === 'sq') return coef ? prod(coef, [sq()]) : sq();
				return prod(coef, sd());
			});
			return { root: sumOf(items, signs(rng, items.length, 0.65)), case: withNumber >= 0 ? 'numero davanti' : 'meno davanti' };
		}
		case 3: {
			const two = rng.next() < 0.75;
			let A: Mono, B: Mono, M: Mono, inner: Br;
			if (two) {
				const [vx, vy] = twoLetters(rng);
				A = X(rng.pick([1, 2, 3]), vx, rng.pick([1, 2]));
				B = X(pm(rng, rng.pick([1, 1, 2, 3])), vy, rng.pick([1, 1, 2]));
				M = mono(rng.int(1, 4), { [vx]: rng.int(1, 2), [vy]: rng.int(0, 1) });
				inner = rng.next() < 0.5 ? br(X(rng.pick([1, 2]), vy), K(nonZero(rng, -3, 3))) : br(X(1, vx), X(pm(rng, rng.pick([1, 2])), vy));
			} else {
				const v = oneLetter(rng);
				A = X(rng.pick([1, 2, 3]), v, rng.pick([2, 3]));
				B = mono(nonZero(rng, -4, 4), rng.next() < 0.5 ? {} : { [v]: 1 });
				M = X(rng.int(1, 4), v, rng.int(1, 2));
				inner = br(X(rng.pick([1, 2]), v, rng.pick([1, 2])), K(nonZero(rng, -3, 3)));
			}
			const Bs = absM(B);
			const sdAB = rng.next() < 0.6 ? [br(A, Bs), br(A, neg(Bs))] : [br(A, neg(Bs)), br(A, Bs)];
			const items: Term['n'][] = [pw(br(A, B), 2)];
			const rest: Term['n'][] = shuffle(rng, [prod(null, sdAB), prod(M, [inner])]);
			items.push(...rest.slice(0, rng.next() < 0.7 ? 2 : 1));
			return { root: sumOf(items, signs(rng, items.length, 0.6)), case: two ? 'due lettere' : 'grado più alto' };
		}
		case 4: {
			const v = oneLetter(rng);
			const fr = () => rng.pick(FRACS);
			const cx = () => rng.pick([...FRACS, q(1), q(2)]);
			const cc = () => rng.pick([...FRACS, q(1), q(2), q(3)]);
			let p = cx();
			let r = cc();
			if (p.isInteger() && r.isInteger()) r = fr();
			const sqT = pw(br(X(p, v), K(pm(rng, 1) > 0 ? r : r.neg())), 2);
			p = cx();
			r = cc();
			if (p.isInteger() && r.isInteger()) p = fr();
			const [f1, f2] = [br(X(p, v), K(r)), br(X(p, v), K(r.neg()))];
			const sdT = prod(null, rng.next() < 0.5 ? [f1, f2] : [f2, f1]);
			const items: Term['n'][] = rng.next() < 0.7 ? [sqT, sdT] : [sdT, sqT];
			const u = rng.next();
			if (u < 0.45) items.push(leaf(mono(pm(rng, 1) > 0 ? fr() : fr().neg(), rng.next() < 0.6 ? { [v]: 1 } : {})));
			else if (u < 0.75) items.push(prod(K(fr()), [br(X(1, v), K(nonZero(rng, -6, 6)))]));
			return { root: sumOf(items, signs(rng, items.length, 0.6)), case: 'frazioni' };
		}
		case 5: {
			const v = oneLetter(rng);
			const cube = rng.next() < 0.8 ? pw(br(X(1, v), K(pm(rng, rng.int(1, 3)))), 3) : pw(br(X(2, v), K(pm(rng, 1))), 3);
			const withLetter = rng.next() < 0.65;
			const coef = withLetter ? X(rng.pick([1, 1, 2]), v) : K(rng.pick([2, 3]));
			const inProd = prod(coef, [pw(br(X(1, v), K(pm(rng, rng.int(1, 4)))), 2)]);
			const items: Term['n'][] = rng.next() < 0.7 ? [cube, inProd] : [inProd, cube];
			const u = rng.next();
			if (u < 0.45) {
				const s = rng.int(1, 4);
				const [f1, f2] = [br(X(1, v), K(s)), br(X(1, v), K(-s))];
				items.push(prod(rng.next() < 0.6 ? K(rng.int(2, 3)) : null, rng.next() < 0.5 ? [f1, f2] : [f2, f1]));
			} else if (u < 0.7) items.push(leaf(mono(nonZero(rng, -9, 9), rng.next() < 0.5 ? {} : { [v]: rng.int(1, 2) })));
			return { root: sumOf(items, signs(rng, items.length, 0.6)), case: withLetter ? 'monomio davanti alla potenza' : 'numero davanti alla potenza' };
		}
		case 6:
			return buildRecognise(rng);
		case 7:
			return buildNested(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

const CASES6 = ['disordine', 'segni', 'opposti', 'tre', 'blocco'] as const;
const CASE6_NAME: Record<(typeof CASES6)[number], string> = {
	disordine: 'somma per differenza in disordine',
	segni: 'quadrato con i segni negativi',
	opposti: 'fattori opposti',
	tre: 'tre fattori',
	blocco: 'binomio al posto di un termine',
};

function buildRecognise(rng: Rng): Built | null {
	const kind = rng.pick(CASES6);
	const two = kind === 'blocco' || (kind !== 'tre' && rng.next() < 0.45);
	const [vx, vy] = two ? twoLetters(rng) : [oneLetter(rng), ''];
	const A = X(rng.pick([1, 1, 2, 3]), vx);
	const B = two ? X(rng.pick([1, 1, 2]), vy) : K(rng.int(1, 5));
	let trapNode: Prod | Pw;
	switch (kind) {
		case 'disordine': {
			const sameIsA = rng.next() < 0.5;
			let s = sameIsA ? A : B;
			const o = sameIsA ? B : A;
			if (rng.next() < 0.35) s = neg(s);
			const order = (t: Mono[]) => (rng.next() < 0.5 ? t : [t[1], t[0]]);
			const g1 = order([s, o]);
			const g2 = order([s, neg(o)]);
			const standard = monoKey(g1[0]) === monoKey(s) && monoKey(g2[0]) === monoKey(s) && s.c.sign() > 0;
			if (standard) return null;
			trapNode = prod(null, rng.next() < 0.5 ? [br(...g1), br(...g2)] : [br(...g2), br(...g1)], { kind, a: [s], b: [o] });
			break;
		}
		case 'segni': {
			const shown = rng.pick([[neg(A), neg(B)], [B, neg(A)], [neg(A), B]]);
			trapNode = pw(br(...shown), 2, { kind });
			break;
		}
		case 'opposti': {
			const f1 = rng.next() < 0.6 ? [A, neg(B)] : [A, B];
			const f2 = rng.next() < 0.6 ? [f1[1], f1[0]].map(neg) : f1.map(neg);
			trapNode = prod(null, [br(...f1), br(...f2)], { kind });
			break;
		}
		case 'tre': {
			if (rng.next() < 0.25) {
				const p = rng.int(1, 2);
				const [f1, f2] = shuffle(rng, [br(X(1, vx), K(p)), br(X(1, vx), K(-p))]);
				const f3 = br(X(1, vx, 2), K(p * p));
				const fs = rng.next() < 0.5 ? [f1, f2, f3] : [f1, f3, f2];
				trapNode = prod(null, fs, { kind, pair: fs[1] === f3 ? [0, 2] : [0, 1] });
			} else {
				const p = rng.int(1, 4);
				const r = nonZero(rng, -5, 5, [p, -p]);
				const [f1, f2] = shuffle(rng, [br(X(1, vx), K(p)), br(X(1, vx), K(-p))]);
				const f3 = br(X(1, vx), K(r));
				const fs = rng.next() < 0.6 ? [f1, f3, f2] : [f3, f1, f2];
				trapNode = prod(null, fs, { kind, pair: fs[1] === f3 ? [0, 2] : [1, 2] });
			}
			break;
		}
		case 'blocco': {
			const C = K(rng.int(1, 5));
			const Bx = X(rng.pick([1, 1, 2]), vy);
			const Ax = X(1, vx);
			if (rng.next() < 0.55) {
				const a = [Ax, rng.next() < 0.6 ? Bx : neg(Bx)];
				const [f1, f2] = [br(...a, neg(C)), br(...a, C)];
				trapNode = prod(null, rng.next() < 0.5 ? [f1, f2] : [f2, f1], { kind, a, b: [C], variant: 1 });
			} else {
				const b = rng.next() < 0.6 ? [Bx, neg(C)] : [Bx, C];
				const f1 = br(Ax, ...b);
				const f2 = br(Ax, ...b.map(neg));
				trapNode = prod(null, rng.next() < 0.5 ? [f1, f2] : [f2, f1], { kind, a: [Ax], b, variant: 2 });
			}
			break;
		}
	}
	const items: Term['n'][] = [trapNode];
	if (rng.next() < 0.7) {
		const u = rng.next();
		let other: Term['n'];
		if (u < 0.5) other = pw(br(X(1, vx), two ? X(pm(rng, rng.pick([1, 1, 2])), vy) : K(pm(rng, rng.int(1, 4)))), 2);
		else if (u < 0.8) other = prod(X(rng.int(1, 3), vx), [br(two ? X(1, vy) : X(1, vx), K(nonZero(rng, -4, 4)))]);
		else other = leaf(two ? mono(nonZero(rng, -6, 6), { [vx]: 1, [vy]: 1 }) : mono(nonZero(rng, -9, 9), rng.next() < 0.5 ? {} : { [vx]: 1 }));
		if (rng.next() < 0.8) items.push(other);
		else items.unshift(other);
	}
	return { root: sumOf(items, signs(rng, items.length, 0.6)), case: CASE6_NAME[kind] };
}

function buildNested(rng: Rng): Built | null {
	const [x, y] = twoLetters(rng);
	const tri = [X(rng.pick([1, 1, 2]), x), X(pm(rng, rng.pick([1, 1, 2])), y), K(pm(rng, rng.int(1, 3)))];
	if (tri[1].c.sign() > 0 && tri[2].c.sign() > 0) {
		const i = rng.int(1, 2);
		tri[i] = neg(tri[i]);
	}
	const sq = pw(br(X(1, x), X(pm(rng, rng.pick([1, 1, 2])), y)), 2);
	const d = mono(rng.pick([2, 3]), rng.pick([{ [x]: 1, [y]: 1 }, { [x]: 1, [y]: 1 }, { [x]: 1 }, { [y]: 1 }]));
	const Q = [X(nonZero(rng, -4, 4), x), X(nonZero(rng, -4, 4), y)];
	const dv: Dv = { t: 'div', num: br(...Q.map((m) => mul(m, d))), d };
	const quadra = G(rng.next() < 0.8 ? S(T(sq), T(dv, rng.next() < 0.7)) : S(T(dv), T(sq, rng.next() < 0.5)));
	const tsq = pw(br(...tri), 2);
	const graffa = G(rng.next() < 0.8 ? S(T(tsq), T(quadra, rng.next() < 0.75)) : S(T(quadra), T(tsq, true)));
	const m = mono(rng.pick([q(-1, 2), q(1, 2), q(-2), q(2), q(-1), q(3), q(-3)]), rng.pick([{ [x]: 1 }, { [y]: 1 }]));
	return { root: { t: 'dot', left: graffa, m }, case: 'tonde, quadre e graffe' };
}

// ---------------------------------------------------------------------------
// Checks

const MAX_WIDTH: Record<number, number> = { 1: 32, 2: 40, 3: 44, 4: 36, 5: 36, 6: 32, 7: 56 };
/** Width of the answer and of each option of the choice, so that an option fits one line of a phone. */
const MAX_ANSWER_WIDTH: Record<number, number> = { 1: 22, 2: 22, 3: 22, 4: 22, 5: 22, 6: 22, 7: 26 };
const MAX_OPTION_WIDTH = 30;

function gcdInt(a: number, b: number): number {
	return b === 0 ? Math.abs(a) : gcdInt(b, a % b);
}

function walk(n: Node, f: (n: Node) => void): void {
	f(n);
	switch (n.t) {
		case 'pow':
			walk(n.base, f);
			break;
		case 'prod':
			n.factors.forEach((x) => walk(x, f));
			break;
		case 'div':
			walk(n.num, f);
			break;
		case 'grp':
			walk(n.inner, f);
			break;
		case 'sum':
			n.terms.forEach((t) => walk(t.n, f));
			break;
		case 'dot':
			walk(n.left, f);
			break;
	}
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const root = fromJSON(sample.params.tree);
	if (!root) return ['params.tree non valido'];
	let r: P;
	let out: Out;
	try {
		r = ev(root);
		out = render(root);
	} catch (e) {
		return [(e as Error).message];
	}
	v.push(...forbidden(sample.problem));
	if (problemLatex(root) !== sample.problem) v.push("problema diverso dall'albero");
	const lines = problemLines(sample.problem);
	lines.forEach((l, i) => {
		if (estWidth(l) > (i === 0 ? LINE : LINE - 2)) v.push(`riga ${i + 1} troppo larga per il telefono`);
	});
	if (lines.length > 3) v.push('più di tre righe');
	const a = sample.answer;
	if (a.kind !== 'expression' || a.value !== polySympy(r) || a.latex !== pl(r) || a.form !== 'expanded') v.push('risposta diversa dal risultato');
	else v.push(...forbidden(a.latex));
	if (r.length < 2) v.push('il risultato ha meno di due termini');
	if (r.some((m) => Math.abs(m.c.num) > 60 || m.c.den > 36)) v.push('risultato fuori intervallo');
	const width = visibleWidth(out.s);
	if (width > (MAX_WIDTH[sample.level] ?? 0)) v.push(`testo troppo lungo (${width})`);
	if (visibleWidth(pl(r)) > (MAX_ANSWER_WIDTH[sample.level] ?? 0)) v.push('risultato troppo lungo per il telefono');

	let pows = 0;
	let cubes = 0;
	let fracs = false;
	let bad = false;
	const lettersUsed = new Set<string>();
	const numerators = new Set<Node>();
	walk(root, (n) => {
		if (n.t === 'div') numerators.add(n.num);
	});
	walk(root, (n) => {
		// a bracket with integer coefficients has no common factor, as in the lesson's examples
		if (n.t === 'br' && !numerators.has(n) && n.terms.every((m) => m.c.isInteger()) && n.terms.reduce((g, m) => gcdInt(g, m.c.num), 0) > 1) bad = true;
		const monos: Mono[] = n.t === 'm' ? [n.m] : n.t === 'br' ? n.terms : n.t === 'prod' && n.coef ? [n.coef] : n.t === 'div' ? [n.d] : n.t === 'dot' ? [n.m] : [];
		for (const m of monos) {
			Object.keys(m.e).forEach((l) => lettersUsed.add(l));
			if (!m.c.isInteger()) fracs = true;
			if (m.c.den > 4 || Math.abs(m.c.num) > (sample.level === 7 && n.t === 'br' ? 36 : 12)) bad = true;
		}
		if (n.t === 'prod' && n.coef && n.coef.c.sign() <= 0) bad = true;
		if (n.t === 'pow') {
			pows++;
			if (n.n === 3) cubes++;
		}
		if (n.t !== 'dot' && n.t !== 'sum') {
			try {
				const val = ev(n);
				if (val.length === 0 || val.some((m) => Math.abs(m.c.num) > 100 || m.c.den > 36)) bad = true;
			} catch {
				bad = true;
			}
		}
	});
	if (bad) v.push('numeri del testo o risultati intermedi fuori intervallo');
	const nLetters = lettersUsed.size;
	switch (sample.level) {
		case 1:
			if (pows || fracs || nLetters !== 1) v.push('livello 1: prodotti senza potenze, una lettera, coefficienti interi');
			break;
		case 2:
		case 5:
			if (!pows || fracs || nLetters !== 1 || (sample.level === 5 ? cubes !== 1 : cubes > 0)) v.push(`livello ${sample.level}: prodotti notevoli in una lettera, coefficienti interi`);
			break;
		case 3:
			if (!pows || fracs || cubes) v.push('livello 3: quadrato di un binomio senza frazioni');
			break;
		case 4:
			if (!pows || !fracs || nLetters !== 1 || cubes) v.push('livello 4: frazioni in una lettera');
			break;
		case 6:
			if (cubes || fracs) v.push('livello 6: niente cubi e niente frazioni');
			break;
		case 7:
			if (out.lvl !== 3) v.push('livello 7: servono tonde, quadre e graffe');
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

// ---------------------------------------------------------------------------
// Serialisation, sample, choice

type J = Record<string, unknown>;

function toJSON(n: Node): J {
	const ms = (xs: Mono[]) => xs.map(monoJSON);
	const trap = (t?: Trap) => (t ? { ...t, a: t.a && ms(t.a), b: t.b && ms(t.b) } : undefined);
	switch (n.t) {
		case 'm':
			return { t: 'm', m: monoJSON(n.m) };
		case 'br':
			return { t: 'br', terms: ms(n.terms) };
		case 'pow':
			return { t: 'pow', base: toJSON(n.base), n: n.n, trap: trap(n.trap) };
		case 'prod':
			return { t: 'prod', coef: n.coef && monoJSON(n.coef), factors: n.factors.map(toJSON), trap: trap(n.trap) };
		case 'div':
			return { t: 'div', num: toJSON(n.num), d: monoJSON(n.d) };
		case 'grp':
			return { t: 'grp', inner: toJSON(n.inner) };
		case 'sum':
			return { t: 'sum', terms: n.terms.map((t) => ({ neg: t.neg, n: toJSON(t.n) })) };
		case 'dot':
			return { t: 'dot', left: toJSON(n.left), m: monoJSON(n.m) };
	}
}

function fromJSON(x: unknown): Node | null {
	const m = (y: unknown): Mono => {
		const r = monoFromJSON(y);
		if (!r) throw new Error('bad mono');
		return r;
	};
	const trap = (t: unknown): Trap | undefined => {
		if (!t) return undefined;
		const o = t as Trap & { a?: unknown[]; b?: unknown[] };
		return { ...o, a: o.a?.map(m), b: o.b?.map(m) };
	};
	const go = (y: unknown): Node => {
		const j = y as J;
		switch (j.t) {
			case 'm':
				return leaf(m(j.m));
			case 'br':
				return br(...(j.terms as unknown[]).map(m));
			case 'pow':
				return pw(go(j.base) as Br, j.n as number, trap(j.trap));
			case 'prod':
				return prod(j.coef ? m(j.coef) : null, (j.factors as unknown[]).map(go) as (Br | Pw)[], trap(j.trap));
			case 'div':
				return { t: 'div', num: go(j.num) as Br, d: m(j.d) };
			case 'grp':
				return G(go(j.inner) as Sum);
			case 'sum':
				return S(...(j.terms as { neg: boolean; n: unknown }[]).map((t) => T(go(t.n) as Term['n'], t.neg)));
			case 'dot':
				return { t: 'dot', left: go(j.left) as Grp, m: m(j.m) };
			default:
				throw new Error('bad node');
		}
	};
	try {
		return go(x);
	} catch {
		return null;
	}
}

function assemble(b: Built, level: number, seed: number): Sample {
	const r = ev(b.root);
	const st: string[] = [];
	steps(b.root, st, { label: '', level });
	return {
		generatorId: ID,
		level,
		seed,
		prompt: "Semplifica l'espressione e ordina il risultato.",
		problem: problemLatex(b.root),
		solution: pl(r),
		steps: st,
		answer: { kind: 'expression', value: polySympy(r), latex: pl(r), form: 'expanded' },
		params: { case: b.case, tree: toJSON(b.root), result: r.map(monoJSON) },
	};
}

/**
 * An answer button on a phone holds about 252 px of KaTeX at 16 px (one unit of estWidth is about
 * 10.5 px there). A polynomial wider than OPTION_LINE goes on two or three lines in a gathered
 * block, a new line before a + or a - between two terms.
 */
export const OPTION_LINE = 20;

export function optionLatex(p: P): string {
	const one = pl(p);
	if (estWidth(one) <= OPTION_LINE) return one;
	const terms = one.split(/ (?=[+-] )/);
	const lines: string[] = [];
	let cur = '';
	for (const t of terms) {
		if (cur && estWidth(`${cur} ${t}`) > OPTION_LINE) {
			lines.push(cur);
			cur = t;
		} else cur = cur ? `${cur} ${t}` : t;
	}
	lines.push(cur);
	return `\\begin{gathered}${lines.join(' \\\\ ')}\\end{gathered}`;
}

function polyOpt(p: P): Opt {
	const s = sortP(p);
	return { latex: optionLatex(s), value: polySympy(s), key: pKey(s) };
}

/** Generic wrong polynomials near the right one: one sign changed, the constant moved, a coefficient moved. */
function nearPoly(r: P, i: number): Opt | null {
	const k = Math.floor((i - 1) / 3);
	switch (i % 3) {
		case 1: {
			const j = k % r.length;
			return polyOpt(r.map((m, idx) => (idx === j ? neg(m) : m)));
		}
		case 2:
			return polyOpt([...r, mono(k % 2 === 0 ? k + 1 : -(k + 1))]);
		default:
			return polyOpt(r.map((m, idx) => (idx === k % r.length ? mono(m.c.add(q(1 + Math.floor(k / r.length))), { ...m.e }) : m)));
	}
}

const MISTAKES: Record<number, Mistake[]> = {
	1: ['minusfirst', 'firstlast'],
	2: ['minusfirst', 'mulfirst', 'nodouble', 'powcoef', 'halfdouble'],
	3: ['powcoef', 'minusfirst', 'nodouble', 'halfdouble'],
	4: ['halfdouble', 'minusfirst', 'nodouble', 'powcoef'],
	5: ['mulfirst', 'nodouble', 'minusfirst', 'halfdouble'],
	6: ['trapneg', 'nodouble', 'minusfirst', 'firstlast'],
	7: ['divfirst', 'trisign', 'minusfirst', 'nodouble'],
};

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const root = fromJSON(sample.params.tree)!;
	const r = ev(root);
	const cands: (Opt | null)[] = [];
	for (const mk of MISTAKES[sample.level] ?? []) {
		let w: P;
		try {
			w = ev(root, mk);
		} catch {
			continue;
		}
		if (w.length > 0 && w.every((m) => Math.abs(m.c.num) <= 500 && m.c.den <= 144)) cands.push(polyOpt(w));
	}
	cands.push(polyOpt(pneg(r)));
	const fits = (o: Opt | null) => (o && optionLines(o.latex).length <= 2 && visibleWidth(optionLines(o.latex).join(' ')) <= MAX_OPTION_WIDTH ? o : null);
	return buildChoice(polyOpt(r), cands.map(fits), (i) => fits(nearPoly(r, i)), rng);
}

export const polinomiEspressioni: Generator = {
	id: ID,
	title: 'Espressioni con polinomi',
	levels: {
		1: { label: 'Prodotti e somma, senza prodotti notevoli', constraints: ['un monomio per un binomio e un prodotto di due binomi che non è notevole', 'una lettera, coefficienti interi'] },
		2: { label: 'Prodotti notevoli con un meno o un numero davanti', constraints: ['quadrati di binomi e somme per differenze nella forma del formulario', 'almeno un meno davanti a un prodotto notevole; circa metà delle volte un numero davanti'] },
		3: { label: 'Due lettere o monomi di grado più alto', constraints: ['quadrato di un binomio con monomi come 2x^2 o y, somma per differenza, monomio per binomio'] },
		4: { label: 'Coefficienti frazionari', constraints: ['quadrato e somma per differenza con frazioni, denominatori fino a 4'] },
		5: { label: 'Cubo di un binomio e potenza dentro un prodotto', constraints: ['un cubo di binomio e un monomio o un numero per il quadrato di un binomio'] },
		6: { label: 'Prodotti notevoli da riconoscere', constraints: ['termini in disordine, segni negativi nel quadrato, fattori opposti, tre fattori, un binomio al posto di un termine'] },
		7: { label: 'Tonde, quadre e graffe', constraints: ['quadrato di un trinomio, divisione per un monomio, prodotto finale per un monomio'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			let b: Built | null;
			let sample: Sample;
			try {
				b = build(rng, level);
				if (!b) continue;
				sample = assemble(b, level, rng.seed);
			} catch (e) {
				if ((e as Error).message.includes('unknown level')) throw e;
				continue;
			}
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default polinomiEspressioni;
