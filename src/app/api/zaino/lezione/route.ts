import { getSession } from '@/lib/server/auth';
import { noteForLesson, notesForLesson, parseLessonLink } from '@/lib/server/zaino';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** The notes already taken on one lesson, for the button's badge. */
export async function GET(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return json({ notes: [] });
	const path = new URL(request.url).searchParams.get('path') ?? '';
	if (!path.startsWith('/materiale/')) return json({ notes: [] });
	return guarded('lesson notes', async () => json({ notes: await notesForLesson(supabase, user.id, path) }));
}

/**
 * Opens the note for a lesson: the one already started on it, or a new one
 * seeded with the lesson's title. Answers 402 when a free plan is full.
 */
export async function POST(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const lesson = parseLessonLink(await readJson(request));
	if (typeof lesson === 'string') return fail(lesson, 400);
	return guarded('lesson note', async () => json({ note: await noteForLesson(supabase, user, lesson) }));
}
