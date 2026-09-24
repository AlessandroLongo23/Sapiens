'use client';

import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { focusSearchTrigger, useSearch } from '@/lib/state/search';
import { cn } from '@/lib/utils/cn';

/**
 * The search box. Typing, clicking, Enter or the down arrow opens the overlay
 * (never a mere focus, so tabbing through the header has no side effects);
 * Ctrl/Cmd+K toggles it, Escape clears it. The overlay's own copy takes
 * focus as soon as it opens (phones only show the keyboard for a focus that
 * follows a tap closely).
 */
export function SearchField({ id, placeholder = 'Cerca', size = 'md', autoFocus = false, closeOnBlur = true, className }: { id?: string; placeholder?: string; size?: 'md' | 'lg'; autoFocus?: boolean; closeOnBlur?: boolean; className?: string }) {
	const { query, isActive, setQuery, activate, deactivate, clear } = useSearch();
	const input = useRef<HTMLInputElement>(null);
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
			<Search className={cn('absolute text-fg-faint', lg ? 'left-3 size-6' : 'left-2 size-5')} aria-hidden="true" />
			<input
				ref={input}
				id={id}
				type="text"
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
				className={cn('w-full rounded-lg border border-edge bg-surface text-fg outline-none transition-all placeholder:text-fg-faint focus:border-edge-strong', lg ? 'h-12 py-3 pl-12 pr-10 text-base' : 'h-10 py-2 pl-9 pr-8 text-sm')}
			/>
			{query && (
				<button type="button" onClick={() => { setQuery(''); focus(); }} className={cn('absolute rounded-md p-1 text-fg-faint hover:text-fg-muted', lg ? 'right-3' : 'right-2')} aria-label="Cancella la ricerca">
					<X className={lg ? 'size-5' : 'size-4'} aria-hidden="true" />
				</button>
			)}
		</div>
	);
}
