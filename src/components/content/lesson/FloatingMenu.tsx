'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { contextualMenuPrompts, type Prompt } from '@/lib/data/prompts';
import { cn } from '@/lib/utils/cn';

export interface MenuPosition {
	x: number;
	y: number;
	/** The selection was made with a finger: the menu sits below it, as a two-column grid of large targets. */
	touch: boolean;
}

const MARGIN = 8;

/**
 * The actions offered on a text selection. With a mouse it floats above the
 * selection as one row; on touch it sits below the last selected line (the
 * OS callout takes the space above), kept inside the screen.
 */
export function FloatingMenu({ position, onSelect }: { position: MenuPosition | null; onSelect: (prompt: Prompt) => void }) {
	const box = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	useLayoutEffect(() => {
		if (box.current) setWidth(box.current.offsetWidth);
	}, [position]);
	if (!position) return null;

	const half = width / 2;
	const left = Math.min(Math.max(position.x, MARGIN + half), Math.max(MARGIN + half, window.innerWidth - MARGIN - half));

	// The finger's selection is dropped before `click`, so the choice is taken on pointerdown.
	const choose = (e: React.SyntheticEvent, prompt: Prompt) => {
		e.preventDefault();
		window.getSelection()?.removeAllRanges();
		onSelect(prompt);
	};

	return (
		<div ref={box} className={cn('fixed z-50 max-w-[calc(100vw-16px)] -translate-x-1/2 animate-fade-in', !position.touch && '-translate-y-full')} style={{ top: position.y, left }} role="toolbar" aria-label="Chiedi a Sapiens AI">
			<div className={cn('rounded-2xl border border-accent-edge bg-surface/95 p-1.5 shadow-lg shadow-crimson-500/10 backdrop-blur-lg', position.touch ? 'grid grid-cols-[auto_auto] gap-1' : 'flex items-center gap-1')}>
				{contextualMenuPrompts.map((prompt) => (
					<button
						key={prompt.id}
						type="button"
						onPointerDown={(e) => position.touch && choose(e, prompt)}
						onClick={(e) => !position.touch && choose(e, prompt)}
						className={cn('flex items-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium text-fg transition-colors hover:bg-accent-soft active:bg-accent-soft', position.touch ? 'min-h-[44px] px-3' : 'px-3 py-2')}
					>
						<prompt.icon className="size-4 shrink-0 text-accent-fg" aria-hidden="true" />
						<span>{prompt.label}</span>
					</button>
				))}
			</div>
			<div className={cn('absolute left-1/2 size-3 -translate-x-1/2 rotate-45 border-accent-edge bg-surface', position.touch ? '-top-1.5 border-l border-t' : '-bottom-1.5 border-b border-r')} style={position.touch ? { marginLeft: position.x - left } : undefined} aria-hidden="true" />
		</div>
	);
}
