import { gcd } from '@/lib/exercises/v2/rational';
import { add, cmp, eq, readMeasure, shown, sqrt, square, sqt, sub, valueText, vt, type FigureResult, type Pt, type Unit, type Val } from './geometria';
import { intTex } from './numbers';
import { fail } from './types';

/**
 * The Pythagorean theorem both ways: the hypotenuse from the two legs, or a leg from the hypotenuse and the other
 * leg. Exact when it can be (5, 5√2, √13/2) and with the decimal; the hypotenuse must be the longest side, and a
 * result made of three whole numbers is named as a Pythagorean triple.
 */

export type PitagoraMode = 'ipotenusa' | 'cateto';

export interface PitagoraInput {
	mode: PitagoraMode;
	/** ipotenusa: the first leg; cateto: the hypotenuse. */
	a: string;
	/** ipotenusa: the second leg; cateto: the known leg. */
	b: string;
	unit?: Unit;
}

/**
 * The root and, when a square factor comes out of it, the step that takes it out: "√50 = √(5²·2) = 5√2".
 * `sym` is what the root is, "i" or "c_2".
 */
function rootSteps(sym: string, radicand: Val, root: Val, u: Unit): string[] {
	const t = `\\sqrt{${vt(radicand)}}`;
	const exact = shown(root).exact?.tex;
	if (radicand.c?.isInteger() && root.c?.isInteger() && root.r > 1 && root.c.num > 1) {
		const k = root.c.num;
		return [`Estrai la radice quadrata: $${sym} = ${t}$.`, `Porta fuori dalla radice il fattore quadrato: $${sym} = \\sqrt{${intTex(k * k)} \\cdot ${root.r}} = \\sqrt{${k}^2 \\cdot ${root.r}}${eq(root, u)}$.`];
	}
	// √5 stays √5: only its decimal follows.
	const full = eq(root, u);
	if (exact === t) return [`Estrai la radice quadrata: $${sym} = ${t}${full.slice(full.indexOf(' \\approx'))}$.`];
	return [`Estrai la radice quadrata: $${sym} = ${t}${eq(root, u)}$.`];
}

/** The triple the three sides make, when all three are whole numbers. */
function tripleStep(sides: Val[]): string | null {
	if (!sides.every((v) => v.c && v.r === 1 && v.pi === 0 && v.c.isInteger())) return null;
	const [a, b, c] = sides.map((v) => v.c!.num).sort((x, y) => x - y);
	const g = gcd(gcd(a, b), c);
	const list = `${intTex(a)}, ${intTex(b)}, ${intTex(c)}`;
	if (g === 1) return `I tre lati $${list}$ sono numeri interi: formano una terna pitagorica primitiva, perché non hanno divisori comuni.`;
	return `I tre lati $${list}$ sono numeri interi: formano una terna pitagorica, multipla per ${intTex(g)} della terna primitiva $${intTex(a / g)}, ${intTex(b / g)}, ${intTex(c / g)}$.`;
}

export function pitagora({ mode, a, b, unit = '' }: PitagoraInput): FigureResult {
	const u = unit;
	const x = readMeasure({ the: mode === 'ipotenusa' ? 'il primo cateto' : "l'ipotenusa" }, a);
	if (typeof x === 'string' || !x) return { outcome: fail(x ?? 'Scrivi un numero.'), sketch: null };
	const y = readMeasure({ the: mode === 'ipotenusa' ? 'il secondo cateto' : 'il cateto' }, b);
	if (typeof y === 'string' || !y) return { outcome: fail(y ?? 'Scrivi un numero.'), sketch: null };

	let c1: Val;
	let c2: Val;
	let i: Val;
	const steps: string[] = [];
	if (mode === 'ipotenusa') {
		[c1, c2] = [x, y];
		const sum = add(square(c1), square(c2));
		i = sqrt(sum);
		steps.push(
			`In un triangolo rettangolo il quadrato costruito sull'ipotenusa è uguale alla somma dei quadrati costruiti sui cateti: $i^2 = c_1^2 + c_2^2$.`,
			`Sostituisci i cateti: $i^2 = ${sqt(c1)} + ${sqt(c2)} = ${vt(square(c1))} + ${vt(square(c2))}${eq(sum)}$.`,
			...rootSteps('i', sum, i, u)
		);
		steps.push(`Controlla: l'ipotenusa è più lunga di ciascun cateto, come deve essere.`);
	} else {
		i = x;
		c1 = y;
		const c = cmp(i, c1);
		if (c <= 0) return { outcome: fail(c === 0 ? "L'ipotenusa non può essere uguale al cateto: è il lato più lungo del triangolo rettangolo, quindi deve essere maggiore." : "L'ipotenusa è il lato più lungo del triangolo rettangolo: deve essere maggiore del cateto. Controlla di non averli scambiati."), sketch: null };
		const diff = sub(square(i), square(c1));
		c2 = sqrt(diff);
		steps.push(
			`Controlla i dati: l'ipotenusa, $${vt(i)}$, è più lunga del cateto, $${vt(c1)}$, come deve essere.`,
			`Dal teorema di Pitagora $i^2 = c_1^2 + c_2^2$ ricava il cateto che manca: $c_2^2 = i^2 - c_1^2$.`,
			`Sostituisci: $c_2^2 = ${sqt(i)} - ${sqt(c1)} = ${vt(square(i))} - ${vt(square(c1))}${eq(diff)}$.`,
			...rootSteps('c_2', diff, c2, u)
		);
	}
	const triple = tripleStep([c1, c2, i]);
	if (triple) steps.push(triple);

	const found = mode === 'ipotenusa' ? i : c2;
	const sym = mode === 'ipotenusa' ? 'i' : 'c_2';
	const text = valueText(found, u);

	// The drawing: the right angle at the origin, c₁ along the base, c₂ upwards.
	const O: Pt = [0, 0];
	const P: Pt = [c1.x, 0];
	const Q: Pt = [0, c2.x];
	const label = (v: Val, given: boolean) => (given ? shownLabel(v, u) : '');
	const lab = (from: Pt, to: Pt, name: string, v: Val, given: boolean) => ({ from, to, text: given ? `${name} = ${label(v, given)}` : name, given });
	return {
		outcome: { ok: true, result: `$${sym}${eq(found, u)}$`, copy: `${mode === 'ipotenusa' ? 'i' : 'c2'} ${text.startsWith('≈') ? '' : '= '}${text}`, steps },
		sketch: {
			outline: [O, P, Q],
			lines: [],
			labels: [lab(O, P, 'c₁', c1, true), lab(Q, O, 'c₂', c2, mode === 'ipotenusa'), lab(P, Q, 'i', i, mode === 'cateto')],
			right: [[O, [1, 0], [0, 1]]]
		}
	};
}

function shownLabel(v: Val, u: Unit): string {
	const s = shown(v);
	return `${s.exact && !s.approx ? s.exact.text : valueText(v)}${u ? ` ${u}` : ''}`;
}
