import type { Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { parseDecimal } from './numbers';

/**
 * Physical quantities for the physics and chemistry tools: exact rationals on BigInt (Avogadro's number and a volume
 * in cubic metres fit side by side), numbers in scientific notation, units with their factor to the unit the formula
 * works in, and the steps every formula shares: the formula, the inverse formula, the data in the formula's units, the
 * substitution with the units, the result in the unit the student asked for.
 */

const abs = (x: bigint) => (x < 0n ? -x : x);
function bgcd(a: bigint, b: bigint): bigint {
	a = abs(a);
	b = abs(b);
	while (b) [a, b] = [b, a % b];
	return a;
}
const TEN = 10n;
const pow10n = (k: number) => TEN ** BigInt(k);

/** An exact rational on BigInt, always reduced, with a positive denominator. */
export class Q {
	private constructor(
		readonly n: bigint,
		readonly d: bigint
	) {}

	static of(n: bigint | number, d: bigint | number = 1n): Q {
		let nn = BigInt(n);
		let dd = BigInt(d);
		if (dd === 0n) throw new Error('Q: division by zero');
		if (dd < 0n) {
			nn = -nn;
			dd = -dd;
		}
		if (nn === 0n) return new Q(0n, 1n);
		const g = bgcd(nn, dd);
		return new Q(nn / g, dd / g);
	}

	static from(r: Rational): Q {
		return Q.of(BigInt(r.num), BigInt(r.den));
	}

	static pow10(k: number): Q {
		return k >= 0 ? Q.of(pow10n(k)) : Q.of(1n, pow10n(-k));
	}

	/** A float, kept to 15 significant digits: for square roots, the only irrational results. */
	static fromNumber(x: number): Q {
		const [m, e] = x.toExponential(14).split('e');
		const digits = m.replace('.', '').replace('-', '');
		const q = Q.of(BigInt(digits) * (x < 0 ? -1n : 1n)).mul(Q.pow10(Number(e) - 14));
		return q;
	}

	add(o: Q): Q {
		return Q.of(this.n * o.d + o.n * this.d, this.d * o.d);
	}
	sub(o: Q): Q {
		return Q.of(this.n * o.d - o.n * this.d, this.d * o.d);
	}
	mul(o: Q): Q {
		return Q.of(this.n * o.n, this.d * o.d);
	}
	div(o: Q): Q {
		if (o.n === 0n) throw new Error('Q: division by zero');
		return Q.of(this.n * o.d, this.d * o.n);
	}
	neg(): Q {
		return Q.of(-this.n, this.d);
	}
	abs(): Q {
		return Q.of(abs(this.n), this.d);
	}
	sign(): -1 | 0 | 1 {
		return this.n === 0n ? 0 : this.n > 0n ? 1 : -1;
	}
	cmp(o: Q): -1 | 0 | 1 {
		const x = this.n * o.d - o.n * this.d;
		return x === 0n ? 0 : x > 0n ? 1 : -1;
	}
	isZero(): boolean {
		return this.n === 0n;
	}
	isOne(): boolean {
		return this.n === 1n && this.d === 1n;
	}
	toNumber(): number {
		return Number(this.n) / Number(this.d);
	}
	toString(): string {
		return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`;
	}
}

export const q = (n: number | bigint, d: number | bigint = 1) => Q.of(n, d);

/** A value and whether it is already rounded (a square root, or a conversion that does not end). */
export interface Val {
	q: Q;
	approx: boolean;
}
export const exact = (x: Q): Val => ({ q: x, approx: false });

function isqrt(n: bigint): bigint {
	if (n < 2n) return n;
	let x = BigInt(Math.floor(Math.sqrt(Number(n))));
	while (x * x > n) x -= 1n;
	while ((x + 1n) * (x + 1n) <= n) x += 1n;
	return x;
}

/** The square root of a non-negative rational: exact when numerator and denominator are squares. */
export function sqrtVal(v: Val): Val {
	const { n, d } = v.q;
	const a = isqrt(n);
	const b = isqrt(d);
	if (a * a === n && b * b === d) return { q: Q.of(a, b), approx: v.approx };
	return { q: Q.fromNumber(Math.sqrt(v.q.toNumber())), approx: true };
}

// ---------------------------------------------------------------------------------------------------------------
// Numbers in and out.

/**
 * A number as a student writes it: "12,5", "1.000", "-3", and in scientific notation "6,022e23", "3·10^8",
 * "3*10^-4", "3 x 10^8". Null when it is not a number.
 */
export function parseNumber(input: string): Q | null {
	let s = input.trim().replace(/\s+/g, '').replace(/[−–]/g, '-');
	if (!s) return null;
	let exp = 0;
	const alone = /^10\^\{?\(?([+-]?\d{1,3})\)?\}?$/.exec(s);
	if (alone) return Math.abs(Number(alone[1])) > 40 ? null : Q.pow10(Number(alone[1]));
	const m = /^(.+?)(?:[eE]([+-]?\d{1,3})|(?:[·*×xX•]|\\cdot)10\^\{?\(?([+-]?\d{1,3})\)?\}?)$/.exec(s);
	if (m) {
		s = m[1];
		exp = Number(m[2] ?? m[3]);
		if (Math.abs(exp) > 40) return null;
	}
	const r = parseDecimal(s);
	if (!r) return null;
	return Q.from(r).mul(Q.pow10(exp));
}

/** floor(log10(n/d)) for a positive rational. */
function exponent(x: Q): number {
	const { n, d } = x;
	const e = n.toString().length - d.toString().length;
	const ge = e >= 0 ? n >= d * pow10n(e) : n * pow10n(-e) >= d;
	return ge ? e : e - 1;
}

/** n/d rounded half up to an integer, for positive n and d. */
const roundDiv = (n: bigint, d: bigint) => (2n * n + d) / (2n * d);

const groupInt = (s: string, sep: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s);

export interface Formatted {
	tex: string;
	text: string;
	/** False when the value shown is rounded. */
	exact: boolean;
}

/**
 * A value as the books write it. Between 0,001 and 999 999 as a decimal: exact when it ends within six decimals,
 * else rounded to four significant digits (at least two decimals). Outside that range in scientific notation with a
 * mantissa of at most four significant digits: 6,022 · 10^23. Decimal comma, thin space for thousands.
 */
export function fmt(v: Val | Q): Formatted {
	const val = v instanceof Q ? exact(v) : v;
	const x = val.q;
	if (x.isZero()) return { tex: '0', text: '0', exact: !val.approx };
	const sign = x.sign() < 0 ? '-' : '';
	const { n, d } = x.abs();
	let e = exponent(x.abs());
	if (e >= -3 && e <= 5) {
		let digits = 6;
		let isExact = !val.approx && (n * pow10n(6)) % d === 0n;
		if (!isExact) digits = Math.max(2, 3 - e);
		const scaled = roundDiv(n * pow10n(digits), d);
		const int = (scaled / pow10n(digits)).toString();
		const frac = (scaled % pow10n(digits)).toString().padStart(digits, '0').replace(/0+$/, '');
		if (scaled === 0n) isExact = false;
		return {
			tex: `${sign}${groupInt(int, '\\,')}${frac ? `{,}${frac}` : ''}`,
			text: `${sign}${groupInt(int, ' ')}${frac ? `,${frac}` : ''}`,
			exact: isExact
		};
	}
	// Scientific notation: a mantissa of four significant digits.
	const shift = 3 - e;
	const num = shift >= 0 ? n * pow10n(shift) : n;
	const den = shift >= 0 ? d : d * pow10n(-shift);
	const isExact = !val.approx && num % den === 0n;
	let scaled = roundDiv(num, den);
	if (scaled === 10000n) {
		scaled = 1000n;
		e += 1;
	}
	const s = scaled.toString();
	const frac = s.slice(1).replace(/0+$/, '');
	return {
		tex: `${sign}${s[0]}${frac ? `{,}${frac}` : ''} \\cdot 10^{${e}}`,
		text: `${sign}${s[0]}${frac ? `,${frac}` : ''} · 10^${e}`,
		exact: isExact
	};
}

/** "=" or "≈" before a value. */
export const rel = (v: Val | Q) => (fmt(v).exact ? '=' : '\\approx');

// ---------------------------------------------------------------------------------------------------------------
// Units and quantities.

export interface Unit {
	/** Short id for the address: "kmh". */
	id: string;
	/** For the select: "km/h". */
	label: string;
	/** In a formula: "\\text{km/h}". */
	tex: string;
	/** Value in the formula's unit = value in this unit × factor. */
	factor: Q;
}

export const unit = (id: string, label: string, tex: string, factor: Q = q(1)): Unit => ({ id, label, tex, factor });

export interface Quantity {
	/** Key in the address and in the inputs: "v". */
	key: string;
	/** Symbol in LaTeX: "v_0". */
	sym: string;
	/** In words, lower case: "velocità". */
	name: string;
	/** With the article: "la velocità". */
	the: string;
	/** The first unit is the one the formula works in (SI for physics). */
	units: Unit[];
	/** Which values make sense: > 0, ≥ 0, any sign. */
	sign: 'pos' | 'nonneg' | 'any';
	/** An example value for the error messages: "12,5". */
	example: string;
}

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const baseUnit = (qt: Quantity) => qt.units[0];
export const findUnit = (qt: Quantity, id: string | undefined) => qt.units.find((u) => u.id === id) ?? qt.units[0];

/** A value in a formula with its unit: "12{,}5\\ \\text{m/s}", in brackets when negative and `par` is set. */
export function vu(v: Val | Q, u: Unit, par = false): string {
	const f = fmt(v);
	const s = u.tex ? `${f.tex}\\ ${u.tex}` : f.tex;
	return par && f.tex.startsWith('-') ? `(${s})` : s;
}
/** The same for the copy button and the labels: "12,5 m/s". */
export const vuText = (v: Val | Q, u: Unit) => (u.label ? `${fmt(v).text} ${u.label}` : fmt(v).text);

/** A datum read from the inputs: the number as written, its unit, and its value in the formula's unit. */
export interface Datum {
	qt: Quantity;
	raw: Q;
	unit: Unit;
	/** In the formula's unit. */
	base: Val;
}

/** Reads one quantity; an error sentence when the value is missing, not a number or out of range. */
export function readDatum(qt: Quantity, value: string | undefined, unitId: string | undefined): Datum | string {
	const raw = parseNumber(value ?? '');
	if (!raw) return `Scrivi ${qt.the}, per esempio ${qt.example}.`;
	if (qt.sign === 'pos' && raw.sign() <= 0) return `${cap(qt.the)} deve essere maggiore di zero: scrivi per esempio ${qt.example}.`;
	if (qt.sign === 'nonneg' && raw.sign() < 0) return `${cap(qt.the)} non può essere un numero negativo: scrivi per esempio ${qt.example}.`;
	const u = findUnit(qt, unitId);
	return { qt, raw, unit: u, base: { q: raw.mul(u.factor), approx: false } };
}

/** A power of ten or an integer, for the "how to convert" column: 1000, 10^{6}. */
function intTexBig(n: bigint): string {
	const s = n.toString();
	if (/^10{4,}$/.test(s)) return `10^{${s.length - 1}}`;
	return groupInt(s, '\\,');
}

/** How to go from a unit to another, as an operation: "\\cdot 1000", ": 3{,}6". Empty for the same unit. */
export function howTex(factor: Q): string {
	if (factor.isOne()) return '';
	if (factor.d === 1n) return `\\cdot ${intTexBig(factor.n)}`;
	if (factor.n === 1n) return `: ${intTexBig(factor.d)}`;
	const inv = q(1).div(factor);
	const fi = fmt(inv);
	if (fi.exact) return `: ${fi.tex}`;
	return `\\cdot ${fmt(factor).tex}`;
}

/**
 * The step that takes the data to the formula's units, as a table; null when they are there already. Rounded
 * conversions are marked with "≈".
 */
export function unitsStep(data: Datum[], say = 'Porta i dati nelle unità della formula.'): Step | null {
	const moved = data.filter((x) => !x.unit.factor.isOne());
	if (!moved.length) return null;
	return {
		say,
		table: {
			head: ['Grandezza', 'Dato', 'Come', 'Nella formula'],
			rows: moved.map((x) => [`$${x.qt.sym}$`, `$${vu(x.raw, x.unit)}$`, `$${howTex(x.unit.factor)}$`, `$${fmt(x.base).exact ? '' : '\\approx '}${vu(x.base, baseUnit(x.qt))}$`])
		}
	};
}

/** The table of symbols under a formula. */
export function symbolsTable(qts: Quantity[]): Step['table'] {
	return { head: ['Simbolo', 'Grandezza', 'Unità'], rows: qts.map((x) => [`$${x.sym}$`, x.name, `$${baseUnit(x).tex || '\\text{numero puro}'}$`]) };
}

/**
 * The end of every calculation: the result in the formula's unit, then in the unit the student chose when it is
 * another, with its step. Returns the extra step (or null), the rows and the text to copy.
 */
export function finish(qt: Quantity, result: Val, targetId: string | undefined): { step: Step | null; rows: ResultRow[]; copy: string; target: Val; unit: Unit } {
	const base = baseUnit(qt);
	const u = findUnit(qt, targetId);
	const approx = (v: Val) => (fmt(v).exact ? '' : '\\approx ');
	if (u === base || u.factor.isOne()) {
		return { step: null, rows: [{ label: cap(qt.name), value: `$${approx(result)}${vu(result, u)}$` }], copy: vuText(result, u), target: result, unit: u };
	}
	const target: Val = { q: result.q.div(u.factor), approx: result.approx };
	const step: Step = {
		say: `Scrivi il risultato in ${u.label}.`,
		math: [`${qt.sym} ${rel(result)} ${vu(result, base)}`, `= ${fmt(result).tex} ${howTex(q(1).div(u.factor))}\\ ${u.tex}`, `${rel(target)} \\hl{${vu(target, u)}}`]
	};
	return {
		step,
		rows: [
			{ label: cap(qt.name), value: `$${approx(target)}${vu(target, u)}$` },
			{ label: `${cap(qt.name)} in ${base.label}`, value: `$${approx(result)}${vu(result, base)}$` }
		],
		copy: vuText(target, u),
		target,
		unit: u
	};
}

/** More than five steps are grouped: each named step starts a part. */
export function grouped(steps: (Step & { part?: string })[]): Step[] {
	const out = steps.map(({ part, ...s }) => (steps.length > 5 && part ? { ...s, group: part } : s));
	if (out.length > 5 && !out[0].group) out[0] = { ...out[0], group: 'La formula' };
	return out;
}

export type Tagged = Step & { part?: string };

/** Runs a calculation, turning an arithmetic overflow or a division by zero into a gentle error. */
export function safely(run: () => Outcome): Outcome {
	try {
		return run();
	} catch {
		return fail('Con questi numeri il calcolo non si può fare: controlla i dati.');
	}
}

// ---------------------------------------------------------------------------------------------------------------
// Formulas with three quantities: P = A · B, written as the book writes it.

export interface ProductSpec {
	/** The product: s in s = v · t, m in d = m / V. */
	p: Quantity;
	a: Quantity;
	b: Quantity;
	/** Which quantity is alone in the formula of the book: s = v · t is 'p', d = m / V is 'a'. */
	main: 'p' | 'a' | 'b';
}

export type Role = 'p' | 'a' | 'b';

const hlIf = (s: string, on: boolean) => (on ? `\\hl{${s}}` : s);

/** The formula solved for one quantity, the unknown highlighted when `hl`. */
export function productFormula(spec: ProductSpec, role: Role, hl = false): string {
	const { p, a, b } = spec;
	if (role === 'p') return `${hlIf(p.sym, hl)} = ${a.sym} \\cdot ${b.sym}`;
	if (role === 'a') return `${hlIf(a.sym, hl)} = \\dfrac{${p.sym}}{${b.sym}}`;
	return `${hlIf(b.sym, hl)} = \\dfrac{${p.sym}}{${a.sym}}`;
}

/** How to get from the book's formula to the inverse one, in one sentence. */
function inverseHow(spec: ProductSpec, role: Role): string {
	const other = (r: Role) => spec[(['a', 'b'] as const).find((x) => x !== r)!].sym;
	if (spec.main === 'p') return `Dividi i due membri per $${other(role)}$.`;
	// main is a or b: P / other = main.
	const mainQ = spec[spec.main];
	const otherQ = spec[spec.main === 'a' ? 'b' : 'a'];
	if (role === 'p') return `Moltiplica i due membri per $${otherQ.sym}$.`;
	return `Moltiplica i due membri per $${spec[role].sym}$, poi dividili per $${mainQ.sym}$.`;
}

export interface ProductResult {
	outcome: Outcome;
	values?: Record<Role, Val>;
}

/**
 * Solves P = A · B for the quantity `find`, from the inputs in `state` (values under the quantity's key, units under
 * "u" + key). The unknown's unit select says in which unit to give the result.
 */
export function solveProduct(
	spec: ProductSpec,
	find: string,
	state: Record<string, string>,
	extra?: (values: Record<Role, Val>) => { step: Tagged; row: ResultRow }
): ProductResult {
	const roles: Role[] = ['p', 'a', 'b'];
	const role = roles.find((r) => spec[r].key === find) ?? spec.main;
	const known = roles.filter((r) => r !== role);
	const data: Partial<Record<Role, Datum>> = {};
	for (const r of known) {
		const d = readDatum(spec[r], state[spec[r].key], state[`u${spec[r].key}`]);
		if (typeof d === 'string') return { outcome: fail(d) };
		data[r] = d;
	}
	const unknown = spec[role];
	const steps: Tagged[] = [];
	const first = roles.map((r) => spec[r]).sort((x, y) => (x === spec[spec.main] ? -1 : y === spec[spec.main] ? 1 : 0));
	steps.push({ say: 'Scrivi la formula.', math: [productFormula(spec, spec.main, role === spec.main)], table: symbolsTable(first), part: 'La formula' });
	if (role !== spec.main) steps.push({ say: `Ricava ${unknown.the} dalla formula.`, math: [productFormula(spec, role, true)], then: inverseHow(spec, role) });
	const conv = unitsStep(known.map((r) => data[r]!));
	if (conv) steps.push({ ...conv, part: 'I dati' });

	const x = (r: Role) => data[r]!.base;
	const U = (r: Role) => baseUnit(spec[r]);
	let result: Val;
	let line: string;
	if (role === 'p') {
		result = { q: x('a').q.mul(x('b').q), approx: x('a').approx || x('b').approx };
		line = `${unknown.sym} = ${vu(x('a'), U('a'))} \\cdot ${vu(x('b'), U('b'))}`;
	} else {
		const other: Role = role === 'a' ? 'b' : 'a';
		if (x(other).q.isZero()) return { outcome: fail(`${cap(spec[other].the)} deve essere diversa da zero.`) };
		result = { q: x('p').q.div(x(other).q), approx: x('p').approx || x(other).approx };
		line = `${unknown.sym} = \\dfrac{${vu(x('p'), U('p'))}}{${vu(x(other), U(other))}}`;
	}
	steps.push({ say: 'Sostituisci i valori, con le loro unità.', math: [line, `${rel(result)} \\hl{${vu(result, baseUnit(unknown))}}`], part: 'Il calcolo' });
	const end = finish(unknown, result, state[`u${unknown.key}`]);
	if (end.step) steps.push(end.step);
	const values = { [role]: result, ...Object.fromEntries(known.map((r) => [r, x(r)])) } as Record<Role, Val>;
	const rows = [...end.rows];
	if (extra) {
		const more = extra(values);
		steps.push(more.step);
		rows.push(more.row);
	}
	return { outcome: { ok: true, rows, copy: end.copy, steps: grouped(steps) }, values };
}
