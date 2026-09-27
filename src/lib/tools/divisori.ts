import { factorize, factorsLatex } from '@/lib/exercises/v2/naturali';
import { fail, type Outcome, type Step } from './types';
import { decimal, intTex, intText, parseNatural } from './numbers';
import { q } from '@/lib/exercises/v2/rational';

/**
 * All the divisors of a whole number, the way the books find them: in pairs a × b = n, trying a from 1 up to the
 * square root of n (past it, the pairs repeat swapped). Their number from the prime factors, (e₁ + 1)(e₂ + 1)…, and
 * their sum as the product of the sums of the powers of each prime, (1 + 2 + 4 + 8)(1 + 3 + 9)(1 + 5).
 */

const MAX = 1e9;
/** Pairs shown in full; beyond, the first and the last ones with a row of dots between. */
const MAX_PAIRS = 24;
/** Divisors per row of the list, and rows shown. */
const PER_ROW = 8;
const MAX_ROWS = 12;
/** Divisors written in the result row; beyond, only their number. */
const MAX_IN_ROW = 36;

/** All the divisors of n, in increasing order, from its prime factors. */
export function divisorsOf(n: number): number[] {
	let out = [1];
	for (const [p, e] of factorize(n)) {
		const next: number[] = [];
		for (const d of out) for (let k = 0, pk = 1; k <= e; k++, pk *= p) next.push(d * pk);
		out = next;
	}
	return out.sort((a, b) => a - b);
}

/** 1 + p + p² + … + p^e, added term by term (p^(e+1) can pass the safe integers when p is a large prime). */
function sumOfPowers(p: number, e: number): number {
	let s = 0;
	for (let k = 0, pk = 1; k <= e; k++, pk *= p) s += pk;
	return s;
}

const power = (p: number, e: number) => (e === 1 ? intTex(p) : `${intTex(p)}^{${e}}`);

/** 1 + p + p² + … + p^e, written out when short. */
function powerSum(p: number, e: number): string {
	if (e <= 4) return Array.from({ length: e + 1 }, (_, k) => (k === 0 ? '1' : power(p, k))).join(' + ');
	return `1 + ${intTex(p)} + \\dots + ${power(p, e)}`;
}

export function divisori(input: string): Outcome {
	if (!input.trim()) return fail('Scrivi un numero intero positivo, per esempio 360.');
	const n = parseNatural(input, MAX);
	if (n === null) return fail('Scrivi un numero intero positivo senza virgola, fino a un miliardo, per esempio 360.');
	if (n === 0) return fail('Lo zero ha infiniti divisori: ogni numero lo divide. Scrivi un numero maggiore di zero, per esempio 360.');
	const nTex = intTex(n);

	if (n === 1)
		return {
			ok: true,
			rows: [
				{ label: 'Divisori di 1', value: '$1$' },
				{ label: 'Numero dei divisori', value: '$1$' },
				{ label: 'Somma dei divisori', value: '$1$' }
			],
			copy: '1',
			steps: [{ say: 'Ricorda che $1$ è diviso solo da sé stesso.', math: ['1 = 1 \\cdot 1'], then: 'Ha un solo divisore, ed è il solo numero con questa proprietà.' }]
		};

	const fs = factorize(n);
	const divs = divisorsOf(n);
	const count = divs.length;
	const sum = fs.reduce((acc, [p, e]) => acc * sumOfPowers(p, e), 1);
	const isPrime = fs.length === 1 && fs[0][1] === 1;
	const steps: Step[] = [];

	// 1. The prime factors.
	steps.push({
		say: 'Scomponi il numero in fattori primi.',
		math: [`${nTex} = \\hl{${factorsLatex(fs)}}`],
		then: isPrime ? `$${nTex}$ è un numero primo: i suoi divisori sono solo $1$ e $${nTex}$.` : undefined
	});

	// 2. How many divisors: each prime from exponent 0 up to e.
	const plusOnes = fs.map(([, e]) => `(${e} + 1)`).join(' \\cdot ');
	const countLines = fs.length === 1 ? [`${plusOnes} = \\hl{${count}}`] : [`${plusOnes} = ${fs.map(([, e]) => e + 1).join(' \\cdot ')}`, `= \\hl{${intTex(count)}}`];
	steps.push({
		say: 'Conta i divisori: aggiungi $1$ a ogni esponente e moltiplica.',
		table: {
			head: ['Fattore primo', 'Esponente', 'Esponenti possibili'],
			rows: fs.map(([p, e]) => [`$${intTex(p)}$`, `$${e}$`, e === 1 ? '$0$ o $1$' : `da $0$ a $${e}$: sono $${e + 1}$`])
		},
		math: countLines,
		then: 'Ogni divisore prende ogni fattore primo da $0$ volte fino al suo esponente.'
	});

	// 3. The pairs a × b = n, a up to the square root.
	const small = divs.filter((d) => d * d <= n);
	const pairRow = (a: number) => {
		const b = n / a;
		return [`$${intTex(a)}$`, `$${intTex(b)}$`, `$${intTex(a)} \\cdot ${intTex(b)} = ${nTex}$`];
	};
	const pairs = small.length > MAX_PAIRS ? [...small.slice(0, MAX_PAIRS - 4).map(pairRow), ['$\\vdots$', '$\\vdots$', ''], ...small.slice(-3).map(pairRow)] : small.map(pairRow);
	const root = Math.sqrt(n);
	const square = Number.isInteger(root);
	const rootTex = square ? intTex(root) : decimal(q(Math.round(root * 100), 100), 2).tex;
	steps.push({
		say: `Cerca i divisori a coppie: dividi $${nTex}$ per ogni numero fino alla sua radice quadrata.`,
		math: [square ? `\\sqrt{${nTex}} = ${rootTex}` : `\\sqrt{${nTex}} \\approx ${rootTex}`],
		table: { head: ['Divisore', 'Quoziente', 'Coppia'], rows: pairs },
		then: square
			? `$${nTex}$ è un quadrato perfetto: $${intTex(root)}$ fa coppia con sé stesso e si conta una volta sola.`
			: 'Oltre la radice le coppie si ripetono scambiate: puoi fermarti.'
	});

	// 4. The list, in order.
	const rows: string[][] = [];
	for (let i = 0; i < divs.length; i += PER_ROW) rows.push(divs.slice(i, i + PER_ROW).map((d) => `$${intTex(d)}$`));
	const shownRows = rows.length > MAX_ROWS ? [...rows.slice(0, MAX_ROWS - 2), ['$\\vdots$'], rows[rows.length - 1]] : rows;
	steps.push({
		say: 'Scrivi tutti i divisori in ordine: i piccoli della colonna di sinistra, poi i quozienti.',
		table: { rows: shownRows },
		then: `Sono $${intTex(count)}$, come dice la formula${rows.length > MAX_ROWS ? '. La tabella salta le righe centrali' : ''}.`
	});

	// 5. The sum: the sums of the powers of each prime, multiplied.
	const sums = fs.map(([p, e]) => sumOfPowers(p, e));
	const sumLines =
		fs.length === 1
			? [`${powerSum(fs[0][0], fs[0][1])} = \\hl{${intTex(sum)}}`]
			: [fs.map(([p, e]) => `(${powerSum(p, e)})`).join(' \\cdot '), `= ${sums.map(intTex).join(' \\cdot ')}`, `= \\hl{${intTex(sum)}}`];
	const proper = sum - n;
	steps.push({
		say: 'Per la somma, somma le potenze di ogni fattore primo e moltiplica i risultati.',
		math: sumLines,
		then:
			proper === n
				? `Senza $${nTex}$ la somma è $${nTex}$: è un numero perfetto.`
				: `Senza $${nTex}$ stesso, la somma dei divisori propri è $${intTex(proper)}$.`
	});

	const listTex = divs.map(intTex).join(';\\ ');
	return {
		ok: true,
		rows: [
			{ label: `Divisori di ${intText(n)}`, value: count <= MAX_IN_ROW ? `$${listTex}$` : 'sono troppi da scrivere qui: li trovi nei passaggi' },
			{ label: 'Numero dei divisori', value: `$${intTex(count)}$` },
			{ label: 'Somma dei divisori', value: `$${intTex(sum)}$` }
		],
		copy: divs.map(String).join('; '),
		steps
	};
}
