/**
 * Le cifre significative (physics, first year). Spec: specs/exercises/fis-cifre-significative.md
 *
 * Five levels in the order of the lesson (docs/lezioni/fisica/riscritte/08-fis-cifre-significative.md): counting the
 * significant figures of a measurement, rounding to a number of significant figures, sums and differences (the
 * decimals of the least precise datum), products and quotients (the significant figures of the datum with fewest),
 * exact numbers and calculations in two steps (round only at the end).
 *
 * Here the writing is the answer: $8$ and $8{,}00$ are different options. A number is a string of digits M and the
 * exponent e of its last digit (value M·10^e, M has exactly the significant figures as digits), so the trailing zeros
 * that count are never lost; the arithmetic is on exact bigint rationals, never on floats. A number is written in
 * scientific notation when its last significant figure is left of the units, or is a zero in the units (1,0·10^1, not
 * 10); otherwise in decimal form. The first figure dropped is never a 5 followed only by zeros (no halfway cases).
 * Every level is a four-option choice; `values` is the writing without LaTeX ("8,00 m/s", "4,7e4 m").
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';

export const ID = 'fis-cifre-significative';

// ---------------------------------------------------------------------------
// Exact rationals on bigint

interface Q {
	n: bigint;
	d: bigint;
}

function bgcd(a: bigint, b: bigint): bigint {
	a = a < 0n ? -a : a;
	b = b < 0n ? -b : b;
	while (b) [a, b] = [b, a % b];
	return a;
}

function mkQ(n: bigint, d = 1n): Q {
	if (d === 0n) throw new Error(`${ID}: division by zero`);
	if (d < 0n) {
		n = -n;
		d = -d;
	}
	const g = bgcd(n, d) || 1n;
	return { n: n / g, d: d / g };
}

const qadd = (a: Q, b: Q) => mkQ(a.n * b.d + b.n * a.d, a.d * b.d);
const qsub = (a: Q, b: Q) => mkQ(a.n * b.d - b.n * a.d, a.d * b.d);
const qmul = (a: Q, b: Q) => mkQ(a.n * b.n, a.d * b.d);
const qdiv = (a: Q, b: Q) => mkQ(a.n * b.d, a.d * b.n);
const qcmp = (a: Q, b: Q) => {
	const x = a.n * b.d - b.n * a.d;
	return x > 0n ? 1 : x < 0n ? -1 : 0;
};
const p10 = (k: number) => 10n ** BigInt(k);
const pow10 = (k: number): Q => (k >= 0 ? mkQ(p10(k)) : mkQ(1n, p10(-k)));

// ---------------------------------------------------------------------------
// Written numbers: M·10^e, M with exactly the significant figures as digits

interface Num {
	M: bigint;
	e: number;
}

const val = (x: Num): Q => (x.e >= 0 ? mkQ(x.M * p10(x.e)) : mkQ(x.M, p10(-x.e)));
const sfOf = (x: Num) => x.M.toString().length;
const decOf = (x: Num) => Math.max(0, -x.e);
const sameNum = (a: Num, b: Num) => a.M === b.M && a.e === b.e;

function floorLog10(q: Q): number {
	let k = q.n.toString().length - q.d.toString().length;
	while (qcmp(pow10(k), q) > 0) k--;
	while (qcmp(pow10(k + 1), q) <= 0) k++;
	return k;
}

interface Rounded {
	x: Num;
	/** The part dropped is exactly one half of the last kept unit (a 5 followed only by zeros). */
	half: boolean;
}

/** q (positive) rounded (or truncated) to a multiple of 10^e. */
function roundAt(q: Q, e: number, trunc = false): Rounded {
	const s = qmul(q, pow10(-e));
	const F = s.n / s.d;
	const rem2 = 2n * (s.n - F * s.d);
	return { x: { M: F + (!trunc && rem2 >= s.d ? 1n : 0n), e }, half: rem2 === s.d };
}

/** q rounded (or truncated) to n significant figures, the rule of the 5 on the first figure dropped. */
function roundSig(q: Q, n: number, trunc = false): Rounded {
	const e = floorLog10(q) - n + 1;
	const r = roundAt(q, e, trunc);
	if (r.x.M.toString().length > n) return { x: { M: r.x.M / 10n, e: e + 1 }, half: r.half };
	return r;
}

const roundDec = (q: Q, d: number, trunc = false) => roundAt(q, -d, trunc);

/** Without the trailing zeros, as a calculator shows it. */
function strip(x: Num): Num {
	let { M, e } = x;
	while (M > 0n && M % 10n === 0n) {
		M /= 10n;
		e++;
	}
	return { M, e };
}

/** The calculator's result, with at most six figures. */
const calcOf = (q: Q) => strip(roundSig(q, 6).x);
/** "=" when the calculator's result is exact, otherwise "≈". */
const rel = (q: Q, calc: Num) => (qcmp(val(calc), q) === 0 ? '=' : '\\approx');

/** The last significant figure is left of the units, or a zero in the units. */
function isSci(x: Num): boolean {
	const s = x.M.toString();
	return x.e > 0 || (x.e === 0 && s.length > 1 && s.endsWith('0'));
}

/** Thin spaces between the thousands, from five figures. */
function group(int: string): string {
	if (int.length < 5) return int;
	const parts: string[] = [];
	for (let i = int.length; i > 0; i -= 3) parts.unshift(int.slice(Math.max(0, i - 3), i));
	return parts.join('\\,');
}

interface Writing {
	tex: string;
	plain: string;
}

function sciWrite(x: Num): Writing {
	const s = x.M.toString();
	const k = s.length - 1 + x.e;
	const rest = s.slice(1);
	return {
		tex: `${s[0]}${rest ? `{,}${rest}` : ''} \\cdot 10^{${k}}`,
		plain: `${s[0]}${rest ? `,${rest}` : ''}e${k}`,
	};
}

/** Decimal form, never scientific (a number of the steps, as the calculator shows it). */
function decWrite(x: Num): Writing {
	const s = x.e > 0 ? x.M.toString() + '0'.repeat(x.e) : x.M.toString();
	const d = decOf(x);
	const padded = s.padStart(d + 1, '0');
	const int = padded.slice(0, padded.length - d);
	const frac = padded.slice(padded.length - d);
	return { tex: d ? `${group(int)}{,}${frac}` : group(int), plain: d ? `${int},${frac}` : int };
}

/** The writing of the lesson: scientific notation only when the decimal form would hide the significant figures. */
const write = (x: Num): Writing => (isSci(x) ? sciWrite(x) : decWrite(x));

/** Back from the plain writing ("4,7e4", "0,0046", "46781"). */
function parsePlain(p: string): Num {
	const m = /^(\d+)(?:,(\d+))?(?:e(-?\d+))?$/.exec(p);
	if (!m) throw new Error(`${ID}: not a number "${p}"`);
	const [, int, frac = '', exp] = m;
	const digits = (int + frac).replace(/^0+/, '');
	if (!digits) throw new Error(`${ID}: zero "${p}"`);
	if (exp !== undefined) return { M: BigInt(digits), e: Number(exp) - (int.length + frac.length - 1) };
	return { M: BigInt(digits), e: -frac.length };
}

// ---------------------------------------------------------------------------
// Units, prose and options

interface Unit {
	tex: string;
	uni: string;
	plain: string;
	/** The unit has an exponent: `\ ` before it, and it stays in the formula in the prose. */
	exp: boolean;
}

const un = (tex: string, uni: string, exp = false): Unit => ({ tex, uni, plain: uni, exp });
const UNITS: Record<string, Unit> = {
	g: un('\\text{g}', 'g'),
	kg: un('\\text{kg}', 'kg'),
	m: un('\\text{m}', 'm'),
	cm: un('\\text{cm}', 'cm'),
	mm: un('\\text{mm}', 'mm'),
	s: un('\\text{s}', 's'),
	L: un('\\text{L}', 'L'),
	'm/s': un('\\text{m/s}', 'm/s'),
	'cm/s': un('\\text{cm/s}', 'cm/s'),
	cm2: un('\\text{cm}^2', 'cm^2', true),
	m2: un('\\text{m}^2', 'm^2', true),
	cm3: un('\\text{cm}^3', 'cm^3', true),
	'g/cm3': un('\\text{g/cm}^3', 'g/cm^3', true),
};

/** A number with its unit in a formula: `20{,}0\,\text{cm}`, `7{,}9\ \text{m}^2`. */
const withUnit = (tex: string, unit: string) => `${tex}${UNITS[unit].exp ? '\\ ' : '\\,'}${UNITS[unit].tex}`;
/** The same in the prose: "$20{,}0$ cm", "$7{,}9\ \text{m}^2$". */
const inProse = (tex: string, unit: string) => (UNITS[unit].exp ? `$${withUnit(tex, unit)}$` : `$${tex}$ ${UNITS[unit].uni}`);
const numOpt = (x: Num, unit: string): ChoiceOption => {
	const w = write(x);
	return { latex: withUnit(w.tex, unit), values: [`${w.plain} ${UNITS[unit].plain}`] };
};
const ans = (x: Num, unit: string) => withUnit(write(x).tex, unit);

const t = (s: string) => `\\text{${s}}`;
const WORDS = ['zero', 'una', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto'];
const cifre = (n: number) => (n === 1 ? 'una cifra significativa' : `${WORDS[n]} cifre significative`);
const decimali = (n: number) => (n === 1 ? 'un decimale' : `${WORDS[n]} decimali`);
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const list = (xs: string[]) => (xs.length === 1 ? xs[0] : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`);

/** Four options: the right one and the first three wrong writings that differ from it and from each other. */
function makeChoice(rng: Rng, right: Num, wrong: (Num | null)[], unit: string): ChoiceAnswer | null {
	const opts = [numOpt(right, unit)];
	for (const w of wrong) {
		if (opts.length === 4) break;
		if (!w || w.M <= 0n) continue;
		const o = numOpt(w, unit);
		if (opts.some((p) => p.latex === o.latex)) continue;
		opts.push(o);
	}
	if (opts.length < 4) return null;
	const order = shuffle(rng, [0, 1, 2, 3]);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

/** The last figure one up and one down. */
const ulps = (x: Num): Num[] => [
	{ M: x.M + 1n, e: x.e },
	{ M: x.M - 1n, e: x.e },
	{ M: x.M + 2n, e: x.e },
];

/** A random string of `len` digits, the first not zero. */
function digits(rng: Rng, len: number, opts: { lastNonzero?: boolean; noZero?: boolean } = {}): string {
	let s = String(rng.int(1, 9));
	for (let i = 1; i < len; i++) s += String(opts.noZero || (opts.lastNonzero && i === len - 1) ? rng.int(1, 9) : rng.int(0, 9));
	return s;
}

/** A datum with `sf` significant figures and `I` figures before the comma, written in decimal form. */
function datum(rng: Rng, sf: number, I: number): Num {
	const e = I - sf;
	return { M: BigInt(digits(rng, sf, { lastNonzero: e >= 0 })), e };
}

/** A datum with `d` decimals between lo and hi, its last figure not zero. */
function decDatum(rng: Rng, d: number, lo: number, hi: number): Num {
	const a = Math.ceil(Math.round(lo * 10 ** d * 1000) / 1000);
	const b = Math.floor(Math.round(hi * 10 ** d * 1000) / 1000);
	for (;;) {
		const V = rng.int(a, b);
		if (V % 10 !== 0) return { M: BigInt(V), e: -d };
	}
}

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	choice: ChoiceAnswer;
	params: Record<string, unknown>;
}

/** Tries a builder until it gives a sample (the case is chosen once, outside, so the shares stay). */
function retry<T>(f: () => T | null): T {
	for (let i = 0; i < 5000; i++) {
		const b = f();
		if (b) return b;
	}
	throw new Error(`${ID}: no sample`);
}

// ---------------------------------------------------------------------------
// Level 1: counting

const L1_TYPES = ['nessuno', 'iniziali', 'mezzo', 'finali', 'scientifica'] as const;
type L1Type = (typeof L1_TYPES)[number];
const L1_UNITS = ['g', 'kg', 'm', 'cm', 'mm', 's', 'L'];

function level1(rng: Rng): Built {
	const type: L1Type = rng.pick(L1_TYPES);
	const unit = rng.pick(L1_UNITS);
	let M = '';
	let e = 0;
	if (type === 'nessuno') {
		const len = rng.int(2, 5);
		M = digits(rng, len, { noZero: true });
		e = -rng.int(0, len - 1);
	} else if (type === 'iniziali') {
		const len = rng.int(1, 3);
		M = digits(rng, len, { noZero: true });
		e = -(len + rng.int(1, 3));
	} else if (type === 'mezzo') {
		const len = rng.int(3, 5);
		do {
			M = digits(rng, len, { lastNonzero: true });
		} while (!M.slice(1, -1).includes('0'));
		e = -rng.int(0, len - 1);
	} else if (type === 'finali') {
		const zeros = rng.int(1, 2);
		M = digits(rng, rng.int(1, 3), { lastNonzero: true }) + '0'.repeat(zeros);
		e = -rng.int(zeros, M.length + 2);
	} else {
		M = digits(rng, rng.int(1, 4));
		const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
		e = k - (M.length - 1);
	}
	const x: Num = { M: BigInt(M), e };
	const w = type === 'scientifica' ? sciWrite(x) : decWrite(x);
	const answer = M.length;
	const written = type === 'scientifica' ? M.length + 2 : w.plain.replace(/\D/g, '').length;
	const noTrailing = M.replace(/0+$/, '').length;
	const nonzero = M.replace(/0/g, '').length;
	const pool = [written, noTrailing, nonzero, answer + 1, answer - 1, answer + 2, answer - 2, answer + 3];
	const nums = [answer];
	for (const p of pool) if (nums.length < 4 && p >= 1 && !nums.includes(p)) nums.push(p);
	const sorted = [...nums].sort((a, b) => a - b);
	const choice: ChoiceAnswer = {
		kind: 'choice',
		options: sorted.map((n) => ({ latex: t(String(n)), values: [String(n)] })),
		correct: sorted.indexOf(answer),
	};
	const mant = type === 'scientifica' ? sciWrite(x).tex.split(' \\cdot ')[0] : '';
	const why: Record<L1Type, string[]> = {
		nessuno: [t('Tutte le cifre sono diverse da zero, e sono tutte significative')],
		iniziali: [t('Gli zeri iniziali servono solo a mettere la virgola al suo posto: non contano')],
		mezzo: [t('Gli zeri tra due cifre diverse da zero sono significativi')],
		finali: [
			t('Gli zeri alla fine, dopo la virgola, sono significativi: sono stati misurati'),
			...(val(x).n < val(x).d ? [t('Gli zeri iniziali invece non contano')] : []),
		],
		scientifica: [`${t('In notazione scientifica si contano le cifre del primo fattore, ')} ${mant}`],
	};
	return {
		prompt: 'Conta le cifre significative.',
		problem: textBlock(`Quante cifre significative ha la misura ${inProse(w.tex, unit)}?`),
		solution: t(cifre(answer)),
		steps: [...why[type], `${withUnit(w.tex, unit)} ${t(' ha ')} ${t(cifre(answer))}`],
		choice,
		params: { case: type, unit, written: w.plain, M, e, answer },
	};
}

// ---------------------------------------------------------------------------
// Level 2: rounding

const L2_UNITS = ['g', 'kg', 'm', 'cm', 's', 'L'];
type L2Case = 'decimale' | 'zeri' | 'scientifica' | 'passi';

/** Rounding one figure at a time from the end: the mistake of the lesson. */
function stepwise(x: Num, n: number): Num {
	let cur = x;
	while (sfOf(cur) > n) cur = roundSig(val(cur), sfOf(cur) - 1).x;
	return cur;
}

function l2Case(x: Num, n: number): L2Case {
	const D = x.M.toString();
	if (D[n] === '4' && D[n + 1] !== undefined && D[n + 1] >= '5') return 'passi';
	const r = roundSig(val(x), n).x;
	if (r.e > 0) return 'scientifica';
	return r.M % 10n === 0n ? 'zeri' : 'decimale';
}

function tryLevel2(rng: Rng, c: L2Case): Built | null {
	let s: number, n: number, I: number;
	let D: string;
	if (c === 'decimale') {
		s = rng.int(4, 7);
		n = rng.int(1, Math.min(4, s - 1));
		I = rng.int(-2, n);
		D = digits(rng, s, { lastNonzero: true });
	} else if (c === 'zeri') {
		s = rng.int(4, 7);
		n = rng.int(2, Math.min(4, s - 1));
		I = rng.int(-2, n);
		D = digits(rng, s, { lastNonzero: true });
		const head = D.slice(0, n - 1);
		if (rng.next() < 2 / 3) {
			const nines = n >= 3 && rng.next() < 1 / 3 ? head.slice(0, -1) + '9' : head;
			D = nines + '9' + String(rng.int(5, 9)) + D.slice(n + 1);
		} else D = head + '0' + String(rng.int(0, 3)) + D.slice(n + 1);
	} else if (c === 'scientifica') {
		s = rng.int(5, 7);
		I = rng.int(4, Math.min(s, 6));
		n = rng.int(1, Math.min(4, I - 1));
		D = digits(rng, s, { lastNonzero: true });
	} else {
		n = rng.int(1, 4);
		s = rng.int(Math.max(4, n + 2), 7);
		I = rng.int(-2, n);
		D = digits(rng, s, { lastNonzero: true });
		const last = D[n - 1] === '0' ? String(rng.int(1, 9)) : D[n - 1];
		D = D.slice(0, n - 1) + last + '4' + String(rng.int(5, 9)) + D.slice(n + 2);
	}
	if (D.endsWith('0') || D.length !== s) return null;
	const x: Num = { M: BigInt(D), e: I - s };
	const q = val(x);
	const r = roundSig(q, n);
	if (r.half || l2Case(x, n) !== c) return null;
	const right = r.x;
	const unit = rng.pick(L2_UNITS);
	const ends0 = right.M % 10n === 0n;
	const wrong: (Num | null)[] = [
		roundSig(q, n, true).x,
		roundDec(q, n).x,
		stepwise(x, n),
		right.e > 0 && !ends0 ? { M: right.M, e: 0 } : null,
		ends0 ? strip(right) : null,
		n >= 2 ? roundSig(q, n - 1).x : null,
		roundSig(q, n + 1).x,
		...ulps(right),
	];
	const choice = makeChoice(rng, right, wrong, unit);
	if (!choice) return null;
	const X = decWrite(x).tex;
	const first = Number(D[n]);
	const steps = [
		`${t(`Si tengono ${cifre(n)} di `)} ${X}${t(': la prima cifra tolta è un ')}${first}`,
		first >= 5 ? `${t('È ')} 5 ${t(" o più: l'ultima cifra che resta aumenta di uno")}` : `${t('È meno di ')} 5${t(": l'ultima cifra che resta non cambia")}`,
	];
	if (c === 'passi') steps.push(t('Conta solo la prima cifra tolta: non si arrotonda a passi'));
	if (right.e > 0) steps.push(t("L'ultima cifra significativa sta a sinistra delle unità: si scrive in notazione scientifica"));
	else if (isSci(right)) steps.push(t('Lo zero delle unità è significativo: si scrive in notazione scientifica'));
	else if (ends0) steps.push(t('Gli zeri finali sono significativi e si scrivono'));
	steps.push(`${withUnit(X, unit)} \\approx ${ans(right, unit)}`);
	return {
		prompt: 'Arrotonda la misura.',
		problem: textBlock(`Arrotonda ${inProse(X, unit)} a ${cifre(n)}.`),
		solution: ans(right, unit),
		steps,
		choice,
		params: { case: c, unit, x: decWrite(x).plain, n, answer: write(right).plain },
	};
}

function level2(rng: Rng): Built {
	const r = rng.next();
	const c: L2Case = r < 0.5 ? 'decimale' : r < 2 / 3 ? 'zeri' : r < 5 / 6 ? 'scientifica' : 'passi';
	return retry(() => tryLevel2(rng, c));
}

// ---------------------------------------------------------------------------
// Level 3: sums and differences

interface SumCtx {
	id: string;
	unit: string;
	lo: number;
	hi: number;
	text: (xs: string[]) => string;
}

const SUMS: SumCtx[] = [
	{
		id: 'asticelle',
		unit: 'cm',
		lo: 0.1,
		hi: 40,
		text: (xs) => `${cap(WORDS[xs.length])} asticelle, lunghe ${list(xs)}, sono messe in fila una dopo l'altra. Quanto vale la lunghezza della fila?`,
	},
	{
		id: 'bilancia',
		unit: 'g',
		lo: 1,
		hi: 250,
		text: (xs) => `Sul piatto di una bilancia ci sono ${WORDS[xs.length]} oggetti, con le masse di ${list(xs)}. Quanto vale la massa totale?`,
	},
	{
		id: 'ciclista',
		unit: 's',
		lo: 1,
		hi: 90,
		text: (xs) => `Un ciclista percorre ${WORDS[xs.length]} tratti di una pista in ${list(xs)}. Quanto vale il tempo totale?`,
	},
];

interface DiffCtx {
	id: string;
	unit: string;
	/** The prose, with the larger datum `big` and the smaller `small`. */
	text: (big: string, small: string) => string;
	/** The larger datum is written first. */
	bigFirst: boolean;
}

const DIFFS: DiffCtx[] = [
	{
		id: 'sacchetto',
		unit: 'g',
		bigFirst: true,
		text: (big, small) => `Un sacchetto pieno ha la massa di ${big}. Si toglie un oggetto e la massa diventa ${small}. Quanto vale la massa dell'oggetto tolto?`,
	},
	{
		id: 'molla',
		unit: 'cm',
		bigFirst: false,
		text: (big, small) => `Una molla a riposo è lunga ${small}; con un peso appeso è lunga ${big}. Quanto vale l'allungamento della molla?`,
	},
	{
		id: 'becher',
		unit: 'g',
		bigFirst: false,
		text: (big, small) => `Un becher vuoto ha la massa di ${small}; con dentro un po' d'acqua ha la massa di ${big}. Quanto vale la massa dell'acqua?`,
	},
];

type L3Case = 'somma' | 'differenza' | 'vicina';

function tryLevel3(rng: Rng, c: L3Case): Built | null {
	let data: Num[];
	let unit: string, text: string, ctxId: string;
	let exact: Q;
	if (c === 'somma') {
		const ctx = rng.pick(SUMS);
		const count = rng.int(2, 3);
		const dm = rng.int(1, 2);
		const decs = [dm, ...Array.from({ length: count - 1 }, () => rng.int(dm + 1, 3))];
		data = shuffle(rng, decs).map((d) => decDatum(rng, d, ctx.lo, ctx.hi));
		exact = data.map(val).reduce(qadd);
		unit = ctx.unit;
		ctxId = ctx.id;
		text = ctx.text(data.map((x) => inProse(decWrite(x).tex, unit)));
	} else {
		const ctx = rng.pick(DIFFS);
		const dm = rng.int(1, 2);
		const dM = rng.int(dm + 1, 3);
		const [dBig, dSmall] = rng.next() < 0.5 ? [dm, dM] : [dM, dm];
		let big: Num, small: Num;
		if (c === 'differenza') {
			big = decDatum(rng, dBig, 20, 250);
			const B = Number(big.M) / 10 ** dBig;
			small = decDatum(rng, dSmall, 1, B / 2);
		} else {
			big = decDatum(rng, dBig, 12, 99);
			const B = Number(big.M) / 10 ** dBig;
			small = decDatum(rng, dSmall, B - 19 / 10 ** dm, B - 1 / 10 ** dm);
		}
		exact = qsub(val(big), val(small));
		if (exact.n <= 0n) return null;
		data = ctx.bigFirst ? [big, small] : [small, big];
		unit = ctx.unit;
		ctxId = ctx.id;
		text = ctx.text(inProse(decWrite(big).tex, unit), inProse(decWrite(small).tex, unit));
	}
	const dm = Math.min(...data.map(decOf));
	if (data.filter((x) => decOf(x) === dm).length !== 1) return null;
	const r = roundDec(exact, dm);
	if (r.half || r.x.M <= 0n) return null;
	const right = r.x;
	const minSf = Math.min(...data.map(sfOf));
	if (c === 'vicina' && !(sfOf(right) <= 2 && minSf >= 3)) return null;
	if (c === 'differenza' && sfOf(right) < 3) return null;
	const calc = calcOf(exact);
	const wrong: (Num | null)[] = [isSci(calc) ? null : calc, roundSig(exact, minSf).x, roundDec(exact, dm + 1).x, ...ulps(right)];
	const choice = makeChoice(rng, right, wrong, unit);
	if (!choice) return null;
	const least = data.find((x) => decOf(x) === dm)!;
	const op = c === 'somma' ? ' + ' : ' - ';
	const shown = c === 'somma' || qcmp(val(data[0]), val(data[1])) > 0 ? data : [data[1], data[0]];
	const steps = [
		`${shown.map((x) => decWrite(x).tex).join(op)} = ${decWrite(strip(roundDec(exact, 3).x)).tex}`,
		`${t('Il dato con meno decimali è ')} ${withUnit(decWrite(least).tex, unit)}${t(`, con ${decimali(dm)}`)}`,
		`${t(`Il risultato si arrotonda a ${decimali(dm)}: `)} ${ans(right, unit)}`,
	];
	if (c === 'vicina') steps.push(t(`I dati hanno almeno ${cifre(minSf)}, il risultato ${sfOf(right) === 1 ? 'solo una' : 'solo due'}`));
	return {
		prompt: 'Calcola il risultato con le cifre giuste.',
		problem: textBlock(text),
		solution: ans(right, unit),
		steps,
		choice,
		params: { case: c, ctx: ctxId, unit, data: data.map((x) => decWrite(x).plain), op: c === 'somma' ? 'somma' : 'differenza', answer: write(right).plain },
	};
}

function level3(rng: Rng): Built {
	const r = rng.next();
	const c: L3Case = r < 0.5 ? 'somma' : r < 0.75 ? 'differenza' : 'vicina';
	return retry(() => tryLevel3(rng, c));
}

// ---------------------------------------------------------------------------
// Level 4: products and quotients

interface Qty {
	unit: string;
	I: [number, number];
}

interface ProdCtx {
	id: string;
	op: 'mul' | 'div';
	a: Qty;
	b: Qty;
	res: string;
	text: (a: string, b: string) => string;
	sym: string;
	/** Plausible results, in the unit of the result. */
	range: [number, number];
}

const PRODS: ProdCtx[] = [
	{ id: 'rettangolo', op: 'mul', a: { unit: 'cm', I: [1, 2] }, b: { unit: 'cm', I: [1, 2] }, res: 'cm2', sym: 'A', range: [1, 1e4], text: (a, b) => `Un rettangolo ha i lati di ${a} e di ${b}. Quanto vale l'area?` },
	{ id: 'terreno', op: 'mul', a: { unit: 'm', I: [2, 3] }, b: { unit: 'm', I: [1, 3] }, res: 'm2', sym: 'A', range: [10, 1e6], text: (a, b) => `Un terreno rettangolare ha i lati di ${a} e di ${b}. Quanto vale l'area?` },
	{ id: 'corridore', op: 'div', a: { unit: 'm', I: [2, 3] }, b: { unit: 's', I: [1, 2] }, res: 'm/s', sym: 'v', range: [2, 12], text: (a, b) => `Un corridore percorre ${a} in ${b}. Quanto vale la velocità?` },
	{ id: 'carrello', op: 'div', a: { unit: 'cm', I: [1, 3] }, b: { unit: 's', I: [0, 1] }, res: 'cm/s', sym: 'v', range: [1, 300], text: (a, b) => `Un carrello percorre ${a} in ${b}. Quanto vale la velocità?` },
	{ id: 'densita', op: 'div', a: { unit: 'g', I: [1, 3] }, b: { unit: 'cm3', I: [1, 2] }, res: 'g/cm3', sym: '\\rho', range: [0.5, 20], text: (a, b) => `Un oggetto ha la massa di ${a} e il volume di ${b}. Quanto vale la densità?` },
];

type L4Case = 'normale' | 'zeri' | 'scientifica';

const writeCase = (x: Num): L4Case => (isSci(x) ? 'scientifica' : x.M % 10n === 0n ? 'zeri' : 'normale');

function qtyDatum(rng: Rng, q: Qty, sf: number): Num | null {
	const I = rng.int(q.I[0], q.I[1]);
	if (I > sf || I < 0) return null;
	const x = datum(rng, sf, I);
	return x.M > 0n && (I > 0 || x.e < 0) ? x : null;
}

function tryLevel4(rng: Rng, c: L4Case): Built | null {
	const ctx = rng.pick(PRODS);
	const [sa, sb] = shuffle(rng, [2, 3, 4]).slice(0, 2);
	const a = qtyDatum(rng, ctx.a, sa);
	const b = qtyDatum(rng, ctx.b, sb);
	if (!a || !b) return null;
	const exact = ctx.op === 'mul' ? qmul(val(a), val(b)) : qdiv(val(a), val(b));
	if (qcmp(exact, mkQ(BigInt(Math.round(ctx.range[0] * 10)), 10n)) < 0 || qcmp(exact, mkQ(BigInt(ctx.range[1]))) > 0) return null;
	const n = Math.min(sa, sb);
	const r = roundSig(exact, n);
	if (r.half || writeCase(r.x) !== c) return null;
	const right = r.x;
	const calc = calcOf(exact);
	const dm = Math.min(decOf(a), decOf(b));
	const wrong: (Num | null)[] = [isSci(calc) ? null : calc, roundDec(exact, dm).x, roundSig(exact, n + 1).x, roundSig(exact, n, true).x, ...ulps(right)];
	const choice = makeChoice(rng, right, wrong, ctx.res);
	if (!choice) return null;
	const A = decWrite(a).tex, B = decWrite(b).tex;
	const least = sa < sb ? withUnit(A, ctx.a.unit) : withUnit(B, ctx.b.unit);
	const steps = [
		`${ctx.sym} = ${A} ${ctx.op === 'mul' ? '\\cdot' : ':'} ${B} ${rel(exact, calc)} ${decWrite(calc).tex}`,
		`${t('Il dato con meno cifre significative è ')} ${least}${t(`, con ${WORDS[n]}`)}`,
		`${t(`Il risultato ha ${cifre(n)}: `)} ${ctx.sym} = ${ans(right, ctx.res)}`,
	];
	if (c === 'zeri') steps.push(t('Gli zeri finali sono significativi e si scrivono'));
	if (c === 'scientifica') steps.push(t('Scritto per intero, il risultato non direbbe quante cifre sono significative: si usa la notazione scientifica'));
	return {
		prompt: 'Calcola il risultato con le cifre giuste.',
		problem: textBlock(ctx.text(inProse(A, ctx.a.unit), inProse(B, ctx.b.unit))),
		solution: `${ctx.sym} = ${ans(right, ctx.res)}`,
		steps,
		choice,
		params: { case: c, ctx: ctx.id, op: ctx.op, a: decWrite(a).plain, b: decWrite(b).plain, unit: ctx.res, answer: write(right).plain },
	};
}

function level4(rng: Rng): Built {
	const r = rng.next();
	const c: L4Case = r < 0.25 ? 'zeri' : r < 0.25 + 1 / 6 ? 'scientifica' : 'normale';
	return retry(() => tryLevel4(rng, c));
}

// ---------------------------------------------------------------------------
// Level 5: exact numbers and two steps

type L5Case = 'oggetti' | 'perimetro' | 'media' | 'passaggi';

const OBJECTS = [
	{ id: 'biglie', unit: 'g', I: [1, 2] as [number, number], text: (n: string, m: string) => `Un sacchetto contiene ${n} biglie uguali, ognuna con la massa di ${m}. Quanto vale la massa delle biglie?` },
	{ id: 'monete', unit: 'g', I: [1, 1] as [number, number], text: (n: string, m: string) => `Una pila è fatta di ${n} monete uguali, ognuna con la massa di ${m}. Quanto vale la massa della pila?` },
	{ id: 'piastrelle', unit: 'cm', I: [1, 2] as [number, number], text: (n: string, m: string) => `In una fila ci sono ${n} piastrelle uguali, ognuna lunga ${m}. Quanto vale la lunghezza della fila?` },
];

const POLYGONS: [number, string][] = [
	[3, 'un triangolo equilatero'],
	[4, 'un quadrato'],
	[5, 'un pentagono regolare'],
	[6, 'un esagono regolare'],
	[8, 'un ottagono regolare'],
];

const MEANS = [
	{ id: 'pendolo', unit: 's', d: 2, lo: 1.2, hi: 2.3, what: 'del periodo di un pendolo' },
	{ id: 'caduta', unit: 's', d: 2, lo: 1.0, hi: 2.2, what: 'del tempo di caduta di una pallina' },
	{ id: 'matita', unit: 'cm', d: 1, lo: 12, hi: 22, what: 'della lunghezza di una matita' },
	{ id: 'sasso', unit: 'g', d: 1, lo: 110, hi: 230, what: 'della massa di un sasso' },
];

/** The significant figures a student reads in a counting number (the zeros at the end do not count). */
const countSf = (k: number) => String(k).replace(/0+$/, '').length;

function tryLevel5(rng: Rng, c: L5Case): Built | null {
	let right: Num, unit: string, text: string, exact: Q;
	let wrong: (Num | null)[];
	let steps: string[];
	let sym = '';
	let params: Record<string, unknown>;
	if (c === 'oggetti' || c === 'perimetro') {
		let k: number, x: Num | null, what: string;
		if (c === 'oggetti') {
			const ctx = rng.pick(OBJECTS);
			k = rng.int(6, 40);
			x = qtyDatum(rng, { unit: ctx.unit, I: ctx.I }, rng.int(2, 4));
			if (!x) return null;
			unit = ctx.unit;
			text = ctx.text(`$${k}$`, inProse(decWrite(x).tex, unit));
			what = ctx.id;
			sym = unit === 'g' ? 'm' : 'L';
		} else {
			const [sides, name] = rng.pick(POLYGONS);
			k = sides;
			x = qtyDatum(rng, { unit: 'cm', I: [0, 2] }, rng.int(2, 4));
			if (!x) return null;
			unit = 'cm';
			text = `Quanto vale il perimetro di ${name} con il lato di ${inProse(decWrite(x).tex, unit)}?`;
			what = String(sides);
			sym = 'P';
		}
		exact = qmul(mkQ(BigInt(k)), val(x));
		const n = sfOf(x);
		const r = roundSig(exact, n);
		if (r.half) return null;
		right = r.x;
		const calc = calcOf(exact);
		wrong = [roundSig(exact, Math.min(n, countSf(k))).x, isSci(calc) ? null : calc, roundSig(exact, n + 1).x, n >= 2 ? roundSig(exact, n - 1).x : null, ...ulps(right)];
		steps = [
			`${sym} = ${k} \\cdot ${decWrite(x).tex} = ${decWrite(strip(roundSig(exact, 12).x)).tex}`,
			`${t(`Il numero ${k} conta ${c === 'oggetti' ? 'gli oggetti' : 'i lati'}: è esatto e non limita il risultato`)}`,
			`${t(`Il risultato ha le cifre significative di `)} ${withUnit(decWrite(x).tex, unit)}${t(`, ${WORDS[n]}: `)} ${ans(right, unit)}`,
		];
		params = { case: c, ctx: what, k, x: decWrite(x).plain, unit, answer: write(right).plain };
	} else if (c === 'media') {
		const ctx = rng.pick(MEANS);
		const N = rng.int(3, 4);
		const center = decDatum(rng, ctx.d, ctx.lo, ctx.hi);
		const data: Num[] = Array.from({ length: N }, () => ({ M: center.M + BigInt(rng.int(-6, 6)), e: center.e }));
		const S = data.map(val).reduce(qadd);
		exact = qdiv(S, mkQ(BigInt(N)));
		const Sn = roundDec(S, ctx.d).x;
		const n = sfOf(Sn);
		const r = roundSig(exact, n);
		if (r.half || decOf(r.x) !== ctx.d || isSci(r.x)) return null;
		if (new Set(data.map((x) => x.M)).size < 2) return null;
		right = r.x;
		unit = ctx.unit;
		const calc = calcOf(exact);
		text = `${cap(WORDS[N])} misure ${ctx.what} danno ${list(data.map((x) => inProse(decWrite(x).tex, unit)))}. Quanto vale il valore medio?`;
		wrong = [roundSig(exact, 1).x, isSci(calc) ? null : calc, roundSig(exact, n + 1).x, n >= 2 ? roundSig(exact, n - 1).x : null, ...ulps(right)];
		sym = '\\bar{x}';
		steps = [
			`${data.map((x) => decWrite(x).tex).join(' + ')} = ${decWrite(Sn).tex}`,
			`${t(`La somma ha ${decimali(ctx.d)}, come i dati: ${WORDS[n]} cifre significative`)}`,
			`${sym} = ${decWrite(Sn).tex} : ${N} ${rel(exact, calc)} ${decWrite(calc).tex}`,
			`${t(`Il ${N} è il numero delle misure, esatto: il valore medio ha ${cifre(n)}, `)} ${ans(right, unit)}`,
		];
		params = { case: c, ctx: ctx.id, data: data.map((x) => decWrite(x).plain), unit, answer: write(right).plain };
	} else {
		const lastra = rng.next() < 0.5;
		const da = rng.int(1, 3);
		let db = rng.int(1, 3);
		if (db === da) db = da === 3 ? 1 : da + 1;
		const a = decDatum(rng, da, 0.2, 3), b = decDatum(rng, db, 0.2, 3);
		const w = qtyDatum(rng, { unit: lastra ? 'm' : 's', I: lastra ? [0, 1] : [1, 1] }, rng.int(2, 4));
		if (!w) return null;
		const L = qadd(val(a), val(b));
		const dm = Math.min(da, db);
		const Lr = roundDec(L, dm);
		if (Lr.half) return null;
		const n = Math.min(sfOf(Lr.x), sfOf(w));
		const op = lastra ? qmul : qdiv;
		exact = op(L, val(w));
		const r = roundSig(exact, n);
		const early = roundSig(op(val(Lr.x), val(w)), n);
		if (r.half || early.half || sameNum(r.x, early.x)) return null;
		right = r.x;
		unit = lastra ? 'm2' : 'm/s';
		const A = inProse(decWrite(a).tex, 'm'), B = inProse(decWrite(b).tex, 'm'), W = inProse(decWrite(w).tex, lastra ? 'm' : 's');
		text = lastra
			? `Una lastra rettangolare è formata da due pezzi accostati, lunghi ${A} e ${B}, larghi entrambi ${W}. Quanto vale l'area della lastra?`
			: `Un carrello percorre due tratti, lunghi ${A} e ${B}, in ${W} in tutto. Quanto vale la velocità media?`;
		const calc = calcOf(exact);
		wrong = [early.x, isSci(calc) ? null : calc, roundSig(exact, n + 1).x, n >= 2 ? roundSig(exact, n - 1).x : null, ...ulps(right)];
		sym = lastra ? 'A' : 'v';
		const Lx = decWrite(strip(roundDec(L, 3).x)).tex;
		steps = [
			`${decWrite(a).tex} + ${decWrite(b).tex} = ${Lx} ${t(`, da scrivere con ${decimali(dm)}: `)} ${withUnit(decWrite(Lr.x).tex, 'm')}${t(`, ${cifre(sfOf(Lr.x))}`)}`,
			`${t('Nel passaggio successivo si usa ')} ${Lx}${t(', senza arrotondare')}`,
			`${sym} = ${Lx} ${lastra ? '\\cdot' : ':'} ${decWrite(w).tex} ${rel(exact, calc)} ${decWrite(calc).tex}`,
			`${t(`Il risultato ha ${cifre(n)}: `)} ${sym} = ${ans(right, unit)}`,
			`${t('Con la lunghezza già arrotondata verrebbe ')} ${ans(early.x, unit)}${t(', con l\'ultima cifra sbagliata')}`,
		];
		params = { case: c, ctx: lastra ? 'lastra' : 'carrello', a: decWrite(a).plain, b: decWrite(b).plain, w: decWrite(w).plain, unit, early: write(early.x).plain, answer: write(right).plain };
	}
	const choice = makeChoice(rng, right, wrong, unit);
	if (!choice) return null;
	return {
		prompt: 'Calcola il risultato con le cifre giuste.',
		problem: textBlock(text),
		solution: `${sym} = ${ans(right, unit)}`,
		steps,
		choice,
		params,
	};
}

function level5(rng: Rng): Built {
	const c = rng.pick<L5Case>(['oggetti', 'perimetro', 'media', 'passaggi']);
	return retry(() => tryLevel5(rng, c));
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 50; attempt++) {
		const b = make(rng);
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: b.prompt,
			problem: b.problem,
			solution: b.solution,
			steps: b.steps,
			answer: b.choice,
			params: b.params,
		};
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

/** The right answer again from the data in params, with the rules of the lesson. */
function recompute(level: number, p: Record<string, unknown>): { right: Num; half: boolean } | null {
	const P = (k: string) => parsePlain(String(p[k]));
	if (level === 2) {
		const r = roundSig(val(P('x')), Number(p.n));
		return { right: r.x, half: r.half };
	}
	if (level === 3) {
		const data = (p.data as string[]).map(parsePlain);
		const dm = Math.min(...data.map(decOf));
		const vals = data.map(val);
		const exact = p.op === 'somma' ? vals.reduce(qadd) : qcmp(vals[0], vals[1]) > 0 ? qsub(vals[0], vals[1]) : qsub(vals[1], vals[0]);
		const r = roundDec(exact, dm);
		return { right: r.x, half: r.half };
	}
	if (level === 4) {
		const a = P('a'), b = P('b');
		const r = roundSig(p.op === 'mul' ? qmul(val(a), val(b)) : qdiv(val(a), val(b)), Math.min(sfOf(a), sfOf(b)));
		return { right: r.x, half: r.half };
	}
	if (level === 5) {
		if (p.case === 'oggetti' || p.case === 'perimetro') {
			const x = P('x');
			const r = roundSig(qmul(mkQ(BigInt(Number(p.k))), val(x)), sfOf(x));
			return { right: r.x, half: r.half };
		}
		if (p.case === 'media') {
			const data = (p.data as string[]).map(parsePlain);
			const S = data.map(val).reduce(qadd);
			const n = sfOf(roundDec(S, decOf(data[0])).x);
			const r = roundSig(qdiv(S, mkQ(BigInt(data.length))), n);
			return { right: r.x, half: r.half };
		}
		const a = P('a'), b = P('b'), w = P('w');
		const L = qadd(val(a), val(b));
		const Lr = roundDec(L, Math.min(decOf(a), decOf(b)));
		const n = Math.min(sfOf(Lr.x), sfOf(w));
		const r = roundSig(p.ctx === 'lastra' ? qmul(L, val(w)) : qdiv(L, val(w)), n);
		return { right: r.x, half: r.half || Lr.half };
	}
	return null;
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const text = [sample.problem, sample.solution, ...sample.steps].join(' ');
	if (!sample.steps.length) v.push('nessun passaggio');
	if (/—|piuttosto che/.test(text)) v.push('parole vietate');
	if (sample.answer.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	const ch = sample.answer;
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni ripetute');
	if (new Set(ch.options.map((o) => o.values[0])).size !== ch.options.length) v.push('scritture ripetute');
	if (ch.correct < 0 || ch.correct >= ch.options.length) return [...v, 'opzione giusta fuori posto'];
	const p = sample.params;
	if (sample.level === 1) {
		const a = Number(p.answer);
		if (!(a >= 1 && a <= 5)) v.push('risposta fuori da 1-5');
		if (ch.options[ch.correct].values[0] !== String(a)) v.push("l'opzione giusta non è la risposta");
		if (/^\d*[1-9]0+$/.test(String(p.written))) v.push('intero con zeri finali');
		return v;
	}
	const unit = String(p.unit);
	for (const o of ch.options) {
		const [num, u] = o.values[0].split(' ');
		if (u !== UNITS[unit].plain) v.push(`unità sbagliata in ${o.values[0]}`);
		const x = parsePlain(num);
		if (write(x).plain !== num || numOpt(x, unit).latex !== o.latex) v.push(`opzione non scritta come la lezione: ${o.latex}`);
	}
	const re = recompute(sample.level, p);
	if (!re) return [...v, 'livello sconosciuto'];
	if (re.half) v.push('caso a metà');
	if (write(re.right).plain !== p.answer || ch.options[ch.correct].values[0] !== `${p.answer} ${UNITS[unit].plain}`) v.push("l'opzione giusta non è la risposta");
	if (sample.level === 2) {
		const s = String(p.x).replace(/\D/g, '').replace(/^0+/, '').length;
		if (s < 4 || s > 7 || Number(p.n) < 1 || Number(p.n) > 4 || Number(p.n) >= s) v.push('cifre fuori dai limiti');
		if (l2Case(parsePlain(String(p.x)), Number(p.n)) !== p.case) v.push('caso sbagliato');
	}
	if (sample.level === 5 && p.case === 'passaggi' && !ch.options.some((o) => o.values[0] === `${p.early} ${UNITS[unit].plain}`)) v.push("manca l'arrotondamento troppo presto");
	return v;
}

export const fisCifreSignificative: Generator = {
	id: ID,
	title: 'Le cifre significative',
	levels: {
		1: {
			label: 'Contare le cifre',
			constraints: ['una misura: nessuno zero, zeri iniziali, zeri in mezzo, zeri finali dopo la virgola, notazione scientifica', 'mai un intero con zeri finali; risposta da 1 a 5'],
		},
		2: {
			label: 'Arrotondare',
			constraints: ['da quattro a sette cifre, arrotondate a una, due, tre o quattro', 'numeri decimali, zeri finali da scrivere, notazione scientifica, arrotondamento a passi'],
		},
		3: {
			label: 'Somme e differenze',
			constraints: ['due o tre misure con decimali diversi; il risultato ha i decimali del dato che ne ha meno', 'una volta su quattro una differenza di valori vicini'],
		},
		4: {
			label: 'Prodotti e quozienti',
			constraints: ['area, velocità o densità; il risultato ha le cifre significative del dato che ne ha meno', 'zeri finali da scrivere, notazione scientifica'],
		},
		5: {
			label: 'Numeri esatti e più passaggi',
			constraints: ['oggetti uguali, perimetro di un poligono regolare, valore medio: il numero esatto non limita', 'somma e poi prodotto o quoziente, arrotondando solo alla fine'],
		},
	},
	generate,
	check,
};

export default fisCifreSignificative;
