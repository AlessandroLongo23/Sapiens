/**
 * L'equazione di Bernoulli. Spec: specs/exercises/fis-bernoulli.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/99-fis-bernoulli.md), each one step harder: the drop of
 * pressure in a horizontal pipe from the two speeds, ½ d (v2² − v1²); the pressure in the narrow stretch, from the
 * pressure before it; a pipe of constant section that climbs, p1 − d g h; the horizontal pipe where the second speed
 * comes first from the continuity equation with the diameters; the pipe that climbs and narrows, with the three
 * terms. Water, d = 1000 kg/m³, g = 9,8 m/s². Pressures in kPa: a drop with two significant figures, a pressure
 * rounded to the kilopascal, as the lesson rounds a sum to its least precise addend. Distractors from the lesson's
 * warnings: the square of the difference, the pressure that rises in the narrow stretch, the height or the speeds
 * forgotten, the diameters not squared.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, D_ACQUA, G, checkCommon, cut, d2, generateWith, lab, pick4, pq, qu, ri, rs, t, textBlock, tubo } from '../fis-fluidi-moto';

export const ID = 'fis-bernoulli';

const HALF_D = '\\dfrac{1}{2} \\cdot 1000\\,\\text{kg/m}^3';
const dec = (x: number, d = 2) => String(Math.round(x * 10 ** d) / 10 ** d).replace('.', '{,}');
/** A pressure in kPa, a whole number from 120 to 480 that does not end with zero. */
function pressure(rng: Rng): string {
	for (;;) {
		const p = rng.int(120, 480);
		if (p % 10) return String(p);
	}
}
const comma = (s: string) => s.replace('.', ',');

// ---------------------------------------------------------------------------
// Level 1: the drop of pressure in a horizontal pipe

function level1(rng: Rng): Built {
	for (;;) {
		const v1 = d2(rng, 0.5, 4);
		const v2 = d2(rng, 2, 12);
		if (Number(v2) < 1.5 * Number(v1)) continue;
		const exact = (0.5 * D_ACQUA * (Number(v2) ** 2 - Number(v1) ** 2)) / 1000;
		const ans = rs(exact);
		if (ans === null) continue;
		return {
			prompt: 'Calcola la differenza di pressione.',
			problem: textBlock(`In un tubo orizzontale l'acqua scorre a ${pq(v1, 'm/s')} nel tratto largo e a ${pq(v2, 'm/s')} in una strozzatura. Di quanto è più bassa la pressione nella strozzatura?`),
			solution: `p_1 - p_2 \\approx ${qu(ans, 'kPa')}`,
			steps: [
				t('Le quote sono uguali: ') + 'p_1 + \\tfrac{1}{2} d\\,v_1^2 = p_2 + \\tfrac{1}{2} d\\,v_2^2',
				`p_1 - p_2 = \\dfrac{1}{2}\\,d\\,(v_2^2 - v_1^2) = ${HALF_D} \\cdot \\left[(${qu(v2, 'm/s')})^2 - (${qu(v1, 'm/s')})^2\\right]`,
				`p_1 - p_2 = ${cut(exact * 1000)}\\,\\text{Pa} \\approx ${qu(ans, 'kPa')}`,
			],
			// the square of the difference; the half forgotten; the squares added
			answer: pick4(rng, ans, 'kPa', [(0.5 * D_ACQUA * (Number(v2) - Number(v1)) ** 2) / 1000, exact * 2, (0.5 * D_ACQUA * (Number(v2) ** 2 + Number(v1) ** 2)) / 1000]),
			params: { v1, v2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the pressure in the narrow stretch

function level2(rng: Rng): Built {
	for (;;) {
		const v1 = d2(rng, 0.5, 4);
		const v2 = d2(rng, 3, 12);
		if (Number(v2) < 1.5 * Number(v1)) continue;
		const p1 = pressure(rng);
		const drop = (0.5 * D_ACQUA * (Number(v2) ** 2 - Number(v1) ** 2)) / 1000;
		const exact = Number(p1) - drop;
		const ans = ri(exact);
		if (ans === null || drop < 4 || exact < 30) continue;
		return {
			prompt: 'Calcola la pressione.',
			problem: textBlock(`In un tubo orizzontale l'acqua scorre a ${pq(v1, 'm/s')} con una pressione di ${pq(p1, 'kPa')}. In una strozzatura la velocità sale a ${pq(v2, 'm/s')}. Quanto vale la pressione nella strozzatura?`),
			solution: `p_2 \\approx ${qu(ans, 'kPa')}`,
			steps: [
				`\\dfrac{1}{2}\\,d\\,(v_2^2 - v_1^2) = ${HALF_D} \\cdot \\left[(${qu(v2, 'm/s')})^2 - (${qu(v1, 'm/s')})^2\\right] = ${dec(drop)}\\,\\text{kPa}`,
				`p_2 = p_1 - \\dfrac{1}{2}\\,d\\,(v_2^2 - v_1^2) = ${qu(p1, 'kPa')} - ${dec(drop)}\\,\\text{kPa} \\approx ${qu(ans, 'kPa')}`,
				t('Dove il fluido è più veloce la pressione è più bassa.'),
			],
			// the pressure rises; the square of the difference; the drop alone
			answer: pick4(rng, ans, 'kPa', [Number(p1) + drop, Number(p1) - (0.5 * D_ACQUA * (Number(v2) - Number(v1)) ** 2) / 1000, drop], true),
			params: { v1, v2, p1 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: constant section, the pipe climbs

function level3(rng: Rng): Built {
	for (;;) {
		const h = d2(rng, 2, 25);
		const p1 = pressure(rng);
		const climb = (D_ACQUA * G * Number(h)) / 1000;
		const exact = Number(p1) - climb;
		const ans = ri(exact);
		if (ans === null || exact < 30) continue;
		return {
			prompt: 'Calcola la pressione.',
			problem: textBlock(`Alla base di un palazzo l'acqua scorre in un tubo con una pressione di ${pq(p1, 'kPa')}. Il tubo sale, sempre con la stessa sezione, fino a un rubinetto che si trova ${pq(h, 'm')} più in alto. Quanto vale la pressione dell'acqua che scorre in quel punto?`),
			solution: `p_2 \\approx ${qu(ans, 'kPa')}`,
			steps: [
				t('La sezione è la stessa, quindi anche la velocità: ') + 'p_1 + d\\,g\\,h_1 = p_2 + d\\,g\\,h_2',
				`d\\,g\\,h = 1000\\,\\text{kg/m}^3 \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${qu(h, 'm')} = ${dec(climb)}\\,\\text{kPa}`,
				`p_2 = p_1 - d\\,g\\,h = ${qu(p1, 'kPa')} - ${dec(climb)}\\,\\text{kPa} \\approx ${qu(ans, 'kPa')}`,
			],
			// the pressure rises with the height; g forgotten; the climb alone
			answer: pick4(rng, ans, 'kPa', [Number(p1) + climb, Number(p1) - Number(h), climb], true),
			params: { h, p1 },
			scene: tubo(`Un tubo di sezione costante che sale di ${comma(h)} m; in basso la pressione è ${p1} kPa`, { rapporto: 1, salita: true, etichette: { uno: lab('p_1', p1, 'kPa'), due: 'p_2 = ?', h: lab('h', h, 'm') } }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: horizontal, the second speed from the diameters

function level4(rng: Rng): Built {
	for (;;) {
		const D1 = d2(rng, 2, 9);
		const D2 = d2(rng, 1.1, 6);
		const ratio = Number(D1) / Number(D2);
		if (ratio < 1.3 || ratio > 3) continue;
		const v1 = d2(rng, 0.5, 3);
		const v2 = Number(v1) * ratio * ratio;
		const p1 = pressure(rng);
		const drop = (0.5 * D_ACQUA * (v2 ** 2 - Number(v1) ** 2)) / 1000;
		const exact = Number(p1) - drop;
		const ans = ri(exact);
		if (ans === null || drop < 4 || exact < 30) continue;
		return {
			prompt: 'Calcola la pressione.',
			problem: textBlock(`In un tubo orizzontale di diametro ${pq(D1, 'cm')} l'acqua scorre a ${pq(v1, 'm/s')} con una pressione di ${pq(p1, 'kPa')}. Più avanti il diametro si riduce a ${pq(D2, 'cm')}. Quanto vale la pressione nel tratto stretto?`),
			solution: `p_2 \\approx ${qu(ans, 'kPa')}`,
			steps: [
				t('La velocità nel tratto stretto viene dalla continuità:'),
				`v_2 = v_1 \\cdot \\left(\\dfrac{D_1}{D_2}\\right)^2 = ${qu(v1, 'm/s')} \\cdot \\left(\\dfrac{${qu(D1, 'cm')}}{${qu(D2, 'cm')}}\\right)^2 = ${cut(v2)}\\,\\text{m/s}`,
				`\\dfrac{1}{2}\\,d\\,(v_2^2 - v_1^2) = ${HALF_D} \\cdot \\left[(${cut(v2)}\\,\\text{m/s})^2 - (${qu(v1, 'm/s')})^2\\right] = ${dec(drop)}\\,\\text{kPa}`,
				`p_2 = ${qu(p1, 'kPa')} - ${dec(drop)}\\,\\text{kPa} \\approx ${qu(ans, 'kPa')}`,
			],
			// the diameters not squared; the pressure rises; the drop alone
			answer: pick4(rng, ans, 'kPa', [Number(p1) - (0.5 * D_ACQUA * ((Number(v1) * ratio) ** 2 - Number(v1) ** 2)) / 1000, Number(p1) + drop, drop], true),
			params: { D1, D2, v1, p1 },
			scene: tubo(`Un tubo orizzontale di diametro ${comma(D1)} cm che si stringe fino a ${comma(D2)} cm`, { rapporto: 1 / ratio, etichette: { uno: lab('D_1', D1, 'cm'), due: lab('D_2', D2, 'cm'), v1: lab('v_1', v1, 'm/s'), v2: 'v_2 = ?' } }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the pipe climbs and narrows

function level5(rng: Rng): Built {
	for (;;) {
		const D1 = d2(rng, 2, 9);
		const D2 = d2(rng, 1.1, 6);
		const ratio = Number(D1) / Number(D2);
		if (ratio < 1.3 || ratio > 2.6) continue;
		const v1 = d2(rng, 0.5, 2.5);
		const h = d2(rng, 2, 15);
		const v2 = Number(v1) * ratio * ratio;
		const p1 = pressure(rng);
		const drop = (0.5 * D_ACQUA * (v2 ** 2 - Number(v1) ** 2)) / 1000;
		const climb = (D_ACQUA * G * Number(h)) / 1000;
		const exact = Number(p1) - drop - climb;
		const ans = ri(exact);
		if (ans === null || drop < 4 || exact < 30) continue;
		return {
			prompt: 'Calcola la pressione.',
			problem: textBlock(`In cantina un tubo di diametro ${pq(D1, 'cm')} porta acqua a ${pq(v1, 'm/s')} con una pressione di ${pq(p1, 'kPa')}. Il tubo sale di ${pq(h, 'm')} e si stringe fino a un diametro di ${pq(D2, 'cm')}. Quanto vale la pressione dell'acqua nel tratto in alto?`),
			solution: `p_2 \\approx ${qu(ans, 'kPa')}`,
			steps: [
				`v_2 = v_1 \\cdot \\left(\\dfrac{D_1}{D_2}\\right)^2 = ${qu(v1, 'm/s')} \\cdot \\left(\\dfrac{${qu(D1, 'cm')}}{${qu(D2, 'cm')}}\\right)^2 = ${cut(v2)}\\,\\text{m/s}`,
				`\\dfrac{1}{2}\\,d\\,(v_2^2 - v_1^2) = ${dec(drop)}\\,\\text{kPa} \\qquad d\\,g\\,h_2 = 1000 \\cdot 9{,}8 \\cdot ${comma(h).replace(',', '{,}')}\\,\\text{Pa} = ${dec(climb)}\\,\\text{kPa}`,
				`p_2 = p_1 - \\dfrac{1}{2}\\,d\\,(v_2^2 - v_1^2) - d\\,g\\,h_2`,
				`p_2 = ${qu(p1, 'kPa')} - ${dec(drop)}\\,\\text{kPa} - ${dec(climb)}\\,\\text{kPa} \\approx ${qu(ans, 'kPa')}`,
			],
			// the height forgotten; the speeds forgotten; the height added
			answer: pick4(rng, ans, 'kPa', [Number(p1) - drop, Number(p1) - climb, Number(p1) - drop + climb], true),
			params: { D1, D2, v1, p1, h },
			scene: tubo(`Un tubo di diametro ${comma(D1)} cm che sale di ${comma(h)} m e si stringe fino a ${comma(D2)} cm`, {
				rapporto: 1 / ratio,
				salita: true,
				etichette: { uno: lab('D_1', D1, 'cm'), due: lab('D_2', D2, 'cm'), v1: lab('v_1', v1, 'm/s'), v2: 'v_2 = ?', h: lab('h', h, 'm') },
			}),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if ([3, 4, 5].includes(sample.level) && sample.scene?.type !== 'tubo-sezioni') v.push('manca la scena');
	return v;
}

export const fisBernoulli: Generator = {
	id: ID,
	title: "L'equazione di Bernoulli",
	levels: {
		1: { label: 'Il calo di pressione nella strozzatura', constraints: ['tubo orizzontale, acqua', 'p1 − p2 = ½ d (v2² − v1²) in kPa, due cifre'] },
		2: { label: 'La pressione nella strozzatura', constraints: ['p1 intera in kPa tra 120 e 480', 'p2 arrotondata al kPa, almeno 30 kPa'] },
		3: { label: 'Il tubo che sale', constraints: ['sezione costante', 'p2 = p1 − d g h, dislivello da 2 a 25 m'] },
		4: { label: 'La strozzatura con i diametri', constraints: ['v2 dalla continuità, rapporto dei diametri tra 1,3 e 3', 'tubo orizzontale'] },
		5: { label: 'Più in alto e più stretto', constraints: ['i tre termini insieme', 'rapporto dei diametri tra 1,3 e 2,6, dislivello da 2 a 15 m'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisBernoulli;
