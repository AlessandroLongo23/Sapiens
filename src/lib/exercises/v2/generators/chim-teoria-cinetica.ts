/**
 * La teoria cinetico-molecolare. Spec: specs/exercises/chim-teoria-cinetica.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/29-chim-teoria-cinetica.md), each one step harder: a
 * temperature from Celsius to kelvin or back; which statement about the model of the ideal gas is true (or false);
 * how the mean kinetic energy changes when a gas is heated from t1 to t2 degrees Celsius (the ratio of the absolute
 * temperatures); how many times the particles of a light gas are faster than those of a heavy one at the same
 * temperature (√ of the mass ratio); which of four samples, gases at different temperatures, has the largest mean
 * kinetic energy or the fastest particles. Distractors from the lesson's warnings: 273 subtracted or the sign lost,
 * the ratio of the Celsius temperatures, the mass ratio without the square root, the temperature taken for the speed.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, answerOf, checkChoice, choiceOf, generateWith, intAnswer, pq, shuffle, sig, t, tex, textBlock, wordsOpt } from '../chim-gas';

export const ID = 'chim-teoria-cinetica';

// ---------------------------------------------------------------------------
// Level 1: Celsius and kelvin

function level1(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const tc = rng.int(-200, 400);
		if (tc === 0 || Math.abs(tc) < 5) throw new Error('retry');
		const T = tc + 273;
		return {
			prompt: 'Passa dai gradi Celsius ai kelvin.',
			problem: textBlock(`Quanto vale una temperatura di ${pq(String(tc), 'C')} nella scala Kelvin?`),
			solution: `T = ${T}\\,\\text{K}`,
			steps: [t('Alla temperatura in gradi Celsius si somma 273:'), `T = t + 273 = ${tc} + 273 = ${T}\\,\\text{K}`],
			// 273 subtracted; the sign of t lost; a wrong constant
			answer: intAnswer(rng, T, [tc - 273, 273 - tc, tc + 373], 'K', [T + 10, T - 10, T + 20, T - 20]),
			params: { case: 'kelvin', t: tc },
		};
	}
	const T = rng.int(20, 800);
	const tc = T - 273;
	if (Math.abs(tc) < 5) throw new Error('retry');
	return {
		prompt: 'Passa dai kelvin ai gradi Celsius.',
		problem: textBlock(`Quanto vale una temperatura di ${pq(String(T), 'K')} in gradi Celsius?`),
		solution: `t = ${tc}\\,^\\circ\\text{C}`,
		steps: [t('Alla temperatura assoluta si tolgono 273:'), `t = T - 273 = ${T} - 273 = ${tc}\\,^\\circ\\text{C}`],
		// 273 added; the subtraction the wrong way round; a wrong constant
		answer: intAnswer(rng, tc, [T + 273, 273 - T, T - 373], 'C', [tc + 10, tc - 10, tc + 20, tc - 20]),
		params: { case: 'celsius', T },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the model

/** True statements about the ideal gas (lesson 29, "Il modello del gas"), and false ones from students' mistakes. */
export const TRUE = [
	'Il volume delle particelle è trascurabile rispetto a quello del recipiente',
	"Le particelle si muovono in linea retta tra un urto e l'altro",
	"Tra un urto e l'altro le particelle non si attraggono",
	"Negli urti l'energia cinetica totale delle particelle non cambia",
	"L'energia cinetica media delle particelle è proporzionale alla temperatura assoluta",
	"Tra una particella e l'altra c'è spazio vuoto",
	'Le particelle non hanno tutte la stessa velocità',
];
export const FALSE = [
	'Le particelle di un gas sono ferme',
	"Tra una particella e l'altra c'è aria",
	'Le particelle si attraggono con forze intense',
	'Tutte le particelle hanno la stessa velocità',
	"L'energia cinetica media è proporzionale alla temperatura in gradi Celsius",
	'Negli urti le particelle perdono energia e si fermano',
	'Le particelle occupano quasi tutto il volume del recipiente',
	'Scaldando il gas le particelle diventano più grandi',
];

function level2(rng: Rng): Built {
	const askTrue = rng.next() < 0.5;
	const [one, many] = askTrue ? [TRUE, FALSE] : [FALSE, TRUE];
	const right = rng.int(0, one.length - 1);
	const others = shuffle(rng, many.map((_, i) => i)).slice(0, 3);
	const tag = askTrue ? 'V' : 'F';
	const otherTag = askTrue ? 'F' : 'V';
	const answer = choiceOf(
		rng,
		wordsOpt(`${one[right]}.`, `${tag}${right}`),
		others.map((i) => wordsOpt(`${many[i]}.`, `${otherTag}${i}`)),
	);
	return {
		prompt: askTrue ? "Trova l'affermazione vera." : "Trova l'affermazione falsa.",
		problem: textBlock(askTrue ? 'Quale affermazione è vera per il modello del gas ideale della teoria cinetico-molecolare?' : 'Quale affermazione è falsa per il modello del gas ideale della teoria cinetico-molecolare?'),
		solution: answer.options[answer.correct].latex,
		steps: [textBlock(askTrue ? "Le altre tre sono errori frequenti: nel modello le particelle si muovono di continuo, tra loro c'è il vuoto, non si attraggono e gli urti sono elastici." : 'Le altre tre sono ipotesi del modello o loro conseguenze.')],
		answer,
		params: { case: askTrue ? 'vera' : 'falsa', right, others },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the mean kinetic energy

const RATIOS = [0.5, 0.75, 1.25, 1.5, 2, 2.5, 3, 4];

function level3(rng: Rng): Built {
	const T1 = rng.int(20, 90) * 5;
	const k = rng.pick(RATIOS);
	const T2 = T1 * k;
	if (!Number.isInteger(T2) || T2 < 100 || T2 > 1500) throw new Error('retry');
	const t1 = T1 - 273, t2 = T2 - 273;
	if (t1 === 0 || Math.abs(t1) < 5 || Math.abs(t2) < 5) throw new Error('retry');
	const right = sig(k, 3);
	if (!right) throw new Error('retry');
	return {
		prompt: "Trova come cambia l'energia cinetica media.",
		problem: textBlock(`Un gas viene portato da ${pq(String(t1), 'C')} a ${pq(String(t2), 'C')}. Per quale numero viene moltiplicata l'energia cinetica media delle sue particelle?`),
		solution: `\\dfrac{\\overline{E_c}\\,'}{\\overline{E_c}} = ${right.tex}`,
		steps: [
			t("L'energia cinetica media è proporzionale alla temperatura assoluta: si passa ai kelvin."),
			`T_1 = ${t1} + 273 = ${T1}\\,\\text{K} \\qquad T_2 = ${t2} + 273 = ${T2}\\,\\text{K}`,
			`\\dfrac{T_2}{T_1} = \\dfrac{${T2}}{${T1}} = ${right.tex}`,
		],
		// the ratio of the Celsius temperatures; the ratio upside down; the square root (the speeds)
		answer: answerOf(rng, right, k, [t2 / t1, 1 / k, Math.sqrt(k)], 3, 'n', [k + 1, k * 2, k + 0.5, k / 2]),
		params: { case: k > 1 ? 'scalda' : 'raffredda', t1, t2 },
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: light and heavy particles

export const GASES = [
	{ f: 'H_2', M: '2.02', atom: false },
	{ f: 'He', M: '4.00', atom: true },
	{ f: 'CH_4', M: '16.05', atom: false },
	{ f: 'NH_3', M: '17.04', atom: false },
	{ f: 'N_2', M: '28.02', atom: false },
	{ f: 'O_2', M: '32.00', atom: false },
	{ f: 'Ar', M: '39.95', atom: true },
	{ f: 'CO_2', M: '44.01', atom: false },
	{ f: 'SO_2', M: '64.07', atom: false },
	{ f: 'Cl_2', M: '70.90', atom: false },
];
type Gas = (typeof GASES)[number];
const mf = (g: Gas) => `$\\mathrm{${g.f}}$`;
const masses = (gs: Gas[]) => `Masse relative: ${gs.map((g) => `${mf(g)} $${tex(g.M)}$`).join(', ')}.`;

function level4(rng: Rng): Built {
	const [a, b] = shuffle(rng, GASES).slice(0, 2).sort((x, y) => Number(x.M) - Number(y.M));
	const MA = Number(a.M), MB = Number(b.M);
	const r = Math.sqrt(MB / MA);
	const ans = sig(r, 2);
	if (!ans || r < 1.15) throw new Error('retry');
	return {
		prompt: 'Confronta le velocità delle particelle.',
		problem: textBlock(`Due gas, ${mf(a)} e ${mf(b)}, sono alla stessa temperatura. Quante volte le particelle di ${mf(a)} sono in media più veloci di quelle di ${mf(b)}? ${masses([a, b])}`),
		solution: `\\dfrac{v_{\\mathrm{${a.f}}}}{v_{\\mathrm{${b.f}}}} \\approx ${ans.tex}`,
		steps: [
			textBlock("Alla stessa temperatura l'energia cinetica media è la stessa, quindi $m\\,v^2$ è lo stesso:"),
			`\\dfrac{v_{\\mathrm{${a.f}}}}{v_{\\mathrm{${b.f}}}} = \\sqrt{\\dfrac{${tex(b.M)}}{${tex(a.M)}}} = \\sqrt{${tex((MB / MA).toFixed(3))}\\ldots} \\approx ${ans.tex}`,
		],
		// the mass ratio without the root; the root upside down
		answer: answerOf(rng, ans, r, [MB / MA, 1 / r], 2, 'n'),
		params: { case: 'velocita', a: a.f, b: b.f },
	};
}

function level5(rng: Rng): Built {
	const energy = rng.next() < 0.5;
	const gs = shuffle(rng, GASES).slice(0, 4);
	const Ts = shuffle(rng, Array.from({ length: 16 }, (_, i) => 150 + 50 * i)).slice(0, 4);
	const score = (i: number) => (energy ? Ts[i] : Math.sqrt(Ts[i] / Number(gs[i].M)));
	const order = [0, 1, 2, 3].sort((i, j) => score(j) - score(i));
	const best = order[0];
	if (score(order[1]) > score(best) * 0.95) throw new Error('retry');
	// the trap: the hottest sample is not the fastest, or the lightest gas is not the most energetic
	const hottest = [0, 1, 2, 3].reduce((m, i) => (Ts[i] > Ts[m] ? i : m), 0);
	const lightest = [0, 1, 2, 3].reduce((m, i) => (Number(gs[i].M) < Number(gs[m].M) ? i : m), 0);
	if (energy ? lightest === best : hottest === best) throw new Error('retry');
	const label = (i: number) => `${mf(gs[i])} a $${Ts[i]}\\,\\text{K}$`;
	const options = [0, 1, 2, 3].map((i) => wordsOpt(label(i), `${gs[i].f}@${Ts[i]}`));
	const answer = choiceOf(rng, options[best], options.filter((_, i) => i !== best));
	return {
		prompt: energy ? "Trova il campione con l'energia cinetica media più grande." : 'Trova il campione con le particelle più veloci.',
		problem: textBlock(
			`Quattro campioni di gas: ${[0, 1, 2, 3].map(label).join(', ')}. In quale campione le particelle hanno ${energy ? "l'energia cinetica media più grande" : 'la velocità media più grande'}? ${masses(gs)}`,
		),
		solution: answer.options[answer.correct].latex,
		steps: energy
			? [textBlock("L'energia cinetica media dipende solo dalla temperatura assoluta, non dal gas: vince il campione più caldo.")]
			: [
					textBlock('A parità di energia le particelle leggere sono più veloci: la velocità media cresce come la radice di T diviso la massa.'),
					[0, 1, 2, 3].map((i) => `\\sqrt{\\tfrac{${Ts[i]}}{${tex(gs[i].M)}}} = ${tex(Math.sqrt(Ts[i] / Number(gs[i].M)).toFixed(2))}`).join(' \\quad '),
				],
		answer,
		params: { case: energy ? 'energia' : 'velocita', gases: gs.map((g) => g.f), T: Ts },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimTeoriaCinetica: Generator = {
	id: ID,
	title: 'La teoria cinetico-molecolare',
	levels: {
		1: { label: 'Celsius e kelvin', constraints: ['da gradi Celsius a kelvin o ritorno', 'T = t + 273'] },
		2: { label: 'Le ipotesi del modello', constraints: ["l'affermazione vera o quella falsa"] },
		3: { label: "Temperatura ed energia", constraints: ['temperature in gradi Celsius', "rapporto dell'energia media"] },
		4: { label: 'Particelle leggere e pesanti', constraints: ['due gas alla stessa temperatura', 'radice del rapporto delle masse'] },
		5: { label: 'Quale campione', constraints: ['quattro gas a temperature diverse', 'energia media o velocità media'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimTeoriaCinetica;

