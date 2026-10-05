/**
 * An entry of the diary and the one line a student writes it with: "verifica mate giovedì" becomes a test in
 * mathematics next Thursday. Kind, subject and day are read from the words; what is left is the text, as written.
 * Nothing is guessed that the student cannot see: the page shows what was read before the entry is saved. Pure.
 */
import { addDays, daysBetween, isDay, weekday, weekStart, type Day } from './dates';
import { DIARY_SUBJECTS, SUBJECT_BY_KEY } from './subjects';

export type EntryKind = 'compito' | 'verifica' | 'interrogazione' | 'promemoria';

export const ENTRY_KINDS: { value: EntryKind; label: string }[] = [
	{ value: 'compito', label: 'Compito' },
	{ value: 'verifica', label: 'Verifica' },
	{ value: 'interrogazione', label: 'Interrogazione' },
	{ value: 'promemoria', label: 'Promemoria' }
];

export const KIND_LABEL: Record<EntryKind, string> = Object.fromEntries(ENTRY_KINDS.map((k) => [k.value, k.label])) as Record<EntryKind, string>;

/** Tests and oral tests: the entries a student prepares for, which Sapiens plans a review for. */
export const isTest = (kind: EntryKind) => kind === 'verifica' || kind === 'interrogazione';

export type EntrySource = 'studente' | 'docente' | 'tutor';

export interface DiaryEntry {
	id: string;
	day: Day;
	kind: EntryKind;
	subject: string | null;
	text: string;
	/** Database path of the chapter or lesson the entry is about. */
	topic: string | null;
	done: boolean;
	hidden: boolean;
	source: EntrySource;
}

export const MAX_TEXT = 300;

/** What a line says, before it is saved. `dayFound` is false when no day was written: the entry goes on the page's day. */
export interface ParsedLine {
	kind: EntryKind;
	subject: string | null;
	day: Day;
	dayFound: boolean;
	text: string;
}

/** Lower case, accents off, one character for one: positions in the result are positions in the line. */
const fold = (s: string) =>
	Array.from(s.toLowerCase(), (c) => {
		const base = c.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		return base.length === 1 ? base : c;
	}).join('');

const NUMBERS: Record<string, number> = { un: 1, uno: 1, una: 1, due: 2, tre: 3, quattro: 4, cinque: 5, sei: 6, sette: 7, otto: 8, nove: 9, dieci: 10 };
const WEEKDAYS: [RegExp, number][] = [
	[/^lun/, 0],
	[/^mar/, 1],
	[/^mer/, 2],
	[/^gio/, 3],
	[/^ven/, 4],
	[/^sab/, 5],
	[/^dom/, 6]
];
const MONTHS = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];

const MONTH_WORD = '(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre|gen|feb|mar|apr|mag|giu|lug|ago|sett?|ott|nov|dic)';
const WEEKDAY_WORD = '(lunedi|martedi|mercoledi|giovedi|venerdi|sabato|domenica|lun|mar|mer|gio|ven|sab|dom)';
/** The little words that lead to a date and go with it: "per giovedì", "entro il 12". */
const LEAD = '(?:(?:per|entro|da|di|a|il|la|lo|al|alla|prossim[oa]|questo|questa)\\s+)*';

/** The next time a day of the month comes, from today: a date written without a year is this year's, or next year's once passed. */
function dated(today: Day, month: number, date: number, year?: number): Day | null {
	const pad = (n: number) => String(n).padStart(2, '0');
	if (year !== undefined) {
		const full = year < 100 ? 2000 + year : year;
		const day = `${full}-${pad(month)}-${pad(date)}`;
		return isDay(day) ? day : null;
	}
	const y = Number(today.slice(0, 4));
	const same = `${y}-${pad(month)}-${pad(date)}`;
	if (!isDay(same)) return isDay(`${y + 1}-${pad(month)}-${pad(date)}`) ? `${y + 1}-${pad(month)}-${pad(date)}` : null;
	// Up to two months back it is a day that has just been: a test to write down after the fact.
	return daysBetween(today, same) >= -60 ? same : `${y + 1}-${pad(month)}-${pad(date)}`;
}

interface Found {
	day: Day;
	start: number;
	end: number;
}

/** Every way of writing a day, tried in order; the first that matches wins. A dash is never a date: "es 3-7" are exercises. */
const DATE_RULES: { re: RegExp; day: (m: RegExpExecArray, today: Day) => Day | null }[] = [
	{ re: new RegExp(`\\b${LEAD}(\\d{1,2})\\s*[/.]\\s*(\\d{1,2})(?:\\s*[/.]\\s*(\\d{2,4}))?\\b`), day: (m, t) => dated(t, Number(m[2]), Number(m[1]), m[3] ? Number(m[3]) : undefined) },
	{ re: new RegExp(`\\b${LEAD}(\\d{1,2})\\s+${MONTH_WORD}\\b(?:\\s+(\\d{4}))?`), day: (m, t) => dated(t, MONTHS.indexOf(m[2].slice(0, 3)) + 1, Number(m[1]), m[3] ? Number(m[3]) : undefined) },
	{ re: new RegExp(`\\b${LEAD}dopodomani\\b`), day: (_, t) => addDays(t, 2) },
	{ re: new RegExp(`\\b${LEAD}domani\\b`), day: (_, t) => addDays(t, 1) },
	{ re: new RegExp(`\\b${LEAD}(oggi|stasera|stamattina)\\b`), day: (_, t) => t },
	{
		re: /\b(?:tra|fra)\s+(\d{1,2}|un|uno|una|due|tre|quattro|cinque|sei|sette|otto|nove|dieci)\s+(giorni|giorno|settimane|settimana)\b/,
		day: (m, t) => addDays(t, (Number(m[1]) || NUMBERS[m[1]]) * (m[2].startsWith('settiman') ? 7 : 1))
	},
	{ re: new RegExp(`\\b${LEAD}settimana\\s+prossima\\b|\\b${LEAD}prossima\\s+settimana\\b`), day: (_, t) => addDays(weekStart(t), 7) },
	{
		re: new RegExp(`\\b${LEAD}${WEEKDAY_WORD}\\b(?:\\s+prossim[oa])?`),
		day: (m, t) => {
			const target = WEEKDAYS.find(([re]) => re.test(m[1]))![1];
			// The next one after today: on a Thursday, "giovedì" is a week away.
			return addDays(t, ((target - weekday(t) + 6) % 7) + 1);
		}
	},
	// "il 12" alone: the next 12th. Without the article a number is a page or an exercise.
	{
		re: /\b(?:per\s+|entro\s+)?(?:il|l')\s*(\d{1,2})\b(?!\s*[/.-]\d)/,
		day: (m, t) => {
			const date = Number(m[1]);
			if (date < 1 || date > 31) return null;
			const month = Number(t.slice(5, 7));
			const here = dated(t, month, date, Number(t.slice(0, 4)));
			if (here && daysBetween(t, here) >= 0) return here;
			const next = month === 12 ? { m: 1, y: Number(t.slice(0, 4)) + 1 } : { m: month + 1, y: Number(t.slice(0, 4)) };
			return dated(t, next.m, date, next.y);
		}
	}
];

function findDay(folded: string, today: Day): Found | null {
	for (const rule of DATE_RULES) {
		const m = rule.re.exec(folded);
		if (!m) continue;
		const day = rule.day(m, today);
		if (day) return { day, start: m.index, end: m.index + m[0].length };
	}
	return null;
}

const KIND_RULES: [EntryKind, RegExp][] = [
	['verifica', /\b(verific[ahe]|compit[oi] in classe|test|prova|prove|simulazione|esame|scritto)\b/],
	['interrogazione', /\b(interrogazion[ei]|interrogat[oaie]|interro|orale)\b/],
	['compito', /\b(compit[oi]|eserciz[io]|es|pag|pagin[ae]|pp|studiare|studia|leggere|ripassare|tema|relazione|ricerca|traduzione|versione|riassunto|problemi)\b/]
];

/** Aliases longest first, so "scienze motorie" is found before "scienze" and "ed fisica" before "fisica". */
const ALIASES = DIARY_SUBJECTS.flatMap((s) => s.aliases.map((a) => ({ alias: fold(a), key: s.key }))).sort((a, b) => b.alias.length - a.alias.length);

function findSubject(folded: string): string | null {
	for (const { alias, key } of ALIASES) {
		const re = new RegExp(`(^|[^a-z])${alias.replace(/[.*+?^${}()|[\]\\']/g, '\\$&')}($|[^a-z])`);
		if (re.test(folded)) return key;
	}
	return null;
}

/**
 * Reads one line of the diary. `today` is the day in Rome, `fallback` the page it is written on, where the entry
 * goes when no day is written. The day's words are taken out of the text; kind and subject words stay, because the
 * text is the student's own writing.
 */
export function parseLine(line: string, today: Day, fallback: Day = today): ParsedLine {
	const clean = line.replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT);
	const folded = fold(clean);
	const found = findDay(folded, today);
	const subject = findSubject(folded);
	const kind = KIND_RULES.find(([, re]) => re.test(folded))?.[0] ?? (subject ? 'compito' : 'promemoria');
	let text = clean;
	if (found) {
		text = `${clean.slice(0, found.start)} ${clean.slice(found.end)}`
			.replace(/\s+/g, ' ')
			.replace(/^[\s,.:;–-]+|[\s,.:;–-]+$/g, '')
			.trim();
		// A dangling "per" or "entro" left where the date was.
		text = text.replace(/\s+(per|entro)$/i, '').trim();
	}
	return { kind, subject, day: found?.day ?? fallback, dayFound: !!found, text: text || clean };
}

/** An entry's fields as the API receives them, checked; a string is the reason it was refused. */
export function parseEntryInput(body: Record<string, unknown>, partial = false): Partial<Pick<DiaryEntry, 'day' | 'kind' | 'subject' | 'text' | 'topic' | 'done' | 'hidden'>> | string {
	const out: Partial<Pick<DiaryEntry, 'day' | 'kind' | 'subject' | 'text' | 'topic' | 'done' | 'hidden'>> = {};
	if (body.day !== undefined || !partial) {
		if (!isDay(body.day)) return 'Giorno non valido.';
		out.day = body.day;
	}
	if (body.kind !== undefined || !partial) {
		if (!ENTRY_KINDS.some((k) => k.value === body.kind)) return 'Tipo non valido.';
		out.kind = body.kind as EntryKind;
	}
	if (body.subject !== undefined) {
		if (body.subject !== null && !(typeof body.subject === 'string' && SUBJECT_BY_KEY.has(body.subject))) return 'Materia non valida.';
		out.subject = body.subject as string | null;
	}
	if (body.text !== undefined || !partial) {
		const text = typeof body.text === 'string' ? body.text.replace(/\s+/g, ' ').trim() : '';
		if (!text) return 'Scrivi qualcosa.';
		if (text.length > MAX_TEXT) return `Al massimo ${MAX_TEXT} caratteri.`;
		out.text = text;
	}
	if (body.topic !== undefined) {
		if (body.topic !== null && !(typeof body.topic === 'string' && /^[a-z0-9_-]+(\/[a-z0-9_-]+){0,5}$/.test(body.topic) && body.topic.length <= 200)) return 'Argomento non valido.';
		out.topic = body.topic as string | null;
	}
	for (const flag of ['done', 'hidden'] as const) {
		if (body[flag] === undefined) continue;
		if (typeof body[flag] !== 'boolean') return 'Valore non valido.';
		out[flag] = body[flag];
	}
	return out;
}
