/**
 * Parabola e rette. Spec: specs/exercises/parabola-rette.md
 *
 * Seven levels in the order of lesson 117: the position of a line from the discriminant of the resolvent, the
 * value of q for which y = mx + q is tangent, the slope of the tangent at a point, the equation of that tangent,
 * the tangent parallel to a given line, the slopes of the tangents from an external point, the area of a
 * parabolic segment.
 *
 * Built backwards: the abscissas of the common points (or of the points of contact) are chosen first, and the
 * line or the external point is computed from them, so every resolvent has integer solutions.
 */
import type { Rng } from '../types';
import { Rational, q } from '../rational';
import { type Built, type Level, R, lineExplicit, lineOption, linPy, makeGenerator, nonZero, numOption, numberAnswer, pairOption, par, parY, pt, setAnswer, setOption, sum, t, textOption, until } from '../circonferenza-parabola';

export const ID = 'parabola-rette';

const signed = (rng: Rng, x: Rational): Rational => (rng.next() < 0.5 ? x : x.neg());

interface Par {
	a: Rational;
	b: Rational;
	c: Rational;
}
const at = (p: Par, x: Rational | number): Rational => p.a.mul(R(x)).mul(R(x)).add(p.b.mul(R(x))).add(p.c);
const slope = (p: Par, x: Rational | number): Rational => p.a.mul(q(2)).mul(R(x)).add(p.b);
const eq = (p: Par): string => parY(p.a, p.b, p.c);

/** A parabola with small coefficients: a among ±1/4, ±1/2, ±1, ±2, b and c integers. */
function parabola(rng: Rng, pool: Rational[] = [q(1, 4), q(1, 2), q(1), q(1), q(2)]): Par {
	return { a: signed(rng, rng.pick(pool)), b: q(rng.int(-4, 4)), c: q(rng.int(-5, 5)) };
}

/** a·x² + (b − m)x + (c − k) = 0 multiplied by the denominator of a, as the lesson does. */
function resolvent(p: Par, m: Rational, k: Rational): { tex: string; A: Rational; B: Rational; C: Rational } {
	const d = q(p.a.den * (p.a.sign() < 0 ? -1 : 1));
	const [A, B, C] = [p.a.mul(d), p.b.sub(m).mul(d), p.c.sub(k).mul(d)];
	return { tex: `${sum([[A, 'x^2'], [B, 'x'], [C, '']])} = 0`, A, B, C };
}

// ---------------------------------------------------------------------------
// Level 1: position of a line

const POSITIONS = ['secante', 'tangente', 'esterna'] as const;

function level1(rng: Rng): Built | null {
	const pos = rng.pick(POSITIONS);
	return until(() => level1of(rng, pos));
}

function level1of(rng: Rng, pos: (typeof POSITIONS)[number]): Built | null {
	const a = signed(rng, rng.pick([q(1, 2), q(1), q(1), q(2)]));
	const m = q(nonZero(rng, -4, 4));
	const x1 = rng.int(-4, 4);
	const x2 = pos === 'secante' ? x1 + nonZero(rng, -5, 5) : x1;
	// tangent or secant through the points of abscissas x1 and x2; for an external line the tangent is moved away
	const b = m.sub(a.mul(q(x1 + x2)));
	const shift = pos === 'esterna' ? q(rng.int(1, 4) * a.sign()) : q(0);
	const k = q(rng.int(-5, 5));
	const c = k.add(a.mul(q(x1 * x2))).add(shift);
	if (!b.isInteger() || !c.isInteger() || Math.abs(b.num) > 9 || Math.abs(c.num) > 12 || b.isZero() || c.isZero()) return null;
	const p = { a, b, c };
	const r = resolvent(p, m, k);
	const delta = r.B.mul(r.B).sub(r.A.mul(r.C).mul(q(4)));
	const sign = delta.sign() > 0 ? '> 0' : delta.sign() < 0 ? '< 0' : '= 0';
	return {
		prompt: 'Stabilisci la posizione della retta r rispetto alla parabola.',
		problem: `${eq(p)} \\quad r\\colon ${lineExplicit(m, k)}`,
		solution: t(pos),
		steps: [
			`${t('Uguaglia i secondi membri e porta tutto a primo membro: ')} ${r.tex}`,
			`\\Delta = ${par(r.B)}^2 - 4 \\cdot ${par(r.A)} \\cdot ${par(r.C)} = ${delta.toLatex()}`,
			`\\Delta ${sign}${t(`: la retta è ${pos}.`)}`,
		],
		correct: textOption(pos),
		distractors: POSITIONS.filter((x) => x !== pos).map(textOption),
		n: 3,
		params: { case: pos, parabola: [a.toString(), b.toString(), c.toString()], line: [m.toString(), k.toString()] },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the value of q for which y = mx + q is tangent

function level2(rng: Rng): Built | null {
	const p = parabola(rng);
	// the point of contact is not on the y axis, so the resolvent keeps its term in x
	const x0 = nonZero(rng, -4, 4);
	const m = slope(p, x0);
	if (!m.isInteger() || m.isZero() || Math.abs(m.num) > 9) return null;
	const k = at(p, x0).sub(m.mul(q(x0)));
	if (k.den > 4) return null;
	const d = q(p.a.den * (p.a.sign() < 0 ? -1 : 1));
	const [A, B] = [p.a.mul(d), p.b.sub(m).mul(d)];
	const C0 = p.c.mul(d);
	// Δ = B² − 4A(C0 − d·q) = 0
	const wrongSum = p.c.sub(p.b.add(m).mul(p.b.add(m)).div(p.a.mul(q(4))));
	return {
		prompt: 'Per quale valore di q la retta r è tangente alla parabola?',
		problem: `${eq(p)} \\quad r\\colon y = ${sum([[m, 'x'], [1, 'q']])}`,
		solution: `q = ${k.toLatex()}`,
		steps: [
			`${t('Risolvente: ')} ${sum([[A, 'x^2'], [B, 'x'], [C0, ''], [d.neg(), 'q']])} = 0`,
			`${t('Condizione di tangenza: ')} \\Delta = ${par(B)}^2 - 4 \\cdot ${par(A)} \\cdot \\left(${sum([[C0, ''], [d.neg(), 'q']])}\\right) = 0`,
			`q = ${k.toLatex()}`,
		],
		correct: numOption(k),
		distractors: [numOption(p.c.add(p.b.sub(m).mul(p.b.sub(m)).div(p.a.mul(q(4))))), numOption(wrongSum), numOption(k.neg()), numOption(p.c.sub(p.b.sub(m).mul(p.b.sub(m)).div(p.a.mul(q(2))))), numOption(at(p, x0)), numOption(k.add(q(1))), numOption(k.sub(q(1)))],
		open: numberAnswer(k),
		params: { parabola: [p.a.toString(), p.b.toString(), p.c.toString()], m: m.toString() },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: the tangent at a point of the parabola, its slope and its equation

function tangentAt(rng: Rng, equation: boolean): Built | null {
	const p = parabola(rng);
	const x0 = nonZero(rng, -4, 4);
	const y0 = at(p, x0);
	const m = slope(p, x0);
	if (!y0.isInteger() || m.den > 2 || Math.abs(y0.num) > 15) return null;
	const mStep = `m = 2ax_0 + b = 2 \\cdot ${par(p.a)} \\cdot ${par(x0)} ${p.b.sign() < 0 ? '-' : '+'} ${p.b.abs().toLatex()} = ${m.toLatex()}`;
	const params = { parabola: [p.a.toString(), p.b.toString(), p.c.toString()], x0: `${x0}` };
	const half = p.a.mul(q(x0)).add(p.b);
	const noB = p.a.mul(q(2 * x0));
	if (!equation)
		return {
			prompt: 'Calcola il coefficiente angolare della tangente alla parabola nel suo punto di ascissa x₀.',
			problem: `${eq(p)} \\quad x_0 = ${x0}`,
			solution: `m = ${m.toLatex()}`,
			steps: [mStep],
			correct: numOption(m),
			distractors: [numOption(half), numOption(noB), numOption(y0), numOption(noB.sub(p.b)), numOption(m.neg()), numOption(m.add(q(1))), numOption(m.sub(q(1)))],
			open: numberAnswer(m),
			params,
		};
	if (m.isZero()) return null;
	const k = y0.sub(m.mul(q(x0)));
	const through = (s: Rational) => lineOption(s, y0.sub(s.mul(q(x0))));
	return {
		prompt: 'Scrivi la tangente alla parabola nel suo punto di ascissa x₀.',
		problem: `${eq(p)} \\quad x_0 = ${x0}`,
		solution: lineExplicit(m, k),
		steps: [`${t('Ordinata del punto: ')} y_0 = ${y0.toLatex()}`, mStep, `y - ${par(y0)} = ${m.toLatex()}(x - ${par(x0)})`, lineExplicit(m, k)],
		correct: lineOption(m, k),
		distractors: [through(half), through(noB), lineOption(m, y0), lineOption(m, y0.add(m.mul(q(x0)))), through(m.neg()), lineOption(m, p.c), lineOption(m, k.add(q(1)))],
		open: { kind: 'expression', value: linPy(m, k), latex: lineExplicit(m, k), form: 'explicit' },
		params,
	};
}

// ---------------------------------------------------------------------------
// Level 5: the tangent parallel to a given line

function level5(rng: Rng): Built | null {
	const p = parabola(rng);
	const x0 = rng.int(-4, 4);
	const m = slope(p, x0);
	const y0 = at(p, x0);
	if (!m.isInteger() || m.isZero() || y0.den > 4) return null;
	const k = y0.sub(m.mul(q(x0)));
	const k0 = q(nonZero(rng, -6, 6));
	if (k0.equals(k)) return null;
	const xw = m.add(p.b).div(p.a.mul(q(2)));
	const xn = m.sub(p.b).div(p.a);
	const tangentFrom = (x: Rational) => lineOption(m, at(p, x).sub(m.mul(x)));
	return {
		prompt: 'Scrivi la tangente alla parabola parallela alla retta r.',
		problem: `${eq(p)} \\quad r\\colon ${lineExplicit(m, k0)}`,
		solution: lineExplicit(m, k),
		steps: [
			`${t('Le rette parallele hanno lo stesso coefficiente angolare: ')} m = ${m.toLatex()}`,
			`2ax_0 + b = ${m.toLatex()}${t(', cioè ')} ${sum([[p.a.mul(q(2)), 'x_0'], [p.b, '']])} = ${m.toLatex()}${t(', quindi ')} x_0 = ${x0}`,
			`y_0 = ${y0.toLatex()}`,
			`y - ${par(y0)} = ${m.toLatex()}(x - ${par(x0)})`,
			lineExplicit(m, k),
		],
		correct: lineOption(m, k),
		distractors: [tangentFrom(xw), tangentFrom(xn), lineOption(m, y0), lineOption(m, p.c), lineOption(m, y0.add(m.mul(q(x0)))), lineOption(m, k.add(q(1))), lineOption(m, k.sub(q(1)))],
		open: { kind: 'expression', value: linPy(m, k), latex: lineExplicit(m, k), form: 'explicit' },
		params: { parabola: [p.a.toString(), p.b.toString(), p.c.toString()], line: [m.toString(), k0.toString()] },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the slopes of the tangents from an external point

function level6(rng: Rng): Built | null {
	const p = parabola(rng, [q(1, 4), q(1, 2), q(1)]);
	const x0 = rng.int(-3, 3);
	const h = rng.int(1, 3);
	// points of contact at x0 − h and x0 + h; the point is below the parabola (above, if a < 0) by a·h²
	const y0 = at(p, x0).sub(p.a.mul(q(h * h)));
	const ms = [slope(p, x0 - h), slope(p, x0 + h)];
	if (!y0.isInteger() || Math.abs(y0.num) > 12 || ms.some((m) => !m.isInteger())) return null;
	// resolvent of the system with y − y0 = m(x − x0), multiplied by the denominator of a
	const d = q(p.a.den * (p.a.sign() < 0 ? -1 : 1));
	const A = p.a.mul(d);
	const res = `${sum([[A, 'x^2'], [p.b.mul(d), 'x'], [d.neg(), 'mx'], [p.c.sub(y0).mul(d), ''], [d.mul(q(x0)), 'm']])} = 0`;
	// (b − m)² − 4a(c − y0 + m·x0) = 0  →  m² + M·m + N = 0
	const M = p.b.mul(q(-2)).sub(p.a.mul(q(4 * x0)));
	const N = p.b.mul(p.b).sub(p.a.mul(q(4)).mul(p.c.sub(y0)));
	const sorted = [...ms].sort((u, v) => u.compare(v));
	return {
		prompt: 'Trova i coefficienti angolari delle due tangenti alla parabola condotte dal punto P.',
		problem: `${eq(p)} \\quad ${pt('P', x0, y0)}`,
		solution: `m_1 = ${sorted[0].toLatex()}, \\quad m_2 = ${sorted[1].toLatex()}`,
		steps: [
			`${t('Fascio di centro ')} P${t(': ')} ${sum([[1, 'y'], [y0.neg(), '']])} = m${x0 === 0 ? 'x' : `(x ${x0 < 0 ? '+' : '-'} ${Math.abs(x0)})`}`,
			`${t('Risolvente del sistema con la parabola: ')} ${res}`,
			`${t('Condizione di tangenza ')} \\Delta = 0${t(': ')} ${sum([[1, 'm^2'], [M, 'm'], [N, '']])} = 0`,
			`m_1 = ${sorted[0].toLatex()}, \\quad m_2 = ${sorted[1].toLatex()}`,
		],
		correct: setOption(ms),
		distractors: [pairOption(ms.map((m) => m.neg())), pairOption(ms.map((m) => m.sub(p.b))), pairOption([p.a.mul(q(x0 - h)).add(p.b), p.a.mul(q(x0 + h)).add(p.b)]), pairOption([ms[0], ms[1].neg()]), pairOption([ms[0].neg(), ms[1]]), pairOption(ms.map((m) => m.add(q(1)))), pairOption(ms.map((m) => m.mul(q(2))))],
		open: setAnswer(ms),
		params: { parabola: [p.a.toString(), p.b.toString(), p.c.toString()], P: [`${x0}`, y0.toString()] },
	};
}

// ---------------------------------------------------------------------------
// Level 7: the area of a parabolic segment

function level7(rng: Rng): Built | null {
	const horizontal = rng.next() < 0.5;
	return until(() => level7of(rng, horizontal));
}

function level7of(rng: Rng, horizontal: boolean): Built | null {
	const a = signed(rng, rng.pick([q(1, 4), q(1, 2), q(1), q(2), q(3)]));
	const x1 = rng.int(-4, 2);
	const w = rng.int(2, 6);
	const x2 = x1 + w;
	const m = horizontal ? q(0) : q(nonZero(rng, -3, 3));
	const k = q(rng.int(-5, 5));
	const b = m.sub(a.mul(q(x1 + x2)));
	const c = k.add(a.mul(q(x1 * x2)));
	if (!b.isInteger() || !c.isInteger() || Math.abs(b.num) > 9 || Math.abs(c.num) > 12 || c.isZero()) return null;
	const p = { a, b, c };
	const area = a.abs().mul(q(w * w * w, 6));
	if (area.den > 3) return null;
	const r = resolvent(p, m, k);
	const steps = [`${t('Estremi della corda: ')} ${r.tex}${t(', quindi ')} x_1 = ${x1}, \\quad x_2 = ${x2}`];
	if (horizontal) {
		const xv = b.div(a.mul(q(-2)));
		const hgt = k.sub(at(p, xv)).abs();
		steps.push(`${t('La corda è perpendicolare all\'asse ed è lunga ')} ${x2} - ${par(x1)} = ${w}${t('; il vertice ha ordinata ')} ${at(p, xv).toLatex()}${t(', quindi ')} h = ${hgt.toLatex()}`);
		steps.push(`${t('Area')} = \\frac{2}{3} \\cdot ${w} \\cdot ${hgt.toLatex()} = ${area.toLatex()}`);
	} else steps.push(`${t('Area')} = \\frac{|a| \\cdot |x_2 - x_1|^3}{6} = \\frac{${a.abs().toLatex()} \\cdot ${w}^3}{6} = ${area.toLatex()}`);
	return {
		prompt: 'Calcola l\'area del segmento parabolico che la retta r stacca dalla parabola.',
		problem: `${eq(p)} \\quad r\\colon ${lineExplicit(m, k)}`,
		solution: `${t('Area')} = ${area.toLatex()}`,
		steps,
		correct: numOption(area),
		distractors: [numOption(area.mul(q(3, 2))), numOption(area.mul(q(3, 4))), numOption(area.mul(q(2))), numOption(a.abs().mul(q(w * w, 6))), numOption(area.div(q(2))), numOption(a.abs().mul(q(w * w * w))), numOption(area.add(q(1)))],
		open: numberAnswer(area),
		params: { case: horizontal ? 'orizzontale' : 'obliqua', parabola: [a.toString(), b.toString(), c.toString()], line: [m.toString(), k.toString()] },
	};
}

// ---------------------------------------------------------------------------

const levels: Record<number, Level> = {
	1: { label: 'Posizione di una retta con il discriminante', constraints: ['parabola con b e c interi, retta y = mx + q con m intero non nullo', 'secante, tangente, esterna con la stessa frequenza'], build: level1 },
	2: { label: 'Il valore di q per cui la retta è tangente', constraints: ['m intero non nullo, diverso da b', 'q razionale con denominatore al massimo 4'], build: level2 },
	3: { label: 'Coefficiente angolare della tangente in un punto', constraints: ['ascissa intera non nulla, ordinata intera'], build: (rng) => tangentAt(rng, false) },
	4: { label: 'Equazione della tangente in un punto', constraints: ['ascissa intera non nulla, ordinata intera', 'tangente non orizzontale'], build: (rng) => tangentAt(rng, true) },
	5: { label: 'Tangente parallela a una retta data', constraints: ['m intero non nullo, punto di contatto di ascissa intera'], build: level5 },
	6: { label: 'Tangenti da un punto esterno', constraints: ['punto a coordinate intere', 'coefficienti angolari interi'], build: level6 },
	7: { label: 'Area del segmento parabolico', constraints: ['corda perpendicolare all\'asse (50%) oppure obliqua (50%)', 'estremi della corda di ascissa intera, area con denominatore al massimo 3'], build: level7 },
};

export const parabolaRette = makeGenerator(ID, 'Parabola e rette', levels);
export default parabolaRette;
