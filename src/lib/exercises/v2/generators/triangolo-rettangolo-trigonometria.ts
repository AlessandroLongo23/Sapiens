/**
 * Seno, coseno e tangente nel triangolo rettangolo. Spec: specs/exercises/triangolo-rettangolo-trigonometria.md
 *
 * Seven levels, from the "Per il generatore" section of the lesson's note: the three ratios from the sides of
 * a Pythagorean triangle, the exact values for 30, 45 and 60 degrees, from one value to the others with
 * sin² + cos² = 1 and tan = sin / cos, a side from a side and a notable angle (exact), a side from a side and
 * any angle (calculator, rounded to the hundredth), an angle from two sides (inverse functions), word problems
 * (angle of elevation, ramps with a slope in percent, ladders). The triangle is always ABC, right-angled in C,
 * with a = BC, b = AC, c = AB, alpha in A and beta in B, as in the lesson. No figures: every exercise stands on
 * its text. Approximate answers are k/100, the exact value rounded half up; a value within 1e-6 of a rounding
 * boundary is never used, so floating point cannot pick the wrong hundredth.
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { Surd } from '../surd';
import { buildChoice, shuffle } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'triangolo-rettangolo-trigonometria';

const t = (s: string) => `\\text{${s}}`;
const deg = (n: number | string) => `${n}^\\circ`;

// ---------------------------------------------------------------------------
// Numbers

/** Decimal places of a rational with a finite expansion, or null if periodic. */
function decimals(r: Rational): number | null {
	let d = r.den;
	let e2 = 0;
	let e5 = 0;
	for (; d % 2 === 0; e2++) d /= 2;
	for (; d % 5 === 0; e5++) d /= 5;
	return d === 1 ? Math.max(e2, e5) : null;
}

/** 12, 3{,}5, \frac{10}{3}: a positive number as the lesson writes it. */
function numTex(r: Rational): string {
	if (r.isInteger()) return String(r.num);
	const k = decimals(r);
	if (k === null) return `\\frac{${r.num}}{${r.den}}`;
	const s = String(Math.round((r.num * 10 ** k) / r.den)).padStart(k + 1, '0');
	return `${s.slice(0, s.length - k)}{,}${s.slice(s.length - k)}`;
}

const fl = (r: Rational) => r.num / r.den;

/** Hundredths k as the lesson writes a rounded value: 840 -> 8{,}40. */
function fixed2(k: number): string {
	const s = String(k).padStart(3, '0');
	return `${s.slice(0, -2)}{,}${s.slice(-2)}`;
}

/** x rounded half up to the hundredth, in hundredths; null when x is too close to a boundary to trust floats. */
function round2(x: number): number | null {
	const y = x * 100;
	const f = y - Math.floor(y);
	if (Math.abs(f - 0.5) < 1e-6) return null;
	return Math.round(y);
}

const RAD = Math.PI / 180;
const sinD = (x: number) => Math.sin(x * RAD);
const cosD = (x: number) => Math.cos(x * RAD);
const tanD = (x: number) => Math.tan(x * RAD);
const asinD = (x: number) => Math.asin(x) / RAD;
const acosD = (x: number) => Math.acos(x) / RAD;
const atanD = (x: number) => Math.atan(x) / RAD;

/** k·√r with r square-free: every exact length and ratio of the lesson. */
interface Rad {
	k: Rational;
	r: number;
}

function rad(k: Rational, r = 1): Rad {
	let kk = k;
	let rr = r;
	for (let i = 2; i * i <= rr; i++) {
		while (rr % (i * i) === 0) {
			rr /= i * i;
			kk = kk.mul(q(i));
		}
	}
	return { k: kk, r: kk.isZero() ? 1 : rr };
}

const radMul = (x: Rad, y: Rad) => rad(x.k.mul(y.k), x.r * y.r);
const radDiv = (x: Rad, y: Rad) => rad(x.k.div(y.k).mul(q(1, y.r)), x.r * y.r);
const radSurd = (x: Rad) => Surd.of(0, x.k.num, x.r, x.k.den);
const radStr = (x: Rad) => radSurd(x).toString();
const radEq = (x: Rad, y: Rad) => x.k.equals(y.k) && x.r === y.r;
/** A ratio: fractions stay fractions (\frac{3}{5}, \frac{\sqrt{2}}{4}). */
const ratioTex = (x: Rad) => radSurd(x).toLatex();
/** A length: a rational one as a decimal (3{,}5), an irrational one as \frac{7\sqrt{3}}{2}. */
const lenTex = (x: Rad) => (x.r === 1 ? numTex(x.k) : radSurd(x).toLatex());

// ---------------------------------------------------------------------------
// Options

type Unit = 'cm' | 'm' | 'deg' | '';

function withUnit(v: string, u: Unit): string {
	if (u === 'deg') return `${v}^\\circ`;
	return u ? `${v}\\text{ ${u}}` : v;
}

interface Opt {
	latex: string;
	value: string;
}

const toOption = (o: Opt): ChoiceOption => ({ latex: o.latex, values: [o.value] });

/** An option for an approximate answer: the value rounded to the hundredth, always with two decimals. */
function approxOpt(x: number, unit: Unit): Opt | null {
	if (!Number.isFinite(x) || x <= 0) return null;
	const k = Math.round(x * 100);
	if (k <= 0) return null;
	return { latex: withUnit(fixed2(k), unit), value: q(k, 100).toString() };
}

function exactOpt(x: Rad, unit: Unit): Opt | null {
	if (x.k.sign() <= 0) return null;
	return { latex: withUnit(unit ? lenTex(x) : ratioTex(x), unit), value: radStr(x) };
}

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	/** The answer; for number and expression answers `right` is its option and `wrong` the distractors, in order of preference. */
	answer: Answer;
	right?: Opt;
	wrong?: (Opt | null)[];
	params: Record<string, unknown>;
}

function exactAnswer(x: Rad): Answer {
	if (x.r === 1) return { kind: 'number', value: x.k.toString() };
	return { kind: 'expression', value: radStr(x), latex: radSurd(x).toLatex(), form: 'rationalized' };
}

// ---------------------------------------------------------------------------
// The triangle

type Fn = 'sin' | 'cos' | 'tan';
type Ang = 'alpha' | 'beta';
type Side = 'a' | 'b' | 'c';
const ANG: Record<Ang, string> = { alpha: '\\alpha', beta: '\\beta' };
const FN_WORD: Record<Fn, string> = { sin: 'seno', cos: 'coseno', tan: 'tangente' };
const SEG: Record<Side, string> = { a: 'BC', b: 'AC', c: 'AB' };
const opposite = (g: Ang): Side => (g === 'alpha' ? 'a' : 'b');
const adjacent = (g: Ang): Side => (g === 'alpha' ? 'b' : 'a');

const TRIPLES: [number, number, number][] = [
	[3, 4, 5],
	[5, 12, 13],
	[8, 15, 17],
	[7, 24, 25],
	[20, 21, 29],
	[12, 35, 37],
	[9, 40, 41],
];

// ---------------------------------------------------------------------------
// Level 1: the three ratios from the three sides

function level1(rng: Rng): Built {
	const [x, y, z] = rng.pick(TRIPLES);
	const k = rng.int(1, Math.max(1, Math.min(6, Math.floor(60 / z))));
	const [a, b] = rng.next() < 0.5 ? [x * k, y * k] : [y * k, x * k];
	const c = z * k;
	const side: Record<Side, number> = { a, b, c };
	const fn = rng.pick(['sin', 'cos', 'tan'] as const);
	const g = rng.pick(['alpha', 'beta'] as const);
	const segments = rng.next() < 0.4;
	const op = side[opposite(g)];
	const ad = side[adjacent(g)];
	const [n, d] = fn === 'sin' ? [op, c] : fn === 'cos' ? [ad, c] : [op, ad];
	const value = q(n, d);
	// Opposite and adjacent swapped, the ratio upside down, another ratio of the same angle, then the rest.
	const swapped = fn === 'sin' ? q(ad, c) : fn === 'cos' ? q(op, c) : q(ad, op);
	const wrongs = [swapped, q(d, n), fn === 'tan' ? q(op, c) : q(op, ad), q(ad, op), q(c, op), q(c, ad), q(op, c), q(ad, c)];
	const angleTex = segments ? `\\widehat{${g === 'alpha' ? 'BAC' : 'ABC'}}` : ANG[g];
	let data: string;
	if (segments) {
		const order = shuffle(rng, ['a', 'b', 'c'] as Side[]);
		const items = order.map((s) => `$\\overline{${SEG[s]}} = ${side[s]}$ cm`);
		data = `i lati misurano ${items[0]}, ${items[1]} e ${items[2]}`;
	} else if (rng.next() < 0.5) data = `i cateti misurano $a = ${a}$ cm e $b = ${b}$ cm, l'ipotenusa $c = ${c}$ cm`;
	else data = `l'ipotenusa misura $c = ${c}$ cm e i cateti $a = ${a}$ cm e $b = ${b}$ cm`;
	const question = segments ? `Quanto vale il ${FN_WORD[fn]} dell'angolo $${angleTex}$?` : `Quanto vale $\\${fn}${ANG[g]}$?`;
	const name = (s: Side) => (segments ? `\\overline{${SEG[s]}}` : s);
	const fnTex = `\\${fn}${segments ? ' ' : ''}${angleTex}`;
	const [ns, ds] = fn === 'sin' ? [opposite(g), 'c' as Side] : fn === 'cos' ? [adjacent(g), 'c' as Side] : [opposite(g), adjacent(g)];
	const raw = `\\frac{${n}}{${d}}`;
	const steps = [
		`${t("Rispetto all'angolo ")}${angleTex}${t(' il cateto opposto è ')}${name(opposite(g))}${t(', quello adiacente è ')}${name(adjacent(g))}`,
		`${fnTex} = \\frac{${name(ns)}}{${name(ds)}} = ${raw}${value.num === n ? '' : ` = ${value.toLatex()}`}`,
	];
	return {
		case: fn,
		prompt: 'Calcola il rapporto.',
		problem: textBlock(`Nel triangolo $ABC$ rettangolo in $C$ ${data}. ${question}`),
		solution: `${fnTex} = ${value.toLatex()}`,
		steps,
		answer: { kind: 'number', value: value.toString() },
		right: exactOpt(rad(value), '')!,
		wrong: wrongs.map((w) => exactOpt(rad(w), '')),
		params: { a, b, c, fn, angle: g, segments },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the exact values for 30, 45 and 60 degrees

const SIN: Record<number, Rad> = { 30: rad(q(1, 2)), 45: rad(q(1, 2), 2), 60: rad(q(1, 2), 3) };
const COS: Record<number, Rad> = { 30: rad(q(1, 2), 3), 45: rad(q(1, 2), 2), 60: rad(q(1, 2)) };
const TAN: Record<number, Rad> = { 30: rad(q(1, 3), 3), 45: rad(q(1)), 60: rad(q(1), 3) };
const NOTABLE: Record<Fn, Record<number, Rad>> = { sin: SIN, cos: COS, tan: TAN };
const NOTABLE_ANGLES = [30, 45, 60];
const POOL: Rad[] = [rad(q(1, 2)), rad(q(1, 2), 2), rad(q(1, 2), 3), rad(q(1)), rad(q(1), 3), rad(q(1, 3), 3)];
/** The same values before rationalising, as the lesson first finds them. */
function rawTex(x: Rad): string | null {
	if (radEq(x, rad(q(1, 2), 2))) return '\\frac{1}{\\sqrt{2}}';
	if (radEq(x, rad(q(1, 3), 3))) return '\\frac{1}{\\sqrt{3}}';
	return null;
}
const swapFn = (f: Fn, a: number): Rad => (f === 'sin' ? COS[a] : f === 'cos' ? SIN[a] : TAN[90 - a]);

function level2(rng: Rng): Built {
	const u = rng.next();
	const f = rng.pick(['sin', 'cos', 'tan'] as const);
	const a = rng.pick(NOTABLE_ANGLES);
	const v = NOTABLE[f][a];
	const opt = (x: Rad): ChoiceOption => toOption(exactOpt(x, '')!);
	const drawSteps = (ang: number) =>
		ang === 45
			? t('Metà quadrato di lato ') + `\\ell${t(': cateti ')}\\ell${t(', ipotenusa ')}\\ell\\sqrt{2}`
			: t('Metà triangolo equilatero di lato ') +
				`\\ell${t(': il cateto opposto a ')}${deg(30)}${t(' è ')}\\frac{\\ell}{2}${t(', quello opposto a ')}${deg(60)}${t(' è ')}\\frac{\\ell\\sqrt{3}}{2}`;
	const valueStep = (fn: Fn, ang: number) => {
		const x = NOTABLE[fn][ang];
		const r = rawTex(x);
		return `\\${fn} ${deg(ang)} = ${r ? `${r} = ` : ''}${ratioTex(x)}`;
	};
	if (u < 1 / 3) {
		const pool = shuffle(rng, POOL);
		const choice = buildChoice(rng, opt(v), [swapFn(f, a), NOTABLE[f][90 - a], ...pool].map(opt));
		return {
			case: 'valore',
			prompt: 'Scegli il valore esatto.',
			problem: textBlock(`Quanto vale $\\${f} ${deg(a)}$?`),
			solution: `\\${f} ${deg(a)} = ${ratioTex(v)}`,
			steps: [drawSteps(a), valueStep(f, a)],
			answer: choice,
			params: { fn: f, angle: a },
		};
	}
	if (u < 2 / 3) {
		const gFn = rng.pick((['sin', 'cos', 'tan'] as const).filter((x) => x !== f));
		const w = NOTABLE[gFn][a];
		const third = (['sin', 'cos', 'tan'] as const).find((x) => x !== f && x !== gFn)!;
		const pool = shuffle(rng, POOL);
		const choice = buildChoice(rng, opt(w), [NOTABLE[gFn][90 - a], v, NOTABLE[third][a], ...pool].map(opt));
		return {
			case: 'dal valore',
			prompt: 'Scegli il valore esatto.',
			problem: textBlock(`Di un angolo acuto $\\alpha$ si sa che $\\${f}\\alpha = ${ratioTex(v)}$. Quanto vale $\\${gFn}\\alpha$?`),
			solution: `\\${gFn}\\alpha = ${ratioTex(w)}`,
			steps: [`${t('Nella tabella ')}\\${f} ${deg(a)} = ${ratioTex(v)}${t(', quindi ')}\\alpha = ${deg(a)}`, drawSteps(a), valueStep(gFn, a)],
			answer: choice,
			params: { fn: f, angle: a, ask: gFn },
		};
	}
	// Which equality is true: one true, three false, each about a different value of the table.
	const pairs = shuffle(
		rng,
		(['sin', 'cos', 'tan'] as const).flatMap((fn) => NOTABLE_ANGLES.map((ang) => [fn, ang] as [Fn, number])),
	).filter(([fn, ang]) => !(fn === f && ang === a));
	const stmt = (fn: Fn, ang: number, x: Rad, raw: boolean): ChoiceOption => {
		const r = rawTex(x);
		const tex = raw && r ? r : ratioTex(x);
		return { latex: `\\${fn} ${deg(ang)} = ${tex}`, values: [`${fn}(${ang})=${radStr(x)}${raw && r ? ':raw' : ''}`] };
	};
	const right = stmt(f, a, v, rng.next() < 0.5);
	const wrongs: ChoiceOption[] = [];
	for (const [fn, ang] of pairs.slice(0, 3)) {
		const truth = NOTABLE[fn][ang];
		const sw = swapFn(fn, ang);
		const x = !radEq(sw, truth) ? sw : rng.pick(POOL.filter((p) => !radEq(p, truth)));
		wrongs.push(stmt(fn, ang, x, rng.next() < 0.3));
	}
	const choice = buildChoice(rng, right, wrongs);
	const falseSteps = pairs.slice(0, 3).map(([fn, ang]) => valueStep(fn, ang));
	return {
		case: 'uguaglianza vera',
		prompt: "Scegli l'uguaglianza vera.",
		problem: textBlock('Quale di queste uguaglianze è vera?'),
		solution: right.latex,
		steps: [valueStep(f, a), t('Le altre sono false, perché ') + falseSteps.join(',\\ ')],
		answer: choice,
		params: { fn: f, angle: a },
	};
}

// ---------------------------------------------------------------------------
// Level 3: from one value to the others

const TRIPLE_PAIRS: [number, number][] = [
	[3, 5],
	[4, 5],
	[5, 13],
	[12, 13],
	[8, 17],
	[15, 17],
	[7, 25],
	[24, 25],
];

const isSquare = (n: number) => Math.round(Math.sqrt(n)) ** 2 === n;

function level3(rng: Rng): Built {
	const triple = rng.next() < 0.4;
	let p: number;
	let d: number;
	if (triple) [p, d] = rng.pick(TRIPLE_PAIRS);
	else {
		for (;;) {
			d = rng.int(3, 11);
			p = rng.int(1, d - 1);
			if (gcd(p, d) === 1 && !isSquare(d * d - p * p) && !(p * 2 === d)) break;
		}
	}
	const given = rng.pick(['sin', 'cos'] as const);
	const other: Fn = given === 'sin' ? 'cos' : 'sin';
	const ask: Fn = rng.next() < 0.5 ? other : 'tan';
	const D = d * d - p * p;
	const s = rad(q(p, d)); // the given value
	const o = rad(q(1, d), D); // the other one, sqrt(D)/d
	const sin = given === 'sin' ? s : o;
	const cos = given === 'sin' ? o : s;
	const tan = radDiv(sin, cos);
	const value = ask === 'tan' ? tan : o;
	const oneMinus = rad(q(d - p, d));
	let wrong: Rad[];
	if (ask !== 'tan') {
		// 1 - sin, the square not rooted, 1 + sin² under the root, the given value itself.
		wrong = [oneMinus, rad(q(D, d * d)), rad(q(1, d), d * d + p * p), s, radMul(o, rad(q(2)))];
	} else {
		// cos / sin upside down, the other one computed as 1 - the given one, sin·cos, the other value alone.
		const wrongOther = oneMinus;
		const wrongTan = given === 'sin' ? radDiv(s, wrongOther) : radDiv(wrongOther, s);
		wrong = [radDiv(cos, sin), wrongTan, radMul(sin, cos), o, s];
	}
	const fnTex = (f: Fn) => `\\${f}\\alpha`;
	const oSq = `\\frac{${D}}{${d * d}}`;
	const steps = [
		`\\${other}^2\\alpha = 1 - \\${given}^2\\alpha = 1 - \\frac{${p * p}}{${d * d}} = ${oSq}`,
		`${fnTex(other)} = \\sqrt{${oSq}} = ${ratioTex(o)}${t(', positivo perché è un rapporto tra lunghezze')}`,
	];
	if (ask === 'tan') {
		const rootTex = isSquare(D) ? String(Math.sqrt(D)) : `\\sqrt{${D}}`;
		const direct = given === 'sin' ? `\\frac{${p}}{${rootTex}}` : `\\frac{${rootTex}}{${p}}`;
		const final = ratioTex(tan);
		steps.push(`\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha} = ${direct}${direct === final ? '' : ` = ${final}`}`);
	}
	return {
		case: triple ? 'terna' : 'radicale',
		prompt: 'Trova il valore esatto.',
		problem: textBlock(`Di un angolo acuto $\\alpha$ si sa che $${fnTex(given)} = \\frac{${p}}{${d}}$. Quanto vale $${fnTex(ask)}$?`),
		solution: `${fnTex(ask)} = ${ratioTex(value)}`,
		steps,
		answer: exactAnswer(value),
		right: exactOpt(value, '')!,
		wrong: wrong.map((w) => exactOpt(w, '')),
		params: { given, p, q: d, ask },
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: a side from a side and an angle

type Role = 'opp' | 'adj' | 'hyp';

/** The rule of the lesson from the given side to the asked one, for the angle phi. */
const RULES: { from: Role; to: Role; fn: Fn; mul: boolean; w: number }[] = [
	{ from: 'hyp', to: 'opp', fn: 'sin', mul: true, w: 2 },
	{ from: 'hyp', to: 'adj', fn: 'cos', mul: true, w: 2 },
	{ from: 'opp', to: 'hyp', fn: 'sin', mul: false, w: 1.5 },
	{ from: 'adj', to: 'hyp', fn: 'cos', mul: false, w: 1.5 },
	{ from: 'adj', to: 'opp', fn: 'tan', mul: true, w: 1.5 },
	{ from: 'opp', to: 'adj', fn: 'tan', mul: false, w: 1.5 },
];

function pickRule(rng: Rng) {
	const total = RULES.reduce((s, r) => s + r.w, 0);
	let x = rng.next() * total;
	for (const r of RULES) {
		x -= r.w;
		if (x < 0) return r;
	}
	return RULES[RULES.length - 1];
}

/** The other five operations, the likeliest mistakes first: sin and cos swapped, multiplied instead of divided. */
function otherOps(fn: Fn, mul: boolean): { fn: Fn; mul: boolean }[] {
	const sw: Fn = fn === 'sin' ? 'cos' : fn === 'cos' ? 'sin' : 'tan';
	const list: { fn: Fn; mul: boolean }[] = fn === 'tan' ? [{ fn: 'tan', mul: !mul }] : [{ fn: sw, mul }, { fn, mul: !mul }];
	for (const f of ['sin', 'cos', 'tan'] as Fn[]) for (const m of [mul, !mul]) if (!list.some((o) => o.fn === f && o.mul === m) && !(f === fn && m === mul)) list.push({ fn: f, mul: m });
	return list;
}

function sideName(role: Role, phi: Ang): Side {
	return role === 'hyp' ? 'c' : role === 'opp' ? opposite(phi) : adjacent(phi);
}


function sideAngleText(given: Side, x: string, phi: Ang, angle: string, target: Side): string {
	const g = given === 'c' ? `l'ipotenusa misura $c = ${x}$ cm` : `il cateto $${given}$ misura $${x}$ cm`;
	const q2 = target === 'c' ? "Quanto misura l'ipotenusa $c$?" : `Quanto misura il cateto $${target}$?`;
	return `Nel triangolo $ABC$ rettangolo in $C$ ${g} e l'angolo $${ANG[phi]}$ misura $${angle}$. ${q2}`;
}

function formulaTex(target: Side, given: Side, fn: Fn, mul: boolean, phi: Ang): string {
	return mul ? `${target} = ${given} \\cdot \\${fn}${ANG[phi]}` : `${target} = \\frac{${given}}{\\${fn}${ANG[phi]}}`;
}

function roleStep(target: Side, given: Side, phi: Ang): string {
	const word = (s: Side) => (s === 'c' ? t("l'ipotenusa") : s === opposite(phi) ? `${t('il cateto opposto a ')}${ANG[phi]}` : `${t('il cateto adiacente a ')}${ANG[phi]}`);
	return `${given}${t(' è ')}${word(given)}${t(', ')}${target}${t(' è ')}${word(target)}`;
}

function level4(rng: Rng): Built {
	for (;;) {
		const rule = pickRule(rng);
		const phi = rng.pick(['alpha', 'beta'] as const);
		const angle = rng.pick(NOTABLE_ANGLES);
		if (angle === 45 && rule.fn === 'tan') continue; // the other leg is the given one
		const given = sideName(rule.from, phi);
		const target = sideName(rule.to, phi);
		const x = rng.int(2, 20);
		const g = rad(q(x));
		const T = NOTABLE[rule.fn][angle];
		const value = rule.mul ? radMul(g, T) : radDiv(g, T);
		const wrong = otherOps(rule.fn, rule.mul).map((o) => {
			const W = NOTABLE[o.fn][angle];
			return o.mul ? radMul(g, W) : radDiv(g, W);
		});
		wrong.push(radMul(value, rad(q(2))), radMul(value, rad(q(1, 2))), rad(value.k.add(q(1)), value.r));
		const tT = ratioTex(T);
		const sub = rule.mul ? `${x} \\cdot ${tT}` : `\\frac{${x}}{${tT}}`;
		const steps = [roleStep(target, given, phi), `${formulaTex(target, given, rule.fn, rule.mul, phi)} = ${sub}`];
		if (!rule.mul && T.r !== 1) {
			// x / (m√r / n) = x·n / (m√r), then rationalised.
			const num = q(x).div(T.k); // x / (m/n) = x·n/m, the coefficient in front of 1/√r
			const before = num.isInteger() ? `\\frac{${num.num}}{\\sqrt{${T.r}}}` : `\\frac{${num.num}}{${num.den}\\sqrt{${T.r}}}`;
			steps.push(`${target} = ${before} = ${lenTex(value)}`);
		} else steps.push(`${target} = ${lenTex(value)}`);
		const unit: Unit = 'cm';
		return {
			case: rule.from === 'hyp' ? "dall'ipotenusa" : 'da un cateto',
			prompt: 'Trova la misura esatta.',
			problem: textBlock(sideAngleText(given, String(x), phi, deg(angle), target)),
			solution: `${target} = ${withUnit(lenTex(value), unit)}`,
			steps,
			answer: exactAnswer(value),
			right: exactOpt(value, unit)!,
			wrong: wrong.map((w) => exactOpt(w, unit)),
			params: { given, x, angle: phi, degrees: angle, target },
		};
	}
}

function level5(rng: Rng): Built {
	for (;;) {
		const rule = pickRule(rng);
		const phi = rng.pick(['alpha', 'beta'] as const);
		const angle = rng.int(10, 80);
		if (angle === 30 || angle === 45 || angle === 60) continue;
		const given = sideName(rule.from, phi);
		const target = sideName(rule.to, phi);
		const x = rng.int(3, 40);
		const f = (fn: Fn, a: number) => (fn === 'sin' ? Math.sin(a) : fn === 'cos' ? Math.cos(a) : Math.tan(a));
		const apply = (fn: Fn, mul: boolean, rads: boolean) => {
			const v = f(fn, rads ? angle : angle * RAD);
			return mul ? x * v : x / v;
		};
		const exact = apply(rule.fn, rule.mul, false);
		const k = round2(exact);
		if (k === null || exact < 1 || exact > 150) continue;
		const wrongOps = otherOps(rule.fn, rule.mul);
		// sin and cos swapped (or the tangent upside down), then the calculator in radians, then the others.
		const wrong = [
			approxOpt(apply(wrongOps[0].fn, wrongOps[0].mul, false), 'cm'),
			approxOpt(apply(rule.fn, rule.mul, true), 'cm'),
			...wrongOps.slice(1).map((o) => approxOpt(apply(o.fn, o.mul, false), 'cm')),
			approxOpt(exact + 1, 'cm'),
			approxOpt(exact - 1, 'cm'),
		];
		const v = fixed2(k);
		const trig = `\\${rule.fn} ${deg(angle)}`;
		const sub = rule.mul ? `${x} \\cdot ${trig}` : `\\frac{${x}}{${trig}}`;
		const steps = [roleStep(target, given, phi), `${formulaTex(target, given, rule.fn, rule.mul, phi)} = ${sub}`, `${target} \\approx ${v}`];
		return {
			case: rule.from === 'hyp' ? "dall'ipotenusa" : 'da un cateto',
			prompt: 'Usa la calcolatrice e arrotonda al centesimo.',
			problem: textBlock(sideAngleText(given, String(x), phi, deg(angle), target)),
			solution: `${target} \\approx ${withUnit(v, 'cm')}`,
			steps,
			answer: { kind: 'number', value: q(k, 100).toString() },
			right: approxOpt(k / 100, 'cm')!,
			wrong,
			params: { given, x, angle: phi, degrees: angle, target },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: an angle from two sides

function level6(rng: Rng): Built {
	for (;;) {
		const legs = rng.next() < 0.5;
		const phi = rng.pick(['alpha', 'beta'] as const);
		let side: Partial<Record<Side, number>>;
		let fn: Fn;
		let num: number;
		let den: number;
		if (legs) {
			const a = rng.int(2, 30);
			const b = rng.int(2, 30);
			if (a === b) continue;
			side = { a, b };
			fn = 'tan';
			num = side[opposite(phi)]!;
			den = side[adjacent(phi)]!;
		} else {
			const c = rng.int(3, 40);
			const leg = rng.int(1, c - 1);
			if (2 * leg === c) continue; // 30 or 60 degrees
			const which = rng.pick(['a', 'b'] as const);
			side = { c, [which]: leg };
			fn = which === opposite(phi) ? 'sin' : 'cos';
			num = leg;
			den = c;
		}
		const ratio = num / den;
		if (fn !== 'tan' && (ratio < 0.15 || ratio > 0.95)) continue;
		if (fn === 'tan' && (ratio < 0.15 || ratio > 6.5)) continue;
		const inv = (f: Fn, r: number) => (f === 'sin' ? asinD(r) : f === 'cos' ? acosD(r) : atanD(r));
		const exact = inv(fn, ratio);
		const k = round2(exact);
		if (k === null || exact < 5 || exact > 85) continue;
		const radians = exact * RAD;
		const others = (['sin', 'cos', 'tan'] as Fn[]).filter((f) => f !== fn && (f === 'tan' || ratio < 1));
		const wrong = [
			approxOpt(90 - exact, 'deg'),
			approxOpt(radians, 'deg'),
			...others.map((f) => approxOpt(inv(f, ratio), 'deg')),
			approxOpt(exact + 1, 'deg'),
			approxOpt(exact - 1, 'deg'),
		];
		const r = q(num, den);
		const given = (Object.keys(side) as Side[]).sort((x, y) => (x === 'c' ? 1 : y === 'c' ? -1 : x < y ? -1 : 1));
		const data = legs
			? `i cateti misurano $a = ${side.a}$ cm e $b = ${side.b}$ cm`
			: `l'ipotenusa misura $c = ${side.c}$ cm e il cateto $${given[0]}$ misura $${side[given[0]]}$ cm`;
		const [ns, ds] = fn === 'sin' ? [opposite(phi), 'c'] : fn === 'cos' ? [adjacent(phi), 'c'] : [opposite(phi), adjacent(phi)];
		const rawFrac = `\\frac{${num}}{${den}}`;
		const rTex = r.toLatex();
		const v = fixed2(k);
		const steps = [
			legs
				? t('Con i due cateti si usa la tangente')
				: `${given[0]}${t(fn === 'sin' ? ' è il cateto opposto a ' : ' è il cateto adiacente a ')}${ANG[phi]}${t(fn === 'sin' ? ': si usa il seno' : ': si usa il coseno')}`,
			`\\${fn}${ANG[phi]} = \\frac{${ns}}{${ds}} = ${rawFrac}${rawFrac === rTex ? '' : ` = ${rTex}`}`,
			`${ANG[phi]} = \\${fn}^{-1}\\left(${rTex}\\right) \\approx ${deg(v)}`,
		];
		return {
			case: legs ? 'due cateti' : fn === 'sin' ? 'ipotenusa e cateto opposto' : 'ipotenusa e cateto adiacente',
			prompt: "Trova l'angolo e arrotonda al centesimo di grado.",
			problem: textBlock(`Nel triangolo $ABC$ rettangolo in $C$ ${data}. Quanto misura l'angolo $${ANG[phi]}$?`),
			solution: `${ANG[phi]} \\approx ${deg(v)}`,
			steps,
			answer: { kind: 'number', value: q(k, 100).toString() },
			right: approxOpt(k / 100, 'deg')!,
			wrong,
			params: { ...side, angle: phi, fn },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 7: problems

const OBJECTS = [
	{ a: 'un albero', the: "l'albero", alto: 'alto', lo: 4, hi: 30 },
	{ a: 'un lampione', the: 'il lampione', alto: 'alto', lo: 4, hi: 12 },
	{ a: 'un campanile', the: 'il campanile', alto: 'alto', lo: 15, hi: 90 },
	{ a: 'una torre', the: 'la torre', alto: 'alta', lo: 15, hi: 90 },
	{ a: 'un palazzo', the: 'il palazzo', alto: 'alto', lo: 10, hi: 60 },
];
const EYES = [q(3, 2), q(8, 5), q(17, 10), q(9, 5)];
const SLOPES = [5, 6, 8, 10, 12, 15, 20];
const LADDERS = [q(5, 2), q(3), q(7, 2), q(4), q(9, 2), q(5), q(6), q(7), q(8)];

/** "del 5%", "dell'8%". */
const slopeText = (p: number) => `${p === 8 ? "dell'" : 'del '}$${p}\\%$`;

function elevation(rng: Rng): Built {
	for (;;) {
		const o = rng.pick(OBJECTS);
		const d = rng.int(8, 60);
		const angle = rng.int(15, 70);
		if (angle === 30 || angle === 45 || angle === 60) continue;
		const eyes = rng.next() < 0.6 ? rng.pick(EYES) : null;
		const e = eyes ? fl(eyes) : 0;
		const x = d * tanD(angle);
		const exact = x + e;
		const k = round2(exact);
		if (k === null || exact < o.lo || exact > o.hi) continue;
		const wrong = [
			eyes ? approxOpt(x, 'm') : null,
			approxOpt(d * sinD(angle) + e, 'm'),
			approxOpt(d * Math.tan(angle) + e, 'm'),
			approxOpt(d / tanD(angle) + e, 'm'),
			eyes ? approxOpt(x + 2 * e, 'm') : null,
			approxOpt(exact + 1, 'm'),
			approxOpt(exact - 1, 'm'),
		];
		const v = fixed2(k);
		const problem = eyes
			? `Da $${d}$ m di distanza dal piede di ${o.a} vedi la cima con un angolo di elevazione di $${deg(angle)}$. I tuoi occhi sono a $${numTex(eyes)}$ m da terra. Quanto è ${o.alto} ${o.the}?`
			: `Un goniometro appoggiato a terra, a $${d}$ m dal piede di ${o.a}, ne vede la cima con un angolo di elevazione di $${deg(angle)}$. Quanto è ${o.alto} ${o.the}?`;
		const xk = Math.round(x * 100);
		const steps = [
			t('Il cateto orizzontale di ') + `${d}\\ ${t('m')}${t(' è adiacente all\'angolo di ')}${deg(angle)}${t(", l'altezza ")}x${t(' è il cateto opposto')}`,
			`x = ${d} \\cdot \\tan ${deg(angle)} \\approx ${fixed2(xk)}`,
		];
		if (eyes) steps.push(t("Il cateto parte dall'altezza degli occhi: ") + `${fixed2(xk)} + ${numTex(eyes)} = ${v}`);
		return {
			case: 'elevazione',
			prompt: 'Risolvi il problema e arrotonda al centesimo.',
			problem: textBlock(problem),
			solution: `h \\approx ${withUnit(v, 'm')}`,
			steps,
			answer: { kind: 'number', value: q(k, 100).toString() },
			right: approxOpt(k / 100, 'm')!,
			wrong,
			params: { story: 'elevazione', d, degrees: angle, eyes: eyes ? eyes.toString() : null },
		};
	}
}

function ramp(rng: Rng): Built {
	for (;;) {
		const h = q(rng.int(3, 12), 10);
		const p = rng.pick(SLOPES);
		const ask = rng.pick(['orizzontale', 'angolo', 'rampa'] as const);
		const horiz = h.mul(q(100, p));
		if (horiz.isInteger()) continue;
		const hf = fl(h);
		const of = fl(horiz);
		const lenRamp = Math.sqrt(of * of + hf * hf);
		const angle = atanD(p / 100);
		const exact = ask === 'orizzontale' ? of : ask === 'angolo' ? angle : lenRamp;
		const k = round2(exact);
		if (k === null) continue;
		const unit: Unit = ask === 'angolo' ? 'deg' : 'm';
		const exactHoriz = (decimals(horiz) ?? 9) <= 2;
		const v = fixed2(k);
		let wrong: (Opt | null)[];
		const steps = [t('La pendenza è la tangente: ') + `\\tan\\alpha = \\frac{${p}}{100} = ${numTex(q(p, 100))}${t(', e il dislivello è il cateto opposto ad ')}\\alpha`];
		const oTex = exactHoriz ? `= ${numTex(horiz)}` : `\\approx ${fixed2(Math.round(of * 100))}`;
		if (ask === 'angolo') {
			wrong = [approxOpt(p, 'deg'), approxOpt(90 - angle, 'deg'), approxOpt(Math.atan(p / 100), 'deg'), approxOpt(angle + 1, 'deg'), approxOpt(angle - 1, 'deg')];
			steps.push(`\\alpha = \\tan^{-1}(${numTex(q(p, 100))}) \\approx ${deg(v)}`);
		} else {
			steps.push(`${t('orizzontale')} = \\frac{${numTex(h)}}{${numTex(q(p, 100))}} ${oTex}`);
			if (ask === 'orizzontale')
				wrong = [approxOpt(hf / tanD(p), 'm'), approxOpt(lenRamp, 'm'), approxOpt(of + hf, 'm'), approxOpt((hf * p) / 100, 'm'), approxOpt(of + 1, 'm'), approxOpt(of - 1, 'm')];
			else {
				steps.push(`${t('rampa')} = \\sqrt{${exactHoriz ? numTex(horiz) : `\\left(\\frac{${numTex(h)}}{${numTex(q(p, 100))}}\\right)`}^2 + ${numTex(h)}^2} \\approx ${v}`);
				wrong = [approxOpt(of, 'm'), approxOpt(of + hf, 'm'), approxOpt(hf / sinD(p), 'm'), approxOpt(lenRamp + 1, 'm'), approxOpt(lenRamp - 1, 'm')];
			}
		}
		const question = { orizzontale: 'Quanto è lunga in orizzontale?', angolo: 'Che angolo forma con il terreno?', rampa: 'Quanto è lunga la rampa?' }[ask];
		const symbol = ask === 'orizzontale' ? t('orizzontale') : ask === 'angolo' ? '\\alpha' : t('rampa');
		const sol = ask === 'orizzontale' && exactHoriz ? `= ${withUnit(numTex(horiz), 'm')}` : `\\approx ${withUnit(v, unit)}`;
		return {
			case: 'rampa',
			prompt: ask === 'orizzontale' && exactHoriz ? 'Risolvi il problema.' : 'Risolvi il problema e arrotonda al centesimo.',
			problem: textBlock(`Una rampa deve superare un dislivello di $${numTex(h)}$ m con una pendenza ${slopeText(p)}. ${question}`),
			solution: `${symbol} ${sol}`,
			steps,
			answer: { kind: 'number', value: q(k, 100).toString() },
			right: approxOpt(k / 100, unit)!,
			wrong,
			params: { story: 'rampa', h: h.toString(), slope: p, ask },
		};
	}
}

function ladder(rng: Rng): Built {
	for (;;) {
		const L = rng.pick(LADDERS);
		const lf = fl(L);
		const ask = rng.pick(['altezza', 'piede', 'angolo'] as const);
		if (ask === 'angolo') {
			const d = q(rng.int(5, Math.floor(lf * 10 * 0.55)), 10);
			const r = fl(d) / lf;
			const angle = acosD(r);
			const k = round2(angle);
			if (k === null || angle < 55 || angle > 82) continue;
			const v = fixed2(k);
			const wrong = [approxOpt(90 - angle, 'deg'), approxOpt(Math.acos(r), 'deg'), approxOpt(atanD(r), 'deg'), approxOpt(angle + 1, 'deg'), approxOpt(angle - 1, 'deg')];
			return {
				case: 'scala',
				prompt: "Trova l'angolo e arrotonda al centesimo di grado.",
				problem: textBlock(`Una scala lunga $${numTex(L)}$ m è appoggiata a un muro verticale, con il piede a $${numTex(d)}$ m dal muro. Che angolo forma con il pavimento?`),
				solution: `\\alpha \\approx ${deg(v)}`,
				steps: [
					t("La scala è l'ipotenusa, la distanza del piede dal muro è il cateto adiacente all'angolo con il pavimento"),
					`\\cos\\alpha = \\frac{${numTex(d)}}{${numTex(L)}}`,
					`\\alpha = \\cos^{-1}\\left(\\frac{${numTex(d)}}{${numTex(L)}}\\right) \\approx ${deg(v)}`,
				],
				answer: { kind: 'number', value: q(k, 100).toString() },
				right: approxOpt(k / 100, 'deg')!,
				wrong,
				params: { story: 'scala', L: L.toString(), d: d.toString(), ask },
			};
		}
		const angle = rng.int(55, 80);
		if (angle === 60) continue;
		const exact = ask === 'altezza' ? lf * sinD(angle) : lf * cosD(angle);
		const k = round2(exact);
		if (k === null) continue;
		const v = fixed2(k);
		const other = ask === 'altezza' ? lf * cosD(angle) : lf * sinD(angle);
		const radMode = ask === 'altezza' ? lf * Math.sin(angle) : lf * Math.cos(angle);
		const wrong = [approxOpt(other, 'm'), approxOpt(radMode, 'm'), approxOpt(lf * tanD(ask === 'altezza' ? angle : 90 - angle), 'm'), approxOpt(exact + 1, 'm'), approxOpt(exact - 1, 'm')];
		const fn = ask === 'altezza' ? 'sin' : 'cos';
		const letter = ask === 'altezza' ? 'h' : 'd';
		const question = ask === 'altezza' ? 'A che altezza arriva sul muro?' : 'A che distanza dal muro sta il piede della scala?';
		return {
			case: 'scala',
			prompt: 'Risolvi il problema e arrotonda al centesimo.',
			problem: textBlock(`Una scala lunga $${numTex(L)}$ m è appoggiata a un muro verticale e forma con il pavimento un angolo di $${deg(angle)}$. ${question}`),
			solution: `${letter} \\approx ${withUnit(v, 'm')}`,
			steps: [
				t("La scala è l'ipotenusa; ") + t(ask === 'altezza' ? "l'altezza sul muro è il cateto opposto all'angolo di " : "la distanza dal muro è il cateto adiacente all'angolo di ") + deg(angle),
				`${letter} = ${numTex(L)} \\cdot \\${fn} ${deg(angle)} \\approx ${v}`,
			],
			answer: { kind: 'number', value: q(k, 100).toString() },
			right: approxOpt(k / 100, 'm')!,
			wrong,
			params: { story: 'scala', L: L.toString(), degrees: angle, ask },
		};
	}
}

function level7(rng: Rng): Built {
	const u = rng.next();
	return u < 0.4 ? elevation(rng) : u < 0.7 ? ramp(rng) : ladder(rng);
}

// ---------------------------------------------------------------------------

function build(rng: Rng, level: number): Built {
	switch (level) {
		case 1:
			return level1(rng);
		case 2:
			return level2(rng);
		case 3:
			return level3(rng);
		case 4:
			return level4(rng);
		case 5:
			return level5(rng);
		case 6:
			return level6(rng);
		case 7:
			return level7(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

const BANNED = /—|piuttosto che/;

function check(sample: Sample): string[] {
	const v: string[] = [];
	const lvl = sample.level;
	const a = sample.answer;
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('trattino lungo o "piuttosto che"');
	if (lvl === 2) {
		if (a.kind !== 'choice') return ['risposta non a scelta'];
		if (a.options.length !== 4) v.push('servono 4 opzioni');
		return v;
	}
	if (a.kind !== 'number' && a.kind !== 'expression') return ['risposta a scelta dove serve un valore'];
	const right = sample.params.right as Opt | undefined;
	if (!right || right.value !== a.value) v.push('opzione giusta diversa dalla risposta');
	if (a.kind === 'number') {
		const r = Rational.parse(a.value);
		if (r.sign() <= 0) v.push('risposta non positiva');
		if (lvl >= 5 && r.den > 100) v.push('risposta non al centesimo');
		if ((lvl === 1 || lvl === 3) && fl(r) >= (sample.params.fn === 'tan' || sample.params.ask === 'tan' ? 10 : 1)) v.push('rapporto fuori scala');
	} else if (lvl !== 3 && lvl !== 4) v.push('risposta esatta con radicale fuori dai livelli 3 e 4');
	if (lvl === 6 || (lvl === 7 && sample.params.ask === 'angolo')) {
		const r = fl(Rational.parse((a as { value: string }).value));
		if (r <= 0 || r >= 90) v.push('angolo non acuto');
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const right = sample.params.right as Opt;
	const wrong = sample.params.wrong as Opt[];
	return buildChoice(rng, toOption(right), wrong.map(toOption));
}

export const triangoloRettangoloTrigonometria: Generator = {
	id: ID,
	title: 'Seno, coseno e tangente nel triangolo rettangolo',
	levels: {
		1: { label: 'Seno, coseno e tangente dai lati', constraints: ['terne pitagoriche con lati fino a 60 cm', 'rapporto ridotto ai minimi termini'] },
		2: { label: 'I valori per 30, 45 e 60 gradi', constraints: ['un terzo il valore, un terzo da un valore a un altro, un terzo l\'uguaglianza vera'] },
		3: { label: 'Da un valore agli altri due', constraints: ['seno o coseno p/q, q fino a 25', '4 su 10 con una terna pitagorica, gli altri con un radicale'] },
		4: { label: 'Un lato con i valori esatti', constraints: ['angolo di 30, 45 o 60 gradi', 'lato dato intero da 2 a 20 cm', 'risultato razionalizzato'] },
		5: { label: 'Un lato con la calcolatrice', constraints: ['angolo intero da 10 a 80 gradi, non 30, 45, 60', 'lato dato intero da 3 a 40 cm', 'risultato al centesimo'] },
		6: { label: "L'angolo da due lati", constraints: ['due cateti o ipotenusa e cateto, interi', 'angolo tra 5 e 85 gradi, al centesimo'] },
		7: { label: 'Problemi', constraints: ['angolo di elevazione 4 su 10, rampa 3 su 10, scala 3 su 10', 'risultato al centesimo'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const b = build(rng, level);
			const params: Record<string, unknown> = { case: b.case, ...b.params };
			if (b.right) {
				params.right = b.right;
				params.wrong = (b.wrong ?? []).filter((w): w is Opt => w !== null && w.value !== b.right!.value && w.latex !== b.right!.latex);
			}
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer: b.answer,
				params,
			};
			if (check(sample).length > 0) continue;
			try {
				toChoice(sample, rng);
			} catch {
				continue;
			}
			return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default triangoloRettangoloTrigonometria;
