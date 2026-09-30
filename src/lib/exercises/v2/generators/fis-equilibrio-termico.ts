/**
 * L'equilibrio termico e il calorimetro. Spec: specs/exercises/fis-equilibrio-termico.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/68-fis-equilibrio-termico.md), each one step harder: the
 * heat exchanged in a calorimeter (Q = c m Δt, what one body gives the other takes); the temperature of two masses of
 * water mixed; the temperature of a metal dropped in water; a missing mass or starting temperature; the specific heat
 * of a sample measured with the calorimeter; the water equivalent of the calorimeter, found or used. Numbers are built
 * backwards, results rounded to the significant figures of the data and never too close to a rounding boundary.
 * Distractors from the lesson's warnings: the plain average of the temperatures, the two temperature differences
 * confused, the water equivalent forgotten or added to the wrong body, the capacities swapped.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, C_WATER, answerOf, checkCommon, dec, generateWith, mass2, pq, q, sig, t, tex, textBlock } from '../fis-calore';

export const ID = 'fis-equilibrio-termico';

const METALS = [
	{ nome: 'ferro', c: 449 },
	{ nome: 'alluminio', c: 897 },
	{ nome: 'rame', c: 385 },
	{ nome: 'piombo', c: 129 },
	{ nome: 'argento', c: 233 },
];
const CW = `${C_WATER}`;
const CW_TEXT = `Il calore specifico dell'acqua è ${pq(CW, 'cJ')}.`;
/** A temperature written with one decimal, from a whole number of degrees: 18 → "18.0". */
const d1 = (x: number) => x.toFixed(1);
const deg = (s: string) => pq(tex(s), 'C');

// ---------------------------------------------------------------------------
// Level 1: the heat exchanged

function level1(rng: Rng): Built {
	const water = rng.next() < 0.5;
	for (;;) {
		if (water) {
			const m = mass2(rng);
			const ti = rng.int(10, 25);
			const tf = ti + rng.int(3, 30);
			const exact = (C_WATER * Number(m) * (tf - ti)) / 1000;
			const ans = sig(exact, 2);
			if (!ans || exact < 1 || exact >= 100) continue;
			return {
				prompt: 'Trova il calore scambiato.',
				problem: textBlock(`Un pezzo di metallo caldo viene immerso in ${pq(tex(m), 'kg')} d'acqua, in un calorimetro isolato. L'acqua si scalda da ${deg(String(ti))} a ${deg(String(tf))}. Quanto calore ha ceduto il metallo? ${CW_TEXT}`),
				solution: `Q \\approx ${q(ans.tex, 'kJ')}`,
				steps: [
					t("Il calorimetro è isolato: il calore ceduto dal metallo è tutto assorbito dall'acqua."),
					`Q = c\\,m\\,\\Delta t = ${CW} \\cdot ${tex(m)} \\cdot (${tf} - ${ti})\\,\\text{J} = ${tex((exact * 1000).toFixed(1).replace(/\.0$/, ''))}\\,\\text{J} \\approx ${q(ans.tex, 'kJ')}`,
				],
				// the final temperature for Δt; the initial one; c read per gram (a thousand times smaller)
				answer: answerOf(rng, ans, exact, [(C_WATER * Number(m) * tf) / 1000, (C_WATER * Number(m) * ti) / 1000, exact / 1000], 2, 'kJ'),
				params: { case: 'acqua', m, ti, tf },
			};
		}
		const metal = rng.pick(METALS);
		const m = mass2(rng);
		const th = rng.int(60, 200);
		const te = rng.int(15, 40);
		const exact = (metal.c * Number(m) * (th - te)) / 1000;
		const ans = sig(exact, 2);
		if (!ans || exact < 1 || exact >= 100) continue;
		return {
			prompt: 'Trova il calore scambiato.',
			problem: textBlock(
				`Un pezzo di ${metal.nome} di ${pq(tex(m), 'kg')}, a ${deg(String(th))}, viene immerso nell'acqua di un calorimetro isolato e si raffredda fino a ${deg(String(te))}. Quanto calore assorbe l'acqua? Il calore specifico del ${metal.nome} è ${pq(String(metal.c), 'cJ')}.`,
			),
			solution: `Q \\approx ${q(ans.tex, 'kJ')}`,
			steps: [
				t(`L'acqua assorbe tutto il calore ceduto dal ${metal.nome}, che si raffredda di ${th - te} gradi.`),
				`Q = c\\,m\\,\\Delta t = ${metal.c} \\cdot ${tex(m)} \\cdot (${th} - ${te})\\,\\text{J} = ${tex((exact * 1000).toFixed(2).replace(/\.?0+$/, ''))}\\,\\text{J} \\approx ${q(ans.tex, 'kJ')}`,
			],
			// the final temperature for Δt; the initial one; J read as kJ
			answer: answerOf(rng, ans, exact, [(metal.c * Number(m) * te) / 1000, (metal.c * Number(m) * th) / 1000, exact / 1000], 2, 'kJ'),
			params: { case: 'metallo', metal: metal.nome, c: metal.c, m, th, te },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: two masses of water

const intOpts = (xs: number[]) => xs.filter((x) => x > 0 && Math.abs(x - Math.floor(x) - 0.5) > 1e-6).map((x) => Math.round(x));

function level2(rng: Rng): Built {
	for (;;) {
		const k1 = rng.int(11, 99), k2 = rng.int(11, 99);
		if (k1 % 10 === 0 || k2 % 10 === 0 || k1 === k2) continue;
		const t1 = rng.int(40, 95), t2 = rng.int(5, 30);
		if ((k1 * t1 + k2 * t2) % (k1 + k2)) continue;
		const te = (k1 * t1 + k2 * t2) / (k1 + k2);
		if (te - t2 < 3 || t1 - te < 3 || te < 10) continue;
		const m1 = dec(k1, 1), m2 = dec(k2, 1);
		const wrong = intOpts([(t1 + t2) / 2, (k2 * t1 + k1 * t2) / (k1 + k2)]);
		const fall = [te + 3, te - 3, te + 6, te - 6];
		const pick = [...wrong, ...fall].filter((x, i, a) => x >= 10 && x !== te && a.indexOf(x) === i).slice(0, 3);
		if (pick.length < 3) continue;
		const answer = answerOf(rng, { tex: String(te), value: String(te) }, te, pick, 2, 'C');
		return {
			prompt: 'Trova la temperatura di equilibrio.',
			problem: textBlock(`In una bacinella si versano ${pq(tex(m1), 'kg')} d'acqua a ${deg(String(t1))} e ${pq(tex(m2), 'kg')} d'acqua a ${deg(String(t2))}. Trascurando la bacinella e l'aria, a quale temperatura arriva l'acqua?`),
			solution: `t_e = ${q(String(te), 'C')}`,
			steps: [
				t('La sostanza è la stessa: il calore specifico si semplifica.'),
				`t_e = \\dfrac{m_1\\,t_1 + m_2\\,t_2}{m_1 + m_2} = \\dfrac{${tex(m1)} \\cdot ${t1} + ${tex(m2)} \\cdot ${t2}}{${tex(m1)} + ${tex(m2)}}\\,^\\circ\\text{C} = ${q(String(te), 'C')}`,
			],
			answer,
			params: { case: 'acqua', m1, t1, m2, t2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: a metal in water

function level3(rng: Rng): Built {
	for (;;) {
		const metal = rng.pick(METALS);
		const m1 = mass2(rng);
		const t1 = rng.int(60, 250);
		const m2 = mass2(rng, 20);
		const t2 = rng.int(10, 25);
		const C1 = metal.c * Number(m1), C2 = C_WATER * Number(m2);
		const te = (C1 * t1 + C2 * t2) / (C1 + C2);
		const ans = sig(te, 3);
		if (!ans || te - t2 < 0.5) continue;
		const s1 = d1(t2);
		return {
			prompt: 'Trova la temperatura di equilibrio.',
			problem: textBlock(
				`Un pezzo di ${metal.nome} di ${pq(tex(m1), 'kg')}, a ${deg(String(t1))}, viene immerso in ${pq(tex(m2), 'kg')} d'acqua a ${deg(s1)}. Il calore specifico del ${metal.nome} è ${pq(String(metal.c), 'cJ')}, quello dell'acqua ${pq(CW, 'cJ')}. Trascurando il recipiente, a quale temperatura arrivano?`,
			),
			solution: `t_e \\approx ${q(ans.tex, 'C')}`,
			steps: [
				`${t('Le capacità termiche: ')} c_1 m_1 = ${metal.c} \\cdot ${tex(m1)} = ${tex(String(Math.round(C1 * 100) / 100))}\\,\\text{J/}^\\circ\\text{C}, \\quad c_2 m_2 = ${CW} \\cdot ${tex(m2)} = ${tex(String(Math.round(C2 * 100) / 100))}\\,\\text{J/}^\\circ\\text{C}`,
				`t_e = \\dfrac{c_1 m_1 t_1 + c_2 m_2 t_2}{c_1 m_1 + c_2 m_2} = ${tex(te.toFixed(3))}\\ldots\\,^\\circ\\text{C} \\approx ${q(ans.tex, 'C')}`,
			],
			// the masses only (c forgotten); the plain average; the specific heats swapped
			answer: answerOf(rng, ans, te, [(Number(m1) * t1 + Number(m2) * t2) / (Number(m1) + Number(m2)), (t1 + t2) / 2, (C_WATER * Number(m1) * t1 + metal.c * Number(m2) * t2) / (C_WATER * Number(m1) + metal.c * Number(m2)), te + 0.5, te - 0.5, te + 1], 3, 'C'),
			params: { case: metal.nome, c: metal.c, m1, t1, m2, t2: s1 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: a missing mass or temperature

function level4(rng: Rng): Built {
	const askMass = rng.next() < 0.5;
	for (;;) {
		const t2 = rng.int(5, 25);
		const t1 = rng.int(50, 95);
		const te = rng.int(t2 + 5, t1 - 5);
		if (askMass) {
			const k2 = rng.int(11, 99);
			if (k2 % 10 === 0) continue;
			const m2 = dec(k2, 1);
			const exact = (Number(m2) * (te - t2)) / (t1 - te);
			const ans = sig(exact, 2);
			if (!ans || exact < 0.1 || exact >= 10) continue;
			return {
				prompt: "Trova la massa dell'acqua calda.",
				problem: textBlock(`Quanta acqua a ${deg(String(t1))} bisogna aggiungere a ${pq(tex(m2), 'kg')} d'acqua a ${deg(String(t2))} per ottenere acqua a ${deg(String(te))}? Si trascurano il recipiente e l'aria.`),
				solution: `m_1 \\approx ${q(ans.tex, 'kg')}`,
				steps: [
					t("Il calore ceduto dall'acqua calda è assorbito dall'acqua fredda, e il calore specifico si semplifica:"),
					`m_1\\,(t_1 - t_e) = m_2\\,(t_e - t_2) \\quad\\Rightarrow\\quad m_1 = ${tex(m2)}\\,\\text{kg} \\cdot \\dfrac{${te} - ${t2}}{${t1} - ${te}} = ${tex(exact.toFixed(4))}\\ldots\\,\\text{kg} \\approx ${q(ans.tex, 'kg')}`,
				],
				// the ratio upside down; the difference of the starting temperatures in the denominator, or in place of the other one
				answer: answerOf(rng, ans, exact, [(Number(m2) * (t1 - te)) / (te - t2), (Number(m2) * (te - t2)) / (t1 - t2), (Number(m2) * (t1 - te)) / (t1 - t2)], 2, 'kg'),
				params: { case: 'massa', m2, t1, t2, te },
			};
		}
		const k1 = rng.int(11, 99), k2 = rng.int(11, 99);
		if (k1 % 10 === 0 || k2 % 10 === 0 || k1 === k2) continue;
		const m1 = dec(k1, 1), m2 = dec(k2, 1);
		const exact = te + (Number(m2) * (te - t2)) / Number(m1);
		const ans = sig(exact, 2);
		if (!ans || exact >= 99.5 || exact < 35 || exact - te < 5) continue;
		return {
			prompt: "Trova la temperatura dell'acqua calda.",
			problem: textBlock(`${pq(tex(m1), 'kg')} d'acqua calda vengono mescolati con ${pq(tex(m2), 'kg')} d'acqua a ${deg(String(t2))}, e la temperatura finale è ${deg(String(te))}. Qual era la temperatura dell'acqua calda? Si trascurano il recipiente e l'aria.`),
			solution: `t_1 \\approx ${q(ans.tex, 'C')}`,
			steps: [
				t("Il calore ceduto dall'acqua calda è assorbito dall'acqua fredda:"),
				`m_1\\,(t_1 - t_e) = m_2\\,(t_e - t_2) \\quad\\Rightarrow\\quad t_1 = t_e + \\dfrac{m_2\\,(t_e - t_2)}{m_1} = ${te} + \\dfrac{${tex(m2)} \\cdot ${te - t2}}{${tex(m1)}} = ${tex(exact.toFixed(3))}\\ldots\\,^\\circ\\text{C} \\approx ${q(ans.tex, 'C')}`,
			],
			// the masses swapped; equal masses assumed; the fallbacks
			answer: answerOf(rng, ans, exact, [te + (Number(m1) * (te - t2)) / Number(m2), 2 * te - t2].filter((x) => x > te && x < 99.5), 2, 'C', [exact + 3, exact - 3, exact + 6, exact - 6].filter((x) => x > te && x < 99.5)),
			params: { case: 'temperatura', m1, m2, t2, te },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: the calorimeter

/** The specific heat measured, its significant figures (those of t_e - t_a), and the mistakes. */
function specific(ma: number, meq: number, ta: number, mx: number, tx: number, te: number) {
	const da = te - ta, dx = tx - te;
	const n = da >= 10 - 1e-9 ? 3 : 2;
	const c = (C_WATER * (ma + meq) * da) / (mx * dx);
	return {
		c,
		n,
		mistakes: [
			(C_WATER * (ma + meq) * da) / (mx * (tx - ta)), // the difference of the starting temperatures for the sample
			(C_WATER * mx * da) / ((ma + meq) * dx), // the masses swapped
			(C_WATER * (ma + meq) * dx) / (mx * da), // the two differences swapped
		],
	};
}

/** A temperature to the tenth of a degree, or null near a tie. */
const tenth = (x: number) => (Math.abs(x * 10 - Math.floor(x * 10) - 0.5) < 1e-6 ? null : (Math.round(x * 10) / 10).toFixed(1));

function level5(rng: Rng): Built {
	for (;;) {
		const metal = rng.pick(METALS);
		const ma = rng.int(20, 60) * 5, mx = rng.int(10, 50) * 10; // grams
		const ta = rng.int(12, 25), tx = rng.int(80, 100);
		const exactTe = (metal.c * mx * tx + C_WATER * ma * ta) / (metal.c * mx + C_WATER * ma);
		const teS = tenth(exactTe);
		if (!teS) continue;
		const te = Number(teS);
		if (te - ta < 2) continue;
		const s = specific(ma / 1000, 0, ta, mx / 1000, tx, te);
		const ans = sig(s.c, s.n);
		if (!ans) continue;
		const maS = dec(ma, 3), mxS = dec(mx, 3);
		return {
			prompt: 'Trova il calore specifico.',
			problem: textBlock(
				`Un calorimetro contiene ${pq(tex(maS), 'kg')} d'acqua a ${deg(d1(ta))}. Un campione di metallo di ${pq(tex(mxS), 'kg')}, scaldato a ${deg(d1(tx))}, viene immerso nell'acqua, e la temperatura di equilibrio è ${deg(teS)}. Trascurando il calorimetro, quanto vale il calore specifico del metallo? ${CW_TEXT}`,
			),
			solution: `c_x \\approx ${q(ans.tex, 'cJ')}`,
			steps: [
				t("Il calore ceduto dal campione è assorbito dall'acqua:"),
				`c_x\\,m_x\\,(t_x - t_e) = c_{acqua}\\,m_a\\,(t_e - t_a)`,
				`c_x = \\dfrac{${CW} \\cdot ${tex(maS)} \\cdot (${tex(teS)} - ${tex(d1(ta))})}{${tex(mxS)} \\cdot (${tex(d1(tx))} - ${tex(teS)})}\\,${'\\text{J/(kg}\\cdot{}^\\circ\\text{C)}'} = ${tex(s.c.toFixed(2))}\\ldots \\approx ${q(ans.tex, 'cJ')}`,
				t(`Il risultato ha ${s.n === 3 ? 'tre' : 'due'} cifre significative, come la differenza di temperatura dell'acqua.`),
			],
			answer: answerOf(rng, ans, s.c, s.mistakes, s.n, 'cJ'),
			params: { case: 'calore specifico', ma: maS, ta, mx: mxS, tx, te: teS },
		};
	}
}

function level6(rng: Rng): Built {
	const findEq = rng.next() < 0.5;
	for (;;) {
		const meq = rng.int(10, 60);
		if (findEq) {
			const mc = rng.int(15, 30) * 10, mh = rng.int(8, 20) * 10;
			const tc = rng.int(12, 25), th = rng.int(50, 80);
			const exactTe = (mh * th + (mc + meq) * tc) / (mh + mc + meq);
			const teS = tenth(exactTe);
			if (!teS) continue;
			const te = Number(teS);
			const exact = (mh * (th - te)) / (te - tc) - mc;
			const ans = sig(exact, 2);
			if (!ans || exact < 10 || exact >= 99.5) continue;
			return {
				prompt: "Trova l'equivalente in acqua.",
				problem: textBlock(`Un calorimetro contiene ${pq(String(mc), 'g')} d'acqua a ${deg(d1(tc))}. Si versano ${pq(String(mh), 'g')} d'acqua a ${deg(d1(th))}, e la temperatura di equilibrio è ${deg(teS)}. Quanto vale l'equivalente in acqua del calorimetro?`),
				solution: `m_{eq} \\approx ${q(ans.tex, 'g')}`,
				steps: [
					t("Il calore ceduto dall'acqua calda è assorbito dall'acqua fredda e dal calorimetro:"),
					`m_h\\,(t_h - t_e) = (m_c + m_{eq})\\,(t_e - t_c)`,
					`m_c + m_{eq} = \\dfrac{${mh} \\cdot (${tex(d1(th))} - ${tex(teS)})}{${tex(teS)} - ${tex(d1(tc))}}\\,\\text{g} = ${tex((exact + mc).toFixed(2))}\\ldots\\,\\text{g}`,
					`m_{eq} = ${tex((exact + mc).toFixed(2))}\\,\\text{g} - ${mc}\\,\\text{g} \\approx ${q(ans.tex, 'g')}`,
				],
				// the water not subtracted; the equivalent put with the hot water
				answer: answerOf(rng, ans, exact, [exact + mc, (mc * (te - tc)) / (th - te) - mh, exact * 1.5, exact * 0.5], 2, 'g'),
				params: { case: 'equivalente', mc, tc, mh, th, te: teS },
			};
		}
		const metal = rng.pick(METALS);
		const ma = rng.int(15, 30) * 10, mx = rng.int(10, 50) * 10; // grams
		const ta = rng.int(12, 25), tx = rng.int(80, 100);
		const exactTe = (metal.c * mx * tx + C_WATER * (ma + meq) * ta) / (metal.c * mx + C_WATER * (ma + meq));
		const teS = tenth(exactTe);
		if (!teS) continue;
		const te = Number(teS);
		if (te - ta < 2) continue;
		const s = specific(ma / 1000, meq / 1000, ta, mx / 1000, tx, te);
		const ans = sig(s.c, s.n);
		if (!ans) continue;
		const without = (C_WATER * (ma / 1000) * (te - ta)) / ((mx / 1000) * (tx - te));
		const onSample = (C_WATER * (ma / 1000) * (te - ta)) / (((mx + meq) / 1000) * (tx - te));
		return {
			prompt: 'Trova il calore specifico.',
			problem: textBlock(
				`Un calorimetro con equivalente in acqua di ${pq(String(meq), 'g')} contiene ${pq(String(ma), 'g')} d'acqua a ${deg(d1(ta))}. Un campione di metallo di ${pq(String(mx), 'g')}, scaldato a ${deg(d1(tx))}, viene immerso, e la temperatura di equilibrio è ${deg(teS)}. Quanto vale il calore specifico del metallo? ${CW_TEXT}`,
			),
			solution: `c_x \\approx ${q(ans.tex, 'cJ')}`,
			steps: [
				t("Il calore ceduto dal campione è assorbito dall'acqua e dal calorimetro, con le masse in kg:"),
				`c_x\\,m_x\\,(t_x - t_e) = c_{acqua}\\,(m_a + m_{eq})\\,(t_e - t_a)`,
				`c_x = \\dfrac{${CW} \\cdot (${tex(dec(ma, 3))} + ${tex(dec(meq, 3))}) \\cdot (${tex(teS)} - ${tex(d1(ta))})}{${tex(dec(mx, 3))} \\cdot (${tex(d1(tx))} - ${tex(teS)})}\\,${'\\text{J/(kg}\\cdot{}^\\circ\\text{C)}'} = ${tex(s.c.toFixed(2))}\\ldots \\approx ${q(ans.tex, 'cJ')}`,
			],
			// the water equivalent forgotten; added to the sample; the two differences swapped
			answer: answerOf(rng, ans, s.c, [without, onSample, s.mistakes[2]], s.n, 'cJ'),
			params: { case: 'calore specifico', meq, ma, ta, mx, tx, te: teS },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const fisEquilibrioTermico: Generator = {
	id: ID,
	title: "L'equilibrio termico e il calorimetro",
	levels: {
		1: { label: 'Il calore scambiato', constraints: ["l'acqua che si scalda o il metallo che si raffredda", 'risultato in kJ, due cifre significative'] },
		2: { label: 'Acqua calda e acqua fredda', constraints: ['masse diverse', 'temperatura di equilibrio intera'] },
		3: { label: "Un metallo nell'acqua", constraints: ['cinque metalli', 'temperatura al decimo di grado'] },
		4: { label: 'Il dato mancante', constraints: ["la massa o la temperatura dell'acqua calda"] },
		5: { label: 'Il calore specifico', constraints: ['calorimetro trascurato', 'cifre significative della differenza di temperatura'] },
		6: { label: "L'equivalente in acqua", constraints: ["trovare l'equivalente, o usarlo per il calore specifico"] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisEquilibrioTermico;
