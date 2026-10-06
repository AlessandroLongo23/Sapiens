/**
 * L'energia interna. Spec: specs/exercises/fis-energia-interna.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/108-fis-energia-interna.md), each one step harder, all
 * for a monatomic perfect gas: the internal energy from moles and kelvin, U = (3/2) n R T; its change between two
 * temperatures in degrees Celsius, with its sign; the internal energy from pressure and volume, U = (3/2) p V, with
 * the litres turned into cubic metres; the change between two states of the pressure-volume plane, which does not
 * depend on the path drawn (scene `piano-pv`, of group 41); the temperature from the internal energy; two gases in an
 * insulated vessel, whose total internal energy is conserved. Multiple choice with the unit in the option and the
 * lesson's mistakes: Celsius in place of kelvin, 273 added to a difference, the litres not converted, the 3/2
 * forgotten, the sign.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, MONO, R_GAS, approx, checkCommon, fx, generateWith, noZero, options, pu, round, rounded, sci, t, tex, textBlock, wu } from '../fis-cinetica';

export const ID = 'fis-energia-interna';

const R_TEX = '8{,}31\\,\\text{J/(mol}\\cdot\\text{K)}';
const R_NOTE = `($R = ${R_TEX}$)`;
const must = (x: number, s: number) => {
	const v = round(x, s);
	if (!v) throw new Error('rounding refused');
	return tex(v);
};
/** Moles with three significant figures, 1,01 to 9,99, no final zero. */
const moles = (rng: Rng, hi = 999) => noZero(rng, 101, hi) / 100;

// ---------------------------------------------------------------------------
// Level 1: U = (3/2) n R T

function level1(rng: Rng): Built {
	const g = rng.pick(MONO);
	const n = moles(rng), T = noZero(rng, 151, 999);
	const U = 1.5 * n * R_GAS * T;
	return {
		prompt: "Trova l'energia interna.",
		problem: textBlock(`Un recipiente contiene ${pu(fx(n, 2), 'mol')} di ${g.name}, un gas monoatomico, a ${pu(String(T), 'K')}. Quanto vale l'energia interna del gas? ${R_NOTE}`),
		solution: `U \\approx ${wu(must(U, 3), 'J')}`,
		steps: [`U = \\dfrac{3}{2}\\,n\\,R\\,T = \\dfrac{3}{2} \\cdot ${fx(n, 2)} \\cdot 8{,}31 \\cdot ${T}\\,\\text{J} ${approx(U, 'J', 3)}`],
		// the 3/2 forgotten; 1/2 in its place; 273 taken away from the kelvin
		answer: options(rng, U, [n * R_GAS * T, 0.5 * n * R_GAS * T, T > 300 ? 1.5 * n * R_GAS * (T - 273) : 3 * n * R_GAS * T], 'J', 3),
		params: { case: g.name, n: String(n), T },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the change, from degrees Celsius

function level2(rng: Rng): Built {
	const g = rng.pick(MONO);
	const cooling = rng.next() < 0.5;
	const n = moles(rng);
	const lo = rng.int(-40, 60);
	const hi = lo + noZero(rng, 21, 199);
	const [ti, tf] = cooling ? [hi, lo] : [lo, hi];
	const dT = tf - ti;
	const dU = 1.5 * n * R_GAS * dT;
	return {
		prompt: "Trova la variazione di energia interna.",
		problem: textBlock(`In un recipiente ${pu(fx(n, 2), 'mol')} di ${g.name}, un gas monoatomico, passano da ${pu(fx(ti), 'C')} a ${pu(fx(tf), 'C')}. Di quanto cambia l'energia interna del gas? ${R_NOTE}`),
		solution: `\\Delta U \\approx ${wu(must(dU, 3), 'J')}`,
		steps: [
			`\\Delta T = ${fx(tf)} - ${ti < 0 ? `(${fx(ti)})` : fx(ti)} = ${fx(dT)}\\,^\\circ\\text{C} = ${wu(fx(dT), 'K')}`,
			`\\Delta U = \\dfrac{3}{2}\\,n\\,R\\,\\Delta T = \\dfrac{3}{2} \\cdot ${fx(n, 2)} \\cdot 8{,}31 \\cdot ${dT < 0 ? `(${fx(dT)})` : fx(dT)}\\,\\text{J} ${approx(dU, 'J', 3)}`,
			t(cooling ? 'Il gas si raffredda: la sua energia interna diminuisce.' : 'Il gas si scalda: la sua energia interna aumenta.'),
		],
		// the sign; 273 added to the difference; the 3/2 forgotten
		answer: options(rng, dU, [-dU, 1.5 * n * R_GAS * (dT + 273), n * R_GAS * dT], 'J', 3, true),
		params: { case: cooling ? 'raffreddamento' : 'riscaldamento', gas: g.name, n: String(n), ti, tf },
	};
}

// ---------------------------------------------------------------------------
// Level 3: U = (3/2) p V

function level3(rng: Rng): Built {
	const g = rng.pick(MONO);
	const V = noZero(rng, 101, 999) / 100; // litres
	const p = noZero(rng, 61, 499) * 1000; // pascal
	const U = 1.5 * p * (V / 1000);
	const pTex = sci(p, 3), VTex = fx(V, 2);
	return {
		prompt: "Trova l'energia interna.",
		problem: textBlock(`Una bombola di ${pu(VTex, 'L')} contiene ${g.name}, un gas monoatomico, alla pressione di ${pu(pTex, 'Pa')}. Quanto vale l'energia interna del gas?`),
		solution: `U \\approx ${wu(must(U, 3), 'J')}`,
		steps: [`V = ${wu(VTex, 'L')} = ${VTex} \\cdot 10^{-3}\\,\\text{m}^3`, `U = \\dfrac{3}{2}\\,p\\,V = \\dfrac{3}{2} \\cdot ${pTex} \\cdot ${VTex} \\cdot 10^{-3}\\,\\text{J} ${approx(U, 'J', 3)}`],
		// the litres not converted; the 3/2 forgotten; 2/3 in its place
		answer: options(rng, U, [U * 1000, p * (V / 1000), (p * (V / 1000)) / 1.5], 'J', 3),
		params: { case: g.name, V: String(V), p: String(p) },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the change between two states of the pressure-volume plane

function level4(rng: Rng): Built {
	for (;;) {
		const VA = noZero(rng, 11, 79) / 10, VB = noZero(rng, 11, 79) / 10;
		const pA = noZero(rng, 61, 399), pB = noZero(rng, 61, 399);
		if (Math.abs(VA - VB) < 1.5 || Math.abs(pA - pB) < 60) continue;
		const UA = 1.5 * pA * VA, UB = 1.5 * pB * VB; // kPa · L = J
		const dU = UB - UA;
		if (Math.abs(dU) < 50) continue;
		const st = (V: number, p: number) => `${pu(fx(V, 1), 'L')}, ${pu(String(p), 'kPa')}`;
		const scene = {
			type: 'piano-pv',
			data: {
				V: { unita: 'L', passo: 1, celle: 8, etichette: 1 },
				p: { unita: 'kPa', passo: 50, celle: 8, etichette: 2 },
				stati: [{ nome: 'A', V: VA, p: pA }, { nome: 'B', V: VB, p: pB }, { nome: 'C', V: VB, p: pA }],
				tratti: [{ da: 'A', a: 'C', tipo: 'retta' }, { da: 'C', a: 'B', tipo: 'retta' }],
			},
			alt: `Il piano pressione-volume con lo stato A a ${fx(VA, 1).replace('{,}', ',')} litri e ${pA} kilopascal e lo stato B a ${fx(VB, 1).replace('{,}', ',')} litri e ${pB} kilopascal; il gas va da A a C a pressione costante e poi da C a B a volume costante`,
		};
		return {
			prompt: "Trova la variazione di energia interna.",
			problem: textBlock(`Un gas perfetto monoatomico passa dallo stato A (${st(VA, pA)}) allo stato B (${st(VB, pB)}) lungo il cammino della figura, che passa per C. Di quanto cambia la sua energia interna?`),
			solution: `\\Delta U \\approx ${wu(must(dU, 3), 'J')}`,
			steps: [
				t("L'energia interna è una funzione di stato: contano solo A e B, non il cammino."),
				`U_A = \\dfrac{3}{2}\\,p_A\\,V_A = \\dfrac{3}{2} \\cdot ${pA} \\cdot 10^{3} \\cdot ${fx(VA, 1)} \\cdot 10^{-3}\\,\\text{J} = ${wu(fx(UA, 2), 'J')}`,
				`U_B = \\dfrac{3}{2}\\,p_B\\,V_B = \\dfrac{3}{2} \\cdot ${pB} \\cdot 10^{3} \\cdot ${fx(VB, 1)} \\cdot 10^{-3}\\,\\text{J} = ${wu(fx(UB, 2), 'J')}`,
				`\\Delta U = U_B - U_A ${approx(dU, 'J', 3)}`,
			],
			// A and B swapped; the 3/2 forgotten; the product of the two differences
			answer: options(rng, dU, [-dU, pB * VB - pA * VA, 1.5 * (pB - pA) * (VB - VA)], 'J', 3, true),
			params: { case: dU > 0 ? 'aumenta' : 'diminuisce', VA: String(VA), pA, VB: String(VB), pB },
			scene,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the temperature from the internal energy

function level5(rng: Rng): Built {
	const g = rng.pick(MONO);
	const n = moles(rng);
	const U = rounded(1.5 * n * R_GAS * noZero(rng, 151, 999), 3);
	const T = (2 * U) / (3 * n * R_GAS);
	const UTex = must(U, 3);
	return {
		prompt: 'Trova la temperatura del gas.',
		problem: textBlock(`L'energia interna di ${pu(fx(n, 2), 'mol')} di ${g.name}, un gas monoatomico, è ${pu(UTex, 'J')}. Qual è la temperatura del gas, in kelvin? ${R_NOTE}`),
		solution: `T \\approx ${wu(must(T, 3), 'K')}`,
		steps: [`U = \\dfrac{3}{2}\\,n\\,R\\,T \\quad\\Rightarrow\\quad T = \\dfrac{2\\,U}{3\\,n\\,R}`, `T = \\dfrac{2 \\cdot ${UTex}}{3 \\cdot ${fx(n, 2)} \\cdot 8{,}31}\\,\\text{K} ${approx(T, 'K', 3)}`],
		// the 2/3 forgotten; 3/2 in its place; 273 taken away from the kelvin
		answer: options(rng, T, [U / (n * R_GAS), (3 * U) / (2 * n * R_GAS), T - 273], 'K', 3),
		params: { case: g.name, n: String(n), U: String(U) },
	};
}

// ---------------------------------------------------------------------------
// Level 6: two gases in an insulated vessel

function level6(rng: Rng): Built {
	for (;;) {
		const a = rng.pick(MONO), b = rng.pick(MONO);
		if (a === b) continue;
		const n1 = moles(rng, 599), n2 = moles(rng, 599);
		const T1 = noZero(rng, 201, 599), T2 = noZero(rng, 201, 599);
		if (Math.abs(n1 - n2) < 0.5 || Math.abs(T1 - T2) < 80) continue;
		const Tf = (n1 * T1 + n2 * T2) / (n1 + n2);
		return {
			prompt: 'Trova la temperatura finale.',
			problem: textBlock(`Un recipiente rigido e isolato è diviso in due da una parete che conduce il calore. Da una parte ci sono ${pu(fx(n1, 2), 'mol')} di ${a.name} a ${pu(String(T1), 'K')}, dall'altra ${pu(fx(n2, 2), 'mol')} di ${b.name} a ${pu(String(T2), 'K')}. I due gas sono monoatomici. Quale temperatura raggiungono?`),
			solution: `T_f \\approx ${wu(must(Tf, 3), 'K')}`,
			steps: [
				t("Il recipiente è isolato: l'energia interna totale non cambia.") + ` \\; \\dfrac{3}{2}\\,n_1 R\\,T_1 + \\dfrac{3}{2}\\,n_2 R\\,T_2 = \\dfrac{3}{2}\\,(n_1 + n_2)\\,R\\,T_f`,
				`T_f = \\dfrac{n_1 T_1 + n_2 T_2}{n_1 + n_2} = \\dfrac{${fx(n1, 2)} \\cdot ${T1} + ${fx(n2, 2)} \\cdot ${T2}}{${fx(n1, 2)} + ${fx(n2, 2)}}\\,\\text{K} ${approx(Tf, 'K', 3)}`,
			],
			// the plain mean; the weights swapped; the sum of the two temperatures
			answer: options(rng, Tf, [(T1 + T2) / 2, (n2 * T1 + n1 * T2) / (n1 + n2), T1 + T2], 'K', 3),
			params: { case: T1 > T2 ? 'primo più caldo' : 'secondo più caldo', n1: String(n1), T1, n2: String(n2), T2 },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisEnergiaInterna: Generator = {
	id: ID,
	title: "L'energia interna",
	levels: {
		1: { label: "L'energia interna di un gas", constraints: ['U = (3/2) n R T', 'gas monoatomico, temperatura in kelvin'] },
		2: { label: 'Di quanto cambia', constraints: ['ΔU = (3/2) n R ΔT', 'temperature in gradi Celsius, con il segno'] },
		3: { label: 'Dalla pressione e dal volume', constraints: ['U = (3/2) p V', 'il volume da litri a metri cubi'] },
		4: { label: 'Da uno stato a un altro', constraints: ['ΔU non dipende dal cammino', 'stati nel piano pressione-volume, con la figura'] },
		5: { label: "La temperatura dall'energia interna", constraints: ['T = 2U / (3 n R)'] },
		6: { label: 'Due gas in un recipiente isolato', constraints: ["l'energia interna totale si conserva", 'T_f media pesata con le moli'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisEnergiaInterna;
