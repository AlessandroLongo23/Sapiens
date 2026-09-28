/**
 * Trasformazioni geometriche. Spec: specs/exercises/trasformazioni-geometriche.md
 *
 * Seven levels in the order of lesson 104 (docs/lezioni/riscritte/104-trasformazioni-geometriche.md), all in the
 * Cartesian plane like its five worked examples: the image of a point in a translation, the symmetric points
 * (axes, origin, the bisector y = x), the homothety with centre the origin, the image of a line in a translation,
 * in a symmetry or a homothety, the transformation read from its equations with its fixed points, compositions.
 * No figures: every exercise stands on its coordinates and equations. Points, vectors and transformations are
 * multiple choice; a ratio and an area are a `number`, a line an `expression` in explicit form. Distractors are the
 * mistakes of the lesson's warnings (the sign in the substitution, which coordinate changes, the area times k).
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { joinSigned, paren } from '../latex';
import { buildChoice, ratOption, shuffle, weighted } from '../razionali';

export const ID = 'trasformazioni-geometriche';

type R = Rational;
const t = (s: string) => `\\text{${s}}`;
const R = (s: string) => Rational.parse(s);
const ONE = q(1);

// ---------------------------------------------------------------------------
// Points, vectors, lines

type P = [R, R];
const pt = (x: number | R, y: number | R): P => [typeof x === 'number' ? q(x) : x, typeof y === 'number' ? q(y) : y];
const padd = (a: P, b: P): P => [a[0].add(b[0]), a[1].add(b[1])];
const psub = (a: P, b: P): P => [a[0].sub(b[0]), a[1].sub(b[1])];
const pscale = (a: P, k: R): P => [a[0].mul(k), a[1].mul(k)];
const pswap = (a: P): P => [a[1], a[0]];
const pneg = (a: P): P => [a[0].neg(), a[1].neg()];
const inRange = (p: P, m: number) => p.every((c) => c.abs().compare(q(m)) <= 0);

/** (3, -2), or \left(\frac{3}{2}, -1\right) when a coordinate is a fraction. */
function pairTex([x, y]: P): string {
	const inner = `${x.toLatex()}, ${y.toLatex()}`;
	return x.isInteger() && y.isInteger() ? `(${inner})` : `\\left(${inner}\\right)`;
}
const named = (name: string, p: P) => `${name}${pairTex(p)}`;
const vecTex = (v: P, name = '\\vec{v}') => `${name}${pairTex(v)}`;
const pVals = (p: P) => [p[0].toString(), p[1].toString()];
const pointOption = (p: P): ChoiceOption => ({ latex: pairTex(p), values: pVals(p) });
const vecOption = (v: P): ChoiceOption => ({ latex: vecTex(v), values: pVals(v) });
const NEAR: [number, number][] = [
	[1, 0],
	[0, -1],
	[-1, 0],
	[0, 1],
	[1, 1],
	[-1, -1],
	[2, 0],
	[0, 2],
];
const nearBy = (p: P, make: (p: P) => ChoiceOption) => (i: number) => make(padd(p, pt(...NEAR[i % NEAR.length])));

/** |c| v: "3x", "x", "\frac{3}{2}x'", "5". */
function body(c: R, v: string): string {
	const a = c.abs();
	if (!v) return a.toLatex();
	return a.isOne() ? v : `${a.toLatex()}${v}`;
}
/** A sum of terms with the zero ones left out: "2x' - 6". */
function lin(items: [R, string][]): string {
	const ts = items.filter(([c]) => !c.isZero());
	if (!ts.length) return '0';
	return ts.map(([c, v], i) => (i === 0 ? (c.sign() < 0 ? '-' : '') : c.sign() < 0 ? ' - ' : ' + ') + body(c, v)).join('');
}

/** y = mx + q in explicit form, with or without the primes. */
const explicitTex = (m: R, k: R, prime = false) => `${prime ? "y'" : 'y'} = ${lin([
	[m, prime ? "x'" : 'x'],
	[k, ''],
])}`;
const sym = (r: R) => (r.isInteger() ? `${r.num}` : `(${r.num}/${r.den})`);
/** m*x + q for SymPy. */
function sympyLine(m: R, k: R): string {
	const head = `${sym(m)}*x`;
	if (k.isZero()) return head;
	return `${head} ${k.sign() < 0 ? '-' : '+'} ${sym(k.abs())}`;
}

interface Line {
	m: R;
	k: R;
}
interface Opt {
	latex: string;
	value: string;
}
const lineOpt = (l: Line): Opt => ({ latex: explicitTex(l.m, l.k), value: sympyLine(l.m, l.k) });
const sameLine = (a: Line, b: Line) => a.m.equals(b.m) && a.k.equals(b.k);

/** k times an expression in the steps: "2(x' - 3)", "-(x' - 3)", "x' - 3", "\frac{1}{2}(-x')". */
function times(m: R, inner: string): string {
	if (/^[xy]'$/.test(inner)) return lin([[m, inner]]);
	if (m.isOne()) return inner;
	if (m.equals(q(-1))) return `-(${inner})`;
	return `${m.toLatex()}(${inner})`;
}

/** A point of y = mx + q with integer coordinates when m has a denominator: x = den (or -den). */
function pointOn(l: Line, rng: Rng): P {
	const x0 = q(l.m.den * rng.pick([1, 1, 2, -1]));
	return [x0, l.m.mul(x0).add(l.k)];
}

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: Answer;
	/** Distractors for a number or expression answer. */
	wrong?: Opt[];
	params: Record<string, unknown>;
}

const nz = (rng: Rng, a: number, b: number): number => {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0) return v;
	}
};
const randomPoint = (rng: Rng, m: number): P => pt(nz(rng, -m, m), nz(rng, -m, m));

/** x' = x + a, y' = y + b as the lesson writes them. */
const transEq = (v: P) => [`x' = ${joinSigned('x', v[0])}`, `y' = ${joinSigned('y', v[1])}`];

// ---------------------------------------------------------------------------
// Level 1: translation of a point

function level1(rng: Rng, c: string): Built | null {
	const P0 = randomPoint(rng, 8);
	const oneZero = rng.next() < 0.15;
	let v = pt(nz(rng, -6, 6), nz(rng, -6, 6));
	if (oneZero) v = rng.next() < 0.5 ? pt(0, v[1]) : pt(v[0], 0);
	const P1 = padd(P0, v);
	if (!inRange(P1, 12)) return null;
	const [a, b] = v;
	if (c === 'immagine') {
		// Mistakes: the vector subtracted, its components swapped, one component with the wrong sign.
		const cands = [psub(P0, v), padd(P0, pswap(v)), padd(P0, pt(a, b.neg())), padd(P0, pt(a.neg(), b))];
		const choice = buildChoice(rng, pointOption(P1), cands.map(pointOption), nearBy(P1, pointOption));
		return {
			case: c,
			prompt: "Trova l'immagine P' del punto P nella traslazione di vettore v.",
			problem: `${named('P', P0)} \\quad ${vecTex(v)}`,
			solution: named("P'", P1),
			steps: [
				t('Si aggiunge ') + a.toLatex() + t(" all'ascissa e ") + b.toLatex() + t(" all'ordinata"),
				`x' = ${P0[0].toLatex()} + ${paren(a)} = ${P1[0].toLatex()} \\qquad y' = ${P0[1].toLatex()} + ${paren(b)} = ${P1[1].toLatex()}`,
				named("P'", P1),
			],
			answer: choice,
			params: { P: pVals(P0), v: pVals(v) },
		};
	}
	if (c === 'vettore') {
		if (oneZero) return null;
		// Mistakes: the difference taken the other way, the sum of the points, the components swapped.
		const cands = [psub(P0, P1), padd(P0, P1), pswap(v)];
		const choice = buildChoice(rng, vecOption(v), cands.map(vecOption), nearBy(v, vecOption));
		return {
			case: c,
			prompt: "Una traslazione manda P in P'. Trova il suo vettore v.",
			problem: `${named('P', P0)} \\quad ${named("P'", P1)}`,
			solution: vecTex(v),
			steps: [
				t("Il vettore va da ") + 'P' + t(' a ') + "P'" + t(': si sottraggono le coordinate di ') + 'P',
				`a = ${P1[0].toLatex()} - ${paren(P0[0])} = ${a.toLatex()} \\qquad b = ${P1[1].toLatex()} - ${paren(P0[1])} = ${b.toLatex()}`,
				vecTex(v),
			],
			answer: choice,
			params: { P: pVals(P0), P1: pVals(P1) },
		};
	}
	// The starting point from the image: P = P' - v. Mistakes: P' + v, v - P', the components swapped.
	const cands = [padd(P1, v), psub(v, P1), psub(P1, pswap(v))];
	const choice = buildChoice(rng, pointOption(P0), cands.map(pointOption), nearBy(P0, pointOption));
	return {
		case: c,
		prompt: "P' è l'immagine di P nella traslazione di vettore v. Trova P.",
		problem: `${named("P'", P1)} \\quad ${vecTex(v)}`,
		solution: named('P', P0),
		steps: [
			t('Da ') + `x' = x + a` + t(' si ricava ') + `x = x' - a` + t(', e lo stesso per ') + 'y',
			`x = ${P1[0].toLatex()} - ${paren(a)} = ${P0[0].toLatex()} \\qquad y = ${P1[1].toLatex()} - ${paren(b)} = ${P0[1].toLatex()}`,
			named('P', P0),
		],
		answer: choice,
		params: { P1: pVals(P1), v: pVals(v) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: symmetric points

type Sym = 'asse x' | 'asse y' | 'origine' | 'bisettrice';
const symOf = (s: Sym, [x, y]: P): P => (s === 'asse x' ? [x, y.neg()] : s === 'asse y' ? [x.neg(), y] : s === 'origine' ? [x.neg(), y.neg()] : [y, x]);
const SYM_WHERE: Record<Sym, string> = {
	'asse x': "all'asse x",
	'asse y': "all'asse y",
	origine: "all'origine",
	bisettrice: 'alla bisettrice y = x',
};
const SYM_RULE: Record<Sym, string> = {
	'asse x': "x' = x \\qquad y' = -y",
	'asse y': "x' = -x \\qquad y' = y",
	origine: "x' = -x \\qquad y' = -y",
	bisettrice: "x' = y \\qquad y' = x",
};
const SYM_WHY: Record<Sym, string> = {
	'asse x': t("Rispetto all'asse ") + 'x' + t(" resta l'ascissa e cambia segno l'ordinata"),
	'asse y': t("Rispetto all'asse ") + 'y' + t(" resta l'ordinata e cambia segno l'ascissa"),
	origine: t("Rispetto all'origine cambiano segno tutte e due le coordinate"),
	bisettrice: t('Rispetto alla bisettrice ') + 'y = x' + t(' le due coordinate si scambiano'),
};

function level2(rng: Rng, c: string): Built | null {
	const s = c as Sym;
	const frac = rng.next() < 0.15;
	const x: R = frac ? q(2 * nz(rng, -5, 4) + 1, 2) : q(nz(rng, -9, 9));
	const y: R = q(nz(rng, -9, 9));
	if (x.abs().equals(y.abs())) return null;
	const P0: P = [x, y];
	const truth = symOf(s, P0);
	// Mistakes: the other coordinate changed (the lesson's warning), both changed, the coordinates swapped; for the
	// bisector the coordinates swapped and changed in sign, or only one changed.
	const others: Sym[] = (['asse x', 'asse y', 'origine', 'bisettrice'] as Sym[]).filter((o) => o !== s);
	const cands = s === 'bisettrice' ? [pneg(pswap(P0)), symOf('asse x', P0), symOf('asse y', P0), symOf('origine', P0)] : [...others.map((o) => symOf(o, P0)), pneg(pswap(P0))];
	const choice = buildChoice(rng, pointOption(truth), shuffle(rng, cands).map(pointOption), nearBy(truth, pointOption));
	return {
		case: c,
		prompt: `Trova il simmetrico P' di P rispetto ${SYM_WHERE[s]}.`,
		problem: named('P', P0),
		solution: named("P'", truth),
		steps: [SYM_WHY[s], SYM_RULE[s], `${named('P', P0)} \\to ${named("P'", truth)}`],
		answer: choice,
		params: { P: pVals(P0), symmetry: s },
	};
}

// ---------------------------------------------------------------------------
// Level 3: homothety with centre the origin

const KS_POINT = [q(2), q(3), q(-2), q(-3), q(1, 2), q(-1, 2), q(3, 2), q(-3, 2), q(1, 3), q(-1, 3)];
const KS_RATIO = [q(2), q(3), q(-2), q(-3), q(4), q(1, 2), q(-1, 2), q(1, 3), q(3, 2), q(-3, 2), q(2, 3)];
const KS_AREA = [q(2), q(3), q(-2), q(-3), q(1, 2), q(-1, 2), q(3, 2)];

function level3(rng: Rng, c: string): Built | null {
	if (c === 'punto') {
		const k = rng.pick(KS_POINT);
		const d = k.den;
		const P0 = pt(nz(rng, -6, 6) * d, nz(rng, -6, 6) * d);
		if (!inRange(P0, 9)) return null;
		const P1 = pscale(P0, k);
		if (!inRange(P1, 18)) return null;
		// Mistakes: k added instead of multiplied, the sign of k lost, divided by k, only the abscissa multiplied.
		const cands = [padd(P0, pt(k, k)), pscale(P0, k.neg()), pscale(P0, ONE.div(k)), pt(P1[0], P0[1])];
		const choice = buildChoice(rng, pointOption(P1), cands.map(pointOption), nearBy(P1, pointOption));
		return {
			case: c,
			prompt: "Trova l'immagine P' di P nell'omotetia di centro O e rapporto k.",
			problem: `${named('P', P0)} \\quad k = ${k.toLatex()}`,
			solution: named("P'", P1),
			steps: [
				t('Si moltiplicano per ') + k.toLatex() + t(' tutte e due le coordinate: ') + "x' = kx,\\ y' = ky",
				`x' = ${k.toLatex()} \\cdot ${paren(P0[0])} = ${P1[0].toLatex()} \\qquad y' = ${k.toLatex()} \\cdot ${paren(P0[1])} = ${P1[1].toLatex()}`,
				named("P'", P1),
			],
			answer: choice,
			params: { P: pVals(P0), k: k.toString() },
		};
	}
	if (c === 'rapporto') {
		const k = rng.pick(KS_RATIO);
		const d = k.den;
		const P0 = pt(nz(rng, -5, 5) * d, nz(rng, -5, 5) * d);
		if (!inRange(P0, 12)) return null;
		const P1 = pscale(P0, k);
		if (!inRange(P1, 16)) return null;
		const [x0, y0] = P0;
		// Mistakes: the ratio upside down, the sign lost, both.
		const wrong = [ONE.div(k), k.neg(), ONE.div(k).neg()].filter((w) => !w.equals(k));
		return {
			case: c,
			prompt: "Un'omotetia di centro O manda P in P'. Trova il rapporto k.",
			problem: `${named('P', P0)} \\quad ${named("P'", P1)}`,
			solution: `k = ${k.toLatex()}`,
			steps: [
				t('Da ') + "x' = kx" + t(' si ricava ') + "k = \\frac{x'}{x}",
				`k = \\frac{${P1[0].toLatex()}}{${x0.toLatex()}} = ${k.toLatex()}`,
				t('Controllo con le ordinate: ') + `${k.toLatex()} \\cdot ${paren(y0)} = ${P1[1].toLatex()}`,
				k.sign() < 0 ? 'k < 0' + t(': ') + "P'" + t(' sta dalla parte opposta di ') + 'P' + t(' rispetto a ') + 'O' : 'k > 0' + t(': ') + "P'" + t(' sta dalla stessa parte di ') + 'P' + t(' rispetto a ') + 'O',
			],
			answer: { kind: 'number', value: k.toString() },
			wrong: wrong.map((w) => ({ latex: w.toLatex(), value: w.toString() })),
			params: { P: pVals(P0), P1: pVals(P1) },
		};
	}
	// The area of the image of a right triangle with the legs on the grid lines, as in example 2.
	const k = rng.pick(KS_AREA);
	const A = pt(rng.int(-4, 4), rng.int(-4, 4));
	const p = nz(rng, -5, 5);
	const s = nz(rng, -5, 5);
	const B = padd(A, pt(p, 0));
	const C = padd(A, pt(0, s));
	if (![A, B, C].every((v) => inRange(v, 6))) return null;
	const area = q(Math.abs(p * s), 2);
	const k2 = k.mul(k);
	const area1 = area.mul(k2);
	if (!area1.isInteger() && area1.den > 8) return null;
	// Mistakes: the area times |k| (the lesson's warning), the area unchanged, the legs' product not halved.
	const wrong = [area.mul(k.abs()), area, area1.mul(q(2))].filter((w) => !w.equals(area1));
	const PA = pscale(A, k);
	const PB = pscale(B, k);
	const PC = pscale(C, k);
	return {
		case: c,
		prompt: "Trova l'area del triangolo A'B'C', immagine di ABC nell'omotetia di centro O e rapporto k.",
		problem: `${named('A', A)} \\quad ${named('B', B)} \\quad ${named('C', C)} \\quad k = ${k.toLatex()}`,
		solution: `${t("L'area di ")}A'B'C'${t(' è ')}${area1.toLatex()}`,
		steps: [
			t('Il triangolo ') + 'ABC' + t(' è rettangolo in ') + 'A' + t(', con ') + `\\overline{AB} = ${Math.abs(p)}` + t(' e ') + `\\overline{AC} = ${Math.abs(s)}`,
			`${t('area di ')}ABC = \\frac{${Math.abs(p)} \\cdot ${Math.abs(s)}}{2} = ${area.toLatex()}`,
			`${named("A'", PA)} \\quad ${named("B'", PB)} \\quad ${named("C'", PC)}`,
			t("L'omotetia moltiplica le aree per ") + `k^2 = ${k2.toLatex()}`,
			`${t('area di ')}A'B'C' = ${k2.toLatex()} \\cdot ${area.toLatex()} = ${area1.toLatex()}`,
		],
		answer: { kind: 'number', value: area1.toString() },
		wrong: wrong.map((w) => ({ latex: w.toLatex(), value: w.toString() })),
		params: { A: pVals(A), B: pVals(B), C: pVals(C), k: k.toString() },
	};
}

// ---------------------------------------------------------------------------
// Lines

const M_INT = [1, 2, 3, 4, -1, -2, -3, -4].map((n) => q(n));
const M_FRAC = [q(1, 2), q(-1, 2), q(3, 2), q(-3, 2), q(1, 3), q(-1, 3), q(2, 3), q(-2, 3)];

/** The last two steps of every line exercise: the primes removed, and the check with a point. */
function closing(img: Line, P0: P, P1: P): string[] {
	return [
		t('Togliendo gli apici: ') + `r'\\colon ${explicitTex(img.m, img.k)}`,
		t('Controllo: ') + `${named('P', P0)} \\to ${named("P'", P1)}` + t(' e ') + `${img.m.isOne() ? '' : img.m.equals(q(-1)) ? '-' : `${img.m.toLatex()} \\cdot `}${paren(P1[0])}${img.k.isZero() ? '' : img.k.sign() < 0 ? ` - ${img.k.abs().toLatex()}` : ` + ${img.k.toLatex()}`} = ${P1[1].toLatex()}`,
	];
}

// ---------------------------------------------------------------------------
// Level 4: image of a line in a translation

function level4(rng: Rng, c: string): Built | null {
	const m = c === 'intero' ? rng.pick(M_INT) : rng.pick(M_FRAC);
	const k = q(rng.int(-6, 6));
	const a = q(nz(rng, -4, 4) * m.den);
	const b = q(nz(rng, -5, 5));
	if (a.abs().compare(q(6)) > 0) return null;
	const r: Line = { m, k };
	const img: Line = { m, k: k.add(b).sub(m.mul(a)) };
	if (img.k.equals(k)) return null;
	if (img.k.abs().compare(q(20)) > 0) return null;
	// Mistakes: the substitution with the wrong signs (the lesson's warning), only b used, only a used, the line itself.
	const cands: Line[] = [{ m, k: k.sub(b).add(m.mul(a)) }, { m, k: k.add(b) }, { m, k: k.sub(m.mul(a)) }, r, { m: m.neg(), k: img.k }];
	const wrong = cands.filter((l, i) => !sameLine(l, img) && cands.findIndex((o) => sameLine(o, l)) === i).map(lineOpt);
	const v: P = [a, b];
	const P0 = pointOn(r, rng);
	const P1 = padd(P0, v);
	const xs = joinSigned("x'", a.neg());
	const ys = joinSigned("y'", b.neg());
	return {
		case: c,
		prompt: "Trova l'equazione della retta r', immagine di r nella traslazione di vettore v.",
		problem: `r\\colon ${explicitTex(m, k)} \\quad ${vecTex(v)}`,
		solution: `r'\\colon ${explicitTex(img.m, img.k)}`,
		steps: [
			transEq(v).join(' \\qquad '),
			`x = ${xs} \\qquad y = ${ys}`,
			`${ys} = ${joinSigned(times(m, xs), k)}`,
			explicitTex(img.m, img.k, true),
			...closing(img, P0, P1),
		],
		answer: { kind: 'expression', value: sympyLine(img.m, img.k), latex: explicitTex(img.m, img.k), form: 'explicit' },
		wrong,
		params: { m: m.toString(), q: k.toString(), v: pVals(v), image: [img.m.toString(), img.k.toString()] },
	};
}

// ---------------------------------------------------------------------------
// Level 5: image of a line in a symmetry or in a homothety with centre O

const KS_LINE = [q(2), q(3), q(-2), q(-3), q(1, 2), q(-1, 2)];

function level5(rng: Rng, c: string): Built | null {
	const m = rng.next() < 0.7 ? rng.pick(M_INT) : rng.pick(M_FRAC);
	const k = q(nz(rng, -6, 6));
	const r: Line = { m, k };
	const P0 = pointOn(r, rng);
	let img: Line;
	let P1: P;
	let steps: string[];
	let prompt: string;
	let problem = `r\\colon ${explicitTex(m, k)}`;
	const params: Record<string, unknown> = { m: m.toString(), q: k.toString(), transformation: c };
	// Mistakes common to all: the line itself, only the slope changed in sign, the other symmetries.
	const cands: Line[] = [r, { m: m.neg(), k }, { m: m.neg(), k: k.neg() }, { m, k: k.neg() }];
	if (c === 'asse x' || c === 'asse y' || c === 'origine') {
		const s = c as Sym;
		img = s === 'asse x' ? { m: m.neg(), k: k.neg() } : s === 'asse y' ? { m: m.neg(), k } : { m, k: k.neg() };
		P1 = symOf(s, P0);
		prompt = `Trova l'equazione della retta r', simmetrica di r rispetto ${SYM_WHERE[s]}.`;
		const inv = s === 'asse x' ? "x = x' \\qquad y = -y'" : s === 'asse y' ? "x = -x' \\qquad y = y'" : "x = -x' \\qquad y = -y'";
		const lhs = s === 'asse y' ? "y'" : "-y'";
		const rhs = joinSigned(s === 'asse x' ? times(m, "x'") : times(m, "-x'"), k);
		steps = [SYM_RULE[s], inv, `${lhs} = ${rhs}`, explicitTex(img.m, img.k, true), ...closing(img, P0, P1)];
	} else if (c === 'bisettrice') {
		if (m.equals(q(-1))) return null;
		const mi = ONE.div(m);
		img = { m: mi, k: k.neg().div(m) };
		P1 = pswap(P0);
		prompt = "Trova l'equazione della retta r', simmetrica di r rispetto alla bisettrice y = x.";
		// Mistakes: the known term not divided or with the wrong sign, the slope kept, the slope -1/m.
		cands.push({ m: mi, k: k.div(m) }, { m: mi, k: k.neg() }, { m: mi.neg(), k: k.neg().div(m) });
		steps = [SYM_RULE.bisettrice, "x = y' \\qquad y = x'", `x' = ${joinSigned(times(m, "y'"), k)}`];
		if (!m.isOne()) steps.push(`${lin([[m, "y'"]])} = ${lin([
			[ONE, "x'"],
			[k.neg(), ''],
		])}`);
		steps.push(explicitTex(img.m, img.k, true), ...closing(img, P0, P1));
	} else {
		const h = rng.pick(KS_LINE);
		img = { m, k: k.mul(h) };
		P1 = pscale(P0, h);
		prompt = "Trova l'equazione della retta r', immagine di r nell'omotetia di centro O e rapporto k.";
		problem = `${problem} \\quad k = ${h.toLatex()}`;
		params.k = h.toString();
		// Mistakes: the substitution the other way round (q divided by k), the slope multiplied too.
		cands.push({ m, k: k.div(h) }, { m: m.mul(h), k: k.mul(h) });
		const hi = ONE.div(h);
		const xs = lin([[hi, "x'"]]);
		const sub = m.abs().isOne() ? lin([[m.mul(hi), "x'"]]) : `${m.toLatex()} \\cdot ${hi.sign() < 0 ? `\\left(${xs}\\right)` : xs}`;
		steps = [
			"x' = " + lin([[h, 'x']]) + " \\qquad y' = " + lin([[h, 'y']]),
			`x = ${xs} \\qquad y = ${lin([[hi, "y'"]])}`,
			`${lin([[hi, "y'"]])} = ${joinSigned(sub, k)}`,
			t('Moltiplicando per ') + h.toLatex() + ': ' + explicitTex(img.m, img.k, true),
			...closing(img, P0, P1),
		];
	}
	if (img.k.abs().compare(q(20)) > 0) return null;
	const wrong = cands.filter((l, i) => !sameLine(l, img) && cands.findIndex((o) => sameLine(o, l)) === i).map(lineOpt);
	return {
		case: c,
		prompt,
		problem,
		solution: `r'\\colon ${explicitTex(img.m, img.k)}`,
		steps,
		answer: { kind: 'expression', value: sympyLine(img.m, img.k), latex: explicitTex(img.m, img.k), form: 'explicit' },
		wrong,
		params: { ...params, image: [img.m.toString(), img.k.toString()] },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the transformation from its equations, and its fixed points

type Tr = { kind: 'T'; v: P } | { kind: 'Sx' } | { kind: 'Sy' } | { kind: 'SO' } | { kind: 'Sb' } | { kind: 'H'; k: R };

function trEquations(tr: Tr): [string, string] {
	switch (tr.kind) {
		case 'T':
			return transEq(tr.v) as [string, string];
		case 'Sx':
			return ["x' = x", "y' = -y"];
		case 'Sy':
			return ["x' = -x", "y' = y"];
		case 'SO':
			return ["x' = -x", "y' = -y"];
		case 'Sb':
			return ["x' = y", "y' = x"];
		case 'H':
			return [`x' = ${lin([[tr.k, 'x']])}`, `y' = ${lin([[tr.k, 'y']])}`];
	}
}

function trOption(tr: Tr): ChoiceOption {
	switch (tr.kind) {
		case 'T':
			return { latex: `${t('traslazione di vettore ')}${vecTex(tr.v)}`, values: ['T', ...pVals(tr.v)] };
		case 'Sx':
			return { latex: `${t("simmetria rispetto all'asse ")}x`, values: ['Sx'] };
		case 'Sy':
			return { latex: `${t("simmetria rispetto all'asse ")}y`, values: ['Sy'] };
		case 'SO':
			return { latex: t("simmetria rispetto all'origine"), values: ['SO'] };
		case 'Sb':
			return { latex: `${t('simmetria rispetto a ')}y = x`, values: ['Sb'] };
		case 'H':
			return { latex: `${t('omotetia di centro ')}O${t(' e ')}k = ${tr.k.toLatex()}`, values: ['H', tr.k.toString()] };
	}
}

type Fixed = 'none' | 'O' | 'x' | 'y' | 'bis' | 'all';
const FIXED_TEX: Record<Fixed, string> = {
	none: t('nessun punto'),
	O: t("solo l'origine ") + 'O',
	x: t("i punti dell'asse ") + 'x',
	y: t("i punti dell'asse ") + 'y',
	bis: t('i punti della retta ') + 'y = x',
	all: t('tutti i punti del piano'),
};
const fixedOf = (tr: Tr): Fixed => (tr.kind === 'T' ? 'none' : tr.kind === 'Sx' ? 'x' : tr.kind === 'Sy' ? 'y' : tr.kind === 'Sb' ? 'bis' : 'O');
const KS_H = [q(2), q(3), q(-2), q(-3), q(1, 2), q(-1, 2), q(3, 2), q(1, 3)];

function randomTr(rng: Rng): Tr {
	const kind = weighted(rng, [
		['T', 2],
		['Sx', 1],
		['Sy', 1],
		['SO', 1],
		['Sb', 1],
		['H', 2],
	] as [Tr['kind'], number][]);
	if (kind === 'T') return { kind, v: pt(nz(rng, -6, 6), nz(rng, -6, 6)) };
	if (kind === 'H') return { kind, k: rng.pick(KS_H) };
	return { kind } as Tr;
}

function level6(rng: Rng, c: string): Built | null {
	const tr = randomTr(rng);
	const [ex, ey] = trEquations(tr);
	const problem = `\\begin{cases} ${ex} \\\\ ${ey} \\end{cases}`;
	if (c === 'riconoscere') {
		let cands: Tr[];
		const sx: Tr = { kind: 'Sx' };
		const sy: Tr = { kind: 'Sy' };
		const so: Tr = { kind: 'SO' };
		const sb: Tr = { kind: 'Sb' };
		// Mistakes: the other axis (the name of the axis says which coordinate stays), the vector with the signs
		// changed or swapped, the ratio upside down or with the sign lost.
		if (tr.kind === 'T') cands = [{ kind: 'T', v: pneg(tr.v) }, { kind: 'T', v: pswap(tr.v) }, { kind: 'H', k: tr.v[0] }, sb, { kind: 'T', v: [tr.v[0], tr.v[1].neg()] }];
		else if (tr.kind === 'H') cands = [{ kind: 'H', k: ONE.div(tr.k) }, { kind: 'H', k: tr.k.neg() }, ...(tr.k.isInteger() ? [{ kind: 'T', v: [tr.k, tr.k] } as Tr] : []), so];
		else if (tr.kind === 'Sx') cands = [sy, so, sb];
		else if (tr.kind === 'Sy') cands = [sx, so, sb];
		else if (tr.kind === 'SO') cands = [sx, sy, sb];
		else cands = [so, sx, sy];
		// A homothety of ratio -1 is the symmetry about the origin: never an option, the checker would count it right.
		cands = cands.filter((x) => !(x.kind === 'H' && (x.k.abs().isOne() || x.k.isZero())));
		const choice = buildChoice(rng, trOption(tr), shuffle(rng, cands).map(trOption));
		const why: Record<Tr['kind'], string> = {
			T: t('Si aggiungono due numeri fissi alle coordinate: è una traslazione'),
			Sx: t("L'ascissa resta e l'ordinata cambia segno: il punto si sposta in verticale"),
			Sy: t("L'ordinata resta e l'ascissa cambia segno: il punto si sposta in orizzontale"),
			SO: t('Cambiano segno tutte e due le coordinate'),
			Sb: t('Le due coordinate si scambiano'),
			H: t('Le due coordinate si moltiplicano per lo stesso numero: è un\'omotetia di centro ') + 'O',
		};
		return {
			case: c,
			prompt: 'Che trasformazione descrivono le equazioni?',
			problem,
			solution: trOption(tr).latex,
			steps: [why[tr.kind], trOption(tr).latex],
			answer: choice,
			params: { transformation: trOption(tr).values },
		};
	}
	const truth = fixedOf(tr);
	const order: Record<Fixed, Fixed[]> = {
		none: ['O', 'all', 'x', 'bis'],
		O: ['none', 'all', 'x', 'y'],
		x: ['y', 'O', 'none', 'all'],
		y: ['x', 'O', 'none', 'all'],
		bis: ['O', 'x', 'none', 'all'],
		all: [],
	};
	const opt = (f: Fixed): ChoiceOption => ({ latex: FIXED_TEX[f], values: [f] });
	const choice = buildChoice(rng, opt(truth), order[truth].map(opt));
	const steps: string[] = [t('Un punto è unito se ') + "x' = x" + t(' e ') + "y' = y"];
	if (tr.kind === 'T') steps.push(`x = ${joinSigned('x', tr.v[0])}`, `0 = ${tr.v[0].toLatex()}` + t(': impossibile, nessun punto unito'));
	else if (tr.kind === 'Sx') steps.push('x = x \\qquad y = -y', 'y = 0' + t(": i punti dell'asse ") + 'x');
	else if (tr.kind === 'Sy') steps.push('x = -x \\qquad y = y', 'x = 0' + t(": i punti dell'asse ") + 'y');
	else if (tr.kind === 'SO') steps.push('x = -x \\qquad y = -y', 'x = 0,\\ y = 0' + t(": solo l'origine"));
	else if (tr.kind === 'Sb') steps.push('x = y \\qquad y = x', t('i punti della retta ') + 'y = x');
	else {
		steps.push(`x = ${lin([[tr.k, 'x']])} \\qquad y = ${lin([[tr.k, 'y']])}`, `${lin([[ONE.sub(tr.k), 'x']])} = 0 \\qquad ${lin([[ONE.sub(tr.k), 'y']])} = 0`, 'x = 0,\\ y = 0' + t(": solo l'origine"));
	}
	return {
		case: c,
		prompt: 'Quali sono i punti uniti della trasformazione?',
		problem,
		solution: FIXED_TEX[truth],
		steps,
		answer: choice,
		params: { transformation: trOption(tr).values, fixed: truth },
	};
}

// ---------------------------------------------------------------------------
// Level 7: compositions

/** Symmetric of P about the vertical line x = h or the horizontal line y = h. */
const reflectAbout = (P0: P, vertical: boolean, h: R): P => (vertical ? [h.mul(q(2)).sub(P0[0]), P0[1]] : [P0[0], h.mul(q(2)).sub(P0[1])]);

function level7(rng: Rng, c: string): Built | null {
	if (c === 'assi paralleli') {
		const vertical = rng.next() < 0.6;
		const h1 = rng.int(-5, 5);
		const h2 = rng.int(-5, 5);
		if (h1 === h2) return null;
		const P0 = randomPoint(rng, 6);
		const w = vertical ? 'x' : 'y';
		const i = vertical ? 0 : 1;
		if (P0[i].equals(q(h1)) || P0[i].equals(q(h2))) return null;
		const P1 = reflectAbout(P0, vertical, q(h1));
		const P2 = reflectAbout(P1, vertical, q(h2));
		const d = 2 * (h2 - h1);
		const shift = (n: number): P => padd(P0, vertical ? pt(n, 0) : pt(0, n));
		if (!inRange(P2, 20)) return null;
		// Mistakes: the order swapped (s_a after s_b), the distance not doubled, only one of the two symmetries.
		const cands = [shift(-d), shift(d / 2), P1, reflectAbout(P0, vertical, q(h2))];
		const choice = buildChoice(rng, pointOption(P2), cands.map(pointOption), nearBy(P2, pointOption));
		const vec: P = vertical ? pt(d, 0) : pt(0, d);
		return {
			case: c,
			prompt: "Trova l'immagine P'' di P applicando prima la simmetria di asse a e poi quella di asse b.",
			problem: `a\\colon ${w} = ${h1} \\quad b\\colon ${w} = ${h2} \\quad ${named('P', P0)}`,
			solution: named("P''", P2),
			steps: [
				`P'' = s_b(s_a(P))` + t(': prima la simmetria di asse ') + 'a' + t(', poi quella di asse ') + 'b',
				`s_a\\colon ${named('P', P0)} \\to ${named("P'", P1)}`,
				`s_b\\colon ${named("P'", P1)} \\to ${named("P''", P2)}`,
				t('Gli assi sono paralleli a distanza ') + `${Math.abs(h2 - h1)}` + t(': è la traslazione di vettore ') + vecTex(vec),
			],
			answer: choice,
			params: { a: [w, String(h1)], b: [w, String(h2)], P: pVals(P0) },
		};
	}
	if (c === 'due traslazioni') {
		const v1 = pt(nz(rng, -6, 6), nz(rng, -6, 6));
		const v2 = pt(nz(rng, -6, 6), nz(rng, -6, 6));
		const v = padd(v1, v2);
		if (v[0].isZero() || v[1].isZero()) return null;
		// Mistakes: the vectors subtracted one way or the other, the sum with the components swapped.
		const cands = [psub(v2, v1), psub(v1, v2), pswap(v), pt(v1[0].add(v2[1]), v1[1].add(v2[0]))];
		const choice = buildChoice(rng, vecOption(v), cands.map(vecOption), nearBy(v, vecOption));
		return {
			case: c,
			prompt: 'Trova il vettore v della traslazione che si ottiene applicando prima quella di vettore v₁ e poi quella di vettore v₂.',
			problem: `${vecTex(v1, '\\vec{v}_1')} \\quad ${vecTex(v2, '\\vec{v}_2')}`,
			solution: vecTex(v),
			steps: [
				t('Il punto si sposta prima di ') + '\\vec{v}_1' + t(' e poi di ') + '\\vec{v}_2' + t(': gli spostamenti si sommano'),
				`a = ${v1[0].toLatex()} + ${paren(v2[0])} = ${v[0].toLatex()} \\qquad b = ${v1[1].toLatex()} + ${paren(v2[1])} = ${v[1].toLatex()}`,
				vecTex(v),
			],
			answer: choice,
			params: { v1: pVals(v1), v2: pVals(v2) },
		};
	}
	// Perpendicular axes a: x = h and b: y = k: the composition is the central symmetry about C(h, k).
	const h = rng.int(-4, 4);
	const k = rng.int(-4, 4);
	if (h === 0 && k === 0) return null;
	const P0 = randomPoint(rng, 6);
	if (P0[0].equals(q(h)) || P0[1].equals(q(k))) return null;
	const P1 = reflectAbout(P0, true, q(h));
	const P2 = reflectAbout(P1, false, q(k));
	if (!inRange(P2, 16)) return null;
	const C = pt(h, k);
	// Mistakes: the symmetric about the origin (the axes forgotten), one symmetry only, the translation by (2h, 2k).
	const cands = [pneg(P0), P1, reflectAbout(P0, false, q(k)), padd(P0, pt(2 * h, 2 * k))];
	const choice = buildChoice(rng, pointOption(P2), cands.map(pointOption), nearBy(P2, pointOption));
	return {
		case: c,
		prompt: "Trova l'immagine P'' di P applicando prima la simmetria di asse a e poi quella di asse b.",
		problem: `a\\colon x = ${h} \\quad b\\colon y = ${k} \\quad ${named('P', P0)}`,
		solution: named("P''", P2),
		steps: [
			`P'' = s_b(s_a(P))` + t(': prima la simmetria di asse ') + 'a' + t(', poi quella di asse ') + 'b',
			`s_a\\colon ${named('P', P0)} \\to ${named("P'", P1)}`,
			`s_b\\colon ${named("P'", P1)} \\to ${named("P''", P2)}`,
			t('Gli assi sono perpendicolari e si incontrano in ') + named('C', C) + t(': è la simmetria centrale di centro ') + 'C',
		],
		answer: choice,
		params: { a: ['x', String(h)], b: ['y', String(k)], P: pVals(P0) },
	};
}

// ---------------------------------------------------------------------------

/** The case of a level is drawn once, and only the numbers are drawn again when they do not fit. */
const CASES: Record<number, [string, number][]> = {
	1: [
		['immagine', 6],
		['vettore', 2],
		['punto di partenza', 2],
	],
	2: [
		['asse x', 2.5],
		['asse y', 2.5],
		['origine', 2],
		['bisettrice', 3],
	],
	3: [
		['punto', 4],
		['rapporto', 3],
		['area', 3],
	],
	4: [
		['intero', 7],
		['frazionario', 3],
	],
	5: [
		['asse x', 2],
		['asse y', 2],
		['origine', 1.5],
		['bisettrice', 2],
		['omotetia', 2.5],
	],
	6: [
		['riconoscere', 6],
		['punti uniti', 4],
	],
	7: [
		['assi paralleli', 4],
		['due traslazioni', 2.5],
		['assi perpendicolari', 3.5],
	],
};

const BY_LEVEL: Record<number, (rng: Rng, c: string) => Built | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

function build(rng: Rng, level: number): Built | null {
	const fn = BY_LEVEL[level];
	if (!fn) throw new Error(`${ID}: unknown level ${level}`);
	const c = weighted(rng, CASES[level]);
	for (let i = 0; i < 500; i++) {
		const b = fn(rng, c);
		if (b) return b;
	}
	return null;
}

const FORBIDDEN: [string, RegExp][] = [
	['+ -', /\+\s*-/],
	['- -', /-\s*-/],
	['1x', /(?<![\d}])1\s*x/],
	['+ 0', /[+-]\s*0(?!\d)/],
];

const ANSWER_KIND: Record<number, string[]> = { 1: ['choice'], 2: ['choice'], 3: ['choice', 'number'], 4: ['expression'], 5: ['expression'], 6: ['choice'], 7: ['choice'] };

function check(sample: Sample): string[] {
	const v: string[] = [];
	for (const [name, rx] of FORBIDDEN) if (rx.test(sample.problem)) v.push(`testo con '${name}'`);
	if (!sample.steps.length || !sample.solution) v.push('passaggi o soluzione mancanti');
	const a = sample.answer;
	if (!ANSWER_KIND[sample.level]?.includes(a.kind)) v.push(`risposta ${a.kind} al livello ${sample.level}`);
	if (a.kind === 'choice') {
		if (a.options.length !== 4) v.push('servono quattro opzioni');
		if (new Set(a.options.map((o) => o.values.join('|'))).size !== a.options.length) v.push('opzioni ripetute');
	}
	if (a.kind === 'expression') {
		if (a.form !== 'explicit') v.push('forma richiesta mancante');
		for (const [name, rx] of FORBIDDEN) if (rx.test(a.latex)) v.push(`risposta con '${name}'`);
	}
	const c = sample.choice;
	if (c && c.options.length !== 4) v.push('servono quattro opzioni');
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const a = sample.answer;
	if (a.kind === 'choice') return a;
	const wrong = (sample.params.wrong as Opt[]) ?? [];
	const opt = (o: Opt): ChoiceOption => ({ latex: o.latex, values: [o.value] });
	if (a.kind === 'number') {
		const value = R(a.value);
		const fallback = (i: number) => {
			const k = Math.floor(i / 2) + 1;
			const w = value.isInteger() ? value.add(q(i % 2 ? -k : k)) : i % 2 ? value.mul(q(k + 1)) : value.div(q(k + 1));
			return w.isZero() ? null : ratOption(w);
		};
		return buildChoice(rng, ratOption(value), wrong.map(opt), fallback);
	}
	if (a.kind === 'expression') {
		const [m, k] = (sample.params.image as string[]).map(R);
		const fallback = (i: number) => lineOpt({ m, k: k.add(q(i % 2 ? -(i + 1) : i + 1)) });
		return buildChoice(rng, { latex: a.latex, values: [a.value] }, wrong.map(opt), (i) => opt(fallback(i)));
	}
	throw new Error(`${ID}: no choice for ${a.kind}`);
}

export const trasformazioniGeometriche: Generator = {
	id: ID,
	title: 'Trasformazioni geometriche',
	levels: {
		1: { label: 'Traslazione di un punto', constraints: ['immagine 6 su 10, vettore 2 su 10, punto di partenza 2 su 10', 'coordinate intere, P tra -8 e 8, vettore tra -6 e 6'] },
		2: { label: 'Simmetrici nel piano cartesiano', constraints: ['asse x e asse y 2,5 su 10, origine 2 su 10, bisettrice y = x 3 su 10', 'coordinate non nulle con |x| diverso da |y|'] },
		3: { label: 'Omotetia di centro O', constraints: ['immagine di un punto 4 su 10, rapporto 3 su 10, area 3 su 10', 'k diverso da 1, -1 e 0'] },
		4: { label: 'Retta traslata', constraints: ['coefficiente angolare intero 7 su 10, frazionario 3 su 10', 'risposta in forma esplicita', 'la retta immagine non coincide con r'] },
		5: { label: 'Retta simmetrica od omotetica', constraints: ['simmetria rispetto agli assi, all’origine, alla bisettrice; omotetia di centro O', 'risposta in forma esplicita'] },
		6: { label: 'Dalle equazioni alla trasformazione', constraints: ['riconoscere 6 su 10, punti uniti 4 su 10'] },
		7: { label: 'Composizioni', constraints: ['assi paralleli 4 su 10, due traslazioni 2,5 su 10, assi perpendicolari 3,5 su 10'] },
	},
	generate(rng: Rng, level: number): Sample {
		// With consecutive seeds the first draws of rng.ts are not uniform: skip two before the case.
		rng.next();
		rng.next();
		for (let attempt = 0; attempt < 2000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer: b.answer,
				params: { case: b.case, ...b.params },
			};
			if (b.wrong) sample.params.wrong = b.wrong;
			if (check(sample).length) continue;
			try {
				toChoice(sample, rng);
			} catch {
				continue;
			}
			return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default trasformazioniGeometriche;
