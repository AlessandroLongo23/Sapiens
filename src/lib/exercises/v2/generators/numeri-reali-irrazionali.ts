/**
 * Numeri irrazionali e numeri reali. Spec: specs/exercises/numeri-reali-irrazionali.md
 *
 * Seven levels in the order of the lesson: which square roots are rational, which decimals are
 * irrational, approximations of √n by defect and excess, the same for -√n, true comparisons
 * between two reals, ordering four reals, and operations with roots whose result may be rational.
 *
 * Every number is built from its exact value: a square root √R with R rational, a rational, or π.
 * Comparisons are exact (a signed square root compares by its sign and its radicand), decimal
 * expansions come from integer square roots on BigInt, so no answer depends on floating point.
 */
import type { ChoiceAnswer, ChoiceOption, ExpressionAnswer, Generator, NumberAnswer, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { Surd } from '../surd';
import { buildChoice, decimalLatex, shuffle, toDecimal, weighted } from '../razionali';

export const ID = 'numeri-reali-irrazionali';

// ---------------------------------------------------------------------------
// Small helpers

const isSquare = (n: number): boolean => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
const isqrtN = (n: number): number => {
	let x = Math.floor(Math.sqrt(n));
	while (x * x > n) x--;
	while ((x + 1) * (x + 1) <= n) x++;
	return x;
};

function isqrt(n: bigint): bigint {
	if (n < 2n) return n;
	let x = BigInt(Math.floor(Math.sqrt(Number(n))));
	while (x * x > n) x--;
	while ((x + 1n) * (x + 1n) <= n) x++;
	return x;
}

/** m / 10^k written with k decimals and the Italian comma: fixed(264, 2) = "2{,}64", fixed(-3, 1) = "-0{,}3". */
function fixed(m: number | bigint, k: number): string {
	const neg = m < 0;
	let s = (neg ? -BigInt(m) : BigInt(m)).toString();
	if (k === 0) return `${neg ? '-' : ''}${s}`;
	s = s.padStart(k + 1, '0');
	return `${neg ? '-' : ''}${s.slice(0, -k)}{,}${s.slice(-k)}`;
}

/** A rational as its decimal: limited or periodic, canonical. */
function decLatex(r: Rational, maxAnte = 6, maxPeriod = 16): string {
	const d = toDecimal(r, maxAnte, maxPeriod);
	if (!d) throw new Error(`${ID}: decimal too long for ${r}`);
	return decimalLatex(d);
}

const sq = (x: string) => `\\sqrt{${x}}`;
const fracL = (n: number, d: number) => `\\frac{${n}}{${d}}`;

/** Which terms of a reduced fraction p/q are not perfect squares, as words. */
function nonSquareTerms(p: number, qq: number): string {
	const a = !isSquare(p), b = !isSquare(qq);
	if (a && b) return 'né il numeratore né il denominatore sono quadrati perfetti';
	return a ? 'il numeratore non è un quadrato perfetto' : 'il denominatore non è un quadrato perfetto';
}

// ---------------------------------------------------------------------------
// Real numbers of the lesson: s·√R (R >= 0 rational, s = ±1) or π

type Real = { kind: 'root'; sign: 1 | -1; R: Rational } | { kind: 'pi'; sign: 1 | -1 };

const PI_DIGITS = 314159265358979n; // π · 10^14, truncated

/** floor(|x| · 10^k), exact. */
function truncAbs(x: Real, k: number): bigint {
	if (x.kind === 'pi') return PI_DIGITS / 10n ** BigInt(14 - k);
	// floor(sqrt(num/den) · 10^k) = floor(sqrt(num · den · 10^2k) / den)
	const num = BigInt(x.R.num), den = BigInt(x.R.den);
	return isqrt(num * den * 10n ** BigInt(2 * k)) / den;
}

/** Exact comparison of two reals: sign first, then the radicands; π only against roots. */
function cmpReal(a: Real, b: Real): -1 | 0 | 1 {
	const sgn = (x: Real) => (x.kind === 'root' && x.R.isZero() ? 0 : x.sign);
	const sa = sgn(a), sb = sgn(b);
	if (sa !== sb) return sa < sb ? -1 : 1;
	if (sa === 0) return 0;
	let c: -1 | 0 | 1;
	if (a.kind === 'root' && b.kind === 'root') c = a.R.compare(b.R);
	else if (a.kind === 'pi' && b.kind === 'pi') c = 0;
	else {
		// π against √R: compare with 30 exact digits, never equal (π is not algebraic).
		const ta = truncAbs(a, 12), tb = truncAbs(b, 12);
		if (ta === tb) throw new Error(`${ID}: π too close to a root`);
		c = ta < tb ? -1 : 1;
	}
	return (sa > 0 ? c : -c) as -1 | 0 | 1;
}

const rootOf = (n: number, sign: 1 | -1 = 1): Real => ({ kind: 'root', sign, R: q(n) });
const ratReal = (r: Rational): Real => ({ kind: 'root', sign: r.sign() < 0 ? -1 : 1, R: r.mul(r) });
const PI: Real = { kind: 'pi', sign: 1 };

/** A real of the lesson with its LaTeX and its SymPy string. */
interface Num {
	x: Real;
	latex: string;
	sym: string;
	/** Exact rational value when rational. */
	rat?: Rational;
}

function numRoot(n: number, sign: 1 | -1 = 1): Num {
	return { x: rootOf(n, sign), latex: `${sign < 0 ? '-' : ''}${sq(String(n))}`, sym: `${sign < 0 ? '-' : ''}sqrt(${n})` };
}
function numRat(r: Rational, latex?: string): Num {
	return { x: ratReal(r), latex: latex ?? (r.isInteger() ? String(r.num) : decLatex(r)), sym: r.toString(), rat: r };
}
function numFrac(r: Rational): Num {
	return numRat(r, r.toLatex());
}
const NUM_PI: Num = { x: PI, latex: '\\pi', sym: 'pi' };

/** 4-decimal expansion of a number for the steps: exact if it has at most 4 decimals, else truncated with \ldots. */
function expansion(n: Num): string {
	if (n.rat) {
		const d = toDecimal(n.rat, 4, 0);
		if (d && d.period === '' && d.ante.length <= 4) return decimalLatex(d);
	}
	const t = truncAbs(n.x, 4);
	return `${n.x.sign < 0 ? '-' : ''}${fixed(t, 4)}\\ldots`;
}
/** Truncation to 4 decimals as a signed integer, to tell numbers apart in the steps. */
const trunc4 = (n: Num): bigint => BigInt(n.x.sign) * truncAbs(n.x, 4);

// ---------------------------------------------------------------------------
// Level 1: which square root is rational

interface RootItem {
	kind: string;
	latex: string;
	rad: Rational;
	rational: boolean;
	step: string;
	/** Value of a rational root, in LaTeX. */
	value?: string;
}

const RAT_KINDS = ['quadrato', 'frazione', 'non ridotta', 'decimale'] as const;
const IRR_KINDS = ['non quadrato', 'solo denominatore', 'solo numeratore', 'non ridotta irrazionale', 'decimale irrazionale'] as const;

function rootItem(rng: Rng, kind: string): RootItem | null {
	switch (kind) {
		case 'quadrato': {
			const k = rng.int(2, 15), n = k * k;
			return { kind, latex: sq(String(n)), rad: q(n), rational: true, value: String(k), step: `${sq(String(n))} = ${k}\\text{, razionale, perché } ${k}^2 = ${n}` };
		}
		case 'non quadrato': {
			const k = rng.int(2, 11);
			const n = k * k + rng.pick([-2, -1, 1, 1, 2, 3]);
			if (n < 2 || isSquare(n)) return null;
			const f = isqrtN(n);
			return { kind, latex: sq(String(n)), rad: q(n), rational: false, step: `${n} \\text{ sta tra i quadrati perfetti } ${f * f} \\text{ e } ${(f + 1) * (f + 1)}\\text{: } ${sq(String(n))} \\text{ è irrazionale}` };
		}
		case 'frazione': {
			const a = rng.int(1, 9), b = rng.int(2, 9);
			if (gcd(a, b) !== 1) return null;
			const L = sq(fracL(a * a, b * b));
			return { kind, latex: L, rad: q(a * a, b * b), rational: true, value: fracL(a, b), step: `${L} = ${fracL(a, b)}\\text{, razionale, perché } \\left(${fracL(a, b)}\\right)^2 = ${fracL(a * a, b * b)}` };
		}
		case 'non ridotta': {
			const a = rng.int(1, 5), b = rng.int(2, 6), m = rng.pick([2, 3, 5, 6, 7]);
			if (gcd(a, b) !== 1 || m * b * b > 200) return null;
			const N = m * a * a, D = m * b * b;
			const L = sq(fracL(N, D));
			return { kind, latex: L, rad: q(N, D), rational: true, value: fracL(a, b), step: `${fracL(N, D)} = ${fracL(a * a, b * b)}\\text{, quindi } ${L} = ${fracL(a, b)}\\text{, razionale}` };
		}
		case 'decimale': {
			const t = rng.int(1, 19);
			if (t % 10 === 0) return null;
			const dl = decLatex(q(t * t, 100)), sl = decLatex(q(t, 10));
			return { kind, latex: sq(dl), rad: q(t * t, 100), rational: true, value: sl, step: `${dl} = ${fracL(t * t, 100)}\\text{, e } ${t * t} \\text{ e } 100 \\text{ sono quadrati perfetti: } ${sq(dl)} = ${sl}\\text{, razionale}` };
		}
		case 'solo denominatore': {
			const a = rng.int(2, 12), b = rng.int(2, 9);
			if (isSquare(a) || gcd(a, b) !== 1) return null;
			const L = sq(fracL(a, b * b));
			return { kind, latex: L, rad: q(a, b * b), rational: false, step: `\\text{In } ${fracL(a, b * b)}\\text{, ridotta, il denominatore è un quadrato perfetto ma il numeratore no: } ${L} \\text{ è irrazionale}` };
		}
		case 'solo numeratore': {
			const a = rng.int(1, 7), b = rng.int(2, 15);
			if (isSquare(b) || gcd(a, b) !== 1) return null;
			const L = sq(fracL(a * a, b));
			return { kind, latex: L, rad: q(a * a, b), rational: false, step: `\\text{In } ${fracL(a * a, b)}\\text{, ridotta, il numeratore è un quadrato perfetto ma il denominatore no: } ${L} \\text{ è irrazionale}` };
		}
		case 'non ridotta irrazionale': {
			// N/D with N a perfect square, reducing to p/q that is not a ratio of squares: 4/8 = 1/2, 9/12 = 3/4.
			const p = rng.int(1, 5), qq = rng.int(2, 8), s = rng.int(1, 3);
			if (gcd(p, qq) !== 1 || (isSquare(p) && isSquare(qq))) return null;
			const m = p * s * s;
			if (m < 2) return null;
			const N = p * m, D = qq * m;
			if (D > 200) return null;
			const L = sq(fracL(N, D));
			return { kind, latex: L, rad: q(N, D), rational: false, step: `${fracL(N, D)} = ${fracL(p, qq)}\\text{: ${nonSquareTerms(p, qq)}, quindi } ${L} \\text{ è irrazionale}` };
		}
		case 'decimale irrazionale': {
			// 0,4  0,9  2,5  4,9: the digits form a square, the number t/10 is not the square of a rational.
			const t = rng.pick([1, 4, 9, 16, 25, 36, 49, 64, 81]);
			const r = q(t, 10), dl = decLatex(r);
			const red = r.den === 10 ? '' : ` = ${fracL(r.num, r.den)}`;
			return { kind, latex: sq(dl), rad: r, rational: false, step: `${dl} = ${fracL(t, 10)}${red}\\text{: ${nonSquareTerms(r.num, r.den)}, quindi } ${sq(dl)} \\text{ è irrazionale}` };
		}
	}
	throw new Error(`${ID}: unknown root kind ${kind}`);
}

function drawRoot(rng: Rng, kind: string): RootItem {
	for (let i = 0; i < 200; i++) {
		const it = rootItem(rng, kind);
		if (it) return it;
	}
	throw new Error(`${ID}: no root of kind ${kind}`);
}

function buildRoots(rng: Rng): Built | null {
	const ask = rng.next() < 0.5 ? 'razionale' : 'irrazionale';
	const correctKind =
		ask === 'razionale'
			? weighted<string>(rng, [
					['quadrato', 1],
					['frazione', 1],
					['non ridotta', 2],
					['decimale', 2],
				])
			: weighted<string>(rng, [
					['non quadrato', 1],
					['solo denominatore', 1],
					['solo numeratore', 1],
					['non ridotta irrazionale', 2],
					['decimale irrazionale', 2],
				]);
	const others = shuffle(rng, ask === 'razionale' ? [...IRR_KINDS] : [...RAT_KINDS]).slice(0, 3);
	const items = [drawRoot(rng, correctKind), ...others.map((k) => drawRoot(rng, k))];
	if (new Set(items.map((i) => i.rad.toString())).size !== 4) return null;
	const opt = (it: RootItem): ChoiceOption => ({ latex: it.latex, values: [it.rad.toString()] });
	const answer = buildChoice(rng, opt(items[0]), items.slice(1).map(opt));
	const byKey = new Map(items.map((i) => [i.rad.toString(), i]));
	const ordered = answer.options.map((o) => byKey.get(o.values[0])!);
	const c = items[0];
	return {
		prompt: 'Scegli il numero giusto.',
		problem: `\\text{Quale di questi numeri è ${ask}?}`,
		solution: c.rational ? `${c.latex} = ${c.value}` : `${c.latex} \\text{ è irrazionale}`,
		steps: [
			'\\text{La radice di una frazione ridotta è razionale solo se numeratore e denominatore sono quadrati perfetti}',
			...ordered.map((i) => i.step),
		],
		answer,
		params: { ask, case: correctKind, items: ordered.map((i) => ({ latex: i.latex, radicand: i.rad.toString(), kind: i.kind })) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: rational or irrational from the decimal

interface DecItem {
	kind: string;
	latex: string;
	/** Exact value (SymPy), or a description for the constructed decimals. */
	value: string;
	rational: boolean;
	step: string;
}

const SMALL_ROOTS = [2, 3, 5, 6, 7, 10, 11];

/** Digits of a decimal whose blocks of `a` grow: "a b aa b aaa b aaaa b" or "b a b aa b aaa b". */
function growing(a: number, b: number, shape: 'ab' | 'ba'): string {
	let s = '';
	if (shape === 'ab') for (let k = 1; k <= 4; k++) s += String(a).repeat(k) + b;
	else {
		for (let k = 1; k <= 3; k++) s += String(b) + String(a).repeat(k);
		s += b;
	}
	return s;
}

function decItem(rng: Rng, kind: string): DecItem | null {
	switch (kind) {
		case 'troncato': {
			// 3,14 for π, or √n truncated to 2-4 decimals: a limited decimal near an irrational.
			if (rng.next() < 0.5) {
				const k = rng.pick([2, 2, 4]);
				const t = truncAbs(PI, k), r = q(Number(t), 10 ** k);
				return { kind, latex: fixed(t, k), value: r.toString(), rational: true, step: `${fixed(t, k)} \\text{ è un decimale limitato, quindi razionale: approssima } \\pi \\text{ ma non è } \\pi` };
			}
			const n = rng.pick(SMALL_ROOTS), k = rng.int(2, 4);
			const t = truncAbs(rootOf(n), k);
			if (t % 10n === 0n) return null;
			const r = q(Number(t), 10 ** k);
			return { kind, latex: fixed(t, k), value: r.toString(), rational: true, step: `${fixed(t, k)} \\text{ è un decimale limitato, quindi razionale: approssima } ${sq(String(n))} \\text{ ma non è } ${sq(String(n))}` };
		}
		case 'calcolatrice': {
			const n = rng.pick(SMALL_ROOTS);
			const t = truncAbs(rootOf(n), 9);
			if (t % 10n === 0n) return null;
			const r = q(Number(t), 10 ** 9);
			return { kind, latex: fixed(t, 9), value: r.toString(), rational: true, step: `${fixed(t, 9)} \\text{ è un decimale limitato, quindi razionale: è quello che la calcolatrice mostra per } ${sq(String(n))}\\text{, che invece continua}` };
		}
		case 'frazione': {
			return { kind, latex: fracL(22, 7), value: '22/7', rational: true, step: `${fracL(22, 7)} \\text{ è una frazione, quindi razionale: vale } 3{,}\\overline{142857}\\text{, vicino a } \\pi \\text{ ma diverso}` };
		}
		case 'periodo lungo': {
			const den = rng.pick([7, 13, 17]);
			const num = rng.int(1, den - 1) + den * rng.int(0, 2);
			const r = q(num, den), dl = decLatex(r);
			return { kind, latex: dl, value: r.toString(), rational: true, step: `${dl} \\text{ è periodico, quindi razionale, anche se il periodo è lungo: } ${dl} = ${r.toLatex()}` };
		}
		case 'periodico': {
			const den = rng.pick([3, 6, 9, 11, 12, 15, 18, 33, 45, 90, 99]);
			const num = rng.int(1, 3 * den);
			const r = q(num, den);
			if (r.den === 1 || [2, 4, 5, 8, 10, 20, 25, 50].includes(r.den)) return null;
			const d = toDecimal(r, 2, 2);
			if (!d || d.ante.length + d.period.length > 3) return null;
			const dl = decimalLatex(d);
			return { kind, latex: dl, value: r.toString(), rational: true, step: `${dl} \\text{ è periodico, quindi razionale: } ${dl} = ${r.toLatex()}` };
		}
		case 'pi':
			return { kind, latex: '\\pi', value: 'pi', rational: false, step: '\\pi \\text{ è irrazionale}' };
		case 'costruito': {
			const a = rng.int(0, 9), b = rng.int(0, 9);
			if (a === b) return null;
			const shape = rng.pick(['ab', 'ba'] as const);
			if (shape === 'ba' && b === 0) return null;
			const i = rng.pick([0, 0, 0, 1, 2, 3]);
			const latex = `${i}{,}${growing(a, b, shape)}\\ldots`;
			return { kind, latex, value: `growing:${i}:${a}:${b}:${shape}`, rational: false, step: `\\text{In } ${latex} \\text{ i gruppi di } ${a} \\text{ si allungano sempre: il decimale è illimitato e non periodico, quindi irrazionale}` };
		}
		case 'radice': {
			const n = rng.pick([2, 3, 5, 6, 7, 8, 10, 12]);
			return { kind, latex: sq(String(n)), value: `sqrt(${n})`, rational: false, step: `${n} \\text{ non è un quadrato perfetto: } ${sq(String(n))} \\text{ è irrazionale}` };
		}
	}
	throw new Error(`${ID}: unknown decimal kind ${kind}`);
}

function drawDec(rng: Rng, kind: string): DecItem {
	for (let i = 0; i < 200; i++) {
		const it = decItem(rng, kind);
		if (it) return it;
	}
	throw new Error(`${ID}: no decimal of kind ${kind}`);
}

function buildDecimals(rng: Rng): Built | null {
	const ask = rng.next() < 0.5 ? 'irrazionale' : 'razionale';
	let kinds: string[];
	if (ask === 'irrazionale') {
		const c = rng.pick(['pi', 'costruito']);
		kinds = [c, ...shuffle(rng, ['troncato', 'calcolatrice', 'frazione', 'periodo lungo', 'periodico']).slice(0, 3)];
	} else {
		const c = weighted<string>(rng, [
			['troncato', 2],
			['calcolatrice', 2],
			['periodo lungo', 2],
			['periodico', 1],
			['frazione', 1],
		]);
		kinds = [c, 'pi', 'costruito', rng.pick(['costruito', 'radice'])];
	}
	const items = kinds.map((k) => drawDec(rng, k));
	if (new Set(items.map((i) => i.value)).size !== 4 || new Set(items.map((i) => i.latex)).size !== 4) return null;
	const opt = (it: DecItem): ChoiceOption => ({ latex: it.latex, values: [it.value] });
	const answer = buildChoice(rng, opt(items[0]), items.slice(1).map(opt));
	const byKey = new Map(items.map((i) => [i.value, i]));
	const ordered = answer.options.map((o) => byKey.get(o.values[0])!);
	const c = items[0];
	return {
		prompt: 'Scegli il numero giusto.',
		problem: `\\text{Quale di questi numeri è ${ask}?}`,
		solution: `${c.latex} \\text{ è ${ask}}`,
		steps: [
			'\\text{I decimali limitati e periodici sono razionali, quelli illimitati non periodici sono irrazionali}',
			...ordered.map((i) => i.step),
		],
		answer,
		params: { ask, case: kinds[0], items: ordered.map((i) => ({ latex: i.latex, value: i.value, kind: i.kind })) },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: approximations of √n and -√n

const PREC_WORD = ['all\'unità', 'al decimo', 'al centesimo'];

function buildApprox(rng: Rng, negative: boolean): Built | null {
	const k = rng.pick([1, 2]);
	const n = k === 1 ? rng.int(2, 99) : rng.int(2, 50);
	if (isSquare(n)) return null;
	const which = rng.next() < 0.5 ? 'difetto' : 'eccesso';
	const f = Number(truncAbs(rootOf(n), k)); // floor(√n · 10^k)
	const lo = negative ? -(f + 1) : f; // scaled by 10^k
	const hi = negative ? -f : f + 1;
	const ans = which === 'difetto' ? lo : hi;
	const value = q(ans, 10 ** k);
	const x = negative ? `-${sq(String(n))}` : sq(String(n));

	const steps: string[] = [];
	const f0 = isqrtN(n);
	steps.push(`${f0}^2 = ${f0 * f0} < ${n} < ${(f0 + 1) * (f0 + 1)} = ${f0 + 1}^2\\text{, quindi } ${f0} < ${sq(String(n))} < ${f0 + 1}`);
	for (let j = 1; j <= k; j++) {
		const fj = Number(truncAbs(rootOf(n), j));
		const s1 = fixed(BigInt(fj) * BigInt(fj), 2 * j), s2 = fixed(BigInt(fj + 1) * BigInt(fj + 1), 2 * j);
		steps.push(`${fixed(fj, j)}^2 = ${s1} \\text{ e } ${fixed(fj + 1, j)}^2 = ${s2}\\text{, quindi } ${fixed(fj, j)} < ${sq(String(n))} < ${fixed(fj + 1, j)}`);
	}
	if (negative) steps.push(`\\text{Cambiando segno cambia il verso: } ${fixed(-(f + 1), k)} < ${x} < ${fixed(-f, k)}`);
	steps.push(`\\text{Per difetto } ${fixed(lo, k)}\\text{, per eccesso } ${fixed(hi, k)}`);
	return {
		prompt: `Trova l'approssimazione per ${which} ${PREC_WORD[k]}.`,
		problem: x,
		solution: `${fixed(lo, k)} < ${x} < ${fixed(hi, k)}\\text{: per ${which} } ${fixed(ans, k)}`,
		steps,
		answer: { kind: 'number', value: value.toString() },
		params: { n, k, sign: negative ? -1 : 1, which, case: which, value: value.toString() },
	};
}

function approxChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const p = sample.params as { n: number; k: number; sign: number; which: string };
	const { n, k } = p;
	const neg = p.sign < 0;
	const f = Number(truncAbs(rootOf(n), k));
	const lo = neg ? -(f + 1) : f, hi = neg ? -f : f + 1;
	const ans = p.which === 'difetto' ? lo : hi;
	const other = p.which === 'difetto' ? hi : lo;
	const opt = (m: number, kk: number): ChoiceOption => ({ latex: fixed(m, kk), values: [q(m, 10 ** kk).toString()] });
	const cands: ChoiceOption[] = [opt(other, k)]; // defect and excess swapped (for -√n: the truncation)
	if (neg) cands.push(opt(-ans, k)); // the sign lost
	// The same kind of approximation at another precision.
	const fk1 = Number(truncAbs(rootOf(n), k - 1)), fk2 = Number(truncAbs(rootOf(n), k + 1));
	const at = (ff: number, kk: number) => {
		const l = neg ? -(ff + 1) : ff, h = neg ? -ff : ff + 1;
		return opt(p.which === 'difetto' ? l : h, kk);
	};
	cands.push(at(fk1, k - 1));
	cands.push(at(fk2, k + 1));
	const fallback = (i: number) => opt(ans + (i % 2 ? -1 : 1) * (Math.floor(i / 2) + 2), k);
	return buildChoice(rng, opt(ans, k), cands, fallback);
}

// ---------------------------------------------------------------------------
// Level 5: which comparison is true

interface Pair {
	kind: string;
	a: Num;
	b: Num;
	/** Why a and b compare as they do, ending with the true relation. */
	reason: string;
}

/** Relation between a and b as LaTeX. */
const rel = (a: Num, b: Num) => (cmpReal(a.x, b.x) < 0 ? '<' : '>');

function periodicNear(n: number, rng: Rng): Num {
	// f,d + p/90: a periodic decimal whose first decimal is √n's.
	const f1 = Number(truncAbs(rootOf(n), 1));
	const p = rng.int(1, 8);
	return numRat(q(9 * f1 + p, 90));
}

function nearDecimal(n: number, rng: Rng): Num {
	const f1 = Number(truncAbs(rootOf(n), 1));
	const c = rng.pick(['giù', 'su', 'periodico', 'periodico']);
	if (c === 'periodico') return periodicNear(n, rng);
	// 7,1 but never 7,0 or 8,0, which would be an integer and belong to the other kind of pair.
	const m = c === 'giù' || (f1 + 1) % 10 === 0 ? f1 : f1 + 1;
	return m % 10 === 0 ? periodicNear(n, rng) : numRat(q(m, 10));
}

/** "√7 = 2,6457…", or just "2,6" when the number is already a short decimal. */
const shown = (n: Num): string => (expansion(n) === n.latex ? n.latex : `${n.latex} = ${expansion(n)}`);

function digitsReason(a: Num, b: Num): string {
	return `${shown(a)} \\text{ e } ${shown(b)}\\text{, quindi } ${a.latex} ${rel(a, b)} ${b.latex}`;
}

function pairOf(rng: Rng, kind: string): Pair | null {
	switch (kind) {
		case 'radici': {
			const a = rng.int(2, 60), b = a + rng.pick([-6, -4, -3, -2, -1, 1, 2, 3, 4, 6]);
			if (b < 2 || isSquare(a) || isSquare(b)) return null;
			const A = numRoot(a), B = numRoot(b);
			return { kind, a: A, b: B, reason: `${A.latex} ${rel(A, B)} ${B.latex} \\text{ perché } ${a} ${a < b ? '<' : '>'} ${b}` };
		}
		case 'intero': {
			const n = rng.int(3, 99);
			if (isSquare(n)) return null;
			const k = isqrtN(n) + rng.int(0, 1);
			const A = numRoot(n), B = numRat(q(k));
			return { kind, a: A, b: B, reason: `${k} = ${sq(String(k * k))} \\text{ e } ${n} ${n < k * k ? '<' : '>'} ${k * k}\\text{, quindi } ${A.latex} ${rel(A, B)} ${k}` };
		}
		case 'decimale': {
			const n = rng.int(2, 50);
			if (isSquare(n)) return null;
			const A = numRoot(n), B = nearDecimal(n, rng);
			if (trunc4(A) === trunc4(B)) return null;
			return { kind, a: A, b: B, reason: digitsReason(A, B) };
		}
		case 'negativi': {
			const n = rng.int(2, 50);
			if (isSquare(n)) return null;
			const A = numRoot(n, -1);
			const sub = rng.pick(['intero', 'radice', 'decimale']);
			let P: Num, reasonPos: string;
			const Apos = numRoot(n);
			if (sub === 'intero') {
				const k = isqrtN(n) + rng.int(0, 1);
				P = numRat(q(k));
				reasonPos = `${Apos.latex} ${rel(Apos, P)} ${k} \\text{ perché } ${n} ${n < k * k ? '<' : '>'} ${k * k}`;
			} else if (sub === 'radice') {
				const m = n + rng.pick([-3, -2, -1, 1, 2, 3]);
				if (m < 2 || isSquare(m)) return null;
				P = numRoot(m);
				reasonPos = `${Apos.latex} ${rel(Apos, P)} ${P.latex} \\text{ perché } ${n} ${n < m ? '<' : '>'} ${m}`;
			} else {
				P = nearDecimal(n, rng);
				if (trunc4(Apos) === trunc4(P)) return null;
				reasonPos = digitsReason(Apos, P);
			}
			const B: Num = P.rat ? numRat(P.rat.neg(), `-${P.latex}`) : numRoot(Number(P.sym.slice(5, -1)), -1);
			return { kind, a: A, b: B, reason: `\\text{Tra i positivi } ${reasonPos}\\text{; cambiando segno cambia il verso: } ${A.latex} ${rel(A, B)} ${B.latex}` };
		}
	}
	throw new Error(`${ID}: unknown pair kind ${kind}`);
}

function drawPair(rng: Rng, kind: string): Pair {
	for (let i = 0; i < 500; i++) {
		const p = pairOf(rng, kind);
		if (p) return p;
	}
	throw new Error(`${ID}: no pair of kind ${kind}`);
}

const PAIR_KINDS = ['radici', 'intero', 'decimale', 'negativi'];

function buildCompare(rng: Rng): Built | null {
	const kinds = shuffle(rng, PAIR_KINDS);
	const pairs = kinds.map((k) => drawPair(rng, k));
	const stmts = pairs.map((p, i) => {
		const swap = rng.next() < 0.5;
		const [L, R] = swap ? [p.b, p.a] : [p.a, p.b];
		const truth = rel(L, R);
		const op = i === 0 ? truth : truth === '<' ? '>' : '<';
		return { p, L, R, op, latex: `${L.latex} ${op} ${R.latex}`, values: [L.sym, op, R.sym], true: i === 0 };
	});
	if (new Set(stmts.map((s) => s.latex)).size !== 4) return null;
	const opt = (s: (typeof stmts)[number]): ChoiceOption => ({ latex: s.latex, values: s.values });
	const answer = buildChoice(rng, opt(stmts[0]), stmts.slice(1).map(opt));
	const byLatex = new Map(stmts.map((s) => [s.latex, s]));
	const ordered = answer.options.map((o) => byLatex.get(o.latex)!);
	return {
		prompt: 'Scegli la disuguaglianza vera.',
		problem: '\\text{Quale di queste disuguaglianze è vera?}',
		solution: stmts[0].latex,
		steps: ordered.map((s) => `${s.p.reason}${s.true ? '' : `\\text{: } ${s.latex} \\text{ è falsa}`}`),
		answer,
		params: { case: kinds[0], statements: ordered.map((s) => ({ latex: s.latex, left: s.L.sym, rel: s.op, right: s.R.sym })) },
	};
}

// ---------------------------------------------------------------------------
// Level 6: four reals in increasing order

function nearFraction(x: Num, rng: Rng): Num | null {
	const v = Number(truncAbs(x.x, 6)) / 1e6;
	const d = rng.int(3, 9);
	const n = Math.round(v * d) + rng.pick([-1, 0, 0, 1]);
	const r = q(n, d);
	if (r.isInteger() || r.sign() <= 0 || Math.abs(n / d - v) > 0.2) return null;
	return numFrac(r);
}

function buildOrder(rng: Rng): Built | null {
	const kind = rng.next() < 0.5 ? 'un negativo' : 'due negativi';
	const base: Num = rng.next() < 0.2 ? NUM_PI : (() => {
		const n = rng.int(2, 30);
		return isSquare(n) ? null : numRoot(n);
	})() as Num;
	if (!base) return null;
	const nb = base.x.kind === 'pi' ? 0 : Number(base.sym.slice(5, -1));
	const per = base.x.kind === 'pi' ? numRat(q(9 * 31 + rng.int(1, 8), 90)) : periodicNear(nb, rng);
	const fr = nearFraction(base, rng);
	if (!fr) return null;
	const m = rng.int(2, 20);
	if (isSquare(m)) return null;
	const negRoot = numRoot(m, -1);
	const f1 = Number(truncAbs(rootOf(m), 1));
	const negDec = numRat(q(-(rng.next() < 0.5 ? f1 : f1 + 1), 10));
	const nums = kind === 'un negativo' ? [base, per, fr, rng.pick([negRoot, negDec])] : [base, rng.pick([per, fr]), negRoot, negDec];
	// Distinct, and told apart by their first four decimals, as in the lesson.
	if (new Set(nums.map((x) => trunc4(x).toString())).size !== 4) return null;
	if (new Set(nums.map((x) => x.latex)).size !== 4) return null;
	const sorted = [...nums].sort((a, b) => cmpReal(a.x, b.x));
	const chain = (xs: Num[]) => xs.map((x) => x.latex).join(' < ');
	const opt = (xs: Num[]): ChoiceOption => ({ latex: chain(xs), values: xs.map((x) => x.sym) });
	const swap = (i: number) => {
		const s = [...sorted];
		[s[i], s[i + 1]] = [s[i + 1], s[i]];
		return s;
	};
	// Wrong orders: the negatives by absolute value, the two closest positives swapped, the order reversed.
	const negIdx = sorted.filter((x) => x.x.sign < 0).length;
	const cands: Num[][] = [];
	if (negIdx === 2) cands.push(swap(0));
	const gaps = [0, 1, 2]
		.filter((i) => i >= negIdx)
		.map((i) => ({ i, g: approx(sorted[i + 1]) - approx(sorted[i]) }))
		.sort((a, b) => a.g - b.g);
	gaps.forEach(({ i }) => cands.push(swap(i)));
	if (negIdx === 1) {
		// The negative put where its absolute value would go.
		const s = sorted.slice(1);
		const neg = sorted[0];
		const absPos = s.filter((x) => cmpReal(x.x, { ...neg.x, sign: 1 } as Real) < 0).length;
		cands.push([...s.slice(0, absPos), neg, ...s.slice(absPos)]);
	}
	cands.push([...sorted].reverse());
	const answer = buildChoice(rng, opt(sorted), cands.map(opt), (i) => opt(swap(i % 3)));
	const shownNums = shuffle(rng, nums);
	const steps = [
		'\\text{Scrivi tutti i numeri come decimali, con quattro cifre dopo la virgola}',
		...shownNums.filter((x) => expansion(x) !== x.latex).map((x) => `${x.latex} = ${expansion(x)}`),
	];
	if (negIdx > 0) steps.push(`\\text{I negativi vengono prima; tra due negativi è minore quello con il valore assoluto più grande}`);
	steps.push(chain(sorted));
	return {
		prompt: 'Scegli i numeri in ordine crescente.',
		problem: shownNums.map((x) => x.latex).join(' \\quad '),
		solution: chain(sorted),
		steps,
		answer,
		params: { case: kind, numbers: shownNums.map((x) => x.sym), sorted: sorted.map((x) => x.sym) },
	};
}

/** Approximate value, only to rank the gaps between neighbours (which pair a student is likely to swap). */
const approx = (n: Num): number => (n.x.sign * Number(truncAbs(n.x, 8))) / 1e8;

// ---------------------------------------------------------------------------
// Level 7: operations, rational or not

const OP_KINDS = ['somma', 'coniugati', 'prodotto', 'distributiva', 'quadrato', 'doppio'] as const;
type OpKind = (typeof OP_KINDS)[number];
const RAD = [2, 3, 5, 6, 7, 10, 11];

const surd = (a: number, b: number, r: number) => Surd.of(a, b, r, 1);
const label = (s: Surd) => (s.isRational() ? 'razionale' : 'irrazionale');
const valOpt = (s: Surd, lab: string): ChoiceOption => ({ latex: `${s.toLatex()}\\ \\text{(${lab})}`, values: [s.toString(), lab] });

function buildOps(rng: Rng): Built | null {
	const kind = rng.pick([...OP_KINDS]);
	const r = rng.pick(RAD);
	const R = sq(String(r));
	const kR = (k: number) => (k === 1 ? R : `${k}${R}`);
	const a = rng.int(1, 5), c = rng.int(1, 5);
	let problem: string, result: Surd;
	const steps: string[] = [];
	const wrong: Surd[] = [];
	switch (kind as OpKind) {
		case 'somma': {
			// (a - √r) + (√r + c)
			problem = `(${a} - ${R}) + (${R} + ${c})`;
			result = surd(a + c, 0, r);
			steps.push(`${a} - ${R} + ${R} + ${c} = ${a + c}`, `\\text{I due } ${R} \\text{ si cancellano: il risultato è razionale, anche se i due addendi sono irrazionali}`);
			wrong.push(surd(a + c, 2, r), surd(a - c, 0, r));
			break;
		}
		case 'coniugati': {
			if (a * a === r) return null;
			problem = `(${a} + ${R})(${a} - ${R})`;
			result = surd(a * a - r, 0, r);
			steps.push(`${a * a} - ${kR(a)} + ${kR(a)} - ${r} = ${a * a - r}`, `\\text{Razionale: è il prodotto di una somma per una differenza, } ${a}^2 - (${R})^2`);
			wrong.push(surd(a * a + r, 0, r), surd(a - r, 0, r), surd(a * a - r, -2 * a, r));
			break;
		}
		case 'prodotto': {
			// k√r · √r
			const k = rng.int(2, 5);
			problem = `${k}${R} \\cdot ${R}`;
			result = surd(k * r, 0, r);
			steps.push(`${k} \\cdot ${R} \\cdot ${R} = ${k} \\cdot ${r} = ${k * r}`, `\\text{Razionale, perché } ${R} \\cdot ${R} = ${r}`);
			wrong.push(surd(0, k, r), surd(0, k * r, r), surd(k + r, 0, r));
			break;
		}
		case 'distributiva': {
			// √r (√r + c)
			problem = `${R}\\,(${R} + ${c})`;
			result = surd(r, c, r);
			steps.push(`${R} \\cdot ${R} + ${kR(c)} = ${result.toLatex()}`, `\\text{Irrazionale, perché è un razionale più un irrazionale}`);
			wrong.push(surd(r + c, 0, r), surd(0, c + 1, r), surd(r, 1, r));
			break;
		}
		case 'quadrato': {
			const minus = rng.next() < 0.5;
			const s = minus ? -1 : 1;
			problem = `(${a} ${minus ? '-' : '+'} ${R})^2`;
			result = surd(a * a + r, 2 * a * s, r);
			steps.push(`${a * a} ${minus ? '-' : '+'} ${2 * a}${R} + ${r} = ${result.toLatex()}`, `\\text{Irrazionale: } ${2 * a}${R} \\text{ è irrazionale, e aggiungendo } ${a * a + r} \\text{ resta irrazionale}`);
			wrong.push(surd(a * a + r, 0, r), surd(a * a + r, a * s, r), surd(a * a - r, 2 * a * s, r));
			break;
		}
		case 'doppio': {
			// (√r + a) + (√r - a)
			problem = `(${R} + ${a}) + (${R} - ${a})`;
			result = surd(0, 2, r);
			steps.push(`${R} + ${a} + ${R} - ${a} = 2${R}`, `\\text{Irrazionale: è il prodotto del razionale } 2 \\text{ per } ${R}`);
			wrong.push(surd(2 * a, 0, r), surd(0, 2 * a, r), Surd.of(0, 1, 2 * r, 1));
			break;
		}
	}
	const answer: ExpressionAnswer = { kind: 'expression', value: result.toString(), latex: result.toLatex() };
	return {
		prompt: 'Calcola e stabilisci se il risultato è razionale.',
		problem,
		solution: `${problem} = ${result.toLatex()}\\text{, ${label(result)}}`,
		steps,
		answer,
		params: { case: result.isRational() ? 'razionale' : 'irrazionale', op: kind, r, a, c, value: result.toString(), parts: [result.a, result.b, result.r], wrong: wrong.map((w) => w.toString()), wrongParts: wrong.map((w) => [w.a, w.b, w.r]) },
	};
}

function opsChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const p = sample.params as { parts: number[]; wrongParts: number[][] };
	const parse = ([a, b, r]: number[]): Surd => Surd.of(a, b, r, 1);
	const right = parse(p.parts);
	const flip = (l: string) => (l === 'razionale' ? 'irrazionale' : 'razionale');
	const cands: ChoiceOption[] = [valOpt(right, flip(label(right)))]; // the right value with the wrong verdict
	for (const w of p.wrongParts) {
		const s = parse(w);
		if (!s.equals(right)) cands.push(valOpt(s, label(s)));
	}
	const fallback = (i: number) => valOpt(right.add(q(i % 2 ? -(Math.floor(i / 2) + 1) : Math.floor(i / 2) + 1)), label(right));
	return buildChoice(rng, valOpt(right, label(right)), cands, fallback);
}

// ---------------------------------------------------------------------------

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer | NumberAnswer | ExpressionAnswer;
	params: Record<string, unknown>;
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return buildRoots(rng);
		case 2:
			return buildDecimals(rng);
		case 3:
			return buildApprox(rng, false);
		case 4:
			return buildApprox(rng, true);
		case 5:
			return buildCompare(rng);
		case 6:
			return buildOrder(rng);
		case 7:
			return buildOps(rng);
	}
	throw new Error(`${ID}: unknown level ${level}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const all = [sample.problem, sample.solution, ...sample.steps];
	if (all.some((s) => /\d\.\d/.test(s))) v.push('punto decimale invece della virgola');
	if (!sample.steps.length) v.push('niente passaggi');
	const lvl = sample.level;
	const ans = sample.answer;
	if (lvl <= 2 || lvl === 5 || lvl === 6) {
		if (ans.kind !== 'choice' || ans.options.length !== 4) v.push('servono 4 opzioni');
		else if (new Set(ans.options.map((o) => o.latex)).size !== 4) v.push('opzioni non distinte');
	} else if (lvl === 3 || lvl === 4) {
		const p = sample.params as { n: number; k: number; sign: number; which: string };
		if (ans.kind !== 'number') v.push('risposta non numerica');
		if (isSquare(p.n)) v.push('radicando quadrato perfetto');
		if ((lvl === 3) !== (p.sign > 0)) v.push('segno sbagliato per il livello');
		if (![1, 2].includes(p.k)) v.push('precisione non valida');
		if (p.k === 2 && p.n > 50) v.push('radicando troppo grande per il centesimo');
	} else if (lvl === 7) {
		if (ans.kind !== 'expression') v.push('risposta non expression');
	} else v.push(`livello sconosciuto ${lvl}`);
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.level === 3 || sample.level === 4) return approxChoice(sample, rng);
	return opsChoice(sample, rng);
}

export const numeriRealiIrrazionali: Generator = {
	id: ID,
	title: 'Numeri irrazionali e numeri reali',
	levels: {
		1: { label: 'Radici razionali o irrazionali', constraints: ['quattro radici quadrate, una sola razionale (o una sola irrazionale)', 'radicandi naturali, frazioni anche non ridotte, decimali'] },
		2: { label: 'Razionale o irrazionale dal decimale', constraints: ['decimali limitati, periodici (anche con periodo lungo), 22/7, π, decimali costruiti non periodici'] },
		3: { label: 'Approssimazioni di √n', constraints: ['n non quadrato, fino a 99 al decimo e fino a 50 al centesimo', 'per difetto o per eccesso, metà e metà'] },
		4: { label: 'Approssimazioni di −√n', constraints: ['come il livello 3, con il segno meno'] },
		5: { label: 'Confronto tra due numeri reali', constraints: ['quattro disuguaglianze, una sola vera: due radici, radice e intero, radice e decimale, due negativi'] },
		6: { label: 'Mettere in ordine', constraints: ['quattro numeri tra radici, π, frazioni, decimali periodici e negativi', 'distinguibili con quattro decimali'] },
		7: { label: 'Operazioni: razionale o irrazionale', constraints: ['somma, prodotto per il coniugato, prodotto, distributiva, quadrato di binomio, somma di due irrazionali'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample: Sample = { generatorId: ID, level, seed: rng.seed, ...b };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriRealiIrrazionali;
