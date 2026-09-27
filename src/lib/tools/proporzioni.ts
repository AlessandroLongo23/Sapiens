import { q, type Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { decimal } from './numbers';
import { numTex, parseNumber } from './potenze';

/**
 * A proportion a : b = c : d with one unknown term, solved with the fundamental property of the lesson: the
 * product of the means (b · c) equals the product of the extremes (a · d). With all four terms given, the tool
 * checks whether they form a proportion.
 */

export interface ProportionInput {
	a: string;
	b: string;
	c: string;
	d: string;
}

type Key = keyof ProportionInput;
const KEYS: Key[] = ['a', 'b', 'c', 'd'];
const PLACE: Record<Key, string> = { a: 'il primo termine', b: 'il secondo termine', c: 'il terzo termine', d: 'il quarto termine' };

const isUnknown = (s: string) => /^\s*[xX?]?\s*$/.test(s);

/** A term in a product or a proportion: negatives in brackets. */
const term = (r: Rational) => (r.sign() < 0 ? `(${numTex(r)})` : numTex(r));

/** The value of x: "10", "\dfrac{20}{3} \approx 6{,}6667". */
function valueTex(r: Rational): string {
	const d = decimal(r, 4);
	if (r.isInteger() || d.exact) return numTex(r, 4);
	return `${numTex(r, 4)} \\approx ${d.tex}`;
}

function valueText(r: Rational): string {
	const d = decimal(r, 4);
	return d.exact ? d.text : `${r.num}/${r.den}`;
}

const EXAMPLE = 'per esempio 4 : 6 = x : 15';

export function proporzione(input: ProportionInput): Outcome {
	const unknown = KEYS.filter((k) => isUnknown(input[k]));
	if (unknown.length > 1) return fail(`Scrivi tre termini e lascia vuoto (o scrivi x) solo quello da trovare, ${EXAMPLE}.`);

	const v: Partial<Record<Key, Rational>> = {};
	for (const k of KEYS) {
		if (unknown.includes(k)) continue;
		const w = parseNumber(input[k]);
		if (typeof w === 'string') return fail(w);
		if (!w) return fail(`Non riesco a leggere ${PLACE[k]}: scrivi un numero intero, decimale con la virgola (2,5) o una frazione (2/3).`);
		v[k] = w.value;
	}
	if ((v.b && v.b.isZero()) || (v.d && v.d.isZero()))
		return fail(`Il secondo e il quarto termine non possono essere zero, perché sono i divisori dei due rapporti. Cambiali, ${EXAMPLE}.`);

	try {
		return unknown.length ? solve(unknown[0], v) : check(v as Record<Key, Rational>);
	} catch {
		return fail('I numeri sono troppo grandi per un calcolo esatto. Prova con numeri più piccoli, per esempio 4 : 6 = x : 15.');
	}
}

/** The terms as they appear in a formula, the unknown as x (marked when `mark`). */
function show(v: Partial<Record<Key, Rational>>, mark?: Key): Record<Key, string> {
	const one = (k: Key) => {
		const t = v[k] ? term(v[k]!) : 'x';
		return k === mark ? `\\hl{${t}}` : t;
	};
	return { a: one('a'), b: one('b'), c: one('c'), d: one('d') };
}

/** Which term is which: a table with the place, the value and the role. */
function rolesTable(s: Record<Key, string>) {
	const ORD: Record<Key, string> = { a: 'primo', b: 'secondo', c: 'terzo', d: 'quarto' };
	return { head: ['Termine', 'Valore', 'È un'], rows: KEYS.map((k) => [ORD[k], `$${s[k]}$`, k === 'a' || k === 'd' ? 'estremo' : 'medio']) };
}

function solve(x: Key, v: Partial<Record<Key, Rational>>): Outcome {
	const s = show(v, x);
	const plain = show(v);
	const isMean = x === 'b' || x === 'c';
	// x times its partner equals the product of the other pair.
	const partner: Key = { a: 'd', d: 'a', b: 'c', c: 'b' }[x] as Key;
	const others: [Key, Key] = isMean ? ['a', 'd'] : ['b', 'c'];
	const p = v[partner]!;
	const [o1, o2] = others.map((k) => v[k]!);
	if (p.isZero()) return fail(`Con questi numeri la proporzione non ha soluzione: per trovare x dovresti dividere per ${PLACE[partner]}, che è zero. Cambia quel termine, ${EXAMPLE}.`);
	const product = o1.mul(o2);
	const r = product.div(p);
	if (r.isZero() && (x === 'b' || x === 'd'))
		return fail(`Con questi numeri x dovrebbe essere zero, ma ${PLACE[x]} è un divisore e non può valere zero: la proporzione non ha soluzione. Cambia i numeri, ${EXAMPLE}.`);

	const full = { ...v, [x]: r } as Record<Key, Rational>;
	const f = show(full, x);
	const productTex = `${term(o1)} \\cdot ${term(o2)}`;
	const lhs = x === 'a' || x === 'b' ? `x \\cdot ${term(p)}` : `${term(p)} \\cdot x`;
	const known = numTex(product, 4);
	const equation = (right: string) => (isMean ? `${lhs} = ${right}` : `${right} = ${lhs}`);
	// A fraction line when the divisor is a whole number; dividing by a fraction is multiplying by its reciprocal.
	const lines = p.isInteger() ? [`x = \\dfrac{${known}}{${numTex(p)}}`] : [`x = ${term(product)} : ${term(p)}`, `x = ${term(product)} \\cdot ${term(q(1).div(p))}`];
	const d = decimal(r, 4);
	const exact = numTex(r, 4);
	lines.push(`x = \\hl{${exact}}`);
	if (!d.exact) lines.push(`x \\approx ${d.tex}`);

	const steps: Step[] = [
		{
			say: 'Riconosci i medi e gli estremi.',
			math: [`${s.a} : ${s.b} = ${s.c} : ${s.d}`],
			table: rolesTable(plain),
			then: `Qui $x$ è ${isMean ? 'un medio' : 'un estremo'}.`
		},
		{
			say: 'Scrivi che il prodotto dei medi è uguale a quello degli estremi.',
			math: [equation(productTex), equation(`\\hl{${known}}`)]
		},
		{
			say: `Dividi per $${term(p)}$, il termine che moltiplica $x$.`,
			math: lines,
			then: p.isInteger() ? undefined : 'Dividere per una frazione vuol dire moltiplicare per la frazione capovolta.'
		},
		{
			say: 'Controlla: i due rapporti devono essere uguali.',
			math: [`${f.a} : ${f.b} = ${valueTex(full.a.div(full.b))}`, `${f.c} : ${f.d} = ${valueTex(full.c.div(full.d))}`]
		}
	];
	const completed = show(full);
	return {
		ok: true,
		rows: [
			{ label: 'Termine incognito', value: `$x = ${valueTex(r)}$` },
			{ label: 'La proporzione completa', value: `$${completed.a} : ${completed.b} = ${completed.c} : ${completed.d}$` }
		],
		copy: valueText(r),
		steps
	};
}

function check(v: Record<Key, Rational>): Outcome {
	const s = show(v);
	const means = v.b.mul(v.c);
	const extremes = v.a.mul(v.d);
	const ok = means.equals(extremes);
	const m = numTex(means, 4);
	const e = numTex(extremes, 4);
	return {
		ok: true,
		rows: [{ label: ok ? 'I quattro numeri formano una proporzione' : 'I quattro numeri non formano una proporzione', value: `$${s.a} : ${s.b} ${ok ? '=' : '\\neq'} ${s.c} : ${s.d}$` }],
		copy: ok ? 'è una proporzione' : 'non è una proporzione',
		steps: [
			{
				say: 'Hai scritto quattro termini: controlla se formano una proporzione.',
				math: [`${s.a} : ${s.b} \\overset{?}{=} ${s.c} : ${s.d}`],
				table: rolesTable(s),
				then: 'Per trovare un termine, invece, lascia vuoto quel campo o scrivi x.'
			},
			{ say: 'Moltiplica i medi, poi gli estremi.', math: [`${s.b} \\cdot ${s.c} = \\hl{${m}}`, `${s.a} \\cdot ${s.d} = \\hl{${e}}`] },
			{
				say: 'Confronta i due prodotti.',
				math: [ok ? `${m} = ${e}` : `${m} \\neq ${e}`],
				then: ok ? 'I due prodotti sono uguali: i quattro numeri formano una proporzione.' : 'I due prodotti sono diversi: i quattro numeri non formano una proporzione.'
			}
		]
	};
}
