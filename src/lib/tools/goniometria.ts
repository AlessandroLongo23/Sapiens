import { Rational, q } from '@/lib/exercises/v2/rational';
import { div, int, val, type Val } from './geometria';
import { floatText, parseDegrees, parseRadians, piTex, piText } from './gradi-radianti';
import { decimal } from './numbers';
import { fail, type Outcome, type ResultRow, type Step } from './types';

/**
 * Sine, cosine, tangent and cotangent of an angle, in degrees or radians. A multiple of 30° or 45° (π/6, π/4) gets
 * exact values, found as at school: whole turns taken away, the quadrant and its signs, the associated angle in the
 * first quadrant, the values learnt by heart; the tangent and the cotangent as quotients. Any other angle gets
 * decimals, as from a calculator. Italian notation: tg and cotg.
 */

export type TrigUnit = 'gradi' | 'rad';

/** Decimals of an approximate value, as on the calculator. */
const DIGITS = 4;
/** Angles larger than this (in degrees, or radians × 57) are refused: whole turns would drown the float. */
const MAX_DEGREES = 1e6;
const MAX_RADIANS = 2e4;

const TG = '\\operatorname{tg}';
const COTG = '\\operatorname{cotg}';

/** c·√r as a Val. */
const surd = (c: Rational, r: number): Val => ({
	c,
	r,
	pi: 0,
	x: (c.num / c.den) * Math.sqrt(r)
});
const HALF = q(1, 2);

/** Sine and cosine of the angles of the first quadrant learnt by heart. */
const TABLE: Record<number, { sin: Val; cos: Val }> = {
	0: { sin: int(0), cos: int(1) },
	30: { sin: val(HALF), cos: surd(HALF, 3) },
	45: { sin: surd(HALF, 2), cos: surd(HALF, 2) },
	60: { sin: surd(HALF, 3), cos: val(HALF) },
	90: { sin: int(1), cos: int(0) }
};

const neg = (v: Val): Val => (v.c ? { ...v, c: v.c.neg(), x: -v.x } : { ...v, x: -v.x });

/** An angle in degrees between 0 (included) and 360 (excluded), and the number of whole turns taken away. */
function reduce(deg: Rational): { deg: Rational; turns: number } {
	const turns = Math.floor(deg.num / deg.den / 360);
	return { deg: deg.sub(q(360 * turns)), turns };
}

/** The reference angle in the first quadrant of a reduced angle, and the quadrant (0 on an axis). */
function reference(deg: Rational): {
	beta: Rational;
	quadrant: 0 | 1 | 2 | 3 | 4;
} {
	const x = deg.num / deg.den;
	if (deg.isInteger() && deg.num % 90 === 0) return { beta: deg, quadrant: 0 };
	if (x < 90) return { beta: deg, quadrant: 1 };
	if (x < 180) return { beta: q(180).sub(deg), quadrant: 2 };
	if (x < 270) return { beta: deg.sub(q(180)), quadrant: 3 };
	return { beta: q(360).sub(deg), quadrant: 4 };
}

/** Exact sine and cosine of an angle in degrees, when it is a multiple of 30° or 45°; else null. */
export function exactTrig(deg: Rational): { sin: Val; cos: Val } | null {
	if (!deg.isInteger() || (deg.num % 30 !== 0 && deg.num % 45 !== 0)) return null;
	const r = reduce(deg).deg.num;
	const beta = r <= 90 ? r : r <= 180 ? 180 - r : r <= 270 ? r - 180 : 360 - r;
	const t = TABLE[beta];
	const sinSign = r > 180 ? -1 : 1;
	const cosSign = r > 90 && r < 270 ? -1 : 1;
	return {
		sin: sinSign < 0 ? neg(t.sin) : t.sin,
		cos: cosSign < 0 ? neg(t.cos) : t.cos
	};
}

// ---------------------------------------------------------------------------------------------------------------
// Writing.

/**
 * An exact value of a goniometric function as the tables write it, always a fraction: "\\dfrac{1}{2}",
 * "-\\dfrac{\\sqrt{3}}{2}", "\\sqrt{3}", "1"; a decimal when it is known only approximately.
 */
export function trigTex(v: Val): string {
	if (!v.c) return floatText(v.x, DIGITS).tex;
	const sign = v.c.num < 0 ? '-' : '';
	const p = Math.abs(v.c.num);
	const root = v.r > 1 ? `\\sqrt{${v.r}}` : '';
	const top = p === 1 && root ? root : `${p}${root}`;
	return v.c.den === 1 ? `${sign}${top}` : `${sign}\\dfrac{${top}}{${v.c.den}}`;
}

/** The same as plain text: "1/2", "-√3/2". */
export function trigText(v: Val): string {
	if (!v.c) return floatText(v.x, DIGITS).text;
	const sign = v.c.num < 0 ? '-' : '';
	const p = Math.abs(v.c.num);
	const root = v.r > 1 ? `√${v.r}` : '';
	const top = p === 1 && root ? root : `${p}${root}`;
	return v.c.den === 1 ? `${sign}${top}` : `${sign}${top}/${v.c.den}`;
}

const vx = trigTex;

/** A signed value as an operand: "\left(-\dfrac{1}{2}\right)" when negative. */
const operand = (v: Val) => (v.x < 0 ? `\\left(${vx(v)}\\right)` : vx(v));

/** An exact value and, when it is irrational, its decimal: "$-\dfrac{\sqrt{3}}{2}$ $\approx -0{,}866$". */
function exactRow(left: string, v: Val): string {
	const e = `$${left} = ${trigTex(v)}$`;
	return v.r > 1 ? `${e} $\\approx ${floatText(v.x, DIGITS).tex}$` : e;
}

function exactText(v: Val): string {
	return v.r > 1 ? `${trigText(v)} ≈ ${floatText(v.x, DIGITS).text}` : trigText(v);
}

/**
 * The quotient of two magnitudes of the table, written as at school: a division of fractions, the reciprocal,
 * the result, rationalised. Keys are "|numerator|/|denominator|" by angle.
 */
const QUOTIENTS: Record<string, string[]> = {
	// 1/2 : √3/2
	'30/sc': ['\\dfrac{1}{2} \\cdot \\dfrac{2}{\\sqrt{3}}', '\\dfrac{1}{\\sqrt{3}}', '\\dfrac{\\sqrt{3}}{3}'],
	'30/cs': ['\\dfrac{\\sqrt{3}}{2} \\cdot 2', '\\sqrt{3}'],
	'45/sc': ['1'],
	'45/cs': ['1'],
	'60/sc': ['\\dfrac{\\sqrt{3}}{2} \\cdot 2', '\\sqrt{3}'],
	'60/cs': ['\\dfrac{1}{2} \\cdot \\dfrac{2}{\\sqrt{3}}', '\\dfrac{1}{\\sqrt{3}}', '\\dfrac{\\sqrt{3}}{3}']
};

// ---------------------------------------------------------------------------------------------------------------

export interface CircleDrawing {
	/** The angle in radians, between 0 and 2π. */
	turn: number;
	cos: number;
	sin: number;
}

export interface TrigResult {
	outcome: Outcome;
	circle: CircleDrawing | null;
}

const failed = (error: string): TrigResult => ({
	outcome: fail(error),
	circle: null
});

const QUADRANT_NAMES = ['', 'primo', 'secondo', 'terzo', 'quarto'];
const SIGNS: Record<1 | 2 | 3 | 4, [string, string, string]> = {
	1: ['positivo', 'positivo', 'positiva'],
	2: ['positivo', 'negativo', 'negativa'],
	3: ['negativo', 'negativo', 'positiva'],
	4: ['negativo', 'positivo', 'negativa']
};

function quadrantThen(quadrant: 1 | 2 | 3 | 4): string {
	const [s, c, t] = SIGNS[quadrant];
	return `Nel ${QUADRANT_NAMES[quadrant]} quadrante il seno è ${s}, il coseno è ${c}, la tangente è ${t}.`;
}

export function funzioniGoniometriche(value: string, unit: string): TrigResult {
	if (unit !== 'gradi' && unit !== 'rad') return failed("Scegli l'unità di misura dell'angolo: gradi o radianti.");
	if (!value.trim()) return failed(unit === 'gradi' ? 'Scrivi un angolo in gradi, per esempio 150.' : 'Scrivi un angolo in radianti, per esempio 5π/6 oppure 1,2.');
	try {
		if (unit === 'gradi') {
			const d = parseDegrees(value);
			if (!d) return failed('Scrivi un angolo in gradi, per esempio 150, 22,5 oppure 22° 30′.');
			if (Math.abs(d.value.num / d.value.den) > MAX_DEGREES) return failed("L'angolo è troppo grande: scrivi un numero più piccolo, per esempio 750.");
			if (d.value.den > 1e5) return failed('Usa meno cifre decimali, per esempio 22,5.');
			return fromDegrees(d.value, 'gradi');
		}
		const r = parseRadians(value);
		if (!r) return failed('Scrivi un angolo in radianti, per esempio 5π/6 oppure 1,2 (puoi scrivere pi al posto di π).');
		if (r.pi) {
			const d = r.coef.mul(q(180));
			if (Math.abs(d.num / d.den) > MAX_DEGREES) return failed("L'angolo è troppo grande: scrivi un numero più piccolo, per esempio 13π/6.");
			if (d.den > 1e5) return failed('Scrivi il multiplo di π con numeri più piccoli, per esempio 5π/6.');
			return fromDegrees(d, 'rad');
		}
		if (Math.abs(r.coef.num / r.coef.den) > MAX_RADIANS) return failed("L'angolo è troppo grande: scrivi un numero più piccolo, per esempio 7.");
		if (r.coef.den > 1e5) return failed('Usa meno cifre decimali, per esempio 1,2.');
		if (r.coef.isZero()) return fromDegrees(q(0), 'rad');
		return fromRadians(r.coef);
	} catch {
		return failed('Il numero ha troppe cifre per questo calcolo: scrivi un angolo più corto, per esempio 150.');
	}
}

/** An angle in the student's unit: "150^\circ" or "\dfrac{5\pi}{6}". */
function angleTex(deg: Rational, unit: TrigUnit): string {
	if (unit === 'rad') return piTex(deg.div(q(180)));
	const d = decimal(deg, 6);
	if (d.exact) return `${d.tex}^\\circ`;
	return dmsTex(deg) ?? `${deg.toLatex().replace('\\frac', '\\dfrac')}^\\circ`;
}

/** Degrees, primes and seconds, when the angle is a whole number of seconds: "22^\circ\, 30'\, 15''". */
function dmsTex(deg: Rational): string | null {
	const t = deg.abs().mul(q(3600));
	if (!t.isInteger()) return null;
	const [d, m, s] = [Math.floor(t.num / 3600), Math.floor((t.num % 3600) / 60), t.num % 60];
	return `${deg.sign() < 0 ? '-' : ''}${d}^\\circ\\, ${m}'${s ? `\\, ${s}''` : ''}`;
}

function angleText(deg: Rational, unit: TrigUnit): string {
	if (unit === 'rad') return piText(deg.div(q(180)));
	const d = decimal(deg, 6);
	if (d.exact) return `${d.text}°`;
	const t = deg.abs().mul(q(3600));
	const whole = Math.round(t.num / t.den);
	return `${deg.sign() < 0 ? '-' : ''}${Math.floor(whole / 3600)}° ${Math.floor((whole % 3600) / 60)}′ ${whole % 60}″`;
}

/** "\sin 150^\circ", with the angle in brackets when it is negative or a fraction would read badly. */
const fn = (name: string, a: string) => (a.startsWith('-') ? `${name}\\left(${a}\\right)` : `${name} ${a}`);

function circleOf(rad: number): CircleDrawing {
	const turn = ((rad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
	return { turn, cos: Math.cos(rad), sin: Math.sin(rad) };
}

/** The step that takes away (or adds) whole turns. */
function turnsStep(deg: Rational, turns: number, unit: TrigUnit, reduced: Rational): Step {
	const k = Math.abs(turns);
	const full = unit === 'rad' ? '2\\pi' : '360^\\circ';
	const op = turns > 0 ? '-' : '+';
	const amount = k === 1 ? full : `${k} \\cdot ${full}`;
	return {
		group: "Dove si trova l'angolo",
		say: turns > 0 ? 'Togli i giri interi: seno e coseno si ripetono a ogni giro.' : 'Aggiungi giri interi fino ad avere un angolo positivo.',
		math: [`${angleTex(deg, unit)} ${op} ${amount} = \\hl{${angleTex(reduced, unit)}}`],
		then: 'Le funzioni goniometriche non cambiano, perché il punto sulla circonferenza è lo stesso.'
	};
}

function fromDegrees(deg: Rational, unit: TrigUnit): TrigResult {
	const a = angleTex(deg, unit);
	const aText = angleText(deg, unit);
	const rad = (deg.num / deg.den) * (Math.PI / 180);
	const { deg: r, turns } = reduce(deg);
	const steps: Step[] = [];
	if (turns !== 0) steps.push(turnsStep(deg, turns, unit, r));
	const rT = angleTex(r, unit);
	const { beta, quadrant } = reference(r);
	const exact = exactTrig(deg);
	const bounds: Record<1 | 2 | 3 | 4, [number, number]> = {
		1: [0, 90],
		2: [90, 180],
		3: [180, 270],
		4: [270, 360]
	};

	if (quadrant === 0) {
		const P = exact!;
		const axis = {
			0: 'positivo delle $x$',
			90: 'positivo delle $y$',
			180: 'negativo delle $x$',
			270: 'negativo delle $y$'
		}[r.num]!;
		steps.push({
			group: steps.length ? undefined : "Dove si trova l'angolo",
			say: `Il punto sulla circonferenza è sul semiasse ${axis}.`,
			math: [`P = \\left(${vx(P.cos)};\\ ${vx(P.sin)}\\right)`],
			then: "Il coseno è l'ascissa di $P$, il seno è l'ordinata."
		});
		steps.push({
			group: 'Seno e coseno',
			say: 'Leggi seno e coseno dalle coordinate di $P$.',
			math: [`${fn('\\sin', a)} = \\hl{${vx(P.sin)}}`, `${fn('\\cos', a)} = \\hl{${vx(P.cos)}}`]
		});
		return exactResult(a, aText, P, steps, rad, null);
	}

	const [lo, hi] = bounds[quadrant];
	const loT = angleTex(q(lo), unit);
	const hiT = angleTex(q(hi), unit);
	steps.push({
		group: steps.length ? undefined : "Dove si trova l'angolo",
		say: `L'angolo è nel ${QUADRANT_NAMES[quadrant]} quadrante.`,
		math: [`${loT} < ${rT} < ${hiT}`],
		then: quadrantThen(quadrant)
	});

	if (!exact) return decimals(a, aText, Math.sin(rad), Math.cos(rad), steps, unit === 'gradi' ? 'DEG' : 'RAD', rad);

	const bT = angleTex(beta, unit);
	const b = beta.num;
	const t = TABLE[b];
	if (quadrant !== 1) {
		const [pivot, form] =
			quadrant === 2 ? [180, `${angleTex(q(180), unit)} - \\hl{${bT}}`] : quadrant === 3 ? [180, `${angleTex(q(180), unit)} + \\hl{${bT}}`] : [360, `${angleTex(q(360), unit)} - \\hl{${bT}}`];
		const P = angleTex(q(pivot), unit);
		const op = quadrant === 3 ? '+' : '-';
		const sinSign = quadrant === 2 ? '' : '-';
		const cosSign = quadrant === 4 ? '' : '-';
		steps.push({
			say: "Scrivi l'angolo con un angolo acuto $\\beta$ del primo quadrante.",
			math: [`${rT} = ${form}`],
			then: `$${bT}$ è l'angolo associato nel primo quadrante.`
		});
		steps.push({
			group: 'Seno e coseno',
			say: 'Usa le formule degli archi associati.',
			math: [`\\sin(${P} ${op} \\beta) = ${sinSign}\\sin \\beta`, `\\cos(${P} ${op} \\beta) = ${cosSign}\\cos \\beta`],
			then: 'I segni sono quelli del quadrante.'
		});
		steps.push({
			say: `Sostituisci i valori di $${bT}$, che si sanno a memoria.`,
			math: [`${fn('\\sin', a)} = ${sinSign}\\sin ${bT} = \\hl{${vx(exact.sin)}}`, `${fn('\\cos', a)} = ${cosSign}\\cos ${bT} = \\hl{${vx(exact.cos)}}`]
		});
	} else {
		steps.push({
			group: 'Seno e coseno',
			say: `$${bT}$ è un angolo notevole: i valori si sanno a memoria.`,
			math: [`${fn('\\sin', a)}${turns ? ` = \\sin ${bT}` : ''} = \\hl{${vx(t.sin)}}`, `${fn('\\cos', a)}${turns ? ` = \\cos ${bT}` : ''} = \\hl{${vx(t.cos)}}`]
		});
	}
	return exactResult(a, aText, exact, steps, rad, b);
}

/** The tangent and cotangent steps, then the rows. `beta` is the reference angle, null on an axis. */
function exactResult(a: string, angle: string, v: { sin: Val; cos: Val }, steps: Step[], rad: number, beta: number | null): TrigResult {
	const { sin, cos } = v;
	const aText = paren(angle);
	const arg = a.startsWith('-') ? `\\left(${a}\\right)` : a;
	const quotient = (top: Val, bottom: Val, key: 'sc' | 'cs'): Val | null => {
		const tangent = key === 'sc';
		const head = tangent ? `${fn(TG, a)} = \\dfrac{\\sin ${arg}}{\\cos ${arg}}` : `${fn(COTG, a)} = \\dfrac{\\cos ${arg}}{\\sin ${arg}}`;
		const first = `= ${operand(top)} : ${operand(bottom)}`;
		if (bottom.x === 0) {
			return (
				steps.push({
					group: tangent ? 'Tangente e cotangente' : undefined,
					say: `Il ${tangent ? 'coseno' : 'seno'} vale zero, e per zero non si può dividere.`,
					math: [head, first],
					then: `La ${tangent ? 'tangente' : 'cotangente'} di $${a}$ non esiste.`
				}),
				null
			);
		}
		const result = div(top, bottom);
		const sign = result.x < 0 ? '-' : '';
		const chain = top.x === 0 ? ['0'] : beta !== null && QUOTIENTS[`${beta}/${key}`] ? QUOTIENTS[`${beta}/${key}`].map((l) => `${sign}${l}`) : [vx(result)];
		const lines = [head, first, ...chain.slice(0, -1).map((l) => `= ${l}`), `= \\hl{${chain[chain.length - 1]}}`];
		steps.push({
			group: tangent ? 'Tangente e cotangente' : undefined,
			say: tangent ? 'Dividi il seno per il coseno: è la tangente.' : 'Dividi il coseno per il seno: è la cotangente.',
			math: lines,
			then: chain.some((l) => l.includes('\\dfrac{1}{\\sqrt{3}}')) ? 'Per togliere la radice dal denominatore, moltiplica sopra e sotto per $\\sqrt{3}$.' : undefined
		});
		return result;
	};
	const tg = quotient(sin, cos, 'sc');
	const cotg = quotient(cos, sin, 'cs');

	const rows: ResultRow[] = [
		{ label: 'Seno', value: exactRow(fn('\\sin', a), sin) },
		{ label: 'Coseno', value: exactRow(fn('\\cos', a), cos) },
		{
			label: 'Tangente',
			value: tg ? exactRow(fn(TG, a), tg) : `$${fn(TG, a)}$ non esiste`
		},
		{
			label: 'Cotangente',
			value: cotg ? exactRow(fn(COTG, a), cotg) : `$${fn(COTG, a)}$ non esiste`
		}
	];
	const copy = [
		`sin${aText} = ${exactText(sin)}`,
		`cos${aText} = ${exactText(cos)}`,
		`tg${aText} ${tg ? `= ${exactText(tg)}` : 'non esiste'}`,
		`cotg${aText} ${cotg ? `= ${exactText(cotg)}` : 'non esiste'}`
	].join('; ');
	return { outcome: { ok: true, rows, copy, steps }, circle: circleOf(rad) };
}

/** Rounded to DIGITS decimals; a very large tangent (an angle close to 90°) to the unit, where the float is still sure. */
const approx = (x: number) => floatText(x, Math.abs(x) >= 1e4 ? 0 : DIGITS);

/** A negative angle in brackets, for the copied text: "sin(-30°)". */
const paren = (t: string) => (t.startsWith('-') ? `(${t})` : ` ${t}`);

function decimals(a: string, angle: string, sin: number, cos: number, steps: Step[], mode: 'DEG' | 'RAD', rad: number): TrigResult {
	const aText = paren(angle);
	const tg = sin / cos;
	const cotg = cos / sin;
	const [S, C, T, K] = [approx(sin), approx(cos), approx(tg), approx(cotg)];
	steps.push({
		group: 'Seno e coseno',
		say: `Non è un angolo notevole: usa la calcolatrice in modalità ${mode}.`,
		math: [`${fn('\\sin', a)} \\approx \\hl{${S.tex}}`, `${fn('\\cos', a)} \\approx \\hl{${C.tex}}`],
		then: `Controlla la modalità: con ${mode === 'DEG' ? 'RAD' : 'DEG'} escono numeri sbagliati.`
	});
	steps.push({
		group: 'Tangente e cotangente',
		say: 'Dividi il seno per il coseno: è la tangente.',
		math: [`${fn(TG, a)} = \\dfrac{${fn('\\sin', a)}}{${fn('\\cos', a)}}`, `\\approx \\hl{${T.tex}}`],
		then: 'Dividi i valori non arrotondati, o usa il tasto tan.'
	});
	steps.push({
		say: 'La cotangente è il reciproco della tangente.',
		math: [`${fn(COTG, a)} = \\dfrac{1}{${fn(TG, a)}}`, `\\approx \\hl{${K.tex}}`]
	});
	const rows: ResultRow[] = [
		{ label: 'Seno', value: `$${fn('\\sin', a)} \\approx ${S.tex}$` },
		{ label: 'Coseno', value: `$${fn('\\cos', a)} \\approx ${C.tex}$` },
		{ label: 'Tangente', value: `$${fn(TG, a)} \\approx ${T.tex}$` },
		{ label: 'Cotangente', value: `$${fn(COTG, a)} \\approx ${K.tex}$` }
	];
	const copy = `sin${aText} ≈ ${S.text}; cos${aText} ≈ ${C.text}; tg${aText} ≈ ${T.text}; cotg${aText} ≈ ${K.text}`;
	return { outcome: { ok: true, rows, copy, steps }, circle: circleOf(rad) };
}

/** Radians without π: the quadrant from the float, then decimals. */
function fromRadians(coef: Rational): TrigResult {
	const x = coef.num / coef.den;
	const d = decimal(coef, 6);
	const a = d.tex;
	const aText = d.text;
	const steps: Step[] = [];
	const TWO_PI = 2 * Math.PI;
	const turns = Math.floor(x / TWO_PI);
	const r = x - turns * TWO_PI;
	const rT = floatText(r, DIGITS).tex;
	if (turns !== 0) {
		const k = Math.abs(turns);
		steps.push({
			group: "Dove si trova l'angolo",
			say: turns > 0 ? 'Togli i giri interi: un giro misura $2\\pi \\approx 6{,}2832$.' : 'Aggiungi giri interi: un giro misura $2\\pi \\approx 6{,}2832$.',
			math: [`${a} ${turns > 0 ? '-' : '+'} ${k === 1 ? '' : `${k} \\cdot `}2\\pi \\approx \\hl{${rT}}`],
			then: 'Le funzioni goniometriche non cambiano, perché il punto sulla circonferenza è lo stesso.'
		});
	}
	const quadrant = (r < Math.PI / 2 ? 1 : r < Math.PI ? 2 : r < (3 * Math.PI) / 2 ? 3 : 4) as 1 | 2 | 3 | 4;
	const bounds = ['0', '\\dfrac{\\pi}{2}', '\\pi', '\\dfrac{3\\pi}{2}', '2\\pi'];
	steps.push({
		group: steps.length ? undefined : "Dove si trova l'angolo",
		say: `L'angolo è nel ${QUADRANT_NAMES[quadrant]} quadrante.`,
		math: [`${bounds[quadrant - 1]} < ${turns ? rT : a} < ${bounds[quadrant]}`],
		then: `${quadrantThen(quadrant)} Ricorda: $\\pi \\approx 3{,}1416$.`
	});
	return decimals(a, aText, Math.sin(x), Math.cos(x), steps, 'RAD', x);
}
