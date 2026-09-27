import { factorize, factorsLatex } from '@/lib/exercises/v2/naturali';
import { q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome } from './types';
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
function simplifiedTex(k: number, r: number, index: RootIndex, sign = ''): string {
	if (r === 1) return `${sign}${intTex(k)}`;
	return `${sign}${k === 1 ? '' : intTex(k)}${rootTex(intTex(r), index)}`;
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
	if (!v || !v.isInteger()) return fail('Scrivi un numero intero, senza virgola: per esempio 72.');
	if (Math.abs(v.num) > MAX) return fail('Usa un numero fino a mille miliardi (10^12).');
	if (v.num < 0 && index === 2) return fail('La radice quadrata di un numero negativo non esiste tra i numeri reali: nessun numero, elevato al quadrato, dà un risultato negativo.');

	const neg = v.num < 0;
	const n = Math.abs(v.num);
	const sign = neg ? '-' : '';
	const nTex = intTex(v.num);
	const left = rootTex(nTex, index);
	const power = index === 2 ? 'quadrato' : 'cubo';

	if (n <= 1) {
		return {
			ok: true,
			result: `$${left} = ${nTex}$`,
			copy: intText(v.num),
			steps: [`Il ${power} di $${nTex}$ è $${nTex}$ stesso: $${neg ? `(${nTex})` : nTex}^${index} = ${nTex}$, quindi la radice ${name} di $${nTex}$ è $${nTex}$.`]
		};
	}

	const fs = factorize(n);
	const { k, r } = simplifyRoot(n, index);
	const steps: string[] = [];
	if (neg) steps.push(`La radice cubica di un numero negativo è negativa, perché un numero negativo al cubo resta negativo: $${left} = -${rootTex(intTex(n), 3)}$. Calcola la radice di $${intTex(n)}$ e rimetti il segno alla fine.`);
	const factorsLine = factorsLatex(fs);
	steps.push(fs.length === 1 && fs[0][1] === 1 ? `Scomponi in fattori primi: $${intTex(n)}$ è primo.` : `Scomponi in fattori primi: $${intTex(n)} = ${factorsLine}$.`);

	const every = index === 2 ? 'pari' : 'multipli di 3';
	const multiple = index === 2 ? 'pari' : 'multiplo di 3';
	if (r === 1) {
		const halved = fs.map(([p, e]) => [p, e / index] as [number, number]);
		steps.push(`Tutti gli esponenti sono ${every}: dividili per ${index} e porta tutto fuori dalla radice. $${rootTex(factorsLine, index)} = ${factorsLatex(halved)}${halved.length > 1 || halved[0][1] > 1 ? ` = ${intTex(k)}` : ''}$.`);
		steps.push(`Controlla: $${neg ? `(${sign}${intTex(k)})` : intTex(k)}${index === 2 ? '^2' : '^3'} = ${nTex}$.`);
		return { ok: true, result: `$${left} = ${sign}${intTex(k)}$`, copy: `${sign}${intText(k)}`, steps };
	}

	const a = approx(index === 2 ? Math.sqrt(n) : Math.cbrt(n));
	if (k === 1) {
		steps.push(
			`Per portare fuori un fattore dalla radice ${name} serve un esponente ${index === 2 ? 'almeno 2' : 'almeno 3'}: qui nessun fattore lo ha, quindi la radice non si semplifica e il numero non è un ${power} perfetto.`
		);
	} else {
		const split = fs.flatMap(([p, e]) => splitPower(p, e, index));
		const outside = fs.filter(([, e]) => e >= index).map(([p, e]) => [p, Math.floor(e / index)] as [number, number]);
		const inside = fs.filter(([, e]) => e % index > 0).map(([p, e]) => [p, e % index] as [number, number]);
		const carried = `${factorsLatex(outside)}${rootTex(factorsLatex(inside), index)}`;
		const splitTex = split.join(' \\cdot ');
		if (splitTex !== factorsLine) steps.push(`Separa in ogni potenza la parte con esponente ${multiple} da quella che resta: $${intTex(n)} = ${splitTex}$.`);
		steps.push(
			`Porta fuori dalla radice i fattori con esponente ${multiple}, dividendo l'esponente per ${index}; gli altri restano sotto la radice. $${rootTex(splitTex, index)} = ${carried === simplifiedTex(k, r, index) ? carried : `${carried} = ${simplifiedTex(k, r, index)}`}$.`
		);
		steps.push(`Controlla: $(${simplifiedTex(k, r, index)})${index === 2 ? '^2' : '^3'} = ${intTex(k)}${index === 2 ? '^2' : '^3'} \\cdot ${intTex(r)} = ${intTex(k ** index)} \\cdot ${intTex(r)} = ${intTex(n)}$.`);
	}
	steps.push(`Il valore decimale è approssimato, perché $${intTex(n)}$ non è un ${power} perfetto: $${rootTex(intTex(n), index)} \\approx ${a.tex}$.`);

	const simplified = simplifiedTex(k, r, index, sign);
	const shown = k === 1 ? '' : ` = ${simplified}`;
	const copy = `${k === 1 ? `${sign}${rootText(index)}${intText(r)}` : `${sign}${intText(k)}${rootText(index)}${intText(r)}`} ≈ ${sign}${a.text}`;
	return { ok: true, result: `$${left}${shown} \\approx ${sign}${a.tex}$`, copy, steps };
}
