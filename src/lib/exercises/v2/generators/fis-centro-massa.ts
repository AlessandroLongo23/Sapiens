/**
 * Il centro di massa. Spec: specs/exercises/fis-centro-massa.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/85-fis-centro-massa.md), each one step harder: two
 * spheres at the ends of a rod, the distance of the centre of mass from the first; three balls on a line; three balls
 * in the plane, one coordinate of the centre of mass, with the scene of the three points; the velocity of the centre
 * of mass of two carts that meet, with its sign; a person who walks along a boat at rest, d = m ℓ / (m + M). Data
 * with two significant figures (the boat's mass with three), answers with two. Distractors from the lesson's
 * warnings: the midpoint, the plain mean of the positions, the distance from the other body, the sign of the
 * opposite velocity forgotten, the person's displacement in place of the boat's.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { decTex, pq, qty, scene, t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { cut, data2, int3 } from '../fis-energia';
import { need, options, result, whole } from '../fis-urti';

export const ID = 'fis-centro-massa';

const KG = (s: string) => qty(s, 'kg');
const M_ = (s: string) => qty(s, 'm');
const MS = (s: string) => qty(s, 'm/s');

// ---------------------------------------------------------------------------
// Level 1: two spheres on a rod

function level1(rng: Rng): Built {
	const m1 = data2(rng, 1.1, 9.9);
	const m2 = data2(rng, 1.1, 9.9);
	const d = whole(rng, 21, 99);
	const a = Number(m1), b = Number(m2), L = Number(d);
	if (Math.abs(a - b) < 0.15 * Math.max(a, b)) throw new Error('masses too close');
	const exact = (b * L) / (a + b);
	const ans = need(exact);
	return {
		prompt: 'Trova la posizione del centro di massa.',
		problem: textBlock(`Due sfere di ${pq(m1, 'kg')} e ${pq(m2, 'kg')} sono fissate alle estremità di un'asta di massa trascurabile, lunga ${pq(d, 'cm')}. A che distanza dalla prima sfera si trova il centro di massa?`),
		solution: `x_{cm} \\approx ${qty(ans, 'cm')}`,
		steps: [
			t("Con l'origine nella prima sfera: ") + ` x_1 = 0, \\quad x_2 = ${qty(d, 'cm')}`,
			`x_{cm} = \\dfrac{m_1 x_1 + m_2 x_2}{m_1 + m_2} = \\dfrac{${KG(m2)} \\cdot ${qty(d, 'cm')}}{${KG(m1)} + ${KG(m2)}} = ${result(exact, 'cm', cut(exact), decTex(ans))}`,
			t(b > a ? 'Il centro di massa è più vicino alla seconda sfera, che ha più massa.' : 'Il centro di massa è più vicino alla prima sfera, che ha più massa.'),
		],
		// the midpoint; the distance from the other sphere; divided by the first mass only
		answer: options(rng, exact, 'cm', [L / 2, (a * L) / (a + b), (b * L) / a]),
		params: { m1, m2, d },
	};
}

// ---------------------------------------------------------------------------
// Level 2: three balls on a line

function level2(rng: Rng): Built {
	const m1 = data2(rng, 1.1, 9.9);
	const m2 = data2(rng, 1.1, 9.9);
	const m3 = data2(rng, 1.1, 9.9);
	const x2 = data2(rng, 1.1, 4.9);
	const x3 = data2(rng, 2.1, 9.9);
	const a = Number(m1), b = Number(m2), c = Number(m3), p = Number(x2), q = Number(x3);
	if (q < p + 0.5) throw new Error('the third ball must be beyond the second');
	const sum = b * p + c * q;
	const exact = sum / (a + b + c);
	const ans = need(exact);
	return {
		prompt: "Trova l'ascissa del centro di massa.",
		problem: textBlock(`Tre palline di ${pq(m1, 'kg')}, ${pq(m2, 'kg')} e ${pq(m3, 'kg')} sono allineate lungo l'asse $x$: la prima è nell'origine, la seconda in $x_2 = ${M_(x2)}$ e la terza in $x_3 = ${M_(x3)}$. Qual è l'ascissa del centro di massa?`),
		solution: `x_{cm} \\approx ${M_(ans)}`,
		steps: [
			'x_{cm} = \\dfrac{m_1 x_1 + m_2 x_2 + m_3 x_3}{m_1 + m_2 + m_3}',
			t('La prima pallina è in ') + ' x_1 = 0 ' + t(': al numeratore non dà contributo, ma la sua massa conta al denominatore.'),
			`x_{cm} = \\dfrac{${KG(m2)} \\cdot ${M_(x2)} + ${KG(m3)} \\cdot ${M_(x3)}}{${KG(m1)} + ${KG(m2)} + ${KG(m3)}} = ${result(exact, 'm', cut(exact), decTex(ans))}`,
		],
		// the plain mean of the three positions; the first mass left out of the total; the two masses swapped
		answer: options(rng, exact, 'm', [(p + q) / 3, sum / (b + c), (c * p + b * q) / (a + b + c)]),
		params: { m1, m2, m3, x2, x3 },
	};
}

// ---------------------------------------------------------------------------
// Level 3: three balls in the plane

function level3(rng: Rng): Built {
	const ms = [0, 1, 2].map(() => `${rng.int(1, 6)}.0`);
	const pts = [0, 1, 2].map(() => [rng.int(0, 6), rng.int(0, 6)] as [number, number]);
	if (new Set(pts.map((p) => p.join())).size < 3) throw new Error('two balls in the same point');
	const askX = rng.next() < 0.5;
	const M = ms.reduce((s, m) => s + Number(m), 0);
	const cm = [0, 1].map((k) => pts.reduce((s, p, i) => s + Number(ms[i]) * p[k], 0) / M);
	const mean = [0, 1].map((k) => (pts[0][k] + pts[1][k] + pts[2][k]) / 3);
	const k = askX ? 0 : 1;
	const exact = cm[k];
	if (exact < 0.5 || Math.abs(cm[0] - cm[1]) < 0.1 * exact || Math.abs(mean[k] - exact) < 0.1 * exact) throw new Error('mistakes too close to the answer');
	const ans = need(exact);
	const names = ['A', 'B', 'C'];
	const coord = (p: [number, number]) => `(${p[0]};\\,${p[1]})`;
	const letter = askX ? 'x' : 'y';
	const alt = `Un piano cartesiano con tre punti: ${names.map((n, i) => `${n} di coordinate ${pts[i][0]} e ${pts[i][1]}`).join(', ')}.`;
	const terms = pts.map((p, i) => `${KG(ms[i])} \\cdot ${p[k]}\\,\\text{m}`).join(' + ');
	const rotated = pts.reduce((s, p, i) => s + Number(ms[(i + 1) % 3]) * p[k], 0) / M;
	return {
		prompt: askX ? "Trova l'ascissa del centro di massa." : "Trova l'ordinata del centro di massa.",
		problem: textBlock(`Tre palline si trovano nei punti $A${coord(pts[0])}$, $B${coord(pts[1])}$ e $C${coord(pts[2])}$ di un piano cartesiano, con le coordinate in metri. Le loro masse sono, nell'ordine, ${pq(ms[0], 'kg')}, ${pq(ms[1], 'kg')} e ${pq(ms[2], 'kg')}. Qual è ${askX ? "l'ascissa" : "l'ordinata"} del centro di massa?`),
		solution: `${letter}_{cm} \\approx ${M_(ans)}`,
		steps: [
			`${letter}_{cm} = \\dfrac{m_A ${letter}_A + m_B ${letter}_B + m_C ${letter}_C}{m_A + m_B + m_C}`,
			`${letter}_{cm} = \\dfrac{${terms}}{${KG(M.toFixed(1))}} = ${result(exact, 'm', cut(exact), decTex(ans))}`,
		],
		// the other coordinate; the plain mean of the three coordinates; the masses given to the wrong points
		answer: options(rng, exact, 'm', [cm[1 - k], mean[k], rotated]),
		params: { case: askX ? 'ascissa' : 'ordinata', masse: ms, punti: pts },
		scene: scene(alt, { u: 0.5, griglia: { x0: 0, x1: 7, y0: 0, y1: 7 }, assi: true, vettori: [], punti: pts.map((p, i) => ({ at: p, nome: names[i] })) }),
	};
}

// ---------------------------------------------------------------------------
// Level 4: the velocity of the centre of mass

function level4(rng: Rng): Built {
	const m1 = data2(rng, 1.1, 9.9);
	const m2 = data2(rng, 1.1, 9.9);
	const v1 = data2(rng, 1.1, 9.9);
	const v2 = data2(rng, 1.1, 9.9);
	const a = Number(m1), b = Number(m2), v = Number(v1), w = Number(v2);
	const exact = (a * v - b * w) / (a + b);
	if (Math.abs(exact) < 0.2) throw new Error('nearly at rest');
	const ans = need(exact);
	return {
		prompt: 'Trova la velocità del centro di massa, con il suo segno.',
		problem: textBlock(`Su una rotaia un carrello di ${pq(m1, 'kg')} si muove verso destra a ${pq(v1, 'm/s')}; un carrello di ${pq(m2, 'kg')} gli viene incontro a ${pq(v2, 'm/s')}. Qual è la velocità del centro di massa dei due carrelli? Prendi come positivo il verso destra.`),
		solution: `v_{cm} \\approx ${MS(ans)}`,
		steps: [
			t("Con l'asse verso destra: ") + ` v_1 = ${MS(v1)}, \\quad v_2 = -${MS(v2)}`,
			`v_{cm} = \\dfrac{m_1 v_1 + m_2 v_2}{m_1 + m_2} = \\dfrac{${KG(m1)} \\cdot ${MS(v1)} + ${KG(m2)} \\cdot (-${MS(v2)})}{${KG(m1)} + ${KG(m2)}} = ${result(exact, 'm/s', cut(exact), decTex(ans))}`,
			t(exact > 0 ? 'Il centro di massa si muove verso destra, prima e dopo ogni urto tra i due carrelli.' : 'Il centro di massa si muove verso sinistra, prima e dopo ogni urto tra i due carrelli.'),
		],
		// the sign of the second velocity forgotten; the opposite sign; the plain mean of the velocities
		answer: options(rng, exact, 'm/s', [(a * v + b * w) / (a + b), -exact, (v - w) / 2]),
		params: { case: exact > 0 ? 'destra' : 'sinistra', m1, m2, v1, v2 },
	};
}

// ---------------------------------------------------------------------------
// Level 5: walking along a boat

function level5(rng: Rng): Built {
	const M = int3(rng, 101, 299);
	const m = whole(rng, 41, 99);
	const l = data2(rng, 1.1, 6.9);
	const a = Number(m), b = Number(M), L = Number(l);
	const exact = (a * L) / (a + b);
	const ans = need(exact);
	return {
		prompt: 'Trova lo spostamento della barca.',
		problem: textBlock(`Una barca di ${pq(M, 'kg')} è ferma su un lago, con a bordo una persona di ${pq(m, 'kg')}. La persona cammina lungo la barca per ${pq(l, 'm')}. Di quanto si sposta la barca, se l'attrito con l'acqua è trascurabile?`),
		solution: `d \\approx ${M_(ans)}`,
		steps: [
			t('Il sistema è fermo e le forze esterne si bilanciano: il centro di massa non si sposta.'),
			t('Se la barca arretra di ') + ' d ' + t(', la persona avanza di ') + ` ${M_(l)} - d ` + t(" rispetto all'acqua: ") + ` m\\,(${M_(l)} - d) = M\\,d`,
			`d = \\dfrac{m}{m + M} \\cdot ${M_(l)} = \\dfrac{${KG(m)}}{${KG(m)} + ${KG(M)}} \\cdot ${M_(l)} = ${result(exact, 'm', cut(exact), decTex(ans))}`,
		],
		// divided by the boat's mass only; the person's displacement; the whole walk
		answer: options(rng, exact, 'm', [(a * L) / b, (b * L) / (a + b), L]),
		params: { M, m, l },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level === 3 && sample.scene?.type !== 'vettori-piano') v.push('manca la scena');
	return v;
}

export const generator: Generator = {
	id: ID,
	title: 'Il centro di massa',
	levels: {
		1: { label: 'Il centro di massa di due corpi', constraints: ["due sfere alle estremità di un'asta", 'masse diverse di almeno il 15%'] },
		2: { label: 'Tre corpi su una retta', constraints: ["la prima pallina nell'origine", 'la terza almeno 0,5 m oltre la seconda'] },
		3: { label: 'Tre corpi nel piano', constraints: ['coordinate intere da 0 a 6 m, masse intere da 1 a 6 kg', 'ascissa o ordinata, metà ciascuna'] },
		4: { label: 'La velocità del centro di massa', constraints: ['risposta con il segno, di almeno 0,2 m/s in modulo'] },
		5: { label: 'Camminare su una barca', constraints: ['barca da 101 a 299 kg, persona da 41 a 99 kg'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default generator;
