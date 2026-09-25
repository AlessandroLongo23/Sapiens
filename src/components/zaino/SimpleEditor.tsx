'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import { migrateMathStrings } from '@tiptap/extension-mathematics';
import type katexType from 'katex';
import {
	Bold,
	Code,
	Heading1,
	Heading2,
	Heading3,
	Italic,
	Link2,
	List,
	ListOrdered,
	Lock,
	Pilcrow,
	Plus,
	Quote,
	Redo2,
	Sigma,
	SquareSigma,
	Sticker,
	Strikethrough,
	Undo2
} from 'lucide-react';
import { noteExtensions } from '@/lib/zaino/extensions';
import { tidy } from '@/lib/zaino/markdown-tidy';
import { describeFrozen, frozenBlocks } from '@/lib/zaino/analyse';
import { joinPages, MAX_PAGES, planPageOp, splitPages, type PageOp } from '@/lib/zaino/pages';
import { paperData, paperStyle, paperTone, type Paper } from '@/lib/zaino/paper';
import { Card } from '@/components/ui/Card';
import { useCoarsePointer, useMd } from '@/lib/hooks/use-media';
import { effectiveZoom, useNoteView } from '@/lib/state/note-view';
import { MAX_STICKERS, SHEET_MIN_HEIGHT, SHEET_WIDTH, type PlacedSticker } from '@/lib/zaino/stickers';
import type { BoardState } from '@/lib/zaino/sticker-board';
import { cn } from '@/lib/utils/cn';
import { HoldingHint, NoteStickers, StickerAlbum, type StickerControls } from './NoteStickers';
import { EditorToolbar, type ToolbarAction } from './EditorToolbar';
import { MathPopover, type MathTarget } from './MathPopover';
import { LinkDialog } from './LinkDialog';
import { useModKey } from './NoteViewControls';
import { syncHeading, useOutlineJump } from './OutlinePanel';
import { useSheetFit } from './useSheetFit';
import 'katex/dist/katex.min.css';

type Katex = typeof katexType;

let katexPromise: Promise<Katex> | null = null;
const loadKatex = () => (katexPromise ??= import('katex').then((m) => m.default));

/** One page as mounted: a stable id, so moving pages never remounts their editors. */
interface PageEntry {
	id: string;
	/** The text the page's editor was created with. */
	initial: string;
}

/** What the container needs from each page. */
interface PageHandle {
	editor: Editor;
	/** The page's markdown: its own text as loaded until it is edited, serialized after. */
	getMarkdown: () => string;
	sheet: HTMLDivElement | null;
	stickers: RefObject<StickerControls | null>;
}

/** What a deletion took away, for the undo. */
export interface DeletedPage {
	index: number;
	text: string;
	stickers: PlacedSticker[];
}

const newId = () => crypto.randomUUID();
const withoutPage = ({ page: _page, ...s }: PlacedSticker): PlacedSticker => s;

/**
 * The Word-like mode. Formatting is applied to the text itself, so `###` is
 * never on screen; the same document is stored as markdown, which the Advanced
 * mode shows verbatim.
 *
 * The invariant that keeps the two honest: a note that was opened but not
 * edited is never written back. The serializer normalises escapes and entities
 * on every pass, so re-saving an untouched document would rewrite text the
 * student never touched. `onChange` therefore fires from `update` only, and a
 * page that was not edited hands back its text exactly as it came.
 *
 * A note is a stack of pages (lib/zaino/pages), each a sheet of fixed width
 * (SHEET_WIDTH) with its own editor and its own stickers, zoomed together to
 * fit the screen, so the text and the stickers sit in the same place on every
 * device. Pages are added, moved and removed here, in place (`registerPageOps`
 * hands the parent the function), so every other page keeps its editor, its
 * caret and its undo history.
 */
export function SimpleEditor({
	initialMarkdown,
	onChange,
	register,
	registerPageOps,
	onSwitchToAdvanced,
	stickers,
	onStickersChange,
	paper
}: {
	initialMarkdown: string;
	onChange: (markdown: string) => void;
	register: (getMarkdown: (() => string) | null) => void;
	registerPageOps: (run: ((op: PageOp) => DeletedPage | null) | null) => void;
	onSwitchToAdvanced: () => void;
	/** The note's saved stickers, read when the pages mount. */
	stickers: () => PlacedSticker[];
	onStickersChange: (stickers: PlacedSticker[]) => void;
	paper: Paper;
}) {
	const [katex, setKatex] = useState<Katex | null>(null);
	const [mathTarget, setMathTarget] = useState<(MathTarget & { page: string }) | null>(null);
	const [linking, setLinking] = useState<Editor | null>(null);
	// The document as loaded, handed back untouched if nothing is edited.
	const pristine = useRef(initialMarkdown);
	const dirty = useRef(false);

	const [entries, setEntries] = useState<PageEntry[]>(() => splitPages(initialMarkdown).map((initial) => ({ id: newId(), initial })));
	// The same list for callbacks, which must not wait for a render to see a change.
	const list = useRef(entries);
	// Latest text and stickers of each page, by id, filled on first use.
	const texts = useRef<Map<string, string> | null>(null);
	const pageStickers = useRef<Map<string, PlacedSticker[]> | null>(null);
	const handles = useRef(new Map<string, PageHandle>());
	const [editors, setEditors] = useState<Record<string, Editor>>({});
	const [active, setActive] = useState<string>(entries[0].id);
	const [, repaint] = useState(0);
	const [pendingFocus, setPendingFocus] = useState<string | null>(null);

	const scroller = useRef<HTMLDivElement>(null);
	const [album, setAlbum] = useState(false);
	const [boards, setBoards] = useState<Record<string, BoardState>>({});
	const coarse = useCoarsePointer();
	const md = useMd();
	const mod = useModKey() === '⌘' ? 'Comando' : 'Ctrl';
	const { dock, zoom: zoomSetting, fit, jump, setPage, setZoom } = useNoteView();
	const zoom = effectiveZoom({ zoom: zoomSetting, fit });
	const sideDock = md && dock !== 'bottom';

	const textMap = useCallback(() => (texts.current ??= new Map(list.current.map((e) => [e.id, e.initial]))), []);
	const stickerMap = useCallback(() => {
		if (!pageStickers.current) {
			const all = stickers();
			// A sticker saved on a page that no longer exists goes to the last one, where it can be seen and peeled.
			const last = list.current.length - 1;
			pageStickers.current = new Map(list.current.map((e, i) => [e.id, all.filter((s) => Math.min(s.page ?? 0, last) === i).map(withoutPage)]));
		}
		return pageStickers.current;
	}, [stickers]);

	const textOf = useCallback((e: PageEntry) => handles.current.get(e.id)?.getMarkdown() ?? textMap().get(e.id) ?? e.initial, [textMap]);
	const markdownNow = useCallback(() => joinPages(list.current.map(textOf)), [textOf]);
	const emitStickers = useCallback(() => {
		const map = stickerMap();
		onStickersChange(list.current.flatMap((e, page) => (map.get(e.id) ?? []).map((s) => ({ ...s, page }))));
	}, [stickerMap, onStickersChange]);

	useSheetFit(scroller, sideDock);
	// A title picked in the outline also gets the caret, at its end, ready to write under it.
	useOutlineJump(scroller, (heading) => {
		const dom = heading.closest('.ProseMirror');
		const target = [...handles.current.values()].find((h) => h.editor.view.dom === dom)?.editor;
		if (!target) return;
		const pos = target.view.posAtDOM(heading, heading.childNodes.length);
		target.chain().setTextSelection(pos).focus(undefined, { scrollIntoView: false }).run();
	});

	useEffect(() => {
		loadKatex().then(setKatex);
	}, []);

	// Page breaks are HTML comments, but they are this editor's own: not frozen blocks.
	const frozen = useMemo(() => frozenBlocks(splitPages(initialMarkdown).join('\n\n')), [initialMarkdown]);

	const getMarkdown = useCallback(() => (dirty.current ? markdownNow() : pristine.current), [markdownNow]);
	useEffect(() => {
		register(getMarkdown);
		return () => register(null);
	}, [register, getMarkdown]);

	const onPageUpdate = useCallback(
		(id: string, markdown: string) => {
			dirty.current = true;
			textMap().set(id, markdown);
			onChange(joinPages(list.current.map((e) => textMap().get(e.id) ?? e.initial)));
		},
		[onChange, textMap]
	);

	const onRegister = useCallback((id: string, handle: PageHandle | null) => {
		if (handle) handles.current.set(id, handle);
		else handles.current.delete(id);
		setEditors((all) => {
			const next = { ...all };
			if (handle) next[id] = handle.editor;
			else delete next[id];
			return next;
		});
	}, []);

	/** Moves the caret to the start or the end of another page. */
	const onNavigate = useCallback((index: number, where: 'start' | 'end') => {
		const handle = handles.current.get(list.current[index]?.id ?? '');
		if (!handle) return;
		handle.editor.commands.focus(where);
		handle.sheet?.scrollIntoView({ block: 'nearest' });
	}, []);

	const onPageStickers = useCallback(
		(id: string, next: PlacedSticker[]) => {
			stickerMap().set(id, next.map(withoutPage));
			emitStickers();
		},
		[stickerMap, emitStickers]
	);
	const readPageStickers = useCallback((id: string) => stickerMap().get(id) ?? [], [stickerMap]);

	/**
	 * A page operation, applied to the mounted pages: new ones mount, deleted
	 * ones unmount, the rest keep their editors. Returns what a deletion took,
	 * for the undo.
	 */
	const runPageOp = useCallback(
		(op: PageOp): DeletedPage | null => {
			const before = list.current;
			const plan = planPageOp(before.length, op);
			if (!plan) return null;
			const map = stickerMap();
			const gone = op.kind === 'delete' ? before[op.index] : null;
			const deleted = gone && op.kind === 'delete' ? { index: op.index, text: textOf(gone), stickers: map.get(gone.id) ?? [] } : null;
			let room = MAX_STICKERS - [...map.values()].reduce((n, s) => n + s.length, 0);
			const seen = new Set<number>();
			const next = plan.order.map((from): PageEntry => {
				if (from !== null && !seen.has(from)) {
					seen.add(from);
					return before[from];
				}
				// A new page: blank, a restored one, or a copy of the page before it.
				const id = newId();
				const source = from === null ? null : before[from];
				const initial = op.kind === 'insert' ? op.text : source ? textOf(source) : '';
				const carried = op.kind === 'insert' ? op.stickers : source ? (map.get(source.id) ?? []).map((s) => ({ ...s, id: newId() })) : [];
				map.set(id, carried.filter(() => room-- > 0).map(withoutPage));
				textMap().set(id, initial);
				return { id, initial };
			});
			if (gone) {
				map.delete(gone.id);
				textMap().delete(gone.id);
			}
			list.current = next;
			setEntries(next);
			dirty.current = true;
			onChange(markdownNow());
			emitStickers();
			if (op.kind === 'add' || op.kind === 'duplicate' || op.kind === 'insert') setPendingFocus(next[plan.focus].id);
			else requestAnimationFrame(() => useNoteView.getState().jumpTo(plan.focus));
			return deleted;
		},
		[stickerMap, textMap, textOf, onChange, markdownNow, emitStickers]
	);

	useEffect(() => {
		registerPageOps(runPageOp);
		return () => registerPageOps(null);
	}, [registerPageOps, runPageOp]);

	// A page just added gets the caret and comes into view once its editor exists.
	useEffect(() => {
		if (!pendingFocus || !editors[pendingFocus]) return;
		const target = editors[pendingFocus];
		const index = entries.findIndex((e) => e.id === pendingFocus);
		const frame = requestAnimationFrame(() => {
			// No scrolling by the browser: it would scroll every ancestor, sideways too. jumpTo scrolls the sheet alone.
			target.commands.focus('start', { scrollIntoView: false });
			useNoteView.getState().jumpTo(index);
			setPendingFocus(null);
		});
		return () => cancelAnimationFrame(frame);
	}, [pendingFocus, editors, entries]);

	// The active page's editor drives the toolbar; its transactions repaint the buttons.
	const editor = editors[active] ?? editors[entries[0].id] ?? null;
	useEffect(() => {
		if (!editor) return;
		const bump = () => repaint((n) => n + 1);
		editor.on('transaction', bump);
		return () => {
			editor.off('transaction', bump);
		};
	}, [editor]);

	// The page in view: the one crossing the upper third of the scroller.
	const track = useCallback(() => {
		const el = scroller.current;
		if (!el) return;
		const line = el.getBoundingClientRect().top + el.clientHeight / 3;
		let current = 0;
		list.current.forEach((e, i) => {
			const sheet = handles.current.get(e.id)?.sheet;
			if (sheet && sheet.getBoundingClientRect().top <= line) current = i;
		});
		if (useNoteView.getState().page !== current) setPage(current);
		syncHeading(el);
	}, [setPage]);

	useEffect(() => {
		if (!jump) return;
		const el = scroller.current;
		const sheet = handles.current.get(list.current[jump.page]?.id ?? '')?.sheet;
		if (!el || !sheet) return;
		const top = el.scrollTop + sheet.getBoundingClientRect().top - el.getBoundingClientRect().top - 20;
		el.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
	}, [jump]);

	const activeIndex = Math.max(0, entries.findIndex((e) => e.id === active));
	const pageCount = entries.length;

	const actions: ToolbarAction[] = useMemo(() => {
		if (!editor) return [];
		const chain = () => editor.chain().focus();
		const plain = () => editor.isActive('paragraph') && !editor.isActive('bulletList') && !editor.isActive('orderedList') && !editor.isActive('blockquote');
		return [
			{ id: 'undo', priority: 6, label: 'Annulla', icon: Undo2, shortcut: 'Control+Z', run: () => chain().undo().run(), isDisabled: () => !editor.can().undo() },
			{ id: 'redo', priority: 0, label: 'Ripristina', icon: Redo2, shortcut: 'Control+Shift+Z', run: () => chain().redo().run(), isDisabled: () => !editor.can().redo() },
			{ id: 'p', label: 'Testo normale', icon: Pilcrow, startsGroup: true, secondary: true, run: () => chain().setParagraph().run(), isActive: plain },
			{ id: 'h1', priority: 2.5, label: 'Titolo', icon: Heading1, run: () => chain().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive('heading', { level: 1 }) },
			{ id: 'h2', priority: 2, label: 'Sottotitolo', icon: Heading2, run: () => chain().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive('heading', { level: 2 }) },
			{ id: 'h3', priority: 1, label: 'Titoletto', icon: Heading3, run: () => chain().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive('heading', { level: 3 }) },
			{ id: 'bold', priority: 6, label: 'Grassetto', icon: Bold, shortcut: 'Control+B', startsGroup: true, run: () => chain().toggleBold().run(), isActive: () => editor.isActive('bold') },
			{ id: 'italic', priority: 5, label: 'Corsivo', icon: Italic, shortcut: 'Control+I', run: () => chain().toggleItalic().run(), isActive: () => editor.isActive('italic') },
			{ id: 'strike', label: 'Barrato', icon: Strikethrough, shortcut: 'Control+Shift+S', secondary: true, run: () => chain().toggleStrike().run(), isActive: () => editor.isActive('strike') },
			{ id: 'ul', priority: 4, label: 'Elenco puntato', icon: List, startsGroup: true, run: () => chain().toggleBulletList().run(), isActive: () => editor.isActive('bulletList') },
			{ id: 'ol', priority: 3.5, label: 'Elenco numerato', icon: ListOrdered, run: () => chain().toggleOrderedList().run(), isActive: () => editor.isActive('orderedList') },
			{ id: 'quote', label: 'Citazione', icon: Quote, secondary: true, run: () => chain().toggleBlockquote().run(), isActive: () => editor.isActive('blockquote') },
			{ id: 'code', label: 'Codice', icon: Code, secondary: true, run: () => chain().toggleCode().run(), isActive: () => editor.isActive('code') },
			{
				id: 'math',
				priority: 3,
				label: 'Formula nel testo',
				icon: Sigma,
				startsGroup: true,
				run: () => {
					const pos = editor.state.selection.from;
					editor.chain().focus().insertInlineMath({ latex: '' }).run();
					setMathTarget({ latex: '', pos, block: false, page: active });
				}
			},
			{
				id: 'block-math',
				label: 'Formula su una riga a parte',
				icon: SquareSigma,
				secondary: true,
				run: () => {
					const pos = editor.state.selection.from;
					editor.chain().focus().insertBlockMath({ latex: '' }).run();
					setMathTarget({ latex: '', pos, block: true, page: active });
				}
			},
			{ id: 'link', label: 'Collegamento', icon: Link2, shortcut: 'Control+K', secondary: true, run: () => setLinking(editor), isActive: () => editor.isActive('link') },
			{ id: 'stickers', priority: 1.5, label: 'Adesivi', icon: Sticker, startsGroup: true, run: () => setAlbum(true) },
			{ id: 'page', priority: 1.5, label: 'Nuova pagina', icon: Plus, shortcut: 'Control+Enter', run: () => runPageOp({ kind: 'add', at: activeIndex + 1 }), isDisabled: () => pageCount >= MAX_PAGES }
		];
	}, [editor, active, activeIndex, pageCount, runPageOp]);

	// Ctrl+K opens the link dialog wherever the caret is.
	useEffect(() => {
		if (!editor) return;
		const dom = editor.view.dom;
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				e.stopPropagation();
				setLinking(editor);
			}
		};
		dom.addEventListener('keydown', onKey);
		return () => dom.removeEventListener('keydown', onKey);
	}, [editor]);

	const holdingId = Object.entries(boards).find(([, b]) => b.holding)?.[0];
	const holding = holdingId ? boards[holdingId] : null;
	const tone = paperTone(paper.color);
	const onNewPage = useCallback((at: number) => runPageOp({ kind: 'add', at }), [runPageOp]);
	const onBoard = useCallback((id: string, state: BoardState) => setBoards((b) => ({ ...b, [id]: state })), []);

	return (
		<div className="relative flex min-h-0 flex-1 flex-col">
			<p id="simple-editor-help" className="sr-only">
				Modalità Semplice. Usa la barra degli strumenti o le scorciatoie: {mod}+B grassetto, {mod}+I corsivo, {mod}+Invio nuova pagina. Scrivi il simbolo del dollaro attorno a una formula.
			</p>

			<div
				ref={scroller}
				onScroll={track}
				className={cn('min-h-0 flex-1 overflow-auto bg-surface-2 px-3 pb-8 pt-4 sm:px-8 sm:pt-6', !md && 'pb-24', md && dock === 'bottom' && (coarse ? 'pb-32' : 'pb-28'), sideDock && 'px-22')}
			>
				{frozen.length > 0 && (
					<div className="mx-auto mb-4" style={{ width: SHEET_WIDTH * zoom, maxWidth: '100%' }}>
						<Card tone="warn" className="note-in flex items-start gap-3 p-3.5 text-sm">
							<Lock className="mt-0.5 size-4 shrink-0 text-warn-fg" aria-hidden="true" />
							<p className="min-w-0 text-fg-muted">
								{describeFrozen(frozen)} in questa nota {frozen.length === 1 && frozen[0].count === 1 ? 'non si modifica' : 'non si modificano'} qui.{' '}
								<button type="button" onClick={onSwitchToAdvanced} className="rounded font-semibold text-accent-fg underline underline-offset-2 focus-ring">
									Passa ad Avanzata
								</button>
							</p>
						</Card>
					</div>
				)}

				<div className="flex flex-col items-center gap-3">
					{entries.map((entry, i) => (
						<div key={entry.id} className="flex flex-col items-center gap-2">
							<PageSheet
								id={entry.id}
								index={i}
								initial={entry.initial}
								paper={paper}
								tone={tone}
								zoom={zoom}
								last={i === entries.length - 1}
								onUpdate={onPageUpdate}
								onRegister={onRegister}
								onFocus={setActive}
								onNavigate={onNavigate}
								onMathClick={setMathTarget}
								onEditSource={onSwitchToAdvanced}
								onNewPage={onNewPage}
								stickers={readPageStickers}
								onStickersChange={onPageStickers}
								onBoard={onBoard}
							/>
							<p className="label-mono text-[11px] text-fg-subtle" aria-hidden="true">
								{i + 1} / {entries.length}
							</p>
						</div>
					))}

					{entries.length < MAX_PAGES && (
						<button
							type="button"
							onClick={() => runPageOp({ kind: 'add', at: list.current.length })}
							style={{ width: SHEET_WIDTH * zoom, maxWidth: '100%' }}
							className="group mb-2 flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-edge-strong text-sm font-medium text-fg-muted transition-colors hover:border-accent hover:bg-surface hover:text-accent-fg focus-ring"
						>
							<Plus className="size-4 transition-transform group-hover:scale-110" aria-hidden="true" />
							Nuova pagina
						</button>
					)}
				</div>
			</div>

			<EditorToolbar actions={actions} />

			{/* What the hands can do while a sticker is held, and the way out. */}
			{holding && (
				<div className="pointer-events-none absolute inset-x-0 top-3 z-40 flex justify-center px-3">
					<HoldingHint
						state={holding}
						coarse={coarse}
						onPutAway={() => handles.current.get(holdingId ?? '')?.stickers.current?.putAway()}
						onResize={(f) => handles.current.get(holdingId ?? '')?.stickers.current?.resize(f)}
					/>
				</div>
			)}

			{/* A phone shows the whole sheet small (decision of 2026-09-24): full size is for writing, scrolling sideways. */}
			{!md && fit < 0.95 && !holding && (
				<button
					type="button"
					onClick={() => setZoom(zoomSetting === 'fit' ? 1 : 'fit')}
					aria-pressed={zoomSetting !== 'fit'}
					className="absolute bottom-[calc(var(--spacing-tabbar)+var(--safe-b)+0.75rem)] right-3 z-30 flex min-h-11 items-center rounded-full border border-edge bg-surface/95 px-4 text-sm font-medium text-fg shadow-lift backdrop-blur-sm focus-ring"
				>
					{zoomSetting !== 'fit' ? 'Pagina intera' : 'Scrivi più grande'}
				</button>
			)}

			<StickerAlbum
				open={album}
				onClose={() => setAlbum(false)}
				onPick={(id) => {
					setAlbum(false);
					// Onto the page in view, where the student is looking.
					const entry = list.current[useNoteView.getState().page] ?? list.current[0];
					handles.current.get(entry.id)?.stickers.current?.pick(id);
				}}
			/>

			<LinkDialog editor={linking} onClose={() => setLinking(null)} />

			<MathPopover
				target={mathTarget}
				katex={katex}
				onSave={(latex) => {
					const target = handles.current.get(mathTarget?.page ?? '')?.editor;
					if (!mathTarget || !target) return;
					const command = mathTarget.block ? 'updateBlockMath' : 'updateInlineMath';
					target.chain().focus()[command]({ latex, pos: mathTarget.pos }).run();
					setMathTarget(null);
				}}
				onDelete={() => {
					const target = handles.current.get(mathTarget?.page ?? '')?.editor;
					if (!mathTarget || !target) return;
					const command = mathTarget.block ? 'deleteBlockMath' : 'deleteInlineMath';
					target.chain().focus()[command]({ pos: mathTarget.pos }).run();
					setMathTarget(null);
				}}
				onClose={() => setMathTarget(null)}
			/>
		</div>
	);
}

/** One page: a sheet with its editor and its sticker board. */
function PageSheet({
	id,
	index,
	initial,
	paper,
	tone,
	zoom,
	last,
	onUpdate,
	onRegister,
	onFocus,
	onNavigate,
	onMathClick,
	onEditSource,
	onNewPage,
	stickers,
	onStickersChange,
	onBoard
}: {
	id: string;
	index: number;
	initial: string;
	paper: Paper;
	tone: 'light' | 'dark' | null;
	zoom: number;
	last: boolean;
	onUpdate: (id: string, markdown: string) => void;
	onRegister: (id: string, handle: PageHandle | null) => void;
	onFocus: (id: string) => void;
	onNavigate: (index: number, where: 'start' | 'end') => void;
	onMathClick: (target: MathTarget & { page: string }) => void;
	onEditSource: () => void;
	onNewPage: (at: number) => void;
	stickers: (id: string) => PlacedSticker[];
	onStickersChange: (id: string, stickers: PlacedSticker[]) => void;
	onBoard: (id: string, state: BoardState) => void;
}) {
	const sheet = useRef<HTMLDivElement>(null);
	const controls = useRef<StickerControls | null>(null);
	const edited = useRef(false);
	const migrating = useRef(false);
	// The page as the serializer first sees it: a transaction that leaves it so is not an edit.
	const baseline = useRef<string | null>(null);

	// Everything the editor is created with depends on `id`, which a page keeps for life.
	const editor = useEditor({
		extensions: noteExtensions({
			onMathClick: (latex, pos, block) => onMathClick({ latex, pos, block, page: id }),
			onEditSource,
		}),
		content: initial,
		contentType: 'markdown',
		editorProps: {
			attributes: {
				role: 'textbox',
				'aria-multiline': 'true',
				'aria-describedby': 'simple-editor-help',
				class: 'markdown-content note-body min-h-[40rem] py-(--row) outline-none'
			}
		},
		// A `$…$` the tokenizer did not claim is still math: converting it now stops
		// the first serialization escaping the backslashes inside it. That
		// conversion is not an edit: a note that is only opened is never written back.
		onCreate: ({ editor }) => {
			migrating.current = true;
			migrateMathStrings(editor);
			migrating.current = false;
			baseline.current ??= tidy(editor.getMarkdown());
		},
		onFocus: () => onFocus(id),
		onUpdate: ({ editor }) => {
			if (migrating.current) return;
			const markdown = tidy(editor.getMarkdown());
			// Node views settling after a page mounts send transactions too; only a real change counts.
			// A page mounted by a page operation can settle before `onCreate` has run: that first pass is the baseline.
			if (!edited.current && baseline.current === null) {
				baseline.current = markdown;
				return;
			}
			if (!edited.current && markdown === baseline.current) return;
			edited.current = true;
			onUpdate(id, markdown);
		}
	});

	/*
	 * What changes when pages move: the page's name, and the keys that cross to
	 * the next page (Ctrl+Enter adds one; the arrows at the first or last line
	 * of a page move to the page before or after).
	 */
	useEffect(() => {
		if (!editor) return;
		// The attributes were applied when the editor was made; the name is set on the node itself.
		editor.view.dom.setAttribute('aria-label', `Testo della nota, pagina ${index + 1}`);
		editor.setOptions({
			editorProps: {
				...editor.options.editorProps,
				handleKeyDown: (view, event) => {
					if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
						event.preventDefault();
						onNewPage(index + 1);
						return true;
					}
					if (event.shiftKey || event.altKey || event.metaKey || event.ctrlKey) return false;
					const { $head, empty } = view.state.selection;
					if (!empty) return false;
					const doc = view.state.doc;
					if (event.key === 'ArrowDown' && !last && $head.index(0) === doc.childCount - 1 && view.endOfTextblock('down')) {
						event.preventDefault();
						onNavigate(index + 1, 'start');
						return true;
					}
					if (event.key === 'ArrowUp' && index > 0 && $head.index(0) === 0 && view.endOfTextblock('up')) {
						event.preventDefault();
						onNavigate(index - 1, 'end');
						return true;
					}
					return false;
				}
			}
		});
	}, [editor, index, last, onNavigate, onNewPage]);

	useEffect(() => {
		if (!editor) return;
		onRegister(id, {
			editor,
			getMarkdown: () => (edited.current ? tidy(editor.getMarkdown()) : initial),
			sheet: sheet.current,
			stickers: controls
		});
		return () => onRegister(id, null);
	}, [editor, id, initial, onRegister]);

	const readStickers = useCallback(() => stickers(id), [stickers, id]);
	const changeStickers = useCallback((next: PlacedSticker[]) => onStickersChange(id, next), [onStickersChange, id]);
	const boardState = useCallback((state: BoardState) => onBoard(id, state), [onBoard, id]);

	return (
		<div
			ref={sheet}
			{...paperData(paper)}
			data-page-index={index}
			className={cn('note-sheet note-paper note-lined relative bg-surface shadow-lift dark:ring-1 dark:ring-edge-strong', tone && `paper-${tone}`)}
			style={{ ...paperStyle(paper), width: SHEET_WIDTH, minHeight: SHEET_MIN_HEIGHT, zoom }}
			onMouseDown={(e) => {
				// A click on the empty paper below the text puts the caret at the end, as on paper.
				if (e.target === e.currentTarget && editor) {
					e.preventDefault();
					editor.commands.focus('end');
				}
			}}
		>
			<div className="px-[calc(2*var(--row))] pt-[calc(2*var(--row))] pb-16">
				<EditorContent editor={editor} />
			</div>
			<NoteStickers sheet={sheet} initial={readStickers} onChange={changeStickers} onState={boardState} ref={controls} />
		</div>
	);
}
