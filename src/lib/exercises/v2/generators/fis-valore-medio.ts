/**
 * Valore medio e incertezza di una serie di misure. Spec: specs/exercises/fis-valore-medio.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/06-fis-valore-medio.md), all multiple choice with four
 * options: the mean; the half-range (semidispersione); the result written and rounded; the case in which the
 * sensitivity of the instrument is the uncertainty; a series with one wrong measure to discard; three results to
 * compare (compatible measures).
 *
 * Arithmetic is exact: the measures are integers in the unit of their last decimal (hundredths of a second, tenths
 * of a gram), means and half-ranges are Rationals, and rounding goes through `roundAt` (round half up). At levels 3,
 * 4 and 5 the answer never rounds at exactly half; a distractor that would is left out.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { lines, shuffle, textBlock } from '../insiemi';
import { q, type Rational } from '../rational';
import { BANNED, choose, dec, decimals, pow10 } from '../fis-grandezze';

export const ID = 'fis-valore-medio';

// ---------------------------------------------------------------------------
// Contexts: each with its instrument, sensitivity and decimals of the data

type CtxKey = 'pendolo' | 'caduta' | 'diametro' | 'massa' | 'temperatura' | 'lunghezza';

interface Ctx {
	key: CtxKey;
	/** Decimals of the data; values below are integers in units of 10^-d. */
	d: number;
	/** Sensitivity, in units of 10^-d. */
	S: number;
	lo: number;
	hi: number;
	/** Largest half-range at levels 3 and 4. */
	maxDelta: number;
	unit: string;
	plain: string;
	sym: string;
	what: string;
	same: string;
	tool: string;
}

const CTX: Ctx[] = [
	{ key: 'pendolo', d: 2, S: 1, lo: 800, hi: 2000, maxDelta: 25, unit: '\\text{s}', plain: 's', sym: 't', what: 'il tempo di $10$ oscillazioni di un pendolo', same: 'il tempo di $10$ oscillazioni dello stesso pendolo', tool: 'un cronometro' },
	{ key: 'caduta', d: 2, S: 1, lo: 40, hi: 90, maxDelta: 15, unit: '\\text{s}', plain: 's', sym: 't', what: 'il tempo di caduta di una pallina', same: 'il tempo di caduta della stessa pallina dalla stessa altezza', tool: 'un cronometro' },
	{ key: 'diametro', d: 2, S: 5, lo: 1000, hi: 4000, maxDelta: 25, unit: '\\text{mm}', plain: 'mm', sym: 'd', what: 'il diametro di un tubo', same: 'il diametro dello stesso tubo', tool: 'un calibro' },
	{ key: 'massa', d: 1, S: 1, lo: 200, hi: 3000, maxDelta: 25, unit: '\\text{g}', plain: 'g', sym: 'm', what: 'la massa di un sasso', same: 'la massa dello stesso sasso', tool: 'una bilancia' },
	{ key: 'temperatura', d: 1, S: 1, lo: 150, hi: 800, maxDelta: 25, unit: '{}^\\circ\\text{C}', plain: '°C', sym: 'T', what: 'la temperatura di un liquido', same: 'la temperatura dello stesso liquido', tool: 'un termometro' },
	{ key: 'lunghezza', d: 1, S: 1, lo: 600, hi: 1500, maxDelta: 25, unit: '\\text{cm}', plain: 'cm', sym: 'l', what: 'la lunghezza di un banco', same: 'la lunghezza dello stesso banco', tool: 'un metro a nastro' },
];
const ctxOf = (key: string): Ctx => CTX.find((c) => c.key === key)!;

const COUNT = ['', '', '', '', 'quattro', 'cinque', 'sei'];
const ORDINAL = ['prima', 'seconda', 'terza', 'quarta', 'quinta', 'sesta'];
const POSITION: Record<number, string> = { [-3]: 'ai millesimi', [-2]: 'ai centesimi', [-1]: 'ai decimi', 0: 'alle unità' };

// ---------------------------------------------------------------------------
// Exact numbers

const val = (c: Ctx, v: number): Rational => q(v, 10 ** c.d);
const sens = (c: Ctx): Rational => val(c, c.S);

function floorR(r: Rational): number {
	if (r.num < 0) throw new Error('floorR: negative');
	return (r.num - (r.num % r.den)) / r.den;
}

/** r rounded to a multiple of 10^p, half up; `half` when the part taken away is exactly 5 followed by zeros. */
export function roundAt(r: Rational, p: number): { v: Rational; half: boolean } {
	const x = r.div(pow10(p));
	const f = floorR(x);
	const frac = x.sub(q(f));
	const c = frac.compare(q(1, 2));
	return { v: q(f + (c >= 0 ? 1 : 0)).mul(pow10(p)), half: c === 0 };
}

const truncAt = (r: Rational, p: number): Rational => q(floorR(r.div(pow10(p)))).mul(pow10(p));

/** Exponent of the first significant digit of r > 0. */
export function sigPos(r: Rational): number {
	let p = 0;
	while (pow10(p + 1).compare(r) <= 0) p++;
	while (pow10(p).compare(r) > 0) p--;
	return p;
}

/** Decimals needed to write r, at least `min`; Infinity if r is not a terminating decimal. */
const digits = (r: Rational, min: number): number => Math.max(min, decimals(r));

// ---------------------------------------------------------------------------
// Results (x̄ ± Δx) and their writing

interface Res {
	m: Rational;
	md: number;
	D: Rational;
	Dd: number;
}

const key = (r: Res): string => `${r.m}|${r.D}`;
const plainNum = (s: string): string => s.replace('{,}', ',');
const resTex = (c: Ctx, r: Res): string => `(${dec(r.m, r.md)} \\pm ${dec(r.D, r.Dd)})\\,${c.unit}`;
const resPlain = (c: Ctx, r: Res): string => `${plainNum(dec(r.m, r.md))} ± ${plainNum(dec(r.D, r.Dd))} ${c.plain}`;
const resOpt = (c: Ctx, r: Res): ChoiceOption => ({ latex: resTex(c, r), values: [resPlain(c, r)] });

/** The result as the lesson writes it: Δ to one significant figure, the mean at the same position. Null if a rounding falls at half, Δ carries to a new position, or Δ is 10 or more units. */
export function result(mean: Rational, delta: Rational): Res | null {
	const p = sigPos(delta);
	const rd = roundAt(delta, p);
	const rm = roundAt(mean, p);
	if (rd.half || rm.half || rd.v.compare(pow10(p + 1)) >= 0 || p > 0) return null;
	const dd = Math.max(0, -p);
	return { m: rm.v, md: dd, D: rd.v, Dd: dd };
}

// ---------------------------------------------------------------------------
// Series of measures

interface Stats {
	n: number;
	sum: Rational;
	mean: Rational;
	max: Rational;
	min: Rational;
	range: Rational;
	semi: Rational;
}

function stats(c: Ctx, ms: readonly number[]): Stats {
	const sum = ms.reduce((a, b) => a + b, 0);
	const max = Math.max(...ms);
	const min = Math.min(...ms);
	return {
		n: ms.length,
		sum: val(c, sum),
		mean: val(c, sum).div(q(ms.length)),
		max: val(c, max),
		min: val(c, min),
		range: val(c, max - min),
		semi: val(c, max - min).div(q(2)),
	};
}

/** n measures with range R (both in units of 10^-d, R a multiple of S): the extremes first, then the others between them, then shuffled. */
function series(rng: Rng, c: Ctx, n: number, R: number): number[] {
	const low = c.S * rng.int(Math.ceil(c.lo / c.S), Math.floor((c.hi - R) / c.S));
	const devs = [0, R, ...Array.from({ length: n - 2 }, () => c.S * rng.int(0, R / c.S))];
	return shuffle(rng, devs).map((e) => low + e);
}

/** The mean has at most one decimal more than the data. */
const meanShort = (ms: readonly number[]): boolean => (ms.reduce((a, b) => a + b, 0) * 10) % ms.length === 0;

// ---------------------------------------------------------------------------
// Writing

const num = (c: Ctx, r: Rational, min = c.d): string => dec(r, digits(r, min));
const inl = (c: Ctx, r: Rational, min = c.d): string => `$${num(c, r, min)}\\,${c.unit}$`;
const sensProse = (c: Ctx): string => (c.key === 'temperatura' ? `$${dec(sens(c))}\\,${c.unit}$` : `$${dec(sens(c))}$ ${c.plain}`);
const row = (c: Ctx, ms: readonly number[]): string => `${ms.map((v) => dec(val(c, v), c.d)).join(' \\quad ')} \\ ${c.unit}`;

/** The prose lines of textBlock, to put a formula row between two pieces of prose. */
function prose(p: string): string[] {
	const b = textBlock(p);
	const m = /^\\begin\{array\}\{l\} (.*) \\end\{array\}$/s.exec(b);
	return m ? m[1].split(' \\\\ ') : [b];
}

const intro = (c: Ctx, n: number): string => `Un gruppo misura ${COUNT[n]} volte ${c.what}, con ${c.tool} che ha la sensibilità di ${sensProse(c)}:`;

function meanTex(c: Ctx, ms: readonly number[]): string {
	const s = stats(c, ms);
	const head = `\\bar{${c.sym}} = \\dfrac{${ms.map((v) => dec(val(c, v), c.d)).join(' + ')}}{${s.n}} = \\dfrac{${dec(s.sum, c.d)}}{${s.n}}`;
	if (decimals(s.mean) <= c.d + 2) return `${head} = ${num(c, s.mean)}\\,${c.unit}`;
	return `${head} \\approx ${dec(roundAt(s.mean, -(c.d + 2)).v, c.d + 2)}\\,${c.unit}`;
}

function semiTex(c: Ctx, ms: readonly number[]): string {
	const s = stats(c, ms);
	return `\\Delta ${c.sym} = \\dfrac{${dec(s.max, c.d)} - ${dec(s.min, c.d)}}{2} = \\dfrac{${dec(s.range, c.d)}}{2} = ${num(c, s.semi)}\\,${c.unit}`;
}

/** Sentences on rounding Δ (exact `delta`) and the mean to the result `r`. */
function roundingSteps(c: Ctx, delta: Rational, mean: Rational, r: Res): string[] {
	const p = r.Dd === 0 ? 0 : -r.Dd;
	const out: string[] = [];
	out.push(
		delta.equals(r.D)
			? `L'incertezza ha già una sola cifra significativa, ${POSITION[p]}.`
			: `Con una sola cifra significativa l'incertezza ${inl(c, delta)} diventa ${inl(c, r.D, 0)}, ${POSITION[p]}.`,
	);
	out.push(
		mean.equals(r.m)
			? `Anche il valore medio si scrive fino ${POSITION[p]}: ${inl(c, r.m, r.md)}.`
			: `Il valore medio si arrotonda alla stessa posizione, ${POSITION[p]}: diventa ${inl(c, r.m, r.md)}.`,
	);
	return out.map((s) => textBlock(s));
}

const final = (c: Ctx, r: Res): string => `${c.sym} = ${resTex(c, r)}`;

// ---------------------------------------------------------------------------
// Distractors of a result

/** The first three results different from the answer and from each other (as numbers), in order of preference. */
function pickResults(answer: Res, cands: (Res | null)[]): Res[] {
	const seen = new Set([key(answer)]);
	const out: Res[] = [];
	for (const r of cands) {
		if (!r || r.D.sign() < 0 || r.m.sign() <= 0 || seen.has(key(r))) continue;
		seen.add(key(r));
		out.push(r);
		if (out.length === 3) break;
	}
	if (out.length < 3) throw new Error(`${ID}: only ${out.length} distractors`);
	return out;
}

/** Fallbacks shared by levels 3-5: the sensitivity as uncertainty, then Δ one unit larger or smaller, then the mean one unit larger or smaller. */
function fallbacks(c: Ctx, mean: Rational, answer: Res): (Res | null)[] {
	const unit = pow10(-answer.Dd);
	const plus = answer.D.add(unit);
	const minus = answer.D.sub(unit);
	return [
		result(mean, sens(c)),
		plus.compare(pow10(-answer.Dd + 1)) < 0 ? { ...answer, D: plus } : null,
		minus.sign() > 0 ? { ...answer, D: minus } : null,
		{ ...answer, m: answer.m.add(unit) },
		{ ...answer, m: answer.m.sub(unit) },
	];
}

/** The calculator's numbers, the range, the mean with one digit more, Δ truncated (level 3). */
function level3Mistakes(c: Ctx, s: Stats, answer: Res): (Res | null)[] {
	const p = -answer.Dd;
	const extra = roundAt(s.mean, p - 1);
	const trunc = truncAt(s.semi, p);
	return [
		{ m: s.mean, md: digits(s.mean, c.d), D: s.semi, Dd: digits(s.semi, c.d) },
		result(s.mean, s.range),
		extra.half ? null : { m: extra.v, md: answer.md + 1, D: answer.D, Dd: answer.Dd },
		trunc.equals(answer.D) ? null : { ...answer, D: trunc },
	];
}

// ---------------------------------------------------------------------------
// Levels

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceOption;
	others: ChoiceOption[];
	params: Record<string, unknown>;
}

const measuresParam = (c: Ctx, ms: readonly number[]) => ms.map((v) => val(c, v).toString());

function level1(rng: Rng): Built {
	const c = rng.pick(CTX);
	let ms: number[];
	do ms = series(rng, c, rng.int(4, 6), c.S * rng.int(2, 12));
	while (!meanShort(ms));
	const s = stats(c, ms);
	const D = digits(s.mean, c.d);
	const opt = (v: Rational): ChoiceOption => ({ latex: `${dec(v, D)}\\,${c.unit}`, values: [`${plainNum(dec(v, D))} ${c.plain}`] });
	const n = s.n;
	const cands = [s.sum.div(q(n - 1)), s.max.add(s.min).div(q(2)), s.sum.sub(val(c, ms[n - 1])).div(q(n - 1))];
	const used = new Set([s.mean.toString()]);
	const picked: Rational[] = [];
	for (const v of cands) {
		if (decimals(v) <= D && !used.has(v.toString())) {
			used.add(v.toString());
			picked.push(v);
		}
	}
	const u = pow10(-D);
	for (let k = 1; picked.length < 3; k++) {
		for (const v of [s.mean.add(u.mul(q(k))), s.mean.sub(u.mul(q(k)))]) {
			if (picked.length < 3 && v.sign() > 0 && !used.has(v.toString())) {
				used.add(v.toString());
				picked.push(v);
			}
		}
	}
	return {
		prompt: 'Calcola il valore medio.',
		problem: lines([...prose(intro(c, n)), row(c, ms), ...prose('Quanto vale il valore medio delle misure?')]),
		solution: `\\bar{${c.sym}} = ${dec(s.mean, D)}\\,${c.unit}`,
		steps: [textBlock(`Il valore medio è la somma delle misure divisa per il loro numero, $${n}$:`), meanTex(c, ms)],
		answer: opt(s.mean),
		others: picked.map(opt),
		params: { context: c.key, measures: measuresParam(c, ms), mean: s.mean.toString() },
	};
}

function level2(rng: Rng): Built {
	const c = rng.pick(CTX);
	const R = c.S === 1 ? rng.int(3, 20) : 5 * rng.int(3, 12);
	const ms = series(rng, c, rng.int(4, 6), R);
	const s = stats(c, ms);
	const ansD = digits(s.semi, c.d);
	const opt = (v: Rational): ChoiceOption => {
		const k = digits(v, c.d);
		return { latex: `${dec(v, k)}\\,${c.unit}`, values: [`${plainNum(dec(v, k))} ${c.plain}`] };
	};
	const used = new Set([s.semi.toString()]);
	const picked: Rational[] = [];
	for (const v of [s.range, s.max.sub(s.mean), sens(c)]) {
		if (decimals(v) <= c.d + 2 && v.sign() > 0 && !used.has(v.toString())) {
			used.add(v.toString());
			picked.push(v);
		}
	}
	const u = pow10(-ansD);
	for (let k = 1; picked.length < 3; k++) {
		for (const v of [s.semi.add(u.mul(q(k))), s.semi.sub(u.mul(q(k)))]) {
			if (picked.length < 3 && v.sign() > 0 && !used.has(v.toString())) {
				used.add(v.toString());
				picked.push(v);
			}
		}
	}
	return {
		prompt: 'Calcola la semidispersione.',
		problem: lines([...prose(intro(c, s.n)), row(c, ms), ...prose('Quanto vale la semidispersione delle misure?')]),
		solution: `\\Delta ${c.sym} = ${num(c, s.semi)}\\,${c.unit}`,
		steps: [
			textBlock(`La misura più grande è ${inl(c, s.max)} e la più piccola ${inl(c, s.min)}. La semidispersione è metà della loro differenza:`),
			semiTex(c, ms),
			textBlock(`Il campo di variazione, ${inl(c, s.range)}, è il doppio: il diviso due non va dimenticato.`),
		],
		answer: opt(s.semi),
		others: picked.map(opt),
		params: { context: c.key, measures: measuresParam(c, ms), semi: s.semi.toString() },
	};
}

type Case3 = 'stessa-posizione' | 'incertezza-arrotondata' | 'posizione-piu-alta';

/** A series whose half-range is at least 3 times the sensitivity, with the mean at most one decimal past the data and a result that never rounds at half. */
function level3Series(rng: Rng): { c: Ctx; ms: number[]; kind: Case3; answer: Res } {
	const u = rng.next();
	const kind: Case3 = u < 0.3 ? 'stessa-posizione' : u < 0.9 ? 'incertezza-arrotondata' : 'posizione-piu-alta';
	for (;;) {
		const c = rng.pick(kind === 'stessa-posizione' ? CTX.filter((x) => x.S === 1) : CTX);
		let R: number;
		if (kind === 'stessa-posizione') R = 2 * rng.int(3, 9);
		else if (kind === 'posizione-piu-alta') R = 2 * rng.pick(c.S === 1 ? (c.maxDelta >= 20 ? [10, 20] : [10]) : [20, 30]);
		else R = c.S === 1 ? rng.int(21, 2 * c.maxDelta) : rng.pick([35, 45]);
		const ms = series(rng, c, rng.int(4, 6), R);
		if (!meanShort(ms)) continue;
		const s = stats(c, ms);
		if (s.semi.compare(sens(c).mul(q(3))) < 0) continue;
		const answer = result(s.mean, s.semi);
		if (!answer) continue;
		const rounded = !answer.D.equals(s.semi);
		const higher = -answer.Dd > -c.d;
		const got: Case3 = !higher ? 'stessa-posizione' : rounded ? 'incertezza-arrotondata' : 'posizione-piu-alta';
		if (got === kind) return { c, ms, kind, answer };
	}
}

function resultSteps(c: Ctx, ms: readonly number[], answer: Res, why: string): string[] {
	const s = stats(c, ms);
	return [
		textBlock('Il valore medio:'),
		meanTex(c, ms),
		textBlock('La semidispersione:'),
		semiTex(c, ms),
		textBlock(why),
		...roundingSteps(c, s.semi.compare(sens(c)) >= 0 ? s.semi : sens(c), s.mean, answer),
		final(c, answer),
	];
}

function level3(rng: Rng): Built {
	const { c, ms, kind, answer } = level3Series(rng);
	const s = stats(c, ms);
	const others = pickResults(answer, [...level3Mistakes(c, s, answer), ...fallbacks(c, s.mean, answer)]);
	return {
		prompt: 'Scrivi il risultato della misura.',
		problem: lines([...prose(intro(c, s.n)), row(c, ms), ...prose('Scrivi il risultato della misura.')]),
		solution: final(c, answer),
		steps: resultSteps(c, ms, answer, `La semidispersione è più grande della sensibilità, ${sensProse(c)}, quindi è l'incertezza.`),
		answer: resOpt(c, answer),
		others: others.map((r) => resOpt(c, r)),
		params: { case: kind, context: c.key, measures: measuresParam(c, ms), mean: s.mean.toString(), semi: s.semi.toString(), result: [answer.m.toString(), answer.D.toString()] },
	};
}

function level4(rng: Rng): Built {
	const u = rng.next();
	if (u >= 0.5) {
		const { c, ms, answer } = level3Series(rng);
		const s = stats(c, ms);
		const others = pickResults(answer, [result(s.mean, sens(c)), ...level3Mistakes(c, s, answer), ...fallbacks(c, s.mean, answer)]);
		return {
			prompt: 'Scrivi il risultato della misura.',
			problem: lines([...prose(intro(c, s.n)), row(c, ms), ...prose('Scrivi il risultato della misura.')]),
			solution: final(c, answer),
			steps: resultSteps(c, ms, answer, `La semidispersione è più grande della sensibilità, ${sensProse(c)}, quindi è l'incertezza.`),
			answer: resOpt(c, answer),
			others: others.map((r) => resOpt(c, r)),
			params: { case: 'semidispersione', context: c.key, measures: measuresParam(c, ms), mean: s.mean.toString(), semi: s.semi.toString(), result: [answer.m.toString(), answer.D.toString()] },
		};
	}
	const equal = u < 1 / 6;
	for (;;) {
		const c = rng.pick(CTX);
		const n = rng.int(4, 6);
		const base = c.S * rng.int(Math.ceil(c.lo / c.S), Math.floor((c.hi - c.S) / c.S));
		const up = equal ? 0 : rng.int(1, n - 1);
		const ms = shuffle(rng, [...Array(n - up).fill(base), ...Array(up).fill(base + c.S)]);
		const s = stats(c, ms);
		const answer = result(s.mean, sens(c));
		if (!answer) continue;
		const halfS = sens(c).div(q(2));
		const cands: (Res | null)[] = [
			equal ? { m: s.mean, md: c.d, D: q(0), Dd: 0 } : result(s.mean, s.semi),
			{ m: answer.m, md: answer.md, D: halfS, Dd: decimals(halfS) },
			...fallbacks(c, s.mean, answer),
		];
		const others = pickResults(answer, cands);
		const why = equal
			? `Le misure sono tutte uguali: la semidispersione è zero, e l'incertezza è la sensibilità dello strumento, ${sensProse(c)}.`
			: `La semidispersione è più piccola della sensibilità, ${sensProse(c)}: lo strumento non distingue meno di così, e l'incertezza è la sensibilità.`;
		const steps = [
			textBlock('Il valore medio:'),
			meanTex(c, ms),
			textBlock('La semidispersione:'),
			semiTex(c, ms),
			textBlock(why),
			textBlock(
				s.mean.equals(answer.m)
					? `Il valore medio si scrive fino alla stessa posizione della sensibilità: ${inl(c, answer.m, answer.md)}.`
					: `Il valore medio si arrotonda alla stessa posizione della sensibilità: diventa ${inl(c, answer.m, answer.md)}.`,
			),
			final(c, answer),
		];
		return {
			prompt: 'Scrivi il risultato della misura.',
			problem: lines([...prose(intro(c, n)), row(c, ms), ...prose('Scrivi il risultato della misura.')]),
			solution: final(c, answer),
			steps,
			answer: resOpt(c, answer),
			others: others.map((r) => resOpt(c, r)),
			params: { case: equal ? 'uguali' : 'sensibilita', context: c.key, measures: measuresParam(c, ms), mean: s.mean.toString(), semi: s.semi.toString(), result: [answer.m.toString(), answer.D.toString()] },
		};
	}
}

type Cause = 'fermato-tardi' | 'partito-tardi' | 'nove-oscillazioni' | 'bilancia' | 'metro';

const CAUSES: Record<string, Cause[]> = {
	pendolo: ['fermato-tardi', 'partito-tardi', 'nove-oscillazioni'],
	caduta: ['fermato-tardi', 'partito-tardi'],
	massa: ['bilancia'],
	lunghezza: ['metro'],
};

function causeText(cause: Cause, i: number, x: Rational): string {
	const o = ORDINAL[i];
	switch (cause) {
		case 'fermato-tardi':
			return `Chi misurava si è accorto che nella ${o} misura il cronometro è stato fermato in ritardo.`;
		case 'partito-tardi':
			return `Chi misurava si è accorto che nella ${o} misura il cronometro è stato fatto partire in ritardo.`;
		case 'nove-oscillazioni':
			return `Chi misurava si è accorto che nella ${o} misura ha contato $9$ oscillazioni invece di $10$.`;
		case 'bilancia':
			return `Chi pesava si è accorto che nella ${o} pesata la bilancia non era stata azzerata e a vuoto segnava $${dec(x, 1)}$ g.`;
		case 'metro':
			return `Chi misurava si è accorto che nella ${o} misura il metro era appoggiato dalla tacca di $1$ cm invece che dallo zero.`;
	}
}

/** Distractors of level 5, in order: with the wrong measure; the right mean with the uncertainty of all; without the smallest or the largest good measure; the mean of all with the right uncertainty. */
function level5Mistakes(c: Ctx, good: number[], all: number[], answer: Res): (Res | null)[] {
	const g = stats(c, good);
	const a = stats(c, all);
	const uncertainty = (s: Stats) => (s.semi.compare(sens(c)) >= 0 ? s.semi : sens(c));
	const withAll = result(a.mean, uncertainty(a));
	const allDelta = withAll ? roundAt(g.mean, -withAll.Dd) : null;
	const without = (drop: number) => {
		const rest = [...good];
		rest.splice(rest.indexOf(drop), 1);
		const s = stats(c, rest);
		return result(s.mean, uncertainty(s));
	};
	const allMean = roundAt(a.mean, -answer.Dd);
	return [
		withAll,
		withAll && allDelta && !allDelta.half ? { m: allDelta.v, md: withAll.md, D: withAll.D, Dd: withAll.Dd } : null,
		without(Math.min(...good)),
		without(Math.max(...good)),
		allMean.half ? null : { ...answer, m: allMean.v },
	];
}

function level5(rng: Rng): Built {
	for (;;) {
		const c = ctxOf(rng.pick(['pendolo', 'caduta', 'massa', 'lunghezza']));
		const cause = rng.pick(CAUSES[c.key]);
		const nGood = rng.int(4, 5);
		const R = rng.int(2, cause === 'metro' ? 6 : 12);
		const good = series(rng, c, nGood, R);
		const g = stats(c, good);
		const answer = result(g.mean, g.semi);
		if (!answer) continue;
		const max = Math.max(...good);
		const min = Math.min(...good);
		const need = Math.ceil((5 * R) / 2);
		let wrong: number;
		let x = q(0);
		const v = rng.int(min, max);
		if (cause === 'fermato-tardi') wrong = max + rng.int(Math.max(need, c.key === 'pendolo' ? 20 : 15), c.key === 'pendolo' ? 80 : 35);
		else if (cause === 'partito-tardi') wrong = min - rng.int(Math.max(need, c.key === 'pendolo' ? 20 : 15), c.key === 'pendolo' ? 80 : 30);
		else if (cause === 'nove-oscillazioni') wrong = Math.floor((9 * v + 5) / 10);
		else if (cause === 'bilancia') {
			const xi = rng.int(20, 90);
			x = q(xi, 10);
			wrong = v + xi;
		} else wrong = v + 10;
		const shorter = cause === 'partito-tardi' || cause === 'nove-oscillazioni';
		const dist = shorter ? min - wrong : wrong - max;
		if (2 * dist < 5 * R || wrong <= 0) continue;
		const i = rng.int(0, nGood);
		const all = [...good.slice(0, i), wrong, ...good.slice(i)];
		let others: Res[];
		try {
			others = pickResults(answer, [...level5Mistakes(c, good, all, answer), ...fallbacks(c, g.mean, answer)]);
		} catch {
			continue;
		}
		const noun = cause === 'bilancia' ? 'pesata' : 'misura';
		return {
			prompt: 'Scrivi il risultato della misura.',
			problem: lines([...prose(intro(c, all.length)), row(c, all), ...prose(`${causeText(cause, i, x)} Scrivi il risultato della misura.`)]),
			solution: final(c, answer),
			steps: [
				textBlock(`La ${ORDINAL[i]} ${noun}, ${inl(c, val(c, wrong))}, è uno sbaglio con una causa nota, e si scarta. Con le altre ${COUNT[nGood]}:`),
				meanTex(c, good),
				semiTex(c, good),
				textBlock(`La semidispersione non è più piccola della sensibilità, ${sensProse(c)}, quindi è l'incertezza.`),
				...roundingSteps(c, g.semi, g.mean, answer),
				final(c, answer),
			],
			answer: resOpt(c, answer),
			others: others.map((r) => resOpt(c, r)),
			params: {
				case: cause,
				context: c.key,
				measures: measuresParam(c, all),
				wrong: i,
				offset: x.toString(),
				mean: g.mean.toString(),
				semi: g.semi.toString(),
				result: [answer.m.toString(), answer.D.toString()],
			},
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: compatible measures

interface Group {
	/** Value and uncertainty in units of 10^-d; `p` the exponent of the uncertainty's digit. */
	v: number;
	D: number;
	p: number;
}

const unitOf = (c: Ctx, p: number) => 10 ** (p + c.d);
/** Distance between the intervals (negative: how much they overlap). */
const gap = (a: Group, b: Group) => Math.max(b.v - b.D - (a.v + a.D), a.v - a.D - (b.v + b.D));

function drawGroup(rng: Rng, c: Ctx): Group {
	const fine = rng.next() < 0.5;
	const p = fine ? -c.d : -c.d + 1;
	const digit = fine ? rng.int(c.S === 1 ? 2 : 5, 9) : rng.int(1, c.S === 1 ? 4 : 3);
	const u = unitOf(c, p);
	return { v: 0, D: digit * u, p };
}

function place(rng: Rng, c: Ctx, a: Group, b: Group, compatible: boolean): Group | null {
	const um = Math.min(unitOf(c, a.p), unitOf(c, b.p));
	const reach = a.D + b.D;
	const mag = compatible ? rng.int(0, reach - um) : rng.int(reach + um, reach + um + 3 * Math.max(unitOf(c, a.p), unitOf(c, b.p)));
	const ub = unitOf(c, b.p);
	const raw = a.v + (rng.next() < 0.5 ? -mag : mag);
	const v = ub * Math.round(raw / ub);
	const out = { ...b, v };
	const g = gap(a, out);
	if (compatible ? g > -um : g < um) return null;
	return out;
}

const groupRes = (c: Ctx, g: Group): Res => ({ m: val(c, g.v), md: Math.max(0, -g.p), D: val(c, g.D), Dd: Math.max(0, -g.p) });

const OPTIONS6 = ['solo B', 'solo C', 'B e C', 'né B né C'] as const;

function level6(rng: Rng): Built {
	const kind = rng.pick(OPTIONS6);
	const withB = kind === 'solo B' || kind === 'B e C';
	const withC = kind === 'solo C' || kind === 'B e C';
	for (;;) {
		const c = rng.pick(CTX);
		const a = drawGroup(rng, c);
		const ua = unitOf(c, a.p);
		const [from, to] = [Math.ceil((c.lo + a.D) / ua), Math.floor((c.hi - a.D) / ua)];
		if (from > to) continue;
		a.v = ua * rng.int(from, to);
		const b = place(rng, c, a, drawGroup(rng, c), withB);
		const cc = place(rng, c, a, drawGroup(rng, c), withC);
		if (!b || !cc) continue;
		const um = Math.min(unitOf(c, b.p), unitOf(c, cc.p));
		const gbc = gap(b, cc);
		if (gbc > -um && gbc < um) continue;
		const gs = [a, b, cc];
		if (gs.some((g) => g.v - g.D <= 0 || g.v < c.lo || g.v > c.hi)) continue;
		const keys = gs.map((g) => key(groupRes(c, g)));
		if (new Set(keys).size < 3) continue;
		const names = ['A', 'B', 'C'];
		const results = gs.map((g, i) => `${c.sym}_${names[i]} = ${resTex(c, groupRes(c, g))}`);
		const bounds = (g: Group) => [val(c, g.v - g.D), val(c, g.v + g.D)].map((r) => inl(c, r, Math.max(0, -g.p)));
		const lo = (g: Group) => inl(c, val(c, g.v - g.D), Math.max(0, -g.p));
		const hi = (g: Group) => inl(c, val(c, g.v + g.D), Math.max(0, -g.p));
		const compare = (x: Group, name: string): string => {
			const g = gap(a, x);
			if (g < 0) {
				const from = Math.max(a.v - a.D, x.v - x.D);
				const to = Math.min(a.v + a.D, x.v + x.D);
				const k = Math.max(0, -Math.min(a.p, x.p));
				return `A e ${name} sono compatibili: hanno in comune i valori da ${inl(c, val(c, from), k)} a ${inl(c, val(c, to), k)}.`;
			}
			return x.v > a.v
				? `A e ${name} sono incompatibili: A arriva fino a ${hi(a)} e ${name} comincia da ${lo(x)}.`
				: `A e ${name} sono incompatibili: ${name} arriva fino a ${hi(x)} e A comincia da ${lo(a)}.`;
		};
		const [ba, bb, bc] = gs.map(bounds);
		const steps = [
			textBlock(`Gli intervalli vanno per A da ${ba[0]} a ${ba[1]}, per B da ${bb[0]} a ${bb[1]}, per C da ${bc[0]} a ${bc[1]}.`),
			textBlock(compare(b, 'B')),
			textBlock(compare(cc, 'C')),
			textBlock(kind === 'né B né C' ? 'La misura A non è compatibile né con B né con C.' : `La misura A è compatibile con ${kind === 'B e C' ? 'B e con C' : kind.slice(5)}.`),
		];
		const opt = (s: string): ChoiceOption => ({ latex: `\\text{${s}}`, values: [s] });
		return {
			prompt: 'Scegli le misure compatibili con A.',
			problem: lines([...prose(`Tre gruppi misurano ${c.same} e scrivono i risultati:`), results.join(' \\quad '), ...prose('Con quali misure è compatibile la misura A?')]),
			solution: `\\text{${kind}}`,
			steps,
			answer: opt(kind),
			others: OPTIONS6.filter((o) => o !== kind).map(opt),
			params: { case: kind, context: c.key, groups: gs.map((g) => ({ value: val(c, g.v).toString(), delta: val(c, g.D).toString(), p: g.p })) },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
		const b = make(rng);
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: b.prompt,
			problem: b.problem,
			solution: b.solution,
			steps: b.steps,
			answer: choose(rng, b.answer, b.others),
			params: b.params,
		};
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.prompt, sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	if (sample.answer.kind !== 'choice') return [...v, 'la risposta deve essere una scelta'];
	const ch = sample.answer;
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni con la stessa scrittura');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni con lo stesso LaTeX');
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push('opzione giusta fuori dai limiti');
	const p = sample.params as Record<string, unknown>;
	const c = ctxOf(String(p.context));
	if (!c) return [...v, 'contesto sconosciuto'];
	if (sample.level <= 5) {
		const ms = (p.measures as string[]).map((s) => {
			const [a, b = '1'] = s.split('/');
			return q(Number(a), Number(b));
		});
		const ints = ms.map((r) => r.mul(q(10 ** c.d)));
		if (ints.some((r) => !r.isInteger() || r.num % c.S !== 0)) v.push('misura non multipla della sensibilità');
		const n = ms.length;
		if (sample.level === 5 ? n < 5 || n > 6 : n < 4 || n > 6) v.push(`numero di misure ${n}`);
		const units = ints.map((r) => r.num);
		const good = sample.level === 5 ? units.filter((_, i) => i !== p.wrong) : units;
		if (good.some((x) => x < c.lo || x > c.hi)) v.push('misura fuori dall\'intervallo del contesto');
		const s = stats(c, good);
		if (sample.level === 2 && s.semi.compare(sens(c)) <= 0) v.push('semidispersione non più grande della sensibilità');
		if ((sample.level === 1 || sample.level === 3) && !meanShort(good)) v.push('valore medio con troppi decimali');
		if (sample.level === 3 && s.semi.compare(sens(c).mul(q(3))) < 0) v.push('semidispersione sotto tre volte la sensibilità');
		if (sample.level >= 3) {
			const Δ = s.semi.compare(sens(c)) >= 0 ? s.semi : sens(c);
			const r = result(s.mean, Δ);
			if (!r) v.push('arrotondamento a metà');
			else if (ch.options[ch.correct].latex !== resTex(c, r)) v.push('opzione giusta diversa dal risultato');
			const numeric = ch.options.map((o) => o.values[0].split(' ± ').map((x) => (x.includes(',') ? x.replace(/0+( |$)/, '$1').replace(/,( |$)/, '$1') : x)).join('|'));
			if (new Set(numeric).size !== numeric.length) v.push('due opzioni con gli stessi numeri scritti in modo diverso');
		}
		if (sample.level === 5) {
			const w = units[p.wrong as number];
			const dist = Math.max(w - Math.max(...good), Math.min(...good) - w);
			if (2 * dist < 5 * (Math.max(...good) - Math.min(...good))) v.push('misura sbagliata troppo vicina alle buone');
		}
	} else if (sample.level === 6) {
		const gs = (p.groups as { value: string; delta: string; p: number }[]).map((g) => {
			const [a, b = '1'] = g.value.split('/');
			const [e, f = '1'] = g.delta.split('/');
			return { v: q(Number(a), Number(b)).mul(q(10 ** c.d)).num, D: q(Number(e), Number(f)).mul(q(10 ** c.d)).num, p: g.p };
		});
		const [a, b, cc] = gs;
		for (const [x, y] of [
			[a, b],
			[a, cc],
			[b, cc],
		]) {
			const um = Math.min(unitOf(c, x.p), unitOf(c, y.p));
			const g = gap(x, y);
			if (g > -um && g < um) v.push('intervalli che si toccano o quasi');
		}
		const want = gap(a, b) < 0 ? (gap(a, cc) < 0 ? 'B e C' : 'solo B') : gap(a, cc) < 0 ? 'solo C' : 'né B né C';
		if (ch.options[ch.correct].values[0] !== want) v.push('opzione giusta sbagliata');
	}
	return v;
}

const generator: Generator = {
	id: ID,
	title: 'Valore medio e incertezza di una serie di misure',
	levels: {
		1: { label: 'Il valore medio', constraints: ['da 4 a 6 misure', 'media esatta con al più un decimale in più dei dati'] },
		2: { label: 'La semidispersione', constraints: ['semidispersione più grande della sensibilità'] },
		3: { label: 'Scrivere il risultato', constraints: ['semidispersione almeno tre volte la sensibilità', 'arrotondamenti mai a metà'] },
		4: { label: 'Incertezza e sensibilità', constraints: ['metà dei casi con la sensibilità come incertezza', 'arrotondamenti mai a metà'] },
		5: { label: 'Una misura da scartare', constraints: ['una misura sbagliata con la causa nel testo', 'lontana dalle altre almeno cinque semidispersioni'] },
		6: { label: 'Misure compatibili', constraints: ['intervalli sovrapposti o separati di almeno un\'unità', 'quattro casi, un quarto ciascuno'] },
	},
	generate,
	check,
};

export default generator;
