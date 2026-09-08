import { TUTOR_LEVELS, TUTOR_MODES, TUTOR_SUBJECTS } from '@/lib/tutoring/config';
import { getSession } from '@/lib/server/auth';
import { getTutorById, userEmail, validEmail, validPhone, type RequestRow } from '@/lib/server/tutoring-admin';
import { mailRequestReceived } from '@/lib/server/tutoring-mail';
import { fail, guarded, json, readJson } from '@/lib/server/http';

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
const COLUMNS = 'id,tutor_id,student_id,subject,level,mode,requester,contact_name,contact_phone,contact_email,message,status,created_at,expires_at,responded_at';

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Returns the clean payload, or the message to show the visitor. */
function parse(body: Record<string, unknown>) {
	const tutorId = str(body.tutorId);
	if (!UUID.test(tutorId)) return 'Tutor non valido.';
	const subject = str(body.subject);
	const level = str(body.level);
	const mode = str(body.mode);
	if (!SUBJECT_IDS.has(subject) || !LEVEL_IDS.has(level) || !MODE_IDS.has(mode)) return 'Scegli materia, livello e modalità.';
	const contactName = str(body.contactName);
	if (contactName.length < 2 || contactName.length > 80) return 'Inserisci il nome di chi verrà contattato.';
	const contactPhone = str(body.contactPhone);
	if (!validPhone(contactPhone)) return 'Inserisci un numero di telefono valido.';
	const contactEmail = str(body.contactEmail);
	if (contactEmail && !validEmail(contactEmail)) return "L'indirizzo email non sembra valido.";
	const message = str(body.message);
	if (message.length < MIN_MESSAGE) return `Racconta al tutor di cosa hai bisogno (almeno ${MIN_MESSAGE} caratteri).`;
	if (message.length > MAX_MESSAGE) return `Il messaggio può avere al massimo ${MAX_MESSAGE} caratteri.`;
	if (body.consent !== true) return 'Per inviare la richiesta devi acconsentire alla comunicazione dei contatti al tutor.';
	return { tutorId, subject, level, mode, requester: str(body.requester) === 'parent' ? 'parent' : 'student', contactName, contactPhone, contactEmail: contactEmail || null, message };
}

export async function POST(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per inviare una richiesta.', 401);
	const parsed = parse(await readJson(request));
	if (typeof parsed === 'string') return fail(parsed, 400);

	return guarded('request creation', async () => {
		const tutor = await getTutorById(parsed.tutorId);
		if (!tutor || tutor.status !== 'published') return fail('Questo tutor non è disponibile.', 404);
		if (tutor.user_id === user.id) return fail('Non puoi inviare una richiesta a te stesso.', 400);
		if (!tutor.subjects.includes(parsed.subject) || !tutor.levels.includes(parsed.level as never) || !tutor.modes.includes(parsed.mode as never)) {
			return fail('Il tutor non offre questa combinazione di materia, livello e modalità.', 400);
		}

		// Own pending requests, through the student's client (RLS: own rows only).
		const { count, error: countError } = await supabase.from('tutor_requests').select('id', { count: 'exact', head: true }).eq('student_id', user.id).eq('status', 'pending');
		if (countError) {
			console.error('pending count failed:', countError.message);
			return fail('Servizio non disponibile. Riprova più tardi.', 503);
		}
		if ((count ?? 0) >= MAX_PENDING) return fail(`Hai già ${MAX_PENDING} richieste in attesa di risposta. Aspetta che un tutor risponda prima di inviarne altre.`, 429);

		const { data: created, error } = await supabase
			.from('tutor_requests')
			.insert({ tutor_id: tutor.id, student_id: user.id, subject: parsed.subject, level: parsed.level, mode: parsed.mode, requester: parsed.requester, contact_name: parsed.contactName, contact_phone: parsed.contactPhone, contact_email: parsed.contactEmail, message: parsed.message })
			.select(COLUMNS)
			.single();
		if (error) {
			if (error.code === '23505') return fail('Hai già una richiesta in attesa con questo tutor.', 409);
			console.error('tutor_requests insert failed:', error.message);
			return fail('Invio non riuscito. Riprova tra qualche minuto.', 500);
		}

		const to = tutor.contact_email ?? (await userEmail(tutor.user_id));
		await mailRequestReceived(to, tutor.first_name, created as RequestRow, new URL(request.url).origin);
		return json({ id: created.id }, 201);
	});
}
