/**
 * La legge di Lavoisier. Spec: specs/exercises/chim-legge-lavoisier.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/23-chim-legge-lavoisier.md), each one step harder: the
 * product of two reactants in a closed vessel; one mass missing among reactants and products; a reaction in an open
 * vessel read on a balance (a gas that leaves, or the oxygen that a burning metal takes from the air); the same with
 * the powder weighed on a weighing boat, whose empty mass counts; a reactant in excess, whose leftover still counts.
 *
 * Masses are whole numbers of hundredths of a gram, written with two decimals, so that every sum and difference is
 * exact and the answer has the decimals of the data. They follow the real reactions: the masses of the substances are
 * proportional to the masses in the balanced equation, computed with the atomic masses of lesson 01, and rounded to
 * the hundredth; the missing mass is then the exact difference of the others.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkCommon, choose, cg, gOpt, gq, generateWith, pg, textBlock } from '../chim-leggi-ponderali';

export const ID = 'chim-legge-lavoisier';

type Sub = [string, number]; // a substance and its mass in the balanced equation, in g
export interface Reaction {
	r: Sub[];
	p: Sub[];
}

/** Reactions with two reactants and one product. */
export const SYNTHESES: Reaction[] = [
	{ r: [['ferro', 55.85], ['zolfo', 32.07]], p: [['solfuro di ferro', 87.92]] },
	{ r: [['magnesio', 48.62], ['ossigeno', 32.0]], p: [['ossido di magnesio', 80.62]] },
	{ r: [['carbonio', 12.01], ['ossigeno', 32.0]], p: [['diossido di carbonio', 44.01]] },
	{ r: [['idrogeno', 4.04], ['ossigeno', 32.0]], p: [['acqua', 36.04]] },
	{ r: [['sodio', 45.98], ['cloro', 70.9]], p: [['cloruro di sodio', 116.88]] },
	{ r: [['ossido di calcio', 56.08], ['acqua', 18.02]], p: [['idrossido di calcio', 74.1]] },
	{ r: [['ferro', 223.4], ['ossigeno', 96.0]], p: [['ossido di ferro', 319.4]] },
	{ r: [['azoto', 28.02], ['idrogeno', 6.06]], p: [['ammoniaca', 34.08]] },
];
/** Every reaction of level 2: the syntheses and reactions with more products. */
export const REACTIONS: Reaction[] = [
	...SYNTHESES,
	{ r: [['carbonato di calcio', 100.09]], p: [['ossido di calcio', 56.08], ['diossido di carbonio', 44.01]] },
	{ r: [['carbonato di magnesio', 84.32]], p: [['ossido di magnesio', 40.31], ['diossido di carbonio', 44.01]] },
	{ r: [['clorato di potassio', 245.1]], p: [['cloruro di potassio', 149.1], ['ossigeno', 96.0]] },
	{ r: [['acqua ossigenata', 68.04]], p: [['acqua', 36.04], ['ossigeno', 32.0]] },
	{ r: [['bicarbonato di sodio', 168.02]], p: [['carbonato di sodio', 105.99], ['acqua', 18.02], ['diossido di carbonio', 44.01]] },
	{ r: [['metano', 16.05], ['ossigeno', 64.0]], p: [['diossido di carbonio', 44.01], ['acqua', 36.04]] },
	{ r: [['bicarbonato di sodio', 84.01], ['acido acetico', 60.06]], p: [['acetato di sodio', 82.04], ['acqua', 18.02], ['diossido di carbonio', 44.01]] },
	{ r: [['carbonato di calcio', 100.09], ['acido cloridrico', 72.92]], p: [['cloruro di calcio', 110.98], ['acqua', 18.02], ['diossido di carbonio', 44.01]] },
	{ r: [['magnesio', 24.31], ['acido cloridrico', 72.92]], p: [['cloruro di magnesio', 95.21], ['idrogeno', 2.02]] },
];

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
/** "a", "a e b", "a, b e c". */
const list = (xs: string[]) => (xs.length === 1 ? xs[0] : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`);
const item = (n: number | null, name: string) => (n === null ? `una certa massa di ${name}` : `${pg(cg(n))} di ${name}`);
/** Masses in hundredths proportional to the equation, from the first one. */
const scaled = (subs: Sub[], first: number, M0: number) => subs.map(([, M]) => Math.round((first * M) / M0));
/** The fallbacks: the answer ± a little, never at or below zero. */
const around = (n: number) => [Math.round(n * 1.1), Math.round(n * 0.9), n + 100, n - 100, Math.round(n * 1.2)].filter((x) => x > 0);

// ---------------------------------------------------------------------------
// Level 1: the product of two reactants

function level1(rng: Rng): Built {
	for (;;) {
		const R = rng.pick(SYNTHESES);
		const a = rng.int(100, 3000);
		const b = Math.round((a * R.r[1][1]) / R.r[0][1]);
		if (b < 50 || a % 10 === 0 || b % 10 === 0) continue;
		const c = a + b;
		const [A, B] = [R.r[0][0], R.r[1][0]];
		const C = R.p[0][0];
		return {
			prompt: 'Trova la massa del prodotto.',
			problem: textBlock(`In un recipiente chiuso ${pg(cg(a))} di ${A} reagiscono completamente con ${pg(cg(b))} di ${B}, e si forma ${C}. Quanti grammi di ${C} si formano?`),
			solution: gq(cg(c)),
			steps: [textBlock('Il recipiente è chiuso: la massa del prodotto è la somma delle masse dei reagenti.'), `m = ${gq(cg(a))} + ${gq(cg(b))} = ${gq(cg(c))}`],
			// the difference; one reactant only
			answer: choose(rng, gOpt(cg(c)), [Math.abs(a - b), Math.max(a, b), Math.min(a, b)].filter((x) => x > 0).map((x) => gOpt(cg(x))), around(c).map((x) => gOpt(cg(x)))),
			params: { case: 'sintesi', a, b, c },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the missing mass

function level2(rng: Rng): Built {
	for (;;) {
		const R = rng.pick(REACTIONS.filter((x) => x.r.length + x.p.length >= 3));
		const first = rng.int(100, 3000);
		const ms = [...scaled(R.r, first, R.r[0][1]), ...scaled(R.p, first, R.r[0][1])];
		if (ms.some((x) => x < 20)) continue;
		const nr = R.r.length;
		const u = rng.int(0, ms.length - 1);
		const onR = u < nr;
		const same = onR ? ms.slice(0, nr) : ms.slice(nr);
		const other = onR ? ms.slice(nr) : ms.slice(0, nr);
		const ui = onR ? u : u - nr;
		const rest = same.filter((_, i) => i !== ui);
		const x = sum(other) - sum(rest);
		if (x <= 0 || Math.abs(x - ms[u]) > 2) continue;
		const shown: (number | null)[] = ms.map((m, i) => (i === u ? null : m));
		const name = [...R.r, ...R.p][u][0];
		const rs = R.r.map(([n], i) => item(shown[i], n));
		const ps = R.p.map(([n], i) => item(shown[nr + i], n));
		const question = onR ? `Quanti grammi di ${name} hanno reagito?` : `Quanti grammi di ${name} si formano?`;
		const known = ms.filter((_, i) => i !== u);
		const mistakes = [sum(known), sum(other), ...rest.map((r) => x + r)].filter((v) => v > 0 && v !== x);
		return {
			prompt: 'Trova la massa mancante.',
			problem: textBlock(`In un recipiente chiuso reagiscono completamente ${list(rs)}, e si formano ${list(ps)}. ${question}`),
			solution: gq(cg(x)),
			steps: [
				textBlock('Recipiente chiuso: la massa dei reagenti è uguale alla massa dei prodotti,'),
				'm_{\\text{reagenti}} = m_{\\text{prodotti}}',
				`m = ${[gq(cg(sum(other))), ...rest.map((r) => gq(cg(r)))].join(' - ')} = ${gq(cg(x))}`,
			],
			// all the known masses added; the other side only; one term of this side forgotten
			answer: choose(rng, gOpt(cg(x)), mistakes.map((v) => gOpt(cg(v))), around(x).map((v) => gOpt(cg(v)))),
			params: { case: onR ? 'reagente' : 'prodotto', masses: ms, unknown: u },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the open vessel

/** Gases that leave a beaker or a crucible: the solid put in, its mass per g of gas, where it happens. */
export const GAS: { solido: string; liquido?: string; gas: string; frac: number; resto?: string }[] = [
	{ solido: 'carbonato di calcio (marmo)', liquido: 'acido cloridrico', gas: 'diossido di carbonio', frac: 44.01 / 100.09 },
	{ solido: 'bicarbonato di sodio', liquido: 'aceto', gas: 'diossido di carbonio', frac: 44.01 / 84.01 },
	{ solido: 'magnesio', liquido: 'acido cloridrico', gas: 'idrogeno', frac: 2.02 / 24.31 },
	{ solido: 'carbonato di calcio', gas: 'diossido di carbonio', frac: 44.01 / 100.09, resto: 'ossido di calcio' },
	{ solido: 'clorato di potassio', gas: 'ossigeno', frac: 96.0 / 245.1, resto: 'cloruro di potassio' },
];
/** Metals burnt in air: the oxygen taken per g of metal. */
export const BURN: { metallo: string; ossido: string; frac: number }[] = [
	{ metallo: 'magnesio', ossido: 'ossido di magnesio', frac: 16.0 / 24.31 },
	{ metallo: 'calcio', ossido: 'ossido di calcio', frac: 16.0 / 40.08 },
	{ metallo: 'ferro in polvere', ossido: 'ossido di ferro', frac: 48.0 / 111.7 },
];

function level3(rng: Rng): Built {
	for (;;) {
		const gasCase = rng.next() < 0.5;
		const M1 = rng.int(3000, 20000);
		if (gasCase) {
			const G = rng.pick(GAS);
			const s = rng.int(50, 500);
			const gas = Math.round(s * G.frac);
			if (gas < 10 || s % 10 === 0) continue;
			const M2 = M1 - gas;
			const where = G.liquido
				? `Su una bilancia c'è un becher con dell'${G.liquido === 'aceto' ? 'aceto' : 'acido cloridrico'}; si aggiungono ${pg(cg(s))} di ${G.solido}, che reagiscono tutti. Prima della reazione la bilancia segnava ${pg(cg(M1))}, alla fine segna ${pg(cg(M2))}. Quanto ${G.gas} è uscito dal becher?`
				: `In un crogiolo aperto si scaldano ${pg(cg(s))} di ${G.solido}, che si decompongono tutti in ${G.resto} e ${G.gas}. Il crogiolo pesava ${pg(cg(M1))} prima e pesa ${pg(cg(M2))} dopo. Quanto ${G.gas} è uscito dal crogiolo?`;
			return {
				prompt: 'Trova la massa del gas.',
				problem: textBlock(where),
				solution: gq(cg(gas)),
				steps: [textBlock(`Il ${G.gas} che si forma è un gas ed esce: la bilancia segna meno.`), `m = ${gq(cg(M1))} - ${gq(cg(M2))} = ${gq(cg(gas))}`],
				// all the solid turned into gas; the solid minus the gas
				answer: choose(rng, gOpt(cg(gas)), [s, s - gas, 2 * gas].map((v) => gOpt(cg(v))), around(gas).map((v) => gOpt(cg(v)))),
				params: { case: 'gas uscito', s, M1, M2 },
			};
		}
		const B = rng.pick(BURN);
		const m = rng.int(50, 500);
		const ox = Math.round(m * B.frac);
		if (ox < 10 || m % 10 === 0) continue;
		const M2 = M1 + ox;
		return {
			prompt: "Trova la massa dell'ossigeno.",
			problem: textBlock(
				`In un crogiolo aperto si scaldano all'aria ${pg(cg(m))} di ${B.metallo}, che si trasformano tutti in ${B.ossido}. Il crogiolo pesava ${pg(cg(M1))} prima e pesa ${pg(cg(M2))} dopo. Quanto ossigeno dell'aria ha reagito?`,
			),
			solution: gq(cg(ox)),
			steps: [textBlock(`Il ${B.metallo.split(' ')[0]} si unisce all'ossigeno dell'aria, che non era sulla bilancia: la massa aumenta.`), `m = ${gq(cg(M2))} - ${gq(cg(M1))} = ${gq(cg(ox))}`],
			// the oxide; the metal; the metal minus the oxygen
			answer: choose(rng, gOpt(cg(ox)), [m + ox, m, Math.abs(m - ox)].filter((v) => v > 0).map((v) => gOpt(cg(v))), around(ox).map((v) => gOpt(cg(v)))),
			params: { case: 'ossigeno entrato', m, M1, M2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the weighing boat

function level4(rng: Rng): Built {
	for (;;) {
		const G = rng.pick(GAS.filter((g) => g.liquido));
		const s = rng.int(50, 500);
		const gas = Math.round(s * G.frac);
		if (gas < 10 || s % 10 === 0) continue;
		const Mb = rng.int(8000, 20000); // beaker with the liquid
		const Mv = rng.int(100, 600); // empty boat
		if (Mv % 10 === 0) continue;
		const Ms = Mv + s;
		const Mb2 = Mb + s - gas;
		const liq = G.liquido === 'aceto' ? "dell'aceto" : "dell'acido cloridrico";
		return {
			prompt: 'Trova la massa del gas.',
			problem: textBlock(
				`Un becher con ${liq} pesa ${pg(cg(Mb))}, e un vetrino con del ${G.solido} pesa ${pg(cg(Ms))}. Si versa tutto il solido nel becher: reagisce completamente, e alla fine il becher pesa ${pg(cg(Mb2))} e il vetrino vuoto ${pg(cg(Mv))}. Quanto ${G.gas} si è formato?`,
			),
			solution: gq(cg(gas)),
			steps: [
				textBlock('Prima: becher e vetrino pieno. Dopo: becher e vetrino vuoto. La differenza è il gas uscito.'),
				`m = (${gq(cg(Mb))} + ${gq(cg(Ms))}) - (${gq(cg(Mb2))} + ${gq(cg(Mv))}) = ${gq(cg(gas))}`,
			],
			// the empty boat forgotten; the mass of the solid; the increase of the beaker
			answer: choose(rng, gOpt(cg(gas)), [gas + Mv, s, s - gas].map((v) => gOpt(cg(v))), around(gas).map((v) => gOpt(cg(v)))),
			params: { case: 'vetrino', Mb, Ms, Mb2, Mv },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: a reactant in excess

function level5(rng: Rng): Built {
	for (;;) {
		const R = rng.pick(SYNTHESES);
		const lim = rng.int(0, 1); // the reactant that reacts completely
		const exc = 1 - lim;
		const a = rng.int(100, 2000); // mass of the limiting reactant
		const used = Math.round((a * R.r[exc][1]) / R.r[lim][1]);
		const extra = rng.int(20, 300);
		if (used < 50 || a % 10 === 0 || extra % 10 === 0) continue;
		const b = used + extra; // mass of the reactant in excess put in
		const c = a + used;
		const mA = lim === 0 ? a : b, mB = lim === 0 ? b : a;
		const [A, B] = [R.r[0][0], R.r[1][0]];
		const E = R.r[exc][0];
		const C = R.p[0][0];
		const askLeft = rng.next() < 0.5;
		if (askLeft) {
			return {
				prompt: "Trova la massa che avanza.",
				problem: textBlock(`In un recipiente chiuso si fanno reagire ${pg(cg(mA))} di ${A} e ${pg(cg(mB))} di ${B}. Alla fine ci sono ${pg(cg(c))} di ${C} e una parte di ${E} che non ha reagito. Quanto ${E} avanza?`),
				solution: gq(cg(extra)),
				steps: [textBlock('La massa totale si conserva, contando anche il reagente che avanza:'), `m = ${gq(cg(mA))} + ${gq(cg(mB))} - ${gq(cg(c))} = ${gq(cg(extra))}`],
				// all of it; the part that reacted; the difference of the two reactants
				answer: choose(rng, gOpt(cg(extra)), [b, used, Math.abs(mA - mB)].filter((v) => v > 0).map((v) => gOpt(cg(v))), around(extra).map((v) => gOpt(cg(v)))),
				params: { case: 'avanzo', mA, mB, c },
			};
		}
		return {
			prompt: 'Trova la massa del prodotto.',
			problem: textBlock(`In un recipiente chiuso si fanno reagire ${pg(cg(mA))} di ${A} e ${pg(cg(mB))} di ${B}. Alla fine restano ${pg(cg(extra))} di ${E} che non hanno reagito, e il resto è diventato ${C}. Quanti grammi di ${C} si sono formati?`),
			solution: gq(cg(c)),
			steps: [textBlock('Il reagente che avanza non entra nel prodotto:'), `m = ${gq(cg(mA))} + ${gq(cg(mB))} - ${gq(cg(extra))} = ${gq(cg(c))}`],
			// everything put in; the leftover added; the reactant in excess forgotten
			answer: choose(rng, gOpt(cg(c)), [mA + mB, mA + mB + extra, b - extra].filter((v) => v > 0).map((v) => gOpt(cg(v))), around(c).map((v) => gOpt(cg(v)))),
			params: { case: 'prodotto', mA, mB, extra },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimLeggeLavoisier: Generator = {
	id: ID,
	title: 'La legge di Lavoisier',
	levels: {
		1: { label: 'Reagenti e prodotto', constraints: ['recipiente chiuso', 'masse al centesimo di grammo'] },
		2: { label: 'La massa mancante', constraints: ['un reagente o un prodotto'] },
		3: { label: 'Il recipiente aperto', constraints: ['un gas che esce o l’ossigeno che entra'] },
		4: { label: 'Il becher e il vetrino', constraints: ['il vetrino vuoto conta'] },
		5: { label: 'Il reagente che avanza', constraints: ['la massa che avanza o quella del prodotto'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimLeggeLavoisier;
