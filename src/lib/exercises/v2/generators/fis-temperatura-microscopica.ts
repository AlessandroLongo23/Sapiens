/**
 * Temperatura ed energia cinetica delle molecole. Spec: specs/exercises/fis-temperatura-microscopica.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/106-fis-temperatura-microscopica.md), each one step
 * harder: the mean kinetic energy from the temperature in kelvin, K_m = (3/2) k_B T; the same from degrees Celsius;
 * the temperature from the mean kinetic energy; the root-mean-square speed, v_qm = √(3RT/M), with the molar mass
 * turned into kg/mol; the ratio of two speeds (two temperatures in Celsius of the same gas, or two gases at the same
 * temperature); the temperature from the speed, T = M v_qm² / (3R). Multiple choice with the unit in the option and
 * the lesson's mistakes: Celsius in place of kelvin, the 3/2 forgotten, the molar mass left in grams, the ratio taken
 * without the root or upside down.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, GASES, K_B, R_GAS, approx, checkCommon, fx, generateWith, noZero, options, pu, round, rounded, sci, t, tex, textBlock, wu } from '../fis-cinetica';

export const ID = 'fis-temperatura-microscopica';

const KB_TEX = '1{,}38 \\cdot 10^{-23}\\,\\text{J/K}';
const KB_NOTE = `($k_B = ${KB_TEX}$)`;
const R_TEX = '8{,}31\\,\\text{J/(mol}\\cdot\\text{K)}';
const R_NOTE = `($R = ${R_TEX}$)`;
const must = (x: number, s: number) => {
	const v = round(x, s);
	if (!v) throw new Error('rounding refused');
	return tex(v);
};

// ---------------------------------------------------------------------------
// Level 1: the mean kinetic energy, temperature in kelvin

function level1(rng: Rng): Built {
	const T = noZero(rng, 101, 999);
	const K = 1.5 * K_B * T;
	return {
		prompt: "Trova l'energia cinetica media.",
		problem: textBlock(`Un gas è alla temperatura di ${pu(String(T), 'K')}. Quanto vale l'energia cinetica media di una sua molecola? ${KB_NOTE}`),
		solution: `K_m \\approx ${wu(must(K, 3), 'J')}`,
		steps: [`K_m = \\dfrac{3}{2}\\,k_B\\,T = \\dfrac{3}{2} \\cdot ${KB_TEX} \\cdot ${wu(String(T), 'K')} ${approx(K, 'J', 3)}`],
		// the 3/2 forgotten; 1/2 in its place; 273 taken away
		answer: options(rng, K, [K_B * T, 0.5 * K_B * T, T > 300 ? 1.5 * K_B * (T - 273) : 3 * K_B * T], 'J', 3),
		params: { case: 'kelvin', T },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the same from degrees Celsius

function level2(rng: Rng): Built {
	const cold = rng.next() < 0.3;
	const tC = cold ? -noZero(rng, 11, 199) : noZero(rng, 11, 699);
	const T = tC + 273;
	const K = 1.5 * K_B * T;
	return {
		prompt: "Trova l'energia cinetica media.",
		problem: textBlock(`Un gas è alla temperatura di ${pu(fx(tC), 'C')}. Quanto vale l'energia cinetica media di una sua molecola? ${KB_NOTE}`),
		solution: `K_m \\approx ${wu(must(K, 3), 'J')}`,
		steps: [
			t('La temperatura va in kelvin:') + ` \\; T = ${fx(tC)} + 273 = ${wu(String(T), 'K')}`,
			`K_m = \\dfrac{3}{2}\\,k_B\\,T = \\dfrac{3}{2} \\cdot ${KB_TEX} \\cdot ${wu(String(T), 'K')} ${approx(K, 'J', 3)}`,
		],
		// the Celsius temperature in the formula; the 3/2 forgotten; 273 taken away instead of added
		answer: options(rng, K, [1.5 * K_B * Math.abs(tC), K_B * T, 1.5 * K_B * Math.abs(tC - 273)], 'J', 3),
		params: { case: cold ? 'sotto zero' : 'sopra zero', t: tC },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the temperature from the mean kinetic energy

function level3(rng: Rng): Built {
	const K = rounded(1.5 * K_B * noZero(rng, 151, 1499), 3);
	const T = (2 * K) / (3 * K_B);
	const KTex = sci(K, 3);
	return {
		prompt: 'Trova la temperatura del gas.',
		problem: textBlock(`L'energia cinetica media delle molecole di un gas è ${pu(KTex, 'J')}. Qual è la temperatura del gas, in kelvin? ${KB_NOTE}`),
		solution: `T \\approx ${wu(must(T, 3), 'K')}`,
		steps: [`K_m = \\dfrac{3}{2}\\,k_B\\,T \\quad\\Rightarrow\\quad T = \\dfrac{2\\,K_m}{3\\,k_B}`, `T = \\dfrac{2 \\cdot ${KTex}\\,\\text{J}}{3 \\cdot ${KB_TEX}} ${approx(T, 'K', 3)}`],
		// the 2/3 forgotten; 3/2 in its place; 273 taken away from the kelvin
		answer: options(rng, T, [K / K_B, (3 * K) / (2 * K_B), T - 273], 'K', 3),
		params: { case: 'temperatura', K: String(K) },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the root-mean-square speed

function level4(rng: Rng): Built {
	const g = rng.pick(GASES);
	const T = noZero(rng, 151, 999);
	const M = g.M / 1000;
	const v = Math.sqrt((3 * R_GAS * T) / M);
	const MTex = fx(g.M, g.d);
	return {
		prompt: 'Trova la velocità quadratica media.',
		problem: textBlock(`Un recipiente contiene ${g.name} (massa molare ${pu(MTex, 'gmol')}) a ${pu(String(T), 'K')}. Quanto vale la velocità quadratica media delle sue ${g.mono ? 'particelle' : 'molecole'}? ${R_NOTE}`),
		solution: `v_{qm} \\approx ${wu(must(v, 3), 'ms')}`,
		steps: [
			`M = ${wu(MTex, 'gmol')} = ${MTex} \\cdot 10^{-3}\\,\\text{kg/mol}`,
			`v_{qm} = \\sqrt{\\dfrac{3\\,R\\,T}{M}} = \\sqrt{\\dfrac{3 \\cdot 8{,}31 \\cdot ${T}}{${MTex} \\cdot 10^{-3}}}\\,\\text{m/s} ${approx(v, 'ms', 3)}`,
		],
		// the molar mass left in grams; the 3 forgotten; the root forgotten
		answer: options(rng, v, [Math.sqrt((3 * R_GAS * T) / g.M), Math.sqrt((R_GAS * T) / M), (3 * R_GAS * T) / M], 'ms', 3),
		params: { case: g.mono ? 'atomi' : 'molecole', gas: g.name, T },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the ratio of two speeds

function level5(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const t1 = noZero(rng, 11, 99);
		const t2 = noZero(rng, t1 + 150, 899);
		const T1 = t1 + 273, T2 = t2 + 273;
		const k = Math.sqrt(T2 / T1);
		return {
			prompt: 'Trova di quante volte aumenta la velocità.',
			problem: textBlock(`Un gas viene scaldato da ${pu(String(t1), 'C')} a ${pu(String(t2), 'C')}. Di quante volte aumenta la velocità quadratica media delle sue molecole?`),
			solution: `\\dfrac{v_2}{v_1} \\approx ${must(k, 3)}`,
			steps: [
				t('Le temperature vanno in kelvin:') + ` \\; T_1 = ${wu(String(T1), 'K')}, \\quad T_2 = ${wu(String(T2), 'K')}`,
				t('La velocità quadratica media va con la radice della temperatura assoluta:'),
				`\\dfrac{v_2}{v_1} = \\sqrt{\\dfrac{T_2}{T_1}} = \\sqrt{\\dfrac{${T2}}{${T1}}} ${approx(k, '', 3)}`,
			],
			// the root forgotten; the Celsius temperatures under the root; their plain ratio
			answer: options(rng, k, [T2 / T1, Math.sqrt(t2 / t1), t2 / t1], '', 3),
			params: { case: 'due temperature', t1, t2 },
		};
	}
	for (;;) {
		const a = rng.pick(GASES), b = rng.pick(GASES);
		if (b.M / a.M < 1.3) continue; // a is the lighter one
		const k = Math.sqrt(b.M / a.M);
		const aTex = fx(a.M, a.d), bTex = fx(b.M, b.d);
		return {
			prompt: 'Trova il rapporto tra le velocità.',
			problem: textBlock(`Due recipienti alla stessa temperatura contengono ${a.name} (${pu(aTex, 'gmol')}) e ${b.name} (${pu(bTex, 'gmol')}). Quante volte è più grande la velocità quadratica media nel gas più leggero?`),
			solution: `\\dfrac{v_1}{v_2} \\approx ${must(k, 3)}`,
			steps: [
				t('Alla stessa temperatura la velocità quadratica media va con la radice dell’inverso della massa molare:'),
				`\\dfrac{v_1}{v_2} = \\sqrt{\\dfrac{M_2}{M_1}} = \\sqrt{\\dfrac{${bTex}}{${aTex}}} ${approx(k, '', 3)}`,
			],
			// the root forgotten; the ratio upside down, with and without the root
			answer: options(rng, k, [b.M / a.M, Math.sqrt(a.M / b.M), a.M / b.M], '', 3),
			params: { case: 'due gas', leggero: a.name, pesante: b.name },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the temperature from the speed

function level6(rng: Rng): Built {
	const g = rng.pick(GASES);
	const M = g.M / 1000;
	const v = rounded(Math.sqrt((3 * R_GAS * noZero(rng, 151, 1199)) / M), 3);
	const T = (M * v * v) / (3 * R_GAS);
	const MTex = fx(g.M, g.d);
	const vTex = must(v, 3);
	return {
		prompt: 'Trova la temperatura del gas.',
		problem: textBlock(`In un recipiente di ${g.name} (massa molare ${pu(MTex, 'gmol')}) la velocità quadratica media è ${pu(vTex, 'ms')}. Qual è la temperatura del gas, in kelvin? ${R_NOTE}`),
		solution: `T \\approx ${wu(must(T, 3), 'K')}`,
		steps: [
			`v_{qm}^2 = \\dfrac{3\\,R\\,T}{M} \\quad\\Rightarrow\\quad T = \\dfrac{M\\,v_{qm}^2}{3\\,R}`,
			`T = \\dfrac{${MTex} \\cdot 10^{-3} \\cdot (${vTex})^2}{3 \\cdot 8{,}31}\\,\\text{K} ${approx(T, 'K', 3)}`,
		],
		// the 3 forgotten; the 3 used twice; 273 taken away from the kelvin
		answer: options(rng, T, [3 * T, T / 3, T - 273], 'K', 3),
		params: { case: g.mono ? 'atomi' : 'molecole', gas: g.name, v: String(v) },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisTemperaturaMicroscopica: Generator = {
	id: ID,
	title: 'Temperatura ed energia cinetica delle molecole',
	levels: {
		1: { label: "L'energia cinetica media", constraints: ['K_m = (3/2) k_B T', 'temperatura in kelvin'] },
		2: { label: 'Dai gradi Celsius', constraints: ['prima i kelvin', 'anche sotto zero'] },
		3: { label: "La temperatura dall'energia cinetica media", constraints: ['T = 2 K_m / (3 k_B)'] },
		4: { label: 'La velocità quadratica media', constraints: ['v_qm = √(3RT/M)', 'la massa molare in kg/mol'] },
		5: { label: 'Il rapporto tra due velocità', constraints: ['radice del rapporto delle temperature assolute', 'radice del rapporto inverso delle masse molari'] },
		6: { label: 'La temperatura dalla velocità', constraints: ['T = M v_qm² / (3R)'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisTemperaturaMicroscopica;
