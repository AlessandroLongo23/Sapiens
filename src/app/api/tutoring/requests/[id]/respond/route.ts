import { currentUser } from '@/lib/server/auth';
import { getOwnTutor, respondToRequest, userEmail } from '@/lib/server/tutoring-admin';
import { mailRequestAcceptedToStudent, mailRequestAcceptedToTutor, mailRequestDeclined } from '@/lib/server/tutoring-mail';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

/**
 * The tutor answers a pending request. On acceptance both sides receive the
 * other's contacts (this is the moment the introduction fee will apply, see
 * MARKETPLACE.md); on refusal the student is told without a reason.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const user = await currentUser();
	if (!user) return fail('Accedi per continuare.', 401);
	const body = await readJson(request);
	const action = body.action === 'accept' ? 'accept' : body.action === 'decline' ? 'decline' : null;
	if (!action) return fail('Azione non valida.', 400);
	const { id } = await params;
	if (!isUuid(id)) return fail('Richiesta non trovata.', 404);
	const origin = new URL(request.url).origin;

	return guarded('request response', async () => {
		const tutor = await getOwnTutor(user.id);
		if (!tutor) return fail('Non hai un profilo tutor.', 403);
		const row = await respondToRequest(tutor.id, id, action);
		const tutorEmail = tutor.contact_email ?? user.email ?? null;
		const studentEmail = row.contact_email ?? (await userEmail(row.student_id));
		if (action === 'accept') {
			await Promise.all([mailRequestAcceptedToStudent(studentEmail, tutor, row, origin), mailRequestAcceptedToTutor(tutorEmail, tutor.first_name, row, origin)]);
		} else {
			await mailRequestDeclined(studentEmail, tutor.first_name, row, origin);
		}
		return json({ status: row.status });
	});
}
