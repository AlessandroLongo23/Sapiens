/**
 * Days of the diary as ISO dates (`2026-09-26`), in Rome: the server says which day is today, everything else is
 * arithmetic on the date alone, done at noon UTC so that no clock change moves a day. Pure, shared by server and browser.
 */

export type Day = string;

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** A real calendar day written as ISO: `2026-02-30` is not one. */
export function isDay(value: unknown): value is Day {
	if (typeof value !== 'string' || !DAY.test(value)) return false;
	const d = new Date(`${value}T12:00:00Z`);
	return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

const at = (day: Day) => new Date(`${day}T12:00:00Z`);
const iso = (d: Date): Day => d.toISOString().slice(0, 10);

export function addDays(day: Day, n: number): Day {
	const d = at(day);
	d.setUTCDate(d.getUTCDate() + n);
	return iso(d);
}

/** Whole days from `a` to `b`: positive when `b` comes later. */
export const daysBetween = (a: Day, b: Day) => Math.round((at(b).getTime() - at(a).getTime()) / 86_400_000);

/** Monday 0 … Sunday 6, as an Italian week goes. */
export const weekday = (day: Day) => (at(day).getUTCDay() + 6) % 7;

/** The Monday of the day's week. */
export const weekStart = (day: Day) => addDays(day, -weekday(day));

/** The seven days of the day's week, Monday first. */
export const weekOf = (day: Day): Day[] => Array.from({ length: 7 }, (_, i) => addDays(weekStart(day), i));

export const monthStart = (day: Day): Day => `${day.slice(0, 7)}-01`;

export function addMonths(day: Day, n: number): Day {
	const d = at(monthStart(day));
	d.setUTCMonth(d.getUTCMonth() + n);
	return iso(d);
}

/** The month's grid for a calendar: whole weeks, Monday first, from the week of the 1st to the week of the last day. */
export function monthGrid(day: Day): Day[] {
	const first = monthStart(day);
	const last = addDays(addMonths(first, 1), -1);
	const days: Day[] = [];
	for (let d = weekStart(first); daysBetween(d, last) >= 0 || weekday(d) !== 0; d = addDays(d, 1)) days.push(d);
	return days;
}

/**
 * The school year a day belongs to, named by the year it starts in: September to August. The diary's months run
 * from September to June; July and August still belong to the year that is ending.
 */
export const schoolYear = (day: Day) => {
	const y = Number(day.slice(0, 4));
	return Number(day.slice(5, 7)) >= 9 ? y : y - 1;
};

/** September to June of a school year, as the first day of each month: the diary's months, one tab each. */
export const schoolMonths = (year: number): Day[] => Array.from({ length: 10 }, (_, i) => addMonths(`${year}-09-01`, i));

const fmt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('it-IT', { ...options, timeZone: 'UTC' });
const WEEKDAY_LONG = fmt({ weekday: 'long' });
const WEEKDAY_SHORT = fmt({ weekday: 'short' });
const MONTH_LONG = fmt({ month: 'long' });
const MONTH_SHORT = fmt({ month: 'short' });

export const weekdayName = (day: Day) => WEEKDAY_LONG.format(at(day));
/** `lun`, `mar`: three letters, no dot. */
export const weekdayShort = (day: Day) => WEEKDAY_SHORT.format(at(day)).replace('.', '');
export const monthName = (day: Day) => MONTH_LONG.format(at(day));
export const monthShort = (day: Day) => MONTH_SHORT.format(at(day)).replace('.', '');
export const dayOfMonth = (day: Day) => Number(day.slice(8, 10));

/** `giovedì 1 ottobre`. */
export const longDate = (day: Day) => `${weekdayName(day)} ${dayOfMonth(day)} ${monthName(day)}`;

/** How far a day is from today, in words: `oggi`, `domani`, `tra 3 giorni`, `ieri`, `5 giorni fa`. */
export function relativeDay(day: Day, today: Day): string {
	const n = daysBetween(today, day);
	if (n === 0) return 'oggi';
	if (n === 1) return 'domani';
	if (n === 2) return 'dopodomani';
	if (n === -1) return 'ieri';
	if (n > 0) return n < 14 ? `tra ${n} giorni` : `il ${dayOfMonth(day)} ${monthName(day)}`;
	return -n < 14 ? `${-n} giorni fa` : `il ${dayOfMonth(day)} ${monthName(day)}`;
}
