/**
 * Numero atomico, numero di massa e isotopi. Spec: specs/exercises/numero-massa.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/42-numero-massa.md), each one step harder: the protons,
 * neutrons or electrons of a neutral atom from its symbol; the symbol from the particles; the particles of an ion; the
 * isotope of an atom among nuclides with the same A or the same N; the average atomic mass from the isotopes; the
 * abundance of an isotope from the average mass. Real nuclides (the stable isotopes of the first 36 elements, with
 * hydrogen-3 and carbon-14) and real isotopic data (IUPAC 2021, masses and abundances rounded as the lesson does), plus
 * an unnamed element with made-up isotopes in half of levels 5 and 6. Distractors from the lesson's warnings: A taken
 * for the neutrons, A and Z swapped, the charge added to the electrons of a cation, isotopes confused with nuclides of
 * the same A, the plain average, the abundances swapped, the mass numbers for the masses.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, ELEMENTS, checkChoice, choose, decTex, generateWith, nuclide, textBlock, texOpt } from '../chim-atomo';

export const ID = 'numero-massa';

const some = <T,>(xs: (T | null)[]) => xs.filter((x): x is T => x !== null);
const intOpt = (x: number) => texOpt(String(x), String(x));

/** Mass numbers of the stable isotopes of the first 36 elements, with hydrogen-3 and carbon-14. */
export const ISOTOPES: Record<number, number[]> = {
	1: [1, 2, 3], 2: [3, 4], 3: [6, 7], 4: [9], 5: [10, 11], 6: [12, 13, 14], 7: [14, 15], 8: [16, 17, 18], 9: [19], 10: [20, 21, 22],
	11: [23], 12: [24, 25, 26], 13: [27], 14: [28, 29, 30], 15: [31], 16: [32, 33, 34, 36], 17: [35, 37], 18: [36, 38, 40], 19: [39, 41], 20: [40, 42, 43, 44, 46],
	21: [45], 22: [46, 47, 48, 49, 50], 23: [51], 24: [50, 52, 53, 54], 25: [55], 26: [54, 56, 57, 58], 27: [59], 28: [58, 60, 61, 62, 64], 29: [63, 65], 30: [64, 66, 67, 68, 70],
	31: [69, 71], 32: [70, 72, 73, 74, 76], 33: [75], 34: [74, 76, 77, 78, 80, 82], 35: [79, 81], 36: [78, 80, 82, 83, 84, 86],
};
const NUCLIDES: [number, number][] = Object.entries(ISOTOPES).flatMap(([z, as]) => as.map((a) => [Number(z), a] as [number, number]));
const sym = (Z: number) => ELEMENTS[Z - 1].sym;
const nuc = (A: number, Z: number, q = 0) => texOpt(nuclide(A, Z, q), `${A}/${Z}/${q}`);

// ---------------------------------------------------------------------------
// Level 1: the particles of an atom

function level1(rng: Rng): Built {
	const [Z, A] = rng.pick(NUCLIDES.filter(([z]) => z >= 2));
	const N = A - Z;
	const ask = rng.pick(['protoni', 'neutroni', 'elettroni'] as const);
	const right = ask === 'neutroni' ? N : Z;
	// A for the neutrons, A + Z, Z for the neutrons, A - Z for the protons or the electrons
	const wrong = ask === 'neutroni' ? [A, A + Z, Z, N + 1] : [N, A, Z + 1, Z - 1];
	return {
		prompt: `Conta i ${ask}.`,
		problem: textBlock(`Quanti ${ask} ha l'atomo neutro $${nuclide(A, Z)}$?`),
		solution: String(right),
		steps: [
			textBlock(`Il numero atomico, in basso, è $Z = ${Z}$: i protoni${ask === 'elettroni' ? ", e in un atomo neutro anche gli elettroni" : ''}.`),
			...(ask === 'neutroni' ? [`N = A - Z = ${A} - ${Z} = ${N}`] : []),
		],
		answer: choose(rng, intOpt(right), wrong.filter((x) => x >= 0).map(intOpt)),
		params: { case: ask, A, Z },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the symbol from the particles

function level2(rng: Rng): Built {
	const [Z, A] = rng.pick(NUCLIDES.filter(([z, a]) => z >= 3 && a - z !== z));
	const N = A - Z;
	const swapped = texOpt(`{}^{${Z}}_{${A}}\\mathrm{${sym(Z)}}`, `${Z}/${A}/0`);
	const others = some([swapped, N >= 1 ? nuc(N, Z) : null, N >= 1 && N <= 36 ? nuc(A, N) : null, nuc(A + Z, Z)]);
	return {
		prompt: 'Scrivi il simbolo.',
		problem: textBlock(`Un atomo neutro ha $${Z}$ protoni, $${N}$ neutroni e $${Z}$ elettroni. Qual è il suo simbolo?`),
		solution: nuclide(A, Z),
		steps: [
			textBlock(`Il numero atomico è il numero di protoni, $Z = ${Z}$: l'elemento è il ${ELEMENTS[Z - 1].nome}, $\\mathrm{${sym(Z)}}$.`),
			`A = Z + N = ${Z} + ${N} = ${A}`,
		],
		// A and Z swapped; the neutrons as A; the neutrons as Z (another element); the electrons counted in A
		answer: choose(rng, nuc(A, Z), others),
		params: { case: 'simbolo', A, Z },
	};
}

// ---------------------------------------------------------------------------
// Level 3: ions

export const IONS: [number, number, number][] = [
	// Z, A, charge
	[3, 7, 1], [11, 23, 1], [19, 39, 1], [12, 24, 2], [20, 40, 2], [13, 27, 3], [26, 56, 2], [26, 56, 3], [29, 63, 2], [30, 64, 2],
	[9, 19, -1], [17, 35, -1], [17, 37, -1], [35, 79, -1], [8, 16, -2], [16, 32, -2], [7, 14, -3], [34, 80, -2],
];

function level3(rng: Rng): Built {
	const [Z, A, q] = rng.pick(IONS);
	const r = rng.next();
	const ask = r < 0.5 ? 'elettroni' : r < 0.75 ? 'protoni' : 'neutroni';
	const e = Z - q;
	const N = A - Z;
	const right = ask === 'elettroni' ? e : ask === 'protoni' ? Z : N;
	const wrong = ask === 'elettroni' ? [Z + q, Z, N, e + 1, e - 1] : ask === 'protoni' ? [e, Z + q, A, N, Z + 1] : [N - q, A, Z, e, N + 1, N - 1];
	const kind = q > 0 ? 'catione' : 'anione';
	return {
		prompt: `Conta i ${ask} dello ione.`,
		problem: textBlock(`Quanti ${ask} ha lo ione $${nuclide(A, Z, q)}$?`),
		solution: String(right),
		steps: [
			textBlock(`Lo ione ha $Z = ${Z}$ protoni e $${A} - ${Z} = ${N}$ neutroni, come l'atomo neutro.`),
			textBlock(
				`La carica $${q > 0 ? '+' : '-'}${Math.abs(q)}$ dice che è un ${kind}: ha ${Math.abs(q)} ${Math.abs(q) === 1 ? 'elettrone' : 'elettroni'} ${q > 0 ? 'in meno' : 'in più'} dei protoni, cioè $${Z} ${q > 0 ? '-' : '+'} ${Math.abs(q)} = ${e}$ elettroni.`,
			),
		],
		answer: choose(rng, intOpt(right), wrong.filter((x) => x >= 0).map(intOpt)),
		params: { case: ask, A, Z, q },
	};
}

// ---------------------------------------------------------------------------
// Level 4: isotopes

function level4(rng: Rng): Built {
	const withIsotopes = NUCLIDES.filter(([z]) => ISOTOPES[z].length >= 2 && z >= 2);
	const [Z, A] = rng.pick(withIsotopes);
	const A2 = rng.pick(ISOTOPES[Z].filter((a) => a !== A));
	const N = A - Z;
	// same A, another element; same N, another element; another element with another A
	const isobars = NUCLIDES.filter(([z, a]) => a === A && z !== Z);
	const isotones = NUCLIDES.filter(([z, a]) => a - z === N && z !== Z);
	const isobar = isobars.length ? rng.pick(isobars) : ([Z + 1 <= 36 ? Z + 1 : Z - 1, A] as [number, number]);
	const isotone = isotones.length ? rng.pick(isotones) : ([Z + 1 <= 36 ? Z + 1 : Z - 1, A + 1] as [number, number]);
	const zOther = Z + 1 <= 36 ? Z + 1 : Z - 1;
	const far = [zOther, ISOTOPES[zOther][0] === A ? ISOTOPES[zOther][ISOTOPES[zOther].length - 1] : ISOTOPES[zOther][0]] as [number, number];
	return {
		prompt: "Riconosci l'isotopo.",
		problem: textBlock(`Quale di questi atomi è un isotopo di $${nuclide(A, Z)}$?`),
		solution: nuclide(A2, Z),
		steps: [textBlock(`Gli isotopi hanno lo stesso numero atomico e un diverso numero di massa: $${nuclide(A2, Z)}$ ha $Z = ${Z}$, come $${nuclide(A, Z)}$, e ${A2 - Z} neutroni invece di ${N}. Gli altri hanno un numero atomico diverso: sono altri elementi.`)],
		answer: choose(rng, nuc(A2, Z), [nuc(isobar[1], isobar[0]), nuc(isotone[1], isotone[0]), nuc(far[1], far[0]), nuc(A2, zOther)]),
		params: { case: isobars.length ? 'con isobaro' : 'senza isobaro', A, Z },
	};
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: the average atomic mass

interface Iso {
	A: number;
	m: number; // hundredths of u
	p: number; // hundredths of a percent
}
interface Data {
	name: string | null; // null: the unnamed element
	sym: string;
	isos: Iso[];
	M: number; // the average atomic mass of the table, hundredths
}

/** IUPAC 2021 data, masses to the hundredth of u and abundances to the hundredth of a percent. */
export const REAL: Data[] = [
	{ name: 'litio', sym: 'Li', M: 694, isos: [{ A: 6, m: 602, p: 759 }, { A: 7, m: 702, p: 9241 }] },
	{ name: 'boro', sym: 'B', M: 1081, isos: [{ A: 10, m: 1001, p: 1990 }, { A: 11, m: 1101, p: 8010 }] },
	{ name: 'cloro', sym: 'Cl', M: 3545, isos: [{ A: 35, m: 3497, p: 7576 }, { A: 37, m: 3697, p: 2424 }] },
	{ name: 'rame', sym: 'Cu', M: 6355, isos: [{ A: 63, m: 6293, p: 6915 }, { A: 65, m: 6493, p: 3085 }] },
	{ name: 'gallio', sym: 'Ga', M: 6972, isos: [{ A: 69, m: 6893, p: 6011 }, { A: 71, m: 7092, p: 3989 }] },
	{ name: 'bromo', sym: 'Br', M: 7990, isos: [{ A: 79, m: 7892, p: 5069 }, { A: 81, m: 8092, p: 4931 }] },
	{ name: 'rubidio', sym: 'Rb', M: 8547, isos: [{ A: 85, m: 8491, p: 7217 }, { A: 87, m: 8691, p: 2783 }] },
	{ name: 'argento', sym: 'Ag', M: 10787, isos: [{ A: 107, m: 10691, p: 5184 }, { A: 109, m: 10890, p: 4816 }] },
	{ name: 'antimonio', sym: 'Sb', M: 12176, isos: [{ A: 121, m: 12090, p: 5721 }, { A: 123, m: 12290, p: 4279 }] },
	{ name: 'europio', sym: 'Eu', M: 15196, isos: [{ A: 151, m: 15092, p: 4781 }, { A: 153, m: 15292, p: 5219 }] },
	{ name: 'tallio', sym: 'Tl', M: 20438, isos: [{ A: 203, m: 20297, p: 2952 }, { A: 205, m: 20497, p: 7048 }] },
	{ name: 'magnesio', sym: 'Mg', M: 2431, isos: [{ A: 24, m: 2399, p: 7899 }, { A: 25, m: 2499, p: 1000 }, { A: 26, m: 2598, p: 1101 }] },
	{ name: 'silicio', sym: 'Si', M: 2809, isos: [{ A: 28, m: 2798, p: 9223 }, { A: 29, m: 2898, p: 468 }, { A: 30, m: 2997, p: 309 }] },
	{ name: 'neon', sym: 'Ne', M: 2018, isos: [{ A: 20, m: 1999, p: 9048 }, { A: 21, m: 2099, p: 27 }, { A: 22, m: 2199, p: 925 }] },
];

/** A made-up element with two isotopes a mass unit or two apart, masses a little under the mass numbers. */
function madeUp(rng: Rng): Data {
	const A1 = rng.int(20, 150);
	const A2 = A1 + rng.pick([1, 2]);
	const m1 = A1 * 100 - rng.int(1, 9), m2 = A2 * 100 - rng.int(1, 9);
	const p1 = rng.int(100, 900) * 10; // 10,0% to 90,0%
	return { name: null, sym: 'X', M: 0, isos: [{ A: A1, m: m1, p: p1 }, { A: A2, m: m2, p: 10000 - p1 }] };
}

/** Hundredths as LaTeX with two decimals: 3497 → 34{,}97. */
const h2 = (k: number) => decTex((k / 100).toFixed(2));
/** A percentage from hundredths of a percent: 7576 → 75{,}76\,\% ; 1000 → 10{,}00\,\%. */
const pct = (k: number) => `${h2(k)}\\,\\%`;
/** "Il cloro", "L'argento", or the unnamed element. */
const subject = (d: Data) => (d.name ? (/^[aeiou]/.test(d.name) ? `L'${d.name}` : `Il ${d.name}`) : 'Un elemento $\\mathrm{X}$');
const isoName = (d: Data, i: Iso) => (d.name ? `${d.name}-${i.A}` : `$\\mathrm{X}$-${i.A}`);

/** A mass to the hundredth of u as an option, or null on a tie. */
function massOpt(x: number) {
	const k = x * 100;
	if (Math.abs(k - Math.floor(k) - 0.5) < 1e-6) return null;
	const r = Math.round(k);
	return texOpt(`${h2(r)}\\,\\text{u}`, (r / 100).toFixed(2));
}

function level5(rng: Rng): Built {
	for (;;) {
		const d = rng.next() < 0.5 ? rng.pick(REAL) : madeUp(rng);
		const avg = d.isos.reduce((s, i) => s + (i.m / 100) * (i.p / 10000), 0);
		const right = massOpt(avg);
		if (!right) continue;
		const list = d.isos.map((i) => `${isoName(d, i)} ($${h2(i.m)}\\,\\text{u}$, $${pct(i.p)}$)`);
		const listText = list.length === 2 ? `${list[0]} e ${list[1]}` : `${list[0]}, ${list[1]} e ${list[2]}`;
		const who = subject(d);
		const plain = d.isos.reduce((s, i) => s + i.m / 100, 0) / d.isos.length;
		const rev = [...d.isos].reverse();
		const swapped = d.isos.reduce((s, i, k) => s + (i.m / 100) * (rev[k].p / 10000), 0);
		const byA = d.isos.reduce((s, i) => s + i.A * (i.p / 10000), 0);
		const terms = d.isos.map((i) => `${h2(i.m)} \\cdot ${decTex((i.p / 10000).toFixed(4))}`).join(' + ');
		return {
			prompt: 'Calcola la massa atomica.',
			problem: textBlock(`${who} ha ${d.isos.length === 2 ? 'due' : 'tre'} isotopi: ${listText}. Quanto vale la sua massa atomica?`),
			solution: right.latex,
			steps: [textBlock('La massa atomica è la media delle masse degli isotopi, ognuna pesata con la sua abbondanza (scritta come frazione).'), `${terms} \\approx ${right.latex}`],
			// the plain average; the abundances swapped; the mass numbers for the masses; the division by 100 forgotten
			answer: choose(rng, right, some([massOpt(plain), d.isos.length === 2 ? massOpt(swapped) : null, massOpt(byA), massOpt(avg * 100), massOpt(avg + 0.5), massOpt(avg - 0.5)])),
			params: { case: d.name ? 'reale' : 'inventato', element: d.name ?? 'X', isos: d.isos },
		};
	}
}

/** A percentage to the tenth as an option, or null on a tie or out of 0-100. */
function pctOpt(x: number) {
	const k = x * 10;
	if (x <= 0 || x >= 100 || Math.abs(k - Math.floor(k) - 0.5) < 1e-6) return null;
	const r = Math.round(k);
	return texOpt(`${decTex((r / 10).toFixed(1))}\\,\\%`, (r / 10).toFixed(1));
}

function level6(rng: Rng): Built {
	for (;;) {
		let d: Data;
		if (rng.next() < 0.5) d = rng.pick(REAL.filter((x) => x.isos.length === 2));
		else {
			d = madeUp(rng);
			const avg = d.isos.reduce((s, i) => s + i.m * (i.p / 10000), 0);
			if (Math.abs(avg - Math.floor(avg) - 0.5) < 1e-6) continue;
			d.M = Math.round(avg);
		}
		const [i1, i2] = d.isos;
		const which = rng.int(0, 1);
		const [a, b] = which === 0 ? [i1, i2] : [i2, i1]; // a: the isotope asked
		// a x + b (1 - x) = M  →  x = (b - M) / (b - a)
		const x = ((b.m - d.M) / (b.m - a.m)) * 100;
		const right = pctOpt(x);
		if (!right) continue;
		const who = subject(d);
		const xA = ((b.A - d.M / 100) / (b.A - a.A)) * 100;
		const noDiv = Math.abs(b.m - d.M); // the difference in hundredths read as a percentage
		return {
			prompt: "Trova l'abbondanza dell'isotopo.",
			problem: textBlock(`${who} ha due isotopi, ${isoName(d, i1)} ($${h2(i1.m)}\\,\\text{u}$) e ${isoName(d, i2)} ($${h2(i2.m)}\\,\\text{u}$), e la sua massa atomica è $${h2(d.M)}$. Quanto è abbondante ${isoName(d, a)}?`),
			solution: right.latex,
			steps: [
				textBlock(`Con $x$ la frazione di ${isoName(d, a)}, l'altro isotopo è $1 - x$:`),
				`${h2(a.m)}\\,x + ${h2(b.m)}\\,(1 - x) = ${h2(d.M)} \\quad\\Rightarrow\\quad x = \\dfrac{${h2(b.m)} - ${h2(d.M)}}{${h2(b.m)} - ${h2(a.m)}} \\approx ${right.latex}`,
			],
			// the other isotope; the mass numbers for the masses; half and half; the difference not divided
			answer: choose(rng, right, some([pctOpt(100 - x), pctOpt(xA), pctOpt(50), pctOpt(noDiv), pctOpt(x / 2)])),
			params: { case: d.name ? 'reale' : 'inventato', element: d.name ?? 'X', isos: d.isos, M: d.M, asked: a.A },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const numeroMassa: Generator = {
	id: ID,
	title: 'Numero atomico, numero di massa e isotopi',
	levels: {
		1: { label: "Le particelle dell'atomo", constraints: ['protoni, neutroni o elettroni di un atomo neutro'] },
		2: { label: 'Il simbolo', constraints: ['dalle particelle al simbolo con A e Z'] },
		3: { label: 'Gli ioni', constraints: ['elettroni, protoni o neutroni di uno ione'] },
		4: { label: 'Gli isotopi', constraints: ["l'isotopo tra atomi con lo stesso A o lo stesso N"] },
		5: { label: 'La massa atomica media', constraints: ['due o tre isotopi, al centesimo di u'] },
		6: { label: "L'abbondanza di un isotopo", constraints: ['dalla massa atomica, al decimo di punto percentuale'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default numeroMassa;
