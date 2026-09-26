/**
 * Studio del segno e disequazioni fratte. Spec: specs/exercises/disequazioni-razionali.md
 *
 * Seven levels in the order of lesson 54 (docs/lezioni/riscritte/54-disequazioni-razionali.md): a product of
 * two monic factors with a strict sign, extremes included (after collecting x), a factor with a negative
 * coefficient of x and fractional zeros, three factors (or x^2 compared with a square), a fraction N/D
 * compared with zero, a fraction compared with a number, two fractions with three factors.
 *
 * Built backwards from the zeros: every factor is a first-degree a·x + b chosen by its zero, and the problem
 * is written from the factors (expanded where the level asks to collect or to reduce to one fraction). The
 * solution is a union of intervals, which no answer type of today holds: the answer is a multiple choice
 * from the start, the options written either as inequalities ("x < -3 \text{ oppure } x > 2") or as
 * intervals with reversed brackets (\mathopen{]} and \mathclose{[}), as the lesson writes them. The wrong
 * options are the solutions of the mistakes named in the lesson's warnings, solved with the same sign table.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { forbidden, shuffle } from '../monomi';

export const ID = 'disequazioni-razionali';

// ---------------------------------------------------------------------------
// Signs, factors, intervals

type Op = '<' | '>' | '<=' | '>=';
const OP_LATEX: Record<Op, string> = { '<': '<', '>': '>', '<=': '\\leq', '>=': '\\geq' };
const FLIP: Record<Op, Op> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
const TOGGLE: Record<Op, Op> = { '<': '<=', '>': '>=', '<=': '<', '>=': '>' };
const large = (o: Op) => o === '<=' || o === '>=';
const positive = (o: Op) => o === '>' || o === '>=';

/** a·x + b, a ≠ 0; `den` when it is a factor of a denominator. */
interface Fac {
	a: number;
	b: number;
	den?: boolean;
}

const zeroOf = (f: Fac): Rational => q(-f.b, f.a);
const isX = (f: Fac) => f.a === 1 && f.b === 0;

function axLatex(a: number): string {
	return `${Math.abs(a) === 1 ? '' : Math.abs(a)}x`;
}

/** x - 4, 2x + 1, x; by increasing powers when a < 0 < b: 3 - x, 1 - 2x. */
function linLatex(f: Fac): string {
	if (f.a < 0 && f.b > 0) return `${f.b} - ${axLatex(f.a)}`;
	let s = (f.a < 0 ? '-' : '') + axLatex(f.a);
	if (f.b > 0) s += ` + ${f.b}`;
	else if (f.b < 0) s += ` - ${-f.b}`;
	return s;
}

/** A product as the lesson writes it: the number, then x, then the binomials in parentheses: 2x(x - 3). */
function prodLatex(fs: Fac[], pre = 1): string {
	if (fs.length === 1 && pre === 1) return linLatex(fs[0]);
	const head = pre === 1 ? '' : `${pre}`;
	const xs = fs.filter(isX).map(() => 'x');
	return head + xs.join('') + fs.filter((f) => !isX(f)).map((f) => `(${linLatex(f)})`).join('');
}

function sortedZeros(fs: Fac[]): Rational[] {
	const out: Rational[] = [];
	for (const z of fs.map(zeroOf).sort((u, v) => u.compare(v))) if (!out.some((t) => t.equals(z))) out.push(z);
	return out;
}

/** Sign of pre · Π(a·x + b) (numerator and denominator alike) at a point that is not a zero. */
function signAt(fs: Fac[], t: Rational, pre = 1): number {
	let s = Math.sign(pre);
	for (const f of fs) s *= q(f.a).mul(t).add(q(f.b)).sign();
	return s;
}

/** An interval; null is -∞ at the left and +∞ at the right. */
interface Iv {
	lo: Rational | null;
	hi: Rational | null;
	loC: boolean;
	hiC: boolean;
}

function testPoints(zs: Rational[]): Rational[] {
	if (!zs.length) return [q(0)];
	const out = [zs[0].sub(q(1))];
	for (let j = 1; j < zs.length; j++) out.push(zs[j - 1].add(zs[j]).div(q(2)));
	out.push(zs[zs.length - 1].add(q(1)));
	return out;
}

/**
 * Maximal runs of the selected regions and points of the line, left to right: regions R0 P0 R1 P1 … Rn,
 * with sel[j] for region j (between zs[j-1] and zs[j]) and inc[i] for the point zs[i].
 */
function runs(zs: Rational[], sel: boolean[], inc: boolean[]): Iv[] {
	const n = zs.length;
	const on = (i: number) => (i % 2 === 0 ? sel[i / 2] : inc[(i - 1) / 2]);
	const out: Iv[] = [];
	let i = 0;
	while (i <= 2 * n) {
		if (!on(i)) {
			i++;
			continue;
		}
		let j = i;
		while (j + 1 <= 2 * n && on(j + 1)) j++;
		const lo = i % 2 === 0 ? (i === 0 ? null : zs[i / 2 - 1]) : zs[(i - 1) / 2];
		const hi = j % 2 === 0 ? (j === 2 * n ? null : zs[j / 2]) : zs[(j - 1) / 2];
		out.push({ lo, hi, loC: i % 2 === 1, hiC: j % 2 === 1 });
		i = j + 1;
	}
	return out;
}

/** Solutions of pre · Π num / Π den  op  0 by the sign table; `incDen` includes the zeros of the denominator too (a mistake). */
function solveFacs(fs: Fac[], op: Op, opts: { pre?: number; incDen?: boolean } = {}): Iv[] {
	const zs = sortedZeros(fs);
	const sel = testPoints(zs).map((t) => {
		const s = signAt(fs, t, opts.pre ?? 1);
		return positive(op) ? s > 0 : s < 0;
	});
	const inc = zs.map((z) => {
		if (!large(op)) return false;
		const num = fs.some((f) => !f.den && zeroOf(f).equals(z));
		const den = fs.some((f) => f.den && zeroOf(f).equals(z));
		return opts.incDen ? num || den : num && !den;
	});
	return runs(zs, sel, inc);
}

/** The mistake of the warning "Confondere la tabella dei segni con un sistema": where every line is continuous (or every line dashed, for < and ≤). */
function solveSystem(fs: Fac[], op: Op): Iv[] {
	const zs = sortedZeros(fs);
	const sel = testPoints(zs).map((t) => fs.every((f) => q(f.a).mul(t).add(q(f.b)).sign() === (positive(op) ? 1 : -1)));
	// The zeros enter only at the edge of a chosen region: the student reads the system, not the product.
	const inc = zs.map((_, i) => large(op) && (sel[i] || sel[i + 1]));
	return runs(zs, sel, inc);
}

/** A union of intervals that reads as an answer: not empty, not all of ℝ, no isolated point. */
function nice(ivs: Iv[]): boolean {
	if (!ivs.length) return false;
	if (ivs.length === 1 && ivs[0].lo === null && ivs[0].hi === null) return false;
	return ivs.every((iv) => !(iv.lo && iv.hi && iv.lo.compare(iv.hi) >= 0));
}

const endKey = (r: Rational | null, inf: string) => (r ? r.toString() : inf);
/** "(-oo,-3)", "[1,oo)": the values of an option, one per interval. */
const ivValue = (iv: Iv) => `${iv.loC ? '[' : '('}${endKey(iv.lo, '-oo')},${endKey(iv.hi, 'oo')}${iv.hiC ? ']' : ')'}`;
const ivsKey = (ivs: Iv[]) => ivs.map(ivValue).join('|');

// ---------------------------------------------------------------------------
// Writing the solutions

type Notation = 'disequazioni' | 'intervalli';

/** One interval with the brackets of the lesson: ]-1, 4[ as \mathopen{]}-1, 4\mathclose{[}, \left] \right[ around fractions. */
function intervalLatex(iv: Iv): string {
	const lo = iv.lo ? iv.lo.toLatex() : '-\\infty';
	const hi = iv.hi ? iv.hi.toLatex() : '+\\infty';
	const frac = (iv.lo && !iv.lo.isInteger()) || (iv.hi && !iv.hi.isInteger());
	if (frac) return `\\left${iv.loC ? '[' : ']'}${lo}, ${hi}\\right${iv.hiC ? ']' : '['}`;
	return `${iv.loC ? '[' : '\\mathopen{]}'}${lo}, ${hi}${iv.hiC ? ']' : '\\mathclose{[}'}`;
}

/** S = \,\mathopen{]}-\infty, -3\mathclose{[}\, \cup \,\mathopen{]}2, +\infty\mathclose{[}, spaced as in the lesson. */
function setLatex(ivs: Iv[]): string {
	let s = 'S =';
	ivs.forEach((iv, i) => {
		const t = intervalLatex(iv);
		if (i > 0) s += ' \\cup';
		s += t.startsWith('\\mathopen') ? ' \\,' + t : ' ' + t;
		if (i < ivs.length - 1 && t.endsWith('\\mathclose{[}')) s += '\\,';
	});
	return s;
}

/** x < -3, x \geq 1, -1 < x \leq 4. */
function pieceLatex(iv: Iv): string {
	const le = (c: boolean) => (c ? '\\leq' : '<');
	if (iv.lo === null) return `x ${le(iv.hiC)} ${iv.hi!.toLatex()}`;
	if (iv.hi === null) return `x ${iv.loC ? '\\geq' : '>'} ${iv.lo.toLatex()}`;
	return `${iv.lo.toLatex()} ${le(iv.loC)} x ${le(iv.hiC)} ${iv.hi.toLatex()}`;
}

const OPPURE = ' \\ \\text{ oppure } \\ ';
const disLatex = (ivs: Iv[]) => ivs.map(pieceLatex).join(OPPURE);
const optionLatex = (ivs: Iv[], n: Notation) => (n === 'intervalli' ? setLatex(ivs) : disLatex(ivs));

// ---------------------------------------------------------------------------
// Steps

/** How the sign of a factor is found: x - 4 > 0 ⇒ x > 4; 3 - x > 0 ⇒ -x > -3 ⇒ x < 3. */
function studyLine(f: Fac, label = ''): string {
	const z = zeroOf(f).toLatex();
	const head = label ? `\\text{${label}: } ` : '';
	if (isX(f)) return `${head}x > 0`;
	const lin = linLatex(f);
	if (f.a === 1) return `${head}${lin} > 0 \\ \\Rightarrow \\ x > ${z}`;
	const ax = `${f.a < 0 ? '-' : ''}${axLatex(f.a)}`;
	const mid = `${ax} > ${-f.b}`;
	if (f.a > 0) return `${head}${lin} > 0 \\ \\Rightarrow \\ ${mid} \\ \\Rightarrow \\ x > ${z}`;
	return `${head}${lin} > 0 \\ \\Rightarrow \\ ${mid} \\ \\Rightarrow \\ x < ${z} \\text{, perché dividendo per un numero negativo il verso cambia}`;
}

function regionLatex(zs: Rational[], j: number): string {
	if (j === 0) return `x < ${zs[0].toLatex()}`;
	if (j === zs.length) return `x > ${zs[zs.length - 1].toLatex()}`;
	return `${zs[j - 1].toLatex()} < x < ${zs[j].toLatex()}`;
}

function signLine(fs: Fac[], what: string, pre = 1): string {
	const zs = sortedZeros(fs);
	const parts = testPoints(zs).map((t, j) => `${signAt(fs, t, pre) > 0 ? '+' : '-'} \\text{ per } ${regionLatex(zs, j)}`);
	return `\\text{Segno ${what}: } ${parts.join('\\text{, } ')}\\text{.}`;
}

function listZeros(zs: Rational[]): string {
	const xs = zs.map((z) => `x = ${z.toLatex()}`);
	return xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(',\\ ')} \\text{ e } ${xs[xs.length - 1]}`;
}

function pickLine(fs: Fac[], op: Op, fraction: boolean): string {
	const want = positive(op) ? '+' : '-';
	const head = `\\text{Il verso è } ${OP_LATEX[op]}\\text{: servono gli intervalli con il } ${want}`;
	const num = sortedZeros(fs.filter((f) => !f.den));
	const den = sortedZeros(fs.filter((f) => f.den));
	if (!large(op)) return `${head}\\text{, estremi esclusi.}`;
	if (!fraction) return `${head} \\text{ e gli zeri } ${listZeros(num)}\\text{.}`;
	const out = den.length > 1 ? '\\text{ restano esclusi}' : '\\text{ resta escluso}';
	return `${head} \\text{ e lo zero del numeratore } ${listZeros(num)}\\text{; } ${listZeros(den)} ${out}\\text{, perché lì la frazione non esiste.}`;
}

// ---------------------------------------------------------------------------
// Levels

interface Cand {
	tag: string;
	ivs: Iv[];
}

interface Build {
	form: string;
	op: Op;
	/** The factors of the reduced form pre · Π num / Π den  op  0. */
	fs: Fac[];
	pre: number;
	problem: string;
	/** From the problem to the reduced form (bring to the first member, collect, one fraction). */
	lead: string[];
	fraction: boolean;
	/** Wrong answers from the lesson's warnings, in order of preference. */
	cands: Cand[];
	extra: Record<string, unknown>;
}

const monic = (r: number): Fac => ({ a: 1, b: -r });
const intIn = (rng: Rng, lo: number, hi: number, not: number[] = []) => {
	for (;;) {
		const v = rng.int(lo, hi);
		if (!not.includes(v)) return v;
	}
};
/** Bare x first, as the lesson writes x(x - 4). */
const xFirst = (fs: Fac[]) => [...fs.filter(isX), ...fs.filter((f) => !isX(f))];
const signed = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`);
/** k·x as a term after the first: "+ 3x", "- x". */
const xTerm = (k: number) => `${k < 0 ? '-' : '+'} ${axLatex(k)}`;

/** The zero of each factor with the sign changed (x + 3 read as zero in 3). */
function zeroSignCands(fs: Fac[], op: Op, pre = 1): Cand[] {
	return fs.filter((f) => f.b !== 0).map((f, i) => ({ tag: `zero:${i}`, ivs: solveFacs(fs.map((g) => (g === f ? { ...g, b: -g.b } : g)), op, { pre }) }));
}

function commonCands(fs: Fac[], op: Op, pre = 1): Cand[] {
	return [
		{ tag: 'scambiati', ivs: solveFacs(fs, FLIP[op], { pre }) },
		{ tag: 'estremi', ivs: solveFacs(fs, TOGGLE[op], { pre }) },
	];
}

function level1(rng: Rng): Build {
	const r1 = rng.int(-9, 9);
	const r2 = intIn(rng, -9, 9, [r1]);
	const fs = xFirst(shuffle(rng, [monic(r1), monic(r2)]));
	const op = rng.pick<Op>(['<', '>']);
	return {
		form: 'prodotto',
		op,
		fs,
		pre: 1,
		problem: `${prodLatex(fs)} ${OP_LATEX[op]} 0`,
		lead: [`\\text{Il primo membro è già scomposto e il secondo è zero.}`],
		fraction: false,
		cands: [...commonCands(fs, op), { tag: 'sistema', ivs: solveSystem(fs, op) }, ...zeroSignCands(fs, op)],
		extra: {},
	};
}

function level2(rng: Rng): Build {
	const op = rng.pick<Op>(['<=', '>=']);
	const u = rng.next();
	if (u < 0.3) {
		const r1 = rng.int(-9, 9);
		const r2 = intIn(rng, -9, 9, [r1]);
		const fs = xFirst(shuffle(rng, [monic(r1), monic(r2)]));
		return {
			form: 'prodotto',
			op,
			fs,
			pre: 1,
			problem: `${prodLatex(fs)} ${OP_LATEX[op]} 0`,
			lead: [`\\text{Il primo membro è già scomposto e il secondo è zero.}`],
			fraction: false,
			cands: [...commonCands(fs, op), { tag: 'sistema', ivs: solveSystem(fs, op) }, ...zeroSignCands(fs, op)],
			extra: {},
		};
	}
	if (u < 0.65) {
		// x^2 op kx, as in example 2
		const k = intIn(rng, -9, 9, [0]);
		const fs = [monic(0), monic(k)];
		const kx = `${k < 0 ? '-' : ''}${axLatex(k)}`;
		return {
			form: 'x^2 e kx',
			op,
			fs,
			pre: 1,
			problem: `x^2 ${OP_LATEX[op]} ${kx}`,
			lead: [`\\text{Porta tutto a primo membro: } x^2 ${xTerm(-k)} ${OP_LATEX[op]} 0`, `\\text{Raccogli } x\\text{: } ${prodLatex(fs)} ${OP_LATEX[op]} 0`],
			fraction: false,
			cands: [{ tag: 'dividi', ivs: solveFacs([monic(k)], op) }, ...commonCands(fs, op), { tag: 'sistema', ivs: solveSystem(fs, op) }, ...zeroSignCands(fs, op)],
			extra: { k },
		};
	}
	// c x^2 + c b x op 0: collect cx
	const c = rng.pick([1, 1, 2, 3]);
	const b = intIn(rng, c === 3 ? -6 : -9, c === 3 ? 6 : 9, [0]);
	const fs = [monic(0), { a: 1, b }];
	const cx = c === 1 ? 'x' : `${c}x`;
	const lead = [`\\text{Raccogli } ${cx}\\text{: } ${prodLatex(fs, c)} ${OP_LATEX[op]} 0`];
	if (c > 1) lead.push(`\\text{Il fattore } ${c} \\text{ è positivo e non cambia il segno del prodotto.}`);
	return {
		form: 'raccoglimento',
		op,
		fs,
		pre: c,
		problem: `${c === 1 ? '' : c}x^2 ${xTerm(c * b)} ${OP_LATEX[op]} 0`,
		lead,
		fraction: false,
		cands: [{ tag: 'dividi', ivs: solveFacs([{ a: 1, b }], op) }, ...commonCands(fs, op, c), { tag: 'sistema', ivs: solveSystem(fs, op) }, ...zeroSignCands(fs, op, c)],
		extra: { c, b },
	};
}

function level3(rng: Rng): Build | null {
	const m = rng.pick([1, 1, 2, 3]);
	const bb = rng.int(1, 9);
	if (gcd(m, bb) !== 1) return null;
	const neg: Fac = { a: -m, b: bb };
	const c = rng.pick([1, 2, 2, 3]);
	const d = rng.int(-9, 9);
	if (gcd(c, Math.abs(d)) !== 1) return null;
	if (m === 1 && c === 1) return null; // the level is about fractional zeros too
	const other: Fac = { a: c, b: d };
	if (zeroOf(neg).equals(zeroOf(other))) return null;
	const fs = xFirst(shuffle(rng, [neg, other]));
	const op = rng.pick<Op>(['<', '>', '<=', '>=']);
	const forgot = fs.map((f) => (f === neg ? { a: m, b: bb } : f));
	return {
		form: 'coefficiente negativo',
		op,
		fs,
		pre: 1,
		problem: `${prodLatex(fs)} ${OP_LATEX[op]} 0`,
		lead: [`\\text{Il primo membro è già scomposto e il secondo è zero.}`],
		fraction: false,
		cands: [{ tag: 'verso', ivs: solveFacs(forgot, op) }, ...commonCands(fs, op), { tag: 'sistema', ivs: solveSystem(fs, op) }, ...zeroSignCands(fs, op)],
		extra: {},
	};
}

function level4(rng: Rng): Build | null {
	const op = rng.pick<Op>(['<', '>', '<=', '>=']);
	const o = OP_LATEX[op];
	const u = rng.next();
	if (u < 0.5) {
		// x^3 - k^2 x op 0, or x^3 op k^2 x (example 4)
		const k = rng.int(1, 6);
		const k2x = `${k * k === 1 ? '' : k * k}x`;
		const fs = [monic(0), monic(-k), monic(k)];
		const moved = u < 0.3;
		const lead = moved ? [] : [`\\text{Porta tutto a primo membro: } x^3 - ${k2x} ${o} 0`];
		lead.push(`\\text{Raccogli } x \\text{ e scomponi la differenza di quadrati: } x^3 - ${k2x} = x(x^2 - ${k * k}) = ${prodLatex(fs)}`);
		return {
			form: moved ? 'x^3 - k^2x' : 'x^3 e k^2x',
			op,
			fs,
			pre: 1,
			problem: moved ? `x^3 - ${k2x} ${o} 0` : `x^3 ${o} ${k2x}`,
			lead,
			fraction: false,
			cands: [{ tag: 'sistema', ivs: solveSystem(fs, op) }, { tag: 'dividi', ivs: solveFacs([monic(-k), monic(k)], op) }, ...commonCands(fs, op), ...zeroSignCands(fs, op)],
			extra: { k },
		};
	}
	if (u < 0.75) {
		// x^2 op k^2: the warning "Il quadrato maggiore di un numero"
		const k = rng.int(1, 9);
		const fs = [monic(-k), monic(k)];
		return {
			form: 'x^2 e k^2',
			op,
			fs,
			pre: 1,
			problem: `x^2 ${o} ${k * k}`,
			lead: [`\\text{Porta tutto a primo membro e scomponi: } x^2 - ${k * k} ${o} 0 \\ \\Rightarrow \\ ${prodLatex(fs)} ${o} 0`],
			fraction: false,
			cands: [{ tag: 'radice', ivs: solveFacs([monic(k)], op) }, ...commonCands(fs, op), { tag: 'sistema', ivs: solveSystem(fs, op) }, ...zeroSignCands(fs, op)],
			extra: { k },
		};
	}
	// three factors already written
	const r1 = rng.int(-6, 6);
	const r2 = intIn(rng, -6, 6, [r1]);
	const r3 = intIn(rng, -6, 6, [r1, r2]);
	const fs = xFirst(shuffle(rng, [monic(r1), monic(r2), monic(r3)]));
	return {
		form: 'tre fattori',
		op,
		fs,
		pre: 1,
		problem: `${prodLatex(fs)} ${o} 0`,
		lead: [`\\text{Il primo membro è già scomposto e il secondo è zero.}`],
		fraction: false,
		cands: [{ tag: 'sistema', ivs: solveSystem(fs, op) }, ...commonCands(fs, op), ...zeroSignCands(fs, op)],
		extra: {},
	};
}

function fracCands(fs: Fac[], op: Op): Cand[] {
	return large(op) ? [{ tag: 'denominatore', ivs: solveFacs(fs, op, { incDen: true }) }] : [];
}

function level5(rng: Rng): Build | null {
	const c1 = rng.pick([1, 1, 1, 2]);
	const d1 = rng.int(-9, 9);
	const c2 = rng.pick([1, 1, 1, 2]);
	const d2 = rng.int(-9, 9);
	if (gcd(c1, Math.abs(d1)) !== 1 || gcd(c2, Math.abs(d2)) !== 1) return null;
	const N: Fac = { a: c1, b: d1 };
	const D: Fac = { a: c2, b: d2, den: true };
	if (zeroOf(N).equals(zeroOf(D))) return null;
	const op = rng.pick<Op>(['<', '>', '<=', '<=', '>=', '>=', '>=', '<=']);
	const fs = [N, D];
	return {
		form: 'N/D e zero',
		op,
		fs,
		pre: 1,
		problem: `\\frac{${linLatex(N)}}{${linLatex(D)}} ${OP_LATEX[op]} 0`,
		lead: [`\\text{C.E.: } x \\neq ${zeroOf(D).toLatex()}\\text{. Il primo membro è già una frazione sola e il secondo è zero.}`],
		fraction: true,
		cands: [...fracCands(fs, op), { tag: 'moltiplica', ivs: solveFacs([N], op) }, ...commonCands(fs, op), ...zeroSignCands(fs, op)],
		extra: {},
	};
}

/** k·(x - c) after a sign, as in "2x + 1 - (x - 3)": "- 2(x - 3)", "+ (x + 1)", "- 2x". */
function timesDen(k: number, den: Fac): string {
	const s = k < 0 ? '+' : '-';
	const n = Math.abs(k);
	if (isX(den)) return `${s} ${n === 1 ? '' : n}x`;
	return `${s} ${n === 1 ? '' : n}(${linLatex(den)})`;
}

function level6(rng: Rng): Build | null {
	const cc = rng.int(-6, 6);
	const k = rng.pick([-3, -2, -1, 1, 1, 2, 2, 3]);
	const a = rng.pick([1, 2, 2, 3]);
	const A = a - k;
	if (A === 0) return null;
	// numerator of the reduced fraction A x + B, with its zero t / A
	const t = rng.int(-9, 9);
	const B = -t;
	if (gcd(Math.abs(A), Math.abs(B)) !== 1 && B !== 0) return null;
	if (A < 0 && B <= 0) return null; // "-x - 7": the lesson never writes it
	if (B === 0 && Math.abs(A) !== 1) return null;
	const b = B - k * cc; // B = b + k·c
	if (Math.abs(b) > 15) return null;
	const orig: Fac = { a, b };
	if (b !== 0 && gcd(a, Math.abs(b)) !== 1) return null;
	if (b === 0 && a !== 1) return null;
	const den: Fac = { a: 1, b: -cc, den: true };
	const N: Fac = { a: A, b: B };
	if (zeroOf(N).equals(zeroOf(den)) || zeroOf(orig).equals(zeroOf(den))) return null;
	const op = rng.pick<Op>(['<', '>', '<=', '>=']);
	const o = OP_LATEX[op];
	const fs = [N, den];
	const f0 = `\\frac{${linLatex(orig)}}{${linLatex(den)}}`;
	return {
		form: 'N/D e numero',
		op,
		fs,
		pre: 1,
		problem: `${f0} ${o} ${k}`,
		lead: [
			`\\text{C.E.: } x \\neq ${cc}\\text{. Porta } ${k} \\text{ a primo membro e riduci a una frazione sola:}`,
			`${f0} ${signed(-k)} ${o} 0`,
			`\\frac{${linLatex(orig)} ${timesDen(k, den)}}{${linLatex(den)}} ${o} 0`,
			`\\frac{${linLatex(N)}}{${linLatex(den)}} ${o} 0`,
		],
		fraction: true,
		cands: [
			{ tag: 'moltiplica', ivs: solveFacs([N], op) },
			{ tag: 'senza zero', ivs: solveFacs([orig, den], op) },
			...fracCands(fs, op),
			...commonCands(fs, op),
		],
		extra: { k, a, b, c: cc },
	};
}

/** p·(x - b) as the first term of the numerator, "- q(x - a)" as the second. */
function termTimes(p: number, f: Fac, first: boolean): string {
	const lead = first ? '' : '- ';
	if (isX(f)) return `${lead}${p === 1 ? '' : p}x`;
	if (p === 1) return first ? linLatex(f) : `${lead}(${linLatex(f)})`;
	return `${lead}${p}(${linLatex(f)})`;
}

function level7(rng: Rng): Build | null {
	const p = rng.int(1, 6);
	const qq = intIn(rng, 1, 6, [p]);
	const a = rng.int(-5, 5);
	const b = intIn(rng, -5, 5, [a]);
	const A = p - qq;
	const B = qq * a - p * b;
	if (A < 0 && B <= 0) return null;
	const N: Fac = { a: A, b: B };
	const n = zeroOf(N);
	if (n.den > 3 || Math.abs(n.num) > 12 || n.equals(q(a)) || n.equals(q(b))) return null;
	if (B !== 0 && gcd(Math.abs(A), Math.abs(B)) !== 1) return null;
	if (B === 0 && Math.abs(A) !== 1) return null;
	const Da: Fac = { a: 1, b: -a, den: true };
	const Db: Fac = { a: 1, b: -b, den: true };
	const op = rng.pick<Op>(['<', '>', '<=', '>=']);
	const o = OP_LATEX[op];
	const fs = [N, Da, Db];
	const dens = xFirst([Da, Db]);
	const denL = prodLatex(dens);
	const ce = [a, b]
		.sort((u, v) => u - v)
		.map((v) => `x \\neq ${v}`)
		.join(',\\ ');
	const fa = `\\frac{${p}}{${linLatex(Da)}}`;
	const fb = `\\frac{${qq}}{${linLatex(Db)}}`;
	return {
		form: 'due frazioni',
		op,
		fs,
		pre: 1,
		problem: `${fa} ${o} ${fb}`,
		lead: [
			`\\text{C.E.: } ${ce}\\text{. Porta tutto a primo membro e riduci al denominatore comune } ${denL}\\text{:}`,
			`${fa} - ${fb} ${o} 0`,
			`\\frac{${termTimes(p, Db, true)} ${termTimes(qq, Da, false)}}{${denL}} ${o} 0`,
			`\\frac{${linLatex(N)}}{${denL}} ${o} 0`,
		],
		fraction: true,
		cands: [{ tag: 'in croce', ivs: solveFacs([N], op) }, ...fracCands(fs, op), ...commonCands(fs, op), { tag: 'sistema', ivs: solveSystem(fs, op) }],
		extra: { p, q: qq, a, b },
	};
}

const BUILDERS: Record<number, (rng: Rng) => Build | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

// ---------------------------------------------------------------------------
// Assembly

function fallbackCands(b: Build): Cand[] {
	const { fs, op, pre } = b;
	return [{ tag: 'scambiati ed estremi', ivs: solveFacs(fs, TOGGLE[FLIP[op]], { pre }) }, ...(b.fraction ? [] : zeroSignCands(fs, op, pre))];
}

function assemble(b: Build, level: number, rng: Rng): Sample | null {
	const truth = solveFacs(b.fs, b.op, { pre: b.pre });
	if (!nice(truth)) return null;
	const notation: Notation = rng.next() < 0.5 ? 'disequazioni' : 'intervalli';

	const picked: Cand[] = [{ tag: 'giusta', ivs: truth }];
	const seen = new Set([ivsKey(truth)]);
	for (const c of [...b.cands, ...fallbackCands(b)]) {
		if (picked.length === 4) break;
		if (!nice(c.ivs) || seen.has(ivsKey(c.ivs))) continue;
		seen.add(ivsKey(c.ivs));
		picked.push(c);
	}
	if (picked.length < 4) return null;
	const order = shuffle(
		rng,
		picked.map((_, i) => i),
	);
	const options: ChoiceOption[] = order.map((i) => ({ latex: optionLatex(picked[i].ivs, notation), values: picked[i].ivs.map(ivValue) }));
	const answer: ChoiceAnswer = { kind: 'choice', options, correct: order.indexOf(0) };

	const nums = b.fs.filter((f) => !f.den);
	const dens = b.fs.filter((f) => f.den);
	const steps = [...b.lead];
	if (b.fraction) {
		for (const f of nums) steps.push(studyLine(f, 'Numeratore'));
		for (const f of dens) steps.push(studyLine(f, 'Denominatore'));
	} else {
		steps.push(`\\text{Studia il segno di ogni fattore:}`);
		for (const f of xFirst(nums)) steps.push(studyLine(f));
	}
	steps.push(signLine(b.fs, b.fraction ? 'della frazione' : 'del prodotto', b.pre));
	steps.push(pickLine(b.fs, b.op, b.fraction));
	steps.push(disLatex(truth));

	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: 'Risolvi la disequazione.',
		problem: b.problem,
		solution: setLatex(truth),
		steps,
		answer,
		params: {
			form: b.form,
			op: b.op,
			pre: b.pre,
			factors: b.fs.map((f) => ({ a: f.a, b: f.b, den: !!f.den })),
			notation,
			truth: truth.map(ivValue),
			optionTags: order.map((i) => picked[i].tag),
			...b.extra,
		},
	};
}

// ---------------------------------------------------------------------------
// Check

function ivsFromValues(vals: string[]): Iv[] | null {
	const out: Iv[] = [];
	for (const v of vals) {
		const m = /^([[(])([^,]+),([^,]+)([\])])$/.exec(v);
		if (!m) return null;
		out.push({ lo: m[2] === '-oo' ? null : Rational.parse(m[2]), hi: m[3] === 'oo' ? null : Rational.parse(m[3]), loC: m[1] === '[', hiC: m[4] === ']' });
	}
	return out;
}

function check(s: Sample): string[] {
	const errs: string[] = [];
	const p = s.params as { op: Op; pre: number; factors: Fac[]; notation: Notation; optionTags: string[] };
	if (!BUILDERS[s.level]) return [`livello ${s.level} sconosciuto`];
	const fs = p.factors;
	const zs = fs.map(zeroOf);
	if (new Set(zs.map((z) => z.toString())).size !== zs.length) errs.push('due fattori con lo stesso zero');
	if (zs.some((z) => z.den > 3 || Math.abs(z.num) > 12)) errs.push(`zeri non piccoli: ${zs.map(String).join(', ')}`);
	const truth = solveFacs(fs, p.op, { pre: p.pre });
	const ans = s.answer;
	if (ans.kind !== 'choice') return [...errs, 'la risposta deve essere a scelta multipla'];
	if (ans.options.length !== 4) errs.push('servono quattro opzioni');
	const keys = ans.options.map((o) => o.values.join('|'));
	if (new Set(keys).size !== keys.length) errs.push('opzioni uguali');
	if (keys[ans.correct] !== ivsKey(truth)) errs.push('opzione giusta sbagliata');
	for (const o of ans.options) {
		const ivs = ivsFromValues(o.values);
		if (!ivs || o.latex !== optionLatex(ivs, p.notation)) errs.push(`testo dell'opzione diverso dai valori: ${o.latex}`);
	}
	for (const f of fs.filter((g) => g.den)) {
		const z = zeroOf(f);
		if (truth.some((iv) => (iv.loC && iv.lo?.equals(z)) || (iv.hiC && iv.hi?.equals(z)))) errs.push('zero del denominatore incluso');
	}
	if (large(p.op)) {
		for (const f of fs.filter((g) => !g.den)) {
			const z = zeroOf(f);
			if (!truth.some((iv) => (iv.loC && iv.lo?.equals(z)) || (iv.hiC && iv.hi?.equals(z)))) errs.push('zero del numeratore escluso con un verso largo');
		}
	}
	const lvl = s.level;
	const strictOnly = lvl === 1;
	const largeOnly = lvl === 2;
	if (strictOnly && large(p.op)) errs.push('livello 1: verso stretto');
	if (largeOnly && !large(p.op)) errs.push('livello 2: verso largo');
	if (lvl <= 4 && fs.some((f) => f.den)) errs.push('livelli 1-4: nessun denominatore');
	if (lvl >= 5 && !fs.some((f) => f.den)) errs.push('livelli 5-7: serve un denominatore');
	if (lvl === 3 && !fs.some((f) => f.a < 0)) errs.push('livello 3: serve un coefficiente di x negativo');
	errs.push(...forbidden(s.problem));
	if (!s.steps.length || !s.solution) errs.push('mancano passaggi o soluzione');
	return errs;
}

const disequazioniRazionali: Generator = {
	id: ID,
	title: 'Studio del segno e disequazioni fratte',
	levels: {
		1: { label: 'Prodotto di due fattori', constraints: ['(x - a)(x - b) con a, b interi distinti tra -9 e 9', 'verso stretto'] },
		2: { label: 'Estremi compresi', constraints: ['verso largo', 'già scomposto, x^2 e kx, oppure cx^2 + cbx da raccogliere'] },
		3: { label: 'Un coefficiente di x negativo', constraints: ['un fattore b - mx, l\'altro cx + d', 'zeri anche frazionari (denominatore fino a 3)'] },
		4: { label: 'Tre fattori', constraints: ['x^3 - k^2x, x^3 e k^2x, x^2 e k^2, oppure tre fattori scritti'] },
		5: { label: 'Frazione e zero', constraints: ['N/D op 0 con N e D di primo grado', 'verso largo 3 volte su 4'] },
		6: { label: 'Frazione e numero', constraints: ['(ax + b)/(x - c) op k, da portare a primo membro'] },
		7: { label: 'Due frazioni', constraints: ['p/(x - a) op q/(x - b), tre fattori'] },
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILDERS[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng);
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

export default disequazioniRazionali;
