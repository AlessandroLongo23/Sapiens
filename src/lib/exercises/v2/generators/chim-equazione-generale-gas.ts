/**
 * L'equazione generale dei gas. Spec: specs/exercises/chim-equazione-generale-gas.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/33-chim-equazione-generale-gas.md), each one step
 * harder: which law describes a situation (Boyle, Charles, Gay-Lussac, or the general equation when everything
 * changes); the final volume when pressure and temperature both change, in kelvin; the final pressure with the
 * temperatures in degrees Celsius and the volumes in litres and millilitres; the final temperature, to the degree
 * Celsius; a volume brought to normal conditions (0 °C, 1 atm). Distractors from the lesson's warnings: a ratio upside
 * down, the Celsius temperatures, a unit not converted, the kelvin written as degrees Celsius.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, answerOf, checkChoice, choiceOf, dec, generateWith, intAnswer, pq, pqs, sig, t, tex, textBlock, wordsOpt } from '../chim-gas';

export const ID = 'chim-equazione-generale-gas';

function d3(rng: Rng, lo: number, hi: number, d: number): string {
	for (;;) {
		const k = rng.int(lo, hi);
		if (d > 0 || k % 10) return dec(k, d);
	}
}

// ---------------------------------------------------------------------------
// Level 1: which law

export const LAWS = { boyle: 'Legge di Boyle', charles: 'Legge di Charles', gay: 'Legge di Gay-Lussac', generale: 'Equazione generale dei gas' } as const;
type Law = keyof typeof LAWS;

/** Situations: the law, and the sentence with numbers drawn for it. */
function situations(rng: Rng): { law: Law; text: string }[] {
	const [a, b] = [rng.int(2, 9), rng.int(10, 30)];
	const [t1, t2] = [rng.int(10, 30), rng.int(40, 90)];
	const h = rng.int(2, 8) * 5;
	const tf = -rng.int(5, 25);
	return [
		{ law: 'boyle', text: `Lo stantuffo di una siringa tappata viene spinto piano piano, e l'aria dentro resta a ${pq(String(t1), 'C')}.` },
		{ law: 'boyle', text: `Un sub espira una bolla d'aria a $${h}\\,\\text{m}$ di profondità, e l'acqua ha la stessa temperatura dal fondo alla superficie.` },
		{ law: 'boyle', text: `Un gas in un cilindro immerso in una grande vasca d'acqua viene compresso lentamente da ${pq(String(b), 'L')} a ${pq(String(a), 'L')}.` },
		{ law: 'charles', text: `Un palloncino gonfio viene messo in un congelatore a ${pq(String(tf), 'C')}.` },
		{ law: 'charles', text: `Un gas in un cilindro chiuso da un pistone libero di scorrere viene scaldato da ${pq(String(t1), 'C')} a ${pq(String(t2), 'C')}.` },
		{ law: 'charles', text: "L'aria dentro una mongolfiera, aperta in basso verso l'atmosfera, viene scaldata dal bruciatore." },
		{ law: 'gay', text: `Una bombola di gas lasciata al sole si scalda da ${pq(String(t1), 'C')} a ${pq(String(t2), 'C')}.` },
		{ law: 'gay', text: 'Una bomboletta spray chiusa finisce nel fuoco.' },
		{ law: 'gay', text: `La gomma di un'auto si scalda da ${pq(String(t1), 'C')} a ${pq(String(t2), 'C')} durante un viaggio, senza cambiare volume.` },
		{ law: 'generale', text: "Un pallone sonda sale nell'atmosfera: la pressione e la temperatura dell'aria intorno diminuiscono." },
		{ law: 'generale', text: `Un gas viene compresso da ${pq(String(b), 'L')} a ${pq(String(a), 'L')} e intanto si scalda da ${pq(String(t1), 'C')} a ${pq(String(t2), 'C')}.` },
		{ law: 'generale', text: "Una bolla sale dal fondo freddo di un lago verso la superficie, dove l'acqua è più calda." },
	];
}

function level1(rng: Rng): Built {
	const s = rng.pick(situations(rng));
	const why: Record<Law, string> = {
		boyle: 'La temperatura resta costante, e cambiano pressione e volume: è la legge di Boyle.',
		charles: 'La pressione resta costante (il gas può espandersi o contrarsi), e cambiano volume e temperatura: è la legge di Charles.',
		gay: 'Il volume resta costante (il recipiente è rigido), e cambiano pressione e temperatura: è la legge di Gay-Lussac.',
		generale: "Cambiano pressione, volume e temperatura tutti e tre: serve l'equazione generale dei gas.",
	};
	const opts = (Object.keys(LAWS) as Law[]).map((k) => wordsOpt(LAWS[k], k));
	const right = opts.find((o) => o.values[0] === s.law)!;
	const answer = choiceOf(rng, right, opts.filter((o) => o !== right));
	return {
		prompt: 'Scegli la legge.',
		problem: textBlock(`${s.text} Quale legge descrive come cambia il gas?`),
		solution: right.latex,
		steps: [textBlock(why[s.law])],
		answer,
		params: { case: s.law, text: s.text },
	};
}

// ---------------------------------------------------------------------------
// Level 2: everything changes

function level2(rng: Rng): Built {
	const V1 = d3(rng, 100, 999, 2);
	const p1 = d3(rng, 100, 500, 2), p2 = d3(rng, 100, 500, 2);
	const T1 = rng.int(250, 400), T2 = rng.int(200, 600);
	if (p1 === p2 || Math.abs(T1 - T2) < 20) throw new Error('retry');
	const A = Number(V1), P1 = Number(p1), P2 = Number(p2);
	const exact = (P1 * A * T2) / (T1 * P2);
	const ans = sig(exact, 3);
	if (!ans) throw new Error('retry');
	return {
		prompt: 'Trova il volume finale.',
		problem: textBlock(`Un gas occupa ${pqs(V1, 'L')} a ${pqs(p1, 'atm')} e ${pq(String(T1), 'K')}. Viene portato a ${pqs(p2, 'atm')} e ${pq(String(T2), 'K')}. Quale volume occupa?`),
		solution: `V_2 \\approx ${ans.tex}\\,\\text{L}`,
		steps: [
			t("Dall'equazione generale dei gas si ricava il volume finale:"),
			`V_2 = \\dfrac{p_1\\,V_1\\,T_2}{T_1\\,p_2} = \\dfrac{${tex(p1)} \\cdot ${tex(V1)} \\cdot ${T2}}{${T1} \\cdot ${tex(p2)}}\\,\\text{L} = ${tex(exact.toFixed(4))}\\ldots\\,\\text{L} \\approx ${ans.tex}\\,\\text{L}`,
		],
		// the pressures upside down; the temperatures upside down; both upside down
		answer: answerOf(rng, ans, exact, [(P2 * A * T2) / (T1 * P1), (P1 * A * T1) / (T2 * P2), (P2 * A * T1) / (T2 * P1)], 3, 'L'),
		params: { case: 'volume', V1, p1, p2, T1, T2 },
	};
}

// ---------------------------------------------------------------------------
// Level 3: degrees Celsius and different units

function level3(rng: Rng): Built {
	const V1 = d3(rng, 100, 999, 2); // L
	const V2 = d3(rng, 101, 999, 0); // mL
	const p1 = d3(rng, 101, 299, 0); // kPa
	const t1 = rng.int(-20, 60), t2 = rng.int(-20, 200);
	if (Math.abs(t1) < 5 || Math.abs(t2) < 5 || Math.abs(t1 - t2) < 10) throw new Error('retry');
	const T1 = t1 + 273, T2 = t2 + 273;
	const A = Number(V1), B = Number(V2) / 1000, P1 = Number(p1);
	const exact = (P1 * A * T2) / (T1 * B);
	const ans = sig(exact, 3);
	if (!ans || exact > 9999) throw new Error('retry');
	return {
		prompt: 'Trova la pressione finale.',
		problem: textBlock(`Un gas occupa ${pqs(V1, 'L')} a ${pq(p1, 'kPa')} e ${pq(String(t1), 'C')}. Viene compresso fino a ${pq(V2, 'mL')} e portato a ${pq(String(t2), 'C')}. Quale pressione ha?`),
		solution: `p_2 \\approx ${ans.tex}\\,\\text{kPa}`,
		steps: [
			textBlock(`Le temperature in kelvin: $T_1 = ${T1}\\,\\text{K}$, $T_2 = ${T2}\\,\\text{K}$. Il volume finale in litri: $${V2}\\,\\text{mL} = ${tex(B.toFixed(3))}\\,\\text{L}$.`),
			`p_2 = \\dfrac{p_1\\,V_1\\,T_2}{T_1\\,V_2} = \\dfrac{${p1} \\cdot ${tex(V1)} \\cdot ${T2}}{${T1} \\cdot ${tex(B.toFixed(3))}}\\,\\text{kPa} \\approx ${ans.tex}\\,\\text{kPa}`,
		],
		// the Celsius temperatures; millilitres and litres mixed; the temperatures upside down
		answer: answerOf(rng, ans, exact, [(P1 * A * t2) / (t1 * B), (P1 * A * T2) / (T1 * Number(V2)), (P1 * A * T1) / (T2 * B)], 3, 'kPa'),
		params: { case: 'pressione', V1, V2, p1, t1, t2 },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the final temperature

function level4(rng: Rng): Built {
	const p1 = d3(rng, 100, 300, 2), p2 = d3(rng, 100, 500, 2);
	const V1 = d3(rng, 100, 999, 2), V2 = d3(rng, 100, 999, 2);
	const t1 = rng.int(-20, 60);
	const T1 = t1 + 273;
	const r = (Number(p2) * Number(V2)) / (Number(p1) * Number(V1));
	const T2 = T1 * r;
	const frac = T2 - Math.floor(T2);
	if (Math.abs(t1) < 5 || T2 < 200 || T2 > 900 || Math.abs(frac - 0.5) < 0.05 || Math.abs(T2 - T1) < 30) throw new Error('retry');
	const T2r = Math.round(T2);
	const t2 = T2r - 273;
	if (Math.abs(t2) < 5) throw new Error('retry');
	return {
		prompt: 'Trova la temperatura finale.',
		problem: textBlock(`Un gas occupa ${pqs(V1, 'L')} a ${pqs(p1, 'atm')} e ${pq(String(t1), 'C')}. Dopo una trasformazione occupa ${pqs(V2, 'L')} alla pressione di ${pqs(p2, 'atm')}. Quale temperatura ha, al grado Celsius?`),
		solution: `t_2 \\approx ${t2}\\,^\\circ\\text{C}`,
		steps: [
			t("Dall'equazione generale, con la temperatura iniziale in kelvin:"),
			`T_2 = T_1 \\cdot \\dfrac{p_2\\,V_2}{p_1\\,V_1} = ${T1}\\,\\text{K} \\cdot \\dfrac{${tex(p2)} \\cdot ${tex(V2)}}{${tex(p1)} \\cdot ${tex(V1)}} = ${tex(T2.toFixed(1))}\\ldots\\,\\text{K} \\approx ${T2r}\\,\\text{K}`,
			`t_2 = ${T2r} - 273 = ${t2}\\,^\\circ\\text{C}`,
		],
		// the kelvin written as Celsius; the Celsius temperature in the proportion; the ratio upside down
		answer: intAnswer(rng, t2, [T2r, Math.round(t1 * r), Math.round(T1 / r) - 273], 'C', [t2 + 10, t2 - 10, t2 + 20]),
		params: { case: 'temperatura', p1, p2, V1, V2, t1 },
	};
}

// ---------------------------------------------------------------------------
// Level 5: normal conditions

function level5(rng: Rng): Built {
	const mm = rng.next() < 0.5;
	const V1 = d3(rng, 101, 999, 0); // mL
	const p1 = mm ? String(rng.int(700, 800)) : d3(rng, 900, 1100, 1);
	if (mm && Number(p1) % 10 === 0) throw new Error('retry');
	const t1 = rng.int(10, 40);
	const T1 = t1 + 273;
	const P = Number(p1), A = Number(V1);
	const pn = mm ? 760 : 101.3;
	const exact = (P * A * 273) / (T1 * pn);
	const ans = sig(exact, 3);
	if (!ans) throw new Error('retry');
	const u = mm ? 'mmHg' : 'kPa';
	return {
		prompt: 'Riporta il volume a condizioni normali.',
		problem: textBlock(`Si raccolgono ${pq(V1, 'mL')} di un gas a ${pq(String(t1), 'C')} e alla pressione di ${pqs(p1, u)}. Quale volume occuperebbe lo stesso gas in condizioni normali ($0\\,^\\circ\\text{C}$ e $1\\,\\text{atm}$)?`),
		solution: `V_0 \\approx ${ans.tex}\\,\\text{mL}`,
		steps: [
			textBlock(`In condizioni normali $T_2 = 273\\,\\text{K}$ e $p_2 = 1\\,\\text{atm} = ${mm ? '760\\,\\text{mmHg}' : '101{,}3\\,\\text{kPa}'}$; all'inizio $T_1 = ${T1}\\,\\text{K}$.`),
			`V_2 = \\dfrac{p_1\\,V_1\\,T_2}{T_1\\,p_2} = \\dfrac{${tex(p1)} \\cdot ${V1} \\cdot 273}{${T1} \\cdot ${mm ? '760' : '101{,}3'}}\\,\\text{mL} = ${tex(exact.toFixed(2))}\\ldots\\,\\text{mL} \\approx ${ans.tex}\\,\\text{mL}`,
		],
		// the temperature forgotten; the temperatures upside down; the pressures upside down
		answer: answerOf(rng, ans, exact, [(P * A) / pn, (P * A * T1) / (273 * pn), (pn * A * 273) / (T1 * P)], 3, 'mL'),
		params: { case: u, V1, p1, t1 },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimEquazioneGeneraleGas: Generator = {
	id: ID,
	title: "L'equazione generale dei gas",
	levels: {
		1: { label: 'Quale legge', constraints: ['situazioni da riconoscere', 'Boyle, Charles, Gay-Lussac o equazione generale'] },
		2: { label: 'Cambia tutto', constraints: ['temperature in kelvin', 'tre cifre significative'] },
		3: { label: 'Gradi Celsius e millilitri', constraints: ['temperature da portare in kelvin', 'volumi in L e mL'] },
		4: { label: 'La temperatura finale', constraints: ['risultato al grado Celsius'] },
		5: { label: 'Le condizioni normali', constraints: ['0 °C e 1 atm', 'pressione in mmHg o kPa'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimEquazioneGeneraleGas;
