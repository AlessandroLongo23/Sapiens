/**
 * Il volume molare. Spec: specs/exercises/chim-volume-molare.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/36-chim-volume-molare.md), each one step harder, all in
 * normal conditions (0 °C, 1 atm, V_m = 22,4 L/mol): moles from a volume or a volume from moles; a mass from a volume
 * or a volume from a mass, through the molar mass; the molecules (or atoms) in a volume of gas; the density of a gas
 * from its molar mass, or the molar mass from the density; the molecular formula of a gas from its empirical formula
 * and its density. Data with three significant figures, results rounded to three. Distractors from the lesson's
 * warnings: multiplying by V_m instead of dividing, the molar mass forgotten, the moles taken for the mass, the density
 * turned upside down, molecules and atoms confused, the empirical formula taken for the molecular one.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, NA, VM, answerOf, checkCommon, choiceOf, formulaOpt, formulaTex, generateWith, molar100, minimal, parseFormula, pq, q, sig, t, textBlock, three, times } from '../chim-mole';

export const ID = 'chim-volume-molare';

/** Gases at 0 °C and 1 atm, with their names and the article of "la densità dell'azoto". */
const GASES: [string, string, string][] = [
	['H2', 'idrogeno', "dell'"],
	['N2', 'azoto', "dell'"],
	['O2', 'ossigeno', "dell'"],
	['Cl2', 'cloro', 'del '],
	['CO2', 'anidride carbonica', "dell'"],
	['CH4', 'metano', 'del '],
	['NH3', 'ammoniaca', "dell'"],
	['CO', 'monossido di carbonio', 'del '],
	['SO2', 'anidride solforosa', "dell'"],
	['C3H8', 'propano', 'del '],
	['C2H6', 'etano', "dell'"],
	['C2H4', 'etene', "dell'"],
	['C2H2', 'etino', "dell'"],
	['H2S', 'solfuro di idrogeno', 'del '],
	['N2O', 'protossido di azoto', 'del '],
	['NO', 'monossido di azoto', 'del '],
];
/** Level 5: gases whose molecular formula is a multiple of the empirical one. */
const MULTIPLE = ['C2H4', 'C3H6', 'C4H8', 'C2H2', 'C2H6', 'C4H10', 'C4H6'];

const CN = 'in condizioni normali';
const VMq = '22{,}4\\,\\text{L/mol}';
const fx = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');
const tex = (s: string) => s.replace('.', '{,}');
const Mtex = (f: string) => fx(molar100(f) / 100, 2);
const gas = (rng: Rng) => {
	const [f, name, art] = rng.pick(GASES);
	return { f, name, art, M: molar100(f) / 100, T: formulaTex(f) };
};
/** "di azoto, $\mathrm{N_2}$," for the prose. */
const di = (g: ReturnType<typeof gas>) => `di ${g.name}, $${g.T}$,`;
const atomsIn = (f: string) => parseFormula(f).reduce((s, [, k]) => s + k, 0);

// ---------------------------------------------------------------------------
// Level 1: moles and volume

function level1(rng: Rng): Built {
	const g = gas(rng);
	if (rng.next() < 0.5) {
		const V = three(rng, 1, 99.9);
		const exact = Number(V) / VM;
		return {
			prompt: 'Trova le moli.',
			problem: textBlock(`Quante moli ci sono in ${pq(tex(V), 'L')} ${di(g)} ${CN}?`),
			solution: `n \\approx ${q(sig(exact, 3)!.tex, 'mol')}`,
			steps: [t('In condizioni normali una mole di gas occupa 22,4 L.'), `n = \\dfrac{V}{V_m} = \\dfrac{${tex(V)}\\,\\text{L}}{${VMq}} \\approx ${q(sig(exact, 3)!.tex, 'mol')}`],
			// multiplied by V_m; V_m over V
			answer: answerOf(rng, exact, [Number(V) * VM, VM / Number(V)], 3, 'mol'),
			params: { case: 'moli', V, gas: g.f },
		};
	}
	const n = three(rng, 0.1, 9.99);
	const exact = Number(n) * VM;
	return {
		prompt: 'Trova il volume.',
		problem: textBlock(`Che volume occupano ${pq(tex(n), 'mol')} ${di(g)} ${CN}?`),
		solution: `V \\approx ${q(sig(exact, 3)!.tex, 'L')}`,
		steps: [`V = n \\cdot V_m = ${tex(n)}\\,\\text{mol} \\cdot ${VMq} \\approx ${q(sig(exact, 3)!.tex, 'L')}`],
		// divided by V_m; V_m over n
		answer: answerOf(rng, exact, [Number(n) / VM, VM / Number(n)], 3, 'L'),
		params: { case: 'volume', n, gas: g.f },
	};
}

// ---------------------------------------------------------------------------
// Level 2: mass and volume

function level2(rng: Rng): Built {
	const g = gas(rng);
	const elementGas = /^[A-Z][a-z]?2$/.test(g.f); // H2, N2, O2, Cl2: the atom's mass is a real mistake
	const half = g.M / 2;
	if (rng.next() < 0.5) {
		const V = three(rng, 1, 99.9);
		const n = Number(V) / VM;
		const exact = n * g.M;
		return {
			prompt: 'Trova la massa.',
			problem: textBlock(`Quanti grammi pesano ${pq(tex(V), 'L')} ${di(g)} ${CN}?`),
			solution: `m \\approx ${q(sig(exact, 3)!.tex, 'g')}`,
			steps: [
				`n = \\dfrac{V}{V_m} = \\dfrac{${tex(V)}}{22{,}4}\\,\\text{mol} = ${fx(n, 4)}\\,\\text{mol}`,
				`M = ${Mtex(g.f)}\\,\\text{g/mol} \\qquad m = n \\cdot M \\approx ${q(sig(exact, 3)!.tex, 'g')}`,
			],
			// the moles given as grams; V times M (V_m forgotten); the mass of the atom for an element
			answer: answerOf(rng, exact, [n, Number(V) * g.M, ...(elementGas ? [n * half] : []), (Number(V) * VM) / g.M], 3, 'g'),
			params: { case: 'massa', V, gas: g.f },
		};
	}
	const m = three(rng, 1, 99.9);
	const n = Number(m) / g.M;
	const exact = n * VM;
	return {
		prompt: 'Trova il volume.',
		problem: textBlock(`Che volume occupano ${pq(tex(m), 'g')} ${di(g)} ${CN}?`),
		solution: `V \\approx ${q(sig(exact, 3)!.tex, 'L')}`,
		steps: [`M = ${Mtex(g.f)}\\,\\text{g/mol} \\qquad n = \\dfrac{m}{M} = ${fx(n, 4)}\\,\\text{mol}`, `V = n \\cdot V_m \\approx ${q(sig(exact, 3)!.tex, 'L')}`],
		// the mass times V_m (M forgotten); the moles; the atom's mass for an element
		answer: answerOf(rng, exact, [Number(m) * VM, ...(elementGas ? [(Number(m) / half) * VM] : []), n, Number(m) / (g.M * VM)], 3, 'L'),
		params: { case: 'volume', m, gas: g.f },
	};
}

// ---------------------------------------------------------------------------
// Level 3: molecules and atoms

const NA_TEXT = 'Il numero di Avogadro è $6{,}02 \\cdot 10^{23}\\,\\text{mol}^{-1}$.';

function level3(rng: Rng): Built {
	for (;;) {
		const g = gas(rng);
		const k = atomsIn(g.f);
		const atoms = rng.next() < 0.5;
		const V = three(rng, 0.1, 99.9);
		const n = Number(V) / VM;
		const molecules = n * NA;
		const exact = atoms ? molecules * k : molecules;
		const ans = sig(exact, 3);
		if (!ans) continue;
		const other = atoms ? molecules : molecules * k;
		return {
			prompt: atoms ? 'Trova il numero di atomi.' : 'Trova il numero di molecole.',
			problem: textBlock(`Quant${atoms ? 'i atomi' : 'e molecole'} ci sono in ${pq(tex(V), 'L')} ${di(g)} ${CN}? ${NA_TEXT}`),
			solution: `N \\approx ${q(ans.tex, 'molecole').replace('molecole', atoms ? 'atomi' : 'molecole')}`,
			steps: [
				`n = \\dfrac{${tex(V)}}{22{,}4}\\,\\text{mol} = ${fx(n, 4)}\\,\\text{mol}`,
				`N_{\\text{molecole}} = n \\cdot N_A = ${fx(n, 4)} \\cdot 6{,}02 \\cdot 10^{23} \\approx ${sig(molecules, 3)!.tex}`,
				...(atoms ? [`${t(`Ogni molecola ha ${k} atomi: `)} N_{\\text{atomi}} = ${k} \\cdot N_{\\text{molecole}} \\approx ${ans.tex}`] : []),
			],
			// molecules and atoms confused; V_m forgotten; divided by N_A
			answer: (() => {
				const a = answerOf(rng, exact, [...(k > 1 ? [other] : []), Number(V) * NA * (atoms ? k : 1), Number(V) * VM * NA * (atoms ? k : 1), n / NA], 3, 'molecole');
				if (atoms) a.options = a.options.map((o) => ({ ...o, latex: o.latex.replace('molecole', 'atomi') }));
				return a;
			})(),
			params: { case: atoms ? 'atomi' : 'molecole', V, gas: g.f },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: density

function level4(rng: Rng): Built {
	const g = gas(rng);
	if (rng.next() < 0.5) {
		const exact = g.M / VM;
		return {
			prompt: 'Trova la densità.',
			problem: textBlock(`Qual è la densità ${g.art}${g.name}, $${g.T}$, ${CN}?`),
			solution: `d \\approx ${q(sig(exact, 3)!.tex, 'gL')}`,
			steps: [`M = ${Mtex(g.f)}\\,\\text{g/mol}`, `d = \\dfrac{M}{V_m} = \\dfrac{${Mtex(g.f)}\\,\\text{g/mol}}{${VMq}} \\approx ${q(sig(exact, 3)!.tex, 'gL')}`],
			// upside down; times V_m; half the molar mass (the atom, for an element)
			answer: answerOf(rng, exact, [VM / g.M, g.M * VM, ...(/^[A-Z][a-z]?2$/.test(g.f) ? [g.M / 2 / VM] : [])], 3, 'gL'),
			params: { case: 'densità', gas: g.f },
		};
	}
	const dv = three(rng, 0.5, 4.99);
	const d = { tex: dv.replace('.', '{,}'), value: dv };
	const exact = Number(d.value) * VM;
	return {
		prompt: 'Trova la massa molare.',
		problem: textBlock(`Un gas ha densità ${pq(d.tex, 'gL')} ${CN}. Qual è la sua massa molare?`),
		solution: `M \\approx ${q(sig(exact, 3)!.tex, 'gmol')}`,
		steps: [t('Una mole ha massa M e volume 22,4 L:'), `M = d \\cdot V_m = ${d.tex}\\,\\text{g/L} \\cdot ${VMq} \\approx ${q(sig(exact, 3)!.tex, 'gmol')}`],
		// divided by V_m; V_m over d
		answer: answerOf(rng, exact, [Number(d.value) / VM, VM / Number(d.value)], 3, 'gmol'),
		params: { case: 'massa molare', d: d.value },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the molecular formula of a gas

function level5(rng: Rng): Built {
	const s = rng.pick(MULTIPLE);
	const f = parseFormula(s);
	const { f: m, n } = minimal(f);
	const d = sig(molar100(f) / 100 / VM, 3);
	if (!d) throw new Error('tie');
	const M = Number(d.value) * VM;
	const Mmin = molar100(m) / 100;
	if (Math.abs(M / Mmin - n) > 0.05) throw new Error('n not whole');
	return {
		prompt: 'Trova la formula molecolare.',
		problem: textBlock(`Un idrocarburo gassoso ha formula minima $${formulaTex(m)}$, e ${CN} la sua densità è ${pq(d.tex, 'gL')}. Qual è la sua formula molecolare?`),
		solution: formulaTex(f),
		steps: [
			`M = d \\cdot V_m = ${d.tex} \\cdot 22{,}4\\,\\text{g/mol} = ${fx(M, 2)}\\,\\text{g/mol}`,
			`M_{\\text{min}} = ${fx(Mmin, 2)}\\,\\text{g/mol} \\qquad n = \\dfrac{${fx(M, 2)}}{${fx(Mmin, 2)}} = ${fx(M / Mmin, 2)} \\approx ${n}`,
			`${t('Formula molecolare: ')} ${formulaTex(f)}`,
		],
		// the empirical formula; one unit more or less; twice as many
		answer: choiceOf(rng, formulaOpt(f), [m, times(m, n + 1), ...(n > 2 ? [times(m, n - 1)] : []), times(m, 2 * n)].filter((x) => formulaTex(x) !== formulaTex(f)).map(formulaOpt)),
		params: { case: `n = ${n}`, formula: s, d: d.value },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimVolumeMolare: Generator = {
	id: ID,
	title: 'Il volume molare',
	levels: {
		1: { label: 'Moli e volume', constraints: ['condizioni normali', 'tre cifre significative'] },
		2: { label: 'Massa e volume', constraints: ['passando dalle moli'] },
		3: { label: 'Molecole e atomi in un volume', constraints: ['numero di Avogadro 6,02 · 10²³'] },
		4: { label: 'La densità di un gas', constraints: ['densità dalla massa molare, o massa molare dalla densità'] },
		5: { label: 'La formula di un gas', constraints: ['formula minima e densità'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimVolumeMolare;
