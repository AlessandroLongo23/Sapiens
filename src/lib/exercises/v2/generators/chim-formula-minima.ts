/**
 * Composizione percentuale, formula minima e formula molecolare. Spec: specs/exercises/chim-formula-minima.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/35-chim-formula-minima.md), each one step harder: the
 * empirical formula of a molecular formula (the indices divided by their greatest common divisor); the percentage of
 * an element from the masses of an analysis; the empirical formula from the percentages when the quotients are whole
 * numbers; the same when they end in 0,5, 0,33 or 0,25 and must be multiplied; the molecular formula from the
 * percentages and the molar mass. Percentages are those of real compounds with the atomic masses of lesson 01, rounded
 * to one decimal. Distractors from the lesson's warnings: the formula not reduced, the percentages used as atoms, a
 * quotient of 1,5 rounded, the empirical formula taken for the molecular one, the mass of the rest of the sample.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, type Formula, MASS100, answerOf, checkCommon, choiceOf, formulaOpt, formulaStr, formulaTex, generateWith, minimal, molar100, parseFormula, pq, q, sig, t, textBlock, times } from '../chim-mole';

export const ID = 'chim-formula-minima';

/** Element names, for "di carbonio", "di ossigeno". */
const NAME: Record<string, string> = { H: 'idrogeno', C: 'carbonio', N: 'azoto', O: 'ossigeno', Na: 'sodio', Mg: 'magnesio', P: 'fosforo', S: 'zolfo', Cl: 'cloro', K: 'potassio', Ca: 'calcio', Fe: 'ferro' };

/** Level 1 and 5: molecules whose indices have a common divisor, with their names after "la formula". */
const MOLECULES: [string, string][] = [
	['C6H12O6', 'del glucosio'],
	['H2O2', "dell'acqua ossigenata"],
	['C2H6', "dell'etano"],
	['C6H6', 'del benzene'],
	['C2H4O2', "dell'acido acetico"],
	['C4H10', 'del butano'],
	['N2O4', 'del tetrossido di diazoto'],
	['P4O10', "dell'anidride fosforica"],
	['C8H18', "dell'ottano"],
	['C2H2', "dell'etino"],
	['C6H12', 'del cicloesano'],
	['C3H6', 'del propene'],
	['C4H8', 'del butene'],
	['N2H4', "dell'idrazina"],
	['C2H4', "dell'etene"],
	['C10H8', 'del naftalene'],
	['C6H8O6', "dell'acido ascorbico"],
	['C8H8', 'dello stirene'],
	['C4H8O2', "dell'acido butanoico"],
	['C2H6O2', 'del glicole etilenico'],
];

/** Level 3: empirical formulas whose quotients are whole numbers. */
const WHOLE = ['CH2O', 'NO2', 'CH', 'CH2', 'CH4', 'NH3', 'H2O', 'CO2', 'SO2', 'SO3', 'CH4O', 'C2H6O', 'NaCl', 'CaCO3', 'MgO', 'K2O', 'Na2SO4', 'CaCl2', 'KCl', 'MgCl2', 'C3H8O', 'CCl4', 'FeS2', 'N2O', 'H2S', 'PCl3', 'CS2', 'C2H5Cl', 'CH3Cl', 'Na2CO3', 'K2SO4', 'MgSO4', 'CaSO4', 'NaNO3', 'KNO3', 'CH3'];
/** Level 4: empirical formulas with a quotient ending in 0,5, 0,33 or 0,25. */
const FRACTION = ['Fe2O3', 'Fe3O4', 'P2O5', 'C2H5', 'N2O3', 'N2O5', 'C3H8', 'C3H4', 'Ca3P2', 'Mg3N2', 'Fe2S3', 'C3H4O3', 'C4H5', 'C3H5', 'P2O3', 'Cl2O7', 'C2H3', 'C5H4', 'C3H7'];

/** Percentages by mass with one decimal, from the formula. */
const percents = (f: Formula) => {
	const M = molar100(f);
	return f.map(([e, k]) => Math.round((MASS100[e] * k * 1000) / M) / 10);
};
const pct = (x: number) => x.toFixed(1);
const pctTex = (x: number) => pct(x).replace('.', '{,}');
/** "40,0 % di carbonio, 6,7 % di idrogeno e 53,3 % di ossigeno". */
function listPercents(f: Formula, p: number[]) {
	const parts = f.map(([e], i) => `${pq(pctTex(p[i]), 'pct')} di ${NAME[e]}`);
	return parts.length === 2 ? `${parts[0]} e ${parts[1]}` : `${parts.slice(0, -1).join(', ')} e ${parts[parts.length - 1]}`;
}
/** "di azoto e ossigeno", "di carbonio, idrogeno e ossigeno". */
const listNames = (f: Formula) => {
	const n = f.map(([e]) => NAME[e]);
	return n.length === 2 ? `${n[0]} e ${n[1]}` : `${n.slice(0, -1).join(', ')} e ${n[n.length - 1]}`;
};

/** The moles of atoms in 100 g, their quotients by the smallest, and the multiplier that makes them whole. */
function procedure(f: Formula, p: number[]) {
	const mol = f.map(([e], i) => (p[i] * 100) / MASS100[e]);
	const min = Math.min(...mol);
	const ratio = mol.map((m) => m / min);
	const mult = [1, 2, 3, 4].find((k) => ratio.every((r) => Math.abs(r * k - Math.round(r * k)) < 0.1));
	if (!mult) throw new Error('no multiplier');
	return { mol, ratio, mult, idx: ratio.map((r) => Math.round(r * mult)) };
}
const fx = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');
const same = (a: Formula, b: Formula) => formulaStr(a) === formulaStr(b);

/** Steps of the procedure, as LaTeX lines. */
function procedureSteps(f: Formula, p: number[], pr: ReturnType<typeof procedure>): string[] {
	return [
		t('In 100 g di composto, le moli di atomi di ogni elemento:'),
		f.map(([e], i) => `\\mathrm{${e}}: \\dfrac{${pctTex(p[i])}}{${fx(MASS100[e] / 100, 2)}} = ${fx(pr.mol[i], 3)}`).join(' \\quad '),
		`${t('Divise per la più piccola: ')} ${f.map(([e], i) => `\\mathrm{${e}}: ${fx(pr.ratio[i], 2)}`).join(' \\quad ')}`,
	];
}

/** Wrong formulas: each index one more or one less. */
function nudged(f: Formula): Formula[] {
	const out: Formula[] = [];
	f.forEach((_, i) => {
		out.push(f.map(([e, k], j) => [e, j === i ? k + 1 : k]));
		if (f[i][1] > 1) out.push(f.map(([e, k], j) => [e, j === i ? k - 1 : k]));
	});
	return out;
}

/** The formula read from the percentages as if they were atoms: the percentages divided by the smallest, rounded. */
function asAtoms(f: Formula, p: number[]): Formula | null {
	const min = Math.min(...p);
	const idx = p.map((x) => Math.round(x / min));
	if (idx.some((k) => k > 20 || k < 1)) return null;
	return f.map(([e], i) => [e, idx[i]]);
}

const formulaChoice = (rng: Rng, right: Formula, wrong: (Formula | null)[]) =>
	choiceOf(
		rng,
		formulaOpt(right),
		wrong.filter((w): w is Formula => w !== null && !same(w, right) && w.every(([, k]) => k >= 1)).map(formulaOpt),
	);

// ---------------------------------------------------------------------------
// Level 1: from the molecular formula

function level1(rng: Rng): Built {
	const [s, name] = rng.pick(MOLECULES);
	const f = parseFormula(s);
	const { f: m, n } = minimal(f);
	const partial = [2, 3, 4, 5].filter((d) => d < n && n % d === 0).map((d) => f.map(([e, k]) => [e, k / d] as [string, number]));
	const firstOnly: Formula = f.map(([e, k], i) => [e, i === 0 ? k / n : k]);
	return {
		prompt: 'Trova la formula minima.',
		problem: textBlock(`La formula molecolare ${name} è $${formulaTex(f)}$. Qual è la sua formula minima?`),
		solution: formulaTex(m),
		steps: [t(`Il massimo comune divisore degli indici è ${n}: si dividono tutti per ${n}.`), `${formulaTex(f)} \\;\\rightarrow\\; ${formulaTex(m)}`],
		// the formula not reduced; reduced only in part; only the first index divided; an index off by one
		answer: formulaChoice(rng, m, [f, ...partial, firstOnly, ...nudged(m)]),
		params: { case: 'molecola', formula: s },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the percentage from an analysis

function level2(rng: Rng): Built {
	for (;;) {
		const s = rng.pick([...WHOLE, ...FRACTION]);
		const f = parseFormula(s);
		const i = rng.int(0, f.length - 1);
		const e = f[i][0];
		const ms = rng.int(100, 999) / 100; // 1,00-9,99 g
		const mx0 = (ms * MASS100[e] * f[i][1]) / molar100(f);
		const mxR = sig(mx0, 3);
		if (!mxR || mxR.value.includes('e') || mx0 < 0.1) continue;
		const mx = Number(mxR.value);
		const exact = (mx / ms) * 100;
		const msS = ms.toFixed(2);
		const rest = ms - mx;
		return {
			prompt: 'Trova la percentuale in massa.',
			problem: textBlock(`Un campione di ${pq(msS.replace('.', '{,}'), 'g')} di un composto di ${listNames(f)} contiene ${pq(mxR.tex, 'g')} di ${NAME[e]}. Qual è la percentuale in massa di ${NAME[e]} nel composto?`),
			solution: `\\%\\mathrm{${e}} \\approx ${q(sig(exact, 3)?.tex ?? '', 'pct')}`,
			steps: [`\\%\\mathrm{${e}} = \\dfrac{m_{\\mathrm{${e}}}}{m_{\\text{campione}}} \\cdot 100 = \\dfrac{${mxR.tex}}{${msS.replace('.', '{,}')}} \\cdot 100 \\approx ${q(sig(exact, 3)?.tex ?? '', 'pct')}`],
			// the ratio upside down; the rest of the sample; the element compared with the rest
			answer: answerOf(rng, exact, [(ms / mx) * 100, (rest / ms) * 100, (mx / rest) * 100], 3, 'pct'),
			params: { case: f.length === 2 ? 'binario' : 'ternario', formula: s, element: e },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: the empirical formula from the percentages

function fromPercents(rng: Rng, pool: string[], level: 3 | 4): Built {
	const s = rng.pick(pool);
	const f = parseFormula(s);
	const p = percents(f);
	const pr = procedure(f, p);
	const right: Formula = f.map(([e], i) => [e, pr.idx[i]]);
	if (!same(right, f)) throw new Error('procedure does not give the formula');
	if ((level === 3) !== (pr.mult === 1)) throw new Error('wrong pool');
	const steps = procedureSteps(f, p, pr);
	if (pr.mult > 1) steps.push(`${t(`Un quoziente non è intero: si moltiplica per ${pr.mult}. `)} ${f.map(([e], i) => `\\mathrm{${e}}: ${fx(pr.ratio[i] * pr.mult, 2)}`).join(' \\quad ')}`);
	steps.push(`${t('Formula minima: ')} ${formulaTex(right)}`);
	const down: Formula = f.map(([e], i) => [e, Math.max(1, Math.floor(pr.ratio[i] + 0.1))]);
	const up: Formula = f.map(([e], i) => [e, Math.ceil(pr.ratio[i] - 0.1)]);
	const swapped: Formula = f.map(([e], i) => [e, right[f.length - 1 - i][1]]);
	const lowest = (w: Formula | null) => w !== null && minimal(w).n === 1;
	const wrong = (level === 3 ? [asAtoms(f, p), swapped, ...nudged(right)] : [down, up, asAtoms(f, p), swapped, ...nudged(right)]).filter(lowest);
	return {
		prompt: 'Trova la formula minima.',
		problem: textBlock(`Un composto contiene ${listPercents(f, p)}. Qual è la sua formula minima?`),
		solution: formulaTex(right),
		steps,
		// L3: the percentages used as atoms, the indices swapped, an index off by one (only formulas in lowest terms);
		// L4: the quotient rounded down or up instead of multiplied, then the same as L3
		answer: formulaChoice(rng, right, wrong),
		params: { case: level === 3 ? 'interi' : `per ${pr.mult}`, formula: s },
	};
}
const level3 = (rng: Rng) => fromPercents(rng, WHOLE, 3);
const level4 = (rng: Rng) => fromPercents(rng, FRACTION, 4);

// ---------------------------------------------------------------------------
// Level 5: the molecular formula

function level5(rng: Rng): Built {
	const [s] = rng.pick(MOLECULES);
	const f = parseFormula(s);
	const { f: m, n } = minimal(f);
	const p = percents(f);
	const pr = procedure(m, p);
	if (!same(m.map(([e], i) => [e, pr.idx[i]]), m)) throw new Error('procedure');
	const M = sig(molar100(f) / 100, 3);
	if (!M) throw new Error('tie');
	const Mmin = molar100(m) / 100;
	const nn = Number(M.value) / Mmin;
	if (Math.abs(nn - n) > 0.05) throw new Error('n not whole');
	const steps = procedureSteps(m, p, pr);
	if (pr.mult > 1) steps.push(`${t(`Si moltiplica per ${pr.mult}: formula minima `)} ${formulaTex(m)}`);
	else steps.push(`${t('Formula minima: ')} ${formulaTex(m)}`);
	steps.push(`M_{\\text{min}} = ${fx(Mmin, 2)}\\,\\text{g/mol} \\qquad n = \\dfrac{${M.tex}}{${fx(Mmin, 2)}} = ${fx(nn, 2)} \\approx ${n}`);
	steps.push(`${t('Formula molecolare: ')} ${formulaTex(f)}`);
	return {
		prompt: 'Trova la formula molecolare.',
		problem: textBlock(`Un composto contiene ${listPercents(m, p)}, e la sua massa molare è ${pq(M.tex, 'gmol')}. Qual è la sua formula molecolare?`),
		solution: formulaTex(f),
		steps,
		// the empirical formula; one unit less or more; twice as many units
		answer: formulaChoice(rng, f, [m, n > 2 ? times(m, n - 1) : null, times(m, n + 1), times(m, 2 * n)]),
		params: { case: `n = ${n}`, formula: s },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimFormulaMinima: Generator = {
	id: ID,
	title: 'Composizione percentuale, formula minima e formula molecolare',
	levels: {
		1: { label: 'Dalla formula molecolare', constraints: ['molecole con indici divisibili', 'scelta tra formule'] },
		2: { label: 'La percentuale in massa', constraints: ['dalle masse di un campione', 'tre cifre significative'] },
		3: { label: 'Dalla composizione alla formula minima', constraints: ['quozienti interi'] },
		4: { label: 'Quando serve moltiplicare', constraints: ['quozienti che finiscono in 0,5, 0,33 o 0,25'] },
		5: { label: 'La formula molecolare', constraints: ['composizione e massa molare'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimFormulaMinima;
