/**
 * L'energia cinetica di rotazione e il rotolamento. Spec: specs/exercises/fis-energia-rotazionale.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/89-fis-energia-rotazionale.md), each one step harder:
 * K = ½ I ω² from I and ω; the same with I from the shape (c m r², the radius in centimetres); the total kinetic
 * energy of a body that rolls, (1 + c) ½ m v²; the speed at the bottom of a drop h, √(2gh / (1 + c)); the
 * acceleration along an incline, g sin β / (1 + c); the height a rolling body climbs, (1 + c) v² / (2g).
 * g = 9,8 m/s², data with two significant figures, answers with two. Distractors from the lesson's warnings: the
 * rotation forgotten (the sliding body), the half forgotten, the square forgotten, c of the wrong body.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { t } from '../vettori';
import { type Built, checkCommon, generateWith, sinD, cosD } from '../fisica-equilibrio';
import { cut, data2, lab } from '../fis-energia';
import { G, SHAPES, type Shape, cmToM, pick4, pq, q } from '../fis-momento-angolare';

export const ID = 'fis-energia-rotazionale';

const again = (): never => {
	throw new Error('resample');
};

const piano = (alt: string, s: Shape, d: { testoH?: string; angolo?: number }): SceneRef => {
	const data: Record<string, unknown> = { forma: s.key, nome: s.nome.replace(/^un[a']? ?/, '') };
	if (d.testoH) data.testoH = d.testoH;
	if (d.angolo) {
		data.angolo = d.angolo;
		data.testoAngolo = `${d.angolo}°`;
	}
	return { type: 'rotolamento-piano', data, alt };
};

// Level 1: K from I and ω
function level1(rng: Rng): Built {
	const I = data2(rng, 0.11, 9.9);
	const w = data2(rng, 1.1, 30);
	const i = Number(I), o = Number(w);
	const exact = 0.5 * i * o * o;
	if (exact < 1) again();
	const p = pick4(rng, exact, 'J', [i * o * o, 0.5 * i * o, i * o]) ?? again();
	const what = rng.pick(['Un volano', 'Una ruota', 'Una mola']);
	return {
		prompt: "Trova l'energia cinetica di rotazione.",
		problem: textBlock(`${what} ha momento d'inerzia ${pq(I, 'kg·m²')} e ruota a ${pq(w, 'rad/s')}. Quanto vale la sua energia cinetica di rotazione?`),
		solution: `K_{rot} \\approx ${q(p.ans, 'J')}`,
		steps: [`K_{rot} = \\tfrac{1}{2} I\\,\\omega^2 = \\tfrac{1}{2} \\cdot ${q(I, 'kg·m²')} \\cdot (${q(w, 'rad/s')})^2 = ${cut(exact)}\\,\\text{J} \\approx ${q(p.ans, 'J')}`],
		answer: p.answer,
		params: { I, omega: w },
	};
}

// Level 2: I from the shape
function level2(rng: Rng): Built {
	const s = rng.pick(SHAPES);
	const m = data2(rng, 0.11, 9.9);
	const r = data2(rng, 11, 45);
	const w = data2(rng, 11, 99);
	const rm = cmToM(r);
	const mn = Number(m), rn = Number(rm), o = Number(w);
	const inertia = s.c * mn * rn * rn;
	const exact = 0.5 * inertia * o * o;
	if (exact < 1) again();
	const other = s.c === 1 ? 0.5 : 1;
	const p = pick4(rng, exact, 'J', [(exact / s.c) * other, 2 * exact, 0.5 * inertia * o]) ?? again();
	return {
		prompt: "Trova l'energia cinetica di rotazione.",
		problem: textBlock(`${s.nome[0].toUpperCase()}${s.nome.slice(1)} di massa ${pq(m, 'kg')} e raggio ${pq(r, 'cm')} ruota intorno al suo asse a ${pq(w, 'rad/s')}. Quanto vale la sua energia cinetica di rotazione?`),
		solution: `K_{rot} \\approx ${q(p.ans, 'J')}`,
		steps: [
			`${t('Il raggio in metri: ')} r = ${q(r, 'cm')} = ${q(rm, 'm')}`,
			`I = ${s.inertia} = ${s.c === 1 ? '' : `${s.cTex} \\cdot `}${q(m, 'kg')} \\cdot (${q(rm, 'm')})^2 = ${cut(inertia)}\\,\\text{kg}\\cdot\\text{m}^2`,
			`K_{rot} = \\tfrac{1}{2} I\\,\\omega^2 = \\tfrac{1}{2} \\cdot ${cut(inertia)}\\,\\text{kg}\\cdot\\text{m}^2 \\cdot (${q(w, 'rad/s')})^2 = ${cut(exact)}\\,\\text{J} \\approx ${q(p.ans, 'J')}`,
		],
		answer: p.answer,
		params: { forma: s.key, m, r, omega: w },
	};
}

// Level 3: the total kinetic energy of a rolling body
function level3(rng: Rng): Built {
	const s = rng.pick(SHAPES);
	const m = data2(rng, 0.11, 9.9);
	const v = data2(rng, 1.1, 9.9);
	const tr = 0.5 * Number(m) * Number(v) ** 2;
	const exact = (1 + s.c) * tr;
	if (exact < 1) again();
	const p = pick4(rng, exact, 'J', [tr, s.c * tr, 2 * exact]) ?? again();
	return {
		prompt: "Trova l'energia cinetica totale.",
		problem: textBlock(`${s.nome[0].toUpperCase()}${s.nome.slice(1)} di massa ${pq(m, 'kg')} rotola senza strisciare a ${pq(v, 'm/s')}. Quanto vale la sua energia cinetica totale?`),
		solution: `K \\approx ${q(p.ans, 'J')}`,
		steps: [
			`${t(`Per ${s.il} `)} I = ${s.inertia}${t(', quindi ')} c = ${s.cTex}`,
			`\\tfrac{1}{2} m\\,v_{cm}^2 = \\tfrac{1}{2} \\cdot ${q(m, 'kg')} \\cdot (${q(v, 'm/s')})^2 = ${cut(tr)}\\,\\text{J}`,
			`K = (1 + c)\\,\\tfrac{1}{2} m\\,v_{cm}^2 = ${s.sum} \\cdot ${cut(tr)}\\,\\text{J} = ${cut(exact)}\\,\\text{J} \\approx ${q(p.ans, 'J')}`,
		],
		answer: p.answer,
		params: { forma: s.key, m, v },
	};
}

// Level 4: the speed at the bottom of a drop
function level4(rng: Rng): Built {
	const s = rng.pick(SHAPES);
	const h = data2(rng, 0.11, 9.9);
	const hn = Number(h);
	const exact = Math.sqrt((2 * G * hn) / (1 + s.c));
	const p = pick4(rng, exact, 'm/s', [Math.sqrt(2 * G * hn), Math.sqrt(2 * G * hn * (1 + s.c)), Math.sqrt((G * hn) / (1 + s.c))]) ?? again();
	return {
		prompt: 'Trova la velocità in fondo alla discesa.',
		problem: textBlock(`${s.nome[0].toUpperCase()}${s.nome.slice(1)} parte da fermo e rotola senza strisciare lungo una discesa, scendendo di ${pq(h, 'm')}. Con che velocità arriva in fondo?`),
		solution: `v_{cm} \\approx ${q(p.ans, 'm/s')}`,
		steps: [
			`${t("L'energia potenziale diventa cinetica, di traslazione e di rotazione: ")} m g h = (1 + c)\\,\\tfrac{1}{2} m\\,v_{cm}^2`,
			`${t(`Per ${s.il} `)} c = ${s.cTex}${t(', quindi ')} 1 + c = ${s.sum}`,
			`v_{cm} = \\sqrt{\\dfrac{2 g h}{1 + c}} = \\sqrt{\\dfrac{2 \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${q(h, 'm')}}{${s.sum}}} = ${cut(exact)}\\,\\text{m/s} \\approx ${q(p.ans, 'm/s')}`,
		],
		answer: p.answer,
		params: { forma: s.key, h },
		scene: piano(`Un piano inclinato: in cima c'è ${s.nome}, e due linee tratteggiate segnano il dislivello di ${lab(h)} metri fino al fondo.`, s, { testoH: `${lab(h)} m` }),
	};
}

// Level 5: the acceleration along the incline
function level5(rng: Rng): Built {
	const s = rng.pick(SHAPES);
	const beta = rng.pick([15, 20, 25, 30, 35, 40, 45, 50, 55, 60]);
	const exact = (G * sinD(beta)) / (1 + s.c);
	const p = pick4(rng, exact, 'm/s²', [G * sinD(beta), (G * cosD(beta)) / (1 + s.c), G * sinD(beta) * (1 + s.c)]) ?? again();
	return {
		prompt: "Trova l'accelerazione.",
		problem: textBlock(`${s.nome[0].toUpperCase()}${s.nome.slice(1)} rotola senza strisciare lungo un piano inclinato di $${beta}^\\circ$. Con quale accelerazione scende il suo centro di massa?`),
		solution: `a \\approx ${q(p.ans, 'm/s²')}`,
		steps: [
			`${t(`Per ${s.il} `)} c = ${s.cTex}${t(', quindi ')} 1 + c = ${s.sum}`,
			`a = \\dfrac{g\\sin\\beta}{1 + c} = \\dfrac{9{,}8\\,\\text{m/s}^2 \\cdot \\sin ${beta}^\\circ}{${s.sum}} = ${cut(exact)}\\,\\text{m/s}^2 \\approx ${q(p.ans, 'm/s²')}`,
		],
		answer: p.answer,
		params: { forma: s.key, beta },
		scene: piano(`Un piano inclinato di ${beta} gradi: in cima c'è ${s.nome}.`, s, { angolo: beta }),
	};
}

// Level 6: the height a rolling body climbs
function level6(rng: Rng): Built {
	const s = rng.pick(SHAPES);
	const v = data2(rng, 1.1, 9.9);
	const vn = Number(v);
	const exact = ((1 + s.c) * vn * vn) / (2 * G);
	if (exact < 0.1) again();
	const p = pick4(rng, exact, 'm', [(vn * vn) / (2 * G), ((1 + s.c) * vn * vn) / G, (vn * vn) / (2 * G * (1 + s.c))]) ?? again();
	return {
		prompt: "Trova l'altezza raggiunta.",
		problem: textBlock(`${s.nome[0].toUpperCase()}${s.nome.slice(1)} rotola senza strisciare su un pavimento a ${pq(v, 'm/s')} e imbocca una rampa. Di quanto sale prima di fermarsi?`),
		solution: `h \\approx ${q(p.ans, 'm')}`,
		steps: [
			`${t("Tutta l'energia cinetica, di traslazione e di rotazione, diventa potenziale: ")} (1 + c)\\,\\tfrac{1}{2} m\\,v_{cm}^2 = m g h`,
			`${t(`Per ${s.il} `)} c = ${s.cTex}${t(', quindi ')} 1 + c = ${s.sum}`,
			`h = \\dfrac{(1 + c)\\,v_{cm}^2}{2 g} = \\dfrac{${s.sum} \\cdot (${q(v, 'm/s')})^2}{2 \\cdot 9{,}8\\,\\text{m/s}^2} = ${cut(exact)}\\,\\text{m} \\approx ${q(p.ans, 'm')}`,
		],
		answer: p.answer,
		params: { forma: s.key, v },
	};
}

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	const scene = sample.level === 4 || sample.level === 5;
	if (scene && sample.scene?.type !== 'rotolamento-piano') v.push('manca la scena');
	if (!scene && sample.scene) v.push('scena non prevista');
	return v;
}

export const fisEnergiaRotazionale: Generator = {
	id: ID,
	title: "L'energia cinetica di rotazione e il rotolamento",
	levels: {
		1: { label: "L'energia di un corpo che ruota", constraints: ['I da 0,11 a 9,9 kg·m², ω da 1,1 a 30 rad/s', 'risultato tra 1 e 99 J'] },
		2: { label: "L'energia di rotazione dalla forma del corpo", constraints: ['anello, cilindro pieno, sfera piena o sfera cava', 'raggio in centimetri'] },
		3: { label: "L'energia di un corpo che rotola", constraints: ['traslazione e rotazione insieme', 'risultato tra 1 e 99 J'] },
		4: { label: 'La velocità in fondo alla discesa', constraints: ['dislivello da 0,11 a 9,9 m', 'con la scena del piano'] },
		5: { label: "L'accelerazione lungo il piano inclinato", constraints: ['angolo da 15° a 60°, a passi di 5°', 'con la scena del piano'] },
		6: { label: "L'altezza raggiunta in salita", constraints: ['velocità da 1,1 a 9,9 m/s', 'altezza di almeno 0,1 m'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisEnergiaRotazionale;
