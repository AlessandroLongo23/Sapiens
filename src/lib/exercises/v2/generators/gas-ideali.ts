/**
 * L'equazione di stato dei gas ideali. Spec: specs/exercises/gas-ideali.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/37-gas-ideali.md), each one step harder: the volume of a
 * gas from n, T and p; the pressure from a mass (the moles first); the moles with the units of the International
 * System (kPa and mL, R = 8,31); the temperature in degrees Celsius; the molar mass from m, V, T and p; the density of
 * a gas at a temperature and pressure. R = 0,0821 L·atm/(mol·K) or 8,31 J/(mol·K), T = t + 273. Data with three
 * significant figures and whole degrees, results rounded to three figures (the temperature to the degree).
 * Distractors from the lesson's warnings: the temperature left in degrees Celsius, the wrong R for the units, kPa or
 * mL not converted, the mass used as moles, the density or molar mass of normal conditions (22,4 L/mol) used at another
 * temperature, a formula turned upside down.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, R_ATM, R_SI, VM, answerOf, checkCommon, choiceOf, formulaTex, generateWith, molar100, opt, pq, q, sig, t, textBlock, three, noZero } from '../chim-mole';

export const ID = 'gas-ideali';

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
	['C4H10', 'butano', 'del '],
	['C2H4', 'etene', "dell'"],
	['H2S', 'solfuro di idrogeno', 'del '],
	['N2O', 'protossido di azoto', 'del '],
];

const tex = (s: string) => s.replace('.', '{,}');
const fx = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');
const gas = (rng: Rng) => {
	const [f, name, art] = rng.pick(GASES);
	return { f, name, art, M: molar100(f) / 100, T: formulaTex(f), elem: /^[A-Z][a-z]?2$/.test(f) };
};
const deg = (tc: number) => pq(String(tc), 'C');
/** A temperature in °C between lo and hi, not a multiple of 10 (T = t + 273 then has no zero to hide). */
const temp = (rng: Rng, lo: number, hi: number) => noZero(rng, lo, hi);

// ---------------------------------------------------------------------------
// Level 1: the volume

function level1(rng: Rng): Built {
	const g = gas(rng);
	const n = three(rng, 0.1, 5);
	const tc = temp(rng, 1, 99);
	const T = tc + 273;
	const p = three(rng, 0.5, 5);
	const exact = (Number(n) * R_ATM * T) / Number(p);
	return {
		prompt: 'Trova il volume.',
		problem: textBlock(`Che volume occupano ${pq(tex(n), 'mol')} di ${g.name} a ${deg(tc)} e ${pq(tex(p), 'atm')}?`),
		solution: `V \\approx ${q(sig(exact, 3)!.tex, 'L')}`,
		steps: [`T = ${tc} + 273 = ${T}\\,\\text{K}`, `V = \\dfrac{n\\,R\\,T}{p} = \\dfrac{${tex(n)} \\cdot 0{,}0821 \\cdot ${T}}{${tex(p)}}\\,\\text{L} \\approx ${q(sig(exact, 3)!.tex, 'L')}`],
		// the temperature in °C; R = 8,31 with atm and L; the pressure multiplied
		answer: answerOf(rng, exact, [(Number(n) * R_ATM * tc) / Number(p), (Number(n) * R_SI * T) / Number(p), Number(n) * R_ATM * T * Number(p)], 3, 'L'),
		params: { case: 'volume', n, t: tc, p, gas: g.f },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the pressure from a mass

function level2(rng: Rng): Built {
	const g = gas(rng);
	const m = three(rng, 1, 99.9);
	const V = three(rng, 1, 99.9);
	const tc = temp(rng, 1, 99);
	const T = tc + 273;
	const n = Number(m) / g.M;
	const exact = (n * R_ATM * T) / Number(V);
	return {
		prompt: 'Trova la pressione.',
		problem: textBlock(`Un recipiente di ${pq(tex(V), 'L')} contiene ${pq(tex(m), 'g')} di ${g.name}, $${g.T}$, a ${deg(tc)}. Qual è la pressione del gas?`),
		solution: `p \\approx ${q(sig(exact, 3)!.tex, 'atm')}`,
		steps: [`n = \\dfrac{m}{M} = \\dfrac{${tex(m)}}{${fx(g.M, 2)}}\\,\\text{mol} = ${fx(n, 4)}\\,\\text{mol} \\qquad T = ${T}\\,\\text{K}`, `p = \\dfrac{n\\,R\\,T}{V} = \\dfrac{${fx(n, 4)} \\cdot 0{,}0821 \\cdot ${T}}{${tex(V)}}\\,\\text{atm} \\approx ${q(sig(exact, 3)!.tex, 'atm')}`],
		// the mass used as moles; the temperature in °C; the atom's mass for an element
		answer: answerOf(rng, exact, [(Number(m) * R_ATM * T) / Number(V), (n * R_ATM * tc) / Number(V), ...(g.elem ? [(2 * n * R_ATM * T) / Number(V)] : [])], 3, 'atm'),
		params: { case: 'pressione', m, V, t: tc, gas: g.f },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the International System

function level3(rng: Rng): Built {
	const g = gas(rng);
	const p = three(rng, 50, 500); // kPa
	const V = three(rng, 100, 999); // mL
	const tc = temp(rng, 1, 99);
	const T = tc + 273;
	const exact = (Number(p) * 1000 * Number(V) * 1e-6) / (R_SI * T);
	const pPa = sig(Number(p) * 1000, 3)!.tex;
	const Vm3 = sig(Number(V) * 1e-6, 3)!.tex;
	return {
		prompt: 'Trova le moli.',
		problem: textBlock(`Una siringa contiene ${pq(tex(V), 'mL')} di ${g.name} a ${pq(tex(p), 'kPa')} e ${deg(tc)}. Quante moli di gas contiene?`),
		solution: `n \\approx ${q(sig(exact, 3)!.tex, 'mol')}`,
		steps: [t('Con R = 8,31 la pressione va in pascal e il volume in metri cubi:'), `p = ${pPa}\\,\\text{Pa} \\qquad V = ${Vm3}\\,\\text{m}^3 \\qquad T = ${T}\\,\\text{K}`, `n = \\dfrac{p\\,V}{R\\,T} = \\dfrac{${pPa} \\cdot ${Vm3}}{8{,}31 \\cdot ${T}}\\,\\text{mol} \\approx ${q(sig(exact, 3)!.tex, 'mol')}`],
		// kPa not converted; mL taken as litres (V ×1000 too big, in m³); R = 0,0821 with kPa and mL→L
		answer: answerOf(rng, exact, [exact / 1000, exact * 1000, (Number(p) * Number(V) * 1e-3) / (R_ATM * T), (Number(p) * 1000 * Number(V) * 1e-6) / (R_SI * tc)], 3, 'mol'),
		params: { case: 'SI', p, V, t: tc, gas: g.f },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the temperature

function level4(rng: Rng): Built {
	for (;;) {
		const g = gas(rng);
		const tc = temp(rng, 11, 199);
		const n = three(rng, 0.1, 5);
		const p = three(rng, 0.5, 5);
		const V0 = (Number(n) * R_ATM * (tc + 273)) / Number(p);
		const Vr = sig(V0, 3);
		if (!Vr || Vr.value.includes('e') || V0 < 1) continue;
		const V = Vr.value;
		const T = (Number(p) * Number(V)) / (Number(n) * R_ATM);
		const exact = T - 273;
		const digits = String(Math.round(exact)).length;
		const ans = sig(exact, digits);
		if (!ans || ans.value.includes('.') || Math.round(exact) % 10 === 0) continue;
		const intOpt = (x: number) => {
			const r = Math.round(x);
			return r > 0 && Math.abs(x - Math.floor(x) - 0.5) > 1e-6 ? opt({ tex: String(r), value: String(r) }, 'C') : null;
		};
		const mistakes = [T, T + 273, exact + 15, exact - 15, exact + 30].map(intOpt).filter((o): o is NonNullable<typeof o> => o !== null);
		return {
			prompt: 'Trova la temperatura.',
			problem: textBlock(`${pq(tex(n), 'mol')} di ${g.name} occupano ${pq(tex(V), 'L')} alla pressione di ${pq(tex(p), 'atm')}. A quale temperatura, in gradi Celsius, si trova il gas?`),
			solution: `t \\approx ${q(ans.tex, 'C')}`,
			steps: [`T = \\dfrac{p\\,V}{n\\,R} = \\dfrac{${tex(p)} \\cdot ${tex(V)}}{${tex(n)} \\cdot 0{,}0821}\\,\\text{K} = ${fx(T, 1)}\\,\\text{K}`, `t = T - 273 \\approx ${q(ans.tex, 'C')}`],
			// the kelvin read as °C; 273 added instead of subtracted; then nearby temperatures
			answer: choiceOf(rng, opt(ans, 'C'), mistakes),
			params: { case: 'temperatura', n, V, p, gas: g.f },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the molar mass

function level5(rng: Rng): Built {
	for (;;) {
		const g = gas(rng);
		const m = three(rng, 0.1, 9.99);
		const tc = temp(rng, 1, 99);
		const T = tc + 273;
		const p = three(rng, 0.5, 2);
		const Vr = sig((Number(m) / g.M) * R_ATM * T / Number(p), 3);
		if (!Vr || Vr.value.includes('e')) continue;
		const V = Vr.value;
		const exact = (Number(m) * R_ATM * T) / (Number(p) * Number(V));
		if (!sig(exact, 3)) continue;
		return {
			prompt: 'Trova la massa molare.',
			problem: textBlock(`Un recipiente di ${pq(tex(V), 'L')} contiene ${pq(tex(m), 'g')} di un gas, a ${deg(tc)} e ${pq(tex(p), 'atm')}. Qual è la massa molare del gas?`),
			solution: `M \\approx ${q(sig(exact, 3)!.tex, 'gmol')}`,
			steps: [`M = \\dfrac{m\\,R\\,T}{p\\,V} = \\dfrac{${tex(m)} \\cdot 0{,}0821 \\cdot ${T}}{${tex(p)} \\cdot ${tex(V)}}\\,\\text{g/mol} \\approx ${q(sig(exact, 3)!.tex, 'gmol')}`],
			// the temperature in °C; normal conditions assumed (m · 22,4 / V); the formula upside down
			answer: answerOf(rng, exact, [(Number(m) * R_ATM * tc) / (Number(p) * Number(V)), (Number(m) * VM) / Number(V), (Number(p) * Number(V)) / (Number(m) * R_ATM * T)], 3, 'gmol'),
			params: { case: 'massa molare', m, V, t: tc, p, gas: g.f },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the density

function level6(rng: Rng): Built {
	const g = gas(rng);
	const tc = temp(rng, 1, 199);
	const T = tc + 273;
	const p = three(rng, 0.5, 5);
	const exact = (Number(p) * g.M) / (R_ATM * T);
	return {
		prompt: 'Trova la densità.',
		problem: textBlock(`Qual è la densità ${g.art}${g.name}, $${g.T}$, a ${deg(tc)} e ${pq(tex(p), 'atm')}?`),
		solution: `d \\approx ${q(sig(exact, 3)!.tex, 'gL')}`,
		steps: [`M = ${fx(g.M, 2)}\\,\\text{g/mol} \\qquad T = ${T}\\,\\text{K}`, `d = \\dfrac{p\\,M}{R\\,T} = \\dfrac{${tex(p)} \\cdot ${fx(g.M, 2)}}{0{,}0821 \\cdot ${T}}\\,\\text{g/L} \\approx ${q(sig(exact, 3)!.tex, 'gL')}`],
		// normal conditions assumed (M / 22,4); the temperature in °C; upside down
		answer: answerOf(rng, exact, [g.M / VM, (Number(p) * g.M) / (R_ATM * tc), (R_ATM * T) / (Number(p) * g.M)], 3, 'gL'),
		params: { case: 'densità', t: tc, p, gas: g.f },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const gasIdeali: Generator = {
	id: ID,
	title: "L'equazione di stato dei gas ideali",
	levels: {
		1: { label: 'Il volume di un gas', constraints: ['R = 0,0821', 'temperatura in °C da convertire'] },
		2: { label: 'La pressione da una massa', constraints: ['prima le moli'] },
		3: { label: 'Con le unità del SI', constraints: ['kPa e mL', 'R = 8,31'] },
		4: { label: 'La temperatura', constraints: ['risultato in gradi Celsius'] },
		5: { label: 'La massa molare', constraints: ['M = mRT/(pV)'] },
		6: { label: 'La densità di un gas', constraints: ['d = pM/(RT)'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default gasIdeali;
