import { fail, type Outcome, type Step } from './types';
import { groupDigits } from './binario';

/**
 * Text and ASCII codes, both ways. ASCII gives a number from 0 to 127 to each character; the printable ones go from
 * 32 (the space) to 126 (~). Codes are shown in decimal, in binary on 8 bits (one byte, as the books write them) and
 * in hexadecimal. A character outside ASCII, like "è", has a Unicode code point instead, stored in UTF-8.
 */

export type CodeBase = 'dec' | 'bin' | 'hex';

export const MAX_CHARS = 40;

export const CODE_BASES: { value: CodeBase; label: string }[] = [
	{ value: 'dec', label: 'Decimale' },
	{ value: 'bin', label: 'Binario' },
	{ value: 'hex', label: 'Esadecimale' }
];

/** Names of the control characters a student might meet. */
const CONTROL: Record<number, string> = { 0: 'carattere nullo', 7: 'campanello', 8: 'backspace', 9: 'tabulazione', 10: 'a capo', 13: 'ritorno a inizio riga', 27: 'escape', 127: 'cancella' };

const isPrintable = (c: number) => c >= 32 && c <= 126;
const bin8 = (c: number) => c.toString(2).padStart(8, '0');
const hex2 = (c: number) => c.toString(16).toUpperCase().padStart(2, '0');
const tt = (s: string) => `\\mathtt{${s}}`;
const bin8Tex = (c: number) => tt(groupDigits(bin8(c), 2, '\\,'));

/** A character in a table cell: the space in words, the others as they are, in typewriter type. */
function charCell(ch: string): string {
	if (ch === ' ') return 'spazio';
	const code = ch.codePointAt(0)!;
	if (code < 32 || code === 127) return CONTROL[code] ?? 'carattere di controllo';
	// Outside ASCII: plain text, escaped by the page.
	if (code > 127) return ch;
	// Characters that LaTeX treats as commands are written as text in their own cell.
	return `$\\texttt{${escapeTex(ch)}}$`;
}

function escapeTex(ch: string): string {
	const map: Record<string, string> = {
		'\\': '\\textbackslash{}',
		'{': '\\{',
		'}': '\\}',
		$: '\\textdollar{}',
		'%': '\\%',
		'&': '\\&',
		'#': '\\#',
		_: '\\_',
		'^': '\\textasciicircum{}',
		'~': '\\textasciitilde{}'
	};
	return map[ch] ?? ch;
}

const codePoint = (c: number) => `U+${c.toString(16).toUpperCase().padStart(4, '0')}`;

/** Text to ASCII codes, one row per character. */
export function testoAAscii(input: string): Outcome {
	if (!input) return fail('Scrivi una parola o una frase, per esempio Ciao!');
	const chars = [...input];
	if (chars.length > MAX_CHARS) return fail(`Al massimo ${MAX_CHARS} caratteri alla volta: questo testo ne ha ${chars.length}.`);
	const codes = chars.map((ch) => ch.codePointAt(0)!);
	const outside = chars.filter((_, i) => codes[i] > 127);
	const rows = chars.map((ch, i) => {
		const c = codes[i];
		if (c > 127) return [charCell(ch), `$${c}$`, 'non è ASCII', `$\\texttt{${codePoint(c)}}$`];
		return [charCell(ch), `$${c}$`, `$${bin8Tex(c)}$`, `$${tt(hex2(c))}$`];
	});
	const steps: Step[] = [
		{
			say: 'Cerca ogni carattere nella tabella ASCII e scrivi il suo codice.',
			table: { head: ['Carattere', 'Codice'], rows: chars.map((ch, i) => [charCell(ch), codes[i] > 127 ? 'fuori dalla tabella' : `$\\hl{${codes[i]}}$`]) },
			then: /[A-Za-z]/.test(input) ? 'Le maiuscole vanno da 65 (A) a 90 (Z), le minuscole da 97 (a) a 122 (z).' : undefined
		}
	];
	const first = codes.find((c) => c <= 127 && c > 0);
	if (first !== undefined) {
		const bin = bin8(first);
		steps.push({
			say: `Scrivi ${first} in binario su 8 bit, cioè un byte.`,
			math: [`${first} = ${powersOf(first)}`, `${first} = \\hl{${bin8Tex(first)}}_2`],
			then: 'Gli zeri a sinistra completano il byte.'
		});
		steps.push({
			say: 'Per l’esadecimale dividi il byte in due gruppi di 4 bit.',
			table: { rows: [['Gruppo', `$${tt(bin.slice(0, 4))}$`, `$${tt(bin.slice(4))}$`], ['Cifra', `$\\hl{${tt(hex2(first)[0])}}$`, `$\\hl{${tt(hex2(first)[1])}}$`]] },
			math: [`${first} = ${tt(hex2(first))}_{16}`]
		});
	}
	steps.push({
		say: 'Fai lo stesso con ogni carattere.',
		table: { head: ['Carattere', 'Decimale', 'Binario', 'Esadecimale'], rows },
		then: outside.length
			? `${outside.map((c) => `"${c}"`).join(' e ')} ${outside.length === 1 ? 'non è' : 'non sono'} nell’ASCII, che arriva a 127: serve Unicode, e nei file si scrive in UTF-8 con più byte. La tabella mostra il code point.`
			: undefined
	});
	const nonPrintable = codes.some((c) => c <= 127 && !isPrintable(c));
	if (nonPrintable) steps[steps.length - 1] = { ...steps[steps.length - 1], then: `${steps[steps.length - 1].then ?? ''} I codici sotto 32 non si stampano: sono comandi.`.trim() };
	const decimals = codes.join(' ');
	return {
		ok: true,
		rows: [
			{ label: 'Codici ASCII in decimale', value: `$${codes.map((c) => (c > 127 ? `\\texttt{${codePoint(c)}}` : `${c}`)).join(' \\quad ')}$` },
			{ label: 'In esadecimale', value: `$${codes.map((c) => tt(c > 127 ? codePoint(c) : hex2(c))).join(' \\quad ')}$` }
		],
		copy: decimals,
		steps
	};
}

/** The powers of 2 that make a number: "64 + 1". */
function powersOf(n: number): string {
	const parts: string[] = [];
	for (let p = 7; p >= 0; p--) if (n & (1 << p)) parts.push(String(1 << p));
	return parts.length ? parts.join(' + ') : '0';
}

const EXAMPLE: Record<CodeBase, string> = { dec: '67 105 97 111', bin: '01000011 01101001', hex: '43 69 61 6F' };

/** Codes separated by spaces (or commas) to text. */
export function asciiATesto(input: string, base: CodeBase): Outcome {
	const parts = input
		.trim()
		.split(/[\s,;]+/)
		.filter(Boolean)
		.map((p) => p.replace(/^0x/i, '').replace(/^0b/i, ''));
	if (!parts.length) return fail(`Scrivi i codici separati da uno spazio, per esempio ${EXAMPLE[base]}.`);
	if (parts.length > MAX_CHARS) return fail(`Al massimo ${MAX_CHARS} codici alla volta: qui ce ne sono ${parts.length}.`);
	const valid = { dec: /^\d{1,3}$/, bin: /^[01]{1,8}$/, hex: /^[0-9a-f]{1,2}$/i }[base];
	const codes: number[] = [];
	for (const p of parts) {
		if (!valid.test(p)) {
			const what = { dec: 'un numero da 0 a 127', bin: 'un byte, al massimo 8 cifre 0 e 1', hex: 'due cifre esadecimali, da 00 a 7F' }[base];
			return fail(`"${p}" non è ${what}. Scrivi i codici separati da uno spazio, per esempio ${EXAMPLE[base]}.`);
		}
		const c = parseInt(p, base === 'dec' ? 10 : base === 'bin' ? 2 : 16);
		if (c > 127) return fail(`${p} vale ${c}: l’ASCII arriva a 127. Oltre ci sono i caratteri Unicode, che in UTF-8 usano più byte.`);
		codes.push(c);
	}
	const text = codes.map((c) => String.fromCharCode(c)).join('');
	const steps: Step[] = [];
	if (base !== 'dec') {
		steps.push({
			say: base === 'bin' ? 'Trasforma ogni byte in decimale, sommando le potenze di 2.' : 'Trasforma ogni codice in decimale: la prima cifra vale 16 volte.',
			table: {
				head: ['Codice', 'Calcolo', 'Decimale'],
				rows: parts.map((p, i) => [
					`$${tt(base === 'bin' ? groupDigits(p.padStart(8, '0'), 2, '\\,') : p.toUpperCase())}$`,
					base === 'bin' ? `$${powersOf(codes[i])}$` : `$${hexSum(p)}$`,
					`$\\hl{${codes[i]}}$`
				])
			}
		});
	}
	steps.push({
		say: 'Cerca ogni codice nella tabella ASCII.',
		table: { head: ['Codice', 'Carattere'], rows: codes.map((c) => [`$${c}$`, charCell(String.fromCharCode(c))]) },
		then: codes.some((c) => !isPrintable(c)) ? 'I codici sotto 32 e il 127 non si stampano: sono comandi, come l’a capo.' : undefined
	});
	const textTex = codes.map((c) => (isPrintable(c) ? `\\texttt{${c === 32 ? '\\ ' : escapeTex(String.fromCharCode(c))}}` : '\\square')).join('');
	steps.push({ say: 'Leggi i caratteri uno dopo l’altro.', math: [`\\hl{${textTex}}`] });
	return {
		ok: true,
		rows: [{ label: 'Testo', value: `$${textTex}$` }],
		copy: text,
		steps
	};
}

/** "6F" → "6 \cdot 16 + 15". */
function hexSum(p: string): string {
	const d = [...p.toUpperCase()].map((c) => parseInt(c, 16));
	return d.length === 1 ? `${d[0]}` : `${d[0]} \\cdot 16 + ${d[1]}`;
}

export function ascii(input: string, mode: string, base: string): Outcome {
	if (mode === 'codici') return asciiATesto(input, base === 'bin' || base === 'hex' ? base : 'dec');
	return testoAAscii(input);
}
