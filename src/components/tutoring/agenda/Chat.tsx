'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { MAX_MESSAGE, longDay, romeParts, type AgendaMessage, type Side } from '@/lib/tutoring/agenda';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Field';
import { cn } from '@/lib/utils/cn';

/** How often an open conversation asks for new messages. */
const POLL_MS = 15_000;

/**
 * The conversation of a tutor and a student, as a page of its own: the messages fill the height left under the
 * header, the newest at the bottom, a rule with the day between one day and the next, the field to write in
 * fixed at the foot. New messages are asked for while the page is in view. `today` comes from the server.
 */
export function Chat({ linkId, side, initial, other, disabled, today }: { linkId: string; side: Side; initial: AgendaMessage[]; /** The other side's name. */ other: string; /** Why nothing can be written, when it cannot. */ disabled?: string; today: string }) {
	const [messages, setMessages] = useState(initial);
	const [draft, setDraft] = useState('');
	const [sending, setSending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const list = useRef<HTMLOListElement>(null);
	const url = `/api/tutoring/messages/${linkId}`;

	useEffect(() => {
		if (disabled) return;
		const load = async () => {
			if (document.visibilityState !== 'visible') return;
			try {
				const response = await fetch(`${url}${side === 'tutor' ? '?as=tutor' : ''}`);
				if (!response.ok) return;
				const payload = (await response.json()) as { messages: AgendaMessage[] };
				setMessages((current) => (payload.messages.length >= current.length ? payload.messages : current));
			} catch {
				// Offline for a moment: the next round asks again.
			}
		};
		const timer = setInterval(load, POLL_MS);
		return () => clearInterval(timer);
	}, [url, side, disabled]);

	useEffect(() => {
		list.current?.scrollTo({ top: list.current.scrollHeight });
	}, [messages.length]);

	const send = async (event: React.FormEvent) => {
		event.preventDefault();
		const body = draft.trim();
		if (!body || sending) return;
		setSending(true);
		setError(null);
		try {
			const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ as: side, body }) });
			const payload = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(payload.error ?? 'Messaggio non inviato. Riprova.');
			setMessages((current) => [...current, payload.message as AgendaMessage]);
			setDraft('');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Messaggio non inviato. Riprova.');
		} finally {
			setSending(false);
		}
	};

	return (
		<section aria-label={`Conversazione con ${other}`} className="flex h-[calc(100dvh-19rem)] min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper lg:h-[calc(100dvh-16rem)]">
			<ol ref={list} className="relative flex-1 bg-surface-2 space-y-2 overflow-y-auto px-4 py-5 sm:px-6" aria-label={`Messaggi con ${other}`} aria-live="polite">
				{messages.length === 0 && <li className="py-10 text-center text-sm text-fg-muted">{disabled ?? `Nessun messaggio. Scrivi a ${other} per accordarvi su orari e argomenti.`}</li>}
				{messages.map((m, i) => {
					const mine = m.sender === side;
					const { day, time } = romeParts(m.createdAt);
					// A rule with the day where the day changes.
					const rule = i === 0 || romeParts(messages[i - 1].createdAt).day !== day;
					return (
						<Fragment key={m.id}>
							{rule && (
								<li className="flex items-center gap-3 py-2" aria-hidden="true">
									<span className="h-px flex-1 bg-edge" />
									<span className="label-mono text-fg-subtle">{day === today ? 'oggi' : longDay(day)}</span>
									<span className="h-px flex-1 bg-edge" />
								</li>
							)}
							<li className={cn('relative flex', mine ? 'justify-end' : 'justify-start')}>
								<div className={cn('max-w-[min(85%,34rem)] px-4 py-2.5 text-[0.95rem] shadow-paper', mine ? 'rounded-2xl rounded-br-md bg-accent text-white' : 'rounded-2xl rounded-bl-md border border-edge bg-surface text-fg')}>
									<p className="sr-only">{mine ? 'Tu' : other}, {day === today ? 'oggi' : longDay(day)}</p>
									<p className="whitespace-pre-wrap break-words">{m.body}</p>
									<p className={cn('mt-1 text-xs tabular-nums', mine ? 'opacity-80' : 'text-fg-subtle')}>{time}</p>
								</div>
							</li>
						</Fragment>
					);
				})}
			</ol>
			{error && <Alert tone="error" className="mx-3 mb-2">{error}</Alert>}
			{disabled ? (
				messages.length > 0 && <p className="border-t border-edge px-5 py-3.5 text-sm text-fg-subtle">{disabled}</p>
			) : (
				<form onSubmit={send} className="flex items-end gap-2 border-t border-edge bg-surface p-3">
					<Textarea
						aria-label={`Messaggio per ${other}`}
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						onKeyDown={(e) => {
							// With a keyboard Enter sends and Shift+Enter breaks the line; on a touch keyboard Enter is the only way to a new line.
							if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && window.matchMedia('(pointer: fine)').matches) send(e);
						}}
						rows={1}
						maxLength={MAX_MESSAGE}
						placeholder={`Scrivi a ${other}`}
						className="max-h-40 min-h-[44px] resize-none [field-sizing:content]"
					/>
					<Button type="submit" size="icon" aria-label="Invia" loading={sending} disabled={!draft.trim()}>
						{!sending && <Send className="size-4" aria-hidden="true" />}
					</Button>
				</form>
			)}
		</section>
	);
}
