import { lessonWhen, parseLessonInput } from '@/lib/tutoring/agenda';
import { fail, isUuid, json, readJson } from '@/lib/server/http';
import { SUBJECT_IDS, createTutorLessons, proposeLesson } from '@/lib/server/tutor-agenda';
import { withTutor, withUser } from '@/lib/server/tutor-agenda-http';
import { userEmail } from '@/lib/server/tutoring-admin';
import { mailAgenda } from '@/lib/server/tutoring-mail';

/**
 * A new lesson. From the tutor (`as: 'tutor'`) it is confirmed at once, and can repeat weekly until the month
 * ends; from the student it is a proposal the tutor answers.
 */
export async function POST(request: Request) {
	const body = await readJson(request);
	if (!isUuid(body.linkId)) return fail('Richiesta non valida.', 400);
	const linkId = body.linkId;
	const input = parseLessonInput(body, SUBJECT_IDS);
	if (typeof input === 'string') return fail(input, 400);
	if (body.as === 'tutor') return withTutor('lesson create', async (tutor) => json({ created: await createTutorLessons(tutor, linkId, input) }, 201));
	const origin = new URL(request.url).origin;
	return withUser('lesson proposal', async (user) => {
		const { tutor, lesson } = await proposeLesson(user.id, linkId, { ...input, repeat: false, hourlyRate: null });
		await mailAgenda(tutor.contact_email ?? (await userEmail(tutor.user_id)), `${lesson.with} ti chiede una lezione`, `Ciao ${tutor.first_name}, una proposta di lezione`, `${lesson.with} propone ${lessonWhen(lesson)}. Accetta o rifiuta dal tuo calendario.`, { href: `${origin}/calendario`, label: 'Apri il calendario' });
		return json({ lesson }, 201);
	});
}
