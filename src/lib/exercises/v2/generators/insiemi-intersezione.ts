/**
 * Intersezione insiemistica. Spec: specs/exercises/insiemi-intersezione.md
 *
 * Six levels in the order of the lesson: the intersection of two listed sets (numbers, or the letters
 * of two words), sets described by a property in ℕ (common multiples, common divisors, two conditions on
 * x), the properties (A ∩ ∅, A ∩ U, A ⊆ B, which statement always holds), three sets, how many elements
 * the intersection has (formula and word problems with the total and "nessuno dei due"), and the
 * minimum and maximum of |A ∩ B| given the total, |A| and |B|.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, NumberAnswer, Rng, Sample, SetAnswer } from '../types';
import {
	type El,
	type Prop,
	assembleChoice,
	diff,
	endMistakes,
	fitSetChoice,
	inter,
	lines,
	norm,
	numberChoice,
	pickDistinct,
	propElements,
	propFromJSON,
	propJSON,
	propTex,
	range,
	range2,
	sameSet,
	setOption,
	setTex,
	shuffle,
	subsetEq,
	textBlock,
	union,
} from '../insiemi';

export const ID = 'insiemi-intersezione';

const strs = (xs: readonly El[]) => xs.map(String);
const nums = (xs: unknown): number[] => (xs as string[]).map(Number);
const parse = (s: string): El => (/^-?\d+$/.test(s) ? Number(s) : s);

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: SetAnswer | NumberAnswer | ChoiceAnswer;
	params: Record<string, unknown>;
}

const setAnswer = (name: string, xs: El[]): SetAnswer => ({
	kind: 'set',
	values: strs(norm(xs)),
	latex: `${name} = ${setTex(xs)}`,
});

/** The set whose only element is the empty set, written by mistake for ∅ (the lesson's warning). */
const EMPTY_IN_BRACES = '{vuoto}';
const emptyInBraces: ChoiceOption = {
	latex: '\\{\\emptyset\\}',
	values: [EMPTY_IN_BRACES],
};
const wrongOption = (w: string[]): ChoiceOption => (w.length === 1 && w[0] === EMPTY_IN_BRACES ? emptyInBraces : setOption(w.map(parse)));

const listed = (xs: readonly El[]) => norm(xs).join(', ');
const verb = (n: number, one: string, many: string) => (n === 1 ? one : many);

// ---------------------------------------------------------------------------
// Level 1: letters of two words

export const WORDS = [
	'scuola',
	'classe',
	'lavagna',
	'quaderno',
	'matita',
	'penna',
	'zaino',
	'libro',
	'gomma',
	'righello',
	'compasso',
	'diario',
	'banco',
	'sedia',
	'finestra',
	'palestra',
	'cortile',
	'lezione',
	'compito',
	'pagina',
	'storia',
	'musica',
	'disegno',
	'teatro',
	'cinema',
	'giardino',
	'montagna',
	'estate',
	'inverno',
	'pianeta',
	'stella',
	'nuvola',
	'gelato',
	'tavolo',
	'chitarra',
	'pallone',
];

export const letters = (w: string): string[] => norm(w.split('')) as string[];

// ---------------------------------------------------------------------------
// Level 2: common multiples, as infinite sets written with dots

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;

/** Pairs of the multiples variant: most with a common divisor, so that a · b is not the MCM. */
const SHARED_PAIRS: [number, number][] = [
	[4, 6],
	[6, 9],
	[4, 10],
	[6, 8],
	[6, 10],
	[8, 12],
	[9, 12],
	[10, 15],
	[6, 15],
	[4, 14],
	[10, 12],
	[12, 18],
	[8, 10],
	[6, 14],
	[9, 15],
	[8, 14],
];
const COPRIME_PAIRS: [number, number][] = [
	[2, 3],
	[3, 4],
	[2, 5],
	[3, 5],
	[4, 5],
	[2, 7],
	[3, 7],
	[4, 9],
	[5, 6],
];

/**
 * An infinite set of the multiples variant, as a label: "mult:12" the multiples of 12, "union:4,6" the
 * numbers that are multiples of 4 or of 6. The first elements and \dots.
 */
function infiniteElements(label: string, count: number): number[] {
	const [kind, arg] = label.split(':');
	const ks = arg.split(',').map(Number);
	const out: number[] = [];
	for (let x = 0; out.length < count; x++) if (kind === 'mult' ? x % ks[0] === 0 : ks.some((k) => x % k === 0)) out.push(x);
	return out;
}
const infiniteOption = (label: string): ChoiceOption => ({
	latex: `\\{${infiniteElements(label, label.startsWith('mult') ? 4 : 6).join(', ')}, \\dots\\}`,
	values: [label],
});

/** Divisor pairs: a common divisor other than 1, neither divides the other. */
const DIVISOR_NUMBERS = [12, 16, 18, 20, 24, 27, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60];
const divisors = (n: number): number[] => range(1, n).filter((d) => n % d === 0);
/** Ordered pairs with at least 3 common divisors, neither dividing the other. */
const DIVISOR_PAIRS: [number, number][] = DIVISOR_NUMBERS.flatMap((m) =>
	DIVISOR_NUMBERS.filter((n) => n !== m && m % n !== 0 && n % m !== 0 && divisors(gcd(m, n)).length >= 3).map((n) => [m, n] as [number, number]),
);

// ---------------------------------------------------------------------------
// Level 3: statements about any sets, in a small language: A, B, C, E (∅), U, & (∩), | (∪), with = or <= (⊆)

export const ALWAYS_TRUE: Record<string, string> = {
	'A&B<=A': '\\text{gli elementi di } A \\cap B \\text{ stanno sia in } A \\text{ sia in } B\\text{, quindi anche in } A',
	'A&B<=B': '\\text{gli elementi di } A \\cap B \\text{ stanno sia in } A \\text{ sia in } B\\text{, quindi anche in } B',
	'A&B=B&A': "\\text{è la proprietà commutativa: l'ordine dei due insiemi non conta}",
	'A&A=A': '\\text{è l’idempotenza: gli elementi comuni ad } A \\text{ e ad } A \\text{ sono tutti quelli di } A',
	'A&E=E': "\\text{l'insieme vuoto non ha elementi, quindi non ne ha in comune con } A",
	'A&U=A': "\\text{l'universo contiene tutti gli elementi di } A\\text{: è l'elemento neutro dell'intersezione}",
	'(A&B)&C=A&(B&C)': '\\text{è la proprietà associativa}',
};
export const NOT_ALWAYS = ['A<=A&B', 'A&B=A', 'A&E=A', 'A&U=U', 'A&A=E', 'A&B=A|B', 'A|B<=A&B', 'A&B=E', 'B<=A&B', 'A&B=B'];

type Term = { t: 'name'; n: string } | { t: 'op'; op: '&' | '|'; l: Term; r: Term };

function parseTerm(s: string): Term {
	let i = 0;
	const atom = (): Term => {
		if (s[i] === '(') {
			i++;
			const t = expr();
			i++; // ')'
			return t;
		}
		return { t: 'name', n: s[i++] };
	};
	const expr = (): Term => {
		let l = atom();
		while (s[i] === '&' || s[i] === '|') {
			const op = s[i++] as '&' | '|';
			l = { t: 'op', op, l, r: atom() };
		}
		return l;
	};
	return expr();
}

const splitStmt = (s: string): [string, string, string] => {
	const rel = s.includes('<=') ? '<=' : '=';
	const [l, r] = s.split(rel);
	return [l, rel, r];
};

const termTex = (s: string): string =>
	s
		.split('')
		.map((c) => (c === '&' ? ' \\cap ' : c === '|' ? ' \\cup ' : c === 'E' ? '\\emptyset' : c))
		.join('')
		.replace(/\\emptyset(?=[A-Za-z])/g, '\\emptyset ');

export function stmtLatex(s: string): string {
	const [l, rel, r] = splitStmt(s);
	return `${termTex(l)} ${rel === '<=' ? '\\subseteq' : '='} ${termTex(r)}`;
}

function termEval(t: Term, sets: Record<string, number[]>): number[] {
	if (t.t === 'name') return t.n === 'E' ? [] : sets[t.n];
	const l = termEval(t.l, sets),
		r = termEval(t.r, sets);
	return (t.op === '&' ? inter(l, r) : union(l, r)) as number[];
}

function stmtHolds(s: string, sets: Record<string, number[]>): boolean {
	const [l, rel, r] = splitStmt(s);
	const L = termEval(parseTerm(l), sets),
		R = termEval(parseTerm(r), sets);
	return rel === '<=' ? subsetEq(L, R) : sameSet(L, R);
}

const SMALL: number[][] = [[1], [2], [1, 2], []];

/** The first sets inside U = {1, 2} for which the statement fails, or null if it always holds there. */
function counterexample(s: string): Record<string, number[]> | null {
	for (const A of SMALL)
		for (const B of SMALL)
			for (const C of SMALL) {
				const sets = { A, B, C, U: [1, 2] };
				if (!stmtHolds(s, sets)) return sets;
			}
	return null;
}

function counterStep(s: string): string {
	const sets = counterexample(s)!;
	const used = ['A', 'B', 'C', 'U'].filter((n) => s.includes(n));
	const given = used.map((n) => `${n} = ${setTex(sets[n])}`).join('\\text{, } ');
	const [l, , r] = splitStmt(s);
	const shown = [l, r].filter((side) => side.length > 1).map((side) => `${termTex(side)} = ${setTex(termEval(parseTerm(side), sets))}`);
	return `${stmtLatex(s)} \\text{ non vale sempre: con } ${given}` + (shown.length ? `\\text{ si ha } ${shown.join('\\text{ e } ')}` : '');
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: word problems

interface Ctx {
	group: string;
	people: string;
	a: string;
	b: string;
	both: string;
	none: string;
	onlyA: string;
	everyone: string;
	A: string;
	B: string;
}

export const CONTEXTS: Ctx[] = [
	{
		group: 'In una gita di',
		people: 'studenti',
		a: 'hanno visitato il museo',
		b: 'hanno visitato il castello',
		both: 'hanno visitato tutti e due',
		none: 'non hanno visitato nessuno dei due',
		onlyA: 'hanno visitato solo il museo',
		everyone: 'ogni studente ha visitato almeno uno dei due posti',
		A: 'M',
		B: 'C',
	},
	{
		group: 'In una classe di',
		people: 'studenti',
		a: 'giocano a calcio',
		b: 'giocano a pallavolo',
		both: 'giocano sia a calcio sia a pallavolo',
		none: 'non giocano né a calcio né a pallavolo',
		onlyA: 'giocano solo a calcio',
		everyone: 'ogni studente gioca ad almeno uno dei due sport',
		A: 'C',
		B: 'P',
	},
	{
		group: 'In un gruppo di',
		people: 'ragazzi',
		a: 'hanno la bicicletta',
		b: 'hanno il monopattino',
		both: 'hanno sia la bicicletta sia il monopattino',
		none: 'non hanno né la bicicletta né il monopattino',
		onlyA: 'hanno solo la bicicletta',
		everyone: 'ognuno ha almeno uno dei due mezzi',
		A: 'B',
		B: 'M',
	},
	{
		group: 'In una classe di',
		people: 'studenti',
		a: 'hanno la sufficienza in matematica',
		b: 'hanno la sufficienza in fisica',
		both: 'hanno la sufficienza in tutte e due le materie',
		none: 'non hanno la sufficienza in nessuna delle due materie',
		onlyA: 'hanno la sufficienza solo in matematica',
		everyone: 'ognuno ha la sufficienza in almeno una delle due materie',
		A: 'M',
		B: 'F',
	},
	{
		group: 'In un gruppo di',
		people: 'amici',
		a: 'hanno letto il libro',
		b: 'hanno visto il film',
		both: 'hanno sia letto il libro sia visto il film',
		none: 'non hanno né letto il libro né visto il film',
		onlyA: 'hanno letto il libro senza vedere il film',
		everyone: 'ognuno ha letto il libro o visto il film',
		A: 'L',
		B: 'F',
	},
];

// ---------------------------------------------------------------------------
// Construction

function twoSets(rng: Rng, U: number[], disjoint: boolean): [number[], number[]] {
	if (disjoint) {
		const all = pickDistinct(rng, U, rng.int(5, 8));
		const cut = rng.int(2, all.length - 2);
		return [norm(all.slice(0, cut)) as number[], norm(all.slice(cut)) as number[]];
	}
	const common = pickDistinct(rng, U, rng.int(1, 3));
	const rest = pickDistinct(rng, diff(U, common) as number[], rng.int(3, 6));
	const cut = rng.int(1, rest.length - 1);
	return [norm([...common, ...rest.slice(0, cut)]) as number[], norm([...common, ...rest.slice(cut)]) as number[]];
}

const ASK2 = 'A \\cap B = \\ ?';

function level1(rng: Rng): Built | null {
	const u = rng.next();
	if (u < 0.3) {
		const [w1, w2] = pickDistinct(rng, WORDS, 2);
		const A = letters(w1),
			B = letters(w2);
		const res = inter(A, B);
		if (res.length < 2 || res.length > 5 || subsetEq(A, B) || subsetEq(B, A)) return null;
		const onlyA = diff(A, B),
			onlyB = diff(B, A);
		const options = [union(A, B), onlyA, onlyB, ...res.map((x) => res.filter((y) => y !== x))].map(setOption);
		const ch = assembleChoice(rng, setOption(res), options);
		if (!ch) return null;
		return {
			prompt: "Scegli l'intersezione.",
			problem: textBlock(`Siano $A$ l'insieme delle lettere della parola “${w1}” e $B$ l'insieme delle lettere della parola “${w2}”.`, 46, [ASK2]),
			solution: `A \\cap B = ${setTex(res)}`,
			steps: [
				`A = ${setTex(A)} \\qquad B = ${setTex(B)}`,
				`\\text{Le lettere comuni sono } ${listed(res)}\\text{; } ${listed(onlyA)} \\text{ ${verb(onlyA.length, 'sta', 'stanno')} solo in } A \\text{ e } ${listed(onlyB)} \\text{ solo in } B`,
				`A \\cap B = ${setTex(res)}`,
			],
			answer: fitSetChoice(ch),
			params: { case: 'lettere', words: [w1, w2] },
		};
	}
	const disjoint = u < 0.45;
	const [A, B] = twoSets(rng, range(1, 15), disjoint);
	const res = inter(A, B);
	const steps = [`\\text{Si scorrono gli elementi di } A \\text{ e si tengono quelli che stanno anche in } B`];
	if (res.length) steps.push(`${listed(res)} \\text{ ${verb(res.length, 'sta', 'stanno')} sia in } A \\text{ sia in } B`, `A \\cap B = ${setTex(res)}`);
	else
		steps.push(
			'\\text{Nessun elemento di } A \\text{ sta in } B\\text{: i due insiemi sono disgiunti}',
			'A \\cap B = \\emptyset\\text{, che non è } \\{0\\} \\text{ né } \\{\\emptyset\\}',
		);
	return {
		prompt: "Scrivi l'intersezione per elencazione.",
		problem: lines([`A = ${setTex(A)} \\qquad B = ${setTex(B)}`, ASK2]),
		solution: `A \\cap B = ${setTex(res)}`,
		steps,
		answer: setAnswer('A \\cap B', res),
		params: {
			case: disjoint ? 'disgiunti' : 'in comune',
			A: strs(A),
			B: strs(B),
			wrong: disjoint ? [['0'], [EMPTY_IN_BRACES], strs(union(A, B))] : [union(A, B), diff(A, B), diff(B, A)].map(strs),
		},
	};
}

function level2(rng: Rng): Built | null {
	const u = rng.next();
	if (u < 0.3) {
		const [p, q] = rng.next() < 0.75 ? rng.pick(SHARED_PAIRS) : rng.pick(COPRIME_PAIRS);
		const [a, b] = rng.int(0, 1) ? [p, q] : [q, p];
		const L = lcm(a, b),
			g = gcd(a, b);
		const cands = [a * b !== L ? `mult:${a * b}` : null, g > 1 ? `mult:${g}` : null, `union:${Math.min(a, b)},${Math.max(a, b)}`, `mult:${Math.max(a, b)}`, `mult:${2 * L}`];
		const ch = assembleChoice(
			rng,
			infiniteOption(`mult:${L}`),
			cands.map((c) => (c ? infiniteOption(c) : null)),
		);
		if (!ch) return null;
		const res = infiniteOption(`mult:${L}`).latex;
		const steps = [
			`A = ${infiniteOption(`mult:${a}`).latex}`,
			`B = ${infiniteOption(`mult:${b}`).latex}`,
			`\\text{Gli elementi comuni sono i multipli del MCM tra } ${a} \\text{ e } ${b}\\text{, che è } ${L}`,
		];
		if (a * b !== L)
			steps.push(`\\text{Non i multipli di } ${a} \\cdot ${b} = ${a * b}\\text{: } ${L} \\text{ è multiplo di } ${a} \\text{ e di } ${b} \\text{ ma non di } ${a * b}`);
		steps.push(`A \\cap B = ${res}`);
		return {
			prompt: "Scegli l'intersezione.",
			problem: textBlock(`Siano $A$ l'insieme dei multipli di $${a}$ e $B$ l'insieme dei multipli di $${b}$ in $\\mathbb{N}$.`, 46, [ASK2]),
			solution: `A \\cap B = ${res}`,
			steps,
			answer: ch,
			params: { case: 'multipli', a: String(a), b: String(b) },
		};
	}
	if (u < 0.65) {
		const [m, n] = rng.pick(DIVISOR_PAIRS);
		const g = gcd(m, n);
		const A = divisors(m),
			B = divisors(n);
		const res = inter(A, B) as number[];
		if (res.length < 3) return null;
		return {
			prompt: "Scrivi l'intersezione per elencazione.",
			problem: textBlock(`Siano $A$ l'insieme dei divisori di $${m}$ e $B$ l'insieme dei divisori di $${n}$.`, 46, [ASK2]),
			solution: `A \\cap B = ${setTex(res)}`,
			steps: [
				`A = ${setTex(A)}`,
				`B = ${setTex(B)}`,
				`A \\cap B = ${setTex(res)}`,
				`\\text{Sono i divisori comuni di } ${m} \\text{ e } ${n}\\text{, cioè i divisori del loro MCD, } ${g}`,
			],
			answer: setAnswer('A \\cap B', res),
			params: {
				case: 'divisori',
				m: String(m),
				n: String(n),
				wrong: [union(A, B), res.slice(1), res.slice(0, -1), diff(A, B)].map(strs),
			},
		};
	}
	// two conditions on x in ℕ
	let pa: Prop, pb: Prop, kind: string;
	if (u < 0.86) {
		kind = 'estremi';
		const l = rng.int(1, 10);
		const h = l + rng.int(-2, 7);
		pa = { dom: 'N', conds: [range2(null, false, h, rng.int(0, 1) === 1)] };
		pb = { dom: 'N', conds: [range2(l, rng.int(0, 1) === 1, null, false)] };
	} else {
		kind = 'proprieta';
		const c = rng.pick([{ t: 'pari' as const }, { t: 'dispari' as const }, { t: 'mult' as const, k: 3 }, { t: 'mult' as const, k: 4 }, { t: 'mult' as const, k: 5 }]);
		pa = { dom: 'N', conds: [c] };
		pb = {
			dom: 'N',
			conds: [range2(null, false, rng.int(8, 20), rng.int(0, 1) === 1)],
		};
	}
	const both: Prop = { dom: 'N', conds: [...pa.conds, ...pb.conds] };
	const res = propElements(both);
	if (kind === 'proprieta' && (res.length < 3 || res.length > 8)) return null;
	if (kind === 'estremi' && res.length > 8) return null;
	if (rng.int(0, 1)) [pa, pb] = [pb, pa];
	let wrong: string[][];
	const steps: string[] = [`\\text{Un numero sta in } A \\cap B \\text{ se rispetta tutte e due le condizioni}`];
	if (res.length) {
		wrong = endMistakes(res, 0).map(strs);
		steps.push(`\\text{Si controllano gli estremi: il primo numero è } ${res[0]} \\text{ e l'ultimo è } ${res[res.length - 1]}`);
		if (kind === 'proprieta' && res[0] === 0) steps.push(`0 \\in \\mathbb{N} \\text{ e rispetta tutte e due le condizioni}`);
	} else {
		const hi = (both.conds.find((c) => c.t === 'range' && c.hi !== null) as { hi: number }).hi;
		const lo = (both.conds.find((c) => c.t === 'range' && c.lo !== null) as { lo: number }).lo;
		wrong = [norm([lo, hi]).map(String), ['0'], [EMPTY_IN_BRACES]];
		steps.push(`\\text{Nessun numero rispetta tutte e due le condizioni: } A \\text{ e } B \\text{ sono disgiunti}`);
	}
	steps.push(`A \\cap B = ${setTex(res)}`);
	return {
		prompt: "Scrivi l'intersezione per elencazione.",
		problem: lines([`A = ${propTex(pa)} \\qquad B = ${propTex(pb)}`, ASK2]),
		solution: `A \\cap B = ${setTex(res)}`,
		steps,
		answer: setAnswer('A \\cap B', res),
		params: { case: kind, A: propJSON(pa), B: propJSON(pb), wrong },
	};
}

function level3(rng: Rng): Built | null {
	const u = rng.next();
	if (u < 0.35) {
		const truth = rng.pick(Object.keys(ALWAYS_TRUE));
		const wrong = pickDistinct(rng, NOT_ALWAYS, 3);
		const opt = (s: string): ChoiceOption => ({
			latex: stmtLatex(s),
			values: [s],
		});
		const ch = assembleChoice(rng, opt(truth), wrong.map(opt));
		if (!ch) return null;
		return {
			prompt: 'Scegli la risposta corretta.',
			problem: textBlock('Per insiemi qualunque $A$, $B$, $C$ contenuti in un universo $U$, quale di queste affermazioni è sempre vera?'),
			solution: stmtLatex(truth),
			steps: [`${stmtLatex(truth)}\\text{: } ${ALWAYS_TRUE[truth]}`, ...wrong.map(counterStep)],
			answer: ch,
			params: { case: 'sempre vera' },
		};
	}
	if (u < 0.65) {
		const big = norm(pickDistinct(rng, range(1, 12), rng.int(4, 6))) as number[];
		const small = norm(pickDistinct(rng, big, rng.int(2, big.length - 1))) as number[];
		const smallIsA = rng.int(0, 1) === 1;
		const [A, B] = smallIsA ? [small, big] : [big, small];
		const [s, b] = smallIsA ? ['A', 'B'] : ['B', 'A'];
		return {
			prompt: "Scrivi l'intersezione per elencazione.",
			problem: lines([`A = ${setTex(A)} \\qquad B = ${setTex(B)}`, ASK2]),
			solution: `A \\cap B = ${s} = ${setTex(small)}`,
			steps: [
				`\\text{Ogni elemento di } ${s} \\text{ sta anche in } ${b}\\text{: } ${s} \\subseteq ${b}`,
				`\\text{Quindi gli elementi comuni sono tutti quelli di } ${s}\\text{: } A \\cap B = ${s} = ${setTex(small)}`,
			],
			answer: setAnswer('A \\cap B', small),
			params: {
				case: 'incluso',
				A: strs(A),
				B: strs(B),
				wrong: [big, diff(big, small), [], union(A, B)].map(strs),
			},
		};
	}
	if (u < 0.85) {
		const n = rng.int(7, 10);
		const U = range(1, n);
		const A = norm(pickDistinct(rng, U, rng.int(2, n - 2))) as number[];
		return {
			prompt: "Scrivi l'intersezione per elencazione.",
			problem: lines([`U = ${setTex(U)} \\qquad A = ${setTex(A)}`, 'A \\cap U = \\ ?']),
			solution: `A \\cap U = A = ${setTex(A)}`,
			steps: [
				"\\text{L'universo contiene tutti gli elementi di } A\\text{, quindi gli elementi comuni sono quelli di } A",
				`A \\cap U = A = ${setTex(A)}\\text{: per l'intersezione } U \\text{ è l'elemento neutro}`,
			],
			answer: setAnswer('A \\cap U', A),
			params: {
				case: 'universo',
				U: strs(U),
				A: strs(A),
				wrong: [U, diff(U, A), []].map(strs),
			},
		};
	}
	const A = norm(pickDistinct(rng, range(1, 12), rng.int(3, 6))) as number[];
	return {
		prompt: "Scrivi l'intersezione per elencazione.",
		problem: lines([`A = ${setTex(A)}`, 'A \\cap \\emptyset = \\ ?']),
		solution: 'A \\cap \\emptyset = \\emptyset',
		steps: [
			"\\text{L'insieme vuoto non ha elementi, quindi non ne ha nemmeno in comune con } A",
			'A \\cap \\emptyset = \\emptyset\\text{, che non è } \\{0\\} \\text{ né } \\{\\emptyset\\}',
		],
		answer: setAnswer('A \\cap \\emptyset', []),
		params: {
			case: 'vuoto',
			A: strs(A),
			wrong: [strs(A), ['0'], [EMPTY_IN_BRACES]],
		},
	};
}

function level4(rng: Rng): Built | null {
	const empty = rng.next() < 0.3;
	const [A, B, C] = [0, 1, 2].map(() => norm(pickDistinct(rng, range(1, 12), rng.int(3, 5))) as number[]);
	const ab = inter(A, B),
		bc = inter(B, C),
		ac = inter(A, C);
	const res = inter(ab, C);
	if (empty) {
		if (res.length || !ab.length || !bc.length || !ac.length) return null;
	} else if (!res.length || ab.length === res.length) return null; // C must remove something from A ∩ B
	const atLeastTwo = union(union(ab, bc), ac);
	const steps = [
		`A \\cap B = ${setTex(ab)} \\text{, e poi } (A \\cap B) \\cap C = ${setTex(res)}`,
		`\\text{Nell'altro ordine: } B \\cap C = ${setTex(bc)} \\text{, e poi } A \\cap (B \\cap C) = ${setTex(res)}`,
		'\\text{I due risultati coincidono, per la proprietà associativa}',
	];
	if (empty) steps.push(`\\text{Le coppie hanno elementi in comune, ma nessun numero sta in tutti e tre gli insiemi}`);
	steps.push(`A \\cap B \\cap C = ${setTex(res)}`);
	return {
		prompt: "Scrivi l'intersezione per elencazione.",
		problem: lines([`A = ${setTex(A)} \\qquad B = ${setTex(B)}`, `C = ${setTex(C)}`, 'A \\cap B \\cap C = \\ ?']),
		solution: `A \\cap B \\cap C = ${setTex(res)}`,
		steps,
		answer: setAnswer('A \\cap B \\cap C', res),
		params: {
			case: empty ? 'vuota' : 'piena',
			A: strs(A),
			B: strs(B),
			C: strs(C),
			wrong: [ab, atLeastTwo, ac, bc, union(union(A, B), C)].map(strs).concat(empty ? [['0'], [EMPTY_IN_BRACES]] : []),
		},
	};
}

function level5(rng: Rng): Built | null {
	const u = rng.next();
	if (u < 0.3) {
		const a = rng.int(6, 30),
			b = rng.int(6, 30);
		const i = rng.int(1, Math.min(a, b) - 1);
		const un = a + b - i;
		return {
			prompt: "Calcola il numero di elementi dell'intersezione.",
			problem: lines([`|A| = ${a} \\qquad |B| = ${b} \\qquad |A \\cup B| = ${un}`, '|A \\cap B| = \\ ?']),
			solution: `|A \\cap B| = ${i}`,
			steps: [
				'|A \\cap B| = |A| + |B| - |A \\cup B|',
				`|A \\cap B| = ${a} + ${b} - ${un} = ${i}`,
				`\\text{La somma } ${a} + ${b} \\text{ conta due volte gli elementi comuni, } |A \\cup B| \\text{ una volta sola}`,
			],
			answer: { kind: 'number', value: String(i) },
			params: {
				case: 'formula',
				a: String(a),
				b: String(b),
				u: String(un),
				mistakes: strs([a + b, un - a, un - b]),
			},
		};
	}
	const c = rng.pick(CONTEXTS);
	const both = rng.int(2, 9);
	const a = both + rng.int(3, 14),
		b = both + rng.int(3, 14);
	const atLeast = a + b - both;
	let variant: string, none: number, value: number, prose: string, mistakes: number[];
	if (u < 0.65) {
		variant = 'entrambi con nessuno';
		none = rng.int(1, both - 1);
		value = both;
		prose = `${c.group} ${atLeast + none} ${c.people}, ${a} ${c.a}, ${b} ${c.b} e ${none} ${c.none}. Quanti ${c.people} ${c.both}?`;
		mistakes = [a + b - atLeast - none, both + none, atLeast];
	} else if (u < 0.8) {
		variant = 'entrambi';
		none = 0;
		value = both;
		prose = `${c.group} ${atLeast} ${c.people}, ${a} ${c.a} e ${b} ${c.b}; ${c.everyone}. Quanti ${c.people} ${c.both}?`;
		mistakes = [a + b, atLeast - a, atLeast - b];
	} else {
		variant = 'solo A';
		none = rng.int(1, both - 1);
		value = a - both;
		prose = `${c.group} ${atLeast + none} ${c.people}, ${a} ${c.a}, ${b} ${c.b} e ${none} ${c.none}. Quanti ${c.people} ${c.onlyA}?`;
		mistakes = [atLeast + none - b, both, b - both];
	}
	const total = atLeast + none;
	const X = c.A,
		Y = c.B;
	const steps = [`${X} = \\text{quelli che ${c.a}}\\text{, } ${Y} = \\text{quelli che ${c.b}}`];
	if (none) steps.push(`\\text{In } ${X} \\cup ${Y} \\text{ ci sono tutti tranne i } ${none} \\text{ che ${c.none}: } |${X} \\cup ${Y}| = ${total} - ${none} = ${atLeast}`);
	else steps.push(`\\text{Ognuno sta in almeno uno dei due insiemi: } |${X} \\cup ${Y}| = ${total}`);
	steps.push(`|${X} \\cap ${Y}| = |${X}| + |${Y}| - |${X} \\cup ${Y}| = ${a} + ${b} - ${atLeast} = ${both}`);
	if (variant === 'solo A') steps.push(`\\text{Solo } ${X}\\text{: } |${X}| - |${X} \\cap ${Y}| = ${a} - ${both} = ${value}`);
	steps.push(
		`\\text{Controllo: solo } ${X}\\text{: } ${a - both}\\text{, solo } ${Y}\\text{: } ${b - both}\\text{, tutti e due: } ${both}\\text{, nessuno: } ${none}\\text{; in tutto } ${total}`,
	);
	return {
		prompt: 'Risolvi il problema.',
		problem: textBlock(prose),
		solution: `\\text{${value} ${c.people}}`,
		steps,
		answer: { kind: 'number', value: String(value) },
		params: {
			case: variant,
			context: String(CONTEXTS.indexOf(c)),
			total: String(total),
			a: String(a),
			b: String(b),
			both: String(both),
			none: String(none),
			mistakes: strs(mistakes),
		},
	};
}

function level6(rng: Rng): Built | null {
	const c = rng.pick(CONTEXTS);
	const total = rng.int(20, 40);
	const a = rng.int(Math.ceil(total / 2), total - 1),
		b = rng.int(Math.ceil(total / 2), total - 1);
	if (a === b || a + b <= total) return null;
	const askMin = rng.next() < 0.5;
	const lo = a + b - total,
		hi = Math.min(a, b);
	const small = a < b ? c.A : c.B;
	const big = a < b ? c.B : c.A;
	const X = c.A,
		Y = c.B;
	const value = askMin ? lo : hi;
	const steps = [`${X} = \\text{quelli che ${c.a}}\\text{, } ${Y} = \\text{quelli che ${c.b}}`];
	if (askMin)
		steps.push(
			`|${X} \\cap ${Y}| = ${a} + ${b} - |${X} \\cup ${Y}| = ${a + b} - |${X} \\cup ${Y}|`,
			`${X} \\cup ${Y} \\text{ non può avere più dei } ${total} \\text{ ${c.people} del gruppo, quindi } |${X} \\cap ${Y}| \\ge ${a + b} - ${total} = ${lo}`,
			`\\text{Il minimo è } ${lo}\\text{, e si ha quando ognuno sta in almeno uno dei due insiemi}`,
		);
	else
		steps.push(
			`${X} \\cap ${Y} \\text{ è contenuto sia in } ${X} \\text{ sia in } ${Y}\\text{, quindi non ha più elementi del più piccolo dei due}`,
			`|${X} \\cap ${Y}| \\le ${hi}`,
			`\\text{Il massimo è } ${hi}\\text{, e si ha quando } ${small} \\subseteq ${big}`,
		);
	return {
		prompt: 'Risolvi il problema.',
		problem: textBlock(`${c.group} ${total} ${c.people}, ${a} ${c.a} e ${b} ${c.b}. Quanti ${c.people}, come ${askMin ? 'minimo' : 'massimo'}, ${c.both}?`),
		solution: `\\text{${value} ${c.people}}`,
		steps,
		answer: { kind: 'number', value: String(value) },
		params: {
			case: askMin ? 'minimo' : 'massimo',
			context: String(CONTEXTS.indexOf(c)),
			total: String(total),
			a: String(a),
			b: String(b),
			mistakes: strs(askMin ? [a + b, hi, Math.max(a, b) - Math.min(a, b)] : [Math.max(a, b), lo, total - Math.min(a, b)]),
		},
	};
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return level1(rng);
		case 2:
			return level2(rng);
		case 3:
			return level3(rng);
		case 4:
			return level4(rng);
		case 5:
			return level5(rng);
		case 6:
			return level6(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

// ---------------------------------------------------------------------------
// Check and choice

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const a = sample.answer;
	const setIs = (xs: El[]) => a.kind === 'set' && sameSet(a.values.map(Number), xs);
	const choiceIs = (good: (o: ChoiceOption) => boolean) => {
		if (a.kind !== 'choice') return false;
		const t = a.options.map(good);
		return a.options.length === 4 && t.filter(Boolean).length === 1 && t[a.correct];
	};
	switch (sample.level) {
		case 1:
			if (p.case === 'lettere') {
				const [w1, w2] = p.words as string[];
				const res = inter(letters(w1), letters(w2));
				if (!choiceIs((o) => sameSet(o.values, res))) v.push('intersezione di lettere sbagliata');
			} else {
				const res = inter(nums(p.A), nums(p.B));
				if (!setIs(res)) v.push('intersezione sbagliata');
				if ((p.case === 'disgiunti') !== (res.length === 0)) v.push('caso sbagliato');
			}
			break;
		case 2:
			if (p.case === 'multipli') {
				const L = lcm(Number(p.a), Number(p.b));
				if (!choiceIs((o) => o.values[0] === `mult:${L}`)) v.push('multipli comuni sbagliati');
			} else if (p.case === 'divisori') {
				if (!setIs(inter(divisors(Number(p.m)), divisors(Number(p.n))))) v.push('divisori comuni sbagliati');
			} else {
				const pa = propFromJSON(p.A),
					pb = propFromJSON(p.B);
				if (!setIs(propElements({ dom: 'N', conds: [...pa.conds, ...pb.conds] }))) v.push('intersezione sbagliata');
			}
			break;
		case 3:
			if (p.case === 'sempre vera') {
				if (!choiceIs((o) => counterexample(o.values[0]) === null)) v.push('non c’è una sola affermazione sempre vera');
			} else if (p.case === 'incluso') {
				const A = nums(p.A),
					B = nums(p.B);
				if (!(subsetEq(A, B) || subsetEq(B, A)) || sameSet(A, B) || !setIs(inter(A, B))) v.push('inclusione sbagliata');
			} else if (p.case === 'universo') {
				if (!subsetEq(nums(p.A), nums(p.U)) || !setIs(nums(p.A))) v.push('A ∩ U sbagliato');
			} else if (!setIs([])) v.push('A ∩ ∅ sbagliato');
			break;
		case 4: {
			const res = inter(inter(nums(p.A), nums(p.B)), nums(p.C));
			if (!setIs(res) || (p.case === 'vuota') !== (res.length === 0)) v.push('intersezione di tre insiemi sbagliata');
			break;
		}
		case 5: {
			if (p.case === 'formula') {
				const i = Number(p.a) + Number(p.b) - Number(p.u);
				if (a.kind !== 'number' || Number(a.value) !== i || i < 1 || i >= Math.min(Number(p.a), Number(p.b))) v.push('conteggio sbagliato');
				break;
			}
			const total = Number(p.total),
				x = Number(p.a),
				y = Number(p.b),
				both = Number(p.both),
				none = Number(p.none);
			if (x + y - both + none !== total || both < 1 || both >= Math.min(x, y) || total > 60) v.push('numeri incoerenti');
			const value = p.case === 'solo A' ? x - both : both;
			if (a.kind !== 'number' || Number(a.value) !== value) v.push('risposta sbagliata');
			const given = p.case === 'entrambi' ? [total, x, y] : [total, x, y, none];
			if (given.includes(value)) v.push('la risposta è già un numero del testo');
			break;
		}
		case 6: {
			const total = Number(p.total),
				x = Number(p.a),
				y = Number(p.b);
			const value = p.case === 'minimo' ? x + y - total : Math.min(x, y);
			if (x + y <= total || Math.max(x, y) >= total || x === y) v.push('numeri fuori dai vincoli');
			if (a.kind !== 'number' || Number(a.value) !== value) v.push('risposta sbagliata');
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
	if (a.kind === 'number') return numberChoice(rng, Number(a.value), nums(sample.params.mistakes ?? []));
	if (a.kind !== 'set') throw new Error(`${ID}: no choice for ${a.kind}`);
	const truth = a.values.map(Number);
	const wrong = ((sample.params.wrong ?? []) as string[][]).map(wrongOption);
	// last resort: one element dropped, or one element of the given sets added
	const p = sample.params;
	const given = [p.A, p.B, p.C, p.U].filter((xs) => Array.isArray(xs)).flatMap((xs) => nums(xs));
	const extra = diff(given.length ? given : range(1, 12), truth) as number[];
	const fallback = shuffle(rng, [...truth.map((x) => truth.filter((y) => y !== x)), ...extra.map((x) => norm([...truth, x]) as number[])]).map(setOption);
	const ch = assembleChoice(rng, setOption(truth), [...wrong, ...fallback]);
	if (!ch) throw new Error(`${ID}: not enough distractors for seed ${sample.seed}`);
	return fitSetChoice(ch);
}

export const insiemiIntersezione: Generator = {
	id: ID,
	title: 'Intersezione insiemistica',
	levels: {
		1: {
			label: 'Intersezione di due insiemi elencati',
			constraints: ['numeri da 1 a 15 o lettere di due parole', 'circa 15% disgiunti: A ∩ B = ∅'],
		},
		2: {
			label: 'Insiemi descritti da una proprietà',
			constraints: ['multipli comuni (MCM), divisori comuni (MCD), due condizioni su x in ℕ'],
		},
		3: {
			label: 'Proprietà e inclusione',
			constraints: ['A ⊆ B quindi A ∩ B = A; A ∩ U = A; A ∩ ∅ = ∅; quale affermazione è sempre vera'],
		},
		4: {
			label: 'Intersezione di tre insiemi',
			constraints: ['C toglie qualcosa ad A ∩ B', 'circa 30%: coppie non disgiunte e intersezione vuota'],
		},
		5: {
			label: 'Quanti elementi ha l’intersezione',
			constraints: ['|A ∩ B| = |A| + |B| − |A ∪ B|', 'problemi con il totale e chi non sta in nessuno dei due'],
		},
		6: {
			label: 'Minimo e massimo',
			constraints: ['|A| + |B| > totale, |A| ≠ |B|, entrambi minori del totale'],
		},
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

export default insiemiIntersezione;
