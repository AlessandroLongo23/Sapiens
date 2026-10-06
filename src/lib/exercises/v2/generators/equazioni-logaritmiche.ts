/**
 * Equazioni logaritmiche. Spec: specs/exercises/equazioni-logaritmiche.md
 *
 * Seven levels in the order of lesson 126 (docs/lezioni/riscritte/126-equazioni-logaritmiche.md): one logarithm
 * equal to a number with an argument of first degree, then of second degree; two logarithms with the same base and
 * a solution to discard; the properties (sum, difference, a number to turn into a logarithm); a substitution;
 * exponential equations solved with a logarithm, in one step and after a substitution (these two are a multiple
 * choice from the start: their solutions are logarithms, which an open answer cannot be graded on). Built
 * backwards from the solutions. The wrong options are the mistakes of the lesson's warnings: a negative solution thrown away, the
 * conditions of existence forgotten or written after the properties, the logarithm of a sum.
 */
import type { Rng, SetAnswer } from '../types';
import { Rational, q } from '../rational';
import { type Build, type Val, intIn, intLog, lin, logHead, logTex, logVal, makeGenerator, num, powTex, quad, retry, rpow, setCand, solutionSet, text, valTex } from '../logaritmi';

export const ID = 'equazioni-logaritmiche';
const PROMPT = "Risolvi l'equazione.";

const setAnswer = (vals: Val[]): SetAnswer => {
	const s = solutionSet(vals);
	return { kind: 'set', values: s.values, latex: s.latex };
};
const nums = (...rs: (Rational | number)[]) => rs.map((r) => num(r));
/** The argument x + p in a logarithm: bare x, or (x + 3). */
const argLog = (base: Rational, m: number, n: number) => (m === 1 && n === 0 ? logTex(base, 'x') : logTex(base, lin(m, n), true));
const small = (r: Rational, max = 200) => Math.abs(r.num) <= max && r.den <= 12;
const sol = (vals: Val[]) => solutionSet(vals).latex;

// ---------------------------------------------------------------------------
// Level 1: log_a(mx + n) = c

function level1(rng: Rng): Build | null {
	const base = rng.pick([q(2), q(3), q(5), q(10), q(1, 2), q(1, 3)]);
	const c = rng.int(-2, 3);
	const K = rpow(base, c);
	if (Math.max(K.num, K.den) > 125) return null;
	const m = rng.pick([1, 1, 2, 3, -1, -2]);
	const n = intIn(rng, -9, 9, [0]);
	const x0 = K.sub(q(n)).div(q(m));
	if (!small(x0, 60) || x0.isZero()) return null;
	const arg = lin(m, n);
	const other = (v: Rational) => v.sub(q(n)).div(q(m));
	return {
		form: x0.sign() > 0 ? 'soluzione positiva' : 'soluzione negativa',
		prompt: PROMPT,
		problem: `${logTex(base, arg, true)} = ${c}`,
		solution: sol(nums(x0)),
		steps: [
			text('Per la definizione di logaritmo: ') + `${arg} = ${powTex(base, c)}`,
			`${arg} = ${K.toLatex()}`,
			`x = ${x0.toLatex()}`,
			text('Per questo valore l\'argomento vale ') + K.toLatex() + text(', che è positivo: la soluzione è accettabile.'),
		],
		answer: setAnswer(nums(x0)),
		right: setCand('giusta', nums(x0)),
		cands: [
			x0.sign() < 0 ? setCand('scartata perché negativa', []) : null,
			setCand('senza potenza', nums(other(q(c)))),
			setCand('prodotto', nums(other(base.mul(q(c))))),
			setCand('esponente opposto', nums(other(rpow(base, -c)))),
			setCand('opposto', nums(x0.neg())),
		],
		extra: { base: base.toString(), c, m, n },
	};
}

// ---------------------------------------------------------------------------
// Level 2: log_a(x^2 + bx + c) = k, both solutions good

function level2(rng: Rng): Build | null {
	const mixed = rng.next() < 0.7;
	return retry(() => {
		const a = rng.pick([2, 3, 5, 10]);
		const k = rng.int(0, 3);
		const K = a ** k;
		if (K > 125) return null;
		const r1 = mixed ? rng.int(-9, -1) : intIn(rng, -9, 8, [0]);
		const r2 = mixed ? rng.int(1, 9) : rng.int(r1 + 1, 9);
		if (r2 === 0 || r1 === -r2 || (!mixed && r1 < 0 !== r2 < 0)) return null;
		const b = -(r1 + r2);
		const c = r1 * r2 + K;
		if (Math.abs(c) > 150) return null;
		const arg = quad(1, b, c);
		return {
			form: mixed ? 'segni opposti' : 'stesso segno',
			prompt: PROMPT,
			problem: `${logTex(q(a), arg, true)} = ${k}`,
			solution: sol(nums(r1, r2)),
			steps: [
				text('Per la definizione di logaritmo: ') + `${arg} = ${powTex(q(a), k)}`,
				`${quad(1, b, r1 * r2)} = 0`,
				`x_1 = ${r1}, \\quad x_2 = ${r2}`,
				text('Per tutti e due i valori l\'argomento vale ') + `${K}` + text(', che è positivo: tutte e due le soluzioni sono accettabili, qualunque sia il loro segno.'),
			],
			answer: setAnswer(nums(r1, r2)),
			right: setCand('giusta', nums(r1, r2)),
			cands: [setCand('solo la maggiore', nums(r2)), setCand('segni cambiati', nums(-r1, -r2)), setCand('vuoto', []), setCand('solo la minore', nums(r1))],
			extra: { a, k, r1, r2 },
		};
	});
}

// ---------------------------------------------------------------------------
// Level 3: log_a f(x) = log_a g(x), f of second degree and g of first

function level3(rng: Rng): Build | null {
	const u = rng.next();
	const want = u < 0.6 ? 1 : u < 0.85 ? 2 : 0;
	return retry(() => {
		const base = rng.pick([q(2), q(3), q(5), q(10)]);
		const r1 = rng.int(-8, 7);
		const r2 = rng.int(r1 + 1, 8);
		const m = rng.pick([1, 2, 3, 4, -1, -2, -3]);
		const n = rng.int(-9, 9);
		const g1 = m * r1 + n;
		const g2 = m * r2 + n;
		if (g1 === 0 || g2 === 0) return null;
		const good = [r1, r2].filter((r) => m * r + n > 0);
		if (good.length !== want) return null;
		const b = m - (r1 + r2);
		const c = n + r1 * r2;
		if (Math.abs(b) > 20 || Math.abs(c) > 60 || (b === 0 && c === 0)) return null;
		const f = quad(1, b, c);
		const g = lin(m, n);
		const checkLine = (r: number) => text('Per ') + `x = ${r}` + text(' gli argomenti valgono ') + `${m * r + n}` + (m * r + n > 0 ? text(': positivi, la soluzione è accettabile.') : text(': negativi, la soluzione si scarta.'));
		return {
			form: want === 1 ? 'una scartata' : want === 2 ? 'due accettabili' : 'nessuna accettabile',
			prompt: PROMPT,
			problem: `${logTex(base, f, true)} = ${logTex(base, g, true)}`,
			solution: sol(nums(...good)),
			steps: [text('Due logaritmi con la stessa base sono uguali se lo sono gli argomenti: ') + `${f} = ${g}`, `${quad(1, -(r1 + r2), r1 * r2)} = 0`, `x_1 = ${r1}, \\quad x_2 = ${r2}`, checkLine(r1), checkLine(r2)],
			answer: setAnswer(nums(...good)),
			right: setCand('giusta', nums(...good)),
			cands: [setCand('senza condizioni', nums(r1, r2)), setCand('solo la minore', nums(r1)), setCand('solo la maggiore', nums(r2)), setCand('vuoto', [])],
			extra: { base: base.toString(), r1, r2, m, n },
		};
	});
}

// ---------------------------------------------------------------------------
// Level 4: the properties

function level4(rng: Rng): Build | null {
	const u = rng.next();
	return retry(() => {
		if (u < 0.4) {
			// log_a(x + p) + log_a(x + q) = c, with (v + p)(v + q) = a^c at the good root v
			const a = rng.pick([2, 3, 6, 10, 12]);
			const c = rng.int(1, 3);
			const K = a ** c;
			if (K > 150) return null;
			const w1 = rng.int(1, K);
			if (K % w1 !== 0 || w1 * w1 >= K) return null;
			const w2 = K / w1;
			const v = rng.int(-6, 9);
			const [p, qq] = rng.next() < 0.5 ? [w1 - v, w2 - v] : [w2 - v, w1 - v];
			if (Math.abs(p) > 15 || Math.abs(qq) > 15) return null;
			const other = -(p + qq) - v;
			const base = q(a);
			const lhs = `${argLog(base, 1, p)} + ${argLog(base, 1, qq)}`;
			const ce = Math.max(-p, -qq);
			const summed = q(K - p - qq, 2);
			return {
				form: 'somma',
				prompt: PROMPT,
				problem: `${lhs} = ${c}`,
				solution: sol(nums(v)),
				steps: [
					text('C.E.: ') + `x > ${-p}` + text(' e ') + `x > ${-qq}` + text(', cioè ') + `x > ${ce}`,
					text('La somma di due logaritmi è il logaritmo del prodotto: ') + `${lin(1, p) === 'x' ? 'x' : `(${lin(1, p)})`}${lin(1, qq) === 'x' ? 'x' : `(${lin(1, qq)})`} = ${powTex(base, c)}`,
					`${quad(1, p + qq, p * qq - K)} = 0`,
					`x_1 = ${Math.min(v, other)}, \\quad x_2 = ${Math.max(v, other)}`,
					text('Solo ') + `x = ${v}` + text(' rispetta le C.E.'),
				],
				answer: setAnswer(nums(v)),
				right: setCand('giusta', nums(v)),
				cands: [setCand('senza condizioni', nums(v, other)), setCand('scartata la buona', nums(other)), setCand('argomenti sommati', nums(summed)), setCand('vuoto', [])],
				extra: { a, c, p, q: qq },
			};
		}
		const a = rng.pick([2, 3, 5]);
		const c = rng.int(1, a === 2 ? 3 : 2);
		const K = a ** c;
		const base = q(a);
		if (u < 0.75) {
			// log_a(x + p) - log_a(x + q) = c: x + p = K(x + q), with w = x0 + q > 0
			const qq = intIn(rng, -8, 8, [0]);
			const w = rng.int(1, 4);
			const p = qq + (K - 1) * w;
			const x0 = w - qq;
			if (Math.abs(p) > 30 || p === 0) return null;
			const wrongSide = q(qq - K * p, K - 1);
			const noPower = c !== 1 ? q(p - c * qq, c - 1) : null;
			return {
				form: 'differenza',
				prompt: PROMPT,
				problem: `${argLog(base, 1, p)} - ${argLog(base, 1, qq)} = ${c}`,
				solution: sol(nums(x0)),
				steps: [
					text('C.E.: ') + `x > ${-p}` + text(' e ') + `x > ${-qq}` + text(', cioè ') + `x > ${Math.max(-p, -qq)}`,
					text('La differenza è il logaritmo del quoziente: ') + `\\frac{${lin(1, p)}}{${lin(1, qq)}} = ${powTex(base, c)}`,
					`${lin(1, p)} = ${K}(${lin(1, qq)})`,
					`x = ${x0}`,
					text('Il valore rispetta le C.E.'),
				],
				answer: setAnswer(nums(x0)),
				right: setCand('giusta', nums(x0)),
				cands: [
					small(wrongSide) ? setCand('potenza dalla parte sbagliata', nums(wrongSide)) : null,
					noPower && small(noPower) ? setCand('senza potenza', nums(noPower)) : null,
					setCand('vuoto', []),
					x0 !== 0 ? setCand('opposto', nums(-x0)) : null,
					setCand('vicino', nums(x0 + 1)),
				],
				extra: { a, c, p, q: qq },
			};
		}
		// log_a(mx + n) = c + log_a(x + q): mx + n = K(x + q)
		const m = intIn(rng, 1, 5, [K]);
		const x0 = intIn(rng, -6, 9, [0]);
		const w = rng.int(1, 4);
		const qq = w - x0;
		const n = K * w - m * x0;
		if (Math.abs(n) > 30 || n === 0 || qq === 0) return null;
		const added = m !== 1 ? q(c + qq - n, m - 1) : null;
		const noPower = m !== c ? q(c * qq - n, m - c) : null;
		return {
			form: 'numero',
			prompt: PROMPT,
			problem: `${argLog(base, m, n)} = ${c} + ${argLog(base, 1, qq)}`,
			solution: sol(nums(x0)),
			steps: [
				text('C.E.: ') + `${lin(m, n)} > 0` + text(' e ') + `${lin(1, qq)} > 0`,
				text('Scrivi il numero come logaritmo: ') + `${c} = ${logTex(base, `${K}`)}`,
				`${argLog(base, m, n)} = ${logTex(base, `[${K}(${lin(1, qq)})]`)}`,
				`${lin(m, n)} = ${lin(K, K * qq)}`,
				`x = ${x0}`,
				text('Il valore rispetta le C.E.'),
			],
			answer: setAnswer(nums(x0)),
			right: setCand('giusta', nums(x0)),
			cands: [
				added && small(added) ? setCand('numero sommato', nums(added)) : null,
				noPower && small(noPower) ? setCand('senza potenza', nums(noPower)) : null,
				setCand('vuoto', []),
				setCand('opposto', nums(-x0)),
				setCand('vicino', nums(x0 + 1)),
			],
			extra: { a, c, m, n, q: qq },
		};
	});
}

// ---------------------------------------------------------------------------
// Level 5: a substitution

/** \log_2^2 x - 3\log_2 x + 2: t^2 + Bt + C with t the logarithm. */
function logTrinomial(base: Rational, B: number, C: number): string {
	const head = logHead(base);
	const sq = head === '\\log' ? '\\log^2 x' : `${head}^2 x`;
	const lg = `${head} x`;
	let out = sq;
	if (B !== 0) out += ` ${B < 0 ? '-' : '+'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}${lg}`;
	if (C !== 0) out += ` ${C < 0 ? '-' : '+'} ${Math.abs(C)}`;
	return out;
}

function level5(rng: Rng): Build | null {
	const a = rng.pick([2, 3, 10]);
	const t1 = rng.int(-3, 2);
	const t2 = rng.int(t1 + 1, 3);
	if (t1 === -t2) return null;
	const base = q(a);
	const [x1, x2] = [rpow(base, t1), rpow(base, t2)];
	if (Math.max(x2.num, x1.den) > 1000) return null;
	const B = -(t1 + t2);
	const C = t1 * t2;
	return {
		form: t1 < 0 ? 'un valore negativo' : 'valori non negativi',
		prompt: PROMPT,
		problem: `${logTrinomial(base, B, C)} = 0`,
		solution: sol(nums(x1, x2)),
		steps: [
			text('C.E.: ') + 'x > 0' + text('. Poni ') + `t = ${logTex(base, 'x')}` + text(':'),
			`${quad(1, B, C).replace(/x/g, 't')} = 0`,
			`t_1 = ${t1}, \\quad t_2 = ${t2}`,
			text('Torna alla ') + 'x' + text(': ') + `x = ${powTex(base, t1)} = ${x1.toLatex()}` + text(' oppure ') + `x = ${powTex(base, t2)} = ${x2.toLatex()}`,
			text('Un logaritmo può valere qualunque numero: tutti e due i valori sono accettabili.'),
		],
		answer: setAnswer(nums(x1, x2)),
		right: setCand('giusta', nums(x1, x2)),
		cands: [
			setCand('non torna alla x', nums(t1, t2)),
			t1 < 0 ? setCand('valore negativo scartato', nums(x2)) : null,
			setCand('prodotto', nums(a * t1, a * t2)),
			setCand('esponenti opposti', nums(rpow(base, -t1), rpow(base, -t2))),
			setCand('solo il maggiore', nums(x2)),
		],
		extra: { a, t1, t2 },
	};
}

// ---------------------------------------------------------------------------
// Level 6: a^(x + k) = b

/** 2^x, 3^{x + 1}. */
const expTex = (a: number, k: number) => (k === 0 ? `${a}^x` : `${a}^{${lin(1, k)}}`);

function level6(rng: Rng): Build | null {
	const u = rng.next();
	return retry(() => {
		const a = rng.pick([2, 3, 5, 7, 10]);
		const base = q(a);
		const k = u < 0.3 ? 0 : intIn(rng, -4, 4, [0]);
		if (u >= 0.85) {
			const b = -rng.pick([2, 3, 5, 6, 7].filter((w) => intLog(base, q(w)) === null));
			return {
				form: 'impossibile',
				prompt: PROMPT,
				problem: `${expTex(a, k)} = ${b}`,
				solution: sol([]),
				steps: [text('Una potenza con la base positiva è sempre positiva: non può valere ') + `${b}` + text('.'), text('L\'equazione è impossibile.')],
				right: setCand('giusta', []),
				cands: [setCand('segno ignorato', [logVal(base, q(-b), -k)]), setCand('logaritmo del reciproco', [logVal(base, q(1, -b), -k)]), setCand('quoziente', nums(q(b, a).sub(q(k))))],
				extra: { a, k, b },
			};
		}
		const b = rng.int(2, 40);
		if (intLog(base, q(b)) !== null || b === a) return null;
		const right = [logVal(base, q(b), -k)];
		return {
			form: k === 0 ? 'esponente x' : 'esponente x + k',
			prompt: PROMPT,
			problem: `${expTex(a, k)} = ${b}`,
			solution: sol(right),
			steps: [
				`${b}` + text(' non è una potenza di ') + `${a}` + text(' con esponente intero: serve il logaritmo.'),
				text('Per la definizione di logaritmo: ') + `${lin(1, k)} = ${logTex(base, `${b}`)}`,
				...(k === 0 ? [] : [`x = ${valTex(right[0])}`]),
			],
			right: setCand('giusta', right),
			cands: [setCand('base e argomento scambiati', [logVal(q(b), base, -k)]), k !== 0 ? setCand('segno di k', [logVal(base, q(b), k)]) : null, setCand('quoziente', nums(q(b, a).sub(q(k)))), setCand('vuoto', [])],
			extra: { a, k, b },
		};
	});
}

// ---------------------------------------------------------------------------
// Level 7: a^(2x) - (u + v) a^x + uv = 0

function level7(rng: Rng): Build | null {
	const discard = rng.next() < 0.35;
	return retry(() => {
		const a = rng.pick([2, 3]);
		const base = q(a);
		const j = rng.int(0, 3);
		const u = a ** j;
		const free = rng.pick([2, 3, 5, 6, 7].filter((w) => intLog(base, q(w)) === null));
		const v = discard ? -free : free;
		const s = u + v;
		const p = u * v;
		if (s === 0 || Math.abs(p) > 200) return null;
		const mid = `${s > 0 ? '-' : '+'} ${Math.abs(s) === 1 ? '' : `${Math.abs(s)} \\cdot `}${a}^x`;
		const problem = `${a * a}^x ${mid} ${p > 0 ? '+' : '-'} ${Math.abs(p)} = 0`;
		const right: Val[] = discard ? nums(j) : [num(j), logVal(base, q(v))];
		const steps = [
			text('Poiché ') + `${a * a}^x = \\left(${a}^x\\right)^2` + text(', poni ') + `t = ${a}^x` + text(', con ') + 't > 0' + text(':'),
			`${quad(1, -s, p).replace(/x/g, 't')} = 0`,
			`t_1 = ${Math.min(u, v)}, \\quad t_2 = ${Math.max(u, v)}`,
			text('Da ') + `${a}^x = ${u}` + text(' ottieni ') + `x = ${j}` + text('.'),
			discard ? text('Il valore ') + `t = ${v}` + text(' è negativo e si scarta: una potenza è sempre positiva.') : text('Da ') + `${a}^x = ${v}` + text(' ottieni ') + `x = ${logTex(base, `${v}`)}` + text('.'),
		];
		return {
			form: discard ? 'un valore scartato' : 'un logaritmo',
			prompt: PROMPT,
			problem,
			solution: sol(right),
			steps,
			right: setCand('giusta', right),
			cands: discard
				? [setCand('non torna alla x', nums(u, v)), setCand('valore negativo non scartato', [num(j), logVal(base, q(-v))]), setCand('quoziente', nums(j, q(v, a))), setCand('vuoto', [])]
				: [setCand('non torna alla x', nums(u, v)), setCand('solo la soluzione intera', nums(j)), setCand('base e argomento scambiati', [num(j), logVal(q(v), base)]), setCand('quoziente', nums(j, q(v, a)))],
			extra: { a, j, v },
		};
	});
}

// ---------------------------------------------------------------------------
// The constraints of the specification

function levelErrors(s: { level: number; answer: { kind: string }; params: Record<string, unknown> }): string[] {
	const errs: string[] = [];
	// levels 6 and 7 have logarithms among the solutions, which the grader of open answers does not read: a choice from the start
	if (s.answer.kind !== (s.level >= 6 ? 'choice' : 'set')) errs.push('tipo di risposta diverso da quello del livello');
	const p = s.params as Record<string, number>;
	if (s.level === 2 && p.r1 === -p.r2) errs.push('livello 2: soluzioni opposte');
	if (s.level === 5 && p.t1 >= p.t2) errs.push('livello 5: due valori distinti di t');
	return errs;
}

export default makeGenerator(
	ID,
	'Equazioni logaritmiche',
	{
		1: { label: 'Un logaritmo uguale a un numero', constraints: ['log_a(mx + n) = c, soluzione anche negativa'] },
		2: { label: 'Argomento di secondo grado', constraints: ['log_a(x^2 + bx + c) = k, due soluzioni intere accettabili'] },
		3: { label: 'Due logaritmi con la stessa base', constraints: ['log_a(x^2 + bx + c) = log_a(mx + n): una, due o nessuna soluzione accettabile'] },
		4: { label: 'Equazioni con le proprietà', constraints: ['somma, differenza, un numero da scrivere come logaritmo'] },
		5: { label: 'Equazioni con una sostituzione', constraints: ['log_a^2 x + B log_a x + C = 0 con t intero'] },
		6: { label: 'Esponenziali con i logaritmi', constraints: ['a^(x + k) = b con b non potenza di a, oppure b negativo'] },
		7: { label: 'Esponenziali con sostituzione e logaritmo', constraints: ['a^(2x) - (u + v) a^x + uv = 0 con u potenza di a'] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 },
	levelErrors,
);
