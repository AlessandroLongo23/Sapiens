/**
 * A lesson's exercise path (vault/Decisioni/2026-09-25 Gli esercizi sono un percorso di livelli.md), each level a
 * stage of repetitions (vault/Decisioni/2026-09-30 Ogni livello è una tappa con più tipi di esercizio, e si supera a
 * risposta aperta.md). The student picks a level before a run, and every question of the run is at that level. A
 * repetition has REPETITION_LENGTH questions and counts with REPETITION_PASS right; the open answers grow at each
 * one (RAMP), and the last one passes the level and opens the next. A level with no open answers has
 * CHOICE_ONLY_STEPS repetitions, all multiple choice. A locked level opens with a jump test: JUMP_LENGTH questions
 * on the levels it skips, from the first not passed to the one below; passing it counts them as passed.
 * Pure: the server checks a run against it and the page draws the path with it.
 */
import { openGrading } from './v2/open-answers';

/** Questions in a repetition, and right answers it needs to count: 7 out of 8. */
export const REPETITION_LENGTH = 8;
export const REPETITION_PASS = 7;
/** Open questions in each repetition, in order: the multiple choice is taken away a little at a time. */
export const RAMP = [0, 2, 4, 6] as const;
/** Repetitions of a level with no open answers. */
export const CHOICE_ONLY_STEPS = 3;

/** Share of right answers that passes a jump test (4 out of 5), and passed a run before the repetitions. */
export const PASS_RATIO = 0.8;
/** Questions in a jump test. */
export const JUMP_LENGTH = 5;

export type RunKind = 'level' | 'jump';
export type QuestionMode = 'choice' | 'open';

/** A run the student started, with its result so far. */
export interface Run {
	kind: RunKind;
	/** The level practised, or the level a jump test opens. */
	level: number;
	/**
	 * Which repetition of the level a run at a level is, from 1; past the last, practice on a passed level. Null for a
	 * jump test and for the runs of 10 questions made before the repetitions, which passed a level with 8 right.
	 */
	step: number | null;
	/** Questions in the run. */
	total: number;
	answered: number;
	correct: number;
	/** When it started, ISO. */
	at: string;
}

export type LevelStatus = 'passed' | 'open' | 'locked';

export interface LevelState {
	level: number;
	status: LevelStatus;
	/** Passed with a jump test, never with a run at the level itself. */
	skipped: boolean;
	/** Repetitions that counted, up to `steps`. */
	repetitions: number;
	/** Repetitions that pass the level. */
	steps: number;
	/** Finished runs at this level, newest first. */
	runs: Run[];
	/** The finished run with the most answers right. */
	best: Run | null;
}

/** Whether a level takes open answers (src/lib/exercises/v2/open-answers.ts). */
export const hasOpenAnswers = (generatorId: string, level: number) => openGrading(generatorId, level) !== null;

/** Repetitions that pass a level: one per step of the ramp, or CHOICE_ONLY_STEPS without open answers. */
export const stepsFor = (generatorId: string, level: number) => (hasOpenAnswers(generatorId, level) ? RAMP.length : CHOICE_ONLY_STEPS);

/**
 * The kind of each question of a repetition: multiple choice first, then open answers, as the ramp says for the
 * step. Past the last step (a level already passed) every question is open, as the reviews will be.
 */
export function repetitionModes(generatorId: string, level: number, step: number): QuestionMode[] {
	const open = !hasOpenAnswers(generatorId, level) ? 0 : step > RAMP.length ? REPETITION_LENGTH : RAMP[Math.max(1, step) - 1];
	return Array.from({ length: REPETITION_LENGTH }, (_, i): QuestionMode => (i < REPETITION_LENGTH - open ? 'choice' : 'open'));
}

/** Right answers needed out of `total`: 7 of a repetition, 4 of a jump test. */
export const passMark = (total: number) => (total === REPETITION_LENGTH ? REPETITION_PASS : Math.ceil(total * PASS_RATIO));

/**
 * Whether a run of `total` questions can count at all: a repetition only whole. A Free run cut short by the day's
 * session trains, counts for the streak and for mistakes, but does not count as a repetition.
 */
export const canPass = (total: number) => total === REPETITION_LENGTH || total >= 10;

export const finished = (run: Pick<Run, 'total' | 'answered'>) => run.answered >= run.total;

/** A repetition that counts, a jump test passed, or a run of 10 from before the repetitions with 8 right. */
export const runPassed = (run: Pick<Run, 'total' | 'answered' | 'correct'> & Partial<Pick<Run, 'kind'>>) => {
	if (!finished(run)) return false;
	if (run.kind === 'jump') return run.total >= JUMP_LENGTH && run.correct >= Math.ceil(run.total * PASS_RATIO);
	return canPass(run.total) && run.correct >= passMark(run.total);
};

/**
 * Where the student stands on each level offered, easiest first, from their runs (any order). A level is passed by
 * its repetitions, by a run of 10 from before them, or by a jump test beyond it. `current` is the first level not
 * passed, the one the path suggests; the hardest when all are passed.
 */
export function pathState(generatorId: string, levels: readonly number[], runs: readonly Run[]): { states: LevelState[]; current: number } {
	const jumpedTo = Math.max(0, ...runs.filter((r) => r.kind === 'jump' && runPassed(r)).map((r) => r.level));
	const newestFirst = [...runs].sort((a, b) => b.at.localeCompare(a.at));
	const counted = (level: number) => runs.filter((r) => r.kind === 'level' && r.level === level && runPassed(r));
	const byRuns = (level: number) => {
		const done = counted(level);
		return done.some((r) => r.step === null) || done.length >= stepsFor(generatorId, level);
	};
	const passed = (level: number) => byRuns(level) || level < jumpedTo;

	const states = levels.map((level, i): LevelState => {
		const done = newestFirst.filter((r) => r.kind === 'level' && r.level === level && finished(r));
		const best = done.reduce<Run | null>((top, r) => (!top || r.correct / r.total > top.correct / top.total ? r : top), null);
		const steps = stepsFor(generatorId, level);
		return {
			level,
			status: passed(level) ? 'passed' : i === 0 || passed(levels[i - 1]) ? 'open' : 'locked',
			skipped: !byRuns(level) && level < jumpedTo,
			repetitions: byRuns(level) ? steps : Math.min(steps, counted(level).length),
			steps,
			runs: done,
			best
		};
	});
	return { states, current: states.find((s) => s.status !== 'passed')?.level ?? levels[levels.length - 1] };
}

/** The repetition the next run at a level is: one past those that counted; past the last once the level is passed. */
export const nextStep = (state: Pick<LevelState, 'repetitions' | 'steps' | 'status'>) => (state.status === 'passed' ? state.steps + 1 : state.repetitions + 1);

/** The levels a jump test to `target` skips: the ones not passed below it. Empty when `target` is not locked. */
export function skippedBy(states: readonly LevelState[], target: number): number[] {
	if (states.find((s) => s.level === target)?.status !== 'locked') return [];
	return states.filter((s) => s.level < target && s.status !== 'passed').map((s) => s.level);
}

/**
 * The level of each question of a jump test, easiest first: spread over the skipped levels, weighted towards the
 * hardest, which is always asked. Two skipped levels give 1 1 2 2 2; more than JUMP_LENGTH leave out the easiest.
 */
export function jumpPlan(skipped: readonly number[]): number[] {
	const k = skipped.length;
	return Array.from({ length: JUMP_LENGTH }, (_, j) => skipped[k - 1 - Math.floor(((JUMP_LENGTH - 1 - j) * k) / JUMP_LENGTH)]);
}
