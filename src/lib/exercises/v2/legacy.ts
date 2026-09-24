/**
 * Bridge from a v2 generator to the exercise page, which today shows only
 * multiple choice built from the old Exercise class. The single constructor
 * argument (the `args` of config.ts) is the v2 level. The choice comes from the
 * generator's toChoice(), or is the answer itself when the exercise is born as
 * multiple choice (true or false, pick the right set). Goes away when the page
 * reads v2 samples directly, with open answers and saved attempts.
 */
import { Answer, Exercise, Question } from '../abstract';
import { createRng, deriveSeed } from './rng';
import type { ChoiceAnswer, Generator } from './types';

export function legacyExercise(gen: Generator): new (level: number) => Exercise {
	return class extends Exercise {
		generateQuestion(): void {
			// Done in generateAnswers, which is the only hook that receives the level.
		}

		generateAnswers(level: number): void {
			const seed = Math.floor(Math.random() * 2 ** 32);
			const sample = gen.generate(createRng(seed), level);
			const choice: ChoiceAnswer | undefined =
				sample.answer.kind === 'choice' ? sample.answer : gen.toChoice?.(sample, createRng(deriveSeed(seed, level)));
			if (!choice) throw new Error(`${gen.id}: level ${level} has no multiple-choice form`);
			// The prompt says what to do when the problem alone does not ("Vero o falso?", "Calcola il MCD").
			// It stays plain text, so a long word problem wraps; only the problem is a formula.
			this.question = new Question(sample.problem);
			const prompt = sample.prompt && sample.prompt !== "Risolvi l'equazione." ? sample.prompt : '';
			if (prompt) this.question.textContent = sample.problem.trim() ? `${prompt} $$${sample.problem}$$` : prompt;
			this.question.prompt = prompt;
			this.question.problem = sample.problem;
			this.options = choice.options.map((o, i) => new Answer(o.latex, i === choice.correct));
		}
	};
}
