/**
 * Grades an open answer: the LaTeX a student typed (MathLive) against the exercise's exact answer, as the level
 * asks (open-answers.ts). The value is compared exactly where it can be; the form only where the form is the
 * exercise (vault/Decisioni/2026-09-30 Nella risposta aperta la forma conta solo dove è l'esercizio.md).
 *
 * The LaTeX is read by the Compute Engine without simplifying (`canonical: false`), with the Italian decimal
 * comma as MathLive writes it (`{,}`), then turned into the trees of node.ts.
 */
import { ComputeEngine } from '@cortex-js/compute-engine';
import { Rational } from '../rational';
import type { AnswerForm, OpenGrading, Sample } from '../types';
import { isDecimalLatex, isExpanded, isFactored, isIrreducible, isPower, isRadical, isRationalized, isSimplified, numberLiteral, reducible } from './forms';
import { type Node, NotAnExpression, bare, contains, exact, fromMathJson, fromSympy, sameValue, symbols } from './node';

export interface Verdict {
	correct: boolean;
	/** Why a wrong answer is wrong, when it is not simply the value. */
	reason?: 'unreadable' | 'number' | 'form';
	/** What the student reads under a wrong answer, or under a right one that could be better written. */
	message?: string;
}

type Json = unknown;

let engine: ComputeEngine | null = null;
const ce = () => (engine ??= new ComputeEngine());

const FORM_MESSAGES: Record<AnswerForm, string> = {
	expanded: 'Il valore è giusto, ma va scritto sviluppato, con i termini simili sommati.',
	factored: 'Il valore è giusto, ma non è scomposto fino in fondo.',
	irreducible: 'Il valore è giusto, ma va scritto come frazione ridotta ai minimi termini.',
	simplified: 'Il valore è giusto, ma si può ancora semplificare.',
	rationalized: 'Il valore è giusto, ma va razionalizzato: niente radicali al denominatore.',
	explicit: 'Scrivi la retta in forma esplicita, con y da sola al primo membro.',
	power: 'Il valore è giusto, ma va scritto come potenza con esponente frazionario.',
	radical: 'Il valore è giusto, ma va scritto come radicale.',
	decimal: 'Il valore è giusto, ma va scritto come numero decimale.',
};
const UNREADABLE = 'Non riesco a leggere la risposta: controlla parentesi e simboli.';
const NOT_A_NUMBER = 'Scrivi il risultato come un numero: qui ci sono ancora operazioni da fare.';
const REDUCIBLE = 'La frazione si può ancora ridurre.';
const AN_EQUATION = "Scrivi le soluzioni, non l'equazione.";

/** An equation between two expressions, not a label and its value: x² − 2x = 0, 5x − 2y + 23 = 0. */
const isEquation = (j: Json) => Array.isArray(j) && j[0] === 'Equal' && !isLabel(j[1]) && !isLabel(j[2]);

/** Units, degrees, percent and the words between two values, which the comparison does not need. */
function clean(latex: string, numeric: boolean): string {
	let s = latex
		.replace(/\\%|%/g, '')
		.replace(/\^\{?\\circ\}?|°|\\degree/g, '')
		.replace(/\\(?:text|mathrm)\{\s*e\s*\}|\\text\{\s*e\s*\}/g, ',')
		.replace(/\\(?:text|mathrm|operatorname)\{\s*(?:cm|mm|dm|m|km|g|kg|l|ml|s|min|h|€|euro|anni|giorni|ore|minuti|secondi|gradi|persone|studenti)\s*\}(?:\^\{?[23]\}?)?/g, '')
		.replace(/€|\\euro/g, '');
	if (numeric) s = s.replace(/(\d)\s*(?:cm|mm|dm|km|kg|m|g)(?:\^\{?[23]\}?)?(?![A-Za-z])/g, '$1');
	return s.trim();
}

/** The letters of the answer as words: "impossibile", "nessuna soluzione", "irriducibile". */
function words(latex: string): string {
	return latex
		.replace(/\\(?:text|mathrm|operatorname)/g, '')
		.replace(/\\[A-Za-z]+/g, ' ')
		.replace(/[^A-Za-zàèéìòù]/g, '')
		.toLowerCase();
}

const EMPTY_WORDS = /impossibil|nessun|vuot|nonhasoluzion|nonesist/;
const ALL_WORDS = /indetermin|perognix|ognivalore|infinitesoluzion|identit|tuttiireali/;
const IRREDUCIBLE_WORDS = /irriducibil|nonsiscompon|nonscomponibil/;

/** A polynomial that does not factor: the answer says so, or is the polynomial itself. */
const doesNotFactor = (s: Sample) =>
	s.answer.kind === 'expression' && (/irriducibil/.test(s.answer.latex.toLowerCase()) || sameLatex(s.answer.latex, s.problem));
const sameLatex = (a: string, b: string) => a.replace(/\\left|\\right|\s/g, '') === b.replace(/\\left|\\right|\s/g, '');
const NO_CONDITION_WORDS = /nessunacondizion|nessuncondizion|esistesempre|sempre|perognix/;

function parse(latex: string): Json | null {
	const expr = ce().parse(latex, { canonical: false, decimalSeparator: '{,}' } as never);
	const json = expr.json as Json;
	return JSON.stringify(json).includes('"Error"') ? null : json;
}

/** Left-hand sides that only name the answer: x, x_1, y, S, D, A ∪ B, Im(f), f^{-1}(y), t. */
function isLabel(j: Json): boolean {
	if (typeof j === 'string') return !j.startsWith("'");
	if (!Array.isArray(j)) return false;
	const [head, ...args] = j as [string, ...Json[]];
	if (['Union', 'Intersection', 'SetMinus', 'Complement', 'Im', 'Overline', 'Conjugate', 'Subscript', 'Delimiter', 'Sequence', 'Power'].includes(head)) return args.every((a) => typeof a !== 'number' || head === 'Power');
	if (head === 'InvisibleOperator') return args.every((a) => isLabel(a) || (Array.isArray(a) && a[0] === 'Delimiter'));
	return false;
}

/** The expression of an answer, after a label such as "y =" or "f^{-1}(y) =". */
function expressionOf(j: Json): { node: Node; label: Json | null } {
	if (Array.isArray(j) && j[0] === 'Equal' && j.length === 3 && isLabel(j[1])) return { node: fromMathJson(j[2] as never), label: j[1] };
	return { node: fromMathJson(j as never), label: null };
}

/** Every reading of a "±": (3 ± √5)/2 is two values. */
function expandPm(j: Json): Json[] {
	if (!Array.isArray(j)) return [j];
	if (j[0] === 'Measurement' && j.length === 3) {
		const [, a, b] = j;
		return [...expandPm(['Add', a, b]), ...expandPm(['Subtract', a, b])];
	}
	for (let i = 1; i < j.length; i++) {
		const options = expandPm(j[i]);
		if (options.length > 1) return options.flatMap((o) => expandPm([...j.slice(0, i), o, ...j.slice(i + 1)]));
	}
	return [j];
}

interface SetReading {
	values: Node[];
	excluded: Node[];
	empty: boolean;
	all: boolean;
}

/**
 * The values of a set of solutions in any of the usual writings: "x = 0, 2", "x_1 = 0, x_2 = 2", "x_1, x_2 = 0, 2",
 * "x = 0 ∨ x = 2", "S = {0; 2}", "±", "∅", "ℝ"; and the values left out of a domain: "x ≠ 4", "ℝ ∖ {4}".
 */
function readSet(j: Json): SetReading | null {
	const r: SetReading = { values: [], excluded: [], empty: false, all: false };
	const value = (x: Json, into: Node[]) => {
		for (const option of expandPm(x)) into.push(fromMathJson(option as never));
	};
	const walk = (x: Json, into: Node[]): void => {
		if (typeof x === 'string') {
			if (x === 'EmptySet') r.empty = true;
			else if (x === 'RealNumbers') r.all = true;
			return; // a variable's name, a word
		}
		if (typeof x === 'number' || !Array.isArray(x)) return value(x, into);
		const [head, ...args] = x as [string, ...Json[]];
		switch (head) {
			case 'Equal':
				if (isLabel(args[0])) return walk(args[1], into);
				if (isLabel(args[1])) return walk(args[0], into);
				throw new NotAnExpression('equation');
			case 'NotEqual':
				return walk(args[1], r.excluded);
			case 'SetMinus':
				if (args[0] === 'RealNumbers') return walk(args[1], r.excluded);
				throw new NotAnExpression('difference');
			case 'Set':
				if (args.length === 0) r.empty = true;
				// {∅} is a set with one element, the empty set: not a way of writing ∅
				if (args.includes('EmptySet')) throw new NotAnExpression('set of sets');
				return args.forEach((a) => walk(a, into));
			case 'Delimiter':
				return walk(args[0], into);
			case 'Sequence':
			case 'Tuple':
			case 'List':
			case 'Or':
			case 'And':
				return args.forEach((a) => walk(a, into));
			case 'InvisibleOperator':
				// "13 e 20" arrives as 13, ' e ', 20
				if (args.some((a) => typeof a === 'string' && a.startsWith("'"))) return args.forEach((a) => walk(a, into));
				return value(x, into);
			default:
				return value(x, into);
		}
	};
	try {
		walk(j, r.values);
	} catch (e) {
		if (e instanceof NotAnExpression) return null;
		throw e;
	}
	return r;
}

/** Whether two lists of values are the same set: order and repeats do not matter. */
function sameSet(a: Node[], b: Node[]): boolean {
	const has = (xs: Node[], y: Node) => xs.some((x) => sameValue(x, y));
	return a.every((x) => has(b, x)) && b.every((y) => has(a, y));
}

/** The student's letter renamed to the answer's when each has one: an inverse written in x instead of y. */
function renamed(n: Node, reference: Node): Node {
	const mine = [...symbols(n)];
	const theirs = [...symbols(reference)];
	if (mine.length !== 1 || theirs.length !== 1 || mine[0] === theirs[0]) return n;
	const to = theirs[0];
	const walk = (m: Node): Node => {
		switch (m.t) {
			case 'sym':
				return m.name === mine[0] ? { t: 'sym', name: to } : m;
			case 'add':
			case 'mul':
				return { ...m, args: m.args.map(walk) };
			case 'div':
			case 'pow':
				return { ...m, a: walk(m.a), b: walk(m.b) };
			case 'neg':
			case 'abs':
			case 'paren':
			case 'root':
				return { ...m, a: walk(m.a) } as Node;
			default:
				return m;
		}
	};
	return walk(n);
}

function formOf(grading: OpenGrading, sample: Sample): AnswerForm | null {
	if (grading.grade !== 'form') return null;
	if (grading.form) return grading.form;
	const f = sample.answer.kind === 'expression' ? sample.answer.form : undefined;
	return f === 'irriducibile' ? 'irreducible' : ((f as AnswerForm | undefined) ?? null);
}

function checkForm(form: AnswerForm, student: Node, reference: Node, latex: string): boolean {
	// a radical left where the answer has none is not simplified: √(x² + 6x + 9) for |x + 3|
	const radical = (n: Node) => contains(n, (m) => m.t === 'root' || (m.t === 'pow' && !(exact(m.b)?.isInteger() ?? false)));
	if (['simplified', 'rationalized', 'irreducible'].includes(form) && radical(student) && !radical(reference)) return false;
	switch (form) {
		case 'expanded':
			return isExpanded(student);
		case 'factored':
			return isFactored(student, reference);
		case 'irreducible':
			return isIrreducible(student, reference);
		case 'simplified':
			return isSimplified(student);
		case 'rationalized':
			return isRationalized(student);
		case 'explicit':
			return true; // checked on the equation, before this
		case 'power':
			return isPower(student);
		case 'radical':
			return isRadical(student);
		case 'decimal':
			return isDecimalLatex(latex);
	}
}

function gradeOnce(sample: Sample, grading: OpenGrading, latex: string): Verdict {
	const answer = sample.answer;
	const said = words(latex);
	const form = formOf(grading, sample);

	if (answer.kind === 'set') {
		const expected = answer.values.map(fromSympy);
		const excluded = grading.grade === 'value' && grading.set === 'excluded';
		// a domain with nothing left out: "D = ℝ", "nessuna condizione", "sempre"
		if (excluded && NO_CONDITION_WORDS.test(said)) return { correct: expected.length === 0 };
		let reading: SetReading | null;
		if (EMPTY_WORDS.test(said)) reading = { values: [], excluded: [], empty: true, all: false };
		else if (ALL_WORDS.test(said)) reading = { values: [], excluded: [], empty: false, all: true };
		else {
			const json = parse(clean(latex, true));
			if (json !== null && isEquation(json)) return { correct: false, reason: 'number', message: AN_EQUATION };
			reading = json === null ? null : readSet(json);
		}
		if (!reading) return { correct: false, reason: 'unreadable', message: UNREADABLE };
		if (excluded) {
			if (expected.length === 0) return { correct: reading.all && reading.excluded.length === 0 && reading.values.length === 0 };
			return { correct: reading.values.length === 0 && reading.excluded.length > 0 && sameSet(reading.excluded, expected) };
		}
		if (answer.universal) return { correct: reading.all && reading.values.length === 0 };
		if (expected.length === 0) return { correct: reading.values.length === 0 && reading.empty };
		return { correct: !reading.all && reading.values.length > 0 && sameSet(reading.values, expected) };
	}

	const numeric = answer.kind === 'number';
	const json = parse(clean(latex, numeric));
	if (json === null) return { correct: false, reason: 'unreadable', message: UNREADABLE };
	let student: Node;
	let label: Json | null;
	try {
		({ node: student, label } = expressionOf(json));
	} catch (e) {
		if (e instanceof NotAnExpression) {
			// a factorisation that does not exist: "irriducibile" in words
			if (answer.kind === 'expression' && IRREDUCIBLE_WORDS.test(said) && doesNotFactor(sample)) return { correct: true };
			// an equation such as 5x − 2y + 23 = 0 where y = … is asked
			if (form === 'explicit' && isEquation(json)) return { correct: false, reason: 'form', message: FORM_MESSAGES.explicit };
			return { correct: false, reason: 'unreadable', message: UNREADABLE };
		}
		throw e;
	}

	if (answer.kind === 'number') {
		const expected = Rational.parse(answer.value);
		// an operation still to do is said as such, whatever its value: "23 + 60 : 4"
		if (!numberLiteral(student)) return { correct: false, reason: 'number', message: NOT_A_NUMBER };
		if (!sameValue(student, { t: 'num', v: expected })) return { correct: false };
		if (form === 'decimal' && !isDecimalLatex(clean(latex, true))) return { correct: false, reason: 'form', message: FORM_MESSAGES.decimal };
		if (form === 'irreducible' && !isIrreducible(student, { t: 'num', v: expected })) return { correct: false, reason: 'form', message: FORM_MESSAGES.irreducible };
		return reducible(student) ? { correct: true, message: REDUCIBLE } : { correct: true };
	}

	if (answer.kind !== 'expression') return { correct: false };
	if (IRREDUCIBLE_WORDS.test(said) && doesNotFactor(sample)) return { correct: true };
	// the polynomial written back where it does not factor: its own factorisation
	if (doesNotFactor(sample) && sameLatex(latex, sample.problem)) return { correct: true };
	const reference = fromSympy(answer.value);
	const mine = renamed(student, reference);
	// "le lettere sono positive", "a > 0": the identities of radicals hold only there
	const positive = /positiv|>\s*0|\\gt\s*0/.test(`${sample.prompt} ${sample.problem}`);
	if (!sameValue(mine, reference, { positive })) return { correct: false };
	if (!form) return { correct: true };
	if (form === 'explicit' && !(label === 'y' && !symbols(student).has('y'))) return { correct: false, reason: 'form', message: FORM_MESSAGES.explicit };
	if (!checkForm(form, bare(mine), reference, clean(latex, false))) {
		const radical = form === 'irreducible' && contains(reference, (m) => m.t === 'root');
		return { correct: false, reason: 'form', message: FORM_MESSAGES[radical ? 'simplified' : form] };
	}
	return { correct: true };
}

/**
 * The verdict on an open answer. With the Italian decimal comma, "0,2" is both a list and a number: when the
 * answer contains a comma, both readings are tried, and the answer is right if either is. A student who meant the
 * other reading gave a wrong answer anyway.
 */
export function gradeOpen(sample: Sample, grading: OpenGrading, latex: string): Verdict {
	const first = gradeOnce(sample, grading, latex);
	if (first.correct) return first;
	const variants = new Set<string>();
	if (latex.includes('{,}')) variants.add(latex.replace(/\{,\}/g, ','));
	if (/\d,\d/.test(latex)) variants.add(latex.replace(/(\d),(?=\d)/g, '$1{,}'));
	for (const v of variants) {
		const other = gradeOnce(sample, grading, v);
		if (other.correct) return other;
	}
	return first;
}
