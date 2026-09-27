/**
 * The days of the daily worksheet. A day is an ISO date (`2026-09-27`) on the Italian calendar: it is the sheet's
 * seed, and its address in the archive (`esercizi/scheda?giorno=2026-09-27`). Shared by the server, which builds the
 * sheet, and the page's controls, which move between days.
 */

/** The first day with a sheet: the archive does not go further back. */
export const FIRST_SHEET_DAY = '2026-09-01';

const ISO = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' });

/** Today in Italy: the sheet changes at midnight in Rome, wherever the server runs. */
export const today = (now = new Date()): string => ISO.format(now);

/** A well-formed date that exists (not `2026-02-30`). */
export function isDay(value: unknown): value is string {
	if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const d = new Date(`${value}T12:00:00Z`);
	return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** The day `n` days after `day` (before, for a negative `n`). */
export function addDays(day: string, n: number): string {
	const d = new Date(`${day}T12:00:00Z`);
	d.setUTCDate(d.getUTCDate() + n);
	return d.toISOString().slice(0, 10);
}

const LONG = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const LONG_YEAR = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const SHORT = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', timeZone: 'UTC' });

const at = (day: string) => new Date(`${day}T12:00:00Z`);

/** "domenica 27 settembre", with the year when it is not this year's. */
export const dayName = (day: string, year = false): string => (year || day.slice(0, 4) !== today().slice(0, 4) ? LONG_YEAR : LONG).format(at(day));

/** "27 set". */
export const dayShort = (day: string): string => SHORT.format(at(day));
