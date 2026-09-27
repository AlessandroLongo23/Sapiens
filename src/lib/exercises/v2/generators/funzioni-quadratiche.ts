/**
 * La parabola (lesson slug funzioni-quadratiche). Spec: specs/exercises/funzioni-quadratiche.md
 *
 * Seven levels in the order of the lesson: concavity, width and the vertex of y = ax^2 + c; vertex and
 * axis of y = ax^2 + bx + c with integer coordinates; the vertex with fractions; a point on the parabola
 * and the point on the y axis; the intersections with the x axis in the three cases of the discriminant;
 * the position with respect to the x axis from the signs of a and delta; the parabola through three
 * points. Every exercise starts from the answer (the vertex, the roots, the point, the coefficients) and
 * builds the parabola from it. Numbers are exact: Rational for coordinates, Surd for irrational roots.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import { Rational, gcd, q } from '../rational';
import { Surd, sqrtParts } from '../surd';
import { joinSigned, paren, poly, polyToLatex } from '../latex';

export const ID = 'funzioni-quadratiche';

/** Patterns that must never appear in a problem (mirrored in the Python checker). */
const FORBIDDEN: RegExp[] = [/(?<!\d)1\s*x/, /(?<!\d)0\s*x/, /\+\s*-/, /-\s*-/, /\+\s*\+/, /\^\{1\}|\^1(?!\d)/, /\^\{0\}|\^0(?!\d)/, /[+-]\s*0(?!\d)/];

const t = (s: string) => `\\text{${s}}`;

// ---------------------------------------------------------------------------
// Numbers, points and parabolas

type Case = string;

function shuffle<T>(rng: Rng, xs: T[]): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

function nonZero(rng: Rng, a: number, b: number): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
}

/** a x^2 + b x + c at x. */
const f = (a: Rational, b: Rational, c: Rational, x: Rational): Rational => a.mul(x).mul(x).add(b.mul(x)).add(c);

/** "y = ax^2 + bx + c", ordered by decreasing powers. */
const parabola = (a: Rational, b: Rational, c: Rational): string => `y = ${polyToLatex(poly(c, b, a))}`;

/** SymPy form of the right-hand side: "2*x**2 - 3*x + 1". */
function sympyPoly(a: Rational, b: Rational, c: Rational): string {
	const r = (x: Rational) => (x.isInteger() ? String(x.num) : `(${x.num}/${x.den})`);
	return `${r(a)}*x**2 + ${r(b)}*x + ${r(c)}`;
}

/** A pair of coordinates: "(3, 0)", or "\left(\frac{3}{2}, -\frac{5}{4}\right)" with fractions. */
function pair(x: Rational, y: Rational): string {
	return x.isInteger() && y.isInteger() ? `(${x.num}, ${y.num})` : `\\left(${x.toLatex()}, ${y.toLatex()}\\right)`;
}

/** x squared inside a substitution: 2^2, (-1)^2, \left(\frac{3}{2}\right)^2. */
function sq(x: Rational): string {
	if (x.isInteger()) return x.sign() < 0 ? `(${x.num})^2` : `${x.num}^2`;
	return `\\left(${x.toLatex()}\\right)^2`;
}

/** The substitution a·x^2 + b·x + c written out, as in the lesson: "-(-1)^2 - 2 \cdot (-1) + 3". */
function subst(a: Rational, b: Rational, c: Rational, x: Rational): string {
	let s = a.isOne() ? sq(x) : a.equals(q(-1)) ? `-${sq(x)}` : `${a.toLatex()} \\cdot ${sq(x)}`;
	if (!b.isZero()) {
		const k = b.abs();
		s += ` ${b.sign() < 0 ? '-' : '+'} ${k.isOne() ? '' : `${k.toLatex()} \\cdot `}${paren(x)}`;
	}
	return joinSigned(s, c);
}

const conc = (a: Rational) => (a.sign() > 0 ? 'alto' : 'basso');

// ---------------------------------------------------------------------------
// Options

/** Four distinct options, the correct one first in `opts`, shuffled. */
function choiceOf(rng: Rng, correct: ChoiceOption, distractors: ChoiceOption[]): ChoiceAnswer {
	const opts: ChoiceOption[] = [correct];
	const keyOf = (o: ChoiceOption) => o.values.join('|');
	for (const d of distractors) {
		if (opts.length === 4) break;
		if (opts.some((o) => keyOf(o) === keyOf(d) || o.latex === d.latex)) continue;
		opts.push(d);
	}
	if (opts.length < 4) throw new Error(`${ID}: only ${opts.length} distinct options`);
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

const pointOption = (x: Rational, y: Rational, letter = ''): ChoiceOption => ({ latex: `${letter}${pair(x, y)}`, values: [x.toString(), y.toString()] });

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Sample['answer'];
	choice?: ChoiceAnswer;
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Level 1: concavity, width, vertex of y = ax^2 + c

const A_POOL: Rational[] = [q(1, 4), q(1, 3), q(1, 2), q(1), q(3, 2), q(2), q(3), q(4), q(5)];

function level1(rng: Rng): Built {
	const u = rng.next();
	if (u < 2 / 3) {
		const narrow = u < 1 / 3;
		const abs = shuffle(rng, A_POOL).slice(0, 4);
		const target = abs.reduce((m, x) => ((narrow ? x.compare(m) > 0 : x.compare(m) < 0) ? x : m));
		const as = abs.map((x) => (rng.next() < 0.5 ? x.neg() : x));
		const ti = abs.indexOf(target);
		const trap = rng.next() < 0.6;
		if (trap) {
			// Narrowest with a < 0 (the largest a is another one); widest positive and some other a < 0 (the smallest a is another one).
			if (narrow) as[ti] = target.neg();
			else {
				as[ti] = target;
				const other = (ti + 1 + rng.int(0, 2)) % 4;
				as[other] = abs[other].neg();
			}
		}
		const a = as[ti];
		const eqs = as.map((x) => parabola(x, q(0), q(0)));
		const options = as.map((x, i) => ({ latex: eqs[i], values: [x.toString()] }));
		const order = shuffle(rng, [0, 1, 2, 3]);
		const answer: ChoiceAnswer = { kind: 'choice', options: order.map((i) => options[i]), correct: order.indexOf(ti) };
		const word = narrow ? 'stretta' : 'larga';
		const steps = [
			`${t("L'apertura dipende dal valore assoluto di ")} a${t(': ')} ${as.map((x) => `\\left|${x.toLatex()}\\right| = ${x.abs().toLatex()}`).join(',\\ ')}`,
			`${t(`Il valore assoluto più ${narrow ? 'grande' : 'piccolo'} è `)} ${a.abs().toLatex()}${t(`: la parabola più ${word} è `)} ${eqs[ti]}`,
		];
		const signedExtreme = as.reduce((m, x) => ((narrow ? x.compare(m) > 0 : x.compare(m) < 0) ? x : m));
		if (!signedExtreme.equals(a)) steps.push(`${t('Il segno di ')} a ${t(" non conta per l'apertura: dice soltanto se la concavità è verso l'alto o verso il basso.")}`);
		return {
			prompt: `Quale di queste parabole è la più ${word}?`,
			problem: eqs.join(' \\quad '),
			solution: eqs[ti],
			steps,
			answer,
			params: { case: word, as: as.map(String), trap: !signedExtreme.equals(a) },
		};
	}
	// Vertex and concavity of y = ax^2 + c.
	const a = rng.pick(A_POOL).mul(q(rng.next() < 0.5 ? -1 : 1));
	const c = q(nonZero(rng, -9, 9));
	const vert = (x: Rational, y: Rational, dir: string): ChoiceOption => ({ latex: `V${pair(x, y)},\\ ${t(`verso ${dir === 'alto' ? "l'alto" : 'il basso'}`)}`, values: [x.toString(), y.toString(), dir] });
	const other = conc(a) === 'alto' ? 'basso' : 'alto';
	const correct = vert(q(0), c, conc(a));
	const pool = [vert(q(0), c, other), vert(c, q(0), conc(a)), vert(c, q(0), other), vert(q(0), q(0), conc(a))];
	const answer = choiceOf(rng, correct, shuffle(rng, pool));
	const up = c.sign() > 0;
	return {
		prompt: 'Trova il vertice della parabola e il verso della concavità.',
		problem: parabola(a, q(0), c),
		solution: `V${pair(q(0), c)}${t(`, concavità verso ${conc(a) === 'alto' ? "l'alto" : 'il basso'}`)}`,
		steps: [
			`${t('Il coefficiente ')} a = ${a.toLatex()} ${t(` è ${a.sign() > 0 ? 'positivo' : 'negativo'}: la concavità è verso ${conc(a) === 'alto' ? "l'alto" : 'il basso'}.`)}`,
			`${t('Il termine ')} c = ${c.toLatex()} ${t(' sposta la parabola ')} ${parabola(a, q(0), q(0))} ${t(` in ${up ? 'su' : 'giù'} di `)} ${c.abs().toLatex()}${t(", senza spostarla a destra o a sinistra: l'asse di simmetria resta l'asse ")} y`,
			`${t('Il vertice è ')} V${pair(q(0), c)}`,
		],
		answer,
		params: { case: 'vertice', a: a.toString(), c: c.toString() },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: vertex and axis

function vertexSteps(a: Rational, b: Rational, c: Rational, xv: Rational, yv: Rational, fractions: boolean): string[] {
	const steps = [
		`${t('I coefficienti sono ')} a = ${a.toLatex()},\\ b = ${b.toLatex()},\\ c = ${c.toLatex()}`,
		`x_V = -\\frac{b}{2a} = -\\frac{${b.toLatex()}}{2 \\cdot ${paren(a)}} = ${xv.toLatex()}`,
	];
	if (fractions) {
		const t1 = a.mul(xv).mul(xv);
		const t2 = b.mul(xv);
		steps.push(`y_V = ${subst(a, b, c, xv)} = ${joinSigned(joinSigned(t1.toLatex(), t2), c)} = ${yv.toLatex()}`);
		const delta = b.mul(b).sub(q(4).mul(a).mul(c));
		steps.push(
			`${t('Controllo con il discriminante: ')} \\Delta = b^2 - 4ac = ${paren(b)}^2 - 4 \\cdot ${paren(a)} \\cdot ${paren(c)} = ${delta.toLatex()}${t(', e ')} -\\frac{\\Delta}{4a} = ${yv.toLatex()}`,
		);
	} else {
		steps.push(`y_V = ${subst(a, b, c, xv)} = ${yv.toLatex()}`);
	}
	steps.push(`${t('Il vertice è ')} V${pair(xv, yv)} ${t(" e l'asse di simmetria è la retta ")} x = ${xv.toLatex()}`);
	steps.push(
		`${t(`La concavità è verso ${conc(a) === 'alto' ? "l'alto" : 'il basso'}, perché `)} a ${a.sign() > 0 ? '>' : '<'} 0${t(`: il vertice è il punto più ${a.sign() > 0 ? 'basso' : 'alto'}.`)}`,
	);
	return steps;
}

/** Vertex distractors from the warnings: the sign of -b/2a, the minus in front of x^2, swapped coordinates, 2 forgotten, -Δ/4a with the wrong sign. */
function vertexDistractors(rng: Rng, a: Rational, b: Rational, c: Rational, xv: Rational, yv: Rational): ChoiceOption[] {
	const V = (x: Rational, y: Rational) => pointOption(x, y, 'V');
	const first = V(xv.neg(), f(a, b, c, xv.neg()));
	const rest: ChoiceOption[] = [];
	if (a.sign() < 0) rest.push(V(xv, yv.sub(q(2).mul(a).mul(xv).mul(xv))));
	rest.push(V(yv, xv), V(xv.mul(q(2)), f(a, b, c, xv.mul(q(2)))), V(xv, yv.neg()), V(xv, c));
	const out = [first, ...shuffle(rng, rest)];
	// Fallbacks, never needed in practice: neighbours of the vertex.
	for (let d = 1; d <= 6; d++) out.push(V(xv, yv.add(q(d))), V(xv.add(q(d)), yv));
	return out.filter((o) => !(Rational.parse(o.values[0]).equals(xv) && Rational.parse(o.values[1]).equals(yv)));
}

function level2(rng: Rng): Built {
	const a = q(rng.pick([1, 1, 1, -1, -1, 2, -2]));
	const xv = q(nonZero(rng, -5, 5));
	const yv = q(rng.int(-9, 9));
	const b = q(-2).mul(a).mul(xv);
	const c = a.mul(xv).mul(xv).add(yv);
	if (Math.abs(b.num) > 12 || Math.abs(c.num) > 30) return level2(rng);
	const steps = vertexSteps(a, b, c, xv, yv, false);
	const problem = parabola(a, b, c);
	if (rng.next() < 0.25) {
		const line = (v: string, k: Rational): ChoiceOption => ({ latex: `${v} = ${k.toLatex()}`, values: [v, k.toString()] });
		const pool = [line('x', xv.neg()), ...shuffle(rng, [line('y', xv), line('x', yv), line('x', xv.mul(q(2))), line('y', yv)])];
		for (let d = 1; d <= 5; d++) pool.push(line('x', xv.add(q(d))));
		const answer = choiceOf(rng, line('x', xv), pool);
		return {
			prompt: "Trova l'asse di simmetria della parabola.",
			problem,
			solution: `x = ${xv.toLatex()}`,
			steps,
			answer,
			params: { case: 'asse', a: a.toString(), b: b.toString(), c: c.toString() },
		};
	}
	const answer = choiceOf(rng, pointOption(xv, yv, 'V'), vertexDistractors(rng, a, b, c, xv, yv));
	return { prompt: 'Trova il vertice della parabola.', problem, solution: `V${pair(xv, yv)}`, steps, answer, params: { case: 'vertice', a: a.toString(), b: b.toString(), c: c.toString() } };
}

function level3(rng: Rng): Built {
	for (;;) {
		const a = q(rng.pick([1, 1, 1, -1, -1, 2, -2, 3]));
		const b = q(nonZero(rng, -9, 9));
		const c = q(rng.int(-9, 9));
		const xv = b.neg().div(a.mul(q(2)));
		if (xv.isInteger()) continue;
		const yv = f(a, b, c, xv);
		if (yv.den > 12 || Math.abs(yv.num) > 99) continue;
		const answer = choiceOf(rng, pointOption(xv, yv, 'V'), vertexDistractors(rng, a, b, c, xv, yv));
		return {
			prompt: 'Trova il vertice della parabola.',
			problem: parabola(a, b, c),
			solution: `V${pair(xv, yv)}`,
			steps: vertexSteps(a, b, c, xv, yv, true),
			answer,
			params: { case: yv.isInteger() ? 'ordinata intera' : 'ordinata frazionaria', a: a.toString(), b: b.toString(), c: c.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: a point on the parabola, the point on the y axis

function level4(rng: Rng): Built {
	const a = q(rng.pick([1, 1, -1, -1, 2, -2]));
	const b = q(nonZero(rng, -6, 6));
	const c = q(nonZero(rng, -6, 6));
	const problem = parabola(a, b, c);
	const params = { a: a.toString(), b: b.toString(), c: c.toString() };
	if (rng.next() < 0.3) {
		const pool = [pointOption(c, q(0)), ...shuffle(rng, [pointOption(q(0), b), pointOption(q(0), f(a, b, c, q(1))), pointOption(q(0), c.neg()), pointOption(q(0), a)]), pointOption(q(0), q(0))];
		const answer = choiceOf(rng, pointOption(q(0), c), pool);
		return {
			prompt: "In quale punto la parabola incontra l'asse y?",
			problem,
			solution: pair(q(0), c),
			steps: [
				`${t("I punti dell'asse ")} y ${t(' hanno ascissa ')} 0${t(': sostituisci ')} x = 0${t(' e resta solo il termine noto, ')} c = ${c.toLatex()}`,
				`${t("La parabola incontra l'asse ")} y ${t(' in ')} ${pair(q(0), c)}${t(', non in ')} ${pair(c, q(0))}${t(": sull'asse ")} y ${t(" è l'ascissa a valere zero.")}`,
			],
			answer,
			params: { ...params, case: 'asse y' },
		};
	}
	for (;;) {
		const x0 = q(nonZero(rng, -3, 3));
		const y0 = f(a, b, c, x0);
		if (Math.abs(y0.num) > 25) continue;
		const on = (p: ChoiceOption) => f(a, b, c, Rational.parse(p.values[0])).equals(Rational.parse(p.values[1]));
		const cands = shuffle(rng, [
			...(Math.abs(y0.num) <= 6 ? [pointOption(y0, x0)] : []),
			pointOption(x0.neg(), y0),
			pointOption(x0, y0.sub(q(2).mul(b).mul(x0))),
			...(a.sign() < 0 ? [pointOption(x0, y0.sub(q(2).mul(a).mul(x0).mul(x0)))] : []),
			pointOption(x0, y0.add(q(rng.pick([-2, -1, 1, 2])))),
		]).filter((p) => !on(p));
		for (let d = 1; d <= 6; d++) cands.push(pointOption(x0, y0.add(q(d))));
		let answer: ChoiceAnswer;
		try {
			answer = choiceOf(rng, pointOption(x0, y0), cands.filter((p) => !on(p)));
		} catch {
			continue;
		}
		const steps = answer.options.map((o) => {
			const px = Rational.parse(o.values[0]);
			const py = Rational.parse(o.values[1]);
			const v = f(a, b, c, px);
			const yes = v.equals(py);
			return `${t('Per ')} ${o.latex} ${t(' sostituisci ')} x = ${px.toLatex()}${t(': ')} ${subst(a, b, c, px)} = ${v.toLatex()}${
				yes ? t(", che è l'ordinata: il punto appartiene alla parabola.") : `${t(', diverso da ')} ${py.toLatex()}${t(': il punto non appartiene.')}`
			}`;
		});
		return {
			prompt: 'Quale di questi punti appartiene alla parabola?',
			problem,
			solution: pair(x0, y0),
			steps,
			answer,
			params: { ...params, case: 'appartiene' },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the intersections with the x axis

interface Solved {
	/** A x^2 + B x + C with A > 0 and content 1. */
	A: number;
	B: number;
	C: number;
	delta: number;
	roots: Surd[];
}

function solveQuad(a: number, b: number, c: number): Solved {
	let [A, B, C] = a < 0 ? [-a, -b, -c] : [a, b, c];
	const g = gcd(gcd(A, B), C) || 1;
	[A, B, C] = [A / g, B / g, C / g];
	const delta = B * B - 4 * A * C;
	let roots: Surd[] = [];
	if (delta === 0) roots = [Surd.of(-B, 0, 1, 2 * A)];
	else if (delta > 0) roots = [Surd.of(-B, -1, delta, 2 * A), Surd.of(-B, 1, delta, 2 * A)].sort((x, y) => x.compare(y));
	return { A, B, C, delta, roots };
}

const surdKey = (xs: Surd[]) => xs.map(String).join(',');

function pmLatex(a: number, k: number, r: number, d: number): string {
	const root = `${k === 1 ? '' : k}\\sqrt{${r}}`;
	const numer = a === 0 ? `\\pm ${root}` : `${a} \\pm ${root}`;
	return d === 1 ? numer : `\\frac{${numer}}{${d}}`;
}

function rootsLatex(roots: Surd[]): string {
	if (roots.length === 0) return t('Nessuna intersezione');
	if (roots.length === 1) return `x = ${roots[0].toLatex()}`;
	return `x_1 = ${roots[0].toLatex()},\\ x_2 = ${roots[1].toLatex()}`;
}

/** Option text: two values with a radical go on two lines, as in equazioni-secondo-grado. */
function rootsOption(roots: Surd[], twoLines: boolean): string {
	if (roots.length === 2 && twoLines) return `\\begin{gathered} x_1 = ${roots[0].toLatex()} \\\\ x_2 = ${roots[1].toLatex()} \\end{gathered}`;
	return rootsLatex(roots);
}

function level5(rng: Rng): Built {
	const u = rng.next();
	let a = 0, b = 0, c = 0;
	let kind: Case;
	const sign = rng.next() < 0.3 ? -1 : 1;
	if (u < 0.3) {
		kind = 'intere';
		const k = rng.pick([1, 1, 1, 2]);
		const r1 = rng.int(-6, 6);
		let r2 = rng.int(-6, 6);
		while (r2 === r1) r2 = rng.int(-6, 6);
		[a, b, c] = [k, -k * (r1 + r2), k * r1 * r2];
	} else if (u < 0.5) {
		kind = 'frazionarie';
		for (;;) {
			const p1 = nonZero(rng, -7, 7), q1 = rng.int(2, 4);
			const p2 = rng.int(-6, 6), q2 = rng.pick([1, 1, 2, 3]);
			if (gcd(p1, q1) !== 1 || gcd(Math.abs(p2), q2) !== 1 || p1 * q2 === p2 * q1) continue;
			// (q1 x - p1)(q2 x - p2)
			[a, b, c] = [q1 * q2, -(q1 * p2 + q2 * p1), p1 * p2];
			if (Math.abs(b) <= 30 && Math.abs(c) <= 30) break;
		}
	} else if (u < 0.7) {
		kind = 'irrazionali';
		for (;;) {
			a = rng.pick([1, 1, 1, 2]);
			b = nonZero(rng, -8, 8);
			c = nonZero(rng, -8, 8);
			const d = b * b - 4 * a * c;
			if (d > 0 && !Number.isInteger(Math.sqrt(d))) break;
		}
	} else if (u < 0.85) {
		kind = 'tangente';
		const qq = rng.pick([1, 1, 1, 2]);
		const p = nonZero(rng, -5, 5);
		if (gcd(Math.abs(p), qq) !== 1) return level5(rng);
		[a, b, c] = [qq * qq, -2 * qq * p, p * p];
	} else {
		kind = 'nessuna';
		const k = rng.pick([1, 1, 2]);
		const h = nonZero(rng, -4, 4);
		const m = rng.int(1, 6);
		[a, b, c] = [k, -2 * k * h, k * h * h + m];
	}
	[a, b, c] = [sign * a, sign * b, sign * c];
	if (b === 0 || c === 0 || Math.abs(b) > 30 || Math.abs(c) > 30) return level5(rng);
	const s = solveQuad(a, b, c);
	const steps: string[] = [`${t("I punti dell'asse ")} x ${t(' hanno ordinata ')} 0${t(": risolvi l'equazione associata ")} ${polyToLatex(poly(c, b, a))} = 0`];
	let cur = [a, b, c];
	if (a < 0) {
		cur = [-a, -b, -c];
		steps.push(`${t('Moltiplica i due membri per ')} -1${t(': ')} ${polyToLatex(poly(cur[2], cur[1], cur[0]))} = 0`);
	}
	const g0 = cur[0] / s.A;
	if (g0 > 1) steps.push(`${t('Dividi i due membri per ')} ${g0}${t(': ')} ${polyToLatex(poly(s.C, s.B, s.A))} = 0`);
	steps.push(`\\Delta = b^2 - 4ac = ${paren(q(s.B))}^2 - 4 \\cdot ${s.A} \\cdot ${paren(q(s.C))} = ${s.delta}`);
	let solution: string;
	if (s.delta < 0) {
		steps.push(`\\Delta < 0${t(": l'equazione non ha soluzioni, e la parabola non incontra l'asse ")} x`);
		solution = `${t("Nessuna intersezione con l'asse ")} x`;
	} else if (s.delta === 0) {
		steps.push(`\\Delta = 0${t(': una sola soluzione, ')} x = -\\frac{b}{2a} = ${s.roots[0].toLatex()}`);
		steps.push(`${t("La parabola è tangente all'asse ")} x ${t(' nel vertice ')} ${pair(s.roots[0].toRational(), q(0))}`);
		solution = `x = ${s.roots[0].toLatex()}`;
	} else {
		steps.push(`x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{${-s.B} \\pm \\sqrt{${s.delta}}}{${2 * s.A}}`);
		const { k, r } = sqrtParts(s.delta);
		if (r === 1) {
			steps.push(`x_1 = \\frac{${-s.B} - ${k}}{${2 * s.A}} = ${s.roots[0].toLatex()},\\quad x_2 = \\frac{${-s.B} + ${k}}{${2 * s.A}} = ${s.roots[1].toLatex()}`);
		} else {
			if (k > 1) steps.push(`${t('Semplifica il radicale: ')} \\sqrt{${s.delta}} = ${k}\\sqrt{${r}}${t(', quindi ')} x_{1,2} = ${pmLatex(-s.B, k, r, 2 * s.A)}`);
			const g = gcd(gcd(-s.B, k), 2 * s.A);
			if (g > 1) steps.push(`${t('Dividi numeratore e denominatore per ')} ${g}${t(': ')} x_{1,2} = ${pmLatex(-s.B / g, k / g, r, (2 * s.A) / g)}`);
			steps.push(`x_1 = ${s.roots[0].toLatex()},\\quad x_2 = ${s.roots[1].toLatex()}`);
		}
		steps.push(`${t("La parabola taglia l'asse ")} x ${t(' in due punti, di ascisse ')} x_1 ${t(' e ')} x_2`);
		solution = `x_1 = ${s.roots[0].toLatex()},\\ x_2 = ${s.roots[1].toLatex()}`;
	}
	const answer: SetAnswer = { kind: 'set', values: s.roots.map(String), latex: rootsLatex(s.roots) };
	return {
		prompt: "Trova le ascisse dei punti in cui la parabola incontra l'asse x.",
		problem: parabola(q(a), q(b), q(c)),
		solution,
		steps,
		answer,
		params: { case: kind, a: String(a), b: String(b), c: String(c), roots: s.roots.map(String) },
	};
}

/** Level 5 options: roots with the sign changed, 2a forgotten, the vertex only, no intersection, Δ taken as positive. */
function rootsChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const p = sample.params;
	const s = solveQuad(Number(p.a), Number(p.b), Number(p.c));
	const { A, B } = s;
	const D = s.delta;
	const pm = (r: number, d: number) => [Surd.of(-B, -1, r, d), Surd.of(-B, 1, r, d)].sort((x, y) => x.compare(y));
	const vertex = [Surd.of(-B, 0, 1, 2 * A)];
	const cands: Surd[][] = [];
	if (s.roots.length > 0) {
		cands.push(s.roots.map((r) => r.neg()).sort((x, y) => x.compare(y)));
		if (D > 0) cands.push(pm(D, A), vertex, pm(D, 1));
		cands.push([]);
		if (D === 0) cands.push([vertex[0].neg()], [Surd.of(-B, 0, 1, A)]);
	} else {
		cands.push(pm(-D, 2 * A), vertex, [vertex[0].neg()], pm(-D, A));
	}
	for (let d = 1; d <= 8; d++) {
		const base = s.roots.length ? s.roots : vertex;
		cands.push(base.map((r) => r.add(q(d))), base.map((r) => r.add(q(-d))));
	}
	const seen = new Set([surdKey(s.roots)]);
	const chosen: Surd[][] = [s.roots];
	for (const c of cands) {
		const u = c.filter((x, i) => c.findIndex((y) => y.equals(x)) === i);
		if (u.some((x) => x.d > 20 || Math.abs(x.a) > 200 || Math.abs(x.b) > 200)) continue;
		const k = surdKey(u);
		if (seen.has(k) || chosen.length === 4) continue;
		seen.add(k);
		chosen.push(u);
	}
	const twoLines = chosen.some((o) => o.some((v) => !v.isRational()));
	const opts = chosen.map((o) => ({ latex: rootsOption(o, twoLines), values: o.map(String) }));
	return choiceOf(rng, opts[0], opts.slice(1));
}

// ---------------------------------------------------------------------------
// Level 6: the position with respect to the x axis

const POSITIONS = ['taglia', 'tangente', 'sopra', 'sotto'] as const;
type Position = (typeof POSITIONS)[number];
const POSITION_LATEX: Record<Position, string> = {
	taglia: `${t("taglia l'asse ")} x ${t(' in due punti')}`,
	tangente: `${t("è tangente all'asse ")} x`,
	sopra: `${t("sta tutta sopra l'asse ")} x`,
	sotto: `${t("sta tutta sotto l'asse ")} x`,
};

function level6(rng: Rng): Built {
	const pos = POSITIONS[rng.int(0, 3)];
	let a = 0, b = 0, c = 0;
	for (;;) {
		if (pos === 'tangente') {
			const qq = rng.pick([1, 1, 1, 2]);
			const p = nonZero(rng, -5, 5);
			const k = qq === 1 ? rng.pick([1, 1, 2, 3]) : 1;
			const sg = rng.next() < 0.5 ? -1 : 1;
			if (gcd(Math.abs(p), qq) !== 1) continue;
			[a, b, c] = [sg * k * qq * qq, -sg * 2 * k * qq * p, sg * k * p * p];
		} else {
			a = rng.pick([1, 1, 2, 3]) * (pos === 'sopra' ? 1 : pos === 'sotto' ? -1 : rng.next() < 0.5 ? -1 : 1);
			b = nonZero(rng, -9, 9);
			c = nonZero(rng, -9, 9);
			const d = b * b - 4 * a * c;
			if (pos === 'taglia' ? d <= 0 : d >= 0) continue;
		}
		if (Math.abs(b) <= 30 && Math.abs(c) <= 30 && b !== 0 && c !== 0) break;
	}
	const A = q(a), B = q(b), C = q(c);
	const delta = b * b - 4 * a * c;
	const up = a > 0;
	const last: Record<Position, string> = {
		taglia: `\\Delta > 0${t(": l'equazione associata ha due soluzioni, e la parabola taglia l'asse ")} x ${t(' in due punti.')}`,
		tangente: `\\Delta = 0${t(": la parabola tocca l'asse ")} x ${t(' in un solo punto, il vertice: è tangente.')}`,
		sopra: `\\Delta < 0 ${t(" e concavità verso l'alto: il vertice è sopra l'asse ")} x ${t(' e la parabola sta tutta sopra.')}`,
		sotto: `\\Delta < 0 ${t(" e concavità verso il basso: il vertice è sotto l'asse ")} x ${t(' e la parabola sta tutta sotto.')}`,
	};
	const options = POSITIONS.map((k) => ({ latex: POSITION_LATEX[k], values: [k] }));
	return {
		prompt: "Senza disegnarla, stabilisci la posizione della parabola rispetto all'asse x.",
		problem: parabola(A, B, C),
		solution: POSITION_LATEX[pos],
		steps: [
			`a = ${a} ${up ? '>' : '<'} 0${t(`: concavità verso ${up ? "l'alto" : 'il basso'}.`)}`,
			`\\Delta = b^2 - 4ac = ${paren(B)}^2 - 4 \\cdot ${paren(A)} \\cdot ${paren(C)} = ${delta}`,
			last[pos],
		],
		answer: { kind: 'choice', options, correct: POSITIONS.indexOf(pos) },
		params: { case: pos, a: String(a), b: String(b), c: String(c) },
	};
}

// ---------------------------------------------------------------------------
// Level 7: the parabola through three points

/** α a + β b + γ c as LaTeX, zero terms dropped: "9a + 3b + c", "4a - 2b + c". */
function linABC(coefs: number[], names = ['a', 'b', 'c']): string {
	let s = '';
	coefs.forEach((k, i) => {
		if (k === 0) return;
		const body = `${Math.abs(k) === 1 ? '' : Math.abs(k)}${names[i]}`;
		s += s === '' ? `${k < 0 ? '-' : ''}${body}` : ` ${k < 0 ? '-' : '+'} ${body}`;
	});
	return s || '0';
}

const LETTERS = ['A', 'B', 'C'];

function level7(rng: Rng): Built {
	for (;;) {
		const a = rng.pick([1, 1, -1, -1, 2, -2]);
		const b = rng.int(-6, 6);
		const c = rng.int(-6, 6);
		const onAxis = rng.next() < 0.5;
		const xs = onAxis ? [0, ...shuffle(rng, [-3, -2, -1, 1, 2, 3]).slice(0, 2)].sort((m, n) => m - n) : shuffle(rng, [-3, -2, -1, 1, 2, 3, 4]).slice(0, 3).sort((m, n) => m - n);
		const ys = xs.map((x) => a * x * x + b * x + c);
		if (ys.some((y) => Math.abs(y) > 30)) continue;
		if (b === 0 && c === 0) continue;
		const pts = xs.map((x, i) => `${LETTERS[i]}(${x}, ${ys[i]})`);
		const eq = (x: number, y: number) => `${linABC([x * x, x, 1])} = ${y}`;
		const steps = [`${t('Sostituisci le coordinate di ogni punto in ')} y = ax^2 + bx + c${t(':')}`, `\\begin{cases} ${xs.map((x, i) => eq(x, ys[i])).join(' \\\\ ')} \\end{cases}`];
		if (onAxis) {
			const i0 = xs.indexOf(0);
			const [x2, x3] = xs.filter((_, i) => i !== i0);
			const [y2, y3] = ys.filter((_, i) => i !== i0);
			steps.push(`${t('Il punto ')} ${pts[i0]} ${t(' dà subito ')} c = ${c}${t('; sostituisci nelle altre due equazioni:')}`);
			steps.push(`\\begin{cases} ${linABC([x2 * x2, x2])} = ${y2 - c} \\\\ ${linABC([x3 * x3, x3])} = ${y3 - c} \\end{cases}`);
			steps.push(`${t('Risolvi il sistema: ')} a = ${a},\\ b = ${b}`);
		} else {
			const [x1, x2, x3] = xs;
			const [y1, y2, y3] = ys;
			steps.push(t('Sottrai la prima equazione dalla seconda e dalla terza:'));
			steps.push(`\\begin{cases} ${linABC([x2 * x2 - x1 * x1, x2 - x1])} = ${y2 - y1} \\\\ ${linABC([x3 * x3 - x1 * x1, x3 - x1])} = ${y3 - y1} \\end{cases}`);
			steps.push(`${t('Risolvi il sistema: ')} a = ${a},\\ b = ${b}${t(', e dalla prima equazione ')} c = ${c}`);
		}
		const A = q(a), B = q(b), C = q(c);
		steps.push(`${t('La parabola è ')} ${parabola(A, B, C)}`);
		const opt = (x: Rational, y: Rational, z: Rational): ChoiceOption => ({ latex: parabola(x, y, z), values: [sympyPoly(x, y, z)] });
		const pool = [opt(A.neg(), B, C), ...shuffle(rng, [opt(A, B.neg(), C), opt(A, B, C.neg()), opt(B, A, C)])].filter((o) => !/^0\*x\*\*2/.test(o.values[0]));
		for (let d = 1; d <= 4; d++) pool.push(opt(A, B.add(q(d)), C), opt(A, B, C.add(q(d))));
		const choice = choiceOf(rng, opt(A, B, C), pool);
		return {
			prompt: 'Trova l\'equazione della parabola che passa per i tre punti.',
			problem: pts.join(' \\quad '),
			solution: parabola(A, B, C),
			steps,
			answer: { kind: 'expression', value: sympyPoly(A, B, C), latex: parabola(A, B, C), form: 'expanded' },
			choice,
			params: { case: onAxis ? 'asse y' : 'generici', xs: xs.map(String), ys: ys.map(String), a: String(a), b: String(b), c: String(c) },
		};
	}
}

// ---------------------------------------------------------------------------
// Assembly, choice, checks

const BUILDERS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

function generate(rng: Rng, level: number): Sample {
	const build = BUILDERS[level];
	if (!build) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 1000; attempt++) {
		const b = build(rng);
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: b.prompt,
			problem: b.problem,
			solution: b.solution,
			steps: b.steps,
			answer: b.answer,
			params: b.params,
		};
		if (b.choice) sample.choice = b.choice;
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function toChoice(s: Sample, rng: Rng): ChoiceAnswer {
	if (s.answer.kind === 'choice') return s.answer;
	if (s.level === 5) return rootsChoice(s, rng);
	if (s.choice) return s.choice;
	throw new Error(`${ID}: no choice for level ${s.level}`);
}

function check(s: Sample): string[] {
	const v: string[] = [];
	const p = s.params;
	const R = (x: unknown) => Rational.parse(String(x));
	for (const re of FORBIDDEN) if (re.test(s.problem)) v.push(`problema con ${re}: ${s.problem}`);
	if (!s.steps.length) v.push('passaggi mancanti');
	if (/—|piuttosto che/.test(s.problem + s.solution + s.steps.join(' '))) v.push('parole vietate');
	const ch = s.answer.kind === 'choice' ? s.answer : s.choice;
	const correctValues = ch ? ch.options[ch.correct]?.values : undefined;
	if (ch) {
		if (ch.options.length !== 4) v.push('non quattro opzioni');
		if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
		if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni con lo stesso testo');
		if (!correctValues) v.push('indice della risposta giusta fuori intervallo');
	}
	const abc = () => [R(p.a), R(p.b), R(p.c)];
	switch (s.level) {
		case 1: {
			if (p.case === 'vertice') {
				const [a, c] = [R(p.a), R(p.c)];
				if (correctValues?.join('|') !== ['0', c.toString(), conc(a)].join('|')) v.push('vertice o concavità sbagliati');
			} else {
				const as = (p.as as string[]).map(R);
				if (new Set(as.map((x) => x.abs().toString())).size !== 4) v.push('valori assoluti ripetuti');
				const best = as.reduce((m, x) => ((p.case === 'stretta' ? x.abs().compare(m.abs()) > 0 : x.abs().compare(m.abs()) < 0) ? x : m));
				if (correctValues?.[0] !== best.toString()) v.push('parabola scelta sbagliata');
			}
			break;
		}
		case 2:
		case 3: {
			const [a, b, c] = abc();
			const xv = b.neg().div(a.mul(q(2)));
			const yv = f(a, b, c, xv);
			if (s.level === 2 && !(xv.isInteger() && yv.isInteger() && !xv.isZero())) v.push('vertice non intero');
			if (s.level === 3 && xv.isInteger()) v.push('ascissa del vertice intera');
			const want = p.case === 'asse' ? ['x', xv.toString()] : [xv.toString(), yv.toString()];
			if (correctValues?.join('|') !== want.join('|')) v.push('risposta sbagliata');
			break;
		}
		case 4: {
			const [a, b, c] = abc();
			if (!ch) break;
			if (p.case === 'asse y') {
				const good = ch.options.filter((o) => R(o.values[0]).isZero() && f(a, b, c, q(0)).equals(R(o.values[1])));
				if (good.length !== 1 || good[0] !== ch.options[ch.correct]) v.push('punto sull\'asse y sbagliato');
			} else {
				const good = ch.options.filter((o) => f(a, b, c, R(o.values[0])).equals(R(o.values[1])));
				if (good.length !== 1 || good[0] !== ch.options[ch.correct]) v.push('non esattamente un punto sulla parabola');
			}
			break;
		}
		case 5: {
			const sv = solveQuad(Number(p.a), Number(p.b), Number(p.c));
			if (s.answer.kind !== 'set' || s.answer.values.join(',') !== surdKey(sv.roots)) v.push('radici sbagliate');
			if ([p.b, p.c].some((k) => Number(k) === 0 || Math.abs(Number(k)) > 30)) v.push('b o c fuori specifica');
			break;
		}
		case 6: {
			const [a, b, c] = [Number(p.a), Number(p.b), Number(p.c)];
			const d = b * b - 4 * a * c;
			const pos = d > 0 ? 'taglia' : d === 0 ? 'tangente' : a > 0 ? 'sopra' : 'sotto';
			if (correctValues?.[0] !== pos || p.case !== pos) v.push('posizione sbagliata');
			break;
		}
		case 7: {
			const [a, b, c] = abc();
			const xs = (p.xs as string[]).map(R);
			const ys = (p.ys as string[]).map(R);
			if (new Set(xs.map(String)).size !== 3) v.push('ascisse ripetute');
			if (!xs.every((x, i) => f(a, b, c, x).equals(ys[i]))) v.push('i punti non stanno sulla parabola');
			if (s.answer.kind !== 'expression' || s.answer.value !== sympyPoly(a, b, c)) v.push('equazione sbagliata');
			break;
		}
		default:
			v.push(`livello sconosciuto ${s.level}`);
	}
	return v;
}

export const funzioniQuadratiche: Generator = {
	id: ID,
	title: 'La parabola',
	levels: {
		1: {
			label: 'Concavità, apertura e vertice di y = ax^2 + c',
			constraints: ['un terzo la più stretta tra quattro y = ax^2, un terzo la più larga, un terzo vertice e concavità di y = ax^2 + c', '|a| distinti tra 1/4 e 5; in circa sei su dieci il segno di a inganna'],
		},
		2: { label: 'Vertice e asse con coordinate intere', constraints: ['vertice intero con x_V != 0, a in {±1, ±2}', '|b| <= 12, |c| <= 30; un quarto chiede l\'asse'] },
		3: { label: 'Vertice con le frazioni', constraints: ['x_V non intera, y_V con denominatore <= 12', 'passaggi con il controllo y_V = -Δ/4a'] },
		4: { label: 'Un punto sulla parabola e il punto sull\'asse y', constraints: ['sette su dieci: quale di quattro punti appartiene', 'tre su dieci: il punto (0, c)'] },
		5: { label: 'Intersezioni con l\'asse x', constraints: ['intere 30%, frazionarie 20%, irrazionali 20%, tangente 15%, nessuna 15%', 'circa tre su dieci con a < 0'] },
		6: { label: 'Posizione rispetto all\'asse x', constraints: ['taglia, tangente, tutta sopra, tutta sotto: un quarto ciascuna', 'b e c non nulli'] },
		7: { label: 'La parabola per tre punti', constraints: ['metà con un punto sull\'asse y', 'coordinate intere, |y| <= 30'] },
	},
	generate,
	check,
	toChoice,
};

export default funzioniQuadratiche;
