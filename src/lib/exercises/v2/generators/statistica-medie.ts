/**
 * Media, mediana e moda (lesson slug statistica-medie). Spec: specs/exercises/statistica-medie.md
 *
 * Seven levels in the order of the lesson: the mean of a list (with negatives and zero); the
 * weighted mean of marks; the mean from a frequency table; the median of an unsorted list; median
 * and mode from a table (and the mode of a qualitative character or of a list with two modes or
 * none); which index describes data with an outlier, or which indices a character allows; the
 * approximate mean of data in classes. Every exercise starts from the answer: the data are drawn,
 * or completed, so that mean and median are integers or decimals with at most two digits.
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { decimalLatex, shuffle, toDecimal } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'statistica-medie';

// ---------------------------------------------------------------------------
// Numbers

/** 13000 → "13\,000" (thin space from five digits, as the lesson writes it); 7800 stays. */
function group(s: string): string {
	const m = /^(-?)(\d+)(.*)$/.exec(s);
	if (!m || m[2].length < 5) return s;
	return `${m[1]}${m[2].replace(/\B(?=(\d{3})+(?!\d))/g, '\\,')}${m[3]}`;
}

/** A finite decimal with at most two digits after the comma, or null. */
function dec(r: Rational): string | null {
	const d = toDecimal(r, 2, 0);
	return d ? group(decimalLatex(d)) : null;
}

function num(r: Rational | number): string {
	const v = typeof r === 'number' ? q(r) : r;
	const s = dec(v);
	if (s === null) throw new Error(`${ID}: ${v.toString()} has more than two decimals`);
	return s;
}

const t = (s: string) => `\\text{${s}}`;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const WORDS = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci'];

/** a + b - c + d, the signs merged. */
function sumLatex(xs: (number | Rational)[]): string {
	return xs
		.map((x, i) => {
			const v = typeof x === 'number' ? q(x) : x;
			if (i === 0) return num(v);
			return v.sign() < 0 ? `- ${num(v.neg())}` : `+ ${num(v)}`;
		})
		.join(' ');
}

/** The data side by side: the page shows them in a row that wraps, with commas. */
const givens = (xs: number[]) => xs.map((x) => num(x)).join(',\\quad ');
/** The data as a list inside a step. */
const listed = (xs: number[]) => xs.map((x) => num(x)).join(',\\ ');

function median(xs: number[]): Rational {
	const s = [...xs].sort((a, b) => a - b);
	const n = s.length;
	return n % 2 ? q(s[(n - 1) / 2]) : q(s[n / 2 - 1] + s[n / 2], 2);
}

/** The value at position p (1-based) of the sorted data of a table. */
function atPosition(values: number[], freqs: number[], p: number): number {
	let c = 0;
	for (let i = 0; i < values.length; i++) {
		c += freqs[i];
		if (p <= c) return values[i];
	}
	throw new Error(`${ID}: position ${p} beyond ${c}`);
}

function expand(values: number[], freqs: number[]): number[] {
	return values.flatMap((v, i) => Array.from({ length: freqs[i] }, () => v));
}

// ---------------------------------------------------------------------------
// Multiple choice

/** The answer, then the mistakes that are writable and different, then neighbours. */
function numberChoice(rng: Rng, answer: Rational, mistakes: Rational[]): ChoiceAnswer {
	const opts: ChoiceOption[] = [{ latex: num(answer), values: [answer.toString()] }];
	const add = (r: Rational) => {
		const s = dec(r);
		if (s !== null && opts.length < 4 && !opts.some((o) => o.values[0] === r.toString())) opts.push({ latex: s, values: [r.toString()] });
	};
	mistakes.forEach(add);
	const step = answer.isInteger() ? q(1) : answer.mul(q(2)).isInteger() ? q(1, 2) : q(1, 10);
	for (let d = 1; opts.length < 4 && d < 60; d++) {
		add(answer.add(step.mul(q(d))));
		add(answer.sub(step.mul(q(d))));
	}
	return mix(rng, opts);
}

function mix(rng: Rng, opts: ChoiceOption[]): ChoiceAnswer {
	if (opts.length !== 4) throw new Error(`${ID}: ${opts.length} options`);
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// Tables

/** A vertical frequency table, as in the lesson. Cells starting with "[" are braced (after \\ it would read as a length). */
function vTable(head: [string, string], rows: [string, string][]): string {
	const cell = (c: string) => (c.startsWith('[') ? `{${c}}` : c);
	return `\\begin{array}{c|c} ${head[0]} & ${head[1]} \\\\ \\hline ${rows.map((r) => r.map(cell).join(' & ')).join(' \\\\ ')} \\end{array}`;
}

interface NumCtx {
	id: string;
	/** Column header, without x_i. */
	head: string;
	values: (rng: Rng) => number[];
	maxF: number;
	prose: (n: number) => string;
}

const range = (a: number, k: number) => Array.from({ length: k }, (_, i) => a + i);

const NUM_CTX: NumCtx[] = [
	{ id: 'voti', head: 'Voto', values: (rng) => range(rng.int(3, 5), rng.int(5, 6)), maxF: 9, prose: (n) => `I voti di una verifica in una classe di ${n} studenti sono nella tabella.` },
	{ id: 'fratelli', head: 'Fratelli', values: (rng) => range(0, rng.int(4, 5)), maxF: 9, prose: (n) => `In una classe di ${n} studenti si è contato il numero di fratelli e sorelle di ciascuno.` },
	{ id: 'gol', head: 'Gol', values: (rng) => range(0, rng.int(4, 6)), maxF: 8, prose: (n) => `Una squadra ha giocato ${n} partite. La tabella dice in quante partite ha segnato ogni numero di gol.` },
	{ id: 'libri', head: 'Libri', values: (rng) => range(0, rng.int(4, 6)), maxF: 8, prose: (n) => `Si è chiesto a ${n} ragazzi quanti libri hanno letto durante l'estate.` },
	{ id: 'scarpe', head: 'Numero', values: (rng) => range(rng.int(36, 38), rng.int(5, 6)), maxF: 8, prose: (n) => `Un negozio ha venduto ${n} paia di scarpe da ginnastica, con questi numeri.` },
];

function numTable(ctx: NumCtx, values: number[], freqs: number[]): string {
	return vTable(
		[`${t(`${ctx.head} `)}x_i`, `${t('Frequenza ')}f_i`],
		values.map((v, i) => [num(v), String(freqs[i])]),
	);
}

// ---------------------------------------------------------------------------
// Levels

interface Built {
	prompt: string;
	problem: string;
	steps: string[];
	solution: string;
	answer: Answer;
	mistakes?: Rational[];
	params: Record<string, unknown>;
}

const NAMES = ['Giulia', 'Marco', 'Sara', 'Luca', 'Anna', 'Davide', 'Elena', 'Matteo', 'Chiara', 'Pietro'];

// Level 1: the mean of a list -------------------------------------------------

const L1_CTX: { id: string; lo: number; hi: number; neg: boolean; prose: (n: number, rng: Rng) => string | null }[] = [
	{ id: 'numeri', lo: -9, hi: 15, neg: true, prose: () => null },
	{ id: 'temperature', lo: -6, hi: 9, neg: true, prose: (n) => `Le temperature minime di ${WORDS[n]} giorni, in gradi, sono:` },
	{ id: 'punti', lo: 2, hi: 25, neg: false, prose: (n, rng) => `I punti segnati da ${rng.pick(NAMES)} in ${WORDS[n]} partite di basket sono:` },
	{ id: 'voti', lo: 3, hi: 10, neg: false, prose: (n, rng) => `I voti di ${rng.pick(NAMES)} in ${WORDS[n]} verifiche di matematica sono:` },
];

function level1(rng: Rng): Built {
	const integer = rng.next() < 0.5;
	const ctx = rng.pick(L1_CTX);
	for (let i = 0; i < 20000; i++) {
		const n = rng.int(4, 7);
		const xs = Array.from({ length: n }, () => rng.int(ctx.lo, ctx.hi));
		if (ctx.neg && !xs.some((x) => x < 0)) continue;
		if (new Set(xs).size < n - 1) continue;
		const S = sum(xs);
		const mean = q(S, n);
		if (mean.isInteger() !== integer || dec(mean) === null) continue;
		const zero = xs.includes(0);
		const neg = xs.some((x) => x < 0);
		const mistakes = [...(zero ? [q(S, n - 1)] : []), ...(neg ? [q(sum(xs.map(Math.abs)), n)] : []), median(xs), q(S, n + 1)];
		const prose = ctx.prose(n, rng);
		const steps = [`${t('La somma dei dati è ')}${sumLatex(xs)} = ${num(S)}`];
		if (zero) steps.push(`${t('Lo ')}0${t(' è un dato come gli altri: non cambia la somma, ma conta nel numero dei dati.')}`);
		steps.push(`${t('I dati sono ')}${n}${t(', quindi ')}\\bar{x} = \\dfrac{${num(S)}}{${n}} = ${num(mean)}`);
		return {
			prompt: 'Calcola la media aritmetica.',
			problem: prose ? textBlock(prose, 46, [givens(xs)]) : givens(xs),
			steps,
			solution: `\\bar{x} = ${num(mean)}`,
			answer: { kind: 'number', value: mean.toString() },
			mistakes,
			params: { case: integer ? 'intera' : 'decimale', context: ctx.id, data: xs.map(String) },
		};
	}
	throw new Error(`${ID}: no level 1 data`);
}

// Level 2: weighted mean ------------------------------------------------------

const SUBJECTS = ['matematica', 'italiano', 'inglese', 'storia', 'fisica', 'scienze'];

function level2(rng: Rng): Built {
	const k = rng.next() < 0.6 ? 3 : 4;
	for (let i = 0; i < 20000; i++) {
		const marks = shuffle(rng, range(3, 8)).slice(0, k);
		const weights = marks.map(() => rng.int(1, 3));
		if (new Set(weights).size === 1) continue;
		const W = sum(weights);
		const P = sum(marks.map((m, j) => m * weights[j]));
		const mean = q(P, W);
		if (dec(mean) === null || mean.equals(q(sum(marks), k))) continue;
		const name = rng.pick(NAMES);
		const table = `\\begin{array}{c|${'c'.repeat(k)}} ${t('Voto')} & ${marks.join(' & ')} \\\\ \\hline ${t('Peso')} & ${weights.join(' & ')} \\end{array}`;
		const products = marks.map((m, j) => `${m} \\cdot ${weights[j]}`).join(' + ');
		return {
			prompt: 'Calcola la media ponderata.',
			problem: textBlock(`Nel primo periodo ${name} ha preso questi voti in ${rng.pick(SUBJECTS)}. Il peso dice quante volte conta ogni voto.`, 46, [table]),
			steps: [
				`${t('La somma dei pesi è ')}${weights.join(' + ')} = ${W}`,
				`\\bar{x} = \\dfrac{${products}}{${W}} = \\dfrac{${P}}{${W}} = ${num(mean)}`,
				t('Si divide per la somma dei pesi, non per il numero dei voti.'),
			],
			solution: `\\bar{x} = ${num(mean)}`,
			answer: { kind: 'number', value: mean.toString() },
			mistakes: [q(P, k), q(sum(marks), k), q(P, W + 1)],
			params: { case: `k=${k}`, marks: marks.map(String), weights: weights.map(String) },
		};
	}
	throw new Error(`${ID}: no level 2 data`);
}

// Level 3: mean from a frequency table ---------------------------------------

function drawTable(rng: Rng, ctx: NumCtx, nLo: number, nHi: number, ok: (values: number[], freqs: number[]) => boolean) {
	for (let i = 0; i < 20000; i++) {
		const values = ctx.values(rng);
		const freqs = values.map(() => rng.int(1, ctx.maxF));
		const n = sum(freqs);
		if (n < nLo || n > nHi) continue;
		if (ok(values, freqs)) return { values, freqs, n };
	}
	throw new Error(`${ID}: no table for ${ctx.id}`);
}

function level3(rng: Rng): Built {
	const ctx = rng.pick(NUM_CTX);
	const { values, freqs, n } = drawTable(rng, ctx, 10, 30, (v, f) => dec(q(sum(v.map((x, j) => x * f[j])), sum(f))) !== null);
	const S = sum(values.map((x, j) => x * freqs[j]));
	const mean = q(S, n);
	const k = values.length;
	return {
		prompt: 'Calcola la media.',
		problem: textBlock(ctx.prose(n), 46, [numTable(ctx, values, freqs)]),
		steps: [
			`${t('Somma dei prodotti ')}x_i \\cdot f_i${t(': ')}${values.map((v, j) => `${v} \\cdot ${freqs[j]}`).join(' + ')} = ${S}`,
			`${t('Numero dei dati, la somma delle frequenze: ')}${freqs.join(' + ')} = ${n}`,
			`\\bar{x} = \\dfrac{${S}}{${n}} = ${num(mean)}`,
			`${t('Si divide per ')}${n}${t(', il numero dei dati, e non per ')}${k}${t(', il numero delle righe.')}`,
		],
		solution: `\\bar{x} = ${num(mean)}`,
		answer: { kind: 'number', value: mean.toString() },
		mistakes: [q(S, k), q(sum(values), k), median(expand(values, freqs))],
		params: { case: ctx.id, values: values.map(String), freqs: freqs.map(String) },
	};
}

// Level 4: median of an unsorted list ----------------------------------------

const L4_CTX: { id: string; lo: number; hi: number; prose: (n: number) => string | null }[] = [
	{ id: 'numeri', lo: -5, hi: 20, prose: () => null },
	{ id: 'minuti', lo: 5, hi: 30, prose: (n) => `I minuti che ${WORDS[n]} studenti hanno impiegato per finire un test sono:` },
	{ id: 'punti', lo: 0, hi: 25, prose: (n) => `I punti segnati da una giocatrice di pallavolo in ${WORDS[n]} partite sono:` },
	{ id: 'altezze', lo: 150, hi: 185, prose: (n) => `Le altezze, in centimetri, di ${WORDS[n]} ragazzi sono:` },
];

/** What a student reads as "the centre" of the list as written. */
function writtenCentre(xs: number[]): Rational {
	const n = xs.length;
	return n % 2 ? q(xs[(n - 1) / 2]) : q(xs[n / 2 - 1] + xs[n / 2], 2);
}

function level4(rng: Rng): Built {
	const odd = rng.next() < 0.5;
	const ctx = rng.pick(L4_CTX);
	for (let i = 0; i < 20000; i++) {
		const n = odd ? rng.pick([5, 7, 9]) : rng.pick([6, 8, 10]);
		const xs = Array.from({ length: n }, () => rng.int(ctx.lo, ctx.hi));
		if (new Set(xs).size < n - 2) continue;
		const sorted = [...xs].sort((a, b) => a - b);
		if (xs.every((x, j) => x === sorted[j])) continue;
		const me = median(xs);
		if (writtenCentre(xs).equals(me)) continue;
		const steps = [`${t('In ordine crescente: ')}${listed(sorted)}`];
		if (odd) {
			const p = (n + 1) / 2;
			steps.push(`${t('I dati sono ')}${n}${t(', dispari: la mediana è il dato al posto ')}\\dfrac{${n} + 1}{2} = ${p}${t(', cioè ')}${num(sorted[p - 1])}`);
		} else {
			const a = sorted[n / 2 - 1], b = sorted[n / 2];
			steps.push(`${t('I dati sono ')}${n}${t(', pari: i due centrali sono al posto ')}${n / 2}${t(' e al posto ')}${n / 2 + 1}${t(', cioè ')}${num(a)}${t(' e ')}${num(b)}`);
			steps.push(`\\text{Me} = \\dfrac{${sumLatex([a, b])}}{2} = ${num(me)}`);
		}
		const prose = ctx.prose(n);
		const mistakes = [writtenCentre(xs), q(n + 1, 2), q(sum(xs), n), ...(odd ? [] : [q(sorted[n / 2 - 1])])];
		return {
			prompt: 'Trova la mediana.',
			problem: prose ? textBlock(prose, 46, [givens(xs)]) : givens(xs),
			steps,
			solution: `\\text{Me} = ${num(me)}`,
			answer: { kind: 'number', value: me.toString() },
			mistakes,
			params: { case: odd ? 'dispari' : 'pari', context: ctx.id, data: xs.map(String) },
		};
	}
	throw new Error(`${ID}: no level 4 data`);
}

// Level 5: median and mode from a table --------------------------------------

type L5Case = 'mediana-dispari' | 'mediana-pari-uguali' | 'mediana-pari-diversi' | 'moda' | 'moda-qualitativa' | 'bimodale' | 'senza-moda';

function medianCase(values: number[], freqs: number[]): L5Case {
	const n = sum(freqs);
	if (n % 2) return 'mediana-dispari';
	return atPosition(values, freqs, n / 2) === atPosition(values, freqs, n / 2 + 1) ? 'mediana-pari-uguali' : 'mediana-pari-diversi';
}

/** "Il valore 0 occupa i posti da 1 a 4", up to the value that covers position `upTo`. */
function positionSteps(values: number[], freqs: number[], upTo: number): string {
	const parts: string[] = [];
	let c = 0;
	for (let i = 0; i < values.length; i++) {
		const from = c + 1;
		c += freqs[i];
		const where = from === c ? `${t(' il posto ')}${c}` : `${t(' i posti da ')}${from}${t(' a ')}${c}`;
		parts.push(`${t(i === 0 ? 'Il valore ' : ', il valore ')}${num(values[i])}${t(' occupa')}${where}`);
		if (c >= upTo) break;
	}
	return parts.join('');
}

function level5Median(rng: Rng, want: L5Case): Built {
	const ctx = rng.pick(NUM_CTX);
	const { values, freqs, n } = drawTable(rng, ctx, 11, 30, (v, f) => medianCase(v, f) === want);
	const all = expand(values, freqs);
	const me = median(all);
	const cum = freqs.map((_, i) => sum(freqs.slice(0, i + 1)));
	const steps = [`${t('Le frequenze cumulate sono ')}${listed(cum)}`];
	const top = Math.max(...freqs);
	const mode = freqs.filter((f) => f === top).length === 1 ? [q(values[freqs.indexOf(top)])] : [];
	const mistakes: Rational[] = [q(n + 1, 2)];
	if (n % 2) {
		const p = (n + 1) / 2;
		steps.push(`${t('I dati sono ')}${n}${t(', dispari: il posto centrale è ')}\\dfrac{${n} + 1}{2} = ${p}`);
		steps.push(positionSteps(values, freqs, p));
		steps.push(`${t('Il dato al posto ')}${p}${t(' è ')}${num(me)}`);
	} else {
		const p = n / 2;
		const a = atPosition(values, freqs, p), b = atPosition(values, freqs, p + 1);
		steps.push(`${t('I dati sono ')}${n}${t(', pari: i posti centrali sono ')}${p}${t(' e ')}${p + 1}`);
		steps.push(positionSteps(values, freqs, p + 1));
		if (a === b) steps.push(`${t('I dati ai posti ')}${p}${t(' e ')}${p + 1}${t(' valgono entrambi ')}${num(a)}${t(', quindi ')}\\text{Me} = \\dfrac{${sumLatex([a, b])}}{2} = ${num(me)}`);
		else {
			steps.push(`${t('Il dato al posto ')}${p}${t(' è ')}${num(a)}${t(', quello al posto ')}${p + 1}${t(' è ')}${num(b)}`);
			steps.push(`\\text{Me} = \\dfrac{${sumLatex([a, b])}}{2} = ${num(me)}`);
			mistakes.push(q(a));
		}
	}
	mistakes.push(...mode, q(values[Math.floor((values.length - 1) / 2)]), q(sum(all), n));
	return {
		prompt: 'Trova la mediana.',
		problem: textBlock(ctx.prose(n), 46, [numTable(ctx, values, freqs)]),
		steps,
		solution: `\\text{Me} = ${num(me)}`,
		answer: { kind: 'number', value: me.toString() },
		mistakes,
		params: { case: want, context: ctx.id, values: values.map(String), freqs: freqs.map(String) },
	};
}

function level5Mode(rng: Rng): Built {
	const ctx = rng.pick(NUM_CTX);
	const { values, freqs, n } = drawTable(rng, ctx, 11, 30, (v, f) => {
		const top = Math.max(...f);
		const at = f.indexOf(top);
		return f.filter((x) => x === top).length === 1 && v[at] !== top;
	});
	const top = Math.max(...freqs);
	const mode = values[freqs.indexOf(top)];
	const second = Math.max(...freqs.filter((f) => f !== top));
	const others = values.filter((_, i) => freqs[i] === second);
	return {
		prompt: 'Trova la moda.',
		problem: textBlock(ctx.prose(n), 46, [numTable(ctx, values, freqs)]),
		steps: [
			`${t('La frequenza più alta è ')}${top}${t(', quella del valore ')}${num(mode)}`,
			`${t('La moda è il valore ')}${num(mode)}${t(', non la sua frequenza ')}${top}`,
		],
		solution: `${t('Moda: ')}${num(mode)}`,
		answer: { kind: 'number', value: String(mode) },
		mistakes: [q(top), median(expand(values, freqs)), q(others[0]), q(values[values.length - 1])],
		params: { case: 'moda', context: ctx.id, values: values.map(String), freqs: freqs.map(String) },
	};
}

const QUAL_CTX: { id: string; head: string; prose: string; modes: string[] }[] = [
	{ id: 'mezzo', head: 'Mezzo', prose: 'In una classe si è chiesto come si viene a scuola.', modes: ['Autobus', 'Auto', 'A piedi', 'Bici', 'Treno', 'Motorino'] },
	{ id: 'sport', head: 'Sport', prose: 'Si è chiesto a un gruppo di ragazzi lo sport preferito.', modes: ['Calcio', 'Pallavolo', 'Nuoto', 'Basket', 'Tennis', 'Danza'] },
	{ id: 'gelato', head: 'Gusto', prose: 'Una gelateria ha contato i coni venduti in un pomeriggio, per gusto.', modes: ['Cioccolato', 'Fragola', 'Pistacchio', 'Limone', 'Nocciola', 'Vaniglia'] },
	{ id: 'musica', head: 'Genere', prose: 'Si è chiesto agli studenti di una scuola il genere musicale preferito.', modes: ['Pop', 'Rap', 'Rock', 'Classica', 'Jazz', 'Elettronica'] },
	{ id: 'colore', head: 'Colore', prose: 'Si è chiesto ai bambini di una classe il colore preferito.', modes: ['Blu', 'Rosso', 'Verde', 'Giallo', 'Viola', 'Arancione'] },
];

function level5Qualitative(rng: Rng): Built {
	const ctx = rng.pick(QUAL_CTX);
	for (let i = 0; i < 20000; i++) {
		const k = rng.int(4, 5);
		const modes = shuffle(rng, ctx.modes).slice(0, k);
		const freqs = modes.map(() => rng.int(2, 12));
		const top = Math.max(...freqs);
		if (freqs.filter((f) => f === top).length !== 1) continue;
		const second = Math.max(...freqs.filter((f) => f !== top));
		const answer = modes[freqs.indexOf(top)];
		const runnerUp = modes[freqs.indexOf(second)];
		const rest = modes.filter((m) => m !== answer && m !== runnerUp);
		const low = (m: string) => m.toLowerCase();
		const opt = (m: string): ChoiceOption => ({ latex: t(low(m)), values: [`valore:${m}`] });
		const choice = mix(rng, [opt(answer), { latex: String(top), values: [`frequenza:${top}`] }, opt(runnerUp), opt(rng.pick(rest))]);
		return {
			prompt: 'Trova la moda.',
			problem: textBlock(ctx.prose, 46, [vTable([t(ctx.head), t('Frequenza')], modes.map((m, j) => [t(m), String(freqs[j])]))]),
			steps: [
				`${t(`La frequenza più alta è `)}${top}${t(`, quella di "${low(answer)}": la moda è "${low(answer)}", non ${top}.`)}`,
				t('Media e mediana non si possono calcolare: i dati non sono numeri e non hanno un ordine.'),
			],
			solution: t(`Moda: ${low(answer)}`),
			answer: choice,
			params: { case: 'moda-qualitativa', context: ctx.id, modes, freqs: freqs.map(String) },
		};
	}
	throw new Error(`${ID}: no qualitative table`);
}

function level5List(rng: Rng, bimodal: boolean): Built {
	const none = t("non c'è moda");
	for (let i = 0; i < 20000; i++) {
		let xs: number[];
		if (bimodal) {
			const k = rng.int(4, 6);
			const vals = shuffle(rng, range(1, 12)).slice(0, k);
			const f = rng.int(2, 3);
			xs = vals.flatMap((v, j) => Array.from({ length: j < 2 ? f : rng.int(1, f - 1) }, () => v));
		} else {
			const k = rng.int(3, 6);
			const vals = shuffle(rng, range(1, 12)).slice(0, k);
			const f = k <= 4 ? rng.int(1, 2) : 1;
			xs = vals.flatMap((v) => Array.from({ length: f }, () => v));
		}
		if (xs.length < 5 || xs.length > 10) continue;
		xs = shuffle(rng, xs);
		const counts = new Map<number, number>();
		xs.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1));
		const top = Math.max(...counts.values());
		const modes = [...counts.keys()].filter((v) => counts.get(v) === top).sort((a, b) => a - b);
		const distinct = [...counts.keys()].sort((a, b) => a - b);
		const steps = [`${t('In ordine: ')}${listed([...xs].sort((a, b) => a - b))}`];
		let choice: ChoiceAnswer;
		let solution: string;
		if (bimodal) {
			const [a, b] = modes;
			steps.push(`${num(a)}${t(' e ')}${num(b)}${t(' compaiono ')}${top}${t(' volte ciascuno, più di tutti gli altri valori: la distribuzione è bimodale.')}`);
			choice = mix(rng, [
				{ latex: `${a} ${t(' e ')} ${b}`, values: [String(a), String(b)] },
				{ latex: String(a), values: [String(a)] },
				{ latex: String(b), values: [String(b)] },
				{ latex: none, values: ['nessuna'] },
			]);
			solution = `${t('Due mode: ')}${a}${t(' e ')}${b}`;
		} else {
			steps.push(`${t('Tutti i valori compaiono ')}${top === 1 ? t('una volta sola') : `${top}${t(' volte')}`}${t(': nessuno compare più degli altri, e la distribuzione non ha moda.')}`);
			const mid = distinct[Math.floor(distinct.length / 2)];
			choice = mix(rng, [
				{ latex: none, values: ['nessuna'] },
				{ latex: String(distinct[0]), values: [String(distinct[0])] },
				{ latex: String(mid), values: [String(mid)] },
				{ latex: String(distinct[distinct.length - 1]), values: [String(distinct[distinct.length - 1])] },
			]);
			solution = t("Non c'è moda");
		}
		if (bimodal && modes.length !== 2) continue;
		if (!bimodal && modes.length !== distinct.length) continue;
		return {
			prompt: 'Trova la moda.',
			problem: givens(xs),
			steps,
			solution,
			answer: choice,
			params: { case: bimodal ? 'bimodale' : 'senza-moda', data: xs.map(String) },
		};
	}
	throw new Error(`${ID}: no list for level 5`);
}

function level5(rng: Rng): Built {
	const u = rng.next();
	if (u < 0.6) return level5Median(rng, u < 0.2 ? 'mediana-dispari' : u < 0.4 ? 'mediana-pari-uguali' : 'mediana-pari-diversi');
	if (u < 0.75) return level5Mode(rng);
	if (u < 0.9) return level5Qualitative(rng);
	return level5List(rng, u < 0.9667);
}

// Level 6: which index --------------------------------------------------------

const OUTLIER_CTX: { id: string; base: [number, number, number]; out: [number, number, number]; prose: (n: number) => string; typical: string }[] = [
	{ id: 'stipendi', base: [1100, 1700, 50], out: [5500, 9000, 100], prose: (n) => `In una piccola azienda gli stipendi mensili dei ${WORDS[n]} dipendenti, in euro, sono:`, typical: 'lo stipendio tipico' },
	{ id: 'case', base: [110, 200, 5], out: [600, 900, 10], prose: (n) => `I prezzi, in migliaia di euro, di ${WORDS[n]} appartamenti venduti in una via sono:`, typical: 'il prezzo tipico' },
	{ id: 'attesa', base: [10, 30, 1], out: [90, 150, 1], prose: (n) => `I minuti di attesa di ${WORDS[n]} clienti di una pizzeria sono:`, typical: "l'attesa tipica" },
	{ id: 'paghetta', base: [5, 20, 1], out: [60, 100, 5], prose: (n) => `La paghetta settimanale, in euro, di ${WORDS[n]} ragazzi è:`, typical: 'la paghetta tipica' },
];

function stepsOf([lo, hi, st]: [number, number, number]): number[] {
	return Array.from({ length: Math.floor((hi - lo) / st) + 1 }, (_, i) => lo + i * st);
}

const INDEX_OPTIONS = [
	{ key: 'moda', latex: t('solo la moda') },
	{ key: 'mediana,moda', latex: t('mediana e moda') },
	{ key: 'media,moda', latex: t('media e moda') },
	{ key: 'media,mediana,moda', latex: t('media, mediana e moda') },
];

const CHARACTERS: { text: string; kind: 'qualitativo' | 'ordinabile' | 'quantitativo' }[] = [
	{ text: 'il colore preferito', kind: 'qualitativo' },
	{ text: 'il mezzo con cui viene a scuola', kind: 'qualitativo' },
	{ text: 'lo sport preferito', kind: 'qualitativo' },
	{ text: 'il gusto di gelato preferito', kind: 'qualitativo' },
	{ text: 'il genere musicale preferito', kind: 'qualitativo' },
	{ text: 'la materia preferita', kind: 'qualitativo' },
	{ text: 'il giudizio sul corso di teatro (insufficiente, sufficiente, buono, ottimo)', kind: 'ordinabile' },
	{ text: 'quanto gli piace la matematica (per niente, poco, abbastanza, molto)', kind: 'ordinabile' },
	{ text: 'la taglia della maglietta (S, M, L, XL)', kind: 'ordinabile' },
	{ text: 'quanto spesso legge un libro (mai, a volte, spesso, sempre)', kind: 'ordinabile' },
	{ text: "il livello di inglese (A1, A2, B1, B2)", kind: 'ordinabile' },
	{ text: 'quanti fratelli e sorelle ha', kind: 'quantitativo' },
	{ text: 'la sua altezza in centimetri', kind: 'quantitativo' },
	{ text: 'quanti minuti impiega per arrivare a scuola', kind: 'quantitativo' },
	{ text: 'quante ore dorme la notte', kind: 'quantitativo' },
	{ text: "quanti libri ha letto nell'ultimo anno", kind: 'quantitativo' },
	{ text: 'il numero di scarpe', kind: 'quantitativo' },
];

const CHAR_ANSWER = { qualitativo: 'moda', ordinabile: 'mediana,moda', quantitativo: 'media,mediana,moda' } as const;
const CHAR_WHY = {
	qualitativo: 'Il carattere è qualitativo e le sue modalità non hanno un ordine: si può trovare solo la moda.',
	ordinabile: 'Il carattere è qualitativo ma ordinabile: ha senso il valore al centro, la mediana, oltre alla moda. La media no, perché i dati non sono numeri.',
	quantitativo: 'Il carattere è quantitativo, i dati sono numeri: si possono calcolare media, mediana e moda.',
} as const;

function level6Character(rng: Rng): Built {
	const kind = rng.pick(['qualitativo', 'ordinabile', 'quantitativo'] as const);
	const c = rng.pick(CHARACTERS.filter((x) => x.kind === kind));
	const opts = INDEX_OPTIONS.map((o) => ({ latex: o.latex, values: [o.key] }));
	return {
		prompt: 'Quali indici di posizione si possono calcolare?',
		problem: textBlock(`In una classe si chiede a ogni studente ${c.text}.`),
		steps: [t(CHAR_WHY[kind])],
		solution: INDEX_OPTIONS.find((o) => o.key === CHAR_ANSWER[kind])!.latex,
		answer: { kind: 'choice', options: opts, correct: opts.findIndex((o) => o.values[0] === CHAR_ANSWER[kind]) },
		params: { case: 'carattere', kind, character: c.text },
	};
}

function level6Outlier(rng: Rng): Built {
	const ctx = rng.pick(OUTLIER_CTX);
	const bases = stepsOf(ctx.base);
	for (let i = 0; i < 20000; i++) {
		const n = rng.pick([5, 6, 7]);
		const base = Array.from({ length: n - 1 }, () => rng.pick(bases));
		if (new Set(base).size < n - 2) continue;
		const outs = stepsOf(ctx.out).filter((o) => (sum(base) + o) % n === 0);
		if (!outs.length) continue;
		const xs = shuffle(rng, [...base, rng.pick(outs)]);
		const S = sum(xs);
		const mean = q(S, n);
		const me = median(xs);
		const centre = writtenCentre(xs);
		if (centre.equals(me) || dec(me) === null || dec(centre) === null) continue;
		const sorted = [...xs].sort((a, b) => a - b);
		const opt = (which: 'media' | 'mediana', r: Rational): ChoiceOption => ({ latex: `${t(`la ${which}: `)}${num(r)}`, values: [which, r.toString()] });
		const wrongMean = [q(S, n - 1), q(S, n + 1), mean.add(q(ctx.base[2]))].find((r) => dec(r) !== null)!;
		const choice = mix(rng, [opt('mediana', me), opt('media', mean), opt('mediana', centre), opt('media', wrongMean)]);
		const meStep =
			n % 2
				? `${t('I dati sono ')}${n}${t(': la mediana è il dato al posto ')}${(n + 1) / 2}${t(', cioè ')}${num(me)}`
				: `${t('I dati sono ')}${n}${t(': la mediana è la media dei dati ai posti ')}${n / 2}${t(' e ')}${n / 2 + 1}${t(': ')}\\text{Me} = \\dfrac{${sumLatex([sorted[n / 2 - 1], sorted[n / 2]])}}{2} = ${num(me)}`;
		return {
			prompt: "Scegli l'indice che descrive meglio i dati, con il suo valore.",
			problem: textBlock(ctx.prose(n), 46, [givens(xs)]),
			steps: [
				`${t('La somma dei dati è ')}${num(S)}${t(', e la media è ')}\\bar{x} = \\dfrac{${num(S)}}{${n}} = ${num(mean)}`,
				`${t('In ordine crescente: ')}${listed(sorted)}`,
				meStep,
				`${t('Il dato ')}${num(sorted[n - 1])}${t(' è un valore anomalo e tira in alto la media. La mediana, ')}${num(me)}${t(`, descrive meglio ${ctx.typical}.`)}`,
			],
			solution: `${t('La mediana: ')}\\text{Me} = ${num(me)}`,
			answer: choice,
			params: { case: 'anomalo', context: ctx.id, data: xs.map(String) },
		};
	}
	throw new Error(`${ID}: no outlier data`);
}

function level6(rng: Rng): Built {
	return rng.next() < 0.6 ? level6Outlier(rng) : level6Character(rng);
}

// Level 7: approximate mean of data in classes -------------------------------

const CLASS_CTX: { id: string; head: string; widths: number[]; starts: (w: number) => number[]; k: [number, number]; prose: (n: number) => string; unit: string }[] = [
	{ id: 'minuti', head: 'Minuti', widths: [5, 10], starts: () => [0], k: [3, 5], prose: (n) => `${n} studenti hanno indicato quanti minuti impiegano per arrivare a scuola.`, unit: 'minuti' },
	{ id: 'altezze', head: 'Altezza', widths: [5, 10], starts: (w) => (w === 5 ? [150, 155, 160] : [140, 150, 160]), k: [3, 5], prose: (n) => `Si è misurata l'altezza, in centimetri, di ${n} ragazzi.`, unit: 'centimetri' },
	{ id: 'test', head: 'Punti', widths: [10], starts: () => [40, 50, 60], k: [3, 5], prose: (n) => `Nella tabella ci sono i punteggi di ${n} studenti in un test.`, unit: 'punti' },
	{ id: 'zaino', head: 'Peso (kg)', widths: [2], starts: () => [2, 4], k: [3, 4], prose: (n) => `Si è pesato lo zaino di ${n} studenti, in chilogrammi.`, unit: 'chilogrammi' },
];

function level7(rng: Rng): Built {
	const ctx = rng.pick(CLASS_CTX);
	for (let i = 0; i < 20000; i++) {
		const w = rng.pick(ctx.widths);
		const a = rng.pick(ctx.starts(w));
		const k = rng.int(ctx.k[0], ctx.k[1]);
		const lows = range(0, k).map((j) => a + j * w);
		const centres = lows.map((l) => q(2 * l + w, 2));
		const freqs = lows.map(() => rng.int(1, 12));
		const n = sum(freqs);
		if (n < 10 || n > 40) continue;
		const S = centres.reduce((acc, c, j) => acc.add(c.mul(q(freqs[j]))), q(0));
		const mean = S.div(q(n));
		if (dec(mean) === null) continue;
		const table = vTable(
			[t(ctx.head), `${t('Frequenza ')}f_i`],
			lows.map((l, j) => [`[${l}, ${l + w}[`, String(freqs[j])]),
		);
		const sumC = centres.reduce((acc, c) => acc.add(c), q(0));
		return {
			prompt: 'Calcola la media approssimata con i valori centrali delle classi.',
			problem: textBlock(ctx.prose(n), 46, [table]),
			steps: [
				`${t('Il valore centrale di ')}[${lows[0]}, ${lows[0] + w}[${t(' è ')}\\dfrac{${lows[0]} + ${lows[0] + w}}{2} = ${num(centres[0])}${t('; i valori centrali sono ')}${centres.map(num).join(',\\ ')}`,
				`${t('Somma dei prodotti: ')}${centres.map((c, j) => `${num(c)} \\cdot ${freqs[j]}`).join(' + ')} = ${num(S)}`,
				`${t('Numero dei dati: ')}${freqs.join(' + ')} = ${n}`,
				`\\bar{x} \\approx \\dfrac{${num(S)}}{${n}} = ${num(mean)}`,
			],
			solution: `\\bar{x} \\approx ${num(mean)}${t(` ${ctx.unit}`)}`,
			answer: { kind: 'number', value: mean.toString() },
			mistakes: [mean.sub(q(w, 2)), mean.add(q(w, 2)), S.div(q(k)), sumC.div(q(k))],
			params: { case: ctx.id, lows: lows.map(String), width: String(w), freqs: freqs.map(String) },
		};
	}
	throw new Error(`${ID}: no classes`);
}

// ---------------------------------------------------------------------------
// Assembly

const LEVELS = [level1, level2, level3, level4, level5, level6, level7];

function generate(rng: Rng, level: number): Sample {
	const f = LEVELS[level - 1];
	if (!f) throw new Error(`${ID}: unknown level ${level}`);
	const b = f(rng);
	const params = { ...b.params, ...(b.mistakes ? { mistakes: b.mistakes.map((m) => m.toString()) } : {}) };
	return { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params };
}

function toChoice(s: Sample, rng: Rng): ChoiceAnswer {
	if (s.answer.kind === 'choice') return s.answer;
	if (s.answer.kind === 'number') {
		const mistakes = ((s.params.mistakes as string[]) ?? []).map((m) => Rational.parse(m));
		return numberChoice(rng, Rational.parse(s.answer.value), mistakes);
	}
	throw new Error(`${ID}: no choice for level ${s.level}`);
}

// ---------------------------------------------------------------------------
// Checks

function check(s: Sample): string[] {
	const v: string[] = [];
	const p = s.params as Record<string, unknown>;
	const ints = (key: string) => (p[key] as string[]).map(Number);
	const value = s.answer.kind === 'number' ? Rational.parse(s.answer.value) : null;
	if (!s.steps.length) v.push('passaggi mancanti');
	if (/—|piuttosto che/.test(s.problem + s.steps.join(' ') + s.solution)) v.push('parole vietate');
	if (/\d\.\d/.test(s.problem)) v.push('punto decimale nel problema');
	if (value && dec(value) === null) v.push('risposta con più di due decimali');
	const expect = (r: Rational) => {
		if (!value || !value.equals(r)) v.push(`risposta ${s.answer.kind === 'number' ? s.answer.value : '?'} invece di ${r.toString()}`);
	};
	switch (s.level) {
		case 1: {
			const xs = ints('data');
			if (xs.length < 4 || xs.length > 7) v.push('numero di dati fuori da 4-7');
			expect(q(sum(xs), xs.length));
			break;
		}
		case 2: {
			const m = ints('marks'), w = ints('weights');
			if (new Set(w).size === 1) v.push('pesi tutti uguali');
			expect(q(sum(m.map((x, j) => x * w[j])), sum(w)));
			break;
		}
		case 3: {
			const xs = ints('values'), f = ints('freqs');
			const n = sum(f);
			if (n < 10 || n > 30) v.push('n fuori da 10-30');
			expect(q(sum(xs.map((x, j) => x * f[j])), n));
			break;
		}
		case 4: {
			const xs = ints('data');
			expect(median(xs));
			if (writtenCentre(xs).equals(median(xs))) v.push('il dato scritto al centro è già la mediana');
			break;
		}
		case 5: {
			if (String(p.case).startsWith('mediana')) {
				const xs = ints('values'), f = ints('freqs');
				expect(median(expand(xs, f)));
				if (medianCase(xs, f) !== p.case) v.push('caso della mediana sbagliato');
			} else if (p.case === 'moda') {
				const xs = ints('values'), f = ints('freqs');
				expect(q(xs[f.indexOf(Math.max(...f))]));
			}
			break;
		}
		case 6: {
			if (s.answer.kind !== 'choice') {
				v.push('risposta non a scelta');
				break;
			}
			const right = s.answer.options[s.answer.correct].values;
			if (p.case === 'anomalo') {
				const xs = ints('data').sort((a, b) => a - b);
				if (xs[xs.length - 1] < 3 * xs[xs.length - 2]) v.push('nessun valore anomalo');
				if (!q(sum(xs), xs.length).isInteger()) v.push('media non intera');
				if (right[0] !== 'mediana' || right[1] !== median(xs).toString()) v.push('opzione giusta sbagliata');
			} else if (right[0] !== CHAR_ANSWER[p.kind as keyof typeof CHAR_ANSWER]) v.push('opzione giusta sbagliata');
			break;
		}
		case 7: {
			const lows = ints('lows'), w = Number(p.width), f = ints('freqs');
			const S = lows.reduce((acc, l, j) => acc.add(q((2 * l + w) * f[j], 2)), q(0));
			expect(S.div(q(sum(f))));
			break;
		}
	}
	return v;
}

export const statisticaMedie: Generator = {
	id: ID,
	title: 'Media, mediana e moda',
	levels: {
		1: { label: 'Media aritmetica di una lista', constraints: ['da 4 a 7 dati interi, con negativi nei contesti numeri e temperature', 'media intera in metà dei casi, altrimenti decimale con al massimo due cifre'] },
		2: { label: 'Media ponderata dei voti', constraints: ['3 o 4 voti diversi da 3 a 10, pesi da 1 a 3 non tutti uguali', 'media con al massimo due decimali, diversa dalla media semplice'] },
		3: { label: 'Media da una tabella di frequenze', constraints: ['da 4 a 6 righe, n tra 10 e 30', 'media con al massimo due decimali'] },
		4: { label: 'Mediana di una lista non ordinata', constraints: ['n dispari (5, 7, 9) o pari (6, 8, 10), metà ciascuno', 'lista non ordinata, il dato scritto al centro non è la mediana'] },
		5: { label: 'Mediana e moda da una tabella', constraints: ['mediana 60% (dispari, pari con i centrali uguali, pari con i centrali diversi)', 'moda numerica 15%, moda di un carattere qualitativo 15%, lista bimodale o senza moda 10%'] },
		6: { label: 'Quale indice usare', constraints: ['60% dati con un valore anomalo: si sceglie la mediana e il suo valore', '40% tipo di carattere: quali indici si possono calcolare'] },
		7: { label: 'Media di dati in classi', constraints: ['da 3 a 5 classi della stessa ampiezza, n tra 10 e 40', 'media approssimata con al massimo due decimali'] },
	},
	generate,
	check,
	toChoice,
};

export default statisticaMedie;
