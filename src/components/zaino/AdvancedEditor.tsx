'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bold, Braces, Code, Eye, FilePlus2, Heading1, Heading2, Heading3, Italic, List, ListOrdered, PenLine, Quote, Redo2, Sigma, SquareSigma, Strikethrough, Undo2 } from 'lucide-react';
import { applyEdit, continueList, indent, toggleLinePrefix, toggleWrap, type Edit } from '@/lib/zaino/textarea';
import { PAGE_BREAK, splitPages } from '@/lib/zaino/pages';
import { paperData, paperStyle, paperTone, type Paper } from '@/lib/zaino/paper';
import { useMd } from '@/lib/hooks/use-media';
import { useNoteView } from '@/lib/state/note-view';
import { cn } from '@/lib/utils/cn';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { EditorToolbar, type ToolbarAction } from './EditorToolbar';
import { NotePreview } from './NotePreview';
import { syncHeading } from './OutlinePanel';
import { outline, titleOffset } from '@/lib/zaino/outline';
import { scrollToHeading } from '@/lib/zaino/outline-dom';

/**
 * The Obsidian-like mode: the markdown source, exactly as it is stored. A
 * plain textarea on purpose — it inherits the phone's own text engine
 * (selection handles, autocorrect, dictation, swipe typing), which a
 * contenteditable editor has to reimplement and gets wrong on iOS. It is also
 * the safety valve: whatever the WYSIWYG serializer does to a document, this
 * is where the student can see it and put it right.
 */
export function AdvancedEditor({ value, onChange, paper }: { value: string; onChange: (markdown: string) => void; paper: Paper }) {
	const area = useRef<HTMLTextAreaElement>(null);
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
		if (el && el.getClientRects().length > 0) {
			if (!jump.instant) el.focus({ preventScroll: true });
			el.setSelectionRange(offset, offset);
			// A caret line near the top: the textarea's own scroll, from the lines above it.
			const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
			const above = text.slice(0, offset).split('\n').length - 1;
			el.scrollTop = Math.max(0, above * lineHeight - lineHeight);
		}
		useNoteView.getState().clearHeadingJump();
		// The preview draws its formulas a moment after mounting, which moves the titles: it scrolls again once they are in.
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
		// A page break where the caret is: the text after it starts the next page.
		{ id: 'page', priority: 1.5, label: 'Interruzione di pagina', icon: FilePlus2, shortcut: 'Control+Enter', startsGroup: true, run: () => pageBreak() }
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
				{/* The squares are on the textarea, which scrolls its own text. */}
				<div className={cn('min-h-0 flex-1 overflow-y-auto', pane === 'preview' && 'hidden lg:block')}>
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
							'note-paper note-lined note-source block h-full min-h-[55vh] w-full resize-none border-0 bg-surface px-(--row) pb-[60vh] pt-(--row) font-mono text-fg caret-crimson-500 outline-none ring-0 placeholder:text-fg-faint focus:ring-0',
							tone && `paper-${tone}`
						)}
						placeholder="# Titolo della nota&#10;&#10;Scrivi qui. Usa ## per i sottotitoli, - per un elenco e $x^2$ per una formula."
					/>
				</div>
				<div
					ref={preview}
					onScroll={() => syncHeading(preview.current)}
					{...surface}
					className={cn('note-paper note-lined min-h-0 flex-1 overflow-y-auto bg-surface', tone && `paper-${tone}`, pane === 'write' && 'hidden lg:block')}
				>
					{/* It scrolls past its end, so the last title too can come to the top when the outline leads to it. */}
					<div className="px-(--row) pb-[70vh]">
						{pages.map((page, i) => (
							<section key={i} data-page-index={i} aria-label={pages.length > 1 ? `Pagina ${i + 1}` : undefined}>
								{i > 0 && (
									<div className="relative -mx-(--row) flex h-(--row) items-center gap-3 px-(--row)" aria-hidden="true">
										<span className="h-px flex-1 border-t border-dashed border-edge-strong" />
										<span className="label-mono text-[11px] text-fg-subtle">Pagina {i + 1}</span>
										<span className="h-px flex-1 border-t border-dashed border-edge-strong" />
									</div>
								)}
								<NotePreview markdown={page} />
							</section>
						))}
					</div>
				</div>
			</div>

			<EditorToolbar actions={actions} />
		</div>
	);
}
