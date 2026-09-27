/**
 * Disequazioni fratte e sistemi di secondo grado. Spec: specs/exercises/disequazioni-secondo-grado-fratte.md
 *
 * Seven levels in the order of lesson 89 (docs/lezioni/riscritte/89-disequazioni-secondo-grado-fratte.md): a
 * product of a first-degree factor and a trinomial with two zeros, a trinomial with Δ < 0 (always positive), a
 * square (Δ = 0) whose zero is an isolated point or a point taken away, a fraction N/D with a trinomial, a
 * fraction to bring to the first member whose numerator has a < 0, a system of two second-degree inequalities,
 * a rectangle whose area must be greater (or smaller) than a value.
 *
 * Built backwards from the zeros: every zero is an integer chosen first, the trinomials are written expanded
 * from them. The solution is a union of intervals and points, which no answer type of today holds: the answer
 * is a multiple choice from the start, the options written as inequalities joined by "oppure" or as intervals
 * with reversed brackets (\mathopen{]} and \mathclose{[}), as the lesson writes them. Every set is computed by
 * testing a point of each region and each zero, so an isolated point, a point taken away and the zeros of a
 * denominator come out of the same rule. The wrong options are the solutions of the mistakes of the lesson's
 * warnings.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { forbidden, shuffle } from '../monomi';

export const ID = 'disequazioni-secondo-grado-fratte';

// ---------------------------------------------------------------------------
// Signs, factors, sets

type Op = '<' | '>' | '<=' | '>=';
const OP_LATEX: Record<Op, string> = { '<': '<', '>': '>', '<=': '\\leq', '>=': '\\geq' };
const FLIP: Record<Op, Op> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
const TOGGLE: Record<Op, Op> = { '<': '<=', '>': '>=', '<=': '<', '>=': '>' };
const large = (o: Op) => o === '<=' || o === '>=';
const positive = (o: Op) => o === '>' || o === '>=';
const strictOf = (o: Op): Op => (large(o) ? TOGGLE[o] : o);

function holds(v: number, op: Op): boolean {
	return op === '<' ? v < 0 : op === '>' ? v > 0 : op === '<=' ? v <= 0 : v >= 0;
}

/** A factor with integer coefficients by degree (c[0] + c[1] x + c[2] x^2); `den` when it divides. */
interface Fac {
	c: number[];
	den?: boolean;
}

const deg = (f: Fac) => f.c.length - 1;
const at = (f: Fac, t: number) => f.c.reduce((s, k, i) => s + k * t ** i, 0);

/** Integer zeros of a factor (all zeros are integers by construction), sorted, distinct. */
function zerosOf(f: Fac): number[] {
	if (deg(f) === 1) return [-f.c[0] / f.c[1]];
	const [c, b, a] = f.c;
	const d = b * b - 4 * a * c;
	if (d < 0) return [];
	const s = Math.sqrt(d);
	const out = [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((u, v) => u - v);
	return d === 0 ? [out[0]] : out;
}
const delta = (f: Fac) => f.c[1] * f.c[1] - 4 * f.c[2] * f.c[0];

/** Value of Π num / Π den at t, or null where a denominator vanishes. */
function valueAt(fs: Fac[], t: number): number | null {
	let v = 1;
	for (const f of fs) {
		const y = at(f, t);
		if (f.den) {
			if (y === 0) return null;
			v /= y;
		} else v *= y;
	}
	return v;
}

/** A condition on x: the points where it may change, and whether it holds at a point. */
interface Cond {
	pts: number[];
	has: (t: number) => boolean;
}

const uniq = (xs: number[]) => [...new Set(xs)].sort((u, v) => u - v);
const allZeros = (fs: Fac[]) => uniq(fs.flatMap(zerosOf));

function ineq(fs: Fac[], op: Op): Cond {
	return {
		pts: allZeros(fs),
		has: (t) => {
			const v = valueAt(fs, t);
			return v !== null && holds(v, op);
		},
	};
}
const and = (...cs: Cond[]): Cond => ({ pts: uniq(cs.flatMap((c) => c.pts)), has: (t) => cs.every((c) => c.has(t)) });
const or = (...cs: Cond[]): Cond => ({ pts: uniq(cs.flatMap((c) => c.pts)), has: (t) => cs.some((c) => c.has(t)) });
const also = (c: Cond, xs: number[]): Cond => ({ pts: uniq([...c.pts, ...xs]), has: (t) => xs.includes(t) || c.has(t) });
const ALL: Cond = { pts: [], has: () => true };

/** An interval, or a point when lo = hi; null is -∞ at the left and +∞ at the right. */
interface Iv {
	lo: number | null;
	hi: number | null;
	loC: boolean;
	hiC: boolean;
}

/** Maximal runs of the line where the condition holds: regions and points, left to right. */
function setOf(c: Cond): Iv[] {
	const zs = c.pts;
	const n = zs.length;
	const probe = (i: number) => {
		if (i % 2 === 1) return c.has(zs[(i - 1) / 2]);
		const j = i / 2;
		const t = n === 0 ? 0 : j === 0 ? zs[0] - 1 : j === n ? zs[n - 1] + 1 : (zs[j - 1] + zs[j]) / 2;
		return c.has(t);
	};
	const on = Array.from({ length: 2 * n + 1 }, (_, i) => probe(i));
	const out: Iv[] = [];
	let i = 0;
	while (i <= 2 * n) {
		if (!on[i]) {
			i++;
			continue;
		}
		let j = i;
		while (j + 1 <= 2 * n && on[j + 1]) j++;
		const lo = i % 2 === 0 ? (i === 0 ? null : zs[i / 2 - 1]) : zs[(i - 1) / 2];
		const hi = j % 2 === 0 ? (j === 2 * n ? null : zs[j / 2]) : zs[(j - 1) / 2];
		out.push({ lo, hi, loC: i % 2 === 1, hiC: j % 2 === 1 });
		i = j + 1;
	}
	return out;
}

const isPoint = (iv: Iv) => iv.lo !== null && iv.lo === iv.hi;
const isEmpty = (s: Iv[]) => s.length === 0;
const isAll = (s: Iv[]) => s.length === 1 && s[0].lo === null && s[0].hi === null;
const contains = (s: Iv[], t: number) =>
	s.some((iv) => (iv.lo === null || iv.lo < t || (iv.loC && iv.lo === t)) && (iv.hi === null || t < iv.hi || (iv.hiC && iv.hi === t)));

const endKey = (r: number | null, inf: string) => (r === null ? inf : `${r}`);
/** "(-oo,-3)", "[1,oo)", "{2}": the values of an option, one per piece; no value for ∅. */
const ivValue = (iv: Iv) => (isPoint(iv) ? `{${iv.lo}}` : `${iv.loC ? '[' : '('}${endKey(iv.lo, '-oo')},${endKey(iv.hi, 'oo')}${iv.hiC ? ']' : ')'}`);
const setKey = (s: Iv[]) => (isEmpty(s) ? 'vuoto' : s.map(ivValue).join('|'));

// ---------------------------------------------------------------------------
// Writing

type Notation = 'disequazioni' | 'intervalli';

function intervalLatex(iv: Iv): string {
	if (isPoint(iv)) return `\\{${iv.lo}\\}`;
	const lo = iv.lo === null ? '-\\infty' : `${iv.lo}`;
	const hi = iv.hi === null ? '+\\infty' : `${iv.hi}`;
	return `${iv.loC ? '[' : '\\mathopen{]}'}${lo}, ${hi}${iv.hiC ? ']' : '\\mathclose{[}'}`;
}

/** S = \,\mathopen{]}-1, 2\mathclose{[}\, \cup \,\mathopen{]}3, +\infty\mathclose{[}, spaced as in the lesson. */
function setLatex(s: Iv[]): string {
	if (isEmpty(s)) return 'S = \\emptyset';
	if (isAll(s)) return 'S = \\mathbb{R}';
	let out = 'S =';
	s.forEach((iv, i) => {
		const t = intervalLatex(iv);
		if (i > 0) out += ' \\cup';
		out += t.startsWith('\\mathopen') ? ' \\,' + t : ' ' + t;
		if (i < s.length - 1 && t.endsWith('\\mathclose{[}')) out += '\\,';
	});
	return out;
}

/** x < -3, x \geq 1, -1 < x \leq 4, x = 1. */
function pieceLatex(iv: Iv): string {
	const le = (c: boolean) => (c ? '\\leq' : '<');
	if (isPoint(iv)) return `x = ${iv.lo}`;
	if (iv.lo === null) return `x ${le(iv.hiC)} ${iv.hi}`;
	if (iv.hi === null) return `x ${iv.loC ? '\\geq' : '>'} ${iv.lo}`;
	return `${iv.lo} ${le(iv.loC)} x ${le(iv.hiC)} ${iv.hi}`;
}

const OPPURE = ' \\ \\text{ oppure } \\ ';
function disLatex(s: Iv[]): string {
	if (isEmpty(s) || isAll(s)) return setLatex(s);
	return s.map(pieceLatex).join(OPPURE);
}
/**
 * An option as the answer button shows it. Two bounded intervals joined by "oppure" are too wide for a phone
 * (-6 < x < -4 oppure -2 < x < -1 is 268 px at 16 px): they go on two lines, "oppure" closing the first.
 */
function optionLatex(s: Iv[], n: Notation): string {
	if (n === 'intervalli') return setLatex(s);
	const bounded = (iv: Iv) => iv.lo !== null && iv.hi !== null && !isPoint(iv);
	if (s.length === 2 && s.every(bounded)) return `\\begin{gathered} ${pieceLatex(s[0])} \\ \\text{ oppure} \\\\ ${pieceLatex(s[1])} \\end{gathered}`;
	return disLatex(s);
}

/** c0 + c1 x + c2 x^2, highest degree first: x^2 - 5x + 6, -x^2 + 4. */
function polyLatex(c: number[]): string {
	let out = '';
	for (let d = c.length - 1; d >= 0; d--) {
		const k = c[d];
		if (k === 0) continue;
		const a = Math.abs(k);
		const mono = d === 0 ? `${a}` : `${a === 1 ? '' : a}${d === 1 ? 'x' : `x^${d}`}`;
		out += out === '' ? (k < 0 ? '-' : '') + mono : (k < 0 ? ' - ' : ' + ') + mono;
	}
	return out || '0';
}

/** A numerator with a < 0 as the lesson writes it: 4 - x^2 (constant first when it is positive), else -x^2 + 5x - 6. */
function negLatex(c: number[]): string {
	if (c[0] <= 0) return polyLatex(c);
	let out = `${c[0]}`;
	if (c[1] !== 0) out += ` ${c[1] < 0 ? '-' : '+'} ${Math.abs(c[1]) === 1 ? '' : Math.abs(c[1])}x`;
	return `${out} - x^2`;
}

const facLatex = (f: Fac) => (f.c[2] !== undefined && f.c[2] < 0 ? negLatex(f.c) : polyLatex(f.c));
const isX = (f: Fac) => deg(f) === 1 && f.c[0] === 0 && f.c[1] === 1;
/** x first, then the others in parentheses: x(x^2 - 4), (x + 1)(x^2 - 5x + 6). */
function prodLatex(fs: Fac[]): string {
	if (fs.length === 1) return facLatex(fs[0]);
	return [...fs.filter(isX).map(() => 'x'), ...fs.filter((f) => !isX(f)).map((f) => `(${facLatex(f)})`)].join('');
}

const lin = (r: number): Fac => ({ c: [-r, 1] });
const tri = (u: number, v: number): Fac => ({ c: [u * v, -(u + v), 1] });
const bin = (r: number) => polyLatex([-r, 1]);

// ---------------------------------------------------------------------------
// Steps

function listZeros(zs: number[]): string {
	const xs = zs.map((z) => `x = ${z}`);
	return xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(',\\ ')} \\text{ e } ${xs[xs.length - 1]}`;
}

/** Δ = 25 - 24 = 1, written from b^2 and 4ac. */
function deltaLatex(f: Fac): string {
	const [c, b, a] = f.c;
	const ac4 = 4 * a * c;
	const d = delta(f);
	if (b === 0) return `\\Delta = ${d}`;
	return `\\Delta = ${b * b} ${ac4 > 0 ? '-' : '+'} ${Math.abs(ac4)} = ${d}`;
}

/** How the sign of a factor is found, as the lesson does it. */
function studyLine(f: Fac, label = ''): string {
	const head = label ? `\\text{${label}: } ` : '';
	const L = facLatex(f);
	if (deg(f) === 1) {
		const z = zerosOf(f)[0];
		if (isX(f)) return `${head}x > 0`;
		return `${head}${L} > 0 \\ \\Rightarrow \\ x > ${z}`;
	}
	const a = f.c[2];
	const zs = zerosOf(f);
	const d = delta(f);
	if (d < 0) return `${head}${L} \\text{ ha } a = ${a} \\text{ e } ${deltaLatex(f)}\\text{: è positivo per ogni } x`;
	if (d === 0) {
		const s = zs[0];
		return `${head}${L} \\text{ ha } ${deltaLatex(f)} \\text{ ed è il quadrato } (${bin(s)})^2\\text{: vale zero in } ${s} \\text{ ed è positivo per ogni altro } x`;
	}
	const [u, v] = zs;
	let how: string;
	if (f.c[1] === 0) how = `\\text{ si annulla in } ${u} \\text{ e in } ${v}`;
	else if (f.c[0] === 0) how = ` = ${a < 0 ? '-' : ''}x(${bin(u + v)})\\text{ si annulla in } ${u} \\text{ e in } ${v}`;
	else how = `\\text{ ha } ${deltaLatex(f)} \\text{ e si annulla in } ${u} \\text{ e in } ${v}`;
	if (a > 0) return `${head}${L}${how}\\text{: con } a > 0 \\text{ è positivo fuori da } ${u} \\text{ e } ${v}\\text{, negativo in mezzo}`;
	return `${head}${L}${how}\\text{: con } a < 0 \\text{ è positivo tra } ${u} \\text{ e } ${v}\\text{, negativo fuori}`;
}

function regionLatex(zs: number[], j: number): string {
	if (j === 0) return `x < ${zs[0]}`;
	if (j === zs.length) return `x > ${zs[zs.length - 1]}`;
	return `${zs[j - 1]} < x < ${zs[j]}`;
}

function signLine(fs: Fac[], what: string): string {
	const zs = allZeros(fs);
	const parts = Array.from({ length: zs.length + 1 }, (_, j) => {
		const t = zs.length === 0 ? 0 : j === 0 ? zs[0] - 1 : j === zs.length ? zs[zs.length - 1] + 1 : (zs[j - 1] + zs[j]) / 2;
		return `${valueAt(fs, t)! > 0 ? '+' : '-'} \\text{ per } ${regionLatex(zs, j)}`;
	});
	return `\\text{Segno ${what}: } ${parts.join('\\text{, } ')}\\text{.}`;
}

/** Which regions and which zeros enter the solution. */
function pickLine(fs: Fac[], op: Op, fraction: boolean): string {
	const want = positive(op) ? '+' : '-';
	const head = `\\text{Il verso è } ${OP_LATEX[op]}\\text{: servono gli intervalli con il } ${want}`;
	const num = uniq(fs.filter((f) => !f.den).flatMap(zerosOf));
	const den = uniq(fs.filter((f) => f.den).flatMap(zerosOf));
	const truth = setOf(ineq(fs, op));
	if (!large(op)) {
		// a zero of a square inside a chosen region is taken away
		const zs = allZeros(fs);
		const holes = num.filter((z) => {
			const i = zs.indexOf(z);
			const l = i === 0 ? z - 1 : (zs[i - 1] + z) / 2;
			const r = i === zs.length - 1 ? z + 1 : (zs[i + 1] + z) / 2;
			return contains(truth, l) && contains(truth, r);
		});
		if (holes.length) return `${head}\\text{, estremi esclusi; } ${listZeros(holes)} \\text{ va tolto, perché lì ${fraction ? 'la frazione' : 'il prodotto'} vale zero e } 0 ${OP_LATEX[op]} 0 \\text{ è falso.}`;
		return `${head}\\text{, estremi esclusi.}`;
	}
	const zerosText = num.length > 1 ? '\\text{ e gli zeri } ' : '\\text{ e lo zero } ';
	if (!fraction) return `${head}${zerosText}${listZeros(num)}\\text{, dove il prodotto vale zero.}`;
	const where = num.length > 1 ? '\\text{ e gli zeri del numeratore } ' : '\\text{ e lo zero del numeratore } ';
	const out = den.length > 1 ? '\\text{ restano esclusi}' : '\\text{ resta escluso}';
	return `${head}${where}${listZeros(num)}\\text{; } ${listZeros(den)} ${out}\\text{, perché lì la frazione non esiste.}`;
}

// ---------------------------------------------------------------------------
// Levels

interface Cand {
	tag: string;
	set: Iv[];
}

interface Build {
	form: string;
	op: Op;
	/** Factors of the reduced form Π num / Π den op 0 (levels 1-5); empty for the system and the problem. */
	fs: Fac[];
	problem: string;
	prompt: string;
	/** Steps before the sign study (levels 1-5), or all the steps but the last (levels 6-7). */
	lead: string[];
	fraction: boolean;
	truth: Iv[];
	/** Wrong answers from the lesson's warnings, in order of preference. */
	cands: Cand[];
	notation?: Notation;
	/** The steps are all in `lead` (system, problem). */
	own?: boolean;
	extra: Record<string, unknown>;
}

const intIn = (rng: Rng, lo: number, hi: number, not: number[] = []) => {
	for (;;) {
		const v = rng.int(lo, hi);
		if (!not.includes(v)) return v;
	}
};
const S = (c: Cond) => setOf(c);
const flipAll = (fs: Fac[], op: Op) => S(ineq(fs, FLIP[op]));
const toggleAll = (fs: Fac[], op: Op) => S(ineq(fs, TOGGLE[op]));
/** The mistake "confondere la tabella dei segni con un sistema": every factor with the sign asked. */
const systemOf = (fs: Fac[], op: Op) => S(and(...fs.map((f) => ineq([{ c: f.c }], f.den ? strictOf(op) : op))));
/** The fraction multiplied by its denominator as if it were positive: only the numerator is left. */
const multiplied = (fs: Fac[], op: Op) => S(ineq(fs.filter((f) => !f.den), op));
const withDenZeros = (fs: Fac[], op: Op) => S(also(ineq(fs, op), uniq(fs.filter((f) => f.den).flatMap(zerosOf))));

function level1(rng: Rng): Build | null {
	const u = rng.int(-6, 5);
	const v = rng.int(u + 1, 6);
	const r = intIn(rng, -6, 6, [u, v]);
	const T = tri(u, v);
	const L = lin(r);
	const fs = isX(L) || rng.next() < 0.5 ? [L, T] : [T, L];
	const op = rng.pick<Op>(['<', '>']);
	const cands: Cand[] = [
		{ tag: 'scambiati', set: flipAll(fs, op) },
		{ tag: 'estremi', set: toggleAll(fs, op) },
		{ tag: 'sistema', set: systemOf(fs, op) },
		{ tag: 'radici', set: S(ineq(fs.map((f) => (f === T ? tri(-v, -u) : f)), op)) },
	];
	if (r !== 0) cands.push({ tag: 'zero', set: S(ineq(fs.map((f) => (f === L ? lin(-r) : f)), op)) });
	return {
		form: 'prodotto',
		op,
		fs,
		prompt: 'Risolvi la disequazione.',
		problem: `${prodLatex(fs)} ${OP_LATEX[op]} 0`,
		lead: [`\\text{Il primo membro è già scomposto e il secondo è zero.}`],
		fraction: false,
		truth: S(ineq(fs, op)),
		cands,
		extra: { u, v, r },
	};
}

function level2(rng: Rng): Build | null {
	const b = rng.int(-4, 4);
	const c = rng.int(1, 9);
	if (b * b - 4 * c >= 0) return null;
	const T: Fac = { c: [c, b, 1] };
	const r = rng.int(-9, 9);
	const L = lin(r);
	const fs = isX(L) || rng.next() < 0.5 ? [L, T] : [T, L];
	const op = rng.pick<Op>(['<', '>', '<=', '>=']);
	return {
		form: 'delta negativo',
		op,
		fs,
		prompt: 'Risolvi la disequazione.',
		problem: `${prodLatex(fs)} ${OP_LATEX[op]} 0`,
		lead: [`\\text{Il primo membro è già scomposto e il secondo è zero.}`],
		fraction: false,
		truth: S(ineq(fs, op)),
		cands: [
			{ tag: 'impossibile', set: [] },
			{ tag: 'scambiati', set: flipAll(fs, op) },
			{ tag: 'estremi', set: toggleAll(fs, op) },
			{ tag: 'sempre', set: S(ALL) },
		],
		extra: { b, c, r },
	};
}

function level3(rng: Rng): Build | null {
	const s = intIn(rng, -6, 6, [0]);
	const r = intIn(rng, -9, 9, [s]);
	// the square's zero must matter: an isolated point with ≥ and ≤, a point taken away with > and <
	const op = s < r ? rng.pick<Op>(['>=', '<']) : rng.pick<Op>(['<=', '>']);
	const Q: Fac = { c: [s * s, -2 * s, 1] };
	const L = lin(r);
	const fs = isX(L) || rng.next() < 0.5 ? [L, Q] : [Q, L];
	return {
		form: large(op) ? 'punto isolato' : 'punto tolto',
		op,
		fs,
		prompt: 'Risolvi la disequazione.',
		problem: `${prodLatex(fs)} ${OP_LATEX[op]} 0`,
		lead: [`\\text{Il primo membro è già scomposto e il secondo è zero.}`],
		fraction: false,
		truth: S(ineq(fs, op)),
		cands: [
			{ tag: 'punto', set: S(ineq([L], op)) },
			{ tag: 'estremi', set: toggleAll(fs, op) },
			{ tag: 'scambiati', set: flipAll(fs, op) },
			{ tag: 'scambiati ed estremi', set: S(ineq(fs, TOGGLE[FLIP[op]])) },
		],
		extra: { s, r },
	};
}

/** `x` is drawn once per exercise, so that retries do not change the share of the forms. */
function level4(rng: Rng, x: number): Build | null {
	const op = rng.pick<Op>(['<', '>', '<=', '>=', '<=', '>=']);
	const u = rng.int(-6, 5);
	const v = rng.int(u + 1, 6);
	let N: Fac, D: Fac, form: string;
	if (x < 0.4) {
		const r = intIn(rng, -6, 6, [u, v]);
		N = tri(u, v);
		D = { ...lin(r), den: true };
		form = 'trinomio al numeratore';
	} else if (x < 0.75) {
		const r = intIn(rng, -6, 6, [u, v]);
		N = lin(r);
		D = { ...tri(u, v), den: true };
		form = 'trinomio al denominatore';
	} else {
		const s = intIn(rng, -6, 6, [u, v, 0]);
		N = { c: [s * s, -2 * s, 1] };
		D = { ...tri(u, v), den: true };
		form = 'quadrato al numeratore';
	}
	const fs = [N, D];
	const cands: Cand[] = [];
	if (large(op)) cands.push({ tag: 'denominatore', set: withDenZeros(fs, op) });
	if (form === 'quadrato al numeratore') cands.push({ tag: 'punto', set: S(ineq([D], op)) });
	cands.push(
		{ tag: 'moltiplica', set: multiplied(fs, op) },
		{ tag: 'scambiati', set: flipAll(fs, op) },
		{ tag: 'estremi', set: toggleAll(fs, op) },
		{ tag: 'sistema', set: systemOf(fs, op) },
	);
	const dz = zerosOf(D);
	const ce = dz.map((z) => `x \\neq ${z}`).join(',\\ ');
	return {
		form,
		op,
		fs,
		prompt: 'Risolvi la disequazione.',
		problem: `\\frac{${facLatex(N)}}{${facLatex(D)}} ${OP_LATEX[op]} 0`,
		lead: [`\\text{C.E.: } ${ce}\\text{. Il primo membro è già una frazione sola e il secondo è zero.}`],
		fraction: true,
		truth: S(ineq(fs, op)),
		cands,
		extra: {},
	};
}

/** (x - d)(x - c) written as the lesson would: x^2, x(x - 3), (x - 2)(x + 1). */
function pairLatex(d: number, c: number): string {
	if (d === 0 && c === 0) return 'x^2';
	if (d === 0 || c === 0) return `x(${bin(d === 0 ? c : d)})`;
	return `(${bin(d)})(${bin(c)})`;
}

function level5(rng: Rng): Build | null {
	const u = rng.int(-5, 4);
	const v = rng.int(u + 1, 5);
	const c = intIn(rng, -5, 5, [u, v]);
	const d = u + v - c;
	const p = c * d - u * v;
	if (Math.abs(d) > 6 || p <= 0 || p > 16) return null;
	const op = rng.pick<Op>(['<', '>', '<=', '>=']);
	const o = OP_LATEX[op];
	const N: Fac = { c: [-u * v, u + v, -1] };
	const D: Fac = { ...lin(c), den: true };
	const fs = [N, D];
	const f0 = `\\frac{${p}}{${bin(c)}}`;
	const moved = d === 0 ? '- x' : `- (${bin(d)})`;
	const cands: Cand[] = [
		{ tag: 'moltiplica', set: multiplied(fs, op) },
		{ tag: 'segno a', set: S(ineq([{ c: N.c.map((k) => -k) }, D], op)) },
	];
	if (large(op)) cands.push({ tag: 'denominatore', set: withDenZeros(fs, op) });
	cands.push({ tag: 'estremi', set: toggleAll(fs, op) }, { tag: 'sistema', set: systemOf(fs, op) });
	return {
		form: c === 0 ? 'denominatore x' : 'denominatore x - c',
		op,
		fs,
		prompt: 'Risolvi la disequazione.',
		problem: `${f0} ${o} ${bin(d)}`,
		lead: [
			`\\text{C.E.: } x \\neq ${c}\\text{. Porta } ${bin(d)} \\text{ a primo membro e riduci al denominatore } ${bin(c)}\\text{:}`,
			`${f0} ${moved} ${o} 0`,
			`\\frac{${p} - ${pairLatex(d, c)}}{${bin(c)}} ${o} 0`,
			`\\frac{${negLatex(N.c)}}{${bin(c)}} ${o} 0`,
		],
		fraction: true,
		truth: S(ineq(fs, op)),
		cands,
		extra: { p, c, d },
	};
}

// Level 6: systems

type RowForm = 'trinomio' | 'x^2 e k^2' | 'x^2 e kx';
interface Row {
	u: number;
	v: number;
	op: Op;
	form: RowForm;
}

const rowFac = (r: Row) => tri(r.u, r.v);
function rowLatex(r: Row): string {
	const o = OP_LATEX[r.op];
	if (r.form === 'x^2 e k^2') return `x^2 ${o} ${r.v * r.v}`;
	if (r.form === 'x^2 e kx') return `x^2 ${o} ${polyLatex([0, r.u + r.v])}`;
	return `${polyLatex(rowFac(r).c)} ${o} 0`;
}
const rowCond = (r: Row, op: Op = r.op) => ineq([rowFac(r)], op);

function rowSteps(r: Row, name: string): string {
	const T = rowFac(r);
	const o = OP_LATEX[r.op];
	const head = `\\text{${name} disequazione: }`;
	let out = head;
	if (r.form !== 'trinomio') out += `${polyLatex(T.c)} ${o} 0\\text{; }`;
	const sol = S(rowCond(r));
	const inside = positive(r.op) ? 'fuori dalle soluzioni' : 'tra le soluzioni';
	let how: string;
	if (r.form === 'x^2 e kx') how = `${polyLatex(T.c)} = x(${bin(r.u + r.v)}) \\text{ si annulla in } ${r.u} \\text{ e in } ${r.v}`;
	else if (r.form === 'x^2 e k^2' || T.c[1] === 0) how = `${polyLatex(T.c)} \\text{ si annulla in } ${r.u} \\text{ e in } ${r.v}`;
	else how = `${polyLatex(T.c)} \\text{ ha } ${deltaLatex(T)} \\text{ e si annulla in } ${r.u} \\text{ e in } ${r.v}`;
	const ends = large(r.op) ? '\\text{, estremi compresi}' : '\\text{, estremi esclusi}';
	return `${out}${how}\\text{; con } a > 0 \\text{ il verso } ${o} \\text{ chiede i valori ${inside}}${ends}\\text{: } ${disLatex(sol)}`;
}

function randomRow(rng: Rng): Row {
	const u = rng.int(-6, 5);
	const v = rng.int(u + 1, 6);
	const op = rng.pick<Op>(['<', '>', '<=', '>=']);
	let form: RowForm = 'trinomio';
	if (u === -v && rng.next() < 0.6) form = 'x^2 e k^2';
	else if ((u === 0 || v === 0) && rng.next() < 0.6) form = 'x^2 e kx';
	return { u, v, op, form };
}

function level6(rng: Rng): Build | null {
	const rows = [randomRow(rng), randomRow(rng)];
	if (rows[0].u === rows[1].u && rows[0].v === rows[1].v) return null;
	const c1 = rowCond(rows[0]);
	const c2 = rowCond(rows[1]);
	const truth = S(and(c1, c2));
	// both rows must matter
	if (setKey(truth) === setKey(S(c1)) || setKey(truth) === setKey(S(c2))) return null;
	const T1 = rowFac(rows[0]);
	const T2 = rowFac(rows[1]);
	const lead = [rowSteps(rows[0], 'Prima'), rowSteps(rows[1], 'Seconda')];
	lead.push(`\\text{Nel grafico del sistema le linee delle due righe ci sono insieme in:}`);
	return {
		form: 'sistema',
		op: rows[0].op,
		fs: [],
		prompt: 'Risolvi il sistema di disequazioni.',
		problem: `\\begin{cases} ${rowLatex(rows[0])} \\\\ ${rowLatex(rows[1])} \\end{cases}`,
		lead,
		fraction: false,
		truth,
		own: true,
		cands: [
			{ tag: 'unione', set: S(or(c1, c2)) },
			{ tag: 'prodotto', set: S(ineq([T1, T2], rows[0].op)) },
			{ tag: 'verso:1', set: S(and(rowCond(rows[0], FLIP[rows[0].op]), c2)) },
			{ tag: 'verso:2', set: S(and(c1, rowCond(rows[1], FLIP[rows[1].op]))) },
			{ tag: 'estremi', set: S(and(rowCond(rows[0], TOGGLE[rows[0].op]), rowCond(rows[1], TOGGLE[rows[1].op]))) },
		],
		extra: { rows: rows.map((r) => ({ u: r.u, v: r.v, op: r.op, form: r.form })) },
	};
}

// Level 7: the area of a rectangle, or the product of two numbers with a given sum

function level7(rng: Rng): Build | null {
	const p = rng.int(5, 14);
	const u = rng.int(1, Math.floor((p - 1) / 2));
	const v = p - u;
	if (u === v) return null;
	const A = u * v;
	const story = rng.pick(['rettangolo', 'rettangolo', 'numeri']);
	const op: Op = rng.pick(['>', '<']);
	const more = op === '>';
	const T = tri(u, v); // x^2 - p x + A
	const limits: Cond = { pts: [0, p], has: (t) => t > 0 && t < p };
	const area: Cond = { pts: [u, v], has: (t) => holds(t * (p - t) - A, op) };
	const truth = S(and(area, limits));
	const word = more ? 'maggiore' : 'minore';
	const problem =
		story === 'rettangolo'
			? `\\begin{array}{l} \\text{Un rettangolo ha il perimetro di $${2 * p}$ cm.} \\\\ \\text{Per quali misure della base l'area è ${word} di $${A}\\ \\text{cm}^2$?} \\end{array}`
			: `\\begin{array}{l} \\text{Due numeri positivi hanno per somma $${p}$.} \\\\ \\text{Per quali valori del primo numero il loro prodotto è ${word} di $${A}$?} \\end{array}`;
	const lead: string[] = [];
	if (story === 'rettangolo') {
		lead.push(`\\text{Chiama } x \\text{ la misura della base, in centimetri. La somma di base e altezza è metà del perimetro, } ${p} \\text{ cm, quindi l'altezza misura } ${p} - x`);
		lead.push(`\\text{Base e altezza devono essere positive: } x > 0 \\text{ e } ${p} - x > 0\\text{, cioè } 0 < x < ${p}`);
	} else {
		lead.push(`\\text{Chiama } x \\text{ il primo numero: il secondo è } ${p} - x`);
		lead.push(`\\text{Tutti e due devono essere positivi: } x > 0 \\text{ e } ${p} - x > 0\\text{, cioè } 0 < x < ${p}`);
	}
	const what = story === 'rettangolo' ? "L'area" : 'Il prodotto';
	const o = OP_LATEX[op];
	lead.push(`\\text{${what} è } x(${p} - x)\\text{, e deve essere ${word} di } ${A}\\text{: } x(${p} - x) ${o} ${A} \\ \\Rightarrow \\ -x^2 + ${p}x - ${A} ${o} 0`);
	lead.push(`\\text{Moltiplica per } -1 \\text{ e cambia il verso: } ${polyLatex(T.c)} ${OP_LATEX[FLIP[op]]} 0`);
	lead.push(`\\text{Il trinomio ha } ${deltaLatex(T)} \\text{ e si annulla in } ${u} \\text{ e in } ${v}\\text{; con } a > 0 \\text{ è ${more ? 'negativo in mezzo' : 'positivo fuori'}: } ${disLatex(S(ineq([T], FLIP[op])))}`);
	if (more) lead.push(`\\text{Questi valori stanno tutti tra } 0 \\text{ e } ${p}\\text{, quindi rispettano le limitazioni.}`);
	else lead.push(`\\text{Con le limitazioni } 0 < x < ${p} \\text{ restano solo i valori positivi e minori di } ${p}\\text{.}`);
	if (story === 'rettangolo')
		lead.push(
			more
				? `\\text{L'area supera } ${A}\\ \\text{cm}^2 \\text{ quando la base misura più di } ${u} \\text{ cm e meno di } ${v} \\text{ cm.}`
				: `\\text{L'area è minore di } ${A}\\ \\text{cm}^2 \\text{ quando la base misura meno di } ${u} \\text{ cm, oppure più di } ${v} \\text{ cm e meno di } ${p} \\text{ cm.}`,
		);
	else
		lead.push(
			more
				? `\\text{Il prodotto supera } ${A} \\text{ quando il primo numero è maggiore di } ${u} \\text{ e minore di } ${v}\\text{.}`
				: `\\text{Il prodotto è minore di } ${A} \\text{ quando il primo numero è minore di } ${u}\\text{, oppure maggiore di } ${v} \\text{ e minore di } ${p}\\text{.}`,
		);
	const flipped: Cond = { pts: [u, v], has: (t) => holds(at(T, t), op) };
	return {
		form: `${story} ${more ? 'maggiore' : 'minore'}`,
		op,
		fs: [],
		prompt: 'Risolvi il problema con una disequazione.',
		problem,
		lead,
		fraction: false,
		truth,
		own: true,
		notation: 'disequazioni',
		cands: [
			{ tag: 'senza limitazioni', set: S(area) },
			{ tag: 'verso', set: S(and(flipped, limits)) },
			{ tag: 'verso senza limitazioni', set: S(flipped) },
			{ tag: 'estremi', set: S(and({ pts: [u, v], has: (t) => holds(t * (p - t) - A, TOGGLE[op]) }, limits)) },
		],
		extra: { story, p, A, u, v },
	};
}

const BUILDERS: Record<number, (rng: Rng, form: number) => Build | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

// ---------------------------------------------------------------------------
// Assembly

/** A set that fits an answer button on a phone: at most two pieces (an interval or a point each). */
function fits(s: Iv[]): boolean {
	return s.length <= 2;
}

function assemble(b: Build, level: number, rng: Rng): Sample | null {
	const truth = b.truth;
	if (isEmpty(truth) || isAll(truth) || !fits(truth)) return null;
	const notation: Notation = b.notation ?? (rng.next() < 0.5 ? 'disequazioni' : 'intervalli');

	const picked: Cand[] = [{ tag: 'giusta', set: truth }];
	const seen = new Set([setKey(truth)]);
	for (const c of b.cands) {
		if (picked.length === 4) break;
		if (!fits(c.set) || seen.has(setKey(c.set))) continue;
		if (isEmpty(c.set) && c.tag !== 'impossibile') continue;
		if (isAll(c.set) && c.tag !== 'sempre') continue;
		seen.add(setKey(c.set));
		picked.push(c);
	}
	if (picked.length < 4) return null;
	const order = shuffle(
		rng,
		picked.map((_, i) => i),
	);
	const options: ChoiceOption[] = order.map((i) => ({ latex: optionLatex(picked[i].set, notation), values: picked[i].set.map(ivValue) }));
	const answer: ChoiceAnswer = { kind: 'choice', options, correct: order.indexOf(0) };

	const steps = [...b.lead];
	if (!b.own) {
		const nums = b.fs.filter((f) => !f.den);
		const dens = b.fs.filter((f) => f.den);
		if (b.fraction) {
			for (const f of nums) steps.push(studyLine(f, 'Numeratore'));
			for (const f of dens) steps.push(studyLine(f, 'Denominatore'));
		} else {
			steps.push(`\\text{Studia il segno di ogni fattore:}`);
			for (const f of nums) steps.push(studyLine(f));
		}
		steps.push(signLine(b.fs, b.fraction ? 'della frazione' : 'del prodotto'));
		steps.push(pickLine(b.fs, b.op, b.fraction));
	}
	steps.push(disLatex(truth));

	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: b.prompt,
		problem: b.problem,
		solution: setLatex(truth),
		steps,
		answer,
		params: {
			form: b.form,
			op: b.op,
			factors: b.fs.map((f) => ({ c: f.c, den: !!f.den })),
			notation,
			truth: truth.map(ivValue),
			optionTags: order.map((i) => picked[i].tag),
			...b.extra,
		},
	};
}

// ---------------------------------------------------------------------------
// Check

function setFromValues(vals: string[]): Iv[] | null {
	const out: Iv[] = [];
	for (const v of vals) {
		const pt = /^\{(-?\d+)\}$/.exec(v);
		if (pt) {
			out.push({ lo: Number(pt[1]), hi: Number(pt[1]), loC: true, hiC: true });
			continue;
		}
		const m = /^([[(])([^,]+),([^,]+)([\])])$/.exec(v);
		if (!m) return null;
		out.push({ lo: m[2] === '-oo' ? null : Number(m[2]), hi: m[3] === 'oo' ? null : Number(m[3]), loC: m[1] === '[', hiC: m[4] === ']' });
	}
	return out;
}

function check(s: Sample): string[] {
	const errs: string[] = [];
	const p = s.params as { form: string; op: Op; factors: Fac[]; notation: Notation; optionTags: string[]; truth: string[] };
	const lvl = s.level;
	if (!BUILDERS[lvl]) return [`livello ${lvl} sconosciuto`];
	const fs = p.factors;
	const ans = s.answer;
	if (ans.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (ans.options.length !== 4) errs.push('servono quattro opzioni');
	const keys = ans.options.map((o) => (o.values.length ? o.values.join('|') : 'vuoto'));
	if (new Set(keys).size !== keys.length) errs.push('opzioni uguali');
	if (keys[ans.correct] !== p.truth.join('|')) errs.push('opzione giusta diversa dalla soluzione');
	for (const o of ans.options) {
		const set = setFromValues(o.values);
		if (!set || o.latex !== optionLatex(set, p.notation)) errs.push(`testo dell'opzione diverso dai valori: ${o.latex}`);
	}
	if (p.optionTags[ans.correct] !== 'giusta') errs.push('etichetta della risposta giusta');
	if (lvl <= 5) {
		const truth = setOf(ineq(fs, p.op));
		if (setKey(truth) !== p.truth.join('|')) errs.push('soluzione dei params diversa dalla tabella dei segni');
		const nz = fs.filter((f) => !f.den).flatMap(zerosOf);
		const dz = fs.filter((f) => f.den).flatMap(zerosOf);
		if (nz.some((z) => dz.includes(z))) errs.push('la frazione si semplifica');
		if (new Set(fs.flatMap(zerosOf)).size !== fs.flatMap(zerosOf).length) errs.push('due fattori con uno zero in comune');
		for (const z of dz) if (contains(truth, z)) errs.push('zero del denominatore incluso');
		for (const z of nz) if (large(p.op) !== contains(truth, z)) errs.push(`zero ${z} del numeratore: incluso solo con un verso largo`);
		const tri2 = fs.filter((f) => deg(f) === 2);
		if (tri2.length === 0) errs.push('serve un fattore di secondo grado');
		if (lvl === 1 && (large(p.op) || !tri2.every((f) => delta(f) > 0 && f.c[2] === 1))) errs.push('livello 1: trinomio con due zeri, verso stretto');
		if (lvl === 2 && !tri2.some((f) => delta(f) < 0)) errs.push('livello 2: serve un trinomio con Δ < 0');
		if (lvl === 3) {
			const sq = tri2.find((f) => delta(f) === 0);
			if (!sq) errs.push('livello 3: serve un quadrato');
			else {
				const z = zerosOf(sq)[0];
				const rest = setOf(ineq(fs.filter((f) => f !== sq), p.op));
				if (contains(rest, z) === contains(truth, z)) errs.push('livello 3: lo zero del quadrato non cambia la soluzione');
			}
		}
		if (lvl <= 3 && fs.some((f) => f.den)) errs.push('livelli 1-3: nessun denominatore');
		if (lvl >= 4 && fs.filter((f) => f.den).length !== 1) errs.push('livelli 4-5: un denominatore');
		if (lvl === 5 && !tri2.some((f) => f.c[2] < 0)) errs.push('livello 5: numeratore con a < 0');
		if (lvl <= 4) errs.push(...forbidden(s.problem));
	}
	if (lvl === 5 && /\\frac\{-/.test(s.problem)) errs.push('segno dentro la frazione');
	if (lvl === 6 && !/^\\begin\{cases\}.*\\end\{cases\}$/.test(s.problem)) errs.push('livello 6: un sistema');
	if (!s.steps.length || !s.solution) errs.push('mancano passaggi o soluzione');
	return errs;
}

const disequazioniSecondoGradoFratte: Generator = {
	id: ID,
	title: 'Disequazioni fratte e sistemi di secondo grado',
	levels: {
		1: { label: 'Un fattore e un trinomio', constraints: ['(x - r)(x^2 + bx + c) con zeri interi distinti tra -6 e 6', 'verso stretto'] },
		2: { label: 'Un trinomio con Δ negativo', constraints: ['x^2 + bx + c con Δ < 0 per x - r', 'tutti i versi'] },
		3: { label: 'Un quadrato', constraints: ['(x - s)^2 scritto sviluppato per x - r', 'lo zero del quadrato è un punto isolato (≥, ≤) o un punto tolto (>, <)'] },
		4: { label: 'Frazione con un trinomio', constraints: ['N/D op 0 con un trinomio al numeratore, al denominatore o un quadrato sopra un trinomio'] },
		5: { label: 'Frazione da ridurre, a negativo', constraints: ['p/(x - c) op x - d, numeratore ridotto con a = -1'] },
		6: { label: 'Sistema di due disequazioni', constraints: ['due trinomi con zeri interi, ogni riga conta'] },
		7: { label: 'Problema con un\'area', constraints: ['perimetro 2p, area maggiore o minore di uv con u + v = p', 'limitazioni 0 < x < p'] },
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILDERS[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		const form = rng.next();
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, form);
			if (!b) continue;
			const sample = assemble(b, level, rng);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice: (sample: Sample) => {
		if (sample.answer.kind !== 'choice') throw new Error(`${ID}: the answer is always a choice`);
		return sample.answer;
	},
};

export default disequazioniSecondoGradoFratte;
