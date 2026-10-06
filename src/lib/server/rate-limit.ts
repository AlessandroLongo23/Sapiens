/**
 * A request limit by caller, kept in the memory of the server instance: enough to stop one script hammering a
 * public route, not a guarantee, because every instance counts on its own and forgets when it is recycled. A hard
 * limit belongs to the platform's firewall.
 */
const hits = new Map<string, number[]>();
/** Above this many callers the oldest are dropped, so the map cannot grow without bound. */
const MAX_CALLERS = 5000;

/** The caller's address as the platform reports it; `x-forwarded-for` lists the client first. */
export function callerOf(request: Request): string {
	return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

/** Counts a request of `key` and says whether it is within `limit` requests every `windowMs`. */
export function withinLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
	const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
	if (recent.length >= limit) {
		hits.set(key, recent);
		return false;
	}
	recent.push(now);
	hits.delete(key);
	hits.set(key, recent);
	if (hits.size > MAX_CALLERS) for (const old of hits.keys()) {
		if (hits.size <= MAX_CALLERS) break;
		hits.delete(old);
	}
	return true;
}
