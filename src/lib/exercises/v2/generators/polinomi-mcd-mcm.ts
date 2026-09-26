/**
 * MCD e MCM di polinomi. Spec: specs/exercises/polinomi-mcd-mcm.md
 *
 * Seven levels in the order of the lesson (docs/lezioni/riscritte/38-polinomi-mcd-mcm.md), each
 * adding one difficulty: two polynomials with simple factors; exponents that differ; three
 * polynomials; opposite factors (3 - x and x - 3); two letters; a difference or sum of cubes with
 * its false square; fractional numeric factors. Each exercise asks for the MCD or the MCM (about
 * half each), in factored form.
 *
 * Built backwards: every polynomial is chosen as a numeric factor times irreducible factors with
 * exponents, and only then expanded for the text. The answer follows the lesson's conventions:
 * numeric factor = MCD (MCM) of the absolute values when all numeric factors are integers, 1 when
 * at least one is a fraction, always positive; each factor written with its first term positive in
 * decreasing powers of x (x - 3, never 3 - x); the result left factored.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { type Mono, type Opt, buildChoice, collect, forbidden, literalLatex, mono, monoFromJSON, monoJSON, monoKey, polySympy, shuffle, sumLatex } from '../monomi';

export const ID = 'polinomi-mcd-mcm';

type Kind = 'MCD' | 'MCM';

/** An irreducible factor (terms in display order) with its exponent. */
interface Fac {
	t: Mono[];
	e: number;
}

/** A polynomial as numeric factor times factors, or a result of MCD/MCM. */
interface Pol {
	c: Rational;
	fs: Fac[];
}

interface Built {
	kind: Kind;
	vars: string[];
	polys: Pol[];
}

const ORD = ['primo', 'secondo', 'terzo'];

// ---------------------------------------------------------------------------
// Polynomial arithmetic on lists of monomials

const tKey = (t: Mono[]): string => t.map(monoKey).sort().join('+');
const isLetter = (t: Mono[]): boolean => t.length === 1;

function polyMul(a: Mono[], b: Mono[]): Mono[] {
	const out: Mono[] = [];
	for (const x of a) for (const y of b) out.push(mulMono(x, y));
	return collect(out);
}

function mulMono(a: Mono, b: Mono): Mono {
	const e: Record<string, number> = { ...a.e };
	for (const v of Object.keys(b.e)) e[v] = (e[v] ?? 0) + b.e[v];
	return mono(a.c.mul(b.c), e);
}

/** Lexicographic order on the exponents of vars, highest first (decreasing powers of x). */
function cmpDesc(vars: string[]) {
	return (a: Mono, b: Mono): number => {
		for (const v of vars) {
			const d = (b.e[v] ?? 0) - (a.e[v] ?? 0);
			if (d !== 0) return d;
		}
		return 0;
	};
}

const sortDesc = (t: Mono[], vars: string[]): Mono[] => [...t].sort(cmpDesc(vars));
const sortAsc = (t: Mono[], vars: string[]): Mono[] => [...t].sort(cmpDesc(vars)).reverse();

function expand(p: Pol, vars: string[]): Mono[] {
	let acc: Mono[] = [mono(p.c)];
	for (const f of p.fs) for (let i = 0; i < f.e; i++) acc = polyMul(acc, f.t);
	return sortDesc(acc, vars);
}

const tDegree = (t: Mono[]): number => Math.max(...t.map((m) => Object.values(m.e).reduce((s, n) => s + n, 0)));
const polDegree = (p: Pol): number => p.fs.reduce((s, f) => s + f.e * tDegree(f.t), 0);

/** The text of a problem polynomial: decreasing powers, or increasing when the leading term is negative (9 - x^2). */
function displayLatex(p: Pol, vars: string[]): string {
	const t = expand(p, vars);
	return sumLatex(p.c.sign() < 0 ? sortAsc(t, vars) : t);
}

// ---------------------------------------------------------------------------
// Factored form

function sortKey(f: Fac, vars: string[]): number[] {
	const t = sortDesc(f.t, vars);
	return [isLetter(f.t) ? 0 : 1, tDegree(f.t), ...t.slice(1).map((m) => m.c.num / m.c.den)];
}

function sortFacs(fs: Fac[], vars: string[]): Fac[] {
	return [...fs].sort((a, b) => {
		const ka = sortKey(a, vars);
		const kb = sortKey(b, vars);
		for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
			const d = (ka[i] ?? -1e9) - (kb[i] ?? -1e9);
			if (d !== 0) return d;
		}
		return 0;
	});
}

const facBody = (f: Fac): string => sumLatex(f.t);

/** "12x(x - 1)(x + 1)", "-(x - 3)(x + 3)", "\frac{1}{2}(x - 2)(x + 2)", "2" when there are no factors. */
function factoredLatex(p: Pol, vars: string[]): string {
	const fs = sortFacs(p.fs, vars);
	const lit: Record<string, number> = {};
	const groups: string[] = [];
	for (const f of fs) {
		if (isLetter(f.t)) {
			const v = Object.keys(f.t[0].e)[0];
			lit[v] = (lit[v] ?? 0) + f.e;
		} else groups.push(`(${facBody(f)})${f.e > 1 ? `^${f.e}` : ''}`);
	}
	const body = literalLatex(lit) + groups.join('');
	if (body === '') return p.c.toLatex();
	// a single factor alone needs no parentheses: MCD = x - 2
	if (p.c.isOne() && fs.length === 1 && fs[0].e === 1 && !isLetter(fs[0].t)) return facBody(fs[0]);
	const prefix = p.c.isOne() ? '' : p.c.equals(q(-1)) ? '-' : p.c.toLatex();
	return prefix + body;
}

function factoredSympy(p: Pol): string {
	return [p.c.toString(), ...p.fs.map((f) => `(${polySympy(f.t)})**${f.e}`)].join('*');
}

function expandedKey(p: Pol, vars: string[]): string {
	return expand(p, vars).map(monoKey).sort().join('+') || '0';
}

// ---------------------------------------------------------------------------
// The rule of the lesson

const allInt = (ps: Pol[]) => ps.every((p) => p.c.isInteger());

function numericOf(ps: Pol[], kind: Kind): Rational {
	if (!allInt(ps)) return q(1);
	const abs = ps.map((p) => Math.abs(p.c.num));
	return q(kind === 'MCD' ? abs.reduce(gcd) : abs.reduce(lcm));
}

/** Distinct factors of all the polynomials, by key, with their exponent in each (0 if absent). */
function factorTable(ps: Pol[]): { t: Mono[]; es: number[] }[] {
	const out: { key: string; t: Mono[]; es: number[] }[] = [];
	ps.forEach((p, i) => {
		for (const f of p.fs) {
			const k = tKey(f.t);
			let row = out.find((r) => r.key === k);
			if (!row) {
				row = { key: k, t: f.t, es: ps.map(() => 0) };
				out.push(row);
			}
			row.es[i] += f.e;
		}
	});
	return out;
}

function mcdOf(ps: Pol[]): Pol {
	const fs = factorTable(ps)
		.filter((r) => r.es.every((e) => e > 0))
		.map((r) => ({ t: r.t, e: Math.min(...r.es) }));
	return { c: numericOf(ps, 'MCD'), fs };
}

function mcmOf(ps: Pol[]): Pol {
	const fs = factorTable(ps).map((r) => ({ t: r.t, e: Math.max(...r.es) }));
	return { c: numericOf(ps, 'MCM'), fs };
}

const resultOf = (kind: Kind, ps: Pol[]): Pol => (kind === 'MCD' ? mcdOf(ps) : mcmOf(ps));

// ---------------------------------------------------------------------------
// Factors

const letterF = (v: string): Mono[] => [mono(1, { [v]: 1 })];
/** x + a (a != 0), or x + a·y with two letters. */
const linF = (a: number, x = 'x', y?: string): Mono[] => [mono(1, { [x]: 1 }), y ? mono(a, { [y]: 1 }) : mono(a)];
/** x^2 + s·a·x + a^2, the false square of x^3 - s·a^3. */
const quadF = (a: number, s: number): Mono[] => [mono(1, { x: 2 }), mono(s * a, { x: 1 }), mono(a * a)];

/** x - a written as a - x, the form that appears in 9 - x^2 = (3 - x)(3 + x). */
function flipped(t: Mono[]): Mono[] {
	return [...t].reverse().map((m) => mono(m.c.neg(), { ...m.e }));
}

/** x - a with a > 0: the factor a polynomial with a negative numeric factor shows as a - x. */
const isMinusConst = (t: Mono[]): boolean => t.length === 2 && Object.keys(t[1].e).length === 0 && t[1].c.sign() < 0 && t[0].c.isOne();

function drawLinear(rng: Rng, maxA: number): Mono[] {
	const a = rng.int(1, maxA);
	return linF(rng.next() < 0.5 ? a : -a);
}

function distinctFactors(rng: Rng, n: number, draw: () => Mono[]): Mono[][] {
	const out: Mono[][] = [];
	for (let tries = 0; out.length < n && tries < 200; tries++) {
		const t = draw();
		if (!out.some((o) => tKey(o) === tKey(t))) out.push(t);
	}
	return out;
}

interface Shape {
	k: number;
	common: number;
	extra: [number, number];
	maxE: (t: Mono[]) => number;
	numeric: () => Rational;
	coprime?: boolean;
}

/** k polynomials sharing `common` factors (unless coprime) plus a few others from the same pool. */
function makePolys(rng: Rng, pool: Mono[][], s: Shape): Pol[] {
	const common = s.coprime ? [] : pool.slice(0, s.common);
	const rest = shuffle(rng, pool.slice(common.length));
	const polys: Pol[] = [];
	for (let i = 0; i < s.k; i++) {
		const fs: Fac[] = common.map((t) => ({ t, e: rng.int(1, s.maxE(t)) }));
		const own = s.coprime ? rest.filter((_, j) => j % s.k === i) : shuffle(rng, rest);
		const n = Math.min(own.length, rng.int(s.extra[0], s.extra[1]));
		for (const t of own.slice(0, n)) fs.push({ t, e: rng.int(1, s.maxE(t)) });
		polys.push({ c: s.numeric(), fs });
	}
	return polys;
}

const intNumeric = (rng: Rng) => () => q(rng.pick([1, 1, 2, 2, 3, 3, 4, 5, 6]));
const FRACTIONS: [number, number][] = [
	[1, 2],
	[1, 3],
	[2, 3],
	[1, 4],
	[3, 4],
	[1, 5],
	[2, 5],
	[3, 2],
	[5, 2],
	[4, 3],
	[1, 6],
];
const maxE = (letter: number, bin: number) => (t: Mono[]) => (isLetter(t) ? letter : bin);

function build(rng: Rng, level: number): Built | null {
	const kind: Kind = rng.int(0, 1) ? 'MCD' : 'MCM';
	let vars = ['x'];
	let polys: Pol[];
	const oneVarPool = (n: number, maxA: number, letterFirst = 0.3) => {
		const pool = distinctFactors(rng, n, () => drawLinear(rng, maxA));
		if (rng.next() < letterFirst) pool.unshift(letterF('x'));
		else if (rng.next() < 0.5) pool.splice(1, 0, letterF('x'));
		return pool;
	};
	switch (level) {
		case 1: {
			const coprime = rng.next() < 0.2;
			polys = makePolys(rng, oneVarPool(5, 6), { k: 2, common: rng.next() < 0.2 ? 2 : 1, extra: coprime ? [1, 2] : [0, 1], maxE: maxE(1, 1), numeric: intNumeric(rng), coprime });
			break;
		}
		case 2:
			polys = makePolys(rng, oneVarPool(4, 5, 0.4), { k: 2, common: rng.next() < 0.3 ? 2 : 1, extra: [0, 1], maxE: maxE(3, 2), numeric: intNumeric(rng) });
			break;
		case 3:
			polys = makePolys(rng, oneVarPool(4, 5, 0.3), { k: 3, common: 1, extra: [0, 2], maxE: maxE(2, 2), numeric: intNumeric(rng) });
			break;
		case 4: {
			const a = rng.int(1, 6);
			const pool = [linF(-a), ...distinctFactors(rng, 4, () => drawLinear(rng, 5)).filter((t) => tKey(t) !== tKey(linF(-a)))];
			if (rng.next() < 0.3) pool.splice(1, 0, letterF('x'));
			const k = rng.next() < 0.5 ? 2 : 3;
			polys = makePolys(rng, pool, { k, common: 1, extra: [0, 1], maxE: maxE(2, 2), numeric: intNumeric(rng) });
			// one or two polynomials with a negative numeric factor: they show a - x
			const negs = k === 3 && rng.next() < 0.25 ? 2 : 1;
			for (const i of shuffle(
				rng,
				polys.map((_, j) => j),
			).slice(0, negs))
				polys[i] = { ...polys[i], c: polys[i].c.neg() };
			break;
		}
		case 5: {
			const [x, y] = rng.pick([
				['x', 'y'],
				['a', 'b'],
			]);
			vars = [x, y];
			const draw = () => {
				const u = rng.next();
				if (u < 0.3) return letterF(rng.pick([x, y]));
				return linF(rng.pick([1, -1, 1, -1, 2, -2]), x, y);
			};
			const pool = distinctFactors(rng, 5, draw);
			polys = makePolys(rng, pool, { k: 2, common: rng.next() < 0.4 ? 2 : 1, extra: [1, 2], maxE: maxE(2, 2), numeric: intNumeric(rng) });
			break;
		}
		case 6: {
			const a = rng.int(1, 3);
			const s = rng.next() < 0.7 ? 1 : -1; // x^3 - a^3 = (x - a)(x^2 + ax + a^2), or the sum of cubes
			const lin = linF(-s * a);
			const quad = quadF(a, s);
			const others = distinctFactors(rng, 3, () => drawLinear(rng, 4)).filter((t) => tKey(t) !== tKey(lin));
			if (rng.next() < 0.4) others.unshift(letterF('x'));
			const k = rng.next() < 0.5 ? 2 : 3;
			const intNum = intNumeric(rng);
			polys = [];
			for (let i = 0; i < k; i++) {
				const fs: Fac[] = [{ t: lin, e: i === 0 ? 1 : rng.int(1, 2) }];
				if (i === 0) {
					fs.push({ t: quad, e: 1 });
					if (rng.next() < 0.3 && isLetter(others[0])) fs.push({ t: others[0], e: 1 });
				} else {
					const pool = shuffle(rng, rng.next() < 0.1 ? [quad, ...others] : others);
					for (const t of pool.slice(0, rng.int(0, 1))) fs.push({ t, e: rng.int(1, isLetter(t) ? 2 : 1) });
				}
				polys.push({ c: i === 0 ? q(rng.pick([1, 1, 1, 2, 3])) : intNum(), fs });
			}
			polys = shuffle(rng, polys);
			break;
		}
		case 7: {
			const frac = () => {
				const [n, d] = rng.pick(FRACTIONS);
				return q(n, d);
			};
			const pool = oneVarPool(4, 4, 0.3);
			let first = true;
			polys = makePolys(rng, pool, {
				k: 2,
				common: 1,
				extra: [0, 1],
				maxE: maxE(1, 1),
				numeric: () => {
					const c = first || rng.next() < 0.5 ? frac() : q(rng.pick([1, 2, 3]));
					first = false;
					return c;
				},
			});
			polys = shuffle(rng, polys);
			break;
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
	return { kind, vars, polys };
}

// ---------------------------------------------------------------------------
// Steps

const listLatex = (xs: string[]) => (xs.length === 2 ? `${xs[0]} \\text{ e } ${xs[1]}` : `${xs.slice(0, -1).join(',\\ ')} \\text{ e } ${xs[xs.length - 1]}`);

/** The polynomial with its negative numeric factor moved into the first factor x - a: 6 - 2x = 2(3 - x). */
function naturalForm(p: Pol): Pol | null {
	if (p.c.sign() >= 0) return null;
	const i = p.fs.findIndex((f) => isMinusConst(f.t) && f.e % 2 === 1);
	if (i < 0) return null;
	const fs = p.fs.map((f, j) => (j === i ? { t: flipped(f.t), e: f.e } : f));
	return { c: p.c.neg(), fs };
}

function steps(b: Built, r: Pol): string[] {
	const { polys, vars, kind } = b;
	const out: string[] = [];
	const flips: string[] = [];
	polys.forEach((p, i) => {
		const chain = [displayLatex(p, vars)];
		const nat = naturalForm(p);
		if (nat) {
			chain.push(factoredLatex(nat, vars));
			const f = nat.fs.find((g) => !isMinusConst(g.t) && g.t.length === 2 && isMinusConst(flipped(g.t)))!;
			flips.push(`${sumLatex(f.t)} = -(${sumLatex(flipped(f.t))})`);
		}
		chain.push(factoredLatex(p, vars));
		const name = ORD[i].charAt(0).toUpperCase() + ORD[i].slice(1);
		out.push(`\\text{${name} polinomio: } ${chain.join(' = ')}`);
	});
	for (const f of [...new Set(flips)]) out.push(`\\text{Fattori opposti: } ${f}`);
	const cs = polys.map((p) => p.c.toLatex());
	if (allInt(polys)) {
		const abs = polys.map((p) => Math.abs(p.c.num));
		const neg = polys.some((p) => p.c.sign() < 0);
		out.push(`\\text{Fattori numerici } ${listLatex(cs)}\\text{${neg ? ', con i valori assoluti' : ''}: } \\text{${kind}}(${abs.join(',\\ ')}) = ${numericOf(polys, kind).toLatex()}`);
	} else {
		out.push(`\\text{Fattori numerici } ${listLatex(cs)}\\text{: c'è una frazione, quindi il fattore numerico è } 1`);
	}
	const table = factorTable(polys);
	const sorted = sortFacs(
		table.map((row) => ({ t: row.t, e: 1 })),
		vars,
	);
	for (const f of sorted) {
		const row = table.find((rr) => tKey(rr.t) === tKey(f.t))!;
		const present = row.es.map((e, i) => ({ e, i })).filter((x) => x.e > 0);
		const head = `\\text{Fattore } ${facBody(f)}\\text{: `;
		if (kind === 'MCD') {
			const missing = row.es.findIndex((e) => e === 0);
			if (missing >= 0) out.push(`${head}manca nel ${ORD[missing]} polinomio, quindi non entra nel MCD}`);
			else out.push(`${head}esponenti } ${listLatex(row.es.map(String))}\\text{, il minimo è } ${Math.min(...row.es)}`);
		} else if (present.length === 1) {
			out.push(`${head}compare solo nel ${ORD[present[0].i]} polinomio, con esponente } ${present[0].e}`);
		} else {
			out.push(`${head}esponenti } ${listLatex(present.map((x) => String(x.e)))}\\text{, il massimo è } ${Math.max(...row.es)}`);
		}
	}
	if (kind === 'MCD' && r.fs.length === 0) out.push(`\\text{Nessun fattore è comune a tutti i polinomi: il MCD è solo il fattore numerico}`);
	out.push(`\\text{${kind}} = ${factoredLatex(r, vars)}`);
	return out;
}

// ---------------------------------------------------------------------------
// Sample, checks, choice

/**
 * Rough width of a formula in characters: fractions count as their wider number, exponents as
 * half a character, spaces as nothing, \quad as two. Calibrated with KaTeX at 18 px (see the spec).
 */
function widthEstimate(latex: string): number {
	const exps = (latex.match(/\^\d/g) ?? []).length;
	const s = latex
		.replace(/\\frac\{(\d+)\}\{(\d+)\}/g, (_, a: string, d: string) => '#'.repeat(Math.max(a.length, d.length)))
		.replace(/\^\d/g, '')
		.replace(/\\quad/g, 'QQ')
		.replace(/ /g, '');
	const ops = (latex.match(/ [+-] /g) ?? []).length;
	return s.length + 0.5 * exps + 0.8 * ops;
}

/** Characters that fit in 350 px, with a margin. */
const MAX_WIDTH = 26;

/** The list of polynomials on one line, or one polynomial per line when it would be too wide. */
function problemLatex(polys: Pol[], vars: string[]): string {
	const texts = polys.map((p) => displayLatex(p, vars));
	const line = texts.join(',\\quad ');
	if (widthEstimate(line) <= MAX_WIDTH) return line;
	return `\\begin{aligned}${texts.map((t, i) => `&${t}${i < texts.length - 1 ? ',' : ''}`).join(' \\\\ ')}\\end{aligned}`;
}

function assemble(b: Built, level: number, seed: number): Sample {
	const r = resultOf(b.kind, b.polys);
	const latex = factoredLatex(r, b.vars);
	return {
		generatorId: ID,
		level,
		seed,
		prompt: `Calcola il ${b.kind} dei polinomi e scrivilo scomposto in fattori.`,
		problem: problemLatex(b.polys, b.vars),
		solution: `\\text{${b.kind}} = ${latex}`,
		steps: steps(b, r),
		answer: { kind: 'expression', value: factoredSympy(r), latex, form: 'factored' },
		params: {
			case: b.kind,
			vars: b.vars,
			polys: b.polys.map((p) => ({ c: p.c.toString(), fs: p.fs.map((f) => ({ t: f.t.map(monoJSON), e: f.e })) })),
		},
	};
}

function parseBuilt(p: Record<string, unknown>): Built | null {
	if ((p.case !== 'MCD' && p.case !== 'MCM') || !Array.isArray(p.polys) || !Array.isArray(p.vars)) return null;
	try {
		const polys: Pol[] = (p.polys as { c: string; fs: { t: unknown[]; e: number }[] }[]).map((pp) => ({
			c: Rational.parse(pp.c),
			fs: pp.fs.map((f) => {
				const t = f.t.map(monoFromJSON);
				if (t.some((m) => !m)) throw new Error('bad monomial');
				return { t: t as Mono[], e: f.e };
			}),
		}));
		return { kind: p.case, vars: p.vars as string[], polys };
	} catch {
		return null;
	}
}

const MAX_COEF = 60;

/**
 * Factorable with the lesson's tools, without Ruffini: after taking out the numeric factor and the
 * letters, what is left has degree at most 2 (trinomial, square, difference of squares), or at
 * level 6 is a sum or difference of cubes, (x - a)(x^2 + ax + a^2).
 */
function withoutRuffini(p: Pol, level: number): boolean {
	const rest = p.fs.filter((f) => !isLetter(f.t));
	const deg = rest.reduce((s, f) => s + f.e * tDegree(f.t), 0);
	if (deg <= 2) return true;
	if (level !== 6 || rest.length !== 2 || rest.some((f) => f.e !== 1)) return false;
	const prod = polyMul(rest[0].t, rest[1].t);
	return prod.length === 2 && tDegree(prod) === 3;
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const b = parseBuilt(sample.params);
	if (!b) return ['params non validi'];
	const { polys, vars } = b;
	const r = resultOf(b.kind, polys);
	const a = sample.answer;
	if (a.kind !== 'expression' || a.value !== factoredSympy(r) || a.latex !== factoredLatex(r, vars) || a.form !== 'factored') v.push('risposta diversa dal risultato');
	if (sample.problem !== problemLatex(polys, vars)) v.push('testo diverso dai parametri');
	v.push(...forbidden(sample.problem), ...forbidden(a.kind === 'expression' ? a.latex : ''));
	const keys = new Set<string>();
	for (const p of polys) {
		const t = expand(p, vars);
		if (t.length < 2) v.push('un polinomio è un monomio');
		for (const m of t) if (Math.abs(m.c.num) > MAX_COEF || m.c.den > 9) v.push(`coefficiente fuori intervallo: ${m.c}`);
		const mult = p.fs.reduce((s, f) => s + f.e, 0);
		if (mult < 2 && (p.c.isOne() || p.c.equals(q(-1)))) v.push('un polinomio è già irriducibile');
		if (polDegree(p) > 4) v.push('grado oltre 4');
		if (!withoutRuffini(p, sample.level)) v.push('serve Ruffini per scomporre un polinomio');
		if (new Set(p.fs.map((f) => tKey(f.t))).size !== p.fs.length) v.push('fattore ripetuto nei parametri');
		// the part without the numeric factor identifies proportional polynomials
		const k = expandedKey({ c: q(1), fs: p.fs }, vars);
		if (keys.has(k)) v.push('due polinomi proporzionali');
		keys.add(k);
	}
	const table = factorTable(polys);
	const m = mcmOf(polys);
	if (m.fs.length > 5 || polDegree(m) > 7) v.push('MCM troppo lungo');
	if (m.c.num > 60) v.push('fattore numerico del MCM oltre 60');
	const mcd = mcdOf(polys);
	const coprime = mcd.fs.length === 0;
	if (coprime && sample.level !== 1) v.push('polinomi primi tra loro fuori dal livello 1');
	const ints = allInt(polys);
	const pos = polys.every((p) => p.c.sign() > 0);
	const maxExp = Math.max(...polys.flatMap((p) => p.fs.map((f) => f.e)));
	const hasQuad = table.some((row) => tDegree(row.t) === 2 && row.t.length === 3);
	const oneVar = vars.length === 1;
	const n = polys.length;
	switch (sample.level) {
		case 1:
			if (n !== 2 || !oneVar || !ints || !pos || maxExp > 1 || hasQuad) v.push('livello 1: due polinomi in x, fattori con esponente 1, fattori numerici interi positivi');
			break;
		case 2:
			if (n !== 2 || !oneVar || !ints || !pos || hasQuad) v.push('livello 2: due polinomi in x a fattori numerici interi positivi');
			if (!table.some((row) => row.es.every((e) => e > 0) && new Set(row.es).size > 1)) v.push('livello 2: serve un fattore comune con esponenti diversi');
			break;
		case 3:
			if (n !== 3 || !oneVar || !ints || !pos || hasQuad) v.push('livello 3: tre polinomi in x a fattori numerici interi positivi');
			break;
		case 4: {
			if (n < 2 || n > 3 || !oneVar || !ints || pos || hasQuad) v.push('livello 4: 2 o 3 polinomi, almeno uno con fattore numerico negativo');
			const ok = polys.some((p) => {
				const nat = naturalForm(p);
				return nat && p.fs.some((f) => isMinusConst(f.t) && f.e % 2 === 1 && mcd.fs.some((g) => tKey(g.t) === tKey(f.t)));
			});
			if (!ok) v.push('livello 4: serve un fattore opposto comune (a - x)');
			for (const p of polys) if (p.c.sign() < 0 && displayLatex(p, vars).startsWith('-')) v.push('livello 4: il polinomio col segno meno deve iniziare con un termine positivo');
			break;
		}
		case 5:
			if (n !== 2 || vars.length !== 2 || !ints || !pos) v.push('livello 5: due polinomi in due lettere');
			for (const p of polys) for (const x of vars) if (!expand(p, vars).some((mm) => (mm.e[x] ?? 0) > 0)) v.push('livello 5: ogni polinomio contiene le due lettere');
			break;
		case 6:
			if (n < 2 || n > 3 || !oneVar || !ints || !pos || !hasQuad) v.push('livello 6: 2 o 3 polinomi, uno con il falso quadrato');
			break;
		case 7:
			if (n !== 2 || !oneVar || ints || !pos || maxExp > 1 || hasQuad) v.push('livello 7: due polinomi, almeno un fattore numerico frazionario');
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

/** Estimated characters that fit in an answer button (252 px with KaTeX at 16 px), with a margin. */
const MAX_OPTION_WIDTH = 20;

/**
 * An option in factored form; when it would not fit in the answer button, on two lines (three at
 * most) in \begin{gathered}, breaking only between two factors: 6x(x - 3) \\ (x - 1)^2(x^2 + x + 1).
 */
function optionLatex(p: Pol, vars: string[]): string {
	const whole = factoredLatex(p, vars);
	if (widthEstimate(whole) <= MAX_OPTION_WIDTH) return whole;
	// pieces: the numeric factor with the letters, then each factor in parentheses
	// (with `*` instead of `+` an empty match at 0 would make the global match skip the first "(")
	const pieces = whole.match(/^[^(]+|\([^()]*\)(?:\^\d)?/g) ?? [];
	if (pieces.join('') !== whole) throw new Error(`${ID}: cannot split the option ${whole}`);
	const lines: string[] = [];
	for (const piece of pieces) {
		const last = lines.length - 1;
		if (last >= 0 && widthEstimate(lines[last] + piece) <= MAX_OPTION_WIDTH) lines[last] += piece;
		else lines.push(piece);
	}
	if (lines.length === 1) return whole;
	if (lines.length > 3) throw new Error(`${ID}: option on more than three lines: ${whole}`);
	return `\\begin{gathered}${lines.join(' \\\\ ')}\\end{gathered}`;
}

function opt(p: Pol, vars: string[]): Opt {
	return { latex: optionLatex(p, vars), value: factoredSympy(p), key: expandedKey(p, vars) };
}

/** Merges two factors of a product into one unfactored block: x(x^2 - 4) instead of x(x - 2)(x + 2). */
function unfactored(p: Pol, vars: string[]): Pol[] {
	const out: Pol[] = [];
	const bins = p.fs.map((f, i) => ({ f, i })).filter(({ f }) => !isLetter(f.t) && f.e === 1);
	for (let a = 0; a < bins.length; a++)
		for (let c = a + 1; c < bins.length; c++) {
			const merged = sortDesc(polyMul(bins[a].f.t, bins[c].f.t), vars);
			const fs = p.fs.filter((_, i) => i !== bins[a].i && i !== bins[c].i);
			out.push({ c: p.c, fs: [...fs, { t: merged, e: 1 }] });
		}
	return out;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const b = parseBuilt(sample.params)!;
	const { polys, vars, kind } = b;
	const r = resultOf(kind, polys);
	const other = resultOf(kind === 'MCD' ? 'MCM' : 'MCD', polys);
	const table = factorTable(polys);
	const cands: (Pol | null)[] = [other];
	const pick = (rows: typeof table, f: (xs: number[]) => number) => rows.map((row) => ({ t: row.t, e: f(row.es.filter((e) => e > 0)) }));
	const inAll = table.filter((row) => row.es.every((e) => e > 0));
	if (kind === 'MCD') {
		// the student's mistakes: a factor that is not in all the polynomials, the highest exponent
		if (inAll.length < table.length) cands.push({ c: r.c, fs: pick(table, (xs) => Math.min(...xs)) });
		cands.push({ c: r.c, fs: pick(inAll, (xs) => Math.max(...xs)) });
	} else {
		if (inAll.length < table.length && inAll.length > 0) cands.push({ c: r.c, fs: pick(inAll, (xs) => Math.max(...xs)) });
		cands.push({ c: r.c, fs: pick(table, (xs) => Math.min(...xs)) });
	}
	// opposite factors not recognised: a - x kept as a different factor
	if (polys.some((p) => naturalForm(p))) cands.unshift(resultOf(kind, polys.map((p) => naturalForm(p) ?? p)));
	// a polynomial not factored completely
	for (let i = 0; i < polys.length; i++)
		for (const u of unfactored(polys[i], vars)) {
			const ps = polys.map((p, j) => (j === i ? u : p));
			cands.push(resultOf(kind, ps));
		}
	// the false square written as a square: (x + 2)^2 instead of x^2 + 2x + 4
	const quad = r.fs.find((f) => f.t.length === 3);
	if (quad) {
		const lin = linF(quad.t[1].c.num);
		const fs = r.fs.filter((f) => f !== quad && tKey(f.t) !== tKey(lin));
		const prev = r.fs.find((f) => tKey(f.t) === tKey(lin))?.e ?? 0;
		cands.splice(1, 0, { c: r.c, fs: [...fs, { t: lin, e: prev + 2 * quad.e }] });
	}
	// numeric factor: the other one, the product, forgotten; with fractions "the MCD of the fractions"
	if (allInt(polys)) {
		if (!other.c.equals(r.c)) cands.push({ c: other.c, fs: r.fs });
		if (kind === 'MCM') cands.push({ c: polys.reduce((s, p) => s.mul(p.c.abs()), q(1)), fs: r.fs });
		if (!r.c.isOne() && r.fs.length > 0) cands.push({ c: q(1), fs: r.fs });
	} else {
		const nums = polys.map((p) => Math.abs(p.c.num));
		const dens = polys.map((p) => p.c.den);
		const c = kind === 'MCD' ? q(nums.reduce(gcd), dens.reduce(lcm)) : q(nums.reduce(lcm), dens.reduce(gcd));
		cands.push({ c, fs: r.fs });
	}
	// comparing terms instead of factors: x^2 as MCD of x^2 - 9 and x^2 + x - 2
	if (kind === 'MCD' && r.fs.length === 0) cands.unshift({ c: r.c, fs: [{ t: letterF(vars[0]), e: Math.min(...polys.map(polDegree)) }] });

	const negKey = expandedKey({ c: r.c.neg(), fs: r.fs }, vars);
	const good = (p: Pol | null) => p && expandedKey(p, vars) !== negKey;
	const fallback = (i: number): Opt | null => {
		const j = Math.floor(i / 3);
		let p: Pol;
		switch (i % 3) {
			case 0:
				if (r.fs.length === 0) return null;
				p = { c: r.c, fs: r.fs.map((f, idx) => (idx === j % r.fs.length ? { t: f.t, e: f.e + 1 + Math.floor(j / r.fs.length) } : f)) };
				break;
			case 1:
				p = { c: r.c.add(q(j + 1)), fs: r.fs };
				break;
			default:
				if (r.fs.length < 2) return null;
				p = { c: r.c, fs: r.fs.filter((_, idx) => idx !== j % r.fs.length) };
		}
		return good(p) ? opt(p, vars) : null;
	};
	return buildChoice(
		opt(r, vars),
		cands.filter(good).map((p) => opt(p!, vars)),
		fallback,
		rng,
	);
}

export const polinomiMcdMcm: Generator = {
	id: ID,
	title: 'MCD e MCM di polinomi',
	levels: {
		1: { label: 'Due polinomi, fattori semplici', constraints: ['due polinomi in x, ogni fattore con esponente 1', 'fattori numerici interi positivi', 'circa 2 su 10 primi tra loro'] },
		2: { label: 'Esponenti diversi', constraints: ['due polinomi in x', 'un fattore comune compare con esponenti diversi'] },
		3: { label: 'Tre polinomi', constraints: ['tre polinomi in x con almeno un fattore comune a tutti'] },
		4: { label: 'Fattori opposti', constraints: ['2 o 3 polinomi, almeno uno con fattore numerico negativo scritto come a - x', 'il fattore opposto è comune a tutti'] },
		5: { label: 'Due lettere', constraints: ['due polinomi in x e y (o a e b)', 'fattori come x, y, x - y, x + 2y'] },
		6: { label: 'Cubi e falso quadrato', constraints: ['2 o 3 polinomi, uno è una somma o differenza di cubi', 'il falso quadrato entra nel MCM intero'] },
		7: { label: 'Fattori numerici frazionari', constraints: ['due polinomi, almeno un fattore numerico frazionario', 'il fattore numerico del risultato è 1'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample = assemble(b, level, rng.seed);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default polinomiMcdMcm;
