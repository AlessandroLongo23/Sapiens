import { gcd } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { intTex, intText } from './numbers';

/**
 * The fraction that generates a decimal number, with the rule of Italian textbooks (lesson "Numeri decimali e
 * frazioni"): for a periodic number, the numerator is the number without the comma up to the end of the first period
 * minus the digits before the period; the denominator has a 9 for each digit of the period and a 0 for each digit of
 * the part between the comma and the period (the antiperiodo). A terminating decimal goes over 1 followed by as many
 * zeros as its decimals. Then the fraction is reduced, and checked by dividing back.
 *
 * The period is typed in brackets, which is easy on a phone: 0,1(6) is 0,1666… The LaTeX forms \overline{6} and
 * \bar{6} are read too.
 */

const MAX_DIGITS = 12;

export interface Periodic {
	neg: boolean;
	/** Integer part, without leading zeros ("0" when none). */
	int: string;
	/** Digits between the comma and the period. */
	ante: string;
	/** The period, empty for a terminating decimal. */
	period: string;
}

/** "0,1(6)", "-2,3(18)", "1,(45)", "0,75", "0,1\overline{6}" → the parts, or an error. */
export function parsePeriodic(input: string): Periodic | string {
	const s = input
		.trim()
		.replace(/\s+/g, '')
		.replace(/[−–]/g, '-')
		.replace(/\\(?:overline|bar)\{(\d+)\}/g, '($1)')
		.replace(/\.\.\.|…/g, '');
	if (!s) return 'Scrivi un numero decimale, con il periodo tra parentesi: per esempio 0,1(6).';
	if (/\//.test(s)) return 'Qui si scrive un numero decimale, non una frazione: per esempio 0,1(6). Per le frazioni c’è la calcolatrice di frazioni.';
	const m = /^([-+]?)(\d*)(?:[.,](\d*)(?:\((\d*)\))?)?$/.exec(s);
	if (!m || (!m[2] && !m[3] && !m[4])) {
		if (/\(/.test(s) && !/\)$/.test(s)) return 'Il periodo va tra parentesi alla fine del numero, per esempio 0,1(6).';
		return 'Scrivi un numero decimale con la virgola, e il periodo tra parentesi: per esempio 0,1(6) per 0,1666…';
	}
	if (m[4] === '') return 'Tra le parentesi scrivi le cifre del periodo, per esempio 0,1(6).';
	const int = m[2].replace(/^0+/, '') || '0';
	const ante = m[3] ?? '';
	const period = m[4] ?? '';
	if (int.length + ante.length + period.length > MAX_DIGITS) return `Il numero è troppo lungo: al massimo ${MAX_DIGITS} cifre in tutto, per esempio 2,3(18).`;
	const zero = /^0*$/.test(int + ante + period);
	return { neg: m[1] === '-' && !zero, int, ante, period };
}

const numTex = (digits: string) => intTex(Number(digits));

/** The number as written in a book: 0{,}1\overline{6}. */
export function periodicTex(x: Periodic): string {
	const sign = x.neg ? '-' : '';
	if (!x.ante && !x.period) return `${sign}${numTex(x.int)}`;
	return `${sign}${numTex(x.int)}{,}${x.ante}${x.period ? `\\overline{${x.period}}` : ''}`;
}

const periodicText = (x: Periodic) => `${x.neg ? '-' : ''}${x.int}${x.ante || x.period ? ',' : ''}${x.ante}${x.period ? `(${x.period})` : ''}`;

/** a/b (b > 0, a ≥ 0) as a decimal: integer part, digits before the period, period (empty if it terminates). */
export function expand(a: number, b: number): Periodic {
	const int = String(Math.floor(a / b));
	let r = a % b;
	const seen = new Map<number, number>();
	let digits = '';
	while (r !== 0 && !seen.has(r)) {
		seen.set(r, digits.length);
		r *= 10;
		digits += String(Math.floor(r / b));
		r %= b;
	}
	if (r === 0) return { neg: false, int, ante: digits, period: '' };
	const start = seen.get(r)!;
	return { neg: false, int, ante: digits.slice(0, start), period: digits.slice(start) };
}

const frac = (a: number, b: number) => (b === 1 ? intTex(a) : `\\frac{${intTex(a)}}{${intTex(b)}}`);
const fracText = (neg: boolean, a: number, b: number) => `${neg && a ? '-' : ''}${intText(a)}${b === 1 ? '' : `/${intText(b)}`}`;
const same = (x: Periodic, y: Periodic) => x.int === y.int && x.ante === y.ante && x.period === y.period;

/** The division back, a/b written out and with the bar over the period. */
function checkStep(x: Periodic, a: number, b: number, sign: string): Step {
	const e = expand(a, b);
	const written = e.period ? `${numTex(e.int)}{,}${e.ante}${e.period.repeat(e.period.length === 1 ? 3 : 2)}\\ldots` : null;
	// A whole number (0,(9) = 1) has nothing to divide.
	const math = b === 1 ? undefined : [`${sign}${frac(a, b)} = ${written ? `${sign}${written} = ` : ''}\\hl{${periodicTex({ ...e, neg: !!sign })}}`];
	return {
		say: b === 1 ? 'Controlla: la frazione è un numero intero.' : 'Controlla: dividi il numeratore per il denominatore.',
		math,
		then: same(e, x) ? 'Ritrovi il numero di partenza: la frazione è giusta.' : `È lo stesso numero di partenza, scritto in un altro modo: $${periodicTex(x)} = ${periodicTex({ ...e, neg: x.neg })}$.`
	};
}

export function frazioneGeneratrice(input: string): Outcome {
	const x = parsePeriodic(input);
	if (typeof x === 'string') return fail(x);
	const sign = x.neg ? '-' : '';
	const given = periodicTex(x);
	const kind = x.period ? (x.ante ? 'decimale periodico misto' : 'decimale periodico semplice') : x.ante ? 'decimale limitato' : 'numero intero';
	const label = `Frazione generatrice di ${periodicText(x)}`;

	if (!x.ante && !x.period) {
		const n = Number(x.int);
		return {
			ok: true,
			rows: [
				{ label, value: `$${sign}\\frac{${intTex(n)}}{1}$` },
				{ label: 'Tipo di numero', value: kind }
			],
			copy: `${sign}${intText(n)}/1`,
			steps: [{ say: 'Il numero è intero: scrivilo con denominatore $1$.', math: [`${given} = \\hl{${sign}\\frac{${intTex(n)}}{1}}`] }]
		};
	}

	let num: number;
	let den: number;
	const steps: Step[] = [];
	if (!x.period) {
		num = Number(x.int + x.ante);
		den = 10 ** x.ante.length;
		const k = x.ante.length;
		steps.push(
			{
				say: 'Conta le cifre dopo la virgola.',
				math: [`\\text{denominatore} = \\hl{${intTex(den)}}`],
				then: `${k === 1 ? 'È una' : `Sono $${k}$`}: al denominatore scrivi $1$ seguito da ${k === 1 ? 'uno zero' : `$${k}$ zeri`}.`
			},
			{ say: 'Al numeratore scrivi il numero senza la virgola.', math: [`${given} = ${sign}\\frac{\\hl{${intTex(num)}}}{${intTex(den)}}`], then: x.neg ? 'Il segno meno resta davanti alla frazione.' : undefined }
		);
	} else {
		const whole = Number(x.int + x.ante + x.period);
		const before = Number(x.int + x.ante);
		num = whole - before;
		den = Number('9'.repeat(x.period.length) + '0'.repeat(x.ante.length));
		const p = x.period.length;
		const q = x.ante.length;
		steps.push(
			{
				say: 'Riconosci le parti del numero.',
				table: { head: ['Parte intera', 'Antiperiodo', 'Periodo'], rows: [[`$${numTex(x.int)}$`, x.ante ? `$${x.ante}$` : 'nessuno', `$${x.period}$`]] },
				then: x.ante ? 'È un periodico misto: tra la virgola e il periodo c’è l’antiperiodo.' : 'È un periodico semplice: il periodo comincia subito dopo la virgola.'
			},
			{
				say: 'Al numeratore: il numero senza virgola meno le cifre prima del periodo.',
				math: [`${intTex(whole)} - ${intTex(before)} = \\hl{${intTex(num)}}`],
				then: `Il periodo si scrive una volta sola: $${intTex(whole)}$. Prima del periodo c’è $${intTex(before)}$.`
			},
			{
				say: q ? 'Al denominatore: un $9$ per ogni cifra del periodo, uno $0$ per ogni cifra dell’antiperiodo.' : 'Al denominatore: un $9$ per ogni cifra del periodo.',
				math: [`\\text{denominatore} = \\hl{${intTex(den)}}`],
				then: `Il periodo ha ${p === 1 ? 'una cifra' : `$${p}$ cifre`}${q ? `, l’antiperiodo ${q === 1 ? 'una' : `$${q}$`}` : ''}.`
			}
		);
	}

	const g = gcd(num, den);
	const a = num / g;
	const b = den / g;
	const lines = [`${given} = ${x.period ? `${sign}\\frac{${intTex(Number(x.int + x.ante + x.period))} - ${intTex(Number(x.int + x.ante))}}{${intTex(den)}}` : `${sign}${frac(num, den)}`}`];
	if (x.period) lines.push(`= ${sign}${frac(num, den)}`);
	if (g > 1 && num > 0) lines.push(`= ${sign}\\frac{${intTex(num)} : ${intTex(g)}}{${intTex(den)} : ${intTex(g)}}`);
	lines.push(`= \\hl{${a ? sign : ''}${frac(a, b)}}`);
	steps.push({
		say: 'Scrivi la frazione e riducila ai minimi termini.',
		math: lines,
		then: num === 0 ? 'Il numero vale zero.' : g > 1 ? `Dividi numeratore e denominatore per il loro MCD, che è $${intTex(g)}$.` : 'Il MCD è $1$: la frazione è già ai minimi termini.'
	});
	if (x.period && num > 0) steps.push(checkStep(x, a, b, sign));

	return {
		ok: true,
		rows: [
			{ label, value: `$${a ? sign : ''}${frac(a, b)}$` },
			{ label: 'Tipo di numero', value: kind }
		],
		copy: fracText(x.neg, a, b),
		steps
	};
}
