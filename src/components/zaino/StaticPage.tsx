'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { createRoot, type Root } from 'react-dom/client';
import { decodeState } from '@/lib/grafico/documento';
import type katexType from 'katex';
import { hasMath, renderNoteMarkdown } from '@/lib/content/note-markdown';
import { paperData, paperStyle, paperTone, type Paper } from '@/lib/zaino/paper';
import { SHEET_MIN_HEIGHT, SHEET_WIDTH, STICKER_BY_ID, stickerArt, type PlacedSticker } from '@/lib/zaino/stickers';
import { cn } from '@/lib/utils/cn';
import './stickers.css';
import './zaino.css';

type Katex = typeof katexType;

// The plotter arrives only for a page that has a graph and is read at full size.
const Plotter = dynamic(() => import('@/components/grafico/Plotter').then((m) => m.Plotter), { ssr: false });
let katexPromise: Promise<Katex> | null = null;

/** KaTeX, loaded the first time a page with a formula is drawn. */
export function useKatex(needed: boolean): Katex | null {
	const [katex, setKatex] = useState<Katex | null>(null);
	useEffect(() => {
		if (!needed || katex) return;
		let live = true;
		(katexPromise ??= import('katex').then((m) => m.default)).then((k) => live && setKatex(k));
		return () => {
			live = false;
		};
	}, [needed, katex]);
	return katex;
}

/**
 * One page of a note, drawn from its markdown and not editable: the page
 * thumbnails and the print copy. The same sheet, paper and padding as the
 * editor's page, so a thumbnail is the page itself, only smaller.
 */
export const StaticPage = memo(function StaticPage({
	markdown,
	stickers,
	paper,
		katex,
	live = false,
	className
}: {
	markdown: string;
	stickers: PlacedSticker[];
	paper: Paper;
		katex: Katex | null;
	/** Draws the graphs of the page on their planes, to look at and to move. A thumbnail leaves them as boxes. */
	live?: boolean;
	className?: string;
}) {
	const html = useMemo(() => renderNoteMarkdown(markdown, hasMath(markdown) ? katex : null), [markdown, katex]);
	const body = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!live || !body.current) return;
		const roots: { root: Root; holder: HTMLElement }[] = [];
		body.current.querySelectorAll<HTMLElement>('.note-plot-static[data-plot]').forEach((box) => {
			const state = decodeState(box.dataset.plot ?? '');
			if (!state) return;
			// a holder of its own for each drawing: the box outlives it, and a root is made once per container
			const holder = document.createElement('div');
			holder.style.height = '100%';
			box.replaceChildren(holder);
			box.classList.add('is-live');
			const root = createRoot(holder);
			root.render(<Plotter view initial={state} read={[]} />);
			roots.push({ root, holder });
		});
		// after this render is over: a root cannot be taken down while React is rendering
		return () =>
			void setTimeout(() => {
				for (const { root, holder } of roots) {
					root.unmount();
					holder.remove();
				}
			}, 0);
	}, [html, live]);
	const tone = paperTone(paper.color);
	return (
		<div
			{...paperData(paper)}
			className={cn('note-sheet note-paper note-lined relative overflow-hidden bg-surface', tone && `paper-${tone}`, className)}
			style={{ ...paperStyle(paper), width: SHEET_WIDTH, minHeight: SHEET_MIN_HEIGHT }}
		>
			<div className="px-[calc(2*var(--row))] pt-[calc(2*var(--row))] pb-16">
				<div ref={body} className="markdown-content note-body" dangerouslySetInnerHTML={{ __html: html }} />
			</div>
			{stickers.map((s) => {
				const d = STICKER_BY_ID.get(s.sticker);
				if (!d) return null;
				return (
					<span
						key={s.id}
						aria-hidden="true"
						className="absolute"
						style={{
							left: s.x,
							top: s.y,
							width: d.w,
							height: d.h,
							['--r' as string]: `${d.r}px`,
							transform: `translate(-50%, -50%) rotate(${s.r}deg) scale(${s.s ?? 1})`,
							filter: 'drop-shadow(0 1px 1.5px rgb(30 18 8 / 0.25))'
						}}
						// Static artwork from lib/zaino/stickers, never user input.
						dangerouslySetInnerHTML={{ __html: stickerArt(d) }}
					/>
				);
			})}
		</div>
	);
});
