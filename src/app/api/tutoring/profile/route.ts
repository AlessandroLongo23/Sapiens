import { currentUser } from '@/lib/server/auth';
import { getOwnTutor, parseProfileInput, saveOwnTutor } from '@/lib/server/tutoring-admin';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** The signed-in user's own tutor profile: read it, create it, update it. */
export async function GET() {
	const user = await currentUser();
	if (!user) return fail('Accedi per continuare.', 401);
	return guarded('profile read', async () => json({ tutor: await getOwnTutor(user.id) }));
}

export async function PUT(request: Request) {
	const user = await currentUser();
	if (!user) return fail('Accedi per continuare.', 401);
	const input = parseProfileInput(await readJson(request));
	if (typeof input === 'string') return fail(input, 400);
	return guarded('profile save', async () => json({ tutor: await saveOwnTutor(user.id, input, user.email ?? null) }));
}
