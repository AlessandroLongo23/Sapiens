/**
 * Rapporti, proporzioni e percentuali. Spec: specs/exercises/numeri-razionali-proporzioni.md
 *
 * Seven levels in the order of the lesson: the ratio of two integers, the unknown term of a
 * proportion with positive integers, the unknown term with fractions, decimals or negative terms,
 * the three percentage questions (part, percentage, total), a single increase or discount (forward,
 * backward, percentage change), two successive changes, word problems solved with a proportion
 * (direct proportionality, map scales, parts in a given ratio). Every answer is an exact rational in
 * `answer.value`; the multiple-choice options come from the mistakes the lesson warns about.
 * Levels 1-3 show a formula; levels 4-6 are short word problems in `prompt`, with an empty problem;
 * level 7 has its text in `problem` (a textBlock) and the instruction in `prompt`.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { buildChoice, weighted } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'numeri-razionali-proporzioni';

// ---------------------------------------------------------------------------
// Numbers and formatting

const R = (s: string) => Rational.parse(s);
const HUNDRED = q(100);

/** Decimal places of a rational with a finite decimal expansion, or null if it is periodic. */
function decimals(r: Rational): number | null {
	let d = r.den, e2 = 0, e5 = 0;
	for (; d % 2 === 0; e2++) d /= 2;
	for (; d % 5 === 0; e5++) d /= 5;
	return d === 1 ? Math.max(e2, e5) : null;
}

/** "1,5", "-16", "57,60" (with minDigits = 2); r must have a finite expansion. */
function decText(r: Rational, minDigits = 0): string {
	const k = Math.max(decimals(r) ?? 0, r.isInteger() ? 0 : minDigits);
	const scaled = r.mul(q(10 ** k));
	if (!scaled.isInteger()) throw new Error(`decText: ${r} is periodic`);
	const neg = scaled.num < 0;
	const s = String(Math.abs(scaled.num)).padStart(k + 1, '0');
	const body = k === 0 ? s : `${s.slice(0, s.length - k)},${s.slice(s.length - k)}`;
	return (neg ? '-' : '') + body;
}

const decTex = (r: Rational, minDigits = 0) => decText(r, minDigits).replace(',', '{,}');
/** Money: integers as they are, otherwise two decimals (57,60). */
const money = (r: Rational) => decText(r, 2);
const moneyTex = (r: Rational) => decTex(r, 2);
const pctText = (r: Rational) => `${decText(r)}%`;
const pctTex = (r: Rational) => `${decTex(r)}\\%`;
const t = (s: string) => `\\text{${s}}`;

/** Signed percentage change as the lesson words it. */
function changeTex(r: Rational): string {
	if (r.isZero()) return t('nessuna variazione');
	return `${t(r.sign() > 0 ? 'aumento del ' : 'diminuzione del ')}${pctTex(r.abs())}`;
}

// ---------------------------------------------------------------------------
// Proportion terms (levels 2-3)

type Form = 'int' | 'frac' | 'dec';
interface Term {
	v: Rational;
	form: Form;
}

function termTex(x: Term): string {
	const v = x.v;
	if (x.form === 'dec' && !v.isInteger()) return v.sign() < 0 ? `(${decTex(v)})` : decTex(v);
	if (x.form === 'frac' && !v.isInteger()) return v.sign() < 0 ? `\\left(${v.toLatex()}\\right)` : v.toLatex();
	return v.sign() < 0 ? `(${v.num})` : `${v.num}`;
}

/** Plain value in a step: integers and fractions as they are, decimals with the comma. */
function valTex(v: Rational, form: Form): string {
	if (form === 'dec' && decimals(v) !== null) return decTex(v);
	return v.toLatex();
}
const paren = (s: string) => (s.startsWith('-') ? `(${s})` : s);

const PARTNER = [3, 2, 1, 0];

function proportionTex(terms: (Term | null)[]): string {
	const s = terms.map((x) => (x ? termTex(x) : 'x'));
	return `${s[0]} : ${s[1]} = ${s[2]} : ${s[3]}`;
}

/** Correct value of the unknown at `pos` from the other three: product of the other pair over the partner. */
function solveAt(v: Rational[], pos: number): Rational {
	const partner = PARTNER[pos];
	const [j, k] = pos === 0 || pos === 3 ? [1, 2] : [0, 3];
	return v[j].mul(v[k]).div(v[partner]);
}

function proportionSteps(terms: Term[], pos: number, form: Form): string[] {
	const partner = PARTNER[pos];
	const [j, k] = pos === 0 || pos === 3 ? [1, 2] : [0, 3];
	const extreme = pos === 0 || pos === 3;
	const vt = (i: number) => paren(valTex(terms[i].v, form));
	const prod = terms[j].v.mul(terms[k].v);
	const x = terms[pos].v;
	const steps = [
		`x${t(` è un ${extreme ? 'estremo' : 'medio'}: va con `)}${vt(partner)}${t(`; ${extreme ? 'i medi' : 'gli estremi'} sono `)}${vt(j)}${t(' e ')}${vt(k)}`,
		`${vt(partner)} \\cdot x = ${vt(j)} \\cdot ${vt(k)} \\qquad ${vt(partner)}\\,x = ${valTex(prod, form)}`,
	];
	const p = terms[partner].v;
	if (p.isInteger() && prod.isInteger()) steps.push(`x = \\frac{${prod.num}}{${p.num}} = ${valTex(x, form)}`);
	else if (form === 'dec' && decimals(prod) !== null && decimals(p) !== null) {
		// both terms times the same power of 10, as in the lesson: 1,8 / 1,2 = 18 / 12
		const scale = q(10 ** Math.max(decimals(prod)!, decimals(p)!));
		const n = prod.mul(scale), d = p.mul(scale);
		steps.push(`x = \\frac{${valTex(prod, form)}}{${valTex(p, form)}} = \\frac{${n.num}}{${d.num}} = ${valTex(x, form)}`);
	} else steps.push(`x = ${paren(valTex(prod, form))} : ${paren(valTex(p, form))} = ${paren(prod.toLatex())} \\cdot ${paren(q(1).div(p).toLatex())} = ${valTex(x, form)}`);
	const r1 = terms[0].v.div(terms[1].v), r2 = terms[2].v.div(terms[3].v);
	steps.push(`${t('Controllo: ')}${vt(0)} : ${vt(1)} = ${r1.toLatex()} ${t(' e ')} ${vt(2)} : ${vt(3)} = ${r2.toLatex()}`);
	return steps;
}

// ---------------------------------------------------------------------------
// Construction

/**
 * Draws with `fn` until it succeeds. The case of a level is picked once, outside, so that a case
 * rejected more often than the others keeps its share.
 */
function retry<T>(fn: () => T | null, tries = 2000): T | null {
	for (let i = 0; i < tries; i++) {
		const out = fn();
		if (out) return out;
	}
	return null;
}

interface Built {
	case: string;
	prompt: string;
	problem: string;
	steps: string[];
	solution: string;
	value: Rational;
	/** How the options are written: fraction, decimal, money, percentage, signed change. */
	show: Show;
	wrong: Rational[];
	params: Record<string, unknown>;
}

type Show = 'frac' | 'dec' | 'money' | 'pct' | 'change';

function showTex(r: Rational, show: Show): string | null {
	if (show === 'frac') return r.toLatex();
	if (decimals(r) === null) return null;
	const dp = decimals(r)!;
	if (show === 'dec') return dp <= 3 ? decTex(r) : null;
	if (show === 'money') return dp <= 2 && r.sign() > 0 ? moneyTex(r) : null;
	if (show === 'pct') return dp <= 2 && r.sign() > 0 ? pctTex(r) : null;
	return dp <= 2 ? changeTex(r) : null;
}

// Level 1 ------------------------------------------------------------------

function buildRatio(rng: Rng): Built | null {
	const bigger = rng.next() < 0.3;
	return retry(() => buildRatioCase(rng, bigger));
}

function buildRatioCase(rng: Rng, bigger: boolean): Built | null {
	const qd = rng.int(2, 12);
	const pn = bigger ? rng.int(qd + 1, 2 * qd + 3) : rng.int(1, qd - 1);
	if (gcd(pn, qd) !== 1) return null;
	const g = rng.int(2, 15);
	const a = pn * g, b = qd * g;
	if (a > 150 || b > 150) return null;
	const value = q(pn, qd);
	return {
		case: bigger ? 'maggiore di 1' : 'minore di 1',
		prompt: `Calcola il rapporto tra ${a} e ${b}, ridotto ai minimi termini.`,
		problem: `${a} : ${b}`,
		steps: [
			`${t("Il primo numero nominato, l'antecedente, va al numeratore: ")}${a} : ${b} = \\frac{${a}}{${b}}`,
			`${t('MCD')}(${a}, ${b}) = ${gcd(a, b)} \\qquad \\frac{${a}}{${b}} = \\frac{${a} : ${g}}{${b} : ${g}} = ${value.toLatex()}`,
		],
		solution: `${a} : ${b} = ${value.toLatex()}`,
		value,
		show: 'frac',
		// the terms swapped; the part over the total; numerator reduced, denominator not; the two added
		wrong: [q(qd, pn), q(pn, pn + qd), q(pn, b), q(a, qd), q(pn + 1, qd), q(pn, qd + 1)],
		params: { a: String(a), b: String(b) },
	};
}

// Levels 2-3 -----------------------------------------------------------------

function proportionBuilt(terms: Term[], pos: number, form: Form, c: string): Built {
	const v = terms.map((x) => x.v);
	const x = v[pos];
	const shown = terms.map((tm, i) => (i === pos ? null : tm));
	const partner = PARTNER[pos];
	const [j, k] = pos === 0 || pos === 3 ? [1, 2] : [0, 3];
	const wrong: Rational[] = [];
	const safeDiv = (a: Rational, b: Rational) => (b.isZero() ? null : a.div(b));
	// x paired with a term of the other pair (the lesson's "accoppiare i termini sbagliati")
	for (const [m, n] of [
		[j, k],
		[k, j],
	]) {
		const w = safeDiv(v[partner].mul(v[m]), v[n]);
		if (w) wrong.push(w);
	}
	// same difference instead of same ratio: a - b = c - d
	const d = pos === 0 ? v[1].add(v[2]).sub(v[3]) : pos === 1 ? v[0].sub(v[2]).add(v[3]) : pos === 2 ? v[0].sub(v[1]).add(v[3]) : v[1].sub(v[0]).add(v[2]);
	wrong.push(d, x.neg());
	if (!x.isZero()) wrong.push(q(1).div(x));
	const show: Show = form === 'dec' && decimals(x) !== null ? 'dec' : 'frac';
	return {
		case: c,
		prompt: 'Calcola il termine incognito x della proporzione.',
		problem: proportionTex(shown),
		steps: proportionSteps(terms, pos, form),
		solution: `x = ${valTex(x, form)}`,
		value: x,
		show,
		wrong,
		params: { terms: terms.map((tm, i) => (i === pos ? 'x' : tm.v.toString())), forms: terms.map((tm) => tm.form), pos },
	};
}

function buildIntegerProportion(rng: Rng): Built | null {
	const p = rng.int(1, 9), r = rng.int(1, 9);
	if (p === r || gcd(p, r) !== 1) return null;
	const k = rng.int(1, 12), m = rng.int(1, 12);
	if (k === m) return null;
	const vals = [p * k, r * k, p * m, r * m];
	const pos = rng.int(0, 3);
	if (vals.some((n) => n > 100) || vals[pos] === 1) return null;
	const terms = vals.map((n) => ({ v: q(n), form: 'int' as Form }));
	return proportionBuilt(terms, pos, 'int', pos === 0 || pos === 3 ? 'estremo' : 'medio');
}

function niceFrac(r: Rational, maxDen = 12, maxNum = 40): boolean {
	return r.den <= maxDen && Math.abs(r.num) <= maxNum;
}

function buildFractionProportion(rng: Rng): Built | null {
	const frac = (): Rational | null => {
		const d = rng.int(2, 9), n = rng.int(1, 12);
		return gcd(n, d) === 1 ? q(n, d) : null;
	};
	const pos = rng.int(0, 3);
	const given: Rational[] = [];
	for (let i = 0; i < 3; i++) {
		const f = rng.next() < 0.8 ? frac() : q(rng.int(2, 12));
		if (!f) return null;
		given.push(f);
	}
	if (given.filter((g) => !g.isInteger()).length < 2) return null;
	const v: Rational[] = [];
	let gi = 0;
	for (let i = 0; i < 4; i++) v.push(i === pos ? q(0) : given[gi++]);
	v[pos] = solveAt(v, pos);
	if (!niceFrac(v[pos]) || v[pos].isOne()) return null;
	if (new Set(v.map(String)).size < 3) return null;
	const terms = v.map((x) => ({ v: x, form: 'frac' as Form }));
	return proportionBuilt(terms, pos, 'frac', 'frazioni');
}

function buildDecimalProportion(rng: Rng): Built | null {
	const p = rng.int(1, 9), r = rng.int(1, 9);
	if (p === r || gcd(p, r) !== 1) return null;
	const k = rng.int(1, 60), m = rng.int(1, 60);
	if (k === m) return null;
	const v = [q(p * k, 10), q(r * k, 10), q(p * m, 10), q(r * m, 10)];
	if (v.some((x) => x.compare(q(50)) > 0)) return null;
	const pos = rng.int(0, 3);
	if (v.filter((x, i) => i !== pos && !x.isInteger()).length < 2) return null;
	const terms = v.map((x) => ({ v: x, form: 'dec' as Form }));
	return proportionBuilt(terms, pos, 'dec', 'decimali');
}

function buildNegativeProportion(rng: Rng): Built | null {
	const p = rng.int(1, 9), r = rng.int(1, 9);
	if (p === r || gcd(p, r) !== 1) return null;
	const k = rng.int(1, 12), m = rng.int(1, 12);
	if (k === m) return null;
	const vals = [p * k, r * k, p * m, r * m];
	if (vals.some((n) => n > 60)) return null;
	// Signs with s0 * s1 = s2 * s3, so the two ratios stay equal.
	const s = [rng.pick([1, -1]), rng.pick([1, -1]), rng.pick([1, -1]), 1];
	s[3] = s[0] * s[1] * s[2];
	const pos = rng.int(0, 3);
	if (!s.some((x, i) => x < 0 && i !== pos)) return null;
	const terms = vals.map((n, i) => ({ v: q(s[i] * n), form: 'int' as Form }));
	return proportionBuilt(terms, pos, 'int', 'negativi');
}

function buildLevel3(rng: Rng): Built | null {
	const c = weighted(rng, [
		['frazioni', 1],
		['decimali', 1],
		['negativi', 1],
	] as [string, number][]);
	return retry(() => (c === 'frazioni' ? buildFractionProportion(rng) : c === 'decimali' ? buildDecimalProportion(rng) : buildNegativeProportion(rng)));
}

// Level 4 ------------------------------------------------------------------

const PCT = [5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80, 90];

function buildPercent(rng: Rng): Built | null {
	const c = weighted(rng, [
		['parte', 1],
		['percentuale', 1],
		['totale', 1],
	] as [string, number][]);
	return retry(() => buildPercentCase(rng, c));
}

function buildPercentCase(rng: Rng, c: string): Built | null {
	if (c === 'parte') {
		const p = q(rng.pick([...PCT, 120, 150]));
		const T = q(rng.int(2, 60) * rng.pick([1, 2, 5, 10]));
		const P = p.div(HUNDRED).mul(T);
		if ((decimals(P) ?? 9) > 1 || T.compare(q(500)) > 0) return null;
		return {
			case: c,
			prompt: `Quanto è il ${pctText(p)} di ${decText(T)}?`,
			problem: '',
			steps: [`P = \\frac{${decTex(p)}}{100} \\cdot ${decTex(T)} = ${decTex(p.div(HUNDRED))} \\cdot ${decTex(T)} = ${decTex(P)}`],
			solution: `${t('il ')}${pctTex(p)}${t(' di ')}${decTex(T)}${t(' è ')}${decTex(P)}`,
			value: P,
			show: 'dec',
			// no division by 100; the comma moved one place only; the percentage of 100 instead of T; T over the percentage
			wrong: [p.mul(T), p.mul(T).div(q(10)), p.div(q(1000)).mul(T), T.sub(P), T.div(p).mul(HUNDRED)],
			params: { p: p.toString(), T: T.toString(), P: P.toString() },
		};
	}
	if (c === 'percentuale') {
		const T = q(rng.pick([8, 10, 12, 16, 20, 24, 25, 30, 32, 40, 48, 50, 60, 75, 80, 120, 125, 200, 250]));
		const P = q(rng.int(1, T.num - 1));
		const p = P.div(T).mul(HUNDRED);
		if ((decimals(p) ?? 9) > 1) return null;
		return {
			case: c,
			prompt: `Che percentuale di ${decText(T)} è ${decText(P)}?`,
			problem: '',
			steps: [`p = \\frac{${P.num}}{${T.num}} \\cdot 100 = ${gcd(P.num, T.num) > 1 ? `${P.div(T).toLatex()} \\cdot 100 = ` : ''}${decTex(p)}`, `${decTex(P)}${t(' è il ')}${pctTex(p)}${t(' di ')}${decTex(T)}`],
			solution: pctTex(p),
			value: p,
			show: 'pct',
			// the ratio upside down; the ratio not multiplied by 100 (read as a percentage); times 10
			wrong: [T.div(P).mul(HUNDRED), P.div(T), P.div(T).mul(q(10)), T.sub(P).div(T).mul(HUNDRED), P],
			params: { T: T.toString(), P: P.toString(), p: p.toString() },
		};
	}
	const p = q(rng.pick(PCT));
	const T = q(rng.int(2, 50) * rng.pick([1, 2, 4, 5, 10]));
	const P = p.div(HUNDRED).mul(T);
	if (!P.isInteger() || T.compare(q(500)) > 0 || P.num < 2) return null;
	return {
		case: c,
		prompt: `Il ${pctText(p)} di un numero è ${decText(P)}. Qual è il numero?`,
		problem: '',
		steps: [`${decTex(P)} : T = ${decTex(p)} : 100`, `${decTex(p)} \\cdot T = ${decTex(P)} \\cdot 100 \\qquad T = \\frac{${P.mul(HUNDRED).num}}{${p.num}} = ${decTex(T)}`],
		solution: `T = ${decTex(T)}`,
		value: T,
		show: 'dec',
		// the percentage taken of P (the lesson's warning); the part added back; the proportion upside down
		wrong: [p.div(HUNDRED).mul(P), P.add(p.div(HUNDRED).mul(P)), P.mul(p).div(HUNDRED).mul(q(10)), p.mul(HUNDRED).div(P), P.mul(q(10)).div(p)],
		params: { p: p.toString(), P: P.toString(), T: T.toString() },
	};
}

// Level 5 ------------------------------------------------------------------

const CHANGE = [5, 10, 12, 15, 20, 25, 30, 40, 50];
type Dir = 'aumento' | 'sconto';
const coef = (dir: Dir, p: Rational) => (dir === 'aumento' ? q(1).add(p.div(HUNDRED)) : q(1).sub(p.div(HUNDRED)));
const coefTex = (c: Rational) => decTex(c);

function buildSingleChange(rng: Rng): Built | null {
	const c = weighted(rng, [
		['avanti', 1],
		['indietro', 1],
		['variazione', 1],
	] as [string, number][]);
	return retry(() => buildSingleChangeCase(rng, c));
}

function buildSingleChangeCase(rng: Rng, c: string): Built | null {
	const dir: Dir = rng.pick(['aumento', 'sconto'] as const);
	const p = q(rng.pick(CHANGE));
	const k = coef(dir, p);
	if (c === 'avanti') {
		const T = q(rng.int(2, 50) * rng.pick([2, 5, 10]));
		const F = T.mul(k);
		if ((decimals(F) ?? 9) > 2) return null;
		const prompt =
			dir === 'aumento'
				? `Un prezzo di ${money(T)} € aumenta del ${pctText(p)}. Quanto diventa, in euro?`
				: `Un articolo da ${money(T)} € è scontato del ${pctText(p)}. Quanto costa dopo lo sconto, in euro?`;
		const part = T.mul(p).div(HUNDRED);
		return {
			case: c,
			prompt,
			problem: '',
			steps: [
				`${t(`Il coefficiente di ${dir === 'aumento' ? "un aumento" : 'uno sconto'} del `)}${pctTex(p)}${t(' è ')}1 ${dir === 'aumento' ? '+' : '-'} ${decTex(p.div(HUNDRED))} = ${coefTex(k)}`,
				`${moneyTex(T)} \\cdot ${coefTex(k)} = ${moneyTex(F)}`,
				`${t('Controllo: il ')}${pctTex(p)}${t(' di ')}${moneyTex(T)}${t(' è ')}${moneyTex(part)}${t(', e ')}${moneyTex(T)} ${dir === 'aumento' ? '+' : '-'} ${moneyTex(part)} = ${moneyTex(F)}`,
			],
			solution: `${moneyTex(F)}${t(' euro')}`,
			value: F,
			show: 'money',
			// only the change; the change in the wrong direction; the percentage subtracted as a number
			wrong: [part, T.mul(coef(dir === 'aumento' ? 'sconto' : 'aumento', p)), dir === 'aumento' ? T.add(p) : T.sub(p), T.mul(p.div(HUNDRED)).mul(q(10))],
			params: { case: c, dir, p: p.toString(), T: T.toString(), F: F.toString() },
		};
	}
	if (c === 'indietro') {
		const T = q(rng.int(2, 50) * rng.pick([2, 5, 10]));
		const F = T.mul(k);
		if ((decimals(F) ?? 9) > 2) return null;
		const prompt =
			dir === 'aumento'
				? `Dopo un aumento del ${pctText(p)} un prezzo è ${money(F)} €. Quanto era prima, in euro?`
				: `Dopo uno sconto del ${pctText(p)} un articolo costa ${money(F)} €. Quanto costava prima, in euro?`;
		return {
			case: c,
			prompt,
			problem: '',
			steps: [
				`${t('Il prezzo nuovo è quello iniziale moltiplicato per ')}${coefTex(k)}${t(': ')}T \\cdot ${coefTex(k)} = ${moneyTex(F)}`,
				`T = \\frac{${moneyTex(F)}}{${coefTex(k)}} = ${moneyTex(T)}`,
				`${t('Controllo: ')}${moneyTex(T)} \\cdot ${coefTex(k)} = ${moneyTex(F)}`,
			],
			solution: `${moneyTex(T)}${t(' euro')}`,
			value: T,
			show: 'money',
			// the percentage of the new price added or removed (the lesson's warning); p as a number
			wrong: [F.mul(coef(dir === 'aumento' ? 'sconto' : 'aumento', p)), F.mul(k), dir === 'aumento' ? F.sub(p) : F.add(p), F.div(coef(dir === 'aumento' ? 'sconto' : 'aumento', p))],
			params: { case: c, dir, p: p.toString(), T: T.toString(), F: F.toString() },
		};
	}
	const V = q(rng.int(2, 40) * rng.pick([1, 2, 5, 10]));
	const pc = q(rng.int(1, 40));
	const W = dir === 'aumento' ? V.mul(q(1).add(pc.div(HUNDRED))) : V.mul(q(1).sub(pc.div(HUNDRED)));
	if (!W.isInteger() || V.compare(q(400)) > 0) return null;
	const change = W.sub(V).div(V).mul(HUNDRED);
	return {
		case: c,
		prompt: `Un prezzo passa da ${money(V)} € a ${money(W)} €. Di quale percentuale è cambiato?`,
		problem: '',
		steps: [
			`\\frac{${decTex(W)} - ${decTex(V)}}{${decTex(V)}} \\cdot 100 = \\frac{${W.sub(V).num}}{${V.num}} \\cdot 100 = ${decTex(change)}`,
			change.sign() > 0 ? `${t('Il segno è positivo: è un aumento del ')}${pctTex(change)}` : `${t('Il segno meno indica una diminuzione del ')}${pctTex(change.abs())}`,
		],
		solution: changeTex(change),
		value: change,
		show: 'change',
		// the sign reversed; divided by the final value; the difference read as a percentage
		wrong: [change.neg(), W.sub(V).div(W).mul(HUNDRED), W.sub(V), V.sub(W).div(W).mul(HUNDRED)],
		params: { case: c, V: V.toString(), W: W.toString() },
	};
}

// Level 6 ------------------------------------------------------------------

const verb = (dir: Dir) => (dir === 'aumento' ? 'aumenta' : 'scende');
const signed = (dir: Dir, p: Rational) => (dir === 'aumento' ? p : p.neg());

function buildSuccessive(rng: Rng): Built | null {
	const c = weighted(rng, [
		['finale', 2],
		['totale', 2],
		['annullare', 1],
	] as [string, number][]);
	return retry(() => buildSuccessiveCase(rng, c));
}

function buildSuccessiveCase(rng: Rng, c: string): Built | null {
	if (c === 'annullare') {
		const dir: Dir = rng.pick(['aumento', 'sconto'] as const);
		const p = q(dir === 'aumento' ? rng.pick([25, 60, 100, 150, 300]) : rng.pick([20, 50, 60, 75, 80]));
		const k = coef(dir, p);
		const back = q(1).div(k);
		const change = back.sub(q(1)).mul(HUNDRED);
		if ((decimals(change) ?? 9) > 1) return null;
		return {
			case: c,
			prompt: `Un prezzo ${verb(dir)} del ${pctText(p)}. Di quale percentuale deve cambiare per tornare al valore iniziale?`,
			problem: '',
			steps: [
				`${t('La variazione moltiplica per ')}${coefTex(k)} = ${k.toLatex()}${t('; per tornare indietro si moltiplica per il reciproco, ')}${back.toLatex()} = ${decTex(back)}`,
				`${coefTex(back)} = 1 ${change.sign() > 0 ? '+' : '-'} ${decTex(change.abs().div(HUNDRED))}${t(': ')}${changeTex(change)}`,
			],
			solution: changeTex(change),
			value: change,
			show: 'change',
			// the same percentage reversed; the same change again; half of it
			wrong: [signed(dir, p).neg(), signed(dir, p), signed(dir, p).neg().div(q(2)), change.neg()],
			params: { case: c, changes: [{ dir, p: p.toString() }] },
		};
	}
	const d1: Dir = rng.pick(['aumento', 'sconto'] as const);
	const d2: Dir = rng.pick(['aumento', 'sconto'] as const);
	const p1 = q(rng.pick(CHANGE)), p2 = q(rng.pick(CHANGE));
	const k1 = coef(d1, p1), k2 = coef(d2, p2);
	const k = k1.mul(k2);
	const sum = signed(d1, p1).add(signed(d2, p2));
	const changes = [
		{ dir: d1, p: p1.toString() },
		{ dir: d2, p: p2.toString() },
	];
	const text = `${verb(d1)} del ${pctText(p1)} e poi ${verb(d2)} del ${pctText(p2)}`;
	const coefStep = `${t('I coefficienti si moltiplicano: ')}${coefTex(k1)} \\cdot ${coefTex(k2)} = ${decTex(k)}`;
	if (c === 'finale') {
		const T = q(rng.int(2, 40) * rng.pick([5, 10]));
		const F = T.mul(k);
		if ((decimals(F) ?? 9) > 2) return null;
		return {
			case: c,
			prompt: `Un prezzo di ${money(T)} € ${text}. Quanto diventa, in euro?`,
			problem: '',
			steps: [coefStep, `${moneyTex(T)} \\cdot ${decTex(k)} = ${moneyTex(F)}`, `${t('Controllo in due passi: ')}${moneyTex(T)} \\cdot ${coefTex(k1)} = ${moneyTex(T.mul(k1))} ${t(', poi ')} ${moneyTex(T.mul(k1))} \\cdot ${coefTex(k2)} = ${moneyTex(F)}`],
			solution: `${moneyTex(F)}${t(' euro')}`,
			value: F,
			show: 'money',
			// the percentages added (the lesson's warning); only the first change; only the second
			wrong: [T.mul(q(1).add(sum.div(HUNDRED))), T.mul(k1), T.mul(k2), T.mul(q(1).sub(sum.div(HUNDRED)))],
			params: { case: c, changes, T: T.toString() },
		};
	}
	const change = k.sub(q(1)).mul(HUNDRED);
	if ((decimals(change) ?? 9) > 1 || change.isZero()) return null;
	return {
		case: c,
		prompt: `Un prezzo ${text}. Di quale percentuale è cambiato in tutto?`,
		problem: '',
		steps: [coefStep, `${decTex(k)} = 1 ${change.sign() > 0 ? '+' : '-'} ${decTex(change.abs().div(HUNDRED))}${t(': ')}${changeTex(change)}`],
		solution: changeTex(change),
		value: change,
		show: 'change',
		// the percentages added (the lesson's warning); the sign reversed; the product of the two percentages
		wrong: [sum, change.neg(), sum.neg(), signed(d1, p1).mul(signed(d2, p2)).div(HUNDRED)],
		params: { case: c, changes },
	};
}

// Level 7 ------------------------------------------------------------------
//
// Word problems from the lesson's "Problemi con le proporzioni": two directly proportional
// quantities (recipes, prices, fuel, a bike ride, a printer), map scales, a total divided in a
// given ratio. The text goes in `problem` as a textBlock, the short instruction in `prompt`.
// The prose is rebuilt from params by `storyProse`, so check() can compare it with the problem.

type Story = 'ricetta' | 'spesa' | 'benzina' | 'bici' | 'stampante' | 'cartina' | 'sentiero' | 'regalo' | 'classe' | 'bibita';
const DIRECT: Story[] = ['ricetta', 'spesa', 'benzina', 'bici', 'stampante'];
const SCALE: Story[] = ['cartina', 'sentiero'];
const PARTS: Story[] = ['regalo', 'classe', 'bibita'];
const caseOfStory = (s: Story) => (DIRECT.includes(s) ? 'diretta' : SCALE.includes(s) ? 'scala' : 'parti');

const NAMES: [string, 'f' | 'm'][] = [
	['Giulia', 'f'],
	['Marco', 'm'],
	['Sofia', 'f'],
	['Luca', 'm'],
	['Chiara', 'f'],
	['Matteo', 'm'],
	['Aurora', 'f'],
	['Pietro', 'm'],
	['Martina', 'f'],
	['Davide', 'm'],
];
const SURNAMES = ['Rossi', 'Bianchi', 'Esposito', 'Ferrari', 'Romano', 'Colombo', 'Ricci', 'Greco'];
/** Ingredient, unit, amounts per person. */
const INGREDIENTS: [string, 'g' | 'ml', number[]][] = [
	['farina', 'g', [50, 60, 75, 80, 100, 125]],
	['zucchero', 'g', [20, 25, 30, 40, 50]],
	['latte', 'ml', [50, 60, 75, 100, 125]],
];
/** Produce and price per kg in cents. */
const PRODUCE: [string, number[]][] = [
	['mele', [150, 180, 190, 220, 240, 250]],
	['arance', [120, 150, 160, 180, 200]],
	['pomodori', [180, 220, 250, 280, 320]],
	['patate', [90, 110, 120, 130, 150]],
];
const SCALES = [10000, 20000, 25000, 50000, 100000];
const CM_PER_KM = 100000;

/** 25\,000 as the lesson writes it: a thin space for numbers from 10 000 up. */
const bigTex = (n: number) => (Math.abs(n) >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : String(n));
const unitOf = (story: Story, p: Record<string, unknown>): string =>
	({ ricetta: String(p.unit), spesa: 'euro', benzina: 'km', bici: 'minuti', stampante: 'pagine', cartina: 'km', sentiero: 'cm', regalo: 'euro', classe: String(p.ask) === '1' ? 'ragazzi' : 'ragazze', bibita: 'ml' })[story];

/** The problem text, from params alone. */
function storyProse(p: Record<string, unknown>): string {
	const s = p.story as Story;
	const n = (k: string) => decText(R(p[k] as string));
	const who = p.who as string;
	switch (s) {
		case 'ricetta':
			return `Per un dolce per ${n('q1')} persone la ricetta della nonna di ${who} chiede ${n('v1')} ${p.unit} di ${p.item}. Quanti ${p.unit === 'g' ? 'grammi' : 'millilitri'} di ${p.item} servono per ${n('q2')} persone?`;
		case 'spesa':
			return `Al mercato ${who} paga ${money(R(p.v1 as string))} euro per ${n('q1')} kg di ${p.item}. Quanto spende, in euro, per ${n('q2')} kg di ${p.item}?`;
		case 'benzina':
			return `Con ${n('q1')} litri di benzina l'auto della famiglia ${who} percorre ${n('v1')} km. Quanti km percorre, alla stessa andatura, con ${n('q2')} litri?`;
		case 'bici':
			return `In bicicletta, a velocità costante, ${who} percorre ${n('q1')} km in ${n('v1')} minuti. Quanti minuti ${p.gender === 'f' ? 'le' : 'gli'} servono per percorrere ${n('q2')} km alla stessa velocità?`;
		case 'stampante':
			return `La stampante della segreteria della scuola stampa ${n('v1')} pagine in ${n('q1')} minuti. Quante pagine stampa, allo stesso ritmo, in ${n('q2')} minuti?`;
		case 'cartina':
			return `Su una cartina dei sentieri in scala $1 : ${bigTex(Number(p.S))}$ due rifugi distano ${n('d')} cm. Quanti km distano nella realtà?`;
		case 'sentiero':
			return `Un sentiero di montagna è lungo ${n('D')} km. Quanti cm misura su una cartina in scala $1 : ${bigTex(Number(p.S))}$?`;
		case 'regalo': {
			const [a, b] = [p.who as string, p.who2 as string];
			return `I nonni regalano ${n('T')} euro a ${a} e ${b}, da dividere in modo che le quote di ${a} e di ${b} stiano nel rapporto $${p.p} : ${p.q}$. Quanti euro riceve ${p.ask === '1' ? a : b}?`;
		}
		case 'classe':
			return `In una classe di ${n('T')} studenti il rapporto tra ragazzi e ragazze è $${p.p} : ${p.q}$. Quant${p.ask === '1' ? 'i sono i ragazzi' : 'e sono le ragazze'}?`;
		case 'bibita':
			return `Una bibita si prepara mescolando sciroppo e acqua nel rapporto $${p.p} : ${p.q}$. Quanti ml di ${p.ask === '1' ? 'sciroppo' : 'acqua'} servono per ${n('T')} ml di bibita?`;
	}
}

function buildWordProblem(rng: Rng): Built | null {
	const c = weighted(rng, [
		['diretta', 2],
		['scala', 1],
		['parti', 1],
	] as [string, number][]);
	const story = rng.pick(c === 'diretta' ? DIRECT : c === 'scala' ? SCALE : PARTS);
	return retry(() => {
		const b = buildStory(rng, story);
		if (!b) return null;
		// counts (people, pages, minutes) and grams stay whole also in the wrong options
		const whole = b.show === 'dec' && b.value.isInteger() && c !== 'scala';
		const wrong = b.wrong.filter((w) => w.sign() > 0 && (!whole || w.isInteger()));
		return { ...b, problem: textBlock(storyProse(b.params)), wrong };
	});
}

function buildStory(rng: Rng, story: Story): Built | null {
	const c = caseOfStory(story);
	const [who, gender] = rng.pick(NAMES);
	if (c === 'diretta') {
		// q1 : q2 = v1 : x, built from a whole rate per unit of q
		let q1: Rational, q2: Rational, rate: Rational;
		const extra: Record<string, string> = {};
		if (story === 'ricetta') {
			const [item, unit, per] = rng.pick(INGREDIENTS);
			q1 = q(rng.pick([2, 4, 6, 8]));
			q2 = q(rng.int(2, 12));
			rate = q(rng.pick(per));
			Object.assign(extra, { item, unit, who });
		} else if (story === 'spesa') {
			const [item, prices] = rng.pick(PRODUCE);
			q1 = q(rng.int(2, 5));
			q2 = q(rng.int(2, 8));
			rate = q(rng.pick(prices), 100);
			Object.assign(extra, { item, who });
		} else if (story === 'benzina') {
			q1 = q(rng.pick([4, 5, 6, 8, 10]));
			q2 = q(rng.pick([10, 15, 20, 25, 30, 35, 40]));
			rate = q(rng.pick([12, 14, 15, 16, 18, 20]));
			Object.assign(extra, { who: rng.pick(SURNAMES) });
		} else if (story === 'bici') {
			q1 = q(rng.int(5, 15));
			q2 = q(rng.int(10, 40));
			rate = q(rng.pick([2, 3, 4]));
			Object.assign(extra, { who, gender });
		} else {
			q1 = q(rng.int(2, 5));
			q2 = q(rng.int(4, 12));
			rate = q(rng.pick([12, 15, 18, 20, 24, 30]));
		}
		if (q1.equals(q2)) return null;
		const v1 = q1.mul(rate), x = q2.mul(rate);
		const isMoney = story === 'spesa';
		const f = (r: Rational) => (isMoney ? moneyTex(r) : decTex(r));
		const unit = unitOf(story, extra);
		const prod = q2.mul(v1);
		const what: Record<string, string> = {
			ricetta: 'tra le persone è uguale al rapporto tra le quantità',
			spesa: 'tra i pesi è uguale al rapporto tra i prezzi',
			benzina: 'tra i litri è uguale al rapporto tra i chilometri',
			bici: 'tra i chilometri è uguale al rapporto tra i minuti',
			stampante: 'tra i minuti è uguale al rapporto tra le pagine',
		};
		return {
			case: c,
			prompt: 'Risolvi il problema.',
			problem: '',
			steps: [
				`${t(`Il rapporto ${what[story]}: `)}${decTex(q1)} : ${decTex(q2)} = ${f(v1)} : x`,
				`${decTex(q1)} \\cdot x = ${decTex(q2)} \\cdot ${f(v1)} = ${f(prod)} \\qquad x = \\frac{${f(prod)}}{${decTex(q1)}} = ${f(x)}`,
				`${t('Controllo: ')}${f(v1)} : ${decTex(q1)} = ${f(v1.div(q1))}${t(' e ')}${f(x)} : ${decTex(q2)} = ${f(x.div(q2))}`,
			],
			solution: `${f(x)}${t(` ${unit}`)}`,
			value: x,
			show: isMoney ? 'money' : 'dec',
			// the inverse proportion (the lesson's warning); the same difference; the value for one unit
			// (a different question); no division; the given value added to the answer
			wrong: [q1.mul(v1).div(q2), v1.add(q2).sub(q1), v1.div(q1), prod, x.add(v1)],
			params: { story, q1: q1.toString(), q2: q2.toString(), v1: v1.toString(), ...extra },
		};
	}
	if (c === 'scala') {
		const S = rng.pick(SCALES);
		if (story === 'cartina') {
			const d = q(rng.int(2, 20));
			const cm = d.mul(q(S));
			const km = cm.div(q(CM_PER_KM));
			if ((decimals(km) ?? 9) > 2 || km.compare(q(20)) > 0) return null;
			return {
				case: c,
				prompt: 'Risolvi il problema.',
				problem: '',
				steps: [
					`${t('1 cm sulla carta vale ')}${bigTex(S)}${t(' cm nella realtà: ')}1 : ${bigTex(S)} = ${decTex(d)} : x`,
					`x = ${decTex(d)} \\cdot ${bigTex(S)} = ${bigTex(cm.num)}${t(' cm')}`,
					`${t('1 km = ')}${bigTex(CM_PER_KM)}${t(' cm, quindi ')}${bigTex(cm.num)}${t(' cm = ')}${decTex(km)}${t(' km')}`,
				],
				solution: `${decTex(km)}${t(' km')}`,
				value: km,
				show: 'dec',
				// cm to km with the wrong factor (1000 or 10 000 or a million); the scale divided by the distance
				wrong: [cm.div(q(1000)), cm.div(q(10000)), cm.div(q(1000000)), q(S).div(d).div(q(CM_PER_KM))],
				params: { story, S: String(S), d: d.toString() },
			};
		}
		if (S === 100000) return null;
		const D = q(rng.int(1, 20), 2);
		const cm = D.mul(q(CM_PER_KM));
		const map = cm.div(q(S));
		if ((decimals(map) ?? 9) > 1 || map.compare(q(2)) < 0 || map.compare(q(40)) > 0) return null;
		return {
			case: c,
			prompt: 'Risolvi il problema.',
			problem: '',
			steps: [
				`${decTex(D)}${t(' km = ')}${bigTex(cm.num)}${t(' cm')}`,
				`1 : ${bigTex(S)} = x : ${bigTex(cm.num)} \\qquad ${bigTex(S)} \\cdot x = ${bigTex(cm.num)}`,
				`x = ${bigTex(cm.num)} : ${bigTex(S)} = ${decTex(map)}${t(' cm')}`,
			],
			solution: `${decTex(map)}${t(' cm')}`,
			value: map,
			show: 'dec',
			// km to cm with the wrong factor; the scale multiplied by the distance
			wrong: [D.mul(q(1000)).div(q(S)), D.mul(q(10000)).div(q(S)), D.mul(q(1000000)).div(q(S)), D.div(q(S)).mul(q(1000))],
			params: { story, S: String(S), D: D.toString() },
		};
	}
	// parti: T split in the ratio p : q, one of the two shares asked
	let p: number, qq: number, T: number;
	const extra: Record<string, string> = {};
	if (story === 'regalo') {
		p = rng.int(1, 7);
		qq = rng.int(1, 7);
		T = (p + qq) * rng.int(3, 40);
		if (T % 5 !== 0 || T < 40 || T > 400) return null;
		const other = rng.pick(NAMES)[0];
		if (other === who) return null;
		Object.assign(extra, { who, who2: other });
	} else if (story === 'classe') {
		p = rng.int(1, 7);
		qq = rng.int(1, 7);
		T = rng.int(18, 30);
		if (T % (p + qq) !== 0) return null;
	} else {
		p = rng.int(1, 2);
		qq = rng.int(3, 9);
		T = rng.pick([250, 300, 500, 600, 750, 1000, 1500]);
		if (T % (p + qq) !== 0) return null;
	}
	if (p === qq || gcd(p, qq) !== 1 || T / (p + qq) < 2) return null;
	const ask = rng.pick(['1', '2'] as const);
	const k = ask === '1' ? p : qq, other = ask === '1' ? qq : p;
	const part = T / (p + qq);
	const x = q(k * part);
	const params = { story, T: String(T), p: String(p), q: String(qq), ask, ...extra };
	const unit = unitOf(story, params);
	const isMoney = story === 'regalo';
	return {
		case: 'parti',
		prompt: 'Risolvi il problema.',
		problem: '',
		steps: [
			`${t('Le parti uguali sono ')}${p} + ${qq} = ${p + qq}${t(', e ognuna vale ')}${T} : ${p + qq} = ${part}`,
			`${t(`La quota chiesta prende ${k === 1 ? '1 parte' : `${k} parti`}: `)}${k} \\cdot ${part} = ${x.num}`,
			`${t("Controllo: l'altra quota è ")}${other} \\cdot ${part} = ${other * part}${t(', e ')}${x.num} + ${other * part} = ${T}`,
		],
		solution: `${x.num}${t(` ${unit}`)}`,
		value: x,
		show: isMoney ? 'money' : 'dec',
		// the other share (a different question); a single part; the total treated as the other share
		// (x : T = k : other); half of the total
		wrong: [q(other * part), q(part), q(T * k, other), q(T, 2)],
		params,
	};
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return buildRatio(rng);
		case 2:
			return buildIntegerProportion(rng);
		case 3:
			return buildLevel3(rng);
		case 4:
			return buildPercent(rng);
		case 5:
			return buildSingleChange(rng);
		case 6:
			return buildSuccessive(rng);
		case 7:
			return buildWordProblem(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

function recompute(sample: Sample): Rational | null {
	const p = sample.params;
	const lvl = sample.level;
	if (lvl === 1) return R(p.a as string).div(R(p.b as string));
	if (lvl === 2 || lvl === 3) {
		const terms = p.terms as string[];
		const pos = terms.indexOf('x');
		const v = terms.map((s) => (s === 'x' ? q(0) : R(s)));
		return solveAt(v, pos);
	}
	if (lvl === 4) {
		if (p.case === 'parte') return R(p.p as string).div(HUNDRED).mul(R(p.T as string));
		if (p.case === 'percentuale') return R(p.P as string).div(R(p.T as string)).mul(HUNDRED);
		return R(p.P as string).mul(HUNDRED).div(R(p.p as string));
	}
	if (lvl === 5) {
		if (p.case === 'variazione') return R(p.W as string).sub(R(p.V as string)).div(R(p.V as string)).mul(HUNDRED);
		const k = coef(p.dir as Dir, R(p.p as string));
		return p.case === 'avanti' ? R(p.T as string).mul(k) : R(p.F as string).div(k);
	}
	if (lvl === 6) {
		const ch = p.changes as { dir: Dir; p: string }[];
		const k = ch.reduce((acc, c) => acc.mul(coef(c.dir, R(c.p))), q(1));
		if (p.case === 'annullare') return q(1).div(k).sub(q(1)).mul(HUNDRED);
		if (p.case === 'finale') return R(p.T as string).mul(k);
		return k.sub(q(1)).mul(HUNDRED);
	}
	if (lvl === 7) {
		const n = (k: string) => R(p[k] as string);
		if (p.case === 'diretta') return n('v1').mul(n('q2')).div(n('q1'));
		if (p.story === 'cartina') return n('d').mul(n('S')).div(q(CM_PER_KM));
		if (p.story === 'sentiero') return n('D').mul(q(CM_PER_KM)).div(n('S'));
		return n('T').mul(n(p.ask === '1' ? 'p' : 'q')).div(n('p').add(n('q')));
	}
	return null;
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const ans = sample.answer;
	if (ans.kind !== 'number') return ['la risposta deve essere un numero'];
	let truth: Rational | null;
	try {
		truth = recompute(sample);
	} catch (e) {
		return [`params non validi: ${(e as Error).message}`];
	}
	if (!truth || !R(ans.value).equals(truth)) v.push('risposta diversa dal valore ricalcolato');
	if (!sample.steps.length) v.push('mancano i passaggi');
	const p = sample.params;
	const val = R(ans.value);
	switch (sample.level) {
		case 1: {
			const a = Number(p.a), b = Number(p.b);
			if (gcd(a, b) < 2) v.push('il rapporto deve essere da ridurre');
			if (val.isInteger() || a > 150 || b > 150) v.push('rapporto intero o numeri oltre 150');
			if (sample.problem !== `${a} : ${b}`) v.push('testo diverso da params');
			break;
		}
		case 2:
		case 3: {
			const terms = p.terms as string[];
			const forms = p.forms as Form[];
			const pos = terms.indexOf('x');
			if (terms.filter((s) => s === 'x').length !== 1) v.push('serve una sola incognita');
			const vals = terms.map((s, i) => (i === pos ? val : R(s)));
			if (vals.some((x) => x.isZero())) v.push('termine nullo');
			if (!vals[0].mul(vals[3]).equals(vals[1].mul(vals[2]))) v.push('prodotto dei medi diverso da quello degli estremi');
			const shown = vals.map((x, i) => (i === pos ? null : { v: x, form: forms[i] }));
			if (sample.problem !== proportionTex(shown)) v.push('testo diverso da params');
			const given = vals.filter((_, i) => i !== pos);
			if (sample.level === 2) {
				if (vals.some((x) => !x.isInteger() || x.sign() < 0 || x.num > 100)) v.push('livello 2: interi positivi fino a 100');
				if (vals[0].equals(vals[1])) v.push('rapporto uguale a 1');
				if (val.isOne()) v.push('x = 1');
			} else if (p.case === 'frazioni') {
				if (given.filter((x) => !x.isInteger()).length < 2) v.push('servono almeno due termini frazionari');
				if (!niceFrac(val) || vals.some((x) => x.sign() < 0)) v.push('risultato troppo grande o negativo');
			} else if (p.case === 'decimali') {
				if (given.filter((x) => !x.isInteger()).length < 2) v.push('servono almeno due decimali');
				if (vals.some((x) => decimals(x) === null || decimals(x)! > 1 || x.sign() < 0)) v.push('decimali con una cifra, positivi');
			} else if (p.case === 'negativi') {
				if (!given.some((x) => x.sign() < 0)) v.push('serve un termine negativo');
				if (vals.some((x) => !x.isInteger() || Math.abs(x.num) > 60)) v.push('interi fino a 60');
			} else v.push(`caso sconosciuto ${String(p.case)}`);
			break;
		}
		case 4:
			if ((decimals(val) ?? 9) > 1 || val.sign() <= 0) v.push('risultato con al massimo un decimale');
			if (p.case === 'percentuale' && val.compare(HUNDRED) >= 0) v.push('la parte deve essere minore del totale');
			if (p.case === 'totale' && !val.isInteger()) v.push('il totale deve essere intero');
			break;
		case 5:
			if (p.case === 'variazione') {
				if (!val.isInteger() || val.isZero() || val.abs().compare(q(40)) > 0) v.push('variazione intera, non nulla, fino a 40');
			} else if ((decimals(val) ?? 9) > 2 || (decimals(R(p.F as string)) ?? 9) > 2) v.push('prezzo con più di due decimali');
			break;
		case 6: {
			const ch = p.changes as unknown[];
			if (p.case === 'annullare' ? ch.length !== 1 : ch.length !== 2) v.push('numero di variazioni sbagliato');
			if (p.case === 'finale' ? (decimals(val) ?? 9) > 2 : (decimals(val) ?? 9) > 1) v.push('troppi decimali');
			if (p.case !== 'finale' && val.isZero()) v.push('variazione nulla');
			break;
		}
		case 7: {
			const story = p.story as Story;
			if (![...DIRECT, ...SCALE, ...PARTS].includes(story) || caseOfStory(story) !== p.case) {
				v.push('storia sconosciuta o caso sbagliato');
				break;
			}
			let prose = '';
			try {
				prose = storyProse(p);
			} catch (e) {
				v.push(`testo non ricostruibile: ${(e as Error).message}`);
			}
			if (sample.problem !== textBlock(prose)) v.push('testo diverso da params');
			if (val.sign() <= 0) v.push('risultato non positivo');
			const money = story === 'spesa' || story === 'regalo';
			if (money ? (decimals(val) ?? 9) > 2 : story === 'cartina' ? (decimals(val) ?? 9) > 2 : story === 'sentiero' ? (decimals(val) ?? 9) > 1 : !val.isInteger())
				v.push(money ? 'prezzo non al centesimo' : 'risultato non intero o con troppi decimali');
			const given = ['q1', 'q2', 'v1', 'S', 'd', 'D', 'T', 'p', 'q'].filter((k) => typeof p[k] === 'string').map((k) => R(p[k] as string));
			if (p.case === 'scala') given.push(q(1)); // the 1 of the scale 1 : S
			if (given.some((g) => g.equals(val))) v.push('la risposta è già nel testo');
			if (p.case === 'parti') {
				const a = Number(p.p), b = Number(p.q), T = Number(p.T);
				if (a === b || gcd(a, b) !== 1 || T % (a + b) !== 0) v.push('rapporto non ridotto o totale non divisibile');
			}
			if (story === 'sentiero' && (val.compare(q(2)) < 0 || val.compare(q(40)) > 0)) v.push('sulla carta tra 2 e 40 cm');
			if (story === 'cartina' && val.compare(q(20)) > 0) v.push('distanza oltre 20 km');
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

function optionOf(r: Rational, show: Show): ChoiceOption | null {
	const latex = showTex(r, show);
	return latex === null ? null : { latex, values: [r.toString()] };
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const value = R((sample.answer as { value: string }).value);
	const show = sample.params.show as Show;
	const wrong = ((sample.params.wrong as string[]) ?? []).map(R);
	const right = optionOf(value, show);
	if (!right) throw new Error(`${ID}: answer not displayable`);
	// A sign flip is a real mistake only when the proportion has negative terms or the answer is a change.
	const signOk = (w: Rational) => show === 'change' || sample.params.case === 'negativi' || w.sign() === value.sign();
	const cands = wrong.filter((w) => !w.equals(value) && signOk(w) && Math.abs(w.num) <= 100_000 && w.den <= 100).map((w) => optionOf(w, show));
	const step = show === 'frac' ? q(1, value.den) : value.isInteger() && value.abs().compare(q(20)) > 0 ? q(Math.max(1, Math.round(value.abs().num / 10))) : q(1);
	const fallback = (i: number) => {
		const k = Math.floor(i / 2) + 1;
		const w = value.add(step.mul(q(i % 2 ? -k : k)));
		if (show !== 'change' && show !== 'frac' && w.sign() <= 0) return null;
		if (show === 'frac' && w.sign() !== value.sign()) return null;
		return optionOf(w, show);
	};
	return buildChoice(rng, right, cands, fallback);
}

export const numeriRazionaliProporzioni: Generator = {
	id: ID,
	title: 'Rapporti, proporzioni e percentuali',
	levels: {
		1: { label: 'Rapporto tra due numeri', constraints: ['a : b con a, b interi fino a 150 e MCD almeno 2', 'risultato non intero; circa 3 su 10 maggiori di 1'] },
		2: { label: 'Termine incognito con interi', constraints: ['a : b = c : d con interi positivi fino a 100 e risultato intero', 'x in una posizione qualsiasi, metà estremi e metà medi'] },
		3: { label: 'Termine incognito con frazioni, decimali o negativi', constraints: ['un terzo con frazioni, un terzo con decimali a una cifra, un terzo con interi negativi'] },
		4: { label: 'Percentuali', constraints: ['un terzo la parte, un terzo la percentuale, un terzo il totale', 'risultato con al massimo un decimale'] },
		5: { label: 'Aumento o sconto', constraints: ['un terzo il prezzo nuovo, un terzo il prezzo di prima, un terzo la variazione percentuale', 'prezzi al centesimo'] },
		6: { label: 'Variazioni successive', constraints: ['2 su 5 il prezzo finale, 2 su 5 la variazione totale, 1 su 5 la variazione che annulla un aumento o uno sconto'] },
		7: { label: 'Problemi con le proporzioni', constraints: ['metà grandezze direttamente proporzionali, un quarto scale, un quarto parti proporzionali', 'dieci storie; persone, pagine, minuti e grammi interi, prezzi al centesimo'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const value = b.value;
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer: { kind: 'number', value: value.toString() },
				params: {
					case: b.case,
					...b.params,
					show: b.show,
					wrong: b.wrong.filter((w) => !w.equals(value)).map((w) => w.toString()),
				},
			};
			if (check(sample).length > 0) continue;
			try {
				toChoice(sample, rng);
			} catch {
				continue;
			}
			return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default numeriRazionaliProporzioni;
