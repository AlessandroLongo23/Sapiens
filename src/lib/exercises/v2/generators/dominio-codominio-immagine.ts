/**
 * Dominio, codominio e immagine. Spec: specs/exercises/dominio-codominio-immagine.md
 *
 * Six levels in the order of the lesson: the preimages of an element of a finite function given by arrows
 * or by a table; the image set of a formula on a finite domain; image and preimages with a law on ℤ or ℚ
 * (a x + b, and x^2 + c on ℤ); the natural domain of a polynomial or of a fraction with a first-degree
 * denominator; denominators to factor and two fractions; the awkward cases (a denominator that is never
 * zero, a number as denominator, a fraction that simplifies). Every answer is chosen first: the preimages,
 * the zeros of the denominators, then the text.
 *
 * Injectivity and surjectivity are in funzioni-iniettive-suriettive-biettive and stay out of this one.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, NumberAnswer, Rng, Sample, SetAnswer } from '../types';
import { assembleChoice, fitSetChoice, pickDistinct, setTex, shuffle } from '../insiemi';
import { type Poly, joinSigned, paren, poly, polyDegree, polyToLatex } from '../latex';
import { Rational, gcd, q } from '../rational';

export const ID = 'dominio-codominio-immagine';

export const FORBIDDEN_PATTERNS: { name: string; re: RegExp }[] = [
	{ name: 'coefficiente 1 esplicito (1x)', re: /(?<![\d.])1\s*x/ },
	{ name: 'termine nullo (0x)', re: /(?<![\d.])0\s*x/ },
	{ name: '"+ -"', re: /\+\s*-/ },
	{ name: '"- -"', re: /-\s*-/ },
	{ name: '"+ +"', re: /\+\s*\+/ },
	{ name: 'termine nullo (+ 0 / - 0)', re: /[+-]\s*0(?![\d])/ },
	{ name: 'esponente 1', re: /\^\{1\}|\^1(?!\d)/ },
];

// ---------------------------------------------------------------------------
// Small helpers

function nonZero(rng: Rng, a: number, b: number, not: number[] = []): number {
	for (;;) {
		const v = rng.int(a, b);
		if (v !== 0 && !not.includes(v)) return v;
	}
}

const sortNum = (xs: number[]) => [...xs].sort((a, b) => a - b);
const uniqSorted = (xs: number[]) => sortNum([...new Set(xs)]);
const sortRat = (xs: Rational[]) => {
	const out: Rational[] = [];
	for (const x of xs) if (!out.some((y) => y.equals(x))) out.push(x);
	return out.sort((a, b) => a.compare(b));
};
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/** "\{-1,\ 0,\ 1\}" as in the lesson. */
const listSet = (xs: (number | string)[]) => `\\{${xs.join(',\\ ')}\\}`;

/** "a", "a e b", "a, b e c": the preimages as the lesson says them; none is "nessuna". */
function andList(xs: string[]): string {
	if (xs.length === 0) return '\\text{nessuna}';
	if (xs.length === 1) return xs[0];
	return `${xs.slice(0, -1).join(',\\ ')} \\text{ e } ${xs[xs.length - 1]}`;
}

const WORDS = ['zero', 'una', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette'];

/** An option listing preimages (or "nessuna"); values are the exact numbers, sorted. */
function preOption(xs: Rational[]): ChoiceOption {
	const s = sortRat(xs);
	return { latex: andList(s.map((v) => v.toLatex())), values: s.map(String) };
}

const intsR = (xs: number[]) => xs.map((v) => q(v));

// ---------------------------------------------------------------------------
// Level 1: preimages in a finite function given element by element

interface MapBuilt {
	A: number[];
	B: number[];
	/** map[i] = f(A[i]) */
	map: number[];
	y: number;
	display: 'frecce' | 'tabella';
	case: 'nessuna' | 'una' | 'piu';
}

function buildMap(rng: Rng): MapBuilt {
	const kase = rng.pick(['nessuna', 'una', 'piu'] as const);
	const n = rng.int(4, 6);
	const m = rng.int(3, 5);
	const A = sortNum(pickDistinct(rng, range(-3, 6), n));
	const B = sortNum(pickDistinct(rng, range(0, 9), m));
	const y = rng.pick(B);
	const k = kase === 'nessuna' ? 0 : kase === 'una' ? 1 : rng.int(2, Math.min(3, n - 1));
	const pre = pickDistinct(rng, A, k);
	const others = B.filter((b) => b !== y);
	const map = A.map((a) => (pre.includes(a) ? y : rng.pick(others)));
	return { A, B, map, y, display: rng.next() < 0.6 ? 'frecce' : 'tabella', case: kase };
}

function mapProblem(b: MapBuilt): string {
	const sets = `f: A \\to B,\\quad A = ${listSet(b.A)},\\quad B = ${listSet(b.B)}`;
	if (b.display === 'frecce') return `\\begin{gathered} ${sets} \\\\ ${b.A.map((x, i) => `${x} \\mapsto ${b.map[i]}`).join(',\\qquad ')} \\end{gathered}`;
	const table = `\\begin{array}{c|${'c'.repeat(b.A.length)}} x & ${b.A.join(' & ')} \\\\ \\hline f(x) & ${b.map.join(' & ')} \\end{array}`;
	return `\\begin{gathered} ${sets} \\\\ ${table} \\end{gathered}`;
}

const preimagesOf = (b: { A: number[]; map: number[] }, y: number) => b.A.filter((_, i) => b.map[i] === y);

function mapSteps(b: MapBuilt): string[] {
	const pre = preimagesOf(b, b.y);
	const arrows = b.display === 'frecce';
	const out = [
		arrows
			? `\\text{Le controimmagini di } ${b.y} \\text{ sono gli elementi di } A \\text{ da cui parte una freccia che arriva a } ${b.y}\\text{.}`
			: `\\text{Le controimmagini di } ${b.y} \\text{ sono gli elementi di } A \\text{ che nella seconda riga hanno sotto } ${b.y}\\text{.}`,
	];
	if (pre.length === 0) {
		out.push(`${b.y} \\text{ sta in } B\\text{, ma nessun elemento di } A \\text{ ha immagine } ${b.y}\\text{: } ${b.y} \\text{ non ha controimmagini.}`);
	} else {
		out.push(`${pre.map((x) => `f(${x})`).join(' = ')} = ${b.y}`);
		out.push(
			pre.length === 1
				? `\\text{La controimmagine di } ${b.y} \\text{ è una sola: } ${pre[0]}\\text{.}`
				: `\\text{Le controimmagini di } ${b.y} \\text{ sono ${WORDS[pre.length]}: } ${andList(pre.map(String))}\\text{.}`,
		);
	}
	return out;
}

function mapChoice(rng: Rng, b: MapBuilt): ChoiceAnswer {
	const pre = preimagesOf(b, b.y);
	const cands: Rational[][] = [];
	const i = b.A.indexOf(b.y);
	if (i >= 0) cands.push([q(b.map[i])]); // image and preimage swapped: f(y) instead of the x with f(x) = y
	for (const x of pre) if (pre.length > 1) cands.push(intsR(pre.filter((z) => z !== x))); // one preimage missed
	cands.push([q(b.y)]); // the element itself
	if (pre.length > 0) cands.push([]); // "nessuna"
	for (const z of shuffle(rng, b.B)) if (z !== b.y && preimagesOf(b, z).length > 0) cands.push(intsR(preimagesOf(b, z))); // the preimages of another element
	for (const x of shuffle(rng, b.A)) if (!pre.includes(x)) cands.push(intsR([...pre, x]));
	const ch = assembleChoice(rng, preOption(intsR(pre)), cands.map(preOption));
	if (!ch) throw new Error(`${ID}: level 1 without enough distractors`);
	return ch;
}

// ---------------------------------------------------------------------------
// Level 2: the image set of a formula on a finite domain

interface ImgBuilt {
	family: 'abs' | 'quad' | 'resto';
	/** abs: |x + b|; quad: x^2 + b x + c; resto: remainder of x divided by k */
	b: number;
	c: number;
	k: number;
	A: number[];
	cod: 'Z' | 'N' | 'B';
	B: number[];
}

export function evalImg(f: { family: string; b: number; c: number; k: number }, x: number): number {
	if (f.family === 'abs') return Math.abs(x + f.b);
	if (f.family === 'quad') return x * x + f.b * x + f.c;
	return ((x % f.k) + f.k) % f.k;
}

const absLatex = (inner: string) => `\\lvert ${inner} \\rvert`;

function imgFormulaLatex(f: ImgBuilt): string {
	if (f.family === 'abs') return absLatex(polyToLatex(poly(f.b, 1)));
	return polyToLatex(poly(f.c, f.b, 1));
}

function buildImg(rng: Rng): ImgBuilt | null {
	const family = rng.pick(['abs', 'quad', 'resto'] as const);
	let A: number[];
	let b = 0,
		c = 0,
		k = 0;
	if (family === 'resto') {
		k = rng.int(3, 5);
		A = sortNum(pickDistinct(rng, range(1, 12), rng.int(5, 7)));
	} else {
		A = sortNum(pickDistinct(rng, range(-3, 3), rng.int(5, 7)));
		if (family === 'abs') b = rng.int(-2, 2);
		else if (rng.next() < 0.6) c = rng.int(-4, 4);
		else b = rng.pick([-2, -1, 1, 2]);
	}
	const f = { family, b, c, k };
	const image = uniqSorted(A.map((x) => evalImg(f, x)));
	if (image.length === A.length || image.length < 2) return null;
	const nonneg = image[0] >= 0;
	const cod = rng.next() < 0.4 ? 'B' : family === 'resto' || (family === 'abs' && rng.next() < 0.5) ? 'N' : nonneg && rng.next() < 0.3 ? 'N' : 'Z';
	let B: number[] = [];
	if (cod === 'B') {
		const lo = family === 'resto' || nonneg ? 0 : image[0] - 1;
		const free = range(lo, image[image.length - 1] + 2).filter((v) => !image.includes(v));
		B = uniqSorted([...image, ...pickDistinct(rng, free, rng.int(1, 2))]);
	}
	return { family, b, c, k, A, cod, B };
}

function imgProblem(f: ImgBuilt): string {
	const target = f.cod === 'B' ? 'B' : f.cod === 'N' ? '\\mathbb{N}' : '\\mathbb{Z}';
	const sets = [`f: A \\to ${target}`, `A = ${listSet(f.A)}`];
	if (f.cod === 'B') sets.push(`B = ${listSet(f.B)}`);
	if (f.family === 'resto') return `\\begin{gathered} ${sets.join(',\\quad ')} \\\\ \\text{$f(x)$ è il resto della divisione di $x$ per $${f.k}$} \\end{gathered}`;
	return [...sets, `f(x) = ${imgFormulaLatex(f)}`].join(',\\quad ');
}

/** f(-2) = (-2)^2 - 1 = 3, f(3) = |3 - 1| = 2, f(7) = 1 (7 = 2 · 3 + 1). */
function imgStep(f: ImgBuilt, x: number): string {
	const v = evalImg(f, x);
	if (f.family === 'resto') return `f(${x}) = ${v} \\quad (${x} = ${Math.floor(x / f.k)} \\cdot ${f.k}${v ? ` + ${v}` : ''})`;
	if (f.family === 'abs') return f.b === 0 ? `f(${x}) = ${absLatex(String(x))} = ${v}` : `f(${x}) = ${absLatex(joinSigned(String(x), q(f.b)))} = ${absLatex(String(x + f.b))} = ${v}`;
	const X = paren(q(x));
	let mid = `${X}^2`;
	if (f.b !== 0) mid += `${f.b < 0 ? ' - ' : ' + '}${Math.abs(f.b) === 1 ? '' : `${Math.abs(f.b)} \\cdot `}${X}`;
	if (f.c !== 0) mid += f.c < 0 ? ` - ${-f.c}` : ` + ${f.c}`;
	return `f(${x}) = ${mid} = ${v}`;
}

function imgSteps(f: ImgBuilt): string[] {
	const values = f.A.map((x) => evalImg(f, x));
	const image = uniqSorted(values);
	const out = [`\\text{Calcola l'immagine di ogni elemento del dominio.}`];
	for (const x of f.A) out.push(imgStep(f, x));
	const repeated = image.filter((v) => values.filter((w) => w === v).length > 1);
	out.push(
		repeated.length === 1
			? `\\text{Raccogli i risultati, scrivendo una volta sola } ${repeated[0]}\\text{, che esce ${WORDS[values.filter((w) => w === repeated[0]).length]} volte: } f(A) = ${listSet(image)}`
			: `\\text{Raccogli i risultati, scrivendo una volta sola quelli ripetuti: } f(A) = ${listSet(image)}`,
	);
	if (f.cod === 'B') {
		const missed = f.B.filter((v) => !image.includes(v));
		out.push(
			missed.length === 1
				? `\\text{Il numero } ${missed[0]} \\text{ sta nel codominio } B \\text{ ma non è immagine di nessun elemento: } f(A) \\text{ è più piccolo di } B\\text{.}`
				: `\\text{I numeri } ${andList(missed.map(String))} \\text{ stanno nel codominio } B \\text{ ma non sono immagine di nessun elemento: } f(A) \\text{ è più piccolo di } B\\text{.}`,
		);
	} else {
		out.push(`\\text{Il codominio } ${f.cod === 'N' ? '\\mathbb{N}' : '\\mathbb{Z}'} \\text{ è infinito, ma la funzione prende solo ${WORDS[image.length]} valori.}`);
	}
	return out;
}

/** The value a student gets with a sign slip on a negative number: (-2)^2 = -4, |-2| = -2. */
function signSlip(f: ImgBuilt, x: number): number {
	if (f.family === 'abs') return x + f.b;
	if (f.family === 'quad') return x < 0 ? -x * x + f.b * x + f.c : evalImg(f, x);
	return Math.floor(x / f.k); // the quotient instead of the remainder
}

function imgChoice(rng: Rng, f: ImgBuilt): ChoiceAnswer {
	const image = uniqSorted(f.A.map((x) => evalImg(f, x)));
	const opt = (xs: number[]): ChoiceOption => {
		const s = uniqSorted(xs);
		return { latex: setTex(s), values: s.map(String) };
	};
	const cands: number[][] = [];
	if (f.cod === 'B') cands.push(f.B); // the codomain instead of the image
	cands.push(f.A.map((x) => signSlip(f, x)));
	if (f.family === 'resto') cands.push(range(0, f.k - 1)); // every possible remainder
	cands.push(f.A); // the domain
	for (const d of [1, 2, 3]) cands.push([...image, image[image.length - 1] + d]);
	cands.push(image.slice(1), image.slice(0, -1));
	const ch = assembleChoice(rng, opt(image), cands.filter((c) => c.length > 0).map(opt));
	if (!ch) throw new Error(`${ID}: level 2 without enough distractors`);
	return fitSetChoice(ch);
}

// ---------------------------------------------------------------------------
// Level 3: image and preimages with a law on ℤ or ℚ

interface LawBuilt {
	case: 'immagine' | 'lin-intera' | 'lin-nessuna' | 'lin-Q' | 'quadrato';
	family: 'lin' | 'sq';
	/** lin: a x + b; sq: x^2 + c */
	a: number;
	b: number;
	c: number;
	dom: 'Z' | 'Q';
	/** The number whose image or preimages are asked. */
	n: number;
}

const lawEval = (f: LawBuilt, x: Rational): Rational => (f.family === 'lin' ? x.mul(q(f.a)).add(q(f.b)) : x.mul(x).add(q(f.c)));
const lawLatex = (f: LawBuilt) => (f.family === 'lin' ? polyToLatex(poly(f.b, f.a)) : polyToLatex(poly(f.c, 0, 1)));

/** Preimages of y: the exact solutions of f(x) = y that lie in the domain. */
export function lawPreimages(f: LawBuilt, y: number): Rational[] {
	if (f.family === 'lin') {
		const x = q(y - f.b, f.a);
		return f.dom === 'Q' || x.isInteger() ? [x] : [];
	}
	const s = y - f.c;
	if (s < 0) return [];
	const r = Math.round(Math.sqrt(s));
	if (r * r !== s) return [];
	return r === 0 ? [q(0)] : [q(-r), q(r)];
}

function buildLaw(rng: Rng): LawBuilt {
	const u = rng.next();
	const kase: LawBuilt['case'] = u < 0.25 ? 'immagine' : u < 0.45 ? 'lin-intera' : u < 0.65 ? 'lin-nessuna' : u < 0.8 ? 'lin-Q' : 'quadrato';
	if (kase === 'quadrato') {
		const c = rng.next() < 0.4 ? 0 : nonZero(rng, -5, 5);
		const w = rng.next();
		let s: number; // y - c
		if (w < 0.45) s = rng.int(1, 6) ** 2;
		else if (w < 0.55) s = 0;
		else if (w < 0.75) s = -rng.int(1, 9);
		else s = rng.pick([2, 3, 5, 6, 7, 8, 10, 12, 15, 17, 20]);
		return { case: kase, family: 'sq', a: 1, b: 0, c, dom: 'Z', n: s + c };
	}
	const a = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
	const b = nonZero(rng, -9, 9);
	if (kase === 'immagine') return { case: kase, family: 'lin', a, b, c: 0, dom: rng.next() < 0.7 ? 'Z' : 'Q', n: rng.int(-6, 6) };
	const x0 = rng.int(-6, 6);
	const off = kase === 'lin-intera' ? 0 : rng.int(1, Math.abs(a) - 1);
	return { case: kase, family: 'lin', a, b, c: 0, dom: kase === 'lin-Q' ? 'Q' : 'Z', n: a * x0 + b + off };
}

const DOM_TEX = { Z: '\\mathbb{Z}', Q: '\\mathbb{Q}' };
const lawProblem = (f: LawBuilt) => `f: ${DOM_TEX[f.dom]} \\to ${DOM_TEX[f.dom]},\\quad f(x) = ${lawLatex(f)}`;

function linSubst(a: number, b: number, x: number): string {
	const ax = a === 1 ? String(x) : a === -1 ? `-${paren(q(x))}` : `${a} \\cdot ${paren(q(x))}`;
	return joinSigned(ax, q(b));
}

function lawSteps(f: LawBuilt): string[] {
	const y = f.n;
	if (f.case === 'immagine') {
		return [
			`\\text{L'immagine di } ${y} \\text{ si trova sostituendo } ${y} \\text{ al posto di } x\\text{:}`,
			`f(${y}) = ${linSubst(f.a, f.b, y)} = ${f.a * y + f.b}`,
		];
	}
	if (f.family === 'sq') {
		const s = y - f.c;
		const out = [`\\text{Cerca gli interi } x \\text{ per cui } f(x) = ${y}\\text{:}`];
		if (f.c !== 0) out.push(`${lawLatex(f)} = ${y} \\quad\\Rightarrow\\quad x^2 = ${s}`);
		else out.push(`x^2 = ${y}`);
		if (s < 0) out.push(`\\text{Nessuna: il quadrato di un numero non è mai negativo.}`);
		else if (s === 0) out.push(`\\text{Solo } x = 0\\text{: la controimmagine è una sola, } 0\\text{.}`);
		else {
			const r = Math.round(Math.sqrt(s));
			if (r * r === s) out.push(`\\text{Gli interi con quadrato } ${s} \\text{ sono due: } -${r} \\text{ e } ${r}\\text{.}`);
			else out.push(`\\text{Nessuna: } ${r}^2 = ${r * r} \\text{ e } ${r + 1}^2 = ${(r + 1) ** 2}\\text{, e nessun intero ha quadrato } ${s}\\text{.}`);
		}
		return out;
	}
	const x = q(y - f.b, f.a);
	const out = [
		`\\text{Cerca gli } x \\text{ per cui } f(x) = ${y}\\text{:}`,
		`${lawLatex(f)} = ${y} \\quad\\Rightarrow\\quad ${f.a}x = ${y - f.b} \\quad\\Rightarrow\\quad x = ${x.toLatex()}`,
	];
	if (x.isInteger()) out.push(`${x.toLatex()} \\text{ è un intero: la controimmagine di } ${y} \\text{ è } ${x.toLatex()}\\text{.}`);
	else if (f.dom === 'Z') out.push(`${x.toLatex()} \\text{ non è un intero: nel dominio } \\mathbb{Z} \\text{ il numero } ${y} \\text{ non ha controimmagini.}`);
	else out.push(`${x.toLatex()} \\text{ è un numero razionale: la controimmagine di } ${y} \\text{ è } ${x.toLatex()}\\text{.}`);
	return out;
}

function lawChoice(rng: Rng, f: LawBuilt): ChoiceAnswer {
	const y = f.n;
	const cands: Rational[][] = [];
	if (f.case === 'immagine') {
		const v = f.a * y + f.b;
		const correct: ChoiceOption = { latex: String(v), values: [String(v)] };
		const nums = [
			q(y - f.b, f.a), // the preimage of y instead of its image
			q(-f.a * y + f.b), // sign slip on a·y
			q(f.a * y - f.b), // sign of b
			q((f.a + f.b) * y), // a and b both multiplied by y
			q(v + f.a),
			q(v - f.a),
			q(v + 1),
		];
		const ch = assembleChoice(
			rng,
			correct,
			nums.map((r) => ({ latex: r.toLatex(), values: [String(r)] })),
		);
		if (!ch) throw new Error(`${ID}: level 3 without enough distractors`);
		return ch;
	}
	const truth = lawPreimages(f, y);
	if (f.family === 'lin') {
		cands.push([q(y - f.b, f.a)]); // x = (y - b)/a ignoring the domain ℤ
		cands.push([lawEval(f, q(y))]); // the image f(y) instead
		cands.push([q(y + f.b, f.a)]); // sign of b not changed
		cands.push([q(f.b - y, f.a)]); // sign lost in the division
		cands.push([q(y - f.b, -f.a)]);
		cands.push([]); // "nessuna"
		cands.push([q(y - f.b).mul(q(f.a))]); // multiplied instead of divided
	} else {
		const s = y - f.c;
		const r = Math.round(Math.sqrt(Math.abs(s)));
		if (r * r === Math.abs(s) && r > 0) {
			cands.push([q(r)]); // the negative root forgotten
			cands.push([q(-r), q(r)]); // x^2 = -9 "solved" as ±3
		}
		cands.push([lawEval(f, q(y))]); // the image f(y) instead
		cands.push([]);
		cands.push([q(s)]); // x = y - c: the square forgotten
		cands.push([q(-s), q(s)]);
		cands.push([q(y)]);
		cands.push([q(0)]);
	}
	for (let d = 1; d <= 12; d++) cands.push([q(d)], [q(-d), q(d)], [q(-d)]);
	const ch = assembleChoice(
		rng,
		preOption(truth),
		cands.filter((c) => c.every((r) => Math.abs(r.num) <= 60)).map(preOption),
	);
	if (!ch) throw new Error(`${ID}: level 3 without enough distractors`);
	return ch;
}

// ---------------------------------------------------------------------------
// Levels 4-6: the natural domain

/** One addend of the formula: num/den, polynomials with integer coefficients; den = [1] for a polynomial. */
export interface Term {
	num: Poly;
	den: Poly;
}

type DomCase = 'polinomio' | 'intera' | 'frazionaria' | 'raccoglimento' | 'quadrati' | 'due-frazioni' | 'mai-nullo' | 'numero' | 'semplifica';

interface DomBuilt {
	case: DomCase;
	terms: Term[];
	/** Values that annul a denominator, sorted: the complement of the domain in ℝ. */
	excluded: Rational[];
	/** Worked steps, built with the formula. */
	steps: string[];
	/** Wrong answers from the lesson's warnings, each a set of excluded values ([] is ℝ). */
	wrong: Rational[][];
}

const isConst = (p: Poly) => polyDegree(p) <= 0;

function termLatex(t: Term, first: boolean): string {
	if (isConst(t.den) && t.den[0].isOne()) return polyToLatex(t.num);
	if (isConst(t.num)) {
		const n = t.num[0];
		const body = `\\frac{${n.abs().toLatex()}}{${polyToLatex(t.den)}}`;
		if (first) return n.sign() < 0 ? `-${body}` : body;
		return n.sign() < 0 ? ` - ${body}` : ` + ${body}`;
	}
	const body = `\\frac{${polyToLatex(t.num)}}{${polyToLatex(t.den)}}`;
	return first ? body : ` + ${body}`;
}

export const formulaLatex = (terms: Term[]) => terms.map((t, i) => termLatex(t, i === 0)).join('');

/** The domain as the lesson writes it: D = ℝ, or D = ℝ \ {…}. */
export function domainLatex(excl: Rational[]): string {
	const s = sortRat(excl);
	if (s.length === 0) return 'D = \\mathbb{R}';
	return `D = \\mathbb{R} \\setminus \\{${s.map((v) => v.toLatex()).join(',\\ ')}\\}`;
}

function domOption(excl: Rational[]): ChoiceOption {
	const s = sortRat(excl);
	return { latex: domainLatex(s), values: s.map(String) };
}

/** Rational roots of an integer polynomial (rational root test). */
export function rationalRoots(p: Poly): Rational[] {
	const d = polyDegree(p);
	if (d <= 0) return [];
	const cs = p.slice(0, d + 1).map((c) => c.num);
	let k = 0;
	while (cs[k] === 0) k++;
	const out: Rational[] = k > 0 ? [q(0)] : [];
	const c0 = Math.abs(cs[k]),
		lead = Math.abs(cs[d]);
	for (let pn = 1; pn <= c0; pn++) {
		if (c0 % pn) continue;
		for (let qd = 1; qd <= lead; qd++) {
			if (lead % qd) continue;
			for (const r of [q(pn, qd), q(-pn, qd)]) {
				let v = q(0);
				for (let i = d; i >= 0; i--) v = v.mul(r).add(p[i]);
				if (v.isZero()) out.push(r);
			}
		}
	}
	return sortRat(out);
}

/** a x + b = 0 solved as in the lesson: "2x + 5 = 0, cioè 2x = -5, x = -5/2". */
function linZeroText(a: number, b: number): string {
	const r = q(-b, a);
	const lhs = polyToLatex(poly(b, a));
	if (a === 1) return `${lhs} = 0\\text{, cioè } x = ${r.toLatex()}`;
	return `${lhs} = 0\\text{, cioè } ${polyToLatex(poly(0, a))} = ${-b}\\text{, } x = ${r.toLatex()}`;
}

const numText = (p: Poly) => {
	const r = rationalRoots(p);
	return r.length === 1 ? r[0] : null;
};

/** A numerator c x + d (or a constant) that does not vanish where the denominators do. */
function numerator(rng: Rng, avoid: Rational[], constShare = 0.2): Poly {
	for (;;) {
		if (rng.next() < constShare) return poly(nonZero(rng, -6, 6));
		const c = rng.pick([1, 1, 1, 2, 3]);
		const d = nonZero(rng, -9, 9);
		const r = q(-d, c);
		if (!avoid.some((v) => v.equals(r) || v.equals(r.neg()))) return poly(d, c);
	}
}

function buildDomain(rng: Rng, level: number): DomBuilt {
	const R = (xs: (Rational | number)[]) => xs.map((v) => (typeof v === 'number' ? q(v) : v));
	if (level === 4) {
		const u = rng.next();
		if (u < 0.25) {
			// A polynomial: D = ℝ. Built from integer zeros so the "exclude the zeros" mistake is visible.
			const r = nonZero(rng, -5, 5);
			let p: Poly;
			let zeros: number[];
			const w = rng.next();
			if (w < 0.35) {
				const k = rng.pick([2, 3, 4, -2, -3]);
				p = poly(-k * r, k);
				zeros = [r];
			} else if (w < 0.75) {
				const s = nonZero(rng, -5, 5, [r, -r]);
				p = poly(r * s, -(r + s), 1);
				zeros = [r, s];
			} else {
				p = poly(nonZero(rng, -9, 9), rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]), 0, 1);
				zeros = [];
			}
			return {
				case: 'polinomio',
				terms: [{ num: p, den: poly(1) }],
				excluded: [],
				steps: [
					`\\text{La formula è un polinomio: puoi sostituire a } x \\text{ qualsiasi numero reale, e somme, sottrazioni e moltiplicazioni danno sempre un risultato.}`,
					...(zeros.length
						? [`\\text{Il polinomio vale } 0 \\text{ per } ${andList(sortNum(zeros).map(String))}\\text{, ma } 0 \\text{ è un numero: non si esclude niente.}`]
						: []),
					'D = \\mathbb{R}',
				],
				wrong: [R(zeros), R([0]), R(zeros.map((z) => -z)), R([zeros[0] ?? 1]), R([p[0].num]), R([-p[0].num])],
			};
		}
		const frac = u >= 0.625;
		let a: number, b: number;
		if (frac) {
			a = rng.pick([2, 3, 4, 5]);
			do b = nonZero(rng, -9, 9);
			while (b % a === 0);
		} else {
			a = rng.next() < 0.7 ? 1 : rng.pick([2, 3]);
			b = a * nonZero(rng, -7, 7);
		}
		const r = q(-b, a);
		const num = numerator(rng, [r]);
		const nr = numText(num);
		const steps = [`\\text{Il denominatore si annulla quando } ${linZeroText(a, b)}\\text{.}`];
		if (nr) steps.push(`\\text{Il numeratore si annulla per } x = ${nr.toLatex()}\\text{, che resta nel dominio: la frazione lì vale } 0\\text{.}`);
		steps.push(domainLatex([r]));
		return {
			case: frac ? 'frazionaria' : 'intera',
			terms: [{ num, den: poly(b, a) }],
			excluded: [r],
			steps,
			wrong: [nr ? [nr] : [], [r.neg()], [q(-b)], [q(b)], nr ? [nr, r] : [q(0)], [], [q(0)], [q(a, b)]],
		};
	}
	if (level === 5) {
		const kase = rng.pick(['raccoglimento', 'quadrati', 'due-frazioni'] as const);
		if (kase === 'raccoglimento') {
			const k = rng.pick([1, 1, 1, 2, 3]);
			const m = nonZero(rng, -9, 9);
			const g = gcd(k, m);
			const inner = poly(m / g, k / g);
			const r = q(-m, k);
			const excluded = sortRat([q(0), r]);
			const num = numerator(rng, excluded, 0.3);
			const nr = numText(num);
			const lead = `${g === 1 ? '' : g}x`;
			return {
				case: kase,
				terms: [{ num, den: poly(0, m, k) }],
				excluded,
				steps: [
					`\\text{Il denominatore è di secondo grado: lo scomponi con un raccoglimento totale, } ${polyToLatex(poly(0, m, k))} = ${lead}(${polyToLatex(inner)})\\text{.}`,
					`\\text{Un prodotto vale zero quando vale zero almeno uno dei fattori: } x = 0 \\text{ oppure } ${linZeroText(k / g, m / g)}\\text{.}`,
					domainLatex(excluded),
				],
				wrong: [[r], [q(0)], [q(0), r.neg()], [q(0), q(-m)], nr ? [q(0), r, nr] : [q(0), r, q(1)], [], [q(0), q(m)]],
			};
		}
		if (kase === 'quadrati') {
			const p = rng.next() < 0.7 ? 1 : rng.pick([2, 3]);
			let a: number;
			do a = rng.int(1, p === 1 ? 9 : 5);
			while (gcd(a, p) !== 1);
			const r = q(a, p);
			const excluded = [r.neg(), r];
			const num = numerator(rng, excluded, 0.3);
			const nr = numText(num);
			const den = poly(-a * a, 0, p * p);
			const px = p === 1 ? 'x' : `${p}x`;
			return {
				case: kase,
				terms: [{ num, den }],
				excluded,
				steps: [
					`${polyToLatex(den)} \\text{ è una differenza di quadrati: } ${polyToLatex(den)} = (${px} - ${a})(${px} + ${a})\\text{.}`,
					`\\text{Un prodotto vale zero quando vale zero almeno uno dei fattori: } x = ${r.toLatex()} \\text{ oppure } x = ${r.neg().toLatex()}\\text{.}`,
					domainLatex(excluded),
				],
				wrong: [[r], [q(a * a, p * p)], [q(-a * a, p * p), q(a * a, p * p)], [], nr ? [r.neg(), r, nr] : [r.neg()], [r.neg()], [q(-a), q(a)]],
			};
		}
		// Two fractions with first-degree denominators x - r and x - s.
		const [r, s] = pickDistinct(rng, range(-6, 6), 2);
		const n1 = nonZero(rng, -5, 5),
			n2 = nonZero(rng, -5, 5);
		const terms = [
			{ num: poly(n1), den: poly(-r, 1) },
			{ num: poly(n2), den: poly(-s, 1) },
		];
		const excluded = sortRat([q(r), q(s)]);
		const zero = (v: number) => (v === 0 ? 'x' : polyToLatex(poly(-v, 1)));
		return {
			case: 'due-frazioni',
			terms,
			excluded,
			steps: [
				`\\text{Ogni denominatore va controllato: } ${zero(r)} \\text{ si annulla per } x = ${r}\\text{, } ${zero(s)} \\text{ per } x = ${s}\\text{.}`,
				`\\text{La formula ha senso solo se tutte e due le frazioni hanno senso: escludi entrambi i valori.}`,
				domainLatex(excluded),
			],
			wrong: [[q(r)], [q(s)], [q(-r), q(-s)], [q(r), q(-s)], [q(-r), q(s)], [q(r), q(s), q(0)], []],
		};
	}
	// Level 6
	const kase = rng.pick(['mai-nullo', 'numero', 'semplifica'] as const);
	if (kase === 'mai-nullo') {
		const k = rng.next() < 0.5 ? rng.pick([1, 4, 9]) : rng.pick([2, 3, 5, 6, 7, 8]);
		const num = numerator(rng, [], 0.25);
		const nr = numText(num);
		const rk = Math.round(Math.sqrt(k));
		return {
			case: kase,
			terms: [{ num, den: poly(k, 0, 1) }],
			excluded: [],
			steps: [
				`\\text{Il quadrato } x^2 \\text{ non è mai negativo, quindi } x^2 + ${k} \\text{ vale almeno } ${k} \\text{ e non è mai zero.}`,
				`\\text{Non c'è niente da escludere, anche se la formula è una frazione.}`,
				'D = \\mathbb{R}',
			],
			wrong: [rk * rk === k ? [q(-rk), q(rk)] : [q(-k)], [q(-k)], [q(0)], nr ? [nr] : [q(k)], [q(k)], [q(-k), q(k)]],
		};
	}
	if (kase === 'numero') {
		const k = rng.int(2, 9);
		let num: Poly;
		if (rng.next() < 0.7) num = numerator(rng, [q(k), q(-k), q(0)], 0);
		else num = poly(nonZero(rng, -9, 9), rng.int(-5, 5), 1);
		const nr = numText(num);
		return {
			case: kase,
			terms: [{ num, den: poly(k) }],
			excluded: [],
			steps: [
				`\\text{Il denominatore è il numero } ${k}\\text{, che non vale mai zero: la formula è un polinomio diviso per } ${k}\\text{.}`,
				`\\text{Un numero al denominatore non esclude niente.}`,
				'D = \\mathbb{R}',
			],
			wrong: [nr ? [nr] : [q(-k)], [q(k)], [q(0)], [q(-k)], nr ? [nr.neg()] : [q(1)]],
		};
	}
	// A fraction that simplifies: (x^2 - a^2)/(x ∓ a) or (x^2 + m x)/x, (x^2 + m x)/(x + m).
	const w = rng.next();
	let num: Poly, den: Poly, r: Rational, other: Rational, factored: string, simplified: string;
	if (w < 0.5) {
		const a = rng.int(1, 7);
		const sgn = rng.pick([1, -1]);
		num = poly(-a * a, 0, 1);
		den = poly(-sgn * a, 1);
		r = q(sgn * a);
		other = r.neg();
		factored = `(x - ${a})(x + ${a})`;
		simplified = polyToLatex(poly(sgn * a, 1));
	} else {
		const m = nonZero(rng, -7, 7);
		num = poly(0, m, 1);
		factored = `x(${polyToLatex(poly(m, 1))})`;
		if (rng.next() < 0.5) {
			den = poly(0, 1);
			r = q(0);
			other = q(-m);
			simplified = polyToLatex(poly(m, 1));
		} else {
			den = poly(m, 1);
			r = q(-m);
			other = q(0);
			simplified = 'x';
		}
	}
	const d = polyToLatex(den);
	return {
		case: 'semplifica',
		terms: [{ num, den }],
		excluded: [r],
		steps: [
			`\\text{Il dominio si trova sulla formula di partenza, prima di semplificare: il denominatore } ${d} \\text{ si annulla per } x = ${r.toLatex()}\\text{.}`,
			`\\text{Il numeratore si scompone, } ${polyToLatex(num)} = ${factored}\\text{, e per } x \\neq ${r.toLatex()} \\text{ la frazione è uguale a } ${simplified}\\text{; ma in } x = ${r.toLatex()} \\text{ la formula di partenza dà } \\frac{0}{0}\\text{, che non esiste.}`,
			domainLatex([r]),
		],
		wrong: [[], [other], [r, other], [r.neg()], [q(0), r.neg()]],
	};
}

function domChoice(rng: Rng, b: DomBuilt): ChoiceAnswer {
	const cands = [...b.wrong];
	for (let d = 1; d < 8; d++) cands.push([b.excluded[0]?.add(q(d)) ?? q(d)], [q(-d)]);
	const ch = assembleChoice(rng, domOption(b.excluded), cands.map(domOption));
	if (!ch) throw new Error(`${ID}: domain level without enough distractors`);
	return ch;
}

// ---------------------------------------------------------------------------
// Params

const polyStr = (p: Poly) => p.slice(0, polyDegree(p) + 1).map(String);
const polyFrom = (xs: unknown): Poly => (xs as string[]).map((s) => Rational.parse(s));

function termsParams(ts: Term[]) {
	return ts.map((t) => ({ num: polyStr(t.num), den: polyStr(t.den) }));
}

function termsFrom(x: unknown): Term[] {
	return (x as { num: string[]; den: string[] }[]).map((t) => ({ num: polyFrom(t.num), den: polyFrom(t.den) }));
}

// ---------------------------------------------------------------------------
// Assemble

const DOMAIN_PROMPT = 'Trova il dominio della funzione.';

function assemble(rng: Rng, level: number): Sample {
	const base = { generatorId: ID, level, seed: rng.seed };
	switch (level) {
		case 1: {
			const b = buildMap(rng);
			const pre = preimagesOf(b, b.y);
			const answer: SetAnswer = { kind: 'set', values: pre.map(String), latex: andList(pre.map(String)) };
			return {
				...base,
				prompt: `Trova le controimmagini di ${b.y}.`,
				problem: mapProblem(b),
				solution: pre.length === 0 ? `${b.y} \\text{ non ha controimmagini}` : `\\text{Controimmagini di } ${b.y}\\text{: } ${andList(pre.map(String))}`,
				steps: mapSteps(b),
				answer,
				params: { A: b.A.map(String), B: b.B.map(String), map: b.map.map(String), y: String(b.y), display: b.display, case: b.case },
			};
		}
		case 2: {
			let f: ImgBuilt | null = null;
			while (!f) f = buildImg(rng);
			const g = f;
			const image = uniqSorted(g.A.map((x) => evalImg(g, x)));
			const answer: SetAnswer = { kind: 'set', values: image.map(String), latex: `f(A) = ${listSet(image)}` };
			return {
				...base,
				prompt: "Trova l'insieme immagine della funzione.",
				problem: imgProblem(f),
				solution: answer.latex,
				steps: imgSteps(f),
				answer,
				params: { family: f.family, b: String(f.b), c: String(f.c), k: String(f.k), A: f.A.map(String), cod: f.cod, B: f.B.map(String), case: f.family },
			};
		}
		case 3: {
			const f = buildLaw(rng);
			const params = { case: f.case, family: f.family, a: String(f.a), b: String(f.b), c: String(f.c), dom: f.dom, n: String(f.n) };
			if (f.case === 'immagine') {
				const v = f.a * f.n + f.b;
				const answer: NumberAnswer = { kind: 'number', value: String(v) };
				return { ...base, prompt: `Trova l'immagine di ${f.n}.`, problem: lawProblem(f), solution: `f(${f.n}) = ${v}`, steps: lawSteps(f), answer, params };
			}
			const pre = lawPreimages(f, f.n);
			const answer: SetAnswer = { kind: 'set', values: pre.map(String), latex: andList(pre.map((v) => v.toLatex())) };
			return {
				...base,
				prompt: `Trova le controimmagini di ${f.n}.`,
				problem: lawProblem(f),
				solution: pre.length === 0 ? `${f.n} \\text{ non ha controimmagini}` : `\\text{Controimmagini di } ${f.n}\\text{: } ${answer.latex}`,
				steps: lawSteps(f),
				answer,
				params,
			};
		}
		case 4:
		case 5:
		case 6: {
			const b = buildDomain(rng, level);
			const answer: SetAnswer = { kind: 'set', values: b.excluded.map(String), latex: domainLatex(b.excluded) };
			return {
				...base,
				prompt: DOMAIN_PROMPT,
				problem: `f(x) = ${formulaLatex(b.terms)}`,
				solution: answer.latex,
				steps: b.steps,
				answer,
				params: { case: b.case, terms: termsParams(b.terms), excluded: b.excluded.map(String), wrong: b.wrong.map((w) => sortRat(w).map(String)) },
			};
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Checks

const nums = (x: unknown): number[] => (Array.isArray(x) ? x.map(Number) : []);
const isSorted = (xs: number[]) => xs.every((v, i) => i === 0 || xs[i - 1] < v);
const sameValues = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i]);

function lawFrom(p: Record<string, unknown>): LawBuilt {
	return { case: p.case as LawBuilt['case'], family: p.family as LawBuilt['family'], a: Number(p.a), b: Number(p.b), c: Number(p.c), dom: p.dom as LawBuilt['dom'], n: Number(p.n) };
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	for (const { name, re } of FORBIDDEN_PATTERNS) if (re.test(sample.problem)) v.push(`problema contiene ${name}: ${sample.problem}`);
	if (sample.steps.length === 0) v.push('nessun passaggio');
	const ans = sample.answer;
	switch (sample.level) {
		case 1: {
			const A = nums(p.A),
				B = nums(p.B),
				map = nums(p.map),
				y = Number(p.y);
			if (A.length < 4 || A.length > 6 || !isSorted(A) || A.some((x) => x < -3 || x > 6)) v.push('A: da 4 a 6 interi distinti tra -3 e 6');
			if (B.length < 3 || B.length > 5 || !isSorted(B) || B.some((x) => x < 0 || x > 9)) v.push('B: da 3 a 5 interi distinti tra 0 e 9');
			if (map.length !== A.length || map.some((z) => !B.includes(z))) v.push('f non va da A a B');
			if (!B.includes(y)) v.push('y non sta nel codominio');
			const pre = preimagesOf({ A, map }, y);
			const kase = pre.length === 0 ? 'nessuna' : pre.length === 1 ? 'una' : 'piu';
			if (p.case !== kase) v.push(`params.case ${String(p.case)} ma le controimmagini sono ${pre.length}`);
			if (pre.length === A.length) v.push('tutti gli elementi hanno la stessa immagine');
			if (ans.kind !== 'set' || !sameValues(ans.values, pre.map(String))) v.push('risposta diversa dalle controimmagini');
			break;
		}
		case 2: {
			const f = { family: String(p.family), b: Number(p.b), c: Number(p.c), k: Number(p.k) };
			const A = nums(p.A),
				B = nums(p.B);
			if (A.length < 5 || A.length > 7 || !isSorted(A)) v.push('A: da 5 a 7 elementi ordinati');
			const image = uniqSorted(A.map((x) => evalImg(f, x)));
			if (image.length === A.length) v.push('nessun valore ripetuto');
			if (p.cod === 'B' && (image.some((z) => !B.includes(z)) || B.length === image.length)) v.push('B deve contenere l\'immagine e qualcosa in più');
			if (p.cod === 'N' && image.some((z) => z < 0)) v.push('valori negativi con codominio N');
			if (ans.kind !== 'set' || !sameValues(ans.values, image.map(String))) v.push("risposta diversa dall'insieme immagine");
			break;
		}
		case 3: {
			const f = lawFrom(p);
			if (f.family === 'lin' && (Math.abs(f.a) < 2 || Math.abs(f.a) > 5 || f.b === 0 || Math.abs(f.b) > 9)) v.push('ax + b con 2 ≤ |a| ≤ 5 e b ≠ 0');
			if (Math.abs(f.n) > 45) v.push('numero troppo grande');
			if (f.case === 'immagine') {
				if (ans.kind !== 'number' || ans.value !== String(f.a * f.n + f.b)) v.push("risposta diversa dall'immagine");
			} else {
				const pre = lawPreimages(f, f.n);
				if (ans.kind !== 'set' || !sameValues(ans.values, pre.map(String))) v.push('risposta diversa dalle controimmagini');
				const expect = f.case === 'lin-intera' ? pre.length === 1 && pre[0].isInteger() : f.case === 'lin-nessuna' ? pre.length === 0 && f.dom === 'Z' : f.case === 'lin-Q' ? pre.length === 1 && !pre[0].isInteger() && f.dom === 'Q' : f.family === 'sq';
				if (!expect) v.push(`caso ${f.case} non rispettato`);
			}
			break;
		}
		case 4:
		case 5:
		case 6: {
			const terms = termsFrom(p.terms);
			const excl = sortRat(terms.flatMap((t) => rationalRoots(t.den)));
			if (ans.kind !== 'set' || !sameValues(ans.values, excl.map(String))) v.push('risposta diversa dal dominio');
			for (const t of terms) {
				const dd = polyDegree(t.den);
				if (dd === 2) {
					const [c0, c1, c2] = t.den.map((c) => c.num);
					const disc = c1 * c1 - 4 * c0 * c2;
					if (disc > 0 && rationalRoots(t.den).length < 2) v.push('denominatore con zeri irrazionali');
				}
				if ([...t.num, ...t.den].some((c) => !c.isInteger() || Math.abs(c.num) > 81)) v.push('coefficienti non interi o troppo grandi');
			}
			const numZeros = terms.flatMap((t) => rationalRoots(t.num));
			const shared = numZeros.some((z) => excl.some((e) => e.equals(z)));
			const kase = p.case as DomCase;
			const allowed: Record<number, DomCase[]> = { 4: ['polinomio', 'intera', 'frazionaria'], 5: ['raccoglimento', 'quadrati', 'due-frazioni'], 6: ['mai-nullo', 'numero', 'semplifica'] };
			if (!allowed[sample.level].includes(kase)) v.push(`caso ${kase} fuori livello`);
			if (shared !== (kase === 'semplifica')) v.push(shared ? 'numeratore e denominatore hanno uno zero in comune' : 'la frazione deve semplificarsi');
			const dens = terms.map((t) => polyDegree(t.den));
			const ok: Record<DomCase, boolean> = {
				polinomio: dens.length === 1 && dens[0] === 0 && terms[0].den[0].isOne() && excl.length === 0,
				intera: dens.length === 1 && dens[0] === 1 && excl.length === 1 && excl[0].isInteger(),
				frazionaria: dens.length === 1 && dens[0] === 1 && excl.length === 1 && !excl[0].isInteger(),
				raccoglimento: dens.length === 1 && dens[0] === 2 && terms[0].den[0].isZero() && excl.length === 2,
				quadrati: dens.length === 1 && dens[0] === 2 && terms[0].den[1].isZero() && excl.length === 2,
				'due-frazioni': dens.length === 2 && dens.every((d) => d === 1) && excl.length === 2,
				'mai-nullo': dens.length === 1 && dens[0] === 2 && excl.length === 0,
				numero: dens.length === 1 && dens[0] === 0 && !terms[0].den[0].isOne() && excl.length === 0,
				semplifica: dens.length === 1 && dens[0] === 1 && excl.length === 1,
			};
			if (!ok[kase]) v.push(`la formula non è del caso ${kase}`);
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

// ---------------------------------------------------------------------------
// Multiple choice

export function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const p = sample.params;
	switch (sample.level) {
		case 1:
			return mapChoice(rng, { A: nums(p.A), B: nums(p.B), map: nums(p.map), y: Number(p.y), display: p.display as MapBuilt['display'], case: p.case as MapBuilt['case'] });
		case 2:
			return imgChoice(rng, { family: p.family as ImgBuilt['family'], b: Number(p.b), c: Number(p.c), k: Number(p.k), A: nums(p.A), cod: p.cod as ImgBuilt['cod'], B: nums(p.B) });
		case 3:
			return lawChoice(rng, lawFrom(p));
		default: {
			const excluded = (p.excluded as string[]).map((s) => Rational.parse(s));
			const wrong = (p.wrong as string[][]).map((w) => w.map((s) => Rational.parse(s)));
			return domChoice(rng, { case: p.case as DomCase, terms: termsFrom(p.terms), excluded, steps: [], wrong });
		}
	}
}

// ---------------------------------------------------------------------------

export const dominioCodominioImmagine: Generator = {
	id: ID,
	title: 'Dominio, codominio e immagine',
	levels: {
		1: { label: 'Controimmagini in una funzione data con frecce o tabella', constraints: ['A: 4-6 interi tra -3 e 6, B: 3-5 interi tra 0 e 9', 'nessuna, una, due o tre controimmagini, circa un terzo ciascuno'] },
		2: { label: "Insieme immagine su un dominio finito", constraints: ['|x + b|, x^2 + bx + c o il resto della divisione per 3, 4, 5', 'almeno un valore ripetuto; codominio ℤ, ℕ o un insieme finito B più grande'] },
		3: { label: 'Immagine e controimmagine con una legge su ℤ o ℚ', constraints: ['ax + b con 2 ≤ |a| ≤ 5, b ≠ 0; x^2 + c su ℤ', "la controimmagine in ℤ può non esistere"] },
		4: { label: 'Dominio naturale: polinomio o denominatore di primo grado', constraints: ['un quarto polinomi, gli altri (cx + d)/(ax + b) con zero intero o frazionario'] },
		5: { label: 'Dominio naturale: denominatore da scomporre o due frazioni', constraints: ['raccoglimento totale, differenza di quadrati, due frazioni con denominatori x - r'] },
		6: { label: 'Dominio naturale: i casi scomodi', constraints: ['x^2 + k al denominatore, un numero al denominatore, una frazione che si semplifica'] },
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

export default dominioCodominioImmagine;
