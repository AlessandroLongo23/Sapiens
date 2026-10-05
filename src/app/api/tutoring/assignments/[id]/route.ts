import { fail, isUuid, json } from '@/lib/server/http';
import { cancelAssignment } from '@/lib/server/tutor-agenda';
import { withTutor } from '@/lib/server/tutor-agenda-http';

/** The tutor withdraws an assignment: it leaves the student's diary too. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	if (!isUuid(id)) return fail('Compito non trovato.', 404);
	return withTutor('assignment cancel', async (tutor) => {
		await cancelAssignment(tutor.id, id);
		return json({ ok: true });
	});
}
