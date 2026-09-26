/**
 * Implicazione, condizioni necessarie e sufficienti. Spec: specs/exercises/logica-implicazione.md
 *
 * Seven levels in the order of the lesson: the truth value of an implication about a number, the
 * inverse, contrary and contrapositive, the truth table of a proposition with → or ↔, logical
 * implication and equivalence (tautologies), necessary and sufficient conditions, truth sets in a finite
 * universe, the negation of an implication. Propositions are small formula trees, evaluated here on every
 * row; sentences in words are assembled from pieces kept in params, so the checker rebuilds both the text
 * and the truth value from the pieces.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SetAnswer } from '../types';
import { type El, assembleChoice, diff, fitSetChoice, inter, norm, range, setOption, setTex, shuffle, textBlock } from '../insiemi';

export const ID = 'logica-implicazione';
const PROMPT = 'Scegli la risposta corretta.';

// ---------------------------------------------------------------------------
// Propositions

type Bin = 'and' | 'or' | 'imp' | 'iff';
export type F = { t: 'v'; v: string } | { t: 'not'; a: F } | { t: Bin; a: F; b: F };

const V = (v: string): F => ({ t: 'v', v });
const not = (a: F): F => ({ t: 'not', a });
/** Negation of a letter or of a negated letter, without ¬¬: the negation of ¬p is p. */
const neg = (a: F): F => (a.t === 'not' ? a.a : not(a));
const bin = (t: Bin, a: F, b: F): F => ({ t, a, b });
const imp = (a: F, b: F) => bin('imp', a, b);
const and = (a: F, b: F) => bin('and', a, b);
const or = (a: F, b: F) => bin('or', a, b);
const iff = (a: F, b: F) => bin('iff', a, b);

export function ser(f: F): string {
	if (f.t === 'v') return f.v;
	if (f.t === 'not') return `not(${ser(f.a)})`;
	return `${f.t}(${ser(f.a)},${ser(f.b)})`;
}

const OP: Record<Bin, string> = { and: '\\wedge', or: '\\vee', imp: '\\to', iff: '\\leftrightarrow' };

/** LaTeX as in the lesson: ¬ binds to a letter, every binary part of a binary one in brackets, except a chain of ∧ (or of ∨). */
export function tex(f: F): string {
	if (f.t === 'v') return f.v;
	if (f.t === 'not') return f.a.t === 'v' || f.a.t === 'not' ? `\\neg ${tex(f.a)}` : `\\neg(${tex(f.a)})`;
	const w = (c: F) => (c.t === 'v' || c.t === 'not' || (c.t === f.t && (f.t === 'and' || f.t === 'or')) ? tex(c) : `(${tex(c)})`);
	return `${w(f.a)} ${OP[f.t]} ${w(f.b)}`;
}

function ev(f: F, env: Record<string, boolean>): boolean {
	switch (f.t) {
		case 'v':
			return env[f.v];
		case 'not':
			return !ev(f.a, env);
		case 'and':
			return ev(f.a, env) && ev(f.b, env);
		case 'or':
			return ev(f.a, env) || ev(f.b, env);
		case 'imp':
			return !ev(f.a, env) || ev(f.b, env);
		case 'iff':
			return ev(f.a, env) === ev(f.b, env);
	}
}

function letters(...fs: F[]): string[] {
	const out = new Set<string>();
	const walk = (f: F) => {
		if (f.t === 'v') out.add(f.v);
		else if (f.t === 'not') walk(f.a);
		else {
			walk(f.a);
			walk(f.b);
		}
	};
	fs.forEach(walk);
	return [...out].sort();
}

/** Rows of the truth table in the order of the lesson: V V, V F, F V, F F. */
function rows(vars: string[]): Record<string, boolean>[] {
	return Array.from({ length: 2 ** vars.length }, (_, i) => Object.fromEntries(vars.map((v, j) => [v, ((i >> (vars.length - 1 - j)) & 1) === 0])));
}

const column = (f: F, vars: string[]) => rows(vars).map((r) => ev(f, r));
const equivalent = (a: F, b: F) => {
	const vs = letters(a, b);
	return rows(vs).every((r) => ev(a, r) === ev(b, r));
};
const tautology = (f: F) => rows(letters(f)).every((r) => ev(f, r));

const TV = (b: boolean) => (b ? '\\text{V}' : '\\text{F}');
const envTex = (r: Record<string, boolean>) =>
	Object.keys(r)
		.sort()
		.map((v) => `${v} = ${TV(r[v])}`)
		.join(',\\ ');

/** A ⇒ B or A ⇔ B: the two sides in brackets only when they are an implication or a double implication. */
function metaTex(rel: 'imp' | 'iff', a: F, b: F): string {
	const m = (c: F) => (c.t === 'imp' || c.t === 'iff' ? `(${tex(c)})` : tex(c));
	return `${m(a)} ${rel === 'imp' ? '\\Rightarrow' : '\\Leftrightarrow'} ${m(b)}`;
}

/** Non-letter parts of a formula, innermost first (for the steps of a table). */
function parts(f: F): F[] {
	if (f.t === 'v') return [];
	if (f.t === 'not') return f.a.t === 'v' ? [] : [...parts(f.a), f];
	const seen = new Set<string>();
	return [...parts(f.a), ...parts(f.b), f].filter((x) => (seen.has(ser(x)) ? false : (seen.add(ser(x)), true)));
}

/** Prose with inline `$…$` as a LaTeX line for the steps. */
const proseTex = (s: string) => `\\text{${s.replace(/\$([^$]*)\$/g, '}$1\\text{')}}`.replace(/\\text\{\}/g, '');

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer | SetAnswer;
	params: Record<string, unknown>;
}

const shuffled = (rng: Rng, options: ChoiceOption[], correct = 0): ChoiceAnswer => {
	const order = shuffle(
		rng,
		options.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => options[i]), correct: order.indexOf(correct) };
};

// ---------------------------------------------------------------------------
// Level 1: facts about a number

type PredCode = 'pari' | 'dispari' | 'mult' | 'div' | 'divisore' | 'primo' | 'gt' | 'lt';
export interface Pred {
	c: PredCode;
	k?: number;
}

const isPrime = (n: number) => n >= 2 && range(2, Math.floor(Math.sqrt(n))).every((d) => n % d !== 0);

function holds(p: Pred, n: number): boolean {
	const k = p.k ?? 0;
	switch (p.c) {
		case 'pari':
			return n % 2 === 0;
		case 'dispari':
			return n % 2 === 1;
		case 'mult':
		case 'div':
			return n % k === 0;
		case 'divisore':
			return k % n === 0;
		case 'primo':
			return isPrime(n);
		case 'gt':
			return n > k;
		case 'lt':
			return n < k;
	}
}

function predText(p: Pred, n: number): string {
	switch (p.c) {
		case 'pari':
			return `$${n}$ è pari`;
		case 'dispari':
			return `$${n}$ è dispari`;
		case 'mult':
			return `$${n}$ è multiplo di $${p.k}$`;
		case 'div':
			return `$${n}$ è divisibile per $${p.k}$`;
		case 'divisore':
			return `$${n}$ è un divisore di $${p.k}$`;
		case 'primo':
			return `$${n}$ è un numero primo`;
		case 'gt':
			return `$${n} > ${p.k}$`;
		case 'lt':
			return `$${n} < ${p.k}$`;
	}
}

/** Why the fact is true or false, as a formula (empty for the comparisons, which read at sight). */
function predReason(p: Pred, n: number): string {
	const k = p.k ?? 0;
	const division = (a: number, b: number) => (a < b ? `0 < ${a} < ${b}` : a % b === 0 ? `${a} = ${b} \\cdot ${a / b}` : `${a} = ${b} \\cdot ${Math.floor(a / b)} + ${a % b}`);
	switch (p.c) {
		case 'pari':
		case 'dispari':
			return division(n, 2);
		case 'mult':
		case 'div':
			return division(n, k);
		case 'divisore':
			return division(k, n);
		case 'primo': {
			if (isPrime(n)) return `\\text{i suoi soli divisori sono } 1 \\text{ e } ${n}`;
			const d = range(2, n).find((x) => n % x === 0)!;
			return `${n} = ${d} \\cdot ${n / d}`;
		}
		default:
			return '';
	}
}

const PRED_CODES: PredCode[] = ['pari', 'dispari', 'mult', 'div', 'divisore', 'primo', 'gt', 'lt'];

/** A fact about n with the given truth value, of a different kind from `other`. */
function pickPred(rng: Rng, n: number, truth: boolean, other: Pred | null): Pred | null {
	for (let t = 0; t < 40; t++) {
		const c = rng.pick(PRED_CODES);
		if (other && (c === other.c || (['mult', 'div'].includes(c) && ['mult', 'div'].includes(other.c)) || (['pari', 'dispari'].includes(c) && ['pari', 'dispari'].includes(other.c)))) continue;
		let p: Pred;
		if (c === 'mult' || c === 'div') {
			const ks = range(3, 9).filter((k) => k !== n && (n % k === 0) === truth);
			if (!ks.length) continue;
			p = { c, k: rng.pick(ks) };
		} else if (c === 'divisore') {
			const ms = range(10, 60).filter((m) => m !== n && (m % n === 0) === truth);
			if (!ms.length) continue;
			p = { c, k: rng.pick(ms) };
		} else if (c === 'gt' || c === 'lt') {
			const ks = range(Math.max(1, n - 12), n + 12).filter((k) => k !== n);
			p = { c, k: rng.pick(ks) };
		} else p = { c };
		if (holds(p, n) === truth) return p;
	}
	return null;
}

const ROW_CASES = ['VV', 'VF', 'FV', 'FF'] as const;
const valueWord = (b: boolean) => (b ? 'vera' : 'falsa');

function rowOption(pv: boolean, qv: boolean, val: boolean): ChoiceOption {
	const L = (b: boolean) => (b ? 'V' : 'F');
	return {
		latex: `\\begin{gathered} \\text{premessa ${L(pv)}, conseguenza ${L(qv)}} \\\\ \\text{implicazione ${valueWord(val)}} \\end{gathered}`,
		values: [L(pv), L(qv), valueWord(val)],
	};
}

function level1(rng: Rng): Built | null {
	const kase = ROW_CASES[rng.int(0, 3)];
	const pv = kase[0] === 'V',
		qv = kase[1] === 'V';
	const n = rng.int(2, 40);
	const p = pickPred(rng, n, pv, null);
	if (!p) return null;
	const q = pickPred(rng, n, qv, p);
	if (!q) return null;
	const val = !pv || qv;
	// Two rows, each with both values: the row of the two facts and a row with one of them misjudged.
	const flipP = rng.int(0, 1) === 1;
	const [pv2, qv2] = flipP ? [!pv, qv] : [pv, !qv];
	const options = [rowOption(pv, qv, val), rowOption(pv, qv, !val), rowOption(pv2, qv2, true), rowOption(pv2, qv2, false)];
	const answer = shuffled(rng, options);
	const fact = (label: string, pr: Pred, t: boolean) => {
		const r = predReason(pr, n);
		return `\\text{La ${label} “}${proseTex(predText(pr, n))}\\text{” è ${valueWord(t)}}${r ? `\\text{: } ${r}` : ''}`;
	};
	const last = pv && !qv ? '\\text{Premessa vera e conseguenza falsa: è l’unico caso in cui l’implicazione è falsa}' : !pv ? '\\text{Con la premessa falsa l’implicazione è vera, qualunque sia la conseguenza}' : '\\text{Premessa e conseguenza vere: l’implicazione è vera}';
	return {
		prompt: 'Stabilisci se l’implicazione è vera o falsa.',
		problem: textBlock(`Se ${predText(p, n)}, allora ${predText(q, n)}.`),
		solution: `\\text{Premessa ${pv ? 'V' : 'F'}, conseguenza ${qv ? 'V' : 'F'}: l’implicazione è ${valueWord(val)}}`,
		steps: [fact('premessa', p, pv), fact('conseguenza', q, qv), last],
		answer,
		params: { n: String(n), p: predJSON(p), q: predJSON(q), case: kase },
	};
}

const predJSON = (p: Pred) => ({ c: p.c, ...(p.k !== undefined ? { k: String(p.k) } : {}) });
const predFrom = (j: unknown): Pred => {
	const o = j as { c: PredCode; k?: string };
	return { c: o.c, ...(o.k !== undefined ? { k: Number(o.k) } : {}) };
};

// ---------------------------------------------------------------------------
// Everyday sentences (levels 2 and 7)

export interface Atom {
	pos: string;
	neg: string;
}
/** Pairs premise, consequence: short clauses in the first person or impersonal, each with its negation. */
export const PAIRS: [Atom, Atom][] = [
	[
		{ pos: 'piove', neg: 'non piove' },
		{ pos: 'prendo l’ombrello', neg: 'non prendo l’ombrello' },
	],
	[
		{ pos: 'fa freddo', neg: 'non fa freddo' },
		{ pos: 'accendo la stufa', neg: 'non accendo la stufa' },
	],
	[
		{ pos: 'studio', neg: 'non studio' },
		{ pos: 'supero la verifica', neg: 'non supero la verifica' },
	],
	[
		{ pos: 'è domenica', neg: 'non è domenica' },
		{ pos: 'vado allo stadio', neg: 'non vado allo stadio' },
	],
	[
		{ pos: 'ho fame', neg: 'non ho fame' },
		{ pos: 'mangio una mela', neg: 'non mangio una mela' },
	],
	[
		{ pos: 'c’è il sole', neg: 'non c’è il sole' },
		{ pos: 'vado al mare', neg: 'non vado al mare' },
	],
	[
		{ pos: 'finisco i compiti', neg: 'non finisco i compiti' },
		{ pos: 'guardo un film', neg: 'non guardo un film' },
	],
	[
		{ pos: 'il semaforo è rosso', neg: 'il semaforo non è rosso' },
		{ pos: 'mi fermo', neg: 'non mi fermo' },
	],
	[
		{ pos: 'perdo l’autobus', neg: 'non perdo l’autobus' },
		{ pos: 'arrivo tardi', neg: 'non arrivo tardi' },
	],
	[
		{ pos: 'nevica', neg: 'non nevica' },
		{ pos: 'resto a casa', neg: 'non resto a casa' },
	],
	[
		{ pos: 'ho sete', neg: 'non ho sete' },
		{ pos: 'bevo un succo', neg: 'non bevo un succo' },
	],
	[
		{ pos: 'mi alleno', neg: 'non mi alleno' },
		{ pos: 'vinco la gara', neg: 'non vinco la gara' },
	],
	[
		{ pos: 'il telefono è carico', neg: 'il telefono non è carico' },
		{ pos: 'ti chiamo', neg: 'non ti chiamo' },
	],
	[
		{ pos: 'è tardi', neg: 'non è tardi' },
		{ pos: 'vado a dormire', neg: 'non vado a dormire' },
	],
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** A literal over p, q as a clause of the pair. */
function clause(f: F, pair: [Atom, Atom]): string {
	const lit = f.t === 'not' ? f.a : f;
	if (lit.t !== 'v') throw new Error('clause: not a literal');
	const atom = pair[lit.v === 'p' ? 0 : 1];
	return f.t === 'not' ? atom.neg : atom.pos;
}

/** "Se A, B" or "A e B", on one line (for the problem) or two (for an option). */
function sentence(f: F, pair: [Atom, Atom], twoLines: boolean): string {
	if (f.t !== 'imp' && f.t !== 'and') throw new Error('sentence: not an implication or a conjunction');
	const a = clause(f.a, pair),
		b = clause(f.b, pair);
	const [l1, l2] = f.t === 'imp' ? [`Se ${a},`, b] : [cap(a), `e ${b}`];
	return twoLines ? `\\begin{gathered} \\text{${l1}} \\\\ \\text{${l2}} \\end{gathered}` : `${l1} ${l2}`;
}

// ---------------------------------------------------------------------------
// Level 2: inverse, contrary, contrapositive

export const FORMS = ['inversa', 'contraria', 'contronominale'] as const;
type Form = (typeof FORMS)[number];

function formOf(form: Form | 'negazione', x: F, y: F): F {
	switch (form) {
		case 'inversa':
			return imp(y, x);
		case 'contraria':
			return imp(neg(x), neg(y));
		case 'contronominale':
			return imp(neg(y), neg(x));
		case 'negazione':
			return and(x, neg(y));
	}
}

const FORM_RULE: Record<Form | 'negazione', string> = {
	inversa: '\\text{L’inversa scambia premessa e conseguenza}',
	contraria: '\\text{La contraria nega la premessa e la conseguenza, senza scambiarle}',
	contronominale: '\\text{La contronominale scambia premessa e conseguenza e le nega tutte e due}',
	negazione: '\\text{La negazione dice che la premessa è vera e la conseguenza è falsa}',
};

function literalPair(rng: Rng): [F, F] {
	const [a, b] = rng.int(0, 1) ? ['p', 'q'] : ['q', 'p'];
	const x = rng.int(0, 2) === 0 ? not(V(a)) : V(a);
	const y = rng.int(0, 2) === 0 ? not(V(b)) : V(b);
	return [x, y];
}

const doubleNegSteps = (x: F, y: F): string[] => [x, y].filter((l) => l.t === 'not').map((l) => `\\text{La negazione di } ${tex(l)} \\text{ è } ${tex(neg(l))}`);

function level2(rng: Rng): Built | null {
	if (rng.next() < 0.5) {
		const [x, y] = literalPair(rng);
		const ask = rng.pick(FORMS);
		const forms = FORMS.map((f) => formOf(f, x, y));
		// A fourth implication with only one of the two negated, or the implication itself.
		const extra = rng.pick([imp(neg(x), y), imp(x, neg(y)), imp(neg(y), x), imp(y, neg(x)), imp(x, y)]);
		const opts = [...forms, extra].map((f) => ({ latex: tex(f), values: [ser(f)] }));
		const correct = FORMS.indexOf(ask);
		const answer = shuffled(rng, opts, correct);
		const right = forms[correct];
		const negs = doubleNegSteps(x, y);
		return {
			prompt: `Qual è la ${ask} di questa implicazione?`,
			problem: tex(imp(x, y)),
			solution: tex(right),
			steps: [
				`${FORM_RULE[ask]}\\text{: } ${tex(right)}`,
				...(ask === 'inversa' ? [] : negs),
				ask === 'contronominale' ? '\\text{È l’unica delle tre forme equivalente all’implicazione}' : '\\text{Non è equivalente all’implicazione: lo è solo la contronominale}',
			],
			answer,
			params: { variant: 'simboli', x: ser(x), y: ser(y), ask },
		};
	}
	const pi = rng.int(0, PAIRS.length - 1);
	const pair = PAIRS[pi];
	const form = rng.pick([...FORMS, 'negazione'] as const);
	const orig = imp(V('p'), V('q'));
	const other = formOf(form, V('p'), V('q'));
	const labels = [...FORMS, 'negazione'];
	const opts = labels.map((l) => ({ latex: `\\text{${l}}`, values: [l] }));
	const answer = shuffled(rng, opts, labels.indexOf(form));
	return {
		prompt: PROMPT,
		problem: textBlock(`L’implicazione è “${sentence(orig, pair, false)}”. Rispetto a questa, che cosa è la frase “${sentence(other, pair, false)}”?`),
		solution: `\\text{${cap(form)}}`,
		steps: [
			`\\text{Con } p\\text{: “${clause(V('p'), pair)}” e } q\\text{: “${clause(V('q'), pair)}”, l’implicazione è } ${tex(orig)}`,
			`\\text{La frase è } ${tex(other)}`,
			`${FORM_RULE[form]}\\text{: è la ${form}}`,
		],
		answer,
		params: { variant: 'parole', pair: String(pi), form },
	};
}

// ---------------------------------------------------------------------------
// Level 3: a column of a truth table

export const TABLE_SHAPES = ['imp', 'iff', 'neg', 'and', 'or'] as const;
type Shape = (typeof TABLE_SHAPES)[number];

function tableFormula(rng: Rng, shape: Shape): F {
	const [x, y] = literalPair(rng);
	const z = rng.pick([V('p'), V('q'), not(V('p')), not(V('q'))]);
	switch (shape) {
		case 'imp':
			return imp(x, y);
		case 'iff':
			return iff(x, y);
		case 'neg':
			return not(imp(x, y));
		case 'and':
			return and(imp(x, y), z);
		case 'or':
			return or(imp(x, y), z);
	}
}

/** Formulas a student gets by mistake: → read backwards, as ∧, as ↔; ↔ as →; the outer ¬ dropped; ∧ and ∨ swapped. */
function mistakes(f: F): F[] {
	if (f.t === 'v') return [];
	if (f.t === 'not') return [f.a, ...mistakes(f.a).map(not)];
	const here: F[] = [];
	if (f.t === 'imp') here.push(imp(f.b, f.a), and(f.a, f.b), iff(f.a, f.b));
	if (f.t === 'iff') here.push(imp(f.a, f.b), and(f.a, f.b));
	if (f.t === 'and') here.push(or(f.a, f.b));
	if (f.t === 'or') here.push(and(f.a, f.b));
	return [...here, ...mistakes(f.a).map((a) => bin(f.t as Bin, a, f.b)), ...mistakes(f.b).map((b) => bin(f.t as Bin, f.a, b))];
}

const colKey = (c: boolean[]) => c.map((b) => (b ? 'V' : 'F')).join('');
const colOption = (c: boolean[]): ChoiceOption => ({ latex: `\\text{${c.map((b) => (b ? 'V' : 'F')).join(', ')}}`, values: c.map((b) => (b ? '1' : '0')) });

function tableTex(f: F): string {
	const body = rows(['p', 'q'])
		.map((r) => `${TV(r.p)} & ${TV(r.q)} & ?`)
		.join(' \\\\ ');
	return `\\begin{array}{c|c|c} p & q & ${tex(f)} \\\\ \\hline ${body} \\end{array}`;
}

function level3(rng: Rng): Built | null {
	const u = rng.next();
	const shape: Shape = u < 0.25 ? 'imp' : u < 0.4 ? 'iff' : u < 0.55 ? 'neg' : u < 0.8 ? 'and' : 'or';
	const f = tableFormula(rng, shape);
	const vars = ['p', 'q'];
	const truth = column(f, vars);
	const wrongCols = new Map<string, boolean[]>();
	for (const m of shuffle(rng, mistakes(f))) {
		const c = column(m, vars);
		if (colKey(c) !== colKey(truth)) wrongCols.set(colKey(c), c);
	}
	// Fallback: the right column with one row changed.
	for (const i of shuffle(rng, [0, 1, 2, 3])) {
		const c = truth.map((b, j) => (j === i ? !b : b));
		wrongCols.set(colKey(c), wrongCols.get(colKey(c)) ?? c);
	}
	const answer = assembleChoice(rng, colOption(truth), [...wrongCols.values()].map(colOption));
	if (!answer) return null;
	const ps = parts(f);
	const steps = rows(vars).map((r) => `${envTex(r)}\\text{: } ${ps.map((x) => `${tex(x)} = ${TV(ev(x, r))}`).join(',\\ ')}`);
	return {
		prompt: 'Qual è la colonna di questa proposizione, dall’alto in basso?',
		problem: `\\begin{array}{l} ${tableTex(f)} \\end{array}`,
		solution: `\\text{${truth.map((b) => (b ? 'V' : 'F')).join(', ')}}`,
		steps: [f.t === 'iff' ? '\\text{La doppia implicazione è vera quando i due lati hanno lo stesso valore}' : '\\text{Un’implicazione è falsa solo con la premessa vera e la conseguenza falsa}', ...steps],
		answer,
		params: { formula: ser(f), case: shape },
	};
}

// ---------------------------------------------------------------------------
// Level 4: logical implication and equivalence

type Meta = { rel: 'imp' | 'iff'; a: F; b: F };
const metaTautology = (m: Meta) => tautology(m.rel === 'imp' ? imp(m.a, m.b) : iff(m.a, m.b));

function metaPool(a: F, b: F): Meta[] {
	const I = (x: F, y: F): Meta => ({ rel: 'imp', a: x, b: y });
	const E = (x: F, y: F): Meta => ({ rel: 'iff', a: x, b: y });
	const ab = imp(a, b);
	return [
		// valid
		I(and(ab, a), b),
		I(and(ab, neg(b)), neg(a)),
		E(ab, imp(neg(b), neg(a))),
		E(ab, or(neg(a), b)),
		E(not(ab), and(a, neg(b))),
		I(iff(a, b), ab),
		E(iff(a, b), and(ab, imp(b, a))),
		I(neg(a), ab),
		I(b, ab),
		E(imp(b, a), imp(neg(a), neg(b))),
		// not valid: the mistakes of the lesson
		I(and(ab, b), a),
		I(and(ab, neg(a)), neg(b)),
		E(ab, imp(b, a)),
		E(ab, imp(neg(a), neg(b))),
		E(not(ab), imp(a, neg(b))),
		E(not(ab), imp(neg(a), neg(b))),
		I(ab, iff(a, b)),
		I(ab, imp(b, a)),
		E(ab, or(a, neg(b))),
		I(neg(a), not(ab)),
	];
}

const metaOption = (m: Meta): ChoiceOption => ({ latex: metaTex(m.rel, m.a, m.b), values: [m.rel, ser(m.a), ser(m.b)] });

function metaReason(m: Meta): string {
	const vars = letters(m.a, m.b);
	const f = m.rel === 'imp' ? imp(m.a, m.b) : iff(m.a, m.b);
	if (tautology(f)) return `${metaTex(m.rel, m.a, m.b)}\\text{: vera, } ${tex(f)} \\text{ è vera in tutte le righe}`;
	const r = rows(vars).find((x) => !ev(f, x))!;
	const why = m.rel === 'imp' ? 'la prima è vera e la seconda è falsa' : `la prima è ${valueWord(ev(m.a, r))} e la seconda è ${valueWord(ev(m.b, r))}`;
	return `${metaTex(m.rel, m.a, m.b)}\\text{: falsa, con } ${envTex(r)} \\text{ ${why}}`;
}

function level4(rng: Rng): Built | null {
	const ask = rng.int(0, 1) ? 'vera' : 'falsa';
	const [a, b] = rng.int(0, 1) ? [V('p'), V('q')] : [V('q'), V('p')];
	const pool = metaPool(a, b);
	const want = ask === 'vera';
	const right = shuffle(
		rng,
		pool.filter((m) => metaTautology(m) === want),
	);
	const wrong = shuffle(
		rng,
		pool.filter((m) => metaTautology(m) !== want),
	);
	const answer = assembleChoice(rng, metaOption(right[0]), wrong.map(metaOption));
	if (!answer) return null;
	const shown: Meta[] = answer.options.map((o) => pool.find((m) => metaOption(m).latex === o.latex)!);
	return {
		prompt: PROMPT,
		problem: `\\text{Quale di queste affermazioni è ${ask}?}`,
		solution: answer.options[answer.correct].latex,
		steps: ['\\text{Si scrive } A \\Rightarrow B \\text{ quando } A \\to B \\text{ è una tautologia, e } A \\Leftrightarrow B \\text{ quando lo è } A \\leftrightarrow B', ...shown.map(metaReason)],
		answer,
		params: { ask, case: ask },
	};
}

// ---------------------------------------------------------------------------
// Level 5: necessary and sufficient conditions

type CondCode = 'mult' | 'pari' | 'dispari' | 'divisore' | 'gt' | 'ge' | 'eq' | 'pm' | 'sq' | 'cifra0' | 'mult2';
export interface Cond {
	c: CondCode;
	a?: number;
	b?: number;
}

const isInt = (c: Cond) => c.c === 'eq' || c.c === 'pm' || c.c === 'sq';

function condHolds(c: Cond, n: number): boolean {
	const a = c.a ?? 0,
		b = c.b ?? 0;
	switch (c.c) {
		case 'mult':
			return n % a === 0;
		case 'pari':
			return n % 2 === 0;
		case 'dispari':
			return Math.abs(n % 2) === 1;
		case 'divisore':
			return n !== 0 && a % n === 0;
		case 'gt':
			return n > a;
		case 'ge':
			return n >= a;
		case 'eq':
			return n === a;
		case 'pm':
			return n === a || n === -a;
		case 'sq':
			return n * n === a;
		case 'cifra0':
			return n % 10 === 0;
		case 'mult2':
			return n % a === 0 && n % b === 0;
	}
}

function condText(c: Cond): string {
	const v = isInt(c) ? 'x' : 'n';
	switch (c.c) {
		case 'mult':
			return `$n$ è multiplo di $${c.a}$`;
		case 'pari':
			return '$n$ è pari';
		case 'dispari':
			return '$n$ è dispari';
		case 'divisore':
			return `$n$ è un divisore di $${c.a}$`;
		case 'gt':
			return `$n > ${c.a}$`;
		case 'ge':
			return `$n \\ge ${c.a}$`;
		case 'eq':
			return `$${v} = ${c.a}$`;
		case 'pm':
			return `$x = ${c.a}$ o $x = -${c.a}$`;
		case 'sq':
			return `$x^2 = ${c.a}$`;
		case 'cifra0':
			return 'l’ultima cifra di $n$ è $0$';
		case 'mult2':
			return `$n$ è multiplo di $${c.a}$ e di $${c.b}$`;
	}
}

export const NS = ['sufficiente', 'necessaria', 'entrambe', 'nessuna'] as const;
type NSCase = (typeof NS)[number];
export const NS_LABEL: Record<NSCase, string> = {
	sufficiente: 'sufficiente ma non necessaria',
	necessaria: 'necessaria ma non sufficiente',
	entrambe: 'necessaria e sufficiente',
	nessuna: 'né necessaria né sufficiente',
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** A ⇒ B and not B ⇒ A, built from a family chosen at random. */
function sufficientPair(rng: Rng): [Cond, Cond] {
	switch (rng.int(0, 4)) {
		case 0: {
			const b = rng.int(3, 6);
			const a = b * rng.int(2, 4);
			return [
				{ c: 'mult', a },
				{ c: 'mult', a: b },
			];
		}
		case 1:
			return [{ c: 'mult', a: rng.pick([4, 6, 8, 10, 12]) }, { c: 'pari' }];
		case 2: {
			const a = rng.int(1, 9) * (rng.int(0, 3) === 0 ? -1 : 1);
			return [
				{ c: 'eq', a },
				{ c: 'sq', a: a * a },
			];
		}
		case 3: {
			const b = rng.int(1, 15);
			return [
				{ c: 'gt', a: b + rng.int(1, 10) },
				{ c: 'gt', a: b },
			];
		}
		default: {
			const m = rng.pick([4, 5, 6, 8, 9, 10, 12]);
			return [
				{ c: 'divisore', a: m },
				{ c: 'divisore', a: m * rng.int(2, Math.floor(60 / m)) },
			];
		}
	}
}

function equivalentPair(rng: Rng): [Cond, Cond] {
	switch (rng.int(0, 3)) {
		case 0:
			return [{ c: 'mult', a: 10 }, { c: 'cifra0' }];
		case 1: {
			const [a, b] = rng.pick([
				[2, 3],
				[2, 5],
				[2, 7],
				[3, 4],
				[3, 5],
				[3, 7],
				[4, 5],
				[4, 7],
				[5, 6],
				[5, 7],
			]);
			return [
				{ c: 'mult2', a, b },
				{ c: 'mult', a: a * b },
			];
		}
		case 2: {
			const a = rng.int(1, 9);
			return [
				{ c: 'pm', a },
				{ c: 'sq', a: a * a },
			];
		}
		default: {
			const k = rng.int(1, 20);
			return [
				{ c: 'gt', a: k },
				{ c: 'ge', a: k + 1 },
			];
		}
	}
}

function neitherPair(rng: Rng): [Cond, Cond] {
	switch (rng.int(0, 3)) {
		case 0: {
			const all = range(2, 9).flatMap((a) => range(2, 9).map((b) => [a, b]));
			const [a, b] = rng.pick(all.filter(([a, b]) => a % b !== 0 && b % a !== 0));
			return [
				{ c: 'mult', a },
				{ c: 'mult', a: b },
			];
		}
		case 1:
			return [{ c: 'pari' }, { c: 'mult', a: rng.pick([3, 5, 7, 9]) }];
		case 2:
			return [{ c: 'dispari' }, { c: 'mult', a: rng.pick([3, 5, 7, 9]) }];
		default: {
			const all = range(6, 36).flatMap((a) => range(6, 36).map((b) => [a, b]));
			const [a, b] = rng.pick(all.filter(([a, b]) => a % b !== 0 && b % a !== 0 && gcd(a, b) > 1));
			return [
				{ c: 'divisore', a },
				{ c: 'divisore', a: b },
			];
		}
	}
}

/** The domain searched for counterexamples: ℕ from 0, ℤ as 0, 1, −1, 2, −2, … */
const domain = (int: boolean): number[] => (int ? [0, ...range(1, 200).flatMap((k) => [k, -k])] : range(0, 2000));

function implies(a: Cond, b: Cond): number | null {
	for (const n of domain(isInt(a))) if (condHolds(a, n) && !condHolds(b, n)) return n;
	return null;
}

/** Why A ⇒ B, for the pairs the level builds. */
function whyImplies(a: Cond, b: Cond): string {
	const A = a.a ?? 0,
		B = b.a ?? 0;
	if (a.c === 'mult' && b.c === 'mult') return `${A} = ${B} \\cdot ${A / B}\\text{, quindi ogni multiplo di } ${A} \\text{ è multiplo di } ${B}`;
	if (a.c === 'mult' && b.c === 'pari') return `${A} \\text{ è pari, quindi ogni multiplo di } ${A} \\text{ è pari}`;
	if (a.c === 'eq' && b.c === 'sq') return A < 0 ? `(${A})^2 = ${B}` : `${A}^2 = ${B}`;
	if (a.c === 'pm' && b.c === 'sq') return `${A}^2 = (-${A})^2 = ${B}`;
	if (a.c === 'sq' && b.c === 'pm') return `\\text{i numeri interi con il quadrato uguale a } ${A} \\text{ sono } ${B} \\text{ e } -${B}`;
	if (a.c === 'gt' && b.c === 'gt') return `${A} > ${B}\\text{, quindi un numero maggiore di } ${A} \\text{ è maggiore di } ${B}`;
	if ((a.c === 'gt' && b.c === 'ge') || (a.c === 'ge' && b.c === 'gt')) return `\\text{tra i naturali, il primo maggiore di } ${Math.min(A, B)} \\text{ è } ${Math.max(A, B)}`;
	if (a.c === 'divisore' && b.c === 'divisore') return `${B} = ${A} \\cdot ${B / A}\\text{, quindi ogni divisore di } ${A} \\text{ è un divisore di } ${B}`;
	if ((a.c === 'mult' && b.c === 'cifra0') || (a.c === 'cifra0' && b.c === 'mult')) return '\\text{è il criterio di divisibilità per } 10';
	if (a.c === 'mult' && b.c === 'mult2') return `${A} = ${b.a} \\cdot ${b.b}\\text{, quindi ogni multiplo di } ${A} \\text{ è multiplo di } ${b.a} \\text{ e di } ${b.b}`;
	if (a.c === 'mult2' && b.c === 'mult') return `${a.a} \\text{ e } ${a.b} \\text{ non hanno divisori comuni oltre a } 1\\text{, quindi un multiplo di tutti e due è multiplo di } ${B}`;
	throw new Error(`whyImplies: no reason for ${a.c} ⇒ ${b.c}`);
}

function level5(rng: Rng): Built | null {
	const kase = NS[rng.int(0, 3)];
	let A: Cond, B: Cond;
	if (kase === 'sufficiente') [A, B] = sufficientPair(rng);
	else if (kase === 'necessaria') [B, A] = sufficientPair(rng);
	else if (kase === 'entrambe') [A, B] = rng.int(0, 1) ? equivalentPair(rng) : (equivalentPair(rng).reverse() as [Cond, Cond]);
	else [A, B] = rng.int(0, 1) ? neitherPair(rng) : (neitherPair(rng).reverse() as [Cond, Cond]);
	const int = isInt(A);
	const v = int ? 'x' : 'n';
	const ab = implies(A, B),
		ba = implies(B, A);
	const opts = NS.map((k) => ({ latex: `\\text{${NS_LABEL[k]}}`, values: [k] }));
	const answer = shuffled(rng, opts, NS.indexOf(kase));
	const counter = (c: number, first: string, second: string) => `\\text{con } ${v} = ${c} \\text{ la ${first} è vera e la ${second} è falsa}`;
	return {
		prompt: 'Che condizione è la prima per la seconda?',
		problem: textBlock(`“${condText(A)}” per “${condText(B)}”, con $${v}$ ${int ? 'intero' : 'naturale'}.`),
		solution: `\\text{${cap(NS_LABEL[kase])}}`,
		steps: [
			ab === null ? `\\text{È sufficiente: } ${whyImplies(A, B)}` : `\\text{Non è sufficiente: } ${counter(ab, 'prima', 'seconda')}`,
			ba === null ? `\\text{È necessaria: } ${whyImplies(B, A)}` : `\\text{Non è necessaria: } ${counter(ba, 'seconda', 'prima')}`,
		],
		answer,
		params: { A: condJSON(A), B: condJSON(B), case: kase },
	};
}

type Coded = { c: string; a?: number; b?: number };
const condJSON = (c: Coded) => Object.fromEntries(Object.entries(c).map(([k, x]) => [k, typeof x === 'number' ? String(x) : x]));
function condFrom<T extends Coded>(j: unknown): T {
	const o = j as Record<string, string>;
	return { c: o.c, ...(o.a !== undefined ? { a: Number(o.a) } : {}), ...(o.b !== undefined ? { b: Number(o.b) } : {}) } as T;
}

// ---------------------------------------------------------------------------
// Level 6: truth sets in a finite universe

type OpenCode = 'pari' | 'dispari' | 'mult' | 'divisore' | 'gt' | 'ge' | 'lt' | 'le' | 'primo' | 'mult2';
export interface Open {
	c: OpenCode;
	a?: number;
	b?: number;
}

function openHolds(o: Open, x: number): boolean {
	const a = o.a ?? 0,
		b = o.b ?? 0;
	switch (o.c) {
		case 'pari':
			return x % 2 === 0;
		case 'dispari':
			return x % 2 === 1;
		case 'mult':
			return x % a === 0;
		case 'divisore':
			return a % x === 0;
		case 'gt':
			return x > a;
		case 'ge':
			return x >= a;
		case 'lt':
			return x < a;
		case 'le':
			return x <= a;
		case 'primo':
			return isPrime(x);
		case 'mult2':
			return x % a === 0 && x % b === 0;
	}
}

function openTex(o: Open): string {
	switch (o.c) {
		case 'pari':
			return 'x \\text{ è pari}';
		case 'dispari':
			return 'x \\text{ è dispari}';
		case 'mult':
			return `x \\text{ è multiplo di } ${o.a}`;
		case 'divisore':
			return `x \\text{ è un divisore di } ${o.a}`;
		case 'gt':
			return `x > ${o.a}`;
		case 'ge':
			return `x \\ge ${o.a}`;
		case 'lt':
			return `x < ${o.a}`;
		case 'le':
			return `x \\le ${o.a}`;
		case 'primo':
			return 'x \\text{ è primo}';
		case 'mult2':
			return `x \\text{ è multiplo di } ${o.a} \\text{ e di } ${o.b}`;
	}
}

function randomOpen(rng: Rng, N: number): Open {
	switch (rng.int(0, 6)) {
		case 0:
			return { c: 'pari' };
		case 1:
			return { c: 'dispari' };
		case 2:
			return { c: 'mult', a: rng.int(3, 6) };
		case 3:
			return { c: 'divisore', a: rng.pick([12, 18, 20, 24, 30, 36]) };
		case 4:
			return { c: 'gt', a: rng.int(2, N - 3) };
		case 5:
			return { c: 'lt', a: rng.int(4, N - 1) };
		default:
			return { c: 'primo' };
	}
}

function equivalentOpen(rng: Rng, N: number): [Open, Open] {
	switch (rng.int(0, 2)) {
		case 0: {
			const k = rng.int(2, N - 3);
			return [
				{ c: 'gt', a: k },
				{ c: 'ge', a: k + 1 },
			];
		}
		case 1: {
			const k = rng.int(4, N - 1);
			return [
				{ c: 'lt', a: k },
				{ c: 'le', a: k - 1 },
			];
		}
		default: {
			const [a, b] = rng.pick([
				[2, 3],
				[2, 5],
				[3, 4],
			] as [number, number][]);
			return [
				{ c: 'mult2', a, b },
				{ c: 'mult', a: a * b },
			];
		}
	}
}

export const RELATIONS = ['pq', 'qp', 'eq', 'nessuna'] as const;
type Relation = (typeof RELATIONS)[number];
const REL_OPTION: Record<Relation, string> = {
	pq: '\\text{solo } p(x) \\Rightarrow q(x)',
	qp: '\\text{solo } q(x) \\Rightarrow p(x)',
	eq: 'p(x) \\Leftrightarrow q(x)',
	nessuna: '\\text{nessuna implicazione}',
};

const subsetOf = (a: number[], b: number[]) => a.every((x) => b.includes(x));
function relationOf(Vp: number[], Vq: number[]): Relation {
	const pq = subsetOf(Vp, Vq),
		qp = subsetOf(Vq, Vp);
	return pq && qp ? 'eq' : pq ? 'pq' : qp ? 'qp' : 'nessuna';
}

function level6(rng: Rng): Built | null {
	const N = rng.pick([10, 12, 15, 20]);
	const U = range(1, N);
	const variant = rng.next() < 0.5 ? 'relazione' : 'controesempi';
	const target: Relation = variant === 'relazione' ? RELATIONS[rng.int(0, 3)] : rng.pick(['qp', 'nessuna'] as const);
	let p: Open | null = null,
		q: Open | null = null;
	for (let t = 0; t < 300; t++) {
		let a: Open, b: Open;
		if (target === 'eq') [a, b] = rng.int(0, 1) ? equivalentOpen(rng, N) : (equivalentOpen(rng, N).reverse() as [Open, Open]);
		else [a, b] = [randomOpen(rng, N), randomOpen(rng, N)];
		const Va = U.filter((x) => openHolds(a, x)),
			Vb = U.filter((x) => openHolds(b, x));
		if (Va.length === 0 || Vb.length === 0 || Va.length === N || Vb.length === N) continue;
		if (relationOf(Va, Vb) !== target) continue;
		if (target === 'nessuna' && inter(Va, Vb).length === 0 && rng.next() < 0.7) continue;
		[p, q] = [a, b];
		break;
	}
	if (!p || !q) return null;
	const Vp = U.filter((x) => openHolds(p, x)),
		Vq = U.filter((x) => openHolds(q, x));
	const head = [`U = \\{1, 2, 3, \\dots, ${N}\\}`, `p(x)\\text{: } ${openTex(p)}`, `q(x)\\text{: } ${openTex(q)}`];
	const sets = [`V_p = ${setTex(Vp)}`, `V_q = ${setTex(Vq)}`];
	const params = { N: String(N), p: condJSON(p), q: condJSON(q), variant, case: target };
	const witness = (a: number[], b: number[]) => a.find((x) => !b.includes(x));
	if (variant === 'relazione') {
		const opts = RELATIONS.map((r) => ({ latex: REL_OPTION[r], values: [r] }));
		const answer = shuffled(rng, opts, RELATIONS.indexOf(target));
		const wp = witness(Vp, Vq),
			wq = witness(Vq, Vp);
		return {
			prompt: 'Quale relazione c’è tra p(x) e q(x) nell’universo U?',
			problem: `\\begin{array}{l} ${head.join(' \\\\ ')} \\end{array}`,
			solution: REL_OPTION[target],
			steps: [
				...sets,
				wp === undefined ? `V_p \\subseteq V_q\\text{, quindi } p(x) \\Rightarrow q(x)` : `${wp} \\in V_p \\text{ ma } ${wp} \\notin V_q\\text{: } p(x) \\text{ non implica } q(x)`,
				wq === undefined ? `V_q \\subseteq V_p\\text{, quindi } q(x) \\Rightarrow p(x)` : `${wq} \\in V_q \\text{ ma } ${wq} \\notin V_p\\text{: } q(x) \\text{ non implica } p(x)`,
			],
			answer,
			params,
		};
	}
	const truth = diff(Vp, Vq) as number[];
	// The counterexamples of the inverse first, then the other regions, then the answer with one element more or less.
	const out = diff(U, truth);
	const near = [[...truth, out[0]], [...truth, out[out.length - 1]], truth.length > 1 ? truth.slice(1) : []];
	const wrong = [diff(Vq, Vp), inter(Vp, Vq), Vp, Vq, diff(U, norm([...Vp, ...Vq])), ...near].filter((w) => w.length > 0).map((w) => norm(w).map(String));
	const answer: SetAnswer = { kind: 'set', values: truth.map(String), latex: setTex(truth) };
	return {
		prompt: 'Trova tutti i controesempi di questa implicazione.',
		problem: `\\begin{array}{l} ${[...head, 'p(x) \\Rightarrow q(x)'].join(' \\\\ ')} \\end{array}`,
		solution: setTex(truth),
		steps: [...sets, `\\text{Un controesempio rende vera } p(x) \\text{ e falsa } q(x)\\text{: sta in } V_p \\text{ ma non in } V_q`, `V_p \\setminus V_q = ${setTex(truth)}`],
		answer,
		params: { ...params, wrong },
	};
}

// ---------------------------------------------------------------------------
// Level 7: negation of an implication

function level7(rng: Rng): Built | null {
	const u = rng.next();
	if (u < 0.4) {
		const pi = rng.int(0, PAIRS.length - 1);
		const pair = PAIRS[pi];
		const p = V('p'),
			q = V('q');
		const orig = imp(p, q);
		const right = and(p, not(q));
		const wrong = shuffle(rng, [imp(p, not(q)), imp(not(p), not(q)), and(not(p), not(q)), and(not(p), q)]).slice(0, 3);
		const opt = (f: F): ChoiceOption => ({ latex: sentence(f, pair, true), values: [ser(f)] });
		const answer = shuffled(rng, [right, ...wrong].map(opt));
		return {
			prompt: 'Qual è la negazione di questa frase?',
			problem: textBlock(`“${sentence(orig, pair, false)}”`),
			solution: `\\text{“${sentence(right, pair, false)}”}`,
			steps: [
				`\\text{Con } p\\text{: “${pair[0].pos}” e } q\\text{: “${pair[1].pos}”, la frase è } ${tex(orig)}`,
				`\\neg(p \\to q) \\Leftrightarrow p \\wedge \\neg q\\text{: la premessa è vera e la conseguenza è falsa}`,
				...wrong.map((w) => wrongReason(w, orig)),
			],
			answer,
			params: { variant: 'parole', pair: String(pi), case: 'parole' },
		};
	}
	if (u < 0.7) {
		const [x, y] = literalPair(rng);
		const orig = imp(x, y);
		const right = and(x, neg(y));
		const wrong = shuffle(rng, [imp(x, neg(y)), imp(neg(x), neg(y)), and(neg(x), neg(y)), and(neg(x), y)]).slice(0, 3);
		const answer = shuffled(
			rng,
			[right, ...wrong].map((f) => ({ latex: tex(f), values: [ser(f)] })),
		);
		return {
			prompt: 'Qual è la negazione di questa implicazione?',
			problem: tex(orig),
			solution: tex(right),
			steps: [
				`\\neg(${tex(orig)}) \\Leftrightarrow ${tex(right)}\\text{: la premessa è vera e la conseguenza è falsa}`,
				...(y.t === 'not' ? [`\\text{La negazione di } ${tex(y)} \\text{ è } ${tex(neg(y))}`] : []),
				...wrong.map((w) => wrongReason(w, orig)),
			],
			answer,
			params: { variant: 'simboli', formula: ser(orig), case: 'simboli' },
		};
	}
	const x = rng.int(0, 2) === 0 ? not(V('p')) : V('p');
	const y = rng.int(0, 2) === 0 ? not(V('q')) : V('q');
	const z = rng.int(0, 2) === 0 ? not(V('r')) : V('r');
	const op: 'and' | 'or' = rng.int(0, 1) ? 'and' : 'or';
	const dual: 'and' | 'or' = op === 'and' ? 'or' : 'and';
	const orig = imp(x, bin(op, y, z));
	const right = and(x, bin(dual, neg(y), neg(z)));
	const wrong = shuffle(rng, [and(x, bin(op, neg(y), neg(z))), imp(x, bin(dual, neg(y), neg(z))), and(neg(x), bin(dual, neg(y), neg(z))), imp(neg(x), bin(dual, neg(y), neg(z)))]).slice(0, 3);
	const answer = shuffled(
		rng,
		[right, ...wrong].map((f) => ({ latex: tex(f), values: [ser(f)] })),
	);
	const yz = bin(op, y, z);
	return {
		prompt: 'Qual è la negazione di questa implicazione?',
		problem: tex(orig),
		solution: tex(right),
		steps: [
			`\\text{La negazione di un’implicazione è premessa vera e conseguenza falsa: } ${tex(x)} \\wedge \\neg(${tex(yz)})`,
			`\\text{Per la legge di De Morgan, } \\neg(${tex(yz)}) \\Leftrightarrow ${tex(bin(dual, neg(y), neg(z)))}`,
			`\\text{La negazione è } ${tex(right)}`,
			...wrong.map((w) => wrongReason(w, orig)),
		],
		answer,
		params: { variant: 'de morgan', formula: ser(orig), case: 'de morgan' },
	};
}

/** Why an option is not the negation: a row where it has the same value as the implication. */
function wrongReason(w: F, orig: F): string {
	const vars = letters(w, orig);
	const r = rows(vars).find((x) => ev(w, x) === ev(orig, x))!;
	const head = w.t === 'imp' ? '\\text{è un’altra implicazione, non la negazione}' : '\\text{non è la negazione}';
	return `${tex(w)}\\text{: } ${head}\\text{; con } ${envTex(r)} \\text{ ha lo stesso valore dell’implicazione}`;
}

// ---------------------------------------------------------------------------
// Check and choice

function parseF(s: string): F {
	let i = 0;
	const read = (): F => {
		const m = /^[a-z]+/.exec(s.slice(i));
		if (!m) throw new Error(`parseF: ${s}`);
		i += m[0].length;
		if (s[i] !== '(') return V(m[0]);
		i++;
		const a = read();
		if (m[0] === 'not') {
			i++;
			return not(a);
		}
		i++;
		const b = read();
		i++;
		return bin(m[0] as Bin, a, b);
	};
	return read();
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params as Record<string, unknown>;
	const a = sample.answer;
	const one = (ch: ChoiceAnswer, ok: (o: ChoiceOption) => boolean) => {
		if (ch.options.length !== 4) v.push('servono 4 opzioni');
		if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni ripetute');
		const t = ch.options.map(ok);
		if (t.filter(Boolean).length !== 1 || !t[ch.correct]) v.push('non c’è una sola opzione giusta');
	};
	switch (sample.level) {
		case 1: {
			if (a.kind !== 'choice') return ['serve una scelta'];
			const n = Number(p.n);
			const pv = holds(predFrom(p.p), n),
				qv = holds(predFrom(p.q), n);
			const want = [pv ? 'V' : 'F', qv ? 'V' : 'F', valueWord(!pv || qv)].join('|');
			one(a, (o) => o.values.join('|') === want);
			if (p.case !== `${pv ? 'V' : 'F'}${qv ? 'V' : 'F'}`) v.push('caso diverso dai valori');
			break;
		}
		case 2: {
			if (a.kind !== 'choice') return ['serve una scelta'];
			if (p.variant === 'simboli') {
				const want = ser(formOf(p.ask as Form, parseF(String(p.x)), parseF(String(p.y))));
				one(a, (o) => o.values[0] === want);
			} else one(a, (o) => o.values[0] === p.form);
			break;
		}
		case 3: {
			if (a.kind !== 'choice') return ['serve una scelta'];
			const want = column(parseF(String(p.formula)), ['p', 'q'])
				.map((b) => (b ? '1' : '0'))
				.join('');
			one(a, (o) => o.values.join('') === want);
			break;
		}
		case 4: {
			if (a.kind !== 'choice') return ['serve una scelta'];
			const want = p.ask === 'vera';
			one(a, (o) => metaTautology({ rel: o.values[0] as 'imp' | 'iff', a: parseF(o.values[1]), b: parseF(o.values[2]) }) === want);
			break;
		}
		case 5: {
			if (a.kind !== 'choice') return ['serve una scelta'];
			const A = condFrom<Cond>(p.A),
				B = condFrom<Cond>(p.B);
			const s = implies(A, B) === null,
				n = implies(B, A) === null;
			const want = s && n ? 'entrambe' : s ? 'sufficiente' : n ? 'necessaria' : 'nessuna';
			if (want !== p.case) v.push('caso diverso dalla relazione');
			one(a, (o) => o.values[0] === want);
			break;
		}
		case 6: {
			const N = Number(p.N);
			const U = range(1, N);
			const P = condFrom<Open>(p.p),
				Q = condFrom<Open>(p.q);
			const Vp = U.filter((x) => openHolds(P, x)),
				Vq = U.filter((x) => openHolds(Q, x));
			if (!Vp.length || !Vq.length || Vp.length === N || Vq.length === N) v.push('insieme di verità vuoto o uguale a U');
			if (relationOf(Vp, Vq) !== p.case) v.push('caso diverso dalla relazione');
			if (p.variant === 'relazione') {
				if (a.kind !== 'choice') return ['serve una scelta'];
				one(a, (o) => o.values[0] === p.case);
			} else {
				const truth = diff(Vp, Vq).map(String);
				if (a.kind !== 'set' || a.values.join(',') !== truth.join(',')) v.push('controesempi sbagliati');
				if (!truth.length) v.push('nessun controesempio');
			}
			break;
		}
		case 7: {
			if (a.kind !== 'choice') return ['serve una scelta'];
			const orig = p.variant === 'parole' ? imp(V('p'), V('q')) : parseF(String(p.formula));
			one(a, (o) => equivalent(parseF(o.values[0]), not(orig)));
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
	const wrong = ((sample.params.wrong ?? []) as string[][]).map((w) => w.map(Number) as El[]);
	const ch = assembleChoice(rng, setOption(a.values.map(Number)), wrong.map(setOption));
	if (!ch) throw new Error(`${ID}: not enough distractors`);
	return fitSetChoice(ch);
}

const BUILDERS: Record<number, (rng: Rng) => Built | null> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

export const logicaImplicazione: Generator = {
	id: ID,
	title: 'Implicazione, condizioni necessarie e sufficienti',
	levels: {
		1: { label: 'Il valore di verità di un’implicazione', constraints: ['un numero da 2 a 40, due fatti su di lui', 'le quattro righe della tavola un quarto ciascuna'] },
		2: { label: 'Inversa, contraria e contronominale', constraints: ['in simboli con p, q e le negazioni, o a parole con frasi di tutti i giorni'] },
		3: { label: 'La tavola di verità', constraints: ['proposizioni in p e q con → o ↔', 'la colonna dall’alto in basso tra quattro'] },
		4: { label: 'Implicazione logica ed equivalenza', constraints: ['una sola affermazione con ⇒ o ⇔ vera (o falsa) tra quattro'] },
		5: { label: 'Condizioni necessarie e sufficienti', constraints: ['condizioni su n naturale o x intero', 'le quattro risposte un quarto ciascuna'] },
		6: { label: 'Implicazione e insiemi di verità', constraints: ['U = {1, …, N}, N tra 10 e 20', 'relazione tra p(x) e q(x), oppure i controesempi'] },
		7: { label: 'La negazione di un’implicazione', constraints: ['a parole, in simboli, con De Morgan nella conseguenza'] },
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILDERS[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 1000; attempt++) {
			const b = build(rng);
			if (!b) continue;
			const sample: Sample = { generatorId: ID, level, seed: rng.seed, ...b };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default logicaImplicazione;
