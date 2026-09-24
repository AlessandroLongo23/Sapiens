'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { PenLine } from 'lucide-react';
import { hasMath } from '@/lib/content/note-markdown';
import { splitPages } from '@/lib/zaino/pages';
import type { Paper } from '@/lib/zaino/paper';
import { SHEET_MIN_HEIGHT, SHEET_WIDTH, type PlacedSticker } from '@/lib/zaino/stickers';
import { effectiveZoom, useNoteView } from '@/lib/state/note-view';
import { useMd } from '@/lib/hooks/use-media';
import { StaticPage, useKatex } from './StaticPage';
import { syncHeading, useOutlineJump } from './OutlinePanel';
import { useSheetFit } from './useSheetFit';
import { useModKey } from './NoteViewControls';

/**
 * Reading a note to review it: the same pages, paper and stickers, with no
 * toolbar, no caret and nothing to edit by mistake. The pages are drawn from
 * the markdown (StaticPage, as the thumbnails and the print copy), so what
 * is read here is what gets printed. The way back to writing is the pill at
 * the bottom, the mode switch, or Ctrl+E.
 */
export function ReadingView({ markdown, stickers, paper, onWrite }: { markdown: string; stickers: PlacedSticker[]; paper: Paper; onWrite: () => void }) {
	const scroller = useRef<HTMLDivElement>(null);
	const pages = useMemo(() => splitPages(markdown), [markdown]);
	const katex = useKatex(hasMath(markdown));
	const md = useMd();
	const mod = useModKey();
	const { zoom: zoomSetting, fit, jump, setPage, setZoom } = useNoteView();
	const zoom = effectiveZoom({ zoom: zoomSetting, fit });
	useSheetFit(scroller, false);
	useOutlineJump(scroller);

	const byPage = useMemo(() => {
		const map = new Map<number, PlacedSticker[]>();
		const last = pages.length - 1;
		for (const s of stickers) {
			const page = Math.min(s.page ?? 0, last);
			map.set(page, [...(map.get(page) ?? []), s]);
		}
		return map;
	}, [stickers, pages.length]);

	const onScroll = useCallback(() => {
		const el = scroller.current;
		if (!el) return;
		const line = el.getBoundingClientRect().top + el.clientHeight / 3;
		let current = 0;
		el.querySelectorAll<HTMLElement>('[data-page-index]').forEach((sheet, i) => {
			if (sheet.getBoundingClientRect().top <= line) current = i;
		});
		if (useNoteView.getState().page !== current) setPage(current);
		syncHeading(el);
	}, [setPage]);

	useEffect(() => {
		const el = scroller.current;
		const sheet = el?.querySelector<HTMLElement>(`[data-page-index="${jump?.page}"]`);
		if (!jump || !el || !sheet) return;
		const top = el.scrollTop + sheet.getBoundingClientRect().top - el.getBoundingClientRect().top - 20;
		el.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
	}, [jump]);

	return (
		<div className="relative flex min-h-0 flex-1 flex-col">
			<div
				ref={scroller}
				onScroll={onScroll}
				// Focusable, so the arrows and the space bar scroll the note once it is clicked or tabbed to.
				tabIndex={0}
				role="region"
				aria-label="Nota in lettura"
				className="min-h-0 flex-1 overflow-auto bg-surface-2 px-3 pb-28 pt-4 outline-none sm:px-8 sm:pt-6"
			>
				<div className="flex flex-col items-center gap-3">
					{pages.map((text, i) => (
						<div key={i} className="flex flex-col items-center gap-2">
							{/* Laid out at full size and zoomed, like the editor's sheets, so the text wraps where it does there. */}
							<div data-page-index={i} style={{ zoom, width: SHEET_WIDTH, minHeight: SHEET_MIN_HEIGHT }}>
								<StaticPage markdown={text} stickers={byPage.get(i) ?? []} paper={paper} katex={katex} className="shadow-lift dark:ring-1 dark:ring-edge-strong" />
							</div>
							<p className="label-mono text-[11px] text-fg-subtle" aria-hidden="true">
								{i + 1} / {pages.length}
							</p>
						</div>
					))}
				</div>
			</div>

			<div data-dock="bottom" className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center gap-2 px-3 pb-safe">
				{/* On a phone the whole page is small: reading, more than writing, needs it at full size. */}
				{!md && fit < 0.95 && (
					<button
						type="button"
						onClick={() => setZoom(zoomSetting === 'fit' ? 1 : 'fit')}
						aria-pressed={zoomSetting !== 'fit'}
						className="pointer-events-auto flex min-h-11 items-center rounded-full border border-edge bg-surface/95 px-4 text-sm font-medium text-fg shadow-lift backdrop-blur-md focus-ring"
					>
						{zoomSetting !== 'fit' ? 'Pagina intera' : 'Ingrandisci'}
					</button>
				)}
				<button
					type="button"
					onClick={onWrite}
					className="tb-tip pointer-events-auto flex min-h-11 items-center gap-2 rounded-full border border-edge bg-surface/95 px-4 text-sm font-medium text-fg shadow-lift backdrop-blur-md transition-colors hover:bg-surface focus-ring"
					data-tip={md ? `${mod} E` : undefined}
				>
					<PenLine className="size-4" aria-hidden="true" />
					Torna a scrivere
				</button>
			</div>
		</div>
	);
}
