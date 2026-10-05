import { parseSlots } from '@/lib/tutoring/agenda';
import { fail, json, readJson } from '@/lib/server/http';
import { setAvailability } from '@/lib/server/tutor-agenda';
import { withTutor } from '@/lib/server/tutor-agenda-http';

/** The tutor's free hours of the week, replaced as a whole. */
export async function PUT(request: Request) {
	const slots = parseSlots((await readJson(request)).slots);
	if (typeof slots === 'string') return fail(slots, 400);
	return withTutor('availability save', async (tutor) => {
		await setAvailability(tutor, slots);
		return json({ slots });
	});
}
