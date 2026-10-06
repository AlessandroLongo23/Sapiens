/**
 * Frigoriferi e pompe di calore. Spec: specs/exercises/fis-frigoriferi.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/117-fis-frigoriferi.md), each one step harder: the
 * coefficient of performance of a refrigerator from Q_f and W; the same when the work or the heat removed must first
 * be found from Q_c = Q_f + W; the heat pump (its coefficient, or the work from the coefficient); the highest
 * coefficient from the two temperatures, given in degrees Celsius; the work to cool a mass of water; the work to turn
 * it into ice. Results never too close to a rounding boundary. Distractors from the lesson's warnings: the ratio
 * upside down, the other machine's coefficient, temperatures left in degrees Celsius, the coefficient multiplied or
 * forgotten. The drawing is group 43's scene `macchina-termica`, with the data on the arrows and never the answer.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { type Built, C_WATER, LF, ZERO_C, answerOf, checkCommon, dec, decTex, generateWith, lab, noZero, pq, q, raw, sig, t, textBlock } from '../fis-frigo-entropia';

export const ID = 'fis-frigoriferi';

type Flows = { qc?: string; qf?: string; w?: string; tc?: string; tf?: string; nome?: string };

/** The refrigerator between its reservoirs: heat up from the cold one, work in, heat up to the hot one. */
function machine(alt: string, d: Flows): SceneRef {
	const text = (name: string, value?: string) => (value ? `${name} = ${value}` : name);
	const data: Record<string, unknown> = {
		dispositivi: [
			{
				nome: d.nome ?? 'frigorifero',
				freddo: { verso: 'entra', testo: text('Qf', d.qf) },
				caldo: { verso: 'esce', testo: text('Qc', d.qc) },
				lavoro: { verso: 'entra', testo: text('W', d.w) },
			},
		],
	};
	if (d.tc && d.tf) data.sorgenti = { calda: d.tc, fredda: d.tf };
	return { type: 'macchina-termica', data, alt };
}

const WHAT = [
	{ nome: 'frigorifero', un: 'un frigorifero', dove: 'al suo interno' },
	{ nome: 'congelatore', un: 'un congelatore', dove: 'al suo interno' },
	{ nome: 'condizionatore', un: 'un condizionatore', dove: 'a una stanza' },
];
const COP_F = '\\text{COP}_f', COP_P = '\\text{COP}_p';
const cW = `c = ${q(String(C_WATER), 'none')}\\,\\text{J/(kg}\\cdot{}^\\circ\\text{C)}`;
const lF = 'L_f = 3{,}34 \\cdot 10^{5}\\,\\text{J/kg}';

/** Q_f and W in joules, three figures each, with Q_f / W between 1,5 and 6. */
function heatAndWork(rng: Rng, maxSum = Infinity): { Qf: number; W: number } {
	for (;;) {
		const W = noZero(rng, 101, 399);
		const Qf = noZero(rng, 151, 999);
		if (Qf / W < 1.5 || Qf / W > 6 || Qf + W > maxSum || (Qf + W) % 10 === 0) continue;
		return { Qf, W };
	}
}

// ---------------------------------------------------------------------------
// Level 1: COP_f = Q_f / W

function level1(rng: Rng): Built {
	const m = rng.pick(WHAT);
	const { Qf, W } = heatAndWork(rng);
	const exact = Qf / W;
	const ans = sig(exact, 3);
	if (!ans) throw new Error('tie');
	return {
		prompt: 'Trova il coefficiente di prestazione.',
		problem: textBlock(`In un ciclo ${m.un} toglie ${pq(String(Qf), 'J')} di calore ${m.dove}, e il suo motore compie un lavoro di ${pq(String(W), 'J')}. Quanto vale il suo coefficiente di prestazione?`),
		solution: `${COP_F} \\approx ${ans.tex}`,
		steps: [t('Il coefficiente di prestazione è il calore tolto alla sorgente fredda diviso per il lavoro:'), `${COP_F} = \\dfrac{Q_f}{W} = \\dfrac{${q(String(Qf), 'J')}}{${q(String(W), 'J')}} = ${raw(exact)}\\ldots \\approx ${ans.tex}`],
		// the ratio upside down; the heat pump's coefficient; the heat removed over the heat given out
		answer: answerOf(rng, ans, [sig(W / Qf, 3), sig((Qf + W) / W, 3), sig(Qf / (Qf + W), 3)], 'none', [sig(exact * 1.5, 3), sig(exact * 0.75, 3)]),
		params: { case: m.nome, Qf, W },
		scene: machine(`Lo schema di ${m.un}: assorbe ${Qf} joule dalla sorgente fredda, riceve ${W} joule di lavoro e cede calore alla sorgente calda.`, { nome: m.nome === 'frigorifero' ? 'frigorifero' : 'macchina', qf: `${Qf} J`, w: `${W} J` }),
	};
}

// ---------------------------------------------------------------------------
// Level 2: the work or the heat removed from Q_c = Q_f + W

function level2(rng: Rng): Built {
	const fromHeats = rng.next() < 0.5;
	const { Qf, W } = heatAndWork(rng, 999);
	const Qc = Qf + W;
	const exact = Qf / W;
	const ans = sig(exact, 3);
	if (!ans) throw new Error('tie');
	if (fromHeats)
		return {
			prompt: 'Trova il coefficiente di prestazione.',
			problem: textBlock(`In un ciclo un frigorifero toglie ${pq(String(Qf), 'J')} di calore al suo interno e ne cede ${pq(String(Qc), 'J')} alla cucina. Quanto vale il suo coefficiente di prestazione?`),
			solution: `${COP_F} \\approx ${ans.tex}`,
			steps: [
				`${t('Il lavoro è la differenza tra i due calori: ')} W = Q_c - Q_f = ${q(String(Qc), 'J')} - ${q(String(Qf), 'J')} = ${q(String(W), 'J')}`,
				`${COP_F} = \\dfrac{Q_f}{W} = \\dfrac{${q(String(Qf), 'J')}}{${q(String(W), 'J')}} = ${raw(exact)}\\ldots \\approx ${ans.tex}`,
			],
			// Q_f over Q_c; the heat pump's coefficient; the ratio upside down
			answer: answerOf(rng, ans, [sig(Qf / Qc, 3), sig(Qc / W, 3), sig(W / Qf, 3)], 'none', [sig(exact * 1.5, 3), sig(exact * 0.75, 3)]),
			params: { case: 'calori', Qf, Qc },
			scene: machine(`Lo schema di un frigorifero: assorbe ${Qf} joule dalla sorgente fredda e ne cede ${Qc} alla sorgente calda; il lavoro non è dato.`, { qf: `${Qf} J`, qc: `${Qc} J` }),
		};
	return {
		prompt: 'Trova il coefficiente di prestazione.',
		problem: textBlock(`In un ciclo il motore di un frigorifero compie un lavoro di ${pq(String(W), 'J')}, e il frigorifero cede ${pq(String(Qc), 'J')} di calore alla cucina. Quanto vale il suo coefficiente di prestazione?`),
		solution: `${COP_F} \\approx ${ans.tex}`,
		steps: [
			`${t('Il calore tolto all’interno è la differenza: ')} Q_f = Q_c - W = ${q(String(Qc), 'J')} - ${q(String(W), 'J')} = ${q(String(Qf), 'J')}`,
			`${COP_F} = \\dfrac{Q_f}{W} = \\dfrac{${q(String(Qf), 'J')}}{${q(String(W), 'J')}} = ${raw(exact)}\\ldots \\approx ${ans.tex}`,
		],
		// Q_c over W, without the subtraction; the ratio upside down; Q_f over Q_c
		answer: answerOf(rng, ans, [sig(Qc / W, 3), sig(W / Qf, 3), sig(Qf / Qc, 3)], 'none', [sig(exact * 1.5, 3), sig(exact * 0.75, 3)]),
		params: { case: 'lavoro', W, Qc },
		scene: machine(`Lo schema di un frigorifero: riceve ${W} joule di lavoro e cede ${Qc} joule alla sorgente calda; il calore assorbito non è dato.`, { w: `${W} J`, qc: `${Qc} J` }),
	};
}

// ---------------------------------------------------------------------------
// Level 3: the heat pump

function level3(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const { Qf, W } = heatAndWork(rng);
		const exact = (Qf + W) / W;
		const ans = sig(exact, 3);
		if (!ans) throw new Error('tie');
		return {
			prompt: 'Trova il coefficiente di prestazione della pompa di calore.',
			problem: textBlock(`In un ciclo una pompa di calore prende ${pq(String(Qf), 'J')} di calore dall'aria esterna, e il suo compressore compie un lavoro di ${pq(String(W), 'J')}. Quanto vale il suo coefficiente di prestazione?`),
			solution: `${COP_P} \\approx ${ans.tex}`,
			steps: [
				`${t('Il calore ceduto alla casa è la somma: ')} Q_c = Q_f + W = ${q(String(Qf), 'J')} + ${q(String(W), 'J')} = ${q(String(Qf + W), 'J')}`,
				`${COP_P} = \\dfrac{Q_c}{W} = \\dfrac{${q(String(Qf + W), 'J')}}{${q(String(W), 'J')}} = ${raw(exact)}\\ldots \\approx ${ans.tex}`,
			],
			// the refrigerator's coefficient; the ratio upside down; Q_c over Q_f
			answer: answerOf(rng, ans, [sig(Qf / W, 3), sig(W / (Qf + W), 3), sig((Qf + W) / Qf, 3)], 'none', [sig(exact * 1.5, 3), sig(exact * 0.75, 3)]),
			params: { case: 'coefficiente', Qf, W },
			scene: machine(`Lo schema di una pompa di calore: assorbe ${Qf} joule dalla sorgente fredda, riceve ${W} joule di lavoro e cede calore alla sorgente calda.`, { nome: 'pompa', qf: `${Qf} J`, w: `${W} J` }),
		};
	}
	const cop = dec(noZero(rng, 21, 59), 1);
	const mant = dec(noZero(rng, 11, 99), 1);
	const e = rng.pick([6, 7]);
	const Qc = Number(mant) * 10 ** e;
	const c = Number(cop);
	const exact = Qc / c;
	const ans = sig(exact, 2);
	if (!ans) throw new Error('tie');
	const QcT = `${decTex(mant)} \\cdot 10^{${e}}`;
	return {
		prompt: 'Trova il lavoro del compressore.',
		problem: textBlock(`Una pompa di calore con coefficiente di prestazione $${decTex(cop)}$ deve cedere a una casa $${QcT}\\,\\text{J}$ di calore. Quanto lavoro deve compiere il suo compressore?`),
		solution: `W \\approx ${q(ans.tex, 'J')}`,
		steps: [t('Dalla definizione del coefficiente di prestazione di una pompa di calore si ricava il lavoro:'), `W = \\dfrac{Q_c}{${COP_P}} = \\dfrac{${QcT}\\,\\text{J}}{${decTex(cop)}} = ${raw(exact)}\\ldots\\,\\text{J} \\approx ${q(ans.tex, 'J')}`],
		// the coefficient multiplied; divided by the refrigerator's coefficient; the heat taken from outside
		answer: answerOf(rng, ans, [sig(Qc * c, 2), sig(Qc / (c - 1), 2), sig(Qc - Qc / c, 2)], 'J', [sig(exact * 1.5, 2), sig(exact * 0.5, 2)]),
		params: { case: 'lavoro', cop, Qc: `${mant}e${e}` },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the highest coefficient, temperatures in degrees Celsius

function level4(rng: Rng): Built {
	const fridge = rng.next() < 0.5;
	const tf = fridge ? rng.int(-25, 8) : rng.int(-15, 8);
	const tc = fridge ? rng.int(18, 38) : rng.int(18, 24);
	if (tf === 0 || tc - tf < 10) throw new Error('range');
	const Tf = tf + ZERO_C, Tc = tc + ZERO_C, d = Tc - Tf;
	const exact = fridge ? Tf / d : Tc / d;
	const ans = sig(exact, 2);
	if (!ans) throw new Error('tie');
	const name = fridge ? `${COP_F.slice(0, -1)}{f,max}` : `${COP_P.slice(0, -1)}{p,max}`;
	const kelvin = `T_f = (${tf} + 273)\\,\\text{K} = ${q(String(Tf), 'K')}, \\quad T_c = (${tc} + 273)\\,\\text{K} = ${q(String(Tc), 'K')}`;
	const scene = machine(`Lo schema di ${fridge ? 'un frigorifero' : 'una pompa di calore'} tra una sorgente fredda a ${tf} gradi Celsius e una sorgente calda a ${tc} gradi Celsius.`, {
		nome: fridge ? 'frigorifero' : 'pompa',
		tc: `${lab(tc)} °C`,
		tf: `${lab(tf)} °C`,
	});
	if (fridge)
		return {
			prompt: 'Trova il coefficiente di prestazione massimo.',
			problem: textBlock(`Un frigorifero tiene l'interno a ${pq(String(tf), 'C')} in una stanza a ${pq(String(tc), 'C')}. Qual è il massimo coefficiente di prestazione che può avere?`),
			solution: `${name} \\approx ${ans.tex}`,
			steps: [`${t('Le temperature in kelvin: ')} ${kelvin}`, `${name} = \\dfrac{T_f}{T_c - T_f} = \\dfrac{${Tf}}{${Tc} - ${Tf}} = \\dfrac{${Tf}}{${d}} = ${raw(exact)}\\ldots \\approx ${ans.tex}`],
			// degrees Celsius; the heat pump's maximum; the ratio upside down; Carnot's efficiency
			answer: answerOf(rng, ans, [sig(tf / (tc - tf), 2), sig(Tc / d, 2), sig(d / Tf, 2), sig(1 - Tf / Tc, 2)], 'none', [sig(exact * 1.5, 2), sig(exact * 0.5, 2)]),
			params: { case: 'frigorifero', tf, tc },
			scene,
		};
	return {
		prompt: 'Trova il coefficiente di prestazione massimo.',
		problem: textBlock(`Una pompa di calore tiene una casa a ${pq(String(tc), 'C')} quando fuori ci sono ${pq(String(tf), 'C')}. Qual è il massimo coefficiente di prestazione che può avere?`),
		solution: `${name} \\approx ${ans.tex}`,
		steps: [`${t('Le temperature in kelvin: ')} ${kelvin}`, `${name} = \\dfrac{T_c}{T_c - T_f} = \\dfrac{${Tc}}{${Tc} - ${Tf}} = \\dfrac{${Tc}}{${d}} = ${raw(exact)}\\ldots \\approx ${ans.tex}`],
		// degrees Celsius; the refrigerator's maximum; the ratio upside down; Carnot's efficiency
		answer: answerOf(rng, ans, [sig(tc / (tc - tf), 2), sig(Tf / d, 2), sig(d / Tc, 2), sig(1 - Tf / Tc, 2)], 'none', [sig(exact * 1.5, 2), sig(exact * 0.5, 2)]),
		params: { case: 'pompa', tf, tc },
		scene,
	};
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: the work to cool water, and to freeze it

const mass = (rng: Rng) => (rng.next() < 0.5 ? dec(noZero(rng, 11, 99), 2) : dec(noZero(rng, 11, 49), 1));
const coeff = (rng: Rng) => dec(noZero(rng, 21, 49), 1);

function level5(rng: Rng): Built {
	const m = mass(rng), cop = coeff(rng);
	const t1 = rng.int(18, 35), t2 = rng.int(2, 8);
	const mn = Number(m), c = Number(cop);
	const Q = C_WATER * mn * (t1 - t2);
	const exact = Q / c;
	const ans = sig(exact, 2);
	if (!ans) throw new Error('tie');
	return {
		prompt: 'Trova il lavoro del motore.',
		problem: textBlock(`Un frigorifero con coefficiente di prestazione $${decTex(cop)}$ raffredda ${pq(decTex(m), 'kg')} di acqua da ${pq(String(t1), 'C')} a ${pq(String(t2), 'C')}. Quanto lavoro compie il suo motore? Per l'acqua $${cW}$.`),
		solution: `W \\approx ${q(ans.tex, 'J')}`,
		steps: [
			`${t('Il calore da togliere all’acqua: ')} Q_f = c\\,m\\,\\Delta t = ${C_WATER} \\cdot ${decTex(m)} \\cdot (${t1} - ${t2})\\,\\text{J} = ${raw(Q)}\\,\\text{J}`,
			`W = \\dfrac{Q_f}{${COP_F}} = \\dfrac{${raw(Q)}\\,\\text{J}}{${decTex(cop)}} = ${raw(exact)}\\ldots\\,\\text{J} \\approx ${q(ans.tex, 'J')}`,
		],
		// the coefficient multiplied; the coefficient forgotten; the starting temperature for the difference; the heat pump's coefficient
		answer: answerOf(rng, ans, [sig(Q * c, 2), sig(Q, 2), sig((C_WATER * mn * t1) / c, 2), sig(Q / (c + 1), 2)], 'J', [sig(exact * 1.5, 2), sig(exact * 0.5, 2)]),
		params: { m, cop, t1, t2 },
	};
}

function level6(rng: Rng): Built {
	const m = mass(rng), cop = coeff(rng);
	const t1 = rng.int(10, 30);
	const mn = Number(m), c = Number(cop);
	const Q1 = C_WATER * mn * t1, Q2 = LF * mn;
	const exact = (Q1 + Q2) / c;
	const ans = sig(exact, 2);
	if (!ans) throw new Error('tie');
	return {
		prompt: 'Trova il lavoro del motore.',
		problem: textBlock(`Un congelatore con coefficiente di prestazione $${decTex(cop)}$ trasforma ${pq(decTex(m), 'kg')} di acqua a ${pq(String(t1), 'C')} in ghiaccio a ${pq('0', 'C')}. Quanto lavoro compie il suo motore? Per l'acqua $${cW}$ e $${lF}$.`),
		solution: `W \\approx ${q(ans.tex, 'J')}`,
		steps: [
			`${t('Per raffreddare l’acqua fino a 0 gradi: ')} Q_1 = c\\,m\\,\\Delta t = ${C_WATER} \\cdot ${decTex(m)} \\cdot ${t1}\\,\\text{J} = ${raw(Q1)}\\,\\text{J}`,
			`${t('Per farla solidificare: ')} Q_2 = L_f\\,m = 3{,}34 \\cdot 10^{5} \\cdot ${decTex(m)}\\,\\text{J} = ${raw(Q2)}\\,\\text{J}`,
			`Q_f = Q_1 + Q_2 = ${raw(Q1 + Q2)}\\,\\text{J}`,
			`W = \\dfrac{Q_f}{${COP_F}} = \\dfrac{${raw(Q1 + Q2)}\\,\\text{J}}{${decTex(cop)}} = ${raw(exact)}\\ldots\\,\\text{J} \\approx ${q(ans.tex, 'J')}`,
		],
		// only the freezing; only the cooling; the coefficient forgotten; the coefficient multiplied
		answer: answerOf(rng, ans, [sig(Q2 / c, 2), sig(Q1 / c, 2), sig(Q1 + Q2, 2), sig((Q1 + Q2) * c, 2)], 'J', [sig(exact * 1.5, 2), sig(exact * 0.5, 2)]),
		params: { m, cop, t1 },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	const needsScene = sample.level <= 2 || sample.level === 4 || (sample.level === 3 && sample.params.case === 'coefficiente');
	if (needsScene && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisFrigoriferi: Generator = {
	id: ID,
	title: 'Frigoriferi e pompe di calore',
	levels: {
		1: { label: 'Il coefficiente di un frigorifero', constraints: ['dati il calore tolto e il lavoro'] },
		2: { label: 'Dal calore ceduto', constraints: ['il lavoro o il calore tolto si trovano dal bilancio Q_c = Q_f + W'] },
		3: { label: 'La pompa di calore', constraints: ['il coefficiente della pompa di calore, o il lavoro dal coefficiente'] },
		4: { label: 'Il coefficiente massimo', constraints: ['temperature in gradi Celsius da convertire in kelvin'] },
		5: { label: 'Il lavoro per raffreddare', constraints: ['il calore da togliere si calcola con il calore specifico'] },
		6: { label: 'Fare il ghiaccio', constraints: ['raffreddamento e solidificazione'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisFrigoriferi;
