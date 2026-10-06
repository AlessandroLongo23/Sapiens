/**
 * Principio di induzione (lesson slug principio-induzione). Spec: specs/exercises/principio-induzione.md
 *
 * A whole proof cannot be marked automatically, so the six levels ask for its pieces, in the order of the
 * lesson: the first value from which an inequality holds (the base to choose); the two sides of a formula
 * for a given n (checking a case); the term added to the first side in the inductive step; the second side of
 * the thesis P(k + 1); the missing piece of an inductive step (divisibility, a recursive sequence); the
 * mistake in a short proof. The statements come from a few families of true formulas, built from their
 * parameters; expressions in k carry their LaTeX, their SymPy form and a function to tell them apart.
 */
import type { ChoiceAnswer, ChoiceOption, Rng, Sample } from '../types';
import { q } from '../rational';
import { joinSigned, poly, polyToLatex } from '../latex';
import { type Built, chapterGenerator, choiceOf, correctValues, lin, nonZero, numberAnswer, numberChoice, numberCheck, t } from '../successioni';

export const ID = 'principio-induzione';

const N = (x: unknown) => Number(x);

// ---------------------------------------------------------------------------
// Expressions in k

interface Expr {
	latex: string;
	sympy: string;
	f: (k: number) => number;
}

const signature = (e: Expr): string => [1, 2, 3, 4, 5, 6].map((k) => e.f(k)).join(',');

/** Four options that differ in value (not only in writing), the correct one first, then shuffled. */
function exprChoice(rng: Rng, correct: Expr, wrong: Expr[]): ChoiceAnswer {
	const seen = new Set([signature(correct)]);
	const distinct: ChoiceOption[] = [];
	for (const w of wrong) {
		if (seen.has(signature(w))) continue;
		seen.add(signature(w));
		distinct.push({ latex: w.latex, values: [w.sympy] });
	}
	return choiceOf(ID, rng, { latex: correct.latex, values: [correct.sympy] }, distinct);
}

/** A polynomial in k with integer coefficients, lowest degree first. */
const polyE = (c: number[]): Expr => ({
	latex: polyToLatex(poly(...c), 'k'),
	sympy: c.map((x, i) => `(${x})*k**${i}`).join(' + '),
	f: (k) => c.reduce((s, x, i) => s + x * k ** i, 0),
});

const plusE = (a: Expr, b: Expr): Expr => ({ latex: `${a.latex} + ${b.latex}`, sympy: `(${a.sympy}) + (${b.sympy})`, f: (k) => a.f(k) + b.f(k) });

/** k, (k + 1), (k + 2): the index n replaced by k + s inside a product. */
const K = (s: number): string => (s === 0 ? 'k' : `(k + ${s})`);
/** The exponent k + s, written k, {k+1}, {k-1}. */
const expo = (s: number): string => (s === 0 ? 'k' : `{k${s > 0 ? '+' : '-'}${Math.abs(s)}}`);

// ---------------------------------------------------------------------------
// Families of true formulas: first side = closed form

interface Family {
	params: Record<string, unknown>;
	/** The first side, with the general term last: "1 + 3 + \dots + (2n - 1)". */
	lhs: string;
	/** The second side, in n. */
	closed: string;
	term: (n: number) => number;
	sum: (n: number) => number;
	/** The term of place k + s and the closed form at k + s. */
	termE: (s: number) => Expr;
	closedE: (s: number) => Expr;
	/** The first `v` terms written out, for the check of a case. */
	terms: (v: number) => string[];
}

function arithmetic(rng: Rng): Family {
	const [a, d] = [rng.int(1, 5), rng.int(1, 5)];
	const c = a - d;
	const e = 2 * a - d;
	const term = (n: number) => d * n + c;
	const sum = (n: number) => (n * (d * n + e)) / 2;
	const last = c === 0 ? lin(d, 0) : `(${lin(d, c)})`;
	const even = d % 2 === 0 && e % 2 === 0;
	const square = even && e === 0;
	const coef = d / 2 === 1 ? '' : `${d / 2}`;
	/** The closed form in `v` at v + s: n^2, n(n + 1) or \frac{n(3n - 1)}{2}, as the parity of d allows. */
	const closedAt = (v: string, s: number): string => {
		const head = s === 0 ? v : K(s);
		if (square) return `${coef}${head}^2`;
		return even ? `${head}(${lin(d / 2, e / 2 + (d / 2) * s, v)})` : `\\frac{${head}(${lin(d, e + d * s, v)})}{2}`;
	};
	return {
		params: { family: 'aritmetica', a, d },
		lhs: `${a} + ${a + d} + \\dots + ${last}`,
		closed: closedAt('n', 0),
		term,
		sum,
		termE: (s) => ({ latex: lin(d, c + d * s, 'k'), sympy: `${d}*(k+${s}) + (${c})`, f: (k) => term(k + s) }),
		closedE: (s) => ({ latex: closedAt('k', s), sympy: `(k+${s})*(${d}*(k+${s}) + (${e}))/2`, f: (k) => sum(k + s) }),
		terms: (v) => Array.from({ length: v }, (_, i) => `${term(i + 1)}`),
	};
}

function geometric(rng: Rng): Family {
	const [r, m] = [rng.pick([2, 2, 3, 4, 5]), rng.int(1, 3)];
	const a = m * (r - 1);
	const head = a === 1 ? '' : `${a} \\cdot `;
	const term = (n: number) => a * r ** (n - 1);
	const sum = (n: number) => m * (r ** n - 1);
	const closedAt = (exp: string) => (m === 1 ? `${r}^${exp} - 1` : `${m}(${r}^${exp} - 1)`);
	return {
		params: { family: 'geometrica', r, m },
		lhs: `${a} + ${a * r} + ${a * r * r} + \\dots + ${head}${r}^{n-1}`,
		closed: closedAt('n'),
		term,
		sum,
		termE: (s) => ({ latex: `${head}${r}^${expo(s - 1)}`, sympy: `${a}*${r}**(k+${s}-1)`, f: (k) => term(k + s) }),
		closedE: (s) => ({ latex: closedAt(expo(s)), sympy: `${m}*(${r}**(k+${s}) - 1)`, f: (k) => sum(k + s) }),
		terms: (v) => Array.from({ length: v }, (_, i) => `${term(i + 1)}`),
	};
}

function squares(): Family {
	const sum = (n: number) => (n * (n + 1) * (2 * n + 1)) / 6;
	return {
		params: { family: 'quadrati' },
		lhs: '1^2 + 2^2 + \\dots + n^2',
		closed: '\\frac{n(n + 1)(2n + 1)}{6}',
		term: (n) => n * n,
		sum,
		termE: (s) => ({ latex: `${K(s)}^2`, sympy: `(k+${s})**2`, f: (k) => (k + s) ** 2 }),
		closedE: (s) => ({ latex: `\\frac{${K(s)}${K(s + 1)}(${lin(2, 2 * s + 1, 'k')})}{6}`, sympy: `(k+${s})*(k+${s}+1)*(2*(k+${s})+1)/6`, f: (k) => sum(k + s) }),
		terms: (v) => Array.from({ length: v }, (_, i) => `${i + 1}^2`),
	};
}

function cubes(): Family {
	const sum = (n: number) => (n * n * (n + 1) * (n + 1)) / 4;
	return {
		params: { family: 'cubi' },
		lhs: '1^3 + 2^3 + \\dots + n^3',
		closed: '\\frac{n^2(n + 1)^2}{4}',
		term: (n) => n ** 3,
		sum,
		termE: (s) => ({ latex: `${K(s)}^3`, sympy: `(k+${s})**3`, f: (k) => (k + s) ** 3 }),
		closedE: (s) => ({ latex: `\\frac{${K(s)}^2${K(s + 1)}^2}{4}`, sympy: `(k+${s})**2*(k+${s}+1)**2/4`, f: (k) => sum(k + s) }),
		terms: (v) => Array.from({ length: v }, (_, i) => `${i + 1}^3`),
	};
}

function products(): Family {
	const sum = (n: number) => (n * (n + 1) * (n + 2)) / 3;
	return {
		params: { family: 'prodotti' },
		lhs: '1 \\cdot 2 + 2 \\cdot 3 + \\dots + n(n + 1)',
		closed: '\\frac{n(n + 1)(n + 2)}{3}',
		term: (n) => n * (n + 1),
		sum,
		termE: (s) => ({ latex: `${K(s)}${K(s + 1)}`, sympy: `(k+${s})*(k+${s}+1)`, f: (k) => (k + s) * (k + s + 1) }),
		closedE: (s) => ({ latex: `\\frac{${K(s)}${K(s + 1)}${K(s + 2)}}{3}`, sympy: `(k+${s})*(k+${s}+1)*(k+${s}+2)/3`, f: (k) => sum(k + s) }),
		terms: (v) => Array.from({ length: v }, (_, i) => `${i + 1} \\cdot ${i + 2}`),
	};
}

function family(rng: Rng): Family {
	const u = rng.next();
	return u < 0.4 ? arithmetic(rng) : u < 0.64 ? geometric(rng) : u < 0.76 ? squares() : u < 0.88 ? cubes() : products();
}

/** The formula on two lines, each narrow enough for a phone. */
const statement = (fam: Family): string[] => [`${fam.lhs} =`, `= ${fam.closed}`];

const array = (rows: string[]): string => `\\begin{array}{l} ${rows.join(' \\\\ ')} \\end{array}`;

// ---------------------------------------------------------------------------
// Level 1: from which n an inequality holds

interface Ineq {
	latex: string;
	left: (n: number) => number;
	right: (n: number) => number;
	params: Record<string, unknown>;
}

function inequality(rng: Rng): Ineq {
	const u = rng.next();
	if (u < 0.45) {
		const [b, a, c] = [rng.pick([2, 2, 3]), rng.int(1, 9), rng.int(-5, 15)];
		return { latex: `${b}^n > ${lin(a, c)}`, left: (n) => b ** n, right: (n) => a * n + c, params: { case: 'esponenziale e retta', b, a, c } };
	}
	if (u < 0.7) {
		const [b, c] = [rng.pick([2, 2, 3]), rng.int(-5, 10)];
		return { latex: `${b}^n > ${polyToLatex(poly(c, 0, 1), 'n')}`, left: (n) => b ** n, right: (n) => n * n + c, params: { case: 'esponenziale e quadrato', b, c } };
	}
	const [a, c] = [rng.int(2, 9), rng.int(1, 20)];
	return { latex: `n^2 > ${lin(a, c)}`, left: (n) => n * n, right: (n) => a * n + c, params: { case: 'quadrato e retta', a, c } };
}

/** The smallest n0 with the inequality true for every n from n0 to 40. */
function firstTrue(x: Ineq): number {
	let n0 = 41;
	for (let n = 40; n >= 1 && x.left(n) > x.right(n); n--) n0 = n;
	return n0;
}

function level1(rng: Rng): Built {
	const x = inequality(rng);
	const n0 = firstTrue(x);
	if (n0 < 2 || n0 > 8) return level1(rng);
	const rows = Array.from({ length: n0 }, (_, i) => i + 1).map((n) => `n = ${n}${t(': ')}${x.left(n)} > ${x.right(n)}${t(x.left(n) > x.right(n) ? ' è vero' : ' è falso')}`);
	const early = Array.from({ length: n0 }, (_, i) => i + 1).find((n) => x.left(n) > x.right(n)) ?? n0;
	return {
		prompt: 'Calcola i primi casi: qual è il più piccolo n da cui la disuguaglianza è sempre vera? È il valore da usare come base.',
		problem: x.latex,
		solution: `n = ${n0}`,
		steps: [...rows, `${t(`Da `)}n = ${n0}${t(' in poi il primo membro cresce più in fretta del secondo: la base dell’induzione è ')}n = ${n0}`],
		answer: numberAnswer(q(n0)),
		choice: numberChoice(ID, rng, q(n0), [q(early), q(n0 - 1), q(n0 + 1), q(1)]),
		params: x.params,
	};
}

// ---------------------------------------------------------------------------
// Levels 2, 3, 4: a formula, and its pieces

function level2(rng: Rng): Built {
	const fam = family(rng);
	const v = rng.int(1, fam.params.family === 'cubi' ? 3 : 4);
	const value = fam.sum(v);
	const terms = fam.terms(v);
	const first = terms.length === 1 ? `${t('Il primo membro ha un solo termine: ')}${terms[0]} = ${value}` : `${t('Primo membro: ')}${terms.join(' + ')} = ${value}`;
	// The closed form with the number in place of n: 2n -> 2 \cdot 3, n(n + 1) -> 3 \cdot (3 + 1), n^2 -> 3^2.
	const second = fam.closed
		.replace(/(\d)n/g, '$1 \\cdot n')
		.replace(/n(?=\()/g, 'n \\cdot ')
		.replace(/n/g, `${v}`);
	return {
		prompt: `Verifica l'uguaglianza per n = ${v}: quanto valgono i due membri?`,
		problem: array(statement(fam)),
		solution: `${value}`,
		steps: [first, `${t('Secondo membro: ')}${second} = ${value}`, t('I due membri sono uguali: per questo valore di n la formula è vera')],
		answer: numberAnswer(q(value)),
		choice: numberChoice(ID, rng, q(value), [q(fam.term(v)), q(fam.sum(v + 1)), q(fam.sum(v) + 1), q(v === 1 ? fam.term(2) : fam.sum(v - 1))]),
		params: { ...fam.params, n: v },
	};
}

function level3(rng: Rng): Built {
	const fam = family(rng);
	const correct = fam.termE(1);
	const wrong = [fam.termE(0), polyE([1, 1]), plusE(fam.termE(0), polyE([1])), fam.termE(2), polyE([1]), polyE([0, 1])];
	return {
		prompt: 'Nel passo induttivo si passa da P(k) a P(k + 1): quale termine si aggiunge al primo membro?',
		problem: array(statement(fam)),
		solution: correct.latex,
		steps: [
			`${t('Il termine di posto ')}n${t(' è l’ultimo del primo membro; quello di posto ')}k${t(' è ')}${fam.termE(0).latex}`,
			`${t('Il termine che si aggiunge è quello di posto ')}k + 1${t(': si scrive ')}k + 1${t(' al posto di ')}n`,
			correct.latex,
		],
		answer: exprChoice(rng, correct, wrong),
		params: { ...fam.params },
	};
}

function level4(rng: Rng): Built {
	const fam = family(rng);
	const correct = fam.closedE(1);
	const base = fam.closedE(0);
	const wrong = [plusE(base, polyE([1])), plusE(base, polyE([1, 1])), base, plusE(base, fam.termE(0)), fam.closedE(2)];
	return {
		prompt: 'Qual è il secondo membro della tesi P(k + 1)?',
		problem: array(statement(fam)),
		solution: correct.latex,
		steps: [`${t('Nel secondo membro si scrive ')}k + 1${t(' al posto di ')}n${t(' dappertutto')}`, correct.latex, t('È l’espressione a cui deve arrivare il passo induttivo')],
		answer: exprChoice(rng, correct, wrong),
		params: { ...fam.params },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the missing piece of an inductive step

const powE = (p: number, shift: number, c: number): Expr => ({ latex: joinSigned(`${p}^${expo(shift)}`, q(c)), sympy: `${p}**(k+${shift}) + (${c})`, f: (k) => p ** (k + shift) + c });

/** "ck" inside a sum: "+ 2k", "- k". */
const linearTerm = (head: string, c: number, v: string): string => (c === 0 ? head : `${head} ${c < 0 ? '-' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${v}`);

function level5(rng: Rng): Built {
	const prompt = 'Completa il passo induttivo: che cosa va al posto del punto di domanda?';
	const u = rng.next();
	if (u < 0.5) {
		const cube = u < 0.3;
		const [deg, m] = cube ? [3, 3] : [2, 2];
		const c = cube ? rng.pick([2, 5, 8, -1, -4, 11]) : rng.pick([1, 3, 5, 7, -1, -3, 9]);
		const rest = (1 + c) / m;
		const correct = cube ? polyE([rest, 1, 1]) : polyE([rest, 1]);
		const wrong = cube
			? [polyE([1 + c, 3, 3]), polyE([1 + c, 1, 1]), polyE([0, 1, 1]), polyE([rest + 1, 1, 1]), polyE([rest, 1, 3]), polyE([1, 2, 1])]
			: [polyE([1 + c, 2]), polyE([1 + c, 1]), polyE([0, 1]), polyE([rest + 1, 1]), polyE([rest, 2]), polyE([1, 1])];
		const fn = linearTerm(`n^${deg}`, c, 'n');
		const fk = linearTerm(`k^${deg}`, c, 'k');
		const fk1 = linearTerm(`(k + 1)^${deg}`, c, '(k + 1)');
		const expanded = cube ? polyToLatex(poly(1 + c, 3 + c, 3, 1), 'k') : polyToLatex(poly(1 + c, 2 + c, 1), 'k');
		const extra = cube ? polyToLatex(poly(1 + c, 3, 3), 'k') : polyToLatex(poly(1 + c, 2), 'k');
		return {
			prompt,
			problem: array([`\\text{Enunciato: $${fn}$ è divisibile per $${m}$.}`, `${fk1} =`, `= (${fk}) + ${m} \\cdot (\\ ?\\ )`]),
			solution: correct.latex,
			steps: [
				`${fk1} = ${expanded}`,
				`${t('Separa i termini dell’ipotesi induttiva dagli altri: ')}(${fk}) + ${extra}`,
				`${extra} = ${m}(${correct.latex})`,
				`${t(`Il primo addendo è divisibile per ${m} per l’ipotesi induttiva, il secondo perché contiene il fattore `)}${m}`,
			],
			answer: exprChoice(rng, correct, wrong),
			params: { case: cube ? 'cubo' : 'quadrato', c },
		};
	}
	if (u < 0.75) {
		const a = rng.int(3, 9);
		const correct = polyE([a - 1]);
		return {
			prompt,
			problem: array([`\\text{Enunciato: $${a}^n - 1$ è divisibile per $${a - 1}$.}`, `${a}^{k+1} - 1 =`, `= ${a} \\cdot (${a}^k - 1) + \\ ?`]),
			solution: correct.latex,
			steps: [
				`${a} \\cdot (${a}^k - 1) = ${a}^{k+1} - ${a}`,
				`${t('Per tornare a ')}${a}^{k+1} - 1${t(' bisogna aggiungere ')}${a} - 1 = ${a - 1}`,
				`${t(`Il primo addendo è divisibile per ${a - 1} per l’ipotesi induttiva, il secondo è `)}${a - 1}`,
			],
			answer: exprChoice(rng, correct, [polyE([a]), polyE([1]), polyE([a + 1]), polyE([-1]), polyE([a - 2])]),
			params: { case: 'potenza', a },
		};
	}
	const [p, c] = [rng.pick([2, 2, 3]), nonZero(rng, -3, 3)];
	const r = c * (1 - p);
	const correct = powE(p, 1, c);
	const law = joinSigned(`${p}a_n`, q(r));
	return {
		prompt,
		problem: array([
			`\\text{Enunciato: $a_n = ${joinSigned(`${p}^n`, q(c))}$, con $a_1 = ${p + c}$ e $a_{n+1} = ${law}$.}`,
			`a_{k+1} = ${joinSigned(`${p}a_k`, q(r))} =`,
			`= ${joinSigned(`${p} \\cdot (${joinSigned(`${p}^k`, q(c))})`, q(r))} = \\ ?`,
		]),
		solution: correct.latex,
		steps: [
			`${t('Per l’ipotesi induttiva ')}a_k = ${joinSigned(`${p}^k`, q(c))}`,
			`${p} \\cdot ${p}^k = ${p}^{k+1}${t(' e ')}${p} \\cdot ${c < 0 ? `(${c})` : c} ${r < 0 ? '-' : '+'} ${Math.abs(r)} = ${c}`,
			correct.latex,
		],
		answer: exprChoice(rng, correct, [powE(p, 1, p * c), powE(p, 0, c), powE(p, 1, -c), powE(p, 1, c + 1), powE(p, 1, r), powE(p * p, 0, c)]),
		params: { case: 'ricorsiva', p, c },
	};
}

// ---------------------------------------------------------------------------
// Level 6: what is wrong in a proof

type Flaw = 'corretta' | 'un solo k' | 'dalla tesi' | 'base falsa';
const two = (a: string, b: string): string => `\\begin{gathered} ${a} \\\\ ${b} \\end{gathered}`;
const FLAW_LATEX: Record<Flaw, string> = {
	corretta: t('la dimostrazione è corretta'),
	'un solo k': two(t('il passo è dimostrato'), `${t('per un solo valore di ')}k`),
	'dalla tesi': two(t('il passo parte dalla tesi'), t('come se fosse vera')),
	'base falsa': two(`${t('manca la base, e per ')}n = 1`, t('l’enunciato è falso')),
};
const STEP_LINE: Record<Exclude<Flaw, 'base falsa'>, string> = {
	corretta: '\\text{Passo: si suppone vera $P(k)$, si aggiunge ai due membri il termine di posto $k + 1$ e si arriva al secondo membro di $P(k + 1)$.}',
	'un solo k': '\\text{Passo: da $P(1)$ si ricava $P(2)$ con un conto; quindi il passo vale per ogni $k$.}',
	'dalla tesi': '\\text{Passo: si scrive $P(k + 1)$ come se fosse vera e la si trasforma fino a ottenere $0 = 0$.}',
};

function level6(rng: Rng): Built {
	const flaw = rng.pick<Flaw>(['corretta', 'un solo k', 'dalla tesi', 'base falsa']);
	const opts = Object.fromEntries(Object.entries(FLAW_LATEX).map(([k, latex]) => [k, { latex, values: [k] }])) as Record<Flaw, ChoiceOption>;
	const answer = () =>
		choiceOf(
			ID,
			rng,
			opts[flaw],
			(Object.keys(opts) as Flaw[]).filter((k) => k !== flaw).map((k) => opts[k]),
		);
	const prompt = 'Leggi la dimostrazione per induzione: è corretta? Se no, qual è l’errore?';
	if (flaw === 'base falsa') {
		const c = rng.int(0, 9);
		const claim = c % 2 === 0 ? 'dispari' : 'pari';
		const f = polyToLatex(poly(c, 1, 1), 'n');
		const fk = polyToLatex(poly(c, 1, 1), 'k');
		const fk1 = `(k + 1)^2 + (k + 1)${c === 0 ? '' : ` + ${c}`}`;
		return {
			prompt,
			problem: array([
				`\\text{Enunciato, per ogni $n \\geq 1$: $${f}$ è ${claim}.}`,
				'\\text{Base: non è stata verificata.}',
				`\\text{Passo: $${fk1} = (${fk}) + 2(k + 1)$, e aggiungere un numero pari non cambia la parità.}`,
			]),
			solution: FLAW_LATEX[flaw],
			steps: [
				t('Il passo induttivo è giusto, ma da solo non dimostra nulla: serve la base'),
				`${t('Per ')}n = 1${t(' si ottiene ')}1 + 1${c === 0 ? '' : ` + ${c}`} = ${2 + c}${t(`, che è ${claim === 'pari' ? 'dispari' : 'pari'}: l’enunciato è falso`)}`,
			],
			answer: answer(),
			params: { case: flaw, c, claim },
		};
	}
	const fam = family(rng);
	const why: Record<Exclude<Flaw, 'base falsa'>, string[]> = {
		corretta: ['La base è verificata con un conto', 'Il passo parte dall’ipotesi induttiva, vale per un k qualunque e arriva alla tesi: la dimostrazione è corretta'],
		'un solo k': ['Passare da P(1) a P(2) è un solo caso', 'Il passo induttivo deve valere per un k generico, indicato con la lettera'],
		'dalla tesi': ['Trasformare la tesi fino a un’identità usa quello che si deve dimostrare', 'Si parte da un membro di P(k + 1) e, con l’ipotesi induttiva, si arriva all’altro'],
	};
	return {
		prompt,
		problem: array(['\\text{Enunciato, per ogni $n \\geq 1$:}', ...statement(fam), `\\text{Base: per $n = 1$ i due membri valgono $${fam.sum(1)}$.}`, STEP_LINE[flaw]]),
		solution: FLAW_LATEX[flaw],
		steps: why[flaw].map(t),
		answer: answer(),
		params: { case: flaw, ...fam.params },
	};
}

// ---------------------------------------------------------------------------
// Checks

/** The family of a sample, rebuilt from its params. */
function familyOf(p: Record<string, unknown>): { term: (n: number) => number; sum: (n: number) => number } {
	const [a, d, r, m] = [N(p.a), N(p.d), N(p.r), N(p.m)];
	switch (p.family) {
		case 'aritmetica':
			return { term: (n) => a + (n - 1) * d, sum: (n) => (n * (2 * a + (n - 1) * d)) / 2 };
		case 'geometrica':
			return { term: (n) => m * (r - 1) * r ** (n - 1), sum: (n) => m * (r ** n - 1) };
		case 'quadrati':
			return { term: (n) => n * n, sum: (n) => (n * (n + 1) * (2 * n + 1)) / 6 };
		case 'cubi':
			return { term: (n) => n ** 3, sum: (n) => (n * n * (n + 1) * (n + 1)) / 4 };
		default:
			return { term: (n) => n * (n + 1), sum: (n) => (n * (n + 1) * (n + 2)) / 3 };
	}
}

/** The value at k of an option written in SymPy: numbers, k, + - * / ** and parentheses. */
function evalSympy(expr: string, k: number): number {
	const src = expr.replace(/\s+/g, '');
	let at = 0;
	const atom = (): number => {
		if (src[at] === '(') {
			at++;
			const v = sum();
			at++;
			return v;
		}
		if (src[at] === 'k') {
			at++;
			return k;
		}
		const m = /^\d+/.exec(src.slice(at));
		if (!m) throw new Error(`${ID}: unreadable option ${expr}`);
		at += m[0].length;
		return Number(m[0]);
	};
	const unary = (): number => {
		if (src[at] === '-') {
			at++;
			return -unary();
		}
		const base = atom();
		if (src.startsWith('**', at)) {
			at += 2;
			return base ** unary();
		}
		return base;
	};
	const product = (): number => {
		let v = unary();
		while ((src[at] === '*' && src[at + 1] !== '*') || src[at] === '/') {
			const op = src[at++];
			const w = unary();
			v = op === '*' ? v * w : v / w;
		}
		return v;
	};
	function sum(): number {
		let v = product();
		while (src[at] === '+' || src[at] === '-') {
			const op = src[at++];
			const w = product();
			v = op === '+' ? v + w : v - w;
		}
		return v;
	}
	const value = sum();
	if (at !== src.length) throw new Error(`${ID}: unreadable option ${expr}`);
	return value;
}

function optionIs(s: Sample, f: (k: number) => number): string[] {
	const v = correctValues(s)?.[0];
	if (!v) return ['manca la risposta giusta'];
	const ch = s.answer as ChoiceAnswer;
	const same = (o: ChoiceOption) => [1, 2, 3, 4, 5, 6].every((k) => Math.abs(evalSympy(o.values[0], k) - f(k)) < 1e-9);
	const right = ch.options.filter(same);
	return right.length === 1 && right[0] === ch.options[ch.correct] ? [] : [`${right.length} opzioni giuste`];
}

function check(s: Sample): string[] {
	const p = s.params;
	switch (s.level) {
		case 1: {
			const left = (n: number) => (p.case === 'quadrato e retta' ? n * n : N(p.b) ** n);
			const right = (n: number) => (p.case === 'esponenziale e quadrato' ? n * n + N(p.c) : N(p.a) * n + N(p.c));
			let n0 = 41;
			for (let n = 40; n >= 1 && left(n) > right(n); n--) n0 = n;
			return n0 >= 2 && n0 <= 8 ? numberCheck(s, q(n0)) : ['primo valore fuori da 2..8'];
		}
		case 2: {
			const fam = familyOf(p);
			let total = 0;
			for (let i = 1; i <= N(p.n); i++) total += fam.term(i);
			return total === fam.sum(N(p.n)) ? numberCheck(s, q(total)) : ['la formula non vale'];
		}
		case 3:
			return optionIs(s, (k) => familyOf(p).term(k + 1));
		case 4:
			return optionIs(s, (k) => familyOf(p).sum(k + 1));
		case 5: {
			const c = N(p.c);
			if (p.case === 'cubo') return optionIs(s, (k) => ((k + 1) ** 3 + c * (k + 1) - (k ** 3 + c * k)) / 3);
			if (p.case === 'quadrato') return optionIs(s, (k) => ((k + 1) ** 2 + c * (k + 1) - (k * k + c * k)) / 2);
			if (p.case === 'potenza') return optionIs(s, (k) => N(p.a) ** (k + 1) - 1 - N(p.a) * (N(p.a) ** k - 1));
			return optionIs(s, (k) => N(p.p) ** (k + 1) + c);
		}
		case 6: {
			if (correctValues(s)?.[0] !== p.case) return ['errore indicato diverso dal caso'];
			if (p.case === 'base falsa') return ((2 + N(p.c)) % 2 === 0) === (p.claim === 'pari') ? ['l’enunciato è vero per n = 1'] : [];
			return familyOf(p).sum(1) === familyOf(p).term(1) ? [] : ['la base non vale'];
		}
		default:
			return [`livello sconosciuto ${s.level}`];
	}
}

export const principioInduzione = chapterGenerator({
	id: ID,
	title: 'Principio di induzione',
	levels: {
		1: { label: 'Da quale n vale una disuguaglianza', constraints: ['2^n o 3^n contro una retta o un quadrato, oppure n^2 contro una retta', 'il primo valore è tra 2 e 8'] },
		2: { label: 'Verificare un caso di una formula', constraints: ['somme di progressioni aritmetiche e geometriche, quadrati, cubi, prodotti n(n + 1)', 'n tra 1 e 4: per n = 1 è la base'] },
		3: { label: 'Il termine che si aggiunge nel passo induttivo', constraints: ['il termine di posto k + 1, da scegliere tra quattro espressioni di valore diverso'] },
		4: { label: 'Il secondo membro della tesi P(k + 1)', constraints: ['il secondo membro con k + 1 al posto di n, tra quattro espressioni di valore diverso'] },
		5: { label: 'Completare un passo induttivo', constraints: ['tre su dieci n^3 + cn divisibile per 3, due n^2 + cn divisibile per 2', 'un quarto a^n - 1 divisibile per a - 1, un quarto una successione ricorsiva'] },
		6: { label: "Riconoscere l'errore in una dimostrazione", constraints: ['corretta, passo per un solo k, passo che parte dalla tesi, base mancante e falsa: un quarto ciascuna'] },
	},
	builders: { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 },
	check,
});

export default principioInduzione;
