/**
 * Gli urti anelastici. Spec: specs/exercises/fis-urti-anelastici.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/83-fis-urti-anelastici.md), each one step harder: a cart
 * that hits one at rest and sticks, V = m₁v₁/(m₁ + m₂); two carts that meet head-on, with a signed answer; the
 * kinetic energy dissipated when the target is at rest; a collision after which the carts separate, V₂ from the
 * measured V₁; the ballistic pendulum, v = (m + M)/m · √(2gh) with grams and centimetres; two skaters that meet at
 * right angles and hold on, with the scene of the two velocities. g = 9,8 m/s², data with two significant figures,
 * answers with two. Distractors from the lesson's warnings: the mean of the velocities, the sign of the opposite
 * velocity forgotten, the energy conserved through the collision, velocities added in place of momenta.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { decTex, pq, qty, t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { G, cut, data2, lab } from '../fis-energia';
import { q2 } from '../fis-lavoro';
import { crossScene, need, options, optionsSci, result, resultSci, whole } from '../fis-urti';

export const ID = 'fis-urti-anelastici';

const MS = (s: string) => qty(s, 'm/s');
const KG = (s: string) => qty(s, 'kg');

// ---------------------------------------------------------------------------
// Level 1: the target at rest

function level1(rng: Rng): Built {
	const m1 = data2(rng, 1.1, 9.9);
	const m2 = data2(rng, 1.1, 9.9);
	const v1 = data2(rng, 1.1, 9.9);
	const a = Number(m1), b = Number(m2), v = Number(v1);
	if (Math.abs(a - b) < 0.15 * Math.max(a, b)) throw new Error('masses too close');
	const exact = (a * v) / (a + b);
	const ans = need(exact);
	return {
		prompt: "Trova la velocità dopo l'urto.",
		problem: textBlock(`Su una rotaia un carrello di ${pq(m1, 'kg')} si muove a ${pq(v1, 'm/s')} e urta un carrello fermo di ${pq(m2, 'kg')}. Dopo l'urto i due carrelli restano agganciati. Con che velocità si muovono?`),
		solution: `V \\approx ${MS(ans)}`,
		steps: [
			t("L'urto è completamente anelastico: ") + ' m_1 v_1 = (m_1 + m_2)\\,V',
			`V = \\dfrac{m_1 v_1}{m_1 + m_2} = \\dfrac{${KG(m1)} \\cdot ${MS(v1)}}{${KG(m1)} + ${KG(m2)}} = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
		],
		// the mean of the two velocities; divided by the target's mass only; the masses swapped
		answer: options(rng, exact, 'm/s', [v / 2, (a * v) / b, (b * v) / (a + b)]),
		params: { m1, m2, v1 },
	};
}

// ---------------------------------------------------------------------------
// Level 2: head-on

function level2(rng: Rng): Built {
	const m1 = data2(rng, 1.1, 9.9);
	const m2 = data2(rng, 1.1, 9.9);
	const v1 = data2(rng, 1.1, 9.9);
	const v2 = data2(rng, 1.1, 9.9);
	const a = Number(m1), b = Number(m2), v = Number(v1), w = Number(v2);
	const exact = (a * v - b * w) / (a + b);
	if (Math.abs(exact) < 0.2) throw new Error('nearly at rest');
	const ans = need(exact);
	return {
		prompt: "Trova la velocità dopo l'urto, con il suo segno.",
		problem: textBlock(`Su una rotaia un carrello di ${pq(m1, 'kg')} si muove verso destra a ${pq(v1, 'm/s')}; un carrello di ${pq(m2, 'kg')} gli viene incontro a ${pq(v2, 'm/s')}. Nell'urto i due restano agganciati. Qual è la loro velocità dopo l'urto? Prendi come positivo il verso destra.`),
		solution: `V \\approx ${MS(ans)}`,
		steps: [
			t("Con l'asse verso destra: ") + ` v_1 = ${MS(v1)}, \\quad v_2 = -${MS(v2)}`,
			'm_1 v_1 + m_2 v_2 = (m_1 + m_2)\\,V',
			`V = \\dfrac{${KG(m1)} \\cdot ${MS(v1)} + ${KG(m2)} \\cdot (-${MS(v2)})}{${KG(m1)} + ${KG(m2)}} = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
			t(exact > 0 ? 'Il risultato è positivo: i carrelli vanno verso destra.' : 'Il risultato è negativo: i carrelli vanno verso sinistra.'),
		],
		// the sign of the second velocity forgotten; the opposite sign; the difference of the velocities halved
		answer: options(rng, exact, 'm/s', [(a * v + b * w) / (a + b), -exact, (v - w) / 2]),
		params: { case: exact > 0 ? 'destra' : 'sinistra', m1, m2, v1, v2 },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the energy dissipated, target at rest

function level3(rng: Rng): Built {
	const m1 = data2(rng, 1.1, 9.9);
	const m2 = data2(rng, 1.1, 9.9);
	const v1 = data2(rng, 1.1, 9.9);
	const a = Number(m1), b = Number(m2), v = Number(v1);
	const V = (a * v) / (a + b);
	const Ki = 0.5 * a * v * v, Kf = 0.5 * (a + b) * V * V;
	const exact = Ki - Kf;
	return {
		prompt: "Trova l'energia dissipata.",
		problem: textBlock(`Su una rotaia un carrello di ${pq(m1, 'kg')} si muove a ${pq(v1, 'm/s')} e urta un carrello fermo di ${pq(m2, 'kg')}. Dopo l'urto i due carrelli restano agganciati. Quanta energia cinetica si dissipa nell'urto?`),
		solution: `E_d \\approx ${q2(exact, 'J')}`,
		steps: [
			`V = \\dfrac{m_1 v_1}{m_1 + m_2} = ${cut(V)}\\,\\text{m/s}`,
			`K_i = \\dfrac{1}{2} m_1 v_1^2 = \\dfrac{1}{2} \\cdot ${KG(m1)} \\cdot (${MS(v1)})^2 = ${cut(Ki, 4)}\\,\\text{J}`,
			`K_f = \\dfrac{1}{2} (m_1 + m_2)\\,V^2 = ${cut(Kf, 4)}\\,\\text{J}`,
			`E_d = K_i - K_f = ${resultSci(exact, 'J')}`,
		],
		// all the initial energy; what is left; only the first cart's loss
		answer: optionsSci(rng, exact, 'J', [Ki, Kf, 0.5 * a * (v * v - V * V)]),
		params: { m1, m2, v1 },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the carts separate

function level4(rng: Rng): Built {
	const m1 = data2(rng, 1.1, 9.9);
	const m2 = data2(rng, 1.1, 9.9);
	const v1 = data2(rng, 2.1, 9.9);
	const a = Number(m1), b = Number(m2), v = Number(v1);
	// V₁ somewhere between the speed of the stuck pair and the elastic value, forwards, with two clean figures
	const e = rng.int(2, 8) / 10;
	const V1s = need(((a - e * b) / (a + b)) * v);
	const V1 = Number(V1s);
	if (V1 < 0.2) throw new Error('V1 not a forward speed');
	const exact = (a * (v - V1)) / b;
	if (exact <= V1 + 0.2) throw new Error('the carts do not separate');
	if (0.5 * a * V1 * V1 + 0.5 * b * exact * exact >= 0.97 * 0.5 * a * v * v) throw new Error('not clearly inelastic');
	const ans = need(exact);
	return {
		prompt: 'Trova la velocità del secondo carrello.',
		problem: textBlock(`Su una rotaia un carrello di ${pq(m1, 'kg')} si muove a ${pq(v1, 'm/s')} e urta un carrello fermo di ${pq(m2, 'kg')}. Dopo l'urto il primo carrello prosegue nello stesso verso a ${pq(V1s, 'm/s')}. Con che velocità parte il secondo carrello?`),
		solution: `V_2 \\approx ${MS(ans)}`,
		steps: [
			t('I carrelli si separano, ma la quantità di moto totale si conserva: ') + ' m_1 v_1 = m_1 V_1 + m_2 V_2',
			`V_2 = \\dfrac{m_1 (v_1 - V_1)}{m_2} = \\dfrac{${KG(m1)} \\cdot (${MS(v1)} - ${MS(V1s)})}{${KG(m2)}} = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
		],
		// V₁ forgotten; V₁ added; the masses forgotten
		answer: options(rng, exact, 'm/s', [(a * v) / b, (a * (v + V1)) / b, v - V1]),
		params: { m1, m2, v1, V1: V1s },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the ballistic pendulum

function level5(rng: Rng): Built {
	const m = data2(rng, 5.1, 25);
	const M = data2(rng, 1.1, 9.9);
	const h = data2(rng, 2.1, 25);
	const mk = Number(m) / 1000, Mn = Number(M), hm = Number(h) / 100;
	const V = Math.sqrt(2 * G * hm);
	const exact = ((mk + Mn) / mk) * V;
	if (exact < 150 || exact > 900) throw new Error('not the speed of a bullet');
	const mkTex = decTex(String(Math.round(mk * 1e5) / 1e5)), hTex = decTex(String(Math.round(hm * 1e4) / 1e4)), totTex = decTex(String(Math.round((mk + Mn) * 1e5) / 1e5));
	return {
		prompt: 'Trova la velocità del proiettile.',
		problem: textBlock(`Un proiettile di ${pq(m, 'g')} si conficca in un blocco di ${pq(M, 'kg')} appeso a due fili. Il blocco, con il proiettile dentro, sale di ${pq(h, 'cm')}. Qual era la velocità del proiettile?`),
		solution: `v \\approx ${q2(exact, 'm/s')}`,
		steps: [
			t('In unità del Sistema Internazionale: ') + ` m = ${mkTex}\\,\\text{kg}, \\quad h = ${hTex}\\,\\text{m}, \\quad m + M = ${totTex}\\,\\text{kg}`,
			t("Nella salita si conserva l'energia meccanica: ") + ` V = \\sqrt{2 g h} = \\sqrt{2 \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${hTex}\\,\\text{m}} = ${cut(V)}\\,\\text{m/s}`,
			t("Nell'urto si conserva la quantità di moto: ") + ' m\\,v = (m + M)\\,V',
			`v = \\dfrac{m + M}{m}\\,V = \\dfrac{${totTex}\\,\\text{kg}}{${mkTex}\\,\\text{kg}} \\cdot ${cut(V)}\\,\\text{m/s} = ${resultSci(exact, 'm/s')}`,
		],
		// the mechanical energy conserved through the collision; the height left in centimetres; the 2 forgotten
		answer: optionsSci(rng, exact, 'm/s', [Math.sqrt((2 * (mk + Mn) * G * hm) / mk), exact * 10, exact / Math.SQRT2]),
		params: { m, M, h },
	};
}

// ---------------------------------------------------------------------------
// Level 6: at right angles

function level6(rng: Rng): Built {
	const m1 = whole(rng, 41, 99);
	const m2 = whole(rng, 41, 99);
	const v1 = data2(rng, 1.1, 9.9);
	const v2 = data2(rng, 1.1, 9.9);
	const a = Number(m1), b = Number(m2), v = Number(v1), w = Number(v2);
	const p1 = a * v, p2 = b * w;
	if (Math.min(p1, p2) < 0.4 * Math.max(p1, p2)) throw new Error('one momentum too small');
	const p = Math.hypot(p1, p2);
	const exact = p / (a + b);
	const ans = need(exact);
	const alt = `Un piano cartesiano con due velocità che partono dall'origine: una lungo l'asse x, verso est, di ${lab(v1)} metri al secondo, e una lungo l'asse y, verso nord, di ${lab(v2)} metri al secondo.`;
	const l1 = `${lab(v1)} m/s`, l2 = `${lab(v2)} m/s`;
	const k = 4 / Math.max(v, w);
	return {
		prompt: "Trova la velocità dopo l'urto.",
		problem: textBlock(`Su una pista di ghiaccio un pattinatore di ${pq(m1, 'kg')} va verso est a ${pq(v1, 'm/s')}; una pattinatrice di ${pq(m2, 'kg')} va verso nord a ${pq(v2, 'm/s')}. I due si scontrano e restano abbracciati. Con che velocità si muovono subito dopo l'urto?`),
		solution: `V \\approx ${MS(ans)}`,
		steps: [
			`p_x = ${KG(m1)} \\cdot ${MS(v1)} = ${cut(p1, 4)}\\,\\text{kg}\\cdot\\text{m/s} \\qquad p_y = ${KG(m2)} \\cdot ${MS(v2)} = ${cut(p2, 4)}\\,\\text{kg}\\cdot\\text{m/s}`,
			`p_{tot} = \\sqrt{p_x^2 + p_y^2} = ${cut(p)}\\,\\text{kg}\\cdot\\text{m/s}`,
			`V = \\dfrac{p_{tot}}{m_1 + m_2} = \\dfrac{${cut(p)}\\,\\text{kg}\\cdot\\text{m/s}}{${KG(m1)} + ${KG(m2)}} = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
		],
		// the momenta added like numbers; the velocities composed; the mean of the two speeds
		answer: options(rng, exact, 'm/s', [(p1 + p2) / (a + b), Math.hypot(v, w), (v + w) / 2]),
		params: { m1, m2, v1, v2 },
		scene: crossScene(alt, v, w, l1, l2),
		solutionScene: crossScene(`${alt} La velocità comune dopo l'urto, in arancione, punta tra est e nord, nella direzione della quantità di moto totale.`, v, w, l1, l2, [{ da: [0, 0], a: [(p1 / (a + b)) * k, (p2 / (a + b)) * k], colore: 'risultante', nome: 'V' }], false),
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level === 6 && sample.scene?.type !== 'vettori-piano') v.push('manca la scena');
	return v;
}

export const generator: Generator = {
	id: ID,
	title: 'Gli urti anelastici',
	levels: {
		1: { label: 'I due corpi restano attaccati', constraints: ['bersaglio fermo', 'masse diverse di almeno il 15%'] },
		2: { label: 'Urto frontale con i corpi attaccati', constraints: ['risposta con il segno', 'velocità finale di almeno 0,2 m/s in modulo'] },
		3: { label: "L'energia dissipata", constraints: ['bersaglio fermo, urto completamente anelastico'] },
		4: { label: "I corpi si separano dopo l'urto", constraints: ['il primo carrello prosegue in avanti', 'energia cinetica finale sotto il 97% di quella iniziale'] },
		5: { label: 'Il pendolo balistico', constraints: ['proiettile in grammi, altezza in centimetri', 'velocità tra 150 e 900 m/s'] },
		6: { label: 'Urto ad angolo retto', constraints: ['velocità iniziali perpendicolari', 'nessuna delle due quantità di moto sotto il 40% dell’altra'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default generator;
