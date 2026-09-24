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
export interface ChoiceOption {
	latex: string;
	values: string[];
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

export type Answer = ChoiceAnswer | NumberAnswer | ExpressionAnswer | SetAnswer;

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
}

export interface LevelSpec {
	label: string;
	constraints: string[];
}

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
