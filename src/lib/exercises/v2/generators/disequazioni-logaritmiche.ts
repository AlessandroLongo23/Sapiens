/**
 * Disequazioni logaritmiche. Spec: specs/exercises/disequazioni-logaritmiche.md
 *
 * Seven levels in the order of lesson 127 (docs/lezioni/riscritte/127-disequazioni-logaritmiche.md): a logarithm
 * compared with a number, base greater than 1 and then smaller than 1; an argument of second degree; two
 * logarithms with the same base; the properties; a substitution; exponential inequalities solved with a logarithm.
 * The answer is a union of intervals, so every level is a multiple choice, written with the intervals of the
 * lesson. The solution is the common part of the conditions of existence and of the inequality between the
 * arguments, computed here on intervals; the wrong options are the mistakes of the lesson's warnings: the
 * condition of existence forgotten, the sign not turned with a base smaller than 1, the ends included or not.
 */
import type { Rng } from '../types';
import { Rational, q } from '../rational';
import {
	ALL,
	type Build,
	FLIP,
	type Iv,
	OPS,
	OP_TEX,
	type Op,
	TOGGLE,
	type Val,
	above,
	between,
	disTex,
	greater,
	intIn,
	intLog,
	intersect,
	ivCand,
	ivsKey,
	lin,
	logHead,
	logTex,
	logVal,
	makeGenerator,
	num,
	outside,
	powTex,
	quad,
	ray,
	retry,
	rpow,
	setTex,
	text,
} from '../logaritmi';

export const ID = 'disequazioni-logaritmiche';
const PROMPT = 'Risolvi la disequazione.';

/** m x + n op v: x op (v - n)/m, with the sign turned when m < 0. */
const linRay = (m: number, n: number, op: Op, v: Rational): Iv[] => ray(m > 0 ? op : FLIP[op], num(v.sub(q(n)).div(q(m))));
const positive = (m: number, n: number) => linRay(m, n, '>', q(0));
const nice = (ivs: Iv[], maxDen = 6) => ivs.every((iv) => [iv.lo, iv.hi].every((e) => !e || (e.p.den <= maxDen && Math.abs(e.p.num) <= 150)));
const baseWord = (big: boolean, op: Op, eff: Op) =>
	big ? text('La base è maggiore di ') + '1' + text(': il verso si conserva, ') + OP_TEX[op] : text('La base è minore di ') + '1' + text(': il verso si rovescia, da ') + OP_TEX[op] + text(' a ') + OP_TEX[eff];
const argLog = (base: Rational, m: number, n: number) => (m === 1 && n === 0 ? logTex(base, 'x') : logTex(base, lin(m, n), true));
const cand = (tag: string, ivs: Iv[]) => ivCand(tag, ivs);

function finish(form: string, problem: string, steps: string[], truth: Iv[], cands: [string, Iv[]][], extra: Record<string, unknown>): Build {
	return { form, prompt: PROMPT, problem, solution: setTex(truth), steps: [...steps, disTex(truth)], right: cand('giusta', truth), cands: cands.map(([t, ivs]) => cand(t, ivs)), extra };
}

// ---------------------------------------------------------------------------
// Levels 1 and 2: log_a(mx + n) op c

function oneLog(rng: Rng, big: boolean): Build | null {
	const op = rng.pick(OPS);
	return retry(() => {
		const base = big ? q(rng.pick([2, 3, 5, 10])) : q(1, rng.pick([2, 3, 4, 5, 10]));
		const c = rng.int(-3, 3);
		const K = rpow(base, c);
		if (Math.max(K.num, K.den) > 125) return null;
		const m = rng.pick([1, 1, 2, 3, -1, -2]);
		const n = intIn(rng, -9, 9, [0]);
		const eff = big ? op : FLIP[op];
		const D = positive(m, n);
		const truth = intersect(D, linRay(m, n, eff, K));
		const cands: [string, Iv[]][] = [
			['senza C.E.', linRay(m, n, eff, K)],
			['verso', intersect(D, linRay(m, n, FLIP[eff], K))],
			['estremi', intersect(D, linRay(m, n, TOGGLE[eff], K))],
			['senza potenza', linRay(m, n, eff, q(c))],
			['verso senza C.E.', linRay(m, n, FLIP[eff], K)],
			['solo C.E.', D],
		];
		if (!truth.length || !nice([...truth, ...cands.flatMap((x) => x[1])])) return null;
		const arg = lin(m, n);
		const bounded = !greater(eff);
		return finish(
			greater(op) ? 'verso maggiore' : 'verso minore',
			`${logTex(base, arg, true)} ${OP_TEX[op]} ${c}`,
			[
				text('Scrivi il numero come logaritmo: ') + `${c} = ${logTex(base, K.toLatex())}`,
				baseWord(big, op, eff),
				bounded ? text('L\'argomento è limitato solo dall\'alto: serve anche la condizione di esistenza. ') + `0 < ${arg} ${OP_TEX[eff]} ${K.toLatex()}` : `${arg} ${OP_TEX[eff]} ${K.toLatex()}` + text(': la condizione di esistenza è già compresa.'),
			],
			truth,
			cands,
			{ base: base.toString(), c, m, n, op },
		);
	});
}

// ---------------------------------------------------------------------------
// Level 3: an argument of second degree

function level3(rng: Rng): Build | null {
	const op = rng.pick(OPS);
	return retry(() => {
		const base = rng.pick([q(2), q(3), q(5), q(10), q(1, 2), q(1, 3), q(1, 4)]);
		const big = base.compare(q(1)) > 0;
		const c = rng.int(-3, 3);
		const K = rpow(base, c);
		if (!K.isInteger() || K.num > 30) return null;
		// (x - s1)(x - s2) - K = (x - r1)(x - r2), with s1 = r1 + d, s2 = r2 - d and K = d(r2 - r1 - d)
		const d = rng.int(1, 3);
		if (K.num % d !== 0) return null;
		const L = K.num / d + d;
		if (L <= 2 * d) return null;
		const r1 = rng.int(-8, 6);
		const r2 = r1 + L;
		if (r2 > 10) return null;
		const [s1, s2] = [r1 + d, r2 - d];
		const [b, c0] = [-(s1 + s2), s1 * s2];
		const eff = big ? op : FLIP[op];
		const D = outside(num(s1), num(s2));
		const zone = (o: Op) => (greater(o) ? outside(num(r1), num(r2), o === '>=') : between(num(r1), num(r2), o === '<=', o === '<='));
		const truth = intersect(D, zone(eff));
		const arg = quad(1, b, c0);
		return finish(
			greater(eff) ? 'valori esterni' : 'due intervalli',
			`${logTex(base, arg, true)} ${OP_TEX[op]} ${c}`,
			[
				text('Scrivi il numero come logaritmo: ') + `${c} = ${logTex(base, K.toLatex())}`,
				baseWord(big, op, eff),
				greater(eff) ? `${arg} ${OP_TEX[eff]} ${K.num}` + text(': la condizione di esistenza è già compresa.') : text('Serve anche la condizione di esistenza: ') + `0 < ${arg} ${OP_TEX[eff]} ${K.num}`,
				`${arg} > 0` + text(' per ') + disTex(D),
				`${quad(1, b, c0 - K.num)} ${OP_TEX[eff]} 0` + text(' per ') + disTex(zone(eff)),
			],
			truth,
			[
				['senza C.E.', zone(eff)],
				['verso', intersect(D, zone(FLIP[eff]))],
				['estremi', intersect(D, zone(TOGGLE[eff]))],
				['verso senza C.E.', zone(FLIP[eff])],
				['solo C.E.', D],
			],
			{ base: base.toString(), c, r1, r2, d, op },
		);
	});
}

// ---------------------------------------------------------------------------
// Level 4: two logarithms with the same base

function level4(rng: Rng): Build | null {
	const big = rng.next() < 0.5;
	const op = rng.pick(OPS);
	return retry(() => {
		const base = big ? q(rng.pick([2, 3, 5, 10])) : q(1, rng.pick([2, 3, 5]));
		const m1 = rng.pick([1, 1, 2, 3, -1]);
		const m2 = rng.pick([1, 2, 3, -1, -2].filter((v) => v !== m1));
		const n1 = rng.int(-9, 9);
		const n2 = rng.int(-9, 9);
		if ((m1 === 1 && n1 === 0) || n2 === 0 || n1 === 0) return null;
		const eff = big ? op : FLIP[op];
		const D1 = positive(m1, n1);
		const D = intersect(D1, positive(m2, n2));
		const R = (o: Op) => linRay(m1 - m2, n1 - n2, o, q(0));
		const truth = intersect(D, R(eff));
		const cands: [string, Iv[]][] = [
			['senza C.E.', R(eff)],
			['verso', intersect(D, R(FLIP[eff]))],
			['estremi', intersect(D, R(TOGGLE[eff]))],
			['una sola C.E.', intersect(D1, R(eff))],
			['solo C.E.', D],
		];
		if (!truth.length || !nice([...truth, ...cands.flatMap((x) => x[1])], 4) || !D.length) return null;
		const [f, g] = [lin(m1, n1), lin(m2, n2)];
		return finish(
			big ? 'base maggiore di 1' : 'base minore di 1',
			`${logTex(base, f, true)} ${OP_TEX[op]} ${logTex(base, g, true)}`,
			[
				text('C.E.: ') + `${f} > 0` + text(' e ') + `${g} > 0` + text(', cioè ') + disTex(D),
				baseWord(big, op, eff),
				`${f} ${OP_TEX[eff]} ${g}` + text(', cioè ') + disTex(R(eff)),
				text('A sistema con le C.E.:'),
			],
			truth,
			cands,
			{ base: base.toString(), m1, n1, m2, n2, op },
		);
	});
}

// ---------------------------------------------------------------------------
// Level 5: the properties

function level5(rng: Rng): Build | null {
	const sum = rng.next() < 0.55;
	// with a difference and a base greater than 1, only > and ≥ give an answer that is neither the conditions of
	// existence alone nor the inequality alone
	const op = sum ? rng.pick(OPS) : rng.pick<Op>(['>', '>=']);
	return retry(() => {
		const a = rng.pick([2, 3, 5, 10]);
		const base = q(a);
		const c = rng.int(1, 3);
		const K = a ** c;
		if (K > 125) return null;
		if (sum) {
			const w1 = rng.int(1, K);
			if (K % w1 !== 0 || w1 * w1 >= K) return null;
			const w2 = K / w1;
			const v = rng.int(-6, 9);
			const [p, qq] = rng.next() < 0.5 ? [w1 - v, w2 - v] : [w2 - v, w1 - v];
			if (Math.abs(p) > 15 || Math.abs(qq) > 15) return null;
			const other = -(p + qq) - v;
			const D = above(num(Math.max(-p, -qq)));
			const zone = (o: Op) => (greater(o) ? outside(num(other), num(v), o === '>=') : between(num(other), num(v), o === '<=', o === '<='));
			const truth = intersect(D, zone(op));
			const added = intersect(D, linRay(2, p + qq, op, q(K)));
			if (!nice(added, 2)) return null;
			const lhs = `${argLog(base, 1, p)} + ${argLog(base, 1, qq)}`;
			const par = (n: number) => (n === 0 ? 'x' : `(${lin(1, n)})`);
			return finish(
				'somma',
				`${lhs} ${OP_TEX[op]} ${c}`,
				[
					text('C.E.: ') + `x > ${-p}` + text(' e ') + `x > ${-qq}` + text(', cioè ') + disTex(D),
					text('Unisci i logaritmi e scrivi ') + `${c} = ${logTex(base, `${K}`)}` + text(': la base è maggiore di ') + '1' + text(' e il verso si conserva.'),
					`${par(p)}${par(qq)} ${OP_TEX[op]} ${K}`,
					`${quad(1, p + qq, p * qq - K)} ${OP_TEX[op]} 0` + text(' per ') + disTex(zone(op)),
					text('A sistema con le C.E.:'),
				],
				truth,
				[
					['senza C.E.', zone(op)],
					['verso', intersect(D, zone(FLIP[op]))],
					['estremi', intersect(D, zone(TOGGLE[op]))],
					['argomenti sommati', added],
					['solo C.E.', D],
				],
				{ a, c, p, q: qq, op },
			);
		}
		// log_a(x + p) - log_a(x + q) op c: x + p op K(x + q), with both arguments positive
		const p = intIn(rng, -9, 12, [0]);
		const qq = intIn(rng, -9, 9, [0, p]);
		const D = intersect(positive(1, p), positive(1, qq));
		const R = (o: Op) => linRay(1 - K, p - K * qq, o, q(0));
		const truth = intersect(D, R(op));
		const wrongSide = intersect(D, linRay(K - 1, K * p - qq, op, q(0)));
		const cands: [string, Iv[]][] = [
			['senza C.E.', R(op)],
			['verso', intersect(D, R(FLIP[op]))],
			['estremi', intersect(D, R(TOGGLE[op]))],
			['potenza dalla parte sbagliata', wrongSide],
			['solo C.E.', D],
		];
		if (!truth.length || !nice([...truth, ...cands.flatMap((x) => x[1])], 4)) return null;
		// the answer must need the conditions of existence, or the level is a linear inequality
		if (ivsKey(truth) === ivsKey(R(op)) || ivsKey(truth) === ivsKey(D)) return null;
		return finish(
			'differenza',
			`${argLog(base, 1, p)} - ${argLog(base, 1, qq)} ${OP_TEX[op]} ${c}`,
			[
				text('C.E.: ') + `x > ${-p}` + text(' e ') + `x > ${-qq}` + text(', cioè ') + disTex(D),
				text('Porta a destra il logaritmo con il meno e scrivi ') + `${c} = ${logTex(base, `${K}`)}` + text(':'),
				`${argLog(base, 1, p)} ${OP_TEX[op]} ${logTex(base, `[${K}(${lin(1, qq)})]`)}`,
				text('La base è maggiore di ') + '1' + text(': ') + `${lin(1, p)} ${OP_TEX[op]} ${lin(K, K * qq)}` + text(', cioè ') + disTex(R(op)),
				text('A sistema con le C.E.:'),
			],
			truth,
			cands,
			{ a, c, p, q: qq, op },
		);
	});
}

// ---------------------------------------------------------------------------
// Level 6: a substitution

function logTrinomial(base: Rational, B: number, C: number): string {
	const head = logHead(base);
	let out = head === '\\log' ? '\\log^2 x' : `${head}^2 x`;
	if (B !== 0) out += ` ${B < 0 ? '-' : '+'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}${head} x`;
	if (C !== 0) out += ` ${C < 0 ? '-' : '+'} ${Math.abs(C)}`;
	return out;
}

function level6(rng: Rng): Build | null {
	const op = rng.pick(OPS);
	return retry(() => {
		const base = rng.pick([q(2), q(3), q(10), q(1, 2)]);
		const t1 = rng.int(-3, 2);
		const t2 = rng.int(t1 + 1, 3);
		if (t1 === -t2) return null;
		const xs = [rpow(base, t1), rpow(base, t2)].sort((u, v) => u.compare(v));
		if (Math.max(xs[1].num, xs[0].den) > 1000) return null;
		const [lo, hi] = xs.map((v) => num(v));
		const zone = (o: Op, a: Val, b: Val) => (greater(o) ? outside(a, b, o === '>=') : between(a, b, o === '<=', o === '<='));
		const D = above(num(0));
		const truth = intersect(D, zone(op, lo, hi));
		const [B, C] = [-(t1 + t2), t1 * t2];
		const tZone = disTex(zone(op, num(t1), num(t2))).replace(/\bx\b/g, 't');
		return finish(
			greater(op) ? 'valori esterni' : 'valori interni',
			`${logTrinomial(base, B, C)} ${OP_TEX[op]} 0`,
			[
				text('C.E.: ') + 'x > 0' + text('. Poni ') + `t = ${logTex(base, 'x')}` + text(':'),
				`${quad(1, B, C).replace(/x/g, 't')} ${OP_TEX[op]} 0` + text(' per ') + tZone,
				text('Torna alla ') + 'x' + text(', con ') + `${powTex(base, t1)} = ${rpow(base, t1).toLatex()}` + text(' e ') + `${powTex(base, t2)} = ${rpow(base, t2).toLatex()}` + (base.compare(q(1)) < 0 ? text('; la base è minore di ') + '1' + text(' e i versi si rovesciano.') : text('.')),
			],
			truth,
			[
				['non torna alla x', zone(op, num(t1), num(t2))],
				['senza C.E.', zone(op, lo, hi)],
				['verso', intersect(D, zone(FLIP[op], lo, hi))],
				['estremi', intersect(D, zone(TOGGLE[op], lo, hi))],
				['verso senza C.E.', zone(FLIP[op], lo, hi)],
			],
			{ base: base.toString(), t1, t2, op },
		);
	});
}

// ---------------------------------------------------------------------------
// Level 7: a^(x + k) op b

/** 2^x, 3^{x + 1}, \left(\frac{1}{2}\right)^{x - 2}. */
function expTex(base: Rational, k: number): string {
	const b = base.isInteger() ? `${base.num}` : `\\left(${base.toLatex()}\\right)`;
	return k === 0 ? `${b}^x` : `${b}^{${lin(1, k)}}`;
}

function level7(rng: Rng): Build | null {
	const u = rng.next();
	const op = rng.pick(OPS);
	return retry(() => {
		const big = u < 0.45 || (u >= 0.8 && rng.next() < 0.5);
		const base = big ? q(rng.pick([2, 3, 5, 10])) : q(1, rng.pick([2, 3]));
		const k = rng.next() < 0.3 ? 0 : intIn(rng, -4, 4, [0]);
		const free = rng.int(2, 30);
		if (intLog(base, q(free)) !== null) return null;
		const eff = big ? op : FLIP[op];
		const v = logVal(base, q(free), -k);
		if (u >= 0.8) {
			const truth = greater(op) ? ALL : [];
			return finish(
				'secondo membro negativo',
				`${expTex(base, k)} ${OP_TEX[op]} ${-free}`,
				[text('Una potenza con la base positiva è sempre positiva, quindi è maggiore di ogni numero negativo.'), greater(op) ? text('La disequazione è vera per ogni ') + 'x' + text('.') : text('La disequazione è impossibile.')],
				truth,
				[
					['caso opposto', greater(op) ? [] : ALL],
					['segno ignorato', ray(eff, v)],
					['segno ignorato e verso', ray(FLIP[eff], v)],
				],
				{ base: base.toString(), k, b: -free, op },
			);
		}
		const truth = ray(eff, v);
		const lg = logTex(base, `${free}`);
		return finish(
			big ? 'base maggiore di 1' : 'base minore di 1',
			`${expTex(base, k)} ${OP_TEX[op]} ${free}`,
			[`${free} = ${base.isInteger() ? base.num : `\\left(${base.toLatex()}\\right)`}^{${lg}}` + text(': ora le basi sono uguali.'), baseWord(big, op, eff), ...(k === 0 ? [] : [`${lin(1, k)} ${OP_TEX[eff]} ${lg}`])],
			truth,
			[
				['verso', ray(FLIP[eff], v)],
				['estremi', ray(TOGGLE[eff], v)],
				['base e argomento scambiati', ray(eff, logVal(q(free), base, -k))],
				['quoziente', ray(eff, num(q(free).div(base).sub(q(k))))],
				['segno di k', ray(eff, logVal(base, q(free), k))],
			],
			{ base: base.toString(), k, b: free, op },
		);
	});
}

// ---------------------------------------------------------------------------
// The constraints of the specification

function levelErrors(s: { level: number; answer: { kind: string }; params: Record<string, unknown> }): string[] {
	const errs: string[] = [];
	if (s.answer.kind !== 'choice') errs.push('la risposta deve essere a scelta multipla');
	const p = s.params as Record<string, string>;
	if (s.level <= 2 && typeof p.base === 'string') {
		const big = Rational.parse(p.base).compare(q(1)) > 0;
		if (big !== (s.level === 1)) errs.push('livelli 1 e 2: base maggiore di 1 al primo, minore di 1 al secondo');
	}
	return errs;
}

export default makeGenerator(
	ID,
	'Disequazioni logaritmiche',
	{
		1: { label: 'Un logaritmo e un numero, base maggiore di 1', constraints: ['log_a(mx + n) op c con a > 1, tutti i versi'] },
		2: { label: 'Un logaritmo e un numero, base minore di 1', constraints: ['log_a(mx + n) op c con 0 < a < 1'] },
		3: { label: 'Argomento di secondo grado', constraints: ['log_a(x^2 + bx + c) op k, zeri interi'] },
		4: { label: 'Due logaritmi con la stessa base', constraints: ['log_a(m1 x + n1) op log_a(m2 x + n2), base maggiore o minore di 1'] },
		5: { label: 'Disequazioni con le proprietà', constraints: ['somma o differenza di logaritmi confrontata con un numero, base maggiore di 1'] },
		6: { label: 'Disequazioni con una sostituzione', constraints: ['log_a^2 x + B log_a x + C op 0 con t intero'] },
		7: { label: 'Esponenziali con i logaritmi', constraints: ['a^(x + k) op b con b non potenza di a, oppure b negativo'] },
	},
	{ 1: (rng) => oneLog(rng, true), 2: (rng) => oneLog(rng, false), 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 },
	levelErrors,
);
