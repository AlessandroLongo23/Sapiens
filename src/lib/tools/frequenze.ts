import { Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { decimal, parseDecimal } from './numbers';
import { splitList } from './media-mediana-moda';

/**
 * The frequency table of a list of data, as the lesson "Dati, frequenze e grafici" (statistica-dati) builds it:
 * absolute frequency $f_a$, relative frequency $f_r = f_a / N$, percentage and cumulative frequency. Data can be
 * numbers (one row per value, or classes $a \vdash b$ of a chosen width, left end included) or words (colours,
 * sports), whose modalities have no order, so they get no cumulative column, as the lesson says.
 */

const MAX_DATA = 500;
const MAX_ROWS = 60;
const MAX_CLASSES = 40;
/** Relative frequencies to three decimals and percentages to one, as in the lesson (4/30 ≈ 0,133 ≈ 13,3%). */
const FR_DIGITS = 3;
const PCT_DIGITS = 1;

type Kind = 'numeri' | 'parole' | 'classi';

interface Row {
	/** The modality in a table cell: "$7{,}5$", "rosso", "$150 \vdash 160$". */
	cell: string;
	/** The same for the copied table. */
	text: string;
	count: number;
}

const WORD = /^[\p{L}\p{N}][\p{L}\p{N}'’ .\-/]*$/u;

/** Numbers, when every datum is one; else words, split at commas, semicolons or new lines when there are any. */
function readData(input: string): { kind: 'numeri'; xs: Rational[] } | { kind: 'parole'; words: string[] } | string {
	if (!input.trim()) return 'Scrivi i dati separati da uno spazio, numeri o parole, per esempio 1 0 2 1 3 oppure rosso blu rosso.';
	const parts = splitList(input);
	const nums = parts.map(parseDecimal);
	if (nums.every((r) => r)) return parts.length > MAX_DATA ? `Al massimo ${MAX_DATA} dati alla volta: togline qualcuno.` : { kind: 'numeri', xs: nums as Rational[] };
	const words = (/[;,\n]/.test(input) ? input.split(/[;,\n]+/) : input.split(/\s+/)).map((w) => w.trim().replace(/\s+/g, ' ')).filter(Boolean);
	if (words.length > MAX_DATA) return `Al massimo ${MAX_DATA} dati alla volta: togline qualcuno.`;
	for (const w of words) {
		if (w.length > 30) return `"${w.slice(0, 30)}…" è troppo lungo: scrivi ogni dato in poche lettere.`;
		if (!WORD.test(w)) return `"${w}" contiene simboli che non leggo. Scrivi i dati con lettere e numeri, per esempio rosso blu rosso.`;
	}
	const again = words.map(parseDecimal);
	if (again.every((r) => r)) return { kind: 'numeri', xs: again as Rational[] };
	return { kind: 'parole', words };
}

const floorR = (r: Rational) => Math.floor(r.num / r.den);
const tex = (r: Rational) => decimal(r, 6).tex;
const text = (r: Rational) => decimal(r, 6).text;

/** How many times each value appears, in increasing order. */
function countNumbers(xs: Rational[]): Row[] {
	const sorted = [...xs].sort((a, b) => a.compare(b));
	const rows: Row[] = [];
	let last: Rational | null = null;
	for (const x of sorted) {
		if (last && last.equals(x)) rows[rows.length - 1].count++;
		else rows.push({ cell: `$${tex(x)}$`, text: text(x), count: 1 });
		last = x;
	}
	return rows;
}

/** How many times each word appears, in the order they first appear; "Rosso" and "rosso" are the same. */
function countWords(words: string[]): Row[] {
	const byKey = new Map<string, Row>();
	for (const w of words) {
		const key = w.toLocaleLowerCase('it');
		const row = byKey.get(key);
		if (row) row.count++;
		else byKey.set(key, { cell: w, text: w, count: 1 });
	}
	return [...byKey.values()];
}

const pct = (count: number, n: number) => decimal(Rational.of(count * 100, n), PCT_DIGITS);
const fr = (count: number, n: number) => decimal(Rational.of(count, n), FR_DIGITS);
const eq = (d: { exact: boolean }) => (d.exact ? '=' : '\\approx');
const times = (k: number) => (k === 1 ? 'una volta' : k === 2 ? 'due volte' : `${k} volte`);
const andList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`);

function compute(data: string, widthInput: string, startInput: string): Outcome {
	const read = readData(data);
	if (typeof read === 'string') return fail(read);
	let kind: Kind = read.kind;
	let rows: Row[];
	let classNote: Step | null = null;
	const n = read.kind === 'numeri' ? read.xs.length : read.words.length;
	if (n < 2) return fail('Servono almeno due dati, per esempio 1 0 2 1 3.');

	if (widthInput.trim()) {
		if (read.kind !== 'numeri') return fail("Le classi si usano solo con dati numerici. Lascia vuota l'ampiezza.");
		const w = parseDecimal(widthInput);
		if (!w || w.sign() <= 0) return fail("L'ampiezza delle classi è un numero maggiore di zero, per esempio 10.");
		const xs = read.xs;
		const min = xs.reduce((a, b) => (b.compare(a) < 0 ? b : a));
		const max = xs.reduce((a, b) => (b.compare(a) > 0 ? b : a));
		let start: Rational;
		if (startInput.trim()) {
			const s = parseDecimal(startInput);
			if (!s) return fail('Scrivi da che numero comincia la prima classe, per esempio 150.');
			if (s.compare(min) > 0) return fail(`La prima classe deve cominciare dal dato più piccolo, ${text(min)}, o da un numero minore.`);
			start = s;
		} else start = w.mul(Rational.of(floorR(min.div(w))));
		const k = floorR(max.sub(start).div(w)) + 1;
		if (k > MAX_CLASSES) return fail(`Con questa ampiezza le classi sarebbero ${k}: scegli un'ampiezza più grande.`);
		const counts = new Array<number>(k).fill(0);
		for (const x of xs) counts[floorR(x.sub(start).div(w))]++;
		rows = counts.map((count, i) => {
			const a = start.add(w.mul(Rational.of(i)));
			const b = a.add(w);
			return { cell: `$${tex(a)} \\vdash ${tex(b)}$`, text: `[${text(a)}; ${text(b)}[`, count };
		});
		kind = 'classi';
		const second = start.add(w);
		classNote = {
			say: `Dividi i dati in classi di ampiezza $${tex(w)}$, a partire da $${tex(start)}$.`,
			then: `Ogni classe comprende il suo estremo sinistro e non il destro: $${tex(second)}$ va nella classe $${tex(second)} \\vdash ${tex(second.add(w))}$.`
		};
	} else {
		rows = read.kind === 'numeri' ? countNumbers(read.xs) : countWords(read.words);
		if (rows.length > MAX_ROWS)
			return fail(read.kind === 'numeri' ? `I valori diversi sono ${rows.length}: raggruppali in classi, scrivendo un'ampiezza.` : `Le modalità diverse sono ${rows.length}: al massimo ${MAX_ROWS}.`);
	}

	const ordered = kind !== 'parole';
	const head0 = kind === 'numeri' ? 'Valore' : kind === 'classi' ? 'Classe' : 'Modalità';
	const cumulative: number[] = [];
	rows.reduce((acc, r) => (cumulative.push(acc + r.count), acc + r.count), 0);
	const top = Math.max(...rows.map((r) => r.count));
	const modes = rows.every((r) => r.count === top) ? [] : rows.filter((r) => r.count === top);
	const hlCell = (r: Row, s: string) => (modes.includes(r) ? `$\\hl{${s}}$` : `$${s}$`);

	const steps: Step[] = [];
	if (classNote) steps.push({ ...classNote, group: 'Le frequenze assolute' });
	steps.push({
		group: classNote ? undefined : 'Le frequenze assolute',
		say: kind === 'classi' ? 'Conta quanti dati cadono in ogni classe.' : kind === 'numeri' ? 'Conta quante volte compare ogni valore.' : 'Conta quante volte compare ogni modalità.',
		table: { head: [head0, '$f_a$'], rows: rows.map((r) => [r.cell, hlCell(r, String(r.count))]) },
		then: `In tutto i dati sono $N = ${n}$.`
	});
	steps.push({
		group: 'Le frequenze relative',
		say: `Dividi ogni frequenza assoluta per $${n}$, il numero dei dati.`,
		table: {
			head: [head0, '$f_r$'],
			rows: rows.map((r) => {
				const d = fr(r.count, n);
				return [r.cell, `$\\dfrac{${r.count}}{${n}} ${eq(d)} ${d.tex}$`];
			})
		},
		then: 'La somma delle frequenze relative è $1$.'
	});
	steps.push({
		group: 'Le percentuali',
		say: 'Moltiplica ogni frequenza relativa per $100$.',
		table: {
			head: [head0, 'Percentuale'],
			rows: rows.map((r) => {
				const f = fr(r.count, n);
				const p = pct(r.count, n);
				// From the exact fraction when the relative frequency was rounded, so the percentage is right.
				return [r.cell, f.exact ? `$${f.tex} \\cdot 100 ${eq(p)} ${p.tex}\\%$` : `$\\dfrac{${r.count}}{${n}} \\cdot 100 ${eq(p)} ${p.tex}\\%$`];
			})
		}
	});
	if (ordered)
		steps.push({
			group: 'Le frequenze cumulate',
			say: "Somma le frequenze assolute dall'alto verso il basso.",
			table: {
				head: [head0, '$f_a$', 'Cumulata'],
				rows: rows.map((r, i) => [r.cell, `$${r.count}$`, i === 0 ? `$${r.count}$` : `$${cumulative[i - 1]} + ${r.count} = ${cumulative[i]}$`])
			},
			then: `L'ultima cumulata è $${n}$, il numero dei dati.`
		});

	const pctSum = rows.reduce((a, r) => a.add(parseDecimal(pct(r.count, n).text) as Rational), Rational.of(0));
	const notes = [
		...(ordered ? [] : ['Le modalità non hanno un ordine: la frequenza cumulata qui non ha senso.']),
		...(pctSum.equals(Rational.of(100)) ? [] : [`Le percentuali arrotondate sommano a $${tex(pctSum)}\\%$: la differenza da $100\\%$ viene dagli arrotondamenti.`])
	];
	steps.push({
		group: 'La tabella completa',
		say: 'Riunisci tutto in una tabella.',
		table: {
			head: [head0, '$f_a$', '$f_r$', 'Percentuale', ...(ordered ? ['Cumulata'] : [])],
			rows: [
				...rows.map((r, i) => {
					const f = fr(r.count, n);
					const p = pct(r.count, n);
					return [r.cell, `$${r.count}$`, `$${f.exact ? '' : '\\approx '}${f.tex}$`, `$${p.exact ? '' : '\\approx '}${p.tex}\\%$`, ...(ordered ? [`$${cumulative[i]}$`] : [])];
				}),
				['Totale', `$${n}$`, '$1$', '$100\\%$', ...(ordered ? [''] : [])]
			]
		},
		then: notes.length ? notes.join(' ') : undefined
	});

	const modeName = kind === 'classi' ? (modes.length > 1 ? 'Classi modali' : 'Classe modale') : modes.length > 1 ? 'Mode' : 'Moda';
	const modeValue = modes.length ? `${andList(modes.map((m) => m.cell))}, ${modes.length > 1 ? 'ciascuna ' : ''}${times(top)}` : 'nessuna: tutte hanno la stessa frequenza';
	const tsv = [
		[head0, 'Frequenza assoluta', 'Frequenza relativa', 'Percentuale', ...(ordered ? ['Cumulata'] : [])],
		...rows.map((r, i) => [r.text, String(r.count), fr(r.count, n).text, `${pct(r.count, n).text} %`, ...(ordered ? [String(cumulative[i])] : [])]),
		['Totale', String(n), '1', '100 %', ...(ordered ? [''] : [])]
	];
	return {
		ok: true,
		rows: [
			{ label: 'Numero dei dati', value: `$${n}$` },
			{ label: kind === 'classi' ? 'Classi' : kind === 'numeri' ? 'Valori diversi' : 'Modalità diverse', value: `$${rows.length}$` },
			{ label: modeName, value: modeValue }
		],
		copy: tsv.map((r) => r.join('\t')).join('\n'),
		steps
	};
}

/** The frequency table of `data`; with a class width, of the classes from `start` (by default a multiple of the width). */
export function frequenze(data: string, width = '', start = ''): Outcome {
	try {
		return compute(data, width, start);
	} catch {
		// Rational throws when a result leaves the safe integers: too many digits.
		return fail('I numeri sono troppo grandi o hanno troppi decimali: prova con meno cifre, per esempio 7,5 invece di 7,4999.');
	}
}
