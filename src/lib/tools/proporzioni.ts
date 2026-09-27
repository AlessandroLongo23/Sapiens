import type { Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome } from './types';
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

export function proporzione(input: ProportionInput): Outcome {
	const unknown = KEYS.filter((k) => isUnknown(input[k]));
	if (unknown.length > 1) return fail('Scrivi tre termini e lascia vuoto (o scrivi x) solo quello da trovare.');

	const v: Partial<Record<Key, Rational>> = {};
	for (const k of KEYS) {
		if (unknown.includes(k)) continue;
		const w = parseNumber(input[k]);
		if (typeof w === 'string') return fail(w);
		if (!w) return fail(`Non riesco a leggere ${PLACE[k]}: scrivi un numero intero, decimale (con la virgola) o una frazione come 2/3.`);
		v[k] = w.value;
	}
	if ((v.b && v.b.isZero()) || (v.d && v.d.isZero())) return fail('Il secondo e il quarto termine non possono essere zero: sono i divisori dei due rapporti, e per zero non si divide.');

	try {
		return unknown.length ? solve(unknown[0], v) : check(v as Record<Key, Rational>);
	} catch {
		return fail('I numeri sono troppo grandi per un calcolo esatto: prova con numeri più piccoli.');
	}
}

function show(v: Partial<Record<Key, Rational>>): Record<Key, string> {
	return { a: v.a ? term(v.a) : 'x', b: v.b ? term(v.b) : 'x', c: v.c ? term(v.c) : 'x', d: v.d ? term(v.d) : 'x' };
}

function solve(x: Key, v: Partial<Record<Key, Rational>>): Outcome {
	const s = show(v);
	const isMean = x === 'b' || x === 'c';
	// x times its partner equals the product of the other pair.
	const partner: Key = { a: 'd', d: 'a', b: 'c', c: 'b' }[x] as Key;
	const others: [Key, Key] = isMean ? ['a', 'd'] : ['b', 'c'];
	const p = v[partner]!;
	const [o1, o2] = others.map((k) => v[k]!);
	if (p.isZero()) return fail(`Con questi numeri la proporzione non ha soluzione: per trovare x dovresti dividere per ${PLACE[partner]}, che è zero.`);
	const product = o1.mul(o2);
	const r = product.div(p);
	if (r.isZero() && (x === 'b' || x === 'd')) return fail(`Con questi numeri x dovrebbe essere zero, ma ${PLACE[x]} è un divisore e non può valere zero: la proporzione non ha soluzione.`);

	const prop = `${s.a} : ${s.b} = ${s.c} : ${s.d}`;
	const full = { ...v, [x]: r } as Record<Key, Rational>;
	const f = show(full);
	const means = isMean ? 'un medio' : 'un estremo';
	const productTex = `${term(o1)} \\cdot ${term(o2)}`;
	const lhs = x === 'a' || x === 'b' ? `x \\cdot ${term(p)}` : `${term(p)} \\cdot x`;
	const left = full.a.div(full.b);
	// A fraction line when the divisor is whole, the division sign when it is a fraction.
	const division = p.isInteger() && p.sign() > 0 ? `\\dfrac{${productTex}}{${term(p)}} = \\dfrac{${term(product)}}{${term(p)}}` : `(${productTex}) : ${term(p)} = ${term(product)} : ${term(p)}`;
	const steps = [
		`Nella proporzione $${prop}$ i medi sono il secondo e il terzo termine, gli estremi il primo e il quarto: qui $x$ è ${means}.`,
		`Applica la proprietà fondamentale: il prodotto dei medi è uguale al prodotto degli estremi. $${isMean ? `${lhs} = ${productTex}` : `${productTex} = ${lhs}`}$.`,
		`Ricava $x$ dividendo il prodotto ${isMean ? 'degli estremi' : 'dei medi'} per l'altro ${isMean ? 'medio' : 'estremo'}: $x = ${division} = ${valueTex(r)}$.`,
		`Controlla che i due rapporti siano uguali: $${f.a} : ${f.b} = ${valueTex(left)}$ e $${f.c} : ${f.d} = ${valueTex(full.c.div(full.d))}$.`
	];
	return { ok: true, result: `$x = ${valueTex(r)}$`, copy: valueText(r), steps };
}

function check(v: Record<Key, Rational>): Outcome {
	const s = show(v);
	const prop = `${s.a} : ${s.b} = ${s.c} : ${s.d}`;
	const means = v.b.mul(v.c);
	const extremes = v.a.mul(v.d);
	const ok = means.equals(extremes);
	return {
		ok: true,
		result: ok ? `$${prop}$ è una proporzione` : `$${s.a} : ${s.b} \\neq ${s.c} : ${s.d}$`,
		copy: ok ? 'è una proporzione' : 'non è una proporzione',
		steps: [
			'Hai scritto tutti e quattro i termini: controlla se formano una proporzione. Per trovare un termine, lascia vuoto quel campo o scrivi x.',
			`Calcola il prodotto dei medi, $${s.b} \\cdot ${s.c} = ${numTex(means, 4)}$, e il prodotto degli estremi, $${s.a} \\cdot ${s.d} = ${numTex(extremes, 4)}$.`,
			ok ? 'I due prodotti sono uguali: i quattro numeri formano una proporzione.' : 'I due prodotti sono diversi: i quattro numeri non formano una proporzione.'
		]
	};
}
