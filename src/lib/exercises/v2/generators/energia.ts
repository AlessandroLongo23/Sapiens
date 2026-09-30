/**
 * La conservazione dell'energia meccanica. Spec: specs/exercises/energia.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/63-energia.md), each one step harder: the speed at the
 * bottom of a fall or of a slide, √(2gh); the height of a vertical throw, v₀²/(2g); the speed at B of a car that
 * passes A with a speed, √(v_A² + 2g(h_A − h_B)); the speed of a block launched by a spring, x √(k/m); the height it
 * reaches on a smooth ramp, k x² / (2 m g). No friction anywhere. g = 9,8 m/s², data with two significant figures
 * (spring constants with three), answers with two. Distractors from the lesson's warnings: the square root forgotten,
 * the 2 forgotten, speeds added instead of energies, the height of A instead of the drop, the half on one side only.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { decTex, pq, qOpt, qty, t } from '../vettori';
import { type Built, checkCommon, generateWith, r2 } from '../fisica-equilibrio';
import { G, choose, cut, data2, fallback, int3, lab, pista, r2s, uOpts } from '../fis-energia';

export const ID = 'energia';

const MS = (s: string) => qty(s, 'm/s');
const G2 = '2 \\cdot 9{,}8\\,\\text{m/s}^2';

// ---------------------------------------------------------------------------
// Level 1: the fall

function level1(rng: Rng): Built {
	const slide = rng.next() < 0.5;
	for (;;) {
		const h = data2(rng, 1.1, 99);
		const hn = Number(h);
		const exact = Math.sqrt(2 * G * hn);
		const ans = r2(exact);
		if (ans === null) continue;
		const text = slide
			? `Un bambino parte da fermo dalla cima di uno scivolo alto ${pq(h, 'm')}. Con che velocità arriva in fondo, se gli attriti sono trascurabili?`
			: `Un sasso viene lasciato cadere da un'altezza di ${pq(h, 'm')}. Con che velocità arriva al suolo, se la resistenza dell'aria è trascurabile?`;
		return {
			prompt: 'Trova la velocità.',
			problem: textBlock(text),
			solution: `v \\approx ${MS(ans)}`,
			steps: [
				t("L'energia potenziale diventa tutta cinetica: ") + ' m g h = \\tfrac{1}{2} m v^2',
				`v = \\sqrt{2 g h} = \\sqrt{${G2} \\cdot ${qty(h, 'm')}} = ${MS(cut(exact))} \\approx ${MS(ans)}`,
				slide ? t('La forma dello scivolo e la massa non servono.') : t('La massa si semplifica.'),
			],
			// the 2 forgotten; the square root forgotten; the time of the fall
			answer: choose(rng, qOpt(ans, 'm/s'), uOpts(r2s([Math.sqrt(G * hn), exact * exact < 99.5 ? exact * exact : NaN, Math.sqrt((2 * hn) / G)]), 'm/s'), fallback(exact, 'm/s')),
			params: { case: slide ? 'scivolo' : 'caduta', h },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the highest point of a throw

function level2(rng: Rng): Built {
	for (;;) {
		const v0 = data2(rng, 2.0, 30);
		const vn = Number(v0);
		const exact = (vn * vn) / (2 * G);
		const ans = r2(exact);
		if (ans === null || exact < 0.2) continue;
		const thrown = rng.pick(['Una palla viene lanciata', 'Un sasso viene lanciato', 'Una freccia viene scoccata']);
		return {
			prompt: "Trova l'altezza massima.",
			problem: textBlock(`${thrown} verso l'alto a ${pq(v0, 'm/s')}. Di quanto sale sopra il punto di lancio, se la resistenza dell'aria è trascurabile?`),
			solution: `h_{max} \\approx ${qty(ans, 'm')}`,
			steps: [
				t("Nel punto più alto la velocità è zero: l'energia cinetica è diventata tutta potenziale."),
				`h_{max} = \\dfrac{v_0^2}{2 g} = \\dfrac{(${MS(v0)})^2}{${G2}} = ${cut(exact)}\\,\\text{m} \\approx ${qty(ans, 'm')}`,
			],
			// the 2 forgotten; the square forgotten; g forgotten
			answer: choose(rng, qOpt(ans, 'm'), uOpts(r2s([(vn * vn) / G, vn / (2 * G), (vn * vn) / 2 < 99.5 ? (vn * vn) / 2 : NaN]), 'm'), fallback(exact, 'm')),
			params: { v0 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: from A to B on a track

function level3(rng: Rng): Built {
	for (;;) {
		const hA = data2(rng, 5.0, 60);
		const hB = data2(rng, 1.1, 60);
		const vA = data2(rng, 1.1, 15);
		const a = Number(hA), b = Number(hB), va = Number(vA);
		// a drop of at least 3 m, and v_A not negligible: forgetting it must show in the answer
		if (a - b < 3 || va * va < 0.25 * 2 * G * (a - b)) continue;
		const exact = Math.sqrt(va * va + 2 * G * (a - b));
		const ans = r2(exact);
		if (ans === null) continue;
		const alt = `Una pista liscia che scende dal punto A, alto ${lab(hA)} metri, al punto B, alto ${lab(hB)} metri; in A il carrello ha una velocità di ${lab(vA)} metri al secondo.`;
		return {
			prompt: 'Trova la velocità in B.',
			problem: textBlock(`Un carrello delle montagne russe passa per il punto $A$, alto ${pq(hA, 'm')}, alla velocità di ${pq(vA, 'm/s')}. Con che velocità passa per il punto $B$, alto ${pq(hB, 'm')}, se gli attriti sono trascurabili?`),
			solution: `v_B \\approx ${MS(ans)}`,
			steps: [
				'\\tfrac{1}{2} m v_A^2 + m g h_A = \\tfrac{1}{2} m v_B^2 + m g h_B',
				t('Divisa per ') + ' m ' + t(' e moltiplicata per 2: ') + ' v_B^2 = v_A^2 + 2 g (h_A - h_B)',
				`v_B = \\sqrt{(${MS(vA)})^2 + ${G2} \\cdot (${qty(hA, 'm')} - ${qty(hB, 'm')})} = ${MS(cut(exact))} \\approx ${MS(ans)}`,
			],
			// v_A forgotten; the speeds added; the height of A instead of the drop
			answer: choose(rng, qOpt(ans, 'm/s'), uOpts(r2s([Math.sqrt(2 * G * (a - b)), va + Math.sqrt(2 * G * (a - b)), Math.sqrt(va * va + 2 * G * a)]), 'm/s'), fallback(exact, 'm/s')),
			params: { hA, hB, vA },
			scene: pista(alt, { hA, hB, vA: `${lab(vA)} m/s` }),
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: the spring that launches a block

function spring(rng: Rng) {
	const k = int3(rng, 101, 999);
	const x = data2(rng, 1.1, 25);
	const m = data2(rng, 0.11, 9.9);
	const xm = Number(x) / 100;
	return { k, x, m, xm, U: 0.5 * Number(k) * xm * xm };
}

const xStep = (x: string, xm: number) => `${t('La compressione in metri: ')} x = ${qty(x, 'cm')} = ${decTex(String(Math.round(xm * 100000) / 100000))}\\,\\text{m}`;

function level4(rng: Rng): Built {
	for (;;) {
		const { k, x, m, xm, U } = spring(rng);
		const exact = xm * Math.sqrt(Number(k) / Number(m));
		const ans = r2(exact);
		if (ans === null || exact < 0.3 || exact > 30) continue;
		return {
			prompt: 'Trova la velocità del blocco.',
			problem: textBlock(`Una molla con costante elastica ${pq(k, 'N/m')}, compressa di ${pq(x, 'cm')}, lancia un blocco di ${pq(m, 'kg')} su un piano orizzontale liscio. Con che velocità parte il blocco?`),
			solution: `v \\approx ${MS(ans)}`,
			steps: [
				xStep(x, xm),
				t("L'energia elastica diventa tutta cinetica: ") + ' \\tfrac{1}{2} k x^2 = \\tfrac{1}{2} m v^2',
				`v = x \\sqrt{\\dfrac{k}{m}} = ${decTex(String(Math.round(xm * 100000) / 100000))}\\,\\text{m} \\cdot \\sqrt{\\dfrac{${qty(k, 'N/m')}}{${qty(m, 'kg')}}} = ${MS(cut(exact))} \\approx ${MS(ans)}`,
			],
			// the half on one side only (twice); the square root forgotten
			answer: choose(rng, qOpt(ans, 'm/s'), uOpts(r2s([exact / Math.SQRT2, exact * Math.SQRT2, (xm * Number(k)) / Number(m)]), 'm/s'), fallback(exact, 'm/s')),
			params: { k, x, m, U },
		};
	}
}

function level5(rng: Rng): Built {
	for (;;) {
		const { k, x, m, xm, U } = spring(rng);
		const hm = U / (Number(m) * G);
		const exact = hm * 100;
		const ans = r2(exact);
		if (ans === null || exact < 1.1 || exact > 99) continue;
		return {
			prompt: "Trova l'altezza.",
			problem: textBlock(`Una molla con costante elastica ${pq(k, 'N/m')}, compressa di ${pq(x, 'cm')}, lancia un blocco di ${pq(m, 'kg')} su un piano liscio, che poi sale in una rampa liscia. Fino a che altezza, in centimetri, sale il blocco?`),
			solution: `h \\approx ${qty(ans, 'cm')}`,
			steps: [
				xStep(x, xm),
				t("L'energia elastica diventa tutta potenziale gravitazionale: ") + ' \\tfrac{1}{2} k x^2 = m g h',
				`h = \\dfrac{k x^2}{2 m g} = \\dfrac{${qty(k, 'N/m')} \\cdot (${decTex(String(Math.round(xm * 100000) / 100000))}\\,\\text{m})^2}{2 \\cdot ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2} = ${cut(hm)}\\,\\text{m} \\approx ${qty(ans, 'cm')}`,
			],
			// the half forgotten; the square forgotten; g forgotten
			answer: choose(rng, qOpt(ans, 'cm'), uOpts(r2s([2 * exact, ((Number(k) * xm) / (2 * Number(m) * G)) * 100, exact * G]), 'cm'), fallback(exact, 'cm')),
			params: { k, x, m },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level === 3 && sample.scene?.type !== 'pista-energia') v.push('manca la scena');
	return v;
}

export const energia: Generator = {
	id: ID,
	title: "La conservazione dell'energia meccanica",
	levels: {
		1: { label: 'La caduta libera', constraints: ['un sasso che cade o uno scivolo, metà ciascuno', 'altezza da 1,1 a 99 m'] },
		2: { label: "L'altezza massima", constraints: ['lancio verticale da 2,0 a 30 m/s'] },
		3: { label: "Da un punto all'altro della pista", constraints: ['il carrello in A ha già una velocità', 'dislivello di almeno 3 m', 'v_A² almeno un quarto di 2 g Δh'] },
		4: { label: 'La molla che lancia un blocco', constraints: ['compressione in centimetri', 'velocità tra 0,3 e 30 m/s'] },
		5: { label: 'La molla e la salita', constraints: ['altezza in centimetri, tra 1,1 e 99'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default energia;
