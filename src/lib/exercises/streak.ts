/**
 * The streak of days (vault/Piano/Progressi dello studente.md): a day counts when the student answers at least
 * STREAK_MIN_ANSWERS questions, in any kind of run, on that day in Rome. The streak runs up to today, or up to
 * yesterday while today is not done yet: then it can still be kept, and the page says so without blame. The best
 * streak is never shown as lost. Pure: days in, numbers out.
 */

/** Answers that make a day count. */
export const STREAK_MIN_ANSWERS = 5;

/** A day of answers, YYYY-MM-DD in Rome. */
export interface AnswerDay {
	day: string;
	answered: number;
}

export interface Streak {
	/** Days in a row, up to today or yesterday. */
	current: number;
	/** The longest run of days in the history given. */
	best: number;
	/** Today counts already. */
	today: boolean;
	/** Answers given today, towards STREAK_MIN_ANSWERS. */
	todayAnswered: number;
	/** The streak reaches yesterday but not today yet: it ends at midnight unless today counts. */
	atRisk: boolean;
}

/** The day before a YYYY-MM-DD date. */
export function previousDay(day: string): string {
	const d = new Date(`${day}T12:00:00Z`);
	d.setUTCDate(d.getUTCDate() - 1);
	return d.toISOString().slice(0, 10);
}

export function streakOf(days: readonly AnswerDay[], today: string): Streak {
	const counted = new Set(days.filter((d) => d.answered >= STREAK_MIN_ANSWERS).map((d) => d.day));
	const todayAnswered = days.find((d) => d.day === today)?.answered ?? 0;
	const doneToday = counted.has(today);
	let current = 0;
	for (let day = doneToday ? today : previousDay(today); counted.has(day); day = previousDay(day)) current++;

	let best = 0;
	for (const day of counted) {
		// Count only from the first day of each run of days.
		if (counted.has(previousDay(day))) continue;
		let length = 0;
		for (let d = day; counted.has(d); d = nextDay(d)) length++;
		best = Math.max(best, length);
	}
	return { current, best, today: doneToday, todayAnswered, atRisk: !doneToday && current > 0 };
}

function nextDay(day: string): string {
	const d = new Date(`${day}T12:00:00Z`);
	d.setUTCDate(d.getUTCDate() + 1);
	return d.toISOString().slice(0, 10);
}
