/**
 * A lesson's exercise path (vault/Decisioni/2026-09-25 Gli esercizi sono un percorso di livelli.md). The student
 * picks a level before a run, and every question of the run is at that level. A run with at least 8 answers
 * right out of 10 passes its level and opens the next one. A locked level opens with a jump test: JUMP_LENGTH
 * questions on the levels it skips, from the first not passed to the one below; passing it counts them as passed.
 * Pure: the server checks a run against it and the page draws the path with it.
 */

/** Share of right answers that passes a level or a jump test: 8 out of 10, 4 out of 5. */
export const PASS_RATIO = 0.8;
/** Questions in a jump test. */
export const JUMP_LENGTH = 5;

export type RunKind = 'level' | 'jump';

/** A run the student started, with its result so far. */
export interface Run {
	kind: RunKind;
	/** The level practised, or the level a jump test opens. */
	level: number;
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
	/** Finished runs at this level, newest first. */
	runs: Run[];
	/** The finished run with the most answers right. */
	best: Run | null;
}

/** Right answers needed out of `total`. */
export const passMark = (total: number) => Math.ceil(total * PASS_RATIO);

export const finished = (run: Pick<Run, 'total' | 'answered'>) => run.answered >= run.total;

export const runPassed = (run: Pick<Run, 'total' | 'answered' | 'correct'>) => finished(run) && run.correct >= passMark(run.total);

/**
 * Where the student stands on each level offered, easiest first, from their runs (any order). `current` is the
 * first level not passed, the one the path suggests; the hardest when all are passed.
 */
export function pathState(levels: readonly number[], runs: readonly Run[]): { states: LevelState[]; current: number } {
	const byRun = new Set(runs.filter((r) => r.kind === 'level' && runPassed(r)).map((r) => r.level));
	const jumpedTo = Math.max(0, ...runs.filter((r) => r.kind === 'jump' && runPassed(r)).map((r) => r.level));
	const passed = (level: number) => byRun.has(level) || level < jumpedTo;
	const newestFirst = [...runs].sort((a, b) => b.at.localeCompare(a.at));

	const states = levels.map((level, i): LevelState => {
		const done = newestFirst.filter((r) => r.kind === 'level' && r.level === level && finished(r));
		const best = done.reduce<Run | null>((top, r) => (!top || r.correct / r.total > top.correct / top.total ? r : top), null);
		return {
			level,
			status: passed(level) ? 'passed' : i === 0 || passed(levels[i - 1]) ? 'open' : 'locked',
			skipped: !byRun.has(level) && level < jumpedTo,
			runs: done,
			best
		};
	});
	return { states, current: states.find((s) => s.status !== 'passed')?.level ?? levels[levels.length - 1] };
}

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
