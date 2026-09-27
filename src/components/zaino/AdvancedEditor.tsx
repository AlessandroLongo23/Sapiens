'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Bold, Braces, Code, Eye, FilePlus2, Heading1, Heading2, Heading3, Italic, List, ListOrdered, PenLine, Quote, Redo2, Sigma, SquareSigma, Sticker, Strikethrough, Undo2 } from 'lucide-react';
import { applyEdit, continueList, indent, toggleLinePrefix, toggleWrap, type Edit } from '@/lib/zaino/textarea';
import { PAGE_BREAK, splitPages } from '@/lib/zaino/pages';
import { paperData, paperStyle, paperTone, type Paper } from '@/lib/zaino/paper';
import { useCoarsePointer, useMd } from '@/lib/hooks/use-media';
import { useNoteView } from '@/lib/state/note-view';
import { cn } from '@/lib/utils/cn';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { EditorToolbar, type ToolbarAction } from './EditorToolbar';
import { NotePreview } from './NotePreview';
import { HoldingHint, NoteStickers, StickerAlbum, type StickerControls } from './NoteStickers';
import { syncHeading } from './OutlinePanel';
import { outline, sourceAnchors, titleOffset } from '@/lib/zaino/outline';
import { headingAt, scrollToHeading } from '@/lib/zaino/outline-dom';
import { SHEET_MIN_HEIGHT, SHEET_WIDTH, type PlacedSticker } from '@/lib/zaino/stickers';
import type { BoardState } from '@/lib/zaino/sticker-board';

const withoutPage = ({ page: _page, ...s }: PlacedSticker): PlacedSticker => s;

/** Points [source y, preview y] that stand level, and a y of one pane carried to the other along them. */
type Level = [number, number];
function carry(levels: Level[], y: number, from: 0 | 1): number {
	const to = from === 0 ? 1 : 0;
	let i = 0;
	while (i < levels.length - 1 && levels[i + 1][from] <= y) i++;
	const a = levels[i];
	const b = levels[i + 1];
	// Past the last point, or between two at the same height: the panes move together one to one.
	if (!b || b[from] === a[from]) return a[to] + (y - a[from]);
	return a[to] + ((y - a[from]) / (b[from] - a[from])) * (b[to] - a[to]);
}

/**
 * The Obsidian-like mode: the markdown source, exactly as it is stored. A
 * plain textarea on purpose — it inherits the phone's own text engine
 * (selection handles, autocorrect, dictation, swipe typing), which a
 * contenteditable editor has to reimplement and gets wrong on iOS. It is also
 * the safety valve: whatever the WYSIWYG serializer does to a document, this
 * is where the student can see it and put it right.
 *
 * The textarea grows with its text, so the column around it scrolls the text
 * and its paper together. The preview is the note's pages, as in the Simple
 * editor and zoomed to fit, with their stickers; the two panes scroll
 * together, level at every title and page break.
 */
export function AdvancedEditor({
	value,
	onChange,
	paper,
	stickers,
	onStickersChange
}: {
	value: string;
	onChange: (markdown: string) => void;
	paper: Paper;
	/** The note's saved stickers, read when the pages mount. */
	stickers: () => PlacedSticker[];
	onStickersChange: (stickers: PlacedSticker[]) => void;
}) {
	const area = useRef<HTMLTextAreaElement>(null);
	// The column that scrolls the source, and a copy of the source laid out as the textarea lays it out, to measure it.
	const column = useRef<HTMLDivElement>(null);
	const mirror = useRef<HTMLDivElement>(null);
	// The outline follows the preview, and leads to a title in both panes.
	const preview = useRef<HTMLDivElement>(null);
	const jump = useNoteView((s) => s.headingJump);
	const settle = useRef<ResizeObserver | null>(null);
	const valueNow = useRef(value);
	useEffect(() => {
		valueNow.current = value;
	});

	/*
	 * A title picked in the outline, or the place to return to after a change
	 * of mode: the caret goes to the start of that line in the source, which
	 * the textarea scrolls into view, and the preview scrolls to the title.
	 * Either pane may be hidden on a narrow screen; the one on screen moves.
	 */
	useEffect(() => {
		if (!jump) return;
		const text = valueNow.current;
		const entry = jump.index >= 0 ? outline(text).find((e) => e.page === jump.page && e.index === jump.index) : null;
		const offset = titleOffset(text, jump.page, entry?.line ?? 0);
		const el = area.current;
		const sourceShown = !!el && el.getClientRects().length > 0;
		if (el && sourceShown) {
			if (!jump.instant) el.focus({ preventScroll: true });
			el.setSelectionRange(offset, offset);
			// The title's line near the top of the column; the preview follows (see `follow`).
			const line = text.slice(0, offset).split('\n').length - 1;
			const mark = mirror.current?.querySelector<HTMLElement>(`[data-line="${line}"]`);
			const row = parseFloat(getComputedStyle(el).lineHeight) || 24;
			const top = mark ? mark.offsetTop : line * row;
			column.current?.scrollTo({ top: Math.max(0, top - row), behavior: jump.instant || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
		}
		useNoteView.getState().clearHeadingJump();
		if (sourceShown) return;
		// The preview alone, on a narrow screen.
		const pane = preview.current;
		if (!pane) return;
		scrollToHeading(pane, jump.page, jump.index, jump.instant);
		/*
		 * The preview typesets its formulas after it mounts, and every one moves
		 * the titles below it: for a moment the title is followed as the preview
		 * grows. The observer is kept apart from this effect, whose cleanup runs
		 * as soon as the request is cleared.
		 */
		settle.current?.disconnect();
		const until = Date.now() + 1500;
		const follow = new ResizeObserver(() => {
			if (Date.now() > until) return follow.disconnect();
			scrollToHeading(pane, jump.page, jump.index, true);
		});
		if (pane.firstElementChild) follow.observe(pane.firstElementChild);
		settle.current = follow;
	}, [jump]);
	useEffect(() => () => settle.current?.disconnect(), []);
	useEffect(() => {
		const early = setTimeout(() => syncHeading(preview.current), 250);
		const late = setTimeout(() => syncHeading(preview.current), 1200);
		return () => {
			clearTimeout(early);
			clearTimeout(late);
		};
	}, []);
	const [pane, setPane] = useState<'write' | 'preview'>('write');
	const md = useMd();
	const dock = useNoteView((s) => s.dock);
	const pages = useMemo(() => splitPages(value), [value]);
	const tone = paperTone(paper.color);
	const surface = { ...paperData(paper), style: paperStyle(paper) };
	const anchors = useMemo(() => sourceAnchors(value), [value]);

	/*
	 * The copy of the source, with a mark at the start of every line that has
	 * a counterpart in the preview and one at the end. The textarea takes the
	 * copy's height, so it never scrolls on its own and never has to shrink to
	 * be measured, which would make the column jump while typing.
	 */
	useLayoutEffect(() => {
		const m = mirror.current;
		const el = area.current;
		if (!m || !el) return;
		const lines = value.replace(/\r\n?/g, '\n').split('\n');
		const marks = new Map(anchors.map((a) => [a.line, a]));
		m.replaceChildren();
		let chunk: string[] = [];
		const flush = () => {
			if (chunk.length) m.append(chunk.join('\n') + '\n');
			chunk = [];
		};
		lines.forEach((l, i) => {
			const a = marks.get(i);
			if (a) {
				flush();
				const mark = document.createElement('span');
				mark.dataset.line = String(i);
				mark.dataset.page = String(a.page);
				mark.dataset.index = String(a.index);
				m.append(mark);
			}
			chunk.push(l);
		});
		flush();
		const end = document.createElement('span');
		end.dataset.end = '';
		m.append(end, '\u200b');
		el.style.height = `${m.offsetHeight}px`;
	}, [value, anchors, paper]);
	// A wider or narrower column wraps the lines again.
	useEffect(() => {
		const m = mirror.current;
		if (!m) return;
		const observer = new ResizeObserver(() => area.current && (area.current.style.height = `${m.offsetHeight}px`));
		observer.observe(m);
		return () => observer.disconnect();
	}, []);

	/*
	 * The two panes scroll together, whichever is scrolled: the point at the
	 * top of one is carried to the other along the titles and page breaks
	 * both have (Level). The pane that follows ignores the scroll it was
	 * given for a moment, or the two would drive each other.
	 */
	const lead = useRef<'source' | 'preview'>('source');
	const quiet = useRef({ source: 0, preview: 0 });
	const levels = useCallback((): Level[] => {
		const src = column.current;
		const pane = preview.current;
		const m = mirror.current;
		if (!src || !pane || !m || src.clientHeight === 0 || pane.clientHeight === 0) return [];
		const top = pane.getBoundingClientRect().top - pane.scrollTop;
		const out: Level[] = [[0, 0]];
		const push = (a: number, b: number) => {
			const last = out[out.length - 1];
			if (a >= last[0] && b >= last[1]) out.push([a, b]);
		};
		m.querySelectorAll<HTMLElement>('[data-line]').forEach((mark) => {
			const page = Number(mark.dataset.page);
			const index = Number(mark.dataset.index);
			const el = index < 0 ? pane.querySelector<HTMLElement>(`[data-page-index="${page}"]`) : headingAt(pane, page, index);
			if (el) push(mark.offsetTop, el.getBoundingClientRect().top - top - (index < 0 ? 12 : 0));
		});
		const end = m.querySelector<HTMLElement>('[data-end]');
		const sheets = pane.querySelectorAll<HTMLElement>('[data-page-index]');
		const last = sheets[sheets.length - 1];
		if (end && last) push(end.offsetTop, last.getBoundingClientRect().bottom - top);
		return out;
	}, []);
	const follow = useCallback(
		(from: 'source' | 'preview') => {
			const a = from === 'source' ? column.current : preview.current;
			const b = from === 'source' ? preview.current : column.current;
			if (!a || !b) return;
			const to = from === 'source' ? 'preview' : 'source';
			const points = levels();
			if (points.length < 2) return;
			const y = Math.max(0, Math.min(carry(points, a.scrollTop, from === 'source' ? 0 : 1), b.scrollHeight - b.clientHeight));
			if (Math.abs(b.scrollTop - y) < 1) return;
			quiet.current[to] = performance.now() + 80;
			b.scrollTop = y;
		},
		[levels]
	);
	const onPaneScroll = (from: 'source' | 'preview') => {
		if (performance.now() < quiet.current[from]) return;
		lead.current = from;
		follow(from);
	};
	// The preview grows as formulas are typeset and text is typed: the pane led by the other catches up.
	useEffect(() => {
		const content = preview.current?.firstElementChild;
		if (!content) return;
		const observer = new ResizeObserver(() => follow(lead.current));
		observer.observe(content);
		return () => observer.disconnect();
	}, [follow]);

	// The pages at the width of the preview, zoomed as in the Simple editor, so the stickers land where they do there.
	const [zoom, setZoom] = useState(0);
	useEffect(() => {
		const el = preview.current;
		if (!el) return;
		const measure = () => el.clientWidth && setZoom(Math.min(1, (el.clientWidth - 32) / SHEET_WIDTH));
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		measure();
		return () => observer.disconnect();
	}, [pane]);

	/*
	 * Stickers, one board per page as in the Simple editor. The set is read
	 * once, then kept here: a sticker saved on a page past the last one shows
	 * on the last page, and is saved there once that page's stickers change.
	 */
	const coarse = useCoarsePointer();
	const [album, setAlbum] = useState(false);
	const [boards, setBoards] = useState<Record<number, BoardState>>({});
	const boardControls = useRef(new Map<number, StickerControls>());
	const placed = useRef<PlacedSticker[] | null>(null);
	const pageCount = useRef(pages.length);
	useEffect(() => {
		pageCount.current = pages.length;
	});
	const onPage = (s: PlacedSticker, i: number) => Math.min(s.page ?? 0, pageCount.current - 1) === i;
	const readPage = useCallback((i: number) => (placed.current ??= stickers()).filter((s) => onPage(s, i)).map(withoutPage), [stickers]);
	const changePage = useCallback(
		(i: number, next: PlacedSticker[]) => {
			placed.current = [...(placed.current ??= stickers()).filter((s) => !onPage(s, i)), ...next.map((s) => ({ ...s, page: i }))];
			onStickersChange(placed.current);
		},
		[stickers, onStickersChange]
	);
	const onBoard = useCallback((i: number, state: BoardState) => setBoards((b) => ({ ...b, [i]: state })), []);
	const holdingPage = Object.entries(boards).find(([, b]) => b.holding)?.[0];
	const holding = holdingPage === undefined ? null : boards[Number(holdingPage)];
	/** The page crossing the upper third of the preview, where the student is looking. */
	const pageInView = () => {
		const el = preview.current;
		if (!el) return 0;
		const line = el.getBoundingClientRect().top + el.clientHeight / 3;
		let current = 0;
		el.querySelectorAll<HTMLElement>('[data-page-index]').forEach((sheet, i) => {
			if (sheet.getBoundingClientRect().top <= line) current = i;
		});
		return current;
	};

	const edit = (make: (text: string, start: number, end: number) => Edit | null) => {
		const el = area.current;
		if (!el) return;
		const next = make(el.value, el.selectionStart, el.selectionEnd);
		if (!next) return;
		applyEdit(el, next);
		onChange(next.text);
	};

	const wrap = (pair: string) => edit((t, s, e) => toggleWrap(t, s, e, pair));
	const prefix = (p: string) => edit((t, s, e) => toggleLinePrefix(t, s, e, p));

	/** The textarea's own history: execCommand keeps every edit on it (see applyEdit). */
	const history = (command: 'undo' | 'redo') => {
		area.current?.focus();
		document.execCommand(command);
	};

	// The same order as the Simple editor's toolbar, so the buttons stay put across a switch.
	const actions: ToolbarAction[] = [
		{ id: 'undo', priority: 6, label: 'Annulla', icon: Undo2, shortcut: 'Control+Z', run: () => history('undo') },
		{ id: 'redo', priority: 0, label: 'Ripristina', icon: Redo2, shortcut: 'Control+Shift+Z', run: () => history('redo') },
		{ id: 'h1', priority: 2.5, label: 'Titolo', icon: Heading1, startsGroup: true, run: () => prefix('# ') },
		{ id: 'h2', priority: 2, label: 'Sottotitolo', icon: Heading2, run: () => prefix('## ') },
		{ id: 'h3', priority: 1, label: 'Titoletto', icon: Heading3, run: () => prefix('### ') },
		{ id: 'bold', priority: 6, label: 'Grassetto', icon: Bold, shortcut: 'Control+B', startsGroup: true, run: () => wrap('**') },
		{ id: 'italic', priority: 5, label: 'Corsivo', icon: Italic, shortcut: 'Control+I', run: () => wrap('*') },
		{ id: 'strike', label: 'Barrato', icon: Strikethrough, secondary: true, run: () => wrap('~~') },
		{ id: 'ul', priority: 4, label: 'Elenco puntato', icon: List, startsGroup: true, run: () => prefix('- ') },
		{ id: 'ol', priority: 3.5, label: 'Elenco numerato', icon: ListOrdered, run: () => prefix('1. ') },
		{ id: 'quote', label: 'Citazione', icon: Quote, secondary: true, run: () => prefix('> ') },
		{ id: 'code', label: 'Codice', icon: Code, secondary: true, run: () => wrap('`') },
		{ id: 'fence', label: 'Blocco di codice', icon: Braces, secondary: true, run: () => wrap('\n```\n') },
		{ id: 'math', priority: 3, label: 'Formula nel testo', icon: Sigma, startsGroup: true, run: () => wrap('$') },
		{ id: 'block-math', label: 'Formula su una riga a parte', icon: SquareSigma, secondary: true, run: () => wrap('\n$$\n') },
		{ id: 'stickers', priority: 1.5, label: 'Adesivi', icon: Sticker, startsGroup: true, run: () => setAlbum(true) },
		// A page break where the caret is: the text after it starts the next page.
		{ id: 'page', priority: 1.5, label: 'Interruzione di pagina', icon: FilePlus2, shortcut: 'Control+Enter', run: () => pageBreak() }
	];

	function pageBreak() {
		edit((t, s, e) => {
			const before = t.slice(0, s).replace(/\s*$/, '');
			const after = t.slice(e).replace(/^\s*/, '');
			const text = `${before}${before ? '\n\n' : ''}${PAGE_BREAK}\n\n${after}`;
			const caret = text.length - after.length;
			return { text, start: caret, end: caret };
		});
	}

	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		const mod = e.metaKey || e.ctrlKey;
		if (mod && e.key === 'Enter') {
			e.preventDefault();
			return pageBreak();
		}
		if (mod && e.key.toLowerCase() === 'b') {
			e.preventDefault();
			return wrap('**');
		}
		if (mod && e.key.toLowerCase() === 'i') {
			e.preventDefault();
			return wrap('*');
		}
		if (e.key === 'Enter' && !mod) {
			const el = e.currentTarget;
			const next = continueList(el.value, el.selectionStart, el.selectionEnd);
			if (!next) return;
			e.preventDefault();
			applyEdit(el, next);
			onChange(next.text);
			return;
		}
		if (e.key === 'Tab') {
			const el = e.currentTarget;
			const next = indent(el.value, el.selectionStart, el.selectionEnd, e.shiftKey);
			// No list and no multi-line selection: Tab moves the focus, or the
			// textarea becomes a keyboard trap.
			if (!next) return;
			e.preventDefault();
			applyEdit(el, next);
			onChange(next.text);
		}
	};

	return (
		<div className="relative flex min-h-0 flex-1 flex-col">
			{/* Below lg the preview replaces the text; from lg up the two sit side by side. */}
			<div className="shrink-0 border-b border-edge-soft bg-surface px-4 py-2 lg:hidden">
				<ToggleGroup
					label="Scrittura o anteprima"
					value={pane}
					onChange={setPane}
					options={[
						{ value: 'write', label: 'Scrivi', icon: PenLine },
						{ value: 'preview', label: 'Anteprima', icon: Eye }
					]}
				/>
			</div>

			<div className={cn('flex min-h-0 flex-1 lg:divide-x lg:divide-edge', md && dock === 'left' && 'pl-18', md && dock === 'right' && 'pr-18')}>
				{/* The paper is on the textarea, as tall as its text: the column scrolls both. */}
				<div ref={column} onScroll={() => onPaneScroll('source')} className={cn('relative min-h-0 flex-1 overflow-y-auto', pane === 'preview' && 'hidden lg:block')}>
					<label htmlFor="note-source" className="sr-only">
						Testo della nota in markdown. Scrivi ### per un titolo, - per un elenco, $ attorno a una formula. Ctrl+Invio interrompe la pagina. Tab rientra dentro un elenco.
					</label>
					<textarea
						id="note-source"
						ref={area}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						onKeyDown={onKeyDown}
						spellCheck
						{...surface}
						className={cn(
							'note-paper note-lined note-source block min-h-full w-full resize-none overflow-hidden border-0 bg-surface px-(--row) pb-[60vh] pt-(--row) font-mono text-fg caret-crimson-500 outline-none ring-0 placeholder:text-fg-faint focus:ring-0',
							tone && `paper-${tone}`
						)}
						placeholder="# Titolo della nota&#10;&#10;Scrivi qui. Usa ## per i sottotitoli, - per un elenco e $x^2$ per una formula."
					/>
					<div
						ref={mirror}
						aria-hidden="true"
						{...surface}
						className="note-lined note-source pointer-events-none invisible absolute inset-x-0 top-0 whitespace-pre-wrap break-words px-(--row) pb-[60vh] pt-(--row) font-mono"
					/>
				</div>
				<div
					ref={preview}
					onScroll={() => {
						onPaneScroll('preview');
						syncHeading(preview.current);
					}}
					className={cn('min-h-0 flex-1 overflow-auto bg-surface-2 px-4 pt-4', pane === 'write' && 'hidden lg:block')}
				>
					{/* It scrolls past its end, so the last title too can come to the top when the outline leads to it. */}
					<div className="flex flex-col items-center gap-3 pb-[70vh]">
						{zoom > 0 &&
							pages.map((page, i) => (
								<div key={i} className="flex flex-col items-center gap-2">
									<PreviewSheet
										index={i}
										markdown={page}
										paper={paper}
										tone={tone}
										zoom={zoom}
										boardKey={pages.length}
										readStickers={readPage}
										onStickersChange={changePage}
										onBoard={onBoard}
										controls={boardControls.current}
									/>
									{pages.length > 1 && (
										<p className="label-mono text-[11px] text-fg-subtle" aria-hidden="true">
											{i + 1} / {pages.length}
										</p>
									)}
								</div>
							))}
					</div>
				</div>
			</div>

			{holding && holdingPage !== undefined && (
				<div className="pointer-events-none absolute inset-x-0 top-3 z-40 flex justify-center px-3">
					<HoldingHint
						state={holding}
						coarse={coarse}
						onPutAway={() => boardControls.current.get(Number(holdingPage))?.putAway()}
						onResize={(f) => boardControls.current.get(Number(holdingPage))?.resize(f)}
					/>
				</div>
			)}

			<StickerAlbum
				open={album}
				onClose={() => setAlbum(false)}
				description="Scegli un adesivo, poi attaccalo dove vuoi sul foglio dell’anteprima."
				onPick={(id) => {
					setAlbum(false);
					// On a narrow screen the stickers go on the preview, so it comes into view.
					setPane('preview');
					requestAnimationFrame(() => boardControls.current.get(pageInView())?.pick(id));
				}}
			/>

			<EditorToolbar actions={actions} />
		</div>
	);
}

/** One page of the preview: the Simple editor's sheet, drawn from the markdown, with its sticker board. */
function PreviewSheet({
	index,
	markdown,
	paper,
	tone,
	zoom,
	boardKey,
	readStickers,
	onStickersChange,
	onBoard,
	controls
}: {
	index: number;
	markdown: string;
	paper: Paper;
	tone: 'light' | 'dark' | null;
	zoom: number;
	/** Changes when pages come or go, for the board to read its stickers again. */
	boardKey: number;
	readStickers: (index: number) => PlacedSticker[];
	onStickersChange: (index: number, stickers: PlacedSticker[]) => void;
	onBoard: (index: number, state: BoardState) => void;
	controls: Map<number, StickerControls>;
}) {
	const sheet = useRef<HTMLDivElement>(null);
	const initial = useCallback(() => readStickers(index), [readStickers, index]);
	const change = useCallback((next: PlacedSticker[]) => onStickersChange(index, next), [onStickersChange, index]);
	const state = useCallback((s: BoardState) => onBoard(index, s), [onBoard, index]);
	const handle = useCallback(
		(c: StickerControls | null) => {
			if (c) controls.set(index, c);
			else controls.delete(index);
		},
		[controls, index]
	);
	return (
		<section
			ref={sheet}
			{...paperData(paper)}
			data-page-index={index}
			aria-label={`Pagina ${index + 1}`}
			className={cn('note-sheet note-paper note-lined relative bg-surface shadow-lift dark:ring-1 dark:ring-edge-strong', tone && `paper-${tone}`)}
			style={{ ...paperStyle(paper), width: SHEET_WIDTH, minHeight: SHEET_MIN_HEIGHT, zoom }}
		>
			<div className="px-[calc(2*var(--row))] pt-[calc(2*var(--row))] pb-16">
				<NotePreview markdown={markdown} />
			</div>
			<NoteStickers key={boardKey} sheet={sheet} initial={initial} onChange={change} onState={state} ref={handle} />
		</section>
	);
}
