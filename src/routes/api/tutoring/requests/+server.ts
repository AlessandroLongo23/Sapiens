import { json, type RequestHandler } from '@sveltejs/kit';
import { TUTOR_LEVELS, TUTOR_MODES, TUTOR_SUBJECTS } from '$lib/tutoring/config';
import { TutoringError, adminClient, getTutorById, userEmail, validEmail, validPhone, type RequestRow } from '$lib/server/tutoring-admin';
import { mailRequestReceived } from '$lib/server/tutoring-mail';

/**
 * A signed-in student asks to be put in touch with a tutor. The row is written
 * with the student's own client (row level security checks the owner); the
 * service role only reads the tutor's private columns and notifies them. The
 * tutor's email carries the message, never the contact details: those are
 * revealed when the tutor accepts.
 */

const MAX_PENDING = 3;
const MIN_MESSAGE = 20;
const MAX_MESSAGE = 1500;

const SUBJECT_IDS = new Set(TUTOR_SUBJECTS.map((s) => s.id));
const LEVEL_IDS = new Set<string>(TUTOR_LEVELS.map((l) => l.id));
const MODE_IDS = new Set<string>(TUTOR_MODES.map((m) => m.id));
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Payload {
	tutorId: string;
	subject: string;
	level: string;
	mode: string;
	requester: 'student' | 'parent';
	contactName: string;
	contactPhone: string;
	contactEmail: string | null;
	message: string;
}

function str(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

/** Returns the clean payload, or the message to show the visitor. */
function parse(body: Record<string, unknown>): Payload | string {
	const tutorId = str(body.tutorId);
	if (!UUID.test(tutorId)) return 'Tutor non valido.';

	const subject = str(body.subject);
	const level = str(body.level);
	const mode = str(body.mode);
	if (!SUBJECT_IDS.has(subject) || !LEVEL_IDS.has(level) || !MODE_IDS.has(mode)) return 'Scegli materia, livello e modalità.';

	const requester = str(body.requester) === 'parent' ? 'parent' : 'student';

	const contactName = str(body.contactName);
	if (contactName.length < 2 || contactName.length > 80) return 'Inserisci il nome di chi verrà contattato.';

	const contactPhone = str(body.contactPhone);
	if (!validPhone(contactPhone)) return 'Inserisci un numero di telefono valido.';

	const rawEmail = str(body.contactEmail);
	if (rawEmail && !validEmail(rawEmail)) return "L'indirizzo email non sembra valido.";

	const message = str(body.message);
	if (message.length < MIN_MESSAGE) return `Racconta al tutor di cosa hai bisogno (almeno ${MIN_MESSAGE} caratteri).`;
	if (message.length > MAX_MESSAGE) return `Il messaggio può avere al massimo ${MAX_MESSAGE} caratteri.`;

	if (body.consent !== true) return 'Per inviare la richiesta devi acconsentire alla comunicazione dei contatti al tutor.';

	return { tutorId, subject, level, mode, requester, contactName, contactPhone, contactEmail: rawEmail || null, message };
}

export const POST: RequestHandler = async ({ request, locals, url }) => {
	const user = locals.user;
	if (!user) return json({ error: 'Accedi per inviare una richiesta.' }, { status: 401 });

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Richiesta non valida.' }, { status: 400 });
	}

	const parsed = parse(body ?? {});
	if (typeof parsed === 'string') return json({ error: parsed }, { status: 400 });

	try {
		const tutor = await getTutorById(parsed.tutorId);
		if (!tutor || tutor.status !== 'published') return json({ error: 'Questo tutor non è disponibile.' }, { status: 404 });
		if (tutor.user_id === user.id) return json({ error: 'Non puoi inviare una richiesta a te stesso.' }, { status: 400 });
		if (!tutor.subjects.includes(parsed.subject) || !tutor.levels.includes(parsed.level as never) || !tutor.modes.includes(parsed.mode as never)) {
			return json({ error: 'Il tutor non offre questa combinazione di materia, livello e modalità.' }, { status: 400 });
		}

		// Own pending requests, through the student's client (RLS: own rows only).
		const { count: pending, error: countError } = await locals.supabase
			.from('tutor_requests')
			.select('id', { count: 'exact', head: true })
			.eq('student_id', user.id)
			.eq('status', 'pending');
		if (countError) {
			console.error('pending count failed:', countError.message);
			return json({ error: 'Servizio non disponibile. Riprova più tardi.' }, { status: 503 });
		}
		if ((pending ?? 0) >= MAX_PENDING) {
			return json(
				{ error: `Hai già ${MAX_PENDING} richieste in attesa di risposta. Aspetta che un tutor risponda prima di inviarne altre.` },
				{ status: 429 }
			);
		}

		const { data: created, error: insertError } = await locals.supabase
			.from('tutor_requests')
			.insert({
				tutor_id: tutor.id,
				student_id: user.id,
				subject: parsed.subject,
				level: parsed.level,
				mode: parsed.mode,
				requester: parsed.requester,
				contact_name: parsed.contactName,
				contact_phone: parsed.contactPhone,
				contact_email: parsed.contactEmail,
				message: parsed.message
			})
			.select('id,tutor_id,student_id,subject,level,mode,requester,contact_name,contact_phone,contact_email,message,status,created_at,expires_at,responded_at')
			.single();

		if (insertError) {
			if (insertError.code === '23505') {
				return json({ error: 'Hai già una richiesta in attesa con questo tutor.' }, { status: 409 });
			}
			console.error('tutor_requests insert failed:', insertError.message);
			return json({ error: 'Invio non riuscito. Riprova tra qualche minuto.' }, { status: 500 });
		}

		const to = tutor.contact_email ?? (await userEmail(tutor.user_id));
		await mailRequestReceived(to, tutor.first_name, created as RequestRow, url.origin);

		return json({ id: created.id }, { status: 201 });
	} catch (err) {
		if (err instanceof TutoringError) return json({ error: err.message }, { status: err.status });
		console.error('request creation failed:', err);
		return json({ error: 'Servizio non disponibile. Riprova più tardi.' }, { status: 503 });
	}
};

// Keeps the admin client warm for the module (and documents the dependency).
void adminClient;
