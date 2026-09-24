/**
 * Potenze in Q. Spec: specs/exercises/numeri-razionali-potenze.md
 *
 * Six levels in the order of the lesson: power of a fraction, negative base and the minus outside
 * the parentheses, exponent 0 and 1, negative exponent, properties with the same base, expressions
 * (reciprocal or opposite bases, sums of powers). The expression is a small tree in params.expr,
 * evaluated exactly; the LaTeX, the steps and the answer all come from the tree.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { buildChoice, nonZero, parenInt, ratOption, weighted } from '../razionali';

export const ID = 'numeri-razionali-potenze';

export type Node =
	| { t: 'pow'; b: string; e: number }
	| { t: 'pp'; b: string; e1: number; e2: number }
	| { t: 'neg'; x: Node }
	| { t: 'mul' | 'div'; a: Node; b: Node }
	| { t: 'sum'; terms: { s: 1 | -1; x: Node }[] };

const MAX = 5000;

// ---------------------------------------------------------------------------
// Arithmetic

export function power(r: Rational, e: number): Rational {
	if (e === 0) {
		if (r.isZero()) throw new Error('0^0');
		return q(1);
	}
	const base = e < 0 ? q(1).div(r) : r;
	let out = q(1);
	for (let i = 0; i < Math.abs(e); i++) out = out.mul(base);
	return out;
}

export function evaluate(n: Node): Rational {
	switch (n.t) {
		case 'pow':
			return power(Rational.parse(n.b), n.e);
		case 'pp':
			return power(power(Rational.parse(n.b), n.e1), n.e2);
		case 'neg':
			return evaluate(n.x).neg();
		case 'mul':
			return evaluate(n.a).mul(evaluate(n.b));
		case 'div':
			return evaluate(n.a).div(evaluate(n.b));
		case 'sum':
			return n.terms.reduce((acc, t) => acc.add(t.s === 1 ? evaluate(t.x) : evaluate(t.x).neg()), q(0));
	}
}

const small = (r: Rational, max = MAX) => Math.abs(r.num) <= max && r.den <= max;

// ---------------------------------------------------------------------------
// LaTeX

/** The base as it is written under an exponent: 2, (-2), \left(\frac{2}{3}\right). */
function baseLatex(r: Rational): string {
	if (r.isInteger()) return r.sign() < 0 ? `(${r.num})` : `${r.num}`;
	return `\\left(${r.toLatex()}\\right)`;
}

export const powLatex = (r: Rational, e: number): string => `${baseLatex(r)}^{${e}}`;

export function latex(n: Node): string {
	switch (n.t) {
		case 'pow':
			return powLatex(Rational.parse(n.b), n.e);
		case 'pp': {
			const r = Rational.parse(n.b);
			const inner = powLatex(r, n.e1);
			return r.isInteger() && r.sign() > 0 ? `\\left(${inner}\\right)^{${n.e2}}` : `\\left[${inner}\\right]^{${n.e2}}`;
		}
		case 'neg':
			return `-${latex(n.x)}`;
		case 'mul':
			return `${latex(n.a)} \\cdot ${latex(n.b)}`;
		case 'div':
			return `${latex(n.a)} : ${latex(n.b)}`;
		case 'sum':
			return n.terms.map((t, i) => (i === 0 ? (t.s < 0 ? '-' : '') : t.s < 0 ? ' - ' : ' + ') + latex(t.x)).join('');
	}
}

const expName = (e: number) => ({ 2: 'al quadrato', 3: 'al cubo', 4: 'alla quarta' })[e] ?? `alla ${e}`;

/** a^e / b^e = value, for a positive exponent; the sign in front when the base is negative. */
function expandPositive(r: Rational, e: number): string {
	const v = power(r, e);
	const a = Math.abs(r.num), b = r.den;
	const sign = v.sign() < 0 ? '-' : '';
	if (r.isInteger()) return `${v.toLatex()}`;
	return `${sign}\\frac{${a}^{${e}}}{${b}^{${e}}} = ${v.toLatex()}`;
}

/** Steps that evaluate r^e for any integer e, starting from powLatex(r, e). */
function evalSteps(r: Rational, e: number): string[] {
	const v = power(r, e);
	const head = powLatex(r, e);
	if (e === 0) return [`${head} = 1`];
	if (e === 1) return [`${head} = ${r.toLatex()}`];
	if (e > 1) return [`${head} = ${expandPositive(r, e)}`];
	const rec = q(1).div(r);
	if (e === -1) return [`\\text{L'esponente } -1 \\text{ dà il reciproco: } ${head} = ${v.toLatex()}`];
	return [`\\text{Scrivi il reciproco della base e cambia segno all'esponente: } ${head} = ${powLatex(rec, -e)} = ${expandPositive(rec, -e)}`];
}

const parity = (e: number) => (Math.abs(e) % 2 === 0 ? 'pari' : 'dispari');

// ---------------------------------------------------------------------------
// Construction

interface Built {
	expr: Node;
	case: string;
	steps: string[];
	/** Values of the distractors, most typical mistakes first. */
	wrong: Rational[];
}

/** Positive fraction a/b in lowest terms, a != b, b >= 2, both at most max. */
function fraction(rng: Rng, max: number): Rational | null {
	const a = rng.int(1, max), b = rng.int(2, max);
	if (a === b || gcd(a, b) !== 1) return null;
	return q(a, b);
}

const boundFor = (e: number) => (Math.abs(e) <= 1 ? 12 : Math.abs(e) === 2 ? 9 : Math.abs(e) === 3 ? 5 : 3);

function buildL1(rng: Rng): Built | null {
	const e = weighted(rng, [
		[2, 5],
		[3, 4],
		[4, 1],
	]);
	const r = fraction(rng, boundFor(e));
	if (!r) return null;
	const a = r.num, b = r.den;
	return {
		expr: { t: 'pow', b: r.toString(), e },
		case: `esponente ${e}`,
		steps: [`\\text{Eleva ${expName(e)} numeratore e denominatore: } ${powLatex(r, e)} = ${expandPositive(r, e)}`],
		wrong: [q(a ** e, b), q(a, b ** e), r, q(b ** e, a ** e), power(r, e + 1)],
	};
}

function buildL2(rng: Rng): Built | null {
	const e = weighted(rng, [
		[2, 4],
		[3, 4],
		[4, 1],
		[5, 1],
	]);
	const r = fraction(rng, e === 5 ? 2 : boundFor(e));
	if (!r) return null;
	const outside = rng.next() < 0.4;
	const neg = r.neg();
	const expr: Node = outside ? { t: 'neg', x: { t: 'pow', b: r.toString(), e } } : { t: 'pow', b: neg.toString(), e };
	const v = evaluate(expr);
	const steps = outside
		? [`\\text{La base è } ${r.toLatex()}\\text{: prima calcola la potenza, poi metti il segno meno davanti}`, `${latex(expr)} = -\\frac{${r.num}^{${e}}}{${r.den}^{${e}}} = ${v.toLatex()}`]
		: [
				`\\text{La base è } ${neg.toLatex()}\\text{ e l'esponente } ${e} \\text{ è ${parity(e)}: il risultato è ${e % 2 === 0 ? 'positivo' : 'negativo'}}`,
				`${latex(expr)} = ${expandPositive(neg, e)}`,
			];
	const sg = v.sign();
	const a = r.num, b = r.den;
	return {
		expr,
		case: outside ? 'fuori' : 'parentesi',
		steps,
		wrong: [v.neg(), q(sg * a ** e, b), q(-sg * a ** e, b), q(sg * a, b ** e), q(sg * b ** e, a ** e)],
	};
}

function buildL3(rng: Rng): Built | null {
	const e = rng.next() < 0.6 ? 0 : 1;
	const r = fraction(rng, 12);
	if (!r) return null;
	const form = weighted(rng, [
		['positiva', 3],
		['negativa', 4],
		['fuori', 3],
	] as ['positiva' | 'negativa' | 'fuori', number][]);
	const base = form === 'negativa' ? r.neg() : r;
	const expr: Node = form === 'fuori' ? { t: 'neg', x: { t: 'pow', b: r.toString(), e } } : { t: 'pow', b: base.toString(), e };
	const v = evaluate(expr);
	const steps: string[] = [];
	if (form === 'fuori') steps.push(`\\text{La base è } ${r.toLatex()}\\text{: il segno meno resta fuori dalla potenza}`);
	else steps.push(`\\text{La base è } ${base.toLatex()}${form === 'negativa' ? '\\text{, segno compreso}' : ''}`);
	if (e === 0) steps.push(`\\text{Una potenza con esponente } 0 \\text{ e base diversa da zero vale } 1\\text{: } ${latex(expr)} = ${v.toLatex()}`);
	else steps.push(`\\text{Una potenza con esponente } 1 \\text{ è uguale alla base: } ${latex(expr)} = ${v.toLatex()}`);
	const signed = form === 'fuori' ? r.neg() : base;
	const wrong = e === 0 ? [v.neg(), q(0), signed] : [q(1), v.neg(), q(1).div(signed), q(0)];
	return { expr, case: `esponente ${e}`, steps, wrong };
}

function buildL4(rng: Rng): Built | null {
	const e = -weighted(rng, [
		[1, 3],
		[2, 4],
		[3, 3],
	]);
	const kind = weighted(rng, [
		['intero', 3],
		['frazione', 4],
		['frazione negativa', 3],
	] as ['intero' | 'frazione' | 'frazione negativa', number][]);
	let base: Rational;
	if (kind === 'intero') {
		const n = rng.int(2, e === -3 ? 5 : 9);
		base = q(rng.next() < 0.3 ? -n : n);
	} else {
		const r = fraction(rng, boundFor(e));
		if (!r) return null;
		base = kind === 'frazione' ? r : r.neg();
	}
	const expr: Node = { t: 'pow', b: base.toString(), e };
	const v = evaluate(expr);
	const n = -e;
	const steps: string[] = [];
	if (base.isInteger()) {
		if (n === 1) steps.push(`\\text{L'esponente } -1 \\text{ dà il reciproco: } ${latex(expr)} = ${v.toLatex()}`);
		else steps.push(`\\text{Una potenza con esponente negativo è il reciproco della potenza con l'esponente opposto: } ${latex(expr)} = \\frac{1}{${powLatex(base, n)}} = ${v.toLatex()}`);
	} else {
		steps.push(...evalSteps(base, e));
	}
	if (base.sign() < 0) steps.push(`\\text{La base è negativa e l'esponente } ${n} \\text{ è ${parity(n)}: il risultato è ${n % 2 === 0 ? 'positivo' : 'negativo'}}`);
	const wrong = [v.neg(), power(base, n), power(base, n).neg()];
	if (base.isInteger()) wrong.splice(1, 0, q(base.num * e));
	return { expr, case: kind, steps, wrong };
}

/** "2 - 5" for m + n, "3 - (-2)" for m - n. */
const sumLatex = (m: number, n: number) => `${m} ${n < 0 ? '-' : '+'} ${Math.abs(n)}`;
const diffLatex = (m: number, n: number) => `${m} - ${parenInt(n)}`;

function propertyBase(rng: Rng): Rational | null {
	if (rng.next() < 0.3) return q(rng.pick([2, 3, 5]));
	return fraction(rng, 5);
}

function buildL5(rng: Rng): Built | null {
	// The form is drawn once, so that rejections do not change the shares.
	const form = weighted(rng, [
		['prodotto', 3],
		['quoziente', 3],
		['potenza di potenza', 2],
		['due operazioni', 2],
	] as [string, number][]);
	for (let i = 0; i < 2000; i++) {
		const b = enoughWrong(buildL5Form(rng, form));
		if (b) return b;
	}
	return null;
}

function buildL5Form(rng: Rng, form: string): Built | null {
	const X = propertyBase(rng);
	if (!X) return null;
	const P = (e: number): Node => ({ t: 'pow', b: X.toString(), e });
	const ex = () => nonZero(rng, -5, 5, [1]); // no exponent 1 written in the problem
	let expr: Node, s: number;
	const steps: string[] = [];
	const wrongExps: number[] = [];
	const Xl = (e: number | string) => `${baseLatex(X)}^{${e}}`;
	if (form === 'prodotto') {
		const m = ex(), n = ex();
		s = m + n;
		expr = { t: 'mul', a: P(m), b: P(n) };
		steps.push(`\\text{Stessa base: somma gli esponenti. } ${latex(expr)} = ${Xl(sumLatex(m, n))} = ${Xl(s)}`);
		wrongExps.push(m * n, m - n, -s);
		if (m < 0 && n < 0) wrongExps.push(Math.abs(m) + Math.abs(n));
	} else if (form === 'quoziente') {
		const m = ex(), n = ex();
		s = m - n;
		expr = { t: 'div', a: P(m), b: P(n) };
		steps.push(`\\text{Stessa base: sottrai gli esponenti. } ${latex(expr)} = ${Xl(diffLatex(m, n))} = ${Xl(s)}`);
		wrongExps.push(m + n, n - m, m * n);
	} else if (form === 'potenza di potenza') {
		const m = nonZero(rng, -3, 3, [1]), n = nonZero(rng, -3, 3, [1]);
		if (m > 0 && n > 0) return null;
		s = m * n;
		expr = { t: 'pp', b: X.toString(), e1: m, e2: n };
		steps.push(`\\text{Potenza di potenza: moltiplica gli esponenti. } ${latex(expr)} = ${Xl(`${m} \\cdot ${parenInt(n)}`)} = ${Xl(s)}`);
		wrongExps.push(m + n, -s);
	} else {
		const m = ex(), n = ex(), p = ex();
		s = m + n - p;
		expr = { t: 'div', a: { t: 'mul', a: P(m), b: P(n) }, b: P(p) };
		steps.push(`\\text{Prima il prodotto, sommando gli esponenti: } ${latex({ t: 'mul', a: P(m), b: P(n) })} = ${Xl(sumLatex(m, n))} = ${Xl(m + n)}`);
		steps.push(`\\text{Poi il quoziente, sottraendo gli esponenti: } ${Xl(m + n)} : ${Xl(p)} = ${Xl(diffLatex(m + n, p))} = ${Xl(s)}`);
		wrongExps.push(m + n + p, m * n - p, -s);
	}
	if (Math.abs(s) > 4 || (Math.abs(s) > 3 && X.den * Math.abs(X.num) > 2)) return null;
	if (!JSON.stringify(expr).includes('-')) return null; // at least one negative exponent
	steps.push(...evalSteps(X, s));
	const wrong = wrongExps.filter((w) => Math.abs(w) <= 4).map((w) => power(X, w));
	wrong.push(power(X, s).neg());
	return { expr, case: form, steps, wrong };
}

function buildReciprocal(rng: Rng): Built | null {
	const X = fraction(rng, 5);
	if (!X) return null;
	const rel = weighted(rng, [
		['reciproca', 4],
		['opposta', 3],
		['opposta del reciproco', 3],
	] as ['reciproca' | 'opposta' | 'opposta del reciproco', number][]);
	const Y = rel === 'reciproca' ? q(1).div(X) : rel === 'opposta' ? X.neg() : q(-1).div(X);
	const m = nonZero(rng, -4, 4, [1]);
	let n = nonZero(rng, -4, 4, [1]);
	if (rel !== 'reciproca' && n % 2 !== 0) n = n > 0 ? n + 1 : n - 1;
	if (Math.abs(n) > 4) return null;
	const k = rel === 'opposta' ? n : -n; // Y^n = X^k
	const op = rng.int(0, 1) ? 'mul' : 'div';
	const yFirst = rng.next() < 0.4;
	const PX: Node = { t: 'pow', b: X.toString(), e: m }, PY: Node = { t: 'pow', b: Y.toString(), e: n };
	const expr: Node = { t: op, a: yFirst ? PY : PX, b: yFirst ? PX : PY };
	// exponent of X after the conversion
	const [e1, e2] = yFirst ? [k, m] : [m, k];
	const s = op === 'mul' ? e1 + e2 : e1 - e2;
	if (Math.abs(s) > 3 || s === 0) return null;
	const Xl = (e: number | string) => `${baseLatex(X)}^{${e}}`;
	const why =
		rel === 'reciproca'
			? `\\text{la base } ${Y.toLatex()} \\text{ è il reciproco di } ${X.toLatex()}\\text{, quindi cambia segno all'esponente}`
			: rel === 'opposta'
				? `\\text{l'esponente } ${n} \\text{ è pari, quindi il segno della base sparisce}`
				: `\\text{l'esponente } ${n} \\text{ è pari, quindi il segno sparisce, e la base } ${Y.neg().toLatex()} \\text{ è il reciproco di } ${X.toLatex()}`;
	const steps = [`\\text{Porta tutto alla base } ${X.toLatex()}\\text{: } ${why}\\text{. } ${latex(PY)} = ${Xl(k)}`];
	const opText = op === 'mul' ? 'somma gli esponenti' : 'sottrai gli esponenti';
	const expLatex = op === 'mul' ? sumLatex(e1, e2) : diffLatex(e1, e2);
	steps.push(`\\text{Stessa base: ${opText}. } ${Xl(e1)} ${op === 'mul' ? '\\cdot' : ':'} ${Xl(e2)} = ${Xl(expLatex)} = ${Xl(s)}`);
	steps.push(...evalSteps(X, s));
	// Mistakes: Y^n taken as X^n (no sign change of the exponent), the result with the opposite sign.
	const kWrong = rel === 'opposta' ? -n : n;
	const [w1, w2] = yFirst ? [kWrong, m] : [m, kWrong];
	const sWrong = op === 'mul' ? w1 + w2 : w1 - w2;
	const wrong = [power(X, s).neg(), Math.abs(sWrong) <= 4 ? power(X, sWrong) : null, power(X, -s), op === 'mul' && Math.abs(e1 * e2) <= 4 ? power(X, e1 * e2) : null].filter(
		(w): w is Rational => w !== null,
	);
	return { expr, case: 'basi reciproche', steps, wrong };
}

interface Term {
	s: 1 | -1;
	b: Rational;
	e: number;
}

function buildSum(rng: Rng): Built | null {
	const terms: Term[] = [];
	for (let i = 0; i < 3; i++) {
		const e = rng.pick([-2, -1, 0, 2, 3]);
		const r = rng.next() < 0.3 ? q(rng.int(2, 3)) : fraction(rng, e === 3 || e === -2 ? 3 : 4);
		if (!r) return null;
		const negBase = rng.next() < 0.45;
		const sign = rng.next() < 0.45 ? -1 : 1;
		if (sign < 0 && !negBase && r.isInteger()) return null; // no -3^2: the minus outside only before a parenthesis
		terms.push({ s: sign, b: negBase ? r.neg() : r, e });
	}
	// Each of the lesson's traps at least once: exponent 0, negative exponent, a sign to think about.
	if (!terms.some((t) => t.e === 0) || !terms.some((t) => t.e < 0)) return null;
	if (!terms.some((t) => t.b.sign() < 0 && t.e !== 0) || !terms.some((t) => t.s < 0 && t.b.sign() > 0)) return null;
	if (terms.filter((t) => t.e === 0).length > 1) return null;
	const tv = terms.map((t) => (t.s === 1 ? power(t.b, t.e) : power(t.b, t.e).neg()));
	if (tv.some((v) => !small(v, 27))) return null;
	const total = tv.reduce((a, b) => a.add(b), q(0));
	if (total.isZero() || total.den > 72 || Math.abs(total.num) > 200) return null;
	const expr: Node = { t: 'sum', terms: terms.map((t) => ({ s: t.s, x: { t: 'pow', b: t.b.toString(), e: t.e } })) };
	const steps: string[] = [`\\text{Calcola le potenze una per una.}`];
	terms.forEach((t, i) => {
		const x: Node = { t: 'pow', b: t.b.toString(), e: t.e };
		const head = (t.s < 0 ? '-' : '') + latex(x);
		let why = '';
		if (t.e === 0) why = t.s < 0 ? '\\text{ (esponente 0, il meno resta fuori)}' : '\\text{ (esponente 0)}';
		else if (t.b.sign() < 0) why = `\\text{ (base negativa, esponente ${parity(t.e)})}`;
		else if (t.s < 0) why = '\\text{ (il meno è fuori dalla parentesi)}';
		else if (t.e < 0) why = '\\text{ (esponente negativo: reciproco)}';
		steps.push(`${head} = ${tv[i].toLatex()}${why}`);
	});
	const seq = tv.map((v, i) => (i === 0 ? v.toLatex() : v.sign() < 0 ? ` - ${v.abs().toLatex()}` : ` + ${v.toLatex()}`)).join('');
	const m = tv.reduce((acc, v) => lcm(acc, v.den), 1);
	if (m > 1) {
		const nums = tv.map((v) => v.num * (m / v.den));
		const numSeq = nums.map((x, i) => (i === 0 ? `${x}` : x < 0 ? ` - ${-x}` : ` + ${x}`)).join('');
		steps.push(`${seq} = \\frac{${numSeq}}{${m}} = ${total.toLatex()}`);
	} else steps.push(`${seq} = ${total.toLatex()}`);
	// Mistakes, one term at a time.
	const wrong: Rational[] = [];
	terms.forEach((t, i) => {
		const alt = (v: Rational) => wrong.push(total.sub(tv[i]).add(v));
		if (t.e === 0) alt(q(0)); // x^0 taken as 0
		if (t.s < 0 && t.b.sign() > 0 && t.e % 2 === 0) alt(tv[i].neg()); // -(a/b)^2 taken as (-a/b)^2
		if (t.b.sign() < 0 && t.e % 2 === 0 && t.e !== 0) alt(tv[i].neg()); // (-a/b)^2 taken as negative
		if (t.e < 0) alt(tv[i].neg()); // negative exponent taken as a negative result
		if (t.e < 0) alt(t.s === 1 ? power(t.b, -t.e) : power(t.b, -t.e).neg()); // reciprocal forgotten
	});
	wrong.push(total.neg());
	return { expr, case: 'somma', steps, wrong };
}

/** The typical mistakes alone must give three distinct wrong options: no filler like value + 1. */
function enoughWrong(b: Built | null): Built | null {
	if (!b) return null;
	const v = evaluate(b.expr);
	const keys = new Set(b.wrong.filter((w) => small(w) && !w.equals(v)).map((w) => w.toString()));
	return keys.size >= 3 ? b : null;
}

function build(rng: Rng, level: number): Built | null {
	return enoughWrong(buildRaw(rng, level));
}

function buildRaw(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return buildL1(rng);
		case 2:
			return buildL2(rng);
		case 3:
			return buildL3(rng);
		case 4:
			return buildL4(rng);
		case 5:
			return buildL5(rng);
		case 6:
		{
			// The case is drawn once, so that rejections inside a case do not change the shares.
			const f = rng.next() < 0.6 ? buildReciprocal : buildSum;
			for (let i = 0; i < 2000; i++) {
				const b = enoughWrong(f(rng));
				if (b) return b;
			}
			return null;
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

function nodes(n: Node): Node[] {
	switch (n.t) {
		case 'neg':
			return [n, ...nodes(n.x)];
		case 'mul':
		case 'div':
			return [n, ...nodes(n.a), ...nodes(n.b)];
		case 'sum':
			return [n, ...n.terms.flatMap((t) => nodes(t.x))];
		default:
			return [n];
	}
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const expr = sample.params.expr as Node | undefined;
	if (!expr) return ['params.expr mancante'];
	let value: Rational;
	try {
		value = evaluate(expr);
	} catch (e) {
		return [`espressione non valida: ${(e as Error).message}`];
	}
	if (sample.problem !== latex(expr)) v.push('il testo non corrisponde a params.expr');
	if (sample.answer.kind !== 'number' || sample.answer.value !== value.toString()) v.push('risposta diversa dal valore');
	if (!small(value)) v.push('risultato troppo grande');
	if (/\+\s*-|-\s*-|\+\s*\+|\d\.\d/.test(sample.problem)) v.push('segni doppi o punto decimale');
	if (sample.level !== 3 && /\^\{1\}/.test(sample.problem)) v.push('esponente 1 scritto nel testo');
	const all = nodes(expr);
	const pows = all.filter((n): n is Extract<Node, { t: 'pow' }> => n.t === 'pow');
	const bases = pows.map((p) => Rational.parse(p.b));
	switch (sample.level) {
		case 1:
			if (expr.t !== 'pow' || bases[0].sign() < 0 || bases[0].isInteger() || expr.e < 2 || expr.e > 4) v.push('serve (a/b)^n con a/b positiva e n da 2 a 4');
			break;
		case 2: {
			const ok = (expr.t === 'pow' && bases[0].sign() < 0 && !bases[0].isInteger()) || (expr.t === 'neg' && expr.x.t === 'pow' && bases[0].sign() > 0);
			if (!ok || pows.length !== 1 || pows[0].e < 2) v.push('serve (-a/b)^n oppure -(a/b)^n con n almeno 2');
			break;
		}
		case 3:
			if (pows.length !== 1 || (pows[0].e !== 0 && pows[0].e !== 1)) v.push('serve esponente 0 o 1');
			break;
		case 4:
			if (expr.t !== 'pow' || expr.e >= 0 || expr.e < -3) v.push('serve un esponente da -1 a -3');
			break;
		case 5: {
			const bs = [...pows.map((p) => p.b), ...all.filter((n) => n.t === 'pp').map((n) => (n as Extract<Node, { t: 'pp' }>).b)];
			if (new Set(bs).size !== 1 || expr.t === 'sum' || expr.t === 'neg') v.push('serve una sola base');
			if (!JSON.stringify(expr).includes('-')) v.push('serve almeno un esponente negativo');
			break;
		}
		case 6:
			if (expr.t === 'sum') {
				if (expr.terms.length !== 3 || !pows.some((p) => p.e === 0) || !pows.some((p) => p.e < 0)) v.push('la somma deve avere tre potenze, una con esponente 0 e una negativa');
			} else if (expr.t === 'mul' || expr.t === 'div') {
				const [a, b] = bases;
				if (pows.length !== 2 || !(a.mul(b).isOne() || a.add(b).isZero() || a.mul(b).equals(q(-1)))) v.push('servono basi reciproche o opposte');
			} else v.push('forma non prevista al livello 6');
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const value = Rational.parse((sample.answer as { value: string }).value);
	const wrong = ((sample.params.wrong as string[]) ?? []).map((w) => Rational.parse(w));
	const cands: ChoiceOption[] = wrong.filter((w) => small(w)).map(ratOption);
	const fallback = (i: number) => {
		const k = Math.floor(i / 2) + 1;
		return ratOption(value.add(q(i % 2 ? -k : k)));
	};
	return buildChoice(rng, ratOption(value), cands, fallback);
}

export const numeriRazionaliPotenze: Generator = {
	id: ID,
	title: 'Potenze in Q',
	levels: {
		1: { label: 'Potenza di una frazione', constraints: ['(a/b)^n con a/b positiva, ridotta, non intera', 'n da 2 a 4, numeri piccoli'] },
		2: { label: 'Base negativa e segno meno', constraints: ['circa 6 su 10 (-a/b)^n, 4 su 10 -(a/b)^n', 'esponenti pari e dispari'] },
		3: { label: 'Esponente 0 e 1', constraints: ['circa 6 su 10 esponente 0', 'base positiva, negativa o segno meno fuori'] },
		4: { label: 'Esponente negativo', constraints: ['esponente da -1 a -3', 'basi intere, frazioni positive e negative'] },
		5: { label: 'Proprietà delle potenze', constraints: ['una sola base', 'prodotto, quoziente, potenza di potenza o due operazioni', 'almeno un esponente negativo'] },
		6: { label: 'Espressioni con le potenze', constraints: ['circa 6 su 10 basi reciproche o opposte', 'circa 4 su 10 somme di tre potenze con esponente 0 e negativo'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const value = evaluate(b.expr);
			if (!small(value)) continue;
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: 'Calcola.',
				problem: latex(b.expr),
				solution: `${latex(b.expr)} = ${value.toLatex()}`,
				steps: b.steps,
				answer: { kind: 'number', value: value.toString() },
				params: { expr: b.expr, case: b.case, wrong: b.wrong.filter((w) => !w.equals(value)).map((w) => w.toString()) },
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

export default numeriRazionaliPotenze;
