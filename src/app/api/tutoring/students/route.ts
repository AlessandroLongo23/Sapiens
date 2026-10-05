import { parseLinkInput } from '@/lib/tutoring/agenda';
import { fail, json, readJson } from '@/lib/server/http';
import { SUBJECT_IDS, createInvite } from '@/lib/server/tutor-agenda';
import { withTutor } from '@/lib/server/tutor-agenda-http';

/** The tutor adds a student: a link with an invite the student accepts from their account. */
export async function POST(request: Request) {
	const input = parseLinkInput(await readJson(request), SUBJECT_IDS);
	if (typeof input === 'string') return fail(input, 400);
	return withTutor('student invite', async (tutor) => json({ link: await createInvite(tutor.id, input) }, 201));
}
