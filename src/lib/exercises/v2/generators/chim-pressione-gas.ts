/**
 * La pressione dei gas. Spec: specs/exercises/chim-pressione-gas.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/30-chim-pressione-gas.md), each one step harder: a
 * pressure from one unit to another (atm, mmHg, kPa); from millimetres of mercury to kilopascal or back, through the
 * atmosphere; the force of a gas on a piston, or the pressure from a force, with the area in square centimetres; the
 * reading of an open-tube manometer (scene `manometro-aperto`); the absolute pressure from a gauge that reads the
 * relative one. Distractors from the lesson's warnings: multiplying instead of dividing, the wrong factor (760 for
 * 101,3), a conversion forgotten, the difference in height added the wrong way, the atmospheric pressure forgotten.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, answerOf, checkChoice, dec, generateWith, intAnswer, pq, pqs, sig, t, tex, textBlock, two } from '../chim-gas';

export const ID = 'chim-pressione-gas';

/** A datum with three significant figures from lo to hi units of 10^-d, without a trailing zero when d = 0. */
function d3(rng: Rng, lo: number, hi: number, d: number): string {
	for (;;) {
		const k = rng.int(lo, hi);
		if (d > 0 || k % 10) return dec(k, d);
	}
}

// ---------------------------------------------------------------------------
// Level 1: one unit to another

function level1(rng: Rng): Built {
	const c = rng.pick(['atm-mmHg', 'mmHg-atm', 'atm-kPa', 'kPa-atm'] as const);
	const [from, to] = c.split('-') as ['atm' | 'mmHg' | 'kPa', 'atm' | 'mmHg' | 'kPa'];
	const x = from === 'atm' ? (to === 'mmHg' ? d3(rng, 100, 999, 3) : d3(rng, 100, 980, 2)) : d3(rng, 101, 999, 0);
	const X = Number(x);
	const f = to === 'mmHg' || from === 'mmHg' ? 760 : 101.3;
	const exact = from === 'atm' ? X * f : X / f;
	const ans = sig(exact, 3);
	if (!ans) throw new Error('retry');
	const F = f === 760 ? '760' : '101{,}3';
	const mistakes = from === 'atm' ? [X / f, X * (f === 760 ? 101.3 : 760), X * f * 10] : [X * f, X / (f === 760 ? 101.3 : 760), X / (f * 10)];
	return {
		prompt: 'Cambia unità di misura.',
		problem: textBlock(`Un gas ha la pressione di ${pqs(x, from)}. Quanto vale la sua pressione in ${to === 'atm' ? 'atmosfere' : to === 'mmHg' ? 'millimetri di mercurio' : 'kilopascal'}?`),
		solution: `p \\approx ${ans.tex}\\,\\text{${to}}`,
		steps: [
			t(`Un'atmosfera vale ${F === '760' ? '760 mmHg' : '101,3 kPa'}: ${from === 'atm' ? 'dalle atmosfere si moltiplica' : 'per avere le atmosfere si divide'}.`),
			from === 'atm' ? `p = ${tex(x)} \\cdot ${F}\\,\\text{${to}} \\approx ${ans.tex}\\,\\text{${to}}` : `p = \\dfrac{${tex(x)}}{${F}}\\,\\text{atm} \\approx ${ans.tex}\\,\\text{atm}`,
		],
		// divided instead of multiplied (or the other way); the other factor; a decimal slip (76 or 1013)
		answer: answerOf(rng, ans, exact, mistakes, 3, to),
		params: { case: c, x },
	};
}

// ---------------------------------------------------------------------------
// Level 2: millimetres of mercury and kilopascal

function level2(rng: Rng): Built {
	const toKPa = rng.next() < 0.5;
	const x = toKPa ? d3(rng, 101, 999, 0) : d3(rng, 110, 999, 1);
	const X = Number(x);
	const exact = toKPa ? (X * 101.3) / 760 : (X * 760) / 101.3;
	const ans = sig(exact, 3);
	if (!ans) throw new Error('retry');
	const to = toKPa ? 'kPa' : 'mmHg';
	return {
		prompt: 'Cambia unità di misura.',
		problem: textBlock(`Un manometro segna ${pqs(x, toKPa ? 'mmHg' : 'kPa')}. Quanto vale la pressione in ${toKPa ? 'kilopascal' : 'millimetri di mercurio'}?`),
		solution: `p \\approx ${ans.tex}\\,\\text{${to}}`,
		steps: [
			t("Si passa dalle atmosfere: 1 atm = 760 mmHg = 101,3 kPa."),
			toKPa
				? `p = \\dfrac{${tex(x)}}{760}\\,\\text{atm} = ${tex((X / 760).toFixed(4))}\\ldots\\,\\text{atm} = ${tex((X / 760).toFixed(4))}\\ldots \\cdot 101{,}3\\,\\text{kPa} \\approx ${ans.tex}\\,\\text{kPa}`
				: `p = \\dfrac{${tex(x)}}{101{,}3}\\,\\text{atm} = ${tex((X / 101.3).toFixed(4))}\\ldots\\,\\text{atm} = ${tex((X / 101.3).toFixed(4))}\\ldots \\cdot 760\\,\\text{mmHg} \\approx ${ans.tex}\\,\\text{mmHg}`,
		],
		// stopped at the atmospheres; the two factors swapped; one factor only, the wrong way
		answer: answerOf(rng, ans, exact, toKPa ? [X / 760, (X * 760) / 101.3, X * 101.3] : [X / 101.3, (X * 101.3) / 760, X * 760], 3, to),
		params: { case: toKPa ? 'mmHg-kPa' : 'kPa-mmHg', x },
	};
}

// ---------------------------------------------------------------------------
// Level 3: force and pressure on a piston

function level3(rng: Rng): Built {
	const S = String(rng.int(11, 99));
	if (Number(S) % 10 === 0) throw new Error('retry');
	if (rng.next() < 0.5) {
		const p = two(rng);
		const exact = Number(p) * 101300 * Number(S) * 1e-4;
		const ans = sig(exact, 2);
		if (!ans) throw new Error('retry');
		return {
			prompt: 'Trova la forza sul pistone.',
			problem: textBlock(`Un gas chiuso in un cilindro ha la pressione di ${pqs(p, 'atm')}. Con quale forza spinge sul pistone, che ha l'area di ${pq(S, 'cm2')}?`),
			solution: `F \\approx ${ans.tex}\\,\\text{N}`,
			steps: [
				textBlock('In unità del Sistema Internazionale: $1\\,\\text{atm} = 101\\,300\\,\\text{Pa}$ e $1\\,\\text{cm}^2 = 10^{-4}\\,\\text{m}^2$.'),
				`F = p \\cdot S = ${tex(p)} \\cdot 101\\,300\\,\\text{Pa} \\cdot ${S} \\cdot 10^{-4}\\,\\text{m}^2 = ${tex(exact.toFixed(1))}\\,\\text{N} \\approx ${ans.tex}\\,\\text{N}`,
			],
			// the area left in cm²; cm² converted like cm (10^-2); the pressure left in atm
			answer: answerOf(rng, ans, exact, [Number(p) * 101300 * Number(S), Number(p) * 101300 * Number(S) * 1e-2, Number(p) * Number(S) * 1e-4], 2, 'N'),
			params: { case: 'forza', p, S },
		};
	}
	const k = rng.int(11, 99);
	if (k % 10 === 0) throw new Error('retry');
	const e = rng.int(1, 2);
	const Fv = (k / 10) * 10 ** e;
	const exact = Fv / (Number(S) * 1e-4) / 1000; // kPa
	const ans = sig(exact, 2);
	if (!ans) throw new Error('retry');
	const Ftex = `${tex(dec(k, 1))} \\cdot 10^{${e}}`;
	return {
		prompt: 'Trova la pressione del gas.',
		problem: textBlock(`Un gas spinge sul pistone di un cilindro, che ha l'area di ${pq(S, 'cm2')}, con la forza di $${Ftex}\\,\\text{N}$. Quanto vale la pressione del gas, in kilopascal?`),
		solution: `p \\approx ${ans.tex}\\,\\text{kPa}`,
		steps: [
			textBlock("L'area va in metri quadrati: $1\\,\\text{cm}^2 = 10^{-4}\\,\\text{m}^2$."),
			`p = \\dfrac{F}{S} = \\dfrac{${Ftex}\\,\\text{N}}{${S} \\cdot 10^{-4}\\,\\text{m}^2} = ${tex(String(Math.round(exact * 1000)))}\\,\\text{Pa} \\approx ${ans.tex}\\,\\text{kPa}`,
		],
		// the area left in cm²; cm² converted like cm (10^-2); pascal read as kilopascal
		answer: answerOf(rng, ans, exact, [Fv / Number(S) / 1000, Fv / (Number(S) * 1e-2) / 1000, exact * 1000], 2, 'kPa'),
		params: { case: 'pressione', F: Fv, S },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the open-tube manometer

function level4(rng: Rng): Built {
	const p0 = rng.int(740, 775);
	const dh = rng.int(12, 250);
	const open = rng.next() < 0.5;
	const p = open ? p0 + dh : p0 - dh;
	const where = open ? 'nel ramo aperto' : 'nel ramo collegato al gas';
	return {
		prompt: 'Leggi il manometro.',
		problem: textBlock(`Un pallone di gas è collegato a un manometro a tubo aperto, come nella figura. La pressione atmosferica è ${pq(String(p0), 'mmHg')}, e il mercurio è $${dh}\\,\\text{mm}$ più in alto ${where}. Quanto vale la pressione del gas?`),
		solution: `p_{gas} = ${p}\\,\\text{mmHg}`,
		steps: [
			textBlock(open ? "Il mercurio sale dal lato dove la pressione è più bassa: qui dal lato dell'aria, quindi il gas preme più dell'aria e il dislivello si aggiunge." : "Il mercurio sale dal lato dove la pressione è più bassa: qui dal lato del gas, quindi il gas preme meno dell'aria e il dislivello si toglie."),
			`p_{gas} = p_0 ${open ? '+' : '-'} \\Delta h = ${p0} ${open ? '+' : '-'} ${dh} = ${p}\\,\\text{mmHg}`,
		],
		// the sign the wrong way; the difference alone; 760 in place of the barometer
		answer: intAnswer(rng, p, [open ? p0 - dh : p0 + dh, dh, open ? 760 + dh : 760 - dh], 'mmHg', [p + 10, p - 10, p + 20]),
		params: { case: open ? 'piu' : 'meno', p0, dh },
		scene: {
			type: 'manometro-aperto',
			data: { dislivello: dh, lato: open ? 'aperto' : 'gas', etichetta: `Δh = ${dh} mm` },
			alt: `Un pallone di gas collegato a un manometro a tubo aperto con il mercurio; il mercurio è ${dh} millimetri più in alto ${where}, e nel ramo aperto preme l'aria.`,
		},
	};
}

// ---------------------------------------------------------------------------
// Level 5: absolute and relative pressure

function level5(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const g = two(rng, 12, 38);
		const exact = (Number(g) + 1.0) * 100;
		const ans = sig(exact, 2);
		if (!ans) throw new Error('retry');
		return {
			prompt: 'Trova la pressione assoluta.',
			problem: textBlock(`Il manometro di un distributore segna ${pqs(g, 'bar')} per la gomma di una bicicletta: è la pressione relativa. La pressione atmosferica è ${pqs('1.0', 'bar')}. Quanto vale la pressione assoluta dell'aria nella gomma, in kilopascal?`),
			solution: `p \\approx ${ans.tex}\\,\\text{kPa}`,
			steps: [
				t('La pressione assoluta è la relativa più quella atmosferica; poi 1 bar = 100 kPa.'),
				`p = (${tex(g)} + 1{,}0)\\,\\text{bar} = ${tex((Number(g) + 1).toFixed(1))}\\,\\text{bar} = ${tex(String(Math.round(exact)))}\\,\\text{kPa} \\approx ${ans.tex}\\,\\text{kPa}`,
			],
			// the atmospheric pressure forgotten; subtracted; bar read as 1000 kPa
			answer: answerOf(rng, ans, exact, [Number(g) * 100, (Number(g) - 1) * 100, (Number(g) + 1) * 1000], 2, 'kPa'),
			params: { case: 'bar', g },
		};
	}
	const g = d3(rng, 110, 399, 0);
	const exact = (Number(g) + 101.3) / 101.3;
	const ans = sig(exact, 3);
	if (!ans) throw new Error('retry');
	return {
		prompt: 'Trova la pressione assoluta.',
		problem: textBlock(`Il manometro di una bombola segna ${pqs(g, 'kPa')}, la pressione relativa. La pressione atmosferica è ${pqs('101.3', 'kPa')}. Quanto vale la pressione assoluta del gas nella bombola, in atmosfere?`),
		solution: `p \\approx ${ans.tex}\\,\\text{atm}`,
		steps: [
			t('La pressione assoluta è la relativa più quella atmosferica; poi 1 atm = 101,3 kPa.'),
			`p = (${g} + 101{,}3)\\,\\text{kPa} = ${tex((Number(g) + 101.3).toFixed(1))}\\,\\text{kPa} = \\dfrac{${tex((Number(g) + 101.3).toFixed(1))}}{101{,}3}\\,\\text{atm} \\approx ${ans.tex}\\,\\text{atm}`,
		],
		// the atmospheric pressure forgotten; subtracted; divided by 760
		answer: answerOf(rng, ans, exact, [Number(g) / 101.3, (Number(g) - 101.3) / 101.3, (Number(g) + 101.3) / 760], 3, 'atm'),
		params: { case: 'kPa', g },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkChoice(sample);
}

export const chimPressioneGas: Generator = {
	id: ID,
	title: 'La pressione dei gas',
	levels: {
		1: { label: "Da un'unità all'altra", constraints: ['atm, mmHg, kPa', 'tre cifre significative'] },
		2: { label: 'Millimetri di mercurio e kilopascal', constraints: ["passando dall'atmosfera"] },
		3: { label: 'Forza e pressione sul pistone', constraints: ['area in centimetri quadrati', 'due cifre significative'] },
		4: { label: 'Il manometro a tubo aperto', constraints: ['dislivello da aggiungere o togliere', 'scena del manometro'] },
		5: { label: 'Pressione assoluta e relativa', constraints: ['si somma la pressione atmosferica', 'poi si cambia unità'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimPressioneGas;
