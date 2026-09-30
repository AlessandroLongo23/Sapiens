/**
 * La legge di Boyle. Spec: specs/exercises/chim-legge-boyle.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/31-chim-legge-boyle.md), each one step harder: the final
 * pressure; the final volume, with three significant figures; data in different units (mL and L, atm and mmHg); a
 * pressure read off the p-V graph of a gas (scene `grafico-dati`, an inverse curve through the points); the bubble of a
 * diver, with the pressure under water; by how many per cent the pressure changes when the volume changes by x %.
 * Distractors from the lesson's warnings: the formula upside down, a unit not converted, the atmospheric pressure
 * forgotten under water, the same percentage for the pressure as for the volume.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, answerOf, checkChoice, dec, generateWith, intAnswer, pq, pqs, sig, t, tex, textBlock, two } from '../chim-gas';

export const ID = 'chim-legge-boyle';

function d3(rng: Rng, lo: number, hi: number, d: number): string {
	for (;;) {
		const k = rng.int(lo, hi);
		if (d > 0 || k % 10) return dec(k, d);
	}
}

// ---------------------------------------------------------------------------
// Level 1: the final pressure

function level1(rng: Rng): Built {
	const p1 = two(rng, 11, 49);
	const V1 = two(rng), V2 = two(rng);
	if (V1 === V2) throw new Error('retry');
	const P1 = Number(p1), A = Number(V1), B = Number(V2);
	const exact = (P1 * A) / B;
	const ans = sig(exact, 2);
	if (!ans || exact < 0.1 || exact >= 100) throw new Error('retry');
	return {
		prompt: 'Trova la pressione finale.',
		problem: textBlock(`Un gas occupa ${pqs(V1, 'L')} alla pressione di ${pqs(p1, 'atm')}. A temperatura costante il suo volume diventa ${pqs(V2, 'L')}. Quale pressione ha il gas?`),
		solution: `p_2 \\approx ${ans.tex}\\,\\text{atm}`,
		steps: [
			t('A temperatura costante vale la legge di Boyle:'),
			`p_1\\,V_1 = p_2\\,V_2 \\quad\\Rightarrow\\quad p_2 = \\dfrac{p_1\\,V_1}{V_2} = \\dfrac{${tex(p1)}\\,\\text{atm} \\cdot ${tex(V1)}\\,\\text{L}}{${tex(V2)}\\,\\text{L}} = ${tex(exact.toFixed(3))}\\ldots\\,\\text{atm} \\approx ${ans.tex}\\,\\text{atm}`,
		],
		// the ratio of the volumes upside down; the product of all three; the volumes subtracted
		answer: answerOf(rng, ans, exact, [(P1 * B) / A, P1 * A * B, P1 * Math.abs(A - B)], 2, 'atm'),
		params: { case: A > B ? 'compressione' : 'espansione', p1, V1, V2 },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the final volume

function level2(rng: Rng): Built {
	const u = rng.pick(['mmHg', 'kPa'] as const);
	const p1 = d3(rng, 101, 999, 0), p2 = d3(rng, 101, 999, 0);
	if (p1 === p2) throw new Error('retry');
	const V1 = d3(rng, 101, 999, 2);
	const P1 = Number(p1), P2 = Number(p2), A = Number(V1);
	const exact = (P1 * A) / P2;
	const ans = sig(exact, 3);
	if (!ans || exact < 0.1 || exact >= 100) throw new Error('retry');
	return {
		prompt: 'Trova il volume finale.',
		problem: textBlock(`Un campione di gas occupa ${pqs(V1, 'L')} alla pressione di ${pq(p1, u)}. A temperatura costante la pressione diventa ${pq(p2, u)}. Quale volume occupa il gas?`),
		solution: `V_2 \\approx ${ans.tex}\\,\\text{L}`,
		steps: [
			t('Le due pressioni hanno la stessa unità: non serve cambiarla.'),
			`V_2 = \\dfrac{p_1\\,V_1}{p_2} = \\dfrac{${p1} \\cdot ${tex(V1)}}{${p2}}\\,\\text{L} = ${tex(exact.toFixed(4))}\\ldots\\,\\text{L} \\approx ${ans.tex}\\,\\text{L}`,
		],
		// the ratio of the pressures upside down; p1 V1 not divided by p2
		answer: answerOf(rng, ans, exact, [(P2 * A) / P1, P1 * A], 3, 'L'),
		params: { case: u, p1, p2, V1 },
	};
}

// ---------------------------------------------------------------------------
// Level 3: different units

function level3(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const p1 = d3(rng, 100, 300, 2);
		const V1 = d3(rng, 101, 999, 0); // mL
		const V2 = d3(rng, 110, 990, 2); // L
		const P1 = Number(p1), A = Number(V1) / 1000, B = Number(V2);
		const exact = (P1 * A) / B;
		const ans = sig(exact, 3);
		if (!ans || exact < 0.001) throw new Error('retry');
		return {
			prompt: 'Trova la pressione finale.',
			problem: textBlock(`Una siringa contiene ${pq(V1, 'mL')} di gas alla pressione di ${pqs(p1, 'atm')}. A temperatura costante il gas si espande fino a occupare ${pqs(V2, 'L')}. Quale pressione ha il gas?`),
			solution: `p_2 \\approx ${ans.tex}\\,\\text{atm}`,
			steps: [
				t(`I due volumi devono avere la stessa unità: ${V1} mL = ${tex(A.toFixed(3))} L.`.replace('{,}', ',')),
				`p_2 = \\dfrac{p_1\\,V_1}{V_2} = \\dfrac{${tex(p1)}\\,\\text{atm} \\cdot ${tex(A.toFixed(3))}\\,\\text{L}}{${tex(V2)}\\,\\text{L}} \\approx ${ans.tex}\\,\\text{atm}`,
			],
			// millilitres and litres mixed; the ratio upside down; the ratio upside down and mixed
			answer: answerOf(rng, ans, exact, [(P1 * Number(V1)) / B, (P1 * B) / A, (P1 * B) / Number(V1)], 3, 'atm'),
			params: { case: 'volumi', p1, V1, V2 },
		};
	}
	const p1 = d3(rng, 100, 300, 2); // atm
	const p2 = d3(rng, 101, 999, 0); // mmHg
	const V1 = two(rng);
	const P1 = Number(p1) * 760, P2 = Number(p2), A = Number(V1);
	const exact = (P1 * A) / P2;
	const ans = sig(exact, 2);
	if (!ans || exact < 0.1 || exact >= 100) throw new Error('retry');
	return {
		prompt: 'Trova il volume finale.',
		problem: textBlock(`Un gas occupa ${pqs(V1, 'L')} alla pressione di ${pqs(p1, 'atm')}. A temperatura costante la pressione diventa ${pq(p2, 'mmHg')}. Quale volume occupa il gas?`),
		solution: `V_2 \\approx ${ans.tex}\\,\\text{L}`,
		steps: [
			t(`Le due pressioni devono avere la stessa unità: ${tex(p1).replace('{,}', ',')} atm = ${tex(p1).replace('{,}', ',')} · 760 mmHg.`),
			`V_2 = \\dfrac{p_1\\,V_1}{p_2} = \\dfrac{${tex(p1)} \\cdot 760\\,\\text{mmHg} \\cdot ${tex(V1)}\\,\\text{L}}{${p2}\\,\\text{mmHg}} = ${tex(exact.toFixed(3))}\\ldots\\,\\text{L} \\approx ${ans.tex}\\,\\text{L}`,
		],
		// atmospheres and millimetres of mercury mixed; the ratio upside down; 101,3 for 760
		answer: answerOf(rng, ans, exact, [(Number(p1) * A) / P2, (P2 * A) / P1, (Number(p1) * 101.3 * A) / P2], 2, 'L'),
		params: { case: 'pressioni', p1, p2, V1 },
	};
}

// ---------------------------------------------------------------------------
// Level 4: from the graph

const CURVES = [
	{ k: 6, V: [1.5, 2, 3, 4, 6], ask: [5, 8, 2.5, 1.2, 10] },
	{ k: 4, V: [1, 2, 4, 8], ask: [5, 1.6, 2.5, 10] },
	{ k: 8, V: [2, 4, 8], ask: [5, 1.6, 10, 2.5] },
	{ k: 3, V: [1, 1.5, 2, 3, 6], ask: [5, 4, 2.5, 1.2, 7.5] },
	{ k: 12, V: [3, 4, 6, 8], ask: [5, 10, 2.5, 7.5] },
	{ k: 2, V: [1, 2, 4], ask: [5, 2.5, 8, 0.8] },
];

function level4(rng: Rng): Built {
	const c = rng.pick(CURVES);
	const pts = c.V.map((x) => [x, c.k / x] as [number, number]);
	const Vs = rng.pick(c.ask);
	const exact = c.k / Vs;
	const ans = sig(exact, 2);
	if (!ans) throw new Error('retry');
	const [V1, pA] = rng.pick(pts);
	const nearest = pts.reduce((m, q) => (Math.abs(q[0] - Vs) < Math.abs(m[0] - Vs) ? q : m), pts[0]);
	const pMax = Math.max(...pts.map((q) => q[1]), exact);
	const vMax = Math.max(...c.V, Vs);
	const vCells = vMax <= 8 ? 8 : 10;
	const pCells = Math.ceil(pMax / 0.5) + 1;
	return {
		prompt: 'Leggi il grafico e trova la pressione.',
		problem: textBlock(`Il grafico mostra la pressione di una quantità fissa di gas in funzione del volume, a temperatura costante. Quale pressione ha il gas quando il suo volume è ${pqs(String(Vs), 'L')}?`),
		solution: `p \\approx ${ans.tex}\\,\\text{atm}`,
		steps: [
			textBlock(`Dal grafico si legge un punto, per esempio $V = ${tex(String(V1))}\\,\\text{L}$ e $p = ${tex(String(pA))}\\,\\text{atm}$: il prodotto $p \\cdot V$ vale $${tex(String(c.k))}\\,\\text{atm} \\cdot \\text{L}$ ed è lo stesso per tutti i punti.`),
			`p = \\dfrac{p \\cdot V}{V} = \\dfrac{${c.k}\\,\\text{atm} \\cdot \\text{L}}{${tex(String(Vs))}\\,\\text{L}} \\approx ${ans.tex}\\,\\text{atm}`,
		],
		// a direct proportion from a point; the pressure of the nearest point; the product read one cell off
		answer: answerOf(rng, ans, exact, [(pA * Vs) / V1, nearest[1], (c.k + 1) / Vs], 2, 'atm'),
		params: { case: 'grafico', k: c.k, V: Vs },
		scene: {
			type: 'grafico-dati',
			data: {
				x: { nome: 'V', unita: 'L', passo: 1, celle: vCells, etichette: vCells > 8 ? 2 : 1 },
				y: { nome: 'p', unita: 'atm', passo: 0.5, celle: pCells, etichette: 2 },
				punti: pts,
				linea: { tipo: 'inversa', k: c.k },
			},
			alt: `Grafico della pressione in funzione del volume: i punti ${pts.map((q) => `(${String(q[0]).replace('.', ',')} L; ${String(q[1]).replace('.', ',')} atm)`).join(', ')} stanno su un ramo di iperbole.`,
		},
	};
}

// ---------------------------------------------------------------------------
// Level 5: the diver's bubble

function level5(rng: Rng): Built {
	const h = rng.int(1, 8) * 5;
	const p = 1 + h / 10; // atm
	const pS = (Math.round(p * 10) / 10).toFixed(1);
	if (rng.next() < 0.5) {
		const V1 = two(rng);
		const exact = Number(V1) * p;
		const ans = sig(exact, 2);
		if (!ans) throw new Error('retry');
		return {
			prompt: 'Trova il volume della bolla in superficie.',
			problem: textBlock(`Un sub, a $${h}\\,\\text{m}$ di profondità, espira una bolla d'aria di ${pqs(V1, 'cm3')}. Sott'acqua la pressione cresce di $1\\,\\text{atm}$ ogni $10\\,\\text{m}$, e in superficie è $1{,}0\\,\\text{atm}$. Quale volume ha la bolla in superficie, se la temperatura non cambia?`),
			solution: `V_2 \\approx ${ans.tex}\\,\\text{cm}^3`,
			steps: [
				t(`A ${h} m la pressione è quella dell'aria più quella dell'acqua:`),
				`p_1 = 1{,}0\\,\\text{atm} + \\dfrac{${h}}{10}\\,\\text{atm} = ${tex(pS)}\\,\\text{atm}`,
				`V_2 = \\dfrac{p_1\\,V_1}{p_2} = \\dfrac{${tex(pS)}\\,\\text{atm} \\cdot ${tex(V1)}\\,\\text{cm}^3}{1{,}0\\,\\text{atm}} \\approx ${ans.tex}\\,\\text{cm}^3`,
			],
			// the air above the water forgotten; the ratio upside down; the depth in metres as atmospheres
			answer: answerOf(rng, ans, exact, [(Number(V1) * h) / 10, Number(V1) / p, Number(V1) * h], 2, 'cm3', [exact * 1.5, exact * 0.75, exact + Number(V1), exact * 2]),
			params: { case: 'sale', h, V1 },
		};
	}
	const V1 = two(rng);
	const exact = Number(V1) / p;
	const ans = sig(exact, 2);
	if (!ans) throw new Error('retry');
	return {
		prompt: "Trova il volume del palloncino sott'acqua.",
		problem: textBlock(`Un palloncino contiene ${pqs(V1, 'L')} d'aria in superficie, dove la pressione è $1{,}0\\,\\text{atm}$. Un sub lo porta a $${h}\\,\\text{m}$ di profondità; sott'acqua la pressione cresce di $1\\,\\text{atm}$ ogni $10\\,\\text{m}$. Quale volume ha il palloncino, se la temperatura non cambia?`),
		solution: `V_2 \\approx ${ans.tex}\\,\\text{L}`,
		steps: [
			t(`A ${h} m la pressione è quella dell'aria più quella dell'acqua:`),
			`p_2 = 1{,}0\\,\\text{atm} + \\dfrac{${h}}{10}\\,\\text{atm} = ${tex(pS)}\\,\\text{atm}`,
			`V_2 = \\dfrac{p_1\\,V_1}{p_2} = \\dfrac{1{,}0\\,\\text{atm} \\cdot ${tex(V1)}\\,\\text{L}}{${tex(pS)}\\,\\text{atm}} \\approx ${ans.tex}\\,\\text{L}`,
		],
		// the air above the water forgotten; the ratio upside down; the depth in metres as atmospheres
		answer: answerOf(rng, ans, exact, [(Number(V1) * 10) / h, Number(V1) * p, Number(V1) / h], 2, 'L', [exact * 1.5, exact * 0.75, exact * 2, exact * 0.5]),
		params: { case: 'scende', h, V1 },
	};
}

// ---------------------------------------------------------------------------
// Level 6: percentages

const SHRINK = [10, 20, 25, 30, 40, 50, 60, 75, 80];
const GROW = [10, 20, 25, 50, 100, 150, 200, 300];

function level6(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const x = rng.pick(SHRINK);
		const exact = (100 * x) / (100 - x);
		if (Math.abs(exact - Math.floor(exact) - 0.5) < 1e-9) throw new Error('retry');
		const r = Math.round(exact);
		return {
			prompt: 'Trova di quanto cambia la pressione.',
			problem: textBlock(`A temperatura costante il volume di un gas diminuisce del $${x}\\,\\%$. Di quanto per cento aumenta la sua pressione?`),
			solution: `+${r}\\,\\%`,
			steps: [
				textBlock(`Il volume diventa il $${100 - x}\\,\\%$ di quello iniziale, cioè viene moltiplicato per $${tex(String((100 - x) / 100))}$; la pressione viene moltiplicata per l'inverso:`),
				`\\dfrac{p_2}{p_1} = \\dfrac{V_1}{V_2} = \\dfrac{100}{${100 - x}} = ${tex((100 / (100 - x)).toFixed(3))}\\ldots \\quad\\Rightarrow\\quad \\text{aumento} \\approx ${r}\\,\\%`,
			],
			// the same percentage; what is left of the volume; the percentage computed on the new volume the wrong way
			answer: intAnswer(rng, r, [x, 100 - x, Math.round((100 * x) / (100 + x))], 'pct', [r + 5, r - 5, r + 10]),
			params: { case: 'diminuisce', x },
		};
	}
	const x = rng.pick(GROW);
	const exact = (100 * x) / (100 + x);
	if (Math.abs(exact - Math.floor(exact) - 0.5) < 1e-9) throw new Error('retry');
	const r = Math.round(exact);
	return {
		prompt: 'Trova di quanto cambia la pressione.',
		problem: textBlock(`A temperatura costante il volume di un gas aumenta del $${x}\\,\\%$. Di quanto per cento diminuisce la sua pressione?`),
		solution: `-${r}\\,\\%`,
		steps: [
			textBlock(`Il volume viene moltiplicato per $${tex(String((100 + x) / 100))}$; la pressione viene moltiplicata per l'inverso:`),
			`\\dfrac{p_2}{p_1} = \\dfrac{100}{${100 + x}} = ${tex((100 / (100 + x)).toFixed(3))}\\ldots \\quad\\Rightarrow\\quad \\text{diminuzione} \\approx ${r}\\,\\%`,
		],
		// the same percentage (when possible); what is left of the pressure; x/(100 - x)
		answer: intAnswer(rng, r, [x < 100 ? x : r + 15, 100 - r, x < 100 ? Math.round((100 * x) / (100 - x)) : r - 15].filter((y) => y > 0 && y < 100), 'pct', [r + 5, r - 5, r + 10, r - 10].filter((y) => y > 0 && y < 100)),
		params: { case: 'aumenta', x },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimLeggeBoyle: Generator = {
	id: ID,
	title: 'La legge di Boyle',
	levels: {
		1: { label: 'La pressione finale', constraints: ['dati con due cifre significative'] },
		2: { label: 'Il volume finale', constraints: ['pressioni in mmHg o kPa', 'tre cifre significative'] },
		3: { label: 'Unità diverse', constraints: ['mL e L, oppure atm e mmHg'] },
		4: { label: 'Dal grafico pressione-volume', constraints: ['scena grafico-dati', 'p · V dal grafico'] },
		5: { label: 'La bolla del sub', constraints: ["1 atm ogni 10 m d'acqua, più quella dell'aria"] },
		6: { label: 'Di quanto per cento', constraints: ['la pressione cambia di una percentuale diversa dal volume'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimLeggeBoyle;
