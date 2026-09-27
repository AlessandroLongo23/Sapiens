/**
 * Fasci di rette (lesson slug retta-fasci). Spec: specs/exercises/retta-fasci.md
 *
 * Seven levels in the order of lesson 86: the line of a proper pencil y - y0 = m(x - x0) through a point (with the
 * vertical line when the point has the abscissa of the centre); the parallel through a point (improper pencil);
 * the centre of a pencil written with k in the coefficients; its excluded line; an improper pencil with k and the
 * value of k that gives no line; the line of the pencil through a point (with the point on the excluded line);
 * the line of the pencil parallel or perpendicular to a given line (with the excluded line and the vertical line
 * as answers).
 *
 * Everything is built backwards: the centre and the two generators (or the answer's slope) come first, then the
 * pencil and the data. A line is a triple [a, b, c] for ax + by + c = 0; in `values` it travels normalised
 * (integers, coprime, first nonzero of a, b positive), so the checker can compare lines and not strings.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { paren } from '../latex';
import { assembleChoice } from '../insiemi';
import { shuffle } from '../razionali';

export const ID = 'retta-fasci';

type R = Rational;
type Line = [R, R, R];
type Pt = [R, R];
const ZERO = q(0);
const ONE = q(1);
const R_ = (s: unknown): R => Rational.parse(String(s));

const nz = (rng: Rng, a: number, b: number): number => {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
};

// ---------------------------------------------------------------------------
// Writing

/** "2x", "-x", "x", "\frac{1}{2}x", "" (zero). */
function term(c: R, v: string): string {
	if (c.isZero()) return '';
	if (c.isOne()) return v;
	if (c.neg().isOne()) return `-${v}`;
	return `${c.toLatex()}${v}`;
}

/** Terms already written with their own sign, joined without "+ -". */
function join(terms: string[]): string {
	let out = '';
	for (const t of terms) {
		if (!t) continue;
		if (!out) out = t;
		else if (t.startsWith('-')) out += ` - ${t.slice(1)}`;
		else out += ` + ${t}`;
	}
	return out || '0';
}

const num = (c: R) => (c.isZero() ? '' : c.toLatex());
/** ax + by + c, as written. */
const lin = (l: Line) => join([term(l[0], 'x'), term(l[1], 'y'), num(l[2])]);
/** ax + by + c = 0, coefficients as they are (fractions included). */
const rawEq = (l: Line) => `${lin(l)} = 0`;

/** A line as the lesson writes its answers: x = h, y = h, or ax + by + c = 0 with coprime integers. */
function implicitLatex(l: Line): string {
	const n = normLine(l)!;
	if (n[1].isZero()) return `x = ${n[2].neg().div(n[0]).toLatex()}`;
	if (n[0].isZero()) return `y = ${n[2].neg().div(n[1]).toLatex()}`;
	return rawEq(n);
}

/** y = mx + q, or x = h. */
function explicitLatex(l: Line): string {
	const [a, b, c] = l;
	if (b.isZero()) return `x = ${c.neg().div(a).toLatex()}`;
	const m = a.neg().div(b);
	const qq = c.neg().div(b);
	return `y = ${join([term(m, 'x'), num(qq)])}`;
}

/** The right side of y = mx + q for SymPy: "1/2*x - 3". */
function explicitValue(m: R, qq: R): string {
	const parts: string[] = [];
	if (!m.isZero()) parts.push(m.isOne() ? 'x' : m.neg().isOne() ? '-x' : `${m.toString()}*x`);
	if (!qq.isZero() || !parts.length) parts.push(qq.toString());
	return join(parts);
}

const ptLatex = (p: Pt) => (p.every((c) => c.isInteger()) ? `(${p[0].toLatex()}, ${p[1].toLatex()})` : `\\left(${p[0].toLatex()}, ${p[1].toLatex()}\\right)`);

/** "a · x0" with the lesson's brackets: 4, -(-2), 2 \cdot (-1). */
function prod(c: R, v: R): string {
	if (c.isOne()) return paren(v);
	if (c.neg().isOne()) return `-${paren(v)}`;
	return `${c.toLatex()} \\cdot ${paren(v)}`;
}

/** ax0 + by0 + c written out, as when a point is substituted. */
function subst(l: Line, p: Pt): string {
	const ts = [l[0].isZero() ? '' : prod(l[0], p[0]), l[1].isZero() ? '' : prod(l[1], p[1]), num(l[2])].filter(Boolean);
	// the first term needs no bracket: -3 + 2 \cdot 3, not (-3) + 2 \cdot 3
	if (ts.length && /^-?\(-\d+\)$/.test(ts[0])) ts[0] = ts[0].startsWith('-(') ? ts[0].slice(3, -1) : ts[0].slice(1, -1);
	return join(ts);
}

/** β + αk, as the inside of a bracket: "1 + k", "1 - k", "k - 1", "2k". */
function linK(beta: R, alpha: R): string {
	if (beta.isZero()) return term(alpha, 'k') || '0';
	if (beta.sign() < 0 && alpha.sign() > 0) return `${term(alpha, 'k')} - ${beta.abs().toLatex()}`;
	return join([beta.toLatex(), term(alpha, 'k')]);
}

/** The coefficient β + αk of the variable v, with its sign: "(1 + k)x", "-(2 + k)y", "kx", "-3y", "". */
function coefTerm(beta: R, alpha: R, v: string): string {
	if (alpha.isZero()) return term(beta, v);
	if (beta.isZero()) return term(alpha, `k${v}`);
	if (beta.sign() < 0 && alpha.sign() < 0) return `-(${linK(beta.neg(), alpha.neg())})${v}`;
	return `(${linK(beta, alpha)})${v}`;
}

// ---------------------------------------------------------------------------
// Lines

const lineOf = (xs: unknown[]): Line => xs.map(R_) as Line;
const str = (l: R[]) => l.map(String);

/** Integers, coprime, first nonzero of a and b positive. Null if a = b = 0. */
function normLine(l: Line): Line | null {
	if (l[0].isZero() && l[1].isZero()) return null;
	const L = l.reduce((acc, c) => lcm(acc, c.den), 1);
	const ints = l.map((c) => c.mul(q(L)));
	const g = ints.reduce((acc, c) => gcd(acc, Math.abs(c.num)), 0) || 1;
	let out = ints.map((c) => c.div(q(g))) as Line;
	const lead = out[0].isZero() ? out[1] : out[0];
	if (lead.sign() < 0) out = out.map((c) => c.neg()) as Line;
	return out;
}

const keyOf = (l: Line) => normLine(l)!.map(String).join(',');
const evalLine = (l: Line, p: Pt) => l[0].mul(p[0]).add(l[1].mul(p[1])).add(l[2]);
const slopeOf = (l: Line): R | null => (l[1].isZero() ? null : l[0].neg().div(l[1]));
const parallel = (u: Line, v: Line) => u[0].mul(v[1]).sub(u[1].mul(v[0])).isZero();

/** The line through p with slope m (null: vertical). */
function through(p: Pt, m: R | null): Line {
	if (m === null) return normLine([ONE, ZERO, p[0].neg()])!;
	// y - y0 = m(x - x0)  ->  mx - y + (y0 - m x0) = 0
	return normLine([m, ONE.neg(), p[1].sub(m.mul(p[0]))])!;
}

/** r + k s. */
const combo = (r: Line, s: Line, k: R): Line => [0, 1, 2].map((i) => r[i].add(k.mul(s[i]))) as Line;

const lineOption = (l: Line, style: 'implicit' | 'explicit' = 'implicit'): ChoiceOption => ({
	latex: style === 'explicit' ? explicitLatex(normLine(l)!) : implicitLatex(l),
	values: [keyOf(l)],
});
const NONE: ChoiceOption = { latex: '\\text{nessuna retta}', values: ['nessuna'] };
const ALL: ChoiceOption = { latex: '\\text{tutte le rette del fascio}', values: ['tutte'] };
const pointOption = (p: Pt): ChoiceOption => ({ latex: ptLatex(p), values: p.map(String) });
const numberOption = (x: R): ChoiceOption => ({ latex: x.toLatex(), values: [x.toString()] });

function mustChoice(rng: Rng, correct: ChoiceOption, cands: (ChoiceOption | null)[], near: ChoiceOption[]): ChoiceAnswer {
	const ch = assembleChoice(rng, correct, [...cands, ...near]);
	if (!ch) throw new Error(`${ID}: not enough distinct options`);
	return ch;
}

/** Lines through p with nearby slopes, for when the mistakes are not enough. */
function nearLines(p: Pt, m: R | null, style: 'implicit' | 'explicit'): ChoiceOption[] {
	const out: ChoiceOption[] = [];
	const base = m ?? ZERO;
	for (let d = 1; d < 6; d++) out.push(lineOption(through(p, base.add(q(d))), style), lineOption(through(p, base.sub(q(d))), style));
	return out;
}

/** Slopes with small numbers, as in the lesson. */
const SLOPES = [1, 2, 3, -1, -2, -3].map((n) => q(n)).concat([q(1, 2), q(-1, 2), q(3, 2), q(-3, 2), q(1, 3), q(-1, 3), q(2, 3), q(-2, 3)]);

// ---------------------------------------------------------------------------
// Pencils r + k s = 0

interface Pencil {
	r: Line;
	s: Line;
	/** Centre (proper pencil) or null (improper). */
	C: Pt | null;
	/** Some generator is parallel to an axis. */
	axes: boolean;
}

/** The pencil expanded, as in the problems: (1 + k)x + (1 - k)y - 3 - k = 0. */
function pencilLatex(p: Pencil): string {
	const { r, s } = p;
	const c = [num(r[2]), term(s[2], 'k')];
	return `${join([coefTerm(r[0], s[0], 'x'), coefTerm(r[1], s[1], 'y'), ...c])} = 0`;
}

/** r + k(s) = 0: the pencil with k collected. */
const genForm = (p: Pencil) => `${lin(p.r)} + k(${lin(p.s)}) = 0`;

/** A direction (a, b) of a line: coprime, small. `axis`: parallel to an axis. */
function direction(rng: Rng, axis: boolean): [number, number] {
	if (axis) return rng.next() < 0.5 ? [1, 0] : [0, 1];
	for (;;) {
		const a = nz(rng, -3, 3);
		const b = nz(rng, -3, 3);
		if (gcd(Math.abs(a), Math.abs(b)) === 1) return [a, b];
	}
}

/** A proper pencil with integer centre, generators with small coefficients. */
function properPencil(rng: Rng, axesShare: number): Pencil {
	for (;;) {
		const C: Pt = [q(rng.int(-4, 4)), q(rng.int(-4, 4))];
		if (C[0].isZero() && C[1].isZero()) continue;
		const axes = rng.next() < axesShare;
		// with axes, one generator (or both) is parallel to an axis, as in example 4
		const which = axes ? rng.pick(['r', 's', 'both']) : 'none';
		let [a, b] = direction(rng, which === 'r' || which === 'both');
		const [a2, b2] = direction(rng, which === 's' || which === 'both');
		if (a * b2 - a2 * b === 0) continue;
		// s with its first coefficient positive, r usually too
		const s0: Line = [q(a2), q(b2), q(-(a2 * C[0].num + b2 * C[1].num))];
		const s = normLine(s0)!;
		if ((a !== 0 ? a : b) < 0 !== rng.next() < 0.25) [a, b] = [-a, -b];
		const r: Line = [q(a), q(b), q(-(a * C[0].num + b * C[1].num))];
		if (Math.abs(r[2].num) > 9 || Math.abs(s[2].num) > 9) continue;
		return { r, s, C, axes };
	}
}

/** The two generators and what they say, for the steps. */
function generatorSteps(p: Pencil): string[] {
	return [`\\text{Svolgi i prodotti e raccogli } k\\text{: } ${genForm(p)}`, `\\text{Le generatrici sono } r\\text{: } ${rawEq(p.r)} \\text{ e } s\\text{: } ${rawEq(p.s)}`];
}

function incidentStep(p: Pencil): string {
	const mr = slopeOf(p.r);
	const ms = slopeOf(p.s);
	const say = (m: R | null) => (m === null ? '\\text{ è verticale}' : `\\text{ ha } m = ${m.toLatex()}`);
	return `r ${say(mr)} \\text{ e } s ${say(ms)}\\text{: sono incidenti, e il fascio è proprio}`;
}

const cases = (a: string, b: string) => `\\begin{cases} ${a} \\\\ ${b} \\end{cases}`;
/** ax + by = -c. */
const sysEq = (l: Line) => `${join([term(l[0], 'x'), term(l[1], 'y')])} = ${l[2].neg().toLatex()}`;

/** Intersection of two lines, or null if parallel. */
function meet(u: Line, v: Line): Pt | null {
	const D = u[0].mul(v[1]).sub(u[1].mul(v[0]));
	if (D.isZero()) return null;
	const x = u[1].mul(v[2]).sub(u[2].mul(v[1])).div(D);
	const y = u[2].mul(v[0]).sub(u[0].mul(v[2])).div(D);
	return [x, y];
}

const small = (p: Pt | null) => p !== null && p.every((c) => c.den <= 6 && Math.abs(c.num) <= 24);

// ---------------------------------------------------------------------------
// Level 1: proper pencil y - y0 = m(x - x0), the line through a point

/** y - y0 or y + 3 or y. */
const shift = (v: string, c: R) => (c.isZero() ? v : c.sign() > 0 ? `${v} - ${c.toLatex()}` : `${v} + ${c.abs().toLatex()}`);
/** m(x - x0), with m a letter or a number. */
function mTimes(m: string, x0: R): string {
	if (m === '0') return '0';
	if (x0.isZero()) return m === '1' ? 'x' : m === '-1' ? '-x' : `${m}x`;
	const mm = m === '1' ? '' : m === '-1' ? '-' : m;
	return `${mm}(${shift('x', x0)})`;
}

function build1(rng: Rng, seed: number): Sample {
	const vertical = rng.next() < 0.15;
	for (;;) {
		const C: Pt = [q(rng.int(-5, 5)), q(rng.int(-5, 5))];
		let A: Pt;
		let m: R | null = null;
		if (vertical) {
			A = [C[0], C[1].add(q(nz(rng, -6, 6)))];
		} else {
			m = rng.next() < 0.08 ? ZERO : rng.pick(SLOPES);
			const dx = q(nz(rng, -4, 4) * m.den);
			A = [C[0].add(dx), C[1].add(m.mul(dx))];
		}
		if (A.some((c) => Math.abs(c.num) > 8)) continue;
		const pencil = `${shift('y', C[1])} = ${mTimes('m', C[0])}`;
		const dy = A[1].sub(C[1]);
		const dx = A[0].sub(C[0]);
		const steps = [
			`\\text{Il fascio di centro } C \\text{ è } ${pencil}\\text{, insieme alla retta } x = ${C[0].toLatex()}`,
			`\\text{Sostituisci le coordinate di } A\\text{: } ${A[1].toLatex()} - ${paren(C[1])} = m(${A[0].toLatex()} - ${paren(C[0])})`,
		];
		const params = { case: vertical ? 'verticale' : 'obliqua', C: str(C), A: str(A) };
		const problem = `C${ptLatex(C)} \\quad A${ptLatex(A)}`;
		const prompt = 'Scrivi il fascio proprio di centro C e trova la retta del fascio che passa per A.';
		if (vertical) {
			steps.push(
				`\\Rightarrow ${dy.toLatex()} = m \\cdot 0\\text{, impossibile: nessun valore di } m \\text{ va bene}`,
				`A \\text{ ha la stessa ascissa di } C\\text{: la retta cercata è la verticale del fascio, } x = ${C[0].toLatex()}`,
			);
			const opts = [lineOption([ONE, ZERO, C[0].neg()]), lineOption([ZERO, ONE, C[1].neg()], 'explicit'), lineOption([ZERO, ONE, A[1].neg()], 'explicit'), NONE];
			const answer = mustChoice(rng, opts[0], opts.slice(1), nearLines(C, null, 'explicit'));
			return { generatorId: ID, level: 1, seed, prompt, problem, solution: `x = ${C[0].toLatex()}`, steps, answer, params };
		}
		const line = through(C, m);
		const qq = C[1].sub(m!.mul(C[0]));
		steps.push(`\\Rightarrow ${dy.toLatex()} = ${term(dx, 'm')} \\Rightarrow m = ${m!.toLatex()}`);
		steps.push(`\\text{Con } m = ${m!.toLatex()}\\text{: } ${shift('y', C[1])} = ${mTimes(m!.toLatex(), C[0])}\\text{, cioè } ${explicitLatex(line)}`);
		return {
			generatorId: ID,
			level: 1,
			seed,
			prompt,
			problem,
			solution: explicitLatex(line),
			steps,
			answer: { kind: 'expression', value: explicitValue(m!, qq), latex: explicitLatex(line) },
			params: { ...params, m: m!.toString() },
		};
	}
}

function choice1(s: Sample, rng: Rng): ChoiceAnswer {
	const C = lineOf(s.params.C as string[]).slice(0, 2) as Pt;
	const A = lineOf(s.params.A as string[]).slice(0, 2) as Pt;
	const m = R_(s.params.m);
	const dx = A[0].sub(C[0]);
	const dy = A[1].sub(C[1]);
	const cands: ChoiceOption[] = [];
	if (!dy.isZero()) cands.push(lineOption(through(C, dx.div(dy)), 'explicit')); // m = Δx / Δy
	cands.push(lineOption([m, ONE.neg(), C[1].add(m.mul(C[0]))], 'explicit')); // q = y0 + m x0: sign lost expanding
	if (!m.isZero()) cands.push(lineOption(through(C, m.neg()), 'explicit')); // sign of m
	const qq = C[1].sub(m.mul(C[0]));
	if (!qq.isZero()) cands.push(lineOption([m, ONE.neg(), ZERO], 'explicit')); // q forgotten: y = mx
	return mustChoice(rng, lineOption(through(C, m), 'explicit'), shuffle(rng, cands), nearLines(C, m, 'explicit'));
}

// ---------------------------------------------------------------------------
// Level 2: improper pencil, the parallel through a point

function build2(rng: Rng, seed: number): Sample {
	const u = rng.next();
	for (;;) {
		const P: Pt = [q(rng.int(-5, 5)), q(rng.int(-5, 5))];
		const prompt = 'Trova la retta parallela a r che passa per P.';
		if (u < 0.15) {
			const h = q(rng.int(-6, 6));
			if (h.equals(P[0])) continue;
			const d: Line = [ONE, ZERO, h.neg()];
			const ans: Line = [ONE, ZERO, P[0].neg()];
			const opts = [lineOption(ans), lineOption([ZERO, ONE, P[1].neg()]), lineOption(d), lineOption([ONE, ZERO, P[1].neg()])];
			return {
				generatorId: ID,
				level: 2,
				seed,
				prompt,
				problem: `r: x = ${h.toLatex()} \\quad P${ptLatex(P)}`,
				solution: `x = ${P[0].toLatex()}`,
				steps: [
					`r \\text{ è verticale: le sue parallele sono le rette } x = h\\text{, un fascio improprio che non si scrive come } y = mx + q`,
					`\\text{La parallela per } P \\text{ ha la stessa ascissa di } P\\text{: } x = ${P[0].toLatex()}`,
				],
				answer: mustChoice(rng, opts[0], opts.slice(1), [1, 2, 3].flatMap((t) => [lineOption([ONE, ZERO, P[0].add(q(t))]), lineOption([ZERO, ONE, P[1].sub(q(t))])])),
				params: { case: 'verticale', d: str(d), P: str(P) },
			};
		}
		const m = rng.pick(SLOPES);
		const implicit = u < 0.7;
		let d: Line;
		if (implicit) d = normLine([m, ONE.neg(), q(rng.int(-9, 9))])!;
		else d = [m, ONE.neg(), q(rng.int(-5, 5))];
		if (evalLine(d, P).isZero()) continue;
		const qd = d[2].neg().div(d[1]);
		const qq = P[1].sub(m.mul(P[0]));
		if (qq.den > 6 || Math.abs(qq.num) > 30) continue;
		const ans = through(P, m);
		const dLatex = implicit ? rawEq(d) : explicitLatex(d);
		const steps: string[] = [];
		if (implicit) steps.push(`\\text{Ricava } y \\text{ da } r\\text{: } y = ${join([term(m, 'x'), num(qd)])}\\text{, quindi } m = ${m.toLatex()}`);
		else steps.push(`r \\text{ ha } m = ${m.toLatex()}`);
		const mx = m.mul(P[0]);
		steps.push(
			`\\text{Il fascio delle parallele è } y = ${join([term(m, 'x'), 'q'])}`,
			`\\text{Sostituisci le coordinate di } P\\text{: } ${P[1].toLatex()} = ${join([prod(m, P[0]), 'q'])}`,
			`\\Rightarrow ${P[1].toLatex()} = ${join([num(mx), 'q'])} \\Rightarrow q = ${qq.toLatex()}`,
			`\\text{La retta è } ${explicitLatex(ans)}`,
		);
		return {
			generatorId: ID,
			level: 2,
			seed,
			prompt,
			problem: `r: ${dLatex} \\quad P${ptLatex(P)}`,
			solution: explicitLatex(ans),
			steps,
			answer: { kind: 'expression', value: explicitValue(m, qq), latex: explicitLatex(ans) },
			params: { case: implicit ? 'implicita' : 'esplicita', d: str(d), P: str(P), m: m.toString() },
		};
	}
}

function choice2(s: Sample, rng: Rng): ChoiceAnswer {
	const d = lineOf(s.params.d as string[]);
	const P = lineOf(s.params.P as string[]).slice(0, 2) as Pt;
	const m = R_(s.params.m);
	const cands: ChoiceOption[] = [];
	if (!m.isZero()) {
		cands.push(lineOption(through(P, ONE.neg().div(m)), 'explicit')); // the perpendicular: -1/m
		cands.push(lineOption(through(P, m.neg()), 'explicit')); // m = a/b, the sign lost
		if (!m.abs().isOne()) cands.push(lineOption(through(P, ONE.div(m)), 'explicit')); // m = -b/a, a and b exchanged
	}
	if (!m.mul(P[0]).isZero()) cands.push(lineOption([m, ONE.neg(), P[1].add(m.mul(P[0]))], 'explicit')); // q = y0 + m x0
	cands.push(lineOption(d, 'explicit')); // P not used: r itself
	return mustChoice(rng, lineOption(through(P, m), 'explicit'), shuffle(rng, cands), nearLines(P, m, 'explicit'));
}

// ---------------------------------------------------------------------------
// Level 3: the centre of a pencil with k in the coefficients

function build3(rng: Rng, seed: number): Sample {
	const p = properPencil(rng, 0.25);
	const C = p.C!;
	const { r, s } = p;
	const steps = [
		...generatorSteps(p),
		incidentStep(p),
		`\\text{Il centro è la soluzione del sistema } ${cases(sysEq(r), sysEq(s))}`,
		`x = ${C[0].toLatex()} \\qquad y = ${C[1].toLatex()}`,
		`\\text{Verifica: con } x = ${C[0].toLatex()} \\text{ e } y = ${C[1].toLatex()} \\text{ l'equazione diventa } 0 + k \\cdot 0 = 0\\text{, vera per ogni } k`,
	];
	const cands: (ChoiceOption | null)[] = [];
	if (!C[0].equals(C[1])) cands.push(pointOption([C[1], C[0]])); // x and y exchanged
	if (!s[2].isZero()) {
		// the constant term not split: s written without its constant (the lesson's warning)
		const w = meet(r, [s[0], s[1], ZERO]);
		if (small(w)) cands.push(pointOption(w!));
	}
	cands.push(pointOption([C[0].neg(), C[1].neg()])); // signs of the constants on the wrong side
	if (!s[2].isZero()) {
		const w = meet(r, [s[0], s[1], s[2].neg()]);
		if (small(w)) cands.push(pointOption(w!));
	}
	const near: ChoiceOption[] = [];
	for (let d = 1; d < 4; d++) near.push(pointOption([C[0].add(q(d)), C[1]]), pointOption([C[0], C[1].sub(q(d))]), pointOption([C[0].sub(q(d)), C[1].add(q(d))]));
	return {
		generatorId: ID,
		level: 3,
		seed,
		prompt: 'Trova il centro del fascio.',
		problem: pencilLatex(p),
		solution: `C${ptLatex(C)}`,
		steps,
		answer: mustChoice(rng, pointOption(C), cands, near),
		params: { case: p.axes ? 'assi' : 'obliqui', r: str(r), s: str(s), C: str(C) },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the excluded line

function build4(rng: Rng, seed: number): Sample {
	const p = properPencil(rng, 0.25);
	const C = p.C!;
	const { r, s } = p;
	const steps = [
		...generatorSteps(p),
		incidentStep(p),
		`\\text{Con } k = 0 \\text{ si ottiene } r\\text{; la retta moltiplicata per } k \\text{ non si ottiene per nessun valore di } k`,
		`\\text{La retta esclusa è } s\\text{: } ${implicitLatex(s)}`,
	];
	const cands: ChoiceOption[] = [lineOption(r)]; // the other generator
	if (!s[2].isZero()) cands.push(lineOption([s[0], s[1], ZERO])); // the constant term not split
	if (!s[1].isZero()) cands.push(lineOption([ONE, ZERO, C[0].neg()])); // the vertical of the pencil y - y0 = m(x - x0)
	if (!s[2].isZero()) cands.push(lineOption([s[0], s[1], s[2].neg()]));
	if (!s[0].isZero()) cands.push(lineOption([ZERO, ONE, C[1].neg()]));
	const near: ChoiceOption[] = [];
	for (let d = 1; d < 6; d++) near.push(lineOption([s[0], s[1], s[2].add(q(d))]), lineOption([r[0], r[1], r[2].sub(q(d))]));
	return {
		generatorId: ID,
		level: 4,
		seed,
		prompt: 'Trova la retta esclusa dal fascio.',
		problem: pencilLatex(p),
		solution: `s\\text{: } ${implicitLatex(s)}`,
		steps,
		answer: mustChoice(rng, lineOption(s), cands, near),
		params: { case: p.axes ? 'assi' : 'obliqui', r: str(r), s: str(s), C: str(C) },
	};
}

// ---------------------------------------------------------------------------
// Level 5: improper pencil, the value of k that gives no line

function build5(rng: Rng, seed: number): Sample {
	for (;;) {
		const [a2, b2] = direction(rng, false);
		const dir = normLine([q(a2), q(b2), ZERO])!;
		// r = t·(a, b) + c and s = (a, b) + c' (k = -t), or r = (a, b) + c and s = t·(a, b) + c' (k = -1/t)
		const t = q(rng.pick([1, 1, 2, 3]));
		const onR = t.isOne() || rng.next() < 0.6;
		const sign = rng.next() < 0.25 ? ONE.neg() : ONE;
		const r: Line = [dir[0].mul(onR ? t : ONE).mul(sign), dir[1].mul(onR ? t : ONE).mul(sign), q(rng.int(-6, 6))];
		const s: Line = [dir[0].mul(onR ? ONE : t), dir[1].mul(onR ? ONE : t), q(rng.int(-6, 6))];
		if (parallel(r, s) && evalLine(r, [ZERO, ZERO]).mul(s[0]).equals(s[2].mul(r[0]))) continue; // the same line
		if ([...r, ...s].some((x) => Math.abs(x.num) > 9)) continue;
		const p: Pencil = { r, s, C: null, axes: false };
		const kk = r[0].neg().div(s[0]);
		const rest = r[2].add(kk.mul(s[2]));
		const m = slopeOf(s)!;
		const qr = r[2].neg().div(r[1]);
		const qs = s[2].neg().div(s[1]);
		const steps = [
			...generatorSteps(p),
			`\\text{Hanno lo stesso coefficiente angolare } m = ${m.toLatex()} \\text{ e ordinate all'origine diverse, } ${qr.toLatex()} \\text{ e } ${qs.toLatex()}\\text{: sono parallele, e il fascio è improprio}`,
			`\\text{I coefficienti di } x \\text{ e di } y\\text{, } ${linK(r[0], s[0])} \\text{ e } ${linK(r[1], s[1])}\\text{, valgono zero insieme per } k = ${kk.toLatex()}`,
			`\\text{Con } k = ${kk.toLatex()} \\text{ l'equazione diventa } ${rest.toLatex()} = 0\\text{, che è falsa: nessuna retta}`,
		];
		const cands: ChoiceOption[] = [numberOption(kk.neg())]; // the sign of the root
		if (!s[2].isZero()) cands.push(numberOption(r[2].neg().div(s[2]))); // the constant term made zero
		cands.push(numberOption(ZERO));
		cands.push(numberOption(ONE.div(kk))); // the root of a' k + a read as k = -a'/a
		const near: ChoiceOption[] = [];
		for (let d = 1; d < 6; d++) near.push(numberOption(kk.add(q(d))), numberOption(kk.sub(q(d))));
		const ans: Sample = {
			generatorId: ID,
			level: 5,
			seed,
			prompt: "Il fascio è improprio. Trova il valore di k per cui l'equazione non rappresenta una retta.",
			problem: pencilLatex(p),
			solution: `k = ${kk.toLatex()}`,
			steps,
			answer: { kind: 'number', value: kk.toString() },
			params: { case: 'improprio', r: str(r), s: str(s), k: kk.toString() },
		};
		ans.choice = mustChoice(rng, numberOption(kk), shuffle(rng, cands), near);
		return ans;
	}
}

// ---------------------------------------------------------------------------
// Level 6: the line of the pencil through a point

/** "Con k = v il fascio dà …, cioè …". */
function lineAt(p: Pencil, k: R): string {
	const l = combo(p.r, p.s, k);
	const raw = rawEq(l);
	const fin = implicitLatex(l);
	return `\\text{Con } k = ${k.toLatex()} \\text{ il fascio dà } ${raw}${raw === fin ? '' : `\\text{, cioè } ${fin}`}`;
}

function build6(rng: Rng, seed: number): Sample {
	const excluded = rng.next() < 0.25;
	for (;;) {
		const p = properPencil(rng, 0.2);
		const C = p.C!;
		const { r, s } = p;
		let A: Pt;
		if (excluded) {
			const t = q(nz(rng, -2, 2));
			A = [C[0].sub(t.mul(s[1])), C[1].add(t.mul(s[0]))];
		} else A = [q(rng.int(-5, 5)), q(rng.int(-5, 5))];
		if (A.some((c) => Math.abs(c.num) > 7)) continue;
		if (A[0].equals(C[0]) && A[1].equals(C[1])) continue;
		const rA = evalLine(r, A);
		const sA = evalLine(s, A);
		if (rA.isZero()) continue; // A on r: k = 0
		if (!excluded && sA.isZero()) continue;
		const steps = [
			`\\text{Raccogli } k\\text{: } ${genForm(p)}`,
			`\\text{Sostituisci le coordinate di } A\\text{: } ${subst(r, A)} + k(${subst(s, A)}) = 0`,
		];
		const problem = `\\begin{gathered} ${pencilLatex(p)} \\\\ A${ptLatex(A)} \\end{gathered}`;
		const prompt = 'Trova la retta del fascio che passa per A.';
		const base = { r: str(r), s: str(s), C: str(C), A: str(A) };
		if (excluded) {
			steps.push(
				`\\Rightarrow ${rA.toLatex()} + 0 \\cdot k = 0\\text{, cioè } ${rA.toLatex()} = 0\\text{: falso per ogni } k`,
				`A \\text{ sta sulla retta esclusa, perché } ${subst(s, A)} = 0\\text{: la retta per } C \\text{ e } A \\text{ è } s\\text{: } ${implicitLatex(s)}`,
			);
			const answer = mustChoice(rng, lineOption(s), [NONE, lineOption(r), ALL], []);
			return { generatorId: ID, level: 6, seed, prompt, problem, solution: implicitLatex(s), steps, answer, params: { case: 'esclusa', ...base } };
		}
		const k = rA.neg().div(sA);
		if (k.den > 6 || Math.abs(k.num) > 12) continue;
		const l = combo(r, s, k);
		if (normLine(l)!.some((c) => Math.abs(c.num) > 20)) continue;
		steps.push(`\\Rightarrow ${join([rA.toLatex(), term(sA, 'k')])} = 0 \\Rightarrow k = ${k.toLatex()}`, lineAt(p, k));
		const cands: ChoiceOption[] = [];
		const wrong = combo(r, s, k.neg()); // the sign of k
		if (normLine(wrong)) cands.push(lineOption(wrong));
		const Aswap: Pt = [A[1], A[0]];
		const sw = evalLine(s, Aswap);
		if (!sw.isZero()) {
			const w = combo(r, s, evalLine(r, Aswap).neg().div(sw)); // x and y of A exchanged
			if (normLine(w)) cands.push(lineOption(w));
		}
		cands.push(lineOption(r), lineOption(s));
		const answer = mustChoice(rng, lineOption(l), shuffle(rng, cands), nearLines(C, slopeOf(l), 'implicit'));
		return { generatorId: ID, level: 6, seed, prompt, problem, solution: implicitLatex(l), steps, answer, params: { case: 'punto', ...base, k: k.toString() } };
	}
}

// ---------------------------------------------------------------------------
// Level 7: parallel or perpendicular to a given line

type Case7 = 'parallela' | 'perpendicolare' | 'esclusa' | 'verticale';

/** A line with slope m (null: vertical) not through C, written implicit or explicit. */
function givenLine(rng: Rng, m: R | null, C: Pt): { d: Line; tex: string } | null {
	for (let t = 0; t < 50; t++) {
		let d: Line;
		let tex: string;
		if (m === null) {
			d = [ONE, ZERO, q(nz(rng, -6, 6))];
			tex = implicitLatex(d);
		} else if (m.isZero()) {
			d = [ZERO, ONE, q(nz(rng, -6, 6))];
			tex = implicitLatex(d);
		} else if (rng.next() < 0.6) {
			d = normLine([m, ONE.neg(), q(rng.int(-9, 9))])!;
			tex = rawEq(d);
		} else {
			d = [m, ONE.neg(), q(rng.int(-5, 5))];
			tex = explicitLatex(d);
		}
		if (!evalLine(d, C).isZero()) return { d, tex };
	}
	return null;
}

function build7(rng: Rng, seed: number): Sample {
	const u = rng.next();
	const kase: Case7 = u < 0.35 ? 'parallela' : u < 0.7 ? 'perpendicolare' : u < 0.85 ? 'esclusa' : 'verticale';
	for (;;) {
		const p = properPencil(rng, kase === 'esclusa' || kase === 'verticale' ? 0 : 0.15);
		const C = p.C!;
		const { r, s } = p;
		const ms = slopeOf(s);
		let rel: 'parallela' | 'perpendicolare';
		let mt: R | null; // slope of the answer (null: vertical)
		let md: R | null; // slope of the given line
		if (kase === 'parallela') {
			rel = 'parallela';
			mt = rng.next() < 0.1 ? ZERO : rng.pick(SLOPES);
			md = mt;
		} else if (kase === 'perpendicolare') {
			rel = 'perpendicolare';
			md = rng.pick(SLOPES);
			mt = ONE.neg().div(md);
		} else if (kase === 'esclusa') {
			if (ms === null) continue;
			rel = ms.isZero() || rng.next() < 0.5 ? 'parallela' : 'perpendicolare';
			mt = ms;
			md = rel === 'parallela' ? ms : ONE.neg().div(ms);
		} else {
			if (ms === null) continue;
			rel = rng.next() < 0.6 ? 'perpendicolare' : 'parallela';
			mt = null;
			md = rel === 'parallela' ? null : ZERO;
		}
		const given = givenLine(rng, md, C);
		if (!given) continue;
		const { d, tex } = given;
		const ans = through(C, mt);
		const N = linK(r[0], s[0]);
		const D = linK(r[1], s[1]);
		const steps: string[] = [];
		const dSlope = md === null ? `d \\text{ è verticale}` : `d \\text{ ha } m = ${md.toLatex()}`;
		let k: R | null = null;
		if (kase === 'verticale') {
			k = r[1].neg().div(s[1]);
			if (k.isZero()) continue;
			steps.push(
				`${dSlope}\\text{: la retta cercata è verticale e non ha coefficiente angolare}`,
				`\\text{Annulla il coefficiente di } y\\text{: } ${D} = 0 \\Rightarrow k = ${k.toLatex()}`,
				lineAt(p, k),
			);
		} else {
			const mAns = mt!;
			const kZero = s[1].isZero() ? null : r[1].neg().div(s[1]);
			steps.push(
				`\\text{Nel fascio } a = ${N} \\text{ e } b = ${D}\\text{, quindi } m = -\\frac{${N}}{${D}}${kZero ? `\\text{ per } k \\neq ${kZero.toLatex()}` : ''}`,
				rel === 'parallela' ? `${dSlope}\\text{: la parallela ha lo stesso } m` : `${dSlope}\\text{: la perpendicolare ha } m = ${mAns.toLatex()}`,
			);
			// a + a2 k = -m (b + b2 k)  ->  (a2 + m b2) k = -(a + m b)
			const coefK = s[0].add(mAns.mul(s[1]));
			const rhs = r[0].add(mAns.mul(r[1])).neg();
			const mn = mAns.neg();
			const right = mn.isZero() ? '0' : mn.isOne() ? D : mn.neg().isOne() ? `-(${D})` : `${mn.toLatex()}(${D})`;
			steps.push(`-\\frac{${N}}{${D}} = ${mAns.toLatex()} \\Rightarrow ${N} = ${right}`);
			if (kase === 'esclusa') {
				steps.push(
					`\\Rightarrow ${join([term(coefK, 'k') || '0 \\cdot k'])} = ${rhs.toLatex()}\\text{: impossibile, nessun valore di } k \\text{ dà } m = ${mAns.toLatex()}`,
					`\\text{La retta esclusa } s\\text{: } ${implicitLatex(s)} \\text{ ha } m = ${mAns.toLatex()} \\text{ e passa per } C${ptLatex(C)}\\text{: è lei la retta cercata}`,
				);
			} else {
				if (coefK.isZero()) continue;
				k = rhs.div(coefK);
				if (k.isZero() || k.den > 9 || Math.abs(k.num) > 12) continue;
				steps.push(`\\Rightarrow ${term(coefK, 'k')} = ${rhs.toLatex()} \\Rightarrow k = ${k.toLatex()}`, lineAt(p, k));
			}
		}
		if (k && !keyOf(combo(r, s, k)).split(',').every((c) => Math.abs(Number(c)) <= 20)) continue;
		if (k && keyOf(combo(r, s, k)) !== keyOf(ans)) throw new Error(`${ID}: k does not give the answer`);
		steps.push(`\\text{Verifica: la retta passa per } C${ptLatex(C)}\\text{, perché } ${subst(normLine(ans)!, C)} = 0`);
		// distractors
		const cands: ChoiceOption[] = [];
		if (kase === 'esclusa' || kase === 'verticale') cands.push(NONE); // the impossible equation read as "no line"
		const swap = rel === 'parallela' ? (md === null ? ZERO : md.isZero() ? null : ONE.neg().div(md)) : md; // parallel and perpendicular exchanged
		cands.push(lineOption(through(C, swap)));
		if (rel === 'perpendicolare' && md && !md.isZero()) {
			cands.push(lineOption(through(C, md.neg()))); // -m instead of -1/m
			cands.push(lineOption(through(C, ONE.div(md)))); // 1/m: the minus forgotten
		}
		if (rel === 'parallela' && md && !md.isZero()) cands.push(lineOption(through(C, md.neg()))); // m = a/b
		const mistakes = shuffle(rng, cands.slice(kase === 'esclusa' || kase === 'verticale' ? 1 : 0));
		const ordered = kase === 'esclusa' || kase === 'verticale' ? [NONE, ...mistakes] : mistakes;
		ordered.push(lineOption(r));
		if (kase !== 'esclusa') ordered.push(lineOption(s));
		const answer = mustChoice(rng, lineOption(ans), ordered, nearLines(C, mt, 'implicit'));
		const problem = `\\begin{gathered} ${pencilLatex(p)} \\\\ d: ${tex} \\end{gathered}`;
		return {
			generatorId: ID,
			level: 7,
			seed,
			prompt: `Trova la retta del fascio ${rel} alla retta d.`,
			problem,
			solution: implicitLatex(ans),
			steps,
			answer,
			params: { case: kase, relation: rel, r: str(r), s: str(s), C: str(C), d: str(d), ...(k ? { k: k.toString() } : {}) },
		};
	}
}

// ---------------------------------------------------------------------------
// Checks

const FORBIDDEN: [string, RegExp][] = [
	['1x', /(?<![\d}])1\s*[a-z(]/],
	['0x', /(?<![\d}])0\s*[a-z(]/],
	['+ -', /\+\s*-/],
	['- -', /-\s*-/],
	['+ +', /\+\s*\+/],
	['termine nullo', /[+-]\s*0(?!\d)/],
];

function checkChoice(ch: ChoiceAnswer | undefined, v: string[]) {
	if (!ch) return v.push('manca la scelta multipla');
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni con lo stesso testo');
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push('indice della risposta fuori intervallo');
}

const pt = (xs: unknown) => lineOf(xs as string[]).slice(0, 2) as Pt;
const isInt = (p: Pt, max: number) => p.every((c) => c.isInteger() && Math.abs(c.num) <= max);

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	for (const [n, rx] of FORBIDDEN) if (rx.test(sample.problem)) v.push(`testo con '${n}': ${sample.problem}`);
	if (!sample.steps.length) v.push('niente passaggi');
	if (/\\begin\{(aligned|gathered|array)\}/.test(sample.solution + sample.steps.join(' '))) v.push('ambiente nella soluzione o nei passaggi');
	const a = sample.answer;
	const ch = a.kind === 'choice' ? a : sample.choice;
	const correctKey = ch && ch.options[ch.correct] ? ch.options[ch.correct].values.join('|') : '';
	const lvl = sample.level;
	if (lvl >= 3 && lvl !== 5) {
		const r = lineOf(p.r as string[]);
		const s = lineOf(p.s as string[]);
		const C = pt(p.C);
		if (!evalLine(r, C).isZero() || !evalLine(s, C).isZero()) v.push('il centro non sta sulle generatrici');
		if (parallel(r, s)) v.push('generatrici parallele in un fascio proprio');
		if (!isInt(C, 4)) v.push('centro con coordinate intere da -4 a 4');
		if ([...r, ...s].some((c) => !c.isInteger() || Math.abs(c.num) > 9)) v.push('coefficienti delle generatrici oltre 9');
	}
	switch (lvl) {
		case 1: {
			const C = pt(p.C);
			const A = pt(p.A);
			if (!isInt(C, 5) || !isInt(A, 8)) v.push('punti fuori intervallo');
			const vertical = A[0].equals(C[0]);
			if (vertical !== (p.case === 'verticale')) v.push('caso sbagliato');
			if (A[0].equals(C[0]) && A[1].equals(C[1])) v.push('A coincide con C');
			if (vertical) {
				if (correctKey !== keyOf([ONE, ZERO, C[0].neg()])) v.push('la risposta non è la verticale');
			} else {
				const m = A[1].sub(C[1]).div(A[0].sub(C[0]));
				const l = through(C, m);
				if (a.kind !== 'expression' || a.latex !== explicitLatex(l)) v.push('risposta diversa dalla retta CA');
				if (correctKey !== keyOf(l)) v.push('l’opzione giusta non è la retta CA');
			}
			break;
		}
		case 2: {
			const d = lineOf(p.d as string[]);
			const P = pt(p.P);
			if (evalLine(d, P).isZero()) v.push('P sta su r');
			const l = normLine([d[0], d[1], d[0].mul(P[0]).add(d[1].mul(P[1])).neg()])!;
			if (correctKey !== keyOf(l)) v.push('l’opzione giusta non è la parallela per P');
			if (a.kind === 'expression' && a.latex !== explicitLatex(l)) v.push('risposta diversa dalla parallela per P');
			break;
		}
		case 3:
			if (correctKey !== (p.C as string[]).join('|')) v.push('l’opzione giusta non è il centro');
			break;
		case 4:
			if (correctKey !== keyOf(lineOf(p.s as string[]))) v.push('l’opzione giusta non è la retta esclusa');
			break;
		case 5: {
			const r = lineOf(p.r as string[]);
			const s = lineOf(p.s as string[]);
			if (!parallel(r, s)) v.push('generatrici non parallele');
			const k = R_(p.k);
			const l = combo(r, s, k);
			if (!l[0].isZero() || !l[1].isZero() || l[2].isZero()) v.push('con k i coefficienti non si annullano, o 0 = 0');
			if (a.kind !== 'number' || a.value !== k.toString()) v.push('risposta diversa da k');
			if (correctKey !== k.toString()) v.push('l’opzione giusta non è k');
			break;
		}
		case 6: {
			const r = lineOf(p.r as string[]);
			const s = lineOf(p.s as string[]);
			const A = pt(p.A);
			const truth = p.case === 'esclusa' ? s : combo(r, s, R_(p.k));
			if (!evalLine(truth, A).isZero()) v.push('la retta non passa per A');
			if (p.case === 'esclusa' && !evalLine(r, A).add(evalLine(s, A)).equals(evalLine(r, A))) v.push('A non sta sulla retta esclusa');
			if (correctKey !== keyOf(truth)) v.push('l’opzione giusta non è la retta per A');
			break;
		}
		case 7: {
			const d = lineOf(p.d as string[]);
			const C = pt(p.C);
			if (evalLine(d, C).isZero()) v.push('d passa per il centro');
			const opt = ch?.options[ch.correct];
			const l = opt && opt.values[0].includes(',') ? lineOf(opt.values[0].split(',')) : null;
			if (!l || !evalLine(l, C).isZero()) v.push('la risposta non passa per il centro');
			else {
				const dot = l[0].mul(d[0]).add(l[1].mul(d[1]));
				if (p.relation === 'parallela' ? !parallel(l, d) : !dot.isZero()) v.push('la risposta non ha la proprietà chiesta');
			}
			break;
		}
		default:
			v.push(`livello sconosciuto ${lvl}`);
	}
	checkChoice(ch, v);
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.choice) return sample.choice;
	if (sample.level === 1) return choice1(sample, rng);
	if (sample.level === 2) return choice2(sample, rng);
	throw new Error(`${ID}: no choice for level ${sample.level}`);
}

function buildLevel(rng: Rng, level: number): Sample {
	const seed = rng.seed;
	switch (level) {
		case 1:
		case 2: {
			const s = level === 1 ? build1(rng, seed) : build2(rng, seed);
			if (s.answer.kind !== 'choice') s.choice = level === 1 ? choice1(s, rng) : choice2(s, rng);
			return s;
		}
		case 3:
			return build3(rng, seed);
		case 4:
			return build4(rng, seed);
		case 5:
			return build5(rng, seed);
		case 6:
			return build6(rng, seed);
		case 7:
			return build7(rng, seed);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

export const rettaFasci: Generator = {
	id: ID,
	title: 'Fasci di rette',
	levels: {
		1: { label: 'Fascio proprio: la retta per un punto', constraints: ['centro con coordinate intere da -5 a 5', 'A intero fino a 8', 'una volta su sette A ha l’ascissa di C: la risposta è la verticale'] },
		2: { label: 'Fascio improprio: la parallela per un punto', constraints: ['r implicita, esplicita o verticale', 'P non sta su r', 'coefficiente angolare fra quelli piccoli della lezione'] },
		3: { label: 'Il centro di un fascio con k', constraints: ['centro intero da -4 a 4', 'generatrici incidenti con coefficienti fino a 9', 'una volta su quattro una generatrice parallela a un asse'] },
		4: { label: 'La retta esclusa', constraints: ['come il livello 3', 'la risposta è la generatrice moltiplicata per k'] },
		5: { label: 'Fascio improprio con k', constraints: ['generatrici parallele e distinte', 'il valore di k che annulla i coefficienti è intero'] },
		6: { label: 'La retta del fascio per un punto', constraints: ['un quarto dei punti sulla retta esclusa', 'altrimenti k con denominatore fino a 6'] },
		7: { label: 'Parallela o perpendicolare nel fascio', constraints: ['parallela 35 %, perpendicolare 35 %, retta esclusa 15 %, retta verticale 15 %', 'd non passa per il centro'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const sample = buildLevel(rng, level);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default rettaFasci;
