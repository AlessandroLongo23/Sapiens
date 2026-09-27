import { factorize, factorsLatex } from '@/lib/exercises/v2/naturali';
import { q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { decimal, intTex, intText, parseDecimal } from './numbers';

/**
 * Square and cube roots of a whole number: exact when the number is a perfect square or cube, else simplified by
 * carrying out of the root the factors whose exponent is a multiple of the index (√72 = 6√2), with a decimal value.
 */

export type RootIndex = 2 | 3;

const MAX = 1e12;
/** Decimals of the approximate value. */
const DIGITS = 4;

/** ⁿ√n = k · ⁿ√r, with r free of k-th powers. n >= 1. */
export function simplifyRoot(n: number, index: RootIndex): { k: number; r: number } {
	let k = 1;
	let r = 1;
	for (const [p, e] of factorize(n)) {
		k *= p ** Math.floor(e / index);
		r *= p ** (e % index);
	}
	return { k, r };
}

const rootTex = (x: string, index: RootIndex) => (index === 2 ? `\\sqrt{${x}}` : `\\sqrt[3]{${x}}`);
const rootText = (index: RootIndex) => (index === 2 ? '√' : '∛');

/** k·ⁿ√r as a formula: "6\sqrt{2}", "\sqrt{2}", "12". */
function simplifiedTex(k: number, r: number, index: RootIndex): string {
	if (r === 1) return intTex(k);
	return `${k === 1 ? '' : intTex(k)}${rootTex(intTex(r), index)}`;
}

/** The value rounded to DIGITS decimals, Italian style. */
function approx(x: number): { tex: string; text: string } {
	const scale = 10 ** DIGITS;
	const d = decimal(q(Math.round(x * scale), scale), DIGITS);
	return { tex: d.tex, text: d.text };
}

/** Split p^e into p^(multiple of index) · p^(rest), for the step that prepares the carrying out. */
function splitPower(p: number, e: number, index: RootIndex): string[] {
	const out = e - (e % index);
	const parts: string[] = [];
	if (out > 0) parts.push(factorsLatex([[p, out]]));
	if (e % index > 0) parts.push(factorsLatex([[p, e % index]]));
	return parts;
}

export function radice(input: string, index: RootIndex): Outcome {
	const name = index === 2 ? 'quadrata' : 'cubica';
	if (!input.trim()) return fail('Scrivi un numero intero, per esempio 72.');
	const v = parseDecimal(input.replace(/[−–]/g, '-'));
	if (!v || !v.isInteger()) return fail('Scrivi un numero intero, senza virgola, per esempio 72.');
	if (Math.abs(v.num) > MAX) return fail('Scrivi un numero fino a mille miliardi, per esempio 72.');
	if (v.num < 0 && index === 2)
		return fail('La radice quadrata di un numero negativo non esiste tra i numeri reali. Scrivi un numero positivo, per esempio 72, oppure scegli la radice cubica.');

	const neg = v.num < 0;
	const n = Math.abs(v.num);
	const sign = neg ? '-' : '';
	const nTex = intTex(v.num);
	const left = rootTex(nTex, index);
	const power = index === 2 ? 'quadrato' : 'cubo';
	const label = `Radice ${name} di ${intText(v.num)}`;

	if (n <= 1) {
		return {
			ok: true,
			rows: [{ label, value: `$${nTex}$` }],
			copy: intText(v.num),
			steps: [{ say: `Eleva $${nTex}$ al ${power}: ritrovi $${nTex}$.`, math: [`${neg ? `(${nTex})` : nTex}^${index} = ${nTex}`], then: `Quindi la radice ${name} di $${nTex}$ è $${nTex}$.` }]
		};
	}

	const fs = factorize(n);
	const { k, r } = simplifyRoot(n, index);
	const steps: Step[] = [];
	const nPos = intTex(n);
	const posRoot = rootTex(nPos, index);
	if (neg)
		steps.push({
			say: 'Metti da parte il segno meno.',
			math: [`${left} = -${posRoot}`],
			then: `Un numero negativo al cubo resta negativo, quindi la radice è negativa. Calcola $${posRoot}$ e rimetti il meno alla fine.`
		});
	const factorsLine = factorsLatex(fs);
	const isPrime = fs.length === 1 && fs[0][1] === 1;
	steps.push(isPrime ? { say: `Scomponi $${nPos}$ in fattori primi.`, then: `$${nPos}$ è un numero primo.` } : { say: `Scomponi $${nPos}$ in fattori primi.`, math: [`${nPos} = \\hl{${factorsLine}}`] });

	const every = index === 2 ? 'pari' : 'multipli di $3$';
	const multiple = index === 2 ? 'pari' : 'multiplo di $3$';
	const powTex = index === 2 ? '^2' : '^3';
	const lastRows: { label: string; value: string }[] = [];

	if (r === 1) {
		const reduced = fs.map(([p, e]) => [p, e / index] as [number, number]);
		const lines = [`${posRoot} = ${rootTex(factorsLine, index)}`];
		const reducedTex = factorsLatex(reduced);
		lines.push(reducedTex === intTex(k) ? `= \\hl{${intTex(k)}}` : `= ${reducedTex}`);
		if (reducedTex !== intTex(k)) lines.push(`= \\hl{${intTex(k)}}`);
		steps.push({ say: `Gli esponenti sono tutti ${every}: dividili per $${index}$.`, math: lines, then: 'Tutti i fattori escono dalla radice.' });
		steps.push({ say: `Controlla: eleva il risultato al ${power}.`, math: [`${intTex(k)}${powTex} = ${nPos}`] });
		if (neg) steps.push({ say: 'Rimetti il segno meno.', math: [`${left} = \\hl{-${intTex(k)}}`] });
		return { ok: true, rows: [{ label, value: `$${sign}${intTex(k)}$` }], copy: `${sign}${intText(k)}`, steps };
	}

	const a = approx(index === 2 ? Math.sqrt(n) : Math.cbrt(n));
	const simplified = simplifiedTex(k, r, index);
	if (k === 1) {
		steps.push({
			say: `Nessun esponente è ${index === 2 ? 'almeno $2$' : 'almeno $3$'}: la radice non si semplifica.`,
			then: `Per portare fuori un fattore dalla radice ${name} serve un esponente di almeno $${index}$. Quindi $${nPos}$ non è un ${power} perfetto.`
		});
	} else {
		const outside = fs.filter(([, e]) => e >= index).map(([p, e]) => [p, Math.floor(e / index)] as [number, number]);
		const inside = fs.filter(([, e]) => e % index > 0).map(([p, e]) => [p, e % index] as [number, number]);
		// Each power split into the part with an exponent multiple of the index (marked: it comes out) and the rest.
		const splitMarked = fs.flatMap(([p, e]) => splitPower(p, e, index).map((t, i) => (i === 0 && e >= index ? `\\hl{${t}}` : t))).join(' \\cdot ');
		const splitTex = fs.flatMap(([p, e]) => splitPower(p, e, index)).join(' \\cdot ');
		if (splitTex !== factorsLine) steps.push({ say: `Separa ogni potenza: una parte con esponente ${multiple} e il resto.`, math: [`${nPos} = ${splitMarked}`] });
		const carried = `${factorsLatex(outside)}${rootTex(factorsLatex(inside), index)}`;
		const lines = [`${posRoot} = ${rootTex(splitMarked, index)}`];
		if (carried !== simplified) lines.push(`= ${carried}`);
		lines.push(`= \\hl{${simplified}}`);
		steps.push({
			say: `Porta fuori i fattori evidenziati: dividi il loro esponente per $${index}$.`,
			math: lines,
			then: 'Gli altri fattori restano sotto la radice.'
		});
		steps.push({
			say: `Controlla: eleva il risultato al ${power}.`,
			math: [`(${simplified})${powTex} = ${intTex(k)}${powTex} \\cdot ${intTex(r)}`, `= ${intTex(k ** index)} \\cdot ${intTex(r)}`, `= ${nPos}`]
		});
	}

	// Between which whole numbers the root lies, then its value.
	const below = Math.floor(index === 2 ? Math.sqrt(n) : Math.cbrt(n) + 1e-9);
	const lo = below ** index > n ? below - 1 : below;
	const hi = lo + 1;
	const decimalSteps: Step[] = [
		{
			say: 'Trova tra quali numeri interi sta la radice.',
			math: [`${intTex(lo)}${powTex} = ${intTex(lo ** index)}`, `${intTex(hi)}${powTex} = ${intTex(hi ** index)}`],
			then: `$${nPos}$ sta tra $${intTex(lo ** index)}$ e $${intTex(hi ** index)}$, quindi $${posRoot}$ sta tra $${intTex(lo)}$ e $${intTex(hi)}$.`
		},
		{
			say: 'Calcola il valore decimale, arrotondato.',
			math: [`${posRoot} \\approx \\hl{${a.tex}}`],
			then: `Il valore è approssimato, perché $${nPos}$ non è un ${power} perfetto.`
		}
	];
	steps.push(...decimalSteps);
	if (neg) steps.push({ say: 'Rimetti il segno meno.', math: [`${left} = \\hl{-${simplified}}`, `\\approx -${a.tex}`] });
	if (steps.length > 5) {
		steps[0].group = 'La forma semplificata';
		steps[steps.indexOf(decimalSteps[0])].group = 'Il valore decimale';
	}

	lastRows.push({ label: k === 1 ? `${label}, che non si semplifica` : label, value: `$${sign}${simplified}$` });
	lastRows.push({ label: 'Valore decimale, arrotondato', value: `$\\approx ${sign}${a.tex}$` });
	const copy = `${k === 1 ? `${sign}${rootText(index)}${intText(r)}` : `${sign}${intText(k)}${rootText(index)}${intText(r)}`} ≈ ${sign}${a.text}`;
	return { ok: true, rows: lastRows, copy, steps };
}
