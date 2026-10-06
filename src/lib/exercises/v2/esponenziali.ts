/**
 * Common pieces of the generators of the chapter "Esponenziali e logaritmi", lessons 121-123
 * (funzioni-esponenziali, equazioni-esponenziali, disequazioni-esponenziali): powers written as the lessons write
 * them, the values of a^n as exact rationals, and the sets of solutions of an inequality as unions of intervals
 * with rational ends, in the two notations of lesson 123 (inequalities joined by "oppure", intervals with
 * reversed brackets).
 */
import type { ChoiceOption, Rng } from './types';
import { Rational, q } from './rational';
import { polyToLatex } from './latex';

// ---------------------------------------------------------------------------
// Powers

/** base^n for an integer n, exact. */
export function ratPow(base: Rational, n: number): Rational {
	let out = q(1);
	const b = n >= 0 ? base : q(1).div(base);
	for (let i = 0; i < Math.abs(n); i++) out = out.mul(b);
	return out;
}

/** A base as it stands under an exponent: 2, \left(\frac{1}{2}\right). */
export const baseLatex = (b: Rational): string => (b.isInteger() ? b.toLatex() : `\\left(${b.toLatex()}\\right)`);

/** 2^x, 2^{x + 1}, \left(\frac{1}{2}\right)^{x}: the exponent in braces unless it is one character. */
export function powLatex(base: Rational, exp: string): string {
	const e = exp.length === 1 ? exp : `{${exp}}`;
	return `${baseLatex(base)}^${e}`;
}

/** m x + k as LaTeX: "x", "2x - 1", "-x + 3", "3 - x" when `constFirst`. */
export function linLatex(m: number, k: number, constFirst = false): string {
	if (constFirst && k > 0 && m < 0) return `${k} - ${m === -1 ? '' : -m}x`;
	return polyToLatex([q(k), q(m)]);
}

/** n written as the exponent of a base, with the sign in parentheses where the lesson does: 2^3, 2^{-3}. */
export const numPow = (base: Rational, n: number): string => powLatex(base, `${n}`);

// ---------------------------------------------------------------------------
// Signs

export type Op = '<' | '>' | '<=' | '>=';
export const OPS: Op[] = ['<', '>', '<=', '>='];
export const OP_LATEX: Record<Op, string> = { '<': '<', '>': '>', '<=': '\\leq', '>=': '\\geq' };
export const FLIP: Record<Op, Op> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
export const TOGGLE: Record<Op, Op> = { '<': '<=', '>': '>=', '<=': '<', '>=': '>' };
export const large = (o: Op): boolean => o === '<=' || o === '>=';
export const positive = (o: Op): boolean => o === '>' || o === '>=';

// ---------------------------------------------------------------------------
// Intervals with rational ends

/** An interval as written; null is -∞ at the left and +∞ at the right. */
export interface Iv {
	lo: Rational | null;
	hi: Rational | null;
	loC: boolean;
	hiC: boolean;
}

export const ALL: Iv[] = [{ lo: null, hi: null, loC: false, hiC: false }];
/** x op r. */
export function ray(r: Rational, op: Op): Iv[] {
	return positive(op) ? [{ lo: r, hi: null, loC: large(op), hiC: false }] : [{ lo: null, hi: r, loC: false, hiC: large(op) }];
}
/** Between r1 < r2 (`inside`) or outside them, with the ends included or not. */
export function between(r1: Rational, r2: Rational, inside: boolean, closed: boolean): Iv[] {
	if (inside) return [{ lo: r1, hi: r2, loC: closed, hiC: closed }];
	return [
		{ lo: null, hi: r1, loC: false, hiC: closed },
		{ lo: r2, hi: null, loC: closed, hiC: false },
	];
}
export const points = (rs: Rational[]): Iv[] => rs.map((r) => ({ lo: r, hi: r, loC: true, hiC: true }));

const endKey = (r: Rational | null, inf: string) => (r ? r.toString() : inf);
/** "(-oo,-3)", "[1,oo)", "[2,2]" for a point: the values of an option, one per interval. */
export const ivValue = (iv: Iv): string => `${iv.loC ? '[' : '('}${endKey(iv.lo, '-oo')},${endKey(iv.hi, 'oo')}${iv.hiC ? ']' : ')'}`;
export const ivsKey = (ivs: Iv[]): string => ivs.map(ivValue).join('|');

const isPoint = (iv: Iv) => !!iv.lo && !!iv.hi && iv.lo.equals(iv.hi);
export const isAll = (ivs: Iv[]): boolean => ivs.length === 1 && !ivs[0].lo && !ivs[0].hi;
const special = (ivs: Iv[]) => !ivs.length || isAll(ivs) || ivs.every(isPoint);
const frac = (r: Rational | null) => !!r && !r.isInteger();

/** ]-1, 4[ as \mathopen{]}-1, 4\mathclose{[}; \left] \right[ around fractions. */
function intervalLatex(iv: Iv): string {
	const lo = iv.lo ? iv.lo.toLatex() : '-\\infty';
	const hi = iv.hi ? iv.hi.toLatex() : '+\\infty';
	if (frac(iv.lo) || frac(iv.hi)) return `\\left${iv.loC ? '[' : ']'}${lo}, ${hi}\\right${iv.hiC ? ']' : '['}`;
	return `${iv.loC ? '[' : '\\mathopen{]}'}${lo}, ${hi}${iv.hiC ? ']' : '\\mathclose{[}'}`;
}

const wide = (ivs: Iv[]) => ivs.length === 2 && ivs.some((iv) => frac(iv.lo) || frac(iv.hi));

/** S = \,\mathopen{]}-\infty, 0\mathclose{[}\, \cup \,\mathopen{]}1, +\infty\mathclose{[}, spaced as in lesson 123. */
export function setLatex(ivs: Iv[]): string {
	if (!ivs.length) return 'S = \\emptyset';
	if (isAll(ivs)) return 'S = \\mathbb{R}';
	if (ivs.every(isPoint)) return `S = \\{${ivs.map((iv) => iv.lo!.toLatex()).join(', ')}\\}`;
	const parts = ivs.map((iv, i) => {
		const t = intervalLatex(iv);
		let s = t.startsWith('\\mathopen') ? '\\,' + t : t;
		if (i < ivs.length - 1 && t.endsWith('\\mathclose{[}') && !wide(ivs)) s += '\\,';
		return s;
	});
	if (wide(ivs)) return `\\begin{gathered} S = ${parts[0]} \\\\ \\cup ${parts[1]} \\end{gathered}`;
	return `S = ${parts.join(' \\cup ')}`;
}

/** x < -3, x \geq 1, -1 < x \leq 4, x = 2. */
function pieceLatex(iv: Iv): string {
	const le = (c: boolean) => (c ? '\\leq' : '<');
	if (isPoint(iv)) return `x = ${iv.lo!.toLatex()}`;
	if (iv.lo === null) return `x ${le(iv.hiC)} ${iv.hi!.toLatex()}`;
	if (iv.hi === null) return `x ${iv.loC ? '\\geq' : '>'} ${iv.lo.toLatex()}`;
	return `${iv.lo.toLatex()} ${le(iv.loC)} x ${le(iv.hiC)} ${iv.hi.toLatex()}`;
}

export const OPPURE = ' \\ \\text{ oppure } \\ ';
export const disLatex = (ivs: Iv[]): string => ivs.map(pieceLatex).join(OPPURE);

export type Notation = 'disequazioni' | 'intervalli';
/** An option in the notation of the exercise; ∅, ℝ and sets of points are always written as sets. */
export const optionLatex = (ivs: Iv[], n: Notation): string => (n === 'intervalli' || special(ivs) ? setLatex(ivs) : disLatex(ivs));
export const ivOption = (ivs: Iv[], n: Notation): ChoiceOption => ({ latex: optionLatex(ivs, n), values: ivs.map(ivValue) });

/** The last step: the solution in words or inequalities. */
export function lastStep(ivs: Iv[]): string {
	if (!ivs.length) return '\\text{Nessun } x \\text{ è soluzione.}';
	if (isAll(ivs)) return '\\text{Ogni } x \\text{ è soluzione.}';
	return disLatex(ivs);
}

// ---------------------------------------------------------------------------
// Sets of numbers

export const sortRat = (xs: Rational[]): Rational[] => [...xs].sort((u, v) => u.compare(v));
/** S = \{1, 2\}, S = \emptyset. */
export const solLatex = (xs: Rational[]): string => (xs.length ? `S = \\{${sortRat(xs).map((v) => v.toLatex()).join(', ')}\\}` : 'S = \\emptyset');
export const setOption = (xs: Rational[]): ChoiceOption => ({ latex: solLatex(xs), values: sortRat(xs).map(String) });
export const setKey = (xs: Rational[]): string => sortRat(xs).map(String).join('|');

export function shuffled<T>(rng: Rng, xs: T[]): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

/** An integer in [lo, hi] that is not in `not`. */
export function intNot(rng: Rng, lo: number, hi: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(lo, hi);
		if (!not.includes(v)) return v;
	}
}
