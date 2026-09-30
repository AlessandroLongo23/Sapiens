/**
 * The expressions the grader compares: a small tree built from what the student wrote (MathJSON from the Compute
 * Engine, read without simplifying, so the form stays visible) or from the exact values the generators write in
 * SymPy syntax ("3*x**2*((7*x) + (-6))", "(3-sqrt(5))/2"). Nothing here rewrites a tree: forms.ts reads the shape,
 * and the value is compared by exact rationals where there are no letters and no radicals, by evaluation otherwise.
 */
import { Rational, q } from '../rational';

export type Node =
	| { t: 'num'; v: Rational; decimal?: boolean }
	| { t: 'sym'; name: string }
	| { t: 'pi' }
	| { t: 'add'; args: Node[] }
	| { t: 'neg'; a: Node }
	| { t: 'mul'; args: Node[] }
	/** `colon`: written with ":", the division sign of the Italian school: an operation, never a fraction bar. */
	| { t: 'div'; a: Node; b: Node; colon?: boolean }
	| { t: 'pow'; a: Node; b: Node }
	| { t: 'root'; a: Node; n: number }
	| { t: 'abs'; a: Node }
	/** Brackets the student wrote: kept, because "3x(7x − 6)" and "21x² − 18x" are different forms. */
	| { t: 'paren'; a: Node };

export const num = (v: Rational): Node => ({ t: 'num', v });

/** One name for a letter however it is written: s_0, s_{0} and s0 are the same. */
const letter = (name: string) => name.replace(/[_{}]/g, '');

/** A MathJSON value that is not an expression: a list, an equation, a word. The callers read those themselves. */
export class NotAnExpression extends Error {}

/** A decimal as typed, exactly: 0.75 is 3/4, not the float nearest to it. */
function rationalOfDecimal(s: string): Rational {
	const m = /^(-?)(\d*)\.?(\d*)$/.exec(s);
	if (!m) throw new NotAnExpression(`number ${s}`);
	const digits = m[3];
	const whole = Number(m[2] || '0') * 10 ** digits.length + Number(digits || '0');
	return q(m[1] ? -whole : whole, 10 ** digits.length);
}

function numberNode(value: number | string): Node {
	const s = String(value);
	if (!/^-?\d*\.?\d+$|^-?\d+\.?$/.test(s)) throw new NotAnExpression(`number ${s}`);
	const decimal = s.includes('.');
	return decimal ? { t: 'num', v: rationalOfDecimal(s), decimal } : { t: 'num', v: q(Number(s)) };
}

type Json = number | string | Json[] | { num: string } | { sym: string } | { str: string } | { fn: Json[] };

/** The expression a MathJSON value stands for, from Compute Engine's non-canonical parse. */
export function fromMathJson(j: Json): Node {
	if (typeof j === 'number') return numberNode(j);
	if (typeof j === 'string') {
		if (j.startsWith("'")) throw new NotAnExpression(`text ${j}`);
		if (j === 'Pi') return { t: 'pi' };
		if (j === 'Nothing' || j === 'EmptySet' || j === 'RealNumbers') throw new NotAnExpression(j);
		if (!/^[A-Za-z](?:_[A-Za-z0-9]+)?$/.test(j)) throw new NotAnExpression(`symbol ${j}`);
		return { t: 'sym', name: letter(j) };
	}
	if (!Array.isArray(j)) {
		if ('num' in j) return numberNode(j.num);
		if ('sym' in j) return fromMathJson(j.sym);
		if ('fn' in j) return fromMathJson(j.fn);
		throw new NotAnExpression('string');
	}
	const [head, ...args] = j as [string, ...Json[]];
	const all = () => args.map(fromMathJson);
	switch (head) {
		case 'Add':
			return { t: 'add', args: all() };
		case 'Subtract':
			if (args.length === 1) return { t: 'neg', a: fromMathJson(args[0]) };
			return { t: 'add', args: [fromMathJson(args[0]), ...args.slice(1).map((a): Node => ({ t: 'neg', a: fromMathJson(a) }))] };
		case 'Negate':
			return { t: 'neg', a: fromMathJson(args[0]) };
		case 'Multiply':
		case 'InvisibleOperator':
			return args.length === 1 ? fromMathJson(args[0]) : { t: 'mul', args: all() };
		case 'Divide':
			return { t: 'div', a: fromMathJson(args[0]), b: fromMathJson(args[1]) };
		case 'Colon':
			return { t: 'div', a: fromMathJson(args[0]), b: fromMathJson(args[1]), colon: true };
		case 'Rational': {
			const [a, b] = all();
			if (a.t !== 'num' || b.t !== 'num') throw new NotAnExpression('Rational');
			return { t: 'num', v: a.v.div(b.v) };
		}
		case 'Power':
			return { t: 'pow', a: fromMathJson(args[0]), b: fromMathJson(args[1]) };
		case 'Square':
			return { t: 'pow', a: fromMathJson(args[0]), b: num(q(2)) };
		case 'Sqrt':
			return { t: 'root', a: fromMathJson(args[0]), n: 2 };
		case 'Root': {
			const n = fromMathJson(args[1]);
			if (n.t !== 'num' || !n.v.isInteger() || n.v.num < 2) throw new NotAnExpression('root index');
			return { t: 'root', a: fromMathJson(args[0]), n: n.v.num };
		}
		case 'Abs':
			return { t: 'abs', a: fromMathJson(args[0]) };
		case 'Delimiter': {
			// Brackets around one expression. A list ("x = 0, 2", separators ',' or ';') is not an expression.
			let inner = args[0];
			if (Array.isArray(inner) && inner[0] === 'Sequence') {
				if (inner.length !== 2) throw new NotAnExpression('list');
				inner = inner[1];
			}
			if (typeof args[1] === 'string' && /[,;]/.test(args[1])) throw new NotAnExpression('list');
			return { t: 'paren', a: fromMathJson(inner) };
		}
		case 'Degrees':
		case 'Quantity':
			return fromMathJson(args[0]);
		default:
			throw new NotAnExpression(String(head));
	}
}

/** The expression written in SymPy syntax by a generator: numbers, letters, + - * / **, sqrt, root, Abs, pi. */
export function fromSympy(src: string): Node {
	const tokens = src.match(/\*\*|\d+\.\d+|\d+|[A-Za-z_][A-Za-z0-9_]*|[-+*/(),]/g) ?? [];
	if (tokens.join('') !== src.replace(/\s+/g, '')) throw new Error(`fromSympy: cannot read "${src}"`);
	let i = 0;
	const peek = () => tokens[i];
	const eat = (t?: string) => {
		const tok = tokens[i++];
		if (t !== undefined && tok !== t) throw new Error(`fromSympy: expected ${t} in "${src}"`);
		return tok;
	};
	const sum = (): Node => {
		const args: Node[] = [term()];
		while (peek() === '+' || peek() === '-') args.push(eat() === '+' ? term() : { t: 'neg', a: term() });
		return args.length === 1 ? args[0] : { t: 'add', args };
	};
	const term = (): Node => {
		let left = unary();
		while (peek() === '*' || peek() === '/') left = eat() === '*' ? mulOf(left, unary()) : { t: 'div', a: left, b: unary() };
		return left;
	};
	const mulOf = (a: Node, b: Node): Node => (a.t === 'mul' ? { t: 'mul', args: [...a.args, b] } : { t: 'mul', args: [a, b] });
	const unary = (): Node => {
		if (peek() === '-') {
			eat();
			return { t: 'neg', a: unary() };
		}
		if (peek() === '+') eat();
		return power();
	};
	const power = (): Node => {
		const base = atom();
		if (peek() === '**') {
			eat();
			return { t: 'pow', a: base, b: unary() };
		}
		return base;
	};
	const atom = (): Node => {
		const tok = eat();
		if (tok === '(') {
			const inner = sum();
			eat(')');
			return inner;
		}
		if (/^\d/.test(tok)) return numberNode(tok);
		if (tok === 'pi') return { t: 'pi' };
		if (tok === 'sqrt' || tok === 'Abs' || tok === 'root' || tok === 'real_root') {
			eat('(');
			const a = sum();
			let n = 2;
			if (tok === 'root' || tok === 'real_root') {
				eat(',');
				n = Number(eat());
			}
			eat(')');
			return tok === 'Abs' ? { t: 'abs', a } : { t: 'root', a, n };
		}
		if (/^[A-Za-z_]\w*$/.test(tok)) return { t: 'sym', name: letter(tok) };
		throw new Error(`fromSympy: unexpected "${tok}" in "${src}"`);
	};
	const node = sum();
	if (i !== tokens.length) throw new Error(`fromSympy: trailing input in "${src}"`);
	return node;
}

/** The node without the brackets around it. */
export function bare(n: Node): Node {
	while (n.t === 'paren') n = n.a;
	return n;
}

export function symbols(n: Node, out = new Set<string>()): Set<string> {
	switch (n.t) {
		case 'sym':
			out.add(n.name);
			break;
		case 'add':
		case 'mul':
			for (const a of n.args) symbols(a, out);
			break;
		case 'div':
		case 'pow':
			symbols(n.a, out);
			symbols(n.b, out);
			break;
		case 'neg':
		case 'root':
		case 'abs':
		case 'paren':
			symbols(n.a, out);
			break;
	}
	return out;
}

export function contains(n: Node, pred: (n: Node) => boolean): boolean {
	if (pred(n)) return true;
	switch (n.t) {
		case 'add':
		case 'mul':
			return n.args.some((a) => contains(a, pred));
		case 'div':
		case 'pow':
			return contains(n.a, pred) || contains(n.b, pred);
		case 'neg':
		case 'root':
		case 'abs':
		case 'paren':
			return contains(n.a, pred);
		default:
			return false;
	}
}

/** The exact value of a node without letters, radicals or π, or null. */
export function exact(n: Node): Rational | null {
	try {
		switch (n.t) {
			case 'num':
				return n.v;
			case 'paren':
				return exact(n.a);
			case 'neg': {
				const a = exact(n.a);
				return a && a.neg();
			}
			case 'abs': {
				const a = exact(n.a);
				return a && a.abs();
			}
			case 'add': {
				let s = q(0);
				for (const a of n.args) {
					const v = exact(a);
					if (!v) return null;
					s = s.add(v);
				}
				return s;
			}
			case 'mul': {
				let p = q(1);
				for (const a of n.args) {
					const v = exact(a);
					if (!v) return null;
					p = p.mul(v);
				}
				return p;
			}
			case 'div': {
				const a = exact(n.a);
				const b = exact(n.b);
				return a && b && !b.isZero() ? a.div(b) : null;
			}
			case 'pow': {
				const a = exact(n.a);
				const b = exact(n.b);
				if (!a || !b || !b.isInteger() || Math.abs(b.num) > 64) return null;
				if (a.isZero() && b.num <= 0) return null;
				let r = q(1);
				for (let k = 0; k < Math.abs(b.num); k++) r = r.mul(a);
				return b.num < 0 ? q(1).div(r) : r;
			}
			default:
				return null;
		}
	} catch {
		// A numerator or denominator past the safe integers: not exact here, compared by evaluation.
		return null;
	}
}

/** The value of a node for given letters, as a float; NaN where it is undefined in the reals. */
export function evaluate(n: Node, env: Record<string, number>): number {
	switch (n.t) {
		case 'num':
			return n.v.num / n.v.den;
		case 'sym':
			return env[n.name] ?? NaN;
		case 'pi':
			return Math.PI;
		case 'paren':
			return evaluate(n.a, env);
		case 'neg':
			return -evaluate(n.a, env);
		case 'abs':
			return Math.abs(evaluate(n.a, env));
		case 'add':
			return n.args.reduce((s, a) => s + evaluate(a, env), 0);
		case 'mul':
			return n.args.reduce((p, a) => p * evaluate(a, env), 1);
		case 'div':
			return evaluate(n.a, env) / evaluate(n.b, env);
		case 'root': {
			const a = evaluate(n.a, env);
			if (a < 0) return n.n % 2 === 1 ? -Math.pow(-a, 1 / n.n) : NaN;
			return Math.pow(a, 1 / n.n);
		}
		case 'pow': {
			const a = evaluate(n.a, env);
			const e = exact(n.b);
			if (a < 0 && e && !e.isInteger()) {
				// A real odd root of a negative base: (-8)^(1/3) = -2.
				if (e.den % 2 === 0) return NaN;
				const r = Math.pow(-a, e.num / e.den);
				return e.num % 2 === 0 ? r : -r;
			}
			return Math.pow(a, evaluate(n.b, env));
		}
	}
}

/**
 * Letters are given these values: away from the integers, where denominators vanish, and spread on both sides
 * of zero and far from it, so that x + 4 and |x + 4| differ somewhere.
 */
const PROBES = [0.7318, -1.2941, 2.3857, -4.4613, 5.9179, -7.1127, 3.6653, -9.2711, 11.3719, -13.8807, 0.2711, 17.4133];

/**
 * Whether two expressions have the same value: exactly when both are rational numbers, otherwise at several
 * points (every letter moved independently), with a relative tolerance far below any difference a school
 * exercise can produce. Where both sides are undefined the point is skipped; where only one is, they differ (√x
 * and √|x|); at least three points must be compared. `positive`: the exercise says the letters are positive, so
 * only positive values are tried (√a·√b is √(ab) there, not elsewhere).
 */
export function sameValue(a: Node, b: Node, { positive = false } = {}): boolean {
	const ea = exact(a);
	const eb = exact(b);
	if (ea && eb) return ea.equals(eb);
	const letters = [...new Set([...symbols(a), ...symbols(b)])].sort();
	let compared = 0;
	for (let k = 0; k < PROBES.length; k++) {
		const env: Record<string, number> = {};
		letters.forEach((l, i) => {
			const v = PROBES[(k + 3 * i) % PROBES.length] + 0.137 * i;
			env[l] = positive ? Math.abs(v) : v;
		});
		const x = evaluate(a, env);
		const y = evaluate(b, env);
		if (!Number.isFinite(x) && !Number.isFinite(y)) continue;
		if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
		if (Math.abs(x - y) > 1e-9 * Math.max(1, Math.abs(x), Math.abs(y))) return false;
		compared++;
		if (letters.length === 0) return true;
	}
	return compared >= 3;
}
