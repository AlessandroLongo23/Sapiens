import 'server-only';
import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import { TUTORING_ROOT } from '@/lib/config/site';
import { adminClient as serviceClient } from './supabase';
import { TUTOR_LEVELS, TUTOR_MODES, TUTOR_SUBJECTS, type TutorLevel, type TutorMode } from '@/lib/tutoring/config';
import { invalidateTutorCache } from './tutoring';

/** A profile changed: the in-memory list and the cached list and profile pages are refreshed, so staff decisions show at once. */
function refreshTutorPages(row: unknown) {
	invalidateTutorCache();
	revalidatePath(TUTORING_ROOT);
	const slug = (row as { slug?: unknown } | null)?.slug;
	if (typeof slug === 'string' && slug) revalidatePath(`${TUTORING_ROOT}/${slug}`);
}

/**
 * Writes and private reads of the marketplace, with the service role. Every
 * function takes the acting user's id and checks ownership itself, so route
 * handlers only have to check that a user is signed in. The public reads stay
 * in `./tutoring` (anon client, `tutors_public` view).
 */

export class TutoringError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

export function adminClient(): SupabaseClient {
	try {
		return serviceClient() as unknown as SupabaseClient;
	} catch {
		throw new TutoringError(503, 'Servizio non disponibile. Riprova più tardi.');
	}
}

export type TutorStatus = 'draft' | 'pending' | 'published' | 'suspended';
export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';

/** A row of `tutors`, private columns included. Only ever sent to its owner or to staff. */
export interface TutorRow {
	id: string;
	user_id: string | null;
	slug: string;
	first_name: string;
	last_name: string;
	headline: string;
	bio: string;
	subjects: string[];
	levels: TutorLevel[];
	modes: TutorMode[];
	city: string | null;
	hourly_rate: number | null;
	education: string | null;
	years_experience: number;
	avatar_url: string | null;
	contact_email: string | null;
	contact_phone: string | null;
	verified: boolean;
	status: TutorStatus;
	terms_accepted_at: string | null;
	created_at: string;
	updated_at: string;
}

const TUTOR_COLUMNS =
	'id,user_id,slug,first_name,last_name,headline,bio,subjects,levels,modes,city,hourly_rate,education,years_experience,avatar_url,contact_email,contact_phone,verified,status,terms_accepted_at,created_at,updated_at';

function toTutor(row: Record<string, unknown>): TutorRow {
	return {
		...(row as unknown as TutorRow),
		hourly_rate: row.hourly_rate == null ? null : Number(row.hourly_rate),
		years_experience: Number(row.years_experience ?? 0),
		subjects: Array.isArray(row.subjects) ? (row.subjects as string[]) : [],
		levels: Array.isArray(row.levels) ? (row.levels as TutorLevel[]) : [],
		modes: Array.isArray(row.modes) ? (row.modes as TutorMode[]) : []
	};
}

function fail(context: string, error: { message: string }): never {
	console.error(`${context}:`, error.message);
	throw new TutoringError(503, 'Servizio non disponibile. Riprova più tardi.');
}

export async function getOwnTutor(userId: string): Promise<TutorRow | null> {
	const { data, error } = await adminClient().from('tutors').select(TUTOR_COLUMNS).eq('user_id', userId).maybeSingle();
	if (error) fail('tutor lookup failed', error);
	return data ? toTutor(data as Record<string, unknown>) : null;
}

export async function getTutorById(id: string): Promise<TutorRow | null> {
	const { data, error } = await adminClient().from('tutors').select(TUTOR_COLUMNS).eq('id', id).maybeSingle();
	if (error) fail('tutor lookup failed', error);
	return data ? toTutor(data as Record<string, unknown>) : null;
}

/* ---------------------------------------------------------------- profile */

export interface TutorProfileInput {
	first_name: string;
	last_name: string;
	headline: string;
	bio: string;
	subjects: string[];
	levels: TutorLevel[];
	modes: TutorMode[];
	city: string | null;
	hourly_rate: number | null;
	education: string | null;
	years_experience: number;
	contact_email: string | null;
	contact_phone: string;
	terms: boolean;
}

const SUBJECT_IDS = new Set(TUTOR_SUBJECTS.map((s) => s.id));
const LEVEL_IDS = new Set<string>(TUTOR_LEVELS.map((l) => l.id));
const MODE_IDS = new Set<string>(TUTOR_MODES.map((m) => m.id));

const text = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const list = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

export function phoneDigits(phone: string): string {
	return phone.replace(/^\+/, '').replace(/\D/g, '');
}

export function validPhone(phone: string): boolean {
	const digits = phoneDigits(phone);
	return digits.length >= 8 && digits.length <= 15 && /^\+?[\d\s().-]+$/.test(phone);
}

export function validEmail(email: string): boolean {
	return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** The clean profile, or the message to show. */
export function parseProfileInput(body: Record<string, unknown>): TutorProfileInput | string {
	const first_name = text(body.first_name);
	const last_name = text(body.last_name);
	if (first_name.length < 2 || first_name.length > 40) return 'Inserisci il tuo nome.';
	if (last_name.length < 2 || last_name.length > 40) return 'Inserisci il tuo cognome (sul sito compare solo l’iniziale).';

	const headline = text(body.headline);
	if (headline.length < 10 || headline.length > 120) return 'Scrivi una presentazione breve, da 10 a 120 caratteri.';

	const bio = text(body.bio);
	if (bio.length < 40 || bio.length > 2000) return 'La presentazione deve avere da 40 a 2000 caratteri.';

	const subjects = [...new Set(list(body.subjects))].filter((s) => SUBJECT_IDS.has(s));
	if (subjects.length === 0) return 'Scegli almeno una materia.';
	if (subjects.length > 8) return 'Puoi scegliere al massimo otto materie.';

	const levels = [...new Set(list(body.levels))].filter((l) => LEVEL_IDS.has(l)) as TutorLevel[];
	if (levels.length === 0) return 'Scegli almeno un livello.';

	const modes = [...new Set(list(body.modes))].filter((m) => MODE_IDS.has(m)) as TutorMode[];
	if (modes.length === 0) return 'Scegli se fai lezione online, in presenza o entrambe.';

	const cityRaw = text(body.city);
	if (modes.includes('in_person') && (cityRaw.length < 2 || cityRaw.length > 60)) return 'Indica la città per le lezioni in presenza.';
	const city = cityRaw ? cityRaw.slice(0, 60) : null;

	let hourly_rate: number | null = null;
	if (body.hourly_rate !== null && body.hourly_rate !== undefined && body.hourly_rate !== '') {
		const n = Number(body.hourly_rate);
		if (!Number.isFinite(n) || n < 5 || n > 200) return 'Il prezzo orario indicativo va da 5 a 200 euro.';
		hourly_rate = Math.round(n * 100) / 100;
	}

	const educationRaw = text(body.education);
	if (educationRaw.length > 120) return 'La formazione può avere al massimo 120 caratteri.';
	const education = educationRaw || null;

	const years = Number(body.years_experience ?? 0);
	if (!Number.isInteger(years) || years < 0 || years > 50) return 'Gli anni di esperienza vanno da 0 a 50.';

	const contact_phone = text(body.contact_phone);
	if (!validPhone(contact_phone)) return 'Inserisci un numero di telefono valido: lo ricevono solo gli studenti che accetti.';

	const emailRaw = text(body.contact_email);
	if (emailRaw && !validEmail(emailRaw)) return "L'indirizzo email non sembra valido.";

	return {
		first_name,
		last_name,
		headline,
		bio,
		subjects,
		levels,
		modes,
		city,
		hourly_rate,
		education,
		years_experience: years,
		contact_email: emailRaw || null,
		contact_phone,
		terms: body.terms === true
	};
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

async function uniqueSlug(first: string, last: string): Promise<string> {
	const base = `${slugify(first)}-${slugify(last.charAt(1) ? last.charAt(0) : last)}`.replace(/-+$/, '') || 'tutor';
	for (let attempt = 0; attempt < 8; attempt++) {
		const candidate = `${base}-${Math.random().toString(36).slice(2, 6)}`;
		const { data, error } = await adminClient().from('tutors').select('id').eq('slug', candidate).maybeSingle();
		if (error) fail('slug check failed', error);
		if (!data) return candidate;
	}
	throw new TutoringError(503, 'Servizio non disponibile. Riprova più tardi.');
}

/**
 * Creates the profile (status `pending`, waiting for review) or updates it.
 * Status, slug and the verified flag never change here: publishing is staff's
 * decision (see `setTutorReview`). A suspended profile cannot be edited.
 */
export async function saveOwnTutor(userId: string, input: TutorProfileInput, accountEmail: string | null): Promise<TutorRow> {
	const existing = await getOwnTutor(userId);
	const fields = {
		first_name: input.first_name,
		last_name: input.last_name,
		headline: input.headline,
		bio: input.bio,
		subjects: input.subjects,
		levels: input.levels,
		modes: input.modes,
		city: input.city,
		hourly_rate: input.hourly_rate,
		education: input.education,
		years_experience: input.years_experience,
		contact_email: input.contact_email ?? accountEmail,
		contact_phone: input.contact_phone,
		updated_at: new Date().toISOString()
	};

	if (existing) {
		if (existing.status === 'suspended') throw new TutoringError(403, 'Il profilo è sospeso: scrivici per riattivarlo.');
		const { data, error } = await adminClient()
			.from('tutors')
			.update({ ...fields, status: existing.status === 'draft' ? 'pending' : existing.status })
			.eq('id', existing.id)
			.select(TUTOR_COLUMNS)
			.single();
		if (error) fail('tutor update failed', error);
		refreshTutorPages(data);
		return toTutor(data as Record<string, unknown>);
	}

	if (!input.terms) throw new TutoringError(400, 'Per aprire il profilo devi accettare le condizioni.');
	const { data, error } = await adminClient()
		.from('tutors')
		.insert({
			...fields,
			user_id: userId,
			slug: await uniqueSlug(input.first_name, input.last_name),
			status: 'pending',
			terms_accepted_at: new Date().toISOString()
		})
		.select(TUTOR_COLUMNS)
		.single();
	if (error) fail('tutor insert failed', error);
	refreshTutorPages(data);
	return toTutor(data as Record<string, unknown>);
}

/* --------------------------------------------------------------- requests */

export interface RequestRow {
	id: string;
	tutor_id: string;
	student_id: string;
	subject: string;
	level: TutorLevel;
	mode: TutorMode;
	requester: 'student' | 'parent';
	contact_name: string;
	contact_phone: string;
	contact_email: string | null;
	message: string;
	status: RequestStatus;
	created_at: string;
	expires_at: string;
	responded_at: string | null;
}

const REQUEST_COLUMNS =
	'id,tutor_id,student_id,subject,level,mode,requester,contact_name,contact_phone,contact_email,message,status,created_at,expires_at,responded_at';

/** Pending requests past their 48 hours become `expired`. Cheap; called before every list. */
export async function expirePendingRequests(): Promise<void> {
	const { error } = await adminClient()
		.from('tutor_requests')
		.update({ status: 'expired' })
		.eq('status', 'pending')
		.lt('expires_at', new Date().toISOString());
	if (error) console.error('request expiry failed:', error.message);
}

/** What the tutor sees: the contact fields only once the request is accepted. */
export interface InboxRequest {
	id: string;
	subject: string;
	level: TutorLevel;
	mode: TutorMode;
	requester: 'student' | 'parent';
	message: string;
	status: RequestStatus;
	created_at: string;
	expires_at: string;
	responded_at: string | null;
	contact: { name: string; phone: string; email: string | null } | null;
}

function toInbox(row: RequestRow): InboxRequest {
	return {
		id: row.id,
		subject: row.subject,
		level: row.level,
		mode: row.mode,
		requester: row.requester,
		message: row.message,
		status: row.status,
		created_at: row.created_at,
		expires_at: row.expires_at,
		responded_at: row.responded_at,
		contact: row.status === 'accepted' ? { name: row.contact_name, phone: row.contact_phone, email: row.contact_email } : null
	};
}

export async function listTutorInbox(tutorId: string): Promise<InboxRequest[]> {
	await expirePendingRequests();
	const { data, error } = await adminClient()
		.from('tutor_requests')
		.select(REQUEST_COLUMNS)
		.eq('tutor_id', tutorId)
		.order('created_at', { ascending: false });
	if (error) fail('inbox query failed', error);
	return ((data ?? []) as RequestRow[]).map(toInbox);
}

/** The tutor accepts or declines one of their pending requests. Returns the full row for the notifications. */
export async function respondToRequest(tutorId: string, requestId: string, action: 'accept' | 'decline'): Promise<RequestRow> {
	const { data, error } = await adminClient().from('tutor_requests').select(REQUEST_COLUMNS).eq('id', requestId).maybeSingle();
	if (error) fail('request lookup failed', error);
	const row = data as RequestRow | null;
	if (!row || row.tutor_id !== tutorId) throw new TutoringError(404, 'Richiesta non trovata.');
	if (row.status !== 'pending') throw new TutoringError(409, 'Questa richiesta è già stata gestita.');
	if (new Date(row.expires_at).getTime() < Date.now()) {
		await expirePendingRequests();
		throw new TutoringError(409, 'Questa richiesta è scaduta: sono passate più di 48 ore.');
	}
	const status: RequestStatus = action === 'accept' ? 'accepted' : 'declined';
	const { data: updated, error: updateError } = await adminClient()
		.from('tutor_requests')
		.update({ status, responded_at: new Date().toISOString() })
		.eq('id', row.id)
		.eq('status', 'pending')
		.select(REQUEST_COLUMNS)
		.maybeSingle();
	if (updateError) fail('request update failed', updateError);
	// Zero rows: another response landed between the read and the write.
	if (!updated) throw new TutoringError(409, 'Questa richiesta è già stata gestita.');
	return updated as RequestRow;
}

/** What the student sees: their request, the tutor's public identity, and the tutor's contacts once accepted. */
export interface StudentRequest {
	id: string;
	subject: string;
	level: TutorLevel;
	mode: TutorMode;
	message: string;
	status: RequestStatus;
	created_at: string;
	expires_at: string;
	responded_at: string | null;
	tutor: {
		slug: string;
		first_name: string;
		last_initial: string;
		headline: string;
		published: boolean;
		contact: { phone: string | null; email: string | null } | null;
	};
}

export async function listStudentRequests(userId: string): Promise<StudentRequest[]> {
	await expirePendingRequests();
	const { data, error } = await adminClient()
		.from('tutor_requests')
		.select(`${REQUEST_COLUMNS}, tutors ( slug, first_name, last_name, headline, status, contact_phone, contact_email )`)
		.eq('student_id', userId)
		.order('created_at', { ascending: false });
	if (error) fail('student requests query failed', error);
	return ((data ?? []) as unknown as (RequestRow & { tutors: Record<string, string | null> | null })[]).map((row) => {
		const t = row.tutors ?? {};
		return {
			id: row.id,
			subject: row.subject,
			level: row.level,
			mode: row.mode,
			message: row.message,
			status: row.status,
			created_at: row.created_at,
			expires_at: row.expires_at,
			responded_at: row.responded_at,
			tutor: {
				slug: t.slug ?? '',
				first_name: t.first_name ?? 'Tutor',
				last_initial: (t.last_name ?? '').charAt(0),
				headline: t.headline ?? '',
				published: t.status === 'published',
				contact: row.status === 'accepted' ? { phone: t.contact_phone ?? null, email: t.contact_email ?? null } : null
			}
		};
	});
}

export async function cancelRequest(userId: string, requestId: string): Promise<void> {
	const { data, error } = await adminClient()
		.from('tutor_requests')
		.update({ status: 'cancelled', responded_at: new Date().toISOString() })
		.eq('id', requestId)
		.eq('student_id', userId)
		.eq('status', 'pending')
		.select('id');
	if (error) fail('request cancel failed', error);
	if (!data || data.length === 0) throw new TutoringError(409, 'La richiesta non è più in attesa.');
}

/* ------------------------------------------------------------------ staff */

export async function listAllTutors(): Promise<TutorRow[]> {
	const { data, error } = await adminClient().from('tutors').select(TUTOR_COLUMNS).order('created_at', { ascending: false });
	if (error) fail('tutor list failed', error);
	return ((data ?? []) as Record<string, unknown>[]).map(toTutor);
}

const STATUSES = new Set<string>(['draft', 'pending', 'published', 'suspended']);

export async function setTutorReview(id: string, patch: { status?: unknown; verified?: unknown }): Promise<TutorRow> {
	const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
	if (patch.status !== undefined) {
		if (typeof patch.status !== 'string' || !STATUSES.has(patch.status)) throw new TutoringError(400, 'Stato non valido.');
		update.status = patch.status;
	}
	if (patch.verified !== undefined) {
		if (typeof patch.verified !== 'boolean') throw new TutoringError(400, 'Valore non valido.');
		update.verified = patch.verified;
	}
	const { data, error } = await adminClient().from('tutors').update(update).eq('id', id).select(TUTOR_COLUMNS).maybeSingle();
	if (error) fail('tutor review failed', error);
	if (!data) throw new TutoringError(404, 'Tutor non trovato.');
	refreshTutorPages(data);
	return toTutor(data as Record<string, unknown>);
}

export async function userEmail(userId: string | null): Promise<string | null> {
	if (!userId) return null;
	const { data } = await adminClient().auth.admin.getUserById(userId);
	return data.user?.email ?? null;
}
