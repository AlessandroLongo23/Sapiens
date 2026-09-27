/**
 * Determinanti e regola di Cramer. Spec: specs/exercises/sistemi-cramer.md
 *
 * Seven levels in the order of lesson 69: the determinant of a 2 × 2 matrix; Cramer's rule on a system in normal
 * form with an integer solution; a system to bring to normal form first (brackets, denominators, a term on the
 * other side, a missing unknown), with a solution that may be a fraction; the discussion with D = 0 (which system
 * is impossible or indeterminate, or the coefficient that makes D zero); a system with a parameter k to discuss;
 * the determinant of a 3 × 3 matrix with Sarrus; a system of three equations in three unknowns.
 *
 * Everything is built backwards: the solution (or the values of k that cancel D, and what happens there) is
 * chosen first, then the coefficients. The pair or triple that solves a system, and a whole discussion, are
 * `choice` answers (no answer type has two fields); determinants and the value of a coefficient are `number`
 * answers with a multiple-choice variant. The distractors are the mistakes the lesson warns about.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, lcm, q } from '../rational';
import { paren, polyMul, polySub, polyToLatex } from '../latex';
import { assembleChoice } from '../insiemi';

export const ID = 'sistemi-cramer';

type R = Rational;
const ZERO = q(0);

// ---------------------------------------------------------------------------
// Small helpers

const nz = (rng: Rng, a: number, b: number): number => {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
};
const det2 = (a: R, b: R, c: R, d: R): R => a.mul(d).sub(b.mul(c));
const R_ = (s: unknown): R => Rational.parse(String(s));

/** "2x", "-x", "x", "" (zero), with a rational coefficient written as \frac before the letter. */
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

const VARS2 = ['x', 'y'];
const VARS3 = ['x', 'y', 'z'];

/** Left side in normal form: ax + by (+ cz). */
const lin = (cs: R[], vars: string[]) => join(cs.map((c, i) => term(c, vars[i])));
const eqNormal = (row: R[], vars: string[]) => `${lin(row.slice(0, vars.length), vars)} = ${row[vars.length].toLatex()}`;

const cases = (lines: string[], spaced = false) => `\\begin{cases} ${lines.join(spaced ? ' \\\\[4pt] ' : ' \\\\ ')} \\end{cases}`;
const vm2 = (a: string, b: string, c: string, d: string) => `\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix}`;
const vm3 = (m: R[][]) => `\\begin{vmatrix} ${m.map((r) => r.map((x) => x.toLatex()).join(' & ')).join(' \\\\ ')} \\end{vmatrix}`;

const tuple = (xs: R[]) => `\\left(${xs.map((x) => x.toLatex()).join(', ')}\\right)`;
const tupleOption = (xs: R[]): ChoiceOption => ({ latex: tuple(xs), values: xs.map((x) => x.toString()) });
const numberOption = (x: R): ChoiceOption => ({ latex: x.toLatex(), values: [x.toString()] });
const sameTuple = (a: R[], b: R[]) => a.length === b.length && a.every((x, i) => x.equals(b[i]));

/** "a · d - b · c" with the negative factors in brackets, as in the lesson. */
const cross = (a: R, b: R, c: R, d: R) => `${a.toLatex()} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)}`;

function mustChoice(rng: Rng, correct: ChoiceOption, cands: (ChoiceOption | null)[], near: () => ChoiceOption[]): ChoiceAnswer {
	const ch = assembleChoice(rng, correct, [...cands, ...near()]);
	if (!ch) throw new Error(`${ID}: not enough distinct options`);
	return ch;
}

function nearNumbers(v: R): ChoiceOption[] {
	const out: ChoiceOption[] = [];
	for (let d = 1; d < 30; d++) out.push(numberOption(v.add(q(d))), numberOption(v.sub(q(d))));
	return out;
}

function nearTuples(v: R[]): ChoiceOption[] {
	const out: ChoiceOption[] = [];
	for (let d = 1; d < 6; d++)
		for (let i = 0; i < v.length; i++) {
			out.push(tupleOption(v.map((x, j) => (j === i ? x.add(q(d)) : x))));
			out.push(tupleOption(v.map((x, j) => (j === i ? x.sub(q(d)) : x))));
		}
	return out;
}

// ---------------------------------------------------------------------------
// Cramer on a 2 × 2 system in normal form (rows a, b, c)

interface Cramer {
	D: R;
	Dx: R;
	Dy: R;
}
const cramer = (r1: R[], r2: R[]): Cramer => ({
	D: det2(r1[0], r1[1], r2[0], r2[1]),
	Dx: det2(r1[2], r1[1], r2[2], r2[1]),
	Dy: det2(r1[0], r1[2], r2[0], r2[2]),
});

/** "\\frac{n}{d} = v", without the second half when the quotient is already written that way. */
function quot(n: R, d: R): string {
	const f = `\\frac{${n.toLatex()}}{${d.toLatex()}}`;
	const v = n.div(d).toLatex();
	return f === v || (d.isOne() && n.isInteger()) ? v : `${f} = ${v}`;
}

function cramerSteps(r1: R[], r2: R[]): string[] {
	const { D, Dx, Dy } = cramer(r1, r2);
	const L = (x: R) => x.toLatex();
	return [
		`D = ${vm2(L(r1[0]), L(r1[1]), L(r2[0]), L(r2[1]))} = ${cross(r1[0], r1[1], r2[0], r2[1])} = ${L(D)}`,
		`D \\neq 0\\text{: il sistema è determinato. I termini noti prendono il posto della colonna di } x \\text{ e poi di quella di } y`,
		`D_x = ${vm2(L(r1[2]), L(r1[1]), L(r2[2]), L(r2[1]))} = ${cross(r1[2], r1[1], r2[2], r2[1])} = ${L(Dx)}`,
		`D_y = ${vm2(L(r1[0]), L(r1[2]), L(r2[0]), L(r2[2]))} = ${cross(r1[0], r1[2], r2[0], r2[2])} = ${L(Dy)}`,
		`x = \\frac{D_x}{D} = ${quot(Dx, D)} \\qquad y = \\frac{D_y}{D} = ${quot(Dy, D)}`,
	];
}

/** The mistakes of levels 2 and 3 for a solved system (x, y), from its normal form. */
function pairMistakes(r1: R[], r2: R[], sol: R[]): ChoiceOption[] {
	const { D, Dx, Dy } = cramer(r1, r2);
	const out: ChoiceOption[] = [];
	out.push(tupleOption([sol[1], sol[0]])); // x and y swapped
	if (!Dx.isZero() && !Dy.isZero()) out.push(tupleOption([D.div(Dx), D.div(Dy)])); // quotient upside down
	// the minus in front of a negative product lost: c·b' - (c'·b) written c·b' + c'·b
	const Dx2 = r1[2].mul(r2[1]).add(r2[2].mul(r1[1]));
	const Dy2 = r1[0].mul(r2[2]).add(r2[0].mul(r1[2]));
	out.push(tupleOption([Dx2.div(D), Dy2.div(D)]));
	out.push(tupleOption([sol[0].neg(), sol[1].neg()])); // D with the diagonals exchanged
	return out;
}

// ---------------------------------------------------------------------------
// Level 1: determinant of a 2 × 2 matrix

function build1(rng: Rng, seed: number): Sample {
	for (;;) {
		const m = [nz(rng, -9, 9), nz(rng, -9, 9), nz(rng, -9, 9), nz(rng, -9, 9)].map((v) => q(v));
		if (!m.some((v) => v.sign() < 0)) continue;
		const [a, b, c, d] = m;
		const D = det2(a, b, c, d);
		if (D.isZero() && rng.next() < 0.8) continue;
		const L = (x: R) => x.toLatex();
		return {
			generatorId: ID,
			level: 1,
			seed,
			prompt: 'Calcola il determinante.',
			problem: vm2(L(a), L(b), L(c), L(d)),
			solution: `${vm2(L(a), L(b), L(c), L(d))} = ${L(D)}`,
			steps: [
				`\\text{Diagonale principale: } ${L(a)} \\cdot ${paren(d)} = ${L(a.mul(d))}`,
				`\\text{Diagonale secondaria: } ${paren(b)} \\cdot ${paren(c)} = ${L(b.mul(c))}`,
				`\\text{Il determinante è il primo prodotto meno il secondo: } ${L(a.mul(d))} - ${paren(b.mul(c))} = ${L(D)}`,
			],
			answer: { kind: 'number', value: D.toString() },
			params: { case: 'determinante', matrix: m.map(String) },
		};
	}
}

function choice1(s: Sample, rng: Rng): ChoiceAnswer {
	const [a, b, c, d] = (s.params.matrix as string[]).map(R_);
	const D = det2(a, b, c, d);
	const ad = a.mul(d);
	const bc = b.mul(c);
	const cands: ChoiceOption[] = [];
	// the sign of a negative product lost (2 - 12 instead of 2 - (-12))
	if (bc.sign() < 0) cands.push(numberOption(ad.sub(bc.abs())));
	else if (ad.sign() < 0) cands.push(numberOption(ad.abs().sub(bc)));
	cands.push(numberOption(ad.add(bc))); // products added
	cands.push(numberOption(D.neg())); // diagonals exchanged
	cands.push(numberOption(a.mul(b).sub(c.mul(d)))); // rows instead of diagonals
	return mustChoice(rng, numberOption(D), cands, () => nearNumbers(D));
}

// ---------------------------------------------------------------------------
// Level 2: Cramer, normal form, integer solution

function build2(rng: Rng, seed: number): Sample {
	for (;;) {
		const sol = [q(rng.int(-6, 6)), q(rng.int(-6, 6))];
		if (sol[0].isZero() && sol[1].isZero()) continue;
		const r1 = [q(nz(rng, -6, 6)), q(nz(rng, -6, 6))];
		const r2 = [q(nz(rng, -6, 6)), q(nz(rng, -6, 6))];
		r1.push(r1[0].mul(sol[0]).add(r1[1].mul(sol[1])));
		r2.push(r2[0].mul(sol[0]).add(r2[1].mul(sol[1])));
		if (Math.abs(r1[2].num) > 40 || Math.abs(r2[2].num) > 40) continue;
		const { D } = cramer(r1, r2);
		if (D.isZero()) continue;
		return {
			generatorId: ID,
			level: 2,
			seed,
			prompt: 'Risolvi il sistema con la regola di Cramer.',
			problem: cases([eqNormal(r1, VARS2), eqNormal(r2, VARS2)]),
			solution: `\\text{La soluzione è la coppia } ${tuple(sol)}`,
			steps: [...cramerSteps(r1, r2), `\\text{Verifica: } ${verifyLatex(r1, sol, VARS2)} \\text{ e } ${verifyLatex(r2, sol, VARS2)}`],
			answer: { kind: 'choice', options: [], correct: 0 },
			params: { case: 'cramer', rows: [r1.map(String), r2.map(String)], solution: sol.map(String) },
		};
	}
}

function verifyLatex(row: R[], sol: R[], vars: string[]): string {
	const parts: string[] = [];
	vars.forEach((_, i) => {
		const c = row[i];
		if (c.isZero()) return;
		const t = c.isOne() ? paren(sol[i]) : c.neg().isOne() ? `-${paren(sol[i])}` : `${c.toLatex()} \\cdot ${paren(sol[i])}`;
		parts.push(t);
	});
	return `${join(parts)} = ${row[vars.length].toLatex()}`;
}

// ---------------------------------------------------------------------------
// Level 3: normal form first

type Form = 'normale' | 'sposta' | 'parentesi' | 'denominatori' | 'manca';

interface Eq3 {
	form: Form;
	tex: string;
	/** Normal form a, b, c with integer coefficients. */
	norm: R[];
	/** The normal form a student gets with the mistake the lesson warns about, if any. */
	naive: R[] | null;
	/** How the equation becomes the normal form, for the steps. */
	how: string;
}

const dterm = (c: R, v: string) => {
	if (c.isInteger()) return term(c, v);
	const n = Math.abs(c.num);
	return `${c.sign() < 0 ? '-' : ''}\\dfrac{${n === 1 ? '' : n}${v}}{${c.den}}`;
};
const dnum = (c: R) => (c.isInteger() ? c.toLatex() : `${c.sign() < 0 ? '-' : ''}\\dfrac{${Math.abs(c.num)}}{${c.den}}`);

/** Integer coefficients a, b (a nonzero unless `ax` is false) with a·x0 + b·y0 an integer of at most 30. */
function intRow(rng: Rng, sol: R[], useX = true, useY = true): R[] | null {
	for (let t = 0; t < 200; t++) {
		const a = useX ? q(nz(rng, -6, 6)) : ZERO;
		const b = useY ? q(nz(rng, -6, 6)) : ZERO;
		const c = a.mul(sol[0]).add(b.mul(sol[1]));
		if (c.isInteger() && Math.abs(c.num) <= 30) return [a, b, c];
	}
	return null;
}

function reduceRow(row: R[]): R[] {
	const L = row.reduce((acc, c) => lcm(acc, c.den), 1);
	const ints = row.map((c) => c.mul(q(L)));
	const g = ints.reduce((acc, c) => gcd(acc, c.num), 0) || 1;
	let out = ints.map((c) => c.div(q(g)));
	const lead = out.find((c) => !c.isZero())!;
	if (lead.sign() < 0 && out.slice(0, 2).every((c) => c.sign() <= 0)) out = out.map((c) => c.neg());
	return out;
}

function buildEq3(rng: Rng, form: Form, sol: R[]): Eq3 | null {
	switch (form) {
		case 'normale': {
			const row = intRow(rng, sol);
			if (!row) return null;
			return { form, tex: eqNormal(row, VARS2), norm: row, naive: null, how: '' };
		}
		case 'sposta': {
			const row = intRow(rng, sol);
			if (!row) return null;
			const [a, b, c] = row;
			if (rng.next() < 0.6) {
				// the y term on the right: ax = -by + c
				const tex = `${term(a, 'x')} = ${join([term(b.neg(), 'y'), c.isZero() ? '' : c.toLatex()])}`;
				return { form, tex, norm: row, naive: [a, b.neg(), c], how: `\\text{porta } ${term(b.neg(), 'y')} \\text{ a primo membro cambiando segno}` };
			}
			// the x term on the right: by = -ax + c
			const tex = `${term(b, 'y')} = ${join([term(a.neg(), 'x'), c.isZero() ? '' : c.toLatex()])}`;
			return { form, tex, norm: row, naive: [a.neg(), b, c], how: `\\text{porta } ${term(a.neg(), 'x')} \\text{ a primo membro cambiando segno}` };
		}
		case 'parentesi': {
			const row = intRow(rng, sol);
			if (!row) return null;
			const [a, b, c] = row;
			const h = q(nz(rng, -4, 4));
			const onX = rng.next() < 0.6;
			const f = onX ? a : b;
			if (f.abs().isOne()) return null;
			const v = onX ? 'x' : 'y';
			const br = `${f.neg().isOne() ? '-' : f.toLatex()}(${join([v, h.toLatex()])})`;
			const rhs = c.add(f.mul(h));
			const tex = onX ? `${join([br, term(b, 'y')])} = ${rhs.toLatex()}` : `${join([term(a, 'x'), br])} = ${rhs.toLatex()}`;
			// the factor multiplied only by the letter: f(v + h) read as f·v + h
			const naive = [a, b, rhs.sub(h)];
			return { form, tex, norm: row, naive, how: `\\text{togli la parentesi e porta } ${f.toLatex()} \\cdot ${paren(h)} = ${f.mul(h).toLatex()} \\text{ a secondo membro}` };
		}
		case 'denominatori': {
			for (let t = 0; t < 200; t++) {
				const al = q(nz(rng, -5, 5), rng.pick([1, 2, 3, 4, 6]));
				const be = q(nz(rng, -5, 5), rng.pick([1, 2, 3, 4, 6]));
				if (al.isInteger() && be.isInteger()) continue;
				const ga = al.mul(sol[0]).add(be.mul(sol[1]));
				if (ga.den > 6 || Math.abs(ga.num) > 12) continue;
				const L = [al, be, ga].reduce((acc, c) => lcm(acc, c.den), 1);
				const norm = reduceRow([al, be, ga]);
				if (norm.some((c) => Math.abs(c.num) > 30)) continue;
				const tex = `${join([dterm(al, 'x'), dterm(be, 'y')])} = ${dnum(ga)}`;
				// only the left side multiplied by the lcm
				const naive = ga.isZero() || L === 1 ? null : [al.mul(q(L)), be.mul(q(L)), ga];
				return { form, tex, norm, naive, how: `\\text{moltiplica i due membri per } ${L}\\text{, il mcm dei denominatori}` };
			}
			return null;
		}
		case 'manca': {
			const onX = rng.next() < 0.5;
			for (let t = 0; t < 100; t++) {
				const f = q(nz(rng, -5, 5));
				const c = f.mul(onX ? sol[0] : sol[1]);
				if (!c.isInteger() || Math.abs(c.num) > 30) continue;
				const norm = onX ? [f, ZERO, c] : [ZERO, f, c];
				return { form, tex: `${term(f, onX ? 'x' : 'y')} = ${c.toLatex()}`, norm, naive: null, how: `\\text{manca } ${onX ? 'y' : 'x'}\\text{, che ha coefficiente } 0` };
			}
			return null;
		}
	}
}

const FORMS3: Form[] = ['sposta', 'parentesi', 'denominatori', 'manca'];

function build3(rng: Rng, seed: number): Sample {
	for (;;) {
		let sol: R[];
		if (rng.next() < 0.3) sol = [q(nz(rng, -6, 6)), q(rng.int(-6, 6))];
		else {
			const d = rng.pick([2, 3, 4, 5]);
			sol = [q(rng.int(-9, 9), d), q(rng.int(-9, 9), rng.pick([1, 1, 2, 3]))];
			if (rng.next() < 0.5) sol = [sol[1], sol[0]];
			if (sol.every((s) => s.isInteger())) continue;
			if (sol.some((s) => Math.abs(s.num / s.den) > 6)) continue;
		}
		const f1 = rng.pick(FORMS3);
		const f2: Form = rng.pick([...FORMS3.filter((f) => f !== 'manca' || f1 !== 'manca'), 'normale']);
		const order = rng.next() < 0.5;
		const e1 = buildEq3(rng, order ? f1 : f2, sol);
		const e2 = buildEq3(rng, order ? f2 : f1, sol);
		if (!e1 || !e2) continue;
		const { D } = cramer(e1.norm, e2.norm);
		if (D.isZero()) continue;
		if (e1.tex === e2.tex) continue;
		const spaced = [e1, e2].some((e) => e.form === 'denominatori');
		const steps: string[] = [];
		[e1, e2].forEach((e, i) => {
			if (e.form === 'normale') return;
			steps.push(`\\text{${i === 0 ? 'Prima' : 'Seconda'} equazione: }${e.how}\\text{: } ${eqNormal(e.norm, VARS2)}`);
		});
		steps.push(`\\text{In forma normale: } ${cases([eqNormal(e1.norm, VARS2), eqNormal(e2.norm, VARS2)])}`);
		steps.push(...cramerSteps(e1.norm, e2.norm));
		return {
			generatorId: ID,
			level: 3,
			seed,
			prompt: 'Porta il sistema in forma normale e risolvilo con la regola di Cramer.',
			problem: cases([e1.tex, e2.tex], spaced),
			solution: `\\text{La soluzione è la coppia } ${tuple(sol)}`,
			steps,
			answer: { kind: 'choice', options: [], correct: 0 },
			params: {
				case: [e1.form, e2.form].includes('manca') ? 'manca' : [e1.form, e2.form].includes('denominatori') ? 'denominatori' : 'altro',
				forms: [e1.form, e2.form],
				rows: [e1.norm.map(String), e2.norm.map(String)],
				naive: [e1.naive?.map(String) ?? null, e2.naive?.map(String) ?? null],
				solution: sol.map(String),
			},
		};
	}
}

function choicePair(s: Sample, rng: Rng): ChoiceAnswer {
	const rows = (s.params.rows as string[][]).map((r) => r.map(R_));
	const sol = (s.params.solution as string[]).map(R_);
	const cands: ChoiceOption[] = [];
	const naive = (s.params.naive as (string[] | null)[] | undefined) ?? [];
	if (naive.some((n) => n)) {
		// the normal form read with the mistake of the lesson, then solved correctly
		const n1 = naive[0] ? naive[0].map(R_) : rows[0];
		const n2 = naive[1] ? naive[1].map(R_) : rows[1];
		const c = cramer(n1, n2);
		if (!c.D.isZero()) cands.push(tupleOption([c.Dx.div(c.D), c.Dy.div(c.D)]));
	}
	cands.push(...pairMistakes(rows[0], rows[1], sol));
	return mustChoice(rng, tupleOption(sol), cands, () => nearTuples(sol));
}

// ---------------------------------------------------------------------------
// Level 4: D = 0

type Kind = 'impossibile' | 'indeterminato' | 'determinato';

function classify(r1: R[], r2: R[]): Kind {
	const { D, Dx, Dy } = cramer(r1, r2);
	if (!D.isZero()) return 'determinato';
	return Dx.isZero() && Dy.isZero() ? 'indeterminato' : 'impossibile';
}

const sysValues = (r1: R[], r2: R[]) => [`${r1.join(',')};${r2.join(',')}`];

function build4(rng: Rng, seed: number): Sample {
	const u = rng.next();
	if (u < 0.6) return build4a(rng, seed, u < 0.3 ? 'impossibile' : 'indeterminato');
	return build4b(rng, seed);
}

/** A system with D = 0 of the given kind, or determinate with a coefficient changed. */
function zeroSystem(rng: Rng, p: R, qq: R, kind: Kind): R[][] {
	const t = q(rng.pick([2, 3, -2, -1, -3]));
	const c2 = q(nz(rng, -6, 6));
	let r1 = [t.mul(p), t.mul(qq), t.mul(c2)];
	const r2 = [p, qq, c2];
	if (kind === 'impossibile') r1[2] = r1[2].add(q(nz(rng, -3, 3)));
	if (kind === 'determinato') r1 = [r1[0].add(q(nz(rng, -2, 2))), r1[1], r1[2]];
	return rng.next() < 0.5 ? [r1, r2] : [r2, r1];
}

function build4a(rng: Rng, seed: number, asked: Kind): Sample {
	for (;;) {
		const p = q(nz(rng, -4, 4));
		const qq = q(nz(rng, -4, 4));
		const other: Kind = asked === 'impossibile' ? 'indeterminato' : 'impossibile';
		const systems = [zeroSystem(rng, p, qq, asked), zeroSystem(rng, p, qq, other), zeroSystem(rng, p, qq, other), zeroSystem(rng, p, qq, 'determinato')];
		if (!systems.every(([a, b]) => [...a, ...b].every((c) => Math.abs(c.num) <= 20))) continue;
		if (systems.some(([a, b]) => a[0].isZero() || a[1].isZero() || b[0].isZero() || b[1].isZero())) continue;
		if (systems.some(([a, b], i) => classify(a, b) !== [asked, other, other, 'determinato'][i])) continue;
		const opts = systems.map(([a, b]) => ({ latex: cases([eqNormal(a, VARS2), eqNormal(b, VARS2)]), values: sysValues(a, b) }));
		if (new Set(opts.map((o) => o.latex)).size !== 4) continue;
		const ch = assembleChoice(rng, opts[0], opts.slice(1));
		if (!ch) continue;
		const [a, b] = systems[0];
		const { D, Dx, Dy } = cramer(a, b);
		const L = (x: R) => x.toLatex();
		const steps = [
			`\\text{I sistemi con } D = 0 \\text{ hanno i coefficienti delle incognite proporzionali: per esempio } ${vm2(L(a[0]), L(a[1]), L(b[0]), L(b[1]))} = ${cross(a[0], a[1], b[0], b[1])} = 0`,
			`D_x = ${vm2(L(a[2]), L(a[1]), L(b[2]), L(b[1]))} = ${L(Dx)} \\qquad D_y = ${vm2(L(a[0]), L(a[2]), L(b[0]), L(b[2]))} = ${L(Dy)}`,
			asked === 'impossibile'
				? `\\text{Qui } D = 0 \\text{ e } ${Dx.isZero() ? 'D_y' : 'D_x'} \\neq 0\\text{: il sistema è impossibile}`
				: `\\text{Qui } D = D_x = D_y = 0\\text{: il sistema è indeterminato}`,
			`\\text{Degli altri tre, uno ha } D \\neq 0 \\text{ (è determinato) e due sono ${other === 'impossibile' ? 'impossibili' : 'indeterminati'}}`,
		];
		void D;
		return {
			generatorId: ID,
			level: 4,
			seed,
			prompt: `Quale di questi sistemi è ${asked}?`,
			problem: '\\text{Per ogni sistema calcola i tre determinanti.}',
			solution: `\\text{Il sistema ${asked} è } ${cases([eqNormal(a, VARS2), eqNormal(b, VARS2)])}`,
			steps,
			answer: ch,
			params: { case: asked, systems: systems.map(([x, y]) => [x.map(String), y.map(String)]) },
		};
	}
}

/** A function of k that is linear, as coefficients [constant, slope]. */
const rootLin = (f: (k: R) => R): R[] => [f(ZERO), f(q(1)).sub(f(ZERO))];
/** The value of k that makes a linear function zero, or null. */
const rootOf = (f: (k: R) => R): R | null => {
	const [f0, slope] = rootLin(f);
	return slope.isZero() ? null : f0.neg().div(slope);
};

function build4b(rng: Rng, seed: number): Sample {
	for (;;) {
		const m = [q(nz(rng, -6, 6)), q(nz(rng, -6, 6)), q(nz(rng, -6, 6)), q(nz(rng, -6, 6))];
		const pos = rng.int(0, 3);
		const withK = (k: R) => m.map((v, i) => (i === pos ? k : v));
		const kv = rootOf((k) => {
			const [a, b, c, d] = withK(k);
			return det2(a, b, c, d);
		});
		if (!kv || !kv.isInteger() || kv.isZero() || Math.abs(kv.num) > 12) continue;
		const c1 = q(rng.int(-9, 9));
		const c2 = q(rng.int(-9, 9));
		const coefTex = (i: number) => (i === pos ? null : m[i]);
		const row = (i: number, c: R) => {
			const ts = [0, 1].map((j) => {
				const cc = coefTex(2 * i + j);
				return cc === null ? `k${VARS2[j]}` : term(cc, VARS2[j]);
			});
			return `${join(ts)} = ${c.toLatex()}`;
		};
		const [a, b, c, d] = withK(kv);
		const cell = (i: number) => (i === pos ? 'k' : m[i].toLatex());
		const kind = classify([a, b, c1], [c, d, c2]);
		const Dk = rootLin((k) => {
			const [a1, b1, c1_, d1] = withK(k);
			return det2(a1, b1, c1_, d1);
		});
		return {
			generatorId: ID,
			level: 4,
			seed,
			prompt: 'Trova il valore di k per cui il sistema non è determinato.',
			problem: cases([row(0, c1), row(1, c2)]),
			solution: `k = ${kv.toLatex()}`,
			steps: [
				`\\text{Il sistema non è determinato quando } D = 0`,
				`D = ${vm2(cell(0), cell(1), cell(2), cell(3))} = ${polyToLatex(Dk, 'k')}`,
				`D = 0 \\text{ per } k = ${kv.toLatex()}`,
				`\\text{Con } k = ${kv.toLatex()} \\text{ il sistema è ${kind}}`,
			],
			answer: { kind: 'number', value: kv.toString() },
			params: { case: 'valore', matrix: m.map(String), position: pos, constants: [c1.toString(), c2.toString()], k: kv.toString() },
		};
	}
}

function choice4b(s: Sample, rng: Rng): ChoiceAnswer {
	const m = (s.params.matrix as string[]).map(R_);
	const pos = s.params.position as number;
	const kv = R_(s.params.k);
	const withK = (k: R) => m.map((v, i) => (i === pos ? k : v));
	const cands: (ChoiceOption | null)[] = [numberOption(kv.neg())]; // sign of the secondary diagonal
	const byCols = rootOf((k) => {
		const [a, b, c, d] = withK(k);
		return a.mul(c).sub(b.mul(d)); // products down the columns
	});
	const byRows = rootOf((k) => {
		const [a, b, c, d] = withK(k);
		return a.mul(b).sub(c.mul(d)); // products along the rows
	});
	cands.push(byCols ? numberOption(byCols) : null, byRows ? numberOption(byRows) : null);
	return mustChoice(rng, numberOption(kv), cands, () => nearNumbers(kv));
}

// ---------------------------------------------------------------------------
// Level 5: a parameter k

/** Polynomial in k, ascending coefficients. */
type P = R[];
const pTrim = (p: P): P => {
	const o = [...p];
	while (o.length && o[o.length - 1].isZero()) o.pop();
	return o;
};
const pDeg = (p: P) => pTrim(p).length - 1;
const pEval = (p: P, r: number): R => p.reduceRight((acc, c) => acc.mul(q(r)).add(c), ZERO);
function pDivRoot(p: P, r: number): P {
	const t = pTrim(p);
	const out: R[] = new Array(Math.max(0, t.length - 1));
	let carry = ZERO;
	for (let i = t.length - 1; i >= 1; i--) {
		carry = carry.mul(q(r)).add(t[i]);
		out[i - 1] = carry;
	}
	return out;
}
const pStr = (p: P): string => {
	const t = pTrim(p);
	if (!t.length) return '0';
	return t.map((c, i) => `(${c.toString()})*k**${i}`).join('+');
};

/** Integer roots of p with multiplicity, when p splits into them completely; null otherwise. */
function intRoots(p: P): number[] | null {
	let t = pTrim(p);
	const roots: number[] = [];
	while (t.length > 1) {
		let found = false;
		for (let r = -8; r <= 8; r++) {
			if (pEval(t, r).isZero()) {
				roots.push(r);
				t = pTrim(pDivRoot(t, r));
				found = true;
				break;
			}
		}
		if (!found) return null;
	}
	return roots;
}

/** A rational function N/M in k, reduced: no common root, integer coefficients without common factor, M with positive leading coefficient. */
interface RF {
	N: P;
	M: P;
}
function rfReduce(N0: P, M0: P, roots: number[]): RF {
	let N = pTrim(N0);
	let M = pTrim(M0);
	for (const r of roots) {
		if (pDeg(M) >= 1 && pEval(M, r).isZero() && (N.length === 0 || pEval(N, r).isZero())) {
			M = pTrim(pDivRoot(M, r));
			N = N.length ? pTrim(pDivRoot(N, r)) : N;
		}
	}
	const all = [...N, ...M];
	const L = all.reduce((acc, c) => lcm(acc, c.den), 1);
	N = N.map((c) => c.mul(q(L)));
	M = M.map((c) => c.mul(q(L)));
	const g = [...N, ...M].reduce((acc, c) => gcd(acc, c.num), 0) || 1;
	N = N.map((c) => c.div(q(g)));
	M = M.map((c) => c.div(q(g)));
	if (M[M.length - 1].sign() < 0) {
		N = N.map((c) => c.neg());
		M = M.map((c) => c.neg());
	}
	return { N, M };
}

/** Numerator or denominator in k, with "b - ak" instead of "-ak + b". */
function kLatex(p: P): string {
	const t = pTrim(p);
	if (t.length === 2 && t[1].sign() < 0 && t[0].sign() > 0) return `${t[0].toLatex()} - ${term(t[1].abs(), 'k')}`;
	return polyToLatex(t, 'k');
}
function rfLatex(f: RF): string {
	const N = pTrim(f.N);
	const M = pTrim(f.M);
	if (!N.length) return '0';
	if (M.length === 1 && M[0].isOne()) return kLatex(N);
	const neg = N.every((c) => c.sign() <= 0);
	const n = neg ? N.map((c) => c.neg()) : N;
	return `${neg ? '-' : ''}\\frac{${kLatex(n)}}{${kLatex(M)}}`;
}
const rfStr = (f: RF) => `(${pStr(f.N)})/(${pStr(f.M)})`;
const rfNeg = (f: RF): RF => ({ N: f.N.map((c) => c.neg()), M: f.M });
const rfKey = (f: RF) => `${f.N.map(String).join(',')}/${f.M.map(String).join(',')}`;

type CaseKind = 'imp' | 'ind';
interface Discussion {
	/** Values excluded in the first line (the ones with a line of their own). */
	excluded: number[];
	x: RF;
	y: RF;
	cases: { r: number; kind: CaseKind }[];
}

function condLatex(ex: number[]): string {
	if (!ex.length) return '\\text{per ogni } k';
	if (ex.length === 2 && ex[0] === -ex[1]) return `k \\neq \\pm ${Math.abs(ex[0])}`;
	return ex.map((r) => `k \\neq ${r}`).join(',\\ ');
}
const KIND_WORD: Record<CaseKind, string> = { imp: 'impossibile', ind: 'indeterminato' };

function discussionOption(d: Discussion): ChoiceOption {
	const pair = `\\left(${rfLatex(d.x)}, ${rfLatex(d.y)}\\right)`;
	// two values that are not opposite make the condition long: the pair goes on a line of its own
	const long = d.excluded.length === 2 && d.excluded[0] !== -d.excluded[1];
	const first = long ? [`${condLatex(d.excluded)}\\text{:}`, pair] : [`${condLatex(d.excluded)}\\text{: } ${pair}`];
	const lines = [...first, ...d.cases.map((c) => `k = ${c.r}\\text{: ${KIND_WORD[c.kind]}}`)];
	const values = [...(d.excluded.length ? [] : ['per_ogni']), `x=${rfStr(d.x)}`, `y=${rfStr(d.y)}`, ...d.cases.map((c) => `k=${c.r}:${c.kind}`)];
	return { latex: `\\begin{gathered} ${lines.join(' \\\\ ')} \\end{gathered}`, values };
}

function discussionSolution(d: Discussion): string {
	const first = `\\text{per } ${condLatex(d.excluded)}\\text{: } \\left(${rfLatex(d.x)}, ${rfLatex(d.y)}\\right)`;
	return [first, ...d.cases.map((c) => `\\text{; per } k = ${c.r}\\text{: ${KIND_WORD[c.kind]}}`)].join('');
}

type Lin = [number, number]; // αk + β
const linP = ([a, b]: Lin): P => [q(b), q(a)];
function linTerm([a, b]: Lin, v: string): string {
	if (a === 0) return term(q(b), v);
	if (b === 0) return term(q(a), `k${v}`);
	return `(${kLatex(linP([a, b]))})${v}`;
}
const linConst = (l: Lin) => kLatex(linP(l));
const linEntry = (l: Lin) => kLatex(linP(l));

type Cat5 = 'impossibile' | 'indeterminato' | 'tre casi' | 'degenere';

interface Sys5 {
	rows: Lin[][];
}

function analyse5(s: Sys5): { D: P; Dx: P; Dy: P; roots: number[]; d: Discussion; degenerate: number[] } | null {
	const [[A1, B1, C1], [A2, B2, C2]] = s.rows.map((r) => r.map(linP));
	const D = pTrim(polySub(polyMul(A1, B2), polyMul(A2, B1)));
	const Dx = pTrim(polySub(polyMul(C1, B2), polyMul(C2, B1)));
	const Dy = pTrim(polySub(polyMul(A1, C2), polyMul(A2, C1)));
	if (pDeg(D) < 1) return null;
	const roots = intRoots(D);
	if (!roots) return null;
	const distinct = [...new Set(roots)].sort((a, b) => a - b);
	if (distinct.some((r) => Math.abs(r) > 5)) return null;
	const x = rfReduce(Dx, D, roots);
	const y = rfReduce(Dy, D, roots);
	const cs: { r: number; kind: CaseKind }[] = [];
	const degenerate: number[] = [];
	for (const r of distinct) {
		const coefs = [A1, B1, A2, B2].map((p) => pEval(p, r));
		if (coefs.every((c) => c.isZero())) {
			degenerate.push(r);
			const consts = [C1, C2].map((p) => pEval(p, r));
			cs.push({ r, kind: consts.every((c) => c.isZero()) ? 'ind' : 'imp' });
		} else {
			cs.push({ r, kind: pEval(Dx, r).isZero() && pEval(Dy, r).isZero() ? 'ind' : 'imp' });
		}
	}
	return { D, Dx, Dy, roots, d: { excluded: distinct, x, y, cases: cs }, degenerate };
}

function nice5(f: RF): boolean {
	return pDeg(f.N) <= 1 && pDeg(f.M) <= 1 && [...f.N, ...f.M].every((c) => c.isInteger() && Math.abs(c.num) <= 9);
}

function category5(a: NonNullable<ReturnType<typeof analyse5>>): Cat5 {
	if (a.degenerate.length) return 'degenere';
	const kinds = new Set(a.d.cases.map((c) => c.kind));
	if (kinds.size === 2) return 'tre casi';
	return kinds.has('ind') ? 'indeterminato' : 'impossibile';
}

/** Rows V + (k - r)·W: at k = r the rows are proportional (ind) or proportional except the constant (imp). */
function random5(rng: Rng, cat: Cat5): Sys5 {
	if (cat === 'degenere') {
		const r = rng.next() < 0.6 ? 0 : nz(rng, -2, 2);
		const rows: Lin[][] = [0, 1].map(() => {
			const a = nz(rng, -2, 2);
			const b = nz(rng, -3, 3);
			return [
				[a, -a * r],
				[b, -b * r],
				[0, rng.int(-4, 4)],
			] as Lin[];
		});
		return { rows };
	}
	const r = rng.int(-3, 3);
	const V2 = [nz(rng, -3, 3), nz(rng, -3, 3), rng.int(-4, 4)];
	const t = rng.pick([1, -1, 2, -2]);
	const V1 = V2.map((v) => v * t);
	if (cat === 'impossibile' || (cat === 'tre casi' && rng.next() < 0.5)) V1[2] += nz(rng, -3, 3);
	const W = [0, 1].map(() => [0, 1, 2].map((j) => (j === 2 ? rng.pick([0, 0, 0, 1]) : rng.pick([-1, 0, 0, 1, 1, 2]))));
	const rows = [V1, V2].map((V, i) => V.map((v, j) => [W[i][j], v - r * W[i][j]] as Lin));
	return { rows };
}

const W5: [Cat5, number][] = [
	['impossibile', 0.3],
	['indeterminato', 0.2],
	['tre casi', 0.35],
	['degenere', 0.15],
];

function build5(rng: Rng, seed: number): Sample {
	let u = rng.next();
	let cat: Cat5 = 'impossibile';
	for (const [c, w] of W5) {
		if (u < w) {
			cat = c;
			break;
		}
		u -= w;
	}
	for (;;) {
		const s = random5(rng, cat);
		// display rules: a coefficient αk + β with β ≠ 0 has |α| = 1 or 2; no zero coefficient of an unknown in the
		// same place in both rows
		if (s.rows.some((r) => r.slice(0, 2).some(([a]) => Math.abs(a) > 2))) continue;
		if (s.rows.flat().some(([a, b]) => a < 0 && b < 0)) continue;
		if (s.rows.some((r) => r.slice(0, 2).every(([a, b]) => a === 0 && b === 0))) continue;
		if (s.rows[0].slice(0, 2).some(([a, b], j) => a === 0 && b === 0 && s.rows[1][j][0] === 0 && s.rows[1][j][1] === 0)) continue;
		if (!s.rows.flat().some(([a]) => a !== 0)) continue;
		if (s.rows.every((r) => r[2][0] === 0 && r[2][1] === 0)) continue; // homogeneous: every discussion looks the same
		const an = analyse5(s);
		if (!an || category5(an) !== cat) continue;
		if (!nice5(an.d.x) || !nice5(an.d.y)) continue;
		if (s.rows.flat().some(([a, b]) => Math.abs(b) > 9 || Math.abs(a) > 3)) continue;
		const d = an.d;
		const [[A1, B1, C1], [A2, B2, C2]] = s.rows;
		const eq = (r: Lin[]) => `${join([linTerm(r[0], 'x'), linTerm(r[1], 'y')])} = ${linConst(r[2])}`;
		const E = linEntry;
		const lead = an.D[an.D.length - 1];
		const distinct = d.excluded;
		const fact = factorLatex(lead, an.roots);
		const steps = [
			`D = ${vm2(E(A1), E(B1), E(A2), E(B2))} = ${kLatex(an.D)}${fact !== kLatex(an.D) ? ` = ${fact}` : ''}`,
			`D = 0 \\text{ per } ${distinct.map((r) => `k = ${r}`).join(' \\text{ e per } ')}`,
			`D_x = ${vm2(E(C1), E(B1), E(C2), E(B2))} = ${kLatex(an.Dx)} \\qquad D_y = ${vm2(E(A1), E(C1), E(A2), E(C2))} = ${kLatex(an.Dy)}`,
			`\\text{Se } ${condLatex(distinct)}\\text{: } x = \\frac{D_x}{D} = ${rfLatex(d.x)} \\qquad y = \\frac{D_y}{D} = ${rfLatex(d.y)}`,
			...d.cases.map((c) => {
				if (an.degenerate.includes(c.r))
					return `\\text{Se } k = ${c.r} \\text{ tutti i coefficienti delle incognite sono } 0\\text{: il sistema diventa } 0 = ${pEval(linP(C1), c.r).toLatex()}\\text{, } 0 = ${pEval(linP(C2), c.r).toLatex()} \\text{ ed è ${KIND_WORD[c.kind]}}`;
				const dx = pEval(an.Dx, c.r).toLatex();
				const dy = pEval(an.Dy, c.r).toLatex();
				return `\\text{Se } k = ${c.r}\\text{: } D_x = ${dx},\\ D_y = ${dy}\\text{, il sistema è ${KIND_WORD[c.kind]}}`;
			}),
		];
		return {
			generatorId: ID,
			level: 5,
			seed,
			prompt: 'Risolvi e discuti il sistema al variare di k.',
			problem: cases([eq(s.rows[0]), eq(s.rows[1])]),
			solution: discussionSolution(d),
			steps,
			answer: { kind: 'choice', options: [], correct: 0 },
			params: {
				case: cat,
				rows: s.rows,
				D: an.D.map(String),
				x: rfStr(d.x),
				y: rfStr(d.y),
				cases: d.cases.map((c) => `${c.r}:${c.kind}`),
			},
		};
	}
}

function factorLatex(lead: R, roots: number[]): string {
	const counts = new Map<number, number>();
	for (const r of roots) counts.set(r, (counts.get(r) ?? 0) + 1);
	const fs = [...counts.entries()]
		.sort((a, b) => a[0] - b[0])
		.map(([r, m]) => {
			const base = r === 0 ? 'k' : `(k ${r > 0 ? '-' : '+'} ${Math.abs(r)})`;
			return m === 1 ? base : `${base}^${m}`;
		});
	const c = lead.isOne() ? '' : lead.neg().isOne() ? '-' : lead.toLatex();
	if (fs.length === 1 && roots.length === 1 && fs[0] === 'k') return `${c}k`;
	return `${c}${fs.join('')}`;
}

function choice5(s: Sample, rng: Rng): ChoiceAnswer {
	const rows = s.params.rows as Lin[][];
	const an = analyse5({ rows })!;
	const d = an.d;
	const swapKinds = (x: Discussion): Discussion => ({ ...x, cases: x.cases.map((c) => ({ r: c.r, kind: c.kind === 'imp' ? 'ind' : 'imp' })) });
	const definedAt = (f: RF, r: number) => !pEval(f.M, r).isZero();
	// the simplified formula used for every value where it makes sense
	const dropped = d.excluded.filter((r) => definedAt(d.x, r) && definedAt(d.y, r));
	const formulaForAll: Discussion | null = dropped.length
		? { ...d, excluded: d.excluded.filter((r) => !dropped.includes(r)), cases: d.cases.filter((c) => !dropped.includes(c.r)) }
		: null;
	const swapped: Discussion = { ...d, x: d.y, y: d.x };
	const neg: Discussion = { ...d, x: rfNeg(d.x), y: rfNeg(d.y) };
	const cands: (Discussion | null)[] = [formulaForAll, swapKinds(d), rfKey(d.x) !== rfKey(d.y) ? swapped : null, neg, swapKinds(neg), formulaForAll ? swapKinds(formulaForAll) : null];
	if (rfKey(d.x) !== rfKey(d.y)) cands.push(swapKinds(swapped));
	const inv = (f: RF): RF | null => (pTrim(f.N).length ? { N: f.M, M: f.N } : null);
	const ix = inv(d.x);
	const iy = inv(d.y);
	if (ix && iy) {
		const fix = (f: RF): RF => (f.M[f.M.length - 1].sign() < 0 ? { N: f.N.map((c) => c.neg()), M: f.M.map((c) => c.neg()) } : f);
		cands.push({ ...d, x: fix(ix), y: fix(iy) });
	}
	const ch = assembleChoice(
		rng,
		discussionOption(d),
		cands.map((c) => (c ? discussionOption(c) : null)),
	);
	if (!ch) throw new Error(`${ID}: not enough discussions`);
	return ch;
}

// ---------------------------------------------------------------------------
// Level 6: Sarrus

function sarrus(m: R[][]) {
	const [[a, b, c], [d, e, f], [g, h, i]] = m;
	const plus = [a.mul(e).mul(i), b.mul(f).mul(g), c.mul(d).mul(h)];
	const minus = [c.mul(e).mul(g), a.mul(f).mul(h), b.mul(d).mul(i)];
	const P = plus.reduce((x, y) => x.add(y), ZERO);
	const M = minus.reduce((x, y) => x.add(y), ZERO);
	return { plus, minus, P, M, det: P.sub(M) };
}

function build6(rng: Rng, seed: number): Sample {
	for (;;) {
		const m = [0, 1, 2].map(() => [0, 1, 2].map(() => q(rng.next() < 0.12 ? 0 : nz(rng, -4, 4))));
		const zeros = m.flat().filter((c) => c.isZero()).length;
		if (zeros > 2 || !m.flat().some((c) => c.sign() < 0)) continue;
		const s = sarrus(m);
		if (s.det.isZero() || Math.abs(s.det.num) > 150) continue;
		const L = (x: R) => x.toLatex();
		const sum = (xs: R[]) => join(xs.map(L));
		return {
			generatorId: ID,
			level: 6,
			seed,
			prompt: 'Calcola il determinante con la regola di Sarrus.',
			problem: vm3(m),
			solution: `${vm3(m)} = ${L(s.det)}`,
			steps: [
				`\\text{Ricopia a destra le prime due colonne.}`,
				`\\text{Diagonali che scendono verso destra: } ${sum(s.plus)} = ${L(s.P)}`,
				`\\text{Diagonali che scendono verso sinistra: } ${sum(s.minus)} = ${L(s.M)}`,
				`\\text{Il determinante è la prima somma meno la seconda: } ${L(s.P)} - ${paren(s.M)} = ${L(s.det)}`,
			],
			answer: { kind: 'number', value: s.det.toString() },
			params: { case: 'sarrus', matrix: m.map((r) => r.map(String)) },
		};
	}
}

function choice6(s: Sample, rng: Rng): ChoiceAnswer {
	const m = (s.params.matrix as string[][]).map((r) => r.map(R_));
	const sr = sarrus(m);
	const [[a, , c], [, e], [g, , i]] = m;
	const cands = [
		numberOption(sr.P.add(sr.M)), // the second sum added
		numberOption(sr.det.neg()), // the two sums exchanged
		numberOption(a.mul(e).mul(i).sub(c.mul(e).mul(g))), // only the two main diagonals, as in a 2 × 2
		numberOption(sr.P.sub(sr.minus[0]).add(sr.minus[1]).add(sr.minus[2])), // only the first product subtracted
	];
	return mustChoice(rng, numberOption(sr.det), cands, () => nearNumbers(sr.det));
}

// ---------------------------------------------------------------------------
// Level 7: three equations in three unknowns

function det3(m: R[][]): R {
	return sarrus(m).det;
}

function build7(rng: Rng, seed: number): Sample {
	for (;;) {
		const sol = [q(rng.int(-4, 4)), q(rng.int(-4, 4)), q(rng.int(-4, 4))];
		if (sol.filter((v) => v.isZero()).length > 1) continue;
		const A = [0, 1, 2].map(() => [0, 1, 2].map(() => q(rng.next() < 0.15 ? 0 : nz(rng, -3, 3))));
		if (A.some((r) => r.filter((c) => !c.isZero()).length < 2)) continue;
		const rows = A.map((r) => [...r, r.reduce((acc, c, j) => acc.add(c.mul(sol[j])), ZERO)]);
		if (rows.some((r) => Math.abs(r[3].num) > 20)) continue;
		const D = det3(A);
		if (D.isZero()) continue;
		const col = (j: number) => rows.map((r) => r.map((c, jj) => (jj === j ? r[3] : c)).slice(0, 3));
		const Ds = [0, 1, 2].map((j) => det3(col(j)));
		const L = (x: R) => x.toLatex();
		const names = ['D_x', 'D_y', 'D_z'];
		return {
			generatorId: ID,
			level: 7,
			seed,
			prompt: 'Risolvi il sistema, per sostituzione o con la regola di Cramer.',
			problem: cases(rows.map((r) => eqNormal(r, VARS3))),
			solution: `\\text{La soluzione è la terna } ${tuple(sol)}`,
			steps: [
				`D = ${vm3(A)} = ${L(D)}`,
				`D \\neq 0\\text{: il sistema è determinato}`,
				...[0, 1, 2].map((j) => `${names[j]} = ${vm3(col(j))} = ${L(Ds[j])}`),
				`x = ${quot(Ds[0], D)} \\qquad y = ${quot(Ds[1], D)} \\qquad z = ${quot(Ds[2], D)}`,
			],
			answer: { kind: 'choice', options: [], correct: 0 },
			params: { case: 'tre incognite', rows: rows.map((r) => r.map(String)), solution: sol.map(String) },
		};
	}
}

function choice7(s: Sample, rng: Rng): ChoiceAnswer {
	const [x, y, z] = (s.params.solution as string[]).map(R_);
	const cands = [
		tupleOption([y, x, z]),
		tupleOption([x, z, y]),
		tupleOption([z, y, x]),
		tupleOption([x.neg(), y.neg(), z.neg()]),
		tupleOption([x, y, z.neg()]),
		tupleOption([x.neg(), y, z]),
	];
	return mustChoice(rng, tupleOption([x, y, z]), cands, () => nearTuples([x, y, z]));
}

// ---------------------------------------------------------------------------
// Generate, check, choice

function buildLevel(rng: Rng, level: number): Sample {
	const seed = rng.seed;
	switch (level) {
		case 1:
			return build1(rng, seed);
		case 2:
			return withChoice(build2(rng, seed), rng, choicePair);
		case 3:
			return withChoice(build3(rng, seed), rng, choicePair);
		case 4:
			return build4(rng, seed);
		case 5:
			return withChoice(build5(rng, seed), rng, choice5);
		case 6:
			return build6(rng, seed);
		case 7:
			return withChoice(build7(rng, seed), rng, choice7);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

function withChoice(s: Sample, rng: Rng, f: (s: Sample, rng: Rng) => ChoiceAnswer): Sample {
	return { ...s, answer: f(s, rng) };
}

const FORBIDDEN: [string, RegExp][] = [
	['1x', /(?<![\d}])1\s*[a-z(]/],
	['0x', /(?<![\d}])0\s*[a-z(]/],
	['+ -', /\+\s*-/],
	['- -', /-\s*-/],
	['+ +', /\+\s*\+/],
	['termine nullo', /[+-]\s*0(?!\d)/],
];

function forbidden(tex: string): string[] {
	return FORBIDDEN.filter(([, rx]) => rx.test(tex)).map(([n]) => `testo con '${n}': ${tex}`);
}

function checkChoice(ch: ChoiceAnswer | undefined, v: string[]) {
	if (!ch) return v.push('manca la scelta multipla');
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni con lo stesso testo');
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) v.push('indice della risposta fuori intervallo');
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	v.push(...forbidden(sample.problem));
	if (!sample.steps.length) v.push('niente passaggi');
	if (/\\begin\{(aligned|gathered|array)\}/.test(sample.solution + sample.steps.join(' '))) v.push('ambiente nella soluzione o nei passaggi');
	const a = sample.answer;
	const choiceAns = a.kind === 'choice' ? a : sample.choice;
	switch (sample.level) {
		case 1: {
			const m = (p.matrix as string[]).map(R_);
			if (m.some((c) => c.isZero() || !c.isInteger() || Math.abs(c.num) > 9)) v.push('elementi interi da -9 a 9, non nulli');
			if (!m.some((c) => c.sign() < 0)) v.push('serve un elemento negativo');
			if (a.kind !== 'number' || a.value !== det2(m[0], m[1], m[2], m[3]).toString()) v.push('risposta diversa dal determinante');
			break;
		}
		case 2:
		case 3:
		case 7: {
			const rows = (p.rows as string[][]).map((r) => r.map(R_));
			const sol = (p.solution as string[]).map(R_);
			const n = sample.level === 7 ? 3 : 2;
			for (const r of rows) {
				const lhs = r.slice(0, n).reduce((acc, c, j) => acc.add(c.mul(sol[j])), ZERO);
				if (!lhs.equals(r[n])) v.push('la soluzione non risolve il sistema');
				if (r.slice(0, n).some((c) => !c.isInteger())) v.push('forma normale con coefficienti non interi');
			}
			const D = n === 2 ? det2(rows[0][0], rows[0][1], rows[1][0], rows[1][1]) : det3(rows.map((r) => r.slice(0, 3)));
			if (D.isZero()) v.push('D = 0');
			if (sample.level === 2 && (sol.some((c) => !c.isInteger() || Math.abs(c.num) > 6) || rows.some((r) => r[0].isZero() || r[1].isZero()))) v.push('livello 2: soluzione intera e coefficienti non nulli');
			if (sample.level === 3) {
				const forms = p.forms as Form[];
				if (forms.every((f) => f === 'normale')) v.push('livello 3: nessuna equazione da trasformare');
				if (sol.some((c) => c.den > 5)) v.push('denominatore della soluzione oltre 5');
			}
			if (sample.level === 7 && sol.some((c) => !c.isInteger() || Math.abs(c.num) > 4)) v.push('livello 7: soluzione intera da -4 a 4');
			if (a.kind !== 'choice') v.push('serve una scelta');
			else if (!sameTuple(a.options[a.correct].values.map(R_), sol)) v.push('l’opzione giusta non è la soluzione');
			break;
		}
		case 4: {
			if (p.case === 'valore') {
				const m = (p.matrix as string[]).map(R_);
				const k = R_(p.k);
				const mm = m.map((c, i) => (i === p.position ? k : c));
				if (!det2(mm[0], mm[1], mm[2], mm[3]).isZero()) v.push('con k il determinante non è zero');
				if (a.kind !== 'number' || a.value !== k.toString()) v.push('risposta diversa da k');
			} else {
				if (a.kind !== 'choice') v.push('serve una scelta');
				else {
					const kinds = a.options.map((o) => {
						const [r1, r2] = o.values[0].split(';').map((r) => r.split(',').map(R_));
						return classify(r1, r2);
					});
					if (kinds.filter((k) => k === p.case).length !== 1 || kinds[a.correct] !== p.case) v.push('non c’è un solo sistema del tipo chiesto');
				}
			}
			break;
		}
		case 5: {
			const an = analyse5({ rows: p.rows as Lin[][] });
			if (!an) v.push('sistema senza radici intere di D');
			else {
				if (category5(an) !== p.case) v.push('categoria diversa');
				if (rfStr(an.d.x) !== p.x || rfStr(an.d.y) !== p.y) v.push('soluzione generica diversa');
				if (a.kind !== 'choice' || a.options[a.correct].latex !== discussionOption(an.d).latex) v.push('l’opzione giusta non è la discussione');
			}
			break;
		}
		case 6: {
			const m = (p.matrix as string[][]).map((r) => r.map(R_));
			if (m.flat().some((c) => !c.isInteger() || Math.abs(c.num) > 4)) v.push('elementi interi da -4 a 4');
			if (a.kind !== 'number' || a.value !== det3(m).toString()) v.push('risposta diversa dal determinante');
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	if (a.kind === 'choice') checkChoice(a, v);
	else if (sample.choice) checkChoice(sample.choice, v);
	void choiceAns;
	return v;
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	switch (sample.level) {
		case 1:
			return choice1(sample, rng);
		case 4:
			return choice4b(sample, rng);
		case 6:
			return choice6(sample, rng);
		default:
			throw new Error(`${ID}: no choice for level ${sample.level}`);
	}
}

export const sistemiCramer: Generator = {
	id: ID,
	title: 'Determinanti e regola di Cramer',
	levels: {
		1: { label: 'Determinante di una matrice 2 × 2', constraints: ['elementi interi da -9 a 9, non nulli, almeno uno negativo', 'determinante zero solo di rado'] },
		2: { label: 'Regola di Cramer, sistema in forma normale', constraints: ['coefficienti interi da -6 a 6, non nulli', 'soluzione intera da -6 a 6', 'termini noti fino a 40 in valore assoluto'] },
		3: {
			label: 'Prima la forma normale',
			constraints: ['almeno un’equazione con un termine a secondo membro, una parentesi, i denominatori o un’incognita che manca', 'soluzione anche frazionaria, denominatori fino a 5'],
		},
		4: { label: 'D = 0: impossibile o indeterminato', constraints: ['tre su dieci: quale sistema è impossibile', 'tre su dieci: quale è indeterminato', 'quattro su dieci: il coefficiente k che rende D = 0'] },
		5: { label: 'Sistemi letterali con il parametro k', constraints: ['D si scompone in fattori con radici intere', 'casi: impossibile, indeterminato, tre casi, tutti i coefficienti nulli'] },
		6: { label: 'Determinante 3 × 3 con la regola di Sarrus', constraints: ['elementi interi da -4 a 4, al più due zeri', 'determinante non nullo, fino a 150'] },
		7: { label: 'Tre equazioni in tre incognite', constraints: ['coefficienti interi da -3 a 3', 'soluzione intera da -4 a 4', 'D diverso da zero'] },
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

export default sistemiCramer;
