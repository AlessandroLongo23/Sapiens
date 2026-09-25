/**
 * The mistakes a student still has to redo (vault/Decisioni/2026-09-25 Rifare gli errori vuol dire esercizi nuovi
 * sugli stessi livelli.md). A mistake belongs to a slot, one level of one generator: the review asks new exercises
 * there, never the one answered wrong. A slot stays open until the student answers right CLOSE_AFTER times at it in
 * runs after the one with the last mistake, of any kind, within REVIEW_WINDOW_DAYS. Right answers later in the same
 * run do not count: a run at a level asks that level ten times, and a mistake has to be made up for by coming back.
 * Older mistakes are left to the history. Pure: the server reads the answers, this decides.
 */

/** Days a mistake stays to redo. */
export const REVIEW_WINDOW_DAYS = 30;
/** Right answers at a slot, after its last mistake, that close it. */
export const CLOSE_AFTER = 2;
/** Questions in a review run. */
export const REVIEW_LENGTH = 5;

/** One answered question. */
export interface AnswerRecord {
	lesson: string;
	generator: string;
	level: number;
	correct: boolean;
	/** When it was answered, ISO. */
	at: string;
	/** The run it was answered in; null for answers from before runs existed. */
	run: string | null;
}

/** A level of a generator where the student erred and has not made up for it yet. */
export interface MistakeSlot {
	/** The lesson of the most recent answer at the slot: where the review asks from. */
	lesson: string;
	generator: string;
	level: number;
	/** The newest mistake, ISO. */
	lastWrong: string;
	/** Right answers since then, fewer than CLOSE_AFTER. */
	rightSince: number;
}

/** One question of a review run. */
export interface ReviewItem {
	lesson: string;
	generator: string;
	level: number;
}

const slotKey = (generator: string, level: number) => `${generator}#${level}`;

/** The open slots, newest mistake first, from the student's answers in any order. */
export function openMistakes(records: readonly AnswerRecord[], now: Date = new Date()): MistakeSlot[] {
	const since = now.getTime() - REVIEW_WINDOW_DAYS * 86_400_000;
	const bySlot = new Map<string, AnswerRecord[]>();
	for (const r of records) {
		if (Date.parse(r.at) < since) continue;
		const key = slotKey(r.generator, r.level);
		bySlot.set(key, [...(bySlot.get(key) ?? []), r]);
	}
	const slots: MistakeSlot[] = [];
	for (const answers of bySlot.values()) {
		const newestFirst = [...answers].sort((a, b) => b.at.localeCompare(a.at));
		const lastWrong = newestFirst.find((a) => !a.correct);
		if (!lastWrong) continue;
		const rightSince = newestFirst.filter((a) => a.correct && a.at > lastWrong.at && (a.run === null || a.run !== lastWrong.run)).length;
		if (rightSince >= CLOSE_AFTER) continue;
		slots.push({ lesson: newestFirst[0].lesson, generator: lastWrong.generator, level: lastWrong.level, lastWrong: lastWrong.at, rightSince });
	}
	return slots.sort((a, b) => b.lastWrong.localeCompare(a.lastWrong));
}

/** Whether the slot of an answer is still open. */
export function isOpen(slots: readonly MistakeSlot[], generator: string, level: number): boolean {
	return slots.some((s) => s.generator === generator && s.level === level);
}

/**
 * The questions of a review, `length` of them: the slots in turn, newest mistake first, so a single slot fills the
 * whole run and several share it. Empty with no slots.
 */
export function reviewPlan(slots: readonly Pick<MistakeSlot, 'lesson' | 'generator' | 'level'>[], length: number = REVIEW_LENGTH): ReviewItem[] {
	if (slots.length === 0 || length <= 0) return [];
	return Array.from({ length }, (_, i) => {
		const { lesson, generator, level } = slots[i % slots.length];
		return { lesson, generator, level };
	});
}
