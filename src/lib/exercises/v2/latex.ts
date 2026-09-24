/**
 * Polynomial and number formatting that never produces "1x", "+ -3",
 * "0x", "x^{1}" or zero terms.
 */
import { Rational, ZERO, q } from './rational';

/** Polynomial as coefficients indexed by degree: p[0] constant, p[1] x, p[2] x^2. */
export type Poly = Rational[];

export function poly(...coeffsByDegree: (number | Rational)[]): Poly {
	return coeffsByDegree.map((c) => (typeof c === 'number' ? q(c) : c));
}

function coef(p: Poly, i: number): Rational {
	return p[i] ?? ZERO;
}

export function polyAdd(a: Poly, b: Poly): Poly {
	const n = Math.max(a.length, b.length);
	return Array.from({ length: n }, (_, i) => coef(a, i).add(coef(b, i)));
}

export function polySub(a: Poly, b: Poly): Poly {
	const n = Math.max(a.length, b.length);
	return Array.from({ length: n }, (_, i) => coef(a, i).sub(coef(b, i)));
}

export function polyScale(a: Poly, k: Rational): Poly {
	return a.map((c) => c.mul(k));
}

export function polyMul(a: Poly, b: Poly): Poly {
	const out: Poly = Array.from({ length: a.length + b.length - 1 }, () => ZERO);
	a.forEach((ca, i) => b.forEach((cb, j) => (out[i + j] = out[i + j].add(ca.mul(cb)))));
	return out;
}

/** Degree of the polynomial; -1 for the zero polynomial. */
export function polyDegree(p: Poly): number {
	for (let i = p.length - 1; i >= 0; i--) if (!p[i].isZero()) return i;
	return -1;
}

export function polyIsZero(p: Poly): boolean {
	return polyDegree(p) === -1;
}

/** Pads/truncates to exactly `n` coefficients (for fixed-size params). */
export function polyPad(p: Poly, n = 3): Poly {
	return Array.from({ length: n }, (_, i) => coef(p, i));
}

/** Exact strings by degree, e.g. ["6", "-5", "1"] for x^2 - 5x + 6. */
export function polyToStrings(p: Poly, n = 3): string[] {
	return polyPad(p, n).map((c) => c.toString());
}

function monomial(deg: number, v: string): string {
	if (deg === 0) return '';
	if (deg === 1) return v;
	return deg < 10 ? `${v}^${deg}` : `${v}^{${deg}}`;
}

/** LaTeX of a polynomial, highest degree first. Zero polynomial is "0". */
export function polyToLatex(p: Poly, v = 'x'): string {
	let out = '';
	for (let deg = p.length - 1; deg >= 0; deg--) {
		const c = p[deg];
		if (c.isZero()) continue;
		const a = c.abs();
		const body = deg === 0 ? a.toLatex() : (a.isOne() ? '' : a.toLatex()) + monomial(deg, v);
		if (out === '') out = (c.sign() < 0 ? '-' : '') + body;
		else out += (c.sign() < 0 ? ' - ' : ' + ') + body;
	}
	return out === '' ? '0' : out;
}

export function equationLatex(lhs: Poly, rhs: Poly, v = 'x'): string {
	return `${polyToLatex(lhs, v)} = ${polyToLatex(rhs, v)}`;
}

/** Number in LaTeX, wrapped in parentheses when negative (for substitutions like b^2 - 4ac). */
export function paren(r: Rational): string {
	if (r.sign() >= 0) return r.toLatex();
	return r.isInteger() ? `(${r.toLatex()})` : `\\left(${r.toLatex()}\\right)`;
}

/** "a - b" / "a + b" with the sign of b folded in: never "+ -". */
export function joinSigned(a: string, b: Rational): string {
	if (b.isZero()) return a;
	return b.sign() < 0 ? `${a} - ${b.abs().toLatex()}` : `${a} + ${b.toLatex()}`;
}

/** LaTeX for a set of solutions: "\left\{ -2,\ 3 \right\}" or "\emptyset". */
export function setLatex(values: Rational[]): string {
	if (values.length === 0) return '\\emptyset';
	return `\\left\\{ ${values.map((v) => v.toLatex()).join(',\\ ')} \\right\\}`;
}
