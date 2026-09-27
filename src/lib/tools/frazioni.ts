import { factorize, factorsLatex } from '@/lib/exercises/v2/naturali';
import { gcd, lcm, q, type Rational } from '@/lib/exercises/v2/rational';
import { decimalLatex, toDecimal } from '@/lib/exercises/v2/razionali';
import { fail, type Outcome } from './types';
import { decimalTex, intTex, parseDecimal } from './numbers';

/**
 * The fraction calculator: the four operations between two fractions and the simplification of one, with the steps
 * of the lessons (reduce to lowest terms, mcm of the denominators and equivalent fractions for + and -, crosswise
 * simplification for ×, the reciprocal for :). Numerators and denominators are integers, negative allowed; an empty
 * denominator makes the fraction an integer.
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

const factorLine = (n: number) => (n === 1 ? '1' : factorsLatex(factorize(n)));

/** A rational as a decimal: "0{,}91\overline{6}", or "\approx …" when the period is too long. */
function decimalForm(r: Rational): string {
	const d = toDecimal(r, 6, 6);
	return d ? `= ${decimalLatex(d)}` : decimalTex(r, 4);
}

/** The value of a fraction as plain text, for the copy button: "11/12", "-3". */
const copyText = (f: Frac) => (f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);

// ---------------------------------------------------------------------------
// Reading

const ORD = ['prima', 'seconda'];

function readFrac(ns: string, ds: string, i: number): Frac | string {
	const which = ORD[i];
	if (!ns.trim()) return `Scrivi il numeratore della ${which} frazione.`;
	const n = parseDecimal(ns);
	const d = ds.trim() ? parseDecimal(ds) : q(1);
	if (!n || !d || !n.isInteger() || !d.isInteger()) return 'Numeratore e denominatore devono essere numeri interi, come 3 o -4.';
	if (Math.abs(n.num) > MAX || Math.abs(d.num) > MAX) return 'Usa numeri fino a 999 999.';
	if (d.num === 0) return `Il denominatore della ${which} frazione è 0: una frazione con denominatore zero non ha senso, perché non si può dividere per zero.`;
	return { n: n.num, d: d.num };
}

// ---------------------------------------------------------------------------
// Steps shared by the operations

/** A negative denominator moved to the front: 3/-4 → -3/4. */
function normalize(f: Frac, steps: string[]): Frac {
	if (f.d > 0) return f;
	const out = { n: -f.n, d: -f.d };
	steps.push(`Porta il segno del denominatore davanti alla frazione: $\\dfrac{${intTex(f.n)}}{${intTex(f.d)}} = ${ft(out)}$.`);
	return out;
}

function reduce(f: Frac): Frac {
	const g = gcd(f.n, f.d) || 1;
	return { n: f.n / g, d: f.d / g };
}

/** Every fraction not in lowest terms, reduced in one step. */
function reduceAll(fs: Frac[], steps: string[]): Frac[] {
	const out = fs.map(reduce);
	const changed = fs.map((f, i) => (f.d !== out[i].d ? `$${ft(f)} = ${ft(out[i])}$` : '')).filter(Boolean);
	if (changed.length) {
		const one = changed.length === 1;
		steps.push(`Riduci ${one ? 'la frazione' : 'le frazioni'} ai minimi termini, dividendo numeratore e denominatore per il loro MCD: ${changed.join(', ')}.`);
	}
	return out;
}

/** The simplification of a result, when it is not already in lowest terms. */
function simplifyResult(f: Frac, steps: string[]): Frac {
	const g = gcd(f.n, f.d);
	if (f.n === 0) return { n: 0, d: 1 };
	if (g <= 1) return f;
	const out = { n: f.n / g, d: f.d / g };
	steps.push(`Semplifica il risultato: $\\text{MCD}(${intTex(Math.abs(f.n))}, ${intTex(f.d)}) = ${intTex(g)}$, quindi $${ft(f)} = ${ft(out)}$.`);
	return out;
}

/** The result as a mixed number and as a decimal, when it is a proper fraction or larger. */
function otherForms(f: Frac, steps: string[]) {
	if (f.d === 1) return;
	const r = q(f.n, f.d);
	const a = Math.abs(f.n);
	const whole = Math.floor(a / f.d);
	const parts: string[] = [];
	if (whole > 0) {
		const mixed = `${intTex(whole)} + ${fracTex(a % f.d, f.d)}`;
		parts.push(`come numero misto $${ft(f)} = ${f.n < 0 ? `-\\left(${mixed}\\right)` : mixed}$`);
	}
	parts.push(`come numero decimale $${ft(f)} ${decimalForm(r)}$`);
	steps.push(`Se ti serve in un'altra forma, dividi il numeratore per il denominatore: ${parts.join('; ')}.`);
}

// ---------------------------------------------------------------------------
// The operations

function simplify(raw: Frac): Outcome {
	const steps: string[] = [];
	const f = normalize(raw, steps);
	const start = raw.d > 0 ? ft(raw) : `\\dfrac{${intTex(raw.n)}}{${intTex(raw.d)}}`;
	if (f.n === 0) {
		steps.push('Il numeratore è 0 e il denominatore no: la frazione vale 0.');
		return { ok: true, result: `$${start} = 0$`, copy: '0', steps };
	}
	const a = Math.abs(f.n);
	const g = gcd(a, f.d);
	const out = { n: f.n / g, d: f.d / g };
	if (f.d === 1) {
		steps.push('Il denominatore è 1: la frazione è già un numero intero.');
		return { ok: true, result: `$${start}$`, copy: copyText(f), steps };
	}
	if (a > 1) steps.push(`Scomponi numeratore e denominatore in fattori primi: $${intTex(a)} = ${factorLine(a)}$, $${intTex(f.d)} = ${factorLine(f.d)}$.`);
	if (g === 1) {
		steps.push(`Numeratore e denominatore non hanno fattori primi in comune: il loro MCD è 1, quindi la frazione è già ridotta ai minimi termini.`);
	} else {
		steps.push(`Prendi i fattori comuni con l'esponente più piccolo: $\\text{MCD}(${intTex(a)}, ${intTex(f.d)}) = ${intTex(g)}$.`);
		const sign = f.n < 0 ? '-' : '';
		const divided = `${sign}\\dfrac{${intTex(a)} : ${intTex(g)}}{${intTex(f.d)} : ${intTex(g)}}`;
		steps.push(`Dividi numeratore e denominatore per ${intTex(g)}: $${ft(f)} = ${divided} = ${ft(out)}$.`);
	}
	otherForms(out, steps);
	return { ok: true, result: `$${start} = ${ft(out)}$`, copy: copyText(out), steps };
}

function addSub(x: Frac, y: Frac, minus: boolean, steps: string[]): Frac {
	const sym = minus ? '-' : '+';
	const verb = minus ? 'Sottrai' : 'Somma';
	const [a, b] = reduceAll([x, y], steps);
	const opLine = `${ft(a)} ${sym} ${operand(b)}`;
	let na: number, nb: number, m: number;
	if (a.d === b.d) {
		m = a.d;
		na = a.n;
		nb = b.n;
		if (m > 1) steps.push(`Le frazioni hanno lo stesso denominatore, ${intTex(m)}: ${minus ? 'sottrai' : 'somma'} i numeratori e lascia il denominatore.`);
	} else {
		m = lcm(a.d, b.d);
		na = a.n * (m / a.d);
		nb = b.n * (m / b.d);
		steps.push(`Calcola il mcm dei denominatori: $\\text{mcm}(${intTex(a.d)}, ${intTex(b.d)}) = ${intTex(m)}$. È il denominatore comune.`);
		const eq = (f: Frac, n: number) => `$${ft(f)} = ${f.n < 0 ? '-' : ''}\\dfrac{${intTex(Math.abs(f.n))} \\cdot ${intTex(m / f.d)}}{${intTex(m)}} = ${fracTex(n, m)}$`;
		steps.push(`Trasforma ogni frazione in una equivalente con denominatore ${intTex(m)}: dividi ${intTex(m)} per il denominatore e moltiplica il risultato per il numeratore. ${eq(a, na)}, ${eq(b, nb)}.`);
	}
	const total = minus ? na - nb : na + nb;
	// The numerators combined, the sign of the second one folded into the operation: 9 + (-2) is 9 - 2.
	const second = (minus ? -nb : nb) < 0 ? `- ${intTex(Math.abs(nb))}` : `+ ${intTex(Math.abs(nb))}`;
	const combined = `${intTex(na)} ${second}`;
	if (m === 1) {
		const mid = combined === opLine ? '' : `${combined} = `;
		steps.push(`${verb}: $${opLine} = ${mid}${intTex(total)}$.`);
	} else {
		const eqLine = a.d === b.d ? opLine : `${fracTex(na, m)} ${sym} ${operand({ n: nb, d: m })}`;
		steps.push(`${verb} i numeratori: $${eqLine} = \\dfrac{${combined}}{${intTex(m)}} = ${fracTex(total, m)}$.`);
	}
	return simplifyResult({ n: total, d: m }, steps);
}

function multiply(x: Frac, y: Frac, steps: string[], reduced = false): Frac {
	const [a, b] = reduced ? [x, y] : reduceAll([x, y], steps);
	if (a.n === 0 || b.n === 0) {
		steps.push('Uno dei fattori vale 0, quindi il prodotto è 0.');
		return { n: 0, d: 1 };
	}
	const neg = a.n < 0 !== b.n < 0;
	if (a.n < 0 || b.n < 0) {
		const why = a.n < 0 && b.n < 0 ? 'meno per meno dà più' : a.n < 0 ? 'meno per più dà meno' : 'più per meno dà meno';
		steps.push(`Stabilisci il segno: ${why}, quindi il prodotto è ${neg ? 'negativo' : 'positivo'}. Poi lavora sui valori assoluti.`);
	}
	let [an, ad, bn, bd] = [Math.abs(a.n), a.d, Math.abs(b.n), b.d];
	const g1 = gcd(an, bd), g2 = gcd(bn, ad);
	if (g1 > 1 || g2 > 1) {
		const said: string[] = [];
		if (g1 > 1) said.push(`${intTex(an)} e ${intTex(bd)} per ${intTex(g1)}`);
		if (g2 > 1) said.push(`${intTex(bn)} e ${intTex(ad)} per ${intTex(g2)}`);
		const before = `${fracTex(an, ad)} \\cdot ${fracTex(bn, bd)}`;
		[an, bd, bn, ad] = [an / g1, bd / g1, bn / g2, ad / g2];
		steps.push(`Semplifica in croce, cioè il numeratore di una frazione con il denominatore dell'altra: dividi ${said.join(', e ')}. Ottieni $${before} = ${fracTex(an, ad)} \\cdot ${fracTex(bn, bd)}$.`);
	} else if (ad > 1 || bd > 1) {
		steps.push('Non si può semplificare in croce: nessun numeratore ha fattori in comune con il denominatore dell\'altra frazione.');
	}
	const n = an * bn, d = ad * bd;
	const sign = neg ? '-' : '';
	if (d === 1) steps.push(`Moltiplica: $${sign}${intTex(an)} \\cdot ${intTex(bn)} = ${intTex(neg ? -n : n)}$.`);
	else steps.push(`Moltiplica i numeratori tra loro e i denominatori tra loro: $${sign}\\dfrac{${intTex(an)} \\cdot ${intTex(bn)}}{${intTex(ad)} \\cdot ${intTex(bd)}} = ${fracTex(neg ? -n : n, d)}$.`);
	// Reduced fractions simplified crosswise give a product in lowest terms; this is only a safety net.
	return simplifyResult({ n: neg ? -n : n, d }, steps);
}

function divide(x: Frac, y: Frac, steps: string[]): Frac | string {
	if (y.n === 0) return 'La seconda frazione vale 0: non si può dividere per zero, perché 0 non ha reciproco.';
	const [a, b] = reduceAll([x, y], steps);
	const r = b.n < 0 ? { n: -b.d, d: -b.n } : { n: b.d, d: b.n };
	steps.push(`Dividere per una frazione vuol dire moltiplicare per il suo reciproco, che si ottiene scambiando numeratore e denominatore: $${ft(a)} : ${operand(b)} = ${ft(a)} \\cdot ${operand(r)}$.`);
	return multiply(a, r, steps, true);
}

const SYM: Record<Exclude<FracOp, 'semplifica'>, string> = { piu: '+', meno: '-', per: '\\cdot', diviso: ':' };

export function frazioni({ op, an, ad, bn, bd }: FracInput): Outcome {
	const rawA = readFrac(an, ad, 0);
	if (typeof rawA === 'string') return fail(rawA);
	if (op === 'semplifica') return simplify(rawA);
	const rawB = readFrac(bn, bd, 1);
	if (typeof rawB === 'string') return fail(rawB);
	try {
		const steps: string[] = [];
		const a = normalize(rawA, steps);
		const b = normalize(rawB, steps);
		const r = op === 'piu' || op === 'meno' ? addSub(a, b, op === 'meno', steps) : op === 'per' ? multiply(a, b, steps) : divide(a, b, steps);
		if (typeof r === 'string') return fail(r);
		otherForms(r, steps);
		return { ok: true, result: `$${ft(a)} ${SYM[op]} ${operand(b)} = ${ft(r)}$`, copy: copyText(r), steps };
	} catch {
		return fail('I numeri diventano troppo grandi per questo calcolatore: prova con numeri più piccoli.');
	}
}
