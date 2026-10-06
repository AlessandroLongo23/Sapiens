/**
 * Il tempo di dimezzamento. Spec: specs/exercises/chim-tempo-dimezzamento.md
 *
 * Six levels in the order of the lesson (docs/lezioni/chimica/riscritte/55-chim-tempo-dimezzamento.md), each one step
 * harder: how much is left after a whole number of half-lives; how long it takes to get down to a fraction; the
 * half-life from two masses and a time; how many half-lives have passed when the text gives what has decayed (a pure
 * number, also as an open answer); the percentage left after a time that is not a multiple of the half-life (an
 * exponential); the time from the percentage left (a logarithm), with carbon-14 dating.
 *
 * Real radioisotopes with the half-lives of the lesson's table and a few more (NUBASE2020, rounded as the lesson
 * does). Distractors from the lesson's warnings: a linear decay (the quantity divided by the number of half-lives,
 * everything gone after two), one halving too many or too few, the decayed part taken for the part left, the
 * denominator of the fraction taken for the number of half-lives.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Built, ambiguousZero, checkSample, choose, decTex, generateWith, intOpt, redraw, sig, some, texOpt, textBlock } from '../chim3-c';

export const ID = 'chim-tempo-dimezzamento';

interface Isotope {
	nome: string;
	/** The half-life, its unit (a plural noun) and its significant figures. */
	t: number;
	unit: 'anni' | 'giorni' | 'ore' | 'minuti';
	sf: number;
}

export const ISOTOPES: Isotope[] = [
	{ nome: 'idrogeno-3', t: 12.3, unit: 'anni', sf: 3 },
	{ nome: 'carbonio-14', t: 5730, unit: 'anni', sf: 3 },
	{ nome: 'fluoro-18', t: 110, unit: 'minuti', sf: 2 },
	{ nome: 'sodio-24', t: 15.0, unit: 'ore', sf: 3 },
	{ nome: 'fosforo-32', t: 14.3, unit: 'giorni', sf: 3 },
	{ nome: 'potassio-40', t: 1.25e9, unit: 'anni', sf: 3 },
	{ nome: 'cobalto-60', t: 5.27, unit: 'anni', sf: 3 },
	{ nome: 'stronzio-90', t: 28.9, unit: 'anni', sf: 3 },
	{ nome: 'tecnezio-99m', t: 6.0, unit: 'ore', sf: 2 },
	{ nome: 'iodio-131', t: 8.0, unit: 'giorni', sf: 2 },
	{ nome: 'cesio-137', t: 30, unit: 'anni', sf: 2 },
	{ nome: 'polonio-210', t: 138, unit: 'giorni', sf: 3 },
	{ nome: 'radon-222', t: 3.8, unit: 'giorni', sf: 2 },
	{ nome: 'radio-226', t: 1600, unit: 'anni', sf: 2 },
	{ nome: 'uranio-238', t: 4.5e9, unit: 'anni', sf: 2 },
];

/** "il cobalto-60", "lo iodio-131", "l'uranio-238". */
function withArticle(nome: string, cap = false): string {
	const art = /^io/.test(nome) || /^(z|x|s[^aeiou])/.test(nome) ? 'lo ' : /^[aeiou]/.test(nome) ? "l'" : 'il ';
	const s = art + nome;
	return cap ? s[0].toUpperCase() + s.slice(1) : s;
}
/** An exact decimal as the lessons write it: 10,54; 24; 3,75 · 10⁹ from 100 000 up. */
function exact(x: number): string {
	if (x >= 1e5) {
		const e = Math.floor(Math.log10(x) + 1e-9);
		return `${decTex(String(Number((x / 10 ** e).toPrecision(10))))} \\cdot 10^{${e}}`;
	}
	return decTex(String(Number(x.toPrecision(10))));
}
/** The half-life as the table gives it: its significant figures kept (8,0; 15,0). */
function halfLife(i: Isotope): string {
	if (i.t >= 1e5) return exact(i.t);
	const decimals = Math.max(0, i.sf - 1 - Math.floor(Math.log10(i.t)));
	return decTex(i.t.toFixed(decimals));
}
const withUnit = (tex: string, unit: string) => `${tex}\\,\\text{${unit}}`;
const timeOf = (i: Isotope) => `$${halfLife(i)}$ ${i.unit}`;

/** A time as an option, rounded to the isotope's significant figures; null on a tie. */
function timeOpt(x: number, i: Isotope, digits = i.sf): ChoiceOption | null {
	const s = sig(x, digits);
	return s ? texOpt(`${s.tex}\\ \\text{${i.unit}}`, s.value) : null;
}
/** The right time: also refused when it ends with a zero nobody can read. */
function rightTime(x: number, i: Isotope, digits = i.sf): ChoiceOption {
	const s = sig(x, digits);
	if (!s || ambiguousZero(s.value)) redraw();
	return texOpt(`${s.tex}\\ \\text{${i.unit}}`, s.value);
}

/** A quantity as an option: exact when it has at most four decimals, otherwise to three figures. */
function qtyOpt(x: number, unit: string): ChoiceOption | null {
	if (x <= 0) return null;
	const r = Number(x.toPrecision(10));
	if (Math.abs(r * 1e4 - Math.round(r * 1e4)) < 1e-6) return texOpt(withUnit(decTex(String(r)), unit), String(r));
	const s = sig(x, 3);
	return s ? texOpt(withUnit(s.tex, unit), s.value) : null;
}

const LEFT = [0.25, 0.75, 1.5, 2.5, 3.5, 4.5, 7.5, 1.2, 2.4, 3.6, 12, 15, 25];
const MASS_UNITS = ['mg', 'g'] as const;

// ---------------------------------------------------------------------------
// Level 1: how much is left

function level1(rng: Rng): Built {
	const iso = rng.pick(ISOTOPES);
	const n = rng.int(2, 5);
	const m = rng.pick(LEFT);
	const unit = rng.pick(MASS_UNITS);
	const m0 = m * 2 ** n;
	const t = n * iso.t;
	const halvings = Array.from({ length: n + 1 }, (_, k) => exact(m0 / 2 ** k)).join(' \\to ');
	return {
		prompt: 'Calcola quanto resta.',
		problem: textBlock(`Un campione contiene $${withUnit(exact(m0), unit)}$ di ${iso.nome}, che ha un tempo di dimezzamento di ${timeOf(iso)}. Quanto ${iso.nome} resta dopo $${exact(t)}$ ${iso.unit}?`),
		solution: withUnit(exact(m), unit),
		steps: [
			`n = \\dfrac{t}{t_{1/2}} = \\dfrac{${exact(t)}}{${halfLife(iso)}} = ${n}`,
			`m = m_0 \\cdot \\left(\\dfrac{1}{2}\\right)^{${n}} = \\dfrac{${exact(m0)}}{${2 ** n}}\\,\\text{${unit}} = ${withUnit(exact(m), unit)}`,
			textBlock(`Un dimezzamento alla volta: $${halvings}$.`),
		],
		// divided by the number of half-lives; by twice that number; one halving too few, one too many; the decayed part
		answer: choose(rng, qtyOpt(m, unit)!, some([qtyOpt(m0 / n, unit), qtyOpt(m0 / (2 * n), unit), qtyOpt(2 * m, unit), qtyOpt(m / 2, unit), qtyOpt(m0 - m, unit), qtyOpt(m0 / 2, unit)])),
		params: { case: 'resta', isotope: iso.nome, n },
	};
}

// ---------------------------------------------------------------------------
// Level 2: how long it takes

const FRACTION_WORDS: Record<number, string> = { 2: 'un quarto', 3: 'un ottavo', 4: 'un sedicesimo', 5: 'un trentaduesimo' };

function level2(rng: Rng): Built {
	const iso = rng.pick(ISOTOPES);
	const n = rng.int(2, 5);
	const byMass = rng.next() < 0.5;
	const m = rng.pick(LEFT);
	const unit = rng.pick(MASS_UNITS);
	const m0 = m * 2 ** n;
	const t = n * iso.t;
	const right = rightTime(t, iso);
	const question = byMass
		? `Dopo quanto tempo un campione di $${withUnit(exact(m0), unit)}$ si riduce a $${withUnit(exact(m), unit)}$?`
		: `Dopo quanto tempo un campione si riduce a ${FRACTION_WORDS[n]} della quantità iniziale?`;
	return {
		prompt: 'Calcola il tempo.',
		problem: textBlock(`${withArticle(iso.nome, true)} ha un tempo di dimezzamento di ${timeOf(iso)}. ${question}`),
		solution: right.latex,
		steps: [
			byMass ? `\\dfrac{m}{m_0} = \\dfrac{${exact(m)}}{${exact(m0)}} = \\dfrac{1}{${2 ** n}} = \\left(\\dfrac{1}{2}\\right)^{${n}}` : `\\dfrac{1}{${2 ** n}} = \\left(\\dfrac{1}{2}\\right)^{${n}}`,
			textBlock(`Sono passati $n = ${n}$ tempi di dimezzamento.`),
			`t = n \\cdot t_{1/2} = ${n} \\cdot ${halfLife(iso)}\\ \\text{${iso.unit}} = ${right.latex}`,
		],
		// the denominator taken for the number of half-lives; one too few; one too many; the half-life divided
		answer: choose(rng, right, some([timeOpt(2 ** n * iso.t, iso), timeOpt((n - 1) * iso.t, iso), timeOpt((n + 1) * iso.t, iso), timeOpt(iso.t / n, iso), timeOpt((2 ** n * iso.t) / 2, iso), timeOpt(2 * n * iso.t, iso)])),
		params: { case: byMass ? 'masse' : 'frazione', isotope: iso.nome, n },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the half-life

function level3(rng: Rng): Built {
	const iso = rng.pick(ISOTOPES);
	const n = rng.int(2, 5);
	const m = rng.pick(LEFT);
	const unit = rng.pick(MASS_UNITS);
	const m0 = m * 2 ** n;
	const t = n * iso.t;
	const right = rightTime(iso.t, iso);
	if (right.latex !== `${halfLife(iso)}\\ \\text{${iso.unit}}`) redraw();
	return {
		prompt: 'Trova il tempo di dimezzamento.',
		problem: textBlock(`Di $${withUnit(exact(m0), unit)}$ di un radioisotopo ne restano $${withUnit(exact(m), unit)}$ dopo $${exact(t)}$ ${iso.unit}. Quanto vale il suo tempo di dimezzamento?`),
		solution: right.latex,
		steps: [
			`\\dfrac{m}{m_0} = \\dfrac{${exact(m)}}{${exact(m0)}} = \\dfrac{1}{${2 ** n}} = \\left(\\dfrac{1}{2}\\right)^{${n}}`,
			textBlock(`Sono passati $n = ${n}$ tempi di dimezzamento.`),
			`t_{1/2} = \\dfrac{t}{n} = \\dfrac{${exact(t)}}{${n}}\\ \\text{${iso.unit}} = ${right.latex}`,
		],
		// the time divided by the denominator; by one halving fewer or more; by two; multiplied
		answer: choose(rng, right, some([timeOpt(t / 2 ** n, iso), timeOpt(t / (n - 1), iso), timeOpt(t / (n + 1), iso), timeOpt(t / 2, iso), timeOpt(t * n, iso), timeOpt(t / (2 * n), iso)])),
		params: { case: 'dimezzamento', isotope: iso.nome, n },
	};
}

// ---------------------------------------------------------------------------
// Level 4: decayed and left (a pure number)

const DECAYED_PERCENT: Record<number, string> = { 2: '75', 3: '87{,}5', 4: '93{,}75', 5: '96{,}875' };

function level4(rng: Rng): Built {
	const n = rng.int(2, 5);
	const asPercent = rng.next() < 0.5;
	const den = 2 ** n;
	const the = n === 3 ? "l'" : 'il '; // l'87,5%
	const problem = asPercent
		? `In un campione di un radioisotopo è decaduto ${the}$${DECAYED_PERCENT[n]}\\,\\%$ dei nuclei. Quanti tempi di dimezzamento sono passati?`
		: `In un campione di un radioisotopo sono decaduti i $\\frac{${den - 1}}{${den}}$ dei nuclei. Quanti tempi di dimezzamento sono passati?`;
	return {
		prompt: 'Conta i tempi di dimezzamento.',
		problem: textBlock(problem),
		solution: String(n),
		steps: [
			textBlock(asPercent ? `Se è decaduto ${the}$${DECAYED_PERCENT[n]}\\,\\%$, resta il $100\\,\\% - ${DECAYED_PERCENT[n]}\\,\\% = ${decTex(String(100 / den))}\\,\\%$ dei nuclei.` : `Se sono decaduti i $\\frac{${den - 1}}{${den}}$, resta $1 - \\frac{${den - 1}}{${den}} = \\frac{1}{${den}}$ dei nuclei.`),
			asPercent ? `\\dfrac{${decTex(String(100 / den))}}{100} = \\dfrac{1}{${den}} = \\left(\\dfrac{1}{2}\\right)^{${n}}` : `\\dfrac{1}{${den}} = \\left(\\dfrac{1}{2}\\right)^{${n}}`,
			textBlock(`Sono passati $${n}$ tempi di dimezzamento.`),
		],
		// one fewer (the decayed part read as the part left, roughly); one more; the denominator; the numerator
		answer: choose(rng, intOpt(n), [n - 1, n + 1, den, den - 1, n + 2].map(intOpt)),
		params: { case: asPercent ? 'percentuale' : 'frazione', n },
		open: String(n),
	};
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: a time that is not a multiple of the half-life

/** A percentage to two figures as an option; null on a tie, or outside 1-99. */
function pctOpt(x: number): ChoiceOption | null {
	if (!(x >= 1 && x < 99.5)) return null;
	const s = sig(x, 2);
	return s ? texOpt(`${s.tex}\\,\\%`, s.value) : null;
}

/** x to three figures for a step, or a redraw on a tie. */
function three(x: number): { tex: string; value: number } {
	const s = sig(x, 3);
	if (!s) redraw();
	return { tex: s.tex, value: Number(s.value) };
}

function level5(rng: Rng): Built {
	const iso = rng.pick(ISOTOPES);
	const k = 0.3 + rng.next() * 4.3;
	const tData = sig(iso.t * k, 2);
	if (!tData) redraw();
	const t = Number(tData.value);
	const n = t / iso.t;
	if (Math.abs(n - Math.round(n)) < 0.08) redraw();
	const p = 100 * 0.5 ** n;
	const right = pctOpt(p);
	if (!right || ambiguousZero(right.values[0])) redraw();
	// a student who rounds n to three figures must get the same answer
	const n3 = three(n);
	if (pctOpt(100 * 0.5 ** n3.value)?.latex !== right.latex) redraw();
	const fraction = three(0.5 ** n);
	return {
		prompt: 'Calcola la percentuale rimasta.',
		problem: textBlock(`${withArticle(iso.nome, true)} ha un tempo di dimezzamento di ${timeOf(iso)}. Quale percentuale di un campione resta dopo $${tData.tex}$ ${iso.unit}?`),
		solution: right.latex,
		steps: [
			`n = \\dfrac{t}{t_{1/2}} = \\dfrac{${tData.tex}}{${halfLife(iso)}} \\approx ${n3.tex}`,
			`\\dfrac{N}{N_0} = \\left(\\dfrac{1}{2}\\right)^{${n3.tex}} \\approx ${fraction.tex}`,
			textBlock(`Resta circa il $${right.latex}$ del campione.`),
		],
		// the decayed part; a linear decay (half of the sample every half-life); divided by twice the half-lives; the nearest whole number of halvings
		answer: choose(rng, right, some([pctOpt(100 - p), pctOpt(100 - 50 * n), pctOpt(100 / (2 * n)), pctOpt(100 * 0.5 ** Math.round(n)), pctOpt(100 * 0.5 ** Math.floor(n)), pctOpt(100 * 0.5 ** Math.ceil(n)), pctOpt(p / 2), pctOpt(Math.min(98, p * 2))])),
		params: { case: 'percentuale', isotope: iso.nome },
	};
}

const FINDS = ['un reperto di legno', 'un frammento di osso', 'un pezzo di carbone', 'un frammento di tessuto'];

function level6(rng: Rng): Built {
	const dating = rng.next() < 0.5;
	const iso = dating ? ISOTOPES.find((i) => i.nome === 'carbonio-14')! : rng.pick(ISOTOPES.filter((i) => i.nome !== 'carbonio-14'));
	const p = rng.int(4, 92);
	if ([50, 25].includes(p) || p % 10 === 0) redraw();
	const n = Math.log2(100 / p);
	const t = n * iso.t;
	const right = rightTime(t, iso, 2);
	const ratio = three(100 / p);
	const n3 = three(n);
	if (timeOpt(Math.log2(ratio.value) * iso.t, iso, 2)?.latex !== right.latex || timeOpt(n3.value * iso.t, iso, 2)?.latex !== right.latex) redraw();
	const problem = dating
		? `In ${rng.pick(FINDS)} la frazione di carbonio-14 è il $${p}\\,\\%$ di quella di un organismo vivo. Il carbonio-14 ha un tempo di dimezzamento di ${timeOf(iso)}. Qual è l'età del reperto?`
		: `${withArticle(iso.nome, true)} ha un tempo di dimezzamento di ${timeOf(iso)}. Dopo quanto tempo resta il $${p}\\,\\%$ di un campione?`;
	return {
		prompt: dating ? "Calcola l'età del reperto." : 'Calcola il tempo.',
		problem: textBlock(problem),
		solution: right.latex,
		steps: [
			`\\dfrac{N_0}{N} = \\dfrac{100}{${p}} \\approx ${ratio.tex}`,
			`n = \\log_2 ${ratio.tex} = \\dfrac{\\log ${ratio.tex}}{\\log 2} \\approx ${n3.tex}`,
			`t = n \\cdot t_{1/2} \\approx ${n3.tex} \\cdot ${halfLife(iso)}\\ \\text{${iso.unit}} \\approx ${right.latex}`,
		],
		// the decayed part in the logarithm; a linear decay; the logarithm in base ten; no logarithm at all
		answer: choose(
			rng,
			right,
			some([timeOpt(Math.log2(100 / (100 - p)) * iso.t, iso, 2), timeOpt(((100 - p) / 50) * iso.t, iso, 2), timeOpt(Math.log10(100 / p) * iso.t, iso, 2), timeOpt((100 / p) * iso.t, iso, 2), timeOpt((p / 100) * iso.t, iso, 2), timeOpt(2 * t, iso, 2), timeOpt(t / 2, iso, 2)]),
		),
		params: { case: dating ? 'carbonio' : 'sorgente', isotope: iso.nome, p },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkSample(sample);
}

export const chimTempoDimezzamento: Generator = {
	id: ID,
	title: 'Il tempo di dimezzamento',
	levels: {
		1: { label: 'Quanto resta', constraints: ['da 2 a 5 tempi di dimezzamento interi; la massa rimasta è esatta'] },
		2: { label: 'Quanto tempo serve', constraints: ['la frazione rimasta è una potenza di un mezzo, a parole o da due masse'] },
		3: { label: 'Il tempo di dimezzamento', constraints: ['dalle due masse e dal tempo, con un numero intero di dimezzamenti'] },
		4: { label: 'Rimasto e decaduto', constraints: ['il testo dà la parte decaduta, in percentuale o in frazione; risposta da 2 a 5'] },
		5: { label: 'Un tempo qualunque', constraints: ['tempo non multiplo del tempo di dimezzamento; percentuale rimasta a due cifre'] },
		6: { label: 'Il tempo dal logaritmo', constraints: ['dalla percentuale rimasta al tempo, a due cifre; metà delle volte una datazione con il carbonio-14'] },
	},
	generate: generateWith(ID, LEVELS, check),
	// a level answered with a number keeps its four options in the sample
	toChoice: (sample) => {
		if (sample.answer.kind === 'choice') return sample.answer;
		if (!sample.choice) throw new Error(`${ID}: the sample has no multiple-choice form`);
		return sample.choice;
	},
	check,
};

export default chimTempoDimezzamento;
