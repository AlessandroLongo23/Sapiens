/**
 * La forza centripeta. Spec: specs/exercises/fis-forza-centripeta.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/57-fis-forza-centripeta.md), each one step harder: the
 * tension of a thread that keeps a ball on a circle, m v²/r; the same from the period, 4π² m r/T²; the highest speed of
 * a car on a flat curve, √(μs g r); a disc on a table held by a hanging mass through a hole, √(M g r/m); the top of a
 * vertical circle, where weight and tension both point to the centre: the least speed √(g r), or the tension
 * m v²/r − m g. g = 9,8 m/s², data with two significant figures, answers with two, never too close to a rounding
 * boundary. Distractors from the lesson's warnings: the speed not squared, the acceleration given as the force, the
 * period not squared, the weight forgotten or added.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, decTex, t } from '../vettori';
import { type Built, checkCommon, generateWith, r2 } from '../fisica-equilibrio';
import { G, coeffOf, cut4, datum, fallU, optU, optsU, pu, qu, r2p } from '../fis-forze-movimento';

export const ID = 'fis-forza-centripeta';

const tinyOrSmall = (rng: Rng) => datum(rng, rng.next() < 0.5 ? 'tiny' : 'small');

// ---------------------------------------------------------------------------
// Level 1: m v² / r

function level1(rng: Rng): Built {
	for (;;) {
		const m = datum(rng, 'tiny'), v = datum(rng, 'small'), r = tinyOrSmall(rng);
		const M = Number(m), V = Number(v), R = Number(r);
		const F = (M * V * V) / R;
		const ans = r2(F);
		if (ans === null || F < 0.1 || F > 99) continue;
		return {
			prompt: 'Trova la tensione del filo.',
			problem: textBlock(`Una pallina di ${pu(m, 'kg')}, legata a un filo, gira su un tavolo orizzontale liscio lungo una circonferenza di raggio ${pu(r, 'm')}, a ${pu(v, 'm/s')}. Quanto vale la tensione del filo?`),
			solution: `T \\approx ${qu(ans, 'N')}`,
			steps: [t('La tensione è la sola forza orizzontale: fa da forza centripeta.'), `T = m\\,\\dfrac{v^2}{r} = ${qu(m, 'kg')} \\cdot \\dfrac{(${qu(v, 'm/s')})^2}{${qu(r, 'm')}} = ${cut4(F)}\\,\\text{N} \\approx ${qu(ans, 'N')}`],
			// the speed not squared; the acceleration for the force; r at the numerator
			answer: choiceOf(rng, optU(ans, 'N'), optsU([r2p((M * V) / R), r2p((V * V) / R), r2p(M * V * V * R)], 'N'), fallU(F, 'N')),
			params: { m, v, r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: from the period

function level2(rng: Rng): Built {
	for (;;) {
		const m = datum(rng, 'tiny'), r = tinyOrSmall(rng), T = tinyOrSmall(rng);
		const M = Number(m), R = Number(r), P = Number(T);
		const F = (4 * Math.PI * Math.PI * M * R) / (P * P);
		const ans = r2(F);
		if (ans === null || F < 0.1 || F > 99) continue;
		const v = (2 * Math.PI * R) / P;
		return {
			prompt: 'Trova la forza centripeta.',
			problem: textBlock(`Una pallina di ${pu(m, 'kg')}, legata a un filo, gira su un tavolo orizzontale liscio lungo una circonferenza di raggio ${pu(r, 'm')}, e compie un giro ogni ${pu(T, 's')}. Quanto vale la tensione del filo?`),
			solution: `F_c \\approx ${qu(ans, 'N')}`,
			steps: [
				t('La velocità è la circonferenza divisa per il periodo:'),
				`v = \\dfrac{2\\pi r}{T} = \\dfrac{2\\pi \\cdot ${qu(r, 'm')}}{${qu(T, 's')}} = ${cut4(v)}\\,\\text{m/s}`,
				`F_c = m\\,\\dfrac{v^2}{r} = \\dfrac{4\\pi^2 m\\,r}{T^2} = ${cut4(F)}\\,\\text{N} \\approx ${qu(ans, 'N')}`,
			],
			// the period not squared; 2π for 4π²; the speed not squared
			answer: choiceOf(rng, optU(ans, 'N'), optsU([r2p((4 * Math.PI * Math.PI * M * R) / P), r2p((2 * Math.PI * M * R) / (P * P)), r2p((M * v) / R)], 'N'), fallU(F, 'N')),
			params: { m, r, T },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the car on a flat curve

function level3(rng: Rng): Built {
	for (;;) {
		const r = datum(rng, 'big');
		const mu = coeffOf(rng, 20, 99);
		const R = Number(r), k = Number(mu);
		const vmax = Math.sqrt(k * G * R);
		const ans = r2(vmax);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità massima.',
			problem: textBlock(`Un'auto percorre una curva piana di raggio ${pu(r, 'm')}; tra le gomme e l'asfalto $\\mu_s = ${decTex(mu)}$. Qual è la velocità più alta con cui può affrontare la curva senza slittare?`),
			solution: `v_{max} \\approx ${qu(ans, 'm/s')}`,
			steps: [
				t("La forza centripeta è l'attrito statico, al massimo mu s m g; la massa si semplifica:"),
				`m\\,\\dfrac{v^2}{r} = \\mu_s\\,m\\,g \\quad\\Rightarrow\\quad v_{max} = \\sqrt{\\mu_s\\,g\\,r} = \\sqrt{${decTex(mu)} \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${qu(r, 'm')}} = ${cut4(vmax)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`,
			],
			// friction forgotten; no square root; mu outside the root
			answer: choiceOf(rng, optU(ans, 'm/s'), optsU([r2p(Math.sqrt(G * R)), r2p(k * G * R), r2p(k * Math.sqrt(G * R))], 'm/s'), fallU(vmax, 'm/s')),
			params: { r, mus: mu },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the disc and the hanging mass

function level4(rng: Rng): Built {
	for (;;) {
		const m = datum(rng, 'tiny'), Mh = datum(rng, 'tiny'), r = datum(rng, 'tiny');
		const md = Number(m), mh = Number(Mh), R = Number(r);
		const Tn = mh * G;
		const v = Math.sqrt((Tn * R) / md);
		const ans = r2(v);
		if (ans === null || v < 0.5) continue;
		return {
			prompt: 'Trova la velocità del disco.',
			problem: textBlock(
				`Un disco di ${pu(m, 'kg')} scivola su un tavolo a cuscino d'aria, legato a un filo che passa per un foro al centro del tavolo e regge un pesetto di ${pu(Mh, 'kg')}, fermo. Il disco gira su una circonferenza di raggio ${pu(r, 'm')}. Con quale velocità?`,
			),
			solution: `v \\approx ${qu(ans, 'm/s')}`,
			steps: [
				t('Il pesetto è fermo: il filo lo tira con il suo peso, e con la stessa tensione tira il disco verso il centro.'),
				`T = M\\,g = ${qu(Mh, 'kg')} \\cdot 9{,}8\\,\\text{m/s}^2 = ${cut4(Tn)}\\,\\text{N}`,
				`m\\,\\dfrac{v^2}{r} = T \\quad\\Rightarrow\\quad v = \\sqrt{\\dfrac{T\\,r}{m}} = ${cut4(v)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`,
			],
			// the disc's mass forgotten; the masses swapped; no square root
			answer: choiceOf(rng, optU(ans, 'm/s'), optsU([r2p(Math.sqrt(Tn * R)), r2p(Math.sqrt((md * G * R) / mh)), r2p((Tn * R) / md)], 'm/s'), fallU(v, 'm/s')),
			params: { m, M: Mh, r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the top of a vertical circle

function level5(rng: Rng): Built {
	const askSpeed = rng.next() < 0.5;
	for (;;) {
		const r = tinyOrSmall(rng);
		const R = Number(r);
		if (askSpeed) {
			const v = Math.sqrt(G * R);
			const ans = r2(v);
			if (ans === null) continue;
			return {
				prompt: 'Trova la velocità minima.',
				problem: textBlock(`Un secchio d'acqua viene fatto girare in verticale, su una circonferenza di raggio ${pu(r, 'm')}. Qual è la velocità più piccola che deve avere nel punto più alto perché l'acqua non cada?`),
				solution: `v_{min} \\approx ${qu(ans, 'm/s')}`,
				steps: [
					t('In cima il peso e la tensione puntano tutti e due verso il centro:'),
					`T + m\\,g = m\\,\\dfrac{v^2}{r}`,
					t('La velocità più piccola è quella con la tensione zero, quando basta il peso:'),
					`v_{min} = \\sqrt{g\\,r} = \\sqrt{9{,}8\\,\\text{m/s}^2 \\cdot ${qu(r, 'm')}} = ${cut4(v)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`,
				],
				// 2 g r under the root (a fall from the top); no root; g over r
				answer: choiceOf(rng, optU(ans, 'm/s'), optsU([r2p(Math.sqrt(2 * G * R)), r2p(G * R), r2p(Math.sqrt(G / R))], 'm/s'), fallU(v, 'm/s')),
				params: { case: 'velocita', r },
			};
		}
		const m = datum(rng, 'tiny'), v = datum(rng, 'small');
		const M = Number(m), V = Number(v);
		if (V * V < 1.3 * G * R) continue;
		const T = (M * V * V) / R - M * G;
		const ans = r2(T);
		if (ans === null || T < 0.1 || T > 99) continue;
		return {
			prompt: 'Trova la tensione in cima.',
			problem: textBlock(`Una pallina di ${pu(m, 'kg')}, legata a un filo lungo ${pu(r, 'm')}, gira in verticale. Nel punto più alto ha una velocità di ${pu(v, 'm/s')}. Quanto vale lì la tensione del filo?`),
			solution: `T \\approx ${qu(ans, 'N')}`,
			steps: [
				t('In cima il peso e la tensione puntano tutti e due verso il centro, e insieme fanno da forza centripeta:'),
				`T + m\\,g = m\\,\\dfrac{v^2}{r} \\quad\\Rightarrow\\quad T = m\\,\\dfrac{v^2}{r} - m\\,g = ${cut4((M * V * V) / R)}\\,\\text{N} - ${cut4(M * G)}\\,\\text{N} = ${cut4(T)}\\,\\text{N} \\approx ${qu(ans, 'N')}`,
			],
			// the weight forgotten; the weight added (the bottom of the circle); the weight alone
			answer: choiceOf(rng, optU(ans, 'N'), optsU([r2p((M * V * V) / R), r2p((M * V * V) / R + M * G), r2p(M * G)], 'N'), fallU(T, 'N')),
			params: { case: 'tensione', m, r, v },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisForzaCentripeta: Generator = {
	id: ID,
	title: 'La forza centripeta',
	levels: {
		1: { label: 'La forza centripeta', constraints: ['F = m v² / r', 'forze tra 0,1 e 99 N'] },
		2: { label: 'Dal periodo', constraints: ['v = 2π r / T'] },
		3: { label: "L'auto in curva", constraints: ['curva piana, attrito statico', 'v = √(μs g r)'] },
		4: { label: 'Il disco e il pesetto', constraints: ['la tensione è il peso del pesetto fermo'] },
		5: { label: 'In cima al giro', constraints: ['velocità minima o tensione, metà ciascuna'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisForzaCentripeta;
