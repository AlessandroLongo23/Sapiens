import { json, type RequestHandler } from '@sveltejs/kit';
import { TutoringError, getOwnTutor, parseProfileInput, saveOwnTutor } from '$lib/server/tutoring-admin';

/** The signed-in user's own tutor profile: read it, create it, update it. */

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) return json({ error: 'Accedi per continuare.' }, { status: 401 });
	try {
		return json({ tutor: await getOwnTutor(locals.user.id) });
	} catch (err) {
		if (err instanceof TutoringError) return json({ error: err.message }, { status: err.status });
		throw err;
	}
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	if (!user) return json({ error: 'Accedi per continuare.' }, { status: 401 });

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Richiesta non valida.' }, { status: 400 });
	}

	const input = parseProfileInput(body ?? {});
	if (typeof input === 'string') return json({ error: input }, { status: 400 });

	try {
		const tutor = await saveOwnTutor(user.id, input, user.email ?? null);
		return json({ tutor });
	} catch (err) {
		if (err instanceof TutoringError) return json({ error: err.message }, { status: err.status });
		console.error('profile save failed:', err);
		return json({ error: 'Servizio non disponibile. Riprova più tardi.' }, { status: 503 });
	}
};
