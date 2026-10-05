import 'server-only';
import { randomBytes, randomUUID } from 'node:crypto';
import { cache } from 'react';
import { revalidatePath } from 'next/cache';
import { TUTORING_ROOT } from '@/lib/config/site';
import { configs } from '@/lib/exercises/config';
import { levelName } from '@/lib/exercises/level-names';
import { SUBJECT_BY_KEY } from '@/lib/diary/subjects';
import { romeDate } from '@/lib/stripe/config';
import { TUTOR_SUBJECTS, type TutorLevel, type TutorMode } from '@/lib/tutoring/config';
import {
	MAX_MESSAGE,
	MAX_NOTES,
	isHeld,
	romeInstant,
	romeParts,
	weekdayOf,
	weeklyUntilMonthEnd,
	type AgendaAssignment,
	type AgendaLesson,
	type AgendaMessage,
	type AssignableLesson,
	type AssignmentInput,
	type LessonInput,
	type LessonStatus,
	type LinkInput,
	type LinkStatus,
	type Side,
	type Slot,
	type StudentLink,
	type TutorLink,
	type TutorReview
} from '@/lib/tutoring/agenda';
import { lessonProgress, todayView, type LessonProgress } from './exercises';
import { lessonIndex } from './lessons';
import { TutoringError, adminClient, type RequestRow, type TutorRow } from './tutoring-admin';
import { invalidateTutorCache } from './tutoring';

/**
 * The tutor's agenda, with the service role: the tables are closed to the browser (see the migration), so every
 * function takes who is asking, the tutor's id or the student's user id, and checks that the row is theirs.
 * A row of someone else answers 404, never 403: its existence is not the asker's business.
 */

export const SUBJECT_IDS: ReadonlySet<string> = new Set(TUTOR_SUBJECTS.map((s) => s.id));

function fail(context: string, error: { message: string }): never {
	console.error(`${context}:`, error.message);
	throw new TutoringError(503, 'Servizio non disponibile. Riprova più tardi.');
}

const notFound = (what: string) => new TutoringError(404, `${what} non trovato.`);

/** The moment a page of the agenda is built: today in Rome and the instant, read once so every card agrees. */
export function agendaClock(): { today: string; now: number } {
	return { today: romeDate(), now: Date.now() };
}

/* ------------------------------------------------------------------ links */

interface LinkRow {
	id: string;
	tutor_id: string;
	student_id: string | null;
	name: string;
	subject: string | null;
	level: TutorLevel | null;
	notes: string;
	status: LinkStatus;
	origin: 'invite' | 'request';
	invite_code: string | null;
	progress_shared: boolean;
	created_at: string;
}

const LINK_COLUMNS = 'id,tutor_id,student_id,name,subject,level,notes,status,origin,invite_code,progress_shared,created_at';

const toTutorLink = (row: LinkRow): TutorLink => ({
	id: row.id,
	name: row.name,
	subject: row.subject,
	level: row.level,
	status: row.status,
	origin: row.origin,
	joined: !!row.student_id,
	progressShared: row.progress_shared,
	inviteCode: row.status === 'invited' ? row.invite_code : null,
	notes: row.notes,
	createdAt: row.created_at
});

async function linkRow(id: string): Promise<LinkRow | null> {
	const { data, error } = await adminClient().from('tutor_students').select(LINK_COLUMNS).eq('id', id).maybeSingle();
	if (error) fail('link lookup failed', error);
	return data as LinkRow | null;
}

/** The link, if it belongs to this tutor. */
async function tutorLinkRow(tutorId: string, id: string): Promise<LinkRow> {
	const row = await linkRow(id);
	if (!row || row.tutor_id !== tutorId) throw notFound('Studente');
	return row;
}

/** The link, if this user is its student. */
async function studentLinkRow(userId: string, id: string): Promise<LinkRow> {
	const row = await linkRow(id);
	if (!row || row.student_id !== userId) throw notFound('Tutor');
	return row;
}

export async function getTutorLink(tutorId: string, id: string): Promise<TutorLink> {
	return toTutorLink(await tutorLinkRow(tutorId, id));
}

/** A student in the tutor's list, with what is waiting on them. */
export interface StudentCard extends TutorLink {
	nextLesson: string | null;
	openAssignments: number;
	unread: number;
	lessonsHeld: number;
	hoursHeld: number;
}

export async function listTutorStudents(tutorId: string): Promise<StudentCard[]> {
	const db = adminClient();
	const { data, error } = await db.from('tutor_students').select(LINK_COLUMNS).eq('tutor_id', tutorId).order('created_at', { ascending: false });
	if (error) fail('students query failed', error);
	const rows = (data ?? []) as LinkRow[];
	if (rows.length === 0) return [];
	const ids = rows.map((r) => r.id);
	const [lessons, assignments, messages] = await Promise.all([
		db.from('tutor_lessons').select('tutor_student_id,starts_at,duration_min,status').in('tutor_student_id', ids).eq('status', 'confirmed'),
		db.from('tutor_assignments').select('tutor_student_id').in('tutor_student_id', ids).eq('status', 'open').gte('due', romeDate()),
		db.from('tutor_messages').select('tutor_student_id').in('tutor_student_id', ids).eq('sender', 'student').is('read_at', null)
	]);
	for (const r of [lessons, assignments, messages]) if (r.error) fail('students summary failed', r.error);
	const now = Date.now();
	const count = (list: { tutor_student_id: string }[] | null, id: string) => (list ?? []).filter((x) => x.tutor_student_id === id).length;
	return rows.map((row) => {
		const own = ((lessons.data ?? []) as { tutor_student_id: string; starts_at: string; duration_min: number; status: LessonStatus }[]).filter((l) => l.tutor_student_id === row.id);
		const upcoming = own.filter((l) => Date.parse(l.starts_at) > now).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
		return {
			...toTutorLink(row),
			nextLesson: upcoming[0]?.starts_at ?? null,
			openAssignments: count(assignments.data, row.id),
			unread: count(messages.data, row.id),
			lessonsHeld: own.filter((l) => isHeld({ startsAt: l.starts_at, durationMin: l.duration_min, status: l.status }, now)).length,
			hoursHeld: own.filter((l) => isHeld({ startsAt: l.starts_at, durationMin: l.duration_min, status: l.status }, now)).reduce((sum, l) => sum + l.duration_min / 60, 0)
		};
	});
}

const inviteCode = () => randomBytes(12).toString('hex');

/** The tutor adds a student they already follow: a link waiting for the student to accept the invite. */
export async function createInvite(tutorId: string, input: LinkInput): Promise<TutorLink> {
	const { data, error } = await adminClient()
		.from('tutor_students')
		.insert({ tutor_id: tutorId, name: input.name, subject: input.subject, level: input.level, status: 'invited', origin: 'invite', invite_code: inviteCode() })
		.select(LINK_COLUMNS)
		.single();
	if (error) fail('invite insert failed', error);
	return toTutorLink(data as LinkRow);
}

export async function updateTutorLink(tutorId: string, id: string, patch: Partial<LinkInput> & { notes?: string }): Promise<TutorLink> {
	await tutorLinkRow(tutorId, id);
	const update: Record<string, unknown> = {};
	if (patch.name !== undefined) update.name = patch.name;
	if (patch.subject !== undefined) update.subject = patch.subject;
	if (patch.level !== undefined) update.level = patch.level;
	if (patch.notes !== undefined) update.notes = patch.notes.slice(0, MAX_NOTES);
	const { data, error } = await adminClient().from('tutor_students').update(update).eq('id', id).select(LINK_COLUMNS).single();
	if (error) fail('link update failed', error);
	return toTutorLink(data as LinkRow);
}

/** Either side closes the link. Lessons to come are cancelled and open assignments withdrawn, with their diary entries. */
export async function endLink(by: { tutorId: string } | { userId: string }, id: string): Promise<void> {
	const row = 'tutorId' in by ? await tutorLinkRow(by.tutorId, id) : await studentLinkRow(by.userId, id);
	if (row.status === 'ended') return;
	const db = adminClient();
	const now = new Date().toISOString();
	const [lessons, assignments] = await Promise.all([
		db.from('tutor_lessons').update({ status: 'cancelled' }).eq('tutor_student_id', id).in('status', ['confirmed', 'proposed']).gt('starts_at', now).select('diary_entry_id'),
		db.from('tutor_assignments').update({ status: 'cancelled' }).eq('tutor_student_id', id).eq('status', 'open').select('diary_entry_id')
	]);
	if (lessons.error) fail('link lessons cancel failed', lessons.error);
	if (assignments.error) fail('link assignments cancel failed', assignments.error);
	await dropDiaryEntries([...(lessons.data ?? []), ...(assignments.data ?? [])].map((r) => (r as { diary_entry_id: string | null }).diary_entry_id));
	const { error } = await db.from('tutor_students').update({ status: 'ended', ended_at: now, invite_code: null, progress_shared: false }).eq('id', id);
	if (error) fail('link end failed', error);
}

/** What the invite page shows before the student accepts. */
export interface InviteView {
	tutor: { firstName: string; lastInitial: string; headline: string; slug: string; published: boolean };
	subject: string | null;
	/** The invite was sent by the visitor's own tutor profile. */
	own: boolean;
}

async function tutorFace(tutorId: string): Promise<{ row: TutorRow; face: InviteView['tutor'] }> {
	const { data, error } = await adminClient().from('tutors').select('*').eq('id', tutorId).maybeSingle();
	if (error) fail('tutor lookup failed', error);
	if (!data) throw notFound('Tutor');
	const row = data as TutorRow;
	return { row, face: { firstName: row.first_name, lastInitial: row.last_name.charAt(0), headline: row.headline, slug: row.slug, published: row.status === 'published' } };
}

export async function inviteByCode(code: string, userId: string | null): Promise<InviteView | null> {
	if (!/^[a-z0-9]{12,40}$/.test(code)) return null;
	const { data, error } = await adminClient().from('tutor_students').select(LINK_COLUMNS).eq('invite_code', code).eq('status', 'invited').maybeSingle();
	if (error) fail('invite lookup failed', error);
	if (!data) return null;
	const row = data as LinkRow;
	const { row: tutor, face } = await tutorFace(row.tutor_id);
	return { tutor: face, subject: row.subject, own: !!userId && tutor.user_id === userId };
}

/** The student accepts: the link becomes theirs. The code works once. */
export async function acceptInvite(userId: string, code: string, share: boolean): Promise<string> {
	const db = adminClient();
	const { data, error } = await db.from('tutor_students').select(LINK_COLUMNS).eq('invite_code', code).eq('status', 'invited').maybeSingle();
	if (error) fail('invite lookup failed', error);
	const row = data as LinkRow | null;
	if (!row) throw new TutoringError(404, "Questo invito non è più valido. Chiedi al tutor di mandartene un altro.");
	const { row: tutor } = await tutorFace(row.tutor_id);
	if (tutor.user_id === userId) throw new TutoringError(409, 'Questo invito è per un tuo studente: aprilo dal suo account.');
	const { data: existing, error: existingError } = await db.from('tutor_students').select('id').eq('tutor_id', row.tutor_id).eq('student_id', userId).neq('status', 'ended').maybeSingle();
	if (existingError) fail('link lookup failed', existingError);
	if (existing) throw new TutoringError(409, 'Segui già le lezioni di questo tutor.');
	const { data: updated, error: updateError } = await db
		.from('tutor_students')
		.update({ student_id: userId, status: 'active', joined_at: new Date().toISOString(), invite_code: null, progress_shared: share })
		.eq('id', row.id)
		.eq('status', 'invited')
		.select('id')
		.maybeSingle();
	if (updateError) fail('invite accept failed', updateError);
	if (!updated) throw new TutoringError(409, 'Questo invito è già stato usato.');
	// Lessons planned before the student joined reach their diary now.
	const { data: planned, error: plannedError } = await db.from('tutor_lessons').select('id,starts_at,mode').eq('tutor_student_id', row.id).eq('status', 'confirmed').gt('starts_at', new Date().toISOString());
	if (plannedError) console.error('planned lessons lookup failed:', plannedError.message);
	for (const lesson of (planned ?? []) as { id: string; starts_at: string; mode: TutorMode }[]) {
		const entry = await lessonDiaryEntry({ ...row, student_id: userId }, tutor.first_name, lesson.starts_at, lesson.mode);
		if (entry) await db.from('tutor_lessons').update({ diary_entry_id: entry }).eq('id', lesson.id);
	}
	return row.id;
}

/** A request of the marketplace was accepted: the student joins the tutor's list, without sharing anything yet. */
export async function linkFromRequest(tutorId: string, request: RequestRow): Promise<void> {
	const db = adminClient();
	const { data, error } = await db.from('tutor_students').select('id').eq('tutor_id', tutorId).eq('student_id', request.student_id).neq('status', 'ended').maybeSingle();
	if (error) return console.error('link from request lookup failed:', error.message);
	if (data) return;
	const { error: insertError } = await db.from('tutor_students').insert({
		tutor_id: tutorId,
		student_id: request.student_id,
		name: request.contact_name.slice(0, 80) || 'Studente',
		subject: SUBJECT_IDS.has(request.subject) ? request.subject : null,
		level: request.level,
		status: 'active',
		origin: 'request',
		request_id: request.id,
		joined_at: new Date().toISOString()
	});
	// The acceptance stands even if the link could not be made: the tutor can still invite the student.
	if (insertError) console.error('link from request failed:', insertError.message);
}

/** The student's tutors: the links still open. */
export async function listStudentLinks(userId: string): Promise<StudentLink[]> {
	const { data, error } = await adminClient()
		.from('tutor_students')
		.select(`${LINK_COLUMNS}, tutors ( slug, first_name, last_name, headline, status )`)
		.eq('student_id', userId)
		.eq('status', 'active')
		.order('joined_at', { ascending: true });
	if (error) fail('student links query failed', error);
	return ((data ?? []) as unknown as (LinkRow & { tutors: Record<string, string | null> | null })[]).map((row) => {
		const t = row.tutors ?? {};
		return {
			id: row.id,
			status: row.status,
			subject: row.subject,
			progressShared: row.progress_shared,
			tutor: { slug: t.slug ?? '', firstName: t.first_name ?? 'Tutor', lastInitial: (t.last_name ?? '').charAt(0), headline: t.headline ?? '', published: t.status === 'published' }
		};
	});
}

export async function setConsent(userId: string, id: string, share: boolean): Promise<void> {
	const row = await studentLinkRow(userId, id);
	if (row.status !== 'active') throw new TutoringError(409, 'Questo tutor non ti segue più.');
	const { error } = await adminClient().from('tutor_students').update({ progress_shared: share }).eq('id', id);
	if (error) fail('consent update failed', error);
}

/* ------------------------------------------------------------------ diary */

const diarySubject = (subject: string | null): string | null => (subject && SUBJECT_BY_KEY.has(subject) ? subject : null);

/** A tutor's entry in the student's diary; null when it could not be written (the action it comes from still stands). */
async function addDiaryEntry(studentId: string, entry: { day: string; kind: 'compito' | 'promemoria'; subject: string | null; text: string; topic: string | null }): Promise<string | null> {
	const { data, error } = await adminClient()
		.from('diary_entries')
		.insert({ user_id: studentId, day: entry.day, kind: entry.kind, subject: diarySubject(entry.subject), text: entry.text.slice(0, 300), topic: entry.topic, source: 'tutor' })
		.select('id')
		.single();
	if (error) {
		console.error('tutor diary entry failed:', error.message);
		return null;
	}
	return (data as { id: string }).id;
}

async function dropDiaryEntries(ids: (string | null)[]): Promise<void> {
	const own = ids.filter((id): id is string => !!id);
	if (own.length === 0) return;
	const { error } = await adminClient().from('diary_entries').delete().in('id', own).eq('source', 'tutor');
	if (error) console.error('tutor diary cleanup failed:', error.message);
}

/* ---------------------------------------------------------------- lessons */

interface LessonRow {
	id: string;
	tutor_student_id: string;
	tutor_id: string;
	starts_at: string;
	duration_min: number;
	mode: TutorMode;
	place: string;
	note: string;
	status: LessonStatus;
	proposed_by: Side;
	series_id: string | null;
	diary_entry_id: string | null;
}

const LESSON_COLUMNS = 'id,tutor_student_id,tutor_id,starts_at,duration_min,mode,place,note,status,proposed_by,series_id,diary_entry_id';

const toLesson = (row: LessonRow, withName: string): AgendaLesson => ({
	id: row.id,
	linkId: row.tutor_student_id,
	with: withName,
	startsAt: row.starts_at,
	durationMin: row.duration_min,
	mode: row.mode,
	place: row.place,
	note: row.note,
	status: row.status,
	proposedBy: row.proposed_by,
	seriesId: row.series_id
});

/** The reminder a confirmed lesson leaves in the student's diary. */
async function lessonDiaryEntry(link: LinkRow, tutorFirstName: string, startsAt: string, mode: TutorMode): Promise<string | null> {
	if (!link.student_id) return null;
	const { day, time } = romeParts(startsAt);
	return addDiaryEntry(link.student_id, { day, kind: 'promemoria', subject: link.subject, text: `Lezione con ${tutorFirstName} alle ${time}${mode === 'online' ? ', online' : ''}`, topic: null });
}

/** The tutor plans a lesson, or one a week until the month ends: confirmed at once. */
export async function createTutorLessons(tutor: TutorRow, linkId: string, input: LessonInput): Promise<number> {
	const link = await tutorLinkRow(tutor.id, linkId);
	if (link.status === 'ended') throw new TutoringError(409, 'Non segui più questo studente.');
	const days = input.repeat ? weeklyUntilMonthEnd(input.day) : [input.day];
	const series = days.length > 1 ? randomUUID() : null;
	const rows = [];
	for (const day of days) {
		const startsAt = romeInstant(day, input.time).toISOString();
		rows.push({
			tutor_student_id: link.id,
			tutor_id: tutor.id,
			starts_at: startsAt,
			duration_min: input.durationMin,
			mode: input.mode,
			place: input.place,
			note: input.note,
			status: 'confirmed',
			proposed_by: 'tutor',
			series_id: series,
			diary_entry_id: await lessonDiaryEntry(link, tutor.first_name, startsAt, input.mode)
		});
	}
	const { error } = await adminClient().from('tutor_lessons').insert(rows);
	if (error) {
		await dropDiaryEntries(rows.map((r) => r.diary_entry_id));
		fail('lesson insert failed', error);
	}
	return rows.length;
}

/** The student asks for a lesson: a proposal the tutor answers. */
export async function proposeLesson(userId: string, linkId: string, input: LessonInput): Promise<{ tutor: TutorRow; lesson: AgendaLesson }> {
	const link = await studentLinkRow(userId, linkId);
	if (link.status !== 'active') throw new TutoringError(409, 'Questo tutor non ti segue più.');
	const startsAt = romeInstant(input.day, input.time);
	if (startsAt.getTime() < Date.now()) throw new TutoringError(400, 'Scegli un giorno e un orario che devono ancora arrivare.');
	const db = adminClient();
	const { count, error: countError } = await db.from('tutor_lessons').select('id', { count: 'exact', head: true }).eq('tutor_student_id', link.id).eq('status', 'proposed');
	if (countError) fail('proposal count failed', countError);
	if ((count ?? 0) >= 5) throw new TutoringError(409, 'Hai già cinque proposte in attesa: aspetta la risposta del tutor.');
	const { data, error } = await db
		.from('tutor_lessons')
		.insert({ tutor_student_id: link.id, tutor_id: link.tutor_id, starts_at: startsAt.toISOString(), duration_min: input.durationMin, mode: input.mode, place: input.place, note: input.note, status: 'proposed', proposed_by: 'student' })
		.select(LESSON_COLUMNS)
		.single();
	if (error) fail('proposal insert failed', error);
	const { row: tutor } = await tutorFace(link.tutor_id);
	return { tutor, lesson: toLesson(data as LessonRow, link.name) };
}

async function lessonRow(id: string): Promise<LessonRow | null> {
	const { data, error } = await adminClient().from('tutor_lessons').select(LESSON_COLUMNS).eq('id', id).maybeSingle();
	if (error) fail('lesson lookup failed', error);
	return data as LessonRow | null;
}

/** The tutor answers a student's proposal. Returns the lesson and the student's user id, for the notification. */
export async function respondToProposal(tutor: TutorRow, lessonId: string, accept: boolean): Promise<{ lesson: AgendaLesson; studentId: string | null }> {
	const row = await lessonRow(lessonId);
	if (!row || row.tutor_id !== tutor.id) throw notFound('Lezione');
	if (row.status !== 'proposed') throw new TutoringError(409, 'Hai già risposto a questa proposta.');
	const link = await tutorLinkRow(tutor.id, row.tutor_student_id);
	const entry = accept ? await lessonDiaryEntry(link, tutor.first_name, row.starts_at, row.mode) : null;
	const { data, error } = await adminClient()
		.from('tutor_lessons')
		.update({ status: accept ? 'confirmed' : 'declined', diary_entry_id: entry })
		.eq('id', row.id)
		.eq('status', 'proposed')
		.select(LESSON_COLUMNS)
		.maybeSingle();
	if (error) fail('proposal answer failed', error);
	if (!data) {
		await dropDiaryEntries([entry]);
		throw new TutoringError(409, 'Hai già risposto a questa proposta.');
	}
	return { lesson: toLesson(data as LessonRow, link.name), studentId: link.student_id };
}

/** Either side cancels a lesson to come; with `series`, the tutor cancels the ones after it too. */
export async function cancelLesson(by: { tutorId: string } | { userId: string }, lessonId: string, series = false): Promise<void> {
	const row = await lessonRow(lessonId);
	if (!row) throw notFound('Lezione');
	if ('tutorId' in by) {
		if (row.tutor_id !== by.tutorId) throw notFound('Lezione');
	} else {
		await studentLinkRow(by.userId, row.tutor_student_id);
	}
	if (row.status !== 'confirmed' && row.status !== 'proposed') throw new TutoringError(409, 'Questa lezione non è più in programma.');
	let query = adminClient().from('tutor_lessons').update({ status: 'cancelled', diary_entry_id: null }).in('status', ['confirmed', 'proposed']);
	query = series && row.series_id && 'tutorId' in by ? query.eq('series_id', row.series_id).gte('starts_at', row.starts_at) : query.eq('id', row.id);
	// The entries to remove are read first: the update clears the reference.
	const { data: before, error: readError } =
		series && row.series_id && 'tutorId' in by
			? await adminClient().from('tutor_lessons').select('diary_entry_id').eq('series_id', row.series_id).gte('starts_at', row.starts_at).in('status', ['confirmed', 'proposed'])
			: { data: [{ diary_entry_id: row.diary_entry_id }], error: null };
	if (readError) fail('lesson series lookup failed', readError);
	const { error } = await query;
	if (error) fail('lesson cancel failed', error);
	await dropDiaryEntries((before ?? []).map((r) => (r as { diary_entry_id: string | null }).diary_entry_id));
}

/** The tutor's lessons between two instants, with the student's name. Declined and cancelled ones are left out. */
export async function tutorLessonsBetween(tutorId: string, from: string, to: string): Promise<AgendaLesson[]> {
	const { data, error } = await adminClient()
		.from('tutor_lessons')
		.select(`${LESSON_COLUMNS}, tutor_students ( name )`)
		.eq('tutor_id', tutorId)
		.gte('starts_at', from)
		.lt('starts_at', to)
		.in('status', ['confirmed', 'proposed'])
		.order('starts_at');
	if (error) fail('lessons query failed', error);
	return ((data ?? []) as unknown as (LessonRow & { tutor_students: { name: string } | null })[]).map((r) => toLesson(r, r.tutor_students?.name ?? 'Studente'));
}

/** The proposals a tutor has to answer, soonest first. */
export async function tutorProposals(tutorId: string): Promise<AgendaLesson[]> {
	const { data, error } = await adminClient()
		.from('tutor_lessons')
		.select(`${LESSON_COLUMNS}, tutor_students ( name )`)
		.eq('tutor_id', tutorId)
		.eq('status', 'proposed')
		.gte('starts_at', new Date().toISOString())
		.order('starts_at');
	if (error) fail('proposals query failed', error);
	return ((data ?? []) as unknown as (LessonRow & { tutor_students: { name: string } | null })[]).map((r) => toLesson(r, r.tutor_students?.name ?? 'Studente'));
}

/** Every lesson of a link, newest first: what is planned, what was held, what was turned down. */
async function linkLessons(linkId: string, withName: string): Promise<AgendaLesson[]> {
	const { data, error } = await adminClient().from('tutor_lessons').select(LESSON_COLUMNS).eq('tutor_student_id', linkId).order('starts_at', { ascending: false }).limit(200);
	if (error) fail('link lessons query failed', error);
	return ((data ?? []) as LessonRow[]).map((r) => toLesson(r, withName));
}

/* ------------------------------------------------------------ assignments */

interface AssignmentRow {
	id: string;
	tutor_student_id: string;
	tutor_id: string;
	student_id: string;
	lesson_path: string;
	level: number | null;
	due: string;
	note: string;
	status: 'open' | 'cancelled';
	diary_entry_id: string | null;
	created_at: string;
}

const ASSIGNMENT_COLUMNS = 'id,tutor_student_id,tutor_id,student_id,lesson_path,level,due,note,status,diary_entry_id,created_at';

/** The subject of a lesson as the diary and the tutors name it: the third step of its page's address. */
const subjectOfUrl = (url: string): string => url.split('/')[3] ?? '';

/** Every lesson with exercises, for the tutor's picker. */
export async function assignableLessons(): Promise<AssignableLesson[]> {
	const index = await lessonIndex();
	return [...index.values()].map((info) => {
		const config = configs[info.dbPath];
		return {
			path: info.dbPath,
			title: info.title,
			chapter: info.chapterTitle,
			subject: subjectOfUrl(info.url),
			levels: config.levels.map((level) => ({ level, name: levelName(config.generator, level) }))
		};
	});
}

/** Done: the level asked is passed, or every level of the path when none was asked. */
function assignmentDone(row: AssignmentRow, progress: Record<string, LessonProgress>): boolean {
	const p = progress[row.lesson_path];
	if (!p) return false;
	return row.level === null ? p.passed >= p.total : p.levels.includes(row.level);
}

async function toAssignments(rows: AssignmentRow[], progress: Record<string, LessonProgress> | null): Promise<AgendaAssignment[]> {
	const index = await lessonIndex();
	return rows.map((row) => {
		const info = index.get(row.lesson_path);
		const config = configs[row.lesson_path];
		return {
			id: row.id,
			linkId: row.tutor_student_id,
			lessonPath: row.lesson_path,
			title: info?.title ?? 'Lezione non più disponibile',
			url: info?.exercisesUrl ?? '',
			level: row.level,
			levelName: row.level !== null && config ? levelName(config.generator, row.level) : null,
			due: row.due,
			note: row.note,
			done: progress ? assignmentDone(row, progress) : null,
			createdAt: row.created_at
		};
	});
}

export async function createAssignment(tutor: TutorRow, userId: string, linkId: string, input: AssignmentInput): Promise<void> {
	const link = await tutorLinkRow(tutor.id, linkId);
	if (link.status !== 'active' || !link.student_id) throw new TutoringError(409, "Lo studente non ha ancora accettato l'invito: i compiti si assegnano dopo.");
	const info = (await lessonIndex()).get(input.lessonPath);
	const config = configs[input.lessonPath];
	if (!info || !config) throw new TutoringError(400, 'Questa lezione non ha esercizi.');
	if (input.level !== null && !config.levels.includes(input.level)) throw new TutoringError(400, 'Questa lezione non ha quel livello.');
	if (input.due < romeDate()) throw new TutoringError(400, 'La scadenza è già passata.');
	const what = input.level === null ? `Esercizi: ${info.title}` : `Esercizi: ${info.title}, livello ${input.level}`;
	const entry = await addDiaryEntry(link.student_id, { day: input.due, kind: 'compito', subject: subjectOfUrl(info.url), text: `${what} (da ${tutor.first_name})`, topic: input.lessonPath });
	const { error } = await adminClient().from('tutor_assignments').insert({
		tutor_student_id: link.id,
		tutor_id: tutor.id,
		student_id: link.student_id,
		assigned_by: userId,
		lesson_path: input.lessonPath,
		level: input.level,
		due: input.due,
		note: input.note,
		diary_entry_id: entry
	});
	if (error) {
		await dropDiaryEntries([entry]);
		fail('assignment insert failed', error);
	}
}

export async function cancelAssignment(tutorId: string, id: string): Promise<void> {
	const { data, error } = await adminClient().from('tutor_assignments').update({ status: 'cancelled' }).eq('id', id).eq('tutor_id', tutorId).eq('status', 'open').select('diary_entry_id');
	if (error) fail('assignment cancel failed', error);
	if (!data || data.length === 0) throw notFound('Compito');
	await dropDiaryEntries(data.map((r) => (r as { diary_entry_id: string | null }).diary_entry_id));
}

async function linkAssignments(linkId: string): Promise<AssignmentRow[]> {
	const { data, error } = await adminClient().from('tutor_assignments').select(ASSIGNMENT_COLUMNS).eq('tutor_student_id', linkId).eq('status', 'open').order('due', { ascending: false }).limit(200);
	if (error) fail('assignments query failed', error);
	return (data ?? []) as AssignmentRow[];
}

/* --------------------------------------------------------------- messages */

const toMessage = (row: { id: string; sender: Side; body: string; created_at: string }): AgendaMessage => ({ id: row.id, sender: row.sender, body: row.body, createdAt: row.created_at });

/** The conversation of a link, oldest first. With a `reader` (the conversation is on screen) what the other side wrote is marked read. */
async function linkMessages(linkId: string, reader: Side | null): Promise<AgendaMessage[]> {
	const db = adminClient();
	const { data, error } = await db.from('tutor_messages').select('id,sender,body,created_at').eq('tutor_student_id', linkId).order('created_at', { ascending: false }).limit(200);
	if (error) fail('messages query failed', error);
	if (reader) {
		const { error: readError } = await db.from('tutor_messages').update({ read_at: new Date().toISOString() }).eq('tutor_student_id', linkId).neq('sender', reader).is('read_at', null);
		if (readError) console.error('messages read mark failed:', readError.message);
	}
	return ((data ?? []) as { id: string; sender: Side; body: string; created_at: string }[]).reverse().map(toMessage);
}

/** The link a message belongs to, checked against who is asking, and which side they are. */
async function messageSide(by: { tutorId: string } | { userId: string }, linkId: string): Promise<{ link: LinkRow; side: Side }> {
	if ('tutorId' in by) return { link: await tutorLinkRow(by.tutorId, linkId), side: 'tutor' };
	return { link: await studentLinkRow(by.userId, linkId), side: 'student' };
}

export async function readMessages(by: { tutorId: string } | { userId: string }, linkId: string): Promise<AgendaMessage[]> {
	const { link, side } = await messageSide(by, linkId);
	return linkMessages(link.id, side);
}

export async function sendMessage(by: { tutorId: string } | { userId: string }, linkId: string, body: unknown): Promise<AgendaMessage> {
	const { link, side } = await messageSide(by, linkId);
	if (link.status !== 'active' || !link.student_id) throw new TutoringError(409, side === 'tutor' ? "Potrai scrivere allo studente quando avrà accettato l'invito." : 'Questo tutor non ti segue più.');
	const text = typeof body === 'string' ? body.trim() : '';
	if (!text) throw new TutoringError(400, 'Scrivi un messaggio.');
	if (text.length > MAX_MESSAGE) throw new TutoringError(400, `Al massimo ${MAX_MESSAGE} caratteri.`);
	const { data, error } = await adminClient().from('tutor_messages').insert({ tutor_student_id: link.id, sender: side, body: text }).select('id,sender,body,created_at').single();
	if (error) fail('message insert failed', error);
	return toMessage(data as { id: string; sender: Side; body: string; created_at: string });
}

/* ----------------------------------------------------------- availability */

export async function getAvailability(tutorId: string): Promise<Slot[]> {
	const { data, error } = await adminClient().from('tutor_availability').select('weekday,start_time,end_time').eq('tutor_id', tutorId).order('weekday').order('start_time');
	if (error) fail('availability query failed', error);
	return ((data ?? []) as { weekday: number; start_time: string; end_time: string }[]).map((r) => ({ weekday: r.weekday, start: r.start_time.slice(0, 5), end: r.end_time.slice(0, 5) }));
}

/** The profile page shows the hours and the reviews: it is rebuilt when either changes. */
function refreshProfile(slug: string) {
	invalidateTutorCache();
	revalidatePath(`${TUTORING_ROOT}/${slug}`);
}

/** Replaces the tutor's week. */
export async function setAvailability(tutor: TutorRow, slots: Slot[]): Promise<void> {
	const db = adminClient();
	const { error: deleteError } = await db.from('tutor_availability').delete().eq('tutor_id', tutor.id);
	if (deleteError) fail('availability clear failed', deleteError);
	if (slots.length > 0) {
		const { error } = await db.from('tutor_availability').insert(slots.map((s) => ({ tutor_id: tutor.id, weekday: s.weekday, start_time: s.start, end_time: s.end })));
		if (error) fail('availability insert failed', error);
	}
	refreshProfile(tutor.slug);
}

/* ---------------------------------------------------------------- reviews */

export async function tutorReviews(tutorId: string): Promise<TutorReview[]> {
	const { data, error } = await adminClient().from('tutor_reviews').select('rating,body,created_at').eq('tutor_id', tutorId).eq('hidden', false).order('created_at', { ascending: false }).limit(50);
	if (error) fail('reviews query failed', error);
	return ((data ?? []) as { rating: number; body: string; created_at: string }[]).map((r) => ({ rating: r.rating, body: r.body, createdAt: r.created_at }));
}

/** The student's review of the tutor of a link: one per link, rewritten when sent again. */
export async function saveReview(userId: string, linkId: string, review: { rating: number; body: string }): Promise<void> {
	const link = await studentLinkRow(userId, linkId);
	const { error } = await adminClient()
		.from('tutor_reviews')
		.upsert({ tutor_student_id: link.id, tutor_id: link.tutor_id, rating: review.rating, body: review.body, updated_at: new Date().toISOString() }, { onConflict: 'tutor_student_id' });
	if (error) fail('review save failed', error);
	const { face } = await tutorFace(link.tutor_id);
	refreshProfile(face.slug);
}

async function linkReview(linkId: string): Promise<{ rating: number; body: string } | null> {
	const { data, error } = await adminClient().from('tutor_reviews').select('rating,body').eq('tutor_student_id', linkId).maybeSingle();
	if (error) fail('review lookup failed', error);
	return data as { rating: number; body: string } | null;
}

/* --------------------------------------------------------------- progress */

/** What a tutor reads of a student who shares their exercises. */
export interface SharedProgress {
	streak: number;
	bestStreak: number;
	/** The last seven days, oldest first: whether each one counted. */
	week: { day: string; counted: boolean }[];
	daysStudied: number;
	answered: number;
	correct: number;
	openMistakes: number;
	/** Lessons started, the ones worked on most recently first. */
	lessons: { path: string; title: string; chapter: string; url: string; passed: number; total: number; lastAt: string }[];
}

async function sharedProgress(studentId: string): Promise<{ view: SharedProgress; byLesson: Record<string, LessonProgress> }> {
	const db = adminClient();
	const [today, byLesson, index, days, runs] = await Promise.all([
		todayView(studentId),
		lessonProgress(studentId),
		lessonIndex(),
		db.from('exercise_days').select('answered,correct').eq('user_id', studentId).limit(2000),
		db.from('exercise_sessions').select('lesson_path,started_at').eq('user_id', studentId).in('kind', ['level', 'jump']).order('started_at', { ascending: false }).limit(2000)
	]);
	if (days.error) fail('progress days failed', days.error);
	if (runs.error) fail('progress runs failed', runs.error);
	const lastAt = new Map<string, string>();
	for (const r of (runs.data ?? []) as { lesson_path: string; started_at: string }[]) if (!lastAt.has(r.lesson_path)) lastAt.set(r.lesson_path, r.started_at);
	const dayRows = (days.data ?? []) as { answered: number; correct: number }[];
	const totals = { answered: dayRows.reduce((n, d) => n + d.answered, 0), correct: dayRows.reduce((n, d) => n + d.correct, 0), days: dayRows.length };
	const lessons = Object.entries(byLesson)
		.flatMap(([path, p]) => {
			const info = index.get(path);
			return info ? [{ path, title: info.title, chapter: info.chapterTitle, url: info.exercisesUrl, passed: p.passed, total: p.total, lastAt: lastAt.get(path) ?? '' }] : [];
		})
		.sort((a, b) => b.lastAt.localeCompare(a.lastAt));
	return {
		view: { streak: today.streak.current, bestStreak: today.streak.best, week: today.week.map((d) => ({ day: d.day, counted: d.counted })), daysStudied: totals.days, answered: totals.answered, correct: totals.correct, openMistakes: today.openMistakes, lessons },
		byLesson
	};
}

/* ------------------------------------------------------------------ pages */

/** The tutor's page of one student. `progress` is null until the student shares it. */
export interface StudentSheet {
	link: TutorLink;
	progress: SharedProgress | null;
	assignments: AgendaAssignment[];
	lessons: AgendaLesson[];
	messages: AgendaMessage[];
	/** Messages of the student the tutor has not read yet. */
	unread: number;
	/** The day in Rome and the instant the folder was read at: every card of the page agrees on what is late and what is over. */
	today: string;
	now: number;
}

/** Everything about one student, for the pages of their folder: read once per request, and nothing is marked read. */
export const studentSheet = cache(async (tutorId: string, linkId: string): Promise<StudentSheet> => {
	const row = await tutorLinkRow(tutorId, linkId);
	const shared = row.status === 'active' && row.student_id && row.progress_shared ? await sharedProgress(row.student_id) : null;
	const { count, error } = await adminClient().from('tutor_messages').select('id', { count: 'exact', head: true }).eq('tutor_student_id', row.id).eq('sender', 'student').is('read_at', null);
	if (error) fail('unread count failed', error);
	const [assignmentRows, lessons, messages] = await Promise.all([linkAssignments(row.id), linkLessons(row.id, row.name), linkMessages(row.id, null)]);
	return { ...agendaClock(), unread: count ?? 0, link: toTutorLink(row), progress: shared?.view ?? null, assignments: await toAssignments(assignmentRows, shared?.byLesson ?? null), lessons, messages };
});

/** The student's page of one tutor. */
export interface TutorSheet {
	link: StudentLink;
	assignments: AgendaAssignment[];
	lessons: AgendaLesson[];
	messages: AgendaMessage[];
	review: { rating: number; body: string } | null;
	/** Messages of the tutor the student has not read yet. */
	unread: number;
	today: string;
	now: number;
}

/** The student's tutors with everything about each, read once per request; nothing is marked read. */
export const studentTutors = cache(async (userId: string): Promise<TutorSheet[]> => {
	const links = await listStudentLinks(userId);
	if (links.length === 0) return [];
	const progress = await lessonProgress(userId);
	return Promise.all(
		links.map(async (link) => {
			const name = `${link.tutor.firstName} ${link.tutor.lastInitial}.`;
			const [assignmentRows, lessons, messages, review, unread] = await Promise.all([
				linkAssignments(link.id),
				linkLessons(link.id, name),
				linkMessages(link.id, null),
				linkReview(link.id),
				adminClient().from('tutor_messages').select('id', { count: 'exact', head: true }).eq('tutor_student_id', link.id).eq('sender', 'tutor').is('read_at', null)
			]);
			if (unread.error) fail('unread count failed', unread.error);
			return { ...agendaClock(), link, assignments: await toAssignments(assignmentRows, progress), lessons, messages, review, unread: unread.count ?? 0 };
		})
	);
});

/** A conversation as the inbox lists it. */
export interface Conversation {
	linkId: string;
	name: string;
	subject: string | null;
	status: LinkStatus;
	last: AgendaMessage | null;
	unread: number;
}

/** The tutor's conversations: every student who has joined, the ones written to most recently first. */
export const tutorInbox = cache(async (tutorId: string): Promise<Conversation[]> => {
	const db = adminClient();
	const { data: links, error } = await db.from('tutor_students').select(LINK_COLUMNS).eq('tutor_id', tutorId).not('student_id', 'is', null);
	if (error) fail('inbox links failed', error);
	const rows = (links ?? []) as LinkRow[];
	if (rows.length === 0) return [];
	const { data, error: messagesError } = await db.from('tutor_messages').select('id,tutor_student_id,sender,body,created_at,read_at').in('tutor_student_id', rows.map((r) => r.id)).order('created_at', { ascending: false }).limit(2000);
	if (messagesError) fail('inbox messages failed', messagesError);
	const messages = (data ?? []) as { id: string; tutor_student_id: string; sender: Side; body: string; created_at: string; read_at: string | null }[];
	return rows
		.map((row) => {
			const own = messages.filter((m) => m.tutor_student_id === row.id);
			return { linkId: row.id, name: row.name, subject: row.subject, status: row.status, last: own[0] ? toMessage(own[0]) : null, unread: own.filter((m) => m.sender === 'student' && !m.read_at).length };
		})
		.filter((c) => c.status === 'active' || c.last)
		.sort((a, b) => (b.last?.createdAt ?? '').localeCompare(a.last?.createdAt ?? '') || a.name.localeCompare(b.name));
});

/** What waits for the tutor, for the marks on the navigation. */
export const tutorBadges = cache(async (tutorId: string): Promise<{ unread: number; proposals: number; requests: number }> => {
	const db = adminClient();
	const now = new Date().toISOString();
	const { data: links, error } = await db.from('tutor_students').select('id').eq('tutor_id', tutorId).eq('status', 'active');
	if (error) fail('badges links failed', error);
	const ids = ((links ?? []) as { id: string }[]).map((l) => l.id);
	const [unread, proposals, requests] = await Promise.all([
		ids.length ? db.from('tutor_messages').select('id', { count: 'exact', head: true }).in('tutor_student_id', ids).eq('sender', 'student').is('read_at', null) : Promise.resolve({ count: 0, error: null }),
		db.from('tutor_lessons').select('id', { count: 'exact', head: true }).eq('tutor_id', tutorId).eq('status', 'proposed').gte('starts_at', now),
		db.from('tutor_requests').select('id', { count: 'exact', head: true }).eq('tutor_id', tutorId).eq('status', 'pending').gte('expires_at', now)
	]);
	for (const r of [unread, proposals, requests]) if (r.error) fail('badges count failed', r.error);
	return { unread: unread.count ?? 0, proposals: proposals.count ?? 0, requests: requests.count ?? 0 };
});

/* ------------------------------------------------------------------ stats */

/** The tutor's numbers: hours held, never money (see the migration on `paid` and `hourly_rate`). */
export interface TutorStats {
	activeStudents: number;
	invited: number;
	lessonsThisWeek: number;
	hoursThisMonth: number;
	hoursTotal: number;
	lessonsHeld: number;
	openAssignments: number;
	unread: number;
	/** The last six months, oldest first: `YYYY-MM` and the hours held in it. */
	months: { month: string; hours: number }[];
	/** Hours held by weekday, Monday first. */
	weekdays: number[];
	/** Hours held by student, the most followed first. */
	students: { name: string; hours: number }[];
	/** Hours held by subject id. */
	subjects: { subject: string; hours: number }[];
}

export async function tutorStats(tutorId: string): Promise<TutorStats> {
	const db = adminClient();
	const [links, lessons] = await Promise.all([
		db.from('tutor_students').select('id,name,subject,status').eq('tutor_id', tutorId),
		db.from('tutor_lessons').select('tutor_student_id,starts_at,duration_min,status').eq('tutor_id', tutorId).eq('status', 'confirmed').limit(5000)
	]);
	if (links.error) fail('stats links failed', links.error);
	if (lessons.error) fail('stats lessons failed', lessons.error);
	const linkRows = (links.data ?? []) as { id: string; name: string; subject: string | null; status: LinkStatus }[];
	const activeIds = linkRows.filter((l) => l.status === 'active').map((l) => l.id);
	const [assignments, messages] = activeIds.length
		? await Promise.all([
				db.from('tutor_assignments').select('id', { count: 'exact', head: true }).in('tutor_student_id', activeIds).eq('status', 'open').gte('due', romeDate()),
				db.from('tutor_messages').select('id', { count: 'exact', head: true }).in('tutor_student_id', activeIds).eq('sender', 'student').is('read_at', null)
			])
		: [{ count: 0, error: null }, { count: 0, error: null }];
	if (assignments.error) fail('stats assignments failed', assignments.error);
	if (messages.error) fail('stats messages failed', messages.error);

	const now = Date.now();
	const today = romeDate();
	const monday = new Date(`${today}T00:00:00Z`);
	monday.setUTCDate(monday.getUTCDate() - weekdayOf(today));
	const weekFrom = monday.toISOString().slice(0, 10);
	const sunday = new Date(monday);
	sunday.setUTCDate(sunday.getUTCDate() + 6);
	const weekTo = sunday.toISOString().slice(0, 10);

	const months: { month: string; hours: number }[] = [];
	for (let i = 5; i >= 0; i--) {
		const d = new Date(Date.UTC(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1 - i, 1));
		months.push({ month: d.toISOString().slice(0, 7), hours: 0 });
	}
	const weekdays = Array.from({ length: 7 }, () => 0);
	const byLink = new Map<string, number>();
	let lessonsThisWeek = 0;
	let lessonsHeld = 0;
	let hoursTotal = 0;
	for (const l of (lessons.data ?? []) as { tutor_student_id: string; starts_at: string; duration_min: number; status: LessonStatus }[]) {
		const { day } = romeParts(l.starts_at);
		if (day >= weekFrom && day <= weekTo) lessonsThisWeek++;
		if (!isHeld({ startsAt: l.starts_at, durationMin: l.duration_min, status: l.status }, now)) continue;
		const hours = l.duration_min / 60;
		lessonsHeld++;
		hoursTotal += hours;
		const month = months.find((m) => m.month === day.slice(0, 7));
		if (month) month.hours += hours;
		weekdays[weekdayOf(day)] += hours;
		byLink.set(l.tutor_student_id, (byLink.get(l.tutor_student_id) ?? 0) + hours);
	}
	const bySubject = new Map<string, number>();
	for (const link of linkRows) if (link.subject && byLink.has(link.id)) bySubject.set(link.subject, (bySubject.get(link.subject) ?? 0) + byLink.get(link.id)!);
	return {
		activeStudents: activeIds.length,
		invited: linkRows.filter((l) => l.status === 'invited').length,
		lessonsThisWeek,
		hoursThisMonth: months[months.length - 1].hours,
		hoursTotal,
		lessonsHeld,
		openAssignments: assignments.count ?? 0,
		unread: messages.count ?? 0,
		months,
		weekdays,
		students: linkRows.flatMap((l) => (byLink.has(l.id) ? [{ name: l.name, hours: byLink.get(l.id)! }] : [])).sort((a, b) => b.hours - a.hours).slice(0, 8),
		subjects: [...bySubject.entries()].map(([subject, hours]) => ({ subject, hours })).sort((a, b) => b.hours - a.hours)
	};
}

