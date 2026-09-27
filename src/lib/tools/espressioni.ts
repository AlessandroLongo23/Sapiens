import { Rational, lcm, q } from '@/lib/exercises/v2/rational';
import { decimalLatex, toDecimal } from '@/lib/exercises/v2/razionali';
import { fail, type Outcome, type Step } from './types';
import { decimalTex, intTex } from './numbers';

/**
 * The expression calculator: a numeric expression typed as text (integers, decimals with a comma, fractions a/b,
 * + - × : and /, powers with ^, round, square and curly brackets), calculated exactly with the steps of the lessons:
 * the innermost brackets first, then powers, then multiplications and divisions from left to right, then additions
 * and subtractions. Every step shows the expression that remains, typeset with fractions as \dfrac.
 */

export type Op = '+' | '-' | '*' | ':';

export type Node = (
	/** A number. `src` is how it was typed when that differs from its value: "0{,}5", "\dfrac{4}{6}". */
	| { t: 'n'; v: Rational; src?: string }
	| { t: 'neg'; x: Node }
	| { t: 'op'; op: Op; l: Node; r: Node }
	| { t: 'pow'; b: Node; e: number }
	/** A bracket as typed: 0 round, 1 square, 2 curly. */
	| { t: 'g'; k: 0 | 1 | 2; c: Node }
) & {
	/** Written inside `\hl{…}`: the part a step works on, or its result. */
	hl?: boolean;
};

export const MAX_CHARS = 200;
export const MAX_OPS = 40;
const MAX_EXP = 99;
const MAX_DIGITS = 12;

class ExprError extends Error {}

const leaf = (v: Rational): Node => ({ t: 'n', v });

// ---------------------------------------------------------------------------
// Reading

type Tok =
	| { k: 'num'; text: string; int: string; frac: string; ch: string }
	| { k: 'op'; op: '+' | '-' | '*' | ':' | '/'; ch: string }
	| { k: 'pow'; ch: string }
	| { k: 'open'; b: 0 | 1 | 2; ch: string }
	| { k: 'close'; b: 0 | 1 | 2; ch: string };

const OPENS = '([{';
const CLOSES = ')]}';
const OP_CHARS: Record<string, '+' | '-' | '*' | ':' | '/'> = {
	'+': '+',
	'-': '-',
	'−': '-',
	'–': '-',
	'*': '*',
	x: '*',
	X: '*',
	'×': '*',
	'·': '*',
	'⋅': '*',
	'•': '*',
	':': ':',
	'÷': ':',
	'/': '/'
};
const SUPERSCRIPTS: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };

function tokenize(s: string): Tok[] {
	const out: Tok[] = [];
	let i = 0;
	while (i < s.length) {
		const c = s[i];
		if (/\s/.test(c)) {
			i++;
			continue;
		}
		const num = /^(\d+)(?:[.,](\d+))?/.exec(s.slice(i));
		if (num) {
			const [text, int, frac = ''] = num;
			if (/^[.,]\d/.test(s.slice(i + text.length))) throw new ExprError(`Il numero "${s.slice(i).match(/^[\d.,]+/)?.[0]}" non è scritto bene: per i decimali usa una virgola sola, come in 12,5.`);
			if (int.length + frac.length > MAX_DIGITS) throw new ExprError(`Il numero ${text} è troppo lungo: usa al massimo ${MAX_DIGITS} cifre, come in 3,14159.`);
			out.push({ k: 'num', text, int, frac, ch: text });
			i += text.length;
			continue;
		}
		if (c in SUPERSCRIPTS) {
			let digits = '';
			while (i < s.length && s[i] in SUPERSCRIPTS) digits += SUPERSCRIPTS[s[i++]];
			out.push({ k: 'pow', ch: '^' }, { k: 'num', text: digits, int: digits, frac: '', ch: digits });
			continue;
		}
		if (c in OP_CHARS) out.push({ k: 'op', op: OP_CHARS[c], ch: c });
		else if (c === '^') out.push({ k: 'pow', ch: c });
		else if (OPENS.includes(c)) out.push({ k: 'open', b: OPENS.indexOf(c) as 0 | 1 | 2, ch: c });
		else if (CLOSES.includes(c)) out.push({ k: 'close', b: CLOSES.indexOf(c) as 0 | 1 | 2, ch: c });
		else if (c === ',' || c === '.') throw new ExprError(`C'è una virgola fuori posto: i decimali si scrivono con una cifra prima della virgola, come 0,5.`);
		else if (/\p{L}/u.test(c)) throw new ExprError(`Le lettere non si possono usare ("${c}"): scrivi solo numeri, operazioni e parentesi. Per moltiplicare usa * oppure x, come in 2 x 3.`);
		else throw new ExprError(`Il simbolo "${c}" non si può usare: scrivi solo numeri, + - * : / ^ e le parentesi ( ) [ ] { }, come in 2 * (3 + 1).`);
		i++;
	}
	return out;
}

/** A correct use of each kind of bracket, for the error messages. */
const EXAMPLE = ['(2 + 3) * 4', '[8 - (2 + 3)] : 3', '{[1 + 2] * 3}^2'];

/** Brackets that do not match, said in words before parsing. */
function checkBrackets(toks: Tok[]) {
	const stack: Tok[] = [];
	for (const t of toks) {
		if (t.k === 'open') stack.push(t);
		else if (t.k === 'close') {
			const top = stack.pop();
			if (!top) throw new ExprError(`C'è una parentesi "${t.ch}" chiusa che non era stata aperta: toglila, oppure aprila prima, come in ${EXAMPLE[t.b]}.`);
			if (top.k === 'open' && top.b !== t.b) throw new ExprError(`La parentesi "${top.ch}" è chiusa con "${t.ch}": chiudila con "${CLOSES[top.b]}", come in ${EXAMPLE[top.b]}.`);
		}
	}
	if (stack.length) {
		const t = stack[stack.length - 1] as Extract<Tok, { k: 'open' }>;
		throw new ExprError(`Hai aperto una parentesi "${t.ch}" senza chiuderla: manca "${CLOSES[t.b]}", come in ${EXAMPLE[t.b]}.`);
	}
}

const OP_NAME: Record<string, string> = { '+': '+', '-': '−', '*': '×', ':': ':', '/': '/' };

function parseTokens(toks: Tok[]): Node {
	let i = 0;
	const peek = () => toks[i];

	const numValue = (t: Extract<Tok, { k: 'num' }>): Node => {
		const v = q(Number(t.int + t.frac), 10 ** t.frac.length);
		return t.frac ? { t: 'n', v, src: `${t.int}{,}${t.frac}` } : { t: 'n', v };
	};

	const expr = (): Node => {
		let x = term();
		for (let t = peek(); t && t.k === 'op' && (t.op === '+' || t.op === '-'); t = peek()) {
			i++;
			x = { t: 'op', op: t.op, l: x, r: term() };
		}
		return x;
	};

	const term = (): Node => {
		let x = unary();
		for (;;) {
			const t = peek();
			if (t && t.k === 'op' && (t.op === '*' || t.op === ':' || t.op === '/')) {
				i++;
				x = { t: 'op', op: t.op === '*' ? '*' : ':', l: x, r: unary() };
			} else if (t && t.k === 'open') {
				// 2(3 + 1), (1 + 2)(3 + 4): a product without the sign
				x = { t: 'op', op: '*', l: x, r: unary() };
			} else if (t && t.k === 'num') {
				const prev = toks[i - 1];
				if (prev.k === 'close') x = { t: 'op', op: '*', l: x, r: unary() };
				else throw new ExprError(`Tra ${prev.ch} e ${t.ch} manca un'operazione: scrivi per esempio ${prev.ch} + ${t.ch} oppure ${prev.ch} * ${t.ch}.`);
			} else return x;
		}
	};

	const unary = (): Node => {
		const t = peek();
		if (t && t.k === 'op' && (t.op === '-' || t.op === '+')) {
			i++;
			const x = unary();
			return t.op === '-' ? { t: 'neg', x } : x;
		}
		return power();
	};

	const exponent = (): number => {
		const bad = () => new ExprError(`L'esponente deve essere un numero intero, come in 2^3 o 2^-1.`);
		let paren = false;
		if (peek()?.k === 'open') {
			if ((peek() as Extract<Tok, { k: 'open' }>).b !== 0) throw bad();
			paren = true;
			i++;
		}
		let sign = 1;
		const s = peek();
		if (s && s.k === 'op' && (s.op === '-' || s.op === '+')) {
			if (s.op === '-') sign = -1;
			i++;
		}
		const n = peek();
		if (!n || n.k !== 'num' || n.frac) throw bad();
		i++;
		if (paren) {
			const c = peek();
			if (!c || c.k !== 'close') throw bad();
			i++;
		}
		const e = sign * Number(n.int);
		if (Math.abs(e) > MAX_EXP) throw new ExprError(`Usa esponenti tra -${MAX_EXP} e ${MAX_EXP}, come in 2^10.`);
		return e;
	};

	const power = (): Node => {
		const b = primary();
		if (peek()?.k !== 'pow') return b;
		i++;
		const e = exponent();
		if (peek()?.k === 'pow') throw new ExprError('Per una potenza di potenza usa le parentesi, come in (2^3)^2.');
		return { t: 'pow', b, e };
	};

	const primary = (): Node => {
		const t = peek();
		if (!t) throw new ExprError(toks.length ? "L'espressione è incompleta: alla fine manca un numero, come in 2 + 3." : "Scrivi un'espressione, per esempio 2 + 3 · (4 - 1).");
		if (t.k === 'num') {
			i++;
			// a/b between two whole numbers is a fraction, a number of its own; not when a power follows, as in 2/3^2.
			const slash = toks[i], den = toks[i + 1], after = toks[i + 2];
			if (!t.frac && slash?.k === 'op' && slash.op === '/' && den?.k === 'num' && !den.frac && after?.k !== 'pow') {
				i += 2;
				const d = Number(den.int);
				if (d === 0) throw new ExprError(`La frazione ${t.int}/${den.int} ha denominatore 0: non si può dividere per zero. Scrivi un altro denominatore, come in ${t.int}/2.`);
				return { t: 'n', v: q(Number(t.int), d), src: `\\dfrac{${intTex(Number(t.int))}}{${intTex(d)}}` };
			}
			return numValue(t);
		}
		if (t.k === 'open') {
			i++;
			if (peek()?.k === 'close') throw new ExprError('Ci sono delle parentesi vuote: scrivi qualcosa dentro, come in (2 + 3), oppure toglile.');
			const c = expr();
			const close = peek();
			if (!close || close.k !== 'close') throw new ExprError(`Dentro le parentesi manca un'operazione prima di "${close?.ch ?? ''}": scrivila, come in (2 + 3) * 4.`);
			i++;
			return { t: 'g', k: t.b, c };
		}
		if (t.k === 'close') throw new ExprError(`Manca un numero prima della parentesi "${t.ch}": scrivilo, come in (2 + 3).`);
		if (t.k === 'pow') throw new ExprError('Manca la base della potenza prima di "^": scrivila, come in 2^3.');
		throw new ExprError(i === 0 ? `L'espressione non può cominciare con "${OP_NAME[t.op]}": comincia con un numero o una parentesi, come in 2 * 3.` : `Dopo "${toks[i - 1].ch}" manca un numero: scrivilo, come in ${toks[i - 1].k === 'op' ? `2 ${toks[i - 1].ch} 3` : '(2 + 3)'}.`);
	};

	const x = expr();
	if (i < toks.length) {
		const t = toks[i];
		throw new ExprError(t.k === 'pow' ? 'Per una potenza di potenza usa le parentesi, come in (2^3)^2.' : `Non capisco "${t.ch}" in questo punto: controlla l'espressione, per esempio 2 + 3 * (4 - 1).`);
	}
	return x;
}

function countOps(x: Node): number {
	switch (x.t) {
		case 'n':
			return 0;
		case 'neg':
			return countOps(x.x);
		case 'op':
			return 1 + countOps(x.l) + countOps(x.r);
		case 'pow':
			return 1 + countOps(x.b);
		case 'g':
			return countOps(x.c);
	}
}

export type Parsed = { ok: true; node: Node } | { ok: false; error: string };

/** The input as a tree, or what is wrong with it in words. */
export function parseExpression(input: string): Parsed {
	const s = input.trim();
	if (!s) return { ok: false, error: "Scrivi un'espressione, per esempio 2 + 3 · (4 - 1)." };
	if (s.length > MAX_CHARS) return { ok: false, error: `L'espressione è troppo lunga: al massimo ${MAX_CHARS} caratteri. Calcolane un pezzo alla volta, per esempio prima le parentesi.` };
	try {
		const toks = tokenize(s);
		checkBrackets(toks);
		const node = parseTokens(toks);
		if (countOps(node) > MAX_OPS) return { ok: false, error: `Al massimo ${MAX_OPS} operazioni in un'espressione: calcolane un pezzo alla volta, per esempio prima le parentesi.` };
		return { ok: true, node };
	} catch (e) {
		if (e instanceof ExprError) return { ok: false, error: e.message };
		throw e;
	}
}

// ---------------------------------------------------------------------------
// LaTeX

const OPEN_TEX = ['\\left(', '\\left[', '\\left\\{'];
const CLOSE_TEX = ['\\right)', '\\right]', '\\right\\}'];
const OP_TEX: Record<Op, string> = { '+': '+', '-': '-', '*': '\\cdot', ':': ':' };

/** A number standing alone: "3", "-\dfrac{2}{3}". */
export function numTex(v: Rational): string {
	if (v.isInteger()) return intTex(v.num);
	return `${v.num < 0 ? '-' : ''}\\dfrac{${intTex(Math.abs(v.num))}}{${intTex(v.den)}}`;
}

const wrap = (s: string) => `\\left(${s}\\right)`;

/**
 * The tree as it is written. `lead` is true where a minus sign can stand without brackets: at the start of the
 * expression or of a bracket. Elsewhere a negative number takes round brackets: 2 \cdot (-3).
 */
export function latex(x: Node, lead = true): string {
	const s = body(x, lead);
	return x.hl ? `\\hl{${s}}` : s;
}

function body(x: Node, lead: boolean): string {
	switch (x.t) {
		case 'n': {
			const s = x.src ?? numTex(x.v);
			return x.v.sign() < 0 && !lead ? (x.v.isInteger() ? `(${s})` : wrap(s)) : s;
		}
		case 'neg': {
			const s = `-${latex(x.x, false)}`;
			if (lead) return s;
			return x.x.t === 'n' && x.x.v.isInteger() && !x.x.src ? `(${s})` : wrap(s);
		}
		case 'op':
			return `${latex(x.l, lead)} ${OP_TEX[x.op]} ${latex(x.r, false)}`;
		case 'pow': {
			const n = x.b;
			const bare = n.t === 'n' && (n.v.sign() < 0 || !n.v.isInteger() || n.src) ? (n.v.isInteger() && !n.src ? `(${numTex(n.v)})` : wrap(n.src ?? numTex(n.v))) : null;
			const b = bare === null ? latex(n, false) : n.hl ? `\\hl{${bare}}` : bare;
			return `${b}^{${x.e}}`;
		}
		case 'g':
			return `${OPEN_TEX[x.k]}${latex(x.c)}${CLOSE_TEX[x.k]}`;
	}
}

/** LaTeX of the input as the student typed it, for the preview under the field; null when it does not parse. */
export function expressionPreview(input: string): string | null {
	const p = parseExpression(input);
	return p.ok ? latex(p.node) : null;
}

// ---------------------------------------------------------------------------
// Evaluation

function power(b: Rational, e: number): Rational {
	if (b.isZero() && e === 0) throw new ExprError("Nell'espressione compare 0^0, che non ha significato: cambia la base o l'esponente, per esempio 2^0 = 1.");
	if (b.isZero() && e < 0) throw new ExprError("Nell'espressione c'è 0 elevato a un esponente negativo: vorrebbe dire dividere per zero. Cambia la base, per esempio 2^-1.");
	const base = e < 0 ? q(1).div(b) : b;
	let out = q(1);
	for (let k = 0; k < Math.abs(e); k++) out = out.mul(base);
	return out;
}

export function evaluate(x: Node): Rational {
	switch (x.t) {
		case 'n':
			return x.v;
		case 'neg':
			return evaluate(x.x).neg();
		case 'g':
			return evaluate(x.c);
		case 'pow':
			return power(evaluate(x.b), x.e);
		case 'op': {
			const a = evaluate(x.l), b = evaluate(x.r);
			switch (x.op) {
				case '+':
					return a.add(b);
				case '-':
					return a.sub(b);
				case '*':
					return a.mul(b);
				case ':':
					if (b.isZero()) throw new ExprError("Nell'espressione c'è una divisione per zero: un divisore vale 0, e per zero non si può dividere. Controlla i divisori, per esempio 6 : 2.");
					return a.div(b);
			}
		}
	}
}

// ---------------------------------------------------------------------------
// Steps
//
// Each step is one stage of one part: the powers, the divisions turned into products by the reciprocal, the products
// and quotients, the sums, first inside the innermost bracket (round before square before curly, left to right),
// then outside. Its lines are the whole expression, before and after, with the part it works on and its result
// inside \hl{…}; a long stage has a line for each intermediate result, starting with "=".

/** Tidies the tree the way it is written by hand: a bracket around a single number goes. */
const unwrap = (x: Node): Node => map(x, (y) => (y.t === 'g' && y.c.t === 'n' ? y.c : y));

/**
 * Tidies the tree after each step, the way it is written by hand: a bracket around a single number goes (it stays
 * visible only as the round brackets of a negative number), a minus in front of a number joins it, and the sign rule
 * turns + (-3) into - 3 and - (-3) into + 3. Highlights stay on the numbers they were on.
 */
function norm(x: Node): Node {
	switch (x.t) {
		case 'n':
			return x;
		case 'g': {
			const c = norm(x.c);
			return c.t === 'n' ? c : { ...x, c };
		}
		case 'neg': {
			const y = norm(x.x);
			return y.t === 'n' && !y.src ? { ...leaf(y.v.neg()), hl: y.hl || x.hl } : { ...x, x: y };
		}
		case 'pow':
			return { ...x, b: norm(x.b) };
		case 'op': {
			const l = norm(x.l), r = norm(x.r);
			if ((x.op === '+' || x.op === '-') && r.t === 'n' && !r.src && r.v.sign() < 0) return { ...x, op: x.op === '+' ? '-' : '+', l, r: { ...leaf(r.v.neg()), hl: r.hl } };
			return { ...x, l, r };
		}
	}
}

const has = (x: Node, pred: (y: Node) => boolean): boolean => {
	if (pred(x)) return true;
	switch (x.t) {
		case 'n':
			return false;
		case 'neg':
			return has(x.x, pred);
		case 'op':
			return has(x.l, pred) || has(x.r, pred);
		case 'pow':
			return has(x.b, pred);
		case 'g':
			return has(x.c, pred);
	}
};

/** Bottom-up map: children first, then `f` on the node. */
function map(x: Node, f: (y: Node) => Node): Node {
	switch (x.t) {
		case 'n':
			return f(x);
		case 'neg':
			return f({ ...x, x: map(x.x, f) });
		case 'op':
			return f({ ...x, l: map(x.l, f), r: map(x.r, f) });
		case 'pow':
			return f({ ...x, b: map(x.b, f) });
		case 'g':
			return f({ ...x, c: map(x.c, f) });
	}
}

/** Top-down map that stops where `f` returns a node. */
function replaceTop(x: Node, f: (y: Node) => Node | null): Node {
	const r = f(x);
	if (r) return r;
	switch (x.t) {
		case 'n':
			return x;
		case 'neg':
			return { ...x, x: replaceTop(x.x, f) };
		case 'op':
			return { ...x, l: replaceTop(x.l, f), r: replaceTop(x.r, f) };
		case 'pow':
			return { ...x, b: replaceTop(x.b, f) };
		case 'g':
			return { ...x, c: replaceTop(x.c, f) };
	}
}

/** The tree without highlights. */
const strip = (x: Node): Node => map(x, (y) => (y.hl ? { ...y, hl: undefined } : y));

const mark = (x: Node): Node => ({ ...x, hl: true });

const isMul = (y: Node): y is Extract<Node, { t: 'op' }> => y.t === 'op' && (y.op === '*' || y.op === ':');
const isSum = (y: Node): y is Extract<Node, { t: 'op' }> => y.t === 'op' && (y.op === '+' || y.op === '-');

/** The items of a chain of products and quotients, left-associated: a : b · c. */
function mulItems(x: Node): { op: Op | null; x: Node }[] {
	if (isMul(x)) return [...mulItems(x.l), { op: x.op, x: x.r }];
	return [{ op: null, x }];
}

/** The operators of every chain of `pred` in the tree. */
function chainOps(x: Node, pred: (y: Node) => boolean): Op[] {
	const out: Op[] = [];
	map(x, (y) => {
		if (pred(y)) out.push((y as Extract<Node, { t: 'op' }>).op);
		return y;
	});
	return out;
}

/** The first operation of a left-associated chain, where `f` is applied: the leftmost pair. */
function firstPair(y: Node, pred: (z: Node) => boolean, f: (z: Node) => Node): Node {
	if (y.t === 'op' && pred(y.l)) return { ...y, l: firstPair(y.l, pred, f) };
	return f(y);
}

/** A chain of products and quotients where fractions are divided: every division becomes a product by the reciprocal. */
function recipChain(y: Node): boolean {
	const items = mulItems(y);
	return items.some((it) => it.op === ':') && items.some((it) => it.x.t === 'n' && !it.x.v.isInteger()) && items.every((it) => it.x.t === 'n');
}

function recip(x: Node, after: boolean): Node {
	return replaceTop(x, (y) => {
		if (!isMul(y)) return null;
		if (!recipChain(y)) return y;
		const items = mulItems(y);
		return items.slice(1).reduce<Node>((acc, it) => {
			if (it.op !== ':') return { t: 'op', op: it.op ?? '*', l: acc, r: it.x };
			const v = (it.x as { v: Rational }).v;
			return { t: 'op', op: after ? '*' : ':', l: acc, r: after ? mark(leaf(q(1).div(v))) : mark(it.x) };
		}, items[0].x);
	});
}

/** The terms of a sum with their signs, as numbers. */
function sumValues(x: Node): Rational[] | null {
	if (isSum(x)) {
		const l = sumValues(x.l);
		if (!l || x.r.t !== 'n') return null;
		return [...l, x.op === '-' ? x.r.v.neg() : x.r.v];
	}
	return x.t === 'n' ? [x.v] : null;
}

/** "\dfrac{16 - 3 + 12}{12}": a sum of fractions over the common denominator (the mcm of the denominators). */
function commonDenominator(x: Node): { tex: string; m: number; differ: boolean } | null {
	const vals = sumValues(x);
	if (!vals || vals.length < 2) return null;
	const m = vals.reduce((acc, v) => lcm(acc, v.den), 1);
	if (m === 1) return null;
	const nums = vals.map((v) => v.num * (m / v.den));
	const top = nums.map((k, i) => (i === 0 ? intTex(k) : k < 0 ? ` - ${intTex(-k)}` : ` + ${intTex(k)}`)).join('');
	return { tex: `\\dfrac{${top}}{${intTex(m)}}`, m, differ: new Set(vals.map((v) => v.den)).size > 1 };
}

type Stage = 'pow' | 'recip' | 'mul' | 'sum';

const STAGE_GROUP: Record<Stage, string> = { pow: 'Potenze', recip: 'Moltiplicazioni e divisioni', mul: 'Moltiplicazioni e divisioni', sum: 'Addizioni e sottrazioni' };

/** "la divisione", "le moltiplicazioni e le divisioni": the operations of a stage, in words. */
function opsWords(ops: Op[], one: [string, string], two: [string, string]): string {
	const a = ops.filter((o) => o === '+' || o === '*').length, b = ops.length - a;
	if (!b) return a === 1 ? one[0] : one[1];
	if (!a) return b === 1 ? two[0] : two[1];
	return `${one[1]} e ${two[1]}`;
}

interface Worked {
	stage: Stage;
	/** The part, stage by stage: the first with what is worked on highlighted, the others with what changed. */
	forms: Node[];
	/** What to do, lower case, without the full stop: "esegui la divisione". */
	what: string;
	/** How, when it helps: "usa il denominatore comune $6$". */
	how?: string;
	then?: string;
}

function work(x: Node): Worked {
	if (has(x, (y) => y.t === 'pow')) {
		const pows: number[] = [];
		map(x, (y) => {
			if (y.t === 'pow') pows.push(y.e);
			return y;
		});
		return {
			stage: 'pow',
			forms: [map(x, (y) => (y.t === 'pow' ? mark(y) : y)), map(x, (y) => (y.t === 'pow' ? mark(leaf(evaluate(y))) : y))],
			what: pows.length === 1 ? 'calcola la potenza' : 'calcola le potenze',
			then: pows.some((e) => e < 0) ? 'Un esponente negativo vuol dire: il reciproco della base, con l’esponente positivo.' : pows.some((e) => e === 0) ? 'Ogni numero diverso da zero elevato a $0$ dà $1$.' : undefined
		};
	}
	if (has(x, (y) => isMul(y) && recipChain(y))) {
		const n = chainOps(recip(x, false), isMul).filter((o) => o === ':').length;
		return {
			stage: 'recip',
			forms: [recip(x, false), recip(x, true)],
			what: n === 1 ? 'trasforma la divisione in una moltiplicazione per il reciproco' : 'trasforma le divisioni in moltiplicazioni per il reciproco',
			then: 'Il reciproco di una frazione si ottiene scambiando numeratore e denominatore.'
		};
	}
	if (has(x, isMul)) return { stage: 'mul', ...passes(x, isMul), what: `esegui ${opsWords(chainOps(x, isMul), ['la moltiplicazione', 'le moltiplicazioni'], ['la divisione', 'le divisioni'])}` };
	const words = `esegui ${opsWords(chainOps(x, isSum), ['l’addizione', 'le addizioni'], ['la sottrazione', 'le sottrazioni'])}`;
	const cd = commonDenominator(x);
	if (!cd) return { stage: 'sum', ...passes(x, isSum), what: words };
	const value = evaluate(x);
	return {
		stage: 'sum',
		forms: [mark(x), { t: 'n', v: value, src: cd.tex, hl: true }, mark(leaf(value))],
		what: words,
		how: `usa il denominatore comune $${intTex(cd.m)}$`,
		then: cd.differ ? `$${intTex(cd.m)}$ è il mcm dei denominatori.` : undefined
	};
}

/** Chains computed from left to right, one pair of each chain at a time: a line for each round. */
function passes(x: Node, pred: (y: Node) => boolean): { forms: Node[]; then?: string } {
	const top = (f: (z: Node) => Node) => (cur: Node) => replaceTop(cur, (y) => (pred(y) ? firstPair(y, pred, f) : null));
	const forms = [top(mark)(x)];
	let long = false;
	for (let cur = x; has(cur, pred); ) {
		cur = top((z) => mark(leaf(evaluate(z))))(strip(cur));
		forms.push(cur);
		if (has(cur, pred)) long = true;
	}
	return { forms, then: long ? 'Si va da sinistra a destra, un’operazione alla volta.' : undefined };
}

const KIND = [
	['tonda', 'tonde'],
	['quadra', 'quadre'],
	['graffa', 'graffe']
];

/** The bracket to work on: one with no bracket inside, round before square before curly, then from the left. */
function nextBracket(x: Node): Extract<Node, { t: 'g' }> | null {
	const out: Extract<Node, { t: 'g' }>[] = [];
	const rec = (y: Node) => {
		if (y.t === 'g' && !has(y.c, (z) => z.t === 'g')) out.push(y);
		else if (y.t === 'neg') rec(y.x);
		else if (y.t === 'op') {
			rec(y.l);
			rec(y.r);
		} else if (y.t === 'pow') rec(y.b);
		else if (y.t === 'g') rec(y.c);
	};
	rec(x);
	return out.reduce<Extract<Node, { t: 'g' }> | null>((best, g) => (!best || g.k < best.k ? g : best), null);
}

/** Two forms that differ only in highlights or in the size of their brackets are the same to the reader. */
const same = (a: Node, b: Node) => latex(strip(a)).replace(/\\(left|right)/g, '') === latex(strip(b)).replace(/\\(left|right)/g, '');

const SIGNS = 'Regola dei segni: più per meno dà meno, meno per meno dà più.';

interface Draft {
	say: string;
	/** The sentence under a group heading, where the heading already names the bracket. */
	short: string;
	math: string[];
	table?: Step['table'];
	then?: string;
	group: string;
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** The first step: decimals and fractions not in lowest terms rewritten, brackets around single numbers taken away. */
function prepare(root: Node, drafts: Draft[]): Node {
	const rewritten = (y: Node) => y.t === 'n' && !!y.src && numTex(y.v) !== y.src;
	const decimals = has(root, (y) => y.t === 'n' && !!y.src && y.src.includes('{,}'));
	const fractions = has(root, (y) => rewritten(y) && y.t === 'n' && !!y.src?.includes('frac'));
	if (has(root, rewritten)) {
		const rows: string[][] = [];
		map(root, (y) => {
			if (y.t !== 'n' || !y.src || !rewritten(y)) return y;
			const m = /^(\d+)\{,\}(\d+)$/.exec(y.src);
			const tenths = m ? `\\dfrac{${intTex(Number(m[1] + m[2]))}}{${intTex(10 ** m[2].length)}}` : '';
			rows.push([`$${y.src}$`, `$${tenths && tenths !== numTex(y.v) ? `${tenths} = ` : ''}${numTex(y.v)}$`]);
			return y;
		});
		const before = map(root, (y) => (rewritten(y) ? mark(y) : y));
		const after = map(root, (y) => (y.t === 'n' && y.src ? (rewritten(y) ? mark(leaf(y.v)) : leaf(y.v)) : y));
		const math = [latex(before), `= ${latex(after)}`];
		const tidy = norm(after);
		if (!same(tidy, after)) math.push(`= ${latex(tidy)}`);
		const say = decimals && fractions ? 'Scrivi i decimali come frazioni e riduci le frazioni ai minimi termini.' : decimals ? 'Scrivi i decimali come frazioni ridotte ai minimi termini.' : 'Riduci le frazioni ai minimi termini.';
		drafts.push({ say, short: say, math, table: { head: ['Numero', 'Come frazione'], rows }, group: 'Prima di cominciare' });
		return strip(tidy);
	}
	const plain = map(root, (y) => (y.t === 'n' && y.src ? leaf(y.v) : y));
	const tidy = norm(plain);
	if (!same(tidy, plain)) {
		const say = 'Togli le parentesi attorno ai numeri soli e applica la regola dei segni.';
		drafts.push({ say, short: say, math: [latex(plain), `= ${latex(tidy)}`], then: SIGNS, group: 'Prima di cominciare' });
	}
	return tidy;
}

function buildSteps(root: Node): Step[] {
	const drafts: Draft[] = [];
	let tree = prepare(root, drafts);
	let started = false;

	for (let guard = 0; guard < 400 && tree.t !== 'n'; guard++) {
		const g = nextBracket(tree);
		const w = work(g ? g.c : tree);
		const last = w.forms[w.forms.length - 1];
		const completes = !!g && last.t === 'n';
		// Each form of the part set back into the whole expression. When the stage closes the bracket, the first line
		// highlights the whole bracket, and the last has the number in its place.
		const whole = (form: Node, i: number): Node => {
			if (!g) return i === 0 && form.hl ? { ...form, hl: undefined } : form;
			const inner = i === 0 && completes ? mark({ ...g, c: strip(form) }) : { ...g, c: form };
			return unwrap(replaceTop(tree, (y) => (y === g ? inner : null)));
		};
		const lines = w.forms.map(whole);
		const math = lines.map((l, i) => (i === 0 ? latex(l) : `= ${latex(l)}`));
		const tidy = norm(lines[lines.length - 1]);
		let then = w.then;
		const how = w.how ? `: ${w.how}` : '';
		if (!same(tidy, lines[lines.length - 1])) {
			math.push(`= ${latex(tidy)}`);
			then = then ? `${then} ${SIGNS}` : SIGNS;
		}
		if (g) {
			const name = `parentesi ${KIND[g.k][0]}`;
			const single = completes && !started;
			drafts.push({
				say: single ? `Calcola la ${name}${how}.` : `Nella ${name}, ${w.what}${how}.`,
				short: single ? `Calcola la ${name}${how}.` : `${cap(w.what)}${how}.`,
				math,
				then,
				group: `Parentesi ${KIND[g.k][1]}`
			});
			started = !completes;
		} else {
			drafts.push({ say: `${cap(w.what)}${how}.`, short: `${cap(w.what)}${how}.`, math, then, group: STAGE_GROUP[w.stage] });
		}
		tree = strip(tidy);
	}

	const grouped = drafts.length > 5;
	return drafts.map((d, i) => ({
		say: grouped ? d.short : d.say,
		math: d.math,
		...(d.table ? { table: d.table } : {}),
		...(d.then ? { then: d.then } : {}),
		...(grouped && (i === 0 || drafts[i - 1].group !== d.group) ? { group: d.group } : {})
	}));
}

/** A rational as a decimal: "1{,}1\overline{6}", or "\approx 0{,}1235" when the period is too long. */
function decimalValue(r: Rational): string {
	const d = toDecimal(r, 6, 6);
	return d ? decimalLatex(d) : decimalTex(r, 4);
}

export function espressione(input: string): Outcome {
	const p = parseExpression(input);
	if (!p.ok) return fail(p.error);
	try {
		const value = evaluate(p.node);
		const steps = buildSteps(p.node);
		if (!steps.length) steps.push({ say: 'L’espressione è già un numero: non c’è niente da calcolare.' });
		const rows = [{ label: 'Risultato', value: `$${numTex(value)}$` }];
		if (!value.isInteger()) rows.push({ label: 'In decimali', value: `$${decimalValue(value)}$` });
		return { ok: true, rows, copy: value.toString(), steps };
	} catch (e) {
		if (e instanceof ExprError) return fail(e.message);
		return fail('I numeri diventano troppo grandi per questo calcolatore: prova con numeri o esponenti più piccoli, per esempio 2^10.');
	}
}
