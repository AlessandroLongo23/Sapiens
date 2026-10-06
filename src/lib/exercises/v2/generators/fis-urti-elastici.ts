/**
 * Gli urti elastici in una e in due dimensioni. Spec: specs/exercises/fis-urti-elastici.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/84-fis-urti-elastici.md), each one step harder: the
 * speed of a target at rest after a head-on elastic collision, V₂ = 2m₁v₁/(m₁ + m₂); the velocity of the projectile,
 * V₁ = (m₁ − m₂)v₁/(m₁ + m₂), with its sign; both carts moving towards each other, the general formula with signed
 * velocities; a glancing hit between equal balls, the direction of the struck one (θ₁ + θ₂ = 90°); the speed of one of
 * the two balls after it, V₁ = v₁ cos θ₁ or V₂ = v₁ sin θ₁, with the scene of the hit. Data with two significant
 * figures, answers with two. Distractors from the lesson: the formula of the bodies that stick together, the
 * velocities swapped as between equal masses, the sign of the opposite velocity forgotten, sine and cosine swapped.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, decTex, pq, qty, scene, t } from '../vettori';
import { type Built, checkCommon, cosD, degOpt, generateWith, sinD, tanD } from '../fisica-equilibrio';
import { cut, data2, lab } from '../fis-energia';
import { need, options, result } from '../fis-urti';

export const ID = 'fis-urti-elastici';

const MS = (s: string) => qty(s, 'm/s');
const KG = (s: string) => qty(s, 'kg');

function masses(rng: Rng) {
	const m1 = data2(rng, 1.1, 9.9);
	const m2 = data2(rng, 1.1, 9.9);
	if (Math.abs(Number(m1) - Number(m2)) < 0.15 * Math.max(Number(m1), Number(m2))) throw new Error('masses too close');
	return { m1, m2, a: Number(m1), b: Number(m2) };
}

// ---------------------------------------------------------------------------
// Level 1: the target at rest, V₂

function level1(rng: Rng): Built {
	const { m1, m2, a, b } = masses(rng);
	const v1 = data2(rng, 1.1, 9.9);
	const v = Number(v1);
	const exact = (2 * a * v) / (a + b);
	const ans = need(exact);
	return {
		prompt: 'Trova la velocità del carrello colpito.',
		problem: textBlock(`Su una rotaia un carrello di ${pq(m1, 'kg')} si muove a ${pq(v1, 'm/s')} e urta elasticamente un carrello fermo di ${pq(m2, 'kg')}. Con che velocità parte il carrello che era fermo?`),
		solution: `V_2 \\approx ${MS(ans)}`,
		steps: [
			t('Urto elastico lungo una retta con il bersaglio fermo: ') + ' V_2 = \\dfrac{2 m_1}{m_1 + m_2}\\,v_1',
			`V_2 = \\dfrac{2 \\cdot ${KG(m1)}}{${KG(m1)} + ${KG(m2)}} \\cdot ${MS(v1)} = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
		],
		// the bodies stuck together; the velocities swapped as between equal masses; the masses swapped
		answer: options(rng, exact, 'm/s', [(a * v) / (a + b), v, (2 * b * v) / (a + b)]),
		params: { m1, m2, v1 },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the target at rest, V₁ with its sign

function level2(rng: Rng): Built {
	const { m1, m2, a, b } = masses(rng);
	const v1 = data2(rng, 1.1, 9.9);
	const v = Number(v1);
	const exact = ((a - b) * v) / (a + b);
	if (Math.abs(exact) < 0.2) throw new Error('nearly at rest');
	const ans = need(exact);
	return {
		prompt: 'Trova la velocità del primo carrello, con il suo segno.',
		problem: textBlock(`Su una rotaia un carrello di ${pq(m1, 'kg')} si muove a ${pq(v1, 'm/s')} e urta elasticamente un carrello fermo di ${pq(m2, 'kg')}. Qual è la velocità del primo carrello dopo l'urto? Prendi come positivo il verso in cui si muoveva.`),
		solution: `V_1 \\approx ${MS(ans)}`,
		steps: [
			t('Urto elastico lungo una retta con il bersaglio fermo: ') + ' V_1 = \\dfrac{m_1 - m_2}{m_1 + m_2}\\,v_1',
			`V_1 = \\dfrac{${KG(m1)} - ${KG(m2)}}{${KG(m1)} + ${KG(m2)}} \\cdot ${MS(v1)} = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
			t(exact > 0 ? 'Il primo carrello è più pesante: prosegue in avanti.' : 'Il primo carrello è più leggero: torna indietro.'),
		],
		// the sign lost; the bodies stuck together; the speed of the other cart
		answer: options(rng, exact, 'm/s', [-exact, (a * v) / (a + b), (2 * a * v) / (a + b)]),
		params: { case: exact > 0 ? 'avanti' : 'indietro', m1, m2, v1 },
	};
}

// ---------------------------------------------------------------------------
// Level 3: both moving

function level3(rng: Rng): Built {
	const { m1, m2, a, b } = masses(rng);
	const v1 = data2(rng, 1.1, 9.9);
	const v2 = data2(rng, 1.1, 9.9);
	const v = Number(v1), w = -Number(v2);
	const exact = ((a - b) * v + 2 * b * w) / (a + b);
	if (Math.abs(exact) < 0.2) throw new Error('nearly at rest');
	const ans = need(exact);
	return {
		prompt: 'Trova la velocità del primo carrello, con il suo segno.',
		problem: textBlock(`Su una rotaia un carrello di ${pq(m1, 'kg')} si muove verso destra a ${pq(v1, 'm/s')}; un carrello di ${pq(m2, 'kg')} gli viene incontro a ${pq(v2, 'm/s')}. L'urto è elastico. Qual è la velocità del primo carrello dopo l'urto? Prendi come positivo il verso destra.`),
		solution: `V_1 \\approx ${MS(ans)}`,
		steps: [
			t("Con l'asse verso destra: ") + ` v_1 = ${MS(v1)}, \\quad v_2 = -${MS(v2)}`,
			'V_1 = \\dfrac{(m_1 - m_2)\\,v_1 + 2 m_2 v_2}{m_1 + m_2}',
			`V_1 = \\dfrac{(${KG(m1)} - ${KG(m2)}) \\cdot ${MS(v1)} + 2 \\cdot ${KG(m2)} \\cdot (-${MS(v2)})}{${KG(m1)} + ${KG(m2)}} = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
			t(exact > 0 ? 'Il risultato è positivo: il primo carrello va ancora verso destra.' : 'Il risultato è negativo: il primo carrello torna verso sinistra.'),
		],
		// the sign of v₂ forgotten; the bodies stuck together; the formula of the other cart
		answer: options(rng, exact, 'm/s', [((a - b) * v - 2 * b * w) / (a + b), (a * v + b * w) / (a + b), ((b - a) * w + 2 * a * v) / (a + b)]),
		params: { case: exact > 0 ? 'destra' : 'sinistra', m1, m2, v1, v2 },
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: a glancing hit between equal balls

/** The incoming velocity along x, 4 units long, and the direction of the first ball after the hit, dashed, at θ₁. */
function hitScene(alt: string, v1: string, theta: number): SceneRef {
	return scene(alt, {
		u: 0.5,
		vettori: [
			{ da: [-5, 0], a: [-1, 0], colore: 'velocita', etichetta: `${lab(v1)} m/s`, sopra: true },
			{ da: [0, 0], a: [3 * cosD(theta), 3 * sinD(theta)], colore: 'velocita', tratteggiato: true },
		],
		angoli: [{ vettore: 1, rif: 'x', testo: `${theta}°` }],
		punti: [{ at: [0, 0], nome: 'O' }],
	});
}

function hit(rng: Rng) {
	const v1 = data2(rng, 1.1, 9.9);
	let theta = 0;
	// not too close to 45°, where the two balls leave with the same speed
	do theta = rng.int(15, 75);
	while (Math.abs(theta - 45) < 6);
	const alt = `Una boccia arriva da sinistra lungo una retta orizzontale a ${lab(v1)} metri al secondo, verso una boccia ferma nel punto O. Dopo l'urto la prima boccia si muove lungo la direzione tratteggiata, che forma un angolo di ${theta} gradi con la direzione iniziale.`;
	const setup = `Su un tavolo da biliardo una boccia a ${pq(v1, 'm/s')} colpisce di striscio una boccia ferma della stessa massa. L'urto è elastico, e dopo l'urto la prima boccia si muove in una direzione che forma un angolo di $${theta}^\\circ$ con quella iniziale.`;
	return { v1, v: Number(v1), theta, alt, setup };
}

function level4(rng: Rng): Built {
	const { v1, theta, alt, setup } = hit(rng);
	const ans = String(90 - theta);
	return {
		prompt: 'Trova la direzione della boccia colpita.',
		problem: textBlock(`${setup} Che angolo forma con la direzione iniziale la velocità della boccia colpita?`),
		solution: `\\theta_2 = ${ans}^\\circ`,
		steps: [
			t('Urto elastico, masse uguali, bersaglio fermo: le due velocità finali sono perpendicolari.'),
			`\\theta_2 = 90^\\circ - \\theta_1 = 90^\\circ - ${theta}^\\circ = ${ans}^\\circ`,
			t("La boccia colpita parte dall'altra parte rispetto alla direzione iniziale."),
		],
		// the same angle; the supplement; the two angles added in place of subtracted
		answer: choiceOf(rng, degOpt(ans), [degOpt(String(theta)), degOpt(String(180 - theta)), degOpt(String(90 + theta))]),
		params: { v1, theta: String(theta) },
		scene: hitScene(alt, v1, theta),
	};
}

function level5(rng: Rng): Built {
	const { v1, v, theta, alt, setup } = hit(rng);
	const first = rng.next() < 0.5;
	const exact = first ? v * cosD(theta) : v * sinD(theta);
	const other = first ? v * sinD(theta) : v * cosD(theta);
	const ans = need(exact);
	const fn = first ? '\\cos' : '\\sin';
	return {
		prompt: first ? 'Trova la velocità della prima boccia.' : 'Trova la velocità della boccia colpita.',
		problem: textBlock(`${setup} ${first ? "Qual è la velocità della prima boccia dopo l'urto?" : 'Con che velocità parte la boccia colpita?'}`),
		solution: `V_${first ? 1 : 2} \\approx ${MS(ans)}`,
		steps: [
			t('Urto elastico, masse uguali, bersaglio fermo: ') + ' \\vec{v}_1 = \\vec{V}_1 + \\vec{V}_2 ' + t(' con le due velocità finali perpendicolari.'),
			t('Nel triangolo rettangolo delle velocità ') + ' v_1 ' + t(" è l'ipotenusa: ") + ' V_1 = v_1 \\cos\\theta_1, \\quad V_2 = v_1 \\sin\\theta_1',
			`V_${first ? 1 : 2} = ${MS(v1)} \\cdot ${fn} ${theta}^\\circ = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
		],
		// sine and cosine swapped; the tangent; the speed shared in halves
		answer: options(rng, exact, 'm/s', [other, v * tanD(theta), v / 2]),
		params: { case: first ? 'prima' : 'colpita', v1, theta: String(theta) },
		scene: hitScene(alt, v1, theta),
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level >= 4 && sample.scene?.type !== 'vettori-piano') v.push('manca la scena');
	return v;
}

export const generator: Generator = {
	id: ID,
	title: 'Gli urti elastici in una e in due dimensioni',
	levels: {
		1: { label: 'La velocità del corpo colpito', constraints: ['bersaglio fermo', 'masse diverse di almeno il 15%'] },
		2: { label: 'Il primo corpo prosegue o torna indietro', constraints: ['bersaglio fermo', 'risposta con il segno, di almeno 0,2 m/s in modulo'] },
		3: { label: 'Due corpi che si vengono incontro', constraints: ['risposta con il segno, di almeno 0,2 m/s in modulo'] },
		4: { label: 'Le direzioni dopo un colpo di striscio', constraints: ['masse uguali, bersaglio fermo', 'angolo tra 15° e 75°, ad almeno 6° da 45°'] },
		5: { label: 'Le velocità dopo un colpo di striscio', constraints: ['la prima boccia o quella colpita, metà ciascuna'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default generator;
