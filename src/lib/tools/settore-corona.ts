import { Rational, q } from '@/lib/exercises/v2/rational';
import { PI, add, calc, cmp, int, mul, readMeasure, rowValue, shown, sqt, square, sub, val, valueText, vt, type Sketch, type Unit, type Val } from './geometria';
import { parseDecimal } from './numbers';
import { fail, type Outcome, type Step } from './types';

/**
 * Two parts of the circle, one page each (lessons mat-settore-corona and circonferenza-lunghezza-area): the circular
 * sector, from the radius and the angle at the centre in degrees or radians (the length of the arc, the area, the
 * perimeter), and the annulus, from the two radii or the two diameters (the area and the two circumferences).
 *
 * Values stay exact with π while they can (6π cm², with the decimal beside), through the exact values of
 * geometria.ts. Degrees go through the fraction of the circle the sector is (60° is 1/6 of 360°), as in the books of
 * the middle school; radians through ℓ = α·r and A = ½·α·r².
 */

const MAX_ANGLE_DEN = 3600;

const unitTex = (u: Unit, dim: 1 | 2 = 1) => (u ? `\\,\\text{${u}}${dim === 2 ? '^2' : ''}` : '');
const unitText = (u: Unit, dim: 1 | 2 = 1) => (u ? ` ${u}${dim === 2 ? '²' : ''}` : '');

/** A short label for a drawing: the exact form when short, else the decimal. */
function labelText(v: Val, u: Unit): string {
	const s = shown(v);
	const t = s.exact && s.exact.text.length <= 8 ? s.exact.text : (s.approx?.text ?? s.exact!.text);
	return `${t}${unitText(u)}`;
}

/** A sum a + b that stays exact when both are exact, even with π in one of them: "12 + 2π". */
function sumRow(sym: string, a: Val, b: Val, u: Unit): { value: string; copy: string; lines: string[]; x: number } {
	const s = add(a, b);
	if (s.c) {
		const e = shown(s);
		return { value: rowValue(sym, s, u), copy: valueText(s, u), lines: [`= \\hl{${e.exact?.tex ?? e.approx!.tex}${unitTex(u)}}`, ...(e.exact && e.approx ? [`\\approx ${e.approx.tex}${unitTex(u)}`] : [])], x: s.x };
	}
	const [ea, eb] = [shown(a).exact, shown(b).exact];
	const ap = shown({ c: null, r: 1, pi: 0, x: s.x }).approx!;
	if (!ea || !eb) return { value: `$${sym} \\approx ${ap.tex}${unitTex(u)}$`, copy: `≈ ${ap.text}${unitText(u)}`, lines: [`\\approx \\hl{${ap.tex}${unitTex(u)}}`], x: s.x };
	const tex = u ? `(${ea.tex} + ${eb.tex})${unitTex(u)}` : `${ea.tex} + ${eb.tex}`;
	const text = u ? `(${ea.text} + ${eb.text})${unitText(u)}` : `${ea.text} + ${eb.text}`;
	return { value: `$${sym} = ${tex}$ $\\approx ${ap.tex}${unitTex(u)}$`, copy: `${text} ≈ ${ap.text}${unitText(u)}`, lines: [`= \\hl{${tex}}`, `\\approx ${ap.tex}${unitTex(u)}`], x: s.x };
}

// ---------------------------------------------------------------------------------------------------------------
// The circular sector.

export type AngleUnit = 'gradi' | 'radianti';

export interface SettoreInput {
	r: string;
	/** The angle at the centre. */
	a: string;
	unit: AngleUnit;
	u: Unit;
}

export interface SettoreResult {
	outcome: Outcome;
	sketch: Sketch | null;
	check?: { l: number; A: number; p: number };
}

const failedSettore = (error: string): SettoreResult => ({ outcome: fail(error), sketch: null });

const RADIANS_HINT = 'scrivi per esempio π/3, 2π/3, 1,5 oppure 3/4π';

/** An angle in radians: "π/3", "2π/3", "2/3π", "0,5π", "pi/4", "1,2". Null when it cannot be read. */
export function parseRadians(input: string): Val | null {
	const s = input
		.toLowerCase()
		.replace(/\s+/g, '')
		.replace(/pigreco|pi/g, 'π')
		.replace(/\*/g, '');
	if (!s) return null;
	const frac = (t: string): Rational | null => {
		const [n, d] = t.split('/');
		const a = parseDecimal(n);
		if (!a || d === undefined) return a;
		const b = parseDecimal(d);
		return b && !b.isZero() ? a.div(b) : null;
	};
	const m = /^(\d+(?:[.,]\d+)?(?:\/\d+(?:[.,]\d+)?)?)?π(?:\/(\d+(?:[.,]\d+)?))?$/.exec(s);
	if (m) {
		const c = m[1] ? frac(m[1]) : q(1);
		const d = m[2] ? parseDecimal(m[2]) : q(1);
		if (!c || !d || d.isZero()) return null;
		return mul(val(c.div(d)), PI);
	}
	if (s.includes('π') || !/^\d+(?:[.,]\d+)?(?:\/\d+(?:[.,]\d+)?)?$/.test(s)) return null;
	const r = frac(s);
	return r ? val(r) : null;
}

/** "\dfrac{1}{6}", or "1". */
const fracTex = (k: Rational) => (k.isInteger() ? `${k.num}` : `\\dfrac{${k.num}}{${k.den}}`);

export function settore(i: SettoreInput): SettoreResult {
	const r = readMeasure({ the: 'il raggio', pi: false }, i.r);
	if (typeof r === 'string' || !r) return failedSettore(typeof r === 'string' ? r : 'Scrivi il raggio, per esempio 6.');
	const u = i.u;
	const deg = i.unit !== 'radianti';
	let alpha: Val;
	if (deg) {
		const a = readMeasure({ the: "l'angolo", pi: false }, i.a);
		if (typeof a === 'string' || !a) return failedSettore(typeof a === 'string' ? a.replace('maggiore di zero: scrivi per esempio 5', 'maggiore di zero: scrivi per esempio 60') : "Scrivi l'angolo, per esempio 60.");
		if (cmp(a, int(360)) > 0) return failedSettore("Un angolo al centro misura al massimo 360°: scrivi per esempio 60, oppure 360 per il cerchio intero.");
		alpha = a;
	} else {
		const text = (i.a ?? '').trim();
		if (!text) return failedSettore(`Scrivi l'angolo in radianti: ${RADIANS_HINT}.`);
		const a = parseRadians(text);
		if (!a) return failedSettore(`L'angolo non è un numero di radianti: ${RADIANS_HINT}.`);
		if (a.x <= 0) return failedSettore("L'angolo deve essere maggiore di zero: scrivi per esempio π/3.");
		if (a.c && a.c.den > 10_000) return failedSettore('Usa al massimo quattro cifre decimali, per esempio 1,2345.');
		if (a.x > 2 * Math.PI * (1 + 1e-12)) return failedSettore('Un angolo al centro misura al massimo 2π radianti, il cerchio intero: scrivi per esempio π/3.');
		alpha = a;
	}
	try {
		const steps: Step[] = [];
		let l: Val;
		let A: Val;
		const whole = deg ? cmp(alpha, int(360)) === 0 : !!alpha.c && alpha.pi === 1 && alpha.c.equals(q(2));
		if (deg) {
			const k = alpha.c!.div(q(360));
			const simple = k.num <= 999 && k.den <= MAX_ANGLE_DEN;
			const kTex = simple ? fracTex(k) : `\\dfrac{${vt(alpha)}}{360}`;
			if (simple)
				steps.push({
					say: 'Trova che parte del cerchio è il settore.',
					math: [`\\dfrac{\\alpha}{360^\\circ} = \\dfrac{${vt(alpha)}^\\circ}{360^\\circ}`, `= \\hl{${kTex}}`],
					then: whole ? 'È il cerchio intero.' : `Il settore è $${kTex.replace('\\dfrac', '\\frac')}$ del cerchio.`
				});
			const C = mul(mul(int(2), PI), r);
			const circle = mul(PI, square(r));
			l = mul(val(k), C);
			A = mul(val(k), circle);
			steps.push(
				{ say: "Calcola la lunghezza dell'arco: la stessa parte della circonferenza.", math: calc('\\ell = \\dfrac{\\alpha}{360^\\circ} \\cdot 2\\pi r', [`${kTex} \\cdot 2\\pi \\cdot ${vt(r)}`, `${kTex} \\cdot ${vt(C)}`], l, u) },
				{ say: "Calcola l'area: la stessa parte dell'area del cerchio.", math: calc('A = \\dfrac{\\alpha}{360^\\circ} \\cdot \\pi r^2', [`${kTex} \\cdot \\pi \\cdot ${sqt(r)}`, `${kTex} \\cdot ${vt(circle)}`], A, u, 2) }
			);
		} else {
			l = mul(alpha, r);
			A = mul(val(q(1, 2)), mul(alpha, square(r)));
			const inDegrees = alpha.c && alpha.pi === 1 ? alpha.c.mul(q(180)) : null;
			steps.push(
				{
					say: "Calcola la lunghezza dell'arco: moltiplica l'angolo per il raggio.",
					math: calc('\\ell = \\alpha \\cdot r', [`${vt(alpha)} \\cdot ${vt(r)}`], l, u),
					then: inDegrees ? `In gradi l'angolo misura $${vt(val(inDegrees))}^\\circ$.` : undefined
				},
				{ say: "Calcola l'area: metà dell'angolo per il quadrato del raggio.", math: calc('A = \\dfrac{1}{2} \\cdot \\alpha \\cdot r^2', [`\\dfrac{1}{2} \\cdot ${vt(alpha)} \\cdot ${sqt(r)}`, `\\dfrac{1}{2} \\cdot ${vt(alpha)} \\cdot ${vt(square(r))}`], A, u, 2) }
			);
		}
		const two = mul(int(2), r);
		const p = sumRow('2p', two, l, u);
		if (whole) {
			steps.push({ say: 'Il perimetro è la sola circonferenza: il settore non ha lati dritti.', math: [`2p = \\ell${shown(l).exact ? ` = \\hl{${shown(l).exact!.tex}${unitTex(u)}}` : ` \\approx \\hl{${shown(l).approx!.tex}${unitTex(u)}}`}`] });
		} else {
			steps.push({ say: "Calcola il perimetro: i due raggi più l'arco.", math: ['2p = 2r + \\ell', `= 2 \\cdot ${vt(r)} + ${vt(l)}`, ...p.lines] });
		}
		const rows = [
			{ label: "Lunghezza dell'arco", value: rowValue('\\ell', l, u) },
			{ label: 'Area del settore', value: rowValue('A', A, u, 2) },
			{ label: 'Perimetro del settore', value: whole ? rowValue('2p', l, u) : p.value }
		];
		const copy = [`ℓ ${valueText(l, u).startsWith('≈') ? '' : '= '}${valueText(l, u)}`, `A ${valueText(A, u, 2).startsWith('≈') ? '' : '= '}${valueText(A, u, 2)}`].join('; ');
		return { outcome: { ok: true, rows, copy, steps }, sketch: sectorSketch(r, alpha, deg, u), check: { l: l.x, A: A.x, p: whole ? l.x : p.x } };
	} catch {
		return failedSettore("Questi numeri sono troppo grandi per un calcolo esatto: prova con misure più piccole, per esempio in un'unità più grande.");
	}
}

function sectorSketch(r: Val, alpha: Val, deg: boolean, u: Unit): Sketch {
	const R = r.x;
	const t = deg ? (alpha.x * Math.PI) / 180 : alpha.x;
	// Symmetric about the vertical, the arc on top.
	const start = Math.PI / 2 - t / 2;
	const n = Math.max(8, Math.ceil((t * 180) / Math.PI / 3));
	const at = (s: number): [number, number] => [R * Math.cos(s), R * Math.sin(s)];
	const arc = Array.from({ length: n + 1 }, (_, k) => at(start + (t * k) / n));
	const full = t >= 2 * Math.PI - 1e-9;
	const outline = full ? arc.slice(0, -1) : [[0, 0] as [number, number], ...arc];
	const mid = Math.PI / 2;
	const d = Math.min(t / 8, 0.1);
	const angleText = deg ? `${shown(alpha).exact?.text ?? shown(alpha).approx!.text}°` : (shown(alpha).exact?.text ?? shown(alpha).approx!.text);
	return {
		outline,
		lines: full ? [[[0, 0], at(start)]] : [],
		labels: [
			{ from: [0, 0], to: at(start), text: `r = ${labelText(r, u)}`, given: true },
			{ from: at(mid - d), to: at(mid + d), text: 'ℓ', given: false }
		],
		right: [],
		caption: { text: `α = ${angleText}`, given: true }
	};
}

// ---------------------------------------------------------------------------------------------------------------
// The annulus.

export type CoronaMode = 'raggi' | 'diametri';

export interface CoronaInput {
	mode: CoronaMode;
	/** The outer radius (or diameter). */
	a: string;
	/** The inner radius (or diameter). */
	b: string;
	u: Unit;
}

/** What the page draws: two circles around the same centre, the ring between them filled. */
export interface Ring {
	R: number;
	r: number;
	/** The labels of the two radii: "R = 10 cm", "r = 6 cm". */
	outer: string;
	inner: string;
}

export interface CoronaResult {
	outcome: Outcome;
	ring: Ring | null;
	check?: { A: number; p: number };
}

const failedCorona = (error: string): CoronaResult => ({ outcome: fail(error), ring: null });

export function corona(i: CoronaInput): CoronaResult {
	const diam = i.mode === 'diametri';
	const [outerName, innerName] = diam ? ['il diametro esterno', 'il diametro interno'] : ['il raggio esterno', 'il raggio interno'];
	const ofInner = diam ? 'del diametro interno' : 'del raggio interno';
	const a = readMeasure({ the: outerName, pi: false }, i.a);
	if (typeof a === 'string' || !a) return failedCorona(typeof a === 'string' ? a : `Scrivi ${outerName}, per esempio 10.`);
	const b = readMeasure({ the: innerName, pi: false }, i.b);
	if (typeof b === 'string' || !b) return failedCorona(typeof b === 'string' ? b : `Scrivi ${innerName}, per esempio 6.`);
	const [big, small] = diam ? ['D', 'd'] : ['R', 'r'];
	const c = cmp(a, b);
	if (c === 0) return failedCorona(`Con ${diam ? 'i diametri uguali' : 'i raggi uguali'} la corona non ha spessore e la sua area è 0. Scrivi ${outerName} più lungo ${ofInner}.`);
	if (c < 0) return failedCorona(`${outerName.charAt(0).toUpperCase()}${outerName.slice(1)} (${big}) deve essere più lungo ${ofInner} (${small}): scambia i due numeri.`);
	const u = i.u;
	try {
		const steps: Step[] = [];
		const half = q(1, 2);
		const [R, r] = diam ? [mul(a, val(half)), mul(b, val(half))] : [a, b];
		if (diam)
			steps.push({
				say: 'Dividi i due diametri per $2$: ottieni i raggi.',
				math: [`R = \\dfrac{D}{2} = \\dfrac{${vt(a)}}{2} = \\hl{${vt(R)}}${unitTex(u)}`, `r = \\dfrac{d}{2} = \\dfrac{${vt(b)}}{2} = \\hl{${vt(r)}}${unitTex(u)}`]
			});
		const [R2, r2] = [square(R), square(r)];
		const A = mul(PI, sub(R2, r2));
		const P = mul(mul(int(2), PI), add(R, r));
		steps.push(
			{ say: "Togli l'area del cerchio piccolo da quella del cerchio grande.", math: ['A = \\pi R^2 - \\pi r^2', '= \\pi\\left(R^2 - r^2\\right)'] },
			{ say: 'Sostituisci i due raggi e calcola.', math: calc('A = \\pi\\left(R^2 - r^2\\right)', [`\\pi\\left(${sqt(R)} - ${sqt(r)}\\right)`, `\\pi\\left(${vt(R2)} - ${vt(r2)}\\right)`, `\\pi \\cdot ${vt(sub(R2, r2))}`], A, u, 2) },
			{ say: 'Per il perimetro somma le due circonferenze.', math: calc('2p = 2\\pi R + 2\\pi r', [`2\\pi\\left(R + r\\right)`, `2\\pi\\left(${vt(R)} + ${vt(r)}\\right)`, `2\\pi \\cdot ${vt(add(R, r))}`], P, u) }
		);
		const rows = [
			{ label: 'Area della corona', value: rowValue('A', A, u, 2) },
			{ label: 'Perimetro, somma delle due circonferenze', value: rowValue('2p', P, u) }
		];
		const copy = `A ${valueText(A, u, 2).startsWith('≈') ? '' : '= '}${valueText(A, u, 2)}`;
		return {
			outcome: { ok: true, rows, copy, steps },
			ring: { R: R.x, r: r.x, outer: `R = ${labelText(R, u)}`, inner: `r = ${labelText(r, u)}` },
			check: { A: A.x, p: P.x }
		};
	} catch {
		return failedCorona("Questi numeri sono troppo grandi per un calcolo esatto: prova con misure più piccole, per esempio in un'unità più grande.");
	}
}
