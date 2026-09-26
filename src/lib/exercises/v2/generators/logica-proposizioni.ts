/**
 * Proposizioni e connettivi logici. Spec: specs/exercises/logica-proposizioni.md
 *
 * Seven levels in the order of the lesson: recognising propositions, one connective on facts
 * about numbers, a formula evaluated on one row, the truth table with two letters, with three
 * letters, tautologies and equivalent propositions, negating with De Morgan. Every answer is a
 * choice with four options, except "in how many rows is it true", a count.
 *
 * Formulas travel in params and option values in a prefix notation the checker parses:
 * `p`, `not(p)`, `and(p,q)`, `or(p,q)`, `xor(p,q)`. Sentences travel as their pieces (kind and
 * numbers, or indices into the fixed lists below), never as text.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, NumberAnswer, Rng, Sample } from '../types';
import { assembleChoice, lines, numberChoice, shuffle, textBlock } from '../insiemi';

export const ID = 'logica-proposizioni';
const PROMPT = 'Scegli la risposta corretta.';

// ---------------------------------------------------------------------------
// Formulas

type Letter = 'p' | 'q' | 'r';
type Bin = 'and' | 'or' | 'xor';
export type F = { t: 'v'; v: Letter } | { t: 'not'; a: F } | { t: Bin; a: F; b: F };

const v = (x: Letter): F => ({ t: 'v', v: x });
const not = (a: F): F => ({ t: 'not', a });
const bin = (t: Bin, a: F, b: F): F => ({ t, a, b });
const isBin = (f: F): f is { t: Bin; a: F; b: F } => f.t === 'and' || f.t === 'or' || f.t === 'xor';

export function ser(f: F): string {
	if (f.t === 'v') return f.v;
	if (f.t === 'not') return `not(${ser(f.a)})`;
	return `${f.t}(${ser(f.a)},${ser(f.b)})`;
}

export function parse(s: string): F {
	let i = 0;
	const node = (): F => {
		if (/[pqr]/.test(s[i]) && (s[i + 1] === undefined || s[i + 1] === ',' || s[i + 1] === ')')) return v(s[i++] as Letter);
		const m = /^(not|and|or|xor)\(/.exec(s.slice(i));
		if (!m) throw new Error(`parse: ${s} at ${i}`);
		i += m[0].length;
		const a = node();
		if (m[1] === 'not') {
			i++; // )
			return not(a);
		}
		i++; // ,
		const b = node();
		i++; // )
		return bin(m[1] as Bin, a, b);
	};
	const f = node();
	if (i !== s.length) throw new Error(`parse: trailing ${s}`);
	return f;
}

const OP_TEX: Record<Bin, string> = { and: '\\wedge', or: '\\vee', xor: '\\,\\dot\\vee\\,' };
const V_TEX = '\\text{V}';
const F_TEX = '\\text{F}';

/** A formula, or a formula with some parts already evaluated (`c`), as LaTeX. */
type E = F | { t: 'c'; val: boolean } | { t: 'not'; a: E } | { t: Bin; a: E; b: E };

function texE(f: E): string {
	if (f.t === 'c') return f.val ? V_TEX : F_TEX;
	if (f.t === 'v') return f.v;
	if (f.t === 'not') return f.a.t === 'v' || f.a.t === 'c' ? `\\neg ${texE(f.a)}` : `\\neg(${texE(f.a)})`;
	const side = (x: E) => (x.t === 'and' || x.t === 'or' || x.t === 'xor' ? `(${texE(x)})` : texE(x));
	return `${side(f.a)} ${OP_TEX[f.t]} ${side(f.b)}`;
}
export const tex = (f: F): string => texE(f);

export type Env = Partial<Record<Letter, boolean>>;
export function evalF(f: F, env: Env): boolean {
	switch (f.t) {
		case 'v':
			return env[f.v]!;
		case 'not':
			return !evalF(f.a, env);
		case 'and':
			return evalF(f.a, env) && evalF(f.b, env);
		case 'or':
			return evalF(f.a, env) || evalF(f.b, env);
		case 'xor':
			return evalF(f.a, env) !== evalF(f.b, env);
	}
}

/** Rows in the order of the lesson: VV, VF, FV, FF (with three letters VVV, VVF, ..., FFF). */
function rows(letters: readonly Letter[]): Env[] {
	const out: Env[] = [];
	const n = letters.length;
	for (let i = 0; i < 2 ** n; i++) {
		const env: Env = {};
		letters.forEach((l, j) => (env[l] = ((i >> (n - 1 - j)) & 1) === 0));
		out.push(env);
	}
	return out;
}
const VF = (b: boolean) => (b ? 'V' : 'F');
const column = (f: F, letters: readonly Letter[]): string => rows(letters).map((e) => VF(evalF(f, e))).join('');
const rowName = (env: Env, letters: readonly Letter[]) => letters.map((l) => VF(env[l]!)).join('');
const colTex = (col: string) => `\\text{${col.split('').join(', ')}}`;

function conns(f: F): number {
	if (f.t === 'v') return 0;
	if (f.t === 'not') return 1 + conns(f.a);
	return 1 + conns(f.a) + conns(f.b);
}
function lettersOf(f: F, acc = new Set<Letter>()): Set<Letter> {
	if (f.t === 'v') acc.add(f.v);
	else if (f.t === 'not') lettersOf(f.a, acc);
	else {
		lettersOf(f.a, acc);
		lettersOf(f.b, acc);
	}
	return acc;
}
function nodes(f: F): F[] {
	if (f.t === 'v') return [f];
	if (f.t === 'not') return [f, ...nodes(f.a)];
	return [f, ...nodes(f.a), ...nodes(f.b)];
}
const leaves = (f: F): number => nodes(f).filter((n) => n.t === 'v').length;
const neg = (f: F): F => (f.t === 'not' ? f.a : not(f));
const dual = (t: 'and' | 'or'): 'and' | 'or' => (t === 'and' ? 'or' : 'and');

/**
 * No ¬¬, no two equal sides; with `strict`, also no letter next to its own negation
 * (p ∧ ¬p is a contradiction, left to level 6).
 */
function tidy(f: F, strict: boolean): boolean {
	// in the tables, no letter written more than once more than needed and no chain like p ∧ (q ∧ r)
	if (strict && leaves(f) > lettersOf(f).size + 1) return false;
	return nodes(f).every((n) => {
		if (n.t === 'not') return n.a.t !== 'not';
		if (!isBin(n)) return true;
		if (ser(n.a) === ser(n.b)) return false;
		if (strict && (ser(neg(n.a)) === ser(n.b) || ser(n.a) === ser(neg(n.b)))) return false;
		if (strict && n.t !== 'xor' && (n.a.t === n.t || n.b.t === n.t)) return false;
		return true;
	});
}

function randF(rng: Rng, k: number, letters: readonly Letter[], xorP: number): F {
	if (k === 0) return v(rng.pick(letters));
	if (rng.next() < 0.3) return not(randF(rng, k - 1, letters, xorP));
	const kl = rng.int(0, k - 1);
	const u = rng.next();
	const t: Bin = u < xorP ? 'xor' : u < xorP + (1 - xorP) / 2 ? 'and' : 'or';
	return bin(t, randF(rng, kl, letters, xorP), randF(rng, k - 1 - kl, letters, xorP));
}

/** A random formula with exactly k connectives that uses every letter of `need`. */
function formula(rng: Rng, k: number, letters: readonly Letter[], need: readonly Letter[], xorP: number, strict = true): F {
	for (let i = 0; i < 500; i++) {
		const f = randF(rng, k, letters, xorP);
		const ls = lettersOf(f);
		if (conns(f) === k && tidy(f, strict) && need.every((l) => ls.has(l))) return f;
	}
	throw new Error(`${ID}: no formula with ${k} connectives`);
}

/**
 * The evaluation of a formula on one row, as a chain: the letters replaced by V and F, then the
 * innermost connectives computed, one layer at a time.
 */
function chain(f: F, env: Env): string {
	const sub = (x: E): E => {
		if (x.t === 'v') return { t: 'c', val: env[x.v]! };
		if (x.t === 'c') return x;
		if (x.t === 'not') return { t: 'not', a: sub(x.a) };
		return { t: x.t, a: sub(x.a), b: sub(x.b) };
	};
	const layer = (x: E): E => {
		if (x.t === 'c' || x.t === 'v') return x;
		if (x.t === 'not') return x.a.t === 'c' ? { t: 'c', val: !x.a.val } : { t: 'not', a: layer(x.a) };
		if (x.a.t === 'c' && x.b.t === 'c') {
			const a = x.a.val,
				b = x.b.val;
			return { t: 'c', val: x.t === 'and' ? a && b : x.t === 'or' ? a || b : a !== b };
		}
		return { t: x.t, a: layer(x.a), b: layer(x.b) };
	};
	const out: string[] = [];
	let cur = sub(f);
	out.push(texE(cur));
	while (cur.t !== 'c') {
		cur = layer(cur);
		out.push(texE(cur));
	}
	return out.join(' = ');
}

const fOption = (f: F): ChoiceOption => ({ latex: tex(f), values: [ser(f)] });
const colOption = (col: string): ChoiceOption => ({ latex: colTex(col), values: [col] });

// ---------------------------------------------------------------------------
// Sentences

/** An atomic proposition about numbers, as pieces: its kind and its numbers. */
export type Atom = string[];

function isPrime(n: number): boolean {
	if (n < 2) return false;
	for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
	return true;
}
const REL_TEX: Record<string, string> = { '>': '>', '<': '<', '>=': '\\geq', '<=': '\\leq', '=': '=', '!=': '\\neq' };
const REL_NEG: Record<string, string> = { '>': '<=', '<': '>=', '>=': '<', '<=': '>' };
function relHolds(a: number, rel: string, b: number): boolean {
	switch (rel) {
		case '>':
			return a > b;
		case '<':
			return a < b;
		case '>=':
			return a >= b;
		case '<=':
			return a <= b;
		case '=':
			return a === b;
		case '!=':
			return a !== b;
	}
	throw new Error(`rel ${rel}`);
}

function atomTruth(a: Atom): boolean {
	const n = a.slice(1).map((x) => (/^-?\d+$/.test(x) ? Number(x) : NaN));
	switch (a[0]) {
		case 'pari':
			return n[0] % 2 === 0;
		case 'dispari':
			return n[0] % 2 === 1;
		case 'multiplo':
			return n[0] % n[1] === 0;
		case 'primo':
			return isPrime(n[0]);
		case 'divisore':
			return n[1] % n[0] === 0;
		case 'cmp':
			return relHolds(n[0], a[2], Number(a[3]));
		case 'somma':
			return n[0] + n[1] === n[2];
		case 'prodotto':
			return n[0] * n[1] === n[2];
	}
	throw new Error(`atom ${a.join(' ')}`);
}

/** Words of an atom, or null when it is a formula. */
function atomWords(a: Atom): string | null {
	switch (a[0]) {
		case 'pari':
			return `${a[1]} è pari`;
		case 'dispari':
			return `${a[1]} è dispari`;
		case 'multiplo':
			return `${a[1]} è multiplo di ${a[2]}`;
		case 'primo':
			return `${a[1]} è un numero primo`;
		case 'divisore':
			return `${a[1]} è un divisore di ${a[2]}`;
	}
	return null;
}
function atomMath(a: Atom): string {
	if (a[0] === 'cmp') return `${a[1]} ${REL_TEX[a[2]]} ${a[3]}`;
	if (a[0] === 'somma') return `${a[1]} + ${a[2]} = ${a[3]}`;
	if (a[0] === 'prodotto') return `${a[1]} \\cdot ${a[2]} = ${a[3]}`;
	throw new Error(`atom ${a[0]}`);
}

/** An atom about numbers, true or false as asked. `n` fixes the number the sentence is about. */
function randAtom(rng: Rng, truth: boolean, kinds: readonly string[], n?: number): Atom {
	for (let i = 0; i < 500; i++) {
		const kind = rng.pick(kinds);
		const x = n ?? rng.int(2, 40);
		let a: Atom;
		switch (kind) {
			case 'pari':
			case 'dispari':
			case 'primo':
				a = [kind, String(x)];
				break;
			case 'multiplo':
				a = [kind, String(x), String(rng.int(3, 9))];
				if (Number(a[1]) === Number(a[2])) continue;
				break;
			case 'divisore': {
				const m = n ?? rng.int(10, 60);
				const d = rng.int(2, 9);
				a = [kind, String(d), String(m)];
				if (d === m) continue;
				break;
			}
			case 'cmp': {
				const p = rng.int(1, 20),
					q = rng.int(1, 20);
				if (p === q) continue;
				a = [kind, String(p), rng.pick(['>', '<', '>=', '<=']), String(q)];
				break;
			}
			case 'somma': {
				const p = rng.int(2, 12),
					q = rng.int(2, 12);
				a = [kind, String(p), String(q), String(p + q + (truth ? 0 : rng.pick([-1, 1])))];
				break;
			}
			case 'prodotto': {
				const p = rng.int(2, 9),
					q = rng.int(2, 9);
				a = [kind, String(p), String(q), String(p * q + (truth ? 0 : rng.pick([-2, -1, 1, 2])))];
				break;
			}
			default:
				throw new Error(kind);
		}
		if (atomTruth(a) === truth) return a;
	}
	throw new Error(`${ID}: no atom`);
}

/** Facts that are not about numbers, with their truth value (checked one by one). */
export const FACTS: [string, boolean][] = [
	["Roma è la capitale d'Italia", true],
	["Milano è la capitale d'Italia", false],
	["Un'ora ha 60 minuti", true],
	["Un'ora ha 100 minuti", false],
	['Una settimana ha 7 giorni', true],
	['Una settimana ha 8 giorni', false],
	['Un anno ha 12 mesi', true],
	['Un anno ha 10 mesi', false],
	['Parigi è in Francia', true],
	['Parigi è in Spagna', false],
	['Un triangolo ha tre lati', true],
	['Un quadrato ha cinque lati', false],
];
export const QUESTIONS = ['Che ore sono?', 'Come ti chiami?', 'Dove abiti?', 'Che tempo fa?'];
export const ORDERS = ['Apri il quaderno', 'Chiudi la finestra', 'Scrivi la data', 'Leggi il testo'];
export const OPINIONS = [
	'Il calcio è lo sport più bello',
	'La matematica è facile',
	'Il 7 è un bel numero',
	'Le frazioni sono noiose',
	'La pizza è il cibo migliore',
	"L'estate è la stagione più bella",
	'Il blu è il colore più bello',
];

/**
 * A sentence of level 1, as pieces. Propositions: `atom` + an atom, `fatto` + index. Not
 * propositions: `domanda` (fixed or about a number), `ordine` (fixed or a calculation), `opinione`,
 * `aperta` (a sentence with x).
 */
type Sentence = string[];
const isProposition = (s: Sentence) => s[0] === 'atom' || s[0] === 'fatto';
function sentenceTruth(s: Sentence): boolean {
	if (s[0] === 'atom') return atomTruth(s.slice(1));
	if (s[0] === 'fatto') return FACTS[Number(s[1])][1];
	throw new Error('not a proposition');
}

/** Visible length of a text: a LaTeX command counts as one character. */
const visible = (s: string) => s.replace(/\\[a-zA-Z]+\s?/g, 'x').replace(/[{}$]/g, '').length;
export const TEXT_MAX = 26;

/** A text option, on two lines (split at the space nearest to the middle) when it is too long for a button. */
function textOpt(s: string): string {
	if (visible(s) <= TEXT_MAX) return `\\text{${s}}`;
	const words = s.split(' ');
	let best = 1,
		bestD = Infinity;
	for (let i = 1; i < words.length; i++) {
		const d = Math.abs(visible(words.slice(0, i).join(' ')) - visible(words.slice(i).join(' ')));
		if (d < bestD) {
			bestD = d;
			best = i;
		}
	}
	return `\\begin{gathered}\\text{${words.slice(0, best).join(' ')}} \\\\ \\text{${words.slice(best).join(' ')}}\\end{gathered}`;
}

/** A text option written on two lines, back on one (for solutions and steps). */
const oneLine = (t: string) => t.replace(/^\\begin\{gathered\}\\text\{(.*)\} \\\\ \\text\{(.*)\}\\end\{gathered\}$/, '\\text{$1 $2}');

function sentenceTex(s: Sentence): string {
	switch (s[0]) {
		case 'atom': {
			const a = s.slice(1);
			const w = atomWords(a);
			return w ? textOpt(w) : atomMath(a);
		}
		case 'fatto':
			return textOpt(FACTS[Number(s[1])][0]);
		case 'domanda':
			if (s[1] === 'fissa') return textOpt(QUESTIONS[Number(s[2])]);
			if (s[1] === 'somma') return `\\text{Quanto fa } ${s[2]} + ${s[3]}\\text{?}`;
			if (s[1] === 'pari') return textOpt(`${s[2]} è pari?`);
			return textOpt(`${s[2]} è un numero primo?`);
		case 'ordine':
			if (s[1] === 'fisso') return textOpt(ORDERS[Number(s[2])]);
			if (s[1] === 'calcola') return `\\text{Calcola } ${s[2]} + ${s[3]}`;
			return textOpt(`Scrivi il doppio di ${s[2]}`);
		case 'opinione':
			return textOpt(OPINIONS[Number(s[1])]);
		case 'aperta':
			if (s[1] === 'somma') return `x + ${s[2]} = ${s[3]}`;
			if (s[1] === 'prodotto') return `${s[2]}x = ${s[3]}`;
			if (s[1] === 'cmp') return `x > ${s[2]}`;
			return `x \\text{ è multiplo di } ${s[2]}`;
	}
	throw new Error(`sentence ${s.join(' ')}`);
}

function randProposition(rng: Rng, truth: boolean): Sentence {
	if (rng.next() < 0.3) {
		const idx = FACTS.map((f, i) => [f, i] as const).filter(([f]) => f[1] === truth);
		return ['fatto', String(rng.pick(idx)[1])];
	}
	return ['atom', ...randAtom(rng, truth, ['pari', 'dispari', 'multiplo', 'primo', 'divisore', 'cmp', 'somma', 'prodotto'])];
}

const NON_KINDS = ['domanda', 'ordine', 'opinione', 'aperta'] as const;
function randNonProposition(rng: Rng, kind: string): Sentence {
	const n = () => String(rng.int(2, 30));
	switch (kind) {
		case 'domanda':
			return rng.pick([['domanda', 'fissa', String(rng.int(0, QUESTIONS.length - 1))], ['domanda', 'somma', String(rng.int(2, 12)), String(rng.int(2, 12))], ['domanda', 'pari', n()], ['domanda', 'primo', n()]]);
		case 'ordine':
			return rng.pick([['ordine', 'fisso', String(rng.int(0, ORDERS.length - 1))], ['ordine', 'calcola', String(rng.int(2, 12)), String(rng.int(2, 12))], ['ordine', 'doppio', n()]]);
		case 'opinione':
			return ['opinione', String(rng.int(0, OPINIONS.length - 1))];
		default: {
			const a = rng.int(2, 9);
			return rng.pick([
				['aperta', 'somma', String(a), String(a + rng.int(1, 9))],
				['aperta', 'prodotto', String(rng.int(2, 5)), String(rng.int(2, 9) * 2)],
				['aperta', 'cmp', String(a)],
				['aperta', 'multiplo', String(rng.int(3, 9))],
			]);
		}
	}
}
const sOption = (s: Sentence): ChoiceOption => ({ latex: sentenceTex(s), values: s });

const NON_REASON: Record<string, string> = {
	domanda: 'è una domanda, non è né vera né falsa',
	ordine: 'è un ordine, non è né vero né falso',
	opinione: "è un'opinione, il valore di verità dipende da chi parla",
	aperta: 'contiene la variabile x, il valore dipende da x',
};
function sentenceReason(s: Sentence): string {
	const head = `${oneLine(sentenceTex(s))}\\text{: `;
	if (!isProposition(s)) return `${head}${NON_REASON[s[0]]}}`;
	return `${head}proposizione ${sentenceTruth(s) ? 'vera' : 'falsa'}}`;
}

// Level 7: everyday sentences
export const WEATHER: [string, string][] = [
	['piove', 'non piove'],
	['fa freddo', 'non fa freddo'],
	['nevica', 'non nevica'],
	['tira vento', 'non tira vento'],
	["c'è il sole", "non c'è il sole"],
];
export const PEOPLE = ['Luca', 'Marta', 'Sara', 'Paolo', 'Giulia', 'Marco'];
export const ACTIONS: [string, string][] = [
	['studia', 'non studia'],
	['legge', 'non legge'],
	['gioca a calcio', 'non gioca a calcio'],
	['va al cinema', 'non va al cinema'],
	['ha fame', 'non ha fame'],
	['parla inglese', 'non parla inglese'],
	['suona il piano', 'non suona il piano'],
];
/** [who, i1, neg1, conn, i2, neg2]: who is `meteo` or a name; neg is '0' or '1'; conn 'e' or 'o'. */
type Phrase = string[];
function phraseText(ph: Phrase): string {
	const [who, i1, n1, conn, i2, n2] = ph;
	const list = who === 'meteo' ? WEATHER : ACTIONS;
	const part = (i: string, n: string) => list[Number(i)][Number(n)];
	const s = `${part(i1, n1)} ${conn} ${part(i2, n2)}`;
	return who === 'meteo' ? s[0].toUpperCase() + s.slice(1) : `${who} ${s}`;
}
const flip = (n: string) => (n === '1' ? '0' : '1');
const swapConn = (c: string) => (c === 'e' ? 'o' : 'e');

// ---------------------------------------------------------------------------
// Construction

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer | NumberAnswer;
	params: Record<string, unknown>;
}

/** One option with the wanted truth and three with the other, the first candidates first. */
function pickByTruth(rng: Rng, right: ChoiceOption[], wrong: ChoiceOption[]): ChoiceAnswer | null {
	if (!right.length) return null;
	return assembleChoice(rng, right[0], wrong);
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1:
			return level1(rng);
		case 2:
			return rng.next() < 0.7 ? level2Letters(rng) : level2Compare(rng);
		case 3:
			return level3(rng);
		case 4:
		case 5:
			return tableLevel(rng, level);
		case 6: {
			const u = rng.next();
			return u < 0.3 ? level6Kind(rng, 'tautologia') : u < 0.55 ? level6Kind(rng, 'contraddizione') : level6Equivalent(rng);
		}
		case 7: {
			const u = rng.next();
			return u < 0.35 ? level7Formula(rng) : u < 0.7 ? level7Phrase(rng) : level7Numbers(rng);
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

function level1(rng: Rng): Built | null {
	const u = rng.next();
	const variant = u < 0.3 ? 'proposizione' : u < 0.55 ? 'non proposizione' : u < 0.8 ? 'vera' : 'falsa';
	let correct: Sentence;
	let wrong: Sentence[];
	const nonKinds = shuffle(rng, NON_KINDS);
	if (variant === 'proposizione') {
		// the proposition is false half of the time: a false sentence is still a proposition
		correct = randProposition(rng, rng.next() < 0.5);
		wrong = nonKinds.slice(0, 3).map((k) => randNonProposition(rng, k));
	} else if (variant === 'non proposizione') {
		correct = randNonProposition(rng, nonKinds[0]);
		wrong = [randProposition(rng, false), randProposition(rng, rng.next() < 0.5), randProposition(rng, true), randProposition(rng, false)];
	} else {
		const t = variant === 'vera';
		correct = randProposition(rng, t);
		// a question whose content would be true (12 è pari?) is the trap
		const q: Sentence = t ? ['domanda', 'pari', String(2 * rng.int(2, 15))] : ['domanda', 'primo', String(rng.pick([4, 6, 8, 9, 10, 12, 15, 21]))];
		wrong = [randProposition(rng, !t), q, randNonProposition(rng, rng.pick(['ordine', 'opinione', 'aperta'])), randProposition(rng, !t)];
	}
	const ch = assembleChoice(rng, sOption(correct), wrong.map(sOption));
	if (!ch) return null;
	const sentences = ch.options.map((o) => o.values);
	const question = { proposizione: 'è una proposizione', 'non proposizione': 'non è una proposizione', vera: 'è una proposizione vera', falsa: 'è una proposizione falsa' }[variant];
	return {
		prompt: PROMPT,
		problem: `\\text{Quale di queste frasi ${question}?}`,
		solution: oneLine(sentenceTex(correct)),
		steps: ['\\text{Una proposizione è una frase che è vera o falsa, in modo oggettivo}', ...sentences.map(sentenceReason)],
		answer: ch,
		params: { variant },
	};
}

const L2_KINDS = ['pari', 'dispari', 'multiplo', 'primo', 'divisore', 'cmp'];
function atomLine(name: Letter, a: Atom): string {
	const w = atomWords(a);
	return w ? `${name}: \\text{ ${w}}` : `${name}: ${atomMath(a)}`;
}

function level2Letters(rng: Rng): Built | null {
	const tp = rng.next() < 0.5,
		tq = rng.next() < 0.5;
	// half of the time both atoms speak of the same number, as in "12 è pari e multiplo di 5"
	const same = rng.next() < 0.5;
	const numKinds = ['pari', 'dispari', 'multiplo', 'primo'];
	let ap: Atom, aq: Atom;
	if (same) {
		const n = rng.int(2, 40);
		ap = randAtom(rng, tp, numKinds, n);
		aq = randAtom(rng, tq, numKinds, n);
		if (ap[0] === aq[0] || (ap[0] === 'pari' && aq[0] === 'dispari') || (ap[0] === 'dispari' && aq[0] === 'pari')) return null;
	} else {
		ap = randAtom(rng, tp, L2_KINDS);
		aq = randAtom(rng, tq, L2_KINDS);
		if (ap.join() === aq.join()) return null;
	}
	const env: Env = { p: tp, q: tq };
	const pool = [not(v('p')), not(v('q')), bin('and', v('p'), v('q')), bin('or', v('p'), v('q')), bin('xor', v('p'), v('q'))];
	const trues = pool.filter((f) => evalF(f, env));
	const falses = pool.filter((f) => !evalF(f, env));
	const asks = (['vera', 'falsa'] as const).filter((a) => (a === 'vera' ? trues.length >= 1 && falses.length >= 3 : falses.length >= 1 && trues.length >= 3));
	if (!asks.length) return null;
	const ask = rng.pick(asks);
	const [right, wrong] = ask === 'vera' ? [trues, falses] : [falses, trues];
	const ch = pickByTruth(rng, shuffle(rng, right).map(fOption), shuffle(rng, wrong).map(fOption));
	if (!ch) return null;
	const fs = ch.options.map((o) => parse(o.values[0]));
	return {
		prompt: PROMPT,
		problem: lines([atomLine('p', ap), atomLine('q', aq), `\\text{Quale di queste proposizioni è ${ask}?}`]),
		solution: ch.options[ch.correct].latex,
		steps: [
			`p \\text{ è ${tp ? 'vera' : 'falsa'}, } q \\text{ è ${tq ? 'vera' : 'falsa'}}`,
			...fs.map((f) => `${tex(f)}\\text{: } ${chain(f, env)}`),
			...(fs.some((f) => f.t === 'or') && tp && tq ? ['\\text{In matematica "o" è inclusivo: } p \\vee q \\text{ è vera anche quando sono vere tutte e due}'] : []),
		],
		answer: ch,
		params: { variant: 'lettere', ask, p: ap, q: aq },
	};
}

function level2Compare(rng: Rng): Built | null {
	const rel = rng.pick(['>', '<', '>=', '<=']);
	const a = rng.int(1, 20),
		b = rng.int(1, 20);
	if (a === b) return null;
	const right = REL_NEG[rel];
	const others: Record<string, string[]> = { '>': ['<', '=', '>='], '<': ['>', '=', '<='], '>=': ['<=', '>', '!='], '<=': ['>=', '<', '!='] };
	const opt = (r: string): ChoiceOption => ({ latex: `${a} ${REL_TEX[r]} ${b}`, values: [r] });
	const ch = assembleChoice(rng, opt(right), others[rel].map(opt));
	if (!ch) return null;
	const words: Record<string, string> = { '>': 'maggiore di', '<': 'minore di', '>=': 'maggiore o uguale a', '<=': 'minore o uguale a' };
	return {
		prompt: PROMPT,
		problem: lines(['\\text{Qual è la negazione di questa proposizione?}', `${a} ${REL_TEX[rel]} ${b}`]),
		solution: `${a} ${REL_TEX[right]} ${b}`,
		steps: [
			`\\text{La negazione di } ${a} ${REL_TEX[rel]} ${b} \\text{ è: } ${a} \\text{ non è ${words[rel]} } ${b}\\text{, cioè } ${a} ${REL_TEX[right]} ${b}`,
			'\\text{La negazione deve comprendere tutti i casi che la proposizione esclude, anche quello in cui i due numeri sono uguali}',
		],
		answer: ch,
		params: { variant: 'confronto', a: String(a), rel, b: String(b) },
	};
}

/** Two formulas that differ only in how far the negation reaches: ¬(a ∘ b) and ¬a ∘ b. */
function trapPair(rng: Rng, letters: readonly Letter[]): [F, F] {
	const [x, y] = shuffle(rng, letters).slice(0, 2);
	const t = rng.pick(['and', 'or'] as const);
	return [not(bin(t, v(x), v(y))), bin(t, not(v(x)), v(y))];
}

function level3(rng: Rng): Built | null {
	const three = rng.next() < 0.35;
	const letters: Letter[] = three ? ['p', 'q', 'r'] : ['p', 'q'];
	const env: Env = {};
	for (const l of letters) env[l] = rng.next() < 0.5;
	const ask = rng.next() < 0.5 ? 'vera' : 'falsa';
	const want = ask === 'vera';
	const pool = new Map<string, F>();
	for (let i = 0; i < 40; i++) {
		const f = formula(rng, rng.int(2, 3), letters, three ? [] : ['p', 'q'], 0.1);
		if (lettersOf(f).size >= 2) pool.set(ser(f), f);
	}
	const [t1, t2] = trapPair(rng, letters);
	const useTrap = evalF(t1, env) !== evalF(t2, env) && rng.next() < 0.7;
	const all = [...pool.values()].filter((f) => ser(f) !== ser(t1) && ser(f) !== ser(t2));
	const right = shuffle(
		rng,
		all.filter((f) => evalF(f, env) === want),
	);
	const wrong = shuffle(
		rng,
		all.filter((f) => evalF(f, env) !== want),
	);
	if (useTrap) {
		const [r, w] = evalF(t1, env) === want ? [t1, t2] : [t2, t1];
		right.unshift(r);
		wrong.unshift(w);
	}
	// with three letters, r must appear in at least two options
	if (three) {
		const withR = (f: F) => lettersOf(f).has('r');
		wrong.sort((x, y) => Number(withR(y)) - Number(withR(x)));
	}
	const ch = pickByTruth(rng, right.map(fOption), wrong.map(fOption));
	if (!ch) return null;
	const fs = ch.options.map((o) => parse(o.values[0]));
	if (three && fs.filter((f) => lettersOf(f).has('r')).length < 2) return null;
	const vals = letters.map((l) => `$${l}$ è ${env[l] ? 'vera' : 'falsa'}`);
	const known = vals.length === 2 ? `${vals[0]} e ${vals[1]}` : `${vals[0]}, ${vals[1]} e ${vals[2]}`;
	return {
		prompt: PROMPT,
		problem: textBlock(`Sai che ${known}. Quale di queste proposizioni è ${ask}?`),
		solution: ch.options[ch.correct].latex,
		steps: ['\\text{La negazione si applica per prima, e solo alla lettera o alla parentesi che la segue}', ...fs.map((f) => `${tex(f)}\\text{: } ${chain(f, env)}`)],
		answer: ch,
		params: { ask, env: Object.fromEntries(letters.map((l) => [l, VF(env[l]!)])) },
	};
}

/** Wrong formulas a student builds from f: the negation moved, the main connective swapped, a part only. */
function mistakes(f: F): F[] {
	const out: F[] = [];
	// the negation reaches too far or not far enough
	const moved = (x: F): F | null => {
		if (x.t === 'not' && isBin(x.a)) return bin(x.a.t, not(x.a.a), x.a.b);
		if (isBin(x) && x.a.t === 'not') return not(bin(x.t, x.a.a, x.b));
		if (x.t === 'v') return null;
		if (x.t === 'not') {
			const m = moved(x.a);
			return m ? not(m) : null;
		}
		const ma = moved(x.a);
		if (ma) return bin(x.t, ma, x.b);
		const mb = moved(x.b);
		return mb ? bin(x.t, x.a, mb) : null;
	};
	const m = moved(f);
	if (m) out.push(m);
	if (isBin(f)) {
		const swaps: Record<Bin, Bin[]> = { and: ['or'], or: ['xor', 'and'], xor: ['or'] };
		for (const t of swaps[f.t]) out.push(bin(t, f.a, f.b));
		out.push(f.a, f.b);
	} else if (f.t === 'not') out.push(f.a);
	return out;
}

function tableLevel(rng: Rng, level: 4 | 5): Built | null {
	const letters: Letter[] = level === 4 ? ['p', 'q'] : ['p', 'q', 'r'];
	const f = formula(rng, rng.int(2, 3), letters, letters, 0.1);
	const col = column(f, letters);
	if (!col.includes('V') || !col.includes('F')) return null;
	if (!nodes(f).some((n) => n.t === 'not') && rng.next() < 0.6) return null; // most formulas have a negation, as in the lesson
	const rs = rows(letters);
	const variant = rng.next() < 0.7 ? 'colonna' : 'quante';
	const wrongForms = mistakes(f);
	const trueCount = col.split('').filter((c) => c === 'V').length;
	const order = level === 4 ? 'VV, VF, FV, FF' : 'VVV, VVF, VFV, VFF, FVV, FVF, FFV, FFF';
	let problem: string;
	if (level === 4) {
		const cell = (b: boolean) => (b ? V_TEX : F_TEX);
		const table = `\\begin{array}{c|c|c} p & q & ${tex(f)} \\\\ \\hline ${rs.map((e) => `${cell(e.p!)} & ${cell(e.q!)} & ?`).join(' \\\\ ')} \\end{array}`;
		problem = lines([variant === 'colonna' ? "\\text{Qual è l'ultima colonna, dall'alto in basso?}" : '\\text{In quante righe la proposizione è vera?}', table]);
	} else {
		problem = lines([variant === 'colonna' ? '\\text{Qual è la colonna del risultato, dall’alto in basso?}' : '\\text{In quante righe della tavola è vera?}', tex(f)]);
	}
	const steps = [
		`\\text{Con ${letters.length} lettere le righe sono ${rs.length}, nell'ordine ${order}}`,
		...rs.map((e) => `\\text{Riga ${rowName(e, letters)}: } ${chain(f, e)}`),
		variant === 'colonna' ? `\\text{La colonna è } ${colTex(col)}` : `\\text{La proposizione è vera in ${trueCount === 1 ? '1 riga' : `${trueCount} righe`}}`,
	];
	const prompt = level === 4 ? 'Costruisci la tavola di verità.' : `Costruisci la tavola di verità, con le righe nell'ordine ${order}.`;
	if (variant === 'quante') {
		const mis = [rs.length - trueCount, ...wrongForms.map((w) => column(w, letters).split('').filter((c) => c === 'V').length)];
		return {
			prompt,
			problem,
			solution: `\\text{${trueCount === 1 ? 'In 1 riga' : `In ${trueCount} righe`}}`,
			steps,
			answer: { kind: 'number', value: String(trueCount) },
			params: { variant, formula: ser(f), mistakes: mis.map(String) },
		};
	}
	const flipRow = (c: string, i: number) => c.slice(0, i) + (c[i] === 'V' ? 'F' : 'V') + c.slice(i + 1);
	const cands = shuffle(rng, [...wrongForms.map((w) => column(w, letters)), flipRow(col, rng.int(0, col.length - 1))]);
	cands.push(flipRow(col, rng.int(0, col.length - 1)), col.split('').map((c) => (c === 'V' ? 'F' : 'V')).join(''));
	const ch = assembleChoice(rng, colOption(col), cands.map(colOption));
	if (!ch) return null;
	return {
		prompt,
		problem,
		solution: colTex(col),
		steps,
		answer: ch,
		params: { variant, formula: ser(f) },
	};
}

const TAUT = 'VVVV',
	CONTR = 'FFFF';
function level6Kind(rng: Rng, variant: 'tautologia' | 'contraddizione'): Built | null {
	const letters: Letter[] = ['p', 'q'];
	const target = variant === 'tautologia' ? TAUT : CONTR;
	const other = variant === 'tautologia' ? CONTR : TAUT;
	const byCol = new Map<string, F[]>();
	for (let i = 0; i < 400; i++) {
		const f = formula(rng, rng.int(2, 3), letters, [], 0, false);
		if (lettersOf(f).size === 1 && conns(f) > 2) continue;
		const c = column(f, letters);
		const list = byCol.get(c) ?? [];
		if (!list.some((g) => ser(g) === ser(f))) list.push(f);
		byCol.set(c, list);
	}
	const right = byCol.get(target) ?? [];
	if (!right.length) return null;
	const near = [...byCol.entries()].filter(([c]) => c !== target && c !== other && [...c].filter((x, i) => x === target[i]).length === 3).flatMap(([, fs]) => fs);
	const rest = [...byCol.entries()].filter(([c]) => c !== target).flatMap(([, fs]) => fs);
	const opposite = byCol.get(other) ?? [];
	const wrong = [...(opposite.length && rng.next() < 0.7 ? [rng.pick(opposite)] : []), ...shuffle(rng, near).slice(0, 2), ...shuffle(rng, rest)];
	const ch = assembleChoice(rng, fOption(rng.pick(right)), wrong.map(fOption));
	if (!ch) return null;
	const fs = ch.options.map((o) => parse(o.values[0]));
	const kindOf = (c: string) => (c === TAUT ? 'tautologia' : c === CONTR ? 'contraddizione' : 'né tautologia né contraddizione');
	return {
		prompt: PROMPT,
		problem: `\\text{Quale di queste proposizioni è una ${variant}?}`,
		solution: ch.options[ch.correct].latex,
		steps: [
			`\\text{Una ${variant} è ${variant === 'tautologia' ? 'vera' : 'falsa'} in tutte le righe della tavola}`,
			...fs.map((f) => `${tex(f)}\\text{: colonna } ${colTex(column(f, letters))}\\text{, ${kindOf(column(f, letters))}}`),
		],
		answer: ch,
		params: { variant },
	};
}

/** A literal on letter l: l or ¬l. */
const lit = (rng: Rng, l: Letter): F => (rng.next() < 0.5 ? v(l) : not(v(l)));

function level6Equivalent(rng: Rng): Built | null {
	const letters: Letter[] = ['p', 'q'];
	const [x, y] = shuffle(rng, letters);
	const A = lit(rng, x),
		B = lit(rng, y);
	const t = rng.pick(['and', 'or'] as const);
	const u = rng.next();
	let X: F, right: F, wrong: F[], shape: string;
	if (u < 0.45) {
		// ¬(A ∘ B) ⇔ ¬A ∘' ¬B
		shape = 'de morgan';
		X = not(bin(t, A, B));
		right = bin(dual(t), neg(A), neg(B));
		wrong = [bin(t, neg(A), neg(B)), bin(t, neg(A), B), bin(dual(t), neg(A), B), bin(dual(t), A, B)];
	} else if (u < 0.75) {
		// ¬A ∘' ¬B ⇔ ¬(A ∘ B), read backwards
		shape = 'de morgan al contrario';
		X = bin(dual(t), neg(A), neg(B));
		right = not(bin(t, A, B));
		wrong = [not(bin(dual(t), A, B)), bin(t, neg(A), neg(B)), bin(t, neg(A), B), not(bin(dual(t), neg(A), neg(B)))];
	} else {
		// (A ∨ B) ∧ ¬A ⇔ ¬A ∧ B, the example of the lesson
		shape = 'esempio';
		X = bin('and', bin('or', A, B), neg(A));
		right = bin('and', neg(A), B);
		wrong = [B, bin('or', neg(A), B), bin('and', A, B), neg(A), bin('and', neg(A), neg(B))];
	}
	if (rng.next() < 0.4 && isBin(right)) right = bin(right.t, right.b, right.a);
	const cx = column(X, letters);
	const ch = assembleChoice(
		rng,
		fOption(right),
		shuffle(rng, wrong)
			.filter((w) => column(w, letters) !== cx)
			.map(fOption),
	);
	if (!ch) return null;
	const fs = ch.options.map((o) => parse(o.values[0]));
	const diffRow = (f: F) => {
		const e = rows(letters).find((r) => evalF(f, r) !== evalF(X, r))!;
		return rowName(e, letters);
	};
	return {
		prompt: PROMPT,
		problem: lines(['\\text{Quale di queste proposizioni è equivalente a questa?}', tex(X)]),
		solution: ch.options[ch.correct].latex,
		steps: [
			`${tex(X)}\\text{: colonna } ${colTex(cx)}`,
			...fs.map((f) => (column(f, letters) === cx ? `${tex(f)}\\text{: colonna } ${colTex(column(f, letters))}\\text{, uguale in ogni riga}` : `${tex(f)}\\text{: colonna } ${colTex(column(f, letters))}\\text{, diversa nella riga ${diffRow(f)}}`)),
		],
		answer: ch,
		params: { variant: 'equivalente', shape, X: ser(X) },
	};
}

function level7Formula(rng: Rng): Built | null {
	const [x, y] = shuffle(rng, ['p', 'q'] as Letter[]);
	const A = lit(rng, x),
		B = lit(rng, y);
	const t = rng.pick(['and', 'or'] as const);
	const X = bin(t, A, B);
	const right = bin(dual(t), neg(A), neg(B));
	// "e" left as "e", only the connective changed, only the first part negated, the negation on the first letter only
	const wrong = shuffle(rng, [bin(t, neg(A), neg(B)), bin(dual(t), A, B), bin(dual(t), neg(A), B), bin(t, neg(A), B)]);
	const ch = assembleChoice(rng, fOption(right), wrong.map(fOption));
	if (!ch) return null;
	const law = t === 'and' ? '\\neg(a \\wedge b) \\Leftrightarrow \\neg a \\vee \\neg b' : '\\neg(a \\vee b) \\Leftrightarrow \\neg a \\wedge \\neg b';
	const steps = [`\\text{Per le leggi di De Morgan: } ${law}`, `\\text{Negando, } ${OP_TEX[t]} \\text{ diventa } ${OP_TEX[dual(t)]} \\text{ e ogni parte viene negata}`];
	for (const L of [A, B]) if (L.t === 'not') steps.push(`\\text{La negazione di } ${tex(L)} \\text{ è } ${tex(L.a)}\\text{, perché } \\neg(${tex(L)}) \\Leftrightarrow ${tex(L.a)}`);
	steps.push(`\\neg(${tex(X)}) \\Leftrightarrow ${tex(right)}`);
	return {
		prompt: PROMPT,
		problem: lines(['\\text{Qual è la negazione di questa proposizione?}', tex(X)]),
		solution: tex(right),
		steps,
		answer: ch,
		params: { variant: 'formula', X: ser(X) },
	};
}

const phraseOption = (ph: Phrase): ChoiceOption => ({ latex: textOpt(phraseText(ph)), values: ph });

function level7Phrase(rng: Rng): Built | null {
	const meteo = rng.next() < 0.45;
	const who = meteo ? 'meteo' : rng.pick(PEOPLE);
	const list = meteo ? WEATHER : ACTIONS;
	const [i1, i2] = shuffle(
		rng,
		list.map((_, i) => String(i)),
	).slice(0, 2);
	const conn = rng.pick(['e', 'o']);
	const n2 = rng.next() < 0.25 ? '1' : '0';
	const orig: Phrase = [who, i1, '0', conn, i2, n2];
	const right: Phrase = [who, i1, '1', swapConn(conn), i2, flip(n2)];
	const wrong: Phrase[] = shuffle(rng, [
		[who, i1, '1', conn, i2, flip(n2)], // "e" left as "e"
		[who, i1, '0', swapConn(conn), i2, n2], // only the connective
		[who, i1, '1', swapConn(conn), i2, n2], // only the first part
	]);
	const ch = assembleChoice(rng, phraseOption(right), wrong.map(phraseOption));
	if (!ch) return null;
	const cw = conn === 'e' ? '"e" diventa "o"' : '"o" diventa "e"';
	return {
		prompt: PROMPT,
		problem: textBlock(`Qual è la negazione della frase “${phraseText(orig)}”?`),
		solution: `\\text{${phraseText(right)}}`,
		steps: [`\\text{Per le leggi di De Morgan, negando ${cw} e ogni parte viene negata}`, `\\text{“${list[Number(i1)][0]}” diventa “${list[Number(i1)][1]}”, “${list[Number(i2)][Number(n2)]}” diventa “${list[Number(i2)][Number(flip(n2))]}”}`, `\\text{La negazione è “${phraseText(right)}”}`],
		answer: ch,
		params: { variant: 'frase', orig },
	};
}

/** a rel1 b conn a rel2 c, e.g. 8 > 5 o 8 < 2 */
type Cmp2 = [string, string, string, string, string, string];
const cmpTex = ([a, r1, b, conn, r2, c]: Cmp2) => `${a} ${REL_TEX[r1]} ${b} \\text{ ${conn} } ${a} ${REL_TEX[r2]} ${c}`;
const STRICT_FLIP: Record<string, string> = { '>': '<', '<': '>', '>=': '<=', '<=': '>=' };

function level7Numbers(rng: Rng): Built | null {
	const a = rng.int(2, 20);
	const conn = rng.pick(['e', 'o']);
	// "o": a > b o a < c (outside an interval), "e": a > b e a < c (inside)
	const lo = rng.int(1, 18),
		hi = lo + rng.int(2, 8);
	const [r1, r2] = rng.next() < 0.5 ? ['>', '<'] : ['>=', '<='];
	const orig: Cmp2 = conn === 'o' ? [String(a), r2, String(lo), 'o', r1, String(hi)] : [String(a), r1, String(lo), 'e', r2, String(hi)];
	const [, o1, b, , o2, c] = orig;
	const sw = swapConn(conn);
	const right: Cmp2 = [String(a), REL_NEG[o1], b, sw, REL_NEG[o2], c];
	const wrong: Cmp2[] = shuffle(rng, [
		[String(a), REL_NEG[o1], b, conn, REL_NEG[o2], c], // connective kept
		[String(a), STRICT_FLIP[o1], b, sw, STRICT_FLIP[o2], c], // > negated with <
		[String(a), o1, b, sw, o2, c], // only the connective
	]);
	const opt = (x: Cmp2): ChoiceOption => ({ latex: cmpTex(x), values: [...x] });
	const ch = assembleChoice(rng, opt(right), wrong.map(opt));
	if (!ch) return null;
	return {
		prompt: PROMPT,
		problem: lines(['\\text{Qual è la negazione di questa proposizione?}', cmpTex(orig)]),
		solution: cmpTex(right),
		steps: [
			`\\text{Per le leggi di De Morgan, negando "${conn}" diventa "${sw}" e ogni parte viene negata}`,
			`\\text{La negazione di } ${a} ${REL_TEX[o1]} ${b} \\text{ è } ${a} ${REL_TEX[REL_NEG[o1]]} ${b}\\text{, quella di } ${a} ${REL_TEX[o2]} ${c} \\text{ è } ${a} ${REL_TEX[REL_NEG[o2]]} ${c}`,
			`\\text{La negazione è } ${cmpTex(right)}`,
		],
		answer: ch,
		params: { variant: 'numeri', orig },
	};
}

// ---------------------------------------------------------------------------
// Check and choice

function cmpValue(x: string[], a: number, b: number, c: number): boolean {
	const l = relHolds(a, x[1], b),
		r = relHolds(a, x[4], c);
	return x[3] === 'e' ? l && r : l || r;
}

/** Whether an option is the right answer, recomputed from params and the option's values. */
function grade(sample: Sample, o: ChoiceOption): boolean {
	const p = sample.params;
	const vals = o.values;
	switch (sample.level) {
		case 1: {
			const s = vals;
			switch (p.variant) {
				case 'proposizione':
					return isProposition(s);
				case 'non proposizione':
					return !isProposition(s);
				case 'vera':
					return isProposition(s) && sentenceTruth(s);
				default:
					return isProposition(s) && !sentenceTruth(s);
			}
		}
		case 2: {
			if (p.variant === 'confronto') {
				const rel = String(p.rel);
				for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) if (relHolds(a, vals[0], b) === relHolds(a, rel, b)) return false;
				return true;
			}
			const env = { p: atomTruth(p.p as Atom), q: atomTruth(p.q as Atom) };
			return evalF(parse(vals[0]), env) === (p.ask === 'vera');
		}
		case 3: {
			const env = Object.fromEntries(Object.entries(p.env as Record<string, string>).map(([k, x]) => [k, x === 'V'])) as Env;
			return evalF(parse(vals[0]), env) === (p.ask === 'vera');
		}
		case 4:
		case 5:
			return vals[0] === column(parse(String(p.formula)), sample.level === 4 ? ['p', 'q'] : ['p', 'q', 'r']);
		case 6: {
			const c = column(parse(vals[0]), ['p', 'q']);
			if (p.variant === 'tautologia') return c === TAUT;
			if (p.variant === 'contraddizione') return c === CONTR;
			return c === column(parse(String(p.X)), ['p', 'q']);
		}
		case 7: {
			if (p.variant === 'formula') {
				const X = parse(String(p.X));
				return rows(['p', 'q']).every((e) => evalF(parse(vals[0]), e) === !evalF(X, e));
			}
			if (p.variant === 'frase') {
				const orig = p.orig as string[];
				const val = (ph: string[], a: boolean, b: boolean) => {
					const l = ph[2] === '1' ? !a : a,
						r = ph[5] === '1' ? !b : b;
					return ph[3] === 'e' ? l && r : l || r;
				};
				if (vals[0] !== orig[0] || vals[1] !== orig[1] || vals[4] !== orig[4]) return false;
				return [true, false].every((a) => [true, false].every((b) => val(vals, a, b) === !val(orig, a, b)));
			}
			const orig = p.orig as string[];
			if (vals[0] !== orig[0] || vals[2] !== orig[2] || vals[5] !== orig[5]) return false;
			for (let a = -2; a <= 25; a++) for (const b of [Number(orig[2])]) for (const c of [Number(orig[5])]) if (cmpValue(vals, a, b, c) === cmpValue(orig, a, b, c)) return false;
			return true;
		}
	}
	return false;
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const a = sample.answer;
	if (a.kind === 'number') {
		if (sample.level !== 4 && sample.level !== 5) return ['conteggio fuori dai livelli 4 e 5'];
		const letters: Letter[] = sample.level === 4 ? ['p', 'q'] : ['p', 'q', 'r'];
		const count = column(parse(String(sample.params.formula)), letters)
			.split('')
			.filter((c) => c === 'V').length;
		if (Number(a.value) !== count) v.push('conteggio sbagliato');
		return v;
	}
	if (a.kind !== 'choice' || a.options.length !== 4) return ['servono 4 opzioni'];
	const t = a.options.map((o) => grade(sample, o));
	if (t.filter(Boolean).length !== 1 || !t[a.correct]) v.push('non c’è una sola risposta giusta');
	if (new Set(a.options.map((o) => o.latex)).size !== 4) v.push('opzioni uguali');
	if (sample.level >= 3 && sample.level <= 5 && (sample.params.formula || sample.level === 3)) {
		const fs = sample.level === 3 ? a.options.map((o) => parse(o.values[0])) : [parse(String(sample.params.formula))];
		for (const f of fs) if (conns(f) < 2 || conns(f) > 3) v.push('servono 2 o 3 connettivi');
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'number') throw new Error(`${ID}: no choice for ${sample.answer.kind}`);
	const max = sample.level === 4 ? 4 : 8;
	const value = Number(sample.answer.value);
	const mis = ((sample.params.mistakes ?? []) as string[]).map(Number).filter((n) => n !== value && n <= max);
	const ch = numberChoice(
		rng,
		value,
		[...mis, ...[1, 2, 3, 4, 5].flatMap((d) => [value + d, value - d])].filter((n) => n >= 0 && n <= max),
	);
	return ch;
}

export const logicaProposizioni: Generator = {
	id: ID,
	title: 'Proposizioni e connettivi logici',
	levels: {
		1: {
			label: 'Riconoscere le proposizioni',
			constraints: ['quale frase è (o non è) una proposizione, quale è una proposizione vera o falsa', 'non proposizioni: domande, ordini, opinioni, frasi con la x'],
		},
		2: {
			label: 'Un connettivo',
			constraints: ['p e q su fatti dei numeri, opzioni ¬p, ¬q, p ∧ q, p ∨ q, p ⊻ q', 'negazione di >, <, ≥, ≤'],
		},
		3: {
			label: 'Una riga della tavola',
			constraints: ['valori di p, q (e r) dati; formule con 2 o 3 connettivi', 'trappola: ¬(p ∧ q) contro ¬p ∧ q'],
		},
		4: { label: 'Tavola con due lettere', constraints: ['colonna del risultato su 4 righe, oppure in quante righe è vera'] },
		5: { label: 'Tavola con tre lettere', constraints: ['colonna del risultato su 8 righe, oppure in quante righe è vera'] },
		6: {
			label: 'Tautologie ed equivalenze',
			constraints: ['quale è una tautologia o una contraddizione', 'quale è equivalente: De Morgan, l’esempio della lezione'],
		},
		7: {
			label: 'Negare con De Morgan',
			constraints: ['formule con due letterali', 'frasi del linguaggio comune', 'confronti tra numeri'],
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

export default logicaProposizioni;
