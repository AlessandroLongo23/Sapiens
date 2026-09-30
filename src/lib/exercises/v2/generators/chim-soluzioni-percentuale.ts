/**
 * Le soluzioni e la concentrazione percentuale. Spec: specs/exercises/chim-soluzioni-percentuale.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/17-chim-soluzioni-percentuale.md), each one step harder:
 * the percentage by mass from the solute and the solution; from the solute and the solvent (their sum first); the
 * percentage mass over volume, with the volume sometimes in litres; the percentage by volume; the solute (or the
 * solvent) needed for a solution at a given percentage; the solubility, what stays on the bottom or the percentage
 * of a saturated solution. Numbers are built backwards, so the results are exact; distractors from the lesson's
 * warnings: divided by the solvent, the factor 100 forgotten, the volume in litres not converted, the volumes added,
 * the solubility read as a percentage.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { choose, decTex, pq, sig, t, textBlock } from '../chim-materia';

export const ID = 'chim-soluzioni-percentuale';

/** A number with at most `d` decimals, as a plain string without trailing zeros ("12.5", "40"). */
const plain = (x: number, d = 3) => String(Number(x.toFixed(d)));
/** Is x a multiple of 10^-d (up to floating noise)? */
const hasDecimals = (x: number, d: number) => Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-6;
const tx = (s: string) => decTex(s);

/** A percentage with two significant figures, from 1,0 to 40 %: the string as written ("6.0", "12") and its value. */
function percent(rng: Rng): { s: string; v: number } {
	if (rng.next() < 0.55) {
		const k = rng.int(10, 99);
		return { s: (k / 10).toFixed(1), v: k / 10 };
	}
	const k = rng.int(10, 40);
	return { s: String(k), v: k };
}

/** Options of percentages from exact values, rounded to n significant figures (null ones skipped). */
function pctOpts(xs: number[], n = 2) {
	return xs
		.map((x) => sig(x, n))
		.filter((r): r is { tex: string; value: string } => r !== null && !r.value.includes('e'))
		.map((r) => ({ latex: `${r.tex}\\%`, values: [r.value] }));
}
const pctOpt = (s: string) => ({ latex: `${tx(s)}\\%`, values: [s] });
function gOpts(xs: number[], unit = 'g') {
	return xs.filter((x) => x > 0 && hasDecimals(x, 2)).map((x) => ({ latex: `${tx(plain(x, 2))}\\,\\text{${unit}}`, values: [plain(x, 2)] }));
}
const gOpt = (x: number, unit = 'g') => ({ latex: `${tx(plain(x, 2))}\\,\\text{${unit}}`, values: [plain(x, 2)] });

const SOLUTES = ['zucchero', 'cloruro di sodio', 'glucosio', 'bicarbonato di sodio', 'solfato di rame', 'nitrato di potassio'];

// ---------------------------------------------------------------------------
// Levels 1 and 2: percentage by mass

const SOLUTION_MASSES = [50, 80, 120, 125, 150, 160, 200, 250, 300, 400, 500];

/** A percentage and a mass of solution whose solute has at most `d` decimals. */
function massCase(rng: Rng, d = 1) {
	for (;;) {
		const p = percent(rng);
		const msol = rng.pick(SOLUTION_MASSES);
		const ms = (p.v * msol) / 100;
		if (!hasDecimals(ms, d) || ms < 1) continue;
		return { p, msol, ms, mw: msol - ms };
	}
}

function level1(rng: Rng): Built {
	const { p, msol, ms } = massCase(rng);
	const solute = rng.pick(SOLUTES);
	return {
		prompt: 'Trova la percentuale in massa.',
		problem: textBlock(`In ${pq(String(msol), 'g')} di una soluzione acquosa ci sono ${pq(plain(ms, 1), 'g')} di ${solute}. Qual è la percentuale in massa del soluto?`),
		solution: `${tx(p.s)}\\%`,
		steps: [`\\%\\,(m/m) = \\dfrac{m_{\\text{soluto}}}{m_{\\text{soluzione}}} \\cdot 100 = \\dfrac{${tx(plain(ms, 1))}\\,\\text{g}}{${msol}\\,\\text{g}} \\cdot 100 = ${tx(p.s)}\\%`],
		// the 100 forgotten; the ratio upside down; the solution taken for the solvent
		answer: choose(rng, pctOpt(p.s), [...pctOpts([p.v / 100, (100 * msol) / ms, (100 * ms) / (msol + ms)]), ...pctOpts([p.v * 1.5, p.v / 2])]),
		params: { case: 'soluzione', msol, ms: plain(ms, 1) },
	};
}

function level2(rng: Rng): Built {
	// Whole grams of solute, so that the water is in whole grams too.
	const { p, msol, ms, mw } = massCase(rng, 0);
	const solute = rng.pick(SOLUTES);
	return {
		prompt: 'Trova la percentuale in massa.',
		problem: textBlock(`Si sciolgono ${pq(plain(ms, 1), 'g')} di ${solute} in ${pq(plain(mw, 1), 'g')} d'acqua. Qual è la percentuale in massa del soluto?`),
		solution: `${tx(p.s)}\\%`,
		steps: [
			`m_{\\text{soluzione}} = ${tx(plain(ms, 1))}\\,\\text{g} + ${tx(plain(mw, 1))}\\,\\text{g} = ${msol}\\,\\text{g}`,
			`\\%\\,(m/m) = \\dfrac{${tx(plain(ms, 1))}\\,\\text{g}}{${msol}\\,\\text{g}} \\cdot 100 = ${tx(p.s)}\\%`,
		],
		// divided by the solvent; the 100 forgotten; the percentage of the solvent
		answer: choose(rng, pctOpt(p.s), [...pctOpts([(100 * ms) / mw, p.v / 100, (100 * mw) / msol]), ...pctOpts([p.v * 1.5, p.v / 2])]),
		params: { case: 'solvente', ms: plain(ms, 1), mw: plain(mw, 1) },
	};
}

// ---------------------------------------------------------------------------
// Level 3: mass over volume

const VOLUMES = [50, 100, 150, 200, 250, 400, 500, 750, 1000];

function level3(rng: Rng): Built {
	for (;;) {
		const p = percent(rng);
		const V = rng.pick(VOLUMES);
		const ms = (p.v * V) / 100;
		if (!hasDecimals(ms, 2) || ms < 0.5) continue;
		const litres = rng.next() < 0.5;
		const Vtext = litres ? pq((V / 1000).toFixed(3), 'L') : pq(String(V), 'mL');
		const solute = rng.pick(['glucosio', 'cloruro di sodio', 'zucchero', 'bicarbonato di sodio']);
		return {
			prompt: 'Trova la percentuale massa su volume.',
			problem: textBlock(`Si preparano ${Vtext} di soluzione acquosa con ${pq(plain(ms, 2), 'g')} di ${solute}. Qual è la percentuale massa su volume, $\\%\\,(m/V)$?`),
			solution: `${tx(p.s)}\\%`,
			steps: [
				...(litres ? [`V = ${tx((V / 1000).toFixed(3))}\\,\\text{L} = ${V}\\,\\text{mL}`] : []),
				`\\%\\,(m/V) = \\dfrac{m_{\\text{soluto}}\\ (\\text{g})}{V_{\\text{soluzione}}\\ (\\text{mL})} \\cdot 100 = \\dfrac{${tx(plain(ms, 2))}}{${V}} \\cdot 100 = ${tx(p.s)}\\%`,
			],
			// the volume in litres in the formula; the 100 forgotten; the ratio upside down
			answer: choose(rng, pctOpt(p.s), [...pctOpts([(100 * ms * 1000) / V, p.v / 100, V / ms]), ...pctOpts([p.v * 1.5, p.v / 2, p.v * 2])]),
			params: { case: litres ? 'litri' : 'millilitri', ms: plain(ms, 2), V },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: percentage by volume

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const DRINKS = [
	{ what: 'una bottiglia di vino', V: [375, 750, 1500], p: range(11, 15) },
	{ what: 'una lattina di birra', V: [330, 500], p: range(4, 9) },
	{ what: 'un flacone di collutorio', V: [250, 500], p: [10, 12, 15, 20, 25] },
	{ what: 'una soluzione di alcol in acqua', V: [100, 150, 200, 250, 300, 400, 500], p: range(10, 45) },
];

function level4(rng: Rng): Built {
	for (;;) {
		const d = rng.pick(DRINKS);
		const V = rng.pick(d.V);
		const pv = rng.pick(d.p);
		const vs = (pv * V) / 100;
		if (!hasDecimals(vs, 1)) continue;
		const water = V - vs;
		// Two significant figures, as in the other levels: 8 % is written 8,0 %.
		const ps = pv < 10 ? pv.toFixed(1) : String(pv);
		return {
			prompt: 'Trova la percentuale in volume.',
			problem: textBlock(`In ${d.what} da ${pq(String(V), 'mL')} ci sono ${pq(plain(vs, 1), 'mL')} di etanolo. Qual è la percentuale in volume dell'etanolo?`),
			solution: `${tx(ps)}\\%`,
			steps: [`\\%\\,(V/V) = \\dfrac{V_{\\text{soluto}}}{V_{\\text{soluzione}}} \\cdot 100 = \\dfrac{${tx(plain(vs, 1))}\\,\\text{mL}}{${V}\\,\\text{mL}} \\cdot 100 = ${tx(ps)}\\%`],
			// the rest taken for the solvent (ethanol over the rest); the 100 forgotten; the volumes added
			answer: choose(rng, pctOpt(ps), [...pctOpts([(100 * vs) / water, pv / 100, (100 * vs) / (V + vs)]), ...pctOpts([pv * 1.5, pv / 2])]),
			params: { case: 'volume', V, vs: plain(vs, 1) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: how much solute (or solvent) is needed

function level5(rng: Rng): Built {
	const askSolvent = rng.next() < 0.4;
	for (;;) {
		const p = percent(rng);
		const m = rng.pick(SOLUTION_MASSES);
		const ms = (p.v * m) / 100;
		if (!hasDecimals(ms, 1) || ms < 1) continue;
		const solute = rng.pick(SOLUTES);
		if (askSolvent) {
			const mw = m - ms;
			return {
				prompt: "Trova l'acqua che serve.",
				problem: textBlock(`Si vogliono preparare ${pq(String(m), 'g')} di soluzione di ${solute} al ${pq(p.s, 'pct')} in massa. Quanta acqua serve?`),
				solution: `${tx(plain(mw, 1))}\\,\\text{g}`,
				steps: [
					`m_{\\text{soluto}} = \\dfrac{${tx(p.s)} \\cdot ${m}}{100}\\,\\text{g} = ${tx(plain(ms, 1))}\\,\\text{g}`,
					`m_{\\text{solvente}} = ${m}\\,\\text{g} - ${tx(plain(ms, 1))}\\,\\text{g} = ${tx(plain(mw, 1))}\\,\\text{g}`,
				],
				// the solute given instead; the whole solution; the solute added to the solution; "p g in 100 g of water"
				answer: choose(rng, gOpt(mw), [...gOpts([ms, m, m + ms, (100 * m) / (100 + p.v)]), ...gOpts([mw - 10, mw + 10])]),
				params: { case: 'solvente', m, p: p.s },
			};
		}
		return {
			prompt: 'Trova il soluto che serve.',
			problem: textBlock(`Si vogliono preparare ${pq(String(m), 'g')} di soluzione di ${solute} al ${pq(p.s, 'pct')} in massa. Quanti grammi di ${solute} servono?`),
			solution: `${tx(plain(ms, 1))}\\,\\text{g}`,
			steps: [`m_{\\text{soluto}} = \\dfrac{\\%\\,(m/m) \\cdot m_{\\text{soluzione}}}{100} = \\dfrac{${tx(p.s)} \\cdot ${m}}{100}\\,\\text{g} = ${tx(plain(ms, 1))}\\,\\text{g}`],
			// the 100 forgotten; the percentage read as grams; "p g in 100 g of water", scaled to the solution
			answer: choose(rng, gOpt(ms), [...gOpts([p.v * m, p.v, (p.v * m) / (100 + p.v), (100 * m) / p.v]), ...gOpts([ms * 2, ms / 2])]),
			params: { case: 'soluto', m, p: p.s },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: solubility

/** Solubility in grams per 100 g of water at a temperature (textbook tables; to be checked, see the notes). */
export const SOLUBILITY = [
	{ nome: 'cloruro di sodio', t: 20, S: '35.9' },
	{ nome: 'nitrato di potassio', t: 20, S: '31.6' },
	{ nome: 'nitrato di potassio', t: 40, S: '63.9' },
	{ nome: 'cloruro di potassio', t: 20, S: '34.0' },
	{ nome: 'cloruro di ammonio', t: 20, S: '37.2' },
	{ nome: 'solfato di rame', t: 20, S: '20.7' },
];

function level6(rng: Rng): Built {
	const x = rng.pick(SOLUBILITY);
	const S = Number(x.S);
	const Stext = `${pq(x.S, 'g')} in ${pq('100', 'g')} d'acqua`;
	if (rng.next() < 0.5) {
		const mw = rng.pick([100, 200, 300, 400]);
		const max = (S * mw) / 100;
		const added = Math.ceil(max) + rng.int(3, 40);
		const bottom = added - max;
		return {
			prompt: 'Trova il corpo di fondo.',
			problem: textBlock(`A ${pq(String(x.t), 'C')} la solubilità del ${x.nome} è ${Stext}. Si mettono ${pq(String(added), 'g')} di ${x.nome} in ${pq(String(mw), 'g')} d'acqua a ${pq(String(x.t), 'C')} e si mescola a lungo. Quanti grammi restano sul fondo?`),
			solution: `${tx(plain(bottom, 1))}\\,\\text{g}`,
			steps: [
				`m_{\\text{max}} = \\dfrac{${tx(x.S)} \\cdot ${mw}}{100}\\,\\text{g} = ${tx(plain(max, 1))}\\,\\text{g}`,
				`m_{\\text{fondo}} = ${added}\\,\\text{g} - ${tx(plain(max, 1))}\\,\\text{g} = ${tx(plain(bottom, 1))}\\,\\text{g}`,
			],
			// the solubility taken for all the water; the mass dissolved; the solubility itself
			answer: choose(rng, gOpt(bottom), [...gOpts([added - S, max, S]), ...gOpts([bottom + 5, bottom + 10, bottom * 2])]),
			params: { case: 'fondo', nome: x.nome, t: x.t, S: x.S, mw, added },
		};
	}
	const exact = (100 * S) / (100 + S);
	const ans = sig(exact, 3);
	if (!ans) throw new Error('retry');
	return {
		prompt: 'Trova la percentuale della soluzione satura.',
		problem: textBlock(`A ${pq(String(x.t), 'C')} la solubilità del ${x.nome} è ${Stext}. Qual è la percentuale in massa di una soluzione satura a questa temperatura?`),
		solution: `${ans.tex}\\%`,
		steps: [
			t(`In una soluzione satura ci sono ${x.S.replace('.', ',')} g di soluto ogni ${plain(100 + S, 1).replace('.', ',')} g di soluzione.`),
			`\\%\\,(m/m) = \\dfrac{${tx(x.S)}}{100 + ${tx(x.S)}} \\cdot 100 = ${exact.toFixed(3).replace('.', '{,}')}\\ldots\\% \\approx ${ans.tex}\\%`,
		],
		// the solubility read as a percentage; the percentage of the water; the solute over the water minus the solute
		answer: choose(rng, { latex: `${ans.tex}\\%`, values: [ans.value] }, [...pctOpts([S, (100 * 100) / (100 + S), (100 * S) / (100 - S)], 3), ...pctOpts([exact * 1.2, exact * 0.8], 3)]),
		params: { case: 'satura', nome: x.nome, t: x.t, S: x.S },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimSoluzioniPercentuale: Generator = {
	id: ID,
	title: 'Le soluzioni e la concentrazione percentuale',
	levels: {
		1: { label: 'La percentuale in massa', constraints: ['massa del soluto e della soluzione', 'risultato con due cifre significative, esatto'] },
		2: { label: 'Soluto e solvente', constraints: ['massa del soluto e del solvente: prima si sommano'] },
		3: { label: 'Massa su volume', constraints: ['volume in mL o in L'] },
		4: { label: 'La percentuale in volume', constraints: ["etanolo in bevande e soluzioni, volume della soluzione dato"] },
		5: { label: 'Quanto soluto serve', constraints: ['il soluto o il solvente per una soluzione al p %'] },
		6: { label: 'La solubilità', constraints: ['il corpo di fondo, o la percentuale della soluzione satura'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimSoluzioniPercentuale;
