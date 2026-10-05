import { parseReview } from '@/lib/tutoring/agenda';
import { fail, isUuid, json, readJson } from '@/lib/server/http';
import { saveReview } from '@/lib/server/tutor-agenda';
import { withUser } from '@/lib/server/tutor-agenda-http';

/** The student's review of a tutor who follows them. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	if (!isUuid(id)) return fail('Tutor non trovato.', 404);
	const review = parseReview(await readJson(request));
	if (typeof review === 'string') return fail(review, 400);
	return withUser('review', async (user) => {
		await saveReview(user.id, id, review);
		return json({ ok: true });
	});
}
