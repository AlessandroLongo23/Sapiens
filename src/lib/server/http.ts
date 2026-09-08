/** A JSON response. */
export const json = (body: unknown, status = 200) => Response.json(body, { status });

/** A JSON error body under the site's convention: `{ error }`. */
export const fail = (error: string, status: number) => json({ error }, status);

/** An error a service raised on purpose, carrying the status to answer with (TutoringError, ZainoError). */
const isStatusError = (err: unknown): err is Error & { status: number } =>
	err instanceof Error && Number.isInteger((err as { status?: unknown }).status);

/** Runs a handler; an error carrying a status becomes that status, anything else a 503 after logging. */
export async function guarded(context: string, run: () => Promise<Response>): Promise<Response> {
	try {
		return await run();
	} catch (err) {
		if (isStatusError(err)) return fail(err.message, err.status);
		console.error(`${context}:`, err);
		return fail('Servizio non disponibile. Riprova più tardi.', 503);
	}
}

/** The request body as an object, or `{}` when it is not a JSON object (`null`, arrays and scalars included). */
export async function readJson(request: Request): Promise<Record<string, unknown>> {
	const body: unknown = await request.json().catch(() => null);
	return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const isUuid = (value: unknown): value is string => typeof value === 'string' && UUID.test(value);
