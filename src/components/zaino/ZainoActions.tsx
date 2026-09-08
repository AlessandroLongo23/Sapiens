'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type ZainoMethod = 'POST' | 'PATCH' | 'DELETE';

/**
 * Calls a backpack endpoint, then refreshes the page's server data — the
 * sibling of useRequestAction in ../tutoring/RequestActions. The one addition
 * is `blocked`: a 402 is the free-plan ceiling, and the page answers it with
 * the paywall rather than with an error line.
 */
export function useZainoAction() {
	const router = useRouter();
	const [busy, setBusy] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [blocked, setBlocked] = useState<string | null>(null);

	const run = async (id: string, url: string, method: ZainoMethod = 'POST', body?: unknown): Promise<Record<string, unknown> | null> => {
		if (busy) return null;
		setBusy(id);
		setError(null);
		try {
			const response = await fetch(url, {
				method,
				headers: body ? { 'Content-Type': 'application/json' } : undefined,
				body: body ? JSON.stringify(body) : undefined
			});
			const payload = await response.json().catch(() => ({}));
			if (response.status === 402) {
				setBlocked(typeof payload.error === 'string' ? payload.error : 'Hai raggiunto il limite del piano gratuito.');
				return null;
			}
			if (!response.ok) throw new Error(payload.error ?? 'Operazione non riuscita. Riprova.');
			router.refresh();
			return payload as Record<string, unknown>;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Operazione non riuscita. Riprova.');
			return null;
		} finally {
			setBusy(null);
		}
	};

	return { busy, error, blocked, clearBlocked: () => setBlocked(null), run };
}
