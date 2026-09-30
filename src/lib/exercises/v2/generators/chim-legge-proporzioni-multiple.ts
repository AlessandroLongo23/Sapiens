/**
 * La legge di Dalton delle proporzioni multiple. Spec: specs/exercises/chim-legge-proporzioni-multiple.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/25-chim-legge-proporzioni-multiple.md), each one step
 * harder: two compounds with the same mass of the fixed element, and the ratio of the masses of the other one; the
 * same with different masses of the fixed element; the masses of the compounds, from which the second element is found
 * by difference; the percentages of the fixed element; the formula of the second compound from the formula of the
 * first. The compounds are real (oxides of carbon, nitrogen, sulfur, iron, phosphorus, sodium; water and hydrogen
 * peroxide; four hydrocarbons), the masses come from the atomic masses of lesson 01 and are written with three
 * significant figures. Distractors from the lesson's warnings: the ratio upside down, the masses compared without
 * fixing the other element, the mass of the compound taken for the mass of the element, the percentages compared.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Built, MASS, NAME, checkCommon, choose, dc, formulaOpt, fx, gcd, generateWith, nearTie, pf, ratioOpt, sig, t, textBlock } from '../chim-trasformazioni';

export const ID = 'chim-legge-proporzioni-multiple';

type Comp = { f: string; a: number; b: number };
type Series = { x: string; y: string; comps: Comp[] };

const SERIES: Series[] = [
	{ x: 'C', y: 'O', comps: [{ f: 'CO', a: 1, b: 1 }, { f: 'CO2', a: 1, b: 2 }] },
	{
		x: 'N',
		y: 'O',
		comps: [
			{ f: 'N2O', a: 2, b: 1 },
			{ f: 'NO', a: 1, b: 1 },
			{ f: 'N2O3', a: 2, b: 3 },
			{ f: 'NO2', a: 1, b: 2 },
			{ f: 'N2O5', a: 2, b: 5 },
		],
	},
	{ x: 'S', y: 'O', comps: [{ f: 'SO2', a: 1, b: 2 }, { f: 'SO3', a: 1, b: 3 }] },
	{ x: 'H', y: 'O', comps: [{ f: 'H2O', a: 2, b: 1 }, { f: 'H2O2', a: 2, b: 2 }] },
	{ x: 'Fe', y: 'O', comps: [{ f: 'FeO', a: 1, b: 1 }, { f: 'Fe2O3', a: 2, b: 3 }] },
	{ x: 'P', y: 'O', comps: [{ f: 'P2O3', a: 2, b: 3 }, { f: 'P2O5', a: 2, b: 5 }] },
	{ x: 'Na', y: 'O', comps: [{ f: 'Na2O', a: 2, b: 1 }, { f: 'Na2O2', a: 2, b: 2 }] },
	{
		x: 'C',
		y: 'H',
		comps: [
			{ f: 'CH4', a: 1, b: 4 },
			{ f: 'C2H6', a: 2, b: 6 },
			{ f: 'C2H4', a: 2, b: 4 },
			{ f: 'C2H2', a: 2, b: 2 },
		],
	},
];

/** Grams of Y joined to 1 g of X in X_aY_b. */
const perGram = (s: Series, c: Comp) => (c.b * MASS[s.y]) / (c.a * MASS[s.x]);

/** The simple ratios the options are made of (second : first). */
const SIMPLE: [number, number][] = [];
for (let p = 1; p <= 5; p++) for (let q = 1; q <= 5; q++) if (p !== q && gcd(p, q) === 1) SIMPLE.push([p, q]);

/** The simple ratio nearest to x, other than `not`. */
function nearest(x: number, not: [number, number][] = []): [number, number] {
	const ok = SIMPLE.filter(([p, q]) => !not.some(([a, b]) => a * q === b * p));
	return ok.reduce((best, r) => (Math.abs(Math.log(r[0] / r[1] / x)) < Math.abs(Math.log(best[0] / best[1] / x)) ? r : best));
}
/** Options for the right ratio, the mistakes (as values) and neighbours. */
function ratioAnswer(rng: Rng, p: number, q: number, mistakes: number[]) {
	const right: [number, number] = [p, q];
	const wrong: [number, number][] = [[q, p]];
	for (const m of mistakes) wrong.push(nearest(m, [right]));
	const near = [...SIMPLE].filter(([a, b]) => a * q !== b * p).sort((r, s) => Math.abs(Math.log(r[0] / r[1] / (p / q))) - Math.abs(Math.log(s[0] / s[1] / (p / q))));
	return choose(rng, ratioOpt(p, q), wrong.map(([a, b]) => ratioOpt(a, b)), near.map(([a, b]) => ratioOpt(a, b)));
}

/** A mass in grams, three significant figures, from 1,00 to 9,99 g (as a string with a point). */
const mass3 = (rng: Rng) => (rng.int(100, 999) / 100).toFixed(2);
/** x rounded to three significant figures, or null near a tie or out of 0,1-99,9. */
function r3(x: number): string | null {
	if (x < 0.1 || x >= 99.95 || nearTie(x, 3, 1e-7)) return null;
	const r = sig(x, 3);
	return r.replace('.', '').replace(/^0+/, '').length === 3 ? r : null;
}
const g = (s: string) => `$${dc(s)}\\,\\text{g}$`;
const gt = (s: string) => `${dc(s)}\\,\\text{g}`;

/** Two compounds of a series, in random order, the second with the reduced ratio p : q to the first. */
function pair(rng: Rng) {
	const s = rng.pick(SERIES);
	const i = rng.int(0, s.comps.length - 1);
	let j = rng.int(0, s.comps.length - 2);
	if (j >= i) j += 1;
	const c1 = s.comps[i], c2 = s.comps[j];
	const num = c2.b * c1.a, den = c2.a * c1.b;
	const k = gcd(num, den);
	return { s, c1, c2, p: num / k, q: den / k };
}

const intro = (s: Series) => `Due composti diversi sono fatti solo di ${NAME[s.x]} e ${NAME[s.y]}.`;
const question = (s: Series) => `In che rapporto stanno la massa di ${NAME[s.y]} del secondo composto e quella del primo, per la stessa massa di ${NAME[s.x]}?`;

// ---------------------------------------------------------------------------
// Level 1: the same mass of X

function level1(rng: Rng): Built {
	for (;;) {
		const { s, c1, c2, p, q } = pair(rng);
		const m = mass3(rng);
		const y1 = r3(Number(m) * perGram(s, c1)), y2 = r3(Number(m) * perGram(s, c2));
		if (!y1 || !y2) continue;
		const ratio = Number(y2) / Number(y1);
		return {
			prompt: 'Trova il rapporto.',
			problem: textBlock(`${intro(s)} Nel primo ${g(m)} di ${NAME[s.x]} sono uniti a ${g(y1)} di ${NAME[s.y]}; nel secondo gli stessi ${g(m)} di ${NAME[s.x]} sono uniti a ${g(y2)} di ${NAME[s.y]}. ${question(s)}`),
			solution: `${p} : ${q}`,
			steps: [t(`La massa di ${NAME[s.x]} è la stessa: si confrontano le masse di ${NAME[s.y]}.`), `\\dfrac{${gt(y2)}}{${gt(y1)}} = ${dc(ratio.toFixed(3))} \\approx ${fr(p, q)}`],
			answer: ratioAnswer(rng, p, q, []),
			params: { case: s.x + s.y, first: c1.f, second: c2.f, m, y1, y2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: different masses of X

function level2(rng: Rng): Built {
	for (;;) {
		const { s, c1, c2, p, q } = pair(rng);
		const m1 = mass3(rng), m2 = mass3(rng);
		if (Math.abs(Number(m1) / Number(m2) - 1) < 0.25) continue;
		const y1 = r3(Number(m1) * perGram(s, c1)), y2 = r3(Number(m2) * perGram(s, c2));
		if (!y1 || !y2) continue;
		const raw = Number(y2) / Number(y1);
		const [rp, rq] = nearest(raw);
		if (rp * q === rq * p) continue; // the mistake would give the right answer
		const k1 = Number(y1) / Number(m1), k2 = Number(y2) / Number(m2);
		return {
			prompt: 'Trova il rapporto.',
			problem: textBlock(`${intro(s)} Nel primo ${g(m1)} di ${NAME[s.x]} sono uniti a ${g(y1)} di ${NAME[s.y]}; nel secondo ${g(m2)} di ${NAME[s.x]} sono uniti a ${g(y2)} di ${NAME[s.y]}. ${question(s)}`),
			solution: `${p} : ${q}`,
			steps: [
				t(`Le masse di ${NAME[s.x]} sono diverse: prima si trova la massa di ${NAME[s.y]} per 1 g di ${NAME[s.x]}.`),
				`\\text{primo: } \\dfrac{${gt(y1)}}{${gt(m1)}} = ${dc(k1.toFixed(4))} \\qquad \\text{secondo: } \\dfrac{${gt(y2)}}{${gt(m2)}} = ${dc(k2.toFixed(4))}`,
				`\\dfrac{${dc(k2.toFixed(4))}}{${dc(k1.toFixed(4))}} = ${dc((k2 / k1).toFixed(3))} \\approx ${fr(p, q)}`,
			],
			// the masses of Y compared as they are
			answer: ratioAnswer(rng, p, q, [raw]),
			params: { case: s.x + s.y, first: c1.f, second: c2.f, m1, y1, m2, y2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the masses of the compounds

function level3(rng: Rng): Built {
	for (;;) {
		const { s, c1, c2, p, q } = pair(rng);
		const m1 = mass3(rng), m2 = mass3(rng);
		if (Math.abs(Number(m1) / Number(m2) - 1) < 0.25) continue;
		const y1 = r3(Number(m1) * perGram(s, c1)), y2 = r3(Number(m2) * perGram(s, c2));
		if (!y1 || !y2) continue;
		// the masses of the compounds, written with the decimals of the data
		const d = (a: string, b: string) => Math.min(a.split('.')[1]?.length ?? 0, b.split('.')[1]?.length ?? 0);
		const tot1 = (Number(m1) + Number(y1)).toFixed(d(m1, y1)), tot2 = (Number(m2) + Number(y2)).toFixed(d(m2, y2));
		if (Number(tot1) >= 100 || Number(tot2) >= 100) continue;
		const Y1 = Number(tot1) - Number(m1), Y2 = Number(tot2) - Number(m2);
		if (Math.abs(Y1 / Number(y1) - 1) > 0.01 || Math.abs(Y2 / Number(y2) - 1) > 0.01) continue; // the difference keeps the data's precision
		const k1 = Y1 / Number(m1), k2 = Y2 / Number(m2);
		const [xp, xq] = nearest(k2 / k1);
		if (xp !== p || xq !== q) continue; // the rounding of the totals must not change the answer
		const forgot = Number(tot2) / Number(m2) / (Number(tot1) / Number(m1));
		if (nearest(forgot)[0] * q === nearest(forgot)[1] * p) continue;
		return {
			prompt: 'Trova il rapporto.',
			problem: textBlock(
				`${intro(s)} Un campione di ${g(tot1)} del primo contiene ${g(m1)} di ${NAME[s.x]}; un campione di ${g(tot2)} del secondo contiene ${g(m2)} di ${NAME[s.x]}. ${question(s)}`,
			),
			solution: `${p} : ${q}`,
			steps: [
				t(`La massa di ${NAME[s.y]} è la differenza tra la massa del campione e quella di ${NAME[s.x]}:`),
				`${gt(tot1)} - ${gt(m1)} = ${gt(Y1.toFixed(2))} \\qquad ${gt(tot2)} - ${gt(m2)} = ${gt(Y2.toFixed(2))}`,
				`\\text{per 1 g di ${NAME[s.x]}: } ${dc(k1.toFixed(4))} \\text{ e } ${dc(k2.toFixed(4))}, \\qquad \\dfrac{${dc(k2.toFixed(4))}}{${dc(k1.toFixed(4))}} = ${dc((k2 / k1).toFixed(3))} \\approx ${fr(p, q)}`,
			],
			// the mass of the compound taken for the mass of Y
			answer: ratioAnswer(rng, p, q, [forgot]),
			params: { case: s.x + s.y, first: c1.f, second: c2.f, tot1, m1, tot2, m2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: percentages

function level4(rng: Rng): Built {
	for (;;) {
		const { s, c1, c2, p, q } = pair(rng);
		const pc = (c: Comp) => (100 * c.a * MASS[s.x]) / (c.a * MASS[s.x] + c.b * MASS[s.y]);
		const x1 = r3(pc(c1)), x2 = r3(pc(c2));
		if (!x1 || !x2) continue;
		const y1 = 100 - Number(x1), y2 = 100 - Number(x2);
		const k1 = y1 / Number(x1), k2 = y2 / Number(x2);
		const [xp, xq] = nearest(k2 / k1);
		if (xp !== p || xq !== q) continue;
		const cmpY = y2 / y1, cmpX = Number(x2) / Number(x1);
		const d = (v: number) => dc(v.toFixed(x1.includes('.') ? x1.split('.')[1].length : 0));
		return {
			prompt: 'Trova il rapporto.',
			problem: textBlock(`${intro(s)} Il primo contiene il $${dc(x1)}\\%$ di ${NAME[s.x]}, il secondo il $${dc(x2)}\\%$. ${question(s)}`),
			solution: `${p} : ${q}`,
			steps: [
				t(`In 100 g di ogni composto: il primo ha ${dc(x1)} g di ${NAME[s.x]} e ${d(y1)} g di ${NAME[s.y]}, il secondo ${dc(x2)} g e ${d(y2)} g.`),
				`\\text{per 1 g di ${NAME[s.x]}: } \\dfrac{${d(y1)}}{${dc(x1)}} = ${dc(k1.toFixed(4))} \\qquad \\dfrac{${d(y2)}}{${dc(x2)}} = ${dc(k2.toFixed(4))}`,
				`\\dfrac{${dc(k2.toFixed(4))}}{${dc(k1.toFixed(4))}} = ${dc((k2 / k1).toFixed(3))} \\approx ${fr(p, q)}`,
			],
			// the percentages of Y, or of X, compared
			answer: ratioAnswer(rng, p, q, [cmpY, cmpX]),
			params: { case: s.x + s.y, first: c1.f, second: c2.f, x1, x2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the formula of the second compound

/** a/b as LaTeX, a whole number when b is 1. */
const fr = (a: number, b: number) => (b === 1 ? String(a) : `\\dfrac{${a}}{${b}}`);
/** "c'è 1 atomo", "ci sono 3 atomi". */
const atoms = (n: number) => (n === 1 ? "c'è 1 atomo" : `ci sono ${n} atomi`);

/** A formula X_cY_d written plainly ("N2O5", "CO"). */
const plain = (s: Series, c: number, d: number) => `${s.x}${c === 1 ? '' : c}${s.y}${d === 1 ? '' : d}`;

function level5(rng: Rng): Built {
	for (;;) {
		const { s, c1, c2, p, q } = pair(rng);
		const m1 = mass3(rng), m2 = mass3(rng);
		if (Math.abs(Number(m1) / Number(m2) - 1) < 0.25) continue;
		const y1 = r3(Number(m1) * perGram(s, c1)), y2 = r3(Number(m2) * perGram(s, c2));
		if (!y1 || !y2) continue;
		const right = c2.f;
		const v = c2.b / c2.a;
		// real compounds of the series with another ratio, then made-up formulas: the ratio upside down, the raw masses
		const opts: ChoiceOption[] = [];
		const seen = new Set<number>([v]);
		const add = (f: string, r: number) => {
			if ([...seen].some((x) => Math.abs(x - r) < 1e-9)) return;
			seen.add(r);
			opts.push(formulaOpt(f));
		};
		const inv = (c1.b / c1.a) * (q / p); // the ratio read upside down
		const small = (r: number) => {
			for (let c = 1; c <= 4; c++) for (let dd = 1; dd <= 7; dd++) if (Math.abs(dd / c - r) < 1e-9) return plain(s, c, dd);
			return null;
		};
		const fi = small(inv);
		if (fi) add(fi, inv);
		for (const c of s.comps) if (c !== c1) add(c.f, c.b / c.a);
		for (const r of [2 * v, v / 2, 3 * v, v * 1.5, v / 3, (2 * v) / 3]) {
			const f = small(r);
			if (f && f !== c1.f) add(f, r);
		}
		if (opts.length < 3) continue;
		const k1 = Number(y1) / Number(m1), k2 = Number(y2) / Number(m2);
		return {
			prompt: 'Scegli la formula.',
			problem: textBlock(
				`${intro(s)} Il primo è ${pf(c1.f)}: ${g(m1)} di ${NAME[s.x]} sono uniti a ${g(y1)} di ${NAME[s.y]}. Nel secondo ${g(m2)} di ${NAME[s.x]} sono uniti a ${g(y2)} di ${NAME[s.y]}. Qual è la formula del secondo?`,
			),
			solution: fx(right),
			steps: [
				`\\text{per 1 g di ${NAME[s.x]}: } \\dfrac{${gt(y1)}}{${gt(m1)}} = ${dc(k1.toFixed(4))} \\qquad \\dfrac{${gt(y2)}}{${gt(m2)}} = ${dc(k2.toFixed(4))}`,
				`\\dfrac{${dc(k2.toFixed(4))}}{${dc(k1.toFixed(4))}} = ${dc((k2 / k1).toFixed(3))} \\approx ${fr(p, q)}`,
				t(`Nel primo ${atoms(c1.b)} di ${NAME[s.y]} ogni ${c1.a} di ${NAME[s.x]}; nel secondo, per lo stesso numero di atomi di ${NAME[s.x]}, gli atomi di ${NAME[s.y]} stanno nel rapporto ${p} : ${q}:`),
				`${fr(c1.b, c1.a)} \\cdot ${fr(p, q)} = ${c2.a === 1 ? String(c2.b) : `\\dfrac{${c2.b}}{${c2.a}}`} \\quad\\Rightarrow\\quad ${fx(right)}`,
			],
			answer: choose(rng, formulaOpt(right), opts),
			params: { case: s.x + s.y, first: c1.f, m1, y1, m2, y2 },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimLeggeProporzioniMultiple: Generator = {
	id: ID,
	title: 'La legge di Dalton delle proporzioni multiple',
	levels: {
		1: { label: 'La stessa massa', constraints: ["stessa massa dell'elemento fisso", 'masse con tre cifre significative'] },
		2: { label: 'Masse diverse', constraints: ["masse diverse dell'elemento fisso"] },
		3: { label: 'Dalla massa del composto', constraints: ['la massa del secondo elemento per differenza'] },
		4: { label: 'Dalle percentuali', constraints: ["percentuale in massa dell'elemento fisso"] },
		5: { label: 'La formula del secondo', constraints: ['formula del primo composto nota'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimLeggeProporzioniMultiple;
