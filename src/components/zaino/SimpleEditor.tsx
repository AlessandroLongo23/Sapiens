'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { migrateMathStrings } from '@tiptap/extension-mathematics';
import type katexType from 'katex';
import { Bold, Code, Heading1, Heading2, Heading3, Italic, Link2, List, ListOrdered, Lock, Quote, Redo2, Sigma, Sticker, Undo2 } from 'lucide-react';
import { noteExtensions } from '@/lib/zaino/extensions';
import { tidy } from '@/lib/zaino/markdown-tidy';
import { describeFrozen, frozenBlocks } from '@/lib/zaino/analyse';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCoarsePointer } from '@/lib/hooks/use-media';
import { SHEET_MIN_HEIGHT, SHEET_WIDTH, type PlacedSticker } from '@/lib/zaino/stickers';
import type { BoardState } from '@/lib/zaino/sticker-board';
import { NoteStickers, StickerAlbum, type StickerControls } from './NoteStickers';
import { EditorToolbar, type ToolbarAction } from './EditorToolbar';
import { MathPopover, type MathTarget } from './MathPopover';
import 'katex/dist/katex.min.css';

type Katex = typeof katexType;

let katexPromise: Promise<Katex> | null = null;
const loadKatex = () => (katexPromise ??= import('katex').then((m) => m.default));

/**
 * The Word-like mode. Formatting is applied to the text itself, so `###` is
 * never on screen; the same document is stored as markdown, which the Advanced
 * mode shows verbatim.
 *
 * The invariant that keeps the two honest: a note that was opened but not
 * edited is never written back. The serializer normalises escapes and entities
 * on every pass, so re-saving an untouched document would rewrite text the
 * student never touched. `onChange` therefore fires from `update` only, and
 * never from the initial `setContent`.
 *
 * The note is a sheet of fixed width (SHEET_WIDTH), zoomed to fit the screen,
 * so the text and the stickers on it sit in the same place on every device.
 * On a narrow screen the sheet can also be shown at full size, scrolling sideways.
 */
export function SimpleEditor({
	initialMarkdown,
	onChange,
	register,
	onSwitchToAdvanced,
	stickers,
	onStickersChange
}: {
	initialMarkdown: string;
	onChange: (markdown: string) => void;
	register: (getMarkdown: (() => string) | null) => void;
	onSwitchToAdvanced: () => void;
	/** The note's saved stickers, read when the sheet mounts. */
	stickers: () => PlacedSticker[];
	onStickersChange: (stickers: PlacedSticker[]) => void;
}) {
	const [katex, setKatex] = useState<Katex | null>(null);
	const [mathTarget, setMathTarget] = useState<MathTarget | null>(null);
	// The first document is the one to hand back untouched if nothing is edited.
	const pristine = useRef(initialMarkdown);
	const dirty = useRef(false);
	const scroller = useRef<HTMLDivElement>(null);
	const sheet = useRef<HTMLDivElement>(null);
	const stickerControls = useRef<StickerControls | null>(null);
	const [album, setAlbum] = useState(false);
	const [board, setBoard] = useState<BoardState>({ holding: null, placing: false, hovering: false });
	const coarse = useCoarsePointer();
	// The zoom at which the sheet fits the width, and whether a narrow screen shows it at full size instead.
	const [fit, setFit] = useState(1);
	const [fullSize, setFullSize] = useState(false);
	const zoom = fullSize ? 1 : fit;

	useEffect(() => {
		const el = scroller.current;
		if (!el) return;
		const measure = () => {
			const gutter = el.clientWidth < 640 ? 24 : 48;
			setFit(Math.min(1, (el.clientWidth - gutter) / SHEET_WIDTH));
		};
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		measure();
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		loadKatex().then(setKatex);
	}, []);

	const frozen = useMemo(() => frozenBlocks(initialMarkdown), [initialMarkdown]);

	const editor = useEditor({
		extensions: noteExtensions({
			onMathClick: (latex, pos, block) => setMathTarget({ latex, pos, block }),
			onEditSource: onSwitchToAdvanced
		}),
		content: initialMarkdown,
		contentType: 'markdown',
		editorProps: {
			attributes: {
				role: 'textbox',
				'aria-multiline': 'true',
				'aria-label': 'Testo della nota',
				'aria-describedby': 'simple-editor-help',
				class: 'markdown-content note-body min-h-[55vh] py-4 outline-none'
			}
		},
		// A `$…$` the tokenizer did not claim is still math: converting it now stops
		// the first serialization escaping the backslashes inside it.
		onCreate: ({ editor }) => migrateMathStrings(editor),
		onUpdate: ({ editor }) => {
			dirty.current = true;
			onChange(tidy(editor.getMarkdown()));
		}
	});

	const getMarkdown = useCallback(() => (dirty.current && editor ? tidy(editor.getMarkdown()) : pristine.current), [editor]);

	useEffect(() => {
		register(getMarkdown);
		return () => register(null);
	}, [register, getMarkdown]);

	const actions: ToolbarAction[] = useMemo(() => {
		if (!editor) return [];
		const chain = () => editor.chain().focus();
		return [
			{ id: 'undo', label: 'Annulla', icon: Undo2, shortcut: 'Control+Z', run: () => chain().undo().run(), isDisabled: () => !editor.can().undo() },
			{ id: 'redo', label: 'Ripristina', icon: Redo2, shortcut: 'Control+Shift+Z', run: () => chain().redo().run(), isDisabled: () => !editor.can().redo() },
			{ id: 'bold', label: 'Grassetto', icon: Bold, shortcut: 'Control+B', startsGroup: true, run: () => chain().toggleBold().run(), isActive: () => editor.isActive('bold') },
			{ id: 'italic', label: 'Corsivo', icon: Italic, shortcut: 'Control+I', run: () => chain().toggleItalic().run(), isActive: () => editor.isActive('italic') },
			{ id: 'h1', label: 'Titolo', icon: Heading1, startsGroup: true, run: () => chain().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive('heading', { level: 1 }) },
			{ id: 'h2', label: 'Sottotitolo', icon: Heading2, run: () => chain().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive('heading', { level: 2 }) },
			{ id: 'h3', label: 'Paragrafo', icon: Heading3, run: () => chain().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive('heading', { level: 3 }) },
			{ id: 'ul', label: 'Elenco puntato', icon: List, startsGroup: true, run: () => chain().toggleBulletList().run(), isActive: () => editor.isActive('bulletList') },
			{ id: 'ol', label: 'Elenco numerato', icon: ListOrdered, run: () => chain().toggleOrderedList().run(), isActive: () => editor.isActive('orderedList') },
			{ id: 'quote', label: 'Citazione', icon: Quote, startsGroup: true, run: () => chain().toggleBlockquote().run(), isActive: () => editor.isActive('blockquote') },
			{ id: 'code', label: 'Codice', icon: Code, run: () => chain().toggleCode().run(), isActive: () => editor.isActive('code') },
			{
				id: 'math',
				label: 'Formula',
				icon: Sigma,
				startsGroup: true,
				run: () => {
					const pos = editor.state.selection.from;
					editor.chain().focus().insertInlineMath({ latex: '' }).run();
					setMathTarget({ latex: '', pos, block: false });
				}
			},
			{
				id: 'link',
				label: 'Collegamento',
				icon: Link2,
				shortcut: 'Control+K',
				run: () => {
					const href = window.prompt('Indirizzo del collegamento');
					if (href === null) return;
					if (!href.trim()) return chain().unsetLink().run();
					chain().setLink({ href: href.trim() }).run();
				},
				isActive: () => editor.isActive('link')
			},
			{ id: 'stickers', label: 'Adesivi', icon: Sticker, startsGroup: true, run: () => setAlbum(true) }
		];
	}, [editor]);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<p id="simple-editor-help" className="sr-only">
				Modalità Semplice. Usa la barra degli strumenti o le scorciatoie: Ctrl+B grassetto, Ctrl+I corsivo. Scrivi il simbolo del dollaro attorno a una formula.
			</p>

			{/* Above the text on a desktop, on the keyboard on a phone (see EditorToolbar). */}
			<EditorToolbar actions={actions} />

			<div className="relative flex min-h-0 flex-1 flex-col">
				<div ref={scroller} className="min-h-0 flex-1 overflow-auto bg-surface-2 px-3 py-4 sm:px-6 sm:py-6">
					<div
						ref={sheet}
						className="note-sheet note-paper relative mx-auto bg-surface shadow-lift"
						style={{ width: SHEET_WIDTH, minHeight: SHEET_MIN_HEIGHT, zoom }}
					>
						<div className="px-11 pb-24 pt-11 lg:pb-16">
							{frozen.length > 0 && (
								<Card tone="warn" className="note-in mb-5 flex items-start gap-3 p-3.5 text-sm">
									<Lock className="mt-0.5 size-4 shrink-0 text-warn-fg" aria-hidden="true" />
									<p className="min-w-0 text-fg-muted">
										{describeFrozen(frozen)} in questa nota {frozen.length === 1 && frozen[0].count === 1 ? 'non si modifica' : 'non si modificano'} qui.{' '}
										<button type="button" onClick={onSwitchToAdvanced} className="rounded font-semibold text-accent-fg underline underline-offset-2 focus-ring">
											Passa ad Avanzata
										</button>
									</p>
								</Card>
							)}
							<EditorContent editor={editor} />
						</div>
						<NoteStickers sheet={sheet} initial={stickers} onChange={onStickersChange} onState={setBoard} ref={stickerControls} />
					</div>
				</div>

				{/* What the hands can do while a sticker is held, and the way out. */}
				{board.holding && (
					<div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center px-3">
						<div className="pointer-events-auto flex max-w-full items-center gap-3 rounded-full border border-edge bg-surface/95 py-1.5 pl-4 pr-1.5 text-sm shadow-lift backdrop-blur-sm">
							<span className="min-w-0 text-fg-muted">
								{board.placing
									? 'Trascina verso la freccia per stenderlo.'
									: coarse
										? 'Tocca l’adesivo per attaccarlo, due dita per girarlo.'
										: 'Clic per attaccarlo, rotella per girarlo.'}
							</span>
							<Button size="sm" variant="secondary" onClick={() => stickerControls.current?.putAway()}>
								Rimetti via
							</Button>
						</div>
					</div>
				)}

				{/* A narrow screen shows the whole sheet small; full size is for writing, scrolling sideways. */}
				{fit < 0.95 && !board.holding && (
					<button
						type="button"
						onClick={() => setFullSize((v) => !v)}
						aria-pressed={fullSize}
						className="absolute right-3 top-3 z-10 rounded-full border border-edge bg-surface/95 px-3 py-1.5 text-xs font-medium text-fg shadow-paper backdrop-blur-sm focus-ring"
					>
						{fullSize ? 'Pagina intera' : 'Ingrandisci'}
					</button>
				)}
			</div>

			<StickerAlbum
				open={album}
				onClose={() => setAlbum(false)}
				onPick={(id) => {
					setAlbum(false);
					stickerControls.current?.pick(id);
				}}
			/>

			<MathPopover
				target={mathTarget}
				katex={katex}
				onSave={(latex) => {
					if (!mathTarget || !editor) return;
					const command = mathTarget.block ? 'updateBlockMath' : 'updateInlineMath';
					editor.chain().focus()[command]({ latex, pos: mathTarget.pos }).run();
					setMathTarget(null);
				}}
				onDelete={() => {
					if (!mathTarget || !editor) return;
					const command = mathTarget.block ? 'deleteBlockMath' : 'deleteInlineMath';
					editor.chain().focus()[command]({ pos: mathTarget.pos }).run();
					setMathTarget(null);
				}}
				onClose={() => setMathTarget(null)}
			/>
		</div>
	);
}
