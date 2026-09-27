import { Rational, ONE, ZERO, lcm } from '@/lib/exercises/v2/rational';
import { polyAdd, polyDegree, polyMul, polyScale, polySub, type Poly } from '@/lib/exercises/v2/latex';
import { parseDecimal } from './numbers';

/**
 * An equation in x as a student types it ("3(x - 2) + 5 = 2x - 1", "x/2 + 1/3 = x - 1", "0,5x^2 = 2"), parsed into
 * a tree that keeps what was written (for the preview and to know which steps are needed) and evaluated into two
 * polynomials over Rational. Shared by the first- and second-degree equation tools.
 *
 * Grammar, with implicit multiplication before x and before a bracket (2x, 3(x + 1), (x + 1)(x - 2)):
 *   equation = expr "=" expr
 *   expr     = ["+" | "-"] term { ("+" | "-") term }
 *   term     = factor { ("*" | "/" | ":" | implicit) factor }
 *   factor   = ("+" | "-") factor | power
 *   power    = atom [ "^" digits | "²" | "³" ]
 *   atom     = number | "x" | "(" expr ")" | "[" expr "]" | "{" expr "}"
 */

export type Node =
	| { k: 'num'; v: Rational; raw: string }
	| { k: 'x' }
	| { k: 'sum'; terms: { neg: boolean; n: Node }[] }
	| { k: 'neg'; n: Node }
	| { k: 'mul'; f: Node[]; explicit: boolean[] }
	| { k: 'div'; a: Node; b: Node }
	| { k: 'pow'; b: Node; e: number }
	| { k: 'group'; n: Node; open: string };

const MAX_LENGTH = 200;
const MAX_DEGREE = 12;
const CLOSE: Record<string, string> = { '(': ')', '[': ']', '{': '}' };

class ParseError extends Error {}

type Token = { t: 'num'; v: Rational; raw: string } | { t: 'x' } | { t: 'op'; v: string } | { t: 'pow'; e: number };

function tokenize(input: string): Token[] {
	const out: Token[] = [];
	const s = input.replace(/[−–]/g, '-').replace(/[·×⋅]/g, '*').replace(/÷/g, '/');
	let i = 0;
	while (i < s.length) {
		const ch = s[i];
		if (/\s/.test(ch)) {
			i++;
			continue;
		}
		const num = /^(\d+(?:[.,]\d+)*|[.,]\d+)/.exec(s.slice(i));
		if (num) {
			const v = parseDecimal(num[1]);
			if (!v) throw new ParseError(`Il numero ${num[1]} non è scritto bene: per i decimali usa una virgola sola, per esempio 1,5.`);
			out.push({ t: 'num', v, raw: num[1] });
			i += num[1].length;
			continue;
		}
		if (ch === 'x' || ch === 'X') {
			out.push({ t: 'x' });
			i++;
			continue;
		}
		if (ch === '²' || ch === '³') {
			out.push({ t: 'pow', e: ch === '²' ? 2 : 3 });
			i++;
			continue;
		}
		if (ch === '^') {
			const m = /^\^\s*(?:\{\s*(\d+)\s*\}|(\d+))/.exec(s.slice(i));
			if (!m) throw new ParseError("Dopo il simbolo ^ scrivi l'esponente, un numero intero: x^2.");
			out.push({ t: 'pow', e: Number(m[1] ?? m[2]) });
			i += m[0].length;
			continue;
		}
		if ('+-*/:()[]{}='.includes(ch)) {
			out.push({ t: 'op', v: ch });
			i++;
			continue;
		}
		if (/\p{L}/u.test(ch)) throw new ParseError(`Usa la x come incognita: la lettera ${ch} non si può usare.`);
		throw new ParseError(`Il simbolo ${ch} non si può usare in un'equazione.`);
	}
	return out;
}

class Parser {
	private i = 0;
	constructor(private readonly tokens: Token[]) {}

	private peek(): Token | undefined {
		return this.tokens[this.i];
	}
	private isOp(v: string): boolean {
		const t = this.peek();
		return !!t && t.t === 'op' && t.v === v;
	}
	done(): boolean {
		return this.i >= this.tokens.length;
	}

	expr(): Node {
		const terms: { neg: boolean; n: Node }[] = [];
		let neg = false;
		if (this.isOp('+') || this.isOp('-')) {
			neg = (this.peek() as { v: string }).v === '-';
			this.i++;
		}
		terms.push({ neg, n: this.term() });
		while (this.isOp('+') || this.isOp('-')) {
			neg = (this.peek() as { v: string }).v === '-';
			this.i++;
			terms.push({ neg, n: this.term() });
		}
		return terms.length === 1 && !terms[0].neg ? terms[0].n : { k: 'sum', terms };
	}

	private term(): Node {
		let node = this.factor();
		for (;;) {
			const t = this.peek();
			if (!t) break;
			if (t.t === 'op' && (t.v === '/' || t.v === ':')) {
				this.i++;
				node = { k: 'div', a: node, b: this.factor() };
			} else if (t.t === 'op' && t.v === '*') {
				this.i++;
				node = this.times(node, this.factor(), true);
			} else if (t.t === 'x' || (t.t === 'op' && t.v in CLOSE)) {
				node = this.times(node, this.factor(), false);
			} else if (t.t === 'num') {
				throw new ParseError('Tra due numeri scrivi un segno: 2 · 3, oppure 2 + 3.');
			} else break;
		}
		return node;
	}

	private times(a: Node, b: Node, explicit: boolean): Node {
		if (a.k === 'mul') return { k: 'mul', f: [...a.f, b], explicit: [...a.explicit, explicit] };
		return { k: 'mul', f: [a, b], explicit: [false, explicit] };
	}

	private factor(): Node {
		if (this.isOp('-')) {
			this.i++;
			return { k: 'neg', n: this.factor() };
		}
		if (this.isOp('+')) {
			this.i++;
			return this.factor();
		}
		const base = this.atom();
		const t = this.peek();
		if (t && t.t === 'pow') {
			this.i++;
			return { k: 'pow', b: base, e: t.e };
		}
		return base;
	}

	private atom(): Node {
		const t = this.peek();
		if (!t) throw new ParseError("L'equazione è incompleta: manca qualcosa alla fine di un membro. Scrivi per esempio 2x + 3 = 7.");
		if (t.t === 'num') {
			this.i++;
			return { k: 'num', v: t.v, raw: t.raw };
		}
		if (t.t === 'x') {
			this.i++;
			return { k: 'x' };
		}
		if (t.t === 'op' && t.v in CLOSE) {
			this.i++;
			const n = this.expr();
			if (!this.isOp(CLOSE[t.v])) throw new ParseError(`Controlla le parentesi: manca una ${CLOSE[t.v]}. Chiudi ogni parentesi che apri, per esempio 3(x + 1) = 6.`);
			this.i++;
			return { k: 'group', n, open: t.v };
		}
		if (t.t === 'op' && (t.v === ')' || t.v === ']' || t.v === '}')) throw new ParseError(`Controlla le parentesi: c'è una ${t.v} di troppo o vuota. Scrivi per esempio 3(x + 1) = 6.`);
		if (t.t === 'pow') throw new ParseError("L'esponente va scritto dopo la base: x^2.");
		throw new ParseError(`Controlla i segni: prima di ${t.v} manca un numero o la x. Scrivi per esempio 2x + 3 = 7.`);
	}
}

// ---------------------------------------------------------------------------
// Evaluation

class Fraction extends Error {}

function trim(p: Poly): Poly {
	const d = polyDegree(p);
	return d < 0 ? [ZERO] : p.slice(0, d + 1);
}

export function evaluate(n: Node): Poly {
	switch (n.k) {
		case 'num':
			return [n.v];
		case 'x':
			return [ZERO, ONE];
		case 'group':
			return evaluate(n.n);
		case 'neg':
			return polyScale(evaluate(n.n), ONE.neg());
		case 'sum':
			return trim(n.terms.reduce<Poly>((acc, t) => (t.neg ? polySub(acc, evaluate(t.n)) : polyAdd(acc, evaluate(t.n))), [ZERO]));
		case 'mul': {
			const p = trim(n.f.reduce<Poly>((acc, f) => polyMul(acc, evaluate(f)), [ONE]));
			if (polyDegree(p) > MAX_DEGREE) throw new ParseError(`Il grado è troppo alto: al massimo ${MAX_DEGREE}.`);
			return p;
		}
		case 'div': {
			const b = trim(evaluate(n.b));
			if (polyDegree(b) > 0) throw new Fraction();
			if (b[0].isZero()) throw new ParseError('Nell\'equazione c\'è una divisione per zero.');
			return trim(polyScale(evaluate(n.a), ONE.div(b[0])));
		}
		case 'pow': {
			if (n.e > MAX_DEGREE) throw new ParseError(`L'esponente è troppo alto: al massimo ${MAX_DEGREE}.`);
			const b = trim(evaluate(n.b));
			if (polyDegree(b) * n.e > MAX_DEGREE) throw new ParseError(`Il grado è troppo alto: al massimo ${MAX_DEGREE}.`);
			let p: Poly = [ONE];
			for (let i = 0; i < n.e; i++) p = polyMul(p, b);
			return trim(p);
		}
	}
}

// ---------------------------------------------------------------------------
// LaTeX of the tree, as written

function numLatex(raw: string): string {
	return raw.replace(/[.,]/g, (c) => (c === ',' ? '{,}' : '.'));
}

/** Nodes that need brackets when they are a factor of a product or a base. */
const isSumLike = (n: Node) => n.k === 'sum' || n.k === 'neg';

function wrap(n: Node, sub?: Rational): string {
	return isSumLike(n) ? `(${nodeLatex(n, sub)})` : nodeLatex(n, sub);
}

/** A group whose brackets only delimit a fraction's numerator or denominator: drop them in \frac. */
export const unwrap = (n: Node): Node => (n.k === 'group' ? unwrap(n.n) : n);

/**
 * The LaTeX of a node as it was typed. With `sub`, every x is replaced by that number, for the check by substitution:
 * in brackets when it is negative, or a fraction under an exponent, and always with a dot in a product (3 · 5, not 35).
 */
export function nodeLatex(n: Node, sub?: Rational): string {
	switch (n.k) {
		case 'num':
			return numLatex(n.raw);
		case 'x':
			if (!sub) return 'x';
			return sub.sign() < 0 ? `\\left(${sub.toLatex()}\\right)` : sub.toLatex();
		case 'group': {
			const [o, c] = n.open === '(' ? ['(', ')'] : n.open === '[' ? ['[', ']'] : ['\\{', '\\}'];
			return `\\left${o} ${nodeLatex(n.n, sub)} \\right${c}`;
		}
		case 'neg':
			return `-${n.n.k === 'sum' ? `(${nodeLatex(n.n, sub)})` : nodeLatex(n.n, sub)}`;
		case 'sum':
			return n.terms.map((t, i) => (i === 0 ? (t.neg ? '-' : '') : t.neg ? ' - ' : ' + ') + (t.n.k === 'neg' ? `(${nodeLatex(t.n, sub)})` : nodeLatex(t.n, sub))).join('');
		case 'mul':
			return n.f
				.map((f, i) => {
					const body = i > 0 && f.k === 'neg' ? `(${nodeLatex(f, sub)})` : wrap(f, sub);
					if (i === 0) return body;
					const juxtapose = !n.explicit[i] && (sub ? f.k === 'group' : f.k === 'x' || f.k === 'group' || (f.k === 'pow' && f.b.k !== 'num'));
					return juxtapose ? body : ` \\cdot ${body}`;
				})
				.join('');
		case 'div':
			return `\\dfrac{${nodeLatex(unwrap(n.a), sub)}}{${nodeLatex(unwrap(n.b), sub)}}`;
		case 'pow': {
			if (n.b.k === 'x' && sub) return `${sub.isInteger() && sub.sign() >= 0 ? sub.toLatex() : `\\left(${sub.toLatex()}\\right)`}^{${n.e}}`;
			const b = n.b.k === 'x' || n.b.k === 'group' || (n.b.k === 'num' && !/[.,]/.test(n.b.raw)) ? nodeLatex(n.b, sub) : `(${nodeLatex(n.b, sub)})`;
			return `${b}^{${n.e}}`;
		}
	}
}

// ---------------------------------------------------------------------------
// The equation

export interface Equation {
	lhs: Node;
	rhs: Node;
	/** The two sides as polynomials. */
	L: Poly;
	R: Poly;
	/** Degree of L - R: -1 when it is zero. */
	degree: number;
	/** The equation as typed, in LaTeX. */
	latex: string;
	/** What the input contains, to choose the steps. */
	has: { x: boolean; brackets: boolean; fractionBrackets: boolean; decimals: boolean; products: boolean };
}

export type Parsed = { ok: true; eq: Equation } | { ok: false; error: string; latex?: string };

export const EXAMPLE_HINT = "Scrivi un'equazione in x, per esempio 2x + 3 = 7.";

const isNumber = (n: Node) => n.k === 'num' || (n.k === 'div' && n.a.k === 'num' && n.b.k === 'num');
const isPowerOfX = (n: Node) => n.k === 'x' || (n.k === 'pow' && n.b.k === 'x');

/** A monomial as a student writes it: 3x, 2x^2, 1/2 x. Any other product needs a calculation. */
const isMonomial = (n: Node) => n.k === 'mul' && n.f.length === 2 && isNumber(n.f[0]) && isPowerOfX(n.f[1]) && !n.explicit[1];

/** Visits the tree, telling whether a node is the whole numerator or denominator of a fraction. */
function walkFrac(n: Node, visit: (n: Node, inFrac: boolean) => void, inFrac = false): void {
	visit(n, inFrac);
	if (n.k === 'group' || n.k === 'neg') walkFrac(n.n, visit);
	else if (n.k === 'sum') n.terms.forEach((t) => walkFrac(t.n, visit));
	else if (n.k === 'mul') n.f.forEach((f) => walkFrac(f, visit));
	else if (n.k === 'div') {
		walkFrac(n.a, visit, true);
		walkFrac(n.b, visit, true);
	} else if (n.k === 'pow') walkFrac(n.b, visit);
}

function features(nodes: Node[]): Equation['has'] {
	const has = { x: false, brackets: false, fractionBrackets: false, decimals: false, products: false };
	for (const root of nodes)
		walkFrac(root, (n, inFrac) => {
			if (n.k === 'x') has.x = true;
			// Brackets around a whole numerator are only the way to type a fraction: (x + 1)/3.
			if (n.k === 'group') has[inFrac ? 'fractionBrackets' : 'brackets'] = true;
			if (n.k === 'num' && !n.v.isInteger()) has.decimals = true;
			if ((n.k === 'mul' && !isMonomial(n)) || (n.k === 'pow' && n.b.k !== 'x') || n.k === 'neg') has.products = true;
		});
	return has;
}

export function parseEquation(input: string): Parsed {
	const text = input.trim();
	if (!text) return { ok: false, error: EXAMPLE_HINT };
	if (text.length > MAX_LENGTH) return { ok: false, error: `L'equazione è troppo lunga: al massimo ${MAX_LENGTH} caratteri.` };
	try {
		const tokens = tokenize(text);
		const eqs = tokens.filter((t) => t.t === 'op' && t.v === '=').length;
		if (eqs === 0) return { ok: false, error: "Manca il segno =: scrivi un'equazione, per esempio 2x + 3 = 7." };
		if (eqs > 1) return { ok: false, error: "C'è più di un segno =: un'equazione ha due membri. Scrivi un solo =, per esempio 2x + 3 = 7." };
		const split = tokens.findIndex((t) => t.t === 'op' && t.v === '=');
		const left = tokens.slice(0, split);
		const right = tokens.slice(split + 1);
		if (!left.length || !right.length) return { ok: false, error: 'Scrivi qualcosa prima e dopo il segno =, per esempio 2x + 3 = 7.' };
		const sides = [left, right].map((ts) => {
			const p = new Parser(ts);
			const n = p.expr();
			if (!p.done()) throw new ParseError('Controlla le parentesi e i segni: qualcosa è di troppo. Scrivi per esempio 3(x + 1) = 6.');
			return n;
		});
		const [lhs, rhs] = sides;
		const latex = `${nodeLatex(lhs)} = ${nodeLatex(rhs)}`;
		const has = features([lhs, rhs]);
		if (!has.x) return { ok: false, error: "Nell'equazione non c'è la x: " + EXAMPLE_HINT.charAt(0).toLowerCase() + EXAMPLE_HINT.slice(1), latex };
		let L: Poly, R: Poly;
		try {
			L = evaluate(lhs);
			R = evaluate(rhs);
		} catch (e) {
			if (e instanceof Fraction) return { ok: false, error: "La x compare in un denominatore: è un'equazione fratta, e qui si risolvono solo equazioni intere. Tieni la x fuori dai denominatori, per esempio x/2 + 1 = 3.", latex };
			throw e;
		}
		return { ok: true, eq: { lhs, rhs, L, R, degree: polyDegree(polySub(L, R)), latex, has } };
	} catch (e) {
		if (e instanceof ParseError) return { ok: false, error: e.message };
		return { ok: false, error: 'I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.' };
	}
}

/** The LaTeX of what has been typed so far, for the preview, or null if it does not parse. */
export function previewLatex(input: string): string | null {
	const r = parseEquation(input);
	return r.ok ? r.eq.latex : (r.latex ?? null);
}

// ---------------------------------------------------------------------------
// Monomials, for the steps: sides written as sums of terms that are not yet reduced

export interface Mono {
	c: Rational;
	deg: number;
	/** Marked with `\hl{…}` in the steps: this term is what changed. */
	hl?: boolean;
}

/** A term that a step has to rewrite: it has brackets, a decimal number or a product to do. */
function needsWork(n: Node): boolean {
	const { brackets, decimals, products } = features([n]);
	return brackets || decimals || products;
}

/** The top-level terms of a side, with their sign: 3(x - 2) + 5 → +3(x - 2), +5. */
export const sideTerms = (n: Node): { neg: boolean; n: Node }[] => (n.k === 'sum' ? n.terms : [{ neg: false, n }]);

/**
 * A side with the brackets removed and every product done, but like terms not yet added: 3(x - 2) + 5 → 3x - 6 + 5.
 * With `mark`, the terms that came out of a calculation are marked, for the highlight.
 */
export function expandSide(n: Node, mark = false): Mono[] {
	return sideTerms(n).flatMap(({ neg, n: t }) => {
		const p = evaluate(t);
		const hl = mark && needsWork(t);
		const out: Mono[] = [];
		for (let d = p.length - 1; d >= 0; d--) if (!p[d].isZero()) out.push({ c: neg ? p[d].neg() : p[d], deg: d, ...(hl ? { hl } : {}) });
		return out;
	});
}

const power = (deg: number) => (deg === 0 ? '' : deg === 1 ? 'x' : deg < 10 ? `x^${deg}` : `x^{${deg}}`);

/** A monomial without its sign: "3x", "x^2", "\frac{1}{2}x", "5". */
export function monoBody(m: Mono): string {
	const abs = m.c.abs();
	return m.deg > 0 && abs.isOne() ? power(m.deg) : `${abs.toLatex()}${power(m.deg)}`;
}

/**
 * A sum of monomials, zeros dropped: "3x - 6 + 5". Consecutive marked terms go in one `\hl{…}` with their signs; a
 * sign inside the highlight keeps its spacing thanks to the empty group before it.
 */
export function monoLatex(items: Mono[]): string {
	const nz = items.filter((m) => !m.c.isZero());
	if (!nz.length) return '0';
	let out = '';
	let open = false;
	nz.forEach((m, i) => {
		const sign = i === 0 ? (m.c.sign() < 0 ? '-' : '') : m.c.sign() < 0 ? ' - ' : ' + ';
		if (m.hl && !open) {
			out += i === 0 ? `\\hl{${sign}` : ` \\hl{{}${sign}`;
			open = true;
		} else if (!m.hl && open) {
			out += '}';
			open = false;
			out += sign;
		} else out += sign;
		out += monoBody(m);
	});
	return open ? `${out}}` : out;
}

export const scaleMonos = (items: Mono[], k: Rational): Mono[] => items.map((m) => ({ c: m.c.mul(k), deg: m.deg }));

/** Least common multiple of the denominators of the coefficients; 1 when they are all integers. */
export function denominatorsLcm(items: Rational[]): number {
	return items.reduce((acc, c) => lcm(acc, c.den), 1);
}

/**
 * The first step, when the equation needs one: remove the brackets, write decimals as fractions, do the products.
 * Its lines are the equation as typed and the equation after, with the rewritten terms highlighted. Null when the
 * sides are already sums of monomials.
 */
export function expansionStep(eq: Equation): { say: string; math: string[] } | null {
	const { brackets, decimals, products } = eq.has;
	if (!brackets && !decimals && !products) return null;
	const say = brackets ? (decimals ? 'Togli le parentesi e scrivi i decimali come frazioni.' : 'Togli le parentesi.') : decimals ? 'Scrivi i numeri decimali come frazioni.' : 'Esegui le moltiplicazioni.';
	return { say, math: [eq.latex, `${monoLatex(expandSide(eq.lhs, true))} = ${monoLatex(expandSide(eq.rhs, true))}`] };
}

/** Evaluates a polynomial at a rational. */
export function polyAt(p: Poly, x: Rational): Rational {
	return p.reduceRight((acc, c) => acc.mul(x).add(c), ZERO);
}

/**
 * A number typed in a field (a coefficient): "3", "-1,5", "2/3", "-(1/4)". Empty gives null; anything that is not a
 * constant gives an error.
 */
export function parseConstant(input: string): Rational | null | 'error' {
	const text = input.trim();
	if (!text) return null;
	if (text.length > 40) return 'error';
	try {
		const tokens = tokenize(text);
		if (tokens.some((t) => t.t === 'x' || (t.t === 'op' && t.v === '='))) return 'error';
		const p = new Parser(tokens);
		const n = p.expr();
		if (!p.done()) return 'error';
		const v = trim(evaluate(n));
		return polyDegree(v) > 0 ? 'error' : v[0];
	} catch {
		return 'error';
	}
}
