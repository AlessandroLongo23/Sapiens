import { factorize, factorsLatex } from '@/lib/exercises/v2/naturali';
import { fail, type Outcome, type Step } from './types';
import { intTex, intText, parseNaturalList } from './numbers';

/**
 * mcm and MCD of two or more whole numbers, the way the lesson does them: factor each number into primes, then
 * take the common factors with the smallest exponent (MCD) or all the factors with the largest (mcm). The choice is
 * a table, one row per prime and one column per number, the chosen exponent marked.
 */

export type Which = 'mcm' | 'mcd';

const MAX = 1e9;
const MAX_NUMBERS = 10;

function read(input: string): number[] | string {
	const ns = parseNaturalList(input, MAX);
	if (!ns) return 'Scrivi dei numeri interi positivi, separati da una virgola o da uno spazio. Per esempio: 12, 18.';
	if (ns.length < 2) return 'Servono almeno due numeri. Per esempio: 12, 18.';
	if (ns.length > MAX_NUMBERS) return `Al massimo ${MAX_NUMBERS} numeri alla volta.`;
	if (ns.some((n) => n === 0)) return 'Lo zero non ha mcm e MCD come gli altri numeri: usa numeri maggiori di zero.';
	return ns;
}

const factorLine = (n: number) => (n === 1 ? '1' : factorsLatex(factorize(n)));
const power = (p: number, e: number) => (e === 1 ? `${p}` : `${p}^{${e}}`);

export function mcmMcd(input: string, which: Which): Outcome {
	const ns = read(input);
	if (typeof ns === 'string') return fail(ns);
	const list = ns.map(intTex).join(',\\ ');
	const name = which === 'mcm' ? '\\text{mcm}' : '\\text{MCD}';

	// Exponent of each prime in each number.
	const table = ns.map((n) => new Map(factorize(n)));
	const primes = [...new Set(ns.flatMap((n) => factorize(n).map(([p]) => p)))].sort((a, b) => a - b);

	const chosen: [number, number][] = [];
	const rows: string[][] = [];
	for (const p of primes) {
		const exps = table.map((t) => t.get(p) ?? 0);
		const common = exps.every((e) => e > 0);
		const pick = which === 'mcm' ? Math.max(...exps) : common ? Math.min(...exps) : 0;
		if (pick) chosen.push([p, pick]);
		const cells = exps.map((e) => (e === 0 ? 'no' : `$${e === pick ? `\\hl{${power(p, e)}}` : power(p, e)}$`));
		rows.push([`$${p}$`, ...cells, pick ? `$${power(p, pick)}$` : 'non è comune']);
	}
	const value = chosen.reduce((acc, [p, e]) => acc * p ** e, 1);
	const expanded = chosen.map(([p, e]) => intTex(p ** e));

	const steps: Step[] = [
		{
			say: 'Scomponi ogni numero in fattori primi.',
			table: { head: ['Numero', 'Fattori primi'], rows: ns.map((n) => [`$${intTex(n)}$`, `$${factorLine(n)}$`]) }
		},
		{
			say:
				which === 'mcm'
					? 'Per ogni fattore primo scegli l’esponente più grande. Prendi tutti i fattori, anche quelli che non sono comuni.'
					: 'Tieni solo i fattori comuni a tutti i numeri, e per ognuno scegli l’esponente più piccolo.',
			table: { head: ['Fattore', ...ns.map((n) => `$${intTex(n)}$`), 'Scelto'], rows },
			then: which === 'mcd' && !chosen.length ? 'Nessun fattore primo è comune a tutti i numeri.' : undefined
		}
	];
	if (chosen.length) {
		const product = factorsLatex(chosen);
		const lines = [`${name}(${list}) = ${product}`];
		if (chosen.some(([, e]) => e > 1) && chosen.length > 1) lines.push(`= ${expanded.join(' \\cdot ')}`);
		if (chosen.length > 1 || chosen[0][1] > 1) lines.push(`= ${intTex(value)}`);
		steps.push({ say: 'Moltiplica i fattori scelti.', math: lines });
	} else {
		steps.push({ say: 'Senza fattori comuni il MCD è 1.', math: [`${name}(${list}) = 1`], then: 'I numeri si dicono primi tra loro.' });
	}
	if (ns.length === 2 && Number.isSafeInteger(ns[0] * ns[1])) {
		const [a, b] = ns;
		const other = (a * b) / value;
		const otherName = which === 'mcm' ? '\\text{MCD}' : '\\text{mcm}';
		steps.push({
			say: `Controlla: per due numeri il prodotto di mcm e MCD è uguale al prodotto dei numeri.`,
			math: [`${intTex(a)} \\cdot ${intTex(b)} = ${intTex(a * b)}`, `${otherName}(${list}) = ${intTex(a * b)} : ${intTex(value)} = ${intTex(other)}`]
		});
	}

	return {
		ok: true,
		rows: [{ label: `${which === 'mcm' ? 'Minimo comune multiplo' : 'Massimo comune divisore'} di ${ns.slice(0, -1).map(intText).join(', ')} e ${intText(ns[ns.length - 1])}`, value: `$${intTex(value)}$` }],
		copy: intText(value),
		steps
	};
}
