/**
 * La legge di gravitazione universale. Spec: specs/exercises/fis-gravitazione-universale.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/94-fis-gravitazione-universale.md), in its order, each
 * one step harder: the force between two everyday bodies, F = G m₁ m₂ / r²; how the force changes when the distance
 * becomes k times as large or as small (no formula, only the inverse square); two celestial bodies, with the masses
 * in scientific notation and the distance in kilometres to convert; a satellite at a height above the Earth, where
 * the distance is the Earth's radius plus the height; the acceleration of gravity on the surface of a planet,
 * g = G M / R²; a body between two others on a line, where the two forces are subtracted. G = 6,67 · 10⁻¹¹, the
 * Earth's mass and radius as in the lesson. Distractors from the lesson's warnings: the distance not squared, the
 * kilometres not converted, the height taken for the distance, the forces added.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, generateWith, mulDec } from '../fisica-equilibrio';
import { G_NEWTON as G, M_TERRA, R_TERRA, around, fmt, lab, mant2, mant3, opt, opts, pu, puS, qu, quS, res, show, whole } from '../fis-keplero-newton';

export const ID = 'fis-gravitazione-universale';
const G_TEX = '6{,}67 \\cdot 10^{-11}';
const LAW = `F = G\\,\\dfrac{m_1\\,m_2}{r^2}`;

// ---------------------------------------------------------------------------
// Level 1: two everyday bodies

const PAIRS = [
	{ text: 'Due sfere di piombo', verb: 'hanno' },
	{ text: 'Due casse', verb: 'hanno' },
	{ text: 'Due persone', verb: 'hanno' },
] as const;

function level1(rng: Rng): Built {
	for (;;) {
		const m1 = whole(rng, 11, 99), m2 = whole(rng, 11, 99);
		const r = rng.next() < 0.5 ? mant2(rng) : (Number(mant2(rng)) / 10).toFixed(2);
		const R = Number(r);
		const F = (G * Number(m1) * Number(m2)) / (R * R);
		const ans = fmt(F, 2);
		if (!ans) continue;
		const pair = rng.pick(PAIRS);
		return {
			prompt: 'Trova la forza gravitazionale.',
			problem: textBlock(`${pair.text} ${pair.verb} masse di ${pu(m1, 'kg')} e ${pu(m2, 'kg')}, e i loro centri distano ${pu(r, 'm')}. Con quale forza si attraggono?`),
			solution: `F \\approx ${res(ans, 'N')}`,
			steps: [
				LAW,
				`F = ${G_TEX} \\cdot \\dfrac{${qu(m1, 'kg')} \\cdot ${qu(m2, 'kg')}}{(${qu(r, 'm')})^2}`,
				`F = ${show(F)}\\,\\text{N} \\approx ${res(ans, 'N')}`,
			],
			// the distance not squared; the masses added; the distance at the numerator
			answer: choiceOf(rng, opt(F, 2, 'N')!, opts([(G * Number(m1) * Number(m2)) / R, (G * (Number(m1) + Number(m2))) / (R * R), G * Number(m1) * Number(m2) * R * R], 2, 'N'), around(F, 2, 'N')),
			params: { m1, m2, r },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the distance changes

const TIMES: Record<number, string> = { 2: 'doppia', 3: 'tripla', 4: 'quadrupla' };
const PART: Record<number, string> = { 2: 'la metà', 3: 'un terzo', 4: 'un quarto' };
const TO_PART: Record<number, string> = { 2: 'alla metà', 3: 'a un terzo', 4: 'a un quarto' };

function level2(rng: Rng): Built {
	const farther = rng.next() < 0.5;
	for (;;) {
		const k = rng.int(2, 4);
		// `small` has two figures and `big` is exactly k² times as large: farther goes from big to small, closer back
		const small = rng.next() < 0.5 ? mant2(rng) : (Number(mant2(rng)) / 10).toFixed(2);
		const big = mulDec(small, String(k * k));
		if (/^\d*0$/.test(big) || /^\d$/.test(big) || Number(big) >= 100) continue;
		const given = farther ? big : small, out = farther ? small : big;
		const o = (x: string) => ({ latex: qu(x, 'N'), values: [x] });
		// the factor not squared (the same number both ways); the factor the wrong way round, squared and not
		const mistakes = [o(mulDec(small, String(k))), farther ? o(mulDec(big, String(k * k))) : opt(Number(small) / (k * k), 2, 'N'), farther ? o(mulDec(big, String(k))) : opt(Number(small) / k, 2, 'N')];
		return {
			prompt: 'Trova la nuova forza.',
			problem: textBlock(
				`Due corpi si attraggono con una forza gravitazionale di ${pu(given, 'N')}. Quanto vale la forza se la distanza tra i loro centri diventa ${farther ? TIMES[k] : PART[k]}, senza cambiare le masse?`,
			),
			solution: `F' = ${qu(out, 'N')}`,
			steps: [
				t('La forza è inversamente proporzionale al quadrato della distanza:'),
				t(farther ? `con la distanza ${TIMES[k]} la forza si divide per ${k * k}.` : `con la distanza ridotta ${TO_PART[k]} la forza si moltiplica per ${k * k}.`),
				farther ? `F' = \\dfrac{F}{${k}^2} = \\dfrac{${qu(given, 'N')}}{${k * k}} = ${qu(out, 'N')}` : `F' = F \\cdot ${k}^2 = ${qu(given, 'N')} \\cdot ${k * k} = ${qu(out, 'N')}`,
			],
			answer: choiceOf(rng, o(out), mistakes.filter((x): x is ChoiceOption => x !== null), around(Number(out), 2, 'N')),
			params: { case: farther ? 'lontano' : 'vicino', F: given, k },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: two celestial bodies, the distance in kilometres

const SKY = [
	{ a: 'Un pianeta', b: 'il suo satellite', e1: [23, 26], e2: [20, 22], ed: [5, 6] },
	{ a: 'Una stella', b: 'un suo pianeta', e1: [29, 31], e2: [23, 27], ed: [7, 9] },
	{ a: 'Due asteroidi', b: '', e1: [15, 18], e2: [14, 17], ed: [2, 4] },
] as const;

function level3(rng: Rng): Built {
	for (;;) {
		const kind = rng.pick(SKY);
		const m1 = mant3(rng), m2 = mant3(rng), d = mant3(rng);
		const e1 = rng.int(kind.e1[0], kind.e1[1]), e2 = rng.int(kind.e2[0], kind.e2[1]), ed = rng.int(kind.ed[0], kind.ed[1]);
		const M1 = Number(m1) * 10 ** e1, M2 = Number(m2) * 10 ** e2, R = Number(d) * 10 ** (ed + 3);
		const F = (G * M1 * M2) / (R * R);
		const ans = fmt(F, 3);
		if (!ans || !ans.value.includes('e')) continue;
		const who = kind.b ? `${kind.a} di massa ${puS(m1, e1, 'kg')} e ${kind.b} di massa ${puS(m2, e2, 'kg')} hanno i centri a una distanza di ${puS(d, ed, 'km')}.` : `${kind.a} di masse ${puS(m1, e1, 'kg')} e ${puS(m2, e2, 'kg')} hanno i centri a una distanza di ${puS(d, ed, 'km')}.`;
		return {
			prompt: 'Trova la forza gravitazionale.',
			problem: textBlock(`${who} Con quale forza si attraggono?`),
			solution: `F \\approx ${res(ans, 'N')}`,
			steps: [
				t('La distanza va in metri:'),
				`r = ${quS(d, ed, 'km')} = ${quS(d, ed + 3, 'm')}`,
				LAW,
				`F = ${G_TEX} \\cdot \\dfrac{${quS(m1, e1, 'kg')} \\cdot ${quS(m2, e2, 'kg')}}{(${quS(d, ed + 3, 'm')})^2}`,
				`F = ${show(F)}\\,\\text{N} \\approx ${res(ans, 'N')}`,
			],
			// the kilometres not converted; the distance not squared; the exponent of the distance not doubled
			answer: choiceOf(rng, opt(F, 3, 'N')!, opts([F * 1e6, (G * M1 * M2) / R, F * 10 ** (ed + 3)], 3, 'N'), around(F, 3, 'N')),
			params: { m1, e1, m2, e2, d, ed },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: a satellite at a height above the Earth

function level4(rng: Rng): Built {
	for (;;) {
		const m = whole(rng, 121, 989), h = whole(rng, 251, 2499);
		const r = R_TERRA + Number(h) * 1000;
		const F = (G * M_TERRA * Number(m)) / (r * r);
		const ans = fmt(F, 3);
		if (!ans) continue;
		const rs = (r / 1e6).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
		return {
			prompt: 'Trova la forza con cui la Terra attira il satellite.',
			problem: textBlock(
				`Un satellite di ${pu(m, 'kg')} orbita a ${pu(h, 'km')} sopra la superficie della Terra, che ha massa ${puS('5.97', 24, 'kg')} e raggio ${puS('6.37', 6, 'm')}. Con quale forza la Terra lo attira?`,
			),
			solution: `F \\approx ${res(ans, 'N')}`,
			steps: [
				t('La distanza si misura dal centro della Terra: è il raggio più la quota, in metri.'),
				`r = R_T + h = ${quS('6.37', 6, 'm')} + ${quS(mulDec(h, '0.001'), 6, 'm')} = ${quS(rs, 6, 'm')}`,
				`F = G\\,\\dfrac{M_T\\,m}{r^2} = ${G_TEX} \\cdot \\dfrac{${quS('5.97', 24, 'kg')} \\cdot ${qu(m, 'kg')}}{(${quS(rs, 6, 'm')})^2}`,
				`F = ${show(F, 5)}\\,\\text{N} \\approx ${res(ans, 'N')}`,
			],
			// the height for the distance; the Earth's radius alone (the weight on the ground); the distance not squared
			answer: choiceOf(rng, opt(F, 3, 'N')!, opts([(G * M_TERRA * Number(m)) / (Number(h) * 1000) ** 2, (G * M_TERRA * Number(m)) / R_TERRA ** 2, (G * M_TERRA * Number(m)) / r], 3, 'N'), around(F, 3, 'N')),
			params: { m, h },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: g on the surface of a planet

function level5(rng: Rng): Built {
	for (;;) {
		const M = mant3(rng), eM = rng.int(22, 26), R = mant3(rng), eR = rng.int(3, 4);
		const mass = Number(M) * 10 ** eM, radius = Number(R) * 10 ** (eR + 3);
		const g = (G * mass) / (radius * radius);
		const ans = fmt(g, 3);
		if (!ans || g < 0.5 || g > 60 || ans.value.includes('e')) continue;
		return {
			prompt: "Trova l'accelerazione di gravità sulla superficie.",
			problem: textBlock(`Un pianeta ha massa ${puS(M, eM, 'kg')} e raggio ${puS(R, eR, 'km')}. Quanto vale l'accelerazione di gravità sulla sua superficie?`),
			solution: `g \\approx ${res(ans, 'm/s2')}`,
			steps: [
				t('Sulla superficie il peso m g è la forza gravitazionale, con r uguale al raggio:'),
				`m\\,g = G\\,\\dfrac{M\\,m}{R^2} \\quad\\Rightarrow\\quad g = G\\,\\dfrac{M}{R^2}`,
				`R = ${quS(R, eR, 'km')} = ${quS(R, eR + 3, 'm')}`,
				`g = ${G_TEX} \\cdot \\dfrac{${quS(M, eM, 'kg')}}{(${quS(R, eR + 3, 'm')})^2} = ${show(g, 5)}\\,\\text{m/s}^2 \\approx ${res(ans, 'm/s2')}`,
			],
			// the kilometres not converted; the radius not squared; the radius doubled (the diameter)
			answer: choiceOf(rng, opt(g, 3, 'm/s2')!, opts([g * 1e6, (G * mass) / radius, g / 4], 3, 'm/s2'), around(g, 3, 'm/s2')),
			params: { M, eM, R, eR },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: three bodies on a line

function level6(rng: Rng): Built {
	for (;;) {
		const mA = whole(rng, 11, 99), mB = whole(rng, 11, 99), mC = whole(rng, 11, 99);
		const dA = mant2(rng), dC = mant2(rng);
		const FA = (G * Number(mA) * Number(mB)) / Number(dA) ** 2;
		const FC = (G * Number(mC) * Number(mB)) / Number(dC) ** 2;
		const net = Math.abs(FA - FC);
		const big = Math.max(FA, FC), small = Math.min(FA, FC);
		if (big / small < 1.3 || big / small > 8) continue;
		const ans = fmt(net, 2);
		if (!ans) continue;
		const toA = FA > FC;
		const o = (x: number, a: boolean) => opt(x, 2, 'N', a ? 'verso A' : 'verso C', a ? 1 : -1);
		const right = o(net, toA);
		const wrong = [o(net, !toA), o(FA + FC, toA), o(big, toA), o(FA + FC, !toA)].filter((x): x is NonNullable<typeof x> => x !== null);
		if (!right) continue;
		const total = Number(dA) + Number(dC);
		return {
			prompt: 'Trova la forza totale sul corpo B.',
			problem: textBlock(
				`Tre corpi sono allineati. Il corpo B, di ${pu(mB, 'kg')}, sta tra il corpo A, di ${pu(mA, 'kg')}, e il corpo C, di ${pu(mC, 'kg')}: dista ${pu(dA, 'm')} da A e ${pu(dC, 'm')} da C. Quanto vale la forza gravitazionale totale su B, e verso quale corpo è diretta?`,
			),
			solution: `F \\approx ${res(ans, 'N')}\\ \\text{${toA ? 'verso A' : 'verso C'}}`,
			steps: [
				t('A e C attirano B in versi opposti. Ciascuna forza si calcola da sola:'),
				`F_A = G\\,\\dfrac{m_A\\,m_B}{d_A^2} = ${show(FA)}\\,\\text{N}`,
				`F_C = G\\,\\dfrac{m_C\\,m_B}{d_C^2} = ${show(FC)}\\,\\text{N}`,
				t(`Vince la forza più grande, quella di ${toA ? 'A' : 'C'}, e i moduli si sottraggono:`),
				`F = ${show(big)}\\,\\text{N} - ${show(small)}\\,\\text{N} = ${show(net)}\\,\\text{N} \\approx ${res(ans, 'N')}`,
			],
			// the right modulus towards the other body; the forces added; the larger force alone
			answer: choiceOf(rng, right, wrong),
			params: { mA, mB, mC, dA, dC },
			scene: {
				type: 'masse-allineate',
				data: {
					corpi: [
						{ x: 0, nome: 'A', massa: `${mA} kg` },
						{ x: Number(dA) / total, nome: 'B', massa: `${mB} kg` },
						{ x: 1, nome: 'C', massa: `${mC} kg` },
					],
					quote: [`${lab(dA)} m`, `${lab(dC)} m`],
				},
				alt: `Tre corpi allineati: A di ${mA} kilogrammi a sinistra, B di ${mB} kilogrammi in mezzo, C di ${mC} kilogrammi a destra. B dista ${lab(dA)} metri da A e ${lab(dC)} metri da C.`,
			},
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

const check = (sample: Sample): string[] => {
	const v = checkCommon(sample);
	if (sample.level === 6 && sample.scene?.type !== 'masse-allineate') v.push('manca la scena dei tre corpi');
	return v;
};

export const fisGravitazioneUniversale: Generator = {
	id: ID,
	title: 'La legge di gravitazione universale',
	levels: {
		1: { label: 'La forza tra due corpi', constraints: ['F = G m₁ m₂ / r²', 'masse in kg, distanza in m'] },
		2: { label: 'Se cambia la distanza', constraints: ['distanza doppia, tripla, quadrupla o ridotta', 'solo il quadrato inverso'] },
		3: { label: 'Tra corpi celesti', constraints: ['masse in notazione scientifica', 'distanza in km da convertire'] },
		4: { label: 'Un satellite a una certa quota', constraints: ['r = R_T + h', 'quota tra 251 e 2499 km'] },
		5: { label: 'La gravità su un altro pianeta', constraints: ['g = G M / R²', 'g tra 0,5 e 60 m/s²'] },
		6: { label: 'Tre corpi allineati', constraints: ['le due forze si sottraggono', 'rapporto tra le forze tra 1,3 e 8'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisGravitazioneUniversale;
