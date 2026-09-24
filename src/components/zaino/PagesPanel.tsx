'use client';

import { memo, useDeferredValue, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Copy, MoreHorizontal, Plus, Trash2, X } from 'lucide-react';
import { hasMath } from '@/lib/content/note-markdown';
import { MAX_PAGES, splitPages, type PageOp } from '@/lib/zaino/pages';
import type { Paper } from '@/lib/zaino/paper';
import { SHEET_MIN_HEIGHT, SHEET_WIDTH, type PlacedSticker } from '@/lib/zaino/stickers';
import { useNoteView } from '@/lib/state/note-view';
import { useCoarsePointer } from '@/lib/hooks/use-media';
import { cn } from '@/lib/utils/cn';
import { MenuItem, MenuSeparator, Popover } from './Popover';
import { StaticPage, useKatex } from './StaticPage';

const THUMB = 152;
const SCALE = THUMB / SHEET_WIDTH;

/**
 * The note's pages as thumbnails, as in Notability and GoodNotes: a column
 * beside the sheet on a wide screen, a grid in a sheet on a phone (`layout`).
 * A tap goes to the page; the ⋯ of each adds a page after it, duplicates it,
 * moves it or deletes it; on a wide screen a thumbnail can also be dragged.
 * The thumbnails are drawn from the markdown, a beat behind the typing.
 */
export function PagesPanel({
	markdown,
	stickers,
	paper,
	layout,
	readOnly = false,
	onOp,
	onClose
}: {
	/** Reading mode: the thumbnails lead to their pages and change nothing. */
	readOnly?: boolean;
	markdown: string;
	stickers: PlacedSticker[];
	paper: Paper;
	layout: 'column' | 'grid';
	onOp: (op: PageOp) => void;
	onClose: () => void;
}) {
	const deferred = useDeferredValue(markdown);
	const pages = useMemo(() => splitPages(deferred), [deferred]);
	const katex = useKatex(hasMath(deferred));
	const { page: current, jumpTo } = useNoteView();
	const [menu, setMenu] = useState<number | null>(null);
	const coarse = useCoarsePointer();
	// In the column the menu is fixed beside the thumbnail, or the scrolling list would cut it off.
	const [menuAt, setMenuAt] = useState<{ x: number; y: number } | undefined>(undefined);
	const [dragging, setDragging] = useState<number | null>(null);
	const [drop, setDrop] = useState<number | null>(null);

	const byPage = useMemo(() => {
		const map = new Map<number, PlacedSticker[]>();
		const last = pages.length - 1;
		for (const s of stickers) {
			const page = Math.min(s.page ?? 0, last);
			map.set(page, [...(map.get(page) ?? []), s]);
		}
		return map;
	}, [stickers, pages.length]);

	const finishDrag = () => {
		if (dragging !== null && drop !== null) {
			const to = drop > dragging ? drop - 1 : drop;
			if (to !== dragging) onOp({ kind: 'move', from: dragging, to });
		}
		setDragging(null);
		setDrop(null);
	};

	const column = layout === 'column';
	return (
		<div className={cn('flex min-h-0 flex-col', column && 'h-full')}>
			{column && (
				<div className="flex h-12 shrink-0 items-center justify-between border-b border-edge-soft pl-4 pr-2">
					<h2 className="font-sans text-sm font-semibold text-fg-strong">
						Pagine <span className="label-mono ml-1 text-[11px] font-normal text-fg-subtle">{pages.length}</span>
					</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label="Chiudi le pagine"
						className="flex size-9 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring"
					>
						<X className="size-4" aria-hidden="true" />
					</button>
				</div>
			)}

			<ol
				aria-label="Pagine della nota"
				className={cn(column ? 'no-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4' : 'grid grid-cols-2 justify-items-center gap-x-3 gap-y-4 px-1 pt-2 sm:grid-cols-3')}
				onDragOver={(e) => column && dragging !== null && e.preventDefault()}
				onDrop={(e) => {
					e.preventDefault();
					finishDrag();
				}}
			>
				{pages.map((text, i) => (
					<li
						key={i}
						draggable={column && !readOnly}
						onDragStart={(e) => {
							setDragging(i);
							e.dataTransfer.effectAllowed = 'move';
							e.dataTransfer.setData('text/plain', String(i));
						}}
						onDragEnd={() => {
							setDragging(null);
							setDrop(null);
						}}
						onDragOver={(e) => {
							if (dragging === null) return;
							e.preventDefault();
							const box = e.currentTarget.getBoundingClientRect();
							setDrop(e.clientY < box.top + box.height / 2 ? i : i + 1);
						}}
						className={cn('relative flex flex-col items-center', column && 'py-1.5', dragging === i && 'opacity-40')}
					>
						{column && drop === i && dragging !== null && <DropLine top />}
						<div className="group relative">
							<button
								type="button"
								onClick={() => {
									jumpTo(i);
									if (!column) onClose();
								}}
								aria-label={`Pagina ${i + 1}${i === current ? ', in vista' : ''}`}
								aria-current={i === current ? 'page' : undefined}
								className={cn(
									'block overflow-hidden rounded-md bg-surface text-left shadow-paper ring-offset-2 ring-offset-surface-2 transition focus-ring-offset',
									i === current ? 'ring-2 ring-accent' : 'ring-1 ring-edge hover:ring-edge-strong'
								)}
								style={{
									width: THUMB,
									aspectRatio: `${SHEET_WIDTH} / ${SHEET_MIN_HEIGHT}`
								}}
							>
								<Thumb markdown={text} stickers={byPage.get(i) ?? []} paper={paper} katex={katex} />
							</button>
							{!readOnly && (
								<div className="absolute right-1 top-1">
									<button
										type="button"
										onClick={(e) => {
											const box = e.currentTarget.getBoundingClientRect();
											// The column is on the right of the screen: the menu opens towards the sheet.
											setMenuAt(
												column
													? {
															x: box.left - 232,
															y: Math.min(box.top, window.innerHeight - 280)
														}
													: undefined
											);
											setMenu(menu === i ? null : i);
										}}
										aria-label={`Azioni per la pagina ${i + 1}`}
										aria-haspopup="menu"
										aria-expanded={menu === i}
										className={cn(
											'flex items-center justify-center rounded-lg border border-edge bg-surface/95 text-fg-muted shadow-paper transition hover:text-fg focus-ring',
											coarse ? 'size-10' : 'size-8',
											// Shown on hover where there is hover; always where there is none (tablets, phones).
											menu !== i && '[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100'
										)}
									>
										<MoreHorizontal className="size-4" aria-hidden="true" />
									</button>
									<Popover open={menu === i} onClose={() => setMenu(null)} label={`Pagina ${i + 1}`} role="menu" className="w-56" at={menuAt}>
										<MenuItem
											icon={Plus}
											disabled={pages.length >= MAX_PAGES}
											onSelect={() => {
												setMenu(null);
												onOp({ kind: 'add', at: i + 1 });
											}}
										>
											Nuova pagina dopo
										</MenuItem>
										<MenuItem
											icon={Copy}
											disabled={pages.length >= MAX_PAGES}
											onSelect={() => {
												setMenu(null);
												onOp({ kind: 'duplicate', index: i });
											}}
										>
											Duplica
										</MenuItem>
										<MenuItem
											icon={ArrowUp}
											disabled={i === 0}
											onSelect={() => {
												setMenu(null);
												onOp({ kind: 'move', from: i, to: i - 1 });
											}}
										>
											Sposta su
										</MenuItem>
										<MenuItem
											icon={ArrowDown}
											disabled={i === pages.length - 1}
											onSelect={() => {
												setMenu(null);
												onOp({ kind: 'move', from: i, to: i + 1 });
											}}
										>
											Sposta giù
										</MenuItem>
										<MenuSeparator />
										<MenuItem
											icon={Trash2}
											danger
											disabled={pages.length <= 1}
											onSelect={() => {
												setMenu(null);
												onOp({ kind: 'delete', index: i });
											}}
										>
											Elimina la pagina
										</MenuItem>
									</Popover>
								</div>
							)}
						</div>
						<span className={cn('label-mono mt-1.5 text-xs', i === current ? 'font-semibold text-accent-fg' : 'text-fg-muted')} aria-hidden="true">
							{i + 1}
						</span>
						{column && drop === i + 1 && i === pages.length - 1 && dragging !== null && <DropLine />}
					</li>
				))}
			</ol>

			{!readOnly && (
				<div className={cn('shrink-0', column ? 'border-t border-edge-soft p-3' : 'pt-5')}>
					<button
						type="button"
						disabled={pages.length >= MAX_PAGES}
						onClick={() => {
							onOp({ kind: 'add', at: pages.length });
							if (!column) onClose();
						}}
						className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-edge-strong text-sm font-medium text-fg-muted transition-colors hover:border-accent hover:text-accent-fg focus-ring disabled:opacity-40"
					>
						<Plus className="size-4" aria-hidden="true" />
						Nuova pagina
					</button>
				</div>
			)}
		</div>
	);
}

const DropLine = ({ top = false }: { top?: boolean }) => (
	<span className={cn('pointer-events-none absolute inset-x-4 h-0.5 rounded-full bg-accent', top ? '-top-0.5' : '-bottom-0.5')} aria-hidden="true" />
);

/** A page at thumbnail scale; memoised so typing on one page redraws only that thumbnail. */
const Thumb = memo(function Thumb({ markdown, stickers, paper, katex }: { markdown: string; stickers: PlacedSticker[]; paper: Paper; katex: ReturnType<typeof useKatex> }) {
	return (
		<div aria-hidden="true" className="pointer-events-none origin-top-left" style={{ zoom: SCALE }} inert>
			<StaticPage markdown={markdown} stickers={stickers} paper={paper} katex={katex} className="shadow-none" />
		</div>
	);
});
