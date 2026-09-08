'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/** Posts to a request endpoint, then refreshes the page's server data. */
export function useRequestAction() {
	const router = useRouter();
	const [busy, setBusy] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const run = async (id: string, url: string, body?: unknown) => {
		if (busy) return false;
		setBusy(id);
		setError(null);
		try {
			const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
			const payload = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(payload.error ?? 'Operazione non riuscita. Riprova.');
			router.refresh();
			return true;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Operazione non riuscita. Riprova.');
			return false;
		} finally {
			setBusy(null);
		}
	};
	return { busy, error, run };
}

/** "Are you sure?" inline, with the confirming button and a way back. */
export function Confirm({ question, confirmLabel, busy, onConfirm, onCancel, cancelLabel = 'Annulla' }: { question: string; confirmLabel: string; busy: boolean; onConfirm: () => void; onCancel: () => void; cancelLabel?: string }) {
	return (
		<>
			<span className="text-sm text-fg-muted">{question}</span>
			<Button variant="inverse" size="sm" loading={busy} onClick={onConfirm}>{confirmLabel}</Button>
			<Button variant="ghost" size="sm" onClick={onCancel}>{cancelLabel}</Button>
		</>
	);
}

/** Phone and email of the other side, once a request is accepted. */
export function ContactLines({ phone, email }: { phone: string | null; email: string | null }) {
	return (
		<dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
			{phone && (
				<div className="flex items-center gap-2">
					<Phone className="size-4 text-fg-faint" aria-hidden="true" />
					<dt className="sr-only">Telefono</dt>
					<dd><a href={`tel:${phone.replace(/\s/g, '')}`} className="text-accent-fg hover:underline">{phone}</a></dd>
				</div>
			)}
			{email && (
				<div className="flex items-center gap-2">
					<Mail className="size-4 text-fg-faint" aria-hidden="true" />
					<dt className="sr-only">Email</dt>
					<dd><a href={`mailto:${email}`} className="text-accent-fg hover:underline">{email}</a></dd>
				</div>
			)}
		</dl>
	);
}

/** The message as the student wrote it. */
export function Quote({ children, muted = false }: { children: string; muted?: boolean }) {
	return <blockquote className={`whitespace-pre-wrap rounded-xl border border-edge-soft bg-surface-2 px-4 py-3 text-sm ${muted ? 'text-fg-muted' : 'text-fg'}`}>{children}</blockquote>;
}
