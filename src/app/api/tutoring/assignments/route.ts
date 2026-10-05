import { parseAssignmentInput } from '@/lib/tutoring/agenda';
import { fail, isUuid, json, readJson } from '@/lib/server/http';
import { createAssignment } from '@/lib/server/tutor-agenda';
import { withTutor } from '@/lib/server/tutor-agenda-http';

/** The tutor assigns the exercises of a lesson, to do by a day: it lands in the student's diary. */
export async function POST(request: Request) {
	const body = await readJson(request);
	if (!isUuid(body.linkId)) return fail('Richiesta non valida.', 400);
	const linkId = body.linkId;
	const input = parseAssignmentInput(body);
	if (typeof input === 'string') return fail(input, 400);
	return withTutor('assignment create', async (tutor, user) => {
		await createAssignment(tutor, user.id, linkId, input);
		return json({ ok: true }, 201);
	});
}
