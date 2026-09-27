import { Rational, ONE, ZERO, gcd, lcm, q } from '@/lib/exercises/v2/rational';
import { paren, polyDegree } from '@/lib/exercises/v2/latex';
import { fail, type Outcome, type Step } from './types';
import { decimal, intTex, parseDecimal } from './numbers';
import { monoLatex, nodeLatex, parseEquation, type Mono, type Node } from './equazione';

/**
 * Logarithms and the numbers they work on, shared by the three tools on logarithms and exponentials (calcolo
 * del logaritmo, equazioni esponenziali, equazioni logaritmiche).
 *
 * A positive number built from rationals, square and cube roots, powers with a rational exponent and e is kept as its
 * prime factorisation with rational exponents: √8 is 2^(3/2), 1/9 is 3^(-2), 2e is 2^1 · e^1. Then log_b a is a
 * rational number exactly when the exponent vectors of a and b are proportional (a^n = b^m for whole n, m), and it
 * is the ratio of the two: 4 = 2^2 and 8 = 2^3, so log_4 8 = 3/2. The steps write both as powers of that smallest
 * common base.
 * Otherwise the logarithm is irrational, and the tools give the change of base and a decimal value.
 */

// ---------------------------------------------------------------------------
// Numbers as exponent vectors

/** Exponents by prime ("2", "3") or "e", zero exponents left out. */
export type Vec = Map<string, Rational>;

/** A real number of this kind: its sign, and the exponents of its absolute value. Zero has sign 0 and no exponents. */
export interface PNum {
	sign: -1 | 0 | 1;
	v: Vec;
}

/** An input the tool cannot use; the message says what to write. */
export class InputError extends Error {}

const MAX_FACTOR = 1e12;

function factorInt(n: number, into: Vec, k: 1 | -1): void {
	let m = n;
	const add = (p: number, e: number) => {
		const key = String(p);
		const next = (into.get(key) ?? ZERO).add(q(k * e));
		if (next.isZero()) into.delete(key);
		else into.set(key, next);
	};
	for (let p = 2; p * p <= m; p += p === 2 ? 1 : 2) {
		let e = 0;
		while (m % p === 0) {
			m /= p;
			e++;
		}
		if (e) add(p, e);
	}
	if (m > 1) add(m, 1);
}

/** A rational as a PNum. */
export function pnumOf(r: Rational): PNum {
	if (r.isZero()) return { sign: 0, v: new Map() };
	if (Math.abs(r.num) > MAX_FACTOR || r.den > MAX_FACTOR) throw new InputError('I numeri sono troppo grandi: usa numeri fino a mille miliardi.');
	const v: Vec = new Map();
	factorInt(Math.abs(r.num), v, 1);
	factorInt(r.den, v, -1);
	return { sign: r.sign(), v };
}

export const E: PNum = { sign: 1, v: new Map([['e', ONE]]) };

/** a + k·b on exponent vectors. */
function vecAdd(a: Vec, b: Vec, k: Rational = ONE): Vec {
	const out: Vec = new Map(a);
	for (const [key, e] of b) {
		const next = (out.get(key) ?? ZERO).add(e.mul(k));
		if (next.isZero()) out.delete(key);
		else out.set(key, next);
	}
	return out;
}

const vecScale = (a: Vec, k: Rational): Vec => (k.isZero() ? new Map() : new Map([...a].map(([key, e]) => [key, e.mul(k)])));

export function pmul(a: PNum, b: PNum): PNum {
	if (!a.sign || !b.sign) return { sign: 0, v: new Map() };
	return { sign: (a.sign * b.sign) as 1 | -1, v: vecAdd(a.v, b.v) };
}

export function pdiv(a: PNum, b: PNum): PNum {
	if (!b.sign) throw new InputError('C\'è una divisione per zero: controlla il denominatore.');
	if (!a.sign) return a;
	return { sign: (a.sign * b.sign) as 1 | -1, v: vecAdd(a.v, b.v, ONE.neg()) };
}

export function ppow(a: PNum, e: Rational): PNum {
	if (!a.sign) {
		if (e.sign() > 0) return a;
		throw new InputError('Zero elevato a zero o a un esponente negativo non ha significato.');
	}
	if (a.sign < 0 && !e.isInteger()) throw new InputError('La radice o l\'esponente fratto di un numero negativo non si calcola qui: scrivi un numero positivo sotto radice.');
	return { sign: a.sign < 0 && Math.abs(e.num) % 2 === 1 ? -1 : 1, v: vecScale(a.v, e) };
}

export const isOne = (a: PNum) => a.sign === 1 && a.v.size === 0;

export function pequal(a: PNum, b: PNum): boolean {
	if (a.sign !== b.sign || a.v.size !== b.v.size) return false;
	for (const [key, e] of a.v) if (!b.v.get(key)?.equals(e)) return false;
	return true;
}

/** The number as an exact rational, or null when it has a root or e in it (or does not fit). */
export function toRational(a: PNum): Rational | null {
	if (!a.sign) return ZERO;
	let r = ONE;
	try {
		for (const [key, e] of a.v) {
			if (key === 'e' || !e.isInteger()) return null;
			const p = q(Number(key));
			for (let i = 0; i < Math.abs(e.num); i++) r = e.num > 0 ? r.mul(p) : r.div(p);
		}
	} catch {
		return null;
	}
	return a.sign < 0 ? r.neg() : r;
}

/** The natural logarithm of |a|. */
export function lnOf(a: PNum): number {
	let s = 0;
	for (const [key, e] of a.v) s += (e.num / e.den) * (key === 'e' ? 1 : Math.log(Number(key)));
	return s;
}

export function valueOf(a: PNum): number {
	return a.sign * Math.exp(lnOf(a));
}

const sortedKeys = (v: Vec) => [...v.keys()].sort((x, y) => (x === 'e' ? 1 : y === 'e' ? -1 : Number(x) - Number(y)));

function bigPow(p: number, e: number): number {
	const r = p ** e;
	if (!Number.isSafeInteger(r)) throw new InputError('I numeri sono troppo grandi per scriverli per intero: prova con numeri più piccoli.');
	return r;
}

/**
 * The number in the usual form: a fraction, times a power of e, times one root. √8 → 2√2, 2^(-3/2) → √2/4,
 * 12^(1/3) → ∛12.
 */
export function pnumTex(a: PNum): string {
	if (!a.sign) return '0';
	let N = 1;
	let D = 1;
	const frac: [number, Rational][] = [];
	let eExp: Rational | null = null;
	for (const key of sortedKeys(a.v)) {
		const e = a.v.get(key)!;
		if (key === 'e') {
			eExp = e;
			continue;
		}
		const p = Number(key);
		const whole = Math.floor(e.num / e.den);
		const rest = e.sub(q(whole));
		if (whole > 0) N *= bigPow(p, whole);
		if (whole < 0) D *= bigPow(p, -whole);
		if (!rest.isZero()) frac.push([p, rest]);
		if (!Number.isSafeInteger(N) || !Number.isSafeInteger(D)) throw new InputError('I numeri sono troppo grandi per scriverli per intero: prova con numeri più piccoli.');
	}
	let root = '';
	if (frac.length) {
		const d = frac.reduce((acc, [, r]) => lcm(acc, r.den), 1);
		const m = frac.reduce((acc, [p, r]) => acc * bigPow(p, (r.num * d) / r.den), 1);
		if (!Number.isSafeInteger(m)) throw new InputError('I numeri sono troppo grandi per scriverli per intero: prova con numeri più piccoli.');
		root = d === 2 ? `\\sqrt{${intTex(m)}}` : `\\sqrt[${d}]{${intTex(m)}}`;
	}
	const ePart = eExp ? (eExp.isOne() ? 'e' : `e^{${eExp.toLatex()}}`) : '';
	const top = `${N !== 1 || (!ePart && !root) ? intTex(N) : ''}${ePart}${root}`;
	const body = D === 1 ? top : `\\dfrac{${top}}{${intTex(D)}}`;
	return a.sign < 0 ? `-${body}` : body;
}

// ---------------------------------------------------------------------------
// The smallest common base

/**
 * a (positive, not 1) as a power of the smallest base c: a = c^r with c's exponents whole numbers without a common
 * factor. c is a whole number when a's exponents all have the same sign (1/8 = 2^(-3)), else a fraction
 * (4/9 = (2/3)^2).
 */
export function commonBase(a: PNum): { w: Vec; r: Rational } {
	const es = [...a.v.values()];
	const num = es.reduce((acc, e) => gcd(acc, e.num), 0);
	const den = es.reduce((acc, e) => lcm(acc, e.den), 1);
	let r = q(num, den);
	if (es.every((e) => e.sign() < 0)) r = r.neg();
	return { w: vecScale(a.v, ONE.div(r)), r };
}

/** The exponent s with a = c^s, where c has exponents w; null when a is not a power of c. */
export function ratio(a: PNum, w: Vec): Rational | null {
	if (a.sign !== 1) return null;
	if (!a.v.size) return ZERO;
	const [key, we] = [...w][0];
	const s = (a.v.get(key) ?? ZERO).div(we);
	const back = vecScale(w, s);
	if (back.size !== a.v.size) return null;
	for (const [k, e] of back) if (!a.v.get(k)?.equals(e)) return null;
	return s;
}

/** How a power of the base c is written: "2", "2^{-1}", "\left(\dfrac{2}{3}\right)^{2}". */
export function baseWriter(w: Vec): { tex: string; pow: (s: Rational) => string } {
	const tex = pnumTex({ sign: 1, v: w });
	const plain = /^[\d\\,]+$/.test(tex) || tex === 'e';
	const wrapped = plain ? tex : `\\left(${tex}\\right)`;
	return { tex, pow: (s) => (s.isOne() ? tex : `${wrapped}^{${s.toLatex()}}`) };
}

// ---------------------------------------------------------------------------
// Parsing a number typed by a student: "8", "1/2", "0,25", "2√2", "sqrt(8)", "∛4", "2^(1/3)", "e^2", "(2/3)^-1"

export type CNode =
	| { k: 'num'; v: Rational; raw: string }
	| { k: 'e' }
	| { k: 'root'; n: number; a: CNode }
	| { k: 'pow'; b: CNode; e: Rational }
	| { k: 'mul'; f: CNode[] }
	| { k: 'div'; a: CNode; b: CNode }
	| { k: 'neg'; a: CNode }
	| { k: 'group'; a: CNode; open: string };

type Tok = { t: 'num'; v: Rational; raw: string } | { t: 'e' } | { t: 'root'; n: number } | { t: 'op'; v: string } | { t: 'x' };

const CLOSE: Record<string, string> = { '(': ')', '[': ']', '{': '}' };

/** Unicode signs as ASCII: the minus, the dot and the cross of a product, the division sign. */
export const normalize = (s: string) => s.replace(/[−–—]/g, '-').replace(/[·×⋅]/g, '*').replace(/÷/g, '/');

function tokenize(input: string): Tok[] {
	const s = normalize(input);
	const out: Tok[] = [];
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
			if (!v) throw new InputError(`Il numero ${num[1]} non è scritto bene: per i decimali usa una virgola sola, per esempio 1,5.`);
			out.push({ t: 'num', v, raw: num[1] });
			i += num[1].length;
			continue;
		}
		const word = /^[a-zA-Z]+/.exec(s.slice(i));
		if (word) {
			const w = word[0].toLowerCase();
			if (w === 'e') out.push({ t: 'e' });
			else if (w === 'sqrt' || w === 'rad') out.push({ t: 'root', n: 2 });
			else if (w === 'cbrt') out.push({ t: 'root', n: 3 });
			else if (w === 'x') out.push({ t: 'x' });
			else throw new InputError(`Non riconosco «${word[0]}»: scrivi numeri, frazioni come 1/2, radici come √2 o sqrt(2), la e.`);
			i += word[0].length;
			continue;
		}
		if (ch === '√' || ch === '∛' || ch === '∜') {
			out.push({ t: 'root', n: ch === '√' ? 2 : ch === '∛' ? 3 : 4 });
			i++;
			continue;
		}
		if ('+-*/:()[]{}^'.includes(ch)) {
			out.push({ t: 'op', v: ch });
			i++;
			continue;
		}
		throw new InputError(`Il simbolo ${ch} non si può usare qui.`);
	}
	return out;
}

const SUM = 'Scrivi un numero solo, senza somme: per esempio 8, 1/2 oppure 2√2.';

class CParser {
	private i = 0;
	constructor(private readonly toks: Tok[]) {}
	private peek(): Tok | undefined {
		return this.toks[this.i];
	}
	private isOp(v: string): boolean {
		const t = this.peek();
		return !!t && t.t === 'op' && t.v === v;
	}
	whole(): CNode {
		const n = this.expr();
		const t = this.peek();
		if (t) throw new InputError(t.t === 'op' && (t.v === '+' || t.v === '-') ? SUM : 'Controlla le parentesi e i segni: qualcosa è di troppo.');
		return n;
	}
	private expr(): CNode {
		return this.product();
	}
	private product(): CNode {
		let node = this.unary();
		for (;;) {
			const t = this.peek();
			if (!t) break;
			if (t.t === 'op' && (t.v === '/' || t.v === ':')) {
				this.i++;
				node = { k: 'div', a: node, b: this.unary() };
			} else if (t.t === 'op' && t.v === '*') {
				this.i++;
				node = this.times(node, this.unary());
			} else if (t.t === 'e' || t.t === 'root' || (t.t === 'op' && t.v in CLOSE)) {
				node = this.times(node, this.unary());
			} else if (t.t === 'num') throw new InputError('Tra due numeri scrivi un segno: 2 · 3, oppure 2/3.');
			else break;
		}
		return node;
	}
	private times(a: CNode, b: CNode): CNode {
		return a.k === 'mul' ? { k: 'mul', f: [...a.f, b] } : { k: 'mul', f: [a, b] };
	}
	private unary(): CNode {
		if (this.isOp('-')) {
			this.i++;
			return { k: 'neg', a: this.unary() };
		}
		if (this.isOp('+')) {
			this.i++;
			return this.unary();
		}
		const base = this.atom();
		if (this.isOp('^')) {
			this.i++;
			return { k: 'pow', b: base, e: this.exponent() };
		}
		return base;
	}
	private exponent(): Rational {
		let neg = false;
		if (this.isOp('-')) {
			neg = true;
			this.i++;
		}
		const t = this.peek();
		let e: Rational | null = null;
		if (t?.t === 'num') {
			this.i++;
			e = t.v;
		} else if (t?.t === 'op' && t.v in CLOSE) {
			this.i++;
			const inner = this.expr();
			if (!this.isOp(CLOSE[t.v])) throw new InputError(`Controlla le parentesi: manca una ${CLOSE[t.v]}.`);
			this.i++;
			e = toRational(evalNode(inner));
		} else if (t?.t === 'x') throw new XError();
		if (!e) throw new InputError("Dopo il simbolo ^ scrivi l'esponente, un numero o una frazione tra parentesi: 2^3, 8^(1/3).");
		return neg ? e.neg() : e;
	}
	private atom(): CNode {
		const t = this.peek();
		if (!t) throw new InputError('Manca un numero alla fine.');
		this.i++;
		if (t.t === 'num') return { k: 'num', v: t.v, raw: t.raw };
		if (t.t === 'e') return { k: 'e' };
		if (t.t === 'x') throw new XError();
		if (t.t === 'root') return { k: 'root', n: t.n, a: this.atom() };
		if (t.t === 'op' && t.v in CLOSE) {
			const a = this.expr();
			if (this.isOp('+') || this.isOp('-')) throw new InputError(SUM);
			if (!this.isOp(CLOSE[t.v])) throw new InputError(`Controlla le parentesi: manca una ${CLOSE[t.v]}.`);
			this.i++;
			return { k: 'group', a, open: t.v };
		}
		if (t.t === 'op' && (t.v === '+' || t.v === '-')) throw new InputError(SUM);
		throw new InputError(`Controlla i segni: prima di ${t.v} manca un numero.`);
	}
}

/** Thrown when a number contains x: the equation tools use it to tell a constant from an expression in x. */
export class XError extends InputError {
	constructor() {
		super('Qui scrivi un numero, senza la x.');
	}
}

export function evalNode(n: CNode): PNum {
	switch (n.k) {
		case 'num':
			return pnumOf(n.v);
		case 'e':
			return E;
		case 'root': {
			const a = evalNode(n.a);
			if (a.sign < 0) throw new InputError('Sotto radice scrivi un numero positivo.');
			return ppow(a, q(1, n.n));
		}
		case 'pow':
			return ppow(evalNode(n.b), n.e);
		case 'mul':
			return n.f.reduce<PNum>((acc, f) => pmul(acc, evalNode(f)), { sign: 1, v: new Map() });
		case 'div':
			return pdiv(evalNode(n.a), evalNode(n.b));
		case 'neg': {
			const a = evalNode(n.a);
			return { sign: (-a.sign || 0) as -1 | 0 | 1, v: a.v };
		}
		case 'group':
			return evalNode(n.a);
	}
}

export interface Parsed {
	node: CNode;
	val: PNum;
}

/** A number typed in a field, or an InputError. Empty input gives null. */
export function parseNumberNode(input: string): Parsed | null {
	if (!input.trim()) return null;
	if (input.length > 60) throw new InputError('Il numero è troppo lungo: al massimo 60 caratteri.');
	let node: CNode;
	try {
		node = new CParser(tokenize(input)).whole();
	} catch (e) {
		if (e instanceof InputError) throw e;
		throw new InputError('I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.');
	}
	try {
		return { node, val: evalNode(node) };
	} catch (e) {
		if (e instanceof InputError) throw e;
		throw new InputError('I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.');
	}
}

// ---------------------------------------------------------------------------
// LaTeX of a typed number: as written, and with every number written as a power of a common base

const unwrap = (n: CNode): CNode => (n.k === 'group' ? unwrap(n.a) : n);
const numLatex = (raw: string) => raw.replace(/,/g, '{,}');

/** The number as it was typed. */
export function writtenTex(n: CNode): string {
	switch (n.k) {
		case 'num':
			return numLatex(n.raw);
		case 'e':
			return 'e';
		case 'root': {
			const inner = writtenTex(unwrap(n.a));
			return n.n === 2 ? `\\sqrt{${inner}}` : `\\sqrt[${n.n}]{${inner}}`;
		}
		case 'pow': {
			const b = n.b;
			const plain = (b.k === 'num' && !/[.,]/.test(b.raw)) || b.k === 'e' || b.k === 'group';
			return `${plain ? writtenTex(b) : `\\left(${writtenTex(b)}\\right)`}^{${n.e.toLatex()}}`;
		}
		case 'mul':
			return n.f
				.map((f, i) => {
					if (i === 0) return writtenTex(f);
					if (f.k === 'neg') return ` \\cdot \\left(${writtenTex(f)}\\right)`;
					const juxtapose = f.k === 'root' || f.k === 'e' || f.k === 'group' || (f.k === 'pow' && (f.b.k === 'e' || f.b.k === 'group'));
					return juxtapose && n.f[i - 1].k !== 'root' ? writtenTex(f) : ` \\cdot ${writtenTex(f)}`;
				})
				.join('');
		case 'div':
			return `\\dfrac{${writtenTex(unwrap(n.a))}}{${writtenTex(unwrap(n.b))}}`;
		case 'neg':
			return `-${n.a.k === 'neg' ? `\\left(${writtenTex(n.a)}\\right)` : writtenTex(n.a)}`;
		case 'group': {
			const [o, c] = n.open === '{' ? ['\\{', '\\}'] : n.open === '[' ? ['[', ']'] : ['(', ')'];
			return `\\left${o}${writtenTex(n.a)}\\right${c}`;
		}
	}
}

/**
 * The number as typed with each number in it written as a power of the base c (roots as fractional exponents):
 * 2√2 with c = 2 → 2 · 2^{1/2}. Null when a number in it is not a power of c.
 */
export function asPowersTex(n: CNode, w: Vec): string | null {
	const { tex, pow } = baseWriter(w);
	const powerOf = (inner: string, e: Rational) => (inner === tex ? pow(e) : `\\left(${inner}\\right)^{${e.toLatex()}}`);
	const go = (m: CNode): string | null => {
		switch (m.k) {
			case 'num':
			case 'e': {
				const s = ratio(m.k === 'e' ? E : pnumOf(m.v), w);
				if (!s) return null;
				return s.isZero() ? '1' : pow(s);
			}
			case 'root': {
				const inner = go(unwrap(m.a));
				return inner === null ? null : powerOf(inner, q(1, m.n));
			}
			case 'pow': {
				const inner = go(unwrap(m.b));
				return inner === null ? null : powerOf(inner, m.e);
			}
			case 'mul': {
				const fs = m.f.map(go);
				return fs.some((f) => f === null) ? null : fs.join(' \\cdot ');
			}
			case 'div': {
				const a = go(unwrap(m.a));
				const b = go(unwrap(m.b));
				return a === null || b === null ? null : `\\dfrac{${a}}{${b}}`;
			}
			case 'neg':
				return null;
			case 'group': {
				const inner = go(m.a);
				return inner === null ? null : m.a.k === 'mul' ? `\\left(${inner}\\right)` : inner;
			}
		}
	};
	return go(n);
}

/** The lines that write a typed number as c^s: as typed, each number as a power of c, then c^s. Duplicates dropped. */
export function toBaseLines(n: CNode, w: Vec, s: Rational, hl = true): string[] | null {
	const { tex, pow } = baseWriter(w);
	const final = s.isZero() ? `${tex}^{0}` : pow(s);
	const mid = asPowersTex(n, w);
	const out = dedupe([writtenTex(n), ...(mid !== null ? [mid] : []), final]);
	if (out.length === 1) return null;
	if (hl) out[out.length - 1] = `\\hl{${out[out.length - 1]}}`;
	return [out.join(' = ')];
}

/** A typed number in a logarithm: in brackets when it is a product or negative. */
export function argTex(n: CNode): string {
	const t = writtenTex(n);
	return n.k === 'mul' || n.k === 'neg' ? `\\left(${t}\\right)` : t;
}

/** "\log_{2}", "\ln" for base e. */
export function logTex(base: PNum, baseNode: CNode): string {
	if (pequal(base, E)) return '\\ln';
	return `\\log_{${writtenTex(baseNode).replace(/\\dfrac/g, "\\frac")}}`;
}

// ---------------------------------------------------------------------------
// Decimals

/** A value computed in floating point, rounded: "1{,}4650", with thin spaces for thousands. */
export function approx(v: number, digits = 4): { tex: string; text: string } {
	const r = Math.abs(v) < 0.5 * 10 ** -digits ? 0 : v;
	const [int, frac] = Math.abs(r).toFixed(digits).split('.');
	const group = (s: string, sep: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s);
	const sign = r < 0 ? '-' : '';
	return { tex: `${sign}${group(int, '\\,')}{,}${frac}`, text: `${sign}${group(int, ' ')},${frac}` };
}

/** An exact rational with its decimal after it, as the value of a result row: "$\frac{3}{2}$ $= 1{,}5$". */
export function rationalValue(prefix: string, r: Rational, digits = 4): string {
	if (r.isInteger()) return `$${prefix}${r.toLatex()}$`;
	const d = decimal(r, digits);
	return `$${prefix}${r.toLatex()}$ $${d.exact ? '=' : '\\approx'} ${d.tex}$`;
}

/** A rational as text for the copy button: "3/2", "-3". */
export const rationalText = (r: Rational) => r.toString();

/** The natural logarithm of a typed number, for a line of working: "\ln 5 \approx 1{,}6094", "\ln e = 1". */
export function lnLine(a: PNum, tex: string, digits = 4): string {
	if (a.v.size <= 1 && (a.v.size === 0 || a.v.has('e'))) return `\\ln ${tex} = ${(a.v.get('e') ?? ZERO).toLatex()}`;
	return `\\ln ${tex} \\approx ${approx(lnOf(a), digits).tex}`;
}

// ---------------------------------------------------------------------------
// Linear expressions in x, typed as in the equation tools

export interface Lin {
	/** px + q. */
	p: Rational;
	q: Rational;
	/** As typed. */
	node: Node;
	tex: string;
	/** A sum or a negative: in brackets when multiplied. */
	isSum: boolean;
}

/** An expression in x of degree at most one, read with the parser of the equation tools. */
export function parseLinear(text: string, what: string): Lin {
	const where = `Nel${what}`;
	if (!text.trim()) throw new InputError(`Manca ${what}: scrivi per esempio x + 1.`);
	const parsed = parseEquation(`${text} = 0`);
	if (!parsed.ok) throw new InputError(`${where}: ${parsed.error.charAt(0).toLowerCase()}${parsed.error.slice(1)}`);
	const { eq } = parsed;
	if (polyDegree(eq.L) > 1) throw new InputError(`${where} la x deve comparire solo alla prima potenza, come in 2x + 1: qui si risolvono solo questi casi.`);
	const p = eq.L[1] ?? ZERO;
	if (p.isZero()) throw new InputError(`${where} la x si cancella: scrivi un'espressione in cui la x resta, come 2x + 1.`);
	const node = eq.lhs;
	return { p, q: eq.L[0] ?? ZERO, node, tex: nodeLatex(node).replace(/\\dfrac/g, '\\frac'), isSum: node.k === 'sum' || node.k === 'neg' };
}

/** px + q with x replaced by a value, as in the check by substitution. */
export const linAt = (f: Lin, x: Rational) => f.p.mul(x).add(f.q);

/** The expression as typed with x replaced by a value: "2 \\cdot 3 - 1"; just the value when it is x alone. */
export const linSub = (f: Lin, x: Rational) => (f.node.k === 'x' ? x.toLatex() : nodeLatex(f.node, x).replace(/\\dfrac/g, '\\frac'));

/** "k(x - 1)", "6x", for k times a linear expression as typed. */
export function timesLin(k: Rational, f: Lin): string {
	if (k.isOne()) return f.tex;
	if (f.isSum || f.node.k === 'div') return `${k.equals(q(-1)) ? '-' : k.toLatex()}\\left(${f.tex}\\right)`;
	return monoLatex([{ c: f.p.mul(k), deg: 1 }, { c: f.q.mul(k), deg: 0 }]);
}

/** "5x", "-x", "x". */
export function coefX(a: Rational): string {
	if (a.isOne()) return 'x';
	if (a.equals(q(-1))) return '-x';
	return `${a.toLatex()}x`;
}

/**
 * The lines that solve a·x + b = c·x + d (rationals), as in the first-degree equation tool: move the terms, add
 * like terms, divide. Returns the case and the solution.
 */
export function linearLines(a: Rational, b: Rational, c: Rational, d: Rational): { lines: string[]; x?: Rational; kind: 'una' | 'impossibile' | 'indeterminata' } {
	const lines: string[] = [];
	const left: Mono[] = [
		{ c: a, deg: 1 },
		{ c: b, deg: 0 }
	];
	const right: Mono[] = [
		{ c: c, deg: 1 },
		{ c: d, deg: 0 }
	];
	lines.push(`${monoLatex(left)} = ${monoLatex(right)}`);
	const moveX: Mono[] = [{ c: a, deg: 1 }, ...(c.isZero() ? [] : [{ c: c.neg(), deg: 1, hl: true }])];
	const moveC: Mono[] = [{ c: d, deg: 0 }, ...(b.isZero() ? [] : [{ c: b.neg(), deg: 0, hl: true }])];
	if (!b.isZero() || !c.isZero()) lines.push(`${monoLatex(moveX)} = ${monoLatex(moveC)}`);
	const A = a.sub(c);
	const B = d.sub(b);
	const reduced = `${A.isZero() ? '0x' : coefX(A)} = ${B.toLatex()}`;
	if (lines.at(-1) !== reduced) lines.push(reduced);
	if (A.isZero()) return { lines, kind: B.isZero() ? 'indeterminata' : 'impossibile' };
	const x = B.div(A);
	if (A.isOne()) lines[lines.length - 1] = `x = \\hl{${x.toLatex()}}`;
	else {
		const already = A.equals(q(-1)) || (A.sign() > 0 && A.isInteger() && B.isInteger() && x.num === B.num && x.den === A.num);
		if (!already) lines.push(A.isInteger() && B.isInteger() ? `x = \\dfrac{${B.toLatex()}}{${A.toLatex()}}` : `x = ${paren(B)} \\cdot ${paren(ONE.div(A))}`);
		lines.push(`x = \\hl{${x.toLatex()}}`);
	}
	return { lines: dedupe(lines), x, kind: 'una' };
}

const dedupe = (lines: string[]) => lines.filter((l, i) => i === 0 || l !== lines[i - 1]);

// ---------------------------------------------------------------------------
// The logarithm of a number

const DIGITS = 4;

function parseField(input: string, what: 'base' | 'argomento'): Parsed | string {
	const example = what === 'base' ? 'Scrivi la base, per esempio 2 oppure 1/2.' : "Scrivi l'argomento, per esempio 8 oppure √2.";
	try {
		return parseNumberNode(input) ?? example;
	} catch (e) {
		if (e instanceof XError) return `Qui non serve la x. ${example}`;
		return e instanceof InputError ? e.message : example;
	}
}

/** log_b a with the steps: exact when a and b are powers of the same number, else by the change of base. */
export function logaritmo(baseInput: string, argInput: string): Outcome {
	const b = parseField(baseInput, 'base');
	if (typeof b === 'string') return fail(b);
	const a = parseField(argInput, 'argomento');
	if (typeof a === 'string') return fail(a);
	try {
		return solveLog(b, a);
	} catch (e) {
		return fail(e instanceof InputError ? e.message : 'I numeri sono troppo grandi per fare i calcoli esatti: prova con numeri più piccoli.');
	}
}

function undefinedLog(b: Parsed, a: Parsed): Outcome {
	const bt = writtenTex(b.node);
	const at = writtenTex(a.node);
	const steps: Step[] = [];
	if (b.val.sign <= 0)
		steps.push({
			say: 'Guarda la base: deve essere positiva.',
			math: b.val.sign ? [`${bt} < 0`] : bt === '0' ? undefined : [`${bt} = 0`],
			then: 'Con una base negativa o nulla il logaritmo non si definisce.'
		});
	else if (isOne(b.val))
		steps.push({
			say: 'Guarda la base: deve essere diversa da $1$.',
			math: ['1^y = 1'],
			then: 'Ogni potenza di $1$ vale $1$: per questo la base $1$ non si usa.'
		});
	if (a.val.sign <= 0)
		steps.push({
			say: "Guarda l'argomento: deve essere positivo.",
			math: a.val.sign ? [`${at} < 0`] : at === '0' ? undefined : [`${at} = 0`],
			then: 'Una potenza con base positiva è sempre positiva: non vale mai zero o un numero negativo.'
		});
	return {
		ok: true,
		rows: [{ label: 'Logaritmo', value: 'Non esiste: base e argomento non rispettano le condizioni' }],
		copy: 'non esiste',
		steps: [{ say: 'Controlla le condizioni: base positiva e diversa da $1$, argomento positivo.' }, ...steps]
	};
}

function solveLog(b: Parsed, a: Parsed): Outcome {
	if (b.val.sign <= 0 || isOne(b.val) || a.val.sign <= 0) return undefinedLog(b, a);
	const log = `${logTex(b.val, b.node)} ${argTex(a.node)}`;
	const { w, r } = commonBase(b.val);
	const s = ratio(a.val, w);
	const { tex: c, pow } = baseWriter(w);
	if (s) {
		const y = s.div(r);
		const steps: Step[] = [];
		const cs = c.replace(/\\dfrac/g, '\\frac');
		const baseLines = toBaseLines(b.node, w, r);
		if (baseLines) steps.push({ say: `Scrivi la base come potenza di $${cs}$.`, math: baseLines });
		const argLines = toBaseLines(a.node, w, s);
		if (argLines) steps.push({ say: `Scrivi l'argomento come potenza di $${cs}$.`, math: argLines });
		const bt = writtenTex(b.node);
		const btw = /^[\d\\,]+$|^e$/.test(bt) ? bt : `\\left(${bt}\\right)`;
		steps.push({ say: "Chiama $y$ il logaritmo: è l'esponente da dare alla base.", math: [`${log} = y`, `${btw}^y = ${writtenTex(a.node)}`] });
		const aPow = s.isZero() ? `${c}^{0}` : pow(s);
		const lines = r.isOne() ? [`${c}^y = ${aPow}`] : [`\\left(${pow(r)}\\right)^y = ${aPow}`, `${c}^{\\hl{${r.equals(q(-1)) ? '-' : r.toLatex()}y}} = ${aPow}`];
		if (baseLines || argLines) steps.push({ say: `Sostituisci le potenze di $${cs}$.`, math: lines });
		steps.push({
			say: 'Uguaglia gli esponenti: le basi sono uguali.',
			math: r.isOne() ? [`y = \\hl{${y.toLatex()}}`] : [`${r.equals(q(-1)) ? '-' : r.toLatex()}y = ${s.toLatex()}`, `y = \\hl{${y.toLatex()}}`]
		});
		return { ok: true, rows: [{ label: 'Valore del logaritmo', value: rationalValue(`${log} = `, y, DIGITS) }], copy: rationalText(y), steps };
	}
	const v = lnOf(a.val) / lnOf(b.val);
	const at = argTex(a.node);
	const steps: Step[] = [
		{
			say: `Prova a scrivere base e argomento come potenze dello stesso numero.`,
			then: 'Non si può: il logaritmo non è una frazione, e ne calcoli il valore decimale.'
		}
	];
	if (pequal(b.val, E)) {
		steps.push({ say: 'Calcola il logaritmo naturale con la calcolatrice, tasto ln.', math: [`${lnLine(a.val, at)}`.replace(/^\\ln (.*) \\approx (.*)$/, `\\ln $1 \\approx \\hl{$2}`)] });
	} else {
		const bt = argTex(b.node);
		steps.push({ say: 'Usa la formula del cambiamento di base, con il logaritmo naturale.', math: [`${log} = \\dfrac{\\ln ${at}}{\\ln ${bt}}`] });
		steps.push({ say: 'Calcola i due logaritmi con la calcolatrice, tasto ln.', math: [lnLine(a.val, at, 6), lnLine(b.val, bt, 6)] });
		const num = pequal(a.val, E) ? '1' : approx(lnOf(a.val), 6).tex;
		steps.push({ say: 'Dividi i due valori.', math: [`${log} \\approx \\dfrac{${num}}{${approx(lnOf(b.val), 6).tex}}`, `\\approx \\hl{${approx(v, DIGITS).tex}}`] });
	}
	return { ok: true, rows: [{ label: 'Valore del logaritmo', value: `$${log} \\approx ${approx(v, DIGITS).tex}$` }], copy: approx(v, DIGITS).text, steps };
}

/** The value of log_b a, exact when rational, for the tests and the other tools. */
export function logValue(baseInput: string, argInput: string): { exact: Rational | null; value: number } | null {
	try {
		const b = parseNumberNode(baseInput);
		const a = parseNumberNode(argInput);
		if (!a || !b || b.val.sign <= 0 || isOne(b.val) || a.val.sign <= 0) return null;
		const s = ratio(a.val, commonBase(b.val).w);
		return { exact: s ? s.div(commonBase(b.val).r) : null, value: lnOf(a.val) / lnOf(b.val) };
	} catch {
		return null;
	}
}

/**
 * The lines that isolate x in px + k = t, when t is not rational (a root, a power of e, a logarithm): "2x = √2 - 1",
 * "x = (√2 - 1)/2". Returns the lines and x written exactly.
 */
export function isolateX(p: Rational, k: Rational, rhs: string): { lines: string[]; exact: string } {
	const lines: string[] = [];
	const num = k.isZero() ? rhs : `${rhs} ${k.sign() > 0 ? '-' : '+'} ${k.abs().toLatex()}`;
	if (!k.isZero()) lines.push(`${coefX(p)} = ${num}`);
	let exact: string;
	if (p.isOne()) exact = num;
	else if (p.equals(q(-1))) exact = k.isZero() ? `-${rhs}` : `-\\left(${num}\\right)`;
	else if (p.isInteger()) exact = `${p.sign() < 0 ? '-' : ''}\\dfrac{${num}}{${p.abs().toLatex()}}`;
	else exact = `${ONE.div(p).toLatex()}\\left(${num}\\right)`;
	if (!p.isOne()) lines.push(`x = ${exact}`);
	return { lines, exact };
}

/** The steps, grouped by part when they are more than five (docs/strumenti.md, "Leggibilità", rule 6). */
export function groupSteps<P extends string>(steps: (Step & { part: P })[], names: Record<P, string>): Step[] {
	const grouped = steps.length > 5;
	return steps.map(({ part, ...step }, i) => (grouped && (i === 0 || steps[i - 1].part !== part) ? { group: names[part], ...step } : step));
}

/** Finds the bracket that closes the one at `open`, or -1. */
export function matchBracket(s: string, open: number): number {
	let depth = 0;
	for (let i = open; i < s.length; i++) {
		if ('([{'.includes(s[i])) depth++;
		else if (')]}'.includes(s[i])) {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
}

/** The two sides of an equation, or an error. */
export function splitEquation(input: string, example: string): [string, string] | string {
	const s = normalize(input).trim();
	if (!s) return `Scrivi un'equazione, per esempio ${example}.`;
	if (s.length > 200) return "L'equazione è troppo lunga: al massimo 200 caratteri.";
	const parts = s.split('=');
	if (parts.length === 1) return `Manca il segno =: scrivi un'equazione, per esempio ${example}.`;
	if (parts.length > 2) return `C'è più di un segno =: scrivi un solo =, per esempio ${example}.`;
	const [l, r] = parts.map((p) => p.trim());
	if (!l || !r) return `Scrivi qualcosa prima e dopo il segno =, per esempio ${example}.`;
	return [l, r];
}
