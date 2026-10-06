/**
 * Logaritmi e loro proprietà. Spec: specs/exercises/logaritmi-proprieta.md
 *
 * Seven levels in the order of lesson 124 (docs/lezioni/riscritte/124-logaritmi-proprieta.md): a logarithm from
 * the definition with an integer result, base and argument powers of the same number, the argument or the base to
 * find, the properties used to compute, a logarithm to expand, several logarithms to write as one, the change of
 * base. Built backwards from the exponent. The wrong options are the mistakes of the lesson's warnings (the
 * logarithm of a sum, the exponent left where it is, the quotient of logarithms).
 */
import type { NumberAnswer, Rng } from '../types';
import { Rational, q } from '../rational';
import { type Build, type Cand, intIn, intLog, logHead, logTex, makeGenerator, numCand, powTex, retry, rpow, text } from '../logaritmi';

export const ID = 'logaritmi-proprieta';

const number = (r: Rational): NumberAnswer => ({ kind: 'number', value: r.toString() });
const label = (tag: string, latex: string, value: string): Cand => ({ tag, latex, values: [value] });
/** log(8,2) for the checker. */
const lg = (arg: number | string, base: Rational | number) => `log(${arg},${base.toString()})`;

// ---------------------------------------------------------------------------
// Level 1: the definition, integer result

/** Largest exponent, positive and negative, for which the power of the base stays small. */
const SPAN: Record<number, [number, number]> = { 2: [-5, 8], 3: [-4, 5], 4: [-3, 4], 5: [-3, 4], 10: [-3, 4] };

function level1(rng: Rng): Build | null {
	if (rng.next() < 0.15) {
		const n = intIn(rng, -3, 5, [0, 1]);
		const arg = n > 0 ? `e^${n}` : n === -1 ? '\\frac{1}{e}' : `\\frac{1}{e^${-n}}`;
		return {
			form: 'ln',
			prompt: 'Calcola il logaritmo.',
			problem: `\\ln ${arg}`,
			solution: `${n}`,
			steps: [text('Il logaritmo naturale ha base ') + 'e' + text(': cerca l\'esponente da dare a ') + 'e' + text(' per ottenere l\'argomento.'), `${arg} = e^{${n}}`, `\\ln ${arg} = ${n}`],
			answer: number(q(n)),
			right: numCand('giusta', n),
			cands: [numCand('opposto', -n), Math.abs(n) > 1 ? numCand('reciproco', q(1, n)) : null, numCand('vicino+', n + 1), numCand('vicino-', n - 1)],
			extra: { base: 'e', n },
		};
	}
	const b = rng.pick([2, 3, 4, 5, 10]);
	const n = rng.int(SPAN[b][0], SPAN[b][1]);
	const base = q(b);
	const arg = rpow(base, n);
	return {
		form: n < 0 ? 'esponente negativo' : 'esponente non negativo',
		prompt: 'Calcola il logaritmo.',
		problem: logTex(base, arg.toLatex()),
		solution: `${n}`,
		steps: [text('Cerca l\'esponente da dare a ') + `${b}` + text(' per ottenere ') + arg.toLatex() + text(':'), `${powTex(base, n)} = ${arg.toLatex()}`, `${logTex(base, arg.toLatex())} = ${n}`],
		answer: number(q(n)),
		right: numCand('giusta', n),
		cands: [n >= 2 ? numCand('quoziente', arg.div(base)) : null, n <= 1 ? numCand('base', b) : null, n !== 0 ? numCand('opposto', -n) : null, Math.abs(n) > 1 ? numCand('reciproco', q(1, n)) : null, numCand('vicino+', n + 1), numCand('vicino-', n - 1)],
		extra: { base: `${b}`, n },
	};
}

// ---------------------------------------------------------------------------
// Level 2: base and argument powers of the same number

/** The exponents m for which b^m is a base of the level, and the largest |n| for the argument b^n. */
const ROOTS: Record<number, { ms: number[]; span: [number, number] }> = {
	2: { ms: [2, 3, -1, -2], span: [-5, 6] },
	3: { ms: [2, 3, -1, -2], span: [-4, 5] },
	5: { ms: [2, -1], span: [-3, 3] },
};

/** A pair (m, n) with base b^m and argument b^n; `plain` also allows the results that are positive integers. */
function powerPair(rng: Rng, b: number, positive: boolean, plain = false): { m: number; n: number } | null {
	const ms = ROOTS[b].ms.filter((m) => m > 0 === positive);
	const m = rng.pick(ms);
	const n = intIn(rng, ROOTS[b].span[0], ROOTS[b].span[1], [0]);
	const r = q(n, m);
	// an integer power of the base written as it is belongs to level 1: only a base smaller than 1 with a negative result stays
	if (!plain && r.isInteger() && (m > 0 || r.sign() > 0)) return null;
	return { m, n };
}

function level2(rng: Rng): Build | null {
	const positive = rng.next() < 0.5;
	return retry(() => {
		const b = rng.pick([2, 3, 5]);
		const pair = powerPair(rng, b, positive);
		if (!pair) return null;
		const { m, n } = pair;
		const base = rpow(q(b), m);
		const arg = rpow(q(b), n);
		const r = q(n, m);
		const problem = logTex(base, arg.toLatex());
		return {
			form: positive ? 'base maggiore di 1' : 'base minore di 1',
			prompt: 'Calcola il logaritmo.',
			problem,
			solution: r.toLatex(),
			steps: [
				text('Chiama ') + 'x' + text(' il logaritmo e scrivi base e argomento come potenze di ') + `${b}` + text(':'),
				`\\left(${powTex(q(b), m)}\\right)^x = ${powTex(q(b), n)}`,
				text('Uguaglia gli esponenti: ') + `${m === -1 ? '-' : m}x = ${n}`,
				`${problem} = ${r.toLatex()}`,
			],
			answer: number(r),
			right: numCand('giusta', r),
			cands: [numCand('reciproco', q(m, n)), numCand('opposto', r.neg()), numCand('solo argomento', n), numCand('differenza', n - m), numCand('vicino+', r.add(q(1))), numCand('vicino-', r.sub(q(1)))],
			extra: { b, m, n },
		};
	});
}

// ---------------------------------------------------------------------------
// Level 3: the argument or the base to find

function level3(rng: Rng): Build | null {
	const findArg = rng.next() < 0.5;
	return retry(() => {
		if (findArg) {
			const base = rng.pick([q(2), q(3), q(4), q(5), q(10), q(1, 2), q(1, 3)]);
			const c = intIn(rng, -3, 4, [0, 1]);
			const x = rpow(base, c);
			if (Math.max(x.num, x.den) > 130 && !base.equals(q(10))) return null;
			if (Math.max(x.num, x.den) > 1000) return null;
			const swapped = base.isInteger() && c > 0 && c ** base.num <= 1000 ? numCand('scambiati', c ** base.num) : null;
			return {
				form: 'argomento',
				prompt: 'Trova il valore di x.',
				problem: `${logTex(base, 'x')} = ${c}`,
				solution: `x = ${x.toLatex()}`,
				steps: [text('Per la definizione di logaritmo, l\'argomento è la potenza della base con esponente ') + `${c}` + text(':'), `x = ${powTex(base, c)}`, `x = ${x.toLatex()}`],
				answer: number(x),
				right: numCand('giusta', x),
				cands: [numCand('prodotto', base.mul(q(c))), numCand('segno', rpow(base, -c)), swapped, numCand('vicino+', x.add(q(1))), numCand('vicino-', x.sub(q(1)))],
				extra: { base: base.toString(), c },
			};
		}
		const b = rng.int(2, 9);
		const c = rng.pick([2, 3, -1, -2, -3]);
		const B = rpow(q(b), c);
		if (Math.max(B.num, B.den) > 729) return null;
		const steps = [text('Per la definizione di logaritmo: ') + `x^{${c}} = ${B.toLatex()}`];
		if (c < 0) steps.push(`\\frac{1}{x${c === -1 ? '' : `^${-c}`}} = ${B.toLatex()} \\ \\Rightarrow \\ x${c === -1 ? '' : `^${-c}`} = ${rpow(q(b), -c).toLatex()}`);
		steps.push(text('La base di un logaritmo è positiva: ') + `x = ${b}`);
		return {
			form: 'base',
			prompt: 'Trova il valore di x.',
			problem: `\\log_x ${B.toLatex()} = ${c}`,
			solution: `x = ${b}`,
			steps,
			answer: number(q(b)),
			right: numCand('giusta', b),
			cands: [numCand('reciproco', q(1, b)), numCand('negativa', -b), numCand('divisione', B.div(q(c))), numCand('prodotto', B.mul(q(c))), numCand('vicino+', b + 1)],
			extra: { b, c },
		};
	});
}

// ---------------------------------------------------------------------------
// Level 4: the properties to compute

const notPower = (a: number, v: number) => intLog(q(a), q(v)) === null;

function level4(rng: Rng): Build | null {
	const u = rng.next();
	return retry(() => {
		if (u < 0.4) {
			// log_a p + log_a q with p q = a^k, neither a power of a
			const a = rng.pick([6, 10, 12, 15]);
			const k = rng.int(1, 3);
			const N = a ** k;
			if (N > 1000) return null;
			const p = rng.int(2, N - 1);
			if (N % p !== 0) return null;
			const qq = N / p;
			if (qq < 2 || p === qq || !notPower(a, p) || !notPower(a, qq)) return null;
			const base = q(a);
			const L = (v: number) => logTex(base, `${v}`);
			const problem = `${L(p)} + ${L(qq)}`;
			return {
				form: 'somma',
				prompt: 'Calcola senza calcolatrice.',
				problem,
				solution: `${k}`,
				steps: [text('La somma di due logaritmi con la stessa base è il logaritmo del prodotto:'), `${problem} = ${logTex(base, `(${p} \\cdot ${qq})`)} = ${L(N)}`, `${L(N)} = ${k}`],
				answer: number(q(k)),
				right: numCand('giusta', k),
				cands: [numCand('senza logaritmo', N), label('argomenti sommati', L(p + qq), lg(p + qq, a)), label('prodotto dei logaritmi', `${L(p)} \\cdot ${L(qq)}`, `${lg(p, a)}*${lg(qq, a)}`), numCand('vicino+', k + 1)],
				extra: { a, p, q: qq, k },
			};
		}
		if (u < 0.75) {
			// log_a p - log_a q with p / q = a^k
			const a = rng.pick([2, 3, 5]);
			const qq = rng.pick([3, 5, 6, 7, 11].filter((v) => v % a !== 0 || v === 6));
			const k = rng.int(1, 5);
			const p = qq * a ** k;
			if (p > 500 || !notPower(a, qq) || !notPower(a, p)) return null;
			const base = q(a);
			const L = (v: number) => logTex(base, `${v}`);
			const problem = `${L(p)} - ${L(qq)}`;
			return {
				form: 'differenza',
				prompt: 'Calcola senza calcolatrice.',
				problem,
				solution: `${k}`,
				steps: [text('La differenza di due logaritmi con la stessa base è il logaritmo del quoziente:'), `${problem} = ${logTex(base, `\\frac{${p}}{${qq}}`)} = ${L(a ** k)}`, `${L(a ** k)} = ${k}`],
				answer: number(q(k)),
				right: numCand('giusta', k),
				cands: [numCand('senza logaritmo', a ** k), label('argomenti sottratti', L(p - qq), lg(p - qq, a)), label('quoziente dei logaritmi', `\\frac{${L(p)}}{${L(qq)}}`, `${lg(p, a)}/${lg(qq, a)}`), numCand('vicino+', k + 1)],
				extra: { a, p, q: qq, k },
			};
		}
		// log_a p + m log_a q with p q^m = a^k
		const a = rng.pick([6, 10, 12]);
		const m = rng.pick([2, 3]);
		const qq = rng.pick([2, 3, 5].filter((v) => a % v === 0));
		const k = rng.int(1, 3);
		const N = a ** k;
		if (N % qq ** m !== 0) return null;
		const p = N / qq ** m;
		if (p < 2 || !notPower(a, p)) return null;
		const base = q(a);
		const L = (v: number) => logTex(base, `${v}`);
		const problem = `${L(p)} + ${m}${L(qq)}`;
		return {
			form: 'coefficiente',
			prompt: 'Calcola senza calcolatrice.',
			problem,
			solution: `${k}`,
			steps: [
				text('Porta il coefficiente all\'esponente dell\'argomento: ') + `${m}${L(qq)} = ${logTex(base, `${qq}^${m}`)} = ${L(qq ** m)}`,
				`${L(p)} + ${L(qq ** m)} = ${logTex(base, `(${p} \\cdot ${qq ** m})`)} = ${L(N)}`,
				`${L(N)} = ${k}`,
			],
			answer: number(q(k)),
			right: numCand('giusta', k),
			cands: [numCand('senza logaritmo', N), label('esponente dimenticato', L(p * qq), lg(p * qq, a)), label('argomenti sommati', L(p + qq ** m), lg(p + qq ** m, a)), numCand('vicino+', k + 1)],
			extra: { a, p, q: qq, m, k },
		};
	});
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: expanding and collecting

/** 3\log_2 x, \log_2 x, \frac{1}{2}\log_2 y. */
const term = (c: Rational, base: Rational, v: string) => `${c.isOne() ? '' : c.toLatex()}${logTex(base, v)}`;
/** y^3, \sqrt{y}, \sqrt[3]{y}: the denominator, with the exponent e (an integer, or 1/2, 1/3). */
const yPower = (e: Rational) => (e.isInteger() ? (e.isOne() ? 'y' : `y^${e.num}`) : e.den === 2 ? '\\sqrt{y}' : `\\sqrt[${e.den}]{y}`);
const yExp = (e: Rational) => (e.isInteger() ? `y**${e.num}` : `y**(${e.toString()})`);

function level5(rng: Rng): Build | null {
	const root = rng.next() < 0.4;
	const a = rng.pick([2, 3, 5, 10]);
	const k = rng.int(1, a === 10 || a === 2 ? 3 : 2);
	const m = rng.int(2, 5);
	const e = root ? q(1, rng.pick([2, 2, 3])) : q(intIn(rng, 2, 5, [m]));
	const base = q(a);
	const c = a ** k;
	const problem = logTex(base, `\\frac{${c}x^${m}}{${yPower(e)}}`);
	const lx = lg('x', a);
	const ly = lg('y', a);
	const expr = (first: number, mx: Rational, sign: string, ny: Rational) => `${first} + ${term(mx, base, 'x')} ${sign} ${term(ny, base, 'y')}`;
	const val = (first: number, mx: Rational, sign: string, ny: Rational) => `${first}+${mx.toString()}*${lx}${sign}(${ny.toString()})*${ly}`;
	const right = { tag: 'giusta', latex: expr(k, q(m), '-', e), values: [val(k, q(m), '-', e)] };
	return {
		form: root ? 'radice' : 'quoziente',
		prompt: 'Sviluppa il logaritmo con le proprietà, con x > 0 e y > 0.',
		problem,
		solution: right.latex,
		steps: [
			text('Il quoziente diventa una differenza, il prodotto una somma:'),
			`${logTex(base, `${c}`)} + ${logTex(base, `x^${m}`)} - ${logTex(base, yPower(e))}`,
			text('Gli esponenti vanno davanti, e ') + `${logTex(base, `${c}`)} = ${k}` + (root ? text('; la radice è una potenza con esponente ') + e.toLatex() : '') + text(':'),
			right.latex,
		],
		right,
		cands: [
			label('numero senza logaritmo', expr(c, q(m), '-', e), val(c, q(m), '-', e)),
			label('segno', expr(k, q(m), '+', e), val(k, q(m), '+', e)),
			label('esponenti dimenticati', expr(k, q(1), '-', q(1)), val(k, q(1), '-', q(1))),
		],
		extra: { a, k, m, e: e.toString() },
	};
}

function level6(rng: Rng): Build | null {
	const root = rng.next() < 0.4;
	const a = rng.pick([2, 3, 5, 10]);
	const c = rng.pick([2, 3, 5, 6, 7].filter((v) => v !== a));
	const m = rng.int(2, 4);
	const e = root ? q(1, 2) : q(intIn(rng, 2, 4, [m]));
	const base = q(a);
	const problem = `${term(q(m), base, 'x')} + ${logTex(base, `${c}`)} - ${term(e, base, 'y')}`;
	const head = logHead(base);
	const right = { tag: 'giusta', latex: `${head} \\frac{${c}x^${m}}{${yPower(e)}}`, values: [`log(${c}*x**${m}/${yExp(e)},${a})`] };
	// the coefficients taken as factors: (m·c·x)/(e·y), and with e = 1/2 the 2 goes up
	const up = root ? 2 * m * c : m * c;
	const down = root ? 'y' : `${e.num}y`;
	return {
		form: root ? 'radice' : 'quoziente',
		prompt: 'Scrivi come un solo logaritmo, con x > 0 e y > 0.',
		problem,
		solution: right.latex,
		steps: [
			text('Porta i coefficienti all\'esponente degli argomenti:'),
			`${logTex(base, `x^${m}`)} + ${logTex(base, `${c}`)} - ${logTex(base, yPower(e))}`,
			text('I termini con il più vanno al numeratore, quello con il meno al denominatore:'),
			right.latex,
		],
		right,
		cands: [
			label('coefficienti come fattori', `${head} \\frac{${up}x}{${down}}`, `log(${up}*x/(${root ? 'y' : `${e.num}*y`}),${a})`),
			label('segno', `${head} (${c}x^${m}${yPower(e)})`, `log(${c}*x**${m}*${yExp(e)},${a})`),
			label('somma', `${head} (x^${m} + ${c} - ${yPower(e)})`, `log(x**${m}+${c}-${yExp(e)},${a})`),
		],
		extra: { a, c, m, e: e.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 7: the change of base

function level7(rng: Rng): Build | null {
	const u = rng.next();
	return retry(() => {
		if (u < 0.35) {
			// log_a b · log_b a^k = k
			const a = rng.pick([2, 3, 5]);
			const b = rng.pick([3, 5, 6, 7].filter((v) => v !== a));
			const k = rng.int(2, 4);
			const A = a ** k;
			if (A > 125) return null;
			const first = logTex(q(a), `${b}`);
			const second = logTex(q(b), `${A}`);
			return {
				form: 'prodotto',
				prompt: 'Calcola senza calcolatrice.',
				problem: `${first} \\cdot ${second}`,
				solution: `${k}`,
				steps: [
					text('Porta il secondo logaritmo in base ') + `${a}` + text(' con il cambiamento di base:'),
					`${second} = \\frac{${logTex(q(a), `${A}`)}}{${first}} = \\frac{${k}}{${first}}`,
					`${first} \\cdot \\frac{${k}}{${first}} = ${k}`,
				],
				answer: number(q(k)),
				right: numCand('giusta', k),
				cands: [numCand('uno', 1), numCand('argomento', A), label('argomenti moltiplicati', logTex(q(a), `${b * A}`), lg(b * A, a)), numCand('vicino+', k + 1)],
				extra: { a, b, k },
			};
		}
		if (u < 0.75) {
			// log_{b^m1} b^n1 + log_{b^m2} b^n2
			const b = rng.pick([2, 3]);
			const p1 = powerPair(rng, b, true, true);
			const p2 = powerPair(rng, b, rng.next() < 0.5, true);
			if (!p1 || !p2 || p1.m === p2.m) return null;
			const tex = (p: { m: number; n: number }) => logTex(rpow(q(b), p.m), rpow(q(b), p.n).toLatex());
			const r1 = q(p1.n, p1.m);
			const r2 = q(p2.n, p2.m);
			const r = r1.add(r2);
			const stepOf = (p: { m: number; n: number }, v: Rational) => `${tex(p)} = ${p.m === -1 ? '-' : q(1, p.m).toLatex()}${logTex(q(b), rpow(q(b), p.n).toLatex())} = ${v.toLatex()}`;
			const sumExp = p1.m + p2.m !== 0 ? numCand('esponenti sommati', q(p1.n + p2.n, p1.m + p2.m)) : null;
			return {
				form: 'somma',
				prompt: 'Calcola senza calcolatrice.',
				problem: `${tex(p1)} + ${tex(p2)}`,
				solution: r.toLatex(),
				steps: [text('Basi e argomenti sono potenze di ') + `${b}` + text('. Se la base è una potenza, il suo esponente va al denominatore:'), stepOf(p1, r1), stepOf(p2, r2), `${r1.toLatex()} ${r2.sign() < 0 ? '-' : '+'} ${r2.abs().toLatex()} = ${r.toLatex()}`],
				answer: number(r),
				right: numCand('giusta', r),
				cands: [numCand('differenza', r1.sub(r2)), numCand('reciproci', q(p1.m, p1.n).add(q(p2.m, p2.n))), numCand('senza basi', p1.n + p2.n), sumExp, numCand('vicino+', r.add(q(1)))],
				extra: { b, m1: p1.m, n1: p1.n, m2: p2.m, n2: p2.n },
			};
		}
		// which expression gives log_a b on a calculator
		const a = rng.pick([2, 3, 5, 7]);
		const b = intIn(rng, 2, 30, [a, 10]);
		if (!notPower(a, b) || b % 10 === 0) return null;
		const ten = q(10);
		const lb = logTex(ten, `${b}`);
		const la = logTex(ten, `${a}`);
		const right = label('giusta', `\\frac{${lb}}{${la}}`, `${lg(b, 10)}/${lg(a, 10)}`);
		return {
			form: 'calcolatrice',
			prompt: 'La calcolatrice ha solo il tasto log, in base 10. Quale espressione è uguale al logaritmo?',
			problem: logTex(q(a), `${b}`),
			solution: right.latex,
			steps: [text('Per il cambiamento di base, il logaritmo dell\'argomento va al numeratore e quello della base al denominatore:'), `${logTex(q(a), `${b}`)} = ${right.latex}`],
			right,
			cands: [
				label('rovesciata', `\\frac{${la}}{${lb}}`, `${lg(a, 10)}/${lg(b, 10)}`),
				label('logaritmo del quoziente', logTex(ten, `\\frac{${b}}{${a}}`), lg(`${b}/${a}`, 10)),
				label('prodotto', `${lb} \\cdot ${la}`, `${lg(b, 10)}*${lg(a, 10)}`),
			],
			extra: { a, b },
		};
	});
}

// ---------------------------------------------------------------------------
// The constraints of the specification

function levelErrors(s: { level: number; answer: { kind: string }; params: Record<string, unknown> }): string[] {
	const errs: string[] = [];
	const p = s.params as Record<string, number | string>;
	const kind = s.answer.kind;
	const choiceForms = s.level === 5 || s.level === 6 || p.form === 'calcolatrice';
	if (choiceForms !== (kind === 'choice')) errs.push('tipo di risposta diverso da quello del livello');
	if (s.level === 1 && p.form !== 'ln' && Math.abs(Number(p.n)) > 8) errs.push('livello 1: esponente troppo grande');
	if (s.level === 2) {
		const r = q(Number(p.n), Number(p.m));
		if (r.isInteger() && (Number(p.m) > 0 || r.sign() > 0)) errs.push('livello 2: il risultato è un intero che si legge come al livello 1');
	}
	if (s.level === 4 && Number(p.k) < 1) errs.push('livello 4: risultato intero positivo');
	return errs;
}

export default makeGenerator(
	ID,
	'Logaritmi e loro proprietà',
	{
		1: { label: 'Logaritmo con la definizione', constraints: ['log_b(b^n) con n intero, anche negativo; ln e^n nel 15% dei casi'] },
		2: { label: 'Base e argomento potenze dello stesso numero', constraints: ['base b^m e argomento b^n; risultato frazionario, oppure intero negativo con la base minore di 1'] },
		3: { label: "Trovare l'argomento o la base", constraints: ['log_b x = c oppure log_x B = c'] },
		4: { label: 'Calcolare con le proprietà', constraints: ['somma, differenza, coefficiente: il risultato è un intero positivo'] },
		5: { label: 'Sviluppare un logaritmo', constraints: ['log_a (a^k x^m / y^e), con e intero o 1/2, 1/3'] },
		6: { label: 'Scrivere come un solo logaritmo', constraints: ['m log_a x + log_a c - e log_a y'] },
		7: { label: 'Cambiamento di base', constraints: ['prodotto di logaritmi, somma con basi diverse, espressione per la calcolatrice'] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 },
	levelErrors,
);
