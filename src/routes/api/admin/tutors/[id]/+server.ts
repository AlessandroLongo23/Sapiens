import { json, type RequestHandler } from '@sveltejs/kit';
import { isStaff } from '$lib/auth/entitlements';
import { TutoringError, setTutorReview } from '$lib/server/tutoring-admin';

/** Staff publishes, suspends or verifies a tutor profile. */
export const POST: RequestHandler = async ({ request, locals, params }) => {
	if (!isStaff(locals.user)) return json({ error: 'Non autorizzato.' }, { status: 403 });
	const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
	try {
		const tutor = await setTutorReview(params.id ?? '', { status: body.status, verified: body.verified });
		return json({ tutor });
	} catch (err) {
		if (err instanceof TutoringError) return json({ error: err.message }, { status: err.status });
		console.error('tutor review failed:', err);
		return json({ error: 'Servizio non disponibile. Riprova più tardi.' }, { status: 503 });
	}
};
