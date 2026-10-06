/**
 * Fissione e fusione nucleare. Spec: specs/exercises/chim-fissione-fusione.md
 *
 * Six levels in the order of the lesson (docs/lezioni/chimica/riscritte/56-chim-fissione-fusione.md), each one step
 * harder: the mass defect of a nucleus from the masses of its nucleons; the energy that corresponds to a mass defect;
 * the binding energy per nucleon; the most stable of four nuclei, from their binding energies; the energy released by
 * a fission or a fusion, from the masses of the atoms; the energy released by a mass of fuel.
 *
 * Real masses and binding energies (AME2020, Wang et al., Chinese Physics C 45, 030003, 2021): nuclear masses to five
 * decimals of u, binding energies to a tenth of MeV. Constants as the lesson: proton 1,00728 u, neutron 1,00866 u,
 * 1 u = 1,6605 · 10⁻²⁷ kg, c = 3,00 · 10⁸ m/s, N_A = 6,022 · 10²³ mol⁻¹. Distractors from the lesson's warnings: the
 * mass left in u, c not squared, protons and neutrons swapped, the mass number taken for the neutrons, the nucleus
 * with the largest binding energy taken for the most stable.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Built, NEUTRON, ambiguousZero, checkSample, choose, decTex, generateWith, isoName, nuc, nucA, nucOpt, redraw, sig, some, texOpt, textBlock } from '../chim3-c';

export const ID = 'chim-fissione-fusione';

const M_P = 1.00728, M_N = 1.00866;
const U_KG = 1.6605e-27, C = 3.0e8, N_A = 6.022e23;
/** Joule per atomic mass unit of mass defect. */
const J_PER_U = U_KG * C * C;

/** Stable nuclei and the mass of their nucleus, u: [Z, A, mass]. */
export const NUCLEAR_MASS: [number, number, number][] = [
	[1, 2, 2.01355], [1, 3, 3.0155], [2, 3, 3.01493], [2, 4, 4.00151], [3, 6, 6.01348], [3, 7, 7.01436], [4, 9, 9.00999], [5, 10, 10.01019], [5, 11, 11.00656], [6, 12, 11.99671], [6, 13, 13.00006], [7, 14, 13.99923],
	[7, 15, 14.99627], [8, 16, 15.99053], [8, 17, 16.99474], [8, 18, 17.99477], [9, 19, 18.99347], [10, 20, 19.98695], [11, 23, 22.98373], [12, 24, 23.97846], [13, 27, 26.97441], [14, 28, 27.96925], [15, 31, 30.96553],
	[16, 32, 31.96329], [17, 35, 34.95953], [17, 37, 36.95658], [18, 40, 39.95251], [19, 39, 38.95328], [20, 40, 39.95162], [22, 48, 47.93587], [24, 52, 51.92734], [25, 55, 54.92433], [26, 56, 55.92067], [27, 59, 58.91838],
	[28, 58, 57.91998], [28, 60, 59.91542], [29, 63, 62.91369], [30, 64, 63.91268],
];
/** Nuclei and their binding energy, MeV: [Z, A, energy]. */
export const BINDING: [number, number, number][] = [
	[1, 2, 2.2], [1, 3, 8.5], [2, 3, 7.7], [2, 4, 28.3], [3, 6, 32.0], [3, 7, 39.2], [4, 9, 58.2], [6, 12, 92.2], [7, 14, 104.7], [8, 16, 127.6], [10, 20, 160.6], [12, 24, 198.3], [14, 28, 236.5], [16, 32, 271.8], [20, 40, 342.1],
	[26, 56, 492.3], [28, 62, 545.3], [29, 63, 551.4], [36, 84, 732.3], [38, 88, 768.5], [40, 90, 783.9], [42, 98, 846.2], [47, 107, 915.3], [50, 120, 1020.5], [54, 132, 1112.4], [56, 138, 1158.3], [60, 144, 1199.1],
	[64, 158, 1295.9], [74, 184, 1472.9], [79, 197, 1559.4], [82, 208, 1636.4], [90, 232, 1766.7], [92, 235, 1783.9], [92, 238, 1801.7],
];
/** Masses of the atoms, u, by "Z-A"; "0-1" is the neutron. */
export const ATOMIC_MASS: Record<string, number> = {
	'0-1': 1.00866, '1-1': 1.00783, '1-2': 2.0141, '1-3': 3.01605, '2-3': 3.01603, '2-4': 4.0026, '3-6': 6.01512, '3-7': 7.016, '5-11': 11.00931, '6-12': 12.0, '8-16': 15.99491,
	'92-235': 235.04393, '94-239': 239.05216, '56-141': 140.9144, '36-92': 91.92617, '56-144': 143.92295, '36-89': 88.91784, '54-140': 139.92165, '38-94': 93.91536, '55-137': 136.90709, '37-95': 94.92926,
	'54-144': 143.93895, '38-90': 89.90773, '57-146': 145.92569, '35-87': 86.92067, '52-134': 133.9114, '40-100': 99.91801, '53-135': 134.91006, '39-97': 96.91829, '56-139': 138.90884, '36-94': 93.93414,
	'54-143': 142.93537, '50-132': 131.91782, '42-101': 100.91034, '54-134': 133.90539, '40-103': 102.9272,
};

type Particle = [Z: number, A: number, count: number];
interface Reaction {
	kind: 'fissione' | 'fusione';
	left: Particle[];
	right: Particle[];
}
const fission = (Z: number, A: number, f1: [number, number], f2: [number, number], neutrons: number): Reaction => ({ kind: 'fissione', left: [[Z, A, 1], [0, 1, 1]], right: [[f1[0], f1[1], 1], [f2[0], f2[1], 1], [0, 1, neutrons]] });
export const REACTIONS: Reaction[] = [
	fission(92, 235, [56, 141], [36, 92], 3),
	fission(92, 235, [56, 144], [36, 89], 3),
	fission(92, 235, [54, 140], [38, 94], 2),
	fission(92, 235, [55, 137], [37, 95], 4),
	fission(92, 235, [54, 144], [38, 90], 2),
	fission(92, 235, [57, 146], [35, 87], 3),
	fission(92, 235, [52, 134], [40, 100], 2),
	fission(92, 235, [53, 135], [39, 97], 4),
	fission(92, 235, [56, 139], [36, 94], 3),
	fission(92, 235, [54, 143], [38, 90], 3),
	fission(92, 235, [50, 132], [42, 101], 3),
	fission(94, 239, [56, 144], [38, 94], 2),
	fission(94, 239, [54, 134], [40, 103], 3),
	{ kind: 'fusione', left: [[1, 2, 1], [1, 3, 1]], right: [[2, 4, 1], [0, 1, 1]] },
	{ kind: 'fusione', left: [[1, 2, 2]], right: [[2, 3, 1], [0, 1, 1]] },
	{ kind: 'fusione', left: [[1, 2, 2]], right: [[1, 3, 1], [1, 1, 1]] },
	{ kind: 'fusione', left: [[1, 2, 1], [2, 3, 1]], right: [[2, 4, 1], [1, 1, 1]] },
	{ kind: 'fusione', left: [[1, 3, 2]], right: [[2, 4, 1], [0, 1, 2]] },
	{ kind: 'fusione', left: [[1, 1, 1], [3, 7, 1]], right: [[2, 4, 2]] },
	{ kind: 'fusione', left: [[1, 2, 1], [3, 6, 1]], right: [[2, 4, 2]] },
	{ kind: 'fusione', left: [[2, 4, 3]], right: [[6, 12, 1]] },
	{ kind: 'fusione', left: [[6, 12, 1], [2, 4, 1]], right: [[8, 16, 1]] },
	{ kind: 'fusione', left: [[1, 1, 1], [5, 11, 1]], right: [[2, 4, 3]] },
];

const u5 = (x: number) => decTex(x.toFixed(5));
const withUnit = (tex: string, unit: string) => `${tex}\\,\\text{${unit}}`;
const massOf = ([Z, A]: Particle | [number, number]) => ATOMIC_MASS[`${Z}-${A}`];
const particle = ([Z, A, count]: Particle) => `${count > 1 ? `${count}\\,` : ''}${Z === 0 ? NEUTRON : nuc(Z, A)}`;

/** A quantity to n figures with its unit, as an option; null on a tie or when it is not positive. */
function qty(x: number, n: number, unit: string): ChoiceOption | null {
	const s = sig(x, n);
	return s ? texOpt(withUnit(s.tex, unit), s.value) : null;
}
/** The right quantity: refused on a tie, or when it ends with a zero nobody can read. */
function rightQty(x: number, n: number, unit: string): ChoiceOption {
	const s = sig(x, n);
	if (!s || ambiguousZero(s.value)) redraw();
	return texOpt(withUnit(s.tex, unit), s.value);
}
/** A mass in u to five decimals, as an option. */
const uOpt = (x: number): ChoiceOption | null => (x > 0 ? texOpt(withUnit(u5(x), 'u'), x.toFixed(5)) : null);

// ---------------------------------------------------------------------------
// Level 1: the mass defect

function level1(rng: Rng): Built {
	const [Z, A, m] = rng.pick(NUCLEAR_MASS);
	const N = A - Z;
	const sum = Z * M_P + N * M_N;
	const dm = sum - m;
	return {
		prompt: 'Calcola il difetto di massa.',
		problem: textBlock(`Il nucleo di ${isoName(Z, A)}, $${nuc(Z, A)}$, ha una massa di $${withUnit(u5(m), 'u')}$. Quanto vale il suo difetto di massa? Il protone ha massa $${withUnit(u5(M_P), 'u')}$, il neutrone $${withUnit(u5(M_N), 'u')}$.`),
		solution: withUnit(u5(dm), 'u'),
		steps: [
			textBlock(`Il nucleo ha $Z = ${Z}$ protoni e $N = ${A} - ${Z} = ${N}$ neutroni.`),
			`${Z} \\cdot ${u5(M_P)} + ${N} \\cdot ${u5(M_N)} = ${u5(sum)}`,
			`\\Delta m = ${u5(sum)}\\,\\text{u} - ${u5(m)}\\,\\text{u} = ${withUnit(u5(dm), 'u')}`,
		],
		// protons and neutrons swapped; all nucleons weighed as protons, or as neutrons; the mass number taken for the mass of the nucleus
		answer: choose(rng, uOpt(dm)!, some([Z !== N ? uOpt(N * M_P + Z * M_N - m) : null, uOpt(A * M_P - m), uOpt(A * M_N - m), uOpt(sum - A), uOpt(dm * 2), uOpt(dm / 2)])),
		params: { case: 'difetto', Z, A },
	};
}

// ---------------------------------------------------------------------------
// Level 2: from the mass defect to the energy

function level2(rng: Rng): Built {
	const [Z, A, m] = rng.pick(NUCLEAR_MASS);
	const dm = Number((Z * M_P + (A - Z) * M_N - m).toFixed(5));
	const E = dm * J_PER_U;
	const right = rightQty(E, 3, 'J');
	// the shortcut of the lesson, 1 u ↔ 1,494 · 10⁻¹⁰ J, must give the same answer
	if (qty(dm * 1.494e-10, 3, 'J')?.latex !== right.latex) redraw();
	const kg = sig(dm * U_KG, 4);
	if (!kg) redraw();
	return {
		prompt: "Calcola l'energia di legame.",
		problem: textBlock(`Il difetto di massa del nucleo $${nuc(Z, A)}$ è $${withUnit(u5(dm), 'u')}$. Quanto vale la sua energia di legame, in joule? Usa $1\\,\\text{u} = 1{,}6605 \\cdot 10^{-27}\\,\\text{kg}$ e $c = 3{,}00 \\cdot 10^{8}\\,\\text{m/s}$.`),
		solution: right.latex,
		steps: [
			`\\Delta m = ${u5(dm)} \\cdot 1{,}6605 \\cdot 10^{-27}\\,\\text{kg} \\approx ${withUnit(kg.tex, 'kg')}`,
			`E = \\Delta m \\cdot c^2 \\approx ${kg.tex} \\cdot \\left(3{,}00 \\cdot 10^{8}\\right)^2\\,\\text{J} \\approx ${right.latex}`,
		],
		// c not squared; the mass left in u; half m c², as a kinetic energy; the megaelectronvolt read as joule
		answer: choose(rng, right, some([qty(dm * U_KG * C, 3, 'J'), qty(dm * C * C, 3, 'J'), qty(E / 2, 3, 'J'), qty(E / 1.6e-13, 3, 'J'), qty(E * 2, 3, 'J'), qty(E * 10, 3, 'J')])),
		params: { case: 'energia', Z, A },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the binding energy per nucleon

const mev1 = (x: number) => decTex(x.toFixed(1));

function level3(rng: Rng): Built {
	const [Z, A, E] = rng.pick(BINDING.filter(([, a]) => a >= 4));
	const right = rightQty(E / A, 3, 'MeV');
	return {
		prompt: "Calcola l'energia di legame per nucleone.",
		problem: textBlock(`L'energia di legame del nucleo $${nuc(Z, A)}$ è $${withUnit(mev1(E), 'MeV')}$. Quanto vale la sua energia di legame per nucleone?`),
		solution: right.latex,
		steps: [textBlock(`I nucleoni sono $A = ${A}$, protoni e neutroni insieme.`), `\\dfrac{E}{A} = \\dfrac{${mev1(E)}\\,\\text{MeV}}{${A}} \\approx ${right.latex}`],
		// divided by the protons; by the neutrons; by all the particles of the atom; not divided
		answer: choose(rng, right, some([qty(E / Z, 3, 'MeV'), A - Z !== Z ? qty(E / (A - Z), 3, 'MeV') : null, qty(E / (A + Z), 3, 'MeV'), qty(E, 3, 'MeV'), qty(E / (2 * A), 3, 'MeV'), qty((2 * E) / A, 3, 'MeV')])),
		params: { case: 'per nucleone', Z, A },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the most stable nucleus

function level4(rng: Rng): Built {
	const picked: [number, number, number][] = [];
	const pool = [...BINDING];
	while (picked.length < 4) picked.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]);
	picked.sort((a, b) => a[1] - b[1]);
	const per = picked.map(([, A, E]) => E / A);
	const order = [0, 1, 2, 3].sort((a, b) => per[b] - per[a]);
	const best = order[0];
	// the most stable one clearly ahead, and not the heaviest: the nucleus with the largest energy is the trap
	if (per[best] - per[order[1]] < 0.1 || best === 3) redraw();
	const data = picked.map(([Z, A, E]) => `$${nucA(Z, A)}$ $${mev1(E)}$`).join(', ');
	const three = (x: number) => sig(x, 3)?.tex ?? redraw();
	return {
		prompt: 'Trova il nucleo più stabile.',
		problem: textBlock(`Le energie di legame di quattro nuclei, in megaelettronvolt, sono: ${data}. Qual è il nucleo più stabile?`),
		solution: nuc(picked[best][0], picked[best][1]),
		steps: [
			textBlock('Il nucleo più stabile è quello con la maggiore energia di legame per nucleone, non quello con la maggiore energia di legame.'),
			...picked.map(([Z, A, E], i) => `${nucA(Z, A)}: \\quad \\dfrac{${mev1(E)}}{${A}} \\approx ${three(per[i])}\\,\\text{MeV}`),
			textBlock(`Il valore più alto è quello di $${nucA(picked[best][0], picked[best][1])}$.`),
		],
		answer: choose(rng, nucOpt(picked[best][0], picked[best][1]), picked.filter((_, i) => i !== best).map(([Z, A]) => nucOpt(Z, A))),
		params: { case: 'stabile', nuclei: picked.map(([Z, A]) => `${Z}-${A}`) },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the energy of a fission or of a fusion

const total = (side: Particle[]) => side.reduce((s, p) => s + p[2] * massOf(p), 0);
const sideTex = (side: Particle[]) => side.map(particle).join(' + ');
const massLabel = ([Z, A]: Particle) => (Z === 0 ? 'neutrone' : `$${nucA(Z, A)}$`);

function level5(rng: Rng): Built {
	const fissionCase = rng.next() < 0.5;
	const r = rng.pick(REACTIONS.filter((x) => (x.kind === 'fissione') === fissionCase));
	const mL = Number(total(r.left).toFixed(5)), mR = Number(total(r.right).toFixed(5));
	const dm = Number((mL - mR).toFixed(5));
	if (dm <= 0) redraw();
	const E = dm * J_PER_U;
	const right = rightQty(E, 3, 'J');
	if (qty(dm * 1.494e-10, 3, 'J')?.latex !== right.latex) redraw();
	// every different particle once, in the order of the equation
	const seen = new Set<string>();
	const species = [...r.left, ...r.right].filter((p) => !seen.has(`${p[0]}-${p[1]}`) && seen.add(`${p[0]}-${p[1]}`));
	const masses = species.map((p) => `${massLabel(p)} $${u5(massOf(p))}$`).join(', ');
	// the neutrons of the two sides not counted; every particle counted once, whatever its coefficient
	const noNeutrons = Number((total(r.left.filter((p) => p[0] !== 0)) - total(r.right.filter((p) => p[0] !== 0))).toFixed(5));
	const once = Number((r.left.reduce((s, p) => s + massOf(p), 0) - r.right.reduce((s, p) => s + massOf(p), 0)).toFixed(5));
	const wrongDm = [noNeutrons, once].filter((x) => x > 0 && Math.abs(x - dm) > 1e-6);
	return {
		prompt: `Calcola l'energia liberata dalla ${r.kind}.`,
		problem: textBlock(`Quanta energia libera questa reazione di ${r.kind}? Masse in unità di massa atomica: ${masses}. A $1\\,\\text{u}$ corrispondono $1{,}494 \\cdot 10^{-10}\\,\\text{J}$.`, 46, [`${sideTex(r.left)} \\longrightarrow ${sideTex(r.right)}`]),
		solution: right.latex,
		steps: [
			`m_{\\text{reagenti}} = ${u5(mL)}\\,\\text{u} \\qquad m_{\\text{prodotti}} = ${u5(mR)}\\,\\text{u}`,
			`\\Delta m = ${u5(mL)}\\,\\text{u} - ${u5(mR)}\\,\\text{u} = ${withUnit(u5(dm), 'u')}`,
			`E = ${u5(dm)} \\cdot 1{,}494 \\cdot 10^{-10}\\,\\text{J} \\approx ${right.latex}`,
		],
		// a wrong mass balance; the mass in u multiplied by c² ; c not squared; the megaelectronvolt read as joule
		answer: choose(rng, right, some([...wrongDm.map((x) => qty(x * J_PER_U, 3, 'J')), qty(dm * C * C, 3, 'J'), qty(dm * U_KG * C, 3, 'J'), qty(E / 1.6e-13, 3, 'J'), qty(E / 2, 3, 'J'), qty(E * 2, 3, 'J')])),
		params: { case: r.kind, left: r.left, right: r.right },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the energy of a mass of fuel

interface Fuel {
	what: string;
	/** Grams per mole of "reactions": of the nucleus that splits, or of the pair that fuses. */
	M: number;
	Mtex: string;
	/** Joule per reaction, to three figures, as mantissa and exponent. */
	E: [number, number];
}
export const FUELS: Fuel[] = [
	{ what: "La fissione di un nucleo di uranio-235 libera in media $3{,}20 \\cdot 10^{-11}\\,\\text{J}$. La massa molare dell'uranio-235 è $235\\,\\text{g/mol}$. Quanta energia libera la fissione di $MASS$ di uranio-235?", M: 235, Mtex: '235', E: [3.2, -11] },
	{ what: 'La fusione di un nucleo di deuterio con uno di trizio libera $2{,}82 \\cdot 10^{-12}\\,\\text{J}$. Una mole di coppie deuterio-trizio ha una massa di $5{,}03\\,\\text{g}$. Quanta energia libera la fusione di $MASS$ di miscela?', M: 5.03, Mtex: '5{,}03', E: [2.82, -12] },
	{ what: 'La fusione di due nuclei di deuterio in elio-3 libera $5{,}25 \\cdot 10^{-13}\\,\\text{J}$. Una mole di coppie di nuclei di deuterio ha una massa di $4{,}03\\,\\text{g}$. Quanta energia libera la fusione di $MASS$ di deuterio?', M: 4.03, Mtex: '4{,}03', E: [5.25, -13] },
];

function level6(rng: Rng): Built {
	const fuel = rng.pick(FUELS);
	// a mass with two figures, from 0,11 g to 99 g, that does not end with a zero
	const digits = rng.int(11, 99);
	if (digits % 10 === 0) redraw();
	const g = rng.pick([(digits / 100).toFixed(2), (digits / 10).toFixed(1), String(digits)]);
	const m = Number(g);
	const E1 = fuel.E[0] * 10 ** fuel.E[1];
	const n = m / fuel.M;
	const N = n * N_A;
	const Etot = N * E1;
	const right = rightQty(Etot, 2, 'J');
	const nTex = sig(n, 3), NTex = sig(N, 3);
	if (!nTex || !NTex) redraw();
	// the same answer along the solution's road, with the number of nuclei rounded to three figures
	if (qty(Number(NTex.value) * E1, 2, 'J')?.latex !== right.latex) redraw();
	const e1Tex = `${decTex(String(fuel.E[0]).padEnd(4, '0'))} \\cdot 10^{${fuel.E[1]}}`;
	return {
		prompt: "Calcola l'energia liberata.",
		problem: textBlock(fuel.what.replace('MASS', withUnit(decTex(g), 'g'))),
		solution: right.latex,
		steps: [
			`n = \\dfrac{${decTex(g)}\\,\\text{g}}{${fuel.Mtex}\\,\\text{g/mol}} \\approx ${withUnit(nTex.tex, 'mol')}`,
			`N = n \\cdot N_A \\approx ${nTex.tex} \\cdot 6{,}022 \\cdot 10^{23} \\approx ${NTex.tex}`,
			`E \\approx ${NTex.tex} \\cdot ${e1Tex}\\,\\text{J} \\approx ${right.latex}`,
		],
		// the moles not turned into nuclei; the grams multiplied by Avogadro's number; a mole whatever the mass; the molar mass upside down
		answer: choose(rng, right, some([qty(n * E1, 2, 'J'), qty(m * N_A * E1, 2, 'J'), qty(N_A * E1, 2, 'J'), qty((fuel.M / m) * N_A * E1, 2, 'J'), qty(Etot / 2, 2, 'J'), qty(Etot * 10, 2, 'J')])),
		params: { case: fuel.M > 100 ? 'fissione' : 'fusione', grams: g, M: fuel.M },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkSample(sample);
}

export const chimFissioneFusione: Generator = {
	id: ID,
	title: 'Fissione e fusione nucleare',
	levels: {
		1: { label: 'Il difetto di massa', constraints: ['un nucleo stabile fino allo zinco; masse a cinque decimali di u'] },
		2: { label: "L'energia di legame", constraints: ['dal difetto di massa in u ai joule, a tre cifre'] },
		3: { label: "L'energia di legame per nucleone", constraints: ["dall'energia di legame in MeV, a tre cifre"] },
		4: { label: 'Il nucleo più stabile', constraints: ['quattro nuclei con le energie di legame; il più stabile non è il più pesante'] },
		5: { label: "L'energia di una reazione", constraints: ['una fissione o una fusione vera; dalle masse degli atomi ai joule, a tre cifre'] },
		6: { label: "L'energia di una massa di combustibile", constraints: ["dai grammi al numero di nuclei all'energia, a due cifre"] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimFissioneFusione;
