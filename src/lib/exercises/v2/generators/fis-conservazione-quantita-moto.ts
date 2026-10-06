/**
 * La conservazione della quantità di moto. Spec: specs/exercises/fis-conservazione-quantita-moto.md
 *
 * Four levels from the lesson (docs/lezioni/fisica/riscritte/82-fis-conservazione-quantita-moto.md), each one step
 * harder: two bodies at rest that push apart, V₂ = m₁V₁/m₂; the recoil of a rifle, with the bullet's mass in grams;
 * two coupled carts already moving that a spring separates, (m₁ + m₂) v = m₁V₁ + m₂V₂; a body at rest that bursts
 * into three fragments, two of them along the axes, with the scene of the two given velocities. Data with two
 * significant figures, answers with two. Distractors from the lesson's warnings: the ratio of the masses upside
 * down, the same speed for both, grams not converted, the mass of the whole system forgotten, velocities added in
 * place of momenta.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { decTex, pq, qty, t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { cut, data2, lab } from '../fis-energia';
import { crossScene, need, options, result, whole } from '../fis-urti';

export const ID = 'fis-conservazione-quantita-moto';

const MS = (s: string) => qty(s, 'm/s');
const KG = (s: string) => qty(s, 'kg');

// ---------------------------------------------------------------------------
// Level 1: two bodies at rest push apart

function level1(rng: Rng): Built {
	const skaters = rng.next() < 0.5;
	const m1 = skaters ? whole(rng, 41, 99) : data2(rng, 1.1, 9.9);
	const m2 = skaters ? whole(rng, 41, 99) : data2(rng, 1.1, 9.9);
	const v1 = data2(rng, 1.1, 9.9);
	const a = Number(m1), b = Number(m2), v = Number(v1);
	if (Math.abs(a - b) < 0.15 * Math.max(a, b)) throw new Error('masses too close');
	const exact = (a * v) / b;
	const ans = need(exact);
	const text = skaters
		? `Due pattinatori, di ${pq(m1, 'kg')} e ${pq(m2, 'kg')}, sono fermi sul ghiaccio uno di fronte all'altro e si spingono. Dopo la spinta il primo si muove a ${pq(v1, 'm/s')}. Con che velocità si muove il secondo, se l'attrito è trascurabile?`
		: `Due carrelli, di ${pq(m1, 'kg')} e ${pq(m2, 'kg')}, sono fermi su una rotaia con una molla compressa in mezzo. Liberata la molla, il primo parte a ${pq(v1, 'm/s')}. Con che velocità parte il secondo, se l'attrito è trascurabile?`;
	return {
		prompt: 'Trova la velocità del secondo corpo.',
		problem: textBlock(text),
		solution: `V_2 \\approx ${MS(ans)}`,
		steps: [
			t('La quantità di moto totale è zero prima, e resta zero: ') + ' 0 = m_1 V_1 + m_2 V_2',
			t('In modulo: ') + ` V_2 = \\dfrac{m_1 V_1}{m_2} = \\dfrac{${KG(m1)} \\cdot ${MS(v1)}}{${KG(m2)}} = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
			t('Il secondo corpo si muove nel verso opposto al primo.'),
		],
		// the ratio upside down; the same speed; the formula of two bodies that stick together
		answer: options(rng, exact, 'm/s', [(b * v) / a, v, (a * v) / (a + b)]),
		params: { case: skaters ? 'pattinatori' : 'carrelli', m1, m2, v1 },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the recoil, with the bullet in grams

function level2(rng: Rng): Built {
	const M = data2(rng, 2.1, 5.9);
	const m = whole(rng, 11, 49);
	const vm = data2(rng, 2.1, 9.9);
	const Mn = Number(M), mk = Number(m) / 1000, v = Number(vm) * 100;
	const exact = (mk * v) / Mn;
	const ans = need(exact);
	if (exact < 0.2) throw new Error('recoil too small');
	const mkTex = decTex((Number(m) / 1000).toFixed(3));
	const vTex = `${decTex(vm)} \\cdot 10^2\\,\\text{m/s}`;
	return {
		prompt: 'Trova la velocità di rinculo.',
		problem: textBlock(`Un fucile di ${pq(M, 'kg')} spara un proiettile di ${pq(m, 'g')}, che esce dalla canna a $${vTex}$. Con che velocità arretra il fucile, se chi spara non lo trattiene?`),
		solution: `V_f \\approx ${MS(ans)}`,
		steps: [
			t('La massa del proiettile in kilogrammi: ') + ` m_p = ${qty(m, 'g')} = ${mkTex}\\,\\text{kg}`,
			t('Prima dello sparo tutto è fermo: ') + ' 0 = m_p V_p + m_f V_f',
			t('In modulo: ') + ` V_f = \\dfrac{m_p V_p}{m_f} = \\dfrac{${mkTex}\\,\\text{kg} \\cdot ${vTex}}{${KG(M)}} = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
		],
		// a wrong conversion of the grams, both ways; the same kinetic energy in place of the same momentum
		answer: options(rng, exact, 'm/s', [exact * 10, exact / 10, v * Math.sqrt(mk / Mn)]),
		params: { M, m, v: String(Math.round(v)) },
	};
}

// ---------------------------------------------------------------------------
// Level 3: a system already moving

function level3(rng: Rng): Built {
	const m1 = data2(rng, 1.1, 9.9);
	const m2 = data2(rng, 1.1, 9.9);
	const v = data2(rng, 1.1, 4.9);
	const v2 = data2(rng, 2.1, 9.9);
	const a = Number(m1), b = Number(m2), vn = Number(v), w = Number(v2);
	if (w < vn + 1) throw new Error('the front cart must gain speed');
	const p = (a + b) * vn;
	const exact = (p - b * w) / a;
	if (exact < 0.2) throw new Error('the rear cart must keep going forward');
	const ans = need(exact);
	return {
		prompt: "Trova la velocità dell'altro carrello.",
		problem: textBlock(`Su una rotaia un carrello di ${pq(m1, 'kg')} e uno di ${pq(m2, 'kg')} viaggiano agganciati a ${pq(v, 'm/s')}. Una molla tra i due li separa: il carrello di ${pq(m2, 'kg')}, che sta davanti, prosegue a ${pq(v2, 'm/s')}. Con che velocità prosegue l'altro carrello?`),
		solution: `V_1 \\approx ${MS(ans)}`,
		steps: [
			t('Prima i due carrelli si muovono insieme: ') + ` p_{tot} = (m_1 + m_2)\\,v = (${KG(m1)} + ${KG(m2)}) \\cdot ${MS(v)} = ${cut(p, 4)}\\,\\text{kg}\\cdot\\text{m/s}`,
			t('Dopo la separazione: ') + ' m_1 V_1 + m_2 V_2 = p_{tot}',
			`V_1 = \\dfrac{p_{tot} - m_2 V_2}{m_1} = \\dfrac{${cut(p, 4)}\\,\\text{kg}\\cdot\\text{m/s} - ${KG(m2)} \\cdot ${MS(v2)}}{${KG(m1)}} = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
		],
		// the mass of the whole system forgotten before; the momentum of the front cart not taken away; divided by the total mass
		answer: options(rng, exact, 'm/s', [(a * vn - b * w) / a, p / a, (p - b * w) / (a + b)].filter((x) => x > 0)),
		params: { m1, m2, v, v2 },
	};
}

// ---------------------------------------------------------------------------
// Level 4: three fragments in the plane

function level4(rng: Rng): Built {
	const m1 = data2(rng, 0.11, 0.99);
	const m2 = data2(rng, 0.11, 0.99);
	const m3 = data2(rng, 0.11, 0.99);
	const v1 = data2(rng, 1.1, 9.9);
	const v2 = data2(rng, 1.1, 9.9);
	const p1 = Number(m1) * Number(v1), p2 = Number(m2) * Number(v2);
	// neither momentum negligible, so adding them and taking the square root give different answers
	if (Math.min(p1, p2) < 0.4 * Math.max(p1, p2)) throw new Error('one momentum too small');
	const p3 = Math.hypot(p1, p2);
	const exact = p3 / Number(m3);
	const ans = need(exact);
	const alt = `Un piano cartesiano con due velocità che partono dall'origine: una lungo l'asse x, di ${lab(v1)} metri al secondo, e una lungo l'asse y, di ${lab(v2)} metri al secondo.`;
	const l1 = `${lab(v1)} m/s`, l2 = `${lab(v2)} m/s`;
	const k = 4 / Math.max(Number(v1), Number(v2));
	const d3 = [(-p1 / p3) * Math.min(4, exact * k), (-p2 / p3) * Math.min(4, exact * k)] as [number, number];
	return {
		prompt: 'Trova la velocità del terzo frammento.',
		problem: textBlock(`Un oggetto fermo esplode in tre frammenti, che si muovono su un piano orizzontale liscio. Il primo, di ${pq(m1, 'kg')}, parte a ${pq(v1, 'm/s')} lungo l'asse $x$; il secondo, di ${pq(m2, 'kg')}, a ${pq(v2, 'm/s')} lungo l'asse $y$. Il terzo ha massa ${pq(m3, 'kg')}. Con che velocità parte il terzo frammento?`),
		solution: `V_3 \\approx ${MS(ans)}`,
		steps: [
			`p_1 = ${KG(m1)} \\cdot ${MS(v1)} = ${cut(p1, 4)}\\,\\text{kg}\\cdot\\text{m/s} \\qquad p_2 = ${KG(m2)} \\cdot ${MS(v2)} = ${cut(p2, 4)}\\,\\text{kg}\\cdot\\text{m/s}`,
			t('La quantità di moto totale resta zero: il terzo frammento ha componenti ') + ' p_{3x} = -p_1 ' + t(' e ') + ' p_{3y} = -p_2',
			`p_3 = \\sqrt{p_1^2 + p_2^2} = ${cut(p3)}\\,\\text{kg}\\cdot\\text{m/s}`,
			`V_3 = \\dfrac{p_3}{m_3} = \\dfrac{${cut(p3)}\\,\\text{kg}\\cdot\\text{m/s}}{${KG(m3)}} = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
		],
		// the momenta added like numbers; the velocities composed in place of the momenta; the momentum divided by the whole mass
		answer: options(rng, exact, 'm/s', [(p1 + p2) / Number(m3), Math.hypot(Number(v1), Number(v2)), p3 / (Number(m1) + Number(m2) + Number(m3))]),
		params: { m1, m2, m3, v1, v2 },
		scene: crossScene(alt, Number(v1), Number(v2), l1, l2),
		solutionScene: crossScene(`${alt} La velocità del terzo frammento, in arancione, punta nel terzo quadrante, dalla parte opposta alla somma delle quantità di moto dei primi due.`, Number(v1), Number(v2), l1, l2, [{ da: [0, 0], a: d3, colore: 'risultante', nome: 'V', sub: '3' }]),
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level === 4 && sample.scene?.type !== 'vettori-piano') v.push('manca la scena');
	return v;
}

export const generator: Generator = {
	id: ID,
	title: 'La conservazione della quantità di moto',
	levels: {
		1: { label: 'Due corpi fermi che si spingono', constraints: ['pattinatori o carrelli con una molla, metà ciascuno', 'masse diverse di almeno il 15%'] },
		2: { label: 'Il rinculo di un fucile', constraints: ['proiettile in grammi, da 11 a 49', 'velocità di rinculo da 0,2 m/s in su'] },
		3: { label: 'Un sistema già in moto che si separa', constraints: ["il carrello davanti guadagna almeno 1 m/s", "l'altro prosegue in avanti ad almeno 0,2 m/s"] },
		4: { label: 'Tre frammenti nel piano', constraints: ['i primi due lungo gli assi', 'nessuna delle due quantità di moto sotto il 40% dell’altra'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default generator;
