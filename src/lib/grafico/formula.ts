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

/** A function the student has named: the letters between its brackets and the right side of f(x) = …, as parsed. */
export interface Definition {
	vars: string[];
	body: Json;
}
/** The functions the student has named, by letter. */
export type Definitions = Record<string, Definition>;

export type Entry =
	/** y = f(x). */
	| {
			kind: 'function';
			f: Evaluator;
			params: string[];
			note?: string;
			/** The letter of f(x) = …, when the row gives one. */
			name?: string;
						/** The derivative, by the rules: the slope of the tangent. */
			d: Evaluator;
			/** With no x in it the formula is a number, the same everywhere: a limit, a sum, 2 + 3. */
			constant?: boolean;
	  }
		/** A sequence of points, P_{n+1} = puntomedio(P_n; A): its terms are the points (x(n); y(n)), from `from` on. */
	| { kind: 'orbit'; name: string; index: string; x: Evaluator; y: Evaluator; from: number; params: string[] }
	/** y′ = f(x; y): the slopes of a differential equation, drawn as a field of short strokes. */
	| { kind: 'field'; f: Evaluator; params: string[] }
	/** F(x, y) = 0: a conic, a vertical line. `f` is the left side minus the right. */
	| { kind: 'implicit'; f: Evaluator; params: string[] }
	/** A region of the plane: where `f`, the margin of the condition, is below zero. Strict, its edge is not part of it. */
	| { kind: 'inequality'; f: Evaluator; strict: boolean; params: string[] }
	/** A point, (2; 3) or A = (2; 3). `free` when its coordinates are two plain numbers, which a drag can change. */
	| { kind: 'point'; x: Evaluator; y: Evaluator; params: string[]; name?: string; free: boolean }
	/** (x(t), y(t)). */
	| { kind: 'parametric'; x: Evaluator; y: Evaluator; params: string[] }
	/** r = f(θ), in polar coordinates. */
	| { kind: 'polar'; r: Evaluator; params: string[] }
		/**
	 * A sequence, from its general term (a_n = 2n + 1) or from a recurrence (a_{n+1} = 2a_n + 1): `f` gives the term
	 * whose index is in the scope under the letter `index`. `from` is the first index it has a value at, when it
	 * starts from given values. `plane` when its terms depend on x or y: then it has no points of its own.
	 */
		| { kind: 'sequence'; name: string; index: string; f: Evaluator; from?: number; plane: boolean; params: string[]; /** For a_{n+1} = g(a_n): g, as a function of x, for the cobweb. */ step?: Evaluator }
	/** A value a sequence starts from, a_0 = 3: it draws nothing, the sequence reads it. */
	| { kind: 'given'; params: string[] }
	/** h(x; y) = …: a function of two letters or more has no curve of its own, the other rows use it. */
	| { kind: 'definition'; name: string; vars: string[]; params: string[] }
	| { kind: 'empty' }
	| { kind: 'error'; message: string };

/** What a formula cannot say: the text is for the student, under the field. */
export class FormulaError extends Error {}

const UNREADABLE = 'Non riesco a leggere la formula: controlla parentesi e simboli.';
const UNFINISHED = 'La formula non è finita.';
/** The terms a sum or a product may have, and where one that goes to infinity stops. */
export const MAX_TERMS = 2000;
const NO_BOUNDS = 'All’integrale servono i due estremi, sotto e sopra: il plotter non cerca la primitiva.';
const NO_INTEGRAND = 'Tra il segno di integrale e dx va la funzione da integrare.';
const NO_VARIABLE = 'Dopo la funzione da integrare scrivi dx, o dt: la lettera rispetto a cui si integra.';
const SYSTEM = 'In un sistema va una disequazione per riga. Le equazioni si scrivono una per riga del pannello: le curve si incontrano nei punti segnati.';
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
	// halves go up, as the school rounds: 2,5 is 3 and −2,5 is −3
	Round: (x) => Math.sign(x) * Math.round(Math.abs(x)),
	Factorial: factorial
};

/**
 * Numbers by chance that stay the same while a graph is looked at. A call gives the same number for the same place
 * in a sequence (the index, and t along a curve), so the thousand points of a sequence do not jump at every redraw;
 * `reseed` draws them all again.
 */
let SEED = 0x9e3779b9;
export function reseed() {
	SEED = (Math.random() * 0x100000000) >>> 0;
}
const BITS = new Float64Array(1);
const WORDS = new Uint32Array(BITS.buffer);
const stir = (h: number, v: number) => {
	BITS[0] = v;
	h = Math.imul(h ^ WORDS[0], 0x85ebca6b);
	h = Math.imul(h ^ WORDS[1] ^ (h >>> 13), 0xc2b2ae35);
	return h ^ (h >>> 16);
};
const INDEXES = ['n', 'k', 'i', 'j', 'm', 't'];
/** A number from 0 (included) to 1 (not), for one call of `casuale` at one place. */
function chance(site: number, s: Scope): number {
	let h = stir(SEED ^ site, site);
	for (const name of INDEXES) h = stir(h, s[name] ?? 0);
	return (stir(h, 1) >>> 0) / 0x100000000;
}
/** A number for a call, from what it is given: two calls written alike draw alike. */
function siteOf(args: Json[], order: number): number {
	const text = JSON.stringify(args);
	let h = 2166136261 ^ order;
	for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
	return h >>> 0;
}

/** The greatest common divisor of two whole numbers; of anything else, no value. */
function gcd(a: number, b: number): number {
	if (!Number.isInteger(a) || !Number.isInteger(b)) return NaN;
	[a, b] = [Math.abs(a), Math.abs(b)];
	while (b) [a, b] = [b, a % b];
	return a;
}

/** n over k: the ways of choosing k among n, for whole numbers. */
function binomial(n: number, k: number): number {
	if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0) return NaN;
	if (k < 0 || k > n) return 0;
	let out = 1;
	for (let i = 1; i <= Math.min(k, n - k); i++) out = (out * (n - i + 1)) / i;
	return Math.round(out);
}

/** The functions of several numbers, with how many they take. */
const MANY: Record<string, { min: number; max: number; f: (...xs: number[]) => number }> = {
	Max: { min: 1, max: Infinity, f: (...xs) => (xs.some(Number.isNaN) ? NaN : Math.max(...xs)) },
	Min: { min: 1, max: Infinity, f: (...xs) => (xs.some(Number.isNaN) ? NaN : Math.min(...xs)) },
	// the remainder has the sign of the divisor: on the clock, −1 is 11
	Mod: { min: 2, max: 2, f: (a, b) => a - b * Math.floor(a / b) },
	Gcd: { min: 2, max: Infinity, f: (...xs) => xs.reduce(gcd) },
	Lcm: { min: 2, max: Infinity, f: (...xs) => xs.reduce((a, b) => (a === 0 || b === 0 ? 0 : Math.abs(a * b) / gcd(a, b))) },
		Binomial: { min: 2, max: 2, f: binomial },
	Mean: { min: 1, max: Infinity, f: (...xs) => mean(xs) },
	Median: {
		min: 1,
		max: Infinity,
		f: (...xs) => {
			if (xs.some(Number.isNaN)) return NaN;
			const sorted = [...xs].sort((a, b) => a - b);
			const mid = sorted.length >> 1;
			return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
		}
	},
	// of the numbers given, all of them: the variance of a population, as the school defines it first
	Variance: { min: 1, max: Infinity, f: (...xs) => variance(xs) },
	Deviation: { min: 1, max: Infinity, f: (...xs) => Math.sqrt(variance(xs)) },
	// the bell of Gauss at x, with mean μ and standard deviation σ
	Normal: { min: 3, max: 3, f: (x, mu, sigma) => (sigma > 0 ? Math.exp(-(((x - mu) / sigma) ** 2) / 2) / (sigma * Math.sqrt(2 * Math.PI)) : NaN) },
	// k successes in n trials, each with probability p
	BinomialP: { min: 3, max: 3, f: (k, n, p) => (p < 0 || p > 1 ? NaN : binomial(n, k) * p ** k * (1 - p) ** (n - k)) }
};
function mean(xs: number[]): number {
	return xs.reduce((s, x) => s + x, 0) / xs.length;
}
function variance(xs: number[]): number {
	const m = mean(xs);
	return xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length;
}

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
	abs: 'Abs',
	arrotonda: 'Round',
	max: 'Max',
	min: 'Min',
	resto: 'Mod',
	mcd: 'Gcd',
	mcm: 'Lcm',
		binomiale: 'Binomial',
	media: 'Mean',
	mediana: 'Median',
	varianza: 'Variance',
	devstandard: 'Deviation',
	normale: 'Normal',
	distbinomiale: 'BinomialP'
};
/** How a function of several numbers is asked for, when it is given the wrong number of them. */
const MANY_USE: Record<string, string> = { Max: 'max(a; b)', Min: 'min(a; b)', Mod: 'resto(a; b)', Gcd: 'mcd(a; b)', Lcm: 'mcm(a; b)', Binomial: 'binomiale(n; k)', Mean: 'media(a; b; c)', Median: 'mediana(a; b; c)', Variance: 'varianza(a; b; c)', Deviation: 'devstandard(a; b; c)', Normal: 'normale(x; μ; σ)', BinomialP: 'distbinomiale(k; n; p)' };

/** A function of several numbers in normal form. */
function many(h: string, args: Json[]): Json {
	const { min, max } = MANY[h];
	if (args.length < min || args.length > max) throw new FormulaError(`Scrivi ${MANY_USE[h]}, con il punto e virgola tra i numeri.`);
	return [h, ...args];
}

const isArray = (j: Json): j is Json[] => Array.isArray(j);
const head = (j: Json) => (isArray(j) && typeof j[0] === 'string' ? j[0] : null);

/** MathJSON without the wrappers the parser adds ({ fn, sourceOffsets }, { sym }, { num }). */
function plain(j: Json): Json {
	if (typeof j !== 'object' || j === null) return j;
	if (isArray(j)) {
		const out = j.map(plain);
		// F(x), H(x; y): the parser reads a capital letter before a bracket as a function of its own, a small one as two factors
		// (D is the parser's own name for a derivative)
		if (out.length >= 2 && typeof out[0] === 'string' && /^[A-CE-Z]$/.test(out[0])) return ['InvisibleOperator', out[0], ['Delimiter', out.length === 2 ? out[1] : ['Sequence', ...out.slice(1)]]];
		return out;
	}
	if ('fn' in j) return plain(j.fn);
	if ('sym' in j) return j.sym;
	if ('num' in j) return Number(j.num);
	return j;
}

/** One name for a letter however it is written: a_1 and a_{1} are the same. */
const letter = (name: string) => GREEK_FORMS[name] ?? name.replace(/[{}]/g, '');
/** The Greek letters a formula may use, by the name the parser gives them: θ for the angle of a polar curve, the others as parameters. */
export const GREEK: Record<string, string> = { alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', theta: 'θ', lambda: 'λ', mu: 'μ', rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', omega: 'ω' };
/** The second way of writing some of them (ϑ, ϕ), which is the same letter. The parser reads \\varphi as the golden ratio and \\gamma as Euler's constant: at school they are letters. */
const GREEK_FORMS: Record<string, string> = { thetaSymbol: 'theta', phiSymbol: 'phi', vartheta: 'theta', GoldenRatio: 'phi', EulerGamma: 'gamma' };
const isLetter = (j: Json): j is string => typeof j === 'string' && (/^[A-Za-z](?:_\{?[A-Za-z0-9]+\}?)?$/.test(j) || COORDINATE.test(j) || j in GREEK || j in GREEK_FORMS);

/**
 * A coordinate of a point with a name, as the school writes it: x_P, y_A. The letter stays in the formula, and the
 * plotter gives it the value the point has now. Also read from x(P), as GeoGebra writes it, and from P.x.
 */
export const COORDINATE = /^([xy])_([A-Z](?:_\d+)?)$/;

/** What sits between the brackets of a Delimiter: one expression, or the items of a list. */
function items(j: Json): Json[] {
	return head(j) === 'Sequence' ? (j as Json[]).slice(1) : [j];
}

// ---------------------------------------------------------------- the normal form

/*
 * What `normalize` leaves: numbers, letters, and
 *   Add(…)  Negate(a)  Multiply(…)  Divide(a, b)  Power(a, b)  Root(a, n)  Log(a, b)
 *   Sum(body, index, from, to)  Product(body, index, from, to)  and the one-argument functions of UNARY;
 *   Integral(body, variable, from, to), where the variable has a name of its own ($0, $1) that no formula can write;
 *   If(condition, then, else) for a function in pieces, where a condition is True, a relation between expressions
 *   (Less(a, b), also in a chain: Less(a, b, c)) or And, Or, Not of conditions. NaN is "no value here".
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
	/**
	 * Shared by the whole reading of an entry: `truncated` once a sum to infinity was cut short, for the note under
	 * the row; `bound` counts the integrals, to name their variables.
	 */
	flags: { truncated: boolean; bound: number; /** How many calls of `casuale` the entry has so far. */ draws?: number; /** The sequences in normal form, as the terms of this entry reach them. */ system?: SeqSystem; /** The bodies of the named functions already put in normal form: used twice, a function is the same piece of the formula twice. */ forms: Map<string, Json> };
		/** Angles in degrees: sin 90 is 1, and arcsin 1 is 90. */
	degrees: boolean;
		/** The names of the points of the plotter: x_P is a number only where there is a P. */
	points: Set<string>;
		/** Inside the body of a named function: its variables and the slots they are written as. */
	slots: Record<string, string>;
	/** The sequences the rows define, as parsed. */
	seqs: Sequences;
}

/** How a plotter reads its formulas. */
export interface ReadOptions {
	degrees?: boolean;
	/** The sequences of the plotter: with a_{n+1} = … written in a row, a_5 in another is its term and not a letter. */
	sequences?: Sequences;
	/** The names of the points a formula may take the coordinates of. */
	points?: string[];
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

/** A letter to integrate or derive by: inside a named function its own variable is already a slot. */
const isVariable = (j: Json): j is string => isLetter(j) || (typeof j === 'string' && j[0] === '@');

/** The letter that stands for the i-th variable of a named function while it is put in place: no formula can write it. */
const slot = (i: number) => `@${i}`;

/** The body of the named function, in normal form, with its variables written as slots. */
function bodyOf(name: string, ctx: Context): Json {
	if (!(name in ctx.defs)) throw new FormulaError(`Prima dai un nome alla funzione: scrivi ${name}(x) = … in un'altra riga.`);
	if (ctx.open.includes(name)) throw new FormulaError(`La funzione ${name} usa se stessa.`);
			const known = ctx.flags.forms.get(name);
	if (known !== undefined) return known;
	const { vars, body } = ctx.defs[name];
	const slots = Object.fromEntries(vars.map((v, i) => [v, slot(i)]));
	const form = normalize(renamedAll(body, slots), { ...ctx, open: [...ctx.open, name], slots });
	ctx.flags.forms.set(name, form);
	return form;
}

/** f applied to its arguments, `order` times derived first. */
function applied(name: string, order: number, args: Json[], ctx: Context): Json {
	let body = bodyOf(name, ctx);
	const { vars } = ctx.defs[name];
	if (args.length !== vars.length) throw new FormulaError(`${name} è una funzione di ${vars.join(' e ')}: scrivi ${name}(${vars.join('; ')}).`);
	if (order && vars.length > 1) throw new FormulaError(`${name} ha più variabili: scrivi rispetto a quale si deriva, come ∂${name}/∂${vars[0]}.`);
	for (let i = 0; i < order; i++) body = derivative(body, slot(0));
	return substitute(body, Object.fromEntries(args.map((a, i) => [slot(i), normalize(a, ctx)])));
}

/** The expression with some letters replaced, all at once: in h(y; x) the two do not get in each other's way. */
function substitute(j: Json, values: Record<string, Json>, done = new Map<Json, Json>()): Json {
	if (typeof j === 'string') return j in values ? values[j] : j;
	if (!isArray(j)) return j;
	// a piece that is in the formula twice (a function used twice) is replaced once, and stays one piece
	const known = done.get(j);
	if (known !== undefined) return known;
	// the index of a sum and the variable of an integral are names, not values
	const bound = j[0] === 'Sum' || j[0] === 'Product' || j[0] === 'Integral' || j[0] === 'Limit';
	const parts = j.map((a, i) => (i === 0 || (bound && i === 2) ? a : substitute(a, values, done)));
	// what does not change stays the very same piece
	const out = parts.every((a, i) => a === j[i]) ? j : parts;
	done.set(j, out);
	return out;
}

/**
 * A number by chance, in normal form: Random(site, 'range', a, b) between two numbers, Random(site, 'pick', …) one
 * of those given. With nothing it is between 0 and 1, with one number between 0 and that, with two between them;
 * with three or more, or with a set in braces, it is one of them.
 */
function drawn(args: Json[], ctx: Context): Json {
	const set = args.length === 1 && head(args[0]) === 'Set' ? (args[0] as Json[]).slice(1).flatMap((a) => (head(a) === 'Delimiter' ? items((a as Json[])[1]) : [a])) : null;
	const list = set ?? args;
	const site = siteOf(list, (ctx.flags.draws = (ctx.flags.draws ?? 0) + 1));
	const n = (a: Json) => normalize(a, ctx);
	if (set || list.length >= 3) {
		if (!list.length) throw new FormulaError('Tra le graffe servono i numeri tra cui scegliere: casuale({1; 2; 3}).');
		return ['Random', site, 'pick', ...list.map(n)];
	}
	return ['Random', site, 'range', list.length === 2 ? n(list[0]) : 0, list.length === 0 ? 1 : n(list[list.length - 1])];
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
				// x(P), y(P): a coordinate of the point P, where there is one
		if ((a === 'x' || a === 'y') && head(next) === 'Delimiter') {
			const [inside] = items((next as Json[])[1]);
			if (typeof inside === 'string' && ctx.points.has(letter(inside)) && items((next as Json[])[1]).length === 1) {
				out.push(`${a}_${letter(inside)}`);
				i++;
				continue;
			}
		}
				// casuale(), casuale(5), casuale(1; 6), casuale(a; b; c): a number by chance
		if ((a === 'casuale' || a === 'random') && head(next) === 'Delimiter') {
			out.push(drawn((next as Json[]).length > 1 ? items((next as Json[])[1]) : [], ctx));
			i++;
			continue;
		}
		const builtin = typeof a === 'string' ? NAMED[a] : undefined;
		const named = isName(a) && a in ctx.defs;
		if ((builtin || named) && next !== undefined) {
			const call = (inner: Json[]): Json => {
				if (!builtin) return applied(a as string, 0, inner, ctx);
				if (builtin in MANY) return many(builtin, inner.map((x) => normalize(x, ctx)));
				if (inner.length !== 1) throw new FormulaError(UNREADABLE);
				return unary(builtin, normalize(inner[0], ctx), ctx);
			};
			const between = (bracket: Json) => items((bracket as Json[])[1]);
			const raised = head(next) === 'Power' && head((next as Json[])[1]) === 'Delimiter';
			if (raised) {
				out.push(pow(call(between((next as Json[])[1])), normalize((next as Json[])[2], ctx)));
				i++;
				continue;
			}
			if (builtin || head(next) === 'Delimiter') {
				out.push(call(head(next) === 'Delimiter' ? between(next) : [next]));
				i++;
				continue;
			}
		}
		out.push(normalize(a, ctx));
	}
	return out;
}

const RELATION_HEADS = new Set(['Less', 'LessEqual', 'Greater', 'GreaterEqual', 'Equal', 'NotEqual']);

/** A condition in normal form: x > 0, 0 < x < 2, "altrimenti". */
function condition(j: Json, ctx: Context): Json {
	if (j === 'True') return 'True';
	const h = head(j);
	const args = isArray(j) ? j.slice(1) : [];
	if (h && RELATION_HEADS.has(h) && args.length >= 2) return [h, ...args.map((a) => normalize(a, ctx))];
	if ((h === 'And' || h === 'Or') && args.length >= 1) return [h, ...args.map((a) => condition(a, ctx))];
	if (h === 'Not' && args.length === 1) return ['Not', condition(args[0], ctx)];
	// the brackets of a condition: {x > 0}, (x > 0)
	if ((h === 'Set' || h === 'Delimiter' || h === 'Sequence') && args.length >= 1) return condition(h === 'Delimiter' ? items(args[0])[0] : args[0], ctx);
	throw new FormulaError('La condizione di una funzione a tratti è un confronto, come x > 0 o 0 < x < 2.');
}

function normalize(j: Json, ctx: Context): Json {
	if (typeof j === 'number') return j;
	if (typeof j === 'string') {
		if (j in CONSTANTS) return j;
				// the variable of an integral and those of a named function, already renamed
		if (j[0] === '$' || j[0] === '@') return j;
		// a_5, a_k, a_n: a term of a sequence, where the rows define one called a
		const term = SUBSCRIPTED.exec(letter(j));
		if (term && term[1] in ctx.seqs) return termOf(term[1], /^\d+$/.test(term[2]) ? Number(term[2]) : normalize(term[2], ctx), ctx);
		if (j === 'Nothing') throw new FormulaError(UNFINISHED);
		if (j.endsWith('Infinity')) throw new FormulaError('L’infinito si può scrivere solo sopra una somma o un prodotto.');
				if (!isLetter(j)) throw new FormulaError(UNREADABLE);
		const coordinate = COORDINATE.exec(letter(j));
		if (coordinate && !ctx.points.has(coordinate[2])) throw new FormulaError(`Non c’è un punto ${coordinate[2]}: per le sue coordinate serve una riga ${coordinate[2]} = (…; …), o un punto costruito con quel nome.`);
				// the name of a function alone is the function of its own letters: with a(x; y) and b(x; y), a·b = 0 is a(x; y)·b(x; y) = 0.
		// A function of one letter is taken along the x axis, as it is drawn.
		if (isName(j) && j in ctx.defs) {
			const { vars } = ctx.defs[j];
			return applied(j, 0, (vars.length === 1 ? ['x'] : vars).map((v) => ctx.slots[v] ?? v), ctx);
		}
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
		case 'InvisibleOperator': {
			// x² {0 < x < 2}: a formula followed by its domain in braces
			const last = args[args.length - 1];
			if (args.length > 1 && head(last) === 'Set') return ['If', condition(last, ctx), mul(...juxtaposed(args.slice(0, -1), ctx)), NaN];
			return mul(...juxtaposed(args, ctx));
		}
		// the same, as the parser reads it with a simple condition
		case 'When':
			return ['If', condition(args[1], ctx), n(args[0]), NaN];
		// a function in pieces: the first condition that holds gives the value
		case 'Which': {
			if (args.length < 2 || args.length % 2) throw new FormulaError(UNFINISHED);
			let out: Json = NaN;
			let pieces = 0;
			for (let i = args.length - 2; i >= 0; i -= 2) {
				// a row left empty, as Enter adds it, is not a piece yet
				if (args[i] === 'True' && args[i + 1] === 'Nothing') continue;
				out = ['If', condition(args[i], ctx), n(args[i + 1]), out];
				pieces++;
			}
			if (!pieces) throw new FormulaError(UNFINISHED);
			return out;
		}
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
		// a_{n+1}, a_{2k}: a term of a sequence by an index that is a formula
		case 'Subscript':
			if (typeof args[0] !== 'string' || !(args[0] in ctx.seqs)) throw new FormulaError(typeof args[0] === 'string' && /^[A-Za-z]$/.test(args[0]) ? `Non c’è una successione ${args[0]}: scrivi in un’altra riga il suo termine, ${args[0]}_n = …, o la sua ricorrenza, ${args[0]}_{n+1} = ….` : UNREADABLE);
			return termOf(args[0], n(args[1]), ctx);


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

		// ∫ from a to b of f(t) dt: a number for each x, found by quadrature
		case 'Integrate': {
			const [body, range] = args;
			if (head(range) !== 'Tuple' || (range as Json[]).length !== 4) throw new FormulaError(NO_BOUNDS);
			const [, variable, from, to] = range as Json[];
			if (variable === 'Nothing') throw new FormulaError(NO_VARIABLE);
			if (!isVariable(variable)) throw new FormulaError(UNREADABLE);
			// the variable lives inside the integral only: with a name of its own the x of ∫₀ˣ x dx is not the x of the bound
			const bound = `$${ctx.flags.bound++}`;
			return ['Integral', n(renamed(body, variable, bound)), bound, n(from), n(to)];
		}

								// the parser's own name for a number by chance, and the choice among points of a sequence of points
		case 'Random':
			return drawn(args, ctx);
		case 'RandomPick':
			return ['Random', args[0], 'pick', ...args.slice(1).map(n)];

		// lim for x → a of f(x): the number the values come close to, found by trying nearer and nearer
		case 'Limit': {
			const [fn, at, side = 0] = args;
			if (head(fn) !== 'Function' || (fn as Json[]).length !== 3 || !isVariable((fn as Json[])[2])) throw new FormulaError('Sotto lim va scritto dove tende la variabile, come x → 2 oppure n → ∞.');
			const [, body, variable] = fn as [string, Json, string];
			if (body === 'Nothing' || at === 'Nothing') throw new FormulaError(UNFINISHED);
			const bound = `$${ctx.flags.bound++}`;
			const infinite = at === 'PositiveInfinity' ? Infinity : at === 'NegativeInfinity' || (head(at) === 'Negate' && (at as Json[])[1] === 'PositiveInfinity') ? -Infinity : null;
			return ['Limit', n(renamed(body, variable, bound)), bound, infinite ?? n(at), typeof side === 'number' ? Math.sign(side) : 0];
		}

		// P.x, P.y: the same coordinates, as Desmos writes them
		case 'PointX':
		case 'PointY':
			if (typeof args[0] !== 'string' || !ctx.points.has(letter(args[0]))) throw new FormulaError(UNREADABLE);
			return `${h === 'PointX' ? 'x' : 'y'}_${letter(args[0])}`;

		// f′(x), f″(2x)
		case 'Apply': {
			const [fn, arg] = args;
			if (head(fn) === 'Derivative' && args.length === 2) {
				const [, name, order] = fn as [string, Json, Json];
				if (typeof name === 'string' && typeof order === 'number') return applied(name, order, [arg], ctx);
			}
			throw new FormulaError(UNREADABLE);
		}
		// f′ alone is f′(x)
		case 'Prime': {
			const [name, order = 1] = args;
			if (typeof name !== 'string' || typeof order !== 'number') throw new FormulaError(UNREADABLE);
			if (!isName(name)) throw new FormulaError('Per derivare dai un nome alla funzione: f(x) = …, poi f′(x).');
			return applied(name, order, ['x'], ctx);
		}
		// d/dx of an expression, ∂/∂y of one with two letters; ∂h/∂x for a function with a name
		case 'D': {
			const [body, ...by] = args;
			if (!by.length || !by.every(isVariable)) throw new FormulaError('Sotto la d va la lettera rispetto a cui si deriva: d/dx.');
			let form = isName(body) && body in ctx.defs ? applied(body, 0, ctx.defs[body].vars, ctx) : n(body);
			for (const v of by) form = derivative(form, letter(v as string));
			return form;
		}

		default:
			if (h in MANY) return many(h, args.map(n));
			if (!(h in UNARY) || args.length !== 1) throw new FormulaError(UNREADABLE);
			return unary(h, n(args[0]), ctx);
	}
}

// ---------------------------------------------------------------- derivatives

/** Whether the letter appears. */
function has(j: Json, v: string): boolean {
	if (j === v) return true;
	return isArray(j) && j.slice(1).some((a) => has(a, v));
}

/** The derivative of an expression in normal form with respect to a letter (x where none is given), by the rules: the other letters are numbers. */
function derivative(j: Json, v = 'x'): Json {
	const hasX = (a: Json) => has(a, v);
	// where a function has no value, neither has its slope
	if (typeof j === 'number' && Number.isNaN(j)) return NaN;
	if (head(j) === 'If') return ['If', (j as Json[])[1], derivative((j as Json[])[2], v), derivative((j as Json[])[3], v)];
	if (!hasX(j)) return 0;
	if (j === v) return 1;
	const [h, ...args] = j as [string, ...Json[]];
	const d = (a: Json) => derivative(a, v);
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
		case 'Round':
		case 'Sign':
		case 'Factorial':
				case 'Gcd':
		case 'Lcm':
		case 'Binomial':
		case 'BinomialP':
		case 'Median':
			return 0;
		case 'Mean':
			return div(add(...args.map(d)), args.length);
		// the bell's slope: −(x − μ)/σ² times the bell, for μ and σ that do not move
		case 'Normal':
			return hasX(args[1]) || hasX(args[2]) ? NaN : mul(neg(div(add(u, neg(args[1])), pow(args[2], 2))), j, d(u));
		case 'Variance':
		case 'Deviation':
			return NaN;
		// the slope of the one that is the greatest, or the smallest, at that place
		case 'Max':
		case 'Min':
			return args.slice(0, -1).reduceRight((rest: Json, a, i) => ['If', ['And', ...args.slice(i + 1).map((b): Json => [h === 'Max' ? 'GreaterEqual' : 'LessEqual', a, b])], d(a), rest], d(args[args.length - 1]));
		// between two jumps the remainder climbs as what is divided does
		case 'Mod':
			return hasX(w) ? NaN : d(u);
		case 'Sum':
			return ['Sum', d(u), args[1], args[2], args[3]];
		case 'Product':
			// (∏ u)′ = ∏ u · Σ u′/u, where no factor is zero
			return mul(j, ['Sum', div(d(u), u), args[1], args[2], args[3]]);
						// chance has no slope
		case 'Random':
			return NaN;
		// the slope of a limit is the limit of the slopes, where the point it tends to stays still
		case 'Limit':
			return hasX(args[2]) ? NaN : ['Limit', d(u), args[1], args[2], args[3]];
		case 'Integral': {
			// the fundamental theorem, with bounds that move: g(b)·b′ − g(a)·a′, and the integral of ∂g/∂x where g has an x
			const [, variable, from, to] = args;
			const at = (bound: Json) => mul(substitute(u, { [variable as string]: bound }), d(bound));
			return add(at(to), neg(at(from)), hasX(u) ? ['Integral', d(u), variable, from, to] : 0);
		}
		default:
			throw new FormulaError(UNREADABLE);
	}
}

// ---------------------------------------------------------------- evaluation

/**
 * Counts the evaluations: a piece of a formula that is there twice keeps its value for the time of one count. Every
 * evaluation of a formula with such pieces moves it, and so does every term of a sum, where the index changes.
 */
let TICK = 0;

interface Session {
	/** The pieces of the formula that are in it more than once: the same object, from a named function used twice. */
	shared: Set<Json>;
	/** Whether a piece has no letter in it. */
	fixed: Map<Json, boolean>;
	done: Map<Json, { run: Evaluator; letters: Set<string> }>;
}

function sharedPieces(root: Json): Set<Json> {
	const seen = new Set<Json>();
	const shared = new Set<Json>();
	const visit = (j: Json) => {
		if (!isArray(j)) return;
		if (seen.has(j)) {
			shared.add(j);
			return;
		}
		seen.add(j);
		for (let i = 1; i < j.length; i++) visit(j[i]);
	};
	visit(root);
	return shared;
}

/**
 * The function of numbers for an expression in normal form; `letters` collects the letters it reads. With
 * a(x; y) and b(x; y) used again and again (c = a² − b², d = 2ab, and so on) the formula is a few pieces used many
 * times: each is evaluated once for a point, not once for every place it appears in.
 */
function compile(j: Json, letters: Set<string>): Evaluator {
	const session: Session = { shared: sharedPieces(j), done: new Map(), fixed: new Map() };
	const root = build(j, letters, session);
	if (!session.shared.size) return root;
	return (s) => {
		TICK++;
		return root(s);
	};
}

function build(j: Json, letters: Set<string>, session: Session): Evaluator {
	if (!session.shared.has(j)) return buildPiece(j, letters, session);
	const known = session.done.get(j);
	if (known) {
		known.letters.forEach((l) => letters.add(l));
		return known.run;
	}
	const own = new Set<string>();
	const evaluate = buildPiece(j, own, session);
	let at = -1;
	let value = 0;
	const run: Evaluator = (s) => {
		if (at !== TICK) {
			value = evaluate(s);
			at = TICK;
		}
		return value;
	};
	own.forEach((l) => letters.add(l));
	session.done.set(j, { run, letters: own });
	return run;
}

function buildPiece(j: Json, letters: Set<string>, session: Session): Evaluator {
	if (typeof j === 'number') return () => j;
	if (typeof j === 'string') {
		if (j in CONSTANTS) {
			const value = CONSTANTS[j];
			return () => value;
		}
				letters.add(j);
		// the letters of the plane are read by their own name: the engine keeps such a reading short
		if (j === 'x') return (s) => s.x;
		if (j === 'y') return (s) => s.y;
		if (j === 't') return (s) => s.t;
		return (s) => s[j];
	}
	const [h, ...args] = j as [string, ...Json[]];
	const c = (a: Json) => build(a, letters, session);
	// a piece with no letter in it is a number: found now, once
	if (h !== 'If' && isFixed(j, session)) {
		const value = buildOperation(h, args, c, letters, session)({});
		return () => value;
	}
	return buildOperation(h, args, c, letters, session);
}

/** Whether a piece has no letter in it: 2π, √3/2. */
function isFixed(j: Json, session: Session): boolean {
	if (typeof j === 'number') return true;
	if (typeof j === 'string') return j in CONSTANTS;
	if (!isArray(j)) return false;
	const known = session.fixed.get(j);
	if (known !== undefined) return known;
	const fixed = j.slice(1).every((a) => isFixed(a, session));
	session.fixed.set(j, fixed);
	return fixed;
}

/**
 * The function for one operation. The common shapes have their own: a sum of two or three terms, a product by a
 * number, a square, a cube. A point of an implicit curve is evaluated a hundred thousand times for one picture,
 * and a loop over two terms, or a general power for a square, costs more than the operation itself.
 */
function buildOperation(h: string, args: Json[], c: (a: Json) => Evaluator, letters: Set<string>, session: Session): Evaluator {

	switch (h) {
		case 'If': {
			const holds = compileCondition(args[0], letters);
			const [a, b] = [c(args[1]), c(args[2])];
			return (s) => (holds(s) ? a(s) : b(s));
		}
				case 'Add': {
			const fs = args.map(c);
			const [p, q, r] = fs;
						if (fs.length === 2) {
				if (typeof args[1] === 'number') return ((k) => (s: Scope) => p(s) + k)(args[1]);
				// a − b is kept as a + (−b): taken back to one subtraction
				if (head(args[1]) === 'Negate') return ((m) => (s: Scope) => p(s) - m(s))(c((args[1] as Json[])[1]));
				return (s) => p(s) + q(s);
			}
			if (fs.length === 3) return (s) => p(s) + q(s) + r(s);
			return (s) => {
				let acc = 0;
				for (let i = 0; i < fs.length; i++) acc += fs[i](s);
				return acc;
			};
		}
		case 'Multiply': {
			const fs = args.map(c);
			const [p, q, r] = fs;
			if (fs.length === 2) return typeof args[0] === 'number' ? ((k) => (s: Scope) => k * q(s))(args[0]) : (s) => p(s) * q(s);
			if (fs.length === 3) return (s) => p(s) * q(s) * r(s);
			return (s) => {
				let acc = 1;
				for (let i = 0; i < fs.length; i++) acc *= fs[i](s);
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
			// the powers of school: a square is a product, and so are a cube and a fourth power
			if (args[1] === 2)
				return (s) => {
					const v = a(s);
					return v * v;
				};
			if (args[1] === 3)
				return (s) => {
					const v = a(s);
					return v * v * v;
				};
			if (args[1] === 4)
				return (s) => {
					const v = a(s);
					const w = v * v;
					return w * w;
				};
			if (args[1] === -1) return (s) => 1 / a(s);
			if (typeof args[1] === 'number') return ((n) => (s: Scope) => Math.pow(a(s), n))(args[1]);
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
			const body = build(args[0], inner, session);
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
					TICK++;
					const term = body(s);
					acc = sum ? acc + term : acc * term;
					if (!endless) continue;
					// a series that has settled, or has left the numbers, needs no more terms
					if (!Number.isFinite(acc)) break;
					still = (sum ? Math.abs(term) <= Math.abs(acc) * 1e-17 : term === 1) ? still + 1 : 0;
					if (still >= 12) break;
				}
								s[index] = saved;
				TICK++;
				return acc;
			};
		}
						case 'Random': {
			const site = args[0] as number;
			const of = args.slice(2).map(c);
			if (args[1] === 'pick') return (s) => of[Math.min(of.length - 1, Math.floor(chance(site, s) * of.length))](s);
			const [a, b] = of;
			return (s) => {
				const from = a(s);
				return from + chance(site, s) * (b(s) - from);
			};
		}
		case 'Limit': {
			const variable = args[1] as string;
			const inner = new Set<string>();
			const body = build(args[0], inner, session);
			inner.delete(variable);
			inner.forEach((l) => letters.add(l));
			const at = c(args[2]);
			const side = args[3] as number;
			return (s) => {
				const value = limit((t) => ((s[variable] = t), TICK++, body(s)), at(s), side);
				TICK++;
				return value;
			};
		}
		case 'Integral': {
			const variable = args[1] as string;
						const inner = new Set<string>();
			const body = build(args[0], inner, session);
			inner.delete(variable);
			inner.forEach((l) => letters.add(l));
			const from = c(args[2]);
			const to = c(args[3]);
			return (s) => {
				const a = from(s);
				const b = to(s);
				if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
				if (a === b) return 0;
								const value = quadrature((t) => ((s[variable] = t), TICK++, body(s)), a, b);
				TICK++;
				return value;
			};
		}
	}
			if (h === 'Term') {
		const run = runtimeOf(args[2] as unknown as SeqSystem);
		run.letters.forEach((l) => letters.add(l));
		const q = run.seqs[args[0] as string];
		const index = c(args[1]);
		return (s) => run.term(q, Math.round(index(s)), s);
	}
	if (h in MANY) {
		const { f } = MANY[h];
		const of = args.map(c);
		if (of.length === 2) return ((a, b) => (s: Scope) => f(a(s), b(s)))(of[0], of[1]);
		return (s) => f(...of.map((a) => a(s)));
	}
	const fn = UNARY[h];
	const f = c(args[0]);
	// the functions met most have a line of their own: one line shared by all of them is slower for each
	switch (h) {
		case 'Sin':
			return (s) => Math.sin(f(s));
		case 'Cos':
			return (s) => Math.cos(f(s));
		case 'Sqrt':
			return (s) => Math.sqrt(f(s));
		case 'Abs':
			return (s) => Math.abs(f(s));
		case 'Exp':
			return (s) => Math.exp(f(s));
		case 'Ln':
			return (s) => Math.log(f(s));
	}
	return (s) => fn(f(s));
}

/**
 * The values of g along points that close in on a place: the one where two values in a row differ least, which is
 * where the function has settled and the rounding of the numbers has not yet taken over. Infinity where the values
 * grow without end with one sign; no value where they neither settle nor grow.
 */
function settled(g: (t: number) => number, points: number[]): number {
	let best = NaN;
	let gap = Infinity;
	let before = NaN;
	let last = NaN;
		let growing = 0;
	// a slow climb with no end, as the logarithm's: always further from zero, by steps that do not shrink
	let climb = 0;
	let firstStep = 0;
	let lastStep = 0;
	for (const t of points) {
		const v = g(t);
		if (!Number.isFinite(v)) {
			if (v === Infinity || v === -Infinity) last = v;
			continue;
		}
		if (Number.isFinite(before)) {
						const d = Math.abs(v - before);
			// Once settled, a jump is the rounding: so close to the point 1 − cos x is exactly 0, and the quotient with it.
			if (gap <= 1e-5 * Math.max(1, Math.abs(best)) && d > 100 * gap && d > 1e-12) break;
			if (d <= gap) {
				gap = d;
				best = v;
			}
						growing = Math.abs(v) > Math.abs(before) * 1.5 && Math.sign(v) === Math.sign(before) ? growing + 1 : 0;
			if (Math.abs(v) > Math.abs(before) && Math.sign(v) === Math.sign(before)) {
				if (!climb) firstStep = d;
				climb++;
				lastStep = d;
			} else climb = 0;
		}
		before = v;
		last = v;
	}
		if (growing >= 8 || last === Infinity || last === -Infinity) return Math.abs(last) > 1e3 ? Math.sign(last) * Infinity : NaN;
	if (climb >= 20 && lastStep >= 0.5 * firstStep && lastStep > 1e-9) return Math.sign(last) * Infinity;
	return gap <= 1e-5 * Math.max(1, Math.abs(best)) ? best : NaN;
}

/** The limit of g at a point, from one side (1 from above, −1 from below) or from both, and at infinity. */
export function limit(g: (t: number) => number, at: number, side: number): number {
	if (Number.isNaN(at)) return NaN;
	const steps = Array.from({ length: 48 }, (_, k) => 2 ** -(k + 3));
	if (!Number.isFinite(at)) return settled(g, Array.from({ length: 36 }, (_, k) => Math.sign(at) * 2 ** (k + 3)));
	const scale = Math.max(1, Math.abs(at));
	const from = (sign: number) => settled(g, steps.map((h) => at + sign * h * scale));
	if (side) return from(side);
	const [above, below] = [from(1), from(-1)];
	if (above === below) return above;
	// from a side where the function is not there, the other side is the limit: √x at 0
	if (Number.isNaN(below) && !Number.isFinite(g(at - steps[10] * scale))) return above;
	if (Number.isNaN(above) && !Number.isFinite(g(at + steps[10] * scale))) return below;
	return Math.abs(above - below) <= 1e-6 * Math.max(1, Math.abs(above)) ? (above + below) / 2 : NaN;
}

/** Gauss's four points on a piece: exact for a polynomial up to the seventh degree, and never at the ends, where 1/√t has no value. */
const GAUSS = [
	[-0.8611363115940526, 0.3478548451374538],
	[-0.3399810435848563, 0.6521451548625461],
	[0.3399810435848563, 0.6521451548625461],
	[0.8611363115940526, 0.3478548451374538]
];

function gauss(g: (t: number) => number, a: number, b: number): number {
	const mid = (a + b) / 2;
	const half = (b - a) / 2;
	let sum = 0;
	for (const [node, weight] of GAUSS) sum += weight * g(mid + node * half);
	return sum * half;
}

/** How many times the first and the last piece are halved toward their end. */
const GRADES = 12;

/**
 * The integral of g from a to b, piece by piece: eight pieces a unit, so that a wave of sin(t²) still has its
 * points. The two pieces at the ends are halved again and again toward the end, where a function like 1/√t grows
 * without limit and an even step would lose a part of the area.
 */
function quadrature(g: (t: number) => number, a: number, b: number): number {
	const pieces = Math.min(200, Math.max(12, Math.ceil(Math.abs(b - a) * 8)));
	const h = (b - a) / pieces;
	let sum = 0;
	for (let i = 1; i < pieces - 1; i++) sum += gauss(g, a + i * h, a + (i + 1) * h);
	let edge = h;
	for (let k = 0; k < GRADES; k++) {
		sum += gauss(g, a + edge / 2, a + edge) + gauss(g, b - edge, b - edge / 2);
		edge /= 2;
	}
	return sum + gauss(g, a, a + edge) + gauss(g, b - edge, b);
}

const COMPARE: Record<string, (a: number, b: number) => boolean> = {
	Less: (a, b) => a < b,
	LessEqual: (a, b) => a <= b,
	Greater: (a, b) => a > b,
	GreaterEqual: (a, b) => a >= b,
	Equal: (a, b) => a === b,
	NotEqual: (a, b) => a !== b
};

/** Whether a condition in normal form holds. */
function compileCondition(j: Json, letters: Set<string>): (scope: Scope) => boolean {
	if (j === 'True') return () => true;
	const [h, ...args] = j as [string, ...Json[]];
	if (h === 'And' || h === 'Or') {
		const parts = args.map((a) => compileCondition(a, letters));
		return h === 'And' ? (s) => parts.every((p) => p(s)) : (s) => parts.some((p) => p(s));
	}
	if (h === 'Not') {
		const part = compileCondition(args[0], letters);
		return (s) => !part(s);
	}
	const fs = args.map((a) => compile(a, letters));
	const holds = COMPARE[h];
	// a chain holds link by link: 0 < x < 2
	return (s) => {
		let before = fs[0](s);
		for (let i = 1; i < fs.length; i++) {
			const now = fs[i](s);
			if (!holds(before, now)) return false;
			before = now;
		}
		return true;
	};
}

/**
 * How far a condition is from holding, as a number that is below zero inside the region and above it outside:
 * for a < b it is a − b. A region is drawn from where this changes sign. `strict` collects whether every
 * comparison leaves its edge out.
 */
function compileMargin(j: Json, letters: Set<string>, strict: { all: boolean }): Evaluator {
	if (j === 'True') return () => -1;
	const [h, ...args] = j as [string, ...Json[]];
	if (h === 'And' || h === 'Or') {
		const parts = args.map((a) => compileMargin(a, letters, strict));
		return h === 'And' ? (s) => Math.max(...parts.map((p) => p(s))) : (s) => Math.min(...parts.map((p) => p(s)));
	}
	if (h === 'Not') {
		const part = compileMargin(args[0], letters, strict);
		return (s) => -part(s);
	}
	if (h === 'Equal' || h === 'NotEqual') throw new FormulaError('Una regione si scrive con <, >, ≤ o ≥.');
	if (h === 'LessEqual' || h === 'GreaterEqual') strict.all = false;
		const fs = args.map((a) => compile(a, letters));
	const sign = h === 'Less' || h === 'LessEqual' ? 1 : -1;
	// one comparison, the usual case: a < b is a − b
	if (fs.length === 2) {
		const [a, b] = fs;
		if (typeof args[1] === 'number') return ((k) => (sign === 1 ? (s: Scope) => a(s) - k : (s: Scope) => k - a(s)))(args[1]);
		return sign === 1 ? (s) => a(s) - b(s) : (s) => b(s) - a(s);
	}
	return (s) => {
		let worst = -Infinity;
		let before = fs[0](s);
		for (let i = 1; i < fs.length; i++) {
			const now = fs[i](s);
			worst = Math.max(worst, sign * (before - now));
			before = now;
		}
		return worst;
	};
}

// ---------------------------------------------------------------- sequences

/**
 * A sequence as its rows write it. The rule gives the term of index n + `shift` (a_{n+1} = 2a_n + 1 has shift 1;
 * a_n = 2n + 1 and a_n = a_{n−1} + 2 have shift 0); `starts` are the terms given by value, a_0 = 3.
 */
export interface Sequence {
	index: string;
	shift: number;
	body: Json | null;
	starts: [number, Json][];
	/** A sequence of points: its terms are those of the two sequences of its coordinates, named with POINT_X and POINT_Y. */
	point?: true;
}
/** The names of the two sequences that are the coordinates of a sequence of points: no formula can write them. */
const coordinateOf = (name: string, axis: 'x' | 'y') => `${name}§${axis}`;
export type Sequences = Record<string, Sequence>;

/** The letters an index is written with. */
const INDEX_LETTERS = new Set(['n', 'k', 'i', 'j', 'm']);
const SUBSCRIPTED = /^([A-Za-z])_(.+)$/;

/** What a row says about a sequence: its rule, or one of the values it starts from. Null for any other row. */
function sequenceRow(j: Json): { name: string; rule: { index: string; shift: number; body: Json } } | { name: string; start: { at: number; value: Json } } | null {
	if (head(j) !== 'Equal' || (j as Json[]).length !== 3) return null;
	const [, left, right] = j as Json[];
	// A_1 = (2; 3) is a point
	if (head(right) === 'Delimiter' && items((right as Json[])[1]).length === 2) return null;
	if (head(left) === 'Subscript') {
		const [, name, at] = left as Json[];
		if (typeof name !== 'string' || !/^[A-Za-z]$/.test(name) || name === 'e' || head(at) !== 'Add' || (at as Json[]).length !== 3) return null;
		const [, index, shift] = at as Json[];
		return typeof index === 'string' && INDEX_LETTERS.has(index) && typeof shift === 'number' && Number.isInteger(shift) && shift > 0 ? { name, rule: { index, shift, body: right } } : null;
	}
	if (typeof left !== 'string') return null;
	const written = SUBSCRIPTED.exec(letter(left));
	if (!written || written[1] === 'e') return null;
	if (INDEX_LETTERS.has(written[2])) return { name: written[1], rule: { index: written[2], shift: 0, body: right } };
	return /^\d+$/.test(written[2]) ? { name: written[1], start: { at: Number(written[2]), value: right } } : null;
}

/** The sequences written in the entries of a plotter: the first rule for a letter, and the values given for it. */
export function sequences(entries: Json[]): Sequences {
	const seqs: Sequences = {};
	const rows = entries.map((entry) => sequenceRow(plain(entry)));
	for (const row of rows) if (row && 'rule' in row && !(row.name in seqs)) seqs[row.name] = { ...row.rule, starts: [] };
		for (const row of rows) if (row && 'start' in row && row.name in seqs && !seqs[row.name].starts.some(([at]) => at === row.start.at)) seqs[row.name].starts.push([row.start.at, row.start.value]);

	// A sequence of points: a rule for P with the points it starts from, P_0 = (1; 2). It is two sequences of numbers,
	// the x and the y of its terms, which read each other through the rule.
	const first: Record<string, [number, Json, Json][]> = {};
	for (const entry of entries) {
		const start = pointStart(plain(entry));
		if (start && start.name in seqs && seqs[start.name].body !== null) (first[start.name] ??= []).push([start.at, start.x, start.y]);
	}
	const names = new Set(Object.keys(first));
	for (const name of names) {
		const { index, shift, body } = seqs[name];
		const parts = pointParts(body!, names, { n: 0 });
		if (!parts) continue;
		seqs[name] = { index, shift, body: null, starts: [], point: true };
		seqs[coordinateOf(name, 'x')] = { index, shift, body: parts[0], starts: first[name].map(([at, x]) => [at, x]) };
		seqs[coordinateOf(name, 'y')] = { index, shift, body: parts[1], starts: first[name].map(([at, , y]) => [at, y]) };
	}
	return seqs;
}

/** P_0 = (1; 2): a point a sequence of points starts from. */
function pointStart(j: Json): { name: string; at: number; x: Json; y: Json } | null {
	if (head(j) !== 'Equal' || (j as Json[]).length !== 3) return null;
	const [, left, right] = j as Json[];
	if (typeof left !== 'string' || head(right) !== 'Delimiter') return null;
	const pair = items((right as Json[])[1]);
	const written = /^([A-Za-z])_(\d+)$/.exec(letter(left));
	return written && pair.length === 2 ? { name: written[1], at: Number(written[2]), x: pair[0], y: pair[1] } : null;
}

/**
 * A formula on points as the two formulas of its coordinates: a point by its name, a term of a sequence of points,
 * a pair, sums and differences of points, a point times or over a number, the midpoint of two, and one by chance
 * among some. Null for anything that is not a point.
 */
function pointParts(j: Json, sequences: Set<string>, sites: { n: number }): [Json, Json] | null {
	const both = (f: (axis: 0 | 1) => Json): [Json, Json] => [f(0), f(1)];
	const each = (list: Json[]) => {
		const parts = list.map((a) => pointParts(a, sequences, sites));
		return parts.every((p): p is [Json, Json] => p !== null) ? parts : null;
	};
	if (typeof j === 'string') {
		const name = letter(j);
		const term = /^([A-Za-z])_([nkijm])$/.exec(name);
		if (term && sequences.has(term[1])) return [['Subscript', coordinateOf(term[1], 'x'), term[2]], ['Subscript', coordinateOf(term[1], 'y'), term[2]]];
		return /^[A-Z](?:_\d+)?$/.test(name) ? [`x_${name}`, `y_${name}`] : null;
	}
	if (!isArray(j)) return null;
	const [h, ...args] = j as [string, ...Json[]];
	if (h === 'Subscript' && typeof args[0] === 'string' && sequences.has(args[0])) return [['Subscript', coordinateOf(args[0], 'x'), args[1]], ['Subscript', coordinateOf(args[0], 'y'), args[1]]];
	if (h === 'Delimiter') {
		const inside = args.length ? items(args[0]) : [];
		return inside.length === 2 ? [inside[0], inside[1]] : inside.length === 1 ? pointParts(inside[0], sequences, sites) : null;
	}
	if (h === 'Add' || h === 'Subtract') {
		const parts = each(args);
		return parts && both((axis) => [h, ...parts.map((p) => p[axis])]);
	}
	if (h === 'Negate') {
		const part = pointParts(args[0], sequences, sites);
		return part && both((axis) => ['Negate', part[axis]]);
	}
	if (h === 'Divide' || h === 'Rational') {
		const part = pointParts(args[0], sequences, sites);
		return part && both((axis) => ['Divide', part[axis], args[1]]);
	}
	const call = h === 'InvisibleOperator' && args.length === 2 && typeof args[0] === 'string' && head(args[1]) === 'Delimiter' ? { name: args[0], of: (args[1] as Json[]).length > 1 ? items((args[1] as Json[])[1]) : [] } : h === 'Random' ? { name: 'casuale', of: args } : null;
	if (call?.name === 'puntomedio' || call?.name === 'medio') {
		const parts = call.of.length === 2 ? each(call.of) : null;
		return parts && both((axis) => ['Divide', ['Add', parts[0][axis], parts[1][axis]], 2]);
	}
	if (call?.name === 'casuale' || call?.name === 'random') {
		const list = call.of.length === 1 && head(call.of[0]) === 'Set' ? (call.of[0] as Json[]).slice(1).flatMap((a) => (head(a) === 'Delimiter' ? items((a as Json[])[1]) : [a])) : call.of;
		const parts = list.length ? each(list) : null;
		if (!parts) return null;
		// one draw for the two coordinates: the same point for both
		const site = siteOf(list, 1000 + sites.n++);
		return both((axis) => ['RandomPick', site, ...parts.map((p) => p[axis])]);
	}
	if (h === 'Multiply' || h === 'InvisibleOperator') {
		const parts = args.map((a) => pointParts(a, sequences, sites));
		const at = parts.findIndex((p) => p !== null);
		if (at < 0 || parts.some((p, i) => p !== null && i !== at)) return null;
		return both((axis) => ['Multiply', ...args.map((a, i) => (i === at ? parts[at]![axis] : a))]);
	}
	return null;
}

/** Whether a sequence's rule reads other terms of the sequence itself: then it needs a value to start from. */
function readsItself(j: Json, name: string): boolean {
	if (typeof j === 'string') return SUBSCRIPTED.exec(letter(j))?.[1] === name;
	if (!isArray(j)) return false;
	if (j[0] === 'Subscript' && j[1] === name) return true;
	return j.slice(1).some((a) => readsItself(a, name));
}

/** The sequences of an entry in normal form. A term in a formula points here: Term(name, index, system). */
interface SeqSystem {
	seqs: Record<string, { index: string; shift: number; body: Json | null; starts: [number, Json][] }>;
	run?: SeqRuntime;
}

/** The term of a sequence in normal form; the sequence itself is put in normal form the first time it is met. */
function termOf(name: string, index: Json, ctx: Context): Json {
	const system = (ctx.flags.system ??= { seqs: {} });
	if (!(name in system.seqs)) {
		const { index: letterOfIndex, shift, body, starts } = ctx.seqs[name];
		// in place before its rule is read: the rule reads the sequence itself
		const own = (system.seqs[name] = { index: letterOfIndex, shift, body: null as Json | null, starts: [] as [number, Json][] });
		const outside = { ...ctx, open: [], slots: {} };
		own.body = body === null ? null : normalize(body, outside);
		own.starts = starts.map(([at, value]) => [at, normalize(value, outside)]);
	}
	return ['Term', name, index, system as unknown as Json];
}

interface SeqRun {
	index: string;
	shift: number;
	body: Evaluator | null;
	starts: Map<number, Evaluator>;
	/** The first index it has a value at, for a sequence that starts from given values. */
	first: number;
	recurrent: boolean;
	vals: Float64Array;
	mark: Uint32Array;
}

interface SeqRuntime {
	seqs: Record<string, SeqRun>;
	/** The letters the sequences read, their indexes apart. */
	letters: Set<string>;
	term: (q: SeqRun, m: number, s: Scope) => number;
}

/**
 * The sequences as functions of numbers. The terms that come from a recurrence are found by climbing from the
 * values given, each once, all the sequences together (a_{n+1} may read b_n and b_{n+1} read a_n); they are kept
 * until one of the letters they depend on changes, so the next point of the plane starts again from the bottom
 * and a_3 after a_10, at the same point, is only read.
 */
function runtimeOf(system: SeqSystem): SeqRuntime {
	if (system.run) return system.run;
	const letters = new Set<string>();
	const seqs: Record<string, SeqRun> = {};
	let depth = 0;
	let epoch = 1;
	let lo = 0;
	let top = -1;
	let recurrent: SeqRun[] = [];
	let deps: string[] = [];
	let last = new Float64Array(0);

	const compute = (q: SeqRun, i: number, s: Scope): number => {
		const given = q.starts.get(i);
		if (given) return given(s);
		if (!q.body) return NaN;
		const saved = s[q.index];
		s[q.index] = i - q.shift;
		const value = q.body(s);
		s[q.index] = saved;
		return value;
	};
	const inner = (q: SeqRun, m: number, s: Scope): number => {
		if (!q.recurrent) {
			// a term by its formula: no need to keep it
			if (depth > 60) return NaN;
			depth++;
			const value = compute(q, m, s);
			depth--;
			return value;
		}
		const k = m - lo;
		if (m < q.first || k > MAX_TERMS) return NaN;
		if (q.mark[k] === epoch) return q.vals[k];
		// a term of the same index as the one being found, or one ahead of it
		if (depth > 60) return NaN;
		depth++;
		const value = compute(q, m, s);
		depth--;
		q.vals[k] = value;
		q.mark[k] = epoch;
		return value;
	};
	const run: SeqRuntime = {
		seqs,
		letters,
		term: (q, m, s) => {
			if (!Number.isFinite(m)) return NaN;
			if (depth > 0) return inner(q, m, s);
			// the terms kept are those of the point they were found at
			let same = true;
			for (let i = 0; i < deps.length; i++) {
				const now = s[deps[i]];
				if (now !== last[i] && !(now !== now && last[i] !== last[i])) {
					last[i] = now;
					same = false;
				}
			}
			if (!same) {
				epoch++;
				top = lo - 1;
			}
			depth++;
			const reach = Math.min(m, lo + MAX_TERMS);
			for (let i = top + 1; i <= reach; i++)
				for (const r of recurrent) {
					if (i < r.first || r.mark[i - lo] === epoch) continue;
					r.vals[i - lo] = compute(r, i, s);
					r.mark[i - lo] = epoch;
				}
			if (reach > top) top = reach;
			const value = inner(q, m, s);
			depth--;
			return value;
		}
	};
	system.run = run;
	for (const [name, q] of Object.entries(system.seqs)) {
		const starts = new Map<number, Evaluator>();
		const made: SeqRun = { index: q.index, shift: q.shift, body: null, starts, first: -Infinity, recurrent: q.starts.length > 0, vals: new Float64Array(0), mark: new Uint32Array(0) };
		seqs[name] = made;
	}
	for (const [name, q] of Object.entries(system.seqs)) {
		const made = seqs[name];
		made.body = q.body === null ? null : compile(q.body, letters);
		for (const [at, value] of q.starts) made.starts.set(at, compile(value, letters));
		if (made.recurrent) {
			made.first = Math.min(...q.starts.map(([at]) => at));
			made.vals = new Float64Array(MAX_TERMS + 1);
			made.mark = new Uint32Array(MAX_TERMS + 1);
		}
	}
	for (const q of Object.values(seqs)) letters.delete(q.index);
	recurrent = Object.values(seqs).filter((q) => q.recurrent);
	lo = recurrent.length ? Math.min(...recurrent.map((q) => q.first)) : 0;
	top = lo - 1;
	deps = [...letters];
	last = new Float64Array(deps.length).fill(NaN);
	return run;
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

/** f(x), g(t) or h(x; y) on the left of "=": the letter of the function and the letters it is a function of, or null. */
function namedLeft(j: Json): { name: string; vars: string[] } | null {
	if (head(j) !== 'InvisibleOperator' || (j as Json[]).length !== 3) return null;
	const [, name, arg] = j as Json[];
	if (!isName(name) || head(arg) !== 'Delimiter') return null;
	const vars = items((arg as Json[])[1]);
	const letters = vars.every((v) => typeof v === 'string' && /^[a-zA-Z]$/.test(v) && v !== 'e' && v !== name);
	return vars.length >= 1 && letters && new Set(vars).size === vars.length ? { name, vars: vars as string[] } : null;
}

/** Whether the letter appears as a value (heads and the wrappers of strings are not letters). */
function mentions(j: Json, name: string): boolean {
	if (j === name) return true;
	return isArray(j) && j.slice(1).some((a) => mentions(a, name));
}

/** The parse with some letters written as others, all at once. */
function renamedAll(j: Json, names: Record<string, string>): Json {
	if (typeof j === 'string') return j in names ? names[j] : j;
	return isArray(j) ? [j[0], ...j.slice(1).map((a) => renamedAll(a, names))] : j;
}
const renamed = (j: Json, from: string, to: string) => renamedAll(j, { [from]: to });

/** The functions named in the entries of a plotter: every row "f(x) = …" gives its letter a meaning for the others. */
export function definitions(entries: Json[]): Definitions {
	const defs: Definitions = {};
	for (const entry of entries) {
		const j = plain(entry);
		if (head(j) !== 'Equal' || (j as Json[]).length !== 3) continue;
		const left = namedLeft((j as Json[])[1]);
		// the first row that names a letter says what it is: a later "h(x; y) = 4" is an equation
		if (left && !(left.name in defs)) defs[left.name] = { vars: left.vars, body: (j as Json[])[2] };
	}
	return defs;
}

/** The names of the points written in the entries of a plotter: every row "A = (2; 3)" gives its letter two coordinates the others can use. */
export function pointNames(entries: Json[]): string[] {
	const names: string[] = [];
	for (const entry of entries) {
		const j = plain(entry);
		if (head(j) !== 'Equal' || (j as Json[]).length !== 3) continue;
		const [, left, right] = j as Json[];
		if (isLetter(left) && head(right) === 'Delimiter' && items((right as Json[])[1]).length === 2) names.push(letter(left));
	}
	return names;
}

/** The names a function gets when the student has not given one, in order: f, g, h, then the letters least used for something else. */
const NAMES = 'fghpqrsuvwklmnabcdijoz';

/** The first letter free to name a function: not the name of another, not a letter any entry reads. Null when none is left. */
export function freeName(entries: Json[]): string | null {
	const used = entries.map(plain);
	return [...NAMES].find((name) => !used.some((j) => mentions(j, name))) ?? null;
}

/** Whether the entry is a function of x written without a name: "x² − 1", not "f(x) = …", "y = …" or a derivative on its own. */
export function isUnnamedFunction(json: Json, defs: Definitions = {}, options: ReadOptions = {}): boolean {
	const j = plain(json);
	const h = head(j);
	if (h === 'Equal' || h === 'Prime' || (h !== null && h in RELATIONS)) return false;
	return readEntry(j, defs, options).kind === 'function';
}

/** The derivative of a function in normal form as a function of numbers; where the rules do not reach, no slope. */
function slope(form: Json): Evaluator {
	try {
		return compile(derivative(form), new Set());
	} catch {
		return () => NaN;
	}
}

/** Two coordinates between brackets: a curve (x(t); y(t)) when they are written in t, a point otherwise. */
function pairEntry(pair: Json[], ctx: Context): Entry {
	const letters = new Set<string>();
	const forms = pair.map((c) => normalize(c, ctx));
	const [x, y] = forms.map((f) => compile(f, letters));
	if (letters.has('x') || letters.has('y')) throw new FormulaError('Tra le parentesi vanno due coordinate, (2; 3), o una curva scritta con la t: (cos t; sin t).');
	if (letters.has('t')) return { kind: 'parametric', x, y, params: paramsOf(letters) };
	return { kind: 'point', x, y, params: paramsOf(letters), free: forms.every((f) => typeof f === 'number') };
}

/** The entry a MathJSON value stands for. Never throws: what cannot be drawn is an entry of kind 'error'. */
export function readEntry(json: Json, defs: Definitions = {}, options: ReadOptions = {}): Entry {
	const j = plain(json);
	if (j === 'Nothing' || j === '') return { kind: 'empty' };
	// an integral sign with nothing to integrate is not read as an integral at all
	if (JSON.stringify(j).includes('\\\\int')) return { kind: 'error', message: NO_INTEGRAND };
	const ctx: Context = { defs, open: [], flags: { truncated: false, bound: 0, forms: new Map() }, degrees: !!options.degrees, points: new Set(options.points), slots: {}, seqs: options.sequences ?? {} };
	const note = () => (ctx.flags.truncated ? { note: TRUNCATED } : {});
	const constant = (letters: Set<string>) => (letters.has('x') ? {} : { constant: true });
		try {
		const h = head(j);
		const args = isArray(j) ? j.slice(1) : [];

		// a_{n+1} = 2a_n + 1, a_n = 2n + 1, and the values a sequence starts from
		const row = sequenceRow(j);
		if (row && row.name in ctx.seqs) {
			const letters = new Set<string>();
			const seq = ctx.seqs[row.name];
			if ('start' in row) {
				compile(normalize(row.start.value, ctx), letters);
				return { kind: 'given', params: paramsOf(letters) };
			}
						if (seq.point) {
				// a sequence of points: its terms are points of the plane
				const [qx, qy] = [ctx.seqs[coordinateOf(row.name, 'x')], ctx.seqs[coordinateOf(row.name, 'y')]];
								// both in normal form before either is made to run: the two sequences are computed together
				const [tx, ty] = [termOf(coordinateOf(row.name, 'x'), qx.index, ctx), termOf(coordinateOf(row.name, 'y'), qy.index, ctx)];
				const x = compile(tx, letters);
				const y = compile(ty, letters);
				letters.delete(qx.index);
				return { kind: 'orbit', name: row.name, index: qx.index, x, y, from: Math.min(...qx.starts.map(([at]) => at)), params: paramsOf(letters) };
			}
			if (JSON.stringify(seq.body) !== JSON.stringify(row.rule.body)) throw new FormulaError(`La successione ${row.name} ha già la sua regola in un’altra riga.`);
			const { index, shift, body, starts } = seq;
			if ((shift > 0 || (body !== null && readsItself(body, row.name))) && !starts.length) throw new FormulaError(`Alla successione ${row.name} manca il valore da cui parte: scrivi ${row.name}_0 = … in un’altra riga.`);
						const f = compile(termOf(row.name, index, ctx), letters);
			letters.delete(index);
			// a_{n+1} = g(a_n), with nothing else of the sequence and no n in g: the rule as a function of x
			let step: Evaluator | undefined;
			if (shift === 1 && body !== null) {
				const own = (j: Json): Json => {
					if (typeof j === 'string') return letter(j) === `${row.name}_${index}` ? 'x' : j;
					if (!isArray(j)) return j;
					return j[0] === 'Subscript' && j[1] === row.name && j[2] === index ? 'x' : [j[0], ...j.slice(1).map(own)];
				};
				const rule = own(body);
				if (!readsItself(rule, row.name) && !mentions(rule, index)) {
					try {
						const ruleLetters = new Set<string>();
						const g = compile(normalize(rule, ctx), ruleLetters);
						if (!ruleLetters.has('y')) step = g;
					} catch {
						// a rule the cobweb cannot draw: the sequence is there all the same
					}
				}
			}
			return { kind: 'sequence', ...(step ? { step } : {}), name: row.name, index, f, ...(starts.length ? { from: Math.min(...starts.map(([at]) => at)) } : {}), plane: letters.has('x') || letters.has('y'), params: paramsOf(letters) };
		}

		// (x(t), y(t))
		if (h === 'Delimiter') {
			const pair = items(args[0]);
			if (pair.length === 2) {
				return pairEntry(pair, ctx);
			}
		}

		if (h === 'Equal' && args.length === 2) {
			const [left, right] = args;
			// a row that names a function, unless the letter already means another one: then it is an equation
			const candidate = namedLeft(left);
			const named = candidate && (!(candidate.name in defs) || JSON.stringify(defs[candidate.name]) === JSON.stringify({ vars: candidate.vars, body: right })) ? candidate : null;
			const rightLetters = new Set<string>();
						// y′ = x − y, dy/dx = x − y: the slopes of a differential equation
			if ((head(left) === 'Prime' && (left as Json[])[1] === 'y' && ((left as Json[])[2] ?? 1) === 1) || (head(left) === 'D' && (left as Json[])[1] === 'y' && (left as Json[])[2] === 'x' && (left as Json[]).length === 3)) {
				const letters = new Set<string>();
				const f = compile(normalize(right, ctx), letters);
				return { kind: 'field', f, params: paramsOf(letters) };
			}
			// A = (2; 3): a point with a name
			if (isLetter(left) && head(right) === 'Delimiter' && items((right as Json[])[1]).length === 2) {
				const point = pairEntry(items((right as Json[])[1]), ctx);
				if (point.kind !== 'point') throw new FormulaError('Un punto ha due coordinate senza la t: A = (2; 3).');
				return { ...point, name: letter(left) };
			}
			// r = f(θ): a polar curve, unless the right side is in x and y, where r is a parameter (x² + y² = r reversed)
			if (isRadius(left)) {
				const polar = new Set<string>();
				const r = compile(normalize(right, ctx), polar);
				if (!polar.has('x') && !polar.has('y') && !polar.has('t')) return { kind: 'polar', r, params: paramsOf(polar) };
			}
			if (named) {
				const { name, vars } = named;
				// read as f's own body, so a function that uses itself is caught
				const own = { ...ctx, defs: { ...defs, [name]: { vars, body: right } } };
				if (vars.length > 1) {
					compile(bodyOf(name, own), rightLetters);
					return { kind: 'definition', name, vars, params: paramsOf(rightLetters).filter((l) => l[0] !== '@') };
				}
				const [variable] = vars;
				if (variable !== 'x' && mentions(right, 'x')) throw new FormulaError(`${name}(${variable}) è una funzione di ${variable}: a destra non può esserci anche la x.`);
				// whatever letter it was written in, the curve is drawn along the x axis
				const form = applied(name, 0, ['x'], own);
				const f = compile(form, rightLetters);
				if (rightLetters.has('y')) throw new FormulaError(`${name}(${variable}) è una funzione di ${variable}: a destra non può esserci la y.`);
				return { kind: 'function', f, d: slope(form), params: paramsOf(rightLetters), name, ...constant(rightLetters), ...note() };
			}
			const form = normalize(right, ctx);
			const r = compile(form, rightLetters);
			if (left === 'y' && !rightLetters.has('y')) return { kind: 'function', f: r, d: slope(form), params: paramsOf(rightLetters), ...constant(rightLetters), ...note() };
			const letters = new Set(rightLetters);
			const l = compile(normalize(left, ctx), letters);
			return { kind: 'implicit', f: (s) => l(s) - r(s), params: paramsOf(letters) };
		}

		// y > x², 0 < x < 2, x > 0 and y > 0, or a system in one brace: a region
		if (h && (h in RELATIONS || h === 'And' || h === 'Or' || h === 'Not' || h === 'List')) {
			const letters = new Set<string>();
			const strict = { all: true };
			let system = j;
			if (h === 'List') {
				const lines = args.filter((a) => a !== 'Nothing');
				if (!lines.length) return { kind: 'empty' };
				if (!lines.every((a) => head(a) !== null && (head(a)! in RELATIONS || head(a) === 'And' || head(a) === 'Or'))) throw new FormulaError(SYSTEM);
				system = ['And', ...lines];
			}
			const f = compileMargin(condition(system, ctx), letters, strict);
			return { kind: 'inequality', f, strict: strict.all, params: paramsOf(letters) };
		}

		const letters = new Set<string>();
		const form = normalize(j, ctx);
		const f = compile(form, letters);
		if (letters.has('y')) throw new FormulaError('Con la y serve un segno: scrivi un’equazione, come x² + y² = 4.');
		return { kind: 'function', f, d: slope(form), params: paramsOf(letters), ...constant(letters), ...note() };
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
		// a name written by the proposals: MathLive gives \operatorname{\mathrm{mcd}} back
		.replace(/\\operatorname\{\\mathrm\{([a-z]+)\}\}/g, '\\operatorname{$1}')
		.replace(/\\(?:,|;|!|:|quad|qquad)(?![A-Za-z])/g, ' ')
		.trim();
}
