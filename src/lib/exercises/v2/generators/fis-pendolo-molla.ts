/**
 * Il pendolo e la molla. Spec: specs/exercises/fis-pendolo-molla.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/58-fis-pendolo-molla.md), each one step harder: the
 * period of a mass on a spring, 2π √(m/k); the period of a pendulum, 2π √(l/g), with the mass given and useless; how
 * the period changes when the length, the mass, the amplitude or the spring constant change; the spring constant or the
 * length from a number of oscillations timed together; g on an unknown planet from a pendulum timed the same way.
 * g = 9,8 m/s², data with two significant figures, answers with two, never too close to a rounding boundary.
 * Distractors from the lesson's warnings: the mass and the constant swapped, the mass in the pendulum's period, the
 * missing 2π, the period not squared, the time of all the oscillations taken for the period.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, generateWith, r2 } from '../fisica-equilibrio';
import { G, cut4, datum, fallU, optU, optsU, pu, qu, r2p } from '../fis-forze-movimento';

export const ID = 'fis-pendolo-molla';
const PI2 = 2 * Math.PI;
const PI4 = 4 * Math.PI * Math.PI;

const tinyOrSmall = (rng: Rng) => datum(rng, rng.next() < 0.5 ? 'tiny' : 'small');

// ---------------------------------------------------------------------------
// Level 1: the spring

function level1(rng: Rng): Built {
	for (;;) {
		const m = tinyOrSmall(rng), k = datum(rng, 'big');
		const M = Number(m), K = Number(k);
		const T = PI2 * Math.sqrt(M / K);
		const ans = r2(T);
		if (ans === null) continue;
		return {
			prompt: 'Trova il periodo.',
			problem: textBlock(`Un blocco di ${pu(m, 'kg')}, attaccato a una molla di costante elastica ${pu(k, 'N/m')}, oscilla su un piano orizzontale liscio. Quanto vale il periodo delle oscillazioni?`),
			solution: `T \\approx ${qu(ans, 's')}`,
			steps: [`T = 2\\pi\\sqrt{\\dfrac{m}{k}} = 2\\pi\\sqrt{\\dfrac{${qu(m, 'kg')}}{${qu(k, 'N/m')}}} = ${cut4(T)}\\,\\text{s} \\approx ${qu(ans, 's')}`],
			// the mass and the constant swapped; the missing 2π; no square root
			answer: choiceOf(rng, optU(ans, 's'), optsU([r2p(PI2 * Math.sqrt(K / M)), r2p(Math.sqrt(M / K)), r2p((PI2 * M) / K)], 's'), fallU(T, 's')),
			params: { m, k },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the pendulum

function level2(rng: Rng): Built {
	for (;;) {
		const l = tinyOrSmall(rng), grams = datum(rng, 'big');
		const L = Number(l), mkg = Number(grams) / 1000;
		const T = PI2 * Math.sqrt(L / G);
		const ans = r2(T);
		if (ans === null) continue;
		return {
			prompt: 'Trova il periodo.',
			problem: textBlock(`Un pendolo è formato da una pallina di ${pu(grams, 'g')} appesa a un filo lungo ${pu(l, 'm')}. Quanto vale il periodo delle piccole oscillazioni?`),
			solution: `T \\approx ${qu(ans, 's')}`,
			steps: [t('Il periodo del pendolo non dipende dalla massa:'), `T = 2\\pi\\sqrt{\\dfrac{l}{g}} = 2\\pi\\sqrt{\\dfrac{${qu(l, 'm')}}{9{,}8\\,\\text{m/s}^2}} = ${cut4(T)}\\,\\text{s} \\approx ${qu(ans, 's')}`],
			// l and g swapped; the missing 2π; the mass under the root
			answer: choiceOf(rng, optU(ans, 's'), optsU([r2p(PI2 * Math.sqrt(G / L)), r2p(Math.sqrt(L / G)), r2p(PI2 * Math.sqrt(L / (mkg * G)))], 's'), fallU(T, 's')),
			params: { l, grams },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: what changes the period

const FACTOR: Record<number, string> = { 2: 'doppia', 3: 'tripla', 4: 'quadrupla' };
type Change = 'pendolo-lunghezza' | 'pendolo-massa' | 'pendolo-ampiezza' | 'molla-massa' | 'molla-costante';
const CHANGES: Change[] = ['pendolo-lunghezza', 'pendolo-massa', 'pendolo-ampiezza', 'molla-massa', 'molla-costante'];

function level3(rng: Rng): Built {
	const change = rng.pick(CHANGES);
	for (;;) {
		const T0 = tinyOrSmall(rng);
		const P = Number(T0);
		const k = rng.pick([2, 3, 4]);
		const pendulum = change.startsWith('pendolo');
		const who = pendulum ? 'Un pendolo oscilla' : 'Un blocco attaccato a una molla oscilla';
		const what = {
			'pendolo-lunghezza': `si usa un filo di lunghezza ${FACTOR[k]}`,
			'pendolo-massa': `si usa una pallina di massa ${FACTOR[k]}`,
			'pendolo-ampiezza': `si fa partire il pendolo da un angolo di $${2 * k}^\\circ$ invece che di $2^\\circ$`,
			'molla-massa': `si usa un blocco di massa ${FACTOR[k]}`,
			'molla-costante': `si usa una molla con la costante elastica ${FACTOR[k]}`,
		}[change];
		const factor = change === 'pendolo-lunghezza' || change === 'molla-massa' ? Math.sqrt(k) : change === 'molla-costante' ? 1 / Math.sqrt(k) : 1;
		const exact = P * factor;
		const ans = r2(exact);
		if (ans === null || exact < 0.1) continue;
		const why = {
			'pendolo-lunghezza': `La lunghezza sta sotto la radice: il periodo si moltiplica per $\\sqrt{${k}}$.`,
			'pendolo-massa': 'Il periodo del pendolo non dipende dalla massa.',
			'pendolo-ampiezza': "Per oscillazioni piccole il periodo non dipende dall'ampiezza.",
			'molla-massa': `La massa sta sotto la radice: il periodo si moltiplica per $\\sqrt{${k}}$.`,
			'molla-costante': `La costante sta sotto la radice, al denominatore: il periodo si divide per $\\sqrt{${k}}$.`,
		}[change];
		return {
			prompt: 'Trova il nuovo periodo.',
			problem: textBlock(`${who} con un periodo di ${pu(T0, 's')}. Se ${what}, quanto diventa il periodo?`),
			solution: `T \\approx ${qu(ans, 's')}`,
			steps: [t(why), factor === 1 ? `T = ${qu(T0, 's')}` : `T = ${qu(T0, 's')} ${factor > 1 ? '\\cdot' : '/'} \\sqrt{${k}} = ${cut4(exact)}\\,\\text{s} \\approx ${qu(ans, 's')}`],
			// the other factors: √k, k, unchanged, 1/√k, 1/k
			answer: choiceOf(rng, optU(ans, 's'), optsU([r2p(P * Math.sqrt(k)), r2p(P * k), T0, r2p(P / Math.sqrt(k)), r2p(P / k)], 's'), fallU(exact, 's')),
			params: { case: change, T0, k },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: from the period to the spring constant or to the length

function level4(rng: Rng): Built {
	const spring = rng.next() < 0.5;
	for (;;) {
		const n = rng.pick([10, 20]);
		const tt = datum(rng, rng.next() < 0.5 ? 'small' : 'big');
		const TT = Number(tt);
		const P = TT / n;
		const intro = spring ? 'Un blocco di ' : '';
		if (spring) {
			const m = tinyOrSmall(rng);
			const M = Number(m);
			const k = (PI4 * M) / (P * P);
			const ans = r2(k);
			if (ans === null || k < 1 || k > 99) continue;
			return {
				prompt: 'Trova la costante elastica.',
				problem: textBlock(`${intro}${pu(m, 'kg')}, appeso a una molla, compie ${n} oscillazioni complete in ${pu(tt, 's')}. Quanto vale la costante elastica della molla?`),
				solution: `k \\approx ${qu(ans, 'N/m')}`,
				steps: [
					`T = \\dfrac{${qu(tt, 's')}}{${n}} = ${cut4(P)}\\,\\text{s}`,
					t('Dalla formula del periodo, elevando al quadrato:'),
					`k = \\dfrac{4\\pi^2 m}{T^2} = \\dfrac{4\\pi^2 \\cdot ${qu(m, 'kg')}}{(${cut4(P)}\\,\\text{s})^2} = ${cut4(k)}\\,\\text{N/m} \\approx ${qu(ans, 'N/m')}`,
				],
				// the period not squared; the total time for the period; 2π for 4π²
				answer: choiceOf(rng, optU(ans, 'N/m'), optsU([r2p((PI4 * M) / P), r2p((PI4 * M) / (TT * TT)), r2p((PI2 * M) / (P * P))], 'N/m'), fallU(k, 'N/m')),
				params: { case: 'molla', m, n, t: tt },
			};
		}
		const l = (G * P * P) / PI4;
		const ans = r2(l);
		if (ans === null || l < 0.1 || l > 9.9) continue;
		return {
			prompt: 'Trova la lunghezza del filo.',
			problem: textBlock(`Un pendolo compie ${n} piccole oscillazioni complete in ${pu(tt, 's')}. Quanto è lungo il filo?`),
			solution: `l \\approx ${qu(ans, 'm')}`,
			steps: [
				`T = \\dfrac{${qu(tt, 's')}}{${n}} = ${cut4(P)}\\,\\text{s}`,
				t('Dalla formula del periodo, elevando al quadrato:'),
				`l = \\dfrac{g\\,T^2}{4\\pi^2} = \\dfrac{9{,}8\\,\\text{m/s}^2 \\cdot (${cut4(P)}\\,\\text{s})^2}{4\\pi^2} = ${cut4(l)}\\,\\text{m} \\approx ${qu(ans, 'm')}`,
			],
			// the period not squared; 2π for 4π²; the total time for the period
			answer: choiceOf(rng, optU(ans, 'm'), optsU([r2p((G * P) / PI2), r2p((G * P * P) / PI2), r2p((G * TT * TT) / PI4)], 'm'), fallU(l, 'm')),
			params: { case: 'pendolo', n, t: tt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: g on an unknown planet

function level5(rng: Rng): Built {
	for (;;) {
		const n = rng.pick([10, 20]);
		const l = tinyOrSmall(rng), tt = datum(rng, 'big');
		const L = Number(l), TT = Number(tt);
		const P = TT / n;
		const g = (PI4 * L) / (P * P);
		const ans = r2(g);
		if (ans === null || g < 0.5 || g > 30) continue;
		return {
			prompt: "Trova l'accelerazione di gravità.",
			problem: textBlock(`Su un pianeta sconosciuto un pendolo lungo ${pu(l, 'm')} compie ${n} piccole oscillazioni complete in ${pu(tt, 's')}. Quanto vale l'accelerazione di gravità sul pianeta?`),
			solution: `g \\approx ${qu(ans, 'm/s2')}`,
			steps: [
				`T = \\dfrac{${qu(tt, 's')}}{${n}} = ${cut4(P)}\\,\\text{s}`,
				t('Dalla formula del periodo, elevando al quadrato:'),
				`g = \\dfrac{4\\pi^2 l}{T^2} = \\dfrac{4\\pi^2 \\cdot ${qu(l, 'm')}}{(${cut4(P)}\\,\\text{s})^2} = ${cut4(g)}\\,\\text{m/s}^2 \\approx ${qu(ans, 'm/s2')}`,
			],
			// the period not squared; the total time for the period; 2π for 4π²
			answer: choiceOf(rng, optU(ans, 'm/s2'), optsU([r2p((PI4 * L) / P), r2p((PI4 * L) / (TT * TT)), r2p((PI2 * L) / (P * P))], 'm/s2'), fallU(g, 'm/s2')),
			params: { l, n, t: tt },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisPendoloMolla: Generator = {
	id: ID,
	title: 'Il pendolo e la molla',
	levels: {
		1: { label: 'Il periodo della molla', constraints: ['T = 2π √(m/k)'] },
		2: { label: 'Il periodo del pendolo', constraints: ['T = 2π √(l/g)', 'la massa è data e non serve'] },
		3: { label: 'Che cosa cambia il periodo', constraints: ['lunghezza, massa, ampiezza o costante elastica per 2, 3 o 4'] },
		4: { label: 'Dal periodo alla molla o al filo', constraints: ['10 o 20 oscillazioni cronometrate insieme', 'costante elastica o lunghezza, metà ciascuna'] },
		5: { label: 'Misurare g', constraints: ['un pendolo su un pianeta sconosciuto', 'g tra 0,5 e 30 m/s²'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisPendoloMolla;
