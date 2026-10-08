/**
 * Exercise generator interface (v2).
 *
 * A generator is a pure function of (rng, level): same seed and level give the
 * same Sample. Every Sample carries in `params` everything an independent
 * checker (scripts/exercises/verify.py) needs to recompute the answer.
 */

export interface Rng {
	/** Seed this generator was created with (for reproducibility). */
	readonly seed: number;
	/** Uniform integer in [a, b], both inclusive. */
	int(a: number, b: number): number;
	/** Uniform element of a non-empty array. */
	pick<T>(xs: readonly T[]): T;
	/** Uniform float in [0, 1). */
	next(): number;
}

/**
 * One option of a multiple-choice answer. `values` identify it for the checker: exact numbers
 * ("p/q", radicals) when the option is a value, otherwise labels the generator's checker reads
 * (a statement, a set of letters, a pair).
 */
/** A program written in the two languages of the lessons: the page shows the one the student has chosen. */
export type CodeText = { python: string; cpp: string };

export interface ChoiceOption {
	latex: string;
	values: string[];
	/**
	 * A flowchart as the option, written as the program of a `diagramma` block (src/lib/diagramma/blocco.ts), or a
	 * program in the two languages: `latex` is then unused, and `text` says what the option is for a screen reader.
	 */
	chart?: string;
	code?: CodeText;
	/** A drawing instead of the formula (a molecule): `latex` is then unused, `text` says what it is for a screen reader. */
	figure?: FigureRef;
	/**
	 * A graph instead of the formula: a plane (v2/piano.ts), drawn small. `latex` is then unused, and `text` (or the
	 * scene's `alt`) says what the graph looks like for a screen reader.
	 */
	scene?: SceneRef;
	/**
	 * A text set in fixed width with its lines and indentation kept, for a fragment that is not a program in the two
	 * languages: HTML, CSS, JavaScript, JSON, CSV, what a program prints line by line (v2/inf-codice.ts). `latex` is
	 * then unused, and `text` is what a screen reader says.
	 */
	listing?: string;
	/** Plain-text label of the option, when `latex` is not LaTeX (a sample with `format: 'text'`, or a drawing). */
	text?: string;
}

/**
 * A drawing compiled ahead of time and stored in the `figure` bucket (the chemistry exercises draw molecules with
 * RDKit, in Python: scripts/chimica/). Only the reference travels with the exercise.
 */
export interface FigureRef {
	file: string;
	width: number;
	height: number;
	alt: string;
}

/**
 * A drawing described by its data and drawn in the browser by the kit of the interactive figures, without
 * interaction (src/components/content/exercises/scenes/): the physics exercises, whose figure changes with the
 * numbers. `type` picks the drawing, `data` is what it needs, JSON-safe; `alt` says what it shows.
 * vault/Decisioni/2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit.md
 */
export interface SceneRef {
	type: string;
	data: Record<string, unknown>;
	alt: string;
}

export type ChoiceAnswer = {
	kind: 'choice';
	options: ChoiceOption[];
	/** Index into `options`. */
	correct: number;
};

export type NumberAnswer = {
	kind: 'number';
	/** Exact rational, "p/q" or "p". */
	value: string;
};

export type ExpressionAnswer = {
	kind: 'expression';
	/** SymPy-parsable expression. */
	value: string;
	latex: string;
	/** Optional required form, e.g. "factored", "expanded". */
	form?: string;
};

export type SetAnswer = {
	kind: 'set';
	/**
	 * Exact reals, sorted ascending: rationals as "p" or "p/q", radicals in a
	 * SymPy-parsable form such as "(3-sqrt(5))/2". Empty = no real solutions.
	 */
	values: string[];
	latex: string;
	/** Every real number is a solution (an indeterminate equation); `values` is then empty. */
	universal?: boolean;
};

/**
 * What an answer that is a chart or a program must contain, beyond writing the right things (v2/costrutti.ts): a
 * loop of any kind, a selection, the loop of a given kind where the exercise names it, or a loop in the body of
 * another. A chart has no `for`. For a program only: `funzione`, a function of its own that it defines and calls
 * (`main` in C++ is not one), and `vettore`, a list in Python or an array or a `vector` in C++.
 */
export type Construct = 'ciclo' | 'selezione' | 'while' | 'for' | 'annidati' | 'funzione' | 'vettore';

/**
 * A flowchart to build. The student's chart is run on each test's `inputs` (what its "leggi" take, in order) and
 * must write `output`, line by line. `solution` is a chart that does, and `start` what the student begins from
 * (nothing, when left out); both are written as the program of a `diagramma` block.
 */
export type ChartAnswer = {
	kind: 'chart';
	solution: string;
	start?: string;
	tests: { inputs: string[]; output: string[] }[];
	needs?: Construct[];
};

/**
 * A program to write, in the language the student chooses. It is run in the browser on each test's `input` (the
 * lines typed at its keyboard) and must print `output`. `start` is what the editor opens with.
 */
export type ProgramAnswer = {
	kind: 'program';
	solution: CodeText;
	start: CodeText;
	tests: { input: string; output: string }[];
	needs?: Construct[];
};

export type Answer = ChoiceAnswer | NumberAnswer | ExpressionAnswer | SetAnswer | ChartAnswer | ProgramAnswer;

export interface Sample {
	generatorId: string;
	level: number;
	seed: number;
	/** Italian instruction shown above the problem, plain text. */
	prompt: string;
	/** The problem, LaTeX. */
	problem: string;
	/** The final solution, LaTeX. */
	solution: string;
	/** Worked steps, LaTeX (Italian text inside \text{}). */
	steps: string[];
	answer: Answer;
	/** Optional multiple-choice variant of the same exercise. */
	choice?: ChoiceAnswer;
	/** Everything the independent verifier needs, as JSON-safe exact strings. */
	params: Record<string, unknown>;
	/**
	 * How prompt, problem, solution, steps and option labels are written. Absent: LaTeX, as above. `text`: plain
	 * text with inline `$…$` formulas, as the chemistry exercises write them.
	 */
	format?: 'text';
	/** A flowchart under the problem, written as the program of a `diagramma` block, and one with the solution. */
	chart?: string;
	solutionChart?: string;
	/** A program under the problem ("che cosa stampa?"), and one with the solution. */
	code?: CodeText;
	solutionCode?: CodeText;
	/** A fragment in fixed width under the problem (a piece of HTML, a CSV file), and one with the solution: see `ChoiceOption.listing`. */
	listing?: string;
	solutionListing?: string;
	/** A drawing under the problem. */
	figure?: FigureRef;
	/** A drawing with the solution (the main chain numbered, the group coloured). */
	solutionFigure?: FigureRef;
	/** A drawing under the problem made from the exercise's own data (a block on an incline at its angle). */
	scene?: SceneRef;
	/** The same kind of drawing with the solution (the forces found, the resultant). */
	solutionScene?: SceneRef;
}

export interface LevelSpec {
	label: string;
	constraints: string[];
}

/**
 * A form an open answer must be in, where the form is the exercise (vault/Decisioni/2026-09-30 Nella risposta aperta la
 * forma conta solo dove è l'esercizio.md). `expanded`: a sum of monomials in normal form, like terms collected;
 * `factored`: a product of irreducible factors; `irreducible`: a fraction, numeric or algebraic, in lowest terms;
 * `simplified`: radicals reduced, nothing left to carry out; `rationalized`: simplified, with no radical in a
 * denominator; `explicit`: a line or curve as y = f(x); `power` and `radical`: the notation asked for; `decimal`: a
 * decimal number, periodic with the bar. The generators' `irriducibile` is `irreducible`.
 */
export type AnswerForm = 'expanded' | 'factored' | 'irreducible' | 'simplified' | 'rationalized' | 'explicit' | 'power' | 'radical' | 'decimal';

/**
 * What an open answer of a level is graded on.
 * - `value`: any writing with the right value. A number is still written as a number, not as the expression it
 *   comes from; a set of solutions in any of the usual notations. `set: 'excluded'` when the set lists the values
 *   left out (a domain, the conditions of existence: x ≠ 4, ℝ ∖ {4}).
 * - `form`: the value and the form: `form` here, or the sample's `answer.form` when this leaves it out. In a level
 *   whose samples mix numbers and expressions, a number is graded on its value: written as a number, it is already
 *   in its simplest form.
 * - `run`: a flowchart or a program, graded on what it writes for the tests of the sample.
 */
export type OpenGrading = { grade: 'value'; set?: 'excluded' } | { grade: 'form'; form?: AnswerForm } | { grade: 'run' };

export interface Generator {
	id: string;
	title: string;
	levels: Record<number, LevelSpec>;
	generate(rng: Rng, level: number): Sample;
	/** Violations of the spec constraints for this sample; empty if ok. */
	check(sample: Sample): string[];
	/** Optional: build a multiple-choice variant with distinct distractors. */
	toChoice?(sample: Sample, rng: Rng): ChoiceAnswer;
}
