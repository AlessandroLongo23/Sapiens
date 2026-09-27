import { Rational, q } from '@/lib/exercises/v2/rational';
import { add, cmp, div, int, mul, pythagorasSubs, readMeasure, resultLines, rootCalc, rowValue, shown, sqrt, sqt, square, sub, valueText, vt, type Unit, type Val } from './geometria';
import { floatText, parseDegrees } from './gradi-radianti';
import { angleFromFloat } from './gradi-sessagesimali';
import { exactTrig, trigTex } from './goniometria';
import { decimal } from './numbers';
import { fail, type Outcome, type ResultRow, type Step } from './types';

/**
 * Solving triangles with trigonometry: the right triangle from two elements (two sides, or a side and an acute
 * angle), and any triangle with the laws of sines and cosines (three sides, two sides and the angle between them,
 * a side and two angles, two sides and an angle opposite one of them, with its ambiguous case).
 *
 * Italian school notation: vertices A, B, C, the side opposite each vertex a, b, c, the angles α, β, γ. In the right
 * triangle the right angle is at A, so a is the hypotenuse, b and c the legs, β opposite b and γ opposite c.
 *
 * Sides are exact while they can be (5√3 from 10 · sin 60°) and otherwise decimals rounded to two places; angles are
 * exact when they are notable (30°, 45°, 60°, 90°, 120°...) and otherwise in degrees to two decimals and in degrees,
 * primes and seconds.
 */

// ---------------------------------------------------------------------------------------------------------------
// Angles.

/** An angle in degrees: exact when `deg` is set, else known as the float `x`. */
export interface Ang {
	deg: Rational | null;
	x: number;
}

const exactAng = (d: Rational): Ang => ({ deg: d, x: d.num / d.den });
const floatAng = (x: number): Ang => ({ deg: null, x });
const approxVal = (x: number): Val => ({ c: null, r: 1, pi: 0, x });

type Fn = 'sin' | 'cos' | 'tg';
const FN_TEX: Record<Fn, string> = { sin: '\\sin', cos: '\\cos', tg: '\\operatorname{tg}' };
const ARC_TEX: Record<Fn, string> = { sin: '\\arcsin', cos: '\\arccos', tg: '\\operatorname{arctg}' };
const KEY: Record<Fn, string> = { sin: 'sin⁻¹', cos: 'cos⁻¹', tg: 'tan⁻¹' };

/** A goniometric function of an angle: exact for a notable angle, else a decimal. */
function trig(fn: Fn, a: Ang): Val {
	const e = a.deg ? exactTrig(a.deg) : null;
	if (e) return fn === 'sin' ? e.sin : fn === 'cos' ? e.cos : div(e.sin, e.cos);
	const r = (a.x * Math.PI) / 180;
	return approxVal(fn === 'sin' ? Math.sin(r) : fn === 'cos' ? Math.cos(r) : Math.tan(r));
}

const NOTABLE = [30, 45, 60, 90, 120, 135, 150];

/** The angle with a given sine, cosine or tangent: notable when the value is one of the table, else from the float. */
function inverse(fn: Fn, v: Val, obtuse = false): Ang {
	for (const d of NOTABLE) {
		if (fn !== 'cos' && d >= 90 && !(fn === 'sin' && obtuse)) continue;
		if (fn === 'sin' && obtuse && d < 90) continue;
		const t = trig(fn, exactAng(q(d)));
		if (v.c && t.c && t.r === v.r && t.c.equals(v.c)) return exactAng(q(d));
	}
	const x = Math.max(-1, Math.min(1, v.x));
	const deg = fn === 'sin' ? (Math.asin(x) * 180) / Math.PI : fn === 'cos' ? (Math.acos(x) * 180) / Math.PI : (Math.atan(v.x) * 180) / Math.PI;
	return floatAng(obtuse ? 180 - deg : deg);
}

/** Degrees, primes and seconds of an exact angle that is a whole number of seconds but not a short decimal (36° 52′). */
function exactDms(a: Ang): { tex: string; text: string } | null {
	if (!a.deg || decimal(a.deg, 6).exact || !a.deg.mul(q(3600)).isInteger()) return null;
	return angleFromFloat(a.x).dms;
}

/** The angle in a formula: "30^\\circ", "36^\\circ\\, 52'\\, 0''", or rounded "36{,}87^\\circ" (write "\\approx" before it). */
function angTex(a: Ang): string {
	if (a.deg) {
		const d = decimal(a.deg, 6);
		if (d.exact) return `${d.tex}^\\circ`;
		const dms = exactDms(a);
		if (dms) return dms.tex;
	}
	return angleFromFloat(a.x).dec.tex;
}
const angExact = (a: Ang) => !!a.deg && (decimal(a.deg, 6).exact || !!exactDms(a));

/** The result lines of an angle: "= \\hl{30^\\circ}", or "\\approx \\hl{36{,}87^\\circ}" then "\\approx 36^\\circ\\, 52'\\, 12''". */
function angResult(a: Ang): string[] {
	if (angExact(a)) return [`= \\hl{${angTex(a)}}`];
	const f = angleFromFloat(a.x);
	return [`\\approx \\hl{${f.dec.tex}}`, `\\approx ${f.dms.tex}`];
}

function angRow(label: string, sym: string, a: Ang): ResultRow {
	if (angExact(a)) return { label, value: `$${sym} = ${angTex(a)}$${exactDms(a) ? ` $\\approx ${angleFromFloat(a.x).dec.tex}$` : ''}` };
	const f = angleFromFloat(a.x);
	return { label, value: `$${sym} \\approx ${f.dec.tex}$ $\\approx ${f.dms.tex}$` };
}

function angText(a: Ang): string {
	const dms = exactDms(a);
	if (dms) return `= ${dms.text} ≈ ${angleFromFloat(a.x).dec.text}`;
	if (angExact(a)) return `= ${decimal(a.deg!, 6).text}°`;
	const f = angleFromFloat(a.x);
	return `≈ ${f.dec.text} ≈ ${f.dms.text}`;
}

/** An angle typed by the student, strictly between 0° and `max`. */
function readAngle(input: string | undefined, name: string, max: number): Ang | string {
	const t = (input ?? '').trim();
	if (!t) return `Scrivi l'angolo ${name} in gradi, per esempio 30 o 36° 52′.`;
	const d = parseDegrees(t);
	if (!d) return `L'angolo ${name}: scrivi i gradi, per esempio 30, 22,5 oppure 36° 52′ 12″.`;
	if (d.value.sign() <= 0 || d.value.compare(q(max)) >= 0) return `L'angolo ${name} deve essere maggiore di 0° e minore di ${max}°.`;
	if (d.value.den > 36000) return `L'angolo ${name}: usa al massimo quattro cifre decimali.`;
	return exactAng(d.value);
}

/** 180° (or 90°) minus some angles: exact when they all are. */
function rest(total: number, ...angles: Ang[]): Ang {
	if (angles.every((a) => a.deg)) return exactAng(angles.reduce((t, a) => t.sub(a.deg!), q(total)));
	return floatAng(angles.reduce((t, a) => t - a.x, total));
}

// ---------------------------------------------------------------------------------------------------------------
// Writing.

/** A value in a formula: exact, or a decimal to four places when it is a ratio known only approximately. */
const ratioTex = (v: Val) => (v.c ? (v.r > 1 ? trigTex(v) : vt(v)) : floatText(v.x, 4).tex);
/** The value of a function of a notable angle as in the tables (a fraction: 1/2), else as `ratioTex`. */
const notableTex = (v: Val, a: Ang) => (angExact(a) && v.c ? trigTex(v) : ratioTex(v));
/** A value of a goniometric function in a formula, in brackets when negative. */
const trigOperand = (v: Val) => (v.x < 0 ? `\\left(${trigTex(v)}\\right)` : trigTex(v));
const f = (fn: Fn, a: Ang) => `${FN_TEX[fn]} ${angTex(a)}`;

/**
 * A side from a product or a quotient with a goniometric function: the formula, the numbers, the value of the
 * function when it is exact, the result. `times` are the factors: a known side and functions of angles.
 */
function trigCalc(sym: string, formula: string, known: Val, times: [Fn, Ang][], over: [Fn, Ang] | null, result: Val, u: Unit): string[] {
	const names = times.map(([fn, a]) => f(fn, a));
	const values = times.map(([fn, a]) => trig(fn, a));
	const lines = [`${sym} = ${formula}`];
	const num = [vt(known), ...names].join(' \\cdot ');
	lines.push(over ? `= \\dfrac{${num}}{${f(...over)}}` : `= ${num}`);
	const all = over ? [...values, trig(...over)] : values;
	if (all.every((v) => v.c)) {
		const prod = [vt(known), ...values.map(trigOperand)].join(' \\cdot ');
		lines.push(over ? `= ${prod} : ${trigOperand(trig(...over))}` : `= ${prod}`);
	}
	return [...lines, ...resultLines(result, u)];
}

/** "Il lato a, 10 cm" for errors. */
const plain = (v: Val) => valueText(v).replace(/^≈ /, '');

// ---------------------------------------------------------------------------------------------------------------
// The drawing.

export type Pt = [number, number];

export interface TriangleSketch {
	/** Vertices A, B, C, in the figure's units, y upwards. */
	A: Pt;
	B: Pt;
	C: Pt;
	/** a = BC, b = CA, c = AB. */
	sides: { a: SketchLabel; b: SketchLabel; c: SketchLabel };
	/** α at A, β at B, γ at C; null for no label (the right angle, marked with a square). */
	angles: { A: SketchLabel | null; B: SketchLabel | null; C: SketchLabel | null };
	right: 'A' | null;
}

export interface SketchLabel {
	text: string;
	given: boolean;
}

function sideLabel(sym: string, v: Val, given: boolean, u: Unit): SketchLabel {
	const s = shown(v);
	const unit = u ? ` ${u}` : '';
	if (s.exact && !s.approx) return { text: `${sym} = ${s.exact.text}${unit}`, given };
	if (s.exact && s.exact.text.length <= 6) return { text: `${sym} = ${s.exact.text}${unit}`, given };
	return { text: `${sym} ≈ ${s.approx!.text}${unit}`, given };
}

function angleLabel(sym: string, a: Ang, given: boolean): SketchLabel {
	if (angExact(a)) return { text: `${sym} = ${decimal(a.deg!, 6).text}°`, given };
	if (a.deg) return { text: `${sym} = ${angleFromFloat(a.x).dms.text}`, given };
	return { text: `${sym} ≈ ${angleFromFloat(a.x).dec.text}`, given };
}

export interface TriangleResult {
	outcome: Outcome;
	sketch: TriangleSketch | null;
}

const failed = (error: string): TriangleResult => ({ outcome: fail(error), sketch: null });

// ---------------------------------------------------------------------------------------------------------------
// The right triangle.

export type RettangoloMode = 'cateti' | 'ipotenusa-cateto' | 'ipotenusa-angolo' | 'cateto-opposto' | 'cateto-adiacente';

export const RETTANGOLO_MODES: { value: RettangoloMode; label: string; fields: [string, string]; example: [string, string] }[] = [
	{ value: 'cateti', label: 'Due cateti', fields: ['Cateto b', 'Cateto c'], example: ['6', '8'] },
	{ value: 'ipotenusa-cateto', label: 'Ipotenusa e cateto', fields: ['Ipotenusa a', 'Cateto b'], example: ['10', '5'] },
	{ value: 'ipotenusa-angolo', label: 'Ipotenusa e angolo', fields: ['Ipotenusa a', 'Angolo β'], example: ['12', '30'] },
	{ value: 'cateto-opposto', label: 'Cateto e angolo opposto', fields: ['Cateto b', 'Angolo β (opposto a b)'], example: ['5', '40'] },
	{ value: 'cateto-adiacente', label: 'Cateto e angolo adiacente', fields: ['Cateto b', 'Angolo γ (adiacente a b)'], example: ['9', '60'] }
];

const RIGHT_ANGLE_STEP: Step = {
	say: 'Gli angoli acuti di un triangolo rettangolo sono complementari.',
	math: ['\\beta + \\gamma = 90^\\circ']
};

/** The acute angle that is left: 90° minus the other. */
function complementStep(sym: string, other: string, o: Ang, found: Ang): Step {
	const exact = angExact(o);
	return {
		say: `Trova $${sym}$: è il complementare di $${other}$.`,
		math: [`${sym} = 90^\\circ - ${other}`, `${exact ? '=' : '\\approx'} 90^\\circ - ${angTex(o)}`, ...angResult(found)]
	};
}

/** An acute angle from the ratio of two sides. */
function inverseSteps(sym: string, fn: Fn, ratioFormula: string, top: Val, bottom: Val, ratio: Val, a: Ang, why: string): Step[] {
	const exactRatio = !!ratio.c;
	return [
		{
			say: why,
			math: [`${FN_TEX[fn]} ${sym} = ${ratioFormula}`, `= \\dfrac{${vt(top)}}{${vt(bottom)}}`, `${exactRatio ? '=' : '\\approx'} \\hl{${notableTex(ratio, a)}}`]
		},
		angExact(a)
			? {
					say: `Riconosci l'angolo: è un angolo notevole.`,
					math: [`${sym} = ${ARC_TEX[fn]} ${notableTex(ratio, a)}`, ...angResult(a)],
					then: `${fn === 'tg' ? 'La tangente' : fn === 'sin' ? 'Il seno' : 'Il coseno'} di $${angTex(a)}$ vale proprio $${notableTex(ratio, a)}$.`
				}
			: {
					say: `Ricava l'angolo con il tasto ${KEY[fn]} della calcolatrice, in gradi.`,
					math: [`${sym} = ${ARC_TEX[fn]} ${notableTex(ratio, a)}`, ...angResult(a)]
				}
	];
}

export function triangoloRettangolo(mode: string, x: string, y: string, unit: Unit = ''): TriangleResult {
	const spec = RETTANGOLO_MODES.find((m) => m.value === mode);
	if (!spec) return failed('Scegli quali elementi del triangolo conosci.');
	const u = unit;
	const side = (input: string, the: string) => readMeasure({ the }, input);
	let a: Val, b: Val, c: Val;
	let beta: Ang, gamma: Ang;
	const given = { a: false, b: false, c: false, beta: false, gamma: false };
	const steps: Step[] = [];
	const rows: ResultRow[] = [];
	const items: string[] = [];
	const addSide = (label: string, sym: string, v: Val) => {
		rows.push({ label, value: rowValue(sym, v, u) });
		const t = valueText(v, u);
		items.push(`${sym} ${t.startsWith('≈') ? '' : '= '}${t}`);
	};
	const addAngle = (label: string, sym: string, name: string, ang: Ang) => {
		rows.push(angRow(label, sym, ang));
		items.push(`${name} ${angText(ang)}`);
	};

	if (mode === 'cateti' || mode === 'ipotenusa-cateto') {
		const first = side(x, mode === 'cateti' ? 'il cateto b' : "l'ipotenusa a");
		if (typeof first === 'string' || !first) return failed(first ?? 'Scrivi un numero, per esempio 6.');
		const second = side(y, mode === 'cateti' ? 'il cateto c' : 'il cateto b');
		if (typeof second === 'string' || !second) return failed(second ?? 'Scrivi un numero, per esempio 8.');
		if (mode === 'cateti') {
			[b, c] = [first, second];
			given.b = given.c = true;
			a = sqrt(add(square(b), square(c)));
			const ratio = div(b, c);
			beta = inverse('tg', ratio);
			gamma = rest(90, beta);
			steps.push({
				group: "L'ipotenusa",
				say: "Trova l'ipotenusa con il teorema di Pitagora.",
				math: [`a = \\sqrt{b^2 + c^2}`, ...pythagorasSubs(b, c, '+').map((l) => `= ${l}`), ...resultLines(a, u)]
			});
			steps.push(...inverseSteps('\\beta', 'tg', '\\dfrac{b}{c}', b, c, ratio, beta, 'Il cateto opposto a $\\beta$ diviso il cateto adiacente è la tangente di $\\beta$.'));
			steps[1].group = 'Gli angoli';
			steps.push(complementStep('\\gamma', '\\beta', beta, gamma));
			addSide('Ipotenusa', 'a', a);
		} else {
			[a, b] = [first, second];
			given.a = given.b = true;
			if (cmp(a, b) <= 0) return failed(`L'ipotenusa è il lato più lungo: deve essere maggiore del cateto. Con cateto ${plain(b)}, prova un'ipotenusa maggiore, per esempio ${plain(add(b, int(1)))}.`);
			c = sqrt(sub(square(a), square(b)));
			const ratio = div(b, a);
			beta = inverse('sin', ratio);
			gamma = rest(90, beta);
			steps.push({
				group: 'Il cateto che manca',
				say: 'Trova il cateto $c$ con il teorema di Pitagora.',
				math: [`c = \\sqrt{a^2 - b^2}`, ...pythagorasSubs(a, b, '-').map((l) => `= ${l}`), ...resultLines(c, u)]
			});
			steps.push(...inverseSteps('\\beta', 'sin', '\\dfrac{b}{a}', b, a, ratio, beta, "Il cateto opposto a $\\beta$ diviso l'ipotenusa è il seno di $\\beta$."));
			steps[1].group = 'Gli angoli';
			steps.push(complementStep('\\gamma', '\\beta', beta, gamma));
			addSide('Cateto c', 'c', c);
		}
		addAngle('Angolo β', '\\beta', 'β', beta);
		addAngle('Angolo γ', '\\gamma', 'γ', gamma);
	} else {
		const s = side(x, mode === 'ipotenusa-angolo' ? "l'ipotenusa a" : 'il cateto b');
		if (typeof s === 'string' || !s) return failed(s ?? 'Scrivi un numero, per esempio 10.');
		const ang = readAngle(y, mode === 'cateto-adiacente' ? 'γ' : 'β', 90);
		if (typeof ang === 'string') return failed(ang);
		if (mode === 'ipotenusa-angolo') {
			a = s;
			beta = ang;
			given.a = given.beta = true;
			gamma = rest(90, beta);
			b = mul(a, trig('sin', beta));
			c = mul(a, trig('cos', beta));
			steps.push({ ...RIGHT_ANGLE_STEP, group: "L'angolo che manca" }, complementStep('\\gamma', '\\beta', beta, gamma));
			steps.push({
				group: 'I cateti',
				say: "Un cateto è l'ipotenusa per il seno dell'angolo opposto.",
				math: trigCalc('b', 'a \\sin\\beta', a, [['sin', beta]], null, b, u)
			});
			steps.push({
				say: "Un cateto è l'ipotenusa per il coseno dell'angolo adiacente.",
				math: trigCalc('c', 'a \\cos\\beta', a, [['cos', beta]], null, c, u)
			});
			addAngle('Angolo γ', '\\gamma', 'γ', gamma);
			addSide('Cateto b', 'b', b);
			addSide('Cateto c', 'c', c);
		} else if (mode === 'cateto-opposto') {
			b = s;
			beta = ang;
			given.b = given.beta = true;
			gamma = rest(90, beta);
			a = div(b, trig('sin', beta));
			c = mul(b, trig('tg', gamma));
			steps.push({ ...RIGHT_ANGLE_STEP, group: "L'angolo che manca" }, complementStep('\\gamma', '\\beta', beta, gamma));
			steps.push({
				group: 'I lati',
				say: "Un cateto è l'ipotenusa per il seno dell'angolo opposto: ricava $a$.",
				math: [`b = a \\sin\\beta`, ...trigCalc('a', '\\dfrac{b}{\\sin\\beta}', b, [], ['sin', beta], a, u)]
			});
			steps.push({
				say: "Un cateto è l'altro cateto per la tangente dell'angolo opposto al primo.",
				math: trigCalc('c', 'b \\operatorname{tg}\\gamma', b, [['tg', gamma]], null, c, u)
			});
			addAngle('Angolo γ', '\\gamma', 'γ', gamma);
			addSide('Ipotenusa', 'a', a);
			addSide('Cateto c', 'c', c);
		} else {
			b = s;
			gamma = ang;
			given.b = given.gamma = true;
			beta = rest(90, gamma);
			a = div(b, trig('cos', gamma));
			c = mul(b, trig('tg', gamma));
			steps.push({ ...RIGHT_ANGLE_STEP, group: "L'angolo che manca" }, complementStep('\\beta', '\\gamma', gamma, beta));
			steps.push({
				group: 'I lati',
				say: "Un cateto è l'ipotenusa per il coseno dell'angolo adiacente: ricava $a$.",
				math: [`b = a \\cos\\gamma`, ...trigCalc('a', '\\dfrac{b}{\\cos\\gamma}', b, [], ['cos', gamma], a, u)]
			});
			steps.push({
				say: "Un cateto è l'altro cateto per la tangente dell'angolo opposto al primo.",
				math: trigCalc('c', 'b \\operatorname{tg}\\gamma', b, [['tg', gamma]], null, c, u)
			});
			addAngle('Angolo β', '\\beta', 'β', beta);
			addSide('Ipotenusa', 'a', a);
			addSide('Cateto c', 'c', c);
		}
	}
	const sketch: TriangleSketch = {
		A: [0, 0],
		B: [0, c.x],
		C: [b.x, 0],
		sides: { a: sideLabel('a', a, given.a, u), b: sideLabel('b', b, given.b, u), c: sideLabel('c', c, given.c, u) },
		angles: { A: null, B: angleLabel('β', beta, given.beta), C: angleLabel('γ', gamma, given.gamma) },
		right: 'A'
	};
	return { outcome: { ok: true, rows, copy: items.join('; '), steps }, sketch };
}

// ---------------------------------------------------------------------------------------------------------------
// Any triangle.

export type QualsiasiMode = 'lll' | 'lal' | 'ala' | 'lla';

export const QUALSIASI_MODES: { value: QualsiasiMode; label: string; fields: [string, string, string]; example: [string, string, string]; hint: string }[] = [
	{ value: 'lll', label: 'Tre lati', fields: ['Lato a', 'Lato b', 'Lato c'], example: ['7', '5', '8'], hint: 'Ogni lato deve essere minore della somma degli altri due.' },
	{ value: 'lal', label: "Due lati e l'angolo tra loro", fields: ['Lato b', 'Lato c', 'Angolo α (tra b e c)'], example: ['5', '8', '60'], hint: "L'angolo α è quello compreso tra i lati b e c." },
	{ value: 'ala', label: 'Un lato e due angoli', fields: ['Lato a', 'Angolo β', 'Angolo γ'], example: ['10', '45', '105'], hint: 'β e γ sono gli angoli ai due estremi del lato a.' },
	{
		value: 'lla',
		label: 'Due lati e un angolo opposto',
		fields: ['Lato a', 'Lato b', 'Angolo α (opposto ad a)'],
		example: ['6', '8', '40'],
		hint: "L'angolo α è opposto al lato a: possono esserci due triangoli, uno o nessuno."
	}
];

/** A side from the law of cosines: the lines of x² = y² + z² − 2yz cos θ, then the root. */
function cosineLaw(sym: string, y: Val, z: Val, ys: string, zs: string, angSym: string, ang: Ang, u: Unit): { steps: Step[]; v: Val } {
	const cos = trig('cos', ang);
	const y2 = square(y);
	const z2 = square(z);
	const two = mul(mul(int(2), y), z);
	const term = mul(two, cos);
	const sq = sub(add(y2, z2), term);
	const lines = [`${sym}^2 = ${ys}^2 + ${zs}^2 - 2${ys}${zs}\\cos${angSym}`, `= ${sqt(y)} + ${sqt(z)} - 2 \\cdot ${vt(y)} \\cdot ${vt(z)} \\cdot ${f('cos', ang)}`];
	if (cos.c) {
		lines.push(`= ${vt(y2)} + ${vt(z2)} - ${vt(two)} \\cdot ${trigOperand(cos)}`);
		if (term.c && !term.x) lines.push(`= ${vt(y2)} + ${vt(z2)}`);
		else if (term.c) lines.push(`= ${vt(add(y2, z2))} ${term.x < 0 ? '+' : '-'} ${vt(term.x < 0 ? mul(term, int(-1)) : term)}`);
	}
	lines.push(`${sq.c ? '=' : '\\approx'} \\hl{${vt(sq)}}`);
	const v = sqrt(sq);
	return {
		steps: [
			{ say: `Trova $${sym}$ con il teorema del coseno.`, math: lines, then: ang.deg && ang.deg.equals(q(90)) ? 'Con un angolo retto il coseno vale zero: è il teorema di Pitagora.' : undefined },
			{ say: 'Estrai la radice quadrata.', math: rootCalc(sym, sq, v, u) }
		],
		v
	};
}

/** An angle from three sides with the law of cosines: cos θ = (y² + z² − x²) / (2yz). */
function angleByCosines(sym: string, xs: string, ys: string, zs: string, x: Val, y: Val, z: Val): { step: Step; ang: Ang } {
	const num = sub(add(square(y), square(z)), square(x));
	const den = mul(mul(int(2), y), z);
	const cos = div(num, den);
	const ang = inverse('cos', cos);
	const exact = !!cos.c;
	return {
		ang,
		step: {
			say: `Ricava $\\cos ${sym}$ dal teorema del coseno, poi usa ${KEY.cos}.`,
			math: [
				`\\cos ${sym} = \\dfrac{${ys}^2 + ${zs}^2 - ${xs}^2}{2${ys}${zs}}`,
				`${num.c && den.c ? '=' : '\\approx'} \\dfrac{${vt(square(y))} + ${vt(square(z))} - ${vt(square(x))}}{2 \\cdot ${vt(y)} \\cdot ${vt(z)}}`,
				`${exact ? '=' : '\\approx'} ${notableTex(cos, ang)}`,
				`${sym} = \\arccos ${exact && cos.x < 0 ? `\\left(${notableTex(cos, ang)}\\right)` : notableTex(cos, ang)}`,
				...angResult(ang)
			],
			then: cos.x < 0 ? "Il coseno è negativo: l'angolo è ottuso." : cos.x === 0 ? "Il coseno è zero: l'angolo è retto." : undefined
		}
	};
}

/** A side from the law of sines: x = known · sin θx / sin θk. */
function sineLawStep(sym: string, known: Val, ks: string, kAng: Ang, kSym: string, ang: Ang, aSym: string, u: Unit): { step: Step; v: Val } {
	const v = div(mul(known, trig('sin', ang)), trig('sin', kAng));
	return {
		v,
		step: {
			say: `Trova $${sym}$ con il teorema dei seni.`,
			math: [`\\dfrac{${sym}}{\\sin ${aSym}} = \\dfrac{${ks}}{\\sin ${kSym}}`, ...trigCalc(sym, `\\dfrac{${ks} \\sin ${aSym}}{\\sin ${kSym}}`, known, [['sin', ang]], ['sin', kAng], v, u)]
		}
	};
}

/** The third angle, 180° minus the other two. */
function thirdAngleStep(sym: string, s1: string, s2: string, a1: Ang, a2: Ang, found: Ang): Step {
	const exact = angExact(a1) && angExact(a2);
	return {
		say: 'La somma degli angoli di un triangolo è $180^\\circ$.',
		math: [`${sym} = 180^\\circ - ${s1} - ${s2}`, `${exact ? '=' : '\\approx'} 180^\\circ - ${angTex(a1)} - ${angTex(a2)}`, ...angResult(found)]
	};
}

interface Solved {
	a: Val;
	b: Val;
	c: Val;
	alpha: Ang;
	beta: Ang;
	gamma: Ang;
}

function sketchOf(t: Solved, given: Record<'a' | 'b' | 'c' | 'alpha' | 'beta' | 'gamma', boolean>, u: Unit): TriangleSketch {
	const r = (t.alpha.x * Math.PI) / 180;
	return {
		A: [0, 0],
		B: [t.c.x, 0],
		C: [t.b.x * Math.cos(r), t.b.x * Math.sin(r)],
		sides: { a: sideLabel('a', t.a, given.a, u), b: sideLabel('b', t.b, given.b, u), c: sideLabel('c', t.c, given.c, u) },
		angles: { A: angleLabel('α', t.alpha, given.alpha), B: angleLabel('β', t.beta, given.beta), C: angleLabel('γ', t.gamma, given.gamma) },
		right: null
	};
}

export function triangoloQualsiasi(mode: string, x: string, y: string, z: string, unit: Unit = ''): TriangleResult {
	const spec = QUALSIASI_MODES.find((m) => m.value === mode);
	if (!spec) return failed('Scegli quali elementi del triangolo conosci.');
	const u = unit;
	const side = (input: string, the: string): Val | string => {
		const v = readMeasure({ the }, input);
		return v ?? 'Scrivi un numero, per esempio 5.';
	};
	const steps: Step[] = [];
	const given = { a: false, b: false, c: false, alpha: false, beta: false, gamma: false };
	let t: Solved;
	const rows: ResultRow[] = [];
	const items: string[] = [];
	const addSide = (label: string, sym: string, v: Val) => {
		rows.push({ label, value: rowValue(sym, v, u) });
		const s = valueText(v, u);
		items.push(`${sym} ${s.startsWith('≈') ? '' : '= '}${s}`);
	};
	const addAngle = (label: string, sym: string, name: string, ang: Ang) => {
		rows.push(angRow(label, sym, ang));
		items.push(`${name} ${angText(ang)}`);
	};

	if (mode === 'lll') {
		const a = side(x, 'il lato a');
		if (typeof a === 'string') return failed(a);
		const b = side(y, 'il lato b');
		if (typeof b === 'string') return failed(b);
		const c = side(z, 'il lato c');
		if (typeof c === 'string') return failed(c);
		Object.assign(given, { a: true, b: true, c: true });
		const [s0, s1, big] = [a, b, c].sort((p, r) => cmp(p, r));
		const sum = add(s0, s1);
		if (cmp(big, sum) >= 0) return failed(`Con questi lati il triangolo non esiste: il lato più lungo, ${plain(big)}, deve essere minore della somma degli altri due, ${plain(sum)}.`);
		steps.push({
			group: 'Il triangolo esiste?',
			say: 'Controlla che il lato più lungo sia minore della somma degli altri due.',
			math: [`${vt(s0)} + ${vt(s1)} = ${vt(sum)}`, `\\hl{${vt(big)} < ${vt(sum)}}`]
		});
		const A = angleByCosines('\\alpha', 'a', 'b', 'c', a, b, c);
		const B = angleByCosines('\\beta', 'b', 'a', 'c', b, a, c);
		// γ by difference, as at school; exact when the law of cosines gives a notable angle (3, 4, 5: γ = 90°).
		const G = angleByCosines('\\gamma', 'c', 'a', 'b', c, a, b).ang;
		const gamma = G.deg ? G : rest(180, A.ang, B.ang);
		steps.push({ ...A.step, group: 'Gli angoli' }, B.step, thirdAngleStep('\\gamma', '\\alpha', '\\beta', A.ang, B.ang, gamma));
		t = { a, b, c, alpha: A.ang, beta: B.ang, gamma };
		addAngle('Angolo α', '\\alpha', 'α', t.alpha);
		addAngle('Angolo β', '\\beta', 'β', t.beta);
		addAngle('Angolo γ', '\\gamma', 'γ', t.gamma);
	} else if (mode === 'lal') {
		const b = side(x, 'il lato b');
		if (typeof b === 'string') return failed(b);
		const c = side(y, 'il lato c');
		if (typeof c === 'string') return failed(c);
		const alpha = readAngle(z, 'α', 180);
		if (typeof alpha === 'string') return failed(alpha);
		Object.assign(given, { b: true, c: true, alpha: true });
		const law = cosineLaw('a', b, c, 'b', 'c', '\\alpha', alpha, u);
		law.steps[0].group = 'Il terzo lato';
		steps.push(...law.steps);
		const a = law.v;
		// The law of cosines, not of sines: an arccosine is never ambiguous.
		const B = angleByCosines('\\beta', 'b', 'a', 'c', b, a, c);
		const G = angleByCosines('\\gamma', 'c', 'a', 'b', c, a, b).ang;
		const gamma = G.deg ? G : rest(180, alpha, B.ang);
		steps.push({ ...B.step, group: 'Gli angoli' }, thirdAngleStep('\\gamma', '\\alpha', '\\beta', alpha, B.ang, gamma));
		t = { a, b, c, alpha, beta: B.ang, gamma };
		addSide('Lato a', 'a', a);
		addAngle('Angolo β', '\\beta', 'β', t.beta);
		addAngle('Angolo γ', '\\gamma', 'γ', t.gamma);
	} else if (mode === 'ala') {
		const a = side(x, 'il lato a');
		if (typeof a === 'string') return failed(a);
		const beta = readAngle(y, 'β', 180);
		if (typeof beta === 'string') return failed(beta);
		const gamma = readAngle(z, 'γ', 180);
		if (typeof gamma === 'string') return failed(gamma);
		if (beta.deg!.add(gamma.deg!).compare(q(180)) >= 0) return failed('La somma di β e γ deve essere minore di 180°, perché anche α deve essere maggiore di zero. Per esempio: 45° e 105°.');
		Object.assign(given, { a: true, beta: true, gamma: true });
		const alpha = rest(180, beta, gamma);
		steps.push({ ...thirdAngleStep('\\alpha', '\\beta', '\\gamma', beta, gamma, alpha), group: "L'angolo che manca" });
		const B = sineLawStep('b', a, 'a', alpha, '\\alpha', beta, '\\beta', u);
		const C = sineLawStep('c', a, 'a', alpha, '\\alpha', gamma, '\\gamma', u);
		steps.push({ ...B.step, group: 'I lati' }, C.step);
		t = { a, b: B.v, c: C.v, alpha, beta, gamma };
		addAngle('Angolo α', '\\alpha', 'α', alpha);
		addSide('Lato b', 'b', t.b);
		addSide('Lato c', 'c', t.c);
	} else {
		return llaCase(x, y, z, u);
	}
	return { outcome: { ok: true, rows, copy: items.join('; '), steps }, sketch: sketchOf(t, given, u) };
}

/** Two sides and the angle opposite one of them: none, one or two triangles. */
function llaCase(x: string, y: string, z: string, u: Unit): TriangleResult {
	const a = readMeasure({ the: 'il lato a' }, x);
	if (typeof a === 'string' || !a) return failed(a ?? 'Scrivi un numero, per esempio 6.');
	const b = readMeasure({ the: 'il lato b' }, y);
	if (typeof b === 'string' || !b) return failed(b ?? 'Scrivi un numero, per esempio 8.');
	const alpha = readAngle(z, 'α', 180);
	if (typeof alpha === 'string') return failed(alpha);
	const sinA = trig('sin', alpha);
	const sinB = div(mul(b, sinA), a);
	const one = sinB.c ? sinB.c.equals(q(1)) && sinB.r === 1 : Math.abs(sinB.x - 1) < 1e-12;
	if (sinB.x > 1 && !one) {
		return failed(`Con questi dati il triangolo non esiste: dal teorema dei seni, il seno di β verrebbe maggiore di 1. Il lato a deve essere almeno ${plain(mul(b, sinA))}.`);
	}
	const beta1 = one ? exactAng(q(90)) : inverse('sin', sinB);
	const beta2 = one ? null : inverse('sin', sinB, true);
	// β₂ = 180° − β₁ is a solution only when α + β₂ < 180°; with α obtuse, not even β₁ fits unless a > b.
	const fits = (bt: Ang) => (alpha.deg && bt.deg ? alpha.deg.add(bt.deg).compare(q(180)) < 0 : alpha.x + bt.x < 180 - 1e-9);
	const solutions = [beta1, ...(beta2 && fits(beta2) ? [beta2] : [])].filter(fits);
	if (!solutions.length) return failed("Con questi dati il triangolo non esiste: l'angolo α non è acuto, quindi il lato a deve essere il più lungo. Prova con a maggiore di b.");

	const steps: Step[] = [
		{
			group: "L'angolo β",
			say: 'Scrivi il teorema dei seni e ricava $\\sin\\beta$.',
			math: [
				'\\dfrac{a}{\\sin\\alpha} = \\dfrac{b}{\\sin\\beta}',
				'\\sin\\beta = \\dfrac{b \\sin\\alpha}{a}',
				`= \\dfrac{${vt(b)} \\cdot ${f('sin', alpha)}}{${vt(a)}}`,
				`${sinB.c ? '=' : '\\approx'} \\hl{${notableTex(sinB, beta1)}}`
			]
		}
	];
	const arcLines = [`\\beta_1 = \\arcsin ${notableTex(sinB, beta1)}`, ...angResult(beta1)];
	if (one) {
		steps.push({ say: "Il seno vale 1: l'angolo è retto.", math: [`\\beta = \\arcsin 1 = \\hl{90^\\circ}`], then: 'Il triangolo è uno solo, ed è rettangolo in $B$.' });
	} else {
		steps.push({
			say: `Con il tasto ${KEY.sin} trovi un angolo acuto.`,
			math: arcLines,
			then: angExact(beta1) ? `Il seno di $${angTex(beta1)}$ vale proprio $${notableTex(sinB, beta1)}$.` : undefined
		});
		const b2 = beta2!;
		steps.push({
			say: 'Anche il supplementare di $\\beta_1$ ha lo stesso seno.',
			math: [`\\beta_2 = 180^\\circ - \\beta_1`, ...angResult(b2)],
			then:
				solutions.length === 2
					? `Anche $\\alpha + \\beta_2$ è minore di $180^\\circ$: ci sono due triangoli.`
					: `Però $\\alpha + \\beta_2$ non è minore di $180^\\circ$: il triangolo è uno solo, con $\\beta = \\beta_1$.`
		});
	}

	const tris: Solved[] = [];
	for (const [i, beta] of solutions.entries()) {
		const gamma = rest(180, alpha, beta);
		const label = solutions.length === 2 ? (i === 0 ? 'Il primo triangolo' : 'Il secondo triangolo') : 'Gli altri elementi';
		const bs = solutions.length === 2 ? `\\beta_${i + 1}` : '\\beta';
		const gs = solutions.length === 2 ? `\\gamma_${i + 1}` : '\\gamma';
		const cs = solutions.length === 2 ? `c_${i + 1}` : 'c';
		const third = thirdAngleStep(gs, '\\alpha', bs, alpha, beta, gamma);
		const C = sineLawStep(cs, a, 'a', alpha, '\\alpha', gamma, gs, u);
		steps.push({ ...third, group: label }, C.step);
		tris.push({ a, b, c: C.v, alpha, beta, gamma });
	}
	const rows: ResultRow[] = [];
	const items: string[] = [];
	tris.forEach((tr, i) => {
		const n = tris.length === 2 ? `${i + 1}` : '';
		const sub = tris.length === 2 ? `_${n}` : '';
		const word = tris.length === 2 ? (i === 0 ? ' (primo triangolo)' : ' (secondo triangolo)') : '';
		rows.push(angRow(`Angolo β${word}`, `\\beta${sub}`, tr.beta), angRow(`Angolo γ${word}`, `\\gamma${sub}`, tr.gamma), { label: `Lato c${word}`, value: rowValue(`c${sub}`, tr.c, u) });
		const cText = valueText(tr.c, u);
		items.push(`β${n} ${angText(tr.beta)}; γ${n} ${angText(tr.gamma)}; c${n} ${cText.startsWith('≈') ? '' : '= '}${cText}`);
	});
	const given = { a: true, b: true, c: false, alpha: true, beta: false, gamma: false };
	return { outcome: { ok: true, rows, copy: items.join('; '), steps }, sketch: sketchOf(tris[0], given, u) };
}
