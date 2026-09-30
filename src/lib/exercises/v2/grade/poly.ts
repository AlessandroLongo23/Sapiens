/**
 * Polynomials with exact rational coefficients, in any number of letters: enough to tell whether an answer is
 * expanded, fully factored, or a fraction in lowest terms. A polynomial is a map from a monomial's key ("x^2*y")
 * to its coefficient; the zero polynomial is the empty map.
 */
import { Rational, gcd, lcm, q } from '../rational';
import { type Node, exact } from './node';

export type Poly = Map<string, Rational>;

/** "x^2*y" from {x: 2, y: 1}; "" for the constant term. */
function key(powers: Record<string, number>): string {
	return Object.keys(powers)
		.filter((l) => powers[l] !== 0)
		.sort()
		.map((l) => (powers[l] === 1 ? l : `${l}^${powers[l]}`))
		.join('*');
}

function powersOf(k: string): Record<string, number> {
	const out: Record<string, number> = {};
	if (!k) return out;
	for (const part of k.split('*')) {
		const [l, e] = part.split('^');
		out[l] = e ? Number(e) : 1;
	}
	return out;
}

function addTo(p: Poly, k: string, c: Rational): void {
	const s = (p.get(k) ?? q(0)).add(c);
	if (s.isZero()) p.delete(k);
	else p.set(k, s);
}

export const constant = (c: Rational): Poly => (c.isZero() ? new Map() : new Map([['', c]]));

export function add(a: Poly, b: Poly): Poly {
	const out: Poly = new Map(a);
	for (const [k, c] of b) addTo(out, k, c);
	return out;
}

export function scale(a: Poly, c: Rational): Poly {
	const out: Poly = new Map();
	if (c.isZero()) return out;
	for (const [k, v] of a) out.set(k, v.mul(c));
	return out;
}

export function mul(a: Poly, b: Poly): Poly {
	const out: Poly = new Map();
	for (const [ka, ca] of a) {
		const pa = powersOf(ka);
		for (const [kb, cb] of b) {
			const pb = powersOf(kb);
			const pw = { ...pa };
			for (const l in pb) pw[l] = (pw[l] ?? 0) + pb[l];
			addTo(out, key(pw), ca.mul(cb));
		}
	}
	return out;
}

/**
 * The polynomial a node stands for, multiplying everything out, or null when it is not a polynomial (a letter in
 * a denominator, a radical, a fractional power). Constants divide; polynomials do not.
 */
export function toPoly(n: Node): Poly | null {
	try {
		switch (n.t) {
			case 'num':
				return constant(n.v);
			case 'sym':
				return new Map([[n.name, q(1)]]);
			case 'paren':
				return toPoly(n.a);
			case 'neg': {
				const a = toPoly(n.a);
				return a && scale(a, q(-1));
			}
			case 'add': {
				let s: Poly = new Map();
				for (const x of n.args) {
					const p = toPoly(x);
					if (!p) return null;
					s = add(s, p);
				}
				return s;
			}
			case 'mul': {
				let s: Poly = constant(q(1));
				for (const x of n.args) {
					const p = toPoly(x);
					if (!p) return null;
					s = mul(s, p);
				}
				return s;
			}
			case 'div': {
				const a = toPoly(n.a);
				const c = exact(n.b);
				return a && c && !c.isZero() ? scale(a, q(1).div(c)) : null;
			}
			case 'pow': {
				const e = exact(n.b);
				if (!e || !e.isInteger() || e.num < 0 || e.num > 20) return null;
				const base = toPoly(n.a);
				if (!base) return null;
				let s: Poly = constant(q(1));
				for (let k = 0; k < e.num; k++) s = mul(s, base);
				return s;
			}
			default:
				return null;
		}
	} catch {
		return null;
	}
}

export function equals(a: Poly, b: Poly): boolean {
	if (a.size !== b.size) return false;
	for (const [k, c] of a) if (!b.get(k)?.equals(c)) return false;
	return true;
}

/** Total degree; -1 for the zero polynomial. */
export function degree(p: Poly): number {
	let d = -1;
	for (const k of p.keys()) d = Math.max(d, Object.values(powersOf(k)).reduce((s, e) => s + e, 0));
	return d;
}

export const isConstant = (p: Poly): boolean => degree(p) <= 0;

/**
 * The polynomial scaled to integer coefficients with no common factor and a positive leading coefficient (the
 * first monomial in key order, so the choice is the same for equal polynomials), with the factor taken out:
 * p = content · primitive. Two factors that differ by a constant have the same primitive part.
 */
export function primitive(p: Poly): { content: Rational; primitive: Poly } {
	if (p.size === 0) return { content: q(0), primitive: p };
	const coeffs = [...p.values()];
	const den = coeffs.reduce((l, c) => lcm(l, c.den), 1);
	const g = coeffs.reduce((acc, c) => gcd(acc, Math.abs((c.num * den) / c.den)), 0);
	const lead = p.get([...p.keys()].sort()[0])!;
	const content = q(lead.sign() * g, den);
	return { content, primitive: scale(p, q(1).div(content)) };
}

/** A key that identifies a polynomial up to a constant factor. */
export function shapeKey(p: Poly): string {
	const prim = primitive(p).primitive;
	return [...prim.keys()]
		.sort()
		.map((k) => `${prim.get(k)!.toString()}${k ? '*' + k : ''}`)
		.join(' + ');
}

/** Monomial keys of a polynomial, for a sum written with like terms still apart. */
export const keyOf = key;
export const powers = powersOf;
