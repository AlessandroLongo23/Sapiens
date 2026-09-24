/**
 * Which level the exercise page shows next (vault/Decisioni/2026-09-24 Il livello degli esercizi lo sceglie la pagina.md).
 * A level is mastered when the student's last two answers at that level are both right. A session starts at the
 * first level not yet mastered and climbs once the current one is; a mistake keeps it where it is.
 */

/** An answered attempt, newest first. */
export interface Outcome {
	level: number;
	correct: boolean;
}

export function mastered(history: readonly Outcome[], level: number): boolean {
	const last = history.filter((o) => o.level === level).slice(0, 2);
	return last.length === 2 && last.every((o) => o.correct);
}

/** The first level offered and not yet mastered; the hardest when all are. */
export function startLevel(levels: readonly number[], history: readonly Outcome[]): number {
	return levels.find((l) => !mastered(history, l)) ?? levels[levels.length - 1];
}

/** The level after an answer at `current`: the next one up once `current` is mastered, otherwise the same. */
export function nextLevel(levels: readonly number[], history: readonly Outcome[], current: number): number {
	if (!mastered(history, current)) return current;
	return levels.find((l) => l > current) ?? current;
}
