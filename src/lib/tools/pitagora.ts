import { gcd } from '@/lib/exercises/v2/rational';
import { add, cmp, readMeasure, rootCalc, rowValue, shown, sqrt, square, sqt, sub, valueText, vt, type FigureResult, type Pt, type Unit, type Val } from './geometria';
import { intTex } from './numbers';
import { fail, type Step } from './types';

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

/** The triple the three sides make, when all three are whole numbers: a table, the primitive one under it. */
function tripleStep(legs: [Val, Val], hyp: Val): Step | null {
	const sides = [...legs, hyp];
	if (!sides.every((v) => v.c && v.r === 1 && v.pi === 0 && v.c.isInteger())) return null;
	const [a, b] = legs.map((v) => v.c!.num).sort((x, y) => x - y);
	const c = hyp.c!.num;
	const g = gcd(gcd(a, b), c);
	const row = (name: string, k: number) => [name, `$${intTex(a / k)}$`, `$${intTex(b / k)}$`, `$${intTex(c / k)}$`];
	return {
		say: 'I tre lati sono numeri interi: formano una terna pitagorica.',
		table: { head: ['Terna', 'Cateto', 'Cateto', 'Ipotenusa'], rows: g === 1 ? [row('questa', 1)] : [row('questa', 1), row('primitiva', g)] },
		then: g === 1 ? 'È una terna primitiva, perché i tre numeri non hanno divisori comuni.' : `È la terna primitiva moltiplicata per ${intTex(g)}.`
	};
}

export function pitagora({ mode, a, b, unit = '' }: PitagoraInput): FigureResult {
	const u = unit;
	const x = readMeasure({ the: mode === 'ipotenusa' ? 'il primo cateto' : "l'ipotenusa" }, a);
	if (typeof x === 'string' || !x) return { outcome: fail(x ?? 'Scrivi un numero, per esempio 6.'), sketch: null };
	const y = readMeasure({ the: mode === 'ipotenusa' ? 'il secondo cateto' : 'il cateto' }, b);
	if (typeof y === 'string' || !y) return { outcome: fail(y ?? 'Scrivi un numero, per esempio 8.'), sketch: null };

	let c1: Val;
	let c2: Val;
	let i: Val;
	const steps: Step[] = [];
	if (mode === 'ipotenusa') {
		[c1, c2] = [x, y];
		const sum = add(square(c1), square(c2));
		i = sqrt(sum);
		const longer = cmp(c1, c2) >= 0 ? c1 : c2;
		steps.push(
			{ say: "Scrivi il teorema di Pitagora: vale in ogni triangolo rettangolo.", math: ['i^2 = c_1^2 + c_2^2'] },
			{ say: 'Sostituisci i cateti e calcola i quadrati.', math: [`i^2 = ${sqt(c1)} + ${sqt(c2)}`, `= ${vt(square(c1))} + ${vt(square(c2))}`, `= \\hl{${vt(sum)}}`] },
			{ say: 'Estrai la radice quadrata.', math: rootCalc('i', sum, i, u) },
			{ say: "Controlla: l'ipotenusa deve essere il lato più lungo.", math: [`${vt(i)} > ${vt(longer)}`], then: "L'ipotenusa è più lunga di ciascun cateto, come deve essere." }
		);
	} else {
		i = x;
		c1 = y;
		const c = cmp(i, c1);
		if (c <= 0)
			return {
				outcome: fail(
					c === 0
						? "L'ipotenusa non può essere uguale al cateto: è il lato più lungo del triangolo rettangolo. Per esempio: ipotenusa 13, cateto 5."
						: "L'ipotenusa è il lato più lungo del triangolo rettangolo: deve essere maggiore del cateto. Controlla di non averli scambiati: per esempio ipotenusa 13, cateto 5."
				),
				sketch: null
			};
		const diff = sub(square(i), square(c1));
		c2 = sqrt(diff);
		steps.push(
			{ say: "Controlla i dati: l'ipotenusa deve essere il lato più lungo.", math: [`${vt(i)} > ${vt(c1)}`], then: 'Lo è: si può andare avanti.' },
			{ say: 'Dal teorema di Pitagora ricava il quadrato del cateto che manca.', math: ['i^2 = c_1^2 + c_2^2', 'c_2^2 = i^2 \\hl{- c_1^2}'] },
			{ say: 'Sostituisci e calcola i quadrati.', math: [`c_2^2 = ${sqt(i)} - ${sqt(c1)}`, `= ${vt(square(i))} - ${vt(square(c1))}`, `= \\hl{${vt(diff)}}`] },
			{ say: 'Estrai la radice quadrata.', math: rootCalc('c_2', diff, c2, u) }
		);
	}
	const triple = tripleStep([c1, c2], i);
	if (triple) steps.push(triple);

	const found = mode === 'ipotenusa' ? i : c2;
	const sym = mode === 'ipotenusa' ? 'i' : 'c_2';
	const text = valueText(found, u);

	// The drawing: the right angle at the origin, c₁ along the base, c₂ upwards.
	const O: Pt = [0, 0];
	const P: Pt = [c1.x, 0];
	const Q: Pt = [0, c2.x];
	const lab = (from: Pt, to: Pt, name: string, v: Val, given: boolean) => ({ from, to, text: given ? `${name} = ${shownLabel(v, u)}` : name, given });
	return {
		outcome: {
			ok: true,
			rows: [{ label: mode === 'ipotenusa' ? 'Ipotenusa' : 'Secondo cateto', value: rowValue(sym, found, u) }],
			copy: `${mode === 'ipotenusa' ? 'i' : 'c2'} ${text.startsWith('≈') ? '' : '= '}${text}`,
			steps
		},
		sketch: {
			outline: [O, P, Q],
			lines: [],
			labels: [lab(O, P, 'c₁', c1, true), lab(Q, O, 'c₂', c2, mode === 'ipotenusa'), lab(P, Q, 'i', i, mode === 'cateto')],
			right: [[O, [1, 0], [0, 1]]]
		}
	};
}

/** A given measure on the drawing: it was typed, so it is a plain decimal. */
function shownLabel(v: Val, u: Unit): string {
	const s = shown(v);
	return `${s.exact && !s.approx ? s.exact.text : valueText(v)}${u ? ` ${u}` : ''}`;
}
