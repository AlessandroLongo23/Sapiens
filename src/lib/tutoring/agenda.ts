/**
 * The tutor's agenda (vault/Prodotti/Tutor/Agenda tutor.md): the shapes both sides read, the checks on what a
 * form sends, and the clock. Lessons are stored as instants and shown in Rome's time, whatever the device says.
 * Pure: no database, no browser.
 */
import { TUTOR_LEVELS, TUTOR_MODES, type TutorLevel, type TutorMode } from './config';

export type LinkStatus = 'invited' | 'active' | 'ended';
export type LessonStatus = 'proposed' | 'confirmed' | 'declined' | 'cancelled';
export type Side = 'tutor' | 'student';

/** A tutor and one student, as the tutor sees it. */
export interface TutorLink {
	id: string;
	name: string;
	subject: string | null;
	level: TutorLevel | null;
	status: LinkStatus;
	origin: 'invite' | 'request';
	/** The student has an account tied to this link. */
	joined: boolean;
	progressShared: boolean;
	inviteCode: string | null;
	notes: string;
	createdAt: string;
}

/** The same link, as the student sees it: the tutor's public face, never the notes. */
export interface StudentLink {
	id: string;
	status: LinkStatus;
	subject: string | null;
	progressShared: boolean;
	tutor: { slug: string; firstName: string; lastInitial: string; headline: string; published: boolean; subjects: string[] };
}

export interface AgendaLesson {
	id: string;
	linkId: string;
	/** The other side's name: the student for the tutor, the tutor for the student. */
	with: string;
	startsAt: string;
	durationMin: number;
	mode: TutorMode;
	place: string;
	note: string;
	status: LessonStatus;
	proposedBy: Side;
	seriesId: string | null;
	/** What the lesson is on: one student can take more than one subject with the same tutor. */
	subject: string | null;
	/** Only the tutor reads these two: the price of an hour and whether the lesson has been paid. */
	hourlyRate?: number | null;
	paid?: boolean;
}

/** What a lesson is worth: its hours by the price of one. */
export const lessonFee = (lesson: Pick<AgendaLesson, 'durationMin' | 'hourlyRate'>): number => ((lesson.hourlyRate ?? 0) * lesson.durationMin) / 60;

const EURO = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2, minimumFractionDigits: 0 });
export const euro = (amount: number): string => EURO.format(Math.round(amount * 100) / 100);

export interface AgendaAssignment {
	id: string;
	linkId: string;
	lessonPath: string;
	title: string;
	/** The lesson's exercises page. */
	url: string;
	level: number | null;
	levelName: string | null;
	due: string;
	note: string;
	/** Read from the student's runs; null when the tutor may not see them. */
	done: boolean | null;
	createdAt: string;
}

export interface AgendaMessage {
	id: string;
	sender: Side;
	body: string;
	createdAt: string;
}

/** A stretch of free time in the week. Monday is 0; times are HH:MM. */
export interface Slot {
	weekday: number;
	start: string;
	end: string;
}

export interface TutorReview {
	rating: number;
	body: string;
	createdAt: string;
}

/** A lesson of the library a tutor can assign, with the levels of its path. */
export interface AssignableLesson {
	path: string;
	title: string;
	chapter: string;
	subject: string;
	levels: { level: number; name: string | null }[];
}

export const WEEKDAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
export const WEEKDAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
export const DURATIONS = [30, 45, 60, 90, 120];
export const REVIEW_LABELS: Record<number, string> = { 1: 'Da migliorare', 2: 'Sufficiente', 3: 'Buono', 4: 'Molto buono', 5: 'Eccellente' };
export const MAX_SLOTS = 28;
export const MAX_MESSAGE = 2000;
export const MAX_NOTES = 4000;

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const LEVELS = new Set<string>(TUTOR_LEVELS.map((l) => l.id));
const MODES = new Set<string>(TUTOR_MODES.map((m) => m.id));

export const isDayString = (v: unknown): v is string => typeof v === 'string' && DAY.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
export const isTime = (v: unknown): v is string => typeof v === 'string' && TIME.test(v);
export const isLevel = (v: unknown): v is TutorLevel => typeof v === 'string' && LEVELS.has(v);
export const isMode = (v: unknown): v is TutorMode => typeof v === 'string' && MODES.has(v);

const text = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/* ------------------------------------------------------------------ clock */

const ROME_PARTS = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/** The day and the time in Rome of an instant. */
export function romeParts(iso: string | Date): { day: string; time: string } {
	const parts = Object.fromEntries(ROME_PARTS.formatToParts(new Date(iso)).map((p) => [p.type, p.value]));
	return { day: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

/** The instant of a day and a time in Rome. Around the change of the clocks the offset is read twice, so the hour holds. */
export function romeInstant(day: string, time: string): Date {
	const [y, m, d] = day.split('-').map(Number);
	const [hh, mm] = time.split(':').map(Number);
	const wall = Date.UTC(y, m - 1, d, hh, mm);
	const offsetAt = (t: number) => {
		const p = romeParts(new Date(t));
		const [py, pm, pd] = p.day.split('-').map(Number);
		const [ph, pmin] = p.time.split(':').map(Number);
		return Date.UTC(py, pm - 1, pd, ph, pmin) - t;
	};
	const first = wall - offsetAt(wall);
	return new Date(wall - offsetAt(first));
}

const shiftDay = (day: string, n: number): string => {
	const d = new Date(`${day}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() + n);
	return d.toISOString().slice(0, 10);
};

/** Monday of the week of a day. */
export const mondayOf = (day: string): string => shiftDay(day, -((new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7));
export const addDay = shiftDay;
/** Monday is 0. */
export const weekdayOf = (day: string): number => (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7;

/** A month (`YYYY-MM`) moved by a number of months. */
export const shiftMonth = (month: string, by: number): string => new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1 + by, 1)).toISOString().slice(0, 7);

/** The days a month's page shows: whole weeks, Monday first, from the week of the 1st to the week of the last day. */
export function monthGrid(month: string): string[] {
	const first = mondayOf(`${month}-01`);
	const last = shiftDay(`${shiftMonth(month, 1)}-01`, -1);
	const days: string[] = [];
	for (let d = first; d <= last || weekdayOf(d) !== 0; d = shiftDay(d, 1)) days.push(d);
	return days;
}

/** The same weekday, week after week, until the month of the first day ends: how the old agenda repeated a lesson. */
export function weeklyUntilMonthEnd(day: string): string[] {
	const days = [day];
	for (let next = shiftDay(day, 7); next.slice(0, 7) === day.slice(0, 7); next = shiftDay(next, 7)) days.push(next);
	return days;
}

const LONG_DAY = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const SHORT_DAY = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/** "giovedì 8 ottobre". */
export const longDay = (day: string): string => LONG_DAY.format(new Date(`${day}T00:00:00Z`));
/** "8 ott". */
export const shortDay = (day: string): string => SHORT_DAY.format(new Date(`${day}T00:00:00Z`)).replace('.', '');

/** "giovedì 8 ottobre, 16:00-17:00". */
export function lessonWhen(lesson: Pick<AgendaLesson, 'startsAt' | 'durationMin'>): string {
	const { day, time } = romeParts(lesson.startsAt);
	const end = romeParts(new Date(Date.parse(lesson.startsAt) + lesson.durationMin * 60_000)).time;
	return `${longDay(day)}, ${time}-${end}`;
}

export const durationLabel = (min: number): string => (min < 60 ? `${min} min` : min % 60 === 0 ? `${min / 60} h` : `${Math.floor(min / 60)} h ${min % 60} min`);

/** A lesson already held: confirmed, and over. */
export const isHeld = (lesson: Pick<AgendaLesson, 'startsAt' | 'durationMin' | 'status'>, now = Date.now()): boolean =>
	lesson.status === 'confirmed' && Date.parse(lesson.startsAt) + lesson.durationMin * 60_000 <= now;

/* ----------------------------------------------------------------- inputs */

export interface LinkInput {
	name: string;
	subject: string | null;
	level: TutorLevel | null;
}

/** A new student or a change to one; a string is the error to show. */
export function parseLinkInput(body: Record<string, unknown>, subjects: ReadonlySet<string>): LinkInput | string {
	const name = text(body.name, 80);
	if (!name) return 'Scrivi il nome dello studente.';
	const subject = text(body.subject, 40);
	if (subject && !subjects.has(subject)) return 'Materia non valida.';
	const level = body.level === '' || body.level == null ? null : body.level;
	if (level !== null && !isLevel(level)) return 'Livello non valido.';
	return { name, subject: subject || null, level };
}

export interface LessonInput {
	day: string;
	time: string;
	durationMin: number;
	mode: TutorMode;
	place: string;
	note: string;
	repeat: boolean;
	/** Empty: the subject of the student's link. */
	subject: string | null;
	/** Empty: the price on the tutor's profile. A student never sets it. */
	hourlyRate: number | null;
}

export function parseLessonInput(body: Record<string, unknown>, subjects: ReadonlySet<string>): LessonInput | string {
	if (!isDayString(body.day)) return 'Scegli il giorno.';
	if (!isTime(body.time)) return "Scegli l'ora.";
	const durationMin = Number(body.durationMin);
	if (!Number.isInteger(durationMin) || durationMin < 15 || durationMin > 480) return 'Durata non valida.';
	if (!isMode(body.mode)) return 'Scegli se online o in presenza.';
	const subject = typeof body.subject === 'string' && body.subject ? body.subject : null;
	if (subject && !subjects.has(subject)) return 'Materia non valida.';
	const rate = body.hourlyRate === '' || body.hourlyRate == null ? null : Number(body.hourlyRate);
	if (rate !== null && (!Number.isFinite(rate) || rate < 0 || rate > 500)) return 'Tariffa non valida.';
	return { day: body.day, time: body.time, durationMin, mode: body.mode, place: text(body.place, 300), note: text(body.note, 500), repeat: body.repeat === true, subject, hourlyRate: rate === null ? null : Math.round(rate * 100) / 100 };
}

export interface AssignmentInput {
	lessonPath: string;
	level: number | null;
	due: string;
	note: string;
}

export function parseAssignmentInput(body: Record<string, unknown>): AssignmentInput | string {
	const lessonPath = text(body.lessonPath, 200);
	if (!lessonPath) return 'Scegli la lezione.';
	const level = body.level === '' || body.level == null ? null : Number(body.level);
	if (level !== null && (!Number.isInteger(level) || level < 1)) return 'Livello non valido.';
	if (!isDayString(body.due)) return 'Scegli la scadenza.';
	return { lessonPath, level, due: body.due, note: text(body.note, 300) };
}

/** The week's free hours: checked, sorted, with overlapping stretches of a day merged. */
export function parseSlots(value: unknown): Slot[] | string {
	if (!Array.isArray(value)) return 'Orari non validi.';
	if (value.length > MAX_SLOTS) return `Al massimo ${MAX_SLOTS} fasce orarie.`;
	const slots: Slot[] = [];
	for (const raw of value) {
		const s = raw as Partial<Slot> | null;
		if (!s || !Number.isInteger(s.weekday) || s.weekday! < 0 || s.weekday! > 6 || !isTime(s.start) || !isTime(s.end)) return 'Orari non validi.';
		if (s.end <= s.start) return "In ogni fascia la fine viene dopo l'inizio.";
		slots.push({ weekday: s.weekday!, start: s.start, end: s.end });
	}
	slots.sort((a, b) => a.weekday - b.weekday || a.start.localeCompare(b.start));
	const merged: Slot[] = [];
	for (const s of slots) {
		const last = merged[merged.length - 1];
		if (last && last.weekday === s.weekday && s.start <= last.end) last.end = s.end > last.end ? s.end : last.end;
		else merged.push({ ...s });
	}
	return merged;
}

export function parseReview(body: Record<string, unknown>): { rating: number; body: string } | string {
	const rating = Number(body.rating);
	if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'Scegli un voto da 1 a 5.';
	return { rating, body: text(body.body, 1000) };
}

/** The slots of a week by day, for the profile and the editor. */
export function slotsByDay(slots: Slot[]): Slot[][] {
	const days: Slot[][] = Array.from({ length: 7 }, () => []);
	for (const s of slots) days[s.weekday]?.push(s);
	return days;
}
