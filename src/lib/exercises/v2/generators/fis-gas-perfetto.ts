/**
 * L'equazione di stato del gas perfetto. Spec: specs/exercises/fis-gas-perfetto.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/104-fis-gas-perfetto.md), each one step harder: the
 * volume in a second state when pressure and temperature both change, p1 V1 / T1 = p2 V2 / T2; the moles from
 * p V = n R T with the data already in SI units; the pressure with the volume in litres and the temperature in
 * degrees Celsius to convert; the number of molecules from p V = N kB T, in scientific notation; the moles that left
 * a rigid cylinder whose pressure dropped at constant temperature. Multiple choice with the unit in the option and
 * the lesson's mistakes: degrees Celsius in place of kelvin, litres in place of cubic metres, the moles that remain
 * in place of those that left.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { type Built, type Fmt, type R, type Sci, R_GAS, SIG2, SIG3, ZERO_C, ambiguous, checkCommon, fmt, fmtExact, generateWith, options, pu, q, sciOptions, sciTex, sciTie, tie, wu } from '../fis-gas-leggi';

export const ID = 'fis-gas-perfetto';

const ONE_DEC: Fmt = { kind: 'fixed', d: 1 };
const R_TEX = '$R = 8{,}31\\,\\text{J/(mol}\\cdot\\text{K)}$';
const R_STEP = '8{,}31\\,\\text{J/(mol}\\cdot\\text{K)}';
const KB_TEX = '$k_B = 1{,}38 \\cdot 10^{-23}\\,\\text{J/K}$';
const kelvin = (t: R) => t.add(ZERO_C);
const toK = (name: string, t: R) => `${name} = ${fmtExact(t)} + 273 = ${wu(fmtExact(kelvin(t)), 'K')}`;
/** A whole number between lo and hi that does not end in zero. */
function whole(rng: Rng, lo: number, hi: number): number {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return k;
	}
}

// ---------------------------------------------------------------------------
// Level 1: from one state to another

function level1(rng: Rng): Built {
	for (;;) {
		const V1 = q(rng.int(11, 99), 10);
		const p1 = q(whole(rng, 101, 299));
		const p2 = q(whole(rng, 31, 399));
		const t1 = q(rng.int(5, 35));
		const t2 = q(rng.int(-50, 200));
		const ratio = p1.div(p2);
		if (Math.abs(t2.num - t1.num) < 15 || t2.num === 0) continue;
		if (ratio.compare(q(9, 10)) > 0 && ratio.compare(q(10, 9)) < 0) continue;
		if (ratio.compare(q(1, 4)) < 0 || ratio.compare(q(5)) > 0) continue;
		const V2 = V1.mul(ratio).mul(kelvin(t2)).div(kelvin(t1));
		if (tie(V2, SIG2) || ambiguous(V2, SIG2)) continue;
		return {
			prompt: 'Trova il volume finale.',
			problem: textBlock(
				`Un gas occupa ${pu(fmt(V1, SIG2), 'L')} a ${pu(fmtExact(t1), 'C')} e alla pressione di ${pu(fmtExact(p1), 'kPa')}. Viene portato a ${pu(fmtExact(t2), 'C')} e alla pressione di ${pu(fmtExact(p2), 'kPa')}, senza che ne esca. Che volume occupa?`,
			),
			solution: `V_2 \\approx ${wu(fmt(V2, SIG2), 'L')}`,
			steps: [
				`${toK('T_1', t1)}, \\quad ${toK('T_2', t2)}`,
				'\\dfrac{p_1\\,V_1}{T_1} = \\dfrac{p_2\\,V_2}{T_2}',
				`V_2 = V_1 \\cdot \\dfrac{p_1}{p_2} \\cdot \\dfrac{T_2}{T_1} = ${wu(fmt(V1, SIG2), 'L')} \\cdot \\dfrac{${wu(fmtExact(p1), 'kPa')}}{${wu(fmtExact(p2), 'kPa')}} \\cdot \\dfrac{${wu(fmtExact(kelvin(t2)), 'K')}}{${wu(fmtExact(kelvin(t1)), 'K')}} \\approx ${wu(fmt(V2, SIG2), 'L')}`,
			],
			// the Celsius temperatures; the temperatures upside down; the pressures upside down; the temperature left out
			answer: options(rng, V2, [V1.mul(ratio).mul(t2).div(t1), V1.mul(ratio).mul(kelvin(t1)).div(kelvin(t2)), V1.div(ratio).mul(kelvin(t2)).div(kelvin(t1)), V1.mul(ratio)], 'L', SIG2),
			params: { V1: V1.toString(), p1: p1.toString(), p2: p2.toString(), t1: t1.toString(), t2: t2.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the moles, data in SI units

function level2(rng: Rng): Built {
	for (;;) {
		const p = q(whole(rng, 101, 499)).mul(q(1000));
		const V = q(rng.int(11, 99), 1000);
		const T = q(whole(rng, 251, 399));
		const n = p.mul(V).div(R_GAS.mul(T));
		if (tie(n, SIG2) || ambiguous(n, SIG2)) continue;
		return {
			prompt: 'Trova il numero di moli.',
			problem: textBlock(`Un recipiente di ${pu(fmt(V, SIG2), 'm3')} contiene un gas alla pressione di ${pu(fmt(p, SIG3), 'Pa')} e alla temperatura di ${pu(fmtExact(T), 'K')}. Quante moli di gas contiene? Usa ${R_TEX}.`),
			solution: `n \\approx ${wu(fmt(n, SIG2), 'mol')}`,
			steps: [
				'p\\,V = n\\,R\\,T \\quad\\Rightarrow\\quad n = \\dfrac{p\\,V}{R\\,T}',
				`n = \\dfrac{${wu(fmt(p, SIG3), 'Pa')} \\cdot ${wu(fmt(V, SIG2), 'm3')}}{${R_STEP} \\cdot ${wu(fmtExact(T), 'K')}} \\approx ${wu(fmt(n, SIG2), 'mol')}`,
			],
			// 273 taken away from a temperature already in kelvin; the temperature forgotten; R forgotten
			answer: options(rng, n, [T.num > 280 ? p.mul(V).div(R_GAS.mul(T.sub(ZERO_C))) : null, p.mul(V).div(R_GAS), p.mul(V).div(T)], 'mol', SIG2),
			params: { p: p.toString(), V: V.toString(), T: T.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the pressure, with litres and degrees Celsius

function level3(rng: Rng): Built {
	for (;;) {
		const n = q(rng.int(11, 99), 10);
		const VL = rng.next() < 0.5 ? q(rng.int(11, 99), 10) : q(whole(rng, 11, 99));
		const t = q(rng.int(5, 95));
		const V = VL.div(q(1000));
		const p = n.mul(R_GAS).mul(kelvin(t)).div(V);
		if (tie(p, SIG2)) continue;
		return {
			prompt: 'Trova la pressione del gas.',
			problem: textBlock(`Un recipiente da ${pu(fmt(VL, SIG2), 'L')} contiene ${pu(fmt(n, SIG2), 'mol')} di gas a ${pu(fmtExact(t), 'C')}. Quanto vale la pressione del gas? Usa ${R_TEX}.`),
			solution: `p \\approx ${wu(fmt(p, SIG2), 'Pa')}`,
			steps: [
				`${toK('T', t)}, \\quad V = ${wu(fmt(VL, SIG2), 'L')} = ${wu(fmt(V, SIG2), 'm3')}`,
				'p\\,V = n\\,R\\,T \\quad\\Rightarrow\\quad p = \\dfrac{n\\,R\\,T}{V}',
				`p = \\dfrac{${wu(fmt(n, SIG2), 'mol')} \\cdot ${R_STEP} \\cdot ${wu(fmtExact(kelvin(t)), 'K')}}{${wu(fmt(V, SIG2), 'm3')}} \\approx ${wu(fmt(p, SIG2), 'Pa')}`,
			],
			// the litres not converted; the degrees Celsius; both
			answer: options(rng, p, [n.mul(R_GAS).mul(kelvin(t)).div(VL), n.mul(R_GAS).mul(t).div(V), n.mul(R_GAS).mul(t).div(VL)], 'Pa', SIG2),
			params: { n: n.toString(), VL: VL.toString(), t: t.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the number of molecules

function level4(rng: Rng): Built {
	for (;;) {
		const V = q(rng.int(11, 99), 10); // cm³
		const p = q(rng.int(11, 99), 10); // 10^5 Pa
		const t = q(rng.int(5, 95));
		const T = kelvin(t);
		const kB = q(138, 100);
		// N = p V / (kB T): mantissas apart, the exponent is 5 − 6 + 23
		const N: Sci = { m: p.mul(V).div(kB.mul(T)), e: 22 };
		if (sciTie(N, 2)) continue;
		const pTex = `${fmt(p, ONE_DEC)} \\cdot 10^{5}`;
		const mistakes: Sci[] = [
			{ m: N.m, e: N.e + 6 }, // the cubic centimetres not converted
			{ m: p.mul(V).div(kB.mul(t)), e: 22 }, // the degrees Celsius
			{ m: p.mul(V).div(R_GAS.mul(T)), e: -1 }, // R in place of kB: the moles
			{ m: N.m, e: N.e + 3 },
			{ m: N.m, e: N.e - 3 },
		];
		return {
			prompt: 'Trova il numero di molecole.',
			problem: textBlock(`Quante molecole ci sono in ${pu(fmt(V, SIG2), 'cm3')} di gas a ${pu(fmtExact(t), 'C')} e alla pressione di ${pu(pTex, 'Pa')}? Usa ${KB_TEX}.`),
			solution: `N \\approx ${sciTex(N, 2)}`,
			steps: [
				`${toK('T', t)}, \\quad V = ${wu(fmt(V, SIG2), 'cm3')} = ${fmt(V, SIG2)} \\cdot 10^{-6}\\,\\text{m}^3`,
				'p\\,V = N\\,k_B\\,T \\quad\\Rightarrow\\quad N = \\dfrac{p\\,V}{k_B\\,T}',
				`N = \\dfrac{${wu(pTex, 'Pa')} \\cdot ${fmt(V, SIG2)} \\cdot 10^{-6}\\,\\text{m}^3}{1{,}38 \\cdot 10^{-23}\\,\\text{J/K} \\cdot ${wu(fmtExact(T), 'K')}} \\approx ${sciTex(N, 2)}`,
			],
			answer: sciOptions(rng, N, mistakes, 2),
			params: { V: V.toString(), p: p.toString(), t: t.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the gas that left the cylinder

function level5(rng: Rng): Built {
	for (;;) {
		const VL = q(rng.int(100, 500), 10);
		const a = whole(rng, 221, 299);
		const b = whole(rng, 101, a - 100);
		const p1 = q(a).mul(q(10000));
		const p2 = q(b).mul(q(10000));
		const t = q(rng.int(5, 35));
		const T = kelvin(t);
		const V = VL.div(q(1000));
		const dn = p1.sub(p2).mul(V).div(R_GAS.mul(T));
		if (tie(dn, SIG3) || ambiguous(dn, SIG3)) continue;
		const dp = p1.sub(p2);
		return {
			prompt: 'Trova quante moli di gas sono uscite.',
			problem: textBlock(
				`Una bombola da ${pu(fmt(VL, ONE_DEC), 'L')} contiene gas a ${pu(fmtExact(t), 'C')}, alla pressione di ${pu(fmt(p1, SIG3), 'Pa')}. Dopo un certo uso, alla stessa temperatura, la pressione è ${pu(fmt(p2, SIG3), 'Pa')}. Quante moli di gas sono uscite? Usa ${R_TEX}.`,
			),
			solution: `n_1 - n_2 \\approx ${wu(fmt(dn, SIG3), 'mol')}`,
			steps: [
				`${toK('T', t)}, \\quad V = ${wu(fmt(VL, ONE_DEC), 'L')} = ${wu(fmt(V, SIG3), 'm3')}`,
				'n_1 = \\dfrac{p_1\\,V}{R\\,T}, \\quad n_2 = \\dfrac{p_2\\,V}{R\\,T} \\quad\\Rightarrow\\quad n_1 - n_2 = \\dfrac{(p_1 - p_2)\\,V}{R\\,T}',
				`p_1 - p_2 = ${wu(fmt(dp, SIG3), 'Pa')}`,
				`n_1 - n_2 = \\dfrac{${wu(fmt(dp, SIG3), 'Pa')} \\cdot ${wu(fmt(V, SIG3), 'm3')}}{${R_STEP} \\cdot ${wu(fmtExact(T), 'K')}} \\approx ${wu(fmt(dn, SIG3), 'mol')}`,
			],
			// the moles that remain; the moles at the start; the degrees Celsius
			answer: options(rng, dn, [p2.mul(V).div(R_GAS.mul(T)), p1.mul(V).div(R_GAS.mul(T)), dp.mul(V).div(R_GAS.mul(t))], 'mol', SIG3),
			params: { VL: VL.toString(), p1: p1.toString(), p2: p2.toString(), t: t.toString() },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const fisGasPerfetto: Generator = {
	id: ID,
	title: "L'equazione di stato del gas perfetto",
	levels: {
		1: { label: "Da uno stato all'altro", constraints: ['p1 V1 / T1 = p2 V2 / T2', 'temperature in gradi Celsius da convertire'] },
		2: { label: 'Le moli di gas', constraints: ['n = p V / (R T)', 'dati già in unità SI'] },
		3: { label: 'La pressione, con litri e gradi Celsius', constraints: ['p = n R T / V', 'litri e gradi Celsius da convertire'] },
		4: { label: 'Il numero di molecole', constraints: ['N = p V / (kB T)', 'risposta in notazione scientifica'] },
		5: { label: 'Il gas uscito dalla bombola', constraints: ['n1 − n2 = (p1 − p2) V / (R T)', 'volume e temperatura costanti'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisGasPerfetto;
