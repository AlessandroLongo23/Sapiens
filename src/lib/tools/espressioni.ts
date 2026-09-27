import { Rational, lcm, q } from '@/lib/exercises/v2/rational';
import { decimalLatex, toDecimal } from '@/lib/exercises/v2/razionali';
import { fail, type Outcome } from './types';
import { decimalTex, intTex } from './numbers';

/**
 * The expression calculator: a numeric expression typed as text (integers, decimals with a comma, fractions a/b,
 * + - × : and /, powers with ^, round, square and curly brackets), calculated exactly with the steps of the lessons:
 * the innermost brackets first, then powers, then multiplications and divisions from left to right, then additions
 * and subtractions. Every step shows the expression that remains, typeset with fractions as \dfrac.
 */

export type Op = '+' | '-' | '*' | ':';

export type Node =
	/** A number. `src` is how it was typed when that differs from its value: "0{,}5", "\dfrac{4}{6}". */
	| { t: 'n'; v: Rational; src?: string }
	| { t: 'neg'; x: Node }
	| { t: 'op'; op: Op; l: Node; r: Node }
	| { t: 'pow'; b: Node; e: number }
	/** A bracket as typed: 0 round, 1 square, 2 curly. */
	| { t: 'g'; k: 0 | 1 | 2; c: Node };

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
			if (int.length + frac.length > MAX_DIGITS) throw new ExprError(`Il numero ${text} è troppo lungo: al massimo ${MAX_DIGITS} cifre.`);
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
		else if (/\p{L}/u.test(c)) throw new ExprError(`Le lettere non si possono usare ("${c}"): scrivi solo numeri, operazioni e parentesi. Per moltiplicare usa * oppure x.`);
		else throw new ExprError(`Il simbolo "${c}" non si può usare: scrivi solo numeri, + - * : / ^ e le parentesi ( ) [ ] { }.`);
		i++;
	}
	return out;
}

/** Brackets that do not match, said in words before parsing. */
function checkBrackets(toks: Tok[]) {
	const stack: Tok[] = [];
	for (const t of toks) {
		if (t.k === 'open') stack.push(t);
		else if (t.k === 'close') {
			const top = stack.pop();
			if (!top) throw new ExprError(`C'è una parentesi "${t.ch}" chiusa che non era stata aperta.`);
			if (top.k === 'open' && top.b !== t.b) throw new ExprError(`La parentesi "${top.ch}" è chiusa con "${t.ch}": chiudila con "${CLOSES[top.b]}".`);
		}
	}
	if (stack.length) {
		const t = stack[stack.length - 1] as Extract<Tok, { k: 'open' }>;
		throw new ExprError(`Hai aperto una parentesi "${t.ch}" senza chiuderla: manca "${CLOSES[t.b]}".`);
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
				else throw new ExprError(`Tra ${prev.ch} e ${t.ch} manca un'operazione.`);
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
		if (Math.abs(e) > MAX_EXP) throw new ExprError(`Usa esponenti tra -${MAX_EXP} e ${MAX_EXP}.`);
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
		if (!t) throw new ExprError(toks.length ? "L'espressione è incompleta: alla fine manca un numero." : "Scrivi un'espressione.");
		if (t.k === 'num') {
			i++;
			// a/b between two whole numbers is a fraction, a number of its own; not when a power follows, as in 2/3^2.
			const slash = toks[i], den = toks[i + 1], after = toks[i + 2];
			if (!t.frac && slash?.k === 'op' && slash.op === '/' && den?.k === 'num' && !den.frac && after?.k !== 'pow') {
				i += 2;
				const d = Number(den.int);
				if (d === 0) throw new ExprError(`La frazione ${t.int}/${den.int} ha denominatore 0: non si può dividere per zero.`);
				return { t: 'n', v: q(Number(t.int), d), src: `\\dfrac{${intTex(Number(t.int))}}{${intTex(d)}}` };
			}
			return numValue(t);
		}
		if (t.k === 'open') {
			i++;
			if (peek()?.k === 'close') throw new ExprError('Ci sono delle parentesi vuote: scrivi qualcosa dentro, o toglile.');
			const c = expr();
			const close = peek();
			if (!close || close.k !== 'close') throw new ExprError(`Dentro le parentesi manca un'operazione prima di "${close?.ch ?? ''}".`);
			i++;
			return { t: 'g', k: t.b, c };
		}
		if (t.k === 'close') throw new ExprError(`Manca un numero prima della parentesi "${t.ch}".`);
		if (t.k === 'pow') throw new ExprError('Manca la base della potenza prima di "^".');
		throw new ExprError(i === 0 ? `L'espressione non può cominciare con "${OP_NAME[t.op]}".` : `Dopo "${toks[i - 1].ch}" manca un numero.`);
	};

	const x = expr();
	if (i < toks.length) {
		const t = toks[i];
		throw new ExprError(t.k === 'pow' ? 'Per una potenza di potenza usa le parentesi, come in (2^3)^2.' : `Non capisco "${t.ch}" in questo punto.`);
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
	if (s.length > MAX_CHARS) return { ok: false, error: `L'espressione è troppo lunga: al massimo ${MAX_CHARS} caratteri.` };
	try {
		const toks = tokenize(s);
		checkBrackets(toks);
		const node = parseTokens(toks);
		if (countOps(node) > MAX_OPS) return { ok: false, error: `Al massimo ${MAX_OPS} operazioni in un'espressione.` };
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
			const b = x.b.t === 'n' && (x.b.v.sign() < 0 || !x.b.v.isInteger() || x.b.src) ? (x.b.v.isInteger() && !x.b.src ? `(${numTex(x.b.v)})` : wrap(x.b.src ?? numTex(x.b.v))) : latex(x.b, false);
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
	if (b.isZero() && e === 0) throw new ExprError("Nell'espressione compare 0^0, che non ha significato.");
	if (b.isZero() && e < 0) throw new ExprError("Nell'espressione c'è 0 elevato a un esponente negativo: vorrebbe dire dividere per zero, che non si può fare.");
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
					if (b.isZero()) throw new ExprError("Nell'espressione c'è una divisione per zero: un divisore vale 0, e per zero non si può dividere.");
					return a.div(b);
			}
		}
	}
}

// ---------------------------------------------------------------------------
// Steps

/**
 * Tidies the tree after each step, the way it is written by hand: a bracket around a single number goes (it stays
 * visible only as the round brackets of a negative number), a minus in front of a number joins it, and the sign rule
 * turns + (-3) into - 3 and - (-3) into + 3.
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
			return y.t === 'n' && !y.src ? leaf(y.v.neg()) : { t: 'neg', x: y };
		}
		case 'pow':
			return { ...x, b: norm(x.b) };
		case 'op': {
			const l = norm(x.l), r = norm(x.r);
			if ((x.op === '+' || x.op === '-') && r.t === 'n' && !r.src && r.v.sign() < 0) return { t: 'op', op: x.op === '+' ? '-' : '+', l, r: leaf(r.v.neg()) };
			return { t: 'op', op: x.op, l, r };
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
			return f({ t: 'neg', x: map(x.x, f) });
		case 'op':
			return f({ t: 'op', op: x.op, l: map(x.l, f), r: map(x.r, f) });
		case 'pow':
			return f({ ...x, b: map(x.b, f) });
		case 'g':
			return f({ ...x, c: map(x.c, f) });
	}
}

const isMul = (y: Node) => y.t === 'op' && (y.op === '*' || y.op === ':');

/** The items of a chain of products and quotients, left-associated: a : b · c. */
function mulItems(x: Node): { op: Op | null; x: Node }[] {
	if (isMul(x)) {
		const o = x as Extract<Node, { t: 'op' }>;
		return [...mulItems(o.l), { op: o.op, x: o.r }];
	}
	return [{ op: null, x }];
}

/** Top-down map that stops where `f` returns a node. */
function replaceTop(x: Node, f: (y: Node) => Node | null): Node {
	const r = f(x);
	if (r) return r;
	switch (x.t) {
		case 'n':
			return x;
		case 'neg':
			return { t: 'neg', x: replaceTop(x.x, f) };
		case 'op':
			return { t: 'op', op: x.op, l: replaceTop(x.l, f), r: replaceTop(x.r, f) };
		case 'pow':
			return { ...x, b: replaceTop(x.b, f) };
		case 'g':
			return { ...x, c: replaceTop(x.c, f) };
	}
}

/** Powers of numbers, all at once. */
const powStage = (x: Node) => norm(map(x, (y) => (y.t === 'pow' && y.b.t === 'n' ? leaf(evaluate(y)) : y)));

/** In a chain with fractions, every division becomes a product by the reciprocal. */
function recipStage(x: Node): Node {
	return replaceTop(x, (y) => {
		if (!isMul(y)) return null;
		const items = mulItems(y);
		if (!items.some((it) => it.op === ':') || !items.some((it) => it.x.t === 'n' && !it.x.v.isInteger())) return y;
		if (!items.every((it) => it.x.t === 'n')) return y;
		return items.slice(1).reduce<Node>((acc, it) => ({ t: 'op', op: '*', l: acc, r: it.op === ':' ? leaf(q(1).div((it.x as { v: Rational }).v)) : it.x }), items[0].x);
	});
}

/** Every chain of products and quotients computed. */
const mulStage = (x: Node) => norm(replaceTop(x, (y) => (isMul(y) ? leaf(evaluate(y)) : null)));

/** The terms of a sum with their signs, as numbers. */
function sumValues(x: Node): Rational[] | null {
	if (x.t === 'op' && (x.op === '+' || x.op === '-')) {
		const l = sumValues(x.l);
		if (!l || x.r.t !== 'n') return null;
		return [...l, x.op === '-' ? x.r.v.neg() : x.r.v];
	}
	return x.t === 'n' ? [x.v] : null;
}

/** "\dfrac{16 - 3 + 12}{12}": a sum of fractions over the common denominator, when the denominators differ. */
function commonDenominator(x: Node): { tex: string; m: number } | null {
	const vals = sumValues(x);
	if (!vals || vals.length < 2) return null;
	const m = vals.reduce((acc, v) => lcm(acc, v.den), 1);
	if (m === 1 || new Set(vals.map((v) => v.den)).size === 1) return null;
	const nums = vals.map((v) => v.num * (m / v.den));
	const top = nums.map((k, i) => (i === 0 ? intTex(k) : k < 0 ? ` - ${intTex(-k)}` : ` + ${intTex(k)}`)).join('');
	return { tex: `\\dfrac{${top}}{${intTex(m)}}`, m };
}

/** The stages of a part without brackets, as LaTeX; consecutive equal forms are written once. */
function stages(x: Node): { label: 'pow' | 'mul' | 'sum'; forms: string[] }[] {
	const out: { label: 'pow' | 'mul' | 'sum'; forms: string[] }[] = [];
	let cur = x;
	if (has(cur, (y) => y.t === 'pow')) {
		cur = powStage(cur);
		out.push({ label: 'pow', forms: [latex(cur)] });
	}
	if (has(cur, isMul)) {
		const forms: string[] = [];
		const r = recipStage(cur);
		if (latex(r) !== latex(cur)) forms.push(latex(r));
		cur = mulStage(r);
		forms.push(latex(cur));
		out.push({ label: 'mul', forms });
	}
	if (cur.t !== 'n') {
		const forms: string[] = [];
		const cd = commonDenominator(cur);
		if (cd) forms.push(cd.tex);
		cur = leaf(evaluate(cur));
		forms.push(latex(cur));
		out.push({ label: 'sum', forms });
	}
	return out;
}

/** "2 + 3 \cdot 4 = 2 + 12 = 14": a part without brackets calculated in one line. */
function flatChain(x: Node): string {
	const forms = [latex(x), ...stages(x).flatMap((s) => s.forms)];
	return forms.filter((f, i) => f !== forms[i - 1]).join(' = ');
}

const KIND = [
	['tonda', 'tonde'],
	['quadra', 'quadre'],
	['graffa', 'graffe']
];

/** The brackets with no bracket inside and something to calculate. */
function innermost(x: Node): Extract<Node, { t: 'g' }>[] {
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
	return out;
}

/** Two forms that differ only in the size of their brackets are the same to the reader. */
const same = (a: string, b: string) => a.replace(/\\(left|right)/g, '') === b.replace(/\\(left|right)/g, '');

/** "; l'espressione diventa …", with the sign rule shown when it changes something. */
function becomes(raw: Node): { tree: Node; text: string } {
	const tree = norm(raw);
	if (tree.t === 'n' && raw.t === 'n') return { tree, text: '' };
	const a = latex(raw), b = latex(tree);
	return { tree, text: ` L'espressione diventa $${same(a, b) ? b : `${a} = ${b}`}$.` };
}

function buildSteps(root: Node): string[] {
	const steps: string[] = [];
	let tree = root;

	// Decimals and fractions not in lowest terms, rewritten first.
	const written: string[] = [];
	const decimals = has(tree, (y) => y.t === 'n' && !!y.src && y.src.includes('{,}'));
	const fractions = has(tree, (y) => y.t === 'n' && !!y.src && y.src.includes('frac') && numTex(y.v) !== y.src);
	tree = map(tree, (y) => {
		if (y.t !== 'n' || !y.src) return y;
		const plain = numTex(y.v);
		if (plain !== y.src) written.push(`$${y.src} = ${plain}$`);
		return leaf(y.v);
	});
	if (written.length) {
		const what = decimals && fractions ? 'Scrivi i decimali come frazioni e riduci le frazioni ai minimi termini' : decimals ? 'Scrivi i decimali come frazioni ridotte ai minimi termini' : 'Riduci le frazioni ai minimi termini';
		const b = becomes(tree);
		steps.push(`${what}: ${written.join(', ')}.${b.text}`);
		tree = b.tree;
	} else {
		const b = norm(tree);
		if (!same(latex(b), latex(tree))) steps.push(`Togli le parentesi attorno ai singoli numeri e applica la regola dei segni: $${latex(tree)} = ${latex(b)}$.`);
		tree = b;
	}

	for (let guard = 0; guard < 100 && tree.t !== 'n'; guard++) {
		const groups = innermost(tree);
		if (groups.length) {
			const kinds = new Set(groups.map((g) => g.k));
			const k = groups[0].k;
			const chains = groups.map((g) => `$${flatChain(g.c)}$`);
			const values = new Map(groups.map((g) => [g, leaf(evaluate(g.c))]));
			const one = groups.length === 1;
			const what = kinds.size > 1 ? 'le parentesi più interne' : one ? `la parentesi ${KIND[k][0]}` : `le parentesi ${KIND[k][1]}`;
			const b = becomes(replaceTop(tree, (y) => (y.t === 'g' ? (values.get(y) ?? null) : null)));
			steps.push(`Calcola ${what}${one ? '' : ', una alla volta'}: ${chains.join('; ')}.${b.text}`);
			tree = b.tree;
			continue;
		}
		// No brackets left: powers, then products and quotients, then sums, each a step.
		let before = latex(tree);
		for (const s of stages(tree)) {
			const eq = [before, ...s.forms].filter((f, i, all) => f !== all[i - 1]).join(' = ');
			if (s.label === 'pow') steps.push(`Calcola le potenze: $${eq}$.`);
			else if (s.label === 'mul') steps.push(`Esegui le moltiplicazioni e le divisioni, da sinistra a destra${s.forms.length > 1 ? ' (dividere per una frazione vuol dire moltiplicare per il suo reciproco)' : ''}: $${eq}$.`);
			else {
				const cd = s.forms.length > 1;
				steps.push(`Esegui le addizioni e le sottrazioni, da sinistra a destra${cd ? ', portando le frazioni al denominatore comune (il mcm dei denominatori)' : ''}: $${eq}$.`);
			}
			before = s.forms[s.forms.length - 1];
		}
		tree = leaf(evaluate(tree));
	}
	return steps;
}

/** A rational as a decimal after "=": "= 1{,}1\overline{6}", or "\approx …" when the period is too long. */
function decimalForm(r: Rational): string {
	const d = toDecimal(r, 6, 6);
	return d ? `= ${decimalLatex(d)}` : decimalTex(r, 4);
}

export function espressione(input: string): Outcome {
	const p = parseExpression(input);
	if (!p.ok) return fail(p.error);
	try {
		const value = evaluate(p.node);
		const steps = buildSteps(p.node);
		if (!steps.length) steps.push("L'espressione è già un numero: non c'è niente da calcolare.");
		const res = numTex(value);
		return {
			ok: true,
			result: value.isInteger() ? `$${res}$` : `$${res} ${decimalForm(value)}$`,
			copy: value.toString(),
			steps
		};
	} catch (e) {
		if (e instanceof ExprError) return fail(e.message);
		return fail('I numeri diventano troppo grandi per questo calcolatore: prova con numeri più piccoli.');
	}
}
