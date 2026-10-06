/**
 * La trasformazione adiabatica. Spec: specs/exercises/fis-trasformazione-adiabatica.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/113-fis-trasformazione-adiabatica.md), each one step
 * harder: the work from the change of temperature, with its sign (W = n C_V (T_A - T_B)); the final pressure from
 * p V^γ = costante; the final temperature from T V^(γ-1) = costante; the final volume from the pressures (the law
 * turned round); a compression with the temperatures in degrees Celsius; the work from pressures and volumes, in two
 * steps. Levels 2 and 6 draw the transformation in the pressure-volume plane (scene `curve-pv`). Results are never
 * near a rounding boundary. Distractors from the lesson's warnings: Boyle's law used for an adiabat, the ratio of the
 * volumes upside down, γ for γ - 1, the γ of the other kind of gas, the sign of the work, degrees Celsius in the
 * formula, litres not turned into cubic metres.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, type Gas, CP, CV, GASES, R, R_TEXT, ambiguous, answerOf, checkCommon, choiceOf, cvTex, gamma, gamma1Tex, gammaTex, generateWith, h3, kind, opt, pq, pvScene, q, shown, sig, sigS, t, tex, textBlock } from '../fis-calori-adiabatica';

export const ID = 'fis-trasformazione-adiabatica';

const CYL = 'In un cilindro con le pareti isolanti';
const RATIOS = [1.5, 2, 2.5, 3, 4];
const lab = (s: string) => s.replace('.', ',');
const otherGamma = (g: Gas) => (g.l === 3 ? 7 / 5 : 5 / 3);
/**
 * A product of two data that falls exactly on a rounding boundary (4,05 · 1,5 = 6,075) is pushed over it, as rounding
 * half up does: the mistake it stands for must stay among the options.
 */
const up = (x: number) => x * (1 + 1e-7);
const gammaStep = (g: Gas) => t(`Il gas è ${kind(g)}: `) + `\\gamma = ${gammaTex(g)}`;

/** Two volumes in litres with three figures whose ratio is one of RATIOS, in the order of the transformation. */
function volumes(rng: Rng, expansion: boolean): { VA: string; VB: string } {
	for (;;) {
		const small = rng.int(10, 30) * 10;
		const big = small * rng.pick(RATIOS);
		if (big >= 1000 || !Number.isInteger(big)) continue;
		const a = h3(small), b = h3(big);
		return expansion ? { VA: a, VB: b } : { VA: b, VB: a };
	}
}

// Level 1: the work from the temperatures.
function level1(rng: Rng): Built {
	const expansion = rng.next() < 0.5;
	for (;;) {
		const g = rng.pick(GASES);
		const n = h3(rng.int(20, 80) * 5);
		const TA = rng.int(280, 450), dT = rng.int(15, 150);
		const TB = expansion ? TA - dT : TA + dT;
		const exact = Number(n) * CV(g) * (TA - TB);
		const ans = sigS(exact, 3);
		if (!ans || ambiguous(ans) || TB < 150) continue;
		return {
			prompt: 'Trova il lavoro, con il suo segno.',
			problem: textBlock(`${CYL} ${pq(tex(n), 'mol')} di ${g.nome}, un gas ${kind(g)}, ${expansion ? 'si espandono' : 'vengono compresse'}: la temperatura passa da ${pq(String(TA), 'K')} a ${pq(String(TB), 'K')}. Quanto lavoro compie il gas? ${R_TEXT}`),
			solution: `W \\approx ${q(ans.tex, 'J')}`,
			steps: [
				`${t('La trasformazione è adiabatica: ')} Q = 0, \\quad W = -\\Delta U = n\\,C_V\\,(T_A - T_B)`,
				t(`Il gas è ${kind(g)}: `) + `C_V = ${cvTex(g)}\\,R`,
				`W = ${tex(n)} \\cdot ${cvTex(g)} \\cdot 8{,}31 \\cdot (${TA} - ${TB})\\,\\text{J} = ${shown(exact)}\\ldots\\,\\text{J} \\approx ${q(ans.tex, 'J')}`,
				t(expansion ? 'Il gas si espande e si raffredda: il lavoro è positivo.' : 'Il gas viene compresso e si scalda: il lavoro è negativo.'),
			],
			// the sign; C_p for C_V; R alone
			answer: answerOf(rng, ans, exact, [-exact, Number(n) * CP(g) * (TA - TB), Number(n) * R * (TA - TB)], 3, 'J'),
			params: { case: expansion ? 'espansione' : 'compressione', gas: g.nome, l: g.l, n, TA, TB },
		};
	}
}

// Level 2: the final pressure.
function level2(rng: Rng): Built {
	const expansion = rng.next() < 0.5;
	for (;;) {
		const g = rng.pick(GASES);
		const { VA, VB } = volumes(rng, expansion);
		const pA = h3(rng.int(100, 500));
		const r = Number(VA) / Number(VB);
		const exact = Number(pA) * r ** gamma(g);
		const ans = sig(exact, 3);
		if (!ans || ambiguous(ans)) continue;
		const data = { gamma: gamma(g), VA: Number(VA), pA: Number(pA), VB: Number(VB), unitaV: 'L', unitaP: 'atm' };
		const alt = `Piano pressione-volume: l'adiabatica dallo stato A, a ${lab(VA)} litri e ${lab(pA)} atmosfere, allo stato B, a ${lab(VB)} litri`;
		return {
			prompt: 'Trova la pressione finale.',
			problem: textBlock(`${CYL} un campione di ${g.nome}, un gas ${kind(g)}, occupa ${pq(tex(VA), 'L')} alla pressione di ${pq(tex(pA), 'atm')}. Il gas ${expansion ? 'si espande' : 'viene compresso'} adiabaticamente fino a ${pq(tex(VB), 'L')}. Qual è la pressione finale?`),
			solution: `p_B \\approx ${q(ans.tex, 'atm')}`,
			steps: [
				gammaStep(g),
				`p_B = p_A \\left( \\dfrac{V_A}{V_B} \\right)^{\\gamma} = ${tex(pA)}\\,\\text{atm} \\cdot \\left( \\dfrac{${tex(VA)}}{${tex(VB)}} \\right)^{${gammaTex(g)}} = ${shown(exact)}\\ldots\\,\\text{atm} \\approx ${q(ans.tex, 'atm')}`,
			],
			// Boyle's law; the ratio upside down; the γ of the other kind of gas
			answer: answerOf(rng, ans, exact, [up(Number(pA) * r), Number(pA) * (1 / r) ** gamma(g), Number(pA) * r ** otherGamma(g)], 3, 'atm'),
			params: { case: expansion ? 'espansione' : 'compressione', gas: g.nome, l: g.l, VA, VB, pA },
			scene: pvScene(alt, { ...data, testi: { VA: lab(VA), pA: lab(pA), VB: lab(VB) } }),
			solutionScene: pvScene(`${alt}, dove la pressione è ${ans.tex.replace('{,}', ',')} atmosfere`, { ...data, testi: { VA: lab(VA), pA: lab(pA), VB: lab(VB), pB: ans.tex.replace('{,}', ',') } }),
		};
	}
}

// Level 3: the final temperature, in kelvin.
function level3(rng: Rng): Built {
	const expansion = rng.next() < 0.5;
	for (;;) {
		const g = rng.pick(GASES);
		const { VA, VB } = volumes(rng, expansion);
		const TA = rng.int(250, 450);
		const r = Number(VA) / Number(VB);
		const exact = TA * r ** (gamma(g) - 1);
		const ans = sig(exact, 3);
		if (!ans || ambiguous(ans) || exact >= 999.5) continue;
		return {
			prompt: 'Trova la temperatura finale.',
			problem: textBlock(`${CYL} un campione di ${g.nome}, un gas ${kind(g)}, a ${pq(String(TA), 'K')}, occupa ${pq(tex(VA), 'L')}. Il gas ${expansion ? 'si espande' : 'viene compresso'} adiabaticamente fino a ${pq(tex(VB), 'L')}. Qual è la temperatura finale?`),
			solution: `T_B \\approx ${q(ans.tex, 'K')}`,
			steps: [
				t(`Il gas è ${kind(g)}: `) + `\\gamma - 1 = ${gamma1Tex(g)}`,
				`T_B = T_A \\left( \\dfrac{V_A}{V_B} \\right)^{\\gamma - 1} = ${TA}\\,\\text{K} \\cdot \\left( \\dfrac{${tex(VA)}}{${tex(VB)}} \\right)^{${gamma1Tex(g)}} = ${shown(exact)}\\ldots\\,\\text{K} \\approx ${q(ans.tex, 'K')}`,
			],
			// γ for γ - 1; the ratio upside down; a plain proportion
			answer: answerOf(rng, ans, exact, [TA * r ** gamma(g), TA * (1 / r) ** (gamma(g) - 1), up(TA * r)], 3, 'K'),
			params: { case: expansion ? 'espansione' : 'compressione', gas: g.nome, l: g.l, VA, VB, TA },
		};
	}
}

// Level 4: the final volume from the pressures.
function level4(rng: Rng): Built {
	const expansion = rng.next() < 0.5;
	for (;;) {
		const g = rng.pick(GASES);
		const low = rng.int(10, 20) * 10;
		const high = low * rng.pick([1.5, 2, 2.5, 3, 4, 5]);
		if (high >= 1000 || !Number.isInteger(high)) continue;
		const pA = h3(expansion ? high : low), pB = h3(expansion ? low : high);
		const VA = h3(rng.int(10, 60) * 10);
		const r = Number(pA) / Number(pB);
		const exact = Number(VA) * r ** (1 / gamma(g));
		const ans = sig(exact, 3);
		if (!ans || ambiguous(ans)) continue;
		const inv = g.l === 3 ? '\\tfrac{3}{5}' : '\\tfrac{5}{7}';
		return {
			prompt: 'Trova il volume finale.',
			problem: textBlock(`${CYL} un campione di ${g.nome}, un gas ${kind(g)}, occupa ${pq(tex(VA), 'L')} alla pressione di ${pq(tex(pA), 'atm')}. Il gas ${expansion ? 'si espande adiabaticamente finché la pressione scende' : 'viene compresso adiabaticamente finché la pressione sale'} a ${pq(tex(pB), 'atm')}. Qual è il volume finale?`),
			solution: `V_B \\approx ${q(ans.tex, 'L')}`,
			steps: [
				gammaStep(g),
				`p_A\\,V_A^{\\,\\gamma} = p_B\\,V_B^{\\,\\gamma} \\quad\\Rightarrow\\quad V_B = V_A \\left( \\dfrac{p_A}{p_B} \\right)^{1/\\gamma}`,
				`V_B = ${tex(VA)}\\,\\text{L} \\cdot \\left( \\dfrac{${tex(pA)}}{${tex(pB)}} \\right)^{${inv}} = ${shown(exact)}\\ldots\\,\\text{L} \\approx ${q(ans.tex, 'L')}`,
			],
			// Boyle's law; γ for 1/γ; the ratio upside down
			answer: answerOf(rng, ans, exact, [up(Number(VA) * r), Number(VA) * r ** gamma(g), Number(VA) * (1 / r) ** (1 / gamma(g))], 3, 'L'),
			params: { case: expansion ? 'espansione' : 'compressione', gas: g.nome, l: g.l, VA, pA, pB },
		};
	}
}

// Level 5: a compression with the temperatures in degrees Celsius.
function level5(rng: Rng): Built {
	for (;;) {
		const g = rng.pick(GASES);
		const tA = rng.int(10, 40);
		const r = h3(rng.int(15, 90) * 10);
		const TA = tA + 273;
		const exact = TA * Number(r) ** (gamma(g) - 1);
		const TB = sig(exact, 3);
		if (!TB || exact >= 999.5) continue;
		const tB = Number(TB.value) - 273;
		if (!Number.isInteger(tB) || tB % 10 === 0) continue;
		const int = (x: number) => ({ tex: String(Math.round(x)), value: String(Math.round(x)) });
		// degrees Celsius in the formula; the kelvin not turned back; γ for γ - 1
		const wrong = [tA * Number(r) ** (gamma(g) - 1), Number(TB.value), TA * Number(r) ** gamma(g) - 273].map(int).filter((o) => o.value !== String(tB));
		const fall = [tB + 20, tB - 20, tB + 40].map(int);
		return {
			prompt: 'Trova la temperatura finale in gradi Celsius.',
			problem: textBlock(`${CYL} un campione di ${g.nome}, un gas ${kind(g)}, a ${pq(String(tA), 'C')}, viene compresso adiabaticamente fino a un volume $${tex(r)}$ volte più piccolo. A quale temperatura arriva?`),
			solution: `t_B \\approx ${q(String(tB), 'C')}`,
			steps: [
				`${t('In kelvin: ')} T_A = ${tA} + 273 = ${TA}\\,\\text{K}`,
				t(`Il gas è ${kind(g)}: `) + `\\gamma - 1 = ${gamma1Tex(g)}`,
				`T_B = T_A \\left( \\dfrac{V_A}{V_B} \\right)^{\\gamma - 1} = ${TA}\\,\\text{K} \\cdot ${tex(r)}^{${gamma1Tex(g)}} = ${shown(exact)}\\ldots\\,\\text{K} \\approx ${q(TB.tex, 'K')}`,
				`t_B = ${TB.tex} - 273 = ${q(String(tB), 'C')}`,
			],
			answer: choiceOf(rng, opt(int(tB), 'C'), wrong.map((o) => opt(o, 'C')), fall.map((o) => opt(o, 'C'))),
			params: { case: kind(g), gas: g.nome, l: g.l, tA, r },
		};
	}
}

// Level 6: the work from pressures and volumes.
function level6(rng: Rng): Built {
	const expansion = rng.next() < 0.5;
	for (;;) {
		const g = rng.pick(GASES);
		const { VA, VB } = volumes(rng, expansion);
		const pA = h3(rng.int(100, 500));
		const gm = gamma(g);
		const pBx = Number(pA) * (Number(VA) / Number(VB)) ** gm;
		const pB = sig(pBx, 3);
		if (!pB) continue;
		const work = (p: number) => (100 * (Number(pA) * Number(VA) - p * Number(VB))) / (gm - 1);
		const exact = work(pBx);
		const ans = sigS(exact, 2);
		// the answer must not depend on rounding the final pressure to three figures first
		const via = sigS(work(Number(pB.value)), 2);
		if (!ans || !via || via.value !== ans.value || ambiguous(ans)) continue;
		const pAVA = 100 * Number(pA) * Number(VA), pBVB = 100 * Number(pB.value) * Number(VB);
		const data = { gamma: gm, VA: Number(VA), pA: Number(pA), VB: Number(VB), unitaV: 'L', unitaP: '10⁵ Pa' };
		const alt = `Piano pressione-volume: l'adiabatica dallo stato A, a ${lab(VA)} litri e ${lab(pA)} per 10 alla quinta pascal, allo stato B, a ${lab(VB)} litri`;
		const p5 = (s: string) => `${s} \\cdot 10^{5}`;
		return {
			prompt: 'Trova il lavoro, con il suo segno.',
			problem: textBlock(`${CYL} un campione di ${g.nome}, un gas ${kind(g)}, occupa ${pq(tex(VA), 'L')} alla pressione di ${pq(p5(tex(pA)), 'Pa')}. Il gas ${expansion ? 'si espande' : 'viene compresso'} adiabaticamente fino a ${pq(tex(VB), 'L')}. Quanto lavoro compie il gas?`),
			solution: `W \\approx ${q(ans.tex, 'J')}`,
			steps: [
				gammaStep(g),
				`p_B = p_A \\left( \\dfrac{V_A}{V_B} \\right)^{\\gamma} = ${p5(tex(pA))}\\,\\text{Pa} \\cdot \\left( \\dfrac{${tex(VA)}}{${tex(VB)}} \\right)^{${gammaTex(g)}} \\approx ${q(p5(pB.tex), 'Pa')}`,
				`${t('Con i volumi in metri cubi: ')} p_A V_A = ${shown(pAVA, 4)}\\,\\text{J}, \\quad p_B V_B = ${shown(pBVB, 4)}\\,\\text{J}`,
				`W = \\dfrac{p_A V_A - p_B V_B}{\\gamma - 1} = \\dfrac{${shown(pAVA, 4)} - ${shown(pBVB, 4)}}{${gamma1Tex(g)}}\\,\\text{J} \\approx ${q(ans.tex, 'J')}`,
			],
			// the sign; the division by γ - 1 forgotten; litres not turned into cubic metres
			answer: answerOf(rng, ans, exact, [-exact, exact * (gm - 1), exact * 1000], 2, 'J'),
			params: { case: expansion ? 'espansione' : 'compressione', gas: g.nome, l: g.l, VA, VB, pA },
			scene: pvScene(alt, { ...data, testi: { VA: lab(VA), pA: lab(pA), VB: lab(VB) } }),
			solutionScene: pvScene(`${alt}, dove la pressione è ${pB.tex.replace('{,}', ',')} per 10 alla quinta pascal`, { ...data, testi: { VA: lab(VA), pA: lab(pA), VB: lab(VB), pB: pB.tex.replace('{,}', ',') } }),
		};
	}
}

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const fisTrasformazioneAdiabatica: Generator = {
	id: ID,
	title: 'La trasformazione adiabatica',
	levels: {
		1: { label: 'Il lavoro dalla temperatura', constraints: ['espansione o compressione', 'lavoro con il segno, tre cifre significative'] },
		2: { label: 'La pressione finale', constraints: ['rapporto dei volumi 1,5, 2, 2,5, 3 o 4', 'pressione in atmosfere'] },
		3: { label: 'La temperatura finale', constraints: ['temperature in kelvin', 'sotto i 1000 K'] },
		4: { label: 'Il volume finale', constraints: ['dalle pressioni, formula inversa'] },
		5: { label: 'Temperature in gradi Celsius', constraints: ['compressione', 'risultato in gradi Celsius, intero'] },
		6: { label: 'Il lavoro da pressioni e volumi', constraints: ['due passaggi', 'due cifre significative, con il segno'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisTrasformazioneAdiabatica;
