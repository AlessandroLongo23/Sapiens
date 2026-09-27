import { fail, type Outcome, type Step } from './types';
import { intTex, intText } from './numbers';

/**
 * Roman numerals from 1 to 3999, both ways, with the classical rules taught at school: seven symbols; a symbol is
 * repeated at most three times (I, X, C, M; never V, L, D); a smaller symbol before a larger one is subtracted, and
 * only in the six pairs IV, IX, XL, XC, CD, CM. The input's direction is guessed: digits are turned into a Roman
 * numeral, letters into a number.
 */

export const SYMBOLS: [string, number][] = [
	['I', 1],
	['V', 5],
	['X', 10],
	['L', 50],
	['C', 100],
	['D', 500],
	['M', 1000]
];
const VALUE = new Map(SYMBOLS);

/** The Roman writing of each digit, by place: units, tens, hundreds, thousands. */
const PLACES: { name: string; one: string; five: string; ten: string; unit: number }[] = [
	{ name: 'Unità', one: 'I', five: 'V', ten: 'X', unit: 1 },
	{ name: 'Decine', one: 'X', five: 'L', ten: 'C', unit: 10 },
	{ name: 'Centinaia', one: 'C', five: 'D', ten: 'M', unit: 100 },
	{ name: 'Migliaia', one: 'M', five: '', ten: '', unit: 1000 }
];

function digitRoman(d: number, p: (typeof PLACES)[number]): string {
	if (d === 9) return p.one + p.ten;
	if (d === 4) return p.one + p.five;
	return (d >= 5 ? p.five : '') + p.one.repeat(d % 5);
}

export function toRoman(n: number): string {
	return [...String(n)]
		.reverse()
		.map((c, i) => digitRoman(Number(c), PLACES[i]))
		.reverse()
		.join('');
}

const rm = (s: string) => `\\mathrm{${s}}`;

/** The table of the symbols that appear, with their values. */
function symbolTable(roman: string): Step {
	const used = SYMBOLS.filter(([s]) => roman.includes(s));
	return {
		say: 'Ricorda i simboli che servono e il loro valore.',
		table: { head: ['Simbolo', ...used.map(([s]) => `$${rm(s)}$`)], rows: [['Valore', ...used.map(([, v]) => `$${intTex(v)}$`)]] }
	};
}

/** How a group of symbols is read: "M" → 1000; "CM" → 1000 − 100 = 900; "XXX" → 10 + 10 + 10 = 30. */
function groupMath(g: string): string {
	if (g.length === 2 && VALUE.get(g[0])! < VALUE.get(g[1])!) return `${intTex(VALUE.get(g[1])!)} - ${intTex(VALUE.get(g[0])!)} = \\hl{${intTex(VALUE.get(g[1])! - VALUE.get(g[0])!)}}`;
	const values = [...g].map((c) => VALUE.get(c)!);
	const sum = values.reduce((a, b) => a + b, 0);
	return values.length === 1 ? `${intTex(sum)}` : `${values.map(intTex).join(' + ')} = ${intTex(sum)}`;
}

/** Split a valid numeral into its places, left to right: MCMXCIV → M, CM, XC, IV. */
function groups(n: number): { place: string; value: number; roman: string }[] {
	const digits = [...String(n)].reverse();
	const out = digits.map((c, i) => ({ place: PLACES[i].name, value: Number(c) * PLACES[i].unit, roman: digitRoman(Number(c), PLACES[i]) }));
	return out.reverse().filter((g) => g.value > 0);
}

function toRomanOutcome(n: number): Outcome {
	const roman = toRoman(n);
	const gs = groups(n);
	const subtractive = gs.filter((g) => /IV|IX|XL|XC|CD|CM/.test(g.roman));
	const steps: Step[] = [
		{
			say: 'Scomponi il numero in migliaia, centinaia, decine e unità.',
			table: { head: ['Posto', 'Valore'], rows: gs.map((g) => [g.place, `$${intTex(g.value)}$`]) },
			math: gs.length > 1 ? [`${intTex(n)} = ${gs.map((g) => intTex(g.value)).join(' + ')}`] : undefined
		},
		symbolTable(roman),
		{
			say: 'Scrivi ogni parte con i simboli romani.',
			table: { head: ['Valore', 'In romano', 'Come si legge'], rows: gs.map((g) => [`$${intTex(g.value)}$`, `$${rm(g.roman)}$`, `$${groupMath(g.roman)}$`]) },
			then: subtractive.length
				? `Un simbolo minore prima di uno maggiore si sottrae: qui ${subtractive.length === 1 ? 'c’è una sottrazione' : `ci sono $${subtractive.length}$ sottrazioni`}.`
				: 'Qui non ci sono sottrazioni: ogni simbolo si somma.'
		},
		{ say: 'Scrivi i simboli uno dopo l’altro, da sinistra.', math: [`${intTex(n)} = \\hl{${rm(roman)}}`] }
	];
	return { ok: true, rows: [{ label: `${intText(n)} in numeri romani`, value: `$${rm(roman)}$` }], copy: roman, steps };
}

/** A numeral read with the plain rule (a smaller symbol before a larger one is subtracted), valid or not. */
function looseValue(s: string): number {
	let total = 0;
	for (let i = 0; i < s.length; i++) {
		const v = VALUE.get(s[i])!;
		const next = VALUE.get(s[i + 1]) ?? 0;
		total += v < next ? -v : v;
	}
	return total;
}

/** Why a numeral breaks the rules, in one sentence. */
function whyWrong(s: string): string {
	if (/IIII|XXXX|CCCC|MMMM/.test(s)) return 'un simbolo non si ripete più di tre volte di seguito';
	if (/VV|LL|DD|V.*V|L.*L|D.*D/.test(s)) return 'V, L e D non si ripetono mai';
	if (/I[LCDM]|X[DM]|V[XLCDM]|L[CDM]|D[M]/.test(s)) return 'si sottraggono solo I prima di V e X, X prima di L e C, C prima di D e M';
	return 'i simboli vanno scritti dal più grande al più piccolo, salvo le sei sottrazioni IV, IX, XL, XC, CD e CM';
}

function fromRomanOutcome(input: string): Outcome {
	const s = input.toUpperCase();
	if (!/^[IVXLCDM]+$/.test(s)) return fail('Nei numeri romani si usano solo le lettere I, V, X, L, C, D e M: scrivi per esempio MCMXCIV.');
	if (s.length > 15) return fail('Il numero romano più lungo fino a 3999 ha 15 simboli (MMMDCCCLXXXVIII). Scrivi un numero più corto.');
	const n = looseValue(s);
	if (n < 1 || n > 3999 || toRoman(n) !== s) {
		const hint = n >= 1 && n <= 3999 ? ` Forse volevi ${toRoman(n)}, cioè ${intText(n)}.` : '';
		return fail(`${s} non è scritto secondo le regole: ${whyWrong(s)}.${hint}`);
	}
	const gs = groups(n);
	const steps: Step[] = [
		symbolTable(s),
		{
			say: 'Dividi il numero in gruppi: migliaia, centinaia, decine e unità.',
			table: { head: ['Gruppo', 'Come si legge', 'Valore'], rows: gs.map((g) => [`$${rm(g.roman)}$`, `$${groupMath(g.roman)}$`, `$${intTex(g.value)}$`]) },
			then: /IV|IX|XL|XC|CD|CM/.test(s) ? 'Un simbolo minore prima di uno maggiore si sottrae da quello maggiore.' : 'Qui non ci sono sottrazioni: ogni simbolo si somma.'
		},
		{
			say: 'Somma i valori dei gruppi.',
			math: [`${rm(s)} = ${gs.length > 1 ? `${gs.map((g) => intTex(g.value)).join(' + ')} = ` : ''}\\hl{${intTex(n)}}`]
		}
	];
	return { ok: true, rows: [{ label: `${s} in numeri arabi`, value: `$${intTex(n)}$` }], copy: String(n), steps };
}

export function numeriRomani(input: string): Outcome {
	const s = input.trim().replace(/[\s.]+/g, '');
	if (!s) return fail('Scrivi un numero da 1 a 3999, per esempio 1994, oppure un numero romano, per esempio MCMXCIV.');
	if (/^\d+$/.test(s)) {
		const n = Number(s);
		if (n === 0) return fail('I Romani non avevano un simbolo per lo zero. Scrivi un numero da 1 a 3999, per esempio 1994.');
		if (n > 3999) return fail('Con i sette simboli classici si arriva fino a 3999, cioè MMMCMXCIX. Scrivi un numero più piccolo.');
		return toRomanOutcome(n);
	}
	if (/^[a-z]+$/i.test(s)) return fromRomanOutcome(s);
	return fail('Scrivi un numero intero da 1 a 3999, per esempio 1994, oppure un numero romano con le lettere I, V, X, L, C, D e M.');
}
