/**
 * L'energia cinetica e il teorema dell'energia cinetica. Spec: specs/exercises/fis-energia-cinetica.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/61-fis-energia-cinetica.md), each one step harder: the
 * kinetic energy K = ½ m v²; the same with the speed in km/h; the speed from the energy, v = √(2K/m); the work-energy
 * theorem, W = ½ m (v_f² − v_i²), speeding up or slowing down; the braking distance, from another braking at a
 * different speed (it goes with the square of the speed) or from the coefficient of friction, d = v² / (2 μd g).
 * g = 9,8 m/s², data with two significant figures, answers with two (fis-lavoro.ts). Distractors from the lesson's
 * warnings: the ½ forgotten, the square forgotten, km/h not converted, the square of the difference, the sign, the
 * distance taken as proportional to the speed.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, coeff, generateWith } from '../fisica-equilibrio';
import { approx, around, decTex, pq, q2, qOpt2, qty, sig2, some, step, two } from '../fis-lavoro';

export const ID = 'fis-energia-cinetica';

const G = 9.8;
const opt = (x: number, unit: string) => {
	const o = qOpt2(x, unit);
	if (!o) throw new Error('rounding');
	return o;
};
const opts = (xs: number[], unit: string) => some(xs.map((x) => qOpt2(x, unit)));

const BODIES = [
	{ name: 'Un carrello', e: 'o' },
	{ name: 'Una palla da bowling', e: 'a' },
	{ name: 'Un pacco', e: 'o' },
	{ name: 'Una slitta giocattolo', e: 'a' },
];
const PEOPLE = [
	{ name: 'Un pattinatore', pr: 'lui' },
	{ name: 'Una pattinatrice', pr: 'lei' },
	{ name: 'Un ciclista con la sua bici', pr: 'lui' },
	{ name: 'Una sciatrice', pr: 'lei' },
];

// ---------------------------------------------------------------------------
// Level 1: kinetic energy

function level1(rng: Rng): Built {
	const b = rng.pick(BODIES);
	const m = two(rng, true), v = two(rng, true);
	const K = 0.5 * Number(m) * Number(v) ** 2;
	return {
		prompt: "Trova l'energia cinetica.",
		problem: textBlock(`${b.name} di ${pq(m, 'kg')} si muove a ${pq(v, 'm/s')}. Quanto vale la sua energia cinetica?`),
		solution: `K \\approx ${q2(K, 'J')}`,
		steps: [`K = \\frac{1}{2} m \\, v^2 = \\frac{1}{2} \\cdot ${qty(m, 'kg')} \\cdot (${qty(v, 'm/s')})^2 = ${approx(K, 'J')}`],
		// the ½ forgotten; the square forgotten; the square over m v
		answer: choiceOf(rng, opt(K, 'J'), opts([2 * K, 0.5 * Number(m) * Number(v), 0.5 * (Number(m) * Number(v)) ** 2], 'J'), around(K, 'J')),
		params: { case: 'cinetica', m, v },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the speed in km/h

function level2(rng: Rng): Built {
	let k = 0;
	do k = rng.int(11, 24);
	while (k % 10 === 0);
	const mm = (k / 10).toFixed(1); // mass in thousands of kg, 1,1 to 2,4
	const V = two(rng, false);
	const m = Number(mm) * 1000, v = Number(V) / 3.6;
	const K = 0.5 * m * v * v;
	const mTex = `${decTex(mm)} \\cdot 10^3\\,\\text{kg}`;
	return {
		prompt: "Trova l'energia cinetica.",
		problem: textBlock(`Un'auto di $${mTex}$ viaggia a ${pq(V, 'km/h')}. Quanto vale la sua energia cinetica?`),
		solution: `K \\approx ${q2(K, 'J')}`,
		steps: [
			t('La velocità in metri al secondo:') + ` v = \\dfrac{${V}}{3{,}6}\\,\\text{m/s} = ${step(v)}\\,\\text{m/s}`,
			`K = \\frac{1}{2} m \\, v^2 = \\frac{1}{2} \\cdot ${mTex} \\cdot (${step(v)}\\,\\text{m/s})^2 = ${approx(K, 'J')}`,
		],
		// km/h not converted; multiplied by 3,6; the ½ forgotten
		answer: choiceOf(rng, opt(K, 'J'), opts([0.5 * m * Number(V) ** 2, 0.5 * m * (Number(V) * 3.6) ** 2, 2 * K], 'J'), around(K, 'J')),
		params: { case: 'km/h', mm, V },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the speed from the energy

function level3(rng: Rng): Built {
	const b = rng.pick(BODIES);
	const m = two(rng, true), K = two(rng, false);
	const v = Math.sqrt((2 * Number(K)) / Number(m));
	return {
		prompt: 'Trova la velocità.',
		problem: textBlock(`${b.name} di ${pq(m, 'kg')} ha un'energia cinetica di ${pq(K, 'J')}. Con quale velocità si muove?`),
		solution: `v \\approx ${q2(v, 'm/s')}`,
		steps: [
			t("Dalla formula dell'energia cinetica,") + ` K = \\frac{1}{2} m \\, v^2 \\ \\Rightarrow\\ v = \\sqrt{\\dfrac{2K}{m}}`,
			`v = \\sqrt{\\dfrac{2 \\cdot ${qty(K, 'J')}}{${qty(m, 'kg')}}} = ${approx(v, 'm/s')}`,
		],
		// the 2 forgotten; the root forgotten; K over m
		answer: choiceOf(rng, opt(v, 'm/s'), opts([Math.sqrt(Number(K) / Number(m)), (2 * Number(K)) / Number(m), Number(K) / Number(m)], 'm/s'), around(v, 'm/s')),
		params: { case: 'velocita', m, K },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the work-energy theorem

function level4(rng: Rng): Built {
	const faster = rng.next() < 0.5;
	for (;;) {
		const p = rng.pick(PEOPLE);
		const m = two(rng, false);
		const a = two(rng, true), b = two(rng, true);
		const vi = faster ? Math.min(Number(a), Number(b)) : Math.max(Number(a), Number(b));
		const vf = faster ? Math.max(Number(a), Number(b)) : Math.min(Number(a), Number(b));
		if (Math.abs(vf - vi) < 1) continue;
		const Vi = faster ? (Number(a) < Number(b) ? a : b) : Number(a) > Number(b) ? a : b;
		const Vf = Vi === a ? b : a;
		const W = 0.5 * Number(m) * (vf * vf - vi * vi);
		const sq = 0.5 * Number(m) * (vf - vi) ** 2 * Math.sign(vf - vi);
		return {
			prompt: 'Trova il lavoro totale.',
			problem: textBlock(`${p.name}, in tutto ${pq(m, 'kg')}, passa da ${pq(Vi, 'm/s')} a ${pq(Vf, 'm/s')}. Quanto lavoro compiono in tutto le forze che agiscono su di ${p.pr}?`),
			solution: `W_{tot} \\approx ${q2(W, 'J')}`,
			steps: [
				t("Per il teorema dell'energia cinetica il lavoro totale è la variazione dell'energia cinetica:"),
				`W_{tot} = \\frac{1}{2} m \\, v_f^2 - \\frac{1}{2} m \\, v_i^2 = \\frac{1}{2} \\cdot ${qty(m, 'kg')} \\cdot (${decTex(Vf)}^2 - ${decTex(Vi)}^2)\\,\\text{m}^2/\\text{s}^2 = ${approx(W, 'J')}`,
				faster ? t('Il lavoro è positivo: la velocità aumenta.') : t('Il lavoro è negativo: la velocità diminuisce.'),
			],
			// the square of the difference; the sign; only the final energy
			answer: choiceOf(rng, opt(W, 'J'), opts([sq, -W, 0.5 * Number(m) * vf * vf], 'J'), around(W, 'J')),
			params: { case: faster ? 'accelera' : 'rallenta', m, vi: Vi, vf: Vf },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the braking distance

function level5(rng: Rng): Built {
	if (rng.next() < 0.5) {
		for (;;) {
			const V1 = two(rng, false), V2 = two(rng, false);
			const r = Number(V2) / Number(V1);
			if ((r < 1.3 && r > 1 / 1.3) || r > 3 || r < 1 / 3 || Number(V1) < 21 || Number(V2) < 21) continue;
			const mu = rng.int(55, 80) / 100;
			const d1s = sig2((Number(V1) / 3.6) ** 2 / (2 * mu * G));
			if (!d1s || Number(d1s.value) < 1.1 || Number(d1s.value) >= 100 || /^\d+0$/.test(d1s.value)) continue;
			const d1 = d1s.value;
			const d2 = Number(d1) * r * r;
			return {
				prompt: 'Trova lo spazio di frenata.',
				problem: textBlock(`Un'auto che frena a ${pq(V1, 'km/h')} si ferma in ${pq(d1, 'm')}. In quanto spazio si ferma, sulla stessa strada, se frena a ${pq(V2, 'km/h')}?`),
				solution: `d \\approx ${q2(d2, 'm')}`,
				steps: [
					t('Lo spazio di frenata va con il quadrato della velocità: ') + ' d = \\dfrac{v^2}{2\\,\\mu_d\\,g}',
					`\\dfrac{d_2}{d_1} = \\left(\\dfrac{${V2}}{${V1}}\\right)^2 = ${step(r * r, 3)}`,
					`d_2 = ${qty(d1, 'm')} \\cdot ${step(r * r, 3)} = ${approx(d2, 'm')}`,
				],
				// proportional to the speed; the square ratio upside down; the linear ratio upside down
				answer: choiceOf(rng, opt(d2, 'm'), opts([Number(d1) * r, Number(d1) / (r * r), Number(d1) / r], 'm'), around(d2, 'm')),
				params: { case: 'rapporto', V1, V2, d1 },
			};
		}
	}
	const V = two(rng, false), mu = coeff(rng, 30, 90);
	const v = Number(V) / 3.6;
	const d = (v * v) / (2 * Number(mu) * G);
	return {
		prompt: 'Trova lo spazio di frenata.',
		problem: textBlock(`Un'auto frena a ${pq(V, 'km/h')} su una strada orizzontale; il coefficiente di attrito dinamico tra le gomme e la strada è $\\mu_d = ${decTex(mu)}$. In quanto spazio si ferma?`),
		solution: `d \\approx ${q2(d, 'm')}`,
		steps: [
			t('La velocità in metri al secondo:') + ` v = \\dfrac{${V}}{3{,}6}\\,\\text{m/s} = ${step(v)}\\,\\text{m/s}`,
			t("Il lavoro dell'attrito toglie tutta l'energia cinetica: ") + ` \\mu_d\\,m g\\,d = \\frac{1}{2} m\\,v^2`,
			`d = \\dfrac{v^2}{2\\,\\mu_d\\,g} = \\dfrac{(${step(v)}\\,\\text{m/s})^2}{2 \\cdot ${decTex(mu)} \\cdot 9{,}8\\,\\text{m/s}^2} = ${approx(d, 'm')}`,
		],
		// km/h not converted; the square forgotten; the 2 forgotten
		answer: choiceOf(rng, opt(d, 'm'), opts([(Number(V) ** 2) / (2 * Number(mu) * G), v / (2 * Number(mu) * G), (v * v) / (Number(mu) * G)], 'm'), around(d, 'm')),
		params: { case: 'coefficiente', V, mu },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.scene) v.push('scena di troppo');
	return v;
}

export const fisEnergiaCinetica: Generator = {
	id: ID,
	title: "L'energia cinetica e il teorema dell'energia cinetica",
	levels: {
		1: { label: "L'energia cinetica", constraints: ['K = ½ m v², velocità in m/s'] },
		2: { label: 'La velocità in km/h', constraints: ["un'auto, velocità da convertire"] },
		3: { label: "La velocità dall'energia", constraints: ['v = √(2K/m)'] },
		4: { label: "Il teorema dell'energia cinetica", constraints: ['accelera o rallenta, metà ciascuno'] },
		5: { label: 'Lo spazio di frenata', constraints: ['da un’altra frenata o dal coefficiente di attrito, metà ciascuno'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisEnergiaCinetica;
