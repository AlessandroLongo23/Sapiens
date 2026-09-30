/**
 * Le leggi di Charles e di Gay-Lussac. Spec: specs/exercises/chim-legge-charles-gay-lussac.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/32-chim-legge-charles-gay-lussac.md), each one step
 * harder: Charles's law with the temperatures in kelvin; with the temperatures in degrees Celsius; Gay-Lussac's law
 * for a rigid container (a gas cylinder, a tyre, a spray can); the final temperature, in degrees Celsius, from two
 * volumes or two pressures; a volume read off the V-T graph at a temperature given in degrees Celsius (scene
 * `grafico-dati`, a line through the origin). Distractors from the lesson's warnings: the ratio of the Celsius
 * temperatures, the ratio upside down, the kelvin written as degrees Celsius.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, answerOf, checkChoice, dec, generateWith, intAnswer, pq, pqs, shuffle, sig, t, tex, textBlock, two } from '../chim-gas';

export const ID = 'chim-legge-charles-gay-lussac';

function d3(rng: Rng, lo: number, hi: number, d: number): string {
	for (;;) {
		const k = rng.int(lo, hi);
		if (d > 0 || k % 10) return dec(k, d);
	}
}

/** Two different Celsius temperatures, away from 0. */
function temps(rng: Rng, lo: number, hi: number): [number, number] {
	for (;;) {
		const a = rng.int(lo, hi), b = rng.int(lo, hi);
		if (a !== b && Math.abs(a) >= 5 && Math.abs(b) >= 5 && Math.abs(a - b) >= 10) return [a, b];
	}
}

// ---------------------------------------------------------------------------
// Level 1: Charles, in kelvin

function level1(rng: Rng): Built {
	const V1 = two(rng);
	const T1 = rng.int(200, 600), T2 = rng.int(200, 600);
	if (Math.abs(T1 - T2) < 20) throw new Error('retry');
	const A = Number(V1);
	const exact = (A * T2) / T1;
	const ans = sig(exact, 2);
	if (!ans) throw new Error('retry');
	return {
		prompt: 'Trova il volume finale.',
		problem: textBlock(`Un gas occupa ${pqs(V1, 'L')} alla temperatura di ${pq(String(T1), 'K')}. A pressione costante viene portato a ${pq(String(T2), 'K')}. Quale volume occupa?`),
		solution: `V_2 \\approx ${ans.tex}\\,\\text{L}`,
		steps: [
			t('A pressione costante vale la legge di Charles:'),
			`\\dfrac{V_1}{T_1} = \\dfrac{V_2}{T_2} \\quad\\Rightarrow\\quad V_2 = V_1 \\cdot \\dfrac{T_2}{T_1} = ${tex(V1)}\\,\\text{L} \\cdot \\dfrac{${T2}\\,\\text{K}}{${T1}\\,\\text{K}} \\approx ${ans.tex}\\,\\text{L}`,
		],
		// the ratio upside down; the difference of the temperatures over T1; the difference as a percentage
		answer: answerOf(rng, ans, exact, [(A * T1) / T2, (A * Math.abs(T2 - T1)) / T1, A + (T2 - T1) / 100], 2, 'L'),
		params: { case: T2 > T1 ? 'scalda' : 'raffredda', V1, T1, T2 },
	};
}

// ---------------------------------------------------------------------------
// Level 2: Charles, in degrees Celsius

function level2(rng: Rng): Built {
	const V1 = d3(rng, 100, 999, 2);
	const [t1, t2] = temps(rng, -40, 150);
	const T1 = t1 + 273, T2 = t2 + 273;
	const A = Number(V1);
	const exact = (A * T2) / T1;
	const ans = sig(exact, 3);
	if (!ans) throw new Error('retry');
	return {
		prompt: 'Trova il volume finale.',
		problem: textBlock(`Un palloncino contiene ${pqs(V1, 'L')} d'aria a ${pq(String(t1), 'C')}. La temperatura diventa ${pq(String(t2), 'C')}, e la pressione resta la stessa. Quale volume ha il palloncino?`),
		solution: `V_2 \\approx ${ans.tex}\\,\\text{L}`,
		steps: [
			t('Le temperature vanno in kelvin:'),
			`T_1 = ${t1} + 273 = ${T1}\\,\\text{K} \\qquad T_2 = ${t2} + 273 = ${T2}\\,\\text{K}`,
			`V_2 = V_1 \\cdot \\dfrac{T_2}{T_1} = ${tex(V1)}\\,\\text{L} \\cdot \\dfrac{${T2}}{${T1}} = ${tex(exact.toFixed(4))}\\ldots\\,\\text{L} \\approx ${ans.tex}\\,\\text{L}`,
		],
		// the Celsius temperatures; the ratio upside down; only one of the two converted
		answer: answerOf(rng, ans, exact, [(A * t2) / t1, (A * T1) / T2, (A * T2) / Math.abs(t1)], 3, 'L'),
		params: { case: t2 > t1 ? 'scalda' : 'raffredda', V1, t1, t2 },
	};
}

// ---------------------------------------------------------------------------
// Level 3: Gay-Lussac

const RIGID = [
	{ what: 'Una bombola contiene un gas', u: 'atm' as const },
	{ what: "La gomma di un'auto contiene aria", u: 'kPa' as const },
	{ what: 'Una bomboletta spray contiene un gas', u: 'atm' as const },
	{ what: 'Un recipiente di vetro chiuso contiene aria', u: 'kPa' as const },
];

function level3(rng: Rng): Built {
	const c = rng.pick(RIGID);
	const p1 = c.u === 'atm' ? d3(rng, 100, 500, 2) : d3(rng, 101, 499, 0);
	const [t1, t2] = temps(rng, -30, 400);
	const T1 = t1 + 273, T2 = t2 + 273;
	const P = Number(p1);
	const exact = (P * T2) / T1;
	const ans = sig(exact, 3);
	if (!ans) throw new Error('retry');
	return {
		prompt: 'Trova la pressione finale.',
		problem: textBlock(`${c.what} alla pressione di ${pqs(p1, c.u)} e alla temperatura di ${pq(String(t1), 'C')}. Il volume non può cambiare. Quale pressione ha il gas a ${pq(String(t2), 'C')}?`),
		solution: `p_2 \\approx ${ans.tex}\\,\\text{${c.u}}`,
		steps: [
			t('Il volume è costante: vale la legge di Gay-Lussac, con le temperature in kelvin.'),
			`T_1 = ${T1}\\,\\text{K} \\qquad T_2 = ${T2}\\,\\text{K}`,
			`p_2 = p_1 \\cdot \\dfrac{T_2}{T_1} = ${tex(p1)}\\,\\text{${c.u}} \\cdot \\dfrac{${T2}}{${T1}} = ${tex(exact.toFixed(4))}\\ldots\\,\\text{${c.u}} \\approx ${ans.tex}\\,\\text{${c.u}}`,
		],
		// the Celsius temperatures; the ratio upside down; only one of the two converted
		answer: answerOf(rng, ans, exact, [(P * t2) / t1, (P * T1) / T2, (P * T2) / Math.abs(t1)], 3, c.u),
		params: { case: c.u, p1, t1, t2 },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the final temperature

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

function level4(rng: Rng): Built {
	const charles = rng.next() < 0.5;
	const t1 = rng.int(-20, 60);
	const T1 = t1 + 273;
	const T2 = rng.int(200, 700);
	const t2 = T2 - 273;
	if (Math.abs(t1) < 5 || Math.abs(t2) < 5 || Math.abs(T2 - T1) < 30) throw new Error('retry');
	const g = gcd(T1, T2);
	const k = rng.int(1, 20);
	const x1 = (k * T1) / g, x2 = (k * T2) / g; // volumes in mL or pressures in kPa
	if (x1 < 100 || x1 > 999 || x2 < 100 || x2 > 999 || x1 % 10 === 0 || x2 % 10 === 0) throw new Error('retry');
	const [u, what] = charles ? (['mL', 'volume'] as const) : (['kPa', 'pressione'] as const);
	const text = charles
		? `Un gas occupa ${pq(String(x1), 'mL')} a ${pq(String(t1), 'C')}. Lo si scalda o lo si raffredda a pressione costante, e alla fine occupa ${pq(String(x2), 'mL')}. A quale temperatura, in gradi Celsius?`
		: `Un gas in un recipiente rigido ha la pressione di ${pq(String(x1), 'kPa')} a ${pq(String(t1), 'C')}. Dopo averlo scaldato o raffreddato, la pressione è ${pq(String(x2), 'kPa')}. A quale temperatura, in gradi Celsius?`;
	return {
		prompt: 'Trova la temperatura finale.',
		problem: textBlock(text),
		solution: `t_2 = ${t2}\\,^\\circ\\text{C}`,
		steps: [
			t(`La ${what} è proporzionale alla temperatura assoluta: T1 = ${t1} + 273 = ${T1} K.`),
			`T_2 = T_1 \\cdot \\dfrac{${charles ? 'V_2' : 'p_2'}}{${charles ? 'V_1' : 'p_1'}} = ${T1}\\,\\text{K} \\cdot \\dfrac{${x2}}{${x1}} = ${T2}\\,\\text{K} \\qquad t_2 = ${T2} - 273 = ${t2}\\,^\\circ\\text{C}`,
		],
		// the kelvin written as degrees Celsius; the Celsius temperature in the proportion; the ratio upside down
		answer: intAnswer(rng, t2, [T2, Math.round((t1 * x2) / x1), Math.round((T1 * x1) / x2) - 273], 'C', [t2 + 10, t2 - 10, t2 + 20]),
		params: { case: charles ? 'charles' : 'gay-lussac', u, x1, x2, t1 },
	};
}

// ---------------------------------------------------------------------------
// Level 5: from the V-T graph

const LINES = [
	{ c: 0.0025, Ts: [200, 400, 600] },
	{ c: 0.005, Ts: [100, 200, 300, 400, 500, 600] },
	{ c: 0.0075, Ts: [200, 400, 600] },
	{ c: 0.01, Ts: [100, 150, 200, 250, 300, 350, 400, 450, 500] },
];

function level5(rng: Rng): Built {
	const L = rng.pick(LINES);
	const shown = (L.Ts.length > 3 ? shuffle(rng, L.Ts).slice(0, 3) : L.Ts).sort((a, b) => a - b);
	const pts = shown.map((T) => [T, Math.round(L.c * T * 1000) / 1000] as [number, number]);
	const Ts = rng.int(3, 13) * 50;
	if (shown.includes(Ts)) throw new Error('retry');
	const ts = Ts - 273;
	const exact = L.c * Ts;
	const ans = sig(exact, 3);
	if (!ans || Math.abs(ts) < 5) throw new Error('retry');
	const [Ta, Va] = pts[0];
	const vMax = Math.max(L.c * 650, ...pts.map((q) => q[1]));
	return {
		prompt: 'Leggi il grafico e trova il volume.',
		problem: textBlock(`Il grafico mostra il volume di una quantità fissa di gas in funzione della temperatura assoluta, a pressione costante. Quale volume ha il gas a ${pq(String(ts), 'C')}?`),
		solution: `V \\approx ${ans.tex}\\,\\text{L}`,
		steps: [
			textBlock(`Dal grafico, a $${Ta}\\,\\text{K}$ il volume è $${tex(String(Va))}\\,\\text{L}$. La temperatura data va in kelvin: $T = ${ts} + 273 = ${Ts}\\,\\text{K}$.`),
			`V = ${tex(String(Va))}\\,\\text{L} \\cdot \\dfrac{${Ts}\\,\\text{K}}{${Ta}\\,\\text{K}} \\approx ${ans.tex}\\,\\text{L}`,
		],
		// the Celsius temperature read on the kelvin axis; the ratio upside down; 273 added twice
		answer: answerOf(rng, ans, exact, [L.c * Math.abs(ts), (Va * Ta) / Ts, L.c * (Ts + 273)], 3, 'L'),
		params: { case: 'grafico', c: L.c, T: Ts },
		scene: {
			type: 'grafico-dati',
			data: {
				x: { nome: 'T', unita: 'K', passo: 50, celle: 14, etichette: 2 },
				y: { nome: 'V', unita: 'L', passo: 0.5, celle: Math.ceil(vMax / 0.5) + 1, etichette: 2 },
				punti: pts,
				linea: { tipo: 'retta', m: L.c, q: 0 },
			},
			alt: `Grafico del volume in funzione della temperatura assoluta: i punti ${pts.map((q) => `(${q[0]} K; ${String(q[1]).replace('.', ',')} L)`).join(', ')} stanno su una retta che passa per l'origine.`,
		},
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimLeggeCharlesGayLussac: Generator = {
	id: ID,
	title: 'Le leggi di Charles e di Gay-Lussac',
	levels: {
		1: { label: 'Charles, in kelvin', constraints: ['pressione costante', 'temperature in kelvin'] },
		2: { label: 'Charles, in gradi Celsius', constraints: ['temperature da portare in kelvin', 'tre cifre significative'] },
		3: { label: 'Gay-Lussac', constraints: ['recipiente rigido', 'temperature in gradi Celsius'] },
		4: { label: 'La temperatura finale', constraints: ['risultato in gradi Celsius'] },
		5: { label: 'Dal grafico volume-temperatura', constraints: ['scena grafico-dati', 'temperatura data in gradi Celsius'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimLeggeCharlesGayLussac;
