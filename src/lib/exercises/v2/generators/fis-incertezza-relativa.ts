/**
 * Incertezza relativa e propagazione delle incertezze (physics, first year). Spec: specs/exercises/fis-incertezza-relativa.md
 *
 * Six levels in the order of the lesson (docs/lezioni/fisica/riscritte/07-fis-incertezza-relativa.md): the percentage
 * uncertainty of a measure; back from the relative to the absolute uncertainty; sums and differences (the absolute
 * uncertainties add up); products and quotients (the relative ones add up); powers and exact numbers; formulas with
 * more steps (a density from a cube, a density from a box, a speed over n laps).
 *
 * Every answer is a multiple choice with four options: a percentage (level 1) or a result written as the lesson
 * writes it, (624 ± 5) cm², the uncertainty with one significant figure and the value rounded to its position. The
 * wrong options are the mistakes the lesson warns about (the ratio upside down, the uncertainties subtracted in a
 * difference, the absolute uncertainties added in a product, the exponent forgotten), each written in the same
 * correct form. `values` holds the option without LaTeX ("624 ± 5 cm^2"), so trailing zeros count.
 *
 * Arithmetic is exact (Rational). Rounding looks at the first digit removed ("regola del 5", half up), and the data
 * are chosen so that the removed part is at least a tenth of a unit away from one half, for the uncertainty and for
 * the value: the answer stays the same if the student rounds the relative uncertainties to two significant figures,
 * or keeps one more digit of the value.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { Rational, q } from '../rational';

export const ID = 'fis-incertezza-relativa';

type R = Rational;
const t = (s: string) => `\\text{${s}}`;
const ZERO = q(0);
const HALF = q(1, 2);
const TENTH = q(1, 10);

// ---------------------------------------------------------------------------
// Exact decimal arithmetic

const p10 = (k: number): R => (k >= 0 ? q(10 ** k) : q(1, 10 ** -k));

function floorInt(r: R): number {
	const m = ((r.num % r.den) + r.den) % r.den;
	return (r.num - m) / r.den;
}

/** Exponent of the first significant digit of r > 0: 623,7 -> 2, 0,0081 -> -3. */
function lead(r: R): number {
	if (r.sign() <= 0) throw new Error(`${ID}: lead of ${r}`);
	let e = Math.floor(Math.log10(r.num / r.den));
	while (r.compare(p10(e)) < 0) e--;
	while (r.compare(p10(e + 1)) >= 0) e++;
	return e;
}

/** Rounded to a multiple of 10^p, half up. */
const roundAt = (r: R, p: number): R => q(floorInt(r.div(p10(p)).add(HALF))).mul(p10(p));
/** Cut to a multiple of 10^p (the student who does not round). */
const truncAt = (r: R, p: number): R => q(floorInt(r.div(p10(p)))).mul(p10(p));
/** Rounded to n significant figures. */
const roundSf = (r: R, n: number): R => roundAt(r, lead(r) - n + 1);

/** The part removed when rounding at 10^p is at least a tenth of a unit away from one half. */
function clear(r: R, p: number): boolean {
	const s = r.div(p10(p));
	const f = s.sub(q(floorInt(s)));
	return f.sub(HALF).abs().compare(TENTH) >= 0;
}

/** Number of decimals of a terminating decimal, or Infinity. */
function decimalsOf(r: R): number {
	let d = r.den;
	let k2 = 0;
	let k5 = 0;
	while (d % 2 === 0) {
		d /= 2;
		k2++;
	}
	while (d % 5 === 0) {
		d /= 5;
		k5++;
	}
	return d === 1 ? Math.max(k2, k5) : Infinity;
}

/** r with exactly d decimals: LaTeX (5{,}0, thin space from five digits) or plain (5,0). */
function fmtWith(r: R, d: number, latex: boolean): string {
	const scaled = r.mul(p10(d));
	if (!scaled.isInteger() || scaled.sign() < 0) throw new Error(`${ID}: ${r} with ${d} decimals`);
	const s = String(scaled.num).padStart(d + 1, '0');
	let int = s.slice(0, s.length - d);
	const frac = s.slice(s.length - d);
	if (latex && int.length >= 5) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
	return frac ? `${int}${latex ? '{,}' : ','}${frac}` : int;
}
const fmt = (r: R, d: number) => fmtWith(r, d, true);
/** A terminating decimal with its own decimals: 0{,}005, 623{,}7, 8. */
const num = (r: R) => fmt(r, decimalsOf(r));
const dOf = (p: number) => Math.max(0, -p);

/** "= 0{,}005" when r has at most three significant figures, else "\approx 0{,}00337". */
function approx3(r: R): string {
	const pos = lead(r) - 2;
	const s = roundAt(r, pos);
	return s.equals(r) ? `= ${num(r)}` : `\\approx ${fmt(s, dOf(pos))}`;
}

// ---------------------------------------------------------------------------
// Measures and units

/** A measure (v ± u): u is one digit times 10^p (or 0 in a wrong option), v a multiple of 10^p. */
interface M {
	v: R;
	u: R;
	p: number;
}

type UnitKey = 'cm' | 'm' | 'g' | 's' | 'mL' | 'C' | 'cm2' | 'cm3' | 'ms' | 'gcm3';
const UNITS: Record<UnitKey, { tex: string; plain: string; prose: string }> = {
	cm: { tex: '\\,\\text{cm}', plain: 'cm', prose: 'cm' },
	m: { tex: '\\,\\text{m}', plain: 'm', prose: 'm' },
	g: { tex: '\\,\\text{g}', plain: 'g', prose: 'g' },
	s: { tex: '\\,\\text{s}', plain: 's', prose: 's' },
	mL: { tex: '\\,\\text{mL}', plain: 'mL', prose: 'mL' },
	C: { tex: '\\,^\\circ\\text{C}', plain: '°C', prose: '°C' },
	cm2: { tex: '\\ \\text{cm}^2', plain: 'cm^2', prose: '' },
	cm3: { tex: '\\ \\text{cm}^3', plain: 'cm^3', prose: '' },
	ms: { tex: '\\,\\text{m/s}', plain: 'm/s', prose: 'm/s' },
	gcm3: { tex: '\\ \\text{g/cm}^3', plain: 'g/cm^3', prose: '' },
};

/** The uncertainty of a measure: 0,2; a wrong option can have 0 (the uncertainties subtracted), written 0. */
const uStr = (m: M, latex: boolean) => (m.u.isZero() ? '0' : fmtWith(m.u, dOf(m.p), latex));
const mTex = (m: M, unit: UnitKey) => `(${fmt(m.v, dOf(m.p))} \\pm ${uStr(m, true)})${UNITS[unit].tex}`;
const mPlain = (m: M, unit: UnitKey) => `${fmtWith(m.v, dOf(m.p), false)} ± ${uStr(m, false)} ${UNITS[unit].plain}`;
/** A measure in the prose of the problem. */
const mProse = (m: M, unit: UnitKey) => `$${mTex(m, unit)}$`;
const qty = (r: R, d: number, unit: UnitKey) => `${fmt(r, d)}${UNITS[unit].tex}`;

/** A measure N·10^p ± d·10^p. */
const meas = (n: number, d: number, p: number): M => ({ v: q(n).mul(p10(p)), u: q(d).mul(p10(p)), p });
const sf = (m: M) => String(m.v.div(p10(m.p)).num).length;
const eps = (m: M) => m.u.div(m.v);

/** The result of value X with uncertainty D, as the lesson writes it: D with one significant figure, X at its position. */
function result(X: R, D: R): M {
	const u = roundSf(D, 1);
	const p = lead(u);
	return { v: roundAt(X, p), u, p };
}
/** The same, cut instead of rounded. */
function truncated(X: R, D: R): M {
	const p = lead(D);
	return { v: truncAt(X, p), u: truncAt(D, p), p };
}

// ---------------------------------------------------------------------------
// Options

interface Opt {
	latex: string;
	plain: string;
	key: string;
	tag: string;
}

/** Longest option written without LaTeX, value and uncertainty (the unit apart): the answer button is 252 px wide. */
const MAX_CHARS = 18;

function mOpt(m: M | null, unit: UnitKey, tag: string): Opt | null {
	if (!m || m.v.sign() <= 0 || m.u.sign() < 0 || m.u.compare(m.v) >= 0) return null;
	if (!m.u.isZero()) {
		const digit = m.u.div(p10(m.p));
		if (!digit.isInteger() || digit.num < 1 || digit.num > 9) return null;
	}
	if (!m.v.div(p10(m.p)).isInteger()) return null;
	const plain = mPlain(m, unit);
	if (plain.length - UNITS[unit].plain.length - 1 > MAX_CHARS) return null;
	return { latex: mTex(m, unit), plain, key: `${m.v}|${m.u}`, tag };
}

/** The answer one step away: the value one unit up or down, the uncertainty one digit up or down. */
function near(a: M, unit: UnitKey): Opt[] {
	const s = p10(a.p);
	const c: [M, string][] = [
		[{ ...a, v: a.v.add(s) }, 'valore vicino'],
		[{ ...a, v: a.v.sub(s) }, 'valore vicino'],
		[{ ...a, u: a.u.add(s) }, 'incertezza vicina'],
		[{ ...a, u: a.u.sub(s) }, 'incertezza vicina'],
	];
	return c.map(([m, tag]) => (m.u.isZero() ? null : mOpt(m, unit, tag))).filter((o): o is Opt => o !== null);
}

function pickOptions(rng: Rng, answer: Opt, mistakes: (Opt | null)[], fill: Opt[]): { choice: ChoiceAnswer; tags: string[] } {
	const opts: Opt[] = [answer];
	const keys = new Set([answer.key]);
	const plains = new Set([answer.plain]);
	for (const o of [...mistakes, ...shuffle(rng, fill)]) {
		if (opts.length === 4) break;
		if (!o || keys.has(o.key) || plains.has(o.plain)) continue;
		keys.add(o.key);
		plains.add(o.plain);
		opts.push(o);
	}
	if (opts.length < 4) throw new Error(`${ID}: fewer than four options`);
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	const options: ChoiceOption[] = order.map((i) => ({ latex: opts[i].latex, values: [opts[i].plain] }));
	return { choice: { kind: 'choice', options, correct: order.indexOf(0) }, tags: order.map((i) => opts[i].tag) };
}

// ---------------------------------------------------------------------------
// Relative uncertainties: the steps and the robustness of the rounding

interface Part {
	/** The symbol of the datum: a, \ell, m. */
	sym: string;
	m: M;
	/** Multiplier of its relative uncertainty (the exponent). */
	k: number;
}

const epsSum = (parts: Part[]) => parts.reduce((s, x) => s.add(q(x.k).mul(eps(x.m))), ZERO);

/**
 * The answer is the same whatever the student does in between: relative uncertainties exact or rounded to two
 * significant figures (each, the sum, or both), the value exact, with one digit more than the result, or with three
 * significant figures. Also the removed parts are at least a tenth of a unit away from one half.
 */
function robust(X: R, parts: Part[], ans: M): boolean {
	const e = epsSum(parts);
	const D = e.mul(X);
	if (!clear(D, lead(D)) || !clear(X, ans.p)) return false;
	const eRounded = parts.reduce((s, x) => s.add(q(x.k).mul(roundSf(eps(x.m), 2))), ZERO);
	const es = [e, eRounded, roundSf(e, 2), roundSf(eRounded, 2)];
	const xs = [X, roundAt(X, ans.p - 1), roundSf(X, 3)];
	for (const ee of es) for (const xx of xs) if (!roundSf(ee.mul(xx), 1).equals(ans.u)) return false;
	return roundAt(roundAt(X, ans.p - 1), ans.p).equals(ans.v);
}

/** A number of a step: exact when it has at most one decimal more than 10^pos ("= 3575"), else rounded at 10^pos ("\\approx 21{,}53"). */
function shown(X: R, pos: number): { sym: string; tex: string } {
	return decimalsOf(X) <= dOf(pos) + 1 ? { sym: '=', tex: num(X) } : { sym: '\\approx', tex: fmt(roundAt(X, pos), dOf(pos)) };
}
/** Where the value of a result is written in the steps: one digit more than the result, at least three significant figures. */
const valuePos = (X: R, ans: M) => Math.min(ans.p - 1, lead(X) - 2);

/** The value in the first step. */
function valueShown(X: R, ans: M): string {
	const s = shown(X, valuePos(X, ans));
	return `${s.sym} ${s.tex}`;
}
/** A volume l^3 or a·b·c: exact if short, else with four significant figures. */
const volShown = (V: R) => shown(V, lead(V) - 3);

const epsName = (sym: string) => `\\varepsilon_{${sym}}`;

/** Steps 2 and 3 of the lesson: the relative uncertainties and their sum, then the absolute one, rounded. */
function relSteps(sym: string, X: R, parts: Part[], ans: M, unit: UnitKey, sumTex: string): string[] {
	const steps: string[] = [];
	const seen = new Set<string>();
	for (const x of parts) {
		if (seen.has(x.sym)) continue;
		seen.add(x.sym);
		const d = dOf(x.m.p);
		steps.push(`${epsName(x.sym)} = \\dfrac{${fmt(x.m.u, d)}}{${fmt(x.m.v, d)}} ${approx3(eps(x.m))}`);
	}
	const e = epsSum(parts);
	steps.push(`${epsName(sym)} = ${sumTex} ${approx3(e)}`);
	const D = e.mul(X);
	const eShown = fmt(roundAt(e, lead(e) - 2), dOf(lead(e) - 2));
	const xShown = shown(X, valuePos(X, ans)).tex;
	const Dtex = approx3(D);
	const last = D.equals(ans.u) ? '' : ` \\approx ${qty(ans.u, dOf(ans.p), unit)}`;
	steps.push(
		`\\Delta ${sym} = ${epsName(sym)} \\cdot ${sym} \\approx ${eShown} \\cdot ${xShown}${UNITS[unit].tex} ${Dtex}${UNITS[unit].tex}${last}`,
	);
	steps.push(`${t("L'incertezza ha una cifra significativa, il valore si arrotonda alla sua posizione:")}`);
	steps.push(`${sym} = ${mTex(ans, unit)}`);
	return steps;
}

// ---------------------------------------------------------------------------
// Levels

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Opt;
	mistakes: (Opt | null)[];
	fill: Opt[];
	params: Record<string, unknown>;
}

const DIG = [1, 1, 1, 2, 2, 2, 5, 5, 3, 4, 6, 8];

// Level 1 and 2: one measure and its percentage uncertainty

/** Percentage uncertainties of the spec. */
const PERC = ['1/10', '1/5', '1/4', '2/5', '1/2', '4/5', '1', '6/5', '3/2', '2', '5/2', '4', '5', '8', '10'].map((s) => Rational.parse(s));

interface Ctx1 {
	unit: UnitKey;
	ps: number[];
	max: number;
	/** "Una massa misura" (level 1), "Una massa di" (level 2), feminine or not. */
	subj: string;
	fem: boolean;
}
const CTX1: Record<string, Ctx1> = {
	lunghezza: { unit: 'cm', ps: [-2, -1, 0], max: 500, subj: 'Una lunghezza', fem: true },
	distanza: { unit: 'm', ps: [-3, -2, -1], max: 200, subj: 'Una distanza', fem: true },
	massa: { unit: 'g', ps: [-2, -1, 0], max: 5000, subj: 'Una massa', fem: true },
	tempo: { unit: 's', ps: [-2, -1], max: 1000, subj: 'Un intervallo di tempo', fem: false },
	volume: { unit: 'mL', ps: [-1, 0], max: 2000, subj: 'Un volume', fem: false },
};

function pickPercent(rng: Rng, ctx: Ctx1): { P: R; m: M } {
	for (;;) {
		const P = rng.pick(PERC);
		const p = rng.pick(ctx.ps);
		const d = rng.pick(DIG);
		const u = q(d).mul(p10(p));
		const x = u.mul(q(100)).div(P);
		if (!x.div(p10(p)).isInteger() || x.compare(q(1)) < 0 || x.compare(q(ctx.max)) > 0) continue;
		return { P, m: { v: x, u, p } };
	}
}

/** "del 2%", "dello 0,4%", "dell'1,5%", "dell'8%". */
function article(P: R): string {
	const s = num(P);
	if (s.startsWith('0')) return 'dello ';
	if (/^(1|1\{,\}\d+|8|8\{,\}\d+)$/.test(s) || s.startsWith('11')) return "dell'";
	return 'del ';
}

const pct = (P: R) => `${num(P)}\\%`;
const pctOpt = (P: R, tag: string): Opt => {
	const plain = `${fmtWith(P, decimalsOf(P), false)} %`;
	return { latex: pct(P), plain, key: P.toString(), tag };
};

function level1(rng: Rng): Built {
	const name = rng.pick(Object.keys(CTX1));
	const ctx = CTX1[name];
	const { P, m } = pickPercent(rng, ctx);
	const e = P.div(q(100));
	const d = dOf(m.p);
	const verb = name === 'tempo' ? 'dura' : 'misura';
	const inverted = roundAt(q(10000).div(P), 0);
	return {
		prompt: "Calcola l'incertezza percentuale.",
		problem: textBlock(`${ctx.subj} ${verb} ${mProse(m, ctx.unit)}. Quanto vale l'incertezza percentuale della misura?`),
		solution: `\\varepsilon_\\% = ${pct(P)}`,
		steps: [
			`\\varepsilon = \\dfrac{\\Delta x}{\\bar{x}} = \\dfrac{${qty(m.u, d, ctx.unit)}}{${qty(m.v, d, ctx.unit)}} = ${num(e)}`,
			`\\varepsilon_\\% = ${num(e)} \\cdot 100\\% = ${pct(P)}`,
		],
		answer: pctOpt(P, 'risposta'),
		// not multiplied by 100; the ratio upside down; ten times the answer
		mistakes: [pctOpt(e, 'senza per 100'), pctOpt(inverted, 'rapporto rovesciato'), pctOpt(P.mul(q(10)), 'dieci volte')],
		fill: [],
		params: { case: name, unit: ctx.unit, x: m.v.toString(), dx: m.u.toString(), percent: P.toString() },
	};
}

function level2(rng: Rng): Built {
	const name = rng.pick(Object.keys(CTX1));
	const ctx = CTX1[name];
	const { P, m } = pickPercent(rng, ctx);
	const e = P.div(q(100));
	const d = dOf(m.p);
	const x = m.v;
	const unit = ctx.unit;
	const hundred = m.u.mul(q(100));
	return {
		prompt: "Passa dall'incertezza relativa a quella assoluta.",
		problem: textBlock(
			`${ctx.subj} di $${fmt(x, d)}$ ${UNITS[unit].prose} è ${ctx.fem ? 'misurata' : 'misurato'} con un'incertezza ${article(P)}$${pct(P)}$. Come si scrive il risultato della misura?`,
		),
		solution: mTex(m, unit),
		steps: [
			`\\Delta x = \\varepsilon \\cdot \\bar{x} = ${num(e)} \\cdot ${qty(x, d, unit)} = ${qty(m.u, d, unit)}`,
			`${t("L'incertezza è nella posizione dell'ultima cifra del valore:")}`,
			mTex(m, unit),
		],
		answer: mOpt(m, unit, 'risposta') as Opt,
		// the percentage as the absolute uncertainty; 100 times (10 times if absurd); the value over the percentage;
		// then ten times smaller or larger
		mistakes: [
			mOpt(result(x, P), unit, 'percentuale come assoluta'),
			mOpt(result(x, hundred), unit, 'cento volte') ?? mOpt(result(x, m.u.mul(q(10))), unit, 'dieci volte'),
			mOpt(result(x, x.div(P)), unit, 'valore diviso percentuale'),
			mOpt(result(x, m.u.div(q(10))), unit, 'dieci volte più piccola'),
			mOpt(result(x, m.u.mul(q(10))), unit, 'dieci volte'),
		],
		fill: near(m, unit),
		params: { case: name, unit, x: x.toString(), percent: P.toString(), answer: [m.v.toString(), m.u.toString()] },
	};
}

// Level 3: sums and differences

interface Ctx3 {
	unit: UnitKey;
	/** Position of the data, range of the first value and of the difference (or of the second value), in units of 10^p. */
	ranges: { p: number; a: [number, number]; b: [number, number] }[];
	k: number;
	diff: boolean;
	sym: string;
	/** The uncertainty of the result: \\Delta P, \\Delta(T_2 - T_1). */
	uSym: string;
	text: (A: string, B: string, rng: Rng) => string;
	value: (a: string, b: string) => string;
	unc: (a: string, b: string) => string;
}

const LIQUIDS: [string, string][] = [
	["d'acqua", "dell'acqua"],
	["d'olio", "dell'olio"],
	['di latte', 'del latte'],
];

const CTX3: Record<string, Ctx3> = {
	perimetro: {
		unit: 'cm',
		ranges: [
			{ p: -1, a: [50, 999], b: [50, 999] },
			{ p: 0, a: [10, 300], b: [10, 300] },
		],
		k: 2,
		diff: false,
		sym: 'P',
		uSym: '\\Delta P',
		text: (A, B) => `I lati di un rettangolo misurano ${A} e ${B}. Quanto vale il perimetro?`,
		value: (a, b) => `P = 2a + 2b = 2 \\cdot ${a} + 2 \\cdot ${b}`,
		unc: (a, b) => `\\Delta P = 2\\,\\Delta a + 2\\,\\Delta b = 2 \\cdot ${a} + 2 \\cdot ${b}`,
	},
	tratti: {
		unit: 'm',
		ranges: [
			{ p: -2, a: [100, 5000], b: [100, 5000] },
			{ p: -1, a: [20, 999], b: [20, 999] },
		],
		k: 1,
		diff: false,
		sym: 'L',
		uSym: '\\Delta L',
		text: (A, B) => `Un percorso è fatto di due tratti in fila, lunghi ${A} e ${B}. Quanto è lungo il percorso?`,
		value: (a, b) => `L = a + b = ${a} + ${b}`,
		unc: (a, b) => `\\Delta L = \\Delta a + \\Delta b = ${a} + ${b}`,
	},
	liquido: {
		unit: 'g',
		ranges: [
			{ p: 0, a: [80, 300], b: [30, 400] },
			{ p: -1, a: [800, 3000], b: [200, 4000] },
		],
		k: 1,
		diff: true,
		sym: 'm',
		uSym: '\\Delta m',
		text: (A, B, rng) => {
			const [full, of] = rng.pick(LIQUIDS);
			return `Un bicchiere vuoto ha la massa di ${A}; pieno ${full} ha la massa di ${B}. Quanto vale la massa ${of}?`;
		},
		value: (a, b) => `m = m_2 - m_1 = ${b} - ${a}`,
		unc: (a, b) => `\\Delta m = \\Delta m_1 + \\Delta m_2 = ${a} + ${b}`,
	},
	sasso: {
		unit: 'mL',
		ranges: [
			{ p: 0, a: [20, 80], b: [5, 40] },
			{ p: -1, a: [200, 800], b: [30, 300] },
		],
		k: 1,
		diff: true,
		sym: 'V',
		uSym: '\\Delta V',
		text: (A, B) => `Si immerge un sasso in un cilindro graduato e l'acqua sale da ${A} a ${B}. Quanto vale il volume del sasso?`,
		value: (a, b) => `V = V_2 - V_1 = ${b} - ${a}`,
		unc: (a, b) => `\\Delta V = \\Delta V_1 + \\Delta V_2 = ${a} + ${b}`,
	},
	temperatura: {
		unit: 'C',
		ranges: [
			{ p: 0, a: [10, 30], b: [5, 60] },
			{ p: -1, a: [100, 300], b: [20, 600] },
		],
		k: 1,
		diff: true,
		sym: 'T_2 - T_1',
		uSym: '\\Delta(T_2 - T_1)',
		text: (A, B) => `La temperatura dell'acqua in una pentola sul fuoco sale da ${A} a ${B}. Quanto vale l'aumento di temperatura?`,
		value: (a, b) => `T_2 - T_1 = ${b} - ${a}`,
		unc: (a, b) => `\\Delta(T_2 - T_1) = \\Delta T_1 + \\Delta T_2 = ${a} + ${b}`,
	},
};

function level3(rng: Rng): Built {
	const name = rng.pick(Object.keys(CTX3));
	const ctx = CTX3[name];
	const two = rng.next() < 0.2;
	for (;;) {
		const r = rng.pick(ctx.ranges);
		const d1 = rng.pick(DIG);
		const d2 = rng.pick(DIG);
		const S = ctx.k * (d1 + d2);
		if ((S >= 10) !== two) continue;
		const n1 = rng.int(r.a[0], r.a[1]);
		const n2 = ctx.diff ? n1 + rng.int(r.b[0], r.b[1]) : rng.int(r.b[0], r.b[1]);
		if (!ctx.diff && n1 === n2) continue;
		const A = meas(n1, d1, r.p);
		const B = meas(n2, d2, r.p);
		if (eps(A).compare(q(1, 5)) > 0 || eps(B).compare(q(1, 5)) > 0) continue;
		const X = ctx.diff ? B.v.sub(A.v) : A.v.add(B.v).mul(q(ctx.k));
		const D = q(S).mul(p10(r.p));
		if (X.compare(D.mul(q(2))) <= 0 || X.compare(TENTH) < 0 || X.compare(q(10000)) > 0) continue;
		const ans = result(X, D);
		if (!clear(D, lead(D)) || !clear(X, ans.p)) continue;
		const unit = ctx.unit;
		const d = dOf(r.p);
		const f = (x: R) => fmt(x, d);
		const steps = [`${ctx.value(f(A.v), f(B.v))} = ${qty(X, d, unit)}`];
		if (ctx.diff) steps.push(t('Nella differenza le incertezze si sommano:'));
		steps.push(`${ctx.unc(f(A.u), f(B.u))} = ${qty(D, d, unit)}`);
		if (two) {
			steps.push(`${t('Con una cifra significativa: ')} ${ctx.uSym} \\approx ${qty(ans.u, dOf(ans.p), unit)}${t(', e il valore si arrotonda alla stessa posizione')}`);
		}
		steps.push(`${ctx.sym} = ${mTex(ans, unit)}`);
		// a wrong uncertainty D', written in the correct form (0 with the value of the data)
		const wrong = (Dw: R, tag: string) => (Dw.isZero() ? mOpt({ v: X, u: ZERO, p: r.p }, unit, tag) : mOpt(result(X, Dw), unit, tag));
		const [ua, ub] = [A.u, B.u];
		const mistakes = [
			wrong(ua.sub(ub).abs(), 'differenza delle incertezze'),
			wrong(ua.add(ub).div(q(2)), 'media delle incertezze'),
			ctx.k === 2 ? wrong(ua.add(ub), 'senza il 2') : null,
			wrong(ua.compare(ub) >= 0 ? ua : ub, 'la più grande'),
		];
		return {
			prompt: 'Calcola il risultato con la sua incertezza.',
			problem: textBlock(ctx.text(mProse(A, unit), mProse(B, unit), rng)),
			solution: `${ctx.sym} = ${mTex(ans, unit)}`,
			steps,
			answer: mOpt(ans, unit, 'risposta') as Opt,
			mistakes,
			fill: near(ans, unit),
			params: {
				case: name,
				rounded: two,
				unit,
				a: [A.v.toString(), A.u.toString()],
				b: [B.v.toString(), B.u.toString()],
				X: X.toString(),
				D: D.toString(),
				answer: [ans.v.toString(), ans.u.toString()],
			},
		};
	}
}

// Levels 4, 5, 6: relative uncertainties

type Wrong = [R, string, 'eps' | 'abs' | 'trunc'];

interface RelBuilt {
	name: string;
	unit: UnitKey;
	sym: string;
	X: R;
	parts: Part[];
	problem: string;
	valueStep: string[];
	sumTex: string;
	/** The mistakes, in the order of the spec: a wrong relative uncertainty (eps, times X), a wrong absolute one (abs), the result cut (trunc). */
	wrong: Wrong[];
	params: Record<string, unknown>;
}

function relBuilt(b: RelBuilt): Built | null {
	const e = epsSum(b.parts);
	if (b.X.compare(TENTH) < 0 || b.X.compare(q(10000)) > 0) return null;
	const ans = result(b.X, e.mul(b.X));
	if (!robust(b.X, b.parts, ans)) return null;
	const answer = mOpt(ans, b.unit, 'risposta');
	if (!answer) return null;
	const mistakes = b.wrong.map(([w, tag, kind]) =>
		w.isZero() ? null : kind === 'eps' ? mOpt(result(b.X, w.mul(b.X)), b.unit, tag) : kind === 'trunc' ? mOpt(truncated(b.X, w), b.unit, tag) : mOpt(result(b.X, w), b.unit, tag),
	);
	return {
		prompt: 'Calcola il risultato con la sua incertezza.',
		problem: textBlock(b.problem),
		solution: `${b.sym} = ${mTex(ans, b.unit)}`,
		steps: [...b.valueStep, ...relSteps(b.sym, b.X, b.parts, ans, b.unit, b.sumTex)],
		answer,
		mistakes,
		fill: near(ans, b.unit),
		params: {
			...b.params,
			case: b.name,
			unit: b.unit,
			X: b.X.toString(),
			eps: e.toString(),
			answer: [ans.v.toString(), ans.u.toString()],
			parts: b.parts.map((x) => ({ sym: x.sym, v: x.m.v.toString(), u: x.m.u.toString(), k: x.k })),
		},
	};
}

/** A datum N·10^p ± d·10^p with N from lo to hi and relative uncertainty from 0,1% to 10%. */
function datum(rng: Rng, p: number, lo: number, hi: number): M {
	for (;;) {
		const m = meas(rng.int(lo, hi), rng.pick(DIG), p);
		const e = eps(m);
		if (e.compare(q(1, 1000)) >= 0 && e.compare(q(1, 10)) <= 0) return m;
	}
}

const d0 = (m: M) => fmt(m.v, dOf(m.p));

function level4(rng: Rng): Built {
	const name = rng.pick(['area', 'velocita', 'densita'] as const);
	for (;;) {
		let b: RelBuilt;
		// the order of the spec: the absolute ones added (or multiplied), the relative as absolute, the smaller one only, not rounded
		const extra: Wrong[] = [];
		if (name === 'area') {
			const p = rng.pick([-1, -1, 0]);
			const [lo, hi] = p === -1 ? [20, 999] : [10, 300];
			const A = datum(rng, p, lo, hi);
			const B = datum(rng, p, lo, hi);
			if (A.v.equals(B.v)) continue;
			const X = A.v.mul(B.v);
			const parts = [
				{ sym: 'a', m: A, k: 1 },
				{ sym: 'b', m: B, k: 1 },
			];
			const [ea, eb] = [eps(A), eps(B)];
			b = {
				name,
				unit: 'cm2',
				sym: 'A',
				X,
				parts,
				problem: `Un rettangolo ha i lati ${mProse(A, 'cm')} e ${mProse(B, 'cm')}. Quanto vale l'area?`,
				valueStep: [`A = a \\cdot b = ${d0(A)} \\cdot ${d0(B)} ${valueShown(X, result(X, ea.add(eb).mul(X)))}${UNITS.cm2.tex}`],
				sumTex: `${epsName('a')} + ${epsName('b')}`,
				wrong: extra,
				params: { a: [A.v.toString(), A.u.toString()], b: [B.v.toString(), B.u.toString()] },
			};
			const e = ea.add(eb);
			extra.push(
				[A.u.add(B.u), 'assolute sommate', 'abs'],
				[roundSf(e, 1), 'relativa come assoluta', 'abs'],
				[ea.compare(eb) <= 0 ? ea : eb, 'solo la relativa più piccola', 'eps'],
				[e.mul(X), 'non arrotondato', 'trunc'],
				[A.u.mul(B.u), 'prodotto delle incertezze', 'abs'],
			);
		} else if (name === 'velocita') {
			const ps = rng.pick([-1, 0, -2]);
			const [slo, shi] = ps === -1 ? [100, 9999] : ps === 0 ? [10, 999] : [100, 999];
			const S = datum(rng, ps, slo, shi);
			const pt = rng.pick([-1, -2]);
			const T = datum(rng, pt, pt === -1 ? 20 : 100, 999);
			if (sf(S) > (ps === -1 ? 4 : 3)) continue;
			const X = S.v.div(T.v);
			if (X.compare(TENTH) < 0 || X.compare(q(40)) > 0) continue;
			const subj = X.compare(q(2)) < 0 ? 'Un carrello' : X.compare(q(10)) < 0 ? 'Un corridore' : X.compare(q(20)) < 0 ? 'Un ciclista' : "Un'automobile";
			const [es, et] = [eps(S), eps(T)];
			const e = es.add(et);
			b = {
				name,
				unit: 'ms',
				sym: 'v',
				X,
				parts: [
					{ sym: 's', m: S, k: 1 },
					{ sym: 't', m: T, k: 1 },
				],
				problem: `${subj} percorre ${mProse(S, 'm')} in ${mProse(T, 's')}. Quanto vale la velocità media?`,
				valueStep: [`v = \\dfrac{s}{t} = \\dfrac{${d0(S)}}{${d0(T)}} ${valueShown(X, result(X, e.mul(X)))}${UNITS.ms.tex}`],
				sumTex: `${epsName('s')} + ${epsName('t')}`,
				wrong: extra,
				params: { s: [S.v.toString(), S.u.toString()], t: [T.v.toString(), T.u.toString()] },
			};
			extra.push(
				[S.u.mul(T.u), 'prodotto delle incertezze', 'abs'],
				[roundSf(e, 1), 'relativa come assoluta', 'abs'],
				[es.compare(et) <= 0 ? es : et, 'solo la relativa più piccola', 'eps'],
				[e.mul(X), 'non arrotondato', 'trunc'],
			);
		} else {
			const pm = rng.pick([-1, 0]);
			const M0 = datum(rng, pm, pm === -1 ? 100 : 10, 999);
			const ml = rng.next() < 0.5;
			const pv = rng.pick([-1, 0]);
			const V = datum(rng, pv, pv === -1 ? 20 : 10, 999);
			const X = M0.v.div(V.v);
			if (X.compare(q(1, 2)) < 0 || X.compare(q(20)) > 0) continue;
			const obj = rng.pick(['Un oggetto', 'Un sasso', 'Un blocchetto']);
			const [em, ev] = [eps(M0), eps(V)];
			const e = em.add(ev);
			const vUnit: UnitKey = ml ? 'mL' : 'cm3';
			const valueStep = [`d = \\dfrac{m}{V} = \\dfrac{${d0(M0)}}{${d0(V)}} ${valueShown(X, result(X, e.mul(X)))}${UNITS.gcm3.tex}`];
			if (ml) valueStep.unshift(`${t('Il volume in centimetri cubi: ')} 1\\,\\text{mL} = 1\\ \\text{cm}^3`);
			b = {
				name,
				unit: 'gcm3',
				sym: 'd',
				X,
				parts: [
					{ sym: 'm', m: M0, k: 1 },
					{ sym: 'V', m: V, k: 1 },
				],
				problem: `${obj} ha la massa di ${mProse(M0, 'g')} e il volume di ${mProse(V, vUnit)}. Quanto vale la densità?`,
				valueStep,
				sumTex: `${epsName('m')} + ${epsName('V')}`,
				wrong: extra,
				params: { m: [M0.v.toString(), M0.u.toString()], V: [V.v.toString(), V.u.toString()], volumeUnit: vUnit },
			};
			extra.push(
				[M0.u.mul(V.u), 'prodotto delle incertezze', 'abs'],
				[roundSf(e, 1), 'relativa come assoluta', 'abs'],
				[em.compare(ev) <= 0 ? em : ev, 'solo la relativa più piccola', 'eps'],
				[e.mul(X), 'non arrotondato', 'trunc'],
			);
		}
		const out = relBuilt(b);
		if (!out) continue;
		return out;
	}
}

const POLY: [number, string][] = [
	[3, 'un triangolo equilatero'],
	[4, 'un quadrato'],
	[5, 'un pentagono regolare'],
	[6, 'un esagono regolare'],
];

function level5(rng: Rng): Built {
	const name = rng.pick(['quadrato', 'cubo', 'pendolo', 'poligono'] as const);
	for (;;) {
		if (name === 'quadrato' || name === 'cubo') {
			const n = name === 'quadrato' ? 2 : 3;
			const p = rng.pick([-1, -2]);
			const [lo, hi] = p === -1 ? [15, name === 'cubo' ? 215 : 999] : [100, 999];
			const L = datum(rng, p, lo, hi);
			const X = n === 2 ? L.v.mul(L.v) : L.v.mul(L.v).mul(L.v);
			const unit: UnitKey = n === 2 ? 'cm2' : 'cm3';
			const sym = n === 2 ? 'A' : 'V';
			const el = eps(L);
			const powU = n === 2 ? L.u.mul(L.u) : L.u.mul(L.u).mul(L.u);
			const out = relBuilt({
				name,
				unit,
				sym,
				X,
				parts: [{ sym: '\\ell', m: L, k: n }],
				problem:
					n === 2
						? `Il lato di un quadrato misura ${mProse(L, 'cm')}. Quanto vale l'area?`
						: `Lo spigolo di un cubo misura ${mProse(L, 'cm')}. Quanto vale il volume?`,
				valueStep: [`${sym} = \\ell^${n} = ${d0(L)}^${n} ${valueShown(X, result(X, el.mul(q(n)).mul(X)))}${UNITS[unit].tex}`],
				sumTex: `${n}\\,${epsName('\\ell')}`,
				// the exponent forgotten; the absolute uncertainty raised to the power
				wrong: [
					[el, 'esponente dimenticato', 'eps'],
					[powU, 'incertezza assoluta elevata', 'abs'],
				],
				params: { l: [L.v.toString(), L.u.toString()], n },
			});
			if (out) return out;
			continue;
		}
		if (name === 'pendolo') {
			const n = rng.pick([10, 20]);
			const p = rng.pick([-2, -1]);
			const [lo, hi] = p === -2 ? [500, 6000] : [50, 600];
			const Tm = meas(rng.int(lo, hi), rng.pick(DIG), p);
			if (eps(Tm).compare(q(1, 10)) > 0) continue;
			const X = Tm.v.div(q(n));
			const D = Tm.u.div(q(n));
			if (X.compare(q(1, 2)) < 0 || X.compare(q(3)) > 0) continue;
			const ans = result(X, D);
			if (!clear(D, lead(D)) || !clear(X, ans.p) || ans.u.compare(ans.v) >= 0) continue;
			const unit: UnitKey = 's';
			const d = dOf(p);
			const answer = mOpt(ans, unit, 'risposta');
			if (!answer) continue;
			const steps = [
				`T = \\dfrac{t}{${n}} = \\dfrac{${fmt(Tm.v, d)}}{${n}} = ${qty(X, decimalsOf(X), unit)}`,
				t('Si divide per un numero esatto: anche l\'incertezza si divide.'),
				`\\Delta T = \\dfrac{\\Delta t}{${n}} = \\dfrac{${fmt(Tm.u, d)}}{${n}} = ${qty(D, decimalsOf(D), unit)}`,
			];
			if (!D.equals(ans.u)) steps.push(`${t('Con una cifra significativa: ')} \\Delta T \\approx ${qty(ans.u, dOf(ans.p), unit)}`);
			steps.push(`T = ${mTex(ans, unit)}`);
			return {
				prompt: 'Calcola il risultato con la sua incertezza.',
				problem: textBlock(`Il tempo di $${n}$ oscillazioni di un pendolo è ${mProse(Tm, 's')}. Quanto vale il periodo?`),
				solution: `T = ${mTex(ans, unit)}`,
				steps,
				answer,
				// the uncertainty not divided; multiplied by n
				mistakes: [mOpt(result(X, Tm.u), unit, 'non divisa'), mOpt(result(X, Tm.u.mul(q(n))), unit, 'moltiplicata')],
				fill: near(ans, unit),
				params: { case: name, unit, n, t: [Tm.v.toString(), Tm.u.toString()], X: X.toString(), D: D.toString(), answer: [ans.v.toString(), ans.u.toString()] },
			};
		}
		const [k, poly] = rng.pick(POLY);
		const p = rng.pick([-1, 0]);
		const L = meas(p === -1 ? rng.int(15, 999) : rng.int(10, 300), rng.pick(DIG), p);
		if (eps(L).compare(q(1, 10)) > 0) continue;
		const X = L.v.mul(q(k));
		const D = L.u.mul(q(k));
		const ans = result(X, D);
		if (!clear(D, lead(D)) || !clear(X, ans.p) || X.compare(q(10000)) > 0) continue;
		const unit: UnitKey = 'cm';
		const d = dOf(p);
		const answer = mOpt(ans, unit, 'risposta');
		if (!answer) continue;
		const steps = [
			`P = ${k}\\,\\ell = ${k} \\cdot ${fmt(L.v, d)} = ${qty(X, d, unit)}`,
			t('Si moltiplica per un numero esatto: anche l\'incertezza si moltiplica.'),
			`\\Delta P = ${k}\\,\\Delta \\ell = ${k} \\cdot ${fmt(L.u, d)} = ${qty(D, d, unit)}`,
		];
		if (!D.equals(ans.u)) steps.push(`${t('Con una cifra significativa: ')} \\Delta P \\approx ${qty(ans.u, dOf(ans.p), unit)}${t(', e il valore si arrotonda alla stessa posizione')}`);
		steps.push(`P = ${mTex(ans, unit)}`);
		return {
			prompt: 'Calcola il risultato con la sua incertezza.',
			problem: textBlock(`Il lato di ${poly} misura ${mProse(L, 'cm')}. Quanto vale il perimetro?`),
			solution: `P = ${mTex(ans, unit)}`,
			steps,
			answer,
			// the uncertainty not multiplied
			mistakes: [mOpt(result(X, L.u), unit, 'non moltiplicata')],
			fill: near(ans, unit),
			params: { case: name, unit, k, l: [L.v.toString(), L.u.toString()], X: X.toString(), D: D.toString(), answer: [ans.v.toString(), ans.u.toString()] },
		};
	}
}

const material = (rho: R) => (rho.compare(q(1)) < 0 ? 'di legno' : rho.compare(q(2)) < 0 ? 'di plastica' : 'di metallo');

function level6(rng: Rng): Built {
	const name = rng.pick(['cubetto', 'parallelepipedo', 'pista'] as const);
	for (;;) {
		let b: RelBuilt;
		const extra: Wrong[] = [];
		if (name === 'cubetto') {
			const pl = rng.pick([-1, -2]);
			const L = datum(rng, pl, pl === -1 ? 15 : 100, pl === -1 ? 99 : 500);
			const V = L.v.mul(L.v).mul(L.v);
			const rhoT = q(rng.int(5, 120), 10);
			const pm = rng.pick([-1, 0]);
			const nM = floorInt(rhoT.mul(V).div(p10(pm)));
			if (nM < 10 || nM > 99999) continue;
			const M0 = meas(nM, rng.pick(DIG), pm);
			if (eps(M0).compare(q(1, 1000)) < 0 || eps(M0).compare(q(1, 10)) > 0) continue;
			const X = M0.v.div(V);
			const [em, el] = [eps(M0), eps(L)];
			const e = em.add(el.mul(q(3)));
			b = {
				name,
				unit: 'gcm3',
				sym: 'd',
				X,
				parts: [
					{ sym: 'm', m: M0, k: 1 },
					{ sym: '\\ell', m: L, k: 3 },
				],
				problem: `Un cubetto ${material(X)} ha lo spigolo ${mProse(L, 'cm')} e la massa ${mProse(M0, 'g')}. Quanto vale la densità?`,
				valueStep: [
					`V = \\ell^3 = ${d0(L)}^3 ${volShown(V).sym} ${volShown(V).tex}\\ \\text{cm}^3`,
					`d = \\dfrac{m}{\\ell^3} ${volShown(V).sym} \\dfrac{${d0(M0)}}{${volShown(V).tex}} ${valueShown(X, result(X, e.mul(X)))}${UNITS.gcm3.tex}`,
				],
				sumTex: `${epsName('m')} + 3\\,${epsName('\\ell')}`,
				wrong: extra,
				params: { l: [L.v.toString(), L.u.toString()], m: [M0.v.toString(), M0.u.toString()] },
			};
			extra.push([em.add(el), 'il 3 dimenticato', 'eps'], [em, 'solo la massa', 'eps'], [el.mul(q(3)), 'solo lo spigolo', 'eps'], [e.mul(X), 'non arrotondato', 'trunc'], [roundSf(e, 1), 'relativa come assoluta', 'abs']);
		} else if (name === 'parallelepipedo') {
			const sides = [0, 1, 2].map(() => datum(rng, -1, 20, 150));
			const V = sides[0].v.mul(sides[1].v).mul(sides[2].v);
			const rhoT = q(rng.int(5, 120), 10);
			const pm = rng.pick([-1, 0]);
			const nM = floorInt(rhoT.mul(V).div(p10(pm)));
			if (nM < 10 || nM > 99999) continue;
			const M0 = meas(nM, rng.pick(DIG), pm);
			if (eps(M0).compare(q(1, 1000)) < 0 || eps(M0).compare(q(1, 10)) > 0) continue;
			const X = M0.v.div(V);
			const em = eps(M0);
			const es = sides.map(eps).reduce((s, x) => s.add(x), ZERO);
			const e = em.add(es);
			const [A, B, C] = sides;
			b = {
				name,
				unit: 'gcm3',
				sym: 'd',
				X,
				parts: [
					{ sym: 'm', m: M0, k: 1 },
					{ sym: 'a', m: A, k: 1 },
					{ sym: 'b', m: B, k: 1 },
					{ sym: 'c', m: C, k: 1 },
				],
				problem: `Un blocchetto ${material(X)} a forma di parallelepipedo ha gli spigoli ${mProse(A, 'cm')}, ${mProse(B, 'cm')} e ${mProse(C, 'cm')} e la massa ${mProse(M0, 'g')}. Quanto vale la densità?`,
				valueStep: [
					`V = a \\cdot b \\cdot c = ${d0(A)} \\cdot ${d0(B)} \\cdot ${d0(C)} ${volShown(V).sym} ${volShown(V).tex}\\ \\text{cm}^3`,
					`d = \\dfrac{m}{V} ${volShown(V).sym} \\dfrac{${d0(M0)}}{${volShown(V).tex}} ${valueShown(X, result(X, e.mul(X)))}${UNITS.gcm3.tex}`,
				],
				sumTex: `${epsName('m')} + ${epsName('a')} + ${epsName('b')} + ${epsName('c')}`,
				wrong: extra,
				params: { a: [A.v.toString(), A.u.toString()], b: [B.v.toString(), B.u.toString()], c: [C.v.toString(), C.u.toString()], m: [M0.v.toString(), M0.u.toString()] },
			};
			extra.push([em, 'solo la massa', 'eps'], [es, 'solo gli spigoli', 'eps'], [e.mul(X), 'non arrotondato', 'trunc'], [roundSf(e, 1), 'relativa come assoluta', 'abs']);
		} else {
			const n = rng.int(2, 10);
			const pl = rng.pick([-1, 0]);
			const L = datum(rng, pl, pl === -1 ? 1000 : 100, pl === -1 ? 9999 : 999);
			const vT = q(rng.int(30, 150), 10);
			const pt = rng.pick([0, -1]);
			const nT = floorInt(q(n).mul(L.v).div(vT).div(p10(pt)));
			if (nT < 10 || nT > 9999) continue;
			const T = meas(nT, rng.pick(DIG), pt);
			if (eps(T).compare(q(1, 1000)) < 0 || eps(T).compare(q(1, 10)) > 0) continue;
			const X = q(n).mul(L.v).div(T.v);
			const subj = X.compare(q(8)) < 0 ? 'Un corridore' : 'Un ciclista';
			const [eL, et] = [eps(L), eps(T)];
			const e = eL.add(et);
			b = {
				name,
				unit: 'ms',
				sym: 'v',
				X,
				parts: [
					{ sym: 'L', m: L, k: 1 },
					{ sym: 't', m: T, k: 1 },
				],
				problem: `${subj} fa $${n}$ giri di una pista lunga ${mProse(L, 'm')} in ${mProse(T, 's')}. Quanto vale la velocità media?`,
				valueStep: [
					`v = \\dfrac{n L}{t} = \\dfrac{${n} \\cdot ${d0(L)}}{${d0(T)}} ${valueShown(X, result(X, e.mul(X)))}${UNITS.ms.tex}`,
					t('Il numero di giri è esatto e non cambia l\'incertezza relativa.'),
				],
				sumTex: `${epsName('L')} + ${epsName('t')}`,
				wrong: extra,
				params: { n, L: [L.v.toString(), L.u.toString()], t: [T.v.toString(), T.u.toString()] },
			};
			extra.push([eL.mul(q(n)).add(et), 'giri anche nella relativa', 'eps'], [et, 'solo il tempo', 'eps'], [eL, 'solo la pista', 'eps'], [e.mul(X), 'non arrotondato', 'trunc']);
		}
		const out = relBuilt(b);
		if (!out) continue;
		return out;
	}
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function assemble(level: number, rng: Rng, b: Built): Sample {
	const { choice, tags } = pickOptions(rng, b.answer, b.mistakes, b.fill);
	return {
		generatorId: ID,
		level,
		seed: rng.seed,
		prompt: b.prompt,
		problem: b.problem,
		solution: b.solution,
		steps: b.steps,
		answer: choice,
		// what each option is (the answer, or the mistake it comes from), in the order shown
		params: { ...b.params, right: b.answer.plain, options: tags },
	};
}

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 1000; attempt++) {
		let sample: Sample;
		try {
			sample = assemble(level, rng, make(rng));
		} catch (e) {
			// a number out of the safe range of Rational, or fewer than four options: draw again
			if (attempt < 999) continue;
			throw e;
		}
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

/** "624 ± 5 cm^2" or "0,5 %" back to numbers and decimals. */
function readPlain(s: string): { v: R; u: R | null; dv: number; du: number } | null {
	const n = (x: string) => {
		const [i, f = ''] = x.split(',');
		return { r: q(Number(i + f), 10 ** f.length), d: f.length };
	};
	const m = /^(\d+(?:,\d+)?) ± (\d+(?:,\d+)?) \S+$/.exec(s);
	if (m) {
		const [v, u] = [n(m[1]), n(m[2])];
		return { v: v.r, u: u.r, dv: v.d, du: u.d };
	}
	const pm = /^(\d+(?:,\d+)?) %$/.exec(s);
	if (pm) {
		const v = n(pm[1]);
		return { v: v.r, u: null, dv: v.d, du: 0 };
	}
	return null;
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const text = [sample.prompt, sample.problem, sample.solution, ...sample.steps].join(' ');
	if (/—|piuttosto che/.test(text)) v.push('parole vietate');
	if (!sample.steps.length) v.push('nessun passaggio');
	const a = sample.answer;
	if (a.kind !== 'choice') return [...v, 'la risposta deve essere una scelta'];
	if (a.options.length !== 4) v.push('servono quattro opzioni');
	const plains = a.options.map((o) => o.values[0]);
	if (new Set(plains).size !== plains.length) v.push('due opzioni scritte uguali');
	if (a.options[a.correct]?.values[0] !== p.right) v.push("l'opzione giusta non è la risposta");
	const keys = new Set<string>();
	for (const o of a.options) {
		const r = readPlain(o.values[0]);
		if (!r) {
			v.push(`opzione illeggibile: ${o.values[0]}`);
			continue;
		}
		keys.add(`${r.v}|${r.u}`);
		if (r.u === null) {
			if (sample.level !== 1) v.push('percentuale fuori dal livello 1');
			continue;
		}
		if (r.dv !== r.du && !r.u.isZero()) v.push(`valore e incertezza in posizioni diverse: ${o.values[0]}`);
		if (r.u.isZero()) {
			if (sample.level !== 3) v.push('incertezza zero fuori dal livello 3');
		} else {
			const digit = r.u.div(p10(lead(r.u)));
			if (!digit.isInteger() || r.du !== dOf(lead(r.u))) v.push(`incertezza con più di una cifra significativa: ${o.values[0]}`);
			if (r.u.compare(r.v) >= 0) v.push(`incertezza più grande del valore: ${o.values[0]}`);
		}
	}
	if (keys.size !== a.options.length) v.push('due opzioni con lo stesso valore e la stessa incertezza');
	// the answer again, from the params
	if (sample.level === 1) {
		const P = Rational.parse(p.percent as string);
		if (!Rational.parse(p.dx as string).div(Rational.parse(p.x as string)).mul(q(100)).equals(P)) v.push('percentuale sbagliata');
		if (!PERC.some((x) => x.equals(P))) v.push('percentuale fuori dalla lista');
	} else if (sample.level === 2) {
		const [x, u] = (p.answer as string[]).map((s) => Rational.parse(s));
		if (!x.mul(Rational.parse(p.percent as string)).div(q(100)).equals(u)) v.push('incertezza assoluta sbagliata');
	} else {
		const X = Rational.parse(p.X as string);
		const [av, au] = (p.answer as string[]).map((s) => Rational.parse(s));
		if (X.compare(TENTH) < 0 || X.compare(q(10000)) > 0) v.push('risultato fuori da 0,1 - 10000');
		if (p.D !== undefined) {
			const D = Rational.parse(p.D as string);
			const ans = result(X, D);
			if (!ans.v.equals(av) || !ans.u.equals(au)) v.push('risultato sbagliato');
			if (!clear(D, lead(D)) || !clear(X, ans.p)) v.push('arrotondamento ambiguo');
		} else {
			const parts = (p.parts as { sym: string; v: string; u: string; k: number }[]).map((x) => {
				const m = { v: Rational.parse(x.v), u: Rational.parse(x.u), p: 0 };
				m.p = lead(m.u);
				return { sym: x.sym, m, k: x.k };
			});
			for (const x of parts) {
				const e = eps(x.m);
				if (e.compare(q(1, 1000)) < 0 || e.compare(q(1, 10)) > 0) v.push(`incertezza relativa di ${x.sym} fuori da 0,1% - 10%`);
			}
			const ans = result(X, epsSum(parts).mul(X));
			if (!ans.v.equals(av) || !ans.u.equals(au)) v.push('risultato sbagliato');
			if (!robust(X, parts, ans)) v.push('arrotondamento ambiguo');
		}
	}
	return v;
}

export const fisIncertezzaRelativa: Generator = {
	id: ID,
	title: 'Incertezza relativa e propagazione delle incertezze',
	levels: {
		1: { label: 'Incertezza relativa', constraints: ["l'incertezza percentuale di una misura: lunghezze, distanze, masse, tempi, volumi", 'percentuale dalla lista della specifica'] },
		2: { label: 'Dalla relativa all\'assoluta', constraints: ["il risultato (x ± Δx) da un valore e un'incertezza percentuale"] },
		3: { label: 'Somme e differenze', constraints: ['perimetro, due tratti, massa di un liquido, volume di un sasso, aumento di temperatura, circa 1 su 5 ciascuno', "l'incertezza da arrotondare circa 1 volta su 5"] },
		4: { label: 'Prodotti e quozienti', constraints: ['area, velocità media, densità, circa 1 su 3 ciascuno', 'incertezze relative dei dati tra 0,1% e 10%'] },
		5: { label: 'Potenze e numeri esatti', constraints: ['area del quadrato, volume del cubo, periodo del pendolo, perimetro di un poligono regolare, circa 1 su 4 ciascuno'] },
		6: { label: 'Formule con più passaggi', constraints: ['densità di un cubetto, densità di un parallelepipedo, velocità su n giri, circa 1 su 3 ciascuno'] },
	},
	generate,
	check,
};

export default fisIncertezzaRelativa;
