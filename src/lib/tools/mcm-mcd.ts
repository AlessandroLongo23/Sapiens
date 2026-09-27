import { factorize, factorsLatex } from '@/lib/exercises/v2/naturali';
import { fail, type Outcome } from './types';
import { intTex, intText, parseNaturalList } from './numbers';

/**
 * mcm and MCD of two or more whole numbers, the way the lesson does them: factor each number into primes, then
 * take the common factors with the smallest exponent (MCD) or all the factors with the largest (mcm).
 */

export type Which = 'mcm' | 'mcd';

const MAX = 1e9;
const MAX_NUMBERS = 10;

function read(input: string): number[] | string {
	const ns = parseNaturalList(input, MAX);
	if (!ns) return 'Scrivi dei numeri interi positivi, separati da una virgola o da uno spazio.';
	if (ns.length < 2) return 'Servono almeno due numeri.';
	if (ns.length > MAX_NUMBERS) return `Al massimo ${MAX_NUMBERS} numeri alla volta.`;
	if (ns.some((n) => n === 0)) return 'Lo zero non ha mcm e MCD come gli altri numeri: usa numeri maggiori di zero.';
	return ns;
}

const factorLine = (n: number) => (n === 1 ? '1' : factorsLatex(factorize(n)));

export function mcmMcd(input: string, which: Which): Outcome {
	const ns = read(input);
	if (typeof ns === 'string') return fail(ns);
	const list = ns.map(intTex).join(', ');
	const name = which === 'mcm' ? '\\text{mcm}' : '\\text{MCD}';

	// Exponent of each prime in each number.
	const table = ns.map((n) => new Map(factorize(n)));
	const primes = [...new Set(ns.flatMap((n) => factorize(n).map(([p]) => p)))].sort((a, b) => a - b);

	const chosen: [number, number][] = [];
	for (const p of primes) {
		const exps = table.map((t) => t.get(p) ?? 0);
		if (which === 'mcm') chosen.push([p, Math.max(...exps)]);
		else if (exps.every((e) => e > 0)) chosen.push([p, Math.min(...exps)]);
	}
	const value = chosen.reduce((acc, [p, e]) => acc * p ** e, 1);

	const steps = [`Scomponi ogni numero in fattori primi: ${ns.map((n) => `$${intTex(n)} = ${factorLine(n)}$`).join(', ')}.`];
	if (which === 'mcm') {
		steps.push(`Prendi tutti i fattori, comuni e non comuni, ognuno una volta sola e con l'esponente più grande: $${factorsLatex(chosen)}$.`);
		steps.push(`Moltiplicali: $${name}(${list}) = ${factorsLatex(chosen)} = ${intTex(value)}$.`);
	} else if (chosen.length) {
		steps.push(`Prendi solo i fattori comuni a tutti i numeri, ognuno con l'esponente più piccolo: $${factorsLatex(chosen)}$.`);
		steps.push(`Moltiplicali: $${name}(${list}) = ${chosen.length > 1 || chosen[0][1] > 1 ? `${factorsLatex(chosen)} = ` : ''}${intTex(value)}$.`);
	} else {
		steps.push('Non c\'è nessun fattore primo comune a tutti i numeri: il MCD è 1, e i numeri si dicono primi tra loro.');
	}
	if (ns.length === 2) {
		const [a, b] = ns;
		const other = (a * b) / value;
		const otherName = which === 'mcm' ? '\\text{MCD}' : '\\text{mcm}';
		if (Number.isSafeInteger(a * b)) steps.push(`Controllo: per due numeri $${name} \\cdot ${otherName} = ${intTex(a)} \\cdot ${intTex(b)}$, quindi $${otherName}(${list}) = ${intTex(other)}$.`);
	}

	return { ok: true, result: `$${name}(${list}) = ${intTex(value)}$`, copy: intText(value), steps };
}
