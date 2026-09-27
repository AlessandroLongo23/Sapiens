import { factorize, factorsLatex } from '@/lib/exercises/v2/naturali';
import { q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { decimal, intTex, intText, parseNatural } from './numbers';

/**
 * Is a number prime? The way the lesson checks it: divide by the primes 2, 3, 5, 7… up to the square root of the
 * number, and stop at the first remainder 0. A divisor larger than the root would pair with one smaller than it,
 * already tried. Then the factorisation, for a composite number. Second mode: the primes up to N with the sieve of
 * Eratosthenes, crossing out the multiples of each prime from its square.
 */

export type PrimeMode = 'verifica' | 'elenco';

const MAX = 1e12;
export const MAX_SIEVE = 1000;
/** Rows of the table of divisions shown in full; beyond, the first ones, a row of dots and the last ones. */
const HEAD_ROWS = 12;
const TAIL_ROWS = 3;

/** Primes up to `limit`, by the sieve. */
export function primesUpTo(limit: number): number[] {
	const composite = new Uint8Array(limit + 1);
	const out: number[] = [];
	for (let n = 2; n <= limit; n++) {
		if (composite[n]) continue;
		out.push(n);
		for (let m = n * n; m <= limit; m += n) composite[m] = 1;
	}
	return out;
}

/** The primes to try on n, up to its square root, stopping at the first that divides it. */
function trials(n: number): { tried: number[]; divisor: number | null } {
	const tried: number[] = [];
	for (const p of primesUpTo(Math.floor(Math.sqrt(n)))) {
		tried.push(p);
		if (n % p === 0) return { tried, divisor: p };
	}
	return { tried, divisor: null };
}

const rootTex = (n: number) => decimal(q(Math.floor(Math.sqrt(n) * 10), 10), 1).tex;

/** The table of divisions, long runs shortened, the row with remainder 0 marked. */
function trialTable(n: number, tried: number[]): string[][] {
	const row = (p: number) => {
		const r = n % p;
		return r === 0 ? [`$\\hl{${intTex(p)}}$`, `$\\hl{0}$`] : [`$${intTex(p)}$`, `$${intTex(r)}$`];
	};
	if (tried.length <= HEAD_ROWS + TAIL_ROWS + 1) return tried.map(row);
	return [...tried.slice(0, HEAD_ROWS).map(row), ['$\\vdots$', '$\\vdots$'], ...tried.slice(-TAIL_ROWS).map(row)];
}

export function verificaPrimo(input: string): Outcome {
	if (!input.trim()) return fail('Scrivi un numero intero positivo, per esempio 91.');
	const n = parseNatural(input, MAX);
	if (n === null) return fail('Scrivi un numero intero positivo senza virgola, fino a mille miliardi, per esempio 91.');
	const nTex = intTex(n);
	if (n < 2)
		return {
			ok: true,
			rows: [{ label: `Il numero ${n}`, value: 'non è primo' }],
			copy: `${n} non è primo`,
			steps: [
				{
					say: 'Ricorda la definizione: un numero primo ha esattamente due divisori.',
					then:
						n === 1
							? 'Il numero $1$ ha un solo divisore, sé stesso: non è primo e non è composto.'
							: 'Lo zero è divisibile per ogni numero, quindi ha infiniti divisori: non è primo.'
				}
			]
		};
	const root = Math.floor(Math.sqrt(n));
	if (root < 2)
		return {
			ok: true,
			rows: [{ label: `Il numero ${intText(n)}`, value: 'è primo' }],
			copy: `${n} è primo`,
			steps: [{ say: `I divisori di $${nTex}$ sono solo $1$ e $${nTex}$.`, then: `Quindi $${nTex}$ è un numero primo.` }]
		};

	const { tried, divisor } = trials(n);
	const steps: Step[] = [
		{
			say: 'Calcola fino a dove provare i divisori.',
			math: [root * root === n ? `\\sqrt{${nTex}} = \\hl{${intTex(root)}}` : `\\sqrt{${nTex}} \\approx \\hl{${rootTex(n)}}`],
			then: `Basta provare i numeri primi fino a $${intTex(root)}$: un divisore più grande ne avrebbe accanto uno più piccolo.`
		}
	];
	const table = trialTable(n, tried);
	if (divisor === null) {
		steps.push(
			{
				say: `Dividi $${nTex}$ per ogni numero primo e guarda il resto.`,
				table: { head: ['Divisore primo', 'Resto'], rows: table },
				then: tried.length > table.length ? `Sono $${intTex(tried.length)}$ divisioni: nessun resto è $0$.` : 'Nessun resto è $0$.'
			},
			{ say: `$${nTex}$ ha come divisori solo $1$ e sé stesso.`, then: `Quindi $${nTex}$ è un numero primo.` }
		);
		return { ok: true, rows: [{ label: `Il numero ${intText(n)}`, value: 'è primo' }], copy: `${intText(n)} è primo`, steps };
	}

	const quotient = n / divisor;
	const fs = factorize(n);
	steps.push(
		{
			say: `Dividi $${nTex}$ per i numeri primi, in ordine, finché trovi resto $0$.`,
			table: { head: ['Divisore primo', 'Resto'], rows: table },
			then: `Il resto è $0$ con $${intTex(divisor)}$: fermati qui.`
		},
		{
			say: `$${nTex}$ è divisibile per $${intTex(divisor)}$: non è primo.`,
			math: [`${nTex} : ${intTex(divisor)} = ${intTex(quotient)}`, `${nTex} = ${intTex(divisor)} \\cdot ${intTex(quotient)}`],
			then: 'Un numero che non è primo si dice composto.'
		},
		{
			say: 'Scomponi il numero in fattori primi.',
			math: [`${nTex} = \\hl{${factorsLatex(fs)}}`]
		}
	);
	return {
		ok: true,
		rows: [
			{ label: `Il numero ${intText(n)}`, value: 'non è primo' },
			{ label: 'Il più piccolo divisore primo', value: `$${intTex(divisor)}$` },
			{ label: 'Scomposizione in fattori primi', value: `$${nTex} = ${factorsLatex(fs)}$` }
		],
		copy: `${intText(n)} non è primo: ${intText(n)} = ${intText(divisor)} · ${intText(quotient)}`,
		steps
	};
}

/** The multiples of p crossed out, from p², as a short row: first three, dots, last. */
function multiplesLine(p: number, limit: number): string {
	const ms: number[] = [];
	for (let m = p * p; m <= limit; m += p) ms.push(m);
	const shown = ms.length > 5 ? [...ms.slice(0, 3).map(intTex), '\\ldots', intTex(ms[ms.length - 1])] : ms.map(intTex);
	return shown.join(' \\quad ');
}

export function elencoPrimi(input: string): Outcome {
	if (!input.trim()) return fail(`Scrivi fino a che numero cercare i primi, da 2 a ${MAX_SIEVE}, per esempio 100.`);
	const n = parseNatural(input, MAX_SIEVE);
	if (n === null || n < 2) return fail(`Scrivi un numero intero da 2 a ${MAX_SIEVE}, per esempio 100.`);
	const primes = primesUpTo(n);
	const sieving = primes.filter((p) => p * p <= n);
	// By Bertrand's postulate there is always a prime between √n and n.
	const next = primes.find((p) => p * p > n)!;
	const crossed = new Uint8Array(n + 1);
	const steps: Step[] = [{ say: `Scrivi i numeri da $2$ a $${intTex(n)}$.`, then: 'Il numero $1$ non si scrive: non è primo.' }];
	for (const p of sieving) {
		let fresh = 0;
		let all = 0;
		for (let m = p * p; m <= n; m += p, all++) if (!crossed[m]++) fresh++;
		steps.push({
			say: `Il $${p}$ non è cancellato, quindi è primo: cancella i suoi multipli da $${p}^2$.`,
			math: [`${p}^2 = ${intTex(p * p)}`, multiplesLine(p, n)],
			then:
				fresh === all
					? fresh === 1
						? 'Cancelli un numero.'
						: `Cancelli $${intTex(fresh)}$ numeri.`
					: fresh === 1
						? 'Cancelli un numero nuovo: gli altri erano già cancellati.'
						: `Cancelli $${intTex(fresh)}$ numeri nuovi: gli altri erano già cancellati.`
		});
	}
	steps.push({
		say: `Il prossimo non cancellato è $${next}$, ma $${next}^2$ supera $${intTex(n)}$: fermati.`,
		math: [`${next}^2 = ${intTex(next * next)} > ${intTex(n)}`],
		then: 'I multipli ancora da cancellare sarebbero già stati cancellati: i numeri rimasti sono tutti primi.'
	});
	const perRow = 10;
	const rows: string[][] = [];
	for (let i = 0; i < primes.length; i += perRow) rows.push(primes.slice(i, i + perRow).map((p) => `$${intTex(p)}$`));
	steps.push({ say: 'Scrivi i numeri rimasti: sono i primi.', table: { rows } });
	if (steps.length > 5) {
		steps[0].group = 'Il crivello di Eratostene';
		steps[steps.length - 1].group = 'I numeri primi';
	}
	return {
		ok: true,
		rows: [
			{ label: `Quanti sono i numeri primi fino a ${intText(n)}`, value: `$${primes.length}$` },
			{ label: 'Il più grande', value: `$${intTex(primes[primes.length - 1])}$` }
		],
		copy: primes.join(', '),
		steps
	};
}

export function numeriPrimi(mode: PrimeMode, input: string): Outcome {
	return mode === 'elenco' ? elencoPrimi(input) : verificaPrimo(input);
}
