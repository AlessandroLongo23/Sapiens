/**
 * Relazioni binarie. Spec: specs/exercises/relazioni-binarie.md
 *
 * Six levels in the order of the lesson (docs/lezioni/riscritte/40-relazioni-binarie.md): the pairs of a
 * relation from A to B given by a property; membership of a pair, with swapped pairs and pairs outside
 * A × B; reading a double-entry table; from the pairs to the property; a relation in a set, with the
 * loops (x, x); the inverse relation, its pairs or its property, with the negation as a distractor.
 *
 * Every relation is a finite set of pairs of small integers, computed from a property code: `div`
 * (a divides b), `mult`, `lt`, `gt`, `le`, `ge`, `double` (b = 2a), `half` (a = 2b), `sq` (b = a^2),
 * `sum:k` (a + b = k), `plus:k` (b = a + k), `minus:k` (a = b + k), `even` (a + b even), and `not-<code>`
 * for the negation. Pairs travel in params and choice values as "a:b".
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import { assembleChoice, pickDistinct, shuffle } from '../insiemi';

export const ID = 'relazioni-binarie';

type Pair = [number, number];

// ---------------------------------------------------------------------------
// Properties

function split(code: string): { name: string; k: number } {
	const [name, k] = code.split(':');
	return { name, k: Number(k ?? 0) };
}

export function holds(code: string, a: number, b: number): boolean {
	if (code.startsWith('not-')) return !holds(code.slice(4), a, b);
	const { name, k } = split(code);
	switch (name) {
		case 'div':
			return a !== 0 && b % a === 0;
		case 'mult':
			return b !== 0 && a % b === 0;
		case 'lt':
			return a < b;
		case 'gt':
			return a > b;
		case 'le':
			return a <= b;
		case 'ge':
			return a >= b;
		case 'double':
			return b === 2 * a;
		case 'half':
			return a === 2 * b;
		case 'sq':
			return b === a * a;
		case 'sum':
			return a + b === k;
		case 'plus':
			return b === a + k;
		case 'minus':
			return a === b + k;
		case 'even':
			return (a + b) % 2 === 0;
		default:
			throw new Error(`${ID}: unknown property ${code}`);
	}
}

const CONVERSE: Record<string, string> = { div: 'mult', mult: 'div', lt: 'gt', gt: 'lt', le: 'ge', ge: 'le', double: 'half', half: 'double', sum: 'sum', even: 'even', plus: 'minus', minus: 'plus' };

/** The property of the inverse relation, written with the variables in the same order. */
export function converse(code: string): string {
	if (code.startsWith('not-')) return `not-${converse(code.slice(4))}`;
	const { name, k } = split(code);
	if (!CONVERSE[name]) throw new Error(`${ID}: no converse for ${code}`);
	return ['sum', 'plus', 'minus'].includes(name) ? `${CONVERSE[name]}:${k}` : CONVERSE[name];
}

/** The property as a formula in u and v (a and b, or x and y), or in words for level 6. */
export function propTex(code: string, u: string, v: string): string {
	if (code.startsWith('not-')) {
		const { name } = split(code.slice(4));
		const words: Record<string, string> = { div: 'un divisore di', mult: 'un multiplo di', lt: 'minore di', gt: 'maggiore di', half: 'il doppio di', double: 'la metà di' };
		if (!words[name]) throw new Error(`${ID}: no words for ${code}`);
		return `${u} \\text{ non è ${words[name]} } ${v}`;
	}
	const { name, k } = split(code);
	switch (name) {
		case 'div':
			return `${u} \\text{ è un divisore di } ${v}`;
		case 'mult':
			return `${u} \\text{ è un multiplo di } ${v}`;
		case 'lt':
			return `${u} < ${v}`;
		case 'gt':
			return `${u} > ${v}`;
		case 'le':
			return `${u} \\le ${v}`;
		case 'ge':
			return `${u} \\ge ${v}`;
		case 'double':
			return `${v} = 2${u}`;
		case 'half':
			return `${u} = 2${v}`;
		case 'sq':
			return `${v} = ${u}^2`;
		case 'sum':
			return `${u} + ${v} = ${k}`;
		case 'plus':
			return `${v} = ${u} + ${k}`;
		case 'minus':
			return `${u} = ${v} + ${k}`;
		case 'even':
			return `${u} + ${v} \\text{ è pari}`;
		default:
			throw new Error(`${ID}: unknown property ${code}`);
	}
}

/** The level 6 properties in words: "x è minore di y", "x è il doppio di y". */
export function propWords(code: string, u: string, v: string): string {
	if (code.startsWith('not-')) return propTex(code, u, v);
	const words: Record<string, string> = { div: 'un divisore di', mult: 'un multiplo di', lt: 'minore di', gt: 'maggiore di', half: 'il doppio di', double: 'la metà di' };
	if (!words[code]) throw new Error(`${ID}: no words for ${code}`);
	return `${u} \\text{ è ${words[code]} } ${v}`;
}

/** Why the property holds or not for (a, b), as a true formula: "2 \text{ divide } 6", "3 + 4 = 7 \neq 6". */
function detail(code: string, a: number, b: number): string {
	const ok = holds(code, a, b);
	const { name, k } = split(code);
	switch (name) {
		case 'div':
			return `${a} \\text{ ${ok ? 'divide' : 'non divide'} } ${b}`;
		case 'mult':
			return `${b} \\text{ ${ok ? 'divide' : 'non divide'} } ${a}`;
		case 'lt':
			return ok ? `${a} < ${b}` : `${a} \\ge ${b}`;
		case 'gt':
			return ok ? `${a} > ${b}` : `${a} \\le ${b}`;
		case 'le':
			return ok ? `${a} \\le ${b}` : `${a} > ${b}`;
		case 'ge':
			return ok ? `${a} \\ge ${b}` : `${a} < ${b}`;
		case 'double':
			return `2 \\cdot ${a} = ${2 * a}${ok ? '' : ` \\neq ${b}`}`;
		case 'half':
			return `2 \\cdot ${b} = ${2 * b}${ok ? '' : ` \\neq ${a}`}`;
		case 'sq':
			return `${a}^2 = ${a * a}${ok ? '' : ` \\neq ${b}`}`;
		case 'sum':
			return `${a} + ${b} = ${a + b}${ok ? '' : ` \\neq ${k}`}`;
		case 'plus':
			return `${a} + ${k} = ${a + k}${ok ? '' : ` \\neq ${b}`}`;
		case 'minus':
			return `${b} + ${k} = ${b + k}${ok ? '' : ` \\neq ${a}`}`;
		case 'even':
			return `${a} + ${b} = ${a + b}\\text{, che è ${ok ? 'pari' : 'dispari'}}`;
		default:
			throw new Error(`${ID}: unknown property ${code}`);
	}
}

// ---------------------------------------------------------------------------
// Pairs and their LaTeX

const sortNum = (xs: number[]) => [...new Set(xs)].sort((a, b) => a - b);
const sortPairs = (ps: Pair[]): Pair[] => [...ps].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
const pairKey = (p: Pair) => `${p[0]}:${p[1]}`;
const keys = (ps: Pair[]) => sortPairs(ps).map(pairKey);
const sameRel = (p: Pair[], q: Pair[]) => keys(p).join(',') === keys(q).join(',');
const hasPair = (ps: Pair[], p: Pair) => ps.some((q) => q[0] === p[0] && q[1] === p[1]);
const swap = (ps: Pair[]): Pair[] => sortPairs(ps.map(([a, b]) => [b, a] as Pair));
const product = (A: number[], B: number[]): Pair[] => A.flatMap((a) => B.map((b) => [a, b] as Pair));
const minus = (ps: Pair[], qs: Pair[]): Pair[] => ps.filter((p) => !hasPair(qs, p));

export function relation(code: string, A: number[], B: number[]): Pair[] {
	return product(A, B).filter(([a, b]) => holds(code, a, b));
}

const pairTex = (p: Pair) => `(${p[0]}, ${p[1]})`;
/** "\{2,\ 3,\ 5\}", as in the lesson. */
const setTex = (xs: number[]) => (xs.length ? `\\{${sortNum(xs).join(',\\ ')}\\}` : '\\emptyset');
/** The pairs on one line: "\{(2, 4),\ (2, 6)\}". */
const relTex = (ps: Pair[]) => (ps.length ? `\\{${sortPairs(ps).map(pairTex).join(',\\ ')}\\}` : '\\emptyset');

/** Line sizes for n pairs, at most `per` a line, the longer lines first. */
function chunks<T>(xs: T[], per: number): T[][] {
	const lines = Math.max(1, Math.ceil(xs.length / per));
	const out: T[][] = [];
	let at = 0;
	for (let i = 0; i < lines; i++) {
		const n = Math.ceil((xs.length - at) / (lines - i));
		out.push(xs.slice(at, at + n));
		at += n;
	}
	return out;
}

/**
 * Most pairs on a line of the problem (350 px at 18 px) and of an answer button (252 px at 16 px). Four pairs
 * of one-digit numbers measure about 230 px at 16 px, four with a two-digit number up to 257 px: an option
 * with a two-digit number keeps three pairs a line.
 */
const PROBLEM_PER_LINE = 3;
const optionPerLine = (ps: Pair[]) => (ps.some(([a, b]) => a > 9 || b > 9) ? 3 : 4);

/** An answer option with a set of pairs: one line up to four pairs, then lines of up to four with \Big braces. */
function pairsOption(ps: Pair[]): ChoiceOption {
	const s = sortPairs(ps);
	const values = s.map(pairKey);
	const per = optionPerLine(s);
	if (s.length <= per) return { latex: relTex(s), values };
	const lines = chunks(s, per).map((l) => l.map(pairTex).join(',\\ '));
	return { latex: `\\begin{gathered} \\Big\\{${lines.join(', \\\\ ')}\\Big\\} \\end{gathered}`, values };
}

/** "\mathcal{R} = \{...\}" in the problem, on lines of three pairs as in the lesson. */
function relLine(name: string, ps: Pair[]): string {
	const s = sortPairs(ps);
	if (s.length <= PROBLEM_PER_LINE) return `${name} = ${relTex(s)}`;
	const lines = chunks(s, PROBLEM_PER_LINE).map((l) => l.map(pairTex).join(',\\ '));
	return `\\begin{gathered} ${name} = \\{${lines.join(', \\\\ ')}\\} \\end{gathered}`;
}

const setOption = (xs: number[]): ChoiceOption => ({ latex: setTex(xs), values: sortNum(xs).map(String) });

const R = '\\mathcal{R}';
const RINV = '\\mathcal{R}^{-1}';
const relDef = (code: string, u: string, v: string) => `${u} \\mathrel{${R}} ${v} \\iff ${propTex(code, u, v)}`;
const setsLine = (A: number[], B: number[]) => `A = ${setTex(A)},\\quad B = ${setTex(B)}`;

/** "2", "2 e 3", "2, 3 e 5" in math. */
function andList(xs: (number | string)[]): string {
	const s = xs.map(String);
	if (s.length === 1) return s[0];
	return `${s.slice(0, -1).join(',\\ ')} \\text{ e } ${s[s.length - 1]}`;
}

const WORDS = ['nessuna', 'una', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici'];
const nCoppie = (n: number) => (n === 1 ? 'una' : `${WORDS[n] ?? n}`);

function sortedPick(rng: Rng, lo: number, hi: number, k: number): number[] {
	return sortNum(pickDistinct(rng, Array.from({ length: hi - lo + 1 }, (_, i) => lo + i), k));
}

// ---------------------------------------------------------------------------
// A relation from A to B given by a property (levels 1, 2, 4)

interface Built {
	code: string;
	A: number[];
	B: number[];
	rel: Pair[];
}

/** Sets and property chosen so the relation has between `min` and `max` pairs and is not all of A × B. */
function buildAB(rng: Rng, name: string, min: number, max: number): Built | null {
	let code = name;
	let A: number[], B: number[];
	const nA = rng.int(3, 4), nB = rng.int(3, 4);
	switch (name) {
		case 'div':
			A = sortedPick(rng, 2, 7, nA);
			B = sortedPick(rng, 4, 12, nB);
			break;
		case 'sum':
			code = `sum:${rng.int(5, 10)}`;
			A = sortedPick(rng, 1, 6, nA);
			B = sortedPick(rng, 1, 8, nB);
			break;
		case 'double':
			A = sortedPick(rng, 1, 6, nA);
			B = sortedPick(rng, 1, 12, nB);
			break;
		case 'lt':
		case 'gt':
			A = sortedPick(rng, 1, 7, nA);
			B = sortedPick(rng, 1, 7, nB);
			break;
		case 'plus':
			code = `plus:${rng.int(1, 4)}`;
			A = sortedPick(rng, 1, 6, nA);
			B = sortedPick(rng, 2, 9, nB);
			break;
		case 'sq':
			A = sortedPick(rng, 1, 3, 3);
			B = sortNum([...A.map((a) => a * a).filter(() => rng.next() < 0.85), ...pickDistinct(rng, [2, 3, 5, 6, 7, 8], rng.int(1, 2))]).slice(0, 4);
			break;
		default:
			throw new Error(`${ID}: no builder for ${name}`);
	}
	const rel = relation(code, A, B);
	if (rel.length < min || rel.length > max || rel.length === A.length * B.length) return null;
	return { code, A, B, rel };
}

// ---------------------------------------------------------------------------
// Level 1: from the property to the pairs

function level1(rng: Rng, base: Pick<Sample, 'generatorId' | 'level' | 'seed'>, prop: string): Sample | null {
	const b = buildAB(rng, prop, 2, 6);
	if (!b) return null;
	const { code, A, B, rel } = b;
	const others = minus(product(A, B), rel);
	// Near misses: a = b for a < b (the "≤" mistake), otherwise any pair of A × B outside the relation.
	const near = code === 'lt' ? others.filter(([x, y]) => x === y) : [];
	const extra = shuffle(rng, near).concat(shuffle(rng, others.filter((p) => !hasPair(near, p))));
	const dropped = shuffle(rng, rel);
	const choice = assembleChoice(rng, pairsOption(rel), [
		pairsOption(swap(rel)),
		...(extra.length ? [pairsOption([...rel, extra[0]])] : []),
		...(rel.length > 1 ? [pairsOption(rel.filter((p) => p !== dropped[0]))] : []),
		...(rel.length > 1 && extra.length ? [pairsOption([...rel.filter((p) => p !== dropped[0]), extra[0]])] : []),
		...(extra.length > 1 ? [pairsOption([...rel, extra[1]])] : []),
		...(rel.length > 2 ? [pairsOption(rel.filter((p) => p !== dropped[1]))] : []),
	]);
	if (!choice) return null;
	const { name, k } = split(code);
	const steps = [`\\text{Per ogni } a \\in A \\text{ cerca i } b \\in B \\text{ per cui } ${propTex(code, 'a', 'b')}\\text{.}`];
	for (const a of A) {
		const bs = B.filter((y) => holds(code, a, y));
		if (['sum', 'double', 'plus'].includes(name)) {
			const t = name === 'sum' ? k - a : name === 'double' ? 2 * a : a + k;
			const expr = name === 'sum' ? `${k} - ${a}` : name === 'double' ? `2 \\cdot ${a}` : `${a} + ${k}`;
			steps.push(`a = ${a}\\text{: serve } b = ${expr} = ${t}\\text{, che ${B.includes(t) ? 'sta' : 'non sta'} in } B${B.includes(t) ? `\\text{: la coppia } (${a}, ${t})` : ''}`);
		} else if (bs.length) {
			steps.push(`a = ${a}\\text{: la proprietà vale per } b = ${andList(bs)}`);
		} else {
			steps.push(`a = ${a}\\text{: la proprietà non vale per nessun } b \\in B\\text{, e } ${a} \\text{ non compare in nessuna coppia}`);
		}
	}
	steps.push(`\\text{Le coppie sono ${nCoppie(rel.length)} su } ${A.length} \\cdot ${B.length} = ${A.length * B.length}\\text{, sempre con l'elemento di } A \\text{ al primo posto: } ${R} = ${relTex(rel)}`);
	return {
		...base,
		prompt: "Scrivi l'elenco delle coppie della relazione da A a B.",
		problem: `\\begin{gathered} ${setsLine(A, B)} \\\\ ${relDef(code, 'a', 'b')} \\end{gathered}`,
		solution: `${R} = ${relTex(rel)}`,
		steps,
		answer: choice,
		params: { A: A.map(String), B: B.map(String), code, pairs: keys(rel) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: which statement is true

type Stmt = { op: 'in' | 'notin'; form: 'pair' | 'rel'; p: Pair };

const stmtTex = (s: Stmt): string =>
	s.form === 'pair'
		? `${pairTex(s.p)} ${s.op === 'in' ? '\\in' : '\\notin'} ${R}`
		: `${s.p[0]} \\mathrel{${s.op === 'in' ? R : `\\not${R}`}} ${s.p[1]}`;

function stmtTrue(s: Stmt, A: number[], B: number[], code: string): boolean {
	const inR = A.includes(s.p[0]) && B.includes(s.p[1]) && holds(code, s.p[0], s.p[1]);
	return s.op === 'in' ? inR : !inR;
}

/** Why (a, b) is or is not in R. */
function pairReason(p: Pair, A: number[], B: number[], code: string): string {
	const [a, b] = p;
	if (!A.includes(a)) return `${a} \\notin A\\text{: la coppia } ${pairTex(p)} \\text{ non sta in } A \\times B\\text{, quindi nemmeno in } ${R}`;
	if (!B.includes(b)) return `${b} \\notin B\\text{: la coppia } ${pairTex(p)} \\text{ non sta in } A \\times B\\text{, quindi nemmeno in } ${R}`;
	return holds(code, a, b)
		? `${a} \\in A\\text{, } ${b} \\in B \\text{ e } ${detail(code, a, b)}\\text{: } ${pairTex(p)} \\in ${R}`
		: `${a} \\in A \\text{ e } ${b} \\in B\\text{, ma } ${detail(code, a, b)}\\text{: } ${pairTex(p)} \\notin ${R}`;
}

/** Pairs outside A × B for which the property holds, one element taken from its own set. */
function outsidePairs(code: string, A: number[], B: number[]): Pair[] {
	const out: Pair[] = [];
	for (let a = 1; a <= 12; a++)
		for (let b = 1; b <= 12; b++) {
			const inA = A.includes(a), inB = B.includes(b);
			if (inA !== inB && holds(code, a, b)) out.push([a, b]);
		}
	return out;
}

function level2(rng: Rng, base: Pick<Sample, 'generatorId' | 'level' | 'seed'>, kind: string, prop: string): Sample | null {
	const b = buildAB(rng, prop, 2, 6);
	if (!b) return null;
	const { code, A, B, rel } = b;
	const swapped = swap(rel).filter((p) => !hasPair(rel, p));
	const inAB = minus(product(A, B), rel);
	const outside = outsidePairs(code, A, B).filter((p) => !hasPair(swapped, p));
	if (!swapped.length || !inAB.length || !outside.length) return null;
	const form = (): 'pair' | 'rel' => (rng.next() < 0.5 ? 'pair' : 'rel');
	let correct: Stmt;
	let wrong: Stmt[];
	const pSw = rng.pick(swapped), pIn = rng.pick(inAB), pOut = rng.pick(outside), pR = rng.pick(rel);
	if (kind === 'vera-appartiene') {
		correct = { op: 'in', form: form(), p: pR };
		// Always the two traps of the lesson (a swapped pair, a pair outside A × B), then one more.
		const third: Stmt = rng.next() < 0.5 ? { op: 'in', form: form(), p: pIn } : { op: 'notin', form: form(), p: rng.pick(rel.filter((p) => p !== pR)) };
		wrong = [{ op: 'in', form: form(), p: pSw }, { op: 'in', form: form(), p: pOut }, third];
	} else {
		const trap = rng.pick(['swap', 'out'] as const);
		correct = { op: 'notin', form: form(), p: trap === 'swap' ? pSw : pOut };
		const pool: Stmt[] = [
			{ op: 'in', form: form(), p: trap === 'swap' ? pOut : pSw },
			{ op: 'in', form: form(), p: pIn },
			{ op: 'notin', form: form(), p: pR },
		];
		wrong = pool;
	}
	const opt = (s: Stmt): ChoiceOption => ({ latex: stmtTex(s), values: [s.op, s.form, pairKey(s.p)] });
	const choice = assembleChoice(rng, opt(correct), wrong.map(opt));
	if (!choice) return null;
	const all = [correct, ...wrong];
	if (new Set(all.map((s) => pairKey(s.p))).size !== 4) return null;
	const steps = [
		`\\text{Una coppia sta in } ${R} \\text{ se il primo elemento sta in } A\\text{, il secondo in } B \\text{ e la proprietà vale; } a \\mathrel{${R}} b \\text{ vuol dire } (a, b) \\in ${R}\\text{.}`,
		...choice.options.map((o) => {
			const s = all.find((t) => opt(t).latex === o.latex)!;
			return `${pairReason(s.p, A, B, code)}\\text{, quindi } ${stmtTex(s)} \\text{ è ${stmtTrue(s, A, B, code) ? 'vera' : 'falsa'}.}`;
		}),
	];
	return {
		...base,
		prompt: 'Quale affermazione è vera?',
		problem: `\\begin{gathered} ${setsLine(A, B)} \\\\ ${relDef(code, 'a', 'b')} \\end{gathered}`,
		solution: stmtTex(correct),
		steps,
		answer: choice,
		params: { A: A.map(String), B: B.map(String), code, pairs: keys(rel), case: kind },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the double-entry table

function tableTex(A: number[], B: number[], rel: Pair[]): string {
	const head = `a \\backslash b & ${B.join(' & ')}`;
	const rows = A.map((a) => `${a} & ${B.map((b) => (hasPair(rel, [a, b]) ? '\\bullet' : '')).join(' & ')}`);
	return `\\begin{array}{c|${'c'.repeat(B.length)}} ${head} \\\\ \\hline ${rows.join(' \\\\ ')} \\end{array}`;
}

const TABLE_PROMPT = 'La tabella rappresenta una relazione da A a B.';

function level3(rng: Rng, base: Pick<Sample, 'generatorId' | 'level' | 'seed'>, kind: string): Sample | null {
	const A = sortedPick(rng, 1, 9, rng.int(3, 4));
	const B = sortedPick(rng, 1, 12, rng.int(3, 4));
	const cells = product(A, B);
	const rel = sortPairs(cells.filter(() => rng.next() < 0.4));
	if (rel.length < 3 || rel.length > 7) return null;
	const emptyRows = A.filter((a) => !rel.some((p) => p[0] === a));
	const emptyCols = B.filter((b) => !rel.some((p) => p[1] === b));
	const problem = `\\begin{gathered} ${setsLine(A, B)} \\\\ ${tableTex(A, B, rel)} \\end{gathered}`;
	const params = { A: A.map(String), B: B.map(String), pairs: keys(rel), case: kind };
	const rowSteps = A.map((a) => {
		const bs = B.filter((b) => hasPair(rel, [a, b]));
		return bs.length ? `\\text{Riga di } ${a}\\text{: } ${bs.map((b) => pairTex([a, b])).join(',\\ ')}` : `\\text{Riga di } ${a}\\text{: vuota, nessuna coppia}`;
	});
	if (kind === 'elenco') {
		const comp = minus(cells, rel);
		const dropped = rng.pick(rel);
		const choice = assembleChoice(rng, pairsOption(rel), [
			pairsOption(swap(rel)),
			...(comp.length >= 1 && comp.length <= 9 ? [pairsOption(comp)] : []),
			pairsOption(rel.filter((p) => p !== dropped)),
			...(comp.length ? [pairsOption([...rel, rng.pick(comp)])] : []),
		]);
		if (!choice) return null;
		return {
			...base,
			prompt: `${TABLE_PROMPT} Scrivi l'elenco delle coppie.`,
			problem,
			solution: `${R} = ${relTex(rel)}`,
			steps: [
				`\\text{Ogni casella segnata è una coppia: la riga dà il primo elemento, la colonna il secondo.}`,
				...rowSteps,
				`\\text{Le caselle segnate sono } ${rel.length}\\text{: } ${R} = ${relTex(rel)}`,
			],
			answer: choice,
			params,
		};
	}
	const rows = kind === 'senza-corrispondenti';
	const truth = rows ? emptyRows : emptyCols;
	if (!truth.length || truth.length === (rows ? A : B).length) return null;
	const answer: SetAnswer = { kind: 'set', values: truth.map(String), latex: setTex(truth) };
	const colSteps = B.map((b) => {
		const as = A.filter((a) => hasPair(rel, [a, b]));
		return as.length ? `\\text{Colonna di } ${b}\\text{: segnata nelle righe di } ${andList(as)}` : `\\text{Colonna di } ${b}\\text{: vuota}`;
	});
	return {
		...base,
		prompt: rows ? `${TABLE_PROMPT} Quali elementi di A non hanno corrispondenti?` : `${TABLE_PROMPT} Quali elementi di B non sono corrispondenti di nessun elemento?`,
		problem,
		solution: answer.latex,
		steps: rows
			? [`\\text{Un elemento di } A \\text{ senza corrispondenti ha la riga vuota.}`, ...rowSteps, `\\text{Le righe vuote sono quelle di } ${andList(truth)}\\text{: } ${setTex(truth)}`]
			: [`\\text{Un elemento di } B \\text{ che non è corrispondente di nessuno ha la colonna vuota.}`, ...colSteps, `\\text{Le colonne vuote sono quelle di } ${andList(truth)}\\text{: } ${setTex(truth)}`],
		answer,
		params: { ...params, emptyRows: emptyRows.map(String), emptyCols: emptyCols.map(String) },
	};
}

function level3Choice(sample: Sample, rng: Rng): ChoiceAnswer {
	const p = sample.params;
	const A = (p.A as string[]).map(Number), B = (p.B as string[]).map(Number);
	const rows = p.case === 'senza-corrispondenti';
	const emptyRows = (p.emptyRows as string[]).map(Number), emptyCols = (p.emptyCols as string[]).map(Number);
	const own = rows ? A : B;
	const truth = rows ? emptyRows : emptyCols;
	const other = rows ? emptyCols : emptyRows;
	const rest = own.filter((x) => !truth.includes(x));
	const cands: number[][] = [];
	if (other.length) cands.push(other); // rows and columns swapped
	cands.push(rest); // the elements that do have corrispondenti
	for (const x of shuffle(rng, rest)) cands.push([...truth, x]);
	if (truth.length > 1) for (const x of shuffle(rng, truth)) cands.push(truth.filter((y) => y !== x));
	if (other.length) cands.push(sortNum([...truth, ...other]));
	for (const x of shuffle(rng, rows ? B : A)) cands.push([x]);
	const ch = assembleChoice(rng, setOption(truth), cands.filter((c) => c.length).map(setOption));
	if (!ch) throw new Error(`${ID}: level 3 choice, seed ${sample.seed}`);
	return ch;
}

// ---------------------------------------------------------------------------
// Level 4: from the pairs to the property

const DISTRACTOR_CODES = ['div', 'mult', 'lt', 'gt', 'le', 'ge', 'double', 'half', 'sq', 'even'];

function level4(rng: Rng, base: Pick<Sample, 'generatorId' | 'level' | 'seed'>, prop: string): Sample | null {
	const b = buildAB(rng, prop, 3, 5);
	if (!b) return null;
	const { code, A, B, rel } = b;
	const { name, k } = split(code);
	const pool = [...DISTRACTOR_CODES];
	for (let s = 3; s <= 16; s++) pool.push(`sum:${s}`);
	for (let s = 1; s <= 6; s++) pool.push(`plus:${s}`, `minus:${s}`);
	const cands = pool.filter((c) => c !== code).map((c) => ({ c, r: relation(c, A, B) }));
	const differs = cands.filter((x) => !sameRel(x.r, rel));
	const superset = differs.filter((x) => rel.every((p) => hasPair(x.r, p)));
	const conv = name === 'sum' || name === 'sq' ? [] : differs.filter((x) => x.c === converse(code));
	const near = name === 'sum' || name === 'plus' ? differs.filter((x) => x.c === `${name}:${k + 1}` || x.c === `${name}:${k - 1}`) : [];
	const partial = differs.filter((x) => x.r.some((p) => hasPair(rel, p)));
	const ordered = [...shuffle(rng, superset).slice(0, 1), ...conv, ...shuffle(rng, near).slice(0, 1), ...shuffle(rng, partial), ...shuffle(rng, differs)];
	const chosen: { c: string; r: Pair[] }[] = [];
	for (const x of ordered) {
		if (chosen.length === 3) break;
		if (chosen.some((y) => y.c === x.c || sameRel(y.r, x.r))) continue;
		chosen.push(x);
	}
	if (chosen.length < 3) return null;
	const opt = (c: string): ChoiceOption => ({ latex: propTex(c, 'a', 'b'), values: [c] });
	const choice = assembleChoice(rng, opt(code), chosen.map((x) => opt(x.c)));
	if (!choice) return null;
	const steps = [
		`\\text{La proprietà giusta vale per tutte le coppie di } ${R} \\text{ e per nessun'altra coppia di } A \\times B\\text{.}`,
		`${propTex(code, 'a', 'b')}\\text{: } ${rel.map((p) => detail(code, p[0], p[1])).join(',\\ ')}\\text{, e non vale per le altre coppie di } A \\times B\\text{.}`,
		...chosen.map((x) => {
			const missed = rel.find((p) => !hasPair(x.r, p));
			const added = x.r.find((p) => !hasPair(rel, p));
			return missed
				? `${propTex(x.c, 'a', 'b')}\\text{: non vale per } ${pairTex(missed)}\\text{, che sta in } ${R} \\text{ (} ${detail(x.c, missed[0], missed[1])}\\text{).}`
				: `${propTex(x.c, 'a', 'b')}\\text{: vale anche per } ${pairTex(added!)}\\text{, che non sta in } ${R} \\text{ (} ${detail(x.c, added![0], added![1])}\\text{).}`;
		}),
	];
	return {
		...base,
		prompt: 'Quale proprietà descrive la relazione da A a B?',
		problem: `\\begin{gathered} ${setsLine(A, B)} \\\\ ${relLine(R, rel)} \\end{gathered}`,
		solution: `a \\mathrel{${R}} b \\iff ${propTex(code, 'a', 'b')}`,
		steps,
		answer: choice,
		params: { A: A.map(String), B: B.map(String), code, pairs: keys(rel), distractors: chosen.map((x) => x.c) },
	};
}

// ---------------------------------------------------------------------------
// Level 5: a relation in a set, with the loops

function level5(rng: Rng, base: Pick<Sample, 'generatorId' | 'level' | 'seed'>, name: string): Sample | null {
	const code = name === 'sum' ? `sum:${rng.int(5, 10)}` : name;
	const n = rng.int(3, 5);
	const A = name === 'div' ? sortedPick(rng, 1, 9, n) : sortedPick(rng, 1, 7, n);
	const rel = relation(code, A, A);
	const loops = rel.filter(([x, y]) => x === y);
	const allLoops: Pair[] = A.map((x) => [x, x]);
	if (rel.length < 3 || rel.length > 8) return null;
	if (['div', 'le', 'even'].includes(name) && rel.length === loops.length) return null;
	const inv = swap(rel);
	const withLoops = sortPairs([...rel, ...allLoops.filter((p) => !hasPair(rel, p))]);
	const nonLoops = rel.filter(([x, y]) => x !== y);
	const others = minus(product(A, A), rel);
	const cands: Pair[][] = [];
	if (loops.length) cands.push(nonLoops);
	if (withLoops.length !== rel.length && withLoops.length <= 10) cands.push(withLoops);
	cands.push(inv);
	for (const p of shuffle(rng, nonLoops)) cands.push(rel.filter((q) => q !== p));
	for (const p of shuffle(rng, others)) cands.push([...rel, p]);
	const choice = assembleChoice(rng, pairsOption(rel), cands.filter((c) => c.length > 0 && c.length <= 10).map(pairsOption));
	if (!choice) return null;
	const steps = [`\\text{La relazione è in } A\\text{: per ogni } x \\in A \\text{ cerca gli } y \\in A \\text{ per cui } ${propTex(code, 'x', 'y')}\\text{, compreso } x \\text{ stesso.}`];
	for (const x of A) {
		const ys = A.filter((y) => holds(code, x, y));
		steps.push(ys.length ? `x = ${x}\\text{: } y = ${andList(ys)}` : `x = ${x}\\text{: nessun } y`);
	}
	steps.push(
		loops.length
			? `\\text{Le coppie con lo stesso elemento ai due posti sono i cappi, e fanno parte della relazione: } ${loops.map(pairTex).join(',\\ ')}`
			: `\\text{Nessuna coppia ha lo stesso elemento ai due posti: la relazione non ha cappi.}`,
	);
	steps.push(`\\text{Le coppie sono ${nCoppie(rel.length)}: } ${R} = ${relTex(rel)}`);
	return {
		...base,
		prompt: "Scrivi l'elenco delle coppie della relazione in A.",
		problem: `\\begin{gathered} A = ${setTex(A)} \\\\ ${relDef(code, 'x', 'y')} \\end{gathered}`,
		solution: `${R} = ${relTex(rel)}`,
		steps,
		answer: choice,
		params: { A: A.map(String), code, pairs: keys(rel), loops: loops.length },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the inverse relation

function level6(rng: Rng, base: Pick<Sample, 'generatorId' | 'level' | 'seed'>, kind: string, code: string): Sample | null {
	if (kind === 'coppie') {
		const A = sortedPick(rng, 1, 9, 3);
		const B = sortedPick(rng, 1, 12, rng.int(3, 4));
		const cells = product(A, B);
		const rel = sortPairs(cells.filter(() => rng.next() < 0.4));
		const comp = minus(cells, rel);
		if (rel.length < 2 || rel.length > 5 || comp.length > 8) return null;
		const inv = swap(rel);
		const choice = assembleChoice(rng, pairsOption(inv), [pairsOption(rel), pairsOption(swap(comp)), pairsOption(comp)]);
		if (!choice) return null;
		return {
			...base,
			prompt: "Scrivi l'elenco delle coppie della relazione inversa, da B ad A.",
			problem: `\\begin{gathered} ${setsLine(A, B)} \\\\ ${relLine(R, rel)} \\end{gathered}`,
			solution: `${RINV} = ${relTex(inv)}`,
			steps: [
				`\\text{L'inversa va da } B \\text{ ad } A \\text{ e ha le coppie di } ${R} \\text{ con i due elementi scambiati.}`,
				`${sortPairs(rel)
					.map((p) => `${pairTex(p)} \\to ${pairTex([p[1], p[0]])}`)
					.join(',\\ ')}`,
				`\\text{Ha lo stesso numero di coppie di } ${R}\\text{, ${WORDS[rel.length]}: } ${RINV} = ${relTex(inv)}`,
				`\\text{Le ${WORDS[comp.length] ?? comp.length} coppie di } A \\times B \\text{ che non stanno in } ${R} \\text{ formano la negazione, non l'inversa.}`,
			],
			answer: choice,
			params: { A: A.map(String), B: B.map(String), pairs: keys(rel), case: kind },
		};
	}
	const A = code === 'double' || code === 'half' ? sortedPick(rng, 1, 12, rng.int(5, 6)) : sortedPick(rng, 1, 9, rng.int(4, 5));
	const rel = relation(code, A, A);
	if (rel.length < 2) return null;
	const inv = converse(code);
	const opts = [inv, code, `not-${code}`, `not-${inv}`];
	const rels = opts.map((c) => keys(relation(c, A, A)).join(','));
	if (new Set(rels).size !== 4) return null;
	const opt = (c: string): ChoiceOption => ({ latex: propWords(c, 'x', 'y'), values: [c] });
	const choice = assembleChoice(rng, opt(inv), opts.slice(1).map(opt));
	if (!choice) return null;
	const ex = rng.pick(rel.some(([x, y]) => x !== y) ? rel.filter(([x, y]) => x !== y) : rel);
	const comp = A.length * A.length - rel.length;
	return {
		...base,
		prompt: 'Quale proprietà descrive la relazione inversa?',
		problem: `\\begin{gathered} A = ${setTex(A)} \\\\ x \\mathrel{${R}} y \\iff ${propWords(code, 'x', 'y')} \\end{gathered}`,
		solution: `x \\mathrel{${RINV}} y \\iff ${propWords(inv, 'x', 'y')}`,
		steps: [
			`\\text{L'inversa scambia i due elementi di ogni coppia: } x \\mathrel{${RINV}} y \\iff y \\mathrel{${R}} x\\text{.}`,
			`y \\mathrel{${R}} x \\iff ${propWords(code, 'y', 'x')}\\text{, cioè } ${propWords(inv, 'x', 'y')}`,
			`\\text{Per esempio } ${pairTex(ex)} \\in ${R}\\text{, quindi } ${pairTex([ex[1], ex[0]])} \\in ${RINV}\\text{: } ${propWords(inv, String(ex[1]), String(ex[0]))}\\text{.}`,
			`\\text{La negazione } ${propWords(`not-${code}`, 'x', 'y')} \\text{ prende invece le coppie che non stanno in } ${R}\\text{: sono } ${A.length} \\cdot ${A.length} - ${rel.length} = ${comp}\\text{, mentre l'inversa ne ha } ${rel.length}\\text{, come } ${R}\\text{.}`,
		],
		answer: choice,
		params: { A: A.map(String), code, pairs: keys(rel), case: kind },
	};
}

// ---------------------------------------------------------------------------
// Checks

const nums = (x: unknown): number[] => (Array.isArray(x) ? x.map(Number) : []);
const isSorted = (xs: number[]) => xs.every((v, i) => i === 0 || xs[i - 1] < v);
const optionPairs = (o: ChoiceOption): Pair[] => o.values.map((v) => v.split(':').map(Number) as Pair);

function checkPairsChoice(ch: ChoiceAnswer, truth: Pair[], v: string[]): void {
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	const ks = ch.options.map((o) => keys(optionPairs(o)).join(','));
	if (new Set(ks).size !== ks.length) v.push('opzioni uguali');
	if (ks[ch.correct] !== keys(truth).join(',')) v.push("l'opzione giusta non è la relazione");
	if (ks.filter((k) => k === keys(truth).join(',')).length !== 1) v.push('più opzioni uguali alla risposta');
	for (const o of ch.options) {
		if (o.values.length === 0 || o.values.length > 10) v.push(`opzione con ${o.values.length} coppie`);
		const shown = [...o.latex.matchAll(/\((\d+), (\d+)\)/g)].map((m) => `${m[1]}:${m[2]}`);
		if (shown.join(',') !== keys(optionPairs(o)).join(',')) v.push(`opzione ${o.latex} diversa dai suoi valori`);
	}
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const A = nums(p.A), B = p.B ? nums(p.B) : A;
	const given = ((p.pairs as string[]) ?? []).map((s) => s.split(':').map(Number) as Pair);
	if (!isSorted(A) || !isSorted(B)) v.push('insiemi non ordinati');
	if ([...A, ...B].some((x) => !Number.isInteger(x) || x < 1 || x > 12)) v.push('elementi tra 1 e 12');
	if (sample.steps.length === 0) v.push('nessun passaggio');
	const ans = sample.answer;
	const code = p.code as string | undefined;
	switch (sample.level) {
		case 1:
		case 4: {
			const rel = relation(code!, A, B);
			if (!sameRel(rel, given)) v.push('params.pairs diverso dalla relazione');
			if (A.length < 3 || A.length > 4 || B.length < 3 || B.length > 4) v.push('A e B con 3-4 elementi');
			if (ans.kind !== 'choice') return [...v, 'risposta non a scelta multipla'];
			if (sample.level === 1) {
				if (rel.length < 2 || rel.length > 6) v.push('da 2 a 6 coppie');
				checkPairsChoice(ans, rel, v);
			} else {
				if (rel.length < 3 || rel.length > 5) v.push('da 3 a 5 coppie');
				const rs = ans.options.map((o) => relation(o.values[0], A, B));
				const right = rs.map((r) => sameRel(r, rel));
				if (right.filter(Boolean).length !== 1 || !right[ans.correct]) v.push('non esattamente una proprietà giusta');
				if (new Set(rs.map((r) => keys(r).join(','))).size !== 4) v.push('due proprietà con le stesse coppie');
			}
			break;
		}
		case 2: {
			const rel = relation(code!, A, B);
			if (!sameRel(rel, given)) v.push('params.pairs diverso dalla relazione');
			if (ans.kind !== 'choice' || ans.options.length !== 4) return [...v, 'servono quattro affermazioni'];
			const truths = ans.options.map((o) => stmtTrue({ op: o.values[0] as Stmt['op'], form: o.values[1] as Stmt['form'], p: o.values[2].split(':').map(Number) as Pair }, A, B, code!));
			if (truths.filter(Boolean).length !== 1 || !truths[ans.correct]) v.push('non esattamente una affermazione vera');
			const kind = ans.options[ans.correct].values[0] === 'in' ? 'vera-appartiene' : 'vera-non-appartiene';
			if (p.case !== kind) v.push('params.case sbagliato');
			break;
		}
		case 3: {
			if (given.some(([a, b]) => !A.includes(a) || !B.includes(b))) v.push('coppia fuori da A × B');
			if (given.length < 3 || given.length > 7) v.push('da 3 a 7 caselle segnate');
			if (p.case === 'elenco') {
				if (ans.kind !== 'choice') return [...v, 'risposta non a scelta multipla'];
				checkPairsChoice(ans, given, v);
			} else {
				const rows = p.case === 'senza-corrispondenti';
				const truth = rows ? A.filter((a) => !given.some((q) => q[0] === a)) : B.filter((b) => !given.some((q) => q[1] === b));
				if (!truth.length) v.push('nessun elemento da trovare');
				if (ans.kind !== 'set' || ans.values.join(',') !== truth.join(',')) v.push('risposta diversa dalle righe o colonne vuote');
			}
			break;
		}
		case 5: {
			const rel = relation(code!, A, A);
			if (!sameRel(rel, given)) v.push('params.pairs diverso dalla relazione');
			if (A.length < 3 || A.length > 5) v.push('A con 3-5 elementi');
			if (rel.length < 3 || rel.length > 8) v.push('da 3 a 8 coppie');
			if (ans.kind !== 'choice') return [...v, 'risposta non a scelta multipla'];
			checkPairsChoice(ans, rel, v);
			break;
		}
		case 6: {
			if (ans.kind !== 'choice') return [...v, 'risposta non a scelta multipla'];
			if (p.case === 'coppie') {
				checkPairsChoice(ans, swap(given), v);
			} else {
				const rel = relation(code!, A, A);
				if (!sameRel(rel, given)) v.push('params.pairs diverso dalla relazione');
				const rs = ans.options.map((o) => keys(relation(o.values[0], A, A)).join(','));
				const inv = keys(swap(rel)).join(',');
				if (rs.filter((r) => r === inv).length !== 1 || rs[ans.correct] !== inv) v.push("non esattamente un'opzione uguale all'inversa");
				if (new Set(rs).size !== 4) v.push('due opzioni con le stesse coppie');
			}
			break;
		}
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	return v;
}

// ---------------------------------------------------------------------------

/** The cases of a level, drawn once before the retries so each keeps its share. */
const CASES: Record<number, string[]> = {
	2: ['vera-appartiene', 'vera-non-appartiene'],
	3: ['elenco', 'senza-corrispondenti', 'non-raggiunti'],
	6: ['coppie', 'proprieta'],
};

/** The properties of a level, also drawn once, so each comes up about equally often. */
const PROPS: Record<number, string[]> = {
	1: ['div', 'sum', 'double', 'lt', 'plus'],
	2: ['div', 'sum', 'double', 'lt', 'plus'],
	4: ['div', 'sum', 'double', 'lt', 'plus', 'sq'],
	5: ['div', 'lt', 'le', 'even', 'sum'],
	6: ['div', 'mult', 'lt', 'gt', 'double', 'half'],
};

function assemble(rng: Rng, level: number, kind: string, prop: string): Sample | null {
	const base = { generatorId: ID, level, seed: rng.seed };
	switch (level) {
		case 1:
			return level1(rng, base, prop);
		case 2:
			return level2(rng, base, kind, prop);
		case 3:
			return level3(rng, base, kind);
		case 4:
			return level4(rng, base, prop);
		case 5:
			return level5(rng, base, prop);
		case 6:
			return level6(rng, base, kind, prop);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

export const relazioniBinarie: Generator = {
	id: ID,
	title: 'Relazioni binarie',
	levels: {
		1: { label: 'Dalla proprietà alle coppie', constraints: ['A e B con 3-4 numeri tra 1 e 12', 'a è un divisore di b, a + b = k, b = 2a, a < b, b = a + k', 'da 2 a 6 coppie, mai tutto A × B'] },
		2: { label: 'Appartenenza di una coppia', constraints: ['quattro affermazioni con ∈, ∉ o a R b, una sola vera', 'coppie scambiate e coppie fuori da A × B tra le false', 'metà delle volte la vera è un ∉'] },
		3: { label: 'La tabella a doppia entrata', constraints: ['3-4 righe, 3-4 colonne, da 3 a 7 caselle segnate', "l'elenco delle coppie, gli elementi di A senza corrispondenti o quelli di B non raggiunti"] },
		4: { label: 'Dalle coppie alla proprietà', constraints: ['da 3 a 5 coppie; quattro proprietà con relazioni diverse su A × B, una sola giusta', 'tra le sbagliate una che contiene tutte le coppie e altre in più, e la proprietà rovesciata'] },
		5: { label: 'Relazione in un insieme, con i cappi', constraints: ['A con 3-5 elementi, da 3 a 8 coppie', 'x è un divisore di y, x < y, x ≤ y, x + y è pari, x + y = k'] },
		6: { label: 'Relazione inversa', constraints: ["metà: le coppie dell'inversa, con la negazione tra le sbagliate", "metà: la proprietà dell'inversa tra la proprietà stessa, la negazione e la negazione dell'inversa"] },
	},
	generate(rng: Rng, level: number): Sample {
		const kind = CASES[level] ? rng.pick(CASES[level]) : '';
		const prop = PROPS[level] ? rng.pick(PROPS[level]) : '';
		for (let attempt = 0; attempt < 5000; attempt++) {
			const sample = assemble(rng, level, kind, prop);
			if (sample && check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
		if (sample.answer.kind === 'choice') return sample.answer;
		if (sample.level === 3) return level3Choice(sample, rng);
		throw new Error(`${ID}: no multiple choice for level ${sample.level}`);
	},
};

export default relazioniBinarie;
