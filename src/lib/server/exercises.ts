import 'server-only';
import { configs } from '@/lib/exercises/config';
import { generators } from '@/lib/exercises';
import { nextLevel, startLevel, type Outcome } from '@/lib/exercises/levels';
import { createRng, deriveSeed } from '@/lib/exercises/v2/rng';
import type { ChoiceAnswer, Sample } from '@/lib/exercises/v2/types';
import { renderMath, renderTex } from '@/lib/content/markdown';
import { presentProblem, presentStep } from '@/lib/exercises/present';
import type { SupabaseClient } from '@supabase/supabase-js';
import { adminClient } from '@/lib/server/supabase';

/** A piece of a question, typeset: a paragraph, the question itself as a sentence, a row of givens, a formula on its own. */
export type QuestionBlock = { kind: 'text' | 'ask'; html: string } | { kind: 'givens'; items: string[] } | { kind: 'math'; html: string };

/** One exercise as sent to the browser: typeset, so the client ships no KaTeX, and without the right answer. */
export interface ExerciseView {
	/** The attempt row: the answer is sent back against it. */
	id: string;
	level: number;
	/** The instruction ("Scrivi l'unione per elencazione."), plain HTML; empty when the problem speaks for itself. */
	promptHtml: string;
	blocks: QuestionBlock[];
	/** `text` is the LaTeX, for the column-count guess and the screen reader. */
	options: { html: string; text: string }[];
}

/** What the server says about an answer: whether it was right, which option was, and how to solve the exercise. */
export interface Verdict {
	correct: boolean;
	correctIndex: number;
	solutionHtml: string;
	stepsHtml: string[];
}

/** A request the service refuses on purpose, with the status to answer with. */
export class ExerciseError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

/** The exercise as stored in `exercise_attempts.exercise`: the generator's sample and the multiple choice shown. */
type Stored = Sample & { choice: ChoiceAnswer };

/** The service-role client: attempts are written only by the server, so a student cannot mark an answer right. */
const db = (): SupabaseClient => adminClient() as unknown as SupabaseClient;

/** Instructions that say nothing the question does not: dropped when the problem asks its own question. */
const GENERIC_PROMPTS = new Set(['Scegli la risposta corretta.']);
/** Instructions the problem already makes plain: an equation on its own is to be solved. */
const IMPLIED_PROMPTS = new Set(["Risolvi l'equazione."]);
/** A short sentence ending in "?" is the question, not context: it is set like one. */
const isAsk = (tex: string) => tex.trim().endsWith('?') && tex.length <= 100;

/** Whether a lesson (by database path) has exercises. */
export const hasExercises = (dbPath: string): boolean => {
	const config = configs[dbPath];
	return !!config && !!generators[config.generator];
};

function view(id: string, level: number, s: Stored): ExerciseView {
	const blocks = s.problem.trim()
		? presentProblem(s.problem).map((b): QuestionBlock =>
				b.kind === 'text' ? { kind: isAsk(b.tex) ? 'ask' : 'text', html: renderMath(b.tex) } : b.kind === 'givens' ? { kind: 'givens', items: b.items.map((t) => renderTex(t, false)) } : { kind: 'math', html: renderTex(b.tex, true) }
			)
		: [];
	const asks = blocks.some((b) => b.kind === 'ask');
	const prompt = IMPLIED_PROMPTS.has(s.prompt) || (asks && GENERIC_PROMPTS.has(s.prompt)) ? '' : s.prompt;
	return {
		id,
		level,
		promptHtml: prompt ? renderMath(prompt) : '',
		blocks,
		options: s.choice.options.map((o) => ({ html: renderMath(`$$${o.latex}$$`), text: o.latex }))
	};
}

const verdict = (s: Stored, correct: boolean): Verdict => ({
	correct,
	correctIndex: s.choice.correct,
	solutionHtml: renderMath(presentStep(s.solution)),
	stepsHtml: s.steps.map((step) => renderMath(presentStep(step)))
});

/** The student's answered attempts on a generator, newest first: enough to tell which levels are mastered. */
async function history(userId: string, generatorId: string): Promise<Outcome[]> {
	const { data, error } = await db()
		.from('exercise_attempts')
		.select('level, correct')
		.eq('user_id', userId)
		.eq('generator_id', generatorId)
		.not('answered_at', 'is', null)
		.order('answered_at', { ascending: false })
		.limit(200);
	if (error) throw error;
	return (data ?? []) as Outcome[];
}

/**
 * A new exercise for a lesson, saved before it is sent. Without a level, the first one the student has not
 * mastered; with one (the level picker), that level.
 */
export async function issueExercise(userId: string, dbPath: string, level?: number, known?: Outcome[]): Promise<ExerciseView> {
	const config = configs[dbPath];
	const load = config && generators[config.generator];
	if (!config || !load) throw new ExerciseError(404, 'Esercizi non trovati.');
	if (level !== undefined && !config.levels.includes(level)) throw new ExerciseError(400, 'Livello non valido.');
	const at = level ?? startLevel(config.levels, known ?? (await history(userId, config.generator)));

	const generator = await load();
	const seed = crypto.getRandomValues(new Uint32Array(1))[0];
	const sample = generator.generate(createRng(seed), at);
	// Exercises born as multiple choice (true or false, pick the right set) are their own choice.
	const choice = sample.answer.kind === 'choice' ? sample.answer : generator.toChoice?.(sample, createRng(deriveSeed(seed, at)));
	if (!choice) throw new Error(`${config.generator}: level ${at} has no multiple-choice form`);
	const exercise: Stored = { ...sample, choice };

	const { data, error } = await db()
		.from('exercise_attempts')
		.insert({ user_id: userId, lesson_path: dbPath, generator_id: config.generator, level: at, seed, mode: 'choice', exercise, build: process.env.VERCEL_GIT_COMMIT_SHA ?? null })
		.select('id')
		.single();
	if (error) throw error;
	return view((data as { id: string }).id, at, exercise);
}

/**
 * Checks a multiple-choice answer against the saved exercise and records it. Answering twice (a retried
 * request) returns the first verdict. With `next`, also issues the following exercise, at the level the
 * answer leads to.
 */
export async function answerExercise(userId: string, id: string, choice: number, activeMs: number | null, next: boolean): Promise<{ verdict: Verdict; next: ExerciseView | null }> {
	const { data: row, error } = await db().from('exercise_attempts').select('lesson_path, generator_id, level, exercise, correct').eq('id', id).eq('user_id', userId).maybeSingle();
	if (error) throw error;
	if (!row) throw new ExerciseError(404, 'Esercizio non trovato.');
	const attempt = row as { lesson_path: string; generator_id: string; level: number; exercise: Stored; correct: boolean | null };
	if (choice >= attempt.exercise.choice.options.length) throw new ExerciseError(400, 'Risposta non valida.');

	let correct = attempt.correct;
	if (correct === null) {
		correct = choice === attempt.exercise.choice.correct;
		const { data: saved, error: saveError } = await db()
			.from('exercise_attempts')
			.update({ answer: { choice }, correct, answered_at: new Date().toISOString(), active_ms: activeMs })
			.eq('id', id)
			.is('answered_at', null)
			.select('correct');
		if (saveError) throw saveError;
		// Another request answered first: its verdict is the one that counts.
		if (!saved?.length) {
			const { data: first, error: readError } = await db().from('exercise_attempts').select('correct').eq('id', id).single();
			if (readError) throw readError;
			correct = (first as { correct: boolean }).correct;
		}
	}

	let following: ExerciseView | null = null;
	const config = configs[attempt.lesson_path];
	if (next && config?.generator === attempt.generator_id) {
		const past = await history(userId, attempt.generator_id);
		const level = nextLevel(config.levels, past, attempt.level);
		// A level the lesson no longer offers falls back to the first one not mastered.
		following = await issueExercise(userId, attempt.lesson_path, config.levels.includes(level) ? level : undefined, past);
	}
	return { verdict: verdict(attempt.exercise, correct), next: following };
}
