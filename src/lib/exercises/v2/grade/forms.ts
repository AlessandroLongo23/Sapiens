/**
 * Whether an answer, already right in value, is in the form the exercise asks for (vault/Decisioni/2026-09-30
 * Nella risposta aperta la forma conta solo dove è l'esercizio.md). Each check reads the tree as the student wrote
 * it; none of them looks at the value.
 */
import { gcd, q, type Rational } from '../rational';
import { type Node, bare, contains, evaluate, exact, symbols } from './node';
import { degree, isConstant, primitive, shapeKey, toPoly, type Poly } from './poly';

const ONE = q(1);
const isRoot = (n: Node) => n.t === 'root';
const isFractionalPower = (n: Node) => {
	if (n.t !== 'pow') return false;
	const e = exact(n.b);
	return !e || !e.isInteger();
};

/** The terms of a sum, signs dropped: "a − b + c" gives a, b, c. */
function terms(n: Node): Node[] {
	n = bare(n);
	if (n.t === 'add') return n.args.flatMap(terms);
	if (n.t === 'neg') return terms(n.a);
	return [n];
}

/** A number as a student writes one: an integer, a decimal, a fraction of integers, with its sign. */
export function numberLiteral(n: Node): { value: Rational; fraction: boolean; decimal: boolean } | null {
	n = bare(n);
	if (n.t === 'neg') {
		const a = numberLiteral(n.a);
		return a && { ...a, value: a.value.neg() };
	}
	if (n.t === 'num') return { value: n.v, fraction: false, decimal: !!n.decimal };
	if (n.t === 'div') {
		// a fraction bar between two plain numbers; (−120) : (−8) is a division still to do
		if (n.colon || n.a.t === 'paren' || n.b.t === 'paren') return null;
		const a = numberLiteral(n.a);
		const b = numberLiteral(n.b);
		if (!a || !b || a.fraction || b.fraction || a.decimal || b.decimal || b.value.isZero()) return null;
		return { value: a.value.div(b.value), fraction: true, decimal: false };
	}
	return null;
}

/** Whether a fraction of integers can still be reduced: 3/6, 8/2. */
export function reducible(n: Node): boolean {
	n = bare(n);
	if (n.t === 'neg') return reducible(n.a);
	if (n.t !== 'div') return false;
	const a = exact(n.a);
	const b = exact(n.b);
	if (!a || !b || !a.isInteger() || !b.isInteger()) return false;
	return Math.abs(b.num) === 1 || gcd(Math.abs(a.num), Math.abs(b.num)) > 1;
}

/**
 * A monomial in normal form: one numeric coefficient at most, each letter once, letters raised to whole powers,
 * the coefficient possibly as a fraction bar under the letters (x²/2).
 */
function isNormalMonomial(n: Node): boolean {
	let numbers = 0;
	const letters = new Set<string>();
	const walk = (m: Node, top: boolean): boolean => {
		m = bare(m);
		switch (m.t) {
			case 'num':
				numbers++;
				return true;
			case 'sym':
				if (letters.has(m.name)) return false;
				letters.add(m.name);
				return true;
			case 'pow': {
				const e = exact(m.b);
				// (b)³ is a power still to write out
				if (!e || !e.isInteger() || e.num < 2 || m.a.t !== 'sym') return false;
				return walk(m.a, false);
			}
			case 'neg':
				// −7y²z arrives as (−7)·y²·z: the sign is not part of the form
				return walk(m.a, top);
			case 'mul':
				return m.args.every((a) => walk(a, false));
			case 'div': {
				// 1/2 x, x^2/2: a coefficient written as a fraction bar
				if (numberLiteral(m) && !reducible(m)) {
					numbers++;
					return true;
				}
				const d = numberLiteral(m.b);
				if (!d || d.fraction || !d.value.isInteger()) return false;
				numbers++;
				return walk(m.a, false);
			}
			default:
				return false;
		}
	};
	return walk(n, true) && numbers <= 1;
}

/** A sum of monomials in normal form, like terms summed: "x² − 2x + 1", "−\frac{1}{10}x²z". */
export function isExpanded(n: Node): boolean {
	if (exact(n)?.isZero()) return true;
	const ts = terms(n);
	const seen = new Set<string>();
	for (const t of ts) {
		if (!isNormalMonomial(t)) return false;
		const p = toPoly(t);
		if (!p || p.size !== 1) return false;
		const k = [...p.keys()][0];
		if (seen.has(k)) return false;
		seen.add(k);
	}
	return true;
}

/** The factors of a product, each power of a non-constant base counted as many times as the exponent. */
function factorList(n: Node): { factors: Node[]; constants: Node[] } {
	const factors: Node[] = [];
	const constants: Node[] = [];
	const walk = (m: Node) => {
		m = bare(m);
		if (m.t === 'neg') return walk(m.a);
		if (m.t === 'mul') return m.args.forEach(walk);
		if (exact(m) !== null) return void constants.push(m);
		if (m.t === 'pow') {
			const e = exact(m.b);
			if (e && e.isInteger() && e.num > 1 && e.num <= 20 && exact(m.a) === null) {
				for (let k = 0; k < e.num; k++) walk(m.a);
				return;
			}
		}
		factors.push(m);
	};
	walk(n);
	return { factors, constants };
}

const isPrime = (k: number) => {
	if (!Number.isInteger(k) || k < 2) return false;
	for (let d = 2; d * d <= k; d++) if (k % d === 0) return false;
	return true;
};

/**
 * Fully factored: the same irreducible factors as the reference, up to constants, each written with no numeric
 * factor left inside (3x(7x − 6), not x(21x − 18)). A number is factored into primes ("3² · 7"). A polynomial
 * that does not factor is its own factorisation.
 */
export function isFactored(student: Node, reference: Node): boolean {
	if (symbols(reference).size === 0) {
		// prime factorisation of a whole number; 1 is its own
		if (exact(student)?.abs().isOne()) return exact(reference)?.abs().isOne() ?? false;
		const parts = factorList(student);
		if (parts.factors.length) return false;
		return parts.constants.every((c) => {
			c = bare(c);
			if (c.t === 'num') return isPrime(c.v.num) && c.v.isInteger();
			if (c.t === 'pow') {
				const b = bare(c.a);
				const e = exact(c.b);
				return b.t === 'num' && b.v.isInteger() && isPrime(b.v.num) && !!e && e.isInteger() && e.num >= 2;
			}
			return false;
		});
	}
	if (factorList(reference).factors.some((f) => !toPoly(f))) return sameFactors(factorList(student).factors, factorList(reference).factors);
	const mine = factorList(student).factors.map(toPoly);
	const theirs = factorList(reference).factors.map(toPoly);
	if (mine.some((p) => !p || isConstant(p)) || theirs.some((p) => !p)) return false;
	const shape = (ps: (Poly | null)[]) => ps.map((p) => shapeKey(p!)).sort().join(' | ');
	if (shape(mine) !== shape(theirs)) return false;
	const whole = (c: Rational) => Math.abs(c.num) === 1 && c.den === 1;
	return mine.every((p) => whole(primitive(p!).content));
}

/**
 * Factors that are not polynomials over the rationals, such as x − 1 − √6: the same factors as the reference, each
 * up to a constant, matched one to one. The ratio of two such factors is the same number at every point.
 */
function sameFactors(mine: Node[], theirs: Node[]): boolean {
	if (mine.length !== theirs.length) return false;
	const left = [...theirs];
	for (const f of mine) {
		const i = left.findIndex((g) => proportional(f, g));
		if (i < 0) return false;
		left.splice(i, 1);
	}
	return true;
}

function proportional(a: Node, b: Node): boolean {
	const letters = [...new Set([...symbols(a), ...symbols(b)])];
	let ratio: number | null = null;
	for (const x of [0.7318, -4.4613, 5.9179, -9.2711, 11.3719]) {
		const env = Object.fromEntries(letters.map((l, i) => [l, x + 0.37 * i]));
		const r = evaluate(a, env) / evaluate(b, env);
		if (!Number.isFinite(r)) continue;
		if (ratio === null) ratio = r;
		else if (Math.abs(r - ratio) > 1e-9 * Math.max(1, Math.abs(r))) return false;
	}
	return ratio !== null;
}

/**
 * Numerator and denominator of an answer as factors: a fraction bar, a factor to a negative power (the generators
 * write (x − 3)^(−1)), a fraction inside a product. The answer over 1 when there is no denominator.
 */
function asFraction(n: Node): { num: Node; den: Node | null } {
	const top: Node[] = [];
	const bottom: Node[] = [];
	const walk = (m: Node, up: boolean) => {
		m = bare(m);
		if (m.t === 'neg') return walk(m.a, up);
		if (m.t === 'mul') return m.args.forEach((a) => walk(a, up));
		if (m.t === 'div') {
			walk(m.a, up);
			walk(m.b, !up);
			return;
		}
		if (m.t === 'pow') {
			const e = exact(m.b);
			if (e && e.isInteger() && e.num < 0) {
				(up ? bottom : top).push(e.num === -1 ? m.a : { t: 'pow', a: m.a, b: { t: 'num', v: e.neg() } });
				return;
			}
		}
		(up ? top : bottom).push(m);
	};
	walk(n, true);
	const product = (xs: Node[]): Node => (xs.length === 1 ? xs[0] : { t: 'mul', args: xs.length ? xs : [{ t: 'num', v: q(1) }] });
	return { num: product(top), den: bottom.length ? product(bottom) : null };
}

/** Integer content of a polynomial with integer coefficients, or null when a coefficient is a fraction. */
function integerContent(p: Poly): number | null {
	let g = 0;
	for (const c of p.values()) {
		if (!c.isInteger()) return null;
		g = gcd(g, Math.abs(c.num));
	}
	return g;
}

/**
 * In lowest terms. A number: a fraction of integers with no common factor and a positive denominator, or an
 * integer; never a decimal. An algebraic fraction: numerator and denominator with no common factor, so as few
 * degrees as the reference and no common numeric factor; the denominator may be multiplied out. A radical in
 * lowest terms is a simplified one.
 */
export function isIrreducible(student: Node, reference: Node): boolean {
	if (contains(reference, isRoot) || contains(reference, isFractionalPower)) return isSimplified(student);
	if (symbols(reference).size === 0) {
		const lit = numberLiteral(student);
		if (!lit || lit.decimal) return false;
		let m = bare(student);
		if (m.t === 'neg') m = bare(m.a);
		if (m.t !== 'div') return true;
		// the sign in front or on the numerator, never on the denominator: −4/15 and \frac{-4}{15}, not \frac{4}{-15}
		const b = bare(m.b);
		return b.t === 'num' && b.v.sign() > 0 && !reducible(student);
	}
	const s = asFraction(student);
	const r = asFraction(reference);
	const sn = toPoly(s.num);
	const sd = s.den ? toPoly(s.den) : null;
	const rn = toPoly(r.num);
	const rd = r.den ? toPoly(r.den) : null;
	if (!sn || !rn || (s.den && !sd) || (r.den && !rd)) return false;
	const deg = (n: Poly, d: Poly | null) => degree(n) + (d ? Math.max(0, degree(d)) : 0);
	if (deg(sn, sd) !== deg(rn, rd)) return false;
	if (!sd || isConstant(sd)) return true;
	const a = integerContent(sn);
	const b = integerContent(sd);
	return a !== null && b !== null && gcd(a, b) === 1;
}

/** The index and the radicand of a radical in simplest terms, or null when it can still be simplified. */
function simpleRadical(r: Extract<Node, { t: 'root' }>): string | null {
	const rad = bare(r.a);
	if (contains(rad, isRoot) || contains(rad, isFractionalPower)) return null;
	const value = exact(rad);
	if (value !== null) {
		if (!value.isInteger() || value.num <= 1) return null;
		const k = value.num;
		// no factor p^n under an n-th root, and no smaller index: √[4]{4} is √2
		for (let p = 2; p ** Math.min(r.n, 2) <= k; p++) {
			if (k % p ** r.n === 0) return null;
		}
		for (let d = 2; d <= r.n; d++) {
			if (r.n % d !== 0) continue;
			const root = Math.round(k ** (1 / d));
			if ([root - 1, root, root + 1].some((x) => x > 1 && x ** d === k)) return null;
		}
		return `${r.n}:${k}`;
	}
	// letters: a monomial or a power of a bracket, every exponent below the index and no common factor with it;
	// |a| counts as a letter (√(|a||b|) when the letters may be negative)
	const p = toPoly(withoutAbs(rad));
	if (!p) return null;
	if (rad.t === 'pow') {
		const e = exact(rad.b);
		if (!e || !e.isInteger() || e.num >= r.n || gcd(e.num, r.n) > 1) return null;
		return `${r.n}:${shapeKey(p)}`;
	}
	if (p.size === 1) {
		const [[k, c]] = [...p];
		const exps = k ? k.split('*').map((part) => Number(part.split('^')[1] ?? 1)) : [];
		if (exps.some((e) => e >= r.n)) return null;
		if (!c.isInteger()) return null;
		const g = exps.reduce((acc, e) => gcd(acc, e), r.n);
		if (g > 1 && Math.abs(c.num) === 1) return null;
		if (Math.abs(c.num) > 1 && simpleRadical({ t: 'root', a: { t: 'num', v: c.abs() }, n: r.n }) === null) return null;
	}
	return `${r.n}:${shapeKey(p)}`;
}

/** The node with |a| read as a, for the shape of a radicand. */
function withoutAbs(n: Node): Node {
	switch (n.t) {
		case 'abs':
			return withoutAbs(n.a);
		case 'add':
		case 'mul':
			return { ...n, args: n.args.map(withoutAbs) };
		case 'div':
		case 'pow':
			return { ...n, a: withoutAbs(n.a), b: withoutAbs(n.b) };
		case 'neg':
		case 'paren':
		case 'root':
			return { ...n, a: withoutAbs(n.a) } as Node;
		default:
			return n;
	}
}

/**
 * Simplified: nothing left to carry out. Each term is a coefficient times at most one radical in simplest terms
 * (and letters or π); no two terms with the same radical; no powers of numbers or of brackets, no fractional
 * powers; a fraction only as a whole-number denominator under a simplified numerator, with no common factor, or
 * with a polynomial denominator.
 */
export function isSimplified(n: Node): boolean {
	const seen = new Set<string>();
	for (const t of terms(n)) {
		const sig = simpleTerm(t);
		if (sig === null || seen.has(sig)) return false;
		seen.add(sig);
	}
	return true;
}

/** The radical and letters of a simplified term (its "like terms" key), or null. */
function simpleTerm(t: Node): string | null {
	t = bare(t);
	if (t.t === 'div') {
		const den = bare(t.b);
		const d = exact(den);
		if (d !== null) {
			if (!d.isInteger() || d.num <= 1) return null;
			// (−15 + 12√5)/5: a simplified numerator, no factor in common with the denominator
			if (!isSimplified(t.a)) return null;
			const coeffs = terms(t.a).map(coefficient);
			if (coeffs.some((c) => c === null)) return null;
			if (coeffs.reduce((g, c) => gcd(g, Math.abs(c!.num)), d.num) > 1) return null;
			return `/${d.num}:${terms(t.a).map(simpleTerm).sort().join('+')}`;
		}
		// a polynomial or a monomial denominator: (√a − 3)/(a − 9), √58/2 handled above
		const dp = toPoly(den);
		if (!dp || !isSimplified(t.a)) return null;
		// 4a√(5ab)/(5ab): a letter or a number outside the radical that the denominator divides
		if (dp.size === 1 && terms(t.a).length === 1) {
			const [[dk, dc]] = [...dp];
			const outside = new Set(outsideLetters(t.a));
			if (dk.split('*').some((part) => part && outside.has(part.split('^')[0]))) return null;
			const c = coefficient(t.a);
			if (c && c.isInteger() && dc.isInteger() && gcd(Math.abs(c.num), Math.abs(dc.num)) > 1) return null;
		}
		return `/${shapeKey(toPoly(den)!)}:${terms(t.a).map(simpleTerm).sort().join('+')}`;
	}
	let numbers = 0;
	let radicals = 0;
	const parts: string[] = [];
	const walk = (m: Node): boolean => {
		m = bare(m);
		switch (m.t) {
			case 'num':
				numbers++;
				return true;
			case 'sym':
				parts.push(m.name);
				return true;
			case 'pi':
				parts.push('π');
				return true;
			case 'neg':
				return walk(m.a);
			case 'mul':
				return m.args.every(walk);
			case 'root': {
				radicals++;
				const s = simpleRadical(m);
				if (s === null) return false;
				parts.push(`√${s}`);
				return true;
			}
			case 'pow': {
				const e = exact(m.b);
				const base = bare(m.a);
				if (!e || !e.isInteger() || e.num < 2 || (base.t !== 'sym' && base.t !== 'pi')) return false;
				parts.push(`${base.t === 'sym' ? base.name : 'π'}^${e.num}`);
				return true;
			}
			case 'abs': {
				const p = toPoly(m.a);
				if (!p) return false;
				parts.push(`|${shapeKey(p)}|`);
				return true;
			}
			case 'div': {
				// a fraction as a coefficient: \frac{1}{2}√3
				const lit = numberLiteral(m);
				if (!lit || reducible(m)) return false;
				numbers++;
				return true;
			}
			default:
				return false;
		}
	};
	if (!walk(t) || numbers > 1 || radicals > 1) return null;
	return parts.sort().join('·');
}

/** The letters of a term outside its radicals. */
function outsideLetters(t: Node): string[] {
	t = bare(t);
	switch (t.t) {
		case 'sym':
			return [t.name];
		case 'pow':
			return outsideLetters(t.a);
		case 'neg':
			return outsideLetters(t.a);
		case 'mul':
			return t.args.flatMap(outsideLetters);
		default:
			return [];
	}
}

/** The numeric coefficient of a simple term, or null. */
function coefficient(t: Node): Rational | null {
	t = bare(t);
	if (t.t === 'neg') return coefficient(t.a);
	const e = exact(t);
	if (e) return e;
	if (t.t === 'mul') {
		const nums = t.args.map((a) => exact(bare(a))).filter((x): x is Rational => x !== null);
		return nums.length === 1 ? nums[0] : nums.length === 0 ? ONE : null;
	}
	return ONE;
}

/** Rationalized: simplified, and no radical in a denominator. */
export function isRationalized(n: Node): boolean {
	const rootBelow = (m: Node): boolean =>
		contains(m, (x) => (x.t === 'div' && contains(x.b, isRoot)) || (x.t === 'pow' && contains(x.a, isRoot) && (exact(x.b)?.sign() ?? 0) < 0));
	return isSimplified(n) && !rootBelow(n);
}

/** As a power with a fractional exponent, no radical sign. */
export const isPower = (n: Node): boolean => !contains(n, isRoot) && contains(n, isFractionalPower);

/** As a radical, no fractional exponent. */
export const isRadical = (n: Node): boolean => contains(n, isRoot) && !contains(n, isFractionalPower);

/** A decimal number as written, periodic with the bar: "1{,}97\overline{72}". Whole numbers pass too. */
export function isDecimalLatex(latex: string): boolean {
	const s = latex.replace(/\\left|\\right|\s|\\,|\\ /g, '');
	return /^-?\d+((\{,\}|,|\.)\d*(\\overline\{\d+\})?)?$/.test(s);
}
