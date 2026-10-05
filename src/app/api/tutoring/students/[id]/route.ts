import { MAX_NOTES, parseLinkInput } from '@/lib/tutoring/agenda';
import { fail, isUuid, json, readJson } from '@/lib/server/http';
import { SUBJECT_IDS, endLink, updateTutorLink } from '@/lib/server/tutor-agenda';
import { withTutor } from '@/lib/server/tutor-agenda-http';

type Params = { params: Promise<{ id: string }> };

/** The tutor changes a student's card (name, subject, level) or their own notes on them. */
export async function PATCH(request: Request, { params }: Params) {
	const { id } = await params;
	if (!isUuid(id)) return fail('Studente non trovato.', 404);
	const body = await readJson(request);
	if (typeof body.notes === 'string') {
		const notes = body.notes;
		if (notes.length > MAX_NOTES) return fail(`Al massimo ${MAX_NOTES} caratteri.`, 400);
		return withTutor('student notes', async (tutor) => json({ link: await updateTutorLink(tutor.id, id, { notes }) }));
	}
	const input = parseLinkInput(body, SUBJECT_IDS);
	if (typeof input === 'string') return fail(input, 400);
	return withTutor('student update', async (tutor) => json({ link: await updateTutorLink(tutor.id, id, input) }));
}

/** The tutor stops following a student. */
export async function DELETE(_request: Request, { params }: Params) {
	const { id } = await params;
	if (!isUuid(id)) return fail('Studente non trovato.', 404);
	return withTutor('student end', async (tutor) => {
		await endLink({ tutorId: tutor.id }, id);
		return json({ ok: true });
	});
}
