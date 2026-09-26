'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { Search, X } from 'lucide-react';
import { focusSearchTrigger, useSearch } from '@/lib/state/search';
import { cn } from '@/lib/utils/cn';
import { PenStroke } from '@/components/content/PageHeader';

const noop = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform);

/**
 * The search box. Typing, clicking, Enter or the down arrow opens the overlay
 * (never a mere focus, so tabbing through the header has no side effects);
 * Ctrl/Cmd+K toggles it, Escape clears it. The overlay's own copy takes
 * focus as soon as it opens (phones only show the keyboard for a focus that
 * follows a tap closely).
 *
 * In the header it is a small box with the shortcut in it. In the overlay
 * (`size="lg"`) it is a line written on the page: the query in the display
 * serif, underlined by a red pen stroke that draws itself as the search opens.
 * There it is a combobox over the results list (`controls`), with the row
 * picked by the arrow keys named in `activeDescendant`.
 */
export function SearchField({
	id,
	placeholder = 'Cerca',
	size = 'md',
	autoFocus = false,
	closeOnBlur = true,
	controls,
	activeDescendant,
	className
}: {
	id?: string;
	placeholder?: string;
	size?: 'md' | 'lg';
	autoFocus?: boolean;
	closeOnBlur?: boolean;
	controls?: string;
	activeDescendant?: string;
	className?: string;
}) {
	const { query, isActive, setQuery, activate, deactivate, clear } = useSearch();
	const input = useRef<HTMLInputElement>(null);
	const apple = useSyncExternalStore(noop, isApple, () => true);
	const focus = () => {
		input.current?.focus();
		requestAnimationFrame(() => input.current?.focus());
	};

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			// A page that uses the key itself (the note editor's links) has already taken it.
			if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !e.defaultPrevented) {
				e.preventDefault();
				if (isActive) {
					deactivate();
					input.current?.blur();
				} else {
					activate();
					focus();
				}
			}
			if (e.key === 'Escape') {
				clear();
				input.current?.blur();
				if (autoFocus) focusSearchTrigger();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [isActive, activate, deactivate, clear, autoFocus]);

	useEffect(() => {
		if (autoFocus && isActive) focus();
	}, [autoFocus, isActive]);

	const lg = size === 'lg';
	return (
		<div className={cn('relative flex items-center', className)}>
			<Search className={cn('pointer-events-none absolute', lg ? 'left-0 size-6 text-fg-subtle md:size-7' : 'left-2.5 size-[18px] text-fg-faint')} strokeWidth={lg ? 1.75 : 2} aria-hidden="true" />
			<input
				ref={input}
				id={id}
				type="search"
				enterKeyHint="search"
				autoComplete="off"
				spellCheck={false}
				placeholder={placeholder}
				value={query}
				onChange={(e) => {
					setQuery(e.target.value);
					if (!isActive) activate();
				}}
				onClick={() => !isActive && activate()}
				onKeyDown={(e) => (e.key === 'Enter' || e.key === 'ArrowDown') && !isActive && activate()}
				onBlur={() => closeOnBlur && deactivate()}
				aria-label={placeholder}
				role={controls ? 'combobox' : undefined}
				aria-controls={controls}
				aria-expanded={controls ? true : undefined}
				aria-autocomplete={controls ? 'list' : undefined}
				aria-activedescendant={activeDescendant}
				className={cn(
					'w-full text-fg outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:shadow-none transition-[border-color,background-color] [&::-webkit-search-cancel-button]:hidden',
					lg
						? 'border-0 bg-transparent pb-3 pl-9 pr-10 pt-1 font-display text-2xl font-medium tracking-tight text-fg-strong placeholder:font-normal placeholder:italic placeholder:text-fg-faint md:pl-12 md:text-[2rem]'
						: 'h-10 rounded-xl border border-edge bg-surface py-2 pl-9 pr-14 text-sm shadow-paper placeholder:text-fg-faint hover:border-edge-strong focus:border-edge-strong'
				)}
			/>
			{lg && (
				<>
					<span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-edge" aria-hidden="true" />
					<PenStroke className="absolute inset-x-0 -bottom-1 h-2.5" />
				</>
			)}
			{query ? (
				<button
					type="button"
					onClick={() => {
						setQuery('');
						focus();
					}}
					className={cn('absolute grid place-items-center rounded-full text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg focus-ring', lg ? 'right-0 size-9' : 'right-1.5 size-7')}
					aria-label="Cancella la ricerca"
				>
					<X className={lg ? 'size-5' : 'size-4'} aria-hidden="true" />
				</button>
			) : (
				!lg && (
					<kbd className="label-mono pointer-events-none absolute right-2 rounded-md border border-edge bg-surface-2 px-1.5 py-0.5 text-[0.625rem] tracking-normal text-fg-subtle" aria-hidden="true">
						{apple ? '⌘ K' : 'Ctrl K'}
					</kbd>
				)
			)}
		</div>
	);
}
