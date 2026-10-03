/**
 * La codifica dei caratteri: ASCII e Unicode. Spec: specs/exercises/inf-codifica-caratteri.md
 *
 * Six levels in the order of the lesson (docs/lezioni/informatica/riscritte/10-inf-codifica-caratteri.md): the
 * ASCII code of a character from a known one; the character of a code, in decimal or in binary; upper and lower
 * case, 32 apart; the bytes of a text with one byte per character; the bytes of a text with accented letters in
 * UTF-8; the bytes UTF-8 needs for a code point.
 */
import type { ChoiceOption, Rng } from '../types';
import { type Built, bits, bitsTex, chance, choose, decTex, defineGenerator, fmtInt, numberBuilt, textBlock, textOpt, tx } from '../inf-codifica';

export const ID = 'inf-codifica-caratteri';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = UPPER.toLowerCase();
const DIGITS = '0123456789';
type Kind = 'maiuscola' | 'minuscola' | 'cifra';

const kindOf = (c: string): Kind => (UPPER.includes(c) ? 'maiuscola' : LOWER.includes(c) ? 'minuscola' : 'cifra');
/** "la lettera maiuscola K", "la cifra 7". */
const name = (c: string) => (kindOf(c) === 'cifra' ? `la cifra ${c}` : `la lettera ${kindOf(c)} ${c}`);
/** "della lettera maiuscola K", "della cifra 7". */
const ofName = (c: string) => `del${name(c)}`;
const code = (c: string) => c.charCodeAt(0);
const other = (rng: Rng, pool: string, not: string) => rng.pick([...pool].filter((c) => c !== not));

// ---------------------------------------------------------------------------
// Level 1: the code of a character, from a known one of the same family

function level1(rng: Rng): Built {
	const u = rng.next();
	const pool = u < 0.4 ? UPPER : u < 0.8 ? LOWER : DIGITS;
	const known = rng.pick([...pool]);
	const asked = other(rng, pool, known);
	const diff = code(asked) - code(known);
	const k = kindOf(asked);
	const pos = pool.indexOf(asked) + (k === 'cifra' ? 0 : 1);
	const wrong = [
		k === 'cifra' ? Number(asked) : pos,
		code(known) - diff,
		code(asked) + (k === 'maiuscola' ? 32 : k === 'minuscola' ? -32 : 1),
		code(known) + pos,
		code(asked) + 1,
		code(asked) - 1,
	];
	const places = Math.abs(diff) === 1 ? 'un posto' : `$${Math.abs(diff)}$ posti`;
	return numberBuilt(
		{
			prompt: 'Scrivi il codice ASCII in base dieci.',
			problem: textBlock(`Nel codice ASCII ${name(known)} ha codice $${code(known)}$. Qual è il codice ${ofName(asked)}?`),
			steps: [
				tx(k === 'cifra' ? 'In ASCII le cifre da 0 a 9 hanno codici consecutivi.' : `In ASCII le lettere ${k === 'maiuscola' ? 'maiuscole' : 'minuscole'} hanno codici consecutivi, in ordine alfabetico.`),
				tx(`Da ${known} a ${asked} ci sono ${places} ${diff > 0 ? 'in avanti' : 'indietro'}.`),
				tx(`$${code(known)} ${diff > 0 ? '+' : '-'} ${Math.abs(diff)} = ${code(asked)}$.`),
			],
			params: { case: k, known, asked },
		},
		code(asked),
		1,
		wrong,
	);
}

// ---------------------------------------------------------------------------
// Level 2: the character of a code

const charOpt = (c: string): ChoiceOption => {
	const k = kindOf(c);
	return textOpt(k === 'cifra' ? `la cifra ${c}` : `${c} ${k}`, c);
};

function level2(rng: Rng): Built {
	const u = rng.next();
	const pool = u < 0.4 ? UPPER : u < 0.8 ? LOWER : DIGITS;
	const c = rng.pick([...pool]);
	const k = kindOf(c);
	const binary = chance(rng, 0.5);
	const n = code(c);
	const shown = binary ? `$${bitsTex(bits(n, 7))}_2$` : `$${n}$`;
	const i = pool.indexOf(c);
	const near = [pool[i + 1], pool[i - 1], pool[i + 2], pool[i - 2]].filter(Boolean);
	const wrong =
		k === 'cifra'
			? [near[0], UPPER[Number(c)] ?? 'A', near[1], LOWER[Number(c)], ...near.slice(2)]
			: [k === 'maiuscola' ? c.toLowerCase() : c.toUpperCase(), near[0], near[1], DIGITS[i % 10], ...near.slice(2)];
	const start = k === 'maiuscola' ? 'A' : k === 'minuscola' ? 'a' : '0';
	const range = k === 'maiuscola' ? 'tra $65$ e $90$: è una lettera maiuscola' : k === 'minuscola' ? 'tra $97$ e $122$: è una lettera minuscola' : 'tra $48$ e $57$: è una cifra';
	return {
		prompt: 'Scegli il carattere.',
		problem: textBlock(`Nel codice ASCII la lettera maiuscola A ha codice $65$, la lettera minuscola a ha codice $97$ e la cifra 0 ha codice $48$. Quale carattere ha codice ${shown}?`),
		solution: charOpt(c).latex,
		steps: [
			...(binary ? [tx(`In base dieci: $${bitsTex(bits(n, 7))}_2 = ${n}$.`)] : []),
			tx(`$${n}$ sta ${range}.`),
			tx(`$${n} - ${code(start)} = ${n - code(start)}$: il carattere è ${n === code(start) ? 'proprio' : `${n - code(start) === 1 ? 'un posto' : `$${n - code(start)}$ posti`} dopo`} ${start}, cioè ${c}.`),
		],
		answer: choose(rng, charOpt(c), wrong.filter(Boolean).map(charOpt)),
		params: { case: k, code: n, binary },
	};
}

// ---------------------------------------------------------------------------
// Level 3: upper and lower case

function level3(rng: Rng): Built {
	const toLower = chance(rng, 0.5);
	const same = chance(rng, 0.3);
	const knownU = rng.pick([...UPPER]);
	const askedU = same ? knownU : other(rng, UPPER, knownU);
	const known = toLower ? knownU : knownU.toLowerCase();
	const asked = toLower ? askedU.toLowerCase() : askedU;
	const shift = toLower ? 32 : -32;
	const diff = code(askedU) - code(knownU);
	const value = code(asked);
	const wrong = [code(known) + diff, value - 2 * shift, code(known) + diff + (toLower ? 26 : -26), value + 1, value - 1, code(known) + shift];
	const sameKind = toLower ? 'minuscola' : 'maiuscola';
	const steps = [tx(`Ogni lettera minuscola ha il codice della maiuscola aumentato di $32$.`)];
	if (same) steps.push(tx(`$${code(known)} ${toLower ? '+' : '-'} 32 = ${value}$.`));
	else {
		const mid = code(known) + shift;
		steps.push(tx(`La lettera ${sameKind} ${toLower ? knownU.toLowerCase() : knownU} ha codice $${code(known)} ${toLower ? '+' : '-'} 32 = ${mid}$.`));
		steps.push(tx(`Da ${toLower ? knownU.toLowerCase() : knownU} a ${asked} ci sono $${Math.abs(diff)}$ ${Math.abs(diff) === 1 ? 'posto' : 'posti'} ${diff > 0 ? 'in avanti' : 'indietro'}: $${mid} ${diff > 0 ? '+' : '-'} ${Math.abs(diff)} = ${value}$.`));
	}
	return numberBuilt(
		{
			prompt: 'Scrivi il codice ASCII in base dieci.',
			problem: textBlock(`Nel codice ASCII ${name(known)} ha codice $${code(known)}$. Qual è il codice ${ofName(asked)}?`),
			steps,
			params: { case: same ? 'stessa lettera' : 'altra lettera', known, asked },
		},
		value,
		1,
		wrong,
	);
}

// ---------------------------------------------------------------------------
// Level 4: the bytes of a text, one byte per character

const NAMES = ['Anna', 'Luca', 'Marta', 'Paolo', 'Giulia', 'Marco', 'Sara', 'Davide', 'Elena', 'Tommaso', 'Irene', 'Pietro'];
const OPENINGS = ['Ciao', 'Buongiorno', 'Buona sera', 'A presto', 'Ci vediamo domani', 'Grazie mille', 'Tanti auguri', 'Bentornata a casa'];
const ENDINGS = ['', '.', '!', '?', '...'];

/** A phrase and its count of characters, spaces and punctuation included. */
function asciiPhrase(rng: Rng): string {
	const withHour = chance(rng, 0.35);
	const phrase = `${rng.pick(OPENINGS)} ${rng.pick(NAMES)}${withHour ? ` alle ${rng.int(8, 21)}` : ''}${rng.pick(ENDINGS)}`;
	if (/[^\x20-\x7e]/.test(phrase)) throw new Error('asciiPhrase: not ASCII');
	return phrase;
}

function level4(rng: Rng): Built {
	if (chance(rng, 0.5)) {
		const phrase = asciiPhrase(rng);
		const n = phrase.length;
		const spaces = phrase.split(' ').length - 1;
		const marks = phrase.replace(/[A-Za-z0-9 ]/g, '').length;
		const pieces = [`$${n - spaces - marks}$ tra lettere e cifre`, `$${spaces}$ ${spaces === 1 ? 'spazio' : 'spazi'}`];
		if (marks) pieces.push(`$${marks}$ ${marks === 1 ? 'segno' : 'segni'} di punteggiatura`);
		return numberBuilt(
			{
				prompt: 'Scrivi il numero di byte.',
				problem: textBlock(`Un messaggio è salvato in ASCII, con un byte per carattere. Quanti byte occupa? Il messaggio, senza le virgolette, è: “${phrase}”`),
				steps: [tx(`Ogni carattere occupa un byte, compresi gli spazi e la punteggiatura.`), tx(`I caratteri sono ${pieces.join(', ')}: in tutto $${n}$.`), tx(`Il messaggio occupa $${n}$ byte.`)],
				params: { case: 'frase', phrase },
			},
			n,
			1,
			[n - spaces, n - spaces - marks, 8 * n, n + 1, n - 1, phrase.split(' ').length, 7 * n],
			'B',
		);
	}
	const pages = rng.int(2, 120);
	const rows = rng.pick([20, 25, 30, 40, 50]);
	const cols = rng.pick([50, 60, 70, 80]);
	const total = pages * rows * cols;
	return numberBuilt(
		{
			prompt: 'Scrivi la dimensione in kB.',
			problem: textBlock(
				`Un testo ha $${pages}$ pagine; ogni pagina ha $${rows}$ righe di $${cols}$ caratteri, spazi compresi. È salvato con un byte per carattere. Quanti kB occupa? Usa $1\\,\\text{kB} = 1000\\,\\text{B}$.`,
			),
			steps: [
				tx(`Caratteri: $${pages} \\cdot ${rows} \\cdot ${cols} = ${fmtInt(total)}$.`),
				tx(`Un byte per carattere: $${fmtInt(total)}\\,\\text{B}$.`),
				tx(`In kB: $${fmtInt(total)} : 1000 = ${decTex(total, 1000)}\\,\\text{kB}$.`),
			],
			params: { case: 'documento', pages, rows, cols },
		},
		total,
		1000,
		[
			[total * 8, 1000],
			[rows * cols, 1000],
			[total, 100],
			[total, 10000],
			[pages * (rows + cols), 1000],
			[total, 8000],
		],
		'kB',
	);
}

// ---------------------------------------------------------------------------
// Level 5: a text with accented letters in UTF-8

const ACCENTED = [
	'La città è lontana',
	'Perché no',
	'Il caffè è pronto',
	'Lunedì c\'è il sole',
	'È già tardi',
	'Così è più bello',
	'Andrò all\'università',
	'Però è più caro',
	'Che novità',
	'Sarà per giovedì',
	'Lassù c\'è la neve',
	'Più tardi',
	'Martedì farò il compito',
	'Tornerò mercoledì',
	'Non è colpa mia',
	'Venerdì sarò qui',
];
const TAILS = ['', '.', '!', '?', ', vero?', ', però', ' con Anna', ' e Luca', ' alle 9', ' da solo'];

function level5(rng: Rng): Built {
	const phrase = `${rng.pick(ACCENTED)}${rng.pick(TAILS)}`;
	const n = [...phrase].length;
	const accents = [...phrase].filter((c) => c.charCodeAt(0) > 127).length;
	const spaces = phrase.split(' ').length - 1;
	const value = n + accents;
	return numberBuilt(
		{
			prompt: 'Scrivi il numero di byte.',
			problem: textBlock(`Un messaggio è salvato in UTF-8: le lettere accentate occupano 2 byte, tutti gli altri caratteri del messaggio 1 byte. Quanti byte occupa? Il messaggio, senza le virgolette, è: “${phrase}”`),
			steps: [
				tx(`I caratteri sono $${n}$, contando spazi, apostrofi e punteggiatura.`),
				tx(accents === 1 ? "C'è una sola lettera accentata, che occupa un byte in più." : `Le lettere accentate sono $${accents}$: ognuna occupa un byte in più.`),
				tx(`$${n} + ${accents} = ${value}$ byte.`),
			],
			params: { phrase },
		},
		value,
		1,
		[n, n + 2 * accents, 2 * n, value - spaces, 2 * accents, value + 1, value - 1],
		'B',
	);
}

// ---------------------------------------------------------------------------
// Level 6: the bytes of a code point in UTF-8

const hex = (n: number) => n.toString(16).toUpperCase().padStart(4, '0');
/** Ranges of the UTF-8 lengths, with code points near the borders more often than in the middle. */
const RANGES: [number, number][] = [
	[0x20, 0x7e],
	[0x80, 0x7ff],
	[0x800, 0xffff],
	[0x10000, 0x10ffff],
];
const KNOWN: number[][] = [
	[0x41, 0x61, 0x30, 0x7e, 0x20],
	[0xe8, 0xe0, 0xf9, 0xa9, 0x3b1, 0x7ff, 0x80, 0x416],
	[0x20ac, 0x800, 0xffff, 0x4e2d, 0x2192, 0x221e, 0x3042, 0x1000],
	[0x1f600, 0x10000, 0x10ffff, 0x1f680, 0x1f44d, 0x1d11e],
];

function level6(rng: Rng): Built {
	const len = rng.int(1, 4);
	const [lo, hi] = RANGES[len - 1];
	let cp = chance(rng, 0.35) ? rng.pick(KNOWN[len - 1]) : rng.int(lo, hi);
	if (cp >= 0xd800 && cp <= 0xdfff) cp = 0x20ac;
	const label = `U+${hex(cp)}`;
	const rows = ['fino a U+007F: 1 byte', 'da U+0080 a U+07FF: 2 byte', 'da U+0800 a U+FFFF: 3 byte', 'da U+10000 in poi: 4 byte'];
	return numberBuilt(
		{
			prompt: 'Scrivi il numero di byte.',
			problem: textBlock(`Un carattere ha punto di codice ${label}. Quanti byte occupa in UTF-8?`),
			steps: [tx(`UTF-8 usa: ${rows.join('; ')}.`), tx(`${label} sta nell'intervallo ${len === 1 ? 'fino a U+007F' : len === 4 ? 'da U+10000 in poi' : rows[len - 1].split(':')[0]}: occupa $${len}$ byte.`)],
			params: { case: `${len} byte`, cp: hex(cp) },
		},
		len,
		1,
		[1, 2, 3, 4].filter((x) => x !== len),
	);
}

export const infCodificaCaratteri = defineGenerator(ID, 'La codifica dei caratteri: ASCII e Unicode', {
	1: { label: 'Il codice ASCII di un carattere', constraints: ['un carattere noto e uno da trovare della stessa famiglia: maiuscole (4 su 10), minuscole (4 su 10), cifre (2 su 10)'], make: level1 },
	2: { label: 'Dal codice al carattere', constraints: ['codice in base dieci o in binario su 7 bit, metà e metà', 'scelta tra quattro caratteri'], make: level2 },
	3: { label: 'Maiuscole e minuscole', constraints: ['nota una lettera, il codice di una lettera di altro tipo (maiuscola o minuscola)', 'circa 3 su 10 la stessa lettera'], make: level3 },
	4: { label: 'Quanti byte occupa un testo', constraints: ['metà: i caratteri di un messaggio ASCII, spazi compresi', 'metà: pagine per righe per caratteri, in kB con 1 kB = 1000 B'], make: level4 },
	5: { label: 'Un testo con gli accenti in UTF-8', constraints: ['un messaggio con da 1 a 4 lettere accentate, 2 byte ciascuna'], make: level5 },
	6: { label: 'I byte di un carattere in UTF-8', constraints: ['un punto di codice in esadecimale, da 1 a 4 byte, circa un quarto per caso'], make: level6 },
});

export default infCodificaCaratteri;
