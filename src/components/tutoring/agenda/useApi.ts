'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Calls an endpoint of the agenda, then refreshes the page's server data. `busy` is the key of the call in flight. */
export function useApi() {
	const router = useRouter();
	const [busy, setBusy] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const call = async <T = Record<string, unknown>>(key: string, url: string, method: 'POST' | 'PATCH' | 'PUT' | 'DELETE', body?: unknown): Promise<T | null> => {
		if (busy) return null;
		setBusy(key);
		setError(null);
		try {
			const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
			const payload = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(payload.error ?? 'Operazione non riuscita. Riprova.');
			router.refresh();
			return payload as T;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Operazione non riuscita. Riprova.');
			return null;
		} finally {
			setBusy(null);
		}
	};
	return { busy, error, call, clearError: () => setError(null) };
}
