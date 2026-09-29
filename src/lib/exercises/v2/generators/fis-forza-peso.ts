/**
 * La forza-peso e la massa. Spec: specs/exercises/fis-forza-peso.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/17-fis-forza-peso.md): the weight from the mass in
 * kilograms; the mass from the weight read on a spring balance (a scene); the weight from a mass in grams; the weight
 * on the Moon or on another planet; from the weight on one body to the weight on another. P = m g with g = 9,8 N/kg on
 * the Earth and the lesson's table (NASA Planetary Fact Sheet) elsewhere. Data with two significant figures, answers
 * rounded to two (never a tie), multiple choice with the unit in the option and the lesson's mistakes: mass and
 * weight confused, the formula upside down, grams not converted, the Earth's g on another planet.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { q } from '../rational';
import { type Built, type R, choiceFor, commonCheck, dec, fixed, generateWith, isTie, n, roundSig, sig, t, withUnit } from '../fisica-forze';

export const ID = 'fis-forza-peso';

const G = q(98, 10);
const S2 = { kind: 'sig', s: 2 } as const;
const u = (r: R, unit: string) => withUnit(sig(r, 2), unit);
const pu = (r: R, unit: string) => `$${u(r, unit)}$`;

/** g of the lesson's table, N/kg. */
export const BODIES = {
	terra: { g: q(98, 10), on: 'sulla Terra' },
	luna: { g: q(16, 10), on: 'sulla Luna' },
	marte: { g: q(37, 10), on: 'su Marte' },
	venere: { g: q(89, 10), on: 'su Venere' },
	giove: { g: q(231, 10), on: 'su Giove' },
	saturno: { g: q(90, 10), on: 'su Saturno' },
	nettuno: { g: q(110, 10), on: 'su Nettuno' },
} as const;
type Body = keyof typeof BODIES;
const gTex = (b: Body) => withUnit(dec(BODIES[b].g).replace(/^(\d+)$/, '$1{,}0'), 'N/kg');

const THINGS = ['Uno zaino', 'Una cassa', 'Un secchio', 'Una valigia', 'Un pacco', 'Una borsa', 'Un cane', 'Una bicicletta'];

/** A mass with two significant figures: 1,0 to 9,9 kg, or 10 to 99 kg when `big`. */
const mass2 = (rng: Rng, big: boolean) => (big ? n(rng.int(10, 99)) : q(rng.int(10, 99), 10));

// ---------------------------------------------------------------------------
// Level 1: the weight from the mass

function level1(rng: Rng): Built {
	for (;;) {
		const m = mass2(rng, false);
		const exact = m.mul(G);
		if (isTie(exact, 2)) continue;
		const P = roundSig(exact, 2);
		const who = rng.pick(THINGS);
		return {
			prompt: 'Calcola il peso.',
			problem: textBlock(`${who} ha la massa di ${pu(m, 'kg')}. Quanto pesa sulla Terra?`),
			solution: `P = ${u(P, 'N')}`,
			steps: [`P = m \\cdot g = ${sig(m, 2)}\\,\\text{kg} \\cdot 9{,}8\\,\\text{N/kg} = ${withUnit(dec(exact), 'N')}`, `${t('Con due cifre significative: ')} P \\approx ${u(P, 'N')}`],
			answer: P,
			unit: 'N',
			format: S2,
			// the mass taken for the weight; the formula upside down; ten times the weight
			mistakes: [m, m.div(G), P.mul(n(10))],
			params: { case: 'kg', m: m.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the mass from the weight read on a spring balance

/** Balances whose readings, from 1 N up, have two significant figures. */
const BALANCES = [
	{ portata: 5, divisioni: 25, ogni: 5, d: 1 },
	{ portata: 10, divisioni: 20, ogni: 4, d: 1 },
	{ portata: 20, divisioni: 20, ogni: 5, d: 0 },
	{ portata: 50, divisioni: 25, ogni: 5, d: 0 },
];

function level2(rng: Rng): Built {
	for (;;) {
		const b = rng.pick(BALANCES);
		const sens = q(b.portata, b.divisioni);
		const i = rng.int(1, b.divisioni - 1);
		const P = sens.mul(n(i));
		if (P.compare(n(1)) < 0 || (P.compare(n(10)) >= 0) !== (b.d === 0)) continue;
		const exact = P.div(G);
		if (isTie(exact, 2)) continue;
		const m = roundSig(exact, 2);
		const read = withUnit(fixed(P, b.d), 'N');
		return {
			prompt: 'Trova la massa.',
			problem: textBlock(`Un sacchetto è appeso al dinamometro della figura, che segna $${read}$. Qual è la massa del sacchetto?`),
			solution: `m = ${u(m, 'kg')}`,
			steps: [
				`P = m \\cdot g \\quad\\Rightarrow\\quad m = \\dfrac{P}{g}`,
				`m = \\dfrac{${read}}{9{,}8\\,\\text{N/kg}} \\approx ${u(m, 'kg')}`,
			],
			answer: m,
			unit: 'kg',
			format: S2,
			// the formula upside down; the weight taken for the mass; the mass in grams written as kilograms
			mistakes: [P.mul(G), P, m.mul(n(1000))],
			params: { case: 'dinamometro', P: P.toString(), ...b },
			scene: {
				type: 'dinamometro',
				data: { portata: b.portata, divisioni: b.divisioni, ogni: b.ogni, forza: P.num / P.den, oggetto: true },
				alt: `Un dinamometro appeso con la scala da 0 a ${b.portata} newton, divisa in ${b.divisioni} parti uguali, con un sacchetto appeso al gancio: l'indice segna ${fixed(P, b.d).replace('{,}', ',')} newton`,
			},
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: a mass in grams

function level3(rng: Rng): Built {
	for (;;) {
		const grams = 10 * rng.int(10, 99);
		const m = q(grams, 1000);
		const exact = m.mul(G);
		if (isTie(exact, 2)) continue;
		const P = roundSig(exact, 2);
		return {
			prompt: 'Calcola il peso.',
			problem: textBlock(`Quanto pesa sulla Terra un oggetto con la massa di $${withUnit(String(grams), 'g')}$?`),
			solution: `P = ${u(P, 'N')}`,
			steps: [
				`${t('La massa va in chilogrammi: ')} ${grams}\\,\\text{g} = ${withUnit(fixed(m, 3), 'kg')}`,
				`P = ${fixed(m, 3)}\\,\\text{kg} \\cdot 9{,}8\\,\\text{N/kg} = ${withUnit(dec(exact), 'N')} \\approx ${u(P, 'N')}`,
			],
			answer: P,
			unit: 'N',
			format: S2,
			// grams not converted; the mass in kilograms taken for the weight; the formula upside down
			mistakes: [n(grams).mul(G), m, m.div(G), P.mul(n(10))],
			params: { case: 'grammi', g: grams },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the weight on another body

const MASSES = [...Array.from({ length: 90 }, (_, i) => q(10 + i, 10)), ...Array.from({ length: 90 }, (_, i) => n(10 + i))];

const OTHERS: Body[] = ['luna', 'marte', 'venere', 'giove', 'saturno', 'nettuno'];

function level4(rng: Rng): Built {
	for (;;) {
		const b = rng.pick(OTHERS);
		// a mass with two significant figures whose weight there is between 1 and 99 N, so every body is as likely
		const ok = MASSES.filter((x) => x.mul(BODIES[b].g).compare(n(1)) >= 0 && x.mul(BODIES[b].g).compare(n(99)) <= 0);
		const m = rng.pick(ok);
		const exact = m.mul(BODIES[b].g);
		if (exact.compare(n(1)) < 0 || exact.compare(n(99)) > 0 || isTie(exact, 2)) continue;
		const P = roundSig(exact, 2);
		return {
			prompt: 'Calcola il peso.',
			problem: textBlock(`Un robot ha la massa di ${pu(m, 'kg')}. Quanto pesa ${BODIES[b].on}? (${BODIES[b].on.replace(/^(su|sulla) /, '')}: $g = ${gTex(b)}$)`),
			solution: `P = ${u(P, 'N')}`,
			steps: [`P = m \\cdot g = ${sig(m, 2)}\\,\\text{kg} \\cdot ${gTex(b)} = ${withUnit(dec(exact), 'N')} \\approx ${u(P, 'N')}`],
			answer: P,
			unit: 'N',
			format: S2,
			// the Earth's g; the formula upside down; the mass taken for the weight
			mistakes: [m.mul(G), m.div(BODIES[b].g), m],
			params: { case: b, m: m.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: from one body to another

function level5(rng: Rng): Built {
	for (;;) {
		const a = rng.pick(['terra', ...OTHERS] as Body[]);
		const b = rng.pick(['terra', ...OTHERS] as Body[]);
		if (a === b || (a !== 'terra' && b !== 'terra' && rng.next() < 0.5)) continue;
		const PA = mass2(rng, rng.next() < 0.6);
		const m = PA.div(BODIES[a].g);
		const exact = m.mul(BODIES[b].g);
		if (exact.compare(n(1)) < 0 || exact.compare(n(99)) > 0 || isTie(exact, 2)) continue;
		const PB = roundSig(exact, 2);
		const place = (x: Body) => BODIES[x].on;
		const given = [a, b].filter((x) => x !== 'terra').map((x) => `${place(x).replace(/^(su|sulla) /, '')}: $g = ${gTex(x)}$`);
		const mTex = sig(m, 3);
		return {
			prompt: 'Calcola il peso.',
			problem: textBlock(`Una sonda pesa ${pu(PA, 'N')} ${place(a)}. Quanto pesa ${place(b)}? (${given.join('; ')})`),
			solution: `P = ${u(PB, 'N')}`,
			steps: [
				`${t('La massa è la stessa: ')} m = \\dfrac{${sig(PA, 2)}\\,\\text{N}}{${gTex(a)}} \\approx ${mTex}\\,\\text{kg}`,
				`P = m \\cdot g \\approx ${mTex}\\,\\text{kg} \\cdot ${gTex(b)} \\approx ${u(PB, 'N')}${t(' (con la massa non arrotondata)')}`,
			],
			answer: PB,
			unit: 'N',
			format: S2,
			// the same weight; the ratio of the g upside down; the mass taken for the weight
			mistakes: [PA, PA.mul(BODIES[a].g).div(BODIES[b].g), m],
			params: { case: a === 'terra' || b === 'terra' ? 'con-la-terra' : 'due-pianeti', da: a, a: b, P: PA.toString() },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = commonCheck(sample);
	const ans = sample.answer.kind === 'number' ? sample.answer.value : '';
	if (((sample.params.mistakes as string[]) ?? []).filter((m) => m !== ans).length < 2) v.push('meno di due errori tipici');
	return v;
}

export const fisForzaPeso: Generator = {
	id: ID,
	title: 'La forza-peso e la massa',
	levels: {
		1: { label: 'Il peso dalla massa', constraints: ['massa da 1,0 a 9,9 kg', 'g = 9,8 N/kg, risultato con due cifre significative'] },
		2: { label: 'La massa dal dinamometro', constraints: ['la lettura di un dinamometro disegnato, con due cifre significative', 'massa in kg con due cifre significative'] },
		3: { label: 'La massa in grammi', constraints: ['massa da 100 a 990 g', 'peso in N con due cifre significative'] },
		4: { label: 'Il peso su un altro corpo celeste', constraints: ['Luna, Marte, Venere, Giove, Saturno, Nettuno, con g dato', 'peso da 1 a 99 N'] },
		5: { label: 'Da un corpo celeste a un altro', constraints: ['prima la massa, poi il peso', 'peso da 1 a 99 N'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice: (sample, rng) => choiceFor(sample, rng, ID),
};

export default fisForzaPeso;
