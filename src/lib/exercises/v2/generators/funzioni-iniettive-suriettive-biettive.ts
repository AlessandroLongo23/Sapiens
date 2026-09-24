/**
 * Funzioni iniettive, suriettive e biettive. Spec: specs/exercises/funzioni-iniettive-suriettive-biettive.md
 *
 * Six levels in the order of the lesson: the image of a function on a finite domain; classifying a
 * function between finite sets given by its assignments; classifying a formula on finite sets of
 * numbers; real functions between R and [0, +inf); the same formulas on Z, Q, N and R \ {0}; the
 * inverse of a bijective linear function. Levels 2 to 5 pick the answer (the case) first and then
 * build a function that has it, so the four answers come up about equally often.
 */
import type { ChoiceAnswer, ChoiceOption, ExpressionAnswer, Generator, Rng, Sample, SetAnswer } from '../types';
import { gcd, q } from '../rational';
import { joinSigned, paren, poly, polyToLatex } from '../latex';

export const ID = 'funzioni-iniettive-suriettive-biettive';

export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito (1x)', re: /(?<![\d.])1\s*[xy]/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*[xy]/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
	{ name: 'esponente 1', re: /\^\{1\}|\^1(?!\d)/ },
];

// ---------------------------------------------------------------------------
// Classification

export type Kind = 'iniettiva' | 'suriettiva' | 'biettiva' | 'nessuna';
const KINDS: Kind[] = ['iniettiva', 'suriettiva', 'biettiva', 'nessuna'];

/** The four options, always in this order. `values` holds a code the checker grades. */
export const CLASS_OPTIONS: Record<Kind, ChoiceOption> = {
	iniettiva: { latex: '\\text{iniettiva ma non suriettiva}', values: ['iniettiva-non-suriettiva'] },
	suriettiva: { latex: '\\text{suriettiva ma non iniettiva}', values: ['suriettiva-non-iniettiva'] },
	biettiva: { latex: '\\text{biettiva}', values: ['biettiva'] },
	nessuna: { latex: '\\text{né iniettiva né suriettiva}', values: ['ne-iniettiva-ne-suriettiva'] },
};

const kindOf = (inj: boolean, surj: boolean): Kind => (inj ? (surj ? 'biettiva' : 'iniettiva') : surj ? 'suriettiva' : 'nessuna');

const conclusion: Record<Kind, string> = {
	iniettiva: '\\text{Quindi } f \\text{ è iniettiva ma non suriettiva.}',
	suriettiva: '\\text{Quindi } f \\text{ è suriettiva ma non iniettiva.}',
	biettiva: '\\text{Quindi } f \\text{ è iniettiva e suriettiva, cioè biettiva.}',
	nessuna: '\\text{Quindi } f \\text{ non è né iniettiva né suriettiva.}',
};

const solutionOf: Record<Kind, string> = {
	iniettiva: 'f \\text{ è iniettiva ma non suriettiva}',
	suriettiva: 'f \\text{ è suriettiva ma non iniettiva}',
	biettiva: 'f \\text{ è biettiva}',
	nessuna: 'f \\text{ non è né iniettiva né suriettiva}',
};

function classAnswer(kind: Kind): ChoiceAnswer {
	return { kind: 'choice', options: KINDS.map((k) => ({ ...CLASS_OPTIONS[k], values: [...CLASS_OPTIONS[k].values] })), correct: KINDS.indexOf(kind) };
}

const CLASS_PROMPT = 'Stabilisci se la funzione è iniettiva, suriettiva o biettiva.';

// ---------------------------------------------------------------------------
// Small helpers

function nonZero(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}

function shuffle<T>(rng: Rng, xs: T[]): T[] {
	const out = [...xs];
	for (let i = out.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

/** k distinct integers from [lo, hi], sorted. */
function distinctInts(rng: Rng, k: number, lo: number, hi: number): number[] {
	return shuffle(
		rng,
		Array.from({ length: hi - lo + 1 }, (_, i) => lo + i),
	)
		.slice(0, k)
		.sort((a, b) => a - b);
}

const sortNum = (xs: number[]) => [...xs].sort((a, b) => a - b);
const uniqSorted = (xs: number[]) => sortNum([...new Set(xs)]);

/** "\{-1,\ 0,\ 1\}" as in the lesson. */
const listSet = (xs: (number | string)[]) => `\\{${xs.join(',\\ ')}\\}`;

const WORDS = ['zero', 'una', 'due', 'tre', 'quattro', 'cinque', 'sei'];

/** "a", "a e b", "a, b e c"; "ed" before a name starting with e. */
function andList(xs: string[], math = true): string {
	const m = (s: string) => (math ? s : `\\text{${s}}`);
	if (xs.length === 1) return m(xs[0]);
	const last = xs[xs.length - 1];
	const and = /^e/.test(last) ? 'ed' : 'e';
	return `${xs.slice(0, -1).map(m).join(',\\ ')} \\text{ ${and} } ${m(last)}`;
}

// ---------------------------------------------------------------------------
// Formulas on finite sets of integers (levels 1 and 3)

/** lin: a x + b; quad: x^2 + b x + c; abs: |x + b| + c. */
export interface IntFormula {
	family: 'lin' | 'quad' | 'abs';
	a: number;
	b: number;
	c: number;
}

export function evalInt(f: IntFormula, x: number): number {
	if (f.family === 'lin') return f.a * x + f.b;
	if (f.family === 'quad') return x * x + f.b * x + f.c;
	return Math.abs(x + f.b) + f.c;
}

const absLatex = (inner: string) => `\\lvert ${inner} \\rvert`;

export function intFormulaLatex(f: IntFormula): string {
	if (f.family === 'lin') return polyToLatex(poly(f.b, f.a));
	if (f.family === 'quad') return polyToLatex(poly(f.c, f.b, 1));
	return joinSigned(absLatex(polyToLatex(poly(f.b, 1))), q(f.c));
}

/** f(x) with x substituted, before computing: "(-1)^2 - 2 \cdot (-1) + 3". */
function substituted(f: IntFormula, x: number): string {
	const X = paren(q(x));
	const times = (k: number, first: boolean): string => {
		const abs = Math.abs(k);
		const body = abs === 1 ? X : `${abs} \\cdot ${X}`;
		if (first && k === 1) return String(x);
		if (first) return (k < 0 ? '-' : '') + body;
		return (k < 0 ? ' - ' : ' + ') + body;
	};
	const constant = (c: number) => (c === 0 ? '' : c < 0 ? ` - ${-c}` : ` + ${c}`);
	if (f.family === 'lin') return times(f.a, true) + constant(f.b);
	if (f.family === 'quad') return `${X}^2${f.b === 0 ? '' : times(f.b, false)}${constant(f.c)}`;
	return absLatex(`${x}${constant(f.b)}`) + constant(f.c);
}

function imageStepLatex(f: IntFormula, x: number): string {
	const v = evalInt(f, x);
	let mid = substituted(f, x);
	if (f.family === 'abs' && f.b !== 0 && f.c !== 0) mid += ` = ${Math.abs(x + f.b)}${f.c < 0 ? ` - ${-f.c}` : ` + ${f.c}`}`;
	else if (f.family === 'abs' && f.b !== 0) mid += ` = ${absLatex(String(x + f.b))}`;
	return mid === String(v) ? `f(${x}) = ${v}` : `f(${x}) = ${mid} = ${v}`;
}

function drawFormula(rng: Rng, linShare: number): IntFormula {
	const u = rng.next();
	if (u < linShare) return { family: 'lin', a: nonZero(rng, -3, 3), b: rng.int(-4, 4), c: 0 };
	if (u < linShare + (1 - linShare) / 2) return { family: 'quad', a: 1, b: rng.int(-2, 2), c: rng.int(-3, 3) };
	return { family: 'abs', a: 1, b: rng.int(-2, 2), c: rng.int(-2, 2) };
}

/** Wrong value a student gets with a sign slip on a negative number: (-2)^2 = -4, |-2| = -2, -3·(-1) = -3. */
function signSlip(f: IntFormula, x: number): number {
	if (f.family === 'lin') return x < 0 ? -f.a * x + f.b : evalInt(f, x);
	if (f.family === 'quad') return x < 0 ? -x * x + f.b * x + f.c : evalInt(f, x);
	return x + f.b < 0 ? x + f.b + f.c : evalInt(f, x);
}

// ---------------------------------------------------------------------------
// Level 1: image of a finite function

interface ImageBuilt {
	f: IntFormula;
	A: number[];
	B: number[];
	image: number[];
}

function buildImage(rng: Rng): ImageBuilt | null {
	const f = drawFormula(rng, 0.3);
	const A = distinctInts(rng, rng.int(3, 5), -3, 3);
	const image = uniqSorted(A.map((x) => evalInt(f, x)));
	if (image.some((v) => Math.abs(v) > 20)) return null;
	const lo = image[0] - 2, hi = image[image.length - 1] + 2;
	const free = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((v) => !image.includes(v));
	const extras = shuffle(rng, free).slice(0, rng.int(1, 2));
	return { f, A, B: uniqSorted([...image, ...extras]), image };
}

function imageSteps(b: ImageBuilt): string[] {
	const out = [`\\text{Calcola l'immagine di ogni elemento di } A\\text{.}`];
	for (const x of b.A) out.push(imageStepLatex(b.f, x));
	const values = b.A.map((x) => evalInt(b.f, x));
	const repeated = b.image.filter((v) => values.filter((w) => w === v).length > 1);
	const times = (v: number) => values.filter((w) => w === v).length;
	const collect =
		repeated.length === 1
			? `\\text{Nell'immagine ogni valore si scrive una volta sola, anche } ${repeated[0]}\\text{, che si ottiene ${WORDS[times(repeated[0])]} volte: }`
			: repeated.length > 1
				? `\\text{Nell'immagine ogni valore si scrive una volta sola, anche } ${andList(repeated.map(String))}\\text{, che si ottengono più volte: }`
				: '\\text{Raccogli i valori ottenuti: }';
	out.push(`${collect}\\mathrm{Im}(f) = ${listSet(b.image)}`);
	const missed = b.B.filter((v) => !b.image.includes(v));
	out.push(
		missed.length === 1
			? `\\text{Il numero } ${missed[0]} \\text{ sta in } B \\text{ ma nessun elemento di } A \\text{ ci arriva: l'immagine è più piccola del codominio.}`
			: `\\text{I numeri } ${andList(missed.map(String))} \\text{ stanno in } B \\text{ ma nessun elemento di } A \\text{ ci arriva: l'immagine è più piccola del codominio.}`,
	);
	return out;
}

// ---------------------------------------------------------------------------
// Level 2: finite sets, assignments given

const LETTERS = ['a', 'b', 'c', 'd', 'e'];

interface MapBuilt {
	A: number[];
	B: string[];
	/** map[i] = f(A[i]) */
	map: string[];
	display: 'frecce' | 'tabella';
	kind: Kind;
}

function buildMap(rng: Rng, kind: Kind): MapBuilt {
	const sizes: Record<Kind, [number, number][]> = {
		biettiva: [[3, 3], [4, 4], [5, 5]],
		iniettiva: [[3, 4], [3, 5], [4, 5]],
		suriettiva: [[4, 3], [5, 3], [5, 4]],
		nessuna: [[3, 3], [4, 4], [5, 5], [3, 4], [4, 5], [4, 3], [5, 4], [5, 3]],
	};
	const [n, m] = rng.pick(sizes[kind]);
	const A = Array.from({ length: n }, (_, i) => i + 1);
	const B = LETTERS.slice(0, m);
	let map: string[];
	if (kind === 'biettiva' || kind === 'iniettiva') {
		map = shuffle(rng, B).slice(0, n);
	} else {
		// Onto a subset of r elements of B: every element of the subset is hit at least once.
		const r = kind === 'suriettiva' ? m : rng.int(Math.max(2, Math.min(n, m) - 2), Math.min(n, m) - 1);
		const target = shuffle(rng, B).slice(0, r);
		map = shuffle(rng, [...target, ...Array.from({ length: n - r }, () => rng.pick(target))]);
	}
	return { A, B, map, display: rng.next() < 0.6 ? 'frecce' : 'tabella', kind };
}

function mapProblem(b: MapBuilt): string {
	const sets = `f: A \\to B,\\quad A = ${listSet(b.A)},\\quad B = ${listSet(b.B)}`;
	if (b.display === 'frecce') return `\\begin{gathered} ${sets} \\\\ ${b.A.map((x, i) => `${x} \\mapsto ${b.map[i]}`).join(',\\qquad ')} \\end{gathered}`;
	const cols = 'c'.repeat(b.A.length);
	const table = `\\begin{array}{c|${cols}} x & ${b.A.join(' & ')} \\\\ \\hline f(x) & ${b.map.join(' & ')} \\end{array}`;
	return `\\begin{gathered} ${sets} \\\\ ${table} \\end{gathered}`;
}

function countStep(n: number, m: number): string {
	if (n > m) return `A \\text{ ha } ${n} \\text{ elementi e } B \\text{ ne ha } ${m}\\text{: con più elementi nel dominio che nel codominio, } f \\text{ non può essere iniettiva.}`;
	if (n < m) return `A \\text{ ha } ${n} \\text{ elementi e } B \\text{ ne ha } ${m}\\text{: con meno elementi nel dominio che nel codominio, } f \\text{ non può essere suriettiva.}`;
	return `A \\text{ e } B \\text{ hanno ${WORDS[n] ?? n} elementi ciascuno: il conteggio non decide, bisogna guardare le immagini.}`;
}

function mapSteps(b: MapBuilt): string[] {
	const out = [countStep(b.A.length, b.B.length)];
	const pre = (y: string) => b.A.filter((_, i) => b.map[i] === y);
	const multi = b.B.find((y) => pre(y).length > 1);
	const missed = b.B.filter((y) => pre(y).length === 0);
	const arrows = b.display === 'frecce';
	if (multi) {
		const from = pre(multi);
		const n = WORDS[from.length] ?? String(from.length);
		out.push(
			arrows
				? `\\text{L'elemento } ${multi} \\text{ riceve ${n} frecce, da } ${andList(from.map(String))}\\text{: } f \\text{ non è iniettiva.}`
				: `\\text{L'elemento } ${multi} \\text{ compare ${n} volte nella seconda riga, sotto } ${andList(from.map(String))}\\text{: } ${from.map((x) => `f(${x})`).join(' = ')} = ${multi}\\text{, quindi } f \\text{ non è iniettiva.}`,
		);
	} else {
		out.push(
			arrows
				? `\\text{A ogni elemento di } B \\text{ arriva al massimo una freccia: } f \\text{ è iniettiva.}`
				: `\\text{Nella seconda riga nessun elemento compare due volte: } f \\text{ è iniettiva.}`,
		);
	}
	if (missed.length > 0) {
		const who = missed.length === 1 ? `\\text{L'elemento } ${missed[0]}` : `\\text{Gli elementi } ${andList(missed)}`;
		out.push(
			arrows
				? `${who} \\text{ ${missed.length === 1 ? 'non riceve' : 'non ricevono'} nessuna freccia: } f \\text{ non è suriettiva.}`
				: `${who} \\text{ di } B \\text{ ${missed.length === 1 ? 'non compare' : 'non compaiono'} nella seconda riga: } f \\text{ non è suriettiva.}`,
		);
	} else {
		out.push(
			arrows
				? `\\text{Ogni elemento di } B \\text{ riceve almeno una freccia: } f \\text{ è suriettiva.}`
				: `\\text{Ogni elemento di } B \\text{ compare nella seconda riga: } \\mathrm{Im}(f) = B\\text{, quindi } f \\text{ è suriettiva.}`,
		);
	}
	out.push(conclusion[b.kind]);
	return out;
}

// ---------------------------------------------------------------------------
// Level 3: formula on finite sets of integers

interface FiniteBuilt {
	f: IntFormula;
	A: number[];
	B: number[];
	image: number[];
	kind: Kind;
}

function buildFinite(rng: Rng, kind: Kind): FiniteBuilt | null {
	const inj = kind === 'biettiva' || kind === 'iniettiva';
	const surj = kind === 'biettiva' || kind === 'suriettiva';
	const f = drawFormula(rng, inj ? 0.3 : 0);
	const A = distinctInts(rng, rng.int(3, 5), -3, 3);
	const values = A.map((x) => evalInt(f, x));
	const image = uniqSorted(values);
	if (image.some((v) => Math.abs(v) > 15)) return null;
	if ((image.length === A.length) !== inj) return null;
	let B = image;
	if (!surj) {
		const lo = image[0] - 2, hi = image[image.length - 1] + 2;
		const free = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((v) => !image.includes(v));
		B = uniqSorted([...image, ...shuffle(rng, free).slice(0, rng.int(1, 2))]);
	}
	return { f, A, B, image, kind };
}

function finiteSteps(b: FiniteBuilt): string[] {
	const out = [countStep(b.A.length, b.B.length)];
	out.push(`\\text{Calcola le immagini: } ${b.A.map((x) => `f(${x}) = ${evalInt(b.f, x)}`).join(',\\ ')}`);
	const pre = (y: number) => b.A.filter((x) => evalInt(b.f, x) === y);
	const multi = b.image.find((y) => pre(y).length > 1);
	if (multi !== undefined) {
		const from = pre(multi);
		out.push(
			`${from.map((x) => `f(${x})`).join(' = ')} = ${multi}\\text{: ${from.length === 2 ? 'due' : WORDS[from.length]} elementi diversi di } A \\text{ hanno la stessa immagine, quindi } f \\text{ non è iniettiva.}`,
		);
	} else {
		out.push(`\\text{Le immagini sono tutte diverse: } f \\text{ è iniettiva.}`);
	}
	const missed = b.B.filter((y) => !b.image.includes(y));
	if (missed.length > 0) {
		const who = missed.length === 1 ? `\\text{il numero } ${missed[0]} \\text{ sta in } B \\text{ ma non è immagine}` : `\\text{i numeri } ${andList(missed.map(String))} \\text{ stanno in } B \\text{ ma non sono immagine}`;
		out.push(`\\mathrm{Im}(f) = ${listSet(b.image)}\\text{: } ${who} \\text{ di nessun elemento di } A\\text{, quindi } f \\text{ non è suriettiva.}`);
	} else {
		out.push(`\\mathrm{Im}(f) = ${listSet(b.image)} = B\\text{: } f \\text{ è suriettiva.}`);
	}
	out.push(conclusion[b.kind]);
	return out;
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: functions between sets of numbers

/** R, [0, +inf), Z, Q, N, R \ {0}. */
export type NumSet = 'R' | 'R+' | 'Z' | 'Q' | 'N' | 'R0';

const SET_LATEX: Record<NumSet, string> = {
	R: '\\mathbb{R}',
	'R+': '[0, +\\infty)',
	Z: '\\mathbb{Z}',
	Q: '\\mathbb{Q}',
	N: '\\mathbb{N}',
	R0: '\\mathbb{R} \\setminus \\{0\\}',
};

/** lin: a x + b; sq: k x^2; abs: k |x + b|; recip: k / x. */
export interface RealF {
	family: 'lin' | 'sq' | 'abs' | 'recip';
	a: number;
	b: number;
	k: number;
	dom: NumSet;
	cod: NumSet;
}

const coefLatex = (k: number) => (k === 1 ? '' : k === -1 ? '-' : String(k));

export function realLatex(f: RealF): string {
	if (f.family === 'lin') return polyToLatex(poly(f.b, f.a));
	if (f.family === 'sq') return `${coefLatex(f.k)}x^2`;
	if (f.family === 'abs') return `${coefLatex(f.k)}${absLatex(polyToLatex(poly(f.b, 1)))}`;
	return `${f.k < 0 ? '-' : ''}\\frac{${Math.abs(f.k)}}{x}`;
}

const inSet = (v: string, s: NumSet): string =>
	s === 'R+' ? `${v} \\geq 0` : s === 'R0' ? `${v} \\neq 0` : `${v} \\in ${SET_LATEX[s]}`;

/** x = (y - b)/a in LaTeX, variable v. */
function linInverseLatex(a: number, b: number, v = 'y'): string {
	return linFracLatex(1, -b, a, v);
}

/** (p·v + c)/d in LaTeX, with d > 0 and never "-y + 3" when "3 - y" reads better. */
export function linFracLatex(p: number, c: number, d: number, v = 'y'): string {
	if (d < 0) [p, c, d] = [-p, -c, -d];
	const g = gcd(gcd(p, c), d);
	[p, c, d] = [p / g, c / g, d / g];
	const pv = (k: number) => `${Math.abs(k) === 1 ? '' : Math.abs(k)}${v}`;
	let num: string;
	let neg = false;
	if (p > 0) num = polyToLatex(poly(c, p), v);
	else if (c > 0) num = `${c} - ${pv(p)}`;
	else if (d === 1) num = polyToLatex(poly(c, p), v);
	else {
		neg = true;
		num = polyToLatex(poly(-c, -p), v);
	}
	if (d === 1) return num;
	return `${neg ? '-' : ''}\\frac{${num}}{${d}}`;
}

interface RealFacts {
	inj: boolean;
	surj: boolean;
	injStep: string;
	surjStep: string;
}

function linInjStep(f: RealF): string {
	const moves: string[] = [];
	if (f.b > 0) moves.push(`\\text{sottraendo } ${f.b}`);
	if (f.b < 0) moves.push(`\\text{aggiungendo } ${-f.b}`);
	if (f.a === -1) moves.push('\\text{cambiando segno}');
	else if (f.a !== 1) moves.push(`\\text{dividendo per } ${f.a < 0 ? `(${f.a})` : f.a}`);
	const lhs = (i: number) => polyToLatex(poly(f.b, f.a), `x_${i}`);
	return `\\text{Da } ${lhs(1)} = ${lhs(2)}\\text{, } ${moves.join(' \\text{ e } ')}\\text{, segue } x_1 = x_2\\text{: } f \\text{ è iniettiva.}`;
}

function realFacts(f: RealF): RealFacts {
	const D = SET_LATEX[f.dom], C = SET_LATEX[f.cod];
	const eq = (y: string) => `${realLatex(f)} = ${y}`;
	switch (f.family) {
		case 'lin': {
			const injStep = linInjStep(f);
			if (f.dom === f.cod && (f.dom === 'R' || f.dom === 'Q')) {
				const what = f.dom === 'R' ? 'un numero reale' : 'un numero razionale';
				return { inj: true, surj: true, injStep, surjStep: `\\text{Per ogni } ${inSet('y', f.cod)} \\text{ l'equazione } ${eq('y')} \\text{ ha la soluzione } x = ${linInverseLatex(f.a, f.b)}\\text{, che è ${what}: } f \\text{ è suriettiva.}` };
			}
			if (f.dom === 'Z' && f.cod === 'Z') {
				if (Math.abs(f.a) === 1) {
					return { inj: true, surj: true, injStep, surjStep: `\\text{Per ogni } y \\in \\mathbb{Z} \\text{ l'equazione } ${eq('y')} \\text{ ha la soluzione } x = ${linInverseLatex(f.a, f.b)}\\text{, che è un intero: } f \\text{ è suriettiva.}` };
				}
				const y0 = f.b + 1;
				return { inj: true, surj: false, injStep, surjStep: `${y0} \\in \\mathbb{Z}\\text{, ma } ${eq(String(y0))} \\text{ dà } x = ${q(1, f.a).toLatex()}\\text{, che non è intero: } ${y0} \\text{ non viene raggiunto e } f \\text{ non è suriettiva.}` };
			}
			if (f.dom === 'R+' && f.cod === 'R') {
				const y0 = f.b - f.a;
				return { inj: true, surj: false, injStep, surjStep: `${y0} \\in \\mathbb{R}\\text{, ma } ${eq(String(y0))} \\text{ dà } x = -1\\text{, che non sta nel dominio } ${D}\\text{: } f \\text{ non è suriettiva.}` };
			}
			if (f.dom === 'R+' && f.cod === 'R+' && f.a > 0 && f.b >= 0) {
				if (f.b === 0) {
					return { inj: true, surj: true, injStep, surjStep: `\\text{Per ogni } y \\geq 0 \\text{ l'equazione } ${eq('y')} \\text{ ha la soluzione } x = ${linInverseLatex(f.a, 0)} \\geq 0\\text{: } f \\text{ è suriettiva.}` };
				}
				return { inj: true, surj: false, injStep, surjStep: `0 \\in ${C}\\text{, ma } ${eq('0')} \\text{ dà } x = ${q(-f.b, f.a).toLatex()}\\text{, che è negativo e non sta nel dominio: } f \\text{ non è suriettiva.}` };
			}
			break;
		}
		case 'sq':
		case 'abs': {
			const shift = f.family === 'abs' ? f.b : 0;
			const t = f.family === 'sq' ? 2 : 1;
			const x1 = -shift - t, x2 = -shift + t;
			const val = f.family === 'sq' ? f.k * t * t : f.k * t;
			const nonneg = f.family === 'sq' ? `${realLatex(f)} \\geq 0 \\text{ per ogni } x` : '\\text{un valore assoluto non è mai negativo}';
			let inj: boolean, injStep: string;
			if (f.dom === 'R+' && shift === 0) {
				inj = true;
				injStep =
					f.family === 'sq'
						? `\\text{Da } ${f.k === 1 ? '' : `${f.k}`}x_1^2 = ${f.k === 1 ? '' : `${f.k}`}x_2^2 \\text{ segue } x_1 = x_2 \\text{ oppure } x_1 = -x_2\\text{; con } x_1, x_2 \\geq 0 \\text{ la seconda vale solo se sono entrambi } 0\\text{: } f \\text{ è iniettiva.}`
						: f.k === 1
							? `\\text{Per } x \\geq 0 \\text{ si ha } \\lvert x \\rvert = x\\text{, quindi } f(x_1) = f(x_2) \\text{ vuol dire } x_1 = x_2\\text{: } f \\text{ è iniettiva.}`
							: `\\text{Per } x \\geq 0 \\text{ si ha } ${realLatex(f)} = ${f.k}x\\text{, e da } ${f.k}x_1 = ${f.k}x_2 \\text{ segue } x_1 = x_2\\text{: } f \\text{ è iniettiva.}`;
			} else if (f.dom === 'R' || f.dom === 'Z' || f.dom === 'Q') {
				inj = false;
				injStep = `f(${x1}) = f(${x2}) = ${val}\\text{, con } ${x1} \\neq ${x2}\\text{: } f \\text{ non è iniettiva.}`;
			} else break;
			let surj: boolean, surjStep: string;
			if (f.cod === 'R' || f.cod === 'Z' || f.cod === 'Q') {
				surj = false;
				surjStep = `-1 \\in ${C}\\text{, ma } ${eq('-1')} \\text{ non ha soluzioni, perché } ${nonneg}\\text{: } f \\text{ non è suriettiva.}`;
			} else if (f.cod === 'R+' && (f.dom === 'R' || (f.dom === 'R+' && shift === 0))) {
				surj = true;
				const sol = f.family === 'sq' ? `\\sqrt{${f.k === 1 ? 'y' : `\\frac{y}{${f.k}}`}}` : joinSigned(f.k === 1 ? 'y' : `\\frac{y}{${f.k}}`, q(-shift));
				surjStep = `\\text{Per ogni } y \\geq 0 \\text{ l'equazione } ${eq('y')} \\text{ ha la soluzione } x = ${sol}\\text{${f.dom === 'R+' ? ', che è maggiore o uguale a zero' : ''}: } f \\text{ è suriettiva.}`;
			} else if (f.cod === 'N' && f.dom === 'Z' && f.family === 'abs' && f.k === 1) {
				surj = true;
				surjStep = `\\text{Per ogni } n \\in \\mathbb{N} \\text{ il numero } x = ${joinSigned('n', q(-shift))} \\text{ è intero e } f(x) = \\lvert n \\rvert = n\\text{: } f \\text{ è suriettiva.}`;
			} else break;
			return { inj, surj, injStep, surjStep };
		}
		case 'recip': {
			if (f.dom !== 'R0') break;
			const k = realLatex(f);
			const injStep = `\\text{Da } ${k.replace('{x}', '{x_1}')} = ${k.replace('{x}', '{x_2}')} \\text{ segue } x_1 = x_2\\text{: } f \\text{ è iniettiva.}`;
			if (f.cod === 'R0') {
				return { inj: true, surj: true, injStep, surjStep: `\\text{Per ogni } y \\neq 0 \\text{ l'equazione } ${eq('y')} \\text{ ha la soluzione } x = ${k.replace('{x}', '{y}')}\\text{, che è diversa da zero: } f \\text{ è suriettiva.}` };
			}
			if (f.cod === 'R') {
				return { inj: true, surj: false, injStep, surjStep: `0 \\in \\mathbb{R}\\text{, ma } ${eq('0')} \\text{ non ha soluzioni, perché una frazione con numeratore diverso da zero non vale mai zero: } f \\text{ non è suriettiva.}` };
			}
			break;
		}
	}
	throw new Error(`${ID}: funzione non prevista ${JSON.stringify(f)} (${D} → ${C})`);
}

const realProblem = (f: RealF) => `f: ${SET_LATEX[f.dom]} \\to ${SET_LATEX[f.cod]},\\quad f(x) = ${realLatex(f)}`;

function smallK(rng: Rng): number {
	return rng.next() < 0.6 ? 1 : rng.int(2, 4);
}

function buildReal(rng: Rng, level: 4 | 5, kind: Kind): RealF {
	const lin = (dom: NumSet, cod: NumSet, a = nonZero(rng, -6, 6, [1, -1]), b = nonZero(rng, -9, 9)): RealF => ({ family: 'lin', a, b, k: 0, dom, cod });
	const sq = (dom: NumSet, cod: NumSet): RealF => ({ family: 'sq', a: 0, b: 0, k: smallK(rng), dom, cod });
	const abs = (dom: NumSet, cod: NumSet, b: number, k = smallK(rng)): RealF => ({ family: 'abs', a: 0, b, k, dom, cod });
	const recip = (cod: NumSet): RealF => ({ family: 'recip', a: 0, b: 0, k: nonZero(rng, -6, 6), dom: 'R0', cod });
	const shift = () => (rng.next() < 0.4 ? 0 : nonZero(rng, -4, 4));
	const choices: Record<4 | 5, Record<Kind, (() => RealF)[]>> = {
		4: {
			biettiva: [() => lin('R', 'R'), () => sq('R+', 'R+'), () => abs('R+', 'R+', 0), () => lin('R+', 'R+', rng.int(2, 6), 0)],
			iniettiva: [() => lin('R+', 'R'), () => sq('R+', 'R'), () => abs('R+', 'R', 0), () => lin('R+', 'R+', rng.int(2, 6), rng.int(1, 9))],
			suriettiva: [() => sq('R', 'R+'), () => abs('R', 'R+', shift())],
			nessuna: [() => sq('R', 'R'), () => abs('R', 'R', shift())],
		},
		5: {
			biettiva: [() => lin('Z', 'Z', rng.pick([1, -1])), () => lin('Q', 'Q'), () => recip('R0')],
			iniettiva: [() => lin('Z', 'Z'), () => recip('R')],
			suriettiva: [() => abs('Z', 'N', shift(), 1)],
			nessuna: [() => sq('Z', 'Z'), () => sq('Q', 'Q'), () => abs('Z', 'Z', shift()), () => abs('Q', 'Q', shift())],
		},
	};
	return rng.pick(choices[level][kind])();
}

// ---------------------------------------------------------------------------
// Level 6: inverse of a bijective linear function

function inverseSteps(a: number, b: number): string[] {
	const fx = polyToLatex(poly(b, a));
	const moved = joinSigned('y', q(-b));
	const out = [
		`\\text{La funzione è biettiva, quindi invertibile: per trovare l'inversa risolvi } y = ${fx} \\text{ rispetto a } x\\text{.}`,
		`\\text{Porta il termine noto nel primo membro: } ${moved} = ${polyToLatex(poly(0, a))}`,
		`\\text{Dividi entrambi i membri per } ${a < 0 ? `(${a})` : a}\\text{: } x = ${linInverseLatex(a, b)}`,
		`\\text{Quindi } f^{-1}(y) = ${linInverseLatex(a, b)}`,
	];
	return out;
}

/** Candidate for the inverse: m·y + c, or 1/(a·y + b). */
type InvOpt = { kind: 'lin'; p: number; c: number; d: number; split?: boolean } | { kind: 'recip'; a: number; b: number };

function invKey(o: InvOpt): string {
	if (o.kind === 'recip') return `r:${o.a}:${o.b}`;
	const m = q(o.p, o.d), c = q(o.c, o.d);
	return `l:${m}:${c}`;
}

function invLatex(o: InvOpt): string {
	if (o.kind === 'recip') return `\\frac{1}{${polyToLatex(poly(o.b, o.a), 'y')}}`;
	// y/a - b, written the way the student who divides only y writes it
	if (o.split) return joinSigned(o.d < 0 ? `-\\frac{y}{${-o.d}}` : `\\frac{y}{${o.d}}`, q(o.c, o.d));
	return linFracLatex(o.p, o.c, o.d);
}

function invValue(o: InvOpt): string {
	if (o.kind === 'recip') return `1/(${o.a}*y + (${o.b}))`;
	return `(${o.p}*y + (${o.c}))/(${o.d})`;
}

// ---------------------------------------------------------------------------
// Assemble

function assemble(rng: Rng, level: number): Sample {
	const seed = rng.seed;
	const base = { generatorId: ID, level, seed };
	switch (level) {
		case 1: {
			let b: ImageBuilt | null = null;
			while (!b) b = buildImage(rng);
			const answer: SetAnswer = { kind: 'set', values: b.image.map(String), latex: `\\mathrm{Im}(f) = ${listSet(b.image)}` };
			return {
				...base,
				prompt: "Determina l'immagine della funzione.",
				problem: `f: A \\to B,\\quad f(x) = ${intFormulaLatex(b.f)},\\quad A = ${listSet(b.A)},\\quad B = ${listSet(b.B)}`,
				solution: answer.latex,
				steps: imageSteps(b),
				answer,
				params: { f: fParams(b.f), A: b.A.map(String), B: b.B.map(String), image: b.image.map(String) },
			};
		}
		case 2: {
			const kind = rng.pick(KINDS);
			const b = buildMap(rng, kind);
			return {
				...base,
				prompt: CLASS_PROMPT,
				problem: mapProblem(b),
				solution: solutionOf[kind],
				steps: mapSteps(b),
				answer: classAnswer(kind),
				params: { A: b.A.map(String), B: b.B, map: b.map, display: b.display, case: kind },
			};
		}
		case 3: {
			const kind = rng.pick(KINDS);
			let b: FiniteBuilt | null = null;
			while (!b) b = buildFinite(rng, kind);
			return {
				...base,
				prompt: CLASS_PROMPT,
				problem: `f: A \\to B,\\quad f(x) = ${intFormulaLatex(b.f)},\\quad A = ${listSet(b.A)},\\quad B = ${listSet(b.B)}`,
				solution: solutionOf[kind],
				steps: finiteSteps(b),
				answer: classAnswer(kind),
				params: { f: fParams(b.f), A: b.A.map(String), B: b.B.map(String), image: b.image.map(String), case: kind },
			};
		}
		case 4:
		case 5: {
			const kind = rng.pick(KINDS);
			const f = buildReal(rng, level, kind);
			const facts = realFacts(f);
			if (kindOf(facts.inj, facts.surj) !== kind) throw new Error(`${ID}: internal mismatch at level ${level}`);
			return {
				...base,
				prompt: CLASS_PROMPT,
				problem: realProblem(f),
				solution: solutionOf[kind],
				steps: [facts.injStep, facts.surjStep, conclusion[kind]],
				answer: classAnswer(kind),
				params: { family: f.family, a: String(f.a), b: String(f.b), k: String(f.k), dom: f.dom, cod: f.cod, case: kind },
			};
		}
		case 6: {
			const a = nonZero(rng, -6, 6, [1, -1]);
			const b = nonZero(rng, -9, 9);
			const correct: InvOpt = { kind: 'lin', p: 1, c: -b, d: a };
			const answer: ExpressionAnswer = { kind: 'expression', value: invValue(correct), latex: `f^{-1}(y) = ${invLatex(correct)}` };
			return {
				...base,
				prompt: "Trova la funzione inversa.",
				problem: `f: \\mathbb{R} \\to \\mathbb{R},\\quad f(x) = ${polyToLatex(poly(b, a))}`,
				solution: answer.latex,
				steps: inverseSteps(a, b),
				answer,
				params: { a: String(a), b: String(b), inverse: answer.value },
			};
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

const fParams = (f: IntFormula) => ({ family: f.family, a: String(f.a), b: String(f.b), c: String(f.c) });

function parseIntFormula(x: unknown): IntFormula | null {
	if (!x || typeof x !== 'object') return null;
	const o = x as Record<string, string>;
	if (!['lin', 'quad', 'abs'].includes(o.family)) return null;
	return { family: o.family as IntFormula['family'], a: Number(o.a), b: Number(o.b), c: Number(o.c) };
}

// ---------------------------------------------------------------------------
// Checks

const nums = (x: unknown): number[] => (Array.isArray(x) ? x.map(Number) : []);
const isSorted = (xs: number[]) => xs.every((v, i) => i === 0 || xs[i - 1] < v);

function checkClassChoice(sample: Sample, kind: Kind, v: string[]): void {
	const ans = sample.answer;
	if (ans.kind !== 'choice') {
		v.push('la risposta deve essere a scelta multipla');
		return;
	}
	if (ans.options.length !== 4 || ans.options.some((o, i) => o.values[0] !== CLASS_OPTIONS[KINDS[i]].values[0])) v.push('opzioni diverse dalle quattro classificazioni');
	if (ans.options[ans.correct]?.values[0] !== CLASS_OPTIONS[kind].values[0]) v.push(`risposta diversa dal caso ${kind}`);
	if (sample.params.case !== kind) v.push(`params.case ${String(sample.params.case)} ma la funzione è ${kind}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	if (sample.steps.length === 0) v.push('nessun passaggio');
	switch (sample.level) {
		case 1:
		case 3: {
			const f = parseIntFormula(p.f);
			const A = nums(p.A), B = nums(p.B);
			if (!f) return ['params.f non valido'];
			if (A.length < 3 || A.length > 5 || A.some((x) => x < -3 || x > 3) || !isSorted(A)) v.push('A: da 3 a 5 interi distinti tra -3 e 3');
			const image = uniqSorted(A.map((x) => evalInt(f, x)));
			if (image.some((y) => !B.includes(y))) v.push('f(A) non contenuto in B: non è una funzione da A a B');
			if (!isSorted(B)) v.push('B non ordinato');
			if (f.family === 'lin' && f.a === 0) v.push('funzione lineare con a = 0');
			if (sample.level === 1) {
				if (B.length === image.length) v.push("il codominio deve essere più grande dell'immagine");
				const ans = sample.answer;
				if (ans.kind !== 'set' || ans.values.join(',') !== image.join(',')) v.push('risposta diversa da Im(f)');
			} else {
				const kind = kindOf(image.length === A.length, image.length === B.length);
				checkClassChoice(sample, kind, v);
				if (B.some((y) => Math.abs(y) > 20)) v.push('numeri troppo grandi in B');
			}
			break;
		}
		case 2: {
			const A = nums(p.A), B = p.B as string[], map = p.map as string[];
			if (!Array.isArray(B) || !Array.isArray(map) || map.length !== A.length || map.some((y) => !B.includes(y))) return ['params.map non valido'];
			if (A.length < 3 || A.length > 5 || B.length < 3 || B.length > 5) v.push('insiemi con 3-5 elementi');
			const hits = B.map((y) => map.filter((z) => z === y).length);
			checkClassChoice(sample, kindOf(hits.every((h) => h <= 1), hits.every((h) => h >= 1)), v);
			break;
		}
		case 4:
		case 5: {
			const f: RealF = { family: p.family as RealF['family'], a: Number(p.a), b: Number(p.b), k: Number(p.k), dom: p.dom as NumSet, cod: p.cod as NumSet };
			const allowed: NumSet[] = sample.level === 4 ? ['R', 'R+'] : ['Z', 'Q', 'N', 'R0', 'R'];
			if (!allowed.includes(f.dom) || !allowed.includes(f.cod)) v.push('insiemi non previsti per il livello');
			if (sample.level === 5 && f.dom === 'R' ) v.push('al livello 5 il dominio non è R');
			let facts: RealFacts;
			try {
				facts = realFacts(f);
			} catch (e) {
				v.push((e as Error).message);
				break;
			}
			checkClassChoice(sample, kindOf(facts.inj, facts.surj), v);
			break;
		}
		case 6: {
			const a = Number(p.a), b = Number(p.b);
			if (!Number.isInteger(a) || !Number.isInteger(b) || Math.abs(a) < 2 || Math.abs(a) > 6 || b === 0 || Math.abs(b) > 9) v.push('a intero con 2 ≤ |a| ≤ 6, b intero non nullo');
			const ans = sample.answer;
			if (ans.kind !== 'expression' || ans.value !== invValue({ kind: 'lin', p: 1, c: -b, d: a })) v.push("risposta diversa dall'inversa");
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice for levels 1 and 6 (levels 2-5 are born as multiple choice)

function shuffledChoice<T>(rng: Rng, options: T[], render: (o: T) => ChoiceOption): ChoiceAnswer {
	const order = shuffle(rng, options.map((_, i) => i));
	return { kind: 'choice', options: order.map((i) => render(options[i])), correct: order.indexOf(0) };
}

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const p = sample.params;
	if (sample.level === 1) {
		const f = parseIntFormula(p.f)!;
		const A = nums(p.A), B = nums(p.B);
		const image = uniqSorted(A.map((x) => evalInt(f, x)));
		const options: number[][] = [image];
		const seen = new Set([image.join(',')]);
		const add = (s: number[]) => {
			const u = uniqSorted(s);
			if (options.length < 4 && u.length > 0 && !seen.has(u.join(','))) {
				seen.add(u.join(','));
				options.push(u);
			}
		};
		add(B); // the codomain instead of the image
		add(A.map((x) => signSlip(f, x))); // (-2)^2 = -4 and similar
		add(A); // the domain
		const missed = B.filter((y) => !image.includes(y));
		for (const y of missed) add([...image, y]);
		for (let d = 1; options.length < 4 && d < 20; d++) add([...image, image[image.length - 1] + d]);
		return shuffledChoice(rng, options, (o) => ({ latex: listSet(o), values: o.map(String) }));
	}
	if (sample.level === 6) {
		const a = Number(p.a), b = Number(p.b);
		const cands: InvOpt[] = [
			{ kind: 'lin', p: 1, c: -b, d: a },
			{ kind: 'lin', p: 1, c: b, d: a }, // sign of b not changed
			{ kind: 'lin', p: 1, c: -a * b, d: a, split: true }, // y/a - b: only y divided by a
			{ kind: 'recip', a, b }, // f^{-1} read as 1/f
			{ kind: 'lin', p: -1, c: -b, d: a },
		];
		const options: InvOpt[] = [];
		const seen = new Set<string>();
		for (const o of cands) if (options.length < 4 && !seen.has(invKey(o))) (seen.add(invKey(o)), options.push(o));
		return shuffledChoice(rng, options, (o) => ({ latex: `f^{-1}(y) = ${invLatex(o)}`, values: [invValue(o)] }));
	}
	throw new Error(`${ID}: no multiple choice for level ${sample.level}`);
}

// ---------------------------------------------------------------------------

export const funzioniIniettiveSuriettiveBiettive: Generator = {
	id: ID,
	title: 'Funzioni iniettive, suriettive e biettive',
	levels: {
		1: { label: "Immagine di una funzione su un insieme finito", constraints: ['f(x) = ax + b, x^2 + bx + c oppure |x + b| + c, su un dominio di 3-5 interi tra -3 e 3', 'il codominio B contiene l\'immagine e almeno un numero in più'] },
		2: { label: 'Funzioni tra insiemi finiti, date elemento per elemento', constraints: ['A = {1, ..., n}, B di lettere, 3-5 elementi ciascuno', 'frecce o tabella; le quattro risposte con la stessa frequenza'] },
		3: { label: 'Funzioni tra insiemi finiti di numeri, date con una formula', constraints: ['come il livello 1, ma si classifica la funzione', "B uguale all'immagine o con 1-2 numeri in più"] },
		4: { label: 'Funzioni reali: ℝ e [0, +∞)', constraints: ['ax + b, kx^2, k|x + b| con dominio e codominio ℝ o [0, +∞)', 'restringere il dominio o il codominio cambia la risposta'] },
		5: { label: 'Altri insiemi: ℤ, ℚ, ℕ, ℝ ∖ {0}', constraints: ['ax + b su ℤ e ℚ, kx^2 e |x + b| su ℤ, ℚ e ℕ, k/x su ℝ ∖ {0}'] },
		6: { label: 'Inversa di una funzione lineare', constraints: ['f(x) = ax + b da ℝ a ℝ, 2 ≤ |a| ≤ 6, b ≠ 0', 'si risolve y = f(x) rispetto a x'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const sample = assemble(rng, level);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default funzioniIniettiveSuriettiveBiettive;
