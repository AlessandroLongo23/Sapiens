'use client';

import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type Ref } from 'react';
import type { SuggestionProps } from '@tiptap/suggestion';
import { BookOpen, ChartSpline, FilePlus2, Heading1, Heading2, Heading3, Link2, List, ListOrdered, Minus, Pilcrow, Quote, Sigma, SquareSigma, Sticker, type LucideIcon } from 'lucide-react';
import type { SlashId, SlashItem } from '@/lib/zaino/slash-items';
import { cn } from '@/lib/utils/cn';

export interface SlashMenuHandle {
	/** Arrows, Enter and Tab; true when the menu used the key. */
	onKeyDown: (event: KeyboardEvent) => boolean;
}

/** The toolbar's icons, so a command looks the same in both places. */
const ICON: Record<SlashId, LucideIcon> = {
	p: Pilcrow,
	h1: Heading1,
	h2: Heading2,
	h3: Heading3,
	ul: List,
	ol: ListOrdered,
	quote: Quote,
	hr: Minus,
	math: Sigma,
	'block-math': SquareSigma,
	link: Link2,
		sticker: Sticker,
	plot: ChartSpline,
	page: FilePlus2,
	guide: BookOpen
};

export const SLASH_LIST_ID = 'slash-menu';
export const slashOptionId = (i: number) => `slash-option-${i}`;

/**
 * The slash menu's list, under the caret (above it when there is no room),
 * placed by the suggestion plugin's own Floating UI (`mount`). The focus stays
 * in the editor: the menu answers the keys the plugin passes on, and the
 * editor points at the highlighted command with aria-activedescendant. With
 * nothing typed after the slash the commands come in groups; filtered, they
 * come best first.
 */
export function SlashMenu({ suggestion, ref }: { suggestion: SuggestionProps<SlashItem, SlashItem>; ref: Ref<SlashMenuHandle> }) {
	const { items, query, command, mount, editor } = suggestion;
	const [active, setActive] = useState(0);
	const [shownQuery, setShownQuery] = useState(query);
	// A new query starts again from the first, best match.
	if (shownQuery !== query) {
		setShownQuery(query);
		setActive(0);
	}
	const current = Math.min(active, Math.max(0, items.length - 1));
	const box = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!box.current) return;
		return mount(box.current);
	}, [mount]);

	// The editor names the list and the highlighted command, for a screen reader.
	useEffect(() => {
		const dom = editor.view.dom;
		dom.setAttribute('aria-controls', SLASH_LIST_ID);
		if (items.length) dom.setAttribute('aria-activedescendant', slashOptionId(current));
		else dom.removeAttribute('aria-activedescendant');
		return () => {
			dom.removeAttribute('aria-controls');
			dom.removeAttribute('aria-activedescendant');
		};
	}, [editor, items.length, current]);

	// The highlighted command stays in sight. Only the list scrolls: scrollIntoView would move the sheet under the caret too.
	useEffect(() => {
		const list = box.current?.querySelector<HTMLElement>('[role="listbox"]');
		const option = list?.querySelector<HTMLElement>(`#${slashOptionId(current)}`);
		if (!list || !option) return;
		if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop - 6;
		else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight + 6;
	}, [current]);

	useImperativeHandle(ref, () => ({
		onKeyDown: (event) => {
			if (!items.length) return false;
			if (event.key === 'ArrowDown') {
				setActive((current + 1) % items.length);
				return true;
			}
			if (event.key === 'ArrowUp') {
				setActive((current - 1 + items.length) % items.length);
				return true;
			}
			if (event.key === 'Enter' || event.key === 'Tab') {
				command(items[current]);
				return true;
			}
			return false;
		}
	}));

	const grouped = !query;
	return (
		<div
			ref={box}
			className="fixed left-0 top-0 z-50 w-72 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-edge bg-surface text-fg shadow-2xl animate-fade-in"
			// The editor keeps the focus and the caret: a click here never takes them.
			onMouseDown={(e) => e.preventDefault()}
		>
			{items.length === 0 ? (
				<p className="px-3 py-2.5 text-sm text-fg-muted">Nessun comando per “{query}”</p>
			) : (
				<ul id={SLASH_LIST_ID} role="listbox" aria-label="Comandi" className="max-h-80 overflow-y-auto p-1.5">
					{items.map((item, i) => {
						const Icon = ICON[item.id];
						const heading = grouped && (i === 0 || items[i - 1].group !== item.group);
						return (
							<li key={item.id} role="presentation">
								{heading && (
									<p className={cn('label-mono px-2 pb-1 text-[11px] text-fg-subtle', i > 0 ? 'pt-2.5' : 'pt-1')} aria-hidden="true">
										{item.group}
									</p>
								)}
								<div
									id={slashOptionId(i)}
									role="option"
									aria-selected={i === current}
									onMouseMove={() => i !== current && setActive(i)}
									onClick={() => command(item)}
									className={cn('flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5', i === current && 'bg-surface-3')}
								>
									<span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-edge-soft bg-surface-2 text-fg-muted" aria-hidden="true">
										<Icon className="size-4" />
									</span>
									<span className="min-w-0 flex-1">
										<span className="block truncate text-sm font-medium text-fg">{item.title}</span>
										<span className="block truncate text-xs text-fg-subtle">{item.description}</span>
									</span>
									{item.hint && (
										<kbd className="shrink-0 rounded border border-edge-soft px-1.5 font-mono text-[11px] text-fg-subtle" title={`Scorciatoia mentre scrivi: ${item.hint}`}>
											{item.hint}
										</kbd>
									)}
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
