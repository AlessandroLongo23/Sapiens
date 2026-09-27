import { getSession } from '@/lib/server/auth';
import { createEntry, diaryTopics } from '@/lib/server/diary';
import { parseEntryInput } from '@/lib/diary/entries';
import { MATERIAL_SUBJECT } from '@/lib/diary/subjects';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** A new entry written by the student. A topic is kept only if it is a real chapter or lesson with exercises. */
export async function POST(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const input = parseEntryInput(await readJson(request));
	if (typeof input === 'string') return fail(input, 400);
	return guarded('diary entry create', async () => {
		const topics = await diaryTopics();
		const topic = input.topic && (input.subject ?? MATERIAL_SUBJECT) === MATERIAL_SUBJECT && topics.some((t) => t.path === input.topic) ? input.topic : null;
		const entry = await createEntry(supabase, user.id, { day: input.day!, kind: input.kind!, subject: input.subject ?? null, text: input.text!, topic });
		return json({ entry }, 201);
	});
}
