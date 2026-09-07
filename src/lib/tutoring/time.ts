/** Small date helpers for the request lists, in Italian. */

const dateTime = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

export function formatDateTime(iso: string): string {
	const d = new Date(iso);
	return Number.isNaN(d.getTime()) ? '' : dateTime.format(d);
}

/** "scade tra 5 ore", "scade tra 20 minuti", or "scaduta". */
export function timeLeft(expiresAt: string, now: number = Date.now()): { expired: boolean; label: string } {
	const ms = new Date(expiresAt).getTime() - now;
	if (!Number.isFinite(ms) || ms <= 0) return { expired: true, label: 'scaduta' };
	const minutes = Math.round(ms / 60_000);
	if (minutes < 60) return { expired: false, label: `scade tra ${minutes} ${minutes === 1 ? 'minuto' : 'minuti'}` };
	const hours = Math.round(minutes / 60);
	if (hours < 72) return { expired: false, label: `scade tra ${hours} ${hours === 1 ? 'ora' : 'ore'}` };
	const days = Math.round(hours / 24);
	return { expired: false, label: `scade tra ${days} giorni` };
}
