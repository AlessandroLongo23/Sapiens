/**
 * Il teorema di Torricelli e l'effetto Venturi. Spec: specs/exercises/fis-torricelli-venturi.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/100-fis-torricelli-venturi.md), each one step harder: the
 * speed out of a hole at a depth h, √(2 g h); the depth from the level of the water and the height of the hole; where
 * the jet lands, 2√(h·y); the drop of pressure in a Venturi tube from the speed and the two sections; the speed from
 * a Pitot tube in air; the lift on a wing. g = 9,8 m/s², water 1000 kg/m³, air 1,2 kg/m³, data with two significant
 * figures, answers with two (m/s, m, kPa, kN). Distractors from the lesson's warnings: the height from the bottom
 * taken for the depth, the 2 or the root forgotten, the ratio of the sections not squared, the density of water in
 * the Pitot tube, the square of the difference of the speeds.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, D_ACQUA, D_ARIA, G, checkCommon, cut, d2, generateWith, lab, pick4, pq, qu, rs, serbatoio, t, textBlock } from '../fis-fluidi-moto';

export const ID = 'fis-torricelli-venturi';

const G2 = '2 \\cdot 9{,}8\\,\\text{m/s}^2';
const comma = (s: string) => s.replace('.', ',');
/** A difference of two decimal strings with at most two decimals, exact, without useless zeros beyond two figures. */
const minus = (a: string, b: string) => (Math.round(Number(a) * 100 - Number(b) * 100) / 100).toString();
const tex = (x: number | string) => String(x).replace('.', '{,}');

// ---------------------------------------------------------------------------
// Level 1: v = √(2 g h)

function level1(rng: Rng): Built {
	for (;;) {
		const h = d2(rng, 0.2, 9);
		const exact = Math.sqrt(2 * G * Number(h));
		const ans = rs(exact);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità.',
			problem: textBlock(`Una cisterna aperta è piena d'acqua. Nella parete c'è un piccolo foro ${pq(h, 'm')} sotto la superficie libera. Con che velocità esce l'acqua dal foro?`),
			solution: `v \\approx ${qu(ans, 'm/s')}`,
			steps: [t('Teorema di Torricelli: ') + 'v = \\sqrt{2\\,g\\,h}', `v = \\sqrt{${G2} \\cdot ${qu(h, 'm')}} = ${cut(exact)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`],
			// the 2 forgotten; the root forgotten; the time of a fall from h
			answer: pick4(rng, ans, 'm/s', [Math.sqrt(G * Number(h)), 2 * G * Number(h), Math.sqrt((2 * Number(h)) / G)]),
			params: { h },
			scene: serbatoio(`Un serbatoio aperto pieno d'acqua, con un foro nella parete ${comma(h)} m sotto la superficie libera`, { livello: 1, foro: 0.3, etichette: { h: lab('h', h, 'm') } }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the depth is the level minus the height of the hole

function level2(rng: Rng): Built {
	for (;;) {
		const H = d2(rng, 1.1, 6);
		const y = d2(rng, 0.2, 3);
		const h = minus(H, y);
		if (Number(h) < 0.3 || Number(y) > 0.7 * Number(H)) continue;
		const exact = Math.sqrt(2 * G * Number(h));
		const ans = rs(exact);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità.',
			problem: textBlock(`Un serbatoio aperto è pieno d'acqua fino a ${pq(H, 'm')} dal fondo. Nella parete c'è un piccolo foro a ${pq(y, 'm')} dal fondo. Con che velocità esce l'acqua dal foro?`),
			solution: `v \\approx ${qu(ans, 'm/s')}`,
			steps: [
				t('La profondità del foro si misura dalla superficie libera:'),
				`h = ${qu(H, 'm')} - ${qu(y, 'm')} = ${tex(h)}\\,\\text{m}`,
				`v = \\sqrt{2\\,g\\,h} = \\sqrt{${G2} \\cdot ${tex(h)}\\,\\text{m}} = ${cut(exact)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`,
			],
			// the height from the bottom taken for the depth; the whole level; the two added
			answer: pick4(rng, ans, 'm/s', [Math.sqrt(2 * G * Number(y)), Math.sqrt(2 * G * Number(H)), Math.sqrt(2 * G * (Number(H) + Number(y)))]),
			params: { H, y },
			scene: serbatoio(`Un serbatoio aperto pieno d'acqua fino a ${comma(H)} m dal fondo, con un foro nella parete a ${comma(y)} m dal fondo`, { livello: Number(H), foro: Number(y), etichette: { H: lab('H', H, 'm'), y: lab('y', y, 'm') } }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: where the jet lands

function level3(rng: Rng): Built {
	for (;;) {
		const H = d2(rng, 1.1, 4);
		const y = d2(rng, 0.2, 3);
		const h = minus(H, y);
		if (Number(h) < 0.2 || Number(y) > 0.85 * Number(H)) continue;
		const v = Math.sqrt(2 * G * Number(h));
		const time = Math.sqrt((2 * Number(y)) / G);
		const exact = 2 * Math.sqrt(Number(h) * Number(y));
		const ans = rs(exact);
		if (ans === null) continue;
		return {
			prompt: 'Trova la distanza.',
			problem: textBlock(`Una botte appoggiata a terra è piena d'acqua fino a ${pq(H, 'm')} dal suolo. Da un piccolo foro nella parete, a ${pq(y, 'm')} dal suolo, esce un getto orizzontale. A che distanza dalla botte il getto tocca terra?`),
			solution: `x \\approx ${qu(ans, 'm')}`,
			steps: [
				`h = ${qu(H, 'm')} - ${qu(y, 'm')} = ${tex(h)}\\,\\text{m} \\qquad v = \\sqrt{2\\,g\\,h} = ${cut(v)}\\,\\text{m/s}`,
				t("Il getto cade come un proiettile lanciato in orizzontale dall'altezza y:"),
				`t = \\sqrt{\\dfrac{2\\,y}{g}} = \\sqrt{\\dfrac{2 \\cdot ${qu(y, 'm')}}{9{,}8\\,\\text{m/s}^2}} = ${cut(time)}\\,\\text{s}`,
				`x = v \\cdot t = ${cut(v)}\\,\\text{m/s} \\cdot ${cut(time)}\\,\\text{s} \\approx ${qu(ans, 'm')}`,
			],
			// the whole level taken for the depth; the time of fall from h instead of y (x = 2h); the factor 2 forgotten
			answer: pick4(rng, ans, 'm', [2 * Math.sqrt(Number(H) * Number(y)), 2 * Number(h), Math.sqrt(Number(h) * Number(y))]),
			params: { H, y },
			scene: serbatoio(`Una botte appoggiata a terra, piena d'acqua fino a ${comma(H)} m dal suolo, con un foro nella parete a ${comma(y)} m dal suolo da cui esce un getto orizzontale`, {
				livello: Number(H),
				foro: Number(y),
				suolo: true,
				etichette: { H: lab('H', H, 'm'), y: lab('y', y, 'm') },
			}),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the Venturi tube

function level4(rng: Rng): Built {
	for (;;) {
		const S1 = d2(rng, 3, 40);
		const S2 = d2(rng, 1.1, 20);
		const ratio = Number(S1) / Number(S2);
		if (ratio < 1.4 || ratio > 5) continue;
		const v1 = d2(rng, 0.5, 4);
		const v2 = Number(v1) * ratio;
		const exact = (0.5 * D_ACQUA * (v2 * v2 - Number(v1) ** 2)) / 1000;
		const ans = rs(exact);
		if (ans === null || exact < 1) continue;
		return {
			prompt: 'Calcola la differenza di pressione.',
			problem: textBlock(`In un tubo di Venturi orizzontale l'acqua scorre a ${pq(v1, 'm/s')} nel tratto largo, che ha sezione ${pq(S1, 'cm2')}. La strozzatura ha sezione ${pq(S2, 'cm2')}. Quanto vale la differenza di pressione tra il tratto largo e la strozzatura?`),
			solution: `p_1 - p_2 \\approx ${qu(ans, 'kPa')}`,
			steps: [
				`v_2 = v_1 \\cdot \\dfrac{S_1}{S_2} = ${qu(v1, 'm/s')} \\cdot \\dfrac{${qu(S1, 'cm2')}}{${qu(S2, 'cm2')}} = ${cut(v2)}\\,\\text{m/s}`,
				`p_1 - p_2 = \\dfrac{1}{2}\\,d\\,(v_2^2 - v_1^2) = \\dfrac{1}{2} \\cdot 1000\\,\\text{kg/m}^3 \\cdot \\left[(${cut(v2)}\\,\\text{m/s})^2 - (${qu(v1, 'm/s')})^2\\right]`,
				`p_1 - p_2 = ${cut(exact * 1000)}\\,\\text{Pa} \\approx ${qu(ans, 'kPa')}`,
			],
			// the ratio not squared; the speed in the wide stretch forgotten; the square of the difference
			answer: pick4(rng, ans, 'kPa', [(0.5 * D_ACQUA * Number(v1) ** 2 * (ratio - 1)) / 1000, (0.5 * D_ACQUA * v2 * v2) / 1000, (0.5 * D_ACQUA * (v2 - Number(v1)) ** 2) / 1000]),
			params: { S1, S2, v1 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the Pitot tube

function level5(rng: Rng): Built {
	for (;;) {
		const dp = d2(rng, 0.2, 6);
		const exact = Math.sqrt((2 * Number(dp) * 1000) / D_ARIA);
		const ans = rs(exact);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità.',
			problem: textBlock(`Il tubo di Pitot di un aereo misura, tra la presa sulla punta e quella sul fianco, una differenza di pressione di ${pq(dp, 'kPa')}. La densità dell'aria è ${pq('1.2', 'kg/m3')}. A che velocità vola l'aereo rispetto all'aria?`),
			solution: `v \\approx ${qu(ans, 'm/s')}`,
			steps: [
				t('Nel punto di ristagno il fluido è fermo: ') + 'p_2 - p_1 = \\tfrac{1}{2}\\,d\\,v^2',
				`p_2 - p_1 = ${qu(dp, 'kPa')} = ${tex(Math.round(Number(dp) * 1000))}\\,\\text{Pa}`,
				`v = \\sqrt{\\dfrac{2\\,(p_2 - p_1)}{d}} = \\sqrt{\\dfrac{2 \\cdot ${tex(Math.round(Number(dp) * 1000))}\\,\\text{Pa}}{${qu('1.2', 'kg/m3')}}} = ${cut(exact)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`,
			],
			// the density of water; the 2 forgotten; the kilopascal not converted
			answer: pick4(rng, ans, 'm/s', [Math.sqrt((2 * Number(dp) * 1000) / D_ACQUA), Math.sqrt((Number(dp) * 1000) / D_ARIA), Math.sqrt((2 * Number(dp)) / D_ARIA)]),
			params: { dp },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the lift

function level6(rng: Rng): Built {
	for (;;) {
		const vs = d2(rng, 40, 99);
		const vi = String(Number(vs) - rng.int(5, 20));
		if (Number(vi) % 10 === 0 || Number(vi) < 30) continue;
		const S = d2(rng, 11, 60);
		const dp = 0.5 * D_ARIA * (Number(vs) ** 2 - Number(vi) ** 2);
		const exact = (dp * Number(S)) / 1000;
		const ans = rs(exact);
		if (ans === null) continue;
		return {
			prompt: 'Calcola la portanza.',
			problem: textBlock(`In volo l'aria scorre a ${pq(vs, 'm/s')} sopra le ali di un aereo e a ${pq(vi, 'm/s')} sotto. Le ali hanno una superficie totale di ${pq(S, 'm2')} e la densità dell'aria è ${pq('1.2', 'kg/m3')}. Quanto vale la portanza?`),
			solution: `F \\approx ${qu(ans, 'kN')}`,
			steps: [
				`p_i - p_s = \\dfrac{1}{2}\\,d\\,(v_s^2 - v_i^2) = \\dfrac{1}{2} \\cdot ${qu('1.2', 'kg/m3')} \\cdot \\left[(${qu(vs, 'm/s')})^2 - (${qu(vi, 'm/s')})^2\\right] = ${cut(dp)}\\,\\text{Pa}`,
				`F = (p_i - p_s) \\cdot S = ${cut(dp)}\\,\\text{Pa} \\cdot ${qu(S, 'm2')} = ${cut(exact * 1000)}\\,\\text{N} \\approx ${qu(ans, 'kN')}`,
			],
			// the square of the difference; the half forgotten; the squares added
			answer: pick4(rng, ans, 'kN', [(0.5 * D_ARIA * (Number(vs) - Number(vi)) ** 2 * Number(S)) / 1000, exact * 2, (0.5 * D_ARIA * (Number(vs) ** 2 + Number(vi) ** 2) * Number(S)) / 1000]),
			params: { vs, vi, S },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if ([1, 2, 3].includes(sample.level) && sample.scene?.type !== 'serbatoio-foro') v.push('manca la scena');
	return v;
}

export const fisTorricelliVenturi: Generator = {
	id: ID,
	title: "Il teorema di Torricelli e l'effetto Venturi",
	levels: {
		1: { label: 'La velocità di uscita dal foro', constraints: ['v = √(2 g h), profondità da 0,2 a 9 m'] },
		2: { label: 'La profondità del foro', constraints: ["il livello dell'acqua e l'altezza del foro dal fondo", 'h = H − y, almeno 0,3 m'] },
		3: { label: 'Dove arriva il getto', constraints: ['x = 2√(h·y)', 'botte a terra, getto orizzontale'] },
		4: { label: 'Il tubo di Venturi', constraints: ['p1 − p2 = ½ d (v2² − v1²) con v2 = v1·S1/S2', 'rapporto delle sezioni tra 1,4 e 5', 'risposta in kPa'] },
		5: { label: 'Il tubo di Pitot', constraints: ['v = √(2 Δp / d), aria a 1,2 kg/m³', 'Δp da 0,2 a 6 kPa'] },
		6: { label: 'La portanza', constraints: ['F = ½ d (vs² − vi²) S, in kN', 'differenza di velocità da 5 a 20 m/s'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisTorricelliVenturi;
