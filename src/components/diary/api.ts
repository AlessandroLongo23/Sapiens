/** A JSON call to the diary's API; the server's `{ error }` becomes the thrown message. */
export async function send<T>(method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', url: string, body?: unknown, keepalive = false): Promise<T> {
	const res = await fetch(url, {
		method,
		headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
		body: body === undefined ? undefined : JSON.stringify(body),
		cache: 'no-store',
		keepalive
	});
	const data = (await res.json().catch(() => ({}))) as T & { error?: string };
	if (!res.ok) throw new Error(data.error ?? 'Non è stato salvato. Riprova.');
	return data;
}
