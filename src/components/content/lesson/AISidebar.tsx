'use client';

import { useEffect, useEffectEvent, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, Layers, Lightbulb, Loader2, MessageSquare, Send, Sparkles, Trash2, Wand2, X } from 'lucide-react';
import { useAISidebar } from '@/lib/state/ai-sidebar';
import { useLessonLayout } from '@/lib/state/lesson-layout';
import { plainTitle } from '@/lib/seo/slug';
import { useAuth } from '@/lib/state/auth';
import { useCoarsePointer } from '@/lib/hooks/use-media';
import { hasFeature } from '@/lib/auth/entitlements';
import { Features } from '@/lib/stripe/config';
import { cn } from '@/lib/utils/cn';
import { Paywall } from '@/components/subscription/Paywall';
import { Sticker } from '@/components/ui/Sticker';
import { Html } from '@/components/ui/Html';
import { ChatMessage } from './ChatMessage';

const SUGGESTIONS = [
	{ label: 'Semplifica', text: 'Puoi spiegarmi questo concetto in modo più semplice?', icon: Wand2 },
	{ label: 'Esempio', text: 'Puoi farmi un esempio pratico?', icon: Lightbulb },
	{ label: 'Approfondisci', text: 'Perché questo è importante?', icon: Layers }
];

/** Questions on the section being read, built from its title: short on the row, whole in the conversation. */
const SECTION_QUESTIONS = [
	{ label: 'Riassumila in tre punti', ask: (t: string) => `Riassumi in tre punti la sezione "${t}".` },
	{ label: 'Fammi un altro esempio', ask: (t: string) => `Fammi un esempio diverso da quelli della lezione su "${t}".` },
	{ label: "Qual è l'errore più comune?", ask: (t: string) => `Qual è l'errore più comune su "${t}", e come lo evito?` }
];

/** A typeset title as plain text: each formula is read back from its accessible label. */
function titleText(html: string): string {
	const doc = new DOMParser().parseFromString(html, 'text/html');
	for (const math of doc.querySelectorAll('[role="math"]')) math.replaceWith(math.getAttribute('aria-label') ?? '');
	return plainTitle(doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

// A row of the desktop lists, like a row of the table of contents, with a light hover to show it is a button.
const suggestionRow = 'flex items-center rounded-md px-2 py-1 text-left text-sm text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring';

const iconButton = 'flex items-center justify-center rounded-lg text-fg-faint transition-colors hover:bg-surface-3 hover:text-fg-muted active:bg-surface-3 focus-ring';

/**
 * The line that stands in for the selection in the conversation. A selection
 * carries its formulas as `$…$`, and half of one left behind by the cut would
 * typeset as a stray dollar, so the cut falls before the formula it would
 * otherwise break.
 */
function preview(text: string, limit = 50): string {
	const line = text.replace(/\s+/g, ' ').trim();
	if (line.length <= limit) return line;
	const cut = line.slice(0, limit);
	const whole = [...cut.matchAll(/\$\$[\s\S]*?\$\$|\$[^$]*?\$/g)].map((m) => [m.index, m.index + m[0].length] as const);
	const broken = [...cut].findIndex((c, i) => c === '$' && !whole.some(([from, to]) => i >= from && i < to));
	return `${(broken < 0 ? cut : cut.slice(0, broken)).trim()}...`;
}

/**
 * The study assistant. Beside the lesson on wide screens; inside a bottom
 * sheet on phones, where `onClose` adds the close button and the panel
 * fills the sheet. The chat is part of the paid plans: the server decides
 * for real (/api/chat answers 401/403); this only chooses what to show.
 */
export function AISidebar({ onClose, lesson }: { onClose?: () => void; lesson?: string }) {
	const pathname = usePathname();
	const { messages, isLoading, isOpen, pendingPrompt, inputValue, addUserMessage, addAssistantMessage, appendToLastMessage, finishStreaming, clearPendingPrompt, clearMessages, setInput, setLoading } = useAISidebar();
	const { user, ready } = useAuth();
	const coarse = useCoarsePointer();
	const [refused, setRefused] = useState(false);
	const locked = refused || !hasFeature(user, Features.AI_CHAT);
	const chat = useRef<HTMLDivElement>(null);
	const input = useRef<HTMLTextAreaElement>(null);
	const inSheet = !!onClose;
	const sections = useLessonLayout((s) => s.sections);
	const activeSection = useLessonLayout((s) => s.activeSection);
	// The top-level section being read (the first one before any heading has passed), numbered as in the table of contents.
	const current = useMemo(() => {
		const has = (list: typeof sections): boolean => list.some((x) => x.id === activeSection || has(x.subsections));
		const index = Math.max(0, sections.findIndex((x) => x.id === activeSection || has(x.subsections)));
		const section = sections[index];
		return section && { id: section.id, number: String(index + 1).padStart(2, '0'), titleHtml: section.titleHtml, title: titleText(section.titleHtml) };
	}, [sections, activeSection]);

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
		send(`${prompt.prompt}\n\n${selectedText}`, `${prompt.label}: "${preview(selectedText)}"`);
	});
	useEffect(() => {
		// The state updates that follow come from the network response, not from this effect.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (pendingPrompt) sendPending(pendingPrompt);
	}, [pendingPrompt]);

	// A suggestion fills the input, for the student to send or edit.
	const suggest = (text: string) => {
		setInput(text);
		setTimeout(() => { resize(); input.current?.focus(); });
	};

	// Enter sends with a keyboard; on a phone Enter adds a line and the button sends, as in every messaging app.
	const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey && !coarse) {
			e.preventDefault();
			send();
		}
	};

	// Beside the lesson the panel has no card of its own: it sits on the open page, like the table of contents.
	return (
		<div className={cn('flex min-h-0 flex-1 flex-col overflow-hidden', inSheet && 'h-full bg-surface-2')}>
			{/* Beside the lesson, the same label as the table of contents, on the lesson header's row. */}
			<div className={cn('flex shrink-0 items-center justify-between gap-2', inSheet ? 'border-b border-edge bg-surface px-4 py-3' : 'mx-8 h-11 border-b border-edge-soft')}>
				{inSheet ? (
					<div className="flex min-w-0 items-center gap-2">
						<div className="flex size-8 shrink-0 rotate-[-4deg] items-center justify-center rounded-lg bg-accent shadow-key">
							<Sparkles className="size-4 text-white" aria-hidden="true" />
						</div>
						<div className="min-w-0">
							<h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-fg-strong">Sapiens AI</h3>
							<p className="label-mono truncate text-fg-subtle">Il tuo assistente di studio</p>
						</div>
					</div>
				) : (
					<h3 className="label-mono flex items-center gap-2 text-fg-faint">
						<Sparkles className="size-3.5 text-accent" aria-hidden="true" />
						Sapiens AI
					</h3>
				)}
				<div className="flex shrink-0 items-center gap-1">
					{messages.length > 0 && (
						<button type="button" onClick={clearMessages} className={cn(iconButton, inSheet ? 'size-[44px]' : 'size-8')} title="Cancella conversazione" aria-label="Cancella conversazione">
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
				<div className={cn('flex-1 overflow-y-auto overscroll-y-contain', !inSheet && 'px-5 pt-3')}>
					<Paywall feature={Features.AI_CHAT} returnTo={pathname} benefit="Seleziona un passaggio della lezione e chiedi una spiegazione diversa, un esempio o un approfondimento, subito." compact />
				</div>
			) : (
				<>
					<div ref={chat} role="log" aria-live="polite" aria-relevant="additions text" aria-label="Conversazione" className={cn('min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-y-contain', inSheet ? 'note-paper px-3 py-4' : 'px-8 py-5')}>
						{messages.length === 0 ? (
							inSheet ? (
								<div className="flex h-full flex-col items-center justify-center px-4 text-center">
									<Sticker icon={MessageSquare} tone="accent" className="mb-5" />
									<h4 className="mb-2 font-display text-2xl font-semibold tracking-tight text-fg-strong">Come posso aiutarti?</h4>
									<p className="max-w-xs text-sm leading-relaxed text-fg-subtle">{coarse ? 'Tieni premuto su una frase della lezione per chiedere una spiegazione, oppure scrivi qui la tua domanda.' : 'Seleziona del testo nella lezione per chiedere spiegazioni, oppure scrivi qui la tua domanda.'}</p>
									<div className="mt-6 flex flex-wrap justify-center gap-2">
										{SUGGESTIONS.map((s) => (
											<button key={s.label} type="button" onClick={() => suggest(s.text)} className="min-h-[40px] rounded-full border border-accent-edge bg-surface px-4 py-1.5 text-sm font-medium text-accent-fg shadow-paper transition-colors hover:bg-accent-soft focus-ring">
												{s.label}
											</button>
										))}
									</div>
								</div>
							) : (
								// Beside the lesson the suggestions are a list, row for row like the table of contents across it;
								// below them, questions on the section being read, and at the foot the hint, next to the input.
								<div className="flex min-h-full flex-col">
									{SUGGESTIONS.map((s) => (
										<button key={s.label} type="button" onClick={() => suggest(s.text)} className={cn(suggestionRow, '-mx-2 mb-3 w-[calc(100%+1rem)] font-semibold')}>
											<s.icon className="mr-2.5 size-3.5 shrink-0 text-fg-faint" aria-hidden="true" />
											{s.label}
										</button>
									))}
									{current && (
										<div key={current.id} className="mt-8 motion-safe:animate-fade-in">
											<p className="label-mono text-fg-faint">In questa sezione · {current.number}</p>
											<Html html={current.titleHtml} className="math-inline mb-3 mt-1.5 text-sm font-semibold text-fg-strong" />
											<div className="ml-1 border-l border-edge pl-1">
												{SECTION_QUESTIONS.map((q) => (
													<button key={q.label} type="button" onClick={() => send(`${q.ask(current.title)}${lesson ? ` (Lezione: ${lesson}.)` : ''}`, q.ask(current.title))} className={cn(suggestionRow, 'my-1.5 w-full font-medium')}>
														{q.label}
													</button>
												))}
											</div>
										</div>
									)}
									<p className="mt-auto pt-8 text-xs leading-relaxed text-fg-subtle">Seleziona del testo nella lezione per chiedere spiegazioni, oppure scrivi qui sotto la tua domanda.</p>
								</div>
							)
						) : (
							messages.map((m) => (
								<div key={m.id} className={cn('flex gap-2.5', m.role === 'user' && 'flex-row-reverse')}>
									{m.role === 'assistant' && (
										<div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent shadow-key">
											<Bot className="size-4 text-white" aria-hidden="true" />
										</div>
									)}
									<div className={cn('min-w-0 max-w-[85%] rounded-2xl px-3.5 py-2.5', m.role === 'user' ? 'rounded-br-md bg-accent text-white' : 'rounded-bl-md border border-edge bg-surface text-fg shadow-paper')}>
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
					<div className={cn(inSheet ? 'border-t border-edge bg-surface p-3 pb-[calc(0.75rem+var(--safe-b))]' : 'px-8 pb-6 pt-1')}>
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
								className={cn('max-h-[140px] min-h-[44px] flex-1 resize-none rounded-xl border bg-surface-2 px-3.5 py-2.5 text-sm text-fg focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50', inSheet ? 'border-edge placeholder:text-fg-faint' : 'border-edge-strong placeholder:text-fg-subtle')}
							/>
							<button type="button" onClick={() => send()} disabled={!inputValue.trim() || isLoading} className="flex size-[44px] shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-key transition-colors hover:bg-accent-hover active:translate-y-px disabled:cursor-not-allowed disabled:bg-surface-4 disabled:text-fg-faint disabled:shadow-none focus-ring-offset" aria-label="Invia">
								{isLoading ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-5" aria-hidden="true" />}
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
