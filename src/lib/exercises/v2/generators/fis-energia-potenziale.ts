/**
 * Energia potenziale gravitazionale ed elastica. Spec: specs/exercises/fis-energia-potenziale.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/62-fis-energia-potenziale.md), each one step harder:
 * U = m g h from the floor; U with another reference level (negative below it); the work of the weight between two
 * heights, with its sign; the elastic energy ½ k x² with the deformation in centimetres; the deformation from the
 * elastic energy. g = 9,8 m/s², data with two significant figures (spring constants with three), answers with two,
 * never too close to a rounding boundary. Distractors from the lesson's warnings: g forgotten, the ½ or the square
 * forgotten, the sign of the work, the height from the wrong level, cm² converted as if they were cm.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { decTex, pq, qOpt, qty, t } from '../vettori';
import { type Built, checkCommon, generateWith, mulDec, r2 } from '../fisica-equilibrio';
import { G, J, choose, cut, data2, fallback, int3, r2s, uOpts } from '../fis-energia';

export const ID = 'fis-energia-potenziale';

const MG = (m: string) => `${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2`;
const exactU = (m: string, h: string) => mulDec(mulDec(m, '9.8'), h);
const inRange = (x: number) => Math.abs(x) >= 1 && Math.abs(x) < 99.5;

const BODIES = ['Un vaso', 'Uno zaino', 'Una cassa', 'Un vocabolario', 'Una pianta in vaso'];

// ---------------------------------------------------------------------------
// Level 1: U = m g h

function level1(rng: Rng): Built {
	for (;;) {
		const m = data2(rng, 1.1, 9.9);
		const h = data2(rng, 0.3, 9.9);
		const exact = G * Number(m) * Number(h);
		const ans = r2(exact);
		if (ans === null || !inRange(exact)) continue;
		const body = rng.pick(BODIES);
		return {
			prompt: "Trova l'energia potenziale.",
			problem: textBlock(`${body} di ${pq(m, 'kg')} è su uno scaffale a ${pq(h, 'm')} dal pavimento. Quanto vale la sua energia potenziale gravitazionale, con il livello di riferimento sul pavimento?`),
			solution: `U \\approx ${J(ans)}`,
			steps: [`U = m g h = ${MG(m)} \\cdot ${qty(h, 'm')} = ${J(decTex(exactU(m, h)))} \\approx ${J(ans)}`, t('Il risultato ha due cifre significative, come i dati.')],
			// g forgotten; the half of the elastic energy; m g without the height
			answer: choose(rng, qOpt(ans, 'J'), uOpts(r2s([Number(m) * Number(h), exact / 2, G * Number(m)]), 'J'), fallback(exact, 'J')),
			params: { m, h },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: another reference level

function level2(rng: Rng): Built {
	const above = rng.next() < 0.5;
	for (;;) {
		const m = data2(rng, 1.1, 9.9);
		const table = data2(rng, 0.45, 0.95);
		if (above) {
			const h1 = data2(rng, 1.5, 2.9);
			const dh = Number(h1) - Number(table);
			const exact = G * Number(m) * dh;
			const ans = r2(exact);
			if (ans === null || !inRange(exact)) continue;
			const dhs = decTex(String(Math.round(dh * 100) / 100));
			return {
				prompt: "Trova l'energia potenziale.",
				problem: textBlock(`Una lampada di ${pq(m, 'kg')} è appesa a ${pq(h1, 'm')} dal pavimento. Quanto vale la sua energia potenziale gravitazionale rispetto al piano di un tavolo alto ${pq(table, 'm')}?`),
				solution: `U \\approx ${J(ans)}`,
				steps: [
					`${t("L'altezza sopra il livello di riferimento: ")} h = ${qty(h1, 'm')} - ${qty(table, 'm')} = ${dhs}\\,\\text{m}`,
					`U = m g h = ${MG(m)} \\cdot ${dhs}\\,\\text{m} = ${J(cut(exact))} \\approx ${J(ans)}`,
				],
				// the height from the floor; the two heights added; the sign of a level below
				answer: choose(rng, qOpt(ans, 'J'), uOpts(r2s([G * Number(m) * Number(h1), G * Number(m) * (Number(h1) + Number(table)), -exact]), 'J'), fallback(exact, 'J')),
				params: { case: 'sopra', m, h1, table },
			};
		}
		const exact = -G * Number(m) * Number(table);
		const ans = r2(exact);
		if (ans === null || !inRange(exact)) continue;
		return {
			prompt: "Trova l'energia potenziale.",
			problem: textBlock(`Una borsa di ${pq(m, 'kg')} è appoggiata sul pavimento. Quanto vale la sua energia potenziale gravitazionale rispetto al piano di un tavolo alto ${pq(table, 'm')}?`),
			solution: `U \\approx ${J(ans)}`,
			steps: [
				t('Il pavimento è sotto il livello di riferimento: la sua altezza è negativa.'),
				`U = m g h = ${MG(m)} \\cdot (-${qty(table, 'm')}) = ${J(cut(exact))} \\approx ${J(ans)}`,
			],
			// the sign forgotten; zero because it is on the floor; g forgotten
			answer: choose(rng, qOpt(ans, 'J'), [...uOpts(r2s([-exact]), 'J'), qOpt('0', 'J'), ...uOpts(r2s([-Number(m) * Number(table)]), 'J')], fallback(exact, 'J')),
			params: { case: 'sotto', m, table },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the work of the weight

function level3(rng: Rng): Built {
	const up = rng.next() < 0.5;
	for (;;) {
		const m = data2(rng, 1.1, 9.9);
		const a = data2(rng, 0.5, 9.9);
		const b = data2(rng, 0.5, 9.9);
		const [hi, hf] = Number(a) < Number(b) === up ? [a, b] : [b, a];
		if (hi === hf) continue;
		const exact = G * Number(m) * (Number(hi) - Number(hf));
		const ans = r2(exact);
		if (ans === null || !inRange(exact)) continue;
		const sign = Math.sign(exact);
		const text = up
			? `Una cassa di ${pq(m, 'kg')} viene sollevata da ${pq(hi, 'm')} a ${pq(hf, 'm')} di altezza. Quanto lavoro compie la forza-peso?`
			: `Un sasso di ${pq(m, 'kg')} cade da ${pq(hi, 'm')} a ${pq(hf, 'm')} di altezza. Quanto lavoro compie la forza-peso?`;
		return {
			prompt: 'Trova il lavoro del peso.',
			problem: textBlock(text),
			solution: `W_P \\approx ${J(ans)}`,
			steps: [
				`W_P = U_i - U_f = m g (h_i - h_f) = ${MG(m)} \\cdot (${qty(hi, 'm')} - ${qty(hf, 'm')}) = ${J(cut(exact))} \\approx ${J(ans)}`,
				up ? t('Negativo: il corpo sale, e il peso è opposto allo spostamento.') : t('Positivo: il corpo scende, nel verso del peso.'),
			],
			// the sign; the energy at the arrival or at the start instead of the difference
			answer: choose(rng, qOpt(ans, 'J'), uOpts(r2s([-exact, sign * G * Number(m) * Number(hf), sign * G * Number(m) * Number(hi)]), 'J'), fallback(exact, 'J')),
			params: { case: up ? 'sale' : 'scende', m, hi, hf },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the elastic energy

function level4(rng: Rng): Built {
	for (;;) {
		const k = int3(rng, 101, 999);
		const x = data2(rng, 1.1, 25);
		const xm = Number(x) / 100;
		const exact = 0.5 * Number(k) * xm * xm;
		const ans = r2(exact);
		if (ans === null || exact < 0.1 || exact >= 99.5) continue;
		const stretched = rng.next() < 0.5;
		const xms = decTex(String(Math.round(xm * 100000) / 100000));
		return {
			prompt: "Trova l'energia elastica.",
			problem: textBlock(`Una molla con costante elastica ${pq(k, 'N/m')} viene ${stretched ? 'allungata' : 'compressa'} di ${pq(x, 'cm')}. Quanta energia potenziale elastica ha?`),
			solution: `U \\approx ${J(ans)}`,
			steps: [
				`${t('La deformazione in metri: ')} x = ${qty(x, 'cm')} = ${xms}\\,\\text{m}`,
				`U = \\dfrac{1}{2} k x^2 = \\dfrac{1}{2} \\cdot ${qty(k, 'N/m')} \\cdot (${xms}\\,\\text{m})^2 = ${J(cut(exact))} \\approx ${J(ans)}`,
			],
			// the half forgotten; the square forgotten; cm² turned into m² dividing by 100
			answer: choose(rng, qOpt(ans, 'J'), uOpts(r2s([2 * exact, 0.5 * Number(k) * xm, exact * 100]), 'J'), fallback(exact, 'J')),
			params: { k, x, case: stretched ? 'allungata' : 'compressa' },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the deformation from the energy

function level5(rng: Rng): Built {
	for (;;) {
		const k = int3(rng, 101, 999);
		const U = data2(rng, 0.11, 9.9);
		const xm = Math.sqrt((2 * Number(U)) / Number(k));
		const exact = xm * 100;
		const ans = r2(exact);
		if (ans === null || exact < 1.1 || exact > 40) continue;
		return {
			prompt: 'Trova la deformazione.',
			problem: textBlock(`Una molla con costante elastica ${pq(k, 'N/m')} ha un'energia potenziale elastica di ${pq(U, 'J')}. Di quanti centimetri è deformata?`),
			solution: `x \\approx ${qty(ans, 'cm')}`,
			steps: [
				`x = \\sqrt{\\dfrac{2U}{k}} = \\sqrt{\\dfrac{2 \\cdot ${qty(U, 'J')}}{${qty(k, 'N/m')}}} = ${cut(xm)}\\,\\text{m}`,
				`x = ${cut(exact)}\\,\\text{cm} \\approx ${qty(ans, 'cm')}`,
			],
			// the 2 forgotten; the square root forgotten; the root of 4U/k (the half used twice)
			answer: choose(rng, qOpt(ans, 'cm'), uOpts(r2s([Math.sqrt(Number(U) / Number(k)) * 100, ((2 * Number(U)) / Number(k)) * 100, exact * Math.SQRT2]), 'cm'), fallback(exact, 'cm')),
			params: { k, U },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const fisEnergiaPotenziale: Generator = {
	id: ID,
	title: 'Energia potenziale gravitazionale ed elastica',
	levels: {
		1: { label: "L'energia potenziale gravitazionale", constraints: ['U = m g h dal pavimento', 'risultato tra 1 e 99 J'] },
		2: { label: 'Il livello di riferimento', constraints: ['sopra il piano di un tavolo o sotto, metà ciascuno'] },
		3: { label: 'Il lavoro del peso', constraints: ['il corpo sale o scende, metà ciascuno', 'lavoro con il segno'] },
		4: { label: "L'energia potenziale elastica", constraints: ['deformazione in centimetri', 'risultato tra 0,10 e 99 J'] },
		5: { label: "La deformazione dall'energia", constraints: ['risultato in centimetri, tra 1,1 e 40'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisEnergiaPotenziale;
