'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ListTree } from 'lucide-react';
import type { TocSection } from '@/lib/content/markdown';
import { useLessonLayout } from '@/lib/state/lesson-layout';
import { cn } from '@/lib/utils/cn';
import { Html } from '@/components/ui/Html';

/**
 * The lesson's table of contents. `touch` renders the rows tall enough for
 * a finger (in the phone sheet); the desktop column keeps them dense.
 * Selecting a row asks the body to scroll there.
 */
export function TableOfContents({ sections, touch = false }: { sections: TocSection[]; touch?: boolean }) {
	const activeSection = useLessonLayout((s) => s.activeSection);
	const jumpTo = useLessonLayout((s) => s.jumpTo);
	const setSections = useLessonLayout((s) => s.setSections);
	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
	const list = useRef<HTMLDivElement>(null);

	// The desktop column shares the outline with the assistant beside the lesson.
	useEffect(() => {
		if (touch) return;
		setSections(sections);
		return () => setSections([]);
	}, [touch, sections, setSections]);

	// In the sheet, open on the section being read.
	useEffect(() => {
		if (touch && activeSection) list.current?.querySelector(`[data-section="${activeSection}"]`)?.scrollIntoView({ block: 'center' });
	}, [touch, activeSection]);

	const row = (active: boolean, depth: number) =>
		cn(
			'flex flex-1 items-center text-left transition-colors focus-ring',
			touch ? (depth === 0 ? 'min-h-[44px] rounded-xl px-2 text-base' : depth === 1 ? 'min-h-[40px] rounded-xl px-2 text-sm' : 'min-h-[36px] rounded-lg px-2 text-sm') : depth === 0 ? 'rounded py-1 text-sm' : 'rounded py-0.5 text-xs',
			active ? (touch ? 'bg-accent-soft text-accent-soft-fg' : 'text-fg-strong') : 'text-fg-subtle hover:text-fg',
			touch && !active && 'active:bg-surface-3'
		);

	const render = (items: TocSection[], depth: number) =>
		items.map((section, index) => {
			const open = !collapsed[section.id];
			const active = activeSection === section.id;
			return (
				<div key={section.id} className={cn('relative', depth === 0 ? (touch ? 'mb-1' : 'mb-3') : touch ? 'my-0.5' : 'my-1.5')}>
					{/* On the desktop column, a stroke of red pen marks the section being read. */}
					{!touch && active && <span className="absolute -left-3 top-1 h-[1.1em] w-[3px] rounded-full bg-accent" aria-hidden="true" />}
					<div className="flex items-center">
						<button type="button" data-section={section.id} aria-current={active ? 'location' : undefined} onClick={() => jumpTo(section.id)} className={cn(row(active, depth), depth === 0 ? 'font-semibold' : 'font-medium')}>
							{depth === 0 && <span className={cn('mr-2.5 shrink-0 self-start font-mono text-[0.6875rem] font-medium leading-5 tabular-nums', active ? 'text-tint-fg' : 'text-fg-faint')}>{String(index + 1).padStart(2, '0')}</span>}
							<Html as="span" html={section.titleHtml} className="math-inline" />
						</button>
						{section.subsections.length > 0 && (
							<button type="button" onClick={() => setCollapsed({ ...collapsed, [section.id]: open })} aria-label={open ? 'Chiudi la sezione' : 'Apri la sezione'} aria-expanded={open} className={cn('text-fg-faint transition-colors hover:text-fg-muted', touch ? 'flex size-[40px] items-center justify-center rounded-lg hover:bg-surface-3' : 'flex size-6 items-center justify-center rounded-md hover:bg-surface-3')}>
								<ChevronDown size={touch ? 18 - depth * 2 : 14 - depth * 2} className={cn('transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
							</button>
						)}
					</div>
					{section.subsections.length > 0 && open && <div className={cn('mt-1 border-l border-edge pl-2', depth === 0 ? 'ml-3' : 'ml-2')}>{render(section.subsections, depth + 1)}</div>}
				</div>
			);
		});

	return (
		<div className={cn('flex w-full flex-col', touch ? 'h-full' : 'min-h-0 flex-1')}>
			{/* The column's label, on the lesson header's row; the assistant's mirrors it. */}
			{!touch && (
				<p className="label-mono mx-8 flex h-11 shrink-0 items-center gap-2 border-b border-edge-soft text-fg-faint">
					<ListTree className="size-3.5" aria-hidden="true" />
					Indice
				</p>
			)}
			<div ref={list} className={cn('no-scrollbar flex-1 overflow-y-auto', touch ? 'px-3 py-2' : 'px-8 py-5')}>
				{render(sections, 0)}
			</div>
		</div>
	);
}
