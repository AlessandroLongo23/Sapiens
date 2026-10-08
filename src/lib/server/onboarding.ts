import 'server-only';
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import type { User } from '@supabase/supabase-js';
import { configs } from '@/lib/exercises/config';
import { levelName } from '@/lib/exercises/level-names';
import { APP_LIBRARY, CONTENT_ROOT } from '@/lib/config/site';
import { LEGAL, LEGAL_VERSIONS } from '@/lib/config/legal';
import { CHEM_BLOCKS, figureUrl, parseFigure } from '@/lib/content/figures';
import { titleHtml } from '@/lib/content/latex';
import { EMAIL_CODE, HEARD_FROM, PARENT_CONFIRM_PATH, PARENT_LINK_DAYS, SCHOOL_YEARS, SUBJECTS, WELCOME_PATH, isRole, isSchoolLevel, isSubject, type AgeBand, type SubjectId } from '@/lib/onboarding/config';
import { REFERRAL, normalizeCode } from '@/lib/referrals/config';
import { dbPath, plainTitle, subviewPath } from '@/lib/seo/slug';
import { STICKER_BY_ID, coverDefaults, stickerUrl } from '@/lib/zaino/stickers';
import { getContentTree, getTopicContent } from '@/lib/server/content';
import { mailEmailCode, mailParentConfirmed, mailParentConsent } from '@/lib/server/account-mail';
import { profileOf, profilesDb, updateProfile } from '@/lib/server/profile';

/**
 * The way in (vault/Prodotti/Studenti/Onboarding.md): signing up without waiting for an email, the parent's link
 * for a student under 14, the six-digit code that confirms an address later, and the two questions of the welcome
 * page. Accounts are made here with the service role, already confirmed for Supabase Auth, so a new student is
 * signed in at once; whether the address is really theirs is kept in `profiles.email_verified_at`.
 */

export class OnboardingError extends Error {
	status: number;
	code?: string;
	constructor(status: number, message: string, code?: string) {
		super(message);
		this.status = status;
		this.code = code;
	}
}

const db = profilesDb;
const sha = (text: string) => createHash('sha256').update(text).digest('hex');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cleanEmail = (value: unknown) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
const cleanName = (value: unknown) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, 80) : '');

/** Supabase Auth has no "never": a ban this long is lifted by the parent's confirmation, or ends with the account. */
const BAN_UNTIL_CONFIRMED = '876000h';

export interface SignUpResult {
	/** `ready`: sign in now. `parent`: an email went to the parent, the account waits. */
	state: 'ready' | 'parent';
	parentEmail?: string;
	/** Where the new account starts: the exercises of the lesson named on the way in, the library, the tutor's profile. */
	next?: string;
}

/**
 * Creates an account. Body: `{ role, firstName, lastName, email, password, terms, age, parentEmail?, invite?,
 * level?, year?, subjects?, topics?, start? }`, where `age` is `under14` or `14plus` for a student and `adult` for every
 * other role. The last five are the answers a student gave on the way in (src/components/onboarding/Onboarding.tsx): they are
 * saved with the account, except under 14, where nothing more than the account is kept before a parent agrees.
 */
export async function signUp(body: Record<string, unknown>, origin: string): Promise<SignUpResult> {
	const role = body.role;
	if (!isRole(role)) throw new OnboardingError(400, 'Scegli chi sei per continuare.');
	const firstName = cleanName(body.firstName);
	const lastName = cleanName(body.lastName);
	const email = cleanEmail(body.email);
	const password = typeof body.password === 'string' ? body.password : '';
	if (!firstName || !lastName) throw new OnboardingError(400, 'Inserisci nome e cognome.');
	if (!EMAIL.test(email)) throw new OnboardingError(400, "L'indirizzo email non sembra valido.");
	if (password.length < 6) throw new OnboardingError(400, 'La password deve avere almeno 6 caratteri.');
	if (body.terms !== true) throw new OnboardingError(400, 'Per iscriverti devi accettare i termini.');

	const age = body.age as AgeBand;
	if (role === 'student' ? age !== 'under14' && age !== '14plus' : age !== 'adult') {
		throw new OnboardingError(400, role === 'student' ? 'Indica la tua età per continuare.' : 'Per questo tipo di account devi avere almeno 18 anni.');
	}
	const parentEmail = age === 'under14' ? cleanEmail(body.parentEmail) : '';
	if (age === 'under14') {
		if (!EMAIL.test(parentEmail)) throw new OnboardingError(400, "Inserisci l'email di un genitore.");
		if (parentEmail === email) throw new OnboardingError(400, "L'email del genitore deve essere diversa dalla tua.");
	}

	const invite = normalizeCode(body.invite);
	const admin = db().auth.admin;
	const { data, error } = await admin.createUser({
		email,
		password,
		email_confirm: true,
		user_metadata: {
			first_name: firstName,
			last_name: lastName,
			// Read by the database when the account is created: a valid code gives the longer trial.
			...(invite ? { [REFERRAL.param]: invite } : {}),
			// Record of what was accepted at signup, with the document versions.
			legal: {
				terms: LEGAL_VERSIONS.terms,
				privacy: LEGAL_VERSIONS.privacy,
				age_declaration: age === 'under14' ? `under_${LEGAL.digitalConsentAge}_parent_asked` : age === '14plus' ? `over_${LEGAL.digitalConsentAge}` : 'adult',
				accepted_at: new Date().toISOString()
			}
		}
	});
	if (error || !data.user) {
		if (error && (error.code === 'email_exists' || /already (been )?registered/i.test(error.message))) {
			throw new OnboardingError(409, 'Esiste già un account con questa email. Prova ad accedere.');
		}
		if (error && /password/i.test(error.message)) throw new OnboardingError(400, 'La password è troppo debole: scegline una più lunga.');
		throw error ?? new Error('createUser returned no user');
	}
	const user = data.user;

	try {
		const answers = role === 'student' && age === '14plus' ? await welcomeAnswers(body) : null;
		const { error: profileError } = await db()
			.from('profiles')
			.upsert(
				{
					user_id: user.id,
					roles: [role],
					age_band: age,
					email_verified_at: null,
					parent_email: parentEmail || null,
					...(answers?.answered ? answers.fields : {})
				},
				{ onConflict: 'user_id' }
			);
		if (profileError) throw profileError;
		if (age !== 'under14') return { state: 'ready', next: answers?.answered ? answers.next : role === 'student' ? WELCOME_PATH : role === 'tutor' ? '/profile-editor' : '/' };

		const { error: banError } = await admin.updateUserById(user.id, { ban_duration: BAN_UNTIL_CONFIRMED });
		if (banError) throw banError;
		await sendParentLink(user.id, firstName, parentEmail, origin);
		return { state: 'parent', parentEmail };
	} catch (err) {
		// Half an account is worse than none: the student can try again with the same address.
		await admin.deleteUser(user.id).catch((cleanup) => console.error('signup cleanup failed:', cleanup));
		throw err;
	}
}

async function sendParentLink(userId: string, firstName: string, parentEmail: string, origin: string): Promise<void> {
	const token = randomBytes(32).toString('base64url');
	const { error } = await db()
		.from('parent_consents')
		.insert({ token_hash: sha(token), user_id: userId, parent_email: parentEmail, expires_at: new Date(Date.now() + PARENT_LINK_DAYS * 86_400_000).toISOString() });
	if (error) throw error;
	const sent = await mailParentConsent(parentEmail, firstName, `${origin}${PARENT_CONFIRM_PATH}?token=${token}`);
	if (!sent) throw new OnboardingError(503, "Non riesco a scrivere al genitore in questo momento. Riprova tra poco.");
}

export interface ParentRequest {
	state: 'open' | 'confirmed' | 'expired';
	studentFirstName: string;
}

async function consentRow(token: unknown) {
	if (typeof token !== 'string' || token.length < 20 || token.length > 100) return null;
	const { data, error } = await db().from('parent_consents').select('user_id, expires_at, confirmed_at').eq('token_hash', sha(token)).maybeSingle();
	if (error) throw error;
	return data as { user_id: string; expires_at: string; confirmed_at: string | null } | null;
}

/** What the parent's page shows: null when the link is not one of ours (or the account is gone). */
export async function parentRequest(token: unknown): Promise<ParentRequest | null> {
	const row = await consentRow(token);
	if (!row) return null;
	const { data } = await db().auth.admin.getUserById(row.user_id);
	if (!data?.user) return null;
	const studentFirstName = String(data.user.user_metadata?.first_name ?? '');
	if (row.confirmed_at) return { state: 'confirmed', studentFirstName };
	return { state: Date.parse(row.expires_at) < Date.now() ? 'expired' : 'open', studentFirstName };
}

/** The parent confirms: the account can sign in, and its trial starts now, not when the student asked. */
export async function confirmParent(token: unknown, origin: string): Promise<void> {
	const row = await consentRow(token);
	if (!row) throw new OnboardingError(404, 'Questo link non è valido.');
	if (row.confirmed_at) return;
	if (Date.parse(row.expires_at) < Date.now()) throw new OnboardingError(410, 'Questo link è scaduto: lo studente può iscriversi di nuovo.');

	const admin = db().auth.admin;
	const { data, error } = await admin.getUserById(row.user_id);
	if (error || !data.user) throw new OnboardingError(404, 'Questo account non esiste più.');
	const now = new Date().toISOString();
	const { error: unbanError } = await admin.updateUserById(row.user_id, { ban_duration: 'none', app_metadata: { ...data.user.app_metadata, trialFrom: now } });
	if (unbanError) throw unbanError;
	await updateProfile(data.user, { parent_consent_at: now });
	const { error: markError } = await db().from('parent_consents').update({ confirmed_at: now }).eq('user_id', row.user_id).is('confirmed_at', null);
	if (markError) throw markError;
	if (data.user.email) await mailParentConfirmed(data.user.email, String(data.user.user_metadata?.first_name ?? ''), origin);
}

const codeHash = (userId: string, code: string) => sha(`${userId}:${code}`);

/** Sends a new code to the account's address, at most one a minute. */
export async function sendEmailCode(user: User): Promise<void> {
	if (!user.email) throw new OnboardingError(400, "Questo account non ha un'email.");
	if ((await profileOf(user)).emailVerified) return;
	const { data: last, error: readError } = await db().from('email_codes').select('sent_at').eq('user_id', user.id).maybeSingle();
	if (readError) throw readError;
	if (last && Date.now() - Date.parse(last.sent_at as string) < EMAIL_CODE.resendSeconds * 1000) {
		throw new OnboardingError(429, 'Ti abbiamo appena mandato un codice: aspetta un minuto prima di chiederne un altro.');
	}
	const code = String(randomInt(10 ** EMAIL_CODE.digits)).padStart(EMAIL_CODE.digits, '0');
	const now = Date.now();
	const { error } = await db()
		.from('email_codes')
		.upsert({ user_id: user.id, code_hash: codeHash(user.id, code), attempts: 0, sent_at: new Date(now).toISOString(), expires_at: new Date(now + EMAIL_CODE.minutes * 60_000).toISOString() }, { onConflict: 'user_id' });
	if (error) throw error;
	if (!(await mailEmailCode(user.email, code))) throw new OnboardingError(503, "Non riesco a mandare l'email in questo momento. Riprova tra poco.");
}

/** Checks the code the student typed; a right one confirms the address and lets a waiting invite count. */
export async function confirmEmailCode(user: User, input: unknown): Promise<void> {
	const code = typeof input === 'string' ? input.replace(/\D/g, '') : '';
	if (code.length !== EMAIL_CODE.digits) throw new OnboardingError(400, `Il codice ha ${EMAIL_CODE.digits} cifre.`);
	const { data, error } = await db().from('email_codes').select('code_hash, attempts, expires_at').eq('user_id', user.id).maybeSingle();
	if (error) throw error;
	if (!data || Date.parse(data.expires_at as string) < Date.now()) throw new OnboardingError(400, 'Il codice è scaduto: chiedine uno nuovo.');
	if ((data.attempts as number) >= EMAIL_CODE.attempts) throw new OnboardingError(429, 'Troppi tentativi: chiedi un codice nuovo.');

	const expected = Buffer.from(data.code_hash as string, 'hex');
	const given = Buffer.from(codeHash(user.id, code), 'hex');
	if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
		await db().from('email_codes').update({ attempts: (data.attempts as number) + 1 }).eq('user_id', user.id);
		throw new OnboardingError(400, 'Il codice non è giusto. Controlla e riprova.');
	}
	await updateProfile(user, { email_verified_at: new Date().toISOString() });
	await db().from('email_codes').delete().eq('user_id', user.id);
	// A friend's invite waited for this: a failure here must not undo the confirmation.
	const { error: inviteError } = await db().rpc('referral_activate_if_ready', { p_user: user.id });
	if (inviteError) console.error('referral_activate_if_ready:', inviteError);
}

export interface WelcomeLesson {
	path: string;
	titleHtml: string;
	/** The title without formulas, for the handwriting on the notebook and for the search. */
	title: string;
	/** How many levels its exercises have. */
	levels: number;
	/** What each level adds, easiest first: the steps of the lesson's exercise path. */
	levelNames: string[];
}
export interface WelcomeChapter {
	titleHtml: string;
	lessons: WelcomeLesson[];
	/** The chapter's sticker (src/lib/zaino/stickers.ts), which the onboarding puts on the notebook's cover. */
	sticker: { url: string; w: number; h: number; cut: boolean } | null;
}

const stickerArt = (id: string | undefined) => {
	const def = STICKER_BY_ID.get(id ?? '');
	return def ? { url: stickerUrl(def), w: def.w, h: def.h, cut: !!def.cut } : null;
};

/** The sticker that goes on the notebook when the account is made: the teacher's "visto". */
export const welcomeStamp = () => stickerArt('visto');

/** The sticker of a subject whose chapters have none of their own yet. */
const SUBJECT_STICKER: Partial<Record<SubjectId, string>> = { physics: 'pendolo-semplice', chemistry: 'beuta-bolle', 'computer-science': 'graffe-codice' };

/** A subject's chapters by year. */
export type WelcomeSubjects = Record<SubjectId, Record<number, WelcomeChapter[]>>;

/**
 * High school by subject and year: chapters with the lessons that have exercises, which is where the onboarding
 * can send a student. A subject with nothing for a year is simply missing that year: the page shows it as on
 * its way.
 */
export async function welcomeTopics(): Promise<{ subjects: WelcomeSubjects; urls: Map<string, string>; ids: Map<string, string> }> {
	const subjects = Object.fromEntries(SUBJECTS.map((s) => [s.id, {}])) as WelcomeSubjects;
	const urls = new Map<string, string>();
	const ids = new Map<string, string>();
	const level = (await getContentTree()).find((node) => node.slug === 'high_school');
	for (const { id } of SUBJECTS) {
		const subject = level?.children.find((node) => node.slug === id);
		if (!level || !subject) continue;
		for (const chapter of subject.children) {
			if (!chapter.school_year) continue;
			const lessons: WelcomeLesson[] = [];
			for (const lesson of chapter.children) {
				const ancestors = [level, subject, chapter, lesson];
				const path = dbPath(ancestors);
				if (!configs[path]) continue;
				const { generator, levels } = configs[path];
				lessons.push({ path, titleHtml: titleHtml(lesson.title), title: plainTitle(lesson.title), levels: levels.length, levelNames: levels.map((n, i) => levelName(generator, n) ?? `Livello ${i + 1}`) });
				urls.set(path, subviewPath(ancestors, 'exercises'));
				ids.set(path, lesson.id);
			}
			if (!lessons.length) continue;
			const sticker = stickerArt(coverDefaults(dbPath([level, subject, chapter]))[0]?.sticker ?? SUBJECT_STICKER[id]);
			(subjects[id][chapter.school_year] ??= []).push({ titleHtml: titleHtml(chapter.title), lessons, sticker });
		}
	}
	return { subjects, urls, ids };
}

export interface WelcomeFigure {
	url: string;
	w: number;
	h: number;
	alt: string;
}

const DRAWING = new RegExp('```(?:tikz|' + CHEM_BLOCKS.join('|') + ')\\n([\\s\\S]*?)```', 'g');

/**
 * The first drawing of a lesson, for the page the onboarding's notebook opens on: null when the lesson is not one
 * the onboarding offers or has no published drawing. A very wide one would be a ribbon on that page, so one of a
 * calmer shape is taken first when there is one.
 */
export async function welcomeFigure(path: unknown): Promise<WelcomeFigure | null> {
	const id = typeof path === 'string' ? (await welcomeTopics()).ids.get(path) : undefined;
	if (!id) return null;
	const { theory } = await getTopicContent(id);
	const drawn = [...(theory ?? '').matchAll(DRAWING)].map((block) => parseFigure(block[1])).filter((figure) => figure.svg);
	const figure = drawn.find((f) => f.svg!.width <= f.svg!.height * 1.8) ?? drawn[0];
	if (!figure?.svg) return null;
	return { url: figureUrl(process.env.PUBLIC_SUPABASE_URL ?? '', figure.svg.file), w: figure.svg.width, h: figure.svg.height, alt: figure.alt ?? '' };
}

/**
 * Saves the answers of the welcome page and says where to go next: the exercises of the lesson the student
 * chose to start from, or the library. Body: `{ level?, year?, subjects?, topics?, start? }`, all of which may be
 * missing (the student skipped): `level` is the school (config.ts), `subjects` are the subjects chosen, `topics` a lesson for each of those that has one,
 * `start` the subject to begin with.
 */
export async function saveWelcome(user: User, body: Record<string, unknown>): Promise<string> {
	const { next, fields } = await welcomeAnswers(body);
	await updateProfile(user, fields);
	return next;
}

/** The answers in a request, checked against the tree: the columns to write and the page they lead to. */
async function welcomeAnswers(body: Record<string, unknown>): Promise<{ next: string; fields: Record<string, unknown>; answered: boolean }> {
	const level = isSchoolLevel(body.level) ? body.level : null;
	// Year, subjects and lessons are those of high school: another level keeps none of them.
	const school = level === null || level === 'high_school';
	const year = (school && SCHOOL_YEARS.find((y) => y === body.year)) || null;
	const { urls } = await welcomeTopics();
	const subjects = school && Array.isArray(body.subjects) ? SUBJECTS.map((s) => s.id).filter((id) => (body.subjects as unknown[]).includes(id)) : [];
	const given = body.topics && typeof body.topics === 'object' ? (body.topics as Record<string, unknown>) : {};
	const topics: Record<string, string> = {};
	// A lesson counts when it exists and belongs to the subject it is filed under.
	for (const id of subjects) {
		const path = given[id];
		if (typeof path === 'string' && urls.has(path) && path.startsWith(`high_school/${id}/`)) topics[id] = path;
	}
	const start = isSubject(body.start) && topics[body.start] ? body.start : subjects.find((id) => topics[id]);
	const topic = start ? topics[start] : null;
	return {
		next: topic ? urls.get(topic)! : year ? APP_LIBRARY : CONTENT_ROOT,
		fields: { school_level: level, school_year: year, subjects, topics, topic, onboarded_at: new Date().toISOString() },
		answered: 'level' in body || 'year' in body || 'subjects' in body
	};
}

/** "Come ci hai conosciuto?": one of the listed answers, kept once. */
export async function saveHeardFrom(user: User, answer: unknown): Promise<void> {
	if (!HEARD_FROM.some((option) => option.id === answer)) throw new OnboardingError(400, 'Risposta non valida.');
	await updateProfile(user, { heard_from: answer, heard_at: new Date().toISOString() });
}
