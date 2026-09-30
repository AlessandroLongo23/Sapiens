/**
 * La potenza. Spec: specs/exercises/fis-potenza.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/60-fis-potenza.md), each one step harder: power from work
 * and time, P = W / Δt; lifting a load, P = m g h / Δt; power and speed, P = F v (a load lifted at constant speed, or a
 * pull along the road); the same with the speed in km/h, to be converted; the kilowatt-hour, energy from power and
 * time (in kWh from minutes, or in joules). g = 9,8 m/s², data with two or three significant figures, answers with two
 * (scientific notation from 100, src/lib/exercises/v2/fis-lavoro.ts). Distractors from the lesson's warnings: the
 * formula upside down, the mass for the weight, the time forgotten, km/h not converted, minutes taken for hours,
 * kWh without the 3600 or the 1000.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { approx, around, decTex, pq, q2, qOpt2, qty, some, step, three, two } from '../fis-lavoro';

export const ID = 'fis-potenza';

const G = 9.8;
const opt = (x: number, unit: string) => {
	const o = qOpt2(x, unit);
	if (!o) throw new Error('rounding');
	return o;
};
const opts = (xs: number[], unit: string) => some(xs.map((x) => qOpt2(x, unit)));

// ---------------------------------------------------------------------------
// Level 1: work and time

function level1(rng: Rng): Built {
	const W = three(rng), dt = two(rng, true);
	const P = Number(W) / Number(dt);
	return {
		prompt: 'Trova la potenza media.',
		problem: textBlock(`Un motore compie un lavoro di ${pq(W, 'J')} in ${pq(dt, 's')}. Quale potenza media sviluppa?`),
		solution: `P \\approx ${q2(P, 'W')}`,
		steps: [`P = \\dfrac{W}{\\Delta t} = \\dfrac{${qty(W, 'J')}}{${qty(dt, 's')}} = ${approx(P, 'W')}`],
		// work times time; the ratio upside down
		answer: choiceOf(rng, opt(P, 'W'), opts([Number(W) * Number(dt), Number(dt) / Number(W)], 'W'), around(P, 'W')),
		params: { case: 'lavoro-tempo', W, dt },
	};
}

// ---------------------------------------------------------------------------
// Level 2: lifting a load

function level2(rng: Rng): Built {
	const m = two(rng, false), h = two(rng, true), dt = two(rng, true);
	const W = Number(m) * G * Number(h);
	const P = W / Number(dt);
	return {
		prompt: 'Trova la potenza media.',
		problem: textBlock(`Un montacarichi solleva a velocità costante una cassa di ${pq(m, 'kg')} fino a un'altezza di ${pq(h, 'm')} in ${pq(dt, 's')}. Quale potenza media sviluppa?`),
		solution: `P \\approx ${q2(P, 'W')}`,
		steps: [
			t('A velocità costante il montacarichi tira con una forza uguale al peso, ') + ' m g' + t(', e compie il lavoro'),
			`W = m g h = ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${qty(h, 'm')} = ${step(W)}\\,\\text{J}`,
			`P = \\dfrac{W}{\\Delta t} = \\dfrac{${step(W)}\\,\\text{J}}{${qty(dt, 's')}} = ${approx(P, 'W')}`,
		],
		// the mass for the weight; the time forgotten
		answer: choiceOf(rng, opt(P, 'W'), opts([(Number(m) * Number(h)) / Number(dt), W], 'W'), around(P, 'W')),
		params: { case: 'sollevare', m, h, dt },
	};
}

// ---------------------------------------------------------------------------
// Level 3: power and speed

function level3(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const m = two(rng, false), v = (Number(two(rng, false)) / 100).toFixed(2);
		const F = Number(m) * G;
		const P = F * Number(v);
		return {
			prompt: 'Trova la potenza.',
			problem: textBlock(`Un argano solleva un carico di ${pq(m, 'kg')} a velocità costante, ${pq(v, 'm/s')}. Quale potenza sviluppa?`),
			solution: `P \\approx ${q2(P, 'W')}`,
			steps: [
				t("A velocità costante l'argano tira con una forza uguale al peso:") + ` m g = ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2 = ${step(F)}\\,\\text{N}`,
				`P = m g \\cdot v = ${step(F)}\\,\\text{N} \\cdot ${qty(v, 'm/s')} = ${approx(P, 'W')}`,
			],
			// the mass for the weight; the force divided by the speed
			answer: choiceOf(rng, opt(P, 'W'), opts([Number(m) * Number(v), F / Number(v)], 'W'), around(P, 'W')),
			params: { case: 'argano', m, v },
		};
	}
	const F = three(rng), v = two(rng, true);
	const P = Number(F) * Number(v);
	return {
		prompt: 'Trova la potenza.',
		problem: textBlock(`Un cavallo tira un carro lungo una strada piana con una forza di ${pq(F, 'N')}, parallela alla strada, e il carro avanza a velocità costante, ${pq(v, 'm/s')}. Quale potenza sviluppa il cavallo?`),
		solution: `P \\approx ${q2(P, 'W')}`,
		steps: [t('La forza è parallela alla velocità:'), `P = F \\cdot v = ${qty(F, 'N')} \\cdot ${qty(v, 'm/s')} = ${approx(P, 'W')}`],
		// the force divided by the speed; the speed divided by the force
		answer: choiceOf(rng, opt(P, 'W'), opts([Number(F) / Number(v), Number(v) / Number(F)], 'W'), around(P, 'W')),
		params: { case: 'traino', F, v },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the speed in km/h

function level4(rng: Rng): Built {
	const V = two(rng, false), F = three(rng);
	const v = Number(V) / 3.6;
	const P = Number(F) * v;
	return {
		prompt: 'Trova la potenza del motore.',
		problem: textBlock(`Un'auto viaggia a velocità costante, ${pq(V, 'km/h')}; le forze resistenti valgono in tutto ${pq(F, 'N')}. Quale potenza sviluppa il motore?`),
		solution: `P \\approx ${q2(P, 'W')}`,
		steps: [
			t('La velocità in metri al secondo:') + ` v = \\dfrac{${decTex(V)}}{3{,}6}\\,\\text{m/s} = ${step(v)}\\,\\text{m/s}`,
			t('A velocità costante la forza del motore è uguale alla forza resistente:'),
			`P = F \\cdot v = ${qty(F, 'N')} \\cdot ${step(v)}\\,\\text{m/s} = ${approx(P, 'W')}`,
		],
		// km/h not converted; multiplied by 3,6 in place of divided; the force divided by the speed
		answer: choiceOf(rng, opt(P, 'W'), opts([Number(F) * Number(V), Number(F) * Number(V) * 3.6, Number(F) / v], 'W'), around(P, 'W')),
		params: { case: 'km/h', V, F },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the kilowatt-hour

const APPLIANCES = ['Un forno elettrico', 'Una stufa elettrica', 'Un bollitore', 'Un condizionatore'];

function level5(rng: Rng): Built {
	const name = rng.pick(APPLIANCES);
	const fem = name.startsWith('Una');
	if (rng.next() < 0.5) {
		const P = (rng.int(11, 39) / 10).toFixed(1);
		let min = 0;
		do min = rng.int(11, 99);
		while (min % 10 === 0);
		const E = (Number(P) * min) / 60;
		return {
			prompt: "Trova l'energia consumata.",
			problem: textBlock(`${name} da ${pq(P, 'kW')} resta acces${fem ? 'a' : 'o'} per $${min}$ minuti. Quanta energia consuma, in kilowattora?`),
			solution: `E \\approx ${q2(E, 'kWh')}`,
			steps: [
				t('Il tempo in ore:') + ` \\Delta t = \\dfrac{${min}}{60}\\,\\text{h} = ${step(min / 60, 3)}\\,\\text{h}`,
				`E = P \\cdot \\Delta t = ${qty(P, 'kW')} \\cdot ${step(min / 60, 3)}\\,\\text{h} = ${approx(E, 'kWh')}`,
			],
			// the minutes taken for hours; the minutes taken for hundredths of an hour
			answer: choiceOf(rng, opt(E, 'kWh'), opts([Number(P) * min, (Number(P) * min) / 100], 'kWh'), around(E, 'kWh')),
			params: { case: 'kWh', P, min },
		};
	}
	const P = (rng.int(11, 39) / 10).toFixed(1), h = two(rng, true);
	const kwh = Number(P) * Number(h);
	const E = kwh * 3.6e6;
	return {
		prompt: "Trova l'energia consumata.",
		problem: textBlock(`${name} da ${pq(P, 'kW')} resta acces${fem ? 'a' : 'o'} per ${pq(h, 'h')}. Quanta energia consuma, in joule?`),
		solution: `E \\approx ${q2(E, 'J')}`,
		steps: [
			`E = P \\cdot \\Delta t = ${qty(P, 'kW')} \\cdot ${qty(h, 'h')} = ${step(kwh)}\\,\\text{kWh}`,
			t('Un kilowattora è ') + ' 1000\\,\\text{W} \\cdot 3600\\,\\text{s} = 3{,}6 \\cdot 10^6\\,\\text{J}' + t(':'),
			`E = ${step(kwh)} \\cdot 3{,}6 \\cdot 10^6\\,\\text{J} \\approx ${q2(E, 'J')}`,
		],
		// the 3600 forgotten; the 1000 forgotten; the kilowatt-hours taken for joules
		answer: choiceOf(rng, opt(E, 'J'), opts([kwh * 1000, kwh * 3600, kwh], 'J'), around(E, 'J')),
		params: { case: 'joule', P, h },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.scene) v.push('scena di troppo');
	return v;
}

export const fisPotenza: Generator = {
	id: ID,
	title: 'La potenza',
	levels: {
		1: { label: 'Lavoro e tempo', constraints: ['P = W / Δt'] },
		2: { label: 'Sollevare un carico', constraints: ['P = m g h / Δt, a velocità costante'] },
		3: { label: 'Potenza e velocità', constraints: ['P = F v: un carico sollevato o un traino, metà ciascuno'] },
		4: { label: 'La velocità in km/h', constraints: ['P = F v con la velocità da convertire'] },
		5: { label: 'Il kilowattora', constraints: ['energia in kWh dai minuti, o in joule, metà ciascuno'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisPotenza;
