import { json, type RequestHandler } from '@sveltejs/kit';
import { TutoringError, getOwnTutor, respondToRequest, userEmail } from '$lib/server/tutoring-admin';
import { mailRequestAcceptedToStudent, mailRequestAcceptedToTutor, mailRequestDeclined } from '$lib/server/tutoring-mail';

/**
 * The tutor answers a pending request. On acceptance both sides receive the
 * other's contacts (this is the moment the introduction fee will apply, see
 * MARKETPLACE.md); on refusal the student is told without a reason.
 */
export const POST: RequestHandler = async ({ request, locals, params, url }) => {
	const user = locals.user;
	if (!user) return json({ error: 'Accedi per continuare.' }, { status: 401 });

	const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
	const action = body.action === 'accept' ? 'accept' : body.action === 'decline' ? 'decline' : null;
	if (!action) return json({ error: 'Azione non valida.' }, { status: 400 });

	try {
		const tutor = await getOwnTutor(user.id);
		if (!tutor) return json({ error: 'Non hai un profilo tutor.' }, { status: 403 });

		const row = await respondToRequest(tutor.id, params.id ?? '', action);
		const tutorEmail = tutor.contact_email ?? user.email ?? null;
		const studentEmail = row.contact_email ?? (await userEmail(row.student_id));

		if (action === 'accept') {
			await Promise.all([
				mailRequestAcceptedToStudent(studentEmail, tutor, row, url.origin),
				mailRequestAcceptedToTutor(tutorEmail, tutor.first_name, row, url.origin)
			]);
		} else {
			await mailRequestDeclined(studentEmail, tutor.first_name, row, url.origin);
		}

		return json({ status: row.status });
	} catch (err) {
		if (err instanceof TutoringError) return json({ error: err.message }, { status: err.status });
		console.error('request response failed:', err);
		return json({ error: 'Servizio non disponibile. Riprova più tardi.' }, { status: 503 });
	}
};
