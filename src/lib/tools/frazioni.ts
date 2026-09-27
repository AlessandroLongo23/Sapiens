import { factorize, factorsLatex } from '@/lib/exercises/v2/naturali';
import { gcd, lcm, q, type Rational } from '@/lib/exercises/v2/rational';
import { decimalLatex, toDecimal } from '@/lib/exercises/v2/razionali';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { decimalTex, intTex, parseDecimal } from './numbers';

/**
 * The fraction calculator: the four operations between two fractions and the simplification of one, with the steps
 * of the lessons (reduce to lowest terms, mcm of the denominators and equivalent fractions for + and -, crosswise
 * simplification for ×, the reciprocal for :). Numerators and denominators are integers, negative allowed; an empty
 * denominator makes the fraction an integer. Steps follow the readability rules of docs/strumenti.md: one short
 * sentence, the calculation in `math` lines, lists in tables, `\hl{…}` on what changes.
 */

export type FracOp = 'piu' | 'meno' | 'per' | 'diviso' | 'semplifica';

export interface FracInput {
	op: FracOp;
	/** Numerator and denominator of the first fraction. */
	an: string;
	ad: string;
	/** Numerator and denominator of the second fraction (ignored by `semplifica`). */
	bn: string;
	bd: string;
}

/** Largest numerator or denominator accepted: products and the mcm stay far from the safe-integer limit. */
const MAX = 999_999;

/** A fraction as a pair, denominator positive, not necessarily reduced. */
interface Frac {
	n: number;
	d: number;
}

// ---------------------------------------------------------------------------
// LaTeX

/** A fraction standing alone: "\dfrac{3}{4}", "-\dfrac{3}{4}", "5" when the denominator is 1. */
export function fracTex(n: number, d: number): string {
	if (d === 1) return intTex(n);
	return `${n < 0 ? '-' : ''}\\dfrac{${intTex(Math.abs(n))}}{${intTex(d)}}`;
}

const ft = (f: Frac) => fracTex(f.n, f.d);

/** A fraction after an operator: a negative one in brackets. */
function operand(f: Frac): string {
	if (f.n >= 0) return ft(f);
	return f.d === 1 ? `(${ft(f)})` : `\\left(${ft(f)}\\right)`;
}

/** "-\dfrac{84 : 12}{36 : 12}": numerator and denominator both divided (or multiplied) by k, shown. */
const both = (f: Frac, sym: string, k: number) => `${f.n < 0 ? '-' : ''}\\dfrac{${intTex(Math.abs(f.n))} ${sym} ${intTex(k)}}{${intTex(f.d)} ${sym} ${intTex(k)}}`;

const hl = (s: string) => `\\hl{${s}}`;

const factorLine = (n: number) => (n === 1 ? '1' : factorsLatex(factorize(n)));

/** The value of a fraction as plain text, for the copy button: "11/12", "-3". */
const copyText = (f: Frac) => (f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);

/** A rational as a decimal: "0{,}91\overline{6}", or "\approx 0{,}1235" when the period is too long. */
function decimalValue(r: Rational): { tex: string; exact: boolean } {
	const d = toDecimal(r, 6, 6);
	return d ? { tex: decimalLatex(d), exact: true } : { tex: decimalTex(r, 4), exact: false };
}

// ---------------------------------------------------------------------------
// Reading

const ORD = ['prima', 'seconda'];

function readFrac(ns: string, ds: string, i: number): Frac | string {
	const which = ORD[i];
	if (!ns.trim()) return `Scrivi il numeratore della ${which} frazione, per esempio 3.`;
	const n = parseDecimal(ns);
	const d = ds.trim() ? parseDecimal(ds) : q(1);
	if (!n || !d || !n.isInteger() || !d.isInteger()) return 'Numeratore e denominatore devono essere numeri interi, come 3 o -4.';
	if (Math.abs(n.num) > MAX || Math.abs(d.num) > MAX) return 'Usa numeri fino a 999 999: per esempio 12 o 360.';
	if (d.num === 0) return `Il denominatore della ${which} frazione è 0, e per zero non si può dividere: scrivi un altro numero, per esempio 4.`;
	return { n: n.num, d: d.num };
}

// ---------------------------------------------------------------------------
// Steps shared by the operations

/** A negative denominator moved to the front: 3/-4 → -3/4. */
function normalize(f: Frac, steps: Step[], which?: string): Frac {
	if (f.d > 0) return f;
	const out = { n: -f.n, d: -f.d };
	steps.push({
		say: `Porta il segno del denominatore davanti alla ${which ? `${which} ` : ''}frazione.`,
		math: [`\\dfrac{${intTex(f.n)}}{${intTex(f.d)}} = ${hl(ft(out))}`]
	});
	return out;
}

function reduce(f: Frac): Frac {
	const g = gcd(f.n, f.d) || 1;
	return { n: f.n / g, d: f.d / g };
}

/** Every fraction not in lowest terms, reduced in one step: one line each, the division by the MCD shown. */
function reduceAll(fs: Frac[], steps: Step[]): Frac[] {
	const out = fs.map(reduce);
	const lines = fs.flatMap((f, i) => (f.d !== out[i].d ? [`${ft(f)} = ${both(f, ':', f.d / out[i].d)} = ${hl(ft(out[i]))}`] : []));
	if (lines.length) {
		steps.push({
			say: `Riduci ${lines.length === 1 ? 'la frazione' : 'le frazioni'} ai minimi termini: dividi numeratore e denominatore per il loro MCD.`,
			math: lines
		});
	}
	return out;
}

/** The simplification of a result, when it is not already in lowest terms. */
function simplifyResult(f: Frac, steps: Step[]): Frac {
	if (f.n === 0) return { n: 0, d: 1 };
	const g = gcd(f.n, f.d);
	if (g <= 1) return f;
	const out = { n: f.n / g, d: f.d / g };
	steps.push({
		say: 'Semplifica il risultato: dividi numeratore e denominatore per il loro MCD.',
		math: [`\\text{MCD}(${intTex(Math.abs(f.n))}, ${intTex(f.d)}) = ${intTex(g)}`, `${ft(f)} = ${both(f, ':', g)}`, `= ${hl(ft(out))}`]
	});
	return out;
}

/** The result as a mixed number and as a decimal: the rows of the answer, and the steps that find them. */
function otherForms(f: Frac, steps: Step[]): ResultRow[] {
	if (f.d === 1) return [];
	const rows: ResultRow[] = [];
	const a = Math.abs(f.n);
	const whole = Math.floor(a / f.d);
	const neg = f.n < 0 ? '-' : '';
	if (whole > 0) {
		const rest = a % f.d;
		const mixed = `${intTex(whole)} + ${fracTex(rest, f.d)}`;
		const value = f.n < 0 ? `-\\left(${mixed}\\right)` : mixed;
		steps.push({
			say: 'Per il numero misto, dividi il numeratore per il denominatore con il resto.',
			math: [`${intTex(a)} : ${intTex(f.d)} = ${intTex(whole)} \\text{ con resto } ${intTex(rest)}`, `${ft(f)} = ${hl(value)}`],
			then: `Il quoziente $${intTex(whole)}$ è la parte intera, il resto $${intTex(rest)}$ va al numeratore.`
		});
		rows.push({ label: 'Come numero misto', value: `$${value}$` });
	}
	const dec = decimalValue(q(f.n, f.d));
	const division = neg ? `-(${intTex(a)} : ${intTex(f.d)})` : `${intTex(a)} : ${intTex(f.d)}`;
	steps.push({
		say: 'Per il numero decimale, dividi il numeratore per il denominatore.',
		math: [`${ft(f)} = ${division}`, `${dec.exact ? '= ' : ''}${hl(dec.tex)}`],
		then: dec.exact ? undefined : 'Dopo la virgola ci sono molte cifre: qui il valore è arrotondato a quattro.'
	});
	rows.push({ label: 'In decimali', value: `$${dec.tex}$` });
	return rows;
}

/** More than five steps: the working and the other forms of the result, each under its heading. */
function grouped(steps: Step[], formsFrom: number): Step[] {
	if (steps.length <= 5) return steps;
	return steps.map((s, i) => (i === 0 ? { ...s, group: 'Il calcolo' } : i === formsFrom ? { ...s, group: 'Il risultato in altre forme' } : s));
}

// ---------------------------------------------------------------------------
// The operations

function simplify(raw: Frac): Outcome {
	const steps: Step[] = [];
	const f = normalize(raw, steps);
	const label = 'Ridotta ai minimi termini';
	if (f.n === 0) {
		steps.push({ say: 'Il numeratore è $0$ e il denominatore no: la frazione vale $0$.', math: [`${ft(f)} = ${hl('0')}`] });
		return { ok: true, rows: [{ label: 'Risultato', value: '$0$' }], copy: '0', steps };
	}
	if (f.d === 1) {
		steps.push({ say: 'Il denominatore è $1$: la frazione è già un numero intero.' });
		return { ok: true, rows: [{ label: 'Risultato', value: `$${ft(f)}$` }], copy: copyText(f), steps };
	}
	const a = Math.abs(f.n);
	const g = gcd(a, f.d);
	const out = { n: f.n / g, d: f.d / g };
	if (a > 1) {
		steps.push({
			say: 'Scomponi numeratore e denominatore in fattori primi.',
			table: { head: ['Numero', 'Fattori primi'], rows: [a, f.d].map((n) => [`$${intTex(n)}$`, `$${factorLine(n)}$`]) }
		});
	}
	if (g === 1) {
		steps.push({
			say: 'Cerca i fattori primi comuni a numeratore e denominatore.',
			then: 'Non ce ne sono: il MCD è $1$, quindi la frazione è già ridotta ai minimi termini.'
		});
	} else {
		const common = factorize(g);
		steps.push({
			say: 'Prendi i fattori comuni, ognuno con l’esponente più piccolo: il loro prodotto è il MCD.',
			math: common.length > 1 || common[0][1] > 1 ? [`\\text{MCD}(${intTex(a)}, ${intTex(f.d)}) = ${factorsLatex(common)}`, `= ${hl(intTex(g))}`] : [`\\text{MCD}(${intTex(a)}, ${intTex(f.d)}) = ${hl(intTex(g))}`]
		});
		steps.push({ say: `Dividi numeratore e denominatore per $${intTex(g)}$.`, math: [`${ft(f)} = ${both(f, ':', g)}`, `= ${hl(ft(out))}`] });
	}
	const formsFrom = steps.length;
	const more = otherForms(out, steps);
	return { ok: true, rows: [{ label, value: `$${ft(out)}$` }, ...more], copy: copyText(out), steps: grouped(steps, formsFrom) };
}

function addSub(x: Frac, y: Frac, minus: boolean, steps: Step[]): Frac {
	const sym = minus ? '-' : '+';
	const [a, b] = reduceAll([x, y], steps);
	const opLine = `${ft(a)} ${sym} ${operand(b)}`;
	let na: number, nb: number, m: number;
	if (a.d === b.d) {
		m = a.d;
		na = a.n;
		nb = b.n;
	} else {
		m = lcm(a.d, b.d);
		na = a.n * (m / a.d);
		nb = b.n * (m / b.d);
		const mf = factorize(m);
		const prime = mf.length === 1 && mf[0][1] === 1;
		steps.push({
			say: 'Calcola il mcm dei denominatori: scomponili in fattori primi.',
			table: {
				head: ['Numero', 'Fattori primi'],
				rows: [...[a.d, b.d].map((d) => [`$${intTex(d)}$`, `$${factorLine(d)}$`]), ['mcm', prime ? `$${hl(intTex(m))}$` : `$${factorsLatex(mf)} = ${hl(intTex(m))}$`]]
			},
			then: `Il mcm prende tutti i fattori, ognuno con l’esponente più grande. $${intTex(m)}$ è il denominatore comune.`
		});
		const change = [a, b].map((f, i) => ({ f, i, k: m / f.d })).filter((c) => c.k > 1);
		steps.push({
			say:
				change.length === 2
					? `Porta ogni frazione al denominatore $${intTex(m)}$: moltiplica numeratore e denominatore per lo stesso numero.`
					: `Porta la ${ORD[change[0].i]} frazione al denominatore $${intTex(m)}$: moltiplica numeratore e denominatore per lo stesso numero.`,
			table: {
				head: ['Moltiplica per', `Con denominatore $${intTex(m)}$`],
				rows: change.map(({ f, k }) => [`$${intTex(m)} : ${intTex(f.d)} = ${intTex(k)}$`, `$${both(f, '\\cdot', k)} = ${hl(fracTex(f.n * k, m))}$`])
			}
		});
	}
	const total = minus ? na - nb : na + nb;
	// The numerators combined, the sign of the second one folded into the operation: 9 + (-2) is 9 - 2.
	const second = (minus ? -nb : nb) < 0 ? `- ${intTex(Math.abs(nb))}` : `+ ${intTex(Math.abs(nb))}`;
	const combined = `${intTex(na)} ${second}`;
	if (m === 1) {
		const verb = minus ? 'Sottrai' : 'Somma';
		steps.push({ say: `${verb} i due numeri.`, math: combined === opLine ? [`${opLine} = ${hl(intTex(total))}`] : [`${opLine} = ${combined}`, `= ${hl(intTex(total))}`] });
	} else {
		const eqLine = a.d === b.d ? opLine : `${fracTex(na, m)} ${sym} ${operand({ n: nb, d: m })}`;
		steps.push({
			say: `${minus ? 'Sottrai' : 'Somma'} i numeratori e lascia il denominatore $${intTex(m)}$.`,
			math: [`${eqLine} = \\dfrac{${combined}}{${intTex(m)}}`, `= ${hl(fracTex(total, m))}`],
			then: a.d === b.d ? 'Le frazioni hanno già lo stesso denominatore: non serve il mcm.' : undefined
		});
	}
	return simplifyResult({ n: total, d: m }, steps);
}

function multiply(x: Frac, y: Frac, steps: Step[], reduced = false): Frac {
	const [a, b] = reduced ? [x, y] : reduceAll([x, y], steps);
	if (a.n === 0 || b.n === 0) {
		steps.push({ say: 'Uno dei fattori vale $0$: il prodotto è $0$.', math: [`${ft(a)} \\cdot ${operand(b)} = ${hl('0')}`] });
		return { n: 0, d: 1 };
	}
	const neg = a.n < 0 !== b.n < 0;
	let [an, ad, bn, bd] = [Math.abs(a.n), a.d, Math.abs(b.n), b.d];
	const abs = (n1: number, d1: number, n2: number, d2: number) => `${fracTex(n1, d1)} \\cdot ${fracTex(n2, d2)}`;
	if (a.n < 0 || b.n < 0) {
		const why = a.n < 0 && b.n < 0 ? 'Meno per meno dà più' : a.n < 0 ? 'Meno per più dà meno' : 'Più per meno dà meno';
		steps.push({
			say: 'Stabilisci il segno del prodotto, poi continua con le frazioni senza segno.',
			math: [`${ft(a)} \\cdot ${operand(b)} = ${neg ? hl('-') : ''}${abs(an, ad, bn, bd)}`],
			then: `${why}: il prodotto è ${neg ? 'negativo' : 'positivo'}.`
		});
	}
	const g1 = gcd(an, bd), g2 = gcd(bn, ad);
	if (g1 > 1 || g2 > 1) {
		const rows: string[][] = [];
		if (g1 > 1) rows.push([`$${intTex(an)}$ e $${intTex(bd)}$`, `$${intTex(g1)}$`, `$${intTex(an / g1)}$ e $${intTex(bd / g1)}$`]);
		if (g2 > 1) rows.push([`$${intTex(bn)}$ e $${intTex(ad)}$`, `$${intTex(g2)}$`, `$${intTex(bn / g2)}$ e $${intTex(ad / g2)}$`]);
		const mark = (v: number, changed: boolean) => (changed ? hl(intTex(v)) : intTex(v));
		[an, bd, bn, ad] = [an / g1, bd / g1, bn / g2, ad / g2];
		const after = `\\dfrac{${mark(an, g1 > 1)}}{${mark(ad, g2 > 1)}} \\cdot \\dfrac{${mark(bn, g2 > 1)}}{${mark(bd, g1 > 1)}}`;
		steps.push({
			say: 'Semplifica in croce: il numeratore di una frazione con il denominatore dell’altra.',
			table: { head: ['Numeri', 'Dividi per', 'Diventano'], rows },
			then: `Ottieni $${after}$.`
		});
	} else if (ad > 1 || bd > 1) {
		steps.push({
			say: 'Controlla se puoi semplificare in croce.',
			then: 'Non si può semplificare in croce: nessun numeratore ha fattori in comune con il denominatore dell’altra frazione.'
		});
	}
	const n = an * bn, d = ad * bd;
	const sign = neg ? '-' : '';
	const value = fracTex(neg ? -n : n, d);
	if (d === 1) steps.push({ say: 'Moltiplica i due numeri.', math: [`${sign}${intTex(an)} \\cdot ${intTex(bn)} = ${hl(value)}`] });
	else {
		steps.push({
			say: 'Moltiplica i numeratori tra loro e i denominatori tra loro.',
			math: [`${sign}${abs(an, ad, bn, bd)} = ${sign}\\dfrac{${intTex(an)} \\cdot ${intTex(bn)}}{${intTex(ad)} \\cdot ${intTex(bd)}}`, `= ${hl(value)}`]
		});
	}
	// Reduced fractions simplified crosswise give a product in lowest terms; this is only a safety net.
	return simplifyResult({ n: neg ? -n : n, d }, steps);
}

function divide(x: Frac, y: Frac, steps: Step[]): Frac | string {
	if (y.n === 0) return 'La seconda frazione vale 0: non si può dividere per zero. Cambia il suo numeratore, per esempio in 3.';
	const [a, b] = reduceAll([x, y], steps);
	const r = b.n < 0 ? { n: -b.d, d: -b.n } : { n: b.d, d: b.n };
	steps.push({
		say: 'Trasforma la divisione in una moltiplicazione per il reciproco della seconda frazione.',
		math: [`${ft(a)} : ${operand(b)} = ${ft(a)} \\cdot ${hl(operand(r))}`],
		then: 'Il reciproco si ottiene scambiando numeratore e denominatore.'
	});
	return multiply(a, r, steps, true);
}

export function frazioni({ op, an, ad, bn, bd }: FracInput): Outcome {
	const rawA = readFrac(an, ad, 0);
	if (typeof rawA === 'string') return fail(rawA);
	if (op === 'semplifica') return simplify(rawA);
	const rawB = readFrac(bn, bd, 1);
	if (typeof rawB === 'string') return fail(rawB);
	try {
		const steps: Step[] = [];
		const a = normalize(rawA, steps, 'prima');
		const b = normalize(rawB, steps, 'seconda');
		const r = op === 'piu' || op === 'meno' ? addSub(a, b, op === 'meno', steps) : op === 'per' ? multiply(a, b, steps) : divide(a, b, steps);
		if (typeof r === 'string') return fail(r);
		const formsFrom = steps.length;
		const more = otherForms(r, steps);
		return { ok: true, rows: [{ label: 'Risultato', value: `$${ft(r)}$` }, ...more], copy: copyText(r), steps: grouped(steps, formsFrom) };
	} catch {
		return fail('I numeri diventano troppo grandi per questo calcolatore: prova con numeri più piccoli, per esempio sotto 10 000.');
	}
}
