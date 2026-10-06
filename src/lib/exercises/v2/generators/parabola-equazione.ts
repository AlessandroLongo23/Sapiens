/**
 * La parabola nel piano cartesiano. Spec: specs/exercises/parabola-equazione.md
 *
 * Six levels in the order of lesson 116: focus and directrix of y = ax², vertex, focus and directrix of
 * y = ax² + bx + c, the same for a parabola with a horizontal axis x = ay² + by + c, the equation from focus and
 * horizontal directrix, from focus and vertical directrix, from the vertex and a point.
 *
 * Built backwards: a and the vertex are chosen first, focus and directrix follow by adding and subtracting
 * 1/(4a). Distractors are the mistakes of the ad-warning boxes of the lesson: a/4 for 1/(4a), focus and
 * directrix on the wrong side, the two coordinates swapped for a horizontal axis.
 */
import type { ChoiceOption, Rng } from '../types';
import { Rational, q } from '../rational';
import { type Built, type Level, R, makeGenerator, nonZero, par, parX, parXOption, parY, parYOption, pointOption, pt, quadPy, sum, t } from '../circonferenza-parabola';

export const ID = 'parabola-equazione';

const A_POOL: Rational[] = [q(1, 8), q(1, 4), q(1, 2), q(1), q(2)];
const signed = (rng: Rng, x: Rational): Rational => (rng.next() < 0.5 ? x : x.neg());
const quarter = (a: Rational): Rational => q(1).div(a.mul(q(4)));
/** The line y = k or x = k as an option. */
const axisLine = (v: 'x' | 'y', k: Rational): ChoiceOption => ({ latex: `${v} = ${k.toLatex()}`, values: [`${v} = ${k}`] });

/** a, and a vertex with integer coordinates for which b and c of the expanded form stay simple. */
function shape(rng: Rng): { a: Rational; xv: number; yv: number; b: Rational; c: Rational } | null {
	const a = signed(rng, rng.pick(A_POOL.slice(1)));
	const step = a.den === 4 ? 2 : 1;
	const xv = nonZero(rng, -3, 3) * step;
	const yv = rng.int(-5, 5);
	const b = a.mul(q(-2 * xv));
	const c = a.mul(q(xv * xv)).add(q(yv));
	if (c.isZero() || c.den > 2 || Math.abs(c.num) > 20 || Math.abs(xv) > 6) return null;
	return { a, xv, yv, b, c };
}

// ---------------------------------------------------------------------------
// Level 1: focus and directrix of y = ax²

function level1(rng: Rng): Built {
	const a = signed(rng, rng.pick([...A_POOL, q(3), q(4), q(1, 12)]));
	const f = quarter(a);
	const ask = rng.next() < 0.5 ? 'fuoco' : 'direttrice';
	const first = `\\frac{1}{4a} = \\frac{1}{4 \\cdot ${par(a)}} = ${f.toLatex()}`;
	if (ask === 'fuoco')
		return {
			prompt: 'Trova il fuoco della parabola.',
			problem: parY(a, 0, 0),
			solution: pt('F', 0, f),
			steps: [first, `${t('Il fuoco è ')} F\\left(0, \\frac{1}{4a}\\right) = ${pt('F', 0, f)}`],
			correct: pointOption(0, f),
			distractors: [pointOption(0, a.div(q(4))), pointOption(0, f.neg()), pointOption(f, 0), pointOption(0, a.mul(q(4))), pointOption(0, q(1).div(a)), pointOption(0, q(1).div(a.mul(q(2))))],
			params: { case: ask, a: a.toString() },
		};
	return {
		prompt: "Scrivi l'equazione della direttrice della parabola.",
		problem: parY(a, 0, 0),
		solution: `y = ${f.neg().toLatex()}`,
		steps: [first, `${t('La direttrice è ')} y = -\\frac{1}{4a}${t(', cioè ')} y = ${f.neg().toLatex()}`],
		correct: axisLine('y', f.neg()),
		distractors: [axisLine('y', f), axisLine('y', a.div(q(-4))), axisLine('x', f.neg()), axisLine('y', a.mul(q(-4))), axisLine('y', q(-1).div(a)), axisLine('y', q(-1).div(a.mul(q(2))))],
		params: { case: ask, a: a.toString() },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: vertex, focus and directrix, with a vertical and with a horizontal axis

function elements(rng: Rng, horizontal: boolean): Built | null {
	const s = shape(rng);
	if (!s) return null;
	const { a, xv, yv, b, c } = s;
	const f = quarter(a);
	const ask = rng.pick(['vertice', 'fuoco', 'direttrice'] as const);
	// with a vertical axis the vertex is (xv, yv); with a horizontal one the same numbers are (yv, xv)
	const P = (u: Rational | number, v: Rational | number, name = '') => (horizontal ? pt(name, v, u) : pt(name, u, v));
	const opt = (u: Rational | number, v: Rational | number): ChoiceOption => (horizontal ? pointOption(v, u) : pointOption(u, v));
	const [along, across] = horizontal ? (['y', 'x'] as const) : (['x', 'y'] as const);
	const eq = horizontal ? parX(a, b, c) : parY(a, b, c);
	const yF = q(yv).add(f);
	const yD = q(yv).sub(f);
	const sub = `${a.isOne() ? '' : a.equals(q(-1)) ? '-' : `${a.toLatex()} \\cdot `}${par(xv)}^2 ${b.sign() < 0 ? '-' : '+'} ${b.abs().isOne() ? '' : `${b.abs().toLatex()} \\cdot `}${par(xv)} ${c.sign() < 0 ? '-' : '+'} ${c.abs().toLatex()}`;
	const vertexSteps = [
		`${along}_V = -\\frac{b}{2a} = -\\frac{${b.toLatex()}}{2 \\cdot ${par(a)}} = ${xv}`,
		`${across}_V = ${sub} = ${yv}`,
	];
	const params = { case: ask, axis: horizontal ? 'x' : 'y', a: a.toString(), b: b.toString(), c: c.toString() };
	const swapped = (u: Rational | number, v: Rational | number): ChoiceOption => (horizontal ? pointOption(u, v) : pointOption(v, u));
	if (ask === 'vertice')
		return {
			prompt: 'Trova il vertice della parabola.',
			problem: eq,
			solution: P(xv, yv, 'V'),
			steps: [...vertexSteps, `${t('Il vertice è ')} ${P(xv, yv, 'V')}`],
			correct: opt(xv, yv),
			distractors: [horizontal ? swapped(xv, yv) : opt(-xv, yv), opt(-xv, yv), opt(xv, c), swapped(xv, yv), opt(xv, -yv), opt(R(b).div(a.mul(q(2))), c)],
			params,
		};
	const fStep = `\\frac{1}{4a} = ${f.toLatex()}`;
	if (ask === 'fuoco')
		return {
			prompt: 'Trova il fuoco della parabola.',
			problem: eq,
			solution: P(xv, yF, 'F'),
			steps: [...vertexSteps, fStep, `${across}_F = ${across}_V + \\frac{1}{4a} = ${yv} ${f.sign() < 0 ? '-' : '+'} ${f.abs().toLatex()} = ${yF.toLatex()}`, `${t('Il fuoco è ')} ${P(xv, yF, 'F')}`],
			correct: opt(xv, yF),
			distractors: [horizontal ? swapped(xv, yF) : opt(xv, yD), opt(xv, yD), opt(xv, q(yv).add(a.div(q(4)))), opt(xv, f), opt(-xv, yF), swapped(xv, yF), opt(xv, yv)],
			params,
		};
	const dl = (k: Rational, v: 'x' | 'y' = across) => axisLine(v, k);
	return {
		prompt: "Scrivi l'equazione della direttrice della parabola.",
		problem: eq,
		solution: `${across} = ${yD.toLatex()}`,
		steps: [...vertexSteps, fStep, `${t('La direttrice è ')} ${across} = ${across}_V - \\frac{1}{4a} = ${yv} ${f.sign() < 0 ? '+' : '-'} ${f.abs().toLatex()} = ${yD.toLatex()}`],
		correct: dl(yD),
		distractors: [horizontal ? dl(yD, along) : dl(yF), dl(yF), dl(f.neg()), dl(q(yv).sub(a.div(q(4)))), dl(yD, along), dl(q(yv))],
		params,
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: the equation from focus and directrix

function fromFocus(rng: Rng, horizontal: boolean): Built | null {
	// along the axis of the parabola: focus at height h + f, directrix at h - f, vertex at h
	const diff = rng.pick([1, 2, 4]) * (rng.next() < 0.5 ? 1 : -1);
	const f = q(diff, 2);
	const a = quarter(f);
	const step = a.den === 8 ? 4 : a.den === 4 ? 2 : 1;
	const xv = rng.int(-2, 2) * step;
	const k = rng.int(-4, 4);
	const yF = k + diff;
	const yv = q(k).add(f);
	const b = a.mul(q(-2 * xv));
	const c = a.mul(q(xv * xv)).add(yv);
	if (c.den > 2 || (xv === 0 && yv.isZero())) return null;
	const [along, across] = horizontal ? (['y', 'x'] as const) : (['x', 'y'] as const);
	const F = horizontal ? pt('F', yF, xv) : pt('F', xv, yF);
	const opt = (A: Rational, B: Rational, C: Rational): ChoiceOption => (horizontal ? parXOption(A, B, C) : parYOption(A, B, C));
	const withVertex = (A: Rational, h: Rational): ChoiceOption => opt(A, A.mul(q(-2 * xv)), A.mul(q(xv * xv)).add(h));
	const sq = (v: string, n: number) => (n === 0 ? `${v}^2` : `(${v} ${n > 0 ? '-' : '+'} ${Math.abs(n)})^2`);
	const eq = horizontal ? parX(a, b, c) : parY(a, b, c);
	return {
		prompt: `Scrivi l'equazione della parabola di fuoco F e direttrice d.`,
		problem: `${F} \\quad d\\colon ${across} = ${k}`,
		solution: eq,
		steps: [
			`${t(`La direttrice è ${horizontal ? 'verticale' : 'orizzontale'}: l'asse è parallelo all'asse ${horizontal ? 'x' : 'y'}. Uguaglia i quadrati delle distanze di `)} P(x, y) ${t(' dal fuoco e dalla direttrice:')}`,
			`${sq(along === 'x' ? 'x' : 'y', xv)} + ${sq(across, yF)} = ${sq(across, k)}`,
			`${t('Sviluppa e semplifica: ')} ${sq(along, xv)} = ${sum([[2 * diff, across], [k * k - yF * yF, '']])}`,
			eq,
		],
		correct: opt(a, b, c),
		distractors: [withVertex(a.neg(), yv), withVertex(a, q(yF)), withVertex(a.mul(q(2)), yv), withVertex(a, q(k)), horizontal ? parYOption(a, b, c) : withVertex(a.mul(q(4)), yv), withVertex(a.div(q(2)), yv), opt(a, b.neg(), c)],
		open: horizontal ? undefined : { kind: 'expression', value: quadPy(a, b, c), latex: eq, form: 'expanded' },
		params: { axis: horizontal ? 'x' : 'y', F: horizontal ? [`${yF}`, `${xv}`] : [`${xv}`, `${yF}`], directrix: `${k}` },
	};
}

// ---------------------------------------------------------------------------
// Level 6: vertex and a point

function level6(rng: Rng): Built | null {
	const a = signed(rng, rng.pick([q(1, 4), q(1, 2), q(1), q(2), q(3)]));
	const xv = rng.int(-4, 4);
	const yv = rng.int(-5, 5);
	const dx = nonZero(rng, -4, 4);
	const dy = a.mul(q(dx * dx));
	if (!dy.isInteger() || Math.abs(dy.num) > 12) return null;
	const [xa, ya] = [xv + dx, yv + dy.num];
	const b = a.mul(q(-2 * xv));
	const c = a.mul(q(xv * xv)).add(q(yv));
	if (c.den > 4 || (xv === 0 && yv === 0)) return null;
	const withA = (A: Rational, X = xv, Y = yv): ChoiceOption => parYOption(A, A.mul(q(-2 * X)), A.mul(q(X * X)).add(q(Y)));
	const sq = xv === 0 ? 'x^2' : `(x ${xv > 0 ? '-' : '+'} ${Math.abs(xv)})^2`;
	const lhs = yv === 0 ? 'y' : `y ${yv > 0 ? '-' : '+'} ${Math.abs(yv)}`;
	return {
		prompt: "Scrivi l'equazione della parabola con asse parallelo all'asse y, vertice V, che passa per A.",
		problem: `${pt('V', xv, yv)} \\quad ${pt('A', xa, ya)}`,
		solution: parY(a, b, c),
		steps: [
			`${t("L'equazione ha la forma ")} ${lhs} = a${sq}`,
			`${t('Sostituisci le coordinate di ')} A${t(': ')} ${ya} - ${par(yv)} = a \\cdot ${par(dx)}^2${t(', cioè ')} ${dy.num} = ${sum([[dx * dx, 'a']])}`,
			`a = ${a.toLatex()}`,
			`${t('Sviluppa: ')} ${parY(a, b, c)}`,
		],
		correct: withA(a),
		distractors: [withA(q(dy.num, dx)), withA(a, -xv, yv), withA(a.neg()), withA(a, xv, -yv), ya !== 0 ? withA(q(ya, dx * dx)) : null, withA(a.mul(q(2))), withA(a, xa, ya)],
		open: { kind: 'expression', value: quadPy(a, b, c), latex: parY(a, b, c), form: 'expanded' },
		params: { V: [`${xv}`, `${yv}`], A: [`${xa}`, `${ya}`] },
	};
}

// ---------------------------------------------------------------------------

const levels: Record<number, Level> = {
	1: { label: 'Fuoco e direttrice di y = ax²', constraints: ['|a| tra 1/12, 1/8, 1/4, 1/2, 1, 2, 3, 4', 'si chiede il fuoco (50%) o la direttrice (50%)'], build: level1 },
	2: { label: 'Vertice, fuoco e direttrice', constraints: ['y = ax² + bx + c con |a| tra 1/4, 1/2, 1, 2 e vertice intero', 'si chiede il vertice, il fuoco o la direttrice'], build: (rng) => elements(rng, false) },
	3: { label: "Parabola con asse parallelo all'asse x", constraints: ['x = ay² + by + c con |a| tra 1/4, 1/2, 1, 2 e vertice intero', 'si chiede il vertice, il fuoco o la direttrice'], build: (rng) => elements(rng, true) },
	4: { label: 'Equazione da fuoco e direttrice orizzontale', constraints: ['fuoco intero, direttrice y = k con k intero', 'distanza tra fuoco e direttrice 1, 2 o 4'], build: (rng) => fromFocus(rng, false) },
	5: { label: 'Equazione da fuoco e direttrice verticale', constraints: ['fuoco intero, direttrice x = k con k intero', 'distanza tra fuoco e direttrice 1, 2 o 4'], build: (rng) => fromFocus(rng, true) },
	6: { label: 'Equazione da vertice e un punto', constraints: ['vertice e punto interi, non allineati in verticale', '|a| tra 1/4, 1/2, 1, 2, 3'], build: level6 },
};

export const parabolaEquazione = makeGenerator(ID, 'La parabola nel piano cartesiano', levels);
export default parabolaEquazione;
