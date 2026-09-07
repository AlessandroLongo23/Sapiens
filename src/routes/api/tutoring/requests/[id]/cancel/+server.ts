import { json, type RequestHandler } from '@sveltejs/kit';
import { TutoringError, cancelRequest } from '$lib/server/tutoring-admin';

/** The student withdraws a request the tutor has not answered yet. */
export const POST: RequestHandler = async ({ locals, params }) => {
	const user = locals.user;
	if (!user) return json({ error: 'Accedi per continuare.' }, { status: 401 });
	try {
		await cancelRequest(user.id, params.id ?? '');
		return json({ status: 'cancelled' });
	} catch (err) {
		if (err instanceof TutoringError) return json({ error: err.message }, { status: err.status });
		console.error('request cancel failed:', err);
		return json({ error: 'Servizio non disponibile. Riprova più tardi.' }, { status: 503 });
	}
};
