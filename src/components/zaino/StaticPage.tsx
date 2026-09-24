'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import type katexType from 'katex';
import { hasMath, renderNoteMarkdown } from '@/lib/content/note-markdown';
import { paperData, paperStyle, paperTone, type Paper } from '@/lib/zaino/paper';
import { SHEET_MIN_HEIGHT, SHEET_WIDTH, STICKER_BY_ID, stickerArt, type PlacedSticker } from '@/lib/zaino/stickers';
import { cn } from '@/lib/utils/cn';
import './stickers.css';

type Katex = typeof katexType;
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
	className
}: {
	markdown: string;
	stickers: PlacedSticker[];
	paper: Paper;
	katex: Katex | null;
	className?: string;
}) {
	const html = useMemo(() => renderNoteMarkdown(markdown, hasMath(markdown) ? katex : null), [markdown, katex]);
	const tone = paperTone(paper.color);
	return (
		<div
			{...paperData(paper)}
			className={cn('note-sheet note-paper note-lined relative overflow-hidden bg-surface', tone && `paper-${tone}`, className)}
			style={{ ...paperStyle(paper), width: SHEET_WIDTH, minHeight: SHEET_MIN_HEIGHT }}
		>
			<div className="px-[calc(2*var(--row))] pt-[calc(2*var(--row))] pb-16">
				<div className="markdown-content note-body" dangerouslySetInnerHTML={{ __html: html }} />
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
							transform: `translate(-50%, -50%) rotate(${s.r}deg)`,
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
