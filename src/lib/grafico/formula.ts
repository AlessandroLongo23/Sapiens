/**
 * What the plotter draws, read from MathJSON (the Compute Engine's parse of the LaTeX a student types in MathLive, or
 * of the LaTeX a lesson fixes): the kind of the entry and a function of numbers that evaluates it. Numbers only, as
 * floats: the exact trees of the grader (exercises/v2/grade/node.ts) compare answers and know no sine or logarithm.
 *
 * Three steps. `normalize` brings the parse to a small set of forms, puts the functions the student has named
 * (f(x) = …) where they are used and takes the derivatives that are asked for (f′(x)), by the rules, not by
 * differences; `compile` turns the result into a function; `readEntry` says what kind of entry it is.
 * vault/Prodotti/Studenti/Grafico di funzioni.md
 */

export type Json = number | string | Json[] | { num: string } | { sym: string } | { str: string } | { fn: Json[] };

/** The values of the letters: x, y, t and the parameters. A sum writes its index here while it runs. */
export type Scope = Record<string, number>;
export type Evaluator = (scope: Scope) => number;

/** The functions the student has named, by letter: the right side of f(x) = …, as parsed. */
export type Definitions = Record<string, Json>;

export type Entry =
	/** y = f(x). */
	| { kind: 'function'; f: Evaluator; params: string[]; note?: string; /** The letter of f(x) = …, when the row gives one. */ name?: string }
	/** F(x, y) = 0: a conic, a vertical line. `f` is the left side minus the right. */
	| { kind: 'implicit'; f: Evaluator; params: string[] }
	/** F(x, y) < 0 or ≤ 0. */
	| { kind: 'inequality'; f: Evaluator; strict: boolean; params: string[] }
	/** (x(t), y(t)). */
	| { kind: 'parametric'; x: Evaluator; y: Evaluator; params: string[] }
	/** r = f(θ), in polar coordinates. */
	| { kind: 'polar'; r: Evaluator; params: string[] }
	| { kind: 'empty' }
	| { kind: 'error'; message: string };

/** What a formula cannot say: the text is for the student, under the field. */
export class FormulaError extends Error {}

const UNREADABLE = 'Non riesco a leggere la formula: controlla parentesi e simboli.';
const UNFINISHED = 'La formula non è finita.';
/** The terms a sum or a product may have, and where one that goes to infinity stops. */
export const MAX_TERMS = 2000;
const TRUNCATED = `La somma fino a infinito è fermata a ${MAX_TERMS} termini: dove la serie non converge il disegno non vale.`;

const CONSTANTS: Record<string, number> = { Pi: Math.PI, pi: Math.PI, ExponentialE: Math.E, e: Math.E };

/** The real n-th root: an odd root of a negative number is negative, as the school writes it. */
const root = (x: number, n: number) => (x < 0 && Number.isInteger(n) && Math.abs(n) % 2 === 1 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n));

function factorial(x: number) {
	if (!Number.isInteger(x) || x < 0 || x > 170) return NaN;
	let out = 1;
	for (let k = 2; k <= x; k++) out *= k;
	return out;
}

const UNARY: Record<string, (x: number) => number> = {
	Sin: Math.sin,
	Cos: Math.cos,
	Tan: Math.tan,
	Cot: (x) => Math.cos(x) / Math.sin(x),
	Sec: (x) => 1 / Math.cos(x),
	Csc: (x) => 1 / Math.sin(x),
	Arcsin: Math.asin,
	Arccos: Math.acos,
	Arctan: Math.atan,
	Sinh: Math.sinh,
	Cosh: Math.cosh,
	Tanh: Math.tanh,
	Ln: Math.log,
	// "log" with no base is base ten, as in the Italian school
	Log: Math.log10,
	Lg: Math.log10,
	Lb: Math.log2,
	Exp: Math.exp,
	Sqrt: Math.sqrt,
	Abs: Math.abs,
	Floor: Math.floor,
	Ceil: Math.ceil,
	Sign: Math.sign,
	Factorial: factorial
};

/** Function names a student may type as letters: the Italian ones, and the usual ones when the backslash is missing. */
const NAMED: Record<string, string> = {
	sen: 'Sin',
	sin: 'Sin',
	cos: 'Cos',
	tg: 'Tan',
	tan: 'Tan',
	cotg: 'Cot',
	ctg: 'Cot',
	cot: 'Cot',
	arcsen: 'Arcsin',
	arcsin: 'Arcsin',
	arccos: 'Arccos',
	arctg: 'Arctan',
	arctan: 'Arctan',
	ln: 'Ln',
	log: 'Log',
	exp: 'Exp',
	sqrt: 'Sqrt',
	abs: 'Abs'
};

const isArray = (j: Json): j is Json[] => Array.isArray(j);
const head = (j: Json) => (isArray(j) && typeof j[0] === 'string' ? j[0] : null);

/** MathJSON without the wrappers the parser adds ({ fn, sourceOffsets }, { sym }, { num }). */
function plain(j: Json): Json {
	if (typeof j !== 'object' || j === null) return j;
	if (isArray(j)) return j.map(plain);
	if ('fn' in j) return plain(j.fn);
	if ('sym' in j) return j.sym;
	if ('num' in j) return Number(j.num);
	return j;
}

/** One name for a letter however it is written: a_1 and a_{1} are the same. */
const letter = (name: string) => GREEK_FORMS[name] ?? name.replace(/[{}]/g, '');
/** The Greek letters a formula may use, by the name the parser gives them: θ for the angle of a polar curve, the others as parameters. */
export const GREEK: Record<string, string> = { alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', theta: 'θ', lambda: 'λ', mu: 'μ', rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', omega: 'ω' };
/** The second way of writing some of them (ϑ, ϕ), which is the same letter. The parser reads \\varphi as the golden ratio: at school it is the phase of a sine. */
const GREEK_FORMS: Record<string, string> = { thetaSymbol: 'theta', phiSymbol: 'phi', vartheta: 'theta', GoldenRatio: 'phi' };
const isLetter = (j: Json): j is string => typeof j === 'string' && (/^[A-Za-z](?:_\{?[A-Za-z0-9]+\}?)?$/.test(j) || j in GREEK || j in GREEK_FORMS);

/** What sits between the brackets of a Delimiter: one expression, or the items of a list. */
function items(j: Json): Json[] {
	return head(j) === 'Sequence' ? (j as Json[]).slice(1) : [j];
}

// ---------------------------------------------------------------- the normal form

/*
 * What `normalize` leaves: numbers, letters, and
 *   Add(…)  Negate(a)  Multiply(…)  Divide(a, b)  Power(a, b)  Root(a, n)  Log(a, b)
 *   Sum(body, index, from, to)  Product(body, index, from, to)  and the one-argument functions of UNARY.
 */

const isZero = (j: Json) => j === 0;
const isOne = (j: Json) => j === 1;
const add = (...terms: Json[]): Json => {
	const rest = terms.filter((t) => !isZero(t));
	return rest.length === 0 ? 0 : rest.length === 1 ? rest[0] : ['Add', ...rest];
};
const mul = (...factors: Json[]): Json => {
	if (factors.some(isZero)) return 0;
	const rest = factors.filter((f) => !isOne(f));
	return rest.length === 0 ? 1 : rest.length === 1 ? rest[0] : ['Multiply', ...rest];
};
const neg = (a: Json): Json => (isZero(a) ? 0 : typeof a === 'number' ? -a : ['Negate', a]);
const div = (a: Json, b: Json): Json => (isZero(a) ? 0 : isOne(b) ? a : ['Divide', a, b]);
const pow = (a: Json, b: Json): Json => (isOne(b) ? a : isZero(b) ? 1 : ['Power', a, b]);

interface Context {
	defs: Definitions;
	/** The named functions being put in place, outermost first: a function that uses itself would never end. */
	open: string[];
	/** Set when a sum to infinity was cut short, for the note under the row. Shared by the whole reading of an entry. */
	flags: { truncated: boolean };
	/** Angles in degrees: sin 90 is 1, and arcsin 1 is 90. */
	degrees: boolean;
}

/** How a plotter reads its formulas. */
export interface ReadOptions {
	degrees?: boolean;
}

const TO_RADIANS = Math.PI / 180;
/** The functions that take an angle, and those that give one. */
const OF_ANGLE = new Set(['Sin', 'Cos', 'Tan', 'Cot', 'Sec', 'Csc']);
const GIVES_ANGLE = new Set(['Arcsin', 'Arccos', 'Arctan']);
/** A one-argument function in normal form; in degrees the angle is converted on its way in or out, so the rules of derivation still hold. */
function unary(h: string, arg: Json, ctx: Context): Json {
	if (ctx.degrees && OF_ANGLE.has(h)) return [h, mul(arg, TO_RADIANS)];
	if (ctx.degrees && GIVES_ANGLE.has(h)) return mul([h, arg], 1 / TO_RADIANS);
	return [h, arg];
}

/** A function the student may name: one letter, not a variable and not e. */
const isName = (j: Json): j is string => typeof j === 'string' && /^[a-zA-Z]$/.test(j) && !['x', 'y', 't', 'e'].includes(j);

/** The body of the named function, in normal form, as a function of x. */
function bodyOf(name: string, ctx: Context): Json {
	if (!(name in ctx.defs)) throw new FormulaError(`Prima dai un nome alla funzione: scrivi ${name}(x) = … in un'altra riga.`);
	if (ctx.open.includes(name)) throw new FormulaError(`La funzione ${name} usa se stessa.`);
	return normalize(ctx.defs[name], { ...ctx, open: [...ctx.open, name] });
}

/** f applied to an argument, `order` times derived first. */
function applied(name: string, order: number, arg: Json, ctx: Context): Json {
	let body = bodyOf(name, ctx);
	for (let i = 0; i < order; i++) body = derivative(body);
	return substitute(body, normalize(arg, ctx));
}

/** The expression with x replaced. */
function substitute(j: Json, value: Json): Json {
	if (value === 'x') return j;
	if (j === 'x') return value;
	if (!isArray(j)) return j;
	// the index of a sum is a name, not a value
	if (j[0] === 'Sum' || j[0] === 'Product') return [j[0], substitute(j[1], value), j[2], substitute(j[3], value), substitute(j[4], value)];
	return [j[0], ...j.slice(1).map((a) => substitute(a, value))];
}

/** The single argument inside the brackets of a function. */
function argument(j: Json): Json {
	const inner = items((j as Json[])[1]);
	if (inner.length !== 1) throw new FormulaError(UNREADABLE);
	return inner[0];
}

/**
 * Factors written side by side. A name followed by its argument is a function, not letters times a bracket:
 * \operatorname{sen}(x) arrives as InvisibleOperator("sen", Delimiter(x)), f(x) as InvisibleOperator("f", Delimiter(x)),
 * and f(x)² as InvisibleOperator("f", Power(Delimiter(x), 2)).
 */
function juxtaposed(args: Json[], ctx: Context): Json[] {
	const out: Json[] = [];
	for (let i = 0; i < args.length; i++) {
		const a = args[i];
		const next = args[i + 1];
		const builtin = typeof a === 'string' ? NAMED[a] : undefined;
		const named = isName(a) && a in ctx.defs;
		if ((builtin || named) && next !== undefined) {
			const call = (arg: Json): Json => (builtin ? unary(builtin, normalize(arg, ctx), ctx) : applied(a as string, 0, arg, ctx));
			const raised = head(next) === 'Power' && head((next as Json[])[1]) === 'Delimiter';
			if (raised) {
				out.push(pow(call(argument((next as Json[])[1])), normalize((next as Json[])[2], ctx)));
				i++;
				continue;
			}
			if (builtin || head(next) === 'Delimiter') {
				out.push(call(head(next) === 'Delimiter' ? argument(next) : next));
				i++;
				continue;
			}
		}
		out.push(normalize(a, ctx));
	}
	return out;
}

function normalize(j: Json, ctx: Context): Json {
	if (typeof j === 'number') return j;
	if (typeof j === 'string') {
		if (j in CONSTANTS) return j;
		if (j === 'Nothing') throw new FormulaError(UNFINISHED);
		if (j.endsWith('Infinity')) throw new FormulaError('L’infinito si può scrivere solo sopra una somma o un prodotto.');
		if (!isLetter(j)) throw new FormulaError(UNREADABLE);
		if (isName(j) && j in ctx.defs) throw new FormulaError(`${j} è una funzione: scrivi ${j}(x).`);
		return letter(j);
	}
	if (!isArray(j)) throw new FormulaError(UNREADABLE);
	const [h, ...args] = j as [string, ...Json[]];
	const n = (a: Json) => normalize(a, ctx);

	switch (h) {
		case 'Add':
			return add(...args.map(n));
		case 'Subtract':
			return args.length === 1 ? neg(n(args[0])) : add(n(args[0]), ...args.slice(1).map((a) => neg(n(a))));
		case 'Negate':
			return neg(n(args[0]));
		case 'Multiply':
			return mul(...args.map(n));
		case 'InvisibleOperator':
			return mul(...juxtaposed(args, ctx));
		case 'Divide':
		case 'Rational':
		case 'Colon':
			return div(n(args[0]), n(args[1]));
		case 'Power':
			return pow(n(args[0]), n(args[1]));
		case 'Square':
			return pow(n(args[0]), 2);
		case 'Root':
			return ['Root', n(args[0]), n(args[1])];
		case 'Log':
			// \log_b x arrives as Log(x, b)
			return args.length === 2 ? ['Log', n(args[0]), n(args[1])] : ['Log', n(args[0])];
		case 'Delimiter': {
			const inner = items(args[0]);
			if (inner.length !== 1) throw new FormulaError(UNREADABLE);
			return n(inner[0]);
		}
		case 'Sequence':
			if (args.length === 1) return n(args[0]);
			throw new FormulaError(args.some((a) => head(a) === 'Error') ? UNFINISHED : UNREADABLE);
		case 'Error':
			throw new FormulaError(UNFINISHED);

		case 'Sum':
		case 'Product': {
			const [body, range] = args;
			if (head(range) !== 'Tuple' || (range as Json[]).length !== 4) throw new FormulaError('Alla somma servono l’indice e i due estremi, come n = 1 sotto e 5 sopra.');
			const [, index, from, to] = range as Json[];
			if (!isLetter(index) || index === 'x') throw new FormulaError('L’indice di una somma è una lettera diversa da x, come n o k.');
			// to infinity: the evaluator stops at MAX_TERMS, or earlier once the terms no longer change the total
			if (to === 'PositiveInfinity') ctx.flags.truncated = true;
			return [h, n(body), letter(index), n(from), to === 'PositiveInfinity' ? Infinity : n(to)];
		}

		// f′(x), f″(2x)
		case 'Apply': {
			const [fn, arg] = args;
			if (head(fn) === 'Derivative' && args.length === 2) {
				const [, name, order] = fn as [string, Json, Json];
				if (typeof name === 'string' && typeof order === 'number') return applied(name, order, arg, ctx);
			}
			throw new FormulaError(UNREADABLE);
		}
		// f′ alone is f′(x)
		case 'Prime': {
			const [name, order = 1] = args;
			if (typeof name !== 'string' || typeof order !== 'number') throw new FormulaError(UNREADABLE);
			if (!isName(name)) throw new FormulaError('Per derivare dai un nome alla funzione: f(x) = …, poi f′(x).');
			return applied(name, order, 'x', ctx);
		}
		// d/dx of an expression
		case 'D':
			if (args[1] !== 'x') throw new FormulaError('Si deriva rispetto a x.');
			return derivative(n(args[0]));

		default:
			if (!(h in UNARY) || args.length !== 1) throw new FormulaError(UNREADABLE);
			return unary(h, n(args[0]), ctx);
	}
}

// ---------------------------------------------------------------- derivatives

/** Whether x appears. */
function hasX(j: Json): boolean {
	if (j === 'x') return true;
	return isArray(j) && j.slice(1).some(hasX);
}

/** The derivative with respect to x of an expression in normal form, by the rules. */
function derivative(j: Json): Json {
	if (!hasX(j)) return 0;
	if (j === 'x') return 1;
	const [h, ...args] = j as [string, ...Json[]];
	const d = derivative;
	const [u, w] = args;

	switch (h) {
		case 'Add':
			return add(...args.map(d));
		case 'Negate':
			return neg(d(u));
		case 'Multiply':
			return add(...args.map((_, i) => mul(...args.map((a, k) => (k === i ? d(a) : a)))));
		case 'Divide':
			return div(add(mul(d(u), w), neg(mul(u, d(w)))), pow(w, 2));
		case 'Power':
			// a number as exponent keeps the rule of powers, which also holds for a negative base
			if (!hasX(w)) return mul(w, pow(u, typeof w === 'number' ? w - 1 : add(w, -1)), d(u));
			if (!hasX(u)) return mul(j, ['Ln', u], d(w));
			return mul(j, add(mul(d(w), ['Ln', u]), div(mul(w, d(u)), u)));
		case 'Root':
			// (u^(1/n))′ = u^(1/n) · u′ / (n·u), which keeps the sign of an odd root
			return div(mul(j, d(u)), mul(w, u));
		case 'Sqrt':
			return div(d(u), mul(2, j));
		case 'Exp':
			return mul(j, d(u));
		case 'Ln':
			return div(d(u), u);
		case 'Log':
		case 'Lg':
			return div(d(u), mul(u, ['Ln', w ?? 10]));
		case 'Lb':
			return div(d(u), mul(u, ['Ln', 2]));
		case 'Sin':
			return mul(['Cos', u], d(u));
		case 'Cos':
			return neg(mul(['Sin', u], d(u)));
		case 'Tan':
			return div(d(u), pow(['Cos', u], 2));
		case 'Cot':
			return neg(div(d(u), pow(['Sin', u], 2)));
		case 'Sec':
			return mul(j, ['Tan', u], d(u));
		case 'Csc':
			return neg(mul(j, ['Cot', u], d(u)));
		case 'Arcsin':
			return div(d(u), ['Sqrt', add(1, neg(pow(u, 2)))]);
		case 'Arccos':
			return neg(div(d(u), ['Sqrt', add(1, neg(pow(u, 2)))]));
		case 'Arctan':
			return div(d(u), add(1, pow(u, 2)));
		case 'Sinh':
			return mul(['Cosh', u], d(u));
		case 'Cosh':
			return mul(['Sinh', u], d(u));
		case 'Tanh':
			return div(d(u), pow(['Cosh', u], 2));
		case 'Abs':
			return mul(['Sign', u], d(u));
		// flat between their jumps
		case 'Floor':
		case 'Ceil':
		case 'Sign':
		case 'Factorial':
			return 0;
		case 'Sum':
			return ['Sum', d(u), args[1], args[2], args[3]];
		case 'Product':
			// (∏ u)′ = ∏ u · Σ u′/u, where no factor is zero
			return mul(j, ['Sum', div(d(u), u), args[1], args[2], args[3]]);
		default:
			throw new FormulaError(UNREADABLE);
	}
}

// ---------------------------------------------------------------- evaluation

/** The function of numbers for an expression in normal form; `letters` collects the letters it reads. */
function compile(j: Json, letters: Set<string>): Evaluator {
	if (typeof j === 'number') return () => j;
	if (typeof j === 'string') {
		if (j in CONSTANTS) {
			const value = CONSTANTS[j];
			return () => value;
		}
		letters.add(j);
		return (s) => s[j];
	}
	const [h, ...args] = j as [string, ...Json[]];
	const c = (a: Json) => compile(a, letters);

	switch (h) {
		case 'Add': {
			const fs = args.map(c);
			return (s) => {
				let acc = 0;
				for (const f of fs) acc += f(s);
				return acc;
			};
		}
		case 'Multiply': {
			const fs = args.map(c);
			return (s) => {
				let acc = 1;
				for (const f of fs) acc *= f(s);
				return acc;
			};
		}
		case 'Negate': {
			const f = c(args[0]);
			return (s) => -f(s);
		}
		case 'Divide': {
			const [a, b] = args.map(c);
			return (s) => a(s) / b(s);
		}
		case 'Power': {
			const [a, b] = args.map(c);
			return (s) => Math.pow(a(s), b(s));
		}
		case 'Root': {
			const [a, n] = args.map(c);
			return (s) => root(a(s), n(s));
		}
		case 'Log': {
			if (args.length === 1) break;
			const [a, b] = args.map(c);
			return (s) => Math.log(a(s)) / Math.log(b(s));
		}
		case 'Sum':
		case 'Product': {
			const index = args[1] as string;
			// the index belongs to the sum: it is not a parameter of the formula
			const inner = new Set<string>();
			const body = compile(args[0], inner);
			inner.delete(index);
			inner.forEach((l) => letters.add(l));
			const from = c(args[2]);
			const to = c(args[3]);
			const sum = h === 'Sum';
			return (s) => {
				const a = Math.ceil(from(s));
				const end = to(s);
				const endless = end === Infinity;
				const b = endless ? a + MAX_TERMS - 1 : Math.floor(end);
				if (!Number.isFinite(a) || !Number.isFinite(b) || b - a >= MAX_TERMS) return NaN;
				const saved = s[index];
				let acc = sum ? 0 : 1;
				let still = 0;
				for (let k = a; k <= b; k++) {
					s[index] = k;
					const term = body(s);
					acc = sum ? acc + term : acc * term;
					if (!endless) continue;
					// a series that has settled, or has left the numbers, needs no more terms
					if (!Number.isFinite(acc)) break;
					still = (sum ? Math.abs(term) <= Math.abs(acc) * 1e-17 : term === 1) ? still + 1 : 0;
					if (still >= 12) break;
				}
				s[index] = saved;
				return acc;
			};
		}
	}
	const fn = UNARY[h];
	const f = c(args[0]);
	return (s) => fn(f(s));
}

// ---------------------------------------------------------------- entries

const RELATIONS: Record<string, { strict: boolean; flip: boolean }> = {
	Less: { strict: true, flip: false },
	LessEqual: { strict: false, flip: false },
	Greater: { strict: true, flip: true },
	GreaterEqual: { strict: false, flip: true }
};

const VARIABLES = new Set(['x', 'y', 't', 'theta']);

/** r, ρ or r(θ) on the left of "=": the radius of a polar curve. */
function isRadius(j: Json): boolean {
	if (j === 'r' || j === 'rho') return true;
	if (head(j) !== 'InvisibleOperator' || (j as Json[]).length !== 3) return false;
	const [, name, arg] = j as Json[];
	return (name === 'r' || name === 'rho') && head(arg) === 'Delimiter' && letter(String(items((arg as Json[])[1])[0])) === 'theta';
}
const paramsOf = (letters: Set<string>) => [...letters].filter((l) => !VARIABLES.has(l)).sort();

/** f(x) or g(t) on the left of "=": the letter of the function and the letter it is a function of, or null. */
function namedLeft(j: Json): { name: string; variable: string } | null {
	if (head(j) !== 'InvisibleOperator' || (j as Json[]).length !== 3) return null;
	const [, name, arg] = j as Json[];
	if (!isName(name) || head(arg) !== 'Delimiter') return null;
	const inner = items((arg as Json[])[1]);
	const variable = inner[0];
	return inner.length === 1 && typeof variable === 'string' && /^[a-zA-Z]$/.test(variable) && variable !== 'e' && variable !== name ? { name, variable } : null;
}

/** Whether the letter appears as a value (heads and the wrappers of strings are not letters). */
function mentions(j: Json, name: string): boolean {
	if (j === name) return true;
	return isArray(j) && j.slice(1).some((a) => mentions(a, name));
}

/** The parse with one letter written as another: the body of g(t) = t + 2 becomes a function of x. */
function renamed(j: Json, from: string, to: string): Json {
	if (j === from) return to;
	return isArray(j) ? [j[0], ...j.slice(1).map((a) => renamed(a, from, to))] : j;
}

/**
 * The body of a row "f(t) = …" as a function of x, whatever letter it was written in. Null when the body also has
 * an x of its own, which would be two variables.
 */
function bodyInX(right: Json, variable: string): Json | null {
	if (variable === 'x') return right;
	return mentions(right, 'x') ? null : renamed(right, variable, 'x');
}

/** The functions named in the entries of a plotter: every row "f(x) = …" gives its letter a meaning for the others. */
export function definitions(entries: Json[]): Definitions {
	const defs: Definitions = {};
	for (const entry of entries) {
		const j = plain(entry);
		if (head(j) !== 'Equal' || (j as Json[]).length !== 3) continue;
		const left = namedLeft((j as Json[])[1]);
		const body = left && bodyInX((j as Json[])[2], left.variable);
		if (left && body !== null && !(left.name in defs)) defs[left.name] = body;
	}
	return defs;
}

/** The names a function gets when the student has not given one, in order: f, g, h, then the letters least used for something else. */
const NAMES = 'fghpqrsuvwklmnabcdijoz';

/** The first letter free to name a function: not the name of another, not a letter any entry reads. Null when none is left. */
export function freeName(entries: Json[]): string | null {
	const used = entries.map(plain);
	return [...NAMES].find((name) => !used.some((j) => mentions(j, name))) ?? null;
}

/** Whether the entry is a function of x written without a name: "x² − 1", not "f(x) = …", "y = …" or a derivative on its own. */
export function isUnnamedFunction(json: Json, defs: Definitions = {}): boolean {
	const j = plain(json);
	const h = head(j);
	if (h === 'Equal' || h === 'Prime' || (h !== null && h in RELATIONS)) return false;
	return readEntry(j, defs).kind === 'function';
}

/** The entry a MathJSON value stands for. Never throws: what cannot be drawn is an entry of kind 'error'. */
export function readEntry(json: Json, defs: Definitions = {}, options: ReadOptions = {}): Entry {
	const j = plain(json);
	if (j === 'Nothing' || j === '') return { kind: 'empty' };
	const ctx: Context = { defs, open: [], flags: { truncated: false }, degrees: !!options.degrees };
	const note = () => (ctx.flags.truncated ? { note: TRUNCATED } : {});
	try {
		const h = head(j);
		const args = isArray(j) ? j.slice(1) : [];

		// (x(t), y(t))
		if (h === 'Delimiter') {
			const pair = items(args[0]);
			if (pair.length === 2) {
				const letters = new Set<string>();
				const x = compile(normalize(pair[0], ctx), letters);
				const y = compile(normalize(pair[1], ctx), letters);
				if (letters.has('x') || letters.has('y')) throw new FormulaError('Una curva parametrica si scrive con la lettera t: (cos t; sin t).');
				return { kind: 'parametric', x, y, params: paramsOf(letters) };
			}
		}

		if (h === 'Equal' && args.length === 2) {
			const [left, right] = args;
			const named = namedLeft(left);
			const rightLetters = new Set<string>();
			// r = f(θ): a polar curve, unless the right side is in x and y, where r is a parameter (x² + y² = r reversed)
			if (isRadius(left)) {
				const polar = new Set<string>();
				const r = compile(normalize(right, ctx), polar);
				if (!polar.has('x') && !polar.has('y') && !polar.has('t')) return { kind: 'polar', r, params: paramsOf(polar) };
			}
			if (named) {
				const body = bodyInX(right, named.variable);
				if (body === null) throw new FormulaError(`${named.name}(${named.variable}) è una funzione di ${named.variable}: a destra non può esserci anche la x.`);
				// read as f's own body, so a function that uses itself is caught
				const f = compile(bodyOf(named.name, { ...ctx, defs: { ...defs, [named.name]: body } }), rightLetters);
				if (rightLetters.has('y')) throw new FormulaError(`${named.name}(${named.variable}) è una funzione di ${named.variable}: a destra non può esserci la y.`);
				return { kind: 'function', f, params: paramsOf(rightLetters), name: named.name, ...note() };
			}
			const r = compile(normalize(right, ctx), rightLetters);
			if (left === 'y' && !rightLetters.has('y')) return { kind: 'function', f: r, params: paramsOf(rightLetters), ...note() };
			const letters = new Set(rightLetters);
			const l = compile(normalize(left, ctx), letters);
			return { kind: 'implicit', f: (s) => l(s) - r(s), params: paramsOf(letters) };
		}

		if (h && h in RELATIONS && args.length === 2) {
			const { strict, flip } = RELATIONS[h];
			const letters = new Set<string>();
			const l = compile(normalize(args[0], ctx), letters);
			const r = compile(normalize(args[1], ctx), letters);
			return { kind: 'inequality', f: flip ? (s) => r(s) - l(s) : (s) => l(s) - r(s), strict, params: paramsOf(letters) };
		}

		const letters = new Set<string>();
		const f = compile(normalize(j, ctx), letters);
		if (letters.has('y')) throw new FormulaError('Con la y serve un segno: scrivi un’equazione, come x² + y² = 4.');
		return { kind: 'function', f, params: paramsOf(letters), ...note() };
	} catch (e) {
		return { kind: 'error', message: e instanceof FormulaError ? e.message : UNREADABLE };
	}
}

/**
 * The LaTeX of MathLive, ready for the parser: the Italian decimal comma (`2{,}5`) becomes a point, and the spaces
 * and empty placeholders go.
 */
export function cleanLatex(latex: string): string {
	return latex
		.replace(/(\d)\{,\}(?=\d)/g, '$1.')
		// between anything else the comma separates: the two coordinates of (cos t, sin t)
		.replace(/\{,\}/g, ',')
		.replace(/\\placeholder(\[[^\]]*\])?\{[^}]*\}/g, '')
		.replace(/\\(?:,|;|!|:|quad|qquad)(?![A-Za-z])/g, ' ')
		.trim();
}
