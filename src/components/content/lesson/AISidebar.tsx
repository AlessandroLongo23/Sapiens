'use client';

import { useEffect, useEffectEvent, useRef, useState, type KeyboardEvent } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, Loader2, MessageSquare, Send, Sparkles, Trash2, X } from 'lucide-react';
import { useAISidebar } from '@/lib/state/ai-sidebar';
import { useAuth } from '@/lib/state/auth';
import { useCoarsePointer } from '@/lib/hooks/use-media';
import { hasFeature } from '@/lib/auth/entitlements';
import { Features } from '@/lib/stripe/config';
import { cn } from '@/lib/utils/cn';
import { Paywall } from '@/components/subscription/Paywall';
import { ChatMessage } from './ChatMessage';

const SUGGESTIONS = [
	{ label: 'Semplifica', text: 'Puoi spiegarmi questo concetto in modo più semplice?' },
	{ label: 'Esempio', text: 'Puoi farmi un esempio pratico?' },
	{ label: 'Approfondisci', text: 'Perché questo è importante?' }
];

const iconButton = 'flex items-center justify-center rounded-lg text-fg-faint transition-colors hover:bg-surface-3 hover:text-fg-muted active:bg-surface-3 focus-ring';

/**
 * The study assistant. Beside the lesson on wide screens; inside a bottom
 * sheet on phones, where `onClose` adds the close button and the panel
 * fills the sheet. The chat is part of the paid plans: the server decides
 * for real (/api/chat answers 401/403); this only chooses what to show.
 */
export function AISidebar({ onClose }: { onClose?: () => void }) {
	const pathname = usePathname();
	const { messages, isLoading, isOpen, pendingPrompt, inputValue, addUserMessage, addAssistantMessage, appendToLastMessage, finishStreaming, clearPendingPrompt, clearMessages, setInput, setLoading } = useAISidebar();
	const { user, ready } = useAuth();
	const coarse = useCoarsePointer();
	const [refused, setRefused] = useState(false);
	const locked = refused || !hasFeature(user, Features.AI_CHAT);
	const chat = useRef<HTMLDivElement>(null);
	const input = useRef<HTMLTextAreaElement>(null);
	const inSheet = !!onClose;

	const resize = () => {
		const el = input.current;
		if (!el) return;
		el.style.height = 'auto';
		el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
	};

	useEffect(() => {
		if (chat.current) chat.current.scrollTop = chat.current.scrollHeight;
	}, [messages]);

	// Focus the input when the panel opens, unless a prompt is about to be sent. On phones the focus waits for the sheet to finish sliding in.
	useEffect(() => {
		if (!isOpen || locked || pendingPrompt) return;
		const t = setTimeout(() => input.current?.focus({ preventScroll: true }), coarse ? 320 : 0);
		return () => clearTimeout(t);
	}, [isOpen, locked, pendingPrompt, coarse]);

	const send = async (content?: string, display?: string) => {
		const text = content || inputValue.trim();
		if (!text || isLoading) return;
		setInput('');
		resize();
		const shown = display || text;
		addUserMessage(shown);
		addAssistantMessage();
		setLoading(true);
		try {
			// The API gets the real prompt; the transcript shows the short form.
			const history = useAISidebar.getState().messages.slice(0, -1).map((m) => ({ role: m.role, content: m.role === 'user' && m.content === shown ? text : m.content }));
			const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) });
			if (response.status === 401 || response.status === 403) {
				setRefused(true);
				clearMessages();
				return;
			}
			if (!response.ok || !response.body) throw new Error('Errore nella risposta del server');
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				// Streaming decode: a multi-byte character split across two chunks is kept whole.
				appendToLastMessage(decoder.decode(value, { stream: true }));
			}
			finishStreaming();
		} catch (err) {
			console.error(err);
			finishStreaming('Mi dispiace, si è verificato un errore. Riprova più tardi.');
		} finally {
			setLoading(false);
		}
	};

	// A prompt chosen from a text selection is sent on its own.
	const sendPending = useEffectEvent((pending: NonNullable<typeof pendingPrompt>) => {
		const { prompt, selectedText } = pending;
		clearPendingPrompt();
		const preview = `${selectedText.slice(0, 50)}${selectedText.length > 50 ? '...' : ''}`;
		send(`${prompt.prompt}\n\n${selectedText}`, `${prompt.label}: "${preview}"`);
	});
	useEffect(() => {
		// The state updates that follow come from the network response, not from this effect.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (pendingPrompt) sendPending(pendingPrompt);
	}, [pendingPrompt]);

	// Enter sends with a keyboard; on a phone Enter adds a line and the button sends, as in every messaging app.
	const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey && !coarse) {
			e.preventDefault();
			send();
		}
	};

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col overflow-hidden bg-surface-2', inSheet ? 'h-full' : 'rounded-2xl border border-edge')}>
			<div className="flex items-center justify-between gap-2 border-b border-edge bg-surface px-4 py-3">
				<div className="flex min-w-0 items-center gap-2">
					<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-crimson-500 to-crimson-600">
						<Sparkles className="size-4 text-white" aria-hidden="true" />
					</div>
					<div className="min-w-0">
						<h3 className="text-sm font-semibold text-fg">Sapiens AI</h3>
						<p className="truncate text-xs text-fg-subtle">Il tuo assistente di studio</p>
					</div>
				</div>
				<div className="flex shrink-0 items-center gap-1">
					{messages.length > 0 && (
						<button type="button" onClick={clearMessages} className={cn(iconButton, inSheet ? 'size-[44px]' : 'size-9')} title="Cancella conversazione" aria-label="Cancella conversazione">
							<Trash2 className="size-4" aria-hidden="true" />
						</button>
					)}
					{onClose && (
						<button type="button" onClick={onClose} className={cn(iconButton, 'size-[44px] rounded-full text-fg-subtle')} aria-label="Chiudi">
							<X className="size-5" aria-hidden="true" />
						</button>
					)}
				</div>
			</div>

			{!ready ? (
				<div className="flex-1" aria-busy="true" />
			) : locked ? (
				<div className="flex-1 overflow-y-auto overscroll-contain">
					<Paywall feature={Features.AI_CHAT} returnTo={pathname} benefit="Seleziona un passaggio della lezione e chiedi una spiegazione diversa, un esempio o un approfondimento, subito." compact />
				</div>
			) : (
				<>
					<div ref={chat} role="log" aria-live="polite" aria-relevant="additions text" aria-label="Conversazione" className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-4">
						{messages.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center px-4 text-center">
								<div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-crimson-500 to-crimson-600 shadow-lg shadow-crimson-500/20">
									<MessageSquare className="size-7 text-white" aria-hidden="true" />
								</div>
								<h4 className="mb-2 text-base font-semibold text-fg">Come posso aiutarti?</h4>
								<p className="max-w-xs text-sm leading-relaxed text-fg-subtle">
									{coarse ? 'Tieni premuto su una frase della lezione per chiedere una spiegazione, oppure scrivi qui la tua domanda.' : 'Seleziona del testo nella lezione per chiedere spiegazioni, oppure scrivi qui la tua domanda.'}
								</p>
								<div className="mt-6 flex flex-wrap justify-center gap-2">
									{SUGGESTIONS.map((s) => (
										<button key={s.label} type="button" onClick={() => { setInput(s.text); setTimeout(() => { resize(); input.current?.focus(); }); }} className="min-h-[40px] rounded-full bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent-fg transition-colors hover:bg-crimson-100 dark:hover:bg-crimson-500/20">
											{s.label}
										</button>
									))}
								</div>
							</div>
						) : (
							messages.map((m) => (
								<div key={m.id} className={cn('flex gap-2.5', m.role === 'user' && 'flex-row-reverse')}>
									{m.role === 'assistant' && (
										<div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-crimson-500 to-crimson-600 shadow-sm">
											<Bot className="size-4 text-white" aria-hidden="true" />
										</div>
									)}
									<div className={cn('min-w-0 max-w-[85%] rounded-2xl px-3.5 py-2.5', m.role === 'user' ? 'rounded-br-md bg-accent text-white' : 'rounded-bl-md border border-edge bg-surface text-fg shadow-sm')}>
										{m.role === 'user' ? (
											<p className="whitespace-pre-wrap break-words text-sm leading-relaxed sm:text-base">{m.content}</p>
										) : m.content ? (
											<ChatMessage content={m.content} className="break-words text-sm leading-relaxed sm:text-base" />
										) : (
											m.isStreaming && (
												<div className="flex gap-1 py-1" aria-label="Sto scrivendo" role="status">
													{[0, 0.15, 0.3].map((d) => (
														<span key={d} className="size-1.5 animate-bounce rounded-full bg-fg-faint" style={{ animationDelay: `${d}s` }} />
													))}
												</div>
											)
										)}
									</div>
								</div>
							))
						)}
					</div>
					<div className={cn('border-t border-edge bg-surface p-3', inSheet && 'pb-[calc(0.75rem+var(--safe-b))]')}>
						<div className="flex items-end gap-2">
							<label htmlFor="ai-chat-input" className="sr-only">La tua domanda</label>
							<textarea
								id="ai-chat-input"
								ref={input}
								value={inputValue}
								onChange={(e) => { setInput(e.target.value); resize(); }}
								onKeyDown={onKey}
								placeholder="Scrivi una domanda..."
								disabled={isLoading}
								rows={1}
								className="max-h-[140px] min-h-[44px] flex-1 resize-none rounded-xl border-0 bg-surface-3 px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:outline-none focus:ring-2 focus:ring-crimson-500/50 disabled:cursor-not-allowed disabled:opacity-50"
							/>
							<button type="button" onClick={() => send()} disabled={!inputValue.trim() || isLoading} className="flex size-[44px] shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-colors hover:bg-crimson-600 disabled:cursor-not-allowed disabled:bg-surface-4 disabled:text-fg-faint focus-ring-offset" aria-label="Invia">
								{isLoading ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-5" aria-hidden="true" />}
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
