/**
 * Polinomi e grado di un polinomio. Spec: specs/exercises/polinomi.md
 *
 * Seven levels in the order of the lesson (docs/lezioni/riscritte/28-polinomi.md), each adding one
 * difficulty: reduction to normal form in one letter; in two letters, with terms that cancel; with
 * fractions and a monomial written as a product; total degree or degree in one letter of a reduced
 * polynomial; the same on a polynomial to reduce first, where the highest terms cancel; ordered,
 * complete and homogeneous (multiple choice among four descriptions); numerical value with negative
 * numbers and fractions, also written P(a). No operations between polynomials: those are in
 * polinomi-operazioni.
 *
 * Built backwards: the reduced polynomial (or the properties, or the value) comes first, then the
 * written terms are obtained by splitting its coefficients and adding groups that sum to zero.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q, ZERO } from '../rational';
import {
	type Mono,
	type Opt,
	FAMILIES,
	buildChoice,
	degree,
	expOf,
	forbidden,
	letters,
	literalKey,
	literalLatex,
	mono,
	monoFromJSON,
	monoJSON,
	monoKey,
	monoLatex,
	mul,
	nonZero,
	numSumLatex,
	polyLatex,
	polySympy,
	ratPow,
	shuffle,
	similar,
	wrap,
} from '../monomi';

export const ID = 'polinomi';

/** A written term: a monomial, or (level 3) a product of two monomials to reduce first. */
interface Piece {
	m: Mono;
	f?: [Mono, Mono];
}

type Prop = 'ordinato' | 'omogeneo';

interface Built {
	case: string;
	/** The letters of the exercise, in alphabetical order. */
	vars: string[];
	pieces: Piece[];
	/** Levels 4-5: "totale" or the letter asked for. */
	ask?: string;
	/** Level 6: which pair of properties is asked, and the truth. */
	prop?: Prop;
	first?: boolean;
	complete?: boolean;
	/** Level 7: the value of each letter, and whether the P(a) notation is used. */
	subs?: Record<string, Rational>;
	pnot?: boolean;
}

// ---------------------------------------------------------------------------
// Small helpers

const mk = (c: number | Rational, e: Record<string, number>): Mono => mono(c, e);
const P = (m: Mono): Piece => ({ m });

/** Descending powers of the first letter, then of the second, and so on. */
function sortDesc(terms: Mono[], vars: string[]): Mono[] {
	return [...terms].sort((a, b) => {
		for (const v of vars) {
			const d = expOf(b, v) - expOf(a, v);
			if (d !== 0) return d;
		}
		return 0;
	});
}

/** Collect similar terms (zero sums dropped) and order by descending powers. */
function reduce(terms: Mono[], vars: string[]): Mono[] {
	// keyed by literal part: a zero sum must not turn into a constant (mono(0, e) drops the letters)
	const acc = new Map<string, { c: Rational; e: Record<string, number> }>();
	for (const t of terms) {
		const k = literalKey(t.e);
		const cur = acc.get(k);
		acc.set(k, { c: cur ? cur.c.add(t.c) : t.c, e: { ...t.e } });
	}
	return sortDesc(
		[...acc.values()].filter((x) => !x.c.isZero()).map((x) => mono(x.c, x.e)),
		vars,
	);
}

function polyOpt(terms: Mono[], vars: string[]): Opt {
	const r = reduce(terms, vars);
	return { latex: polyLatex(r), value: polySympy(r), key: r.map(monoKey).sort().join('+') || '0' };
}

const ratOpt = (r: Rational): Opt => ({ latex: r.toLatex(), value: r.toString(), key: r.toString() });

function pieceLatex(p: Piece): string {
	return p.f ? `${monoLatex(p.f[0])} \\cdot ${monoLatex(p.f[1])}` : monoLatex(p.m);
}

/** The written polynomial, signs folded. */
function writtenLatex(pieces: Piece[]): string {
	return pieces
		.map((p, i) => {
			const s = pieceLatex(p);
			if (i === 0) return s;
			return s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`;
		})
		.join('');
}

/** Random exponents for the given letters, total degree in [lo, hi]. */
function randomLiteral(rng: Rng, vars: string[], lo: number, hi: number, maxExp = 4): Record<string, number> {
	for (;;) {
		const e: Record<string, number> = {};
		let d = 0;
		for (const v of vars) {
			e[v] = rng.int(0, maxExp);
			d += e[v];
		}
		if (d >= lo && d <= hi) return e;
	}
}

/** c = c1 + c2 with c1, c2 nonzero integers in [-9, 9]. */
function splitInt(rng: Rng, c: Rational): [Rational, Rational] {
	for (;;) {
		const c1 = q(nonZero(rng, -9, 9));
		const c2 = c.sub(c1);
		if (!c2.isZero() && c2.abs().compare(q(9)) <= 0) return [c1, c2];
	}
}

const niceFrac = (r: Rational, maxDen = 6, maxNum = 12) => !r.isZero() && r.den <= maxDen && Math.abs(r.num) <= maxNum;

/** A nonzero coefficient with denominator 2, 3, 4 or 6. */
function randomFrac(rng: Rng): Rational {
	for (;;) {
		const r = q(nonZero(rng, -7, 7), rng.pick([2, 3, 4, 6]));
		if (!r.isInteger()) return r;
	}
}

/** Two similar written pieces are not next to each other somewhere (the reduction is not already done). */
function hasSeparatedSimilar(pieces: Piece[]): boolean {
	for (let i = 0; i < pieces.length; i++)
		for (let j = i + 2; j < pieces.length; j++) if (similar(pieces[i].m, pieces[j].m)) return true;
	return false;
}

function shuffleSeparated(rng: Rng, pieces: Piece[]): Piece[] {
	for (let k = 0; k < 50; k++) {
		const s = shuffle(rng, pieces);
		if (hasSeparatedSimilar(s)) return s;
	}
	return shuffle(rng, pieces);
}

const prep = (v: string) => (v === 'a' ? 'ad' : 'a');

// ---------------------------------------------------------------------------
// Construction

function buildReduction(rng: Rng, level: number): Built | null {
	if (level === 1) {
		const v = rng.pick(['x', 'x', 'a', 'y', 'b']);
		const d = rng.pick([2, 3, 3]);
		const k = rng.int(2, Math.min(4, d + 1));
		const exps = shuffle(
			rng,
			Array.from({ length: d }, (_, i) => i),
		).slice(0, k - 1);
		exps.push(d);
		const answer = exps.map((n) => mk(nonZero(rng, -9, 9), n ? { [v]: n } : {}));
		const pieces: Piece[] = [];
		const nsplit = Math.max(2, rng.int(2, answer.length));
		const toSplit = new Set(shuffle(rng, answer.map((_, i) => i)).slice(0, nsplit));
		answer.forEach((t, i) => {
			if (toSplit.has(i)) {
				const [c1, c2] = splitInt(rng, t.c);
				pieces.push(P(mk(c1, { ...t.e })), P(mk(c2, { ...t.e })));
			} else pieces.push(P(t));
		});
		if (pieces.length < 5 || pieces.length > 7) return null;
		return { case: 'una lettera', vars: [v], pieces: shuffleSeparated(rng, pieces) };
	}
	const fam = rng.pick(FAMILIES);
	const vars = [...fam.slice(0, 2)];
	if (level === 2) {
		const n = rng.pick([2, 3, 3]);
		const answer: Mono[] = [];
		const keys = new Set<string>();
		while (answer.length < n) {
			const e = rng.next() < 0.2 ? {} : randomLiteral(rng, vars, 1, 4, 3);
			const t = mk(nonZero(rng, -12, 12), e);
			if (keys.has(literalKey(t.e))) continue;
			keys.add(literalKey(t.e));
			answer.push(t);
		}
		if (!answer.some((t) => letters(t).length === 2)) return null;
		// the group that cancels: a literal part not in the answer
		let ce: Record<string, number>;
		do ce = randomLiteral(rng, vars, 1, 4, 3);
		while (keys.has(literalKey(ce)));
		const pieces: Piece[] = [];
		const triple = rng.next() < 0.25;
		if (triple) {
			const a = nonZero(rng, -6, 6);
			const b = nonZero(rng, -6, 6, [-a]);
			if (Math.abs(a + b) > 9) return null;
			pieces.push(P(mk(a, ce)), P(mk(b, ce)), P(mk(-(a + b), ce)));
		} else {
			const k = nonZero(rng, 1, 9);
			pieces.push(P(mk(k, ce)), P(mk(-k, ce)));
		}
		const toSplit = rng.int(0, answer.length - 1);
		answer.forEach((t, i) => {
			if ((i === toSplit || rng.next() < 0.3) && t.c.abs().compare(q(1)) >= 0) {
				const [c1, c2] = splitInt(rng, t.c);
				pieces.push(P(mk(c1, { ...t.e })), P(mk(c2, { ...t.e })));
			} else pieces.push(P(t));
		});
		if (pieces.length < 5 || pieces.length > 7) return null;
		return { case: triple ? 'tre termini a somma zero' : 'coppia di opposti', vars, pieces: shuffleSeparated(rng, pieces) };
	}
	// level 3: fractions and a monomial written as a product
	const n = rng.pick([2, 3, 3]);
	const lits: Record<string, number>[] = [];
	const keys = new Set<string>();
	while (lits.length < n) {
		const e = randomLiteral(rng, vars, 2, 4, 3);
		if (keys.has(literalKey(e))) continue;
		keys.add(literalKey(e));
		lits.push(e);
	}
	// the product: T = f1 · f2, sharing a letter whose exponent adds up
	const tIdx = lits.findIndex((e) => vars.some((v) => e[v] >= 2));
	if (tIdx === -1) return null;
	const T = lits[tIdx];
	const shared = rng.pick(vars.filter((v) => T[v] >= 2));
	const e2: Record<string, number> = { [shared]: 1 };
	for (const v of vars) if (v !== shared && T[v] > 0 && rng.next() < 0.5) e2[v] = rng.int(1, T[v]);
	const e1: Record<string, number> = {};
	for (const v of vars) e1[v] = T[v] - (e2[v] ?? 0);
	const k1 = nonZero(rng, -5, 5, [1, -1]);
	const k2 = rng.pick([1, 1, 2]);
	const f1 = mk(k1, e1);
	const f2 = mk(k2, e2);
	const prod = mul(f1, f2);
	const pieces: Piece[] = [{ m: prod, f: [f1, f2] }];
	const other = randomFrac(rng);
	if (prod.c.add(other).isZero()) return null;
	pieces.push(P(mk(other, T)));
	lits.forEach((e, i) => {
		if (i === tIdx) return;
		const c = rng.next() < 0.5 ? q(nonZero(rng, -6, 6)) : randomFrac(rng);
		if (rng.next() < 0.4) {
			const c1 = rng.next() < 0.5 ? randomFrac(rng) : q(nonZero(rng, -5, 5));
			const c2 = c.sub(c1);
			if (!niceFrac(c2)) return;
			pieces.push(P(mk(c1, e)), P(mk(c2, e)));
		} else pieces.push(P(mk(c, e)));
	});
	if (pieces.length < 4 || pieces.length > 6) return null;
	const answer = reduce(
		pieces.map((p) => p.m),
		vars,
	);
	if (answer.length !== n || answer.some((t) => t.c.den > 12 || Math.abs(t.c.num) > 30)) return null;
	return { case: 'frazioni e prodotto', vars, pieces: shuffleSeparated(rng, pieces) };
}

function buildDegree(rng: Rng): Built | null {
	const fam = rng.pick(FAMILIES);
	const vars = rng.next() < 0.8 ? [...fam.slice(0, 2)] : [...fam];
	const total = rng.next() < 0.5;
	const ask = total ? 'totale' : rng.pick(vars);
	// the ask is drawn first and the polynomial redrawn until it fits, so the two cases stay balanced
	for (let attempt = 0; attempt < 200; attempt++) {
		const n = rng.pick([3, 4, 4]);
		const terms: Mono[] = [];
		const keys = new Set<string>();
		if (rng.next() < 0.5) {
			terms.push(mk(nonZero(rng, -9, 9), {}));
			keys.add('');
		}
		while (terms.length < n) {
			const e = randomLiteral(rng, vars, 1, 7, 5);
			if (keys.has(literalKey(e))) continue;
			keys.add(literalKey(e));
			const c = rng.next() < 0.25 ? randomFrac(rng) : q(nonZero(rng, -9, 9));
			terms.push(mk(c, e));
		}
		const written = shuffle(rng, terms);
		const top = degreeOf(written, 'totale');
		if (total) {
			if (degree(written[0]) === top) continue;
		} else {
			const d = degreeOf(written, ask);
			if (d === 0 || written.some((t) => degree(t) === top && expOf(t, ask) === d)) continue;
		}
		return { case: total ? 'complessivo' : 'rispetto a una lettera', vars, pieces: written.map(P), ask };
	}
	return null;
}

function buildDegreeToReduce(rng: Rng): Built | null {
	const fam = rng.pick(FAMILIES);
	const two = rng.next() < 0.6;
	const vars = two ? [...fam.slice(0, 2)] : [rng.pick(['x', 'a', 'y'])];
	const total = !two || rng.next() < 0.5;
	const ask = total ? 'totale' : rng.pick(vars);
	const k = rng.pick([2, 3, 3]);
	const answer: Mono[] = [];
	const keys = new Set<string>();
	while (answer.length < k) {
		const e = rng.next() < 0.25 ? {} : randomLiteral(rng, vars, 1, two ? 4 : 3, 3);
		if (keys.has(literalKey(e))) continue;
		keys.add(literalKey(e));
		answer.push(mk(nonZero(rng, -9, 9), e));
	}
	const measure = (m: Mono) => (ask === 'totale' ? degree(m)! : expOf(m, ask));
	const d = Math.max(...answer.map(measure));
	if (d < 1) return null;
	// the cancelling pair is higher than the answer in what is asked
	let ce: Record<string, number>;
	let tries = 0;
	do {
		ce = randomLiteral(rng, vars, 1, two ? 6 : 5, 5);
		if (++tries > 200) return null;
	} while (keys.has(literalKey(ce)) || measure(mk(1, ce)) <= d);
	const kc = nonZero(rng, 1, 9);
	const pieces: Piece[] = answer.map(P);
	if (rng.next() < 0.3) {
		const i = rng.int(0, answer.length - 1);
		const [c1, c2] = splitInt(rng, answer[i].c);
		pieces.splice(i, 1, P(mk(c1, answer[i].e)), P(mk(c2, answer[i].e)));
	}
	pieces.push(P(mk(kc, ce)), P(mk(-kc, ce)));
	let written: Piece[] = [];
	for (let t = 0; t < 50; t++) {
		written = shuffle(rng, pieces);
		const idx = written.map((p, i) => (literalKey(p.m.e) === literalKey(ce) ? i : -1)).filter((i) => i >= 0);
		if (idx[1] - idx[0] >= 2) break;
	}
	return { case: total ? 'complessivo' : 'rispetto a una lettera', vars, pieces: written, ask };
}

function buildProperties(rng: Rng): Built | null {
	const first = rng.next() < 0.5;
	const complete = rng.next() < 0.5;
	if (rng.next() < 0.5) {
		// one letter: ordered (descending) × complete
		const v = rng.pick(['x', 'x', 'a', 'y']);
		const n = rng.pick([3, 4]);
		let exps = Array.from({ length: n + 1 }, (_, i) => n - i);
		if (!complete) {
			const miss = rng.next() < 0.5 ? 0 : rng.int(1, n - 1);
			exps = exps.filter((e) => e !== miss);
		}
		let order = exps;
		if (!first) {
			for (let t = 0; ; t++) {
				if (t > 100) return null;
				order = shuffle(rng, exps);
				const desc = order.every((e, i) => i === 0 || order[i - 1] > e);
				const asc = order.every((e, i) => i === 0 || order[i - 1] < e);
				if (!desc && !asc) break;
			}
		}
		const pieces = order.map((e) => P(mk(nonZero(rng, -9, 9), e ? { [v]: e } : {})));
		return { case: caseOf('ordinato', first, complete), vars: [v], pieces, prop: 'ordinato', first, complete };
	}
	// two letters: homogeneous × complete with respect to the first letter
	const fam = rng.pick(FAMILIES);
	const [x, y] = fam;
	const nterms = rng.pick([3, 3, 4]);
	// x-exponents: complete means {0..m}; incomplete has a gap below the top
	let xs: number[];
	if (complete) xs = Array.from({ length: nterms }, (_, i) => nterms - 1 - i);
	else {
		const m = rng.int(nterms, nterms + 1);
		const all = Array.from({ length: m + 1 }, (_, i) => m - i);
		const miss = rng.next() < 0.5 ? [0] : shuffle(rng, all.slice(1, -1)).slice(0, all.length - nterms);
		xs = all.filter((e) => !miss.includes(e));
		while (xs.length > nterms) xs.splice(rng.int(1, xs.length - 1), 1);
		if (xs.length !== nterms) return null;
	}
	const top = xs[0];
	let ys: number[];
	if (first) {
		const deg = rng.int(Math.max(top, 2), Math.min(top + 2, 5));
		ys = xs.map((e) => deg - e);
	} else {
		ys = xs.map((e) => rng.int(e === 0 ? 1 : 0, Math.min(3, 5 - e)));
		const degs = xs.map((e, i) => e + ys[i]);
		if (degs.every((dd) => dd === degs[0])) return null;
	}
	if (ys.every((e) => e === 0)) return null;
	const terms = xs.map((e, i) => mk(nonZero(rng, -9, 9), { [x]: e, [y]: ys[i] }));
	if (terms.some((t) => degree(t) === 0 && t !== terms[terms.length - 1])) return null;
	return { case: caseOf('omogeneo', first, complete), vars: [x, y], pieces: terms.map(P), prop: 'omogeneo', first, complete };
}

function caseOf(p: Prop, first: boolean, complete: boolean): string {
	if (first && complete) return `${p}-completo`;
	if (first) return `${p}-non-completo`;
	if (complete) return `completo-non-${p}`;
	return `ne-${p}-ne-completo`;
}

const SMALL_FRACS = [q(1, 2), q(-1, 2), q(1, 3), q(-1, 3), q(2, 3), q(-2, 3), q(3, 2), q(-3, 2)];

function buildValue(rng: Rng): Built | null {
	const u = rng.next();
	if (u < 2 / 3) {
		const frac = u >= 1 / 3;
		const pnot = rng.next() < 0.5;
		const v = pnot ? 'x' : rng.pick(['x', 'x', 'a', 'y']);
		const val = frac ? rng.pick(SMALL_FRACS) : q(rng.int(-4, -1));
		const d = frac ? (Math.abs(val.num) === 1 && val.den === 2 ? rng.pick([2, 3]) : 2) : Math.abs(val.num) <= 3 ? rng.pick([2, 3]) : 2;
		const mid = rng.int(1, d - 1);
		const exps = [d, mid, 0];
		if (!frac && d === 3 && mid !== 2) return null; // an even power, where the parentheses matter
		const terms = exps.map((e) =>
			mk(frac && rng.next() < 0.3 ? randomFrac(rng) : q(nonZero(rng, -6, 6)), e ? { [v]: e } : {}),
		);
		return { case: frac ? 'frazione' : 'intero negativo', vars: [v], pieces: terms.map(P), subs: { [v]: val }, pnot };
	}
	const fam = rng.pick(FAMILIES);
	const vars = [...fam.slice(0, 2)];
	const terms: Mono[] = [];
	const keys = new Set<string>();
	while (terms.length < 2) {
		const e = randomLiteral(rng, vars, 2, 3, 2);
		if (keys.has(literalKey(e))) continue;
		keys.add(literalKey(e));
		terms.push(mk(nonZero(rng, -5, 5), e));
	}
	if (!terms.some((t) => letters(t).length === 2)) return null;
	terms.push(mk(nonZero(rng, -9, 9), {}));
	const neg = q(rng.int(-3, -1));
	const other = rng.next() < 0.4 ? rng.pick([q(1, 2), q(-1, 2)]) : q(rng.int(1, 3));
	const subs = rng.next() < 0.5 ? { [vars[0]]: neg, [vars[1]]: other } : { [vars[0]]: other, [vars[1]]: neg };
	return { case: 'due lettere', vars, pieces: shuffle(rng, terms).map(P), subs };
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
		case 2:
		case 3:
			return buildReduction(rng, level);
		case 4:
			return buildDegree(rng);
		case 5:
			return buildDegreeToReduce(rng);
		case 6:
			return buildProperties(rng);
		case 7:
			return buildValue(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Semantics

const reduced = (b: Built): Mono[] =>
	reduce(
		b.pieces.map((p) => p.m),
		b.vars,
	);

function degreeOf(terms: Mono[], ask: string): number {
	return Math.max(...terms.map((t) => (ask === 'totale' ? degree(t)! : expOf(t, ask))));
}

function evalMono(m: Mono, subs: Record<string, Rational>): Rational {
	let r = m.c;
	for (const v of letters(m)) r = r.mul(ratPow(subs[v], m.e[v]));
	return r;
}

const evalPoly = (terms: Mono[], subs: Record<string, Rational>): Rational => terms.reduce((s, t) => s.add(evalMono(t, subs)), ZERO);

/** Level 6: is the written polynomial ordered by descending powers of its first letter / homogeneous / complete? */
function properties(b: Built): { first: boolean; complete: boolean } {
	const ts = b.pieces.map((p) => p.m);
	const v = b.vars[0];
	const complete = (() => {
		const es = new Set(ts.map((t) => expOf(t, v)));
		const top = Math.max(...es);
		for (let k = 0; k <= top; k++) if (!es.has(k)) return false;
		return true;
	})();
	if (b.prop === 'ordinato') return { first: ts.every((t, i) => i === 0 || expOf(ts[i - 1], v) > expOf(t, v)), complete };
	return { first: ts.every((t) => degree(t) === degree(ts[0])), complete };
}

const PROP_OPTIONS: Record<Prop, { id: string; text: string }[]> = {
	ordinato: [
		{ id: 'ordinato-completo', text: 'ordinato e completo' },
		{ id: 'ordinato-non-completo', text: 'ordinato ma non completo' },
		{ id: 'completo-non-ordinato', text: 'completo ma non ordinato' },
		{ id: 'ne-ordinato-ne-completo', text: 'né ordinato né completo' },
	],
	omogeneo: [
		{ id: 'omogeneo-completo', text: 'omogeneo e completo' },
		{ id: 'omogeneo-non-completo', text: 'omogeneo ma non completo' },
		{ id: 'completo-non-omogeneo', text: 'completo ma non omogeneo' },
		{ id: 'ne-omogeneo-ne-completo', text: 'né omogeneo né completo' },
	],
};

// ---------------------------------------------------------------------------
// LaTeX of the value substitution (level 7)

function valFactor(r: Rational, n: number): string {
	const s = r.toLatex();
	const base = r.sign() < 0 || !r.isInteger() ? wrap(s) : s;
	return n === 1 ? base : `${base}^${n}`;
}

/** "2(-2)^2", "-3(-2)", "3 \cdot 2^2", "\left(\frac{1}{2}\right)^2(-2)". */
function substituted(m: Mono, subs: Record<string, Rational>): string {
	const ls = letters(m);
	if (ls.length === 0) return m.c.toLatex();
	const abs = m.c.abs();
	let s = abs.isOne() ? '' : abs.toLatex();
	for (const v of ls) {
		const f = valFactor(subs[v], m.e[v]);
		if (s === '') s = f;
		else s += f.startsWith('(') || f.startsWith('\\left(') ? f : ` \\cdot ${f}`;
	}
	return (m.c.sign() < 0 ? '-' : '') + s;
}

function substitutedSum(terms: Mono[], subs: Record<string, Rational>): string {
	return terms
		.map((t, i) => {
			const s = substituted(t, subs);
			if (i === 0) return s;
			return s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`;
		})
		.join('');
}

function valLatex(r: Rational): string {
	return r.toLatex();
}

function pArg(r: Rational): string {
	return r.isInteger() ? `P(${r.toLatex()})` : `P\\left(${r.toLatex()}\\right)`;
}

// ---------------------------------------------------------------------------
// Problem, steps, sample

/**
 * Rough width of a display formula in character units (a letter or a digit is about 1). The site
 * shows problems in a column about 350 px wide at 18 px, about 36 units; LINE_LIMIT keeps a margin.
 */
function estWidth(latex: string): number {
	let w = 0;
	let s = latex.replace(/\\left|\\right/g, '');
	const eat = (re: RegExp, f: (...m: string[]) => number) => {
		s = s.replace(re, (...m: string[]) => {
			w += f(...m);
			return '';
		});
	};
	eat(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, a, b) => Math.max(a.length, b.length) + 0.5);
	eat(/\\text\{([^{}]*)\}/g, (_, t) => t.length * 0.9);
	eat(/\\qquad/g, () => 4);
	eat(/\\quad/g, () => 2);
	eat(/\\cdot/g, () => 1.6);
	eat(/,\\ /g, () => 1.2);
	eat(/\^\{?(\d+)\}?/g, (_, d) => 0.7 * d.length);
	eat(/ [-+=] /g, () => 2.2);
	return w + s.replace(/\s/g, '').length;
}

const LINE_LIMIT = 30;

/**
 * A sum on the fewest lines that fit, broken before a + or - (the next lines start with \\quad).
 * With two lines the break is placed so that the two lines are as even as possible.
 */
function sumLines(parts: string[]): string[] {
	const line = (ps: string[], first: boolean) => (first ? ps.join('') : `\\quad ${ps.join('').trim()}`);
	let best: string[] | null = null;
	let bestW = Infinity;
	for (let i = 1; i < parts.length; i++) {
		const ls = [line(parts.slice(0, i), true), line(parts.slice(i), false)];
		const w = Math.max(...ls.map(estWidth));
		if (w <= LINE_LIMIT && w < bestW) {
			best = ls;
			bestW = w;
		}
	}
	if (best) return best;
	const lines: string[] = [];
	let cur: string[] = [];
	for (const p of parts) {
		if (cur.length && estWidth(line([...cur, p], lines.length === 0)) > LINE_LIMIT) {
			lines.push(line(cur, lines.length === 0));
			cur = [];
		}
		cur.push(p);
	}
	lines.push(line(cur, lines.length === 0));
	return lines;
}

const aligned = (lines: string[]) => (lines.length === 1 ? lines[0] : `\\begin{aligned}${lines.map((l) => `&${l}`).join('\\\\')}\\end{aligned}`);

function problemLatex(b: Built): string {
	const poly = writtenLatex(b.pieces);
	if (!b.subs) {
		if (estWidth(poly) <= LINE_LIMIT) return poly;
		const parts = b.pieces.map((p, i) => {
			const s = pieceLatex(p);
			if (i === 0) return s;
			return s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`;
		});
		return aligned(sumLines(parts));
	}
	const head = b.pnot ? `P(x) = ${poly}` : poly;
	const tail = b.pnot ? pArg(b.subs.x) : `\\text{per } ${b.vars.map((v) => `${v} = ${valLatex(b.subs![v])}`).join(',\\ ')}`;
	const one = `${head} \\qquad ${tail}`;
	return estWidth(one) <= LINE_LIMIT ? one : aligned([head, tail]);
}

function promptOf(b: Built, level: number): string {
	if (level <= 3) return 'Riduci il polinomio a forma normale.';
	if (level <= 5) return b.ask === 'totale' ? 'Calcola il grado complessivo del polinomio.' : `Calcola il grado del polinomio rispetto alla lettera ${b.ask}.`;
	if (level === 6) {
		const v = b.vars[0];
		return b.prop === 'ordinato'
			? `Il polinomio è ordinato secondo le potenze decrescenti di ${v}? È completo rispetto ${prep(v)} ${v}?`
			: `Il polinomio è omogeneo? È completo rispetto ${prep(v)} ${v}?`;
	}
	return b.pnot ? 'Calcola il valore indicato.' : 'Calcola il valore numerico del polinomio.';
}

function reductionSteps(b: Built): string[] {
	const out: string[] = [];
	for (const p of b.pieces) if (p.f) out.push(`\\text{Prima il monomio da ridurre: } ${pieceLatex(p)} = ${monoLatex(p.m)}`);
	// groups in the order of the result, then the ones that cancel
	const groups: Mono[][] = [];
	for (const p of b.pieces) {
		const g = groups.find((gg) => similar(gg[0], p.m));
		if (g) g.push(p.m);
		else groups.push([p.m]);
	}
	const sum = (g: Mono[]) => g.reduce((s, t) => s.add(t.c), ZERO);
	const zero = groups.filter((g) => sum(g).isZero());
	for (const g of zero)
		out.push(
			`\\text{I termini } ${g.map(monoLatex).join(g.length === 2 ? ' \\text{ e } ' : ',\\ ')} \\text{ hanno somma } 0 \\text{: spariscono}`,
		);
	const live = groups.filter((g) => !sum(g).isZero());
	const order = sortDesc(
		live.map((g) => g[0]),
		b.vars,
	).map((m) => live.find((g) => similar(g[0], m))!);
	const parts = order.map((g) => {
		if (g.length === 1) return monoLatex(g[0]);
		const lit = literalLatex(g[0].e);
		const inner = numSumLatex(g.map((t) => t.c));
		return `${inner.includes('\\frac') ? `\\left(${inner}\\right)` : `(${inner})`}${lit}`;
	});
	const lhs = parts.map((s, i) => (i === 0 ? s : s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`)).join('');
	out.push(`\\text{Somma i termini simili: } ${lhs} = ${polyLatex(reduced(b))}`);
	return out;
}

function degreeSteps(terms: Mono[], ask: string): string[] {
	const list = (ns: number[]) => (ns.length === 1 ? `${ns[0]}` : `${ns.slice(0, -1).join(',\\ ')} \\text{ e } ${ns[ns.length - 1]}`);
	if (ask === 'totale') {
		const ds = terms.map((t) => degree(t)!);
		return [`\\text{I termini hanno grado } ${list(ds)}`, `\\text{Il grado del polinomio è il più alto: } ${Math.max(...ds)}`];
	}
	const es = terms.map((t) => expOf(t, ask));
	return [
		`\\text{Esponenti di } ${ask} \\text{ nei termini: } ${list(es)}`,
		`\\text{Grado rispetto ${prep(ask)} } ${ask} \\text{: il più alto, } ${Math.max(...es)}`,
	];
}

function steps(b: Built, level: number): string[] {
	if (level <= 3) return reductionSteps(b);
	if (level === 4) return degreeSteps(b.pieces.map((p) => p.m), b.ask!);
	if (level === 5) {
		const r = reduced(b);
		const zero = b.pieces.filter((p) => !r.some((t) => similar(t, p.m)));
		const [a, c] = zero;
		return [
			`\\text{Prima si riduce: } ${monoLatex(a.m)} \\text{ e } ${monoLatex(c.m)} \\text{ si annullano}`,
			`\\text{Forma normale: } ${writtenLatex(b.pieces)} = ${polyLatex(r)}`,
			...degreeSteps(sortDesc(r, b.vars), b.ask!),
		];
	}
	if (level === 6) {
		const ts = b.pieces.map((p) => p.m);
		const v = b.vars[0];
		const es = ts.map((t) => expOf(t, v));
		const out: string[] = [];
		const { first, complete } = properties(b);
		if (b.prop === 'ordinato') {
			out.push(`\\text{Esponenti di } ${v} \\text{ da sinistra a destra: } ${es.join(',\\ ')}`);
			out.push(first ? `\\text{Diminuiscono sempre: è ordinato}` : `\\text{Non diminuiscono sempre: non è ordinato}`);
		} else {
			const ds = ts.map((t) => degree(t)!);
			out.push(`\\text{Gradi dei termini: } ${ds.join(',\\ ')}`);
			out.push(first ? `\\text{Tutti uguali: è omogeneo}` : `\\text{Non tutti uguali: non è omogeneo}`);
			out.push(`\\text{Esponenti di } ${v} \\text{: } ${es.join(',\\ ')}`);
		}
		const top = Math.max(...es);
		const missing = Array.from({ length: top + 1 }, (_, k) => top - k).filter((k) => !es.includes(k));
		if (complete) out.push(`\\text{Ci sono tutte le potenze di } ${v} \\text{ da } ${top} \\text{ a } 0 \\text{: è completo}`);
		else {
			const m = missing.map((k) => (k === 0 ? `\\text{la potenza } 0` : `${v}${k === 1 ? '' : `^${k}`}`));
			out.push(`\\text{Manca${missing.length > 1 ? 'no' : ''} } ${m.join(',\\ ')} \\text{: non è completo}`);
		}
		return out;
	}
	// level 7
	const ts = b.pieces.map((p) => p.m);
	const subs = b.subs!;
	const vals = ts.map((t) => evalMono(t, subs));
	const out: string[] = [];
	const negEven = ts.some((t) => letters(t).some((v) => subs[v].sign() < 0 && t.e[v] % 2 === 0));
	out.push(`\\text{Sostituisci e calcola: } ${substitutedSum(ts, subs)} = ${numSumLatex(vals)} = ${evalPoly(ts, subs).toLatex()}`);
	if (negEven) out.push(`\\text{Le parentesi contano: un numero negativo con esponente pari dà un risultato positivo}`);
	return out;
}

function assemble(b: Built, level: number, seed: number): Sample {
	const base = {
		generatorId: ID,
		level,
		seed,
		prompt: promptOf(b, level),
		problem: problemLatex(b),
		steps: steps(b, level),
	};
	const params: Record<string, unknown> = {
		case: b.case,
		vars: b.vars,
		pieces: b.pieces.map((p) => (p.f ? { m: monoJSON(p.m), f: p.f.map(monoJSON) } : { m: monoJSON(p.m) })),
	};
	if (level <= 3) {
		const r = reduced(b);
		return {
			...base,
			solution: polyLatex(r),
			answer: { kind: 'expression', value: polySympy(r), latex: polyLatex(r), form: 'expanded' },
			params: { ...params, reduced: r.map(monoJSON) },
		};
	}
	if (level <= 5) {
		const d = degreeOf(reduced(b), b.ask!);
		const what = b.ask === 'totale' ? '\\text{Grado complessivo: }' : `\\text{Grado rispetto ${prep(b.ask!)} } ${b.ask}\\text{: }`;
		return { ...base, solution: `${what}${d}`, answer: { kind: 'number', value: String(d) }, params: { ...params, ask: b.ask, degree: d } };
	}
	if (level === 6) {
		const { first, complete } = properties(b);
		const id = caseOf(b.prop!, first, complete);
		const opts = PROP_OPTIONS[b.prop!];
		const options: ChoiceOption[] = opts.map((o) => ({ latex: `\\text{${o.text}}`, values: [o.id] }));
		const correct = opts.findIndex((o) => o.id === id);
		return {
			...base,
			solution: `\\text{${opts[correct].text}}`,
			answer: { kind: 'choice', options, correct },
			params: { ...params, prop: b.prop, first, complete },
		};
	}
	const val = evalPoly(
		b.pieces.map((p) => p.m),
		b.subs!,
	);
	const subsJSON: Record<string, string> = {};
	for (const v of b.vars) subsJSON[v] = b.subs![v].toString();
	return {
		...base,
		solution: b.pnot ? `${pArg(b.subs!.x)} = ${val.toLatex()}` : val.toLatex(),
		answer: { kind: 'number', value: val.toString() },
		params: { ...params, subs: subsJSON, pnot: !!b.pnot, value: val.toString() },
	};
}

function parseBuilt(p: Record<string, unknown>, level: number): Built | null {
	if (!Array.isArray(p.pieces) || !Array.isArray(p.vars)) return null;
	const pieces: Piece[] = [];
	for (const x of p.pieces as { m?: unknown; f?: unknown[] }[]) {
		const m = monoFromJSON(x.m);
		if (!m) return null;
		if (Array.isArray(x.f)) {
			const f = x.f.map(monoFromJSON);
			if (f.length !== 2 || f.some((y) => !y)) return null;
			pieces.push({ m, f: [f[0]!, f[1]!] });
		} else pieces.push({ m });
	}
	const b: Built = { case: String(p.case), vars: p.vars as string[], pieces };
	if (level === 4 || level === 5) b.ask = String(p.ask);
	if (level === 6) {
		b.prop = p.prop as Prop;
		b.first = !!p.first;
		b.complete = !!p.complete;
	}
	if (level === 7) {
		const s = p.subs as Record<string, string>;
		b.subs = {};
		for (const v of b.vars) b.subs[v] = Rational.parse(s[v]);
		b.pnot = !!p.pnot;
	}
	return b;
}

// ---------------------------------------------------------------------------
// Checks

function check(sample: Sample): string[] {
	const v: string[] = [];
	const level = sample.level;
	const b = parseBuilt(sample.params, level);
	if (!b) return ['params non validi'];
	const poly = writtenLatex(b.pieces);
	v.push(...forbidden(poly));
	if (sample.problem.split('\\\\').some((l) => estWidth(l.replace(/\\(begin|end)\{aligned\}|&/g, '')) > LINE_LIMIT + 2)) v.push('riga troppo larga');
	const ts = b.pieces.map((p) => p.m);
	if (ts.some((t) => t.c.isZero())) v.push('termine nullo nel testo');
	for (const p of b.pieces) if (p.f && monoKey(mul(p.f[0], p.f[1])) !== monoKey(p.m)) v.push('prodotto non coerente');
	const r = reduced(b);
	if (r.length === 0) v.push('polinomio nullo');
	const maxExp = Math.max(0, ...ts.flatMap((t) => Object.values(t.e)));
	if (maxExp > 7) v.push('esponente troppo grande');
	const lits = new Set(ts.flatMap((t) => letters(t)));
	for (const l of lits) if (!b.vars.includes(l)) v.push(`lettera ${l} fuori da vars`);
	const hasFrac = ts.some((t) => !t.c.isInteger());
	const groupsZero = (() => {
		const keys = new Set(ts.map((t) => literalKey(t.e)));
		return [...keys].filter((k) => !r.some((t) => literalKey(t.e) === k)).length;
	})();
	switch (level) {
		case 1:
		case 2:
		case 3: {
			const exp = sample.answer.kind === 'expression' ? sample.answer : null;
			if (!exp || exp.value !== polySympy(r) || exp.latex !== polyLatex(r)) v.push('risposta diversa dalla forma normale');
			if (!hasSeparatedSimilar(b.pieces)) v.push('termini simili già vicini');
			if (b.pieces.length < 4 || b.pieces.length > 7) v.push('numero di termini scritti fuori da 4-7');
			if (r.length < 1 || r.length === ts.length) v.push('niente da ridurre');
			if (level === 1 && (b.vars.length !== 1 || hasFrac || groupsZero > 0 || b.pieces.length < 5)) v.push('livello 1: una lettera, interi, niente che si annulla');
			if (level === 2 && (b.vars.length !== 2 || hasFrac || groupsZero !== 1 || b.pieces.some((p) => p.f))) v.push('livello 2: due lettere, interi, un gruppo che si annulla');
			if (level === 3 && (!hasFrac || b.pieces.filter((p) => p.f).length !== 1 || groupsZero > 0)) v.push('livello 3: frazioni e un prodotto');
			if (level === 3) {
				const pr = b.pieces.find((p) => p.f);
				if (pr && b.pieces.filter((p) => similar(p.m, pr.m)).length < 2) v.push('il prodotto deve avere un termine simile');
			}
			if (r.some((t) => t.c.den > 12 || Math.abs(t.c.num) > 30)) v.push('coefficienti del risultato troppo grandi');
			break;
		}
		case 4:
		case 5: {
			const d = degreeOf(r, b.ask!);
			if (sample.answer.kind !== 'number' || sample.answer.value !== String(d)) v.push(`risposta diversa dal grado ${d}`);
			if (b.ask !== 'totale' && !b.vars.includes(b.ask!)) v.push('lettera chiesta fuori dal polinomio');
			if (level === 4) {
				if (r.length !== ts.length) v.push('livello 4: polinomio già in forma normale');
				if (b.ask === 'totale') {
					if (degree(ts[0]) === d) v.push('livello 4: il primo termine non deve avere il grado massimo');
				} else {
					// the term with the highest degree is not the one with the highest exponent of the letter
					const top = ts.filter((t) => degree(t) === degreeOf(ts, 'totale'));
					if (top.some((t) => expOf(t, b.ask!) === d)) v.push('livello 4: i due gradi vanno cercati per conto loro');
					if (d === 0) v.push('livello 4: la lettera chiesta deve comparire');
				}
			} else {
				if (groupsZero !== 1) v.push('livello 5: una coppia che si annulla');
				if (degreeOf(ts, b.ask!) <= d) v.push('livello 5: la coppia che si annulla deve alzare il grado');
				if (d < 1) v.push('livello 5: grado almeno 1');
			}
			break;
		}
		case 6: {
			const { first, complete } = properties(b);
			if (b.first !== first || b.complete !== complete) v.push('proprietà non coerenti');
			const a = sample.answer;
			if (a.kind !== 'choice' || a.options[a.correct].values[0] !== caseOf(b.prop!, first, complete)) v.push('opzione giusta sbagliata');
			if (b.case !== caseOf(b.prop!, first, complete)) v.push('case non coerente');
			if (r.length !== ts.length) v.push('livello 6: polinomio in forma normale');
			if (b.prop === 'ordinato') {
				if (b.vars.length !== 1 || ts.length < 3) v.push('ordinato: una lettera, almeno tre termini');
				const es = ts.map((t) => expOf(t, b.vars[0]));
				if (es.every((e, i) => i === 0 || es[i - 1] < e)) v.push('ordinato secondo le potenze crescenti: ambiguo');
			} else {
				if (b.vars.length !== 2 || !lits.has(b.vars[1])) v.push('omogeneo: due lettere');
				const es = ts.map((t) => expOf(t, b.vars[0]));
				if (!es.every((e, i) => i === 0 || es[i - 1] > e)) v.push('omogeneo: scritto per potenze decrescenti');
			}
			break;
		}
		case 7: {
			const val = evalPoly(ts, b.subs!);
			if (sample.answer.kind !== 'number' || sample.answer.value !== val.toString()) v.push('valore sbagliato');
			if (val.den > 12 || Math.abs(val.num) > 200) v.push('valore brutto');
			if (b.pnot && (b.vars.length !== 1 || b.vars[0] !== 'x')) v.push('P(x) solo in x');
			const neg = Object.values(b.subs!).some((x) => x.sign() < 0);
			const fr = Object.values(b.subs!).some((x) => !x.isInteger());
			if (b.case === 'intero negativo' && (!neg || fr || b.vars.length !== 1)) v.push('caso intero negativo');
			if (b.case === 'intero negativo' && !ts.some((t) => letters(t).length && t.e[b.vars[0]] % 2 === 0)) v.push('serve una potenza pari');
			if (b.case === 'frazione' && (!fr || b.vars.length !== 1)) v.push('caso frazione');
			if (b.case === 'due lettere' && (b.vars.length !== 2 || !neg)) v.push('caso due lettere');
			break;
		}
		default:
			v.push(`livello sconosciuto ${level}`);
	}
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice

function reductionChoice(b: Built, rng: Rng): ChoiceAnswer {
	const vars = b.vars;
	const right = reduced(b);
	const ms = b.pieces.map((p) => p.m);
	const cands: Opt[] = [];
	const groups = [...new Set(ms.map((t) => literalKey(t.e)))].map((k) => ms.map((t, i) => ({ t, i })).filter((x) => literalKey(x.t.e) === k));
	const multi = groups.filter((g) => g.length >= 2);
	// cancelling groups first: 4xy - 4xy read as 8xy
	multi.sort((g, h) => Number(g.reduce((s, x) => s.add(x.t.c), ZERO).isZero() ? 0 : 1) - Number(h.reduce((s, x) => s.add(x.t.c), ZERO).isZero() ? 0 : 1));
	// the sign does not travel with the term: one negative term taken as positive
	for (const g of multi) {
		const negs = g.filter((x) => x.t.c.sign() < 0);
		if (negs.length === 0) continue;
		const j = negs[negs.length - 1].i;
		cands.push(polyOpt(ms.map((t, i) => (i === j ? mono(t.c.neg(), { ...t.e }) : t)), vars));
	}
	// the product not reduced: letters written once, exponents not added
	for (const p of b.pieces)
		if (p.f) {
			const e: Record<string, number> = {};
			for (const v of vars) {
				const n = Math.max(expOf(p.f[0], v), expOf(p.f[1], v));
				if (n) e[v] = n;
			}
			cands.push(polyOpt(ms.map((t) => (t === p.m ? mono(p.m.c, e) : t)), vars));
		}
	// fractions added numerator with numerator and denominator with denominator
	for (const g of multi) {
		const cs = g.map((x) => x.t.c);
		if (cs.length === 2 && cs.some((c) => !c.isInteger())) {
			const wrong = q(cs[0].num + cs[1].num, cs[0].den + cs[1].den);
			if (!wrong.isZero()) cands.push(polyOpt([...ms.filter((t) => !g.some((x) => x.t === t)), mono(wrong, { ...g[0].t.e })], vars));
		}
	}
	// exponents added when adding similar terms: 3x^2 - x^2 = 2x^4
	for (const g of multi) {
		const c = g.reduce((s, x) => s.add(x.t.c), ZERO);
		if (c.isZero() || Object.keys(g[0].t.e).length === 0) continue;
		const e: Record<string, number> = {};
		for (const v of Object.keys(g[0].t.e)) e[v] = g[0].t.e[v] * g.length;
		if (ms.some((t) => literalKey(t.e) === literalKey(e))) continue;
		cands.push(polyOpt([...ms.filter((t) => !g.some((x) => x.t === t)), mono(c, e)], vars));
	}
	// a term forgotten
	for (const g of multi) cands.push(polyOpt(ms.filter((_, i) => i !== g[g.length - 1].i), vars));
	const fallback = (i: number): Opt | null => {
		const k = i % right.length;
		const t = right[k];
		const delta = q(Math.ceil(i / right.length) * (i % 2 ? 1 : -1));
		const nt = mono(t.c.add(delta), { ...t.e });
		if (nt.c.isZero()) return null;
		return polyOpt(
			right.map((x, j) => (j === k ? nt : x)),
			vars,
		);
	};
	return buildChoice(
		polyOpt(right, vars),
		cands.filter((o) => o.key !== '0'),
		fallback,
		rng,
	);
}

function degreeChoice(b: Built, rng: Rng): ChoiceAnswer {
	const r = reduced(b);
	const ts = b.pieces.map((p) => p.m);
	const d = degreeOf(r, b.ask!);
	const c: number[] = [];
	if (b.ask === 'totale') {
		if (ts.length !== r.length) c.push(degreeOf(ts, 'totale'));
		c.push(r.reduce((s, t) => s + degree(t)!, 0)); // the sum of the degrees
		c.push(Math.max(...r.flatMap((t) => Object.values(t.e))));
		c.push(degree(ts[0])!);
		c.push(r.length);
	} else {
		if (ts.length !== r.length) c.push(degreeOf(ts, b.ask!));
		c.push(degreeOf(r, 'totale'));
		const top = r.filter((t) => degree(t) === degreeOf(r, 'totale'));
		c.push(expOf(top[0], b.ask!));
		c.push(r.reduce((s, t) => s + expOf(t, b.ask!), 0));
		for (const v of b.vars) if (v !== b.ask) c.push(degreeOf(r, v));
	}
	const cands = c.filter((k) => Number.isInteger(k) && k >= 0).map((k) => ratOpt(q(k)));
	const fallback = (i: number) => {
		const k = d + (i % 2 === 1 ? Math.ceil(i / 2) : -Math.ceil(i / 2));
		return k >= 0 ? ratOpt(q(k)) : null;
	};
	return buildChoice(ratOpt(q(d)), cands, fallback, rng);
}

/** (-3)^2 read as -3^2, (1/2)^2 read as 1^2/2. */
function noParensPow(a: Rational, n: number): Rational {
	if (n === 1) return a;
	const mag = q(Math.abs(a.num) ** n, a.den);
	return a.sign() < 0 ? mag.neg() : mag;
}

function valueChoice(b: Built, rng: Rng): ChoiceAnswer {
	const ts = b.pieces.map((p) => p.m);
	const subs = b.subs!;
	const right = evalPoly(ts, subs);
	const cands: Rational[] = [];
	cands.push(
		ts.reduce((s, t) => {
			let r = t.c;
			for (const v of letters(t)) r = r.mul(noParensPow(subs[v], t.e[v]));
			return s.add(r);
		}, ZERO),
	);
	if (b.vars.length === 2) {
		const [x, y] = b.vars;
		cands.push(evalPoly(ts, { [x]: subs[y], [y]: subs[x] }));
	}
	const absSubs: Record<string, Rational> = {};
	for (const v of b.vars) absSubs[v] = subs[v].abs();
	cands.push(evalPoly(ts, absSubs));
	const k = ts.find((t) => letters(t).length === 0);
	if (k) cands.push(right.sub(k.c));
	const step = right.isInteger() ? q(1) : q(1, right.den);
	const fallback = (i: number) => ratOpt(right.add(step.mul(q(i % 2 ? Math.ceil(i / 2) : -Math.ceil(i / 2)))));
	return buildChoice(ratOpt(right), cands.map(ratOpt), fallback, rng);
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const b = parseBuilt(sample.params, sample.level)!;
	if (sample.level <= 3) return reductionChoice(b, rng);
	if (sample.level <= 5) return degreeChoice(b, rng);
	return valueChoice(b, rng);
}

export const polinomi: Generator = {
	id: ID,
	title: 'Polinomi e grado di un polinomio',
	levels: {
		1: { label: 'Forma normale in una lettera', constraints: ['da 5 a 7 termini scritti, coefficienti interi', 'almeno due gruppi di termini simili, non vicini', 'risultato ordinato per potenze decrescenti'] },
		2: { label: 'Forma normale in due lettere, con termini che si annullano', constraints: ['due lettere, coefficienti interi', 'un gruppo di termini simili ha somma 0 e sparisce'] },
		3: { label: 'Forma normale con frazioni e un monomio da ridurre', constraints: ['almeno un coefficiente frazionario', 'un termine scritto come prodotto di due monomi, simile a un altro termine'] },
		4: { label: 'Grado di un polinomio', constraints: ['polinomio in forma normale, non ordinato', 'grado complessivo (circa metà) o rispetto a una lettera', 'il termine di grado massimo non è quello con la lettera al massimo esponente'] },
		5: { label: 'Grado di un polinomio da ridurre', constraints: ['i termini di grado più alto si annullano', 'grado complessivo o rispetto a una lettera'] },
		6: { label: 'Ordinato, completo, omogeneo', constraints: ['una lettera: ordinato e completo', 'due lettere: omogeneo e completo', 'le quattro combinazioni in parti circa uguali'] },
		7: { label: 'Valore numerico', constraints: ['numero intero negativo, frazione, oppure due lettere', 'metà degli esercizi in una lettera con la scrittura P(a)'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			let sample: Sample;
			try {
				sample = assemble(b, level, rng.seed);
			} catch {
				continue;
			}
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default polinomi;
