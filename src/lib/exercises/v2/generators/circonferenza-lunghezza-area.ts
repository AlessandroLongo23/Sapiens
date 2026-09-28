/**
 * Lunghezza della circonferenza e area del cerchio. Spec: specs/exercises/circonferenza-lunghezza-area.md
 *
 * Eight levels in the order of the lesson (docs/lezioni/riscritte/99-circonferenza-lunghezza-area.md):
 * circumference and area from the radius or the diameter, the inverse formulas with π, the same with
 * π ≈ 3,14 (and the wheel), arcs, sectors, the annulus, the circular segment of 90° and 60°, composite
 * figures. No figures: every exercise stands on its text. Measures with π are exact values
 * a + bπ + cπ² + d√3 with rational coefficients (the π² only appears in a distractor), written as the
 * lesson writes them ($12\pi$, $9\pi - 18$, $6\pi - 9\sqrt{3}$). Answers without π are exact numbers.
 * The multiple choice takes its distractors from the mistakes the lesson warns about.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { buildChoice, weighted } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'circonferenza-lunghezza-area';

const t = (s: string) => `\\text{${s}}`;

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

/** 12, 3{,}14, \frac{10}{3}: a positive number as the lesson writes it. */
function numTex(r: Rational): string {
	if (r.isInteger()) return String(r.num);
	const k = decimals(r);
	if (k === null) return `\\frac{${r.num}}{${r.den}}`;
	const s = String(Math.round((r.num * 10 ** k) / r.den)).padStart(k + 1, '0');
	return `${s.slice(0, s.length - k)}{,}${s.slice(s.length - k)}`;
}

/** 141\\,300: a number of five digits or more with the thin space of the lesson (100\\,000 cm). */
function thousands(r: Rational): string {
	const s = numTex(r);
	const [int, dec] = s.split('{,}');
	if (int.length < 5) return s;
	const grouped = int.replace(/\B(?=(\d{3})+$)/g, '\\,');
	return dec === undefined ? grouped : `${grouped}{,}${dec}`;
}

/** An exact measure a + bπ + cπ² + d√3. */
type Val = [Rational, Rational, Rational, Rational];
const BASIS_TEX = ['', '\\pi', '\\pi^2', '\\sqrt{3}'];
const BASIS_SYM = ['', '*pi', '*pi**2', '*sqrt(3)'];
const BASIS_NUM = [1, Math.PI, Math.PI ** 2, Math.sqrt(3)];

const rq = (n: Rational | number) => (typeof n === 'number' ? q(n) : n);
const val = (a: Rational | number = 0, b: Rational | number = 0, c: Rational | number = 0, d: Rational | number = 0): Val => [rq(a), rq(b), rq(c), rq(d)];
const piv = (k: Rational | number) => val(0, k);
const plus = (x: Val, y: Val) => x.map((u, i) => u.add(y[i])) as Val;
const minus = (x: Val, y: Val) => x.map((u, i) => u.sub(y[i])) as Val;
const times = (x: Val, k: Rational | number) => x.map((u) => u.mul(rq(k))) as Val;
const same = (x: Val, y: Val) => x.every((u, i) => u.equals(y[i]));
const approx = (x: Val) => x.reduce((s, u, i) => s + (u.num / u.den) * BASIS_NUM[i], 0);
const isRat = (x: Val) => x.slice(1).every((u) => u.isZero());
const ser = (x: Val) => x.map((u) => u.toString());
const des = (xs: string[]) => xs.map((s) => Rational.parse(s)) as Val;

/** Terms in writing order: constant, π, π², √3, but starting with the first positive one (9π - 18, 64 - 16π). */
function termOrder(x: Val): number[] {
	const idx = [0, 1, 2, 3].filter((i) => !x[i].isZero());
	const first = idx.findIndex((i) => x[i].sign() > 0);
	if (first > 0) idx.unshift(...idx.splice(first, 1));
	return idx;
}

function coefTex(k: Rational, i: number): string {
	if (i === 0) return numTex(k);
	if (k.isOne()) return BASIS_TEX[i];
	return `${k.isInteger() ? k.num : `\\frac{${k.num}}{${k.den}}`}${BASIS_TEX[i]}`;
}

function valTex(x: Val): string {
	const idx = termOrder(x);
	if (!idx.length) return '0';
	return idx
		.map((i, n) => {
			const k = x[i];
			const body = coefTex(k.abs(), i);
			if (n === 0) return k.sign() < 0 ? `-${body}` : body;
			return `${k.sign() < 0 ? ' - ' : ' + '}${body}`;
		})
		.join('');
}

function valSym(x: Val): string {
	const idx = termOrder(x);
	if (!idx.length) return '0';
	return idx
		.map((i, n) => {
			const k = x[i].abs();
			const c = k.isInteger() ? `${k.num}` : `(${k.num}/${k.den})`;
			const body = i === 0 ? c : k.isOne() ? BASIS_SYM[i].slice(1) : `${c}${BASIS_SYM[i]}`;
			if (n === 0) return x[i].sign() < 0 ? `-${body}` : body;
			return `${x[i].sign() < 0 ? '-' : '+'}${body}`;
		})
		.join('');
}

type Unit = 'cm' | 'cm2' | 'deg' | 'giri';

function withUnit(tex: string, unit: Unit): string {
	if (unit === 'cm') return `${tex}\\text{ cm}`;
	if (unit === 'cm2') return `${tex}\\ \\text{cm}^2`;
	if (unit === 'deg') return `${tex}^\\circ`;
	return `${tex}\\text{ giri}`;
}

const measure = (x: Val, unit: Unit) => withUnit(valTex(x), unit);
const cm = (n: number | Rational) => withUnit(numTex(rq(n)), 'cm');
const cm2 = (x: Val) => measure(x, 'cm2');
const deg = (n: number) => `${n}^\\circ`;

// ---------------------------------------------------------------------------

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	value: Val;
	unit: Unit;
	wrong: Val[];
	params: Record<string, unknown>;
}

const PROMPT_PI = 'Risolvi il problema. Lascia indicato π nel risultato.';
const PROMPT = 'Risolvi il problema.';

// ---------------------------------------------------------------------------
// Level 1: circumference and area from the radius or the diameter

function level1(rng: Rng): Built {
	const c = rng.pick(['C-r', 'C-d', 'A-r', 'A-d'] as const);
	if (c === 'C-r' || c === 'C-d') {
		const byR = c === 'C-r';
		const n = byR ? rng.int(2, 25) : rng.int(3, 40);
		const value = piv(byR ? 2 * n : n);
		// With r: 2πd (the diameter in 2πr), πr (the 2 forgotten), πr² (the area). With d: 2πd, πd/2, the area.
		const wrong = byR ? [piv(4 * n), piv(n), piv(n * n)] : [piv(2 * n), piv(q(n, 2)), piv(q(n * n, 4)), piv(n * n)];
		return {
			case: c,
			prompt: PROMPT_PI,
			problem: textBlock(`Quanto è lunga una circonferenza di ${byR ? 'raggio' : 'diametro'} $${n}$ cm?`),
			solution: `C = ${measure(value, 'cm')}`,
			steps: byR
				? [`C = 2\\pi r`, `C = 2\\pi \\cdot ${n} = ${measure(value, 'cm')}`]
				: [`${t('Con il diametro si usa ')}C = \\pi d`, `C = \\pi \\cdot ${n} = ${measure(value, 'cm')}`],
			value,
			unit: 'cm',
			wrong,
			params: { given: byR ? 'raggio' : 'diametro', n },
		};
	}
	const byR = c === 'A-r';
	const r = rng.int(2, 20);
	const d = 2 * r;
	const value = piv(r * r);
	// 2πr as the area, πd² (the diameter squared), 2πr² ; with d also πd.
	const wrong = byR ? [piv(2 * r), piv(4 * r * r), piv(2 * r * r)] : [piv(d * d), piv(d), piv(2 * d), piv(2 * r * r)];
	const steps = byR ? [`A = \\pi r^2`, `A = \\pi \\cdot ${r}^2 = ${cm2(value)}`] : [`r = ${d} : 2 = ${cm(r)}`, `A = \\pi \\cdot ${r}^2 = ${cm2(value)}`];
	return {
		case: c,
		prompt: PROMPT_PI,
		problem: textBlock(`Qual è l'area di un cerchio di ${byR ? 'raggio' : 'diametro'} $${byR ? r : d}$ cm?`),
		solution: `A = ${cm2(value)}`,
		steps,
		value,
		unit: 'cm2',
		wrong,
		params: { given: byR ? 'raggio' : 'diametro', n: byR ? r : d },
	};
}

// ---------------------------------------------------------------------------
// Level 2: back to the radius, and from one measure to the other, with π

function level2(rng: Rng): Built {
	const c = rng.pick(['r-C', 'r-A', 'A-C', 'C-A'] as const);
	const r = c === 'r-C' ? rng.int(2, 25) : rng.int(2, 20);
	const C = piv(2 * r);
	const A = piv(r * r);
	const circ = `Una circonferenza è lunga $${valTex(C)}$ cm.`;
	const area = `Un cerchio ha l'area di $${cm2(A)}$.`;
	const fromC = [`2\\pi r = ${valTex(C)}`, `r = \\frac{${valTex(C)}}{2\\pi} = ${cm(r)}`];
	const fromA = [`\\pi r^2 = ${valTex(A)}`, `r^2 = ${r * r}`, `r = ${cm(r)}${t(', la soluzione positiva')}`];
	if (c === 'r-C' || c === 'r-A') {
		const byC = c === 'r-C';
		const askD = rng.next() < 0.3;
		const want = askD ? 2 * r : r;
		// From C: the diameter (C divided by π only), r with π left in, 4r. From A: r² (no root), the diameter, r with π.
		// Asking the diameter: the radius, and the same mistakes doubled.
		const wrong = byC
			? askD
				? [val(r), piv(2 * r), val(4 * r)]
				: [val(2 * r), piv(r), val(4 * r)]
			: askD
				? [val(r), val(r * r), piv(2 * r), val(2 * r * r)]
				: [val(r * r), val(2 * r), piv(r), val(q(r * r, 2))];
		const steps = byC ? [...fromC] : [...fromA];
		if (askD) steps.push(`d = 2 \\cdot ${r} = ${cm(want)}`);
		return {
			case: c,
			prompt: PROMPT,
			problem: textBlock(`${byC ? circ : area} Quanto misura il ${askD ? 'diametro' : 'raggio'}?`),
			solution: `${askD ? 'd' : 'r'} = ${cm(want)}`,
			steps,
			value: val(want),
			unit: 'cm',
			wrong,
			params: { r, ask: askD ? 'diametro' : 'raggio' },
		};
	}
	if (c === 'A-C') {
		// C² without the radius, the diameter as the radius, C·r without the 2, C itself.
		const wrong = [val(0, 0, 4 * r * r), piv(4 * r * r), piv(2 * r * r), C];
		return {
			case: c,
			prompt: PROMPT_PI,
			problem: textBlock(`${circ} Qual è l'area del cerchio?`),
			solution: `A = ${cm2(A)}`,
			steps: [...fromC, `A = \\pi \\cdot ${r}^2 = ${cm2(A)}`],
			value: A,
			unit: 'cm2',
			wrong,
			params: { r },
		};
	}
	// C from A: πr, 4πr (the diameter), 2πr² (A doubled).
	const wrong = [piv(r), piv(4 * r), piv(2 * r * r)];
	return {
		case: c,
		prompt: PROMPT_PI,
		problem: textBlock(`${area} Quanto è lunga la circonferenza?`),
		solution: `C = ${measure(C, 'cm')}`,
		steps: [...fromA, `C = 2\\pi \\cdot ${r} = ${measure(C, 'cm')}`],
		value: C,
		unit: 'cm',
		wrong,
		params: { r },
	};
}

// ---------------------------------------------------------------------------
// Level 3: with π ≈ 3,14

const PI = q(314, 100);

function level3(rng: Rng): Built {
	const c = weighted(rng, [
		['r-C', 35],
		['r-A', 35],
		['ruota', 30],
	] as ['r-C' | 'r-A' | 'ruota', number][]);
	const approxText = 'con $\\pi \\approx 3{,}14$';
	if (c === 'r-C') {
		const r = rng.int(2, 30);
		const C = PI.mul(q(2 * r));
		const d = 2 * r;
		return {
			case: c,
			prompt: PROMPT,
			problem: textBlock(`Una circonferenza è lunga $${numTex(C)}$ cm. Quanto misura il raggio, ${approxText}?`),
			solution: `r = ${cm(r)}`,
			steps: [`d = ${numTex(C)} : 3{,}14 = ${cm(d)}`, `r = ${d} : 2 = ${cm(r)}`],
			value: val(r),
			unit: 'cm',
			// The diameter, C : 2 (π forgotten), r + 1 would be a guess: the fallback fills.
			wrong: [val(d), val(C.mul(q(1, 2))), val(4 * r)],
			params: { r },
		};
	}
	if (c === 'r-A') {
		const r = rng.int(3, 20);
		const A = PI.mul(q(r * r));
		return {
			case: c,
			prompt: PROMPT,
			problem: textBlock(`Un cerchio ha l'area di $${numTex(A)}\\ \\text{cm}^2$. Quanto misura il raggio, ${approxText}?`),
			solution: `r = ${cm(r)}`,
			steps: [`r^2 = ${numTex(A)} : 3{,}14 = ${r * r}`, `r = \\sqrt{${r * r}} = ${cm(r)}`],
			value: val(r),
			unit: 'cm',
			// r² (no root), the diameter, r² : 2.
			wrong: [val(r * r), val(2 * r), val(q(r * r, 2))],
			params: { r },
		};
	}
	// The wheel: diameter d cm, n turns, distance in metres.
	const d = 10 * rng.int(4, 9);
	const n = 50 * rng.int(2, 20);
	const C = PI.mul(q(d));
	const dist = C.mul(q(n, 100));
	return {
		case: c,
		prompt: PROMPT,
		problem: textBlock(`Una ruota ha il diametro di $${d}$ cm. Quanti giri fa per percorrere $${numTex(dist)}$ m, ${approxText}?`),
		solution: withUnit(String(n), 'giri'),
		steps: [
			t('A ogni giro la ruota avanza di una circonferenza: ') + `C = 3{,}14 \\cdot ${d} = ${cm(C)}`,
			`${numTex(dist)}\\text{ m} = ${withUnit(thousands(dist.mul(q(100))), 'cm')}`,
			`${thousands(dist.mul(q(100)))} : ${numTex(C)} = ${n}`,
		],
		value: val(n),
		unit: 'giri',
		// 2πd (half the turns), πr (twice), metres not converted.
		wrong: [val(n / 2), val(2 * n), val(q(n, 100))],
		params: { d, n },
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: arcs and sectors

const ANGLES = [30, 36, 40, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270];

function gcd(a: number, b: number): number {
	return b ? gcd(b, a % b) : a;
}

function level4(rng: Rng): Built {
	const c = weighted(rng, [
		['arco', 60],
		["angolo dall'arco", 40],
	] as ['arco' | "angolo dall'arco", number][]);
	const a = rng.pick(ANGLES);
	const m = 180 / gcd(a, 180); // r must be a multiple of m for ℓ = πrα/180 to be a whole multiple of π
	const r = m * rng.int(1, Math.floor(30 / m));
	const k = (r * a) / 180;
	const l = piv(k);
	if (c === 'arco') {
		return {
			case: c,
			prompt: PROMPT_PI,
			problem: textBlock(`In una circonferenza di raggio $${r}$ cm, quanto è lungo l'arco che corrisponde a un angolo al centro di $${deg(a)}$?`),
			solution: `\\ell = ${measure(l, 'cm')}`,
			steps: [`\\ell = \\frac{2\\pi r \\cdot \\alpha}{360^\\circ}`, `\\ell = \\frac{2\\pi \\cdot ${r} \\cdot ${deg(a)}}{360^\\circ} = ${measure(l, 'cm')}`],
			value: l,
			unit: 'cm',
			// The sector's formula, the 2 forgotten, the diameter as the radius, the whole circumference.
			wrong: [piv(q(r * r * a, 360)), piv(q(k, 2)), piv(2 * k), piv(2 * r)],
			params: { r, alpha: a },
		};
	}
	return {
		case: c,
		prompt: PROMPT,
		problem: textBlock(`In una circonferenza di raggio $${r}$ cm un arco è lungo $${valTex(l)}$ cm. Quanto misura l'angolo al centro?`),
		solution: `\\alpha = ${deg(a)}`,
		steps: [`C = 2\\pi \\cdot ${r} = ${measure(piv(2 * r), 'cm')}`, `\\alpha = \\frac{${valTex(l)} \\cdot 360^\\circ}{${valTex(piv(2 * r))}} = ${deg(a)}`],
		value: val(a),
		unit: 'deg',
		// πr instead of 2πr, the angle halved, the rest of the angle giro.
		wrong: [val(2 * a), val(q(a, 2)), val(360 - a)],
		params: { r, alpha: a },
	};
}

function level5(rng: Rng): Built {
	const c = weighted(rng, [
		['settore', 45],
		['angolo dal settore', 30],
		["settore dall'arco", 25],
	] as ['settore' | 'angolo dal settore' | "settore dall'arco", number][]);
	const a = rng.pick(ANGLES);
	const g = 360 / gcd(a, 360);
	if (c === "settore dall'arco") {
		// ℓ = πrα/180 a whole multiple of π, and ℓ·r/2 a whole multiple of π too.
		const opts: number[] = [];
		for (let r = 2; r <= 20; r++) if (((r * a) % 180 === 0) && (((r * a) / 180) * r) % 2 === 0) opts.push(r);
		if (!opts.length) return level5(rng);
		const r = rng.pick(opts);
		const k = (r * a) / 180;
		const value = piv((k * r) / 2);
		return {
			case: c,
			prompt: PROMPT_PI,
			problem: textBlock(`In un settore circolare di raggio $${r}$ cm l'arco è lungo $${valTex(piv(k))}$ cm. Qual è l'area del settore?`),
			solution: `A_{\\text{settore}} = ${cm2(value)}`,
			steps: [`A_{\\text{settore}} = \\frac{\\ell \\cdot r}{2}`, `A_{\\text{settore}} = \\frac{${valTex(piv(k))} \\cdot ${r}}{2} = ${cm2(value)}`],
			value,
			unit: 'cm2',
			// The /2 forgotten, r² for r, the arc halved.
			wrong: [piv(k * r), piv(q(k * r * r, 2)), piv(q(k, 2))],
			params: { r, ell: k },
		};
	}
	// r² α / 360 a whole number: r² a multiple of g.
	const rs: number[] = [];
	for (let r = 2; r <= 20; r++) if ((r * r) % g === 0) rs.push(r);
	const r = rng.pick(rs);
	const k = (r * r * a) / 360;
	const value = piv(k);
	if (c === 'settore') {
		return {
			case: c,
			prompt: PROMPT_PI,
			problem: textBlock(`Qual è l'area di un settore circolare di raggio $${r}$ cm e angolo al centro di $${deg(a)}$?`),
			solution: `A_{\\text{settore}} = ${cm2(value)}`,
			steps: [
				`A_{\\text{settore}} = \\frac{\\pi r^2 \\cdot \\alpha}{360^\\circ}`,
				`A_{\\text{settore}} = \\frac{\\pi \\cdot ${r}^2 \\cdot ${deg(a)}}{360^\\circ} = ${cm2(value)}`,
			],
			value,
			unit: 'cm2',
			// The arc's formula, r for r², the diameter as the radius, the whole circle.
			wrong: [piv(q(2 * r * a, 360)), piv(q(r * a, 360)), piv(4 * k), piv(r * r)],
			params: { r, alpha: a },
		};
	}
	return {
		case: c,
		prompt: PROMPT,
		problem: textBlock(`Un settore circolare di raggio $${r}$ cm ha l'area di $${cm2(value)}$. Quanto misura l'angolo al centro?`),
		solution: `\\alpha = ${deg(a)}`,
		steps: [`A = \\pi \\cdot ${r}^2 = ${cm2(piv(r * r))}`, `\\alpha = \\frac{${valTex(value)} \\cdot 360^\\circ}{${valTex(piv(r * r))}} = ${deg(a)}`],
		value: val(a),
		unit: 'deg',
		// The circumference in the proportion, the angle halved, doubled.
		wrong: [val(q(360 * k, 2 * r)), val(q(a, 2)), val(2 * a)],
		params: { r, alpha: a },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the annulus

function level6(rng: Rng): Built {
	const c = weighted(rng, [
		['raggi', 45],
		['diametri', 25],
		['raggio mancante', 30],
	] as ['raggi' | 'diametri' | 'raggio mancante', number][]);
	const R = rng.int(3, 15);
	const r = rng.int(1, R - 1);
	const value = piv(R * R - r * r);
	const formula = `A_{\\text{corona}} = \\pi (R^2 - r^2)`;
	if (c === 'raggio mancante') {
		const askR = rng.next() < 0.5;
		const known = askR ? r : R;
		const want = askR ? R : r;
		const k = R * R - r * r;
		const sq = Math.sqrt(k);
		const wrong = askR ? [val(k + r * r), val(k + r)] : [val(R * R - k), val(R - k)];
		if (Number.isInteger(sq)) wrong.push(askR ? val(r + sq) : val(R - sq));
		wrong.push(val(want + 1));
		return {
			case: c,
			prompt: PROMPT,
			problem: textBlock(
				`Una corona circolare ha l'area di $${cm2(value)}$, e il raggio della circonferenza ${askR ? 'minore' : 'maggiore'} misura $${known}$ cm. Quanto misura il raggio della circonferenza ${askR ? 'maggiore' : 'minore'}?`,
			),
			solution: `${askR ? 'R' : 'r'} = ${cm(want)}`,
			steps: askR
				? [formula, `R^2 - ${known}^2 = ${k}`, `R^2 = ${k} + ${known * known} = ${R * R}`, `R = ${cm(R)}`]
				: [formula, `${known}^2 - r^2 = ${k}`, `r^2 = ${known * known} - ${k} = ${r * r}`, `r = ${cm(r)}`],
			value: val(want),
			unit: 'cm',
			wrong: wrong.filter((w) => approx(w) > 0),
			params: { R, r, ask: askR ? 'R' : 'r' },
		};
	}
	const byD = c === 'diametri';
	const data = byD ? `i diametri di $${2 * R}$ cm e $${2 * r}$ cm` : `i raggi di $${R}$ cm e $${r}$ cm`;
	const steps = byD ? [`R = ${2 * R} : 2 = ${cm(R)}${t(', ')}r = ${2 * r} : 2 = ${cm(r)}`] : [];
	steps.push(formula, `A_{\\text{corona}} = \\pi \\cdot (${R}^2 - ${r}^2) = ${cm2(value)}`);
	return {
		case: c,
		prompt: PROMPT_PI,
		problem: textBlock(`Due circonferenze concentriche hanno ${data}. Qual è l'area della corona circolare?`),
		solution: `A_{\\text{corona}} = ${cm2(value)}`,
		steps,
		value,
		unit: 'cm2',
		// π(R - r)², the sum of the two circles, the diameters as radii.
		wrong: [piv((R - r) ** 2), piv(R * R + r * r), byD ? piv(4 * (R * R - r * r)) : piv(2 * (R - r)), piv(R * R)],
		params: { R, r },
	};
}

// ---------------------------------------------------------------------------
// Level 7: the circular segment of 90° and 60°

function level7(rng: Rng): Built {
	const c = rng.pick(['90', '60'] as const);
	const given = weighted(rng, [
		['raggio', 50],
		['diametro', 20],
		['circonferenza', 15],
		['area', 15],
	] as ['raggio' | 'diametro' | 'circonferenza' | 'area', number][]);
	const r = c === '90' ? 2 * rng.int(1, 15) : 6 * rng.int(1, 5);
	const circle = {
		raggio: `In un cerchio di raggio $${r}$ cm`,
		diametro: `In un cerchio di diametro $${2 * r}$ cm`,
		circonferenza: `In un cerchio con la circonferenza lunga $${valTex(piv(2 * r))}$ cm`,
		area: `In un cerchio di area $${cm2(piv(r * r))}$`,
	}[given];
	const a = Number(c);
	const sector = piv(q(r * r * a, 360));
	const tri = c === '90' ? val(q(r * r, 2)) : val(0, 0, 0, q(r * r, 4));
	const value = minus(sector, tri);
	const steps = {
		raggio: [] as string[],
		diametro: [`r = ${2 * r} : 2 = ${cm(r)}`],
		circonferenza: [`2\\pi r = ${valTex(piv(2 * r))}${t(', quindi ')}r = ${cm(r)}`],
		area: [`\\pi r^2 = ${valTex(piv(r * r))}${t(', quindi ')}r = ${cm(r)}`],
	}[given];
	steps.push(`A_{\\text{settore}} = \\frac{\\pi \\cdot ${r}^2}{${360 / a}} = ${cm2(sector)}`);
	if (c === '90') {
		steps.push(`${t('Il triangolo ')}OAB${t(' è rettangolo in ')}O${t(': ')}A_{\\text{triangolo}} = \\frac{${r} \\cdot ${r}}{2} = ${cm2(tri)}`);
	} else {
		const h = val(0, 0, 0, q(r, 2));
		steps.push(`${t('Il triangolo ')}OAB${t(' è equilatero di lato ')}${r}${t(' cm, con altezza ')}${measure(h, 'cm')}`);
		steps.push(`A_{\\text{triangolo}} = \\frac{${r} \\cdot ${valTex(h)}}{2} = ${cm2(tri)}`);
	}
	steps.push(`A_{\\text{segmento}} = A_{\\text{settore}} - A_{\\text{triangolo}} = ${cm2(value)}`);
	// Only the sector, sector plus triangle, the triangle's area not halved, and for 60° the triangle as if right.
	const wrong = [sector, plus(sector, tri), minus(sector, times(tri, 2)), minus(piv(r * r), tri)];
	if (c === '60') wrong.push(minus(sector, val(q(r * r, 2))));
	return {
		case: c,
		prompt: PROMPT_PI,
		problem: textBlock(`${circle}, qual è l'area del segmento circolare che corrisponde a un angolo al centro di $${deg(a)}$?`),
		solution: `A_{\\text{segmento}} = ${cm2(value)}`,
		steps,
		value,
		unit: 'cm2',
		wrong,
		params: { r, alpha: a, given },
	};
}

// ---------------------------------------------------------------------------
// Level 8: composite figures

type Composite = 'cerchio inscritto' | 'quattro quarti' | 'quarto di cerchio' | 'finestra' | 'semicerchio tolto';

function level8(rng: Rng): Built {
	const c = rng.pick(['cerchio inscritto', 'quattro quarti', 'quarto di cerchio', 'finestra', 'semicerchio tolto'] as Composite[]);
	if (c === 'finestra' || c === 'semicerchio tolto') {
		const b = 4 * rng.int(1, 5);
		const h = c === 'finestra' ? rng.int(3, 20) : rng.int(b / 2 + 1, 20);
		const rect = val(b * h);
		const semi = piv(q(b * b, 8));
		const sign = c === 'finestra' ? 1 : -1;
		const value = plus(rect, times(semi, sign));
		const problem =
			c === 'finestra'
				? `Una finestra è fatta da un rettangolo di base $${b}$ cm e altezza $${h}$ cm, con sopra un semicerchio che ha per diametro la base. Qual è l'area della finestra?`
				: `Da un rettangolo di base $${b}$ cm e altezza $${h}$ cm si toglie un semicerchio che ha per diametro la base. Qual è l'area della parte che resta?`;
		return {
			case: c,
			prompt: PROMPT_PI,
			problem: textBlock(problem),
			solution: `A = ${cm2(value)}`,
			steps: [
				`A_{\\text{rettangolo}} = ${b} \\cdot ${h} = ${cm2(rect)}`,
				`${t('Il raggio del semicerchio è metà della base: ')}r = ${b} : 2 = ${cm(b / 2)}`,
				`A_{\\text{semicerchio}} = \\frac{\\pi \\cdot ${b / 2}^2}{2} = ${cm2(semi)}`,
				`A = A_{\\text{rettangolo}} ${sign > 0 ? '+' : '-'} A_{\\text{semicerchio}} = ${cm2(value)}`,
			],
			value,
			unit: 'cm2',
			// The whole circle, the radius equal to the base, the wrong operation.
			wrong: [plus(rect, times(semi, 2 * sign)), plus(rect, times(semi, 4 * sign)), plus(rect, times(semi, -sign))],
			params: { b, h },
		};
	}
	const l = 2 * rng.int(2, 10);
	const square = val(l * l);
	const circleArea = piv(q(l * l, 4)); // the inscribed circle, the four quarters and the quarter of radius l all have area πl²/4
	const value = minus(square, circleArea);
	const problem = {
		'cerchio inscritto': `Un quadrato ha il lato di $${l}$ cm, e dentro c'è il cerchio inscritto. Qual è l'area della parte del quadrato che resta fuori dal cerchio?`,
		'quattro quarti': `Un quadrato ha il lato di $${l}$ cm. Con il centro in ognuno dei quattro vertici si disegna, dentro il quadrato, un quarto di cerchio di raggio $${l / 2}$ cm. Qual è l'area della parte del quadrato che resta fuori dai quattro quarti di cerchio?`,
		'quarto di cerchio': `Il quadrato $ABCD$ ha il lato di $${l}$ cm. Con il centro in $A$ si disegna, dentro il quadrato, il quarto di cerchio di raggio $AB$. Qual è l'area della parte del quadrato che resta fuori dal quarto di cerchio?`,
	}[c];
	const first = {
		'cerchio inscritto': `${t('Il diametro del cerchio inscritto è il lato: ')}r = ${l} : 2 = ${cm(l / 2)}${t(', e ')}A_{\\text{cerchio}} = \\pi \\cdot ${l / 2}^2 = ${cm2(circleArea)}`,
		'quattro quarti': `${t('I quattro quarti formano un cerchio di raggio ')}${l / 2}${t(' cm: ')}\\pi \\cdot ${l / 2}^2 = ${cm2(circleArea)}`,
		'quarto di cerchio': `${t('Il raggio è il lato, ')}${l}${t(' cm: ')}A_{\\text{quarto}} = \\frac{\\pi \\cdot ${l}^2}{4} = ${cm2(circleArea)}`,
	}[c];
	const wrong = {
		// The radius equal to the side, the circumference for the area, the circle alone.
		'cerchio inscritto': [minus(square, piv(l * l)), minus(square, piv(l)), circleArea, minus(square, piv(2 * l))],
		// Each quarter with radius the side, one quarter only, the circumference.
		'quattro quarti': [minus(square, piv(l * l)), minus(square, piv(q(l * l, 16))), minus(square, piv(l)), circleArea],
		// The whole circle, the arc for the area, the quarter alone.
		'quarto di cerchio': [minus(square, piv(l * l)), minus(square, piv(q(l, 2))), circleArea, minus(square, piv(q(l * l, 16)))],
	}[c];
	return {
		case: c,
		prompt: PROMPT_PI,
		problem: textBlock(problem),
		solution: `A = ${cm2(value)}`,
		steps: [`A_{\\text{quadrato}} = ${l}^2 = ${cm2(square)}`, first, `A = ${l * l} - ${valTex(circleArea)}\\ \\text{cm}^2`],
		value,
		unit: 'cm2',
		wrong,
		params: { l },
	};
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
		case 8:
			return level8(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

function option(x: Val, unit: Unit): ChoiceOption {
	return { latex: measure(x, unit), values: [valSym(x)] };
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	if (!sample.steps.length) v.push('nessun passaggio');
	const value = des(p.value as string[]);
	const unit = p.unit as Unit;
	if (approx(value) <= 0) v.push('risposta non positiva');
	const a = sample.answer;
	if (isRat(value)) {
		if (a.kind !== 'number' || !Rational.parse(a.value).equals(value[0])) v.push('risposta numerica sbagliata');
		if (unit === 'deg' && (!value[0].isInteger() || value[0].num >= 360)) v.push('angolo non intero o oltre 360');
		if (!value[0].isInteger()) v.push('risposta non intera');
	} else {
		if (a.kind !== 'expression' || a.value !== valSym(value)) v.push('espressione sbagliata');
		if (value[2].sign() !== 0) v.push('pi greco al quadrato nella risposta');
	}
	const all = [sample.problem, sample.solution, ...sample.steps].join(' ');
	if (/—|piuttosto che/.test(all)) v.push('trattino lungo o "piuttosto che"');
	if (sample.level === 4 || sample.level === 5) {
		const al = p.alpha as number;
		if (!ANGLES.includes(al) && p.alpha !== undefined) v.push('angolo fuori elenco');
	}
	if (sample.level === 7 && p.alpha === 60 && (p.r as number) % 6) v.push('raggio non multiplo di 6');
	if (sample.level === 8 && p.case === 'semicerchio tolto' && (p.h as number) <= (p.b as number) / 2) v.push('il semicerchio non entra');
	return v;
}

function fallback(value: Val, unit: Unit): (i: number) => ChoiceOption | null {
	return (i: number) => {
		const k = Math.floor(i / 2) + 1;
		const s = i % 2 ? -k : k;
		let w: Val;
		if (isRat(value)) w = val(value[0].add(q(unit === 'deg' ? 10 * s : s)));
		else {
			w = [value[0], value[1].add(q(s)), value[2], value[3]];
			if (w[1].isZero()) return null;
		}
		if (approx(w) <= 0) return null;
		if (unit === 'deg' && (w[0].num >= 360 || !w[0].isInteger())) return null;
		return option(w, unit);
	};
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const p = sample.params;
	const value = des(p.value as string[]);
	const unit = p.unit as Unit;
	const wrong = (p.wrong as string[][]).map(des).filter((w) => {
		if (same(w, value) || approx(w) <= 0) return false;
		if (unit === 'deg' || unit === 'giri') return isRat(w) && w[0].isInteger() && (unit !== 'deg' || w[0].num < 360);
		if (isRat(w) && decimals(w[0]) === null) return false;
		return true;
	});
	return buildChoice(
		rng,
		option(value, unit),
		wrong.map((w) => option(w, unit)),
		fallback(value, unit),
	);
}

export const circonferenzaLunghezzaArea: Generator = {
	id: ID,
	title: 'Lunghezza della circonferenza e area del cerchio',
	levels: {
		1: { label: 'Circonferenza e area dal raggio o dal diametro', constraints: ['quattro casi alla pari: C o A, dal raggio o dal diametro', 'risultato esatto con π'] },
		2: { label: 'Dalla circonferenza o dall’area al raggio', constraints: ['r da C, r da A, A da C, C da A, alla pari', 'dati con π, raggio intero'] },
		3: { label: 'Con π ≈ 3,14', constraints: ['raggio da C o da A approssimate, giri di una ruota', 'risultato intero'] },
		4: { label: "Lunghezza dell'arco", constraints: ['angoli divisori di 360 gradi', "arco multiplo intero di π; 6 su 10 l'arco, 4 su 10 l'angolo"] },
		5: { label: 'Area del settore', constraints: ["settore da r e α, angolo dal settore, settore dall'arco", 'area multiplo intero di π'] },
		6: { label: 'Corona circolare', constraints: ['dai raggi, dai diametri, oppure il raggio mancante', 'raggi interi fino a 15'] },
		7: { label: 'Segmento circolare', constraints: ['90 gradi con raggio pari, 60 gradi con raggio multiplo di 6', 'a volte dato il diametro'] },
		8: { label: 'Figure composte', constraints: ['quadrato con cerchio inscritto, quattro quarti, quarto di cerchio, finestra, semicerchio tolto'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const b = build(rng, level);
			const value = b.value;
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer: isRat(value) ? { kind: 'number', value: value[0].toString() } : { kind: 'expression', value: valSym(value), latex: valTex(value) },
				params: {
					case: b.case,
					...b.params,
					unit: b.unit,
					value: ser(value),
					wrong: b.wrong.filter((w) => !same(w, value)).map(ser),
				},
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

export default circonferenzaLunghezzaArea;
