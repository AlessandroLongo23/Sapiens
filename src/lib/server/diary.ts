import 'server-only';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { romeDate } from '@/lib/stripe/config';
import { Features } from '@/lib/stripe/config';
import { hasFeature } from '@/lib/auth/entitlements';
import { addDays, daysBetween, weekOf, type Day } from '@/lib/diary/dates';
import { isTest, type DiaryEntry } from '@/lib/diary/entries';
import { DIARY_BOUNDS, EMPTY_PAGE, type DiaryPage } from '@/lib/diary/page';
import type { Topic } from '@/lib/diary/topics';
import { parseStickers } from '@/lib/zaino/stickers';
import { dayLog, lessonProgress, studiedDays, todayView, type DayLog, type TodayView } from '@/lib/server/exercises';
import { lessonIndex } from '@/lib/server/lessons';

/** An error with the status to answer with, turned into a response by `guarded`. */
export class DiaryError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
	}
}

const ENTRY_COLUMNS = 'id, day, kind, subject, text, topic, done, hidden, source';

/** How far ahead the page looks for tests: the bookmarks and the review before a test. */
export const LOOKAHEAD_DAYS = 45;
/** A test this close is reviewed for on the page of the day. */
export const REVIEW_DAYS = 7;
/** On a day this close before a test, the page shows the review planned for it. */
export const PLANNED_DAYS = 3;

/** The chapters and lessons with exercises, which an entry can be about: the ones a review can be suggested for. */
export async function diaryTopics(): Promise<Topic[]> {
	const index = await lessonIndex();
	const chapters = new Map<string, Topic>();
	const lessons: Topic[] = [];
	for (const info of index.values()) {
		if (!chapters.has(info.chapter)) chapters.set(info.chapter, { path: info.chapter, title: info.chapterTitle, kind: 'chapter' });
		lessons.push({ path: info.dbPath, title: info.title, kind: 'lesson', chapter: info.chapter });
	}
	return [...chapters.values(), ...lessons];
}

export async function entriesBetween(supabase: SupabaseClient, userId: string, from: Day, to: Day): Promise<DiaryEntry[]> {
	const { data, error } = await supabase.from('diary_entries').select(ENTRY_COLUMNS).eq('user_id', userId).gte('day', from).lte('day', to).order('day').order('created_at').limit(1000);
	if (error) throw error;
	return (data ?? []) as DiaryEntry[];
}

export async function createEntry(supabase: SupabaseClient, userId: string, input: Omit<DiaryEntry, 'id' | 'done' | 'hidden' | 'source'>): Promise<DiaryEntry> {
	const { data, error } = await supabase
		.from('diary_entries')
		.insert({ user_id: userId, ...input })
		.select(ENTRY_COLUMNS)
		.single();
	if (error) throw error;
	return data as DiaryEntry;
}

/** A teacher's entry can only be ticked or hidden: the database refuses the rest too (diary_entry_guard). */
export async function updateEntry(supabase: SupabaseClient, userId: string, id: string, patch: Partial<DiaryEntry>): Promise<DiaryEntry> {
	const { data: current, error: readError } = await supabase.from('diary_entries').select('source').eq('id', id).eq('user_id', userId).maybeSingle();
	if (readError) throw readError;
	if (!current) throw new DiaryError(404, 'Voce non trovata.');
	if ((current as { source: string }).source === 'docente' && Object.keys(patch).some((k) => k !== 'done' && k !== 'hidden')) throw new DiaryError(403, 'Le voci del docente si possono solo spuntare o nascondere.');
	const { data, error } = await supabase.from('diary_entries').update(patch).eq('id', id).eq('user_id', userId).select(ENTRY_COLUMNS).single();
	if (error) throw error;
	return data as DiaryEntry;
}

export async function deleteEntry(supabase: SupabaseClient, userId: string, id: string): Promise<void> {
	const { data, error } = await supabase.from('diary_entries').delete().eq('id', id).eq('user_id', userId).eq('source', 'studente').select('id');
	if (error) throw error;
	if (!data?.length) throw new DiaryError(404, 'Voce non trovata.');
}

/** The student's page of a day; decoration read on its own, so a failed read gives an empty page and a log line. */
export async function getPage(supabase: SupabaseClient, userId: string, day: Day): Promise<DiaryPage> {
	const { data, error } = await supabase.from('diary_pages').select('text, stickers').eq('user_id', userId).eq('day', day).maybeSingle();
	if (error) {
		console.error('diary page read:', error);
		return EMPTY_PAGE;
	}
	if (!data) return EMPTY_PAGE;
	const stickers = parseStickers((data as { stickers: unknown }).stickers, DIARY_BOUNDS);
	return { text: (data as { text: string }).text, stickers: typeof stickers === 'string' ? [] : stickers };
}

export async function savePage(supabase: SupabaseClient, userId: string, day: Day, page: Partial<DiaryPage>): Promise<void> {
	const { error } = await supabase.from('diary_pages').upsert({ user_id: userId, day, ...page, updated_at: new Date().toISOString() }, { onConflict: 'user_id,day' });
	if (error) throw error;
}

/** A lesson to review before a test, and how far its path has got. */
export interface ReviewLesson {
	titleHtml: string;
	exercisesUrl: string;
	passed: number;
	total: number;
}

/** A test coming up, with the lessons it is about: what the page suggests reviewing. */
export interface TestReview {
	entry: DiaryEntry;
	topicTitleHtml: string;
	topicUrl: string;
	lessons: ReviewLesson[];
}

/** Everything the diary shows for a day. */
export interface DiaryView {
	today: Day;
	day: Day;
	/** Entries from the Monday of the day's week, or today if earlier, to LOOKAHEAD_DAYS after the later of the two. */
	entries: DiaryEntry[];
	page: DiaryPage;
	/** Days of the week shown that counted for the streak. */
	studied: Day[];
	/** What the student did, for today and the days before. */
	log: DayLog | null;
	/** Today's practice, streak and mistakes: on today's page only. */
	now: TodayView | null;
	/** Tests with a topic, from the day to REVIEW_DAYS after it (today), or the next PLANNED_DAYS (a day to come). */
	reviews: TestReview[];
	topics: Topic[];
}

/** The review for tests about the material: each test's lessons with the student's progress on them. */
async function reviewsFor(userId: string, tests: DiaryEntry[]): Promise<TestReview[]> {
	if (tests.length === 0) return [];
	const [index, progress] = await Promise.all([lessonIndex(), lessonProgress(userId)]);
	const out: TestReview[] = [];
	for (const entry of tests) {
		const lessons = [...index.values()].filter((l) => l.dbPath === entry.topic || l.chapter === entry.topic);
		if (lessons.length === 0) continue;
		const own = lessons.length === 1 && lessons[0].dbPath === entry.topic;
		out.push({
			entry,
			topicTitleHtml: own ? lessons[0].titleHtml : lessons[0].chapterTitleHtml,
			topicUrl: own ? lessons[0].url : lessons[0].chapterUrl,
			lessons: lessons.map((l) => ({ titleHtml: l.titleHtml, exercisesUrl: l.exercisesUrl, passed: progress[l.dbPath]?.passed ?? 0, total: progress[l.dbPath]?.total ?? 0 }))
		});
	}
	return out;
}

/** The diary on a day, in one round of parallel queries. */
export async function diaryView(supabase: SupabaseClient, user: User, day: Day): Promise<DiaryView> {
	const today = romeDate();
	const week = weekOf(day);
	const from = week[0] < today ? week[0] : today;
	const to = addDays(day > today ? day : today, LOOKAHEAD_DAYS);
	const past = daysBetween(day, today) >= 0;
	const [entries, page, studied, log, now, topics] = await Promise.all([
		entriesBetween(supabase, user.id, from, to),
		getPage(supabase, user.id, day),
		studiedDays(user.id, week[0], week[6]),
		past ? dayLog(user.id, day) : Promise.resolve(null),
		day === today ? todayView(user.id, !hasFeature(user, Features.EXERCISES)) : Promise.resolve(null),
		diaryTopics()
	]);
	const span = day === today ? REVIEW_DAYS : PLANNED_DAYS;
	const tests = entries.filter((e) => isTest(e.kind) && e.topic && !e.done && !e.hidden && daysBetween(day, e.day) >= (day === today ? 0 : 1) && daysBetween(day, e.day) <= span);
	return { today, day, entries, page, studied, log, now, reviews: day < today ? [] : await reviewsFor(user.id, tests), topics };
}

/** The calendar of a month: its entries and the days studied. */
export async function monthView(supabase: SupabaseClient, userId: string, from: Day, to: Day): Promise<{ entries: DiaryEntry[]; studied: Day[] }> {
	const [entries, studied] = await Promise.all([entriesBetween(supabase, userId, from, to), studiedDays(userId, from, to)]);
	return { entries, studied };
}
