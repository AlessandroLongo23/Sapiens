/**
 * Numeri reali in virgola mobile. Spec: specs/exercises/inf-virgola-mobile.md
 *
 * Five levels in the order of the lesson (docs/lezioni/informatica/riscritte/09-inf-virgola-mobile.md): a binary
 * number with a comma read in base ten; a decimal number written in binary; which number has a finite binary
 * expansion; the exponent of the normalised scientific notation in base 2; the exponent field of the 32-bit
 * IEEE 754 format. Numbers are built backwards from their bits, so every expansion is finite.
 */
import type { ChoiceOption, Rng } from '../types';
import { type Built, chance, choose, decTex, defineGenerator, numberBuilt, ratStr, shuffle, textBlock, texOpt, tx } from '../inf-codifica';

export const ID = 'inf-virgola-mobile';

/** A binary number with a comma as the lessons write it: "101.011" -> 101{,}011_2. */
const binTex = (s: string) => `${s.replace('.', '{,}')}_2`;
const binOpt = (s: string): ChoiceOption => texOpt(binTex(s), s);

/** An integer part up to 15 and 1 to 4 fractional bits ending in 1. */
function drawFixed(rng: Rng): { int: number; frac: string; num: number; den: number } {
	const int = chance(rng, 0.25) ? 0 : rng.int(1, 15);
	const m = rng.int(1, 4);
	const f = 2 * rng.int(0, 2 ** (m - 1) - 1) + 1;
	return { int, frac: f.toString(2).padStart(m, '0'), num: int * 2 ** m + f, den: 2 ** m };
}

const WEIGHT = ['1', '\\frac{1}{2}', '\\frac{1}{4}', '\\frac{1}{8}', '\\frac{1}{16}'];

// ---------------------------------------------------------------------------
// Level 1: binary with a comma to decimal

function level1(rng: Rng): Built {
	const { int, frac, num, den } = drawFixed(rng);
	const m = frac.length;
	const f = parseInt(frac, 2);
	const s = `${int.toString(2)}.${frac}`;
	const fracTerms = [...frac].map((c, i) => (c === '1' ? WEIGHT[i + 1] : '')).filter(Boolean);
	const wrong: [number, number][] = [
		[int * 10 ** String(f).length + f, 10 ** String(f).length], // the fractional bits read as an integer: 101,011 -> 5,3
		[int * 2 ** (m - 1) + f, 2 ** (m - 1)], // weights starting from 1 instead of 1/2
		[int * 10 ** m + Number(frac), 10 ** m], // the fractional digits copied: 5,011
		[int * 2 ** (m + 1) + f, 2 ** (m + 1)],
		[int * den + parseInt([...frac].reverse().join(''), 2), den],
		[num + den, den],
	];
	return numberBuilt(
		{
			prompt: 'Scrivi il numero in base dieci.',
			problem: textBlock('Quanto vale in base dieci questo numero binario?', [binTex(s)]),
			steps: [
				tx(`Parte intera: $${int.toString(2)}_2 = ${int}$.`),
				tx(`Dopo la virgola i pesi sono $\\frac{1}{2}$, $\\frac{1}{4}$, $\\frac{1}{8}$, $\\frac{1}{16}$: ${m === 1 ? 'la cifra' : 'le cifre'} $${frac}$ ${m === 1 ? 'vale' : 'valgono'} $${fracTerms.join(' + ')} = ${decTex(f, den)}$.`),
				tx(`Il numero è $${int} + ${decTex(f, den)} = ${decTex(num, den)}$.`),
			],
			params: { bin: s },
		},
		num,
		den,
		wrong,
	);
}

// ---------------------------------------------------------------------------
// Level 2: decimal to binary with a comma

function level2(rng: Rng): Built {
	const { int, frac, num, den } = drawFixed(rng);
	const f = parseInt(frac, 2);
	const ib = int.toString(2);
	const right = `${ib}.${frac}`;
	const decimals = decTex(f, den).split('{,}')[1];
	const wrong = [
		`${ib}.${[...frac].reverse().join('')}`,
		`${ib}.${Number(decimals).toString(2)}`, // the digits after the comma converted as an integer
		`${ib}.0${frac}`,
		`${ib}.${frac.slice(1)}1`,
		`${(int + 1).toString(2)}.${frac}`,
		`${ib}.${frac}1`,
	].filter((w) => !w.endsWith('.'));
	// the multiplications by 2, one per bit
	const lines: string[] = [];
	let r = f;
	for (let i = 0; i < frac.length; i++) {
		const doubled = 2 * r;
		const bit = doubled >= den ? 1 : 0;
		lines.push(`${decTex(r, den)} \\cdot 2 = ${decTex(doubled, den)} \\to ${bit}`);
		r = doubled - bit * den;
	}
	return {
		prompt: 'Scegli la scrittura in base due.',
		problem: textBlock(`Come si scrive $${decTex(num, den)}$ in base due?`),
		solution: binTex(right),
		steps: [
			tx(`Parte intera: $${int} = ${ib}_2$.`),
			tx(`Parte dopo la virgola: moltiplica per $2$ e prendi ogni volta la parte intera. $${lines.join(';\\ ')}$.`),
			tx(`Le cifre trovate, nell'ordine, sono $${frac}$: il numero è $${binTex(right)}$.`),
		],
		answer: choose(rng, binOpt(right), wrong.map(binOpt)),
		params: { value: ratStr(num, den) },
	};
}

// ---------------------------------------------------------------------------
// Level 3: finite or not in binary

/** Hundredths whose fraction in lowest terms has a denominator that is not a power of two. */
const NOT_FINITE = [10, 20, 30, 40, 60, 70, 80, 90, 5, 15, 35, 45, 55, 65, 85, 95, 1, 2, 4, 8, 12, 24, 36, 48, 64, 72, 96];
/** Sixteenths with an odd numerator, plus 1/2, 1/4, 3/4 and the eighths. */
const FINITE: [number, number][] = [
	[1, 2],
	[1, 4],
	[3, 4],
	[1, 8],
	[3, 8],
	[5, 8],
	[7, 8],
	[1, 16],
	[3, 16],
	[5, 16],
	[7, 16],
	[9, 16],
	[11, 16],
	[13, 16],
	[15, 16],
];

function level3(rng: Rng): Built {
	const wantFinite = chance(rng, 0.5);
	const withInt = (pair: [number, number]): [number, number] => {
		const int = chance(rng, 0.5) ? 0 : rng.int(1, 12);
		return [int * pair[1] + pair[0], pair[1]];
	};
	const finite = shuffle(rng, FINITE).map(withInt);
	const notFinite = shuffle(rng, NOT_FINITE).map((h) => withInt([h, 100]));
	const [right, others] = wantFinite ? [finite[0], notFinite.slice(0, 3)] : [notFinite[0], finite.slice(0, 3)];
	const opt = ([p, q]: [number, number]) => texOpt(decTex(p, q), ratStr(p, q));
	const frac = ([p, q]: [number, number]) => {
		const [a, b] = ratStr(p, q).split('/');
		return `${decTex(p, q)} = \\frac{${a}}{${b ?? 1}}`;
	};
	return {
		prompt: 'Scegli il numero.',
		problem: textBlock(
			wantFinite
				? 'Quale di questi numeri si scrive in base due con un numero finito di cifre dopo la virgola?'
				: 'Quale di questi numeri in base due ha infinite cifre dopo la virgola, e in virgola mobile viene arrotondato?',
		),
		solution: decTex(right[0], right[1]),
		steps: [
			tx('Un numero ha un numero finito di cifre binarie dopo la virgola solo se, scritto come frazione ridotta ai minimi termini, ha per denominatore una potenza di $2$.'),
			tx(`$${frac(right)}$: il denominatore ${wantFinite ? 'è' : 'non è'} una potenza di $2$.`),
			tx(`Gli altri: $${others.map(frac).join(';\\ ')}$.`),
		],
		answer: choose(rng, opt(right), others.map(opt)),
		params: { case: wantFinite ? 'finito' : 'infinito' },
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: normalised notation, the exponent field

/** A mantissa 1,… of 2 to 6 bits ending in 1, an exponent from -6 to 7 (not 0), and the number written without the power. */
function drawFloat(rng: Rng): { digits: string; e: number; plain: string } {
	const len = rng.int(2, 6);
	const middle = len > 2 ? rng.int(0, 2 ** (len - 2) - 1).toString(2).padStart(len - 2, '0') : '';
	const digits = `1${middle}1`;
	let e = rng.int(-6, 7);
	if (e === 0) e = chance(rng, 0.5) ? 3 : -2;
	let plain: string;
	if (e < 0) plain = `0.${'0'.repeat(-e - 1)}${digits}`;
	else if (e + 1 >= len) plain = digits + '0'.repeat(e + 1 - len);
	else plain = `${digits.slice(0, e + 1)}.${digits.slice(e + 1)}`;
	return { digits, e, plain };
}

const mantissa = (digits: string) => `1.${digits.slice(1)}`;

function shiftStep(plain: string, digits: string, e: number): string {
	return e > 0
		? `La virgola va spostata di $${e}$ ${e === 1 ? 'posto' : 'posti'} verso sinistra per lasciare un solo $1$ davanti: $${binTex(plain)} = ${binTex(mantissa(digits))} \\cdot 2^{${e}}$.`
		: `La virgola va spostata di $${-e}$ ${e === -1 ? 'posto' : 'posti'} verso destra per portarla dopo il primo $1$: $${binTex(plain)} = ${binTex(mantissa(digits))} \\cdot 2^{${e}}$.`;
}

function level4(rng: Rng): Built {
	const { digits, e, plain } = drawFloat(rng);
	return numberBuilt(
		{
			prompt: "Scrivi l'esponente n.",
			problem: textBlock('Il numero è scritto in notazione scientifica normalizzata in base due. Quanto vale $n$?', [`${binTex(plain)} = ${binTex(mantissa(digits))} \\cdot 2^{n}`]),
			steps: [tx(shiftStep(plain, digits, e)), tx(`Spostare la virgola verso ${e > 0 ? 'sinistra' : 'destra'} rende il numero più ${e > 0 ? 'piccolo' : 'grande'}: l'esponente è ${e > 0 ? 'positivo' : 'negativo'}, $n = ${e}$.`)],
			params: { plain, case: e > 0 ? 'positivo' : 'negativo' },
		},
		e,
		1,
		// the digits before the comma, or the zeros after it, counted in place of the shifts: one off
		[-e, e + 1, e - 1, -(e + 1), -(e - 1), e + 2],
	);
}

function level5(rng: Rng): Built {
	const { digits, e, plain } = drawFloat(rng);
	const negative = chance(rng, 0.5);
	const shown = `${negative ? '-' : ''}${binTex(plain)}`;
	return numberBuilt(
		{
			prompt: "Scrivi in base dieci il numero che va nel campo dell'esponente.",
			problem: textBlock("Questo numero viene memorizzato in virgola mobile a 32 bit, secondo lo standard IEEE 754. Quale numero viene scritto nel campo dell'esponente?", [shown]),
			steps: [
				tx(shiftStep(plain, digits, e)),
				tx(`L'esponente vero è $${e}$. Nel campo si scrive l'esponente aumentato di $127$: $${e} + 127 = ${e + 127}$.`),
				tx(`Il bit di segno è $${negative ? 1 : 0}$ e la mantissa comincia con le cifre dopo la virgola, $${digits.slice(1)}$.`),
			],
			params: { plain, negative, case: e > 0 ? 'positivo' : 'negativo' },
		},
		e + 127,
		1,
		[e, 127 - e, e + 128, e + 126, 127, Math.abs(e)],
	);
}

export const infVirgolaMobile = defineGenerator(ID, 'Numeri reali in virgola mobile', {
	1: { label: 'Dal binario con la virgola al decimale', constraints: ['parte intera fino a 15, da 1 a 4 cifre dopo la virgola, l\'ultima è 1'], make: level1 },
	2: { label: 'Dal decimale al binario con la virgola', constraints: ['gli stessi numeri del livello 1, dati in base dieci', 'scelta tra quattro scritture binarie'], make: level2 },
	3: {
		label: 'Numeri esatti e numeri arrotondati',
		constraints: ['quattro numeri decimali, uno solo con un numero finito di cifre binarie (metà dei casi) oppure uno solo con infinite cifre'],
		make: level3,
	},
	4: { label: "L'esponente in base due", constraints: ['mantissa da 2 a 6 cifre, esponente da -6 a 7 diverso da 0', 'la risposta è l\'esponente'], make: level4 },
	5: { label: "Il campo dell'esponente a 32 bit", constraints: ['un numero binario con segno, da normalizzare', "la risposta è l'esponente più 127"], make: level5 },
});

export default infVirgolaMobile;
