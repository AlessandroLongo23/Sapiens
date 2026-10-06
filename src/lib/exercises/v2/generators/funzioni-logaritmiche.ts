/**
 * Funzione logaritmica. Spec: specs/exercises/funzioni-logaritmiche.md
 *
 * Seven levels in the order of lesson 125 (docs/lezioni/riscritte/125-funzioni-logaritmiche.md): a point of the
 * graph, the sign of a logarithm from base and argument, three logarithms with the same base to put in order, the
 * two consecutive integers a logarithm lies between, the domain with an argument of first degree, the domain with
 * an argument of second degree or a quotient, the graph moved (asymptote and zero). The wrong options are the
 * mistakes of the lesson's warnings: the order kept with a base smaller than 1, the end of the domain included,
 * the plus inside the argument read as a move to the right.
 */
import type { NumberAnswer, Rng } from '../types';
import { Rational, q } from '../rational';
import { type Build, type Cand, type Iv, above, below, between, disTex, intIn, ivCand, lin, logHead, logTex, logVal, makeGenerator, num, numCand, outside, powTex, quad, retry, rpow, text, valFloat, valStr, valTex } from '../logaritmi';

export const ID = 'funzioni-logaritmiche';

const number = (r: Rational): NumberAnswer => ({ kind: 'number', value: r.toString() });
/** The head of a logarithm from the base as `params` keeps it: "2", "1/2", "10", "e". */
const head = (base: string) => (base === 'e' ? '\\ln' : logHead(Rational.parse(base)));
const fn = (base: string, arg: string, paren = true) => `${head(base)} ${paren ? `(${arg})` : arg}`;

// ---------------------------------------------------------------------------
// Level 1: a point of the graph

function level1(rng: Rng): Build | null {
	const ordinate = rng.next() < 0.5;
	return retry(() => {
		const base = rng.pick([q(2), q(3), q(4), q(5), q(10), q(1, 2), q(1, 3)]);
		const n = intIn(rng, -3, 4, ordinate ? [0] : [0, 1]);
		const X = rpow(base, n);
		if (Math.max(X.num, X.den) > (base.equals(q(10)) ? 1000 : 130)) return null;
		const curve = `y = ${logTex(base, 'x')}`;
		const point = (a: string, b: string) => (X.isInteger() ? `P(${a}, ${b})` : `P\\left(${a}, ${b}\\right)`);
		if (ordinate) {
			return {
				form: 'ordinata',
				prompt: 'Il punto P appartiene al grafico della funzione. Trova k.',
				problem: `${curve} \\qquad ${point(X.toLatex(), 'k')}`,
				solution: `k = ${n}`,
				steps: [text('L\'ordinata è il logaritmo dell\'ascissa: ') + `k = ${logTex(base, X.toLatex())}`, `${powTex(base, n)} = ${X.toLatex()}`, `k = ${n}`],
				answer: number(q(n)),
				right: numCand('giusta', n),
				cands: [n >= 2 && base.isInteger() ? numCand('quoziente', X.div(base)) : null, numCand('opposto', -n), numCand('ascissa', X), Math.abs(n) > 1 ? numCand('reciproco', q(1, n)) : null, numCand('vicino+', n + 1), numCand('vicino-', n - 1)],
				extra: { base: base.toString(), n },
			};
		}
		const swapped = base.isInteger() && n > 0 && n ** base.num <= 1000 ? numCand('scambiati', n ** base.num) : null;
		return {
			form: 'ascissa',
			prompt: 'Il punto P appartiene al grafico della funzione. Trova h.',
			problem: `${curve} \\qquad P(h, ${n})`,
			solution: `h = ${X.toLatex()}`,
			steps: [text('Le coordinate rendono vera l\'equazione: ') + `${logTex(base, 'h')} = ${n}`, text('Per la definizione di logaritmo: ') + `h = ${powTex(base, n)}`, `h = ${X.toLatex()}`],
			answer: number(X),
			right: numCand('giusta', X),
			cands: [numCand('prodotto', base.mul(q(n))), numCand('segno', rpow(base, -n)), swapped, numCand('ordinata', n), numCand('vicino+', X.add(q(1)))],
			extra: { base: base.toString(), n },
		};
	});
}

// ---------------------------------------------------------------------------
// Level 2: the sign of a logarithm

const SIGNS = ['positivo', 'negativo', 'nullo', 'non esiste'] as const;
type Sign = (typeof SIGNS)[number];
const signCand = (tag: string, s: Sign): Cand => ({ tag, latex: text(s), values: [s] });

function level2(rng: Rng): Build | null {
	const u = rng.next();
	return retry(() => {
		const base = rng.pick([q(2), q(3), q(5), q(10), q(1, 2), q(1, 3), q(1, 5)]);
		const big = base.compare(q(1)) > 0;
		let arg: Rational;
		let sign: Sign;
		let why: string;
		if (u < 0.1) {
			arg = q(1);
			sign = 'nullo';
			why = text('Il logaritmo di ') + '1' + text(' vale ') + '0' + text(' in ogni base.');
		} else if (u < 0.2) {
			arg = q(rng.pick([0, -1, -2, -4, -8, -9]));
			sign = 'non esiste';
			why = text('L\'argomento non è positivo: il logaritmo non esiste.');
		} else {
			const above1 = rng.next() < 0.5;
			arg = above1 ? (rng.next() < 0.7 ? q(rng.int(2, 30)) : q(rng.pick([3, 5, 7, 9]), 2)) : q(rng.pick([1, 1, 2, 3]), rng.pick([4, 5, 7, 8, 10]));
			if (arg.equals(base) || arg.equals(q(1).div(base))) return null;
			sign = above1 === big ? 'positivo' : 'negativo';
			const side = (b: boolean) => (b ? text('maggiore di ') + '1' : text('minore di ') + '1');
			why = text('La base è ') + side(big) + text(', l\'argomento è ') + side(above1) + (above1 === big ? text(': stanno dalla stessa parte, il logaritmo è positivo.') : text(': stanno da parti opposte, il logaritmo è negativo.'));
		}
		return {
			form: sign === 'nullo' ? 'argomento 1' : sign === 'non esiste' ? 'argomento non positivo' : big ? 'base maggiore di 1' : 'base minore di 1',
			prompt: 'Senza calcolarlo, stabilisci il segno del logaritmo.',
			problem: logTex(base, arg.toLatex(), arg.sign() < 0),
			solution: text(sign),
			steps: [why],
			right: signCand('giusta', sign),
			cands: SIGNS.filter((s) => s !== sign).map((s) => signCand(s, s)),
			extra: { base: base.toString(), arg: arg.toString() },
		};
	});
}

// ---------------------------------------------------------------------------
// Level 3: three logarithms in order

function level3(rng: Rng): Build | null {
	const big = rng.next() < 0.5;
	const base = big ? q(rng.pick([2, 3, 5])) : q(1, rng.pick([2, 3]));
	const args: number[] = [];
	while (args.length < 3) {
		const v = rng.int(2, 40);
		if (!args.includes(v)) args.push(v);
	}
	const vals = args.map((a) => logVal(base, q(a)));
	const sorted = [...vals].sort((u, v) => valFloat(u) - valFloat(v));
	const chain = (tag: string, order: number[]): Cand => ({ tag, latex: order.map((i) => valTex(sorted[i])).join(' < '), values: order.map((i) => valStr(sorted[i])) });
	const right = chain('giusta', [0, 1, 2]);
	const lo = Math.min(...args);
	const hi = Math.max(...args);
	return {
		form: big ? 'base maggiore di 1' : 'base minore di 1',
		prompt: 'Ordina i tre logaritmi dal minore al maggiore.',
		problem: vals.map(valTex).join(' \\qquad '),
		solution: right.latex,
		steps: [
			big
				? text('La base è maggiore di ') + '1' + text(': la funzione è crescente e l\'ordine degli argomenti si conserva.')
				: text('La base è minore di ') + '1' + text(': la funzione è decrescente e l\'ordine degli argomenti si rovescia.'),
			text(big ? 'Il logaritmo minore è quello con l\'argomento minore, ' : 'Il logaritmo minore è quello con l\'argomento maggiore, ') + `${big ? lo : hi}` + text('.'),
			right.latex,
		],
		right,
		cands: [chain('verso', [2, 1, 0]), chain('primi scambiati', [1, 0, 2]), chain('ultimi scambiati', [0, 2, 1])],
		extra: { base: base.toString(), args },
	};
}

// ---------------------------------------------------------------------------
// Level 4: between two consecutive integers

function level4(rng: Rng): Build | null {
	const big = rng.next() < 0.65;
	return retry(() => {
		const a = rng.pick([2, 3, 5, 10]);
		const d = rng.int(a + 1, a === 10 ? 2000 : a === 2 ? 200 : 500);
		// the exponent k with a^k < d < a^(k+1)
		let k = 0;
		while (a ** (k + 1) <= d) k++;
		if (a ** k === d) return null;
		const arg = big ? q(d) : q(1, d);
		const n = big ? k : -(k + 1);
		const lg = logTex(q(a), arg.toLatex());
		const lowP = rpow(q(a), n);
		const highP = rpow(q(a), n + 1);
		return {
			form: big ? 'argomento maggiore di 1' : 'argomento minore di 1',
			prompt: 'Il logaritmo sta tra due interi consecutivi. Trova n.',
			problem: `n < ${lg} < n + 1`,
			solution: `n = ${n}`,
			steps: [
				text('Cerca le due potenze di ') + `${a}` + text(' tra cui cade l\'argomento:'),
				`${powTex(q(a), n)} = ${lowP.toLatex()} < ${arg.toLatex()} < ${highP.toLatex()} = ${powTex(q(a), n + 1)}`,
				text('La funzione è crescente: ') + `${n} < ${lg} < ${n + 1}`,
			],
			answer: number(q(n)),
			right: numCand('giusta', n),
			cands: [numCand('superiore', n + 1), n !== 0 ? numCand('opposto', -n) : null, numCand('inferiore', n - 1), big && Math.floor(d / a) !== n ? numCand('quoziente', Math.floor(d / a)) : null],
			extra: { a, arg: arg.toString() },
		};
	});
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: the domain

const BASES = ['2', '3', '10', 'e', '1/2'];
const dom = (tag: string, ivs: Iv[]) => ivCand(tag, ivs, 'D');

function level5(rng: Rng): Build | null {
	const base = rng.pick(BASES);
	const m = intIn(rng, -4, 4, [0]);
	const n = intIn(rng, -9, 9, [0]);
	const bound = q(-n, m);
	if (bound.den > 4) return null;
	const side = (v: Rational, closed: boolean, up: boolean) => (up ? above(num(v), closed) : below(num(v), closed));
	const truth = side(bound, false, m > 0);
	const f = fn(base, lin(m, n));
	const div = m < 0 ? text('; dividendo per un numero negativo il verso cambia') : '';
	return {
		form: m > 0 ? 'coefficiente positivo' : 'coefficiente negativo',
		prompt: 'Trova il dominio della funzione.',
		problem: `f(x) = ${f}`,
		solution: dom('giusta', truth).latex,
		steps: [text('L\'argomento del logaritmo deve essere positivo: ') + `${lin(m, n)} > 0`, `${lin(m, 0)} > ${-n}` + div, `x ${m > 0 ? '>' : '<'} ${bound.toLatex()}`],
		right: dom('giusta', truth),
		cands: [dom('chiuso', side(bound, true, m > 0)), dom('verso', side(bound, false, m < 0)), dom('segno', side(bound.neg(), false, m > 0)), dom('verso chiuso', side(bound, true, m < 0))],
		extra: { base, m, n },
	};
}

function level6(rng: Rng): Build | null {
	const fraction = rng.next() < 0.5;
	const base = rng.pick(BASES);
	const s = rng.pick([1, -1]);
	return retry(() => {
		if (!fraction) {
			const r1 = rng.int(-6, 5);
			const r2 = rng.int(r1 + 1, 6);
			const [a, b, c] = [s, -s * (r1 + r2), s * r1 * r2];
			const arg = quad(a, b, c);
			const zone = (inside: boolean, closed: boolean) => (inside ? between(num(r1), num(r2), closed, closed) : outside(num(r1), num(r2), closed));
			const truth = zone(s < 0, false);
			return {
				form: 'secondo grado',
				prompt: 'Trova il dominio della funzione.',
				problem: `f(x) = ${fn(base, arg)}`,
				solution: dom('giusta', truth).latex,
				steps: [
					text('L\'argomento deve essere positivo: ') + `${arg} > 0`,
					text('L\'equazione associata ha le soluzioni ') + `${r1}` + text(' e ') + `${r2}` + text('.'),
					s > 0 ? text('Il coefficiente di ') + 'x^2' + text(' è positivo: valori esterni, estremi esclusi.') : text('Il coefficiente di ') + 'x^2' + text(' è negativo: valori interni, estremi esclusi.'),
					disTex(truth),
				],
				right: dom('giusta', truth),
				cands: [dom('scambiati', zone(s > 0, false)), dom('chiuso', zone(s < 0, true)), dom('scambiati chiuso', zone(s > 0, true))],
				extra: { base, s, r1, r2 },
			};
		}
		// (x - r1)/(x - r2), or (r1 - x)/(x - r2): the numerator vanishes in r1, the denominator in r2
		const r1 = rng.int(-7, 7);
		const r2 = intIn(rng, -7, 7, [r1]);
		if (r1 === 0 || r2 === 0) return null;
		const numer = s > 0 ? lin(1, -r1) : lin(-1, r1);
		if (s < 0 && r1 < 0) return null;
		const arg = `\\frac{${numer}}{${lin(1, -r2)}}`;
		const lo = Math.min(r1, r2);
		const hi = Math.max(r1, r2);
		const truth = s > 0 ? outside(num(lo), num(hi)) : between(num(lo), num(hi));
		// the zero of the numerator taken in, as with ≥
		const withZero: Iv[] = s > 0 ? [...below(num(lo), lo === r1), ...above(num(hi), hi === r1)] : between(num(lo), num(hi), lo === r1, hi === r1);
		const onlyNum = s > 0 ? above(num(r1)) : below(num(r1));
		return {
			form: 'fratto',
			prompt: 'Trova il dominio della funzione.',
			problem: `f(x) = ${fn(base, arg, false)}`,
			solution: dom('giusta', truth).latex,
			steps: [
				text('L\'argomento deve essere positivo: ') + `${arg} > 0`,
				text('Il numeratore è positivo per ') + `x ${s > 0 ? '>' : '<'} ${r1}` + text(', il denominatore per ') + `x > ${r2}` + text('.'),
				text('La frazione è positiva dove hanno lo stesso segno:'),
				disTex(truth),
			],
			right: dom('giusta', truth),
			cands: [dom('scambiati', s > 0 ? between(num(lo), num(hi)) : outside(num(lo), num(hi))), dom('solo numeratore', onlyNum), dom('zero compreso', withZero)],
			extra: { base, s, r1, r2 },
		};
	});
}

// ---------------------------------------------------------------------------
// Level 7: the graph moved

function level7(rng: Rng): Build | null {
	const a = rng.pick([2, 3]);
	const h = intIn(rng, -6, 6, [0]);
	const k = intIn(rng, -2, 2, [0]);
	const base = q(a);
	const pair = (tag: string, asym: Rational, zero: Rational): Cand => ({
		tag,
		latex: `\\begin{gathered} x = ${asym.toLatex()} \\\\ ${zero.isInteger() ? `(${zero.toLatex()}, 0)` : `\\left(${zero.toLatex()}, 0\\right)`} \\end{gathered}`,
		values: [asym.toString(), zero.toString()],
	});
	const zero = q(h).add(rpow(base, -k));
	const arg = lin(1, -h);
	const right = pair('giusta', q(h), zero);
	return {
		form: h > 0 ? 'verso destra' : 'verso sinistra',
		prompt: "Trova l'asintoto verticale del grafico e il punto in cui il grafico taglia l'asse x.",
		problem: `y = ${logTex(base, arg, true)} ${k > 0 ? '+' : '-'} ${Math.abs(k)}`,
		solution: right.latex,
		steps: [
			text('L\'asintoto è dove l\'argomento vale zero: ') + `${arg} = 0` + text(', cioè ') + `x = ${h}`,
			text('Sull\'asse ') + 'x' + text(' l\'ordinata è zero: ') + `${logTex(base, arg, true)} = ${-k}`,
			`${arg} = ${powTex(base, -k)} = ${rpow(base, -k).toLatex()}`,
			`x = ${zero.toLatex()}`,
		],
		right,
		cands: [pair('segno', q(-h), q(-h).add(rpow(base, -k))), pair('senza k', q(h), q(h + 1)), pair('esponente', q(h), q(h).add(rpow(base, k)))],
		extra: { a, h, k },
	};
}

// ---------------------------------------------------------------------------
// The constraints of the specification

function levelErrors(s: { level: number; answer: { kind: string }; params: Record<string, unknown> }): string[] {
	const errs: string[] = [];
	const open = s.level === 1 || s.level === 4;
	if (open !== (s.answer.kind === 'number')) errs.push('tipo di risposta diverso da quello del livello');
	const p = s.params as Record<string, number>;
	if (s.level === 7 && (p.h === 0 || p.k === 0)) errs.push('livello 7: h e k diversi da zero');
	if (s.level === 6 && p.r1 === p.r2) errs.push('livello 6: due zeri distinti');
	return errs;
}

export default makeGenerator(
	ID,
	'Funzione logaritmica',
	{
		1: { label: 'Un punto del grafico', constraints: ['y = log_b x e un punto con una coordinata da trovare'] },
		2: { label: 'Il segno di un logaritmo', constraints: ['positivo, negativo, nullo o non esiste, da base e argomento'] },
		3: { label: 'Ordinare tre logaritmi', constraints: ['stessa base, maggiore o minore di 1, tre argomenti interi distinti'] },
		4: { label: 'Tra quali interi sta un logaritmo', constraints: ['n < log_a b < n + 1, con b intero o reciproco di un intero'] },
		5: { label: 'Dominio con argomento di primo grado', constraints: ['log(mx + n), con m anche negativo'] },
		6: { label: 'Dominio con argomento di secondo grado o fratto', constraints: ['±(x - r1)(x - r2) oppure (x - r1)/(x - r2), (r1 - x)/(x - r2)'] },
		7: { label: 'Grafico traslato: asintoto e zero', constraints: ['y = log_a (x - h) + k con h e k non nulli'] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 },
	levelErrors,
);
