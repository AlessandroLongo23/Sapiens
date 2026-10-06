/**
 * Funzione esponenziale. Spec: specs/exercises/funzioni-esponenziali.md
 *
 * Nine levels in the order of lesson 121 (docs/lezioni/riscritte/121-funzioni-esponenziali.md): the values of
 * a^x, increasing or decreasing from the base, powers with the same base compared without computing them, the
 * base from a point of the graph, asymptote and image of a shifted or reflected graph, the graph of a function
 * chosen among four, the function read from its graph, the domain of a function with an exponential, growth and
 * decay.
 *
 * Levels 1, 4 and 9 have a number for answer, level 8 the values left out of the domain; levels 2, 3 and 5 are
 * a choice among four functions, four powers, four lines or four intervals. Level 6 is a choice among four graphs
 * (planes drawn from their formulas: ../piano.ts); level 7 shows a graph and asks for the base, a number, or for
 * the function among four. The wrong options come from the lesson's warnings: a negative exponent taken for a
 * negative result, the sign of the exponent that hides the base, the order turned with a base smaller than 1, a
 * growth of p% a step added and not multiplied; the wrong graphs from the base swapped with its reciprocal, the
 * exponent read as a factor, a shift to the wrong side or along the other axis.
 */
import type { Answer, ChoiceAnswer, ChoiceOption, Generator, NumberAnswer, Rng, Sample, SceneRef, SetAnswer } from '../types';
import { piano, type PianoCurve } from '../piano';
import { Rational, q } from '../rational';
import { forbidden } from '../monomi';
import { intNot, linLatex, powLatex, ratPow, shuffled, sortRat } from '../esponenziali';

export const ID = 'funzioni-esponenziali';

interface Build {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	/** The right option first, then the wrong ones in order of preference. */
	options: ChoiceOption[];
	/** The open answer; absent when the exercise is a choice. */
	open?: NumberAnswer | SetAnswer;
	/** The graph under the problem, and the one shown with the solution. */
	scene?: SceneRef;
	solutionScene?: SceneRef;
	params: Record<string, unknown>;
}

const text = (s: string) => `\\text{${s}}`;
const numOption = (r: Rational): ChoiceOption => ({ latex: r.toLatex(), values: [r.toString()] });

/** A base as the lesson writes it: an integer, a fraction or a decimal. */
interface Base {
	tex: string;
	value: Rational;
}
const intBase = (n: number): Base => ({ tex: `${n}`, value: q(n) });
const fracBase = (n: number, d: number): Base => ({ tex: `\\left(${q(n, d).toLatex()}\\right)`, value: q(n, d) });
const decBase = (tenths: number): Base => ({ tex: `${Math.floor(tenths / 10)}{,}${tenths % 10}`, value: q(tenths, 10) });
const pw = (b: Base, exp: string) => `${b.tex}^${exp.length === 1 ? exp : `{${exp}}`}`;

// ---------------------------------------------------------------------------
// Level 1: values

const L1_BASES: [number, number][] = [
	[2, 1],
	[3, 1],
	[4, 1],
	[5, 1],
	[10, 1],
	[1, 2],
	[1, 3],
	[1, 4],
	[2, 3],
	[3, 2],
	[3, 4],
	[2, 5],
];

function level1(rng: Rng): Build | null {
	const [n, d] = rng.pick(L1_BASES);
	const base = q(n, d);
	const u = rng.next();
	const k = u < 0.55 ? rng.int(-3, -1) : u < 0.65 ? 0 : rng.int(2, 3);
	const v = ratPow(base, k);
	if (Math.abs(v.num) > 1000 || v.den > 1000) return null;
	const fx = powLatex(base, 'x');
	const steps: string[] = [];
	const arg = k < 0 ? `(${k})` : `${k}`;
	if (k < 0) {
		const inv = q(1).div(base);
		steps.push(`f${arg} = ${powLatex(base, `${k}`)}`, text("L'esponente negativo dà il reciproco: ") + `${powLatex(base, `${k}`)} = ${powLatex(inv, `${-k}`)}`);
	} else if (k === 0) steps.push(`f(0) = ${powLatex(base, '0')}`, text('Ogni potenza con esponente zero vale 1.'));
	else steps.push(`f(${k}) = ${powLatex(base, `${k}`)}`);
	steps.push(`f${arg} = ${v.toLatex()}`);
	const pos = ratPow(base, Math.abs(k));
	const cands = k < 0 ? [pos.neg(), pos, v.neg(), base.mul(q(k)), q(k)] : k === 0 ? [q(0), base, q(1).neg(), base.neg()] : [base.mul(q(k)), q(1).div(v), v.neg(), base.add(q(k)), ratPow(base, k + 1)];
	return {
		case: k < 0 ? 'esponente negativo' : k === 0 ? 'esponente zero' : 'esponente positivo',
		prompt: `Calcola f(${k}).`,
		problem: `f(x) = ${fx}`,
		solution: `f${arg} = ${v.toLatex()}`,
		steps,
		options: [v, ...cands].map(numOption),
		open: { kind: 'number', value: v.toString() },
		params: { base: base.toString(), k },
	};
}

// ---------------------------------------------------------------------------
// Level 2: increasing or decreasing

interface Fn {
	tex: string;
	/** The base of the function written as a^x. */
	base: Rational;
	key: string;
	why: string;
}

function fnPool(): Fn[] {
	const out: Fn[] = [];
	const add = (b: Base, neg: boolean) => {
		const eff = neg ? q(1).div(b.value) : b.value;
		const shown = neg ? eff.toLatex() : b.tex.replace('\\left(', '').replace('\\right)', '');
		const cmp = eff.compare(q(1)) > 0 ? `${shown} > 1` : `0 < ${shown} < 1`;
		const head = neg ? `${pw(b, '-x')} = ${powLatex(eff, 'x')}, \\quad ` : '';
		out.push({ tex: `y = ${pw(b, neg ? '-x' : 'x')}`, base: eff, key: `${b.tex}|${neg ? '-x' : 'x'}`, why: `${head}${cmp}` });
	};
	for (const n of [2, 3, 4, 5, 7, 10]) add(intBase(n), false);
	for (const [n, d] of [
		[1, 2],
		[1, 3],
		[2, 3],
		[3, 4],
		[2, 5],
		[3, 2],
		[4, 3],
		[5, 2],
		[5, 4],
	])
		add(fracBase(n, d), false);
	for (const t of [3, 5, 7, 9, 12, 15, 25]) add(decBase(t), false);
	for (const n of [2, 3, 5]) add(intBase(n), true);
	for (const [n, d] of [
		[1, 2],
		[1, 3],
		[2, 3],
		[3, 2],
	])
		add(fracBase(n, d), true);
	return out;
}
const FN_POOL = fnPool();

function level2(rng: Rng): Build | null {
	const wantInc = rng.next() < 0.5;
	const inc = (f: Fn) => f.base.compare(q(1)) > 0;
	const right = rng.pick(FN_POOL.filter((f) => inc(f) === wantInc));
	const others = shuffled(
		rng,
		FN_POOL.filter((f) => inc(f) !== wantInc),
	).slice(0, 3);
	// the hidden base is the difficulty of the level: at least one function with -x
	if (![right, ...others].some((f) => f.key.endsWith('|-x'))) return null;
	const shown = shuffled(rng, [right, ...others]);
	const word = (f: Fn) => (inc(f) ? 'crescente' : 'decrescente');
	return {
		case: `${wantInc ? 'crescente' : 'decrescente'}${right.key.endsWith('|-x') ? ', con -x' : ''}`,
		prompt: `Quale di queste funzioni è ${wantInc ? 'crescente' : 'decrescente'}?`,
		problem: shown.map((f) => f.tex).join(' \\quad '),
		solution: right.tex,
		steps: shown.map((f) => `${f.why}${text(`: ${word(f)}`)}`),
		options: [right, ...others].map((f) => ({ latex: f.tex, values: [f.key] })),
		params: { ask: wantInc ? 'crescente' : 'decrescente', functions: shown.map((f) => ({ key: f.key, base: f.base.toString() })) },
	};
}

// ---------------------------------------------------------------------------
// Level 3: comparing powers with the same base

interface Exp {
	tex: string;
	sym: string;
	val: number;
	/** How the steps write an irrational exponent: \sqrt{3} \approx 1{,}73. */
	approx?: string;
}
const EXPS: Exp[] = [
	{ tex: '-2', sym: '-2', val: -2 },
	{ tex: '-\\sqrt{2}', sym: '-sqrt(2)', val: -Math.SQRT2, approx: '-1{,}41' },
	{ tex: '-1', sym: '-1', val: -1 },
	{ tex: '-\\frac{1}{2}', sym: '-1/2', val: -0.5 },
	{ tex: '\\frac{1}{2}', sym: '1/2', val: 0.5 },
	{ tex: '\\frac{2}{3}', sym: '2/3', val: 2 / 3 },
	{ tex: '\\sqrt{2}', sym: 'sqrt(2)', val: Math.SQRT2, approx: '1{,}41' },
	{ tex: '\\frac{3}{2}', sym: '3/2', val: 1.5 },
	{ tex: '1{,}7', sym: '17/10', val: 1.7 },
	{ tex: '\\sqrt{3}', sym: 'sqrt(3)', val: Math.sqrt(3), approx: '1{,}73' },
	{ tex: '2', sym: '2', val: 2 },
	{ tex: '\\sqrt{5}', sym: 'sqrt(5)', val: Math.sqrt(5), approx: '2{,}24' },
	{ tex: '\\frac{5}{2}', sym: '5/2', val: 2.5 },
	{ tex: '3', sym: '3', val: 3 },
	{ tex: '\\pi', sym: 'pi', val: Math.PI, approx: '3{,}14' },
];
const L3_BASES: Base[] = [intBase(2), intBase(3), intBase(5), intBase(10), fracBase(3, 2), fracBase(1, 2), fracBase(1, 3), fracBase(2, 3), decBase(3), decBase(5)];

function level3(rng: Rng): Build | null {
	const base = rng.pick(L3_BASES);
	const big = base.value.compare(q(1)) > 0;
	const exps = shuffled(rng, EXPS).slice(0, 4);
	const sorted = [...exps].sort((u, v) => u.val - v.val);
	if (sorted.some((e, i) => i > 0 && e.val - sorted[i - 1].val < 0.03)) return null;
	if (!exps.some((e) => e.approx)) return null;
	const wantMax = rng.next() < 0.5;
	// with a base greater than 1 the largest power has the largest exponent; with a base smaller than 1, the smallest
	const right = wantMax === big ? sorted[3] : sorted[0];
	const wrongFirst = wantMax === big ? sorted[0] : sorted[3];
	const rest = sorted.filter((e) => e !== right && e !== wrongFirst);
	const item = (e: Exp) => pw(base, e.tex);
	const approxes = sorted.filter((e) => e.approx).map((e) => `${e.tex} \\approx ${e.approx}`);
	const baseTex = base.tex.replace('\\left(', '').replace('\\right)', '');
	return {
		case: `${big ? 'base maggiore di 1' : 'base tra 0 e 1'}, ${wantMax ? 'il più grande' : 'il più piccolo'}`,
		prompt: `Qual è il più ${wantMax ? 'grande' : 'piccolo'} di questi numeri?`,
		problem: exps.map(item).join(' \\quad '),
		solution: item(right),
		steps: [
			approxes.join(', \\quad '),
			sorted.map((e) => e.tex).join(' < '),
			big ? `${baseTex} > 1${text(": l'ordine delle potenze è quello degli esponenti.")}` : `0 < ${baseTex} < 1${text(": l'ordine delle potenze è il contrario di quello degli esponenti.")}`,
			text(`Il numero più ${wantMax ? 'grande' : 'piccolo'} è `) + item(right),
		],
		options: [right, wrongFirst, ...rest].map((e) => ({ latex: item(e), values: [e.sym] })),
		params: { base: base.value.toString(), ask: wantMax ? 'max' : 'min', exps: exps.map((e) => e.sym) },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the base from a point

function level4(rng: Rng): Build | null {
	const [n, d] = rng.pick([...L1_BASES, [5, 2] as [number, number]]);
	const a = q(n, d);
	const k = rng.pick([-3, -2, -1, -1, 2, 2, 3]);
	const v = ratPow(a, k);
	if (Math.abs(v.num) > 1000 || v.den > 1000) return null;
	const inv = q(1).div(a);
	const steps = [`a^{${k}} = ${v.toLatex()}`];
	if (k < 0) steps.push(k === -1 ? `\\frac{1}{a} = ${v.toLatex()}` : `\\frac{1}{a^${-k}} = ${v.toLatex()} \\ \\Rightarrow \\ a^${-k} = ${q(1).div(v).toLatex()}`);
	steps.push(text('La base è positiva: ') + `a = ${a.toLatex()}`);
	const cands = [inv, v.div(q(k)), a.neg(), v, q(1).div(v), a.add(q(1))];
	return {
		case: k < 0 ? 'ascissa negativa' : 'ascissa positiva',
		prompt: 'Trova la base a della funzione esponenziale y = a^x che passa per il punto P.',
		problem: `P\\left(${k}, ${v.toLatex()}\\right)`,
		solution: `a = ${a.toLatex()}`,
		steps,
		options: [a, ...cands].map(numOption),
		open: { kind: 'number', value: a.toString() },
		params: { k, value: v.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 5: asymptote and image of a transformed graph

/** An interval of the y axis: "(k,oo)", "(-oo,0)", "[k,oo)", "(-oo,oo)". */
function imageOption(lo: number | null, hi: number | null, closed = false): ChoiceOption {
	if (lo === null && hi === null) return { latex: '\\mathbb{R}', values: ['(-oo,oo)'] };
	if (hi === null) return { latex: `${closed ? '[' : '\\mathopen{]}'}${lo}, +\\infty\\mathclose{[}`, values: [`${closed ? '[' : '('}${lo},oo)`] };
	return { latex: `\\mathopen{]}-\\infty, ${hi}${closed ? ']' : '\\mathclose{[}'}`, values: [`(-oo,${hi}${closed ? ']' : ')'}`] };
}
const lineOption = (axis: 'x' | 'y', v: number): ChoiceOption => ({ latex: `${axis} = ${v}`, values: [axis, `${v}`] });

function level5(rng: Rng): Build | null {
	const base = rng.pick([q(2), q(3), q(5), q(1, 2), q(1, 3)]);
	const u = rng.next();
	const form = u < 0.3 ? 'in su o in giù' : u < 0.5 ? 'a destra o a sinistra' : u < 0.6 ? "ribaltata rispetto all'asse x" : u < 0.7 ? "ribaltata rispetto all'asse y" : 'due spostamenti';
	const h = form === 'a destra o a sinistra' || form === 'due spostamenti' ? intNot(rng, -5, 5, [0]) : 0;
	const k = form === 'in su o in giù' || form === 'due spostamenti' ? intNot(rng, -6, 6, [0, h]) : 0;
	const flipX = form === "ribaltata rispetto all'asse x";
	const expL = form === "ribaltata rispetto all'asse y" ? '-x' : linLatex(1, -h);
	const body = `${flipX ? '-' : ''}${powLatex(base, expL)}${k === 0 ? '' : k > 0 ? ` + ${k}` : ` - ${-k}`}`;
	const fx = `y = ${body}`;
	const src = `y = ${powLatex(base, 'x')}`;
	const how: string[] = [];
	if (h !== 0) how.push(text(`È il grafico di `) + src + text(` spostato a ${h > 0 ? 'destra' : 'sinistra'} di ${Math.abs(h)}: asintoto e immagine non cambiano.`));
	if (k !== 0) how.push(text(`${h !== 0 ? 'Poi è' : 'È il grafico di '}`) + (h !== 0 ? '' : src) + text(` spostato in ${k > 0 ? 'su' : 'giù'} di ${Math.abs(k)}: l'asintoto diventa `) + `y = ${k}`);
	if (flipX) how.push(text('È il grafico di ') + src + text(" ribaltato rispetto all'asse x: sta tutto sotto l'asse, e l'asintoto resta ") + 'y = 0');
	if (form === "ribaltata rispetto all'asse y") how.push(text('È il grafico di ') + src + text(" ribaltato rispetto all'asse y: asintoto e immagine non cambiano."));
	const askImage = rng.next() < 0.5;
	let options: ChoiceOption[];
	if (askImage) {
		const right = flipX ? imageOption(null, 0) : imageOption(k, null);
		const cands = flipX
			? [imageOption(0, null), imageOption(null, null), imageOption(null, 0, true), imageOption(null, -1)]
			: k !== 0
				? [imageOption(0, null), imageOption(null, k), imageOption(k, null, true), imageOption(-k, null), imageOption(null, null)]
				: [imageOption(null, null), imageOption(0, null, true), ...(h !== 0 ? [imageOption(h, null)] : []), imageOption(null, 0), imageOption(1, null)];
		options = [right, ...cands];
		how.push(text("L'immagine è ") + right.latex);
	} else {
		const right = lineOption('y', k);
		const cands = k !== 0 ? [lineOption('y', 0), lineOption('y', -k), lineOption('x', k), ...(h !== 0 ? [lineOption('y', h)] : []), lineOption('y', 1)] : [...(h !== 0 ? [lineOption('y', h), lineOption('x', h)] : []), lineOption('x', 0), lineOption('y', 1), lineOption('y', -1)];
		options = [right, ...cands];
		how.push(text("L'asintoto orizzontale è ") + right.latex);
	}
	return {
		case: `${askImage ? 'immagine' : 'asintoto'}: ${form}`,
		prompt: askImage ? "Qual è l'immagine della funzione?" : "Qual è l'asintoto orizzontale del grafico della funzione?",
		problem: fx,
		solution: options[0].latex,
		steps: how,
		options,
		params: { base: base.toString(), form, h, k, flipX, ask: askImage ? 'immagine' : 'asintoto' },
	};
}

// ---------------------------------------------------------------------------
// Levels 6 and 7: graphs

/** What a plane of these levels draws: an exponential, shifted or reflected, or a line a wrong reading gives. */
interface ExpGraph {
	kind: 'exp';
	base: Rational;
	/** -1 for -a^x. */
	sign: 1 | -1;
	/** The exponent is -x; then h is 0. */
	neg: boolean;
	h: number;
	k: number;
}
interface LineGraph {
	kind: 'line';
	/** y = m x + c: the constant y = 1 of 1^x, or the line y = a x of who reads the exponent as a factor. */
	m: Rational;
	c: number;
}
type Graph = ExpGraph | LineGraph;
type Win = [number, number, number, number];

const expGraph = (base: Rational, more: Partial<Omit<ExpGraph, 'kind' | 'base'>> = {}): ExpGraph => ({ kind: 'exp', base, sign: 1, neg: false, h: 0, k: 0, ...more });
const lineGraph = (m: Rational, c: number): LineGraph => ({ kind: 'line', m, c });
const shift = (k: number) => (k === 0 ? '' : k > 0 ? ` + ${k}` : ` - ${-k}`);

/** The right side of y = …, as the problem writes it and as the plane reads it. */
function graphBody(g: Graph): string {
	if (g.kind === 'line') return g.m.isZero() ? `${g.c}` : `${g.m.isOne() ? '' : g.m.toLatex()}x`;
	return `${g.sign < 0 ? '-' : ''}${powLatex(g.base, g.neg ? '-x' : linLatex(1, -g.h))}${shift(g.k)}`;
}
const graphTex = (g: Graph) => `y = ${graphBody(g)}`;

function graphValue(g: Graph, x: number): number {
	if (g.kind === 'line') return (g.m.num / g.m.den) * x + g.c;
	return g.sign * Math.pow(g.base.num / g.base.den, (g.neg ? -x : x) - g.h) + g.k;
}

/** The base of the exponential read as a^x: the reciprocal when the exponent is -x. */
const effBase = (g: ExpGraph) => (g.neg ? q(1).div(g.base) : g.base);
const rises = (g: Graph) => (g.kind === 'line' ? g.m.sign() > 0 : g.sign * (effBase(g).compare(q(1)) > 0 ? 1 : -1) > 0);

/**
 * Two points of the graph with whole coordinates: where a^x has (0, 1), and one step to the side where the height
 * is whole (to the right for a base above 1, to the left for a base 1/n).
 */
function latticePoints(g: ExpGraph): [number, number][] {
	const b = effBase(g);
	const up = b.compare(q(1)) > 0;
	const far = up ? b : q(1).div(b);
	return [
		[g.h, g.sign + g.k],
		[g.h + (up ? 1 : -1), g.sign * far.num + g.k],
	];
}
const inWin = (w: Win, [x, y]: [number, number], margin = 0.5) => x >= w[0] + margin && x <= w[1] - margin && y >= w[2] + margin && y <= w[3] - margin;
const plain = (n: number) => `${n}`.replace('-', '−');
const pointTex = ([x, y]: [number, number]) => `(${x}, ${y})`;

/** What the graph looks like, for who cannot see it: the direction, a point, the asymptote. */
function describe(g: Graph): string {
	if (g.kind === 'line') return g.m.isZero() ? `Una retta orizzontale all'altezza ${plain(g.c)}.` : `Una retta che ${rises(g) ? 'sale' : 'scende'} da sinistra verso destra e passa per l'origine.`;
	const [x, y] = latticePoints(g)[0];
	const near = effBase(g).compare(q(1)) > 0 ? 'a sinistra' : 'a destra';
	const line = g.k === 0 ? "all'asse x" : `alla retta tratteggiata y = ${plain(g.k)}`;
	return `Una curva che ${rises(g) ? 'sale' : 'scende'} da sinistra verso destra, passa per il punto (${plain(x)}, ${plain(y)}) e ${near} si avvicina ${line} ${g.sign > 0 ? 'da sopra' : 'da sotto'}.`;
}

/** The plane with the graph: its asymptote dashed when it is not the x axis, and its points with whole coordinates. */
function graphScene(g: Graph, win: Win, points: 'none' | 'first' | 'both' | 'named' = 'none'): SceneRef {
	const curve: PianoCurve[] = [{ formula: graphTex(g) }];
	if (g.kind === 'exp' && g.k !== 0) curve.push({ formula: `y = ${g.k}`, tratto: 'tratteggiato' });
	const marked = g.kind === 'exp' && points !== 'none' ? latticePoints(g).filter((p) => inWin(win, p)).slice(0, points === 'first' ? 1 : 2) : [];
	const punti = marked.map(([x, y]) => ({ x, y, ...(points === 'named' ? { etichetta: `(${plain(x)}, ${plain(y)})` } : {}) }));
	return piano({ finestra: win, curve, ...(punti.length ? { punti } : {}) }, describe(g));
}

/** Two graphs that a small drawing tells apart: far from each other, as the window shows them, over a stretch of it. */
function apart(a: Graph, b: Graph, w: Win): boolean {
	const height = w[3] - w[2];
	const cut = (y: number) => Math.min(w[3], Math.max(w[2], y));
	let most = 0;
	let wide = 0;
	for (let i = 0; i <= 40; i++) {
		const x = w[0] + ((w[1] - w[0]) * i) / 40;
		const d = Math.abs(cut(graphValue(a, x)) - cut(graphValue(b, x))) / height;
		most = Math.max(most, d);
		if (d >= 0.08) wide++;
	}
	return most >= 0.15 && wide >= 6;
}

const graphOption = (g: Graph, win: Win): ChoiceOption => ({ latex: '', values: [graphBody(g)], scene: graphScene(g, win, 'first'), text: describe(g) });
const formulaOption = (g: Graph): ChoiceOption => ({ latex: graphTex(g), values: [graphBody(g)] });

const GRAPH_BASES = [q(2), q(3), q(1, 2), q(1, 3)];
const W_PLAIN: Win = [-4, 4, -3, 5];
const W_SHIFT: Win = [-5, 5, -5, 5];
const W_FLIP: Win = [-4, 4, -4, 4];

/** The graph of y = a^x, shifted or reflected, said in the two steps of the solution. */
function graphSteps(g: ExpGraph, win: Win): string[] {
	const src = `y = ${powLatex(g.base, 'x')}`;
	const pts = latticePoints(g).filter((p) => inWin(win, p));
	const through = pts.map(pointTex).join(text(' e '));
	if (g.sign < 0) return [text('È il grafico di ') + src + text(" ribaltato rispetto all'asse x: sta tutto sotto l'asse."), text('Passa per ') + through];
	if (g.neg) return [`${powLatex(g.base, '-x')} = ${powLatex(effBase(g), 'x')}` + text(': è il grafico di ') + src + text(" ribaltato rispetto all'asse y."), text('Passa per ') + through];
	if (g.k !== 0) return [text('È il grafico di ') + src + text(` spostato in ${g.k > 0 ? 'su' : 'giù'} di ${Math.abs(g.k)}.`), text("L'asintoto è la retta ") + `y = ${g.k}` + text(' e il grafico passa per ') + through];
	if (g.h !== 0) return [text('È il grafico di ') + src + text(` spostato a ${g.h > 0 ? 'destra' : 'sinistra'} di ${Math.abs(g.h)}.`), text("L'asintoto resta l'asse x e il grafico passa per ") + through];
	const b = g.base.toLatex();
	return [(g.base.compare(q(1)) > 0 ? `${b} > 1` : `0 < ${b} < 1`) + text(`: la funzione è ${rises(g) ? 'crescente' : 'decrescente'}.`), text('Il grafico passa per ') + through + text(" e sta sopra l'asse x, che è il suo asintoto.")];
}

/** Level 6, from the function to its graph: four small planes, the wrong ones drawn from a real mistake each. */
function level6(rng: Rng): Build | null {
	const u = rng.next();
	const form = u < 0.35 ? 'a^x' : u < 0.6 ? 'in su o in giù' : u < 0.85 ? 'a destra o a sinistra' : u < 0.93 ? "ribaltata rispetto all'asse x" : "ribaltata rispetto all'asse y";
	const base = rng.pick(form === 'a^x' ? [...GRAPH_BASES, q(4), q(1, 4)] : GRAPH_BASES);
	const inv = q(1).div(base);
	const d = rng.pick([-3, -2, 2, 3]);
	let right: ExpGraph;
	let wrong: Graph[];
	let win: Win;
	if (form === 'a^x') {
		right = expGraph(base);
		// the base swapped with its reciprocal, then 1^x (a constant), the sign in front, the exponent read as a factor
		wrong = [expGraph(inv), ...shuffled(rng, [lineGraph(q(0), 1), expGraph(base, { sign: -1 }), lineGraph(base, 0)])];
		win = W_PLAIN;
	} else if (form === 'in su o in giù') {
		right = expGraph(base, { k: d });
		// moved to the other side, moved along x, and one of: not moved at all, the base swapped
		wrong = [expGraph(base, { k: -d }), expGraph(base, { h: d }), rng.pick([expGraph(base), expGraph(inv, { k: d })])];
		win = W_SHIFT;
	} else if (form === 'a destra o a sinistra') {
		right = expGraph(base, { h: d });
		wrong = [expGraph(base, { h: -d }), expGraph(base, { k: d }), rng.pick([expGraph(base), expGraph(base, { k: -d })])];
		win = W_SHIFT;
	} else {
		const flipX = form === "ribaltata rispetto all'asse x";
		right = expGraph(base, flipX ? { sign: -1 } : { neg: true });
		// the other axis, no reflection, both
		wrong = [expGraph(base, flipX ? { neg: true } : { sign: -1 }), expGraph(base), expGraph(base, { sign: -1, neg: true })];
		win = W_FLIP;
	}
	const all: Graph[] = [right, ...wrong];
	if (all.some((a, i) => all.some((b, j) => j > i && !apart(a, b, win)))) return null;
	const pts = latticePoints(right).filter((p) => inWin(win, p));
	if (!pts.length) return null;
	return {
		case: form,
		prompt: 'Qual è il grafico della funzione?',
		problem: graphTex(right),
		solution: text(`La curva che ${rises(right) ? 'sale' : 'scende'} e passa per `) + pts.map(pointTex).join(text(' e ')),
		steps: graphSteps(right, win),
		options: all.map((g) => graphOption(g, win)),
		solutionScene: graphScene(right, win, 'named'),
		params: { form, base: base.toString(), d, window: win },
	};
}

/** Level 7, from the graph to the function: the base to write, or the shifted function to choose among four. */
function level7(rng: Rng): Build | null {
	const u = rng.next();
	if (u < 0.4) {
		const a = rng.pick([q(2), q(3), q(4), q(5), q(1, 2), q(1, 3), q(1, 4), q(1, 5)]);
		const g = expGraph(a);
		const win: Win = [-4, 4, -2, 6];
		const [, [px, py]] = latticePoints(g);
		const steps = [text('Il grafico passa per ') + pointTex([px, py]) + ': \\ ' + `a^{${px}} = ${py}`];
		if (px < 0) steps.push(`\\frac{1}{a} = ${py}`);
		steps.push(text('La base è ') + `a = ${a.toLatex()}`);
		return {
			case: 'la base',
			prompt: 'Il grafico è quello di una funzione esponenziale $y = a^x$. Trova la base $a$.',
			problem: '',
			solution: `a = ${a.toLatex()}`,
			steps,
			// the reciprocal (the curve read in the wrong direction), the height of (0, 1), the sign, one more
			options: [a, q(1).div(a), q(1), a.neg(), a.add(q(1))].map(numOption),
			open: { kind: 'number', value: a.toString() },
			scene: graphScene(g, win, 'both'),
			params: { form: 'la base', base: a.toString(), d: 0, window: win },
		};
	}
	const vertical = u < 0.7;
	const base = rng.pick(GRAPH_BASES);
	const inv = q(1).div(base);
	const d = intNot(rng, -3, 3, [0]);
	const right = vertical ? expGraph(base, { k: d }) : expGraph(base, { h: d });
	const win: Win = vertical ? [-5, 5, -4, 6] : [-5, 5, -2, 6];
	const pts = latticePoints(right);
	if (!pts.every((p) => inWin(win, p))) return null;
	const [p0, p1] = pts;
	const side = p1[0] > p0[0] ? 'destra' : 'sinistra';
	const far = Math.abs(p1[1] - d * (vertical ? 1 : 0));
	const wrong = vertical
		? // the sign of the shift, the shift read along x, the base swapped, the asymptote not read
			[expGraph(base, { k: -d }), expGraph(base, { h: d }), expGraph(inv, { k: d }), expGraph(base)]
		: [expGraph(base, { h: -d }), expGraph(base, { k: d }), expGraph(inv, { h: d }), expGraph(base, { k: -d })];
	const steps = vertical
		? [text("L'asintoto è la retta ") + `y = ${d}` + text(': è il grafico di ') + 'y = a^x' + text(` spostato in ${d > 0 ? 'su' : 'giù'} di ${Math.abs(d)}.`)]
		: [text("L'asintoto è l'asse x. Il punto ") + '(0, 1)' + text(' di ') + 'y = a^x' + text(' è finito in ') + pointTex(p0) + text(`: il grafico è spostato a ${d > 0 ? 'destra' : 'sinistra'} di ${Math.abs(d)}.`)];
	steps.push(text('Da ') + pointTex(p0) + text(' a ') + pointTex(p1) + text(`, un passo a ${side}, la distanza dall'asintoto passa da 1 a ${far}: `) + (side === 'destra' ? `a = ${base.toLatex()}` : `\\frac{1}{a} = ${far}, \\quad a = ${base.toLatex()}`), graphTex(right));
	return {
		case: vertical ? 'in su o in giù' : 'a destra o a sinistra',
		prompt: 'Quale funzione ha questo grafico?',
		problem: '',
		solution: graphTex(right),
		steps,
		options: [right, ...wrong].map(formulaOption),
		scene: graphScene(right, win, 'both'),
		params: { form: vertical ? 'in su o in giù' : 'a destra o a sinistra', base: base.toString(), d, window: win },
	};
}

// ---------------------------------------------------------------------------
// Level 8: domain

const domLatex = (ex: Rational[]) => (ex.length ? `D = \\mathbb{R} \\setminus \\{${sortRat(ex).map((v) => v.toLatex()).join(',\\ ')}\\}` : 'D = \\mathbb{R}');
const domOption = (ex: Rational[]): ChoiceOption => ({ latex: domLatex(ex), values: sortRat(ex).map(String) });

function level8(rng: Rng): Build | null {
	const a = rng.pick([2, 3, 5]);
	const n = rng.pick([1, 1, 2, 3]);
	if (rng.next() < 0.45) {
		const c = rng.int(-6, 6);
		const den = linLatex(1, -c);
		const C = q(c);
		const cands = c !== 0 ? [[C.neg()], [], [q(0)], [q(0), C], [C.add(q(1))]] : [[], [q(1)], [q(-1)], [q(n)], [q(a)]];
		return {
			case: 'esponente fratto',
			prompt: 'Trova il dominio della funzione.',
			problem: `y = ${a}^{\\frac{${n}}{${den}}}`,
			solution: domLatex([C]),
			steps: [text("La potenza si calcola quando si può calcolare l'esponente: ") + `${den} \\neq 0`, ...(c !== 0 ? [`x \\neq ${c}`] : []), domLatex([C])],
			options: [[C], ...cands.map(sortRat)].map(domOption),
			open: { kind: 'set', values: [C.toString()], latex: domLatex([C]) },
			params: { form: 'esponente', a, n, c },
		};
	}
	const m = rng.int(-2, a === 2 ? 5 : 3);
	const h = rng.next() < 0.4 ? intNot(rng, -4, 4, [0]) : 0;
	const b = ratPow(q(a), m);
	const X = q(m + h);
	const p = powLatex(q(a), linLatex(1, -h));
	const steps = [text("L'esponente non dà condizioni, ma il denominatore non può valere zero: ") + `${p} - ${b.toLatex()} \\neq 0`, `${p} \\neq ${powLatex(q(a), `${m}`)}`];
	if (h !== 0) steps.push(`${linLatex(1, -h)} \\neq ${m}`);
	steps.push(`x \\neq ${X.toLatex()}`, domLatex([X]));
	const cands: Rational[][] = [[], [b], ...(h !== 0 ? [[q(m)], [q(m - h)]] : []), [X.neg()], [q(0)], [X.add(q(1))], [X.sub(q(1))]];
	return {
		case: h === 0 ? 'esponenziale a denominatore' : 'esponenziale a denominatore, esponente x - h',
		prompt: 'Trova il dominio della funzione.',
		problem: `y = \\frac{${n}}{${p} - ${b.toLatex()}}`,
		solution: domLatex([X]),
		steps,
		options: [[X], ...cands].map(domOption),
		open: { kind: 'set', values: [X.toString()], latex: domLatex([X]) },
		params: { form: 'denominatore', a, n, m, h },
	};
}

// ---------------------------------------------------------------------------
// Level 9: growth and decay

/** Prose broken by hand in lines of about 44 characters, as the word problems of the other generators. */
function prose(s: string): string {
	const lines: string[] = [];
	let cur = '';
	for (const w of s.split(' ')) {
		const len = (cur + ' ' + w).replace(/[$\\]/g, '').length;
		if (cur && len > 44) {
			lines.push(cur);
			cur = w;
		} else cur = cur ? `${cur} ${w}` : w;
	}
	lines.push(cur);
	return `\\begin{array}{l} ${lines.map((l) => `\\text{${l}}`).join(' \\\\ ')} \\end{array}`;
}

const dec = (r: Rational) => {
	// a decimal with the comma, for factors such as 1,02 and 0,8
	const s = (r.num / r.den).toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
	return s.replace('.', '{,}');
};

function level9(rng: Rng): Build | null {
	const u = rng.next();
	if (u < 0.5) {
		const up = u < 0.28;
		const p = rng.pick(up ? [5, 10, 20, 25, 50] : [10, 20, 25, 50]);
		const t = rng.pick([2, 2, 3]);
		const C = rng.pick([400, 800, 1000, 1600, 2000, 4000, 8000]);
		const factor = q(up ? 100 + p : 100 - p, 100);
		const v = q(C).mul(ratPow(factor, t));
		if (!v.isInteger()) return null;
		const story = up
			? rng.pick([`Un capitale di ${C} euro cresce del $${p}\\%$ all'anno. Quanti euro vale dopo ${t} anni?`, `Una popolazione di ${C} abitanti aumenta del $${p}\\%$ all'anno. Quanti abitanti ha dopo ${t} anni?`])
			: rng.pick([`Un'auto che vale ${C} euro perde il $${p}\\%$ del suo valore ogni anno. Quanti euro vale dopo ${t} anni?`, `Una popolazione di ${C} pesci cala del $${p}\\%$ all'anno. Quanti pesci restano dopo ${t} anni?`]);
		const linear = q(C).mul(q(up ? 100 + p * t : 100 - p * t, 100));
		const cands = [linear, q(C).mul(ratPow(factor, t - 1)), q(C).mul(ratPow(factor, t + 1)), q(C).mul(ratPow(q(up ? 100 - p : 100 + p, 100), t)), q(C).mul(factor).mul(q(t))].filter((r) => r.isInteger() && r.sign() > 0);
		return {
			case: up ? 'aumento percentuale' : 'diminuzione percentuale',
			prompt: 'Risolvi il problema.',
			problem: prose(story),
			solution: `${v.num}`,
			steps: [
				text(`A ogni anno il valore viene moltiplicato per `) + `1 ${up ? '+' : '-'} \\frac{${p}}{100} = ${dec(factor)}`,
				`y = ${C} \\cdot ${dec(factor)}^t`,
				`${C} \\cdot ${dec(factor)}^${t} = ${C} \\cdot ${dec(ratPow(factor, t))}`,
				`${v.num}`,
			],
			options: [v, ...cands].map(numOption),
			open: { kind: 'number', value: v.toString() },
			params: { story: up ? 'aumento' : 'diminuzione', C, p, t },
		};
	}
	const double = u < 0.75;
	const T = rng.pick([2, 3, 4, 5, 6, 8]);
	const n = rng.int(2, 5);
	const t = T * n;
	const C = double ? rng.pick([100, 200, 300, 500, 1000]) : rng.pick([160, 320, 480, 640, 800, 960]);
	const v = double ? q(C * 2 ** n) : q(C, 2 ** n);
	if (!v.isInteger()) return null;
	const story = double ? `Una coltura di ${C} batteri raddoppia ogni ${T} ore. Quanti batteri ci sono dopo ${t} ore?` : `La quantità di un farmaco nel sangue si dimezza ogni ${T} ore. La dose iniziale è di ${C} mg. Quanti mg restano dopo ${t} ore?`;
	const f = double ? q(2) : q(1, 2);
	const cands = [double ? q(C * 2 * n) : q(C, 2 * n), q(C).mul(ratPow(f, n - 1)), q(C).mul(ratPow(f, n + 1)), double ? q(C * n) : q(C, n), double ? q(C * n * n) : q(C * n, 2 ** n), q(C, 2)].filter((r) => r.isInteger() && r.sign() > 0);
	return {
		case: double ? 'raddoppio' : 'dimezzamento',
		prompt: 'Risolvi il problema.',
		problem: prose(story),
		solution: `${v.num}`,
		steps: [
			text(`In ${t} ore ${double ? 'i raddoppi' : 'i dimezzamenti'} sono `) + `${t} : ${T} = ${n}`,
			double ? `${C} \\cdot 2^${n} = ${C} \\cdot ${2 ** n}` : `${C} \\cdot \\left(\\frac{1}{2}\\right)^${n} = \\frac{${C}}{${2 ** n}}`,
			`${v.num}`,
		],
		options: [v, ...cands].map(numOption),
		open: { kind: 'number', value: v.toString() },
		params: { story: double ? 'raddoppio' : 'dimezzamento', C, T, t },
	};
}

const BUILDERS: Record<number, (rng: Rng) => Build | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7, 8: level8, 9: level9 };

// ---------------------------------------------------------------------------
// Assembly and check

const optKey = (o: ChoiceOption) => o.values.join('|');

function assemble(b: Build, level: number, rng: Rng): Sample | null {
	const picked: ChoiceOption[] = [];
	const seen = new Set<string>();
	const texts = new Set<string>();
	for (const o of b.options) {
		if (picked.length === 4) break;
		// a graph has no text: it is told from the others by the function it draws
		if (seen.has(optKey(o)) || (!o.scene && texts.has(o.latex))) continue;
		seen.add(optKey(o));
		texts.add(o.latex);
		picked.push(o);
	}
	if (picked.length < 4) return null;
	let answer: Answer;
	const params: Record<string, unknown> = { case: b.case, ...b.params };
	if (b.open) {
		answer = b.open;
		params.distractors = picked.slice(1);
	} else {
		const order = shuffled(
			rng,
			picked.map((_, i) => i),
		);
		answer = { kind: 'choice', options: order.map((i) => picked[i]), correct: order.indexOf(0) };
	}
	return { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer, params, ...(b.scene ? { scene: b.scene } : {}), ...(b.solutionScene ? { solutionScene: b.solutionScene } : {}) };
}

/** The parameters of the nine levels, each with its own. */
interface P {
	base: string;
	k: number;
	h: number;
	ask: string;
	functions: { key: string; base: string }[];
	exps: string[];
	value: string;
	flipX: boolean;
	form: string;
	/** Levels 6 and 7: how far the graph is shifted, up or to the right. */
	d: number;
	c: number;
	m: number;
	C: number;
	p: number;
	t: number;
	T: number;
	story: string;
}

const EXP_VALUE: Record<string, number> = Object.fromEntries(EXPS.map((e) => [e.sym, e.val]));

/** The right option of each level, computed again from the parameters. */
function expected(s: Sample): string | null {
	const p = s.params as unknown as P;
	switch (s.level) {
		case 1:
			return ratPow(Rational.parse(p.base), p.k).toString();
		case 2: {
			const fs = p.functions;
			const inc = (f: { base: string }) => Rational.parse(f.base).compare(q(1)) > 0;
			const hits = fs.filter((f) => inc(f) === (p.ask === 'crescente'));
			return hits.length === 1 ? hits[0].key : null;
		}
		case 3: {
			const big = Rational.parse(p.base).compare(q(1)) > 0;
			const exps = [...p.exps].sort((u, v) => EXP_VALUE[u] - EXP_VALUE[v]);
			return (p.ask === 'max') === big ? exps[exps.length - 1] : exps[0];
		}
		case 4: {
			// a^k = value: try the bases the level uses
			const k = p.k;
			const v = Rational.parse(p.value);
			const hit = [...L1_BASES, [5, 2] as [number, number]].map(([n, d]) => q(n, d)).filter((a) => ratPow(a, k).equals(v));
			return hit.length === 1 ? hit[0].toString() : null;
		}
		case 5: {
			const k = p.k;
			if (p.ask === 'asintoto') return `y|${k}`;
			return p.flipX ? '(-oo,0)' : `(${k},oo)`;
		}
		case 6:
		case 7: {
			const base = Rational.parse(p.base);
			if (p.form === 'la base') return base.toString();
			const forms: Record<string, Partial<ExpGraph>> = { 'a^x': {}, 'in su o in giù': { k: p.d }, 'a destra o a sinistra': { h: p.d }, "ribaltata rispetto all'asse x": { sign: -1 }, "ribaltata rispetto all'asse y": { neg: true } };
			return forms[p.form] ? graphBody(expGraph(base, forms[p.form])) : null;
		}
		case 8:
			return p.form === 'esponente' ? `${p.c}` : `${p.m + p.h}`;
		case 9: {
			const C = q(p.C);
			const t = p.t;
			if (p.story === 'aumento') return C.mul(ratPow(q(100 + p.p, 100), t)).toString();
			if (p.story === 'diminuzione') return C.mul(ratPow(q(100 - p.p, 100), t)).toString();
			const n = t / p.T;
			return (p.story === 'raddoppio' ? C.mul(q(2 ** n)) : C.div(q(2 ** n))).toString();
		}
		default:
			return null;
	}
}

function check(s: Sample): string[] {
	const errs: string[] = [];
	if (!BUILDERS[s.level]) return [`livello ${s.level} sconosciuto`];
	const want = expected(s);
	if (want === null) return ['i parametri non danno una sola risposta'];
	const ans = s.answer;
	let options: ChoiceOption[];
	if (ans.kind === 'choice') {
		options = ans.options;
		if (optKey(options[ans.correct]) !== want) errs.push('opzione giusta sbagliata');
	} else {
		const got = ans.kind === 'number' ? ans.value : ans.kind === 'set' ? ans.values.join('|') : '';
		if (got !== want) errs.push('risposta sbagliata');
		const ds = (s.params as { distractors: ChoiceOption[] }).distractors;
		options = [{ latex: '', values: [got] }, ...ds];
	}
	if (options.length !== 4) errs.push('servono quattro opzioni');
	const keys = options.map(optKey);
	if (new Set(keys).size !== keys.length) errs.push('opzioni uguali');
	const chosen = [2, 3, 5, 6].includes(s.level) || (s.level === 7 && s.params.case !== 'la base');
	if (chosen !== (ans.kind === 'choice')) errs.push('tipo di risposta diverso da quello del livello');
	// level 6 answers with four graphs, level 7 asks about one
	if ((s.level === 6) !== options.every((o) => !!o.scene && !!o.text)) errs.push('le opzioni sono grafici solo al livello 6');
	if ((s.level === 7) !== !!s.scene || (s.level === 6) !== !!s.solutionScene) errs.push('il grafico del problema o della soluzione non è al suo livello');
	if (s.level !== 9) errs.push(...forbidden(s.problem));
	if (!s.steps.length || !s.solution) errs.push('mancano passaggi o soluzione');
	return errs;
}

const funzioniEsponenziali: Generator = {
	id: ID,
	title: 'Funzione esponenziale',
	levels: {
		1: { label: 'Valori di una funzione esponenziale', constraints: ['f(x) = a^x con a intero o frazione', 'f(k) con k intero tra -3 e 3, più spesso negativo'] },
		2: { label: 'Crescente o decrescente', constraints: ['quattro funzioni, una sola crescente (o decrescente)', 'almeno una scritta con -x'] },
		3: { label: 'Confronto di potenze con la stessa base', constraints: ['quattro potenze della stessa base', 'almeno un esponente irrazionale', 'il più grande o il più piccolo'] },
		4: { label: 'La base da un punto', constraints: ['y = a^x passa per P(k, a^k) con k tra -3 e 3, diverso da 0 e da 1'] },
		5: { label: 'Asintoto e immagine di un grafico trasformato', constraints: ['a^x + k, a^(x - h), -a^x, a^(-x), a^(x - h) + k'] },
		6: { label: 'Dalla funzione al grafico', constraints: ['a^x, a^x + k, a^(x - h), -a^x, a^(-x) con spostamenti di 2 o 3', 'quattro grafici nella stessa finestra, distinguibili in piccolo', "i grafici sbagliati: base reciproca, y = 1, -a^x, la retta y = ax, spostamento dal lato o lungo l'asse sbagliato"] },
		7: { label: 'Dal grafico alla funzione', constraints: ['il grafico di a^x con due punti a coordinate intere: scrivere la base', 'il grafico di a^x + k o a^(x - h): scegliere la funzione tra quattro'] },
		8: { label: 'Dominio', constraints: ['a^(n/(x - c)) oppure n/(a^(x - h) - b) con b potenza di a'] },
		9: { label: 'Crescita e decadimento', constraints: ['aumento o diminuzione percentuale per 2 o 3 anni, raddoppio, dimezzamento', 'risultato intero'] },
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILDERS[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 10_000; attempt++) {
			const b = build(rng);
			if (!b) continue;
			const sample = assemble(b, level, rng);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
		if (sample.answer.kind === 'choice') return sample.answer;
		const ans = sample.answer;
		const ds = (sample.params as { distractors: ChoiceOption[] }).distractors;
		const right: ChoiceOption = ans.kind === 'number' ? numOption(Rational.parse(ans.value)) : ans.kind === 'set' ? { latex: ans.latex, values: ans.values } : { latex: '', values: [] };
		const all = [right, ...ds];
		const order = shuffled(
			rng,
			all.map((_, i) => i),
		);
		return { kind: 'choice', options: order.map((i) => all[i]), correct: order.indexOf(0) };
	},
};

export default funzioniEsponenziali;
