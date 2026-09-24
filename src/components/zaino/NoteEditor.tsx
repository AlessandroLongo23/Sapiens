'use client';

import { useCallback, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Sheet, sheetActions } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils/cn';
import { DEFAULT_NOTE_TITLE, MAX_CONTENT, type NotebookRow, type NoteRow } from '@/lib/zaino/config';
import type { PlacedSticker } from '@/lib/zaino/stickers';
import type { Paper } from '@/lib/zaino/paper';
import { applyPageOp, countWords, joinPages, splitPages, type PageOp } from '@/lib/zaino/pages';
import { useNoteEditor, type EditorMode } from '@/lib/state/note-editor';
import { effectiveZoom, restoreNoteView, stepZoom, useNoteView } from '@/lib/state/note-view';
import { useMd } from '@/lib/hooks/use-media';
import { ImmersiveFrame } from '@/components/content/lesson/LessonPresence';
import { NoteHeader } from './NoteHeader';
import { AdvancedEditor } from './AdvancedEditor';
import { MoveNoteSheet } from './MoveNoteSheet';
import type { DeletedPage } from './SimpleEditor';
import { PagesPanel } from './PagesPanel';
import { OutlinePanel } from './OutlinePanel';
import { SidePanel } from './SidePanel';
import { ReadingView } from './ReadingView';
import { NotePrint, ShortcutsSheet, ZoomControls } from './NoteViewControls';

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
const PAPER_DEBOUNCE_MS = 500;

/** The document as it stands, from whichever editor is mounted. */
function currentMarkdown(): string {
	const s = useNoteEditor.getState();
	return s.getMarkdown ? s.getMarkdown() : s.markdown;
}

export function NoteEditor({
	note,
	notebookTitle,
	notebooks,
	stickers,
	paper: savedPaper
}: {
	note: NoteRow;
	notebookTitle: string;
	notebooks: NotebookRow[];
	stickers: PlacedSticker[];
	paper: Paper;
}) {
	const router = useRouter();
	const store = useNoteEditor();
	const { noteId, mode, status, markdown, title, conflict, error } = store;
	const md = useMd();
	const { pagesOpen, setPagesOpen, outlineOpen, setOutlineOpen } = useNoteView();
	const [leaving, setLeaving] = useState<string | null>(null);
	// A change of pages rewrites the document and mounts the Simple editor again on it.
	const [structure, setStructure] = useState(0);
	// The Simple editor's own page operations, while it is mounted (it keeps its pages' editors alive).
	const simplePages = useRef<((op: PageOp) => DeletedPage | null) | null>(null);
	// The writing mode to go back to from reading.
	const lastWriting = useRef<EditorMode>('simple');
	const [undo, setUndo] = useState<DeletedPage | null>(null);
	// The document as it was when printing was asked for, while the print copy is up.
	const [printing, setPrinting] = useState<string | null>(null);
	const [shortcuts, setShortcuts] = useState(false);
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
	// The same set as state, a beat behind, for the page thumbnails.
	const [stickerView, setStickerView] = useState(stickers);
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
			stickerTimer.current = setTimeout(() => {
				setStickerView(stickerSet.current);
				saveStickers();
			}, STICKER_DEBOUNCE_MS);
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

	/*
	 * The paper, saved on its own like the stickers and never touching the
	 * note's version. It applies at once; the request follows a moment later.
	 */
	const [paper, setPaper] = useState(savedPaper);
	const [paperError, setPaperError] = useState(false);
	const paperTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const savePaper = useCallback(
		(next: Paper) => {
			void fetch(`/api/zaino/note/${note.id}/carta`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paper: next }) })
				.then((r) => setPaperError(!r.ok))
				.catch(() => setPaperError(true));
		},
		[note.id]
	);
	const pendingPaper = useRef<Paper | null>(null);
	const onPaperChange = useCallback(
		(next: Paper) => {
			setPaper(next);
			pendingPaper.current = next;
			if (paperTimer.current) clearTimeout(paperTimer.current);
			paperTimer.current = setTimeout(() => {
				pendingPaper.current = null;
				savePaper(next);
			}, PAPER_DEBOUNCE_MS);
		},
		[savePaper]
	);
	// A choice still waiting for its request goes out when the page is left or hidden.
	useEffect(() => {
		const flush = () => {
			const next = pendingPaper.current;
			if (!next) return;
			pendingPaper.current = null;
			if (paperTimer.current) clearTimeout(paperTimer.current);
			void fetch(`/api/zaino/note/${note.id}/carta`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paper: next }), keepalive: true }).catch(() => {});
		};
		const onHidden = () => document.visibilityState === 'hidden' && flush();
		document.addEventListener('visibilitychange', onHidden);
		window.addEventListener('pagehide', flush);
		return () => {
			document.removeEventListener('visibilitychange', onHidden);
			window.removeEventListener('pagehide', flush);
			flush();
		};
	}, [note.id]);

	// The layout remembered on this device: the toolbar's place and the thumbnails.
	useLayoutEffect(() => {
		restoreNoteView();
	}, []);

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

	const changeMode = useCallback((next: EditorMode) => {
		// The engine that is going away is asked for its text first, so the switch
		// carries the edits with it.
		const s = useNoteEditor.getState();
		if (s.status === 'dirty' && s.getMarkdown) useNoteEditor.getState().edited(s.getMarkdown());
		if (s.mode !== 'reading') lastWriting.current = s.mode;
		if (next === s.mode) return;
		// The reader stays where they were: the new view opens at the same title, or the same page.
		const view = useNoteView.getState();
		const at = view.heading ?? { page: view.page, index: -1 };
		useNoteEditor.getState().setMode(next);
		view.jumpToHeading(at.page, at.index, true);
		// Reading is not remembered: a note opened to write in must never open locked.
		if (next === 'reading') return;
		try {
			window.localStorage.setItem(MODE_KEY, next);
		} catch {
			// Nothing to do: the mode is simply not remembered.
		}
	}, []);
	/** Back from reading to the writing mode it was left from. */
	const backToWriting = useCallback(() => changeMode(lastWriting.current), [changeMode]);
	const toggleReading = useRef(() => {});
	useEffect(() => {
		toggleReading.current = () => (useNoteEditor.getState().mode === 'reading' ? backToWriting() : changeMode('reading'));
	}, [backToWriting, changeMode]);

	const register = useCallback((getMarkdown: (() => string) | null) => useNoteEditor.getState().register(getMarkdown), []);
	const onChange = useCallback((next: string) => useNoteEditor.getState().edited(next), []);

	const registerPageOps = useCallback((run: ((op: PageOp) => DeletedPage | null) | null) => {
		simplePages.current = run;
	}, []);

	/**
	 * Adding, duplicating, moving or deleting a page. The Simple editor does it
	 * on its mounted pages; the Advanced one is plain text, rewritten here with
	 * the stickers (lib/zaino/pages). A deletion can be undone for a few
	 * seconds, which puts back that page alone, so nothing typed since is lost.
	 */
	const onPageOp = useCallback((op: PageOp) => {
		if (op.kind !== 'insert') setUndo(null);
		if (useNoteEditor.getState().mode === 'simple' && simplePages.current) {
			const deleted = simplePages.current(op);
			if (deleted) setUndo(deleted);
			return;
		}
		const before = splitPages(currentMarkdown());
		const result = applyPageOp(before, stickerSet.current, op);
		if (!result) return;
		if (op.kind === 'delete') setUndo({ index: op.index, text: before[op.index], stickers: stickerSet.current.filter((st) => (st.page ?? 0) === op.index) });
		useNoteEditor.getState().edited(joinPages(result.pages));
		stickerSet.current = result.stickers;
		setStickerView(result.stickers);
		saveStickers();
		requestAnimationFrame(() => useNoteView.getState().jumpTo(result.focus));
	}, [saveStickers]);

	useEffect(() => {
		if (!undo) return;
		const id = setTimeout(() => setUndo(null), 7000);
		return () => clearTimeout(id);
	}, [undo]);

	// Keys of the editor as a whole: zoom, pages, print and the list of shortcuts.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const mod = e.metaKey || e.ctrlKey;
			const view = useNoteView.getState();
			if (mod && (e.key === '=' || e.key === '+')) {
				e.preventDefault();
				view.setZoom(stepZoom(effectiveZoom(view), 1));
			} else if (mod && e.key === '-') {
				e.preventDefault();
				view.setZoom(stepZoom(effectiveZoom(view), -1));
			} else if (mod && e.key === '0') {
				e.preventDefault();
				view.setZoom('fit');
			} else if (mod && !e.shiftKey && e.key.toLowerCase() === 'e') {
				e.preventDefault();
				toggleReading.current();
			} else if (mod && e.shiftKey && e.key.toLowerCase() === 'p') {
				e.preventDefault();
				view.setPagesOpen(!view.pagesOpen);
			} else if (mod && !e.shiftKey && e.key.toLowerCase() === 'p') {
				e.preventDefault();
				setPrinting(currentMarkdown());
			} else if (e.key === '?' && !mod) {
				const target = e.target as HTMLElement | null;
				if (target?.closest('input, textarea, [contenteditable="true"]')) return;
				e.preventDefault();
				setShortcuts(true);
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, []);

	const deferredMarkdown = useDeferredValue(markdown);
	const pages = useMemo(() => splitPages(deferredMarkdown).length, [deferredMarkdown]);
	const words = useMemo(() => countWords(deferredMarkdown), [deferredMarkdown]);
	const onPrintDone = useCallback(() => setPrinting(null), []);

	if (noteId !== note.id) return null;

	return (
		<div className="flex h-dvh flex-col bg-page">
			<ImmersiveFrame />
			<NoteHeader
				notebookId={note.notebook_id}
				notebookTitle={notebookTitle}
				notebooks={notebooks}
				lesson={note.lesson_path ? { path: note.lesson_path, title: note.lesson_title ?? 'Lezione' } : null}
				paper={paper}
				pages={pages}
				words={words}
				onPaperChange={onPaperChange}
				onModeChange={changeMode}
				onMove={() => setMoving(true)}
				onPrint={() => setPrinting(currentMarkdown())}
				onShortcuts={() => setShortcuts(true)}
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

			<div className="flex min-h-0 flex-1">
				{/* The thumbnails: a column beside the sheet from md up, a sheet over it on a phone. */}
				{/* The outline on the left and the pages on the right, as columns from md up and as sheets on a phone. */}
				{md && (
					<SidePanel open={outlineOpen} side="left" width={240} label="Indice">
						<OutlinePanel markdown={markdown} layout="column" onClose={() => setOutlineOpen(false)} />
					</SidePanel>
				)}
				{!md && (
					<>
						<Sheet open={outlineOpen} onClose={() => setOutlineOpen(false)} title="Indice" size="auto">
							<OutlinePanel markdown={markdown} layout="sheet" onClose={() => setOutlineOpen(false)} />
						</Sheet>
						<Sheet open={pagesOpen} onClose={() => setPagesOpen(false)} title="Pagine" size="full">
							<PagesPanel markdown={markdown} stickers={stickerView} paper={paper} layout="grid" readOnly={mode === 'reading'} onOp={onPageOp} onClose={() => setPagesOpen(false)} />
						</Sheet>
					</>
				)}

				<div className="relative flex min-w-0 flex-1 flex-col">
					{(conflict || moveError || stickerError || paperError || (status === 'error' && !conflict)) && (
						<div className="absolute inset-x-0 top-0 z-40 space-y-2 px-4 pt-3">
							{conflict && (
								<Alert tone="error" title="Questa nota è stata modificata altrove">
									<p>Le modifiche di questa scheda non sono state salvate. Scegli quale versione tenere.</p>
									<div className="mt-2 flex flex-wrap gap-2">
										<Button
											size="sm"
											variant="secondary"
											onClick={() => {
												useNoteEditor.getState().reset(note.id, conflict.content, conflict.title, conflict.version);
												setStructure((n) => n + 1);
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
							)}
							{moveError && <Alert tone="error">{moveError}</Alert>}
							{(stickerError || paperError) && (
								<Alert tone="error">
									{stickerError ? 'Gli adesivi non sono stati salvati.' : 'La carta non è stata salvata.'}{' '}
									<button
										type="button"
										onClick={() => (stickerError ? saveStickers() : savePaper(paper))}
										className="rounded font-semibold underline underline-offset-2 focus-ring"
									>
										Riprova
									</button>
								</Alert>
							)}
							{status === 'error' && !conflict && (
								<Alert tone="error">
									{error || 'Salvataggio non riuscito.'}{' '}
									<button type="button" onClick={() => void save()} className="rounded font-semibold underline underline-offset-2 focus-ring">
										Riprova
									</button>
								</Alert>
							)}
						</div>
					)}

					{/* Keyed on the mode so the two editors cross-fade rather than snap; a mode
					    switch happens a few times a session, so 200ms is affordable here in a
					    way it would not be on a keystroke. */}
					<div key={mode} className={cn('flex min-h-0 flex-1 animate-fade-in flex-col overflow-hidden', mode !== 'reading' && 'max-md:pb-[calc(var(--spacing-tabbar)+var(--safe-b))]')}>
						{mode === 'reading' ? (
							<ReadingView markdown={markdown} stickers={stickerView} paper={paper} onWrite={backToWriting} />
						) : mode === 'simple' ? (
							<SimpleEditor
								key={structure}
								initialMarkdown={markdown}
								onChange={onChange}
								register={register}
								registerPageOps={registerPageOps}
								onSwitchToAdvanced={() => changeMode('advanced')}
								stickers={readStickers}
								onStickersChange={onStickersChange}
								paper={paper}
							/>
						) : (
							<AdvancedEditor value={markdown} onChange={onChange} paper={paper} />
						)}
					</div>

					{md && mode !== 'advanced' && (
						<div className="pointer-events-none absolute right-4 top-3 z-30">
							<ZoomControls pages={pages} />
						</div>
					)}

					{undo && (
						<div role="status" className="absolute inset-x-0 top-3 z-50 flex justify-center px-3">
							<div className="flex items-center gap-3 rounded-full bg-inverse py-1.5 pl-4 pr-1.5 text-sm text-inverse-fg shadow-lift animate-fade-in">
								<span>Pagina {undo.index + 1} eliminata.</span>
								<button
									type="button"
									onClick={() => {
										onPageOp({ kind: 'insert', at: undo.index, text: undo.text, stickers: undo.stickers });
										setUndo(null);
									}}
									className="rounded-full px-3 py-1 font-semibold text-inverse-fg underline-offset-2 hover:underline focus-ring"
								>
									Annulla
								</button>
							</div>
						</div>
					)}
				</div>
				{md && (
					<SidePanel open={pagesOpen} side="right" width={192} label="Pagine">
						<PagesPanel markdown={markdown} stickers={stickerView} paper={paper} layout="column" readOnly={mode === 'reading'} onOp={onPageOp} onClose={() => setPagesOpen(false)} />
					</SidePanel>
				)}
			</div>

			<ShortcutsSheet open={shortcuts} onClose={() => setShortcuts(false)} />
			{printing !== null && <NotePrint markdown={printing} stickers={stickerView} paper={paper} onDone={onPrintDone} />}

			<Sheet open={!!leaving} onClose={() => setLeaving(null)} title="Hai modifiche non salvate" size="auto" width="sm" align="center">
				<p className="text-sm text-fg-muted">Vuoi salvare la nota prima di uscire?</p>
				<div className={cn(sheetActions, 'mt-5')}>
					<Button variant="ghost" onClick={() => setLeaving(null)}>Annulla</Button>
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
				</div>
			</Sheet>
		</div>
	);
}
