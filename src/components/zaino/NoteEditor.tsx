'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { DEFAULT_NOTE_TITLE, MAX_CONTENT, type NotebookRow, type NoteRow } from '@/lib/zaino/config';
import type { PlacedSticker } from '@/lib/zaino/stickers';
import { useNoteEditor, type EditorMode } from '@/lib/state/note-editor';
import { ImmersiveFrame } from '@/components/content/lesson/LessonPresence';
import { NoteHeader } from './NoteHeader';
import { AdvancedEditor } from './AdvancedEditor';
import { MoveNoteSheet } from './MoveNoteSheet';

/**
 * The WYSIWYG is loaded only when Simple mode is actually shown: TipTap and
 * ProseMirror are ~150 KB that a student who writes markdown never needs.
 * `ssr: false` because @tiptap/react refuses to render immediately under Next
 * anyway, so server rendering would emit an empty shell and a layout shift.
 */
const SimpleEditor = dynamic(() => import('./SimpleEditor').then((m) => m.SimpleEditor), {
	ssr: false,
	loading: () => <p className="px-4 py-6 text-sm text-fg-subtle">Apertura dell’editor…</p>
});

/** Autosave: idle delay, and the longest a continuously typed note goes unsaved. */
const DEBOUNCE_MS = 900;
const MAX_UNSAVED_MS = 8000;
/** `keepalive` caps a request body at 64 KB, so the flush on unload has a ceiling of its own. */
const KEEPALIVE_LIMIT = 60_000;

const MODE_KEY = 'zaino:mode';
/** Stickers are saved a moment after the last one goes down or comes off. */
const STICKER_DEBOUNCE_MS = 600;

export function NoteEditor({ note, notebookTitle, notebooks, stickers }: { note: NoteRow; notebookTitle: string; notebooks: NotebookRow[]; stickers: PlacedSticker[] }) {
	const router = useRouter();
	const store = useNoteEditor();
	const { noteId, mode, status, markdown, title, conflict, error } = store;
	const [leaving, setLeaving] = useState<string | null>(null);
	// Bumped when a save lands with edits still outstanding, to re-arm the debounce.
	const [pass, setPass] = useState(0);
	const [moving, setMoving] = useState(false);
	const [moveError, setMoveError] = useState<string | null>(null);

	// The timers read the store directly: getState is always the live value, and
	// mirroring it into a ref would be a write during render.
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const oldestEdit = useRef<number | null>(null);
	const saving = useRef(false);
	const channel = useRef<BroadcastChannel | null>(null);

	/*
	 * Stickers are saved on their own, the whole set at a time, and never touch
	 * the note's version (see the note_stickers migration). The set lives here
	 * so it survives a switch to Avanzata and back, which remounts the sheet.
	 * Saves run one after another, so the last set sent is the one that stays.
	 */
	const stickerSet = useRef(stickers);
	const stickerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const stickerQueue = useRef<Promise<void>>(Promise.resolve());
	const [stickerError, setStickerError] = useState(false);
	const saveStickers = useCallback(
		(keepalive = false) => {
			if (stickerTimer.current) clearTimeout(stickerTimer.current);
			stickerTimer.current = null;
			const body = JSON.stringify({ stickers: stickerSet.current });
			stickerQueue.current = stickerQueue.current.then(async () => {
				try {
					const response = await fetch(`/api/zaino/note/${note.id}/adesivi`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body, keepalive });
					setStickerError(!response.ok);
				} catch {
					setStickerError(true);
				}
			});
		},
		[note.id]
	);
	const onStickersChange = useCallback(
		(next: PlacedSticker[]) => {
			stickerSet.current = next;
			if (stickerTimer.current) clearTimeout(stickerTimer.current);
			stickerTimer.current = setTimeout(() => saveStickers(), STICKER_DEBOUNCE_MS);
		},
		[saveStickers]
	);
	const readStickers = useCallback(() => stickerSet.current, []);
	// A pending save goes out when the page is left or hidden.
	useEffect(() => {
		const flush = () => stickerTimer.current && saveStickers(true);
		const onHidden = () => document.visibilityState === 'hidden' && flush();
		document.addEventListener('visibilitychange', onHidden);
		window.addEventListener('pagehide', flush);
		return () => {
			document.removeEventListener('visibilitychange', onHidden);
			window.removeEventListener('pagehide', flush);
			flush();
		};
	}, [saveStickers]);

	// A different note starts clean, or navigating A → B would show A's dirty text.
	// Only a different note: the server payload is re-sent on any refresh, and
	// resetting on that would throw away whatever is being typed.
	useLayoutEffect(() => {
		if (useNoteEditor.getState().noteId === note.id) return;
		useNoteEditor.getState().reset(note.id, note.content, note.title, note.version);
	}, [note.id, note.content, note.title, note.version]);

	// The remembered mode is read after hydration: reading it during render would mismatch the server.
	useLayoutEffect(() => {
		try {
			const saved = window.localStorage.getItem(MODE_KEY);
			if (saved === 'simple' || saved === 'advanced') useNoteEditor.getState().setMode(saved);
		} catch {
			// A browser with site data blocked keeps the default.
		}
	}, []);

	const save = useCallback(async () => {
		const s = useNoteEditor.getState();
		if (s.status === 'conflict' || !s.noteId) return;
		// One save at a time. Aborting an in-flight PATCH would not stop the server
		// committing it, so the next save would carry a stale version and come back
		// 409 — a conflict invented out of one tab. The trailing edits are picked up
		// by the pass below instead.
		if (saving.current) return;

		const content = s.getMarkdown ? s.getMarkdown() : s.markdown;
		const title = s.title.trim() || DEFAULT_NOTE_TITLE;
		if (content.length > MAX_CONTENT) {
			useNoteEditor.getState().setStatus('error', 'La nota è troppo lunga per essere salvata.');
			return;
		}

		saving.current = true;
		useNoteEditor.getState().setStatus('saving');
		try {
			const response = await fetch(`/api/zaino/note/${s.noteId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content, title, version: s.version })
			});
			const payload = await response.json().catch(() => ({}));
			if (response.status === 409 && payload.note) {
				useNoteEditor.getState().setConflict({ content: payload.note.content, title: payload.note.title, version: payload.note.version });
				return;
			}
			if (!response.ok) throw new Error(payload.error ?? 'Salvataggio non riuscito.');

			// What the student is looking at now, which may have moved on while the
			// request was in flight. Writing the response back here is what used to
			// delete characters as they were typed.
			const after = useNoteEditor.getState();
			const live = after.getMarkdown ? after.getMarkdown() : after.markdown;
			const settled = live === content && (after.title.trim() || DEFAULT_NOTE_TITLE) === title;
			oldestEdit.current = settled ? null : Date.now();
			useNoteEditor.getState().saved(payload.note.version, settled);
			// Tell the other tabs on this device, so they learn before their own
			// save is refused instead of after.
			channel.current?.postMessage({ version: payload.note.version });
			// Setting the status to `dirty` when it is already `dirty` does not move
			// the effect below, so the follow-up save is asked for explicitly.
			if (!settled) setPass((n) => n + 1);
		} catch (err) {
			useNoteEditor.getState().setStatus('error', err instanceof Error ? err.message : 'Salvataggio non riuscito.');
		} finally {
			saving.current = false;
		}
	}, []);

	// Debounced autosave, with a ceiling so a long stretch of typing still lands.
	useEffect(() => {
		if (status !== 'dirty') return;
		oldestEdit.current ??= Date.now();
		const waited = Date.now() - oldestEdit.current;
		const delay = waited > MAX_UNSAVED_MS ? 0 : Math.min(DEBOUNCE_MS, MAX_UNSAVED_MS - waited);
		timer.current = setTimeout(save, delay);
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [status, markdown, title, pass, save]);

	/*
	 * The same note in a second tab. The server already refuses a stale save with
	 * a 409, but that only lands after more has been typed into a copy that
	 * cannot win. A tab that saved says so, and the others react at once: a clean
	 * tab quietly takes the new version, a dirty one goes to the conflict card
	 * before its own attempt. Same device only, which is where this actually
	 * happens; a second device still gets the 409 path.
	 */
	useEffect(() => {
		if (!note.id || typeof BroadcastChannel === 'undefined') return;
		const bus = new BroadcastChannel(`zaino-note-${note.id}`);
		channel.current = bus;
		bus.onmessage = async (event: MessageEvent<{ version?: number }>) => {
			const s = useNoteEditor.getState();
			const incoming = Number(event.data?.version ?? 0);
			if (!incoming || incoming <= s.version || s.status === 'conflict') return;
			const response = await fetch(`/api/zaino/note/${note.id}`).catch(() => null);
			const payload = await response?.json().catch(() => null);
			if (!payload?.note) return;
			const dirty = s.status === 'dirty' || s.status === 'saving' || s.status === 'error';
			if (dirty) {
				useNoteEditor.getState().setConflict({ content: payload.note.content, title: payload.note.title, version: payload.note.version });
			} else {
				useNoteEditor.getState().reset(note.id, payload.note.content, payload.note.title, payload.note.version);
				router.refresh();
			}
		};
		return () => {
			channel.current = null;
			bus.close();
		};
	}, [note.id, router]);

	// Leaving the tab is the last chance to write: a keepalive request outlives the page.
	useEffect(() => {
		const flush = () => {
			const s = useNoteEditor.getState();
			if (s.status !== 'dirty' && s.status !== 'error') return;
			const content = s.getMarkdown ? s.getMarkdown() : s.markdown;
			if (content.length > KEEPALIVE_LIMIT) return;
			// Not sendBeacon: it can only POST, and this endpoint takes a PATCH.
			// `keepalive` is what lets the request outlive the page.
			void fetch(`/api/zaino/note/${s.noteId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content, title: s.title.trim() || DEFAULT_NOTE_TITLE, version: s.version }),
				keepalive: true
			}).catch(() => {});
		};
		const onHidden = () => document.visibilityState === 'hidden' && flush();
		document.addEventListener('visibilitychange', onHidden);
		window.addEventListener('pagehide', flush);
		return () => {
			document.removeEventListener('visibilitychange', onHidden);
			window.removeEventListener('pagehide', flush);
			flush();
		};
	}, []);

	// Attached only while there is something to lose: a standing listener would
	// disqualify the page from the back/forward cache for everyone.
	useEffect(() => {
		if (status !== 'dirty' && status !== 'saving' && status !== 'error') return;
		const warn = (e: BeforeUnloadEvent) => e.preventDefault();
		window.addEventListener('beforeunload', warn);
		return () => window.removeEventListener('beforeunload', warn);
	}, [status]);

	// The App Router has no navigation event, so an internal link is caught on
	// the way down. This covers the tab bar, the header and every in-page link.
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			const s = useNoteEditor.getState();
			if (s.status !== 'dirty' && s.status !== 'error') return;
			if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
			const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
			if (!link || link.target === '_blank' || link.origin !== window.location.origin) return;
			if (link.pathname === window.location.pathname) return;
			e.preventDefault();
			setLeaving(link.pathname + link.search);
		};
		document.addEventListener('click', onClick, true);
		return () => document.removeEventListener('click', onClick, true);
	}, []);

	const changeMode = (next: EditorMode) => {
		// The engine that is going away is asked for its text first, so the switch
		// carries the edits with it.
		const s = useNoteEditor.getState();
		if (s.status === 'dirty' && s.getMarkdown) useNoteEditor.getState().edited(s.getMarkdown());
		useNoteEditor.getState().setMode(next);
		try {
			window.localStorage.setItem(MODE_KEY, next);
		} catch {
			// Nothing to do: the mode is simply not remembered.
		}
	};

	const register = useCallback((getMarkdown: (() => string) | null) => useNoteEditor.getState().register(getMarkdown), []);
	const onChange = useCallback((next: string) => useNoteEditor.getState().edited(next), []);

	if (noteId !== note.id) return null;

	return (
		<div className="flex h-dvh flex-col bg-page md:h-[calc(100dvh-var(--header-h,60px))]">
			<ImmersiveFrame />
			<NoteHeader
				notebookId={note.notebook_id}
				notebookTitle={notebookTitle}
				notebooks={notebooks}
				lesson={note.lesson_path ? { path: note.lesson_path, title: note.lesson_title ?? 'Lezione' } : null}
				onModeChange={changeMode}
				onMove={() => setMoving(true)}
			/>

			<MoveNoteSheet
				open={moving}
				notebooks={notebooks}
				currentId={note.notebook_id}
				busy={false}
				onClose={() => setMoving(false)}
				onMove={async (destination) => {
					setMoveError(null);
					const response = await fetch(`/api/zaino/note/${note.id}`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ notebookId: destination, version: useNoteEditor.getState().version })
					});
					const payload = await response.json().catch(() => ({}));
					if (!response.ok) {
						setMoveError(payload.error ?? 'Spostamento non riuscito.');
						return;
					}
					useNoteEditor.setState({ version: payload.note.version });
					setMoving(false);
					router.refresh();
				}}
			/>

			{conflict && (
				<div className="shrink-0 px-4 pt-3">
					<Alert tone="error" title="Questa nota è stata modificata altrove">
						<p>Le modifiche di questa scheda non sono state salvate. Scegli quale versione tenere.</p>
						<div className="mt-2 flex flex-wrap gap-2">
							<Button
								size="sm"
								variant="secondary"
								onClick={() => {
									useNoteEditor.getState().reset(note.id, conflict.content, conflict.title, conflict.version);
									router.refresh();
								}}
							>
								Ricarica la versione salvata
							</Button>
							<Button
								size="sm"
								onClick={() => {
									// Adopt the winning version, then save this tab's text over it.
									useNoteEditor.getState().setConflict(null);
									useNoteEditor.setState({ version: conflict.version });
									void save();
								}}
							>
								Sovrascrivi
							</Button>
						</div>
					</Alert>
				</div>
			)}

			{moveError && (
				<div className="shrink-0 px-4 pt-3">
					<Alert tone="error">{moveError}</Alert>
				</div>
			)}

			{stickerError && (
				<div className="shrink-0 px-4 pt-3">
					<Alert tone="error">
						Gli adesivi non sono stati salvati.{' '}
						<button type="button" onClick={() => saveStickers()} className="rounded font-semibold underline underline-offset-2 focus-ring">
							Riprova
						</button>
					</Alert>
				</div>
			)}

			{status === 'error' && !conflict && (
				<div className="shrink-0 px-4 pt-3">
					<Alert tone="error">
						{error || 'Salvataggio non riuscito.'}{' '}
						<button type="button" onClick={() => void save()} className="rounded font-semibold underline underline-offset-2 focus-ring">
							Riprova
						</button>
					</Alert>
				</div>
			)}

			{/* Keyed on the mode so the two editors cross-fade rather than snap; a mode
			    switch happens a few times a session, so 200ms is affordable here in a
			    way it would not be on a keystroke. */}
			<div key={mode} className="flex min-h-0 flex-1 animate-fade-in flex-col overflow-hidden pb-[calc(var(--spacing-tabbar)+var(--safe-b))] lg:pb-0">
				{mode === 'simple' ? (
					<SimpleEditor
						initialMarkdown={markdown}
						onChange={onChange}
						register={register}
						onSwitchToAdvanced={() => changeMode('advanced')}
						stickers={readStickers}
						onStickersChange={onStickersChange}
					/>
				) : (
					<AdvancedEditor value={markdown} onChange={onChange} />
				)}
			</div>

			<Modal open={!!leaving} onClose={() => setLeaving(null)} className="max-w-md sm:mx-auto">
				<Card className="p-6" role="dialog" aria-modal="true" aria-labelledby="leave-title">
					<h2 id="leave-title" className="text-lg font-semibold text-fg-strong">Hai modifiche non salvate</h2>
					<p className="mt-2 text-sm text-fg-muted">Vuoi salvare la nota prima di uscire?</p>
					<div className="mt-5 flex flex-wrap gap-2">
						<Button
							onClick={async () => {
								await save();
								const to = leaving;
								setLeaving(null);
								if (to) router.push(to);
							}}
						>
							Salva ed esci
						</Button>
						<Button
							variant="secondary"
							onClick={() => {
								const to = leaving;
								setLeaving(null);
								useNoteEditor.getState().setStatus('clean');
								if (to) router.push(to);
							}}
						>
							Esci senza salvare
						</Button>
						<Button variant="ghost" onClick={() => setLeaving(null)}>Annulla</Button>
					</div>
				</Card>
			</Modal>
		</div>
	);
}
