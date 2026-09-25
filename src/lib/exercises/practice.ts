/**
 * The daily practice (vault/Decisioni/2026-09-25 La pratica quotidiana entra nella beta.md): PRACTICE_LENGTH
 * questions from the lessons the student has started. Up to MISTAKES_IN_PRACTICE come from mistakes still open, one
 * from the level the student has reached in the lesson practised most recently, the rest from levels already passed
 * in the lessons practised least recently, so what was learnt comes back. At most MAX_LESSONS lessons, never a locked
 * level. Pure and seeded: the same student on the same day gets the same practice.
 */
import type { Rng } from './v2/types';
import type { MistakeSlot, ReviewItem } from './review';

/** Questions in the daily practice. */
export const PRACTICE_LENGTH = 5;
/** Of those, at most this many from mistakes still open. */
export const MISTAKES_IN_PRACTICE = 2;
/** Lessons a practice draws from. */
export const MAX_LESSONS = 3;

/** A lesson the student has started, as the practice sees it. */
export interface StartedLesson {
	lesson: string;
	generator: string;
	/** Levels passed. */
	passed: number[];
	/** The first level not passed: the one the path suggests, always open. */
	current: number;
	/** The newest run on it, ISO. */
	lastAt: string;
}

/** The questions of today's practice; empty when no lesson is started. */
export function practicePlan(lessons: readonly StartedLesson[], mistakes: readonly Pick<MistakeSlot, 'lesson' | 'generator' | 'level'>[], rng: Rng, length: number = PRACTICE_LENGTH): ReviewItem[] {
	if (lessons.length === 0 || length <= 0) return [];
	const newestFirst = [...lessons].sort((a, b) => b.lastAt.localeCompare(a.lastAt));
	const known = new Set(lessons.map((l) => l.generator));
	const items: ReviewItem[] = [];
	const used = new Set<string>();
	const add = (item: ReviewItem) => {
		if (items.length >= length) return false;
		if (!used.has(item.lesson) && used.size >= MAX_LESSONS) return false;
		used.add(item.lesson);
		items.push(item);
		return true;
	};

	// Mistakes still open, newest first, on lessons still on the path.
	for (const m of mistakes.filter((m) => known.has(m.generator)).slice(0, MISTAKES_IN_PRACTICE)) add({ lesson: m.lesson, generator: m.generator, level: m.level });

	// Where the student is going: the level reached in the lesson practised last.
	const latest = newestFirst[0];
	add({ lesson: latest.lesson, generator: latest.generator, level: latest.current });

	// What was learnt: passed levels, lessons practised least recently first.
	const review = [...newestFirst].reverse().filter((l) => l.passed.length > 0);
	for (let round = 0; items.length < length && round < length; round++) {
		let added = false;
		for (const l of review) {
			if (items.length >= length) break;
			if (add({ lesson: l.lesson, generator: l.generator, level: rng.pick(l.passed) })) added = true;
		}
		if (!added) break;
	}

	// Nothing passed yet anywhere: the current levels, lesson by lesson, fill the rest.
	for (let round = 0; items.length < length && round < length; round++) {
		let added = false;
		for (const l of newestFirst) if (add({ lesson: l.lesson, generator: l.generator, level: l.current })) added = true;
		if (!added) break;
	}
	return items;
}

/** A 32-bit seed from a student and a day, for practicePlan's rng. */
export function practiceSeed(userId: string, day: string): number {
	let h = 2166136261;
	for (const c of `${userId}:${day}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
	return h >>> 0;
}
