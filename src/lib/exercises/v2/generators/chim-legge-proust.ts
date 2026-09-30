/**
 * La legge di Proust. Spec: specs/exercises/chim-legge-proust.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/24-chim-legge-proust.md), each one step harder: the
 * combining ratio from the masses of an experiment; the mass of one element that combines with a given mass of the
 * other, from the ratio; the percentage of an element in the compound, or the mass of an element from its percentage;
 * the reactant in excess and how much of it is left; the mass of the compound when one reactant is in excess.
 *
 * The ratios are those of the lesson (heavier element first): copper and sulfur 3,96, iron and sulfur 1,74, magnesium
 * and oxygen 1,52, oxygen and hydrogen 7,92, chlorine and sodium 1,54, oxygen and carbon 2,66. Data have three
 * significant figures; products and quotients are rounded to three significant figures, sums and differences to the
 * decimals of the data, as the lesson does. Numbers are refused when the result falls near a rounding tie.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkCommon, choose, dt, fixed, gOpt, gq, generateWith, numOpt, pg, sig, t, textBlock } from '../chim-leggi-ponderali';

export const ID = 'chim-legge-proust';

/** A compound: the heavier element A, the lighter B, and m_A / m_B. */
export interface Pair {
	composto: string;
	a: string;
	b: string;
	sa: string;
	sb: string;
	ratio: number;
}
export const PAIRS: Pair[] = [
	{ composto: 'solfuro di rame', a: 'rame', b: 'zolfo', sa: 'Cu', sb: 'S', ratio: 3.96 },
	{ composto: 'solfuro di ferro', a: 'ferro', b: 'zolfo', sa: 'Fe', sb: 'S', ratio: 1.74 },
	{ composto: 'ossido di magnesio', a: 'magnesio', b: 'ossigeno', sa: 'Mg', sb: 'O', ratio: 1.52 },
	{ composto: 'acqua', a: 'ossigeno', b: 'idrogeno', sa: 'O', sb: 'H', ratio: 7.92 },
	{ composto: 'cloruro di sodio', a: 'cloro', b: 'sodio', sa: 'Cl', sb: 'Na', ratio: 1.54 },
	{ composto: 'diossido di carbonio', a: 'ossigeno', b: 'carbonio', sa: 'O', sb: 'C', ratio: 2.66 },
];

const R = (p: Pair) => `\\dfrac{m_{\\mathrm{${p.sa}}}}{m_{\\mathrm{${p.sb}}}}`;
/** $m_{\mathrm{Cu}}/m_{\mathrm{S}}$ in prose. */
const Rsym = (p: Pair) => `$m_{\\mathrm{${p.sa}}}/m_{\\mathrm{${p.sb}}}$`;
/** "del rame", "dello zolfo", "dell'ossigeno". */
function di(x: string) {
	return /^(z|s[^aeiou])/.test(x) ? `dello ${x}` : /^[aeiou]/.test(x) ? `dell'${x}` : `del ${x}`;
}
/** "il rame", "lo zolfo", "l'ossigeno". */
function det(x: string) {
	return /^(z|s[^aeiou])/.test(x) ? `lo ${x}` : /^[aeiou]/.test(x) ? `l'${x}` : `il ${x}`;
}
/** "Nel solfuro di rame", "Nell'acqua". */
const nel = (x: string) => (/^[aeiou]/.test(x) ? `Nell'${x}` : `Nel ${x}`);
/** "il 60,3%", "l'11,2%", "l'88,8%": the article of a percentage, as it is read. */
const ilPc = (pc: string) => (/^(8|11|18)/.test(pc.replace('.', '')) && !/^1[0-9]{2}/.test(pc) ? `l'$${dt(pc)}\\%$` : `il $${dt(pc)}\\%$`);
const Rin = (p: Pair) => `$m_{\\mathrm{${p.sa}}}/m_{\\mathrm{${p.sb}}} = ${dt(p.ratio.toFixed(2))}$`;
/** A mass in grams with three significant figures between lo and hi (as a decimal string), or null. */
function mass3(rng: Rng, lo: number, hi: number): string {
	for (;;) {
		const x = lo + rng.next() * (hi - lo);
		const s = sig(x, 3);
		if (s && !/0$/.test(s.replace('.', '')) ) return s;
	}
}
const fallback = (x: number, n = 3) => [x * 1.1, x * 0.9, x * 1.2, x * 0.8, x * 1.3].map((v) => sig(v, n)).filter((v): v is string => v !== null);

// ---------------------------------------------------------------------------
// Level 1: the ratio from an experiment

function level1(rng: Rng): Built {
	for (;;) {
		const p = rng.pick(PAIRS);
		const mb = mass3(rng, 0.5, 9.99);
		const ma = sig(Number(mb) * p.ratio * (1 + (rng.next() - 0.5) * 0.01), 3);
		if (!ma) continue;
		const r = Number(ma) / Number(mb);
		const ans = sig(r, 3);
		if (!ans || Math.abs(Number(ans) - p.ratio) > 0.025) continue;
		const inv = sig(1 / r, 3);
		const frac = sig(Number(ma) / (Number(ma) + Number(mb)), 3);
		const whole = sig((Number(ma) + Number(mb)) / Number(mb), 3);
		return {
			prompt: 'Trova il rapporto di combinazione.',
			problem: textBlock(`In un esperimento ${pg(ma)} di ${p.a} si combinano completamente con ${pg(mb)} di ${p.b} e formano ${p.composto}. Quanto vale il rapporto di combinazione ${Rsym(p)}?`),
			solution: dt(ans),
			steps: [`${R(p)} = \\dfrac{${gq(ma)}}{${gq(mb)}} = ${dt(r.toFixed(4))}\\ldots \\approx ${dt(ans)}`, t('È un numero puro: i grammi si semplificano.')],
			// upside down; the element over the compound; the compound over the element
			answer: choose(rng, numOpt(ans), [inv, frac, whole].filter((v): v is string => v !== null).map(numOpt), fallback(r).map(numOpt)),
			params: { case: p.composto, ma, mb },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the mass that combines

function level2(rng: Rng): Built {
	for (;;) {
		const p = rng.pick(PAIRS);
		const givenA = rng.next() < 0.5;
		const m = givenA ? mass3(rng, 1, 30) : mass3(rng, 0.5, 9.99);
		const x = givenA ? Number(m) / p.ratio : Number(m) * p.ratio;
		const ans = sig(x, 3);
		if (!ans) continue;
		const wrong = sig(givenA ? Number(m) * p.ratio : Number(m) / p.ratio, 3); // the ratio used the wrong way
		const comp = sig(givenA ? Number(m) / p.ratio + Number(m) : Number(m) * p.ratio + Number(m), 3); // the compound
		const other = sig(givenA ? Number(m) / (p.ratio + 1) : (Number(m) * (p.ratio + 1)), 3); // the ratio to the compound
		const [known, want] = givenA ? [p.a, p.b] : [p.b, p.a];
		return {
			prompt: `Trova la massa ${givenA ? 'del secondo elemento' : 'del primo elemento'}.`,
			problem: textBlock(`${nel(p.composto)} il rapporto di combinazione è ${Rin(p)}. Quanti grammi di ${want} si combinano con ${pg(m)} di ${known}?`),
			solution: gq(ans),
			steps: [
				textBlock(`Nel composto la massa ${di(p.a)} è ${dt(p.ratio.toFixed(2))} volte quella ${di(p.b)}: ${givenA ? 'si divide' : 'si moltiplica'}.`),
				givenA ? `m_{\\mathrm{${p.sb}}} = \\dfrac{${gq(m)}}{${dt(p.ratio.toFixed(2))}} = ${gq(ans)}` : `m_{\\mathrm{${p.sa}}} = ${dt(p.ratio.toFixed(2))} \\cdot ${gq(m)} = ${gq(ans)}`,
			],
			answer: choose(rng, gOpt(ans), [wrong, comp, other].filter((v): v is string => v !== null).map((v) => gOpt(v)), fallback(x).map((v) => gOpt(v))),
			params: { case: givenA ? 'dal primo' : 'dal secondo', pair: p.composto, m },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: percentages

function level3(rng: Rng): Built {
	for (;;) {
		const p = rng.pick(PAIRS);
		const toPercent = rng.next() < 0.5;
		if (toPercent) {
			const mb = mass3(rng, 0.5, 9.99);
			const ma = sig(Number(mb) * p.ratio, 3);
			if (!ma) continue;
			const mc = Number(ma) + Number(mb);
			const d = Math.min(ma.split('.')[1]?.length ?? 0, mb.split('.')[1]?.length ?? 0);
			const mcS = fixed(mc, d);
			if (!mcS) continue;
			const askA = rng.next() < 0.5;
			const el = askA ? p.a : p.b;
			const mel = askA ? ma : mb;
			const pc = (Number(mel) / Number(mcS)) * 100;
			const ans = sig(pc, 3);
			if (!ans || pc >= 99.95) continue;
			const other = sig(100 - Number(ans), 3);
			const byOther = sig((Number(mel) / Number(askA ? mb : ma)) * 100, 3);
			return {
				prompt: 'Trova la percentuale in massa.',
				problem: textBlock(`Un campione di ${pg(mcS)} di ${p.composto} contiene ${pg(mel)} di ${el}. Qual è la percentuale in massa ${di(el)} nel composto?`),
				solution: `${dt(ans)}\\%`,
				steps: [`\\%\\,\\text{${el}} = \\dfrac{${gq(mel)}}{${gq(mcS)}} \\cdot 100 = ${dt(ans)}\\%`],
				// the other element's share; the element over the other element
				answer: choose(rng, pcOpt(ans), [other, byOther].filter((v): v is string => v !== null && Number(v) < 1000).map(pcOpt), fallback(pc).filter((v) => Number(v) < 100).map(pcOpt)),
				params: { case: 'percentuale', pair: p.composto, mc: mcS, mel },
			};
		}
		// the mass of an element from its percentage
		const askA = rng.next() < 0.5;
		const pcA = (p.ratio / (p.ratio + 1)) * 100;
		const pcS = sig(askA ? pcA : 100 - pcA, 3);
		if (!pcS) continue;
		const el = askA ? p.a : p.b;
		const mc = mass3(rng, 10, 99.9);
		const x = (Number(mc) * Number(pcS)) / 100;
		const ans = sig(x, 3);
		if (!ans) continue;
		const rest = sig(Number(mc) - x, 3);
		const bad = sig(Number(mc) / Number(pcS), 3);
		return {
			prompt: "Trova la massa dell'elemento.",
			problem: textBlock(`${nel(p.composto)} ${det(el)} è ${ilPc(pcS)} della massa. Quanti grammi di ${el} ci sono in ${pg(mc)} di ${p.composto}?`),
			solution: gq(ans),
			steps: [`m = ${gq(mc)} \\cdot \\dfrac{${dt(pcS)}}{100} = ${gq(ans)}`],
			// the rest of the compound; divided by the percentage
			answer: choose(rng, gOpt(ans), [rest, bad].filter((v): v is string => v !== null).map((v) => gOpt(v)), fallback(x).map((v) => gOpt(v))),
			params: { case: 'massa', pair: p.composto, pc: pcS, mc },
		};
	}
}
const pcOpt = (s: string) => ({ latex: `${dt(s)}\\%`, values: [s] });

// ---------------------------------------------------------------------------
// Levels 4 and 5: a reactant in excess

interface Excess {
	p: Pair;
	ma: string;
	mb: string;
	aLimits: boolean;
	usedA: string;
	usedB: string;
	left: string;
	product: string;
	steps: string[];
}

/** Two masses not in the ratio; which reacts completely, what is used, what is left and the compound (2 decimals). */
function excess(rng: Rng): Excess | null {
	const p = rng.pick(PAIRS);
	const ma = mass3(rng, 1, 20);
	const mb = mass3(rng, 0.5, 9.99);
	if (!/\.\d\d$/.test(ma) || !/\.\d\d$/.test(mb)) return null; // both to the hundredth, so the leftover has two decimals
	const needB = Number(ma) / p.ratio;
	if (Math.abs(needB - Number(mb)) / Number(mb) < 0.08) return null; // clearly one or the other
	const aLimits = needB < Number(mb);
	const usedS = aLimits ? sig(needB, 3) : sig(Number(mb) * p.ratio, 3);
	if (!usedS || !/\.\d\d$/.test(usedS) ) return null;
	const usedA = aLimits ? ma : usedS;
	const usedB = aLimits ? usedS : mb;
	const leftN = aLimits ? Number(mb) - Number(usedB) : Number(ma) - Number(usedA);
	const left = leftN.toFixed(2);
	const product = (Number(usedA) + Number(usedB)).toFixed(2);
	if (leftN < 0.05) return null;
	const steps = aLimits
		? [
				textBlock(`Per far reagire ${det(p.a)} servono ${pg(usedS)} di ${p.b}, e ce ne sono ${pg(mb)}: ${det(p.a)} reagisce tutto, e ${det(p.b)} è in eccesso.`),
				`m_{\\mathrm{${p.sb}}} = \\dfrac{${gq(ma)}}{${dt(p.ratio.toFixed(2))}} = ${gq(usedS)}`,
			]
		: [
				textBlock(`Per far reagire ${det(p.a)} servirebbero ${pg(sig(needB, 3) ?? '')} di ${p.b}, ma ce ne sono solo ${pg(mb)}: ${det(p.b)} reagisce tutto, e in eccesso c'è ${det(p.a)}.`),
				`m_{\\mathrm{${p.sa}}} = ${dt(p.ratio.toFixed(2))} \\cdot ${gq(mb)} = ${gq(usedS)}`,
			];
	return { p, ma, mb, aLimits, usedA, usedB, left, product, steps };
}

function level4(rng: Rng): Built {
	for (;;) {
		const e = excess(rng);
		if (!e) continue;
		const { p } = e;
		const exc = e.aLimits ? p.b : p.a;
		const lim = e.aLimits ? p.a : p.b;
		const opt = (v: string, el: string) => gOpt(v, `di ${el}`);
		// the same leftover of the other element; the used part of the excess; the difference of the masses; the ratio upside down
		const inv = e.aLimits ? Number(e.mb) - Number(e.ma) * p.ratio : Number(e.ma) - Number(e.mb) / p.ratio;
		const mistakes = [opt(e.left, lim), opt(e.aLimits ? e.usedB : e.usedA, exc), opt(Math.abs(Number(e.ma) - Number(e.mb)).toFixed(2), exc)];
		if (inv > 0) mistakes.push(opt(inv.toFixed(2), exc));
		return {
			prompt: 'Trova il reagente in eccesso.',
			problem: textBlock(`Si fanno reagire ${pg(e.ma)} di ${p.a} con ${pg(e.mb)} di ${p.b}. ${nel(p.composto)} il rapporto di combinazione è ${Rin(p)}. Quale elemento avanza, e quanto?`),
			solution: `${gq(e.left)}\\ \\text{di ${exc}}`,
			steps: [...e.steps, `${gq(e.aLimits ? e.mb : e.ma)} - ${gq(e.aLimits ? e.usedB : e.usedA)} = ${gq(e.left)}\\ \\text{di ${exc}}`],
			answer: choose(rng, opt(e.left, exc), mistakes, [opt((Number(e.left) + 0.5).toFixed(2), exc), opt((Number(e.left) + 1).toFixed(2), lim)]),
			params: { case: e.aLimits ? 'avanza il secondo' : 'avanza il primo', pair: p.composto, ma: e.ma, mb: e.mb },
		};
	}
}

function level5(rng: Rng): Built {
	for (;;) {
		const e = excess(rng);
		if (!e) continue;
		const { p } = e;
		// everything put in; the reactant in excess taken as the one that reacts completely; the leftover subtracted again
		const all = (Number(e.ma) + Number(e.mb)).toFixed(2);
		const swapped = e.aLimits ? Number(e.mb) * (p.ratio + 1) : Number(e.ma) * (1 + 1 / p.ratio);
		const mistakes = [all, swapped.toFixed(2), (Number(e.product) - Number(e.left)).toFixed(2)].filter((v) => Number(v) > 0);
		return {
			prompt: 'Trova la massa del composto.',
			problem: textBlock(`Si fanno reagire ${pg(e.ma)} di ${p.a} con ${pg(e.mb)} di ${p.b}. ${nel(p.composto)} il rapporto di combinazione è ${Rin(p)}. Quanti grammi di ${p.composto} si formano?`),
			solution: gq(e.product),
			steps: [...e.steps, textBlock('Il composto è la somma delle masse che reagiscono:'), `${gq(e.usedA)} + ${gq(e.usedB)} = ${gq(e.product)}`],
			answer: choose(rng, gOpt(e.product), mistakes.map((v) => gOpt(v)), [(Number(e.product) * 1.1).toFixed(2), (Number(e.product) * 0.9).toFixed(2), (Number(e.product) + 1).toFixed(2)].map((v) => gOpt(v))),
			params: { case: e.aLimits ? 'avanza il secondo' : 'avanza il primo', pair: p.composto, ma: e.ma, mb: e.mb },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimLeggeProust: Generator = {
	id: ID,
	title: 'La legge di Proust',
	levels: {
		1: { label: 'Il rapporto di combinazione', constraints: ['dalle masse di un esperimento', 'tre cifre significative'] },
		2: { label: 'La massa che si combina', constraints: ['si moltiplica o si divide per il rapporto'] },
		3: { label: 'La composizione percentuale', constraints: ['la percentuale, o la massa dalla percentuale'] },
		4: { label: 'Il reagente in eccesso', constraints: ['quale elemento avanza e quanto'] },
		5: { label: 'Il composto con un reagente in eccesso', constraints: ['solo le masse che reagiscono'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimLeggeProust;
