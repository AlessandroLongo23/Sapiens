/**
 * Quantificatori. Spec: specs/exercises/logica-quantificatori.md
 *
 * Seven levels in the order of the lesson (docs/lezioni/riscritte/67-logica-quantificatori.md):
 * open statements and propositions, the truth set in a finite universe, the truth of ∀ and ∃ (with
 * the counterexample), the same statement in ℕ, ℤ and ℚ, from words to symbols, negation, two
 * quantifiers. Level 2 answers with a set; every other level is a choice with four options.
 *
 * Conventions of the lesson: ∀x ∈ U, p(x) with the comma; ∃x ∈ U : p(x) with the colon; ¬ is not
 * written, the negated property is (x > 3 becomes x ≤ 3, "è pari" becomes "è dispari"); V_p is the
 * truth set; ℕ contains 0.
 *
 * A property is kept in params and in choice values as a key: "pari", "dispari", "mult|k",
 * "nmult|k", "div|n", or "cmp|c0,c1,c2|rel|d0,d1,d2" for c0 + c1·x + c2·x² rel d0 + d1·x + d2·x².
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import { assembleChoice, fitSetChoice, has, nearSets, norm, pickDistinct, range, setOption, setTex, shuffle } from '../insiemi';

export const ID = 'logica-quantificatori';

// ---------------------------------------------------------------------------
// Properties of x

export type Rel = '<' | '<=' | '=' | '>' | '>=' | '!=';
const REL_TEX: Record<Rel, string> = { '<': '<', '<=': '\\le', '=': '=', '>': '>', '>=': '\\ge', '!=': '\\ne' };
/** The opposite relation: the negation of the property. */
export const NEG: Record<Rel, Rel> = { '<': '>=', '<=': '>', '=': '!=', '>': '<=', '>=': '<', '!=': '=' };
/** The mistake of the lesson: > negated with < (and ≥ with ≤). */
const WRONG_NEG: Partial<Record<Rel, Rel>> = { '>': '<', '>=': '<=', '<': '>', '<=': '>=' };

export type Pred =
	| { t: 'pari' }
	| { t: 'dispari' }
	| { t: 'mult'; k: number }
	| { t: 'nmult'; k: number }
	| { t: 'div'; n: number }
	| { t: 'cmp'; l: number[]; rel: Rel; r: number[] };

const P = (l: number[], rel: Rel, r: number[]): Pred => ({ t: 'cmp', l: pad(l), rel, r: pad(r) });
const pad = (c: number[]): number[] => [c[0] ?? 0, c[1] ?? 0, c[2] ?? 0];

export function predKey(p: Pred): string {
	switch (p.t) {
		case 'pari':
		case 'dispari':
			return p.t;
		case 'mult':
		case 'nmult':
			return `${p.t}|${p.k}`;
		case 'div':
			return `div|${p.n}`;
		case 'cmp':
			return `cmp|${p.l.join(',')}|${p.rel}|${p.r.join(',')}`;
	}
}

export function predFromKey(key: string): Pred {
	const [t, a, rel, b] = key.split('|');
	if (t === 'pari' || t === 'dispari') return { t };
	if (t === 'mult' || t === 'nmult') return { t, k: Number(a) };
	if (t === 'div') return { t, n: Number(a) };
	if (t === 'cmp') return P(a.split(',').map(Number), rel as Rel, b.split(',').map(Number));
	throw new Error(`${ID}: bad property ${key}`);
}

/** c0 + c1·x + c2·x² written from the highest degree: `x^2 - 3x + 2`, `2x`, `0`. */
function polyTex(c: number[], v = 'x'): string {
	const out: string[] = [];
	for (let d = 2; d >= 0; d--) {
		const k = c[d];
		if (!k) continue;
		const abs = Math.abs(k);
		const mon = d === 0 ? String(abs) : `${abs === 1 ? '' : abs}${d === 1 ? v : `${v}^2`}`;
		out.push(out.length ? `${k < 0 ? '-' : '+'} ${mon}` : `${k < 0 ? '-' : ''}${mon}`);
	}
	return out.length ? out.join(' ') : '0';
}

/** The same polynomial with a number in place of x: `2 \cdot 3 + 1`, `(-2)^2`. */
function polySubTex(c: number[], a: number): string {
	const av = a < 0 ? `(${a})` : String(a);
	const out: string[] = [];
	for (let d = 2; d >= 0; d--) {
		const k = c[d];
		if (!k) continue;
		const abs = Math.abs(k);
		const pow = d === 2 ? `${av}^2` : av;
		const mon = d === 0 ? String(abs) : abs === 1 ? pow : `${abs} \\cdot ${pow}`;
		out.push(out.length ? `${k < 0 ? '-' : '+'} ${mon}` : `${k < 0 ? '-' : ''}${mon}`);
	}
	return out.length ? out.join(' ') : '0';
}

export function predTex(p: Pred, v = 'x'): string {
	switch (p.t) {
		case 'pari':
			return `${v} \\text{ è pari}`;
		case 'dispari':
			return `${v} \\text{ è dispari}`;
		case 'mult':
			return `${v} \\text{ è multiplo di } ${p.k}`;
		case 'nmult':
			return `${v} \\text{ non è multiplo di } ${p.k}`;
		case 'div':
			return `${v} \\text{ è un divisore di } ${p.n}`;
		case 'cmp':
			return `${polyTex(p.l, v)} ${REL_TEX[p.rel]} ${polyTex(p.r, v)}`;
	}
}

const polyAt = (c: number[], x: number): number => c[0] + c[1] * x + c[2] * x * x;
const relHolds = (a: number, rel: Rel, b: number): boolean =>
	rel === '<' ? a < b : rel === '<=' ? a <= b : rel === '=' ? a === b : rel === '>' ? a > b : rel === '>=' ? a >= b : a !== b;

export function holds(p: Pred, x: number): boolean {
	switch (p.t) {
		case 'pari':
			return x % 2 === 0;
		case 'dispari':
			return Math.abs(x % 2) === 1;
		case 'mult':
			return x % p.k === 0;
		case 'nmult':
			return x % p.k !== 0;
		case 'div':
			return x > 0 && p.n % x === 0;
		case 'cmp':
			return relHolds(polyAt(p.l, x), p.rel, polyAt(p.r, x));
	}
}

/** The negated property, written as the lesson writes it. */
function negPred(p: Pred): Pred {
	switch (p.t) {
		case 'pari':
			return { t: 'dispari' };
		case 'dispari':
			return { t: 'pari' };
		case 'mult':
			return { t: 'nmult', k: p.k };
		case 'nmult':
			return { t: 'mult', k: p.k };
		case 'cmp':
			return { ...p, rel: NEG[p.rel] };
		case 'div':
			throw new Error(`${ID}: no negation for div`);
	}
}

/** p(a) as a proposition: `2 \cdot 3 + 1 > 7`, `3 \text{ è pari}`. */
function predSubTex(p: Pred, a: number): string {
	if (p.t === 'cmp') return `${polySubTex(p.l, a)} ${REL_TEX[p.rel]} ${polySubTex(p.r, a)}`;
	return predTex(p, a < 0 ? `(${a})` : String(a));
}

/** p(a) with the two sides computed: `2 \cdot 3 + 1 = 7 \text{ e } 7 > 7 \text{ è falsa}`. */
function predCheckTex(p: Pred, a: number): string {
	const t = holds(p, a) ? 'vera' : 'falsa';
	if (p.t !== 'cmp') return `${predSubTex(p, a)}\\text{: ${t}}`;
	const l = polyAt(p.l, a),
		r = polyAt(p.r, a);
	return `${predSubTex(p, a)}\\text{, cioè } ${l} ${REL_TEX[p.rel]} ${r}\\text{: ${t}}`;
}

// ---------------------------------------------------------------------------
// Universes and quantified statements

export type Dom = 'N' | 'Z' | 'U';
const DOM_TEX: Record<Dom, string> = { N: '\\mathbb{N}', Z: '\\mathbb{Z}', U: 'U' };
export type Quant = 'A' | 'E';

export function stmtTex(q: Quant, d: Dom, p: Pred): string {
	return q === 'A' ? `\\forall x \\in ${DOM_TEX[d]},\\ ${predTex(p)}` : `\\exists x \\in ${DOM_TEX[d]} : ${predTex(p)}`;
}

/** The integers tried for ℕ and ℤ: the properties here have small coefficients, so ±200 decides. */
const WINDOW = 200;
function domain(d: 'N' | 'Z'): number[] {
	return d === 'N' ? range(0, WINDOW) : range(-WINDOW, WINDOW);
}
/** Integers by distance from 0: 0, 1, -1, 2, -2, … (the witness a student finds first). */
function byAbs(xs: number[]): number[] {
	return [...xs].sort((a, b) => Math.abs(a) - Math.abs(b) || b - a);
}

function truthOn(q: Quant, xs: number[], p: Pred): boolean {
	return q === 'A' ? xs.every((x) => holds(p, x)) : xs.some((x) => holds(p, x));
}

/** The element a student would name: a counterexample of a false ∀, an example of a true ∃. */
function witness(q: Quant, xs: number[], p: Pred): number | undefined {
	return byAbs(xs).find((x) => (q === 'A' ? !holds(p, x) : holds(p, x)));
}

// ---------------------------------------------------------------------------
// Italian sentences about numbers (levels 5 and 6)

/** A property in words, singular and plural, with its symbols and those of its negation. */
interface Words {
	key: string;
	sg: string;
	pl: string;
	nsg: string;
	pred: Pred;
}

function wordsOf(key: string): Words {
	const [t, a] = key.split('|');
	const k = Number(a);
	switch (t) {
		case 'pari':
			return { key, sg: 'è pari', pl: 'sono pari', nsg: 'non è pari', pred: { t: 'pari' } };
		case 'dispari':
			return { key, sg: 'è dispari', pl: 'sono dispari', nsg: 'non è dispari', pred: { t: 'dispari' } };
		case 'mult':
			return { key, sg: `è multiplo di ${k}`, pl: `sono multipli di ${k}`, nsg: `non è multiplo di ${k}`, pred: { t: 'mult', k } };
		case 'gt':
			return { key, sg: `è maggiore di ${k}`, pl: `sono maggiori di ${k}`, nsg: `non è maggiore di ${k}`, pred: P([0, 1], '>', [k]) };
		case 'lt':
			return { key, sg: `è minore di ${k}`, pl: `sono minori di ${k}`, nsg: `non è minore di ${k}`, pred: P([0, 1], '<', [k]) };
		case 'neg':
			return { key, sg: 'è negativo', pl: 'sono negativi', nsg: 'non è negativo', pred: P([0, 1], '<', [0]) };
	}
	throw new Error(`${ID}: bad words ${key}`);
}

function pickWords(rng: Rng, d: 'N' | 'Z'): Words {
	const u = rng.int(0, 5);
	if (u === 0) return wordsOf('pari');
	if (u === 1) return wordsOf('dispari');
	if (u === 2) return wordsOf(`mult|${rng.int(3, 9)}`);
	if (u === 3) return wordsOf(`gt|${rng.int(0, 12)}`);
	if (u === 4) return wordsOf(`lt|${rng.int(d === 'N' ? 1 : -5, 12)}`);
	return wordsOf('neg');
}

/**
 * The four logical forms of a sentence with one quantifier: ∀ p, ∃ p, ∀ ¬p ("nessuno"), ∃ ¬p ("non tutti").
 * Each has its phrasings; `phr` picks one.
 */
export type Form = 'Ap' | 'Ep' | 'An' | 'En';
const PHRASINGS: Record<Form, string[]> = {
	Ap: ['tutti', 'ogni'],
	Ep: ['qualche', 'almeno', 'esiste'],
	An: ['nessuno', 'nonesiste'],
	En: ['nontutti', 'almenonon', 'qualchenon'],
};

function sentence(phr: string, d: 'N' | 'Z', w: Words): string {
	const sg = d === 'N' ? 'numero naturale' : 'numero intero';
	const pl = d === 'N' ? 'numeri naturali' : 'numeri interi';
	switch (phr) {
		case 'tutti':
			return `Tutti i ${pl} ${w.pl}`;
		case 'ogni':
			return `Ogni ${sg} ${w.sg}`;
		case 'qualche':
			return `Qualche ${sg} ${w.sg}`;
		case 'almeno':
			return `Almeno un ${sg} ${w.sg}`;
		case 'esiste':
			return `Esiste un ${sg} che ${w.sg}`;
		case 'nessuno':
			return `Nessun ${sg} ${w.sg}`;
		case 'nonesiste':
			return `Non esiste un ${sg} che ${w.sg.replace(/^è /, 'sia ')}`;
		case 'nontutti':
			return `Non tutti i ${pl} ${w.pl}`;
		case 'almenonon':
			return `Almeno un ${sg} ${w.nsg}`;
		case 'qualchenon':
			return `Qualche ${sg} ${w.nsg}`;
	}
	throw new Error(`${ID}: bad phrasing ${phr}`);
}

const formQuant = (f: Form): Quant => f[0] as Quant;
const formPred = (f: Form, w: Words): Pred => (f[1] === 'p' ? w.pred : negPred(w.pred));
const NEG_FORM: Record<Form, Form> = { Ap: 'En', En: 'Ap', Ep: 'An', An: 'Ep' };

/** A sentence as an answer option: one line of text, or two lines of a gathered if it is long. */
function textOption(s: string): string {
	if (s.length <= 30) return `\\text{${s}}`;
	const words = s.split(' ');
	let best = 1,
		bestW = Infinity;
	for (let i = 1; i < words.length; i++) {
		const w = Math.max(words.slice(0, i).join(' ').length, words.slice(i).join(' ').length);
		if (w < bestW) {
			bestW = w;
			best = i;
		}
	}
	return `\\begin{gathered} \\text{${words.slice(0, best).join(' ')}} \\\\ \\text{${words.slice(best).join(' ')}} \\end{gathered}`;
}

// ---------------------------------------------------------------------------
// Level 4: the same statement in ℕ, ℤ and ℚ

/** Where a statement is true, as the options say it. ∃ can only gain universes going ℕ → ℤ → ℚ, ∀ can only lose them. */
const PATTERNS: Record<Quant, string[]> = { E: ['NZQ', 'ZQ', 'Q', 'none'], A: ['NZQ', 'NZ', 'N', 'none'] };
const PATTERN_TEX: Record<string, string> = {
	NZQ: '\\text{in } \\mathbb{N},\\ \\mathbb{Z} \\text{ e } \\mathbb{Q}',
	ZQ: '\\text{solo in } \\mathbb{Z} \\text{ e } \\mathbb{Q}',
	NZ: '\\text{solo in } \\mathbb{N} \\text{ e } \\mathbb{Z}',
	Q: '\\text{solo in } \\mathbb{Q}',
	N: '\\text{solo in } \\mathbb{N}',
	none: '\\text{in nessuno dei tre}',
};

/** Truth in ℚ, on the fractions n/d with d ≤ 12: the rational solutions here have denominator at most 5, and the intervals are long. */
function truthQ(q: Quant, p: Pred): boolean {
	if (p.t !== 'cmp') throw new Error(`${ID}: level 4 uses comparisons only`);
	const L = (x: number) => p.l[0] + p.l[1] * x + p.l[2] * x * x;
	const R = (x: number) => p.r[0] + p.r[1] * x + p.r[2] * x * x;
	const EPS = 1e-9;
	const ok = (x: number) => {
		const a = L(x),
			b = R(x);
		const eq = Math.abs(a - b) < EPS;
		return p.rel === '=' ? eq : p.rel === '!=' ? !eq : p.rel === '<' ? a < b - EPS : p.rel === '<=' ? a < b + EPS : p.rel === '>' ? a > b + EPS : a > b - EPS;
	};
	const xs: number[] = [];
	for (let d = 1; d <= 12; d++) for (let n = -30 * d; n <= 30 * d; n++) xs.push(n / d);
	return q === 'A' ? xs.every(ok) : xs.some(ok);
}

function patternOf(q: Quant, p: Pred): string {
	const n = truthOn(q, domain('N'), p),
		z = truthOn(q, domain('Z'), p),
		qq = truthQ(q, p);
	const s = `${n ? 'N' : ''}${z ? 'Z' : ''}${qq ? 'Q' : ''}`;
	return s || 'none';
}

function fracTex(n: number, d: number): string {
	const g = gcd(Math.abs(n), d);
	const [a, b] = [n / g, d / g];
	if (b === 1) return String(a);
	return a < 0 ? `-\\frac{${-a}}{${b}}` : `\\frac{${a}}{${b}}`;
}
function gcd(a: number, b: number): number {
	return b === 0 ? a : gcd(b, a % b);
}

interface L4 {
	q: Quant;
	pred: Pred;
	family: string;
	steps: string[];
}

function buildL4(rng: Rng): L4 {
	const q: Quant = rng.int(0, 1) ? 'E' : 'A';
	const want = rng.pick(PATTERNS[q]);
	const eq: Rel = q === 'E' ? '=' : '!=';
	const where = (x: string, n: boolean, z: boolean) =>
		`${x} ${n ? '\\in' : '\\notin'} \\mathbb{N},\\ ${x} ${z ? '\\in' : '\\notin'} \\mathbb{Z},\\ ${x} \\in \\mathbb{Q}`;
	// ax + b = c (or ≠): the solution decides
	const linear = (x0n: number, a: number): L4 => {
		const b = rng.int(-9, 9);
		const c = x0n + b; // a·x = x0n, x = x0n / a
		const pred = P([b, a], eq, [c]);
		const x0 = fracTex(x0n, a);
		const n = x0n % a === 0 && x0n / a >= 0,
			z = x0n % a === 0;
		const steps = [
			`${predTex(P([b, a], '=', [c]))} \\text{ ha una sola soluzione, } x = ${x0}`,
			where(x0, n, z),
			q === 'E'
				? `\\text{La proposizione è vera negli universi che contengono } ${x0}`
				: `\\text{Dove c'è } ${x0}\\text{, è un controesempio; negli altri universi la proposizione è vera}`,
		];
		return { q, pred, family: 'lineare', steps };
	};
	if (q === 'E') {
		if (want === 'NZQ') {
			if (rng.next() < 0.6) {
				const a = rng.int(1, 5);
				return linear(a * rng.int(0, 9), a);
			}
			const k = rng.int(1, 6);
			return {
				q,
				pred: P([0, 0, 1], '=', [k * k]),
				family: 'quadrato',
				steps: [`${k}^2 = ${k * k} \\text{ e } ${k} \\in \\mathbb{N}`, `\\text{Ogni naturale è anche intero e razionale: è vera in tutti e tre}`],
			};
		}
		if (want === 'ZQ') {
			if (rng.next() < 0.6) {
				const a = rng.int(1, 5);
				return linear(-a * rng.int(1, 9), a);
			}
			// x + b < c with c - b ≤ 0: no natural, the integer c - b - 1 works
			const t = rng.int(-6, 0);
			const b = rng.int(1, 9);
			return {
				q,
				pred: P([b, 1], '<', [t + b]),
				family: 'minore',
				steps: [
					`${polyTex([b, 1])} < ${t + b} \\text{ vuol dire } x < ${t}`,
					`\\text{Nessun naturale è minore di } ${t}\\text{, perché i naturali sono maggiori o uguali a } 0`,
					`x = ${t - 1} \\text{ va bene in } \\mathbb{Z} \\text{ e in } \\mathbb{Q}`,
				],
			};
		}
		if (want === 'Q') {
			const a = rng.int(2, 5);
			let n = 0;
			while (n === 0 || n % a === 0) n = rng.int(-9, 9);
			return linear(n, a);
		}
		// none: a square is never negative
		if (rng.next() < 0.5) {
			const k = rng.int(1, 9);
			return {
				q,
				pred: P([0, 0, 1], '=', [-k]),
				family: 'quadrato negativo',
				steps: [`\\text{Il quadrato di un numero è sempre maggiore o uguale a } 0\\text{, mai uguale a } -${k}`, `\\text{È falsa in tutti e tre gli universi}`],
			};
		}
		const a = rng.int(1, 9),
			c = rng.int(0, a);
		return {
			q,
			pred: P([a, 0, 1], '<', [c]),
			family: 'quadrato negativo',
			steps: [
				`${polyTex([a, 0, 1])} < ${c} \\text{ vuol dire } x^2 < ${c - a}`,
				`\\text{Un quadrato non è mai minore di } ${c - a}\\text{: è falsa in tutti e tre gli universi}`,
			],
		};
	}
	// ∀
	if (want === 'none') {
		const u = rng.next();
		if (u < 0.5) {
			const a = rng.int(1, 5);
			return linear(a * rng.int(0, 9), a);
		}
		if (u < 0.75) {
			const k = rng.int(0, 6);
			return {
				q,
				pred: P([0, 0, 1], '!=', [k * k]),
				family: 'quadrato',
				steps: [`x = ${k} \\text{ ha quadrato } ${k * k}\\text{, ed è naturale, intero e razionale}`, `${k} \\text{ è un controesempio in tutti e tre gli universi}`],
			};
		}
		const [pred, why] = rng.pick<[Pred, string]>([
			[P([0, 0, 1], '>', [0]), '0^2 = 0 \\text{ e } 0 > 0 \\text{ è falsa}'],
			[P([0, 2], '>', [0, 1]), '2 \\cdot 0 = 0 \\text{ e } 0 > 0 \\text{ è falsa}'],
		]);
		return { q, pred, family: 'zero', steps: [`x = 0 \\text{ è un controesempio: } ${why}`, `\\text{E } 0 \\text{ sta in } \\mathbb{N}\\text{, in } \\mathbb{Z} \\text{ e in } \\mathbb{Q}`] };
	}
	if (want === 'NZQ') {
		if (rng.next() < 0.5) {
			const k = rng.int(1, 9);
			return {
				q,
				pred: P([0, 0, 1], '!=', [-k]),
				family: 'quadrato negativo',
				steps: [`\\text{Il quadrato di un numero è sempre maggiore o uguale a } 0\\text{, quindi diverso da } -${k}`, `\\text{È vera in tutti e tre gli universi}`],
			};
		}
		const a = rng.int(1, 9),
			c = rng.int(0, a);
		return {
			q,
			pred: P([a, 0, 1], '>=', [c]),
			family: 'quadrato negativo',
			steps: [`${polyTex([a, 0, 1])} \\ge ${c} \\text{ vuol dire } x^2 \\ge ${c - a}`, `\\text{Ogni quadrato è maggiore o uguale a } 0\\text{: è vera in tutti e tre gli universi}`],
		};
	}
	if (want === 'NZ') {
		if (rng.next() < 0.6) {
			const a = rng.int(2, 5);
			let n = 0;
			while (n === 0 || n % a === 0) n = rng.int(-9, 9);
			return linear(n, a);
		}
		const [pred, steps] = rng.pick<[Pred, string[]]>([
			[
				P([0, 0, 1], '>=', [0, 1]),
				[
					`\\text{Per un intero } x \\le 0 \\text{ si ha } x^2 \\ge 0 \\ge x\\text{; per } x \\ge 1 \\text{ si ha } x^2 = x \\cdot x \\ge x`,
					`\\text{In } \\mathbb{Q} \\text{ invece } x = \\frac{1}{2} \\text{ dà } \\frac{1}{4} < \\frac{1}{2}\\text{: è un controesempio}`,
				],
			],
			[
				P([0, 1, 1], '>=', [0]),
				[
					`x^2 + x = x(x + 1) \\text{ è il prodotto di due interi consecutivi, mai negativo}`,
					`\\text{In } \\mathbb{Q} \\text{ invece } x = -\\frac{1}{2} \\text{ dà } \\frac{1}{4} - \\frac{1}{2} = -\\frac{1}{4}\\text{: è un controesempio}`,
				],
			],
		]);
		return { q, pred, family: 'quadrato e x', steps };
	}
	// N only
	if (rng.next() < 0.6) {
		const a = rng.int(1, 5);
		return linear(-a * rng.int(1, 9), a);
	}
	const t = rng.int(-5, 0);
	const b = rng.int(1, 9);
	return {
		q,
		pred: P([b, 1], '>=', [t + b]),
		family: 'maggiore',
		steps: [
			`${polyTex([b, 1])} \\ge ${t + b} \\text{ vuol dire } x \\ge ${t}`,
			`\\text{Ogni naturale è maggiore o uguale a } 0${t < 0 ? `\\text{, quindi anche a } ${t}` : ''}`,
			`\\text{In } \\mathbb{Z} \\text{ e in } \\mathbb{Q} \\text{ il numero } ${t - 1} \\text{ è un controesempio}`,
		],
	};
}

// ---------------------------------------------------------------------------
// Level 7: two quantifiers

export const REL2: Record<string, { tex: string; f: (x: number, y: number) => boolean }> = {
	succ: { tex: 'y = x + 1', f: (x, y) => y === x + 1 },
	prec: { tex: 'y = x - 1', f: (x, y) => y === x - 1 },
	gt: { tex: 'y > x', f: (x, y) => y > x },
	ge: { tex: 'y \\ge x', f: (x, y) => y >= x },
	lt: { tex: 'y < x', f: (x, y) => y < x },
	le: { tex: 'y \\le x', f: (x, y) => y <= x },
	opp: { tex: 'x + y = 0', f: (x, y) => x + y === 0 },
	dbl: { tex: 'y = 2x', f: (x, y) => y === 2 * x },
	half: { tex: 'x = 2y', f: (x, y) => x === 2 * y },
	zero: { tex: 'x + y = x', f: (x, y) => x + y === x },
	prod0: { tex: 'x \\cdot y = 0', f: (x, y) => x * y === 0 },
	one: { tex: 'x \\cdot y = x', f: (x, y) => x * y === x },
};

/** ∀x ∃y ("AE") or ∃y ∀x ("EA"). */
export function twoTex(order: 'AE' | 'EA', d: 'N' | 'Z', rel: string): string {
	const D = DOM_TEX[d];
	return order === 'AE' ? `\\forall x \\in ${D},\\ \\exists y \\in ${D} : ${REL2[rel].tex}` : `\\exists y \\in ${D} : \\forall x \\in ${D},\\ ${REL2[rel].tex}`;
}

/** Truth on nested windows: the witnesses are small (y within 2|x| + 1) and a failing x is found near y. */
function twoTruth(order: 'AE' | 'EA', d: 'N' | 'Z', rel: string): boolean {
	const f = REL2[rel].f;
	const win = (w: number) => (d === 'N' ? range(0, w) : range(-w, w));
	if (order === 'AE') return win(20).every((x) => win(62).some((y) => f(x, y)));
	return win(20).some((y) => win(62).every((x) => f(x, y)));
}

/** Why the statement is true or false, in the words of the lesson. */
function twoReason(order: 'AE' | 'EA', d: 'N' | 'Z', rel: string): string {
	const t = twoTruth(order, d, rel);
	const W: Record<string, string> = { succ: 'x + 1', prec: 'x - 1', gt: 'x + 1', ge: 'x', lt: 'x - 1', le: 'x', opp: '-x', dbl: '2x', zero: '0', prod0: '0', one: '1' };
	if (order === 'AE') {
		if (t) return `\\text{vera, dato } x \\text{, va bene } y = ${W[rel]}`;
		const why: Record<string, string> = {
			prec: '\\text{con } x = 0 \\text{ servirebbe } y = -1\\text{, che non è naturale}',
			lt: '\\text{con } x = 0 \\text{ nessun naturale è minore di } 0',
			opp: '\\text{con } x = 1 \\text{ servirebbe } y = -1\\text{, che non è naturale}',
			half: '\\text{con } x = 1 \\text{ servirebbe } y = \\frac{1}{2}',
		};
		return `\\text{falsa, }${why[rel]}`;
	}
	if (t) return `\\text{vera, } y = ${rel === 'le' ? '0' : W[rel]} \\text{ va bene per ogni } x`;
	const why: Record<string, string> = {
		succ: 'y \\text{ dovrebbe valere insieme } 0 + 1 = 1 \\text{ e } 1 + 1 = 2',
		prec: 'y \\text{ dovrebbe valere insieme } 1 - 1 = 0 \\text{ e } 2 - 1 = 1',
		gt: 'y \\text{ dovrebbe essere maggiore anche di sé stesso}',
		ge: 'y \\text{ dovrebbe essere maggiore o uguale anche a } y + 1',
		lt: 'y \\text{ dovrebbe essere minore anche di sé stesso}',
		le: 'y \\text{ dovrebbe essere minore o uguale anche a } y - 1',
		opp: '\\text{con } x = 0 \\text{ serve } y = 0\\text{, con } x = 1 \\text{ serve } y = -1',
		dbl: '\\text{con } x = 0 \\text{ serve } y = 0\\text{, con } x = 1 \\text{ serve } y = 2',
		half: '\\text{già con } x = 1 \\text{ nessun } y \\text{ va bene}',
	};
	return `\\text{falsa, }${why[rel]}`;
}

// ---------------------------------------------------------------------------
// Construction

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer | SetAnswer;
	params: Record<string, unknown>;
}

const strs = (xs: readonly number[]) => xs.map(String);
const numTex = (a: number) => String(a);

/** A random comparison or word property for levels 1 to 3 (none of them always true or never true on the range). */
function randomPred(rng: Rng, d: 'N' | 'Z' | 'U', lo: number, hi: number): Pred {
	const u = rng.int(0, 6);
	if (u === 0) return { t: rng.int(0, 1) ? 'pari' : 'dispari' };
	if (u === 1) return { t: 'mult', k: rng.int(3, 5) };
	if (u === 2 && d !== 'Z') return { t: 'div', n: rng.pick([12, 18, 20, 24, 30]) };
	if (u === 3) {
		// ax + b = c with its solution in range
		const a = rng.int(1, 3),
			x0 = rng.int(Math.max(lo, -6), Math.min(hi, 9)),
			b = rng.int(-5, 5);
		return P([b, a], '=', [a * x0 + b]);
	}
	if (u === 4 && d === 'Z') {
		const k = rng.int(1, 4);
		return P([0, 0, 1], rng.pick<Rel>(['=', '<', '>']), [k * k]);
	}
	// ax + b rel c, the edge inside the range
	const a = rng.int(1, 3),
		b = rng.int(-5, 5),
		t = rng.int(lo + 1, Math.min(hi - 1, lo + 10));
	const rel = rng.pick<Rel>(['<', '<=', '>', '>=']);
	return P([b, a], rel, [a * t + b]);
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1: {
			if (rng.next() < 0.7) {
				// p(a) for four values: one true, or one false
				const d: 'N' | 'Z' = rng.next() < 0.6 ? 'N' : 'Z';
				const [lo, hi] = d === 'N' ? [0, 12] : [-6, 6];
				const pred = randomPred(rng, d, lo, hi);
				const ask = rng.int(0, 1) ? 'vera' : 'falsa';
				const want = ask === 'vera';
				const xs = range(lo, hi);
				const good = xs.filter((x) => holds(pred, x) === want),
					bad = xs.filter((x) => holds(pred, x) !== want);
				if (!good.length || bad.length < 3) return null;
				const vals = [rng.pick(good), ...pickDistinct(rng, bad, 3)];
				const opt = (a: number): ChoiceOption => ({ latex: `p(${a})`, values: [String(a)] });
				const ch = assembleChoice(rng, opt(vals[0]), vals.slice(1).map(opt));
				if (!ch) return null;
				const shown = ch.options.map((o) => Number(o.values[0]));
				return {
					prompt: `Quale di queste proposizioni è ${ask}?`,
					problem: `U = ${DOM_TEX[d]} \\quad p(x): ${predTex(pred)}`,
					solution: `p(${vals[0]}) \\text{ è ${ask}}`,
					steps: [`\\text{Al posto di } x \\text{ si mette ogni valore, e } p(x) \\text{ diventa una proposizione}`, ...shown.map((a) => `p(${a})\\text{: } ${predCheckTex(pred, a)}`)],
					answer: ch,
					params: { variant: 'valore', ask, dom: d, pred: predKey(pred) },
				};
			}
			// which one is an open statement, or which one is a proposition
			const ask = rng.int(0, 1) ? 'aperto' : 'proposizione';
			const mk = (): Pred => {
				const a = rng.int(1, 3),
					b = rng.int(0, 6),
					t = rng.int(1, 6);
				return P([b, a], rng.pick<Rel>(['<', '>', '=', '>=', '<=']), [a * t + b]);
			};
			const base = mk();
			const v = rng.int(0, 6);
			const opt = (kind: string, p: Pred): ChoiceOption => {
				const latex = kind === 'aperto' ? predTex(p) : kind === 'valore' ? predSubTex(p, v) : kind === 'esiste' ? stmtTex('E', 'N', p) : stmtTex('A', 'N', p);
				return { latex, values: [kind, predKey(p), String(v)] };
			};
			let ch: ChoiceAnswer | null;
			if (ask === 'aperto') ch = assembleChoice(rng, opt('aperto', base), [opt('valore', base), opt('esiste', base), opt('perogni', base)]);
			else {
				const kind = rng.pick(['valore', 'esiste', 'perogni']);
				const others = [mk(), mk(), { t: rng.int(0, 1) ? 'pari' : 'dispari' } as Pred, mk()];
				ch = assembleChoice(rng, opt(kind, base), [opt('aperto', base), ...others.map((p) => opt('aperto', p))]);
			}
			if (!ch) return null;
			const why = (o: ChoiceOption) => {
				const k = o.values[0];
				if (k === 'aperto') return `${o.latex}\\text{: contiene } x \\text{ senza un valore e senza quantificatori, è un enunciato aperto}`;
				if (k === 'valore') return `${o.latex}\\text{: al posto di } x \\text{ c'è un numero, è una proposizione}`;
				return `${o.latex}\\text{: il quantificatore dice per quanti } x \\text{ deve valere, è una proposizione}`;
			};
			return {
				prompt: ask === 'aperto' ? 'Quale di queste è un enunciato aperto?' : 'Quale di queste è una proposizione?',
				problem: textBlock1(
					ask === 'aperto'
						? 'Un enunciato aperto contiene una variabile e non è né vero né falso finché non se ne sceglie il valore.'
						: 'Una proposizione è una frase che è vera oppure falsa.',
				),
				solution: ch.options[ch.correct].latex,
				steps: ch.options.map(why),
				answer: ch,
				params: { variant: 'enunciato', ask, value: String(v) },
			};
		}
		case 2: {
			// the truth set in a finite universe
			let U: number[], Utex: string, ushape: string;
			const us = rng.next();
			if (us < 0.35) {
				const n = rng.int(8, 12);
				U = range(1, n);
				Utex = `\\{1, 2, \\dots, ${n}\\}`;
				ushape = `1-${n}`;
			} else if (us < 0.55) {
				const n = rng.int(7, 10);
				U = range(0, n);
				Utex = `\\{0, 1, \\dots, ${n}\\}`;
				ushape = `0-${n}`;
			} else {
				U = norm(pickDistinct(rng, range(0, 20), rng.int(6, 8))) as number[];
				Utex = setTex(U);
				ushape = 'elenco';
			}
			const lo = U[0],
				hi = U[U.length - 1];
			const u = rng.next();
			const kind = u < 0.1 ? 'vuoto' : u < 0.2 ? 'tutto' : 'normale';
			let pred: Pred;
			const wrong: number[][] = [];
			if (kind === 'vuoto') {
				const c = rng.int(0, 2);
				if (c === 0) {
					const k = rng.int(3, 9),
						m = rng.int(1, k - 1);
					pred = P([k, 1], '=', [m]); // x + k = m, solution m - k < 0
					wrong.push([m - k]);
				} else if (c === 1) {
					const t = hi + rng.int(1, 5);
					pred = P([0, 1], '>', [t]);
					wrong.push([hi]);
				} else {
					const k = rng.int(1, 3);
					pred = P([0, 2 * k], '=', [2 * rng.int(1, 5) * k + k]); // 2kx = odd·k: x not integer
				}
				wrong.push(U);
			} else if (kind === 'tutto') {
				pred = rng.pick<Pred>([P([1, 1], '>', [0, 1]), P([0, 2], '>=', [0, 1]), P([0, 0, 1], '>=', [0]), P([0, 1], '>', [lo - rng.int(1, 3)])]);
				wrong.push([]);
				wrong.push(U.slice(1));
			} else {
				pred = randomPred(rng, 'U', lo, hi);
			}
			const V = U.filter((x) => holds(pred, x));
			const actual = V.length === 0 ? 'vuoto' : V.length === U.length ? 'tutto' : 'normale';
			if (actual !== kind) return null;
			if (kind === 'normale') {
				wrong.push(U.filter((x) => !holds(pred, x))); // the complement: the elements that make it false
				if (pred.t === 'cmp' && WRONG_NEG[pred.rel]) {
					const edge: Rel = { '<': '<=', '<=': '<', '>': '>=', '>=': '>' }[pred.rel as '<'] as Rel;
					wrong.push(U.filter((x) => holds({ ...pred, rel: edge } as Pred, x)));
				}
				if (pred.t === 'div') wrong.push(V.filter((x) => x !== 1), V.filter((x) => x !== pred.n));
				if (pred.t === 'mult' && has(V, 0)) wrong.push(V.filter((x) => x !== 0));
				if (pred.t === 'pari' && has(U, 0)) wrong.push(V.filter((x) => x !== 0));
				wrong.push(...(nearSets(rng, V, U) as number[][]));
				if (V.length < 2 && U.length - V.length < 2) return null;
			}
			const trueFor = V.length ? V.join(', ') : '';
			const falseFor = U.filter((x) => !holds(pred, x)).join(', ');
			const steps = [`\\text{Si prova ogni elemento di } U \\text{ al posto di } x`];
			if (kind === 'normale') steps.push(`p(x) \\text{ è vera per } ${trueFor} \\text{ e falsa per } ${falseFor}`);
			if (kind === 'vuoto') steps.push(`\\text{Nessun elemento di } U \\text{ rende vera } p(x)`);
			if (kind === 'tutto') steps.push(`\\text{Ogni elemento di } U \\text{ rende vera } p(x)\\text{: } V_p = U`);
			steps.push(`V_p = ${setTex(V)}`);
			return {
				prompt: "Trova l'insieme di verità di p(x) in U.",
				problem: `\\begin{array}{l} U = ${Utex} \\quad p(x): ${predTex(pred)} \\\\ V_p = \\ ? \\end{array}`,
				solution: `V_p = ${setTex(V)}`,
				steps,
				answer: { kind: 'set', values: strs(V), latex: `V_p = ${setTex(V)}` },
				params: { U: strs(U), ushape, pred: predKey(pred), case: kind, wrong: wrong.map(strs) },
			};
		}
		case 3: {
			if (rng.next() < 0.5) {
				// four statements on a small universe, one true (or one false)
				const U = norm(pickDistinct(rng, range(0, 12), rng.int(5, 7))) as number[];
				const ask = rng.int(0, 1) ? 'vera' : 'falsa';
				const want = ask === 'vera';
				const pool: [Quant, Pred][] = [];
				for (let i = 0; i < 14; i++) pool.push([rng.int(0, 1) ? 'A' : 'E', randomPred(rng, 'U', U[0], U[U.length - 1])]);
				const opt = ([q, p]: [Quant, Pred]): ChoiceOption => ({ latex: stmtTex(q, 'U', p), values: [q, predKey(p)] });
				const good = pool.filter(([q, p]) => truthOn(q, U, p) === want),
					bad = pool.filter(([q, p]) => truthOn(q, U, p) !== want);
				if (!good.length) return null;
				const ch = assembleChoice(rng, opt(good[0]), bad.map(opt));
				if (!ch) return null;
				const steps = ch.options.map((o) => {
					const q = o.values[0] as Quant,
						p = predFromKey(o.values[1]);
					const t = truthOn(q, U, p),
						w = witness(q, U, p);
					if (q === 'A') return t ? `${o.latex}\\text{: vera, ogni elemento di } U \\text{ la rende vera}` : `${o.latex}\\text{: falsa, } ${w} \\text{ è un controesempio}`;
					return t ? `${o.latex}\\text{: vera, per esempio con } x = ${w}` : `${o.latex}\\text{: falsa, nessun elemento di } U \\text{ la rende vera}`;
				});
				return {
					prompt: `Quale di queste proposizioni è ${ask}?`,
					problem: `U = ${setTex(U)}`,
					solution: ch.options[ch.correct].latex,
					steps,
					answer: ch,
					params: { variant: 'quale', ask, U: strs(U) },
				};
			}
			// a false ∀ and four numbers: which one is a counterexample
			const d: 'N' | 'Z' = rng.next() < 0.7 ? 'N' : 'Z';
			const [lo, hi] = d === 'N' ? [0, 12] : [-6, 6];
			const k = rng.int(1, 5);
			const fams: Pred[] =
				d === 'N'
					? [
							P([0, rng.int(2, 4)], '>', [0, 1]),
							P([0, 0, 1], '>', [0, 1]),
							P([k * k, 0, 1], '>', [0, 2 * k]),
							P([rng.int(0, 5), 1], '>', [rng.int(6, 9)]),
							{ t: rng.int(0, 1) ? 'pari' : 'dispari' },
							{ t: 'mult', k: rng.int(2, 3) },
						]
					: [P([0, 0, 1], '>', [0]), P([k * k, 0, 1], '>', [0, 2 * k]), P([0, 0, 1], '>', [0, 1]), P([0, 0, 1], '>=', [rng.int(2, 9)])];
			const pred = rng.pick(fams);
			const xs = range(lo, hi);
			const F = xs.filter((x) => !holds(pred, x)),
				T = xs.filter((x) => holds(pred, x));
			if (!F.length || T.length < 3) return null;
			// the counterexample the lesson warns about (0) is more likely when there is one
			const ce = has(F, 0) && rng.next() < 0.6 ? 0 : rng.pick(F);
			const others = pickDistinct(rng, T, 3);
			const opt = (a: number): ChoiceOption => ({ latex: numTex(a), values: [String(a)] });
			const ch = assembleChoice(rng, opt(ce), others.map(opt));
			if (!ch) return null;
			return {
				prompt: 'La proposizione è falsa. Quale di questi numeri è un controesempio?',
				problem: stmtTex('A', d, pred),
				solution: `x = ${ce}\\text{: } ${predCheckTex(pred, ce)}`,
				steps: [
					`\\text{Un controesempio è un valore di } x \\text{ che rende falsa la proprietà}`,
					...ch.options.map((o) => `x = ${o.values[0]}\\text{: } ${predCheckTex(pred, Number(o.values[0]))}`),
				],
				answer: ch,
				params: { variant: 'controesempio', dom: d, pred: predKey(pred) },
			};
		}
		case 4: {
			const b = buildL4(rng);
			const pattern = patternOf(b.q, b.pred);
			const options = PATTERNS[b.q].map((pt) => ({ latex: PATTERN_TEX[pt], values: [pt] }));
			const correct = PATTERNS[b.q].indexOf(pattern);
			if (correct < 0) return null;
			return {
				prompt: 'Per quali universi U, tra ℕ, ℤ e ℚ, la proposizione è vera?',
				problem: stmtTex(b.q, 'U', b.pred),
				solution: PATTERN_TEX[pattern],
				steps: b.steps,
				answer: { kind: 'choice', options, correct },
				params: { q: b.q, pred: predKey(b.pred), family: b.family, pattern },
			};
		}
		case 5: {
			const d: 'N' | 'Z' = rng.int(0, 1) ? 'N' : 'Z';
			const w = pickWords(rng, d);
			const forms: Form[] = ['Ap', 'Ep', 'An', 'En'];
			const form = rng.pick(forms);
			const q = formQuant(form),
				p = formPred(form, w);
			const truth = truthOn(q, domain(d), p);
			const wit = witness(q, domain(d), p);
			const truthStep =
				q === 'A'
					? truth
						? `\\text{La proposizione è vera}`
						: `\\text{La proposizione è falsa: } x = ${wit} \\text{ è un controesempio}`
					: truth
						? `\\text{La proposizione è vera: per esempio } x = ${wit}`
						: `\\text{La proposizione è falsa: nessun elemento va bene}`;
			const readQ: Record<Form, string> = {
				Ap: '\\text{“Tutti” e “ogni” diventano } \\forall',
				Ep: '\\text{“Qualche”, “almeno un” ed “esiste” diventano } \\exists',
				An: '\\text{“Nessuno” è un } \\forall \\text{ seguito da una negazione: per ogni } x \\text{ la proprietà è falsa}',
				En: '\\text{“Non tutti” vuol dire che almeno un elemento non ha la proprietà: } \\exists \\text{ con la negazione}',
			};
			if (rng.next() < 0.6) {
				// words → symbols
				const phr = rng.pick(PHRASINGS[form]);
				const s = sentence(phr, d, w);
				const opts = forms.map((f) => ({ latex: stmtTex(formQuant(f), d, formPred(f, w)), values: [f, d, w.key] }));
				const ch = assembleChoice(rng, opts[forms.indexOf(form)], opts.filter((_, i) => forms[i] !== form));
				if (!ch) return null;
				return {
					prompt: 'Quale scrittura in simboli dice la stessa cosa della frase?',
					problem: `\\text{“${s}”}`,
					solution: stmtTex(q, d, p),
					steps: [readQ[form], stmtTex(q, d, p), truthStep],
					answer: ch,
					params: { variant: 'simboli', form, phr, dom: d, words: w.key, truth: truth ? 'vera' : 'falsa' },
				};
			}
			// symbols → words
			const phrOf = (f: Form) => rng.pick(PHRASINGS[f]);
			const opts = forms.map((f) => {
				const phr = phrOf(f);
				return { latex: textOption(sentence(phr, d, w)), values: [f, d, w.key, phr] };
			});
			const ch = assembleChoice(rng, opts[forms.indexOf(form)], opts.filter((_, i) => forms[i] !== form));
			if (!ch) return null;
			const right = ch.options[ch.correct].values[3];
			return {
				prompt: 'Quale frase dice la stessa cosa della proposizione?',
				problem: stmtTex(q, d, p),
				solution: `\\text{“${sentence(right, d, w)}”}`,
				steps: [readQ[form], `\\text{“${sentence(right, d, w)}”}`, truthStep],
				answer: ch,
				params: { variant: 'parole', form, dom: d, words: w.key, truth: truth ? 'vera' : 'falsa' },
			};
		}
		case 6: {
			if (rng.next() < 0.6) {
				// negation in symbols, with an inequality
				const d: 'N' | 'Z' = rng.int(0, 1) ? 'N' : 'Z';
				const q: Quant = rng.int(0, 1) ? 'A' : 'E';
				const rel = rng.pick<Rel>(['>', '>=', '<', '<=']);
				// the two sides must be equal somewhere in the universe, or > and ≥ would say the same thing there
				// and the wrong negation (> for ≤) would be a correct one
				const edgeOk = (pp: Pred) => pp.t === 'cmp' && domain(d).some((x) => polyAt(pp.l, x) === polyAt(pp.r, x));
				let pred: Pred = P([0, 0, 1], rel, [0]);
				for (let k = 0; k < 100; k++) {
					const u = rng.int(0, 3);
					pred =
						u === 0
							? P([0, 0, 1], rel, [rng.int(0, 9)])
							: u === 1
								? P([rng.int(-5, 5), rng.int(1, 3)], rel, [rng.int(-5, 9)])
								: u === 2
									? P([0, rng.int(2, 4)], rel, [0, 1])
									: P([0, 0, 1], rel, [0, 1]);
					if (edgeOk(pred)) break;
				}
				const q2: Quant = q === 'A' ? 'E' : 'A';
				if (!edgeOk(pred)) return null;
				const opt = (qq: Quant, r: Rel, kind: string): ChoiceOption => ({ latex: stmtTex(qq, d, { ...pred, rel: r } as Pred), values: [qq, predKey({ ...pred, rel: r } as Pred), kind] });
				const cands = shuffle(rng, [opt(q, NEG[rel], 'quantificatore uguale'), opt(q2, WRONG_NEG[rel]!, 'segno opposto sbagliato'), opt(q2, rel, 'proprietà non negata'), opt(q, WRONG_NEG[rel]!, 'tutti e due sbagliati')]);
				const ch = assembleChoice(rng, opt(q2, NEG[rel], 'negazione'), cands.slice(0, 3));
				if (!ch) return null;
				const neg: Pred = { ...pred, rel: NEG[rel] } as Pred;
				const t = truthOn(q, domain(d), pred);
				const wOrig = witness(q, domain(d), pred),
					wNeg = witness(q2, domain(d), neg);
				const tStep = (qq: Quant, p: Pred, tt: boolean, w: number | undefined) =>
					qq === 'A'
						? tt
							? `${stmtTex(qq, d, p)} \\text{ è vera}`
							: `${stmtTex(qq, d, p)} \\text{ è falsa, con il controesempio } x = ${w}`
						: tt
							? `${stmtTex(qq, d, p)} \\text{ è vera, per esempio con } x = ${w}`
							: `${stmtTex(qq, d, p)} \\text{ è falsa}`;
				return {
					prompt: 'Qual è la negazione della proposizione?',
					problem: stmtTex(q, d, pred),
					solution: stmtTex(q2, d, neg),
					steps: [
						`\\text{La negazione scambia } \\forall \\text{ ed } \\exists \\text{ e nega la proprietà}`,
						`\\text{Il contrario di } ${predTex(pred)} \\text{ è } ${predTex(neg)}\\text{, non } ${predTex({ ...pred, rel: WRONG_NEG[rel]! } as Pred)}`,
						tStep(q, pred, t, wOrig),
						tStep(q2, neg, !t, wNeg),
					],
					answer: ch,
					params: { variant: 'simboli', q, dom: d, pred: predKey(pred), truth: t ? 'vera' : 'falsa' },
				};
			}
			// negation of a sentence in words
			const d: 'N' | 'Z' = rng.int(0, 1) ? 'N' : 'Z';
			const w = pickWords(rng, d);
			const form = rng.pick<Form>(['Ap', 'Ep', 'An', 'En']);
			const phr = rng.pick(PHRASINGS[form]);
			const s = sentence(phr, d, w);
			const target = NEG_FORM[form];
			const forms: Form[] = ['Ap', 'Ep', 'An', 'En'];
			const opts = forms.map((f) => {
				// the sentence itself is never an option: its own form comes with another phrasing when there is one
				const choices = PHRASINGS[f].filter((x) => x !== phr);
				const ph = choices.length ? rng.pick(choices) : null;
				return ph ? { latex: textOption(sentence(ph, d, w)), values: [f, d, w.key, ph] } : null;
			});
			const correct = opts[forms.indexOf(target)];
			if (!correct) return null;
			const ch = assembleChoice(rng, correct, opts.filter((_, i) => forms[i] !== target));
			if (!ch) return null;
			const q = formQuant(form),
				p = formPred(form, w);
			const t = truthOn(q, domain(d), p);
			const right = ch.options[ch.correct].values[3];
			const how: Record<Form, string> = {
				Ap: '\\text{Negare “tutti” vuol dire dire che almeno uno non ha la proprietà, non che nessuno ce l’ha}',
				En: '\\text{Negare “non tutti” vuol dire tornare a “tutti”}',
				Ep: '\\text{Negare “qualche” vuol dire dire che nessuno ha la proprietà}',
				An: '\\text{Negare “nessuno” vuol dire dire che almeno uno ha la proprietà}',
			};
			return {
				prompt: 'Qual è la negazione della frase?',
				problem: `\\text{“${s}”}`,
				solution: `\\text{“${sentence(right, d, w)}”}`,
				steps: [
					how[form],
					`\\text{In simboli: la negazione di } ${stmtTex(q, d, p)} \\text{ è } ${stmtTex(formQuant(target), d, formPred(target, w))}`,
					`\\text{La frase è ${t ? 'vera' : 'falsa'} e la sua negazione è ${t ? 'falsa' : 'vera'}}`,
				],
				answer: ch,
				params: { variant: 'parole', form, phr, dom: d, words: w.key, truth: t ? 'vera' : 'falsa' },
			};
		}
		case 7: {
			const d: 'N' | 'Z' = rng.int(0, 1) ? 'N' : 'Z';
			const ask = rng.int(0, 1) ? 'vera' : 'falsa';
			const want = ask === 'vera';
			const all: ['AE' | 'EA', string][] = [];
			for (const rel of Object.keys(REL2)) for (const o of ['AE', 'EA'] as const) all.push([o, rel]);
			// the trap first: one relation in both orders, true in one and false in the other
			const pairs = Object.keys(REL2).filter((r) => twoTruth('AE', d, r) !== twoTruth('EA', d, r));
			const trap = rng.pick(pairs);
			const good = shuffle(
				rng,
				all.filter(([o, r]) => twoTruth(o, d, r) === want),
			);
			const bad = shuffle(
				rng,
				all.filter(([o, r]) => twoTruth(o, d, r) !== want),
			);
			const trapRight = (['AE', 'EA'] as const).find((o) => twoTruth(o, d, trap) === want)!;
			const trapWrong = trapRight === 'AE' ? 'EA' : 'AE';
			const opt = ([o, r]: ['AE' | 'EA', string]): ChoiceOption => ({ latex: twoTex(o, d, r), values: [o, r] });
			const right: ['AE' | 'EA', string] = rng.next() < 0.5 ? [trapRight, trap] : good[0];
			const wrongs = [[trapWrong, trap] as ['AE' | 'EA', string], ...bad];
			const ch = assembleChoice(rng, opt(right), wrongs.map(opt));
			if (!ch) return null;
			return {
				prompt: `Quale di queste proposizioni è ${ask}?`,
				problem: `x, y \\in ${DOM_TEX[d]}`,
				solution: ch.options[ch.correct].latex,
				steps: [
					`\\text{Con } \\forall x\\ \\exists y \\text{ il valore di } y \\text{ può cambiare con } x\\text{; con } \\exists y\\ \\forall x \\text{ lo stesso } y \\text{ deve andare bene per tutti gli } x`,
					...ch.options.map((o) => `${o.latex}\\text{: }${twoReason(o.values[0] as 'AE' | 'EA', d, o.values[1])}`),
				],
				answer: ch,
				params: { ask, dom: d, trap },
			};
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

/** One line of prose (the page wraps it). */
function textBlock1(s: string): string {
	return `\\text{${s}}`;
}

// ---------------------------------------------------------------------------
// Check and choice

function check(sample: Sample): string[] {
	const v: string[] = [];
	const prm = sample.params as Record<string, unknown>;
	const p = {
		variant: String(prm.variant),
		ask: String(prm.ask),
		pred: String(prm.pred),
		q: String(prm.q) as Quant,
		dom: String(prm.dom) as 'N' | 'Z',
		form: String(prm.form) as Form,
		phr: String(prm.phr),
		words: String(prm.words),
		truth: String(prm.truth),
		U: ((prm.U ?? []) as string[]).map(Number),
	};
	const a = sample.answer;
	const oneRight = (ch: ChoiceAnswer, grade: (o: ChoiceOption) => boolean) => {
		const t = ch.options.map(grade);
		if (ch.options.length !== 4) v.push('servono 4 opzioni');
		if (t.filter(Boolean).length !== 1 || !t[ch.correct]) v.push('non c’è una sola opzione giusta');
		if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni uguali');
	};
	if (sample.level !== 2 && a.kind !== 'choice') return ['serve una scelta'];
	switch (sample.level) {
		case 1: {
			const ch = a as ChoiceAnswer;
			if (p.variant === 'valore') {
				const pred = predFromKey(p.pred);
				oneRight(ch, (o) => holds(pred, Number(o.values[0])) === (p.ask === 'vera'));
			} else oneRight(ch, (o) => (o.values[0] === 'aperto') === (p.ask === 'aperto'));
			break;
		}
		case 2: {
			if (a.kind !== 'set') return ['serve un insieme'];
			const U = p.U;
			const pred = predFromKey(p.pred);
			const V = U.filter((x) => holds(pred, x));
			if (a.values.join(',') !== V.join(',')) v.push('insieme di verità sbagliato');
			if (U.length < 6 || U.length > 12) v.push('U da 6 a 12 elementi');
			break;
		}
		case 3: {
			const ch = a as ChoiceAnswer;
			if (p.variant === 'quale') {
				const U = p.U;
				oneRight(ch, (o) => truthOn(o.values[0] as Quant, U, predFromKey(o.values[1])) === (p.ask === 'vera'));
			} else {
				const pred = predFromKey(p.pred);
				oneRight(ch, (o) => !holds(pred, Number(o.values[0])));
				if (truthOn('A', domain(p.dom), pred)) v.push('il per ogni è vero');
			}
			break;
		}
		case 4: {
			const ch = a as ChoiceAnswer;
			const pat = patternOf(p.q, predFromKey(p.pred));
			oneRight(ch, (o) => o.values[0] === pat);
			break;
		}
		case 5: {
			const ch = a as ChoiceAnswer;
			oneRight(ch, (o) => o.values[0] === p.form);
			const w = wordsOf(p.words);
			const t = truthOn(formQuant(p.form), domain(p.dom), formPred(p.form, w));
			if ((t ? 'vera' : 'falsa') !== p.truth) v.push('valore di verità sbagliato');
			break;
		}
		case 6: {
			const ch = a as ChoiceAnswer;
			if (p.variant === 'simboli') {
				const pred = predFromKey(p.pred) as Extract<Pred, { t: 'cmp' }>;
				const q2 = p.q === 'A' ? 'E' : 'A';
				oneRight(ch, (o) => o.values[0] === q2 && o.values[1] === predKey({ ...pred, rel: NEG[pred.rel] }));
				const d = p.dom;
				if (truthOn(p.q, domain(d), pred) === truthOn(q2, domain(d), { ...pred, rel: NEG[pred.rel] })) v.push('negazione con lo stesso valore di verità');
				if (!domain(d).some((x) => polyAt(pred.l, x) === polyAt(pred.r, x))) v.push('i due membri non sono mai uguali');
			} else {
				oneRight(ch, (o) => o.values[0] === NEG_FORM[p.form]);
				if (ch.options.some((o) => o.values[3] === p.phr)) v.push('la frase stessa è tra le opzioni');
			}
			break;
		}
		case 7: {
			const ch = a as ChoiceAnswer;
			oneRight(ch, (o) => twoTruth(o.values[0] as 'AE' | 'EA', p.dom, o.values[1]) === (p.ask === 'vera'));
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	const a = sample.answer;
	if (a.kind === 'choice') return a;
	if (a.kind !== 'set') throw new Error(`${ID}: no choice for ${a.kind}`);
	const truth = a.values.map(Number);
	const U = ((sample.params.U ?? []) as string[]).map(Number);
	const wrong = ((sample.params.wrong ?? []) as string[][]).map((w) => w.map(Number));
	const fallback = [...nearSets(rng, truth, U), ...truth.map((x) => truth.filter((y) => y !== x)), ...U.filter((x) => !truth.includes(x)).map((x) => norm([...truth, x]) as number[])];
	const ch = assembleChoice(rng, setOption(truth), [...wrong, ...shuffle(rng, fallback)].map(setOption));
	if (!ch) throw new Error(`${ID}: not enough distractors for seed ${sample.seed}`);
	return fitSetChoice(ch);
}

export const logicaQuantificatori: Generator = {
	id: ID,
	title: 'Quantificatori',
	levels: {
		1: { label: 'Enunciati aperti e proposizioni', constraints: ['p(a) vera o falsa per quattro valori, una sola giusta', 'quale è un enunciato aperto, quale è una proposizione'] },
		2: { label: 'Insieme di verità', constraints: ['U finito da 6 a 12 numeri', 'V_p vuoto circa 10%, uguale a U circa 10%'] },
		3: { label: 'Vero o falso con ∀ ed ∃, e il controesempio', constraints: ['quattro proposizioni su U finito, una sola vera o falsa', 'il controesempio di un ∀ falso in ℕ o ℤ, spesso lo 0'] },
		4: { label: 'Lo stesso enunciato in ℕ, ℤ, ℚ', constraints: ['le quattro combinazioni possibili di universi', 'equazioni di primo grado, quadrati, disuguaglianze'] },
		5: { label: 'Dalle parole ai simboli', constraints: ['tutti, ogni, qualche, almeno un, esiste, nessuno, non tutti', 'nei due versi'] },
		6: { label: 'Negare un quantificatore', constraints: ['in simboli con > che diventa ≤', 'a parole, tutti che non diventa nessuno'] },
		7: { label: 'Due quantificatori', constraints: ['∀x ∃y ed ∃y ∀x con la stessa relazione', 'in ℕ e in ℤ'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample: Sample = { generatorId: ID, level, seed: rng.seed, ...b };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default logicaQuantificatori;
