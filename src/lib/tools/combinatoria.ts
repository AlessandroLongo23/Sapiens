import { Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { parseDecimal } from './numbers';
import { sumLines } from './media-mediana-moda';

/**
 * Factorial and combinatorics as the Italian textbooks write them: $P_n = n!$, $D_{n,k}$ and $D'_{n,k}$ for
 * dispositions without and with repetition, $C_{n,k} = \binom{n}{k}$ and $C'_{n,k}$ for combinations, and the
 * permutations with repetition of a word (anagrams) or of groups of equal objects. Exact integers with BigInt: 90
 * choose 6 or 30! never lose a digit. The BigInt helpers are shared with the binomial distribution.
 */

/**
 * Largest n (and k) accepted: 400! has 869 digits. KaTeX stops at about 1100 digits with thin spaces (its maxExpand),
 * and a longer number is no use on a page.
 */
export const MAX_N = 400;
/** Most digits of a result, for the powers of the dispositions with repetition. */
const MAX_DIGITS = 1000;
/** Products longer than this get the running table only up to it; beyond, just the result. */
const TABLE_MAX = 30;
/** Factors written in full on one line; more are shortened with dots. */
const INLINE_FACTORS = 6;
/** Results with more digits get a line in scientific notation. */
const SCI_FROM = 13;

/** A whole number with thin spaces from 10 000 up, as `intTex` does, for any size. */
export function bigTex(n: bigint): string {
	const s = (n < 0n ? -n : n).toString();
	const body = s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s;
	return n < 0n ? `-${body}` : body;
}

/** A whole number for copying: "10 000". */
export function bigText(n: bigint): string {
	const s = (n < 0n ? -n : n).toString();
	const body = s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s;
	return n < 0n ? `-${body}` : body;
}

/** How many digits a positive integer has. */
export const digitsOf = (n: bigint): number => (n < 0n ? -n : n).toString().length;

/**
 * A positive integer in scientific notation, rounded half up to `sig` significant digits: 3 628 800 → "3{,}6288 \cdot
 * 10^{6}" in LaTeX and "3,6288 · 10^6" in text.
 */
export function sciBig(n: bigint, sig = 5): { tex: string; text: string } {
	const s = n.toString();
	let exp = s.length - 1;
	let mant = s.length > sig ? (BigInt(s.slice(0, sig + 1)) + 5n) / 10n : BigInt(s.padEnd(sig, '0'));
	if (mant.toString().length > sig) {
		mant /= 10n;
		exp++;
	}
	const m = mant.toString();
	const frac = m.slice(1).replace(/0+$/, '');
	return { tex: `${m[0]}${frac ? `{,}${frac}` : ''} \\cdot 10^{${exp}}`, text: `${m[0]}${frac ? `,${frac}` : ''} · 10^${exp}` };
}

/** $n(n-1)\cdots(n-k+1)$, the product of k whole numbers going down from n; 1 when k is 0. */
export function falling(n: number, k: number): bigint {
	let p = 1n;
	for (let i = 0; i < k; i++) p *= BigInt(n - i);
	return p;
}

export const factorial = (n: number): bigint => falling(n, n);

/** $\binom{n}{k}$, exact. */
export function binomial(n: number, k: number): bigint {
	if (k < 0 || k > n) return 0n;
	const j = Math.min(k, n - k);
	return falling(n, j) / factorial(j);
}

/**
 * The product $n \cdot (n-1) \cdot \ldots$ of k factors as one line: in full up to six factors, else the first three,
 * dots and the last two.
 */
export function productLine(n: number, k: number): string {
	const factors = Array.from({ length: k }, (_, i) => n - i);
	if (k <= INLINE_FACTORS) return factors.join(' \\cdot ');
	return [...factors.slice(0, 3), '\\ldots', ...factors.slice(-2)].join(' \\cdot ');
}

/**
 * The working of a product of k factors going down from n, named `name` ("7!", "D_{7,3}"): the product and its value
 * on two lines, or, when the dots hide some factors, a table multiplying one factor at a time (up to 30 factors).
 */
export function productSteps(name: string, n: number, k: number, say: string): Step[] {
	const value = falling(n, k);
	const line = `${name} = ${productLine(n, k)}`;
	if (k <= INLINE_FACTORS || k > TABLE_MAX) {
		const step: Step = { say, math: [line, `= \\hl{${bigTex(value)}}`] };
		if (k > TABLE_MAX) step.then = `Il risultato ha $${digitsOf(value)}$ cifre.`;
		return [step];
	}
	const rows: string[][] = [];
	let p = 1n;
	// From the smallest factor up: 1 · 2 = 2, 2 · 3 = 6…
	for (let f = n - k + 1; f <= n; f++) {
		const prev = p;
		p *= BigInt(f);
		const last = f === n;
		const cell = rows.length === 0 ? bigTex(p) : `${bigTex(prev)} \\cdot ${f} = ${last ? `\\hl{${bigTex(p)}}` : bigTex(p)}`;
		rows.push([`$${f}$`, `$${cell}$`]);
	}
	return [
		{ say, math: [line] },
		{ say: 'Moltiplica un fattore alla volta, partendo dal più piccolo.', table: { head: ['Fattore', 'Prodotto'], rows } }
	];
}

/** The answer's rows for a big whole number: its value, and for long ones scientific notation and digits. */
function bigRows(label: string, value: bigint): ResultRow[] {
	const rows: ResultRow[] = [{ label, value: `$${bigTex(value)}$` }];
	const d = digitsOf(value);
	if (d >= SCI_FROM) rows.push({ label: 'In notazione scientifica', value: `$\\approx ${sciBig(value).tex}$` }, { label: 'Numero di cifre', value: `$${d}$` });
	return rows;
}

/** A whole number from `lo` to `hi`, or the reason it is not. */
function readInt(input: string, lo: number, hi: number, what: string, example: number): number | string {
	const r = parseDecimal(input);
	const ask = `Scrivi ${what}, un numero intero da ${lo} a ${hi}, per esempio ${example}.`;
	if (!r) return input.trim() ? `"${input.trim()}" non è un numero. ${ask}` : ask;
	if (!r.isInteger() || r.num < lo || r.num > hi) return r.num > hi && r.isInteger() ? `Al massimo ${hi}: il risultato sarebbe troppo lungo da leggere. ${ask}` : ask;
	return r.num;
}

// ---------------------------------------------------------------- factorial

export function fattoriale(input: string): Outcome {
	const n = readInt(input, 0, MAX_N, 'il numero', 6);
	if (typeof n === 'string') return fail(n);
	const value = factorial(n);
	const rows = bigRows(`Fattoriale di ${n}`, value);
	const done = (steps: Step[]): Outcome => ({ ok: true, rows, copy: bigText(value), steps });
	if (n === 0)
		return done([
			{
				say: 'Per definizione il fattoriale di $0$ vale $1$.',
				math: ['0! = \\hl{1}'],
				then: 'È una convenzione: tiene giuste le formule del calcolo combinatorio, come $\\binom{n}{0} = 1$.'
			}
		]);
	if (n === 1) return done([{ say: "Il prodotto ha un solo fattore, l'$1$.", math: ['1! = \\hl{1}'] }]);
	return done(productSteps(`${n}!`, n, n, `Moltiplica tutti i numeri interi da $${n}$ fino a $1$.`));
}

// ---------------------------------------------------------------- combinatorics

export type ComboMode = 'perm' | 'permrip' | 'disp' | 'disprip' | 'comb' | 'combrip';

/** Groups for the working when it has more than five steps. */
function grouped(steps: Step[], split: number): Step[] {
	if (steps.length <= 5) return steps;
	return steps.map((s, i) => (i === 0 ? { ...s, group: 'La formula' } : i === split ? { ...s, group: 'Il calcolo' } : s));
}

/** The steps of $\binom{n}{k}$ from its numerator and denominator, with the symmetry when it shortens the product. */
function binomialSteps(n: number, k: number, name: string): Step[] {
	const steps: Step[] = [];
	const j = Math.min(k, n - k);
	if (j < k)
		steps.push({
			say: `Scegliere $${k}$ oggetti è come scartarne $${n - k}$: usa $${n - k}$.`,
			math: [`\\binom{${n}}{${k}} = \\binom{${n}}{${n - k}}`],
			then: 'I fattori da moltiplicare sono di meno.'
		});
	if (j === 0) {
		steps.push({ say: 'Scegliere tutti o nessuno si può in un modo solo.', math: [`${name} = \\hl{1}`] });
		return steps;
	}
	const num = falling(n, j);
	const den = factorial(j);
	steps.push(...productSteps(`D_{${n},${j}}`, n, j, `Moltiplica $${j}$ numeri, partendo da $${n}$ e scendendo di uno.`));
	steps.push(...(j === 1 ? [{ say: 'Il fattoriale di $1$ vale $1$.', math: ['1! = 1'] }] : productSteps(`${j}!`, j, j, `Calcola $${j}!$, i modi di mettere in ordine $${j}$ oggetti.`)));
	steps.push({ say: 'Dividi il primo risultato per il secondo.', math: [`${name} = \\dfrac{${bigTex(num)}}{${bigTex(den)}}`, `= \\hl{${bigTex(num / den)}}`] });
	return steps;
}

/** Letters of a word, or group sizes: "MATEMATICA" or "3 2 2". */
function readRepeats(input: string): { groups: { name: string; count: number }[]; word: string | null } | string {
	const s = input.trim();
	const example = 'per esempio MATEMATICA, oppure 3 2 2 per tre oggetti uguali, poi due, poi altri due';
	if (!s) return `Scrivi una parola o quante volte si ripete ogni oggetto, ${example}.`;
	if (/\p{L}/u.test(s)) {
		const letters = [...s.toUpperCase()].filter((c) => /\p{L}/u.test(c));
		if (letters.length > MAX_N) return `Al massimo ${MAX_N} lettere: scrivi una parola più corta.`;
		const counts = new Map<string, number>();
		for (const c of letters) counts.set(c, (counts.get(c) ?? 0) + 1);
		return { groups: [...counts].map(([name, count]) => ({ name, count })), word: letters.join('') };
	}
	const parts = s.split(/[\s;,]+/).filter(Boolean);
	const groups: { name: string; count: number }[] = [];
	for (const p of parts) {
		const r = parseDecimal(p);
		if (!r || !r.isInteger() || r.num < 1) return `"${p}" non va bene: scrivi numeri interi da 1 in su, ${example}.`;
		groups.push({ name: `${groups.length + 1}`, count: r.num });
	}
	if (groups.reduce((a, g) => a + g.count, 0) > MAX_N) return `Al massimo ${MAX_N} oggetti in tutto: il risultato sarebbe troppo lungo da leggere.`;
	return { groups, word: null };
}

function permutationsWithRepeats(input: string): Outcome {
	const read = readRepeats(input);
	if (typeof read === 'string') return fail(read);
	const { groups, word } = read;
	const n = groups.reduce((a, g) => a + g.count, 0);
	const repeated = groups.filter((g) => g.count > 1);
	const value = factorial(n) / repeated.reduce((a, g) => a * factorial(g.count), 1n);
	const steps: Step[] = [];
	if (word)
		steps.push({
			say: 'Conta quante volte compare ogni lettera.',
			table: { head: ['Lettera', 'Quante volte'], rows: groups.map((g) => [g.name, `$${g.count > 1 ? `\\hl{${g.count}}` : g.count}$`]) },
			then: `In tutto le lettere sono $${n}$.`
		});
	else steps.push({ say: 'Somma gli oggetti di tutti i gruppi.', math: sumLines(groups.map((g) => Rational.of(g.count))) });

	if (!repeated.length) {
		steps.push(
			{ say: 'Nessun oggetto si ripete: sono permutazioni semplici.', math: [`P_{${n}} = ${n}!`] },
			...(n === 1 ? [{ say: 'Il fattoriale di $1$ vale $1$.', math: ['1! = \\hl{1}'] }] : productSteps(`${n}!`, n, n, `Moltiplica i numeri interi da $${n}$ fino a $1$.`))
		);
	} else {
		const facts = repeated.map((g) => `${g.count}!`).join(' \\cdot ');
		steps.push({
			say: 'Usa la formula delle permutazioni con ripetizione.',
			math: [`P = \\dfrac{${n}!}{${facts}}`],
			then: 'Scambiare tra loro oggetti uguali non dà un ordine nuovo: per questo si divide.'
		});
		const distinct = [...new Set(repeated.map((g) => g.count))].sort((a, b) => b - a);
		steps.push({ say: 'Calcola i fattoriali.', math: [`${n}! = ${bigTex(factorial(n))}`, ...distinct.map((c) => `${c}! = ${bigTex(factorial(c))}`)] });
		const den = repeated.reduce((a, g) => a * factorial(g.count), 1n);
		const denLine = repeated.map((g) => bigTex(factorial(g.count))).join(' \\cdot ');
		steps.push({
			say: 'Dividi il numeratore per il prodotto dei fattoriali.',
			math: [`P = \\dfrac{${bigTex(factorial(n))}}{${denLine}}`, ...(repeated.length > 1 ? [`= \\dfrac{${bigTex(factorial(n))}}{${bigTex(den)}}`] : []), `= \\hl{${bigTex(value)}}`]
		});
	}
	const label = word ? `Anagrammi di ${word}, anche senza senso` : `Permutazioni con ripetizione di ${n} oggetti`;
	return { ok: true, rows: bigRows(label, value), copy: bigText(value), steps: grouped(steps, 1) };
}

export function combinatoria(mode: ComboMode, nInput: string, kInput: string, repeats = ''): Outcome {
	if (mode === 'permrip') return permutationsWithRepeats(repeats);
	const n = readInt(nInput, 1, MAX_N, 'quanti sono gli oggetti', 7);
	if (typeof n === 'string') return fail(n);

	if (mode === 'perm') {
		const value = factorial(n);
		const steps: Step[] = [
			{ say: 'Usa la formula delle permutazioni semplici.', math: [`P_{${n}} = ${n}!`], then: `Sono i modi di mettere in fila $${n}$ oggetti diversi.` },
			...(n === 1 ? [{ say: 'Il fattoriale di $1$ vale $1$.', math: ['1! = \\hl{1}'] }] : productSteps(`${n}!`, n, n, `Moltiplica i numeri interi da $${n}$ fino a $1$.`))
		];
		return { ok: true, rows: bigRows(`Permutazioni di ${n} oggetti`, value), copy: bigText(value), steps };
	}

	const k = readInt(kInput, 0, MAX_N, 'quanti oggetti scegli', 3);
	if (typeof k === 'string') return fail(k);
	if ((mode === 'disp' || mode === 'comb') && k > n)
		return fail(`Senza ripetizione non puoi scegliere ${k} oggetti diversi tra ${n}: k deve essere al massimo ${n}, per esempio ${Math.min(3, n)}. Se un oggetto si può ripetere, scegli il modo con ripetizione.`);

	if (mode === 'disp') {
		const value = falling(n, k);
		const name = `D_{${n},${k}}`;
		const steps: Step[] = [
			{
				say: 'Usa la formula delle disposizioni semplici.',
				math: ['D_{n,k} = n \\cdot (n-1) \\cdot \\ldots \\cdot (n-k+1)'],
				then: `Per il primo posto hai $${n}$ scelte, per il secondo una in meno, e così via per $${k}$ posti.`
			},
			...(k === 0 ? [{ say: 'Riempire zero posti si può in un modo solo.', math: [`${name} = \\hl{1}`] }] : productSteps(name, n, k, `Moltiplica $${k}$ numeri, partendo da $${n}$ e scendendo di uno.`))
		];
		return { ok: true, rows: bigRows(`Disposizioni semplici di ${n} oggetti di classe ${k}`, value), copy: bigText(value), steps };
	}

	if (mode === 'disprip') {
		if (k * Math.log10(n) >= MAX_DIGITS) return fail(`Il risultato avrebbe più di ${MAX_DIGITS} cifre: prova con numeri più piccoli, per esempio ${n} e 3.`);
		const value = BigInt(n) ** BigInt(k);
		const name = `D'_{${n},${k}}`;
		const pow = k >= 2 && k <= INLINE_FACTORS ? [`${name} = ${Array.from({ length: k }, () => n).join(' \\cdot ')}`] : [`${name} = ${n}^{${k}}`];
		const steps: Step[] = [
			{ say: 'Usa la formula delle disposizioni con ripetizione.', math: ["D'_{n,k} = n^k"], then: `Ognuno dei $${k}$ posti può avere uno qualunque degli $${n}$ oggetti.` },
			k === 0
				? { say: 'Ogni numero elevato alla zero vale $1$.', math: [...pow, '= \\hl{1}'] }
				: { say: `Moltiplica $${n}$ per sé stesso $${k}$ volte.`, math: [...pow, `= \\hl{${bigTex(value)}}`] }
		];
		return { ok: true, rows: bigRows(`Disposizioni con ripetizione di ${n} oggetti di classe ${k}`, value), copy: bigText(value), steps };
	}

	if (mode === 'comb') {
		const value = binomial(n, k);
		const steps: Step[] = [
			{
				say: 'Usa la formula delle combinazioni semplici.',
				math: ['C_{n,k} = \\binom{n}{k} = \\dfrac{D_{n,k}}{k!}'],
				then: `L'ordine non conta: si dividono le disposizioni per i modi di ordinare i $${k}$ oggetti scelti.`
			},
			...binomialSteps(n, k, `C_{${n},${k}}`)
		];
		return { ok: true, rows: bigRows(`Combinazioni semplici di ${n} oggetti di classe ${k}`, value), copy: bigText(value), steps: grouped(steps, 1) };
	}

	// Combinations with repetition: C'_{n,k} = binom(n + k - 1, k).
	const m = n + k - 1;
	const value = binomial(m, k);
	const steps: Step[] = [
		{
			say: 'Usa la formula delle combinazioni con ripetizione.',
			math: ["C'_{n,k} = \\binom{n+k-1}{k}"],
			then: 'Sono le combinazioni semplici di $n + k - 1$ oggetti.'
		},
		{ say: 'Calcola il numero in alto nel coefficiente binomiale.', math: [`${n} + ${k} - 1 = ${m}`, `C'_{${n},${k}} = \\binom{${m}}{${k}}`] },
		...binomialSteps(m, k, `C'_{${n},${k}}`)
	];
	return { ok: true, rows: bigRows(`Combinazioni con ripetizione di ${n} oggetti di classe ${k}`, value), copy: bigText(value), steps: grouped(steps, 1) };
}
