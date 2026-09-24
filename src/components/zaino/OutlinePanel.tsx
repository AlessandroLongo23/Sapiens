'use client';

import { useDeferredValue, useEffect, useMemo, useRef, type RefObject } from 'react';
import { ListTree, X } from 'lucide-react';
import { outline } from '@/lib/zaino/outline';
import { headingAt, headingInView, scrollToHeading } from '@/lib/zaino/outline-dom';
import { useNoteView } from '@/lib/state/note-view';
import { cn } from '@/lib/utils/cn';

/**
 * Scrolls a view to the title picked in the outline, or back to where the
 * reader was before a change of mode. A view that has just mounted may not
 * have drawn its pages yet (the Simple editor builds them after mounting), so
 * it tries for a few frames. The request is used once, so a view mounted
 * later never replays it. `onArrive` gets the heading element, for the Simple
 * editor to put the caret there.
 */
export function useOutlineJump(scroller: RefObject<HTMLElement | null>, onArrive?: (heading: HTMLElement) => void) {
	const jump = useNoteView((s) => s.headingJump);
	const arrive = useRef(onArrive);
	useEffect(() => {
		arrive.current = onArrive;
	});
	// A view just opened marks its title before any scroll: once laid out, and again once the formulas are in.
	useEffect(() => {
		const early = setTimeout(() => syncHeading(scroller.current), 250);
		const late = setTimeout(() => syncHeading(scroller.current), 1200);
		return () => {
			clearTimeout(early);
			clearTimeout(late);
		};
	}, [scroller]);
	useEffect(() => {
		if (!jump) return;
		let tries = 0;
		let frame = 0;
		const attempt = () => {
			const el = scroller.current;
			if (el && scrollToHeading(el, jump.page, jump.index, jump.instant)) {
				useNoteView.getState().clearHeadingJump();
				const heading = jump.index >= 0 && !jump.instant ? headingAt(el, jump.page, jump.index) : null;
				if (heading) arrive.current?.(heading);
				return;
			}
			if (++tries < 60) frame = requestAnimationFrame(attempt);
		};
		attempt();
		return () => cancelAnimationFrame(frame);
	}, [jump, scroller]);
}

/** Reports the title being read, for the outline to mark; a view calls it as it scrolls. */
export function syncHeading(scroller: HTMLElement | null) {
	if (!scroller) return;
	const found = headingInView(scroller);
	const current = useNoteView.getState().heading;
	if (found?.page !== current?.page || found?.index !== current?.index) useNoteView.getState().setHeading(found);
}

/** Indent per level, as in a book's table of contents. */
const INDENT: Record<1 | 2 | 3, string> = { 1: 'pl-3', 2: 'pl-7', 3: 'pl-11' };

/**
 * The note's titles, nested by level (Titolo, Sottotitolo, Titoletto), left of
 * the sheet: the map of the note while writing and while reviewing. A title
 * leads to its place; the one being read is marked with the red stroke the
 * lessons' table of contents uses. A page break starts a new group.
 */
export function OutlinePanel({ markdown, layout, onClose }: { markdown: string; layout: 'column' | 'sheet'; onClose: () => void }) {
	const deferred = useDeferredValue(markdown);
	const entries = useMemo(() => outline(deferred), [deferred]);
	const { heading, jumpToHeading } = useNoteView();
	const groups = useMemo(() => {
		const byPage = new Map<number, typeof entries>();
		for (const e of entries) byPage.set(e.page, [...(byPage.get(e.page) ?? []), e]);
		return [...byPage].map(([page, items]) => ({ page, items }));
	}, [entries]);
	const pages = groups.length;

	return (
		<nav aria-label="Indice della nota" className={cn('flex min-h-0 flex-col', layout === 'column' && 'h-full')}>
			{layout === 'column' && (
				<div className="flex h-12 shrink-0 items-center justify-between border-b border-edge-soft pl-4 pr-2">
					<h2 className="font-sans text-sm font-semibold text-fg-strong">Indice</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label="Chiudi l’indice"
						className="flex size-9 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring"
					>
						<X className="size-4" aria-hidden="true" />
					</button>
				</div>
			)}

			{entries.length === 0 ? (
				<div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
					<ListTree className="size-6 text-fg-faint" aria-hidden="true" />
					<p className="text-sm leading-relaxed text-fg-muted">
						Nessun titolo ancora. Usa Titolo, Sottotitolo e Titoletto nella barra degli strumenti e l’indice si scrive da solo.
					</p>
				</div>
			) : (
				<div className={cn('min-h-0 flex-1 overflow-y-auto py-3', layout === 'column' ? 'no-scrollbar px-2' : '-mx-2')}>
					{groups.map(({ page, items }, g) => (
						// One list per page, named by its label, so a screen reader hears where each page begins.
						<section key={page} aria-labelledby={pages > 1 ? `outline-page-${page}` : undefined} className={cn(g > 0 && 'mt-3 border-t border-edge-soft pt-3')}>
							{pages > 1 && (
								<h3 id={`outline-page-${page}`} className="label-mono px-3 pb-1 text-[11px] font-normal text-fg-subtle">
									Pagina {page + 1}
								</h3>
							)}
							<ol>
								{items.map((entry) => {
									const current = heading?.page === entry.page && heading?.index === entry.index;
									return (
										<li key={entry.index}>
											<button
												type="button"
												onClick={() => {
													jumpToHeading(entry.page, entry.index);
													if (layout === 'sheet') onClose();
												}}
												aria-current={current ? 'location' : undefined}
												className={cn(
													'relative flex min-h-9 w-full items-center rounded-lg py-1.5 pr-2 text-left leading-snug transition-colors focus-ring',
													INDENT[entry.level],
													entry.level === 1 ? 'font-display text-[15px] font-semibold' : entry.level === 2 ? 'text-sm font-medium' : 'text-sm',
													current ? 'bg-accent-soft text-accent-soft-fg' : entry.level === 3 ? 'text-fg-muted hover:bg-surface-3 hover:text-fg' : 'text-fg hover:bg-surface-3'
												)}
											>
												{/* The guide line that shows the nesting, and the red stroke on the title being read. */}
												{entry.level > 1 && <span className={cn('absolute inset-y-1 w-px bg-edge', entry.level === 2 ? 'left-4' : 'left-8')} aria-hidden="true" />}
												{current && <span className="absolute inset-y-1.5 left-0.5 w-0.5 rounded-full bg-accent" aria-hidden="true" />}
												<span className="line-clamp-2">{entry.text}</span>
											</button>
										</li>
									);
								})}
							</ol>
						</section>
					))}
				</div>
			)}
		</nav>
	);
}
