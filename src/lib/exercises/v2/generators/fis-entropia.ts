/**
 * L'entropia. Spec: specs/exercises/fis-entropia.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/118-fis-entropia.md), each one step harder: the entropy
 * change of a reservoir that takes or gives heat, ΔS = Q/T with its sign; a change of state of water, where the heat
 * is L m and the temperature must be put in kelvin; a perfect gas at constant temperature, n R ln(V_B/V_A); a mass of
 * water that warms up or cools down, m c ln(T_B/T_A); the universe when heat goes from a hot reservoir to a cold one;
 * the universe in one cycle of a real heat engine. Entropy changes always carry their sign, a plus included.
 * Distractors from the lesson's warnings: the sign, degrees Celsius, the decimal logarithm, the mass or the moles
 * forgotten, the work forgotten.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { type Built, C_WATER, LF, LV, R_GAS, ZERO_C, answerOf, checkCommon, dec, decTex, fixed, generateWith, noZero, pq, q, raw, sig, t, textBlock } from '../fis-frigo-entropia';

export const ID = 'fis-entropia';

const cW = `c = ${C_WATER}\\,\\text{J/(kg}\\cdot{}^\\circ\\text{C)}`;
const lF = 'L_f = 3{,}34 \\cdot 10^{5}\\,\\text{J/kg}';
const lV = 'L_v = 2{,}26 \\cdot 10^{6}\\,\\text{J/kg}';
const rGas = 'R = 8{,}31\\,\\text{J/(mol}\\cdot\\text{K)}';
/** A signed intermediate value for the steps. */
const sraw = (x: number) => (x > 0 ? `+${raw(x)}` : raw(x));

// ---------------------------------------------------------------------------
// Level 1: a reservoir, ΔS = ±Q/T

function level1(rng: Rng): Built {
	const takes = rng.next() < 0.5;
	const T = noZero(rng, 251, 599), Q = noZero(rng, 205, 995);
	const s = takes ? 1 : -1;
	const exact = (s * Q) / T;
	const ans = sig(exact, 3, true);
	if (!ans) throw new Error('tie');
	return {
		prompt: 'Trova la variazione di entropia.',
		problem: textBlock(`Una sorgente a ${pq(String(T), 'K')} ${takes ? 'assorbe' : 'cede'} ${pq(String(Q), 'J')} di calore. Di quanto varia la sua entropia?`),
		solution: `\\Delta S \\approx ${q(ans.tex, 'JK')}`,
		steps: [
			t(takes ? 'La sorgente assorbe calore: Q è positivo e la sua entropia aumenta.' : 'La sorgente cede calore: Q è negativo e la sua entropia diminuisce.'),
			`\\Delta S = \\dfrac{Q}{T} = \\dfrac{${takes ? '' : '-'}${q(String(Q), 'J')}}{${q(String(T), 'K')}} = ${sraw(exact)}\\ldots\\,\\text{J/K} \\approx ${q(ans.tex, 'JK')}`,
		],
		// the sign; the ratio upside down; 273 added to a temperature already in kelvin
		answer: answerOf(rng, ans, [sig(-exact, 3, true), sig((s * T) / Q, 3, true), sig((s * Q) / (T + ZERO_C), 3, true)], 'JK', [sig(exact * 2, 3, true), sig(exact / 2, 3, true)]),
		params: { case: takes ? 'assorbe' : 'cede', T, Q },
	};
}

// ---------------------------------------------------------------------------
// Level 2: a change of state of water

type Change = { case: string; L: number; T: number; other: number; sign: 1 | -1; text: (m: string) => string; data: string; step: string };
const CHANGES: Change[] = [
	{ case: 'fusione', L: LF, T: 273, other: 373, sign: 1, text: (m) => `Un blocco di ghiaccio di ${m}, a ${pq('0', 'C')}, fonde completamente. Di quanto varia la sua entropia?`, data: lF, step: 'Il ghiaccio assorbe il calore latente di fusione: Q è positivo.' },
	{ case: 'solidificazione', L: LF, T: 273, other: 373, sign: -1, text: (m) => `${m} di acqua a ${pq('0', 'C')} diventano ghiaccio alla stessa temperatura. Di quanto varia l'entropia dell'acqua?`, data: lF, step: 'L’acqua cede il calore latente di fusione: Q è negativo.' },
	{ case: 'vaporizzazione', L: LV, T: 373, other: 100, sign: 1, text: (m) => `${m} di acqua a ${pq('100', 'C')} diventano vapore alla stessa temperatura. Di quanto varia l'entropia dell'acqua?`, data: lV, step: 'L’acqua assorbe il calore latente di vaporizzazione: Q è positivo.' },
	{ case: 'condensazione', L: LV, T: 373, other: 100, sign: -1, text: (m) => `${m} di vapore a ${pq('100', 'C')} condensano in acqua alla stessa temperatura. Di quanto varia l'entropia del vapore?`, data: lV, step: 'Il vapore cede il calore latente di vaporizzazione: Q è negativo.' },
];

function level2(rng: Rng): Built {
	const ch = rng.pick(CHANGES);
	const m = dec(noZero(rng, 105, 995), 3);
	const mn = Number(m);
	const Q = ch.sign * ch.L * mn;
	const exact = Q / ch.T;
	const ans = sig(exact, 3, true);
	if (!ans) throw new Error('tie');
	const latent = ch.L === LF ? '3{,}34 \\cdot 10^{5}' : '2{,}26 \\cdot 10^{6}';
	const name = ch.L === LF ? 'L_f' : 'L_v';
	return {
		prompt: 'Trova la variazione di entropia.',
		problem: textBlock(`${ch.text(pq(decTex(m), 'kg'))} Per l'acqua $${ch.data}$.`),
		solution: `\\Delta S \\approx ${q(ans.tex, 'JK')}`,
		steps: [
			t(ch.step),
			`Q = ${ch.sign < 0 ? '-' : ''}${name}\\,m = ${ch.sign < 0 ? '-' : ''}${latent} \\cdot ${decTex(m)}\\,\\text{J} = ${raw(Q)}\\,\\text{J}`,
			`${t('La temperatura in kelvin: ')} T = (${ch.T - ZERO_C} + 273)\\,\\text{K} = ${q(String(ch.T), 'K')}`,
			`\\Delta S = \\dfrac{Q}{T} = \\dfrac{${raw(Q)}\\,\\text{J}}{${q(String(ch.T), 'K')}} = ${sraw(exact)}\\ldots\\,\\text{J/K} \\approx ${q(ans.tex, 'JK')}`,
		],
		// the sign; the mass forgotten; the wrong temperature (the other fixed point, or degrees Celsius)
		answer: answerOf(rng, ans, [sig(-exact, 3, true), sig((ch.sign * ch.L) / ch.T, 3, true), sig(Q / ch.other, 3, true)], 'JK', [sig(exact * 2, 3, true), sig(exact / 2, 3, true)]),
		params: { case: ch.case, m },
	};
}

// ---------------------------------------------------------------------------
// Level 3: a perfect gas at constant temperature

function level3(rng: Rng): Built {
	const grows = rng.next() < 0.5;
	const n = dec(noZero(rng, 105, 495), 2);
	const a = noZero(rng, 105, 995), b = noZero(rng, 105, 995);
	const lo = Math.min(a, b), hi = Math.max(a, b);
	if (hi / lo < 1.2 || hi / lo > 6) throw new Error('ratio');
	const VA = dec(grows ? lo : hi, 1), VB = dec(grows ? hi : lo, 1);
	const nn = Number(n), ratio = Number(VB) / Number(VA);
	const exact = nn * R_GAS * Math.log(ratio);
	const ans = sig(exact, 3, true);
	if (!ans) throw new Error('tie');
	return {
		prompt: 'Trova la variazione di entropia del gas.',
		problem: textBlock(
			`${pq(decTex(n), 'mol')} di gas perfetto ${grows ? 'si espandono' : 'vengono compresse'} a temperatura costante da ${pq(decTex(VA), 'L')} a ${pq(decTex(VB), 'L')}. Di quanto varia l'entropia del gas? Usa $${rGas}$.`,
		),
		solution: `\\Delta S \\approx ${q(ans.tex, 'JK')}`,
		steps: [
			`${t('Il rapporto tra i volumi: ')} \\dfrac{V_B}{V_A} = \\dfrac{${decTex(VB)}}{${decTex(VA)}} = ${raw(ratio)}\\ldots`,
			`\\Delta S = n\\,R \\ln\\dfrac{V_B}{V_A} = ${decTex(n)} \\cdot 8{,}31 \\cdot \\ln(${raw(ratio)}\\ldots)\\,\\text{J/K} = ${sraw(exact)}\\ldots\\,\\text{J/K} \\approx ${q(ans.tex, 'JK')}`,
			t(grows ? 'Il gas si espande: il logaritmo è positivo e l’entropia aumenta.' : 'Il gas viene compresso: il logaritmo è negativo e l’entropia diminuisce.'),
		],
		// the volumes swapped (the sign); the moles forgotten; the decimal logarithm
		answer: answerOf(rng, ans, [sig(-exact, 3, true), sig(R_GAS * Math.log(ratio), 3, true), sig(nn * R_GAS * Math.log10(ratio), 3, true)], 'JK', [sig(exact * 2, 3, true), sig(exact / 2, 3, true)]),
		params: { case: grows ? 'espansione' : 'compressione', n, VA, VB },
	};
}

// ---------------------------------------------------------------------------
// Level 4: water that warms up or cools down

function level4(rng: Rng): Built {
	const warms = rng.next() < 0.5;
	const m = dec(noZero(rng, 105, 995), 3);
	const a = rng.int(5, 95), b = rng.int(5, 95);
	if (Math.abs(a - b) < 15) throw new Error('close');
	const tA = warms ? Math.min(a, b) : Math.max(a, b), tB = warms ? Math.max(a, b) : Math.min(a, b);
	const TA = tA + ZERO_C, TB = tB + ZERO_C;
	const mn = Number(m);
	const exact = mn * C_WATER * Math.log(TB / TA);
	const ans = sig(exact, 3, true);
	if (!ans) throw new Error('tie');
	return {
		prompt: "Trova la variazione di entropia dell'acqua.",
		problem: textBlock(`${pq(decTex(m), 'kg')} di acqua ${warms ? 'vengono scaldati' : 'si raffreddano'} da ${pq(String(tA), 'C')} a ${pq(String(tB), 'C')}. Di quanto varia l'entropia dell'acqua? Per l'acqua $${cW}$.`),
		solution: `\\Delta S \\approx ${q(ans.tex, 'JK')}`,
		steps: [
			`${t('Le temperature in kelvin: ')} T_A = (${tA} + 273)\\,\\text{K} = ${q(String(TA), 'K')}, \\quad T_B = (${tB} + 273)\\,\\text{K} = ${q(String(TB), 'K')}`,
			`\\Delta S = m\\,c \\ln\\dfrac{T_B}{T_A} = ${decTex(m)} \\cdot ${C_WATER} \\cdot \\ln\\dfrac{${TB}}{${TA}}\\,\\text{J/K} = ${sraw(exact)}\\ldots\\,\\text{J/K} \\approx ${q(ans.tex, 'JK')}`,
		],
		// degrees Celsius in the logarithm; the sign; the decimal logarithm
		answer: answerOf(rng, ans, [sig(mn * C_WATER * Math.log(tB / tA), 3, true), sig(-exact, 3, true), sig(mn * C_WATER * Math.log10(TB / TA), 3, true)], 'JK', [sig(exact * 2, 3, true), sig(exact / 2, 3, true)]),
		params: { case: warms ? 'scalda' : 'raffredda', m, tA, tB },
	};
}

// ---------------------------------------------------------------------------
// Level 5: heat from a hot reservoir to a cold one

function level5(rng: Rng): Built {
	const Tc = noZero(rng, 351, 599);
	const Tf = noZero(rng, 251, Tc - 30);
	const Q = noZero(rng, 605, 2495);
	const sf = Q / Tf, sc = Q / Tc;
	if (sf >= 10 || sc < 1) throw new Error('range');
	const exact = sf - sc;
	const ans = fixed(exact, 2, true);
	if (!ans || exact < 0.1) throw new Error('small');
	const scene: SceneRef = { type: 'sorgenti-calore', data: { tc: `${Tc} K`, tf: `${Tf} K`, q: `${Q} J` }, alt: `Due sorgenti collegate da una sbarra: la calda a ${Tc} kelvin, la fredda a ${Tf} kelvin; ${Q} joule di calore passano dalla calda alla fredda.` };
	return {
		prompt: "Trova la variazione di entropia dell'universo.",
		problem: textBlock(`${pq(String(Q), 'J')} di calore passano da una sorgente a ${pq(String(Tc), 'K')} a una sorgente a ${pq(String(Tf), 'K')}. Di quanto varia l'entropia dell'universo?`),
		solution: `\\Delta S_{univ} \\approx ${q(ans.tex, 'JK')}`,
		steps: [
			`${t('La sorgente calda cede calore: ')} \\Delta S_c = -\\dfrac{Q}{T_c} = -\\dfrac{${q(String(Q), 'J')}}{${q(String(Tc), 'K')}} = ${raw(-sc)}\\ldots\\,\\text{J/K}`,
			`${t('La sorgente fredda lo assorbe: ')} \\Delta S_f = +\\dfrac{Q}{T_f} = +\\dfrac{${q(String(Q), 'J')}}{${q(String(Tf), 'K')}} = +${raw(sf)}\\ldots\\,\\text{J/K}`,
			`\\Delta S_{univ} = \\Delta S_c + \\Delta S_f = ${sraw(exact)}\\ldots\\,\\text{J/K} \\approx ${q(ans.tex, 'JK')}`,
		],
		// the signs swapped; the heat over the difference of the temperatures; the two terms added; the cold reservoir alone
		answer: answerOf(rng, ans, [fixed(-exact, 2, true), fixed(Q / (Tc - Tf), 2, true), fixed(sf + sc, 2, true), fixed(sf, 2, true)], 'JK', [fixed(exact * 2, 2, true), fixed(exact / 2, 2, true)]),
		params: { Q, Tc, Tf },
		scene,
	};
}

// ---------------------------------------------------------------------------
// Level 6: one cycle of a real heat engine

function level6(rng: Rng): Built {
	const Tc = noZero(rng, 401, 699), Tf = noZero(rng, 271, 349);
	const Qc = noZero(rng, 1005, 4995);
	const share = rng.int(40, 85) / 100;
	const W = Math.round(Qc * share * (1 - Tf / Tc));
	const Qf = Qc - W;
	const sf = Qf / Tf, sc = Qc / Tc;
	if (W % 10 === 0 || W < 105 || sf >= 10 || sc < 1) throw new Error('range');
	const exact = sf - sc;
	const ans = fixed(exact, 2, true);
	if (!ans || exact < 0.1) throw new Error('small');
	const scene: SceneRef = {
		type: 'macchina-termica',
		data: {
			sorgenti: { calda: `${Tc} K`, fredda: `${Tf} K` },
			dispositivi: [{ nome: 'macchina', caldo: { verso: 'entra', testo: `Qc = ${Qc} J` }, freddo: { verso: 'esce', testo: 'Qf' }, lavoro: { verso: 'esce', testo: `W = ${W} J` } }],
		},
		alt: `Lo schema di una macchina termica tra una sorgente a ${Tc} kelvin e una a ${Tf} kelvin: assorbe ${Qc} joule dalla calda, compie ${W} joule di lavoro e cede calore alla fredda.`,
	};
	return {
		prompt: "Trova la variazione di entropia dell'universo.",
		problem: textBlock(
			`Una macchina termica lavora tra una sorgente a ${pq(String(Tc), 'K')} e una a ${pq(String(Tf), 'K')}. In ogni ciclo assorbe ${pq(String(Qc), 'J')} dalla sorgente calda e compie un lavoro di ${pq(String(W), 'J')}. Di quanto varia l'entropia dell'universo in un ciclo?`,
		),
		solution: `\\Delta S_{univ} \\approx ${q(ans.tex, 'JK')}`,
		steps: [
			`${t('Il calore ceduto alla sorgente fredda: ')} Q_f = Q_c - W = ${q(String(Qc), 'J')} - ${q(String(W), 'J')} = ${q(String(Qf), 'J')}`,
			t('In un ciclo l’entropia del fluido della macchina non cambia: cambiano quelle delle due sorgenti.'),
			`\\Delta S_{univ} = \\dfrac{Q_f}{T_f} - \\dfrac{Q_c}{T_c} = \\dfrac{${q(String(Qf), 'J')}}{${q(String(Tf), 'K')}} - \\dfrac{${q(String(Qc), 'J')}}{${q(String(Tc), 'K')}} = ${raw(sf)}\\ldots\\,\\text{J/K} - ${raw(sc)}\\ldots\\,\\text{J/K} \\approx ${q(ans.tex, 'JK')}`,
		],
		// the work forgotten (Q_c for Q_f); the signs swapped; the temperatures swapped; the work over T_f
		answer: answerOf(rng, ans, [fixed(Qc / Tf - sc, 2, true), fixed(-exact, 2, true), fixed(Qf / Tc - Qc / Tf, 2, true), fixed(W / Tf, 2, true)], 'JK', [fixed(exact * 2, 2, true), fixed(exact / 2, 2, true)]),
		params: { Tc, Tf, Qc, W },
		scene,
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level >= 5 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisEntropia: Generator = {
	id: ID,
	title: "L'entropia",
	levels: {
		1: { label: 'Una sorgente che scambia calore', constraints: ['temperatura in kelvin, segno dal verso del calore'] },
		2: { label: "L'entropia in un passaggio di stato", constraints: ['calore latente e temperatura da portare in kelvin'] },
		3: { label: 'Un gas a temperatura costante', constraints: ['logaritmo naturale del rapporto tra i volumi'] },
		4: { label: 'Un corpo che si scalda o si raffredda', constraints: ['logaritmo naturale del rapporto tra le temperature in kelvin'] },
		5: { label: "L'entropia dell'universo", constraints: ['due sorgenti, somma con i segni'] },
		6: { label: 'Una macchina reale', constraints: ['il calore ceduto si trova dal lavoro'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisEntropia;
